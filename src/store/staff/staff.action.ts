import STAFF_ACTION_TYPES from "./staff.types";
import { staffType } from "../../types";
import { createAction } from "../actionCreator";

export const setAllStaff = (staff: staffType[]) => {
  return createAction(STAFF_ACTION_TYPES.SET_ALL_STAFF, staff);
};

export const setMultipleStaff = (staff: staffType[]) => {
  return createAction(STAFF_ACTION_TYPES.SET_MULTIPLE_STAFF, staff);
};

export const setNewStaff = (staff: staffType) => {
  return createAction(STAFF_ACTION_TYPES.ADD_NEW_STAFF, staff);
};
