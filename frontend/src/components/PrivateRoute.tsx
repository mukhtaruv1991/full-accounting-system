import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, selectedCompany, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  // 1. If the user is not logged in at all, always redirect to login.
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If the user IS logged in, but has NOT selected a company yet...
  if (!selectedCompany) {
    // ...and they are trying to go to the selection page, LET THEM. This is the correct path.
    if (location.pathname === '/select-company') {
      return <>{children}</>;
    }
    // ...but if they are trying to go anywhere else (like /dashboard), FORCE them to the selection page.
    return <Navigate to="/select-company" replace />;
  }

  // 3. If the user IS logged in AND HAS selected a company...
  if (selectedCompany) {
    // ...but they try to go back to the selection page, redirect them to the dashboard.
    if (location.pathname === '/select-company') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // 4. If all checks pass (user is logged in, has a company, and is not on the selection page), render the component.
  return <>{children}</>;
};

export default PrivateRoute;
