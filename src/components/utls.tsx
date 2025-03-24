import * as d3 from "d3";

export interface SchemaData {
  Database: string;
  Table: string;
  Column: string;
}

interface Stats {
  database: string;
  numberOfTables: number;
  numberOfColumns: number;
}

export interface Column {
  column_name: string;
}

export interface Table {
  table_name: string;
  columns: Column[];
}

export interface Database {
  db_name: string;
  tables: Table[];
}

export function processCsv(
  df: SchemaData[]
): [string[], string[], string[], SchemaData[]] {
  // Ensure column names are correct (case-insensitive)
  let processedDf = df.map((row) =>
    row.Database
      ? {
          Database: row.Database,
          Table: row.Table,
          Column: row.Column,
        }
      : null
  );
  const processedDfFiltered = processedDf.filter((row) => row != undefined);
  // Get unique values
  const databases = Array.from(
    new Set(processedDfFiltered.map((row) => row.Database))
  );
  const tables = Array.from(
    new Set(processedDfFiltered.map((row) => row.Table))
  );
  const columns = Array.from(
    new Set(processedDfFiltered.map((row) => row.Column))
  );

  return [databases, tables, columns, processedDfFiltered];
}


export const getStructuredData = (csvArray: SchemaData[]): Database[] => {
  const result: Database[] = [];

  csvArray.forEach(
    ({ Database: dbName, Table: tableName, Column: columnName }) => {
      // Find if the database exists
      let db = result.find(
        (db) => db.db_name.toLowerCase() === dbName.toLowerCase()
      );
      if (!db) {
        db = { db_name: dbName, tables: [] };
        result.push(db);
      }

      // Find if the table exists in the database
      let table = db.tables.find(
        (table) => table.table_name.toLowerCase() === tableName.toLowerCase()
      );
      if (!table) {
        table = { table_name: tableName, columns: [] };
        db.tables.push(table);
      }

      // Check if the column exists in the table
      if (!table.columns.some((col) => col.column_name === columnName)) {
        table.columns.push({ column_name: columnName });
      }
    }
  );

  return result;
};

export function generateStats(df: SchemaData[]): Stats[] {
  // Group the data by 'database'
  const groupedByDatabase = d3.groups(df, (d) => d.Database);

  // Calculate stats for each database
  const dbTableCounts = groupedByDatabase.map(([database, records]) => {
    // Get the number of unique tables in this database
    const numberOfTables = new Set(records.map((r: SchemaData) => r.Table))
      .size;

    // Get the number of columns in this database (total length of records)
    const numberOfColumns = records.length;

    return {
      database,
      numberOfTables,
      numberOfColumns,
    };
  });

  return dbTableCounts;
}

