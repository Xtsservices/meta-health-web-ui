import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  section: {
    marginBottom: 10,
  },
  headerTextBgm: {
    fontWeight: "bold",
    fontSize: 12,
    backgroundColor: "#1977F3",
    color: "white",
    padding: "8px",
  },
  heading: {
    fontSize: 16, // Restricting to 10px
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
    padding: 5, // Adjusted for 10px text
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderBottomStyle: "solid",
    flex: 1, // Ensures cells stretch equally
    textAlign: "center", // Center align text for better readability
    fontSize: 10, // Ensuring 10px size for headers
  },
  tableCell: {
    padding: 5, // Adjusted for 10px text
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    borderBottomStyle: "solid",
    flex: 1, // Ensures cells stretch equally
    textAlign: "center", // Center align text for better readability
    fontSize: 10, // Ensuring 10px size for content
  },
  textAreaContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: 10,
  },
  textArea: {
    width: "100%",
    minHeight: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "solid",
    padding: 5,
    marginBottom: 10,
    fontSize: 10, // Ensuring text inside the text area is 10px
  },
});

// interface Medicine {
//   image: string;
//   name: string;
//   medicineName: string;
//   Dose: string;
//   days: number;
//   medicationTime: string;
// }

// const medicineData: Medicine[] = [
//   {
//     image: "./Assets/Capsule.png",
//     name: "Capsule",
//     medicineName: "Aspirin",
//     Dose: "50mg",
//     days: 5,
//     medicationTime: "After Lunch",
//   },
//   {
//     image: "./Assets/Capsule.png",
//     name: "Capsule",
//     medicineName: "Aspirin",
//     Dose: "50mg",
//     days: 5,
//     medicationTime: "After Lunch",
//   },
//   {
//     image: "./Assets/Syrups.png",
//     name: "Syrups",
//     medicineName: "Paracetamol",
//     Dose: "5ml",
//     days: 2,
//     medicationTime: "After Lunch",
//   },
//   {
//     image: "./Assets/Syrups.png",
//     name: "Syrups",
//     medicineName: "Aspirin",
//     Dose: "50mg",
//     days: 5,
//     medicationTime: "After Lunch",
//   },
//   {
//     image: "./Assets/Tablets.png",
//     name: "Tablets",
//     medicineName: "Aspirin",
//     Dose: "50mg",
//     days: 5,
//     medicationTime: "After Lunch",
//   },
//   {
//     image: "./Assets/Tablets.png",
//     name: "Tablets",
//     medicineName: "Aspirin",
//     Dose: "50mg",
//     days: 5,
//     medicationTime: "After Lunch",
//   },
//   {
//     image: "./Assets/Injection.png",
//     name: "Injection",
//     medicineName: "Aspirin",
//     Dose: "50mg",
//     days: 5,
//     medicationTime: "After Lunch",
//   },
// ];

const PreviousHistory = ({previousMedHistoryList}:any) => (
  <>
    <View style={styles.section}>
      <Text style={styles.headerTextBgm}>Previous History</Text>
    </View>

    <View style={styles.table}>
      <View style={styles.tableRow}>
        <Text style={styles.tableCellHeader}>Medicine name</Text>
        <Text style={styles.tableCellHeader}>No. days</Text>
        <Text style={styles.tableCellHeader}>Medication time</Text>
      </View>
      {previousMedHistoryList.map((each:any, index:number) => (
        <View style={styles.tableRow} key={index}>
          <Text style={styles.tableCell}>{each.medicineName}</Text>
          <Text style={styles.tableCell}>{each.daysCount}</Text>
          <Text style={styles.tableCell}>{each.medicationTime}</Text>
        </View>
      ))}
    </View>

    <View style={styles.textAreaContainer}>
      <View style={styles.textArea}>
        <Text>Enter your text here...</Text>
      </View>
    </View>
  </>
);

export default PreviousHistory;
