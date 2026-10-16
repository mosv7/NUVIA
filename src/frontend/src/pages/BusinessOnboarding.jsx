import React, { useEffect, useState } from 'react';
import { asset } from '../assets.js';
import { setupCopy } from '../setup-copy.js';
import SetupSidebar from '../components/SetupSidebar.jsx';
import BusinessInformationPage from './BusinessInformationPage.jsx';
import SetupPage from './SetupPage.jsx';
import GetStartedPage from './GetStartedPage.jsx';
import '../styles/setup.css';
export default function BusinessOnboarding({ page, language, setLanguage, values, setValues }) {
  const c = setupCopy[language],
    step = page === 'business-setup' ? 1 : page === 'get-started' ? 2 : 0;
  const [errors, setErrors] = useState(() =>
      page === 'business-error' ? { businessName: true, industry: true } : {},
    ),
    [branchError, setBranchError] = useState(false),
    [notice, setNotice] = useState('');
  useEffect(() => {
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
  const infoNext = (e) => {
    e.preventDefault();
    const invalid = {
      businessName: !values.businessName.trim(),
      industry: !values.industry.trim(),
    };
    setErrors(invalid);
    if (!Object.values(invalid).some(Boolean)) go('business-setup');
  };
  const branchNext = (e) => {
    e.preventDefault();
    if (!values.businessName.trim() || !values.industry.trim()) {
      go('business-error');
      return;
    }
    if (values.branchType === 'multiple' && !values.branchName.trim()) {
      setBranchError(true);
      return;
    }
    go('get-started');
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
                {i < step ? <img src={icon('progress-completed-check')} alt="" /> : i + 1}
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
            />
          ) : step === 1 ? (
            <SetupPage
              copy={c}
              values={values}
              onChange={change}
              error={branchError}
              onContinue={branchNext}
              onBack={() => go('business-information')}
            />
          ) : (
            <GetStartedPage copy={c} values={values} onEdit={() => go('business-information')} />
          )}
        </div>
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
            <img src={asset('login-imgGlobe')} alt="" />
            <select
              aria-label="Language / اللغة"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </label>
          <button onClick={() => setNotice(c.reserved)}>{c.privacy}</button>
          <button onClick={() => setNotice(c.reserved)}>{c.terms}</button>
        </div>
      </footer>
    </div>
  );
}
