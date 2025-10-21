import { display } from "./display";
import {
  selectBudgetSummaries,
  selectCategories,
  selectTransactionsSummaries
} from "./infra";
import { mountPerformance } from "./services";

const categories = selectCategories();
const transactions = selectTransactionsSummaries();
const budget = selectBudgetSummaries();

const performances = mountPerformance({
  budget,
  categories,
  transactions
});

display({
  categories,
  performances
});