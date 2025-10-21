import type {
  Category,
  Performance,
  Summary
} from "./domain";

import {
  extractSortedPeriods,
  resolveSummaryValue,
} from "./utils";

export function mountPerformance({
  budget,
  categories,
  transactions
}: {
  budget: Summary[];
  categories: Category[];
  transactions: Summary[];
}): Performance[] {
  const performances: Performance[] = [];

  const categoriesIds = categories.map(({ id }) => id);
  const periods = extractSortedPeriods([...budget, ...transactions]);

  let plannedAcc = 0;
  let actualAcc = 0;
  let differenceAcc = 0;
  periods.forEach((period) => {
    categoriesIds.forEach((categoryId) => {
      const actual = resolveSummaryValue({
        categoryId,
        period,
        summaries: transactions
      });
      const planned = resolveSummaryValue({
        categoryId,
        period,
        summaries: budget
      });
      const difference = actual - planned;
      actualAcc += actual;
      plannedAcc += planned;
      differenceAcc += difference;
      const performance: Performance = {
        actual,
        actualAcc,
        categoryId,
        difference,
        differenceAcc,
        month: period.month,
        planned,
        plannedAcc,
        year: period.year
      };
      performances.push(performance);
    });
  });
  return performances;
}