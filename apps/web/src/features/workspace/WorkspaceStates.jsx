import { I, Metric, Empty } from './WorkspacePrimitives.jsx';
import { initialBranches } from './workspace-data.js';

export default function renderWorkspaceStates(model) {
  const { L, biz, btn, draft, go, heading, page, sample, setBranches, setDraft, setSample, t } =
    model;
  let content;
  if (page === 'subscription')
    content = (
      <>
        {heading(
          'Subscription',
          L('Plans for every stage of your business.', 'باقات تناسب كل مرحلة من نمو نشاطك.'),
        )}
        <section className="card coming">
          <div className="coming-art">
            <I name="subscription" size={48} />
            <span>
              <I name="assistant" />
            </span>
          </div>
          <span className="badge blue">{t('Coming soon')}</span>
          <h2>{L('Room to grow with your business', 'مساحة لتنمو مع نشاطك')}</h2>
          <p>
            {L(
              'Plans and billing will be available soon.',
              'ستتوفر الباقات وإدارة الفواتير قريبًا.',
            )}
          </p>
          <p className="muted">
            {L(
              'We will share the details here when subscriptions become available.',
              'سنشارك التفاصيل هنا عند إتاحة الاشتراكات.',
            )}
          </p>
          {btn('Back to overview', () => go('overview'), true)}
        </section>
      </>
    );
  else if (['analytics', 'reports', 'surveys'].includes(page)) {
    const data = {
      analytics: [
        'Analytics',
        L('Understand the experience behind every response.', 'افهم التجربة وراء كل رأي.'),
        'No analytics yet',
        L(
          'Collect customer feedback to discover sentiment, topics and trends. Your insights will appear here.',
          'اجمع آراء العملاء لاكتشاف المشاعر والموضوعات والاتجاهات. ستظهر رؤاك هنا.',
        ),
        'Create survey',
        'survey-create',
      ],
      reports: [
        'Reports',
        L(
          'Turn customer feedback into a clear view of your business.',
          'حوّل آراء العملاء إلى رؤية واضحة لنشاطك.',
        ),
        'No reports yet',
        L(
          'Reports bring your feedback together into clear, useful insights. Collect your first responses to get started.',
          'تجمع التقارير آراء العملاء في رؤى واضحة ومفيدة. ابدأ بجمع ردودك الأولى.',
        ),
        'View feedbacks',
        'feedbacks',
      ],
      surveys: [
        'Surveys',
        L(
          'Create, manage and share feedback across your branches.',
          'أنشئ الاستبيانات وأدرها وشاركها عبر فروعك.',
        ),
        'No surveys yet',
        L(
          'Create your first survey and give your customers a simple way to share their experience.',
          'أنشئ استبيانك الأول وامنح عملاءك طريقة بسيطة لمشاركة تجربتهم.',
        ),
        'Create survey',
        'survey-create',
      ],
    };
    const [title, sub, empty, body, cta, dest] = data[page];
    content = (
      <>
        {heading(
          title,
          sub,
          page === 'surveys' ? btn('Create survey', () => go('survey-create'), true, 'plus') : null,
        )}
        {page === 'surveys' && (
          <div className="metrics">
            <Metric title={L('Total surveys', 'إجمالي الاستبيانات')} value={sample ? 6 : 0} />
            <Metric title={L('Live surveys', 'الاستبيانات النشطة')} value={sample ? 2 : 0} />
            <Metric title={t('Responses')} value={sample ? '1,248' : 0} />
          </div>
        )}
        {page === 'analytics' && (
          <nav className="tabs">
            {[
              ['Sentiment', 'المشاعر'],
              ['Aspects', 'الجوانب'],
              ['Topics', 'الموضوعات'],
              ['Trends', 'الاتجاهات'],
              ['Comparison', 'المقارنة'],
            ].map(([en, arabic], i) => (
              <button
                className={(draft.analysisTab || 'Sentiment') === en ? 'selected' : ''}
                key={en}
                onClick={() => setDraft({ ...draft, analysisTab: en })}
              >
                {L(en, arabic)}
              </button>
            ))}
          </nav>
        )}
        <section className="card table-card">
          {sample ? (
            <div className="sample-list">
              {(page === 'surveys'
                ? [
                    L('Customer experience survey', 'استبيان تجربة العملاء'),
                    L('Service quality survey', 'استبيان جودة الخدمة'),
                    L('Visit follow-up', 'متابعة الزيارة'),
                  ]
                : page === 'reports'
                  ? [
                      L('September customer experience', 'تجربة العملاء في سبتمبر'),
                      L('Service & speed insights', 'رؤى الخدمة والسرعة'),
                      L('Branch comparison', 'مقارنة الفروع'),
                    ]
                  : [
                      L('Sentiment across 1,248 responses', 'المشاعر عبر ١٢٤٨ ردًا'),
                      L('Customer experience by aspect', 'تجربة العملاء حسب الجانب'),
                      L('Feedback trends', 'اتجاهات آراء العملاء'),
                    ]
              ).map((s, i) => (
                <div className="sample-row" key={s}>
                  <span className="tile">
                    <I name={page} />
                  </span>
                  <div>
                    <strong>{s}</strong>
                    <p>
                      {biz.name} · {i + 1} Oct 2026
                    </p>
                  </div>
                  <span className="badge green">
                    {page === 'surveys' ? t('Active') : L('Ready', 'جاهز')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              onSample={() => {
                setSample(true);
                setBranches(initialBranches);
              }}
              icon={page}
              title={t(empty)}
              description={body}
              action={btn(cta, () => go(dest), true, 'plus')}
              steps={[t('Create survey'), t('Feedbacks'), t('Analytics')]}
            />
          )}
        </section>
      </>
    );
  } else
    content = (
      <>
        {heading('Business profile')}
        {btn('Business profile', () => go('business'))}
      </>
    );
  return content;
}
