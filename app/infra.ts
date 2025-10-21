import type {
  Category,
  Summaries
} from "./domain";

export function selectCategories(): Category[] {
  const dummyData: Category[] = [
    {
      id: 1,
      name: "Food"
    },
    {
      id: 2,
      name: "Transport"
    },
    {
      id: 3,
      name: "Entertainment"
    }
  ];
  return dummyData;
}

export function selectBudgetSummaries(): Summaries {
  const dummyData: Summaries = [
    {
      categoryId: 1,
      month: 1,
      total: 110,
      year: 2023
    },
    {
      categoryId: 2,
      month: 1,
      total: 120,
      year: 2023
    },
    {
      categoryId: 3,
      month: 1,
      total: 130,
      year: 2023
    },
    {
      categoryId: 1,
      month: 2,
      total: 110,
      year: 2023
    },
    {
      categoryId: 2,
      month: 2,
      total: 120,
      year: 2023
    },
    {
      categoryId: 3,
      month: 2,
      total: 130,
      year: 2023
    },
    {
      categoryId: 1,
      month: 3,
      total: 110,
      year: 2023
    },
    {
      categoryId: 2,
      month: 3,
      total: 120,
      year: 2023
    },
    {
      categoryId: 3,
      month: 3,
      total: 130,
      year: 2023
    },
  ];
  return dummyData;
}

export function selectTransactionsSummaries(): Summaries {
  const dummyData: Summaries = [
    {
      categoryId: 1,
      month: 1,
      total: 1000,
      year: 2023
    },
    {
      categoryId: 2,
      month: 1,
      total: 550,
      year: 2023
    },
    {
      categoryId: 2,
      month: 2,
      total: 100,
      year: 2023
    },
    {
      categoryId: 1,
      month: 3,
      total: 1000,
      year: 2023
    },
    {
      categoryId: 3,
      month: 3,
      total: 75,
      year: 2023
    }
  ];
  return dummyData;
}