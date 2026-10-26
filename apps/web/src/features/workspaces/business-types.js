const types = {
  food_beverage: 'Food & beverage',
  retail: 'Retail',
  healthcare: 'Healthcare',
  hospitality: 'Hospitality',
  education: 'Education',
  services: 'Services',
  restaurant: 'Restaurant',
  clinic: 'Clinic',
  store: 'Store',
  other: 'Other',
};
const aliases = {
  cafe: 'food_beverage',
  café: 'food_beverage',
  'food & beverage': 'food_beverage',
  مقهى: 'food_beverage',
  مطعم: 'restaurant',
  عيادة: 'clinic',
  متجر: 'store',
  أخرى: 'other',
};
export const businessType = (value) =>
  aliases[value.trim().toLowerCase()] || value.trim().toLowerCase().replaceAll(' ', '_');
export const presentWorkspace = (workspace) =>
  workspace ? { ...workspace, industry: types[workspace.industry] || workspace.industry } : null;
export const industryNames = Object.values(types);
