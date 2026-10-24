import { SurveyRow, SurveyMoreMenu } from './SurveyRow.jsx';
import React from 'react';
import { asset } from '../../../lib/assets.js';
import ControlIcon from '../../../components/ui/ControlIcon.jsx';
import { UiText, SurveyTableCheck, SurveySortButton } from './SurveyPrimitives.jsx';

const imgPlus = asset('surveys-figma/closed-imgPlus.svg');
const imgIcon = asset('surveys-figma/closed-imgIcon.svg');
const imgRadio = asset('surveys-figma/closed-imgRadio.svg');
const imgIcon1 = asset('surveys-figma/closed-imgIcon1.svg');
const imgCircleCheck = asset('surveys-figma/closed-imgCircleCheck.svg');
const imgIcon2 = asset('surveys-figma/closed-imgIcon2.svg');

const imgIcon3 = asset('surveys-figma/closed-imgIcon3.svg');
const imgIcon4 = asset('surveys-figma/closed-imgIcon4.svg');
const imgPencil = asset('surveys-figma/closed-imgPencil.svg');
const imgEllipsis = asset('surveys-figma/closed-imgEllipsis.svg');

export default function SurveyContent() {
  return (
    <div className="sv0" data-node-id="258:4034" data-name="Survey content">
      <div className="sv1" data-node-id="258:4035" data-name="Heading and actions">
        <div className="sv71" data-node-id="258:4036" data-name="Page heading">
          <div className="sv81" data-node-id="258:4037" data-name="Title and status">
            <UiText className="sv82" data-node-id="258:4038">
              Manage surveys
            </UiText>
          </div>
          <UiText
            className="sv83"
            data-node-id="258:4039"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Create, manage and share feedback across your branches.
          </UiText>
        </div>
        <div className="sv84" data-node-id="258:4040" data-name="Page actions">
          <button
            type="button"
            className="sv85"
            data-node-id="258:4041"
            data-name="Action"
            data-survey-action="Export"
          >
            <div className="sv6" data-node-id="258:4042" data-name="download">
              <ControlIcon name="export" />
            </div>
            <UiText
              className="sv86"
              data-node-id="258:4044"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Export
            </UiText>
          </button>
          <button
            type="button"
            className="sv87"
            data-node-id="258:4045"
            data-name="Action"
            data-survey-action="Create survey"
          >
            <div className="sv6" data-node-id="258:4046" data-name="plus">
              <img alt="" className="sv7" src={imgPlus} />
            </div>
            <UiText
              className="sv88"
              data-node-id="258:4048"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Create survey
            </UiText>
          </button>
        </div>
      </div>
      <div className="sv70" data-node-id="258:4049" data-name="Survey overview">
        <div className="sv89" data-node-id="258:4050" data-name="Survey metric">
          <div className="sv1" data-node-id="258:4051" data-name="Metric heading">
            <UiText
              className="sv90"
              data-node-id="258:4052"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Total surveys
            </UiText>
            <div className="sv91" data-node-id="258:4053" data-name="Icon">
              <img alt="" className="sv7" src={imgIcon} />
            </div>
          </div>
          <div className="sv92" data-node-id="258:4055" data-name="Metric value and context">
            <UiText
              className="sv93"
              data-node-id="258:4056"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              6
            </UiText>
            <UiText
              className="sv94"
              data-node-id="258:4057"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Across 3 branches
            </UiText>
          </div>
        </div>
        <div className="sv89" data-node-id="258:4058" data-name="Survey metric">
          <div className="sv1" data-node-id="258:4059" data-name="Metric heading">
            <UiText
              className="sv90"
              data-node-id="258:4060"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Live surveys
            </UiText>
            <div className="sv91" data-node-id="258:4061" data-name="radio">
              <img alt="" className="sv7" src={imgRadio} />
            </div>
          </div>
          <div className="sv92" data-node-id="258:4063" data-name="Metric value and context">
            <UiText
              className="sv93"
              data-node-id="258:4064"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              2
            </UiText>
            <UiText
              className="sv94"
              data-node-id="258:4065"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Collecting feedback
            </UiText>
          </div>
        </div>
        <div className="sv89" data-node-id="258:4066" data-name="Survey metric">
          <div className="sv1" data-node-id="258:4067" data-name="Metric heading">
            <UiText
              className="sv90"
              data-node-id="258:4068"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Responses this month
            </UiText>
            <div className="sv91" data-node-id="258:4069" data-name="Icon">
              <img alt="" className="sv7" src={imgIcon1} />
            </div>
          </div>
          <div className="sv92" data-node-id="258:4071" data-name="Metric value and context">
            <UiText
              className="sv93"
              data-node-id="258:4072"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              1,248
            </UiText>
            <UiText
              className="sv94"
              data-node-id="258:4073"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              ↑ 18.2%
            </UiText>
          </div>
        </div>
        <div className="sv89" data-node-id="258:4074" data-name="Survey metric">
          <div className="sv1" data-node-id="258:4075" data-name="Metric heading">
            <UiText
              className="sv90"
              data-node-id="258:4076"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Completion rate
            </UiText>
            <div className="sv91" data-node-id="258:4077" data-name="circle-check">
              <img alt="" className="sv7" src={imgCircleCheck} />
            </div>
          </div>
          <div className="sv92" data-node-id="258:4079" data-name="Metric value and context">
            <UiText
              className="sv93"
              data-node-id="258:4080"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              86%
            </UiText>
            <UiText
              className="sv94"
              data-node-id="258:4081"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              ↑ 4 pts this month
            </UiText>
          </div>
        </div>
      </div>
      <div className="sv95" data-node-id="258:4082" data-name="Survey management">
        <div className="sv96" data-node-id="258:4083" data-name="Status filters">
          <button
            type="button"
            className="sv97"
            data-node-id="258:4084"
            data-name="Status tab"
            data-survey-action="All surveys  6"
          >
            <UiText
              className="sv100"
              data-node-id="258:4085"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`All surveys  6`}</UiText>
            <div className="sv229" data-node-id="258:4086" data-name="Active indicator" />
          </button>
          <button
            type="button"
            className="sv97"
            data-node-id="258:4087"
            data-name="Status tab"
            data-survey-action="Live  2"
          >
            <UiText
              className="sv100"
              data-node-id="258:4088"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`Live  2`}</UiText>
            <div className="sv101" data-node-id="258:4089" data-name="Active indicator" />
          </button>
          <button
            type="button"
            className="sv97"
            data-node-id="258:4090"
            data-name="Status tab"
            data-survey-action="Drafts  2"
          >
            <UiText
              className="sv100"
              data-node-id="258:4091"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`Drafts  2`}</UiText>
            <div className="sv101" data-node-id="258:4092" data-name="Active indicator" />
          </button>
          <button
            type="button"
            className="sv97"
            data-node-id="258:4093"
            data-name="Status tab"
            data-survey-action="Paused  1"
          >
            <UiText
              className="sv100"
              data-node-id="258:4094"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`Paused  1`}</UiText>
            <div className="sv101" data-node-id="258:4095" data-name="Active indicator" />
          </button>
          <button
            type="button"
            className="sv97"
            data-node-id="258:4096"
            data-name="Status tab"
            data-survey-action="Closed  1"
          >
            <UiText
              className="sv98"
              data-node-id="258:4097"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`Closed  1`}</UiText>
            <div className="sv99" data-node-id="258:4098" data-name="Active indicator" />
          </button>
        </div>
        <div className="sv102" data-node-id="258:4099" data-name="Search and filters">
          <div className="sv103" data-node-id="258:4100" data-name="Survey search">
            <div className="sv6" data-node-id="258:4101" data-name="Icon">
              <img alt="" className="sv7" src={imgIcon2} />
            </div>
            <input
              className="survey-search-input"
              aria-label="Search surveys"
              placeholder="Search surveys by name..."
            />
          </div>
          <div className="sv105" data-node-id="258:4104" data-name="Filters">
            <button
              type="button"
              className="sv106"
              data-node-id="258:4105"
              data-name="Action"
              data-survey-action="All 3 branches"
            >
              <div className="sv6" data-node-id="258:4106" data-name="store">
                <ControlIcon name="branch" />
              </div>
              <UiText
                className="sv107"
                data-node-id="258:4108"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                All 3 branches
              </UiText>
            </button>
            <SurveySortButton className="sv106" />
          </div>
        </div>
        <div className="sv108" data-node-id="258:4113" data-name="Table headings">
          <SurveyTableCheck className="sv109" data-node-id="258:4114" data-name="Select all" />
          <UiText
            className="sv110"
            data-node-id="258:4115"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            SURVEY NAME
          </UiText>
          <UiText
            className="sv111"
            data-node-id="258:4116"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            STATUS
          </UiText>
          <UiText
            className="sv112"
            data-node-id="258:4117"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            BRANCHES
          </UiText>
          <UiText
            className="sv113"
            data-node-id="258:4118"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            RESPONSES
          </UiText>
          <UiText
            className="sv114"
            data-node-id="258:4119"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            UPDATED
          </UiText>
          <UiText
            className="sv115"
            data-node-id="258:4120"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            ACTIONS
          </UiText>
        </div>
        <SurveyRow
          surveyName="Summer customer pulse"
          initialStatus="Closed"
          className="sv129"
          data-node-id="258:4233"
          data-name="Survey row"
          data-updated="2026-09-30"
        >
          <SurveyTableCheck className="sv109" data-node-id="258:4234" data-name="Select survey" />
          <div className="sv117" data-node-id="258:4235" data-name="Survey information">
            <div className="sv118" data-node-id="258:4236" data-name="Survey symbol">
              <div className="sv60" data-node-id="258:4237" data-name="Icon">
                <img alt="" className="sv7" src={imgIcon3} />
              </div>
            </div>
            <div className="sv119" data-node-id="258:4239" data-name="Survey details">
              <UiText
                className="sv130"
                data-node-id="258:4240"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Summer customer pulse
              </UiText>
              <UiText
                className="sv121"
                data-node-id="258:4241"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >{`6 questions · Arabic & English`}</UiText>
            </div>
          </div>
          <div className="sv122" data-node-id="258:4242" data-name="Survey status">
            <div className="sv131" data-node-id="258:4243" data-name="Status">
              <UiText
                className="sv132"
                data-node-id="258:4244"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Closed
              </UiText>
            </div>
          </div>
          <UiText
            className="sv125"
            data-node-id="258:4245"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            All 3 branches
          </UiText>
          <UiText
            className="sv126"
            data-node-id="258:4246"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            842
          </UiText>
          <UiText
            className="sv127"
            data-node-id="258:4247"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            30 Sep, 2026
          </UiText>
          <div className="sv128" data-node-id="258:4248" data-name="Management actions">
            <button
              type="button"
              className="sv106"
              data-node-id="258:4249"
              data-name="Action"
              data-survey-action="View results"
            >
              <div className="sv6" data-node-id="258:4250" data-name="Icon">
                <img alt="" className="sv7" src={imgIcon4} />
              </div>
              <UiText
                className="sv107"
                data-node-id="258:4252"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                View results
              </UiText>
            </button>
            <button
              type="button"
              className="sv6"
              data-node-id="258:4253"
              data-name="pencil"
              data-survey-action="Edit survey"
              aria-label="Edit survey"
            >
              <img alt="" className="sv7" src={imgPencil} />
            </button>
            <SurveyMoreMenu className="sv60" data-node-id="258:4255" data-name="ellipsis">
              <img alt="" className="sv7" src={imgEllipsis} />
            </SurveyMoreMenu>
          </div>
        </SurveyRow>
      </div>
    </div>
  );
}
