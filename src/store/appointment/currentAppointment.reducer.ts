import Appointment_ACTION_TYPE from "./currentAppointment.types";
import { RescheduleDataType } from "../../types";

interface actionType<T> {
  type: string;
  payload: T;
}

type currentRescheduledReducerType = {
  currentRescheduledData: RescheduleDataType;
};

const initial_state: currentRescheduledReducerType = {
  currentRescheduledData: {
    id: 0,
    department: null,
    doctorName: null,
    services: "",
    pName: "",
    age: "",
    gender: 0,
    mobileNumber: "",
    email: ""
  }
};

export const currRescheduleReducer = <T>(
  state: currentRescheduledReducerType = initial_state,
  action: actionType<T>
) => {
  const { type, payload } = action;

  switch (type) {
    case Appointment_ACTION_TYPE.SET_CURR_RESCHEDULEDATA:
      return { ...state, ...payload };
    default:
      return state;
  }
};
