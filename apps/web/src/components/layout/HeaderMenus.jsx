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
  const {
      tr,
      language,
      setLanguage,
      isMobile,
      topbarMenu,
      setTopbarMenu,
      preview,
      logout,
      identity,
      workspace,
      action,
    } = useProductView(),
    ref = useRef(null),
    profileDialog = useRef(null),
    profileTrigger = useRef(null),
    [profile, setProfile] = useState(false),
    [signingOut, setSigningOut] = useState(false),
    [position, setPosition] = useState({});
  const close = useCallback(() => setTopbarMenu(null), [setTopbarMenu]);
  const profileOpen = Boolean(profile);
  useEffect(() => {
    if (!profileOpen) return;
    const dialog = profileDialog.current;
    const backdrop = dialog.parentElement;
    const background = Array.from(document.body.children)
      .filter((element) => element !== backdrop)
      .map((element) => [element, element.getAttribute('inert')]);
    background.forEach(([element]) => element.setAttribute('inert', ''));
    const buttons = () => Array.from(dialog.querySelectorAll('button:not(:disabled)'));
    const containFocus = (event) => {
      if (!dialog.contains(event.target)) buttons()[0]?.focus();
    };
    const key = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setProfile(false);
      } else if (event.key === 'Tab') {
        const controls = buttons();
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('focusin', containFocus);
    dialog.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('focusin', containFocus);
      dialog.removeEventListener('keydown', key);
      background.forEach(([element, inert]) => {
        if (inert === null) element.removeAttribute('inert');
        else element.setAttribute('inert', inert);
      });
      if (profileTrigger.current?.isConnected) profileTrigger.current.focus();
    };
  }, [profileOpen]);
  const openProfile = (kind) => {
    profileTrigger.current = topbarMenu.anchor;
    close();
    setProfile(kind);
  };
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
              <button className="workspace-menu-item" onClick={() => openProfile(true)}>
                <MenuIcon name="profile" />
                {tr('View profile')}
              </button>
              <button className="workspace-menu-item" onClick={() => openProfile('security')}>
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
                disabled={signingOut}
                onClick={async () => {
                  if (preview) {
                    navigate('login');
                    return;
                  }
                  setSigningOut(true);
                  const succeeded = await logout();
                  setSigningOut(false);
                  if (succeeded) close();
                }}
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
                <span className="workspace-avatar">
                  {preview ? 'B' : Array.from(workspace?.businessName || '')[0]}
                </span>
                <span>
                  {preview ? 'Bloom & Co.' : workspace?.businessName}
                  <small>{tr('Current business')}</small>
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
                onClick={() => {
                  if (preview) navigate('business-information');
                  else {
                    close();
                    action('Add business');
                  }
                }}
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
            ref={profileDialog}
            className="workspace-profile-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={tr(profile === 'security' ? 'Account & security' : 'Profile')}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="workspace-avatar workspace-account-avatar">
              <img src={asset('dashboard/overview/account-avatar.svg')} alt="" />
            </span>
            <h2>{tr(profile === 'security' ? 'Account & security' : 'Sara Ahmed')}</h2>
            {profile === 'security' && <strong>{tr('Sara Ahmed')}</strong>}
            <p>
              {tr('Workspace owner')} · {preview ? 'Bloom & Co.' : workspace?.businessName}
            </p>
            {preview ? (
              <small>{tr('Sample workspace profile')}</small>
            ) : (
              <small>{identity?.email}</small>
            )}
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
