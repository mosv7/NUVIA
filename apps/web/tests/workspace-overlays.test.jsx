import { it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductProvider, useProductView } from '../src/app/providers/ProductProvider.jsx';
import Assistant from '../src/features/ai-analysis/preview/Assistant.jsx';
function Trigger() {
  const { openTopbar } = useProductView();
  return (
    <button onClick={(event) => openTopbar('profile', event.currentTarget)}>Open account</button>
  );
}
function mount(preview = false) {
  render(
    <ProductProvider
      language="en"
      setLanguage={() => {}}
      preview={preview}
      workspace={{ businessName: 'Review Cafe', branches: [] }}
      onLogout={async () => {}}
    >
      <Trigger />
      {preview && <Assistant />}
    </ProductProvider>,
  );
}
it('keeps illustrative assistant evidence inside explicit preview routes', () => {
  mount(true);
  fireEvent.click(screen.getByRole('button', { name: 'Open Ask NUVIA' }));
  expect(screen.getByRole('link', { name: 'View supporting feedback' })).toHaveAttribute(
    'href',
    '/preview/#/feedbacks',
  );
  fireEvent.change(screen.getByRole('textbox', { name: 'Message NUVIA' }), {
    target: { value: 'waiting times' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
  expect(screen.getByRole('link', { name: /Review available evidence/ })).toHaveAttribute(
    'href',
    '/preview/#/feedbacks?evidence=wait',
  );
});
it('does not show fabricated customer evidence or replies in a connected workspace', () => {
  mount(false);
  fireEvent.click(screen.getByRole('button', { name: 'Open Ask NUVIA' }));
  expect(screen.queryByRole('link', { name: 'View supporting feedback' })).not.toBeInTheDocument();
  expect(screen.getAllByText(/AI Assistant is not available yet/).length).toBeGreaterThan(0);
  fireEvent.change(screen.getByRole('textbox', { name: 'Message NUVIA' }), {
    target: { value: 'waiting times' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
  expect(screen.queryByText(/104 reviews mention delays/)).not.toBeInTheDocument();
});
it.each([
  ['View profile', '#/settings'],
  ['Account & security', '#/settings-security'],
])('opens the approved settings screen from %s', async (label, destination) => {
  const user = userEvent.setup();
  mount();
  await user.click(screen.getByRole('button', { name: 'Open account' }));
  await user.click(screen.getByRole('button', { name: label, exact: true }));
  expect(location.hash).toBe(destination);
  expect(screen.queryByRole('button', { name: label, exact: true })).not.toBeInTheDocument();
});
it('Escape closes the account menu and restores its trigger', async () => {
  const user = userEvent.setup();
  mount();
  const trigger = screen.getByRole('button', { name: 'Open account' });
  await user.click(trigger);
  expect(screen.getByRole('button', { name: 'View profile', exact: true })).toBeVisible();
  await user.keyboard('{Escape}');
  expect(
    screen.queryByRole('button', { name: 'View profile', exact: true }),
  ).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});
