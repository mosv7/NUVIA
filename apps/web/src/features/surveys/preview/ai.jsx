import { asset } from '../../../lib/assets.js';

import { UiText, SurveyField, SurveyAISelect } from './SurveyPrimitives.jsx';
const imgArrowLeft = asset('surveys-figma/ai-imgArrowLeft.svg');
const imgIcon = asset('surveys-figma/ai-imgIcon.svg');
const imgSparkles = asset('surveys-figma/ai-imgSparkles.svg');
const imgShieldCheck = asset('surveys-figma/ai-imgShieldCheck.svg');
const imgSparkles1 = asset('surveys-figma/ai-imgSparkles1.svg');
const imgSlidersHorizontal = asset('surveys-figma/ai-imgSlidersHorizontal.svg');
const imgPencilLine = asset('surveys-figma/ai-imgPencilLine.svg');
const imgLightbulb = asset('surveys-figma/ai-imgLightbulb.svg');

export default function PageContent() {
  return (
    <div className="sv0" data-node-id="298:422" data-name="Page content">
      <div className="sv1" data-node-id="298:423" data-name="Page introduction">
        <div className="sv2" data-node-id="298:424" data-name="Introduction">
          <UiText className="sv3" data-node-id="298:425">
            AI Survey Generator
          </UiText>
          <UiText
            className="sv4"
            data-node-id="298:426"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Start with your business and a goal. NUVIA will help you ask the right questions.
          </UiText>
        </div>
        <button
          type="button"
          className="sv5"
          data-node-id="298:427"
          data-name="Action"
          data-survey-action="Back to Surveys"
        >
          <div className="sv6" data-node-id="298:428" data-name="arrow-left">
            <img alt="" className="sv7" src={imgArrowLeft} />
          </div>
          <UiText
            className="sv8"
            data-node-id="298:430"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Back to Surveys
          </UiText>
        </button>
      </div>
      <div className="sv9" data-node-id="298:431" data-name="Generation steps">
        <div className="sv12" data-node-id="298:432" data-name="Status">
          <UiText
            className="sv13"
            data-node-id="298:433"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >{`1  Describe your survey`}</UiText>
        </div>
        <UiText
          className="sv11"
          data-node-id="298:434"
          style={{ fontVariationSettings: '"opsz" 14' }}
        >
          →
        </UiText>
        <UiText
          className="sv10"
          data-node-id="298:435"
          style={{ fontVariationSettings: '"opsz" 14' }}
        >{`2  Review questions`}</UiText>
        <UiText
          className="sv11"
          data-node-id="298:436"
          style={{ fontVariationSettings: '"opsz" 14' }}
        >
          →
        </UiText>
        <UiText
          className="sv10"
          data-node-id="298:437"
          style={{ fontVariationSettings: '"opsz" 14' }}
        >{`3  Add to survey`}</UiText>
      </div>
      <div className="sv14" data-node-id="298:438" data-name="Survey setup">
        <div className="sv62" data-node-id="298:439" data-name="Survey form">
          <div className="sv40" data-node-id="298:440" data-name="What would you like to learn?">
            <div className="sv41" data-node-id="298:441" data-name="Section heading">
              <UiText
                className="sv42"
                data-node-id="298:442"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                What would you like to learn?
              </UiText>
              <UiText
                className="sv43"
                data-node-id="298:443"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                A little context makes every question more relevant.
              </UiText>
            </div>
            <div className="sv63" data-node-id="298:444" data-name="Form field">
              <UiText
                className="sv64"
                data-node-id="298:445"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Business Type
              </UiText>
              <div className="sv65" data-node-id="298:446" data-name="Input">
                <UiText
                  className="sv66"
                  data-node-id="298:447"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >{`Cafe & workspace`}</UiText>
                <div className="sv6" data-node-id="298:448" data-name="Icon">
                  <img alt="" className="sv7" src={imgIcon} />
                </div>
              </div>
              <UiText
                className="sv67"
                data-node-id="298:450"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >{`Pre-filled from your Bloom & Co. workspace. You can change it.`}</UiText>
            </div>
            <div className="sv63" data-node-id="298:451" data-name="Form field">
              <UiText
                className="sv64"
                data-node-id="298:452"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Survey Goal
              </UiText>
              <SurveyField
                className="sv68"
                data-node-id="298:453"
                data-name="Input"
                initialValue={
                  'Understand how we can reduce waiting times and improve the in-store experience, without losing the food quality and friendly service customers love.'
                }
                multiline={true}
              />
              <UiText
                className="sv67"
                data-node-id="298:455"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Be specific about the experience or decision you want to improve.
              </UiText>
            </div>
            <div className="sv69" data-node-id="298:456" data-name="Goal suggestions">
              <div className="sv12" data-node-id="298:457" data-name="Status">
                <UiText
                  className="sv53"
                  data-node-id="298:458"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Customer experience
                </UiText>
              </div>
              <div className="sv24" data-node-id="298:459" data-name="Status">
                <UiText
                  className="sv25"
                  data-node-id="298:460"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Service speed
                </UiText>
              </div>
              <div className="sv24" data-node-id="298:461" data-name="Status">
                <UiText
                  className="sv25"
                  data-node-id="298:462"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >{`Menu & pricing`}</UiText>
              </div>
            </div>
            <div className="sv55" data-node-id="298:463" data-name="Divider" />
            <div className="sv70" data-node-id="298:464" data-name="Survey settings">
              <div className="sv71" data-node-id="298:465" data-name="Form field">
                <UiText
                  className="sv64"
                  data-node-id="298:466"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Survey language
                </UiText>
                <SurveyAISelect kind="language" />
              </div>
              <div className="sv71" data-node-id="298:471" data-name="Form field">
                <UiText
                  className="sv64"
                  data-node-id="298:472"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Question count
                </UiText>
                <SurveyAISelect kind="count" />
              </div>
            </div>
            <div className="sv1" data-node-id="298:477" data-name="Generate action">
              <UiText
                className="sv37"
                data-node-id="298:478"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Nothing is added until you review it.
              </UiText>
              <button
                type="button"
                className="sv38"
                data-node-id="298:479"
                data-name="Action"
                data-survey-action="Generate Questions"
              >
                <div className="sv6" data-node-id="298:480" data-name="sparkles">
                  <img alt="" className="sv7" src={imgSparkles} />
                </div>
                <UiText
                  className="sv33"
                  data-node-id="298:482"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Generate Questions
                </UiText>
              </button>
            </div>
          </div>
          <div className="sv72" data-node-id="298:483" data-name="Privacy note">
            <div className="sv60" data-node-id="298:484" data-name="shield-check">
              <img alt="" className="sv7" src={imgShieldCheck} />
            </div>
            <div className="sv73" data-node-id="298:486" data-name="Privacy copy">
              <UiText
                className="sv74"
                data-node-id="298:487"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Built for your business, controlled by you
              </UiText>
              <UiText
                className="sv75"
                data-node-id="298:488"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                AI suggestions are a starting point. Edit the wording, choose what to measure, and
                decide which questions to use.
              </UiText>
            </div>
          </div>
        </div>
        <div className="sv76" data-node-id="298:489" data-name="Generation guidance">
          <div className="sv50" data-node-id="298:490" data-name="From a goal to a useful survey">
            <div className="sv51" data-node-id="298:491" data-name="Section heading">
              <UiText
                className="sv52"
                data-node-id="298:492"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                From a goal to a useful survey
              </UiText>
            </div>
            <div className="sv77" data-node-id="298:493" data-name="Guidance item">
              <div className="sv60" data-node-id="298:494" data-name="sparkles">
                <img alt="" className="sv7" src={imgSparkles1} />
              </div>
              <div className="sv78" data-node-id="298:496" data-name="Guidance copy">
                <UiText
                  className="sv74"
                  data-node-id="298:497"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Tailored questions
                </UiText>
                <UiText
                  className="sv75"
                  data-node-id="298:498"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Relevant wording for a cafe and workspace, not a generic questionnaire.
                </UiText>
              </div>
            </div>
            <div className="sv77" data-node-id="298:499" data-name="Guidance item">
              <div className="sv60" data-node-id="298:500" data-name="sliders-horizontal">
                <img alt="" className="sv7" src={imgSlidersHorizontal} />
              </div>
              <div className="sv78" data-node-id="298:502" data-name="Guidance copy">
                <UiText
                  className="sv74"
                  data-node-id="298:503"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Aspects worth measuring
                </UiText>
                <UiText
                  className="sv75"
                  data-node-id="298:504"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Explore service speed, food quality, staff friendliness and value.
                </UiText>
              </div>
            </div>
            <div className="sv77" data-node-id="298:505" data-name="Guidance item">
              <button
                type="button"
                className="sv60"
                data-node-id="298:506"
                data-name="pencil-line"
                data-survey-action="Edit question"
                aria-label="Edit question"
              >
                <img alt="" className="sv7" src={imgPencilLine} />
              </button>
              <div className="sv78" data-node-id="298:508" data-name="Guidance copy">
                <UiText
                  className="sv74"
                  data-node-id="298:509"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Review before you publish
                </UiText>
                <UiText
                  className="sv75"
                  data-node-id="298:510"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Select suggestions, edit any question and add only what you need.
                </UiText>
              </div>
            </div>
          </div>
          <div
            className="sv40"
            data-node-id="298:511"
            data-name="A good goal leads to better feedback"
          >
            <div className="sv51" data-node-id="298:512" data-name="Section heading">
              <UiText
                className="sv52"
                data-node-id="298:513"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                A good goal leads to better feedback
              </UiText>
            </div>
            <UiText
              className="sv79"
              data-node-id="298:514"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Focus on one experience. Ask neutral questions and give customers room to explain what
              happened.
            </UiText>
            <div className="sv80" data-node-id="298:515" data-name="Tip">
              <div className="sv6" data-node-id="298:516" data-name="lightbulb">
                <img alt="" className="sv7" src={imgLightbulb} />
              </div>
              <UiText
                className="sv58"
                data-node-id="298:518"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Short surveys are easier to complete.
              </UiText>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
