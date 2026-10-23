import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
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
