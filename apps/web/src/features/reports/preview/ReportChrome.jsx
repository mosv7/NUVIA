import React from 'react';
import ControlIcon from '../../../components/ui/ControlIcon.jsx';
import { useProductView } from '../../../app/providers/ProductProvider.jsx';
import { getReport } from './report-library.js';
import { PreviewArrow, downloadReport } from './PreviewControls.jsx';
export function ReportNavigation({ id = 'september' }) {
  const { tr, language } = useProductView();
  return (
    <div className="pv1" data-name="Report navigation" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <button
        type="button"
        className="pv9"
        data-name="Back to reports"
        onClick={(e) => {
          e.stopPropagation();
          location.hash = '/reports';
        }}
      >
        <div className="pv6">
          <PreviewArrow direction="back" />
        </div>
        <p className="pv97">{tr('Back to Reports')}</p>
      </button>
      <button
        type="button"
        className="pv63 ui-control ui-export"
        data-name="Action"
        onClick={(e) => {
          e.stopPropagation();
          downloadReport(id, getReport(id).language === 'Arabic' ? 'ar' : language);
        }}
      >
        <div className="pv6">
          <ControlIcon name="export" />
        </div>
        <p className="pv64">{tr('Export Report')}</p>
      </button>
    </div>
  );
}
export function ReportSection({ title, children, ...props }) {
  const { tr } = useProductView();
  return (
    <section className="pv47" data-name={title} {...props}>
      <div className="pv58" data-name="Section heading">
        <p className="pv59">{tr(title)}</p>
      </div>
      {children}
    </section>
  );
}
