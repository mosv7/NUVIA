import OverviewEmpty from '../OverviewEmpty.jsx';
import { ScopeMetric, ScopeTrend, ScopeSentiment, OverviewScopeStatus } from '../OverviewScope.jsx';
import '../overview-scope.css';
import { LanguageMenu } from '../../components/ChoiceMenu.jsx';
import {
  NewDailyInsight,
  MovedAspectScore,
  NewRecommendations,
  NewQuickActions,
} from './OverviewAdditions.jsx';
import React from 'react';
import { asset } from '../../assets.js';
import { useProductView } from '../ProductContext.jsx';
import './overview.css';
import { OverviewBranchSelect, overviewDateLabel } from '../OverviewControls.jsx';

function DashboardArrowText({ text }) {
  return (
    <span className="dashboard-arrow-label">
      {text.split(/([→←↑↓↗↖])/).map((part, index) => {
        const rotations = { '→': 0, '←': 180, '↑': -90, '↓': 90, '↗': -45, '↖': -135 };
        if (!(part in rotations)) return part;
        return (
          <svg
            key={index}
            className="dashboard-link-arrow"
            aria-hidden="true"
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            style={{ transform: 'rotate(' + rotations[part] + 'deg)' }}
          >
            <path
              d="M3.5 8h8M8 4.5 11.5 8 8 11.5"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      })}
    </span>
  );
}

const imgLogo = asset('dashboard/overview/logo.svg');
const imgChevronsUpDown = asset('dashboard/overview/chevrons-up-down.svg');
const imgLayoutDashboard = asset('dashboard/overview/layout-dashboard.svg');
const imgMessageSquare = asset('dashboard/overview/message-square.svg');
const imgChartNoAxesCombined = asset('dashboard/overview/chart-no-axes-combined.svg');
const imgFileChartColumn = asset('dashboard/overview/file-chart-column.svg');
const imgClipboardList = asset('dashboard/overview/clipboard-list.svg');
const imgUsers = asset('dashboard/overview/users.svg');
const imgSparkles = asset('dashboard/overview/sparkles.svg');
const imgCreditCard = asset('dashboard/overview/credit-card.svg');
const imgSettings = asset('dashboard/overview/settings.svg');
const imgCircleHelp = asset('dashboard/overview/circle-help.svg');
const imgSearch = asset('dashboard/overview/search.svg');
const imgGlobe = asset('dashboard/overview/globe.svg');
const imgChevronDown = asset('dashboard/overview/chevron-down.svg');
const imgNotifications = asset('dashboard/overview/notifications.svg');
const imgStore = asset('dashboard/overview/store.svg');
const imgChevronDown1 = asset('dashboard/overview/chevron-down1.svg');
const imgCalendarDays = asset('dashboard/overview/calendar-days.svg');
const imgDownload = asset('dashboard/overview/download-export.svg');
const imgPlus = asset('dashboard/overview/plus.svg');
const imgMessageSquare1 = asset('dashboard/overview/message-square1.svg');
const imgSmile = asset('dashboard/overview/smile-metric.svg');
const imgStar = asset('dashboard/overview/star-metric.svg');
const imgCircleCheck = asset('dashboard/overview/circle-check-metric.svg');
const imgLegendMark = asset('dashboard/overview/legend-mark.svg');
const imgLegendMark1 = asset('dashboard/overview/legend-mark1.svg');
const imgSentimentPoint = asset('dashboard/overview/sentiment-point.svg');
const imgSentimentTrend = asset('dashboard/overview/sentiment-trend.svg');
const imgNegativeArc = asset('dashboard/overview/negative-arc.svg');
const imgNeutralArc = asset('dashboard/overview/neutral-arc.svg');
const imgPositiveArc = asset('dashboard/overview/positive-arc.svg');
const imgLegendMark2 = asset('dashboard/overview/legend-mark2.svg');
const imgLegendMark3 = asset('dashboard/overview/legend-mark3.svg');

export default function OverviewDesign({ empty = false }) {
  const ui = useProductView();
  const tr = ui.tr;
  return (
    <div
      className="f0 product-view ds-overview"
      data-first-time={empty}
      data-node-id="127:256"
      data-name="dashboard overview"
    >
      <div
        className="f1 product-navigation"
        data-node-id="127:257"
        data-name="Product navigation"
        role="navigation"
        inert={ui.isMobile && !ui.menuOpen}
        aria-hidden={ui.isMobile && !ui.menuOpen}
      >
        <div className="f2" data-node-id="127:258" data-name="NUVIA home">
          <div className="f3" data-node-id="127:259" data-name="Brand mark">
            <div className="f4" data-node-id="127:260" data-name="Logo">
              <img alt="" className="f5" src={imgLogo} />
            </div>
          </div>
          <p className="f6" data-node-id="127:264">
            {tr('NUVIA')}
          </p>
        </div>
        <button
          className="f7"
          data-node-id="127:265"
          data-name="Business switcher"
          type="button"
          onClick={() => ui.action('B Bloom & Co. Cafe &workspace')}
        >
          <div className="f8" data-node-id="127:266" data-name="Business avatar">
            <p className="f9" data-node-id="127:267">
              {tr('B')}
            </p>
          </div>
          <div className="f10" data-node-id="127:268" data-name="Business">
            <p
              className="f11"
              data-node-id="127:269"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Bloom & Co.')}
            </p>
            <p
              className="f12"
              data-node-id="127:270"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Cafe &workspace')}
            </p>
          </div>
          <div className="f13" data-node-id="127:271" data-name="chevrons-up-down">
            <img alt="" className="f5" src={imgChevronsUpDown} />
          </div>
        </button>
        <div className="f14" data-node-id="127:273" data-name="Workspace destinations">
          <p
            className="f15"
            data-node-id="127:274"
            style={{
              fontVariationSettings: '"opsz" 14',
            }}
          >
            {tr('WORKSPACE')}
          </p>
          <button
            className="f16"
            data-node-id="127:275"
            data-name="Navigation item"
            aria-current="page"
            type="button"
            onClick={() => ui.action('Overview')}
          >
            <div className="f17" data-node-id="127:276" data-name="layout-dashboard">
              <img
                alt=""
                className="f5"
                src={
                  ui.activeDestination === 'Feedbacks'
                    ? asset('dashboard/overview/layout-dashboard-inactive.svg')
                    : imgLayoutDashboard
                }
              />
            </div>
            <p
              className="f18"
              data-node-id="127:278"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Overview')}
            </p>
          </button>
          <button
            className="f19"
            data-node-id="127:279"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Feedbacks 12')}
          >
            <div className="f17" data-node-id="127:280" data-name="message-square">
              <img
                alt=""
                className="f5"
                src={
                  ui.activeDestination === 'Feedbacks'
                    ? asset('dashboard/overview/message-square-active.svg')
                    : imgMessageSquare
                }
              />
            </div>
            <p
              className="f20"
              data-node-id="127:282"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Feedbacks')}
            </p>
            <div className="f21" data-node-id="127:283" data-name="Unread count">
              <p
                className="f22"
                data-node-id="127:284"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('12')}
              </p>
            </div>
          </button>
          <button
            className="f19"
            data-node-id="127:285"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Analytics')}
          >
            <div
              className="f17"
              data-node-id="127:286"
              data-name="chart-no-axes-combined"
              dir="ltr"
            >
              <img alt="" className="f5" src={imgChartNoAxesCombined} />
            </div>
            <p
              className="f20"
              data-node-id="127:288"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Analytics')}
            </p>
          </button>
          <button
            className="f19"
            data-node-id="127:289"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Reports')}
          >
            <div className="f17" data-node-id="127:290" data-name="file-chart-column" dir="ltr">
              <img alt="" className="f5" src={imgFileChartColumn} />
            </div>
            <p
              className="f20"
              data-node-id="127:292"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Reports')}
            </p>
          </button>
          <button
            className="f19"
            data-node-id="127:293"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Surveys')}
          >
            <div className="f17" data-node-id="127:294" data-name="clipboard-list">
              <img alt="" className="f5" src={imgClipboardList} />
            </div>
            <p
              className="f20"
              data-node-id="127:296"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Surveys')}
            </p>
          </button>
          <button
            className="f19"
            data-node-id="127:297"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Segments')}
          >
            <div className="f17" data-node-id="127:298" data-name="users">
              <img alt="" className="f5" src={imgUsers} />
            </div>
            <p
              className="f20"
              data-node-id="127:300"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Business & Teams')}
            </p>
          </button>
          <div className="f23" data-node-id="127:301" data-name="Divider" />
          <button
            className="f19"
            data-node-id="127:302"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('NUVIA Assistant')}
          >
            <div className="f17" data-node-id="127:303" data-name="sparkles">
              <img alt="" className="f5" src={imgSparkles} />
            </div>
            <p
              className="f20"
              data-node-id="127:305"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('NUVIA Assistant')}
            </p>
          </button>
        </div>
        <div className="f24" data-node-id="127:306" data-name="Flexible space" />
        <div className="f25" data-node-id="127:307" data-name="Account destinations">
          <button
            className="f19"
            data-node-id="127:308"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Subscription')}
          >
            <div className="f17" data-node-id="127:309" data-name="credit-card">
              <img alt="" className="f5" src={imgCreditCard} />
            </div>
            <p
              className="f20"
              data-node-id="127:311"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Subscription')}
            </p>
          </button>
          <button
            className="f19"
            data-node-id="127:312"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Settings')}
          >
            <div className="f17" data-node-id="127:313" data-name="settings">
              <img alt="" className="f5" src={imgSettings} />
            </div>
            <p
              className="f20"
              data-node-id="127:315"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Settings')}
            </p>
          </button>
        </div>
        {ui.preview && (
          <div className="f26" data-node-id="127:316" data-name="Plan usage">
            <div className="f27" data-node-id="127:317" data-name="Plan">
              <p
                className="f28"
                data-node-id="127:318"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('Growth plan')}
              </p>
              <p
                className="f29"
                data-node-id="127:319"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('Active')}
              </p>
            </div>
            <p
              className="f30"
              data-node-id="127:320"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('1,248 / 5,000 responses')}
            </p>
            <div className="f31" data-node-id="127:321" data-name="Usage track">
              <div className="f32" data-node-id="127:322" data-name="Usage progress" />
            </div>
            <button
              className="f33"
              data-node-id="127:323"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
              type="button"
              onClick={() => ui.action('Manage subscription →')}
            >
              {<DashboardArrowText text={tr('Manage subscription →')} />}
            </button>
          </div>
        )}
        <button
          className="f34"
          data-node-id="127:324"
          data-name="Help"
          type="button"
          onClick={() => ui.action('Help center')}
        >
          <div className="f35" data-node-id="127:325" data-name="circle-help">
            <img alt="" className="f5" src={imgCircleHelp} />
          </div>
          <p
            className="f36"
            data-node-id="127:327"
            style={{
              fontVariationSettings: '"opsz" 14',
            }}
          >
            {tr('Help center')}
          </p>
        </button>
      </div>
      <div
        className="f37 product-workspace"
        data-node-id="127:328"
        data-name="Workspace"
        inert={ui.isMobile && ui.menuOpen}
      >
        <div className="f38 product-topbar" data-node-id="127:329" data-name="Workspace header">
          <div className="f39" data-node-id="127:330" data-name="Breadcrumb">
            <p
              className="f40"
              data-node-id="127:331"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Bloom & Co.')}
            </p>
            <p className="f41" data-node-id="127:332">
              {tr('/')}
            </p>
            <p
              className="f42"
              data-node-id="127:333"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Overview')}
            </p>
          </div>
          <div className="f43" data-node-id="127:334" data-name="Header actions">
            <div className="f44" data-node-id="127:335" data-name="Search">
              <div className="f35" data-node-id="127:336" data-name="search">
                <img alt="" className="f5" src={imgSearch} />
              </div>
              <input
                className="f45"
                data-node-id="127:338"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
                aria-label={tr('Search your workspace')}
                placeholder={tr('Search your workspace')}
                value={ui.query}
                onChange={(event) => ui.setQuery(event.target.value)}
              />
              <p
                className="f46"
                data-node-id="127:339"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('⌘ K')}
              </p>
            </div>
            <div className="f47" data-node-id="127:340" data-name="Language">
              <div className="f35" data-node-id="127:341" data-name="globe">
                <img alt="" className="f5" src={imgGlobe} />
              </div>
              <LanguageMenu value={ui.language} onChange={ui.setLanguage} />
              <div className="f48" data-node-id="127:344" data-name="chevron-down">
                <img alt="" className="f5" src={imgChevronDown} />
              </div>
            </div>
            <div className="f49" data-node-id="127:346" data-name="Notifications">
              <img alt="" className="f5" src={imgNotifications} />
            </div>
            <div className="f50" data-node-id="127:350" data-name="Divider" />
            <button
              className="f51"
              data-node-id="127:351"
              data-name="Profile"
              type="button"
              onClick={() => ui.action('SA Sara Ahmed Workspace owner')}
            >
              <div className="f52" data-node-id="127:352" data-name="Avatar">
                <img
                  className="account-avatar-image"
                  src={asset('dashboard/overview/account-avatar.svg')}
                  alt=""
                />
              </div>
              <div className="f54" data-node-id="127:354" data-name="Account">
                <p
                  className="f55"
                  data-node-id="127:355"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Sara Ahmed')}
                </p>
                <p
                  className="f12"
                  data-node-id="127:356"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Workspace owner')}
                </p>
              </div>
              <div className="f48" data-node-id="127:357" data-name="chevron-down">
                <img alt="" className="f5" src={imgChevronDown} />
              </div>
            </button>
          </div>
        </div>
        <div className="f56" data-node-id="127:359" data-name="Overview content">
          <div className="f57" data-node-id="127:360" data-name="Overview and key metrics">
            <div className="f58" data-node-id="127:361" data-name="Overview introduction">
              <div className="f59" data-node-id="127:362" data-name="Welcome">
                <p className="f60" data-node-id="127:363">
                  {tr('Overview')}
                </p>
                <p
                  className="f61"
                  data-node-id="127:364"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Welcome back, Sara. Here’s what your customers are telling you.')}
                </p>
              </div>
              <div className="f51" data-node-id="127:365" data-name="Overview actions">
                <div className="f62" data-node-id="127:366" data-name="Dashboard filter">
                  <div className="f35" data-node-id="127:367" data-name="store">
                    <img alt="" className="f5" src={imgStore} />
                  </div>
                  <p
                    className="f63"
                    data-node-id="127:369"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr(
                      ui.dashboard.filters.branch === 'all'
                        ? 'All 3 branches'
                        : ui.dashboard.filters.branch,
                    )}
                  </p>
                  <OverviewBranchSelect />
                  <div className="f13" data-node-id="127:370" data-name="chevron-down">
                    <img alt="" className="f5" src={imgChevronDown1} />
                  </div>
                </div>
                <button
                  className="f64"
                  data-node-id="127:372"
                  data-name="Action"
                  type="button"
                  onClick={ui.dashboard.openDate}
                >
                  <div className="f35" data-node-id="127:373" data-name="calendar-days">
                    <img alt="" className="f5" src={imgCalendarDays} />
                  </div>
                  <p
                    className="f65"
                    data-node-id="127:375"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {overviewDateLabel(ui.dashboard.filters, ui.language)}
                  </p>
                </button>
                <button
                  className="f64"
                  data-node-id="127:376"
                  data-name="Action"
                  type="button"
                  onClick={() => ui.action('Export report')}
                >
                  <div className="f35" data-node-id="127:377" data-name="download">
                    <img alt="" className="f5" src={imgDownload} />
                  </div>
                  <p
                    className="f65"
                    data-node-id="127:379"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Export report')}
                  </p>
                </button>
                <button
                  className="f66"
                  data-node-id="127:380"
                  data-name="Action"
                  type="button"
                  onClick={() => ui.action('Upload file')}
                >
                  <div className="f35" data-node-id="127:381" data-name="plus">
                    <img alt="" className="f5" src={imgPlus} />
                  </div>
                  <p
                    className="f67"
                    data-node-id="127:383"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Upload file')}
                  </p>
                </button>
              </div>
            </div>
            {!empty && ui.dashboard.isFiltered && <OverviewScopeStatus />}
            {!empty && (
              <div className="f68" data-node-id="127:384" data-name="Key metrics">
                <div
                  className="f69 product-card"
                  data-node-id="127:385"
                  data-name="Feedback metric"
                >
                  <ScopeMetric kind="total">
                    <div className="f58" data-node-id="127:386" data-name="Metric heading">
                      <p
                        className="f36"
                        data-node-id="127:387"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Total responses')}
                      </p>
                      <div className="f35" data-node-id="127:388" data-name="message-square">
                        <img alt="" className="f5" src={imgMessageSquare1} />
                      </div>
                    </div>
                    <div className="f70" data-node-id="127:390" data-name="Metric value">
                      <p className="f71" data-node-id="127:391">
                        {tr('1,248')}
                      </p>
                    </div>
                    <div className="f72" data-node-id="127:392" data-name="Change">
                      <p
                        className="f73"
                        data-node-id="127:393"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {<DashboardArrowText text={tr('↑ 18.2%')} />}
                      </p>
                      <p
                        className="f12"
                        data-node-id="127:394"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('vs. previous 28 days')}
                      </p>
                    </div>
                  </ScopeMetric>
                </div>
                <div
                  className="f69 product-card"
                  data-node-id="127:395"
                  data-name="Feedback metric"
                >
                  <ScopeMetric kind="positive">
                    <div className="f58" data-node-id="127:396" data-name="Metric heading">
                      <p
                        className="f36"
                        data-node-id="127:397"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Positive sentiment')}
                      </p>
                      <div className="f35" data-node-id="127:398" data-name="smile">
                        <img alt="" className="f5" src={imgSmile} />
                      </div>
                    </div>
                    <div className="f74" data-node-id="127:400" data-name="Metric value">
                      <p className="f75" data-node-id="127:401">
                        {tr('78')}
                      </p>
                      <p
                        className="f76"
                        data-node-id="127:402"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('%')}
                      </p>
                    </div>
                    <div className="f72" data-node-id="127:403" data-name="Change">
                      <p
                        className="f73"
                        data-node-id="127:404"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {<DashboardArrowText text={tr('↑ 6 pts')} />}
                      </p>
                      <p
                        className="f12"
                        data-node-id="127:405"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('974 happy customers')}
                      </p>
                    </div>
                  </ScopeMetric>
                </div>
                <div
                  className="f69 product-card"
                  data-node-id="127:406"
                  data-name="Feedback metric"
                >
                  <ScopeMetric kind="rating">
                    <div className="f58" data-node-id="127:407" data-name="Metric heading">
                      <p
                        className="f36"
                        data-node-id="127:408"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Customer satisfaction')}
                      </p>
                      <div className="f35" data-node-id="127:409" data-name="star">
                        <img alt="" className="f5" src={imgStar} />
                      </div>
                    </div>
                    <div className="f74" data-node-id="127:411" data-name="Metric value">
                      <p className="f75" data-node-id="127:412">
                        {tr('4.6')}
                      </p>
                      <p
                        className="f76"
                        data-node-id="127:413"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('/ 5')}
                      </p>
                    </div>
                    <div className="f72" data-node-id="127:414" data-name="Change">
                      <p
                        className="f73"
                        data-node-id="127:415"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {<DashboardArrowText text={tr('↑ 0.3')} />}
                      </p>
                      <p
                        className="f12"
                        data-node-id="127:416"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Average customer rating')}
                      </p>
                    </div>
                  </ScopeMetric>
                </div>
                <div
                  className="f69 product-card"
                  data-node-id="127:417"
                  data-name="Feedback metric"
                >
                  <ScopeMetric kind="completion">
                    <div className="f58" data-node-id="127:418" data-name="Metric heading">
                      <p
                        className="f36"
                        data-node-id="127:419"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Completion rate')}
                      </p>
                      <div className="f35" data-node-id="127:420" data-name="circle-check">
                        <img alt="" className="f5" src={imgCircleCheck} />
                      </div>
                    </div>
                    <div className="f74" data-node-id="127:422" data-name="Metric value">
                      <p className="f75" data-node-id="127:423">
                        {tr('86')}
                      </p>
                      <p
                        className="f76"
                        data-node-id="127:424"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('%')}
                      </p>
                    </div>
                    <div className="f72" data-node-id="127:425" data-name="Change">
                      <p
                        className="f73"
                        data-node-id="127:426"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {<DashboardArrowText text={tr('↑ 4 pts')} />}
                      </p>
                      <p
                        className="f12"
                        data-node-id="127:427"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Of 1,451 survey starts')}
                      </p>
                    </div>
                  </ScopeMetric>
                </div>
              </div>
            )}
          </div>
          {empty ? (
            <OverviewEmpty />
          ) : (
            <>
              <div className="f77" data-node-id="127:428" data-name="Feedback trends">
                <div
                  className="f78 product-card"
                  data-node-id="127:429"
                  data-name="Response trends"
                >
                  <div className="f79" data-node-id="127:430" data-name="Section heading">
                    <div className="f80" data-node-id="127:431" data-name="Heading">
                      <p className="f81" data-node-id="127:432">
                        {tr('Response & sentiment trends')}
                      </p>
                      <p
                        className="f82"
                        data-node-id="127:433"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('More voices. A more positive experience.')}
                      </p>
                    </div>
                    <button
                      className="f83"
                      data-node-id="127:434"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                      type="button"
                      onClick={() => ui.action('Analytics →')}
                    >
                      {<DashboardArrowText text={tr('Analytics →')} />}
                    </button>
                  </div>
                  <div className="f84" data-node-id="127:435" data-name="Chart key" dir="ltr">
                    <div className="f47" data-node-id="127:436" data-name="Chart legend" dir="ltr">
                      <div className="f85" data-node-id="127:437" data-name="Legend mark">
                        <img alt="" className="f5" src={imgLegendMark} />
                      </div>
                      <p
                        className="f30"
                        data-node-id="127:438"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Responses')}
                      </p>
                    </div>
                    <div className="f47" data-node-id="127:439" data-name="Chart legend" dir="ltr">
                      <div className="f85" data-node-id="127:440" data-name="Legend mark">
                        <img alt="" className="f5" src={imgLegendMark1} />
                      </div>
                      <p
                        className="f30"
                        data-node-id="127:441"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Positive sentiment')}
                      </p>
                    </div>
                  </div>
                  <div
                    className="f86"
                    data-node-id="127:442"
                    data-name="Weekly trend chart"
                    dir="ltr"
                  >
                    <ScopeTrend>
                      <div className="f87" data-node-id="127:443" data-name="Response bar" />
                      <div className="f88" data-node-id="127:444" data-name="Response bar" />
                      <div className="f89" data-node-id="127:445" data-name="Response bar" />
                      <div className="f90" data-node-id="127:446" data-name="Response bar" />
                      <div className="f91" data-node-id="127:447" data-name="Sentiment point">
                        <img alt="" className="f5" src={imgSentimentPoint} />
                      </div>
                      <div className="f92" data-node-id="127:448" data-name="Sentiment point">
                        <img alt="" className="f5" src={imgSentimentPoint} />
                      </div>
                      <div className="f93" data-node-id="127:449" data-name="Sentiment point">
                        <img alt="" className="f5" src={imgSentimentPoint} />
                      </div>
                      <div className="f94" data-node-id="127:450" data-name="Sentiment point">
                        <img alt="" className="f5" src={imgSentimentPoint} />
                      </div>
                      <div className="f95" data-node-id="127:451" data-name="Sentiment trend">
                        <div className="f96">
                          <img alt="" className="f97" src={imgSentimentTrend} />
                        </div>
                      </div>
                      <p
                        className="f98"
                        data-node-id="127:452"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('3–9 Oct')}
                      </p>
                      <p
                        className="f99"
                        data-node-id="127:453"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('26 Sep–2 Oct')}
                      </p>
                      <p
                        className="f100"
                        data-node-id="127:454"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('19–25 Sep')}
                      </p>
                      <p
                        className="f101"
                        data-node-id="127:455"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('12–18 Sep')}
                      </p>
                      <p
                        className="f102"
                        data-node-id="127:456"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('380')}
                      </p>
                      <p
                        className="f103"
                        data-node-id="127:457"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('326')}
                      </p>
                      <p
                        className="f104"
                        data-node-id="127:458"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('294')}
                      </p>
                      <p
                        className="f105"
                        data-node-id="127:459"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('248')}
                      </p>
                      <div className="f106" data-node-id="127:460" data-name="Response highlight" />
                      <div className="f107" data-node-id="127:461" data-name="Response highlight" />
                      <div className="f108" data-node-id="127:462" data-name="Response highlight" />
                      <div className="f109" data-node-id="127:463" data-name="Response highlight" />
                      <p
                        className="f110"
                        data-node-id="127:464"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('70%')}
                      </p>
                      <p
                        className="f111"
                        data-node-id="127:465"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('75%')}
                      </p>
                      <p
                        className="f112"
                        data-node-id="127:466"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('80%')}
                      </p>
                      <p
                        className="f113"
                        data-node-id="127:467"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('0')}
                      </p>
                      <p
                        className="f114"
                        data-node-id="127:468"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('200')}
                      </p>
                      <p
                        className="f115"
                        data-node-id="127:469"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('400')}
                      </p>
                      <div className="f116" data-node-id="127:470" data-name="Grid line" />
                      <div className="f117" data-node-id="127:471" data-name="Grid line" />
                      <div className="f118" data-node-id="127:472" data-name="Grid line" />
                    </ScopeTrend>
                  </div>
                </div>
                <div
                  className="f119 product-card"
                  data-node-id="127:473"
                  data-name="Sentiment distribution"
                >
                  <ScopeSentiment>
                    <div className="f58" data-node-id="127:474" data-name="Section heading">
                      <div className="f120" data-node-id="127:475" data-name="Heading">
                        <p className="f81" data-node-id="127:476">
                          {tr('How customers feel')}
                        </p>
                        <p
                          className="f82"
                          data-node-id="127:477"
                          style={{
                            fontVariationSettings: '"opsz" 14',
                          }}
                        >
                          {tr('Sentiment across 1,248 responses')}
                        </p>
                      </div>
                    </div>
                    <div className="f121" data-node-id="127:478" data-name="Sentiment breakdown">
                      <div
                        className="f122"
                        data-node-id="127:479"
                        data-name="Sentiment donut"
                        dir="ltr"
                      >
                        <p
                          className="f123"
                          data-node-id="127:480"
                          style={{
                            fontVariationSettings: '"opsz" 14',
                          }}
                        >
                          {tr('Positive')}
                        </p>
                        <p className="f124" data-node-id="127:481">
                          {tr('78%')}
                        </p>
                        <div className="f125" data-node-id="127:482" data-name="Negative arc">
                          <div className="f126">
                            <img alt="" className="f97" src={imgNegativeArc} />
                          </div>
                        </div>
                        <div className="f125" data-node-id="127:483" data-name="Neutral arc">
                          <div className="f127">
                            <img alt="" className="f97" src={imgNeutralArc} />
                          </div>
                        </div>
                        <div className="f125" data-node-id="127:484" data-name="Positive arc">
                          <img alt="" className="f5" src={imgPositiveArc} />
                        </div>
                      </div>
                      <div className="f128" data-node-id="127:485" data-name="Distribution values">
                        <div className="f129" data-node-id="127:486" data-name="Sentiment category">
                          <div className="f85" data-node-id="127:487" data-name="Legend mark">
                            <img alt="" className="f5" src={imgLegendMark} />
                          </div>
                          <div className="f130" data-node-id="127:488" data-name="Category">
                            <p
                              className="f131"
                              data-node-id="127:489"
                              style={{
                                fontVariationSettings: '"opsz" 14',
                              }}
                            >
                              {tr('Positive')}
                            </p>
                            <p
                              className="f132"
                              data-node-id="127:490"
                              style={{
                                fontVariationSettings: '"opsz" 14',
                              }}
                            >
                              {tr('974 responses')}
                            </p>
                          </div>
                          <p
                            className="f133"
                            data-node-id="127:491"
                            style={{
                              fontVariationSettings: '"opsz" 14',
                            }}
                          >
                            {tr('78%')}
                          </p>
                        </div>
                        <div className="f129" data-node-id="127:492" data-name="Sentiment category">
                          <div className="f85" data-node-id="127:493" data-name="Legend mark">
                            <img alt="" className="f5" src={imgLegendMark2} />
                          </div>
                          <div className="f130" data-node-id="127:494" data-name="Category">
                            <p
                              className="f131"
                              data-node-id="127:495"
                              style={{
                                fontVariationSettings: '"opsz" 14',
                              }}
                            >
                              {tr('Neutral')}
                            </p>
                            <p
                              className="f132"
                              data-node-id="127:496"
                              style={{
                                fontVariationSettings: '"opsz" 14',
                              }}
                            >
                              {tr('175 responses')}
                            </p>
                          </div>
                          <p
                            className="f133"
                            data-node-id="127:497"
                            style={{
                              fontVariationSettings: '"opsz" 14',
                            }}
                          >
                            {tr('14%')}
                          </p>
                        </div>
                        <div className="f129" data-node-id="127:498" data-name="Sentiment category">
                          <div className="f85" data-node-id="127:499" data-name="Legend mark">
                            <img alt="" className="f5" src={imgLegendMark3} />
                          </div>
                          <div className="f130" data-node-id="127:500" data-name="Category">
                            <p
                              className="f131"
                              data-node-id="127:501"
                              style={{
                                fontVariationSettings: '"opsz" 14',
                              }}
                            >
                              {tr('Negative')}
                            </p>
                            <p
                              className="f132"
                              data-node-id="127:502"
                              style={{
                                fontVariationSettings: '"opsz" 14',
                              }}
                            >
                              {tr('99 responses')}
                            </p>
                          </div>
                          <p
                            className="f133"
                            data-node-id="127:503"
                            style={{
                              fontVariationSettings: '"opsz" 14',
                            }}
                          >
                            {tr('8%')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="f134" data-node-id="127:504" data-name="Sentiment change">
                      <p
                        className="f135"
                        data-node-id="127:505"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {
                          <DashboardArrowText
                            text={tr('↑ 6 pts more positive than the previous period')}
                          />
                        }
                      </p>
                    </div>
                  </ScopeSentiment>
                </div>
              </div>
              <div className="daily-branches-row">
                <NewDailyInsight />
                <MovedAspectScore />
              </div>

              <NewRecommendations />
              <NewQuickActions />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
