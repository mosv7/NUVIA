export function responseCount(count, language) {
  const number = count.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US');
  if (language !== 'ar') return number + ' ' + (count === 1 ? 'response' : 'responses');
  if (count === 0) return '٠ ردود';
  if (count === 1) return 'رد واحد';
  if (count === 2) return 'ردّان';
  const form = new Intl.PluralRules('ar').select(count);
  return number + ' ' + (form === 'few' ? 'ردود' : form === 'many' ? 'ردًا' : 'رد');
}
export function normalizeFeedbackSearch(value) {
  return String(value)
    .normalize('NFKC')
    .replace(/[\u064b-\u065f]/g, '')
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x660))
    .toLocaleLowerCase()
    .trim();
}
