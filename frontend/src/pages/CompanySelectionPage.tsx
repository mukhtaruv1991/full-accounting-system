import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CompanySelectionPage: React.FC = () => {
  const { memberships, selectCompany, logout } = useAuth();
  const navigate = useNavigate();

  const handleSelectCompany = (companyId: string) => {
    selectCompany(companyId);
    navigate('/dashboard'); // Redirect to dashboard after selection
  };

  return (
    <div className="container">
      <h2>Select a Company</h2>
      <p>You are a member of multiple companies. Please choose which one to work with.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        {memberships.map((membership) => (
          <button
            key={membership.companyId}
            onClick={() => handleSelectCompany(membership.companyId)}
            style={{ padding: '1rem', fontSize: '1.2rem' }}
          >
            {membership.company.name} ({membership.role})
          </button>
        ))}
      </div>
      <button onClick={logout} style={{ marginTop: '2rem', backgroundColor: '#888' }}>
        Logout
      </button>
    </div>
  );
};

export default CompanySelectionPage;
