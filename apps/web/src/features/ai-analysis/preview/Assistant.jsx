import React, { useEffect, useRef, useState } from 'react';
import { useProductView } from '../../../app/providers/ProductProvider.jsx';
import { asset } from '../../../lib/assets.js';
function AssistantIcon() {
  return (
    <img
      className="nuvia-symbol"
      src={asset('dashboard/overview/sparkles1.svg')}
      alt=""
      aria-hidden="true"
    />
  );
}
export default function Assistant() {
  const { language, tr, preview } = useProductView(),
    ar = language === 'ar',
    dialog = useRef(null),
    trigger = useRef(null),
    end = useRef(null);
  const [open, setOpen] = useState(false),
    [draft, setDraft] = useState(''),
    [messages, setMessages] = useState([]);
  const restoreFocus = useRef(true);
  useEffect(() => {
    if (!open) return;
    restoreFocus.current = true;
    const outside = (e) => {
      if (dialog.current?.contains(e.target) || trigger.current?.contains(e.target)) return;
      restoreFocus.current = false;
      setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener('nuvia:ask', show);
    return () => window.removeEventListener('nuvia:ask', show);
  }, []);
  useEffect(() => {
    if (open && !dialog.current.open) dialog.current.show();
    if (!open && dialog.current.open) dialog.current.close();
    const closeOnEscape = (e) => {
      if (open && e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'nearest' });
  }, [messages]);
  const ask = (text) => {
    if (!text.trim()) return;
    if (!preview) {
      setMessages((old) => [
        ...old,
        { role: 'user', text: text.trim() },
        {
          role: 'assistant',
          topic: 'other',
          text: ar ? 'المساعد الذكي غير متاح بعد.' : 'AI Assistant is not available yet.',
        },
      ]);
      setDraft('');
      return;
    }
    const topic = /price|pricing|combo|سعر|أسعار|تسعير/i.test(text)
      ? 'pricing'
      : /staff|service|team|فريق|موظف|خدمة/i.test(text)
        ? 'service'
        : /wait|queue|cairo|sentiment|انتظار|طابور|القاهرة|مشاعر/i.test(text)
          ? 'wait'
          : 'other';
    const answers = {
      wait: ar
        ? 'في نموذج العرض، الانتظار من أبرز فرص التحسين في القاهرة. جرّب زيادة التغطية وقت الذروة، ثم راجع الردود الأصلية قبل اتخاذ قرار.'
        : 'In the demo, waiting time is a key improvement opportunity at Cairo. Try extra peak-hour coverage, then review the original feedback before deciding.',
      pricing: ar
        ? 'توصية العرض: وضّح السعر الكامل للوجبات المجمعة في القائمة وعند الطلب. راجع الأدلة المتاحة في Feedback؛ عينة العرض لا تتضمن كل الردود الداعمة.'
        : 'Demo recommendation: show the full combo price on menus and ordering screens. Review available evidence in Feedback; this sample does not include every supporting response.',
      service: ar
        ? 'توصية العرض: شارك أسلوب الترحيب في الزمالك مع بقية الفروع، وراجع تعليقات العملاء لفهم ما أحبّوه.'
        : 'Demo recommendation: share El Zamalek’s welcoming service approach across branches, and read the customer comments to understand what they valued.',
      other: ar
        ? 'هذه محادثة تجريبية بإجابات معدّة مسبقًا، وليست متصلة بخدمة ذكاء اصطناعي. جرّب سؤالًا عن الانتظار في القاهرة أو الأسعار أو فريق الخدمة.'
        : 'This preview uses prepared demo replies and is not connected to an AI service. Try asking about Cairo waiting times, pricing, or the service team.',
    };
    setMessages((old) => [
      ...old,
      { role: 'user', text: text.trim() },
      { role: 'assistant', text: answers[topic], topic },
    ]);
    setDraft('');
  };
  return (
    <>
      <button
        ref={trigger}
        className="nuvia-launcher"
        aria-label={
          open
            ? ar
              ? 'إخفاء مساعد NUVIA'
              : 'Hide Ask NUVIA'
            : ar
              ? 'افتح مساعد NUVIA'
              : 'Open Ask NUVIA'
        }
        aria-expanded={open}
        aria-controls="nuvia-chat"
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
      >
        <AssistantIcon />
      </button>
      <dialog
        ref={dialog}
        id="nuvia-chat"
        className="nuvia-assistant"
        aria-labelledby="assistant-title"
        onCancel={() => setOpen(false)}
        onClose={() => {
          setOpen(false);
          if (restoreFocus.current) trigger.current?.focus();
          restoreFocus.current = true;
        }}
      >
        <div className="nuvia-assistant-inner" dir={ar ? 'rtl' : 'ltr'}>
          <header>
            <div>
              <span className="assistant-mark">
                <AssistantIcon />
              </span>
              <div>
                <h2 id="assistant-title">{tr('Ask NUVIA')}</h2>
                <p>{ar ? 'مساعدك لفهم تجربة العملاء' : 'Your customer experience companion'}</p>
              </div>
            </div>
            <button
              autoFocus
              aria-label={ar ? 'إغلاق المساعد' : 'Close assistant'}
              onClick={() => setOpen(false)}
            >
              <svg
                className="assistant-close-icon"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="m5 5 10 10M15 5 5 15"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </header>
          <div className="assistant-messages" aria-live="polite">
            {preview ? (
              <div className="assistant-summary">
                <span className="assistant-summary-label">
                  {ar ? 'ملخص آراء العملاء' : 'CUSTOMER FEEDBACK SUMMARY'}
                </span>
                <h3>
                  {ar
                    ? 'أوقات الانتظار في القاهرة تحتاج إلى مراجعة'
                    : 'Cairo’s wait times need a closer look'}
                </h3>
                <p>
                  {ar
                    ? 'تشير 104 مراجعات إلى تأخير، ضعف الشهر السابق. راجع تغطية فريق العمل في ساعات الذروة.'
                    : '104 reviews mention delays, twice the previous month. Review peak-hour staffing as a next step.'}
                </p>
                <blockquote>
                  <p dir="auto">
                    {ar
                      ? 'القهوة ممتازة لكن انتظرنا الطلب ٢٥ دقيقة.'
                      : '“The coffee is good, but we waited 25 minutes for the order.”'}
                  </p>
                  <cite>
                    {ar ? 'مراجعة Google · القاهرة · 18 سبتمبر' : 'Google review · Cairo · Sep 18'}
                  </cite>
                </blockquote>
                <a href="#/feedbacks" onClick={() => setOpen(false)}>
                  {ar ? 'عرض الآراء الداعمة' : 'View supporting feedback'}{' '}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M3.5 8h8M8 4.5 11.5 8 8 11.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            ) : (
              <div className="assistant-summary">
                <span className="assistant-summary-label">
                  {ar ? 'مساعد NUVIA' : 'NUVIA ASSISTANT'}
                </span>
                <h3>{ar ? 'كيف يمكننا مساعدتك؟' : 'How can we help?'}</h3>
                <p>
                  {ar
                    ? 'المساعد الذكي غير متاح بعد. ستظهر محادثاتك هنا عند إتاحة الخدمة.'
                    : 'AI Assistant is not available yet. Your conversations will appear here when the service is available.'}
                </p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={'assistant-message ' + m.role}>
                <small>
                  {m.role === 'assistant' && <AssistantIcon />}
                  {m.role === 'user' ? (ar ? 'أنت' : 'You') : 'NUVIA'}
                </small>
                <p dir="auto">{m.text}</p>
                {m.role === 'assistant' && m.topic !== 'other' && (
                  <a href={'#/feedbacks?evidence=' + m.topic} onClick={() => setOpen(false)}>
                    {ar ? 'راجع الأدلة المتاحة' : 'Review available evidence'} ↗
                  </a>
                )}
              </div>
            ))}
            <div ref={end} />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(draft);
            }}
          >
            <label className="assistant-compose">
              <textarea
                rows="1"
                aria-label={ar ? 'رسالتك للمساعد' : 'Message NUVIA'}
                placeholder={ar ? 'اسأل عن تجربة عملائك…' : 'Ask about your customer experience…'}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <button disabled={!draft.trim()} aria-label={ar ? 'إرسال' : 'Send message'}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M8 12V4M4.5 7.5 8 4l3.5 3.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </label>
            <small>
              {preview
                ? ar
                  ? 'البيانات والإجابات في هذه المعاينة تجريبية.'
                  : 'Data and replies in this preview are illustrative.'
                : ar
                  ? 'المساعد الذكي غير متاح بعد.'
                  : 'AI Assistant is not available yet.'}
            </small>
          </form>
        </div>
      </dialog>
    </>
  );
}
