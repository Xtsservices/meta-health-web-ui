import { ReducerType } from "../root-reducer";
export const selectAllStaff = (state: ReducerType) => {
  return state.staff;
};
