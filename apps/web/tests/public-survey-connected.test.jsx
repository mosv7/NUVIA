import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import App from '../src/app/App.jsx';
import { authApi } from '../src/features/auth/api.js';
import { publicSurveyApi } from '../src/features/public-surveys/api.js';

const questionId = '507f1f77bcf86cd799439011';
const optionId = '507f191e810c19729de860ea';

afterEach(() => {
  vi.restoreAllMocks();
  history.replaceState(null, '', '/');
});

it('submits every answer with a stable submission id through the connected public form', async () => {
  vi.spyOn(authApi, 'session').mockResolvedValue({
    user: { id: 'owner', emailVerified: true },
    workspace: {
      id: 'workspace',
      businessName: 'Actual Cafe',
      industry: 'Cafe',
      onboardingStep: 'complete',
      branches: [],
    },
  });
  vi.spyOn(publicSurveyApi, 'get').mockResolvedValue({
    formVersion: 'a'.repeat(64),
    survey: {
      name: 'Customer survey',
      defaultLanguage: 'en',
      isAnonymous: true,
      thankYouMessage: 'Thank you!',
    },
    branch: { slug: 'main' },
    state: 'open',
    questions: [
      {
        id: questionId,
        type: 'multiple_choice',
        questionTextEn: 'How was your visit?',
        isRequired: true,
        options: [{ id: optionId, label: { en: 'Good' } }],
      },
    ],
  });
  const submit = vi
    .spyOn(publicSurveyApi, 'submit')
    .mockResolvedValue({ data: { receipt: 'saved' } });

  history.replaceState(null, '', '/#/public-survey?code=abc123');
  render(<App />);
  expect(await screen.findByText(/How was your visit\?/)).toBeVisible();
  fireEvent.click(screen.getByLabelText('Good'));
  fireEvent.click(screen.getByRole('button', { name: 'Submit feedback' }));

  await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
  expect(submit.mock.calls[0][0]).toBe('abc123');
  const body = submit.mock.calls[0][1];
  expect(body.formVersion).toBe('a'.repeat(64));
  expect(body.submissionId).toMatch(/^[A-Za-z0-9-]{8,64}$/);
  expect(body.answers).toEqual([{ questionId, optionIds: [optionId] }]);
  expect(body.branch).toBe('main');
  expect(await screen.findByText('Thank you!')).toBeVisible();
});
