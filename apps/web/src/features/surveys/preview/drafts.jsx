import { SurveyRow, SurveyMoreMenu } from './SurveyRow.jsx';

import { asset } from '../../../lib/assets.js';
import ControlIcon from '../../../components/ui/ControlIcon.jsx';
import { UiText, SurveyTableCheck, SurveySortButton } from './SurveyPrimitives.jsx';

const imgPlus = asset('surveys-figma/drafts-imgPlus.svg');
const imgIcon = asset('surveys-figma/drafts-imgIcon.svg');
const imgRadio = asset('surveys-figma/drafts-imgRadio.svg');
const imgIcon1 = asset('surveys-figma/drafts-imgIcon1.svg');
const imgCircleCheck = asset('surveys-figma/drafts-imgCircleCheck.svg');
const imgIcon2 = asset('surveys-figma/drafts-imgIcon2.svg');

const imgIcon3 = asset('surveys-figma/drafts-imgIcon3.svg');
const imgEllipsis = asset('surveys-figma/drafts-imgEllipsis.svg');

export default function SurveyContent() {
  return (
    <div className="sv0" data-node-id="258:2793" data-name="Survey content">
      <div className="sv1" data-node-id="258:2794" data-name="Heading and actions">
        <div className="sv71" data-node-id="258:2795" data-name="Page heading">
          <div className="sv81" data-node-id="258:2796" data-name="Title and status">
            <UiText className="sv82" data-node-id="258:2797">
              Manage surveys
            </UiText>
          </div>
          <UiText
            className="sv83"
            data-node-id="258:2798"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Create, manage and share feedback across your branches.
          </UiText>
        </div>
        <div className="sv84" data-node-id="258:2799" data-name="Page actions">
          <button
            type="button"
            className="sv85"
            data-node-id="258:2800"
            data-name="Action"
            data-survey-action="Export"
          >
            <div className="sv6" data-node-id="258:2801" data-name="download">
              <ControlIcon name="export" />
            </div>
            <UiText
              className="sv86"
              data-node-id="258:2803"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Export
            </UiText>
          </button>
          <button
            type="button"
            className="sv87"
            data-node-id="258:2804"
            data-name="Action"
            data-survey-action="Create survey"
          >
            <div className="sv6" data-node-id="258:2805" data-name="plus">
              <img alt="" className="sv7" src={imgPlus} />
            </div>
            <UiText
              className="sv88"
              data-node-id="258:2807"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Create survey
            </UiText>
          </button>
        </div>
      </div>
      <div className="sv70" data-node-id="258:2808" data-name="Survey overview">
        <div className="sv89" data-node-id="258:2809" data-name="Survey metric">
          <div className="sv1" data-node-id="258:2810" data-name="Metric heading">
            <UiText
              className="sv90"
              data-node-id="258:2811"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Total surveys
            </UiText>
            <div className="sv91" data-node-id="258:2812" data-name="Icon">
              <img alt="" className="sv7" src={imgIcon} />
            </div>
          </div>
          <div className="sv92" data-node-id="258:2814" data-name="Metric value and context">
            <UiText
              className="sv93"
              data-node-id="258:2815"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              6
            </UiText>
            <UiText
              className="sv94"
              data-node-id="258:2816"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Across 3 branches
            </UiText>
          </div>
        </div>
        <div className="sv89" data-node-id="258:2817" data-name="Survey metric">
          <div className="sv1" data-node-id="258:2818" data-name="Metric heading">
            <UiText
              className="sv90"
              data-node-id="258:2819"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Live surveys
            </UiText>
            <div className="sv91" data-node-id="258:2820" data-name="radio">
              <img alt="" className="sv7" src={imgRadio} />
            </div>
          </div>
          <div className="sv92" data-node-id="258:2822" data-name="Metric value and context">
            <UiText
              className="sv93"
              data-node-id="258:2823"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              2
            </UiText>
            <UiText
              className="sv94"
              data-node-id="258:2824"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Collecting feedback
            </UiText>
          </div>
        </div>
        <div className="sv89" data-node-id="258:2825" data-name="Survey metric">
          <div className="sv1" data-node-id="258:2826" data-name="Metric heading">
            <UiText
              className="sv90"
              data-node-id="258:2827"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Responses this month
            </UiText>
            <div className="sv91" data-node-id="258:2828" data-name="Icon">
              <img alt="" className="sv7" src={imgIcon1} />
            </div>
          </div>
          <div className="sv92" data-node-id="258:2830" data-name="Metric value and context">
            <UiText
              className="sv93"
              data-node-id="258:2831"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              1,248
            </UiText>
            <UiText
              className="sv94"
              data-node-id="258:2832"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              ↑ 18.2%
            </UiText>
          </div>
        </div>
        <div className="sv89" data-node-id="258:2833" data-name="Survey metric">
          <div className="sv1" data-node-id="258:2834" data-name="Metric heading">
            <UiText
              className="sv90"
              data-node-id="258:2835"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Completion rate
            </UiText>
            <div className="sv91" data-node-id="258:2836" data-name="circle-check">
              <img alt="" className="sv7" src={imgCircleCheck} />
            </div>
          </div>
          <div className="sv92" data-node-id="258:2838" data-name="Metric value and context">
            <UiText
              className="sv93"
              data-node-id="258:2839"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              86%
            </UiText>
            <UiText
              className="sv94"
              data-node-id="258:2840"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              ↑ 4 pts this month
            </UiText>
          </div>
        </div>
      </div>
      <div className="sv95" data-node-id="258:2841" data-name="Survey management">
        <div className="sv96" data-node-id="258:2842" data-name="Status filters">
          <button
            type="button"
            className="sv97"
            data-node-id="258:2843"
            data-name="Status tab"
            data-survey-action="All surveys  6"
          >
            <UiText
              className="sv100"
              data-node-id="258:2844"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`All surveys  6`}</UiText>
          </button>
          <button
            type="button"
            className="sv97"
            data-node-id="258:2846"
            data-name="Status tab"
            data-survey-action="Live  2"
          >
            <UiText
              className="sv100"
              data-node-id="258:2847"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`Live  2`}</UiText>
            <div className="sv101" data-node-id="258:2848" data-name="Active indicator" />
          </button>
          <button
            type="button"
            className="sv97"
            data-node-id="258:3032"
            data-name="Status tab"
            data-survey-action="Drafts  2"
          >
            <UiText
              className="sv98"
              data-node-id="258:3033"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`Drafts  2`}</UiText>
            <div className="sv99" data-node-id="258:3034" data-name="Active indicator" />
          </button>
          <button
            type="button"
            className="sv97"
            data-node-id="258:2852"
            data-name="Status tab"
            data-survey-action="Paused  1"
          >
            <UiText
              className="sv100"
              data-node-id="258:2853"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`Paused  1`}</UiText>
            <div className="sv101" data-node-id="258:2854" data-name="Active indicator" />
          </button>
          <button
            type="button"
            className="sv97"
            data-node-id="258:2855"
            data-name="Status tab"
            data-survey-action="Closed  1"
          >
            <UiText
              className="sv100"
              data-node-id="258:2856"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`Closed  1`}</UiText>
            <div className="sv101" data-node-id="258:2857" data-name="Active indicator" />
          </button>
        </div>
        <div className="sv102" data-node-id="258:2858" data-name="Search and filters">
          <div className="sv103" data-node-id="258:2859" data-name="Survey search">
            <div className="sv6" data-node-id="258:2860" data-name="Icon">
              <img alt="" className="sv7" src={imgIcon2} />
            </div>
            <input
              className="survey-search-input"
              aria-label="Search surveys"
              placeholder="Search surveys by name..."
            />
          </div>
          <div className="sv105" data-node-id="258:2863" data-name="Filters">
            <button
              type="button"
              className="sv106"
              data-node-id="258:2864"
              data-name="Action"
              data-survey-action="All 3 branches"
            >
              <div className="sv6" data-node-id="258:2865" data-name="store">
                <ControlIcon name="branch" />
              </div>
              <UiText
                className="sv107"
                data-node-id="258:2867"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                All 3 branches
              </UiText>
            </button>
            <SurveySortButton className="sv106" />
          </div>
        </div>
        <div className="sv108" data-node-id="258:2872" data-name="Table headings">
          <SurveyTableCheck className="sv109" data-node-id="258:2873" data-name="Select all" />
          <UiText
            className="sv110"
            data-node-id="258:2874"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            SURVEY NAME
          </UiText>
          <UiText
            className="sv111"
            data-node-id="258:2875"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            STATUS
          </UiText>
          <UiText
            className="sv112"
            data-node-id="258:2876"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            BRANCHES
          </UiText>
          <UiText
            className="sv113"
            data-node-id="258:2877"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            RESPONSES
          </UiText>
          <UiText
            className="sv114"
            data-node-id="258:2878"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            UPDATED
          </UiText>
          <UiText
            className="sv115"
            data-node-id="258:2879"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            ACTIONS
          </UiText>
        </div>
        <SurveyRow
          surveyName="Seasonal menu feedback"
          initialStatus="Draft"
          className="sv129"
          data-node-id="258:2928"
          data-name="Survey row"
          data-updated="2026-10-07"
        >
          <SurveyTableCheck className="sv109" data-node-id="258:2929" data-name="Select survey" />
          <div className="sv117" data-node-id="258:2930" data-name="Survey information">
            <div className="sv118" data-node-id="258:2931" data-name="Survey symbol">
              <div className="sv60" data-node-id="258:2932" data-name="Icon">
                <img alt="" className="sv7" src={imgIcon3} />
              </div>
            </div>
            <div className="sv119" data-node-id="258:2934" data-name="Survey details">
              <UiText
                className="sv130"
                data-node-id="258:2935"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Seasonal menu feedback
              </UiText>
              <UiText
                className="sv121"
                data-node-id="258:2936"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >{`5 questions · Arabic & English`}</UiText>
            </div>
          </div>
          <div className="sv122" data-node-id="258:2937" data-name="Survey status">
            <div className="sv131" data-node-id="258:2938" data-name="Status">
              <UiText
                className="sv132"
                data-node-id="258:2939"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Draft
              </UiText>
            </div>
          </div>
          <UiText
            className="sv125"
            data-node-id="258:2940"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            All 3 branches
          </UiText>
          <UiText
            className="sv126"
            data-node-id="258:2941"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            —
          </UiText>
          <UiText
            className="sv127"
            data-node-id="258:2942"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            7 Oct, 2026
          </UiText>
          <div className="sv128" data-node-id="258:2943" data-name="Management actions">
            <button
              type="button"
              className="sv133"
              data-node-id="258:2944"
              data-name="Action"
              data-survey-action="Continue editing"
            >
              <UiText
                className="sv107"
                data-node-id="258:2945"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Continue editing
              </UiText>
            </button>
            <SurveyMoreMenu className="sv60" data-node-id="258:2946" data-name="ellipsis">
              <img alt="" className="sv7" src={imgEllipsis} />
            </SurveyMoreMenu>
          </div>
        </SurveyRow>
        <SurveyRow
          surveyName="New branch welcome"
          initialStatus="Draft"
          className="sv129"
          data-node-id="258:2948"
          data-name="Survey row"
          data-updated="2026-10-06"
        >
          <SurveyTableCheck className="sv109" data-node-id="258:2949" data-name="Select survey" />
          <div className="sv117" data-node-id="258:2950" data-name="Survey information">
            <div className="sv118" data-node-id="258:2951" data-name="Survey symbol">
              <div className="sv60" data-node-id="258:2952" data-name="Icon">
                <img alt="" className="sv7" src={imgIcon3} />
              </div>
            </div>
            <div className="sv119" data-node-id="258:2954" data-name="Survey details">
              <UiText
                className="sv130"
                data-node-id="258:2955"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                New branch welcome
              </UiText>
              <UiText
                className="sv121"
                data-node-id="258:2956"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >{`4 questions · Arabic & English`}</UiText>
            </div>
          </div>
          <div className="sv122" data-node-id="258:2957" data-name="Survey status">
            <div className="sv131" data-node-id="258:2958" data-name="Status">
              <UiText
                className="sv132"
                data-node-id="258:2959"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Draft
              </UiText>
            </div>
          </div>
          <UiText
            className="sv125"
            data-node-id="258:2960"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Alex
          </UiText>
          <UiText
            className="sv126"
            data-node-id="258:2961"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            —
          </UiText>
          <UiText
            className="sv127"
            data-node-id="258:2962"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            6 Oct, 2026
          </UiText>
          <div className="sv128" data-node-id="258:2963" data-name="Management actions">
            <button
              type="button"
              className="sv133"
              data-node-id="258:2964"
              data-name="Action"
              data-survey-action="Continue editing"
            >
              <UiText
                className="sv107"
                data-node-id="258:2965"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Continue editing
              </UiText>
            </button>
            <SurveyMoreMenu className="sv60" data-node-id="258:2966" data-name="ellipsis">
              <img alt="" className="sv7" src={imgEllipsis} />
            </SurveyMoreMenu>
          </div>
        </SurveyRow>
      </div>
    </div>
  );
}
