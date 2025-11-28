// import React, { useState, useEffect } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { authService } from '../services/auth';

// const SetupPassword = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [successMessage, setSuccessMessage] = useState('');
//   const [token, setToken] = useState('');
//   const [matricule, setMatricule] = useState('');
//   const [email, setEmail] = useState('');
//   const [createdUsername, setCreatedUsername] = useState('');
  
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   useEffect(() => {
//     // Récupérer le token, matricule et email depuis l'URL
//     const urlToken = searchParams.get('token');
//     const urlMatricule = searchParams.get('matricule');
//     const urlEmail = searchParams.get('email');
    
//     console.log('🔍 PARAMÈTRES URL RÉCUPÉRÉS:', {
//       token: urlToken ? '***' : 'null',
//       matricule: urlMatricule, 
//       email: urlEmail
//     });
    
//     // ⭐ CORRECTION : Vérification plus permissive
//     if (urlToken && urlMatricule) {
//       setToken(urlToken);
//       setMatricule(urlMatricule);
//       setEmail(urlEmail || '');
      
//       console.log('✅ Paramètres valides - Formulaire activé');
//     } else {
//       // ⭐ CORRECTION : Message plus précis
//       console.log('❌ Paramètres manquants:', {
//         token: !!urlToken,
//         matricule: !!urlMatricule,
//         email: !!urlEmail
//       });
      
//       setErrors({ 
//         general: 'Lien incomplet. Assurez-vous d\'utiliser le lien exact reçu par email.' 
//       });
//     }
//   }, [searchParams]);

//   const validateForm = () => {
//     const newErrors = {};

//     if (!username.trim()) {
//       newErrors.username = 'Le nom d\'utilisateur est requis';
//     } else if (username.length < 3) {
//       newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
//     } else if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
//       newErrors.username = 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, ., - et _';
//     }

//     if (!password) {
//       newErrors.password = 'Le mot de passe est requis';
//     } else if (password.length < 8) {
//       newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
//     }

//     if (!confirmPassword) {
//       newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
//     } else if (password !== confirmPassword) {
//       newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
//     }

//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // ⭐ CORRECTION : Vérification adaptée
//     if (!token || !matricule) {
//       setErrors({ general: 'Données d\'activation manquantes. Veuillez redemander un lien.' });
//       return;
//     }

//     const formErrors = validateForm();
//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }

//     setIsLoading(true);
//     setErrors({});
    
//     try {
//       console.log('🚀 ENVOI DES DONNÉES AU BACKEND:', {
//         token: '***',
//         matricule,
//         email,
//         username
//       });
      
//       const response = await authService.setupPassword(
//         token, 
//         matricule, 
//         email, 
//         username, 
//         password
//       );
      
//       console.log('📨 RÉPONSE DU BACKEND:', response);
      
//       if (response.success) {
//         setSuccessMessage('✅ ' + response.message);
//         setCreatedUsername(response.username);
        
//         setTimeout(() => {
//           navigate('/direct-login');
//         }, 3000);
//       } else {
//         setErrors({ 
//           general: response.message || 'Erreur lors de la création du compte' 
//         });
//       }
      
//     } catch (error) {
//       console.error('❌ ERREUR:', error);
//       setErrors({ 
//         general: error.response?.data?.message || 'Erreur de connexion au serveur' 
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="relative flex h-auto min-h-screen w-full flex-col items-center justify-center bg-[#001F3F] p-4">
//       <div className="layout-container flex w-full max-w-md flex-col items-center">
        
//         {/* Logo */}
//         <div className="mb-8">
//           <img 
//             alt="Logo Simplon" 
//             className="h-10 w-auto" 
//             src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr2Hh8RdHugKXsMlpzt87rop1Xk7oFN4AsaTJDGNvVcD-0-qG4KsdlDxRy0ThwVhSw4Hizoz1aes7JycM9gX1hZct3xMzMTIp80qMTk5gPeDUgj1WKzKYbVBEpiXK2iQqir854bGaLeunLPwOKMNl_JS9ZLr8MOO9IxysxHsJWwlVfLLl3-JAXHkpKn9C43fZE7K0cw8itQFhEXxaBqw7RrVFWlqjjqxL-fOSY9wg3vmXJfXF7nE0xC9AG2CuNcsdgn6uOkqRZl0k"
//           />
//         </div>
        
//         {/* Formulaire */}
//         <div className="layout-content-container flex w-full flex-col items-center rounded-xl bg-white p-6 sm:p-8 md:p-10 shadow-lg">
//           <h1 className="text-center text-3xl font-bold leading-tight tracking-tight text-[#1c0d0e]">
//             Créer votre compte
//           </h1>
//           <p className="mt-2 text-center text-gray-500">
//             Finalisez votre inscription
//           </p>
          
//           {/* Informations de l'utilisateur */}
//           {matricule && (
//             <div className="mt-4 w-full p-3 bg-blue-50 border border-blue-200 rounded-lg">
//               <p className="text-blue-700 text-sm text-center">
//                 <strong>Inscription pour:</strong><br/>
//                 Matricule: <strong>{matricule}</strong><br/>
//                 {email && <>Email: <strong>{email}</strong></>}
//               </p>
//             </div>
//           )}
          
//           {/* Message d'information discret */}
//           {token && (
//             <div className="mt-2 w-full">
//               <p className="text-green-600 text-xs text-center">
//                 ✅ Lien d'activation valide
//               </p>
//             </div>
//           )}
          
//           {/* Message de succès */}
//           {successMessage && (
//             <div className="mt-4 w-full p-3 bg-green-50 border border-green-200 rounded-lg">
//               <p className="text-green-700 text-sm text-center">{successMessage}</p>
//               {createdUsername && (
//                 <p className="text-green-600 text-xs text-center mt-1">
//                   <strong>Votre nom d'utilisateur:</strong> {createdUsername}<br/>
//                   Redirection vers la connexion dans 3 secondes...
//                 </p>
//               )}
//             </div>
//           )}
          
//           {/* Message d'erreur général */}
//           {errors.general && (
//             <div className="mt-4 w-full p-3 bg-red-50 border border-red-400 rounded-lg">
//               <p className="text-red-700 text-sm text-center">{errors.general}</p>
//             </div>
//           )}
          
//           {!errors.general && !successMessage && (
//             <form onSubmit={handleSubmit} className="mt-8 w-full">
//               <div className="flex w-full flex-col gap-6">
                
//                 {/* Champ Nom d'utilisateur */}
//                 <div className="flex w-full flex-col">
//                   <label 
//                     htmlFor="username" 
//                     className="mb-2 text-base font-medium leading-normal text-[#1c0d0e]"
//                   >
//                     Choisissez votre nom d'utilisateur
//                   </label>
//                   <input
//                     id="username"
//                     type="text"
//                     placeholder="Ex: manuela.simplon"
//                     value={username}
//                     onChange={(e) => {
//                       setUsername(e.target.value);
//                       if (errors.username) setErrors({...errors, username: ''});
//                     }}
//                     className={`form-input h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border p-[15px] text-base font-normal leading-normal text-[#1c0d0e] placeholder:text-gray-400 focus:outline-0 focus:ring-2 focus:ring-primary/20 transition-colors ${
//                       errors.username 
//                         ? 'border-red-300 bg-red-50 focus:border-red-500' 
//                         : 'border-[#e9ced0] bg-[#fcf8f8] focus:border-primary/50'
//                     }`}
//                     required
//                     disabled={isLoading}
//                   />
//                   {errors.username && (
//                     <p className="mt-1 text-red-600 text-sm">{errors.username}</p>
//                   )}
//                   <p className="mt-1 text-gray-500 text-xs">
//                     Lettres, chiffres, ., - et _ uniquement. Min. 3 caractères.
//                   </p>
//                 </div>

//                 {/* Champ Mot de passe */}
//                 <div className="flex w-full flex-col">
//                   <label 
//                     htmlFor="password" 
//                     className="mb-2 text-base font-medium leading-normal text-[#1c0d0e]"
//                   >
//                     Nouveau mot de passe
//                   </label>
//                   <input
//                     id="password"
//                     type="password"
//                     placeholder="Au moins 8 caractères"
//                     value={password}
//                     onChange={(e) => {
//                       setPassword(e.target.value);
//                       if (errors.password) setErrors({...errors, password: ''});
//                     }}
//                     className={`form-input h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border p-[15px] text-base font-normal leading-normal text-[#1c0d0e] placeholder:text-gray-400 focus:outline-0 focus:ring-2 focus:ring-primary/20 transition-colors ${
//                       errors.password 
//                         ? 'border-red-300 bg-red-50 focus:border-red-500' 
//                         : 'border-[#e9ced0] bg-[#fcf8f8] focus:border-primary/50'
//                     }`}
//                     required
//                     disabled={isLoading}
//                     minLength="8"
//                   />
//                   {errors.password && (
//                     <p className="mt-1 text-red-600 text-sm">{errors.password}</p>
//                   )}
//                 </div>

//                 {/* Champ Confirmation mot de passe */}
//                 <div className="flex w-full flex-col">
//                   <label 
//                     htmlFor="confirmPassword" 
//                     className="mb-2 text-base font-medium leading-normal text-[#1c0d0e]"
//                   >
//                     Confirmer le mot de passe
//                   </label>
//                   <input
//                     id="confirmPassword"
//                     type="password"
//                     placeholder="Retapez votre mot de passe"
//                     value={confirmPassword}
//                     onChange={(e) => {
//                       setConfirmPassword(e.target.value);
//                       if (errors.confirmPassword) setErrors({...errors, confirmPassword: ''});
//                     }}
//                     className={`form-input h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border p-[15px] text-base font-normal leading-normal text-[#1c0d0e] placeholder:text-gray-400 focus:outline-0 focus:ring-2 focus:ring-primary/20 transition-colors ${
//                       errors.confirmPassword 
//                         ? 'border-red-300 bg-red-50 focus:border-red-500' 
//                         : 'border-[#e9ced0] bg-[#fcf8f8] focus:border-primary/50'
//                     }`}
//                     required
//                     disabled={isLoading}
//                   />
//                   {errors.confirmPassword && (
//                     <p className="mt-1 text-red-600 text-sm">{errors.confirmPassword}</p>
//                   )}
//                 </div>
//               </div>

//               {/* Bouton de soumission */}
//               <div className="mt-8 flex w-full">
//                 <button
//                   type="submit"
//                   disabled={isLoading || !token || !matricule}
//                   className={`flex h-12 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg px-5 text-base font-bold leading-normal tracking-[0.015em] text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 ${
//                     isLoading || !token || !matricule
//                       ? 'bg-gray-400 cursor-not-allowed' 
//                       : 'bg-[#E30613] hover:bg-[#E30613]/90 hover:scale-[1.02] active:scale-[0.98]'
//                   }`}
//                 >
//                   {isLoading ? (
//                     <div className="flex items-center gap-2">
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       <span className="truncate">Création en cours...</span>
//                     </div>
//                   ) : (
//                     <span className="truncate">Créer mon compte</span>
//                   )}
//                 </button>
//               </div>

//               {/* Lien de retour */}
//               <div className="mt-6 text-center">
//                 <button
//                   type="button"
//                   onClick={() => navigate('/login')}
//                   className="text-[#E30613] hover:text-[#E30613]/80 text-sm font-medium transition-colors"
//                   disabled={isLoading}
//                 >
//                   ← Retour à la connexion
//                 </button>
//               </div>

//               <p className="mt-6 text-center text-sm text-gray-500">
//                 Après la création de votre compte, vous pourrez vous connecter avec votre nom d'utilisateur et mot de passe.
//               </p>
//             </form>
//           )}

//           {/* Lien pour se connecter après création réussie */}
//           {successMessage && (
//             <div className="mt-6 text-center">
//               <button
//                 onClick={() => navigate('/direct-login')}
//                 className="text-[#E30613] hover:text-[#E30613]/80 text-sm font-medium transition-colors underline"
//               >
//                 Me connecter maintenant
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="mt-8 text-center">
//           <p className="text-white/70 text-sm">
//             © 2025 Simplon.co - Plateforme interne
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SetupPassword;



import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/auth';

const SetupPassword = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [token, setToken] = useState('');
  const [matricule, setMatricule] = useState('');
  const [email, setEmail] = useState('');
  const [createdUsername, setCreatedUsername] = useState('');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Récupérer le token, matricule et email depuis l'URL
    const urlToken = searchParams.get('token');
    const urlMatricule = searchParams.get('matricule');
    const urlEmail = searchParams.get('email');
    
    console.log('🔍 PARAMÈTRES URL RÉCUPÉRÉS:', {
      token: urlToken ? '***' : 'null',
      matricule: urlMatricule, 
      email: urlEmail
    });
    
    // ⭐ CORRECTION : Vérification plus permissive
    if (urlToken && urlMatricule) {
      setToken(urlToken);
      setMatricule(urlMatricule);
      setEmail(urlEmail || '');
      
      console.log('✅ Paramètres valides - Formulaire activé');
    } else {
      // ⭐ CORRECTION : Message plus précis
      console.log('❌ Paramètres manquants:', {
        token: !!urlToken,
        matricule: !!urlMatricule,
        email: !!urlEmail
      });
      
      setErrors({ 
        general: 'Lien incomplet. Assurez-vous d\'utiliser le lien exact reçu par email.' 
      });
    }
  }, [searchParams]);

  // ✅ NOUVEAU : Détection automatique admin
  useEffect(() => {
    if (email === "admin@simplon.com") {
      setUsername("admin");
      console.log('🎯 Compte admin détecté - Nom d\'utilisateur pré-rempli');
    }
  }, [email]);

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    } else if (username.length < 3) {
      newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
    } else if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
      newErrors.username = 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, ., - et _';
    }

    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ⭐ CORRECTION : Vérification adaptée
    if (!token || !matricule) {
      setErrors({ general: 'Données d\'activation manquantes. Veuillez redemander un lien.' });
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
      console.log('🚀 ENVOI DES DONNÉES AU BACKEND:', {
        token: '***',
        matricule,
        email,
        username
      });
      
      const response = await authService.setupPassword(
        token, 
        matricule, 
        email, 
        username, 
        password
      );
      
      console.log('📨 RÉPONSE DU BACKEND:', response);
      
      if (response.success) {
        setSuccessMessage('✅ ' + response.message);
        setCreatedUsername(response.username);
        
        // ✅ NOUVEAU CODE : Redirection intelligente
        setTimeout(() => {
          if (username === "admin" || email === "admin@simplon.com") {
            // Simuler la connexion admin automatique
            const adminUser = {
              username: username,
              email: email,
              matricule: matricule,
              role: "admin",
              first_name: "Admin", 
              last_name: "Simplon"
            };
            localStorage.setItem('user', JSON.stringify(adminUser));
            localStorage.setItem('access_token', 'admin-token-' + Date.now());
            console.log('🎯 Compte admin créé - Redirection vers /admin');
            navigate('/admin');
          } else {
            console.log('👤 Compte utilisateur créé - Redirection vers /direct-login');
            navigate('/direct-login');
          }
        }, 2000);
      } else {
        setErrors({ 
          general: response.message || 'Erreur lors de la création du compte' 
        });
      }
      
    } catch (error) {
      console.error('❌ ERREUR:', error);
      setErrors({ 
        general: error.response?.data?.message || 'Erreur de connexion au serveur' 
      });
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
            Créer votre compte
          </h1>
          <p className="mt-2 text-center text-gray-500">
            Finalisez votre inscription
          </p>
          
          {/* ✅ NOUVEAU : Indicateur admin */}
          {(email === "admin@simplon.com" || username === "admin") && (
            <div className="mt-4 w-full p-3 bg-purple-100 border border-purple-300 rounded-lg">
              <p className="text-purple-700 text-sm text-center">
                🎯 <strong>Compte Administrateur</strong><br/>
                Vous serez redirigé vers le dashboard admin
              </p>
            </div>
          )}
          
          {/* Informations de l'utilisateur */}
          {matricule && (
            <div className="mt-4 w-full p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 text-sm text-center">
                <strong>Inscription pour:</strong><br/>
                Matricule: <strong>{matricule}</strong><br/>
                {email && <>Email: <strong>{email}</strong></>}
              </p>
            </div>
          )}
          
          {/* Message d'information discret */}
          {token && (
            <div className="mt-2 w-full">
              <p className="text-green-600 text-xs text-center">
                ✅ Lien d'activation valide
              </p>
            </div>
          )}
          
          {/* Message de succès */}
          {successMessage && (
            <div className="mt-4 w-full p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm text-center">{successMessage}</p>
              {createdUsername && (
                <p className="text-green-600 text-xs text-center mt-1">
                  <strong>Votre nom d'utilisateur:</strong> {createdUsername}<br/>
                  {username === "admin" ? (
                    <>Redirection vers le dashboard admin dans 2 secondes...</>
                  ) : (
                    <>Redirection vers la connexion dans 2 secondes...</>
                  )}
                </p>
              )}
            </div>
          )}
          
          {/* Message d'erreur général */}
          {errors.general && (
            <div className="mt-4 w-full p-3 bg-red-50 border border-red-400 rounded-lg">
              <p className="text-red-700 text-sm text-center">{errors.general}</p>
            </div>
          )}
          
          {!errors.general && !successMessage && (
            <form onSubmit={handleSubmit} className="mt-8 w-full">
              <div className="flex w-full flex-col gap-6">
                
                {/* Champ Nom d'utilisateur */}
                <div className="flex w-full flex-col">
                  <label 
                    htmlFor="username" 
                    className="mb-2 text-base font-medium leading-normal text-[#1c0d0e]"
                  >
                    Choisissez votre nom d'utilisateur
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Ex: manuela.simplon"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errors.username) setErrors({...errors, username: ''});
                    }}
                    className={`form-input h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border p-[15px] text-base font-normal leading-normal text-[#1c0d0e] placeholder:text-gray-400 focus:outline-0 focus:ring-2 focus:ring-primary/20 transition-colors ${
                      errors.username 
                        ? 'border-red-300 bg-red-50 focus:border-red-500' 
                        : 'border-[#e9ced0] bg-[#fcf8f8] focus:border-primary/50'
                    }`}
                    required
                    disabled={isLoading}
                  />
                  {errors.username && (
                    <p className="mt-1 text-red-600 text-sm">{errors.username}</p>
                  )}
                  <p className="mt-1 text-gray-500 text-xs">
                    Lettres, chiffres, ., - et _ uniquement. Min. 3 caractères.
                  </p>
                </div>

                {/* Champ Mot de passe */}
                <div className="flex w-full flex-col">
                  <label 
                    htmlFor="password" 
                    className="mb-2 text-base font-medium leading-normal text-[#1c0d0e]"
                  >
                    Nouveau mot de passe
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Au moins 8 caractères"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({...errors, password: ''});
                    }}
                    className={`form-input h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border p-[15px] text-base font-normal leading-normal text-[#1c0d0e] placeholder:text-gray-400 focus:outline-0 focus:ring-2 focus:ring-primary/20 transition-colors ${
                      errors.password 
                        ? 'border-red-300 bg-red-50 focus:border-red-500' 
                        : 'border-[#e9ced0] bg-[#fcf8f8] focus:border-primary/50'
                    }`}
                    required
                    disabled={isLoading}
                    minLength="8"
                  />
                  {errors.password && (
                    <p className="mt-1 text-red-600 text-sm">{errors.password}</p>
                  )}
                </div>

                {/* Champ Confirmation mot de passe */}
                <div className="flex w-full flex-col">
                  <label 
                    htmlFor="confirmPassword" 
                    className="mb-2 text-base font-medium leading-normal text-[#1c0d0e]"
                  >
                    Confirmer le mot de passe
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Retapez votre mot de passe"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors({...errors, confirmPassword: ''});
                    }}
                    className={`form-input h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border p-[15px] text-base font-normal leading-normal text-[#1c0d0e] placeholder:text-gray-400 focus:outline-0 focus:ring-2 focus:ring-primary/20 transition-colors ${
                      errors.confirmPassword 
                        ? 'border-red-300 bg-red-50 focus:border-red-500' 
                        : 'border-[#e9ced0] bg-[#fcf8f8] focus:border-primary/50'
                    }`}
                    required
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-red-600 text-sm">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Bouton de soumission */}
              <div className="mt-8 flex w-full">
                <button
                  type="submit"
                  disabled={isLoading || !token || !matricule}
                  className={`flex h-12 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg px-5 text-base font-bold leading-normal tracking-[0.015em] text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 ${
                    isLoading || !token || !matricule
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-[#E30613] hover:bg-[#E30613]/90 hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="truncate">Création en cours...</span>
                    </div>
                  ) : (
                    <span className="truncate">Créer mon compte</span>
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

              <p className="mt-6 text-center text-sm text-gray-500">
                Après la création de votre compte, vous pourrez vous connecter avec votre nom d'utilisateur et mot de passe.
              </p>
            </form>
          )}

          {/* Lien pour se connecter après création réussie */}
          {successMessage && username !== "admin" && (
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/direct-login')}
                className="text-[#E30613] hover:text-[#E30613]/80 text-sm font-medium transition-colors underline"
              >
                Me connecter maintenant
              </button>
            </div>
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

export default SetupPassword;


