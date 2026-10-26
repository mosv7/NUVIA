import { useState } from 'react';
import { asset } from '../../../lib/assets.js';
export default function SetupSidebar({ copy, step, folder }) {
  const [rating, setRating] = useState(3);
  const icon = (name) => asset(`business-setup/${folder}/${name}.svg`);
  const faces = ['unhappy', 'neutral', 'happy', 'very-happy'];
  return (
    <aside className="setup-sidebar">
      <p className="setup-eyebrow">
        <img src={icon('sidebar-feedback-icon')} alt="" />
        {copy.listen}
      </p>
      <h2>
        {copy.sideTitles[step][0]}
        <br />
        {copy.sideTitles[step][1]}
      </h2>
      <p className="setup-side-body">{copy.sideBodies[step]}</p>
      <div className="setup-survey">
        <div className="survey-title">
          <strong>{copy.experience}</strong>
          <img src={icon('sidebar-survey-sparkles')} alt="" />
        </div>
        <p>{copy.question}</p>
        <div className="survey-ratings" role="group" aria-label={copy.question}>
          {faces.map((face, i) => (
            <button
              type="button"
              key={face}
              className={`rating-face rating-${face} ${rating === i ? 'selected' : ''}`}
              aria-label={copy.ratings[i]}
              aria-pressed={rating === i}
              onClick={() => setRating(i)}
            >
              <img src={icon(`survey-rating-${face}`)} alt="" />
            </button>
          ))}
        </div>
        <small>
          <img src={icon('sidebar-survey-status-dot')} alt="" />
          {copy.moments}
        </small>
      </div>
    </aside>
  );
}
