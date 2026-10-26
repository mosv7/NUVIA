import { asset } from '../../../lib/assets.js';

import {
  UiText,
  SurveyField,
  SurveySwitch,
  SurveyDropdown,
  SurveyLanguageEditor,
  SurveyAnswer,
  SurveyCount,
  SurveyQuestionList,
  useSurveyEditor,
  SurveyQuestionOutline,
  SurveyQuestionCount,
} from './SurveyPrimitives.jsx';

const imgArrowLeft = asset('surveys-figma/edit-imgArrowLeft.svg');
const imgEye = asset('surveys-figma/edit-imgEye.svg');
const imgCheck = asset('surveys-figma/edit-imgCheck.svg');
const imgInfo = asset('surveys-figma/edit-imgInfo.svg');
const imgCloudCheck = asset('surveys-figma/edit-imgCloudCheck.svg');
const imgHand = asset('surveys-figma/edit-imgHand.svg');

const imgHeart = asset('surveys-figma/edit-imgHeart.svg');
const imgGripVertical = asset('surveys-figma/edit-imgGripVertical.svg');
const imgCopy = asset('surveys-figma/edit-imgCopy.svg');
const imgTrash2 = asset('surveys-figma/edit-imgTrash2.svg');
const imgCircleCheck = asset('surveys-figma/edit-imgCircleCheck.svg');

const imgPlus = asset('surveys-figma/edit-imgPlus.svg');
const imgLightbulb = asset('surveys-figma/edit-imgLightbulb.svg');
const imgClock3 = asset('surveys-figma/edit-imgClock3.svg');

export default function SurveyContent({ question = 1 }) {
  const editor = useSurveyEditor();
  const item = editor.questions[question];
  const model = { type: item.type, text: item.text[editor.language], ar: item.text.ar };
  const starCount = item.count;
  const setStarCount = (count) => editor.updateQuestion(question, { count });
  const selectedCard = (
    <div className="sv273" data-node-id="262:11158" data-name="Selected question">
      <div className="sv44" data-node-id="262:11159" data-name="Question header">
        <div className="sv148" data-node-id="262:11160" data-name="grip-vertical">
          <img alt="" className="sv7" src={imgGripVertical} />
        </div>
        <div className="sv188" data-node-id="262:11162" data-name="Question number">
          <UiText
            className="sv158"
            data-node-id="262:11163"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            {question}
          </UiText>
        </div>
        <UiText
          className="sv189"
          data-node-id="262:11164"
          style={{ fontVariationSettings: '"opsz" 14' }}
        >
          {model.type}
        </UiText>
        <button
          type="button"
          className="sv165"
          data-node-id="262:11165"
          data-name="copy"
          data-survey-action="question-copy"
          aria-label="Copy question"
        >
          <img alt="" className="sv7" src={imgCopy} />
        </button>
        <button
          type="button"
          className="sv165"
          data-node-id="262:11167"
          data-name="trash-2"
          data-survey-action="question-delete"
          aria-label="Delete question"
        >
          <img alt="" className="sv7" src={imgTrash2} />
        </button>
      </div>
      <div className="sv63" data-node-id="262:11169" data-name="Field">
        <UiText
          className="sv190"
          data-node-id="262:11170"
          style={{ fontVariationSettings: '"opsz" 14' }}
        >
          <span className="sv191">Question text</span>
          <span className="sv192">*</span>
        </UiText>
        <SurveyField
          className="sv193"
          data-node-id="262:11171"
          data-name="Input"
          data-edit-language="en"
          editorField="text"
          initialValue={model.text}
          multiline={false}
          key={question + '-' + model.text}
        />
      </div>
      {editor.viewMode === 'both' && (
        <div className="sv63" data-name="Arabic translation">
          <div className="sv194" data-name="Translation label">
            <UiText className="sv169">Arabic translation</UiText>
            <div className="sv21" data-name="circle-check">
              <img alt="" className="sv7" src={imgCircleCheck} />
            </div>
          </div>
          <SurveyField
            className="sv195"
            data-name="Translated question"
            editorField="text"
            fieldLanguage="ar"
          />
        </div>
      )}

      <SurveyAnswer key={question} type={model.type} count={starCount} />
      <div className="sv194" data-node-id="262:11195" data-name="Question properties">
        <div className="sv202" data-node-id="262:12016" data-name="Status">
          <UiText
            className="sv203"
            data-node-id="262:12017"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            {item.required ? 'Required' : 'Optional'}
          </UiText>
        </div>
        <UiText
          className="sv204"
          data-node-id="262:11198"
          style={{ fontVariationSettings: '"opsz" 14' }}
        >
          {editor.enabledLanguages.length === 2
            ? 'English & Arabic ready'
            : editor.language === 'ar'
              ? 'Arabic'
              : 'English'}
        </UiText>
      </div>
    </div>
  );
  return (
    <div className="sv0" data-node-id="262:11060" data-name="Survey content">
      <div className="sv149" data-node-id="262:11061" data-name="Page introduction">
        <button
          type="button"
          className="sv150"
          data-node-id="262:11062"
          data-name="Back to surveys"
          data-survey-action="All surveys"
        >
          <div className="sv148" data-node-id="262:11063" data-name="arrow-left">
            <img alt="" className="sv7" src={imgArrowLeft} />
          </div>
          <UiText
            className="sv90"
            data-node-id="262:11065"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            All surveys
          </UiText>
        </button>
        <div className="sv1" data-node-id="262:11066" data-name="Heading and actions">
          <div className="sv71" data-node-id="262:11067" data-name="Page heading">
            <div className="sv267" data-node-id="262:11068" data-name="Title and status">
              <UiText className="sv82" data-node-id="262:11069">
                Edit survey
              </UiText>
              <div className="sv123" data-node-id="262:11070" data-name="Status">
                <UiText
                  className="sv124"
                  data-node-id="262:11071"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Live
                </UiText>
              </div>
            </div>
            <UiText
              className="sv83"
              data-node-id="262:11072"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`Customer experience survey · All 3 branches · Arabic & English`}</UiText>
          </div>
          <div className="sv84" data-node-id="262:11073" data-name="Page actions">
            <button
              type="button"
              className="sv85"
              data-node-id="262:11074"
              data-name="Action"
              data-survey-action="Preview"
            >
              <div className="sv6" data-node-id="262:11075" data-name="eye">
                <img alt="" className="sv7" src={imgEye} />
              </div>
              <UiText
                className="sv86"
                data-node-id="262:11077"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Preview
              </UiText>
            </button>
            <button
              type="button"
              className="sv225"
              data-node-id="262:11078"
              data-name="Action"
              data-survey-action="Publish changes"
            >
              <UiText
                className="sv88"
                data-node-id="262:11079"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Publish changes
              </UiText>
            </button>
          </div>
        </div>
      </div>
      <div className="sv153" data-node-id="262:11080" data-name="Survey workflow">
        <button
          type="button"
          className="sv154"
          data-node-id="262:11081"
          data-name="Workflow step"
          data-survey-action="Survey details"
        >
          <div className="sv155" data-node-id="262:11082" data-name="Step indicator">
            <div className="sv148" data-node-id="262:11083" data-name="check">
              <img alt="" className="sv7" src={imgCheck} />
            </div>
          </div>
          <UiText
            className="sv156"
            data-node-id="262:11085"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Survey details
          </UiText>
          <div className="sv157" data-node-id="262:11086" data-name="Connector" />
        </button>
        <button
          type="button"
          className="sv154"
          data-node-id="262:11087"
          data-name="Workflow step"
          data-survey-action="2 Build questions"
        >
          <div className="sv155" data-node-id="262:11088" data-name="Step indicator">
            <UiText
              className="sv158"
              data-node-id="262:11089"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              2
            </UiText>
          </div>
          <UiText
            className="sv159"
            data-node-id="262:11090"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Build questions
          </UiText>
          <div className="sv157" data-node-id="262:11091" data-name="Connector" />
        </button>
        <button
          type="button"
          className="sv154"
          data-node-id="262:11092"
          data-name="Workflow step"
          data-survey-action="3 Share survey"
        >
          <div className="sv160" data-node-id="262:11093" data-name="Step indicator">
            <UiText
              className="sv161"
              data-node-id="262:11094"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              3
            </UiText>
          </div>
          <UiText
            className="sv156"
            data-node-id="262:11095"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Share survey
          </UiText>
        </button>
      </div>
      <div className="sv268" data-node-id="262:11096" data-name="Editing status">
        <div className="sv6" data-node-id="262:11097" data-name="info">
          <img alt="" className="sv7" src={imgInfo} />
        </div>
        <UiText
          className="sv269"
          data-node-id="262:11099"
          style={{ fontVariationSettings: '"opsz" 14' }}
        >
          Your live survey keeps collecting responses. Changes only go live when you publish.
        </UiText>
        <div className="sv6" data-node-id="262:11100" data-name="cloud-check">
          <img alt="" className="sv7" src={imgCloudCheck} />
        </div>
        <UiText
          className="sv270"
          data-node-id="262:11102"
          style={{ fontVariationSettings: '"opsz" 14' }}
        >
          All changes saved
        </UiText>
      </div>
      <div className="sv162" data-node-id="262:11103" data-name="Question builder">
        <div className="sv163" data-node-id="262:11104" data-name="Survey outline">
          <div className="sv1" data-node-id="262:11105" data-name="Outline heading">
            <UiText
              className="sv164"
              data-node-id="262:11106"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Survey outline
            </UiText>
            <div className="sv131" data-node-id="262:11107" data-name="Status">
              <UiText
                className="sv132"
                data-node-id="262:11108"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                <SurveyQuestionCount compact />
              </UiText>
            </div>
          </div>
          <div className="sv84" data-node-id="262:11109" data-name="Welcome page">
            <div className="sv165" data-node-id="262:11110" data-name="hand">
              <img alt="" className="sv7" src={imgHand} />
            </div>
            <UiText
              className="sv90"
              data-node-id="262:11112"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Welcome page
            </UiText>
          </div>
          <div className="sv166" data-node-id="262:11113" data-name="Divider" />
          <SurveyQuestionOutline />
          <div className="sv166" data-node-id="262:11145" data-name="Divider" />
          <div className="sv84" data-node-id="262:11146" data-name="Thank you page">
            <div className="sv165" data-node-id="262:11147" data-name="heart">
              <img alt="" className="sv7" src={imgHeart} />
            </div>
            <UiText
              className="sv90"
              data-node-id="262:11149"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Thank you page
            </UiText>
          </div>
          <UiText
            className="sv175"
            data-node-id="262:11150"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Drag questions to change their order.
          </UiText>
        </div>
        <div className="sv272" data-node-id="262:11151" data-name="Questions">
          <div className="sv177" data-node-id="262:11152" data-name="Question tools">
            <UiText
              className="sv178"
              data-node-id="262:11153"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Questions
            </UiText>
            <SurveyLanguageEditor className="sv179" />
          </div>
          <SurveyQuestionList question={question} selectedCard={selectedCard} />

          <button
            type="button"
            className="sv208"
            data-node-id="262:11249"
            data-name="Add question"
            data-survey-action="Add question"
          >
            <div className="sv6" data-node-id="262:11250" data-name="plus">
              <img alt="" className="sv7" src={imgPlus} />
            </div>
            <UiText
              className="sv139"
              data-node-id="262:11252"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Add question
            </UiText>
          </button>
        </div>
        <div className="sv209" data-node-id="262:11253" data-name="Builder settings">
          <div className="sv210" data-node-id="262:11254" data-name="Section">
            <div className="sv51" data-node-id="262:11255" data-name="Section heading">
              <UiText
                className="sv211"
                data-node-id="262:11256"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Question settings
              </UiText>
            </div>
            <div className="sv63" data-node-id="262:11257" data-name="Field">
              <UiText
                className="sv212"
                data-node-id="262:11258"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Question type
              </UiText>
              <SurveyDropdown
                className="sv213"
                state={model.type}
                onChange={(type) => editor.updateQuestion(question, { type })}
              />
            </div>
            <div className="sv1" data-node-id="262:11263" data-name="Required preference">
              <UiText
                className="sv214"
                data-node-id="262:11264"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Required question
              </UiText>
              <SurveySwitch className="sv215" editorSetting="required" />
            </div>
            <div className="sv166" data-node-id="262:11266" data-name="Divider" />
            {!['Long text', 'NPS'].includes(model.type) && (
              <div className="sv63" data-node-id="262:11267" data-name="Field">
                <UiText
                  className="sv216"
                  data-node-id="262:11268"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {model.type === 'Star rating' ? 'Number of stars' : 'Number of choices'}
                </UiText>
                <SurveyCount
                  kind={model.type === 'Star rating' ? 'stars' : 'choices'}
                  value={starCount}
                  onChange={setStarCount}
                />
              </div>
            )}
            {model.type === 'Star rating' && (
              <div className="sv63" data-node-id="262:11273" data-name="Field">
                <UiText
                  className="sv216"
                  data-node-id="262:11274"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Lowest rating label
                </UiText>
                <SurveyField
                  className="sv193"
                  data-node-id="262:11275"
                  data-name="Input"
                  data-edit-language="en"
                  editorField="lowLabel"
                  initialValue={'Very poor'}
                  multiline={false}
                />
              </div>
            )}
            {model.type === 'Star rating' && (
              <div className="sv63" data-node-id="262:11277" data-name="Field">
                <UiText
                  className="sv216"
                  data-node-id="262:11278"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Highest rating label
                </UiText>
                <SurveyField
                  className="sv193"
                  data-node-id="262:11279"
                  data-name="Input"
                  data-edit-language="en"
                  editorField="highLabel"
                  initialValue={'Excellent'}
                  multiline={false}
                />
              </div>
            )}
          </div>
          <div className="sv210" data-node-id="262:11281" data-name="Section">
            <div className="sv51" data-node-id="262:11282" data-name="Section heading">
              <UiText
                className="sv211"
                data-node-id="262:11283"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Survey settings
              </UiText>
            </div>
            <div className="sv218" data-node-id="262:11284" data-name="Settings summary">
              <div className="sv219" data-node-id="262:11285" data-name="Setting">
                <UiText
                  className="sv220"
                  data-node-id="262:11286"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Languages
                </UiText>
                <UiText
                  className="sv221"
                  data-node-id="262:11287"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  English + Arabic
                </UiText>
              </div>
              <div className="sv219" data-node-id="262:11288" data-name="Setting">
                <UiText
                  className="sv220"
                  data-node-id="262:11289"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Branches
                </UiText>
                <UiText
                  className="sv221"
                  data-node-id="262:11290"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  All 3 branches
                </UiText>
              </div>
              <div className="sv219" data-node-id="262:11291" data-name="Setting">
                <UiText
                  className="sv220"
                  data-node-id="262:11292"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Responses
                </UiText>
                <UiText
                  className="sv221"
                  data-node-id="262:11293"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Anonymous
                </UiText>
              </div>
            </div>
            <UiText
              className="sv139"
              data-node-id="262:11294"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Edit survey details →
            </UiText>
          </div>
          <div className="sv222" data-node-id="262:11295" data-name="Information">
            <div className="sv6" data-node-id="262:11296" data-name="lightbulb">
              <img alt="" className="sv7" src={imgLightbulb} />
            </div>
            <UiText
              className="sv223"
              data-node-id="262:11298"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Keep it short. Surveys under 3 minutes get more completed responses.
            </UiText>
          </div>
        </div>
      </div>
      <div className="sv224" data-node-id="262:11299" data-name="Builder footer">
        <div className="sv80" data-node-id="262:11300" data-name="Survey summary">
          <div className="sv165" data-node-id="262:11301" data-name="clock-3">
            <img alt="" className="sv7" src={imgClock3} />
          </div>
          <UiText
            className="sv90"
            data-node-id="262:11303"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            <SurveyQuestionCount />
          </UiText>
        </div>
        <div className="sv105" data-node-id="262:11304" data-name="Actions">
          <button
            type="button"
            className="sv152"
            data-node-id="262:11305"
            data-name="Action"
            data-survey-action="Save & close"
          >
            <UiText
              className="sv86"
              data-node-id="262:11306"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`Save & close`}</UiText>
          </button>
          <button
            type="button"
            className="sv225"
            data-node-id="262:11307"
            data-name="Action"
            data-survey-action="Continue to sharing"
          >
            <UiText
              className="sv226"
              data-node-id="262:11308"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Continue to sharing
            </UiText>
          </button>
        </div>
      </div>
    </div>
  );
}
