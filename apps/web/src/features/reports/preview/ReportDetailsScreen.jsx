import HeadingBack from '../../../components/layout/HeadingBack.jsx';
import reportArabic from '../../../lib/i18n/product-ar.json';
import { arabicUiNumbers } from '../../../lib/number-format.js';
import { ReportNavigation } from './ReportChrome.jsx';

import { getReportDetails } from './report-details-data.js';
import { getReport } from './report-library.js';
import { useCallback, useState, useRef, useEffect } from 'react';
import { asset } from '../../../lib/assets.js';
import { useProductView } from '../../../app/providers/ProductProvider.jsx';
import { PreviewArrow, GenerateDialog, downloadReport } from './PreviewControls.jsx';
import './figma-preview.css';

const imgSparkles = asset('preview/reportDetails-imgSparkles.svg');
const imgInfo = asset('preview/reportDetails-imgInfo.svg');
const imgQuote = asset('preview/reportDetails-imgQuote.svg');

function ReportContent({ id }) {
  const ui = useProductView();
  const language = getReport(id).language === 'Arabic' ? 'ar' : ui.language;
  const formatNumber = (value) => (language === 'ar' ? arabicUiNumbers(value) : String(value));
  const tr = useCallback(
    (text) => (language === 'ar' ? arabicUiNumbers(reportArabic[text] ?? text) : text),
    [language],
  );
  const details = getReportDetails(id);
  const content = (nodeId, fallback) =>
    nodeId === '300:1149'
      ? tr(language === 'ar' ? 'Arabic' : 'English')
      : id === 'september' || !details.nodes[nodeId]
        ? tr(fallback)
        : formatNumber(details.nodes[nodeId][language]);
  const [generate, setGenerate] = useState(false);
  const [evidence, setEvidence] = useState(null);
  const [reportFilters] = useState({});
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
    const rows = ref.current.querySelector('[data-name="Report library"]');
    if (rows)
      rows.style.flexDirection = reportFilters.sort === 'oldest' ? 'column-reverse' : 'column';
  }, [reportFilters, tr]);
  const reportTitle = getReport(id).title;
  return (
    <div
      className="figma-preview report-details"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      lang={language}
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
          downloadReport(id, language);
          return;
        }
        if (/Generate|إنشاء/.test(label)) {
          setGenerate(true);
          return;
        }
        if (/View Report|عرض التقرير/.test(label)) {
          const card = item.closest('[data-name="Previous report"]');
          location.hash =
            '/report-details?report=' +
            encodeURIComponent(
              card?.querySelector('[data-name="Report title"] p')?.textContent ||
                'September customer experience',
            );
          return;
        }
        if (/Original Feedback|الأصلي/.test(label)) location.hash = '/feedback-details?id=1248';
      }}
    >
      <div className="pv0" data-node-id="300:1134" data-name="Page content">
        <ReportNavigation id={id} />
        <div className="pv98" data-node-id="300:1144" data-name="Report introduction">
          <div className="pv99" data-node-id="300:1145" data-name="Report status">
            <div className="pv83" data-node-id="300:1146" data-name="Status">
              <p
                className="pv84"
                data-node-id="300:1147"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {content('300:1147', 'AI-generated report')}
              </p>
            </div>
            <div className="pv10" data-node-id="300:1148" data-name="Status">
              <p
                className="pv11"
                data-node-id="300:1149"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {content('300:1149', 'English')}
              </p>
            </div>
          </div>
          <p className="pv100" data-node-id="300:1150" data-workspace-heading="true">
            <HeadingBack fallback="/reports" />
            <span>{tr(reportTitle)}</span>
          </p>
          <p
            className="pv101"
            data-node-id="300:1151"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            {content(
              '300:1151',
              'Bloom & Co. \u00b7 1\u201330 September 2026 \u00b7 Created 1 October 2026',
            )}
          </p>
        </div>
        <div className="pv102" data-node-id="300:1152" data-name="Report coverage">
          <div className="pv103" data-node-id="300:1153" data-name="Coverage metric">
            <p
              className="pv104"
              data-node-id="300:1154"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {content('300:1154', 'Customer reviews')}
            </p>
            <p
              className="pv70"
              data-node-id="300:1155"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {content('300:1155', '1,250')}
            </p>
            <p
              className="pv71"
              data-node-id="300:1156"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {content('300:1156', 'September 2026')}
            </p>
          </div>
          <div className="pv103" data-node-id="300:1157" data-name="Coverage metric">
            <p
              className="pv104"
              data-node-id="300:1158"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {content('300:1158', 'Branches covered')}
            </p>
            <p
              className="pv70"
              data-node-id="300:1159"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {content('300:1159', '3')}
            </p>
            <p
              className="pv71"
              data-node-id="300:1160"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {content('300:1160', 'Cairo \u00b7 El Zamalek \u00b7 Alex')}
            </p>
          </div>
          <div className="pv103" data-node-id="300:1161" data-name="Coverage metric">
            <p
              className="pv104"
              data-node-id="300:1162"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {content('300:1162', 'Cairo delay complaints')}
            </p>
            <p
              className="pv70"
              data-node-id="300:1163"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {content('300:1163', '104')}
            </p>
            <p
              className="pv71"
              data-node-id="300:1164"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {content('300:1164', '52 in August \u2192 104 in September')}
            </p>
          </div>
        </div>
        <div className="pv47" data-node-id="300:1165" data-name="Executive Summary">
          <div className="pv58" data-node-id="300:1166" data-name="Section heading">
            <p
              className="pv59"
              data-node-id="300:1167"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {content('300:1167', 'Executive Summary')}
            </p>
          </div>
          <p
            className="pv105"
            data-node-id="300:1168"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            {content(
              '300:1168',
              'Bloom & Co.\u2019s core product remains a strength: food quality is 86% positive across 640 mentions. Service is less consistent. El Zamalek leads at 82% positive sentiment, compared with Cairo at 62% and Alex at 74%. [D1, D2]',
            )}
          </p>
          <div className="pv106" data-node-id="300:1169" data-name="Executive takeaway">
            <div className="pv107" data-node-id="300:1170" data-name="sparkles">
              <img alt="" className="pv7" src={imgSparkles} />
            </div>
            <div className="pv108" data-node-id="300:1172" data-name="Interpretation">
              <p
                className="pv109"
                data-node-id="300:1173"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {content('300:1173', 'AI INTERPRETATION')}
              </p>
              <p
                className="pv110"
                data-node-id="300:1174"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {content(
                  '300:1174',
                  'Prioritize Cairo\u2019s evening queue and peak-hour coverage, clarify combo pricing, and share El Zamalek\u2019s service practices. The evidence points to operational friction, not a need to change the food offer. [D1\u2013D3, E1\u2013E3]',
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="pv12" data-node-id="300:1175" data-name="Strengths and pain points">
          <div className="pv111" data-node-id="300:1176" data-name="Business Strengths">
            <div className="pv48" data-node-id="300:1177" data-name="Section heading">
              <p
                className="pv49"
                data-node-id="300:1178"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {content('300:1178', 'Business Strengths')}
              </p>
              <p
                className="pv50"
                data-node-id="300:1179"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {content(
                  '300:1179',
                  '[D1] September aspect data \u00b7 positive sentiment by aspect',
                )}
              </p>
            </div>
            <p
              className="pv86"
              data-node-id="300:1180"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {content(
                '300:1180',
                'Protect food quality and the personal service customers appreciate. These are strengths to retain while improving speed. [E1, E2]',
              )}
            </p>
            <div className="pv112" data-node-id="300:1181" data-name="Aspect result">
              <div className="pv113" data-node-id="300:1182" data-name="Aspect figures">
                <p
                  className="pv114"
                  data-node-id="300:1183"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1183', 'Food quality')}
                </p>
                <p
                  className="pv71"
                  data-node-id="300:1184"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1184', '640 mentions \u00b7 86% positive')}
                </p>
              </div>
              <div className="pv115" data-node-id="300:1185" data-name="Positive share track">
                <div
                  className="pv116"
                  data-node-id="300:1186"
                  data-name="Positive share"
                  style={{ width: details.positive[0] + '%' }}
                />
              </div>
            </div>
            <div className="pv112" data-node-id="300:1187" data-name="Aspect result">
              <div className="pv113" data-node-id="300:1188" data-name="Aspect figures">
                <p
                  className="pv114"
                  data-node-id="300:1189"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1189', 'Staff friendliness')}
                </p>
                <p
                  className="pv71"
                  data-node-id="300:1190"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1190', '410 mentions \u00b7 81% positive')}
                </p>
              </div>
              <div className="pv115" data-node-id="300:1191" data-name="Positive share track">
                <div
                  className="pv117"
                  data-node-id="300:1192"
                  data-name="Positive share"
                  style={{ width: details.positive[1] + '%' }}
                />
              </div>
            </div>
            <div className="pv112" data-node-id="300:1193" data-name="Aspect result">
              <div className="pv113" data-node-id="300:1194" data-name="Aspect figures">
                <p
                  className="pv114"
                  data-node-id="300:1195"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1195', 'Order accuracy')}
                </p>
                <p
                  className="pv71"
                  data-node-id="300:1196"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1196', '280 mentions \u00b7 76% positive')}
                </p>
              </div>
              <div className="pv115" data-node-id="300:1197" data-name="Positive share track">
                <div
                  className="pv118"
                  data-node-id="300:1198"
                  data-name="Positive share"
                  style={{ width: details.positive[2] + '%' }}
                />
              </div>
            </div>
            <div className="pv112" data-node-id="300:1199" data-name="Aspect result">
              <div className="pv113" data-node-id="300:1200" data-name="Aspect figures">
                <p
                  className="pv114"
                  data-node-id="300:1201"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1201', 'Value for money')}
                </p>
                <p
                  className="pv71"
                  data-node-id="300:1202"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1202', '325 mentions \u00b7 65% positive')}
                </p>
              </div>
              <div className="pv115" data-node-id="300:1203" data-name="Positive share track">
                <div
                  className="pv119"
                  data-node-id="300:1204"
                  data-name="Positive share"
                  style={{ width: details.positive[3] + '%' }}
                />
              </div>
            </div>
            <div className="pv112" data-node-id="300:1205" data-name="Aspect result">
              <div className="pv113" data-node-id="300:1206" data-name="Aspect figures">
                <p
                  className="pv114"
                  data-node-id="300:1207"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1207', 'Service speed')}
                </p>
                <p
                  className="pv71"
                  data-node-id="300:1208"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1208', '360 mentions \u00b7 42% positive')}
                </p>
              </div>
              <div className="pv115" data-node-id="300:1209" data-name="Positive share track">
                <div
                  className="pv120"
                  data-node-id="300:1210"
                  data-name="Positive share"
                  style={{ width: details.positive[4] + '%' }}
                />
              </div>
            </div>
            <p
              className="pv121"
              data-node-id="300:1211"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {content(
                '300:1211',
                'A review may mention more than one aspect. Positive share is not a rating or a share of all reviews.',
              )}
            </p>
          </div>
          <div className="pv111" data-node-id="300:1212" data-name="Top Pain Points">
            <div className="pv48" data-node-id="300:1213" data-name="Section heading">
              <p
                className="pv49"
                data-node-id="300:1214"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {content('300:1214', 'Top Pain Points')}
              </p>
              <p
                className="pv50"
                data-node-id="300:1215"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {content('300:1215', 'Focus attention where feedback signals the most friction.')}
              </p>
            </div>
            <div className="pv33" data-node-id="300:1216" data-name="Pain point">
              <div
                className={id === 'service' ? 'pv83' : 'pv122'}
                data-node-id="300:1217"
                data-name="Status"
              >
                <p
                  className={id === 'service' ? 'pv84' : 'pv123'}
                  data-node-id="300:1218"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1218', 'High')}
                </p>
              </div>
              <div className="pv17" data-node-id="300:1219" data-name="Pain point detail">
                <p
                  className="pv124"
                  data-node-id="300:1220"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1220', 'Slow service, especially in Cairo')}
                </p>
                <p
                  className="pv19"
                  data-node-id="300:1221"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content(
                    '300:1221',
                    'Service speed has the lowest positive share: 42% across 360 mentions. Cairo delay complaints doubled to 104; one customer describes a 25-minute wait. [D1, D3, E1]',
                  )}
                </p>
              </div>
            </div>
            <div className="pv27" data-node-id="300:1222" data-name="Divider" />
            <div className="pv33" data-node-id="300:1223" data-name="Pain point">
              <div className="pv83" data-node-id="300:1224" data-name="Status">
                <p
                  className="pv84"
                  data-node-id="300:1225"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1225', 'Medium')}
                </p>
              </div>
              <div className="pv17" data-node-id="300:1226" data-name="Pain point detail">
                <p
                  className="pv124"
                  data-node-id="300:1227"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1227', 'Combo prices are not clear enough')}
                </p>
                <p
                  className="pv19"
                  data-node-id="300:1228"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content(
                    '300:1228',
                    '48 reviews across all branches flag pricing clarity. The supplied pricing quote describes a mismatch between the menu and the amount charged. [D3, E3]',
                  )}
                </p>
              </div>
            </div>
            <div className="pv125" data-node-id="300:1229" data-name="Analysis caveat">
              <div className="pv6" data-node-id="300:1230" data-name="info">
                <img alt="" className="pv7" src={imgInfo} />
              </div>
              <p
                className="pv126"
                data-node-id="300:1232"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {content(
                  '300:1232',
                  'Feedback identifies friction; it does not establish the operational cause.',
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="pv47" data-node-id="300:1233" data-name="Trends and Anomalies">
          <div className="pv48" data-node-id="300:1234" data-name="Section heading">
            <p
              className="pv49"
              data-node-id="300:1235"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {content('300:1235', 'Trends and Anomalies')}
            </p>
            <p
              className="pv50"
              data-node-id="300:1236"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {content(
                '300:1236',
                'Cairo\u2019s delay signal stands out; branch-level context shows where to learn.',
              )}
            </p>
          </div>
          <div className="pv127" data-node-id="300:1237" data-name="Trend analysis">
            <div className="pv128" data-node-id="300:1238" data-name="Delay comparison">
              <div className="pv129" data-node-id="300:1239" data-name="Trend heading">
                <p
                  className="pv130"
                  data-node-id="300:1240"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1240', 'Cairo \u00b7 Wait / delay complaints [D3]')}
                </p>
                <div
                  className="pv122"
                  data-node-id="300:1241"
                  data-name="Status"
                  data-improved={details.improved}
                >
                  <p
                    className="pv123"
                    data-node-id="300:1242"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {content('300:1242', '2\u00d7 vs. August')}
                  </p>
                </div>
              </div>
              <div className="pv78" data-node-id="300:1243" data-name="Period comparison">
                <p
                  className="pv131"
                  data-node-id="300:1244"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1244', 'August')}
                </p>
                <div
                  className="pv132"
                  data-node-id="300:1245"
                  data-name="Complaint volume"
                  style={{
                    width: (details.delay[0] / Math.max(...details.delay)) * 180 + 'px',
                    maxWidth: '100%',
                  }}
                />
                <p
                  className="pv36"
                  data-node-id="300:1246"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1246', '52')}
                </p>
              </div>
              <div className="pv78" data-node-id="300:1247" data-name="Period comparison">
                <p
                  className="pv131"
                  data-node-id="300:1248"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1248', 'September')}
                </p>
                <div
                  className="pv133"
                  data-node-id="300:1249"
                  data-name="Complaint volume"
                  style={{
                    width: (details.delay[1] / Math.max(...details.delay)) * 180 + 'px',
                    maxWidth: '100%',
                  }}
                />
                <p
                  className="pv36"
                  data-node-id="300:1250"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1250', '104')}
                </p>
              </div>
              <p
                className="pv134"
                data-node-id="300:1251"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {content(
                  '300:1251',
                  'A rising complaint count is a signal to investigate, not a complaint rate. August\u2019s total review volume is not provided.',
                )}
              </p>
            </div>
            <div className="pv135" data-node-id="300:1252" data-name="Branch context">
              <p
                className="pv136"
                data-node-id="300:1253"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {content('300:1253', '[D2] September branch comparison')}
              </p>
              <div className="pv129" data-node-id="300:1254" data-name="Branch result">
                <p
                  className="pv137"
                  data-node-id="300:1255"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1255', 'Cairo')}
                </p>
                <p
                  className="pv138"
                  data-node-id="300:1256"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1256', '500 reviews')}
                </p>
                <p
                  className="pv139"
                  data-node-id="300:1257"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1257', '62% positive')}
                </p>
              </div>
              <div className="pv129" data-node-id="300:1258" data-name="Branch result">
                <p
                  className="pv137"
                  data-node-id="300:1259"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1259', 'El Zamalek')}
                </p>
                <p
                  className="pv138"
                  data-node-id="300:1260"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1260', '450 reviews')}
                </p>
                <p
                  className="pv139"
                  data-node-id="300:1261"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1261', '82% positive')}
                </p>
              </div>
              <div className="pv129" data-node-id="300:1262" data-name="Branch result">
                <p
                  className="pv137"
                  data-node-id="300:1263"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1263', 'Alex')}
                </p>
                <p
                  className="pv138"
                  data-node-id="300:1264"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1264', '300 reviews')}
                </p>
                <p
                  className="pv139"
                  data-node-id="300:1265"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1265', '74% positive')}
                </p>
              </div>
              <p
                className="pv140"
                data-node-id="300:1266"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {content(
                  '300:1266',
                  'El Zamalek is a useful internal benchmark. Compare queue handling and welcome routines before rolling changes out.',
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="pv47" data-node-id="300:1267" data-name="Prioritized Recommendations">
          <div className="pv48" data-node-id="300:1268" data-name="Section heading">
            <p
              className="pv49"
              data-node-id="300:1269"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {content('300:1269', 'Prioritized Recommendations')}
            </p>
            <p
              className="pv50"
              data-node-id="300:1270"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {content(
                '300:1270',
                'AI-proposed actions \u00b7 owners and timing below are suggestions, not assigned tasks.',
              )}
            </p>
          </div>
          <div className="pv141" data-node-id="300:1271" data-name="Recommendation">
            <div className="pv142" data-node-id="300:1272" data-name="Priority">
              <div
                className={id === 'service' ? 'pv83' : 'pv122'}
                data-node-id="300:1273"
                data-name="Status"
              >
                <p
                  className={id === 'service' ? 'pv84' : 'pv123'}
                  data-node-id="300:1274"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1274', 'High priority')}
                </p>
              </div>
              <p
                className="pv30"
                data-node-id="300:1275"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {content('300:1275', 'Operations')}
              </p>
            </div>
            <div className="pv17" data-node-id="300:1276" data-name="Action plan">
              <p
                className="pv143"
                data-node-id="300:1277"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {content('300:1277', 'Shorten the evening queue at Cairo')}
              </p>
              <p
                className="pv144"
                data-node-id="300:1278"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {content(
                  '300:1278',
                  'Add peak-hour coverage and review the order handoff. Track delay mentions in the next reporting period to see whether the customer experience improves.',
                )}
              </p>
              <p
                className="pv145"
                data-node-id="300:1279"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {content(
                  '300:1279',
                  '104 Cairo delay reviews vs. 52 in August \u00b7 [D3] \u00b7 Customer evidence [E1]',
                )}
              </p>
            </div>
          </div>
          <div className="pv141" data-node-id="300:1280" data-name="Recommendation">
            <div className="pv142" data-node-id="300:1281" data-name="Priority">
              <div className="pv83" data-node-id="300:1282" data-name="Status">
                <p
                  className="pv84"
                  data-node-id="300:1283"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1283', 'Medium')}
                </p>
              </div>
              <p
                className="pv30"
                data-node-id="300:1284"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {content('300:1284', 'Commercial')}
              </p>
            </div>
            <div className="pv17" data-node-id="300:1285" data-name="Action plan">
              <p
                className="pv143"
                data-node-id="300:1286"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {content('300:1286', 'Make combo pricing clear before customers order')}
              </p>
              <p
                className="pv144"
                data-node-id="300:1287"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {content(
                  '300:1287',
                  'Show the full combo price consistently on menus and ordering screens. Check for mismatches between the displayed price and the amount charged.',
                )}
              </p>
              <p
                className="pv145"
                data-node-id="300:1288"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {content(
                  '300:1288',
                  '48 pricing-clarity reviews across all branches \u00b7 [D3] \u00b7 Customer evidence [E3]',
                )}
              </p>
            </div>
          </div>
          <div className="pv141" data-node-id="300:1289" data-name="Recommendation">
            <div className="pv142" data-node-id="300:1290" data-name="Priority">
              <div className="pv146" data-node-id="300:1291" data-name="Status">
                <p
                  className="pv147"
                  data-node-id="300:1292"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1292', 'Opportunity')}
                </p>
              </div>
              <p
                className="pv30"
                data-node-id="300:1293"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {content('300:1293', 'Branch leads')}
              </p>
            </div>
            <div className="pv17" data-node-id="300:1294" data-name="Action plan">
              <p
                className="pv143"
                data-node-id="300:1295"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {content('300:1295', 'Replicate El Zamalek\u2019s service playbook')}
              </p>
              <p
                className="pv144"
                data-node-id="300:1296"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {content(
                  '300:1296',
                  'Document how the team welcomes regular customers and coordinates service. Test those routines in Cairo and Alex while preserving each branch\u2019s character.',
                )}
              </p>
              <p
                className="pv145"
                data-node-id="300:1297"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {content(
                  '300:1297',
                  '92 reviews supporting the service-playbook opportunity \u00b7 [D3] \u00b7 Customer evidence [E2]',
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="pv47" data-node-id="300:1298" data-name="Supporting Evidence">
          <div className="pv48" data-node-id="300:1299" data-name="Section heading">
            <p
              className="pv49"
              data-node-id="300:1300"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {content('300:1300', 'Supporting Evidence')}
            </p>
            <p
              className="pv50"
              data-node-id="300:1301"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {content(
                '300:1301',
                'Original customer feedback is shown separately from AI interpretation. Evidence labels connect each source to the analysis above.',
              )}
            </p>
          </div>
          <div className="pv148" data-node-id="300:1302" data-name="Customer evidence">
            <div className="pv26" data-node-id="300:1303" data-name="Evidence source">
              <div className="pv149" data-node-id="300:1304" data-name="Original feedback evidence">
                <div className="pv129" data-node-id="300:1305" data-name="Evidence heading">
                  <div className="pv10" data-node-id="300:1306" data-name="Status">
                    <p
                      className="pv11"
                      data-node-id="300:1307"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {content('300:1307', '[E1] Original feedback')}
                    </p>
                  </div>
                  <div className="pv6" data-node-id="300:1308" data-name="quote">
                    <img alt="" className="pv7" src={imgQuote} />
                  </div>
                </div>
                <p
                  className="pv150"
                  data-node-id="300:1310"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1310', 'Google \u00b7 Cairo \u00b7 Sep 18, 2026 \u00b7 Arabic')}
                </p>
                <p
                  className="pv151"
                  dir="auto"
                  data-node-id="300:1311"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content(
                    '300:1311',
                    '\u0627\u0644\u0642\u0647\u0648\u0629 \u0645\u0645\u062a\u0627\u0632\u0629 \u0644\u0643\u0646 \u0627\u0646\u062a\u0638\u0631\u0646\u0627 \u0627\u0644\u0637\u0644\u0628 \u0662\u0665 \u062f\u0642\u064a\u0642\u0629.',
                  )}
                </p>
                <p
                  className="pv152"
                  data-node-id="300:1312"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1312', 'ENGLISH TRANSLATION')}
                </p>
                <p
                  className="pv153"
                  data-node-id="300:1313"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content(
                    '300:1313',
                    'The coffee is good, but we waited 25 minutes for the order.',
                  )}
                </p>
                <button
                  type="button"
                  className="pv154 semantic-button"
                  data-node-id="300:1314"
                  data-name="Evidence action"

                  onClick={() =>
                    id === 'september'
                      ? (location.hash = '/feedback-details?id=1248')
                      : setEvidence('1')
                  }
                >
                  <p
                    className="pv62"
                    data-node-id="300:1315"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {content('300:1315', 'View Original Feedback')}
                  </p>
                  <div className="pv155" data-node-id="300:1316" data-name="arrow-up-right">
                    <PreviewArrow direction="external" />
                  </div>
                </button>
              </div>
            </div>
            <div className="pv26" data-node-id="300:1318" data-name="Evidence source">
              <div className="pv149" data-node-id="300:1319" data-name="Original feedback evidence">
                <div className="pv129" data-node-id="300:1320" data-name="Evidence heading">
                  <div className="pv10" data-node-id="300:1321" data-name="Status">
                    <p
                      className="pv11"
                      data-node-id="300:1322"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {content('300:1322', '[E2] Original feedback')}
                    </p>
                  </div>
                  <div className="pv6" data-node-id="300:1323" data-name="quote">
                    <img alt="" className="pv7" src={imgQuote} />
                  </div>
                </div>
                <p
                  className="pv150"
                  data-node-id="300:1325"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content(
                    '300:1325',
                    'Post-visit survey \u00b7 El Zamalek \u00b7 Sep 24, 2026 \u00b7 English',
                  )}
                </p>
                <p
                  className="pv153"
                  data-node-id="300:1326"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content(
                    '300:1326',
                    '\u201cThe team remembered my order and made me feel welcome.\u201d',
                  )}
                </p>
                <button
                  type="button"
                  className="pv154 semantic-button"
                  data-node-id="300:1327"
                  data-name="Evidence action"

                  onClick={() =>
                    id === 'september'
                      ? (location.hash = '/feedback-details?id=1248')
                      : setEvidence('2')
                  }
                >
                  <p
                    className="pv62"
                    data-node-id="300:1328"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {content('300:1328', 'View Original Feedback')}
                  </p>
                  <div className="pv155" data-node-id="300:1329" data-name="arrow-up-right">
                    <PreviewArrow direction="external" />
                  </div>
                </button>
              </div>
            </div>
            <div className="pv26" data-node-id="300:1331" data-name="Evidence source">
              <div className="pv149" data-node-id="300:1332" data-name="Original feedback evidence">
                <div className="pv129" data-node-id="300:1333" data-name="Evidence heading">
                  <div className="pv10" data-node-id="300:1334" data-name="Status">
                    <p
                      className="pv11"
                      data-node-id="300:1335"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {content('300:1335', '[E3] Original feedback')}
                    </p>
                  </div>
                  <div className="pv6" data-node-id="300:1336" data-name="quote">
                    <img alt="" className="pv7" src={imgQuote} />
                  </div>
                </div>
                <p
                  className="pv121"
                  data-node-id="300:1338"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content('300:1338', 'Pricing feedback \u00b7 Source and date not supplied')}
                </p>
                <p
                  className="pv156"
                  data-node-id="300:1339"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {content(
                    '300:1339',
                    '\u201cThe combo cost more than the price on the menu.\u201d',
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="pv27" data-node-id="300:1340" data-name="Divider" />
          <p
            className="pv121"
            data-node-id="300:1341"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            {content(
              '300:1341',
              'Data references: [D1] September aspect figures \u00b7 [D2] September branch figures, 1,250 reviews \u00b7 [D3] Supplied complaint and recommendation counts. Quotes are illustrative evidence of a theme, not a representative sample on their own.',
            )}
          </p>
        </div>
        <div className="pv129" data-node-id="300:1342" data-name="Report footer">
          <p
            className="pv30"
            data-node-id="300:1343"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            {content(
              '300:1343',
              'Generated from Bloom & Co.\u2019s September 2026 feedback \u00b7 Current language: English',
            )}
          </p>
        </div>
      </div>
      {generate && <GenerateDialog onClose={() => setGenerate(false)} />}
      {evidence !== null && (
        <div
          className="preview-modal-backdrop"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) (() => setEvidence(null))(event);
          }}
        >
          <section
            className="preview-modal"
            role="dialog"
            aria-modal="true"
            aria-label={tr('Sample feedback')}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{tr('Sample feedback')}</h2>
            <p dir="auto">{content(evidence === '1' ? '300:1311' : '300:1326', '')}</p>
            {evidence === '1' && <p>{content('300:1313', '')}</p>}
            <button
              type="button"
              className="feedback-btn"
              autoFocus
              onClick={() => setEvidence(null)}
            >
              {tr('Close')}
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
export default function ReportDetailsScreen() {
  const id = new URLSearchParams(location.hash.split('?')[1]).get('id') || 'september';
  return <ReportContent key={id} id={id} />;
}
