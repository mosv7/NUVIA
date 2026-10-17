import React from 'react';
import Field from '../components/Field.jsx';
import { asset } from '../assets.js';
export default function BusinessInformationPage({
  copy,
  values,
  onChange,
  errors,
  onContinue,
  folder,
}) {
  const hasError = Object.values(errors).some(Boolean),
    icon = (name) => asset(`business-setup/${folder}/${name}.svg`);
  return (
    <section className={`setup-content ${hasError ? 'setup-error-state' : ''}`}>
      <p className={`setup-step-label ${hasError ? 'error-label' : ''}`}>
        {hasError && <img src={icon('validation-caption-alert')} alt="" />}
        {hasError ? copy.validation : copy.stepLabel(1)}
      </p>
      <h1>{copy.infoTitle}</h1>
      {!hasError && <p className="setup-intro">{copy.infoBody}</p>}
      <p className="setup-required">{copy.required}</p>
      {hasError && (
        <p className="setup-error-banner" role="alert">
          <img src={icon('validation-summary-alert')} alt="" />
          {copy.errorSummary}
        </p>
      )}
      <form noValidate onSubmit={onContinue}>
        <Field
          name="businessName"
          label={`${copy.businessName} *`}
          placeholder={copy.businessPlaceholder}
          value={values.businessName}
          onChange={onChange}
          error={errors.businessName ? copy.nameError : undefined}
        />
        <Field
          name="industry"
          label={`${copy.industry} *`}
          placeholder={copy.industryPlaceholder}
          value={values.industry}
          onChange={onChange}
          error={errors.industry ? copy.industryError : undefined}
          hint={!hasError ? copy.industryHint : undefined}
        />
        <button type="submit" className="primary">
          {copy.continue}
        </button>
      </form>
      <p className="setup-private">
        <img src={icon('form-privacy-lock')} alt="" />
        {copy.private}
      </p>
    </section>
  );
}
