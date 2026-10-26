import { SurveyRow, SurveyMoreMenu } from './SurveyRow.jsx';

import { asset } from '../../../lib/assets.js';
import ControlIcon from '../../../components/ui/ControlIcon.jsx';
import { UiText, SurveyTableCheck, SurveySortButton } from './SurveyPrimitives.jsx';

const imgPlus = asset('surveys-figma/all-imgPlus.svg');
const imgIcon = asset('surveys-figma/all-imgIcon.svg');
const imgRadio = asset('surveys-figma/all-imgRadio.svg');
const imgIcon1 = asset('surveys-figma/all-imgIcon1.svg');
const imgCircleCheck = asset('surveys-figma/all-imgCircleCheck.svg');
const imgIcon2 = asset('surveys-figma/all-imgIcon2.svg');

const imgIcon3 = asset('surveys-figma/all-imgIcon3.svg');
const imgShare2 = asset('surveys-figma/all-imgShare2.svg');
const imgPencil = asset('surveys-figma/all-imgPencil.svg');
const imgEllipsis = asset('surveys-figma/all-imgEllipsis.svg');
const imgIcon4 = asset('surveys-figma/all-imgIcon4.svg');
const imgQrCode = asset('surveys-figma/all-imgQrCode.svg');

export default function SurveyContent() {
  return (
    <div className="sv0" data-node-id="258:1851" data-name="Survey content">
      <div className="sv1" data-node-id="258:1853" data-name="Heading and actions">
        <div className="sv71" data-node-id="258:1854" data-name="Page heading">
          <div className="sv81" data-node-id="258:1855" data-name="Title and status">
            <UiText className="sv82" data-node-id="258:1856">
              Manage surveys
            </UiText>
          </div>
          <UiText
            className="sv83"
            data-node-id="258:1857"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Create, manage and share feedback across your branches.
          </UiText>
        </div>
        <div className="sv84" data-node-id="258:1858" data-name="Page actions">
          <button
            type="button"
            className="sv85"
            data-node-id="258:1859"
            data-name="Action"
            data-survey-action="Export"
          >
            <div className="sv6" data-node-id="258:1860" data-name="download">
              <ControlIcon name="export" />
            </div>
            <UiText
              className="sv86"
              data-node-id="258:1862"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Export
            </UiText>
          </button>
          <button
            type="button"
            className="sv87"
            data-node-id="258:1863"
            data-name="Action"
            data-survey-action="Create survey"
          >
            <div className="sv6" data-node-id="258:1864" data-name="plus">
              <img alt="" className="sv7" src={imgPlus} />
            </div>
            <UiText
              className="sv88"
              data-node-id="258:1866"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Create survey
            </UiText>
          </button>
        </div>
      </div>
      <div className="sv70" data-node-id="258:1867" data-name="Survey overview">
        <div className="sv89" data-node-id="258:1868" data-name="Survey metric">
          <div className="sv1" data-node-id="258:1869" data-name="Metric heading">
            <UiText
              className="sv90"
              data-node-id="258:1870"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Total surveys
            </UiText>
            <div className="sv91" data-node-id="258:1871" data-name="Icon">
              <img alt="" className="sv7" src={imgIcon} />
            </div>
          </div>
          <div className="sv92" data-node-id="258:1873" data-name="Metric value and context">
            <UiText
              className="sv93"
              data-node-id="258:1874"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              6
            </UiText>
            <UiText
              className="sv94"
              data-node-id="258:1875"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Across 3 branches
            </UiText>
          </div>
        </div>
        <div className="sv89" data-node-id="258:1876" data-name="Survey metric">
          <div className="sv1" data-node-id="258:1877" data-name="Metric heading">
            <UiText
              className="sv90"
              data-node-id="258:1878"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Live surveys
            </UiText>
            <div className="sv91" data-node-id="258:1879" data-name="radio">
              <img alt="" className="sv7" src={imgRadio} />
            </div>
          </div>
          <div className="sv92" data-node-id="258:1881" data-name="Metric value and context">
            <UiText
              className="sv93"
              data-node-id="258:1882"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              2
            </UiText>
            <UiText
              className="sv94"
              data-node-id="258:1883"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Collecting feedback
            </UiText>
          </div>
        </div>
        <div className="sv89" data-node-id="258:1884" data-name="Survey metric">
          <div className="sv1" data-node-id="258:1885" data-name="Metric heading">
            <UiText
              className="sv90"
              data-node-id="258:1886"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Responses this month
            </UiText>
            <div className="sv91" data-node-id="258:1887" data-name="Icon">
              <img alt="" className="sv7" src={imgIcon1} />
            </div>
          </div>
          <div className="sv92" data-node-id="258:1889" data-name="Metric value and context">
            <UiText
              className="sv93"
              data-node-id="258:1890"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              1,248
            </UiText>
            <UiText
              className="sv94"
              data-node-id="258:1891"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              ↑ 18.2%
            </UiText>
          </div>
        </div>
        <div className="sv89" data-node-id="258:1892" data-name="Survey metric">
          <div className="sv1" data-node-id="258:1893" data-name="Metric heading">
            <UiText
              className="sv90"
              data-node-id="258:1894"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              Completion rate
            </UiText>
            <div className="sv91" data-node-id="258:1895" data-name="circle-check">
              <img alt="" className="sv7" src={imgCircleCheck} />
            </div>
          </div>
          <div className="sv92" data-node-id="258:1897" data-name="Metric value and context">
            <UiText
              className="sv93"
              data-node-id="258:1898"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              86%
            </UiText>
            <UiText
              className="sv94"
              data-node-id="258:1899"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              ↑ 4 pts this month
            </UiText>
          </div>
        </div>
      </div>
      <div className="sv95" data-node-id="258:1900" data-name="Survey management">
        <div className="sv96" data-node-id="258:1901" data-name="Status filters">
          <button
            type="button"
            className="sv97"
            data-node-id="258:1902"
            data-name="Status tab"
            data-survey-action="All surveys  6"
          >
            <UiText
              className="sv98"
              data-node-id="258:1903"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`All surveys  6`}</UiText>
            <div className="sv99" data-node-id="258:1904" data-name="Active indicator" />
          </button>
          <button
            type="button"
            className="sv97"
            data-node-id="258:1905"
            data-name="Status tab"
            data-survey-action="Live  2"
          >
            <UiText
              className="sv100"
              data-node-id="258:1906"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`Live  2`}</UiText>
            <div className="sv101" data-node-id="258:1907" data-name="Active indicator" />
          </button>
          <button
            type="button"
            className="sv97"
            data-node-id="258:1908"
            data-name="Status tab"
            data-survey-action="Drafts  2"
          >
            <UiText
              className="sv100"
              data-node-id="258:1909"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`Drafts  2`}</UiText>
            <div className="sv101" data-node-id="258:1910" data-name="Active indicator" />
          </button>
          <button
            type="button"
            className="sv97"
            data-node-id="258:1911"
            data-name="Status tab"
            data-survey-action="Paused  1"
          >
            <UiText
              className="sv100"
              data-node-id="258:1912"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`Paused  1`}</UiText>
            <div className="sv101" data-node-id="258:1913" data-name="Active indicator" />
          </button>
          <button
            type="button"
            className="sv97"
            data-node-id="258:1914"
            data-name="Status tab"
            data-survey-action="Closed  1"
          >
            <UiText
              className="sv100"
              data-node-id="258:1915"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >{`Closed  1`}</UiText>
            <div className="sv101" data-node-id="258:1916" data-name="Active indicator" />
          </button>
        </div>
        <div className="sv102" data-node-id="258:1917" data-name="Search and filters">
          <div className="sv103" data-node-id="258:1918" data-name="Survey search">
            <div className="sv6" data-node-id="258:1919" data-name="Icon">
              <img alt="" className="sv7" src={imgIcon2} />
            </div>
            <input
              className="survey-search-input"
              aria-label="Search surveys"
              placeholder="Search surveys by name..."
            />
          </div>
          <div className="sv105" data-node-id="258:1922" data-name="Filters">
            <button
              type="button"
              className="sv106"
              data-node-id="258:1923"
              data-name="Action"
              data-survey-action="All 3 branches"
            >
              <div className="sv6" data-node-id="258:1924" data-name="store">
                <ControlIcon name="branch" />
              </div>
              <UiText
                className="sv107"
                data-node-id="258:1926"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                All 3 branches
              </UiText>
            </button>
            <SurveySortButton className="sv106" />
          </div>
        </div>
        <div className="sv108" data-node-id="258:1931" data-name="Table headings">
          <SurveyTableCheck className="sv109" data-node-id="258:1932" data-name="Select all" />
          <UiText
            className="sv110"
            data-node-id="258:1933"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            SURVEY NAME
          </UiText>
          <UiText
            className="sv111"
            data-node-id="258:1934"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            STATUS
          </UiText>
          <UiText
            className="sv112"
            data-node-id="258:1935"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            BRANCHES
          </UiText>
          <UiText
            className="sv113"
            data-node-id="258:1936"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            RESPONSES
          </UiText>
          <UiText
            className="sv114"
            data-node-id="258:1937"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            UPDATED
          </UiText>
          <UiText
            className="sv115"
            data-node-id="258:1938"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            ACTIONS
          </UiText>
        </div>
        <SurveyRow
          surveyName="Customer experience survey"
          initialStatus="Live"
          className="sv116"
          data-node-id="258:1939"
          data-name="Survey row"
          data-updated="today"
        >
          <SurveyTableCheck className="sv109" data-node-id="258:1940" data-name="Select survey" />
          <div className="sv117" data-node-id="258:1941" data-name="Survey information">
            <div className="sv118" data-node-id="258:1942" data-name="Survey symbol">
              <div className="sv60" data-node-id="258:1943" data-name="Icon">
                <img alt="" className="sv7" src={imgIcon3} />
              </div>
            </div>
            <div className="sv119" data-node-id="258:1945" data-name="Survey details">
              <UiText
                className="sv120"
                data-node-id="258:1946"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Customer experience survey
              </UiText>
              <UiText
                className="sv121"
                data-node-id="258:1947"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >{`6 questions · Arabic & English`}</UiText>
            </div>
          </div>
          <div className="sv122" data-node-id="258:1948" data-name="Survey status">
            <div className="sv123" data-node-id="258:1949" data-name="Status">
              <UiText
                className="sv124"
                data-node-id="258:1950"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Live
              </UiText>
            </div>
          </div>
          <UiText
            className="sv125"
            data-node-id="258:1951"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            All 3 branches
          </UiText>
          <UiText
            className="sv126"
            data-node-id="258:1952"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            1,248
          </UiText>
          <UiText
            className="sv127"
            data-node-id="258:1953"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Today, 10:42
          </UiText>
          <div className="sv128" data-node-id="258:1954" data-name="Management actions">
            <button
              type="button"
              className="sv106"
              data-node-id="258:1955"
              data-name="Action"
              data-survey-action="Share"
            >
              <div className="sv6" data-node-id="258:1956" data-name="share-2">
                <img alt="" className="sv7" src={imgShare2} />
              </div>
              <UiText
                className="sv107"
                data-node-id="258:1958"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Share
              </UiText>
            </button>
            <button
              type="button"
              className="sv6"
              data-node-id="258:1959"
              data-name="pencil"
              data-survey-action="Edit survey"
              aria-label="Edit survey"
            >
              <img alt="" className="sv7" src={imgPencil} />
            </button>
            <SurveyMoreMenu className="sv60" data-node-id="258:1961" data-name="ellipsis">
              <img alt="" className="sv7" src={imgEllipsis} />
            </SurveyMoreMenu>
          </div>
        </SurveyRow>
        <SurveyRow
          surveyName="Quick satisfaction check"
          initialStatus="Live"
          className="sv129"
          data-node-id="258:1963"
          data-name="Survey row"
          data-updated="2026-10-08"
        >
          <SurveyTableCheck className="sv109" data-node-id="258:1964" data-name="Select survey" />
          <div className="sv117" data-node-id="258:1965" data-name="Survey information">
            <div className="sv118" data-node-id="258:1966" data-name="Survey symbol">
              <div className="sv60" data-node-id="258:1967" data-name="Icon">
                <img alt="" className="sv7" src={imgIcon3} />
              </div>
            </div>
            <div className="sv119" data-node-id="258:1969" data-name="Survey details">
              <UiText
                className="sv130"
                data-node-id="258:1970"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Quick satisfaction check
              </UiText>
              <UiText
                className="sv121"
                data-node-id="258:1971"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >{`3 questions · Arabic & English`}</UiText>
            </div>
          </div>
          <div className="sv122" data-node-id="258:1972" data-name="Survey status">
            <div className="sv123" data-node-id="258:1973" data-name="Status">
              <UiText
                className="sv124"
                data-node-id="258:1974"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Live
              </UiText>
            </div>
          </div>
          <UiText
            className="sv125"
            data-node-id="258:1975"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Cairo
          </UiText>
          <UiText
            className="sv126"
            data-node-id="258:1976"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            326
          </UiText>
          <UiText
            className="sv127"
            data-node-id="258:1977"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            8 Oct, 2026
          </UiText>
          <div className="sv128" data-node-id="258:1978" data-name="Management actions">
            <button
              type="button"
              className="sv106"
              data-node-id="258:1979"
              data-name="Action"
              data-survey-action="Share"
            >
              <div className="sv6" data-node-id="258:1980" data-name="share-2">
                <img alt="" className="sv7" src={imgShare2} />
              </div>
              <UiText
                className="sv107"
                data-node-id="258:1982"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Share
              </UiText>
            </button>
            <button
              type="button"
              className="sv6"
              data-node-id="258:1983"
              data-name="pencil"
              data-survey-action="Edit survey"
              aria-label="Edit survey"
            >
              <img alt="" className="sv7" src={imgPencil} />
            </button>
            <SurveyMoreMenu className="sv60" data-node-id="258:1985" data-name="ellipsis">
              <img alt="" className="sv7" src={imgEllipsis} />
            </SurveyMoreMenu>
          </div>
        </SurveyRow>
        <SurveyRow
          surveyName="Seasonal menu feedback"
          initialStatus="Draft"
          className="sv129"
          data-node-id="258:1987"
          data-name="Survey row"
          data-updated="2026-10-07"
        >
          <SurveyTableCheck className="sv109" data-node-id="258:1988" data-name="Select survey" />
          <div className="sv117" data-node-id="258:1989" data-name="Survey information">
            <div className="sv118" data-node-id="258:1990" data-name="Survey symbol">
              <div className="sv60" data-node-id="258:1991" data-name="Icon">
                <img alt="" className="sv7" src={imgIcon3} />
              </div>
            </div>
            <div className="sv119" data-node-id="258:1993" data-name="Survey details">
              <UiText
                className="sv130"
                data-node-id="258:1994"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Seasonal menu feedback
              </UiText>
              <UiText
                className="sv121"
                data-node-id="258:1995"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >{`5 questions · Arabic & English`}</UiText>
            </div>
          </div>
          <div className="sv122" data-node-id="258:1996" data-name="Survey status">
            <div className="sv131" data-node-id="258:1997" data-name="Status">
              <UiText
                className="sv132"
                data-node-id="258:1998"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Draft
              </UiText>
            </div>
          </div>
          <UiText
            className="sv125"
            data-node-id="258:1999"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            All 3 branches
          </UiText>
          <UiText
            className="sv126"
            data-node-id="258:2000"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            —
          </UiText>
          <UiText
            className="sv127"
            data-node-id="258:2001"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            7 Oct, 2026
          </UiText>
          <div className="sv128" data-node-id="258:2002" data-name="Management actions">
            <button
              type="button"
              className="sv133"
              data-node-id="258:2003"
              data-name="Action"
              data-survey-action="Continue editing"
            >
              <UiText
                className="sv107"
                data-node-id="258:2004"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Continue editing
              </UiText>
            </button>
            <SurveyMoreMenu className="sv60" data-node-id="258:2005" data-name="ellipsis">
              <img alt="" className="sv7" src={imgEllipsis} />
            </SurveyMoreMenu>
          </div>
        </SurveyRow>
        <SurveyRow
          surveyName="New branch welcome"
          initialStatus="Draft"
          className="sv129"
          data-node-id="258:2007"
          data-name="Survey row"
          data-updated="2026-10-06"
        >
          <SurveyTableCheck className="sv109" data-node-id="258:2008" data-name="Select survey" />
          <div className="sv117" data-node-id="258:2009" data-name="Survey information">
            <div className="sv118" data-node-id="258:2010" data-name="Survey symbol">
              <div className="sv60" data-node-id="258:2011" data-name="Icon">
                <img alt="" className="sv7" src={imgIcon3} />
              </div>
            </div>
            <div className="sv119" data-node-id="258:2013" data-name="Survey details">
              <UiText
                className="sv130"
                data-node-id="258:2014"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                New branch welcome
              </UiText>
              <UiText
                className="sv121"
                data-node-id="258:2015"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >{`4 questions · Arabic & English`}</UiText>
            </div>
          </div>
          <div className="sv122" data-node-id="258:2016" data-name="Survey status">
            <div className="sv131" data-node-id="258:2017" data-name="Status">
              <UiText
                className="sv132"
                data-node-id="258:2018"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Draft
              </UiText>
            </div>
          </div>
          <UiText
            className="sv125"
            data-node-id="258:2019"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Alex
          </UiText>
          <UiText
            className="sv126"
            data-node-id="258:2020"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            —
          </UiText>
          <UiText
            className="sv127"
            data-node-id="258:2021"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            6 Oct, 2026
          </UiText>
          <div className="sv128" data-node-id="258:2022" data-name="Management actions">
            <button
              type="button"
              className="sv133"
              data-node-id="258:2023"
              data-name="Action"
              data-survey-action="Continue editing"
            >
              <UiText
                className="sv107"
                data-node-id="258:2024"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Continue editing
              </UiText>
            </button>
            <SurveyMoreMenu className="sv60" data-node-id="258:2025" data-name="ellipsis">
              <img alt="" className="sv7" src={imgEllipsis} />
            </SurveyMoreMenu>
          </div>
        </SurveyRow>
        <SurveyRow
          surveyName="{`Coffee & service check-in`}"
          initialStatus="Paused"
          className="sv129"
          data-node-id="258:2027"
          data-name="Survey row"
          data-updated="2026-10-03"
        >
          <SurveyTableCheck className="sv109" data-node-id="258:2028" data-name="Select survey" />
          <div className="sv117" data-node-id="258:2029" data-name="Survey information">
            <div className="sv118" data-node-id="258:2030" data-name="Survey symbol">
              <div className="sv60" data-node-id="258:2031" data-name="Icon">
                <img alt="" className="sv7" src={imgIcon3} />
              </div>
            </div>
            <div className="sv119" data-node-id="258:2033" data-name="Survey details">
              <UiText
                className="sv130"
                data-node-id="258:2034"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >{`Coffee & service check-in`}</UiText>
              <UiText
                className="sv121"
                data-node-id="258:2035"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >{`4 questions · Arabic & English`}</UiText>
            </div>
          </div>
          <div className="sv122" data-node-id="258:2036" data-name="Survey status">
            <div className="sv134" data-node-id="258:2037" data-name="Status">
              <UiText
                className="sv135"
                data-node-id="258:2038"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Paused
              </UiText>
            </div>
          </div>
          <UiText
            className="sv125"
            data-node-id="258:2039"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            El Zamalek
          </UiText>
          <UiText
            className="sv126"
            data-node-id="258:2040"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            124
          </UiText>
          <UiText
            className="sv127"
            data-node-id="258:2041"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            3 Oct, 2026
          </UiText>
          <div className="sv128" data-node-id="258:2042" data-name="Management actions">
            <button
              type="button"
              className="sv106"
              data-node-id="258:2043"
              data-name="Action"
              data-survey-action="View results"
            >
              <div className="sv6" data-node-id="258:2044" data-name="Icon">
                <img alt="" className="sv7" src={imgIcon4} />
              </div>
              <UiText
                className="sv107"
                data-node-id="258:2046"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                View results
              </UiText>
            </button>
            <button
              type="button"
              className="sv6"
              data-node-id="258:2047"
              data-name="pencil"
              data-survey-action="Edit survey"
              aria-label="Edit survey"
            >
              <img alt="" className="sv7" src={imgPencil} />
            </button>
            <SurveyMoreMenu className="sv60" data-node-id="258:2049" data-name="ellipsis">
              <img alt="" className="sv7" src={imgEllipsis} />
            </SurveyMoreMenu>
          </div>
        </SurveyRow>
        <SurveyRow
          surveyName="Summer customer pulse"
          initialStatus="Closed"
          className="sv129"
          data-node-id="258:2051"
          data-name="Survey row"
          data-updated="2026-09-30"
        >
          <SurveyTableCheck className="sv109" data-node-id="258:2052" data-name="Select survey" />
          <div className="sv117" data-node-id="258:2053" data-name="Survey information">
            <div className="sv118" data-node-id="258:2054" data-name="Survey symbol">
              <div className="sv60" data-node-id="258:2055" data-name="Icon">
                <img alt="" className="sv7" src={imgIcon3} />
              </div>
            </div>
            <div className="sv119" data-node-id="258:2057" data-name="Survey details">
              <UiText
                className="sv130"
                data-node-id="258:2058"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Summer customer pulse
              </UiText>
              <UiText
                className="sv121"
                data-node-id="258:2059"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >{`6 questions · Arabic & English`}</UiText>
            </div>
          </div>
          <div className="sv122" data-node-id="258:2060" data-name="Survey status">
            <div className="sv131" data-node-id="258:2061" data-name="Status">
              <UiText
                className="sv132"
                data-node-id="258:2062"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                Closed
              </UiText>
            </div>
          </div>
          <UiText
            className="sv125"
            data-node-id="258:2063"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            All 3 branches
          </UiText>
          <UiText
            className="sv126"
            data-node-id="258:2064"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            842
          </UiText>
          <UiText
            className="sv127"
            data-node-id="258:2065"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            30 Sep, 2026
          </UiText>
          <div className="sv128" data-node-id="258:2066" data-name="Management actions">
            <button
              type="button"
              className="sv106"
              data-node-id="258:2067"
              data-name="Action"
              data-survey-action="View results"
            >
              <div className="sv6" data-node-id="258:2068" data-name="Icon">
                <img alt="" className="sv7" src={imgIcon4} />
              </div>
              <UiText
                className="sv107"
                data-node-id="258:2070"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                View results
              </UiText>
            </button>
            <button
              type="button"
              className="sv6"
              data-node-id="258:2071"
              data-name="pencil"
              data-survey-action="Edit survey"
              aria-label="Edit survey"
            >
              <img alt="" className="sv7" src={imgPencil} />
            </button>
            <SurveyMoreMenu className="sv60" data-node-id="258:2073" data-name="ellipsis">
              <img alt="" className="sv7" src={imgEllipsis} />
            </SurveyMoreMenu>
          </div>
        </SurveyRow>
        <div className="sv136" data-node-id="258:2075" data-name="Pagination">
          <UiText
            className="sv90"
            data-node-id="258:2076"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Showing 1–6 of 6 surveys
          </UiText>
          <div className="sv137" data-node-id="258:2077" data-name="Page controls">
            <button type="button" className="survey-page-control" disabled>
              <UiText>← Previous</UiText>
            </button>
            <div className="sv138" data-node-id="258:2079" data-name="Current page">
              <UiText
                className="sv139"
                data-node-id="258:2080"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                1
              </UiText>
            </div>
            <button type="button" className="survey-page-control" disabled>
              <UiText>Next →</UiText>
            </button>
          </div>
        </div>
      </div>
      <div className="sv140" data-node-id="258:2082" data-name="Collection tip">
        <div className="sv141" data-node-id="258:2083" data-name="Tip symbol">
          <div className="sv142" data-node-id="258:2084" data-name="qr-code">
            <img alt="" className="sv7" src={imgQrCode} />
          </div>
        </div>
        <div className="sv143" data-node-id="258:2086" data-name="Tip">
          <UiText
            className="sv144"
            data-node-id="258:2087"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Bring feedback to every table
          </UiText>
          <UiText
            className="sv18"
            data-node-id="258:2088"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            Share a branch-specific QR code to see exactly where each response comes from.
          </UiText>
        </div>
        <UiText
          className="sv139"
          data-node-id="258:2089"
          style={{ fontVariationSettings: '"opsz" 14' }}
        >
          Share your live survey →
        </UiText>
      </div>
    </div>
  );
}
