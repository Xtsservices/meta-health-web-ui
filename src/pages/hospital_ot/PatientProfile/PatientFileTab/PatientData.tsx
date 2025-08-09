import MedicalHistory from "./PatientFileTabItems/MedicalExaminationHistory/MedicalHistory";
import Reports from "./PatientFileTabItems/Reports/Reports";
import SymptomsOT from "./PatientFileTabItems/Symptoms/Symptoms";
import Vitals from "../../../../component/PatientProfile/Tabs/VitalsTab/VitalsTab";
import MedicationSelector from "../../../../component/PatientProfile/Tabs/TreatmentTab/TreatmentTab";

const dataPatientFile = [
  { id: 1, text: "Symptoms", value: <SymptomsOT /> },
  { id: 2, text: "Vitals", value: <Vitals /> },
  {
    id: 3,
    text: "Medications",
    value: <MedicationSelector />,
  },
  { id: 4, text: "Medical Examination History", value: <MedicalHistory /> },
  { id: 5, text: "Test Reports", value: <Reports /> },
];
export default dataPatientFile;
