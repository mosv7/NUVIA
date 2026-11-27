import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { surveyApi } from '../surveys/api.js';
import { publicSurveyApi } from '../public-surveys/api.js';
import { analyticsApi } from '../analytics/api.js';
import { reportsApi } from '../reports/api.js';
import { downloadReportsCsv } from '../reports/export.js';
import { FeedbackList } from '../feedback/FeedbackScreens.jsx';
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
async function loadSections(requests) {
  const results = await Promise.allSettled(Object.values(requests));
  return Object.fromEntries(
    Object.keys(requests).map((key, index) => {
      const result = results[index];
      return [
        key,
        result.status === 'fulfilled' ? unwrap(result.value) : { error: messageOf(result.reason) },
      ];
    }),
  );
}

function publicSurveyError(error, t) {
  if (error?.status === 404)
    return t('This survey link is unavailable.', 'رابط الاستبيان غير متاح.');
  if (error?.status === 429)
    return t(
      'Too many requests. Please try again shortly.',
      'طلبات كثيرة. يرجى المحاولة بعد قليل.',
    );
  return t(
    'The survey could not be loaded. Please try again.',
    'تعذر تحميل الاستبيان. يرجى المحاولة مرة أخرى.',
  );
}

const newSubmissionId = () =>
  globalThis.crypto?.randomUUID?.() ||
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

function PageFrame({ title, subtitle, children, actions, language }) {
  return (
    <main
      lang={language}
      dir={language && (language === 'ar' ? 'rtl' : 'ltr')}
      style={{ maxWidth: 1120, margin: '0 auto', padding: '28px 24px 60px', color: '#20263a' }}
    >
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
function Loading({ children = 'Loading…' }) {
  return (
    <div style={panel} role="status">
      {children}
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

function SurveyScopeFields({ draft, setDraft, branches, branchIds, setBranchIds, t }) {
  return (
    <>
      <fieldset style={{ ...field, border: 0, padding: 0, marginInline: 0 }}>
        <legend>{t('Survey languages', 'لغات الاستبيان')}</legend>
        {['en', 'ar'].map((locale) => {
          const checked = draft.languages.includes(locale);
          return (
            <label key={locale} lang={locale}>
              <input
                type="checkbox"
                checked={checked}
                disabled={checked && draft.languages.length === 1}
                onChange={(event) => {
                  const languages = event.target.checked
                    ? [...draft.languages, locale]
                    : draft.languages.filter((value) => value !== locale);
                  setDraft({
                    ...draft,
                    languages,
                    defaultLanguage: languages.includes(draft.defaultLanguage)
                      ? draft.defaultLanguage
                      : languages[0],
                  });
                }}
              />{' '}
              {locale === 'ar' ? 'العربية' : 'English'}
            </label>
          );
        })}
      </fieldset>
      <label style={field}>
        {t('Default language', 'اللغة الافتراضية')}
        <select
          style={input}
          value={draft.defaultLanguage}
          onChange={(event) => setDraft({ ...draft, defaultLanguage: event.target.value })}
        >
          {draft.languages.map((locale) => (
            <option key={locale} value={locale} lang={locale}>
              {locale === 'ar' ? 'العربية' : 'English'}
            </option>
          ))}
        </select>
      </label>
      {branches.length > 0 && (
        <fieldset style={{ ...field, border: 0, padding: 0, marginInline: 0 }}>
          <legend>{t('Survey branches', 'فروع الاستبيان')}</legend>
          {branches.map((branch) => (
            <label key={branch.id}>
              <input
                type="checkbox"
                checked={branchIds.includes(branch.id)}
                onChange={(event) =>
                  setBranchIds(
                    event.target.checked
                      ? [...branchIds, branch.id]
                      : branchIds.filter((id) => id !== branch.id),
                  )
                }
              />{' '}
              <bdi>{branch.name}</bdi>
            </label>
          ))}
        </fieldset>
      )}
    </>
  );
}

function ReportQuality({ report, t }) {
  if (!report || report.qualityAccepted === true) return null;
  return (
    <p style={muted}>
      {report.qualityStatus === 'baseline'
        ? t(
            'Experimental AI output. Quality has not been accepted.',
            'مخرجات ذكاء اصطناعي تجريبية. لم تُقبل جودتها بعد.',
          )
        : t(
            'AI quality has not been verified for this saved report.',
            'لم تُتحقق جودة الذكاء الاصطناعي لهذا التقرير المحفوظ.',
          )}
    </p>
  );
}

function ReportContent({ report, t }) {
  if (!report) return null;
  return (
    <section style={panel}>
      <ReportQuality report={report} t={t} />
      <p dir="auto">{report.executiveSummary}</p>
      <MetricGrid
        data={{
          period: report.periodCovered,
          responses: report.totalReviewsAnalyzed,
          analyzedTextCount: report.analyzedTextCount,
        }}
      />
      {[
        [t('Strengths', 'نقاط القوة'), report.strengths],
        [t('Problems', 'المشكلات'), report.problems],
        [t('Suggested actions', 'الإجراءات المقترحة'), report.suggestedActions],
      ]
        .filter(([, claims]) => claims?.length)
        .map(([title, claims]) => (
          <section key={title}>
            <h3>{title}</h3>
            <ul>
              {claims.map((claim, index) => (
                <li key={index}>
                  <p dir="auto">{claim.text || claim.suggestion}</p>
                  {claim.metricsText && <p dir="auto">{claim.metricsText}</p>}
                  {claim.citations?.map((citation, i) => (
                    <blockquote key={i} dir="auto">
                      {citation.quote}{' '}
                      {/^[a-f0-9]{24}$/i.test(citation.responseId || '') && (
                        <a
                          href={'#/feedback-details?id=' + encodeURIComponent(citation.responseId)}
                        >
                          {t('Feedback', 'الرد')} {citation.number && <bdi>#{citation.number}</bdi>}
                        </a>
                      )}
                    </blockquote>
                  ))}
                </li>
              ))}
            </ul>
          </section>
        ))}
    </section>
  );
}

export default function ConnectedFeaturePage({ route, language = 'en', workspace }) {
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
  }));
  const [reportDates, setReportDates] = useState({ from: '', to: '' });
  const [generatedReport, setGeneratedReport] = useState(null);
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
  const [selectedBranches, setSelectedBranches] = useState(undefined);
  const [formAnswers, setFormAnswers] = useState({});
  const [respondent, setRespondent] = useState({ name: '', email: '' });
  const [submissionId, setSubmissionId] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copiedSurveyCode, setCopiedSurveyCode] = useState('');
  const ar = language === 'ar';
  const t = useCallback((en, arabic) => (ar ? arabic : en), [ar]);
  const latestLoad = useRef(null);
  const publicSubmit = useRef(null);
  const reportGeneration = useRef(null);
  useEffect(
    () => () => {
      publicSubmit.current?.abort();
      reportGeneration.current?.abort();
    },
    [],
  );
  const load = useCallback(() => latestLoad.current?.(), []);
  const [loading, setLoading] = useState(true);
  const params = new URLSearchParams(location.hash.split('?')[1] || '');
  const surveyId = params.get('id');
  const shortCode = params.get('code') || new URLSearchParams(location.search).get('code');
  const publicBranch = params.get('branch');
  const publicState = route === 'public-survey' ? data : null;
  const surveyLanguages = publicState?.survey?.languages || [
    publicState?.survey?.defaultLanguage || 'en',
  ];
  const [chosenFormLanguage, setChosenFormLanguage] = useState(null);
  const preferredFormLanguage =
    chosenFormLanguage || params.get('lang') || new URLSearchParams(location.search).get('lang');
  const formLanguage = surveyLanguages.includes(preferredFormLanguage)
    ? preferredFormLanguage
    : publicState?.survey?.defaultLanguage || 'en';
  const formText = (en, arabic) => (formLanguage === 'ar' ? arabic : en);
  const localized = (en, arabic) => (formLanguage === 'ar' ? arabic || en : en || arabic);
  const activeBranches = (workspace?.branches || []).filter((branch) => branch.status === 'active');
  const availableBranchIds = activeBranches.map((branch) => branch.id);
  const branchIds =
    selectedBranches ??
    (route === 'surveys'
      ? availableBranchIds
      : (data?.branches?.items || [])
          .map((branch) => branch.id)
          .filter((id) => availableBranchIds.includes(id)));
  const surveyScopeFields = (
    <SurveyScopeFields
      draft={draft}
      setDraft={setDraft}
      branches={activeBranches}
      branchIds={branchIds}
      setBranchIds={setSelectedBranches}
      t={t}
    />
  );

  const fetchFeature = useCallback(
    async (signal) => {
      const dates = {
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      };
      const scope = { ...dates, branchId: filters.branchId || undefined };
      if (route === 'surveys') {
        const [list, summary, templates] = await Promise.all([
          surveyApi.list(
            {
              status: filters.status,
              search: filters.search,
              page: filters.page,
              limit: filters.limit,
            },
            signal,
          ),
          surveyApi.summary(signal),
          surveyApi.templates(signal),
        ]);
        return { list: unwrap(list), summary: unwrap(summary), templates: arr(unwrap(templates)) };
      }
      if (route === 'survey-edit' || route === 'survey-questions')
        return unwrap(await surveyApi.get(surveyId, signal));
      if (route === 'analytics' || route === 'analytics-sentiment')
        return loadSections({
          summary: analyticsApi.sentimentSummary(scope, signal),
          trends: analyticsApi.sentimentTrends(scope, signal),
          responses: analyticsApi.sentimentResponses(scope, signal),
        });
      if (route === 'analytics-aspects')
        return loadSections({
          aspects: analyticsApi.aspectAnalysis(scope, signal),
          scores: analyticsApi.aspectScoreComparison(scope, signal),
        });
      if (route === 'analytics-topics')
        return loadSections({ topics: analyticsApi.topicsAndComplaints(scope, signal) });
      if (route === 'analytics-trends')
        return loadSections({ trends: analyticsApi.trendsAndSignals(scope, signal) });
      if (route === 'analytics-comparison')
        return loadSections({
          comparison: analyticsApi.branchComparison(dates, signal),
        });
      if (route === 'dashboard' || route === 'overview')
        return loadSections({
          metrics: analyticsApi.overviewMetrics(scope, signal),
          trends: analyticsApi.overviewTrends(scope, signal),
          sentiment: analyticsApi.overviewSentiment(scope, signal),
          branches: analyticsApi.overviewBranches({}, signal),
          aspects: analyticsApi.aspectScores(scope, signal),
          actions: analyticsApi.nextActions(scope, signal),
        });
      if (route === 'action-board') return unwrap(await analyticsApi.nextActions({}, signal));
      if (route === 'reports') return reportsApi.listPage(filters.page, signal);
      if (route === 'report-details') return reportsApi.get(surveyId, signal);
      if (route === 'feedbacks' || route === 'feedbacks-empty') {
        const query = {
          search: filters.search,
          range: filters.range,
          sentiment: filters.sentiment || undefined,
          branchId: filters.branchId || undefined,
          surveyId: filters.surveyId || undefined,
        };
        const [list, filterData] = await Promise.all([
          feedbackApi.list(
            {
              ...query,
              page: filters.page,
              limit: filters.limit,
            },
            signal,
          ),
          feedbackApi.filters(signal),
        ]);
        return { list: unwrap(list), filters: unwrap(filterData), query };
      }
      if (route === 'public-survey') {
        if (!shortCode) throw Object.assign(new Error(), { status: 404 });
        return unwrap(await publicSurveyApi.get(shortCode, publicBranch, signal));
      }
      return null;
    },
    [route, filters, surveyId, shortCode, publicBranch],
  );

  useLayoutEffect(() => {
    let request;
    latestLoad.current = async () => {
      request?.abort();
      const controller = new AbortController();
      request = controller;
      const { signal } = controller;
      setLoading(true);
      setError('');
      try {
        const result = await fetchFeature(signal);
        if (signal.aborted) return null;
        setData(result);
        if (route === 'public-survey') {
          setFormAnswers({});
          setSubmissionId(newSubmissionId());
        }
        return result;
      } catch (failure) {
        if (!signal.aborted)
          setError(route === 'public-survey' ? publicSurveyError(failure, t) : messageOf(failure));
        return null;
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    };
    return () => {
      request?.abort();
      latestLoad.current = null;
    };
  }, [fetchFeature, route, t]);

  async function copyPublicLink(code) {
    const url = connectedSurveyUrl(code);
    if (!url) {
      setError('A public link is not available for this survey.');
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setError('');
      setSuccess(
        t(
          'Public survey link copied. Keep the original site origin.',
          'تم نسخ رابط الاستبيان. استخدم عنوان الموقع الأصلي.',
        ),
      );
      setCopiedSurveyCode(code);
    } catch {
      setError(`Copy this public survey link manually: ${url}`);
    }
  }
  useEffect(() => {
    load();
  }, [fetchFeature, load, route, t]);
  useEffect(() => {
    if (['survey-edit', 'survey-questions'].includes(route) && data) {
      setDraft({
        name: data.name || '',
        message: data.message || '',
        thankYouMessage: data.thankYouMessage || '',
        languages: data.languages || ['en'],
        defaultLanguage: data.defaultLanguage || 'en',
        isAnonymous: data.isAnonymous !== false,
      });
      setSelectedBranches(undefined);
    }
  }, [route, data]);

  async function createSurvey() {
    if (!draft.name.trim()) {
      setError('Survey name is required.');
      return;
    }
    if (selectedBranches?.length === 0) {
      setError(t('Choose at least one branch.', 'اختر فرعًا واحدًا على الأقل.'));
      return;
    }
    setBusy(true);
    try {
      const r = unwrap(await surveyApi.create({ ...draft, branchIds: selectedBranches }));
      location.hash = `/survey-edit?id=${idOf(r)}`;
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  }
  async function saveSurvey() {
    if (selectedBranches?.length === 0) {
      setError(t('Choose at least one branch.', 'اختر فرعًا واحدًا على الأقل.'));
      return;
    }
    setBusy(true);
    try {
      await surveyApi.update(surveyId, { ...draft, branchIds: selectedBranches });
      await load();
      setSuccess(t('Survey saved.', 'تم حفظ الاستبيان.'));
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setBusy(false);
    }
  }
  async function addQuestion() {
    if (
      !surveyId ||
      !(questionDraft.questionTextEn.trim() || questionDraft.questionTextAr.trim())
    ) {
      setError(t('Enter question text.', 'أدخل نص السؤال.'));
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
    if (reportGeneration.current) return;
    const { from, to } = reportDates;
    if (Boolean(from) !== Boolean(to)) {
      setError('Choose both report dates or leave both empty.');
      return;
    }
    if (from && to && from > to) {
      setError('The start date must be before the end date.');
      return;
    }
    const controller = new AbortController();
    reportGeneration.current = controller;
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      const report = await reportsApi.generate(
        {
          from: from || undefined,
          to: to || undefined,
          locale: language,
        },
        controller.signal,
      );
      if (controller.signal.aborted) return;
      setGeneratedReport(report);
      if (filters.page === 1) await load();
      else setFilters((previous) => ({ ...previous, page: 1 }));
      if (!controller.signal.aborted) setSuccess('Report generated and saved.');
    } catch (e) {
      if (!controller.signal.aborted) setError(messageOf(e));
    } finally {
      reportGeneration.current = null;
      if (!controller.signal.aborted) setBusy(false);
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
      setSuccess('Current report page exported as CSV.');
    } catch {
      setError('The saved report list could not be exported.');
    }
  }
  async function submitPublic(e) {
    e.preventDefault();
    if (publicSubmit.current || busy || loading || !submissionId) return;
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
      .filter(
        (a) => a.optionIds?.length > 0 || (a.value !== undefined && String(a.value).trim() !== ''),
      );
    const answeredIds = new Set(answers.map((answer) => answer.questionId));
    if (q.some((item) => item.isRequired && !answeredIds.has(idOf(item)))) {
      setError(
        formText(
          'Answer every required question before submitting.',
          'أجب عن جميع الأسئلة المطلوبة قبل الإرسال.',
        ),
      );
      return;
    }
    if (!answers.length) {
      setError(
        formText(
          'Answer at least one question before submitting.',
          'أجبي عن سؤال واحد على الأقل قبل الإرسال.',
        ),
      );
      return;
    }
    const controller = new AbortController();
    publicSubmit.current = controller;
    setBusy(true);
    setError('');
    try {
      await publicSurveyApi.submit(
        shortCode,
        {
          formVersion: publicState.formVersion,
          submissionId,
          branch: publicState.branch?.slug,
          language: formLanguage,
          channel: 'short_link',
          answers,
          respondent: publicState.survey?.isAnonymous
            ? undefined
            : {
                ...(respondent.name.trim() ? { name: respondent.name.trim() } : {}),
                ...(respondent.email.trim() ? { email: respondent.email.trim() } : {}),
              },
        },
        controller.signal,
      );
      if (controller.signal.aborted) return;
      setSubmitted(true);
      setFormAnswers({});
    } catch (e) {
      if (controller.signal.aborted) return;
      if (e?.status === 409) {
        setData(null);
        const refreshed = await load();
        if (refreshed?.state === 'open')
          setError(
            formText(
              'The survey changed. Review the latest questions and submit again.',
              'تغيّر الاستبيان. راجعي الأسئلة الحالية وأعيدي الإرسال.',
            ),
          );
      } else if (e?.status === 404 || e?.status === 429) setError(publicSurveyError(e, formText));
      else
        setError(
          formText(
            'Feedback could not be submitted. Check your answers and try again.',
            'تعذر إرسال الملاحظات. راجع إجاباتك وحاول مرة أخرى.',
          ),
        );
    } finally {
      publicSubmit.current = null;
      if (!controller.signal.aborted) setBusy(false);
    }
  }

  if (loading && !data && route !== 'public-survey')
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
            {surveyScopeFields}
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
                    {r.status !== 'draft' && r.shortCode && (
                      <>
                        <a style={button} href={connectedSurveyUrl(r.shortCode)}>
                          {t('Public link', 'رابط الاستبيان')}
                        </a>
                        <button style={button} onClick={() => copyPublicLink(r.shortCode)}>
                          {copiedSurveyCode === r.shortCode
                            ? t('Link copied', 'تم نسخ الرابط')
                            : t('Copy public link', 'نسخ رابط الاستبيان')}
                        </button>
                      </>
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
                  await load();
                  setSuccess(t('Survey published.', 'تم نشر الاستبيان.'));
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
          {surveyScopeFields}
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
              {questionDraft.options.map((option, index) => (
                <div key={index} style={{ display: 'grid', gap: 6, marginBottom: 7 }}>
                  {draft.languages.map((locale) => (
                    <label key={locale} style={field}>
                      {locale === 'ar'
                        ? `الخيار ${index + 1} بالعربية`
                        : `Option ${index + 1} in English`}
                      <input
                        style={input}
                        dir={locale === 'ar' ? 'rtl' : 'ltr'}
                        value={option.label[locale]}
                        onChange={(event) =>
                          setQuestionDraft((current) => ({
                            ...current,
                            options: current.options.map((item, position) =>
                              position === index
                                ? {
                                    ...item,
                                    label: { ...item.label, [locale]: event.target.value },
                                  }
                                : item,
                            ),
                          }))
                        }
                      />
                    </label>
                  ))}
                </div>
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
    const p = publicState;
    if (!p)
      return (
        <PageFrame title={t('Survey', 'الاستبيان')} language={language}>
          <Notice error={error} />
          {loading && <Loading>{t('Loading survey…', 'جارٍ تحميل الاستبيان…')}</Loading>}
          {error && (
            <button style={button} onClick={load}>
              {t('Retry', 'إعادة المحاولة')}
            </button>
          )}
        </PageFrame>
      );
    const title = p.survey?.name || formText('Customer survey', 'استبيان العملاء');
    const languageSelector = surveyLanguages.length > 1 && (
      <label style={field}>
        {formText('Survey language', 'لغة الاستبيان')}
        <select
          style={input}
          value={formLanguage}
          onChange={(event) => setChosenFormLanguage(event.target.value)}
        >
          {surveyLanguages.map((value) => (
            <option key={value} value={value} lang={value}>
              {value === 'ar' ? 'العربية' : 'English'}
            </option>
          ))}
        </select>
      </label>
    );
    if (submitted)
      return (
        <PageFrame title={title} language={formLanguage}>
          <section style={panel} role="status">
            <h2 dir="auto">
              {p.survey?.thankYouMessage ||
                formText('Thank you for your feedback!', 'شكرًا على ملاحظاتك!')}
            </h2>
          </section>
        </PageFrame>
      );
    if (p.state === 'branch_required')
      return (
        <PageFrame title={title} language={formLanguage} actions={languageSelector}>
          <section style={panel}>
            <h2>{formText('Select your branch', 'اختر الفرع')}</h2>
            {(p.branches || []).map((b) => (
              <p key={b.slug}>
                <a
                  dir="auto"
                  href={`#/public-survey?code=${encodeURIComponent(shortCode)}&branch=${encodeURIComponent(b.slug)}&lang=${formLanguage}`}
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
        <PageFrame title={title} language={formLanguage} actions={languageSelector}>
          <Empty>
            {{
              paused: formText('This survey is paused.', 'هذا الاستبيان متوقف مؤقتًا.'),
              closed: formText('This survey is closed.', 'هذا الاستبيان مغلق.'),
              branch_unavailable: formText('This branch is unavailable.', 'هذا الفرع غير متاح.'),
            }[p.state] || formText('This survey is unavailable.', 'هذا الاستبيان غير متاح.')}
          </Empty>
        </PageFrame>
      );
    return (
      <PageFrame
        title={title}
        language={formLanguage}
        subtitle={[p.businessName, p.branch?.name].filter(Boolean).join(' · ')}
        actions={languageSelector}
      >
        <Notice error={error} />
        <form onSubmit={submitPublic} style={panel}>
          {p.survey?.welcomeMessage && <p dir="auto">{p.survey.welcomeMessage}</p>}
          {(p.questions || []).map((q, index) => {
            const questionId = idOf(q);
            const controlId = `survey-question-${questionId}`;
            const value = formAnswers[questionId];
            const setValue = (next) =>
              setFormAnswers((answers) => ({ ...answers, [questionId]: next }));
            const label = (
              <>
                {index + 1}. {localized(q.questionTextEn, q.questionTextAr)}
                {q.isRequired ? ' *' : ''}
              </>
            );
            const choiceLabel = (option) => localized(option.label?.en, option.label?.ar);
            if (q.type === 'multiple_choice') {
              const multiple = q.settings?.allowMultiple === true;
              return (
                <fieldset
                  key={questionId}
                  style={{ ...field, border: 0, padding: 0, marginInline: 0, marginBottom: 20 }}
                >
                  <legend style={{ fontWeight: 700 }}>{label}</legend>
                  {(q.options || []).map((option) => {
                    const optionId = idOf(option);
                    return (
                      <label key={optionId}>
                        <input
                          type={multiple ? 'checkbox' : 'radio'}
                          name={controlId}
                          checked={multiple ? (value || []).includes(optionId) : value === optionId}
                          required={!multiple && q.isRequired}
                          onChange={(event) => {
                            if (!multiple) setValue(optionId);
                            else if (event.target.checked) setValue([...(value || []), optionId]);
                            else
                              setValue((value || []).filter((existing) => existing !== optionId));
                          }}
                        />{' '}
                        {choiceLabel(option)}
                      </label>
                    );
                  })}
                </fieldset>
              );
            }

            const common = {
              id: controlId,
              required: q.isRequired,
              style: input,
              value: value ?? '',
            };
            const textChange = (event) => setValue(event.target.value);
            const choicePrompt = formText('Choose an answer', 'اختر إجابة');
            let control;
            if (q.type === 'long_text' || q.type === 'short_text') {
              const TextControl = q.type === 'long_text' ? 'textarea' : 'input';
              control = (
                <TextControl
                  {...common}
                  dir="auto"
                  maxLength={q.settings?.maxLength}
                  onChange={textChange}
                />
              );
            } else if (q.type === 'rating') {
              control = (
                <select
                  {...common}
                  onChange={(event) =>
                    setValue(event.target.value ? Number(event.target.value) : undefined)
                  }
                >
                  <option value="">{formText('Choose rating', 'اختر التقييم')}</option>
                  {Array.from({ length: q.settings?.stars || 5 }, (_, index) => index + 1).map(
                    (rating) => (
                      <option key={rating} value={rating}>
                        {rating.toLocaleString(formLanguage)}
                      </option>
                    ),
                  )}
                </select>
              );
            } else if (q.type === 'yes_no') {
              control = (
                <select
                  {...common}
                  value={value === undefined ? '' : String(value)}
                  onChange={(event) =>
                    setValue(event.target.value ? event.target.value === 'true' : undefined)
                  }
                >
                  <option value="">{choicePrompt}</option>
                  <option value="true">{formText('Yes', 'نعم')}</option>
                  <option value="false">{formText('No', 'لا')}</option>
                </select>
              );
            } else if (q.type === 'dropdown') {
              control = (
                <select {...common} onChange={textChange}>
                  <option value="">{choicePrompt}</option>
                  {(q.options || []).map((option) => (
                    <option key={idOf(option)} value={idOf(option)}>
                      {choiceLabel(option)}
                    </option>
                  ))}
                </select>
              );
            } else return null;
            return (
              <div key={questionId} style={{ ...field, marginBottom: 20 }}>
                <label htmlFor={controlId} style={{ fontWeight: 700 }}>
                  {label}
                </label>
                {control}
              </div>
            );
          })}
          {!p.survey?.isAnonymous && (
            <>
              <label style={field}>
                {formText('Name', 'الاسم')}
                <input
                  style={input}
                  autoComplete="name"
                  dir="auto"
                  value={respondent.name}
                  onChange={(e) => setRespondent((r) => ({ ...r, name: e.target.value }))}
                />
              </label>
              <label style={field}>
                {formText('Email', 'البريد الإلكتروني')}
                <input
                  type="email"
                  autoComplete="email"
                  dir="ltr"
                  style={input}
                  value={respondent.email}
                  onChange={(e) => setRespondent((r) => ({ ...r, email: e.target.value }))}
                />
              </label>
            </>
          )}
          <button style={primary} disabled={busy || loading}>
            {busy
              ? formText('Submitting…', 'جارٍ الإرسال…')
              : formText('Submit feedback', 'إرسال الملاحظات')}
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
            <>
              <ReportQuality report={data} t={t} />
              <ol style={{ lineHeight: 1.8 }}>
                {actions.map((item, index) => (
                  <li key={index} dir="auto">
                    {typeof item === 'string' ? item : <StructuredData value={item} />}
                  </li>
                ))}
              </ol>
            </>
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
    const analytics = route.startsWith('analytics');
    return (
      <PageFrame title={analytics ? t('Analytics', 'التحليلات') : t('Overview', 'نظرة عامة')}>
        <Notice error={error} />
        {analytics && (
          <nav
            aria-label={t('Analytics views', 'أقسام التحليلات')}
            style={{ ...panel, display: 'flex', gap: 12, flexWrap: 'wrap' }}
          >
            {[
              ['sentiment', t('Sentiment', 'المشاعر')],
              ['aspects', t('Aspects', 'الجوانب')],
              ['topics', t('Topics', 'الموضوعات')],
              ['trends', t('Trends', 'الاتجاهات')],
              ['comparison', t('Branch comparison', 'مقارنة الفروع')],
            ].map(([view, label]) => (
              <a
                key={view}
                href={'#/analytics-' + view}
                aria-current={
                  route === 'analytics-' + view || (route === 'analytics' && view === 'sentiment')
                    ? 'page'
                    : undefined
                }
              >
                {label}
              </a>
            ))}
          </nav>
        )}
        <section style={panel}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'end' }}>
            <label style={field}>
              {t('From', 'من')}
              <input
                type="date"
                style={input}
                value={filters.startDate}
                onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
              />
            </label>
            <label style={field}>
              {t('To', 'إلى')}
              <input
                type="date"
                style={input}
                value={filters.endDate}
                onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
              />
            </label>
            <button style={primary} onClick={load}>
              {t('Apply date range', 'تطبيق الفترة')}
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
          <ReportContent report={data} t={t} />
        </PageFrame>
      );
    return (
      <PageFrame
        title="Reports"
        subtitle="Generate and review saved reports"
        actions={
          <span style={{ display: 'flex', gap: 8 }}>
            <button style={button} onClick={exportReports} disabled={!reports.length || loading}>
              Export current page
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
                value={reportDates.from}
                onChange={(e) => setReportDates((f) => ({ ...f, from: e.target.value }))}
              />
            </label>
            <label style={field}>
              To
              <input
                type="date"
                style={input}
                value={reportDates.to}
                onChange={(e) => setReportDates((f) => ({ ...f, to: e.target.value }))}
              />
            </label>
            <span style={muted}>Leave dates empty to use the latest 30 days.</span>
          </div>
        </section>
        {generatedReport && (
          <section style={panel}>
            <h2>New report generated</h2>
            <ReportContent report={generatedReport} t={t} />
          </section>
        )}
        <DataTable
          columns={[
            { key: 'reportName', label: 'Report' },
            { key: 'periodCovered', label: 'Period' },
            { key: 'totalReviewsAnalyzed', label: 'Responses' },
            {
              key: 'qualityStatus',
              label: t('AI quality', 'جودة الذكاء الاصطناعي'),
              render: (report) =>
                report.qualityAccepted === true
                  ? t('Accepted', 'مقبولة')
                  : report.qualityStatus === 'baseline'
                    ? t('Experimental', 'تجريبية')
                    : t('Unverified', 'غير متحقق منها'),
            },
            { key: 'createdAt', label: 'Created', render: (r) => date(r.createdAt) },
            {
              key: 'open',
              label: '',
              render: (r) => (
                <button
                  style={button}
                  onClick={() => {
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
        <nav
          aria-label={t('Report pages', 'صفحات التقارير')}
          style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}
        >
          <span>
            {t('Page', 'صفحة')} {data?.pagination?.page || filters.page}
          </span>
          <button
            style={button}
            disabled={busy || loading || filters.page <= 1}
            onClick={() => setFilters((previous) => ({ ...previous, page: previous.page - 1 }))}
          >
            {t('Previous', 'السابق')}
          </button>
          <button
            style={button}
            disabled={busy || loading || !data?.pagination?.hasMore}
            onClick={() => setFilters((previous) => ({ ...previous, page: previous.page + 1 }))}
          >
            {t('Next', 'التالي')}
          </button>
        </nav>
      </PageFrame>
    );
  }
  if (route === 'feedbacks' || route === 'feedbacks-empty') {
    const payload = data?.list || {};
    const rows = Array.isArray(payload)
      ? payload
      : payload.feedbacks || payload.responses || payload.items || [];
    const pagination = payload.pagination || {};
    if (payload.hasAnyResponses === false && !rows.length && !error) return <FeedbackList empty />;
    return (
      <PageFrame
        title="Feedbacks"
        subtitle="Customer responses from your surveys"
        actions={
          !loading &&
          !error &&
          rows.length > 0 && (
            <a style={button} href={feedbackApi.exportLink(data.query)} download>
              {t('Export CSV', 'تصدير CSV')}
            </a>
          )
        }
      >
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
            !error && (
              <Empty>
                {t('No responses match your filters.', 'لا توجد ردود تطابق عوامل التصفية.')}
              </Empty>
            )
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
  return (
    <PageFrame title="Feature">
      <Notice error={error} />
      <Empty>Feature route not recognized.</Empty>
    </PageFrame>
  );
}
