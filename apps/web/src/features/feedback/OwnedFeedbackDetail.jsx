import { useEffect, useState } from 'react';
import { useProductView } from '../../app/providers/ProductProvider.jsx';
import HeadingBack from '../../components/layout/HeadingBack.jsx';
import { feedbackApi } from './api.js';
import './feedback-screens.css';
export default function OwnedFeedbackDetail() {
  const { language, tr, workspace } = useProductView(),
    ar = language === 'ar';
  const id = new URLSearchParams(location.hash.split('?')[1]).get('id');
  const [detail, setDetail] = useState(null),
    [analysis, setAnalysis] = useState(null),
    [error, setError] = useState(false),
    [analysisError, setAnalysisError] = useState(false),
    [reload, setReload] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setDetail(null);
    setAnalysis(null);
    setError(false);
    setAnalysisError(false);
    if (!/^[a-f0-9]{24}$/i.test(id || '')) {
      setError(true);
      return;
    }
    feedbackApi
      .detail(id, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setDetail(data);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    feedbackApi
      .analysis(id, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setAnalysis(data);
      })
      .catch(() => {
        if (!controller.signal.aborted) setAnalysisError(true);
      });
    return () => controller.abort();
  }, [id, workspace?.id, language, reload]);
  const retry = (
    <button type="button" className="feedback-btn" onClick={() => setReload((old) => old + 1)}>
      {ar ? 'إعادة التحميل' : 'Reload'}
    </button>
  );
  const statuses = {
    pending: ar ? 'قيد الانتظار' : 'Pending',
    processing: ar ? 'قيد التحليل' : 'Processing',
    completed: ar ? 'مكتمل' : 'Completed',
    partial: ar ? 'جزئي' : 'Partial',
    failed: ar ? 'فشل التحليل' : 'Analysis failed',
    skipped: ar ? 'متخطى' : 'Skipped',
  };
  return (
    <section className="feedback-screen detail-screen">
      <a className="feedback-back" href="#/nuvia-assistant">
        {ar ? 'العودة إلى المساعد' : 'Back to assistant'}
      </a>
      {error ? (
        <div role="alert">
          <p>
            {ar
              ? 'تعذر تحميل هذا الرد. قد لا يكون متاحًا لهذا الحساب.'
              : 'This feedback could not be loaded. It may be unavailable for this account.'}
          </p>
          {retry}
        </div>
      ) : !detail ? (
        <p role="status">{ar ? 'جارٍ تحميل الرد…' : 'Loading feedback…'}</p>
      ) : (
        <>
          <div className="feedback-heading">
            <h1 className="workspace-heading">
              <HeadingBack fallback="/nuvia-assistant" />
              <span>
                {tr('Feedback')} <bdi>#{detail.number}</bdi>
              </span>
            </h1>
          </div>
          <div className="feedback-detail-grid">
            <div className="feedback-detail-main">
              <section className="feedback-detail-card">
                <div className="feedback-section-heading">
                  <h2>{tr('Original Feedback')}</h2>
                </div>
                <div className="feedback-customer-words">
                  <small dir="auto">{detail.original.question}</small>
                  <blockquote lang={detail.language} dir="auto">
                    {detail.original.text || (ar ? 'لا يوجد نص مكتوب.' : 'No written text.')}
                  </blockquote>
                </div>
                <div className="feedback-submission-grid">
                  {[
                    [
                      'Submission date',
                      new Date(detail.submittedAt).toLocaleString(ar ? 'ar-EG' : 'en-GB'),
                    ],
                    ['Branch', detail.branch?.name || '—'],
                    ['Related survey', detail.survey?.name || '—'],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <small>{tr(label)}</small>
                      <p dir="auto">{value}</p>
                    </div>
                  ))}
                </div>
              </section>
              <section className="feedback-detail-card feedback-analysis-card">
                <div className="feedback-analysis-heading">
                  <h2>{tr('Aspect Analysis')}</h2>
                </div>
                {analysisError ? (
                  <div role="alert">
                    <p>
                      {ar
                        ? 'تعذر تحميل التحليل؛ الرد الأصلي متاح أعلاه.'
                        : 'Analysis could not be loaded; the original feedback is available above.'}
                    </p>
                    {retry}
                  </div>
                ) : !analysis ? (
                  <p role="status">{ar ? 'جارٍ تحميل التحليل…' : 'Loading analysis…'}</p>
                ) : (
                  <>
                    <p>{statuses[analysis.status] || '—'}</p>
                    {analysis.provenance?.qualityAccepted !== true &&
                      analysis.aspects?.length > 0 && (
                        <p className="feedback-analysis-unavailable">
                          {ar
                            ? 'تحليل تجريبي؛ لم تُقبل جودته بعد.'
                            : 'Experimental analysis; quality has not been accepted.'}
                        </p>
                      )}
                    {analysis.aspects?.length ? (
                      <div className="feedback-analysis-scroll">
                        <table className="feedback-aspect-table">
                          <thead>
                            <tr>
                              {['Detected aspect', 'Feedback evidence', 'Polarity'].map((label) => (
                                <th key={label}>{tr(label)}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {analysis.aspects.map((aspect, i) => (
                              <tr key={i}>
                                <td dir="auto">{aspect.name}</td>
                                <td dir="auto">{aspect.quote}</td>
                                <td>
                                  {tr(
                                    aspect.polarity?.replace(/^./, (c) => c.toUpperCase()) || '—',
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="feedback-analysis-unavailable">
                        {tr('Detailed analysis is not available for this response yet.')}
                      </p>
                    )}
                  </>
                )}
              </section>
            </div>
            <aside className="feedback-detail-aside">
              <section className="feedback-detail-card">
                <h2>{tr('Response context')}</h2>
                <p>
                  {ar
                    ? 'هذا هو الرد الأصلي المحفوظ في حسابك. راجع النص الكامل قبل اتخاذ قرار.'
                    : 'This is the original response stored in your account. Read the complete text before deciding.'}
                </p>
                {retry}
              </section>
            </aside>
          </div>
        </>
      )}
    </section>
  );
}
