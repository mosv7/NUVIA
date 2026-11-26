import { useAuth } from '../../app/providers/AuthProvider.jsx';
import { workspaceApi } from '../workspaces/api.js';
import { settingsApi } from '../settings/api.js';
import { useState, useEffect, useRef } from 'react';

import UiArrow from '../../components/ui/UiArrow.jsx';
import { I, PreviewSelect } from './WorkspacePrimitives.jsx';
import { words, tabs, initialBranches, currentPreviewRoute } from './workspace-data.js';

export default function useWorkspaceModel({ language, setLanguage }) {
  const auth = useAuth();
  const preview = auth?.preview === true;
  const savedWorkspace = auth?.workspace;
  const activeRequest = useRef(null);
  const requestGeneration = useRef(0);
  const [saving, setSaving] = useState(false);
  const branchView = (b) => ({
    ...b,
    archived: !!b.archivedAt,
    responses: b.responseCount || 0,
    country: b.country || '',
    city: b.city || '',
    address: b.address || '',
  });

  const [page, setPage] = useState(currentPreviewRoute),
    [, setMobile] = useState(false),
    [, setMenu] = useState(false),
    [sample, setSample] = useState(
      () =>
        preview &&
        !location.hash.startsWith('#/dashboard-empty') &&
        new URLSearchParams(location.search).get('state') !== 'empty',
    ),
    [modal, setModal] = useState(null),
    [toast, setToast] = useState(''),
    [row, setRow] = useState(null),
    [query, setQuery] = useState(''),
    [archive, setArchive] = useState(false);
  const [historyStart, setHistoryStart] = useState('2026-09-12'),
    [historyEnd, setHistoryEnd] = useState('2026-10-09'),
    [historySurvey, setHistorySurvey] = useState('Customer experience survey'),
    [historyDateOpen, setHistoryDateOpen] = useState(false),
    [branchHistory, setBranchHistory] = useState(null),
    [branchHistoryLoading, setBranchHistoryLoading] = useState(false),
    [branchHistoryError, setBranchHistoryError] = useState('');
  const [otherBusinesses, setOtherBusinesses] = useState([]);
  const [biz, setBiz] = useState(
      preview
        ? { name: 'Bloom & Co.', industry: 'Food & beverage' }
        : { name: savedWorkspace?.businessName || '', industry: savedWorkspace?.industry || '' },
    ),
    [branches, setBranches] = useState(() =>
      preview
        ? new URLSearchParams(location.search).get('state') !== 'empty'
          ? initialBranches
          : []
        : (savedWorkspace?.branches || []).map(branchView),
    ),
    [account, setAccount] = useState({
      name: preview ? 'Sara Ahmed' : auth?.user?.name || '',
      email: preview ? 'sara@example.test' : auth?.user?.email || '',
      title: preview ? 'Founder & workspace owner' : 'Workspace owner',
      phone: preview ? '+20 100 123 4567' : '',
      country: preview ? 'Egypt' : '',
      photo: '/assets/dashboard/overview/account-avatar.svg',
    }),
    [draft, setDraft] = useState({}),
    [error, setError] = useState({}),
    [pending, setPending] = useState('');
  const [preferences, setPreferences] = useState({
      language: 'en',
      region: 'Egypt',
      zone: 'Africa/Cairo',
      date: 'DD/MM/YYYY',
      time: '12-Hour',
    }),
    [prefDraft, setPrefDraft] = useState(preferences),
    [toggles, setToggles] = useState({
      email: true,
      inapp: true,
      feedback: true,
      low: true,
      weekly: true,
      news: false,
      security: true,
      reports: true,
      sound: false,
      popup: true,
    }),
    [switchDraft, setSwitchDraft] = useState(toggles),
    [delivery, setDelivery] = useState('Daily digest'),
    [notificationTab, setNotificationTab] = useState('All'),
    [read, setRead] = useState([]),
    [sessions, setSessions] = useState(preview ? [1, 2, 3] : []),
    [code, setCode] = useState(''),
    [twoFA, setTwoFA] = useState(false),
    [twoFactorSetup, setTwoFactorSetup] = useState(null),
    [recoveryCodes, setRecoveryCodes] = useState([]);
  const lang = language,
    setLang = setLanguage;
  const ar = lang === 'ar',
    t = (s) => (ar ? words[s] || s : s),
    L = (en, arabic) => (ar ? arabic : en),
    go = (dest) => {
      location.hash = '/' + dest;
      setMobile(false);
      setMenu(false);
      setRow(null);
    },
    notify = (s) => setToast(t(s));
  useEffect(() => {
    const onHash = () => {
      const next = currentPreviewRoute();
      setPage(next);
      if (next === 'business-add') setDraft({ name: '', industry: '' });
      setQuery('');
      setError({});
      window.scrollTo(0, 0);
    };
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = ar ? 'rtl' : 'ltr';
  }, [lang, ar]);
  useEffect(() => {
    if (preview || !page.startsWith('settings')) return;
    const controller = new AbortController();
    const signal = controller.signal;
    const load = async () => {
      try {
        if (['settings', 'settings-personal', 'settings-profile'].includes(page)) {
          const data = await settingsApi.account(signal);
          if (signal.aborted) return;
          setAccount((current) => ({
            ...current,
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            country:
              { EG: 'Egypt', GB: 'United Kingdom', SA: 'Saudi Arabia', AE: 'United Arab Emirates' }[
                data.country
              ] ||
              data.country ||
              '',
            title: data.jobTitle || '',
            photo: data.avatarUrl || current.photo,
          }));
          if (page === 'settings-profile')
            setDraft({
              name: data.name || '',
              phone: data.phone || '',
              country:
                {
                  EG: 'Egypt',
                  GB: 'United Kingdom',
                  SA: 'Saudi Arabia',
                  AE: 'United Arab Emirates',
                }[data.country] ||
                data.country ||
                '',
              title: data.jobTitle || '',
              photo: data.avatarUrl || '',
            });
        }
        if (page === 'settings-language') {
          const data = await settingsApi.language(signal);
          if (signal.aborted) return;
          const next = {
            language: (data.displayLanguage || 'en-GB').startsWith('ar') ? 'ar' : 'en',
            region:
              data.region === 'EG'
                ? 'Egypt'
                : data.region === 'GB'
                  ? 'United Kingdom'
                  : data.region === 'SA'
                    ? 'Saudi Arabia'
                    : data.region === 'AE'
                      ? 'United Arab Emirates'
                      : 'Egypt',
            zone: data.timeZone || 'Africa/Cairo',
            date: data.dateFormat || 'DD/MM/YYYY',
            time: data.timeFormat === '24h' ? '24-Hour' : '12-Hour',
          };
          setPreferences(next);
          setPrefDraft(next);
        }
        if (page.startsWith('settings-notifications')) {
          const data = await settingsApi.notifications(signal);
          if (signal.aborted) return;
          const next = {
            email: !!data.channels?.email,
            inapp: !!data.channels?.inApp,
            emailFeedback: !!data.email?.newFeedback,
            emailLow: !!data.email?.lowRating,
            inappFeedback: !!data.inApp?.newFeedback,
            inappLow: !!data.inApp?.lowRating,
            weekly: !!data.email?.weeklyReport,
            news: !!data.email?.productNews,
            security: true,
            reports: !!data.inApp?.reportsReady,
            sound: !!data.inApp?.sound,
            popup: !!data.inApp?.popups,
          };
          setToggles(next);
          setSwitchDraft(next);
          setDelivery(
            { instant: 'Immediately', 'daily_09:00': 'Daily digest', weekly: 'Weekly digest' }[
              data.email?.feedbackDelivery
            ] || 'Daily digest',
          );
        }
        if (page === 'settings-email') {
          const data = await settingsApi.pendingEmailChange(signal);
          if (!signal.aborted) setPending(data?.pendingEmail || '');
        }
        if (['settings-security', 'settings-devices', 'settings-two-factor'].includes(page)) {
          const data = await settingsApi.security(signal);
          if (signal.aborted) return;
          setTwoFA(!!data.twoFactorEnabled);
          const rows = await settingsApi.sessions(signal);
          if (!signal.aborted) setSessions(Array.isArray(rows) ? rows : rows.sessions || []);
          if (page === 'settings-two-factor' && !data.twoFactorEnabled) {
            const setup = await settingsApi.setupTwoFactor(signal);
            if (!signal.aborted) setTwoFactorSetup(setup);
          }
        }
      } catch (error) {
        if (error.name !== 'AbortError')
          setToast(language === 'ar' ? 'تعذر تحميل الإعدادات.' : 'Could not load settings.');
      }
    };
    load();
    return () => controller.abort();
  }, [page, preview, language]);

  useEffect(() => {
    if (preview || page !== 'branch-history') return;
    const id = new URLSearchParams(location.hash.split('?')[1] || '').get('id') || draft.id;
    if (!id) return;
    const controller = new AbortController();
    setBranchHistory(null);
    setBranchHistoryError('');
    setBranchHistoryLoading(true);
    workspaceApi
      .history(id, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setBranchHistory(result);
      })
      .catch((error) => {
        if (error.name !== 'AbortError' && !controller.signal.aborted) {
          const message =
            language === 'ar' ? 'تعذر تحميل سجل الفرع.' : 'Could not load branch history.';
          setBranchHistoryError(message);
          setToast(message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setBranchHistoryLoading(false);
      });
    return () => controller.abort();
  }, [preview, page, draft.id, language, setToast]);

  useEffect(() => {
    if (preview || !['branch-edit', 'branch-history'].includes(page)) return;
    const id = new URLSearchParams(location.hash.split('?')[1] || '').get('id') || draft.id;
    const branch = branches.find((item) => String(item.id) === id);
    if (branch) setDraft((current) => (String(current.id) === id ? current : { ...branch }));
    else if (!id || branches.length) {
      if (page === 'branch-edit')
        setToast(
          language === 'ar'
            ? 'اختر فرعًا من القائمة لتعديله.'
            : 'Choose a branch from the list to edit.',
        );
      location.hash = '/branches';
    }
  }, [page, branches, language, preview, draft.id]);
  useEffect(() => {
    const shortcut = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setQuery('');
        setModal({ type: 'search' });
      }
    };
    addEventListener('keydown', shortcut);
    return () => removeEventListener('keydown', shortcut);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(''), 4500);
    return () => clearTimeout(id);
  }, [toast]);
  useEffect(() => {
    if (!modal) return;
    const before = document.activeElement;
    const onKey = (e) => {
      if (e.key === 'Escape') setModal(null);
      if (e.key === 'Tab') {
        const a = [...document.querySelectorAll('.modal button,.modal input')].filter(
          (x) => !x.disabled,
        );
        if (e.shiftKey && document.activeElement === a[0]) {
          e.preventDefault();
          a.at(-1)?.focus();
        } else if (!e.shiftKey && document.activeElement === a.at(-1)) {
          e.preventDefault();
          a[0]?.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    document.querySelector('.modal button')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      before?.focus();
    };
  }, [modal]);
  useEffect(() => {
    const counter = requestGeneration;
    const generation = ++counter.current;
    const controller = new AbortController();
    activeRequest.current?.abort();
    activeRequest.current = controller;
    setSaving(false);
    if (!preview && savedWorkspace?.id) {
      workspaceApi
        .branches(savedWorkspace.id, controller.signal)
        .then((rows) => {
          if (generation === counter.current && !controller.signal.aborted)
            setBranches((Array.isArray(rows) ? rows : rows.branches || []).map(branchView));
        })
        .catch((error) => {
          if (error.name !== 'AbortError' && generation === counter.current)
            setToast(
              language === 'ar'
                ? 'تعذر تحميل الفروع. حاول مرة أخرى.'
                : 'Could not load branches. Please try again.',
            );
        });
    }
    return () => {
      counter.current++;
      controller.abort();
      activeRequest.current?.abort();
    };
  }, [page, preview, savedWorkspace?.id, language]);
  async function persist(operation, destination) {
    if (saving) return;
    const generation = requestGeneration.current;
    const controller = new AbortController();
    activeRequest.current?.abort();
    activeRequest.current = controller;
    setSaving(true);
    try {
      await operation(controller.signal);
      if (generation !== requestGeneration.current || controller.signal.aborted) return;
      if (savedWorkspace?.id) {
        const rows = await workspaceApi.branches(savedWorkspace.id, controller.signal);
        if (generation !== requestGeneration.current || controller.signal.aborted) return;
        setBranches((Array.isArray(rows) ? rows : rows.branches || []).map(branchView));
      }
      go(destination);
    } catch (error) {
      if (error.name !== 'AbortError' && generation === requestGeneration.current)
        setToast(
          language === 'ar'
            ? 'تعذر حفظ التغييرات. حاول مرة أخرى.'
            : 'Could not save changes. Please try again.',
        );
    } finally {
      if (generation === requestGeneration.current) setSaving(false);
    }
  }
  const saveConnectedBusiness = () =>
    persist(async (signal) => {
      const result = await auth.saveWorkspace(
        {
          businessName: draft.name,
          industry: draft.industry,
          locale: savedWorkspace.locale,
          reportingTimezone: savedWorkspace.reportingTimezone,
        },
        signal,
      );
      if (result && !signal.aborted)
        setBiz({ name: result.businessName, industry: result.industry });
    }, 'business');
  const saveConnectedBranch = () =>
    persist(async (signal) => {
      if (!String(draft.name || '').trim()) {
        setError({ name: 'This field is required.' });
        return;
      }
      const body = {
        name: draft.name,
        country: draft.country,
        city: draft.city,
        address: draft.address,
      };
      if (page === 'branch-add') await workspaceApi.createBranch(savedWorkspace.id, body, signal);
      else await workspaceApi.updateBranch(savedWorkspace.id, draft.id, body, signal);
      if (!signal.aborted) await auth.refresh();
    }, 'branches');
  const archiveConnectedBranch = (branch) =>
    persist(async (signal) => {
      await workspaceApi.updateBranch(savedWorkspace.id, branch.id, { archived: true }, signal);
      if (!signal.aborted) {
        setModal(null);
        setArchive(true);
        await auth.refresh();
      }
    }, 'branches');
  const saveAccount = async () => {
    try {
      const countryCodes = {
        Egypt: 'EG',
        'United Kingdom': 'GB',
        'Saudi Arabia': 'SA',
        'United Arab Emirates': 'AE',
      };
      let data = await settingsApi.updateAccount({
        name: draft.name,
        phone: draft.phone,
        country: countryCodes[draft.country] || draft.country,
        jobTitle: draft.title,
      });
      if (draft.photoFile) data = await settingsApi.setAvatar(draft.photoFile);
      else if (
        draft.photo === '' &&
        account.photo &&
        account.photo !== '/assets/dashboard/overview/account-avatar.svg'
      )
        data = await settingsApi.removeAvatar();
      setAccount((current) => ({
        ...current,
        name: data.name,
        phone: data.phone || '',
        country:
          { EG: 'Egypt', GB: 'United Kingdom', SA: 'Saudi Arabia', AE: 'United Arab Emirates' }[
            data.country
          ] ||
          data.country ||
          '',
        title: data.jobTitle || '',
        email: data.email || current.email,
        photo:
          data.avatarUrl ||
          (draft.photo === '' ? '/assets/dashboard/overview/account-avatar.svg' : current.photo),
      }));
      setDraft({});
      notify('Changes saved');
      go('settings-personal');
    } catch (error) {
      setToast(
        error.message === 'NETWORK_ERROR'
          ? 'Network error. Please try again.'
          : 'Could not save account details.',
      );
    }
  };
  const saveEmailChange = async () => {
    try {
      const result = await settingsApi.requestEmailChange({
        newEmail: draft.email,
        currentPassword: draft.password,
      });
      setPending(result.pendingEmail || draft.email);
      setDraft({});
      notify('Verification email sent. Check your new inbox.');
    } catch (error) {
      setToast(
        error.status === 502
          ? 'Could not send the verification email.'
          : 'Could not request email change. Check your password and email.',
      );
    }
  };
  const cancelEmailChange = async () => {
    try {
      await settingsApi.cancelEmailChange();
      setPending('');
      notify('Email change cancelled');
    } catch {
      setToast('Could not cancel email change.');
    }
  };
  const savePassword = async () => {
    try {
      await settingsApi.changePassword({
        currentPassword: draft.current,
        newPassword: draft.password,
        confirmPassword: draft.confirm,
      });
      setDraft({});
      notify('Password updated successfully');
      go('settings-security');
      await auth.refresh();
    } catch (error) {
      setToast(
        error.status === 401
          ? 'Current password is incorrect.'
          : 'Could not update password. Check the password requirements.',
      );
    }
  };
  const languagePayload = (value) => ({
    displayLanguage: value.language === 'ar' ? 'ar-EG' : 'en-GB',
    region:
      { Egypt: 'EG', 'United Kingdom': 'GB', 'Saudi Arabia': 'SA', 'United Arab Emirates': 'AE' }[
        value.region
      ] || 'EG',
    timeZone: value.zone,
    dateFormat: value.date,
    timeFormat: value.time === '24-Hour' ? '24h' : '12h',
  });
  const saveLanguage = async () => {
    try {
      await settingsApi.updateLanguage(languagePayload(prefDraft));
      setPreferences({ ...prefDraft });
      setLang(prefDraft.language);
      notify('Changes saved');
    } catch {
      setToast('Could not save language preferences.');
    }
  };
  const notificationPayload = (value, pageName = page) => {
    if (pageName === 'settings-notifications')
      return { channels: { email: !!value.email, inApp: !!value.inapp } };
    if (pageName.endsWith('email'))
      return {
        email: {
          newFeedback: !!value.emailFeedback,
          lowRating: !!value.emailLow,
          weeklyReport: !!value.weekly,
          productNews: !!value.news,
          feedbackDelivery:
            { Immediately: 'instant', 'Daily digest': 'daily_09:00', 'Weekly digest': 'weekly' }[
              delivery
            ] || 'daily_09:00',
        },
      };
    return {
      inApp: {
        newFeedback: !!value.inappFeedback,
        lowRating: !!value.inappLow,
        reportsReady: !!value.reports,
        sound: !!value.sound,
        popups: !!value.popup,
      },
    };
  };
  const saveNotifications = async (pageName = page) => {
    try {
      await settingsApi.updateNotifications(notificationPayload(switchDraft, pageName));
      setToggles({ ...switchDraft });
      notify('Changes saved');
      if (pageName !== 'settings-notifications') go('settings-notifications');
    } catch {
      setToast('Could not save notification preferences.');
    }
  };
  const enableTwoFactor = async () => {
    try {
      const result = await settingsApi.enableTwoFactor({ code: code.trim() });
      setTwoFA(true);
      setRecoveryCodes(result.recoveryCodes || []);
      setTwoFactorSetup(null);
      setCode('');
      notify('Two-factor authentication enabled. Save your recovery codes.');
    } catch (error) {
      setToast(error.message || 'Could not verify the authenticator code.');
    }
  };
  const disableTwoFactor = async () => {
    try {
      await settingsApi.disableTwoFactor({ password: draft.password, code: code.trim() });
      setTwoFA(false);
      setCode('');
      setDraft({});
      notify('Two-factor authentication disabled.');
      go('settings-security');
    } catch (error) {
      setToast(error.message || 'Could not disable two-factor authentication.');
    }
  };
  const revokeSession = async (sessionId) => {
    try {
      await settingsApi.revokeSession(sessionId);
      setSessions((rows) => rows.filter((row) => String(row.id || row._id) !== String(sessionId)));
      notify('Session signed out.');
    } catch (error) {
      setToast(error.message || 'Could not sign out this session.');
    }
  };
  const signOutAllSessions = async () => {
    try {
      await settingsApi.signOutAll();
      await auth.refresh();
      location.hash = '/login';
    } catch (error) {
      setToast(error.message || 'Could not sign out all devices.');
    }
  };
  const businessPage = page.startsWith('business') || page.startsWith('branch'),
    settingsPage = page.startsWith('settings'),
    active = branches.filter((b) => !b.archived),
    old = branches.filter((b) => b.archived);
  const btn = (text, action, primary = false, icon) => (
    <button
      type="button"
      disabled={saving}
      className={'button' + (primary ? ' primary' : '')}
      onClick={action}
    >
      {icon && <I name={icon} size={18} />}
      <span>{t(text)}</span>
    </button>
  );
  const heading = (title, description, action, back) => {
    if (page.startsWith('settings') && page !== 'settings' && !back)
      back = ['Settings', 'settings'];
    return (
      <header className="page-heading">
        <div>
          <div className="title-line">
            {back && (
              <button
                className="icon-button back"
                aria-label={t(back[0])}
                title={t(back[0])}
                onClick={() => go(back[1])}
              >
                <I name="back" />
              </button>
            )}
            <h1>{t(title)}</h1>
          </div>
          {description && <p>{description}</p>}
        </div>
        {action}
      </header>
    );
  };
  const field = (label, key, options = {}) => (
    <label className="field" key={key}>
      <span>
        {t(label)}
        {options.required ? ' *' : ''}
      </span>
      {options.values ? (
        <PreviewSelect
          label={t(label)}
          value={draft[key] || options.values[0]}
          values={options.values}
          onChange={(v) => setDraft({ ...draft, [key]: v })}
        />
      ) : (
        <input
          type={options.type || 'text'}
          autoComplete={options.type === 'password' ? 'new-password' : 'off'}
          value={draft[key] || ''}
          onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
          aria-invalid={!!error[key]}
          aria-describedby={error[key] ? 'error-' + key : undefined}
          placeholder={t(label)}
        />
      )}{' '}
      {error[key] && (
        <small className="error" id={'error-' + key}>
          {error[key]}
        </small>
      )}
      {options.hint && <small>{options.hint}</small>}
    </label>
  );
  const validate = (keys) => {
    const e = {};
    keys.forEach((k) => {
      if (!String(draft[k] || '').trim()) e[k] = L('This field is required.', 'هذا الحقل مطلوب.');
    });
    setError(e);
    return !Object.keys(e).length;
  };
  const cancel = (to) => setModal({ type: 'discard', to });
  const actions = (save, to, label = 'Save changes') =>
    ['business-edit', 'settings-profile', 'settings-password'].includes(page) ? (
      <div className="stacked-form-actions">
        {btn(label, save, true)}
        {page === 'settings-password' && (
          <div className="subtle-strip">
            {L(
              'Other sessions will be signed out. This session stays active.',
              'تنتهي الجلسات الأخرى وتبقى هذه الجلسة نشطة.',
            )}
          </div>
        )}
        <div className="cancel-row">
          <small>{L('Your changes have not been saved yet.', 'لم يتم حفظ التغييرات بعد.')}</small>
          {btn('Cancel', () => cancel(to))}
        </div>
        {page === 'business-edit' && (
          <div className="business-status">
            <I name="building" />
            <small>{biz.name} · Café · Egypt</small>
          </div>
        )}
      </div>
    ) : (
      <div className="form-actions">
        <small>{L('Changes apply only to your account.', 'تنطبق التغييرات على حسابك فقط.')}</small>
        <div>
          {btn('Cancel', () => cancel(to))}
          {btn(label, save, true)}
        </div>
      </div>
    );
  const note = (title, body) => (
    <aside className="guidance-stack">
      <section className="side-note">
        {(page === 'business-edit' || page === 'settings-profile' || page === 'settings') && (
          <span className="guidance-icon">
            <I name={page === 'business-edit' ? 'building' : 'user'} />
          </span>
        )}
        <h3>{title}</h3>
        <p>{body}</p>
        {['business-edit', 'settings-profile', 'settings'].includes(page) && (
          <small className="note-divider">
            {page === 'business-edit'
              ? L(
                  'Use the business name your team recognizes and an industry that best describes it.',
                  'استخدم اسم النشاط الذي يعرفه فريقك والمجال الذي يصفه بدقة.',
                )
              : L(
                  'Your sign-in email is managed separately. Changing profile details does not affect your workspace role.',
                  'يتم إدارة بريد الدخول بشكل منفصل. تعديل الملف لا يؤثر على دورك في مساحة العمل.',
                )}
          </small>
        )}
      </section>
      {['business-edit', 'settings-profile', 'settings'].includes(page) && (
        <section className="card context-card">
          <h3>{t('Your workspace')}</h3>
          <p>{biz.name}</p>
          <p>
            {account.name} · {t('Workspace owner')}
          </p>
          <small>
            {L(
              'These settings apply to your personal NUVIA account, not your whole team.',
              'هذه الإعدادات تخص حسابك الشخصي فقط، وليس الفريق بأكمله.',
            )}
          </small>
        </section>
      )}
    </aside>
  );
  const linkAction = (label, dest) => (
    <button
      className="text-link action-arrow"
      onClick={() => {
        setDraft({});
        setCode('');
        go(dest);
      }}
    >
      {t(label)}
      <UiArrow size={14} rtl={ar} />
    </button>
  );
  const currentSettingsSection = [
    'settings',
    'settings-personal',
    'settings-account',
    'settings-profile',
    'settings-email',
  ].includes(page)
    ? 'settings'
    : page === 'settings-language'
      ? 'settings-language'
      : page.includes('notification')
        ? 'settings-notifications'
        : 'settings-security';
  const selectSettingsSection = (dest) => {
    setPrefDraft(preferences);
    setCode('');
    go(dest);
  };
  const settingsTabs = (
    <nav className="tabs desktop-settings-sections" aria-label={t('Settings')}>
      {tabs.map(([label, dest]) => (
        <button
          key={dest}
          className={currentSettingsSection === dest ? 'selected' : ''}
          onClick={() => selectSettingsSection(dest)}
        >
          {t(label)}
        </button>
      ))}
    </nav>
  );
  const businessTabs = (
    <nav className="tabs">
      {[
        ['Business profile', 'business'],
        ['Branches', 'branches'],
      ].map(([label, dest]) => (
        <button
          className={
            (dest === 'business' ? page.startsWith('business') : page.startsWith('branch'))
              ? 'selected'
              : ''
          }
          key={dest}
          onClick={() => go(dest)}
        >
          {t(label)}
        </button>
      ))}
    </nav>
  );
  const toggle = (label, key, values, setValues, body, disabled = false) => (
    <div className="setting-row" key={key}>
      <div>
        <strong>{t(label)}</strong>
        {body && <p>{body}</p>}
      </div>
      <button
        className="switch"
        type="button"
        role="switch"
        aria-label={t(label)}
        aria-checked={values[key]}
        disabled={disabled}
        onClick={() => setValues({ ...values, [key]: !values[key] })}
      >
        <span />
      </button>
    </div>
  );
  const editBiz = () => {
      setDraft({ ...biz });
      go('business-edit');
    },
    editBranch = (b) => {
      setDraft(b ? { ...b } : { name: '', country: 'Egypt', city: '', address: '' });
      go(b ? 'branch-edit?id=' + encodeURIComponent(b.id) : 'branch-add');
    },
    editProfile = () => {
      setDraft({ ...account });
      go('settings-profile');
    };
  return {
    preview,
    saving,
    saveConnectedBusiness,
    saveConnectedBranch,
    archiveConnectedBranch,
    saveAccount,
    saveEmailChange,
    cancelEmailChange,
    savePassword,
    saveLanguage,
    saveNotifications,
    twoFactorSetup,
    setTwoFactorSetup,
    recoveryCodes,
    setRecoveryCodes,
    enableTwoFactor,
    disableTwoFactor,
    revokeSession,
    signOutAllSessions,
    page,
    setPage,
    setMobile,
    setMenu,
    sample,
    setSample,
    modal,
    setModal,
    toast,
    setToast,
    row,
    setRow,
    query,
    setQuery,
    archive,
    setArchive,
    branchHistory,
    branchHistoryLoading,
    branchHistoryError,
    historyStart,
    setHistoryStart,
    historyEnd,
    setHistoryEnd,
    historySurvey,
    setHistorySurvey,
    historyDateOpen,
    setHistoryDateOpen,
    otherBusinesses,
    setOtherBusinesses,
    biz,
    setBiz,
    branches,
    setBranches,
    account,
    setAccount,
    draft,
    setDraft,
    error,
    setError,
    pending,
    setPending,
    preferences,
    setPreferences,
    prefDraft,
    setPrefDraft,
    toggles,
    setToggles,
    switchDraft,
    setSwitchDraft,
    delivery,
    setDelivery,
    notificationTab,
    setNotificationTab,
    read,
    setRead,
    sessions,
    setSessions,
    code,
    setCode,
    twoFA,
    setTwoFA,
    lang,
    setLang,
    ar,
    t,
    L,
    go,
    notify,
    businessPage,
    settingsPage,
    active,
    old,
    btn,
    heading,
    field,
    validate,
    cancel,
    actions,
    note,
    linkAction,
    currentSettingsSection,
    selectSettingsSection,
    settingsTabs,
    businessTabs,
    toggle,
    editBiz,
    editBranch,
    editProfile,
  };
}
