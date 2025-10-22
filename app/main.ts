import { display } from "./display";
import { selectDb } from "./infra-db";
import { selectInputs } from "./infra-prompt";
import { mountPerformance } from "./services";

const inputs = await selectInputs();

const {
  budget,
  categories,
  transactions
} = selectDb(inputs.filePath);

const performances = mountPerformance({
  budget,
  categories,
  delta: inputs.delta,
  referencePeriod: inputs.period,
  transactions
});

display({
  categories,
  displayMetrics: inputs.columns,
  performances
});
