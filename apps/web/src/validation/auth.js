export function validateAuth(page, values) {
  const errors = {};
  if (page === 'signup' && !values.name.trim()) errors.name = 'required';
  if (page !== 'reset' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = values.email ? 'invalidEmail' : 'required';
  if (page !== 'forgot') {
    if (!values.password) errors.password = 'required';
    else if (page !== 'login' && !/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(values.password))
      errors.password = 'weakPassword';
    if (page !== 'login' && values.confirm !== values.password) errors.confirm = 'mismatch';
  }
  if (page === 'signup' && !values.terms) errors.terms = 'termsError';
  return errors;
}
