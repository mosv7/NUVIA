import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { ProductProvider } from '../src/app/providers/ProductProvider.jsx';
import AssistantScreen from '../src/features/reports/preview/AssistantScreen.jsx';
import Assistant from '../src/features/ai-analysis/preview/Assistant.jsx';
import OwnedFeedbackDetail from '../src/features/feedback/OwnedFeedbackDetail.jsx';
import { assistantApi } from '../src/features/ai-analysis/api.js';
import { feedbackApi } from '../src/features/feedback/api.js';
const workspace = { id: 'one', businessName: 'Real Cafe', branches: [] };
const metrics = {
  totalResponses: 1,
  writtenResponses: 1,
  analysisStatuses: { baseline: 1 },
  sentiments: {},
  negativeAspects: [],
};
function Wrapper({ children, preview = false, language = 'en' }) {
  return (
    <ProductProvider
      preview={preview}
      workspace={workspace}
      language={language}
      setLanguage={() => {}}
      dashboard={{
        filters: { branch: 'all', start: '2026-10-01', end: '2026-10-31' },
        setFilters: () => {},
        openDate: () => {},
      }}
    >
      {children}
    </ProductProvider>
  );
}
afterEach(() => vi.restoreAllMocks());
it('renders real exact-source answers and owned source destinations on the page', async () => {
  vi.spyOn(assistantApi, 'context').mockResolvedValue({ branches: [], metrics });
  const ask = vi.spyOn(assistantApi, 'answer').mockResolvedValue({
    status: 'answered',
    items: [
      {
        text: 'Coffee was cold',
        citations: [
          {
            id: 'e1',
            quote: 'Coffee was cold',
            responseId: '012345678901234567890123',
            number: 7,
          },
        ],
      },
    ],
    metrics,
    coverage: { candidateLimit: 500, candidatesScanned: 1, evidenceCount: 1, sampled: true },
    provenance: { quality_accepted: false },
  });
  render(
    <Wrapper>
      <AssistantScreen />
    </Wrapper>,
  );
  fireEvent.change(screen.getByRole('textbox', { name: 'Ask about your feedback' }), {
    target: { value: 'Coffee?' },
  });
  fireEvent.keyDown(screen.getByRole('textbox', { name: 'Ask about your feedback' }), {
    key: 'Enter',
  });
  const source = await screen.findByRole('link', { name: 'View original feedback' });
  expect(source).toHaveAttribute('href', '#/feedback-details?id=012345678901234567890123');
  expect(screen.getAllByText('Coffee was cold')).toHaveLength(1);
  expect(
    screen.getByText(
      'Based on 1 selected source from 1 recent written response. This is a sample.',
    ),
  ).toBeVisible();
  expect(
    screen.getByText(
      'Original customer excerpts are shown with their sources. Counts come from stored feedback in the selected scope.',
    ),
  ).toBeVisible();
  expect(screen.getByText(/AI evidence selection is experimental/)).toBeVisible();
  expect(ask.mock.calls[0][0]).toMatchObject({
    question: 'Coffee?',
    locale: 'en',
    from: '2026-10-01',
    to: '2026-10-31',
  });
  fireEvent.click(screen.getByRole('button', { name: 'New conversation' }));
  expect(screen.queryByRole('link', { name: 'View original feedback' })).not.toBeInTheDocument();
});
it('keeps preview questions local and does not call the assistant API', async () => {
  const read = vi.spyOn(assistantApi, 'context'),
    write = vi.spyOn(assistantApi, 'answer');
  render(
    <Wrapper preview>
      <AssistantScreen />
    </Wrapper>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'What are the most common complaints?' }));
  expect(await screen.findByText('Preview answer')).toBeVisible();
  expect(read).not.toHaveBeenCalled();
  expect(write).not.toHaveBeenCalled();
});
it('connects Arabic floating questions and clears private evidence on close', async () => {
  vi.spyOn(assistantApi, 'context').mockResolvedValue({ branches: [], metrics });
  vi.spyOn(assistantApi, 'answer').mockResolvedValue({
    status: 'insufficient_evidence',
    items: [],
    metrics,
  });
  render(
    <Wrapper language="ar">
      <Assistant />
    </Wrapper>,
  );
  fireEvent.click(screen.getAllByRole('button', { name: 'افتح مساعد NUVIA' })[0]);
  fireEvent.change(screen.getByRole('textbox', { name: 'رسالتك للمساعد' }), {
    target: { value: 'القهوة؟' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'إرسال' }));
  expect(await screen.findByText(/لا توجد أدلة كافية/)).toBeVisible();
  fireEvent.keyDown(window, { key: 'Escape' });
  await waitFor(() => expect(screen.queryByText(/لا توجد أدلة كافية/)).not.toBeInTheDocument());
});
it('loads owned feedback and analysis rather than sample records', async () => {
  history.replaceState(null, '', '/#/feedback-details?id=012345678901234567890123');
  vi.spyOn(feedbackApi, 'detail').mockResolvedValue({
    id: '012345678901234567890123',
    number: 7,
    original: { text: 'Actual stored words', question: 'How was it?' },
    branch: { name: 'Main' },
    survey: { name: 'My survey' },
    submittedAt: '2026-10-31T12:00:00Z',
    analysisStatus: 'pending',
  });
  vi.spyOn(feedbackApi, 'analysis').mockResolvedValue({
    status: 'pending',
    aspects: [],
    provenance: null,
  });
  render(
    <Wrapper>
      <OwnedFeedbackDetail />
    </Wrapper>,
  );
  expect(await screen.findByText('Actual stored words')).toBeVisible();
  expect(screen.getByText('Pending')).toBeVisible();
  expect(screen.queryByText(/25-minute/)).not.toBeInTheDocument();
});

it('shows an empty scoped corpus without sample evidence or invented neutral counts', async () => {
  vi.spyOn(assistantApi, 'context').mockResolvedValue({
    branches: [],
    metrics: {
      totalResponses: 0,
      writtenResponses: 0,
      analysisStatuses: { pending: 0, baseline: 0, accepted: 0 },
      sentiments: { positive: 0, negative: 0, neutral: 0, mixed: 0 },
      negativeAspects: [],
    },
  });
  render(
    <Wrapper>
      <AssistantScreen />
    </Wrapper>,
  );
  expect(await screen.findByText(/No responses in the selected scope/)).toBeVisible();
  expect(screen.queryByRole('link', { name: 'View original feedback' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByText('Analysis and sentiment'));
  expect(screen.getByText(/Sentiment and aspect counts include quality-accepted/)).toBeVisible();
  expect(screen.getByText('Quality accepted')).toBeVisible();
  expect(screen.getByText('Pending')).toBeVisible();
  expect(screen.getByText('Baseline')).toBeVisible();
});
it('keeps original stored words readable when analysis fails independently', async () => {
  history.replaceState(null, '', '/#/feedback-details?id=012345678901234567890123');
  vi.spyOn(feedbackApi, 'detail').mockResolvedValue({
    number: 7,
    original: { text: '<img src=x onerror=alert(1)>' },
    submittedAt: '2026-10-31T12:00:00Z',
  });
  vi.spyOn(feedbackApi, 'analysis').mockRejectedValue(new Error('offline'));
  render(
    <Wrapper>
      <OwnedFeedbackDetail />
    </Wrapper>,
  );
  expect(await screen.findByText('<img src=x onerror=alert(1)>')).toBeVisible();
  expect(await screen.findByRole('alert')).toHaveTextContent('Analysis could not be loaded');
  expect(document.querySelector('.feedback-customer-words img')).toBeNull();
});

it.each([
  ['en', 'Summarize customer feedback', 'English interface', 'القهوة ممتازة لكن الخدمة بطيئة.'],
  ['ar', 'لخص آراء العملاء', 'واجهة عربية', 'The coffee was good but service was slow.'],
])(
  'asks the supported overview in the %s interface and preserves the source language',
  async (language, question, badge, quote) => {
    vi.spyOn(assistantApi, 'context').mockResolvedValue({ branches: [], metrics });
    const answer = vi.spyOn(assistantApi, 'answer').mockResolvedValue({
      status: 'answered',
      items: [
        {
          text: quote,
          citations: [{ id: 'e1', quote, responseId: '012345678901234567890123', number: 7 }],
        },
      ],
      metrics,
      provenance: { quality_accepted: false },
    });
    render(
      <Wrapper language={language}>
        <AssistantScreen />
      </Wrapper>,
    );
    expect(screen.getByText(badge)).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: question }));
    expect(await screen.findByText(quote)).toBeVisible();
    expect(screen.getAllByText(quote)).toHaveLength(1);
    expect(answer).toHaveBeenCalledWith(
      expect.objectContaining({ question, locale: language }),
      expect.any(AbortSignal),
    );
  },
);
it('keeps the approved comparison suggestion and answer-language badge in the design preview', async () => {
  const answer = vi.spyOn(assistantApi, 'answer');
  render(
    <Wrapper preview>
      <AssistantScreen />
    </Wrapper>,
  );
  expect(screen.getByText('English answers')).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'What changed this month?' }));
  expect(await screen.findByText('Preview answer')).toBeVisible();
  expect(answer).not.toHaveBeenCalled();
});
