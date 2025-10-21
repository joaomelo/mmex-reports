import { display } from "./display";
import {
  selectBudgetSummaries,
  selectCategories,
  selectTransactionsSummaries
} from "./infra-db-mock";
import { selectInputs } from "./infra-prompt";
import { mountPerformance } from "./services";

const inputs = await selectInputs();

const categories = selectCategories();
const transactions = selectTransactionsSummaries();
const budget = selectBudgetSummaries();

const performances = mountPerformance({
  budget,
  categories,
  delta: inputs.delta,
  start: inputs.start,
  transactions
});

display({
  categories,
  performances
});
