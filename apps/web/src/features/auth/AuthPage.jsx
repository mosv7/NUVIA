import React from 'react';
import { LanguageMenu } from '../../components/ui/ChoiceMenu.jsx';
import LanguageIcon from '../../components/ui/LanguageIcon.jsx';
export default function AuthPage({
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
}) {
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
        </div>
        <footer>
          <span>© 2026 NUVIA</span>
          <div>
            <button onClick={() => setNotice('unavailable')}>{t.privacy}</button>
            <button onClick={() => setNotice('unavailable')}>{t.help}</button>
            <label className="language">
              <LanguageIcon />
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
          <LanguageIcon />
          {t.languages}
        </div>
      </aside>
    </main>
  );
}
