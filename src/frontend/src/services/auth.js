// Frontend demonstration only. No passwords or sessions are stored.
export async function submitDemo(action, values) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (action === 'login') return { error: 'loginFailed' };
  if (action === 'signup' && values.email.toLowerCase() === 'used@example.com')
    return { field: 'email', error: 'emailUsed' };
  return {
    message:
      action === 'forgot' ? 'resetDemo' : action === 'reset' ? 'passwordDemo' : 'accountDemo',
  };
}
