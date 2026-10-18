import OriginalAssistant from './OriginalAssistant.jsx';
import React, { useEffect, useState } from 'react';
import './figma-overview.css';
const imgLogo = '/assets/dashboard/overview/logo.svg';
const imgChevronsUpDown = '/assets/figma-overview/imgChevronsUpDown.svg';
const imgLayoutDashboard = '/assets/figma-overview/imgLayoutDashboard.svg';
const imgMessageSquare = '/assets/figma-overview/imgMessageSquare.svg';
const imgChartNoAxesCombined = '/assets/figma-overview/imgChartNoAxesCombined.svg';
const imgFileChartColumn = '/assets/figma-overview/imgFileChartColumn.svg';
const imgClipboardList = '/assets/figma-overview/imgClipboardList.svg';
const imgUsers = '/assets/figma-overview/imgUsers.svg';
const imgSparkles = '/assets/figma-overview/imgSparkles.svg';
const imgCreditCard = '/assets/figma-overview/imgCreditCard.svg';
const imgSettings = '/assets/figma-overview/imgSettings.svg';
const imgCircleHelp = '/assets/figma-overview/imgCircleHelp.svg';
const imgSearch = '/assets/figma-overview/imgSearch.svg';
const imgGlobe = '/assets/figma-overview/imgGlobe.svg';
const imgChevronDown = '/assets/figma-overview/imgChevronDown.svg';
const imgNotifications = '/assets/figma-overview/imgNotifications.svg';
const imgStore = '/assets/figma-overview/imgStore.svg';
const imgChevronDown1 = '/assets/figma-overview/imgChevronDown1.svg';
const imgCalendarDays = '/assets/figma-overview/imgCalendarDays.svg';
const imgDownload = '/assets/dashboard/overview/download-export.svg';
const imgPlus = '/assets/figma-overview/imgPlus.svg';
const imgMessageSquare1 = '/assets/dashboard/overview/message-square1.svg';
const imgSmile = '/assets/dashboard/overview/smile-metric.svg';
const imgStar = '/assets/dashboard/overview/star-metric.svg';
const imgCircleCheck = '/assets/dashboard/overview/circle-check-metric.svg';
const imgLegendMark = '/assets/figma-overview/imgLegendMark.svg';
const imgLegendMark1 = '/assets/figma-overview/imgLegendMark1.svg';
const imgSentimentPoint = '/assets/figma-overview/imgSentimentPoint.svg';
const imgSentimentTrend = '/assets/figma-overview/imgSentimentTrend.svg';
const imgNegativeArc = '/assets/figma-overview/imgNegativeArc.svg';
const imgNeutralArc = '/assets/figma-overview/imgNeutralArc.svg';
const imgPositiveArc = '/assets/figma-overview/imgPositiveArc.svg';
const imgLegendMark2 = '/assets/figma-overview/imgLegendMark2.svg';
const imgLegendMark3 = '/assets/figma-overview/imgLegendMark3.svg';

const imgClock3 = '/assets/figma-overview/imgClock3.svg';
const imgTag = '/assets/figma-overview/imgTag.svg';
const imgHeartHandshake = '/assets/figma-overview/imgHeartHandshake.svg';
const imgListFilter = '/assets/figma-overview/imgListFilter.svg';
const imgSparkles1 = '/assets/figma-overview/imgSparkles1.svg';
const imgPlus1 = '/assets/figma-overview/imgPlus1.svg';
const imgSparkles2 = '/assets/figma-overview/imgSparkles2.svg';

export default function Overview() {
  const [scale, setScale] = useState(() => Math.min(1, window.innerWidth / 1440));
  useEffect(() => {
    const resize = () => setScale(Math.min(1, window.innerWidth / 1440));
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);
  return (
    <div style={{ width: '100%', height: 1901 * scale, position: 'relative' }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: 1440 }}>
        <OverviewContent />
      </div>
    </div>
  );
}
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

function OverviewContent() {
  const [assistantOpen, setAssistantOpen] = useState(false);
  return (
    <div className="figma-overview v0" data-node-id="325:5862" data-name="overview">
      <div className="v1" data-node-id="325:5863" data-name="Product navigation">
        <div className="v2" data-node-id="325:5864" data-name="NUVIA home">
          <div className="v3" data-node-id="325:5865" data-name="Brand mark">
            <div className="v4" data-node-id="325:5866" data-name="Logo">
              <img alt="" className="v5" src={imgLogo} />
            </div>
          </div>
          <p className="v6" data-node-id="325:5870">
            NUVIA
          </p>
        </div>
        <div className="v7" data-node-id="325:5871" data-name="Business switcher">
          <div className="v8" data-node-id="325:5872" data-name="Business avatar">
            <p className="v9" data-node-id="325:5873">
              B
            </p>
          </div>
          <div className="v10" data-node-id="325:5874" data-name="Business">
            <p
              className="v11"
              data-node-id="325:5875"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`Bloom & Co.`}</p>
            <p
              className="v12"
              data-node-id="325:5876"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`Cafe &workspace`}</p>
          </div>
          <div className="v13" data-node-id="325:5877" data-name="chevrons-up-down">
            <img alt="" className="v5" src={imgChevronsUpDown} />
          </div>
        </div>
        <div className="v14" data-node-id="325:5879" data-name="Workspace destinations">
          <p className="v15" data-node-id="325:5880" style={{ fontVariationSettings: '"opsz" 14' }}>
            WORKSPACE
          </p>
          <div className="v16" data-node-id="325:5881" data-name="Navigation item">
            <div className="v17" data-node-id="325:5882" data-name="layout-dashboard">
              <img alt="" className="v5" src={imgLayoutDashboard} />
            </div>
            <p
              className="v18"
              data-node-id="325:5884"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Overview
            </p>
          </div>
          <div className="v19" data-node-id="325:5885" data-name="Navigation item">
            <div className="v17" data-node-id="325:5886" data-name="message-square">
              <img alt="" className="v5" src={imgMessageSquare} />
            </div>
            <p
              className="v20"
              data-node-id="325:5888"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Feedbacks
            </p>
            <div className="v21" data-node-id="325:5889" data-name="Unread count">
              <p
                className="v22"
                data-node-id="325:5890"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                12
              </p>
            </div>
          </div>
          <div className="v19" data-node-id="325:5891" data-name="Navigation item">
            <div className="v17" data-node-id="325:5892" data-name="chart-no-axes-combined">
              <img alt="" className="v5" src={imgChartNoAxesCombined} />
            </div>
            <p
              className="v20"
              data-node-id="325:5894"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Analytics
            </p>
          </div>
          <div className="v19" data-node-id="325:5895" data-name="Navigation item">
            <div className="v17" data-node-id="325:5896" data-name="file-chart-column">
              <img alt="" className="v5" src={imgFileChartColumn} />
            </div>
            <p
              className="v20"
              data-node-id="325:5898"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Reports
            </p>
          </div>
          <div className="v19" data-node-id="325:5899" data-name="Navigation item">
            <div className="v17" data-node-id="325:5900" data-name="clipboard-list">
              <img alt="" className="v5" src={imgClipboardList} />
            </div>
            <p
              className="v20"
              data-node-id="325:5902"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Surveys
            </p>
          </div>
          <div className="v19" data-node-id="325:5903" data-name="Navigation item">
            <div className="v17" data-node-id="325:5904" data-name="users">
              <img alt="" className="v5" src={imgUsers} />
            </div>
            <p
              className="v23"
              data-node-id="325:5906"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{` Business & Teams`}</p>
          </div>
          <div className="v24" data-node-id="325:5907" data-name="Divider" />
          <div className="v19" data-node-id="325:5908" data-name="Navigation item">
            <div className="v17" data-node-id="325:5909" data-name="sparkles">
              <img alt="" className="v5" src={imgSparkles} />
            </div>
            <p
              className="v20"
              data-node-id="325:5911"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              NUVIA Assistant
            </p>
          </div>
        </div>
        <div className="v25" data-node-id="325:5912" data-name="Flexible space" />
        <div className="v26" data-node-id="325:5913" data-name="Account destinations">
          <div className="v19" data-node-id="325:5914" data-name="Navigation item">
            <div className="v17" data-node-id="325:5915" data-name="credit-card">
              <img alt="" className="v5" src={imgCreditCard} />
            </div>
            <p
              className="v20"
              data-node-id="325:5917"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Subscription
            </p>
          </div>
          <div className="v19" data-node-id="325:5918" data-name="Navigation item">
            <div className="v17" data-node-id="325:5919" data-name="settings">
              <img alt="" className="v5" src={imgSettings} />
            </div>
            <p
              className="v20"
              data-node-id="325:5921"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Settings
            </p>
          </div>
        </div>
        <div className="v27" data-node-id="325:5922" data-name="Plan usage">
          <div className="v28" data-node-id="325:5923" data-name="Plan">
            <p
              className="v29"
              data-node-id="325:5924"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Growth plan
            </p>
            <p
              className="v30"
              data-node-id="325:5925"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Active
            </p>
          </div>
          <p className="v31" data-node-id="325:5926" style={{ fontVariationSettings: '"opsz" 14' }}>
            1,248 / 5,000 responses
          </p>
          <div className="v32" data-node-id="325:5927" data-name="Usage track">
            <div className="v33" data-node-id="325:5928" data-name="Usage progress" />
          </div>
          <p className="v34" data-node-id="325:5929" style={{ fontVariationSettings: '"opsz" 14' }}>
            <DashboardArrowText text={'Manage subscription →'} />
          </p>
        </div>
        <div className="v35" data-node-id="325:5930" data-name="Help">
          <div className="v36" data-node-id="325:5931" data-name="circle-help">
            <img alt="" className="v5" src={imgCircleHelp} />
          </div>
          <p className="v37" data-node-id="325:5933" style={{ fontVariationSettings: '"opsz" 14' }}>
            Help center
          </p>
        </div>
      </div>
      <div className="v38" data-node-id="325:5934" data-name="Workspace">
        <div className="v39" data-node-id="325:5935" data-name="Workspace header">
          <div className="v40" data-node-id="325:5936" data-name="Breadcrumb">
            <p
              className="v41"
              data-node-id="325:5937"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`Bloom & Co.`}</p>
            <p className="v42" data-node-id="325:5938">
              /
            </p>
            <p
              className="v43"
              data-node-id="325:5939"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Overview
            </p>
          </div>
          <div className="v44" data-node-id="325:5940" data-name="Header actions">
            <div className="v45" data-node-id="325:5941" data-name="Search">
              <div className="v36" data-node-id="325:5942" data-name="search">
                <img alt="" className="v5" src={imgSearch} />
              </div>
              <p
                className="v46"
                data-node-id="325:5944"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Search your workspace
              </p>
              <p
                className="v47"
                data-node-id="325:5945"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                ⌘ K
              </p>
            </div>
            <div className="v48" data-node-id="325:5946" data-name="Language">
              <div className="v36" data-node-id="325:5947" data-name="globe">
                <img alt="" className="v5" src={imgGlobe} />
              </div>
              <p
                className="v37"
                data-node-id="325:5949"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                EN
              </p>
              <div className="v49" data-node-id="325:5950" data-name="chevron-down">
                <img alt="" className="v5" src={imgChevronDown} />
              </div>
            </div>
            <div className="v50" data-node-id="325:5952" data-name="Notifications">
              <img alt="" className="v5" src={imgNotifications} />
            </div>
            <div className="v51" data-node-id="325:5956" data-name="Divider" />
            <div className="v52" data-node-id="325:5957" data-name="Profile">
              <div className="v53" data-node-id="325:5958" data-name="Avatar">
                <p
                  className="v54"
                  data-node-id="325:5959"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  SA
                </p>
              </div>
              <div className="v55" data-node-id="325:5960" data-name="Account">
                <p
                  className="v56"
                  data-node-id="325:5961"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Sara Ahmed
                </p>
                <p
                  className="v12"
                  data-node-id="325:5962"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Workspace owner
                </p>
              </div>
              <div className="v49" data-node-id="325:5963" data-name="chevron-down">
                <img alt="" className="v5" src={imgChevronDown} />
              </div>
            </div>
          </div>
        </div>
        <div className="v57" data-node-id="325:5965" data-name="Overview content">
          <div className="v58" data-node-id="325:5966" data-name="Overview and key metrics">
            <div className="v59" data-node-id="325:5967" data-name="Overview introduction">
              <div className="v60" data-node-id="325:5968" data-name="Welcome">
                <p className="v61" data-node-id="325:5969">
                  Overview
                </p>
                <p
                  className="v62"
                  data-node-id="325:5970"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Welcome back, Sara. Here’s what your customers are telling you.
                </p>
              </div>
              <div className="v52" data-node-id="325:5971" data-name="Overview actions">
                <div className="v63" data-node-id="325:5972" data-name="Dashboard filter">
                  <div className="v36" data-node-id="325:5973" data-name="store">
                    <img alt="" className="v5" src={imgStore} />
                  </div>
                  <p
                    className="v64"
                    data-node-id="325:5975"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    All 3 branches
                  </p>
                  <div className="v13" data-node-id="325:5976" data-name="chevron-down">
                    <img alt="" className="v5" src={imgChevronDown1} />
                  </div>
                </div>
                <div className="v65" data-node-id="325:5978" data-name="Action">
                  <div className="v36" data-node-id="325:5979" data-name="calendar-days">
                    <img alt="" className="v5" src={imgCalendarDays} />
                  </div>
                  <p
                    className="v66"
                    data-node-id="325:5981"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    12 Sep – 9 Oct, 2026
                  </p>
                </div>
                <div className="v67" data-node-id="325:6289" data-name="Action">
                  <div className="v36" data-node-id="325:6290" data-name="download">
                    <img alt="" className="v5" src={imgDownload} />
                  </div>
                  <p
                    className="v68"
                    data-node-id="325:6292"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    Export report
                  </p>
                </div>
                <div className="v69" data-node-id="325:5986" data-name="Action">
                  <div className="v36" data-node-id="325:5987" data-name="plus">
                    <img alt="" className="v5" src={imgPlus} />
                  </div>
                  <p
                    className="v70"
                    data-node-id="325:5989"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    Upload file
                  </p>
                </div>
              </div>
            </div>
            <div className="v71" data-node-id="325:5990" data-name="Key metrics">
              <div className="v72" data-node-id="325:5991" data-name="Feedback metric">
                <div className="v59" data-node-id="325:5992" data-name="Metric heading">
                  <p
                    className="v37"
                    data-node-id="325:5993"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    Total responses
                  </p>
                  <div className="v36" data-node-id="325:5994" data-name="message-square">
                    <img alt="" className="v5" src={imgMessageSquare1} />
                  </div>
                </div>
                <div className="v73" data-node-id="325:5996" data-name="Metric value">
                  <p className="v74" data-node-id="325:5997">
                    1,248
                  </p>
                </div>
                <div className="v75" data-node-id="325:5998" data-name="Change">
                  <p
                    className="v76"
                    data-node-id="325:5999"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    <DashboardArrowText text={'↑ 18.2%'} />
                  </p>
                  <p
                    className="v12"
                    data-node-id="325:6000"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    vs. previous 28 days
                  </p>
                </div>
              </div>
              <div className="v72" data-node-id="325:6001" data-name="Feedback metric">
                <div className="v59" data-node-id="325:6002" data-name="Metric heading">
                  <p
                    className="v37"
                    data-node-id="325:6003"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    Positive sentiment
                  </p>
                  <div className="v36" data-node-id="325:6004" data-name="smile">
                    <img alt="" className="v5" src={imgSmile} />
                  </div>
                </div>
                <div className="v77" data-node-id="325:6006" data-name="Metric value">
                  <p className="v78" data-node-id="325:6007">
                    78
                  </p>
                  <p
                    className="v79"
                    data-node-id="325:6008"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    %
                  </p>
                </div>
                <div className="v75" data-node-id="325:6009" data-name="Change">
                  <p
                    className="v76"
                    data-node-id="325:6010"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    <DashboardArrowText text={'↑ 6 pts'} />
                  </p>
                  <p
                    className="v12"
                    data-node-id="325:6011"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    974 happy customers
                  </p>
                </div>
              </div>
              <div className="v72" data-node-id="325:6012" data-name="Feedback metric">
                <div className="v59" data-node-id="325:6013" data-name="Metric heading">
                  <p
                    className="v37"
                    data-node-id="325:6014"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    Customer satisfaction
                  </p>
                  <div className="v36" data-node-id="325:6015" data-name="star">
                    <img alt="" className="v5" src={imgStar} />
                  </div>
                </div>
                <div className="v77" data-node-id="325:6017" data-name="Metric value">
                  <p className="v78" data-node-id="325:6018">
                    4.6
                  </p>
                  <p
                    className="v79"
                    data-node-id="325:6019"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    / 5
                  </p>
                </div>
                <div className="v75" data-node-id="325:6020" data-name="Change">
                  <p
                    className="v76"
                    data-node-id="325:6021"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    <DashboardArrowText text={'↑ 0.3'} />
                  </p>
                  <p
                    className="v12"
                    data-node-id="325:6022"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    Average customer rating
                  </p>
                </div>
              </div>
              <div className="v72" data-node-id="325:6023" data-name="Feedback metric">
                <div className="v59" data-node-id="325:6024" data-name="Metric heading">
                  <p
                    className="v37"
                    data-node-id="325:6025"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    Completion rate
                  </p>
                  <div className="v36" data-node-id="325:6026" data-name="circle-check">
                    <img alt="" className="v5" src={imgCircleCheck} />
                  </div>
                </div>
                <div className="v77" data-node-id="325:6028" data-name="Metric value">
                  <p className="v78" data-node-id="325:6029">
                    86
                  </p>
                  <p
                    className="v79"
                    data-node-id="325:6030"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    %
                  </p>
                </div>
                <div className="v75" data-node-id="325:6031" data-name="Change">
                  <p
                    className="v76"
                    data-node-id="325:6032"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    <DashboardArrowText text={'↑ 4 pts'} />
                  </p>
                  <p
                    className="v12"
                    data-node-id="325:6033"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    Of 1,451 survey starts
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="v80" data-node-id="325:6034" data-name="Feedback trends">
            <div className="v81" data-node-id="325:6035" data-name="Response trends">
              <div className="v82" data-node-id="325:6036" data-name="Section heading">
                <div className="v83" data-node-id="325:6037" data-name="Heading">
                  <p className="v84" data-node-id="325:6038">{`Response & sentiment trends`}</p>
                  <p
                    className="v85"
                    data-node-id="325:6039"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    More voices. A more positive experience.
                  </p>
                </div>
                <p
                  className="v86"
                  data-node-id="325:6040"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  <DashboardArrowText text={'Analytics →'} />
                </p>
              </div>
              <div className="v87" data-node-id="325:6041" data-name="Chart key">
                <div className="v48" data-node-id="325:6042" data-name="Chart legend">
                  <div className="v88" data-node-id="325:6043" data-name="Legend mark">
                    <img alt="" className="v5" src={imgLegendMark} />
                  </div>
                  <p
                    className="v31"
                    data-node-id="325:6044"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    Responses
                  </p>
                </div>
                <div className="v48" data-node-id="325:6045" data-name="Chart legend">
                  <div className="v88" data-node-id="325:6046" data-name="Legend mark">
                    <img alt="" className="v5" src={imgLegendMark1} />
                  </div>
                  <p
                    className="v31"
                    data-node-id="325:6047"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    Positive sentiment
                  </p>
                </div>
              </div>
              <div className="v89" data-node-id="325:6048" data-name="Weekly trend chart">
                <div className="v90" data-node-id="325:6049" data-name="Response bar" />
                <div className="v91" data-node-id="325:6050" data-name="Response bar" />
                <div className="v92" data-node-id="325:6051" data-name="Response bar" />
                <div className="v93" data-node-id="325:6052" data-name="Response bar" />
                <div className="v94" data-node-id="325:6053" data-name="Sentiment point">
                  <img alt="" className="v5" src={imgSentimentPoint} />
                </div>
                <div className="v95" data-node-id="325:6054" data-name="Sentiment point">
                  <img alt="" className="v5" src={imgSentimentPoint} />
                </div>
                <div className="v96" data-node-id="325:6055" data-name="Sentiment point">
                  <img alt="" className="v5" src={imgSentimentPoint} />
                </div>
                <div className="v97" data-node-id="325:6056" data-name="Sentiment point">
                  <img alt="" className="v5" src={imgSentimentPoint} />
                </div>
                <div className="v98" data-node-id="325:6057" data-name="Sentiment trend">
                  <div className="v99">
                    <img alt="" className="v100" src={imgSentimentTrend} />
                  </div>
                </div>
                <p
                  className="v101"
                  data-node-id="325:6058"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  3–9 Oct
                </p>
                <p
                  className="v102"
                  data-node-id="325:6059"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  26 Sep–2 Oct
                </p>
                <p
                  className="v103"
                  data-node-id="325:6060"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  19–25 Sep
                </p>
                <p
                  className="v104"
                  data-node-id="325:6061"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  12–18 Sep
                </p>
                <p
                  className="v105"
                  data-node-id="325:6062"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  380
                </p>
                <p
                  className="v106"
                  data-node-id="325:6063"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  326
                </p>
                <p
                  className="v107"
                  data-node-id="325:6064"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  294
                </p>
                <p
                  className="v108"
                  data-node-id="325:6065"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  248
                </p>
                <div className="v109" data-node-id="325:6066" data-name="Response highlight" />
                <div className="v110" data-node-id="325:6067" data-name="Response highlight" />
                <div className="v111" data-node-id="325:6068" data-name="Response highlight" />
                <div className="v112" data-node-id="325:6069" data-name="Response highlight" />
                <p
                  className="v113"
                  data-node-id="325:6070"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  70%
                </p>
                <p
                  className="v114"
                  data-node-id="325:6071"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  75%
                </p>
                <p
                  className="v115"
                  data-node-id="325:6072"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  80%
                </p>
                <p
                  className="v116"
                  data-node-id="325:6073"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  0
                </p>
                <p
                  className="v117"
                  data-node-id="325:6074"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  200
                </p>
                <p
                  className="v118"
                  data-node-id="325:6075"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  400
                </p>
                <div className="v119" data-node-id="325:6076" data-name="Grid line" />
                <div className="v120" data-node-id="325:6077" data-name="Grid line" />
                <div className="v121" data-node-id="325:6078" data-name="Grid line" />
              </div>
            </div>
            <div className="v122" data-node-id="325:6079" data-name="Sentiment distribution">
              <div className="v59" data-node-id="325:6080" data-name="Section heading">
                <div className="v123" data-node-id="325:6081" data-name="Heading">
                  <p className="v84" data-node-id="325:6082">
                    How customers feel
                  </p>
                  <p
                    className="v85"
                    data-node-id="325:6083"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    Sentiment across 1,248 responses
                  </p>
                </div>
              </div>
              <div className="v124" data-node-id="325:6084" data-name="Sentiment breakdown">
                <div className="v125" data-node-id="325:6085" data-name="Sentiment donut">
                  <p
                    className="v126"
                    data-node-id="325:6086"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    Positive
                  </p>
                  <p className="v127" data-node-id="325:6087">
                    78%
                  </p>
                  <div className="v128" data-node-id="325:6088" data-name="Negative arc">
                    <div className="v129">
                      <img alt="" className="v100" src={imgNegativeArc} />
                    </div>
                  </div>
                  <div className="v128" data-node-id="325:6089" data-name="Neutral arc">
                    <div className="v130">
                      <img alt="" className="v100" src={imgNeutralArc} />
                    </div>
                  </div>
                  <div className="v128" data-node-id="325:6090" data-name="Positive arc">
                    <img alt="" className="v5" src={imgPositiveArc} />
                  </div>
                </div>
                <div className="v131" data-node-id="325:6091" data-name="Distribution values">
                  <div className="v132" data-node-id="325:6092" data-name="Sentiment category">
                    <div className="v88" data-node-id="325:6093" data-name="Legend mark">
                      <img alt="" className="v5" src={imgLegendMark} />
                    </div>
                    <div className="v133" data-node-id="325:6094" data-name="Category">
                      <p
                        className="v134"
                        data-node-id="325:6095"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        Positive
                      </p>
                      <p
                        className="v135"
                        data-node-id="325:6096"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        974 responses
                      </p>
                    </div>
                    <p
                      className="v136"
                      data-node-id="325:6097"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      78%
                    </p>
                  </div>
                  <div className="v132" data-node-id="325:6098" data-name="Sentiment category">
                    <div className="v88" data-node-id="325:6099" data-name="Legend mark">
                      <img alt="" className="v5" src={imgLegendMark2} />
                    </div>
                    <div className="v133" data-node-id="325:6100" data-name="Category">
                      <p
                        className="v134"
                        data-node-id="325:6101"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        Neutral
                      </p>
                      <p
                        className="v135"
                        data-node-id="325:6102"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        175 responses
                      </p>
                    </div>
                    <p
                      className="v136"
                      data-node-id="325:6103"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      14%
                    </p>
                  </div>
                  <div className="v132" data-node-id="325:6104" data-name="Sentiment category">
                    <div className="v88" data-node-id="325:6105" data-name="Legend mark">
                      <img alt="" className="v5" src={imgLegendMark3} />
                    </div>
                    <div className="v133" data-node-id="325:6106" data-name="Category">
                      <p
                        className="v134"
                        data-node-id="325:6107"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        Negative
                      </p>
                      <p
                        className="v135"
                        data-node-id="325:6108"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        99 responses
                      </p>
                    </div>
                    <p
                      className="v136"
                      data-node-id="325:6109"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      8%
                    </p>
                  </div>
                </div>
              </div>
              <div className="v137" data-node-id="325:6110" data-name="Sentiment change">
                <p
                  className="v138"
                  data-node-id="325:6111"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  <DashboardArrowText text={'↑ 6 pts more positive than the previous period'} />
                </p>
              </div>
            </div>
          </div>
          <div className="v139" data-node-id="325:6112" data-name="Daily priorities">
            <OriginalAssistant />
            <div className="v152" data-node-id="325:6129" data-name="Branches needing attention">
              <div className="v26" data-node-id="325:6130" data-name="Section heading">
                <div className="v59" data-node-id="325:6131" data-name="Title">
                  <p className="v153" data-node-id="325:6132">
                    Branches needing attention
                  </p>
                  <div className="v154" data-node-id="325:6133" data-name="Attention count">
                    <p
                      className="v155"
                      data-node-id="325:6134"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      1
                    </p>
                  </div>
                </div>
                <p
                  className="v31"
                  data-node-id="325:6135"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  September reviews · Positive share
                </p>
              </div>
              <div className="v156" data-node-id="325:6136" data-name="Branch comparison">
                <div className="v157" data-node-id="325:6137" data-name="Branch">
                  <div className="v158" data-node-id="325:6138" data-name="Branch details">
                    <p
                      className="v159"
                      data-node-id="325:6139"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      Cairo
                    </p>
                    <p
                      className="v160"
                      data-node-id="325:6140"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      500 reviews
                    </p>
                  </div>
                  <p
                    className="v161"
                    data-node-id="325:6141"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    62%
                  </p>
                  <div className="v162" data-node-id="325:6142" data-name="Branch status">
                    <p
                      className="v163"
                      data-node-id="325:6143"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      Needs attention
                    </p>
                  </div>
                </div>
                <div className="v157" data-node-id="325:6144" data-name="Branch">
                  <div className="v158" data-node-id="325:6145" data-name="Branch details">
                    <p
                      className="v159"
                      data-node-id="325:6146"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      El Zamalek
                    </p>
                    <p
                      className="v160"
                      data-node-id="325:6147"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      450 reviews
                    </p>
                  </div>
                  <p
                    className="v161"
                    data-node-id="325:6148"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    82%
                  </p>
                  <div className="v164" data-node-id="325:6149" data-name="Branch status">
                    <p
                      className="v165"
                      data-node-id="325:6150"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      Top performer
                    </p>
                  </div>
                </div>
                <div className="v157" data-node-id="325:6151" data-name="Branch">
                  <div className="v158" data-node-id="325:6152" data-name="Branch details">
                    <p
                      className="v159"
                      data-node-id="325:6153"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      Alex
                    </p>
                    <p
                      className="v160"
                      data-node-id="325:6154"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      300 reviews
                    </p>
                  </div>
                  <p
                    className="v161"
                    data-node-id="325:6155"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    74%
                  </p>
                  <div className="v166" data-node-id="325:6156" data-name="Branch status">
                    <p
                      className="v167"
                      data-node-id="325:6157"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      On track
                    </p>
                  </div>
                </div>
              </div>
              <div className="v168" data-node-id="325:6158" data-name="Comparison footer">
                <p
                  className="v12"
                  data-node-id="325:6159"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  3 branches · 1,250 reviews
                </p>
                <p
                  className="v151"
                  data-node-id="325:6160"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  <DashboardArrowText text={'Compare branches →'} />
                </p>
              </div>
            </div>
          </div>
          <div className="v169" data-node-id="325:6161" data-name="Evidence and actions">
            <div className="v71" data-node-id="325:6162" data-name="Aspect intelligence">
              <div className="v170" data-node-id="325:6163" data-name="Aspect scores">
                <div className="v171" data-node-id="325:6164" data-name="Section heading">
                  <p className="v172" data-node-id="325:6165">
                    Aspect scores
                  </p>
                  <p
                    className="v173"
                    data-node-id="325:6166"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    Positive share of detected aspect mentions · Survey responses
                  </p>
                </div>
                <div className="v174" data-node-id="325:6167" data-name="Detected aspects">
                  <div className="v175" data-node-id="325:6168" data-name="Aspect">
                    <p
                      className="v176"
                      data-node-id="325:6169"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      Food quality
                    </p>
                    <div className="v177" data-node-id="325:6170" data-name="Score track">
                      <div className="v178" data-node-id="325:6171" data-name="Positive share" />
                    </div>
                    <p
                      className="v179"
                      data-node-id="325:6172"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      86%
                    </p>
                    <p
                      className="v180"
                      data-node-id="325:6173"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      640 mentions
                    </p>
                  </div>
                  <div className="v175" data-node-id="325:6174" data-name="Aspect">
                    <p
                      className="v176"
                      data-node-id="325:6175"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      Staff friendliness
                    </p>
                    <div className="v177" data-node-id="325:6176" data-name="Score track">
                      <div className="v181" data-node-id="325:6177" data-name="Positive share" />
                    </div>
                    <p
                      className="v179"
                      data-node-id="325:6178"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      81%
                    </p>
                    <p
                      className="v180"
                      data-node-id="325:6179"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      410 mentions
                    </p>
                  </div>
                  <div className="v175" data-node-id="325:6180" data-name="Aspect">
                    <p
                      className="v176"
                      data-node-id="325:6181"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      Value for money
                    </p>
                    <div className="v177" data-node-id="325:6182" data-name="Score track">
                      <div className="v182" data-node-id="325:6183" data-name="Positive share" />
                    </div>
                    <p
                      className="v179"
                      data-node-id="325:6184"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      65%
                    </p>
                    <p
                      className="v180"
                      data-node-id="325:6185"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      325 mentions
                    </p>
                  </div>
                  <div className="v175" data-node-id="325:6186" data-name="Aspect">
                    <p
                      className="v176"
                      data-node-id="325:6187"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      Order accuracy
                    </p>
                    <div className="v177" data-node-id="325:6188" data-name="Score track">
                      <div className="v183" data-node-id="325:6189" data-name="Positive share" />
                    </div>
                    <p
                      className="v179"
                      data-node-id="325:6190"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      76%
                    </p>
                    <p
                      className="v180"
                      data-node-id="325:6191"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      280 mentions
                    </p>
                  </div>
                  <div className="v175" data-node-id="325:6192" data-name="Aspect">
                    <p
                      className="v176"
                      data-node-id="325:6193"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      Service speed
                    </p>
                    <div className="v177" data-node-id="325:6194" data-name="Score track">
                      <div className="v184" data-node-id="325:6195" data-name="Positive share" />
                    </div>
                    <p
                      className="v179"
                      data-node-id="325:6196"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      42%
                    </p>
                    <p
                      className="v180"
                      data-node-id="325:6197"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      360 mentions
                    </p>
                  </div>
                </div>
              </div>
              <div className="v185" data-node-id="325:6198" data-name="Key insights">
                <p className="v153" data-node-id="325:6199">
                  Key insights
                </p>
                <div className="v157" data-node-id="325:6200" data-name="Supported insight">
                  <div className="v186" data-node-id="325:6201" data-name="Insight marker" />
                  <div className="v187" data-node-id="325:6202" data-name="Finding">
                    <p
                      className="v188"
                      data-node-id="325:6203"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      Strongest aspect: Food quality
                    </p>
                    <p
                      className="v189"
                      data-node-id="325:6204"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      86% positive · 640 mentions
                    </p>
                  </div>
                  <p
                    className="v190"
                    data-node-id="325:6205"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    <DashboardArrowText text={'↗'} />
                  </p>
                </div>
                <div className="v157" data-node-id="325:6206" data-name="Supported insight">
                  <div className="v191" data-node-id="325:6207" data-name="Insight marker" />
                  <div className="v187" data-node-id="325:6208" data-name="Finding">
                    <p
                      className="v188"
                      data-node-id="325:6209"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      Lowest-rated aspect: Service speed
                    </p>
                    <p
                      className="v189"
                      data-node-id="325:6210"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      42% positive · 360 mentions
                    </p>
                  </div>
                  <p
                    className="v190"
                    data-node-id="325:6211"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    <DashboardArrowText text={'↗'} />
                  </p>
                </div>
                <div className="v157" data-node-id="325:6212" data-name="Supported insight">
                  <div className="v192" data-node-id="325:6213" data-name="Insight marker" />
                  <div className="v187" data-node-id="325:6214" data-name="Finding">
                    <p
                      className="v188"
                      data-node-id="325:6215"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      Welcoming service stands out at El Zamalek
                    </p>
                    <p
                      className="v189"
                      data-node-id="325:6216"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      September reviews · 92 mention welcoming service
                    </p>
                  </div>
                  <p
                    className="v190"
                    data-node-id="325:6217"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    <DashboardArrowText text={'↗'} />
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="v193" data-node-id="325:6218" data-name="Prioritized actions">
            <div className="v194" data-node-id="325:6219" data-name="Section heading">
              <div className="v195" data-node-id="325:6220" data-name="Heading copy">
                <p className="v196" data-node-id="325:6221">
                  What to do next
                </p>
                <p
                  className="v197"
                  data-node-id="325:6222"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  3 recommendations, ranked by impact and feedback volume
                </p>
              </div>
              <p
                className="v198"
                data-node-id="325:6223"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                <DashboardArrowText text={'Action board →'} />
              </p>
            </div>
            <div className="v199" data-node-id="325:6224" data-name="Action item">
              <div className="v200" data-node-id="325:6225" data-name="Recommended action">
                <div className="v201" data-node-id="325:6226" data-name="Action symbol">
                  <div className="v36" data-node-id="325:6227" data-name="clock-3">
                    <img alt="" className="v5" src={imgClock3} />
                  </div>
                </div>
                <div className="v83" data-node-id="325:6229" data-name="Action evidence">
                  <div className="v59" data-node-id="325:6230" data-name="Action title">
                    <p
                      className="v161"
                      data-node-id="325:6231"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      Shorten the evening queue at Cairo
                    </p>
                    <div className="v202" data-node-id="325:6232" data-name="Status">
                      <p
                        className="v203"
                        data-node-id="325:6233"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        High priority
                      </p>
                    </div>
                  </div>
                  <p
                    className="v204"
                    data-node-id="325:6234"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    Add peak-hour coverage. Wait-time complaints rose 2× vs. August.
                  </p>
                  <p
                    className="v205"
                    data-node-id="325:6235"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    “Great coffee, but we waited 25 minutes for our order.”
                  </p>
                  <div className="v206" data-node-id="325:6236" data-name="Evidence link">
                    <p
                      className="v12"
                      data-node-id="325:6237"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      104 reviews · Cairo · Operations
                    </p>
                    <p
                      className="v207"
                      data-node-id="325:6238"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      <DashboardArrowText text={'View evidence ↗'} />
                    </p>
                  </div>
                </div>
              </div>
              <div className="v208" data-node-id="325:6239" data-name="Action divider" />
            </div>
            <div className="v199" data-node-id="325:6240" data-name="Action item">
              <div className="v200" data-node-id="325:6241" data-name="Recommended action">
                <div className="v201" data-node-id="325:6242" data-name="Action symbol">
                  <div className="v36" data-node-id="325:6243" data-name="tag">
                    <img alt="" className="v5" src={imgTag} />
                  </div>
                </div>
                <div className="v83" data-node-id="325:6245" data-name="Action evidence">
                  <div className="v59" data-node-id="325:6246" data-name="Action title">
                    <p
                      className="v161"
                      data-node-id="325:6247"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      Make combo pricing clearer
                    </p>
                    <div className="v209" data-node-id="325:6248" data-name="Status">
                      <p
                        className="v210"
                        data-node-id="325:6249"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        Medium
                      </p>
                    </div>
                  </div>
                  <p
                    className="v204"
                    data-node-id="325:6250"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    Show the full price upfront on menus and ordering screens.
                  </p>
                  <p
                    className="v205"
                    data-node-id="325:6251"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    “The combo cost more than the price on the menu.”
                  </p>
                  <div className="v206" data-node-id="325:6252" data-name="Evidence link">
                    <p
                      className="v12"
                      data-node-id="325:6253"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      48 reviews · All branches · Commercial
                    </p>
                    <p
                      className="v207"
                      data-node-id="325:6254"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      <DashboardArrowText text={'View evidence ↗'} />
                    </p>
                  </div>
                </div>
              </div>
              <div className="v208" data-node-id="325:6255" data-name="Action divider" />
            </div>
            <div className="v211" data-node-id="325:6256" data-name="Action item">
              <div className="v200" data-node-id="325:6257" data-name="Recommended action">
                <div className="v201" data-node-id="325:6258" data-name="Action symbol">
                  <div className="v36" data-node-id="325:6259" data-name="heart-handshake">
                    <img alt="" className="v5" src={imgHeartHandshake} />
                  </div>
                </div>
                <div className="v83" data-node-id="325:6261" data-name="Action evidence">
                  <div className="v59" data-node-id="325:6262" data-name="Action title">
                    <p
                      className="v161"
                      data-node-id="325:6263"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      Share El Zamalek’s service playbook
                    </p>
                    <div className="v212" data-node-id="325:6264" data-name="Status">
                      <p
                        className="v213"
                        data-node-id="325:6265"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        Opportunity
                      </p>
                    </div>
                  </div>
                  <p
                    className="v204"
                    data-node-id="325:6266"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    Replicate the welcome customers love across your branches.
                  </p>
                  <p
                    className="v205"
                    data-node-id="325:6267"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    “The team remembered my order and made me feel welcome.”
                  </p>
                  <div className="v206" data-node-id="325:6268" data-name="Evidence link">
                    <p
                      className="v12"
                      data-node-id="325:6269"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      92 reviews · Elzamalek · Branch leads
                    </p>
                    <p
                      className="v207"
                      data-node-id="325:6270"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      <DashboardArrowText text={'View evidence ↗'} />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="v214" data-node-id="325:6271" data-name="Quick actions">
            <div className="v215" data-node-id="325:6272" data-name="Action heading">
              <p
                className="v216"
                data-node-id="325:6273"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Quick Actions
              </p>
              <p
                className="v173"
                data-node-id="325:6274"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Turn customer feedback into your next move.
              </p>
            </div>
            <div className="v217" data-node-id="325:6275" data-name="Actions">
              <div className="v218" data-node-id="325:6276" data-name="Action">
                <div className="v13" data-node-id="325:6277" data-name="list-filter">
                  <img alt="" className="v5" src={imgListFilter} />
                </div>
                <p
                  className="v136"
                  data-node-id="325:6279"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  View All Responses
                </p>
              </div>
              <div className="v218" data-node-id="325:6280" data-name="Action">
                <div className="v13" data-node-id="325:6281" data-name="sparkles">
                  <img alt="" className="v5" src={imgSparkles1} />
                </div>
                <p
                  className="v136"
                  data-node-id="325:6283"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Generate AI Report
                </p>
              </div>
              <div className="v219" data-node-id="325:6284" data-name="Action">
                <div className="v13" data-node-id="325:6285" data-name="plus">
                  <img alt="" className="v5" src={imgPlus1} />
                </div>
                <p
                  className="v220"
                  data-node-id="325:6287"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Create Survey
                </p>
              </div>
            </div>
          </div>
          <div
            className="v221"
            data-node-id="325:6298"
            role="button"
            tabIndex={0}
            aria-label="Open NUVIA Assistant"
            onClick={() => setAssistantOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setAssistantOpen(true);
              }
            }}
          >
            <div className="v222" data-node-id="325:6295" data-name="sparkles">
              <img alt="" className="v5" src={imgSparkles2} />
            </div>
          </div>
        </div>
      </div>
      {assistantOpen && (
        <div
          className="restored-assistant-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Ask NUVIA"
        >
          <button className="assistant-close" onClick={() => setAssistantOpen(false)}>
            Close ×
          </button>
          <OriginalAssistant />
        </div>
      )}
    </div>
  );
}
