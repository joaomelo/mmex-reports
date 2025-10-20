import Table from "cli-table3";

import type {
  Category,
  Period,
  Summaries,
} from "./domain";

export function display({
  categories,
  transactions
}: {
  categories: Category[];
  transactions: Summaries;
}) {
  if (transactions.length === 0) {
    console.info("no data.");
    return;
  }

  const categoriesNormalized = categories.sort((a, b) => a.name.localeCompare(b.name));
  const periods = extractPeriods(transactions);

  const table = new Table({ head: ["Category", ...periods.map(formatPeriod)] });

  categoriesNormalized.forEach((category) => {
    const {
      id,
      name
    } = category;
    const values = periods.map((period) => {
      const summary = transactions.find(s => s.categoryId === id
          && s.month === period.month
          && s.year === period.year
      );
      const value = summary ? summary.total : 0;
      return value.toFixed(2);
    });
    table.push([name, ...values]);
  });

  console.info(table.toString());
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