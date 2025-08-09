import CURR_PATIENT_ACTION_TYPE from "./currentPatient.types";
import { PatientType, TimelineType } from "../../types";

interface actionType<T> {
  type: string;
  payload: T;
}

type currentPatientReducerType = {
  currentPatient: PatientType;
  timeline: TimelineType;
};
const initial_state: currentPatientReducerType = {
  currentPatient: {
    id: null,
    hospitalID: null,
    deviceID: null,
    pID: "",
    pUHID: null,
    category: null,
    ptype: null,
    dob: null,
    gender: null,
    weight: null,
    height: null,
    pName: "",
    phoneNumber: null,
    email: null,
    address: null,
    city: null,
    state: null,
    pinCode: null,
    referredBy: null,
    addedOn: "",
    lastModified: null,
    startTime: "",
    endTime: "",
    wardID: 0,
    wardName: "",
    insurance: 0,
    insuranceNumber: "",
    insuranceCompany: "",
    status: null
  },
  timeline: {
    id: 0,
    patientID: 0,
    userID: 0,
    patientStartStatus: 0,
    patientEndStatus: 0,
    startTime: "",
    endTime: "",
    dischargeType: null,
    diet: null,
    advice: null,
    followUp: null,
    followUpDate: null,
    icd: null,
    wardID: 0,
    medicine: undefined,
    patientAddedOn:""
  }
};
export const currPatientReducer = <T>(
  state: currentPatientReducerType = initial_state,
  action: actionType<T>
) => {
  const { type, payload } = action;

  switch (type) {
    case CURR_PATIENT_ACTION_TYPE.SET_CURR_PATIENT:
      return { ...state, ...payload };
    case CURR_PATIENT_ACTION_TYPE.SET_TIMELINE:
      return { ...state, ...payload };
    default:
      return state;
  }
};
