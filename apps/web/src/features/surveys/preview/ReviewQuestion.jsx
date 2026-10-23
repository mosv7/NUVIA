import React, { useState } from 'react';
import { UiText, SurveyReviewMark } from './SurveyPrimitives.jsx';
import { useProductView } from '../../../app/providers/ProductProvider.jsx';
import { asset } from '../../../lib/assets.js';

export default function ReviewQuestion({
  id,
  aspect,
  type,
  wording,
  selected,
  onSelect,
  editing,
  onEdit,
  onClose,
}) {
  const { tr } = useProductView();
  const [saved, setSaved] = useState(() => tr(wording));
  const [draft, setDraft] = useState(saved);
  const begin = (e) => {
    e.stopPropagation();
    setDraft(saved);
    onEdit();
  };
  const cancel = (e) => {
    e.stopPropagation();
    setDraft(saved);
    onClose();
  };
  const save = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (draft.trim()) {
      setSaved(draft.trim());
      onClose();
    }
  };
  return (
    <div className={editing ? 'sv28' : 'sv19'} data-node-id={id} data-name="Proposed question">
      <button
        type="button"
        className="sv20"
        data-name="Question selection"
        aria-label={tr('Select question')}
        aria-pressed={selected}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <SurveyReviewMark />
      </button>
      <div className="sv22" data-name="Question content">
        <div className="sv23" data-name="Question metadata">
          <div className="sv24" data-name="Status">
            <UiText className="sv25">{aspect}</UiText>
          </div>
          <UiText className="sv26">{type}</UiText>
        </div>
        {editing ? (
          <form className="sv29" data-name="Question editor" onSubmit={save}>
            <div className="sv30" data-name="Editable wording">
              <input
                autoFocus
                aria-label={tr('Question text')}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') cancel(e);
                }}
                dir="auto"
              />
            </div>
            {type === '5-point satisfaction' && (
              <UiText className="sv26">Scale: Very dissatisfied → Very satisfied</UiText>
            )}
            <div className="sv31" data-name="Edit actions">
              <button type="submit" className="sv32" disabled={!draft.trim()}>
                <UiText className="sv33">Save changes</UiText>
              </button>
              <button type="button" className="sv34" onClick={cancel}>
                <UiText className="sv8">Cancel</UiText>
              </button>
            </div>
          </form>
        ) : (
          <p className="sv27">{saved}</p>
        )}
      </div>
      {!editing && (
        <button
          type="button"
          className="sv6"
          data-name="pencil-line"
          aria-label={tr('Edit question')}
          onClick={begin}
        >
          <img alt="" className="sv7" src={asset('surveys-figma/ai-review-imgPencilLine.svg')} />
        </button>
      )}
    </div>
  );
}
