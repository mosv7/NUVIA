import React, { useState } from 'react';
import { useProductView } from '../../../app/providers/ProductProvider.jsx';
export function ratingColor(rating) {
  return rating <= 2 ? '#dc6672' : rating === 3 ? '#e6d342' : '#36a775';
}
export default function PreviewRating() {
  const [rating, setRating] = useState(0);
  const { language } = useProductView();
  return (
    <div
      className="survey-rating"
      role="group"
      aria-label={language === 'ar' ? 'تقييم التجربة' : 'Experience rating'}
      style={{ '--rating-color': ratingColor(rating) }}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          aria-label={language === 'ar' ? `${n} من 5 نجوم` : `${n} of 5 stars`}
          aria-pressed={rating === n}
          data-filled={n <= rating}
          onClick={() => setRating(n)}
        >
          <svg aria-hidden="true" width="34" height="34" viewBox="0 0 24 24">
            <path
              d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"
              stroke="currentColor"
              fill="currentColor"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}
