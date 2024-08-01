import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, initializeAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      await initializeAuth();
      setIsLoading(false);
    };
    checkAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return <div>Loading...</div>; // 또는 로딩 스피너 컴포넌트
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
