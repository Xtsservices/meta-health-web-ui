import { ReducerType } from "../root-reducer";
export const selectCurrAppointmentData = (state: ReducerType) =>
  state.currRescheduleData.currentRescheduledData;
