import { useRouteState } from '../../../components/layout/navigation.js';
import { surveyBranches, matchesSurveyFilters } from './survey-branch-filter.js';
import Results from './Results.jsx';
import PreviewRating from './PreviewRating.jsx';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { ProductProvider } from '../../../app/providers/ProductProvider.jsx';
import FeedbackShell from '../../../components/layout/WorkspaceShell.jsx';
import { useWorkspaceScale } from '../../../hooks/useWorkspaceScale.js';
import All from './all.jsx';
import Empty from './empty.jsx';
import Live from './live.jsx';
import Drafts from './drafts.jsx';
import Paused from './paused.jsx';
import Closed from './closed.jsx';
import Create from './create.jsx';
import Questions from './questions.jsx';
import Choices from './choices.jsx';
import Edit from './edit.jsx';
import Share from './share.jsx';
import AI from './ai.jsx';
import AIReview from './ai-review.jsx';
import arabic from '../../../lib/i18n/product-ar.json';
import {
  editorStorageKey,
  createStartingQuestions,
  loadEditorQuestions,
  loadEditorLanguages,
  updateEditorQuestion,
  addEditorQuestion,
  copyEditorQuestion,
  removeEditorQuestion,
} from './survey-editor.js';
import { SurveySelectionContext, SurveyEditorContext } from './SurveyPrimitives.jsx';
import './figma-surveys.css';
import './surveys.css';
const screens = {
  results: Results,
  all: All,
  empty: Empty,
  live: Live,
  drafts: Drafts,
  paused: Paused,
  closed: Closed,
  create: Create,
  questions: Questions,
  choices: Choices,
  edit: Edit,
  share: Share,
  ai: AI,
  'ai-review': AIReview,
};
const go = (route) => {
  location.hash = '/survey-' + route;
};
const download = (name, text, type = 'text/plain') => {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
export default function SurveyPage({ page, language, setLanguage }) {
  useWorkspaceScale();
  const kind = page.replace('survey-', '');
  const Screen = screens[kind] || All;
  const [branchFilter, setBranchFilter] = useRouteState('survey-branches', () =>
    surveyBranches.map((branch) => branch.id),
  );
  const [branchDraft, setBranchDraft] = useState(() => surveyBranches.map((branch) => branch.id));
  const [totalRows, setTotalRows] = useState(0);
  const [menu, setMenu] = useState(false),
    [notice, setNotice] = useState(''),
    [preview, setPreview] = useState(false),
    [filter, setFilter] = useRouteState('survey-search', ''),
    [question, setQuestion] = useState(kind === 'choices' ? 2 : 1),
    [selected, setSelected] = useState(new Set()),
    [visibleIds, setVisibleIds] = useState([]),
    [editorQuestions, setEditorQuestions] = useState(() => loadEditorQuestions(localStorage)),
    [enabledLanguages, setEnabledLanguages] = useState(() => loadEditorLanguages(localStorage)),
    [editorView, setEditorView] = useState(
      () =>
        localStorage.getItem('survey-editor-view') ||
        localStorage.getItem('survey-editor-language') ||
        'en',
    ),
    [editorLanguage, setEditorLanguage] = useState(() => {
      const enabled = loadEditorLanguages(localStorage);
      const saved = localStorage.getItem('survey-editor-language');
      return enabled.includes(saved) ? saved : enabled[0];
    });
  const tr = useCallback((t) => (language === 'ar' ? (arabic[t] ?? t) : t), [language]);
  const [startingPoint, setStartingPoint] = useState(
    () => localStorage.getItem('nuvia-survey-starting-point') || 'customer',
  );
  const editStorageKey = 'nuvia-survey-edit-template-v1';
  const [editQuestions, setEditQuestions] = useState(() =>
    loadEditorQuestions({
      getItem: (key) => (key === editorStorageKey ? localStorage.getItem(editStorageKey) : null),
      length: 0,
    }),
  );
  const activeQuestions = kind === 'edit' ? editQuestions : editorQuestions,
    setActiveQuestions = kind === 'edit' ? setEditQuestions : setEditorQuestions,
    activeStorageKey = kind === 'edit' ? editStorageKey : editorStorageKey;
  const activeQuestion =
    kind === 'choices' && activeQuestions[2]
      ? 2
      : activeQuestions[question]
        ? question
        : Number(Object.keys(activeQuestions)[0]) || 1;
  const pendingAddedQuestion = useRef(null);
  const updateQuestion = (id, patch) =>
    setActiveQuestions((previous) => {
      const next = updateEditorQuestion(previous, id, patch);
      localStorage.setItem(activeStorageKey, JSON.stringify(next));
      return next;
    });
  const changeEditorLanguage = (value) => {
    if (value === 'both' && enabledLanguages.length === 2) {
      setEditorView('both');
      setEditorLanguage('en');
      localStorage.setItem('survey-editor-view', 'both');
      localStorage.setItem('survey-editor-language', 'en');
    } else if (enabledLanguages.includes(value)) {
      setEditorView(value);
      setEditorLanguage(value);
      localStorage.setItem('survey-editor-view', value);
      localStorage.setItem('survey-editor-language', value);
    }
  };
  useEffect(() => {
    const saved = sessionStorage.getItem('survey-after-save');
    setNotice(saved ? tr(saved) : '');
    sessionStorage.removeItem('survey-after-save');
    setSelected(new Set());
    if (!['questions', 'choices', 'edit'].includes(kind)) window.scrollTo(0, 0);
    if (saved) setTimeout(() => setNotice(''), 3500);
  }, [page, kind, tr]);
  useEffect(() => {
    const id = pendingAddedQuestion.current;
    if (id !== activeQuestion) return;
    const card = document.querySelector(
      '.surveys-content [data-name="Selected question"][data-question-id="' + id + '"]',
    );
    if (card) {
      pendingAddedQuestion.current = null;
      requestAnimationFrame(() => {
        card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        card.querySelector('input')?.focus({ preventScroll: true });
      });
    }
  }, [question, page, activeQuestion]);
  const message = (t) => {
    setNotice(tr(t));
    setTimeout(() => setNotice(''), 3500);
  };
  useEffect(() => {
    let timer;
    const notice = (e) => {
      setNotice(e.detail);
      clearTimeout(timer);
      timer = setTimeout(() => setNotice(''), 3500);
    };
    const refresh = () => {
      const rows = [...document.querySelectorAll('.surveys-content [data-name="Survey row"]')];
      const labels = {
        all: tr('All 3 branches'),
        ...Object.fromEntries(surveyBranches.map((branch) => [branch.id, tr(branch.label)])),
      };
      rows.forEach((row) => {
        row.hidden = !matchesSurveyFilters({
          text: row.textContent,
          query: filter,
          scope: row.querySelector('.sv125')?.textContent,
          selectedBranches: branchFilter,
          labels,
        });
      });
      setTotalRows(rows.length);
      const searchInput = document.querySelector('.surveys-content .survey-search-input');
      if (searchInput && searchInput.value !== filter) searchInput.value = filter;
      const branchButton = document.querySelector(
        '.surveys-content [data-survey-action="All 3 branches"]',
      );
      const branchText = branchButton?.querySelector('p');
      if (branchText)
        branchText.textContent =
          branchFilter.length === 3
            ? tr('All 3 branches')
            : branchFilter.length === 1
              ? tr(surveyBranches.find((branch) => branch.id === branchFilter[0]).label)
              : language === 'ar'
                ? branchFilter.length + ' فروع'
                : branchFilter.length + ' branches';
      branchButton?.setAttribute('aria-pressed', String(branchFilter.length < 3));
      const shown = rows.filter((row) => !row.hidden);
      setVisibleIds(
        shown.flatMap((row) =>
          [...row.querySelectorAll('input[data-name="Select survey"]')].map(
            (input) => input.dataset.nodeId,
          ),
        ),
      );
      const summary = document.querySelector('.surveys-content [data-name="Pagination"]>p');
      if (summary)
        summary.textContent =
          language === 'ar'
            ? `عرض ${shown.length ? 1 : 0}–${shown.length} من ${rows.length} استبيانات`
            : `Showing ${shown.length ? 1 : 0}–${shown.length} of ${rows.length} surveys`;
    };
    window.addEventListener('survey-list-notice', notice);
    window.addEventListener('survey-list-change', refresh);
    refresh();
    return () => {
      window.removeEventListener('survey-list-notice', notice);
      window.removeEventListener('survey-list-change', refresh);
      clearTimeout(timer);
    };
  }, [page, language, filter, branchFilter, tr]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText('https://nuvia.link/bloom-feedback');
      message('Link copied');
    } catch {
      message('Copy the link shown in the survey link field');
    }
  };
  const click = (e) => {
    const button = e.target.closest(
      '[data-survey-action], [data-name="Template option"], [data-name="Generate action"]',
    );
    if (!button) return;
    const label = (button.dataset.surveyAction || button.textContent).replace(/\s+/g, ' ').trim();
    const name = button.dataset.name;
    if (label === 'question-copy' || label === 'question-delete') {
      if (label === 'question-delete' && Object.keys(activeQuestions).length === 1) {
        message('Keep at least one question');
        return;
      }
      const result =
        label === 'question-copy'
          ? copyEditorQuestion(activeQuestions, activeQuestion)
          : removeEditorQuestion(activeQuestions, activeQuestion);
      pendingAddedQuestion.current = result.id;
      setActiveQuestions(result.questions);
      localStorage.setItem(activeStorageKey, JSON.stringify(result.questions));
      setQuestion(result.id);
      if (kind !== 'edit') go('questions');
      message(label === 'question-copy' ? 'Question copied' : 'Question deleted');
      return;
    }
    if (name === 'Status tab') {
      const target = /Live/.test(label)
        ? 'live'
        : /Draft/.test(label)
          ? 'drafts'
          : /Paused/.test(label)
            ? 'paused'
            : /Closed/.test(label)
              ? 'closed'
              : 'all';
      go(target);
      return;
    }
    if (name === 'Workflow step') {
      go(
        /Survey details/.test(label)
          ? 'create'
          : /Build questions/.test(label)
            ? 'questions'
            : 'share',
      );
      return;
    }
    if (name === 'Back to surveys' || /^(All surveys|Back to Surveys|Done, back)/i.test(label)) {
      go('all');
      return;
    }
    if (/Generate Questions/.test(label) || name === 'Generate action') {
      go('ai-review');
      return;
    }
    if (/Regenerate/.test(label)) {
      go('ai');
      return;
    }
    if (/Generate with|NUVIA AI/.test(label)) {
      sessionStorage.setItem(
        'survey-ai-append',
        String(['questions', 'choices', 'edit'].includes(kind)),
      );
      go('ai');
      return;
    }
    if (/Create survey/.test(label)) {
      go('create');
      return;
    }
    if (label === 'Cancel') {
      go(kind === 'ai-review' ? 'ai' : 'all');
      return;
    }
    if (label === 'Edit question') {
      const question = button.closest('[data-name="Proposed question"]');
      const text = question?.querySelector('[data-name="Question content"]>p');
      if (text) {
        text.contentEditable = 'true';
        text.setAttribute('role', 'textbox');
        text.focus();
        message('Edit the question text');
      }
      return;
    }
    if (label === 'add-selected-questions') {
      const rows = [...document.querySelectorAll('[data-name="Proposed question"]')].filter(
        (row) =>
          row.querySelector('[data-name="Question selection"]')?.getAttribute('aria-pressed') ===
          'true',
      );
      if (!rows.length) return;
      let next = {},
        firstId;
      for (const row of rows) {
        const added = addEditorQuestion(next);
        firstId ??= added.id;
        const text =
          row.querySelector('[data-name="Question content"]>p')?.textContent.trim() || '';
        const metadata = row.querySelector('[data-name="Question metadata"]')?.textContent || '';
        const type = /Open text|نص مفتوح/.test(metadata)
          ? 'Long text'
          : /Multiple|choice|اختيار/.test(metadata)
            ? 'Multiple choice'
            : 'Star rating';
        next = updateEditorQuestion(added.questions, added.id, {
          text: { en: language === 'en' ? text : '', ar: language === 'ar' ? text : '' },
          type,
        });
      }
      setActiveQuestions(next);
      localStorage.setItem(activeStorageKey, JSON.stringify(next));
      setQuestion(firstId);
      pendingAddedQuestion.current = firstId;
      go('questions');
      return;
    }
    if (name === 'Template option') {
      const choice = /Quick satisfaction/.test(label)
        ? 'quick'
        : /Start from scratch/.test(label)
          ? 'scratch'
          : 'customer';
      const next = createStartingQuestions(choice);
      setStartingPoint(choice);
      localStorage.setItem('nuvia-survey-starting-point', choice);
      setEditorQuestions(next);
      localStorage.setItem(editorStorageKey, JSON.stringify(next));
      setQuestion(1);
      go('questions');
      return;
    }
    if (/Browser templates/.test(label)) {
      go('create');
      return;
    }
    if (/Continue to questions/.test(label)) {
      go('questions');
      return;
    }
    if (/Continue to sharing|^Share$|^QR code$/.test(label)) {
      go('share');
      return;
    }
    if (/Continue editing|^Edit survey$/.test(label)) {
      go('edit');
      return;
    }
    if (/Save as draft|Save & close/.test(label)) {
      const fields = [
        ...document.querySelectorAll('.surveys-content input,.surveys-content textarea'),
      ].map((field) => ({
        id: field.closest('[data-node-id]')?.dataset.nodeId,
        value: field.value,
        checked: field.checked,
      }));
      localStorage.setItem(
        'survey-preview-draft',
        JSON.stringify({
          fields,
          questions: activeQuestions,
          enabledLanguages,
          savedAt: Date.now(),
        }),
      );
      message('Draft saved');
      if (/Save & close/.test(label)) {
        button.disabled = true;
        setTimeout(() => {
          sessionStorage.setItem('survey-after-save', 'Draft saved');
          go('drafts');
        }, 800);
      }
      return;
    }
    if (/Save changes|Publish changes/.test(label)) {
      message('Changes saved locally');
      return;
    }
    if (/Open survey|^Preview$/.test(label)) {
      setPreview(true);
      return;
    }
    if (/Copy|WhatsApp|Email/.test(label)) {
      copy();
      return;
    }
    if (label === 'Export') {
      download(
        'surveys.csv',
        'Survey,Status,Responses\nCustomer experience survey,Live,1248\nQuick visit feedback,Live,286\n',
        'text/csv',
      );
      return;
    }
    if (/Edit survey details/.test(label)) {
      go('create');
      return;
    }
    if (/Share your live survey/.test(label)) {
      go('share');
      return;
    }
    if (/Edit business type/.test(label)) {
      go('ai');
      return;
    }
    if (/View responses/.test(label)) {
      location.hash = '/feedbacks';
      return;
    }
    if (/Download all branch/.test(label)) {
      setPreview('branches');
      return;
    }
    if (/View results/.test(label)) {
      const row = button.closest('[data-name="Survey row"]');
      location.hash =
        '/feedbacks?survey=' +
        encodeURIComponent(row?.dataset.surveyName || 'Coffee & service check-in');
      return;
    }
    if (name === 'Question item' || name === 'Question summary') {
      const n = Number(label.match(/^\d+/)?.[0] || 1);
      setQuestion(n);
      if (kind !== 'edit') go(n === 2 ? 'choices' : 'questions');
      return;
    }
    if (name === 'Language option') {
      const value = label === 'English' ? 'en' : 'ar';
      const next = enabledLanguages.includes(value)
        ? enabledLanguages.filter((x) => x !== value)
        : ['en', 'ar'].filter((x) => enabledLanguages.includes(x) || x === value);
      if (!next.length) {
        message('Select at least one language');
        return;
      }
      setEnabledLanguages(next);
      localStorage.setItem('survey-enabled-languages', JSON.stringify(next));
      if (next.length === 1) {
        setEditorView(next[0]);
        localStorage.setItem('survey-editor-view', next[0]);
      }
      if (!next.includes(editorLanguage)) {
        setEditorLanguage(next[0]);
        localStorage.setItem('survey-editor-language', next[0]);
      }
      return;
    }
    if (name === 'Branch option' || name === 'Aspect option' || name === 'Question selection') {
      const selected = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(selected));
      return;
    }
    if (/Add question/.test(label)) {
      const added = addEditorQuestion(activeQuestions);
      pendingAddedQuestion.current = added.id;
      setActiveQuestions(added.questions);
      localStorage.setItem(activeStorageKey, JSON.stringify(added.questions));
      setQuestion(added.id);
      if (kind !== 'edit') go('questions');
      return;
    }
    if (/All 3 branches/.test(label)) {
      setBranchDraft([...branchFilter]);
      setPreview('branch-filter');
      return;
    }
    if (/Last updated/.test(label)) {
      const rows = [...document.querySelectorAll('[data-name="Survey row"]')];
      rows
        .reverse()
        .forEach((row) =>
          row.parentNode.insertBefore(row, document.querySelector('[data-name="Pagination"]')),
        );
      message('Sort order updated');
      return;
    }
  };
  return (
    <ProductProvider
      preview={true}
      language={language}
      setLanguage={setLanguage}
      menuOpen={menu}
      onNavigate={() => setMenu(false)}
    >
      <div className="product-page" data-menu-open={menu}>
        <button
          className="product-mobile-toggle"
          aria-label={tr('Navigation menu')}
          onClick={() => setMenu(!menu)}
        >
          ☰
        </button>
        {menu && (
          <button
            className="product-menu-backdrop"
            aria-label={tr('Close navigation')}
            onClick={() => setMenu(false)}
          />
        )}
        <FeedbackShell title="Surveys">
          <div
            className="surveys-content"
            data-survey-screen={kind}
            data-editor-language={editorLanguage}
            data-editor-view={editorView}
            onClick={click}
            onChange={(e) => {
              if (e.target.matches('.survey-search-input')) setFilter(e.target.value);
            }}
          >
            <SurveyEditorContext.Provider
              value={{
                startingPoint,
                question: activeQuestion,
                language: editorLanguage,
                viewMode: enabledLanguages.length === 1 ? editorLanguage : editorView,
                setLanguage: changeEditorLanguage,
                enabledLanguages,
                questions: activeQuestions,
                updateQuestion,
              }}
            >
              <SurveySelectionContext.Provider value={{ selected, setSelected, visibleIds }}>
                <Screen key={page + '-' + language + '-' + question} question={activeQuestion} />
              </SurveySelectionContext.Provider>
              {totalRows > 0 && visibleIds.length === 0 && (
                <div className="survey-branch-empty" role="status">
                  <p>
                    {language === 'ar'
                      ? 'لا توجد استبيانات تطابق البحث والفروع المختارة.'
                      : 'No surveys match your search and selected branches.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setBranchFilter(surveyBranches.map((branch) => branch.id));
                      setFilter('');
                      const input = document.querySelector('.survey-search-input');
                      if (input) input.value = '';
                    }}
                  >
                    {tr('Reset')}
                  </button>
                </div>
              )}
            </SurveyEditorContext.Provider>
          </div>
        </FeedbackShell>
        {notice && (
          <div className="survey-toast" role="status">
            {notice}
          </div>
        )}
        {preview && (
          <div className="survey-modal-backdrop" onClick={() => setPreview(false)}>
            <section
              className={
                'survey-modal' + (preview === 'branch-filter' ? ' survey-branch-modal' : '')
              }
              role="dialog"
              aria-modal="true"
              aria-label={tr('Preview')}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="survey-modal-close"
                aria-label={tr('Close')}
                onClick={() => setPreview(false)}
              >
                ×
              </button>
              {preview === 'branch-filter' ? (
                <div className="survey-branch-filter">
                  <h2>{tr('Branches')}</h2>
                  <button
                    type="button"
                    className="survey-branch-reset"
                    onClick={() => setBranchDraft(surveyBranches.map((branch) => branch.id))}
                  >
                    {tr('All branches')}
                  </button>
                  <fieldset>
                    <legend>
                      {language === 'ar'
                        ? 'عرض الاستبيانات التابعة للفروع المختارة'
                        : 'Show surveys assigned to selected branches'}
                    </legend>
                    {surveyBranches.map((branch) => (
                      <label key={branch.id}>
                        <input
                          type="checkbox"
                          checked={branchDraft.includes(branch.id)}
                          onChange={(event) =>
                            setBranchDraft((current) =>
                              event.target.checked
                                ? [...current, branch.id]
                                : current.filter((id) => id !== branch.id),
                            )
                          }
                        />
                        {tr(branch.label)}
                      </label>
                    ))}
                  </fieldset>
                  <div className="survey-branch-actions">
                    <button type="button" onClick={() => setPreview(false)}>
                      {tr('Cancel')}
                    </button>
                    <button
                      type="button"
                      className="survey-primary"
                      disabled={!branchDraft.length}
                      onClick={() => {
                        setBranchFilter([...branchDraft]);
                        setSelected(new Set());
                        setPreview(false);
                      }}
                    >
                      {language === 'ar' ? 'تم' : 'Done'}
                    </button>
                  </div>
                </div>
              ) : preview === 'branches' ? (
                <>
                  <h2>{tr('All 3 branches')}</h2>
                  {['Cairo', 'Alexandria', 'Zamalek'].map((x) => (
                    <label key={x}>
                      <input type="checkbox" defaultChecked />
                      {tr(x)}
                    </label>
                  ))}
                </>
              ) : (
                <>
                  <h2>{tr('How was your experience at Bloom & Co.?')}</h2>
                  <p>{tr('Your experience matters to us.')}</p>
                  <PreviewRating />
                  <textarea
                    aria-label={tr('Open feedback')}
                    placeholder={tr('What could we do to make your next visit better?')}
                  />
                  <button
                    className="survey-primary"
                    onClick={() => {
                      setPreview(false);
                      message('Preview response recorded locally');
                    }}
                  >
                    {tr('Submit')}
                  </button>
                </>
              )}
            </section>
          </div>
        )}
      </div>
    </ProductProvider>
  );
}
