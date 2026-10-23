import WorkspaceScopeControls from '../../dashboard/WorkspaceScopeControls.jsx';
import { overviewDateLabel } from '../../dashboard/OverviewControls.jsx';
import React, { useState, useRef, useEffect } from 'react';
import { asset } from '../../../lib/assets.js';
import { useProductView } from '../../../app/providers/ProductProvider.jsx';
import { PreviewArrow, GenerateDialog } from './PreviewControls.jsx';
import './figma-preview.css';
const imgPlus = asset('preview/assistantDesign-imgPlus.svg');
const imgStore = asset('preview/assistantDesign-imgStore.svg');
const imgCalendarDays = asset('preview/assistantDesign-imgCalendarDays.svg');
const imgSparkles = asset('preview/assistantDesign-imgSparkles.svg');
const imgMessageCircle = asset('preview/assistantDesign-imgMessageCircle.svg');
const imgArrowUpRight = asset('preview/assistantDesign-imgArrowUpRight.svg');
const imgSparkles1 = asset('preview/assistantDesign-imgSparkles1.svg');
const imgLoadingDot = asset('preview/assistantDesign-imgLoadingDot.svg');
const imgLoadingDot1 = asset('preview/assistantDesign-imgLoadingDot1.svg');
const imgArrowUp = asset('preview/assistantDesign-imgArrowUp.svg');
const imgCheckCheck = asset('preview/assistantDesign-imgCheckCheck.svg');
const imgScanText = asset('preview/assistantDesign-imgScanText.svg');
export default function AssistantScreen() {
  const { tr, language, dashboard } = useProductView();
  const [generate, setGenerate] = useState(false);
  const [reportFilters, ,] = useState({});
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
  const [question, setQuestion] = useState(''),
    [lastQuestion, setLastQuestion] = useState('What are the most common complaints?'),
    [reply, setReply] = useState(''),
    [fresh, setFresh] = useState(false);
  const ask = (q) => {
    if (!q.trim()) return;
    setFresh(false);
    setLastQuestion(q);
    setQuestion('');
    setReply(
      'This preview uses sample feedback only. One Cairo customer mentions a 25-minute wait while praising the coffee and welcoming team. Review the original response for context.',
    );
  };
  return (
    <div
      className="figma-preview assistant-preview"
      ref={ref}
      onClick={(e) => {
        const item = e.target.closest('[data-name="Suggested question"],[data-name="Action"]');
        if (!item) return;
        if (item.closest('[data-name="Message composer"]')) ask(question);
        else if (item.closest('[data-name="Page introduction"]')) {
          setFresh(true);
          setReply('');
          setQuestion('');
        } else if (item.dataset.name === 'Suggested question')
          ask(item.querySelector('p').textContent);
      }}
    >
      <div className="pv0" data-node-id="301:1453" data-name="Page content">
        <div className="pv1" data-node-id="301:1454" data-name="Page introduction">
          <div className="pv2" data-node-id="301:1455" data-name="Introduction">
            <p className="pv3" data-node-id="301:1456">
              {tr('AI Assistant')}
            </p>
            <p
              className="pv4"
              data-node-id="301:1457"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {tr(
                'Ask about your feedback. Get clear answers grounded in what customers actually said.',
              )}
            </p>
          </div>
          <button type="button" className="pv5" data-node-id="301:1458" data-name="Action">
            <div className="pv6" data-node-id="301:1459" data-name="plus">
              <img alt="" className="pv7" src={imgPlus} />
            </div>
            <p
              className="pv8"
              data-node-id="301:1461"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {tr('New conversation')}
            </p>
          </button>
        </div>
        <div className="pv1" data-node-id="301:1462" data-name="Conversation controls">
          <div className="pv9" data-node-id="301:1463" data-name="Data scope">
            <WorkspaceScopeControls />
            <div className="pv10" data-node-id="301:1472" data-name="Status">
              <p
                className="pv11"
                data-node-id="301:1473"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {tr('1,250 reviews')}
              </p>
            </div>
          </div>
          <div className="pv10" data-node-id="301:1474" data-name="Status">
            <p
              className="pv11"
              data-node-id="301:1475"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {tr('English answers')}
            </p>
          </div>
        </div>
        <div className="pv12" data-node-id="301:1476" data-name="Assistant workspace">
          <div className="pv13" data-node-id="301:1477" data-name="Conversation">
            <div className="pv14" data-node-id="301:1478" data-name="Assistant introduction">
              <div className="pv15" data-node-id="301:1479" data-name="Assistant avatar">
                <div className="pv16" data-node-id="301:1480" data-name="sparkles">
                  <img alt="" className="pv7" src={imgSparkles} />
                </div>
              </div>
              <div className="pv17" data-node-id="301:1482" data-name="Welcome copy">
                <p
                  className="pv18"
                  data-node-id="301:1483"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('What would you like to understand?')}
                </p>
                <p
                  className="pv19"
                  data-node-id="301:1484"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr(
                    'Explore patterns across Bloom & Co., find opportunities to improve, or dig into a customer concern.',
                  )}
                </p>
              </div>
            </div>
            <div className="assistant-conversation-scroll">
              {' '}
              <div className="pv20" data-node-id="301:1485" data-name="Suggested questions">
                <button
                  type="button"
                  className="pv21"
                  data-node-id="301:1486"
                  data-name="Suggested question"
                >
                  <div className="pv22" data-node-id="301:1487" data-name="message-circle">
                    <img alt="" className="pv7" src={imgMessageCircle} />
                  </div>
                  <p
                    className="pv23"
                    data-node-id="301:1489"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('What are the most common complaints?')}
                  </p>
                  <div className="pv24" data-node-id="301:1490" data-name="arrow-up-right">
                    <PreviewArrow direction="external" />
                  </div>
                </button>
                <button
                  type="button"
                  className="pv21"
                  data-node-id="301:1492"
                  data-name="Suggested question"
                >
                  <div className="pv22" data-node-id="301:1493" data-name="message-circle">
                    <img alt="" className="pv7" src={imgMessageCircle} />
                  </div>
                  <p
                    className="pv23"
                    data-node-id="301:1495"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Which aspect needs improvement?')}
                  </p>
                  <div className="pv24" data-node-id="301:1496" data-name="arrow-up-right">
                    <PreviewArrow direction="external" />
                  </div>
                </button>
                <button
                  type="button"
                  className="pv21"
                  data-node-id="301:1498"
                  data-name="Suggested question"
                >
                  <div className="pv22" data-node-id="301:1499" data-name="message-circle">
                    <img alt="" className="pv7" src={imgMessageCircle} />
                  </div>
                  <p
                    className="pv23"
                    data-node-id="301:1501"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('What changed this month?')}
                  </p>
                  <div className="pv24" data-node-id="301:1502" data-name="arrow-up-right">
                    <PreviewArrow direction="external" />
                  </div>
                </button>
              </div>
              <div className="pv25" data-node-id="301:1504" data-name="Conversation divider">
                <div className="pv26" data-node-id="301:1505" data-name="Rule">
                  <div className="pv27" data-node-id="301:1506" data-name="Divider" />
                </div>
                <p
                  className="pv28"
                  data-node-id="301:1507"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('TODAY')}
                </p>
                <div className="pv26" data-node-id="301:1508" data-name="Rule">
                  <div className="pv27" data-node-id="301:1509" data-name="Divider" />
                </div>
              </div>
              <div className="pv29" data-node-id="301:1510" data-name="User message" hidden={fresh}>
                <p
                  className="pv30"
                  data-node-id="301:1511"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('Sara Ahmed \u00b7 Just now')}
                </p>
                <div className="pv31" data-node-id="301:1512" data-name="User question">
                  <p>{tr(lastQuestion)}</p>
                </div>
              </div>
              <div
                className="pv33"
                data-node-id="301:1514"
                data-name="Assistant pending message"
                hidden={fresh}
              >
                <div className="pv34" data-node-id="301:1515" data-name="Assistant avatar">
                  <div className="pv6" data-node-id="301:1516" data-name="sparkles">
                    <img alt="" className="pv7" src={imgSparkles1} />
                  </div>
                </div>
                <div className="pv35" data-node-id="301:1518" data-name="Loading response">
                  {reply ? (
                    <div className="preview-answer" role="status">
                      <strong>{tr('Preview answer')}</strong>
                      <p>{tr(reply)}</p>
                      <button
                        type="button"
                        onClick={() => (location.hash = '/feedback-details?id=1248')}
                      >
                        {tr('View original feedback')}
                      </button>
                    </div>
                  ) : (
                    <>
                      <p
                        className="pv36"
                        data-node-id="301:1519"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('NUVIA Assistant')}
                      </p>
                      <div className="pv37" data-node-id="301:1520" data-name="Loading indicator">
                        <div className="pv38" data-node-id="301:1521" data-name="Loading dot">
                          <img alt="" className="pv7" src={imgLoadingDot} />
                        </div>
                        <div className="pv38" data-node-id="301:1522" data-name="Loading dot">
                          <img alt="" className="pv7" src={imgLoadingDot1} />
                        </div>
                        <div className="pv38" data-node-id="301:1523" data-name="Loading dot">
                          <img alt="" className="pv7" src={imgLoadingDot1} />
                        </div>
                        <p
                          className="pv39"
                          data-node-id="301:1524"
                          style={{ fontVariationSettings: '"opsz" 14' }}
                        >
                          {tr('Reviewing your September feedback\u2026')}
                        </p>
                      </div>
                      <p
                        className="pv40"
                        data-node-id="301:1525"
                        style={{ fontVariationSettings: '"opsz" 14' }}
                      >
                        {tr('Checking themes and matching original customer evidence.')}
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div
                className="pv41"
                data-node-id="301:1526"
                data-name="Conversation breathing room"
              />
            </div>
            <div className="pv20" data-node-id="301:1527" data-name="Message composer">
              <div className="pv42" data-node-id="301:1528" data-name="Question input">
                <input
                  className="preview-question"
                  aria-label={tr('Ask a follow-up about this feedback…')}
                  placeholder={tr('Ask a follow-up about this feedback…')}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') ask(question);
                  }}
                />

                <button type="button" className="pv44" data-node-id="301:1530" data-name="Action">
                  <div className="pv6" data-node-id="301:1531" data-name="arrow-up">
                    <PreviewArrow direction="up" />
                  </div>
                </button>
              </div>
              <p
                className="pv45"
                data-node-id="301:1533"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {tr(
                  'NUVIA uses your selected feedback. AI can make mistakes; check the original sources.',
                )}
              </p>
            </div>
          </div>
          <div className="pv46" data-node-id="301:1534" data-name="Conversation context">
            <div className="pv47" data-node-id="301:1535" data-name="In this conversation">
              <div className="pv48" data-node-id="301:1536" data-name="Section heading">
                <p
                  className="pv49"
                  data-node-id="301:1537"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('In this conversation')}
                </p>
                <p
                  className="pv50"
                  data-node-id="301:1538"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('Only the selected feedback is in scope.')}
                </p>
              </div>
              <div className="pv51" data-node-id="301:1539" data-name="Scope details">
                <div className="pv52" data-node-id="301:1540" data-name="Context item">
                  <p
                    className="pv53"
                    data-node-id="301:1541"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Business')}
                  </p>
                  <p
                    className="pv54"
                    data-node-id="301:1542"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Bloom & Co.')}
                  </p>
                </div>
                <div className="pv52" data-node-id="301:1543" data-name="Context item">
                  <p
                    className="pv53"
                    data-node-id="301:1544"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Period')}
                  </p>
                  <p
                    className="pv54"
                    data-node-id="301:1545"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {overviewDateLabel(dashboard.filters, language)}
                  </p>
                </div>
                <div className="pv52" data-node-id="301:1546" data-name="Context item">
                  <p
                    className="pv53"
                    data-node-id="301:1547"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Branches')}
                  </p>
                  <p
                    className="pv54"
                    data-node-id="301:1548"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {dashboard.filters.branch === 'all'
                      ? ['Cairo', 'El Zamalek', 'Alex'].map(tr).join('، ')
                      : tr(dashboard.filters.branch)}
                  </p>
                </div>
                <div className="pv52" data-node-id="301:1549" data-name="Context item">
                  <p
                    className="pv53"
                    data-node-id="301:1550"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Dataset')}
                  </p>
                  <p
                    className="pv54"
                    data-node-id="301:1551"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {tr('Sample feedback scope')}
                  </p>
                </div>
              </div>
              <div className="pv27" data-node-id="301:1552" data-name="Divider" />
              <div className="pv55" data-node-id="301:1553" data-name="Scope status">
                <div className="pv6" data-node-id="301:1554" data-name="check-check">
                  <img alt="" className="pv7" src={imgCheckCheck} />
                </div>
                <p
                  className="pv56"
                  data-node-id="301:1556"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('Feedback ready for analysis')}
                </p>
              </div>
            </div>
            <div className="pv57" data-node-id="301:1557" data-name="Answers you can verify">
              <div className="pv58" data-node-id="301:1558" data-name="Section heading">
                <p
                  className="pv59"
                  data-node-id="301:1559"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {tr('Answers you can verify')}
                </p>
              </div>
              <div className="pv60" data-node-id="301:1560" data-name="scan-text">
                <img alt="" className="pv7" src={imgScanText} />
              </div>
              <p
                className="pv61"
                data-node-id="301:1562"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {tr(
                  'AI interpretation is labeled. Original customer quotes appear separately with their source, branch and date when available.',
                )}
              </p>
              <p
                className="pv62"
                data-node-id="301:1563"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {tr('Follow the evidence, not just the answer.')}
              </p>
            </div>
          </div>
        </div>
      </div>
      {generate && <GenerateDialog onClose={() => setGenerate(false)} />}
    </div>
  );
}
