import inquirer from "inquirer";
import fs from "node:fs";
import path from "node:path";

import type {
  PerformanceMetric,
  Period
} from "./domain";

import { performanceMetrics } from "./domain";
import {
  periodToString,
  stringToPeriod,
  todayPeriod
} from "./utils";

const BASE_COLS: PerformanceMetric[] = ["planned", "actual", "difference"] as const;
const ALL_COLS = performanceMetrics;

export async function selectInputs(): Promise<{
  columns: PerformanceMetric[];
  delta: number;
  filePath: string;
  start: Period;
}> {
  const answers = await inquirer.prompt<{
    columns: PerformanceMetric[];
    columnsPreset: "__custom__" | PerformanceMetric[];
    deltaRaw: string;
    fileRaw: string;
    hideAcc: boolean;
    startRaw: string;
  }>([
    {
      default: defaultStartString(),
      message: "Start period (YYYY-MM)",
      name: "startRaw",
      type: "input",
      validate: (v) => (stringToPeriod(v) ? true : "Use YYYY-MM (e.g. 2025-01)"),
    },
    {
      default: "0",
      filter: (v) => String(v).trim(),
      message: "Delta in months (can be negative)",
      name: "deltaRaw",
      type: "input",
      validate: (v) => {
        const n = Number(v);
        return Number.isInteger(n) ? true : "Enter an integer (e.g. -3, 0, 12)";
      },
    },
    {
      choices: [
        {
          name: "Everything (all 6)",
          value: ALL_COLS
        },
        {
          name: "Only monthly (no accumulated)",
          value: BASE_COLS
        },
        {
          name: "Customize (start with monthly)",
          value: "__custom__" as const
        },
      ],
      default: ALL_COLS,
      message: "Columns preset",
      name: "columnsPreset",
      type: "list",
    },
    {
      choices: [
        new inquirer.Separator("— Monthly —"),
        {
          name: "Planned",
          short: "plan",
          value: "planned"
        },
        {
          name: "Actual",
          short: "act",
          value: "actual"
        },
        {
          name: "Diff (Actual - Planned)",
          short: "Δ",
          value: "difference"
        },
        new inquirer.Separator("— Accumulated —"),
        {
          name: "Acc Planned",
          short: "acc plan",
          value: "plannedAcc"
        },
        {
          name: "Acc Actual",
          short: "acc act",
          value: "actualAcc"
        },
        {
          name: "Acc Diff",
          short: "acc Δ",
          value: "differenceAcc"
        },
      ],
      default: BASE_COLS,
      loop: false,
      message: "Which columns to show? (Space/A/I)",
      name: "columns",
      pageSize: 10,
      type: "checkbox",
      when: (ans) => ans.columnsPreset === "__custom__",
    },
    {
      default: "mock.mmb",
      filter: (v) => path.resolve(String(v).trim()),
      message: "Path to your data file",
      name: "fileRaw",
      type: "input",
      validate: validateExistingFile,
    },
  ]);

  const start = stringToPeriod(answers.startRaw) ?? todayPeriod();
  const delta = Number(answers.deltaRaw);
  const filePath = answers.fileRaw;

  const preset = answers.columnsPreset;
  const columns: PerformanceMetric[] = Array.isArray(preset)
    ? preset
    : answers.columns;

  return {
    columns,
    delta,
    filePath,
    start
  };
}

function defaultStartString(): string {
  const defaultPeriod = todayPeriod();
  return periodToString(defaultPeriod);
}

function validateExistingFile(p: string): string | true {
  try {
    const full = path.resolve(p);
    const stat = fs.statSync(full);
    if (!stat.isFile()) return "Path exists but is not a file.";
    return true;
  } catch {
    return "File does not exist.";
  }
}
