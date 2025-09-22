import React from 'react';
import { Outlet } from 'react-router-dom';

// This component is a placeholder for future authentication logic.
// For now, it just renders the nested routes.
const PrivateRoute: React.FC = () => {
  return <Outlet />;
};

export default PrivateRoute;
