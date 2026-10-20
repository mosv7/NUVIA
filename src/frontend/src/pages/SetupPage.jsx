import React from 'react';
import Field from '../components/Field.jsx';
import { asset } from '../assets.js';
export default function SetupPage({
  copy,
  values,
  onChange,
  error,
  onContinue,
  onBack,
  busy = false,
}) {
  const icon = (name) => asset(`business-setup/branches/${name}.svg`);
  return (
    <section className="setup-content">
      <p className="setup-step-label">{copy.stepLabel(2)}</p>
      <h1>{copy.setupTitle}</h1>
      <p className="setup-intro">{copy.setupBody}</p>
      <form noValidate onSubmit={onContinue}>
        <fieldset className="branch-fieldset">
          <legend>
            {copy.multipleQuestion} <span>*</span>
          </legend>
          <div className="branch-options">
            {['single', 'multiple'].map((type) => (
              <label
                key={type}
                className={`branch-option ${values.branchType === type ? 'selected' : ''}`}
              >
                <span>
                  <img
                    src={icon(
                      type === 'single' ? 'branch-single-store' : 'branch-multiple-network',
                    )}
                    alt=""
                  />
                  <strong>{copy[type]}</strong>
                  <input
                    type="radio"
                    name="branchType"
                    value={type}
                    checked={values.branchType === type}
                    onChange={onChange}
                  />
                </span>
                <p>{copy[type + 'Body']}</p>
              </label>
            ))}
          </div>
        </fieldset>
        {values.branchType === 'multiple' && (
          <Field
            name="branchName"
            label={`${copy.branch} *`}
            placeholder={copy.branchPlaceholder}
            value={values.branchName}
            onChange={onChange}
            hint={copy.branchHint}
            error={error ? copy.branchError : undefined}
          />
        )}
        <button type="submit" className="primary" disabled={busy}>
          {copy.continue}
        </button>
      </form>
      <button className="setup-back" type="button" onClick={onBack}>
        <img src={icon('form-back-arrow')} alt="" />
        {copy.back}
      </button>
    </section>
  );
}
