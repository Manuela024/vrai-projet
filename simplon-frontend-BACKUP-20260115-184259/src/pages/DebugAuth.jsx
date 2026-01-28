// src/pages/DebugAuth.jsx
import React, { useEffect } from 'react';
import authService from '../services/auth';

const DebugAuth = () => {
  useEffect(() => {
    console.log('🔍 DEBUG AUTH');
    console.log('localStorage user:', localStorage.getItem('user'));
    console.log('localStorage access_token:', localStorage.getItem('access_token'));
    console.log('localStorage refresh_token:', localStorage.getItem('refresh_token'));
    
    console.log('authService.isAuthenticated():', authService.isAuthenticated());
    console.log('authService.isAdmin():', authService.isAdmin());
    console.log('authService.getCurrentUser():', authService.getCurrentUser());
    
    // Test: créer un utilisateur manuellement
    const testUser = {
      id: 2,
      username: 'testuser',
      isAdmin: false,
      is_staff: false,
      is_superuser: false
    };
    
    localStorage.setItem('user', JSON.stringify(testUser));
    localStorage.setItem('access_token', 'debug_token_' + Date.now());
    
    console.log('🔄 Après stockage manuel:');
    console.log('isAuthenticated:', authService.isAuthenticated());
    console.log('isAdmin:', authService.isAdmin());
  }, []);

  return (
    <div style={{ padding: '40px' }}>
      <h1>🔍 Debug Authentification</h1>
      <p>Ouvrez la console (F12) pour voir les logs</p>
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => window.location.href = '/dashboard'} style={{ padding: '10px 20px', marginRight: '10px' }}>
          Tester /dashboard
        </button>
        <button onClick={() => window.location.href = '/quick-login'} style={{ padding: '10px 20px' }}>
          Retour à QuickLogin
        </button>
      </div>
    </div>
  );
};

export default DebugAuth;