import React, { useEffect, useRef, useState } from 'react';
import { UiText } from './SurveyPrimitives.jsx';
import { useProductView } from '../../../app/providers/ProductProvider.jsx';
export default function CopyLinkButton({ children, ...props }) {
  const [copied, setCopied] = useState(false),
    [busy, setBusy] = useState(false),
    timer = useRef(null);
  const { tr } = useProductView();
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async (e) => {
    e.stopPropagation();
    setBusy(true);
    try {
      await navigator.clipboard.writeText('https://nuvia.link/bloom-feedback');
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      window.dispatchEvent(
        new CustomEvent('survey-list-notice', {
          detail: tr('Copy the link shown in the survey link field'),
        }),
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <button
      {...props}
      type="button"
      data-copied={copied}
      disabled={busy || copied}
      aria-label={tr(copied ? 'Link copied' : 'Copy link')}
      onClick={copy}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child) && child.type === UiText
          ? React.cloneElement(
              child,
              { 'aria-live': 'polite' },
              copied ? 'Link copied' : 'Copy link',
            )
          : child,
      )}
    </button>
  );
}
