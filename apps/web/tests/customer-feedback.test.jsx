import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CustomerFeedback from '../src/features/customer-feedback/CustomerFeedback.jsx';

function openSurvey(state) {
  history.replaceState(null, '', `/preview/?screen=${state}#/customer-feedback`);
  return render(<CustomerFeedback language="ar" />);
}

describe('Arabic customer survey preview', () => {
  it('localizes the missing-answer review and preserved answer values', () => {
    openSurvey('incomplete');
    expect(
      screen.getByRole('button', { name: /التجربة العامة.*مطلوب.*لم تتم الإجابة/ }),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: /سبب الزيارة.*عمل أو دراسة/ })).toBeVisible();
    expect(screen.getByRole('button', { name: /أول زيارة.*أيوه/ })).toBeVisible();
    expect(screen.queryByText('Required · Not answered')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /الفرع.*الزمالك/ }));
    fireEvent.click(screen.getByRole('button', { name: 'التالي' }));
    expect(screen.getByText('الزمالك · زيارتك الأخيرة')).toBeVisible();
  });

  it.each([
    ['branch', 'group', 'أي فرع زرت؟'],
    ['rating', 'button', '1 من ٥'],
    ['comment', 'textbox', 'هل هناك شيء يمكننا تحسينه؟'],
  ])('localizes the accessible controls on %s', (state, role, name) => {
    openSurvey(state);
    expect(screen.getByRole(role, { name })).toBeVisible();
  });

  it.each([
    ['rating', 'سيئة جدًا', 'ممتازة'],
    ['recommendation', '٠ · غير محتمل إطلاقًا', '١٠ · محتمل جدًا'],
  ])('keeps %s scale endpoints aligned with ascending scores in RTL', (state, low, high) => {
    openSurvey(state);
    const first = screen.getByText(low);
    const last = screen.getByText(high);
    expect(first.parentElement).toHaveAttribute('dir', 'ltr');
    expect(first).toHaveAttribute('dir', 'rtl');
    expect(last).toHaveAttribute('dir', 'rtl');
  });
});
