import { SurveyRow, SurveyMoreMenu } from './SurveyRow.jsx';
import React from 'react';
import { asset } from '../../../lib/assets.js';
import ControlIcon from '../../../components/ui/ControlIcon.jsx';
import { UiText, SurveyTableCheck, SurveySortButton } from './SurveyPrimitives.jsx';

const imgPlus = asset('surveys-figma/live-imgPlus.svg');
const imgIcon = asset('surveys-figma/live-imgIcon.svg');
const imgRadio = asset('surveys-figma/live-imgRadio.svg');
const imgIcon1 = asset('surveys-figma/live-imgIcon1.svg');
const imgCircleCheck = asset('surveys-figma/live-imgCircleCheck.svg');
const imgIcon2 = asset('surveys-figma/live-imgIcon2.svg');

const imgIcon3 = asset('surveys-figma/live-imgIcon3.svg');
const imgShare2 = asset('surveys-figma/live-imgShare2.svg');
const imgPencil = asset('surveys-figma/live-imgPencil.svg');
const imgEllipsis = asset('surveys-figma/live-imgEllipsis.svg');
const imgQrCode = asset('surveys-figma/live-imgQrCode.svg');

export default function SurveyContent() {
  return (
    <div className="sv0" data-node-id="258:2194" data-name="Survey content">
      <div className="sv1" data-node-id="258:2195" data-name="Heading and actions">
        <div className="sv71" data-node-id="258:2196" data-name="Page heading">
          <div className="sv81" data-node-id="258:2197" data-name="Title and status">
            <UiText className="sv82" data-node-id="258:2198">
              Manage surveys
            </UiText>
          </div>
          <UiText
            className="sv83"
            data-node-id="258:2199"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Create, manage and share feedback across your branches.
          </UiText>
        </div>
        <div className="sv84" data-node-id="258:2200" data-name="Page actions">
          <button
            type="button"
            className="sv85"
            data-node-id="258:2201"
            data-name="Action"
            data-survey-action="Export"
          >
            <div className="sv6" data-node-id="258:2202" data-name="download">
              <ControlIcon name="export" />
            </div>
            <UiText
              className="sv86"
              data-node-id="258:2204"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Export
            </UiText>
          </button>
          <button
            type="button"
            className="sv87"
            data-node-id="258:2205"
            data-name="Action"
            data-survey-action="Create survey"
          >
            <div className="sv6" data-node-id="258:2206" data-name="plus">
              <img alt="" className="sv7" src={imgPlus} />
            </div>
            <UiText
              className="sv88"
              data-node-id="258:2208"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Create survey
            </UiText>
          </button>
        </div>
      </div>
      <div className="sv70" data-node-id="258:2209" data-name="Survey overview">
        <div className="sv89" data-node-id="258:2210" data-name="Survey metric">
          <div className="sv1" data-node-id="258:2211" data-name="Metric heading">
            <UiText
              className="sv90"
              data-node-id="258:2212"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Total surveys
            </UiText>
            <div className="sv91" data-node-id="258:2213" data-name="Icon">
              <img alt="" className="sv7" src={imgIcon} />
            </div>
          </div>
          <div className="sv92" data-node-id="258:2215" data-name="Metric value and context">
            <UiText
              className="sv93"
              data-node-id="258:2216"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              6
            </UiText>
            <UiText
              className="sv94"
              data-node-id="258:2217"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Across 3 branches
            </UiText>
          </div>
        </div>
        <div className="sv89" data-node-id="258:2218" data-name="Survey metric">
          <div className="sv1" data-node-id="258:2219" data-name="Metric heading">
            <UiText
              className="sv90"
              data-node-id="258:2220"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Live surveys
            </UiText>
            <div className="sv91" data-node-id="258:2221" data-name="radio">
              <img alt="" className="sv7" src={imgRadio} />
            </div>
          </div>
          <div className="sv92" data-node-id="258:2223" data-name="Metric value and context">
            <UiText
              className="sv93"
              data-node-id="258:2224"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              2
            </UiText>
            <UiText
              className="sv94"
              data-node-id="258:2225"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Collecting feedback
            </UiText>
          </div>
        </div>
        <div className="sv89" data-node-id="258:2226" data-name="Survey metric">
          <div className="sv1" data-node-id="258:2227" data-name="Metric heading">
            <UiText
              className="sv90"
              data-node-id="258:2228"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Responses this month
            </UiText>
            <div className="sv91" data-node-id="258:2229" data-name="Icon">
              <img alt="" className="sv7" src={imgIcon1} />
            </div>
          </div>
          <div className="sv92" data-node-id="258:2231" data-name="Metric value and context">
            <UiText
              className="sv93"
              data-node-id="258:2232"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              1,248
            </UiText>
            <UiText
              className="sv94"
              data-node-id="258:2233"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              ↑ 18.2%
            </UiText>
          </div>
        </div>
        <div className="sv89" data-node-id="258:2234" data-name="Survey metric">
          <div className="sv1" data-node-id="258:2235" data-name="Metric heading">
            <UiText
              className="sv90"
              data-node-id="258:2236"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Completion rate
            </UiText>
            <div className="sv91" data-node-id="258:2237" data-name="circle-check">
              <img alt="" className="sv7" src={imgCircleCheck} />
            </div>
          </div>
          <div className="sv92" data-node-id="258:2239" data-name="Metric value and context">
            <UiText
              className="sv93"
              data-node-id="258:2240"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              86%
            </UiText>
            <UiText
              className="sv94"
              data-node-id="258:2241"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              ↑ 4 pts this month
            </UiText>
          </div>
        </div>
      </div>
      <div className="sv95" data-node-id="258:2242" data-name="Survey management">
        <div className="sv96" data-node-id="258:2243" data-name="Status filters">
          <button
            type="button"
            className="sv97"
            data-node-id="258:2244"
            data-name="Status tab"
            data-survey-action="All surveys  6"
          >
            <UiText
              className="sv100"
              data-node-id="258:2245"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`All surveys  6`}</UiText>
          </button>
          <button
            type="button"
            className="sv97"
            data-node-id="258:2432"
            data-name="Status tab"
            data-survey-action="Live  2"
          >
            <UiText
              className="sv98"
              data-node-id="258:2433"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`Live  2`}</UiText>
            <div className="sv99" data-node-id="258:2434" data-name="Active indicator" />
          </button>
          <button
            type="button"
            className="sv97"
            data-node-id="258:2250"
            data-name="Status tab"
            data-survey-action="Drafts  2"
          >
            <UiText
              className="sv100"
              data-node-id="258:2251"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`Drafts  2`}</UiText>
            <div className="sv101" data-node-id="258:2252" data-name="Active indicator" />
          </button>
          <button
            type="button"
            className="sv97"
            data-node-id="258:2253"
            data-name="Status tab"
            data-survey-action="Paused  1"
          >
            <UiText
              className="sv100"
              data-node-id="258:2254"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`Paused  1`}</UiText>
            <div className="sv101" data-node-id="258:2255" data-name="Active indicator" />
          </button>
          <button
            type="button"
            className="sv97"
            data-node-id="258:2256"
            data-name="Status tab"
            data-survey-action="Closed  1"
          >
            <UiText
              className="sv100"
              data-node-id="258:2257"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`Closed  1`}</UiText>
            <div className="sv101" data-node-id="258:2258" data-name="Active indicator" />
          </button>
        </div>
        <div className="sv102" data-node-id="258:2259" data-name="Search and filters">
          <div className="sv103" data-node-id="258:2260" data-name="Survey search">
            <div className="sv6" data-node-id="258:2261" data-name="Icon">
              <img alt="" className="sv7" src={imgIcon2} />
            </div>
            <input
              className="survey-search-input"
              aria-label="Search surveys"
              placeholder="Search surveys by name..."
            />
          </div>
          <div className="sv105" data-node-id="258:2264" data-name="Filters">
            <button
              type="button"
              className="sv106"
              data-node-id="258:2265"
              data-name="Action"
              data-survey-action="All 3 branches"
            >
              <div className="sv6" data-node-id="258:2266" data-name="store">
                <ControlIcon name="branch" />
              </div>
              <UiText
                className="sv107"
                data-node-id="258:2268"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                All 3 branches
              </UiText>
            </button>
            <SurveySortButton className="sv106" />
          </div>
        </div>
        <div className="sv108" data-node-id="258:2273" data-name="Table headings">
          <SurveyTableCheck className="sv109" data-node-id="258:2274" data-name="Select all" />
          <UiText
            className="sv110"
            data-node-id="258:2275"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            SURVEY NAME
          </UiText>
          <UiText
            className="sv111"
            data-node-id="258:2276"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            STATUS
          </UiText>
          <UiText
            className="sv112"
            data-node-id="258:2277"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            BRANCHES
          </UiText>
          <UiText
            className="sv113"
            data-node-id="258:2278"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            RESPONSES
          </UiText>
          <UiText
            className="sv114"
            data-node-id="258:2279"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            UPDATED
          </UiText>
          <UiText
            className="sv115"
            data-node-id="258:2280"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            ACTIONS
          </UiText>
        </div>
        <SurveyRow
          surveyName="Customer experience survey"
          initialStatus="Live"
          className="sv116"
          data-node-id="258:2281"
          data-name="Survey row"
          data-updated="today"
        >
          <SurveyTableCheck className="sv109" data-node-id="258:2282" data-name="Select survey" />
          <div className="sv117" data-node-id="258:2283" data-name="Survey information">
            <div className="sv118" data-node-id="258:2284" data-name="Survey symbol">
              <div className="sv60" data-node-id="258:2285" data-name="Icon">
                <img alt="" className="sv7" src={imgIcon3} />
              </div>
            </div>
            <div className="sv119" data-node-id="258:2287" data-name="Survey details">
              <UiText
                className="sv130"
                data-node-id="258:2288"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Customer experience survey
              </UiText>
              <UiText
                className="sv121"
                data-node-id="258:2289"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >{`6 questions · Arabic & English`}</UiText>
            </div>
          </div>
          <div className="sv122" data-node-id="258:2290" data-name="Survey status">
            <div className="sv123" data-node-id="258:2291" data-name="Status">
              <UiText
                className="sv124"
                data-node-id="258:2292"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Live
              </UiText>
            </div>
          </div>
          <UiText
            className="sv125"
            data-node-id="258:2293"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            All 3 branches
          </UiText>
          <UiText
            className="sv126"
            data-node-id="258:2294"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            1,248
          </UiText>
          <UiText
            className="sv127"
            data-node-id="258:2295"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Today, 10:42
          </UiText>
          <div className="sv128" data-node-id="258:2296" data-name="Management actions">
            <button
              type="button"
              className="sv106"
              data-node-id="258:2297"
              data-name="Action"
              data-survey-action="Share"
            >
              <div className="sv6" data-node-id="258:2298" data-name="share-2">
                <img alt="" className="sv7" src={imgShare2} />
              </div>
              <UiText
                className="sv107"
                data-node-id="258:2300"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Share
              </UiText>
            </button>
            <button
              type="button"
              className="sv6"
              data-node-id="258:2301"
              data-name="pencil"
              data-survey-action="Edit survey"
              aria-label="Edit survey"
            >
              <img alt="" className="sv7" src={imgPencil} />
            </button>
            <SurveyMoreMenu className="sv60" data-node-id="258:2303" data-name="ellipsis">
              <img alt="" className="sv7" src={imgEllipsis} />
            </SurveyMoreMenu>
          </div>
        </SurveyRow>
        <SurveyRow
          surveyName="Quick satisfaction check"
          initialStatus="Live"
          className="sv129"
          data-node-id="258:2305"
          data-name="Survey row"
          data-updated="2026-10-08"
        >
          <SurveyTableCheck className="sv109" data-node-id="258:2306" data-name="Select survey" />
          <div className="sv117" data-node-id="258:2307" data-name="Survey information">
            <div className="sv118" data-node-id="258:2308" data-name="Survey symbol">
              <div className="sv60" data-node-id="258:2309" data-name="Icon">
                <img alt="" className="sv7" src={imgIcon3} />
              </div>
            </div>
            <div className="sv119" data-node-id="258:2311" data-name="Survey details">
              <UiText
                className="sv130"
                data-node-id="258:2312"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Quick satisfaction check
              </UiText>
              <UiText
                className="sv121"
                data-node-id="258:2313"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >{`3 questions · Arabic & English`}</UiText>
            </div>
          </div>
          <div className="sv122" data-node-id="258:2314" data-name="Survey status">
            <div className="sv123" data-node-id="258:2315" data-name="Status">
              <UiText
                className="sv124"
                data-node-id="258:2316"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Live
              </UiText>
            </div>
          </div>
          <UiText
            className="sv125"
            data-node-id="258:2317"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Cairo
          </UiText>
          <UiText
            className="sv126"
            data-node-id="258:2318"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            326
          </UiText>
          <UiText
            className="sv127"
            data-node-id="258:2319"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            8 Oct, 2026
          </UiText>
          <div className="sv128" data-node-id="258:2320" data-name="Management actions">
            <button
              type="button"
              className="sv106"
              data-node-id="258:2321"
              data-name="Action"
              data-survey-action="Share"
            >
              <div className="sv6" data-node-id="258:2322" data-name="share-2">
                <img alt="" className="sv7" src={imgShare2} />
              </div>
              <UiText
                className="sv107"
                data-node-id="258:2324"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Share
              </UiText>
            </button>
            <button
              type="button"
              className="sv6"
              data-node-id="258:2325"
              data-name="pencil"
              data-survey-action="Edit survey"
              aria-label="Edit survey"
            >
              <img alt="" className="sv7" src={imgPencil} />
            </button>
            <SurveyMoreMenu className="sv60" data-node-id="258:2327" data-name="ellipsis">
              <img alt="" className="sv7" src={imgEllipsis} />
            </SurveyMoreMenu>
          </div>
        </SurveyRow>
      </div>
      <div className="sv140" data-node-id="258:2424" data-name="Collection tip">
        <div className="sv141" data-node-id="258:2425" data-name="Tip symbol">
          <div className="sv142" data-node-id="258:2426" data-name="qr-code">
            <img alt="" className="sv7" src={imgQrCode} />
          </div>
        </div>
        <div className="sv143" data-node-id="258:2428" data-name="Tip">
          <UiText
            className="sv144"
            data-node-id="258:2429"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Bring feedback to every table
          </UiText>
          <UiText
            className="sv18"
            data-node-id="258:2430"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Share a branch-specific QR code to see exactly where each response comes from.
          </UiText>
        </div>
        <UiText
          className="sv139"
          data-node-id="258:2431"
          style={{ fontVariationSettings: '"opsz" 14' }}
        >
          Share your live survey →
        </UiText>
      </div>
    </div>
  );
}
