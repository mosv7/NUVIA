import { LanguageMenu } from '../../components/ui/ChoiceMenu.jsx';
import React, { useEffect, useRef, useState } from 'react';
import { landingCopy } from './copy.js';
import { en, ar } from '../../lib/i18n/auth-copy.js';
import { asset } from '../../lib/assets.js';
import Field from '../../components/ui/Field.jsx';
import DashboardPreviewEn from './components/DashboardPreviewEn.jsx';
import DashboardPreviewAr from './components/DashboardPreviewAr.jsx';
import '../../styles/landing.css';
import '../../styles/dashboard.css';
export default function LandingPage({ language, setLanguage }) {
  const c = landingCopy[language],
    t = language === 'ar' ? ar : en,
    prefix = language === 'ar' ? 'land-ar' : 'land-en',
    icon = (name) => asset(`${prefix}-${name}.svg`);
  const [values, setValues] = useState({ name: '', email: '', company: '' }),
    [errors, setErrors] = useState({}),
    [sent, setSent] = useState(false),
    [busy, setBusy] = useState(false),
    [selected, setSelected] = useState(null),
    [toast, setToast] = useState('');
  const pageRef = useRef(null),
    dialogRef = useRef(null),
    previewRef = useRef(null);
  useEffect(() => {
    if (!window.IntersectionObserver) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: window.matchMedia('(max-width:700px)').matches ? 0.18 : 0.08 },
    );
    pageRef.current.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [language]);
  useEffect(() => {
    if (selected !== null) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [selected]);
  useEffect(() => {
    if (!window.ResizeObserver) return;
    const observer = new ResizeObserver(([entry]) =>
      previewRef.current.style.setProperty('--dashboard-scale', entry.contentRect.width / 393.907),
    );
    observer.observe(previewRef.current);
    return () => observer.disconnect();
  }, [language]);
  const scroll = (id) =>
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  const change = (e) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
    setErrors((v) => ({ ...v, [e.target.name]: undefined }));
    setSent(false);
  };
  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    const next = {};
    if (!values.name.trim()) next.name = t.required;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = t.invalidEmail;
    if (!values.company.trim()) next.company = t.required;
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 350));
    setBusy(false);
    setSent(true);
  };
  const reserved = () => setToast(c.reserved);
  const brand = () => (
    <div className="brand">
      <span>
        <img src={icon('imgGroup')} alt="" />
      </span>
      <strong>NUVIA</strong>
    </div>
  );
  return (
    <div className="landing" ref={pageRef}>
      <div className="landing-top">
        <header className="landing-nav">
          {brand()}
          <nav aria-label={language === 'ar' ? 'التنقل الرئيسي' : 'Main navigation'}>
            <button onClick={() => scroll('platform')}>{c.platform}</button>
            <button onClick={() => scroll('how-it-works')}>{c.how}</button>
            <button onClick={() => scroll('language-intelligence')}>{c.languages}</button>
          </nav>
          <a className="landing-signin" href="#/login">
            {c.signIn}
          </a>
        </header>
        <section className="landing-hero landing-wrap">
          <div className="hero-copy">
            <p className="section-label hero-label">
              <img src={icon('imgIcon10')} alt="" />
              {c.heroLabel}
            </p>
            <h1>
              {c.heroStart}
              <span>{c.heroAccent}</span>
              {c.heroEnd}
            </h1>
            <p className="hero-description">{c.heroBody}</p>
            <button className="primary hero-explore" onClick={() => scroll('platform')}>
              {c.explore}
              <img src={icon('imgIcon11')} alt="" />
            </button>
          </div>
          <div className="hero-dashboard" ref={previewRef} role="img" aria-label={c.previewLabel}>
            {language === 'ar' ? <DashboardPreviewAr /> : <DashboardPreviewEn />}
          </div>
        </section>
      </div>
      <section id="platform" className="landing-features landing-wrap">
        <div className="section-heading reveal">
          <p className="section-label">{c.featuresLabel}</p>
          <h2>{c.featuresTitle}</h2>
          <p>{c.featuresBody}</p>
        </div>
        <div className="feature-grid">
          {c.features.map(([title, body, img], i) => (
            <article className="feature-card reveal" key={title}>
              <span className="feature-icon">
                <img src={icon(img)} alt="" />
              </span>
              <h3>{title}</h3>
              <p>{body}</p>
              <button onClick={() => setSelected(i)}>
                {c.learn}
                <img src={icon('imgIcon2')} alt="" />
              </button>
            </article>
          ))}
        </div>
      </section>
      <section id="how-it-works" className="landing-process">
        <div className="landing-wrap">
          <div className="section-heading reveal">
            <p className="section-label">{c.stepsLabel}</p>
            <h2>{c.stepsTitle}</h2>
          </div>
          <div className="step-grid">
            {c.steps.map(([title, body], i) => (
              <article key={title} className="step-card reveal">
                <span className="step-number">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
                {i < 2 && (
                  <span className="step-arrow" aria-hidden="true">
                    →
                  </span>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="language-intelligence" className="landing-language landing-wrap">
        <div className="language-examples reveal">
          <div className="language-ring" />
          <article className="language-comment english-comment" dir="ltr">
            <span>A</span>
            <p>“The food was excellent but service took too long.”</p>
            <div>
              <small>{c.food}</small>
              <small className="negative">{c.speed}</small>
            </div>
          </article>
          <article className="language-comment arabic-comment" dir="rtl">
            <span>م</span>
            <p>“الأكل ممتاز بس الخدمة كانت بطيئة شوية”</p>
            <div>
              <small>الأكل · إيجابي</small>
              <small className="negative">السرعة · سلبي</small>
            </div>
          </article>
        </div>
        <div className="language-copy reveal">
          <p className="section-label">
            <img src={icon('imgIcon8')} alt="" />
            {c.languageLabel}
          </p>
          <h2>{c.languageTitle}</h2>
          <p>{c.languageBody}</p>
          <ul>
            {c.checks.map((check) => (
              <li key={check}>
                <img src={icon('imgIcon9')} alt="" />
                {check}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section id="book-demo" className="landing-demo">
        <div className="landing-wrap demo-layout">
          <div className="demo-copy reveal">
            <p className="section-label">{c.demoLabel}</p>
            <h2>{c.demoTitle}</h2>
            <p>{c.demoBody}</p>
          </div>
          <form className="demo-form reveal" onSubmit={submit} noValidate>
            <Field
              name="name"
              label={c.name}
              placeholder={c.namePlaceholder}
              value={values.name}
              onChange={change}
              error={errors.name}
            />
            <Field
              name="email"
              label={c.email}
              placeholder="you@company.com"
              type="email"
              value={values.email}
              onChange={change}
              error={errors.email}
            />
            <Field
              name="company"
              label={c.company}
              placeholder={c.companyPlaceholder}
              value={values.company}
              onChange={change}
              error={errors.company}
            />
            <button type="submit" className="primary" disabled={busy}>
              {busy ? t.loading : c.book}
            </button>
            {sent && (
              <p className="notice" role="status">
                {c.demoNotice}
              </p>
            )}
          </form>
        </div>
      </section>
      <footer className="landing-footer">
        <div className="landing-wrap footer-main">
          <div className="footer-description">
            {brand()}
            <p>{c.heroBody}</p>
          </div>
          <div className="footer-column">
            <h3>{c.product}</h3>
            <button onClick={() => scroll('platform')}>{c.overview}</button>
            <button onClick={reserved}>{c.pricing}</button>
            <button onClick={reserved}>{c.stories}</button>
          </div>
          <div className="footer-column">
            <h3>{c.resources}</h3>
            <button onClick={reserved}>{c.help}</button>
          </div>
          <div className="footer-column">
            <h3>{c.companyTitle}</h3>
            <button onClick={reserved}>{c.about}</button>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="landing-wrap">
            <label className="language">
              <img src={icon('imgIcon8')} alt="" />
              <LanguageMenu value={language} onChange={setLanguage} />
            </label>
            <button onClick={reserved}>{c.terms}</button>
            <button onClick={reserved}>{c.security}</button>
            <button onClick={reserved}>{c.status}</button>
            <span>©2026 NUVIA</span>
            <div className="social-links">
              {[
                ['imgX301Facebook', 'Facebook'],
                ['imgGroup2', 'X'],
                ['imgLinkedin', 'LinkedIn'],
              ].map(([img, label]) => (
                <button key={label} aria-label={label} onClick={reserved}>
                  <img src={icon(img)} alt="" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
      {toast && (
        <div className="landing-toast" role="status">
          {toast}
          <button onClick={() => setToast('')} aria-label={c.close}>
            ×
          </button>
        </div>
      )}
      <dialog
        ref={dialogRef}
        className="feature-dialog"
        onCancel={() => setSelected(null)}
        onClose={() => setSelected(null)}
      >
        {selected !== null && (
          <>
            <button className="dialog-close" onClick={() => setSelected(null)} aria-label={c.close}>
              ×
            </button>
            <span className="feature-icon">
              <img src={icon(c.features[selected][2])} alt="" />
            </span>
            <h2>{c.features[selected][0]}</h2>
            <p>{c.features[selected][1]}</p>
            <button
              className="primary"
              onClick={() => {
                setSelected(null);
                scroll('book-demo');
              }}
            >
              {c.book}
            </button>
          </>
        )}
      </dialog>
    </div>
  );
}
