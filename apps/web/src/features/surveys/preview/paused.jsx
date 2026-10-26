import { SurveyRow, SurveyMoreMenu } from './SurveyRow.jsx';

import { asset } from '../../../lib/assets.js';
import ControlIcon from '../../../components/ui/ControlIcon.jsx';
import { UiText, SurveyTableCheck, SurveySortButton } from './SurveyPrimitives.jsx';

const imgPlus = asset('surveys-figma/paused-imgPlus.svg');
const imgIcon = asset('surveys-figma/paused-imgIcon.svg');
const imgRadio = asset('surveys-figma/paused-imgRadio.svg');
const imgIcon1 = asset('surveys-figma/paused-imgIcon1.svg');
const imgCircleCheck = asset('surveys-figma/paused-imgCircleCheck.svg');
const imgIcon2 = asset('surveys-figma/paused-imgIcon2.svg');

const imgIcon3 = asset('surveys-figma/paused-imgIcon3.svg');
const imgIcon4 = asset('surveys-figma/paused-imgIcon4.svg');
const imgPencil = asset('surveys-figma/paused-imgPencil.svg');
const imgEllipsis = asset('surveys-figma/paused-imgEllipsis.svg');

export default function SurveyContent() {
  return (
    <div className="sv0" data-node-id="258:3480" data-name="Survey content">
      <div className="sv1" data-node-id="258:3481" data-name="Heading and actions">
        <div className="sv71" data-node-id="258:3482" data-name="Page heading">
          <div className="sv81" data-node-id="258:3483" data-name="Title and status">
            <UiText className="sv82" data-node-id="258:3484">
              Manage surveys
            </UiText>
          </div>
          <UiText
            className="sv83"
            data-node-id="258:3485"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Create, manage and share feedback across your branches.
          </UiText>
        </div>
        <div className="sv84" data-node-id="258:3486" data-name="Page actions">
          <button
            type="button"
            className="sv85"
            data-node-id="258:3487"
            data-name="Action"
            data-survey-action="Export"
          >
            <div className="sv6" data-node-id="258:3488" data-name="download">
              <ControlIcon name="export" />
            </div>
            <UiText
              className="sv86"
              data-node-id="258:3490"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Export
            </UiText>
          </button>
          <button
            type="button"
            className="sv87"
            data-node-id="258:3491"
            data-name="Action"
            data-survey-action="Create survey"
          >
            <div className="sv6" data-node-id="258:3492" data-name="plus">
              <img alt="" className="sv7" src={imgPlus} />
            </div>
            <UiText
              className="sv88"
              data-node-id="258:3494"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Create survey
            </UiText>
          </button>
        </div>
      </div>
      <div className="sv70" data-node-id="258:3495" data-name="Survey overview">
        <div className="sv89" data-node-id="258:3496" data-name="Survey metric">
          <div className="sv1" data-node-id="258:3497" data-name="Metric heading">
            <UiText
              className="sv90"
              data-node-id="258:3498"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Total surveys
            </UiText>
            <div className="sv91" data-node-id="258:3499" data-name="Icon">
              <img alt="" className="sv7" src={imgIcon} />
            </div>
          </div>
          <div className="sv92" data-node-id="258:3501" data-name="Metric value and context">
            <UiText
              className="sv93"
              data-node-id="258:3502"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              6
            </UiText>
            <UiText
              className="sv94"
              data-node-id="258:3503"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Across 3 branches
            </UiText>
          </div>
        </div>
        <div className="sv89" data-node-id="258:3504" data-name="Survey metric">
          <div className="sv1" data-node-id="258:3505" data-name="Metric heading">
            <UiText
              className="sv90"
              data-node-id="258:3506"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Live surveys
            </UiText>
            <div className="sv91" data-node-id="258:3507" data-name="radio">
              <img alt="" className="sv7" src={imgRadio} />
            </div>
          </div>
          <div className="sv92" data-node-id="258:3509" data-name="Metric value and context">
            <UiText
              className="sv93"
              data-node-id="258:3510"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              2
            </UiText>
            <UiText
              className="sv94"
              data-node-id="258:3511"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Collecting feedback
            </UiText>
          </div>
        </div>
        <div className="sv89" data-node-id="258:3512" data-name="Survey metric">
          <div className="sv1" data-node-id="258:3513" data-name="Metric heading">
            <UiText
              className="sv90"
              data-node-id="258:3514"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Responses this month
            </UiText>
            <div className="sv91" data-node-id="258:3515" data-name="Icon">
              <img alt="" className="sv7" src={imgIcon1} />
            </div>
          </div>
          <div className="sv92" data-node-id="258:3517" data-name="Metric value and context">
            <UiText
              className="sv93"
              data-node-id="258:3518"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              1,248
            </UiText>
            <UiText
              className="sv94"
              data-node-id="258:3519"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              ↑ 18.2%
            </UiText>
          </div>
        </div>
        <div className="sv89" data-node-id="258:3520" data-name="Survey metric">
          <div className="sv1" data-node-id="258:3521" data-name="Metric heading">
            <UiText
              className="sv90"
              data-node-id="258:3522"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Completion rate
            </UiText>
            <div className="sv91" data-node-id="258:3523" data-name="circle-check">
              <img alt="" className="sv7" src={imgCircleCheck} />
            </div>
          </div>
          <div className="sv92" data-node-id="258:3525" data-name="Metric value and context">
            <UiText
              className="sv93"
              data-node-id="258:3526"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              86%
            </UiText>
            <UiText
              className="sv94"
              data-node-id="258:3527"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              ↑ 4 pts this month
            </UiText>
          </div>
        </div>
      </div>
      <div className="sv95" data-node-id="258:3528" data-name="Survey management">
        <div className="sv96" data-node-id="258:3529" data-name="Status filters">
          <button
            type="button"
            className="sv97"
            data-node-id="258:3530"
            data-name="Status tab"
            data-survey-action="All surveys  6"
          >
            <UiText
              className="sv100"
              data-node-id="258:3531"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`All surveys  6`}</UiText>
          </button>
          <button
            type="button"
            className="sv97"
            data-node-id="258:3533"
            data-name="Status tab"
            data-survey-action="Live  2"
          >
            <UiText
              className="sv100"
              data-node-id="258:3534"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`Live  2`}</UiText>
            <div className="sv101" data-node-id="258:3535" data-name="Active indicator" />
          </button>
          <button
            type="button"
            className="sv97"
            data-node-id="258:3536"
            data-name="Status tab"
            data-survey-action="Drafts  2"
          >
            <UiText
              className="sv100"
              data-node-id="258:3537"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`Drafts  2`}</UiText>
            <div className="sv101" data-node-id="258:3538" data-name="Active indicator" />
          </button>
          <button
            type="button"
            className="sv97"
            data-node-id="258:3539"
            data-name="Status tab"
            data-survey-action="Paused  1"
          >
            <UiText
              className="sv98"
              data-node-id="258:3540"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`Paused  1`}</UiText>
            <div className="sv99" data-node-id="258:3541" data-name="Active indicator" />
          </button>
          <button
            type="button"
            className="sv97"
            data-node-id="258:3542"
            data-name="Status tab"
            data-survey-action="Closed  1"
          >
            <UiText
              className="sv100"
              data-node-id="258:3543"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`Closed  1`}</UiText>
            <div className="sv101" data-node-id="258:3544" data-name="Active indicator" />
          </button>
        </div>
        <div className="sv102" data-node-id="258:3545" data-name="Search and filters">
          <div className="sv103" data-node-id="258:3546" data-name="Survey search">
            <div className="sv6" data-node-id="258:3547" data-name="Icon">
              <img alt="" className="sv7" src={imgIcon2} />
            </div>
            <input
              className="survey-search-input"
              aria-label="Search surveys"
              placeholder="Search surveys by name..."
            />
          </div>
          <div className="sv105" data-node-id="258:3550" data-name="Filters">
            <button
              type="button"
              className="sv106"
              data-node-id="258:3551"
              data-name="Action"
              data-survey-action="All 3 branches"
            >
              <div className="sv6" data-node-id="258:3552" data-name="store">
                <ControlIcon name="branch" />
              </div>
              <UiText
                className="sv107"
                data-node-id="258:3554"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                All 3 branches
              </UiText>
            </button>
            <SurveySortButton className="sv106" />
          </div>
        </div>
        <div className="sv108" data-node-id="258:3559" data-name="Table headings">
          <SurveyTableCheck className="sv109" data-node-id="258:3560" data-name="Select all" />
          <UiText
            className="sv110"
            data-node-id="258:3561"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            SURVEY NAME
          </UiText>
          <UiText
            className="sv111"
            data-node-id="258:3562"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            STATUS
          </UiText>
          <UiText
            className="sv112"
            data-node-id="258:3563"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            BRANCHES
          </UiText>
          <UiText
            className="sv113"
            data-node-id="258:3564"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            RESPONSES
          </UiText>
          <UiText
            className="sv114"
            data-node-id="258:3565"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            UPDATED
          </UiText>
          <UiText
            className="sv115"
            data-node-id="258:3566"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            ACTIONS
          </UiText>
        </div>
        <SurveyRow
          surveyName="{`Coffee & service check-in`}"
          initialStatus="Paused"
          className="sv129"
          data-node-id="258:3655"
          data-name="Survey row"
          data-updated="2026-10-03"
        >
          <SurveyTableCheck className="sv109" data-node-id="258:3656" data-name="Select survey" />
          <div className="sv117" data-node-id="258:3657" data-name="Survey information">
            <div className="sv118" data-node-id="258:3658" data-name="Survey symbol">
              <div className="sv60" data-node-id="258:3659" data-name="Icon">
                <img alt="" className="sv7" src={imgIcon3} />
              </div>
            </div>
            <div className="sv119" data-node-id="258:3661" data-name="Survey details">
              <UiText
                className="sv130"
                data-node-id="258:3662"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >{`Coffee & service check-in`}</UiText>
              <UiText
                className="sv121"
                data-node-id="258:3663"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >{`4 questions · Arabic & English`}</UiText>
            </div>
          </div>
          <div className="sv122" data-node-id="258:3664" data-name="Survey status">
            <div className="sv134" data-node-id="258:3665" data-name="Status">
              <UiText
                className="sv135"
                data-node-id="258:3666"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Paused
              </UiText>
            </div>
          </div>
          <UiText
            className="sv125"
            data-node-id="258:3667"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            El Zamalek
          </UiText>
          <UiText
            className="sv126"
            data-node-id="258:3668"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            124
          </UiText>
          <UiText
            className="sv127"
            data-node-id="258:3669"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            3 Oct, 2026
          </UiText>
          <div className="sv128" data-node-id="258:3670" data-name="Management actions">
            <button
              type="button"
              className="sv106"
              data-node-id="258:3671"
              data-name="Action"
              data-survey-action="View results"
            >
              <div className="sv6" data-node-id="258:3672" data-name="Icon">
                <img alt="" className="sv7" src={imgIcon4} />
              </div>
              <UiText
                className="sv107"
                data-node-id="258:3674"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                View results
              </UiText>
            </button>
            <button
              type="button"
              className="sv6"
              data-node-id="258:3675"
              data-name="pencil"
              data-survey-action="Edit survey"
              aria-label="Edit survey"
            >
              <img alt="" className="sv7" src={imgPencil} />
            </button>
            <SurveyMoreMenu className="sv60" data-node-id="258:3677" data-name="ellipsis">
              <img alt="" className="sv7" src={imgEllipsis} />
            </SurveyMoreMenu>
          </div>
        </SurveyRow>
      </div>
    </div>
  );
}
