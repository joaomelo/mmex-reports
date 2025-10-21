import type {
  Category,
  CategoryPeriod,
  Period,
  Summary
} from "./domain";

export function isPeriodBetween({
  end,
  period,
  start
}: {
  end: Period;
  period: Period;
  start: Period;
}): boolean {
  const startDate = new Date(start.year, start.month - 1);
  const endDate = new Date(end.year, end.month - 1);
  const periodDate = new Date(period.year, period.month - 1);
  return periodDate >= startDate && periodDate <= endDate;
}

export function findCategoryPeriod<T extends CategoryPeriod>({
  categoryId,
  data,
  month,
  year,
}:{
  categoryId: number,
  data: T[],
  month: number,
  year: number
}): T | undefined {
  return data.find(d => d.categoryId === categoryId
      && d.month === month
      && d.year === year
  );
}

export function resolveSummaryValue({
  categoryId,
  period,
  summaries
}: {
  categoryId: number;
  period: Period;
  summaries: Summary[];
}): number {
  const summary = findCategoryPeriod({
    categoryId,
    data: summaries,
    month: period.month,
    year: period.year
  });
  return summary ? summary.total : 0;
}

export function extractSortedPeriods(periods: Period[]): Period[] {
  const map = new Map<string, Period>();

  periods.forEach(period => {
    const key = formatPeriod(period);
    if (map.has(key)) return;
    map.set(key, {
      month: period.month,
      year: period.year
    });
  });

  return Array.from(map.values())
    .sort((a, b) =>
      a.year === b.year ? a.month - b.month : a.year - b.year
    );
};

export function todayPeriod(): Period {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return {
    month,
    year
  };
}

export function parsePeriodString(value: string): Period | undefined {
  const m = /^(\d{4})-(\d{2})$/.exec(value.trim());
  if (!m) return undefined;

  const year = Number(m[1]);
  const month = Number(m[2]);
  if (!Number.isInteger(year) || month < 1 || month > 12) return undefined;

  return {
    month,
    year
  };
}

export function formatPeriod(period: Period): string {
  return `${period.year.toFixed(0)}-${String(period.month).padStart(2, "0")}`;
}

export function sortCategories(categories: Category[]): Category[] {
  return categories.sort((a, b) => a.name.localeCompare(b.name));
}
