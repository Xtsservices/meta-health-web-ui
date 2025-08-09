import USER_ACTION_TYPES from "./user.types";
import { userType } from "../../interfaces";
import { createAction } from "../actionCreator";

export const setCurrentUser = (user: userType) => {
  const newUser: userType = { ...user, isLoggedIn: true };
  return createAction(USER_ACTION_TYPES.SET_CURRENT_USER, newUser);
};

export const removeCurrentUser = () => {
  return createAction(USER_ACTION_TYPES.REMOVE_CURRENT_USER, {
    token: "",
    id: 0,
    role: 0,
    hospitalID: 0,
    isLoggedIn: false,
    status: "error"
  });
};
