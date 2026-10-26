import React from 'react';
import UiArrow from '../../components/ui/UiArrow.jsx';
import ChoiceMenu from '../../components/ui/ChoiceMenu.jsx';
import figmaPencil from './assets/figma/imgPencil.svg';
import figmaInfo from './assets/figma/imgInfo.svg';
import figmaBuilding from './assets/figma/imgBuilding2.svg';
import figmaInfoLarge from './assets/figma/imgInfo1.svg';
import figmaUser from './assets/figma/imgUserRound.svg';
import figmaPlus from './assets/figma/imgPlus.svg';
import figmaStore from './assets/figma/imgStore.svg';
import figmaMore from './assets/figma/imgEllipsis.svg';
const shapes = {
  business: 'M3 10h18l-2-7H5z M4 10v11h16V10 M9 21v-7h6v7',
  settings:
    'M12 3 15 5 19 5 21 9 19 12 21 16 18 20 14 19 10 21 6 19 5 15 2 12 4 8 8 7Z M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  overview: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  feedbacks: 'M21 11a9 9 0 0 1-9 9H4l-2 2V11a9 9 0 0 1 19 0Z',
  analytics: 'M4 20V10m6 10V5m6 15v-8m5 9H2',
  reports: 'M6 3h9l4 4v14H6z M14 3v5h5 M9 12h6m-6 4h6',
  surveys: 'M8 4H5v17h14V4h-3 M8 2h8v5H8z M8 11h8m-8 4h6',
  assistant: 'm12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z',
  subscription: 'M3 5h18v14H3z M3 9h18m-14 6h4',
  notifications: 'M5 16h14l-2-4V8a5 5 0 0 0-10 0v4z M10 20h4',
  globe: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M3 12h18 M12 3q-8 9 0 18q8-9 0-18',
  down: 'm6 9 6 6 6-6',
  back: 'M20 12H4m6-6-6 6 6 6',
  plus: 'M12 4v16M4 12h16',
  search: 'M17 17l5 5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  close: 'm6 6 12 12M6 18 18 6',
  check: 'm4 12 5 5L20 6',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  archive: 'M3 3h18v5H3z M5 8v13h14V8 M9 12h6',
  shield: 'M12 2 3 6v7q0 6 9 9 9-3 9-9V6z M8 12l3 3 5-6',
  mail: 'M2 5h20v14H2z m0 0 10 8L22 5',
  device: 'M3 3h18v13H3z M8 21h8m-4-5v5',
  logout: 'M9 3H3v18h6 M9 12h12m-5-5 5 5-5 5',
  user: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M4 22v-3a8 8 0 0 1 16 0v3',
  menu: 'M3 5h18M3 12h18M3 19h18',
};

export function I({ name, size = 20 }) {
  if (name === 'back')
    return <UiArrow direction="back" size={18} rtl={document.documentElement.dir === 'rtl'} />;
  const asset = {
    edit: figmaPencil,
    info: figmaInfo,
    building: figmaBuilding,
    'info-large': figmaInfoLarge,
    user: figmaUser,
    plus: figmaPlus,
    business: figmaStore,
    more: figmaMore,
  }[name];
  if (asset)
    return (
      <img src={asset} className={name === 'plus' ? 'figma-icon plus-icon' : 'figma-icon'} alt="" />
    );
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={shapes[name] || shapes.overview} />
    </svg>
  );
}

export function Metric({ title, value, detail }) {
  return (
    <section className="card metric">
      <p>{title}</p>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </section>
  );
}

export function Empty({ title, description, action, footer, icon }) {
  return (
    <div className="feedback-empty">
      <img
        className="feedback-empty-icon"
        src={
          icon === 'analytics'
            ? '/assets/dashboard/overview/chart-no-axes-combined.svg'
            : icon === 'reports'
              ? '/assets/dashboard/overview/file-chart-column.svg'
              : '/assets/dashboard/feedbacks-empty/messages-square.svg'
        }
        alt=""
      />
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="feedback-empty-actions">
        {action &&
          React.cloneElement(
            action,
            { className: 'feedback-btn feedback-primary' },
            action.props.children,
          )}
      </div>
      <small>
        {footer ||
          (document.documentElement.lang === 'ar'
            ? 'تظهر البيانات هنا عند توفرها.'
            : 'Your workspace updates appear here when available.')}
      </small>
    </div>
  );
}

export function PreviewSelect({ label, value, values, onChange }) {
  return (
    <span className="preview-select">
      <ChoiceMenu
        label={label}
        value={value}
        onChange={onChange}
        icon={false}
        density="compact"
        options={values.map((o) => ({
          value: Array.isArray(o) ? o[0] : o,
          label: Array.isArray(o) ? o[1] : o,
        }))}
      />
      <img
        className="preview-select-chevron"
        src={new URL('./assets/figma/imgChevronDown.svg', import.meta.url).href}
        alt=""
      />
    </span>
  );
}
