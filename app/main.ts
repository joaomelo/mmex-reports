import { display } from "./display";
import {
  selectCategories,
  selectTransactionsSummaries
} from "./infra";

const categories = selectCategories();
const transactions = selectTransactionsSummaries();
display({
  categories,
  transactions
});