import React from 'react';
import { asset } from '../assets.js';
import { useProductView } from './ProductContext.jsx';
import './designs/overview.css';
import './product.css';
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

export default function FeedbackShell({ children, title = 'Feedbacks' }) {
  const ui = useProductView();
  const tr = ui.tr;
  return (
    <div className="product-view ds-overview feedback-shell">
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
            className={ui.activeDestination === 'Overview' ? 'f16' : 'f19'}
            data-node-id="127:275"
            data-name="Navigation item"
            aria-current={ui.activeDestination === 'Overview' ? 'page' : undefined}
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
              className={ui.activeDestination === 'Overview' ? 'f18' : 'f20'}
              data-node-id="127:278"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Overview')}
            </p>
          </button>
          <button
            className={ui.activeDestination === 'Feedbacks' ? 'f16' : 'f19'}
            data-node-id="127:279"
            data-name="Navigation item"
            aria-current={ui.activeDestination === 'Feedbacks' ? 'page' : undefined}
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
              className={ui.activeDestination === 'Feedbacks' ? 'f18' : 'f20'}
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
      <main className="product-workspace feedback-workspace" inert={ui.isMobile && ui.menuOpen}>
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
              {tr(title)}
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
        {children}
      </main>
    </div>
  );
}
