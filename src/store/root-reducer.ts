import { combineReducers } from "redux";
import { userReducer } from "./user/user.reducer";
import { staffReducer } from "./staff/staff.reducer";
import {
  errorType,
  PatientType,
  staffType,
  TimelineType,
  RescheduleDataType
} from "../types";
import { userType } from "../interfaces";
import { patientReducer } from "./patient/patient.reducer";
import { currPatientReducer } from "./currentPatient/currentPatient.reducer";
import { errorReducer } from "./error/error.reducer";
import { currRescheduleReducer } from "./appointment/currentAppointment.reducer";
type currentPatientReducerType = {
  currentPatient: PatientType;
  timeline: TimelineType;
};

type currentRescheduledReducerType = {
  currentRescheduledData: RescheduleDataType;
};

export type ReducerType = {
  user: userType;
  staff: staffType[];
  patient: PatientType[];
  currPatient: currentPatientReducerType;
  error: errorType;
  currRescheduleData: currentRescheduledReducerType;
};
export const rootReducer = combineReducers({
  user: userReducer,
  staff: staffReducer,
  patient: patientReducer,
  currPatient: currPatientReducer,
  error: errorReducer,
  currRescheduleData: currRescheduleReducer
});
