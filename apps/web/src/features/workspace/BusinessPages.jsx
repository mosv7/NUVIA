import UiArrow from '../../components/ui/UiArrow.jsx';
import { I, Metric, PreviewSelect } from './WorkspacePrimitives.jsx';

export default function renderBusinessPages(model) {
  const {
    L,
    preview,
    saveConnectedBusiness,
    saveConnectedBranch,
    account,
    actions,
    active,
    ar,
    archive,
    biz,
    branches,
    btn,
    businessTabs,
    draft,
    editBiz,
    editBranch,
    field,
    go,
    heading,
    historyDateOpen,
    historyEnd,
    historyStart,
    historySurvey,
    note,
    notify,
    old,
    page,
    query,
    row,
    setArchive,
    setBiz,
    setBranches,
    setDraft,
    setHistoryDateOpen,
    setHistoryEnd,
    setHistoryStart,
    setHistorySurvey,
    setModal,
    setOtherBusinesses,
    setQuery,
    setRow,
    setSample,
    t,
    validate,
  } = model;
  let content;
  if (page === 'business')
    content = (
      <>
        {heading(
          'Business profile',
          L(
            'View and manage the business information behind your workspace.',
            'اعرض وأدر بيانات النشاط المرتبط بمساحة عملك.',
          ),
          btn('Edit profile', editBiz, true, 'edit'),
        )}
        {businessTabs}
        <section className="card identity-card">
          <span className="business-avatar">{Array.from(biz.name)[0] || ''}</span>
          <div>
            <h2>{biz.name}</h2>
            {preview && <p>Café · Egypt</p>}
          </div>
          <span className="badge neutral">{biz.industry}</span>
        </section>
        <section className="side-note profile-guidance">
          <I name="info-large" />
          <h3>{L('Business information, in one place', 'بيانات نشاطك في مكان واحد')}</h3>
          <p>
            {L(
              'Keep your business identity here. Branch locations are managed in Branches, and plan details in Subscription.',
              'احتفظ بهوية نشاطك هنا. أدر مواقع الفروع من الفروع وتفاصيل الباقات من الاشتراك.',
            )}
          </p>
        </section>
        <div className="two-col business-profile-grid">
          <section className="card">
            <h2>{t('Business information')}</h2>
            <p className="muted">
              {L(
                'The details used to personalize your workspace.',
                'البيانات المستخدمة لتخصيص مساحة عملك.',
              )}
            </p>
            <div className="business-field-pair">
              <div className="profile-detail">
                <span>{t('Business name')}</span>
                <strong>{biz.name}</strong>
                <small>{L('The name of your business in NUVIA.', 'اسم نشاطك في NUVIA.')}</small>
              </div>
              <div className="profile-detail">
                <span>{t('Business type / Industry')}</span>
                <strong>{biz.industry}</strong>
                <small>
                  {L(
                    'Helps us recommend relevant survey templates.',
                    'يساعدنا في اقتراح قوالب استبيانات مناسبة.',
                  )}
                </small>
              </div>
            </div>
            <div className="business-status">
              <I name="building" />
              <small>
                {L(
                  'Business identity · Editable from Edit profile',
                  'هوية النشاط · قابلة للتعديل من تعديل الملف',
                )}
              </small>
            </div>
          </section>
          <div className="guidance-stack">
            <section className="card workspace-context">
              <h2>{t('Your workspace')}</h2>
              <span className="muted small-label">{t('Workspace owner')}</span>
              <div className="owner-line">
                <span className="avatar small">
                  {account.name
                    .split(/\s+/)
                    .map((part) => Array.from(part)[0])
                    .slice(0, 2)
                    .join('')}
                </span>
                <strong>{account.name}</strong>
              </div>
              <div className="branch-count">
                <span>{t('Active branches')}</span>
                <b>{active.length}</b>
              </div>
              <small>{active.map((b) => b.name).join(' · ')}</small>
              <button
                className="text-link action-arrow business-branches-link"
                onClick={() => go('branches')}
              >
                {L('View branches', 'عرض الفروع')}
                <UiArrow rtl={ar} />
              </button>
            </section>
          </div>
        </div>
      </>
    );
  else if (page === 'business-edit')
    content = (
      <>
        {heading(
          L('Edit business profile', 'تعديل ملف النشاط'),
          L(
            'Update the business information used in your workspace.',
            'حدّث بيانات نشاطك في مساحة العمل.',
          ),
          null,
          ['Business profile', 'business'],
        )}
        {businessTabs}
        <div className="edit-layout">
          <form className="card" onSubmit={(e) => e.preventDefault()}>
            <h2>{t('Business information')}</h2>
            <p>{t('Fields marked * are required.')}</p>
            {field('Business name', 'name', { required: true })}
            {field('Business type / Industry', 'industry', { required: true })}
            {actions(() => {
              if (validate(['name', 'industry'])) {
                if (!preview) {
                  saveConnectedBusiness();
                  return;
                }
                setBiz({ ...draft });
                setSample(true);
                notify('Changes saved');
                go('business');
              }
            }, 'business')}
          </form>
          {note(
            L('Make it your business', 'مساحة تعبر عن نشاطك'),
            L(
              'Your business name and industry help make your NUVIA workspace feel relevant to you.',
              'اسم النشاط ومجاله يساعدان في تخصيص مساحة عملك.',
            ),
          )}
        </div>
      </>
    );
  else if (page === 'branches')
    content = (
      <>
        {heading(
          'Branches',
          L(
            'Manage your locations and explore the experience behind each branch.',
            'أدر مواقعك وتعرف على تجربة العملاء في كل فرع.',
          ),
          btn('Add branch', () => editBranch(), true, 'plus'),
        )}
        {businessTabs}
        <div className="metrics">
          <Metric
            title={t('Active branches')}
            value={active.length}
            detail={active.map((b) => b.name).join(' · ')}
          />
          <Metric
            title={t('Responses')}
            value={branches.reduce((n, b) => n + b.responses, 0).toLocaleString()}
            detail={L('Across all branches · selected period', 'كل الفروع · الفترة المحددة')}
          />
          <Metric title={t('Business owner')} value={account.name} detail={biz.name} />
        </div>
        <section className="card table-card">
          <div className="table-tools">
            <div className="segmented">
              {[false, true].map((v) => (
                <button
                  key={String(v)}
                  className={archive === v ? 'selected' : ''}
                  onClick={() => setArchive(v)}
                >
                  {t(v ? 'Archived' : 'Active branches')}{' '}
                  <span>{v ? old.length : active.length}</span>
                </button>
              ))}
            </div>
            <label className="search">
              <I name="search" size={18} />
              <input
                aria-label={t('Search branches')}
                placeholder={t('Search branches')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </div>
          <div className="table-head">
            {['Branch name', 'Location', 'Responses', 'Status', 'Actions'].map((s) => (
              <span key={s}>{t(s)}</span>
            ))}
          </div>
          {branches
            .filter(
              (b) =>
                !!b.archived === archive &&
                `${b.name} ${b.city}`.toLowerCase().includes(query.toLowerCase()),
            )
            .map((b) => (
              <div className="branch-row" key={b.id}>
                <strong>
                  <span className="tile">
                    <I name="business" size={18} />
                  </span>
                  {b.name}
                </strong>
                <span>
                  {b.city} · {b.country}
                </span>
                <span>
                  {b.responses.toLocaleString()}{' '}
                  <small className="mobile-only">{t('Responses')}</small>
                </span>
                <span>
                  <span className={'badge ' + (b.archived ? 'neutral' : 'green')}>
                    {t(b.archived ? 'Archived' : 'Active')}
                  </span>
                </span>
                <div className="row-actions">
                  <button
                    className="text-link action-arrow"
                    onClick={() => {
                      setDraft({ ...b });
                      go('branch-history');
                    }}
                  >
                    {t(b.archived ? 'View past analytics' : 'View Analytics')}
                    <UiArrow rtl={ar} />
                  </button>
                  <div className="row-menu-wrap">
                    <button
                      className="icon-button"
                      aria-label={t('Actions') + ' ' + b.name}
                      aria-expanded={row === b.id}
                      onClick={() => setRow(row === b.id ? null : b.id)}
                    >
                      <I name="more" />
                    </button>
                    {row === b.id && (
                      <div className="dropdown row-menu">
                        {!b.archived ? (
                          <>
                            <button onClick={() => editBranch(b)}>{t('Edit')}</button>
                            <button
                              onClick={() => {
                                setRow(null);
                                setModal({ type: 'archive', branch: b });
                              }}
                            >
                              {t('Archive branch')}
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setDraft({ ...b });
                              go('branch-history');
                            }}
                          >
                            {t('View past analytics')}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          {!branches.some(
            (b) =>
              !!b.archived === archive &&
              `${b.name} ${b.city}`.toLowerCase().includes(query.toLowerCase()),
          ) && (
            <div className="table-empty">
              <I name="business" size={34} />
              <h3>
                {query
                  ? L('No matching branches', 'لا توجد فروع مطابقة')
                  : L('No archived branches', 'لا توجد فروع مؤرشفة')}
              </h3>
              <p>
                {L(
                  'Try another search or check your active branches.',
                  'جرّب البحث باسم آخر أو اعرض الفروع النشطة.',
                )}
              </p>
            </div>
          )}
          <div className="table-footer">
            {branches.filter((b) => !!b.archived === archive).length}{' '}
            {t(archive ? 'Archived' : 'Active branches')}
          </div>
        </section>
        <div className="info-strip">
          <I name="archive" />
          <div>
            <strong>
              {L('Closed a location? Keep its history.', 'أغلقت أحد الفروع؟ احتفظ بسجله.')}
            </strong>
            <p>
              {L(
                'Archiving removes a branch from active lists without deleting earlier responses or scores.',
                'الأرشفة تخفي الفرع من القوائم النشطة ولا تحذف الردود والدرجات السابقة.',
              )}
            </p>
          </div>
        </div>
      </>
    );
  else if (page === 'business-add')
    content = (
      <>
        {heading(
          L('Add business', 'إضافة نشاط'),
          L('Create a separate business for your workspace.', 'أضف نشاطًا مستقلاً إلى مساحة عملك.'),
          null,
          ['Business profile', 'business'],
        )}
        <div className="edit-layout">
          <form className="card" onSubmit={(e) => e.preventDefault()}>
            <h2>{t('Business information')}</h2>
            <p>{t('Fields marked * are required.')}</p>
            {field('Business name', 'name', { required: true })}
            {field('Business type / Industry', 'industry', { required: true })}
            {actions(
              () => {
                if (!validate(['name', 'industry'])) return;
                notify(L('Business created in this preview.', 'تم إنشاء النشاط في هذه المعاينة.'));
                setOtherBusinesses((prev) => [...prev, { ...biz, branches: [...branches] }]);
                setBiz({ name: draft.name, industry: draft.industry });
                setBranches([]);
                setSample(true);
                go('business');
              },
              'business',
              L('Create business', 'إنشاء نشاط'),
            )}
          </form>
          {note(
            L('A separate business', 'نشاط مستقل'),
            L(
              'Each business has its own profile and branches. Adding one does not change the existing business.',
              'لكل نشاط ملفه وفروعه. إضافة نشاط لا تعدّل بيانات النشاط الحالي.',
            ),
          )}
        </div>
      </>
    );
  else if (['branch-add', 'branch-edit'].includes(page))
    content = (
      <>
        {heading(
          page === 'branch-add' ? 'Add branch' : 'Edit branch',
          L(
            'Keep responses organized by location. Existing history stays connected.',
            'نظّم الردود حسب الموقع مع الاحتفاظ بالسجل السابق.',
          ),
          null,
          ['Back to branches', 'branches'],
        )}
        <div className="edit-layout">
          <form className="card" onSubmit={(e) => e.preventDefault()}>
            <h2>{t('Branch information')}</h2>
            <p>{t('Fields marked * are required.')}</p>
            {field('Branch name', 'name', { required: true })}
            <h3>{t('Location')}</h3>
            <div className="field-grid">
              {field('Country', 'country', { required: true })}
              {field('City', 'city', { required: true })}
            </div>
            {field('Street address', 'address', { required: true })}
            {actions(
              () => {
                if (!validate(['name', 'country', 'city', 'address'])) return;
                if (!preview) {
                  saveConnectedBranch();
                  return;
                }
                setBranches((prev) =>
                  page === 'branch-add'
                    ? [...prev, { ...draft, id: Date.now(), responses: 0 }]
                    : prev.map((b) => (b.id === draft.id ? { ...b, ...draft } : b)),
                );
                notify('Changes saved');
                setArchive(false);
                go('branches');
              },
              'branches',
              'Save branch',
            )}
          </form>
          {note(
            L('Keep your context', 'احتفظ بسياق نشاطك'),
            L(
              'Changes update branch information. Existing responses and historical scores stay associated with the branch.',
              'التعديلات تحدث بيانات الفرع. تظل الردود والدرجات السابقة مرتبطة به.',
            ),
          )}
        </div>
      </>
    );
  else if (page === 'branch-history')
    content = (
      <>
        {heading(
          draft.name || t('Branch information'),
          L(
            'Branch information and preserved historical analytics.',
            'بيانات الفرع والتحليلات السابقة المحفوظة.',
          ),
          null,
          ['Back to branches', 'branches'],
        )}
        {draft.archived && (
          <div className="info-strip">
            <I name="archive" />
            <div>
              <strong>
                {t('Archived')} · {t('History retained')}
              </strong>
              <p>
                {L(
                  'Hidden from active lists. Earlier responses and scores remain available.',
                  'مخفي من القوائم النشطة مع بقاء الردود والدرجات السابقة.',
                )}
              </p>
            </div>
          </div>
        )}
        <div className="history-controls">
          <div className="history-date-wrap">
            <button
              className="button"
              onClick={() => setHistoryDateOpen(!historyDateOpen)}
              aria-expanded={historyDateOpen}
            >
              <img
                className="figma-icon"
                src="/assets/dashboard/overview/calendar-days.svg"
                alt=""
              />
              {historyStart === '2026-09-12' && historyEnd === '2026-10-09'
                ? '12 Sep – 9 Oct, 2026'
                : historyStart + ' – ' + historyEnd}
            </button>
            {historyDateOpen && (
              <section className="history-date-popover card">
                <label>
                  {L('From', 'من')}
                  <input
                    type="date"
                    value={historyStart}
                    max={historyEnd}
                    onChange={(e) => setHistoryStart(e.target.value)}
                  />
                </label>
                <label>
                  {L('To', 'إلى')}
                  <input
                    type="date"
                    value={historyEnd}
                    min={historyStart}
                    onChange={(e) => setHistoryEnd(e.target.value)}
                  />
                </label>
                <button className="button primary" onClick={() => setHistoryDateOpen(false)}>
                  {L('Apply', 'تطبيق')}
                </button>
              </section>
            )}
          </div>
          <label className="field history-survey">
            <span className="sr-only">{L('Survey', 'الاستبيان')}</span>
            <PreviewSelect
              label={L('Survey', 'الاستبيان')}
              value={historySurvey}
              values={['Customer experience survey']}
              onChange={setHistorySurvey}
            />
          </label>
        </div>
        <div className="metrics">
          <Metric title={t('Responses')} value={draft.responses} detail="12 Sep–9 Oct 2026" />
          <Metric
            title={L('Positive sentiment', 'المشاعر الإيجابية')}
            value={draft.responses ? '77.9%' : '—'}
          />
          <Metric
            title={L('Speed score', 'تقييم السرعة')}
            value={draft.responses ? '6.0 / 10' : '—'}
          />
        </div>
        <div className="two-col">
          <section className="card">
            <h2>{L('Historical aspect scores', 'درجات الجوانب السابقة')}</h2>
            {draft.responses ? (
              [
                ['Service', 'الخدمة', 8.3],
                ['Price', 'السعر', 6.6],
                ['Speed', 'السرعة', 6],
                ['Cleanliness', 'النظافة', 8.7],
                ['Product quality', 'جودة المنتج', 8.7],
              ].map(([en, arabic, n]) => (
                <div className="score" key={en}>
                  <span>{L(en, arabic)}</span>
                  <div>
                    <span style={{ width: n * 10 + '%' }} />
                  </div>
                  <strong>{n}</strong>
                </div>
              ))
            ) : (
              <p>
                {L('Scores appear after feedback is received.', 'تظهر الدرجات بعد وصول الردود.')}
              </p>
            )}
          </section>
          <section className="card">
            <h2>{t('Branch information')}</h2>
            <dl>
              <dt>{t('Branch name')}</dt>
              <dd>{draft.name}</dd>
              <dt>{t('Location')}</dt>
              <dd>
                {draft.address}, {draft.city}, {draft.country}
              </dd>
              <dt>{t('Business')}</dt>
              <dd>{biz.name}</dd>
            </dl>
          </section>
        </div>
      </>
    );
  return content;
}
