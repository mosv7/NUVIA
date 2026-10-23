import ReviewQuestion from './ReviewQuestion.jsx';
import React, { useState } from 'react';
import { useProductView } from '../../../app/providers/ProductProvider.jsx';
import { asset } from '../../../lib/assets.js';

import { UiText, SurveyReviewMark } from './SurveyPrimitives.jsx';
const imgRefreshCw = asset('surveys-figma/ai-review-imgRefreshCw.svg');
const imgCheck = asset('surveys-figma/ai-review-imgCheck.svg');
const imgPencilLine = asset('surveys-figma/ai-review-imgPencilLine.svg');
const imgPlus = asset('surveys-figma/ai-review-imgPlus.svg');
const imgCheck1 = asset('surveys-figma/ai-review-imgCheck1.svg');
const imgFileCheck2 = asset('surveys-figma/ai-review-imgFileCheck2.svg');

export default function PageContent() {
  const { language } = useProductView();
  const [editing, setEditing] = useState(null);
  const [chosen, setChosen] = useState([true, true, true, true, false]);
  const count = chosen.filter(Boolean).length;
  const ar = language === 'ar';
  return (
    <div className="sv0" data-node-id="298:623" data-name="Page content">
      <div className="sv1" data-node-id="298:624" data-name="Page introduction">
        <div className="sv2" data-node-id="298:625" data-name="Introduction">
          <UiText className="sv3" data-node-id="298:626">
            Review your questions
          </UiText>
          <UiText
            className="sv4"
            data-node-id="298:627"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Choose what to keep. Make every question sound like your business.
          </UiText>
        </div>
        <button
          type="button"
          className="sv5"
          data-node-id="298:628"
          data-name="Action"
          data-survey-action="Regenerate"
        >
          <div className="sv6" data-node-id="298:629" data-name="refresh-cw">
            <img alt="" className="sv7" src={imgRefreshCw} />
          </div>
          <UiText
            className="sv8"
            data-node-id="298:631"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Regenerate
          </UiText>
        </button>
      </div>
      <div className="sv9" data-node-id="298:632" data-name="Generation steps">
        <UiText
          className="sv10"
          data-node-id="298:633"
          style={{ fontVariationSettings: '"opsz" 14' }}
        >
          {`✓  Describe your survey`}
        </UiText>
        <UiText
          className="sv11"
          data-node-id="298:634"
          style={{ fontVariationSettings: '"opsz" 14' }}
        >
          →
        </UiText>
        <div className="sv12" data-node-id="298:635" data-name="Status">
          <UiText
            className="sv13"
            data-node-id="298:636"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            {`2  Review questions`}
          </UiText>
        </div>
        <UiText
          className="sv11"
          data-node-id="298:637"
          style={{ fontVariationSettings: '"opsz" 14' }}
        >
          →
        </UiText>
        <UiText
          className="sv10"
          data-node-id="298:638"
          style={{ fontVariationSettings: '"opsz" 14' }}
        >
          {`3  Add to survey`}
        </UiText>
      </div>
      <div className="sv14" data-node-id="298:639" data-name="Review workspace">
        <div className="sv15" data-node-id="298:640" data-name="Question suggestions">
          <div className="sv16" data-node-id="298:641" data-name="List heading">
            <UiText
              className="sv17"
              data-node-id="298:642"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Proposed questions
            </UiText>
            <UiText
              className="sv18"
              data-node-id="298:643"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {ar ? 'تم اختيار ' + count + ' من 5' : count + ' of 5 selected'}
            </UiText>
          </div>
          {[
            [
              '298:644',
              'Service speed',
              '5-point satisfaction',
              'How satisfied were you with the time it took to receive your order?',
            ],

            [
              '298:656',
              'Food quality',
              '5-star rating',
              'How would you rate the quality of the food and drinks you ordered?',
            ],

            [
              '298:668',
              'Staff friendliness',
              '5-point satisfaction',
              'How satisfied were you with the friendliness of our team today?',
            ],

            [
              '298:686',
              'Value for money',
              '5-point clarity',
              'How clear was the pricing for your order, including any combos?',
            ],

            [
              '298:698',
              'Overall experience',
              'Open text',
              'What is one thing we could improve before your next visit?',
            ],
          ].map(([id, aspect, type, wording], index) => (
            <ReviewQuestion
              key={id}
              id={id}
              aspect={aspect}
              type={type}
              wording={wording}
              selected={chosen[index]}
              onSelect={() =>
                setChosen((previous) => previous.map((value, i) => (i === index ? !value : value)))
              }
              editing={editing === index}
              onEdit={() => setEditing(index)}
              onClose={() => setEditing(null)}
            />
          ))}
          <div className="sv36" data-node-id="298:708" data-name="Selection actions">
            <UiText
              className="sv37"
              data-node-id="298:709"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {ar
                ? 'ستتم إضافة ' + count + ' أسئلة إلى مسودة الاستبيان.'
                : count + ' questions will be added to your draft survey.'}
            </UiText>
            <button
              type="button"
              className="sv38"
              data-node-id="298:710"
              data-name="Action"
              data-survey-action="add-selected-questions"
              disabled={count === 0}
            >
              <div className="sv6" data-node-id="298:711" data-name="plus">
                <img alt="" className="sv7" src={imgPlus} />
              </div>
              <UiText
                className="sv33"
                data-node-id="298:713"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {ar
                  ? 'إضافة ' + count + ' أسئلة إلى الاستبيان'
                  : 'Add ' + count + ' Questions to Survey'}
              </UiText>
            </button>
          </div>
        </div>
        <div className="sv39" data-node-id="298:714" data-name="Review context">
          <div className="sv40" data-node-id="298:715" data-name="Aspects worth measuring">
            <div className="sv41" data-node-id="298:716" data-name="Section heading">
              <UiText
                className="sv42"
                data-node-id="298:717"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Aspects worth measuring
              </UiText>
              <UiText
                className="sv43"
                data-node-id="298:718"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Select the areas that matter to your goal.
              </UiText>
            </div>
            <button
              type="button"
              className="sv44"
              data-node-id="298:719"
              data-name="Aspect option"
              data-survey-action="Service speed"
              aria-pressed="true"
              aria-label="Select option"
            >
              <SurveyReviewMark />
              <UiText
                className="sv47"
                data-node-id="298:723"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Service speed
              </UiText>
            </button>
            <button
              type="button"
              className="sv44"
              data-node-id="298:724"
              data-name="Aspect option"
              data-survey-action="Food quality"
              aria-pressed="true"
              aria-label="Select option"
            >
              <SurveyReviewMark />
              <UiText
                className="sv47"
                data-node-id="298:728"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Food quality
              </UiText>
            </button>
            <button
              type="button"
              className="sv44"
              data-node-id="298:729"
              data-name="Aspect option"
              data-survey-action="Staff friendliness"
              aria-pressed="true"
              aria-label="Select option"
            >
              <SurveyReviewMark />
              <UiText
                className="sv47"
                data-node-id="298:733"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Staff friendliness
              </UiText>
            </button>
            <button
              type="button"
              className="sv44"
              data-node-id="298:734"
              data-name="Aspect option"
              data-survey-action="Value for money"
              aria-pressed="true"
              aria-label="Select option"
            >
              <SurveyReviewMark />
              <UiText
                className="sv47"
                data-node-id="298:738"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Value for money
              </UiText>
            </button>
            <button
              type="button"
              className="sv44"
              data-node-id="298:739"
              data-name="Aspect option"
              data-survey-action="Order accuracy"
              aria-pressed="true"
              aria-label="Select option"
            >
              <SurveyReviewMark />
              <UiText
                className="sv47"
                data-node-id="298:741"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Order accuracy
              </UiText>
            </button>
            <UiText
              className="sv49"
              data-node-id="298:742"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Suggestions are AI-generated, not measured results.
            </UiText>
          </div>
          <div className="sv50" data-node-id="298:743" data-name="Your survey brief">
            <div className="sv51" data-node-id="298:744" data-name="Section heading">
              <UiText
                className="sv52"
                data-node-id="298:745"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Your survey brief
              </UiText>
            </div>
            <div className="sv12" data-node-id="298:746" data-name="Status">
              <UiText
                className="sv53"
                data-node-id="298:747"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {`Cafe & workspace`}
              </UiText>
            </div>
            <UiText
              className="sv54"
              data-node-id="298:748"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Reduce waiting times and improve the in-store experience while protecting food quality
              and friendly service.
            </UiText>
            <div className="sv55" data-node-id="298:749" data-name="Divider" />
            <div className="sv56" data-node-id="298:750" data-name="Brief settings">
              <UiText
                className="sv57"
                data-node-id="298:751"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                English
              </UiText>
              <UiText
                className="sv57"
                data-node-id="298:752"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                5 suggested questions
              </UiText>
            </div>
            <UiText
              className="sv58"
              data-node-id="298:753"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              ← Edit business type or goal
            </UiText>
          </div>
          <div className="sv59" data-node-id="298:754" data-name="Draft reassurance">
            <div className="sv60" data-node-id="298:755" data-name="file-check-2">
              <img alt="" className="sv7" src={imgFileCheck2} />
            </div>
            <UiText
              className="sv61"
              data-node-id="298:757"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Adding questions creates a draft. Review your full survey before publishing.
            </UiText>
          </div>
        </div>
      </div>
    </div>
  );
}
