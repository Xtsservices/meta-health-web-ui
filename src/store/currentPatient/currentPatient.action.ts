import CURR_PATIENT_ACTION_TYPE from "./currentPatient.types";
import { PatientType, TimelineType } from "../../types";
import { createAction } from "../actionCreator";

type setCurrentPatientType = {
  currentPatient: PatientType;
};
type setTimelineType = {
  timeline: TimelineType;
};
export const setCurrPatient = (patient: setCurrentPatientType) => {
  return createAction(CURR_PATIENT_ACTION_TYPE.SET_CURR_PATIENT, patient);
};

export const setTimeline = (timeline: setTimelineType) => {
  return createAction(CURR_PATIENT_ACTION_TYPE.SET_CURR_PATIENT, timeline);
};
