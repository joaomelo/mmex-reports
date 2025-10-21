import type {
  Category,
  Summary
} from "./domain";

export function selectCategories(): Category[] {
  return [
    {
      id: 1,
      name: "Receita"
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
}

export function selectBudgetSummaries(): Summary[] {
  return [
    {
      categoryId: 1,
      month: 1,
      total: 110,
      year: 2023
    },
    {
      categoryId: 2,
      month: 1,
      total: -120,
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
      total: -120,
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
      total: -120,
      year: 2023
    },
    {
      categoryId: 3,
      month: 3,
      total: 130,
      year: 2023
    },
  ];
}

export function selectTransactionsSummaries(): Summary[] {
  return [
    {
      categoryId: 1,
      month: 1,
      total: 1000,
      year: 2023
    },
    {
      categoryId: 2,
      month: 1,
      total: -550,
      year: 2023
    },
    {
      categoryId: 2,
      month: 2,
      total: -100,
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
}