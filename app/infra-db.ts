import DatabaseConstructor from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

import type {
  Category,
  Summary
} from "./domain";

type Database = InstanceType<typeof DatabaseConstructor>;

export function selectDb(filePath: string): {
  budget: Summary[];
  categories: Category[];
  transactions: Summary[];
} {
  const db = openDb(filePath);

  try {
    const categories = selectCategories(db);
    const budget = selectBudgetSummaries();
    const transactions = selectTransactionsSummaries(db);

    return {
      budget,
      categories,
      transactions
    };
  } finally {
    db.close();
  }
}

function openDb(filePath: string): Database {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`SQLite file not found: ${resolved}`);
  }

  const db = new DatabaseConstructor(resolved, {
    fileMustExist: true,
    readonly: true,
    timeout: 5000,
  });

  return db;
}

function selectCategories(db: Database): Category[] {
  const stmt = db.prepare<[], Category>(`
    SELECT
      c.CATEGID AS id,
      COALESCE(p.CATEGNAME || '/', '') || c.CATEGNAME AS name
    FROM category_v1 c
    LEFT JOIN category_v1 p ON p.CATEGID = c.PARENTID
    WHERE c.ACTIVE = 1
  `);

  const rows = stmt.all();
  return rows;
}

function selectBudgetSummaries(): Summary[] {
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

function selectTransactionsSummaries(db: Database): Summary[] {
  const stmt = db.prepare<[], Summary>(`
    WITH non_split AS (
      SELECT
        ca.CATEGID AS categoryId,
        CAST(STRFTIME('%Y', ca.TRANSDATE) AS INT) AS year,
        CAST(STRFTIME('%m', ca.TRANSDATE) AS INT) AS month,
        CASE
          WHEN ca.TRANSCODE = 'Withdrawal' THEN -ca.TRANSAMOUNT
          WHEN ca.TRANSCODE = 'Deposit'    THEN  ca.TRANSAMOUNT
          ELSE 0
        END      AS amount
      FROM CHECKINGACCOUNT_V1 ca
      WHERE ca.TRANSCODE IN ('Withdrawal', 'Deposit')
        AND (ca.DELETEDTIME IS NULL OR ca.DELETEDTIME = '')
        AND (ca.STATUS IS NULL OR ca.STATUS NOT IN ('Void','Duplicate'))
        AND NOT EXISTS (
          SELECT 1 FROM SPLITTRANSACTIONS_V1 st WHERE st.TRANSID = ca.TRANSID
        )
    ),
    split_rows AS (
      SELECT
        st.CATEGID AS categoryId,
        CAST(STRFTIME('%Y', ca.TRANSDATE) AS INT) AS year,
        CAST(STRFTIME('%m', ca.TRANSDATE) AS INT) AS month,
        CASE
          WHEN ca.TRANSCODE = 'Withdrawal' THEN -st.SPLITTRANSAMOUNT
          WHEN ca.TRANSCODE = 'Deposit'    THEN  st.SPLITTRANSAMOUNT
          ELSE 0
        END AS amount
      FROM CHECKINGACCOUNT_V1 ca
      JOIN SPLITTRANSACTIONS_V1 st ON st.TRANSID = ca.TRANSID
      WHERE ca.TRANSCODE IN ('Withdrawal', 'Deposit')
        AND (ca.DELETEDTIME IS NULL OR ca.DELETEDTIME = '')
        AND (ca.STATUS IS NULL OR ca.STATUS NOT IN ('Void','Duplicate'))
    )
    SELECT
      categoryId,
      month,
      year,
      ROUND(SUM(amount), 2) AS total
    FROM (
      SELECT * FROM non_split
      UNION ALL
      SELECT * FROM split_rows
    )
    WHERE categoryId IS NOT NULL
    GROUP BY categoryId, year, month
    ORDER BY year, month, categoryId;
  `);
  const rows = stmt.all();
  return rows;
}