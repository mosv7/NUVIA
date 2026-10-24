import React from 'react';
import { useProductView } from '../../app/providers/ProductProvider.jsx';
import { asset } from '../../lib/assets.js';

export default function ConnectedAssistantLauncher() {
  const { language, action } = useProductView();
  const label = language === 'ar' ? 'افتح مساعد NUVIA' : 'Open Ask NUVIA';
  return (
    <button
      type="button"
      className="nuvia-launcher"
      aria-label={label}
      title={label}
      onClick={() => action('NUVIA Assistant')}
    >
      <img
        className="nuvia-symbol"
        src={asset('dashboard/overview/sparkles1.svg')}
        alt=""
        aria-hidden="true"
      />
    </button>
  );
}
