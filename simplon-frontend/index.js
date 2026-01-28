// src/components/admin/index.js
export { default as AdminLayout } from './AdminLayout';
export { default as AdminDashboard } from './AdminDashboard';
export { default as UserManagement } from './UserManagement';
export { default as ProjectManagement } from './ProjectManagement';
export { default as SubmitProject } from './SubmitProject';
export { default as Explore } from './Explore';
export { default as Analytics } from './Analytics';
export { default as Settings } from './Settings';
export { default as Profile } from './Profile';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './ThemeProvider';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);