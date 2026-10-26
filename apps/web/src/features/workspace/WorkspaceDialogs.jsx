import { I } from './WorkspacePrimitives.jsx';
import { navigation, tabs } from './workspace-data.js';

export default function WorkspaceDialogs({ model }) {
  const {
    L,
    preview,
    archiveConnectedBranch,
    btn,
    go,
    modal,
    notify,
    query,
    setArchive,
    setBranches,
    setDraft,
    setModal,
    setQuery,
    setSessions,
    t,
  } = model;
  return (
    modal && (
      <div
        className="modal-backdrop"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) setModal(null);
        }}
      >
        <section
          className={'modal ' + (modal.type === 'archive' ? 'archive-dialog' : '')}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <button
            className="icon-button modal-close"
            aria-label="Close dialog"
            onClick={() => setModal(null)}
          >
            <I name="close" />
          </button>
          {modal.type === 'archive' ? (
            <>
              <span className="tile">
                <I name="archive" />
              </span>
              <h2 id="modal-title">
                {L('Archive ' + modal.branch.name + '?', 'أرشفة ' + modal.branch.name + '؟')}
              </h2>
              <p>
                {L(
                  'This branch has closed. Archiving keeps it out of active lists; it does not delete the branch or its history.',
                  'الأرشفة تخفي الفرع من القوائم النشطة ولا تحذف الفرع أو سجله.',
                )}
              </p>
              <div className="subtle-strip">
                <strong>{t('History retained')}</strong>
                <p>
                  {modal.branch.responses} {L('earlier responses retained', 'ردود سابقة محفوظة')}
                </p>
                <p>
                  {L(
                    'Past scores and analytics remain accessible.',
                    'الدرجات والتحليلات السابقة تبقى متاحة.',
                  )}
                </p>
              </div>
              <div className="modal-actions">
                {btn('Cancel', () => setModal(null))}
                {btn(
                  'Archive branch',
                  () => {
                    if (!preview) {
                      archiveConnectedBranch(modal.branch);
                      return;
                    }
                    setBranches((prev) =>
                      prev.map((b) => (b.id === modal.branch.id ? { ...b, archived: true } : b)),
                    );
                    setArchive(true);
                    setModal(null);
                    notify(
                      L(
                        'Branch archived. Its history is retained.',
                        'تمت أرشفة الفرع مع الاحتفاظ بالسجل.',
                      ),
                    );
                  },
                  true,
                  'archive',
                )}
              </div>
            </>
          ) : modal.type === 'discard' ? (
            <>
              <h2 id="modal-title">
                {L('Discard unsaved changes?', 'تجاهل التغييرات غير المحفوظة؟')}
              </h2>
              <p>{L('Your changes have not been saved.', 'لم يتم حفظ التغييرات.')}</p>
              <div className="modal-actions">
                {btn('Keep editing', () => setModal(null))}
                {btn(
                  'Discard changes',
                  () => {
                    setDraft({});
                    go(modal.to);
                    setModal(null);
                  },
                  true,
                )}
              </div>
            </>
          ) : modal.type === 'search' ? (
            <>
              <h2 id="modal-title">{t('Search your workspace')}</h2>
              <label className="search">
                <I name="search" />
                <input
                  placeholder={t('Search')}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <div className="search-results">
                {[
                  ...navigation,
                  ...tabs,
                  ['Notifications', 'notifications'],
                  ['Branches', 'branches'],
                  ['Subscription', 'subscription'],
                ]
                  .filter(([label]) =>
                    `${label} ${t(label)}`.toLowerCase().includes(query.toLowerCase()),
                  )
                  .map(([label, dest]) => (
                    <button
                      key={dest}
                      onClick={() => {
                        setModal(null);
                        go(dest);
                      }}
                    >
                      {t(label)} <span>→</span>
                    </button>
                  ))}
              </div>
            </>
          ) : modal.type === 'filters' ? (
            <>
              <h2 id="modal-title">{L('Filter your workspace', 'تصفية مساحة العمل')}</h2>
              <p>
                {L(
                  'No data is available to filter yet. Once responses arrive, date and language filters will help you explore them.',
                  'لا توجد بيانات للتصفية بعد. عند وصول الردود يمكنك استكشافها حسب التاريخ واللغة.',
                )}
              </p>
              <div className="modal-actions">
                {btn(L('Done', 'تم'), () => setModal(null), true)}
              </div>
            </>
          ) : (
            <>
              <span className="tile">
                <I name="logout" />
              </span>
              <h2 id="modal-title">
                {t(modal.type === 'sessions' ? 'Sign out of all devices' : 'Sign out')}
              </h2>
              <p>
                {L(
                  'This action is simulated in the preview. Your real account and workspace data are not affected.',
                  'هذا الإجراء محاكاة داخل المعاينة. حسابك الحقيقي وبياناتك لن تتأثر.',
                )}
              </p>
              <div className="modal-actions">
                {btn('Cancel', () => setModal(null))}
                {btn(
                  'Sign out',
                  () => {
                    if (modal.type === 'session')
                      setSessions((prev) => prev.filter((id) => id !== modal.id));
                    else if (modal.type === 'sessions') setSessions([]);
                    setModal(null);
                    notify(L('Sign-out simulated in preview.', 'تمت محاكاة تسجيل الخروج.'));
                  },
                  true,
                )}
              </div>
            </>
          )}
        </section>
      </div>
    )
  );
}
