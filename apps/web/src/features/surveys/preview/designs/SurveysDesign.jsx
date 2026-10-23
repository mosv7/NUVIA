import ControlIcon from '../../../../components/ui/ControlIcon.jsx';
import { LanguageMenu } from '../../../../components/ui/ChoiceMenu.jsx';
import React from 'react';
import { asset } from '../../../../lib/assets.js';
import { useProductView } from '../../../../app/providers/ProductProvider.jsx';
import './surveys.css';
const imgLogo = asset('dashboard/surveys/logo.svg');
const imgChevronsUpDown = asset('dashboard/surveys/chevrons-up-down.svg');
const imgIcon = asset('dashboard/surveys/icon.svg');
const imgMessageSquare = asset('dashboard/surveys/message-square.svg');
const imgChartNoAxesCombined = asset('dashboard/surveys/chart-no-axes-combined.svg');
const imgFileChartColumn = asset('dashboard/surveys/file-chart-column.svg');
const imgIcon1 = asset('dashboard/surveys/icon1.svg');
const imgUsers = asset('dashboard/surveys/users.svg');
const imgSparkles = asset('dashboard/surveys/sparkles.svg');
const imgCreditCard = asset('dashboard/surveys/credit-card.svg');
const imgSettings = asset('dashboard/surveys/settings.svg');
const imgCircleHelp = asset('dashboard/surveys/circle-help.svg');
const imgIcon2 = asset('dashboard/surveys/icon2.svg');
const imgIcon3 = asset('dashboard/surveys/icon3.svg');
const imgIcon4 = asset('dashboard/surveys/icon4.svg');
const imgNotifications = asset('dashboard/surveys/notifications.svg');
const imgIcon5 = asset('dashboard/surveys/icon5.svg');
const imgDownload = asset('dashboard/surveys/download.svg');
const imgPlus = asset('dashboard/surveys/plus.svg');
const imgIcon6 = asset('dashboard/surveys/icon6.svg');
const imgRadio = asset('dashboard/surveys/radio.svg');
const imgIcon7 = asset('dashboard/surveys/icon7.svg');
const imgCircleCheck = asset('dashboard/surveys/circle-check.svg');
const imgIcon8 = asset('dashboard/surveys/icon8.svg');
const imgStore = asset('dashboard/surveys/store.svg');
const imgArrowDownWideNarrow = asset('dashboard/surveys/arrow-down-wide-narrow.svg');
const imgShare2 = asset('dashboard/surveys/share2.svg');
const imgPencil = asset('dashboard/surveys/pencil.svg');
const imgEllipsis = asset('dashboard/surveys/ellipsis.svg');
const imgIcon9 = asset('dashboard/surveys/icon9.svg');
const imgQrCode = asset('dashboard/surveys/qr-code.svg');
export default function SurveysDesign() {
  const ui = useProductView();
  const tr = ui.tr;
  return (
    <div className="f0 product-view ds-surveys" data-node-id="258:1329" data-name="Surveys">
      <div
        className="f1 product-navigation"
        data-node-id="258:1330"
        data-name="Product navigation"
        role="navigation"
        inert={ui.isMobile && !ui.menuOpen}
        aria-hidden={ui.isMobile && !ui.menuOpen}
      >
        <div className="f2" data-node-id="258:1331" data-name="NUVIA home">
          <div className="f3" data-node-id="258:1332" data-name="Brand mark">
            <div className="f4" data-node-id="258:1333" data-name="Logo">
              <img alt="" className="f5" src={imgLogo} />
            </div>
          </div>
          <p className="f6" data-node-id="258:1337">
            {tr('NUVIA')}
          </p>
        </div>
        <button
          className="f7"
          data-node-id="258:1338"
          data-name="Business switcher"
          type="button"
          onClick={() => ui.action('B Bloom & Co. Cafe &workspace')}
        >
          <div className="f8" data-node-id="258:1339" data-name="Business avatar">
            <p className="f9" data-node-id="258:1340">
              {tr('B')}
            </p>
          </div>
          <div className="f10" data-node-id="258:1341" data-name="Business">
            <p
              className="f11"
              data-node-id="258:1342"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Bloom & Co.')}
            </p>
            <p
              className="f12"
              data-node-id="258:1343"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Cafe &workspace')}
            </p>
          </div>
          <div className="f13" data-node-id="258:1344" data-name="chevrons-up-down">
            <img alt="" className="f5" src={imgChevronsUpDown} />
          </div>
        </button>
        <div className="f14" data-node-id="258:1346" data-name="Workspace destinations">
          <p
            className="f15"
            data-node-id="258:1347"
            style={{
              fontVariationSettings: '"opsz" 14',
            }}
          >
            {tr('WORKSPACE')}
          </p>
          <button
            className="f16"
            data-node-id="258:1815"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Overview')}
          >
            <div className="f17" data-node-id="258:1816" data-name="Icon">
              <img alt="" className="f5" src={imgIcon} />
            </div>
            <p
              className="f18"
              data-node-id="258:1818"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Overview')}
            </p>
          </button>
          <button
            className="f16"
            data-node-id="258:1352"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Feedbacks 12')}
          >
            <div className="f17" data-node-id="258:1353" data-name="message-square">
              <img alt="" className="f5" src={imgMessageSquare} />
            </div>
            <p
              className="f18"
              data-node-id="258:1355"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Feedbacks')}
            </p>
            <div className="f19" data-node-id="258:1356" data-name="Unread count">
              <p
                className="f20"
                data-node-id="258:1357"
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
            data-node-id="258:1358"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Analytics')}
          >
            <div
              className="f17"
              data-node-id="258:1359"
              data-name="chart-no-axes-combined"
              dir="ltr"
            >
              <img alt="" className="f5" src={imgChartNoAxesCombined} />
            </div>
            <p
              className="f18"
              data-node-id="258:1361"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Analytics')}
            </p>
          </button>
          <button
            className="f16"
            data-node-id="258:1362"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Reports')}
          >
            <div className="f17" data-node-id="258:1363" data-name="file-chart-column" dir="ltr">
              <img alt="" className="f5" src={imgFileChartColumn} />
            </div>
            <p
              className="f18"
              data-node-id="258:1365"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Reports')}
            </p>
          </button>
          <button
            className="f21"
            data-node-id="258:1810"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Surveys')}
          >
            <div className="f17" data-node-id="258:1811" data-name="Icon">
              <img alt="" className="f5" src={imgIcon1} />
            </div>
            <p
              className="f22"
              data-node-id="258:1813"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Surveys')}
            </p>
          </button>
          <button
            className="f16"
            data-node-id="258:1370"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Segments')}
          >
            <div className="f17" data-node-id="258:1371" data-name="users">
              <img alt="" className="f5" src={imgUsers} />
            </div>
            <p
              className="f18"
              data-node-id="258:1373"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Business')}
            </p>
          </button>
          <div className="f23" data-node-id="258:1374" data-name="Divider" />
          <button
            className="f16"
            data-node-id="258:1375"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('NUVIA Assistant')}
          >
            <div className="f17" data-node-id="258:1376" data-name="sparkles">
              <img alt="" className="f5" src={imgSparkles} />
            </div>
            <p
              className="f18"
              data-node-id="258:1378"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('NUVIA Assistant')}
            </p>
          </button>
        </div>
        <div className="f24" data-node-id="258:1379" data-name="Flexible space" />
        <div className="f25" data-node-id="258:1380" data-name="Account destinations">
          <button
            className="f16"
            data-node-id="258:1381"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Subscription')}
          >
            <div className="f17" data-node-id="258:1382" data-name="credit-card">
              <img alt="" className="f5" src={imgCreditCard} />
            </div>
            <p
              className="f18"
              data-node-id="258:1384"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Subscription')}
            </p>
          </button>
          <button
            className="f16"
            data-node-id="258:1385"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Settings')}
          >
            <div className="f17" data-node-id="258:1386" data-name="settings">
              <img alt="" className="f5" src={imgSettings} />
            </div>
            <p
              className="f18"
              data-node-id="258:1388"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Settings')}
            </p>
          </button>
        </div>
        <div className="f26" data-node-id="258:1389" data-name="Plan usage">
          <div className="f27" data-node-id="258:1390" data-name="Plan">
            <p
              className="f28"
              data-node-id="258:1391"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Growth plan')}
            </p>
            <p
              className="f29"
              data-node-id="258:1392"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Active')}
            </p>
          </div>
          <p
            className="f30"
            data-node-id="258:1393"
            style={{
              fontVariationSettings: '"opsz" 14',
            }}
          >
            {tr('1,248 / 5,000 responses')}
          </p>
          <div className="f31" data-node-id="258:1394" data-name="Usage track">
            <div className="f32" data-node-id="258:1395" data-name="Usage progress" />
          </div>
          <button
            className="f33"
            data-node-id="258:1396"
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
          data-node-id="258:1397"
          data-name="Help"
          type="button"
          onClick={() => ui.action('Help center')}
        >
          <div className="f35" data-node-id="258:1398" data-name="circle-help">
            <img alt="" className="f5" src={imgCircleHelp} />
          </div>
          <p
            className="f36"
            data-node-id="258:1400"
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
        data-node-id="258:1820"
        data-name="Workspace"
        inert={ui.isMobile && ui.menuOpen}
      >
        <div className="f38 product-topbar" data-node-id="258:1821" data-name="Workspace header">
          <div className="f39" data-node-id="258:1822" data-name="Breadcrumb">
            <p
              className="f40"
              data-node-id="258:1823"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Bloom & Co.')}
            </p>
            <p className="f41" data-node-id="258:1824">
              {tr('/')}
            </p>
            <p
              className="f42"
              data-node-id="258:1825"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Surveys')}
            </p>
          </div>
          <div className="f43" data-node-id="258:1826" data-name="Header actions">
            <div className="f44" data-node-id="258:1827" data-name="Search">
              <div className="f13" data-node-id="258:1828" data-name="Icon">
                <img alt="" className="f5" src={imgIcon2} />
              </div>
              <input
                className="f45"
                data-node-id="258:1830"
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
                data-node-id="258:1831"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('⌘ K')}
              </p>
            </div>
            <div className="f47" data-node-id="258:1832" data-name="Language">
              <div className="f35" data-node-id="258:1833" data-name="Icon">
                <img alt="" className="f5" src={imgIcon3} />
              </div>
              <LanguageMenu iconOnly={ui.isMobile} value={ui.language} onChange={ui.setLanguage} />
              <div className="f48" data-node-id="258:1836" data-name="Icon">
                <img alt="" className="f5" src={imgIcon4} />
              </div>
            </div>
            <div className="f49" data-node-id="258:1838" data-name="Notifications">
              <img alt="" className="f5" src={imgNotifications} />
            </div>
            <div className="f50" data-node-id="258:1842" data-name="Divider" />
            <button
              className="f51"
              data-node-id="258:1843"
              data-name="Profile"
              type="button"
              onClick={() => ui.action('SA Sara Ahmed Workspace owner')}
            >
              <div className="f52" data-node-id="258:1844" data-name="Avatar">
                <p
                  className="f53"
                  data-node-id="258:1845"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('SA')}
                </p>
              </div>
              <div className="f54" data-node-id="258:1846" data-name="Account">
                <p
                  className="f55"
                  data-node-id="258:1847"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Sara Ahmed')}
                </p>
                <p
                  className="f12"
                  data-node-id="258:1848"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Workspace owner')}
                </p>
              </div>
              <div className="f56" data-node-id="258:1849" data-name="Icon">
                <img alt="" className="f5" src={imgIcon5} />
              </div>
            </button>
          </div>
        </div>
        <div className="f57 product-content" data-node-id="258:1851" data-name="Survey content">
          <div
            className="f58 product-section"
            data-node-id="258:1853"
            data-name="Heading and actions"
          >
            <div className="f59" data-node-id="258:1854" data-name="Page heading">
              <div className="f60" data-node-id="258:1855" data-name="Title and status">
                <p className="f61" data-node-id="258:1856">
                  {tr('Manage surveys')}
                </p>
              </div>
              <p
                className="f62"
                data-node-id="258:1857"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('Create, manage and share feedback across your branches.')}
              </p>
            </div>
            <div className="f51" data-node-id="258:1858" data-name="Page actions">
              <button
                className="f63 ui-control ui-export"
                data-node-id="258:1859"
                data-name="Action"
                type="button"
                onClick={() => ui.action('Export')}
              >
                <div className="f35" data-node-id="258:1860" data-name="download">
                  <ControlIcon name="export" />
                </div>
                <p
                  className="f64"
                  data-node-id="258:1862"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Export')}
                </p>
              </button>
              <button
                className="f65"
                data-node-id="258:1863"
                data-name="Action"
                type="button"
                onClick={() => ui.action('Create survey')}
              >
                <div className="f35" data-node-id="258:1864" data-name="plus">
                  <img alt="" className="f5" src={imgPlus} />
                </div>
                <p
                  className="f66"
                  data-node-id="258:1866"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Create survey')}
                </p>
              </button>
            </div>
          </div>
          <div className="f67 product-section" data-node-id="258:1867" data-name="Survey overview">
            <div className="f68 product-card" data-node-id="258:1868" data-name="Survey metric">
              <div className="f58" data-node-id="258:1869" data-name="Metric heading">
                <p
                  className="f36"
                  data-node-id="258:1870"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Total surveys')}
                </p>
                <div className="f69" data-node-id="258:1871" data-name="Icon">
                  <img alt="" className="f5" src={imgIcon6} />
                </div>
              </div>
              <div className="f70" data-node-id="258:1873" data-name="Metric value and context">
                <p
                  className="f71"
                  data-node-id="258:1874"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('6')}
                </p>
                <p
                  className="f72"
                  data-node-id="258:1875"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Across 3 branches')}
                </p>
              </div>
            </div>
            <div className="f68 product-card" data-node-id="258:1876" data-name="Survey metric">
              <div className="f58" data-node-id="258:1877" data-name="Metric heading">
                <p
                  className="f36"
                  data-node-id="258:1878"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Live surveys')}
                </p>
                <div className="f69" data-node-id="258:1879" data-name="radio">
                  <img alt="" className="f5" src={imgRadio} />
                </div>
              </div>
              <div className="f70" data-node-id="258:1881" data-name="Metric value and context">
                <p
                  className="f71"
                  data-node-id="258:1882"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('2')}
                </p>
                <p
                  className="f72"
                  data-node-id="258:1883"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Collecting feedback')}
                </p>
              </div>
            </div>
            <div className="f68 product-card" data-node-id="258:1884" data-name="Survey metric">
              <div className="f58" data-node-id="258:1885" data-name="Metric heading">
                <p
                  className="f36"
                  data-node-id="258:1886"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Responses this month')}
                </p>
                <div className="f69" data-node-id="258:1887" data-name="Icon">
                  <img alt="" className="f5" src={imgIcon7} />
                </div>
              </div>
              <div className="f70" data-node-id="258:1889" data-name="Metric value and context">
                <p
                  className="f71"
                  data-node-id="258:1890"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('1,248')}
                </p>
                <p
                  className="f72"
                  data-node-id="258:1891"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('↑ 18.2%')}
                </p>
              </div>
            </div>
            <div className="f68 product-card" data-node-id="258:1892" data-name="Survey metric">
              <div className="f58" data-node-id="258:1893" data-name="Metric heading">
                <p
                  className="f36"
                  data-node-id="258:1894"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Completion rate')}
                </p>
                <div className="f69" data-node-id="258:1895" data-name="circle-check">
                  <img alt="" className="f5" src={imgCircleCheck} />
                </div>
              </div>
              <div className="f70" data-node-id="258:1897" data-name="Metric value and context">
                <p
                  className="f71"
                  data-node-id="258:1898"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('86%')}
                </p>
                <p
                  className="f72"
                  data-node-id="258:1899"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('↑ 4 pts this month')}
                </p>
              </div>
            </div>
          </div>
          <div
            className="f73 product-section product-card"
            data-node-id="258:1900"
            data-name="Survey management"
          >
            <div className="f74" data-node-id="258:1901" data-name="Status filters">
              <button
                className="f75"
                data-node-id="258:1902"
                data-name="Status tab"
                type="button"
                onClick={() => ui.action('All surveys  6')}
              >
                <p
                  className="f76"
                  data-node-id="258:1903"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('All surveys  6')}
                </p>
                <div className="f77" data-node-id="258:1904" data-name="Active indicator" />
              </button>
              <button
                className="f75"
                data-node-id="258:1905"
                data-name="Status tab"
                type="button"
                onClick={() => ui.action('Live  2')}
              >
                <p
                  className="f78"
                  data-node-id="258:1906"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Live  2')}
                </p>
                <div className="f79" data-node-id="258:1907" data-name="Active indicator" />
              </button>
              <button
                className="f75"
                data-node-id="258:1908"
                data-name="Status tab"
                type="button"
                onClick={() => ui.action('Drafts  2')}
              >
                <p
                  className="f78"
                  data-node-id="258:1909"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Drafts  2')}
                </p>
                <div className="f79" data-node-id="258:1910" data-name="Active indicator" />
              </button>
              <button
                className="f75"
                data-node-id="258:1911"
                data-name="Status tab"
                type="button"
                onClick={() => ui.action('Paused  1')}
              >
                <p
                  className="f78"
                  data-node-id="258:1912"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Paused  1')}
                </p>
                <div className="f79" data-node-id="258:1913" data-name="Active indicator" />
              </button>
              <button
                className="f75"
                data-node-id="258:1914"
                data-name="Status tab"
                type="button"
                onClick={() => ui.action('Closed  1')}
              >
                <p
                  className="f78"
                  data-node-id="258:1915"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Closed  1')}
                </p>
                <div className="f79" data-node-id="258:1916" data-name="Active indicator" />
              </button>
            </div>
            <div className="f80" data-node-id="258:1917" data-name="Search and filters">
              <div className="f81" data-node-id="258:1918" data-name="Survey search">
                <div className="f35" data-node-id="258:1919" data-name="Icon">
                  <img alt="" className="f5" src={imgIcon8} />
                </div>
                <input
                  className="f82"
                  data-node-id="258:1921"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                  aria-label={tr('Search surveys by name...')}
                  placeholder={tr('Search surveys by name...')}
                  value={ui.query}
                  onChange={(event) => ui.setQuery(event.target.value)}
                />
              </div>
              <div className="f83" data-node-id="258:1922" data-name="Filters">
                <button
                  className="f84"
                  data-node-id="258:1923"
                  data-name="Action"
                  type="button"
                  onClick={() => ui.action('All 3 branches')}
                >
                  <div className="f35" data-node-id="258:1924" data-name="store">
                    <img alt="" className="f5" src={imgStore} />
                  </div>
                  <p
                    className="f85"
                    data-node-id="258:1926"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('All 3 branches')}
                  </p>
                </button>
                <button
                  className="f84"
                  data-node-id="258:1927"
                  data-name="Action"
                  type="button"
                  onClick={() => ui.action('Last updated')}
                >
                  <div className="f35" data-node-id="258:1928" data-name="arrow-down-wide-narrow">
                    <img alt="" className="f5" src={imgArrowDownWideNarrow} />
                  </div>
                  <p
                    className="f85"
                    data-node-id="258:1930"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Last updated')}
                  </p>
                </button>
              </div>
            </div>
            <div className="f86" data-node-id="258:1931" data-name="Table headings">
              <button
                className="f87"
                data-node-id="258:1932"
                data-name="Select all"
                type="button"
                role="checkbox"
                aria-checked={ui.checked['258:1932'] ?? false}
                aria-label={tr('Select all')}
                onClick={() => ui.toggleCheck('258:1932', false)}
              />

              <p
                className="f88"
                data-node-id="258:1933"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('SURVEY NAME')}
              </p>
              <p
                className="f89"
                data-node-id="258:1934"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('STATUS')}
              </p>
              <p
                className="f90"
                data-node-id="258:1935"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('BRANCHES')}
              </p>
              <p
                className="f91"
                data-node-id="258:1936"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('RESPONSES')}
              </p>
              <p
                className="f92"
                data-node-id="258:1937"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('UPDATED')}
              </p>
              <p
                className="f93"
                data-node-id="258:1938"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('ACTIONS')}
              </p>
            </div>
            <div
              className="f94"
              data-node-id="258:1939"
              data-name="Survey row"
              hidden={
                !!ui.query &&
                !ui.matches(
                  'Customer experience survey 6 questions · Arabic & English Live All 3 branches 1,248 Today, 10:42 Share',
                )
              }
            >
              <button
                className="f87"
                data-node-id="258:1940"
                data-name="Select survey"
                type="button"
                role="checkbox"
                aria-checked={ui.checked['258:1940'] ?? false}
                aria-label={tr('Select survey')}
                onClick={() => ui.toggleCheck('258:1940', false)}
              />

              <div className="f95" data-node-id="258:1941" data-name="Survey information">
                <div className="f96" data-node-id="258:1942" data-name="Survey symbol">
                  <div className="f17" data-node-id="258:1943" data-name="Icon">
                    <img alt="" className="f5" src={imgIcon1} />
                  </div>
                </div>
                <div className="f97" data-node-id="258:1945" data-name="Survey details">
                  <p
                    className="f98"
                    data-node-id="258:1946"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Customer experience survey')}
                  </p>
                  <p
                    className="f99"
                    data-node-id="258:1947"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('6 questions · Arabic & English')}
                  </p>
                </div>
              </div>
              <div className="f100" data-node-id="258:1948" data-name="Survey status">
                <div className="f101" data-node-id="258:1949" data-name="Status">
                  <p
                    className="f102"
                    data-node-id="258:1950"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Live')}
                  </p>
                </div>
              </div>
              <p
                className="f103"
                data-node-id="258:1951"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('All 3 branches')}
              </p>
              <p
                className="f104"
                data-node-id="258:1952"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('1,248')}
              </p>
              <p
                className="f105"
                data-node-id="258:1953"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('Today, 10:42')}
              </p>
              <div className="f106" data-node-id="258:1954" data-name="Management actions">
                <button
                  className="f84"
                  data-node-id="258:1955"
                  data-name="Action"
                  type="button"
                  onClick={() => ui.action('Share')}
                >
                  <div className="f35" data-node-id="258:1956" data-name="share-2">
                    <img alt="" className="f5" src={imgShare2} />
                  </div>
                  <p
                    className="f85"
                    data-node-id="258:1958"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Share')}
                  </p>
                </button>
                <div className="f35" data-node-id="258:1959" data-name="pencil">
                  <img alt="" className="f5" src={imgPencil} />
                </div>
                <div className="f17" data-node-id="258:1961" data-name="ellipsis">
                  <img alt="" className="f5" src={imgEllipsis} />
                </div>
              </div>
            </div>
            <div
              className="f107"
              data-node-id="258:1963"
              data-name="Survey row"
              hidden={
                !!ui.query &&
                !ui.matches(
                  'Quick satisfaction check 3 questions · Arabic & English Live Cairo 326 8 Oct, 2026 Share',
                )
              }
            >
              <button
                className="f87"
                data-node-id="258:1964"
                data-name="Select survey"
                type="button"
                role="checkbox"
                aria-checked={ui.checked['258:1964'] ?? false}
                aria-label={tr('Select survey')}
                onClick={() => ui.toggleCheck('258:1964', false)}
              />

              <div className="f95" data-node-id="258:1965" data-name="Survey information">
                <div className="f96" data-node-id="258:1966" data-name="Survey symbol">
                  <div className="f17" data-node-id="258:1967" data-name="Icon">
                    <img alt="" className="f5" src={imgIcon1} />
                  </div>
                </div>
                <div className="f97" data-node-id="258:1969" data-name="Survey details">
                  <p
                    className="f108"
                    data-node-id="258:1970"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Quick satisfaction check')}
                  </p>
                  <p
                    className="f99"
                    data-node-id="258:1971"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('3 questions · Arabic & English')}
                  </p>
                </div>
              </div>
              <div className="f100" data-node-id="258:1972" data-name="Survey status">
                <div className="f101" data-node-id="258:1973" data-name="Status">
                  <p
                    className="f102"
                    data-node-id="258:1974"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Live')}
                  </p>
                </div>
              </div>
              <p
                className="f103"
                data-node-id="258:1975"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('Cairo')}
              </p>
              <p
                className="f104"
                data-node-id="258:1976"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('326')}
              </p>
              <p
                className="f105"
                data-node-id="258:1977"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('8 Oct, 2026')}
              </p>
              <div className="f106" data-node-id="258:1978" data-name="Management actions">
                <button
                  className="f84"
                  data-node-id="258:1979"
                  data-name="Action"
                  type="button"
                  onClick={() => ui.action('Share')}
                >
                  <div className="f35" data-node-id="258:1980" data-name="share-2">
                    <img alt="" className="f5" src={imgShare2} />
                  </div>
                  <p
                    className="f85"
                    data-node-id="258:1982"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Share')}
                  </p>
                </button>
                <div className="f35" data-node-id="258:1983" data-name="pencil">
                  <img alt="" className="f5" src={imgPencil} />
                </div>
                <div className="f17" data-node-id="258:1985" data-name="ellipsis">
                  <img alt="" className="f5" src={imgEllipsis} />
                </div>
              </div>
            </div>
            <div
              className="f107"
              data-node-id="258:1987"
              data-name="Survey row"
              hidden={
                !!ui.query &&
                !ui.matches(
                  'Seasonal menu feedback 5 questions · Arabic & English Draft All 3 branches — 7 Oct, 2026 Continue editing',
                )
              }
            >
              <button
                className="f87"
                data-node-id="258:1988"
                data-name="Select survey"
                type="button"
                role="checkbox"
                aria-checked={ui.checked['258:1988'] ?? false}
                aria-label={tr('Select survey')}
                onClick={() => ui.toggleCheck('258:1988', false)}
              />

              <div className="f95" data-node-id="258:1989" data-name="Survey information">
                <div className="f96" data-node-id="258:1990" data-name="Survey symbol">
                  <div className="f17" data-node-id="258:1991" data-name="Icon">
                    <img alt="" className="f5" src={imgIcon1} />
                  </div>
                </div>
                <div className="f97" data-node-id="258:1993" data-name="Survey details">
                  <p
                    className="f108"
                    data-node-id="258:1994"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Seasonal menu feedback')}
                  </p>
                  <p
                    className="f99"
                    data-node-id="258:1995"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('5 questions · Arabic & English')}
                  </p>
                </div>
              </div>
              <div className="f100" data-node-id="258:1996" data-name="Survey status">
                <div className="f109" data-node-id="258:1997" data-name="Status">
                  <p
                    className="f110"
                    data-node-id="258:1998"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Draft')}
                  </p>
                </div>
              </div>
              <p
                className="f103"
                data-node-id="258:1999"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('All 3 branches')}
              </p>
              <p
                className="f104"
                data-node-id="258:2000"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('—')}
              </p>
              <p
                className="f105"
                data-node-id="258:2001"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('7 Oct, 2026')}
              </p>
              <div className="f106" data-node-id="258:2002" data-name="Management actions">
                <button
                  className="f111"
                  data-node-id="258:2003"
                  data-name="Action"
                  type="button"
                  onClick={() => ui.action('Continue editing')}
                >
                  <p
                    className="f85"
                    data-node-id="258:2004"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Continue editing')}
                  </p>
                </button>
                <div className="f17" data-node-id="258:2005" data-name="ellipsis">
                  <img alt="" className="f5" src={imgEllipsis} />
                </div>
              </div>
            </div>
            <div
              className="f107"
              data-node-id="258:2007"
              data-name="Survey row"
              hidden={
                !!ui.query &&
                !ui.matches(
                  'New branch welcome 4 questions · Arabic & English Draft Alex — 6 Oct, 2026 Continue editing',
                )
              }
            >
              <button
                className="f87"
                data-node-id="258:2008"
                data-name="Select survey"
                type="button"
                role="checkbox"
                aria-checked={ui.checked['258:2008'] ?? false}
                aria-label={tr('Select survey')}
                onClick={() => ui.toggleCheck('258:2008', false)}
              />

              <div className="f95" data-node-id="258:2009" data-name="Survey information">
                <div className="f96" data-node-id="258:2010" data-name="Survey symbol">
                  <div className="f17" data-node-id="258:2011" data-name="Icon">
                    <img alt="" className="f5" src={imgIcon1} />
                  </div>
                </div>
                <div className="f97" data-node-id="258:2013" data-name="Survey details">
                  <p
                    className="f108"
                    data-node-id="258:2014"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('New branch welcome')}
                  </p>
                  <p
                    className="f99"
                    data-node-id="258:2015"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('4 questions · Arabic & English')}
                  </p>
                </div>
              </div>
              <div className="f100" data-node-id="258:2016" data-name="Survey status">
                <div className="f109" data-node-id="258:2017" data-name="Status">
                  <p
                    className="f110"
                    data-node-id="258:2018"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Draft')}
                  </p>
                </div>
              </div>
              <p
                className="f103"
                data-node-id="258:2019"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('Alex')}
              </p>
              <p
                className="f104"
                data-node-id="258:2020"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('—')}
              </p>
              <p
                className="f105"
                data-node-id="258:2021"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('6 Oct, 2026')}
              </p>
              <div className="f106" data-node-id="258:2022" data-name="Management actions">
                <button
                  className="f111"
                  data-node-id="258:2023"
                  data-name="Action"
                  type="button"
                  onClick={() => ui.action('Continue editing')}
                >
                  <p
                    className="f85"
                    data-node-id="258:2024"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Continue editing')}
                  </p>
                </button>
                <div className="f17" data-node-id="258:2025" data-name="ellipsis">
                  <img alt="" className="f5" src={imgEllipsis} />
                </div>
              </div>
            </div>
            <div
              className="f107"
              data-node-id="258:2027"
              data-name="Survey row"
              hidden={
                !!ui.query &&
                !ui.matches(
                  'Coffee & service check-in 4 questions · Arabic & English Paused El Zamalek 124 3 Oct, 2026 View results',
                )
              }
            >
              <button
                className="f87"
                data-node-id="258:2028"
                data-name="Select survey"
                type="button"
                role="checkbox"
                aria-checked={ui.checked['258:2028'] ?? false}
                aria-label={tr('Select survey')}
                onClick={() => ui.toggleCheck('258:2028', false)}
              />

              <div className="f95" data-node-id="258:2029" data-name="Survey information">
                <div className="f96" data-node-id="258:2030" data-name="Survey symbol">
                  <div className="f17" data-node-id="258:2031" data-name="Icon">
                    <img alt="" className="f5" src={imgIcon1} />
                  </div>
                </div>
                <div className="f97" data-node-id="258:2033" data-name="Survey details">
                  <p
                    className="f108"
                    data-node-id="258:2034"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Coffee & service check-in')}
                  </p>
                  <p
                    className="f99"
                    data-node-id="258:2035"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('4 questions · Arabic & English')}
                  </p>
                </div>
              </div>
              <div className="f100" data-node-id="258:2036" data-name="Survey status">
                <div className="f112" data-node-id="258:2037" data-name="Status">
                  <p
                    className="f113"
                    data-node-id="258:2038"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Paused')}
                  </p>
                </div>
              </div>
              <p
                className="f103"
                data-node-id="258:2039"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('El Zamalek')}
              </p>
              <p
                className="f104"
                data-node-id="258:2040"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('124')}
              </p>
              <p
                className="f105"
                data-node-id="258:2041"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('3 Oct, 2026')}
              </p>
              <div className="f106" data-node-id="258:2042" data-name="Management actions">
                <button
                  className="f84"
                  data-node-id="258:2043"
                  data-name="Action"
                  type="button"
                  onClick={() => ui.action('View results')}
                >
                  <div className="f35" data-node-id="258:2044" data-name="Icon">
                    <img alt="" className="f5" src={imgIcon9} />
                  </div>
                  <p
                    className="f85"
                    data-node-id="258:2046"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('View results')}
                  </p>
                </button>
                <div className="f35" data-node-id="258:2047" data-name="pencil">
                  <img alt="" className="f5" src={imgPencil} />
                </div>
                <div className="f17" data-node-id="258:2049" data-name="ellipsis">
                  <img alt="" className="f5" src={imgEllipsis} />
                </div>
              </div>
            </div>
            <div
              className="f107"
              data-node-id="258:2051"
              data-name="Survey row"
              hidden={
                !!ui.query &&
                !ui.matches(
                  'Summer customer pulse 6 questions · Arabic & English Closed All 3 branches 842 30 Sep, 2026 View results',
                )
              }
            >
              <button
                className="f87"
                data-node-id="258:2052"
                data-name="Select survey"
                type="button"
                role="checkbox"
                aria-checked={ui.checked['258:2052'] ?? false}
                aria-label={tr('Select survey')}
                onClick={() => ui.toggleCheck('258:2052', false)}
              />

              <div className="f95" data-node-id="258:2053" data-name="Survey information">
                <div className="f96" data-node-id="258:2054" data-name="Survey symbol">
                  <div className="f17" data-node-id="258:2055" data-name="Icon">
                    <img alt="" className="f5" src={imgIcon1} />
                  </div>
                </div>
                <div className="f97" data-node-id="258:2057" data-name="Survey details">
                  <p
                    className="f108"
                    data-node-id="258:2058"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Summer customer pulse')}
                  </p>
                  <p
                    className="f99"
                    data-node-id="258:2059"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('6 questions · Arabic & English')}
                  </p>
                </div>
              </div>
              <div className="f100" data-node-id="258:2060" data-name="Survey status">
                <div className="f109" data-node-id="258:2061" data-name="Status">
                  <p
                    className="f110"
                    data-node-id="258:2062"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Closed')}
                  </p>
                </div>
              </div>
              <p
                className="f103"
                data-node-id="258:2063"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('All 3 branches')}
              </p>
              <p
                className="f104"
                data-node-id="258:2064"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('842')}
              </p>
              <p
                className="f105"
                data-node-id="258:2065"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('30 Sep, 2026')}
              </p>
              <div className="f106" data-node-id="258:2066" data-name="Management actions">
                <button
                  className="f84"
                  data-node-id="258:2067"
                  data-name="Action"
                  type="button"
                  onClick={() => ui.action('View results')}
                >
                  <div className="f35" data-node-id="258:2068" data-name="Icon">
                    <img alt="" className="f5" src={imgIcon9} />
                  </div>
                  <p
                    className="f85"
                    data-node-id="258:2070"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('View results')}
                  </p>
                </button>
                <div className="f35" data-node-id="258:2071" data-name="pencil">
                  <img alt="" className="f5" src={imgPencil} />
                </div>
                <div className="f17" data-node-id="258:2073" data-name="ellipsis">
                  <img alt="" className="f5" src={imgEllipsis} />
                </div>
              </div>
            </div>
            <div className="f114" data-node-id="258:2075" data-name="Pagination">
              <p
                className="f36"
                data-node-id="258:2076"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('Showing 1–6 of 6 surveys')}
              </p>
              <div className="f115" data-node-id="258:2077" data-name="Page controls">
                <p
                  className="f82"
                  data-node-id="258:2078"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('← Previous')}
                </p>
                <div className="f116" data-node-id="258:2079" data-name="Current page">
                  <p
                    className="f117"
                    data-node-id="258:2080"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('1')}
                  </p>
                </div>
                <button
                  className="f82"
                  data-node-id="258:2081"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                  type="button"
                  onClick={() => ui.action('Next →')}
                >
                  {tr('Next →')}
                </button>
              </div>
            </div>
          </div>
          <div className="f118 product-section" data-node-id="258:2082" data-name="Collection tip">
            <div className="f119" data-node-id="258:2083" data-name="Tip symbol">
              <div className="f120" data-node-id="258:2084" data-name="qr-code">
                <img alt="" className="f5" src={imgQrCode} />
              </div>
            </div>
            <div className="f121" data-node-id="258:2086" data-name="Tip">
              <p
                className="f11"
                data-node-id="258:2087"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('Bring feedback to every table')}
              </p>
              <p
                className="f122"
                data-node-id="258:2088"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr(
                  'Share a branch-specific QR code to see exactly where each response comes from.',
                )}
              </p>
            </div>
            <button
              className="f117"
              data-node-id="258:2089"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
              type="button"
              onClick={() => ui.action('Share your live survey →')}
            >
              {tr('Share your live survey →')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
