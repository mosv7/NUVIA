import React from 'react';
const rotations = { forward: 0, back: 180, up: -90, down: 90, external: -45 };
export default function UiArrow({
  direction = 'forward',
  size = 12,
  rotation,
  rtl = false,
  className = '',
  style = {},
}) {
  const angle = rotation ?? (rotations[direction] ?? 0) + (rtl ? 180 : 0);
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ transform: `rotate(${angle}deg)`, flexShrink: 0, ...style }}
    >
      <path
        d="M3.5 8h8M8 4.5 11.5 8 8 11.5"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function ArrowText({ text, className = 'dashboard-arrow-label' }) {
  const rotations = { '→': 0, '←': 180, '↑': -90, '↓': 90, '↗': -45, '↖': -135 };
  return (
    <span className={className}>
      {text
        .split(/([→←↑↓↗↖])/)
        .map((part, index) =>
          part in rotations ? (
            <UiArrow key={index} className="dashboard-link-arrow" rotation={rotations[part]} />
          ) : (
            part
          ),
        )}
    </span>
  );
}
