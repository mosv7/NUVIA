import ChoiceMenu from '../ui/ChoiceMenu.jsx';
import LanguageIcon from '../ui/LanguageIcon.jsx';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { asset } from '../../lib/assets.js';
import { useProductView } from '../../app/providers/ProductProvider.jsx';
import './header-menus.css';
function MenuIcon({ name }) {
  return (
    <span className="workspace-menu-icon" aria-hidden="true">
      {name === 'store' || name === 'plus' || name === 'settings' ? (
        <span
          className="workspace-menu-asset"
          style={{
            maskImage: `url("${asset('dashboard/overview/' + name + '.svg')}")`,
            WebkitMaskImage: `url("${asset('dashboard/overview/' + name + '.svg')}")`,
          }}
        />
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {name === 'profile' ? (
            <>
              <circle cx="12" cy="8" r="4" />
              <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
            </>
          ) : (
            <>
              <path d="M10 4H5v16h5M13 8l4 4-4 4M9 12h12" />
            </>
          )}
        </svg>
      )}
    </span>
  );
}
export default function HeaderMenus() {
  const { tr, language, setLanguage, isMobile, topbarMenu, setTopbarMenu } = useProductView(),
    ref = useRef(null),
    [profile, setProfile] = useState(false),
    [position, setPosition] = useState({});
  const close = useCallback(() => setTopbarMenu(null), [setTopbarMenu]);
  useEffect(() => {
    if (!topbarMenu) return;
    const place = () => {
      const rect = topbarMenu.anchor.getBoundingClientRect(),
        width = Math.min(320, innerWidth - 24);
      setPosition({
        width,
        left: Math.max(12, Math.min(rect.right - width, innerWidth - width - 12)),
        top: Math.min(rect.bottom + 10, innerHeight - 300),
      });
    };
    place();
    const outside = (e) => {
      if (
        !ref.current?.contains(e.target) &&
        !topbarMenu.anchor.contains(e.target) &&
        !e.target.closest?.('.choice-popup')
      )
        close();
    };
    const key = (e) => {
      if (e.key === 'Escape') {
        close();
        topbarMenu.anchor.focus();
      }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', key);
    addEventListener('resize', close);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', key);
      removeEventListener('resize', close);
    };
  }, [topbarMenu, close]);
  const navigate = (path) => {
    close();
    location.hash = '/' + path;
  };
  return createPortal(
    <>
      {topbarMenu && (
        <section
          id={'workspace-' + topbarMenu.kind}
          ref={ref}
          className="workspace-popover"
          style={position}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
          aria-label={tr(
            topbarMenu.kind === 'notifications'
              ? 'Notifications'
              : topbarMenu.kind === 'business'
                ? 'Business'
                : 'Account',
          )}
        >
          {topbarMenu.kind === 'notifications' ? (
            <>
              <header>
                <strong>{tr('Notifications')}</strong>
                <button aria-label={tr('Close')} onClick={close}>
                  ×
                </button>
              </header>
              <div className="workspace-notification-empty">
                <img src={asset('dashboard/overview/notifications.svg')} alt="" />
                <h3>{tr('You’re all caught up')}</h3>
                <p>{tr('No notifications yet. Updates about your workspace will appear here.')}</p>
              </div>
            </>
          ) : topbarMenu.kind === 'profile' ? (
            <>
              <header>
                <span className="workspace-avatar workspace-account-avatar">
                  <img src={asset('dashboard/overview/account-avatar.svg')} alt="" />
                </span>
                <div>
                  <strong>{tr('Sara Ahmed')}</strong>
                  <small>{tr('Workspace owner')}</small>
                </div>
              </header>
              <button
                className="workspace-menu-item"
                onClick={() => {
                  close();
                  setProfile(true);
                }}
              >
                <MenuIcon name="profile" />
                {tr('View profile')}
              </button>
              <button
                className="workspace-menu-item"
                onClick={() => {
                  close();
                  setProfile('security');
                }}
              >
                <MenuIcon name="settings" />
                {tr('Account & security')}
              </button>
              {isMobile && (
                <div className="workspace-menu-item workspace-mobile-language">
                  <span>{language === 'ar' ? 'اللغة' : 'Language'}</span>
                  <div className="workspace-language-choice">
                    <LanguageIcon />
                    <ChoiceMenu
                      value={language}
                      onChange={setLanguage}
                      compact
                      density="compact"
                      label={language === 'ar' ? 'اختيار اللغة' : 'Choose language'}
                      options={[
                        { value: 'en', label: 'English', code: 'EN', description: 'English' },
                        { value: 'ar', label: 'العربية', code: 'AR', description: 'العربية' },
                      ]}
                    />
                  </div>
                </div>
              )}
              <button
                className="workspace-menu-item workspace-signout"
                onClick={() => navigate('login')}
              >
                <MenuIcon name="signout" />
                {tr('Sign out')}
              </button>
            </>
          ) : (
            <>
              <header>
                <strong>{tr('Your businesses')}</strong>
              </header>
              <button className="workspace-menu-item" onClick={close}>
                <span className="workspace-avatar">B</span>
                <span>
                  Bloom &amp; Co.<small>{tr('Current business')}</small>
                </span>
                <span className="workspace-current">✓</span>
              </button>
              <button
                className="workspace-menu-item"
                onClick={() => navigate('business-information')}
              >
                <MenuIcon name="store" />
                {tr('Manage business')}
              </button>
              <button
                className="workspace-menu-item"
                onClick={() => navigate('business-information')}
              >
                <MenuIcon name="plus" />
                {tr('Add business')}
              </button>
            </>
          )}
        </section>
      )}
      {profile && (
        <div className="workspace-modal-backdrop" onClick={() => setProfile(false)}>
          <section
            className="workspace-profile-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={tr(profile === 'security' ? 'Account & security' : 'Profile')}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setProfile(false);
            }}
          >
            <span className="workspace-avatar workspace-account-avatar">
              <img src={asset('dashboard/overview/account-avatar.svg')} alt="" />
            </span>
            <h2>{tr(profile === 'security' ? 'Account & security' : 'Sara Ahmed')}</h2>
            {profile === 'security' && <strong>{tr('Sara Ahmed')}</strong>}
            <p>{tr('Workspace owner')} · Bloom &amp; Co.</p>
            <small>{tr('Sample workspace profile')}</small>
            {profile === 'security' && (
              <div className="workspace-security-actions">
                <button onClick={() => setProfile(true)}>{tr('View profile')}</button>
                <button
                  onClick={() => {
                    setProfile(false);
                    navigate('forgot');
                  }}
                >
                  {tr('Reset password')}
                </button>
              </div>
            )}
            <button autoFocus onClick={() => setProfile(false)}>
              {tr('Done')}
            </button>
          </section>
        </div>
      )}
    </>,
    document.body,
  );
}
