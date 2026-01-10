// src/pages/TestLogin.jsx
import React, { useState } from 'react';

const TestLogin = () => {
  const [username, setUsername] = useState('admin');

  const handleForceAdmin = () => {
    console.log('👑 Forcer admin...');
    
    // Nettoyer
    localStorage.clear();
    
    // Créer un SUPER ADMIN
    const admin = {
      id: 1,
      username: username || 'admin',
      email: 'admin@simplon.com',
      first_name: 'Admin',
      last_name: 'System',
      is_staff: true,
      is_superuser: true,
      isAdmin: true,
      role: 'superuser'
    };
    
    localStorage.setItem('user', JSON.stringify(admin));
    localStorage.setItem('access_token', 'super_token_' + Date.now());
    
    console.log('✅ Admin créé:', admin);
    console.log('🔗 Redirection vers /admin...');
    
    // Rediriger
    setTimeout(() => {
      window.location.href = '/admin';
    }, 500);
  };

  const handleTestUser = () => {
    console.log('👤 Créer utilisateur normal...');
    
    localStorage.clear();
    
    const user = {
      id: 2,
      username: 'user',
      email: 'user@simplon.com',
      first_name: 'User',
      last_name: 'Normal',
      is_staff: false,
      is_superuser: false,
      isAdmin: false,
      role: 'user'
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('access_token', 'user_token_' + Date.now());
    
    console.log('✅ Utilisateur créé, redirection vers /dashboard...');
    
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 500);
  };

  const checkStatus = () => {
    console.log('🔍 État actuel:');
    console.log('User:', localStorage.getItem('user'));
    console.log('Token:', localStorage.getItem('access_token'));
    
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        alert(`Utilisateur: ${user.username}\nAdmin: ${user.isAdmin ? 'OUI' : 'NON'}`);
      } catch (e) {
        alert('Erreur de lecture');
      }
    } else {
      alert('Aucun utilisateur connecté');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-red-600 mb-2">
          🔧 PAGE DE TEST
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Connexion sans backend Django
        </p>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="admin"
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={handleForceAdmin}
            className="w-full bg-red-600 text-white p-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
          >
            👑 CRÉER ADMIN & ALLER À /ADMIN
          </button>
          
          <button
            onClick={handleTestUser}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            👤 CRÉER UTILISATEUR & ALLER À /DASHBOARD
          </button>
          
          <button
            onClick={checkStatus}
            className="w-full bg-gray-600 text-white p-3 rounded-lg font-bold hover:bg-gray-700 transition-colors"
          >
            🔍 VÉRIFIER ÉTAT ACTUEL
          </button>
          
          <button
            onClick={() => window.location.href = '/admin'}
            className="w-full bg-purple-600 text-white p-3 rounded-lg font-bold hover:bg-purple-700 transition-colors"
          >
            🔗 ALLER DIRECT À /ADMIN
          </button>
          
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
          >
            📊 ALLER DIRECT À /DASHBOARD
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ MODE DÉVELOPPEMENT :</strong> Cette page crée des utilisateurs 
            directement dans votre navigateur. Pas besoin de backend Django.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestLogin;