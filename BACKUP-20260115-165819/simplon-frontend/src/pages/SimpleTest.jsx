// src/pages/SimpleTest.jsx - COMPOSANT DE TEST COMPLET
import React, { useState, useEffect } from 'react';
import authService from '../services/auth';
import { useNavigate } from 'react-router-dom';

const SimpleTest = () => {
  const [results, setResults] = useState([]);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [identifier, setIdentifier] = useState('admin');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Vérifier l'état au chargement
  useEffect(() => {
    addResult('🔄 SimpleTest.jsx chargé', 'info');
    checkCurrentAuth();
  }, []);

  const addResult = (message, type = 'info') => {
    setResults(prev => [...prev, {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const checkCurrentAuth = () => {
    const user = authService.getCurrentUser();
    const token = authService.getAccessToken();
    const isAuth = authService.isAuthenticated();
    const isAdmin = authService.isAdmin();

    addResult('🔍 État d\'authentification actuel:', 'info');
    addResult(`Token présent: ${token ? '✅ Oui' : '❌ Non'}`, 'info');
    addResult(`Authentifié: ${isAuth ? '✅ Oui' : '❌ Non'}`, 'info');
    
    if (user) {
      addResult(`Utilisateur: ${user.username} (ID: ${user.id})`, 'success');
      addResult(`Email: ${user.email}`, 'success');
      addResult(`Rôle: ${user.role}`, 'success');
      addResult(`Admin: ${isAdmin ? '✅ Oui' : '❌ Non'}`, 'info');
    } else {
      addResult('Aucun utilisateur connecté', 'warning');
    }
  };

  const testLoginUniversal = async () => {
    setLoading(true);
    addResult(`🔐 Test de login universel: ${identifier}`, 'info');
    
    try {
      const result = await authService.login(identifier, password);
      
      if (result.success) {
        addResult(`✅ CONNEXION RÉUSSIE!`, 'success');
        addResult(`Utilisateur: ${result.user.username}`, 'success');
        addResult(`Email: ${result.user.email}`, 'success');
        addResult(`Rôle: ${result.user.role}`, 'success');
        addResult(`Token: ${result.access?.substring(0, 30)}...`, 'success');
        
        // Redirection automatique
        setTimeout(() => {
          if (result.user.is_staff) {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        }, 2000);
      } else {
        addResult(`❌ ÉCHEC: ${result.message}`, 'error');
      }
    } catch (error) {
      addResult(`❌ ERREUR: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const testQuickLogin = async () => {
    setLoading(true);
    addResult(`⚡ Test de login rapide: ${username}`, 'info');
    
    try {
      const result = await authService.quickLogin(username);
      
      if (result.success) {
        addResult(`✅ LOGIN RAPIDE RÉUSSIE!`, 'success');
        addResult(`Utilisateur: ${result.user.username}`, 'success');
        addResult(`Rôle: ${result.user.role}`, 'success');
      } else {
        addResult(`❌ ÉCHEC: ${result.message}`, 'error');
      }
    } catch (error) {
      addResult(`❌ ERREUR: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const testAPIEndpoints = async () => {
    addResult('🌐 Test des endpoints API...', 'info');
    
    const endpoints = [
      { name: 'Login API', url: 'http://localhost:8000/api/users/auth/login/' },
      { name: 'Current User', url: 'http://localhost:8000/api/users/auth/me/' },
      { name: 'Health Check', url: 'http://localhost:8000/api/users/health/' },
      { name: 'All Users', url: 'http://localhost:8000/api/users/all/' },
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.url, { method: 'GET' });
        addResult(`${endpoint.name}: ${response.status} ${response.statusText}`, 
          response.ok ? 'success' : 'warning');
      } catch (error) {
        addResult(`${endpoint.name}: ❌ ${error.message}`, 'error');
      }
    }
  };

  const testBackendConnection = async () => {
    addResult('🔗 Test de connexion backend Django...', 'info');
    
    try {
      const response = await fetch('http://localhost:8000/', { method: 'GET' });
      
      if (response.ok) {
        addResult('✅ Backend Django fonctionne!', 'success');
      } else {
        addResult(`⚠️ Backend répond mais avec erreur: ${response.status}`, 'warning');
      }
    } catch (error) {
      addResult(`❌ Backend Django ne répond pas: ${error.message}`, 'error');
      addResult('Assurez-vous que le serveur Django tourne sur localhost:8000', 'error');
    }
  };

  const clearLocalStorage = () => {
    localStorage.clear();
    addResult('🧹 LocalStorage effacé!', 'info');
    checkCurrentAuth();
  };

  const clearResults = () => {
    setResults([]);
  };

  const testUsers = [
    { username: 'admin', password: 'admin123', type: 'Admin' },
    { username: 'alice', password: '123', type: 'Apprenant' },
    { username: 'simplon_2025001', password: '123', type: 'Apprenant Simplon' },
    { username: 'admin_user', password: '123', type: 'Admin' },
  ];

  const testWithUser = async (testUser) => {
    setIdentifier(testUser.username);
    setPassword(testUser.password);
    
    addResult(`🧪 Test avec ${testUser.type}: ${testUser.username}`, 'info');
    await testLoginUniversal();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#001F3F] mb-2">🔧 SimpleTest - Panel de Test</h1>
          <p className="text-gray-600">
            Utilisez ce panel pour tester l'authentification et l'API de votre application
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche: Tests d'authentification */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-[#001F3F]">🔐 Authentification</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Identifiant (username/email/matricule):
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
                    placeholder="admin ou alice ou simplon_2025001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe:
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
                    placeholder="admin123 ou 123"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={testLoginUniversal}
                    disabled={loading}
                    className="bg-[#E30613] text-white p-3 rounded-lg hover:bg-[#c40510] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Test en cours...' : '🔐 Tester Login Universel'}
                  </button>
                  
                  <button
                    onClick={testQuickLogin}
                    disabled={loading}
                    className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ⚡ Login Rapide
                  </button>
                </div>

                {/* Utilisateurs de test rapides */}
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">👥 Tests rapides:</h3>
                  <div className="flex flex-wrap gap-2">
                    {testUsers.map((user, index) => (
                      <button
                        key={index}
                        onClick={() => testWithUser(user)}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                      >
                        {user.type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tests API */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-[#001F3F]">🌐 Tests API & Backend</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={testBackendConnection}
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  🔗 Tester Backend Django
                </button>
                
                <button
                  onClick={testAPIEndpoints}
                  className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
                >
                  🌐 Tester Endpoints API
                </button>
              </div>
            </div>
          </div>

          {/* Colonne droite: Résultats et utilitaires */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#001F3F]">📊 Résultats</h2>
                <div className="flex gap-2">
                  <button
                    onClick={checkCurrentAuth}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                  >
                    🔍 Vérifier Auth
                  </button>
                  <button
                    onClick={clearResults}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                  >
                    🧹 Effacer
                  </button>
                </div>
              </div>
              
              <div className="h-[500px] overflow-y-auto border rounded-lg p-3 bg-gray-50">
                {results.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Aucun résultat à afficher. Lancez un test!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {results.map((result) => (
                      <div
                        key={result.id}
                        className={`p-3 rounded-lg ${
                          result.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
                          result.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
                          result.type === 'warning' ? 'bg-yellow-50 border border-yellow-200 text-yellow-800' :
                          'bg-blue-50 border border-blue-200 text-blue-800'
                        }`}
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{result.message}</span>
                          <span className="text-xs text-gray-500">{result.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Utilitaires */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-[#001F3F]">⚙️ Utilitaires</h2>
              
              <div className="space-y-3">
                <button
                  onClick={clearLocalStorage}
                  className="w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                >
                  🗑️ Effacer LocalStorage
                </button>
                
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full p-3 bg-[#001F3F] text-white rounded-lg hover:bg-[#002A55] font-semibold"
                >
                  📊 Aller au Dashboard
                </button>
                
                <button
                  onClick={() => navigate('/admin')}
                  className="w-full p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-semibold"
                >
                  👑 Aller à l'Admin
                </button>
              </div>

              {/* Informations système */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">ℹ️ Informations:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Backend: http://localhost:8000</li>
                  <li>• Frontend: {window.location.origin}</li>
                  <li>• Utilisateurs dans localStorage: {Object.keys(localStorage).filter(k => k.includes('user')).length}</li>
                  <li>• Token JWT: {authService.getAccessToken() ? '✅ Présent' : '❌ Absent'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <h3 className="font-bold text-blue-800 mb-2">📝 Instructions:</h3>
          <ol className="list-decimal list-inside text-blue-700 space-y-1">
            <li>Assurez-vous que le backend Django tourne (localhost:8000)</li>
            <li>Utilisez "admin/admin123" pour vous connecter en admin</li>
            <li>Utilisez "alice/123" pour un apprenant normal</li>
            <li>Vérifiez que les endpoints API répondent</li>
            <li>Si un test échoue, vérifiez la console (F12)</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SimpleTest;