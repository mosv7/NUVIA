import UiArrow from '../../components/ui/UiArrow.jsx';
import { I } from './WorkspacePrimitives.jsx';

export default function renderSecurityPages(model) {
  const {
    L,
    preview,
    account,
    emailVerificationAvailable,
    actions,
    ar,
    btn,
    settingsBusy,
    code,
    draft,
    field,
    go,
    heading,
    linkAction,
    note,
    notify,
    page,
    sessions,
    savePassword,
    setCode,
    setError,
    settingsTabs,
    t,
    twoFA,
    twoFactorSetup,
    recoveryCodes,
    enableTwoFactor,
    disableTwoFactor,
    revokeSession,
    signOutAllSessions,
    validate,
  } = model;
  const canVerifyEmail = !preview && emailVerificationAvailable && !account.emailVerified;
  let content;
  if (page === 'settings-security')
    content = (
      <>
        {heading(
          'Account security',
          L(
            'Protect your account and stay in control of where you are signed in.',
            'احمِ حسابك وتحكم في الأجهزة المسجل دخولها.',
          ),
        )}
        {settingsTabs}
        <div className="edit-layout">
          <div>
            <div className="security-banner">
              <I name="info" />
              <div>
                <strong>{L('Strengthen your account security', 'عزز أمان حسابك')}</strong>
                <p>
                  {L(
                    account.emailVerified
                      ? 'Your email is verified. Add two-factor authentication for an extra layer of protection.'
                      : 'Add two-factor authentication for an extra layer of protection.',
                    account.emailVerified
                      ? 'بريدك مؤكد. أضف المصادقة الثنائية لمزيد من الحماية.'
                      : 'أضف المصادقة الثنائية لمزيد من الحماية.',
                  )}
                </p>
              </div>
            </div>
            <section className="card">
              <h2>{L('Sign-in & verification', 'تسجيل الدخول والتحقق')}</h2>
              <p className="muted">
                {L(
                  'Manage the credentials that keep your account safe.',
                  'أدر بيانات الدخول التي تحمي حسابك.',
                )}
              </p>
              <div className="setting-row">
                <div>
                  <strong>{L('Password', 'كلمة المرور')}</strong>
                  <p>{L('Last changed 14 September 2026', 'آخر تغيير: ١٤ سبتمبر ٢٠٢٦')}</p>
                </div>
                {linkAction('Change password', 'settings-password')}
              </div>
              <div className="setting-row">
                <div>
                  <strong>{t('Two-factor authentication')}</strong>
                  <p>
                    {twoFA
                      ? L('Enabled for this account', 'مفعلة لهذا الحساب')
                      : L(
                          'Not enabled · Use an authenticator app to secure your account.',
                          'غير مفعلة · استخدم تطبيق مصادقة لحماية الحساب.',
                        )}
                  </p>
                </div>
                {linkAction(twoFA ? 'Manage' : 'Set up', 'settings-two-factor')}
              </div>
              <div className="setting-row">
                <div>
                  <strong>{L('Email verification', 'تأكيد البريد الإلكتروني')}</strong>
                  <p>{account.email}</p>
                </div>
                <div className="verification-actions">
                  <span className={'badge ' + (account.emailVerified ? 'green' : 'neutral')}>
                    {account.emailVerified
                      ? L('Verified', 'مؤكد')
                      : canVerifyEmail
                        ? L('Unverified', 'غير مؤكد')
                        : L('Not available', 'غير متاح')}
                  </span>
                  {canVerifyEmail &&
                    linkAction(
                      L('Verify email address', 'تأكيد البريد الإلكتروني'),
                      'verify-email',
                    )}
                  {linkAction(L('Manage email', 'إدارة البريد'), 'settings-email')}
                </div>
              </div>
            </section>
            <section className="card spaced">
              <h2>{t('Devices & active sessions')}</h2>
              <div className="setting-row">
                <div>
                  <strong>
                    {sessions.length} {L('active sessions', 'جلسات نشطة')}
                  </strong>
                  <p>
                    {L(
                      'Review signed-in devices or sign out of all devices.',
                      'راجع الأجهزة المسجل دخولها أو اخرج من جميع الأجهزة.',
                    )}
                  </p>
                </div>
                {linkAction('Manage devices', 'settings-devices')}
              </div>
            </section>
          </div>
          {note(
            L('A little extra protection', 'حماية إضافية لحسابك'),
            L(
              'Turn on two-factor authentication to add a verification step whenever you sign in.',
              'فعّل المصادقة الثنائية لإضافة خطوة تحقق عند الدخول.',
            ),
          )}
        </div>
      </>
    );
  else if (page === 'settings-password')
    content = (
      <>
        {heading(
          'Change password',
          L(
            'Choose a strong, unique password to protect your account.',
            'اختر كلمة مرور قوية وفريدة لحماية حسابك.',
          ),
          null,
          ['Account security', 'settings-security'],
        )}
        {settingsTabs}
        <div className="edit-layout">
          <form className="card" inert={settingsBusy} onSubmit={(e) => e.preventDefault()}>
            <h2>{t('Update password')}</h2>
            {field('Current password', 'current', { type: 'password', required: true })}
            {field('New password', 'password', {
              type: 'password',
              required: true,
              hint: L(
                'Use at least 12 characters, including a letter, number and symbol.',
                'استخدم ١٢ حرفًا على الأقل مع حرف ورقم ورمز.',
              ),
            })}
            {field('Confirm new password', 'confirm', { type: 'password', required: true })}
            {actions(
              () => {
                if (!validate(['current', 'password', 'confirm'])) return;
                const e = {};
                if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/.test(draft.password))
                  e.password = L(
                    'Use 12+ characters with a letter, number and symbol.',
                    'استخدم ١٢ حرفًا على الأقل مع حرف ورقم ورمز.',
                  );
                if (draft.password !== draft.confirm)
                  e.confirm = L('Passwords do not match.', 'كلمتا المرور غير متطابقتين.');
                setError(e);
                if (!Object.keys(e).length) savePassword();
              },
              'settings-security',
              'Update password',
            )}
          </form>
          {note(
            L('Keep your password private', 'احتفظ بكلمة مرورك لنفسك'),
            L(
              'After a successful update, other active sessions are signed out and this session remains active.',
              'بعد نجاح التحديث، سيتم تسجيل الخروج من الجلسات الأخرى مع بقاء جلستك الحالية.',
            ),
          )}
        </div>
      </>
    );
  else if (page === 'settings-two-factor')
    content = (
      <>
        {heading(
          'Two-factor authentication',
          L(
            'Add an extra layer of security with an authenticator app.',
            'أضف طبقة حماية باستخدام تطبيق مصادقة.',
          ),
          null,
          ['Account security', 'settings-security'],
        )}
        {settingsTabs}
        <div className="edit-layout">
          <section className="card two-factor-card" inert={settingsBusy}>
            <h2>{L('Connect your authenticator', 'اربط تطبيق المصادقة')}</h2>
            <p>
              {L(
                'Complete both steps to enable two-factor authentication.',
                'أكمل الخطوتين لتفعيل المصادقة الثنائية.',
              )}
            </p>
            <div className="two-factor-steps">
              <span>{L('1 · Enrol your app', '١ · اربط التطبيق')}</span>
              <UiArrow size={14} rtl={ar} />
              <span className="muted">{L('2 · Verify & enable', '٢ · تأكيد وتفعيل')}</span>
            </div>
            <div className="enrolment-row">
              <div className="enrolment-tile">
                {twoFA ? (
                  <I name="check" />
                ) : twoFactorSetup?.qrSvg ? (
                  <img
                    alt={L('Authenticator setup QR code', 'رمز QR لإعداد تطبيق المصادقة')}
                    src={
                      'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(twoFactorSetup.qrSvg)
                    }
                  />
                ) : (
                  <I name="loader" />
                )}
                <strong>
                  {twoFA
                    ? L('Two-factor authentication is enabled', 'المصادقة الثنائية مفعلة')
                    : twoFactorSetup?.secret ||
                      L('Preparing secure setup…', 'جارٍ تجهيز الإعداد الآمن…')}
                </strong>
              </div>
              <div className="enrolment-copy">
                <h3>{L('1. Add NUVIA to your app', '١. أضف NUVIA إلى تطبيقك')}</h3>
                <p>
                  {L(
                    'Open your authenticator, choose “Add account”, then scan the QR code or enter the setup key shown here.',
                    'افتح تطبيق المصادقة واختر إضافة حساب. في التطبيق الفعلي، امسح شفرة QR الآمنة المعروضة هنا.',
                  )}
                </p>
                <small>
                  {L('Account: ', 'الحساب: ')}
                  {account.email} ·{' '}
                  {L(
                    'Manual setup key: shown above',
                    'مفتاح الإعداد اليدوي: يظهر أثناء الإعداد الفعلي فقط',
                  )}
                </small>
              </div>
            </div>
            <div className="verification-step">
              {twoFA && field('Current password', 'password', { type: 'password', required: true })}
              <h3>
                {L(
                  twoFA
                    ? 'Enter your password and 6-digit code to disable 2FA'
                    : '2. Enter your 6-digit verification code',
                  twoFA
                    ? 'أدخل كلمة المرور ورمز التحقق المكون من ٦ أرقام لإيقاف المصادقة'
                    : '٢. أدخل رمز التحقق المكون من ٦ أرقام',
                )}
              </h3>
              <p>
                {L(
                  'Use the current code from your authenticator app.',
                  'استخدم الرمز الحالي من تطبيق المصادقة.',
                )}
              </p>
              <div className="code-digits">
                {Array.from({ length: 6 }, (_, i) => (
                  <input
                    key={i}
                    aria-label={L('Code digit ', 'رقم الرمز ') + (i + 1)}
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={1}
                    placeholder="–"
                    value={code[i] || ''}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '').slice(-1);
                      let next = code.padEnd(6, ' ').split('');
                      next[i] = v || ' ';
                      setCode(next.join(''));
                      if (v) e.target.nextElementSibling?.focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !e.currentTarget.value)
                        e.currentTarget.previousElementSibling?.focus();
                    }}
                  />
                ))}
              </div>
              <small>
                {L(
                  'Codes refresh every 30 seconds. Enter all 6 digits without spaces.',
                  'يتجدد الرمز كل ٣٠ ثانية. أدخل الأرقام الستة دون مسافات.',
                )}
              </small>
            </div>
            <div className="figma-information">
              <I name="info" />
              <div>
                <strong>
                  {twoFA
                    ? L('Your account is protected', 'حسابك محمي')
                    : L('Setup is not complete yet', 'لم يكتمل الإعداد بعد')}
                </strong>
                <p>
                  {twoFA
                    ? L(
                        'Two-factor authentication is enabled for this account.',
                        'المصادقة الثنائية مفعلة لهذا الحساب.',
                      )
                    : L(
                        'Two-factor authentication stays off until your verification code is accepted.',
                        'تظل المصادقة الثنائية غير مفعلة حتى قبول رمز التحقق.',
                      )}
                </p>
              </div>
            </div>
            <div className="form-actions">
              <small>
                {L(
                  twoFA
                    ? 'Disable authentication only if you intend to remove this protection.'
                    : 'Save your recovery codes after enabling.',
                  'لا توقف المصادقة إلا إذا كنت تريد إزالة هذه الحماية.',
                )}
              </small>
              <div>
                {btn('Cancel', () => go('settings-security'))}
                {btn(
                  twoFA ? 'Disable two-factor authentication' : 'Verify & enable',
                  () => {
                    if (!/^\d{6}$/.test(code)) {
                      notify(L('Enter all six digits.', 'أدخل الأرقام الستة.'));
                      return;
                    }
                    if (twoFA) {
                      if (!draft.password) {
                        notify('Enter your current password.');
                        return;
                      }
                      disableTwoFactor();
                    } else enableTwoFactor();
                  },
                  true,
                )}
              </div>
            </div>
            {recoveryCodes?.length > 0 && (
              <div className="info-strip">
                <div>
                  <strong>{L('Save these recovery codes now', 'احفظ رموز الاسترداد الآن')}</strong>
                  <p>{recoveryCodes.join(' · ')}</p>
                </div>
              </div>
            )}
          </section>
          {note(
            L('Secure sign-in, made simple', 'دخول آمن بخطوات بسيطة'),
            L(
              'Use Google Authenticator, Microsoft Authenticator, 1Password or another compatible authenticator app.',
              'استخدم Google Authenticator أو Microsoft Authenticator أو 1Password أو تطبيق مصادقة متوافق آخر.',
            ),
          )}
        </div>
      </>
    );
  else if (page === 'settings-devices')
    content = (
      <>
        {heading(
          'Devices & active sessions',
          L(
            'See where you are signed in and manage access to your account.',
            'اعرض الأجهزة المسجل دخولها وأدر الوصول لحسابك.',
          ),
          null,
          ['Account security', 'settings-security'],
        )}
        {settingsTabs}
        <div className="edit-layout">
          <div inert={settingsBusy}>
            <section className="card">
              <h2>
                {L('Active sessions', 'الجلسات النشطة')}{' '}
                <span className="badge neutral">{sessions.length}</span>
              </h2>
              {sessions.map((session) => (
                <div className="session-row" key={preview ? session : session.id || session._id}>
                  <span className="tile">
                    <I name="device" />
                  </span>
                  <div>
                    <strong>{session.device || 'Unknown device'}</strong>
                    <p>{session.location || session.ip || session.deviceType || ''}</p>
                    <small>
                      {L('Last active: ', 'آخر نشاط: ')}
                      {session.lastActiveAt ? new Date(session.lastActiveAt).toLocaleString() : '—'}
                    </small>
                  </div>
                  {session.isCurrent ? (
                    <span className="badge green">{t('This device')}</span>
                  ) : (
                    btn('Sign out', () =>
                      revokeSession(preview ? session : session.id || session._id),
                    )
                  )}
                </div>
              ))}
              {!sessions.length && <p>{L('No active sessions found.', 'لا توجد جلسات نشطة.')}</p>}
            </section>
            <section className="card spaced">
              <div className="setting-row">
                <div>
                  <strong>{t('Sign out of all devices')}</strong>
                  <p>
                    {L(
                      'End all sessions, including this one.',
                      'إنهاء كل الجلسات، بما فيها الحالية.',
                    )}
                  </p>
                </div>
                {btn('Sign out of all devices', signOutAllSessions)}
              </div>
            </section>
          </div>
          {note(
            L('Recognize every device', 'تعرف على كل جهاز'),
            L(
              'Locations are approximate and may differ when using a VPN or mobile network. Devices shown are illustrative.',
              'المواقع تقريبية وقد تختلف مع VPN أو شبكة الهاتف. الأجهزة المعروضة توضيحية.',
            ),
          )}
        </div>
      </>
    );
  return content;
}
