import STAFF_ACTION_TYPES from "./staff.types";
import { staffType } from "../../types";
interface actionType<T> {
  type: string;
  payload: T;
}

export const staffReducer = <T>(
  state: staffType[] = [],
  action: actionType<T>
) => {
  const { type, payload } = action;

  switch (type) {
    case STAFF_ACTION_TYPES.SET_ALL_STAFF:
      return payload;
    case STAFF_ACTION_TYPES.ADD_NEW_STAFF:
      return [payload, ...state];
    case STAFF_ACTION_TYPES.SET_MULTIPLE_STAFF:
      return [...(payload as staffType[]), ...state];
    default:
      return state;
  }
};
