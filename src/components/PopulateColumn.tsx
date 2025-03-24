import React from "react";
import { Column } from "./utls";
interface Props {
  columns: Column[];
}
export const PopulateColumn: React.FC<Props> = ({ columns }) => {
  return (
    <table className="table">
      <tbody>
        {columns.map((col, colIndex) => (
          <tr key={colIndex}>
            <td>{col.column_name}</td>
            <td className="data-type">INT</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
