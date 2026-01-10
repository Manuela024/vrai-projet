// src/pages/DebugPage.jsx
import React, { useEffect } from 'react';

const DebugPage = () => {
  useEffect(() => {
    console.log('🔧 DEBUG PAGE - Configuration automatique');
    
    // 1. Nettoyer
    localStorage.clear();
    
    // 2. Créer un SUPER ADMIN
    const superAdmin = {
      id: 999,
      username: 'superadmin',
      email: 'super@simplon.com',
      first_name: 'Super',
      last_name: 'Admin',
      is_staff: true,
      is_superuser: true,
      isAdmin: true,
      role: 'godmode'
    };
    
    localStorage.setItem('user', JSON.stringify(superAdmin));
    localStorage.setItem('access_token', 'debug_token_super');
    localStorage.setItem('refresh_token', 'debug_refresh_super');
    
    console.log('✅ SUPER ADMIN configuré:', superAdmin);
    console.log('🔗 Redirection dans 2 secondes...');
    
    // 3. Rediriger
    setTimeout(() => {
      console.log('🚀 REDIRECTION VERS /admin');
      window.location.href = '/admin';
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-500 to-purple-600">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">🔧 MODE DEBUG</h1>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-6"></div>
        <p className="text-xl">Configuration d'un super admin...</p>
        <p className="mt-2">Redirection automatique vers /admin</p>
      </div>
    </div>
  );
};

export default DebugPage;