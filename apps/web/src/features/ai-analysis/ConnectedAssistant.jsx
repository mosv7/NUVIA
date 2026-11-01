import { useEffect, useRef } from 'react';
import WorkspaceScopeControls from '../dashboard/WorkspaceScopeControls.jsx';
import { OverviewDateDialog } from '../dashboard/OverviewControls.jsx';
import { useProductView } from '../../app/providers/ProductProvider.jsx';
import './connected-assistant.css';
export function AssistantScope({ conversation }) {
  const { language, tr } = useProductView();
  return (
    <>
      <div className="assistant-scope-buttons">
        <WorkspaceScopeControls dashboard={conversation.scope} branches={conversation.branches} />
      </div>
      <OverviewDateDialog
        open={conversation.dateOpen}
        onClose={() => conversation.setDateOpen(false)}
        filters={conversation.scope.filters}
        onApply={(range) => conversation.scope.setFilters((old) => ({ ...old, ...range }))}
        language={language}
        tr={tr}
      />
    </>
  );
}
export function AssistantMetrics({ metrics }) {
  const { language, tr } = useProductView(),
    ar = language === 'ar';
  const n = (value) => new Intl.NumberFormat(ar ? 'ar-EG' : 'en-US').format(value || 0);
  if (!metrics) return null;
  const labels = {
    pending: ar ? 'قيد الانتظار' : 'Pending',
    processing: ar ? 'قيد التحليل' : 'Processing',
    completed: ar ? 'مكتمل' : 'Completed',
    partial: ar ? 'جزئي' : 'Partial',
    failed: ar ? 'فشل' : 'Failed',
    skipped: ar ? 'متخطى' : 'Skipped',
    accepted: ar ? 'جودة مقبولة' : 'Quality accepted',
    baseline: ar ? 'تجريبي' : 'Baseline',
    unaccepted: ar ? 'جودة غير مقبولة بعد' : 'Quality unaccepted',
    positive: tr('Positive'),
    negative: tr('Negative'),
    neutral: tr('Neutral'),
    mixed: tr('Mixed'),
  };
  return (
    <section
      className="assistant-metrics"
      aria-label={ar ? 'أعداد الردود المحفوظة' : 'Stored response counts'}
    >
      <h3>{ar ? 'أعداد الردود المحفوظة' : 'Stored response counts'}</h3>
      <dl>
        <div>
          <dt>{ar ? 'إجمالي الردود' : 'Total responses'}</dt>
          <dd>{n(metrics.totalResponses)}</dd>
        </div>
        <div>
          <dt>{ar ? 'ردود مكتوبة' : 'Written responses'}</dt>
          <dd>{n(metrics.writtenResponses)}</dd>
        </div>
      </dl>
      <details>
        <summary>{ar ? 'التحليل والمشاعر' : 'Analysis and sentiment'}</summary>
        <p>
          {ar
            ? 'أعداد المشاعر والجوانب تخص التحليل المقبول فقط. التجريبي والمنتظر لا يمثلان رضا العملاء.'
            : 'Sentiment and aspect counts include quality-accepted analysis only. Baseline and pending analysis do not establish satisfaction.'}
        </p>
        <dl>
          {Object.entries(metrics.analysisStatuses || {}).map(([key, value]) => (
            <div key={key}>
              <dt>{labels[key] || key}</dt>
              <dd>{n(value)}</dd>
            </div>
          ))}
        </dl>
        <dl>
          {Object.entries(metrics.sentiments || {}).map(([key, value]) => (
            <div key={key}>
              <dt>{labels[key] || key}</dt>
              <dd>{n(value)}</dd>
            </div>
          ))}
        </dl>
        {metrics.negativeAspects?.map((aspect) => (
          <p key={aspect.name} dir="auto">
            {aspect.name}: {n(aspect.count)}
          </p>
        ))}
      </details>
    </section>
  );
}
export function AssistantConversation({ conversation, onSource }) {
  const end = useRef(null);
  useEffect(() => {
    if (conversation.pending || conversation.messages.length || conversation.error)
      end.current?.scrollIntoView({ block: 'nearest' });
  }, [conversation.pending, conversation.messages, conversation.error]);
  const { language } = useProductView(),
    ar = language === 'ar';
  return (
    <div className="connected-conversation" aria-live="polite" aria-busy={conversation.pending}>
      {conversation.loading && (
        <p role="status">{ar ? 'جارٍ تحميل نطاق الردود…' : 'Loading feedback scope…'}</p>
      )}
      {conversation.contextError && (
        <p role="alert">
          {ar ? 'تعذر تحميل الردود.' : 'Could not load feedback.'}{' '}
          <button type="button" onClick={conversation.retryContext}>
            {ar ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </p>
      )}
      {conversation.context?.metrics.totalResponses === 0 && (
        <p>
          {ar
            ? 'لا توجد ردود في النطاق المحدد. جرّب فرعًا أو فترة أخرى.'
            : 'No responses in the selected scope. Try another branch or period.'}
        </p>
      )}
      {conversation.context?.metrics.totalResponses > 0 &&
        conversation.context.metrics.writtenResponses === 0 && (
          <p>
            {ar
              ? 'لا توجد ردود مكتوبة للاستشهاد بها في هذا النطاق.'
              : 'There is no written feedback to cite in this scope.'}
          </p>
        )}
      {conversation.messages.map(({ question, answer }, index) => (
        <div key={index}>
          <div className="assistant-message user">
            <small>{ar ? 'أنت' : 'You'}</small>
            <p dir="auto">{question}</p>
          </div>
          <div className="assistant-message assistant">
            <small>NUVIA</small>
            {answer.status === 'insufficient_evidence' ? (
              <p>
                {ar
                  ? 'لا توجد أدلة كافية للإجابة عن هذا السؤال ضمن النطاق المحدد.'
                  : 'There is not enough evidence to answer this question in the selected scope.'}
              </p>
            ) : (
              <>
                <h3>{ar ? 'أدلة ذات صلة من العملاء' : 'Relevant customer evidence'}</h3>
                <p>
                  {ar
                    ? 'مقتطفات من الردود الأصلية؛ لا تمثل استنتاجًا شاملًا أو تفسيرًا للأسباب.'
                    : 'Excerpts from original responses; these are not exhaustive conclusions or explanations of causes.'}
                </p>
                {answer.items.map((item, i) => (
                  <div key={i}>
                    {!item.citations.some((citation) => citation.quote === item.text) && (
                      <p dir="auto">{item.text}</p>
                    )}
                    {item.citations.map((citation, j) => (
                      <blockquote key={citation.id + '-' + j}>
                        <p dir="auto">{citation.quote}</p>
                        <a
                          aria-label={ar ? 'عرض الرد الأصلي' : 'View original feedback'}
                          href={'#/feedback-details?id=' + encodeURIComponent(citation.responseId)}
                          onClick={onSource}
                        >
                          {ar ? 'عرض الرد الأصلي' : 'View original feedback'}{' '}
                          <bdi>#{citation.number}</bdi>
                        </a>
                      </blockquote>
                    ))}
                  </div>
                ))}
              </>
            )}
            {answer.provenance?.quality_accepted !== true && answer.status === 'answered' && (
              <p className="assistant-quality-notice">
                {ar
                  ? 'اختيار الأدلة بالذكاء الاصطناعي تجريبي؛ لم تُقبل جودته بعد. راجع الردود الأصلية.'
                  : 'AI evidence selection is experimental; quality has not been accepted. Check the original responses.'}
              </p>
            )}
            {answer.coverage && (
              <p className="assistant-coverage">
                {ar
                  ? `استنادًا إلى ${new Intl.NumberFormat('ar-EG').format(answer.coverage.evidenceCount)} من المصادر المختارة ضمن ${new Intl.NumberFormat('ar-EG').format(answer.coverage.candidatesScanned)} من الردود المكتوبة الحديثة. هذه عينة.`
                  : `Based on ${answer.coverage.evidenceCount} selected ${answer.coverage.evidenceCount === 1 ? 'source' : 'sources'} from ${answer.coverage.candidatesScanned} recent written ${answer.coverage.candidatesScanned === 1 ? 'response' : 'responses'}. This is a sample.`}
              </p>
            )}
          </div>
        </div>
      ))}
      {conversation.pending && (
        <p role="status">{ar ? 'جارٍ مراجعة أدلة العملاء…' : 'Reviewing customer evidence…'}</p>
      )}
      {conversation.error && (
        <p role="alert">
          {conversation.error === 'QUESTION_TOO_LONG'
            ? ar
              ? 'اختصر السؤال إلى ١٠٠٠ حرف أو أقل.'
              : 'Shorten your question to 1,000 characters or fewer.'
            : ar
              ? 'تعذرت الإجابة الآن. احتفظنا بسؤالك؛ جرّب مرة أخرى.'
              : 'An answer is unavailable right now. Your question was kept; try again.'}{' '}
          <button type="button" onClick={() => conversation.ask()}>
            {ar ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </p>
      )}
      <div ref={end} />
    </div>
  );
}
