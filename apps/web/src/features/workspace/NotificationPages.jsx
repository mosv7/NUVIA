import UiArrow from '../../components/ui/UiArrow.jsx';
import { I, Empty, PreviewSelect } from './WorkspacePrimitives.jsx';

export default function renderNotificationPages(model) {
  const {
    L,
    account,
    ar,
    btn,
    delivery,
    go,
    heading,
    note,
    notificationTab,
    notify,
    page,
    read,
    sample,
    setDelivery,
    setNotificationTab,
    setRead,
    setSwitchDraft,
    setToggles,
    settingsTabs,
    switchDraft,
    t,
    toggle,
    toggles,
  } = model;
  let content;
  if (page === 'settings-notifications')
    content = (
      <>
        {heading(
          'Notification settings',
          L(
            'Stay informed without the noise. Choose what you receive and where.',
            'ابقَ مطلعًا دون إزعاج. اختر ما يصلك وأين.',
          ),
        )}
        {settingsTabs}
        <div className="edit-layout">
          <section className="card">
            <h2>{L('Notification channels', 'قنوات الإشعارات')}</h2>
            <p className="muted">
              {L('Control how NUVIA reaches you.', 'تحكم في طريقة تواصل NUVIA معك.')}
            </p>
            <div className="channels-grid">
              {[
                ['email', 'Email notifications', 'settings-notifications-email'],
                ['inapp', 'In-app notifications', 'settings-notifications-inapp'],
              ].map(([key, label, dest]) => (
                <div className="channel-card" key={key}>
                  <button
                    className="switch"
                    type="button"
                    role="switch"
                    aria-label={t(label)}
                    aria-checked={switchDraft[key]}
                    onClick={() => setSwitchDraft({ ...switchDraft, [key]: !switchDraft[key] })}
                  >
                    <span />
                  </button>
                  <h3>{t(label)}</h3>
                  <p>
                    {L(
                      key === 'email'
                        ? 'Feedback, reports and workspace updates sent to your inbox.'
                        : 'Updates in your NUVIA notification centre while you work.',
                      key === 'email'
                        ? 'الآراء والتقارير وتحديثات مساحة العمل في بريدك.'
                        : 'تحديثات داخل مركز الإشعارات أثناء العمل.',
                    )}
                  </p>
                  <button
                    className="button action-arrow"
                    onClick={() => {
                      setSwitchDraft({ ...toggles });
                      go(dest);
                    }}
                  >
                    {t('Manage preferences')}
                    <UiArrow size={14} rtl={ar} />
                  </button>
                </div>
              ))}
            </div>
            <div className="subtle-strip">
              <strong className="action-arrow">
                <I name="info" />
                {L('Email delivery', 'إرسال البريد')}
              </strong>
              <p>
                {L('Notifications are sent to', 'ترسل الإشعارات إلى')} {account.email}
              </p>
            </div>
            <div className="form-actions">
              <small>
                {L('Changes apply only to your account.', 'تنطبق التغييرات على حسابك فقط.')}
              </small>
              <div>
                {btn('Cancel', () => {
                  setSwitchDraft({ ...toggles });
                  go('settings');
                })}
                {btn(
                  'Save changes',
                  () => {
                    setToggles({ ...switchDraft });
                    notify('Changes saved');
                  },
                  true,
                )}
              </div>
            </div>
          </section>
          {note(
            L('Stay in the loop', 'ابقَ على اطلاع'),
            L(
              'Choose the channels that fit your day. Fine-tune each one to focus on the updates that matter most. Security alerts and essential account notices always stay on.',
              'اختر القنوات التي تناسب يومك وخصص كل واحدة للتحديثات المهمة. تبقى تنبيهات الأمان والحساب الأساسية مفعلة.',
            ),
          )}
        </div>
      </>
    );
  else if (page.startsWith('settings-notifications-')) {
    const email = page.endsWith('email');
    content = (
      <>
        {heading(
          email ? 'Email notifications' : 'In-app notifications',
          L('Choose the updates that matter to you.', 'اختر التحديثات التي تهمك.'),
          null,
          ['Notification settings', 'settings-notifications'],
        )}
        {settingsTabs}
        <div className="edit-layout">
          <section className="card">
            <h2>{t(email ? 'Email notifications' : 'In-app notifications')}</h2>
            {(email
              ? [
                  ['feedback', 'New customer feedback'],
                  ['low', 'Low-rating alerts'],
                  ['weekly', 'Weekly performance report'],
                  ['news', 'Product news & tips'],
                  ['security', 'Account & security'],
                ]
              : [
                  ['feedback', 'New customer feedback'],
                  ['low', 'Low-rating alerts'],
                  ['reports', 'Reports ready to view'],
                  ['sound', 'Play a notification sound'],
                  ['popup', 'Show pop-up alerts'],
                ]
            ).map(([key, label]) =>
              toggle(
                label,
                key,
                switchDraft,
                setSwitchDraft,
                key === 'security'
                  ? L(
                      'Essential security notices are always enabled.',
                      'تنبيهات الأمان الأساسية مفعلة دائمًا.',
                    )
                  : key === 'low'
                    ? L(
                        'Ratings of 2 stars or below. Sent immediately.',
                        'تقييمات بنجمتين أو أقل. ترسل فورًا.',
                      )
                    : null,
                key === 'security',
              ),
            )}
            {email && (
              <label className="field">
                <span>{L('Routine feedback delivery', 'موعد إرسال ملخص الآراء')}</span>
                <PreviewSelect
                  label={L('Email delivery', 'إرسال البريد')}
                  value={delivery}
                  values={['Daily digest', 'Immediately', 'Weekly digest'].map((v) => [v, t(v)])}
                  onChange={setDelivery}
                />
                <small>
                  {L(
                    'Daily digest at 09:00. Low-rating alerts remain immediate.',
                    'الملخص اليومي الساعة ٠٩:٠٠. تنبيهات التقييم المنخفض فورية.',
                  )}
                </small>
              </label>
            )}
            <div className="form-actions">
              <small>{L('Changes apply only to your account.', 'التغييرات تخص حسابك فقط.')}</small>
              <div>
                {btn('Cancel', () => go('settings-notifications'))}
                {btn(
                  'Save changes',
                  () => {
                    setToggles({ ...switchDraft });
                    notify('Changes saved');
                    go('settings-notifications');
                  },
                  true,
                )}
              </div>
            </div>
          </section>
          {note(
            L('A more useful inbox', 'تحديثات أكثر فائدة'),
            L(
              'Keep high-priority alerts immediate and use the digest for routine updates.',
              'اجعل التنبيهات المهمة فورية واستخدم الملخص للتحديثات المعتادة.',
            ),
          )}
        </div>
      </>
    );
  } else if (page === 'notifications') {
    const notes = [
      {
        id: 1,
        title: L('Your weekly report is ready', 'تقريرك الأسبوعي جاهز'),
        body: L(
          'See the latest customer experience trends for Bloom & Co.',
          'اطلع على أحدث اتجاهات تجربة العملاء.',
        ),
        icon: 'reports',
        time: L('10 min ago', 'منذ ١٠ دقائق'),
        dest: 'reports',
      },
      {
        id: 2,
        title: L('New feedback from Cairo', 'رأي جديد من فرع القاهرة'),
        body: L(
          'A customer shared their experience with your Cairo branch.',
          'شارك أحد العملاء تجربته مع فرع القاهرة.',
        ),
        icon: 'feedbacks',
        time: L('35 min ago', 'منذ ٣٥ دقيقة'),
        dest: 'feedbacks',
      },
      {
        id: 3,
        title: L('Welcome to NUVIA', 'مرحبًا بك في NUVIA'),
        body: L(
          'Your workspace is ready. Start with your first survey.',
          'مساحة عملك جاهزة. ابدأ باستبيانك الأول.',
        ),
        icon: 'assistant',
        time: L('Yesterday', 'أمس'),
        dest: 'surveys',
      },
    ];
    const visible = sample
      ? notes.filter((n) => notificationTab !== 'Unread' || !read.includes(n.id))
      : [];
    content = (
      <>
        {heading(
          'Notifications',
          L('Your workspace updates, all in one place.', 'تحديثات مساحة عملك في مكان واحد.'),
          btn('Notification preferences', () => go('settings-notifications'), false, 'settings'),
        )}
        <section className="card table-card">
          <div className="table-tools">
            <nav className="segmented">
              {['All', 'Unread'].map((s) => (
                <button
                  className={notificationTab === s ? 'selected' : ''}
                  key={s}
                  onClick={() => setNotificationTab(s)}
                >
                  {t(s)}
                  {s === 'Unread' && sample && <span>{3 - read.length}</span>}
                </button>
              ))}
            </nav>
            <button
              className="text-link"
              disabled={!sample || read.length === 3}
              onClick={() => setRead([1, 2, 3])}
            >
              {t('Mark all as read')}
            </button>
          </div>
          {visible.length ? (
            visible.map((n) => (
              <button
                className={'notification-item ' + (!read.includes(n.id) ? 'unread' : '')}
                key={n.id}
                onClick={() => {
                  setRead((prev) => [...new Set([...prev, n.id])]);
                  go(n.dest);
                }}
              >
                <span className="tile">
                  <I name={n.icon} />
                </span>
                <div>
                  <strong>{n.title}</strong>
                  <p>{n.body}</p>
                  <small>{n.time}</small>
                </div>
                {!read.includes(n.id) && <i />}
              </button>
            ))
          ) : (
            <Empty
              icon="notifications"
              title={t(sample ? 'All caught up' : 'No notifications yet')}
              description={L(
                'Workspace updates, reports and important alerts will appear here.',
                'ستظهر تحديثات مساحة عملك والتقارير والتنبيهات المهمة هنا.',
              )}
              action={btn('Notification preferences', () => go('settings-notifications'))}
            />
          )}
        </section>
      </>
    );
  }
  return content;
}
