import ERROR_ACTION_TYPES from "./error.types";
import { errorType } from "../../types";

interface actionType {
  type: string;
  payload: errorType;
}

const initial_state: errorType = {
  message: "",
  status: "",
  display: false,
  severity: "success",
  loading: false,
  backdrop_loading: false
};

export const errorReducer = (
  state: errorType = initial_state,
  action: actionType
) => {
  const { type, payload } = action;

  switch (type) {
    case ERROR_ACTION_TYPES.SET_ERROR:
      return {
        message: payload,
        display: true,
        severity: "error",
        status: "success",
        loading: false
      };
    case ERROR_ACTION_TYPES.SET_SUCCESS:
      return {
        message: payload,
        display: true,
        severity: "success",
        status: "success",
        loading: false
      };
    case ERROR_ACTION_TYPES.SET_CLOSE:
      return { message: "", status: "", display: false, severity: "success" };

    case ERROR_ACTION_TYPES.SET_LOADING:
      return { ...state, loading: payload };
    case ERROR_ACTION_TYPES.SET_BACKDROP_LOADING:
      return { ...state, backdrop_loading: payload };
    default:
      return state;
  }
};
