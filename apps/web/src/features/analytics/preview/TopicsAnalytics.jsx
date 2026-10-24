import HeadingBack from '../../../components/layout/HeadingBack.jsx';
import ControlIcon from '../../../components/ui/ControlIcon.jsx';
import React from 'react';
import { asset } from '../../../lib/assets.js';
import { useProductView } from '../../../app/providers/ProductProvider.jsx';
import {
  AnalyticsTabs,
  AnalyticsFilters,
  FilteredAnalyticsSummary,
  AnalyticsInteractions,
  AnalyticsArrowText,
  AnalyticsSmallSelect,
} from './AnalyticsControls.jsx';
import './analytics.css';

const imgInfo = asset('preview/topics-imgInfo.svg');
export default function TopicsAnalytics() {
  const { tr, analytics } = useProductView();
  return (
    <AnalyticsInteractions kind="topics">
      <div className="an0" data-node-id="387:7477" data-name="Page content">
        <div className="an1" data-node-id="387:7478" data-name="Page introduction">
          <div className="an2" data-node-id="387:7479" data-name="Introduction">
            <p className="an3" data-node-id="387:7480" data-workspace-heading="true">
              <HeadingBack />
              <span>{tr('Topics & Complaints')}</span>
            </p>
            <p
              className="an4"
              data-node-id="387:7481"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {tr(
                'Explore recurring conversations, common complaints and themes beyond your survey options.',
              )}
            </p>
          </div>
          <button
            type="button"
            className="an5 ui-control ui-export"
            data-node-id="387:7482"
            data-name="Action"
          >
            <div className="an6" data-node-id="387:7483" data-name="Icon">
              <div className="an7">
                <ControlIcon name="export" />
              </div>
            </div>
            <p
              className="an9"
              data-node-id="387:7484"
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
            <div className="an10" data-node-id="387:7513" data-name="Sample data context">
              <div className="an11" data-node-id="387:7514" data-name="info">
                <img alt="" className="an12" src={imgInfo} />
              </div>
              <p
                className="an13"
                data-node-id="387:7516"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {tr(
                  'Illustrative sample data \u00b7 1,248 responses \u00b7 12 Sep\u20139 Oct 2026 \u00b7 Not connected to live analysis',
                )}
              </p>
              <div className="an14" data-node-id="387:7517" data-name="Status">
                <p
                  className="an15"
                  data-node-id="387:7518"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('Sample workspace')}
                </p>
              </div>
            </div>
            <div className="an16" data-node-id="387:7519" data-name="Topic metrics">
              <div className="an17" data-node-id="387:7520" data-name="Key metric">
                <div className="an18" data-node-id="387:7521" data-name="Metric heading">
                  <p
                    className="an19"
                    data-node-id="387:7522"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Recurring topic clusters')}
                  </p>
                </div>
                <p
                  className="an21"
                  data-node-id="387:7523"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('6')}
                </p>
                <p
                  className="an22"
                  data-node-id="387:7524"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('Themes in the illustrative dataset')}
                </p>
              </div>
              <div className="an17" data-node-id="387:7525" data-name="Key metric">
                <div className="an18" data-node-id="387:7526" data-name="Metric heading">
                  <p
                    className="an19"
                    data-node-id="387:7527"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Most frequent topic')}
                  </p>
                </div>
                <p
                  className="an21"
                  data-node-id="387:7528"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('168')}
                </p>
                <p
                  className="an22"
                  data-node-id="387:7529"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('Coffee & food quality \u00b7 13.5% of responses')}
                </p>
              </div>
              <div className="an17" data-node-id="387:7530" data-name="Key metric">
                <div className="an18" data-node-id="387:7531" data-name="Metric heading">
                  <p
                    className="an19"
                    data-node-id="387:7532"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Selected complaint cluster')}
                  </p>
                </div>
                <p
                  className="an21"
                  data-node-id="387:7533"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('104')}
                </p>
                <p
                  className="an22"
                  data-node-id="387:7534"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('Long waiting times \u00b7 8.3% of responses')}
                </p>
              </div>
              <div className="an17" data-node-id="387:7535" data-name="Key metric">
                <div className="an18" data-node-id="387:7536" data-name="Metric heading">
                  <p
                    className="an19"
                    data-node-id="387:7537"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Beyond survey options')}
                  </p>
                </div>
                <p
                  className="an21"
                  data-node-id="387:7538"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('2')}
                </p>
                <p
                  className="an22"
                  data-node-id="387:7539"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('Illustrative emerging themes, not alerts')}
                </p>
              </div>
            </div>
            <div className="an23" data-node-id="387:7540" data-name="Topic exploration">
              <div className="an189" data-node-id="387:7541" data-name="Recurring topics">
                <div className="an1" data-node-id="387:7542" data-name="Topics heading">
                  <div className="an190" data-node-id="387:7543" data-name="Heading">
                    <p
                      className="an191"
                      data-node-id="387:7544"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Recurring topics')}
                    </p>
                    <p
                      className="an192"
                      data-node-id="387:7545"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Frequency = responses mentioning a cluster')}
                    </p>
                  </div>
                  <AnalyticsSmallSelect kind="topics" />
                </div>
                <div className="an16" data-node-id="387:7548" data-name="Topic row">
                  <button
                    type="button"
                    className="an194"
                    data-node-id="387:7549"
                    data-name="Topic cluster"
                  >
                    <div className="an195" data-node-id="387:7550" data-name="Topic heading">
                      <p
                        className="an196"
                        data-node-id="387:7551"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Long waiting times')}
                      </p>
                      <p
                        className="an197"
                        data-node-id="387:7552"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('104')}
                      </p>
                    </div>
                    <div className="an18" data-node-id="387:7553" data-name="Topic metadata">
                      <div className="an14" data-node-id="387:7554" data-name="Status">
                        <p
                          className="an15"
                          data-node-id="387:7555"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('Speed')}
                        </p>
                      </div>
                      <p
                        className="an128"
                        data-node-id="387:7556"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('8.3% of responses')}
                      </p>
                    </div>
                    <p
                      className="an198"
                      data-node-id="387:7557"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('\u201cWe waited 25 minutes for our order.\u201d')}
                    </p>
                    <p
                      className="an199"
                      data-node-id="387:7558"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {<AnalyticsArrowText text={tr('View Related Responses \u2193')} />}
                    </p>
                  </button>
                  <button
                    type="button"
                    className="an200"
                    data-node-id="387:7559"
                    data-name="Topic cluster"
                  >
                    <div className="an201" data-node-id="387:7560" data-name="Topic heading">
                      <p
                        className="an202"
                        data-node-id="387:7561"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Coffee & food quality')}
                      </p>
                      <p
                        className="an203"
                        data-node-id="387:7562"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('168')}
                      </p>
                    </div>
                    <div className="an18" data-node-id="387:7563" data-name="Topic metadata">
                      <div className="an14" data-node-id="387:7564" data-name="Status">
                        <p
                          className="an15"
                          data-node-id="387:7565"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('Product Quality')}
                        </p>
                      </div>
                      <p
                        className="an128"
                        data-node-id="387:7566"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('13.5% of responses')}
                      </p>
                    </div>
                    <p
                      className="an198"
                      data-node-id="387:7567"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('\u201cThe coffee was excellent, as always.\u201d')}
                    </p>
                    <p
                      className="an199"
                      data-node-id="387:7568"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {<AnalyticsArrowText text={tr('View Related Responses \u2192')} />}
                    </p>
                  </button>
                </div>
                <div className="an16" data-node-id="387:7569" data-name="Topic row">
                  <button
                    type="button"
                    className="an200"
                    data-node-id="387:7570"
                    data-name="Topic cluster"
                  >
                    <div className="an201" data-node-id="387:7571" data-name="Topic heading">
                      <p
                        className="an202"
                        data-node-id="387:7572"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Friendly staff')}
                      </p>
                      <p
                        className="an203"
                        data-node-id="387:7573"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('92')}
                      </p>
                    </div>
                    <div className="an18" data-node-id="387:7574" data-name="Topic metadata">
                      <div className="an14" data-node-id="387:7575" data-name="Status">
                        <p
                          className="an15"
                          data-node-id="387:7576"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('Service')}
                        </p>
                      </div>
                      <p
                        className="an128"
                        data-node-id="387:7577"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('7.4% of responses')}
                      </p>
                    </div>
                    <p
                      className="an198"
                      data-node-id="387:7578"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('\u201cThe team remembered my order.\u201d')}
                    </p>
                    <p
                      className="an199"
                      data-node-id="387:7579"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {<AnalyticsArrowText text={tr('View Related Responses \u2192')} />}
                    </p>
                  </button>
                  <button
                    type="button"
                    className="an200"
                    data-node-id="387:7580"
                    data-name="Topic cluster"
                  >
                    <div className="an201" data-node-id="387:7581" data-name="Topic heading">
                      <p
                        className="an202"
                        data-node-id="387:7582"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Unclear combo pricing')}
                      </p>
                      <p
                        className="an203"
                        data-node-id="387:7583"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('48')}
                      </p>
                    </div>
                    <div className="an18" data-node-id="387:7584" data-name="Topic metadata">
                      <div className="an14" data-node-id="387:7585" data-name="Status">
                        <p
                          className="an15"
                          data-node-id="387:7586"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('Price')}
                        </p>
                      </div>
                      <p
                        className="an128"
                        data-node-id="387:7587"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('3.8% of responses')}
                      </p>
                    </div>
                    <p
                      className="an198"
                      data-node-id="387:7588"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('\u201cThe combo cost more than the menu price.\u201d')}
                    </p>
                    <p
                      className="an199"
                      data-node-id="387:7589"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {<AnalyticsArrowText text={tr('View Related Responses \u2192')} />}
                    </p>
                  </button>
                </div>
                <div className="an16" data-node-id="387:7590" data-name="Topic row">
                  <button
                    type="button"
                    className="an200"
                    data-node-id="387:7591"
                    data-name="Topic cluster"
                  >
                    <div className="an201" data-node-id="387:7592" data-name="Topic heading">
                      <p
                        className="an202"
                        data-node-id="387:7593"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Workspace atmosphere')}
                      </p>
                      <p
                        className="an203"
                        data-node-id="387:7594"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('64')}
                      </p>
                    </div>
                    <div className="an18" data-node-id="387:7595" data-name="Topic metadata">
                      <div className="an14" data-node-id="387:7596" data-name="Status">
                        <p
                          className="an15"
                          data-node-id="387:7597"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('Experience')}
                        </p>
                      </div>
                      <p
                        className="an128"
                        data-node-id="387:7598"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('5.1% of responses')}
                      </p>
                    </div>
                    <p
                      className="an198"
                      data-node-id="387:7599"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('\u201cA lovely, calm place to get some work done.\u201d')}
                    </p>
                    <p
                      className="an199"
                      data-node-id="387:7600"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {<AnalyticsArrowText text={tr('View Related Responses \u2192')} />}
                    </p>
                  </button>
                  <button
                    type="button"
                    className="an200"
                    data-node-id="387:7601"
                    data-name="Topic cluster"
                  >
                    <div className="an201" data-node-id="387:7602" data-name="Topic heading">
                      <p
                        className="an202"
                        data-node-id="387:7603"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Order accuracy')}
                      </p>
                      <p
                        className="an203"
                        data-node-id="387:7604"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('42')}
                      </p>
                    </div>
                    <div className="an18" data-node-id="387:7605" data-name="Topic metadata">
                      <div className="an14" data-node-id="387:7606" data-name="Status">
                        <p
                          className="an15"
                          data-node-id="387:7607"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('Service')}
                        </p>
                      </div>
                      <p
                        className="an128"
                        data-node-id="387:7608"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('3.4% of responses')}
                      </p>
                    </div>
                    <p
                      className="an198"
                      data-node-id="387:7609"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('\u201cMy order arrived without the extra shot.\u201d')}
                    </p>
                    <p
                      className="an199"
                      data-node-id="387:7610"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {<AnalyticsArrowText text={tr('View Related Responses \u2192')} />}
                    </p>
                  </button>
                </div>
                <p
                  className="an45"
                  data-node-id="387:7611"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr(
                    'Responses may belong to more than one cluster. Quotes are illustrative examples, not summaries of every response.',
                  )}
                </p>
              </div>
              <div className="an24" data-node-id="387:7612" data-name="Long waiting times">
                <div className="an84" data-node-id="387:7613" data-name="Section heading">
                  <div className="an85" data-node-id="387:7614" data-name="Heading">
                    <p
                      className="an27"
                      data-node-id="387:7615"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Long waiting times')}
                    </p>
                    <p
                      className="an28"
                      data-node-id="387:7616"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Topic-cluster details \u00b7 selected complaint')}
                    </p>
                  </div>
                </div>
                <div className="an87" data-node-id="387:7618" data-name="Cluster status">
                  <div className="an88" data-node-id="387:7619" data-name="Status">
                    <p
                      className="an89"
                      data-node-id="387:7620"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Selected')}
                    </p>
                  </div>
                  <div className="an14" data-node-id="387:7621" data-name="Status">
                    <p
                      className="an15"
                      data-node-id="387:7622"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Speed')}
                    </p>
                  </div>
                </div>
                <div className="an204" data-node-id="387:7623" data-name="Cluster frequency">
                  <p
                    className="an32"
                    data-node-id="387:7624"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('104')}
                  </p>
                  <p
                    className="an192"
                    data-node-id="387:7625"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('responses \u00b7 8.3% of the filtered sample')}
                  </p>
                </div>
                <p
                  className="an205"
                  data-node-id="387:7626"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr(
                    'Waiting for orders and paying at busy times. This cluster groups similar feedback; it does not establish the cause of a delay.',
                  )}
                </p>
                <div className="an179" data-node-id="387:7627" data-name="Divider" />
                <div className="an206" data-node-id="387:7628" data-name="Branch distribution">
                  <p
                    className="an207"
                    data-node-id="387:7629"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Responses in this cluster by branch')}
                  </p>
                  <div className="an147" data-node-id="387:7630" data-name="Branch frequency">
                    <p
                      className="an208"
                      data-node-id="387:7631"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Cairo')}
                    </p>
                    <div className="an209" data-node-id="387:7632" data-name="Frequency track">
                      <div
                        className="an210"
                        data-node-id="387:7633"
                        data-name="Response count bar"
                      />
                    </div>
                    <p
                      className="an211"
                      data-node-id="387:7634"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('72')}
                    </p>
                  </div>
                  <div className="an147" data-node-id="387:7635" data-name="Branch frequency">
                    <p
                      className="an208"
                      data-node-id="387:7636"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('El Zamalek')}
                    </p>
                    <div className="an209" data-node-id="387:7637" data-name="Frequency track">
                      <div
                        className="an212"
                        data-node-id="387:7638"
                        data-name="Response count bar"
                      />
                    </div>
                    <p
                      className="an211"
                      data-node-id="387:7639"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('18')}
                    </p>
                  </div>
                  <div className="an147" data-node-id="387:7640" data-name="Branch frequency">
                    <p
                      className="an208"
                      data-node-id="387:7641"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Alex')}
                    </p>
                    <div className="an209" data-node-id="387:7642" data-name="Frequency track">
                      <div
                        className="an213"
                        data-node-id="387:7643"
                        data-name="Response count bar"
                      />
                    </div>
                    <p
                      className="an211"
                      data-node-id="387:7644"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('14')}
                    </p>
                  </div>
                  <p
                    className="an128"
                    data-node-id="387:7645"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Count of responses \u00b7 total across branches: 104')}
                  </p>
                </div>
                <div className="an179" data-node-id="387:7646" data-name="Divider" />
                <p
                  className="an214"
                  data-node-id="387:7647"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('Related responses')}
                </p>
                <button
                  type="button"
                  className="an94"
                  data-node-id="387:7648"
                  data-name="Related response"
                >
                  <div className="an18" data-node-id="387:7649" data-name="Response metadata">
                    <p
                      className="an22"
                      data-node-id="387:7650"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('R-1032 \u00b7 Cairo \u00b7 7 Oct 2026')}
                    </p>
                    <div className="an215" data-node-id="387:7651" data-name="Status">
                      <p
                        className="an216"
                        data-node-id="387:7652"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Mixed')}
                      </p>
                    </div>
                  </div>
                  <p
                    className="an93"
                    data-node-id="387:7653"
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
                  data-node-id="387:7654"
                  data-name="Related response"
                >
                  <div className="an18" data-node-id="387:7655" data-name="Response metadata">
                    <p
                      className="an22"
                      data-node-id="387:7656"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('R-1008 \u00b7 Cairo \u00b7 5 Oct 2026')}
                    </p>
                    <div className="an183" data-node-id="387:7657" data-name="Status">
                      <p
                        className="an98"
                        data-node-id="387:7658"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Negative')}
                      </p>
                    </div>
                  </div>
                  <p
                    className="an93"
                    data-node-id="387:7659"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('\u201cI waited too long to pay, even with only a few items.\u201d')}
                  </p>
                </button>
                <p
                  className="an199"
                  data-node-id="387:7660"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {<AnalyticsArrowText text={tr('View all 104 related responses \u2192')} />}
                </p>
              </div>
            </div>
            <div className="an170" data-node-id="387:7661" data-name="Emerging Issues">
              <div className="an84" data-node-id="387:7662" data-name="Section heading">
                <div className="an85" data-node-id="387:7663" data-name="Heading">
                  <p
                    className="an27"
                    data-node-id="387:7664"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Emerging Issues')}
                  </p>
                  <p
                    className="an28"
                    data-node-id="387:7665"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Illustrative free-text themes not anticipated in the survey options')}
                  </p>
                </div>
                <p
                  className="an171"
                  data-node-id="387:7666"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('2 sample themes')}
                </p>
              </div>
              <div className="an217" data-node-id="387:7667" data-name="Emerging themes">
                <button
                  type="button"
                  className="an218"
                  data-node-id="387:7668"
                  data-name="Emerging theme"
                >
                  <div className="an219" data-node-id="387:7669" data-name="Theme evidence">
                    <div className="an220" data-node-id="387:7670" data-name="Theme identity">
                      <p
                        className="an104"
                        data-node-id="387:7671"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Unreliable Wi-Fi')}
                      </p>
                      <p
                        className="an33"
                        data-node-id="387:7672"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('18 responses \u00b7 1.4%')}
                      </p>
                    </div>
                    <p
                      className="an221"
                      data-node-id="387:7673"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('\u201cThe connection dropped during my meeting.\u201d')}
                    </p>
                    <p
                      className="an222"
                      data-node-id="387:7674"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Related to the workspace experience.')}
                    </p>
                    <p
                      className="an171"
                      data-node-id="387:7675"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {<AnalyticsArrowText text={tr('View Related Responses \u2192')} />}
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  className="an218"
                  data-node-id="387:7676"
                  data-name="Emerging theme"
                >
                  <div className="an219" data-node-id="387:7677" data-name="Theme evidence">
                    <div className="an220" data-node-id="387:7678" data-name="Theme identity">
                      <p
                        className="an104"
                        data-node-id="387:7679"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Limited power sockets')}
                      </p>
                      <p
                        className="an33"
                        data-node-id="387:7680"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('12 responses \u00b7 1.0%')}
                      </p>
                    </div>
                    <p
                      className="an221"
                      data-node-id="387:7681"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('\u201cI couldn\u2019t find a place to charge my laptop.\u201d')}
                    </p>
                    <p
                      className="an222"
                      data-node-id="387:7682"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {tr('Not covered by the current survey choices.')}
                    </p>
                    <p
                      className="an171"
                      data-node-id="387:7683"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {<AnalyticsArrowText text={tr('View Related Responses \u2192')} />}
                    </p>
                  </div>
                </button>
              </div>
              <p
                className="an45"
                data-node-id="387:7684"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {tr(
                  'These are sample topic patterns, not returned anomaly alerts. \u201cEmerging\u201d describes themes outside the survey taxonomy, not a confirmed increase.',
                )}
              </p>
            </div>
            <div className="an109" data-node-id="387:7685" data-name="Analysis footer">
              <p
                className="an110"
                data-node-id="387:7686"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {tr('Bloom & Co. \u00b7 Customer experience survey \u00b7 All languages')}
              </p>
              <p
                className="an110"
                data-node-id="387:7687"
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
