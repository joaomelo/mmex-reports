export interface Period {
  month: number;
  year: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface CategoryPeriod extends Period { categoryId: number; }

export interface Summary extends CategoryPeriod { total: number; }

export const performanceBaseMetrics = ["planned", "actual", "difference", ] as const;
export const performanceAccumulatedMetrics = ["plannedAcc", "actualAcc", "differenceAcc"] as const;
export const performanceMetrics = [ ...performanceBaseMetrics, ...performanceAccumulatedMetrics ] as const;
export type PerformanceMetric = typeof performanceMetrics[number];

export type Performance = CategoryPeriod & { [key in PerformanceMetric]: number; };
