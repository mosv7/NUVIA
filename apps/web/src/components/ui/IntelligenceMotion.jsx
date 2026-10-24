import { asset } from '../../lib/assets.js';
import React, { useEffect, useRef, useState } from 'react';
import './intelligence-motion.css';

const variants = ['core', 'decisions', 'layers'];
const copy = {
  en: {
    core: 'Intelligence core',
    decisions: 'Feedback to decisions',
    layers: 'Living intelligence',
    feedback: 'Customer feedback',
    analysis: 'AI analysis',
    insights: 'Clear insights',
    actions: 'Recommended actions',
    decisionsLabel: 'Better decisions',
    sample: 'Illustrative product animation',
    processing: 'Finding the signal',
    ready: 'Clarity, from every voice',
    quality: 'Loved the coffee. The wait was a little long.',
    service: 'The team made us feel welcome.',
    arabic: 'القهوة ممتازة، لكن الانتظار طويل.',
    pattern: 'A pattern worth noticing',
    patternBody: 'Wait time · recurring theme',
    recommend: 'Make the next visit better',
    recommendBody: 'Review peak-hour service',
    evidence: 'Connected to the original feedback',
    pause: 'Pause animation',
    play: 'Play animation',
    replay: 'Replay journey',
    signal: 'Listening. Understanding. Moving forward.',
    preview: 'Motion preview',
  },
  ar: {
    core: 'نواة الذكاء',
    decisions: 'من الآراء إلى القرارات',
    layers: 'ذكاء يتفاعل معك',
    feedback: 'آراء العملاء',
    analysis: 'تحليل ذكي',
    insights: 'رؤى واضحة',
    actions: 'خطوات مقترحة',
    decisionsLabel: 'قرارات أفضل',
    sample: 'حركة توضيحية للمنتج',
    processing: 'نكتشف ما يهم',
    ready: 'وضوح يبدأ من كل رأي',
    quality: 'القهوة ممتازة، لكن الانتظار طويل.',
    service: 'الفريق رحّب بينا واهتم بتجربتنا.',
    arabic: 'خدمة رائعة وتجربة تستحق التكرار.',
    pattern: 'نمط يستحق الانتباه',
    patternBody: 'وقت الانتظار · موضوع متكرر',
    recommend: 'اجعل الزيارة القادمة أفضل',
    recommendBody: 'راجع الخدمة في أوقات الذروة',
    evidence: 'مرتبطة بآراء العملاء الأصلية',
    pause: 'إيقاف الحركة',
    play: 'تشغيل الحركة',
    replay: 'إعادة الرحلة',
    signal: 'نستمع. نفهم. ونتقدم.',
    preview: 'معاينة الحركة',
  },
};

export function MotionIcon({ name, size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.55"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === 'spark' ? (
        <>
          <path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3Z" />
          <path d="m20 2 .6 1.4L22 4l-1.4.6L20 6l-.6-1.4L18 4l1.4-.6L20 2Z" />
        </>
      ) : name === 'feedback' ? (
        <>
          <path d="M20 15a3 3 0 0 1-3 3H8l-5 3V6a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3Z" />
          <path d="M7 8h9M7 12h6" />
        </>
      ) : name === 'insights' ? (
        <>
          <path d="M4 20V10m6 10V5m6 15v-8m5 8H2" />
          <path d="m4 7 6-4 6 6 5-6" />
        </>
      ) : name === 'check' ? (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 3 3 5-6" />
        </>
      ) : name === 'arrow' ? (
        <path d="M4 12h16m-6-6 6 6-6 6" />
      ) : name === 'pause' ? (
        <>
          <path d="M9 5v14M15 5v14" />
        </>
      ) : name === 'play' ? (
        <path d="m8 4 12 8-12 8V4Z" />
      ) : (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="m5 5-2 0v5M3 5a10 10 0 1 1-1 10" />
        </>
      )}
    </svg>
  );
}

function Core({ compact = false }) {
  return (
    <div className={'intelligence-core' + (compact ? ' compact' : '')} aria-hidden="true">
      <div className="core-halo" />
      <div className="core-orbit orbit-one" />
      <div className="core-orbit orbit-two" />
      <div className="core-orbit orbit-three" />
      <svg className="core-crystal" viewBox="0 0 240 240">
        <defs>
          <radialGradient id="crystal-fill">
            <stop stopColor="#edfbff" />
            <stop offset=".2" stopColor="#5edbff" />
            <stop offset=".52" stopColor="#367fff" stopOpacity=".78" />
            <stop offset="1" stopColor="#164cdb" stopOpacity=".08" />
          </radialGradient>
          <linearGradient id="facet-stroke" x2="1" y2="1">
            <stop stopColor="#a9e6ff" />
            <stop offset=".5" stopColor="#1e68ef" />
            <stop offset="1" stopColor="#bed7ff" />
          </linearGradient>
        </defs>
        <g className="crystal-outer">
          <path
            d="m120 12 63 29 37 58-11 74-55 49-75-8-54-49-7-75 41-54Z"
            fill="url(#crystal-fill)"
            stroke="#92bfff"
            strokeWidth=".8"
          />
          <path
            d="m120 12-9 54L59 36l2 59-43-5 49 39-42 36 63-2-9 51 41-38 34 46-1-58 56 9-38-48 49-26-63-7 26-51-62 25Z"
            fill="none"
            stroke="#74aaff"
            strokeWidth=".7"
            opacity=".75"
          />
          <path
            d="m59 36 61 140L183 41 67 129l142 44L111 66l43 156L61 95l159 4L88 163Z"
            fill="none"
            stroke="#a5ccff"
            strokeWidth=".6"
            opacity=".7"
          />
        </g>
        <g className="crystal-inner">
          <path
            d="m120 52 48 28 19 49-30 47-54 13-42-36 1-57Z"
            fill="url(#crystal-fill)"
            stroke="url(#facet-stroke)"
            strokeWidth="2"
          />
          <path
            d="m120 70 35 21 13 36-23 35-38 10-29-27 1-41Z"
            fill="none"
            stroke="#8fd6ff"
            strokeWidth="1.2"
          />
          <path
            d="m120 87 24 15 8 25-15 23-26 7-20-18 1-28Z"
            fill="#abdfff"
            fillOpacity=".4"
            stroke="#d7f6ff"
          />
          <circle cx="120" cy="122" r="13" fill="#d6f7ff" />
          <circle cx="120" cy="122" r="6" fill="white" />
        </g>
      </svg>
      <div className="core-rim" />
      <i className="orbit-dot dot-one" />
      <i className="orbit-dot dot-two" />
      <i className="orbit-dot dot-three" />
    </div>
  );
}

function ReferenceCore() {
  return (
    <div className="reference-core reference-art-core" aria-hidden="true">
      <div className="reference-art-shadow" />
      <div className="reference-art-sphere">
        <img src={asset('reference-intelligence-clean.png')} alt="" />
        <div className="reference-glass-spin">
          <img src={asset('reference-intelligence-clean.png')} alt="" />
        </div>
        <div className="reference-art-light" />
      </div>
      <div className="reference-meridian meridian-a" />
      <div className="reference-meridian meridian-b" />
      {Array.from({ length: 9 }, (_, i) => (
        <i key={i} className="reference-node" style={{ '--node': i }} />
      ))}
    </div>
  );
}
function ReferenceScene({ language }) {
  const ar = language === 'ar',
    sceneRef = useRef(null);
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const timer = setInterval(() => {
      if (!media.matches && !document.hidden && !sceneRef.current?.closest('.motion-paused'))
        setFrame((value) => (value + 1) % 4);
    }, 3200);
    return () => clearInterval(timer);
  }, []);
  const insightValues = [
    [32, -18, 27],
    [34, -16, 29],
    [-8, 12, -6],
    [0, -7, 11],
  ][frame];
  const trendValues = [
    [45, 28, 22],
    [47, 30, 24],
    [-12, -9, -5],
    [0, 3, -2],
  ][frame];
  const graphPaths = [
    'M0 34 12 26 22 30 35 19 46 26 57 15 70 20 81 8 94 15 107 7 118 14 132 5 145 11 160 4',
    'M0 32 12 29 22 24 35 22 46 18 57 21 70 14 81 12 94 9 107 12 118 7 132 9 145 4 160 6',
    'M0 6 12 10 22 8 35 15 46 12 57 19 70 16 81 23 94 20 107 28 118 25 132 32 145 29 160 37',
    'M0 21 12 18 22 23 35 20 46 17 57 22 70 19 81 24 94 20 107 18 118 22 132 19 145 23 160 21',
  ];
  const metricTone = (value, lowerIsBetter = false) =>
    value === 0 ? 'neutral' : (lowerIsBetter ? value < 0 : value > 0) ? 'positive' : 'negative';
  const graphTone = ['positive', 'positive', 'negative', 'neutral'][frame];
  const feedbackSamples = [
    {
      en: 'The app is easy to use and saves me time.',
      ar: 'التطبيق سهل وبسيط ووفر عليّ وقت كتير.',
      positive: true,
      stars: 5,
    },
    {
      en: 'Checkout takes too long and needs fewer steps.',
      ar: 'الدفع بياخد وقت طويل ومحتاج خطوات أقل.',
      positive: false,
      stars: 2,
    },
    {
      en: 'The support team resolved my issue quickly.',
      ar: 'فريق الدعم حل مشكلتي بسرعة.',
      positive: true,
      stars: 5,
    },
    {
      en: 'The latest update made navigation confusing.',
      ar: 'التحديث الأخير خلّى التنقل محيّر.',
      positive: false,
      stars: 2,
    },
    {
      en: 'The new checkout is fast and straightforward.',
      ar: 'الدفع الجديد سريع وواضح.',
      positive: true,
      stars: 5,
    },
    {
      en: 'I waited too long for a support response.',
      ar: 'استنيت وقت طويل عشان الدعم يرد.',
      positive: false,
      stars: 1,
    },
    {
      en: 'Finding what I need is much easier now.',
      ar: 'بقيت بلاقي اللي محتاجه بسهولة.',
      positive: true,
      stars: 4,
    },
    {
      en: 'The app keeps freezing when I try to pay.',
      ar: 'التطبيق بيعلق كل ما أحاول أدفع.',
      positive: false,
      stars: 1,
    },
  ];
  const feedbackItems = Array.from(
    { length: 3 },
    (_, i) => feedbackSamples[(frame * 2 + i) % feedbackSamples.length],
  );
  const graphPath = graphPaths[frame],
    formatMetric = (value) => (value < 0 ? '−' : '+') + Math.abs(value) + '%';
  return (
    <div className="reference-scene" ref={sceneRef}>
      <FlowLines />
      <ReferenceCore />
      <div className="reference-feedback-stack">
        {feedbackItems.map((feedback, i) => (
          <article className={'reference-feedback reference-float-' + i} key={i}>
            <span className="reference-avatar">
              <MotionIcon name="feedback" size={12} />
            </span>
            <div>
              <p>{ar ? feedback.ar : feedback.en}</p>
              <div
                className="reference-rating"
                data-sentiment={feedback.positive ? 'positive' : 'negative'}
              >
                {'★'.repeat(feedback.stars)}
                <small className={feedback.positive ? '' : 'negative'}>
                  {ar
                    ? feedback.positive
                      ? 'إيجابي'
                      : 'سلبي'
                    : feedback.positive
                      ? 'Positive'
                      : 'Negative'}
                </small>
              </div>
            </div>
          </article>
        ))}
      </div>
      <article className="reference-panel reference-insights">
        <h3>
          <MotionIcon name="insights" size={13} />
          {ar ? 'أهم الرؤى' : 'Key Insights'}
        </h3>
        {(ar
          ? ['رضا العملاء', 'سهولة الدفع', 'جودة الدعم']
          : ['Customer satisfaction', 'Checkout friction', 'Support quality']
        ).map((x, i) => (
          <div className="reference-metric" key={x}>
            <MotionIcon name={i === 2 ? 'check' : 'feedback'} size={12} />
            <span>{x}</span>
            <b data-tone={metricTone(insightValues[i], i === 1)}>
              {formatMetric(insightValues[i])}
            </b>
          </div>
        ))}
      </article>
      <article className="reference-panel reference-trends">
        <h3>
          <MotionIcon name="insights" size={13} />
          {ar ? 'اتجاهات جديدة' : 'Emerging Trends'}
        </h3>
        <svg viewBox="0 0 160 42" fill="none" aria-hidden="true" data-tone={graphTone}>
          <path d={graphPath} stroke="currentColor" strokeWidth="1.5" />
          <path d={graphPath + 'V42H0Z'} fill="currentColor" fillOpacity=".12" />
        </svg>
        {(ar
          ? ['زيادة استخدام الموبايل', 'دعم أسرع', 'اهتمام بالمزايا الجديدة']
          : ['More mobile usage', 'Faster support response', 'Interest in new features']
        ).map((x, i) => (
          <div key={x}>
            <span>{x}</span>
            <b data-tone={metricTone(trendValues[i])}>{formatMetric(trendValues[i])}</b>
          </div>
        ))}
      </article>
      <article className="reference-panel reference-actions">
        <h3>
          <MotionIcon name="spark" size={13} />
          {ar ? 'خطوات مقترحة' : 'Recommended Actions'}
        </h3>
        {(ar
          ? ['تحسين تجربة الدفع', 'تطوير مزايا الموبايل', 'الحفاظ على سرعة الدعم']
          : ['Improve checkout flow', 'Expand mobile features', 'Maintain fast support']
        ).map((x) => (
          <div key={x}>
            <MotionIcon name="check" size={13} />
            <span>{x}</span>
            <MotionIcon name="arrow" size={10} />
          </div>
        ))}
      </article>
    </div>
  );
}

function FeedbackCard({ text, index = 0 }) {
  return (
    <article className={'motion-card feedback-card feedback-' + index}>
      <div className="motion-card-label">
        <span className="feedback-avatar">{index === 1 ? 'M' : 'A'}</span>
        <span>{index === 2 ? 'بصوت العميل' : 'CUSTOMER VOICE'}</span>
        <span className="voice-dot" />
      </div>
      <p dir="auto">{text}</p>
      <div className="mini-signal">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <small>{index === 0 ? 'Mixed' : 'Positive'}</small>
      </div>
    </article>
  );
}
function InsightCard({ c, action = false }) {
  return (
    <article className={'motion-card insight-card ' + (action ? 'action-card' : 'pattern-card')}>
      <div className="motion-card-label">
        <span className="insight-symbol">
          <MotionIcon name={action ? 'check' : 'insights'} size={16} />
        </span>
        <span>{action ? c.actions : c.insights}</span>
        <i />
      </div>
      <h3>{action ? c.recommend : c.pattern}</h3>
      <p>{action ? c.recommendBody : c.patternBody}</p>
      {action ? (
        <div className="action-progress">
          <span />
          <small>{c.evidence}</small>
        </div>
      ) : (
        <svg className="insight-trend" viewBox="0 0 190 44" aria-hidden="true">
          <defs>
            <linearGradient id="trend-wash" x2="0" y2="1">
              <stop stopColor="#1e68ef" stopOpacity=".16" />
              <stop offset="1" stopColor="#1e68ef" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 38 24 31 42 34 65 21 88 25 109 13 132 17 153 7 172 11 190 3v41H0Z"
            fill="url(#trend-wash)"
          />
          <path
            d="M0 38 24 31 42 34 65 21 88 25 109 13 132 17 153 7 172 11 190 3"
            fill="none"
            stroke="#1e68ef"
            strokeWidth="1.8"
          />
          <circle cx="190" cy="3" r="3" fill="#1e68ef" />
        </svg>
      )}
    </article>
  );
}
function FlowLines() {
  return (
    <svg className="motion-connections" viewBox="0 0 600 520" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="connection">
          <stop stopColor="#b8d4ff" stopOpacity=".25" />
          <stop offset=".5" stopColor="#4789ff" stopOpacity=".75" />
          <stop offset="1" stopColor="#aed5ff" stopOpacity=".3" />
        </linearGradient>
      </defs>
      {[
        'M125 112C250 112 165 255 300 255',
        'M98 292C191 292 221 259 300 255',
        'M184 402C265 402 204 278 300 255',
        'M300 255C423 255 385 105 500 105',
        'M300 255C430 255 396 367 493 367',
      ].map((d, i) => (
        <g key={d}>
          <path d={d} stroke="url(#connection)" strokeWidth="1" />
          <path
            className={'signal-travel signal-' + i}
            d={d}
            stroke="#3a93ff"
            strokeWidth="2.5"
            strokeDasharray="2 170"
            pathLength="170"
            strokeLinecap="round"
          />
        </g>
      ))}
    </svg>
  );
}

function SignalCount() {
  const [value, setValue] = useState(3);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setValue(0);
    let count = 0;
    const timer = setInterval(() => {
      count++;
      setValue(count);
      if (count === 3) clearInterval(timer);
    }, 450);
    return () => clearInterval(timer);
  }, []);
  return String(value).padStart(2, '0');
}

function LayeredDashboard({ c }) {
  return (
    <div className="layer-composition">
      <div className="dashboard-shadow" />
      <div className="dashboard-plane plane-back">
        <div className="plane-top">
          <i />
          <span>{c.feedback}</span>
          <small>NUVIA</small>
        </div>
        <div className="dashboard-stat-row">
          <div>
            <small>{c.insights}</small>
            <strong>
              <SignalCount />
              <span>{c.analysis === 'تحليل ذكي' ? ' إشارات' : ' signals'}</span>
            </strong>
          </div>
          <div className="tiny-trend">
            +<MotionIcon name="insights" size={30} />
          </div>
        </div>
        <svg viewBox="0 0 330 100" className="dashboard-chart" aria-hidden="true">
          <g stroke="#dce8fc" strokeWidth=".6">
            <path d="M0 20h330M0 50h330M0 80h330" />
          </g>
          <path
            className="chart-draw"
            d="M4 81C30 81 31 51 56 59S80 84 105 51 126 62 155 39 182 51 205 26 240 46 265 15 300 27 326 5"
            stroke="#1e68ef"
            strokeWidth="3"
            fill="none"
          />
        </svg>
        <div className="plane-micro-bars">
          {[52, 78, 62, 91, 70, 85, 100, 82, 110, 104, 124, 116].map((h, i) => (
            <i key={i} style={{ height: h / 2 + 'px', '--bar-delay': i * 70 + 'ms' }} />
          ))}
        </div>
      </div>
      <div className="dashboard-plane plane-mid">
        <div className="plane-top">
          <span className="insight-symbol">
            <MotionIcon name="spark" />
          </span>
          <span>{c.pattern}</span>
        </div>
        <p>{c.patternBody}</p>
        <div className="aspect-lines">
          {[c.feedback, c.analysis, c.insights].map((label, i) => (
            <div key={label}>
              <span>{label}</span>
              <i>
                <b style={{ width: [78, 92, 65][i] + '%' }} />
              </i>
            </div>
          ))}
        </div>
      </div>
      <div className="dashboard-plane plane-front">
        <div className="plane-top">
          <span className="insight-symbol">
            <MotionIcon name="check" />
          </span>
          <span>{c.actions}</span>
          <span className="plane-ready">{c.analysis === 'تحليل ذكي' ? 'جاهز' : 'Ready'}</span>
        </div>
        <h3>{c.recommend}</h3>
        <p>{c.recommendBody}</p>
        <span className="evidence-chip">
          {c.evidence}
          <MotionIcon name="arrow" size={13} />
        </span>
      </div>
      <div className="layer-mini-core">
        <Core compact />
      </div>
    </div>
  );
}

export default function IntelligenceMotion({ language, variant }) {
  const c = copy[language] || copy.en,
    ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const move = (e) => {
      if (media.matches) return;
      const rect = node.getBoundingClientRect(),
        x = (e.clientX - rect.left) / rect.width - 0.5,
        y = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        node.style.setProperty('--pointer-x', x.toFixed(3));
        node.style.setProperty('--pointer-y', y.toFixed(3));
      });
    };
    const reset = () => {
      node.style.setProperty('--pointer-x', '0');
      node.style.setProperty('--pointer-y', '0');
    };
    node.addEventListener('pointermove', move);
    node.addEventListener('pointerleave', reset);
    const observer = new IntersectionObserver(
      ([entry]) => node.classList.toggle('offscreen', !entry.isIntersecting),
      { rootMargin: '80px' },
    );
    observer.observe(node);
    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener('pointermove', move);
      node.removeEventListener('pointerleave', reset);
      observer.disconnect();
    };
  }, []);
  return (
    <div ref={ref} className={'intelligence-scene scene-' + variant} aria-label={c[variant]}>
      <div className="scene-grid" />
      <div className="scene-aura" />
      <div className="motion-composition">
        {variant === 'layers' ? (
          <LayeredDashboard c={c} />
        ) : variant === 'decisions' ? (
          <ReferenceScene c={c} language={language} />
        ) : (
          <>
            <div className="core-caption">
              <span />
              <small>{c.analysis}</small>
              <span />
            </div>
            <FlowLines />
            <Core />
            <FeedbackCard index={0} text={c.quality} />
            <FeedbackCard index={1} text={c.service} />
            <FeedbackCard index={2} text={c.arabic} />
            <InsightCard c={c} />
            <InsightCard c={c} action />
            <div className="process-label">
              <span className="process-pulse" />
              <span className="process-idle">{c.processing}</span>
              <span className="process-complete">{c.ready}</span>
            </div>
            <div className="floating-chip chip-language">
              AR <span>↔</span> EN
            </div>
            <div className="floating-chip chip-pattern">
              <MotionIcon name="spark" size={12} />
              {c.insights}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function DecisionJourney({ language }) {
  const c = copy[language] || copy.en,
    ref = useRef(null),
    [active, setActive] = useState(0);
  useEffect(() => {
    const node = ref.current;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect(),
        progress = Math.max(
          0,
          Math.min(1, (innerHeight * 0.78 - rect.top) / (innerHeight * 0.7 + rect.height * 0.3)),
        );
      node.style.setProperty('--journey-progress', progress);
      setActive(Math.min(4, Math.floor(progress * 5)));
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener('scroll', scroll, { passive: true });
    addEventListener('resize', scroll);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('scroll', scroll);
      removeEventListener('resize', scroll);
    };
  }, []);
  const labels = [c.feedback, c.analysis, c.insights, c.actions, c.decisionsLabel];
  return (
    <div className="decision-journey" ref={ref}>
      <div className="journey-heading">
        <span className="journey-label">
          <MotionIcon name="spark" size={14} />
          NUVIA INTELLIGENCE
        </span>
        <p>{c.signal}</p>
      </div>
      <div className="journey-rail">
        <div className="journey-line" />
        {labels.map((label, i) => (
          <div
            key={label}
            className={
              'journey-stage' + (i <= active ? ' reached' : '') + (i === active ? ' current' : '')
            }
          >
            <span className="journey-node">
              <MotionIcon name={['feedback', 'spark', 'insights', 'check', 'check'][i]} size={23} />
            </span>
            <small>0{i + 1}</small>
            <strong>{label}</strong>
          </div>
        ))}
      </div>
      <div className="journey-caption" aria-live="off">
        <span />
        <p>{labels[active]}</p>
        <span />
      </div>
    </div>
  );
}

export function MotionPreviewBar({ variant, language }) {
  const c = copy[language] || copy.en;
  return (
    <aside className="motion-preview-bar" aria-label={c.preview}>
      <span>{c.preview}</span>
      {variants.map((name, index) => (
        <a
          key={name}
          href={
            [
              'NUVIA-AI-Core.html',
              'NUVIA-Feedback-Decisions.html',
              'NUVIA-Floating-Dashboard.html',
            ][index] + '#/landing'
          }
          aria-current={name === variant ? 'page' : undefined}
        >
          {String(index + 1).padStart(2, '0')}
          <span>{name === 'core' ? c.core : name === 'decisions' ? c.decisions : c.layers}</span>
        </a>
      ))}
    </aside>
  );
}
