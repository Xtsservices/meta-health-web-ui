import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Role_NAME } from "../utility/role";
import { useJwt } from "react-jwt";
import CryptoJS from "crypto-js";
import { userType } from "../interfaces";
import { key } from "../utils/constant";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../store/user/user.action";

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  // Retrieve and decrypt user data
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const storedEncryptedData = localStorage.getItem("user");
  let decryptedData: userType | null = null;

  if (storedEncryptedData) {
    const bytes = CryptoJS.AES.decrypt(storedEncryptedData, key);
    const jsonString = bytes.toString(CryptoJS.enc.Utf8);
    decryptedData = jsonString ? JSON.parse(jsonString) : null;
  }

  const { isExpired } = useJwt(decryptedData?.token || ""); // Check if the token is expired
  const location = useLocation();
  const token = decryptedData?.token || "";
  const role = Number(decryptedData?.role);


  
  useEffect(() => {
    if (!isExpired && (role === Role_NAME.admin || decryptedData?.role === Role_NAME.customerCare || role === Role_NAME.nurse || role === Role_NAME.headNurse) &&  decryptedData) {
      dispatch(setCurrentUser(decryptedData)); // Set user data in Redux
    }
  }, [decryptedData, dispatch, isExpired, navigate, role, token]);

 
  return !isExpired && (decryptedData?.role === Role_NAME.admin || decryptedData?.role === Role_NAME.customerCare || decryptedData?.role === Role_NAME.nurse || decryptedData?.role === Role_NAME.headNurse) ? (
    children
  ) : (
    <Navigate
      to={"/login"}
      state={{ from: location }} // Pass in route state
      replace
    />
  );
};

export default ProtectedAdminRoute;