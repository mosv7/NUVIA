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
