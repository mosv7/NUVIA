import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useProductView } from '../../app/providers/ProductProvider.jsx';
import { buildSearchIndex, searchIndex } from './search-index.js';
import './global-search.css';
export default function GlobalSearch() {
  const { workspaceQuery, setWorkspaceQuery, language } = useProductView();
  const [open, setOpen] = useState(false),
    [active, setActive] = useState(0),
    [position, setPosition] = useState({}),
    popup = useRef(null);
  const ar = language === 'ar';
  const results = useMemo(
    () => searchIndex(buildSearchIndex(language, localStorage), workspaceQuery),
    [workspaceQuery, language],
  );
  const choose = (result) => {
    setOpen(false);
    setWorkspaceQuery('');
    location.hash = result.path.slice(1);
  };
  useEffect(() => {
    setOpen(!!workspaceQuery.trim());
    setActive(0);
  }, [workspaceQuery]);
  useEffect(() => {
    const input = document.querySelector('[data-workspace-search]');
    if (!input) return;
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', String(open));
    input.setAttribute('aria-controls', 'workspace-search-results');
    if (open && results[active])
      input.setAttribute('aria-activedescendant', 'workspace-search-option-' + active);
    else input.removeAttribute('aria-activedescendant');
    const place = () => {
      const box = input.closest('[data-name="Search"]').getBoundingClientRect(),
        width = Math.min(460, innerWidth - 24);
      setPosition({
        top: box.bottom + 8,
        left: Math.max(12, Math.min(box.left, innerWidth - width - 12)),
        width,
        maxHeight: Math.max(120, innerHeight - box.bottom - 28),
      });
    };
    const key = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        input.focus();
        setOpen(!!workspaceQuery.trim());
        return;
      }
      if (e.target !== input) return;
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setOpen(!!workspaceQuery.trim());
        setActive((value) =>
          results.length
            ? (value + (e.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length
            : 0,
        );
      }
      if (e.key === 'Enter' && open && results[active]) {
        e.preventDefault();
        choose(results[active]);
      }
    };
    const outside = (e) => {
      if (
        !input.closest('[data-name="Search"]').contains(e.target) &&
        !popup.current?.contains(e.target)
      )
        setOpen(false);
    };
    const focus = () => setOpen(!!workspaceQuery.trim());
    place();
    input.addEventListener('focus', focus);
    document.addEventListener('keydown', key);
    document.addEventListener('pointerdown', outside);
    addEventListener('resize', place);
    addEventListener('scroll', place, true);
    return () => {
      input.removeEventListener('focus', focus);
      document.removeEventListener('keydown', key);
      document.removeEventListener('pointerdown', outside);
      removeEventListener('resize', place);
      removeEventListener('scroll', place, true);
    };
  }, [open, workspaceQuery, active, language, results]);
  return open && workspaceQuery.trim()
    ? createPortal(
        <section
          className="workspace-search-popup"
          ref={popup}
          style={position}
          dir={ar ? 'rtl' : 'ltr'}
        >
          <p className="workspace-search-caption">
            {ar ? 'نتائج من صفحات مساحة العمل' : 'Results across your workspace'}
          </p>
          <div
            role="listbox"
            id="workspace-search-results"
            aria-label={ar ? 'نتائج البحث' : 'Search results'}
          >
            {results.map((result, index) => (
              <button
                type="button"
                role="option"
                id={'workspace-search-option-' + index}
                aria-selected={active === index}
                key={result.id}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(result)}
              >
                <strong dir="auto">{result.title}</strong>
                <small>
                  {result.section}
                  {result.description ? ' · ' + result.description : ''}
                </small>
              </button>
            ))}
          </div>
          {!results.length && (
            <p className="workspace-search-empty" role="status">
              {ar
                ? 'لا توجد نتائج مطابقة. جرّبي كلمة أخرى.'
                : 'No matching results. Try another word.'}
            </p>
          )}
        </section>,
        document.body,
      )
    : null;
}
