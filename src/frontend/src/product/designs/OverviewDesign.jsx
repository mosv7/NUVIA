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
const imgRefreshCw = asset('dashboard/overview/refresh-cw.svg');
const imgSparkles1 = asset('dashboard/overview/sparkles1.svg');
const imgArrowUp = asset('dashboard/overview/arrow-up.svg');
const imgLink = asset('dashboard/overview/link.svg');
const imgCopy = asset('dashboard/overview/copy.svg');
const imgQrCode = asset('dashboard/overview/qr-code.svg');
const imgExternalLink = asset('dashboard/overview/external-link.svg');
const imgClock3 = asset('dashboard/overview/clock3.svg');
const imgTag = asset('dashboard/overview/tag.svg');
const imgHeartHandshake = asset('dashboard/overview/heart-handshake.svg');
const imgLegendMarker = asset('dashboard/overview/legend-marker.svg');
const imgLegendMarker1 = asset('dashboard/overview/legend-marker1.svg');
const imgLegendMarker2 = asset('dashboard/overview/legend-marker2.svg');
export default function OverviewDesign() {
  const ui = useProductView();
  const tr = ui.tr;
  return (
    <div
      className="f0 product-view ds-overview"
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
              {tr('Segments')}
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
              <span className="f36" aria-hidden="true">
                {ui.language === 'ar' ? 'العربية' : 'EN'}
              </span>
              <select
                className="f36 product-language-select"
                data-node-id="127:343"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
                aria-label="Language / اللغة"
                value={ui.language}
                onChange={(event) => ui.setLanguage(event.target.value)}
              >
                <option value="en">EN</option>
                <option value="ar">العربية</option>
              </select>
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
            <div className="f68" data-node-id="127:384" data-name="Key metrics">
              <div className="f69 product-card" data-node-id="127:385" data-name="Feedback metric">
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
              </div>
              <div className="f69 product-card" data-node-id="127:395" data-name="Feedback metric">
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
              </div>
              <div className="f69 product-card" data-node-id="127:406" data-name="Feedback metric">
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
              </div>
              <div className="f69 product-card" data-node-id="127:417" data-name="Feedback metric">
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
              </div>
            </div>
          </div>
          <div className="f77" data-node-id="127:428" data-name="Feedback trends">
            <div className="f78 product-card" data-node-id="127:429" data-name="Response trends">
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
              <div className="f86" data-node-id="127:442" data-name="Weekly trend chart" dir="ltr">
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
              </div>
            </div>
            <div
              className="f119 product-card"
              data-node-id="127:473"
              data-name="Sentiment distribution"
            >
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
                <div className="f122" data-node-id="127:479" data-name="Sentiment donut" dir="ltr">
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
            </div>
          </div>
          <div className="f136" data-node-id="127:506" data-name="Customer voices and next actions">
            <div
              className="f137 product-card"
              data-node-id="127:507"
              data-name="Latest customer responses"
            >
              <div className="f79" data-node-id="127:508" data-name="Section heading">
                <div className="f80" data-node-id="127:509" data-name="Heading">
                  <p className="f81" data-node-id="127:510">
                    {tr('Latest customer responses')}
                  </p>
                  <p
                    className="f82"
                    data-node-id="127:511"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Real voices from your Customer experience survey')}
                  </p>
                </div>
                <button
                  className="f83"
                  data-node-id="127:512"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                  type="button"
                  onClick={() => ui.action('All responses →')}
                >
                  {<DashboardArrowText text={tr('All responses →')} />}
                </button>
              </div>
              <div className="f138" data-node-id="127:513" data-name="Response list">
                <div
                  className="f139"
                  data-node-id="127:514"
                  data-name="Customer response"
                  hidden={
                    !!ui.query &&
                    !ui.matches(
                      'AM “Love the service. Checkout could be a little faster.” Aisha M. · Returning · QR code Neutral 12 min ago',
                    )
                  }
                >
                  <div className="f140" data-node-id="127:515" data-name="Customer avatar">
                    <p
                      className="f141"
                      data-node-id="127:516"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('AM')}
                    </p>
                  </div>
                  <div className="f142" data-node-id="127:517" data-name="Response content">
                    <p
                      className="f143"
                      data-node-id="127:518"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('“Love the service. Checkout could be a little faster.”')}
                    </p>
                    <div className="f144" data-node-id="127:519" data-name="Metadata">
                      <p
                        className="f145"
                        data-node-id="127:520"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Aisha M.')}
                      </p>
                      <p
                        className="f146"
                        data-node-id="127:521"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('· Returning · QR code')}
                      </p>
                    </div>
                  </div>
                  <div className="f147" data-node-id="127:522" data-name="Response status">
                    <div
                      className="f148"
                      data-node-id="127:523"
                      data-name="Status"
                      data-tone="neutral"
                    >
                      <p
                        className="f149"
                        data-node-id="127:524"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Neutral')}
                      </p>
                    </div>
                    <p
                      className="f150"
                      data-node-id="127:525"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('12 min ago')}
                    </p>
                  </div>
                </div>
                <div
                  className="f139"
                  data-node-id="127:526"
                  data-name="Customer response"
                  hidden={
                    !!ui.query &&
                    !ui.matches(
                      'OK “The team always makes me feel welcome. I’ll be back!” Omar K. · VIP · Short link Positive 28 min ago',
                    )
                  }
                >
                  <div className="f140" data-node-id="127:527" data-name="Customer avatar">
                    <p
                      className="f141"
                      data-node-id="127:528"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('OK')}
                    </p>
                  </div>
                  <div className="f142" data-node-id="127:529" data-name="Response content">
                    <p
                      className="f143"
                      data-node-id="127:530"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('“The team always makes me feel welcome. I’ll be back!”')}
                    </p>
                    <div className="f144" data-node-id="127:531" data-name="Metadata">
                      <p
                        className="f145"
                        data-node-id="127:532"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Omar K.')}
                      </p>
                      <p
                        className="f146"
                        data-node-id="127:533"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('· VIP · Short link')}
                      </p>
                    </div>
                  </div>
                  <div className="f147" data-node-id="127:534" data-name="Response status">
                    <div
                      className="f151"
                      data-node-id="127:535"
                      data-name="Status"
                      data-tone="positive"
                    >
                      <p
                        className="f152"
                        data-node-id="127:536"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Positive')}
                      </p>
                    </div>
                    <p
                      className="f150"
                      data-node-id="127:537"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('28 min ago')}
                    </p>
                  </div>
                </div>
                <div
                  className="f139"
                  data-node-id="127:538"
                  data-name="Customer response"
                  hidden={
                    !!ui.query &&
                    !ui.matches(
                      'LS “Finding the right product was easy. Great first visit.” Lina S. · New customer · Short link Positive 46 min ago',
                    )
                  }
                >
                  <div className="f140" data-node-id="127:539" data-name="Customer avatar">
                    <p
                      className="f141"
                      data-node-id="127:540"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('LS')}
                    </p>
                  </div>
                  <div className="f142" data-node-id="127:541" data-name="Response content">
                    <p
                      className="f143"
                      data-node-id="127:542"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('“Finding the right product was easy. Great first visit.”')}
                    </p>
                    <div className="f144" data-node-id="127:543" data-name="Metadata">
                      <p
                        className="f145"
                        data-node-id="127:544"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Lina S.')}
                      </p>
                      <p
                        className="f146"
                        data-node-id="127:545"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('· New customer · Short link')}
                      </p>
                    </div>
                  </div>
                  <div className="f147" data-node-id="127:546" data-name="Response status">
                    <div
                      className="f151"
                      data-node-id="127:547"
                      data-name="Status"
                      data-tone="positive"
                    >
                      <p
                        className="f152"
                        data-node-id="127:548"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Positive')}
                      </p>
                    </div>
                    <p
                      className="f150"
                      data-node-id="127:549"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('46 min ago')}
                    </p>
                  </div>
                </div>
                <div
                  className="f139"
                  data-node-id="127:550"
                  data-name="Customer response"
                  hidden={
                    !!ui.query &&
                    !ui.matches(
                      'YH “I waited too long to pay, even with only a few items.” Yousef H. · Returning · QR code Negative 1 hour ago',
                    )
                  }
                >
                  <div className="f140" data-node-id="127:551" data-name="Customer avatar">
                    <p
                      className="f141"
                      data-node-id="127:552"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('YH')}
                    </p>
                  </div>
                  <div className="f142" data-node-id="127:553" data-name="Response content">
                    <p
                      className="f143"
                      data-node-id="127:554"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('“I waited too long to pay, even with only a few items.”')}
                    </p>
                    <div className="f144" data-node-id="127:555" data-name="Metadata">
                      <p
                        className="f145"
                        data-node-id="127:556"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Yousef H.')}
                      </p>
                      <p
                        className="f146"
                        data-node-id="127:557"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('· Returning · QR code')}
                      </p>
                    </div>
                  </div>
                  <div className="f147" data-node-id="127:558" data-name="Response status">
                    <div
                      className="f153"
                      data-node-id="127:559"
                      data-name="Status"
                      data-tone="negative"
                    >
                      <p
                        className="f154"
                        data-node-id="127:560"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Negative')}
                      </p>
                    </div>
                    <p
                      className="f150"
                      data-node-id="127:561"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('1 hour ago')}
                    </p>
                  </div>
                </div>
              </div>
              <button
                className="f155"
                data-node-id="127:562"
                data-name="Collection status"
                type="button"
                onClick={() =>
                  ui.action('Updated just now · 12 new responses since your last visit')
                }
              >
                <div className="f48" data-node-id="127:563" data-name="refresh-cw">
                  <img alt="" className="f5" src={imgRefreshCw} />
                </div>
                <p
                  className="f156"
                  data-node-id="127:565"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Updated just now · 12 new responses since your last visit')}
                </p>
              </button>
            </div>
            <div className="f157 product-card" data-node-id="127:566" data-name="Ask NUVIA preview">
              <div className="f58" data-node-id="127:567" data-name="Assistant heading">
                <div className="f158" data-node-id="127:568" data-name="Assistant brand">
                  <div className="f159" data-node-id="127:569" data-name="sparkles">
                    <img alt="" className="f5" src={imgSparkles1} />
                  </div>
                  <p className="f160" data-node-id="127:571">
                    {tr('Ask NUVIA')}
                  </p>
                </div>
                <div className="f161" data-node-id="127:572" data-name="Status" data-tone="info">
                  <p
                    className="f162"
                    data-node-id="127:573"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Evidence-backed')}
                  </p>
                </div>
              </div>
              <button
                className="f163"
                data-node-id="127:574"
                data-name="Sample question"
                type="button"
                onClick={() => ui.action('Why did sentiment dip at Cairo this month?')}
              >
                <p
                  className="f164"
                  data-node-id="127:575"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Why did sentiment dip at Cairo this month?')}
                </p>
              </button>
              <p
                className="f165"
                data-node-id="127:576"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr(
                  "Longer evening waits are the main driver. 104 reviews mention delays, twice August's 52. Food quality remains a strength.",
                )}
              </p>
              <div className="f166" data-node-id="127:577" data-name="Quoted source">
                <p
                  className="f167"
                  dir="auto"
                  data-node-id="127:578"
                  style={{
                    fontVariationSettings: '"wdth" 100',
                  }}
                >
                  {tr('القهوة ممتازة لكن انتظرنا الطلب ٢٥ دقيقة.')}
                </p>
                <p
                  className="f168"
                  data-node-id="127:579"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('“The coffee is good, but we waited 25 minutes for the order.”')}
                </p>
                <p
                  className="f169"
                  data-node-id="127:580"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('[1] Google review · Cairo · Sep 18')}
                </p>
              </div>
              <div className="f170" data-node-id="127:581" data-name="Assistant follow-up">
                <input
                  className="f171"
                  data-node-id="127:582"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                  aria-label={tr('Ask a question about this feedback…')}
                  placeholder={tr('Ask a question about this feedback…')}
                  value={ui.query}
                  onChange={(event) => ui.setQuery(event.target.value)}
                />
                <div className="f17" data-node-id="127:583" data-name="arrow-up">
                  <img alt="" className="f5" src={imgArrowUp} />
                </div>
              </div>
              <p
                className="f172"
                data-node-id="127:585"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('Answers in Arabic or English · 104 supporting reviews')}
              </p>
            </div>
          </div>
          <div className="f173" data-node-id="127:586" data-name="Segments and survey collection">
            <div
              className="f174 product-card"
              data-node-id="127:587"
              data-name="Segment performance"
            >
              <div className="f79" data-node-id="127:588" data-name="Section heading">
                <div className="f80" data-node-id="127:589" data-name="Heading">
                  <p className="f81" data-node-id="127:590">
                    {tr('Every segment, understood')}
                  </p>
                  <p
                    className="f82"
                    data-node-id="127:591"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Compare experiences across your customer groups')}
                  </p>
                </div>
                <button
                  className="f83"
                  data-node-id="127:592"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                  type="button"
                  onClick={() => ui.action('Segments →')}
                >
                  {<DashboardArrowText text={tr('Segments →')} />}
                </button>
              </div>
              <div className="f138" data-node-id="127:593" data-name="Comparison table">
                <div className="f175" data-node-id="127:594" data-name="Column headings">
                  <p
                    className="f176"
                    data-node-id="127:595"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('SEGMENT')}
                  </p>
                  <p
                    className="f177"
                    data-node-id="127:596"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('RESPONSES')}
                  </p>
                  <p
                    className="f178"
                    data-node-id="127:597"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('POSITIVE SENTIMENT')}
                  </p>
                  <p
                    className="f179"
                    data-node-id="127:598"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('CSAT')}
                  </p>
                </div>
                <div className="f180" data-node-id="127:599" data-name="Segment comparison">
                  <p
                    className="f181"
                    data-node-id="127:600"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Returning customers')}
                  </p>
                  <p
                    className="f182"
                    data-node-id="127:601"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('540')}
                  </p>
                  <div className="f183" data-node-id="127:602" data-name="Sentiment">
                    <div className="f184" data-node-id="127:603" data-name="Sentiment track">
                      <div className="f185" data-node-id="127:604" data-name="Positive share" />
                    </div>
                    <p
                      className="f186"
                      data-node-id="127:605"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('82%')}
                    </p>
                  </div>
                  <p
                    className="f187"
                    data-node-id="127:606"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('4.7')}
                  </p>
                </div>
                <div className="f180" data-node-id="127:607" data-name="Segment comparison">
                  <p
                    className="f181"
                    data-node-id="127:608"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('New customers')}
                  </p>
                  <p
                    className="f182"
                    data-node-id="127:609"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('468')}
                  </p>
                  <div className="f183" data-node-id="127:610" data-name="Sentiment">
                    <div className="f184" data-node-id="127:611" data-name="Sentiment track">
                      <div className="f188" data-node-id="127:612" data-name="Positive share" />
                    </div>
                    <p
                      className="f186"
                      data-node-id="127:613"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('74%')}
                    </p>
                  </div>
                  <p
                    className="f187"
                    data-node-id="127:614"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('4.4')}
                  </p>
                </div>
                <div className="f180" data-node-id="127:615" data-name="Segment comparison">
                  <p
                    className="f181"
                    data-node-id="127:616"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('VIP customers')}
                  </p>
                  <p
                    className="f182"
                    data-node-id="127:617"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('240')}
                  </p>
                  <div className="f183" data-node-id="127:618" data-name="Sentiment">
                    <div className="f184" data-node-id="127:619" data-name="Sentiment track">
                      <div className="f189" data-node-id="127:620" data-name="Positive share" />
                    </div>
                    <p
                      className="f186"
                      data-node-id="127:621"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('78%')}
                    </p>
                  </div>
                  <p
                    className="f187"
                    data-node-id="127:622"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('4.8')}
                  </p>
                </div>
              </div>
            </div>
            <div className="f190 product-card" data-node-id="127:623" data-name="Live survey">
              <div className="f58" data-node-id="127:624" data-name="Survey heading">
                <p className="f191" data-node-id="127:625">
                  {tr('Keep the feedback coming')}
                </p>
                <div
                  className="f151"
                  data-node-id="127:626"
                  data-name="Status"
                  data-tone="positive"
                >
                  <p
                    className="f152"
                    data-node-id="127:627"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Live')}
                  </p>
                </div>
              </div>
              <div className="f192" data-node-id="127:628" data-name="Survey details">
                <p
                  className="f193"
                  data-node-id="127:629"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Customer experience survey')}
                </p>
                <p
                  className="f194"
                  data-node-id="127:630"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('6 questions · 3 segments · Arabic & English')}
                </p>
              </div>
              <div className="f195" data-node-id="127:631" data-name="Share link">
                <div className="f13" data-node-id="127:632" data-name="link">
                  <img alt="" className="f5" src={imgLink} />
                </div>
                <p
                  className="f196"
                  data-node-id="127:634"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('nuvia.link/bloom-feedback')}
                </p>
                <div className="f13" data-node-id="127:635" data-name="copy">
                  <img alt="" className="f5" src={imgCopy} />
                </div>
              </div>
              <div className="f197" data-node-id="127:637" data-name="Publishing actions">
                <button
                  className="f198"
                  data-node-id="127:638"
                  data-name="Action"
                  type="button"
                  onClick={() => ui.action('Download QR code')}
                >
                  <div className="f35" data-node-id="127:639" data-name="qr-code">
                    <img alt="" className="f5" src={imgQrCode} />
                  </div>
                  <p
                    className="f65"
                    data-node-id="127:641"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Download QR code')}
                  </p>
                </button>
                <button
                  className="f199"
                  data-node-id="127:642"
                  data-name="Action"
                  type="button"
                  onClick={() => ui.action('Manage survey')}
                >
                  <p
                    className="f65"
                    data-node-id="127:643"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Manage survey')}
                  </p>
                </button>
              </div>
              <p
                className="f200"
                data-node-id="127:644"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('774 via QR code · 474 via short link')}
              </p>
            </div>
          </div>
          <div className="f201" data-node-id="127:645" data-name="Feedback and branch evidence">
            <div className="f202 product-card" data-node-id="127:646" data-name="Feedback explorer">
              <div className="f58" data-node-id="127:647" data-name="Feedback header">
                <div className="f203" data-node-id="127:648" data-name="Feedback heading">
                  <p className="f204" data-node-id="127:649">
                    {tr('Behind every signal')}
                  </p>
                  <p
                    className="f205"
                    data-node-id="127:650"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Original voices, not just averages')}
                  </p>
                </div>
                <button className="f206" data-node-id="127:651" data-name="Search feedback">
                  <input
                    className="f207"
                    data-node-id="I127:651;19:2103"
                    aria-label={tr('Search feedback…')}
                    placeholder={tr('Search feedback…')}
                    value={ui.query}
                    onChange={(event) => ui.setQuery(event.target.value)}
                  />
                </button>
              </div>
              <div
                className="f208"
                data-node-id="127:652"
                data-name="Review"
                hidden={
                  !!ui.query &&
                  !ui.matches(
                    'Google · Cairo · Sep 18 · Arabic القهوة ممتازة لكن انتظرنا الطلب ٢٥ دقيقة. The coffee is good, but we waited 25 minutes for the order. Food · Positive Speed · Negative',
                  )
                }
              >
                <div className="f209" data-node-id="127:653" data-name="Feedback example">
                  <div className="f58" data-node-id="127:654" data-name="Feedback provenance">
                    <p
                      className="f210"
                      data-node-id="127:655"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('Google · Cairo · Sep 18 · Arabic')}
                    </p>
                    <div className="f211" data-node-id="127:656" data-name="external-link">
                      <img alt="" className="f5" src={imgExternalLink} />
                    </div>
                  </div>
                  <p
                    className="f212"
                    dir="auto"
                    data-node-id="127:658"
                    style={{
                      fontVariationSettings: '"wdth" 100',
                    }}
                  >
                    {tr('القهوة ممتازة لكن انتظرنا الطلب ٢٥ دقيقة.')}
                  </p>
                  <p
                    className="f213"
                    data-node-id="127:659"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('The coffee is good, but we waited 25 minutes for the order.')}
                  </p>
                  <div className="f214" data-node-id="127:660" data-name="Detected aspects">
                    <div
                      className="f215"
                      data-node-id="127:661"
                      data-name="Status"
                      data-tone="positive"
                    >
                      <p
                        className="f216"
                        data-node-id="127:662"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Food · Positive')}
                      </p>
                    </div>
                    <div
                      className="f217"
                      data-node-id="127:663"
                      data-name="Status"
                      data-tone="negative"
                    >
                      <p
                        className="f218"
                        data-node-id="127:664"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Speed · Negative')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="f219" data-node-id="127:665" data-name="Review divider" />
              </div>
              <div
                className="f138"
                data-node-id="127:666"
                data-name="Review"
                hidden={
                  !!ui.query &&
                  !ui.matches(
                    'Post-visit survey · El Zamalek · Sep 24 · English “The team remembered my order and made me feel welcome.” Staff · Positive',
                  )
                }
              >
                <div className="f209" data-node-id="127:667" data-name="Feedback example">
                  <div className="f58" data-node-id="127:668" data-name="Feedback provenance">
                    <p
                      className="f210"
                      data-node-id="127:669"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('Post-visit survey · El Zamalek · Sep 24 · English')}
                    </p>
                    <div className="f211" data-node-id="127:670" data-name="external-link">
                      <img alt="" className="f5" src={imgExternalLink} />
                    </div>
                  </div>
                  <p
                    className="f220"
                    data-node-id="127:672"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('“The team remembered my order and made me feel welcome.”')}
                  </p>
                  <div className="f221" data-node-id="127:673" data-name="Detected aspects">
                    <div
                      className="f215"
                      data-node-id="127:674"
                      data-name="Status"
                      data-tone="positive"
                    >
                      <p
                        className="f216"
                        data-node-id="127:675"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Staff · Positive')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="f222" data-node-id="127:676" data-name="Feedback footer">
                <p
                  className="f40"
                  data-node-id="127:677"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('750 Arabic · 500 English · 3 feedback sources')}
                </p>
                <button
                  className="f223"
                  data-node-id="127:678"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                  type="button"
                  onClick={() => ui.action('Explore all 1,250 reviews →')}
                >
                  {<DashboardArrowText text={tr('Explore all 1,250 reviews →')} />}
                </button>
              </div>
            </div>
            <div className="f224 product-card" data-node-id="127:679" data-name="Branch comparison">
              <div className="f58" data-node-id="127:680" data-name="Section heading">
                <div className="f203" data-node-id="127:681" data-name="Heading copy">
                  <p className="f204" data-node-id="127:682">
                    {tr('A clearer view of each branch')}
                  </p>
                  <p
                    className="f205"
                    data-node-id="127:683"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Positive sentiment · September')}
                  </p>
                </div>
              </div>
              <div className="f225" data-node-id="127:684" data-name="Branches">
                <div className="f209" data-node-id="127:685" data-name="Branch">
                  <div className="f58" data-node-id="127:686" data-name="Branch heading">
                    <p
                      className="f226"
                      data-node-id="127:687"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('Cairo')}
                    </p>
                    <div
                      className="f217"
                      data-node-id="127:688"
                      data-name="Status"
                      data-tone="negative"
                    >
                      <p
                        className="f218"
                        data-node-id="127:689"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Needs attention')}
                      </p>
                    </div>
                  </div>
                  <div className="f227" data-node-id="127:690" data-name="Branch metric">
                    <div className="f228" data-node-id="127:691" data-name="Branch sentiment track">
                      <div className="f229" data-node-id="127:692" data-name="Positive share" />
                    </div>
                    <p
                      className="f230"
                      data-node-id="127:693"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('62%')}
                    </p>
                    <p
                      className="f231"
                      data-node-id="127:694"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('500 reviews')}
                    </p>
                  </div>
                </div>
                <div className="f209" data-node-id="127:695" data-name="Branch">
                  <div className="f58" data-node-id="127:696" data-name="Branch heading">
                    <p
                      className="f226"
                      data-node-id="127:697"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('El Zamalek')}
                    </p>
                    <div
                      className="f215"
                      data-node-id="127:698"
                      data-name="Status"
                      data-tone="positive"
                    >
                      <p
                        className="f216"
                        data-node-id="127:699"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Top performer')}
                      </p>
                    </div>
                  </div>
                  <div className="f227" data-node-id="127:700" data-name="Branch metric">
                    <div className="f228" data-node-id="127:701" data-name="Branch sentiment track">
                      <div className="f232" data-node-id="127:702" data-name="Positive share" />
                    </div>
                    <p
                      className="f230"
                      data-node-id="127:703"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('82%')}
                    </p>
                    <p
                      className="f231"
                      data-node-id="127:704"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('450 reviews')}
                    </p>
                  </div>
                </div>
                <div className="f209" data-node-id="127:705" data-name="Branch">
                  <div className="f58" data-node-id="127:706" data-name="Branch heading">
                    <p
                      className="f226"
                      data-node-id="127:707"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('Alex')}
                    </p>
                    <div
                      className="f161"
                      data-node-id="127:708"
                      data-name="Status"
                      data-tone="info"
                    >
                      <p
                        className="f162"
                        data-node-id="127:709"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('On track')}
                      </p>
                    </div>
                  </div>
                  <div className="f227" data-node-id="127:710" data-name="Branch metric">
                    <div className="f228" data-node-id="127:711" data-name="Branch sentiment track">
                      <div className="f233" data-node-id="127:712" data-name="Positive share" />
                    </div>
                    <p
                      className="f230"
                      data-node-id="127:713"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('74%')}
                    </p>
                    <p
                      className="f231"
                      data-node-id="127:714"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('300 reviews')}
                    </p>
                  </div>
                </div>
              </div>
              <button
                className="f234"
                data-node-id="127:715"
                data-name="Comparison link"
                type="button"
                onClick={() => ui.action('3 branches · 1,250 reviews Compare branches →')}
              >
                <p
                  className="f40"
                  data-node-id="127:716"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('3 branches · 1,250 reviews')}
                </p>
                <p
                  className="f223"
                  data-node-id="127:717"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {<DashboardArrowText text={tr('Compare branches →')} />}
                </p>
              </button>
            </div>
          </div>
          <div className="f235" data-node-id="127:718">
            <div
              className="f236 product-card"
              data-node-id="127:719"
              data-name="Prioritized actions"
            >
              <div className="f237" data-node-id="127:720" data-name="Section heading">
                <div className="f238" data-node-id="127:721" data-name="Heading copy">
                  <p className="f204" data-node-id="127:722">
                    {tr('What to do next')}
                  </p>
                  <p
                    className="f205"
                    data-node-id="127:723"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('3 recommendations, ranked by impact and feedback volume')}
                  </p>
                </div>
                <button
                  className="f239"
                  data-node-id="127:724"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                  type="button"
                  onClick={() => ui.action('Action board →')}
                >
                  {<DashboardArrowText text={tr('Action board →')} />}
                </button>
              </div>
              <div className="f240" data-node-id="127:725" data-name="Action item">
                <div className="f241" data-node-id="127:726" data-name="Recommended action">
                  <div className="f242" data-node-id="127:727" data-name="Action symbol">
                    <div className="f35" data-node-id="127:728" data-name="clock-3">
                      <img alt="" className="f5" src={imgClock3} />
                    </div>
                  </div>
                  <div className="f80" data-node-id="127:730" data-name="Action evidence">
                    <div className="f58" data-node-id="127:731" data-name="Action title">
                      <p
                        className="f230"
                        data-node-id="127:732"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Shorten the evening queue at Cairo')}
                      </p>
                      <div
                        className="f217"
                        data-node-id="127:733"
                        data-name="Status"
                        data-tone="negative"
                      >
                        <p
                          className="f218"
                          data-node-id="127:734"
                          style={{
                            fontVariationSettings: '"opsz" 14',
                          }}
                        >
                          {tr('High priority')}
                        </p>
                      </div>
                    </div>
                    <p
                      className="f243"
                      data-node-id="127:735"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('Add peak-hour coverage. Wait-time complaints rose 2× vs. August.')}
                    </p>
                    <p
                      className="f244"
                      data-node-id="127:736"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('“Great coffee, but we waited 25 minutes for our order.”')}
                    </p>
                    <button
                      className="f245"
                      data-node-id="127:737"
                      data-name="Evidence link"
                      type="button"
                      onClick={() => ui.action('104 reviews · Cairo · Operations View evidence ↗')}
                    >
                      <p
                        className="f12"
                        data-node-id="127:738"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('104 reviews · Cairo · Operations')}
                      </p>
                      <p
                        className="f246"
                        data-node-id="127:739"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {<DashboardArrowText text={tr('View evidence ↗')} />}
                      </p>
                    </button>
                  </div>
                </div>
                <div className="f219" data-node-id="127:740" data-name="Action divider" />
              </div>
              <div className="f240" data-node-id="127:741" data-name="Action item">
                <div className="f241" data-node-id="127:742" data-name="Recommended action">
                  <div className="f242" data-node-id="127:743" data-name="Action symbol">
                    <div className="f35" data-node-id="127:744" data-name="tag">
                      <img alt="" className="f5" src={imgTag} />
                    </div>
                  </div>
                  <div className="f80" data-node-id="127:746" data-name="Action evidence">
                    <div className="f58" data-node-id="127:747" data-name="Action title">
                      <p
                        className="f230"
                        data-node-id="127:748"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Make combo pricing clearer')}
                      </p>
                      <div
                        className="f161"
                        data-node-id="127:749"
                        data-name="Status"
                        data-tone="warning"
                      >
                        <p
                          className="f162"
                          data-node-id="127:750"
                          style={{
                            fontVariationSettings: '"opsz" 14',
                          }}
                        >
                          {tr('Medium')}
                        </p>
                      </div>
                    </div>
                    <p
                      className="f243"
                      data-node-id="127:751"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('Show the full price upfront on menus and ordering screens.')}
                    </p>
                    <p
                      className="f244"
                      data-node-id="127:752"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('“The combo cost more than the price on the menu.”')}
                    </p>
                    <button
                      className="f245"
                      data-node-id="127:753"
                      data-name="Evidence link"
                      type="button"
                      onClick={() =>
                        ui.action('48 reviews · All branches · Commercial View evidence ↗')
                      }
                    >
                      <p
                        className="f12"
                        data-node-id="127:754"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('48 reviews · All branches · Commercial')}
                      </p>
                      <p
                        className="f246"
                        data-node-id="127:755"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {<DashboardArrowText text={tr('View evidence ↗')} />}
                      </p>
                    </button>
                  </div>
                </div>
                <div className="f219" data-node-id="127:756" data-name="Action divider" />
              </div>
              <div className="f138" data-node-id="127:757" data-name="Action item">
                <div className="f241" data-node-id="127:758" data-name="Recommended action">
                  <div className="f242" data-node-id="127:759" data-name="Action symbol">
                    <div className="f35" data-node-id="127:760" data-name="heart-handshake">
                      <img alt="" className="f5" src={imgHeartHandshake} />
                    </div>
                  </div>
                  <div className="f80" data-node-id="127:762" data-name="Action evidence">
                    <div className="f58" data-node-id="127:763" data-name="Action title">
                      <p
                        className="f230"
                        data-node-id="127:764"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Share El Zamalek’s service playbook')}
                      </p>
                      <div
                        className="f215"
                        data-node-id="127:765"
                        data-name="Status"
                        data-tone="positive"
                      >
                        <p
                          className="f216"
                          data-node-id="127:766"
                          style={{
                            fontVariationSettings: '"opsz" 14',
                          }}
                        >
                          {tr('Opportunity')}
                        </p>
                      </div>
                    </div>
                    <p
                      className="f243"
                      data-node-id="127:767"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('Replicate the welcome customers love across your branches.')}
                    </p>
                    <p
                      className="f244"
                      data-node-id="127:768"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('“The team remembered my order and made me feel welcome.”')}
                    </p>
                    <button
                      className="f245"
                      data-node-id="127:769"
                      data-name="Evidence link"
                      type="button"
                      onClick={() =>
                        ui.action('92 reviews · Elzamalek · Branch leads View evidence ↗')
                      }
                    >
                      <p
                        className="f12"
                        data-node-id="127:770"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('92 reviews · Elzamalek · Branch leads')}
                      </p>
                      <p
                        className="f246"
                        data-node-id="127:771"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {<DashboardArrowText text={tr('View evidence ↗')} />}
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="f247 product-card"
              data-node-id="127:772"
              data-name="Aspect intelligence"
            >
              <div className="f58" data-node-id="127:773" data-name="Section heading">
                <div className="f203" data-node-id="127:774" data-name="Heading copy">
                  <p className="f204" data-node-id="127:775">
                    {tr("What's driving the experience?")}
                  </p>
                  <p
                    className="f205"
                    data-node-id="127:776"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Sentiment by aspect · Reviews can mention several')}
                  </p>
                </div>
              </div>
              <div className="f240" data-node-id="127:777" data-name="Aspect rows">
                <div className="f209" data-node-id="127:778" data-name="Aspect row">
                  <div className="f245" data-node-id="127:779" data-name="Aspect detail">
                    <p
                      className="f55"
                      data-node-id="127:780"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('Food quality')}
                    </p>
                    <p
                      className="f248"
                      data-node-id="127:781"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('640 mentions · 86% positive')}
                    </p>
                  </div>
                  <div className="f249" data-node-id="127:782" data-name="Aspect sentiment bar">
                    <div className="f250" data-node-id="127:783" data-name="Positive share" />
                    <div className="f251" data-node-id="127:784" data-name="Neutral share" />
                    <div className="f252" data-node-id="127:785" data-name="Negative share" />
                  </div>
                </div>
                <div className="f209" data-node-id="127:786" data-name="Aspect row">
                  <div className="f245" data-node-id="127:787" data-name="Aspect detail">
                    <p
                      className="f55"
                      data-node-id="127:788"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('Staff friendliness')}
                    </p>
                    <p
                      className="f248"
                      data-node-id="127:789"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('410 mentions · 81% positive')}
                    </p>
                  </div>
                  <div className="f249" data-node-id="127:790" data-name="Aspect sentiment bar">
                    <div className="f253" data-node-id="127:791" data-name="Positive share" />
                    <div className="f254" data-node-id="127:792" data-name="Neutral share" />
                    <div className="f252" data-node-id="127:793" data-name="Negative share" />
                  </div>
                </div>
                <div className="f209" data-node-id="127:794" data-name="Aspect row">
                  <div className="f245" data-node-id="127:795" data-name="Aspect detail">
                    <p
                      className="f55"
                      data-node-id="127:796"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('Value for money')}
                    </p>
                    <p
                      className="f248"
                      data-node-id="127:797"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('325 mentions · 65% positive')}
                    </p>
                  </div>
                  <div className="f249" data-node-id="127:798" data-name="Aspect sentiment bar">
                    <div className="f255" data-node-id="127:799" data-name="Positive share" />
                    <div className="f256" data-node-id="127:800" data-name="Neutral share" />
                    <div className="f252" data-node-id="127:801" data-name="Negative share" />
                  </div>
                </div>
                <div className="f209" data-node-id="127:802" data-name="Aspect row">
                  <div className="f245" data-node-id="127:803" data-name="Aspect detail">
                    <p
                      className="f55"
                      data-node-id="127:804"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('Order accuracy')}
                    </p>
                    <p
                      className="f248"
                      data-node-id="127:805"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('280 mentions · 76% positive')}
                    </p>
                  </div>
                  <div className="f249" data-node-id="127:806" data-name="Aspect sentiment bar">
                    <div className="f257" data-node-id="127:807" data-name="Positive share" />
                    <div className="f258" data-node-id="127:808" data-name="Neutral share" />
                    <div className="f252" data-node-id="127:809" data-name="Negative share" />
                  </div>
                </div>
                <div className="f209" data-node-id="127:810" data-name="Aspect row">
                  <div className="f245" data-node-id="127:811" data-name="Aspect detail">
                    <p
                      className="f55"
                      data-node-id="127:812"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('Service speed')}
                    </p>
                    <p
                      className="f248"
                      data-node-id="127:813"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('360 mentions · 42% positive')}
                    </p>
                  </div>
                  <div className="f249" data-node-id="127:814" data-name="Aspect sentiment bar">
                    <div className="f259" data-node-id="127:815" data-name="Positive share" />
                    <div className="f256" data-node-id="127:816" data-name="Neutral share" />
                    <div className="f252" data-node-id="127:817" data-name="Negative share" />
                  </div>
                </div>
              </div>
              <div className="f260" data-node-id="127:818" data-name="Aspect legend">
                <div className="f47" data-node-id="127:819" data-name="Chart legend item" dir="ltr">
                  <div className="f261" data-node-id="127:820" data-name="Legend marker">
                    <img alt="" className="f5" src={imgLegendMarker} />
                  </div>
                  <p
                    className="f231"
                    data-node-id="127:821"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Positive')}
                  </p>
                </div>
                <div className="f47" data-node-id="127:822" data-name="Chart legend item" dir="ltr">
                  <div className="f261" data-node-id="127:823" data-name="Legend marker">
                    <img alt="" className="f5" src={imgLegendMarker1} />
                  </div>
                  <p
                    className="f231"
                    data-node-id="127:824"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Neutral')}
                  </p>
                </div>
                <div className="f47" data-node-id="127:825" data-name="Chart legend item" dir="ltr">
                  <div className="f261" data-node-id="127:826" data-name="Legend marker">
                    <img alt="" className="f5" src={imgLegendMarker2} />
                  </div>
                  <p
                    className="f231"
                    data-node-id="127:827"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Negative')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
