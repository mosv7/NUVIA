const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const fs = require('node:fs');
const path = require('node:path');
const { MongoMemoryReplSet } = require('mongodb-memory-server-core');
const {
  Business,
  Branch,
  Survey,
  Questions: Question,
  QuestionOptions: Option,
} = require('../src/models');
const Response = require('../src/models/customerResponse.model');
const Counter = require('../src/models/counter.model');
const publicSurvey = require('../src/services/publicSurvey.service');
const responses = require('../src/services/response.service');
const surveys = require('../src/services/survey.service');
const questions = require('../src/services/question.service');
const branches = require('../src/services/branch.service');
let replica;
before(async () => {
  const candidate = path.resolve(__dirname, '../../.local/tools/mongod.exe');
  replica = await MongoMemoryReplSet.create({
    binary: { version: '7.0.24', ...(fs.existsSync(candidate) ? { systemBinary: candidate } : {}) },
    replSet: { count: 1 },
  });
  await mongoose.connect(replica.getUri(), { dbName: 'isolated_response_tests' });
  await Promise.all(
    [...Object.values(require('../src/models')), Response, Counter].map((m) => m.init()),
  );
});
after(async () => {
  await mongoose.disconnect();
  if (replica) await replica.stop();
});
let serial = 0;
async function fixture(types = ['short_text']) {
  const n = ++serial;
  const business = await Business.create({
    ownerId: new mongoose.Types.ObjectId(),
    name: `Cafe ${n}`,
    type: 'restaurant',
    reportLanguage: 'en',
    slug: `response-cafe-${n}`,
  });
  const branch = await Branch.create({ businessId: business._id, name: 'One' });
  await Branch.create({ businessId: business._id, name: 'Two' });
  const survey = await Survey.create({
    businessId: business._id,
    name: 'Survey',
    shortCode: `response-${n}`,
    status: 'live',
    branchIds: [branch._id],
    languages: ['en', 'ar'],
    thankYouMessage: 'Thanks',
  });
  await questions.createQuestionsFromSpecs(
    survey._id,
    types.map((type) => ({
      type,
      questionTextEn: `Original ${type}`,
      questionTextAr: 'السؤال',
      settings: { allowMultiple: true },
      options: [{ label: { en: 'First', ar: 'الأول' } }, { label: { en: 'Second', ar: 'الثاني' } }],
    })),
  );
  const form = await publicSurvey.getPublicSurvey(survey.shortCode);
  const body = {
    formVersion: form.formVersion,
    submissionId: `submission-${n}`,
    language: 'ar',
    respondent: { name: 'Private', email: 'private@example.test' },
    answers: form.questions.map((q) =>
      q.type === 'rating'
        ? { questionId: q.id, value: 4 }
        : q.type === 'yes_no'
          ? { questionId: q.id, value: false }
          : ['dropdown', 'multiple_choice'].includes(q.type)
            ? { questionId: q.id, optionIds: [q.options[0].id] }
            : { questionId: q.id, value: 'Excellent service' },
    ),
  };
  return { business, branch, survey, form, body, user: { businessId: business._id } };
}

test('public form version rejects answers to edited prompts and retains the exact earlier snapshot', async () => {
  const f = await fixture();
  assert.match(f.form.formVersion, /^[a-f0-9]{64}$/);
  assert.equal(
    (await publicSurvey.getPublicSurvey(f.survey.shortCode)).formVersion,
    f.form.formVersion,
  );
  await responses.submitResponse(f.survey.shortCode, f.body);
  await questions.updateQuestion(f.user, f.survey._id, f.form.questions[0].id, {
    questionTextEn: 'Changed prompt',
  });
  await assert.rejects(
    responses.submitResponse(f.survey.shortCode, { ...f.body, submissionId: 'new-stale-submit' }),
    { statusCode: 409 },
  );
  const fresh = await publicSurvey.getPublicSurvey(f.survey.shortCode);
  assert.notEqual(fresh.formVersion, f.form.formVersion);
  await responses.submitResponse(f.survey.shortCode, {
    ...f.body,
    submissionId: 'new-fresh-submit',
    formVersion: fresh.formVersion,
  });
  const stored = await Response.find({ surveyId: f.survey._id }).sort({ number: 1 }).lean();
  assert.equal(stored[0].formSnapshot.questions[0].questionTextEn, 'Original short_text');
  assert.equal(stored[1].formSnapshot.questions[0].questionTextEn, 'Changed prompt');
  assert.equal(stored[0].formVersion, f.form.formVersion);
});

test('submission waits for a preceding close/delete/archive transaction and rejects its committed state', async () => {
  for (const change of ['close', 'pause', 'delete', 'archive', 'question', 'option']) {
    const f = await fixture(change === 'option' ? ['dropdown'] : undefined);
    const session = await mongoose.startSession();
    session.startTransaction();
    await Business.updateOne({ _id: f.business._id }, { $inc: { __v: 1 } }, { session });
    const original = Business.collection.findOneAndUpdate;
    let reached;
    const attempted = new Promise((resolve) => {
      reached = resolve;
    });
    Business.collection.findOneAndUpdate = function (...args) {
      reached();
      return original.apply(this, args);
    };
    const pending = responses.submitResponse(f.survey.shortCode, f.body);
    // Old code never takes the business lock and incorrectly resolves instead.
    const winner = await Promise.race([
      attempted.then(() => 'locked'),
      pending.then(() => 'accepted'),
    ]);
    try {
      assert.equal(winner, 'locked', change);
      if (change === 'close' || change === 'pause')
        await Survey.updateOne(
          { _id: f.survey._id },
          { status: change === 'close' ? 'closed' : 'paused' },
          { session },
        );
      if (change === 'delete') await Survey.deleteOne({ _id: f.survey._id }, { session });
      if (change === 'archive')
        await Branch.updateOne({ _id: f.branch._id }, { status: 'archived' }, { session });
      if (change === 'question')
        await Question.updateOne(
          { _id: f.form.questions[0].id },
          { questionTextEn: 'Changed' },
          { session },
        );
      if (change === 'option')
        await Option.updateOne(
          { _id: f.form.questions[0].options[0].id },
          { 'label.en': 'Changed' },
          { session },
        );
      await session.commitTransaction();
      await assert.rejects(
        pending,
        (error) => error.statusCode === (change === 'delete' ? 404 : 409),
      );
      assert.equal(await Response.countDocuments({ surveyId: f.survey._id }), 0);
    } finally {
      Business.collection.findOneAndUpdate = original;
      if (session.inTransaction()) await session.abortTransaction();
      await session.endSession();
      await pending.catch(() => {});
    }
  }
});

test('all question types, required/foreign inputs, privacy and scoped owner counts', async () => {
  const f = await fixture([
    'short_text',
    'long_text',
    'rating',
    'yes_no',
    'dropdown',
    'multiple_choice',
  ]);
  const other = await fixture();
  f.body.answers[5].optionIds = f.form.questions[5].options.map((o) => o.id);
  await Question.updateMany({ surveyId: f.survey._id }, { isRequired: true });
  f.body.formVersion = (await publicSurvey.getPublicSurvey(f.survey.shortCode)).formVersion;
  const invalidBodies = [
    { ...f.body, answers: f.body.answers.slice(1) },
    { ...f.body, answers: f.body.answers.map((a, i) => (i === 0 ? { ...a, value: 123 } : a)) },
    {
      ...f.body,
      answers: f.body.answers.map((a, i) =>
        i === 4 ? { ...a, optionIds: f.form.questions[4].options.map((o) => o.id) } : a,
      ),
    },
    { ...f.body, answers: [...f.body.answers, other.body.answers[0]] },
    { ...f.body, answers: [...f.body.answers, f.body.answers[0]] },
    { ...f.body, answers: f.body.answers.map((a, i) => (i === 2 ? { ...a, value: 6 } : a)) },
    { ...f.body, answers: f.body.answers.map((a, i) => (i === 3 ? { ...a, value: 'yes' } : a)) },
    {
      ...f.body,
      answers: f.body.answers.map((a, i) =>
        i === 4 ? { ...a, optionIds: [new mongoose.Types.ObjectId()] } : a,
      ),
    },
    {
      ...f.body,
      answers: f.body.answers.map((a, i) => (i === 0 ? { ...a, value: 'x'.repeat(201) } : a)),
    },
  ];
  for (const body of invalidBodies)
    await assert.rejects(responses.submitResponse(f.survey.shortCode, body), { statusCode: 400 });
  await assert.rejects(
    responses.submitResponse(f.survey.shortCode, {
      ...f.body,
      branch: other.branch.slug + '-foreign',
    }),
    { statusCode: 404 },
  );
  await assert.rejects(
    responses.submitResponse(f.survey.shortCode, { ...f.body, formVersion: undefined }),
    { statusCode: 409 },
  );
  await responses.submitResponse(f.survey.shortCode, f.body);
  const stored = await Response.findOne({ surveyId: f.survey._id }).lean();
  assert.equal(stored.respondent?.name, undefined);
  assert.equal(stored.answers.length, 6);
  assert.equal(stored.answers[2].ratingMax, 5);
  assert.equal(stored.answers[3].yesNo, false);
  assert.equal(stored.answers[4].choices[0].label.en, 'First');
  assert.equal(stored.answers[5].choices.length, 2);
  assert.equal(stored.declaredLanguage, 'ar');
  assert.equal(stored.language, 'en');
  assert.equal(stored.analysis.status, 'pending');
  assert.equal(stored.analysis.overallSentiment, undefined);
  assert.equal((await surveys.getById(f.user, f.survey._id)).responseCount, 1);
  assert.equal((await surveys.getSummary(other.user)).responsesThisMonth.value, 0);
  assert.equal((await branches.getSummary(f.user)).totalResponses, 1);
  await assert.rejects(surveys.getById(other.user, f.survey._id), { statusCode: 404 });
  const numeric = await fixture(['yes_no']);
  await surveys.update(numeric.user, numeric.survey._id, { isAnonymous: false });
  numeric.body.formVersion = (
    await publicSurvey.getPublicSurvey(numeric.survey.shortCode)
  ).formVersion;
  await responses.submitResponse(numeric.survey.shortCode, numeric.body);
  const numericStored = await Response.findOne({ surveyId: numeric.survey._id }).lean();
  assert.equal(numericStored.analysis.status, 'skipped');
  assert.equal(numericStored.respondent.email, 'private@example.test');
});

test('concurrent duplicate submissions create one response and allocate one number', async () => {
  const f = await fixture();
  const results = await Promise.all(
    Array.from({ length: 6 }, () => responses.submitResponse(f.survey.shortCode, f.body)),
  );
  assert.equal(results.filter((r) => r.duplicate).length, 5);
  assert.equal(await Response.countDocuments({ surveyId: f.survey._id }), 1);
  assert.equal((await Counter.findById(`feedback:${f.business._id}`)).seq, 1);
});

test('failed response insert rolls back counter and business lock; question option failures roll back edits', async () => {
  const f = await fixture(['dropdown']);
  const before = await Business.findById(f.business._id).lean();
  const create = Response.create;
  Response.create = async () => {
    throw new Error('synthetic insert failure');
  };
  try {
    await assert.rejects(
      responses.submitResponse(f.survey.shortCode, f.body),
      /synthetic insert failure/,
    );
  } finally {
    Response.create = create;
  }
  assert.equal(await Response.countDocuments({ surveyId: f.survey._id }), 0);
  assert.equal(await Counter.findById(`feedback:${f.business._id}`), null);
  assert.equal((await Business.findById(f.business._id)).__v, before.__v);
  const bulkWrite = Option.bulkWrite;
  Option.bulkWrite = async () => {
    throw new Error('synthetic option failure');
  };
  try {
    await assert.rejects(
      questions.updateQuestion(f.user, f.survey._id, f.form.questions[0].id, {
        questionTextEn: 'Partially changed',
        options: [{ label: { en: 'Replacement' } }],
      }),
      /synthetic option failure/,
    );
  } finally {
    Option.bulkWrite = bulkWrite;
  }
  assert.equal(
    (await publicSurvey.getPublicSurvey(f.survey.shortCode)).formVersion,
    f.body.formVersion,
  );
  await responses.submitResponse(f.survey.shortCode, f.body);
  assert.equal((await Counter.findById(`feedback:${f.business._id}`)).seq, 1);
});

test('owner lifecycle and question mutations wait for an in-flight submission and preserve its stored prompt', async () => {
  for (const change of ['close', 'pause', 'delete', 'archive', 'question', 'option']) {
    const f = await fixture(change === 'option' ? ['dropdown'] : undefined);
    const next = Counter.next;
    let entered, release;
    const enteredCounter = new Promise((resolve) => {
      entered = resolve;
    });
    const released = new Promise((resolve) => {
      release = resolve;
    });
    Counter.next = async function (...args) {
      entered();
      await released;
      return next.apply(this, args);
    };
    const pending = responses.submitResponse(f.survey.shortCode, f.body);
    await enteredCounter;
    const original = Business.collection.findOneAndUpdate;
    let lockAttempt;
    const attempted = new Promise((resolve) => {
      lockAttempt = resolve;
    });
    Business.collection.findOneAndUpdate = function (...args) {
      lockAttempt();
      return original.apply(this, args);
    };
    const mutation =
      change === 'close'
        ? surveys.updateStatus(f.user, f.survey._id, 'closed')
        : change === 'pause'
          ? surveys.updateStatus(f.user, f.survey._id, 'paused')
          : change === 'delete'
            ? surveys.remove(f.user, f.survey._id)
            : change === 'archive'
              ? branches.archive(f.user, f.branch._id)
              : questions.updateQuestion(
                  f.user,
                  f.survey._id,
                  f.form.questions[0].id,
                  change === 'option'
                    ? {
                        options: [
                          {
                            id: f.form.questions[0].options[0].id,
                            label: { en: 'Changed option' },
                          },
                        ],
                      }
                    : { questionTextEn: 'Changed after submission' },
                );
    const outcome = mutation.then(
      () => 'mutated',
      () => 'rejected',
    );
    try {
      assert.equal(await Promise.race([attempted.then(() => 'locked'), outcome]), 'locked', change);
      release();
      await pending;
      if (change === 'delete') await assert.rejects(mutation, { statusCode: 409 });
      else await mutation;
      const stored = await Response.findOne({ surveyId: f.survey._id }).lean();
      assert.equal(
        stored.answers[0].questionTextEn,
        `Original ${change === 'option' ? 'dropdown' : 'short_text'}`,
      );
      assert.equal(
        stored.formSnapshot.questions[0].questionTextEn,
        stored.answers[0].questionTextEn,
      );
      assert.ok(await Survey.findById(f.survey._id));
      if (change === 'archive') {
        assert.equal((await branches.getSummary(f.user)).archivedResponses, 1);
        assert.equal((await branches.getHistory(f.user, f.branch._id)).earlierResponses, 1);
      }
    } finally {
      release();
      Counter.next = next;
      Business.collection.findOneAndUpdate = original;
      await pending.catch(() => {});
      await mutation.catch(() => {});
    }
  }
});

test('HTTP public contract requires formVersion, validates shape, returns created/retry and stale conflict', async () => {
  process.env.JWT_SECRET = 'response-isolated-tests-only-secret-thirty-two-characters';
  process.env.APP_ORIGIN = 'http://127.0.0.1:5173';
  process.env.NODE_ENV = 'test';
  const request = require('supertest');
  const app = require('../app');
  const f = await fixture();
  const url = `/api/public/surveys/${f.survey.shortCode}`;
  const read = await request(app).get(url).expect(200);
  assert.equal(read.body.data.formVersion, f.body.formVersion);
  await request(app).post(`${url}/responses`).send({ answers: f.body.answers }).expect(400);
  await request(app)
    .post(`${url}/responses`)
    .send({ ...f.body, answers: [{ questionId: 'bad' }] })
    .expect(400);
  const created = await request(app).post(`${url}/responses`).send(f.body).expect(201);
  assert.deepEqual(created.body.data, { thankYouMessage: 'Thanks' });
  await request(app).post(`${url}/responses`).send(f.body).expect(200);
  await questions.updateQuestion(f.user, f.survey._id, f.form.questions[0].id, {
    questionTextEn: 'New prompt',
  });
  await request(app)
    .post(`${url}/responses`)
    .send({ ...f.body, submissionId: 'stale-http-submit' })
    .expect(409);
  const browser = request.agent(app);
  const csrf = await browser.get('/api/auth/session').expect(200);
  const fresh = await browser.get(url).expect(200);
  await browser
    .post(`${url}/responses`)
    .set('Origin', 'https://foreign.example.test')
    .set('X-CSRF-Token', csrf.body.csrfToken)
    .send({
      ...f.body,
      formVersion: fresh.body.data.formVersion,
      submissionId: 'foreign-browser-submit',
    })
    .expect(403);
  await browser
    .post(`${url}/responses`)
    .set('Origin', process.env.APP_ORIGIN)
    .send({
      ...f.body,
      formVersion: fresh.body.data.formVersion,
      submissionId: 'missing-csrf-submit',
    })
    .expect(403);
  await browser
    .post(`${url}/responses`)
    .set('Origin', process.env.APP_ORIGIN)
    .set('X-CSRF-Token', csrf.body.csrfToken)
    .send({
      ...f.body,
      formVersion: fresh.body.data.formVersion,
      submissionId: 'browser-http-submit',
    })
    .expect(201);
});

test('retries after collection closes return the original receipt without allocating new responses', async () => {
  const f = await fixture();
  await responses.submitResponse(f.survey.shortCode, f.body);
  await surveys.updateStatus(f.user, f.survey._id, 'closed');
  const retry = await responses.submitResponse(f.survey.shortCode, f.body);
  assert.equal(retry.duplicate, true);
  assert.equal(retry.thankYouMessage, 'Thanks');
  assert.equal(await Response.countDocuments({ surveyId: f.survey._id }), 1);
});

test('form revision binds the resolved branch and rejects silently remapping an unqualified old form', async () => {
  const f = await fixture();
  const second = await Branch.findOne({ businessId: f.business._id, name: 'Two' });
  const explicitOriginal = await publicSurvey.getPublicSurvey(f.survey.shortCode, f.branch.slug);
  assert.equal(explicitOriginal.formVersion, f.form.formVersion);
  await surveys.update(f.user, f.survey._id, { branchIds: [second._id] });
  await assert.rejects(responses.submitResponse(f.survey.shortCode, f.body), { statusCode: 409 });
  assert.equal(await Response.countDocuments({ surveyId: f.survey._id }), 0);
  const fresh = await publicSurvey.getPublicSurvey(f.survey.shortCode);
  assert.notEqual(fresh.formVersion, f.form.formVersion);
  await responses.submitResponse(f.survey.shortCode, { ...f.body, formVersion: fresh.formVersion });
  const stored = await Response.findOne({ surveyId: f.survey._id }).lean();
  assert.equal(String(stored.branchId), String(second._id));
  assert.deepEqual(stored.formSnapshot.branch, {
    id: String(second._id),
    name: second.name,
    slug: second.slug,
  });
  await surveys.update(f.user, f.survey._id, { branchIds: [f.branch._id, second._id] });
  const selected = await publicSurvey.getPublicSurvey(f.survey.shortCode, second.slug);
  const crossBranch = {
    ...f.body,
    formVersion: selected.formVersion,
    submissionId: 'cross-branch-submit',
    branch: f.branch.slug,
  };
  await assert.rejects(responses.submitResponse(f.survey.shortCode, crossBranch), {
    statusCode: 409,
  });
  await responses.submitResponse(f.survey.shortCode, { ...crossBranch, branch: second.slug });
  assert.equal(await Response.countDocuments({ surveyId: f.survey._id, branchId: second._id }), 2);
});
