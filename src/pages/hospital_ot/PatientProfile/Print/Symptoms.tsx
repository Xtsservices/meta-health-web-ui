import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { symptompstype } from "../../../../types";

const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3c54f0",
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
    padding: 5,
    marginTop: 20,
  },
  headerText: {
    fontSize: 12,
    color: "white",
  },
  symptomsContainer: {
    marginTop: 10,
    marginLeft: 60,
  },
  symptom: {
    fontSize: 12,
    marginBottom: 5,
  },
});

// const symptoms = [
//   "Fever",
//   "Throat infection",
//   "Headache",
//   "Cold and cough",
//   "Fever",
//   "Throat infection",
//   "Headache",
//   "Cold and cough",
//   "Fever",
//   "Throat infection",
// ];

type propType = {
  symptoms: symptompstype[];
};
const Symptoms = ({ symptoms }: propType) => {
  // const maxSymptomsPerPage = 16;
  // const firstPageSymptoms = symptoms.slice(0, maxSymptomsPerPage);
  // const remainingSymptoms = symptoms.slice(maxSymptomsPerPage);
  // console.log("new symanajkns", symptoms);
  return (
    <View>
      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>SYMPTOMS</Text>
        <View style={{ flex: 1 }}></View>
      </View>
      <View style={styles.symptomsContainer}>
        {symptoms?.slice(0, 16)?.map((symptom, index) => (
          <Text key={index} style={styles.symptom}>
            {symptom.symptom.slice(0, 1).toUpperCase() +
              symptom.symptom.slice(1).toLowerCase()}
          </Text>
        ))}
      </View>

      {symptoms?.slice(16)?.length > 0 && (
        <View>
          <View style={styles.tableHeader}>
            <Text style={styles.headerText}>SYMPTOMS</Text>
            <View style={{ flex: 1 }}></View>
          </View>
          <View style={styles.symptomsContainer}>
            {symptoms?.slice(16)?.map((symptom, index) => (
              <Text key={index} style={styles.symptom}>
                {symptom.symptom.slice(0, 1).toUpperCase() +
                  symptom.symptom.slice(1).toLowerCase()}
              </Text>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};
export default Symptoms;
