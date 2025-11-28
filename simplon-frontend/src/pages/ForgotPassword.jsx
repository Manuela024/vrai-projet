import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Veuillez entrer votre adresse email');
      return;
    }

    if (!email.includes('@')) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await authService.forgotPassword(email);
      
      if (response.success) {
        setMessage(response.message);
        setEmail('');
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col items-center justify-center bg-[#001F3F] p-4">
      <div className="layout-container flex w-full max-w-md flex-col items-center">
        
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
             Mot de passe oublié
          </h1>
          <p className="mt-2 text-center text-gray-500">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
          
          {/* Message de succès */}
          {message && (
            <div className="mt-4 w-full p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm text-center">{message}</p>
              <p className="text-green-600 text-xs text-center mt-1">
                 Le lien est valable 15 minutes - Vérifiez vos spams si vous ne voyez pas l'email
              </p>
            </div>
          )}
          
          {/* Message d'erreur */}
          {error && (
            <div className="mt-4 w-full p-3 bg-red-50 border border-red-400 rounded-lg">
              <p className="text-red-700 text-sm text-center">{error}</p>
            </div>
          )}
          
          {!message && (
            <form onSubmit={handleSubmit} className="mt-8 w-full">
              <div className="flex w-full flex-col">
                <label 
                  htmlFor="email" 
                  className="mb-2 text-base font-medium leading-normal text-[#1c0d0e]"
                >
                  Adresse email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border border-[#e9ced0] bg-[#fcf8f8] p-[15px] text-base font-normal leading-normal text-[#1c0d0e] placeholder:text-gray-400 focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors"
                  required
                  disabled={isLoading}
                />
                <p className="mt-1 text-gray-500 text-xs">
                  Vous recevrez un lien sécurisé de réinitialisation
                </p>
              </div>

              {/* Bouton de soumission */}
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
                      <span className="truncate">Envoi en cours...</span>
                    </div>
                  ) : (
                    <span className="truncate">Envoyer le lien de réinitialisation</span>
                  )}
                </button>
              </div>

              {/* Lien de retour */}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-[#E30613] hover:text-[#E30613]/80 text-sm font-medium transition-colors"
                  disabled={isLoading}
                >
                  ← Retour à la connexion
                </button>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 text-xs text-center">
                  <strong> Sécurité :</strong> Le lien expire après 15 minutes<br/>
                  <strong> Confidentialité :</strong> Nous protégeons votre vie privée
                </p>
              </div>
            </form>
          )}
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

export default ForgotPassword;