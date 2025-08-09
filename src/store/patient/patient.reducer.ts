import PATIENT_ACTION_TYPE from "./patient.types";
import { PatientType } from "../../types";

interface actionType<T> {
  type: string;
  payload: T;
}

export const patientReducer = <T>(
  state: PatientType[] = [],
  action: actionType<T>
) => {
  const { type, payload } = action;

  switch (type) {
    case PATIENT_ACTION_TYPE.SET_ALL_PATIENT:
      return payload;
    default:
      return state;
  }
};
