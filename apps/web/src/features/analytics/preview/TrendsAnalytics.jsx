import HeadingBack from '../../../components/layout/HeadingBack.jsx';
import ControlIcon from '../../../components/ui/ControlIcon.jsx';
import ResponsiveChart from './ResponsiveChart.jsx';
import React from 'react';
import { asset } from '../../../lib/assets.js';
import { useProductView } from '../../../app/providers/ProductProvider.jsx';
import {
  AnalyticsTabs,
  AnalyticsFilters,
  FilteredAnalyticsSummary,
  AnalyticsInteractions,
  AnalyticsSmallSelect,
} from './AnalyticsControls.jsx';
import './analytics.css';

const imgInfo = asset('preview/trends-imgInfo.svg');
const imgSeriesMarker = asset('preview/trends-imgSeriesMarker.svg');
const imgSeriesMarker1 = asset('preview/trends-imgSeriesMarker1.svg');

const imgTrendPoint = asset('preview/trends-imgTrendPoint.svg');
const imgTrendPoint1 = asset('preview/trends-imgTrendPoint1.svg');
const imgTrendLine = asset('preview/trends-imgTrendLine.svg');
const imgTrendLine1 = asset('preview/trends-imgTrendLine1.svg');
const imgScanLine = asset('preview/trends-imgScanLine.svg');
const imgChartNoAxesCombined1 = asset('preview/trends-imgChartNoAxesCombined1.svg');
const imgShieldQuestion = asset('preview/trends-imgShieldQuestion.svg');
export default function TrendsAnalytics() {
  const { tr, analytics } = useProductView();
  return (
    <AnalyticsInteractions kind="trends">
      <div className="an223" data-node-id="466:9230" data-name="Page content">
        <div className="an1" data-node-id="466:9231" data-name="Page introduction">
          <div className="an2" data-node-id="466:9232" data-name="Introduction">
            <p className="an3" data-node-id="466:9233" data-workspace-heading="true">
              <HeadingBack />
              <span>{tr('Trends & Signals')}</span>
            </p>
            <p
              className="an4"
              data-node-id="466:9234"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {tr(
                'Follow historical changes. Separate observed patterns from model-supported signals.',
              )}
            </p>
          </div>
          <button
            type="button"
            className="an5 ui-control ui-export"
            data-node-id="466:9235"
            data-name="Action"
          >
            <div className="an6" data-node-id="466:9236" data-name="Icon">
              <div className="an7">
                <ControlIcon name="export" />
              </div>
            </div>
            <p
              className="an9"
              data-node-id="466:9237"
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
            <div className="an10" data-node-id="466:9266" data-name="Sample data context">
              <div className="an11" data-node-id="466:9267" data-name="info">
                <img alt="" className="an12" src={imgInfo} />
              </div>
              <p
                className="an13"
                data-node-id="466:9269"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {tr(
                  'Illustrative sample data \u00b7 1,248 responses \u00b7 12 Sep\u20139 Oct 2026 \u00b7 Not connected to live analysis',
                )}
              </p>
              <div className="an14" data-node-id="466:9270" data-name="Status">
                <p
                  className="an15"
                  data-node-id="466:9271"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('Sample workspace')}
                </p>
              </div>
            </div>
            <div className="an16" data-node-id="466:9272" data-name="Historical metrics">
              <div className="an17" data-node-id="466:9273" data-name="Key metric">
                <div className="an18" data-node-id="466:9274" data-name="Metric heading">
                  <p
                    className="an19"
                    data-node-id="466:9275"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Selected aspect')}
                  </p>
                </div>
                <p
                  className="an21"
                  data-node-id="466:9276"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('Speed')}
                </p>
                <p
                  className="an22"
                  data-node-id="466:9277"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('Historical sample \u00b7 score out of 10')}
                </p>
              </div>
              <div className="an17" data-node-id="466:9278" data-name="Key metric">
                <div className="an18" data-node-id="466:9279" data-name="Metric heading">
                  <p
                    className="an19"
                    data-node-id="466:9280"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Period aspect score')}
                  </p>
                </div>
                <p
                  className="an21"
                  data-node-id="466:9281"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('5.8 / 10')}
                </p>
                <p
                  className="an22"
                  data-node-id="466:9282"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('360 Speed mentions in this period')}
                </p>
              </div>
              <div className="an17" data-node-id="466:9283" data-name="Key metric">
                <div className="an18" data-node-id="466:9284" data-name="Metric heading">
                  <p
                    className="an19"
                    data-node-id="466:9285"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Latest weekly score')}
                  </p>
                </div>
                <p
                  className="an21"
                  data-node-id="466:9286"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('5.7 / 10')}
                </p>
                <p
                  className="an22"
                  data-node-id="466:9287"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('3\u20139 Oct 2026 \u00b7 114 mentions')}
                </p>
              </div>
              <div className="an17" data-node-id="466:9288" data-name="Key metric">
                <div className="an18" data-node-id="466:9289" data-name="Metric heading">
                  <p
                    className="an19"
                    data-node-id="466:9290"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('First-to-last week')}
                  </p>
                </div>
                <p
                  className="an21"
                  data-node-id="466:9291"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('\u22120.5 pts')}
                </p>
                <p
                  className="an22"
                  data-node-id="466:9292"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('Observed sample change \u00b7 not a prediction')}
                </p>
              </div>
            </div>
            <div className="an170" data-node-id="466:9293" data-name="Trends Overview">
              <div className="an84" data-node-id="466:9294" data-name="Section heading">
                <div className="an85" data-node-id="466:9295" data-name="Heading">
                  <p
                    className="an27"
                    data-node-id="466:9296"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Trends Overview')}
                  </p>
                  <p
                    className="an28"
                    data-node-id="466:9297"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr(
                      'Historical aspect scores \u00b7 12 Sep\u20139 Oct 2026 \u00b7 weekly aggregation',
                    )}
                  </p>
                </div>
                <p
                  className="an171"
                  data-node-id="466:9298"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('Aspect: Speed ')}
                </p>
              </div>
              <div className="an1" data-node-id="466:9299" data-name="Trend controls">
                <div className="an47" data-node-id="466:9300" data-name="Chart legend">
                  <div className="an48" data-node-id="466:9301" data-name="Legend item">
                    <div className="an40" data-node-id="466:9302" data-name="Series marker">
                      <img alt="" className="an12" src={imgSeriesMarker} />
                    </div>
                    <p
                      className="an22"
                      data-node-id="466:9303"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Speed')}
                    </p>
                  </div>
                  <div className="an48" data-node-id="466:9304" data-name="Legend item">
                    <div className="an40" data-node-id="466:9305" data-name="Series marker">
                      <img alt="" className="an12" src={imgSeriesMarker1} />
                    </div>
                    <p
                      className="an22"
                      data-node-id="466:9306"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Product Quality')}
                    </p>
                  </div>
                </div>
                <div className="an174" data-node-id="466:9307" data-name="Chart settings">
                  <div className="an14" data-node-id="466:9308" data-name="Status">
                    <p
                      className="an15"
                      data-node-id="466:9309"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Score / 10')}
                    </p>
                  </div>
                  <AnalyticsSmallSelect kind="weekly" />
                </div>
              </div>
              <div
                className="an226"
                data-node-id="466:9314"
                data-name="Historical trend and context"
              >
                <ResponsiveChart width={792} height={235} fillDesktop>
                  <div className="an227" data-node-id="466:9315" data-name="Historical trend chart">
                    <p
                      className="an228"
                      data-node-id="466:9316"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('3\u20139 Oct')}
                    </p>
                    <p
                      className="an229"
                      data-node-id="466:9317"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('26 Sep\u20132 Oct')}
                    </p>
                    <p
                      className="an230"
                      data-node-id="466:9318"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('19\u201325 Sep')}
                    </p>
                    <p
                      className="an231"
                      data-node-id="466:9319"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('12\u201318 Sep')}
                    </p>
                    <div className="an232" data-node-id="466:9320" data-name="Trend point">
                      <img alt="" className="an12" src={imgTrendPoint} />
                    </div>
                    <div className="an233" data-node-id="466:9321" data-name="Trend point">
                      <img alt="" className="an12" src={imgTrendPoint} />
                    </div>
                    <div className="an234" data-node-id="466:9322" data-name="Trend point">
                      <img alt="" className="an12" src={imgTrendPoint} />
                    </div>
                    <div className="an235" data-node-id="466:9323" data-name="Trend point">
                      <img alt="" className="an12" src={imgTrendPoint} />
                    </div>
                    <div className="an236" data-node-id="466:9324" data-name="Trend point">
                      <img alt="" className="an12" src={imgTrendPoint1} />
                    </div>
                    <div className="an237" data-node-id="466:9325" data-name="Trend point">
                      <img alt="" className="an12" src={imgTrendPoint1} />
                    </div>
                    <div className="an238" data-node-id="466:9326" data-name="Trend point">
                      <img alt="" className="an12" src={imgTrendPoint1} />
                    </div>
                    <div className="an239" data-node-id="466:9327" data-name="Trend point">
                      <img alt="" className="an12" src={imgTrendPoint1} />
                    </div>
                    <div className="an240" data-node-id="466:9328" data-name="Trend line">
                      <div className="an241">
                        <img alt="" className="an8" src={imgTrendLine} />
                      </div>
                    </div>
                    <div className="an242" data-node-id="466:9329" data-name="Trend line">
                      <div className="an243">
                        <img alt="" className="an8" src={imgTrendLine1} />
                      </div>
                    </div>
                    <div className="an244" data-node-id="466:9330" data-name="Axis tick">
                      <div className="an245" data-node-id="466:9331" data-name="Grid line" />
                      <p
                        className="an79"
                        data-node-id="466:9332"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('10')}
                      </p>
                    </div>
                    <div className="an246" data-node-id="466:9333" data-name="Axis tick">
                      <div className="an245" data-node-id="466:9334" data-name="Grid line" />
                      <p
                        className="an79"
                        data-node-id="466:9335"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('7.5')}
                      </p>
                    </div>
                    <div className="an247" data-node-id="466:9336" data-name="Axis tick">
                      <div className="an245" data-node-id="466:9337" data-name="Grid line" />
                      <p
                        className="an79"
                        data-node-id="466:9338"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('5')}
                      </p>
                    </div>
                    <div className="an248" data-node-id="466:9339" data-name="Axis tick">
                      <div className="an245" data-node-id="466:9340" data-name="Grid line" />
                      <p
                        className="an79"
                        data-node-id="466:9341"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('2.5')}
                      </p>
                    </div>
                    <div className="an249" data-node-id="466:9342" data-name="Axis tick">
                      <div className="an245" data-node-id="466:9343" data-name="Grid line" />
                      <p
                        className="an79"
                        data-node-id="466:9344"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('0')}
                      </p>
                    </div>
                  </div>
                </ResponsiveChart>
                <div className="an250" data-node-id="466:9345" data-name="Historical context">
                  <div className="an14" data-node-id="466:9346" data-name="Status">
                    <p
                      className="an15"
                      data-node-id="466:9347"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Historical only')}
                    </p>
                  </div>
                  <p
                    className="an175"
                    data-node-id="466:9348"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Speed softened while Product Quality stayed strong.')}
                  </p>
                  <p
                    className="an251"
                    data-node-id="466:9349"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr(
                      'Speed moves from 6.2 to 5.7 in this sample. The chart describes the past; it does not determine a cause or forecast the next period.',
                    )}
                  </p>
                </div>
              </div>
              <p
                className="an22"
                data-node-id="466:9350"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {tr(
                  'Solid lines show illustrative historical values only. No predicted values or confidence bands are available.',
                )}
              </p>
            </div>
            <div className="an23" data-node-id="466:9351" data-name="Historical evidence">
              <div className="an46" data-node-id="466:9352" data-name="Weekly breakdown">
                <div className="an25" data-node-id="466:9353" data-name="Section heading">
                  <div className="an26" data-node-id="466:9354" data-name="Heading">
                    <p
                      className="an27"
                      data-node-id="466:9355"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Weekly breakdown')}
                    </p>
                    <p
                      className="an28"
                      data-node-id="466:9356"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Speed \u00b7 the sample behind the chart')}
                    </p>
                  </div>
                </div>
                <div className="an252" data-node-id="466:9357" data-name="Trend evidence table">
                  <div className="an253" data-node-id="466:9358" data-name="Table header">
                    <p
                      className="an254"
                      data-node-id="466:9359"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('WEEK')}
                    </p>
                    <p
                      className="an255"
                      data-node-id="466:9360"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('ALL RESPONSES')}
                    </p>
                    <p
                      className="an255"
                      data-node-id="466:9361"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('SPEED MENTIONS')}
                    </p>
                    <p
                      className="an115"
                      data-node-id="466:9362"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('SCORE / 10')}
                    </p>
                  </div>
                  <div className="an256" data-node-id="466:9363" data-name="Weekly result">
                    <p
                      className="an257"
                      data-node-id="466:9364"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('12\u201318 Sep 2026')}
                    </p>
                    <p
                      className="an258"
                      data-node-id="466:9365"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('248')}
                    </p>
                    <p
                      className="an258"
                      data-node-id="466:9366"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('68')}
                    </p>
                    <p
                      className="an259"
                      data-node-id="466:9367"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('6.2')}
                    </p>
                  </div>
                  <div className="an256" data-node-id="466:9368" data-name="Weekly result">
                    <p
                      className="an257"
                      data-node-id="466:9369"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('19\u201325 Sep 2026')}
                    </p>
                    <p
                      className="an258"
                      data-node-id="466:9370"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('294')}
                    </p>
                    <p
                      className="an258"
                      data-node-id="466:9371"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('82')}
                    </p>
                    <p
                      className="an259"
                      data-node-id="466:9372"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('5.9')}
                    </p>
                  </div>
                  <div className="an256" data-node-id="466:9373" data-name="Weekly result">
                    <p
                      className="an257"
                      data-node-id="466:9374"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('26 Sep\u20132 Oct 2026')}
                    </p>
                    <p
                      className="an258"
                      data-node-id="466:9375"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('326')}
                    </p>
                    <p
                      className="an258"
                      data-node-id="466:9376"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('96')}
                    </p>
                    <p
                      className="an259"
                      data-node-id="466:9377"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('5.6')}
                    </p>
                  </div>
                  <div className="an256" data-node-id="466:9378" data-name="Weekly result">
                    <p
                      className="an257"
                      data-node-id="466:9379"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('3\u20139 Oct 2026')}
                    </p>
                    <p
                      className="an258"
                      data-node-id="466:9380"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('380')}
                    </p>
                    <p
                      className="an258"
                      data-node-id="466:9381"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('114')}
                    </p>
                    <p
                      className="an259"
                      data-node-id="466:9382"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('5.7')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="an24" data-node-id="466:9383" data-name="Analysis availability">
                <div className="an25" data-node-id="466:9384" data-name="Section heading">
                  <div className="an26" data-node-id="466:9385" data-name="Heading">
                    <p
                      className="an27"
                      data-node-id="466:9386"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Analysis availability')}
                    </p>
                    <p
                      className="an28"
                      data-node-id="466:9387"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Live model output has not been supplied')}
                    </p>
                  </div>
                </div>
                <p
                  className="an93"
                  data-node-id="466:9388"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr(
                    'Historical sample charts are available for design preview. Automated signals will appear only when the analysis system returns them.',
                  )}
                </p>
                <div className="an260" data-node-id="466:9389" data-name="Result availability">
                  <div className="an18" data-node-id="466:9390" data-name="Capability result">
                    <p
                      className="an261"
                      data-node-id="466:9391"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Anomaly detection')}
                    </p>
                    <p
                      className="an262"
                      data-node-id="466:9392"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Not returned')}
                    </p>
                  </div>
                  <div className="an18" data-node-id="466:9393" data-name="Capability result">
                    <p
                      className="an261"
                      data-node-id="466:9394"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Satisfaction forecast')}
                    </p>
                    <p
                      className="an262"
                      data-node-id="466:9395"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Not returned')}
                    </p>
                  </div>
                  <div className="an18" data-node-id="466:9396" data-name="Capability result">
                    <p
                      className="an261"
                      data-node-id="466:9397"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('At-risk aspect assessment')}
                    </p>
                    <p
                      className="an262"
                      data-node-id="466:9398"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Not returned')}
                    </p>
                  </div>
                </div>
                <p
                  className="an45"
                  data-node-id="466:9399"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('Unavailable does not mean \u201cno issues detected.\u201d')}
                </p>
              </div>
            </div>
            <div className="an217" data-node-id="466:9400" data-name="Model-supported capabilities">
              <div className="an263" data-node-id="466:9401" data-name="Anomaly Alerts">
                <div className="an25" data-node-id="466:9402" data-name="Section heading">
                  <div className="an26" data-node-id="466:9403" data-name="Heading">
                    <p
                      className="an27"
                      data-node-id="466:9404"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Anomaly Alerts')}
                    </p>
                    <p
                      className="an28"
                      data-node-id="466:9405"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Requires returned analysis results')}
                    </p>
                  </div>
                </div>
                <div className="an264" data-node-id="466:9406" data-name="Availability state">
                  <div className="an265" data-node-id="466:9407" data-name="Capability symbol">
                    <div className="an266" data-node-id="466:9408" data-name="scan-line">
                      <img alt="" className="an12" src={imgScanLine} />
                    </div>
                  </div>
                  <div className="an14" data-node-id="466:9410" data-name="Status">
                    <p
                      className="an15"
                      data-node-id="466:9411"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Not returned')}
                    </p>
                  </div>
                </div>
                <p
                  className="an93"
                  data-node-id="466:9412"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr(
                    'No anomaly results are available for this view. Alerts appear only when a detected change is returned.',
                  )}
                </p>
                <div className="an179" data-node-id="466:9413" data-name="Divider" />
                <p
                  className="an45"
                  data-node-id="466:9414"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('When available: affected aspect, change, relevant period and View Details.')}
                </p>
              </div>
              <div className="an263" data-node-id="466:9415" data-name="Satisfaction Forecast">
                <div className="an25" data-node-id="466:9416" data-name="Section heading">
                  <div className="an26" data-node-id="466:9417" data-name="Heading">
                    <p
                      className="an27"
                      data-node-id="466:9418"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Satisfaction Forecast')}
                    </p>
                    <p
                      className="an28"
                      data-node-id="466:9419"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Requires returned analysis results')}
                    </p>
                  </div>
                </div>
                <div className="an264" data-node-id="466:9420" data-name="Availability state">
                  <div className="an265" data-node-id="466:9421" data-name="Capability symbol">
                    <div
                      className="an266"
                      data-node-id="466:9422"
                      data-name="chart-no-axes-combined"
                    >
                      <img alt="" className="an12" src={imgChartNoAxesCombined1} />
                    </div>
                  </div>
                  <div className="an14" data-node-id="466:9424" data-name="Status">
                    <p
                      className="an15"
                      data-node-id="466:9425"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Not returned')}
                    </p>
                  </div>
                </div>
                <p
                  className="an93"
                  data-node-id="466:9426"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr(
                    'No forecast was returned. Expected direction and forecast period are not shown without model output.',
                  )}
                </p>
                <div className="an179" data-node-id="466:9427" data-name="Divider" />
                <p
                  className="an45"
                  data-node-id="466:9428"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr(
                    'When available: expected direction, forecast horizon and uncertainty, where supplied.',
                  )}
                </p>
              </div>
              <div className="an263" data-node-id="466:9429" data-name="At-Risk Aspects">
                <div className="an25" data-node-id="466:9430" data-name="Section heading">
                  <div className="an26" data-node-id="466:9431" data-name="Heading">
                    <p
                      className="an27"
                      data-node-id="466:9432"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('At-Risk Aspects')}
                    </p>
                    <p
                      className="an28"
                      data-node-id="466:9433"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Requires returned analysis results')}
                    </p>
                  </div>
                </div>
                <div className="an264" data-node-id="466:9434" data-name="Availability state">
                  <div className="an265" data-node-id="466:9435" data-name="Capability symbol">
                    <div className="an266" data-node-id="466:9436" data-name="shield-question">
                      <img alt="" className="an12" src={imgShieldQuestion} />
                    </div>
                  </div>
                  <div className="an14" data-node-id="466:9438" data-name="Status">
                    <p
                      className="an15"
                      data-node-id="466:9439"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Not returned')}
                    </p>
                  </div>
                </div>
                <p
                  className="an93"
                  data-node-id="466:9440"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr(
                    'No risk assessment was returned. Historical declines alone are not labeled as likely future declines.',
                  )}
                </p>
                <div className="an179" data-node-id="466:9441" data-name="Divider" />
                <p
                  className="an45"
                  data-node-id="466:9442"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr(
                    'When available: flagged aspect, assessment period and supporting model context.',
                  )}
                </p>
              </div>
            </div>
            <div className="an109" data-node-id="466:9443" data-name="Analysis footer">
              <p
                className="an110"
                data-node-id="466:9444"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {tr('Bloom & Co. \u00b7 Customer experience survey \u00b7 All languages')}
              </p>
              <p
                className="an110"
                data-node-id="466:9445"
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
