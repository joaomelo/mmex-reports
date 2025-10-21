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
  performances
}: {
  categories: Category[],
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

  const periodHeaders: CellOptions[] = periods.map(period => ({
    colSpan: 6,
    content: formatPeriod(period),
    hAlign: "center"
  }));

  const firstRow: CellOptions[] = [topLeft, ...periodHeaders];
  table.push(firstRow);

  const secondRow: CellOptions[] = periods.flatMap(() => [{
    colSpan: 3,
    content: "period",
    hAlign: "center"
  }, {
    colSpan: 3,
    content: "acc",
    hAlign: "center"
  }]);
  table.push(secondRow);

  const thirdRow: CellOptions[] = periods.flatMap(() => [
    { content: "planned" },
    { content: "actual" },
    { content: "difference" },
    { content: "planned" },
    { content: "actual" },
    { content: "difference" },
  ]);
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

      const periodValues = [ performance.planned, performance.actual, performance.difference,
        performance.plannedAcc, performance.actualAcc, performance.differenceAcc
      ];
      return periodValues.map(formatValueCell);
    });

    table.push([categoryName, ...categoryValues]);
  });

  console.info(table.toString());
}

function formatValueCell(value: number): CellOptions {
  const rawContent = value.toFixed(2);
  const content = value === 0
    ? rawContent
    : value > 0
      ? chalk.cyan(rawContent)
      : chalk.red(rawContent);
  return {
    content: content,
    hAlign: "right"
  };
}
