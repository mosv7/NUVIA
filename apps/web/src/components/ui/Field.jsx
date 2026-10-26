import { useState } from 'react';
import { asset } from '../../lib/assets.js';
export default function Field({
  name,
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  hint,
  suggestions,
  showLabel,
  hideLabel,
}) {
  const [visible, setVisible] = useState(false);
  const password = type === 'password';
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <div className={`input-wrap ${error ? 'invalid' : ''}`}>
        <input
          id={name}
          name={name}
          type={password && visible ? 'text' : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={
            name === 'email'
              ? 'email'
              : name === 'name'
                ? 'name'
                : name === 'confirm'
                  ? 'new-password'
                  : password
                    ? 'current-password'
                    : undefined
          }
          aria-invalid={!!error}
          aria-describedby={error || hint ? `${name}-help` : undefined}
          list={suggestions ? `${name}-suggestions` : undefined}
        />
        {suggestions && (
          <datalist id={`${name}-suggestions`}>
            {suggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
        )}
        {password && (
          <button
            type="button"
            className="eye"
            aria-label={visible ? hideLabel : showLabel}
            onClick={() => setVisible(!visible)}
            aria-pressed={visible}
          >
            <img src={asset('login-imgEyeOff.svg')} alt="" />
          </button>
        )}
      </div>
      {(error || hint) && (
        <p
          id={`${name}-help`}
          aria-live={error ? 'polite' : undefined}
          aria-atomic="true"
          className={error ? 'error-text' : 'hint'}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}
