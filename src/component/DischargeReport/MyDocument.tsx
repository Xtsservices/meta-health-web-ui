import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
// import QRCode from "qrcode.react";
import MedicalHistory from "./MedicalHistory";
import hospitallogo from "./Assets/hospitallogo.png";
import Treatmentplan from "./Treatmentplan";
import PerviousHistory from "./PerviousHistory";
import TestReport from "./TestReport";
import TestReport2 from "./TestReport2";
import VitalsUi from "./VitalsUi";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
import { Reminder } from "../../store/zustandstore";
import {
  Alerttype,
  PatientType,
  attachmentType,
  medicalHistoryFormType,
  symptompstype,
  testType,
  vitalFunctionType,
} from "../../types";
// import PdfViewer from "./PdfViewer";

// Define the patient and data interfaces
// interface Patient {
//   pID: string;
//   pName: string;
//   dob: string | null;
//   gender: number | null;
//   startTime: string;
//   endTime: string;
//   department?: string | null | undefined;
//   wardID?: number; // Optional field, adjusted type to number
//   referredBy?: string | null; // Optional field
//   address?: string | null; // Optional field;
//   hospitalID: number |null;
//   deviceID?: number | null; // Optional field
//   pUHID: number|null;
//   ptype: number|null;
//   category: number|null;
//   zone?: string | null; // Optional field
//   weight?: number|null;
//   height?: number|null;
//   phoneNumber?: number|null;
//   email?: string|null;
//   insurance: number;
//   insuranceNumber?: string | null; // Optional field
//   insuranceCompany?: string | null; // Optional field
//   city?: string|null;
//   state?: string|null;
//   pinCode?: string|null;
//   photo?: string | null; // Optional field
//   patientTimeLineID?: number|undefined;
//   dischargeType?: number | undefined; // Optional field
//   diet?: string | null; // Optional field
//   advice?: string | null; // Optional field
//   followUp?: string | null; // Optional field
//   icd?: string | null; // Optional field
//   followUpStatus?: string | null; // Optional field
//   followUpDate?: string | null; // Optional field
//   followUpAddedOn?: string | null; // Optional field
//   imageURL?: string | null; // Optional field
//   doctorName?: string|undefined;
// }

// interface VitalData {
//   time: string;
//   bodyTemperature: number;
//   systolicBP: number;
//   heartRate: number;
//   diastolicBP: number;
//   respiratoryRate: number;
// }

interface Data {
  reminder: Reminder[];
  medicalHistory: medicalHistoryFormType | null;
  symptoms: symptompstype[];
  vitalAlert: Alerttype[];
  vitalFunction: vitalFunctionType | null;
  reports?: attachmentType[];
  selectedTestList: testType[];
  previousMedHistoryList: any[];
}

// Define the props interface for MyDocument
interface MyDocumentProps {
  currentPatient: PatientType;
  data: Data;
  printSelectOptions: string[];
}

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 30,
    border: "1px solid #ccc",
    backgroundColor: "white",
    position: "relative",
    minHeight: "100%",
  },
  hrLine: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    width: "100%",
  },
  header: {
    fontSize: 12,
    color: "grey",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  footer: {
    textAlign: "center",
    fontSize: 10,
    color: "grey",
  },
  footerBoldText: {
    fontSize: 10,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  dischargeReportHeading: {
    fontSize: 16,
    color: "#1F7AF3",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  headerLogo: {
    width: 70,
    height: 70,
    objectFit: "cover",
  },
  patientDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    border: "1px solid #ccc",
  },
  column: {
    flex: "0 0 48%",
    padding: 10,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 10,
    marginBottom: 5,
  },
  qrCodeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  qrCode: {
    width: 100,
    height: 100,
    marginLeft: 10,
  },
});

const MyDocument: React.FC<MyDocumentProps> = ({
  currentPatient,
  data,
  printSelectOptions,
}) => {
  const {
    reminder,
    symptoms,
    vitalFunction,
    selectedTestList,
    medicalHistory,
    previousMedHistoryList,
    // reports,
  } = data;

  console.log("datavitals",data)

  function calculateAge(dob: string): string {
    if (dob === "") return ""; // Handle empty input as needed

    const birthDate: Date = new Date(dob);
    const currentDate: Date = new Date();

    // Calculate the difference in years
    const ageYears: number =
      currentDate.getFullYear() - birthDate.getFullYear();

    // Calculate the difference in months
    let ageMonths: number =
      currentDate.getMonth() + 1 - (birthDate.getMonth() + 1);
    if (ageMonths < 0) {
      ageMonths += 12;
    }

    // Calculate the difference in days
    const ageDays: number = Math.floor(
      (currentDate.getTime() - birthDate.getTime()) / (1000 * 3600 * 24)
    );

    // Determine the age category based on the calculated differences
    if (ageYears >= 1) {
      return `${ageYears} year(s)`;
    } else if (ageMonths >= 1) {
      return `${ageMonths} month(s)`;
    } else {
      return `${ageDays} day(s)`;
    }
  }

  function getGender(genderCode: number): string {
    const genderList = [
      { value: "Male", key: 1 },
      { value: "Female", key: 2 },
      { value: "Others", key: 3 },
    ];
    const genderValue = genderList.find((each) => each.key === genderCode);
    return genderValue ? genderValue.value : "";
  }

  function formatDateTime(isoString: string): string {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const datePart = date.toLocaleDateString("en-GB", options).split(",")[0];
    const timePart = date.toLocaleTimeString("en-GB", options).split(", ")[1];
    return `${datePart} ${timePart}`;
  }

  function formatDateTime2(isoString: string): string {
    const date = new Date(isoString);

    // Convert UTC to IST (+5:30 hours)
    const ISTOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const istDate = new Date(date.getTime() + ISTOffset); // Add extra 5:30 if needed

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return istDate.toLocaleString("en-GB", options);
  }

  const patientDetails = (): {
    reportID: string;
    consultant: string;
    admissionNo: string;
    patientName: string;
    patientID: string;
    dateOfAdmission: string;
    dischargeDate: string;
    department: string;
    age: string;
    Gender: string;
    admittedWard: string | number | undefined;
    referral: string;
    address?: string | null; // Optional field;
  } => ({
    reportID: "FB2309029", // Example data, replace with actual
    consultant: currentPatient?.doctorName || "", // Example data, replace with actual
    admissionNo: "IP940", // Example data, replace with actual
    patientName: currentPatient.pName,
    patientID: currentPatient.pID,
    dateOfAdmission: formatDateTime(currentPatient.startTime),
    dischargeDate: formatDateTime2(currentPatient.endTime),
    department: currentPatient.department || "Unknown Department",
    age: calculateAge(currentPatient.dob || "") || "",
    Gender: getGender(currentPatient.gender || 1), // Assuming default male if gender is not provided
    admittedWard:
      currentPatient.wardID !== null ? currentPatient.wardID : "SICU / SICU03",
    referral: currentPatient.referredBy || "WALKIN",
    address: currentPatient.address,
  });

  const details = patientDetails();

  const BodyUI: React.FC = () => {
    return (
      <>
        {printSelectOptions.includes("Symptoms") ||
        printSelectOptions.includes("Tests (Prescribed by Doctor)") ||
        printSelectOptions.includes("Vitals") ? (
          <VitalsUi
            symptoms={symptoms}
            vitalFunction={vitalFunction}
            selectedTestList={selectedTestList}
            printSelectOptions={printSelectOptions}
          />
        ) : null}
        {printSelectOptions.includes("Treatments") ? (
          <Treatmentplan reminder={reminder} />
        ) : null}
        {printSelectOptions.includes("MedicalHistory") ? (
          <>
            <MedicalHistory medicalHistory={medicalHistory} />
            <PerviousHistory previousMedHistoryList={previousMedHistoryList} />
          </>
        ) : null}
        {printSelectOptions.includes(
          "Reports (Test Results and Previous Reports)"
        ) ? (
          <>
            <TestReport />
            <TestReport2 />
          </>
        ) : null}
      </>
    );
  };


  // const handleQRScan = () => {
  //   const capture = document.querySelector(".actual-recept");
  //   if (capture) {
  //     html2canvas(capture as HTMLElement).then((canvas) => {
  //       const imageData = canvas.toDataURL("image/png");
  //       const doc = new jsPDF("p", "mm", "a4");
  //       const componentHeight = doc.internal.pageSize.getHeight();
  //       const componentWidth = doc.internal.pageSize.getWidth();
  //       doc.addImage(imageData, "PNG", 0, 0, componentWidth, componentHeight);
  //       doc.save("receipt.pdf");
  //     });
  //   }
  // };

 
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <View style={styles.header}>
            <Text style={styles.dischargeReportHeading}>DISCHARGE REPORT</Text>
            <Image src={hospitallogo} style={styles.headerLogo} />
          </View>

          <View style={styles.patientDetailsContainer}>
            <View style={styles.column}>
              <Text style={styles.infoLabel}>
                Report ID: {details.reportID}
              </Text>
              <Text style={styles.infoLabel}>
                Patient Name: {details.patientName}
              </Text>
              <Text style={styles.infoLabel}>
                Patient ID: {details.patientID}
              </Text>
              <Text style={styles.infoLabel}>
                Date Of Admission: {details.dateOfAdmission}
              </Text>
              <Text style={styles.infoLabel}>
                Consultant: {details.consultant}
              </Text>
              <Text style={styles.infoLabel}>
                Department: {details.department}
              </Text>
              <Text style={styles.infoLabel}>
                Admission No: {details.admissionNo}
              </Text>
            </View>
            <View style={styles.column}>
              {currentPatient.ptype === 21 && (
                <Text style={styles.infoLabel}>
                  Discharge Date: {details.dischargeDate}
                </Text>
              )}

              <Text style={styles.infoLabel}>
                Age / Sex: {details.age} / {details.Gender}
              </Text>

              <Text style={styles.infoLabel}>
                Admitted Ward: {details.admittedWard}
              </Text>
              <Text style={styles.infoLabel}>Referral: {details.referral}</Text>
              <Text style={styles.infoLabel}>Address: {details.address}</Text>
            </View>
          </View>

          <BodyUI />

          <View style={styles.footer}>
            <Text>
              301, Gowra Tulips, Survey No 14 and 15, Gafoor Nagar,
              Hyderabad-500081, Telangana, info.rainbow@.com, 040-35855589
              (Landline)
            </Text>
            <View style={styles.hrLine} />
            <View style={styles.qrCodeContainer}>
              <Text style={styles.footerBoldText}>
                Powered By Yantram Medtech pvt Ltd, © All rights reserved 2025
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
