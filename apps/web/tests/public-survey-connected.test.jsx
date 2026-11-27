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

it('uses the Arabic form language and labels, and omits cleared optional answers', async () => {
  vi.spyOn(authApi, 'session').mockResolvedValue(null);
  vi.spyOn(publicSurveyApi, 'get').mockResolvedValue({
    formVersion: 'b'.repeat(64),
    survey: { name: 'استبيان', languages: ['en', 'ar'], defaultLanguage: 'en', isAnonymous: false },
    state: 'open',
    questions: [
      {
        id: questionId,
        type: 'long_text',
        questionTextEn: 'Tell us more',
        questionTextAr: 'أخبرنا بالمزيد',
        isRequired: true,
      },
      {
        id: optionId,
        type: 'yes_no',
        questionTextEn: 'Would you return?',
        questionTextAr: 'هل ستعود؟',
      },
    ],
  });
  const submit = vi.spyOn(publicSurveyApi, 'submit').mockResolvedValue({});
  history.replaceState(null, '', '/?lang=ar#/public-survey?code=abc123');
  render(<App />);

  const comments = await screen.findByRole('textbox', { name: /أخبرنا بالمزيد/ });
  expect(comments.closest('main')).toHaveAttribute('dir', 'rtl');
  expect(screen.getByRole('textbox', { name: 'البريد الإلكتروني' })).toBeVisible();
  fireEvent.change(comments, { target: { value: 'خدمة رائعة' } });
  const yesNo = screen.getByRole('combobox', { name: /هل ستعود/ });
  fireEvent.change(yesNo, { target: { value: 'true' } });
  fireEvent.change(yesNo, { target: { value: '' } });
  fireEvent.click(screen.getByRole('button', { name: 'إرسال الملاحظات' }));
  await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
  expect(submit.mock.calls[0][1]).toMatchObject({
    language: 'ar',
    answers: [{ questionId, value: 'خدمة رائعة' }],
  });
});

it('shows an unavailable link without a continuing loading indicator', async () => {
  vi.spyOn(authApi, 'session').mockResolvedValue(null);
  vi.spyOn(publicSurveyApi, 'get').mockRejectedValue(Object.assign(new Error(), { status: 404 }));
  history.replaceState(null, '', '/?lang=en#/public-survey?code=unknown');
  render(<App />);
  expect(await screen.findByRole('alert')).toHaveTextContent('This survey link is unavailable.');
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

it('reloads revised questions and issues a new submission ID after a version conflict', async () => {
  const form = (questionTextEn, formVersion) => ({
    state: 'open',
    formVersion,
    survey: { name: 'Customer survey', defaultLanguage: 'en', isAnonymous: true },
    questions: [{ id: questionId, type: 'short_text', questionTextEn, isRequired: true }],
  });
  vi.spyOn(authApi, 'session').mockResolvedValue(null);
  vi.spyOn(publicSurveyApi, 'get')
    .mockResolvedValueOnce(form('First prompt', 'a'.repeat(64)))
    .mockResolvedValueOnce(form('Revised prompt', 'b'.repeat(64)));
  const submit = vi
    .spyOn(publicSurveyApi, 'submit')
    .mockRejectedValueOnce(Object.assign(new Error(), { status: 409 }))
    .mockResolvedValueOnce({});
  history.replaceState(null, '', '/#/public-survey?code=abc123');
  render(<App />);

  fireEvent.change(await screen.findByRole('textbox', { name: /First prompt/ }), {
    target: { value: 'Old answer' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Submit feedback' }));
  const revised = await screen.findByRole('textbox', { name: /Revised prompt/ });
  expect(screen.getByRole('alert')).toHaveTextContent('The survey changed.');
  expect(revised).toHaveValue('');
  fireEvent.change(revised, { target: { value: 'New answer' } });
  fireEvent.click(screen.getByRole('button', { name: 'Submit feedback' }));
  await waitFor(() => expect(submit).toHaveBeenCalledTimes(2));
  expect(submit.mock.calls[1][1]).toMatchObject({
    formVersion: 'b'.repeat(64),
    answers: [{ questionId, value: 'New answer' }],
  });
  expect(submit.mock.calls[1][1].submissionId).not.toBe(submit.mock.calls[0][1].submissionId);
});
