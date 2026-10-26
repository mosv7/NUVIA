import { useEffect, useState } from 'react';
export const ACTION_ROUTES = {
  business: '#/business',
  settings: '#/settings',
  subscription: '#/subscription',
  surveys: '#/survey-all',
  'create-survey': '#/survey-create',
  feedbacks: '#/feedbacks',
  'action-board': '#/action-board',
  analytics: '#/analytics-sentiment',
  'compare-branches': '#/analytics-comparison',
  reports: '#/reports',
  'generate-ai-report': '#/reports?generate=1',
  evidence: '#/evidence',
  assistant: '#/nuvia-assistant',
  dashboard: '#/dashboard',
  'view-evidence': '#/feedback-details?id=1248',
};
const legacyLabels = {
  Business: 'business',
  Segments: 'business',
  Settings: 'settings',
  Subscription: 'subscription',
  'Manage business': 'business',
  'Manage subscription': 'subscription',
  'View profile': 'settings',
  Surveys: 'surveys',
  'Create Survey': 'create-survey',
  'Create survey': 'create-survey',
  'View All Responses': 'feedbacks',
  'View all responses': 'feedbacks',
  'Action board': 'action-board',
  Analytics: 'analytics',
  'Compare branches': 'compare-branches',
  Reports: 'reports',
  'Generate AI Report': 'generate-ai-report',
  'All responses': 'feedbacks',
  'All feedbacks': 'feedbacks',
  Feedbacks: 'feedbacks',
  'Feedbacks 12': 'feedbacks',
  'Explore all 1,250 reviews': 'feedbacks',
  'View Related Responses': 'feedbacks',
  'View evidence': 'evidence',
  'NUVIA Assistant': 'assistant',
  Overview: 'dashboard',
  'View results': 'analytics',
  'Export report': 'export-report',
  'Upload file': 'upload-file',
  'Help center': 'help-center',
  'Share a survey': 'share-survey',
  'Ask NUVIA': 'ask-nuvia',
  'Add business': 'add-business',
  'View evidence ↗': 'view-evidence',
};
const normalize = (value) =>
  String(value ?? '')
    .replace(/[→←↑↓↗↖]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
// Compatibility for imported reference markup only; application dispatch uses stable IDs.
export function actionIdFromLabel(label, tr = (text) => text) {
  const value = normalize(label);
  const key = Object.keys(legacyLabels).find(
    (key) =>
      normalize(key) === value ||
      normalize(tr(key)) === value ||
      normalize(tr(key + ' →')) === value ||
      normalize(tr(key + ' ↗')) === value,
  );
  return key ? legacyLabels[key] : null;
}
export function routeForAction(id) {
  return Object.hasOwn(ACTION_ROUTES, id) ? ACTION_ROUTES[id] : null;
}
export function routeForLabel(label, tr) {
  return routeForAction(actionIdFromLabel(label, tr));
}

// Each browser-history entry owns its filters and scroll position.
const entries = new Map();
let activeEntry;
let restoring = false;
let installed = false;
let navigationOrigin = false;
const workspaceRoute = (hash) =>
  /^#\/(dashboard|feedback|analytics-|reports|report-details|survey-|nuvia-assistant)/.test(
    hash || '',
  );
function currentEntry() {
  if (typeof window === 'undefined' || !window.history?.replaceState) return null;
  const existing = window.history.state?.nuviaEntry;
  if (existing?.hash === window.location.hash) {
    if (!entries.has(existing.id))
      entries.set(existing.id, {
        ...existing,
        view: existing.view || {},
        x: existing.x || 0,
        y: existing.y || 0,
      });
    return entries.get(existing.id);
  }
  const entry = {
    id: globalThis.crypto?.randomUUID?.() || String(Date.now()) + Math.random(),
    hash: window.location.hash,
    previous: activeEntry?.hash,
    fromNavigation: navigationOrigin,
    view: {},
    x: 0,
    y: 0,
  };
  entries.set(entry.id, entry);
  window.history.replaceState({ ...window.history.state, nuviaEntry: entry }, '');
  return entry;
}
export function useRouteState(key, initial) {
  const [entry] = useState(currentEntry);
  const [value, update] = useState(() =>
    entry && key in entry.view
      ? entry.view[key]
      : typeof initial === 'function'
        ? initial()
        : initial,
  );
  useEffect(() => {
    if (entry) entry.view[key] = value;
  }, [entry, key, value]);
  return [value, update];
}
export function canGoBack() {
  return workspaceRoute(currentEntry()?.previous);
}
export function canShowContextBack() {
  const entry = currentEntry();
  return canGoBack() && !entry?.fromNavigation && entry?.hash !== '#/dashboard';
}
export function goBack() {
  if (canGoBack()) window.history.back();
}
export function installRouteHistory() {
  if (installed) return () => {};
  installed = true;
  activeEntry = currentEntry();
  const oldRestoration = window.history.scrollRestoration;
  window.history.scrollRestoration = 'manual';
  const saveScroll = () => {
    if (activeEntry && !restoring) {
      activeEntry.x = window.scrollX;
      activeEntry.y = window.scrollY;
    }
  };
  const change = () => {
    const next = currentEntry();
    if (!next || next.id === activeEntry?.id) return;
    activeEntry = next;
    restoring = true;
    const { x, y } = next;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        window.scrollTo(x, y);
        restoring = false;
      }),
    );
  };
  const backLink = (event) => {
    navigationOrigin = !!event.target.closest?.(
      '.product-navigation, .analytics-tabs, .analytics-mobile-navigation, [data-name="Status tab"]',
    );
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
      return;
    if (
      event.target.closest?.(
        '.feedback-back, [data-name="Back to reports"], [data-name="Back to surveys"], [data-survey-action="Back to Surveys"], [data-survey-action="All surveys"]',
      ) &&
      canGoBack()
    ) {
      event.preventDefault();
      event.stopPropagation();
      goBack();
    }
  };
  window.addEventListener('hashchange', change);
  window.addEventListener('scroll', saveScroll, { passive: true });
  document.addEventListener('click', backLink, true);
  return () => {
    installed = false;
    window.history.scrollRestoration = oldRestoration;
    window.removeEventListener('hashchange', change);
    window.removeEventListener('scroll', saveScroll);
    document.removeEventListener('click', backLink, true);
  };
}
