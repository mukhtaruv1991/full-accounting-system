import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/api'; // Import api to handle the login response

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // The login function in the context will handle setting the token and user state
      const response = await login(email, password);
      
      // After login, we check the memberships from the response to decide where to navigate
      if (response && response.memberships && response.memberships.length > 1) {
        navigate('/select-company');
      } else {
        navigate('/dashboard');
      }

    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
      <div style={{ marginTop: '1rem' }}>
        <span>Don't have an account? </span>
        <Link to="/register">Register here</Link>
      </div>
    </div>
  );
};

export default LoginPage;
