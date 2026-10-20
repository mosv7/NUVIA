import { LanguageMenu } from '../../../components/ui/ChoiceMenu.jsx';
import React from 'react';
import { asset } from '../../../lib/assets.js';
import { useProductView } from '../../../app/providers/ProductProvider.jsx';
import './feedback-details.css';
const imgLogo = asset('dashboard/feedback-details/logo.svg');
const imgIcon = asset('dashboard/feedback-details/icon.svg');
const imgIcon1 = asset('dashboard/feedback-details/icon1.svg');
const imgIcon2 = asset('dashboard/feedback-details/icon2.svg');
const imgIcon3 = asset('dashboard/feedback-details/icon3.svg');
const imgIcon4 = asset('dashboard/feedback-details/icon4.svg');
const imgIcon5 = asset('dashboard/feedback-details/icon5.svg');
const imgIcon6 = asset('dashboard/feedback-details/icon6.svg');
const imgIcon7 = asset('dashboard/feedback-details/icon7.svg');
const imgIcon8 = asset('dashboard/feedback-details/icon8.svg');
const imgIcon9 = asset('dashboard/feedback-details/icon9.svg');
const imgIcon10 = asset('dashboard/feedback-details/icon10.svg');
const imgIcon11 = asset('dashboard/feedback-details/icon11.svg');
const imgIcon12 = asset('dashboard/feedback-details/icon12.svg');
const imgIcon13 = asset('dashboard/feedback-details/icon13.svg');
const imgNotifications = asset('dashboard/feedback-details/notifications.svg');
const imgIcon14 = asset('dashboard/feedback-details/icon14.svg');
const imgArrowLeft = asset('dashboard/feedback-details/arrow-left.svg');
const imgChevronLeft = asset('dashboard/feedback-details/chevron-left.svg');
const imgChevronRight = asset('dashboard/feedback-details/chevron-right.svg');
const imgIndicator = asset('dashboard/feedback-details/indicator.svg');
const imgIndicator1 = asset('dashboard/feedback-details/indicator1.svg');
const imgInfo = asset('dashboard/feedback-details/info.svg');
const imgIndicator2 = asset('dashboard/feedback-details/indicator2.svg');
const imgThumbsUp = asset('dashboard/feedback-details/thumbs-up.svg');
const imgThumbsDown = asset('dashboard/feedback-details/thumbs-down.svg');
const imgShieldCheck = asset('dashboard/feedback-details/shield-check.svg');
const imgSparkles = asset('dashboard/feedback-details/sparkles.svg');
export default function FeedbackDetailsDesign() {
  const ui = useProductView();
  const tr = ui.tr;
  return (
    <div
      className="f0 product-view ds-feedback-details"
      data-node-id="266:14290"
      data-name="Feedback Details"
    >
      <div
        className="f1 product-navigation"
        data-node-id="266:14291"
        data-name="Product navigation"
        role="navigation"
        inert={ui.isMobile && !ui.menuOpen}
        aria-hidden={ui.isMobile && !ui.menuOpen}
      >
        <div className="f2" data-node-id="266:14292" data-name="NUVIA home">
          <div className="f3" data-node-id="266:14293" data-name="Brand mark">
            <div className="f4" data-node-id="266:14294" data-name="Logo">
              <img alt="" className="f5" src={imgLogo} />
            </div>
          </div>
          <p className="f6" data-node-id="266:14298">
            {tr('NUVIA')}
          </p>
        </div>
        <button
          className="f7"
          data-node-id="266:14299"
          data-name="Business switcher"
          type="button"
          onClick={() => ui.action('B Bloom & Co. Cafe &workspace')}
        >
          <div className="f8" data-node-id="266:14300" data-name="Business avatar">
            <p className="f9" data-node-id="266:14301">
              {tr('B')}
            </p>
          </div>
          <div className="f10" data-node-id="266:14302" data-name="Business">
            <p
              className="f11"
              data-node-id="266:14303"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Bloom & Co.')}
            </p>
            <p
              className="f12"
              data-node-id="266:14304"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Cafe &workspace')}
            </p>
          </div>
          <div className="f13" data-node-id="266:14305" data-name="Icon">
            <img alt="" className="f5" src={imgIcon} />
          </div>
        </button>
        <div className="f14" data-node-id="266:14307" data-name="Workspace destinations">
          <p
            className="f15"
            data-node-id="266:14308"
            style={{
              fontVariationSettings: '"opsz" 14',
            }}
          >
            {tr('WORKSPACE')}
          </p>
          <button
            className="f16"
            data-node-id="266:14309"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Overview')}
          >
            <div className="f17" data-node-id="266:14310" data-name="Icon">
              <img alt="" className="f5" src={imgIcon1} />
            </div>
            <p
              className="f18"
              data-node-id="266:14312"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Overview')}
            </p>
          </button>
          <button
            className="f19"
            data-node-id="266:14313"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Feedbacks')}
          >
            <div className="f17" data-node-id="266:14314" data-name="Icon">
              <img alt="" className="f5" src={imgIcon2} />
            </div>
            <p
              className="f20"
              data-node-id="266:14316"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Feedbacks')}
            </p>
          </button>
          <button
            className="f16"
            data-node-id="266:14317"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Analytics')}
          >
            <div className="f17" data-node-id="266:14318" data-name="Icon">
              <img alt="" className="f5" src={imgIcon3} />
            </div>
            <p
              className="f18"
              data-node-id="266:14320"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Analytics')}
            </p>
          </button>
          <button
            className="f16"
            data-node-id="266:14321"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Reports')}
          >
            <div className="f17" data-node-id="266:14322" data-name="Icon">
              <img alt="" className="f5" src={imgIcon4} />
            </div>
            <p
              className="f18"
              data-node-id="266:14324"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Reports')}
            </p>
          </button>
          <button
            className="f16"
            data-node-id="266:14325"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Surveys')}
          >
            <div className="f17" data-node-id="266:14326" data-name="Icon">
              <img alt="" className="f5" src={imgIcon5} />
            </div>
            <p
              className="f18"
              data-node-id="266:14328"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Surveys')}
            </p>
          </button>
          <button
            className="f16"
            data-node-id="266:14329"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Segments')}
          >
            <div className="f17" data-node-id="266:14330" data-name="Icon">
              <img alt="" className="f5" src={imgIcon6} />
            </div>
            <p
              className="f18"
              data-node-id="266:14332"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Business & Teams')}
            </p>
          </button>
          <div className="f21" data-node-id="266:14333" data-name="Divider" />
          <button
            className="f16"
            data-node-id="266:14334"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('NUVIA Assistant')}
          >
            <div className="f17" data-node-id="266:14335" data-name="Icon">
              <img alt="" className="f5" src={imgIcon7} />
            </div>
            <p
              className="f18"
              data-node-id="266:14337"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('NUVIA Assistant')}
            </p>
          </button>
        </div>
        <div className="f22" data-node-id="266:14338" data-name="Flexible space" />
        <div className="f23" data-node-id="266:14339" data-name="Account destinations">
          <button
            className="f16"
            data-node-id="266:14340"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Subscription')}
          >
            <div className="f17" data-node-id="266:14341" data-name="Icon">
              <img alt="" className="f5" src={imgIcon8} />
            </div>
            <p
              className="f18"
              data-node-id="266:14343"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Subscription')}
            </p>
          </button>
          <button
            className="f16"
            data-node-id="266:14344"
            data-name="Navigation item"
            type="button"
            onClick={() => ui.action('Settings')}
          >
            <div className="f17" data-node-id="266:14345" data-name="Icon">
              <img alt="" className="f5" src={imgIcon9} />
            </div>
            <p
              className="f18"
              data-node-id="266:14347"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Settings')}
            </p>
          </button>
        </div>
        <div className="f24" data-node-id="266:14348" data-name="Plan usage">
          <div className="f25" data-node-id="266:14349" data-name="Plan">
            <p
              className="f26"
              data-node-id="266:14350"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Growth plan')}
            </p>
            <p
              className="f27"
              data-node-id="266:14351"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Active')}
            </p>
          </div>
          <p
            className="f28"
            data-node-id="266:14352"
            style={{
              fontVariationSettings: '"opsz" 14',
            }}
          >
            {tr('1,248 / 5,000 responses')}
          </p>
          <div className="f29" data-node-id="266:14353" data-name="Usage track">
            <div className="f30" data-node-id="266:14354" data-name="Usage progress" />
          </div>
          <button
            className="f31"
            data-node-id="266:14355"
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
          data-node-id="266:14356"
          data-name="Help"
          type="button"
          onClick={() => ui.action('Help center')}
        >
          <div className="f33" data-node-id="266:14357" data-name="Icon">
            <img alt="" className="f5" src={imgIcon10} />
          </div>
          <p
            className="f34"
            data-node-id="266:14359"
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
        data-node-id="267:14845"
        data-name="Workspace"
        inert={ui.isMobile && ui.menuOpen}
      >
        <div className="f36 product-topbar" data-node-id="267:14846" data-name="Workspace header">
          <div className="f37" data-node-id="267:14847" data-name="Breadcrumb">
            <p
              className="f38"
              data-node-id="267:14848"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Bloom & Co.')}
            </p>
            <p
              className="f38"
              data-node-id="267:14849"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('/')}
            </p>
            <p
              className="f38"
              data-node-id="267:14850"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Feedbacks')}
            </p>
            <p
              className="f38"
              data-node-id="267:14851"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('/')}
            </p>
            <p
              className="f39"
              data-node-id="267:14852"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Feedback details')}
            </p>
          </div>
          <div className="f40" data-node-id="267:14853" data-name="Header actions">
            <div className="f41" data-node-id="267:14854" data-name="Search">
              <div className="f13" data-node-id="267:14855" data-name="Icon">
                <img alt="" className="f5" src={imgIcon11} />
              </div>
              <input
                className="f42"
                data-node-id="267:14857"
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
                data-node-id="267:14858"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('⌘ K')}
              </p>
            </div>
            <div className="f44" data-node-id="267:14859" data-name="Language">
              <div className="f33" data-node-id="267:14860" data-name="Icon">
                <img alt="" className="f5" src={imgIcon12} />
              </div>
              <LanguageMenu value={ui.language} onChange={ui.setLanguage} />
              <div className="f45" data-node-id="267:14863" data-name="Icon">
                <img alt="" className="f5" src={imgIcon13} />
              </div>
            </div>
            <div className="f46" data-node-id="267:14865" data-name="Notifications">
              <img alt="" className="f5" src={imgNotifications} />
            </div>
            <div className="f47" data-node-id="267:14869" data-name="Divider" />
            <button
              className="f48"
              data-node-id="267:14870"
              data-name="Profile"
              type="button"
              onClick={() => ui.action('SA Sara Ahmed Workspace owner')}
            >
              <div className="f49" data-node-id="267:14871" data-name="Avatar">
                <p
                  className="f50"
                  data-node-id="267:14872"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('SA')}
                </p>
              </div>
              <div className="f51" data-node-id="267:14873" data-name="Account">
                <p
                  className="f52"
                  data-node-id="267:14874"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Sara Ahmed')}
                </p>
                <p
                  className="f12"
                  data-node-id="267:14875"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Workspace owner')}
                </p>
              </div>
              <div className="f53" data-node-id="267:14876" data-name="Icon">
                <img alt="" className="f5" src={imgIcon14} />
              </div>
            </button>
          </div>
        </div>
        <div className="f54 product-content" data-node-id="267:14878" data-name="Response content">
          <button
            className="f55 product-section"
            data-node-id="267:14879"
            data-name="Back to responses"
            type="button"
            onClick={() => ui.action('All feedbacks')}
          >
            <div className="f13" data-node-id="267:14880" data-name="arrow-left">
              <img alt="" className="f5" src={imgArrowLeft} />
            </div>
            <p
              className="f34"
              data-node-id="267:14882"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('All feedbacks')}
            </p>
          </button>
          <div
            className="f56 product-section"
            data-node-id="267:14883"
            data-name="Heading and actions"
          >
            <div className="f57" data-node-id="267:14884" data-name="Page heading">
              <p className="f58" data-node-id="267:14885">
                {tr('Feedback #1248')}
              </p>
              <p
                className="f59"
                data-node-id="267:14886"
                style={{
                  fontVariationSettings: '"opsz" 14',
                }}
              >
                {tr('A closer look at one customer’s experience with Bloom & Co.')}
              </p>
            </div>
            <div className="f60" data-node-id="267:14887" data-name="Response navigation">
              <div className="f61" data-node-id="267:14888" data-name="Disabled action">
                <div className="f62" data-node-id="267:14889" data-name="chevron-left">
                  <img alt="" className="f5" src={imgChevronLeft} />
                </div>
                <p
                  className="f63"
                  data-node-id="267:14891"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Previous')}
                </p>
              </div>
              <button
                className="f64"
                data-node-id="267:14892"
                data-name="Action"
                type="button"
                onClick={() => ui.action('Next response')}
              >
                <div className="f62" data-node-id="267:14893" data-name="chevron-right">
                  <img alt="" className="f5" src={imgChevronRight} />
                </div>
                <p
                  className="f65"
                  data-node-id="267:14895"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Next response')}
                </p>
              </button>
            </div>
          </div>
          <div
            className="f66 product-section"
            data-node-id="267:14896"
            data-name="Feedback and analysis"
          >
            <div className="f67" data-node-id="267:14897" data-name="Original and aspect analysis">
              <div
                className="f68 product-card"
                data-node-id="267:14898"
                data-name="Original feedback"
              >
                <div className="f69" data-node-id="267:14899" data-name="Section heading">
                  <p
                    className="f70"
                    data-node-id="267:14900"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Original Feedback')}
                  </p>
                  <div className="f71" data-node-id="267:14901" data-name="Language">
                    <LanguageMenu value={ui.language} onChange={ui.setLanguage} />
                  </div>
                </div>
                <div className="f72" data-node-id="267:14903" data-name="Customer words">
                  <p
                    className="f73"
                    data-node-id="267:14904"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('How was your experience at Bloom & Co. today?')}
                  </p>
                  <p
                    className="f74"
                    data-node-id="267:14905"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr(
                      'The flat white was lovely and the team was welcoming, but I waited nearly 25 minutes for my order. The café felt calm and comfortable, so I stayed to work for a while. I’d happily come back if the service was a little quicker during the morning rush.',
                    )}
                  </p>
                </div>
                <div className="f21" data-node-id="267:14906" data-name="Divider" />
                <div className="f75" data-node-id="267:14907" data-name="Submission context">
                  <div className="f76" data-node-id="267:14908" data-name="Response metadata">
                    <p
                      className="f77"
                      data-node-id="267:14909"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('Submission date')}
                    </p>
                    <p
                      className="f78"
                      data-node-id="267:14910"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('16 Oct 2026, 10:42 AM')}
                    </p>
                  </div>
                  <div className="f76" data-node-id="267:14911" data-name="Response metadata">
                    <p
                      className="f77"
                      data-node-id="267:14912"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('Branch')}
                    </p>
                    <p
                      className="f78"
                      data-node-id="267:14913"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('Cairo')}
                    </p>
                  </div>
                </div>
                <div className="f75" data-node-id="267:14914" data-name="Survey context">
                  <div className="f76" data-node-id="267:14915" data-name="Response metadata">
                    <p
                      className="f77"
                      data-node-id="267:14916"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('Related survey')}
                    </p>
                    <button
                      className="f79"
                      data-node-id="267:14917"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                      type="button"
                      onClick={() => ui.action('Customer experience survey ↗')}
                    >
                      {tr('Customer experience survey ↗')}
                    </button>
                  </div>
                  <div className="f76" data-node-id="267:14918" data-name="Response metadata">
                    <p
                      className="f77"
                      data-node-id="267:14919"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('Respondent')}
                    </p>
                    <p
                      className="f78"
                      data-node-id="267:14920"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('Anonymous customer')}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="f80 product-card"
                data-node-id="267:14921"
                data-name="Aspect analysis"
              >
                <div className="f81" data-node-id="267:14922" data-name="Section heading">
                  <div className="f82" data-node-id="267:14923" data-name="Title and count">
                    <p
                      className="f83"
                      data-node-id="267:14924"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('Aspect Analysis')}
                    </p>
                    <p
                      className="f84"
                      data-node-id="267:14925"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('4 aspects detected')}
                    </p>
                  </div>
                  <p
                    className="f85"
                    data-node-id="267:14926"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('What the customer mentioned, and how they felt about it.')}
                  </p>
                </div>
                <div className="f86" data-node-id="267:14927" data-name="Aspect columns">
                  <div className="f87" data-node-id="267:14928" data-name="Aspect column">
                    <p
                      className="f43"
                      data-node-id="267:14929"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('Detected aspect')}
                    </p>
                  </div>
                  <div className="f88" data-node-id="267:14930" data-name="Evidence column">
                    <p
                      className="f43"
                      data-node-id="267:14931"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('Feedback evidence')}
                    </p>
                  </div>
                  <div className="f89" data-node-id="267:14932" data-name="Polarity column">
                    <p
                      className="f43"
                      data-node-id="267:14933"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('Polarity')}
                    </p>
                  </div>
                  <div className="f90" data-node-id="267:14934" data-name="Score column">
                    <p
                      className="f43"
                      data-node-id="267:14935"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('Score')}
                    </p>
                  </div>
                </div>
                <div className="f91" data-node-id="267:14936" data-name="Detected aspect">
                  <p
                    className="f92"
                    data-node-id="267:14937"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Coffee')}
                  </p>
                  <p
                    className="f42"
                    data-node-id="267:14938"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('“The flat white was lovely”')}
                  </p>
                  <div className="f93" data-node-id="267:14939" data-name="Polarity">
                    <div className="f94" data-node-id="267:14940" data-name="Sentiment">
                      <div className="f95" data-node-id="267:14941" data-name="Indicator">
                        <img alt="" className="f5" src={imgIndicator} />
                      </div>
                      <p
                        className="f96"
                        data-node-id="267:14942"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Positive')}
                      </p>
                    </div>
                  </div>
                  <p
                    className="f97"
                    data-node-id="267:14943"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('+0.92')}
                  </p>
                </div>
                <div className="f91" data-node-id="267:14944" data-name="Detected aspect">
                  <p
                    className="f92"
                    data-node-id="267:14945"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Service')}
                  </p>
                  <p
                    className="f42"
                    data-node-id="267:14946"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('“the team was welcoming”')}
                  </p>
                  <div className="f93" data-node-id="267:14947" data-name="Polarity">
                    <div className="f94" data-node-id="267:14948" data-name="Sentiment">
                      <div className="f95" data-node-id="267:14949" data-name="Indicator">
                        <img alt="" className="f5" src={imgIndicator} />
                      </div>
                      <p
                        className="f96"
                        data-node-id="267:14950"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Positive')}
                      </p>
                    </div>
                  </div>
                  <p
                    className="f97"
                    data-node-id="267:14951"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('+0.78')}
                  </p>
                </div>
                <div className="f91" data-node-id="267:14952" data-name="Detected aspect">
                  <p
                    className="f92"
                    data-node-id="267:14953"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Wait time')}
                  </p>
                  <p
                    className="f42"
                    data-node-id="267:14954"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('“I waited nearly 25 minutes”')}
                  </p>
                  <div className="f93" data-node-id="267:14955" data-name="Polarity">
                    <div className="f98" data-node-id="267:14956" data-name="Sentiment">
                      <div className="f95" data-node-id="267:14957" data-name="Indicator">
                        <img alt="" className="f5" src={imgIndicator1} />
                      </div>
                      <p
                        className="f99"
                        data-node-id="267:14958"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Negative')}
                      </p>
                    </div>
                  </div>
                  <p
                    className="f100"
                    data-node-id="267:14959"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('−0.84')}
                  </p>
                </div>
                <div className="f91" data-node-id="267:14960" data-name="Detected aspect">
                  <p
                    className="f92"
                    data-node-id="267:14961"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Ambience')}
                  </p>
                  <p
                    className="f42"
                    data-node-id="267:14962"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('“calm and comfortable”')}
                  </p>
                  <div className="f93" data-node-id="267:14963" data-name="Polarity">
                    <div className="f94" data-node-id="267:14964" data-name="Sentiment">
                      <div className="f95" data-node-id="267:14965" data-name="Indicator">
                        <img alt="" className="f5" src={imgIndicator} />
                      </div>
                      <p
                        className="f96"
                        data-node-id="267:14966"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Positive')}
                      </p>
                    </div>
                  </div>
                  <p
                    className="f97"
                    data-node-id="267:14967"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('+0.86')}
                  </p>
                </div>
                <div className="f101" data-node-id="267:14968" data-name="Score explanation">
                  <div className="f13" data-node-id="267:14969" data-name="info">
                    <img alt="" className="f5" src={imgInfo} />
                  </div>
                  <p
                    className="f43"
                    data-node-id="267:14971"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Scores range from −1 (negative) to +1 (positive). 0 is neutral.')}
                  </p>
                </div>
              </div>
            </div>
            <div className="f102" data-node-id="267:14972" data-name="Response insights">
              <div
                className="f68 product-card"
                data-node-id="267:14973"
                data-name="Sentiment analysis"
              >
                <p
                  className="f70"
                  data-node-id="267:14974"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Sentiment Analysis')}
                </p>
                <div className="f103" data-node-id="267:14975" data-name="Overall sentiment">
                  <p
                    className="f43"
                    data-node-id="267:14976"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Overall sentiment')}
                  </p>
                  <div className="f104" data-node-id="267:14977" data-name="Sentiment">
                    <div className="f95" data-node-id="267:14978" data-name="Indicator">
                      <img alt="" className="f5" src={imgIndicator2} />
                    </div>
                    <p
                      className="f105"
                      data-node-id="267:14979"
                      style={{
                        fontVariationSettings: '"opsz" 14',
                      }}
                    >
                      {tr('Mixed')}
                    </p>
                  </div>
                  <p
                    className="f106"
                    data-node-id="267:14980"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr(
                      'The customer enjoyed the coffee, team, and atmosphere, but was disappointed by the long wait.',
                    )}
                  </p>
                </div>
                <div className="f21" data-node-id="267:14981" data-name="Divider" />
                <div className="f107" data-node-id="267:14982" data-name="Sentiment signals">
                  <div className="f108" data-node-id="267:14983" data-name="Positive signal">
                    <div className="f33" data-node-id="267:14984" data-name="thumbs-up">
                      <img alt="" className="f5" src={imgThumbsUp} />
                    </div>
                    <div className="f109" data-node-id="267:14986" data-name="Signal">
                      <p
                        className="f110"
                        data-node-id="267:14987"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('What went well')}
                      </p>
                      <p
                        className="f111"
                        data-node-id="267:14988"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Coffee, welcoming team, calm space')}
                      </p>
                    </div>
                  </div>
                  <div className="f108" data-node-id="267:14989" data-name="Negative signal">
                    <div className="f33" data-node-id="267:14990" data-name="thumbs-down">
                      <img alt="" className="f5" src={imgThumbsDown} />
                    </div>
                    <div className="f109" data-node-id="267:14992" data-name="Signal">
                      <p
                        className="f110"
                        data-node-id="267:14993"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Room to improve')}
                      </p>
                      <p
                        className="f111"
                        data-node-id="267:14994"
                        style={{
                          fontVariationSettings: '"opsz" 14',
                        }}
                      >
                        {tr('Speed of service during the morning rush')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="f68 product-card"
                data-node-id="267:14995"
                data-name="Response context"
              >
                <p
                  className="f70"
                  data-node-id="267:14996"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr('Response context')}
                </p>
                <div className="f112" data-node-id="267:14997" data-name="Response metadata">
                  <p
                    className="f77"
                    data-node-id="267:14998"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Segment')}
                  </p>
                  <p
                    className="f78"
                    data-node-id="267:14999"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Morning visitors')}
                  </p>
                </div>
                <div className="f112" data-node-id="267:15000" data-name="Response metadata">
                  <p
                    className="f77"
                    data-node-id="267:15001"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Collection source')}
                  </p>
                  <p
                    className="f78"
                    data-node-id="267:15002"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('In-store QR code')}
                  </p>
                </div>
                <div className="f112" data-node-id="267:15003" data-name="Response metadata">
                  <p
                    className="f77"
                    data-node-id="267:15004"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Analysis status')}
                  </p>
                  <p
                    className="f78"
                    data-node-id="267:15005"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('Complete')}
                  </p>
                </div>
                <div className="f21" data-node-id="267:15006" data-name="Divider" />
                <div className="f113" data-node-id="267:15007" data-name="Privacy">
                  <div className="f33" data-node-id="267:15008" data-name="shield-check">
                    <img alt="" className="f5" src={imgShieldCheck} />
                  </div>
                  <p
                    className="f42"
                    data-node-id="267:15010"
                    style={{
                      fontVariationSettings: '"opsz" 14',
                    }}
                  >
                    {tr('This survey collects feedback anonymously.')}
                  </p>
                </div>
              </div>
              <div className="f114" data-node-id="267:15011" data-name="Analysis note">
                <div className="f33" data-node-id="267:15012" data-name="sparkles">
                  <img alt="" className="f5" src={imgSparkles} />
                </div>
                <p
                  className="f115"
                  data-node-id="267:15014"
                  style={{
                    fontVariationSettings: '"opsz" 14',
                  }}
                >
                  {tr(
                    'AI analysis helps you spot patterns. Always read the original feedback for the full context.',
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
