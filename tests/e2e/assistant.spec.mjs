import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';

const require = createRequire(new URL('../../backend/package.json', import.meta.url));

// Real cookies/Node/Mongo/UI, with an isolated synthetic private AI transport.
// No real provider credentials or configured customer database are used.
export async function runAssistantScenario({ browser, origin, output }) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const failures = [];
  page.on('pageerror', (error) => failures.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource:'))
      failures.push(message.text());
  });
  const previousUrl = process.env.AI_SERVICE_URL;
  const previousToken = process.env.AI_SERVICE_TOKEN;
  const token = 'synthetic-assistant-service-token-'.repeat(2);
  let calls = 0;
  const upstream = createServer(async (req, res) => {
    assert.equal(req.url, '/api/v1/answers');
    assert.equal(req.headers['x-ai-service-token'], token);
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const payload = JSON.parse(Buffer.concat(chunks));
    calls++;
    assert.ok(!JSON.stringify(payload).includes('assistant-owner@example.test'));
    const source = payload.texts[0];
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        schema_version: '1',
        operation: 'answers',
        request_id: randomUUID(),
        provenance: {
          models: ['groq.synthetic'],
          profile: 'a'.repeat(64),
          prompt_version: 'extractive-v1',
          method_version: 'aspects-v1',
          scores: 'uncalibrated',
          quality_status: 'baseline',
          quality_accepted: false,
          warnings: ['experimental_baseline', 'quality_not_accepted'],
        },
        result: {
          status: 'answered',
          items: [{ text: source.text, citations: [{ id: source.id, quote: source.text }] }],
        },
      }),
    );
  });
  await new Promise((resolve) => upstream.listen(0, '127.0.0.1', resolve));
  process.env.AI_SERVICE_URL = `http://127.0.0.1:${upstream.address().port}`;
  process.env.AI_SERVICE_TOKEN = token;
  try {
    const mutation = async (path, body, method = 'post') => {
      const session = await (await context.request.get(`${origin}/api/auth/session`)).json();
      const response = await context.request[method](`${origin}/api${path}`, {
        headers: { Origin: origin, 'X-CSRF-Token': session.csrfToken },
        data: body,
      });
      assert.ok(response.ok(), `${path} returned ${response.status()}`);
      return response.json();
    };
    await mutation('/auth/register', {
      name: 'Assistant Owner',
      email: 'assistant-owner@example.test',
      password: 'SyntheticAssistant123',
      passwordConfirmation: 'SyntheticAssistant123',
      preferredLanguage: 'en',
    });
    await mutation('/onboarding/business', { name: 'Assistant Cafe', type: 'restaurant' }, 'put');
    await mutation('/onboarding/setup', { hasMultipleBranches: false }, 'put');
    await mutation('/onboarding/complete', {});
    const session = await (await context.request.get(`${origin}/api/auth/session`)).json();
    await page.goto(`${origin}/#/assistant`);
    await page.getByRole('textbox', { name: 'Ask about your feedback', exact: true }).waitFor();
    const empty = await (await context.request.get(`${origin}/api/ai/assistant/context`)).json();
    assert.equal(empty.data.metrics.totalResponses, 0);
    assert.equal(calls, 0);

    const { Types } = require('mongoose');
    const Response = require('./src/models/customerResponse.model');
    const Branch = require('./src/models/branch.model');
    const branch = await Branch.findOne({ businessId: session.workspace.id }).lean();
    const documents = await Response.create(
      [
        ['Coffee was excellent but waiting took twenty minutes.', 'en'],
        ['القهوة ممتازة لكن الانتظار كان طويلًا.', 'ar'],
      ].map(([feedbackText, language], index) => ({
        businessId: session.workspace.id,
        branchId: branch._id,
        surveyId: new Types.ObjectId(),
        number: index + 1,
        formVersion: 'a'.repeat(64),
        formSnapshot: { survey: { name: 'Synthetic assistant survey' } },
        feedbackText,
        language,
        analysis: { status: 'pending', requestedAt: new Date() },
      })),
    );
    for (const width of [1440, 393]) {
      await page.setViewportSize({ width, height: width === 393 ? 800 : 900 });
      for (const locale of ['en', 'ar']) {
        await page.goto(`${origin}/?lang=${locale}#/assistant`);
        const input = page.getByRole('textbox', {
          name: locale === 'ar' ? 'اسأل عن آراء العملاء' : 'Ask about your feedback',
          exact: true,
        });
        await input.fill(locale === 'ar' ? 'ماذا قال العملاء عن القهوة؟' : 'What about coffee?');
        const reply = page.waitForResponse(
          (response) =>
            new URL(response.url()).pathname === '/api/ai/assistant/answers' &&
            response.request().method() === 'POST',
        );
        await input.press('Enter');
        const result = await (await reply).json();
        assert.equal(result.data.status, 'answered');
        assert.equal(result.data.metrics.totalResponses, 2);
        assert.equal(result.data.provenance.quality_accepted, false);
        const sourceLink = page
          .getByRole('link', {
            name: locale === 'ar' ? 'عرض الرد الأصلي' : 'View original feedback',
            exact: true,
          })
          .first();
        await sourceLink.waitFor();
        assert.ok(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        );
        await page.screenshot({
          path: join(output, `assistant-${locale}-${width}.png`),
          fullPage: true,
        });
        const href = await sourceLink.getAttribute('href');
        assert.ok(documents.some((doc) => href.includes(String(doc._id))));
        await sourceLink.click();
        await page
          .getByText(result.data.items[0].citations[0].quote, { exact: true })
          .first()
          .waitFor();
      }
    }
    await page.goto(`${origin}/?lang=en#/dashboard`);
    await page.getByRole('button', { name: 'Open Ask NUVIA', exact: true }).click();
    await page
      .getByRole('textbox', { name: 'Message NUVIA', exact: true })
      .fill('What about coffee?');
    await page.getByRole('button', { name: 'Send message', exact: true }).click();
    await page.getByRole('link', { name: 'View original feedback', exact: true }).first().waitFor();
    await page.keyboard.press('Escape');
    assert.ok(
      await page
        .getByRole('button', { name: 'Open Ask NUVIA', exact: true })
        .evaluate((element) => element === document.activeElement),
    );
    assert.deepEqual(failures, [], 'Assistant browser console/page errors');
    console.log(
      'Connected assistant: real owned retrieval/metrics, synthetic AI evidence, source navigation, panel focus and EN/AR desktop/mobile: PASS',
    );
  } finally {
    await context.close();
    upstream.closeAllConnections();
    await new Promise((resolve) => upstream.close(resolve));
    if (previousUrl === undefined) delete process.env.AI_SERVICE_URL;
    else process.env.AI_SERVICE_URL = previousUrl;
    if (previousToken === undefined) delete process.env.AI_SERVICE_TOKEN;
    else process.env.AI_SERVICE_TOKEN = previousToken;
  }
}
