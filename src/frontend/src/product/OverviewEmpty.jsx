import React from 'react';
import { useProductView } from './ProductContext.jsx';
import './overview-empty.css';
import { asset as resolveAsset } from '../assets.js';
const asset = (name) => resolveAsset('overview-empty/' + name + '.svg');
export default function OverviewEmpty() {
  const { language, action, workspace, preview } = useProductView();
  const ar = language === 'ar';
  const steps = [
    [
      'clipboard-list',
      ar ? 'أنشئ استبيانًا' : 'Create a survey',
      ar ? 'اسأل الأسئلة التي تهمك.' : 'Ask the questions that matter.',
    ],
    [
      'qr-code',
      ar ? 'شاركه مع العملاء' : 'Share with customers',
      ar ? 'استخدم رمز QR أو رابط الاستبيان.' : 'Use a QR code or survey link.',
    ],
    [
      'chart',
      ar ? 'افهم آراء العملاء' : 'Understand the feedback',
      ar ? 'اكتشف رؤى مدعومة بالأدلة.' : 'See evidence-backed insights.',
    ],
  ];
  return (
    <section
      className="overview-first-time"
      data-node-id="328:6430"
      aria-labelledby="first-response-title"
    >
      <div className="first-survey-art" aria-hidden="true">
        <img
          className="first-survey-backdrop"
          src={asset('backdrop')}
          alt=""
          width="138"
          height="138"
        />
        <div className="first-survey-paper">
          <div className="first-survey-heading">
            <i />
            <span />
          </div>
          <div className="first-survey-question" />
          <img src={asset('rating-options')} alt="" width="70" height="10" />
          <div className="first-survey-answer" />
          <div className="first-survey-submit" />
        </div>
        <span className="first-survey-badge">
          <img src={asset('badge-plus')} alt="" width="17" height="17" />
        </span>
      </div>
      <div className="first-survey-message">
        <p className="first-survey-eyebrow">
          {ar ? 'من هنا تبدأ أول إشارة من عملائك' : 'YOUR FIRST CUSTOMER SIGNAL STARTS HERE'}
        </p>
        <h2 id="first-response-title">{ar ? 'لا توجد ردود بعد' : 'No responses yet'}</h2>
        <p>
          {ar
            ? `بمجرد إتاحة جمع الردود وتحليلها لـ ${preview ? 'Bloom & Co.' : workspace?.businessName || ''}، ستظهر مؤشراتك هنا.`
            : `Once response collection and analysis are available for ${preview ? 'Bloom & Co.' : workspace?.businessName || ''}, your metrics will appear here.`}
        </p>
      </div>
      <button className="first-survey-create" onClick={() => action('Create Survey')}>
        <img src={asset('button-plus')} alt="" width="16" height="16" />
        {ar ? 'أنشئ استبيانك الأول' : 'Create Your First Survey'}
      </button>
      <div className="first-survey-steps">
        {steps.map(([icon, title, description]) => (
          <div key={icon}>
            <img src={asset(icon)} alt="" width="20" height="20" />
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
