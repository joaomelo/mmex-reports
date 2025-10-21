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

export interface Performance extends CategoryPeriod {
  actual: number;
  planned: number;
  difference: number;
  actualAcc: number;
  plannedAcc: number;
  differenceAcc: number;
}