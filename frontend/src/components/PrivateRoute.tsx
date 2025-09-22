import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// No longer needs children, so we can remove the props interface
const PrivateRoute: React.FC = () => {
  const { user, selectedCompany, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is not logged in, always redirect to login.
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is logged in, but has not selected a company, redirect to selection page.
  if (!selectedCompany) {
    // Allow access to the selection page itself if they are trying to get there
    if (location.pathname === '/select-company') {
      return <Outlet />; // Use Outlet for the nested route
    }
    return <Navigate to="/select-company" replace />;
  }

  // If all checks pass, render the nested route via the Outlet.
  return <Outlet />;
};

export default PrivateRoute;
