import { describe, it, expect } from 'vitest';
import { validateAuth } from '../src/validation/auth.js';
const valid = {
  name: 'Sara',
  email: 'sara@example.com',
  password: 'Password12',
  confirm: 'Password12',
  terms: true,
};
describe('authentication validation', () => {
  it('accepts a complete signup', () => expect(validateAuth('signup', valid)).toEqual({}));
  it('requires signup fields and consent', () =>
    expect(
      validateAuth('signup', { name: ' ', email: '', password: '', confirm: '', terms: false }),
    ).toEqual({ name: 'required', email: 'required', password: 'required', terms: 'termsError' }));
  it.each(['a', 'a@', '@example.com', 'a b@example.com'])('rejects invalid email %s', (email) =>
    expect(validateAuth('forgot', { ...valid, email }).email).toBe('invalidEmail'),
  );
  it.each(['short1', 'abcdefgh', '12345678'])('rejects weak signup passwords', (password) =>
    expect(validateAuth('signup', { ...valid, password, confirm: password }).password).toBe(
      'weakPassword',
    ),
  );
  it('accepts existing login passwords without signup complexity rules', () =>
    expect(validateAuth('login', { ...valid, password: 'old' })).toEqual({}));
  it('requires matching confirmation', () =>
    expect(validateAuth('reset', { ...valid, confirm: 'different' }).confirm).toBe('mismatch'));
  it('reset does not require an email', () =>
    expect(validateAuth('reset', { ...valid, email: '' })).toEqual({}));
  it('forgot only requires email', () =>
    expect(validateAuth('forgot', { ...valid, password: '', confirm: '' })).toEqual({}));
});

describe('remaining validation branches', () => {
  it('rejects empty reset passwords', () =>
    expect(validateAuth('reset', { ...valid, password: '', confirm: '' }).password).toBe(
      'required',
    ));
  it('accepts a valid reset', () => expect(validateAuth('reset', valid)).toEqual({}));
  it('rejects an empty login password', () =>
    expect(validateAuth('login', { ...valid, password: '' }).password).toBe('required'));
  it('does not require signup consent on login', () =>
    expect(validateAuth('login', { ...valid, terms: false })).toEqual({}));
  it('rejects a blank signup name', () =>
    expect(validateAuth('signup', { ...valid, name: '  ' }).name).toBe('required'));
});
