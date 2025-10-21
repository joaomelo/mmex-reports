import inquirer from "inquirer";
import fs from "node:fs";
import path from "node:path";

import type { Period } from "./domain";

import {
  formatPeriod,
  parsePeriodString,
  todayPeriod
} from "./utils";

export async function selectInputs(): Promise<{
  delta: number;
  filePath: string;
  start: Period;
}> {
  const answers = await inquirer.prompt<{
    deltaRaw: string;
    fileRaw: string;
    startRaw: string;
  }>([
    {
      default: defaultStartString(),
      message: "Start period (YYYY-MM)",
      name: "startRaw",
      type: "input",
      validate: (v) => (parsePeriodString(v) ? true : "Use YYYY-MM (e.g. 2025-01)"),
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
      default: "mock",
      filter: (v) => path.resolve(String(v).trim()),
      message: "Path to your data file",
      name: "fileRaw",
      type: "input",
      validate: validateExistingFile,
    },
  ]);

  const start = parsePeriodString(answers.startRaw) ?? todayPeriod();
  const delta = Number(answers.deltaRaw);
  const filePath = answers.fileRaw;

  return {
    delta,
    filePath,
    start
  };
}

function defaultStartString(): string {
  const defaultPeriod = todayPeriod();
  return formatPeriod(defaultPeriod);
}

function validateExistingFile(p: string): string | true {
  if (p === "mock") return true;

  try {
    const full = path.resolve(p);
    const stat = fs.statSync(full);
    if (!stat.isFile()) return "Path exists but is not a file.";
    return true;
  } catch {
    return "File does not exist.";
  }
}
