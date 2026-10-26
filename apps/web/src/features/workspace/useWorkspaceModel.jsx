import { useAuth } from '../../app/providers/AuthProvider.jsx';
import { workspaceApi } from '../workspaces/api.js';
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
    [historyDateOpen, setHistoryDateOpen] = useState(false);
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
    [twoFA, setTwoFA] = useState(false);
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
    if (page !== 'branch-edit') return;
    const id = new URLSearchParams(location.hash.split('?')[1]).get('id');
    const branch = branches.find((item) => String(item.id) === id);
    if (branch) setDraft((current) => (String(current.id) === id ? current : { ...branch }));
    else if (!id || branches.length) {
      setToast(
        language === 'ar'
          ? 'اختر فرعًا من القائمة لتعديله.'
          : 'Choose a branch from the list to edit.',
      );
      location.hash = '/branches';
    }
  }, [page, branches, language]);
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
