import type {
  Category,
  Performance,
  Period,
  Summary
} from "./domain";

import {
  extractSortedPeriods,
  isPeriodBetween,
  resolveSummaryValue,
} from "./utils";

export function mountPerformance({
  budget,
  categories,
  delta,
  start,
  transactions
}: {
  budget: Summary[];
  categories: Category[];
  delta: number;
  start: Period;
  transactions: Summary[];
}): Performance[] {

  const end = solveEnd(start, delta);

  const performances: Performance[] = [];

  const categoriesIds = categories.map(({ id }) => id);
  const periods = extractSortedPeriods([...budget, ...transactions]);

  let plannedAcc = 0;
  let actualAcc = 0;
  let differenceAcc = 0;
  periods.forEach((period) => {
    const isBetween = isPeriodBetween({
      end,
      period,
      start
    });
    if (!isBetween) return;

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

function solveEnd(start: Period, delta: number): Period {
  const end = new Date(start.year, start.month - 1);
  end.setMonth(end.getMonth() + 1 + delta);
  return {
    month: end.getMonth(),
    year: end.getFullYear()
  };
}