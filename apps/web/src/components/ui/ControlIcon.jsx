import { asset } from '../../lib/assets.js';
const sources = { date: 'calendar-days.svg', branch: 'store.svg', export: 'download-export.svg' };
export default function ControlIcon({ name }) {
  const mask = `url("${asset(name === 'sort' ? 'dashboard/surveys/arrow-down-wide-narrow.svg' : 'dashboard/overview/' + sources[name])}")`;
  return (
    <span
      aria-hidden="true"
      className={'control-icon control-icon-' + name}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    />
  );
}
