import { create } from "zustand";

interface Symptom {
  symptom: string;
  duration: string;
  time: string;
  updatedBy: string;
}

interface Medication {
  name: string;
  days: number;
  dosage: number;
  time: string;
  notify: boolean;
}

interface FormState {
  symptoms: Symptom[];
  vitals: object;
  medications: { [key: string]: Medication[] };
  medicalExaminationHistory: object;
  testReports: object;
}

interface PatientFileTabState extends FormState {
  setSymptoms: (symptoms: Symptom[]) => void;
  setVitals: (vitals: object) => void;
  setMedications: (type: string, meds: Medication[]) => void;
  setMedicalExaminationHistory: (history: object) => void;
  setTestReports: (reports: object) => void;
  resetAll: () => void;
}

const initialSymptoms: Symptom[] = [];
const initialVitals = {};
const initialMedications: { [key: string]: Medication[] } = {};
const initialMedicalExaminationHistory = {};
const initialTestReports = {};

const usePatientFileStore = create<PatientFileTabState>((set) => ({
  symptoms: initialSymptoms,
  vitals: initialVitals,
  medications: initialMedications,
  medicalExaminationHistory: initialMedicalExaminationHistory,
  testReports: initialTestReports,
  setSymptoms: (symptoms) => set({ symptoms }),
  setVitals: (vitals) => set({ vitals }),
  setMedications: (type, meds) =>
    set((state) => ({
      medications: { ...state.medications, [type]: meds }
    })),
  setMedicalExaminationHistory: (history) =>
    set({ medicalExaminationHistory: history }),
  setTestReports: (reports) => set({ testReports: reports }),
  resetAll: () =>
    set({
      symptoms: initialSymptoms,
      vitals: initialVitals,
      medications: initialMedications,
      medicalExaminationHistory: initialMedicalExaminationHistory,
      testReports: initialTestReports
    })
}));

export default usePatientFileStore;
