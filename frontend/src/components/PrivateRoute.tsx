import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, selectedCompany, loading } = useAuth();

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  // User must be logged in AND have a company selected to access private routes
  if (user && selectedCompany) {
    return <>{children}</>;
  }
  
  // If user is logged in but has no company selected, they should be at the selection page
  if (user && !selectedCompany) {
    return <Navigate to="/select-company" replace />;
  }

  // If not logged in at all, go to login
  return <Navigate to="/login" replace />;
};

export default PrivateRoute;
