import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import useAssistantConversation from '../src/features/ai-analysis/useAssistantConversation.js';
import { assistantApi } from '../src/features/ai-analysis/api.js';
import { resetApiSession } from '../src/lib/http/client.js';
const metrics = {
  totalResponses: 2,
  writtenResponses: 1,
  analysisStatuses: { pending: 1 },
  sentiments: {},
  negativeAspects: [],
};
const context = { branches: [{ id: 'branch-1', name: 'Main' }], metrics };
const answer = {
  status: 'answered',
  items: [
    {
      text: 'Slow service',
      citations: [
        { id: 'e1', quote: 'Slow service', responseId: '012345678901234567890123', number: 7 },
      ],
    },
  ],
  metrics,
  coverage: { candidateLimit: 500, candidatesScanned: 1, evidenceCount: 1, sampled: true },
  provenance: { quality_status: 'baseline', quality_accepted: false },
};
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  resetApiSession();
});
it('uses session transport and scoped API fields, without credentials in the body', async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ csrfToken: 'csrf' }) })
    .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ data: answer }) });
  vi.stubGlobal('fetch', fetcher);
  await assistantApi.answer({
    question: 'Why?',
    locale: 'en',
    branchId: 'branch-1',
    from: '2026-10-01',
    to: '2026-10-31',
  });
  expect(fetcher.mock.calls[1][0]).toBe('/api/ai/assistant/answers');
  expect(fetcher.mock.calls[1][1]).toMatchObject({
    credentials: 'include',
    headers: { 'X-CSRF-Token': 'csrf' },
    body: JSON.stringify({
      question: 'Why?',
      locale: 'en',
      branchId: 'branch-1',
      from: '2026-10-01',
      to: '2026-10-31',
    }),
  });
});
it('ignores late completions and aborts when locale, scope, workspace or open state change', async () => {
  vi.spyOn(assistantApi, 'context').mockResolvedValue(context);
  let finish;
  const request = vi.spyOn(assistantApi, 'answer').mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  const { result, rerender } = renderHook((props) => useAssistantConversation(props), {
    initialProps: {
      enabled: true,
      workspaceId: 'one',
      locale: 'en',
      filters: { branch: 'all', start: '2026-10-01', end: '2026-10-31' },
    },
  });
  await waitFor(() => expect(result.current.context).toEqual(context));
  act(() => {
    result.current.setDraft('Why?');
  });
  act(() => {
    result.current.ask();
    result.current.ask();
  });
  expect(request).toHaveBeenCalledTimes(1);
  const signal = request.mock.calls[0][1];
  rerender({
    enabled: true,
    workspaceId: 'one',
    locale: 'ar',
    filters: { branch: 'branch-1', start: '2026-10-01', end: '2026-10-31' },
  });
  expect(signal.aborted).toBe(true);
  await act(async () => finish(answer));
  expect(result.current.messages).toEqual([]);
  expect(result.current.draft).toBe('');
  act(() => {
    result.current.ask('سؤال');
  });
  rerender({ enabled: false, workspaceId: 'two', locale: 'ar', filters: { branch: 'all' } });
  expect(request.mock.calls[1][1].aborted).toBe(true);
});
it('retains draft on errors, retries, and resets previous question on a new conversation', async () => {
  vi.spyOn(assistantApi, 'context').mockResolvedValue(context);
  const request = vi
    .spyOn(assistantApi, 'answer')
    .mockRejectedValueOnce(new Error('offline'))
    .mockResolvedValue(answer);
  const { result } = renderHook(() =>
    useAssistantConversation({
      enabled: true,
      workspaceId: 'one',
      locale: 'en',
      filters: { branch: 'all' },
    }),
  );
  await waitFor(() => expect(result.current.context).toEqual(context));
  await act(async () => result.current.ask('Why?'));
  expect(result.current.draft).toBe('Why?');
  expect(result.current.error).toBeTruthy();
  await act(async () => result.current.ask());
  expect(result.current.messages[0].answer).toEqual(answer);
  act(() => result.current.reset());
  await act(async () => result.current.ask('Again?'));
  expect(request.mock.calls[2][0].previousQuestion).toBeUndefined();
});
it('does not fetch context or answers in a disabled preview', async () => {
  const read = vi.spyOn(assistantApi, 'context');
  const write = vi.spyOn(assistantApi, 'answer');
  const { result } = renderHook(() =>
    useAssistantConversation({
      enabled: false,
      workspaceId: 'one',
      locale: 'en',
      filters: { branch: 'all' },
    }),
  );
  await act(async () => result.current.ask('Demo'));
  expect(read).not.toHaveBeenCalled();
  expect(write).not.toHaveBeenCalled();
});

it('retains an oversized question and avoids a request beyond the public contract', async () => {
  vi.spyOn(assistantApi, 'context').mockResolvedValue(context);
  const write = vi.spyOn(assistantApi, 'answer');
  const { result } = renderHook(() =>
    useAssistantConversation({ enabled: true, workspaceId: 'one', locale: 'en' }),
  );
  await waitFor(() => expect(result.current.context).toEqual(context));
  await act(async () => result.current.ask('x'.repeat(1001)));
  expect(write).not.toHaveBeenCalled();
  expect(result.current.error).toBe('QUESTION_TOO_LONG');
  expect(result.current.draft).toHaveLength(1001);
});

it.each([
  ['workspace', { workspaceId: 'two' }],
  ['locale', { locale: 'ar' }],
  ['branch', { filters: { branch: 'branch-2', start: '2026-10-01', end: '2026-10-31' } }],
  ['period', { filters: { branch: 'all', start: '2026-09-01', end: '2026-09-30' } }],
  ['close', { enabled: false }],
])(
  'aborts context and answer requests on %s change, even if transport completes late',
  async (_name, change) => {
    let finishContext, finishAnswer;
    const read = vi.spyOn(assistantApi, 'context').mockImplementation(
      () =>
        new Promise((resolve) => {
          finishContext = resolve;
        }),
    );
    const write = vi.spyOn(assistantApi, 'answer').mockImplementation(
      () =>
        new Promise((resolve) => {
          finishAnswer = resolve;
        }),
    );
    const initial = {
      enabled: true,
      workspaceId: 'one',
      locale: 'en',
      filters: { branch: 'all', start: '2026-10-01', end: '2026-10-31' },
    };
    const { result, rerender } = renderHook((props) => useAssistantConversation(props), {
      initialProps: initial,
    });
    act(() => {
      result.current.ask('Why?');
    });
    const completeOldContext = finishContext;
    rerender({ ...initial, ...change });
    expect(read.mock.calls[0][1].aborted).toBe(true);
    expect(write.mock.calls[0][1].aborted).toBe(true);
    await act(async () => {
      completeOldContext(context);
      finishAnswer(answer);
    });
    expect(result.current.context).toBeNull();
    expect(result.current.messages).toEqual([]);
  },
);
it('aborts both request types on unmount and aborts an active answer for a new conversation', () => {
  const read = vi.spyOn(assistantApi, 'context').mockImplementation(() => new Promise(() => {}));
  const write = vi.spyOn(assistantApi, 'answer').mockImplementation(() => new Promise(() => {}));
  const { result, unmount } = renderHook(() =>
    useAssistantConversation({ enabled: true, workspaceId: 'one', locale: 'en' }),
  );
  act(() => {
    result.current.ask('One');
  });
  act(() => result.current.reset());
  expect(write.mock.calls[0][1].aborted).toBe(true);
  act(() => {
    result.current.ask('Two');
  });
  unmount();
  expect(read.mock.calls[0][1].aborted).toBe(true);
  expect(write.mock.calls[1][1].aborted).toBe(true);
});
it('encodes only selected context scope using GET and forwards cancellation', async () => {
  const fetcher = vi
    .fn()
    .mockResolvedValue({ ok: true, status: 200, json: async () => ({ data: context }) });
  vi.stubGlobal('fetch', fetcher);
  const controller = new AbortController();
  await assistantApi.context(
    { branchId: 'branch-1', from: '2026-10-01', to: '2026-10-31' },
    controller.signal,
  );
  expect(fetcher).toHaveBeenCalledWith(
    '/api/ai/assistant/context?branchId=branch-1&from=2026-10-01&to=2026-10-31',
    expect.objectContaining({ method: 'GET', signal: controller.signal, credentials: 'include' }),
  );
});
