import HeadingBack from '../../../components/layout/HeadingBack.jsx';
import React from 'react';
import { useProductView } from '../../../app/providers/ProductProvider.jsx';
import { createEditorQuestions } from './survey-editor.js';
import { feedbackRows } from '../../feedback/feedback-data.js';
import '../../../components/ui/ControlIcon.jsx';
import { PreviewArrow } from '../../reports/preview/PreviewControls.jsx';
export function distribution(total, weights) {
  const counts = weights.map((weight) => Math.floor((total * weight) / 100));
  counts[counts.length - 1] += total - counts.reduce((sum, n) => sum + n, 0);
  return counts;
}
export default function Results() {
  const { tr, language, formatNumber } = useProductView();
  const name = sessionStorage.getItem('survey-results-name') || 'Coffee & service check-in',
    closed = name === 'Summer customer pulse',
    total = closed ? 842 : 124;
  const questions = createEditorQuestions(),
    ids = closed ? [1, 2, 3, 4, 5, 6] : [1, 3, 5, 6];
  const starCounts = distribution(total, [8, 12, 22, 30, 28]),
    average = starCounts.reduce((sum, value, index) => sum + value * (index + 1), 0) / total;
  return (
    <section className="survey-results">
      <header className="survey-results-heading">
        <div>
          <button
            data-name="Back to surveys"
            className="feedback-text-btn"
            onClick={() => (location.hash = '/survey-all')}
          >
            <PreviewArrow direction="back" />
            {tr('Back to surveys')}
          </button>
          <h1 className="workspace-heading">
            <HeadingBack fallback="/survey-all" />
            <span>{tr('Survey results')}</span>
          </h1>
          <p>{tr(name)}</p>
        </div>
      </header>
      <p className="survey-results-note">{language === 'ar' ? 'بيانات تجريبية' : 'Sample data'}</p>
      <div className="survey-results-metrics">
        {[
          ['Responses', formatNumber(total)],
          ['Average rating', formatNumber(average.toFixed(1)) + ' / 5'],
        ].map(([label, value]) => (
          <article key={label}>
            <p>{tr(label)}</p>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
      <div className="survey-results-questions">
        {ids.map((id) => {
          const item = questions[id];
          let labels, weights;
          if (item.type === 'Long text')
            return (
              <details className="survey-results-card survey-results-comments" key={id}>
                <summary>{language === 'ar' ? 'عرض التعليقات' : 'View comments'}</summary>
                {feedbackRows.slice(0, 3).map((row) => (
                  <div className="survey-result-comment" key={row.id}>
                    <blockquote dir="auto">{row.text}</blockquote>
                    <button
                      className="feedback-text-btn"
                      onClick={() => (location.hash = '/feedback-details?id=' + row.id)}
                    >
                      {tr('Open Response')}
                      <PreviewArrow />
                    </button>
                  </div>
                ))}
              </details>
            );
          if (item.type === 'NPS') {
            labels =
              language === 'ar'
                ? ['منتقدون', 'محايدون', 'مروّجون']
                : ['Detractors', 'Passives', 'Promoters'];
            weights = [41, 32, 27];
          } else if (item.type === 'Multiple choice') {
            labels = ['Coffee', 'Service', 'Ambience', 'Value'];
            weights = [42, 28, 18, 12];
          } else {
            labels = ['1', '2', '3', '4', '5'];
            weights = [8, 12, 22, 30, 28];
          }
          return (
            <article className="survey-results-card" key={id}>
              <h2>
                {id}. {item.text[language]}
              </h2>
              <div className="survey-result-chart">
                {labels.map((label, index) => (
                  <div className="survey-result-chart-row" key={label}>
                    <span>{tr(label)}</span>
                    <div className="survey-result-track">
                      <i style={{ width: weights[index] + '%' }} />
                    </div>
                    <span>{formatNumber(weights[index])}%</span>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
