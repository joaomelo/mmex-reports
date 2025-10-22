import type { CellOptions } from "cli-table3";

import chalk from "chalk";
import Table from "cli-table3";

import type {
  Category,
  Performance,
  PerformanceMetric
} from "./domain";

import {
  performanceAccumulatedMetrics,
  performanceBaseMetrics,
  performanceMetrics
} from "./domain";
import {
  extractSortedPeriods,
  findCategoryPeriod,
  periodToString,
  sortCategories
} from "./utils";

export function display({
  categories: unsortedCategories,
  displayMetrics,
  performances
}: {
  categories: Category[],
  displayMetrics: PerformanceMetric[],
  performances: Performance[];
}) {
  if (performances.length === 0) {
    console.info("no data.");
    return;
  }

  const table = new Table({ });

  const topLeft: CellOptions = {
    content: "Category",
    hAlign: "center",
    rowSpan: 3,
    vAlign: "center",
  };

  const periods = extractSortedPeriods(performances);

  const periodSpan = displayMetrics.length;
  const periodHeaders: CellOptions[] = periods.map(period => ({
    colSpan: periodSpan,
    content: periodToString(period),
    hAlign: "center"
  }));

  const firstRow: CellOptions[] = [topLeft, ...periodHeaders];
  table.push(firstRow);

  const secondRow: CellOptions[] = [];

  const displayBaseMetrics = performanceBaseMetrics
    .filter(metric => displayMetrics.includes(metric));
  const displayAccumulatedMetrics = performanceAccumulatedMetrics
    .filter(metric => displayMetrics.includes(metric));
  const metricsGroups = [{
    label: "period",
    metrics: displayBaseMetrics
  }, {
    label: "acc",
    metrics: displayAccumulatedMetrics
  }] as const;

  periods.forEach(() => {
    metricsGroups.forEach((group) => {
      if (group.metrics.length === 0) return;
      secondRow.push({
        colSpan: group.metrics.length,
        content: group.label,
        hAlign: "center"
      });
    });
  });
  table.push(secondRow);

  const thirdRow: CellOptions[] = [];

  const metricsLabels = {
    actual: "actual",
    actualAcc: "actual",
    difference: "diff",
    differenceAcc: "diff",
    planned: "planned",
    plannedAcc: "planned"
  } as const;

  periods.forEach(() => {
    // we use performance instead of display in the loop to preserve order
    performanceMetrics.forEach((metric) => {
      if (!displayMetrics.includes(metric)) return;
      thirdRow.push({ content: metricsLabels[metric] });
    });
  });
  table.push(thirdRow);

  const categories = sortCategories(unsortedCategories);

  categories.forEach((category) => {
    const {
      id: categoryId,
      name: categoryName
    } = category;

    const categoryValues = periods.flatMap((period) => {
      const performance = findCategoryPeriod({
        categoryId,
        data: performances,
        month: period.month,
        year: period.year
      });
      if (!performance) throw new Error("performance not found");

      const periodValues: number[] = [];
      // we use performance instead of display in the loop to preserve order
      performanceMetrics.forEach((metric) => {
        if (!displayMetrics.includes(metric)) return;
        periodValues.push(performance[metric]);
      });
      return periodValues.map(formatValueCell);
    });

    table.push([categoryName, ...categoryValues]);
  });

  console.info(table.toString());
}

function formatValueCell(rawValue: number): CellOptions {
  const finalValue = Math.round(rawValue);
  const rawContent = finalValue.toFixed(0);
  const content = finalValue === 0
    ? rawContent
    : finalValue > 0
      ? chalk.cyan(rawContent)
      : chalk.red(rawContent);
  return {
    content: content,
    hAlign: "right"
  };
}
