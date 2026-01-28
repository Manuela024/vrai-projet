// src/pages/TestRedirection.jsx
import React, { useEffect } from 'react';
import authService from '../services/auth';

const TestRedirection = () => {
  useEffect(() => {
    console.log('🧪 TEST REDIRECTION');
    
    // Créer un utilisateur normal
    const normalUser = {
      id: 2,
      username: 'user123',
      isAdmin: false,
      is_staff: false,
      is_superuser: false
    };
    
    localStorage.clear();
    localStorage.setItem('user', JSON.stringify(normalUser));
    localStorage.setItem('access_token', 'test_token');
    
    console.log('👤 Utilisateur normal créé:', normalUser);
    console.log('🔍 isAuthenticated:', authService.isAuthenticated());
    console.log('🔍 isAdmin:', authService.isAdmin());
    
    // Rediriger après 1 seconde
    setTimeout(() => {
      console.log('🔄 Redirection vers /dashboard');
      window.location.href = '/dashboard';
    }, 1000);
  }, []);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>🧪 Test Redirection Utilisateur</h1>
      <p>Création d'un utilisateur normal...</p>
      <p>Redirection vers /dashboard dans 1 seconde</p>
    </div>
  );
};

export default TestRedirection;