import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { it, expect, vi } from 'vitest';
import App from '../src/app/App.jsx';
import { authApi } from '../src/features/auth/api.js';

it.each(['feedbacks', 'feedbacks-empty', 'feedback-details'])(
  'keeps the reviewed empty feedback layout on the account route %s',
  async (route) => {
    vi.spyOn(authApi, 'session').mockResolvedValue({
      user: { id: 'owner', name: 'Actual Owner', emailVerified: true },
      workspace: {
        id: 'workspace',
        businessName: 'Actual Cafe',
        industry: 'Cafe',
        onboardingStep: 'complete',
        branches: [],
      },
    });
    history.replaceState(null, '', '/#/' + route);
    render(<App />);
    expect(
      await screen.findByRole('heading', { name: 'Your first response starts here' }),
    ).toBeVisible();
    expect(screen.getByRole('region', { name: 'Filters' })).toBeVisible();
    expect(document.querySelectorAll('.feedback-filter')).toHaveLength(6);
    expect(screen.getByRole('button', { name: 'Segment', exact: true })).toBeDisabled();
    expect(screen.getByRole('table')).toBeVisible();
    expect(screen.getByText('0 responses', { exact: true })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Export', exact: true })).toBeDisabled();
    expect(screen.getByText('Create your survey')).toBeVisible();
    expect(screen.getAllByText('Actual Cafe').length).toBeGreaterThan(0);
    expect(screen.queryByText('Bloom & Co.')).not.toBeInTheDocument();
    expect(screen.queryByText('1,248 / 5,000 responses')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View sample responses' })).toHaveAttribute(
      'href',
      '/preview/#/feedbacks',
    );
    const clipboard = vi.fn();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: clipboard },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Share a survey', exact: true }));
    expect(screen.getByRole('status')).toHaveTextContent('This feature is not available yet.');
    expect(clipboard).not.toHaveBeenCalled();
    expect(location.hash).toBe('#/' + route);
  },
);

it.each([
  [
    'en',
    'Create a survey for Bloom & Co. Once your first responses arrive, your metrics, charts and AI insights will appear here.',
  ],
  [
    'ar',
    'أنشئ استبيانًا لـ Bloom & Co. بمجرد وصول أول ردود العملاء، ستظهر هنا مؤشراتك ورسومك البيانية ورؤى الذكاء الاصطناعي.',
  ],
])(
  'preserves the reviewed overview empty copy in the %s design preview',
  async (language, copy) => {
    localStorage.setItem('nuvia-language', language);
    history.replaceState(null, '', '/preview/#/dashboard-empty');
    render(<App />);
    expect(await screen.findByText(copy)).toBeVisible();
  },
);
