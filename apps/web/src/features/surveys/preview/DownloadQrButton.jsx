import React, { useState } from 'react';
import { UiText } from './SurveyPrimitives.jsx';
import { useProductView } from '../../../app/providers/ProductProvider.jsx';
export async function prepareQrFile(format, source) {
  const response = await fetch(source);
  if (!response.ok) throw new Error('QR image unavailable');
  const svg = await response.text();
  if (!svg.includes('<svg')) throw new Error('Invalid QR image');
  const vector = new Blob([svg], { type: 'image/svg+xml' });
  if (format === 'SVG') return vector;
  const sourceUrl = URL.createObjectURL(vector);
  try {
    const img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('QR conversion failed'));
      image.src = sourceUrl;
    });
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Image export unavailable');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 1024, 1024);
    ctx.drawImage(img, 0, 0, 1024, 1024);
    return await new Promise((resolve, reject) =>
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('PNG export failed'))),
        'image/png',
      ),
    );
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}
export default function DownloadQrButton({ children, ...props }) {
  const [busy, setBusy] = useState(false);
  const { language } = useProductView();
  const format = props['data-survey-action'];
  const announce = (text) =>
    window.dispatchEvent(new CustomEvent('survey-list-notice', { detail: text }));
  const run = async (e) => {
    e.stopPropagation();
    setBusy(true);
    try {
      const qr = document.querySelector('[data-name="Survey QR code"] img');
      if (!qr) throw new Error('QR image missing');
      const blob = await prepareQrFile(format, qr.src),
        url = URL.createObjectURL(blob),
        anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'bloom-survey-qr.' + format.toLowerCase();
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      announce(language === 'ar' ? 'بدأ التنزيل' : 'Download started');
    } catch {
      announce(
        language === 'ar'
          ? 'تعذّر تجهيز الملف، حاولي مرة أخرى.'
          : 'Could not prepare the file. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <button {...props} type="button" disabled={busy} aria-busy={busy} onClick={run}>
      {React.Children.map(children, (child) =>
        busy && React.isValidElement(child) && child.type === UiText
          ? React.cloneElement(child, {}, language === 'ar' ? 'جاري التجهيز…' : 'Preparing…')
          : child,
      )}
    </button>
  );
}
