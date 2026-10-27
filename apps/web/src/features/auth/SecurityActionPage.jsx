import { useEffect, useRef, useState } from 'react';
import AuthPage from './AuthPage.jsx';
import Field from '../../components/ui/Field.jsx';
import { authApi } from './api.js';
import { useAuth } from '../../app/providers/AuthProvider.jsx';
import { afterLogin } from '../../app/router/access-policy.js';
import { asset } from '../../lib/assets.js';
import { en, ar } from '../../lib/i18n/auth-copy.js';

export default function SecurityActionPage({ page, challenge, language, setLanguage }) {
  const auth = useAuth();
  const twoFactor = page === 'login-2fa';
  const arabic = language === 'ar';
  const L = (english, translated) => (arabic ? translated : english);
  const rawToken = new URLSearchParams(location.hash.split('?')[1]).get('token');
  const token = useRef(rawToken);
  const request = useRef(null);
  const [code, setCode] = useState('');
  const [state, setState] = useState('ready');
  useEffect(() => {
    if (!twoFactor && rawToken) {
      request.current?.abort();
      request.current = null;
      token.current = rawToken;
      setState('ready');
      history.replaceState(null, '', `${location.pathname}${location.search}#/confirm-email`);
    }
  }, [rawToken, twoFactor]);
  useEffect(() => () => request.current?.abort(), []);
  const available = twoFactor ? Boolean(challenge) : /^[a-f0-9]{64}$/.test(token.current || '');
  const submit = async (event) => {
    event.preventDefault();
    if (!available || state === 'busy' || state === 'done') return;
    const controller = new AbortController();
    request.current?.abort();
    request.current = controller;
    setState('busy');
    try {
      if (twoFactor) {
        const session = await auth.loginTwoFactor(
          { twoFactorToken: challenge, code },
          controller.signal,
        );
        if (!controller.signal.aborted && session)
          location.hash = '/' + afterLogin(session.workspace);
      } else {
        await authApi.confirmEmail(token.current, controller.signal);
        if (!controller.signal.aborted) {
          token.current = null;
          setState('done');
          await auth.refresh().catch(() => {});
        }
      }
    } catch (error) {
      if (!controller.signal.aborted) setState(error.status === 429 ? 'rateLimited' : 'failed');
    } finally {
      if (!controller.signal.aborted) setState((old) => (old === 'busy' ? 'ready' : old));
    }
  };
  const t = {
    ...(arabic ? ar : en),
    send: twoFactor
      ? L('Verify sign-in', 'تأكيد تسجيل الدخول')
      : L('Confirm new email', 'تأكيد البريد الجديد'),
    failed: twoFactor
      ? L(
          'The code is invalid or your sign-in expired. Try again or return to login.',
          'الرمز غير صحيح أو انتهت صلاحية تسجيل الدخول. حاول مرة أخرى أو ارجع للدخول.',
        )
      : L(
          'This link could not be confirmed. It may have expired or already been used.',
          'تعذر تأكيد الرابط. ربما انتهت صلاحيته أو استُخدم من قبل.',
        ),
    done: L(
      'Email changed. Sign in with your new email address.',
      'تم تغيير البريد. سجّل الدخول بعنوانك الجديد.',
    ),
    missing: L(
      'This step has expired. Return to login or open the link from your email.',
      'انتهت صلاحية هذه الخطوة. ارجع للدخول أو افتح الرابط من بريدك.',
    ),
  };
  return (
    <AuthPage
      t={t}
      asset={(name, extension = 'svg') => asset(`159-1722-${name}.${extension}`)}
      isForgot
      page={page}
      preview={false}
      language={language}
      setLanguage={setLanguage}
      title={
        twoFactor
          ? L('Verify your sign-in', 'تأكيد تسجيل الدخول')
          : L('Confirm your new email', 'تأكيد بريدك الجديد')
      }
      intro={
        twoFactor
          ? L(
              'Enter a code from your authenticator app or use a recovery code.',
              'أدخل رمز تطبيق المصادقة أو استخدم رمز استرداد.',
            )
          : L(
              'Confirm this change to use the new address for signing in.',
              'أكّد التغيير لاستخدام العنوان الجديد لتسجيل الدخول.',
            )
      }
      submit={submit}
      busy={state === 'busy'}
      disabled={state === 'done' || !available}
      notice={
        state === 'done'
          ? 'done'
          : !available
            ? 'missing'
            : ['failed', 'rateLimited'].includes(state)
              ? state
              : ''
      }
      setNotice={() => {}}
      values={{}}
      errors={{}}
      field={() =>
        twoFactor && available ? (
          <Field
            name="code"
            label={L('Authenticator or recovery code', 'رمز المصادقة أو الاسترداد')}
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
        ) : null
      }
    />
  );
}
