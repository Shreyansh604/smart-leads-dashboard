import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";


const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const storedToken = localStorage.getItem("token");

  if (!token && !storedToken) {
    return <Navigate to="/login" replace />;
  };

  return token ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;