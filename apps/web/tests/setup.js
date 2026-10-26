import { safeLocalStorage, safeSessionStorage } from '../src/lib/storage.js';
import '@testing-library/jest-dom/vitest';
import { cleanup, configure } from '@testing-library/react';

// Lazy route imports can exceed the library's 1s default on cold Windows CI caches.
configure({ asyncUtilTimeout: 5000 });
import { afterEach, beforeEach } from 'vitest';

// jsdom does not implement the browser dialog lifecycle used by feature cards.
HTMLDialogElement.prototype.showModal = function () {
  this.open = true;
};
HTMLDialogElement.prototype.close = function () {
  this.open = false;
};

beforeEach(() => {
  localStorage.clear();
  for (const store of [safeLocalStorage, safeSessionStorage]) {
    while (store.length) store.removeItem(store.key(0));
  }
  history.replaceState(null, '', '/#/landing');
  document.documentElement.dir = 'ltr';
  document.documentElement.lang = 'en';
});

afterEach(() => cleanup());

// Browser-only APIs used by the shared analytics assistant.
HTMLDialogElement.prototype.show = function () {
  this.open = true;
};
Element.prototype.scrollIntoView = function () {};
window.scrollTo = function () {};

// jsdom has no media-query engine; animation tests use a stable browser contract.
window.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener() {},
  removeListener() {},
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() {
    return true;
  },
});

class VisibilityObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe(target) {
    this.callback([{ target, isIntersecting: true }]);
  }
  unobserve() {}
  disconnect() {}
}
globalThis.IntersectionObserver = VisibilityObserver;
