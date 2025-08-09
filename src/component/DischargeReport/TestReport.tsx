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
    width: "calc(100% / 4)",
    textAlign: "center",
    fontSize: 10, // Added font size restriction here
  },
  tableCell: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderBottomStyle: "solid",
    width: "calc(100% / 4)",
    textAlign: "center",
    fontSize: 10, // Added font size restriction here
  },
});

interface Report {
  testname: string;
  results: string;
  units: string;
  interval: string;
}

interface MedicalTest {
  maintestname: string;
  showReports: Report[];
}

const medicalTestReportData: MedicalTest[] = [
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

const TestReport = () => (
  <>
    <View style={styles.section}>
      <Text style={styles.heading}>Test Report</Text>
    </View>

    {medicalTestReportData.map((each, index) => (
      <View key={index} style={styles.section}>
        <View style={styles.tableRow}>
          <Text
            style={[
              styles.tableCell,
              {
                width: "100%",
                fontWeight: "bold",
                backgroundColor: "#F1EBEB",
                fontSize: 10,
              },
            ]}
          >
            {each.maintestname}
          </Text>
        </View>

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
    ))}
  </>
);

export default TestReport;
