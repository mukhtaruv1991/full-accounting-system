import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

const AuthStatus = () => {
  const { logout, user } = useAuth();
  return user ? (
    <div>
      Welcome, {user.email}! <button onClick={logout}>Logout</button>
    </div>
  ) : (
    <div>You are not logged in.</div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <nav>
          <Link to="/">Home</Link> | <Link to="/login">Login</Link> | <Link to="/register">Register</Link> | <Link to="/dashboard">Dashboard</Link>
          <AuthStatus />
        </nav>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<h1>Welcome to the Accounting System</h1>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
