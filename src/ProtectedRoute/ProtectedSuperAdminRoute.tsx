import React, { useEffect } from "react";
import { setCurrentUser } from "../store/user/user.action";
import { useDispatch } from "react-redux";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { Role_NAME } from "../utility/role";
import { useJwt } from "react-jwt";
import CryptoJS from "crypto-js";
import { userType } from "../interfaces";

// Define the props for the component
type ProtectedSuperAdminRouteProps = {
  children: React.ReactNode;
};

function ProtectedSuperAdminRoute({ children }: ProtectedSuperAdminRouteProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // Secret key for decryption
  const secretKey: string | undefined = import.meta.env.VITE_SECRET_KEY;
  const key = secretKey || "a1f0d31b6e4c2a8f79eacb10d1453e3f";

  // Retrieve and decrypt user data
  const storedEncryptedData = localStorage.getItem("user");
  let decryptedData: userType | null = null;

  if (storedEncryptedData) {
    try {
      const bytes = CryptoJS.AES.decrypt(storedEncryptedData, key);
      const jsonString = bytes.toString(CryptoJS.enc.Utf8);
      decryptedData = jsonString ? JSON.parse(jsonString) : null;
    } catch (error) {
      console.error("Error decrypting user data:", error);
      decryptedData = null;
    }
  }

  const { isExpired } = useJwt(decryptedData?.token || ""); // Check if the token is expired

  useEffect(() => {
    // Redirect to login if the token is expired or not present
    if (isExpired || !decryptedData?.token) {
      navigate("/login");
    } else if (decryptedData) {
      dispatch(setCurrentUser(decryptedData)); // Set the user in the Redux store
    }
  }, [decryptedData, dispatch, isExpired, navigate]);

  if (
    isExpired ||
    !decryptedData?.role ||
    decryptedData.role !== Role_NAME.sAdmin
  ) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default ProtectedSuperAdminRoute;
