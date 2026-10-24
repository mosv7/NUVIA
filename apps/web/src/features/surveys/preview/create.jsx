import React from 'react';
import { asset } from '../../../lib/assets.js';
import '../../../components/ui/ControlIcon.jsx';
import {
  UiText,
  SurveyField,
  SurveySwitch,
  useSurveyEditor,
  SurveyReviewMark,
} from './SurveyPrimitives.jsx';

const imgArrowLeft = asset('surveys-figma/create-imgArrowLeft.svg');
const imgCheck = asset('surveys-figma/create-imgCheck.svg');
const imgCircleCheck = asset('surveys-figma/create-imgCircleCheck.svg');
const imgShieldCheck = asset('surveys-figma/create-imgShieldCheck.svg');
const imgSmile = asset('surveys-figma/create-imgSmile.svg');
const imgStar = asset('surveys-figma/create-imgStar.svg');
const imgFilePlus2 = asset('surveys-figma/create-imgFilePlus2.svg');
const imgSparkles = asset('surveys-figma/create-imgSparkles.svg');
const imgCheck1 = asset('surveys-figma/create-imgCheck1.svg');
const imgLightbulb = asset('surveys-figma/create-imgLightbulb.svg');
const imgArrowLeft1 = asset('surveys-figma/create-imgArrowLeft1.svg');

export default function SurveyContent() {
  const editor = useSurveyEditor();
  return (
    <div className="sv0" data-node-id="259:4646" data-name="Survey content">
      <div className="sv149" data-node-id="259:4647" data-name="Page introduction">
        <button
          type="button"
          className="sv150"
          data-node-id="259:4648"
          data-name="Back to surveys"
          data-survey-action="All surveys"
        >
          <div className="sv148" data-node-id="259:4649" data-name="arrow-left">
            <img alt="" className="sv7" src={imgArrowLeft} />
          </div>
          <UiText
            className="sv90"
            data-node-id="259:4651"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            All surveys
          </UiText>
        </button>
        <div className="sv1" data-node-id="259:4652" data-name="Heading and actions">
          <div className="sv71" data-node-id="259:4653" data-name="Page heading">
            <div className="sv151" data-node-id="259:4654" data-name="Title and status">
              <UiText className="sv82" data-node-id="259:4655">
                Create survey
              </UiText>
            </div>
            <UiText
              className="sv83"
              data-node-id="259:4656"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Start a conversation with your customers, in every branch.
            </UiText>
          </div>
          <div className="sv151" data-node-id="259:4657" data-name="Page actions">
            <button
              type="button"
              className="sv152"
              data-node-id="259:4658"
              data-name="Action"
              data-survey-action="Save as draft"
            >
              <UiText
                className="sv86"
                data-node-id="259:4659"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Save as draft
              </UiText>
            </button>
          </div>
        </div>
      </div>
      <div className="sv153" data-node-id="259:4660" data-name="Survey workflow">
        <button
          type="button"
          className="sv154"
          data-node-id="259:4661"
          data-name="Workflow step"
          data-survey-action="1 Survey details"
        >
          <div className="sv155" data-node-id="259:4662" data-name="Step indicator">
            <UiText
              className="sv158"
              data-node-id="259:4663"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              1
            </UiText>
          </div>
          <UiText
            className="sv159"
            data-node-id="259:4664"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Survey details
          </UiText>
          <div className="sv157" data-node-id="259:4665" data-name="Connector" />
        </button>
        <button
          type="button"
          className="sv154"
          data-node-id="259:4666"
          data-name="Workflow step"
          data-survey-action="2 Build questions"
        >
          <div className="sv160" data-node-id="259:4667" data-name="Step indicator">
            <UiText
              className="sv161"
              data-node-id="259:4668"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              2
            </UiText>
          </div>
          <UiText
            className="sv156"
            data-node-id="259:4669"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Build questions
          </UiText>
          <div className="sv157" data-node-id="259:4670" data-name="Connector" />
        </button>
        <button
          type="button"
          className="sv154"
          data-node-id="259:4671"
          data-name="Workflow step"
          data-survey-action="3 Share survey"
        >
          <div className="sv160" data-node-id="259:4672" data-name="Step indicator">
            <UiText
              className="sv161"
              data-node-id="259:4673"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              3
            </UiText>
          </div>
          <UiText
            className="sv156"
            data-node-id="259:4674"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Share survey
          </UiText>
        </button>
      </div>
      <div className="sv230" data-node-id="259:4675" data-name="Survey setup">
        <div className="sv231" data-node-id="259:4676" data-name="Survey configuration">
          <div className="sv210" data-node-id="259:4677" data-name="Section">
            <div className="sv232" data-node-id="259:4678" data-name="Section heading">
              <UiText
                className="sv233"
                data-node-id="259:4679"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Survey details
              </UiText>
              <UiText
                className="sv234"
                data-node-id="259:4680"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Give your survey a name and a warm introduction.
              </UiText>
            </div>
            <div className="sv63" data-node-id="259:4681" data-name="Field">
              <UiText
                className="sv190"
                data-node-id="259:4682"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                <span className="sv191">{`Survey name `}</span>
                <span className="sv192">*</span>
              </UiText>
              <SurveyField
                className="sv193"
                data-node-id="259:4683"
                data-name="Input"
                initialValue="Customer experience survey"
                multiline={false}
              />
              <UiText
                className="sv49"
                data-node-id="259:4685"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Only visible to your team. You can change this later.
              </UiText>
            </div>
            <div className="sv63" data-node-id="259:4686" data-name="Field">
              <UiText
                className="sv216"
                data-node-id="259:4687"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Welcome message
              </UiText>
              <SurveyField
                className="sv235"
                data-node-id="259:4688"
                data-name="Input"
                initialValue={
                  'Thanks for visiting Bloom & Co.! Tell us about your experience. Your feedback helps us make every visit better.'
                }
                multiline={true}
              />
              <UiText
                className="sv49"
                data-node-id="259:4690"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Shown to customers before the first question.
              </UiText>
            </div>
          </div>
          <div className="sv210" data-node-id="259:4691" data-name="Section">
            <div className="sv232" data-node-id="259:4692" data-name="Section heading">
              <UiText
                className="sv233"
                data-node-id="259:4693"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >{`Languages & branches`}</UiText>
              <UiText
                className="sv234"
                data-node-id="259:4694"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Make feedback accessible and keep every response connected to a branch.
              </UiText>
            </div>
            <div className="sv29" data-node-id="259:4695" data-name="Survey languages">
              <div className="sv236" data-node-id="259:4696" data-name="Field heading">
                <UiText
                  className="sv237"
                  data-node-id="259:4697"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Survey languages
                </UiText>
                <UiText
                  className="sv238"
                  data-node-id="259:4698"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {editor.enabledLanguages.includes('en') ? 'Default: English' : 'Default: Arabic'}
                </UiText>
              </div>
              <div className="sv77" data-node-id="259:4699" data-name="Language options">
                <button
                  type="button"
                  className="sv239"
                  data-node-id="259:4700"
                  data-name="Language option"
                  data-survey-action="English"
                  aria-pressed={editor.enabledLanguages.includes('en')}
                  aria-label="Select option"
                >
                  <div className="sv240" data-node-id="259:4701" data-name="Checkbox">
                    <div className="sv46" data-node-id="259:4702" data-name="check">
                      <img alt="" className="sv7" src={imgCheck} />
                    </div>
                  </div>
                  <UiText
                    className="sv241"
                    data-node-id="259:4704"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    English
                  </UiText>
                </button>
                <button
                  type="button"
                  className="sv239"
                  data-node-id="259:4705"
                  data-name="Language option"
                  data-survey-action="العربية · Arabic"
                  aria-pressed={editor.enabledLanguages.includes('ar')}
                  aria-label="Select option"
                >
                  <div className="sv240" data-node-id="259:4706" data-name="Checkbox">
                    <div className="sv46" data-node-id="259:4707" data-name="check">
                      <img alt="" className="sv7" src={imgCheck} />
                    </div>
                  </div>
                  <UiText
                    className="sv241"
                    dir="auto"
                    data-node-id="259:4709"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    العربية · Arabic
                  </UiText>
                </button>
              </div>
              <UiText
                className="sv242"
                data-node-id="259:4710"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Customers can switch languages at any time.
              </UiText>
            </div>
            <div className="sv166" data-node-id="259:4711" data-name="Divider" />
            <div className="sv29" data-node-id="259:4712" data-name="Branch selection">
              <div className="sv236" data-node-id="259:4713" data-name="Field heading">
                <UiText
                  className="sv237"
                  data-node-id="259:4714"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Available at
                </UiText>
                <UiText
                  className="sv243"
                  data-node-id="259:4715"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  All 3 branches selected
                </UiText>
              </div>
              <div className="sv244" data-node-id="259:4716" data-name="Selected branches">
                <button
                  type="button"
                  className="sv245"
                  data-node-id="259:4717"
                  data-name="Branch option"
                  data-survey-action="Cairo"
                  aria-pressed="true"
                  aria-label="Select option"
                >
                  <div className="sv165" data-node-id="259:4718" data-name="circle-check">
                    <img alt="" className="sv7" src={imgCircleCheck} />
                  </div>
                  <UiText
                    className="sv214"
                    data-node-id="259:4720"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    Cairo
                  </UiText>
                </button>
                <button
                  type="button"
                  className="sv245"
                  data-node-id="259:4721"
                  data-name="Branch option"
                  data-survey-action="El Zamalek"
                  aria-pressed="true"
                  aria-label="Select option"
                >
                  <div className="sv165" data-node-id="259:4722" data-name="circle-check">
                    <img alt="" className="sv7" src={imgCircleCheck} />
                  </div>
                  <UiText
                    className="sv214"
                    data-node-id="259:4724"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    El Zamalek
                  </UiText>
                </button>
                <button
                  type="button"
                  className="sv245"
                  data-node-id="259:4725"
                  data-name="Branch option"
                  data-survey-action="Alex"
                  aria-pressed="true"
                  aria-label="Select option"
                >
                  <div className="sv165" data-node-id="259:4726" data-name="circle-check">
                    <img alt="" className="sv7" src={imgCircleCheck} />
                  </div>
                  <UiText
                    className="sv214"
                    data-node-id="259:4728"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    Alex
                  </UiText>
                </button>
              </div>
            </div>
          </div>
          <div className="sv246" data-node-id="259:4729" data-name="Privacy preference">
            <div className="sv247" data-node-id="259:4730" data-name="shield-check">
              <img alt="" className="sv7" src={imgShieldCheck} />
            </div>
            <div className="sv143" data-node-id="259:4732" data-name="Preference details">
              <UiText
                className="sv144"
                data-node-id="259:4733"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Collect feedback anonymously
              </UiText>
              <UiText
                className="sv18"
                data-node-id="259:4734"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                No name or contact details required to respond.
              </UiText>
            </div>
            <SurveySwitch className="sv215" />
          </div>
        </div>
        <div className="sv248" data-node-id="259:4737" data-name="Starting point and summary">
          <div className="sv210" data-node-id="259:4738" data-name="Section">
            <div className="sv232" data-node-id="259:4739" data-name="Section heading">
              <UiText
                className="sv233"
                data-node-id="259:4740"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Choose a starting point
              </UiText>
              <UiText
                className="sv234"
                data-node-id="259:4741"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Use a ready-made template or start fresh.
              </UiText>
            </div>
            <div className="sv249" data-node-id="259:4742" data-name="Templates">
              <button
                type="button"
                className="sv250"
                data-node-id="259:4743"
                data-name="Template option"
                aria-pressed={(editor.startingPoint || 'customer') === 'customer'}
                data-survey-action="Customer experience 6 questions · About 2 minutes"
              >
                <div className="sv142" data-node-id="259:4744" data-name="smile">
                  <img alt="" className="sv7" src={imgSmile} />
                </div>
                <div className="sv251" data-node-id="259:4746" data-name="Template details">
                  <UiText
                    className="sv130"
                    data-node-id="259:4747"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    Customer experience
                  </UiText>
                  <UiText
                    className="sv121"
                    data-node-id="259:4748"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    6 questions · About 2 minutes
                  </UiText>
                </div>
                <SurveyReviewMark />
              </button>
              <button
                type="button"
                className="sv253"
                data-node-id="259:4752"
                data-name="Template option"
                aria-pressed={editor.startingPoint === 'quick'}
                data-survey-action="Quick satisfaction check 3 questions · Under 1 minute"
              >
                <div className="sv142" data-node-id="259:4753" data-name="star">
                  <img alt="" className="sv7" src={imgStar} />
                </div>
                <div className="sv251" data-node-id="259:4755" data-name="Template details">
                  <UiText
                    className="sv130"
                    data-node-id="259:4756"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    Quick satisfaction check
                  </UiText>
                  <UiText
                    className="sv121"
                    data-node-id="259:4757"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    3 questions · Under 1 minute
                  </UiText>
                </div>
                <SurveyReviewMark />
              </button>
              <button
                type="button"
                className="sv253"
                data-node-id="259:4759"
                data-name="Template option"
                aria-pressed={editor.startingPoint === 'scratch'}
                data-survey-action="Start from scratch A blank canvas for your questions"
              >
                <div className="sv142" data-node-id="259:4760" data-name="file-plus-2">
                  <img alt="" className="sv7" src={imgFilePlus2} />
                </div>
                <div className="sv251" data-node-id="259:4762" data-name="Template details">
                  <UiText
                    className="sv130"
                    data-node-id="259:4763"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    Start from scratch
                  </UiText>
                  <UiText
                    className="sv121"
                    data-node-id="259:4764"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    A blank canvas for your questions
                  </UiText>
                </div>
                <SurveyReviewMark />
              </button>
            </div>
          </div>
          <button
            type="button"
            className="sv255"
            data-node-id="262:12005"
            data-name="Template option"
            data-survey-action="Generate with NUVIA AI Suggested questions for your business type and goal. Review and edit before adding"
          >
            <div className="sv247" data-node-id="262:12013" data-name="sparkles">
              <img alt="" className="sv7" src={imgSparkles} />
            </div>
            <div className="sv256" data-node-id="335:6506">
              <UiText
                className="sv42"
                data-node-id="262:12009"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Generate with NUVIA AI
              </UiText>
              <UiText
                className="sv121"
                data-node-id="262:12010"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Suggested questions for your business type and goal. Review and edit before adding
              </UiText>
            </div>
          </button>
          <div className="sv210" data-node-id="259:4766" data-name="Section">
            <div className="sv51" data-node-id="259:4767" data-name="Section heading">
              <UiText
                className="sv211"
                data-node-id="259:4768"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                A little feedback. A better visit.
              </UiText>
            </div>
            <UiText
              className="sv257"
              data-node-id="259:4769"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Understand what customers love and where you can improve, from the first welcome to
              the last sip.
            </UiText>
            <div className="sv258" data-node-id="259:4770" data-name="Template includes">
              <div className="sv259" data-node-id="259:4771" data-name="Included feature">
                <div className="sv148" data-node-id="259:4772" data-name="check">
                  <img alt="" className="sv7" src={imgCheck1} />
                </div>
                <UiText
                  className="sv260"
                  data-node-id="259:4774"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >{`Overall experience & recommendation`}</UiText>
              </div>
              <div className="sv259" data-node-id="259:4775" data-name="Included feature">
                <div className="sv148" data-node-id="259:4776" data-name="check">
                  <img alt="" className="sv7" src={imgCheck1} />
                </div>
                <UiText
                  className="sv260"
                  data-node-id="259:4778"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >{`Food, service & value for money`}</UiText>
              </div>
              <div className="sv259" data-node-id="259:4779" data-name="Included feature">
                <div className="sv148" data-node-id="259:4780" data-name="check">
                  <img alt="" className="sv7" src={imgCheck1} />
                </div>
                <UiText
                  className="sv260"
                  data-node-id="259:4782"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Open feedback in Arabic or English
                </UiText>
              </div>
            </div>
            <div className="sv261" data-node-id="259:4783" data-name="Status">
              <UiText
                className="sv172"
                data-node-id="259:4784"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Fully customizable
              </UiText>
            </div>
          </div>
          <div className="sv262" data-node-id="259:4785" data-name="Information">
            <div className="sv6" data-node-id="259:4786" data-name="lightbulb">
              <img alt="" className="sv7" src={imgLightbulb} />
            </div>
            <UiText
              className="sv223"
              data-node-id="259:4788"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Next, customize your questions and add Arabic translations before sharing.
            </UiText>
          </div>
        </div>
        <div className="sv263" data-node-id="335:6501">
          <div className="sv264">
            <div className="sv265" data-name="arrow-left">
              <img alt="" className="sv7" src={imgArrowLeft1} />
            </div>
          </div>
        </div>
      </div>
      <div className="sv224" data-node-id="259:4789" data-name="Setup actions">
        <UiText
          className="sv90"
          data-node-id="259:4790"
          style={{ fontVariationSettings: '"opsz" 14' }}
        >
          You can review everything before your survey goes live.
        </UiText>
        <div className="sv105" data-node-id="259:4791" data-name="Actions">
          <button
            type="button"
            className="sv152"
            data-node-id="259:4792"
            data-name="Action"
            data-survey-action="Cancel"
          >
            <UiText
              className="sv86"
              data-node-id="259:4793"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Cancel
            </UiText>
          </button>
          <button
            type="button"
            className="sv225"
            data-node-id="259:4794"
            data-name="Action"
            data-survey-action="Continue to questions"
          >
            <UiText
              className="sv266"
              data-node-id="259:4797"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Continue to questions
            </UiText>
          </button>
        </div>
      </div>
    </div>
  );
}
