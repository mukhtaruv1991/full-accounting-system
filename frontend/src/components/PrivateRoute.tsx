import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// This component is now a placeholder for future auth logic.
// For now, it just renders the nested routes.
const PrivateRoute: React.FC = () => {
  // In the future, we will add auth logic here.
  // For now, we just let the user pass.
  return <Outlet />;
};

export default PrivateRoute;
