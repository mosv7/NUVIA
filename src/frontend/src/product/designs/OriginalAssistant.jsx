import React, { useState } from 'react';
import './restored-assistant.css';
const imgSparkles1 = '/assets/dashboard/overview/sparkles1.svg',
  imgArrowUp = '/assets/dashboard/overview/arrow-up.svg';
export default function OriginalAssistant() {
  const [query, setQuery] = useState(''),
    [notice, setNotice] = useState('');
  const tr = (x) => x;
  const ui = {
    query,
    setQuery,
    action: () => setNotice('This is a design preview. AI replies are not connected yet.'),
  };
  return (
    <>
      {' '}
      <div className="restored-assistant f157" data-node-id="127:566" data-name="Ask NUVIA preview">
        <div className="f58" data-node-id="127:567" data-name="Assistant heading">
          <div className="f158" data-node-id="127:568" data-name="Assistant brand">
            <div className="f159" data-node-id="127:569" data-name="sparkles">
              <img alt="" className="f5" src={imgSparkles1} />
            </div>
            <p className="f160" data-node-id="127:571">
              {tr('Ask NUVIA')}
            </p>
          </div>
          <div className="f161" data-node-id="127:572" data-name="Status" data-tone="info">
            <p
              className="f162"
              data-node-id="127:573"
              style={{
                fontVariationSettings: '"opsz" 14',
              }}
            >
              {tr('Evidence-backed')}
            </p>
          </div>
        </div>
        <button
          className="f163"
          data-node-id="127:574"
          data-name="Sample question"
          type="button"
          onClick={() => ui.action('Why did sentiment dip at Cairo this month?')}
        >
          <p
            className="f164"
            data-node-id="127:575"
            style={{
              fontVariationSettings: '"opsz" 14',
            }}
          >
            {tr('Why did sentiment dip at Cairo this month?')}
          </p>
        </button>
        <p
          className="f165"
          data-node-id="127:576"
          style={{
            fontVariationSettings: '"opsz" 14',
          }}
        >
          {tr(
            "Longer evening waits are the main driver. 104 reviews mention delays, twice August's 52. Food quality remains a strength.",
          )}
        </p>
        <div className="f166" data-node-id="127:577" data-name="Quoted source">
          <p
            className="f167"
            dir="auto"
            data-node-id="127:578"
            style={{
              fontVariationSettings: '"wdth" 100',
            }}
          >
            {tr('القهوة ممتازة لكن انتظرنا الطلب ٢٥ دقيقة.')}
          </p>
          <p
            className="f168"
            data-node-id="127:579"
            style={{
              fontVariationSettings: '"opsz" 14',
            }}
          >
            {tr('“The coffee is good, but we waited 25 minutes for the order.”')}
          </p>
          <p
            className="f169"
            data-node-id="127:580"
            style={{
              fontVariationSettings: '"opsz" 14',
            }}
          >
            {tr('[1] Google review · Cairo · Sep 18')}
          </p>
        </div>
        <div className="f170" data-node-id="127:581" data-name="Assistant follow-up">
          <input
            className="f171"
            data-node-id="127:582"
            style={{
              fontVariationSettings: '"opsz" 14',
            }}
            aria-label={tr('Ask a question about this feedback…')}
            placeholder={tr('Ask a question about this feedback…')}
            value={ui.query}
            onChange={(event) => ui.setQuery(event.target.value)}
          />
          <div className="f17" data-node-id="127:583" data-name="arrow-up">
            <img alt="" className="f5" src={imgArrowUp} />
          </div>
        </div>
        <p
          className="f172"
          data-node-id="127:585"
          style={{
            fontVariationSettings: '"opsz" 14',
          }}
        >
          {tr('Answers in Arabic or English · 104 supporting reviews')}
        </p>
      </div>
      {notice && (
        <p className="assistant-preview-notice" role="status">
          {notice}
        </p>
      )}
    </>
  );
}
