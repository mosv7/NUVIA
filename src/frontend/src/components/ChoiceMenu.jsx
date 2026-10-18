import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './choice-menu.css';
function BranchIcon() {
  return (
    <svg
      className="choice-branch-icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 10V7l2-4h14l2 4v3M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M5 13v8h14v-8M9 21v-6h6v6M3 7h18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default function ChoiceMenu({
  value,
  onChange,
  options,
  label,
  compact = false,
  overlay = false,
}) {
  const [open, setOpen] = useState(false),
    [position, setPosition] = useState({}),
    ref = useRef(null),
    popup = useRef(null),
    button = useRef(null),
    id = useId();
  const selected = options.find((o) => o.value === value) || options[0];
  useEffect(() => {
    if (overlay) return;
    const parent = ref.current?.parentElement;
    if (!parent?.matches('[data-name="Language"],.language')) return;
    const activate = (e) => {
      if (ref.current.contains(e.target)) return;
      e.preventDefault();
      setOpen((v) => !v);
    };
    parent.addEventListener('click', activate);
    return () => parent.removeEventListener('click', activate);
  }, [overlay]);
  useEffect(() => {
    if (!open) return;
    const place = () => {
      const box = (overlay ? ref.current.parentElement : ref.current).getBoundingClientRect(),
        width = Math.min(252, innerWidth - 24),
        height = options.length * 52 + 52;
      setPosition({
        width,
        left: Math.max(12, Math.min(box.right - width, innerWidth - width - 12)),
        ...(box.bottom + height > innerHeight && box.top > height
          ? { bottom: innerHeight - box.top + 8 }
          : { top: box.bottom + 8 }),
      });
    };
    place();
    const outside = (e) => {
      if (!ref.current?.contains(e.target) && !popup.current?.contains(e.target)) setOpen(false);
    };
    const key = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', key);
    addEventListener('resize', place);
    addEventListener('scroll', place, true);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', key);
      removeEventListener('resize', place);
      removeEventListener('scroll', place, true);
    };
  }, [open, overlay, options.length]);
  const move = (e, index) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const items = popup.current?.querySelectorAll('[role=option]');
    if (!items?.length) return;
    let next =
      e.key === 'Home'
        ? 0
        : e.key === 'End'
          ? items.length - 1
          : (index + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
    items[next].focus();
  };
  return (
    <span className={'choice-menu' + (overlay ? ' choice-menu-overlay' : '')} ref={ref}>
      <button
        type="button"
        ref={button}
        className="choice-trigger"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            setOpen(true);
            requestAnimationFrame(() =>
              popup.current?.querySelector('[aria-selected=true]')?.focus(),
            );
          }
        }}
      >
        <span>{compact ? selected.code || selected.label : selected.label}</span>
      </button>
      {open &&
        createPortal(
          <div
            className="choice-popup"
            ref={popup}
            style={position}
            dir={document.documentElement.dir || 'ltr'}
          >
            <div className="choice-popup-title">{label}</div>
            <div role="listbox" id={id} aria-label={label}>
              {options.map((option, index) => (
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  className="choice-option"
                  key={option.value}
                  onKeyDown={(e) => move(e, index)}
                  onClick={(e) => {
                    onChange(option.value);
                    setOpen(false);
                    if (e.detail === 0) button.current?.focus({ preventScroll: true });
                    else button.current?.blur();
                  }}
                >
                  <span className="choice-option-code">{option.code || <BranchIcon />}</span>
                  <span className="choice-option-copy">
                    <span lang={option.value === 'ar' ? 'ar' : 'en'}>{option.label}</span>
                    {option.description && <small>{option.description}</small>}
                  </span>
                  {option.value === value && (
                    <svg
                      className="choice-check"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="m3 8 3 3 7-7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </span>
  );
}
export function LanguageMenu({ value, onChange }) {
  return (
    <ChoiceMenu
      value={value}
      onChange={onChange}
      compact
      label="Language / اللغة"
      options={[
        { value: 'en', label: 'English', code: 'EN' },
        { value: 'ar', label: 'العربية', code: 'AR' },
      ]}
    />
  );
}
