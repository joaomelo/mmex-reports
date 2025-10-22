import type {
  Category,
  Performance,
  Period,
  Summary
} from "./domain";

import {
  calculateDeltaPeriod,
  extractSortedPeriods,
  isPeriodBetween,
  resolveSummaryValue,
} from "./utils";

interface CategoryAccumulated {
  actual: number;
  difference: number;
  planned: number;
}

export function mountPerformance({
  budget,
  categories,
  delta,
  referencePeriod,
  transactions
}: {
  budget: Summary[];
  categories: Category[];
  delta: number;
  referencePeriod: Period;
  transactions: Summary[];
}): Performance[] {

  const performances: Performance[] = [];
  const categoriesAccumulated = new Map<number, CategoryAccumulated>();

  const deltaPeriod = calculateDeltaPeriod(referencePeriod, delta);

  const categoriesIds = categories.map(({ id }) => id);
  const periods = extractSortedPeriods([...budget, ...transactions]);

  periods.forEach((period) => {
    const isBetween = isPeriodBetween({
      end: delta >= 0 ? deltaPeriod : referencePeriod,
      period,
      start: delta >= 0 ? referencePeriod : deltaPeriod
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

      if (!categoriesAccumulated.has(categoryId)) {
        categoriesAccumulated.set(categoryId, {
          actual: 0,
          difference: 0,
          planned: 0
        });
      }
      const categoryAccumulated = categoriesAccumulated.get(categoryId);
      if (!categoryAccumulated) throw new Error("Category state is required");

      categoryAccumulated.actual += actual;
      categoryAccumulated.planned += planned;
      categoryAccumulated.difference += difference;

      const performance: Performance = {
        actual,
        actualAcc: categoryAccumulated.actual,
        categoryId,
        difference,
        differenceAcc: categoryAccumulated.difference,
        month: period.month,
        planned,
        plannedAcc: categoryAccumulated.planned,
        year: period.year
      };
      performances.push(performance);
    });
  });
  return performances;
}