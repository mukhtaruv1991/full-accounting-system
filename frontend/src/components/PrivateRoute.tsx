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

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is logged in, but has not selected a company,
  // and is NOT trying to access the selection page, redirect them to it.
  if (!selectedCompany && location.pathname !== '/select-company') {
    return <Navigate to="/select-company" replace />;
  }

  // If user is logged in AND has selected a company, but tries to go to
  // the selection page, redirect them to the dashboard.
  if (selectedCompany && location.pathname === '/select-company') {
    return <Navigate to="/dashboard" replace />;
  }

  // If all checks pass, render the requested component
  return <>{children}</>;
};

export default PrivateRoute;
