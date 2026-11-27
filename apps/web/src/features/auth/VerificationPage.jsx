import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAuth } from '../../app/providers/AuthProvider.jsx';
import { afterLogin } from '../../app/router/access-policy.js';
import { authApi } from './api.js';
import EmailVerificationView from './EmailVerificationView.jsx';

const verificationHash = '#/verify-email';
const messages = {
  en: {
    preview: 'Preview only. This action sends no email.',
    invalid: 'This verification link is invalid, expired, or already used.',
    unavailable: 'Verification email delivery is currently unavailable.',
    sent: 'Request received. Check your inbox if your account needs verification. You can request a new link for the same address every 10 minutes.',
    error: 'Could not complete the request. Please try again.',
    rateLimited: 'Too many attempts. Wait a few minutes and try again.',
  },
  ar: {
    preview: 'هذه معاينة فقط. لن تُرسل أي رسالة.',
    invalid: 'رابط التأكيد غير صالح أو انتهت صلاحيته أو استُخدم من قبل.',
    unavailable: 'إرسال رسائل التأكيد غير متاح حاليًا.',
    sent: 'تم استلام الطلب. راجع صندوق الوارد إذا كان بريد حسابك بحاجة إلى تأكيد. يمكنك طلب رابط جديد للعنوان نفسه كل ١٠ دقائق.',
    error: 'تعذر إكمال الطلب. حاول مرة أخرى.',
    rateLimited: 'عدد المحاولات كبير. انتظر بضع دقائق ثم حاول مرة أخرى.',
  },
};

export default function VerificationPage({
  language,
  setLanguage,
  initialEmail = '',
  preview = false,
  previewStatus = 'pending',
}) {
  const auth = useAuth();
  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState(null);
  const [state, setState] = useState(preview ? previewStatus : 'pending');
  const [busy, setBusy] = useState(false);
  const request = useRef(null);
  const incomingToken = new URLSearchParams(location.hash.split('?')[1]).get('token');
  const ownerEmail = preview ? '' : auth.user?.email;
  const targetEmail = ownerEmail || email;

  useLayoutEffect(() => {
    if (preview || incomingToken === null) return;
    request.current?.abort();
    request.current = null;
    history.replaceState(null, '', location.pathname + location.search + verificationHash);
    const valid = /^[a-f0-9]{64}$/.test(incomingToken);
    setToken(valid ? incomingToken : null);
    setState(valid ? 'pending' : 'invalid');
    setBusy(false);
  }, [incomingToken, preview]);

  useEffect(() => () => request.current?.abort(), []);

  async function submit() {
    if (request.current) return;
    if (preview) {
      setState('preview');
      return;
    }
    const controller = new AbortController();
    request.current = controller;
    const isCurrent = () =>
      request.current === controller &&
      !controller.signal.aborted &&
      location.hash === verificationHash;
    setBusy(true);
    try {
      if (token) {
        await authApi.verify(token, controller.signal);
        if (isCurrent()) {
          setToken(null);
          setState('verified');
          if (auth.user) await auth.refresh().catch(() => {});
        }
        return;
      }
      await authApi.resend(targetEmail, controller.signal);
      if (isCurrent()) setState('sent');
    } catch (error) {
      if (!isCurrent()) return;
      if (error.code === 'INVALID_TOKEN') {
        setToken(null);
        setState('invalid');
      } else if (error.code === 'MAIL_UNAVAILABLE') {
        setState('unavailable');
      } else {
        setState(error.status === 429 ? 'rateLimited' : 'error');
      }
    } finally {
      if (isCurrent()) {
        request.current = null;
        setBusy(false);
      }
    }
  }

  const verified =
    state === 'verified' || (!token && state === 'pending' && auth.user?.emailVerified);
  const status = token
    ? 'confirm'
    : verified
      ? 'verified'
      : state === 'invalid'
        ? 'expired'
        : 'sent';
  const resendDisabled = !preview && !token && auth.user?.emailVerificationAvailable === false;
  const message = resendDisabled && !verified ? 'unavailable' : state;
  return (
    <EmailVerificationView
      language={language}
      setLanguage={setLanguage}
      email={targetEmail}
      onEmailChange={setEmail}
      status={status}
      confirmedLink={state === 'verified'}
      busy={busy}
      message={messages[language][message]}
      onResend={submit}
      onConfirm={submit}
      preview={preview}
      editableEmail={!ownerEmail}
      resendDisabled={resendDisabled}
      continueHref={
        auth.user
          ? auth.workspace?.onboardingStep === 'complete'
            ? '#/settings-security'
            : '#/' + afterLogin(auth.workspace)
          : '#/login'
      }
    />
  );
}
