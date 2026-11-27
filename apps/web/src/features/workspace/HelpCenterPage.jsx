const panel = {
  background: '#fff',
  border: '1px solid #e7eaf0',
  borderRadius: 14,
  padding: 18,
  marginBottom: 14,
};
const link = { color: '#31429a', fontWeight: 700, textDecoration: 'underline' };
const muted = { color: '#687187', fontSize: 14, lineHeight: 1.6 };
const card = {
  border: '1px solid #e7eaf0',
  borderRadius: 12,
  padding: 16,
  display: 'grid',
  gap: 6,
  minWidth: 0,
};
const copy = {
  en: {
    title: 'Help center',
    subtitle: 'Guides and answers for your NUVIA workspace.',
    availabilityTitle: 'Self-service help only',
    availability:
      'The answers and links below are available in the app. Live chat, email support and support tickets are not part of the current service. This page does not send your details anywhere.',
    quickTitle: 'Go to a workspace area',
    back: 'Back to Overview',
    faqTitle: 'Frequently asked questions',
    questions: [
      {
        question: 'How do I share a survey?',
        answer:
          'Open Surveys, publish the survey, then use Copy public link. The link uses this site address and the survey’s code.',
        href: '#/survey-all',
        linkText: 'Open Surveys',
      },
      {
        question: 'Where can I read customer responses?',
        answer:
          'Open Feedbacks to review responses. You can search, filter by date and sentiment, and open an owned response for analysis.',
        href: '#/feedbacks',
        linkText: 'Open Feedbacks',
      },
      {
        question: 'Can I contact support from this page?',
        answer:
          'No. There is no live chat, email support or ticket submission in the current service. Nothing you type here is sent or stored.',
      },
      {
        question: 'Why does a feature say it is unavailable?',
        answer:
          'Some design-only features have no connected service behind them. NUVIA shows an unavailable state instead of presenting sample data as real customer data.',
      },
      {
        question: 'How do I get back to my dashboard?',
        answer: 'Use the Overview item in the sidebar or the link below.',
        href: '#/dashboard',
        linkText: 'Back to Overview',
      },
    ],
    links: {
      Overview: 'See response totals and recent activity.',
      Feedbacks: 'Read customer responses and filter results.',
      Surveys: 'Create and manage surveys.',
      Reports: 'Review saved reports.',
      'NUVIA Assistant': 'Ask about your connected feedback.',
      Settings: 'Manage account and workspace settings.',
    },
  },
  ar: {
    title: 'مركز المساعدة',
    subtitle: 'أدلة وإجابات لمساحة عمل NUVIA.',
    availabilityTitle: 'مساعدة ذاتية فقط',
    availability:
      'الإجابات والروابط أدناه متاحة داخل التطبيق. الدردشة المباشرة والدعم عبر البريد وتذاكر الدعم غير متاحة في الخدمة الحالية. لا ترسل هذه الصفحة بياناتك إلى أي جهة.',
    quickTitle: 'الانتقال إلى قسم من مساحة العمل',
    back: 'العودة إلى النظرة العامة',
    faqTitle: 'الأسئلة الشائعة',
    questions: [
      {
        question: 'كيف أشارك استبيانًا؟',
        answer:
          'افتح الاستبيانات وانشر الاستبيان، ثم استخدم نسخ رابط الاستبيان. يستخدم الرابط عنوان هذا الموقع ورمز الاستبيان.',
        href: '#/survey-all',
        linkText: 'فتح الاستبيانات',
      },
      {
        question: 'أين أجد آراء العملاء؟',
        answer:
          'افتح آراء العملاء لمراجعة الردود. يمكنك البحث والتصفية حسب التاريخ والمشاعر وفتح رد مملوك للتحليل.',
        href: '#/feedbacks',
        linkText: 'فتح آراء العملاء',
      },
      {
        question: 'هل يمكنني التواصل مع الدعم من هذه الصفحة؟',
        answer:
          'لا. لا توجد دردشة مباشرة أو دعم عبر البريد أو تذاكر دعم في الخدمة الحالية. لا يتم إرسال أو حفظ أي شيء تكتبه هنا.',
      },
      {
        question: 'لماذا تظهر ميزة على أنها غير متاحة؟',
        answer:
          'بعض ميزات التصميم لا توجد خلفها خدمة متصلة. يعرض NUVIA حالة غير متاحة بدلًا من تقديم بيانات تجريبية على أنها بيانات عملاء حقيقية.',
      },
      {
        question: 'كيف أعود إلى لوحة التحكم؟',
        answer: 'استخدم عنصر نظرة عامة في الشريط الجانبي أو الرابط أدناه.',
        href: '#/dashboard',
        linkText: 'العودة إلى النظرة العامة',
      },
    ],
    links: {
      Overview: 'اطلع على إجمالي الردود والنشاط الأخير.',
      Feedbacks: 'اقرأ آراء العملاء وصفِّ النتائج.',
      Surveys: 'أنشئ الاستبيانات وأدرها.',
      Reports: 'راجع التقارير المحفوظة.',
      'NUVIA Assistant': 'اسأل عن آراء العملاء المتصلة.',
      Settings: 'أدر إعدادات الحساب ومساحة العمل.',
    },
  },
};
const areas = [
  ['Overview', '#/dashboard'],
  ['Feedbacks', '#/feedbacks'],
  ['Surveys', '#/survey-all'],
  ['Reports', '#/reports'],
  ['NUVIA Assistant', '#/nuvia-assistant'],
  ['Settings', '#/settings'],
];
const areaLabels = {
  en: {
    Overview: 'Overview',
    Feedbacks: 'Feedbacks',
    Surveys: 'Surveys',
    Reports: 'Reports',
    'NUVIA Assistant': 'NUVIA Assistant',
    Settings: 'Settings',
  },
  ar: {
    Overview: 'نظرة عامة',
    Feedbacks: 'آراء العملاء',
    Surveys: 'الاستبيانات',
    Reports: 'التقارير',
    'NUVIA Assistant': 'مساعد NUVIA',
    Settings: 'الإعدادات',
  },
};
export default function HelpCenterPage({ language = 'en' }) {
  const lang = language === 'ar' ? 'ar' : 'en';
  const text = copy[lang];
  return (
    <main
      style={{ maxWidth: 1120, margin: '0 auto', padding: '28px 24px 60px', color: '#20263a' }}
      aria-labelledby="help-center-title"
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
          <h1 id="help-center-title" style={{ fontSize: 25, fontWeight: 750, margin: '0 0 6px' }}>
            {text.title}
          </h1>
          <p style={{ ...muted, margin: 0 }}>{text.subtitle}</p>
        </div>
        <a href="#/dashboard" style={link}>
          {text.back}
        </a>
      </header>

      <section style={{ ...panel, background: '#f7f8fb' }} aria-label={text.availabilityTitle}>
        <strong>{text.availabilityTitle}</strong>
        <p style={{ ...muted, margin: '6px 0 0' }}>{text.availability}</p>
      </section>

      <section style={panel} aria-labelledby="help-center-areas">
        <h2 id="help-center-areas" style={{ fontSize: 18, margin: '0 0 12px' }}>
          {text.quickTitle}
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
            gap: 12,
          }}
        >
          {areas.map(([id, href]) => (
            <a key={id} href={href} style={{ ...card, textDecoration: 'none', color: 'inherit' }}>
              <strong style={{ color: '#31429a' }}>{areaLabels[lang][id]}</strong>
              <span style={muted}>{text.links[id]}</span>
            </a>
          ))}
        </div>
      </section>

      <section style={panel} aria-labelledby="help-center-faq">
        <h2 id="help-center-faq" style={{ fontSize: 18, margin: '0 0 12px' }}>
          {text.faqTitle}
        </h2>
        {text.questions.map((item) => (
          <details
            key={item.question}
            style={{ borderTop: '1px solid #edf0f6', padding: '12px 0' }}
          >
            <summary style={{ cursor: 'pointer', fontWeight: 700 }}>{item.question}</summary>
            <p style={{ ...muted, marginBottom: 0 }}>
              {item.answer}{' '}
              {item.href && (
                <a href={item.href} style={link}>
                  {item.linkText}
                </a>
              )}
            </p>
          </details>
        ))}
      </section>

      <p style={{ ...muted, textAlign: 'center' }}>
        <a href="#/dashboard" style={link}>
          {text.back}
        </a>
      </p>
    </main>
  );
}
