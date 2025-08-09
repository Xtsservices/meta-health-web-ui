import CURR_Appointment_ACTION_TYPE from "./currentAppointment.types";
import { RescheduleDataType } from "../../types";
import { createAction } from "../actionCreator";

type setRescheduledDataType = {
  currentRescheduledData: RescheduleDataType;
};

export const setRescheduledata = (
  currentRescheduledData: setRescheduledDataType
) => {
  return createAction(
    CURR_Appointment_ACTION_TYPE.SET_CURR_RESCHEDULEDATA,
    currentRescheduledData
  );
};
