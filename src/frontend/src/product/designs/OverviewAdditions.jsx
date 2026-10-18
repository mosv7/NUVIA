import ScopedInsights from '../ScopedInsights.jsx';
import React, { useState } from 'react';
import { useProductView } from '../ProductContext.jsx';
import OriginalAssistant from './OriginalAssistant.jsx';
import './overview-additions.css';

const imgAssistantIcon = '/assets/figma-overview/imgAssistantIcon.svg';
const imgClock3 = '/assets/figma-overview/imgClock3.svg';
const imgTag = '/assets/figma-overview/imgTag.svg';
const imgHeartHandshake = '/assets/figma-overview/imgHeartHandshake.svg';
const imgListFilter = '/assets/figma-overview/imgListFilter.svg';
const imgSparkles1 = '/assets/figma-overview/imgSparkles1.svg';
const imgPlus1 = '/assets/figma-overview/imgPlus1.svg';

function DashboardArrowText({ text }) {
  return (
    <span>
      {text.split(/([→←↑↓↗↖])/).map((part, index) => {
        const rotations = { '→': 0, '←': 180, '↑': -90, '↓': 90, '↗': -45, '↖': -135 };
        return part in rotations ? (
          <svg
            key={index}
            className="dashboard-link-arrow"
            aria-hidden="true"
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            style={{ transform: 'rotate(' + rotations[part] + 'deg)' }}
          >
            <path
              d="M3.5 8h8M8 4.5 11.5 8 8 11.5"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          part
        );
      })}
    </span>
  );
}
export function NewDailyInsight() {
  const ui = useProductView();
  return (
    <div
      className="overview-new overview-addition-0"
      onClick={(e) => {
        const label =
          e.target.closest('[data-name="Action"]')?.textContent ||
          e.target.closest('p')?.textContent ||
          '';
        if (/View.*feedback|View.*Responses/i.test(label)) location.hash = '/feedbacks';
        else if (/View evidence/i.test(label)) ui.action('View evidence ↗');
        else if (/Create Survey/i.test(label)) location.hash = '/surveys';
        else if (/Action board|Generate AI Report|↗/.test(label)) ui.action(label);
      }}
    >
      <div className="v140" data-node-id="325:6113" data-name="AI daily insight">
        <ScopedInsights kind="daily">
          <div className="v59" data-node-id="325:6114" data-name="Section heading">
            <div className="v141" data-node-id="325:6115" data-name="Title">
              <div className="v17" data-node-id="325:6116" data-name="Assistant icon">
                <img alt="" className="v5" src={imgAssistantIcon} />
              </div>
              <p className="v142" data-node-id="325:6117">
                {ui.tr('AI Daily Insight')}
              </p>
            </div>
            <div className="v143" data-node-id="325:6118" data-name="Evidence badge">
              <p
                className="v22"
                data-node-id="325:6119"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {ui.tr('EVIDENCE-LED')}
              </p>
            </div>
          </div>
          <div className="v144" data-node-id="325:6120" data-name="Finding">
            <p className="v145" data-node-id="325:6121">
              {ui.tr('Cairo’s wait times need a closer look.')}
            </p>
            <p
              className="v146"
              data-node-id="325:6122"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {ui.tr(
                '104 September reviews mention delays — 2× August’s 52. Review peak-hour coverage as a next step.',
              )}
            </p>
          </div>
          <div className="v147" data-node-id="325:6123" data-name="Quoted evidence">
            <p
              className="v148"
              data-node-id="325:6124"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {ui.tr('“The coffee is good, but we waited 25 minutes for the order.”')}
            </p>
            <p
              className="v149"
              data-node-id="325:6125"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {ui.tr('[1] Google review · Cairo · Sep 18')}
            </p>
          </div>
          <div className="v150" data-node-id="325:6126" data-name="Evidence footer">
            <p
              className="v12"
              data-node-id="325:6127"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {ui.tr('Daily summary · September branch feedback')}
            </p>
            <p
              className="v151"
              data-node-id="325:6128"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              <DashboardArrowText text={ui.tr('View 104 feedback ↗')} />
            </p>
          </div>
        </ScopedInsights>
      </div>
    </div>
  );
}
export function NewAspectInsights() {
  const ui = useProductView();
  return (
    <div
      className="overview-new overview-addition-1"
      onClick={(e) => {
        const label =
          e.target.closest('[data-name="Action"]')?.textContent ||
          e.target.closest('p')?.textContent ||
          '';
        if (/View.*feedback|View.*Responses/i.test(label)) location.hash = '/feedbacks';
        else if (/View evidence/i.test(label)) ui.action('View evidence ↗');
        else if (/Create Survey/i.test(label)) location.hash = '/surveys';
        else if (/Action board|Generate AI Report|↗/.test(label)) ui.action(label);
      }}
    >
      <div className="v169" data-node-id="325:6161" data-name="Evidence and actions">
        <div className="v71" data-node-id="325:6162" data-name="Aspect intelligence">
          <div className="v170" data-node-id="325:6163" data-name="Aspect scores">
            <ScopedInsights kind="aspects">
              <div className="v171" data-node-id="325:6164" data-name="Section heading">
                <p className="v172" data-node-id="325:6165">
                  {ui.tr('Aspect scores')}
                </p>
                <p
                  className="v173"
                  data-node-id="325:6166"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {ui.tr('Positive share of detected aspect mentions · Survey responses')}
                </p>
              </div>
              <div className="v174" data-node-id="325:6167" data-name="Detected aspects">
                <div className="v175" data-node-id="325:6168" data-name="Aspect">
                  <p
                    className="v176"
                    data-node-id="325:6169"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {ui.tr('Food quality')}
                  </p>
                  <div className="v177" data-node-id="325:6170" data-name="Score track">
                    <div className="v178" data-node-id="325:6171" data-name="Positive share" />
                  </div>
                  <p
                    className="v179"
                    data-node-id="325:6172"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {ui.tr('86%')}
                  </p>
                  <p
                    className="v180"
                    data-node-id="325:6173"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {ui.tr('640 mentions')}
                  </p>
                </div>
                <div className="v175" data-node-id="325:6174" data-name="Aspect">
                  <p
                    className="v176"
                    data-node-id="325:6175"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {ui.tr('Staff friendliness')}
                  </p>
                  <div className="v177" data-node-id="325:6176" data-name="Score track">
                    <div className="v181" data-node-id="325:6177" data-name="Positive share" />
                  </div>
                  <p
                    className="v179"
                    data-node-id="325:6178"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {ui.tr('81%')}
                  </p>
                  <p
                    className="v180"
                    data-node-id="325:6179"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {ui.tr('410 mentions')}
                  </p>
                </div>
                <div className="v175" data-node-id="325:6180" data-name="Aspect">
                  <p
                    className="v176"
                    data-node-id="325:6181"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {ui.tr('Value for money')}
                  </p>
                  <div className="v177" data-node-id="325:6182" data-name="Score track">
                    <div className="v182" data-node-id="325:6183" data-name="Positive share" />
                  </div>
                  <p
                    className="v179"
                    data-node-id="325:6184"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {ui.tr('65%')}
                  </p>
                  <p
                    className="v180"
                    data-node-id="325:6185"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {ui.tr('325 mentions')}
                  </p>
                </div>
                <div className="v175" data-node-id="325:6186" data-name="Aspect">
                  <p
                    className="v176"
                    data-node-id="325:6187"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {ui.tr('Order accuracy')}
                  </p>
                  <div className="v177" data-node-id="325:6188" data-name="Score track">
                    <div className="v183" data-node-id="325:6189" data-name="Positive share" />
                  </div>
                  <p
                    className="v179"
                    data-node-id="325:6190"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {ui.tr('76%')}
                  </p>
                  <p
                    className="v180"
                    data-node-id="325:6191"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {ui.tr('280 mentions')}
                  </p>
                </div>
                <div className="v175" data-node-id="325:6192" data-name="Aspect">
                  <p
                    className="v176"
                    data-node-id="325:6193"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {ui.tr('Service speed')}
                  </p>
                  <div className="v177" data-node-id="325:6194" data-name="Score track">
                    <div className="v184" data-node-id="325:6195" data-name="Positive share" />
                  </div>
                  <p
                    className="v179"
                    data-node-id="325:6196"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {ui.tr('42%')}
                  </p>
                  <p
                    className="v180"
                    data-node-id="325:6197"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {ui.tr('360 mentions')}
                  </p>
                </div>
              </div>
            </ScopedInsights>
          </div>
          <div className="v185" data-node-id="325:6198" data-name="Key insights">
            <ScopedInsights kind="insights">
              <p className="v153" data-node-id="325:6199">
                {ui.tr('Key insights')}
              </p>
              <div className="v157" data-node-id="325:6200" data-name="Supported insight">
                <div className="v186" data-node-id="325:6201" data-name="Insight marker" />
                <div className="v187" data-node-id="325:6202" data-name="Finding">
                  <p
                    className="v188"
                    data-node-id="325:6203"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {ui.tr('Strongest aspect: Food quality')}
                  </p>
                  <p
                    className="v189"
                    data-node-id="325:6204"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {ui.tr('86% positive · 640 mentions')}
                  </p>
                </div>
                <p
                  className="v190"
                  data-node-id="325:6205"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  <DashboardArrowText text={ui.tr('↗')} />
                </p>
              </div>
              <div className="v157" data-node-id="325:6206" data-name="Supported insight">
                <div className="v191" data-node-id="325:6207" data-name="Insight marker" />
                <div className="v187" data-node-id="325:6208" data-name="Finding">
                  <p
                    className="v188"
                    data-node-id="325:6209"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {ui.tr('Lowest-rated aspect: Service speed')}
                  </p>
                  <p
                    className="v189"
                    data-node-id="325:6210"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {ui.tr('42% positive · 360 mentions')}
                  </p>
                </div>
                <p
                  className="v190"
                  data-node-id="325:6211"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  <DashboardArrowText text={ui.tr('↗')} />
                </p>
              </div>
              <div className="v157" data-node-id="325:6212" data-name="Supported insight">
                <div className="v192" data-node-id="325:6213" data-name="Insight marker" />
                <div className="v187" data-node-id="325:6214" data-name="Finding">
                  <p
                    className="v188"
                    data-node-id="325:6215"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {ui.tr('Welcoming service stands out at El Zamalek')}
                  </p>
                  <p
                    className="v189"
                    data-node-id="325:6216"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {ui.tr('September reviews · 92 mention welcoming service')}
                  </p>
                </div>
                <p
                  className="v190"
                  data-node-id="325:6217"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  <DashboardArrowText text={ui.tr('↗')} />
                </p>
              </div>
            </ScopedInsights>
          </div>
        </div>
      </div>
    </div>
  );
}
export function NewRecommendations() {
  const ui = useProductView();
  return (
    <div
      className="overview-new overview-addition-2"
      onClick={(e) => {
        const label =
          e.target.closest('[data-name="Action"]')?.textContent ||
          e.target.closest('p')?.textContent ||
          '';
        if (/View.*feedback|View.*Responses/i.test(label)) location.hash = '/feedbacks';
        else if (/View evidence/i.test(label)) ui.action('View evidence ↗');
        else if (/Create Survey/i.test(label)) location.hash = '/surveys';
        else if (/Action board|Generate AI Report|↗/.test(label)) ui.action(label);
      }}
    >
      <div className="v193" data-node-id="325:6218" data-name="Prioritized actions">
        <ScopedInsights kind="recommendations">
          <div className="v194" data-node-id="325:6219" data-name="Section heading">
            <div className="v195" data-node-id="325:6220" data-name="Heading copy">
              <p className="v196" data-node-id="325:6221">
                {ui.tr('What to do next')}
              </p>
              <p
                className="v197"
                data-node-id="325:6222"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {ui.tr('3 recommendations, ranked by impact and feedback volume')}
              </p>
            </div>
            <p
              className="v198"
              data-node-id="325:6223"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              <DashboardArrowText text={ui.tr('Action board →')} />
            </p>
          </div>
          <div className="v199" data-node-id="325:6224" data-name="Action item">
            <div className="v200" data-node-id="325:6225" data-name="Recommended action">
              <div className="v201" data-node-id="325:6226" data-name="Action symbol">
                <div className="v36" data-node-id="325:6227" data-name="clock-3">
                  <img alt="" className="v5" src={imgClock3} />
                </div>
              </div>
              <div className="v83" data-node-id="325:6229" data-name="Action evidence">
                <div className="v59" data-node-id="325:6230" data-name="Action title">
                  <p
                    className="v161"
                    data-node-id="325:6231"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {ui.tr('Shorten the evening queue at Cairo')}
                  </p>
                  <div className="v202" data-node-id="325:6232" data-name="Status">
                    <p
                      className="v203"
                      data-node-id="325:6233"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {ui.tr('High priority')}
                    </p>
                  </div>
                </div>
                <p
                  className="v204"
                  data-node-id="325:6234"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {ui.tr('Add peak-hour coverage. Wait-time complaints rose 2× vs. August.')}
                </p>
                <p
                  className="v205"
                  data-node-id="325:6235"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {ui.tr('“Great coffee, but we waited 25 minutes for our order.”')}
                </p>
                <div className="v206" data-node-id="325:6236" data-name="Evidence link">
                  <p
                    className="v12"
                    data-node-id="325:6237"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {ui.tr('104 reviews · Cairo · Operations')}
                  </p>
                  <p
                    className="v207"
                    data-node-id="325:6238"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    <DashboardArrowText text={ui.tr('View evidence ↗')} />
                  </p>
                </div>
              </div>
            </div>
            <div className="v208" data-node-id="325:6239" data-name="Action divider" />
          </div>
          <div className="v199" data-node-id="325:6240" data-name="Action item">
            <div className="v200" data-node-id="325:6241" data-name="Recommended action">
              <div className="v201" data-node-id="325:6242" data-name="Action symbol">
                <div className="v36" data-node-id="325:6243" data-name="tag">
                  <img alt="" className="v5" src={imgTag} />
                </div>
              </div>
              <div className="v83" data-node-id="325:6245" data-name="Action evidence">
                <div className="v59" data-node-id="325:6246" data-name="Action title">
                  <p
                    className="v161"
                    data-node-id="325:6247"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {ui.tr('Make combo pricing clearer')}
                  </p>
                  <div className="v209" data-node-id="325:6248" data-name="Status">
                    <p
                      className="v210"
                      data-node-id="325:6249"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {ui.tr('Medium')}
                    </p>
                  </div>
                </div>
                <p
                  className="v204"
                  data-node-id="325:6250"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {ui.tr('Show the full price upfront on menus and ordering screens.')}
                </p>
                <p
                  className="v205"
                  data-node-id="325:6251"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {ui.tr('“The combo cost more than the price on the menu.”')}
                </p>
                <div className="v206" data-node-id="325:6252" data-name="Evidence link">
                  <p
                    className="v12"
                    data-node-id="325:6253"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {ui.tr('48 reviews · All branches · Commercial')}
                  </p>
                  <p
                    className="v207"
                    data-node-id="325:6254"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    <DashboardArrowText text={ui.tr('View evidence ↗')} />
                  </p>
                </div>
              </div>
            </div>
            <div className="v208" data-node-id="325:6255" data-name="Action divider" />
          </div>
          <div className="v211" data-node-id="325:6256" data-name="Action item">
            <div className="v200" data-node-id="325:6257" data-name="Recommended action">
              <div className="v201" data-node-id="325:6258" data-name="Action symbol">
                <div className="v36" data-node-id="325:6259" data-name="heart-handshake">
                  <img alt="" className="v5" src={imgHeartHandshake} />
                </div>
              </div>
              <div className="v83" data-node-id="325:6261" data-name="Action evidence">
                <div className="v59" data-node-id="325:6262" data-name="Action title">
                  <p
                    className="v161"
                    data-node-id="325:6263"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {ui.tr('Share El Zamalek’s service playbook')}
                  </p>
                  <div className="v212" data-node-id="325:6264" data-name="Status">
                    <p
                      className="v213"
                      data-node-id="325:6265"
                      style={{ fontVariationSettings: '"opsz" 14' }}
                    >
                      {ui.tr('Opportunity')}
                    </p>
                  </div>
                </div>
                <p
                  className="v204"
                  data-node-id="325:6266"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {ui.tr('Replicate the welcome customers love across your branches.')}
                </p>
                <p
                  className="v205"
                  data-node-id="325:6267"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {ui.tr('“The team remembered my order and made me feel welcome.”')}
                </p>
                <div className="v206" data-node-id="325:6268" data-name="Evidence link">
                  <p
                    className="v12"
                    data-node-id="325:6269"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    {ui.tr('92 reviews · Elzamalek · Branch leads')}
                  </p>
                  <p
                    className="v207"
                    data-node-id="325:6270"
                    style={{ fontVariationSettings: '"opsz" 14' }}
                  >
                    <DashboardArrowText text={ui.tr('View evidence ↗')} />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScopedInsights>
      </div>
    </div>
  );
}
export function NewQuickActions() {
  const ui = useProductView();
  return (
    <div
      className="overview-new overview-addition-3"
      onClick={(e) => {
        const label =
          e.target.closest('[data-name="Action"]')?.textContent ||
          e.target.closest('p')?.textContent ||
          '';
        if (/View.*feedback|View.*Responses/i.test(label)) location.hash = '/feedbacks';
        else if (/View evidence/i.test(label)) ui.action('View evidence ↗');
        else if (/Create Survey/i.test(label)) location.hash = '/surveys';
        else if (/Action board|Generate AI Report|↗/.test(label)) ui.action(label);
      }}
    >
      <div className="v214" data-node-id="325:6271" data-name="Quick actions">
        <div className="v215" data-node-id="325:6272" data-name="Action heading">
          <p
            className="v216"
            data-node-id="325:6273"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            {ui.tr('Quick Actions')}
          </p>
          <p
            className="v173"
            data-node-id="325:6274"
            style={{ fontVariationSettings: '"opsz" 14' }}
          >
            {ui.tr('Turn customer feedback into your next move.')}
          </p>
        </div>
        <div className="v217" data-node-id="325:6275" data-name="Actions">
          <div className="v218" data-node-id="325:6276" data-name="Action">
            <div className="v13" data-node-id="325:6277" data-name="list-filter">
              <img alt="" className="v5" src={imgListFilter} />
            </div>
            <p
              className="v136"
              data-node-id="325:6279"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {ui.tr('View All Responses')}
            </p>
          </div>
          <div className="v218" data-node-id="325:6280" data-name="Action">
            <div className="v13" data-node-id="325:6281" data-name="sparkles">
              <img alt="" className="v5" src={imgSparkles1} />
            </div>
            <p
              className="v136"
              data-node-id="325:6283"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {ui.tr('Generate AI Report')}
            </p>
          </div>
          <div className="v219" data-node-id="325:6284" data-name="Action">
            <div className="v13" data-node-id="325:6285" data-name="plus">
              <img alt="" className="v5" src={imgPlus1} />
            </div>
            <p
              className="v220"
              data-node-id="325:6287"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {ui.tr('Create Survey')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export function AssistantLauncher() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="old-assistant-launcher"
        aria-label="Open NUVIA Assistant"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <img src="/assets/dashboard/overview/sparkles1.svg" alt="" />
      </button>
      {open && (
        <div className="old-assistant-panel" role="dialog" aria-label="Ask NUVIA">
          <button className="old-assistant-close" onClick={() => setOpen(false)}>
            Close ×
          </button>
          <OriginalAssistant />
        </div>
      )}
    </>
  );
}

export function NewBranchAttention() {
  const ui = useProductView();
  return (
    <div
      className="overview-new overview-branch-attention"
      onClick={(e) => {
        if (e.target.closest('[data-name="Comparison footer"]')) ui.action('Compare branches →');
      }}
    >
      <div className="v152" data-node-id="325:6129" data-name="Branches needing attention">
        <ScopedInsights kind="branches">
          <div className="v26" data-node-id="325:6130" data-name="Section heading">
            <div className="v59" data-node-id="325:6131" data-name="Title">
              <p className="v153" data-node-id="325:6132">
                {ui.tr('Branches needing attention')}
              </p>
              <div className="v154" data-node-id="325:6133" data-name="Attention count">
                <p
                  className="v155"
                  data-node-id="325:6134"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {ui.tr('1')}
                </p>
              </div>
            </div>
            <p
              className="v31"
              data-node-id="325:6135"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {ui.tr('September reviews · Positive share')}
            </p>
          </div>
          <div className="v156" data-node-id="325:6136" data-name="Branch comparison">
            <div className="v157" data-node-id="325:6137" data-name="Branch">
              <div className="v158" data-node-id="325:6138" data-name="Branch details">
                <p
                  className="v159"
                  data-node-id="325:6139"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {ui.tr('Cairo')}
                </p>
                <p
                  className="v160"
                  data-node-id="325:6140"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {ui.tr('500 reviews')}
                </p>
              </div>
              <p
                className="v161"
                data-node-id="325:6141"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {ui.tr('62%')}
              </p>
              <div className="v162" data-node-id="325:6142" data-name="Branch status">
                <p
                  className="v163"
                  data-node-id="325:6143"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {ui.tr('Needs attention')}
                </p>
              </div>
            </div>
            <div className="v157" data-node-id="325:6144" data-name="Branch">
              <div className="v158" data-node-id="325:6145" data-name="Branch details">
                <p
                  className="v159"
                  data-node-id="325:6146"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {ui.tr('El Zamalek')}
                </p>
                <p
                  className="v160"
                  data-node-id="325:6147"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {ui.tr('450 reviews')}
                </p>
              </div>
              <p
                className="v161"
                data-node-id="325:6148"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {ui.tr('82%')}
              </p>
              <div className="v164" data-node-id="325:6149" data-name="Branch status">
                <p
                  className="v165"
                  data-node-id="325:6150"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {ui.tr('Top performer')}
                </p>
              </div>
            </div>
            <div className="v157" data-node-id="325:6151" data-name="Branch">
              <div className="v158" data-node-id="325:6152" data-name="Branch details">
                <p
                  className="v159"
                  data-node-id="325:6153"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {ui.tr('Alex')}
                </p>
                <p
                  className="v160"
                  data-node-id="325:6154"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {ui.tr('300 reviews')}
                </p>
              </div>
              <p
                className="v161"
                data-node-id="325:6155"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {ui.tr('74%')}
              </p>
              <div className="v166" data-node-id="325:6156" data-name="Branch status">
                <p
                  className="v167"
                  data-node-id="325:6157"
                  style={{ fontVariationSettings: '"opsz" 14' }}
                >
                  {ui.tr('On track')}
                </p>
              </div>
            </div>
          </div>
          <div className="v168" data-node-id="325:6158" data-name="Comparison footer">
            <p
              className="v12"
              data-node-id="325:6159"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {ui.tr('3 branches · 1,250 reviews')}
            </p>
            <p
              className="v151"
              data-node-id="325:6160"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              <DashboardArrowText text={ui.tr('Compare branches →')} />
            </p>
          </div>
        </ScopedInsights>
      </div>
    </div>
  );
}

export function MovedAspectScore() {
  const ui = useProductView();
  return (
    <div className="overview-new overview-moved-aspects">
      <div className="v170" data-node-id="325:6163" data-name="Aspect scores">
        <ScopedInsights kind="aspects">
          <div className="v171" data-node-id="325:6164" data-name="Section heading">
            <p className="v172" data-node-id="325:6165">
              {ui.tr('Aspect scores')}
            </p>
            <p
              className="v173"
              data-node-id="325:6166"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {ui.tr('Positive share of detected aspect mentions · Survey responses')}
            </p>
          </div>
          <div className="v174" data-node-id="325:6167" data-name="Detected aspects">
            <div className="v175" data-node-id="325:6168" data-name="Aspect">
              <p
                className="v176"
                data-node-id="325:6169"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {ui.tr('Food quality')}
              </p>
              <div className="v177" data-node-id="325:6170" data-name="Score track">
                <div className="v178" data-node-id="325:6171" data-name="Positive share" />
              </div>
              <p
                className="v179"
                data-node-id="325:6172"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {ui.tr('86%')}
              </p>
              <p
                className="v180"
                data-node-id="325:6173"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {ui.tr('640 mentions')}
              </p>
            </div>
            <div className="v175" data-node-id="325:6174" data-name="Aspect">
              <p
                className="v176"
                data-node-id="325:6175"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {ui.tr('Staff friendliness')}
              </p>
              <div className="v177" data-node-id="325:6176" data-name="Score track">
                <div className="v181" data-node-id="325:6177" data-name="Positive share" />
              </div>
              <p
                className="v179"
                data-node-id="325:6178"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {ui.tr('81%')}
              </p>
              <p
                className="v180"
                data-node-id="325:6179"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {ui.tr('410 mentions')}
              </p>
            </div>
            <div className="v175" data-node-id="325:6180" data-name="Aspect">
              <p
                className="v176"
                data-node-id="325:6181"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {ui.tr('Value for money')}
              </p>
              <div className="v177" data-node-id="325:6182" data-name="Score track">
                <div className="v182" data-node-id="325:6183" data-name="Positive share" />
              </div>
              <p
                className="v179"
                data-node-id="325:6184"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {ui.tr('65%')}
              </p>
              <p
                className="v180"
                data-node-id="325:6185"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {ui.tr('325 mentions')}
              </p>
            </div>
            <div className="v175" data-node-id="325:6186" data-name="Aspect">
              <p
                className="v176"
                data-node-id="325:6187"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {ui.tr('Order accuracy')}
              </p>
              <div className="v177" data-node-id="325:6188" data-name="Score track">
                <div className="v183" data-node-id="325:6189" data-name="Positive share" />
              </div>
              <p
                className="v179"
                data-node-id="325:6190"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {ui.tr('76%')}
              </p>
              <p
                className="v180"
                data-node-id="325:6191"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {ui.tr('280 mentions')}
              </p>
            </div>
            <div className="v175" data-node-id="325:6192" data-name="Aspect">
              <p
                className="v176"
                data-node-id="325:6193"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {ui.tr('Service speed')}
              </p>
              <div className="v177" data-node-id="325:6194" data-name="Score track">
                <div className="v184" data-node-id="325:6195" data-name="Positive share" />
              </div>
              <p
                className="v179"
                data-node-id="325:6196"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {ui.tr('42%')}
              </p>
              <p
                className="v180"
                data-node-id="325:6197"
                style={{ fontVariationSettings: '"opsz" 14' }}
              >
                {ui.tr('360 mentions')}
              </p>
            </div>
          </div>
        </ScopedInsights>
      </div>
    </div>
  );
}
