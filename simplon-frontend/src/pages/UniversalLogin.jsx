// src/pages/UniversalLogin.jsx - PAGE DE CONNEXION UNIQUE
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import {
  LogIn,
  User,
  Lock,
  Mail,
  GraduationCap,
  Shield,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

const UniversalLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginMode, setLoginMode] = useState('auto'); // 'auto', 'admin', 'apprenant'
  
  const navigate = useNavigate();

  // 🎯 Détection automatique du type d'identifiant
  const detectLoginType = (identifier) => {
    // Si c'est un matricule simplon (ex: simplon_2025001, 2025001)
    const isMatricule = /^(simplon_)?\d{7}$/.test(identifier) || 
                       /^\d{7}$/.test(identifier) ||
                       identifier.includes('simplon_');
    
    // Si c'est un nom d'admin connu
    const isAdminUsername = ['admin', 'admin_user', 'admin_simplon'].includes(identifier);
    
    // Si c'est un email (contient @)
    const isEmail = identifier.includes('@');
    
    if (isAdminUsername) return 'admin';
    if (isMatricule) return 'apprenant';
    if (isEmail) return 'email';
    return 'username'; // Par défaut
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!identifier.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }

    try {
      console.log('🔐 Connexion en cours...');
      console.log('📝 Identifiant:', identifier);
      console.log('👑 Mode détecté:', detectLoginType(identifier));
      
      // Utiliser le service d'authentification universel
      const result = await authService.universalLogin(identifier, password);
      
      console.log('✅ Résultat:', result);
      
      if (result.success) {
        // Rediriger vers le dashboard approprié
        const redirectTo = result.redirect_to || 
                          (result.user.role === 'admin' ? '/admin' : '/dashboard');
        
        console.log('📍 Redirection vers:', redirectTo);
        
        setTimeout(() => {
          navigate(redirectTo);
        }, 100);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error('❌ Erreur:', err);
      
      let errorMessage = err.message || 'Erreur de connexion';
      
      // Messages d'erreur plus précis
      if (errorMessage.includes('Identifiant ou mot de passe incorrect')) {
        errorMessage = 'Identifiant ou mot de passe incorrect. Vérifiez vos informations.';
      } else if (errorMessage.includes('non trouvé')) {
        errorMessage = 'Ce matricule n\'est pas enregistré dans le système.';
      } else if (errorMessage.includes('Serveur non accessible')) {
        errorMessage = 'Le serveur Django n\'est pas accessible. Vérifiez qu\'il est en cours d\'exécution.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Remplir avec des identifiants de test
  const fillTestCredentials = (type) => {
    if (type === 'admin') {
      setIdentifier('admin');
      setPassword('admin123');
      setLoginMode('admin');
      console.log('👑 Mode admin activé');
    } else if (type === 'apprenant') {
      setIdentifier('simplon_2025002');
      setPassword('password123');
      setLoginMode('apprenant');
      console.log('🎓 Mode apprenant activé');
    }
  };

  // 🎯 Vérifier l'état actuel de l'authentification
  const checkAuthStatus = () => {
    const token = localStorage.getItem('access_token');
    const user = authService.getCurrentUser();
    const isAdmin = authService.isAdmin();
    
    let message = '🔍 État d\'authentification :\n\n';
    message += `Token: ${token ? '✅ PRÉSENT' : '❌ ABSENT'}\n`;
    message += `Connecté: ${authService.isAuthenticated() ? '✅ OUI' : '❌ NON'}\n`;
    
    if (user) {
      message += `\nUtilisateur:\n`;
      message += `- Nom: ${user.username}\n`;
      message += `- Email: ${user.email || 'N/A'}\n`;
      message += `- Rôle: ${user.role || 'non spécifié'}\n`;
      message += `- Admin: ${isAdmin ? '✅ OUI' : '❌ NON'}\n`;
      message += `- Staff: ${user.is_staff ? '✅ OUI' : '❌ NON'}\n`;
      message += `- Superuser: ${user.is_superuser ? '✅ OUI' : '❌ NON'}`;
    }
    
    alert(message);
  };

  // 🎯 Déconnexion
  const handleLogout = () => {
    authService.logout();
    alert('✅ Déconnexion effectuée');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#E30613] to-red-600 rounded-full mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Plateforme Simplon</h1>
          <p className="text-gray-600 mt-2">Connexion unique - Administration et Apprenants</p>
        </div>

        {/* Carte de connexion */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Indicateur de mode */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {loginMode === 'admin' ? (
                  <>
                    <Shield className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">Mode Administration</span>
                  </>
                ) : loginMode === 'apprenant' ? (
                  <>
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Mode Apprenant</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Mode Auto</span>
                  </>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLoginMode('auto')}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    loginMode === 'auto' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Auto
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMode('admin')}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    loginMode === 'admin' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMode('apprenant')}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    loginMode === 'apprenant' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Apprenant
                </button>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Messages d'erreur */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Champ Identifiant */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  Identifiant
                </div>
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setLoginMode(detectLoginType(e.target.value));
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] transition-colors"
                placeholder={
                  loginMode === 'admin' ? 'Nom d\'utilisateur admin' :
                  loginMode === 'apprenant' ? 'Matricule (ex: simplon_2025001)' :
                  'Nom d\'utilisateur ou matricule'
                }
                required
              />
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  Mot de passe
                </div>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] transition-colors pr-10"
                  placeholder="Votre mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#E30613] to-red-600 text-white py-3 px-4 rounded-lg font-bold hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Connexion en cours...
                </div>
              ) : (
                'Se connecter'
              )}
            </button>

            {/* Identifiants de test */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">
                🔧 Identifiants de test :
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => fillTestCredentials('admin')}
                  className="flex items-center justify-center gap-2 py-2 px-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-medium transition-colors text-sm"
                >
                  <Shield className="w-4 h-4" />
                  Admin Test
                </button>
                <button
                  type="button"
                  onClick={() => fillTestCredentials('apprenant')}
                  className="flex items-center justify-center gap-2 py-2 px-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors text-sm"
                >
                  <GraduationCap className="w-4 h-4" />
                  Apprenant Test
                </button>
              </div>
            </div>

            {/* Outils de développement */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={checkAuthStatus}
                className="w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
              >
                🔍 Vérifier état d'authentification
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  className="py-2 px-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm transition-colors"
                >
                  Admin Dashboard
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            </div>

            {/* Informations */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>💡 <strong>Admins :</strong> Utilisez votre nom d'utilisateur Django</p>
              <p>💡 <strong>Apprenants :</strong> Utilisez votre matricule Simplon</p>
              <p>📝 <strong>Activation :</strong> Les nouveaux apprenants doivent d'abord activer leur compte via la page d'activation.</p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>© 2025 Simplon - Plateforme de gestion interne</p>
          <div className="flex justify-center gap-4 mt-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-[#E30613] hover:text-[#E30613]/80"
            >
              Accueil
            </button>
            <button
              type="button"
              onClick={() => navigate('/activation')}
              className="text-[#E30613] hover:text-[#E30613]/80"
            >
              Activation compte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalLogin;