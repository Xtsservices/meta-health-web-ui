import MedicationSelector from "../../../../component/MedicationSelector/MedicationSelector";
import usePreOpStore from "../../../../store/formStore/ot/usePreOPForm";
// import TemporaryFile from './PreOpRecordTabItems/TemporaryFile';
import Tests from "./PreOpRecordTabItems/Tests/Tests";
// const testData = [
//   {
//     test: 'Fever Profile',
//     ICD_Code: 'ICD 10',
//   },
//   {
//     test: 'CBP',
//     ICD_Code: 'ICD 10',
//   },
//   {
//     test: 'CRP',
//     ICD_Code: 'ICD 10',
//   },
// ];

// const medications = {
//   capsules: [
//     {
//       name: 'Hard Gelatin Capsule',
//       days: 3,
//       dosage: 2,
//       time: 'Before Food',
//       notify: true,
//     },
//     {
//       name: 'Soft Gelatin Capsule',
//       days: 5,
//       dosage: 1,
//       time: 'After Food',
//       notify: true,
//     },
//   ],
//   syrups: [
//     {
//       name: 'Cough Syrup',
//       days: 7,
//       dosage: 1,
//       time: 'Before Food',
//       notify: false,
//     },
//     {
//       name: 'Vitamin Syrup',
//       days: 10,
//       dosage: 2,
//       time: 'After Food',
//       notify: true,
//     },
//   ],
//   tablets: [
//     {
//       name: 'Pain Relief Tablet',
//       days: 5,
//       dosage: 1,
//       time: 'Before Food',
//       notify: true,
//     },
//     {
//       name: 'Vitamin Tablet',
//       days: 7,
//       dosage: 2,
//       time: 'After Food',
//       notify: false,
//     },
//   ],
//   injections: [
//     {
//       name: 'Antibiotic Injection',
//       days: 3,
//       dosage: 1,
//       time: 'Before Food',
//       notify: true,
//     },
//     {
//       name: 'Insulin Injection',
//       days: 30,
//       dosage: 1,
//       time: 'After Food',
//       notify: true,
//     },
//   ],
//   ivLine: [
//     { name: 'Saline', days: 2, dosage: 1, time: 'Before Food', notify: true },
//     { name: 'Glucose', days: 3, dosage: 1, time: 'After Food', notify: true },
//   ],
// };
const PreOpRecordData = [
  {
    id: 1,
    text: "Tests",
    value: <Tests />,
  },
  {
    id: 2,
    text: "Pre-Medication",
    // value: <MedicationSelector store={usePreOpStore} />,
    value: <MedicationSelector store={usePreOpStore} setMedications={usePreOpStore.getState().setMedications} />,
 
  },
];
export default PreOpRecordData;
