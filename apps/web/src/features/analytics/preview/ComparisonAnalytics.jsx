import ControlIcon from '../../../components/ui/ControlIcon.jsx';
import ResponsiveChart from './ResponsiveChart.jsx';
import React from 'react';
import { asset } from '../../../lib/assets.js';
import { useProductView } from '../../../app/providers/ProductProvider.jsx';
import {
  AnalyticsTabs,
  AnalyticsFilters,
  ComparisonScope,
  FilteredAnalyticsSummary,
  AnalyticsInteractions,
} from './AnalyticsControls.jsx';
import './analytics.css';
const imgIcon = asset('preview/comparison-imgIcon.svg');
const imgInfo = asset('preview/comparison-imgInfo.svg');
const imgSeriesMarker = asset('preview/comparison-imgSeriesMarker.svg');
const imgSeriesMarker1 = asset('preview/comparison-imgSeriesMarker1.svg');
const imgSeriesMarker2 = asset('preview/comparison-imgSeriesMarker2.svg');
export default function ComparisonAnalytics() {
  const { tr, analytics } = useProductView();
  return (
    <AnalyticsInteractions kind="comparison">
      <div className="an0" data-node-id="475:9550" data-name="Page content">
        <div className="an1" data-node-id="475:9551" data-name="Page introduction">
          <div className="an2" data-node-id="475:9552" data-name="Introduction">
            <p className="an3" data-node-id="475:9553">
              {tr('Branch Comparison')}
            </p>
            <p
              className="an4"
              data-node-id="475:9554"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {tr(
                'Compare experience performance across branches, surveys, and time periods using the same filter context.',
              )}
            </p>
          </div>
          <button
            type="button"
            className="an5 ui-control ui-export"
            data-node-id="475:9555"
            data-name="Action"
          >
            <div className="an6" data-node-id="475:9556" data-name="Icon">
              <div className="an7">
                <ControlIcon name="export" />
              </div>
            </div>
            <p
              className="an9"
              data-node-id="475:9557"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {tr('Export data')}
            </p>
          </button>
        </div>
        <AnalyticsTabs />
        <AnalyticsFilters />
        <div className="an10" data-node-id="475:9586" data-name="Sample data context">
          <div className="an11" data-node-id="475:9587" data-name="info">
            <img alt="" className="an12" src={imgInfo} />
          </div>
          <p
            className="an13"
            data-node-id="475:9589"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            {tr(
              'Illustrative sample data \u00b7 1,248 responses \u00b7 12 Sep\u20139 Oct 2026 \u00b7 Not connected to live analysis',
            )}
          </p>
          <div className="an14" data-node-id="475:9590" data-name="Status">
            <p
              className="an15"
              data-node-id="475:9591"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {tr('Sample workspace')}
            </p>
          </div>
        </div>
        <ComparisonScope />
        {analytics.changed ? (
          <FilteredAnalyticsSummary />
        ) : (
          <>
            <div className="an16" data-node-id="475:9616" data-name="Dimension metrics">
              <div className="an17" data-node-id="475:9617" data-name="Key metric">
                <div className="an18" data-node-id="475:9618" data-name="Metric heading">
                  <p
                    className="an19"
                    data-node-id="475:9619"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Responses in selected branches')}
                  </p>
                </div>
                <p
                  className="an21"
                  data-node-id="475:9620"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('1,248')}
                </p>
                <p
                  className="an22"
                  data-node-id="475:9621"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('3 branches compared \u00b7 same survey and period')}
                </p>
              </div>
              <div className="an17" data-node-id="475:9622" data-name="Key metric">
                <div className="an18" data-node-id="475:9623" data-name="Metric heading">
                  <p
                    className="an19"
                    data-node-id="475:9624"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Overall positive sentiment')}
                  </p>
                </div>
                <p
                  className="an21"
                  data-node-id="475:9625"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('78.0%')}
                </p>
                <p
                  className="an22"
                  data-node-id="475:9626"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('974 positive responses across selected branches')}
                </p>
              </div>
              <div className="an17" data-node-id="475:9627" data-name="Key metric">
                <div className="an18" data-node-id="475:9628" data-name="Metric heading">
                  <p
                    className="an19"
                    data-node-id="475:9629"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Positive sentiment gap')}
                  </p>
                </div>
                <p
                  className="an21"
                  data-node-id="475:9630"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('8.2 pts')}
                </p>
                <p
                  className="an22"
                  data-node-id="475:9631"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('Cairo vs. El Zamalek branches')}
                </p>
              </div>
            </div>
            <div
              className="an23"
              data-node-id="475:9632"
              data-name="Dimension comparison and differences"
            >
              <div className="an267" data-node-id="475:9633" data-name="Aspect scores by dimension">
                <div className="an25" data-node-id="475:9634" data-name="Section heading">
                  <div className="an26" data-node-id="475:9635" data-name="Heading">
                    <p
                      className="an27"
                      data-node-id="475:9636"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Aspect scores by branch')}
                    </p>
                    <p
                      className="an28"
                      data-node-id="475:9637"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Illustrative aspect score / 10 \u00b7 same survey and dates')}
                    </p>
                  </div>
                </div>
                <div className="an47" data-node-id="475:9638" data-name="Chart legend">
                  <div className="an48" data-node-id="475:9639" data-name="Legend item">
                    <div className="an40" data-node-id="475:9640" data-name="Series marker">
                      <img alt="" className="an12" src={imgSeriesMarker} />
                    </div>
                    <p
                      className="an22"
                      data-node-id="475:9641"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Cairo')}
                    </p>
                  </div>
                  <div className="an48" data-node-id="475:9642" data-name="Legend item">
                    <div className="an40" data-node-id="475:9643" data-name="Series marker">
                      <img alt="" className="an12" src={imgSeriesMarker1} />
                    </div>
                    <p
                      className="an22"
                      data-node-id="475:9644"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Alex')}
                    </p>
                  </div>
                  <div className="an48" data-node-id="475:9645" data-name="Legend item">
                    <div className="an40" data-node-id="475:9646" data-name="Series marker">
                      <img alt="" className="an12" src={imgSeriesMarker2} />
                    </div>
                    <p
                      className="an22"
                      data-node-id="475:9647"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('El Zamalek')}
                    </p>
                  </div>
                </div>
                <ResponsiveChart width={686} height={252}>
                  <div
                    className="an268"
                    data-node-id="475:9648"
                    data-name="Dimension aspect comparison chart"
                  >
                    <div className="an269" data-node-id="475:9649" data-name="Aspect comparison">
                      <p
                        className="an270"
                        data-node-id="475:9650"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Product Quality')}
                      </p>
                      <div className="an271" data-node-id="475:9651" data-name="Dimension score">
                        <p
                          className="an272"
                          data-node-id="475:9652"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('9.0')}
                        </p>
                        <div className="an273" data-node-id="475:9653" data-name="Score bar" />
                      </div>
                      <div className="an274" data-node-id="475:9654" data-name="Dimension score">
                        <p
                          className="an275"
                          data-node-id="475:9655"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('8.6')}
                        </p>
                        <div className="an276" data-node-id="475:9656" data-name="Score bar" />
                      </div>
                      <div className="an277" data-node-id="475:9657" data-name="Dimension score">
                        <p
                          className="an278"
                          data-node-id="475:9658"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('8.9')}
                        </p>
                        <div className="an279" data-node-id="475:9659" data-name="Score bar" />
                      </div>
                    </div>
                    <div className="an280" data-node-id="475:9660" data-name="Aspect comparison">
                      <p
                        className="an270"
                        data-node-id="475:9661"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Cleanliness')}
                      </p>
                      <div className="an271" data-node-id="475:9662" data-name="Dimension score">
                        <p
                          className="an281"
                          data-node-id="475:9663"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('8.7')}
                        </p>
                        <div className="an282" data-node-id="475:9664" data-name="Score bar" />
                      </div>
                      <div className="an274" data-node-id="475:9665" data-name="Dimension score">
                        <p
                          className="an283"
                          data-node-id="475:9666"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('8.3')}
                        </p>
                        <div className="an284" data-node-id="475:9667" data-name="Score bar" />
                      </div>
                      <div className="an277" data-node-id="475:9668" data-name="Dimension score">
                        <p
                          className="an285"
                          data-node-id="475:9669"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('8.8')}
                        </p>
                        <div className="an286" data-node-id="475:9670" data-name="Score bar" />
                      </div>
                    </div>
                    <div className="an287" data-node-id="475:9671" data-name="Aspect comparison">
                      <p
                        className="an270"
                        data-node-id="475:9672"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Speed')}
                      </p>
                      <div className="an271" data-node-id="475:9673" data-name="Dimension score">
                        <p
                          className="an288"
                          data-node-id="475:9674"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('6.0')}
                        </p>
                        <div className="an289" data-node-id="475:9675" data-name="Score bar" />
                      </div>
                      <div className="an274" data-node-id="475:9676" data-name="Dimension score">
                        <p
                          className="an290"
                          data-node-id="475:9677"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('5.2')}
                        </p>
                        <div className="an291" data-node-id="475:9678" data-name="Score bar" />
                      </div>
                      <div className="an277" data-node-id="475:9679" data-name="Dimension score">
                        <p
                          className="an292"
                          data-node-id="475:9680"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('6.2')}
                        </p>
                        <div className="an293" data-node-id="475:9681" data-name="Score bar" />
                      </div>
                    </div>
                    <div className="an294" data-node-id="475:9682" data-name="Aspect comparison">
                      <p
                        className="an270"
                        data-node-id="475:9683"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Price')}
                      </p>
                      <div className="an271" data-node-id="475:9684" data-name="Dimension score">
                        <p
                          className="an295"
                          data-node-id="475:9685"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('6.6')}
                        </p>
                        <div className="an296" data-node-id="475:9686" data-name="Score bar" />
                      </div>
                      <div className="an274" data-node-id="475:9687" data-name="Dimension score">
                        <p
                          className="an297"
                          data-node-id="475:9688"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('6.1')}
                        </p>
                        <div className="an298" data-node-id="475:9689" data-name="Score bar" />
                      </div>
                      <div className="an277" data-node-id="475:9690" data-name="Dimension score">
                        <p
                          className="an299"
                          data-node-id="475:9691"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('6.8')}
                        </p>
                        <div className="an300" data-node-id="475:9692" data-name="Score bar" />
                      </div>
                    </div>
                    <div className="an301" data-node-id="475:9693" data-name="Aspect comparison">
                      <p
                        className="an270"
                        data-node-id="475:9694"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Service')}
                      </p>
                      <div className="an271" data-node-id="475:9695" data-name="Dimension score">
                        <p
                          className="an283"
                          data-node-id="475:9696"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('8.3')}
                        </p>
                        <div className="an302" data-node-id="475:9697" data-name="Score bar" />
                      </div>
                      <div className="an274" data-node-id="475:9698" data-name="Dimension score">
                        <p
                          className="an303"
                          data-node-id="475:9699"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('7.6')}
                        </p>
                        <div className="an304" data-node-id="475:9700" data-name="Score bar" />
                      </div>
                      <div className="an277" data-node-id="475:9701" data-name="Dimension score">
                        <p
                          className="an305"
                          data-node-id="475:9702"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('8.4')}
                        </p>
                        <div className="an306" data-node-id="475:9703" data-name="Score bar" />
                      </div>
                    </div>
                    <div className="an307" data-node-id="475:9704" data-name="Score tick">
                      <div className="an308" data-node-id="475:9705" data-name="Grid line" />
                      <p
                        className="an309"
                        data-node-id="475:9706"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('10')}
                      </p>
                    </div>
                    <div className="an310" data-node-id="475:9707" data-name="Score tick">
                      <div className="an308" data-node-id="475:9708" data-name="Grid line" />
                      <p
                        className="an309"
                        data-node-id="475:9709"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('7.5')}
                      </p>
                    </div>
                    <div className="an311" data-node-id="475:9710" data-name="Score tick">
                      <div className="an308" data-node-id="475:9711" data-name="Grid line" />
                      <p
                        className="an309"
                        data-node-id="475:9712"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('5')}
                      </p>
                    </div>
                    <div className="an312" data-node-id="475:9713" data-name="Score tick">
                      <div className="an308" data-node-id="475:9714" data-name="Grid line" />
                      <p
                        className="an309"
                        data-node-id="475:9715"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('2.5')}
                      </p>
                    </div>
                    <div className="an313" data-node-id="475:9716" data-name="Score tick">
                      <div className="an308" data-node-id="475:9717" data-name="Grid line" />
                      <p
                        className="an309"
                        data-node-id="475:9718"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('0')}
                      </p>
                    </div>
                  </div>
                </ResponsiveChart>
                <p
                  className="an22"
                  data-node-id="475:9719"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr(
                    'Values describe this sample. Differences are not tests of statistical significance.',
                  )}
                </p>
              </div>
              <div className="an314" data-node-id="475:9720" data-name="Notable differences">
                <div className="an25" data-node-id="475:9721" data-name="Section heading">
                  <div className="an26" data-node-id="475:9722" data-name="Heading">
                    <p
                      className="an27"
                      data-node-id="475:9723"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Notable differences')}
                    </p>
                    <p
                      className="an28"
                      data-node-id="475:9724"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Descriptive comparisons \u00b7 illustrative sample')}
                    </p>
                  </div>
                </div>
                <div className="an315" data-node-id="475:9725" data-name="Difference">
                  <p
                    className="an316"
                    data-node-id="475:9726"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Cairo leads on Product Quality')}
                  </p>
                  <p
                    className="an317"
                    data-node-id="475:9727"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Cairo scores 9.0, compared with 8.6 for Alex and 8.7 for El-Zamalek.')}
                  </p>
                </div>
                <div className="an179" data-node-id="475:9728" data-name="Divider" />
                <div className="an315" data-node-id="475:9729" data-name="Difference">
                  <p
                    className="an316"
                    data-node-id="475:9730"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('El Zamalek trails on Speed')}
                  </p>
                  <p
                    className="an317"
                    data-node-id="475:9731"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('El Zamalek scores 6.0, compared with 6.8 for Cairo and 6.1 for Alex.')}
                  </p>
                </div>
                <div className="an179" data-node-id="475:9732" data-name="Divider" />
                <div className="an315" data-node-id="475:9733" data-name="Difference">
                  <p
                    className="an316"
                    data-node-id="475:9734"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Service is strongest in Cairo')}
                  </p>
                  <p
                    className="an317"
                    data-node-id="475:9735"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Cairo scores 8.4, compared with 7.6 for Alex and 8.3 for El-Zamalek.')}
                  </p>
                </div>
              </div>
            </div>
            <div className="an318" data-node-id="475:9736" data-name="Branch comparison">
              <div className="an1" data-node-id="475:9737" data-name="Section heading">
                <div className="an319" data-node-id="475:9738" data-name="Heading copy">
                  <p className="an320" data-node-id="475:9739">
                    {tr('A clearer view of each branch')}
                  </p>
                  <p
                    className="an192"
                    data-node-id="475:9740"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Positive sentiment \u00b7 September')}
                  </p>
                </div>
              </div>
              <div className="an321" data-node-id="475:9741" data-name="Branches">
                <div className="an322" data-node-id="475:9742" data-name="Branch">
                  <div className="an1" data-node-id="475:9743" data-name="Branch heading">
                    <p
                      className="an323"
                      data-node-id="475:9744"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Cairo')}
                    </p>
                    <div className="an324" data-node-id="475:9745" data-name="Status">
                      <p
                        className="an325"
                        data-node-id="475:9746"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Top performer')}
                      </p>
                    </div>
                  </div>
                  <div className="an264" data-node-id="475:9747" data-name="Branch metric">
                    <div
                      className="an326"
                      data-node-id="475:9748"
                      data-name="Branch sentiment track"
                    >
                      <div className="an327" data-node-id="475:9749" data-name="Positive share" />
                    </div>
                    <p
                      className="an328"
                      data-node-id="475:9750"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('81.9%')}
                    </p>
                    <p
                      className="an329"
                      data-node-id="475:9751"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('540 reviews')}
                    </p>
                  </div>
                </div>
                <div className="an322" data-node-id="475:9752" data-name="Branch">
                  <div className="an1" data-node-id="475:9753" data-name="Branch heading">
                    <p
                      className="an323"
                      data-node-id="475:9754"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('El Zamalek')}
                    </p>
                    <div className="an330" data-node-id="475:9755" data-name="Status">
                      <p
                        className="an331"
                        data-node-id="475:9756"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('On track')}
                      </p>
                    </div>
                  </div>
                  <div className="an264" data-node-id="475:9757" data-name="Branch metric">
                    <div
                      className="an332"
                      data-node-id="475:9758"
                      data-name="Branch sentiment track"
                    >
                      <div className="an333" data-node-id="475:9759" data-name="Positive share" />
                    </div>
                    <p
                      className="an328"
                      data-node-id="475:9760"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('77.9%')}
                    </p>
                    <p
                      className="an329"
                      data-node-id="475:9761"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('240 reviews')}
                    </p>
                  </div>
                </div>
                <div className="an322" data-node-id="475:9762" data-name="Branch">
                  <div className="an1" data-node-id="475:9763" data-name="Branch heading">
                    <p
                      className="an323"
                      data-node-id="475:9764"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Alex')}
                    </p>
                    <div className="an334" data-node-id="475:9765" data-name="Status">
                      <p
                        className="an335"
                        data-node-id="475:9766"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Needs attention')}
                      </p>
                    </div>
                  </div>
                  <div className="an264" data-node-id="475:9767" data-name="Branch metric">
                    <div
                      className="an332"
                      data-node-id="475:9768"
                      data-name="Branch sentiment track"
                    >
                      <div className="an336" data-node-id="475:9769" data-name="Positive share" />
                    </div>
                    <p
                      className="an328"
                      data-node-id="475:9770"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('65%')}
                    </p>
                    <p
                      className="an329"
                      data-node-id="475:9771"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('468 reviews')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="an337" data-node-id="475:9772" data-name="Comparison link">
                <p
                  className="an329"
                  data-node-id="475:9773"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('3 branches \u00b7 1,248 reviews')}
                </p>
              </div>
            </div>
            <div className="an186" data-node-id="475:9774" data-name="Comparison guidance">
              <p
                className="an338"
                data-node-id="475:9775"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {tr('Compare with context')}
              </p>
              <p
                className="an188"
                data-node-id="475:9776"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {tr(
                  'Branches differ in volume: 540 Cairo, 468 Alex and 240 El Zamalek. Results may reflect differences in visit time, response mix or survey completion; they do not establish why an experience differs.',
                )}
              </p>
            </div>
            <div className="an109" data-node-id="475:9777" data-name="Analysis footer">
              <p
                className="an110"
                data-node-id="475:9778"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {tr('Bloom & Co. \u00b7 Customer experience survey \u00b7 All languages')}
              </p>
              <p
                className="an110"
                data-node-id="475:9779"
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
