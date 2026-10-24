import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { asset } from '../../lib/assets.js';
import { LanguageMenu } from '../../components/ui/ChoiceMenu.jsx';
import LanguageIcon from '../../components/ui/LanguageIcon.jsx';
const copy = {
  en: {
    expiredTitle: 'This link has expired',
    expiredIntro: 'Request a new verification email to finish activating your account.',
    verifiedTitle: 'Email verified',
    verifiedIntro: 'Your email address is confirmed. You can now log in to NUVIA.',
    continue: 'Continue to log in',
    back: 'Back to website',
    step: 'ACCOUNT VERIFICATION',
    title: 'Check your inbox',
    intro: 'One last step. Verify your email address to activate your NUVIA account.',
    sentTo: 'Verification email address',
    change: 'Change',
    save: 'Save email',
    email: 'Email address',
    resend: 'Resend verification link',
    noEmail: 'Can’t find the email?',
    help: 'Check your spam or junk folder, or request a new verification link.',
    login: 'Back to log in',
    secure: 'A small step to keep your account secure.',
    privacy: 'Privacy policy',
    helpCenter: 'Help center',
    eyebrow: 'FROM COMMENTS TO CLARITY',
    story: 'Every customer voice',
    storyBlue: 'Your next great decision',
    source: 'Customer feedback',
    quote: '“You really listened to what we needed. Thank you!”',
    tag: 'Service · Positive',
    action: 'FROM FEEDBACK TO IMPACT',
    insight: 'Turn great listening into better experiences.',
    caption:
      'Bring your feedback together. Discover the patterns, understand the why, and know what to do next.',
    languages: 'Arabic & English. Every voice understood.',
    demo: 'Preview only · No verification email has been sent.',
    resent: 'Demo only: the resend request was checked. No email was sent.',
    changed: 'Email updated for this preview. No verification email was sent.',
    wait: 'Resend available in',
    unavailable: 'This page will be available in the complete flow.',
  },
  ar: {
    expiredTitle: 'انتهت صلاحية الرابط',
    expiredIntro: 'اطلب رسالة تأكيد جديدة لإكمال تفعيل حسابك.',
    verifiedTitle: 'تم تأكيد بريدك',
    verifiedIntro: 'تم تأكيد عنوان بريدك الإلكتروني. أنت جاهز الآن لإعداد نشاطك التجاري.',
    continue: 'المتابعة لتسجيل الدخول',
    back: 'العودة إلى الموقع',
    step: 'تأكيد الحساب',
    title: 'راجع بريدك الإلكتروني',
    intro: 'باقي خطوة واحدة. أكّد بريدك الإلكتروني لتفعيل حسابك في NUVIA.',
    sentTo: 'البريد الإلكتروني للتأكيد',
    change: 'تغيير',
    save: 'حفظ البريد',
    email: 'البريد الإلكتروني',
    resend: 'إعادة إرسال رابط التأكيد',
    noEmail: 'لم تصلك الرسالة؟',
    help: 'راجع مجلد الرسائل غير المرغوب فيها، أو اطلب رابط تأكيد جديدًا.',
    login: 'العودة إلى تسجيل الدخول',
    secure: 'خطوة بسيطة للحفاظ على أمان حسابك.',
    privacy: 'سياسة الخصوصية',
    helpCenter: 'مركز المساعدة',
    eyebrow: 'من التعليقات إلى الوضوح',
    story: 'كل صوت من عملائك',
    storyBlue: 'قرارك الرائع القادم',
    source: 'رأي عميل',
    quote: '«استمعتم حقًا لما نحتاجه. شكرًا لكم!»',
    tag: 'الخدمة · إيجابي',
    action: 'من الآراء إلى التأثير',
    insight: 'حوّل حسن الاستماع إلى تجارب أفضل.',
    caption: 'اجمع آراء عملائك. اكتشف الأنماط، وافهم الأسباب، وحدد خطوتك القادمة.',
    languages: 'العربية والإنجليزية. نفهم كل صوت.',
    demo: 'معاينة فقط · لم يتم إرسال رسالة تأكيد فعلية.',
    resent: 'عرض تجريبي: تم التحقق من طلب إعادة الإرسال، ولم يتم إرسال رسالة فعلية.',
    changed: 'تم تحديث البريد في المعاينة. لم يتم إرسال رسالة تأكيد فعلية.',
    wait: 'يمكن إعادة الإرسال بعد',
    unavailable: 'ستتاح هذه الصفحة في التدفق الكامل.',
  },
};
function Arrow() {
  return (
    <svg
      className="auth-arrow"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 3.3328L3.3328 8L8 12.6672M3.3328 8H12.6672"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
function Mail() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <rect x="3" y="6" width="26" height="20" rx="4" />
      <path d="m4 8 12 9L28 8" />
    </svg>
  );
}
export default function EmailVerificationView({
  language,
  setLanguage,
  email,
  onEmailChange,
  status = 'sent',
  busy = false,
  message,
  onResend,
}) {
  const t = copy[language],
    root = useRef(null),
    emailInput = useRef(null),
    [editing, setEditing] = useState(false),
    [draft, setDraft] = useState(email || ''),
    [seconds, setSeconds] = useState(0),
    [notice, setNotice] = useState('');
  const img = (name) => asset('auth/signup/' + name);
  useEffect(() => {
    if (!seconds) return;
    const timeout = setTimeout(() => setSeconds((n) => Math.max(0, n - 1)), 1000);
    return () => clearTimeout(timeout);
  }, [seconds]);
  useEffect(() => {
    if (editing) emailInput.current?.focus();
  }, [editing]);
  useLayoutEffect(() => {
    const el = root.current;
    if (typeof ResizeObserver === 'undefined') return;
    let frame;
    const fit = () => {
      for (const [spaceName, contentName] of [
        ['.verify-space', '.verify-content'],
        ['.story', '.story-inner'],
      ]) {
        const space = el.querySelector(spaceName),
          content = el.querySelector(contentName);
        if (!space.clientHeight) continue;
        const scale = Math.min(1, (space.clientHeight - 4) / Math.max(1, content.offsetHeight));
        content.style.transform = `translate(-50%,-50%) scale(${scale})`;
      }
    };
    const resize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fit);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    observer.observe(el.querySelector('.verify-content'));
    observer.observe(el.querySelector('.story-inner'));
    document.fonts?.ready.then(resize);
    fit();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [language, status]);
  const save = (e) => {
    e.preventDefault();
    onEmailChange(draft.trim());
    setEditing(false);
    setSeconds(0);
  };
  return (
    <main className="auth-layout email-verification" ref={root}>
      <section className="auth-panel">
        <header>
          <div className="brand">
            <strong>NUVIA</strong>
          </div>
          <a className="back" href="#/landing" aria-label={t.back} title={t.back}>
            <Arrow />
            {t.back}
          </a>
        </header>
        <div className="verify-space">
          <div className="verify-content">
            <div className="step">
              <span />
              <span />
              <span />
              <small>{t.step}</small>
            </div>
            <div className={'mail-icon' + (status === 'verified' ? ' success-icon' : '')}>
              {status === 'verified' ? (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <circle cx="16" cy="16" r="12" />
                  <path d="m10 16 4 4 8-8" />
                </svg>
              ) : (
                <Mail />
              )}
            </div>
            <div className="intro">
              <h1 className={status === 'expired' ? 'expired-title' : undefined}>
                {status === 'expired'
                  ? t.expiredTitle
                  : status === 'verified'
                    ? t.verifiedTitle
                    : t.title}
              </h1>
              <p>
                {status === 'expired'
                  ? t.expiredIntro
                  : status === 'verified'
                    ? t.verifiedIntro
                    : t.intro}
              </p>
            </div>
            {status !== 'verified' && (
              <div className="email-box">
                <Mail />
                <div>
                  <small>{t.sentTo}</small>
                  <strong dir="ltr">{email || 'you@company.com'}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(email || '');
                    setEditing(true);
                  }}
                >
                  {t.change}
                </button>
              </div>
            )}
            {editing && status !== 'verified' && (
              <form className="edit-form" onSubmit={save}>
                <input
                  ref={emailInput}
                  aria-label={t.email}
                  type="email"
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    onEmailChange(e.target.value);
                  }}
                  required
                  autoComplete="email"
                />
                <button type="submit">{t.save}</button>
              </form>
            )}
            <button
              className="primary"
              disabled={busy || (status !== 'verified' && seconds > 0)}
              onClick={async () => {
                if (status === 'verified') {
                  location.hash = '/login';
                  return;
                }
                setNotice('');
                if (editing && !emailInput.current?.reportValidity()) return;
                if (!email) {
                  setEditing(true);
                  return;
                }
                if (await onResend()) setSeconds(60);
              }}
            >
              {status === 'verified'
                ? t.continue
                : busy
                  ? language === 'ar'
                    ? 'يرجى الانتظار…'
                    : 'Please wait…'
                  : seconds
                    ? t.wait + ' ' + seconds + 's'
                    : t.resend}
            </button>
            {(message || notice) && (
              <p className="notice" role="status">
                {notice ? t[notice] : message}
              </p>
            )}
            <p className="cross-link">
              <a href="#/login">
                <Arrow />
                {t.login}
              </a>
            </p>
          </div>
        </div>
        <footer>
          <span>© 2026 NUVIA</span>
          <div>
            <button onClick={() => setNotice('unavailable')}>{t.privacy}</button>
            <button onClick={() => setNotice('unavailable')}>{t.helpCenter}</button>
            <span className="language">
              <LanguageIcon />
              <LanguageMenu value={language} onChange={setLanguage} />
            </span>
          </div>
        </footer>
      </section>
      <aside className="story">
        <div className="story-inner">
          <div className="eyebrow">
            <img className="brand-icon" src={img('story-ai-sparkles.svg')} alt="" />
            {t.eyebrow}
          </div>
          <h2>
            <span className="story-main-title">{t.story}</span>
            <span>{t.storyBlue}</span>
          </h2>
          <div className="illustration">
            <img className="art" src={img('story-feedback-illustration.png')} alt="" />
            <div className="comment-card">
              <div className="source">
                <span>AM</span>
                {t.source}
              </div>
              <p>{t.quote}</p>
              <small>{t.tag}</small>
            </div>
            <div className="insight-card">
              <strong>
                <img className="brand-icon" src={img('story-feedback-impact-check.svg')} alt="" />
                {t.action}
              </strong>
              <p>{t.insight}</p>
            </div>
          </div>
          <p className="caption">{t.caption}</p>
          <div className="capability">
            <LanguageIcon />
            {t.languages}
          </div>
        </div>
      </aside>
    </main>
  );
}
