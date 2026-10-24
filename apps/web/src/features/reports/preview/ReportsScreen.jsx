import HeadingBack from '../../../components/layout/HeadingBack.jsx';
import { useRouteState } from '../../../components/layout/navigation.js';
import ControlIcon from '../../../components/ui/ControlIcon.jsx';
import React, { useState, useRef, useEffect } from 'react';
import { asset } from '../../../lib/assets.js';
import { useProductView } from '../../../app/providers/ProductProvider.jsx';
import { PreviewFilter, GenerateDialog, downloadReport } from './PreviewControls.jsx';
import './figma-preview.css';
const imgSparkles = asset('preview/reports-imgSparkles.svg');
const imgSparkles1 = asset('preview/reports-imgSparkles1.svg');

const imgFileChartColumn = asset('preview/reports-imgFileChartColumn.svg');

const imgFileDown = asset('preview/reports-imgFileDown.svg');
export default function ReportsScreen() {
  const { tr, language } = useProductView();
  const [generate, setGenerate] = useState(
    () => new URLSearchParams(location.hash.split('?')[1]).get('generate') === '1',
  );
  const [reportFilters, setReportFilters] = useRouteState('report-filters', {});
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const cards = [...ref.current.querySelectorAll('[data-report-card]')];
    let count = 0;
    cards.forEach((card, index) => {
      card.hidden =
        (reportFilters.language === 'Arabic'
          ? index !== 3
          : reportFilters.language === 'English'
            ? index === 3
            : false) ||
        (reportFilters.date === 'august'
          ? index !== 3
          : reportFilters.date === 'september'
            ? index === 3
            : false);
      if (!card.hidden) count++;
    });
    const counter = ref.current.querySelector('[data-node-id="299:901"]');
    if (counter) counter.textContent = tr(count + ' reports');
    const footer = ref.current.querySelector('[data-node-id="299:1024"]');
    if (footer) footer.textContent = tr('Showing') + ' ' + count + ' ' + tr('reports');
    cards.forEach(
      (card, index) => (card.style.order = reportFilters.sort === 'oldest' ? 3 - index : index),
    );
  }, [reportFilters, tr]);
  return (
    <div
      className="figma-preview reports-library"
      ref={ref}
      onClick={(e) => {
        const item = e.target.closest(
          '[data-name="Action"],[data-name="Back to reports"], [data-name="Evidence link"]',
        );
        if (!item) return;
        const label = item.textContent.trim();
        if (item.dataset.name === 'Back to reports') {
          location.hash = '/reports';
          return;
        }
        if (/Export|تصدير/.test(label)) {
          downloadReport(
            item.closest('[data-report-id]')?.dataset.reportId || 'september',
            language,
          );
          return;
        }
        if (/Generate|Preview report setup|معاينة إعداد تقرير|إنشاء/.test(label)) {
          setGenerate(true);
          return;
        }
        if (/View Report|عرض التقرير/.test(label)) {
          const card = item.closest('[data-name="Previous report"]');
          location.hash = '/report-details?id=' + (card?.dataset.reportId || 'september');
          return;
        }
        if (/Original Feedback|الأصلي/.test(label)) location.hash = '/feedback-details?id=1248';
      }}
    >
      <div className="pv0" data-node-id="299:867" data-name="Page content">
        <div className="pv1" data-node-id="299:868" data-name="Page introduction">
          <div className="pv2" data-node-id="299:869" data-name="Introduction">
            <p className="pv3" data-node-id="299:870" data-workspace-heading="true">
              <HeadingBack />
              <span>{tr('AI Reports')}</span>
            </p>
            <p
              className="pv4"
              data-node-id="299:871"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {tr('Turn customer feedback into a clear, evidence-backed plan for your business.')}
            </p>
          </div>
          <button type="button" className="pv63" data-node-id="299:872" data-name="Action">
            <div className="pv6" data-node-id="299:873" data-name="sparkles">
              <img alt="" className="pv7" src={imgSparkles} />
            </div>
            <p
              className="pv64"
              data-node-id="299:875"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {tr('Preview report setup')}
            </p>
          </button>
        </div>
        <div className="pv65" data-node-id="299:876" data-name="Reporting context">
          <div className="pv66" data-node-id="299:877" data-name="Reporting promise">
            <div className="pv9" data-node-id="299:878" data-name="Insight label">
              <div className="pv6" data-node-id="299:879" data-name="sparkles">
                <img alt="" className="pv7" src={imgSparkles1} />
              </div>
              <p
                className="pv67"
                data-node-id="299:881"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {tr('YOUR SEPTEMBER SNAPSHOT')}
              </p>
            </div>
            <p
              className="pv68"
              data-node-id="299:882"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {tr('One view of what matters. Evidence behind every action.')}
            </p>
            <p
              className="pv39"
              data-node-id="299:883"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {tr('Latest report covers Bloom & Co.\u2019s full September review dataset.')}
            </p>
          </div>
          <div className="pv69" data-node-id="299:884" data-name="Review coverage">
            <p
              className="pv70"
              data-node-id="299:885"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {tr('1,250')}
            </p>
            <p
              className="pv71"
              data-node-id="299:886"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {tr('reviews analyzed')}
            </p>
          </div>
          <div className="pv72" data-node-id="299:887" data-name="Divider" />
          <div className="pv73" data-node-id="299:888" data-name="Branch coverage">
            <p
              className="pv70"
              data-node-id="299:889"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {tr('3')}
            </p>
            <p
              className="pv71"
              data-node-id="299:890"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {tr('branches')}
            </p>
          </div>
        </div>
        <div className="pv1" data-node-id="299:891" data-name="Report filters">
          <div
            className="pv74"
            id="report-filter-options"
            data-node-id="299:892"
            data-name="Filter controls"
          >
            <PreviewFilter
              kind="date"
              currentValue={reportFilters.date}
              onChange={(value) => setReportFilters((old) => ({ ...old, date: value }))}
            />
            <PreviewFilter
              kind="language"
              currentValue={reportFilters.language}
              onChange={(value) => setReportFilters((old) => ({ ...old, language: value }))}
            />
            <p
              className="pv39"
              data-node-id="299:901"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {tr('4 reports')}
            </p>
          </div>
          <PreviewFilter
            kind="sort"
            currentValue={reportFilters.sort}
            onChange={(value) => setReportFilters((old) => ({ ...old, sort: value }))}
          />
        </div>
        <div className="pv75" data-node-id="299:906" data-name="Report library">
          <div className="pv76" data-node-id="299:907" data-name="Report row">
            <div
              className="pv77"
              data-node-id="299:908"
              data-name="Previous report"
              data-report-card="true"
              data-report-id="september"
            >
              <div className="pv78" data-node-id="299:909" data-name="Report identity">
                <div className="pv79" data-node-id="299:910" data-name="Report symbol">
                  <div className="pv80" data-node-id="299:911" data-name="file-chart-column">
                    <img alt="" className="pv7" src={imgFileChartColumn} />
                  </div>
                </div>
                <div className="pv81" data-node-id="299:913" data-name="Report title">
                  <p
                    className="pv82"
                    data-node-id="299:914"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('September customer experience')}
                  </p>
                  <p
                    className="pv53"
                    data-node-id="299:915"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Created 1 Oct, 2026')}
                  </p>
                </div>
                <div className="pv83" data-node-id="299:916" data-name="Status">
                  <p
                    className="pv84"
                    data-node-id="299:917"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Latest')}
                  </p>
                </div>
              </div>
              <div className="pv85" data-node-id="299:918" data-name="Report overview">
                <p
                  className="pv86"
                  data-node-id="299:919"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr(
                    'Food quality leads. Longer waits in Cairo and unclear combo pricing need attention.',
                  )}
                </p>
              </div>
              <div className="pv87" data-node-id="299:920" data-name="Report metadata">
                <div className="pv88" data-node-id="299:921" data-name="Period covered">
                  <p
                    className="pv89"
                    data-node-id="299:922"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('PERIOD COVERED')}
                  </p>
                  <p
                    className="pv90"
                    data-node-id="299:923"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('1\u201330 Sep, 2026')}
                  </p>
                </div>
                <div className="pv91" data-node-id="299:924" data-name="Report language">
                  <p
                    className="pv89"
                    data-node-id="299:925"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('LANGUAGE')}
                  </p>
                  <p
                    className="pv90"
                    data-node-id="299:926"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('English')}
                  </p>
                </div>
                <div className="pv92" data-node-id="299:927" data-name="Report scope">
                  <p
                    className="pv89"
                    data-node-id="299:928"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('BRANCHES')}
                  </p>
                  <p
                    className="pv90"
                    data-node-id="299:929"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('All 3 branches')}
                  </p>
                </div>
              </div>
              <div className="pv27" data-node-id="299:930" data-name="Divider" />
              <div className="pv1" data-node-id="299:931" data-name="Report actions">
                <button
                  type="button"
                  className="pv93"
                  data-node-id="299:932"
                  data-name="Action"
                  data-report-action="view"
                >
                  <p
                    className="pv64"
                    data-node-id="299:933"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('View Report')}
                  </p>
                </button>
                <button
                  type="button"
                  className="pv94 ui-control ui-export"
                  data-node-id="299:934"
                  data-name="Action"
                >
                  <div className="pv6" data-node-id="299:935" data-name="download">
                    <ControlIcon name="export" />
                  </div>
                  <p
                    className="pv8"
                    data-node-id="299:937"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Export')}
                  </p>
                </button>
              </div>
            </div>
            <div
              className="pv95"
              data-node-id="299:938"
              data-name="Previous report"
              data-report-card="true"
              data-report-id="cairo"
            >
              <div className="pv78" data-node-id="299:939" data-name="Report identity">
                <div className="pv79" data-node-id="299:940" data-name="Report symbol">
                  <div className="pv80" data-node-id="299:941" data-name="file-chart-column">
                    <img alt="" className="pv7" src={imgFileChartColumn} />
                  </div>
                </div>
                <div className="pv81" data-node-id="299:943" data-name="Report title">
                  <p
                    className="pv82"
                    data-node-id="299:944"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Cairo service speed review')}
                  </p>
                  <p
                    className="pv53"
                    data-node-id="299:945"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Created 30 Sep, 2026')}
                  </p>
                </div>
              </div>
              <div className="pv85" data-node-id="299:946" data-name="Report overview">
                <p
                  className="pv86"
                  data-node-id="299:947"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr(
                    'A focused review of waiting-time feedback, with evidence and recommended next steps.',
                  )}
                </p>
              </div>
              <div className="pv87" data-node-id="299:948" data-name="Report metadata">
                <div className="pv88" data-node-id="299:949" data-name="Period covered">
                  <p
                    className="pv89"
                    data-node-id="299:950"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('PERIOD COVERED')}
                  </p>
                  <p
                    className="pv90"
                    data-node-id="299:951"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('1\u201330 Sep, 2026')}
                  </p>
                </div>
                <div className="pv91" data-node-id="299:952" data-name="Report language">
                  <p
                    className="pv89"
                    data-node-id="299:953"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('LANGUAGE')}
                  </p>
                  <p
                    className="pv90"
                    data-node-id="299:954"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('English')}
                  </p>
                </div>
                <div className="pv92" data-node-id="299:955" data-name="Report scope">
                  <p
                    className="pv89"
                    data-node-id="299:956"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('BRANCHES')}
                  </p>
                  <p
                    className="pv90"
                    data-node-id="299:957"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Cairo')}
                  </p>
                </div>
              </div>
              <div className="pv27" data-node-id="299:958" data-name="Divider" />
              <div className="pv1" data-node-id="299:959" data-name="Report actions">
                <button
                  type="button"
                  className="pv96"
                  data-node-id="299:960"
                  data-name="Action"
                  data-report-action="view"
                >
                  <p
                    className="pv8"
                    data-node-id="299:961"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('View Report')}
                  </p>
                </button>
                <button
                  type="button"
                  className="pv94 ui-control ui-export"
                  data-node-id="299:962"
                  data-name="Action"
                >
                  <div className="pv6" data-node-id="299:963" data-name="download">
                    <ControlIcon name="export" />
                  </div>
                  <p
                    className="pv8"
                    data-node-id="299:965"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Export')}
                  </p>
                </button>
              </div>
            </div>
          </div>
          <div className="pv76" data-node-id="299:966" data-name="Report row">
            <div
              className="pv95"
              data-node-id="299:967"
              data-name="Previous report"
              data-report-card="true"
              data-report-id="service"
            >
              <div className="pv78" data-node-id="299:968" data-name="Report identity">
                <div className="pv79" data-node-id="299:969" data-name="Report symbol">
                  <div className="pv80" data-node-id="299:970" data-name="file-chart-column">
                    <img alt="" className="pv7" src={imgFileChartColumn} />
                  </div>
                </div>
                <div className="pv81" data-node-id="299:972" data-name="Report title">
                  <p
                    className="pv82"
                    data-node-id="299:973"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Service & hospitality insights')}
                  </p>
                  <p
                    className="pv53"
                    data-node-id="299:974"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Created 30 Sep, 2026')}
                  </p>
                </div>
              </div>
              <div className="pv85" data-node-id="299:975" data-name="Report overview">
                <p
                  className="pv86"
                  data-node-id="299:976"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr(
                    'Explore staff friendliness and the service practices customers value at El Zamalek.',
                  )}
                </p>
              </div>
              <div className="pv87" data-node-id="299:977" data-name="Report metadata">
                <div className="pv88" data-node-id="299:978" data-name="Period covered">
                  <p
                    className="pv89"
                    data-node-id="299:979"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('PERIOD COVERED')}
                  </p>
                  <p
                    className="pv90"
                    data-node-id="299:980"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('1\u201330 Sep, 2026')}
                  </p>
                </div>
                <div className="pv91" data-node-id="299:981" data-name="Report language">
                  <p
                    className="pv89"
                    data-node-id="299:982"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('LANGUAGE')}
                  </p>
                  <p
                    className="pv90"
                    data-node-id="299:983"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('English')}
                  </p>
                </div>
                <div className="pv92" data-node-id="299:984" data-name="Report scope">
                  <p
                    className="pv89"
                    data-node-id="299:985"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('BRANCHES')}
                  </p>
                  <p
                    className="pv90"
                    data-node-id="299:986"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('All 3 branches')}
                  </p>
                </div>
              </div>
              <div className="pv27" data-node-id="299:987" data-name="Divider" />
              <div className="pv1" data-node-id="299:988" data-name="Report actions">
                <button
                  type="button"
                  className="pv96"
                  data-node-id="299:989"
                  data-name="Action"
                  data-report-action="view"
                >
                  <p
                    className="pv8"
                    data-node-id="299:990"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('View Report')}
                  </p>
                </button>
                <button
                  type="button"
                  className="pv94 ui-control ui-export"
                  data-node-id="299:991"
                  data-name="Action"
                >
                  <div className="pv6" data-node-id="299:992" data-name="download">
                    <ControlIcon name="export" />
                  </div>
                  <p
                    className="pv8"
                    data-node-id="299:994"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Export')}
                  </p>
                </button>
              </div>
            </div>
            <div
              className="pv95"
              data-node-id="299:995"
              data-name="Previous report"
              data-report-card="true"
              data-report-id="august"
            >
              <div className="pv78" data-node-id="299:996" data-name="Report identity">
                <div className="pv79" data-node-id="299:997" data-name="Report symbol">
                  <div className="pv80" data-node-id="299:998" data-name="file-chart-column">
                    <img alt="" className="pv7" src={imgFileChartColumn} />
                  </div>
                </div>
                <div className="pv81" data-node-id="299:1000" data-name="Report title">
                  <p
                    className="pv82"
                    data-node-id="299:1001"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('August customer experience')}
                  </p>
                  <p
                    className="pv53"
                    data-node-id="299:1002"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Created 1 Sep, 2026')}
                  </p>
                </div>
              </div>
              <div className="pv85" data-node-id="299:1003" data-name="Report overview">
                <p
                  className="pv86"
                  data-node-id="299:1004"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr(
                    'Monthly feedback summary with business strengths, pain points and recommendations.',
                  )}
                </p>
              </div>
              <div className="pv87" data-node-id="299:1005" data-name="Report metadata">
                <div className="pv88" data-node-id="299:1006" data-name="Period covered">
                  <p
                    className="pv89"
                    data-node-id="299:1007"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('PERIOD COVERED')}
                  </p>
                  <p
                    className="pv90"
                    data-node-id="299:1008"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('1\u201331 Aug, 2026')}
                  </p>
                </div>
                <div className="pv91" data-node-id="299:1009" data-name="Report language">
                  <p
                    className="pv89"
                    data-node-id="299:1010"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('LANGUAGE')}
                  </p>
                  <p
                    className="pv90"
                    data-node-id="299:1011"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Arabic')}
                  </p>
                </div>
                <div className="pv92" data-node-id="299:1012" data-name="Report scope">
                  <p
                    className="pv89"
                    data-node-id="299:1013"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('BRANCHES')}
                  </p>
                  <p
                    className="pv90"
                    data-node-id="299:1014"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('All 3 branches')}
                  </p>
                </div>
              </div>
              <div className="pv27" data-node-id="299:1015" data-name="Divider" />
              <div className="pv1" data-node-id="299:1016" data-name="Report actions">
                <button
                  type="button"
                  className="pv96"
                  data-node-id="299:1017"
                  data-name="Action"
                  data-report-action="view"
                >
                  <p
                    className="pv8"
                    data-node-id="299:1018"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('View Report')}
                  </p>
                </button>
                <button
                  type="button"
                  className="pv94 ui-control ui-export"
                  data-node-id="299:1019"
                  data-name="Action"
                >
                  <div className="pv6" data-node-id="299:1020" data-name="download">
                    <ControlIcon name="export" />
                  </div>
                  <p
                    className="pv8"
                    data-node-id="299:1022"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Export')}
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="pv1" data-node-id="299:1023" data-name="Library footer">
          <p
            className="pv39"
            data-node-id="299:1024"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            {tr('Showing all 4 reports')}
          </p>
          <div className="pv55" data-node-id="299:1025" data-name="Export hint">
            <div className="pv24" data-node-id="299:1026" data-name="file-down">
              <img alt="" className="pv7" src={imgFileDown} />
            </div>
            <p
              className="pv39"
              data-node-id="299:1028"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {tr('Reports include analysis and linked supporting evidence.')}
            </p>
          </div>
        </div>
      </div>
      {generate && <GenerateDialog onClose={() => setGenerate(false)} />}
    </div>
  );
}
