import { validateAuth } from '../../validation/auth.js';
import { safeLocalStorage } from '../../lib/storage.js';
import { installRouteHistory } from '../../components/layout/navigation.js';
import { currentRoute } from './routes.js';
import SecurityActionPage from '../../features/auth/SecurityActionPage.jsx';
import AuthPage from '../../features/auth/AuthPage.jsx';
import { lazy, useEffect, useRef, useState } from 'react';
import Field from '../../components/ui/Field.jsx';
import { en, ar } from '../../lib/i18n/auth-copy.js';
import { submitDemo, authApi } from '../../features/auth/api.js';
import { useAuth } from '../providers/AuthProvider.jsx';
import { routePolicy, afterLogin } from './access-policy.js';
import VerificationPage from '../../features/auth/VerificationPage.jsx';
import { asset as resolveAsset } from '../../lib/assets.js';
const CustomerFeedback = lazy(
  () => import('../../features/customer-feedback/CustomerFeedback.jsx'),
);
const SurveyPage = lazy(() => import('../../features/surveys/preview/SurveyPage.jsx'));
const AnalyticsPage = lazy(() => import('../../features/analytics/preview/AnalyticsPage.jsx'));
const ExtraPreviewPage = lazy(() => import('../../features/reports/preview/ExtraPreviewPage.jsx'));
const LandingPage = lazy(() => import('../../features/landing/LandingPage.jsx'));
const DashboardPage = lazy(() => import('../../features/dashboard/DashboardPage.jsx'));
const FeedbacksPage = lazy(() => import('../../features/feedback/FeedbacksPage.jsx'));
const BusinessOnboarding = lazy(() => import('../../features/workspaces/BusinessOnboarding.jsx'));
const ConnectedBusinessOnboarding = lazy(() =>
  import('../../features/workspaces/BusinessOnboarding.jsx').then((module) => ({
    default: module.ConnectedBusinessOnboarding,
  })),
);
const WorkspacePages = lazy(() => import('../../features/workspace/WorkspacePages.jsx'));
export default function AppRouter() {
  useEffect(() => installRouteHistory(), []);
  const auth = useAuth(),
    preview = auth.preview,
    cancel = auth.cancel;
  const submission = useRef(null),
    resetToken = useRef(null);
  const requestGeneration = useRef(0);
  const [challenge, setChallenge] = useState(null);
  const [business, setBusiness] = useState({
    businessName: '',
    industry: '',
    branchType: 'multiple',
    branchName: '',
  });
  const [page, setPage] = useState(currentRoute),
    [language, setLanguage] = useState(
      () =>
        (['en', 'ar'].includes(new URLSearchParams(location.search).get('lang'))
          ? new URLSearchParams(location.search).get('lang')
          : safeLocalStorage.getItem('nuvia-language')) || 'en',
    ),
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
      if (currentRoute() !== 'login-2fa') setChallenge(null);
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
    safeLocalStorage.setItem('nuvia-language', language);
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
    const next = validateAuth(page, values);
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
          const session = await auth.register(
            {
              name: values.name,
              email: values.email,
              password: values.password,
              passwordConfirmation: values.confirm,
              terms: values.terms,
              locale: language,
            },
            controller.signal,
          );
          if (isCurrentRequest() && session) location.hash = '/' + afterLogin(session.workspace);
        } else if (isLogin) {
          const session = await auth.login(
            { email: values.email, password: values.password, remember: values.remember },
            controller.signal,
          );
          if (isCurrentRequest() && session?.requiresTwoFactor) {
            setChallenge(session.twoFactorToken);
            location.hash = '/login-2fa';
          } else if (isCurrentRequest() && session)
            location.hash = '/' + afterLogin(session.workspace);
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
  if (!preview && ['login-2fa', 'confirm-email'].includes(page))
    return (
      <SecurityActionPage
        key={page}
        page={page}
        challenge={challenge}
        language={language}
        setLanguage={setLanguage}
      />
    );
  const previewProduct =
    preview &&
    ([
      'dashboard',
      'dashboard-empty',
      'feedback-details',
      'analytics',
      'surveys',
      'nuvia-assistant',
      'assistant',
      'reports',
      'report-details',
      'notifications',
      'subscription',
      'action-board',
      'evidence',
    ].includes(page) ||
      page.startsWith('feedbacks') ||
      page.startsWith('analytics-') ||
      page.startsWith('survey-'));
  if (previewProduct)
    return (
      <div className="workspace-extension">
        <WorkspacePages language={language} setLanguage={setLanguage} />
      </div>
    );
  if (page === 'customer-feedback' && preview)
    return (
      <div className="customer-feedback-root">
        <CustomerFeedback language={language} setLanguage={setLanguage} />
      </div>
    );
  if (
    [
      'business',
      'business-edit',
      'business-add',
      'branch',
      'branches',
      'branch-add',
      'branch-edit',
      'branch-history',
      'subscription',
      'notifications',
      'analytics',
      'surveys',
      'assistant',
      'action-board',
      'evidence',
    ].includes(page) ||
    page.startsWith('settings')
  )
    return (
      <div className="workspace-extension">
        <WorkspacePages
          key={preview ? 'preview' : auth.user?.id}
          language={language}
          setLanguage={setLanguage}
        />
      </div>
    );
  const designOnly =
    page === 'customer-feedback' ||
    page.startsWith('survey-') ||
    page.startsWith('analytics-') ||
    ['reports', 'report-details', 'feedbacks-loading', 'feedbacks-no-results'].includes(page);
  if (designOnly) {
    if (
      !preview &&
      (page.startsWith('analytics-') ||
        page === 'reports' ||
        ['survey-all', 'survey-empty'].includes(page))
    )
      return (
        <div className="workspace-extension">
          <WorkspacePages language={language} setLanguage={setLanguage} />
        </div>
      );
    if (!preview)
      return (
        <main className="session-state">
          <h1>
            {language === 'ar' ? 'الميزة غير متاحة بعد' : 'This feature is not available yet.'}
          </h1>
          <p>
            {language === 'ar'
              ? 'يمكنك مراجعة التصميم ببيانات تجريبية.'
              : 'Review the design with sample data.'}
          </p>
          <a href={'/preview/#/' + page}>
            {language === 'ar' ? 'فتح معاينة التصميم' : 'Open design preview'}
          </a>
          <a href="#/dashboard">
            {language === 'ar' ? 'رجوع إلى النظرة العامة' : 'Back to Overview'}
          </a>
        </main>
      );
    if (page.startsWith('survey-'))
      return (
        <SurveyPage key={location.hash} page={page} language={language} setLanguage={setLanguage} />
      );
    if (page.startsWith('analytics-'))
      return (
        <AnalyticsPage
          key={location.hash}
          page={page}
          language={language}
          setLanguage={setLanguage}
        />
      );
    if (['reports', 'report-details', 'nuvia-assistant'].includes(page))
      return (
        <ExtraPreviewPage
          key={location.hash}
          page={page}
          language={language}
          setLanguage={setLanguage}
        />
      );
    return (
      <FeedbacksPage
        key={location.hash}
        page={page}
        language={language}
        setLanguage={setLanguage}
        preview
      />
    );
  }
  if (!preview && page.startsWith('verify-email'))
    return (
      <main className="session-state">
        <h1>
          {language === 'ar'
            ? 'تأكيد البريد قيد التطوير'
            : 'Email verification is under development'}
        </h1>
        <p>
          {language === 'ar'
            ? 'تأكيد البريد غير متاح في الخدمة الحالية.'
            : 'The current service does not support email verification yet.'}
        </p>
        <a href="#/login">{t.login}</a>
      </main>
    );
  if (page === 'verify-email' || (preview && page.startsWith('verify-email-')))
    return (
      <VerificationPage
        key={page}
        language={language}
        setLanguage={setLanguage}
        previewStatus={
          page.endsWith('-expired')
            ? 'invalid'
            : page.endsWith('-verified')
              ? 'verified'
              : 'pending'
        }
        preview={preview}
      />
    );
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
  if (page === 'nuvia-assistant')
    return (
      <ExtraPreviewPage
        page={page}
        language={language}
        setLanguage={setLanguage}
        preview={preview}
        workspace={auth.workspace}
        onLogout={auth.logout}
      />
    );
  if (page === 'dashboard' || page === 'dashboard-empty' || page === 'overview')
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
