import { describe, it, expect } from 'vitest';
import { en, ar } from '../src/lib/i18n/auth-copy.js';
import { setupCopy } from '../src/features/workspaces/setup-copy.js';
describe('language contracts', () => {
  it('has matching English and Arabic authentication keys', () =>
    expect(Object.keys(ar).sort()).toEqual(Object.keys(en).sort()));
  it('has matching onboarding keys', () =>
    expect(Object.keys(setupCopy.ar).sort()).toEqual(Object.keys(setupCopy.en).sort()));
  it.each(['en', 'ar'])('has no blank translations in %s', (language) => {
    for (const value of Object.values(language === 'en' ? en : ar))
      expect(typeof value === 'string' && value.trim().length > 0).toBe(true);
  });
});
