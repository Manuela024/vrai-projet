
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

const QuickLogin = () => {
  const [formData, setFormData] = useState({
    matricule: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverStatus, setServerStatus] = useState('checking');
  
  const navigate = useNavigate();

  // Vérifier si le serveur Django est démarré
  useEffect(() => {
    const checkServer = async () => {
      try {
        const isServerUp = await authService.checkDjangoServer();
        setServerStatus(isServerUp ? 'up' : 'down');
      } catch (error) {
        console.error('❌ Serveur non accessible:', error);
        setServerStatus('down');
      }
    };
    checkServer();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
    
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: ''
      });
    }
    
    if (errors.submit) {
      setErrors({});
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.matricule.trim()) {
      newErrors.matricule = 'Le matricule est requis';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 4) {
      newErrors.password = 'Le mot de passe doit contenir au moins 4 caractères';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Vérifier d'abord si le serveur est accessible
    if (serverStatus === 'down') {
      setErrors({ 
        submit: '❌ Serveur non accessible. Vérifiez que Django est démarré sur le port 8000.' 
      });
      return;
    }
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      console.log('🔄 Tentative de connexion avec:', formData.matricule);
      
      const response = await authService.quickLogin(formData.matricule, formData.password);
      
      if (response.access) {
        console.log('✅ Connexion réussie pour:', formData.matricule);
        
        // Stocker le token et rediriger
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Redirection vers le dashboard
        navigate('/dashboard');
      }
      
    } catch (error) {
      console.error('❌ Erreur connexion rapide:', error);
      
      // Gestion d'erreur améliorée
      let errorMessage = '❌ Matricule ou mot de passe incorrect';
      
      if (error.response?.data?.code === 'ACCOUNT_NOT_ACTIVATED') {
        errorMessage = "❌ Compte non activé. Utilisez 'Activer mon compte' pour créer votre compte d'abord.";
      } 
      else if (error.response?.data?.code === 'INVALID_PASSWORD') {
        errorMessage = '❌ Mot de passe incorrect';
      }
      else if (error.response?.data?.code === 'USER_NOT_FOUND') {
        errorMessage = '❌ Matricule non trouvé';
      }
      else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      else if (error.message && error.message.includes('Failed to fetch')) {
        errorMessage = '❌ Serveur non accessible. Vérifiez que Django est démarré sur le port 8000.';
      }
      else if (error.message) {
        errorMessage = error.message;
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col items-center justify-center bg-[#001F3F] p-4">
      <div className="layout-container flex w-full max-w-md flex-col items-center">
        
        {/* Indicateur de statut du serveur */}
        {serverStatus === 'checking' && (
          <div className="mb-4 w-full max-w-md bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
            <div className="inline-block animate-spin rounded-full h-3 w-3 border-2 border-yellow-400 border-t-transparent mr-2"></div>
            <span className="text-yellow-800 text-sm">
              Vérification du serveur...
            </span>
          </div>
        )}
        {serverStatus === 'down' && (
          <div className="mb-4 w-full max-w-md bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <span className="text-red-800 text-sm font-medium">
              ⚠️ Serveur non accessible
            </span>
          </div>
        )}
        
        {/* Logo */}
        <div className="mb-8">
          <img 
            alt="Logo Simplon" 
            className="h-10 w-auto" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr2Hh8RdHugKXsMlpzt87rop1Xk7oFN4AsaTJDGNvVcD-0-qG4KsdlDxRy0ThwVhSw4Hizoz1aes7JycM9gX1hZct3xMzMTIp80qMTk5gPeDUgj1WKzKYbVBEpiXK2iQqir854bGaLeunLPwOKMNl_JS9ZLr8MOO9IxysxHsJWwlVfLLl3-JAXHkpKn9C43fZE7K0cw8itQFhEXxaBqw7RrVFWlqjjqxL-fOSY9wg3vmXJfXF7nE0xC9AG2CuNcsdgn6uOkqRZl0k"
          />
        </div>
        
        {/* Formulaire */}
        <div className="layout-content-container flex w-full flex-col items-center rounded-xl bg-white p-6 sm:p-8 md:p-10 shadow-lg">
          <h1 className="text-center text-3xl font-bold leading-tight tracking-tight text-[#1c0d0e]">
            Connexion rapide
          </h1>
          <p className="mt-2 text-center text-gray-500">
            Pour les utilisateurs ayant déjà un compte
          </p>
          
          {/* Message d'erreur général */}
          {errors.submit && (
            <div className="mt-4 w-full p-3 bg-red-50 border border-red-400 rounded-lg">
              <p className="text-red-700 text-sm text-center">{errors.submit}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="mt-8 w-full">
            <div className="flex w-full flex-col gap-6">
              
              {/* Champ Matricule */}
              <div className="flex w-full flex-col">
                <label 
                  htmlFor="matricule" 
                  className="mb-2 text-base font-medium leading-normal text-[#1c0d0e]"
                >
                  Matricule Simplon
                </label>
                <input
                  id="matricule"
                  type="text"
                  placeholder="Ex: simplon_2025001"
                  value={formData.matricule}
                  onChange={handleChange}
                  className={`form-input h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border p-[15px] text-base font-normal leading-normal text-[#1c0d0e] placeholder:text-gray-400 focus:outline-0 focus:ring-2 focus:ring-primary/20 transition-colors ${
                    errors.matricule 
                      ? 'border-red-300 bg-red-50 focus:border-red-500' 
                      : 'border-[#e9ced0] bg-[#fcf8f8] focus:border-primary/50'
                  } ${serverStatus === 'down' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  required
                  disabled={isLoading || serverStatus === 'down'}
                  autoComplete="username"
                />
                {errors.matricule && (
                  <p className="mt-1 text-red-600 text-sm">{errors.matricule}</p>
                )}
              </div>

              {/* Champ Mot de passe */}
              <div className="flex w-full flex-col">
                <label 
                  htmlFor="password" 
                  className="mb-2 text-base font-medium leading-normal text-[#1c0d0e]"
                >
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Votre mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border p-[15px] text-base font-normal leading-normal text-[#1c0d0e] placeholder:text-gray-400 focus:outline-0 focus:ring-2 focus:ring-primary/20 transition-colors ${
                    errors.password 
                      ? 'border-red-300 bg-red-50 focus:border-red-500' 
                      : 'border-[#e9ced0] bg-[#fcf8f8] focus:border-primary/50'
                  } ${serverStatus === 'down' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  required
                  disabled={isLoading || serverStatus === 'down'}
                  autoComplete="current-password"
                />
                {errors.password && (
                  <p className="mt-1 text-red-600 text-sm">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Bouton de soumission */}
            <div className="mt-8 flex w-full">
              <button
                type="submit"
                disabled={isLoading || serverStatus === 'down'}
                className={`flex h-12 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg px-5 text-base font-bold leading-normal tracking-[0.015em] text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 ${
                  isLoading || serverStatus === 'down'
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#E30613] hover:bg-[#E30613]/90 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="truncate">Connexion...</span>
                  </div>
                ) : serverStatus === 'down' ? (
                  <span className="truncate">Serveur indisponible</span>
                ) : (
                  <span className="truncate">Se connecter</span>
                )}
              </button>
            </div>

            {/* Liens alternatifs */}
            <div className="mt-6 flex flex-col gap-3 text-center">
              <button
                type="button"
                onClick={() => navigate('/activate')}
                className="text-[#E30613] hover:text-[#E30613]/80 text-sm font-medium transition-colors"
                disabled={isLoading}
              >
                Activer mon compte (première connexion)
              </button>

              {/* Lien mot de passe oublié */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-[#E30613] hover:text-[#E30613]/80 text-sm font-medium transition-colors underline"
                  disabled={isLoading}
                >
                  🔐 Mot de passe oublié ?
                </button>
              </div>
              
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                disabled={isLoading}
              >
                ← Retour à l'accueil
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-gray-500">
              Pour les utilisateurs ayant déjà créé leur mot de passe.
            </p>

            {/* Informations de test */}
            {/* {serverStatus === 'up' && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
               
              </div>
            )} */}
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/70 text-sm">
            © 2025 Simplon.co - Plateforme interne
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickLogin;