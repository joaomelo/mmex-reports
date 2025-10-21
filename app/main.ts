import { display } from "./display";
import {
  selectBudgetSummaries,
  selectCategories,
  selectTransactionsSummaries
} from "./infra";

const categories = selectCategories();
const transactions = selectTransactionsSummaries();
const budget = selectBudgetSummaries();
display({
  budget,
  categories,
  transactions
});