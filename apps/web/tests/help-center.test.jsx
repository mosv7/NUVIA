import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HelpCenterPage from '../src/features/workspace/HelpCenterPage.jsx';

describe('Help center page', () => {
  it('renders honest self-service help without a support form', () => {
    const { container } = render(<HelpCenterPage language="en" />);

    expect(screen.getByRole('heading', { name: 'Help center', level: 1 })).toBeVisible();
    expect(screen.getByText('Self-service help only')).toBeVisible();
    expect(
      screen.getByText(/Live chat, email support and support tickets are not part/),
    ).toBeVisible();
    expect(container.querySelector('input, textarea, select')).toBeNull();
    expect(screen.queryByRole('button', { name: /send|submit|contact/i })).not.toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Back to Overview' })[0]).toHaveAttribute(
      'href',
      '#/dashboard',
    );

    const question = screen.getByText('Can I contact support from this page?');
    const details = question.closest('details');
    expect(details.open).toBe(false);
    fireEvent.click(question);
    expect(details.open).toBe(true);
    expect(screen.getByText(/Nothing you type here is sent or stored/)).toBeVisible();
  });

  it('renders Arabic help content with real workspace links', () => {
    const { container } = render(<HelpCenterPage language="ar" />);

    expect(screen.getByRole('heading', { name: 'مركز المساعدة', level: 1 })).toBeVisible();
    expect(screen.getByText('مساعدة ذاتية فقط')).toBeVisible();
    expect(screen.getByText(/الدردشة المباشرة والدعم عبر البريد/)).toBeVisible();
    expect(container.querySelector('a[href="#/survey-all"]')).not.toBeNull();
    expect(screen.getByText('الاستبيانات')).toBeVisible();
    expect(screen.getAllByRole('link', { name: 'العودة إلى النظرة العامة' })[0]).toHaveAttribute(
      'href',
      '#/dashboard',
    );
  });
});
