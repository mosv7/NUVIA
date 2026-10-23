import { LanguageMenu } from '../../../../components/ui/ChoiceMenu.jsx';
import React from 'react';
import { asset } from '../../../../lib/assets.js';
import { useProductView } from '../../../../app/providers/ProductProvider.jsx';
import './surveys-empty.css';
const imgLogo = asset('dashboard/surveys-empty/logo.svg');
const imgChevronsUpDown = asset('dashboard/surveys-empty/chevrons-up-down.svg');
const imgIcon = asset('dashboard/surveys-empty/icon.svg');
const imgMessageSquare = asset('dashboard/surveys-empty/message-square.svg');
const imgChartNoAxesCombined = asset('dashboard/surveys-empty/chart-no-axes-combined.svg');
const imgFileChartColumn = asset('dashboard/surveys-empty/file-chart-column.svg');
const imgIcon1 = asset('dashboard/surveys-empty/icon1.svg');
const imgUsers = asset('dashboard/surveys-empty/users.svg');
const imgSparkles = asset('dashboard/surveys-empty/sparkles.svg');
const imgCreditCard = asset('dashboard/surveys-empty/credit-card.svg');
const imgSettings = asset('dashboard/surveys-empty/settings.svg');
const imgCircleHelp = asset('dashboard/surveys-empty/circle-help.svg');
const imgIcon2 = asset('dashboard/surveys-empty/icon2.svg');
const imgIcon3 = asset('dashboard/surveys-empty/icon3.svg');
const imgIcon4 = asset('dashboard/surveys-empty/icon4.svg');
const imgNotifications = asset('dashboard/surveys-empty/notifications.svg');
const imgIcon5 = asset('dashboard/surveys-empty/icon5.svg');
const imgPlus = asset('dashboard/surveys-empty/plus.svg');
const imgIcon6 = asset('dashboard/surveys-empty/icon6.svg');
const imgRadio = asset('dashboard/surveys-empty/radio.svg');
const imgIcon7 = asset('dashboard/surveys-empty/icon7.svg');
const imgCircleCheck = asset('dashboard/surveys-empty/circle-check.svg');
const imgIcon8 = asset('dashboard/surveys-empty/icon8.svg');
const imgStore = asset('dashboard/surveys-empty/store.svg');
const imgArrowDownWideNarrow = asset('dashboard/surveys-empty/arrow-down-wide-narrow.svg');
const imgIcon9 = asset('dashboard/surveys-empty/icon9.svg');
const imgQrCode = asset('dashboard/surveys-empty/qr-code.svg');
export default function SurveysEmptyDesign() {
  const ui = useProductView();
  const tr = ui.tr;
  return (
    <div className="f0 product-view ds-surveys-empty" data-node-id="266:13297" data-name="Surveys">
      <div
        className="f1 product-navigation"
        data-node-id="266:13298"
        data-name="Product navigation"
        role="navigation"
        inert={ui.isMobile && !ui.menuOpen}
        aria-hidden={ui.isMobile && !ui.menuOpen}
      >
        <div className="f2" data-node-id="266:13299" data-name="NUVIA home">
          <div className="f3" data-node-id="266:13300" data-name="Brand mark">
            <div className="f4" data-node-id="266:13301" data-name="Logo">
              <img alt="" className="f5" src={imgLogo} />
            </div>
          </div>
          <p className="f6" data-node-id="266:13305">
            {tr('NUVIA')}
          </p>
        </div>
        <button
          className="f7"
          data-node-id="266:13306"
          data-name="Business switcher"
          type="button"
          onClick={() => ui.action('B Bloom & Co. Cafe &workspace')}
        >
          <div className="f8" data-node-id="266:13307" data-name="Business avatar">
            <p className="f9" data-node-id="266:13308">
              {tr('B')}
            </p>
          </div>
          <div className="f10" data-node-id="266:13309" data-name="Business">
            <p
              className="f11"
              data-node-id="266:13310"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Bloom & Co.')}
            </p>
            <p
              className="f12"
              data-node-id="266:13311"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Cafe &workspace')}
            </p>
          </div>
          <div className="f13" data-node-id="266:13312" data-name="chevrons-up-down">
            <img alt="" className="f5" src={imgChevronsUpDown} />
          </div>
        </button>
        <div className="f14" data-node-id="266:13314" data-name="Workspace destinations">
          <p
            className="f15"
            data-node-id="266:13315"
            style={{
              fontVariationSettings: '"opsz" 14',
            }}
          >
            {tr('WORKSPACE')}
          </p>
          <button
            className="f16"
            data-node-id="266:13316"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Overview')}
          >
            <div className="f17" data-node-id="266:13317" data-name="Icon">
              <img alt="" className="f5" src={imgIcon} />
            </div>
            <p
              className="f18"
              data-node-id="266:13319"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Overview')}
            </p>
          </button>
          <button
            className="f16"
            data-node-id="266:13320"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Feedbacks 12')}
          >
            <div className="f17" data-node-id="266:13321" data-name="message-square">
              <img alt="" className="f5" src={imgMessageSquare} />
            </div>
            <p
              className="f18"
              data-node-id="266:13323"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Feedbacks')}
            </p>
            <div className="f19" data-node-id="266:13324" data-name="Unread count">
              <p
                className="f20"
                data-node-id="266:13325"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('12')}
              </p>
            </div>
          </button>
          <button
            className="f16"
            data-node-id="266:13326"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Analytics')}
          >
            <div
              className="f17"
              data-node-id="266:13327"
              data-name="chart-no-axes-combined"
              dir="ltr"
            >
              <img alt="" className="f5" src={imgChartNoAxesCombined} />
            </div>
            <p
              className="f18"
              data-node-id="266:13329"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Analytics')}
            </p>
          </button>
          <button
            className="f16"
            data-node-id="266:13330"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Reports')}
          >
            <div className="f17" data-node-id="266:13331" data-name="file-chart-column" dir="ltr">
              <img alt="" className="f5" src={imgFileChartColumn} />
            </div>
            <p
              className="f18"
              data-node-id="266:13333"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Reports')}
            </p>
          </button>
          <button
            className="f21"
            data-node-id="266:13334"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Surveys')}
          >
            <div className="f17" data-node-id="266:13335" data-name="Icon">
              <img alt="" className="f5" src={imgIcon1} />
            </div>
            <p
              className="f22"
              data-node-id="266:13337"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Surveys')}
            </p>
          </button>
          <button
            className="f16"
            data-node-id="266:13338"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Segments')}
          >
            <div className="f17" data-node-id="266:13339" data-name="users">
              <img alt="" className="f5" src={imgUsers} />
            </div>
            <p
              className="f18"
              data-node-id="266:13341"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Business')}
            </p>
          </button>
          <div className="f23" data-node-id="266:13342" data-name="Divider" />
          <button
            className="f16"
            data-node-id="266:13343"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('NUVIA Assistant')}
          >
            <div className="f17" data-node-id="266:13344" data-name="sparkles">
              <img alt="" className="f5" src={imgSparkles} />
            </div>
            <p
              className="f18"
              data-node-id="266:13346"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('NUVIA Assistant')}
            </p>
          </button>
        </div>
        <div className="f24" data-node-id="266:13347" data-name="Flexible space" />
        <div className="f25" data-node-id="266:13348" data-name="Account destinations">
          <button
            className="f16"
            data-node-id="266:13349"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Subscription')}
          >
            <div className="f17" data-node-id="266:13350" data-name="credit-card">
              <img alt="" className="f5" src={imgCreditCard} />
            </div>
            <p
              className="f18"
              data-node-id="266:13352"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Subscription')}
            </p>
          </button>
          <button
            className="f16"
            data-node-id="266:13353"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Settings')}
          >
            <div className="f17" data-node-id="266:13354" data-name="settings">
              <img alt="" className="f5" src={imgSettings} />
            </div>
            <p
              className="f18"
              data-node-id="266:13356"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Settings')}
            </p>
          </button>
        </div>
        <div className="f26" data-node-id="266:13357" data-name="Plan usage">
          <div className="f27" data-node-id="266:13358" data-name="Plan">
            <p
              className="f28"
              data-node-id="266:13359"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Growth plan')}
            </p>
            <p
              className="f29"
              data-node-id="266:13360"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Active')}
            </p>
          </div>
          <p
            className="f30"
            data-node-id="266:13361"
            style={{
              fontVariationSettings: '"opsz" 14',
            }}
          >
            {tr('1,248 / 5,000 responses')}
          </p>
          <div className="f31" data-node-id="266:13362" data-name="Usage track">
            <div className="f32" data-node-id="266:13363" data-name="Usage progress" />
          </div>
          <button
            className="f33"
            data-node-id="266:13364"
            style={{
              fontVariationSettings: '"opsz" 14',
            }}
            type="button"
            onClick={() => ui.action('Manage subscription →')}
          >
            {tr('Manage subscription →')}
          </button>
        </div>
        <button
          className="f34"
          data-node-id="266:13365"
          data-name="Help"
          type="button"
          onClick={() => ui.action('Help center')}
        >
          <div className="f35" data-node-id="266:13366" data-name="circle-help">
            <img alt="" className="f5" src={imgCircleHelp} />
          </div>
          <p
            className="f36"
            data-node-id="266:13368"
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
        data-node-id="266:13369"
        data-name="Workspace"
        inert={ui.isMobile && ui.menuOpen}
      >
        <div className="f38 product-topbar" data-node-id="266:13370" data-name="Workspace header">
          <div className="f39" data-node-id="266:13371" data-name="Breadcrumb">
            <p
              className="f40"
              data-node-id="266:13372"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Bloom & Co.')}
            </p>
            <p className="f41" data-node-id="266:13373">
              {tr('/')}
            </p>
            <p
              className="f42"
              data-node-id="266:13374"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Surveys')}
            </p>
          </div>
          <div className="f43" data-node-id="266:13375" data-name="Header actions">
            <div className="f44" data-node-id="266:13376" data-name="Search">
              <div className="f13" data-node-id="266:13377" data-name="Icon">
                <img alt="" className="f5" src={imgIcon2} />
              </div>
              <input
                className="f45"
                data-node-id="266:13379"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
                data-workspace-search=""
                aria-label={tr('Search across pages')}
                placeholder={tr('Search across pages')}
                value={ui.workspaceQuery}
                onChange={(event) => ui.setWorkspaceQuery(event.target.value)}
              />
              <p
                className="f46"
                data-node-id="266:13380"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('⌘ K')}
              </p>
            </div>
            <div className="f47" data-node-id="266:13381" data-name="Language">
              <div className="f35" data-node-id="266:13382" data-name="Icon">
                <img alt="" className="f5" src={imgIcon3} />
              </div>
              <LanguageMenu iconOnly={ui.isMobile} value={ui.language} onChange={ui.setLanguage} />
              <div className="f48" data-node-id="266:13385" data-name="Icon">
                <img alt="" className="f5" src={imgIcon4} />
              </div>
            </div>
            <div className="f49" data-node-id="266:13387" data-name="Notifications">
              <img alt="" className="f5" src={imgNotifications} />
            </div>
            <div className="f50" data-node-id="266:13391" data-name="Divider" />
            <button
              className="f51"
              data-node-id="266:13392"
              data-name="Profile"
              type="button"
              onClick={() => ui.action('SA Sara Ahmed Workspace owner')}
            >
              <div className="f52" data-node-id="266:13393" data-name="Avatar">
                <p
                  className="f53"
                  data-node-id="266:13394"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('SA')}
                </p>
              </div>
              <div className="f54" data-node-id="266:13395" data-name="Account">
                <p
                  className="f55"
                  data-node-id="266:13396"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Sara Ahmed')}
                </p>
                <p
                  className="f12"
                  data-node-id="266:13397"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Workspace owner')}
                </p>
              </div>
              <div className="f56" data-node-id="266:13398" data-name="Icon">
                <img alt="" className="f5" src={imgIcon5} />
              </div>
            </button>
          </div>
        </div>
        <div className="f57 product-content" data-node-id="266:13400" data-name="Survey content">
          <div
            className="f58 product-section"
            data-node-id="266:13401"
            data-name="Heading and actions"
          >
            <div className="f59" data-node-id="266:13402" data-name="Page heading">
              <div className="f60" data-node-id="266:13403" data-name="Title and status">
                <p className="f61" data-node-id="266:13404">
                  {tr('Manage surveys')}
                </p>
              </div>
              <p
                className="f62"
                data-node-id="266:13405"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('Create, manage and share feedback across your branches.')}
              </p>
            </div>
            <div className="f63" data-node-id="266:13406" data-name="Page actions">
              <button
                className="f64"
                data-node-id="266:13411"
                data-name="Action"
                type="button"
                onClick={() => ui.action('Create survey')}
              >
                <div className="f35" data-node-id="266:13412" data-name="plus">
                  <img alt="" className="f5" src={imgPlus} />
                </div>
                <p
                  className="f65"
                  data-node-id="266:13414"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Create survey')}
                </p>
              </button>
            </div>
          </div>
          <div className="f66 product-section" data-node-id="266:13415" data-name="Survey overview">
            <div className="f67 product-card" data-node-id="266:13416" data-name="Survey metric">
              <div className="f58" data-node-id="266:13417" data-name="Metric heading">
                <p
                  className="f36"
                  data-node-id="266:13418"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Total surveys')}
                </p>
                <div className="f68" data-node-id="266:13419" data-name="Icon">
                  <img alt="" className="f5" src={imgIcon6} />
                </div>
              </div>
              <div className="f69" data-node-id="266:13421" data-name="Metric value and context">
                <p
                  className="f70"
                  data-node-id="266:13422"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('0')}
                </p>
                <p
                  className="f71"
                  data-node-id="266:13423"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Across 3 branches')}
                </p>
              </div>
            </div>
            <div className="f67 product-card" data-node-id="266:13424" data-name="Survey metric">
              <div className="f58" data-node-id="266:13425" data-name="Metric heading">
                <p
                  className="f36"
                  data-node-id="266:13426"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Live surveys')}
                </p>
                <div className="f68" data-node-id="266:13427" data-name="radio">
                  <img alt="" className="f5" src={imgRadio} />
                </div>
              </div>
              <div className="f69" data-node-id="266:13429" data-name="Metric value and context">
                <p
                  className="f70"
                  data-node-id="266:13430"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('0')}
                </p>
                <p
                  className="f71"
                  data-node-id="266:13431"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Collecting feedback')}
                </p>
              </div>
            </div>
            <div className="f67 product-card" data-node-id="266:13432" data-name="Survey metric">
              <div className="f58" data-node-id="266:13433" data-name="Metric heading">
                <p
                  className="f36"
                  data-node-id="266:13434"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Responses this month')}
                </p>
                <div className="f68" data-node-id="266:13435" data-name="Icon">
                  <img alt="" className="f5" src={imgIcon7} />
                </div>
              </div>
              <div className="f72" data-node-id="266:13437" data-name="Metric value and context">
                <p
                  className="f73"
                  data-node-id="266:13438"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('0')}
                </p>
              </div>
            </div>
            <div className="f67 product-card" data-node-id="266:13440" data-name="Survey metric">
              <div className="f58" data-node-id="266:13441" data-name="Metric heading">
                <p
                  className="f36"
                  data-node-id="266:13442"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Completion rate')}
                </p>
                <div className="f68" data-node-id="266:13443" data-name="circle-check">
                  <img alt="" className="f5" src={imgCircleCheck} />
                </div>
              </div>
              <div className="f69" data-node-id="266:13445" data-name="Metric value and context">
                <p
                  className="f70"
                  data-node-id="266:13446"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('0%')}
                </p>
                <p
                  className="f71"
                  data-node-id="266:13447"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr(' this month')}
                </p>
              </div>
            </div>
          </div>
          <div
            className="f74 product-section product-card"
            data-node-id="266:13448"
            data-name="Survey management"
          >
            <div className="f75" data-node-id="266:13666">
              <div className="f76" data-node-id="266:13449" data-name="Status filters">
                <button
                  className="f77"
                  data-node-id="266:13450"
                  data-name="Status tab"
                  type="button"
                  onClick={() => ui.action('All surveys  ')}
                >
                  <p
                    className="f78"
                    data-node-id="266:13451"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('All surveys  ')}
                  </p>
                  <div className="f79" data-node-id="266:13452" data-name="Active indicator" />
                </button>
                <button
                  className="f77"
                  data-node-id="266:13453"
                  data-name="Status tab"
                  type="button"
                  onClick={() => ui.action('Live  ')}
                >
                  <p
                    className="f80"
                    data-node-id="266:13454"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Live  ')}
                  </p>
                  <div className="f81" data-node-id="266:13455" data-name="Active indicator" />
                </button>
                <button
                  className="f77"
                  data-node-id="266:13456"
                  data-name="Status tab"
                  type="button"
                  onClick={() => ui.action('Drafts  ')}
                >
                  <p
                    className="f80"
                    data-node-id="266:13457"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Drafts  ')}
                  </p>
                  <div className="f81" data-node-id="266:13458" data-name="Active indicator" />
                </button>
                <button
                  className="f77"
                  data-node-id="266:13459"
                  data-name="Status tab"
                  type="button"
                  onClick={() => ui.action('Paused  ')}
                >
                  <p
                    className="f80"
                    data-node-id="266:13460"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Paused  ')}
                  </p>
                  <div className="f81" data-node-id="266:13461" data-name="Active indicator" />
                </button>
                <button
                  className="f77"
                  data-node-id="266:13462"
                  data-name="Status tab"
                  type="button"
                  onClick={() => ui.action('Closed  ')}
                >
                  <p
                    className="f80"
                    data-node-id="266:13463"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Closed  ')}
                  </p>
                  <div className="f81" data-node-id="266:13464" data-name="Active indicator" />
                </button>
              </div>
              <div className="f82" data-node-id="266:13465" data-name="Search and filters">
                <div className="f83" data-node-id="266:13466" data-name="Survey search">
                  <div className="f35" data-node-id="266:13467" data-name="Icon">
                    <img alt="" className="f5" src={imgIcon8} />
                  </div>
                  <input
                    className="f84"
                    data-node-id="266:13469"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                    aria-label={tr('Search surveys by name...')}
                    placeholder={tr('Search surveys by name...')}
                    value={ui.query}
                    onChange={(event) => ui.setQuery(event.target.value)}
                  />
                </div>
                <div className="f85" data-node-id="266:13470" data-name="Filters">
                  <button
                    className="f86"
                    data-node-id="266:13471"
                    data-name="Action"
                    type="button"
                    onClick={() => ui.action('All 3 branches')}
                  >
                    <div className="f35" data-node-id="266:13472" data-name="store">
                      <img alt="" className="f5" src={imgStore} />
                    </div>
                    <p
                      className="f87"
                      data-node-id="266:13474"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('All 3 branches')}
                    </p>
                  </button>
                  <button
                    className="f86"
                    data-node-id="266:13475"
                    data-name="Action"
                    type="button"
                    onClick={() => ui.action('Last updated')}
                  >
                    <div
                      className="f35"
                      data-node-id="266:13476"
                      data-name="arrow-down-wide-narrow"
                    >
                      <img alt="" className="f5" src={imgArrowDownWideNarrow} />
                    </div>
                    <p
                      className="f87"
                      data-node-id="266:13478"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('Last updated')}
                    </p>
                  </button>
                </div>
              </div>
              <div className="f88" data-node-id="266:13479" data-name="Table headings">
                <button
                  className="f89"
                  data-node-id="266:13480"
                  data-name="Select all"
                  type="button"
                  role="checkbox"
                  aria-checked={ui.checked['266:13480'] ?? false}
                  aria-label={tr('Select all')}
                  onClick={() => ui.toggleCheck('266:13480', false)}
                />
                <p
                  className="f90"
                  data-node-id="266:13481"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('SURVEY NAME')}
                </p>
                <p
                  className="f91"
                  data-node-id="266:13482"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('STATUS')}
                </p>
                <p
                  className="f92"
                  data-node-id="266:13483"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('BRANCHES')}
                </p>
                <p
                  className="f93"
                  data-node-id="266:13484"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('RESPONSES')}
                </p>
                <p
                  className="f94"
                  data-node-id="266:13485"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('UPDATED')}
                </p>
                <p
                  className="f95"
                  data-node-id="266:13486"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('ACTIONS')}
                </p>
              </div>
            </div>
            <div className="f96" data-node-id="266:13665">
              <div className="f97" data-node-id="266:13653" data-name="State symbol">
                <div className="f98" data-node-id="266:13654" data-name="messages-square">
                  <div className="f99" data-node-id="266:13657" data-name="Icon">
                    <img alt="" className="f5" src={imgIcon9} />
                  </div>
                </div>
              </div>
              <div className="f100" data-node-id="266:13638" data-name="State explanation">
                <p
                  className="f101"
                  data-node-id="266:13639"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('No surveys yet')}
                </p>
                <p
                  className="f102"
                  data-node-id="266:13640"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr(
                    'Create your first survey to start collecting feedback, or start from a ready-made template.',
                  )}
                </p>
              </div>
              <div className="f85" data-node-id="266:13641" data-name="Recovery actions">
                <button
                  className="f103"
                  data-node-id="266:13660"
                  data-name="Action"
                  type="button"
                  onClick={() => ui.action('Create survey')}
                >
                  <div className="f35" data-node-id="266:13661" data-name="plus">
                    <img alt="" className="f5" src={imgPlus} />
                  </div>
                  <p
                    className="f65"
                    data-node-id="266:13663"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Create survey')}
                  </p>
                </button>
                <button
                  className="f104"
                  data-node-id="266:13646"
                  data-name="Action"
                  type="button"
                  onClick={() => ui.action('Browser templets')}
                >
                  <p
                    className="f105"
                    data-node-id="266:13647"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Browser templets')}
                  </p>
                </button>
              </div>
            </div>
          </div>
          <div className="f106 product-section" data-node-id="266:13630" data-name="Collection tip">
            <div className="f107" data-node-id="266:13631" data-name="Tip symbol">
              <div className="f108" data-node-id="266:13632" data-name="qr-code">
                <img alt="" className="f5" src={imgQrCode} />
              </div>
            </div>
            <div className="f109" data-node-id="266:13634" data-name="Tip">
              <p
                className="f11"
                data-node-id="266:13635"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('Bring feedback to every table')}
              </p>
              <p
                className="f110"
                data-node-id="266:13636"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr(
                  'Share a branch-specific QR code to see exactly where each response comes from.',
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
