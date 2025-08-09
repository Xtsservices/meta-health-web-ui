import USER_ACTION_TYPES from "./user.types";
import { userType } from "../../interfaces";
export const USER_INITIAL_STATE: userType = {
  token: "",
  hospitalID: 0,
  id: 0,
  isLoggedIn: false,
  role: 0,
  status: "error",
  imageURL: undefined,
  city: "",
  state: "",
  address: "",
  pinCode: null,
  dob: "",
  gender: -1,
  scope: "",
  roleName: "",
  departmentID: -1,
};
interface actionType<T> {
  type: string;
  payload: T;
}

export const userReducer = <T>(
  state = USER_INITIAL_STATE,
  action: actionType<T>
) => {
  const { type, payload } = action;

  switch (type) {
    case USER_ACTION_TYPES.SET_CURRENT_USER:
      return { ...payload };
    default:
      return state;
    case USER_ACTION_TYPES.REMOVE_CURRENT_USER:
      return { ...payload };
  }
};
