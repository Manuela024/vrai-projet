// src/components/SimpleTest.jsx
import React, { useState } from 'react';
import authService from '../services/auth';

const SimpleTest = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResult('Test en cours...');
    
    try {
      const loginResult = await authService.login('admin', 'admin123');
      
      if (loginResult.success) {
        setResult(`✅ SUCCÈS! Connecté en tant que: ${loginResult.user.username}
        Email: ${loginResult.user.email}
        Role: ${loginResult.user.role}
        Token: ${loginResult.access?.substring(0, 20)}...`);
      } else {
        setResult(`❌ ÉCHEC: ${loginResult.message}`);
      }
    } catch (error) {
      setResult(`❌ ERREUR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = () => {
    const user = authService.getCurrentUser();
    const token = authService.getAccessToken();
    
    if (user) {
      setResult(`✅ Utilisateur trouvé:
      Username: ${user.username}
      Email: ${user.email}
      Role: ${user.role}
      Token présent: ${token ? 'Oui' : 'Non'}`);
    } else {
      setResult('❌ Aucun utilisateur connecté');
    }
  };

  const clearStorage = () => {
    localStorage.clear();
    setResult('✅ LocalStorage effacé');
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">🔧 Test Simple Auth</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testLogin}
          disabled={loading}
          className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? 'Connexion...' : 'Tester Login (admin/admin123)'}
        </button>
        
        <button
          onClick={checkAuth}
          className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
        >
          Vérifier Auth
        </button>
        
        <button
          onClick={clearStorage}
          className="w-full bg-red-500 text-white p-3 rounded hover:bg-red-600"
        >
          Effacer Storage
        </button>
      </div>
      
      {result && (
        <div className="p-4 bg-gray-100 rounded whitespace-pre-line">
          {result}
        </div>
      )}
    </div>
  );
};

export default SimpleTest;