import { displaySurveyUrl, branchSurveyUrl } from '../../../config/links.js';
import DownloadQrButton from './DownloadQrButton.jsx';
import CopyLinkButton from './CopyLinkButton.jsx';

import { asset } from '../../../lib/assets.js';
import ControlIcon from '../../../components/ui/ControlIcon.jsx';
import { UiText, SurveySwitch } from './SurveyPrimitives.jsx';

const imgArrowLeft = asset('surveys-figma/share-imgArrowLeft.svg');
const imgPencil = asset('surveys-figma/share-imgPencil.svg');
const imgExternalLink = asset('surveys-figma/share-imgExternalLink.svg');
const imgCheck = asset('surveys-figma/share-imgCheck.svg');
const imgCircleCheck = asset('surveys-figma/share-imgCircleCheck.svg');
const imgSurveyQrCode = asset('surveys-figma/share-imgSurveyQrCode.svg');

const imgLink = asset('surveys-figma/share-imgLink.svg');
const imgCopy = asset('surveys-figma/share-imgCopy.svg');
const imgIcon = asset('surveys-figma/share-imgIcon.svg');
const imgMessageCircle = asset('surveys-figma/share-imgMessageCircle.svg');
const imgMail = asset('surveys-figma/share-imgMail.svg');
const imgCopy1 = asset('surveys-figma/share-imgCopy1.svg');

const imgQrCode = asset('surveys-figma/share-imgQrCode.svg');
const imgLink1 = asset('surveys-figma/share-imgLink1.svg');
const imgShieldCheck = asset('surveys-figma/share-imgShieldCheck.svg');

export default function SurveyContent() {
  return (
    <div className="sv0" data-node-id="262:11750" data-name="Survey content">
      <div className="sv149" data-node-id="262:11751" data-name="Page introduction">
        <button
          type="button"
          className="sv150"
          data-node-id="262:11752"
          data-name="Back to surveys"
          data-survey-action="All surveys"
        >
          <div className="sv148" data-node-id="262:11753" data-name="arrow-left">
            <img alt="" className="sv7" src={imgArrowLeft} />
          </div>
          <UiText
            className="sv90"
            data-node-id="262:11755"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            All surveys
          </UiText>
        </button>
        <div className="sv1" data-node-id="262:11756" data-name="Heading and actions">
          <div className="sv71" data-node-id="262:11757" data-name="Page heading">
            <div className="sv267" data-node-id="262:11758" data-name="Title and status">
              <UiText className="sv82" data-node-id="262:11759">
                Share survey
              </UiText>
              <div className="sv123" data-node-id="262:11760" data-name="Status">
                <UiText
                  className="sv124"
                  data-node-id="262:11761"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Live
                </UiText>
              </div>
            </div>
            <UiText
              className="sv83"
              data-node-id="262:11762"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Turn every visit into an opportunity to listen.
            </UiText>
          </div>
          <div className="sv84" data-node-id="262:11763" data-name="Page actions">
            <button
              type="button"
              className="sv85"
              data-node-id="262:11764"
              data-name="Action"
              data-survey-action="Edit survey"
            >
              <span className="sv6" data-node-id="262:11765" data-name="pencil" aria-hidden="true">
                <img alt="" className="sv7" src={imgPencil} />
              </span>
              <UiText
                className="sv86"
                data-node-id="262:11767"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Edit survey
              </UiText>
            </button>
            <button
              type="button"
              className="sv85"
              data-node-id="262:11768"
              data-name="Action"
              data-survey-action="Open survey"
            >
              <div className="sv6" data-node-id="262:11769" data-name="external-link">
                <img alt="" className="sv7" src={imgExternalLink} />
              </div>
              <UiText
                className="sv86"
                data-node-id="262:11771"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Open survey
              </UiText>
            </button>
          </div>
        </div>
      </div>
      <div className="sv153" data-node-id="262:11772" data-name="Survey workflow">
        <button
          type="button"
          className="sv154"
          data-node-id="262:11773"
          data-name="Workflow step"
          data-survey-action="Survey details"
        >
          <div className="sv155" data-node-id="262:11774" data-name="Step indicator">
            <div className="sv148" data-node-id="262:11775" data-name="check">
              <img alt="" className="sv7" src={imgCheck} />
            </div>
          </div>
          <UiText
            className="sv156"
            data-node-id="262:11777"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Survey details
          </UiText>
          <div className="sv157" data-node-id="262:11778" data-name="Connector" />
        </button>
        <button
          type="button"
          className="sv154"
          data-node-id="262:11779"
          data-name="Workflow step"
          data-survey-action="Build questions"
        >
          <div className="sv155" data-node-id="262:11780" data-name="Step indicator">
            <div className="sv148" data-node-id="262:11781" data-name="check">
              <img alt="" className="sv7" src={imgCheck} />
            </div>
          </div>
          <UiText
            className="sv156"
            data-node-id="262:11783"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Build questions
          </UiText>
          <div className="sv157" data-node-id="262:11784" data-name="Connector" />
        </button>
        <button
          type="button"
          className="sv154"
          data-node-id="262:11785"
          data-name="Workflow step"
          data-survey-action="3 Share survey"
        >
          <div className="sv155" data-node-id="262:11786" data-name="Step indicator">
            <UiText
              className="sv158"
              data-node-id="262:11787"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              3
            </UiText>
          </div>
          <UiText
            className="sv159"
            data-node-id="262:11788"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Share survey
          </UiText>
        </button>
      </div>
      <div className="sv291" data-node-id="262:11789" data-name="Live survey summary">
        <div className="sv292" data-node-id="262:11790" data-name="Live indicator">
          <div className="sv142" data-node-id="262:11791" data-name="circle-check">
            <img alt="" className="sv7" src={imgCircleCheck} />
          </div>
        </div>
        <div className="sv143" data-node-id="262:11793" data-name="Survey details">
          <UiText
            className="sv293"
            data-node-id="262:11794"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Customer experience survey
          </UiText>
          <UiText
            className="sv18"
            data-node-id="262:11795"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >{`6 questions · About 2 minutes · Arabic & English · All 3 branches`}</UiText>
        </div>
        <UiText
          className="sv294"
          data-node-id="262:11796"
          style={{ fontVariationSettings: '"opsz" 14' }}
        >
          Live and accepting responses
        </UiText>
      </div>
      <div className="sv14" data-node-id="262:11797" data-name="Sharing channels">
        <div className="sv295" data-node-id="262:11798" data-name="QR sharing">
          <div className="sv296" data-node-id="262:11799" data-name="QR heading">
            <UiText
              className="sv297"
              data-node-id="262:11800"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`Let customers scan & share`}</UiText>
            <UiText
              className="sv298"
              data-node-id="262:11801"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Place this QR code on tables, receipts or at checkout.
            </UiText>
          </div>
          <div className="sv299" data-node-id="262:11802" data-name="Print preview">
            <UiText className="sv300" data-node-id="262:11803">{`Bloom & Co.`}</UiText>
            <UiText
              className="sv90"
              data-node-id="262:11804"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Your experience matters to us.
            </UiText>
            <div className="sv301" data-node-id="262:11805" data-name="Survey QR code">
              <img alt="" className="sv7" src={imgSurveyQrCode} />
            </div>
            <UiText
              className="sv302"
              data-node-id="262:11807"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Scan to share your feedback
            </UiText>
            <UiText
              className="sv303"
              dir="auto"
              data-node-id="262:11808"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              امسح الرمز وشاركنا رأيك
            </UiText>
            <UiText
              className="sv304"
              data-node-id="262:11809"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {displaySurveyUrl()}
            </UiText>
          </div>
          <div className="sv1" data-node-id="262:11810" data-name="Download formats">
            <div className="sv305" data-node-id="262:11811" data-name="Export details">
              <UiText
                className="sv237"
                data-node-id="262:11812"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Print-ready QR code
              </UiText>
              <UiText
                className="sv306"
                data-node-id="262:11813"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                High resolution · No expiry
              </UiText>
            </div>
            <div className="sv31" data-node-id="262:11814" data-name="Format options">
              <DownloadQrButton
                type="button"
                className="sv307"
                data-node-id="262:11815"
                data-name="Action"
                data-survey-action="PNG"
              >
                <div className="sv6" data-node-id="262:11816" data-name="download">
                  <ControlIcon name="export" />
                </div>
                <UiText
                  className="sv308"
                  data-node-id="262:11818"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  PNG
                </UiText>
              </DownloadQrButton>
              <DownloadQrButton
                type="button"
                className="sv106"
                data-node-id="262:11819"
                data-name="Action"
                data-survey-action="SVG"
              >
                <div className="sv6" data-node-id="262:11820" data-name="download">
                  <ControlIcon name="export" />
                </div>
                <UiText
                  className="sv107"
                  data-node-id="262:11822"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  SVG
                </UiText>
              </DownloadQrButton>
            </div>
          </div>
          <div className="sv166" data-node-id="262:11823" data-name="Divider" />
          <div className="sv1" data-node-id="262:11824" data-name="Print display preference">
            <UiText
              className="sv214"
              data-node-id="262:11825"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`Include business name & invitation`}</UiText>
            <SurveySwitch className="sv215" />
          </div>
        </div>
        <div className="sv309" data-node-id="262:11828" data-name="Link and branch sharing">
          <div className="sv210" data-node-id="262:11829" data-name="Section">
            <div className="sv232" data-node-id="262:11830" data-name="Section heading">
              <UiText
                className="sv233"
                data-node-id="262:11831"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                One short link. More customer voices.
              </UiText>
              <UiText
                className="sv234"
                data-node-id="262:11832"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Share in a message, on social media or after a visit.
              </UiText>
            </div>
            <div className="sv63" data-node-id="262:11833" data-name="Short link">
              <UiText
                className="sv107"
                data-node-id="262:11834"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Survey link
              </UiText>
              <div className="sv310" data-node-id="262:11835" data-name="Link field">
                <div className="sv311" data-node-id="262:11836" data-name="URL">
                  <div className="sv6" data-node-id="262:11837" data-name="link">
                    <img alt="" className="sv7" src={imgLink} />
                  </div>
                  <UiText
                    className="sv312"
                    data-node-id="262:11839"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {displaySurveyUrl()}
                  </UiText>
                </div>
                <CopyLinkButton
                  type="button"
                  className="sv307"
                  data-node-id="262:11840"
                  data-name="Action"
                  data-survey-action="Copy link"
                >
                  <div className="sv6" data-node-id="262:11841" data-name="copy">
                    <img alt="" className="sv7" src={imgCopy} />
                  </div>
                  <UiText
                    className="sv308"
                    data-node-id="262:11843"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    Copy link
                  </UiText>
                </CopyLinkButton>
              </div>
            </div>
            <div className="sv313" data-node-id="262:11844" data-name="Link notes">
              <div className="sv148" data-node-id="262:11845" data-name="Icon">
                <img alt="" className="sv7" src={imgIcon} />
              </div>
              <UiText
                className="sv170"
                data-node-id="262:11847"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Opens in English. Customers can switch to Arabic.
              </UiText>
            </div>
            <div className="sv105" data-node-id="262:11848" data-name="Sharing shortcuts">
              <button
                type="button"
                className="sv106"
                data-node-id="262:11849"
                data-name="Action"
                data-survey-action="WhatsApp"
              >
                <div className="sv6" data-node-id="262:11850" data-name="message-circle">
                  <img alt="" className="sv7" src={imgMessageCircle} />
                </div>
                <UiText
                  className="sv107"
                  data-node-id="262:11852"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  WhatsApp
                </UiText>
              </button>
              <button
                type="button"
                className="sv106"
                data-node-id="262:11853"
                data-name="Action"
                data-survey-action="Email"
              >
                <div className="sv6" data-node-id="262:11854" data-name="mail">
                  <img alt="" className="sv7" src={imgMail} />
                </div>
                <UiText
                  className="sv107"
                  data-node-id="262:11856"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Email
                </UiText>
              </button>
              <button
                type="button"
                className="sv106"
                data-node-id="262:11857"
                data-name="Action"
                data-survey-action="Copy invitation"
              >
                <div className="sv6" data-node-id="262:11858" data-name="copy">
                  <img alt="" className="sv7" src={imgCopy1} />
                </div>
                <UiText
                  className="sv107"
                  data-node-id="262:11860"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Copy invitation
                </UiText>
              </button>
            </div>
          </div>
          <div className="sv210" data-node-id="262:11861" data-name="Section">
            <div className="sv232" data-node-id="262:11862" data-name="Section heading">
              <UiText
                className="sv233"
                data-node-id="262:11863"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Know which branch the feedback is for
              </UiText>
              <UiText
                className="sv234"
                data-node-id="262:11864"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                These links and QR codes automatically tag the branch. The main link lets customers
                choose.
              </UiText>
            </div>
            <div className="sv51" data-node-id="262:11865" data-name="Branch links">
              <div className="sv314" data-node-id="262:11866" data-name="Branch sharing">
                <div className="sv315" data-node-id="262:11867" data-name="Branch symbol">
                  <div className="sv6" data-node-id="262:11868" data-name="store">
                    <ControlIcon name="branch" />
                  </div>
                </div>
                <div className="sv316" data-node-id="262:11870" data-name="Branch details">
                  <UiText
                    className="sv237"
                    data-node-id="262:11871"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    Cairo
                  </UiText>
                  <UiText
                    className="sv238"
                    data-node-id="262:11872"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {displaySurveyUrl(branchSurveyUrl('cairo'))}
                  </UiText>
                </div>
                <div className="sv6" data-node-id="262:11873" data-name="copy">
                  <img alt="" className="sv7" src={imgCopy1} />
                </div>
                <button
                  type="button"
                  className="sv106"
                  data-node-id="262:11875"
                  data-name="Action"
                  data-survey-action="QR code"
                >
                  <div className="sv6" data-node-id="262:11876" data-name="download">
                    <ControlIcon name="export" />
                  </div>
                  <UiText
                    className="sv107"
                    data-node-id="262:11878"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    QR code
                  </UiText>
                </button>
              </div>
              <div className="sv314" data-node-id="262:11879" data-name="Branch sharing">
                <div className="sv315" data-node-id="262:11880" data-name="Branch symbol">
                  <div className="sv6" data-node-id="262:11881" data-name="store">
                    <ControlIcon name="branch" />
                  </div>
                </div>
                <div className="sv316" data-node-id="262:11883" data-name="Branch details">
                  <UiText
                    className="sv237"
                    data-node-id="262:11884"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    El Zamalek
                  </UiText>
                  <UiText
                    className="sv238"
                    data-node-id="262:11885"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {displaySurveyUrl(branchSurveyUrl('zamalek'))}
                  </UiText>
                </div>
                <div className="sv6" data-node-id="262:11886" data-name="copy">
                  <img alt="" className="sv7" src={imgCopy1} />
                </div>
                <button
                  type="button"
                  className="sv106"
                  data-node-id="262:11888"
                  data-name="Action"
                  data-survey-action="QR code"
                >
                  <div className="sv6" data-node-id="262:11889" data-name="download">
                    <ControlIcon name="export" />
                  </div>
                  <UiText
                    className="sv107"
                    data-node-id="262:11891"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    QR code
                  </UiText>
                </button>
              </div>
              <div className="sv314" data-node-id="262:11892" data-name="Branch sharing">
                <div className="sv315" data-node-id="262:11893" data-name="Branch symbol">
                  <div className="sv6" data-node-id="262:11894" data-name="store">
                    <ControlIcon name="branch" />
                  </div>
                </div>
                <div className="sv316" data-node-id="262:11896" data-name="Branch details">
                  <UiText
                    className="sv237"
                    data-node-id="262:11897"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    Alex
                  </UiText>
                  <UiText
                    className="sv238"
                    data-node-id="262:11898"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {displaySurveyUrl(branchSurveyUrl('alex'))}
                  </UiText>
                </div>
                <div className="sv6" data-node-id="262:11899" data-name="copy">
                  <img alt="" className="sv7" src={imgCopy1} />
                </div>
                <button
                  type="button"
                  className="sv106"
                  data-node-id="262:11901"
                  data-name="Action"
                  data-survey-action="QR code"
                >
                  <div className="sv6" data-node-id="262:11902" data-name="download">
                    <ControlIcon name="export" />
                  </div>
                  <UiText
                    className="sv107"
                    data-node-id="262:11904"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    QR code
                  </UiText>
                </button>
              </div>
            </div>
            <button
              type="button"
              className="sv307 survey-all-qr-button"
              data-node-id="262:11905"
              data-survey-action="Download all branch QR codes"
            >
              <div className="sv6">
                <ControlIcon name="export" />
              </div>
              <UiText className="sv308">Download all branch QR codes</UiText>
            </button>
          </div>
          <div className="sv317" data-node-id="262:11906" data-name="Collection so far">
            <div className="sv318" data-node-id="262:11907" data-name="Channel metric">
              <div className="sv150" data-node-id="262:11908" data-name="Metric label">
                <div className="sv165" data-node-id="262:11909" data-name="qr-code">
                  <img alt="" className="sv7" src={imgQrCode} />
                </div>
                <UiText
                  className="sv169"
                  data-node-id="262:11911"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Via QR code
                </UiText>
              </div>
              <UiText
                className="sv319"
                data-node-id="262:11912"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                774
              </UiText>
            </div>
            <div className="sv320" data-node-id="262:11913" data-name="Divider" />
            <div className="sv318" data-node-id="262:11914" data-name="Channel metric">
              <div className="sv150" data-node-id="262:11915" data-name="Metric label">
                <div className="sv165" data-node-id="262:11916" data-name="link">
                  <img alt="" className="sv7" src={imgLink1} />
                </div>
                <UiText
                  className="sv169"
                  data-node-id="262:11918"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  Via short link
                </UiText>
              </div>
              <UiText
                className="sv319"
                data-node-id="262:11919"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                474
              </UiText>
            </div>
          </div>
        </div>
      </div>
      <div className="sv1" data-node-id="262:11921" data-name="Sharing footer">
        <div className="sv80" data-node-id="262:11922" data-name="Privacy note">
          <div className="sv6" data-node-id="262:11923" data-name="shield-check">
            <img alt="" className="sv7" src={imgShieldCheck} />
          </div>
          <UiText
            className="sv90"
            data-node-id="262:11925"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Anonymous feedback · No sign-in needed · Works on any phone
          </UiText>
        </div>
        <button
          type="button"
          className="sv225"
          data-node-id="262:11926"
          data-name="Action"
          data-survey-action="Done, back to surveys"
        >
          <UiText
            className="sv88"
            data-node-id="262:11927"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Done, back to surveys
          </UiText>
        </button>
      </div>
    </div>
  );
}
