// import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  section: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  table: {
    width: "auto",
    borderCollapse: "collapse",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCellHeader: {
    backgroundColor: "#F1EBEB",
    padding: 10,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderBottomStyle: "solid",
    width: "25%",
    textAlign: "center",
    fontSize: 10,
  },
  tableCell: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderBottomStyle: "solid",
    width: "25%",
    textAlign: "center",
    fontSize: 10,
  },
  noteContainer: {
    marginTop: 10,
  },
  noteHeader: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 10,
  },
  noteList: {
    paddingLeft: 15,
    marginBottom: 10,
    fontSize: 10,
  },
});

// Sample data
const medicalTestReportData = [
  {
    maintestname: "Total Leucocyte Count (TLC)",
    showReports: [
      {
        testname: "Total Leucocyte Count (TLC)",
        results: "15",
        units: "g/dl",
        interval: "13.0 - 17.0",
      },
    ],
  },
  {
    maintestname: "Complete Blood Count",
    showReports: [
      {
        testname: "Hemoglobin",
        results: "15",
        units: "g/dl",
        interval: "13.0 - 17.0",
      },
      {
        testname: "Packed cell Volume",
        results: "15",
        units: "g/dl",
        interval: "13.0 - 17.0",
      },
      {
        testname: "RBC Count",
        results: "15",
        units: "g/dl",
        interval: "13.0 - 17.0",
      },
      {
        testname: "MCH",
        results: "15",
        units: "g/dl",
        interval: "13.0 - 17.0",
      },
      {
        testname: "MCV",
        results: "15",
        units: "g/dl",
        interval: "13.0 - 17.0",
      },
    ],
  },
  {
    maintestname: "Differential Leucocyte Count (DLC)",
    showReports: [
      {
        testname: "Segmented Neutrophils",
        results: "15",
        units: "g/dl",
        interval: "13.0 - 17.0",
      },
      {
        testname: "Lymphocytes",
        results: "15",
        units: "g/dl",
        interval: "13.0 - 17.0",
      },
      {
        testname: "Monocytes",
        results: "15",
        units: "g/dl",
        interval: "13.0 - 17.0",
      },
      {
        testname: "Eosinophils",
        results: "15",
        units: "g/dl",
        interval: "13.0 - 17.0",
      },
    ],
  },
  {
    maintestname: "Absolute Leucocyte Count (ALC)",
    showReports: [
      {
        testname: "MCV",
        results: "15",
        units: "g/dl",
        interval: "13.0 - 17.0",
      },
      {
        testname: "MCV",
        results: "15",
        units: "g/dl",
        interval: "13.0 - 17.0",
      },
      {
        testname: "MCV",
        results: "15",
        units: "g/dl",
        interval: "13.0 - 17.0",
      },
      {
        testname: "MCV",
        results: "15",
        units: "g/dl",
        interval: "13.0 - 17.0",
      },
    ],
  },
  {
    maintestname: "Platelet Count",
    showReports: [
      {
        testname: "Platelet Count",
        results: "200",
        units: "thou/mm3",
        interval: "13.0 - 17.0",
      },
    ],
  },
  {
    maintestname: "Mean Platelet Count",
    showReports: [
      {
        testname: "Mean Platelet Volume",
        results: "200",
        units: "thou/mm3",
        interval: "13.0 - 17.0",
      },
    ],
  },
];

const TestReport2PDF = () => (
  <>
    <View style={styles.section}>
      <Text style={styles.heading}>Test Report</Text>
    </View>

    {medicalTestReportData.map((each, index) => (
      <View key={index} style={styles.section}>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellHeader}>Test Name</Text>
            <Text style={styles.tableCellHeader}>Results</Text>
            <Text style={styles.tableCellHeader}>Units</Text>
            <Text style={styles.tableCellHeader}>Bio. Ref. Interval</Text>
          </View>

          {each.showReports.map((report, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.tableCell}>{report.testname}</Text>
              <Text style={styles.tableCell}>{report.results}</Text>
              <Text style={styles.tableCell}>{report.units}</Text>
              <Text style={styles.tableCell}>{report.interval}</Text>
            </View>
          ))}
        </View>
      </View>
    ))}

    <View style={styles.noteContainer}>
      <Text style={[styles.heading, { marginBottom: 5 }]}>Note</Text>
      <View style={styles.noteList}>
        <Text>
          As Per the recommendation of International Council for Standardization
          in Hematology, the differential Leukocyte counts are additionally
          being reported as absolute numbers of each cell in unit volume of
          blood
        </Text>
      </View>
      <View style={styles.noteList}>
        <Text>Test Conducted On DETA whole Blood</Text>
      </View>
    </View>
  </>
);

const TestReport2 = () => (
  <div className="body-content">
    <hr className="hr-line" />
    <div className="mt-3 bg-white">
      <TestReport2PDF />
    </div>
  </div>
);

export default TestReport2;
