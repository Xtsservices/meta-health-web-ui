import { ReactNode, useEffect } from "react";
import { setCurrentUser } from "../store/user/user.action";
import { useDispatch } from "react-redux";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { useJwt } from "react-jwt";
import CryptoJS from "crypto-js";
import { Role_NAME } from "../utility/role";
import { userType } from "../interfaces";

type ProtectedHomeRouteProps = {
  children: ReactNode;
};

function ProtectedHomeRoute({ children }: ProtectedHomeRouteProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // Secret key for decryption
  const secretKey: string | undefined = import.meta.env.VITE_SECRET_KEY; // Use VITE_ prefix for environment variables
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

  // Extract token and role from decryptedData
  const token = decryptedData?.token || "";
  const role = Number(decryptedData?.role);
  const { isExpired } = useJwt(token); // Check if the token is expired

  useEffect(() => {
    if (isExpired || !token) {
      navigate("/login");
    } else if (decryptedData) {
      dispatch(setCurrentUser(decryptedData)); // Set user data in Redux
    }

    if (!isExpired && role === Role_NAME.admin) {
      navigate("/inpatient/admin");
    }
    if (!isExpired && (role === Role_NAME.customerCare)) {
      navigate("/customerCare");
    }
    if (!isExpired && (role === Role_NAME.nurse || role === Role_NAME.headNurse)) {
      navigate("/nurse");
    }
  }, [decryptedData, dispatch, isExpired, navigate, role, token]);

  // Render children if the role is not admin and the token is not expired
  return !isExpired && role !== Role_NAME.admin && (role !== Role_NAME.nurse || role !== Role_NAME.headNurse)? (
    <>{children}</>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default ProtectedHomeRoute;
