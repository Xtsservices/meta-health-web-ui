import PATIENT_ACTION_TYPE from "./patient.types";
import { PatientType } from "../../types";
import { createAction } from "../actionCreator";

export const setAllPatient = (patients: PatientType[]) => {
  return createAction(PATIENT_ACTION_TYPE.SET_ALL_PATIENT, patients);
};
