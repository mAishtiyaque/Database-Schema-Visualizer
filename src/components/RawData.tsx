import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { SchemaData } from "./utls";

interface Props {
  dfProcessed: SchemaData[];
}

export const RawData: React.FC<Props> = ({ dfProcessed }) => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "#", width: 30 },
    { field: "Database", headerName: "Database", width: 150 },
    { field: "Table", headerName: "Table", width: 150 },
    {
      field: "Column",
      headerName: "Column",
      width: 150,
    },
  ];
  const rows = dfProcessed.map((row, index) => ({
    id: index + 1,
    ...row,
  }));
  const paginationModel = { page: 0, pageSize: 20 };

  return (
    <div>
      <h3>Raw Data</h3>
      <Paper>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[20, 50, 100, 500]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </div>
  );
};
