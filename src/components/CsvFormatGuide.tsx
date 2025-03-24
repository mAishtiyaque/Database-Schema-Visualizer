
const CsvFormatGuide = () => {
  return (
    <div className="csv-format-container">
      <h3>CSV File Format</h3>
      <p>Your CSV file should have the following format:</p>

      <table className="csv-table">
        <thead>
          <tr>
            <th>Database</th>
            <th>Table</th>
            <th>Column</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>DatabaseA</td>
            <td>Table1</td>
            <td>Column1</td>
          </tr>
          <tr>
            <td>DatabaseA</td>
            <td>Table1</td>
            <td>Column2</td>
          </tr>
          <tr>
            <td>DatabaseA</td>
            <td>Table2</td>
            <td>Column1</td>
          </tr>
          <tr>
            <td>...</td>
            <td>...</td>
            <td>...</td>
          </tr>
        </tbody>
      </table>

      <p className="csv-note">
        Make sure your CSV file has headers named <b>'Database'</b>, <b>'Table'</b>, and <b>'Column'</b>.
      </p>
    </div>
  );
};

export default CsvFormatGuide;
