import { createAction } from "../actionCreator";
import ERROR_ACTION_TYPES from "./error.types";

export const setError = (err: string) => {
  return createAction(ERROR_ACTION_TYPES.SET_ERROR, err);
};

export const setSuccess = (success: string) => {
  return createAction(ERROR_ACTION_TYPES.SET_SUCCESS, success);
};

export const setCloseSnackbar = () => {
  return createAction(ERROR_ACTION_TYPES.SET_CLOSE, "");
};

export const setLoading = (loading: boolean) => {
  return createAction(ERROR_ACTION_TYPES.SET_LOADING, loading);
};
export const setBackdropLoading = (loading: boolean) => {
  return createAction(ERROR_ACTION_TYPES.SET_BACKDROP_LOADING, loading);
};
