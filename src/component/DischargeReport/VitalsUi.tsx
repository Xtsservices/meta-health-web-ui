import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { symptompstype, testType, vitalFunctionType } from "../../types";

interface VitalsUiProps {
  symptoms: symptompstype[];
  vitalFunction: vitalFunctionType | null;
  selectedTestList: testType[];
  printSelectOptions: string[];
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    textAlign: "center",
  },
  bodyContent: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: "justify",
    width: "100%",
  },
  hrLine: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    width: "100%",
  },
  table: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 10,
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
  },
  tableCol: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    padding: 5,
    fontSize: 12,
  },
  tableHeader: {
    backgroundColor: "#d3d3d3",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 10,
  },
  headerTextBgm: {
    fontWeight: "bold",
    fontSize: 12,
    backgroundColor: "#1977F3",
    color: "white",
    padding: "8px",
  },
  cellText: {
    fontSize: 12,
    marginTop: "3px",
  },
  boldText: {
    fontWeight: "bold",
  },
  lighterText: {
    fontWeight: 100,
  },
});

const VitalsUi: React.FC<VitalsUiProps> = ({
  symptoms,
  vitalFunction,
  selectedTestList,
  printSelectOptions,
}) => {
  // Function to check if a section is in printSelectOptions
  const isSectionSelected = (section: string) => {
    return printSelectOptions.includes(section);
  };

  const renderVitalRow = (
    label: string,
    average: string | number,
    min: string | number,
    max: string | number
  ) => (
    <View key={label} style={styles.table}>
      <Text style={styles.headerText}>{label}</Text>
      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text style={[styles.tableCol, styles.headerText]}>Average</Text>
        <Text style={[styles.tableCol, styles.headerText]}>Minimum</Text>
        <Text style={[styles.tableCol, styles.headerText]}>Maximum</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCol}>{average}</Text>
        <Text style={styles.tableCol}>{min}</Text>
        <Text style={styles.tableCol}>{max}</Text>
      </View>
    </View>
  );

  return (
    <>
      {isSectionSelected("Symptoms") && symptoms?.length > 0 && (
        <View style={styles.bodyContent}>
          <Text style={styles.headerTextBgm}>Symptoms</Text>

          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCol, styles.headerText]}>Sr. No.</Text>
            <Text style={[styles.tableCol, styles.headerText]}>
              Symptom Name
            </Text>
            <Text style={[styles.tableCol, styles.headerText]}>Date</Text>
            <Text style={[styles.tableCol, styles.headerText]}>Time</Text>
          </View>

          {/* Handle Empty Test List */}
          {symptoms.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 10 }}>
              No symptoms available
            </Text>
          ) : (
            symptoms.map((symptom, index) => {
              const addedDate = new Date(symptom.addedOn);
              const formattedDate = addedDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
              const formattedTime = addedDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <View key={symptom.id} style={styles.tableRow}>
                  <Text style={styles.tableCol}>{index + 1}</Text>
                  <Text style={styles.tableCol}>{symptom.symptom}</Text>
                  <Text style={styles.tableCol}>{formattedDate}</Text>
                  <Text style={styles.tableCol}>{formattedTime}</Text>
                </View>
              );
            })
          )}
        </View>
      )}

      {isSectionSelected("Tests (Prescribed by Doctor)") && selectedTestList?.length > 0 && (
        <View style={styles.bodyContent}>
          <Text style={styles.headerTextBgm}>Tests</Text>

          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCol, styles.headerText]}>Sr. No.</Text>
            <Text style={[styles.tableCol, styles.headerText]}>Test Name</Text>
            <Text style={[styles.tableCol, styles.headerText]}>Date</Text>
            <Text style={[styles.tableCol, styles.headerText]}>Time</Text>
          </View>

          {/* Handle Empty Test List */}
          {selectedTestList.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 10 }}>
              No tests available
            </Text>
          ) : (
            selectedTestList.map((test, index) => {
              const addedDate = new Date(test.addedOn);
              const formattedDate = addedDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
              const formattedTime = addedDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <View key={test.id} style={styles.tableRow}>
                  <Text style={styles.tableCol}>{index + 1}</Text>
                  <Text style={styles.tableCol}>{test.test}</Text>
                  <Text style={styles.tableCol}>{formattedDate}</Text>
                  <Text style={styles.tableCol}>{formattedTime}</Text>
                </View>
              );
            })
          )}
        </View>
      )}

      {isSectionSelected("Vitals") && (
        <View style={styles.bodyContent}>
          <Text style={styles.headerTextBgm}>Vitals</Text>
          {vitalFunction && Object.keys(vitalFunction).length > 0 ? (
            <>
              {vitalFunction.pulse &&
                renderVitalRow(
                  "Pulse",
                  vitalFunction.pulse.avgPulse,
                  vitalFunction.pulse.minPulse,
                  vitalFunction.pulse.maxPulse
                )}
              {vitalFunction.temperature &&
                renderVitalRow(
                  "Temperature",
                  vitalFunction?.temperature?.avgTemperature?.toFixed(2),
                  vitalFunction?.temperature?.minTemperature?.toFixed(2),
                  vitalFunction?.temperature?.maxTemperature?.toFixed(2)
                )}
              {vitalFunction.oxygen &&
                renderVitalRow(
                  "Oxygen",
                  vitalFunction.oxygen.avgOxygen,
                  vitalFunction.oxygen.minOxygen,
                  vitalFunction.oxygen.maxOxygen
                )}
              {vitalFunction.bp &&
                renderVitalRow(
                  "Blood Pressure",
                  vitalFunction.bp.avgBp ?? "N/A",
                  vitalFunction.bp.minBp ?? "N/A",
                  vitalFunction.bp.maxBp ?? "N/A"
                )}
            </>
          ) : (
            <Text style={styles.cellText}>No vitals data available</Text>
          )}
        </View>
      )}
    </>
  );
};

export default VitalsUi;
