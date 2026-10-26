import { safeLocalStorage } from '../../../lib/storage.js';
import HeadingBack from '../../../components/layout/HeadingBack.jsx';
import React, { useState } from 'react';
import arabic from '../../../lib/i18n/product-ar.json';
import { asset } from '../../../lib/assets.js';
import { createEditorQuestions, editorQuestionIds } from './survey-editor.js';
import ControlIcon from '../../../components/ui/ControlIcon.jsx';
import ChoiceMenu from '../../../components/ui/ChoiceMenu.jsx';
import { useProductView } from '../../../app/providers/ProductProvider.jsx';
export const SurveyEditorContext = React.createContext(null);
const defaultEditor = {
  question: 1,
  language: 'en',
  enabledLanguages: ['en', 'ar'],
  questions: createEditorQuestions(),
  updateQuestion() {},
  setLanguage() {},
};
export function useSurveyEditor() {
  return React.useContext(SurveyEditorContext) || defaultEditor;
}
const linkLabels = [
  'Share your live survey →',
  'Edit survey details →',
  'View responses →',
  '← Edit business type or goal',
  'Download all branch QR codes →',
];
export function UiText({ children, editorCopy = false, ...props }) {
  const { tr } = useProductView();
  const editor = useSurveyEditor();
  const translate = (value) =>
    editorCopy ? (editor.language === 'ar' ? (arabic[value] ?? value) : value) : tr(value);
  const raw = typeof children === 'string' ? children.trim() : '';
  const text = raw
    ? translate(raw)
    : React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child,
              {},
              typeof child.props.children === 'string'
                ? translate(child.props.children.trim())
                : child.props.children,
            )
          : child,
      );
  const Tag = linkLabels.includes(raw) ? 'button' : 'p';
  if (['sv82', 'sv3'].includes(props.className)) {
    const list = /^#\/survey-(all|empty|live|drafts|paused|closed)(?:[?]|$)/.test(location.hash);
    return (
      <p {...props} data-workspace-heading="true">
        <HeadingBack fallback={list ? undefined : '/survey-all'} />
        <span>{text}</span>
      </p>
    );
  }

  return (
    <Tag {...props} {...(Tag === 'button' ? { type: 'button', 'data-survey-action': raw } : {})}>
      {typeof text === 'string'
        ? text.split(/([→←])/).map((part, i) =>
            /[→←]/.test(part) ? (
              <svg
                key={i}
                className="dashboard-link-arrow"
                aria-hidden="true"
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
                style={{ transform: part === '←' ? 'rotate(180deg)' : undefined }}
              >
                <path
                  d="M3.5 8h8M8 4.5 11.5 8 8 11.5"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              part
            ),
          )
        : text}
    </Tag>
  );
}
export function SurveyField({ editorField, ...props }) {
  return editorField ? (
    <EditorField field={editorField} {...props} />
  ) : (
    <StoredSurveyField {...props} />
  );
}
function EditorField({ field, fieldLanguage, initialValue, multiline = false, ...props }) {
  const { tr } = useProductView();
  const editor = useSurveyEditor();
  const item = editor.questions[editor.question];
  const fieldLang = fieldLanguage || editor.language;
  const value = item[field][fieldLang];
  const change = (e) =>
    editor.updateQuestion(editor.question, {
      [field]: { ...item[field], [fieldLang]: e.target.value },
    });
  const inputProps = {
    value,
    onChange: change,
    placeholder:
      field === 'text'
        ? fieldLang === 'ar'
          ? 'اكتب نص السؤال'
          : 'Enter question text'
        : undefined,
    dir: fieldLang === 'ar' ? 'rtl' : 'ltr',
    lang: fieldLang,
    'aria-label': tr(
      field === 'text'
        ? 'Question text'
        : field === 'lowLabel'
          ? 'Lowest rating label'
          : 'Highest rating label',
    ),
  };
  return (
    <div {...props}>{multiline ? <textarea {...inputProps} /> : <input {...inputProps} />}</div>
  );
}
function StoredSurveyField({ initialValue = '', multiline = false, ...props }) {
  const { tr } = useProductView();
  const key = 'survey-preview-field-' + props['data-node-id'] + '-' + initialValue;
  const [value, setValue] = useState(
    () =>
      safeLocalStorage.getItem(key) ??
      (props['data-edit-language'] ? initialValue.trim() : tr(initialValue.trim())),
  );
  const change = (e) => {
    setValue(e.target.value);
    safeLocalStorage.setItem(key, e.target.value);
  };
  return (
    <div {...props}>
      {multiline ? (
        <textarea aria-label={tr('Question text')} value={value} onChange={change} dir="auto" />
      ) : (
        <input aria-label={tr('Survey details')} value={value} onChange={change} dir="auto" />
      )}
    </div>
  );
}
export function SurveySwitch({ className, state = 'on', editorSetting }) {
  const { tr } = useProductView();
  const editor = useSurveyEditor();
  const [local, setLocal] = useState(state === 'on');
  const on = editorSetting ? editor.questions[editor.question][editorSetting] : local;
  const change = () =>
    editorSetting
      ? editor.updateQuestion(editor.question, { [editorSetting]: !on })
      : setLocal(!on);
  return (
    <button
      type="button"
      role="switch"
      aria-label={tr(editorSetting === 'required' ? 'Required question' : 'Survey settings')}
      aria-checked={on}
      className={'survey-switch ' + (className || '')}
      onClick={change}
    >
      <span />
    </button>
  );
}

export function SurveyDropdown({ className, state = 'Star rating', onChange }) {
  const { tr } = useProductView();
  return (
    <div className={'survey-select-shell ' + (className || '')}>
      <ChoiceMenu
        density="compact"
        placement="bottom"
        label={tr('Question type')}
        value={state}
        onChange={onChange}
        icon={false}
        options={['Star rating', 'Single choice', 'Multiple choice', 'Long text', 'NPS'].map(
          (x) => ({ value: x, label: tr(x) }),
        )}
      />
    </div>
  );
}
export function SurveyCount({ value, onChange, kind = 'choices' }) {
  const { tr, formatNumber } = useProductView();
  return (
    <div className="survey-select-shell">
      <ChoiceMenu
        density="compact"
        placement="bottom"
        label={tr(kind === 'choices' ? 'Number of choices' : 'Number of stars')}
        value={value}
        onChange={onChange}
        icon={false}
        options={Array.from({ length: 9 }, (_, i) => i + 2).map((n) => ({
          value: n,
          label: formatNumber(n) + ' ' + tr(kind === 'choices' ? 'Choices' : 'stars'),
        }))}
      />
    </div>
  );
}
export function SurveyLanguageEditor({ className }) {
  const editor = useSurveyEditor();
  const ui = useProductView();
  if (editor.enabledLanguages.length === 1)
    return (
      <span className="survey-editor-language-label">
        {editor.language === 'ar' ? 'العربية' : 'English'}
      </span>
    );
  return (
    <div
      className={'survey-language-tabs ' + className}
      role="group"
      aria-label="Question editing language"
    >
      {['en', 'ar', 'both'].map((lang) => (
        <button
          type="button"
          key={lang}
          aria-pressed={(editor.viewMode || editor.language) === lang}
          onClick={() => editor.setLanguage(lang)}
          lang={lang === 'ar' ? 'ar' : undefined}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
          {lang === 'ar'
            ? 'العربية'
            : lang === 'en'
              ? 'English'
              : ui.language === 'ar'
                ? 'اللغتين'
                : 'Both'}
        </button>
      ))}
    </div>
  );
}

export const surveyQuestions = {
  2: {
    text: 'What did you enjoy most about your visit?',
    ar: 'ما أكثر شئ استمتعت بيه في زيارتك؟',
    type: 'Multiple choice',
  },
  1: {
    text: 'How was your experience at Bloom & Co.?',
    ar: 'كيف كانت تجربتك في بلوم آند كو؟',
    type: 'Star rating',
  },
  3: {
    text: 'How would you rate the speed of our service?',
    ar: 'كيف تقيّم سرعة خدمتنا؟',
    type: 'Star rating',
  },
  4: {
    text: 'How would you rate our value for money?',
    ar: 'كيف تقيّم القيمة مقابل السعر لدينا؟',
    type: 'Star rating',
  },
  5: {
    text: 'How likely are you to recommend us?',
    ar: 'ما مدى احتمالية أن تنصح الآخرين بنا؟',
    type: 'NPS',
  },
  6: {
    text: 'What could we do to make your next visit better?',
    ar: 'ماذا يمكننا أن نفعل لتحسين زيارتك القادمة؟',
    type: 'Long text',
  },
};
export function SurveyAnswer({ type = 'Star rating', count = 5 }) {
  const editor = useSurveyEditor();
  const item = editor.questions[editor.question];
  const rating = item.rating;
  const language = editor.language;
  const nps = type === 'NPS';
  const maximum = nps ? 10 : count;
  return (
    <div
      className="survey-answer-preview"
      style={{
        '--rating-color':
          rating / maximum <= 0.4 ? '#dc6672' : rating / maximum <= 0.6 ? '#e6d342' : '#36a775',
      }}
      data-name="Rating preview"
    >
      {type === 'Single choice' || type === 'Multiple choice' ? (
        <div>
          {Array.from({ length: count }, (_, index) => (
            <SurveyChoice
              key={index}
              index={index}
              type={type === 'Single choice' ? 'radio' : 'checkbox'}
            />
          ))}
        </div>
      ) : type === 'Long text' ? (
        <textarea
          dir={language === 'ar' ? 'rtl' : 'ltr'}
          aria-label={language === 'ar' ? 'معاينة الرد' : 'Response preview'}
          placeholder={language === 'ar' ? 'اكتب إجابتك هنا' : 'Type your answer here'}
        />
      ) : (
        <>
          <div
            className={'survey-answer-scale ' + (nps ? 'survey-nps' : '')}
            role="group"
            aria-label="Rating preview"
          >
            {(nps
              ? Array.from({ length: 11 }, (_, i) => i)
              : Array.from({ length: count }, (_, i) => i + 1)
            ).map((n) => (
              <button
                type="button"
                key={n}
                aria-label={String(n)}
                aria-pressed={rating === n}
                data-filled={nps ? rating === n : rating >= n}
                onClick={() => editor.updateQuestion(editor.question, { rating: n })}
              >
                {nps ? (
                  n
                ) : (
                  <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24">
                    <path
                      d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"
                      stroke="currentColor"
                      fill="currentColor"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
          <div className="survey-answer-labels">
            <span>{item.lowLabel[language]}</span>
            <span>{item.highLabel[language]}</span>
          </div>
        </>
      )}
    </div>
  );
}

export function SurveyChoice({ index = 0, type = 'checkbox' }) {
  const editor = useSurveyEditor();
  const item = editor.questions[editor.question];
  const language = editor.language;
  const values = item.options[language];
  const changeText = (e) => {
    const next = [...values];
    next[index] = e.target.value;
    editor.updateQuestion(editor.question, { options: { ...item.options, [language]: next } });
  };
  const checked = item.selection.includes(index);
  const changeSelection = (e) =>
    editor.updateQuestion(editor.question, {
      selection:
        type === 'radio'
          ? [index]
          : e.target.checked
            ? [...item.selection, index]
            : item.selection.filter((n) => n !== index),
    });
  return (
    <div className="survey-choice" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <label className="survey-choice-toggle">
        <input
          type={type}
          name={type === 'radio' ? 'survey-single-choice-' + editor.question : undefined}
          checked={checked}
          onChange={changeSelection}
          aria-label={(language === 'ar' ? 'اختيار ' : 'Select option ') + (index + 1)}
        />
        <span className="survey-choice-box">
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="m3 8 3 3 7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </label>
      <input
        type="text"
        lang={language}
        aria-label={(language === 'ar' ? 'نص الاختيار ' : 'Option text ') + (index + 1)}
        value={values[index] || ''}
        onChange={changeText}
      />
    </div>
  );
}

export const SurveySelectionContext = React.createContext(null);
export function SurveyTableCheck(props) {
  const { tr } = useProductView();
  const selection = React.useContext(SurveySelectionContext);
  const all = props['data-name'] === 'Select all',
    id = props['data-node-id'];
  const checked = all
    ? selection.visibleIds.length > 0 &&
      selection.visibleIds.every((x) => selection.selected.has(x))
    : selection.selected.has(id);
  const change = (e) =>
    selection.setSelected((previous) => {
      const next = new Set(previous);
      for (const key of all ? selection.visibleIds : [id]) {
        if (e.target.checked) next.add(key);
        else next.delete(key);
      }
      return next;
    });
  return (
    <input
      {...props}
      className="survey-table-check"
      type="checkbox"
      aria-label={tr(all ? 'Select all' : 'Select survey')}
      checked={checked}
      onChange={change}
      ref={(element) => {
        if (element && all)
          element.indeterminate =
            !checked && selection.visibleIds.some((x) => selection.selected.has(x));
      }}
    />
  );
}

export function SurveyAISelect({ kind }) {
  const { tr, formatNumber } = useProductView();
  const languages = [
    { value: 'en', label: tr('English') },
    { value: 'ar', label: tr('Arabic') },
    { value: 'both', label: tr('English + Arabic') },
  ];
  const options =
    kind === 'language'
      ? languages
      : [3, 4, 5].map((n) => ({
          value: String(n),
          label: formatNumber(n) + ' ' + tr('Questions'),
        }));
  const [value, setValue] = useState(
    () => safeLocalStorage.getItem('survey-ai-' + kind) || (kind === 'language' ? 'en' : '5'),
  );
  return (
    <div className="survey-select-shell">
      <ChoiceMenu
        density="compact"
        placement="bottom"
        icon={false}
        label={tr(kind === 'language' ? 'Survey language' : 'Question count')}
        value={value}
        options={options}
        onChange={(next) => {
          setValue(next);
          safeLocalStorage.setItem('survey-ai-' + kind, next);
        }}
      />
    </div>
  );
}

export function SurveyReviewMark() {
  return (
    <span className="survey-review-mark">
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="m3 8 3 3 7-7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function SurveyQuestionList({ question, selectedCard }) {
  const { tr } = useProductView();
  const editor = useSurveyEditor();
  return (
    <>
      {editorQuestionIds(editor.questions).map((index) => {
        const item = editor.questions[index];
        return index === question ? (
          React.cloneElement(selectedCard, { key: index, 'data-question-id': index })
        ) : (
          <button
            type="button"
            className="sv182"
            key={index}
            data-name="Question summary"
            data-question-id={index}
            data-survey-action={index + '. ' + item.text.en}
            aria-expanded="false"
          >
            <span className="sv183">{index}</span>
            <span className="sv184">
              <span
                className="sv185"
                dir={editor.language === 'ar' ? 'rtl' : 'ltr'}
                lang={editor.language}
              >
                {item.text[editor.language] ||
                  (editor.language === 'ar' ? 'سؤال جديد' : 'New question')}
              </span>
              <span className="sv186">
                {tr(item.type)} · {tr(item.required ? 'Required' : 'Optional')} ·{' '}
                {editor.enabledLanguages.length === 2
                  ? 'EN / AR'
                  : editor.enabledLanguages[0].toUpperCase()}
              </span>
            </span>
            <i className="control-chevron" aria-hidden="true" />
          </button>
        );
      })}
    </>
  );
}

export function SurveyQuestionOutline() {
  const editor = useSurveyEditor();

  return (
    <div className="sv167" data-name="Question navigation">
      {editorQuestionIds(editor.questions).map((id) => {
        const item = editor.questions[id];
        const title =
          item.title?.[editor.language] ||
          item.text[editor.language] ||
          (editor.language === 'ar' ? 'سؤال جديد' : 'New question');
        const file =
          item.type === 'Star rating'
            ? 'questions-imgStar1.svg'
            : item.type === 'NPS'
              ? 'questions-imgGauge.svg'
              : item.type === 'Long text'
                ? 'questions-imgAlignLeft.svg'
                : 'questions-imgListChecks.svg';
        return (
          <button
            type="button"
            key={id}
            className="sv168"
            data-name="Question item"
            data-survey-action={id + '. ' + title}
            aria-current={editor.question === id ? 'true' : undefined}
          >
            <span className="sv169 survey-outline-number">{id}.</span>
            <span className="sv170 survey-outline-title">{title}</span>
            <span className="sv21" style={{ position: 'relative', flexShrink: 0 }}>
              <span
                aria-hidden="true"
                className="survey-outline-icon"
                style={{
                  maskImage: `url(${asset('surveys-figma/' + file)})`,
                  WebkitMaskImage: `url(${asset('surveys-figma/' + file)})`,
                }}
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}
export function SurveyQuestionCount({ compact = false }) {
  const editor = useSurveyEditor();
  const { language, formatNumber } = useProductView();
  const count = Object.keys(editor.questions).length;
  return (
    <>
      {compact
        ? formatNumber(count)
        : language === 'ar'
          ? formatNumber(count) + ' أسئلة'
          : count + ' questions'}
    </>
  );
}

export function SurveySortButton({ className }) {
  const { tr } = useProductView();
  const [descending, setDescending] = useState(true);
  const sort = (button, direction) => {
    const management = button.closest('[data-name="Survey management"]');
    const rows = [...management.querySelectorAll('[data-name="Survey row"]')];
    if (!rows.length) return;
    const anchor = rows[rows.length - 1].nextSibling;
    const stamp = (row) =>
      row.dataset.updated === 'today' ? Date.now() : Date.parse(row.dataset.updated) || 0;
    rows
      .sort((a, b) => (direction ? stamp(b) - stamp(a) : stamp(a) - stamp(b)))
      .forEach((row) => management.insertBefore(row, anchor));
  };
  return (
    <button
      type="button"
      className={className}
      data-name="Action"
      data-sort-direction={descending ? 'descending' : 'ascending'}
      title={tr(descending ? 'Newest first' : 'Oldest first')}
      aria-label={tr('Last updated') + ', ' + tr(descending ? 'Newest first' : 'Oldest first')}
      onClick={(e) => {
        e.stopPropagation();
        const next = !descending;
        sort(e.currentTarget, next);
        setDescending(next);
      }}
    >
      <ControlIcon name="sort" />
      <span>{tr('Last updated')}</span>
    </button>
  );
}
