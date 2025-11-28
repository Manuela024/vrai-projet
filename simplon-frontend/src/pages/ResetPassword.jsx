import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/auth';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const urlToken = searchParams.get('token');
    const urlEmail = searchParams.get('email');
    
    if (urlToken && urlEmail) {
      setToken(urlToken);
      setEmail(urlEmail);
    } else {
      setError('Lien de réinitialisation invalide ou incomplet');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token || !email) {
      setError('Données de réinitialisation manquantes');
      return;
    }

    if (!newPassword) {
      setError('Le nouveau mot de passe est requis');
      return;
    }

    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authService.resetPassword(token, email, newPassword);
      
      if (response.success) {
        setMessage(response.message);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('Erreur lors de la réinitialisation. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col items-center justify-center bg-[#001F3F] p-4">
      <div className="layout-container flex w-full max-w-md flex-col items-center">
        
        <div className="mb-8">
          <img 
            alt="Logo Simplon" 
            className="h-10 w-auto" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr2Hh8RdHugKXsMlpzt87rop1Xk7oFN4AsaTJDGNvVcD-0-qG4KsdlDxRy0ThwVhSw4Hizoz1aes7JycM9gX1hZct3xMzMTIp80qMTk5gPeDUgj1WKzKYbVBEpiXK2iQqir854bGaLeunLPwOKMNl_JS9ZLr8MOO9IxysxHsJWwlVfLLl3-JAXHkpKn9C43fZE7K0cw8itQFhEXxaBqw7RrVFWlqjjqxL-fOSY9wg3vmXJfXF7nE0xC9AG2CuNcsdgn6uOkqRZl0k"
          />
        </div>
        
        <div className="layout-content-container flex w-full flex-col items-center rounded-xl bg-white p-6 sm:p-8 md:p-10 shadow-lg">
          <h1 className="text-center text-3xl font-bold leading-tight tracking-tight text-[#1c0d0e]">
            🔑 Nouveau mot de passe
          </h1>
          <p className="mt-2 text-center text-gray-500">
            Choisissez votre nouveau mot de passe sécurisé
          </p>
          
          {message && (
            <div className="mt-4 w-full p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm text-center">{message}</p>
              <p className="text-green-600 text-xs text-center mt-1">
                Redirection vers la connexion dans 3 secondes...
              </p>
            </div>
          )}
          
          {error && (
            <div className="mt-4 w-full p-3 bg-red-50 border border-red-400 rounded-lg">
              <p className="text-red-700 text-sm text-center">{error}</p>
            </div>
          )}
          
          {!message && token && email && (
            <form onSubmit={handleSubmit} className="mt-8 w-full">
              <div className="flex w-full flex-col gap-6">
                
                <div className="flex w-full flex-col">
                  <label htmlFor="newPassword" className="mb-2 text-base font-medium leading-normal text-[#1c0d0e]">
                    Nouveau mot de passe
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    placeholder="Au moins 8 caractères"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="form-input h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border border-[#e9ced0] bg-[#fcf8f8] p-[15px] text-base font-normal leading-normal text-[#1c0d0e] placeholder:text-gray-400 focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors"
                    required
                    disabled={isLoading}
                    minLength="8"
                    autoComplete="new-password"
                  />
                </div>

                <div className="flex w-full flex-col">
                  <label htmlFor="confirmPassword" className="mb-2 text-base font-medium leading-normal text-[#1c0d0e]">
                    Confirmer le mot de passe
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Retapez votre mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border border-[#e9ced0] bg-[#fcf8f8] p-[15px] text-base font-normal leading-normal text-[#1c0d0e] placeholder:text-gray-400 focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors"
                    required
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="mt-8 flex w-full">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex h-12 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg px-5 text-base font-bold leading-normal tracking-[0.015em] text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-[#E30613] hover:bg-[#E30613]/90 hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="truncate">Réinitialisation...</span>
                    </div>
                  ) : (
                    <span className="truncate">Réinitialiser le mot de passe</span>
                  )}
                </button>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-700 text-xs text-center">
                  <strong>⏰ Attention :</strong> Cette page expire dans 15 minutes<br/>
                  <strong>🔒 Sécurité :</strong> Votre ancien mot de passe sera immédiatement invalidé
                </p>
              </div>
            </form>
          )}

          {error && !token && (
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/login')}
                className="text-[#E30613] hover:text-[#E30613]/80 text-sm font-medium transition-colors underline"
              >
                Retour à la connexion
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/70 text-sm">
            © 2024 Simplon.co - Plateforme interne
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;