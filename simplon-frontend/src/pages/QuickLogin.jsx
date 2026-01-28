


// src/pages/QuickLogin.jsx - VERSION OPTIMISÉE ET CORRIGÉE
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';

const QuickLogin = () => {
  const [identifiant, setIdentifiant] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDev, setShowDev] = useState(false); // Option développeur cachée
  
  const navigate = useNavigate();

  // Remplir champs rapidement (ALT + combinaison)
  const quickFill = (type) => {
    if (type === 'admin') {
      setIdentifiant('admin');
      setPassword('admin123');
    } else if (type === 'user') {
      setIdentifiant('user123');
      setPassword('password123');
    }
  };

  // Détection automatique du rôle
  const detectRole = (identifiant, userData) => {
    // Priorité 1: Rôle défini dans userData
    if (userData?.role === 'admin' || userData?.isAdmin) return 'admin';
    
    // Priorité 2: Pattern dans l'identifiant
    if (identifiant.toLowerCase().includes('admin')) return 'admin';
    if (identifiant.toLowerCase().includes('mod') || identifiant.toLowerCase().includes('manager')) return 'admin';
    
    // Priorité 3: Format numérique pour apprenants
    if (/^\d{5,8}$/.test(identifiant)) return 'user';
    
    // Par défaut: utilisateur standard
    return 'user';
  };

  // Connexion optimisée
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Mode ultra-rapide: cache les données pour réutilisation
      localStorage.setItem('last_identifiant', identifiant);
      
      // Authentification intelligente
      const result = await authService.quickLogin(identifiant, password);
      
      if (result.success) {
        // Détection du rôle en temps réel
        const role = detectRole(identifiant, result.user);
        const redirectPath = role === 'admin' ? '/admin/Admindashboard' : '/dashboard';
        
        console.log(`✅ Login réussi - Redirection: ${redirectPath}`);
        
        // Redirection instantanée
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Identifiants incorrects');
      setLoading(false);
    }
  };

  // Connexion directe sans formulaire (pour dev)
  const directLogin = (role) => {
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      const token = `fake-token-${Date.now()}`;
      const userData = role === 'admin' 
        ? { username: 'admin', role: 'admin', name: 'Admin Test' }
        : { username: 'apprenant123', role: 'user', name: 'Apprenant Test' };
      
      localStorage.setItem('simplon_access_token', token);
      localStorage.setItem('simplon_user', JSON.stringify(userData));
      navigate(role === 'admin' ? '/admin/AdminDashboard' : '/dashboard', { replace: true });
    }, 300);
  };

  // Gestion des touches rapides
  const handleKeyDown = (e) => {
    // ALT + A pour admin
    if (e.altKey && e.key === 'a') {
      e.preventDefault();
      quickFill('admin');
    }
    // ALT + U pour user
    if (e.altKey && e.key === 'u') {
      e.preventDefault();
      quickFill('user');
    }
    // CTRL + D pour dev mode
    if (e.ctrlKey && e.key === 'd') {
      e.preventDefault();
      setShowDev(!showDev);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gray-50 p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Quick Login</h1>
          <p className="text-gray-600 text-sm mt-1">Accès rapide aux dashboards</p>
        </div>

        {/* Formulaire minimal */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form onSubmit={handleLogin} className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Champs optimisés */}
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={identifiant}
                  onChange={(e) => setIdentifiant(e.target.value)}
                  placeholder="Matricule ou nom"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  autoFocus
                  required
                />
              </div>
              
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Bouton principal */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-red-700 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Connexion...
                </span>
              ) : 'Accéder'}
            </button>

            {/* Mode développeur caché */}
            {showDev && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-3">🔧 Mode développement</p>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => directLogin('admin')}
                    className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm rounded-lg transition-colors"
                  >
                    Admin Direct
                  </button>
                  <button
                    type="button"
                    onClick={() => directLogin('user')}
                    className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm rounded-lg transition-colors"
                  >
                    User Direct
                  </button>
                </div>
                
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => quickFill('admin')}
                    className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors"
                  >
                    Remplir Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => quickFill('user')}
                    className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors"
                  >
                    Remplir User
                  </button>
                </div>
                
                <p className="mt-3 text-xs text-gray-400">
                  Raccourcis: ALT+A (Admin) • ALT+U (User) • CTRL+D (Dev)
                </p>
              </div>
            )}
            
            {/* Info discrète */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Appuyez sur <span className="font-mono">CTRL+D</span> pour le mode développeur
              </p>
            </div>
          </form>
        </div>

        {/* Footer léger */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            © Simplon • v2.0 • {new Date().toLocaleDateString()}
          </p>
          <div className="mt-2 flex justify-center space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Accueil
            </button>
            <button 
              onClick={() => localStorage.clear()}
              className="text-xs text-gray-500 hover:text-red-500"
            >
              Clear Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickLogin;