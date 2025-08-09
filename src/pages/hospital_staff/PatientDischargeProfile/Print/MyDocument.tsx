import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  // Image,
} from "@react-pdf/renderer";
import Symptoms from "./Symptoms";
import Vitals from "./Vitals";
import TreatmentPlan from "./TreatmentPlan";
import MedicalHistory from "./MedicalHistory";
import Summary from "./Summary";
import { getAge } from "../../../../utility/global";
import {
  Alerttype,
  PatientType,
  medicalHistoryFormType,
  symptompstype,
  vitalFunctionType,
} from "../../../../types";
import { Reminder } from "../../../../store/zustandstore";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d9fffc",
    borderRadius: 20,
    padding: 10,
    width: "90%",
    height: 150,
  },
  container2: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d9fffc",
    borderRadius: 20,
    padding: 10,
    width: "90%",
    height: 80,
  },
  name: {
    fontSize: 25,
    fontWeight: "bold",
    color: "blue",
  },
  info: {
    marginTop: 10,
    fontSize: 12,
  },
  circleContainer: {
    width: 90,
    height: 90,
    marginLeft: 100,
  },
  circle: {
    width: 90,
    height: 90,
    borderRadius: 60,
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 60,
  },
  additionalInfo: {
    marginTop: 10,
    fontSize: 12,
  },
  horizontalLine: {
    borderTopWidth: 3,
    width: "80%",
    borderColor: "blue",
    marginTop: 20,
    marginLeft: "auto",
    marginRight: "auto",
  },
});
type dataType = {
  reminder: Reminder[];
  medicalHistory: medicalHistoryFormType | null;
  symptoms: symptompstype[];
  vitalAlert: Alerttype[];
  vitalFunction: vitalFunctionType | null;
};
type propType = {
  currentPatient: PatientType;
  data: dataType;
};
const MyDocument = ({ currentPatient, data }: propType) => {
  console.log("data new", data);
  return (
    <Document>
      <Page size="A4">
        <View>
          <Text
            style={{
              textAlign: "center",
              marginTop: 50,
              marginBottom: 20,
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            Patient Medical Report
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 60,
            }}
          >
            <View style={styles.container}>
              <View>
                <Text style={styles.name}>{currentPatient.pName}</Text>
                <Text style={styles.info}>
                  UHID No: {currentPatient.pUHID} | Patient ID:{" "}
                  {currentPatient.pID}
                </Text>
                <Text style={styles.info}>
                  Admission Date:{" "}
                  {new Date(currentPatient.startTime).toLocaleDateString(
                    "en-GB"
                  )}
                </Text>
                {/* <Text style={styles.info}>
                 Date : 25 June, 2023, 10:40 AM IST
              </Text> */}
                {/* <Text style={styles.info}>
                Reason of Discharge: Patient fully recovered
              </Text> */}
              </View>
              <View style={{ marginRight: 10 }}>
                <View style={styles.circleContainer}>
                  {/* <View style={styles.circle}>
                  <Image
                    style={styles.image}
                    src={{
                      uri: "I DO.jpg",
                    }}
                  />
                  <Image style={styles.image} src={imageUrl} />
                </View> */}
                </View>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", marginLeft: 70, marginTop: 10 }}>
            <View style={{ flex: 1 }}>
              {/* <Text style={styles.additionalInfo}>Father Given Name</Text> */}
              <Text style={styles.additionalInfo}>
                Gender: {currentPatient.gender == 1 ? "Male" : "Female"}
              </Text>
              <Text style={styles.additionalInfo}>
                Age:{" "}
                {currentPatient.dob ? getAge(currentPatient.dob) : "No Data"}
              </Text>
              <Text style={styles.additionalInfo}>
                Weight: {currentPatient.weight} kg
              </Text>
              <Text style={styles.additionalInfo}>
                Height: {currentPatient.height} CM
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.additionalInfo}>
                Email ID: {currentPatient.email || "No Data"}
              </Text>
              <Text style={styles.additionalInfo}>
                Contact: +91 {currentPatient.phoneNumber || "No Data"}
              </Text>
              <Text style={styles.additionalInfo}>
                Address: {currentPatient.address},
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 60,
              marginTop: 20,
            }}
          >
            <View style={styles.container2}>
              <View style={{ flex: 1 }}>
                <Text style={styles.info}>
                  Doctor {currentPatient.doctorName}
                </Text>
                <Text style={styles.info}>
                  Department{" "}
                  {currentPatient.department &&
                    currentPatient.department?.slice(0, 1).toUpperCase() +
                      currentPatient.department?.slice(1).toLowerCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.info}>
                  Referred by: {currentPatient.referredBy}
                </Text>
                {/* <Text style={styles.info}>Dr.Name</Text> */}
              </View>
            </View>
          </View>
          <View style={styles.horizontalLine}></View>
          {data.symptoms.length ? <Symptoms symptoms={data.symptoms} /> : ""}
        </View>
        {/* </Page>
      <Page size="A4"> */}
        <Vitals
          vitalAlert={data.vitalAlert}
          vitalFunction={data.vitalFunction}
        />
        {data.reminder.length ? (
          <TreatmentPlan medicineReminder={data.reminder} />
        ) : (
          ""
        )}
        {/* </Page>
      <Page size="A4"> */}
        {data.medicalHistory ? (
          <MedicalHistory medicalHistory={data.medicalHistory} />
        ) : (
          ""
        )}

        {/* </Page>
      <Page size="A4"> */}
        <Summary
          medicalHistory={data.medicalHistory}
          currentPatient={currentPatient}
        />
      </Page>
    </Document>
  );
};
export default MyDocument;
