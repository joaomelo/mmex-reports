import type { CellOptions } from "cli-table3";

import chalk from "chalk";
import Table from "cli-table3";

import type {
  Category,
  Performance,
} from "./domain";

import {
  extractSortedPeriods,
  findCategoryPeriod,
  formatPeriod,
  sortCategories
} from "./utils";

export function display({
  categories: unsortedCategories,
  hideAcc,
  performances
}: {
  categories: Category[],
  hideAcc?: boolean,
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

  const periodSpan = hideAcc ? 3 : 6;
  const periodHeaders: CellOptions[] = periods.map(period => ({
    colSpan: periodSpan,
    content: formatPeriod(period),
    hAlign: "center"
  }));

  const firstRow: CellOptions[] = [topLeft, ...periodHeaders];
  table.push(firstRow);

  const secondRow: CellOptions[] = [];
  periods.forEach(() => {
    secondRow.push({
      colSpan: 3,
      content: "period",
      hAlign: "center"
    });
    if (hideAcc) return;
    secondRow.push({
      colSpan: 3,
      content: "acc",
      hAlign: "center"
    });
  });
  table.push(secondRow);

  const thirdRow: CellOptions[] = [];
  periods.forEach(() => {
    thirdRow.push({ content: "planned" });
    thirdRow.push({ content: "actual" });
    thirdRow.push({ content: "diff" });
    if (hideAcc) return;
    thirdRow.push({ content: "planned" });
    thirdRow.push({ content: "actual" });
    thirdRow.push({ content: "diff" });
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

      const periodValues = [ performance.planned, performance.actual, performance.difference ];
      if (!hideAcc) {
        periodValues.push(performance.plannedAcc, performance.actualAcc, performance.differenceAcc);
      }
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
