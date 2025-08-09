import { ReducerType } from "../root-reducer";

export const selectCurrPatient = (state: ReducerType) =>
  state.currPatient.currentPatient;

export const selectTimeline = (state: ReducerType) =>
  state.currPatient.timeline;
