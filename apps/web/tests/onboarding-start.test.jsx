import { it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GetStartedPage from '../src/features/workspaces/GetStartedPage.jsx';
import { setupCopy } from '../src/features/workspaces/setup-copy.js';
it.each(['en', 'ar'])(
  'finishes connected onboarding in %s via the supplied callback',
  (language) => {
    const onStart = vi.fn();
    render(
      <GetStartedPage
        copy={setupCopy[language]}
        values={{ businessName: 'Cafe', industry: 'Food', branchType: 'single' }}
        onEdit={() => {}}
        onStart={onStart}
      />,
    );
    fireEvent.click(
      screen.getByRole('button', { name: setupCopy[language].getStarted, exact: true }),
    );
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('status')).toBeNull();
  },
);
