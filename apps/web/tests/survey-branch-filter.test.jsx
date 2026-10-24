import { describe, expect, it } from 'vitest';
import { matchesSurveyFilters } from '../src/features/surveys/preview/survey-branch-filter.js';
const locales = [
  { all: 'All 3 branches', cairo: 'Cairo', alex: 'Alex', zamalek: 'El Zamalek' },
  { all: 'كل الفروع الثلاثة', cairo: 'القاهرة', alex: 'الإسكندرية', zamalek: 'الزمالك' },
];
describe('survey branch and search filters', () => {
  for (const labels of locales) {
    it('includes shared surveys in a single branch selection: ' + labels.cairo, () => {
      expect(
        matchesSurveyFilters({
          text: 'Customer experience',
          scope: labels.all,
          selectedBranches: ['cairo'],
          labels,
        }),
      ).toBe(true);
      expect(
        matchesSurveyFilters({
          text: 'Customer experience',
          scope: labels.alex,
          selectedBranches: ['cairo'],
          labels,
        }),
      ).toBe(false);
    });
    it('combines multiple branches with search: ' + labels.cairo, () => {
      expect(
        matchesSurveyFilters({
          text: 'Coffee Survey',
          query: 'coffee',
          scope: labels.zamalek,
          selectedBranches: ['cairo', 'zamalek'],
          labels,
        }),
      ).toBe(true);
      expect(
        matchesSurveyFilters({
          text: 'Coffee Survey',
          query: 'menu',
          scope: labels.zamalek,
          selectedBranches: ['cairo', 'zamalek'],
          labels,
        }),
      ).toBe(false);
    });
    it('returns no surveys when all branches are unchecked: ' + labels.cairo, () => {
      expect(
        matchesSurveyFilters({
          text: 'Customer experience',
          scope: labels.all,
          selectedBranches: [],
          labels,
        }),
      ).toBe(false);
    });
  }
});
