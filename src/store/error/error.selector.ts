import { ReducerType } from "../root-reducer";

export const selectErrorStatus = (state: ReducerType) => {
  return state.error;
};

export const selectLoadingStatus = (state: ReducerType) => {
  return state.error.loading;
};

export const selectBackdropStatus = (state: ReducerType) => {
  return state.error.backdrop_loading;
};
