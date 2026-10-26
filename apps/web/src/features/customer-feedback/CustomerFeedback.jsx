import { useState, useEffect, useRef } from 'react';

import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/noto-sans-arabic/400.css';
import '@fontsource/noto-sans-arabic/500.css';
import '@fontsource/noto-sans-arabic/600.css';
import './customer-feedback.css';
function Icon({ name, size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === 'star' ? (
        <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" />
      ) : name === 'check' ? (
        <path d="m5 12 4 4L19 6" />
      ) : name === 'globe' ? (
        <>
          <circle cx="12" cy="12" r="9" />
          <ellipse cx="12" cy="12" rx="4" ry="9" />
          <path d="M3 12h18M5 7h14M5 17h14" />
        </>
      ) : name === 'delivery' ? (
        <>
          <path d="M3 6h11v12H3zM14 10h4l3 4v4h-7" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="18" cy="18" r="2" />
        </>
      ) : name === 'store' ? (
        <>
          <path d="m3 10 2-6h14l2 6M4 10v11h16V10M9 21v-7h6v7M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
        </>
      ) : name === 'lock' ? (
        <>
          <rect x="5" y="10" width="14" height="11" rx="3" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </>
      ) : name === 'send' ? (
        <>
          <path d="m21 3-7 18-4-7-7-4 18-7ZM10 14 21 3" />
        </>
      ) : (
        <>
          <path d="M4 5h16v13H8l-4 3V5Z" />
          <path d="M8 10h8M8 14h5" />
        </>
      )}
    </svg>
  );
}
export default function CustomerFeedback({ language } = {}) {
  const [ar, setAr] = useState(
      () => (language || new URLSearchParams(location.search).get('lang')) === 'ar',
    ),
    [score, setScore] = useState(0),
    [service, setService] = useState(''),
    [feedback, setFeedback] = useState(''),
    [agree, setAgree] = useState(false),
    [topics, setTopics] = useState([]),
    [nps, setNps] = useState(null),
    [errors, setErrors] = useState({}),
    [state, setState] = useState('form');
  const formRef = useRef(),
    successRef = useRef();
  const t = (en, arabic) => (ar ? arabic : en);
  const labels = ar
    ? ['سيئة جدًا', 'سيئة', 'متوسطة', 'جيدة', 'ممتازة']
    : ['Very poor', 'Poor', 'Okay', 'Good', 'Great'];
  useEffect(() => {
    document.documentElement.lang = ar ? 'ar' : 'en';
    document.documentElement.dir = ar ? 'rtl' : 'ltr';
  }, [ar]);
  useEffect(() => {
    if (state === 'success') {
      successRef.current?.focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [state]);
  function submit(e) {
    e.preventDefault();
    const next = {};
    if (!score) next.score = t('Choose a score to continue.', 'اختر تقييمًا للمتابعة.');
    if (!service)
      next.service = t('Choose one answer for Question 2.', 'اختر إجابة واحدة للسؤال ٢.');
    if (feedback.trim().length < 10)
      next.feedback = t('Please write at least 10 characters.', 'اكتب رأيك في ١٠ أحرف على الأقل.');
    if (!agree)
      next.agree = t(
        'Please agree to share your answer with the business.',
        'يرجى الموافقة على مشاركة إجابتك مع النشاط.',
      );
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() => formRef.current?.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }
    setState('sending');
    setTimeout(() => setState('success'), 600);
  }
  const reset = () => {
    setScore(0);
    setService('');
    setFeedback('');
    setAgree(false);
    setTopics([]);
    setNps(null);
    setErrors({});
    setState('form');
  };
  return (
    <div className="public-page">
      <header className="public-header">
        <img className="brand" src="/assets/brand/nuvia-logo.svg" alt="NUVIA" />
        <button
          className="language-control"
          onClick={() => setAr(!ar)}
          aria-label={t('Switch to Arabic', 'Switch to English')}
        >
          <Icon name="globe" />
          <span>{ar ? 'English' : 'العربية'}</span>
        </button>
      </header>
      <main>
        {state === 'success' ? (
          <section className="success-card" aria-labelledby="thank-you">
            <span className="success-icon">
              <Icon name="check" size={38} />
            </span>
            <span className="eyebrow">Bloom & Co.</span>
            <h1 id="thank-you" ref={successRef} tabIndex={-1}>
              {t('Thank you for your feedback', 'شكرًا لمشاركتنا رأيك')}
            </h1>
            <p>
              {t(
                'Your voice helps us create better experiences. We appreciate the time you took to share it.',
                'رأيك يساعدنا في تقديم تجربة أفضل. نقدّر الوقت الذي خصصته لمشاركتنا تجربتك.',
              )}
            </p>
            <div className="response-summary">
              <span>
                <Icon name="star" />
                {score} / 5 · {labels[score - 1]}
              </span>
              <span>
                <Icon name="check" />
                {t('Single choice · Option ', 'اختيار واحد · اختيار ') +
                  service.replace('option', '')}
              </span>
            </div>
            <button className="secondary-button" onClick={reset}>
              {t('Send another response', 'إرسال رأي آخر')}
            </button>
            <small>{t('From comments to clarity.', 'من الآراء إلى رؤية أوضح.')}</small>
          </section>
        ) : (
          <>
            <div className="survey-intro">
              <div className="business-heading">
                <span className="business-mark">B</span>
                <div>
                  <strong>Bloom & Co.</strong>
                  <span>
                    {t('Customer experience survey · Cairo', 'استبيان تجربة العملاء · القاهرة')}
                  </span>
                </div>
                <span className="time-badge">{t('~ 2 min', 'دقيقتان تقريبًا')}</span>
              </div>
              <h1>{t('Share your feedback', 'شاركنا رأيك')}</h1>
              <p>
                {t(
                  'Your feedback helps us make every experience better.',
                  'رأيك يساعدنا على تحسين كل تجربة.',
                )}
              </p>
            </div>
            <form
              className="survey-card"
              ref={formRef}
              onSubmit={submit}
              noValidate
              aria-label={t('Share your feedback', 'شاركنا رأيك')}
            >
              <fieldset className="question">
                <legend>
                  <span className="question-number">01</span>
                  {t('Question 1', 'سؤال ١')}
                  <span className="required">*</span>
                </legend>
                <p className="helper">{t('Select your star rating.', 'اختر تقييمك بالنجوم.')}</p>
                <div
                  className="star-rating"
                  role="radiogroup"
                  aria-label={t('Star rating', 'تقييم بالنجوم')}
                  aria-describedby="star-rating-label"
                  style={{
                    '--rating-color': score <= 2 ? '#dc6672' : score === 3 ? '#d3aa18' : '#269578',
                  }}
                >
                  {labels.map((label, i) => (
                    <button
                      type="button"
                      role="radio"
                      aria-checked={score === i + 1}
                      aria-invalid={!!errors.score}
                      aria-label={i + 1 + ' · ' + label}
                      className={i < score ? 'filled' : ''}
                      key={i}
                      onClick={() => {
                        setScore(i + 1);
                        setErrors((v) => ({ ...v, score: '' }));
                      }}
                      onKeyDown={(e) => {
                        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                          e.preventDefault();
                          const direction = ['ArrowRight', 'ArrowDown'].includes(e.key) ? 1 : -1;
                          const n = (i + direction + 5) % 5;
                          setScore(n + 1);
                          e.currentTarget.parentElement.children[n].focus();
                        }
                      }}
                    >
                      <Icon name="star" size={32} />
                    </button>
                  ))}
                </div>
                <p className="star-rating-label" id="star-rating-label" aria-live="polite">
                  {score
                    ? score + ' / 5 · ' + labels[score - 1]
                    : t('Choose a rating', 'اختر تقييمًا')}
                </p>
                {errors.score && (
                  <p id="score-error" className="error" role="alert">
                    {errors.score}
                  </p>
                )}
              </fieldset>
              <fieldset className="question">
                <legend>
                  <span className="question-number">02</span>
                  {t('Question 2', 'سؤال ٢')}
                  <span className="required">*</span>
                </legend>
                <p className="helper">{t('Choose one answer.', 'اختر إجابة واحدة.')}</p>
                <div
                  className="single-options"
                  role="radiogroup"
                  aria-label={t('Single choice', 'اختيار واحد')}
                >
                  {[1, 2, 3].map((n) => (
                    <label
                      className={'single-option ' + (service === 'option' + n ? 'selected' : '')}
                      key={n}
                    >
                      <input
                        type="radio"
                        name="single-choice"
                        value={'option' + n}
                        checked={service === 'option' + n}
                        aria-invalid={!!errors.service}
                        onChange={(e) => {
                          setService(e.target.value);
                          setErrors((v) => ({ ...v, service: '' }));
                        }}
                      />
                      <span>{t('Option ', 'اختيار ') + n}</span>
                    </label>
                  ))}
                </div>
                {errors.service && (
                  <p className="error" role="alert">
                    {errors.service}
                  </p>
                )}
              </fieldset>
              <fieldset className="question">
                <legend>
                  <span className="question-number">03</span>
                  {t('Question 3', 'سؤال ٣')}
                </legend>
                <p className="helper">
                  {t(
                    'Choose all that apply. This question is optional.',
                    'يمكنك اختيار أكثر من إجابة. هذا السؤال اختياري.',
                  )}
                </p>
                <div className="multiple-options">
                  {[1, 2, 3, 4]
                    .map((n) => ['option' + n, t('Option ', 'اختيار ') + n])
                    .map(([id, label]) => (
                      <label
                        className={'multiple-option ' + (topics.includes(id) ? 'selected' : '')}
                        key={id}
                      >
                        <input
                          type="checkbox"
                          checked={topics.includes(id)}
                          onChange={(e) =>
                            setTopics((prev) =>
                              e.target.checked ? [...prev, id] : prev.filter((v) => v !== id),
                            )
                          }
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                </div>
              </fieldset>
              <fieldset className="question">
                <legend>
                  <span className="question-number">04</span>
                  {t('Question 4', 'سؤال ٤')}
                </legend>
                <p className="helper">
                  {t(
                    'Choose a score from 0 to 10. This question is optional.',
                    'اختر تقييمًا من ٠ إلى ١٠. هذا السؤال اختياري.',
                  )}
                </p>
                <div
                  className="nps-options"
                  style={{ '--nps-color': '#1e68ef' }}
                  role="radiogroup"
                  aria-label={t(
                    'Likelihood to recommend, from zero to ten',
                    'احتمالية الترشيح من صفر إلى عشرة',
                  )}
                >
                  {Array.from({ length: 11 }, (_, n) => (
                    <button
                      type="button"
                      role="radio"
                      key={n}
                      aria-label={t('Score ', 'تقييم ') + n}
                      aria-checked={nps === n}
                      className={nps === n ? 'selected' : ''}
                      onClick={() => setNps(n)}
                      onKeyDown={(e) => {
                        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                          e.preventDefault();
                          let direction = ['ArrowRight', 'ArrowDown'].includes(e.key) ? 1 : -1;
                          let next = (n + direction + 11) % 11;
                          setNps(next);
                          e.currentTarget.parentElement.children[next].focus();
                        }
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <div className="nps-labels">
                  <span>{t('Not at all likely', 'غير محتمل إطلاقًا')}</span>
                  <span>{t('Extremely likely', 'محتمل جدًا')}</span>
                </div>
              </fieldset>
              <div className="question">
                <label className="text-label" htmlFor="feedback">
                  <span className="question-number">05</span>
                  {t('Question 5', 'سؤال ٥')}
                  <span className="required">*</span>
                </label>
                <p className="helper">
                  {t('Write your answer in the space below.', 'اكتب إجابتك في المساحة التالية.')}
                </p>
                <textarea
                  id="feedback"
                  value={feedback}
                  maxLength={1000}
                  rows={4}
                  aria-invalid={!!errors.feedback}
                  aria-describedby={errors.feedback ? 'feedback-error' : 'feedback-hint'}
                  placeholder={t('Your answer…', 'إجابتك…')}
                  onChange={(e) => {
                    setFeedback(e.target.value);
                    if (e.target.value.trim().length >= 10)
                      setErrors((v) => ({ ...v, feedback: '' }));
                  }}
                />
                <div className="textarea-meta">
                  <small id="feedback-hint">
                    {t(
                      'Please avoid sharing private or sensitive details.',
                      'يرجى عدم مشاركة بيانات خاصة أو حساسة.',
                    )}
                  </small>
                  <span>{feedback.length}/1000</span>
                </div>
                {errors.feedback && (
                  <p id="feedback-error" className="error" role="alert">
                    {errors.feedback}
                  </p>
                )}
              </div>
              <div className="consent-section">
                <label className="consent">
                  <input
                    type="checkbox"
                    checked={agree}
                    aria-invalid={!!errors.agree}
                    onChange={(e) => {
                      setAgree(e.target.checked);
                      setErrors((v) => ({ ...v, agree: '' }));
                    }}
                  />
                  <span>
                    {t(
                      'I agree to share this answer with the business.',
                      'أوافق على مشاركة هذه الإجابة مع النشاط التجاري.',
                    )}
                  </span>
                </label>
                {errors.agree && (
                  <p className="error" role="alert">
                    {errors.agree}
                  </p>
                )}
                <button className="primary-button" type="submit" disabled={state === 'sending'}>
                  {state === 'sending' ? (
                    <>
                      <span className="spinner" />
                      {t('Sending…', 'جارٍ الإرسال…')}
                    </>
                  ) : (
                    <>
                      <Icon name="send" size={18} />
                      {t('Send feedback', 'إرسال الرأي')}
                    </>
                  )}
                </button>
                <p className="privacy-note">
                  <Icon name="lock" size={13} />
                  {t(
                    'Your feedback is shared privately with Bloom & Co.',
                    'تتم مشاركة رأيك بشكل خاص مع Bloom & Co.',
                  )}
                </p>
              </div>
            </form>
          </>
        )}
      </main>
      <footer className="public-footer">
        <span>
          {t('Powered by', 'بدعم من')} <img src="/assets/brand/nuvia-logo.svg" alt="NUVIA" />
        </span>
        <span>{t('Every voice matters.', 'كل رأي له قيمة.')}</span>
      </footer>
    </div>
  );
}
