import { useCallback, useEffect, useState } from 'react';
import { surveyApi } from '../surveys/api.js';
import { feedbackApi } from '../feedback/api.js';
import { analyticsApi } from '../analytics/api.js';
import { reportsApi } from '../reports/api.js';
import { useAuth } from '../../app/providers/AuthProvider.jsx';

const styles = {
  wrap: {
    maxWidth: 1120,
    margin: '0 auto',
    padding: '28px 24px',
    color: 'var(--text-primary, #20242c)',
  },
  card: {
    border: '1px solid var(--border, #e5e7eb)',
    borderRadius: 14,
    padding: 18,
    background: 'var(--surface, #fff)',
    margin: '14px 0',
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  field: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 8,
    minWidth: 220,
    maxWidth: '100%',
  },
  button: {
    padding: '10px 16px',
    border: 0,
    borderRadius: 8,
    background: '#2457d6',
    color: 'white',
    cursor: 'pointer',
  },
};
const pickArray = (value, keys = []) => {
  if (Array.isArray(value)) return value;
  for (const key of keys) if (Array.isArray(value?.[key])) return value[key];
  return [];
};
const titleOf = (item) =>
  item?.title ||
  item?.name ||
  item?.subject ||
  item?.text ||
  item?.question ||
  item?.id ||
  'Untitled';

export default function ConnectedWorkspaceData({ type, language = 'en' }) {
  const ar = language === 'ar';
  const auth = useAuth();
  const [data, setData] = useState(null),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const [name, setName] = useState(''),
    [description, setDescription] = useState(''),
    [notice, setNotice] = useState('');
  const [filters, setFilters] = useState({});
  const copy = useCallback((en, aa) => (ar ? aa : en), [ar]);
  const load = useCallback(
    async (signal) => {
      setError('');
      try {
        let result;
        if (type === 'surveys') {
          const [surveys, templates] = await Promise.all([
            surveyApi.list({}, signal),
            surveyApi.templates(signal),
          ]);
          result = { surveys, templates };
        } else if (type === 'feedbacks') {
          const [feedbacks, filtersData] = await Promise.all([
            feedbackApi.list(filters, signal),
            feedbackApi.filters(signal),
          ]);
          result = { feedbacks, filters: filtersData };
        } else if (type === 'analytics') {
          const [metrics, trends, sentiment, branches] = await Promise.all([
            analyticsApi.overviewMetrics(filters, signal),
            analyticsApi.overviewTrends(filters, signal),
            analyticsApi.overviewSentiment(filters, signal),
            analyticsApi.overviewBranches(filters, signal),
          ]);
          result = { metrics, trends, sentiment, branches };
        } else if (type === 'reports') result = await reportsApi.list(signal);
        else if (type === 'report-details') {
          const id = new URLSearchParams(location.hash.split('?')[1]).get('id');
          if (!id)
            throw new Error(
              copy('Missing report ID in the page URL.', 'معرّف التقرير غير موجود في الرابط.'),
            );
          result = await reportsApi.get(id, signal);
        }
        setData(result);
      } catch (e) {
        if (!signal?.aborted)
          setError(
            e?.message ||
              copy('Could not load data from the API.', 'تعذر تحميل البيانات من الـAPI.'),
          );
      }
    },
    [type, filters, copy],
  );
  useEffect(() => {
    const c = new AbortController();
    load(c.signal);
    return () => c.abort();
  }, [load, auth?.workspace?.id]);
  const createSurvey = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setNotice('');
    try {
      await surveyApi.create({ name: name.trim(), description: description.trim() });
      setName('');
      setDescription('');
      setNotice(copy('Survey created.', 'تم إنشاء الاستبيان.'));
      await load();
    } catch (e) {
      setNotice(
        e?.message ||
          copy(
            'Survey could not be created. Check required fields and try again.',
            'تعذر إنشاء الاستبيان. راجعي البيانات المطلوبة.',
          ),
      );
    } finally {
      setBusy(false);
    }
  };
  const generateReport = async () => {
    setBusy(true);
    setNotice('');
    try {
      await reportsApi.generate({ ...filters });
      setNotice(copy('Report request submitted.', 'تم إرسال طلب التقرير.'));
      await load();
    } catch (e) {
      setNotice(
        e?.message ||
          copy(
            'Report generation is unavailable for this account.',
            'إنشاء التقرير غير متاح لهذا الحساب.',
          ),
      );
    } finally {
      setBusy(false);
    }
  };
  const rows =
    type === 'surveys'
      ? pickArray(data, ['surveys', 'data'])
      : type === 'feedbacks'
        ? pickArray(data, ['feedbacks', 'responses', 'data'])
        : type === 'reports'
          ? pickArray(data, ['reports', 'data'])
          : [];
  const heading = {
    'report-details': copy('Report details', 'تفاصيل التقرير'),
    surveys: copy('Surveys', 'الاستبيانات'),
    feedbacks: copy('Feedback responses', 'ردود العملاء'),
    analytics: copy('Analytics', 'التحليلات'),
    reports: copy('Reports', 'التقارير'),
  }[type];
  return (
    <main style={styles.wrap}>
      <div style={styles.row}>
        <div>
          <h1 style={{ margin: '0 0 6px' }}>{heading}</h1>
          <p style={{ margin: 0, opacity: 0.72 }}>
            {copy(
              'Live account data loaded from the connected backend.',
              'بيانات الحساب الفعلية من الـBackend.',
            )}
          </p>
        </div>
        <button style={styles.button} onClick={() => load()} disabled={busy}>
          {copy('Refresh', 'تحديث')}
        </button>
      </div>
      {error && (
        <div role="alert" style={{ ...styles.card, borderColor: '#d97706' }}>
          {error} <button onClick={() => load()}>{copy('Retry', 'إعادة المحاولة')}</button>
        </div>
      )}
      {notice && <p role="status">{notice}</p>}
      {type === 'surveys' && (
        <form onSubmit={createSurvey} style={styles.card}>
          <h2>{copy('Create a survey', 'إنشاء استبيان')}</h2>
          <div style={styles.row}>
            <input
              style={styles.field}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={copy('Survey name', 'اسم الاستبيان')}
              required
            />
            <input
              style={styles.field}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={copy('Description (optional)', 'الوصف (اختياري)')}
            />
            <button style={styles.button} disabled={busy}>
              {busy ? copy('Saving…', 'جارٍ الحفظ…') : copy('Create', 'إنشاء')}
            </button>
          </div>
        </form>
      )}
      {type === 'report-details' && (
        <section style={styles.card}>
          <h2>{titleOf(data || {})}</h2>
          {data ? (
            <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontSize: 13 }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          ) : (
            <p role="status">{copy('Loading report…', 'جارٍ تحميل التقرير…')}</p>
          )}
        </section>
      )}
      {type === 'reports' && (
        <section style={styles.card}>
          <h2>{copy('Generate report', 'إنشاء تقرير')}</h2>
          <button style={styles.button} disabled={busy} onClick={generateReport}>
            {copy('Generate report', 'إنشاء تقرير')}
          </button>
        </section>
      )}
      {type === 'feedbacks' && (
        <section style={styles.card}>
          <h2>{copy('Filter responses', 'تصفية الردود')}</h2>
          <div style={styles.row}>
            <input
              style={styles.field}
              placeholder={copy('Branch ID', 'معرّف الفرع')}
              value={filters.branchId || ''}
              onChange={(e) => setFilters((v) => ({ ...v, branchId: e.target.value || undefined }))}
            />
            <select
              style={styles.field}
              value={filters.sentiment || ''}
              onChange={(e) =>
                setFilters((v) => ({ ...v, sentiment: e.target.value || undefined }))
              }
            >
              <option value="">{copy('All sentiments', 'كل المشاعر')}</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
            <button style={styles.button} onClick={() => load()}>
              {copy('Apply filters', 'تطبيق')}
            </button>
          </div>
        </section>
      )}
      {type === 'analytics' && (
        <section style={styles.card}>
          <h2>{copy('Overview metrics', 'مؤشرات الأداء')}</h2>
          {data ? (
            <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontSize: 13 }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          ) : (
            <p role="status">{copy('Loading analytics…', 'جارٍ تحميل التحليلات…')}</p>
          )}
        </section>
      )}
      {type === 'surveys' && data?.templates && (
        <section style={styles.card}>
          <h2>{copy('Available templates', 'القوالب المتاحة')}</h2>
          <p>
            {pickArray(data.templates, ['templates', 'data']).map(titleOf).join(' · ') ||
              copy('No templates returned.', 'لا توجد قوالب.')}
          </p>
        </section>
      )}
      {(type === 'surveys' || type === 'feedbacks' || type === 'reports') && (
        <section style={styles.card}>
          <h2>{copy('Saved items', 'العناصر المحفوظة')}</h2>
          {!data && !error ? (
            <p role="status">{copy('Loading…', 'جارٍ التحميل…')}</p>
          ) : rows.length ? (
            <div>
              {rows.map((item, index) => (
                <article
                  key={item.id || item._id || index}
                  style={{ padding: '12px 0', borderBottom: '1px solid #eceff3' }}
                >
                  <div style={styles.row}>
                    <strong>{titleOf(item)}</strong>
                    <span style={{ opacity: 0.7, fontSize: 13 }}>
                      {item.status || item.createdAt || item.submittedAt || ''}
                    </span>
                  </div>
                  <p style={{ margin: '6px 0 0', opacity: 0.75 }}>
                    {item.description || item.original?.text || item.summary || ''}
                  </p>
                  {type === 'surveys' && item.id && (
                    <button
                      style={{ ...styles.button, marginTop: 8 }}
                      onClick={async () => {
                        try {
                          await surveyApi.publish(item.id);
                          setNotice(copy('Survey published.', 'تم نشر الاستبيان.'));
                          await load();
                        } catch (e) {
                          setNotice(e.message);
                        }
                      }}
                    >
                      {copy('Publish', 'نشر')}
                    </button>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p>
              {copy(
                'No records returned by the API yet.',
                'لا توجد بيانات محفوظة في الـAPI حتى الآن.',
              )}
            </p>
          )}
        </section>
      )}
    </main>
  );
}
