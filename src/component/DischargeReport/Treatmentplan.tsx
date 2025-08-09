import { Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { medicineCategory } from "../../utility/medicine";
import Capsule from "./Assets/Capsule.png";
import Syrups from "./Assets/Syrups.png";
import Tablets from "./Assets/Tablets.png";
import Injection from "./Assets/Injection.png";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  section: {
    marginBottom: 10,
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: "5px",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 10,
    fontWeight: "bold",
  },
  tableImage: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  headerTextBgm: {
    fontWeight: "bold",
    fontSize: 12,
    backgroundColor: "#1977F3",
    color: "white",
    padding: "8px",
  },
});

const Treatmentplan = ({ reminder }: any) => {

  function getUnit(medicineType: number) {
    switch (medicineType) {
      case medicineCategory.capsules:
      case medicineCategory.tablets:
        return "mg";
      case medicineCategory.Tubing:
        return "g";
      default:
        return "ml";
    }
  }

  function getimage(medicineType: number) {
    switch (medicineType) {
      case medicineCategory.capsules:
        return <Image style={styles.tableImage} src={Capsule} />;

      case medicineCategory.tablets:
        return <Image style={styles.tableImage} src={Tablets} />;

      case medicineCategory.injections:
        return <Image style={styles.tableImage} src={Injection} />;

      case medicineCategory.syrups:
        return <Image style={styles.tableImage} src={Syrups} />;

      default:
        return "";
    }
  }

  return (
    
    <>
      <View style={styles.section}>
        <Text style={styles.headerTextBgm}>Treatment Plan</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellHeader}></Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellHeader}>Medicine name</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellHeader}>Dose</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellHeader}>No. days</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellHeader}>Medication time</Text>
          </View>
        </View>

        {reminder.map((each: any, index: number) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <View style={styles.tableCell}>
                {getimage(each.medicineType)}
              </View>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{each.medicineName}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {each?.doseCount ? each.doseCount : ""}{" "}
                {getUnit(each.medicineType)}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {each?.daysCount ? each?.daysCount : ""} days
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{each.medicationTime}</Text>
            </View>
          </View>
        ))}
      </View>
    </>
  );
};

export default Treatmentplan;
