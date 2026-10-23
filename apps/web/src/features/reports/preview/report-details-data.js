// Illustrative figures for the local report preview, not live analytics.
const pair = (en, ar) => ({ en, ar });
const configs = {
  september: {
    reviews: 1250,
    branches: 3,
    delay: [52, 104],
    pricing: 48,
    opportunity: 92,
    positive: [86, 81, 76, 65, 42],
    mentions: [640, 410, 280, 325, 360],
    focus: pair('All 3 branches', 'الفروع الثلاثة'),
    months: [pair('August', 'أغسطس'), pair('September', 'سبتمبر')],
    comparison: [
      [500, 62],
      [450, 82],
      [300, 74],
    ],
  },
  cairo: {
    reviews: 500,
    branches: 1,
    delay: [52, 104],
    pricing: 27,
    opportunity: 35,
    positive: [82, 75, 71, 59, 42],
    mentions: [260, 190, 132, 145, 180],
    focus: pair('Cairo', 'القاهرة'),
    months: [pair('August', 'أغسطس'), pair('September', 'سبتمبر')],
    comparison: [
      [500, 62],
      [450, 82],
      [300, 74],
    ],
  },
  service: {
    reviews: 450,
    branches: 1,
    delay: [32, 18],
    pricing: 12,
    opportunity: 68,
    positive: [91, 94, 90, 78, 83],
    mentions: [240, 220, 150, 130, 165],
    focus: pair('El Zamalek', 'الزمالك'),
    months: [pair('August', 'أغسطس'), pair('September', 'سبتمبر')],
    comparison: [
      [500, 62],
      [450, 82],
      [300, 74],
    ],
  },
  august: {
    reviews: 1120,
    branches: 3,
    delay: [38, 52],
    pricing: 36,
    opportunity: 80,
    positive: [84, 79, 75, 62, 48],
    mentions: [570, 380, 250, 300, 320],
    focus: pair('All 3 branches', 'الفروع الثلاثة'),
    months: [pair('July', 'يوليو'), pair('August', 'أغسطس')],
    comparison: [
      [450, 64],
      [410, 80],
      [260, 72],
    ],
  },
};
export function getReportDetails(id = 'september') {
  const c = configs[id] || configs.september,
    month = c.months[1],
    before = c.months[0],
    focus = c.focus;
  const n = {};
  const set = (id, en, ar) => {
    n['300:' + id] = pair(en, ar);
  };
  set(1147, 'Illustrative sample report', 'تقرير تجريبي للمعاينة');
  set(1149, id === 'august' ? 'Arabic' : 'English', id === 'august' ? 'العربية' : 'الإنجليزية');
  set(
    1151,
    `Bloom & Co. · ${month.en} 2026 · ${focus.en}`,
    `بلوم آند كو · ${month.ar} 2026 · ${focus.ar}`,
  );
  set(1155, String(c.reviews), String(c.reviews));
  set(1156, month.en + ' 2026', month.ar + ' 2026');
  set(1159, String(c.branches), String(c.branches));
  set(1160, focus.en, focus.ar);
  set(1162, 'Wait / delay mentions', 'إشارات الانتظار والتأخير');
  set(1163, String(c.delay[1]), String(c.delay[1]));
  set(
    1164,
    `${c.delay[0]} in ${before.en} → ${c.delay[1]} in ${month.en}`,
    `${c.delay[0]} في ${before.ar} ← ${c.delay[1]} في ${month.ar}`,
  );
  set(
    1168,
    `This sample covers ${c.reviews} reviews for ${focus.en}. Food quality is ${c.positive[0]}% positive across ${c.mentions[0]} mentions; service speed is ${c.positive[4]}% positive across ${c.mentions[4]} mentions. [D1, D2]`,
    `تغطي هذه المعاينة ${c.reviews} مراجعة في ${focus.ar}. بلغت الآراء الإيجابية عن جودة الطعام ${c.positive[0]}% عبر ${c.mentions[0]} إشارة، وعن سرعة الخدمة ${c.positive[4]}% عبر ${c.mentions[4]} إشارة. [D1، D2]`,
  );
  set(
    1174,
    `Preserve the strengths customers value and review peak-hour service and pricing clarity. Delay mentions changed from ${c.delay[0]} to ${c.delay[1]}; verify operational causes before taking action. [D1–D3, E1–E3]`,
    `حافظوا على نقاط القوة التي يقدّرها العملاء، وراجعوا الخدمة في أوقات الذروة ووضوح الأسعار. تغيرت إشارات التأخير من ${c.delay[0]} إلى ${c.delay[1]}؛ ويجب التحقق من الأسباب التشغيلية قبل اتخاذ إجراء. [D1–D3، E1–E3]`,
  );
  set(
    1179,
    `[D1] ${month.en} sample aspects · positive sentiment`,
    `[D1] جوانب تجريبية لشهر ${month.ar} · الآراء الإيجابية`,
  );
  set(
    1180,
    'Retain product quality and welcoming service while monitoring less consistent parts of the experience. [E1, E2]',
    'حافظوا على جودة المنتج وحسن الاستقبال، مع متابعة الجوانب الأقل اتساقًا في التجربة. [E1، E2]',
  );
  [1184, 1190, 1196, 1202, 1208].forEach((node, i) =>
    set(
      node,
      `${c.mentions[i]} mentions · ${c.positive[i]}% positive`,
      `${c.mentions[i]} إشارة · ${c.positive[i]}% إيجابي`,
    ),
  );
  set(1218, id === 'service' ? 'Medium' : 'High', id === 'service' ? 'متوسطة' : 'مرتفعة');
  set(1220, 'Peak-hour service consistency', 'اتساق الخدمة في أوقات الذروة');
  set(
    1221,
    `Service speed is ${c.positive[4]}% positive across ${c.mentions[4]} mentions. The sample includes ${c.delay[1]} wait or delay mentions for ${month.en}. [D1, D3, E1]`,
    `بلغت الآراء الإيجابية عن سرعة الخدمة ${c.positive[4]}% عبر ${c.mentions[4]} إشارة. وتتضمن المعاينة ${c.delay[1]} إشارة للانتظار أو التأخير في ${month.ar}. [D1، D3، E1]`,
  );
  set(1227, 'Pricing clarity before ordering', 'وضوح الأسعار قبل الطلب');
  set(
    1228,
    `${c.pricing} sample reviews mention pricing clarity. Check that displayed prices and the amount charged match. [D3, E3]`,
    `تشير ${c.pricing} مراجعة تجريبية إلى وضوح الأسعار. تحقّقوا من تطابق الأسعار المعروضة مع المبلغ المحصّل. [D3، E3]`,
  );
  set(
    1236,
    'Compare periods and branches before drawing operational conclusions.',
    'قارنوا الفترات والفروع قبل استخلاص استنتاجات تشغيلية.',
  );
  set(
    1240,
    `${focus.en} · Wait / delay mentions [D3]`,
    `${focus.ar} · إشارات الانتظار والتأخير [D3]`,
  );
  const change = Math.round((Math.abs(c.delay[1] - c.delay[0]) / c.delay[0]) * 100),
    direction = c.delay[1] >= c.delay[0];
  set(
    1242,
    `${change}% ${direction ? 'more' : 'fewer'} vs. ${before.en}`,
    `${direction ? 'زيادة' : 'انخفاض'} ${change}% عن ${before.ar}`,
  );
  set(1244, before.en, before.ar);
  set(1246, String(c.delay[0]), String(c.delay[0]));
  set(1248, month.en, month.ar);
  set(1250, String(c.delay[1]), String(c.delay[1]));
  set(
    1251,
    'These are illustrative counts, not complaint rates. Consider total feedback volume and context when comparing periods.',
    'هذه أعداد تجريبية وليست معدلات شكاوى. يجب مراعاة إجمالي حجم الملاحظات والسياق عند مقارنة الفترات.',
  );
  set(1253, `[D2] ${month.en} branch comparison`, `[D2] مقارنة الفروع في ${month.ar}`);
  [1256, 1260, 1264].forEach((node, i) =>
    set(node, `${c.comparison[i][0]} reviews`, `${c.comparison[i][0]} مراجعة`),
  );
  [1257, 1261, 1265].forEach((node, i) =>
    set(node, `${c.comparison[i][1]}% positive`, `${c.comparison[i][1]}% إيجابي`),
  );
  set(
    1266,
    'Use the branch comparison as context, then validate which local practices can be shared.',
    'استخدموا مقارنة الفروع لفهم السياق، ثم تحقّقوا من الممارسات المحلية التي يمكن مشاركتها.',
  );
  set(
    1274,
    id === 'service' ? 'Medium priority' : 'High priority',
    id === 'service' ? 'أولوية متوسطة' : 'أولوية مرتفعة',
  );
  set(1277, 'Review peak-hour coverage', 'مراجعة التغطية في أوقات الذروة');
  set(
    1278,
    `Review staffing and order handoff in ${focus.en}. Monitor service-speed feedback in the next period before judging the change.`,
    `راجعوا توزيع فريق العمل وتسليم الطلبات في ${focus.ar}. تابعوا آراء العملاء عن سرعة الخدمة في الفترة التالية قبل تقييم التغيير.`,
  );
  set(
    1279,
    `${c.delay[1]} delay mentions vs. ${c.delay[0]} in ${before.en} · [D3, E1]`,
    `${c.delay[1]} إشارة للتأخير مقابل ${c.delay[0]} في ${before.ar} · [D3، E1]`,
  );
  set(1286, 'Make pricing clear before customers order', 'توضيح الأسعار قبل أن يطلب العملاء');
  set(
    1288,
    `${c.pricing} pricing-clarity reviews · [D3, E3]`,
    `${c.pricing} مراجعة عن وضوح الأسعار · [D3، E3]`,
  );
  set(1295, 'Share welcoming-service routines', 'مشاركة ممارسات حسن الاستقبال');
  set(
    1296,
    'Document welcoming and service routines. Test useful practices in other branches and review feedback before wider adoption.',
    'وثّقوا ممارسات الاستقبال والخدمة، وجرّبوا الممارسات المفيدة في الفروع الأخرى، ثم راجعوا آراء العملاء قبل تعميمها.',
  );
  set(
    1297,
    `${c.opportunity} sample mentions support the service opportunity · [D3, E2]`,
    `${c.opportunity} إشارة تجريبية تدعم فرصة تحسين الخدمة · [D3، E2]`,
  );
  set(
    1301,
    'Illustrative customer comments are separated from sample analysis. They demonstrate the layout and are not live customer records.',
    'تعليقات العملاء هنا أمثلة توضيحية منفصلة عن التحليل التجريبي؛ وهي لعرض التصميم وليست سجلات عملاء فعلية.',
  );
  [1307, 1322, 1335].forEach((node, i) =>
    set(node, `[E${i + 1}] Sample feedback`, `[E${i + 1}] تعليق تجريبي`),
  );
  set(1310, `${focus.en} · Illustrative Arabic feedback`, `${focus.ar} · تعليق عربي تجريبي`);
  set(
    1311,
    id === 'service'
      ? 'الفريق مرحّب، ونتمنى الحفاظ على نفس سرعة الخدمة وقت الزحمة.'
      : 'الطعام جيد، ونرجو تقليل وقت الانتظار في أوقات الزحمة.',
    id === 'service'
      ? 'الفريق مرحّب، ونتمنى الحفاظ على نفس سرعة الخدمة وقت الزحمة.'
      : 'الطعام جيد، ونرجو تقليل وقت الانتظار في أوقات الزحمة.',
  );
  set(
    1313,
    id === 'service'
      ? 'The team is welcoming. Please keep service as consistent during busy hours.'
      : 'The food is good. Please reduce waiting time during busy hours.',
    id === 'service'
      ? 'الفريق مرحّب. نرجو الحفاظ على اتساق الخدمة في أوقات الزحمة.'
      : 'الطعام جيد. نرجو تقليل وقت الانتظار في أوقات الزحمة.',
  );
  set(1325, `${focus.en} · Illustrative survey feedback`, `${focus.ar} · تعليق استبيان تجريبي`);
  set(
    1326,
    '“A warm welcome makes me want to visit again.”',
    '«الاستقبال الودود يجعلني أرغب في تكرار الزيارة.»',
  );
  set(1338, 'Illustrative pricing feedback', 'تعليق تجريبي عن الأسعار');
  set(
    1339,
    '“Please show the full offer price clearly before checkout.”',
    '«يرجى توضيح سعر العرض الكامل قبل الدفع.»',
  );
  set(
    1341,
    `Sample data references: [D1] Aspect figures · [D2] Branch comparison · [D3] Complaint and recommendation counts. All additional figures and comments on this sample page are illustrative.`,
    `مراجع البيانات التجريبية: [D1] مؤشرات الجوانب · [D2] مقارنة الفروع · [D3] أعداد الشكاوى والتوصيات. الأرقام والتعليقات الإضافية في هذه الصفحة توضيحية للمعاينة.`,
  );
  set(
    1343,
    `Bloom & Co. · ${month.en} 2026 · Illustrative preview data`,
    `بلوم آند كو · ${month.ar} 2026 · بيانات تجريبية للمعاينة`,
  );
  return { ...c, nodes: n, improved: c.delay[1] < c.delay[0] };
}
