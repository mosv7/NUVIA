import { I, PreviewSelect } from './WorkspacePrimitives.jsx';

export default function renderAccountPages(model) {
  const {
    L,
    preview,
    account,
    actions,
    biz,
    btn,
    draft,
    editProfile,
    field,
    go,
    heading,
    note,
    notify,
    page,
    pending,
    prefDraft,
    preferences,
    setAccount,
    setDraft,
    setError,
    setLang,
    setPending,
    setPrefDraft,
    setPreferences,
    settingsTabs,
    t,
    validate,
  } = model;
  let content;
  if (['settings', 'settings-personal'].includes(page))
    content = (
      <>
        {heading(
          page === 'settings-personal' ? 'Personal information' : 'Account settings',
          L(
            'Manage your personal information and how you appear in your workspace.',
            'أدر بياناتك الشخصية وطريقة ظهورك في مساحة العمل.',
          ),
        )}
        {settingsTabs}
        <div className="edit-layout">
          <div>
            <section className="card">
              <h2>{t('Personal information')}</h2>
              <p className="muted">
                {L(
                  'Your profile is visible to the people in your workspace.',
                  'ملفك مرئي للأشخاص في مساحة عملك.',
                )}
              </p>
              <div className="profile-summary">
                <span className="avatar large">
                  {account.photo ? <img src={account.photo} alt="" /> : <I name="user" />}
                </span>
                <div>
                  <h3>{account.name}</h3>
                  <p>{account.title}</p>
                </div>
                <span className="badge green">{t('Workspace owner')}</span>
              </div>
              <dl className="details-grid">
                {[
                  ['Full name', account.name],
                  ['Member since', preview ? L('12 March 2025', '١٢ مارس ٢٠٢٥') : '—'],
                  ['Email address', account.email],
                  ['Phone number', account.phone],
                  ['Country', account.country],
                  ['Your workspace', biz.name],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt>{t(k)}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="card-bottom">
                <span className="verified">
                  <I name="check" size={16} />
                  {preview
                    ? L('Email verified', 'البريد مؤكد')
                    : L('Email verification is under development', 'تأكيد البريد قيد التطوير')}
                </span>
                {btn('Edit account details', editProfile)}
              </div>
            </section>
            {page !== 'settings-personal' && (
              <section className="card spaced">
                <h2>{t('Sign-in information')}</h2>
                <div className="setting-row">
                  <div>
                    <strong>{t('Email address')}</strong>
                    <p>{account.email}</p>
                  </div>
                  {btn('Change email', () => {
                    setDraft({ email: '', password: '' });
                    go('settings-email');
                  })}
                </div>
              </section>
            )}
          </div>
          {note(
            L('Your account, your identity', 'حسابك وهويتك'),
            L(
              'Keep your details up to date. Business information and branches are managed under Business.',
              'حافظ على بياناتك محدثة. أدر معلومات النشاط والفروع من صفحة النشاط التجاري.',
            ),
          )}
        </div>
      </>
    );
  else if (page === 'settings-profile')
    content = (
      <>
        {heading(
          'Edit account details',
          L(
            'Update the details associated with your personal NUVIA account.',
            'حدّث البيانات المرتبطة بحسابك الشخصي.',
          ),
          null,
          ['Account settings', 'settings'],
        )}
        {settingsTabs}
        <div className="edit-layout">
          <form className="card" onSubmit={(e) => e.preventDefault()}>
            <h2>{t('Personal information')}</h2>
            <div className="photo-row">
              <span className="avatar large">
                {draft.photo ? <img src={draft.photo} alt="" /> : <I name="user" />}
              </span>
              <label className="button">
                {t('Upload photo')}
                <input
                  className="visually-hidden"
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (
                      !['image/png', 'image/jpeg'].includes(file.type) ||
                      file.size > 2 * 1024 * 1024
                    ) {
                      notify(
                        L('Choose JPG or PNG under 2 MB.', 'اختر JPG أو PNG أصغر من ٢ ميجابايت.'),
                      );
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = () => setDraft((prev) => ({ ...prev, photo: reader.result }));
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
              {btn('Remove', () => setDraft({ ...draft, photo: '' }))}
            </div>
            <small className="muted">JPG / PNG · Max 2 MB</small>
            <div className="field-grid">
              {field('Phone number', 'phone', { type: 'tel' })}
              {field('Country', 'country', {
                values: [
                  'Egypt',
                  'Saudi Arabia',
                  'United Arab Emirates',
                  'United Kingdom',
                  'Other',
                ],
              })}
            </div>
            {field('Full name', 'name', { required: true })}
            {field('Job title', 'title')}
            {actions(() => {
              if (validate(['name'])) {
                setAccount({ ...draft });
                setDraft({});
                notify('Changes saved');
                go('settings');
              }
            }, 'settings')}
          </form>
          {note(
            L('Make your profile familiar', 'ملف شخصي يعرفه فريقك'),
            L(
              'Use the name your team knows you by. Changing your profile does not change your workspace role.',
              'استخدم الاسم الذي يعرفك به فريقك. تعديل الملف لا يغير دورك في مساحة العمل.',
            ),
          )}
        </div>
      </>
    );
  else if (page === 'settings-email')
    content = (
      <>
        {heading(
          'Change email',
          L(
            'Keep your account connected to an email address you can access.',
            'اربط حسابك ببريد يمكنك الوصول إليه.',
          ),
          null,
          ['Account settings', 'settings'],
        )}
        {settingsTabs}
        <div className="edit-layout">
          <section className="card">
            <h2>{t('Email address')}</h2>
            <p>
              {account.email}{' '}
              <span className={'badge ' + (preview ? 'green' : 'neutral')}>
                {preview ? L('Verified', 'مؤكد') : L('Under development', 'قيد التطوير')}
              </span>
            </p>
            {pending ? (
              <>
                <div className="info-strip">
                  <I name="mail" />
                  <div>
                    <strong>{L('Check your new inbox', 'تحقق من بريدك الجديد')}</strong>
                    <p>{pending}</p>
                    <p>
                      {L(
                        'Your email changes only after verification. Continue signing in with your current address.',
                        'يتغير البريد بعد التأكيد فقط. استمر بالدخول ببريدك الحالي.',
                      )}
                    </p>
                  </div>
                </div>
                <div className="inline-actions">
                  {btn(L('Resend verification email', 'إعادة إرسال رابط التأكيد'), () =>
                    notify(L('Preview only. No email sent.', 'معاينة فقط، لم يتم إرسال بريد.')),
                  )}
                  {btn(L('Cancel email change', 'إلغاء تغيير البريد'), () => setPending(''))}
                </div>
              </>
            ) : (
              <>
                {field('New email address', 'email', { type: 'email', required: true })}
                {field('Current password', 'password', { type: 'password', required: true })}
                {actions(() => {
                  if (!validate(['email', 'password'])) return;
                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) {
                    setError({ email: L('Enter a valid email.', 'أدخل بريدًا صالحًا.') });
                    return;
                  }
                  setPending(draft.email);
                  setDraft({});
                  notify(
                    L(
                      'Pending verification preview. No email sent.',
                      'معاينة انتظار التأكيد، لم يتم إرسال بريد.',
                    ),
                  );
                }, 'settings')}
              </>
            )}
          </section>
          {note(
            L('Your sign-in email', 'بريد تسجيل الدخول'),
            L(
              'This preview does not send emails or change your real account.',
              'هذه المعاينة لا ترسل بريدًا أو تغيّر حسابك الحقيقي.',
            ),
          )}
        </div>
      </>
    );
  else if (page === 'settings-language')
    content = (
      <>
        {heading(
          'Language settings',
          L(
            'Choose the language and regional formats that feel right for you.',
            'اختر اللغة وتنسيقات المنطقة المناسبة لك.',
          ),
        )}
        {settingsTabs}
        <div className="edit-layout">
          <section className="card">
            <h2>{L('Language & region', 'اللغة والمنطقة')}</h2>
            {[
              [
                'Display language',
                'language',
                [
                  ['en', 'English'],
                  ['ar', 'العربية'],
                ],
              ],
              [
                'Region',
                'region',
                ['Egypt', 'United Kingdom', 'Saudi Arabia', 'United Arab Emirates'],
              ],
              ['Time zone', 'zone', ['Africa/Cairo', 'Europe/London', 'Asia/Riyadh', 'Asia/Dubai']],
              ['Date format', 'date', ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']],
              ['Time format', 'time', ['12-Hour', '24-Hour']],
            ].map(([label, key, opts]) => (
              <label className="field" key={key}>
                <span>{t(label)}</span>
                <PreviewSelect
                  label={t(label)}
                  value={prefDraft[key]}
                  values={opts}
                  onChange={(v) => setPrefDraft({ ...prefDraft, [key]: v })}
                />
              </label>
            ))}
            <div className="subtle-strip">
              <strong>{t('Format preview')}</strong>
              <p>
                {prefDraft.date === 'YYYY-MM-DD'
                  ? '2026-10-22'
                  : prefDraft.date === 'MM/DD/YYYY'
                    ? '10/22/2026'
                    : '22/10/2026'}{' '}
                ·{' '}
                {new Intl.DateTimeFormat(prefDraft.language, {
                  timeZone: prefDraft.zone,
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: prefDraft.time === '12-Hour',
                }).format(new Date('2026-10-22T07:30:00Z'))}{' '}
                ·{' '}
                {new Intl.NumberFormat(prefDraft.language, { minimumFractionDigits: 2 }).format(
                  1248.5,
                )}
              </p>
            </div>
            <div className="form-actions">
              <small>
                {L('Changes apply only after you save.', 'تطبق التغييرات بعد الحفظ فقط.')}
              </small>
              <div>
                {btn('Cancel', () => {
                  setPrefDraft(preferences);
                  go('settings');
                })}
                {btn(
                  'Save changes',
                  () => {
                    setPreferences(prefDraft);
                    setLang(prefDraft.language);
                    notify('Changes saved');
                  },
                  true,
                )}
              </div>
            </div>
          </section>
          {note(
            L('A workspace in your language', 'مساحة عمل بلغتك'),
            L(
              'These preferences change your interface and how dates, times and numbers are displayed.',
              'تغيّر هذه التفضيلات لغة الواجهة وطريقة عرض التواريخ والأوقات والأرقام.',
            ),
          )}
        </div>
      </>
    );
  return content;
}
