import React from 'react';
import UiArrow from '../ui/UiArrow.jsx';
import { useProductView } from '../../app/providers/ProductProvider.jsx';
import { canGoBack, canShowContextBack, goBack } from './navigation.js';
export default function HeadingBack({ fallback }) {
  const { language } = useProductView();
  if (!canShowContextBack() && !fallback) return null;
  const label = language === 'ar' ? 'رجوع' : 'Back';
  return (
    <button
      type="button"
      className="heading-back-button"
      aria-label={label}
      title={label}
      onClick={(event) => {
        event.stopPropagation();
        if (canGoBack()) goBack();
        else location.hash = fallback;
      }}
    >
      <UiArrow direction="back" size={17} rtl={language === 'ar'} />
    </button>
  );
}
