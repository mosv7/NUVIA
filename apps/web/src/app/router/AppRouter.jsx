import { currentRoute } from './routes.js';
import AuthPage from '../../features/auth/AuthPage.jsx';
import React, { useEffect, useRef, useState } from 'react';
import Field from '../../components/ui/Field.jsx';
import { en, ar } from '../../lib/i18n/auth-copy.js';
import { submitDemo, authApi } from '../../features/auth/api.js';
import { useAuth } from '../providers/AuthProvider.jsx';
import { routePolicy, afterLogin } from './access-policy.js';
import VerificationPage from '../../features/auth/VerificationPage.jsx';
import LandingPage from '../../features/landing/LandingPage.jsx';
import DashboardPage from '../../features/dashboard/DashboardPage.jsx';
import FeedbacksPage from '../../features/feedback/FeedbacksPage.jsx';
import { asset as resolveAsset } from '../../lib/assets.js';
import BusinessOnboarding, {
  ConnectedBusinessOnboarding,
} from '../../features/workspaces/BusinessOnboarding.jsx';
export default function AppRouter() {
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
    <AuthPage
      {...{
        t,
        asset,
        isSignup,
        isLogin,
        isForgot,
        page,
        preview,
        setNotice,
        submit,
        field,
        values,
        change,
        errors,
        notice,
        busy,
        setLanguage,
        language,
        title,
        intro,
      }}
    />
  );
}
