import type { CellOptions } from "cli-table3";

import chalk from "chalk";
import Table from "cli-table3";

import type {
  Category,
  Period,
  Summaries
} from "./domain";

export function display({
  budget,
  categories,
  transactions
}: {
  budget: Summaries;
  categories: Category[];
  transactions: Summaries;
}) {
  if (transactions.length === 0) {
    console.info("no data.");
    return;
  }

  const table = new Table({ });

  const topLeft: CellOptions = {
    content: "Category",
    hAlign: "center",
    rowSpan: 2,
    vAlign: "center",
  };

  const periods = extractPeriods(transactions);
  const periodHeaders: CellOptions[] = periods.map(period => ({
    colSpan: 2,
    content: formatPeriod(period),
    hAlign: "center"
  }));

  const firstRow: CellOptions[] = [topLeft, ...periodHeaders];
  table.push(firstRow);

  const secondRow: CellOptions[] = periods.flatMap(() => [{ content: formatPlanned("planned") }, { content: "actual" }]);
  table.push(secondRow);

  const categoriesNormalized = categories.sort((a, b) => a.name.localeCompare(b.name));

  categoriesNormalized.forEach((category) => {
    const {
      id: categoryId,
      name: categoryName
    } = category;

    const values = periods.flatMap((period) => {

      const budgetValue = resolveValue({
        categoryId,
        period,
        summaries: budget
      });

      const transactionsValue = resolveValue({
        categoryId,
        period,
        summaries: transactions
      });

      return [formatPlanned(budgetValue), transactionsValue];
    });

    table.push([categoryName, ...values]);
  });

  console.info(table.toString());
}

function resolveValue({
  categoryId,
  period,
  summaries
}: {
  categoryId: number;
  period: Period;
  summaries: Summaries;
}): string {
  const summary = summaries.find(s => s.categoryId === categoryId
      && s.month === period.month
      && s.year === period.year
  );
  const value = summary ? summary.total : 0;
  return value.toFixed(2);
}

function formatPlanned(content: number | string): string {
  return chalk.cyan(content);
}

function extractPeriods(summaries: Summaries): Period[] {
  const map = new Map<string, Period>();
  summaries.forEach(summary => {
    const key = formatPeriod(summary);
    map.set(key, {
      month: summary.month,
      year: summary.year
    });
  });

  return Array.from(map.values())
    .sort((a, b) =>
      a.year === b.year ? b.month - a.month : b.year - a.year
    );
};

function formatPeriod(period: Period): string {
  return `${period.year.toFixed(0)}-${String(period.month).padStart(2, "0")}`;
}