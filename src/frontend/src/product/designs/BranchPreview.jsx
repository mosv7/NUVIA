import React, { useState } from 'react';
import { useProductView } from '../ProductContext.jsx';
import './branch-preview.css';
export default function BranchPreview() {
  const { language } = useProductView(),
    ar = language === 'ar';
  const [single, setSingle] = useState(false),
    [expanded, setExpanded] = useState(false),
    [detail, setDetail] = useState(null);
  const t = (en, arabic) => (ar ? arabic : en);
  const branches = [
    [
      'Cairo',
      'القاهرة',
      'Evening wait times',
      'الانتظار مساءً',
      'High priority',
      'أولوية عالية',
      62,
      '104 mentions',
      '١٠٤ إشارات',
    ],
    [
      'Alex',
      'الإسكندرية',
      'Order accuracy',
      'دقة الطلبات',
      'Medium',
      'متوسطة',
      74,
      '38 mentions',
      '٣٨ إشارة',
    ],
    [
      'El Zamalek',
      'الزمالك',
      'Combo pricing',
      'أسعار الوجبات',
      'Medium',
      'متوسطة',
      82,
      '21 mentions',
      '٢١ إشارة',
    ],
    [
      'New Cairo',
      'القاهرة الجديدة',
      'Service speed',
      'سرعة الخدمة',
      'Medium',
      'متوسطة',
      71,
      '18 mentions',
      '١٨ إشارة',
    ],
  ];
  const issues = [
    [
      'Evening wait times',
      'الانتظار مساءً',
      'High priority',
      'أولوية عالية',
      '104 mentions · Complaints rose 2×',
      '١٠٤ إشارات · تضاعفت الشكاوى',
    ],
    [
      'Order accuracy',
      'دقة الطلبات',
      'Medium',
      'متوسطة',
      '28 mentions · Review order handoff',
      '٢٨ إشارة · راجع تسليم الطلبات',
    ],
  ];
  return (
    <section className="f224 product-card branch-preview">
      <div className="branch-preview-toggle" aria-label={t('Preview scenario', 'حالة المعاينة')}>
        <span>{t('Preview', 'معاينة')}</span>
        <button
          aria-pressed={!single}
          onClick={() => {
            setSingle(false);
            setDetail(null);
          }}
        >
          {t('Multiple branches', 'عدة فروع')}
        </button>
        <button
          aria-pressed={single}
          onClick={() => {
            setSingle(true);
            setDetail(null);
          }}
        >
          {t('One branch', 'فرع واحد')}
        </button>
      </div>
      <div>
        <p className="f204">
          {single
            ? t('Needs attention', 'محتاج اهتمام')
            : t('Branches needing attention', 'فروع محتاجة اهتمام')}
        </p>
        <p className="f205">
          {single
            ? t('Cairo · Issues to follow up', 'القاهرة · مشاكل محتاجة متابعة')
            : t('Priority issues across your branches', 'أهم المشاكل في فروعك')}
        </p>
      </div>
      <div className="branch-preview-rows">
        {single
          ? issues.map((r, i) => (
              <article key={r[0]}>
                <div className="branch-preview-line">
                  <strong>{ar ? r[1] : r[0]}</strong>
                  <span className={i === 0 ? 'f217' : 'f161'}>{ar ? r[3] : r[2]}</span>
                </div>
                <p className="f205">{ar ? r[5] : r[4]}</p>
                <div className="branch-preview-line">
                  <small>{t('Owner: Unassigned', 'المسؤول: غير معيّن')}</small>
                  <button className="f223" onClick={() => setDetail(ar ? r[1] : r[0])}>
                    {t('Follow up →', 'متابعة ←')}
                  </button>
                </div>
              </article>
            ))
          : branches.slice(0, expanded ? 4 : 3).map((r, i) => (
              <article key={r[0]}>
                <div className="branch-preview-line">
                  <strong>{ar ? r[1] : r[0]}</strong>
                  <span className={i === 0 ? 'f217' : 'f161'}>{ar ? r[5] : r[4]}</span>
                </div>
                <div className="branch-preview-line">
                  <p className="f205">{ar ? r[3] : r[2]}</p>
                  <strong>{r[6]}%</strong>
                </div>
                <div className="branch-preview-line">
                  <small>{t('Owner: Unassigned', 'المسؤول: غير معيّن')}</small>
                  <button className="f223" onClick={() => setDetail(ar ? r[1] : r[0])}>
                    {t('Follow up →', 'متابعة ←')}
                  </button>
                </div>
              </article>
            ))}
      </div>
      <div className="branch-preview-footer">
        <small>{t('Illustrative preview data', 'بيانات توضيحية للمعاينة')}</small>
        {!single && (
          <button className="f223" onClick={() => setExpanded(!expanded)}>
            {expanded
              ? t('Show less ↑', 'عرض أقل ↑')
              : t('View all 4 branches →', 'عرض كل الفروع ←')}
          </button>
        )}
      </div>
      {detail && (
        <div className="branch-preview-detail" role="status">
          <strong>{detail}</strong>
          <p>
            {t(
              'Assign an owner and review customer feedback. Preview only.',
              'عيّن مسؤولًا وراجع آراء العملاء. للمعاينة فقط.',
            )}
          </p>
          <button className="f223" onClick={() => setDetail(null)}>
            {t('Close', 'إغلاق')}
          </button>
        </div>
      )}
    </section>
  );
}
