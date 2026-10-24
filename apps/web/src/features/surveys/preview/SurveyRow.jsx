import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ChoiceMenu from '../../../components/ui/ChoiceMenu.jsx';
import { UiText } from './SurveyPrimitives.jsx';
import { useProductView } from '../../../app/providers/ProductProvider.jsx';
import { asset } from '../../../lib/assets.js';
const RowContext = createContext(null);
const translations = {
  'Survey actions': 'إجراءات الاستبيان',
  'Duplicate survey': 'نسخ الاستبيان',
  'Pause survey': 'إيقاف الاستبيان مؤقتًا',
  'Resume survey': 'استئناف الاستبيان',
  'Archive survey': 'أرشفة الاستبيان',
  'Delete survey': 'حذف الاستبيان',
  'Delete this survey?': 'حذف هذا الاستبيان؟',
  'This removes the survey from this preview.': 'سيتم حذف الاستبيان من هذه المعاينة.',
  Cancel: 'إلغاء',
  Delete: 'حذف',
  Copy: 'نسخة',
  'Survey duplicated': 'تم نسخ الاستبيان',
  'Survey paused': 'تم إيقاف الاستبيان مؤقتًا',
  'Survey resumed': 'تم استئناف الاستبيان',
  'Survey archived': 'تمت أرشفة الاستبيان',
  'Survey deleted': 'تم حذف الاستبيان',
};
function useLabels() {
  const { language, tr } = useProductView();
  return (text) => (language === 'ar' ? translations[text] || tr(text) : text);
}
const notify = (text) =>
  window.dispatchEvent(new CustomEvent('survey-list-notice', { detail: text }));
export function surveyMenuOptions(status, t = (text) => text) {
  return [
    { value: 'duplicate', label: t('Duplicate survey') },
    ...(status === 'Live'
      ? [{ value: 'pause', label: t('Pause survey') }]
      : status === 'Paused'
        ? [{ value: 'resume', label: t('Resume survey') }]
        : []),
    { value: 'archive', label: t('Archive survey') },
    { value: 'delete', label: t('Delete survey') },
  ];
}
export function surveyPrimaryAction(status) {
  return status === 'Live' ? 'Share' : status === 'Draft' ? 'Continue editing' : 'View results';
}
export function updateSurveyRecords(records, id, action, copyId) {
  const source = records.find((record) => record.id === id);
  if (!source) return records;
  if (action === 'duplicate')
    return [...records, { ...source, id: copyId, copied: true, deleted: false, archived: false }];
  return records.map((record) =>
    record.id !== id
      ? record
      : {
          ...record,
          ...(action === 'pause'
            ? { status: 'Paused' }
            : action === 'resume'
              ? { status: 'Live' }
              : action === 'archive'
                ? { archived: true }
                : { deleted: true }),
        },
  );
}

export function SurveyRow({ surveyName, initialStatus, children, ...props }) {
  const key = 'nuvia-survey-row:' + surveyName;
  const [records, setRecords] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) || [{ id: 'original', status: initialStatus }];
    } catch {
      return [{ id: 'original', status: initialStatus }];
    }
  });
  useEffect(() => {
    window.dispatchEvent(new Event('survey-list-change'));
  }, [records]);
  const change = (id, action) => {
    setRecords((previous) => {
      const next = updateSurveyRecords(
        previous,
        id,
        action,
        Date.now() + '-' + Math.random().toString(36).slice(2),
      );
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  };
  return records
    .filter((record) => !record.deleted && !record.archived)
    .map((record) => (
      <ManagedRow
        key={record.id}
        record={record}
        surveyName={surveyName}
        change={(action) => change(record.id, action)}
        {...props}
      >
        {children}
      </ManagedRow>
    ));
}
function ManagedRow({ record, surveyName, change, children, ...props }) {
  const t = useLabels();
  const adapt = (nodes) =>
    React.Children.map(nodes, (node) => {
      if (!React.isValidElement(node)) return node;
      if (
        ['Share', 'Continue editing', 'View results'].includes(node.props['data-survey-action'])
      ) {
        const action = surveyPrimaryAction(record.status);
        return React.cloneElement(
          node,
          {
            'data-survey-action': action,
            className: action === 'Continue editing' ? 'sv133' : 'sv106',
          },
          <>
            {action !== 'Continue editing' && (
              <div className="sv6" data-name="Icon">
                <img
                  alt=""
                  className="sv7"
                  src={asset(
                    action === 'Share'
                      ? 'surveys-figma/all-imgShare2.svg'
                      : 'surveys-figma/all-imgIcon4.svg',
                  )}
                />
              </div>
            )}
            <UiText className="sv107">{action}</UiText>
          </>,
        );
      }
      if (node.props['data-name'] === 'Survey status')
        return React.cloneElement(
          node,
          {},
          <span className="survey-status-pill" data-status={record.status}>
            <UiText>{record.status}</UiText>
          </span>,
        );
      if (node.props['data-name'] === 'Survey details' && record.copied) {
        const items = React.Children.toArray(node.props.children);
        items[0] = React.cloneElement(items[0], {}, t(surveyName) + ' — ' + t('Copy'));
        return React.cloneElement(node, {}, items);
      }
      if (node.props['data-name'] === 'Select survey' && record.copied)
        return React.cloneElement(node, {
          'data-node-id': node.props['data-node-id'] + '-' + record.id,
        });
      return node.props.children ? React.cloneElement(node, {}, adapt(node.props.children)) : node;
    });
  return (
    <RowContext.Provider value={{ status: record.status, name: surveyName, change }}>
      <div {...props} data-survey-record={record.id} data-survey-name={surveyName}>
        {adapt(children)}
      </div>
    </RowContext.Provider>
  );
}
export function SurveyMoreMenu({ children, ...props }) {
  const row = useContext(RowContext),
    t = useLabels();
  const [confirm, setConfirm] = useState(false);
  const host = useRef(null),
    cancel = useRef(null);
  useEffect(() => {
    if (confirm) cancel.current?.focus();
  }, [confirm]);
  if (!row) return <div {...props}>{children}</div>;
  const options = surveyMenuOptions(row.status, t);
  const close = () => {
    setConfirm(false);
    requestAnimationFrame(() => host.current?.querySelector('button')?.focus());
  };
  const run = (action) => {
    if (action === 'delete') {
      setConfirm(true);
      return;
    }
    row.change(action);
    notify(
      t(
        {
          duplicate: 'Survey duplicated',
          pause: 'Survey paused',
          resume: 'Survey resumed',
          archive: 'Survey archived',
        }[action],
      ),
    );
  };
  return (
    <>
      <div {...props} ref={host} className={(props.className || '') + ' survey-more-menu'}>
        {children}
        <ChoiceMenu
          overlay
          density="compact"
          icon={false}
          label={t('Survey actions')}
          value=""
          options={options}
          onChange={run}
        />
      </div>
      {confirm &&
        createPortal(
          <div className="survey-modal-backdrop survey-delete-backdrop" onClick={close}>
            <section
              className="survey-modal survey-delete-modal"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="survey-delete-heading"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Escape') close();
                if (e.key === 'Tab') {
                  e.preventDefault();
                  const buttons = e.currentTarget.querySelectorAll('button');
                  (document.activeElement === buttons[0] ? buttons[1] : buttons[0]).focus();
                }
              }}
            >
              <h2 id="survey-delete-heading">{t('Delete this survey?')}</h2>
              <p>{row.name}</p>
              <p>{t('This removes the survey from this preview.')}</p>
              <div className="survey-confirm-actions">
                <button ref={cancel} type="button" onClick={close}>
                  {t('Cancel')}
                </button>
                <button
                  type="button"
                  className="survey-delete-confirm"
                  onClick={() => {
                    row.change('delete');
                    notify(t('Survey deleted'));
                    setConfirm(false);
                  }}
                >
                  {t('Delete')}
                </button>
              </div>
            </section>
          </div>,
          document.body,
        )}
    </>
  );
}
