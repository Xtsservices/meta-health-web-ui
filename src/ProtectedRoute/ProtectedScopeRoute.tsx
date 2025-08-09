import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import CryptoJS from "crypto-js";

type ProtectedScopeRouteProps = {
  children: React.ReactNode;
  scope: number;
};

function ProtectedScopeRoute({ children, scope }: ProtectedScopeRouteProps) {
  const location = useLocation();

  // Secret key for decryption
  const secretKey: string | undefined = import.meta.env.SECRET_KEY;
  const key = secretKey || "a1f0d31b6e4c2a8f79eacb10d1453e3f";

  // Retrieve and decrypt user data
  const storedEncryptedData = localStorage.getItem("user");
  let decryptedData = null;

  if (storedEncryptedData) {
    const bytes = CryptoJS.AES.decrypt(storedEncryptedData, key);
    const jsonString = bytes.toString(CryptoJS.enc.Utf8);
    decryptedData = jsonString ? JSON.parse(jsonString) : null;
  }

  const scopes = decryptedData?.scope; // Get the scope from the decrypted data
  const userScopes = scopes && scopes.split("#").map((n: string) => Number(n));
  const hasScope = userScopes && userScopes.includes(scope);

  return scopes && hasScope ? (
    children
  ) : (
    <Navigate
      to="/login"
      state={{ from: location }} // Pass in route state
      replace
    />
  );
}

export default ProtectedScopeRoute;
