export const surveyBranches = [
  { id: 'cairo', label: 'Cairo' },
  { id: 'alex', label: 'Alex' },
  { id: 'zamalek', label: 'El Zamalek' },
];
export function matchesSurveyFilters({ text, query = '', scope, selectedBranches, labels }) {
  const normalize = (value) =>
    String(value || '')
      .trim()
      .toLocaleLowerCase();
  if (query && !normalize(text).includes(normalize(query))) return false;
  if (!selectedBranches.length) return false;
  if (
    selectedBranches.length === 3 ||
    [labels.all, 'All 3 branches'].some((label) => normalize(scope) === normalize(label))
  )
    return true;
  return selectedBranches.some((id) =>
    [labels[id], surveyBranches.find((branch) => branch.id === id)?.label].some(
      (label) => normalize(scope) === normalize(label),
    ),
  );
}
