import React, { useState } from 'react';
import { api } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Assuming 'name' and 'companyName' are required for registration based on previous context
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/auth/register', { name, email, password, companyName });
      setSuccess('Registration successful! Please log in.');
      setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Your Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Company Name:</label>
          <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Register</button>
      </form>
      <div style={{ marginTop: '1rem' }}>
        <span>Already have an account? </span>
        <Link to="/login">Login here</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
