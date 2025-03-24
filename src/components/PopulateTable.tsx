import React from "react";
import { Table } from "./utls";
import { PopulateColumn } from "./PopulateColumn";
interface Props {
  tables: Table[];
}
export const PopulateTable: React.FC<Props> = ({ tables }) => {
  return (
    <div className="table-container">
      {tables.map((tb, tbIndex) => {
        return (
          <div key={tbIndex} className="table">
            <div className="table-header">
              <span>{tb.table_name}</span>
            </div>
            <PopulateColumn columns={tb.columns} />
          </div>
        );
      })}
    </div>
  );
};
