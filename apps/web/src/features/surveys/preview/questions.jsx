import React from 'react';
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
const imgFrame62 = asset('surveys-figma/questions-imgFrame62.svg');
const imgIcon = asset('surveys-figma/questions-imgIcon.svg');
const imgArrowLeft = asset('surveys-figma/questions-imgArrowLeft.svg');
const imgCheck = asset('surveys-figma/questions-imgCheck.svg');
const imgHand = asset('surveys-figma/questions-imgHand.svg');
const imgStar = asset('surveys-figma/questions-imgStar.svg');
const imgListChecks = asset('surveys-figma/questions-imgListChecks.svg');
const imgStar1 = asset('surveys-figma/questions-imgStar1.svg');
const imgGauge = asset('surveys-figma/questions-imgGauge.svg');
const imgAlignLeft = asset('surveys-figma/questions-imgAlignLeft.svg');
const imgHeart = asset('surveys-figma/questions-imgHeart.svg');
const imgGripVertical = asset('surveys-figma/questions-imgGripVertical.svg');
const imgCopy = asset('surveys-figma/questions-imgCopy.svg');
const imgTrash2 = asset('surveys-figma/questions-imgTrash2.svg');
const imgCircleCheck = asset('surveys-figma/questions-imgCircleCheck.svg');
const imgStar2 = asset('surveys-figma/questions-imgStar2.svg');
const imgIcon1 = asset('surveys-figma/questions-imgIcon1.svg');
const imgPlus = asset('surveys-figma/questions-imgPlus.svg');
const imgLightbulb = asset('surveys-figma/questions-imgLightbulb.svg');
const imgClock3 = asset('surveys-figma/questions-imgClock3.svg');

export default function SurveyContent({ question = 1 }) {
  const editor = useSurveyEditor();
  const item = editor.questions[question];
  const model = { type: item.type, text: item.text[editor.language], ar: item.text.ar };
  const starCount = item.count;
  const setStarCount = (count) => editor.updateQuestion(question, { count });
  const selectedCard = (
    <div className="sv273" data-node-id="262:10795" data-name="Selected question">
      <div className="sv44" data-node-id="262:10796" data-name="Question header">
        <div className="sv148" data-node-id="262:10797" data-name="grip-vertical">
          <img alt="" className="sv7" src={imgGripVertical} />
        </div>
        <div className="sv188" data-node-id="262:10799" data-name="Question number">
          <UiText
            className="sv158"
            data-node-id="262:10800"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            {question}
          </UiText>
        </div>
        <UiText
          className="sv189"
          data-node-id="262:10801"
          style={{ fontVariationSettings: '"opsz" 14' }}
        >
          {model.type}
        </UiText>
        <button
          type="button"
          className="sv165"
          data-node-id="262:10802"
          data-name="copy"
          data-survey-action="question-copy"
          aria-label="Copy question"
        >
          <img alt="" className="sv7" src={imgCopy} />
        </button>
        <button
          type="button"
          className="sv165"
          data-node-id="262:10804"
          data-name="trash-2"
          data-survey-action="question-delete"
          aria-label="Delete question"
        >
          <img alt="" className="sv7" src={imgTrash2} />
        </button>
      </div>
      <div className="sv63" data-node-id="262:10806" data-name="Field">
        <UiText
          className="sv190"
          data-node-id="262:10807"
          style={{ fontVariationSettings: '"opsz" 14' }}
        >
          <span className="sv191">Question text</span>
          <span className="sv192">*</span>
        </UiText>
        <SurveyField
          className="sv193"
          data-node-id="262:10808"
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
      <div className="sv194" data-node-id="262:10832" data-name="Question properties">
        <div className="sv202" data-node-id="262:10833" data-name="Status">
          <UiText
            className="sv203"
            data-node-id="262:10834"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            {item.required ? 'Required' : 'Optional'}
          </UiText>
        </div>
        <UiText
          className="sv204"
          data-node-id="262:10835"
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
    <div className="sv0" data-node-id="262:10697" data-name="Survey content">
      <div className="sv149" data-node-id="262:11312" data-name="Page introduction">
        <button
          type="button"
          className="sv150"
          data-node-id="262:11313"
          data-name="Back to surveys"
          data-survey-action="All surveys"
        >
          <div className="sv148" data-node-id="262:11314" data-name="arrow-left">
            <img alt="" className="sv7" src={imgArrowLeft} />
          </div>
          <UiText
            className="sv90"
            data-node-id="262:11316"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            All surveys
          </UiText>
        </button>
        <div className="sv1" data-node-id="262:11317" data-name="Heading and actions">
          <div className="sv71" data-node-id="262:11318" data-name="Page heading">
            <div className="sv151" data-node-id="262:11319" data-name="Title and status">
              <UiText className="sv82" data-node-id="262:11320">
                Create survey
              </UiText>
            </div>
            <UiText
              className="sv83"
              data-node-id="262:11321"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Start a conversation with your customers, in every branch.
            </UiText>
          </div>
          <div className="sv151" data-node-id="262:11322" data-name="Page actions">
            <button
              type="button"
              className="sv152"
              data-node-id="262:11323"
              data-name="Action"
              data-survey-action="Save as draft"
            >
              <UiText
                className="sv86"
                data-node-id="262:11324"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Save as draft
              </UiText>
            </button>
          </div>
        </div>
      </div>
      <div className="sv153" data-node-id="262:10717" data-name="Survey workflow">
        <button
          type="button"
          className="sv154"
          data-node-id="262:10718"
          data-name="Workflow step"
          data-survey-action="Survey details"
        >
          <div className="sv155" data-node-id="262:10719" data-name="Step indicator">
            <div className="sv148" data-node-id="262:10720" data-name="check">
              <img alt="" className="sv7" src={imgCheck} />
            </div>
          </div>
          <UiText
            className="sv156"
            data-node-id="262:10722"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Survey details
          </UiText>
          <div className="sv157" data-node-id="262:10723" data-name="Connector" />
        </button>
        <button
          type="button"
          className="sv154"
          data-node-id="262:10724"
          data-name="Workflow step"
          data-survey-action="2 Build questions"
        >
          <div className="sv155" data-node-id="262:10725" data-name="Step indicator">
            <UiText
              className="sv158"
              data-node-id="262:10726"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              2
            </UiText>
          </div>
          <UiText
            className="sv159"
            data-node-id="262:10727"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Build questions
          </UiText>
          <div className="sv157" data-node-id="262:10728" data-name="Connector" />
        </button>
        <button
          type="button"
          className="sv154"
          data-node-id="262:10729"
          data-name="Workflow step"
          data-survey-action="3 Share survey"
        >
          <div className="sv160" data-node-id="262:10730" data-name="Step indicator">
            <UiText
              className="sv161"
              data-node-id="262:10731"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              3
            </UiText>
          </div>
          <UiText
            className="sv156"
            data-node-id="262:10732"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Share survey
          </UiText>
        </button>
      </div>
      <div className="sv162" data-node-id="262:10740" data-name="Question builder">
        <div className="sv163" data-node-id="262:10741" data-name="Survey outline">
          <div className="sv1" data-node-id="262:10742" data-name="Outline heading">
            <UiText
              className="sv164"
              data-node-id="262:10743"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Survey outline
            </UiText>
            <div className="sv131" data-node-id="262:10744" data-name="Status">
              <UiText
                className="sv132"
                data-node-id="262:10745"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                <SurveyQuestionCount compact />
              </UiText>
            </div>
          </div>
          <div className="sv84" data-node-id="262:10746" data-name="Welcome page">
            <div className="sv165" data-node-id="262:10747" data-name="hand">
              <img alt="" className="sv7" src={imgHand} />
            </div>
            <UiText
              className="sv90"
              data-node-id="262:10749"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Welcome page
            </UiText>
          </div>
          <div className="sv166" data-node-id="262:10750" data-name="Divider" />
          <SurveyQuestionOutline />
          <div className="sv166" data-node-id="262:10782" data-name="Divider" />
          <div className="sv84" data-node-id="262:10783" data-name="Thank you page">
            <div className="sv165" data-node-id="262:10784" data-name="heart">
              <img alt="" className="sv7" src={imgHeart} />
            </div>
            <UiText
              className="sv90"
              data-node-id="262:10786"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Thank you page
            </UiText>
          </div>
          <UiText
            className="sv175"
            data-node-id="262:10787"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Drag questions to change their order.
          </UiText>
        </div>
        <div className="sv272" data-node-id="262:10788" data-name="Questions">
          <div className="sv177" data-node-id="262:10789" data-name="Question tools">
            <UiText
              className="sv178"
              data-node-id="262:10790"
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
            data-node-id="262:10886"
            data-name="Add question"
            data-survey-action="Add question"
          >
            <div className="sv6" data-node-id="262:10887" data-name="plus">
              <img alt="" className="sv7" src={imgPlus} />
            </div>
            <UiText
              className="sv139"
              data-node-id="262:10889"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Add question
            </UiText>
          </button>
        </div>
        <div className="sv209" data-node-id="262:10890" data-name="Builder settings">
          <div className="sv210" data-node-id="262:10891" data-name="Section">
            <div className="sv51" data-node-id="262:10892" data-name="Section heading">
              <UiText
                className="sv211"
                data-node-id="262:10893"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Question settings
              </UiText>
            </div>
            <div className="sv63" data-node-id="262:10894" data-name="Field">
              <UiText
                className="sv212"
                data-node-id="262:10895"
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
            <div className="sv1" data-node-id="262:10900" data-name="Required preference">
              <UiText
                className="sv214"
                data-node-id="262:10901"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Required question
              </UiText>
              <SurveySwitch className="sv215" editorSetting="required" />
            </div>
            <div className="sv166" data-node-id="262:10904" data-name="Divider" />
            {!['Long text', 'NPS'].includes(model.type) && (
              <div className="sv63" data-node-id="262:10905" data-name="Field">
                <UiText
                  className="sv216"
                  data-node-id="262:10906"
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
              <div className="sv63" data-node-id="262:10911" data-name="Field">
                <UiText
                  className="sv216"
                  data-node-id="262:10912"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Lowest rating label
                </UiText>
                <SurveyField
                  className="sv193"
                  data-node-id="262:10913"
                  data-name="Input"
                  data-edit-language="en"
                  editorField="lowLabel"
                  initialValue={'Very poor'}
                  multiline={false}
                />
              </div>
            )}
            {model.type === 'Star rating' && (
              <div className="sv63" data-node-id="262:10915" data-name="Field">
                <UiText
                  className="sv216"
                  data-node-id="262:10916"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Highest rating label
                </UiText>
                <SurveyField
                  className="sv193"
                  data-node-id="262:10917"
                  data-name="Input"
                  data-edit-language="en"
                  editorField="highLabel"
                  initialValue={'Excellent'}
                  multiline={false}
                />
              </div>
            )}
          </div>
          <div className="sv210" data-node-id="262:10919" data-name="Section">
            <div className="sv51" data-node-id="262:10920" data-name="Section heading">
              <UiText
                className="sv211"
                data-node-id="262:10921"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Survey settings
              </UiText>
            </div>
            <div className="sv218" data-node-id="262:10922" data-name="Settings summary">
              <div className="sv219" data-node-id="262:10923" data-name="Setting">
                <UiText
                  className="sv220"
                  data-node-id="262:10924"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Languages
                </UiText>
                <UiText
                  className="sv221"
                  data-node-id="262:10925"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  English + Arabic
                </UiText>
              </div>
              <div className="sv219" data-node-id="262:10926" data-name="Setting">
                <UiText
                  className="sv220"
                  data-node-id="262:10927"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Branches
                </UiText>
                <UiText
                  className="sv221"
                  data-node-id="262:10928"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  All 3 branches
                </UiText>
              </div>
              <div className="sv219" data-node-id="262:10929" data-name="Setting">
                <UiText
                  className="sv220"
                  data-node-id="262:10930"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Responses
                </UiText>
                <UiText
                  className="sv221"
                  data-node-id="262:10931"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Anonymous
                </UiText>
              </div>
            </div>
            <UiText
              className="sv139"
              data-node-id="262:10932"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Edit survey details →
            </UiText>
          </div>
          <div className="sv222" data-node-id="262:10933" data-name="Information">
            <div className="sv6" data-node-id="262:10934" data-name="lightbulb">
              <img alt="" className="sv7" src={imgLightbulb} />
            </div>
            <UiText
              className="sv223"
              data-node-id="262:10936"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Keep it short. Surveys under 3 minutes get more completed responses.
            </UiText>
          </div>
        </div>
      </div>
      <div className="sv224" data-node-id="262:10937" data-name="Builder footer">
        <div className="sv80" data-node-id="262:10938" data-name="Survey summary">
          <div className="sv165" data-node-id="262:10939" data-name="clock-3">
            <img alt="" className="sv7" src={imgClock3} />
          </div>
          <UiText
            className="sv90"
            data-node-id="262:10941"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            <SurveyQuestionCount />
          </UiText>
        </div>
        <div className="sv105" data-node-id="262:10942" data-name="Actions">
          <button
            type="button"
            className="sv152"
            data-node-id="262:10943"
            data-name="Action"
            data-survey-action="Save & close"
          >
            <UiText
              className="sv86"
              data-node-id="262:10944"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {`Save & close`}
            </UiText>
          </button>
          <button
            type="button"
            className="sv225"
            data-node-id="262:10945"
            data-name="Action"
            data-survey-action="Continue to sharing"
          >
            <UiText
              className="sv226"
              data-node-id="262:10948"
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
