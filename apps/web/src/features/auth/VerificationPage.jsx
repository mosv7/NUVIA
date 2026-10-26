import { useEffect, useRef, useState } from 'react';
import { authApi } from './api.js';
import EmailVerificationView from './EmailVerificationView.jsx';
export default function VerificationPage({
  language,
  setLanguage,
  initialEmail = '',
  preview = false,
  previewStatus = 'pending',
}) {
  const ar = language === 'ar';
  const [email, setEmail] = useState(initialEmail),
    [state, setState] = useState(preview ? previewStatus : 'pending');
  const started = useRef(null);
  const token = new URLSearchParams(location.hash.split('?')[1]).get('token');
  useEffect(() => {
    if (preview) return;
    if (!token || started.current === token) return;
    started.current = token;
    history.replaceState(null, '', `${location.pathname}#/verify-email`);
    setState('busy');
    authApi
      .verify(token)
      .then(() => setState('verified'))
      .catch((error) => setState(error.code === 'INVALID_TOKEN' ? 'invalid' : 'verifyError'));
  }, [token, preview]);
  async function resend() {
    if (state === 'busy') return false;
    if (preview) {
      setState('preview');
      return false;
    }
    setState('busy');
    try {
      await authApi.resend(email);
      setState('sent');
      return true;
    } catch {
      setState('error');
      return false;
    }
  }
  const messages = ar
    ? {
        pending: 'افتح رسالة التأكيد لإكمال إنشاء حسابك.',
        preview: 'معاينة فقط: لم يُرسل أي بريد ولم يتغير أي حساب.',
        busy: 'يرجى الانتظار…',
        verified: 'تم تأكيد بريدك. يمكنك تسجيل الدخول الآن.',
        invalid: 'رابط التأكيد غير صالح أو انتهت صلاحيته. اطلب رابطًا جديدًا.',
        verifyError: 'تعذر إكمال تأكيد البريد. تحقق من الاتصال وأعد فتح رابط التأكيد الأخير.',
        sent: 'تم استلام الطلب. راجع بريدك إذا كان الحساب يحتاج إلى تأكيد.',
        error: 'تعذر إكمال الطلب. حاول مرة أخرى.',
      }
    : {
        pending: 'Open the verification email to finish creating your account.',
        preview: 'Preview only: no email was sent and no account was changed.',
        busy: 'Please wait…',
        verified: 'Email verified. You can log in now.',
        invalid: 'This verification link is invalid or expired. Request a new one.',
        verifyError:
          'Could not complete email verification. Check your connection and reopen the latest verification link.',
        sent: 'Request received. Check your email if your account needs verification.',
        error: 'Could not complete the request. Please try again.',
      };
  return (
    <EmailVerificationView
      language={language}
      setLanguage={setLanguage}
      email={email}
      onEmailChange={setEmail}
      status={state === 'verified' ? 'verified' : state === 'invalid' ? 'expired' : 'sent'}
      busy={state === 'busy'}
      message={messages[state]}
      onResend={resend}
    />
  );
}
