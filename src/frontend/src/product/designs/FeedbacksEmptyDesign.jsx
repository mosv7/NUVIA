import { LanguageMenu } from '../../components/ChoiceMenu.jsx';
import React from 'react';
import { asset } from '../../assets.js';
import { useProductView } from '../ProductContext.jsx';
import './feedbacks-empty.css';
const imgLogo = asset('dashboard/feedbacks-empty/logo.svg');
const imgIcon = asset('dashboard/feedbacks-empty/icon.svg');
const imgIcon1 = asset('dashboard/feedbacks-empty/icon1.svg');
const imgIcon2 = asset('dashboard/feedbacks-empty/icon2.svg');
const imgIcon3 = asset('dashboard/feedbacks-empty/icon3.svg');
const imgIcon4 = asset('dashboard/feedbacks-empty/icon4.svg');
const imgIcon5 = asset('dashboard/feedbacks-empty/icon5.svg');
const imgIcon6 = asset('dashboard/feedbacks-empty/icon6.svg');
const imgIcon7 = asset('dashboard/feedbacks-empty/icon7.svg');
const imgIcon8 = asset('dashboard/feedbacks-empty/icon8.svg');
const imgIcon9 = asset('dashboard/feedbacks-empty/icon9.svg');
const imgIcon10 = asset('dashboard/feedbacks-empty/icon10.svg');
const imgIcon11 = asset('dashboard/feedbacks-empty/icon11.svg');
const imgIcon12 = asset('dashboard/feedbacks-empty/icon12.svg');
const imgIcon13 = asset('dashboard/feedbacks-empty/icon13.svg');
const imgNotifications = asset('dashboard/feedbacks-empty/notifications.svg');
const imgIcon14 = asset('dashboard/feedbacks-empty/icon14.svg');
const imgDownload = asset('dashboard/feedbacks-empty/download.svg');
const imgSlidersHorizontal = asset('dashboard/feedbacks-empty/sliders-horizontal.svg');
const imgCalendarDays = asset('dashboard/feedbacks-empty/calendar-days.svg');
const imgChevronDown = asset('dashboard/feedbacks-empty/chevron-down.svg');
const imgArrowUpRight = asset('dashboard/feedbacks-empty/arrow-up-right.svg');
const imgArrowDown = asset('dashboard/feedbacks-empty/arrow-down.svg');
const imgMessagesSquare = asset('dashboard/feedbacks-empty/messages-square.svg');
const imgSend = asset('dashboard/feedbacks-empty/send.svg');
const imgClipboardList = asset('dashboard/feedbacks-empty/clipboard-list.svg');
const imgQrCode = asset('dashboard/feedbacks-empty/qr-code.svg');
const imgChartNoAxesCombined = asset('dashboard/feedbacks-empty/chart-no-axes-combined.svg');
export default function FeedbacksEmptyDesign() {
  const ui = useProductView();
  const tr = ui.tr;
  return (
    <div
      className="f0 product-view ds-feedbacks-empty"
      data-node-id="266:13066"
      data-name="Feedbacks"
    >
      <div
        className="f1 product-navigation"
        data-node-id="266:13067"
        data-name="Product navigation"
        role="navigation"
        inert={ui.isMobile && !ui.menuOpen}
        aria-hidden={ui.isMobile && !ui.menuOpen}
      >
        <div className="f2" data-node-id="266:13068" data-name="NUVIA home">
          <div className="f3" data-node-id="266:13069" data-name="Brand mark">
            <div className="f4" data-node-id="266:13070" data-name="Logo">
              <img alt="" className="f5" src={imgLogo} />
            </div>
          </div>
          <p className="f6" data-node-id="266:13074">
            {tr('NUVIA')}
          </p>
        </div>
        <button
          className="f7"
          data-node-id="266:13075"
          data-name="Business switcher"
          type="button"
          onClick={() => ui.action('B Bloom & Co. Cafe &workspace')}
        >
          <div className="f8" data-node-id="266:13076" data-name="Business avatar">
            <p className="f9" data-node-id="266:13077">
              {tr('B')}
            </p>
          </div>
          <div className="f10" data-node-id="266:13078" data-name="Business">
            <p
              className="f11"
              data-node-id="266:13079"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Bloom & Co.')}
            </p>
            <p
              className="f12"
              data-node-id="266:13080"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Cafe &workspace')}
            </p>
          </div>
          <div className="f13" data-node-id="266:13081" data-name="Icon">
            <img alt="" className="f5" src={imgIcon} />
          </div>
        </button>
        <div className="f14" data-node-id="266:13083" data-name="Workspace destinations">
          <p
            className="f15"
            data-node-id="266:13084"
            style={{
              fontVariationSettings: '"opsz" 14',
            }}
          >
            {tr('WORKSPACE')}
          </p>
          <button
            className="f16"
            data-node-id="266:13085"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Overview')}
          >
            <div className="f17" data-node-id="266:13086" data-name="Icon">
              <img alt="" className="f5" src={imgIcon1} />
            </div>
            <p
              className="f18"
              data-node-id="266:13088"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Overview')}
            </p>
          </button>
          <button
            className="f19"
            data-node-id="266:13089"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Feedbacks')}
          >
            <div className="f17" data-node-id="266:13090" data-name="Icon">
              <img alt="" className="f5" src={imgIcon2} />
            </div>
            <p
              className="f20"
              data-node-id="266:13092"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Feedbacks')}
            </p>
          </button>
          <button
            className="f16"
            data-node-id="266:13093"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Analytics')}
          >
            <div className="f17" data-node-id="266:13094" data-name="Icon">
              <img alt="" className="f5" src={imgIcon3} />
            </div>
            <p
              className="f18"
              data-node-id="266:13096"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Analytics')}
            </p>
          </button>
          <button
            className="f16"
            data-node-id="266:13097"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Reports')}
          >
            <div className="f17" data-node-id="266:13098" data-name="Icon">
              <img alt="" className="f5" src={imgIcon4} />
            </div>
            <p
              className="f18"
              data-node-id="266:13100"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Reports')}
            </p>
          </button>
          <button
            className="f16"
            data-node-id="266:13101"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Surveys')}
          >
            <div className="f17" data-node-id="266:13102" data-name="Icon">
              <img alt="" className="f5" src={imgIcon5} />
            </div>
            <p
              className="f18"
              data-node-id="266:13104"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Surveys')}
            </p>
          </button>
          <button
            className="f16"
            data-node-id="266:13105"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Segments')}
          >
            <div className="f17" data-node-id="266:13106" data-name="Icon">
              <img alt="" className="f5" src={imgIcon6} />
            </div>
            <p
              className="f18"
              data-node-id="266:13108"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Business & Teams')}
            </p>
          </button>
          <div className="f21" data-node-id="266:13109" data-name="Divider" />
          <button
            className="f16"
            data-node-id="266:13110"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('NUVIA Assistant')}
          >
            <div className="f17" data-node-id="266:13111" data-name="Icon">
              <img alt="" className="f5" src={imgIcon7} />
            </div>
            <p
              className="f18"
              data-node-id="266:13113"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('NUVIA Assistant')}
            </p>
          </button>
        </div>
        <div className="f22" data-node-id="266:13114" data-name="Flexible space" />
        <div className="f23" data-node-id="266:13115" data-name="Account destinations">
          <button
            className="f16"
            data-node-id="266:13116"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Subscription')}
          >
            <div className="f17" data-node-id="266:13117" data-name="Icon">
              <img alt="" className="f5" src={imgIcon8} />
            </div>
            <p
              className="f18"
              data-node-id="266:13119"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Subscription')}
            </p>
          </button>
          <button
            className="f16"
            data-node-id="266:13120"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Settings')}
          >
            <div className="f17" data-node-id="266:13121" data-name="Icon">
              <img alt="" className="f5" src={imgIcon9} />
            </div>
            <p
              className="f18"
              data-node-id="266:13123"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Settings')}
            </p>
          </button>
        </div>
        <div className="f24" data-node-id="266:13288" data-name="Plan usage">
          <div className="f25" data-node-id="266:13289" data-name="Plan">
            <p
              className="f26"
              data-node-id="266:13290"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Growth plan')}
            </p>
            <p
              className="f27"
              data-node-id="266:13291"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Active')}
            </p>
          </div>
          <p
            className="f28"
            data-node-id="266:13292"
            style={{
              fontVariationSettings: '"opsz" 14',
            }}
          >
            {tr('1,248 / 5,000 responses')}
          </p>
          <div className="f29" data-node-id="266:13293" data-name="Usage track">
            <div className="f30" data-node-id="266:13294" data-name="Usage progress" />
          </div>
          <button
            className="f31"
            data-node-id="266:13295"
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
          className="f32"
          data-node-id="266:13131"
          data-name="Help"
          type="button"
          onClick={() => ui.action('Help center')}
        >
          <div className="f33" data-node-id="266:13132" data-name="Icon">
            <img alt="" className="f5" src={imgIcon10} />
          </div>
          <p
            className="f34"
            data-node-id="266:13134"
            style={{
              fontVariationSettings: '"opsz" 14',
            }}
          >
            {tr('Help center')}
          </p>
        </button>
      </div>
      <div
        className="f35 product-workspace"
        data-node-id="266:13135"
        data-name="Workspace"
        inert={ui.isMobile && ui.menuOpen}
      >
        <div className="f36 product-topbar" data-node-id="266:13136" data-name="Workspace header">
          <div className="f37" data-node-id="266:13137" data-name="Breadcrumb">
            <p
              className="f38"
              data-node-id="266:13138"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Bloom & Co.')}
            </p>
            <p
              className="f38"
              data-node-id="266:13139"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('/')}
            </p>
            <p
              className="f39"
              data-node-id="266:13140"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Feedbacks')}
            </p>
          </div>
          <div className="f40" data-node-id="266:13141" data-name="Header actions">
            <div className="f41" data-node-id="266:13142" data-name="Search">
              <div className="f13" data-node-id="266:13143" data-name="Icon">
                <img alt="" className="f5" src={imgIcon11} />
              </div>
              <input
                className="f42"
                data-node-id="266:13145"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
                aria-label={tr('Search your workspace')}
                placeholder={tr('Search your workspace')}
                value={ui.query}
                onChange={(event) => ui.setQuery(event.target.value)}
              />
              <p
                className="f43"
                data-node-id="266:13146"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('⌘ K')}
              </p>
            </div>
            <div className="f44" data-node-id="266:13147" data-name="Language">
              <div className="f33" data-node-id="266:13148" data-name="Icon">
                <img alt="" className="f5" src={imgIcon12} />
              </div>
              <LanguageMenu value={ui.language} onChange={ui.setLanguage} />
              <div className="f45" data-node-id="266:13151" data-name="Icon">
                <img alt="" className="f5" src={imgIcon13} />
              </div>
            </div>
            <div className="f46" data-node-id="266:13153" data-name="Notifications">
              <img alt="" className="f5" src={imgNotifications} />
            </div>
            <div className="f47" data-node-id="266:13157" data-name="Divider" />
            <button
              className="f48"
              data-node-id="266:13158"
              data-name="Profile"
              type="button"
              onClick={() => ui.action('SA Sara Ahmed Workspace owner')}
            >
              <div className="f49" data-node-id="266:13159" data-name="Avatar">
                <p
                  className="f50"
                  data-node-id="266:13160"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('SA')}
                </p>
              </div>
              <div className="f51" data-node-id="266:13161" data-name="Account">
                <p
                  className="f52"
                  data-node-id="266:13162"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Sara Ahmed')}
                </p>
                <p
                  className="f12"
                  data-node-id="266:13163"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Workspace owner')}
                </p>
              </div>
              <div className="f53" data-node-id="266:13164" data-name="Icon">
                <img alt="" className="f5" src={imgIcon14} />
              </div>
            </button>
          </div>
        </div>
        <div className="f54 product-content" data-node-id="266:13166" data-name="Response content">
          <div
            className="f55 product-section"
            data-node-id="266:13167"
            data-name="Heading and actions"
          >
            <div className="f56" data-node-id="266:13168" data-name="Page heading">
              <p className="f57" data-node-id="266:13169">
                {tr('Feedbacks')}
              </p>
              <p
                className="f58"
                data-node-id="266:13170"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('Listen to your customers. Understand every experience.')}
              </p>
            </div>
            <div className="f59" data-node-id="266:13171" data-name="Disabled action">
              <div className="f60" data-node-id="266:13172" data-name="download">
                <img alt="" className="f5" src={imgDownload} />
              </div>
              <p
                className="f61"
                data-node-id="266:13174"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('Export')}
              </p>
            </div>
          </div>
          <div
            className="f62 product-section"
            data-node-id="266:13175"
            data-name="Response filters"
          >
            <div className="f63" data-node-id="266:13176" data-name="Filter heading">
              <div className="f64" data-node-id="266:13177" data-name="Filter label">
                <div className="f60" data-node-id="266:13178" data-name="sliders-horizontal">
                  <img alt="" className="f5" src={imgSlidersHorizontal} />
                </div>
                <p
                  className="f65"
                  data-node-id="266:13180"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Filters')}
                </p>
              </div>
              <p
                className="f66"
                data-node-id="266:13181"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('Clear Filters')}
              </p>
            </div>
            <div className="f67" data-node-id="266:13182" data-name="Filter controls">
              <div className="f68" data-node-id="266:13183" data-name="Filter">
                <p
                  className="f69"
                  data-node-id="266:13184"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Date range')}
                </p>
                <div className="f70" data-node-id="266:13185" data-name="Disabled select">
                  <div className="f13" data-node-id="266:13186" data-name="calendar-days">
                    <img alt="" className="f5" src={imgCalendarDays} />
                  </div>
                  <p
                    className="f71"
                    data-node-id="266:13188"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Last 30 days')}
                  </p>
                  <div className="f53" data-node-id="266:13189" data-name="chevron-down">
                    <img alt="" className="f5" src={imgChevronDown} />
                  </div>
                </div>
              </div>
              <div className="f72" data-node-id="266:13191" data-name="Filter">
                <p
                  className="f69"
                  data-node-id="266:13192"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Sentiment')}
                </p>
                <div className="f70" data-node-id="266:13193" data-name="Disabled select">
                  <p
                    className="f71"
                    data-node-id="266:13194"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('All sentiments')}
                  </p>
                  <div className="f53" data-node-id="266:13195" data-name="chevron-down">
                    <img alt="" className="f5" src={imgChevronDown} />
                  </div>
                </div>
              </div>
              <div className="f72" data-node-id="266:13197" data-name="Filter">
                <p
                  className="f69"
                  data-node-id="266:13198"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Language')}
                </p>
                <div className="f70" data-node-id="266:13199" data-name="Disabled select">
                  <p
                    className="f71"
                    data-node-id="266:13200"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('All languages')}
                  </p>
                  <div className="f53" data-node-id="266:13201" data-name="chevron-down">
                    <img alt="" className="f5" src={imgChevronDown} />
                  </div>
                </div>
              </div>
              <div className="f72" data-node-id="266:13203" data-name="Filter">
                <p
                  className="f69"
                  data-node-id="266:13204"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Aspect')}
                </p>
                <div className="f70" data-node-id="266:13205" data-name="Disabled select">
                  <p
                    className="f71"
                    data-node-id="266:13206"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('All aspects')}
                  </p>
                  <div className="f53" data-node-id="266:13207" data-name="chevron-down">
                    <img alt="" className="f5" src={imgChevronDown} />
                  </div>
                </div>
              </div>
              <div className="f72" data-node-id="266:13209" data-name="Filter">
                <p
                  className="f69"
                  data-node-id="266:13210"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Branch')}
                </p>
                <div className="f70" data-node-id="266:13211" data-name="Disabled select">
                  <p
                    className="f71"
                    data-node-id="266:13212"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('All branches')}
                  </p>
                  <div className="f53" data-node-id="266:13213" data-name="chevron-down">
                    <img alt="" className="f5" src={imgChevronDown} />
                  </div>
                </div>
              </div>
              <div className="f72" data-node-id="266:13215" data-name="Filter">
                <p
                  className="f69"
                  data-node-id="266:13216"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Segment')}
                </p>
                <div className="f70" data-node-id="266:13217" data-name="Disabled select">
                  <p
                    className="f71"
                    data-node-id="266:13218"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('All segments')}
                  </p>
                  <div className="f53" data-node-id="266:13219" data-name="chevron-down">
                    <img alt="" className="f5" src={imgChevronDown} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="f73 product-section" data-node-id="266:13221" data-name="Responses table">
            <div className="f74" data-node-id="266:13222" data-name="Response toolbar">
              <div className="f75" data-node-id="266:13223" data-name="Result count">
                <p
                  className="f76"
                  data-node-id="266:13224"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('0 responses')}
                </p>
              </div>
              <div className="f77" data-node-id="266:13225" data-name="Table actions">
                <p
                  className="f43"
                  data-node-id="266:13226"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Newest first')}
                </p>
                <div className="f78" data-node-id="266:13227" data-name="Disabled action">
                  <div className="f60" data-node-id="266:13228" data-name="arrow-up-right">
                    <img alt="" className="f5" src={imgArrowUpRight} />
                  </div>
                  <p
                    className="f61"
                    data-node-id="266:13230"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Open Response')}
                  </p>
                </div>
              </div>
            </div>
            <div className="f79" data-node-id="266:13231" data-name="Table columns">
              <button
                className="f80"
                data-node-id="266:13232"
                data-name="Select all"
                type="button"
                role="checkbox"
                aria-checked={ui.checked['266:13232'] ?? false}
                aria-label={tr('Select all')}
                onClick={() => ui.toggleCheck('266:13232', false)}
              >
                <div className="f81" data-node-id="266:13233" data-name="Disabled selection" />
              </button>
              <p
                className="f82"
                data-node-id="266:13234"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('Feedback preview')}
              </p>
              <p
                className="f83"
                data-node-id="266:13235"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('Sentiment')}
              </p>
              <div className="f84" data-node-id="266:13236" data-name="Date column">
                <p
                  className="f85"
                  data-node-id="266:13237"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Date')}
                </p>
                <div className="f53" data-node-id="266:13238" data-name="arrow-down">
                  <img alt="" className="f5" src={imgArrowDown} />
                </div>
              </div>
              <p
                className="f86"
                data-node-id="266:13240"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('Language')}
              </p>
              <p
                className="f87"
                data-node-id="266:13241"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('Related aspect')}
              </p>
              <p
                className="f88"
                data-node-id="266:13242"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('View Details')}
              </p>
            </div>
            <div className="f89" data-node-id="266:13243" data-name="First response guidance">
              <div className="f90" data-node-id="266:13244" data-name="State symbol">
                <div className="f91" data-node-id="266:13245" data-name="messages-square">
                  <img alt="" className="f5" src={imgMessagesSquare} />
                </div>
              </div>
              <div className="f92" data-node-id="266:13247" data-name="State explanation">
                <p
                  className="f93"
                  data-node-id="266:13248"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Your first response starts here')}
                </p>
                <p
                  className="f94"
                  data-node-id="266:13249"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr(
                    'Share a survey with your customers to start collecting feedback. Every response will appear here, ready to explore.',
                  )}
                </p>
              </div>
              <div className="f95" data-node-id="266:13250" data-name="Recovery actions">
                <button
                  className="f96"
                  data-node-id="266:13251"
                  data-name="Action"
                  type="button"
                  onClick={() => ui.action('Share a survey')}
                >
                  <div className="f60" data-node-id="266:13252" data-name="send">
                    <img alt="" className="f5" src={imgSend} />
                  </div>
                  <p
                    className="f97"
                    data-node-id="266:13254"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Share a survey')}
                  </p>
                </button>
                <button
                  className="f98"
                  data-node-id="266:13255"
                  data-name="Action"
                  type="button"
                  onClick={() => ui.action('Create survey')}
                >
                  <p
                    className="f99"
                    data-node-id="266:13256"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Create survey')}
                  </p>
                </button>
              </div>
              <p
                className="f43"
                data-node-id="266:13257"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('Already shared? New responses appear automatically.')}
              </p>
            </div>
            <div className="f100" data-node-id="266:13258" data-name="Pagination">
              <p
                className="f34"
                data-node-id="266:13259"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('Showing 0 responses')}
              </p>
              <div className="f64" data-node-id="266:13260" data-name="Page controls">
                <div className="f101" data-node-id="266:13261" data-name="Disabled action">
                  <p
                    className="f61"
                    data-node-id="266:13262"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Previous')}
                  </p>
                </div>
                <div className="f101" data-node-id="266:13263" data-name="Disabled action">
                  <p
                    className="f61"
                    data-node-id="266:13264"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Next')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className="f102 product-section"
            data-node-id="266:13265"
            data-name="Getting started"
          >
            <div className="f103" data-node-id="266:13266" data-name="Getting started step">
              <div className="f104" data-node-id="266:13267" data-name="Step symbol">
                <div className="f17" data-node-id="266:13268" data-name="clipboard-list">
                  <img alt="" className="f5" src={imgClipboardList} />
                </div>
              </div>
              <div className="f105" data-node-id="266:13270" data-name="Step guidance">
                <p
                  className="f106"
                  data-node-id="266:13271"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Create your survey')}
                </p>
                <p
                  className="f107"
                  data-node-id="266:13272"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Ask what matters to your café.')}
                </p>
              </div>
            </div>
            <div className="f103" data-node-id="266:13273" data-name="Getting started step">
              <div className="f104" data-node-id="266:13274" data-name="Step symbol">
                <div className="f17" data-node-id="266:13275" data-name="qr-code">
                  <img alt="" className="f5" src={imgQrCode} />
                </div>
              </div>
              <div className="f105" data-node-id="266:13277" data-name="Step guidance">
                <p
                  className="f106"
                  data-node-id="266:13278"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Share it with customers')}
                </p>
                <p
                  className="f107"
                  data-node-id="266:13279"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Use a link or an in-store QR code.')}
                </p>
              </div>
            </div>
            <div className="f103" data-node-id="266:13280" data-name="Getting started step">
              <div className="f104" data-node-id="266:13281" data-name="Step symbol">
                <div
                  className="f17"
                  data-node-id="266:13282"
                  data-name="chart-no-axes-combined"
                  dir="ltr"
                >
                  <img alt="" className="f5" src={imgChartNoAxesCombined} />
                </div>
              </div>
              <div className="f105" data-node-id="266:13284" data-name="Step guidance">
                <p
                  className="f106"
                  data-node-id="266:13285"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Learn from every visit')}
                </p>
                <p
                  className="f107"
                  data-node-id="266:13286"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Explore sentiment and key aspects.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
