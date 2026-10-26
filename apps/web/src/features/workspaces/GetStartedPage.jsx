import { useState } from 'react';
import { asset } from '../../lib/assets.js';
export default function GetStartedPage({ copy, values, onEdit, onStart }) {
  const [complete, setComplete] = useState(false),
    icon = (name) => asset(`business-setup/get-started/${name}.svg`);
  return (
    <section className="setup-content">
      <p className="setup-step-label">{copy.stepLabel(3)}</p>
      <h1>{copy.welcome}</h1>
      <p className="setup-intro">{copy.welcomeBody}</p>
      <div className="workspace-summary">
        <span>
          <img src={icon('summary-workspace-check')} alt="" />
        </span>
        <div>
          <strong>{values.businessName}</strong>
          <p>
            {values.industry} · {copy[values.branchType]}
          </p>
          {values.branchType === 'multiple' && (
            <p>
              {copy.primaryBranch}: {values.branchName}
            </p>
          )}
        </div>
      </div>
      <ul className="getting-started-guide">
        {copy.guide.map(([title, body, img]) => (
          <li key={img}>
            <span>
              <img src={icon(img)} alt="" />
            </span>
            <div>
              <strong>{title}</strong>
              <p>{body}</p>
            </div>
          </li>
        ))}
      </ul>
      <button className="primary" onClick={() => (onStart ? onStart() : setComplete(true))}>
        {copy.getStarted}
      </button>
      <p className="setup-reassurance">{copy.reassurance}</p>
      {complete && (
        <p role="status" className="notice">
          {copy.pending}
        </p>
      )}
      <button className="setup-edit" onClick={onEdit}>
        {copy.edit}
      </button>
    </section>
  );
}
