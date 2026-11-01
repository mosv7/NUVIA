import { useEffect, useRef, useState } from 'react';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/noto-sans-arabic/400.css';
import './customer-feedback.css';

const frames = ['808-922', '808-965', '808-1025', '808-1082', '808-1152', '808-1213', '808-1323'];
const sampleComment =
  'Loved the coffee and quiet workspace. More plug sockets near the window would make it even better.';
const longComment =
  'Loved the coffee and quiet workspace. The team was welcoming and the Wi-Fi worked well throughout my visit. I stayed for a few hours to finish a project and enjoyed the calm atmosphere. More plug sockets near the window would make it even better. I would also love a few more comfortable chairs and a larger selection of snacks for longer work sessions.';
const screenNames = [
  'intro',
  'branch',
  'visit',
  'rating',
  'highlights',
  'recommendation',
  'comment',
  'required',
  'invalid',
  'incomplete',
  'sending',
  'thank-you',
  'single-choice',
];
const titles = [
  'Which branch did you visit?',
  'What brought you in today?',
  'How was your overall experience?',
  'What stood out to you?',
  'Would you recommend us to a friend?',
  'Anything we could do better?',
];
const arabicTitles = [
  'أي فرع زرت؟',
  'ما سبب زيارتك اليوم؟',
  'كيف كانت تجربتك بشكل عام؟',
  'ما الذي أعجبك؟',
  'هل ترشحنا لصديق؟',
  'هل هناك شيء يمكننا تحسينه؟',
];
const hints = [
  'Choose the location for your feedback.',
  'Choose the main reason for your visit.',
  'Think about your most recent visit.',
  'Select what you enjoyed, or nothing in particular.',
  'Choose a number from 0 to 10.',
  'A little detail helps us make your next visit better.',
];
const arabicHints = [
  'اختر الفرع الذي تود تقييمه.',
  'اختر السبب الرئيسي لزيارتك.',
  'فكّر في زيارتك الأخيرة.',
  'اختر ما أعجبك أو لا شيء بالتحديد.',
  'اختر رقمًا من ٠ إلى ١٠.',
  'التفاصيل تساعدنا على تحسين زيارتك القادمة.',
];
export default function CustomerFeedback({ language } = {}) {
  const preview = location.pathname.includes('/preview');
  const requested = preview ? new URLSearchParams(location.search).get('screen') : null;
  const index = screenNames.indexOf(requested);
  const initialStep =
    index < 0
      ? 0
      : index < 7
        ? index
        : index === 7
          ? 3
          : index === 8
            ? 6
            : index === 9
              ? 7
              : index === 10
                ? 8
                : 9;
  const [step, setStep] = useState(requested === 'single-choice' ? 10 : initialStep);
  const isQuestion = step <= 6 || step === 10;
  const questionNumber = step === 10 ? 6 : step === 6 ? 7 : step;
  const missingStep = (i) => (i === 5 ? 10 : i + 1);
  const [ar, setAr] = useState(language === 'ar');
  const [answers, setAnswers] = useState(
    index >= 7
      ? {
          firstVisit: 'Yes',
          branch: 'El Zamalek',
          visit: 'Work or study',
          rating: index === 7 || index === 9 ? 0 : 4,
          highlights: ['Coffee & food', 'Wi-Fi & workspace'],
          recommendation: 9,
          comment: index === 8 ? longComment : sampleComment,
        }
      : {
          firstVisit: '',
          branch: '',
          visit: '',
          rating: 0,
          highlights: [],
          recommendation: null,
          comment: '',
        },
  );
  const [error, setError] = useState(index === 7);
  const [sendError, setSendError] = useState('');
  const heading = useRef(null);
  const timer = useRef(null);
  const t = (en, arabic) => (ar ? arabic : en);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (heading.current) heading.current.focus({ preventScroll: true });
  }, [step]);
  const set = (key, value) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    setError(false);
  };
  const missing = [
    !answers.branch,
    !answers.visit,
    !answers.rating,
    !answers.highlights.length,
    answers.recommendation === null,
    !answers.firstVisit,
  ];
  const currentFrame =
    step === 10
      ? '808-1025'
      : step === 3 && error
        ? '808-1452'
        : step === 6 && answers.comment.length > 300
          ? '808-1575'
          : step === 7
            ? '808-1670'
            : step === 8
              ? '808-1879'
              : step === 9
                ? '808-1984'
                : frames[step];
  const img = (name, frame = currentFrame, extra = '') => (
    <img
      className={'cf-icon ' + extra}
      src={'/assets/customer-form/' + frame + '-img' + name + '.svg'}
      alt=""
    />
  );
  const move = (n) => {
    setStep(n);
    setError(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  const openReviewQuestion = (questionStep) => {
    move(questionStep);
    const requiredIndex = questionStep === 10 ? 5 : questionStep === 6 ? -1 : questionStep - 1;
    setError(requiredIndex >= 0 && missing[requiredIndex]);
  };
  const next = () => {
    move(step === 5 ? 10 : step === 10 ? 6 : step + 1);
  };
  // This project currently exposes the public survey as a design preview only.
  // This preview does not submit responses to the public API.
  const submit = () => {
    if (answers.comment.length > 300) {
      setError(true);
      return;
    }
    if (missing.some(Boolean)) {
      move(7);
      return;
    }
    setSendError('');
    move(8);
    timer.current = setTimeout(() => move(9), 1400);
  };
  const summary = (
    <div className="cf-summary">
      <strong>{t('Customer experience survey', 'استبيان تجربة العملاء')}</strong>
      <span>
        {img('MapPin', step === 9 ? '808-1984' : '808-1879')}
        {answers.branch}
      </span>
      <p>
        {t(
          step === 9
            ? '7 answers received · Submitted anonymously'
            : '7 answers ready · Your feedback is anonymous',
          step === 9 ? 'تم استلام ٧ إجابات · بشكل مجهول' : '٧ إجابات جاهزة · رأيك مجهول الهوية',
        )}
      </p>
    </div>
  );
  const footer = (
    <>
      <p className="cf-privacy">
        {img('ShieldCheck')}
        {t('Anonymous feedback · No sign-in needed', 'رأي مجهول الهوية · لا يلزم تسجيل الدخول')}
      </p>
      <p className="cf-credit">
        {t('Powered by', 'بدعم من')}{' '}
        <strong>
          NU<span>V</span>IA
        </strong>
      </p>
    </>
  );
  return (
    <div className="cf-page" dir={ar ? 'rtl' : 'ltr'} lang={ar ? 'ar' : 'en'}>
      <section
        className={'cf-shell cf-stage-' + step}
        aria-label={t('Customer experience survey', 'استبيان تجربة العملاء')}
      >
        <header className="cf-header">
          <div className="cf-mark">B</div>
          <div className="cf-business">
            <strong>Bloom & Co.</strong>
            <span>{step === 0 ? 'Cafe &workspace' : 'Cafe &workspace'}</span>
          </div>
          <button
            className="cf-language"
            onClick={() => setAr(!ar)}
            aria-label={t('Switch to Arabic', 'Switch to English')}
          >
            {img('Globe')}
            <span>{ar ? 'AR' : 'EN'}</span>
          </button>
        </header>
        <main
          aria-live={step === 8 || step === 9 ? 'polite' : undefined}
          className={
            'cf-main ' +
            (step === 0 ? 'cf-welcome' : step === 8 || step === 9 ? 'cf-completion' : '')
          }
        >
          {step === 0 ? (
            <>
              <div className="cf-symbol">{img('Coffee')}</div>
              <div className="cf-prompt">
                <span className="cf-eyebrow">{t('A MOMENT TO LISTEN', 'لحظة للاستماع')}</span>
                <h1 ref={heading} tabIndex={-1}>
                  {t('Customer experience survey', 'استبيان تجربة العملاء')}
                </h1>
                <p>
                  {t(
                    'Your experience matters to us. Tell us about your latest visit and help make Bloom & Co. even better.',
                    'تجربتك تهمنا. شاركنا تفاصيل زيارتك الأخيرة وساعدنا على تحسين Bloom & Co.',
                  )}
                </p>
              </div>
              <div className="cf-metadata">
                <span>
                  {img('ListChecks')}
                  {t('7 questions', '٧ أسئلة')}
                </span>
                <span>
                  {img('Clock3')}
                  {t('About 2 minutes', 'حوالي دقيقتين')}
                </span>
              </div>
              <div className="cf-expect">
                <strong>
                  {t(
                    'A few honest answers. A better next visit.',
                    'إجابات صادقة. زيارة قادمة أفضل.',
                  )}
                </strong>
                <p>
                  {t(
                    'Choose your branch, share what you enjoyed, and let us know what we can improve.',
                    'اختر فرعك، وشاركنا ما أعجبك وما يمكننا تحسينه.',
                  )}
                </p>
              </div>
            </>
          ) : isQuestion ? (
            <>
              <div className="cf-progress">
                <div>
                  <strong>
                    {t(`Question ${questionNumber} of 7`, `السؤال ${questionNumber} من ٧`)}
                  </strong>
                  <span>
                    {step === 6
                      ? t('Last question', 'السؤال الأخير')
                      : t('About 2 minutes', 'حوالي دقيقتين')}
                  </span>
                </div>
                <div
                  className="cf-track"
                  role="progressbar"
                  aria-label={t('Survey progress', 'تقدم الاستبيان')}
                  aria-valuemin={0}
                  aria-valuemax={7}
                  aria-valuenow={questionNumber}
                >
                  {Array.from({ length: 7 }, (_, i) => (
                    <i className={i < questionNumber ? 'done' : ''} key={i} />
                  ))}
                </div>
              </div>
              <div className="cf-prompt">
                <span className="cf-eyebrow">
                  {step === 6 ? t('OPTIONAL', 'اختياري') : t('REQUIRED', 'مطلوب')}
                </span>
                <h1 ref={heading} tabIndex={-1}>
                  {step === 10
                    ? t('Is this your first visit?', 'هل دي أول زيارة ليك؟')
                    : ar
                      ? arabicTitles[step - 1]
                      : titles[step - 1]}
                </h1>
                <p>
                  {step === 10
                    ? t(
                        'Single choice · Select one answer only.',
                        'اختيار واحد · اختار إجابة واحدة بس.',
                      )
                    : ar
                      ? arabicHints[step - 1]
                      : hints[step - 1]}
                </p>
              </div>
              {[1, 2, 4].includes(step) && (
                <div className="cf-choices" role="group" aria-label={titles[step - 1]}>
                  {(step === 1
                    ? ['Cairo', 'El Zamalek', 'Alex']
                    : step === 2
                      ? ['Coffee & food', 'Work or study', 'Catching up', 'Takeaway']
                      : [
                          'Coffee & food',
                          'Friendly service',
                          'Wi-Fi & workspace',
                          'Nothing in particular',
                        ]
                  ).map((label, i) => {
                    const key = step === 1 ? 'branch' : step === 2 ? 'visit' : 'highlights';
                    const checked =
                      step === 4 ? answers.highlights.includes(label) : answers[key] === label;
                    const localized =
                      step === 1
                        ? ['القاهرة', 'الزمالك', 'الإسكندرية']
                        : step === 2
                          ? ['قهوة وطعام', 'عمل أو دراسة', 'لقاء الأصدقاء', 'طلب خارجي']
                          : [
                              'القهوة والطعام',
                              'الخدمة الودودة',
                              'الواي فاي ومساحة العمل',
                              'لا شيء بالتحديد',
                            ];
                    return (
                      <label className={'cf-choice ' + (checked ? 'selected' : '')} key={label}>
                        {step === 1 && img(checked ? 'MapPin1' : 'MapPin')}
                        <span>{ar ? localized[i] : label}</span>
                        <input
                          type={step === 4 ? 'checkbox' : 'radio'}
                          name={'answer-' + step}
                          checked={checked}
                          onChange={() => {
                            if (step !== 4) set(key, label);
                            else
                              set(
                                key,
                                label === 'Nothing in particular'
                                  ? checked
                                    ? []
                                    : [label]
                                  : checked
                                    ? answers.highlights.filter((x) => x !== label)
                                    : [
                                        ...answers.highlights.filter(
                                          (x) => x !== 'Nothing in particular',
                                        ),
                                        label,
                                      ],
                              );
                          }}
                          aria-invalid={error}
                        />
                      </label>
                    );
                  })}
                </div>
              )}
              {step === 10 && (
                <fieldset className="cf-single-choice">
                  <legend>{t('Choose one answer', 'اختار إجابة واحدة')}</legend>
                  {['Yes', 'No'].map((option) => (
                    <label
                      className={'cf-choice ' + (answers.firstVisit === option ? 'selected' : '')}
                      key={option}
                    >
                      <span>{t(option, option === 'Yes' ? 'أيوه' : 'لأ')}</span>
                      <input
                        type="radio"
                        name="first-visit"
                        checked={answers.firstVisit === option}
                        onChange={() => set('firstVisit', option)}
                        aria-invalid={error}
                      />
                    </label>
                  ))}
                </fieldset>
              )}
              {step === 3 && (
                <div
                  className={
                    'cf-rating cf-rating-tone-' +
                    (answers.rating <= 2 ? 'red' : answers.rating === 3 ? 'yellow' : 'green') +
                    (error ? ' invalid' : '')
                  }
                >
                  <div
                    className="cf-stars"
                    role="group"
                    aria-label={t('Overall experience', 'التجربة العامة')}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => set('rating', n)}
                        aria-label={`${n} out of 5`}
                        aria-pressed={answers.rating === n}
                        className={n <= answers.rating ? 'cf-star-selected' : ''}
                      >
                        {img(
                          error ? 'Star' : n <= answers.rating ? 'Star' : 'Star1',
                          error ? '808-1452' : '808-1082',
                        )}
                        <span>{n}</span>
                      </button>
                    ))}
                  </div>
                  <div className="cf-range">
                    <span>{t('Very poor', 'سيئة جدًا')}</span>
                    <span>{t('Excellent', 'ممتازة')}</span>
                  </div>
                  {!!answers.rating && (
                    <strong className="cf-score">
                      {t(
                        `${answers.rating} out of 5 · ${['Very poor', 'Poor', 'Okay', 'Good', 'Excellent'][answers.rating - 1]}`,
                        `${answers.rating} من ٥`,
                      )}
                    </strong>
                  )}
                </div>
              )}
              {step === 5 && (
                <div className="cf-recommendation">
                  <div
                    className="cf-numbers"
                    role="group"
                    aria-label={t('Recommendation score', 'درجة الترشيح')}
                  >
                    {Array.from({ length: 11 }, (_, n) => (
                      <button
                        key={n}
                        className={answers.recommendation === n ? 'selected' : ''}
                        onClick={() => set('recommendation', n)}
                        aria-pressed={answers.recommendation === n}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <div className="cf-range">
                    <span>{t('0 · Not at all likely', '٠ · غير محتمل إطلاقًا')}</span>
                    <span>{t('10 · Extremely likely', '١٠ · محتمل جدًا')}</span>
                  </div>
                  {answers.recommendation !== null && (
                    <strong className="cf-score">
                      {t(
                        `Your score: ${answers.recommendation} out of 10`,
                        `تقييمك: ${answers.recommendation} من ١٠`,
                      )}
                    </strong>
                  )}
                </div>
              )}
              {step === 6 && (
                <div className="cf-comment">
                  <textarea
                    aria-label={titles[5]}
                    aria-invalid={answers.comment.length > 300}
                    aria-describedby="cf-comment-limit"
                    value={answers.comment}
                    placeholder={t('Share your thoughts…', 'شاركنا رأيك…')}
                    onChange={(e) => set('comment', e.target.value)}
                    className={answers.comment.length > 300 ? 'invalid' : ''}
                  />
                  <div className="cf-range" id="cf-comment-limit">
                    <span>{t('Maximum 300 characters', '٣٠٠ حرف بحد أقصى')}</span>
                    <span>{answers.comment.length}/300</span>
                  </div>
                  {answers.comment.length > 300 && (
                    <p className="cf-error-text" role="alert">
                      {t(
                        `Please remove ${answers.comment.length - 300} characters to continue.`,
                        `احذف ${answers.comment.length - 300} حرفًا للمتابعة.`,
                      )}
                    </p>
                  )}
                  <p className="cf-anonymous">
                    {t(
                      'Keep it anonymous. Please don’t include your name, phone number or email.',
                      'حافظ على سرية هويتك. لا تضف اسمك أو رقم هاتفك أو بريدك الإلكتروني.',
                    )}
                  </p>
                </div>
              )}
              {error && step !== 6 && (
                <div className="cf-error" role="alert">
                  {step === 3 && img('CircleAlert')}
                  <div>
                    <strong>
                      {t(
                        step === 3
                          ? 'Required · Please choose a rating'
                          : 'Required · Please choose an answer',
                        step === 3 ? 'مطلوب · يرجى اختيار تقييم' : 'مطلوب · يرجى اختيار إجابة',
                      )}
                    </strong>
                    <p>
                      {t(
                        step === 3
                          ? 'Select 1 to 5 stars, then tap Next.'
                          : 'Choose an answer, then tap Next.',
                        'اختر إجابتك، ثم اضغط التالي.',
                      )}
                    </p>
                  </div>
                </div>
              )}
              {step < 6 && (
                <p className="cf-context">
                  {img(step === 1 ? 'MapPin2' : 'MapPin')}
                  {step === 1
                    ? t('Feedback for your latest visit', 'رأيك عن زيارتك الأخيرة')
                    : t(
                        `${answers.branch} · Your latest visit`,
                        `${answers.branch} · زيارتك الأخيرة`,
                      )}
                </p>
              )}
            </>
          ) : step === 7 ? (
            <>
              <div className="cf-prompt">
                <span className="cf-error-text">
                  {t(
                    `${6 - missing.filter(Boolean).length} of 6 required questions answered`,
                    'بعض الأسئلة المطلوبة لم تتم الإجابة عنها',
                  )}
                </span>
                <h1 ref={heading} tabIndex={-1}>
                  {t(
                    missing.filter(Boolean).length === 1
                      ? 'One more answer before you submit'
                      : 'Complete your required answers before submitting',
                    'إجابة أخرى قبل الإرسال',
                  )}
                </h1>
              </div>
              <div className="cf-warning">
                {img('TriangleAlert')}
                <div>
                  <strong>{t('Your survey hasn’t been sent', 'لم يتم إرسال الاستبيان')}</strong>
                  <p>
                    {t(
                      `Answer question ${missing.indexOf(true) === 5 ? 6 : missing.indexOf(true) + 1}, then submit again.`,
                      'أجب عن السؤال المطلوب، ثم أرسل مجددًا.',
                    )}
                  </p>
                </div>
              </div>
              <div className="cf-review">
                {[
                  'Branch',
                  'Visit purpose',
                  'Overall experience',
                  'Highlights',
                  'Recommendation',
                  'Comment',
                  'First visit',
                ].map((label, i) => (
                  <button key={label} onClick={() => openReviewQuestion(i === 6 ? 10 : i + 1)}>
                    {img(
                      (i === 6 ? missing[5] : i === 5 ? false : missing[i])
                        ? 'CircleAlert'
                        : 'CircleCheck',
                    )}
                    <span>
                      <strong>{label}</strong>
                      <small
                        className={
                          (i === 6 ? missing[5] : i === 5 ? false : missing[i])
                            ? 'cf-error-text'
                            : ''
                        }
                      >
                        {(i === 6 ? missing[5] : i === 5 ? false : missing[i])
                          ? 'Required · Not answered'
                          : [
                              answers.branch,
                              answers.visit,
                              `${answers.rating} out of 5`,
                              answers.highlights.join(', '),
                              `${answers.recommendation} out of 10`,
                              answers.comment
                                ? `Added · ${answers.comment.length} characters`
                                : 'Not added',
                              answers.firstVisit,
                            ][i]}
                      </small>
                    </span>
                    {img('ChevronRight')}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className={'cf-symbol ' + (step === 9 ? 'cf-success' : 'cf-loading')}>
                {img(step === 9 ? 'Check' : 'LoadingIndicator')}
              </div>
              <div className="cf-prompt">
                {step === 9 && (
                  <span className="cf-eyebrow">{t('FEEDBACK RECEIVED', 'تم استلام رأيك')}</span>
                )}
                <h1 ref={heading} tabIndex={-1}>
                  {t(
                    step === 9 ? 'Thank you for sharing your experience.' : 'Sending your feedback',
                    step === 9 ? 'شكرًا لمشاركتنا تجربتك.' : 'جارٍ إرسال رأيك',
                  )}
                </h1>
                <p>
                  {t(
                    step === 9
                      ? 'Your feedback helps us make every visit a little better. We look forward to welcoming you back.'
                      : 'Just a moment. We’re securely sending your answers to Bloom & Co.',
                    step === 9
                      ? 'رأيك يساعدنا على تحسين كل زيارة. نتطلع لاستقبالك مجددًا.'
                      : 'لحظة من فضلك. جارٍ إرسال إجاباتك إلى Bloom & Co.',
                  )}
                </p>
              </div>
              {summary}
              {step === 9 ? (
                <p className="cf-return">
                  {img('Coffee')}
                  {t('To Bloom & Co. team', 'إلى فريق Bloom & Co.')}
                </p>
              ) : (
                <p className="cf-anonymous">
                  {t(
                    'Please keep this page open until you see your confirmation.',
                    'اترك الصفحة مفتوحة حتى يظهر تأكيد الإرسال.',
                  )}
                </p>
              )}
              {sendError && <p role="alert">{sendError}</p>}
            </>
          )}
        </main>
        <footer className="cf-footer">
          {step === 0 ? (
            <>
              <button className="cf-primary" onClick={() => move(1)}>
                {t('Start Survey', 'ابدأ الاستبيان')}
              </button>
              <p className="cf-support">{t('Works on any phone', 'يعمل على أي هاتف')}</p>
            </>
          ) : isQuestion ? (
            <>
              {step === 6 && (
                <p className="cf-support">
                  {t(
                    'Your answers will be sent to Bloom & Co.',
                    'سيتم إرسال إجاباتك إلى Bloom & Co.',
                  )}
                </p>
              )}
              <div className="cf-actions">
                <button onClick={() => move(step === 6 ? 10 : step === 10 ? 5 : step - 1)}>
                  {step === 1 ? t('Back', 'رجوع') : t('Previous', 'السابق')}
                </button>
                <button className="cf-primary" onClick={step === 6 ? submit : next}>
                  {step === 6 && img('Send')}
                  {step === 6 ? t('Submit', 'إرسال') : t('Next', 'التالي')}
                </button>
              </div>
            </>
          ) : step === 7 ? (
            <>
              <button
                className="cf-primary"
                onClick={() => openReviewQuestion(missingStep(missing.indexOf(true)))}
              >
                {t('Answer missing question', 'أجب عن السؤال الناقص')}
              </button>
              <p className="cf-support">
                {t(
                  'Your other answers are kept in this survey.',
                  'إجاباتك الأخرى محفوظة في هذا الاستبيان.',
                )}
              </p>
            </>
          ) : step === 8 ? (
            <button className="cf-primary" disabled>
              {img('LoaderCircle', '808-1879', 'cf-spin')}
              {t('Submitting…', 'جارٍ الإرسال…')}
            </button>
          ) : (
            <div className="cf-done">
              <strong>
                {t('You’re all done. You can close this page.', 'انتهيت. يمكنك إغلاق الصفحة.')}
              </strong>
              <p>{t('No account or follow-up needed.', 'لا يلزم حساب أو متابعة.')}</p>
            </div>
          )}
          {footer}
        </footer>
      </section>
    </div>
  );
}
