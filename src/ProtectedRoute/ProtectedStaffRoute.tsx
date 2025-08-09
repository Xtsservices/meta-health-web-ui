import React from "react";
import { setCurrentUser } from "../store/user/user.action";
import { useDispatch } from "react-redux/es/exports";
import { useNavigate } from "react-router-dom";
import { Navigate, useLocation } from "react-router-dom";
import { Role_NAME } from "../utility/role";
import { useJwt } from "react-jwt";
import CryptoJS from "crypto-js";
import { userType } from "../interfaces";

type MyComponentProps = {
  children: React.ReactNode;
};

function ProtectedStaffRoute({ children }: MyComponentProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Secret key for decryption
  const secretKey: string | undefined = import.meta.env.SECRET_KEY;
  const key = secretKey || "a1f0d31b6e4c2a8f79eacb10d1453e3f";

  // Retrieve and decrypt user data
  const storedEncryptedData = localStorage.getItem("user");
  let decryptedData: userType | null = null;

  if (storedEncryptedData) {
    const bytes = CryptoJS.AES.decrypt(storedEncryptedData, key);
    const jsonString = bytes.toString(CryptoJS.enc.Utf8);
    decryptedData = jsonString ? JSON.parse(jsonString) : null;
  }

  const { isExpired } = useJwt(decryptedData?.token || "");
  const location = useLocation();

  React.useEffect(() => {
    // Redirect to login if the token is expired or not present
    if (isExpired || !decryptedData?.token) {
      navigate("/login");
    } else {
      dispatch(setCurrentUser(decryptedData)); // Set the user in the Redux store
    }

  }, [decryptedData, dispatch, isExpired, navigate]);

  return !isExpired &&
    (decryptedData?.role === Role_NAME.doctor ||
      decryptedData?.role === Role_NAME.hod ||
      decryptedData?.role === Role_NAME.customerCare ||
      decryptedData?.role === Role_NAME.nurse ||
      decryptedData?.role === Role_NAME.headNurse ||
      decryptedData?.role === Role_NAME.admin ||
      decryptedData?.role === Role_NAME.staff) ? (
    children
  ) : (
    <Navigate
      to={"/login"}
      state={{ from: location }} // Pass in route state
      replace
    />
  );
}

export default ProtectedStaffRoute;
