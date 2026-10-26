import { LanguageMenu } from '../../components/ui/ChoiceMenu.jsx';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../app/providers/AuthProvider.jsx';
import { asset } from '../../lib/assets.js';
import { setupCopy } from './setup-copy.js';
import SetupSidebar from './components/SetupSidebar.jsx';
import LanguageIcon from '../../components/ui/LanguageIcon.jsx';
import BusinessInformationPage from './BusinessInformationPage.jsx';
import SetupPage from './SetupPage.jsx';
import GetStartedPage from './GetStartedPage.jsx';
import '../../styles/setup.css';
export function ConnectedBusinessOnboarding(props) {
  const { workspace } = useAuth();
  const [values, setValues] = useState(() =>
    workspace
      ? {
          businessName: workspace.businessName,
          industry: workspace.industry,
          branchType: workspace.branchType,
          branchName:
            workspace.branches.find((branch) => branch.id === workspace.primaryBranchId)?.name ||
            '',
        }
      : { businessName: '', industry: '', branchType: 'multiple', branchName: '' },
  );
  return <BusinessOnboarding {...props} values={values} setValues={setValues} />;
}
export default function BusinessOnboarding({ page, language, setLanguage, values, setValues }) {
  const auth = useAuth();
  const [busy, setBusy] = useState(false),
    [saveError, setSaveError] = useState(false);
  const controller = useRef(null);
  useEffect(() => () => controller.current?.abort(), [page]);
  const c = setupCopy[language],
    step = page === 'business-setup' ? 1 : page === 'get-started' ? 2 : 0;
  const [errors, setErrors] = useState(() =>
      page === 'business-error' ? { businessName: true, industry: true } : {},
    ),
    [branchError, setBranchError] = useState(false),
    [notice, setNotice] = useState('');
  useEffect(() => {
    setBusy(false);
    setSaveError(false);
    setErrors(page === 'business-error' ? { businessName: true, industry: true } : {});
    setBranchError(false);
    setNotice('');
  }, [page]);
  const folder =
      step === 0
        ? Object.values(errors).some(Boolean)
          ? 'information-error'
          : 'information'
        : step === 1
          ? 'branches'
          : 'get-started',
    icon = (name) => asset(`business-setup/${folder}/${name}.svg`);
  const change = (e) => {
    const { name, value } = e.target;
    setValues((old) => ({ ...old, [name]: value }));
    setErrors((old) => ({ ...old, [name]: false }));
    if (name === 'branchName' || name === 'branchType') setBranchError(false);
  };
  const go = (route) => {
    location.hash = '/' + route;
  };
  const save = async (operation, payload, destination) => {
    if (busy) return;
    setBusy(true);
    setSaveError(false);
    const request = new AbortController();
    controller.current = request;
    try {
      const result = await operation(payload, request.signal);
      if (result && !request.signal.aborted) go(destination);
    } catch (error) {
      if (error.name !== 'AbortError' && !request.signal.aborted) setSaveError(true);
    } finally {
      if (!request.signal.aborted) setBusy(false);
    }
  };
  const infoNext = async (e) => {
    e.preventDefault();
    const invalid = {
      businessName: !values.businessName.trim(),
      industry: !values.industry.trim(),
    };
    setErrors(invalid);
    if (!Object.values(invalid).some(Boolean)) {
      if (auth.preview) go('business-setup');
      else
        await save(
          auth.saveWorkspace,
          {
            businessName: values.businessName,
            industry: values.industry,
            locale: language,
            reportingTimezone: 'Africa/Cairo',
          },
          'business-setup',
        );
    }
  };
  const branchNext = async (e) => {
    e.preventDefault();
    if (!values.businessName.trim() || !values.industry.trim()) {
      go('business-error');
      return;
    }
    if (values.branchType === 'multiple' && !values.branchName.trim()) {
      setBranchError(true);
      return;
    }
    if (auth.preview) go('get-started');
    else
      await save(
        auth.completeSetup,
        {
          branchType: values.branchType,
          ...(values.branchType === 'multiple' ? { branchName: values.branchName } : {}),
        },
        'get-started',
      );
  };
  return (
    <div className="business-onboarding" data-step={step}>
      <header className="setup-header">
        <a
          className="setup-mobile-back back"
          href="#/landing"
          aria-label={language === 'ar' ? 'العودة إلى الموقع' : 'Back to website'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="m14 6-6 6 6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        <a className="brand" href="#/landing">
          <span>
            <img src={icon('header-nuvia-logo')} alt="" />
          </span>
          <strong>NUVIA</strong>
        </a>
        <button className="setup-help" onClick={() => setNotice(c.helpNotice)}>
          <img src={icon('header-help-icon')} alt="" />
          {c.help}
        </button>
      </header>
      <main className="setup-main">
        <ol
          className="setup-progress"
          aria-label={language === 'ar' ? 'خطوات الإعداد' : 'Setup progress'}
        >
          {c.steps.map((name, i) => (
            <li
              key={name}
              className={i <= step ? 'active' : ''}
              aria-current={i === step ? 'step' : undefined}
            >
              <span className="progress-marker">
                {i < step ? (
                  <img src={icon('progress-completed-check')} alt="" />
                ) : language === 'ar' ? (
                  (i + 1).toLocaleString('ar', { numberingSystem: 'arab' })
                ) : (
                  i + 1
                )}
              </span>
              <span>{name}</span>
            </li>
          ))}
        </ol>
        <div className="setup-card">
          <SetupSidebar copy={c} step={step} folder={folder} />
          {step === 0 ? (
            <BusinessInformationPage
              copy={c}
              values={values}
              onChange={change}
              errors={errors}
              onContinue={infoNext}
              folder={folder}
              busy={busy}
            />
          ) : step === 1 ? (
            <SetupPage
              copy={c}
              values={values}
              onChange={change}
              error={branchError}
              onContinue={branchNext}
              onBack={() => go('business-information')}
              busy={busy}
            />
          ) : (
            <GetStartedPage
              copy={c}
              values={values}
              onEdit={() => go('business-information')}
              onStart={
                auth.preview ? undefined : () => save(auth.finishOnboarding, {}, 'dashboard')
              }
              busy={busy}
            />
          )}
        </div>
        {saveError && (
          <p className="notice error-notice" role="alert">
            {language === 'ar'
              ? 'تعذر حفظ بياناتك. تحقق من الاتصال وحاول مرة أخرى.'
              : 'Could not save your details. Check your connection and try again.'}
          </p>
        )}
        {notice && (
          <p className="notice setup-notice" role="status">
            {notice}
            <button
              onClick={() => setNotice('')}
              aria-label={language === 'ar' ? 'إغلاق' : 'Close'}
            >
              ×
            </button>
          </p>
        )}
      </main>
      <footer className="setup-footer">
        <span>© 2026 Nuvia</span>
        <div>
          <label className="language">
            <LanguageIcon />
            <LanguageMenu value={language} onChange={setLanguage} />
          </label>
          <button className="setup-mobile-help" onClick={() => setNotice(c.helpNotice)}>
            {c.help}
          </button>
          <button onClick={() => setNotice(c.reserved)}>{c.privacy}</button>
          <button onClick={() => setNotice(c.reserved)}>{c.terms}</button>
        </div>
      </footer>
    </div>
  );
}
