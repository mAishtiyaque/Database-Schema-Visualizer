import React, { useEffect, useState } from "react";

import { PopulateTable } from "./PopulateTable";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { ProcessedData } from "./CsvReader";
import { Database, Table, Column } from "./utls";
import Switch from "@mui/material/Switch/Switch";
interface Props {
  structuredData: Database[];
  processedData: ProcessedData;
}
export const PopulateDatabase: React.FC<Props> = ({
  structuredData,
  processedData,
}) => {
  const [selectedDatabases, setSelectedDatabases] = useState<string[]>([]);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [filteredStructuredData, setFilteredStructuredData] =
    useState<Database[]>(structuredData);
  const [toggleOR, setToggleOR] = useState<boolean>(false);
  const handleToggleOR = () => {
    executeFilter(selectedDatabases, selectedTables, selectedColumns, !toggleOR);
    setToggleOR((state) => !state);
  };
  useEffect(() => {
    setFilteredStructuredData(structuredData);
    setSelectedDatabases([]);
    setSelectedTables([]);
    setSelectedColumns([]);
  }, [structuredData]);

  const executeFilter = (
    selectedDbs: string[],
    selectedTbs: string[],
    selectedCols: string[],
    toggle:boolean
  ) => {
    let filteredDb = structuredData.map((db) => ({
      ...db, // Copy top-level properties
      tables: db.tables.map((table) => ({
        ...table,
        columns: table.columns.map((column) => ({ ...column })),
      })),
    }));

    let filteredTb;
    if (selectedDbs.length !== 0) {
      filteredDb = filteredDb.filter((db: Database) => {
        return selectedDbs.includes(db.db_name);
      });
    }
    if (selectedTbs.length !== 0) {
      filteredDb.forEach((db: Database, dbIndex) => {
        filteredTb = db.tables.filter((tb: Table) => {
          return selectedTbs.includes(tb.table_name);
        });
        filteredDb[dbIndex].tables = filteredTb;
      });
      filteredDb = filteredDb.filter((db: Database) => db.tables.length);
    }

    if (selectedCols.length !== 0) {
      filteredDb.forEach((db: Database, dbIndex) => {
        filteredTb = db.tables.filter((tb: Table) => {
          if (toggle) {
            let isAnyColumnPresentInSelectedColumn = tb.columns.some(
              (col: Column) => {
                return selectedCols.includes(col.column_name);
              }
            );
            return isAnyColumnPresentInSelectedColumn;
          } else {
            let isAllSelectedColumnPresentInColumn = selectedCols.every(
              (selectedCol) =>
                tb.columns.some((col) => col.column_name === selectedCol)
            );
            return isAllSelectedColumnPresentInColumn;
          }
        });
        filteredDb[dbIndex].tables = filteredTb;
      });
      filteredDb = filteredDb.filter((db: Database) => db.tables.length);
    }

    setFilteredStructuredData(filteredDb);
  };
  const handleSelectedDatabase = (selectedDbs: string[]) => {
    executeFilter(selectedDbs, selectedTables, selectedColumns, toggleOR);
    setSelectedDatabases(selectedDbs);
  };
  const handleSelectedTable = (selectedTbs: string[]) => {
    executeFilter(selectedDatabases, selectedTbs, selectedColumns, toggleOR);
    setSelectedTables(selectedTbs);
  };
  const handleSelectedColumn = (selectedCols: string[]) => {
    executeFilter(selectedDatabases, selectedTables, selectedCols, toggleOR);
    setSelectedColumns(selectedCols);
  };
  return (
    <>
      <h3>Schema Visualization</h3>

      {/* Filters */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          width: "100%",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Autocomplete
          sx={{ width: "100%" }}
          multiple
          id="tags-outlined2"
          options={processedData.databases}
          getOptionLabel={(option) => option}
          //defaultValue={selectedDatabases}
          value={selectedDatabases}
          onChange={(_event, newValue) => {
            handleSelectedDatabase(newValue);
          }}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label="Filter Database"
              placeholder="Search Database"
            />
          )}
        />
        <Autocomplete
          sx={{ width: "100%" }}
          multiple
          id="tags-outlined"
          options={processedData.tables}
          getOptionLabel={(option) => option}
          // defaultValue={[processedData?.tables[0]]}
          value={selectedTables}
          onChange={(_event, newValue) => {
            handleSelectedTable(newValue);
          }}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label="Filter Table"
              placeholder="Search Table"
            />
          )}
        />
        <Autocomplete
          sx={{ width: "100%" }}
          multiple
          id="tags-outlined3"
          options={processedData.columns}
          getOptionLabel={(option) => option}
          // defaultValue={[processedData?.tables[0]]}
          value={selectedColumns}
          onChange={(_event, newValue) => {
            handleSelectedColumn(newValue);
          }}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label="Filter Column"
              placeholder="Search Column"
            />
          )}
        />
        <Switch onChange={handleToggleOR} defaultChecked={!toggleOR} />{" "}
      </Stack>
      {/* {JSON.stringify(selectedDatabases, null, 3)}
      {JSON.stringify(selectedTables, null, 3)}
      {JSON.stringify(selectedColumns, null, 3)} */}

      <br />
      <div className="database-container">
        {filteredStructuredData.map((db: Database, dbIndex) => {
          return (
            <div key={dbIndex} className="database-box">
              <div className="database-title">{db.db_name}</div>
              <PopulateTable tables={db.tables} />
            </div>
          );
        })}
      </div>
    </>
  );
};
