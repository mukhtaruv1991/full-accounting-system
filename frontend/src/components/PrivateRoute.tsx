import React from 'react';
import { Outlet } from 'react-router-dom';

// For now, this component just acts as a wrapper for nested routes.
// We will add authentication logic back here later for the sync feature.
const PrivateRoute: React.FC = () => {
  return <Outlet />;
};

export default PrivateRoute;
