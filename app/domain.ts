export type Summaries = Summary[];

export interface Period {
  month: number;
  year: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface Summary extends Period {
  categoryId: number;
  total: number;
}
