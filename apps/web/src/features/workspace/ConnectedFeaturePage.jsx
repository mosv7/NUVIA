import { useCallback, useEffect, useState } from 'react';
import { surveyApi } from '../surveys/api.js';
import { publicSurveyApi } from '../public-surveys/api.js';
import { analyticsApi } from '../analytics/api.js';
import { reportsApi } from '../reports/api.js';
import { downloadReportsCsv } from '../reports/export.js';
import { feedbackApi } from '../feedback/api.js';
import { connectedSurveyUrl } from '../../config/links.js';

const panel = {
  background: '#fff',
  border: '1px solid #e7eaf0',
  borderRadius: 14,
  padding: 18,
  marginBottom: 14,
};
const button = {
  border: '1px solid #d9deea',
  borderRadius: 9,
  padding: '9px 13px',
  background: '#fff',
  cursor: 'pointer',
  fontWeight: 600,
};
const primary = { ...button, background: '#202b54', color: '#fff', borderColor: '#202b54' };
const field = { display: 'grid', gap: 6, marginBottom: 12, minWidth: 0 };
const input = {
  width: '100%',
  border: '1px solid #d9deea',
  borderRadius: 8,
  padding: '10px 11px',
  font: 'inherit',
  boxSizing: 'border-box',
};
const titleStyle = { fontSize: 25, fontWeight: 750, margin: '0 0 6px' };
const muted = { color: '#687187', fontSize: 13 };
const unwrap = (x) => x?.data ?? x;
const arr = (x) =>
  Array.isArray(x) ? x : Array.isArray(x?.data) ? x.data : Array.isArray(x?.items) ? x.items : [];
const idOf = (x) => String(x?.id ?? x?._id ?? '');
const messageOf = (e) => {
  const detail = e?.details?.[0]?.message || e?.details?.[0]?.msg;
  const serverMessage = detail || e?.serverMessage;
  const context = [e?.status ? `HTTP ${e.status}` : '', e?.code].filter(Boolean).join(', ');
  if (serverMessage) return context ? `${serverMessage} (${context})` : serverMessage;
  const mapped = {
    NETWORK_ERROR: 'Network connection failed. Check that the API is running.',
    AUTH_REQUIRED: 'Your session has expired. Please sign in again.',
    RATE_LIMITED: 'Too many requests. Please wait and try again.',
    REQUEST_FAILED:
      'The request could not be completed. Check the entered information and try again.',
  }[e?.code];
  if (mapped) return e?.status ? `${mapped} (HTTP ${e.status})` : mapped;
  if (e?.message && !/^[A-Z_]+$/.test(e.message))
    return e?.status ? `${e.message} (HTTP ${e.status})` : e.message;
  return e?.status
    ? `Something went wrong. Please try again (HTTP ${e.status})`
    : 'Something went wrong. Please try again.';
};
const date = (x) => (x ? new Date(x).toLocaleDateString() : '—');
const newSubmissionId = () =>
  globalThis.crypto?.randomUUID?.() ||
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

function PageFrame({ title, subtitle, children, actions }) {
  return (
    <main style={{ maxWidth: 1120, margin: '0 auto', padding: '28px 24px 60px', color: '#20263a' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          marginBottom: 22,
        }}
      >
        <div>
          <h1 style={titleStyle}>{title}</h1>
          {subtitle && <p style={{ ...muted, margin: 0 }}>{subtitle}</p>}
        </div>
        {actions && <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{actions}</div>}
      </header>
      {children}
    </main>
  );
}
function Notice({ error, success }) {
  return error ? (
    <div role="alert" style={{ ...panel, color: '#a32929', background: '#fff7f7' }}>
      {error}
    </div>
  ) : success ? (
    <div role="status" style={{ ...panel, color: '#176a43', background: '#f3fbf6' }}>
      {success}
    </div>
  ) : null;
}
function Loading() {
  return (
    <div style={panel} role="status">
      Loading…
    </div>
  );
}
function Empty({ children = 'No data yet.' }) {
  return (
    <div style={{ ...panel, textAlign: 'center', color: '#687187', padding: 34 }}>{children}</div>
  );
}
function MetricGrid({ data }) {
  const pairs = Object.entries(data || {})
    .filter(([, v]) => ['string', 'number'].includes(typeof v) || v === null)
    .slice(0, 8);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))',
        gap: 12,
        marginBottom: 16,
      }}
    >
      {pairs.map(([k, v]) => (
        <div key={k} style={panel}>
          <div style={muted}>{k.replace(/([A-Z])/g, ' $1')}</div>
          <div style={{ fontSize: 24, fontWeight: 750, marginTop: 6 }}>{v ?? '—'}</div>
        </div>
      ))}
    </div>
  );
}
function StructuredData({ value, depth = 0 }) {
  if (value == null) return <p style={muted}>No data available.</p>;
  if (Array.isArray(value)) {
    if (!value.length) return <Empty />;
    if (typeof value[0] === 'object' && value[0] !== null) {
      const keys = [...new Set(value.flatMap((row) => Object.keys(row || {})))]
        .filter((k) => !['_id', 'id'].includes(k))
        .slice(0, 6);
      const numericKey = Object.keys(value[0] || {}).find(
        (key) => typeof value[0][key] === 'number',
      );
      return (
        <>
          {numericKey && (
            <div style={{ marginBottom: 14 }}>
              {value.slice(0, 12).map((row, i) => (
                <div
                  key={idOf(row) || i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(100px,1fr) 2fr auto',
                    gap: 10,
                    alignItems: 'center',
                    margin: '8px 0',
                  }}
                >
                  <span style={muted}>
                    {row.name || row.label || row.date || row._id || `Item ${i + 1}`}
                  </span>
                  <div
                    style={{
                      height: 9,
                      background: '#edf0f6',
                      borderRadius: 8,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.max(2, Math.min(100, (Number(row[numericKey]) / (Math.max(...value.map((v) => Number(v[numericKey]) || 0)) || 1)) * 100))}%`,
                        background: '#5969a8',
                      }}
                    />
                  </div>
                  <strong>{row[numericKey]}</strong>
                </div>
              ))}
            </div>
          )}
          <DataTable
            columns={keys.map((key) => ({
              key,
              label: key.replace(/([A-Z])/g, ' $1'),
              render: (r) => {
                const v = r[key];
                return typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v ?? '—');
              },
            }))}
            rows={value}
          />
        </>
      );
    }
    return (
      <div>
        {value.map((v, i) => (
          <div key={i} style={{ margin: '9px 0' }}>
            <div style={muted}>{String(v)}</div>
            <div style={{ height: 8, background: '#edf0f6', borderRadius: 8, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.max(3, Math.min(100, Number(v) || 0))}%`,
                  background: '#5969a8',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (typeof value === 'object') {
    const scalar = Object.fromEntries(
      Object.entries(value).filter(
        ([, v]) => v == null || ['string', 'number', 'boolean'].includes(typeof v),
      ),
    );
    const nested = Object.entries(value).filter(([, v]) => v && typeof v === 'object');
    return (
      <>
        {Object.keys(scalar).length > 0 && <MetricGrid data={scalar} />}{' '}
        {nested.map(([key, v]) => (
          <section key={key} style={{ marginTop: 12 }}>
            <h3 style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</h3>
            <StructuredData value={v} depth={depth + 1} />
          </section>
        ))}
      </>
    );
  }
  return <p>{String(value)}</p>;
}

function DataTable({ columns, rows, onRow }) {
  if (!rows.length) return <Empty />;
  return (
    <div style={{ ...panel, overflowX: 'auto', padding: 0 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 620 }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                style={{
                  textAlign: 'left',
                  padding: 13,
                  borderBottom: '1px solid #e7eaf0',
                  color: '#687187',
                  fontSize: 12,
                }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={idOf(r) || i}
              onClick={() => onRow?.(r)}
              style={{ cursor: onRow ? 'pointer' : 'default' }}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  style={{ padding: 13, borderBottom: '1px solid #f0f2f6', fontSize: 14 }}
                >
                  {c.render ? c.render(r) : String(r[c.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ConnectedFeaturePage({ route, language = 'en' }) {
  const [data, setData] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [success, setSuccess] = useState('');
  const [filters, setFilters] = useState(() => ({
    search: '',
    status: location.hash.startsWith('#/survey-live')
      ? 'live'
      : location.hash.startsWith('#/survey-drafts')
        ? 'draft'
        : location.hash.startsWith('#/survey-paused')
          ? 'paused'
          : location.hash.startsWith('#/survey-closed')
            ? 'closed'
            : 'all',
    page: 1,
    limit: 10,
    range: '30d',
    sentiment: '',
    branchId: '',
    surveyId: '',
    startDate: '',
    endDate: '',
    from: '',
    to: '',
  }));
  const [selected, setSelected] = useState(() =>
      new URLSearchParams(location.hash.split('?')[1] || '').get('create') === '1'
        ? 'create'
        : null,
    ),
    [draft, setDraft] = useState({
      name: '',
      message: '',
      thankYouMessage: '',
      languages: ['en'],
      defaultLanguage: 'en',
      isAnonymous: true,
    });
  const [questionDraft, setQuestionDraft] = useState({
    type: 'short_text',
    questionTextEn: '',
    questionTextAr: '',
    isRequired: false,
    options: [],
  });
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [reportId, setReportId] = useState('');
  const [formAnswers, setFormAnswers] = useState({});
  const [respondent, setRespondent] = useState({ name: '', email: '' });
  const [publicState, setPublicState] = useState(null);
  const [submissionId, setSubmissionId] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copiedSurveyCode, setCopiedSurveyCode] = useState('');
  const ar = language === 'ar';
  const t = useCallback((en, arabic) => (ar ? arabic : en), [ar]);
  const run = useCallback(async (fn) => {
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      const result = await fn();
      setData(result);
      return result;
    } catch (e) {
      setError(messageOf(e));
      return null;
    } finally {
      setBusy(false);
    }
  }, []);
  const surveyId = new URLSearchParams(location.hash.split('?')[1] || '').get('id');
  const shortCode =
    new URLSearchParams(location.hash.split('?')[1] || '').get('code') ||
    new URLSearchParams(location.search).get('code');
  const publicBranch = new URLSearchParams(location.hash.split('?')[1] || '').get('branch');

  const load = useCallback(async () => {
    if (route === 'surveys')
      return run(async () => {
        const [list, summary, templates] = await Promise.all([
          surveyApi.list({
            status: filters.status,
            search: filters.search,
            page: filters.page,
            limit: filters.limit,
          }),
          surveyApi.summary(),
          surveyApi.templates(),
        ]);
        return { list: unwrap(list), summary: unwrap(summary), templates: arr(unwrap(templates)) };
      });
    if (route === 'survey-edit' || route === 'survey-questions')
      return run(async () => unwrap(await surveyApi.get(surveyId)));
    if (route.startsWith('analytics'))
      return run(async () => {
        const q = {
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
          branchId: filters.branchId || undefined,
        };
        const calls = await Promise.allSettled([
          analyticsApi.overviewMetrics(q),
          analyticsApi.overviewTrends(q),
          analyticsApi.overviewSentiment(q),
          analyticsApi.aspectScores(q),
          analyticsApi.nextActions(q),
          analyticsApi.sentimentSummary(q),
        ]);
        return Object.fromEntries(
          ['metrics', 'trends', 'sentiment', 'aspects', 'actions', 'sentimentSummary'].map(
            (k, i) => [
              k,
              calls[i].status === 'fulfilled'
                ? unwrap(calls[i].value)
                : { error: messageOf(calls[i].reason) },
            ],
          ),
        );
      });
    if (route === 'dashboard' || route === 'overview')
      return run(async () => {
        const calls = await Promise.allSettled([
          analyticsApi.overviewMetrics({
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
            branchId: filters.branchId || undefined,
          }),
          analyticsApi.overviewTrends({
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
            branchId: filters.branchId || undefined,
          }),
          analyticsApi.overviewSentiment({
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
            branchId: filters.branchId || undefined,
          }),
          analyticsApi.overviewBranches(),
          analyticsApi.aspectScores({
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
            branchId: filters.branchId || undefined,
          }),
          analyticsApi.nextActions({
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
            branchId: filters.branchId || undefined,
          }),
        ]);
        return Object.fromEntries(
          ['metrics', 'trends', 'sentiment', 'branches', 'aspects', 'actions'].map((k, i) => [
            k,
            calls[i].status === 'fulfilled'
              ? unwrap(calls[i].value)
              : { error: messageOf(calls[i].reason) },
          ]),
        );
      });
    if (route === 'action-board') return run(async () => unwrap(await analyticsApi.nextActions()));
    if (route === 'reports') return run(async () => ({ reports: await reportsApi.list() }));
    if (route === 'report-details')
      return run(async () => await reportsApi.get(reportId || surveyId));
    if (route === 'feedbacks' || route === 'feedbacks-empty')
      return run(async () => {
        const [list, filterData] = await Promise.all([
          feedbackApi.list({
            page: filters.page,
            limit: filters.limit,
            search: filters.search,
            range: filters.range,
            sentiment: filters.sentiment || undefined,
            branchId: filters.branchId || undefined,
            surveyId: filters.surveyId || undefined,
          }),
          feedbackApi.filters(),
        ]);
        return { list: unwrap(list), filters: unwrap(filterData) };
      });
    if (route === 'feedback-details') {
      const id = new URLSearchParams(location.hash.split('?')[1] || '').get('id');
      if (!/^[a-f0-9]{24}$/i.test(id || '')) {
        setError(t('This feedback could not be loaded.', 'تعذر تحميل هذا الرد.'));
        setData(null);
        return null;
      }
      return run(async () => {
        const [detail, analysis] = await Promise.all([
          feedbackApi.detail(id),
          feedbackApi.analysis(id).catch(() => null),
        ]);
        return { detail: unwrap(detail), analysis: unwrap(analysis) };
      });
    }
    if (route === 'public-survey')
      return run(async () => {
        if (!shortCode) throw new Error('Survey link is missing its code.');
        const response = unwrap(await publicSurveyApi.get(shortCode, publicBranch));
        setPublicState(response);
        setSubmissionId(newSubmissionId());
        return response;
      });
    return null;
  }, [route, filters, run, surveyId, shortCode, publicBranch, reportId, t]);
  async function copyPublicLink(code) {
    const url = connectedSurveyUrl(code);
    if (!url) {
      setError('A public link is not available for this survey.');
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setError('');
      setSuccess('Public survey link copied. Keep the original site origin.');
      setCopiedSurveyCode(code);
    } catch {
      setError(`Copy this public survey link manually: ${url}`);
    }
  }
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    if (route === 'survey-edit' && data) {
      setDraft({
        name: data.name || '',
        message: data.message || '',
        thankYouMessage: data.thankYouMessage || '',
        languages: data.languages || ['en'],
        defaultLanguage: data.defaultLanguage || 'en',
        isAnonymous: data.isAnonymous !== false,
      });
    }
  }, [route, data]);

  async function createSurvey() {
    if (!draft.name.trim()) {
      setError('Survey name is required.');
      return;
    }
    setBusy(true);
    try {
      const r = unwrap(await surveyApi.create(draft));
      location.hash = `/survey-edit?id=${idOf(r)}`;
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  }
  async function saveSurvey() {
    setBusy(true);
    try {
      await surveyApi.update(surveyId, draft);
      setSuccess('Survey saved.');
      await load();
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  }
  async function addQuestion() {
    if (!surveyId || !questionDraft.questionTextEn.trim()) {
      setError('Add an English question first.');
      return;
    }
    setBusy(true);
    try {
      await surveyApi.addQuestion(surveyId, {
        ...questionDraft,
        options: questionDraft.options.filter((o) => o.label.en || o.label.ar),
      });
      setQuestionDraft({
        type: 'short_text',
        questionTextEn: '',
        questionTextAr: '',
        isRequired: false,
        options: [],
      });
      await load();
      setSuccess('Question added.');
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  }
  async function saveQuestionEdit() {
    if (!editingQuestion) return;
    setBusy(true);
    try {
      await surveyApi.updateQuestion(surveyId, idOf(editingQuestion), {
        type: editingQuestion.type,
        questionTextEn: editingQuestion.questionTextEn,
        questionTextAr: editingQuestion.questionTextAr,
        isRequired: editingQuestion.isRequired,
        settings: editingQuestion.settings || {},
        options: editingQuestion.options || [],
      });
      setEditingQuestion(null);
      await load();
      setSuccess('Question updated.');
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  }
  async function questionAction(action, q) {
    setBusy(true);
    try {
      if (action === 'delete') await surveyApi.deleteQuestion(surveyId, idOf(q));
      if (action === 'duplicate') await surveyApi.duplicateQuestion(surveyId, idOf(q));
      if (action === 'up' || action === 'down') {
        const qs = [...(data.questions || [])];
        const i = qs.findIndex((x) => idOf(x) === idOf(q));
        const j = i + (action === 'up' ? -1 : 1);
        if (j >= 0 && j < qs.length) {
          [qs[i], qs[j]] = [qs[j], qs[i]];
          await surveyApi.reorderQuestions(surveyId, { orderedIds: qs.map(idOf) });
        }
      }
      await load();
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  }
  async function generateReport() {
    if (Boolean(filters.from) !== Boolean(filters.to)) {
      setError('Choose both report dates or leave both empty.');
      return;
    }
    if (filters.from && filters.to && filters.from > filters.to) {
      setError('The start date must be before the end date.');
      return;
    }
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      const r = await reportsApi.generate({
        from: filters.from || undefined,
        to: filters.to || undefined,
        locale: language,
      });
      setData({ generated: unwrap(r), reports: await reportsApi.list() });
      setSuccess('Report generated and saved.');
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  }
  function exportReports() {
    const reports = data?.reports || [];
    if (!reports.length) {
      setError('There are no saved reports to export.');
      return;
    }
    try {
      downloadReportsCsv(reports);
      setError('');
      setSuccess('Saved report list exported as CSV.');
    } catch {
      setError('The saved report list could not be exported.');
    }
  }
  async function submitPublic(e) {
    e.preventDefault();
    const q = publicState?.questions || [];
    const answers = q
      .map((item) => {
        const value = formAnswers[idOf(item)];
        if (item.type === 'multiple_choice' || item.type === 'dropdown')
          return {
            questionId: idOf(item),
            optionIds: Array.isArray(value) ? value : value ? [value] : [],
          };
        return { questionId: idOf(item), value };
      })
      .filter((a) => a.optionIds?.length > 0 || (a.value !== undefined && a.value !== ''));
    if (!answers.length) {
      setError(
        t(
          'Answer at least one question before submitting.',
          'أجبي عن سؤال واحد على الأقل قبل الإرسال.',
        ),
      );
      return;
    }
    setBusy(true);
    try {
      await publicSurveyApi.submit(shortCode, {
        formVersion: publicState.formVersion,
        submissionId,
        branch: publicState.branch?.slug,
        language: publicState.survey?.defaultLanguage || 'en',
        channel: 'short_link',
        answers,
        respondent: publicState.survey?.isAnonymous
          ? undefined
          : {
              ...(respondent.name.trim() ? { name: respondent.name.trim() } : {}),
              ...(respondent.email.trim() ? { email: respondent.email.trim() } : {}),
            },
      });
      setSuccess(publicState.survey?.thankYouMessage || 'Thank you for your feedback!');
      setSubmitted(true);
      setFormAnswers({});
    } catch (e) {
      if (e?.status === 409) {
        await load();
        setError(
          t(
            'The survey changed. Review the latest questions and submit again.',
            'تغيّر الاستبيان. راجعي الأسئلة الحالية وأعيدي الإرسال.',
          ),
        );
      } else setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  }

  if (busy && !data && !publicState)
    return (
      <PageFrame title={t('Loading', 'جار التحميل')}>
        <Loading />
      </PageFrame>
    );
  if (route === 'surveys') {
    const list = data?.list || {};
    const rows = list.surveys || [];
    return (
      <PageFrame
        title={t('Surveys', 'الاستبيانات')}
        subtitle={t(
          'Create, manage and publish customer surveys.',
          'أنشئ استبيانات العملاء وأدرها وانشرها.',
        )}
        actions={
          <button style={primary} onClick={() => setSelected('create')}>
            {t('Create survey', 'إنشاء استبيان')}
          </button>
        }
      >
        <Notice error={error} success={success} />
        <MetricGrid data={data?.summary} />
        {selected === 'create' && (
          <section style={panel}>
            <h2>Create survey</h2>
            <label style={field}>
              Name
              <input
                style={input}
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </label>
            <label style={field}>
              Welcome message
              <textarea
                style={input}
                value={draft.message}
                onChange={(e) => setDraft({ ...draft, message: e.target.value })}
              />
            </label>
            <label style={field}>
              Thank-you message
              <textarea
                style={input}
                value={draft.thankYouMessage}
                onChange={(e) => setDraft({ ...draft, thankYouMessage: e.target.value })}
              />
            </label>
            <label style={field}>
              Template
              <select
                style={input}
                value={draft.templateId || ''}
                onChange={(e) => setDraft({ ...draft, templateId: e.target.value || undefined })}
              >
                <option value="">Start from scratch</option>
                {(data?.templates || []).map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name} · {template.questionCount} questions
                  </option>
                ))}
              </select>
            </label>
            <label>
              <input
                type="checkbox"
                checked={draft.isAnonymous}
                onChange={(e) => setDraft({ ...draft, isAnonymous: e.target.checked })}
              />{' '}
              Anonymous responses
            </label>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button style={primary} onClick={createSurvey} disabled={busy}>
                Create
              </button>
              <button style={button} onClick={() => setSelected(null)}>
                Cancel
              </button>
            </div>
          </section>
        )}
        <section style={panel}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
            <input
              style={{ ...input, maxWidth: 260 }}
              placeholder="Search surveys"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
            />
            <select
              style={input}
              value={filters.status}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value, page: 1 }))}
            >
              {['all', 'live', 'draft', 'paused', 'closed'].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
            <button style={button} onClick={load}>
              Refresh
            </button>
          </div>
          <DataTable
            columns={[
              { key: 'name', label: 'Survey' },
              { key: 'status', label: 'Status' },
              { key: 'questionCount', label: 'Questions' },
              { key: 'responseCount', label: 'Responses' },
              { key: 'updatedAt', label: 'Updated', render: (r) => date(r.updatedAt) },
              {
                key: 'actions',
                label: 'Actions',
                render: (r) => (
                  <span style={{ display: 'flex', gap: 6 }}>
                    <button
                      style={button}
                      onClick={(e) => {
                        e.stopPropagation();
                        location.hash = `/survey-edit?id=${idOf(r)}`;
                      }}
                    >
                      Edit
                    </button>
                    <button
                      style={button}
                      onClick={(e) => {
                        e.stopPropagation();
                        location.hash = `/public-survey?code=${encodeURIComponent(r.shortCode || '')}`;
                      }}
                    >
                      Public link
                    </button>
                    {r.shortCode && (
                      <button
                        style={button}
                        onClick={(e) => {
                          e.stopPropagation();
                          copyPublicLink(r.shortCode);
                        }}
                      >
                        {copiedSurveyCode === r.shortCode ? 'Link copied' : 'Copy public link'}
                      </button>
                    )}
                    {r.status === 'live' && (
                      <button
                        style={button}
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await surveyApi.updateStatus(idOf(r), { status: 'paused' });
                            load();
                          } catch (x) {
                            setError(messageOf(x));
                          }
                        }}
                      >
                        Pause
                      </button>
                    )}
                    {r.status === 'paused' && (
                      <button
                        style={button}
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await surveyApi.updateStatus(idOf(r), { status: 'live' });
                            load();
                          } catch (x) {
                            setError(messageOf(x));
                          }
                        }}
                      >
                        Resume
                      </button>
                    )}
                    {['live', 'paused'].includes(r.status) && (
                      <button
                        style={button}
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await surveyApi.updateStatus(idOf(r), { status: 'closed' });
                            load();
                          } catch (x) {
                            setError(messageOf(x));
                          }
                        }}
                      >
                        Close
                      </button>
                    )}
                    <button
                      style={button}
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          await surveyApi.duplicate(idOf(r));
                          load();
                        } catch (x) {
                          setError(messageOf(x));
                        }
                      }}
                    >
                      Duplicate
                    </button>
                    <button
                      style={button}
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          await surveyApi.remove(idOf(r));
                          load();
                        } catch (x) {
                          setError(messageOf(x));
                        }
                      }}
                    >
                      Delete
                    </button>
                  </span>
                ),
              },
            ]}
            rows={rows}
          />
          <div
            style={{
              display: 'flex',
              gap: 8,
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginTop: 12,
            }}
          >
            <span style={muted}>
              Page {list.pagination?.page || 1} of {list.pagination?.totalPages || 1}
            </span>
            <button
              style={button}
              disabled={(list.pagination?.page || 1) <= 1}
              onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
            >
              Previous
            </button>
            <button
              style={button}
              disabled={(list.pagination?.page || 1) >= (list.pagination?.totalPages || 1)}
              onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
            >
              Next
            </button>
          </div>
        </section>
      </PageFrame>
    );
  }
  if (route === 'survey-edit' || route === 'survey-questions') {
    const questions = data?.questions || [];
    return (
      <PageFrame
        title={t('Survey editor', 'محرر الاستبيان')}
        subtitle={data?.name}
        actions={
          <>
            <button style={button} onClick={() => (location.hash = '/surveys')}>
              Back
            </button>
            <button style={primary} onClick={saveSurvey} disabled={busy}>
              Save survey
            </button>
            <button
              style={button}
              onClick={async () => {
                try {
                  await surveyApi.publish(surveyId);
                  setSuccess('Survey published.');
                  await load();
                } catch (e) {
                  setError(messageOf(e));
                }
              }}
            >
              Publish
            </button>
          </>
        }
      >
        <Notice error={error} success={success} />
        <section style={panel}>
          <label style={field}>
            Survey name
            <input
              style={input}
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </label>
          <label style={field}>
            Welcome message
            <textarea
              style={input}
              value={draft.message}
              onChange={(e) => setDraft({ ...draft, message: e.target.value })}
            />
          </label>
          <label style={field}>
            Thank-you message
            <textarea
              style={input}
              value={draft.thankYouMessage}
              onChange={(e) => setDraft({ ...draft, thankYouMessage: e.target.value })}
            />
          </label>
        </section>
        <section style={panel}>
          <h2>Questions ({questions.length})</h2>
          {questions.map((q, i) => (
            <div
              key={idOf(q)}
              style={{
                border: '1px solid #e7eaf0',
                borderRadius: 10,
                padding: 13,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 10,
                  flexWrap: 'wrap',
                }}
              >
                <strong>
                  {i + 1}. {q.questionTextEn || q.questionTextAr}
                </strong>
                <span style={muted}>
                  {q.type}
                  {q.isRequired ? ' · Required' : ''}
                </span>
              </div>
              {q.options?.map((o) => (
                <div key={idOf(o)} style={muted}>
                  • {o.label?.en || o.label?.ar}
                </div>
              ))}
              {editingQuestion && idOf(editingQuestion) === idOf(q) && (
                <div style={{ marginTop: 10, background: '#f7f8fb', padding: 12, borderRadius: 8 }}>
                  <label style={field}>
                    Question (English)
                    <input
                      style={input}
                      value={editingQuestion.questionTextEn || ''}
                      onChange={(e) =>
                        setEditingQuestion((v) => ({ ...v, questionTextEn: e.target.value }))
                      }
                    />
                  </label>
                  <label style={field}>
                    Question (Arabic)
                    <input
                      style={input}
                      value={editingQuestion.questionTextAr || ''}
                      onChange={(e) =>
                        setEditingQuestion((v) => ({ ...v, questionTextAr: e.target.value }))
                      }
                    />
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={!!editingQuestion.isRequired}
                      onChange={(e) =>
                        setEditingQuestion((v) => ({ ...v, isRequired: e.target.checked }))
                      }
                    />{' '}
                    Required
                  </label>
                  {['multiple_choice', 'dropdown'].includes(editingQuestion.type) && (
                    <div>
                      <h4>Options</h4>
                      {(editingQuestion.options || []).map((o, j) => (
                        <div
                          key={idOf(o) || j}
                          style={{ display: 'flex', gap: 6, marginBottom: 6 }}
                        >
                          <input
                            style={input}
                            aria-label={`Option ${j + 1} English`}
                            value={o.label?.en || ''}
                            onChange={(e) =>
                              setEditingQuestion((v) => ({
                                ...v,
                                options: v.options.map((item, index) =>
                                  index === j
                                    ? { ...item, label: { ...item.label, en: e.target.value } }
                                    : item,
                                ),
                              }))
                            }
                          />
                          <input
                            style={input}
                            aria-label={`Option ${j + 1} Arabic`}
                            value={o.label?.ar || ''}
                            onChange={(e) =>
                              setEditingQuestion((v) => ({
                                ...v,
                                options: v.options.map((item, index) =>
                                  index === j
                                    ? { ...item, label: { ...item.label, ar: e.target.value } }
                                    : item,
                                ),
                              }))
                            }
                          />
                          <button
                            style={button}
                            onClick={() =>
                              setEditingQuestion((v) => ({
                                ...v,
                                options: v.options.filter((_, index) => index !== j),
                              }))
                            }
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        style={button}
                        onClick={() =>
                          setEditingQuestion((v) => ({
                            ...v,
                            options: [...(v.options || []), { label: { en: '', ar: '' } }],
                          }))
                        }
                      >
                        Add option
                      </button>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    <button style={primary} onClick={saveQuestionEdit}>
                      Save question
                    </button>
                    <button style={button} onClick={() => setEditingQuestion(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                <button style={button} onClick={() => questionAction('up', q)}>
                  ↑ Move
                </button>
                <button style={button} onClick={() => questionAction('down', q)}>
                  ↓ Move
                </button>
                <button style={button} onClick={() => setEditingQuestion({ ...q })}>
                  Edit
                </button>
                <button style={button} onClick={() => questionAction('duplicate', q)}>
                  Duplicate
                </button>
                <button style={button} onClick={() => questionAction('delete', q)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          <h3>Add question</h3>
          <label style={field}>
            Question (English)
            <input
              style={input}
              value={questionDraft.questionTextEn}
              onChange={(e) => setQuestionDraft((q) => ({ ...q, questionTextEn: e.target.value }))}
            />
          </label>
          <label style={field}>
            Question (Arabic)
            <input
              style={input}
              value={questionDraft.questionTextAr}
              onChange={(e) => setQuestionDraft((q) => ({ ...q, questionTextAr: e.target.value }))}
            />
          </label>
          <label style={field}>
            Type
            <select
              style={input}
              value={questionDraft.type}
              onChange={(e) =>
                setQuestionDraft((q) => ({ ...q, type: e.target.value, options: [] }))
              }
            >
              {['short_text', 'long_text', 'rating', 'multiple_choice', 'dropdown', 'yes_no'].map(
                (x) => (
                  <option key={x}>{x}</option>
                ),
              )}
            </select>
          </label>
          <label>
            <input
              type="checkbox"
              checked={questionDraft.isRequired}
              onChange={(e) => setQuestionDraft((q) => ({ ...q, isRequired: e.target.checked }))}
            />{' '}
            Required
          </label>
          {['multiple_choice', 'dropdown'].includes(questionDraft.type) && (
            <div>
              <h4>Options</h4>
              {questionDraft.options.map((o, i) => (
                <input
                  key={i}
                  style={{ ...input, marginBottom: 7 }}
                  value={o.label.en}
                  placeholder={`Option ${i + 1}`}
                  onChange={(e) =>
                    setQuestionDraft((q) => ({
                      ...q,
                      options: q.options.map((v, j) =>
                        j === i ? { ...v, label: { ...v.label, en: e.target.value } } : v,
                      ),
                    }))
                  }
                />
              ))}
              <button
                style={button}
                onClick={() =>
                  setQuestionDraft((q) => ({
                    ...q,
                    options: [...q.options, { label: { en: '', ar: '' } }],
                  }))
                }
              >
                Add option
              </button>
            </div>
          )}
          <div style={{ marginTop: 12 }}>
            <button style={primary} onClick={addQuestion} disabled={busy}>
              Add question
            </button>
          </div>
        </section>
      </PageFrame>
    );
  }
  if (route === 'public-survey') {
    const p = publicState || data;
    if (!p)
      return (
        <PageFrame title="Survey">
          <Notice error={error} />
          <Loading />
        </PageFrame>
      );
    if (submitted)
      return (
        <PageFrame title={p.survey?.name || 'Survey'}>
          <section style={panel}>
            <h2>{success || 'Thank you for your feedback!'}</h2>
          </section>
        </PageFrame>
      );
    if (p.state === 'branch_required')
      return (
        <PageFrame title={p.survey?.name || 'Survey'}>
          <section style={panel}>
            <h2>Select your branch</h2>
            {(p.branches || []).map((b) => (
              <p key={b.slug}>
                <a
                  href={`#/public-survey?code=${encodeURIComponent(shortCode)}&branch=${encodeURIComponent(b.slug)}`}
                >
                  {b.name}
                </a>
              </p>
            ))}
          </section>
        </PageFrame>
      );
    if (p.state !== 'open')
      return (
        <PageFrame title={p.survey?.name || 'Survey'}>
          <Empty>
            {p.state === 'paused'
              ? 'This survey is paused.'
              : p.state === 'closed'
                ? 'This survey is closed.'
                : 'This branch is unavailable.'}
          </Empty>
        </PageFrame>
      );
    return (
      <PageFrame
        title={p.survey?.name || 'Customer survey'}
        subtitle={`${p.businessName || ''} · ${p.branch?.name || ''}`}
      >
        <Notice error={error} success={success} />
        <form onSubmit={submitPublic} style={panel}>
          <p>{p.survey?.welcomeMessage}</p>
          {(p.questions || []).map((q, i) => (
            <div key={idOf(q)} style={{ ...field, marginBottom: 20 }}>
              <strong>
                {i + 1}. {q.questionTextEn || q.questionTextAr}
                {q.isRequired ? ' *' : ''}
              </strong>
              {q.type === 'short_text' || q.type === 'long_text' ? (
                q.type === 'long_text' ? (
                  <textarea
                    required={q.isRequired}
                    style={input}
                    value={formAnswers[idOf(q)] || ''}
                    onChange={(e) => setFormAnswers((a) => ({ ...a, [idOf(q)]: e.target.value }))}
                  />
                ) : (
                  <input
                    required={q.isRequired}
                    style={input}
                    value={formAnswers[idOf(q)] || ''}
                    onChange={(e) => setFormAnswers((a) => ({ ...a, [idOf(q)]: e.target.value }))}
                  />
                )
              ) : q.type === 'rating' ? (
                <select
                  required={q.isRequired}
                  style={input}
                  value={formAnswers[idOf(q)] || ''}
                  onChange={(e) =>
                    setFormAnswers((a) => ({ ...a, [idOf(q)]: Number(e.target.value) }))
                  }
                >
                  <option value="">Choose rating</option>
                  {Array.from({ length: q.settings?.stars || 5 }, (_, n) => (
                    <option key={n + 1} value={n + 1}>
                      {n + 1}
                    </option>
                  ))}
                </select>
              ) : q.type === 'yes_no' ? (
                <select
                  required={q.isRequired}
                  style={input}
                  value={formAnswers[idOf(q)] === undefined ? '' : String(formAnswers[idOf(q)])}
                  onChange={(e) =>
                    setFormAnswers((a) => ({ ...a, [idOf(q)]: e.target.value === 'true' }))
                  }
                >
                  <option value="">Choose</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              ) : (
                <div>
                  {(q.options || []).map((o) => (
                    <label key={idOf(o)} style={{ display: 'block', margin: '7px 0' }}>
                      <input
                        type={
                          q.type === 'multiple_choice' && q.settings?.allowMultiple
                            ? 'checkbox'
                            : 'radio'
                        }
                        name={idOf(q)}
                        checked={(Array.isArray(formAnswers[idOf(q)])
                          ? formAnswers[idOf(q)]
                          : [formAnswers[idOf(q)]]
                        ).includes(idOf(o))}
                        onChange={(e) =>
                          setFormAnswers((a) => ({
                            ...a,
                            [idOf(q)]:
                              q.type === 'multiple_choice' && q.settings?.allowMultiple
                                ? e.target.checked
                                  ? [...(a[idOf(q)] || []), idOf(o)]
                                  : (a[idOf(q)] || []).filter((x) => x !== idOf(o))
                                : idOf(o),
                          }))
                        }
                      />{' '}
                      {o.label?.en || o.label?.ar}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
          {!p.survey?.isAnonymous && (
            <>
              <label style={field}>
                Name
                <input
                  style={input}
                  value={respondent.name}
                  onChange={(e) => setRespondent((r) => ({ ...r, name: e.target.value }))}
                />
              </label>
              <label style={field}>
                Email
                <input
                  type="email"
                  style={input}
                  value={respondent.email}
                  onChange={(e) => setRespondent((r) => ({ ...r, email: e.target.value }))}
                />
              </label>
            </>
          )}
          <button style={primary} disabled={busy}>
            Submit feedback
          </button>
        </form>
      </PageFrame>
    );
  }
  if (route === 'action-board') {
    const actions = arr(data?.actions);
    return (
      <PageFrame
        title="Action board"
        subtitle={
          data?.reportName
            ? `Saved recommendations from ${data.reportName}`
            : 'Saved recommendations from your reports'
        }
      >
        <Notice error={error} />
        <section style={panel}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <strong>Recommended next actions</strong>
            <button style={button} onClick={load} disabled={busy}>
              Refresh
            </button>
          </div>
          {actions.length ? (
            <ol style={{ lineHeight: 1.8 }}>
              {actions.map((item, index) => (
                <li key={`${index}-${String(item)}`}>
                  {typeof item === 'string' ? item : <StructuredData value={item} />}
                </li>
              ))}
            </ol>
          ) : (
            <Empty>
              No saved recommendations yet. Actions appear when a generated report includes them.
            </Empty>
          )}
        </section>
      </PageFrame>
    );
  }
  if (route === 'dashboard' || route === 'overview' || route.startsWith('analytics')) {
    const sections = data || {};
    return (
      <PageFrame
        title={route.startsWith('analytics') ? 'Analytics' : 'Overview'}
        subtitle="Live workspace data from your account APIs"
      >
        <Notice error={error} />
        <section style={panel}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'end' }}>
            <label style={field}>
              From
              <input
                type="date"
                style={input}
                value={filters.startDate}
                onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
              />
            </label>
            <label style={field}>
              To
              <input
                type="date"
                style={input}
                value={filters.endDate}
                onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
              />
            </label>
            <button style={primary} onClick={load}>
              Apply date range
            </button>
          </div>
        </section>
        {Object.entries(sections).map(([k, v]) => (
          <section key={k} style={panel}>
            <h2 style={{ textTransform: 'capitalize', marginTop: 0 }}>
              {k.replace(/([A-Z])/g, ' $1')}
            </h2>
            {v?.error ? (
              <p style={{ color: '#a32929' }}>{v.error}</p>
            ) : (
              <StructuredData value={v} />
            )}
          </section>
        ))}
      </PageFrame>
    );
  }
  if (route === 'reports' || route === 'report-details') {
    const reports = data?.reports || [];
    if (route === 'report-details')
      return (
        <PageFrame
          title={data?.reportName || 'Report details'}
          actions={
            <button style={button} onClick={() => (location.hash = '/reports')}>
              Back to reports
            </button>
          }
        >
          <Notice error={error} />
          <StructuredData value={data} />
        </PageFrame>
      );
    return (
      <PageFrame
        title="Reports"
        subtitle="Generate and review saved reports"
        actions={
          <span style={{ display: 'flex', gap: 8 }}>
            <button style={button} onClick={exportReports} disabled={!reports.length}>
              Export report list
            </button>
            <button style={primary} disabled={busy} onClick={generateReport}>
              Generate report
            </button>
          </span>
        }
      >
        <Notice error={error} success={success} />
        <section style={panel}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'end' }}>
            <label style={field}>
              From
              <input
                type="date"
                style={input}
                value={filters.from}
                onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
              />
            </label>
            <label style={field}>
              To
              <input
                type="date"
                style={input}
                value={filters.to}
                onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
              />
            </label>
            <span style={muted}>Leave dates empty to use the latest 30 days.</span>
          </div>
        </section>
        {data?.generated && (
          <section style={panel}>
            <h2>New report generated</h2>
            <StructuredData value={data.generated} />
          </section>
        )}
        <DataTable
          columns={[
            { key: 'reportName', label: 'Report' },
            { key: 'periodCovered', label: 'Period' },
            { key: 'totalReviewsAnalyzed', label: 'Responses' },
            { key: 'createdAt', label: 'Created', render: (r) => date(r.createdAt) },
            {
              key: 'open',
              label: '',
              render: (r) => (
                <button
                  style={button}
                  onClick={() => {
                    setReportId(idOf(r));
                    location.hash = `/report-details?id=${idOf(r)}`;
                  }}
                >
                  View
                </button>
              ),
            },
          ]}
          rows={reports}
        />
      </PageFrame>
    );
  }
  if (route === 'feedbacks' || route === 'feedbacks-empty') {
    const payload = data?.list || {};
    const rows = Array.isArray(payload)
      ? payload
      : payload.feedbacks || payload.responses || payload.items || [];
    const pagination = payload.pagination || {};
    return (
      <PageFrame title="Feedbacks" subtitle="Customer responses from your surveys">
        <Notice error={error} />
        <section style={panel}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input
              style={{ ...input, maxWidth: 240 }}
              placeholder="Search feedback"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
            />
            <select
              style={{ ...input, maxWidth: 130 }}
              value={filters.range}
              onChange={(e) => setFilters((f) => ({ ...f, range: e.target.value, page: 1 }))}
            >
              {['7d', '30d', '90d', 'all'].map((x) => (
                <option key={x} value={x}>
                  {x === 'all' ? 'All time' : x}
                </option>
              ))}
            </select>
            <select
              style={{ ...input, maxWidth: 150 }}
              value={filters.sentiment}
              onChange={(e) => setFilters((f) => ({ ...f, sentiment: e.target.value, page: 1 }))}
            >
              <option value="">All sentiment</option>
              {(data?.filters?.sentiments || ['positive', 'neutral', 'negative', 'mixed']).map(
                (x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ),
              )}
            </select>
            <select
              style={{ ...input, maxWidth: 180 }}
              value={filters.branchId}
              onChange={(e) => setFilters((f) => ({ ...f, branchId: e.target.value, page: 1 }))}
            >
              <option value="">All branches</option>
              {(data?.filters?.branches || []).map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
            <select
              style={{ ...input, maxWidth: 180 }}
              value={filters.surveyId}
              onChange={(e) => setFilters((f) => ({ ...f, surveyId: e.target.value, page: 1 }))}
            >
              <option value="">All surveys</option>
              {(data?.filters?.surveys || []).map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
            <button style={button} onClick={load}>
              Apply filters
            </button>
          </div>
          {rows.length ? (
            <DataTable
              columns={[
                {
                  key: 'displayId',
                  label: 'ID',
                  render: (r) => r.displayId || r.number || idOf(r),
                },
                {
                  key: 'survey',
                  label: 'Survey',
                  render: (r) => r.surveyName || r.survey?.name || '—',
                },
                {
                  key: 'branch',
                  label: 'Branch',
                  render: (r) => r.branchName || r.branch?.name || '—',
                },
                { key: 'preview', label: 'Customer feedback', render: (r) => r.preview || '—' },
                { key: 'sentiment', label: 'Sentiment', render: (r) => r.sentiment || '—' },
                { key: 'submittedAt', label: 'Date', render: (r) => date(r.submittedAt) },
                {
                  key: 'analysisStatus',
                  label: 'Analysis',
                  render: (r) => r.analysisStatus || r.analysis?.status || '—',
                },
                {
                  key: 'open',
                  label: '',
                  render: (r) => (
                    <button
                      style={button}
                      onClick={() => (location.hash = `/feedback-details?id=${idOf(r)}`)}
                    >
                      Details
                    </button>
                  ),
                },
              ]}
              rows={rows}
            />
          ) : (
            <Empty>{t('No responses yet.', 'لا توجد ردود بعد.')}</Empty>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
            <span style={muted}>Page {pagination.page || filters.page}</span>
            <button
              style={button}
              disabled={filters.page <= 1}
              onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
            >
              Previous
            </button>
            <button
              style={button}
              disabled={
                (pagination.totalPages && filters.page >= pagination.totalPages) ||
                (!pagination.totalPages && rows.length < filters.limit)
              }
              onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
            >
              Next
            </button>
          </div>
        </section>
      </PageFrame>
    );
  }
  if (route === 'feedback-details') {
    const d = data?.detail || {};
    return (
      <PageFrame
        title="Feedback details"
        actions={
          <button style={button} onClick={() => (location.hash = '/feedbacks')}>
            Back to feedbacks
          </button>
        }
      >
        <Notice error={error} />
        <section style={panel}>
          <MetricGrid
            data={{
              id: d.displayId || d.id,
              submittedAt: date(d.submittedAt),
              branch: d.branchName || d.branch?.name,
              survey: d.surveyName || d.survey?.name,
              analysisStatus: d.analysisStatus,
            }}
          />
          <h2>Customer response</h2>
          {d.respondent?.name && (
            <p>
              <strong>Respondent:</strong> {d.respondent.name}
            </p>
          )}
          {d.original?.question && <strong>{d.original.question}</strong>}
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
            {d.original?.text || 'No written comment was provided.'}
          </p>
          <p style={muted}>
            Language: {d.language || '—'} · Channel: {d.channel || '—'}
          </p>
        </section>
        {data?.analysis && (
          <section style={panel}>
            <h2>AI analysis</h2>
            <StructuredData value={data.analysis} />
          </section>
        )}
        {['failed', 'partial'].includes(d.analysisStatus) && (
          <button
            style={primary}
            onClick={async () => {
              try {
                await feedbackApi.retryAnalysis(d.id);
                setSuccess('Analysis retry requested.');
                await load();
              } catch (e) {
                setError(messageOf(e));
              }
            }}
          >
            Retry analysis
          </button>
        )}
      </PageFrame>
    );
  }
  return (
    <PageFrame title="Feature">
      <Notice error={error} />
      <Empty>Feature route not recognized.</Empty>
    </PageFrame>
  );
}
