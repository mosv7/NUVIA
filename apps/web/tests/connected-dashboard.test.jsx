import { it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardPage from '../src/features/dashboard/DashboardPage.jsx';
it('renders the approved empty overview for a connected workspace without sample data', () => {
  render(
    <DashboardPage
      empty
      preview={false}
      language="en"
      setLanguage={() => {}}
      workspace={{ businessName: 'Connected Cafe', industry: 'Cafe', branches: [] }}
    />,
  );
  expect(screen.getByRole('heading', { name: 'No responses yet' })).toBeInTheDocument();
  expect(screen.queryByText('1,248')).not.toBeInTheDocument();
});
