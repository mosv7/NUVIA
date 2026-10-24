import HeadingBack from '../../../components/layout/HeadingBack.jsx';
import ControlIcon from '../../../components/ui/ControlIcon.jsx';
import './ResponsiveChart.jsx';
import React, { useState } from 'react';
import ChoiceMenu from '../../../components/ui/ChoiceMenu.jsx';
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

const imgInfo = asset('preview/aspects-imgInfo.svg');
const imgSeriesMarker = asset('preview/aspects-imgSeriesMarker.svg');
const imgSeriesMarker1 = asset('preview/aspects-imgSeriesMarker1.svg');
const imgSeriesMarker2 = asset('preview/aspects-imgSeriesMarker2.svg');

export default function AspectsAnalytics() {
  const { tr, analytics, formatNumber, language } = useProductView();
  const [trendAspect, setTrendAspect] = useState('Speed');
  const trendData = {
    Speed: { values: [7.1, 6.7, 6.2, 5.8], mentions: 360 },
    Service: { values: [7.5, 7.8, 7.9, 8.1], mentions: 410 },
    Price: { values: [6.2, 6.6, 6.3, 6.5], mentions: 325 },
    Cleanliness: { values: [8.1, 8.3, 8.5, 8.6], mentions: 240 },
    'Product Quality': { values: [8.3, 8.5, 8.7, 8.8], mentions: 640 },
  };
  const trend = trendData[trendAspect];
  return (
    <AnalyticsInteractions kind="aspects">
      <div className="an0" data-node-id="369:7111" data-name="Page content">
        <div className="an1" data-node-id="369:7112" data-name="Page introduction">
          <div className="an2" data-node-id="369:7113" data-name="Introduction">
            <p className="an3" data-node-id="369:7114" data-workspace-heading="true">
              <HeadingBack />
              <span>{tr('Aspect-Based Analysis')}</span>
            </p>
            <p
              className="an4"
              data-node-id="369:7115"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {tr('Compare the experience by aspect and explore the feedback behind each score.')}
            </p>
          </div>
          <button
            type="button"
            className="an5 ui-control ui-export"
            data-node-id="369:7116"
            data-name="Action"
          >
            <div className="an6" data-node-id="369:7117" data-name="Icon">
              <div className="an7">
                <ControlIcon name="export" />
              </div>
            </div>
            <p
              className="an9"
              data-node-id="369:7118"
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
            <div className="an10" data-node-id="369:7147" data-name="Sample data context">
              <div className="an11" data-node-id="369:7148" data-name="info">
                <img alt="" className="an12" src={imgInfo} />
              </div>
              <p
                className="an13"
                data-node-id="369:7150"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {tr(
                  'Illustrative sample data \u00b7 1,248 responses \u00b7 12 Sep\u20139 Oct 2026 \u00b7 Not connected to live analysis',
                )}
              </p>
              <div className="an14" data-node-id="369:7151" data-name="Status">
                <p
                  className="an15"
                  data-node-id="369:7152"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('Sample workspace')}
                </p>
              </div>
            </div>
            <div className="an16" data-node-id="369:7153" data-name="Aspect metrics">
              <div className="an17" data-node-id="369:7154" data-name="Key metric">
                <div className="an18" data-node-id="369:7155" data-name="Metric heading">
                  <p
                    className="an19"
                    data-node-id="369:7156"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Aspects analyzed')}
                  </p>
                </div>
                <p
                  className="an21"
                  data-node-id="369:7157"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('5')}
                </p>
                <p
                  className="an22"
                  data-node-id="369:7158"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('Across 1,248 sample responses')}
                </p>
              </div>
              <div className="an17" data-node-id="369:7159" data-name="Key metric">
                <div className="an18" data-node-id="369:7160" data-name="Metric heading">
                  <p
                    className="an19"
                    data-node-id="369:7161"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Total aspect mentions')}
                  </p>
                </div>
                <p
                  className="an21"
                  data-node-id="369:7162"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('1,975')}
                </p>
                <p
                  className="an22"
                  data-node-id="369:7163"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('A response may mention several aspects')}
                </p>
              </div>
              <div className="an17" data-node-id="369:7164" data-name="Key metric">
                <div className="an18" data-node-id="369:7165" data-name="Metric heading">
                  <p
                    className="an19"
                    data-node-id="369:7166"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Highest aspect score')}
                  </p>
                </div>
                <p
                  className="an21"
                  data-node-id="369:7167"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('8.8 / 10')}
                </p>
                <p
                  className="an22"
                  data-node-id="369:7168"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('Product Quality \u00b7 640 mentions')}
                </p>
              </div>
              <div className="an17" data-node-id="369:7169" data-name="Key metric">
                <div className="an18" data-node-id="369:7170" data-name="Metric heading">
                  <p
                    className="an19"
                    data-node-id="369:7171"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Selected aspect')}
                  </p>
                </div>
                <p
                  className="an21"
                  data-node-id="369:7172"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {formatNumber(trend.values[3]) + ' / ' + formatNumber(10)}
                </p>
                <p
                  className="an22"
                  data-node-id="369:7173"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('Speed \u00b7 360 mentions')}
                </p>
              </div>
            </div>
            <div className="an23" data-node-id="369:7174" data-name="Aspect score and trend">
              <div className="an46" data-node-id="369:7175" data-name="Aspect score comparison">
                <div className="an25" data-node-id="369:7176" data-name="Section heading">
                  <div className="an26" data-node-id="369:7177" data-name="Heading">
                    <p
                      className="an27"
                      data-node-id="369:7178"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Aspect score comparison')}
                    </p>
                    <p
                      className="an28"
                      data-node-id="369:7179"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Illustrative scores out of 10 \u00b7 select an aspect to explore')}
                    </p>
                  </div>
                </div>
                <div className="an111" data-node-id="369:7180" data-name="Comparison columns">
                  <p
                    className="an112"
                    data-node-id="369:7181"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('ASPECT')}
                  </p>
                  <p
                    className="an113"
                    data-node-id="369:7182"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('SCORE / 10')}
                  </p>
                  <p
                    className="an114"
                    data-node-id="369:7183"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('MENTIONS')}
                  </p>
                  <p
                    className="an115"
                    data-node-id="369:7184"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('SENTIMENT SHARE')}
                  </p>
                </div>
                <div className="an116" data-node-id="369:7185" data-name="Aspect comparison rows">
                  <button
                    type="button"
                    className="an117"
                    data-node-id="369:7186"
                    data-name="Aspect result"
                    aria-pressed={false}
                  >
                    <p
                      className="an118"
                      data-node-id="369:7187"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Service')}
                    </p>
                    <div className="an119" data-node-id="369:7188" data-name="Score plot">
                      <div className="an120" data-node-id="369:7189" data-name="Score track">
                        <div
                          className="an121"
                          data-node-id="369:7190"
                          data-name="Score bar"
                          style={{ width: '81%' }}
                        />
                      </div>
                      <p
                        className="an9"
                        data-node-id="369:7191"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('8.1')}
                      </p>
                    </div>
                    <p
                      className="an122"
                      data-node-id="369:7192"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('410')}
                    </p>
                    <div
                      className="an123"
                      data-node-id="369:7193"
                      data-name="Sentiment distribution"
                    >
                      <div className="an124" data-node-id="369:7194" data-name="Sentiment shares">
                        <div
                          className="an125"
                          data-node-id="369:7195"
                          data-name="Positive share"
                          style={{ width: '81%' }}
                        />
                        <div
                          className="an126"
                          data-node-id="369:7196"
                          data-name="Negative share"
                          style={{ width: '10%' }}
                        />
                        <div
                          className="an127"
                          data-node-id="369:7197"
                          data-name="Other share"
                          style={{ width: '9%' }}
                        />
                      </div>
                      <p
                        className="an128"
                        data-node-id="369:7198"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('81% positive \u00b7 10% negative')}
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    className="an117"
                    data-node-id="369:7199"
                    data-name="Aspect result"
                    aria-pressed={false}
                  >
                    <p
                      className="an118"
                      data-node-id="369:7200"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Price')}
                    </p>
                    <div className="an119" data-node-id="369:7201" data-name="Score plot">
                      <div className="an120" data-node-id="369:7202" data-name="Score track">
                        <div
                          className="an129"
                          data-node-id="369:7203"
                          data-name="Score bar"
                          style={{ width: '65%' }}
                        />
                      </div>
                      <p
                        className="an9"
                        data-node-id="369:7204"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('6.5')}
                      </p>
                    </div>
                    <p
                      className="an122"
                      data-node-id="369:7205"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('325')}
                    </p>
                    <div
                      className="an123"
                      data-node-id="369:7206"
                      data-name="Sentiment distribution"
                    >
                      <div className="an124" data-node-id="369:7207" data-name="Sentiment shares">
                        <div
                          className="an130"
                          data-node-id="369:7208"
                          data-name="Positive share"
                          style={{ width: '65%' }}
                        />
                        <div
                          className="an131"
                          data-node-id="369:7209"
                          data-name="Negative share"
                          style={{ width: '20%' }}
                        />
                        <div
                          className="an132"
                          data-node-id="369:7210"
                          data-name="Other share"
                          style={{ width: '15%' }}
                        />
                      </div>
                      <p
                        className="an128"
                        data-node-id="369:7211"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('65% positive \u00b7 20% negative')}
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    className="an117"
                    data-node-id="369:7212"
                    data-name="Aspect result"
                    aria-pressed={false}
                  >
                    <p
                      className="an118"
                      data-node-id="369:7213"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Speed')}
                    </p>
                    <div className="an119" data-node-id="369:7214" data-name="Score plot">
                      <div className="an120" data-node-id="369:7215" data-name="Score track">
                        <div
                          className="an135"
                          data-node-id="369:7216"
                          data-name="Score bar"
                          style={{ width: '58%' }}
                        />
                      </div>
                      <p
                        className="an9"
                        data-node-id="369:7217"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('5.8')}
                      </p>
                    </div>
                    <p
                      className="an122"
                      data-node-id="369:7218"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('360')}
                    </p>
                    <div
                      className="an123"
                      data-node-id="369:7219"
                      data-name="Sentiment distribution"
                    >
                      <div className="an124" data-node-id="369:7220" data-name="Sentiment shares">
                        <div
                          className="an136"
                          data-node-id="369:7221"
                          data-name="Positive share"
                          style={{ width: '42%' }}
                        />
                        <div
                          className="an137"
                          data-node-id="369:7222"
                          data-name="Negative share"
                          style={{ width: '43%' }}
                        />
                        <div
                          className="an132"
                          data-node-id="369:7223"
                          data-name="Other share"
                          style={{ width: '15%' }}
                        />
                      </div>
                      <p
                        className="an128"
                        data-node-id="369:7224"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('42% positive \u00b7 43% negative')}
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    className="an117"
                    data-node-id="369:7225"
                    data-name="Aspect result"
                    aria-pressed={false}
                  >
                    <p
                      className="an118"
                      data-node-id="369:7226"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Cleanliness')}
                    </p>
                    <div className="an119" data-node-id="369:7227" data-name="Score plot">
                      <div className="an120" data-node-id="369:7228" data-name="Score track">
                        <div
                          className="an138"
                          data-node-id="369:7229"
                          data-name="Score bar"
                          style={{ width: '86%' }}
                        />
                      </div>
                      <p
                        className="an9"
                        data-node-id="369:7230"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('8.6')}
                      </p>
                    </div>
                    <p
                      className="an122"
                      data-node-id="369:7231"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('240')}
                    </p>
                    <div
                      className="an123"
                      data-node-id="369:7232"
                      data-name="Sentiment distribution"
                    >
                      <div className="an124" data-node-id="369:7233" data-name="Sentiment shares">
                        <div
                          className="an139"
                          data-node-id="369:7234"
                          data-name="Positive share"
                          style={{ width: '88%' }}
                        />
                        <div
                          className="an140"
                          data-node-id="369:7235"
                          data-name="Negative share"
                          style={{ width: '7%' }}
                        />
                        <div
                          className="an141"
                          data-node-id="369:7236"
                          data-name="Other share"
                          style={{ width: '5%' }}
                        />
                      </div>
                      <p
                        className="an128"
                        data-node-id="369:7237"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('88% positive \u00b7 7% negative')}
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    className="an117"
                    data-node-id="369:7238"
                    data-name="Aspect result"
                    aria-pressed={false}
                  >
                    <p
                      className="an118"
                      data-node-id="369:7239"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Product Quality')}
                    </p>
                    <div className="an119" data-node-id="369:7240" data-name="Score plot">
                      <div className="an120" data-node-id="369:7241" data-name="Score track">
                        <div
                          className="an142"
                          data-node-id="369:7242"
                          data-name="Score bar"
                          style={{ width: '88%' }}
                        />
                      </div>
                      <p
                        className="an9"
                        data-node-id="369:7243"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('8.8')}
                      </p>
                    </div>
                    <p
                      className="an122"
                      data-node-id="369:7244"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('640')}
                    </p>
                    <div
                      className="an123"
                      data-node-id="369:7245"
                      data-name="Sentiment distribution"
                    >
                      <div className="an124" data-node-id="369:7246" data-name="Sentiment shares">
                        <div
                          className="an143"
                          data-node-id="369:7247"
                          data-name="Positive share"
                          style={{ width: '86%' }}
                        />
                        <div
                          className="an144"
                          data-node-id="369:7248"
                          data-name="Negative share"
                          style={{ width: '8%' }}
                        />
                        <div
                          className="an145"
                          data-node-id="369:7249"
                          data-name="Other share"
                          style={{ width: '6%' }}
                        />
                      </div>
                      <p
                        className="an128"
                        data-node-id="369:7250"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('86% positive \u00b7 8% negative')}
                      </p>
                    </div>
                  </button>
                </div>
                <div className="an146" data-node-id="369:7251" data-name="Score axis">
                  <p
                    className="an110"
                    data-node-id="369:7252"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('0')}
                  </p>
                  <p
                    className="an110"
                    data-node-id="369:7253"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('5')}
                  </p>
                  <p
                    className="an110"
                    data-node-id="369:7254"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('10')}
                  </p>
                </div>
                <div className="an47" data-node-id="369:7255" data-name="Chart legend">
                  <div className="an48" data-node-id="369:7256" data-name="Legend item">
                    <div className="an40" data-node-id="369:7257" data-name="Series marker">
                      <img alt="" className="an12" src={imgSeriesMarker} />
                    </div>
                    <p
                      className="an22"
                      data-node-id="369:7258"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Positive')}
                    </p>
                  </div>
                  <div className="an48" data-node-id="369:7259" data-name="Legend item">
                    <div className="an40" data-node-id="369:7260" data-name="Series marker">
                      <img alt="" className="an12" src={imgSeriesMarker1} />
                    </div>
                    <p
                      className="an22"
                      data-node-id="369:7261"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Negative')}
                    </p>
                  </div>
                  <div className="an48" data-node-id="369:7262" data-name="Legend item">
                    <div className="an40" data-node-id="369:7263" data-name="Series marker">
                      <img alt="" className="an12" src={imgSeriesMarker2} />
                    </div>
                    <p
                      className="an22"
                      data-node-id="369:7264"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Neutral / Mixed')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="an24" data-node-id="369:7265" data-name="Speed over time">
                <div className="an147" data-node-id="369:7266" data-name="Section heading">
                  <div className="an26" data-node-id="369:7267" data-name="Heading">
                    <p
                      className="an27"
                      data-node-id="369:7268"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr(trendAspect) + ' · ' + (language === 'ar' ? 'مع الوقت' : 'over time')}
                    </p>
                    <p
                      className="an28"
                      data-node-id="369:7269"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Weekly aspect score \u00b7 out of 10')}
                    </p>
                  </div>
                  <div className="analytics-trend-select">
                    <ChoiceMenu
                      label={tr('Aspect')}
                      value={trendAspect}
                      onChange={setTrendAspect}
                      options={Object.keys(trendData).map((value) => ({ value, label: tr(value) }))}
                      icon={false}
                      density="compact"
                    />
                  </div>
                </div>
                <div className="an1" data-node-id="369:7274" data-name="Selected aspect summary">
                  <p
                    className="an21"
                    data-node-id="369:7275"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {formatNumber(trend.values[3]) + ' / ' + formatNumber(10)}
                  </p>
                  <div className="an14" data-node-id="369:7276" data-name="Status">
                    <p
                      className="an15"
                      data-node-id="369:7277"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {formatNumber(trend.mentions) + ' ' + tr('mentions')}
                    </p>
                  </div>
                </div>
                <svg
                  className="analytics-live-trend"
                  viewBox="0 0 396 206"
                  role="img"
                  aria-label={tr(trendAspect)}
                >
                  {[0, 2.5, 5, 7.5, 10].map((n) => (
                    <g key={n}>
                      <line x1="35" x2="380" y1={170 - n * 15} y2={170 - n * 15} stroke="#e3eaf4" />
                      <text x="24" y={174 - n * 15} textAnchor="end">
                        {formatNumber(n)}
                      </text>
                    </g>
                  ))}
                  <polyline
                    points={trend.values
                      .map((n, i) => 50 + i * 105 + ',' + (170 - n * 15))
                      .join(' ')}
                    fill="none"
                    stroke="#1e68ef"
                    strokeWidth="2.5"
                  />
                  {trend.values.map((n, i) => (
                    <g key={i}>
                      <circle cx={50 + i * 105} cy={170 - n * 15} r="4" fill="#1e68ef">
                        <title>{formatNumber(n) + ' / 10'}</title>
                      </circle>
                      <text x={50 + i * 105} y="195" textAnchor="middle">
                        {tr(['12–18 Sep', '19–25 Sep', '26 Sep–2 Oct', '3–9 Oct'][i])}
                      </text>
                    </g>
                  ))}
                </svg>
                <div className="an168" data-node-id="369:7303" data-name="Chart legend">
                  <div className="an48" data-node-id="369:7304" data-name="Legend item">
                    <div className="an40" data-node-id="369:7305" data-name="Series marker">
                      <img alt="" className="an12" src={imgSeriesMarker} />
                    </div>
                    <p
                      className="an22"
                      data-node-id="369:7306"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr(trendAspect) + ' / ' + formatNumber(10)}
                    </p>
                  </div>
                </div>
                <p
                  className="an169"
                  data-node-id="369:7307"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr(
                    'Historical sample only. A lower score is not a predicted decline or an automated risk flag.',
                  )}
                </p>
              </div>
            </div>
            <div className="an170" data-node-id="369:7308" data-name="Speed · related feedback">
              <div className="an84" data-node-id="369:7309" data-name="Section heading">
                <div className="an85" data-node-id="369:7310" data-name="Heading">
                  <p
                    className="an27"
                    data-node-id="369:7311"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Speed \u00b7 related feedback')}
                  </p>
                  <p
                    className="an28"
                    data-node-id="369:7312"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('360 illustrative mentions · sample feedback below')}
                  </p>
                </div>
                <p
                  className="an171"
                  data-node-id="369:7313"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {<AnalyticsArrowText text={tr('View Related Responses \u2192')} />}
                </p>
              </div>
              <div className="an172" data-node-id="369:7314" data-name="Selected aspect detail">
                <div className="an173" data-node-id="369:7315" data-name="Aspect context">
                  <div className="an174" data-node-id="369:7316" data-name="Aspect labels">
                    <div className="an88" data-node-id="369:7317" data-name="Status">
                      <p
                        className="an89"
                        data-node-id="369:7318"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Selected aspect')}
                      </p>
                    </div>
                    <div className="an14" data-node-id="369:7319" data-name="Status">
                      <p
                        className="an15"
                        data-node-id="369:7320"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Sample')}
                      </p>
                    </div>
                  </div>
                  <p
                    className="an175"
                    data-node-id="369:7321"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Feedback about waiting, checkout and order preparation.')}
                  </p>
                  <div className="an176" data-node-id="369:7322" data-name="Aspect distribution">
                    <div className="an18" data-node-id="369:7323" data-name="Sentiment result">
                      <p
                        className="an177"
                        data-node-id="369:7324"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Positive')}
                      </p>
                      <p
                        className="an178"
                        data-node-id="369:7325"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('42%')}
                      </p>
                    </div>
                    <div className="an18" data-node-id="369:7326" data-name="Sentiment result">
                      <p
                        className="an177"
                        data-node-id="369:7327"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Negative')}
                      </p>
                      <p
                        className="an178"
                        data-node-id="369:7328"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('43%')}
                      </p>
                    </div>
                    <div className="an18" data-node-id="369:7329" data-name="Sentiment result">
                      <p
                        className="an177"
                        data-node-id="369:7330"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Neutral / Mixed')}
                      </p>
                      <p
                        className="an178"
                        data-node-id="369:7331"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('15%')}
                      </p>
                    </div>
                  </div>
                  <div className="an179" data-node-id="369:7332" data-name="Divider" />
                  <p
                    className="an169"
                    data-node-id="369:7333"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr(
                      'Mentions include positive and negative opinions. Related quotes illustrate a theme, not its frequency.',
                    )}
                  </p>
                </div>
                <div className="an180" data-node-id="369:7334" data-name="Related feedback">
                  <button
                    type="button"
                    className="an90"
                    data-node-id="369:7335"
                    data-name="Related response"
                  >
                    <div className="an18" data-node-id="369:7336" data-name="Response metadata">
                      <p
                        className="an22"
                        data-node-id="369:7337"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('R-1032 \u00b7 Cairo \u00b7 7 Oct 2026 \u00b7 English')}
                      </p>
                      <div className="an181" data-node-id="369:7338" data-name="Sentiment">
                        <p
                          className="an92"
                          data-node-id="369:7339"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('Mixed')}
                        </p>
                      </div>
                    </div>
                    <p
                      className="an93"
                      data-node-id="369:7340"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr(
                        '\u201cThe coffee was good. We waited 25 minutes for our order. I\u2019d visit again if service is quicker.\u201d',
                      )}
                    </p>
                  </button>
                  <div className="an182" data-node-id="369:7341" data-name="Matched sentence">
                    <div className="an183" data-node-id="369:7342" data-name="Status">
                      <p
                        className="an98"
                        data-node-id="369:7343"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Speed \u00b7 Negative')}
                      </p>
                    </div>
                    <p
                      className="an19"
                      data-node-id="369:7344"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Matched sentence: \u201cWe waited 25 minutes for our order.\u201d')}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="an94"
                    data-node-id="369:7345"
                    data-name="Related response"
                  >
                    <div className="an18" data-node-id="369:7346" data-name="Response metadata">
                      <p
                        className="an22"
                        data-node-id="369:7347"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('R-1008 \u00b7 Cairo \u00b7 5 Oct 2026 \u00b7 English')}
                      </p>
                      <div className="an183" data-node-id="369:7348" data-name="Status">
                        <p
                          className="an184"
                          data-node-id="369:7349"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('Negative')}
                        </p>
                      </div>
                    </div>
                    <p
                      className="an93"
                      data-node-id="369:7350"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('\u201cI waited too long to pay, even with only a few items.\u201d')}
                    </p>
                  </button>
                  <button
                    type="button"
                    className="an94"
                    data-node-id="369:7351"
                    data-name="Related response"
                  >
                    <div className="an18" data-node-id="369:7352" data-name="Response metadata">
                      <p
                        className="an22"
                        data-node-id="369:7353"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('R-0984 \u00b7 El Zamalek \u00b7 3 Oct 2026 \u00b7 English')}
                      </p>
                      <div className="an185" data-node-id="369:7354" data-name="Status">
                        <p
                          className="an96"
                          data-node-id="369:7355"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('Positive')}
                        </p>
                      </div>
                    </div>
                    <p
                      className="an93"
                      data-node-id="369:7356"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr(
                        '\u201cMy order was ready before I found a seat. A quick start to the day.\u201d',
                      )}
                    </p>
                  </button>
                </div>
              </div>
            </div>
            <div className="an186" data-node-id="369:7357" data-name="Score methodology">
              <p
                className="an187"
                data-node-id="369:7358"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {tr('How to read this view')}
              </p>
              <p
                className="an188"
                data-node-id="369:7359"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {tr(
                  'Scores are illustrative model-derived values, not customer ratings or positive percentages \u00d7 10. Sentiment share uses mentions of each aspect as its denominator; neutral and mixed mentions are grouped in this comparison.',
                )}
              </p>
            </div>
            <div className="an109" data-node-id="369:7360" data-name="Analysis footer">
              <p
                className="an110"
                data-node-id="369:7361"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {tr('Bloom & Co. \u00b7 Customer experience survey \u00b7 All languages')}
              </p>
              <p
                className="an110"
                data-node-id="369:7362"
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
