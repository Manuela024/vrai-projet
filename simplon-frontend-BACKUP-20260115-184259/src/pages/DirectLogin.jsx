// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import authService from '../services/auth';

// const DirectLogin = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: ''
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData({
//       ...formData,
//       [id]: value
//     });
//     if (error) setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.username || !formData.password) {
//       setError('Veuillez remplir tous les champs');
//       return;
//     }

//     setIsLoading(true);
//     setError('');
    
//     try {
//       // Utilisez la connexion directe
//       await authService.directLogin(formData.username, formData.password);
//       navigate('/dashboard');
      
//     } catch (err) {
//       setError(err.message || 'Identifiants incorrects');
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
//             Connexion Directe
//           </h1>
//           <p className="mt-2 text-center text-gray-500">
//             Mode développement - Utilisez vos identifiants Django
//           </p>
          
//           {error && (
//             <div className="mt-4 w-full p-3 bg-red-50 border border-red-400 rounded-lg">
//               <p className="text-red-700 text-sm text-center">{error}</p>
//             </div>
//           )}
          
//           <form onSubmit={handleSubmit} className="mt-8 w-full">
//             <div className="flex w-full flex-col gap-6">
              
//               <div className="flex w-full flex-col">
//                 <label htmlFor="username" className="mb-2 text-base font-medium leading-normal text-[#1c0d0e]">
//                   Nom d'utilisateur
//                 </label>
//                 <input
//                   id="username"
//                   type="text"
//                   placeholder="stell ou test@example.com"
//                   value={formData.username}
//                   onChange={handleChange}
//                   className="form-input h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border border-[#e9ced0] bg-[#fcf8f8] p-[15px] text-base font-normal leading-normal text-[#1c0d0e] placeholder:text-gray-400 focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>

//               <div className="flex w-full flex-col">
//                 <label htmlFor="password" className="mb-2 text-base font-medium leading-normal text-[#1c0d0e]">
//                   Mot de passe
//                 </label>
//                 <input
//                   id="password"
//                   type="password"
//                   placeholder="Votre mot de passe"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="form-input h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border border-[#e9ced0] bg-[#fcf8f8] p-[15px] text-base font-normal leading-normal text-[#1c0d0e] placeholder:text-gray-400 focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>
//             </div>

//             <div className="mt-8 flex w-full">
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className={`flex h-12 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg px-5 text-base font-bold leading-normal tracking-[0.015em] text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 ${
//                   isLoading 
//                     ? 'bg-gray-400 cursor-not-allowed' 
//                     : 'bg-[#E30613] hover:bg-[#E30613]/90 hover:scale-[1.02] active:scale-[0.98]'
//                 }`}
//               >
//                 {isLoading ? (
//                   <div className="flex items-center gap-2">
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     <span>Connexion...</span>
//                   </div>
//                 ) : (
//                   <span>Se connecter</span>
//                 )}
//               </button>
//             </div>

//             <div className="mt-6 text-center">
//               <button
//                 type="button"
//                 onClick={() => navigate('/login')}
//                 className="text-[#E30613] hover:text-[#E30613]/80 text-sm font-medium transition-colors"
//               >
//                 ← Retour au login normal
//               </button>
//             </div>
// {/* Ajoutez ce code dans le formulaire de connexion, après le bouton de connexion */}
// <div className="mt-4 text-center">
//   <button
//     type="button"
//     onClick={() => navigate('/forgot-password')}
//     className="text-[#E30613] hover:text-[#E30613]/80 text-sm font-medium transition-colors underline"
//   >
//     🔐 Mot de passe oublié ?
//   </button>
// </div>
//             <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//               <p className="text-yellow-700 text-sm text-center">
//                 <strong>Mode développement:</strong><br/>
//                 Utilisez: <code>stell</code> / votre mot de passe
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DirectLogin;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// // import authService from '../services/auth';
// import authService from '../services/auth'; // ⭐ CHANGEMENT ICI

// const DirectLogin = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: ''
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData({
//       ...formData,
//       [id]: value
//     });
//     if (error) setError('');
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
    
//   //   if (!formData.username || !formData.password) {
//   //     setError('Veuillez remplir tous les champs');
//   //     return;
//   //   }

//   //   setIsLoading(true);
//   //   setError('');
    
//   //   try {
//   //     // Utilisez la connexion directe
//   //     const userData = await authService.directLogin(formData.username, formData.password);
      
//   //     // ✅ NOUVEAU CODE : Redirection selon le rôle
//   //     if (formData.username === "admin" || formData.username === "admin@simplon.com" || formData.username.includes("admin")) {
//   //       // Forcer le rôle admin
//   //       const adminUser = {
//   //         ...userData,
//   //         role: "admin",
//   //         first_name: userData.first_name || "Admin",
//   //         last_name: userData.last_name || "Simplon"
//   //       };
//   //       localStorage.setItem('user', JSON.stringify(adminUser));
//   //       console.log('🔑 Connexion admin réussie - Redirection vers /admin');
//   //       navigate('/admin');
//   //     } else {
//   //       // Vérifier si l'utilisateur a déjà un rôle admin
//   //       if (userData.role === 'admin') {
//   //         console.log('🔑 Utilisateur admin détecté - Redirection vers /admin');
//   //         navigate('/admin');
//   //       } else {
//   //         console.log('👤 Connexion utilisateur standard - Redirection vers /dashboard');
//   //         navigate('/dashboard');
//   //       }
//   //     }
      
//   //   } catch (err) {
//   //     setError(err.message || 'Identifiants incorrects');
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };
//   const handleSubmit = async (e) => {
//   e.preventDefault();
  
//   if (!formData.username || !formData.password) {
//     setError('Veuillez remplir tous les champs');
//     return;
//   }

//   // ✅ DÉTECTION ADMIN - Créer un admin temporaire si identifiants admin
//   if (formData.username === 'admin' && formData.password === 'Admin123!') {
//     const tempAdmin = {
//       id: 1,
//       username: 'admin',
//       email: 'admin@simplon.com',
//       first_name: 'Admin',
//       last_name: 'Simplon',
//       role: 'admin',
//       matricule: 'ADMIN001'
//     };
    
//     localStorage.setItem('user', JSON.stringify(tempAdmin));
//     localStorage.setItem('access_token', 'admin-token-' + Date.now());
    
//     console.log('✅ Connexion admin réussie - Redirection vers /admin');
//     navigate('/admin');
//     return;
//   }

//   setIsLoading(true);
//   setError('');
  
//   try {
//     // Connexion normale pour les autres utilisateurs
//     const userData = await authService.directLogin(formData.username, formData.password);
    
//     // ✅ Redirection selon le rôle (si le backend renvoie un rôle)
//     if (userData.role === 'admin') {
//       navigate('/admin');
//     } else {
//       navigate('/dashboard');
//     }
    
//   } catch (err) {
//     setError(err.message || 'Identifiants incorrects');
//   } finally {
//     setIsLoading(false);
//   }
// };

//   // ✅ NOUVEAU : Connexion rapide admin pour tests
//   const handleQuickAdminLogin = () => {
//     setFormData({
//       username: 'admin',
//       password: 'Admin123!'
//     });
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
//             Connexion Directe
//           </h1>
//           <p className="mt-2 text-center text-gray-500">
//             Mode développement - Utilisez vos identifiants Django
//           </p>
          
//           {/* ✅ NOUVEAU : Bouton de test admin */}
//           {/* <div className="mt-4 w-full">
//             <button
//               onClick={handleQuickAdminLogin}
//               className="w-full p-3 bg-purple-100 border border-purple-300 rounded-lg text-purple-700 text-sm font-medium hover:bg-purple-200 transition-colors"
//             >
//               🚀 Test Admin Rapide (Remplit les champs)
//             </button>
//             <p className="text-purple-600 text-xs text-center mt-1">
//               Utilisateur: <strong>admin</strong> | Mot de passe: <strong>Admin123!</strong>
//             </p>
//           </div> */}
//           {/* Indication des identifiants de test */}
// <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//   <p className="text-blue-700 text-sm text-center">
//     <strong>Identifiants de test :</strong><br/>
//     • Admin: <code>admin</code> / <code>Admin123!</code><br/>
//     • Utilisateur normal: <code>stell</code> / votre mot de passe
//   </p>
// </div>
          
//           {error && (
//             <div className="mt-4 w-full p-3 bg-red-50 border border-red-400 rounded-lg">
//               <p className="text-red-700 text-sm text-center">{error}</p>
//             </div>
//           )}
          
//           <form onSubmit={handleSubmit} className="mt-6 w-full">
//             <div className="flex w-full flex-col gap-6">
              
//               <div className="flex w-full flex-col">
//                 <label htmlFor="username" className="mb-2 text-base font-medium leading-normal text-[#1c0d0e]">
//                   Nom d'utilisateur
//                 </label>
//                 <input
//                   id="username"
//                   type="text"
//                   placeholder="stell ou test@example.com"
//                   value={formData.username}
//                   onChange={handleChange}
//                   className="form-input h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border border-[#e9ced0] bg-[#fcf8f8] p-[15px] text-base font-normal leading-normal text-[#1c0d0e] placeholder:text-gray-400 focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>

//               <div className="flex w-full flex-col">
//                 <label htmlFor="password" className="mb-2 text-base font-medium leading-normal text-[#1c0d0e]">
//                   Mot de passe
//                 </label>
//                 <input
//                   id="password"
//                   type="password"
//                   placeholder="Votre mot de passe"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="form-input h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border border-[#e9ced0] bg-[#fcf8f8] p-[15px] text-base font-normal leading-normal text-[#1c0d0e] placeholder:text-gray-400 focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>
//             </div>

//             <div className="mt-8 flex w-full">
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className={`flex h-12 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg px-5 text-base font-bold leading-normal tracking-[0.015em] text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 ${
//                   isLoading 
//                     ? 'bg-gray-400 cursor-not-allowed' 
//                     : 'bg-[#E30613] hover:bg-[#E30613]/90 hover:scale-[1.02] active:scale-[0.98]'
//                 }`}
//               >
//                 {isLoading ? (
//                   <div className="flex items-center gap-2">
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     <span>Connexion...</span>
//                   </div>
//                 ) : (
//                   <span>Se connecter</span>
//                 )}
//               </button>
//             </div>

//             <div className="mt-6 text-center">
//               <button
//                 type="button"
//                 onClick={() => navigate('/login')}
//                 className="text-[#E30613] hover:text-[#E30613]/80 text-sm font-medium transition-colors"
//               >
//                 ← Retour au login normal
//               </button>
//             </div>

//             {/* Lien mot de passe oublié */}
//             <div className="mt-4 text-center">
//               <button
//                 type="button"
//                 onClick={() => navigate('/forgot-password')}
//                 className="text-[#E30613] hover:text-[#E30613]/80 text-sm font-medium transition-colors underline"
//               >
//                 🔐 Mot de passe oublié ?
//               </button>
//             </div>

//             {/* Info mode développement */}
//             <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//               <p className="text-yellow-700 text-sm text-center">
//                 <strong>Mode développement:</strong><br/>
//                 Utilisez: <code>stell</code> / votre mot de passe<br/>
//                 <strong>Admin:</strong> <code>admin</code> / <code>Admin123!</code>
//               </p>
//             </div>

//             {/* ✅ NOUVEAU : Lien direct vers admin */}
//             <div className="mt-4 text-center">
//               <button
//                 type="button"
//                 onClick={() => navigate('/admin-login')}
//                 className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors underline"
//               >
//                 🎯 Accès administrateur dédié
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DirectLogin;


// src/pages/DirectLogin.jsx - VERSION SIMPLIFIÉE
import React, { useState } from 'react';
import authService from '../services/auth';

const DirectLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Début de la connexion...');
      
      // Appeler la connexion - elle redirigera automatiquement
      await authService.quickLogin(username, password);
      
      // Note: Le code ici ne s'exécutera pas car la redirection se fait dans authService
      // Mais on le garde pour le flux normal
      console.log('✅ Connexion en cours, redirection...');
      
    } catch (err) {
      console.error('❌ Erreur de connexion:', err.message);
      setError(err.message || 'Erreur de connexion');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Connexion Admin
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Plateforme de gestion Simplon
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="material-symbols-outlined text-red-400">error</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                    {error}
                  </h3>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom d'utilisateur
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-gray-800 dark:text-white"
                placeholder="admin"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-gray-800 dark:text-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#E30613] hover:bg-[#c40511] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E30613] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  </span>
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </div>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Comptes de test:</p>
            <p className="mt-1 text-xs font-mono">
              admin / admin123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DirectLogin;

