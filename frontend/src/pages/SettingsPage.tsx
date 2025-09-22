import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div>
      <h2>Settings</h2>
      <p>Application settings will be here.</p>
      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
        <h3>Sync & Backup</h3>
        <p>Create an account to sync your data across devices and keep it safe.</p>
        <button>Create Account / Login</button>
      </div>
    </div>
  );
};

export default SettingsPage;
