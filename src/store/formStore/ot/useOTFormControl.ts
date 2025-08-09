import { create } from "zustand";

interface OTFormControlState {
  currentRoute: string;
  patientStage: number;
  userType: string;
  setCurrentRoute: (route: string) => void;
  setPatientStage: (stage: number) => void;
  setUserType: (userType: string) => void;
}

const useOTFormControl = create<OTFormControlState>((set) => ({
  currentRoute: "",
  patientStage: 0,
  userType: "",
  setCurrentRoute: (route) => set({ currentRoute: route }),
  setUserType: (userType) => set({ userType: userType }),
  setPatientStage: (stage) => set({ patientStage: stage })
}));

export default useOTFormControl;
