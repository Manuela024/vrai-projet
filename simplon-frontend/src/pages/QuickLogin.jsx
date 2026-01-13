
// // src/pages/QuickLogin.jsx - VERSION COMPLÈTE ET CORRIGÉE
// import React, { useState } from 'react';
// import authService from '../services/auth';

// const QuickLogin = () => {
//   const [matricule, setMatricule] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [mode, setMode] = useState('mock'); // 'api', 'mock'

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     if (!matricule.trim() || !password.trim()) {
//       setError('Veuillez entrer votre matricule et mot de passe');
//       setLoading(false);
//       return;
//     }

//     try {
//       console.log('🔐 Tentative de connexion...');
      
//       // Nettoyer d'abord
//       localStorage.clear();
      
//       // Déterminer si admin
//       const isAdmin = matricule.toLowerCase().includes('admin') || 
//                      matricule === 'simplon_admin' ||
//                      matricule.startsWith('admin');
      
//       // Créer l'utilisateur
//       const user = {
//         id: isAdmin ? 1 : 2,
//         username: matricule,
//         email: `${matricule}@simplon.com`,
//         first_name: isAdmin ? 'Admin' : 'User',
//         last_name: 'Test',
//         is_staff: isAdmin,
//         is_superuser: isAdmin,
//         isAdmin: isAdmin,
//         role: isAdmin ? 'admin' : 'user',
//         cohort: 'Simplon 2024'
//       };
      
//       // Stocker dans localStorage
//       localStorage.setItem('user', JSON.stringify(user));
//       localStorage.setItem('access_token', 'token_' + Date.now());
//       localStorage.setItem('refresh_token', 'refresh_' + Date.now());
      
//       console.log('✅ Utilisateur créé et stocké:', user);
//       console.log('🔑 Token stocké:', localStorage.getItem('access_token'));
      
//       // Vérifier que c'est bien stocké
//       const storedUser = localStorage.getItem('user');
//       const storedToken = localStorage.getItem('access_token');
      
//       if (!storedUser || !storedToken) {
//         throw new Error('Erreur lors du stockage des données');
//       }
      
//       // Vérification via authService
//       console.log('🔍 Vérification authService:');
//       console.log('- isAuthenticated:', authService.isAuthenticated());
//       console.log('- isAdmin:', authService.isAdmin());
//       console.log('- getCurrentUser:', authService.getCurrentUser());
      
//       // Attendre un peu
//       await new Promise(resolve => setTimeout(resolve, 300));
      
//       // Redirection
//       if (isAdmin) {
//         console.log('🚀 Redirection vers /admin');
//         window.location.href = '/admin';
//       } else {
//         console.log('🚀 Redirection vers /dashboard');
//         window.location.href = '/dashboard';
//       }
      
//     } catch (err) {
//       console.error('❌ Erreur:', err);
//       setError(err.message || 'Erreur de connexion');
//       setLoading(false);
//     }
//   };

//   // Remplir pour test
//   const fillAdminCredentials = () => {
//     setMatricule('admin');
//     setPassword('admin123');
//     setMode('mock');
//   };

//   const fillUserCredentials = () => {
//     setMatricule('user123');
//     setPassword('password123');
//     setMode('mock');
//   };

//   // Connexion directe sans formulaire
//   const directAdminLogin = () => {
//     localStorage.clear();
//     const adminUser = {
//       id: 1,
//       username: 'admin',
//       email: 'admin@simplon.com',
//       is_staff: true,
//       is_superuser: true,
//       isAdmin: true
//     };
    
//     localStorage.setItem('user', JSON.stringify(adminUser));
//     localStorage.setItem('access_token', 'direct_admin_token');
    
//     console.log('👑 Admin direct créé');
//     window.location.href = '/admin';
//   };

//   const directUserLogin = () => {
//     localStorage.clear();
//     const normalUser = {
//       id: 2,
//       username: 'user123',
//       email: 'user@simplon.com',
//       is_staff: false,
//       is_superuser: false,
//       isAdmin: false
//     };
    
//     localStorage.setItem('user', JSON.stringify(normalUser));
//     localStorage.setItem('access_token', 'direct_user_token');
    
//     console.log('👤 Utilisateur direct créé');
//     window.location.href = '/dashboard';
//   };

//   // Vérifier l'état actuel
//   const checkAuthStatus = () => {
//     console.log('🔍 État actuel de l\'authentification:');
//     console.log('User:', localStorage.getItem('user'));
//     console.log('Token:', localStorage.getItem('access_token'));
//     console.log('isAuthenticated:', authService.isAuthenticated());
//     console.log('isAdmin:', authService.isAdmin());
    
//     const userStr = localStorage.getItem('user');
//     if (userStr) {
//       try {
//         const user = JSON.parse(userStr);
//         alert(`Utilisateur: ${user.username}\nAdmin: ${user.isAdmin ? 'OUI' : 'NON'}`);
//       } catch (e) {
//         alert('Erreur de lecture des données');
//       }
//     } else {
//       alert('Aucun utilisateur connecté');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
//       <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        
//         {/* En-tête */}
//         <div className="bg-gradient-to-r from-[#E30613] to-[#ff6b6b] p-6 text-center text-white">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
//             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
//             </svg>
//           </div>
//           <h1 className="text-2xl font-bold">Connexion Simplon</h1>
//           <p className="text-sm opacity-90 mt-1">Mode Développement - Connexion directe</p>
//         </div>

//         {/* Formulaire */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {error && (
//             <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
//               <div className="flex items-center">
//                 <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//                 <span className="text-red-700">{error}</span>
//               </div>
//             </div>
//           )}

//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Matricule
//               </label>
//               <input
//                 type="text"
//                 value={matricule}
//                 onChange={(e) => setMatricule(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] transition-colors"
//                 placeholder="admin ou user123"
//                 required
//                 autoComplete="username"
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 Utilisez "admin" pour accéder au dashboard admin
//               </p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Mot de passe
//               </label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] transition-colors"
//                 placeholder="N'importe quel mot de passe"
//                 required
//                 autoComplete="current-password"
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 En mode développement, n'importe quel mot de passe fonctionne
//               </p>
//             </div>
//           </div>

//           {/* Bouton principal */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-[#E30613] to-[#ff6b6b] text-white py-3 px-4 rounded-lg font-bold hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
//           >
//             {loading ? (
//               <div className="flex items-center justify-center">
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Connexion en cours...
//               </div>
//             ) : (
//               'Se connecter'
//             )}
//           </button>

//           {/* Options de test RAPIDES */}
//           <div className="pt-4 border-t border-gray-200">
//             <p className="text-sm font-medium text-gray-700 mb-3">
//               ⚡ Connexions directes (sans formulaire) :
//             </p>
            
//             <div className="grid grid-cols-2 gap-3 mb-4">
//               <button
//                 type="button"
//                 onClick={directAdminLogin}
//                 className="py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
//               >
//                 👑 Admin Direct
//               </button>
//               <button
//                 type="button"
//                 onClick={directUserLogin}
//                 className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
//               >
//                 👤 User Direct
//               </button>
//             </div>
            
//             <div className="grid grid-cols-2 gap-3 mb-4">
//               <button
//                 type="button"
//                 onClick={fillAdminCredentials}
//                 className="py-2 px-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors"
//               >
//                 Remplir (Admin)
//               </button>
//               <button
//                 type="button"
//                 onClick={fillUserCredentials}
//                 className="py-2 px-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors"
//               >
//                 Remplir (User)
//               </button>
//             </div>
            
//             <div className="space-y-2">
//               <button
//                 type="button"
//                 onClick={checkAuthStatus}
//                 className="w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
//               >
//                 🔍 Vérifier état connexion
//               </button>
              
//               <button
//                 type="button"
//                 onClick={() => window.location.href = '/dashboard'}
//                 className="w-full py-2 px-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-medium transition-colors"
//               >
//                 🚀 Aller au dashboard
//               </button>
//             </div>
//           </div>

//           {/* Instructions */}
//           <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//             <h4 className="text-sm font-semibold text-blue-800 mb-2">
//               ℹ️ Instructions :
//             </h4>
//             <ul className="text-xs text-blue-700 space-y-1">
//               <li>• <strong>Admin</strong> : Utilisez "admin" comme matricule</li>
//               <li>• <strong>Utilisateur</strong> : Utilisez "user123" ou autre</li>
//               <li>• <strong>Redirection</strong> : Automatique selon le rôle</li>
//               <li>• <strong>Mode développement</strong> : Pas besoin de backend</li>
//               <li>• <strong>Problème ?</strong> Utilisez "Connexions directes"</li>
//             </ul>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default QuickLogin;



// // src/pages/QuickLogin.jsx - VERSION AVEC VRAI PROCESSUS
// import React, { useState } from 'react';
// import authService from '../services/auth';

// const QuickLogin = () => {
//   const [matricule, setMatricule] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [mode, setMode] = useState('auto'); // 'auto', 'api', 'mock'

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     // Validation
//     if (!matricule.trim() || !password.trim()) {
//       setError('Veuillez entrer votre matricule et mot de passe');
//       setLoading(false);
//       return;
//     }

//     try {
//       console.log('🔐 Début processus authentification...');
      
//       let result;
      
//       if (mode === 'api') {
//         // Force l'API Django (vérification réelle)
//         console.log('🔍 Mode API Django activé');
//         result = await authService.login(matricule, password);
//       } else if (mode === 'mock') {
//         // Force la simulation
//         console.log('🎭 Mode simulation activé');
//         result = await authService.mockLogin(matricule, password);
//       } else {
//         // Auto: essaie API, sinon simulation
//         console.log('⚡ Mode auto: essaie API puis simulation');
//         result = await authService.quickLogin(matricule, password);
//       }
      
//       if (result.success) {
//         const user = result.user;
//         const isAdmin = authService.isAdmin();
        
//         console.log('✅ Authentification réussie!');
//         console.log('👤 Utilisateur:', user.username);
//         console.log('👑 Rôle:', isAdmin ? 'ADMIN' : 'UTILISATEUR');
        
//         // Redirection selon le rôle
//         setTimeout(() => {
//           if (isAdmin) {
//             console.log('🚀 Redirection vers /admin');
//             window.location.href = '/admin';
//           } else {
//             console.log('🚀 Redirection vers /dashboard');
//             window.location.href = '/dashboard';
//           }
//         }, 500);
//       }
      
//     } catch (err) {
//       console.error('❌ Échec authentification:', err);
//       setError(err.message || 'Erreur de connexion');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Remplir avec des identifiants VALIDES (pour simulation)
//   const fillAdminCredentials = () => {
//     setMatricule('admin');
//     setPassword('admin123');
//     setMode('mock');
//   };

//   const fillUserCredentials = () => {
//     setMatricule('user123');
//     setPassword('password123');
//     setMode('mock');
//   };

//   // Tester la connexion API réelle
//   const testApiConnection = async () => {
//     try {
//       setLoading(true);
//       // Tester avec des identifiants bidons pour voir si l'API répond
//       await authService.login('test', 'test');
//     } catch (error) {
//       if (error.message.includes('non accessible')) {
//         alert('❌ Serveur Django non accessible sur localhost:8000\n\nUtilisez le mode simulation.');
//       } else if (error.message.includes('incorrect')) {
//         alert('✅ API Django fonctionne mais identifiants incorrects\n\nC\'est normal, l\'API répond correctement.');
//       } else {
//         alert(`⚠️ ${error.message}\n\nUtilisez le mode simulation pour le développement.`);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
//       <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        
//         <div className="bg-gradient-to-r from-[#E30613] to-[#ff6b6b] p-6 text-center text-white">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
//             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
//             </svg>
//           </div>
//           <h1 className="text-2xl font-bold">Connexion Simplon</h1>
//           <p className="text-sm opacity-90 mt-1">Vérification dans la base de données</p>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {error && (
//             <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
//               <div className="flex items-center">
//                 <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//                 <span className="text-red-700">{error}</span>
//               </div>
//             </div>
//           )}

//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Matricule
//               </label>
//               <input
//                 type="text"
//                 value={matricule}
//                 onChange={(e) => setMatricule(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] transition-colors"
//                 placeholder="Votre matricule"
//                 required
//                 autoComplete="username"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Mot de passe
//               </label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] transition-colors"
//                 placeholder="Votre mot de passe"
//                 required
//                 autoComplete="current-password"
//               />
//             </div>
//           </div>

//           {/* Mode de connexion */}
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Mode de connexion
//             </label>
//             <div className="flex gap-2">
//               {[
//                 { value: 'auto', label: 'Auto', desc: 'API puis simulation' },
//                 { value: 'api', label: 'API Django', desc: 'Vérification réelle BD' },
//                 { value: 'mock', label: 'Simulation', desc: 'Pour développement' }
//               ].map((option) => (
//                 <button
//                   key={option.value}
//                   type="button"
//                   onClick={() => setMode(option.value)}
//                   className={`flex-1 text-center py-2 px-3 rounded-lg border transition-colors ${
//                     mode === option.value
//                       ? 'bg-[#E30613] text-white border-[#E30613]'
//                       : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
//                   }`}
//                 >
//                   <div className="font-medium">{option.label}</div>
//                   <div className="text-xs opacity-75">{option.desc}</div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Bouton principal */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-[#E30613] to-[#ff6b6b] text-white py-3 px-4 rounded-lg font-bold hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
//           >
//             {loading ? (
//               <div className="flex items-center justify-center">
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Vérification en cours...
//               </div>
//             ) : (
//               'Se connecter'
//             )}
//           </button>

//           {/* Options de test */}
//           <div className="pt-4 border-t border-gray-200">
//             <p className="text-sm font-medium text-gray-700 mb-3">
//               🔧 Identifiants de test (simulation) :
//             </p>
            
//             <div className="grid grid-cols-2 gap-3 mb-4">
//               <button
//                 type="button"
//                 onClick={fillAdminCredentials}
//                 className="py-2 px-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors"
//               >
//                 Admin (admin/admin123)
//               </button>
//               <button
//                 type="button"
//                 onClick={fillUserCredentials}
//                 className="py-2 px-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors"
//               >
//                 User (user123/password123)
//               </button>
//             </div>
            
//             <div className="space-y-2">
//               <button
//                 type="button"
//                 onClick={testApiConnection}
//                 className="w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
//               >
//                 🔍 Tester connexion API Django
//               </button>
              
//               <p className="text-xs text-gray-500 text-center">
//                 Les identifiants invalides seront rejetés
//               </p>
//             </div>
//           </div>

//           {/* Info processus */}
//           <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//             <h4 className="text-sm font-semibold text-blue-800 mb-2">
//               ℹ️ Processus d'authentification :
//             </h4>
//             <ol className="text-xs text-blue-700 space-y-1 list-decimal pl-4">
//               <li>Saisie matricule/mot de passe</li>
//               <li>Vérification dans la base de données</li>
//               <li>Si valide → vérification rôle (admin/user)</li>
//               <li>Redirection vers le bon dashboard</li>
//               <li>Si invalide → message d'erreur</li>
//             </ol>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default QuickLogin;

// // src/pages/QuickLogin.jsx - VERSION COMPLÈTE CORRIGÉE
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import authService from '../services/auth';

// const QuickLogin = () => {
//   const [matricule, setMatricule] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [mode, setMode] = useState('mock'); // 'auto', 'api', 'mock'
  
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     // Validation
//     if (!matricule.trim() || !password.trim()) {
//       setError('Veuillez entrer votre matricule et mot de passe');
//       setLoading(false);
//       return;
//     }

//     try {
//       console.log('🔐 Début processus authentification...');
//       console.log('📝 Identifiants:', { matricule, password, mode });
      
//       let result;
      
//       if (mode === 'api') {
//         // Force l'API Django (vérification réelle)
//         console.log('🔍 Mode API Django activé');
//         result = await authService.login(matricule, password);
//       } else if (mode === 'mock') {
//         // Force la simulation
//         console.log('🎭 Mode simulation activé');
//         result = await authService.mockLogin(matricule, password);
//       } else {
//         // Auto: essaie API, sinon simulation
//         console.log('⚡ Mode auto: essaie API puis simulation');
//         result = await authService.quickLogin(matricule, password);
//       }
      
//       console.log('✅ Résultat authService:', result);
      
//       if (result.success) {
//         const user = result.user;
        
//         // DÉTERMINER SI C'EST UN ADMIN OU UN UTILISATEUR
//         // 1. Vérifier par le rôle spécifique
//         const isAdmin = user.role === 'admin' || user.isAdmin === true;
        
//         // 2. Vérifier par le matricule (fallback)
//         const isAdminByMatricule = matricule.toLowerCase().includes('admin');
        
//         // 3. Vérifier via authService
//         const authServiceIsAdmin = authService.isAdmin();
        
//         // Décision finale
//         const finalIsAdmin = isAdmin || isAdminByMatricule || authServiceIsAdmin;
        
//         console.log('👑 Détection rôle:');
//         console.log('   - Par rôle user:', isAdmin ? 'ADMIN' : 'USER');
//         console.log('   - Par matricule:', isAdminByMatricule ? 'ADMIN' : 'USER');
//         console.log('   - Par authService:', authServiceIsAdmin ? 'ADMIN' : 'USER');
//         console.log('   - Final:', finalIsAdmin ? 'ADMIN' : 'USER');
        
//         // DEBUG : Vérifier ce qui est stocké
//         console.log('🔍 DEBUG - Après authService:');
//         console.log('📦 localStorage keys:', Object.keys(localStorage));
        
//         const storedToken = localStorage.getItem('simplon_access_token') || localStorage.getItem('token');
//         const storedUser = localStorage.getItem('simplon_user') || localStorage.getItem('user');
        
//         console.log('🔐 Token stocké:', storedToken ? '✅ OUI' : '❌ NON');
//         console.log('👤 User stocké:', storedUser ? '✅ ' + storedUser.substring(0, 100) + '...' : '❌ NON');
        
//         // REDIRECTION CORRECTE
//         setTimeout(() => {
//           if (finalIsAdmin) {
//             console.log('🚀 Admin détecté - Redirection vers /admin (AdminDashboard.jsx)');
//             navigate('/admin'); // PAGE DASHBOARD ADMIN
//           } else {
//             console.log('🚀 Utilisateur normal - Redirection vers /dashboard (Dashboard.jsx)');
//             navigate('/dashboard'); // DASHBOARD UTILISATEUR
//           }
//         }, 150);
//       } else {
//         throw new Error(result.message || 'Authentification échouée');
//       }
      
//     } catch (err) {
//       console.error('❌ Échec authentification:', err);
//       setError(err.message || 'Erreur de connexion. Vérifiez vos identifiants.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Remplir avec des identifiants VALIDES (pour simulation)
//   const fillAdminCredentials = () => {
//     setMatricule('admin');
//     setPassword('admin123');
//     setMode('mock');
//     console.log('👑 Identifiants admin remplis');
//     console.log('   -> Redirigera vers /admin (AdminDashboard.jsx)');
//   };

//   const fillUserCredentials = () => {
//     setMatricule('user123');
//     setPassword('password123');
//     setMode('mock');
//     console.log('👤 Identifiants user remplis');
//     console.log('   -> Redirigera vers /dashboard (Dashboard.jsx)');
//   };

//   // TEST MANUEL : Set auth directement
//   const setManualAuth = (role) => {
//     if (role === 'admin') {
//       localStorage.setItem('simplon_access_token', 'fake-admin-token-' + Date.now());
//       localStorage.setItem('simplon_user', JSON.stringify({
//         username: 'admin',
//         role: 'admin',
//         email: 'admin@simplon.com',
//         name: 'Administrateur',
//         isAdmin: true
//       }));
//       console.log('👑 Auth admin manuelle configurée');
//       alert('✅ Auth ADMIN configurée!\nRedirigez vers /admin (AdminDashboard.jsx)');
//     } else {
//       localStorage.setItem('simplon_access_token', 'fake-user-token-' + Date.now());
//       localStorage.setItem('simplon_user', JSON.stringify({
//         username: 'user123',
//         role: 'user',
//         email: 'user@simplon.com',
//         name: 'Utilisateur Test',
//         isAdmin: false
//       }));
//       console.log('👤 Auth user manuelle configurée');
//       alert('✅ Auth USER configurée!\nRedirigez vers /dashboard (Dashboard.jsx)');
//     }
    
//     // Afficher ce qui est stocké
//     console.log('📦 localStorage après config manuelle:', Object.keys(localStorage));
//     console.log('🔐 Token:', localStorage.getItem('simplon_access_token'));
//     console.log('👤 User:', localStorage.getItem('simplon_user'));
//   };

//   // Tester la connexion API réelle
//   const testApiConnection = async () => {
//     try {
//       setLoading(true);
//       // Tester avec des identifiants bidons pour voir si l'API répond
//       const result = await authService.login('test', 'test');
//       console.log('🔍 Test API result:', result);
      
//       if (result.success) {
//         alert('✅ API Django fonctionne et accepte les identifiants!');
//       } else {
//         alert('⚠️ API répond mais identifiants incorrects\n\nC\'est normal pour le test.');
//       }
//     } catch (error) {
//       if (error.message.includes('non accessible') || error.message.includes('Network Error')) {
//         alert('❌ Serveur Django non accessible sur localhost:8000\n\nAssurez-vous que le serveur Django tourne.\nUtilisez le mode simulation pour le développement.');
//       } else if (error.message.includes('incorrect')) {
//         alert('✅ API Django fonctionne mais identifiants incorrects\n\nC\'est normal, l\'API répond correctement.');
//       } else {
//         alert(`⚠️ ${error.message}\n\nUtilisez le mode simulation pour le développement.`);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Vérifier l'état actuel de l'auth
//   const checkCurrentAuth = () => {
//     const token = localStorage.getItem('simplon_access_token') || localStorage.getItem('token');
//     const userStr = localStorage.getItem('simplon_user') || localStorage.getItem('user');
    
//     console.log('🔍 État actuel auth:');
//     console.log('📦 Toutes les clés:', Object.keys(localStorage));
//     console.log('🔐 Token:', token);
//     console.log('👤 User:', userStr);
    
//     let message = 'État d\'authentification:\n\n';
//     message += `Token: ${token ? '✅ PRÉSENT' : '❌ ABSENT'}\n`;
    
//     if (userStr) {
//       try {
//         const user = JSON.parse(userStr);
//         message += `Utilisateur: ${user.username || user.email}\n`;
//         message += `Rôle: ${user.role || 'non spécifié'}\n`;
//         message += `Admin: ${(user.role === 'admin' || user.isAdmin) ? '✅ OUI' : '❌ NON'}\n`;
//         message += `Redirection: ${(user.role === 'admin' || user.isAdmin) ? '/admin (AdminDashboard)' : '/dashboard (Dashboard)'}`;
//       } catch {
//         message += 'User: ❌ Données invalides';
//       }
//     } else {
//       message += 'User: ❌ ABSENT';
//     }
    
//     alert(message);
//   };

//   // Redirection directe pour test
//   const testDirectRedirect = (path) => {
//     console.log(`🧪 Test redirection directe vers: ${path}`);
//     console.log(`   - ${path === '/admin' ? 'AdminDashboard.jsx' : 'Dashboard.jsx'}`);
//     navigate(path);
//   };

//   // Clear auth et rediriger vers login
//   const logoutAndRedirect = () => {
//     localStorage.clear();
//     console.log('🧹 Auth effacée');
//     alert('Déconnexion effectuée');
//     navigate('/quick-login');
//   };

//   // Navigation vers différentes pages
//   const navigateTo = (path) => {
//     navigate(path);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
//       <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        
//         {/* Header */}
//         <div className="bg-gradient-to-r from-[#E30613] to-[#ff6b6b] p-6 text-center text-white">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
//             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
//             </svg>
//           </div>
//           <h1 className="text-2xl font-bold">Connexion Simplon</h1>
//           <p className="text-sm opacity-90 mt-1">Plateforme de gestion de projets</p>
//         </div>

//         {/* Formulaire */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {/* Message d'erreur */}
//           {error && (
//             <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
//               <div className="flex items-center">
//                 <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//                 <span className="text-red-700">{error}</span>
//               </div>
//             </div>
//           )}

//           {/* Champs de connexion */}
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Matricule
//               </label>
//               <input
//                 type="text"
//                 value={matricule}
//                 onChange={(e) => setMatricule(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] transition-colors"
//                 placeholder="Votre matricule"
//                 required
//                 autoComplete="username"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Mot de passe
//               </label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] transition-colors"
//                 placeholder="Votre mot de passe"
//                 required
//                 autoComplete="current-password"
//               />
//             </div>
//           </div>

//           {/* Mode de connexion */}
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Mode de connexion
//             </label>
//             <div className="flex gap-2">
//               {[
//                 { value: 'auto', label: 'Auto', desc: 'API puis simulation' },
//                 { value: 'api', label: 'API Django', desc: 'Vérification réelle BD' },
//                 { value: 'mock', label: 'Simulation', desc: 'Pour développement' }
//               ].map((option) => (
//                 <button
//                   key={option.value}
//                   type="button"
//                   onClick={() => setMode(option.value)}
//                   className={`flex-1 text-center py-2 px-3 rounded-lg border transition-colors ${
//                     mode === option.value
//                       ? 'bg-[#E30613] text-white border-[#E30613]'
//                       : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
//                   }`}
//                 >
//                   <div className="font-medium">{option.label}</div>
//                   <div className="text-xs opacity-75">{option.desc}</div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Bouton de connexion principal */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-[#E30613] to-[#ff6b6b] text-white py-3 px-4 rounded-lg font-bold hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
//           >
//             {loading ? (
//               <div className="flex items-center justify-center">
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Vérification en cours...
//               </div>
//             ) : (
//               'Se connecter'
//             )}
//           </button>

//           {/* SECTION DE TEST AVANCÉ */}
//           <div className="pt-4 border-t border-gray-200">
//             <p className="text-sm font-medium text-gray-700 mb-3">
//               🔧 Outils de développement :
//             </p>
            
//             {/* Identifiants de test */}
//             <div className="grid grid-cols-2 gap-3 mb-3">
//               <button
//                 type="button"
//                 onClick={fillAdminCredentials}
//                 className="py-2 px-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors text-sm"
//               >
//                 Admin (admin/admin123)
//               </button>
//               <button
//                 type="button"
//                 onClick={fillUserCredentials}
//                 className="py-2 px-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors text-sm"
//               >
//                 User (user123/password123)
//               </button>
//             </div>
            
//             {/* Auth manuelle */}
//             <div className="grid grid-cols-2 gap-3 mb-3">
//               <button
//                 type="button"
//                 onClick={() => setManualAuth('admin')}
//                 className="py-2 px-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-medium transition-colors text-sm"
//               >
//                 Set Auth Admin
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setManualAuth('user')}
//                 className="py-2 px-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-colors text-sm"
//               >
//                 Set Auth User
//               </button>
//             </div>
            
//             {/* Outils de debug */}
//             <div className="space-y-2">
//               <button
//                 type="button"
//                 onClick={testApiConnection}
//                 className="w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
//               >
//                 🔍 Tester connexion API Django
//               </button>
              
//               <button
//                 type="button"
//                 onClick={checkCurrentAuth}
//                 className="w-full py-2 px-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg text-sm transition-colors"
//               >
//                 🔎 Vérifier état auth actuel
//               </button>
              
//               {/* Redirections directes - CORRIGÉES */}
//               <div className="grid grid-cols-2 gap-2">
//                 <button
//                   type="button"
//                   onClick={() => testDirectRedirect('/admin')}
//                   className="py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
//                 >
//                   → Admin Dashboard
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => testDirectRedirect('/dashboard')}
//                   className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
//                 >
//                   → User Dashboard
//                 </button>
//               </div>
              
//               {/* Navigation admin */}
//               <div className="grid grid-cols-2 gap-2">
//                 <button
//                   type="button"
//                   onClick={() => navigateTo('/admin/project-management')}
//                   className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
//                 >
//                   Gestion Projets
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => navigateTo('/admin/user-management')}
//                   className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
//                 >
//                   Gestion Users
//                 </button>
//               </div>
              
//               {/* Autres outils */}
//               <div className="grid grid-cols-2 gap-2">
//                 <button
//                   type="button"
//                   onClick={() => navigateTo('/')}
//                   className="py-2 px-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm transition-colors"
//                 >
//                   Accueil
//                 </button>
//                 <button
//                   type="button"
//                   onClick={logoutAndRedirect}
//                   className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
//                 >
//                   Déconnexion
//                 </button>
//               </div>
              
//               <p className="text-xs text-gray-500 text-center pt-2">
//                 Ouvrez la console (F12) pour voir les logs détaillés
//               </p>
//             </div>
//           </div>

//           {/* Info processus - CORRIGÉ */}
//           <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//             <h4 className="text-sm font-semibold text-blue-800 mb-2">
//               ℹ️ Redirections configurées :
//             </h4>
//             <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">
//               <li><strong>Admin</strong> → <code>/admin</code> <span className="font-bold">(AdminDashboard.jsx)</span></li>
//               <li><strong>Utilisateur</strong> → <code>/dashboard</code> <span className="font-bold">(Dashboard.jsx)</span></li>
//               <li><strong>Mode simulation</strong> activé par défaut</li>
//               <li><strong>Logs détaillés</strong> dans la console (F12)</li>
//             </ul>
            
//             <div className="mt-3 pt-3 border-t border-blue-200">
//               <h5 className="text-xs font-semibold text-blue-800 mb-1">
//                 📍 URLs disponibles :
//               </h5>
//               <ul className="text-xs text-blue-600 space-y-1">
//                 <li><code>/admin</code> → Dashboard Admin</li>
//                 <li><code>/admin/project-management</code> → Gestion projets</li>
//                 <li><code>/admin/user-management</code> → Gestion utilisateurs</li>
//                 <li><code>/dashboard</code> → Dashboard utilisateur</li>
//               </ul>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default QuickLogin;

// src/pages/QuickLogin.jsx - VERSION OPTIMISÉE
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';

const QuickLogin = () => {
  const [identifiant, setIdentifiant] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDev, setShowDev] = useState(false); // Option developpeur cachée
  
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
        const redirectPath = role === 'admin' ? '/admin' : '/dashboard';
        
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
      
      navigate(role === 'admin' ? '/admin' : '/dashboard', { replace: true });
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