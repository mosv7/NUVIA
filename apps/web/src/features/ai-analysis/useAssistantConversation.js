import { useCallback, useEffect, useRef, useState } from 'react';
import { assistantApi } from './api.js';
export default function useAssistantConversation({ enabled, workspaceId, locale, filters = {} }) {
  const branchId = filters.branch && filters.branch !== 'all' ? filters.branch : undefined;
  const from = filters.start,
    to = filters.end;
  const key = JSON.stringify([enabled, workspaceId, locale, branchId, from, to]);
  const generation = useRef(0),
    active = useRef(null),
    previous = useRef(null);
  const [draft, setDraft] = useState(''),
    [messages, setMessages] = useState([]),
    [pending, setPending] = useState(false),
    [error, setError] = useState(null);
  const [context, setContext] = useState(null),
    [contextError, setContextError] = useState(false),
    [loading, setLoading] = useState(false),
    [reload, setReload] = useState(0);
  const scope = () => ({
    ...(branchId ? { branchId } : {}),
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
  });
  const reset = useCallback(() => {
    generation.current++;
    active.current?.abort();
    active.current = null;
    previous.current = null;
    setDraft('');
    setMessages([]);
    setPending(false);
    setError(null);
  }, []);
  useEffect(() => {
    reset();
    setContext(null);
    setContextError(false);
    setLoading(enabled);
    if (!enabled) return;
    const controller = new AbortController();
    assistantApi
      .context(scope(), controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setContext(data);
      })
      .catch(() => {
        if (!controller.signal.aborted) setContextError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => {
      controller.abort();
      reset();
    };
    // The serialized key contains every privacy scope value; no object identity dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, reload, reset]);
  const ask = async (text = draft) => {
    const question = text.trim();
    if (!enabled || active.current || !question) return;
    if ([...question].length > 1000) {
      setDraft(question);
      setError('QUESTION_TOO_LONG');
      return;
    }
    const controller = new AbortController(),
      version = generation.current;
    active.current = controller;
    setPending(true);
    setError(null);
    setDraft(question);
    try {
      const answer = await assistantApi.answer(
        {
          question,
          locale,
          ...scope(),
          ...(previous.current ? { previousQuestion: previous.current } : {}),
        },
        controller.signal,
      );
      if (controller.signal.aborted || version !== generation.current) return;
      setMessages((old) => [...old, { question, answer }]);
      previous.current = question;
      setDraft('');
      setContext((old) => ({ ...old, metrics: answer.metrics }));
    } catch (failure) {
      if (!controller.signal.aborted && version === generation.current)
        setError(failure.code || 'REQUEST_FAILED');
    } finally {
      if (version === generation.current && active.current === controller) {
        active.current = null;
        setPending(false);
      }
    }
  };
  return {
    draft,
    setDraft,
    messages,
    pending,
    error,
    ask,
    reset,
    context,
    contextError,
    loading,
    retryContext: () => setReload((old) => old + 1),
  };
}
