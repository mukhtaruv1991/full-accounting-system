import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n'; // Initialize i18next
import '@fontsource/tajawal/400.css';
import '@fontsource/tajawal/700.css';
import './index.css'; // Keep your base styles

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    {/* We will wrap App with ThemeProvider in the next step inside App.tsx */}
    <App />
  </React.StrictMode>
);

reportWebVitals();
