import { Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import brainIcon from "./../../../../../src/assets/medicalCondition/health1.png";
import headIcon from "./../../../../../src/assets/medicalCondition/health2.png";
import chestIcon from "./../../../../../src/assets/medicalCondition/health3.png";
import heartIcon from "./../../../../../src/assets/medicalCondition/health4.png";
import boneIcon from "./../../../../../src/assets/medicalCondition/health5.png";
import tobacoIcon from "./../../../../../src/assets/medicalCondition/tobbaco.png";
import drugIcon from "./../../../../../src/assets/medicalCondition/drugs.png";
import alcoholIcon from "./../../../../../src/assets/medicalCondition/whiskey1.png";
import lumpsIcon from "./../../../../../src/assets/medicalCondition/lumps.png";
import cancerIcon from "./../../../../../src/assets/medicalCondition/cancer.png";
import surgeryIcon from "./../../../../../src/assets/medicalCondition/SURGERY1.png";
import { medicalHistoryFormType } from "../../../../types";

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
  icon: {
    height: 20,
    width: 20,
  },
  icon2: {
    height: 30,
    width: 30,
  },
  container1: {
    alignItems: "flex-start",
    marginTop: 10,
    // flexDirection: "row",
    backgroundColor: "#d9fffc",
    borderRadius: 20,
    padding: 10,
    width: 250,
    // width: "auto",
    height: "auto",
  },
  container2: {
    alignItems: "flex-start",
    marginTop: 10,
    marginLeft: 10,
    // flexDirection: "row",
    backgroundColor: "#e1faf8",
    borderRadius: 20,
    padding: 10,
    width: 220,
    // width: "auto",
    height: "auto",
  },
  container3: {
    // alignItems: "flex-start",
    marginTop: 10,
    // flexDirection: "row",
    backgroundColor: "#e1faf8",
    borderRadius: 20,
    padding: 10,
    width: 250,
    // width: "auto",
    height: 100,
  },
  container4: {
    alignItems: "flex-start",
    flexDirection: "row",
    // width: "auto",
    marginLeft: 10,
    marginTop: 10,
    backgroundColor: "#f5e4f3",
    borderRadius: 20,
    padding: 10,
    width: 220,
    height: 100,
  },
  container5: {
    // alignItems: "flex-start",
    marginTop: 10,
    // flexDirection: "row",
    backgroundColor: "#faeede",
    borderRadius: 20,
    padding: 10,
    width: 250,
    // width: "auto",
    height: 100,
  },
  container6: {
    marginLeft: 10,
    marginTop: 10,
    backgroundColor: "#f5e4f3",
    borderRadius: 20,
    padding: 10,
    width: 220,
    height: 100,
  },
  bullet: {
    marginRight: 5,
    fontSize: 12,
  },
});
type propType = {
  medicalHistory: medicalHistoryFormType | null;
};
const Summary = ({ medicalHistory }: propType) => {
  // const dietList = [
  //   "Protein-rich foods",
  //   "Leafy vegetables",
  //   "Fruits",
  //   "Whole grains",
  //   "Healthy fats",
  // ];

  // const followUpDates = ["2023-08-10", "2023-08-15", "2023-08-20"];
  return (
    <div>
      <View style={{ flexDirection: "row", marginLeft: 60 }}>
        <View style={styles.container1}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 10 }}>Other Health Conditions</Text>
            <Text>
              <h3></h3>
            </Text>
          </View>
          <View style={{ marginTop: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image style={styles.icon} src={brainIcon} />
              <Text style={{ fontSize: 10 }}>
                Epilepsy or Neurological disorder?
              </Text>
            </View>
            <Text style={{ fontSize: 10 }}>
              {medicalHistory?.neurologicalDisorder || "No"}
            </Text>
            <br />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Image style={styles.icon} src={headIcon} />
              <Text style={{ fontSize: 10 }}>Any Mental Health Problems?</Text>
            </View>
            <Text style={{ fontSize: 10 }}>
              {medicalHistory?.mentalHealth || "No"}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Image style={styles.icon} src={chestIcon} />
              <Text style={{ fontSize: 10 }}>Chest</Text>
            </View>
            <Text style={{ fontSize: 10 }}>
              {medicalHistory?.chestCondition || "No"}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Image style={styles.icon} src={heartIcon} />
              <Text style={{ fontSize: 10 }}>Heart</Text>
            </View>
            <Text style={{ fontSize: 10 }}>
              {medicalHistory?.heartProblems || "No"}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Image style={styles.icon} src={boneIcon} />
              <Text style={{ fontSize: 10 }}>Any bone/Joint Disease?</Text>
            </View>
            <Text style={{ fontSize: 10 }}>{"No"}</Text>
          </View>
        </View>
        <View style={styles.container2}>
          <View>
            <Text style={{ fontSize: 10, marginTop: 5 }}>Addiction</Text>
            <View
              style={{
                marginTop: 20,
                flexDirection: "row",
                alignItems: "flex-end",
              }}
            >
              <View style={{ marginRight: 10 }}>
                <Image style={styles.icon2} src={tobacoIcon} />
                <Text style={{ fontSize: 10, textAlign: "center" }}>
                  Tobacco
                </Text>
                <Text style={{ fontSize: 10 }}>
                  {medicalHistory?.drugs.split(",").includes("Tobbaco")
                    ? "Yes"
                    : "No"}
                </Text>
              </View>
              <View style={{ marginRight: 10 }}>
                <Image style={styles.icon2} src={drugIcon} />
                <Text style={{ fontSize: 10, textAlign: "center" }}>Drugs</Text>
                <Text style={{ fontSize: 10 }}>
                  {medicalHistory?.drugs.split(",").includes("Drugs")
                    ? "Yes"
                    : "No"}
                </Text>
              </View>
              <View>
                <Image style={styles.icon2} src={alcoholIcon} />
                <Text style={{ fontSize: 10, textAlign: "center" }}>
                  Alcohol
                </Text>
                <Text style={{ fontSize: 10 }}>
                  {medicalHistory?.drugs.split(",").includes("Alcohol")
                    ? "Yes"
                    : "No"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: "row", marginLeft: 60 }}>
        <View style={styles.container3}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ marginTop: 5, fontSize: 15, fontWeight: 600 }}>
              Lumps Found?
            </Text>
            <Image style={styles.icon2} src={lumpsIcon} />
          </View>
          <Text style={{ fontSize: 10, marginLeft: 10, marginTop: 5 }}>
            {medicalHistory?.lumps ? "Yes" : "No"}
          </Text>
        </View>

        <View style={styles.container4}>
          <View style={{ flexDirection: "row" }}>
            <Image style={styles.icon} src={surgeryIcon} />
            <View>
              <Text style={{ fontSize: 10, marginRight: 5 }}>
                Any Self Prescribed Drugs/Medicines?
              </Text>

              <Text style={{ fontSize: 8, marginBottom: 5 }}>
                (including pain killers or recreational drugs)*
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* <Text style={styles.bullet}>•</Text> */}
                <Text style={{ fontSize: 10, marginLeft: 5 }}>
                  {" "}
                  <View
                    style={{ flexDirection: "column", alignItems: "center" }}
                  >
                    {medicalHistory?.meds
                      ? medicalHistory?.meds
                          .split(",")
                          .map((el) => (
                            <Text style={{ fontSize: 10, marginLeft: 5 }}>
                              {el}
                            </Text>
                          ))
                      : "No"}
                  </View>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: "row", marginLeft: 60 }}>
        <View style={styles.container5}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ marginTop: 5, fontSize: 15, fontWeight: 600 }}>
              Been Through Cancer?
            </Text>
            <Image style={styles.icon2} src={cancerIcon} />
          </View>
          <Text style={{ fontSize: 10, marginLeft: 10, marginTop: 5 }}>
            {medicalHistory?.cancer ? "Yes" : "No"}
          </Text>
        </View>
        <View style={styles.container6}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ marginTop: 5, fontSize: 15, fontWeight: 600 }}>
              Pregnant/Been Pregnant?
            </Text>
          </View>
          <Text style={{ fontSize: 10, marginLeft: 10, marginTop: 5 }}>
            {medicalHistory?.pregnant ? "Yes" : "No"}
          </Text>
        </View>
      </View>

      {/* <View style={styles.tableHeader}>
        <Text style={styles.headerText}> DISCHARGE SUMMARY</Text>
        <View style={{ flex: 1 }}></View>
      </View> */}
      {/* <View
        style={{ flexDirection: "row", alignItems: "center", marginLeft: 60 }}
      >
        <Text style={{ fontSize: 12, marginTop: 12 }}>Advice on Discharge</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 10,
            color: "grey",
            marginTop: 10,
            marginLeft: 60,
            marginRight: 50,
          }}
        >
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book
        </Text>
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginLeft: 60 }}
      >
        <View style={{ marginTop: 30 }}>
          <Text style={{ fontSize: 12, marginTop: 50 }}>Diet</Text>
          {dietList.map((item, index) => (
            <View
              style={{ flexDirection: "row", alignItems: "center" }}
              key={index}
            >
              <Text style={styles.bullet}>•</Text>
              <Text style={{ fontSize: 10, marginLeft: 5, marginTop: 5 }}>
                {item}
              </Text>
            </View>
          ))}
        </View>
        <View>
          <Text style={{ fontSize: 12, marginTop: 50, marginLeft: 200 }}>
            Follow up require
          </Text>
          {followUpDates.map((date, index) => (
            <Text
              style={{ fontSize: 10, marginLeft: 200, marginTop: 5 }}
              key={index}
            >
              • {date}
            </Text>
          ))}
        </View>
      </View> */}
    </div>
  );
};
export default Summary;
