import React, { useEffect, useState } from "react";
//import { Tab, Tabs } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { FileUploader } from "react-drag-drop-files";
import Papa from "papaparse";
import Plotly from "react-plotly.js";
import {
  getStructuredData,
  processCsv,
  SchemaData,
  Database,
} from "./utls";
import "./css.css";

import { PopulateDatabase } from "./PopulateDatabase";
import { RawData } from "./RawData";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary/AccordionSummary";
import Typography from "@mui/material/Typography/Typography";
import AccordionDetails from "@mui/material/AccordionDetails/AccordionDetails";
import CsvFormatGuide from "./CsvFormatGuide";
// Types for CSV data and processed data
const csvUrl = "/Database-Schema-Visualizer/DB.csv";
export interface ProcessedData {
  databases: string[];
  tables: string[];
  columns: string[];
  dfProcessed: SchemaData[];
}

const DatabaseSchemaVisualizer: React.FC = () => {
  const [structuredData, setStructuredData] = useState<Database[]>([]);

  const [processedData, setProcessedData] = useState<ProcessedData>({
    databases: [],
    tables: [],
    columns: [],
    dfProcessed: [],
  });

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    Papa.parse(file, {
      complete: async (result: any) => {
        const [databases, tables, columns, dfProcessed] = processCsv(
          result.data as SchemaData[]
        );
        setStructuredData(getStructuredData(dfProcessed));
        setProcessedData({ databases, tables, columns, dfProcessed });
      },
      header: true,
    });
  };
  const handleLocalCSV = async () => {
    try {
      const response = await fetch(csvUrl);
      const blob = await response.blob();
      const file = new File([blob], "sample.csv", { type: "text/csv" });
      handleFileUpload(file);
    } catch (error) {
      console.error("Error loading the CSV file:", error);
    }
  };
  useEffect(() => {
    handleLocalCSV();
  }, []);

  return (
    <div className="container">
      <h1>Database Schema Visualizer</h1>
      <p>Upload a CSV file to visualize the database schema.</p>

      {/* File Upload */}
      <div className="upload-container">
        <FileUploader
          handleChange={handleFileUpload}
          name="file"
          types={["csv"]}
        />
        <Accordion>
          <AccordionSummary
            expandIcon={"▼"}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography component="span">CSV File Format</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
             <CsvFormatGuide/>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
      <br />
      {/* Tabs for different sections */}
      <Tabs
        defaultActiveKey="schema"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="schema" title="Schema Diagram">
          <PopulateDatabase
            structuredData={structuredData}
            processedData={processedData}
          />
        </Tab>

        <Tab eventKey="stats" title="Statistics">
          <h3>Database Statistics</h3>
          {/* Display summary and charts */}
          <div>
            <div>Databases: {processedData?.databases?.length}</div>
            <div>Tables: {processedData?.tables?.length}</div>
            <div>Columns: {processedData?.columns?.length}</div>
          </div>

          {/* Example Chart (you would replace with real stats data) */}
          <Plotly
            data={
              [
                /* Chart data */
              ]
            }
            layout={{ title: "Tables per Database" }}
          />
        </Tab>

        <Tab eventKey="raw" title="Raw Data">
          <RawData dfProcessed={processedData.dfProcessed} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default DatabaseSchemaVisualizer;
