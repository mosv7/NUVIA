import HeadingBack from '../../../components/layout/HeadingBack.jsx';
import ControlIcon from '../../../components/ui/ControlIcon.jsx';
import ResponsiveChart from './ResponsiveChart.jsx';

import { asset } from '../../../lib/assets.js';
import { useProductView } from '../../../app/providers/ProductProvider.jsx';
import {
  AnalyticsTabs,
  AnalyticsFilters,
  FilteredAnalyticsSummary,
  AnalyticsInteractions,
  AnalyticsArrowText,
} from './AnalyticsControls.jsx';
import './analytics.css';

const imgInfo = asset('preview/sentiment-imgInfo.svg');
const imgSeriesMarker = asset('preview/sentiment-imgSeriesMarker.svg');
const imgSeriesMarker1 = asset('preview/sentiment-imgSeriesMarker1.svg');
const imgSeriesMarker2 = asset('preview/sentiment-imgSeriesMarker2.svg');
const imgSeriesMarker3 = asset('preview/sentiment-imgSeriesMarker3.svg');
const imgSentimentShare = asset('preview/sentiment-imgSentimentShare.svg');
const imgSentimentShare1 = asset('preview/sentiment-imgSentimentShare1.svg');
const imgSentimentShare2 = asset('preview/sentiment-imgSentimentShare2.svg');
const imgSentimentShare3 = asset('preview/sentiment-imgSentimentShare3.svg');
const imgSeriesMarker4 = asset('preview/sentiment-imgSeriesMarker4.svg');
const imgSeriesMarker5 = asset('preview/sentiment-imgSeriesMarker5.svg');
const imgSeriesMarker6 = asset('preview/sentiment-imgSeriesMarker6.svg');
const imgSeriesMarker7 = asset('preview/sentiment-imgSeriesMarker7.svg');
const imgTrendPoint = asset('preview/sentiment-imgTrendPoint.svg');
const imgTrendPoint1 = asset('preview/sentiment-imgTrendPoint1.svg');
const imgTrendPoint2 = asset('preview/sentiment-imgTrendPoint2.svg');
const imgTrendPoint3 = asset('preview/sentiment-imgTrendPoint3.svg');
const imgTrendLine = asset('preview/sentiment-imgTrendLine.svg');
const imgTrendLine1 = asset('preview/sentiment-imgTrendLine1.svg');
const imgTrendLine2 = asset('preview/sentiment-imgTrendLine2.svg');
const imgTrendLine3 = asset('preview/sentiment-imgTrendLine3.svg');
export default function SentimentAnalytics() {
  const { tr, analytics } = useProductView();
  return (
    <AnalyticsInteractions kind="sentiment">
      <div className="an0" data-node-id="306:1940" data-name="Page content">
        <div className="an1" data-node-id="306:1941" data-name="Page introduction">
          <div className="an2" data-node-id="306:1942" data-name="Introduction">
            <p className="an3" data-node-id="306:1943" data-workspace-heading="true">
              <HeadingBack />
              <span>{tr('Sentiment Analysis')}</span>
            </p>
            <p
              className="an4"
              data-node-id="306:1944"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {tr(
                'Understand how customers feel, from overall sentiment to the sentences behind it.',
              )}
            </p>
          </div>
          <button
            type="button"
            className="an5 ui-control ui-export"
            data-node-id="306:1945"
            data-name="Action"
          >
            <div className="an6" data-node-id="306:1946" data-name="Icon">
              <div className="an7">
                <ControlIcon name="export" />
              </div>
            </div>
            <p
              className="an9"
              data-node-id="306:1947"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {tr('Export data')}
            </p>
          </button>
        </div>
        <AnalyticsTabs />
        <AnalyticsFilters />
        {analytics.changed ? (
          <FilteredAnalyticsSummary />
        ) : (
          <>
            <div className="an10" data-node-id="306:1976" data-name="Sample data context">
              <div className="an11" data-node-id="306:1977" data-name="info">
                <img alt="" className="an12" src={imgInfo} />
              </div>
              <p
                className="an13"
                data-node-id="306:1979"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {tr(
                  'Illustrative sample data \u00b7 1,248 responses \u00b7 12 Sep\u20139 Oct 2026 \u00b7 Not connected to live analysis',
                )}
              </p>
              <div className="an14" data-node-id="306:1980" data-name="Status">
                <p
                  className="an15"
                  data-node-id="306:1981"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('Sample workspace')}
                </p>
              </div>
            </div>
            <div className="an16" data-node-id="306:1982" data-name="Sentiment metrics">
              <div className="an17" data-node-id="306:1983" data-name="Key metric">
                <div className="an18" data-node-id="306:1984" data-name="Metric heading">
                  <p
                    className="an19"
                    data-node-id="306:1985"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Positive')}
                  </p>
                  <div className="an20" data-node-id="306:1986" data-name="Series marker">
                    <img alt="" className="an12" src={imgSeriesMarker} />
                  </div>
                </div>
                <p
                  className="an21"
                  data-node-id="306:1987"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('78%')}
                </p>
                <p
                  className="an22"
                  data-node-id="306:1988"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('974 of 1,248 responses')}
                </p>
              </div>
              <div className="an17" data-node-id="306:1989" data-name="Key metric">
                <div className="an18" data-node-id="306:1990" data-name="Metric heading">
                  <p
                    className="an19"
                    data-node-id="306:1991"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Negative')}
                  </p>
                  <div className="an20" data-node-id="306:1992" data-name="Series marker">
                    <img alt="" className="an12" src={imgSeriesMarker1} />
                  </div>
                </div>
                <p
                  className="an21"
                  data-node-id="306:1993"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('8%')}
                </p>
                <p
                  className="an22"
                  data-node-id="306:1994"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('100 of 1,248 responses')}
                </p>
              </div>
              <div className="an17" data-node-id="306:1995" data-name="Key metric">
                <div className="an18" data-node-id="306:1996" data-name="Metric heading">
                  <p
                    className="an19"
                    data-node-id="306:1997"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Neutral')}
                  </p>
                  <div className="an20" data-node-id="306:1998" data-name="Series marker">
                    <img alt="" className="an12" src={imgSeriesMarker2} />
                  </div>
                </div>
                <p
                  className="an21"
                  data-node-id="306:1999"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('10%')}
                </p>
                <p
                  className="an22"
                  data-node-id="306:2000"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('124 of 1,248 responses')}
                </p>
              </div>
              <div className="an17" data-node-id="306:2001" data-name="Key metric">
                <div className="an18" data-node-id="306:2002" data-name="Metric heading">
                  <p
                    className="an19"
                    data-node-id="306:2003"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Mixed')}
                  </p>
                  <div className="an20" data-node-id="306:2004" data-name="Series marker">
                    <img alt="" className="an12" src={imgSeriesMarker3} />
                  </div>
                </div>
                <p
                  className="an21"
                  data-node-id="306:2005"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('4%')}
                </p>
                <p
                  className="an22"
                  data-node-id="306:2006"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('50 of 1,248 responses')}
                </p>
              </div>
            </div>
            <div className="an23" data-node-id="306:2007" data-name="Sentiment charts">
              <div className="an24" data-node-id="306:2008" data-name="Sentiment distribution">
                <div className="an25" data-node-id="306:2009" data-name="Section heading">
                  <div className="an26" data-node-id="306:2010" data-name="Heading">
                    <p
                      className="an27"
                      data-node-id="306:2011"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Sentiment distribution')}
                    </p>
                    <p
                      className="an28"
                      data-node-id="306:2012"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Share of all responses \u00b7 one label per response')}
                    </p>
                  </div>
                </div>
                <div className="an29" data-node-id="306:2013" data-name="Distribution breakdown">
                  <div className="an30" data-node-id="306:2014" data-name="Sentiment donut">
                    <div className="an31" data-node-id="306:2015" data-name="Donut total">
                      <p
                        className="an32"
                        data-node-id="306:2016"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('1,248')}
                      </p>
                      <p
                        className="an33"
                        data-node-id="306:2017"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('responses')}
                      </p>
                    </div>
                    <div className="an34" data-node-id="306:2018" data-name="Sentiment share">
                      <div className="an35">
                        <img alt="" className="an8" src={imgSentimentShare} />
                      </div>
                    </div>
                    <div className="an34" data-node-id="306:2019" data-name="Sentiment share">
                      <div className="an36">
                        <img alt="" className="an8" src={imgSentimentShare1} />
                      </div>
                    </div>
                    <div className="an34" data-node-id="306:2020" data-name="Sentiment share">
                      <div className="an37">
                        <img alt="" className="an8" src={imgSentimentShare2} />
                      </div>
                    </div>
                    <div className="an34" data-node-id="306:2021" data-name="Sentiment share">
                      <img alt="" className="an12" src={imgSentimentShare3} />
                    </div>
                  </div>
                  <div className="an38" data-node-id="306:2022" data-name="Distribution values">
                    <div className="an39" data-node-id="306:2023" data-name="Sentiment value">
                      <div className="an40" data-node-id="306:2024" data-name="Series marker">
                        <img alt="" className="an12" src={imgSeriesMarker4} />
                      </div>
                      <div className="an41" data-node-id="306:2025" data-name="Sentiment label">
                        <p
                          className="an42"
                          data-node-id="306:2026"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('Positive')}
                        </p>
                        <p
                          className="an43"
                          data-node-id="306:2027"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('974 responses')}
                        </p>
                      </div>
                      <p
                        className="an44"
                        data-node-id="306:2028"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('78%')}
                      </p>
                    </div>
                    <div className="an39" data-node-id="306:2029" data-name="Sentiment value">
                      <div className="an40" data-node-id="306:2030" data-name="Series marker">
                        <img alt="" className="an12" src={imgSeriesMarker5} />
                      </div>
                      <div className="an41" data-node-id="306:2031" data-name="Sentiment label">
                        <p
                          className="an42"
                          data-node-id="306:2032"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('Negative')}
                        </p>
                        <p
                          className="an43"
                          data-node-id="306:2033"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('100 responses')}
                        </p>
                      </div>
                      <p
                        className="an44"
                        data-node-id="306:2034"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('8%')}
                      </p>
                    </div>
                    <div className="an39" data-node-id="306:2035" data-name="Sentiment value">
                      <div className="an40" data-node-id="306:2036" data-name="Series marker">
                        <img alt="" className="an12" src={imgSeriesMarker6} />
                      </div>
                      <div className="an41" data-node-id="306:2037" data-name="Sentiment label">
                        <p
                          className="an42"
                          data-node-id="306:2038"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('Neutral')}
                        </p>
                        <p
                          className="an43"
                          data-node-id="306:2039"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('124 responses')}
                        </p>
                      </div>
                      <p
                        className="an44"
                        data-node-id="306:2040"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('10%')}
                      </p>
                    </div>
                    <div className="an39" data-node-id="306:2041" data-name="Sentiment value">
                      <div className="an40" data-node-id="306:2042" data-name="Series marker">
                        <img alt="" className="an12" src={imgSeriesMarker7} />
                      </div>
                      <div className="an41" data-node-id="306:2043" data-name="Sentiment label">
                        <p
                          className="an42"
                          data-node-id="306:2044"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('Mixed')}
                        </p>
                        <p
                          className="an43"
                          data-node-id="306:2045"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('50 responses')}
                        </p>
                      </div>
                      <p
                        className="an44"
                        data-node-id="306:2046"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('4%')}
                      </p>
                    </div>
                  </div>
                </div>
                <p
                  className="an45"
                  data-node-id="306:2047"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr(
                    'Mixed responses contain both positive and negative opinions. Percentages are rounded.',
                  )}
                </p>
              </div>
              <div className="an46" data-node-id="306:2048" data-name="Sentiment over time">
                <div className="an25" data-node-id="306:2049" data-name="Section heading">
                  <div className="an26" data-node-id="306:2050" data-name="Heading">
                    <p
                      className="an27"
                      data-node-id="306:2051"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Sentiment over time')}
                    </p>
                    <p
                      className="an28"
                      data-node-id="306:2052"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Weekly share of responses (%) \u00b7 same filters as above')}
                    </p>
                  </div>
                </div>
                <div className="an47" data-node-id="306:2053" data-name="Chart legend">
                  <div className="an48" data-node-id="306:2054" data-name="Legend item">
                    <div className="an40" data-node-id="306:2055" data-name="Series marker">
                      <img alt="" className="an12" src={imgSeriesMarker4} />
                    </div>
                    <p
                      className="an22"
                      data-node-id="306:2056"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Positive')}
                    </p>
                  </div>
                  <div className="an48" data-node-id="306:2057" data-name="Legend item">
                    <div className="an40" data-node-id="306:2058" data-name="Series marker">
                      <img alt="" className="an12" src={imgSeriesMarker5} />
                    </div>
                    <p
                      className="an22"
                      data-node-id="306:2059"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Negative')}
                    </p>
                  </div>
                  <div className="an48" data-node-id="306:2060" data-name="Legend item">
                    <div className="an40" data-node-id="306:2061" data-name="Series marker">
                      <img alt="" className="an12" src={imgSeriesMarker6} />
                    </div>
                    <p
                      className="an22"
                      data-node-id="306:2062"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Neutral')}
                    </p>
                  </div>
                  <div className="an48" data-node-id="306:2063" data-name="Legend item">
                    <div className="an40" data-node-id="306:2064" data-name="Series marker">
                      <img alt="" className="an12" src={imgSeriesMarker7} />
                    </div>
                    <p
                      className="an22"
                      data-node-id="306:2065"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Mixed')}
                    </p>
                  </div>
                </div>
                <ResponsiveChart width={636} height={210} fillDesktop>
                  <div className="an49" data-node-id="306:2066" data-name="Historical trend chart">
                    <p
                      className="an50"
                      data-node-id="306:2067"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('3\u20139 Oct')}
                    </p>
                    <p
                      className="an51"
                      data-node-id="306:2068"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('26 Sep\u20132 Oct')}
                    </p>
                    <p
                      className="an52"
                      data-node-id="306:2069"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('19\u201325 Sep')}
                    </p>
                    <p
                      className="an53"
                      data-node-id="306:2070"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('12\u201318 Sep')}
                    </p>
                    <div className="an54" data-node-id="306:2071" data-name="Trend point">
                      <img alt="" className="an12" src={imgTrendPoint} />
                    </div>
                    <div className="an55" data-node-id="306:2072" data-name="Trend point">
                      <img alt="" className="an12" src={imgTrendPoint} />
                    </div>
                    <div className="an56" data-node-id="306:2073" data-name="Trend point">
                      <img alt="" className="an12" src={imgTrendPoint} />
                    </div>
                    <div className="an57" data-node-id="306:2074" data-name="Trend point">
                      <img alt="" className="an12" src={imgTrendPoint} />
                    </div>
                    <div className="an58" data-node-id="306:2075" data-name="Trend point">
                      <img alt="" className="an12" src={imgTrendPoint1} />
                    </div>
                    <div className="an59" data-node-id="306:2076" data-name="Trend point">
                      <img alt="" className="an12" src={imgTrendPoint1} />
                    </div>
                    <div className="an60" data-node-id="306:2077" data-name="Trend point">
                      <img alt="" className="an12" src={imgTrendPoint1} />
                    </div>
                    <div className="an61" data-node-id="306:2078" data-name="Trend point">
                      <img alt="" className="an12" src={imgTrendPoint1} />
                    </div>
                    <div className="an62" data-node-id="306:2079" data-name="Trend point">
                      <img alt="" className="an12" src={imgTrendPoint2} />
                    </div>
                    <div className="an63" data-node-id="306:2080" data-name="Trend point">
                      <img alt="" className="an12" src={imgTrendPoint2} />
                    </div>
                    <div className="an64" data-node-id="306:2081" data-name="Trend point">
                      <img alt="" className="an12" src={imgTrendPoint2} />
                    </div>
                    <div className="an61" data-node-id="306:2082" data-name="Trend point">
                      <img alt="" className="an12" src={imgTrendPoint2} />
                    </div>
                    <div className="an65" data-node-id="306:2083" data-name="Trend point">
                      <img alt="" className="an12" src={imgTrendPoint3} />
                    </div>
                    <div className="an66" data-node-id="306:2084" data-name="Trend point">
                      <img alt="" className="an12" src={imgTrendPoint3} />
                    </div>
                    <div className="an67" data-node-id="306:2085" data-name="Trend point">
                      <img alt="" className="an12" src={imgTrendPoint3} />
                    </div>
                    <div className="an68" data-node-id="306:2086" data-name="Trend point">
                      <img alt="" className="an12" src={imgTrendPoint3} />
                    </div>
                    <div className="an69" data-node-id="306:2087" data-name="Trend line">
                      <div className="an70">
                        <img alt="" className="an8" src={imgTrendLine} />
                      </div>
                    </div>
                    <div className="an71" data-node-id="306:2088" data-name="Trend line">
                      <div className="an72">
                        <img alt="" className="an8" src={imgTrendLine1} />
                      </div>
                    </div>
                    <div className="an73" data-node-id="306:2089" data-name="Trend line">
                      <div className="an74">
                        <img alt="" className="an8" src={imgTrendLine2} />
                      </div>
                    </div>
                    <div className="an75" data-node-id="306:2090" data-name="Trend line">
                      <div className="an76">
                        <img alt="" className="an8" src={imgTrendLine3} />
                      </div>
                    </div>
                    <div className="an77" data-node-id="306:2091" data-name="Axis tick">
                      <div className="an78" data-node-id="306:2092" data-name="Grid line" />
                      <p
                        className="an79"
                        data-node-id="306:2093"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('100%')}
                      </p>
                    </div>
                    <div className="an80" data-node-id="306:2094" data-name="Axis tick">
                      <div className="an78" data-node-id="306:2095" data-name="Grid line" />
                      <p
                        className="an79"
                        data-node-id="306:2096"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('75%')}
                      </p>
                    </div>
                    <div className="an81" data-node-id="306:2097" data-name="Axis tick">
                      <div className="an78" data-node-id="306:2098" data-name="Grid line" />
                      <p
                        className="an79"
                        data-node-id="306:2099"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('50%')}
                      </p>
                    </div>
                    <div className="an82" data-node-id="306:2100" data-name="Axis tick">
                      <div className="an78" data-node-id="306:2101" data-name="Grid line" />
                      <p
                        className="an79"
                        data-node-id="306:2102"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('25%')}
                      </p>
                    </div>
                    <div className="an83" data-node-id="306:2103" data-name="Axis tick">
                      <div className="an78" data-node-id="306:2104" data-name="Grid line" />
                      <p
                        className="an79"
                        data-node-id="306:2105"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('0%')}
                      </p>
                    </div>
                  </div>
                </ResponsiveChart>
                <p
                  className="an22"
                  data-node-id="306:2106"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('Weekly response counts: 248 \u00b7 294 \u00b7 326 \u00b7 380')}
                </p>
              </div>
            </div>
            <div className="an23" data-node-id="306:2107" data-name="Response exploration">
              <div className="an24" data-node-id="306:2108" data-name="Explore responses">
                <div className="an84" data-node-id="306:2109" data-name="Section heading">
                  <div className="an85" data-node-id="306:2110" data-name="Heading">
                    <p
                      className="an27"
                      data-node-id="306:2111"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Explore responses')}
                    </p>
                    <p
                      className="an28"
                      data-node-id="306:2112"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Selected response shown with sentence-level details')}
                    </p>
                  </div>
                  <a
                    href="#/feedbacks"
                    className="an86"
                    data-node-id="306:2113"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {<AnalyticsArrowText text={tr('All responses \u2192')} />}
                  </a>
                </div>
                <div className="an87" data-node-id="306:2114" data-name="Response filters">
                  <div className="an88" data-node-id="306:2115" data-name="Status">
                    <p
                      className="an89"
                      data-node-id="306:2116"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('All sentiments')}
                    </p>
                  </div>
                  <div className="an14" data-node-id="306:2117" data-name="Status">
                    <p
                      className="an15"
                      data-node-id="306:2118"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Newest first')}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="an90"
                  data-node-id="306:2119"
                  data-name="Related response"
                  data-response-id="1032"
                >
                  <div className="an18" data-node-id="306:2120" data-name="Response metadata">
                    <p
                      className="an22"
                      data-node-id="306:2121"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('R-1032 \u00b7 Cairo \u00b7 7 Oct 2026')}
                    </p>
                    <div className="an91" data-node-id="306:2122" data-name="Sentiment">
                      <p
                        className="an92"
                        data-node-id="306:2123"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Mixed')}
                      </p>
                    </div>
                  </div>
                  <p
                    className="an93"
                    data-node-id="306:2124"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr(
                      '\u201cThe coffee was good. We waited 25 minutes for our order. I\u2019d visit again if service is quicker.\u201d',
                    )}
                  </p>
                </button>
                <button
                  type="button"
                  className="an94"
                  data-node-id="306:2125"
                  data-name="Related response"
                  data-response-id="1027"
                >
                  <div className="an18" data-node-id="306:2126" data-name="Response metadata">
                    <p
                      className="an22"
                      data-node-id="306:2127"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('R-1027 \u00b7 El Zamalek \u00b7 7 Oct 2026')}
                    </p>
                    <div className="an95" data-node-id="306:2128" data-name="Status">
                      <p
                        className="an96"
                        data-node-id="306:2129"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Positive')}
                      </p>
                    </div>
                  </div>
                  <p
                    className="an93"
                    data-node-id="306:2130"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('\u201cThe team remembered my order and made me feel welcome.\u201d')}
                  </p>
                </button>
                <button
                  type="button"
                  className="an94"
                  data-node-id="306:2131"
                  data-name="Related response"
                  data-response-id="1019"
                >
                  <div className="an18" data-node-id="306:2132" data-name="Response metadata">
                    <p
                      className="an22"
                      data-node-id="306:2133"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('R-1019 \u00b7 Alex \u00b7 6 Oct 2026')}
                    </p>
                    <div className="an97" data-node-id="306:2134" data-name="Status">
                      <p
                        className="an98"
                        data-node-id="306:2135"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Negative')}
                      </p>
                    </div>
                  </div>
                  <p
                    className="an93"
                    data-node-id="306:2136"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('\u201cThe combo cost more than the price on the menu.\u201d')}
                  </p>
                </button>
                <p
                  className="an22"
                  data-node-id="306:2137"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('Showing 3 of 1,248 illustrative responses')}
                </p>
              </div>
              <div className="an46" data-node-id="306:2138" data-name="Response Details">
                <div className="an84" data-node-id="306:2139" data-name="Section heading">
                  <div className="an85" data-node-id="306:2140" data-name="Heading">
                    <p
                      className="an27"
                      data-node-id="306:2141"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Response Details')}
                    </p>
                    <p
                      className="an28"
                      data-node-id="306:2142"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('R-1032 \u00b7 Customer experience survey')}
                    </p>
                  </div>
                  <a
                    href="#/feedback-details?id=1032"
                    className="an86"
                    data-node-id="306:2143"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {<AnalyticsArrowText text={tr('Open response \u2197')} />}
                  </a>
                </div>
                <div className="an18" data-node-id="306:2144" data-name="Response context">
                  <p
                    className="an22"
                    data-node-id="306:2145"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr(
                      'Cairo \u00b7 7 Oct 2026 \u00b7 English \u00b7 QR code \u00b7 Returning customer',
                    )}
                  </p>
                  <div className="an91" data-node-id="306:2146" data-name="Sentiment">
                    <p
                      className="an92"
                      data-node-id="306:2147"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Mixed')}
                    </p>
                  </div>
                </div>
                <div className="an99" data-node-id="306:2148" data-name="Original feedback">
                  <p
                    className="an100"
                    data-node-id="306:2149"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('ORIGINAL FEEDBACK')}
                  </p>
                  <p
                    className="an101"
                    data-node-id="306:2150"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr(
                      '\u201cThe coffee was good. We waited 25 minutes for our order. I\u2019d visit again if service is quicker.\u201d',
                    )}
                  </p>
                </div>
                <div className="an102" data-node-id="306:2151" data-name="Sentence analysis">
                  <div className="an103" data-node-id="306:2152" data-name="Analysis heading">
                    <p
                      className="an104"
                      data-node-id="306:2153"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Sentence-level analysis')}
                    </p>
                    <p
                      className="an33"
                      data-node-id="306:2154"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('3 sentences \u00b7 illustrative labels')}
                    </p>
                  </div>
                  <div className="an105" data-node-id="306:2155" data-name="Sentence result">
                    <div className="an106" data-node-id="306:2156" data-name="Sentence evidence">
                      <p
                        className="an107"
                        data-node-id="306:2157"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('The coffee was excellent.')}
                      </p>
                      <p
                        className="an108"
                        data-node-id="306:2158"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Product Quality')}
                      </p>
                    </div>
                    <div className="an95" data-node-id="306:2159" data-name="Status">
                      <p
                        className="an96"
                        data-node-id="306:2160"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Positive')}
                      </p>
                    </div>
                  </div>
                  <div className="an105" data-node-id="306:2161" data-name="Sentence result">
                    <div className="an106" data-node-id="306:2162" data-name="Sentence evidence">
                      <p
                        className="an107"
                        data-node-id="306:2163"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('We waited 25 minutes for our order.')}
                      </p>
                      <p
                        className="an108"
                        data-node-id="306:2164"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Speed')}
                      </p>
                    </div>
                    <div className="an97" data-node-id="306:2165" data-name="Status">
                      <p
                        className="an98"
                        data-node-id="306:2166"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Negative')}
                      </p>
                    </div>
                  </div>
                  <div className="an105" data-node-id="306:2167" data-name="Sentence result">
                    <div className="an106" data-node-id="306:2168" data-name="Sentence evidence">
                      <p
                        className="an107"
                        data-node-id="306:2169"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('I\u2019d visit again if service is quicker.')}
                      </p>
                      <p
                        className="an108"
                        data-node-id="306:2170"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Speed')}
                      </p>
                    </div>
                    <div className="an91" data-node-id="306:2171" data-name="Sentiment">
                      <p
                        className="an92"
                        data-node-id="306:2172"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Mixed')}
                      </p>
                    </div>
                  </div>
                </div>
                <p
                  className="an45"
                  data-node-id="306:2173"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr(
                    'Sentence labels explain the response-level result; they are not additional responses.',
                  )}
                </p>
              </div>
            </div>
            <div className="an109" data-node-id="306:2174" data-name="Analysis footer">
              <p
                className="an110"
                data-node-id="306:2175"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {tr('Bloom & Co. \u00b7 Customer experience survey \u00b7 All languages')}
              </p>
              <p
                className="an110"
                data-node-id="306:2176"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {tr('Illustrative data only \u00b7 No live analysis results')}
              </p>
            </div>
          </>
        )}
      </div>
    </AnalyticsInteractions>
  );
}
