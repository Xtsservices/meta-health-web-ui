import { Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import family1 from "./Assets/family-1.png";
import family2 from "./Assets/family-2.png";
import family3 from "./Assets/family-3.png";
import family from "./Assets/family.png";
import mother from "./Assets/mother.png";
import heartbroken from "./Assets/heart-broken.png";
import heartpluse from "./Assets/heart-pulse.png";
import brain from "./Assets/brain.png";
import fluentdrink from "./Assets/fluent-drink.png";
import iconpark from "./Assets/icon-park_brain.png";
import bonebroken from "./Assets/bone-broken.png";
import cancer from "./Assets/Frame 3593.png";
import lumps from "./Assets/Frame 3618.png";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
  },
  headerTextBgm: {
    fontWeight: "bold",
    fontSize: 12,
    backgroundColor: "#1977F3",
    color: "white",
    padding: "8px",
  },
  section: {
    marginBottom: 8,
  },
  heading: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
    fontWeight: "bold",
  },
  info: {
    marginBottom: 3,
    fontSize: 10,
  },
  label: {
    fontWeight: "bold",
    fontSize: 10,
  },
  gridContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
    position: "relative", // Allows for absolute positioning of the image
  },
  card: {
    width: "48%", // Occupy 48% of the width to allow for spacing
    height: 180, // Fixed height for all cards
    marginBottom: 10,
    padding: 10,
    borderRadius: 6, // Rounded corners
    color: "#fff", // Text color set to white
  },
  card1: {
    backgroundColor: "#95D5EA",
  },
  card2: {
    backgroundColor: "#F2B5F4",
  },
  card3: {
    backgroundColor: "#BAA5F8",
  },
  card4: {
    backgroundColor: "#67D1DD",
  },
  cardHeader: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#fff", // Ensuring header text is white as well
  },
  boxContainer: {
    display: "flex",
    flexDirection: "column", // Stack items vertically within each card
    justifyContent: "space-between",
  },
  box: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  image: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  li: {
    fontSize: 8,
    color: "#fff", // Text color set to white
  },
  underline: {
    textDecoration: "underline",
  },
  spacedText: {
    marginTop: 5, // Additional spacing for each item
    color: "#fff", // Text color set to white
  },
  humanImageContainer: {
    position: "absolute",
    top: "50%", // Vertical center relative to the container's height
    left: "50%", // Horizontal center relative to the container's width
    transform: "translate(-50%, -50%)", // Centering using translation
    zIndex: 10, // Ensures the image is above the cards
  },
  humanImage: {
    width: 80,
    height: 80,
  },
});
const MedicalHistory = ({ medicalHistory }: any) => (
  <>
    <View style={styles.section}>
      <Text style={styles.headerTextBgm}>Medical History</Text>
    </View>
    <View style={styles.section}>
      <Text style={styles.info}>
        <Text style={styles.label}>History Given By: </Text>{medicalHistory?.givenName}
      </Text>
      <Text style={styles.info}>
        <Text style={styles.label}>Mobile number: </Text>{medicalHistory?.givenPhone}
      </Text>
      <Text style={styles.info}>
        <Text style={styles.label}>Relation With patient: </Text>{medicalHistory?.givenRelation}
      </Text>
    </View>

    {/* Grid Container for the cards */}
    <View style={styles.gridContainer}>
      {/* Group 1 Card */}
      <View style={[styles.card, styles.card1]}>
        <Text style={styles.cardHeader}>
          Group 1: Specific Health Conditions
        </Text>
        <View style={styles.boxContainer}>
          {[
            {
              image: family1, text: "Hepatitis C ?", value: `${medicalHistory?.infections
                .split(",")
                .includes("Hepatitis C")
                ? "Yes"
                : "No"}`
            },
            {
              image: family2, text: "HIV ?", value: `${medicalHistory?.infections
                .split(",")
                .includes("HIV")
                ? "Yes"
                : "No"}`
            },
            {
              image: family3, text: "Hepatitis B ?", value: `${medicalHistory?.infections
                .split(",")
                .includes("Hepatitis B")
                ? "Yes"
                : "No"}`
            },
            { image: mother, text: "Pregnant", value: `${medicalHistory?.pregnant ? "Yes" : "No"}` },
          ].map((item, index) => (
            <View key={index} style={styles.box}>
              <Image style={styles.image} src={item.image} />
              <View>
                <Text style={styles.li}>{item.text}</Text>
                <Text style={[styles.li, styles.underline]}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Group 2 Card */}
      <View style={[styles.card, styles.card2]}>
        <Text style={styles.cardHeader}>
          Group 2: Neurological, Heart, and Addictions
        </Text>
        <View style={styles.boxContainer}>
          {[
            {
              image: brain,
              text: "Epilepsy or Neurological disorder ?",
              value: `${medicalHistory?.neurologicalDisorder ? "Yes" : "No"}`,
            },
            { image: heartpluse, text: "Heart ?", value: `${medicalHistory?.heartProblems ? "Yes" : "No"}` },
            { image: heartbroken, text: "Chest Pain ?", value: `${medicalHistory?.chestCondition ? "Yes" : "No"}` },
            { image: fluentdrink, text: "Any Addictions", value: `${medicalHistory?.drugs ? "Yes" : "No"}` },
          ].map((item, index) => (
            <View key={index} style={styles.box}>
              <Image style={styles.image} src={item.image} />
              <View>
                <Text style={styles.li}>{item.text}</Text>
                <Text style={[styles.li, styles.underline]}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Group 3 Card */}
      <View style={[styles.card, styles.card3]}>
        <Text style={styles.cardHeader}>
          Group 3: Mental Health and Physical Conditions
        </Text>
        <View style={styles.boxContainer}>
          {[
            {
              image: iconpark,
              text: "Any Mental Health Problems?",
              value: `${medicalHistory?.mentalHealth ? "Yes" : "No"}`,
            },
            { image: bonebroken, text: "Any bone/Joint Disease?", value: "No" },
            { image: cancer, text: "Been Through Cancer?", value: `${medicalHistory?.cancer ? "Yes" : "No"}` },
            { image: lumps, text: "Lumps found ?", value: `${medicalHistory?.lumps ? "Yes" : "No"}` },
          ].map((item, index) => (
            <View key={index} style={styles.box}>
              <Image style={styles.image} src={item.image} />
              <View>
                <Text style={styles.li}>{item.text}</Text>
                <Text style={[styles.li, styles.underline]}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Group 4 Card */}
      <View style={[styles.card, styles.card4]}>
        <Text style={styles.cardHeader}>Group 4: Known Family Diseases</Text>
        <View style={styles.boxContainer}>
          <View style={styles.box}>
            <Image style={styles.image} src={family} />
            <View>
              <Text style={styles.li}>Any Known Diseases In Family?</Text>
              {["Father", "Mother", "Siblings"].map((relative, index) => (
                <Text
                  key={index}
                  style={[styles.li, styles.underline, styles.spacedText]}
                >
                {relative}: {medicalHistory?.hereditaryDisease?.includes(relative) ? "Yes" : "No"}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Human Image at the center of the four cards */}
      {/* <View style={styles.humanImageContainer}>
        <Image style={styles.humanImage} src={human} />
      </View> */}
    </View>
  </>
);

export default MedicalHistory;
