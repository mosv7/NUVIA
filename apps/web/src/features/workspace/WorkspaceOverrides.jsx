import { I, Empty } from './WorkspacePrimitives.jsx';
import { initialBranches } from './workspace-data.js';

export default function applyWorkspaceOverrides(model, content) {
  const {
    L,
    account,
    branches,
    btn,
    businessTabs,
    editBranch,
    go,
    heading,
    linkAction,
    page,
    setBranches,
    setSample,
    settingsTabs,
    t,
  } = model;
  if (page === 'branches' && !branches.length)
    content = (
      <>
        {heading(
          'Branches',
          L(
            'Manage your locations and explore the experience behind each branch.',
            'أدر مواقعك وتعرف على تجربة العملاء في كل فرع.',
          ),
        )}
        {businessTabs}
        <section className="card table-card">
          <Empty
            title={L('Your first branch starts here', 'ابدأ بإضافة فرعك الأول')}
            description={L(
              'Add a branch to keep feedback organized by location. Your branches will appear here.',
              'أضف فرعًا لتنظيم الآراء حسب الموقع. ستظهر فروعك هنا.',
            )}
            action={btn('Add branch', () => editBranch(), true)}
            onSample={() => {
              setSample(true);
              setBranches(initialBranches);
            }}
          />
        </section>
      </>
    );
  if (page === 'settings')
    content = (
      <>
        <div className="mobile-settings-home">
          {heading(
            'Settings',
            L('Manage your profile and account preferences.', 'أدر ملفك الشخصي وتفضيلات حسابك.'),
          )}
          <nav
            className="settings-home-list"
            aria-label={L('Settings sections', 'أقسام الإعدادات')}
          >
            {[
              [
                'Personal information',
                'settings-personal',
                'user',
                L('Your name, photo and contact details', 'اسمك وصورتك وبيانات التواصل'),
              ],
              [
                'Account settings',
                'settings-account',
                'mail',
                L('Manage your sign-in email', 'إدارة بريد تسجيل الدخول'),
              ],
              [
                'Language settings',
                'settings-language',
                'globe',
                L('Language, region and formats', 'اللغة والمنطقة والتنسيقات'),
              ],
              [
                'Notification settings',
                'settings-notifications',
                'notifications',
                L('Choose which updates you receive', 'اختر التحديثات التي تصلك'),
              ],
              [
                'Account security',
                'settings-security',
                'shield',
                L('Password, verification and devices', 'كلمة المرور والتحقق والأجهزة'),
              ],
            ].map(([label, dest, icon, desc]) => (
              <button key={dest} onClick={() => go(dest)}>
                <span className="settings-home-icon">
                  <I name={icon} />
                </span>
                <span className="settings-home-copy">
                  <strong>{t(label)}</strong>
                  <small>{desc}</small>
                </span>
              </button>
            ))}
          </nav>
        </div>
        <div className="desktop-settings-detail">{content}</div>
      </>
    );
  if (page === 'settings-account')
    content = (
      <>
        {heading(
          'Account settings',
          L('Manage how you sign in to NUVIA.', 'أدر طريقة تسجيل دخولك إلى NUVIA.'),
        )}
        {settingsTabs}
        <section className="card">
          <h2>{t('Sign-in information')}</h2>
          <div className="setting-row">
            <div>
              <strong>{t('Email address')}</strong>
              <p>{account.email}</p>
            </div>
            {linkAction('Change email', 'settings-email')}
          </div>
          <div className="setting-row">
            <div>
              <strong>{L('Password', 'كلمة المرور')}</strong>
              <p>{L('Keep your account protected.', 'حافظ على حماية حسابك.')}</p>
            </div>
            {linkAction('Change password', 'settings-password')}
          </div>
        </section>
      </>
    );
  return content;
}
