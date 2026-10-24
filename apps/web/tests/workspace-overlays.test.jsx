import React from 'react';
import { it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductProvider, useProductView } from '../src/app/providers/ProductProvider.jsx';
import Assistant from '../src/features/ai-analysis/preview/Assistant.jsx';
function AccountTrigger() {
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
      <AccountTrigger />
      {preview && <Assistant />}
    </ProductProvider>,
  );
}
it.each([false, true])(
  'keeps sample summary and reply evidence in preview mode (preview=%s)',
  async (preview) => {
    mount(preview);
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
  },
);
it.each(['View profile', 'Account & security'])(
  'contains keyboard focus and restores the account trigger after closing %s',
  async (menuItem) => {
    const user = userEvent.setup();
    mount();
    const trigger = screen.getByRole('button', { name: 'Open account' });
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: menuItem, exact: true }));
    const dialog = screen.getByRole('dialog');
    const done = within(dialog).getByRole('button', { name: 'Done' });
    expect(done).toHaveFocus();
    const first = within(dialog).getAllByRole('button')[0];
    await user.tab();
    expect(first).toHaveFocus();
    await user.tab({ shift: true });
    expect(done).toHaveFocus();
    trigger.focus();
    expect(dialog.contains(document.activeElement)).toBe(true);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  },
);
it('restores account focus after Done and backdrop dismissal', async () => {
  const user = userEvent.setup();
  mount();
  const trigger = screen.getByRole('button', { name: 'Open account' });
  for (const dismiss of ['done', 'backdrop']) {
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'View profile', exact: true }));
    if (dismiss === 'done') await user.click(screen.getByRole('button', { name: 'Done' }));
    else fireEvent.click(screen.getByRole('dialog').parentElement);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  }
});
