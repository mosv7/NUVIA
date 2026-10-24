import React from 'react';
import { asset } from '../../../lib/assets.js';
import ControlIcon from '../../../components/ui/ControlIcon.jsx';
import { UiText, SurveyTableCheck, SurveySortButton } from './SurveyPrimitives.jsx';
const imgPlus = asset('surveys-figma/empty-imgPlus.svg');
const imgIcon = asset('surveys-figma/empty-imgIcon.svg');
const imgRadio = asset('surveys-figma/empty-imgRadio.svg');
const imgIcon1 = asset('surveys-figma/empty-imgIcon1.svg');
const imgCircleCheck = asset('surveys-figma/empty-imgCircleCheck.svg');
const imgIcon2 = asset('surveys-figma/empty-imgIcon2.svg');

const imgIcon3 = asset('surveys-figma/empty-imgIcon3.svg');
const imgQrCode = asset('surveys-figma/empty-imgQrCode.svg');

export default function SurveyContent() {
  return (
    <div className="sv0" data-node-id="266:13400" data-name="Survey content">
      <div className="sv1" data-node-id="266:13401" data-name="Heading and actions">
        <div className="sv71" data-node-id="266:13402" data-name="Page heading">
          <div className="sv81" data-node-id="266:13403" data-name="Title and status">
            <UiText className="sv82" data-node-id="266:13404">
              Manage surveys
            </UiText>
          </div>
          <UiText
            className="sv83"
            data-node-id="266:13405"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Create, manage and share feedback across your branches.
          </UiText>
        </div>
        <div className="sv151" data-node-id="266:13406" data-name="Page actions">
          <button
            type="button"
            className="sv87"
            data-node-id="266:13411"
            data-name="Action"
            data-survey-action="Create survey"
          >
            <div className="sv6" data-node-id="266:13412" data-name="plus">
              <img alt="" className="sv7" src={imgPlus} />
            </div>
            <UiText
              className="sv88"
              data-node-id="266:13414"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Create survey
            </UiText>
          </button>
        </div>
      </div>
      <div className="sv70" data-node-id="266:13415" data-name="Survey overview">
        <div className="sv89" data-node-id="266:13416" data-name="Survey metric">
          <div className="sv1" data-node-id="266:13417" data-name="Metric heading">
            <UiText
              className="sv90"
              data-node-id="266:13418"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Total surveys
            </UiText>
            <div className="sv91" data-node-id="266:13419" data-name="Icon">
              <img alt="" className="sv7" src={imgIcon} />
            </div>
          </div>
          <div className="sv92" data-node-id="266:13421" data-name="Metric value and context">
            <UiText
              className="sv93"
              data-node-id="266:13422"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              0
            </UiText>
            <UiText
              className="sv94"
              data-node-id="266:13423"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Across 3 branches
            </UiText>
          </div>
        </div>
        <div className="sv89" data-node-id="266:13424" data-name="Survey metric">
          <div className="sv1" data-node-id="266:13425" data-name="Metric heading">
            <UiText
              className="sv90"
              data-node-id="266:13426"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Live surveys
            </UiText>
            <div className="sv91" data-node-id="266:13427" data-name="radio">
              <img alt="" className="sv7" src={imgRadio} />
            </div>
          </div>
          <div className="sv92" data-node-id="266:13429" data-name="Metric value and context">
            <UiText
              className="sv93"
              data-node-id="266:13430"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              0
            </UiText>
            <UiText
              className="sv94"
              data-node-id="266:13431"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Collecting feedback
            </UiText>
          </div>
        </div>
        <div className="sv89" data-node-id="266:13432" data-name="Survey metric">
          <div className="sv1" data-node-id="266:13433" data-name="Metric heading">
            <UiText
              className="sv90"
              data-node-id="266:13434"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Responses this month
            </UiText>
            <div className="sv91" data-node-id="266:13435" data-name="Icon">
              <img alt="" className="sv7" src={imgIcon1} />
            </div>
          </div>
          <div className="sv279" data-node-id="266:13437" data-name="Metric value and context">
            <UiText
              className="sv280"
              data-node-id="266:13438"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              0
            </UiText>
          </div>
        </div>
        <div className="sv89" data-node-id="266:13440" data-name="Survey metric">
          <div className="sv1" data-node-id="266:13441" data-name="Metric heading">
            <UiText
              className="sv90"
              data-node-id="266:13442"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Completion rate
            </UiText>
            <div className="sv91" data-node-id="266:13443" data-name="circle-check">
              <img alt="" className="sv7" src={imgCircleCheck} />
            </div>
          </div>
          <div className="sv92" data-node-id="266:13445" data-name="Metric value and context">
            <UiText
              className="sv93"
              data-node-id="266:13446"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              0%
            </UiText>
            <UiText
              className="sv94"
              data-node-id="266:13447"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{` this month`}</UiText>
          </div>
        </div>
      </div>
      <div className="sv281" data-node-id="266:13448" data-name="Survey management">
        <div className="sv282" data-node-id="266:13666">
          <div className="sv96" data-node-id="266:13449" data-name="Status filters">
            <button
              type="button"
              className="sv97"
              data-node-id="266:13450"
              data-name="Status tab"
              data-survey-action="All surveys"
            >
              <UiText
                className="sv98"
                data-node-id="266:13451"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >{`All surveys  `}</UiText>
              <div className="sv99" data-node-id="266:13452" data-name="Active indicator" />
            </button>
            <button
              type="button"
              className="sv97"
              data-node-id="266:13453"
              data-name="Status tab"
              data-survey-action="Live"
            >
              <UiText
                className="sv100"
                data-node-id="266:13454"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >{`Live  `}</UiText>
              <div className="sv101" data-node-id="266:13455" data-name="Active indicator" />
            </button>
            <button
              type="button"
              className="sv97"
              data-node-id="266:13456"
              data-name="Status tab"
              data-survey-action="Drafts"
            >
              <UiText
                className="sv100"
                data-node-id="266:13457"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >{`Drafts  `}</UiText>
              <div className="sv101" data-node-id="266:13458" data-name="Active indicator" />
            </button>
            <button
              type="button"
              className="sv97"
              data-node-id="266:13459"
              data-name="Status tab"
              data-survey-action="Paused"
            >
              <UiText
                className="sv100"
                data-node-id="266:13460"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >{`Paused  `}</UiText>
              <div className="sv101" data-node-id="266:13461" data-name="Active indicator" />
            </button>
            <button
              type="button"
              className="sv97"
              data-node-id="266:13462"
              data-name="Status tab"
              data-survey-action="Closed"
            >
              <UiText
                className="sv100"
                data-node-id="266:13463"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >{`Closed  `}</UiText>
              <div className="sv101" data-node-id="266:13464" data-name="Active indicator" />
            </button>
          </div>
          <div className="sv102" data-node-id="266:13465" data-name="Search and filters">
            <div className="sv103" data-node-id="266:13466" data-name="Survey search">
              <div className="sv6" data-node-id="266:13467" data-name="Icon">
                <img alt="" className="sv7" src={imgIcon2} />
              </div>
              <input
                className="survey-search-input"
                aria-label="Search surveys"
                placeholder="Search surveys by name..."
              />
            </div>
            <div className="sv105" data-node-id="266:13470" data-name="Filters">
              <button
                type="button"
                className="sv106"
                data-node-id="266:13471"
                data-name="Action"
                data-survey-action="All 3 branches"
              >
                <div className="sv6" data-node-id="266:13472" data-name="store">
                  <ControlIcon name="branch" />
                </div>
                <UiText
                  className="sv107"
                  data-node-id="266:13474"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  All 3 branches
                </UiText>
              </button>
              <SurveySortButton className="sv106" />
            </div>
          </div>
          <div className="sv108" data-node-id="266:13479" data-name="Table headings">
            <SurveyTableCheck className="sv109" data-node-id="266:13480" data-name="Select all" />
            <UiText
              className="sv110"
              data-node-id="266:13481"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              SURVEY NAME
            </UiText>
            <UiText
              className="sv111"
              data-node-id="266:13482"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              STATUS
            </UiText>
            <UiText
              className="sv112"
              data-node-id="266:13483"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              BRANCHES
            </UiText>
            <UiText
              className="sv113"
              data-node-id="266:13484"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              RESPONSES
            </UiText>
            <UiText
              className="sv114"
              data-node-id="266:13485"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              UPDATED
            </UiText>
            <UiText
              className="sv115"
              data-node-id="266:13486"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              ACTIONS
            </UiText>
          </div>
        </div>
        <div className="sv283" data-node-id="266:13665">
          <div className="sv284" data-node-id="266:13653" data-name="State symbol">
            <div className="sv285" data-node-id="266:13654" data-name="messages-square">
              <div className="sv286" data-node-id="266:13657" data-name="Icon">
                <img alt="" className="sv7" src={imgIcon3} />
              </div>
            </div>
          </div>
          <div className="sv287" data-node-id="266:13638" data-name="State explanation">
            <UiText
              className="sv288"
              data-node-id="266:13639"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              No surveys yet
            </UiText>
            <UiText
              className="sv289"
              data-node-id="266:13640"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Create your first survey to start collecting feedback, or start from a ready-made
              template.
            </UiText>
          </div>
          <div className="sv105" data-node-id="266:13641" data-name="Recovery actions">
            <button
              type="button"
              className="sv290"
              data-node-id="266:13660"
              data-name="Action"
              data-survey-action="Create survey"
            >
              <div className="sv6" data-node-id="266:13661" data-name="plus">
                <img alt="" className="sv7" src={imgPlus} />
              </div>
              <UiText
                className="sv88"
                data-node-id="266:13663"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Create survey
              </UiText>
            </button>
            <button
              type="button"
              className="sv152"
              data-node-id="266:13646"
              data-name="Action"
              data-survey-action="Browser templates"
            >
              <UiText
                className="sv86"
                data-node-id="266:13647"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Browser templates
              </UiText>
            </button>
          </div>
        </div>
      </div>
      <div className="sv140" data-node-id="266:13630" data-name="Collection tip">
        <div className="sv141" data-node-id="266:13631" data-name="Tip symbol">
          <div className="sv142" data-node-id="266:13632" data-name="qr-code">
            <img alt="" className="sv7" src={imgQrCode} />
          </div>
        </div>
        <div className="sv143" data-node-id="266:13634" data-name="Tip">
          <UiText
            className="sv144"
            data-node-id="266:13635"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Bring feedback to every table
          </UiText>
          <UiText
            className="sv18"
            data-node-id="266:13636"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Share a branch-specific QR code to see exactly where each response comes from.
          </UiText>
        </div>
      </div>
    </div>
  );
}
