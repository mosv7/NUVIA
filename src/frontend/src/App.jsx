import { LanguageMenu } from './components/ChoiceMenu.jsx';
import React, { useEffect, useRef, useState } from 'react';
import Field from './components/Field.jsx';
import LanguageIcon from './components/LanguageIcon.jsx';
import { en, ar } from './i18n.js';
import { submitDemo, authApi } from './services/auth.js';
import { AuthProvider, useAuth } from './auth/AuthProvider.jsx';
import { routePolicy, afterLogin } from './auth/route-policy.js';
import VerificationPage from './auth/VerificationPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import FeedbacksPage from './pages/FeedbacksPage.jsx';
import { asset as resolveAsset } from './assets.js';
import BusinessOnboarding, { ConnectedBusinessOnboarding } from './pages/BusinessOnboarding.jsx';
const routes = [
  'landing',
  'dashboard',
  'dashboard-empty',
  'feedbacks',
  'feedbacks-empty',
  'feedback-details',
  'login',
  'signup',
  'forgot',
  'reset',
  'verify-email',
  'business-information',
  'business-error',
  'business-setup',
  'get-started',
];
const currentRoute = () => {
  const value = location.hash.slice(2).split('?')[0];
  return routes.includes(value) ? value : 'landing';
};
function AppContent() {
  const auth = useAuth(),
    preview = auth.preview,
    cancel = auth.cancel;
  const submission = useRef(null),
    resetToken = useRef(null);
  const requestGeneration = useRef(0);
  const [business, setBusiness] = useState({
    businessName: '',
    industry: '',
    branchType: 'multiple',
    branchName: '',
  });
  const [page, setPage] = useState(currentRoute),
    [language, setLanguage] = useState(() => localStorage.getItem('nuvia-language') || 'en'),
    [values, setValues] = useState({
      name: '',
      email: '',
      password: '',
      confirm: '',
      terms: false,
      remember: false,
    }),
    [errors, setErrors] = useState({}),
    [notice, setNotice] = useState(''),
    [busy, setBusy] = useState(false);
  const t = language === 'ar' ? ar : en,
    isSignup = page === 'signup',
    isLogin = page === 'login',
    isForgot = page === 'forgot';
  useEffect(() => {
    const listener = () => {
      if (currentRoute() !== 'reset') resetToken.current = null;
      submission.current?.abort();
      cancel();
      requestGeneration.current += 1;
      setBusy(false);
      setPage(currentRoute());
      setErrors({});
      setNotice('');
      setValues({ name: '', email: '', password: '', confirm: '', terms: false, remember: false });
    };
    addEventListener('hashchange', listener);
    return () => {
      removeEventListener('hashchange', listener);
      submission.current?.abort();
      requestGeneration.current += 1;
    };
  }, [cancel]);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('nuvia-language', language);
  }, [language]);
  const resetParam = new URLSearchParams(location.hash.split('?')[1]).get('token');
  useEffect(() => {
    if (page !== 'reset' || preview) return;
    const token = resetParam;
    if (token) {
      resetToken.current = token;
      history.replaceState(null, '', `${location.pathname}#/reset`);
    }
  }, [page, preview, resetParam]);
  const policy = routePolicy({ route: page, preview, user: auth.user, workspace: auth.workspace });
  const redirect = policy.redirect;
  useEffect(() => {
    if (auth.status === 'ready' && redirect) location.hash = '/' + redirect;
  }, [auth.status, redirect]);
  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }));
    setErrors((old) => ({ ...old, [name]: undefined }));
    setNotice('');
  };
  const field = (name, label, placeholder, type = 'text', hint) => (
    <Field
      key={name}
      name={name}
      label={label}
      placeholder={placeholder}
      type={type}
      value={values[name]}
      onChange={change}
      error={errors[name] ? t[errors[name]] : undefined}
      hint={hint}
      showLabel={t.show}
      hideLabel={t.hide}
    />
  );
  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    const next = {};
    if (isSignup && !values.name.trim()) next.name = 'required';
    if (page !== 'reset' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      next.email = values.email ? 'invalidEmail' : 'required';
    if (!isForgot) {
      if (!values.password) next.password = 'required';
      else if (!isLogin && !/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(values.password))
        next.password = 'weakPassword';
      if (!isLogin && values.confirm !== values.password) next.confirm = 'mismatch';
    }
    if (isSignup && !values.terms) next.terms = 'termsError';
    setErrors(next);
    setNotice('');
    if (Object.keys(next).length) return;
    const generation = ++requestGeneration.current;
    const isCurrentRequest = () =>
      generation === requestGeneration.current && currentRoute() === page;
    setBusy(true);
    submission.current?.abort();
    const controller = new AbortController();
    submission.current = controller;
    try {
      if (!preview) {
        if (isSignup) {
          await authApi.register(
            {
              name: values.name,
              email: values.email,
              password: values.password,
              terms: values.terms,
              locale: language,
            },
            controller.signal,
          );
          if (isCurrentRequest()) location.hash = '/verify-email';
        } else if (isLogin) {
          const session = await auth.login(
            { email: values.email, password: values.password, remember: values.remember },
            controller.signal,
          );
          if (isCurrentRequest() && session) location.hash = '/' + afterLogin(session.workspace);
        } else if (isForgot) {
          await authApi.forgot(values.email, controller.signal);
          if (isCurrentRequest()) setNotice('resetAccepted');
        } else {
          await authApi.reset(
            { token: resetToken.current, password: values.password },
            controller.signal,
          );
          if (isCurrentRequest()) await auth.refresh();
          if (isCurrentRequest()) {
            resetToken.current = null;
            location.hash = '/login';
          }
        }
        if (isCurrentRequest()) setValues((v) => ({ ...v, password: '', confirm: '' }));
        return;
      }
      const result = await submitDemo(page, values);
      if (!isCurrentRequest()) return;
      if (result.field) setErrors({ [result.field]: result.error });
      else setNotice(result.error || result.message);
    } catch (error) {
      if (!isCurrentRequest() || error.name === 'AbortError') return;
      if (error.code === 'EMAIL_USED') setErrors({ email: 'emailUsed' });
      else if (error.code === 'EMAIL_VERIFICATION_REQUIRED') location.hash = '/verify-email';
      else
        setNotice(
          {
            INVALID_CREDENTIALS: 'loginFailed',
            INVALID_TOKEN: 'invalidToken',
            RATE_LIMITED: 'rateLimited',
          }[error.code] || 'requestFailed',
        );
    } finally {
      if (isCurrentRequest()) setBusy(false);
    }
  }
  const title = isLogin
    ? t.welcome
    : isSignup
      ? t.signupTitle
      : isForgot
        ? t.forgotTitle
        : t.resetTitle;
  const intro = isLogin
    ? t.loginIntro
    : isSignup
      ? t.signupIntro
      : isForgot
        ? t.forgotIntro
        : t.resetIntro;
  const assetPrefix = isSignup
    ? '159-1494'
    : isForgot
      ? '159-1722'
      : page === 'reset'
        ? '159-1831'
        : 'login';
  const asset = (name, extension = 'svg') => resolveAsset(`${assetPrefix}-${name}.${extension}`);
  if (!preview && !policy.allow) {
    return (
      <main className="session-state" aria-live="polite">
        <h1>{t.loading}</h1>
        {auth.status === 'error' && (
          <>
            <p>{t.requestFailed}</p>
            <button className="primary" onClick={() => auth.refresh().catch(() => {})}>
              {t.retry}
            </button>
          </>
        )}
      </main>
    );
  }
  if (page === 'verify-email') return <VerificationPage language={language} preview={preview} />;
  if (
    page === 'reset' &&
    !preview &&
    !resetToken.current &&
    !new URLSearchParams(location.hash.split('?')[1]).get('token')
  )
    return (
      <main className="session-state">
        <h1>{t.resetTitle}</h1>
        <p role="alert">{t.invalidToken}</p>
        <a href="#/forgot">{t.send}</a>
      </main>
    );
  if (['feedbacks', 'feedbacks-empty', 'feedback-details'].includes(page))
    return (
      <FeedbacksPage
        key={location.hash}
        page={page}
        language={language}
        setLanguage={setLanguage}
        workspace={auth.workspace}
        onLogout={auth.logout}
        preview={preview}
      />
    );
  if (page === 'dashboard' || page === 'dashboard-empty')
    return (
      <DashboardPage
        language={language}
        setLanguage={setLanguage}
        empty={!preview || page === 'dashboard-empty'}
        workspace={auth.workspace}
        onLogout={auth.logout}
        preview={preview}
      />
    );
  if (page === 'landing') return <LandingPage language={language} setLanguage={setLanguage} />;
  if (['business-information', 'business-error', 'business-setup', 'get-started'].includes(page))
    return preview ? (
      <BusinessOnboarding
        page={page}
        language={language}
        setLanguage={setLanguage}
        values={business}
        setValues={setBusiness}
      />
    ) : (
      <ConnectedBusinessOnboarding
        key={auth.user.id}
        page={page}
        language={language}
        setLanguage={setLanguage}
      />
    );
  return (
    <main className="auth-layout">
      <section className="auth-panel">
        <header>
          <div className="brand">
            <span>
              <img src={asset('imgLogo')} alt="" />
            </span>
            <strong>NUVIA</strong>
          </div>
          <button
            className="back"
            aria-label={t.back}
            onClick={() => {
              location.hash = '/landing';
            }}
          >
            <img
              src={asset(isForgot || page === 'reset' ? 'imgBackArrow' : 'imgArrowLeft')}
              alt=""
            />
            <span className="back-text">{t.back}</span>
          </button>
        </header>
        <div className={`auth-content ${isSignup ? 'signup' : ''} ${isLogin ? 'login' : ''}`}>
          <div className="intro">
            <h1>{title}</h1>
            <p>{intro}</p>
          </div>
          {(isLogin || isSignup) && (
            <>
              <button
                type="button"
                className="google"
                disabled={!preview}
                title={!preview ? t.googleUnavailable : undefined}
                onClick={() => setNotice('googleDemo')}
              >
                <img src={asset('imgGoogleLogo')} alt="" />
                {isSignup ? t.googleSignup : t.google}
              </button>
              <div className="divider">
                <span />
                {isSignup ? t.dividerSignup : t.divider}
                <span />
              </div>
            </>
          )}
          <form noValidate onSubmit={submit} className={isLogin ? 'login-form' : ''}>
            {isSignup && field('name', t.name, t.namePlaceholder)}
            {page !== 'reset' && field('email', t.email, 'you@company.com', 'email')}
            {!isForgot &&
              field(
                'password',
                page === 'reset' ? t.newPassword : t.password,
                isSignup
                  ? t.createPassword
                  : page === 'reset'
                    ? t.newPasswordPlaceholder
                    : t.passwordPlaceholder,
                'password',
                !isLogin ? t.passwordHint : undefined,
              )}
            {(isSignup || page === 'reset') &&
              field('confirm', t.confirm, isSignup ? t.confirm : t.confirmPlaceholder, 'password')}
            {isLogin && (
              <div className="preferences">
                <label>
                  <input
                    type="checkbox"
                    name="remember"
                    checked={values.remember}
                    onChange={change}
                  />
                  {t.remember}
                </label>
                <a href="#/forgot">{t.forgot}</a>
              </div>
            )}
            {isSignup && (
              <div>
                <label className="terms">
                  <input type="checkbox" name="terms" checked={values.terms} onChange={change} />
                  <span>
                    {t.agree}{' '}
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => setNotice('unavailable')}
                    >
                      {t.terms}
                    </button>{' '}
                    {t.and}{' '}
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => setNotice('unavailable')}
                    >
                      {t.privacy}
                    </button>
                    .
                  </span>
                </label>
                {errors.terms && <p className="error-text">{t[errors.terms]}</p>}
              </div>
            )}
            {notice && (
              <p
                role="status"
                className={`notice ${notice === 'loginFailed' ? 'error-notice' : ''}`}
              >
                {t[notice]}
              </p>
            )}
            <button disabled={busy} className="primary" type="submit">
              {busy
                ? t.loading
                : isLogin
                  ? t.login
                  : isSignup
                    ? t.signup
                    : isForgot
                      ? t.send
                      : t.reset}
            </button>
          </form>
          <p className="cross-link">
            {isLogin ? (
              <>
                {t.newUser} <a href="#/signup">{t.createAccount}</a>
              </>
            ) : isSignup ? (
              <>
                {t.existing} <a href="#/login">{t.login}</a>
              </>
            ) : (
              <a href="#/login">
                <span aria-hidden="true">{language === 'ar' ? '→' : '←'}</span> {t.backLogin}
              </a>
            )}
          </p>
          {isSignup && preview && (
            <p className="setup-preview-link">
              <a href="#/business-information">
                {language === 'ar' ? 'معاينة إعداد النشاط' : 'Preview business setup'}
              </a>
            </p>
          )}
        </div>
        <footer>
          <span>© 2026 NUVIA</span>
          <div>
            <button onClick={() => setNotice('unavailable')}>{t.privacy}</button>
            <button onClick={() => setNotice('unavailable')}>{t.help}</button>
            <label className="language">
              <LanguageIcon />
              <img
                src={asset(isForgot || page === 'reset' ? 'imgLanguageIcon' : 'imgGlobe')}
                alt=""
              />
              <LanguageMenu value={language} onChange={setLanguage} />
            </label>
          </div>
        </footer>
      </section>
      <aside className="story">
        <div className="eyebrow">
          <img src={asset('imgSparkles')} alt="" />
          {t.eyebrow}
        </div>
        <h2>
          {isSignup ? t.signupStory : t.storyTitle}
          <span>{isSignup ? t.signupBlue : t.storyBlue}</span>
        </h2>
        <div className="illustration">
          <img className="art" src={asset('imgIllustratedFeedbackObjects', 'png')} alt="" />
          <div className="comment-card">
            <div className="source">
              <span>AM</span>
              {t.source}
            </div>
            <p>{isSignup ? t.signupQuote : t.quote}</p>
            <small>{isSignup ? t.signupTag : t.tag}</small>
          </div>
          <div className="insight-card">
            <strong>
              <img src={asset(isSignup ? 'imgCircleCheck' : 'imgSparkles')} alt="" />
              {isSignup ? t.signupAction : t.action}
            </strong>
            <p>{isSignup ? t.signupInsight : t.insight}</p>
            {!isSignup && <small>{t.evidence}</small>}
          </div>
        </div>
        <p className="caption">{isSignup ? t.signupCaption : t.caption}</p>
        <div className="capability">
          <img
            src={asset(
              isForgot || page === 'reset'
                ? 'imgLanguageIcon1'
                : isSignup
                  ? 'imgGlobe'
                  : 'imgGlobe1',
            )}
            alt=""
          />
          {t.languages}
        </div>
      </aside>
    </main>
  );
}
export default function App() {
  const preview =
    location.pathname.startsWith('/preview/') ||
    (location.protocol === 'file:' && window.NUVIA_PREVIEW === true);
  return (
    <AuthProvider preview={preview}>
      {preview && <aside className="preview-notice">Design preview · معاينة التصميم</aside>}
      <AppContent />
    </AuthProvider>
  );
}
