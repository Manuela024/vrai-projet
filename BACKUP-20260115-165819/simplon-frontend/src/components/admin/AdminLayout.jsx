

// // src/components/admin/AdminLayout.jsx - VERSION COMPLÈTE
// import React, { useState } from 'react';
// import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
// import AdminDashboard from './AdminDashboard';
// import UserManagement from './UserManagement';
// import ProjectManagement from './ProjectManagement';
// import Analytics from './Analytics';
// import authService from '../../services/auth';
// import Settings from './Settings';
// import Profile from './Profile';

// const AdminLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const location = useLocation();
  
//   // Vérifier si l'utilisateur est admin
//   const currentUser = authService.getCurrentUser();
//   const isAdmin = authService.isAdmin();
  
//   console.log('🔐 AdminLayout - Vérification admin:', {
//     user: currentUser?.username,
//     is_staff: currentUser?.is_staff,
//     is_superuser: currentUser?.is_superuser,
//     isAdmin: isAdmin
//   });
  
//   if (!currentUser || !isAdmin) {
//     console.warn('⚠️ Accès refusé : utilisateur non admin', {
//       user: currentUser,
//       is_staff: currentUser?.is_staff,
//       is_superuser: currentUser?.is_superuser
//     });
//     return <Navigate to="/dashboard" replace />;
//   }

//   const menuItems = [
//     {
//       title: "Tableau de Bord",
//       icon: "dashboard",
//       path: "/admin",
//       component: AdminDashboard,
//       exact: true
//     },
//     {
//       title: "Gestion Utilisateurs",
//       icon: "people",
//       path: "/admin/users",
//       component: UserManagement
//     },
//     {
//       title: "Gestion Projets",
//       icon: "folder",
//       path: "/admin/projects", 
//       component: ProjectManagement
//     },
  
  
//     {
//       title: "Statistiques",
//       icon: "analytics",
//       path: "/admin/analytics",
//       component: Analytics
//     },

//       {
//     title: "Profil",
//     icon: "person",
//     path: "/admin/profile",
//     component: Profile
//   },
//   {
//     title: "Paramètres",
//     icon: "settings",
//     path: "/admin/settings",
//     component: Settings
//   },
    
    
//   ];

//   const getDisplayName = () => {
//     if (currentUser.first_name && currentUser.last_name) {
//       return `${currentUser.first_name} ${currentUser.last_name}`;
//     }
//     return currentUser.username || 'Administrateur';
//   };

//   const isActive = (path) => {
//     if (path === '/admin') {
//       return location.pathname === '/admin' || location.pathname === '/admin/';
//     }
//     return location.pathname.startsWith(path);
//   };

//   return (
//     <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
//       {/* Sidebar */}
//       <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#001F3F] text-white transition-all duration-300 flex-shrink-0 fixed h-full z-10`}>
//         <div className="flex items-center justify-between p-4 border-b border-[#003265]">
//           {sidebarOpen && (
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 bg-[#E30613] rounded-full flex items-center justify-center">
//                 <span className="font-bold text-white">A</span>
//               </div>
//               <span className="text-white font-semibold">Admin Simplon</span>
//             </div>
//           )}
//           <button 
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="p-1 rounded hover:bg-[#003265] transition-colors"
//           >
//             {sidebarOpen ? (
//               <span className="material-symbols-outlined text-white">menu_open</span>
//             ) : (
//               <span className="material-symbols-outlined text-white">menu</span>
//             )}
//           </button>
//         </div>

//         <nav className="p-4 space-y-2">
//           {menuItems.map((item) => (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
//                 isActive(item.path)
//                   ? 'bg-[#E30613] text-white' 
//                   : 'text-white/80 hover:bg-[#003265] hover:text-white'
//               }`}
//             >
//               <span className="material-symbols-outlined">{item.icon}</span>
//               {sidebarOpen && <span className="text-sm font-medium">{item.title}</span>}
//             </Link>
//           ))}
//         </nav>

//         {/* User info en bas */}
//         <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#003265]">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-[#E30613] rounded-full flex items-center justify-center">
//               <span className="font-bold text-white">
//                 {currentUser.username?.charAt(0).toUpperCase() || 'A'}
//               </span>
//             </div>
//             {sidebarOpen && (
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-white truncate">
//                   {getDisplayName()}
//                 </p>
//                 <p className="text-xs text-white/70 truncate">
//                   {currentUser.is_superuser ? 'Super Admin' : 'Administrateur'}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
//         {/* Header */}
//         <header className="bg-white dark:bg-[#0d1a29] border-b border-gray-200 dark:border-gray-700 p-4">
//           <div className="flex items-center justify-between">
//             <h1 className="text-xl font-bold text-[#001F3F] dark:text-white">
//               {menuItems.find(item => isActive(item.path))?.title || 'Admin Dashboard'}
//             </h1>
//             <div className="flex items-center gap-4">
//               <span className="text-sm text-gray-600 dark:text-gray-400 hidden md:inline">
//                 Connecté en tant que <strong className="text-[#001F3F] dark:text-white">{getDisplayName()}</strong>
//               </span>
//               <button
//                 onClick={() => authService.logout()}
//                 className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#c40511] text-sm font-medium transition-colors"
//               >
//                 Déconnexion
//               </button>
//               <Link 
//                 to="/Home"
//                 className="bg-[#001F3F] text-white px-4 py-2 rounded-lg hover:bg-[#003265] text-sm font-medium transition-colors"
//               >
//                 Retour au site
//               </Link>
//             </div>
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="flex-1 overflow-auto p-6">
          
//           <Routes>
//             <Route index element={<AdminDashboard />} />
//             <Route path="users" element={<UserManagement />} />
//             <Route path="projects" element={<ProjectManagement />} />
//             <Route path="analytics" element={<Analytics />} />
//             <Route path="*" element={<Navigate to="/admin" replace />} />

//               <Route index element={<AdminDashboard />} />
//   <Route path="users" element={<UserManagement />} />
//   <Route path="projects" element={<ProjectManagement />} />
//   <Route path="analytics" element={<Analytics />} />
  
//   <Route path="profile" element={<Profile />} />
//   <Route path="settings" element={<Settings />} />
//   <Route path="*" element={<Navigate to="/admin" replace />} />
//           </Routes>
//         </main>

//         {/* Footer */}
//         <footer className="bg-white dark:bg-[#0d1a29] border-t border-gray-200 dark:border-gray-700 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
//           <p>© {new Date().getFullYear()} Simplon - Plateforme Admin</p>
//           <p className="text-xs mt-1">Version 1.0.0</p>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;


// // src/components/admin/AdminLayout.jsx - VERSION COMPLÈTE AVEC "DÉPOSER UN PROJET" ET "EXPLORER"
// import React, { useState } from 'react';
// import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
// import AdminDashboard from './AdminDashboard';
// import UserManagement from './UserManagement';
// import ProjectManagement from './ProjectManagement';
// import SubmitProject from './SubmitProject'; // Nouveau composant
// import Explore from './Explore'; // Nouveau composant
// import Analytics from './Analytics';
// import authService from '../../services/auth';
// import Settings from './Settings';
// import Profile from './Profile';

// const AdminLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const location = useLocation();
  
//   // Vérifier si l'utilisateur est admin
//   const currentUser = authService.getCurrentUser();
//   const isAdmin = authService.isAdmin();
  
//   console.log('🔐 AdminLayout - Vérification admin:', {
//     user: currentUser?.username,
//     is_staff: currentUser?.is_staff,
//     is_superuser: currentUser?.is_superuser,
//     isAdmin: isAdmin
//   });
  
//   if (!currentUser || !isAdmin) {
//     console.warn('⚠️ Accès refusé : utilisateur non admin', {
//       user: currentUser,
//       is_staff: currentUser?.is_staff,
//       is_superuser: currentUser?.is_superuser
//     });
//     return <Navigate to="/dashboard" replace />;
//   }

//   const menuItems = [
//     {
//       title: "Tableau de Bord",
//       icon: "dashboard",
//       path: "/admin",
//       component: AdminDashboard,
//       exact: true
//     },
//     {
//       title: "Déposer un Projet",
//       icon: "add_circle",
//       path: "/admin/submit-project",
//       component: SubmitProject,
//       badge: "Nouveau"
//     },
//     {
//       title: "Explorer",
//       icon: "explore",
//       path: "/admin/explore",
//       component: Explore
//     },
//     {
//       title: "Gestion Utilisateurs",
//       icon: "people",
//       path: "/admin/users",
//       component: UserManagement
//     },
//     {
//       title: "Gestion Projets",
//       icon: "folder",
//       path: "/admin/projects", 
//       component: ProjectManagement
//     },
//     {
//       title: "Statistiques",
//       icon: "analytics",
//       path: "/admin/analytics",
//       component: Analytics
//     },
//     {
//       title: "Profil",
//       icon: "person",
//       path: "/admin/profile",
//       component: Profile
//     },
//     {
//       title: "Paramètres",
//       icon: "settings",
//       path: "/admin/settings",
//       component: Settings
//     },
//   ];

//   const getDisplayName = () => {
//     if (currentUser.first_name && currentUser.last_name) {
//       return `${currentUser.first_name} ${currentUser.last_name}`;
//     }
//     return currentUser.username || 'Administrateur';
//   };

//   const isActive = (path) => {
//     if (path === '/admin') {
//       return location.pathname === '/admin' || location.pathname === '/admin/';
//     }
//     return location.pathname.startsWith(path);
//   };

//   return (
//     <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
//       {/* Sidebar */}
//       <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#001F3F] text-white transition-all duration-300 flex-shrink-0 fixed h-full z-10`}>
//         <div className="flex items-center justify-between p-4 border-b border-[#003265]">
//           {sidebarOpen && (
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 bg-[#E30613] rounded-full flex items-center justify-center">
//                 <span className="font-bold text-white">A</span>
//               </div>
//               <span className="text-white font-semibold">Admin Simplon</span>
//             </div>
//           )}
//           <button 
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="p-1 rounded hover:bg-[#003265] transition-colors"
//           >
//             {sidebarOpen ? (
//               <span className="material-symbols-outlined text-white">menu_open</span>
//             ) : (
//               <span className="material-symbols-outlined text-white">menu</span>
//             )}
//           </button>
//         </div>

//         <nav className="p-4 space-y-2">
//           {menuItems.map((item) => (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={`flex items-center gap-3 p-3 rounded-lg transition-colors relative ${
//                 isActive(item.path)
//                   ? 'bg-[#E30613] text-white' 
//                   : 'text-white/80 hover:bg-[#003265] hover:text-white'
//               }`}
//             >
//               <span className="material-symbols-outlined">{item.icon}</span>
//               {sidebarOpen && (
//                 <>
//                   <span className="text-sm font-medium">{item.title}</span>
//                   {item.badge && (
//                     <span className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-500 text-yellow-900 text-xs px-2 py-1 rounded-full animate-pulse">
//                       {item.badge}
//                     </span>
//                   )}
//                 </>
//               )}
//             </Link>
//           ))}
//         </nav>

//         {/* User info en bas */}
//         <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#003265]">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-[#E30613] rounded-full flex items-center justify-center">
//               <span className="font-bold text-white">
//                 {currentUser.username?.charAt(0).toUpperCase() || 'A'}
//               </span>
//             </div>
//             {sidebarOpen && (
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-white truncate">
//                   {getDisplayName()}
//                 </p>
//                 <p className="text-xs text-white/70 truncate">
//                   {currentUser.is_superuser ? 'Super Admin' : 'Administrateur'}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
//         {/* Header */}
//         <header className="bg-white dark:bg-[#0d1a29] border-b border-gray-200 dark:border-gray-700 p-4">
//           <div className="flex items-center justify-between">
//             <h1 className="text-xl font-bold text-[#001F3F] dark:text-white">
//               {menuItems.find(item => isActive(item.path))?.title || 'Admin Dashboard'}
//             </h1>
//             <div className="flex items-center gap-4">
//               <span className="text-sm text-gray-600 dark:text-gray-400 hidden md:inline">
//                 Connecté en tant que <strong className="text-[#001F3F] dark:text-white">{getDisplayName()}</strong>
//               </span>
//               <button
//                 onClick={() => authService.logout()}
//                 className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#c40511] text-sm font-medium transition-colors"
//               >
//                 Déconnexion
//               </button>
//               <Link 
//                 to="/Home"
//                 className="bg-[#001F3F] text-white px-4 py-2 rounded-lg hover:bg-[#003265] text-sm font-medium transition-colors"
//               >
//                 Retour au site
//               </Link>
//             </div>
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="flex-1 overflow-auto p-6">
//           <Routes>
//             <Route index element={<AdminDashboard />} />
//             <Route path="submit-project" element={<SubmitProject />} />
//             <Route path="explore" element={<Explore />} />
//             <Route path="users" element={<UserManagement />} />
//             <Route path="projects" element={<ProjectManagement />} />
//             <Route path="analytics" element={<Analytics />} />
//             <Route path="profile" element={<Profile />} />
//             <Route path="settings" element={<Settings />} />
//             <Route path="*" element={<Navigate to="/admin" replace />} />
//           </Routes>
//         </main>

//         {/* Footer */}
//         <footer className="bg-white dark:bg-[#0d1a29] border-t border-gray-200 dark:border-gray-700 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
//           <p>© {new Date().getFullYear()} Simplon - Plateforme Admin</p>
//           <p className="text-xs mt-1">Version 1.1.0</p>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;


// // src/services/auth.js - VERSION CORRIGÉE AVEC CLÉS COHÉRENTES
// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:8000/api';

// // ✅ CLÉS STANDARDISÉES
// const TOKEN_KEY = 'simplon_access_token';
// const REFRESH_KEY = 'simplon_refresh_token';
// const USER_KEY = 'simplon_user';

// // DONNÉES RÉELLES DE L'UTILISATEUR (d'après Django)
// const REAL_USER_DATA = {
//   'simplon_2025001': {
//     id: 18,
//     username: 'simplon_2025001',
//     email: 'alice.martin@simplon.com',
//     first_name: 'Alice',
//     last_name: 'Martin',
//     is_staff: false,
//     is_superuser: false,
//     is_active: true,
//     date_joined: '2025-11-18T15:16:01.229591Z',
//     cohort: 'Simplon 2024',
//     bio: ''
//   },
//   'admin': {
//     id: 3,
//     username: 'admin',
//     email: 'admin@simplon.com',
//     first_name: 'Admin',
//     last_name: 'System',
//     is_staff: true,
//     is_superuser: true,
//     is_active: true,
//     date_joined: '2025-11-25T09:42:06.293564Z',
//     cohort: 'Administration',
//     bio: 'Administrateur système'
//   }
// };

// const authService = {
//   // ✅ LOGIN AVEC DONNÉES RÉELLES ET CLÉS COHÉRENTES
//   async login(matricule, password) {
//     console.log('🔐 Login attempt for:', matricule);
    
//     try {
//       // 1. Obtenir le token JWT
//       const tokenResponse = await axios.post(`${API_BASE_URL}/token/`, {
//         username: matricule,
//         password: password
//       });
      
//       const { access, refresh } = tokenResponse.data;
      
//       // ✅ STOCKER AVEC LES BONNES CLÉS
//       localStorage.setItem(TOKEN_KEY, access);
//       localStorage.setItem(REFRESH_KEY, refresh);
      
//       console.log('✅ Token stored with keys:', { TOKEN_KEY, REFRESH_KEY });
      
//       // 2. UTILISER LES DONNÉES RÉELLES
//       let userData = null;
      
//       // Chercher dans nos données réelles
//       if (REAL_USER_DATA[matricule]) {
//         userData = REAL_USER_DATA[matricule];
//         console.log('✅ Using real user data from mapping:', userData);
//       } else {
//         // Essayer l'API
//         try {
//           console.log('🔍 Trying to fetch from API...');
          
//           // Essayer par ID si on connaît le matricule
//           if (matricule === 'simplon_2025001') {
//             const response = await axios.get(`${API_BASE_URL}/users/18/`, {
//               headers: {
//                 'Authorization': `Bearer ${access}`,
//                 'Content-Type': 'application/json',
//               },
//             });
//             userData = response.data;
//             console.log('✅ Got user from API by ID:', userData);
//           } else {
//             // Chercher par username
//             const response = await axios.get(`${API_BASE_URL}/users/?username=${encodeURIComponent(matricule)}`, {
//               headers: {
//                 'Authorization': `Bearer ${access}`,
//                 'Content-Type': 'application/json',
//               },
//             });
            
//             if (response.data.results && response.data.results.length > 0) {
//               userData = response.data.results[0];
//               console.log('✅ Got user from API search:', userData);
//             }
//           }
//         } catch (apiError) {
//           console.log('⚠️ API fetch failed:', apiError.message);
//         }
//       }
      
//       // 3. Créer l'objet utilisateur final
//       const userToStore = userData ? {
//         // Données réelles
//         id: userData.id,
//         username: userData.username || matricule,
//         email: userData.email || `${matricule}@simplon.com`,
//         first_name: userData.first_name || '',
//         last_name: userData.last_name || '',
//         is_staff: userData.is_staff || false,
//         is_superuser: userData.is_superuser || false,
//         is_active: userData.is_active !== undefined ? userData.is_active : true,
//         date_joined: userData.date_joined || new Date().toISOString(),
        
//         // Champs personnalisés
//         matricule: matricule,
//         cohort: userData.cohort || 'Simplon 2024',
//         bio: userData.bio || '',
        
//         // Champs calculés
//         isAdmin: !!(userData.is_staff || userData.is_superuser),
//         role: (userData.is_staff || userData.is_superuser) ? 'admin' : 'user',
        
//         // Marqueur
//         _source: userData ? 'django_real' : 'default'
//       } : {
//         // Fallback si aucune donnée trouvée
//         id: Date.now(),
//         username: matricule,
//         email: `${matricule}@simplon.com`,
//         first_name: 'Utilisateur',
//         last_name: 'Simplon',
//         is_staff: false,
//         is_superuser: false,
//         is_active: true,
//         date_joined: new Date().toISOString(),
//         matricule: matricule,
//         cohort: 'Simplon 2024',
//         bio: '',
//         isAdmin: matricule.includes('admin'),
//         role: matricule.includes('admin') ? 'admin' : 'user',
//         _source: 'fallback'
//       };
      
//       console.log('✅ Storing user with key:', USER_KEY);
//       localStorage.setItem(USER_KEY, JSON.stringify(userToStore));
      
//       return { success: true, user: userToStore };
      
//     } catch (error) {
//       console.error('❌ Login error:', error.message);
      
//       if (error.response?.status === 401) {
//         throw new Error('Matricule ou mot de passe incorrect');
//       }
      
//       throw error;
//     }
//   },

//   // ✅ QUICK LOGIN - CORRIGÉ
//   async quickLogin(matricule, password) {
//     console.log('🚀 Quick login for:', matricule);
    
//     try {
//       return await this.login(matricule, password);
//     } catch (error) {
//       console.log('🔄 Trying simulation...');
//       return this.mockLogin(matricule, password);
//     }
//   },

//   // ✅ MOCK LOGIN - CORRIGÉ POUR LES CLÉS
//   mockLogin(matricule, password) {
//     return new Promise((resolve, reject) => {
//       console.log('🎭 Simulation mode');
      
//       setTimeout(() => {
//         // Vérifier les identifiants
//         const validUsers = {
//           'admin': ['admin123', 'password'],
//           'simplon_2025001': ['simplon2024'],
//           'simplon-2025001': ['simplon2024'],
//           'user123': ['password123']
//         };
        
//         const validPasswords = validUsers[matricule];
        
//         if (!validPasswords || !validPasswords.includes(password)) {
//           reject(new Error('Matricule ou mot de passe incorrect'));
//           return;
//         }
        
//         // Utiliser les données réelles si disponibles
//         let userData = null;
//         if (REAL_USER_DATA[matricule]) {
//           userData = REAL_USER_DATA[matricule];
//           console.log('✅ Using real data even in simulation');
//         }
        
//         const user = userData ? {
//           // Données réelles
//           ...userData,
//           matricule: matricule,
//           isAdmin: !!(userData.is_staff || userData.is_superuser),
//           role: (userData.is_staff || userData.is_superuser) ? 'admin' : 'user',
//           _source: 'django_simulation'
//         } : {
//           // Simulation
//           id: Date.now(),
//           username: matricule,
//           email: `${matricule}@simplon.com`,
//           first_name: 'Simulation',
//           last_name: 'User',
//           is_staff: false,
//           is_superuser: false,
//           is_active: true,
//           date_joined: new Date().toISOString(),
//           matricule: matricule,
//           cohort: 'Simulation 2024',
//           bio: '',
//           isAdmin: false,
//           role: 'user',
//           _source: 'simulation'
//         };
        
//         // ✅ STOCKER AVEC LES BONNES CLÉS
//         localStorage.setItem(USER_KEY, JSON.stringify(user));
//         localStorage.setItem(TOKEN_KEY, 'mock_token_' + Date.now());
//         localStorage.setItem(REFRESH_KEY, 'mock_refresh_' + Date.now());
        
//         console.log('✅ User created:', user);
//         resolve({ success: true, user, isSimulation: true });
        
//       }, 500);
//     });
//   },

//   // ✅ IS AUTHENTICATED - CORRIGÉ
//   isAuthenticated() {
//     const user = localStorage.getItem(USER_KEY);
//     const token = localStorage.getItem(TOKEN_KEY);
//     const isAuth = !!(user && token);
//     console.log('🔐 isAuthenticated check:', {
//       hasUser: !!user,
//       hasToken: !!token,
//       result: isAuth
//     });
//     return isAuth;
//   },

//   // ✅ IS ADMIN - CORRIGÉ
//   isAdmin() {
//     try {
//       const userStr = localStorage.getItem(USER_KEY);
//       console.log('👑 isAdmin check - User string:', userStr ? 'present' : 'missing');
      
//       if (!userStr) return false;
      
//       const user = JSON.parse(userStr);
//       const isAdmin = !!(user.is_staff || user.is_superuser || user.isAdmin);
      
//       console.log('👑 isAdmin result:', {
//         username: user.username,
//         is_staff: user.is_staff,
//         is_superuser: user.is_superuser,
//         isAdmin: user.isAdmin,
//         result: isAdmin
//       });
      
//       return isAdmin;
//     } catch (error) {
//       console.error('isAdmin error:', error);
//       return false;
//     }
//   },

//   // ✅ GET CURRENT USER - CORRIGÉ
//   getCurrentUser() {
//     try {
//       const userStr = localStorage.getItem(USER_KEY);
//       console.log('👤 getCurrentUser - User string:', userStr ? 'present' : 'missing');
      
//       if (!userStr) {
//         console.warn('⚠️ No user found in localStorage');
//         return null;
//       }
      
//       const user = JSON.parse(userStr);
      
//       // Debug: afficher les données
//       console.log('👤 User parsed:', {
//         username: user.username,
//         email: user.email,
//         is_staff: user.is_staff,
//         is_superuser: user.is_superuser,
//         isAdmin: user.isAdmin,
//         source: user._source
//       });
      
//       return user;
//     } catch (error) {
//       console.error('❌ getCurrentUser error:', error);
//       return null;
//     }
//   },

//   // ✅ GET ACCESS TOKEN - NOUVELLE MÉTHODE IMPORTANTE
//   getAccessToken() {
//     const token = localStorage.getItem(TOKEN_KEY);
//     console.log('🔑 getAccessToken:', token ? `present (${token.length} chars)` : 'missing');
//     return token;
//   },

//   // ✅ LOGOUT - CORRIGÉ
//   logout() {
//     console.log('👋 Logout - Removing items with keys:', [TOKEN_KEY, REFRESH_KEY, USER_KEY]);
//     localStorage.removeItem(TOKEN_KEY);
//     localStorage.removeItem(REFRESH_KEY);
//     localStorage.removeItem(USER_KEY);
    
//     // Vérifier que tout est bien supprimé
//     console.log('✅ After logout - localStorage:', {
//       token: localStorage.getItem(TOKEN_KEY),
//       user: localStorage.getItem(USER_KEY)
//     });
    
//     window.location.href = '/login';
//   },

//   // ✅ METTRE À JOUR LOCALEMENT
//   updateProfile(updates) {
//     try {
//       const currentUser = this.getCurrentUser();
//       if (!currentUser) return false;
      
//       const updatedUser = { ...currentUser, ...updates };
//       localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      
//       console.log('✅ Profile updated:', updatedUser);
//       return true;
//     } catch (error) {
//       console.error('❌ Error updating profile:', error);
//       return false;
//     }
//   },

//   // ✅ FORCER LES DONNÉES RÉELLES
//   forceRealData(matricule) {
//     if (REAL_USER_DATA[matricule]) {
//       const userData = REAL_USER_DATA[matricule];
//       const user = {
//         ...userData,
//         matricule: matricule,
//         isAdmin: !!(userData.is_staff || userData.is_superuser),
//         role: (userData.is_staff || userData.is_superuser) ? 'admin' : 'user',
//         _source: 'forced_real'
//       };
      
//       localStorage.setItem(USER_KEY, JSON.stringify(user));
//       console.log('✅ Forced real data:', user);
//       return user;
//     }
//     return null;
//   },

//   // ✅ MÉTHODE DE DEBUG
//   debug() {
//     console.log('🔍 === AUTH DEBUG ===');
//     console.log('Keys in localStorage:', Object.keys(localStorage));
//     console.log('TOKEN_KEY:', localStorage.getItem(TOKEN_KEY) ? 'present' : 'missing');
//     console.log('USER_KEY:', localStorage.getItem(USER_KEY) ? 'present' : 'missing');
    
//     const user = this.getCurrentUser();
//     if (user) {
//       console.log('User object:', {
//         username: user.username,
//         is_staff: user.is_staff,
//         is_superuser: user.is_superuser,
//         isAdmin: user.isAdmin
//       });
//     }
    
//     console.log('isAuthenticated:', this.isAuthenticated());
//     console.log('isAdmin:', this.isAdmin());
//     console.log('========================');
//   }
// };

// export default authService;


// // src/components/admin/AdminLayout.jsx - VOTRE VERSION AVEC SIDEBAR
// import React, { useState } from 'react';
// import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
// import AdminDashboard from './AdminDashboard';
// import UserManagement from './UserManagement';
// import ProjectManagement from './ProjectManagement';
// import SubmitProject from './SubmitProject';
// import Explore from './Explore';
// import Analytics from './Analytics';
// import authService from '../../services/auth';
// import Settings from './Settings';
// import Profile from './Profile';

// const AdminLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const location = useLocation();
  
//   // Vérifier si l'utilisateur est admin
//   const currentUser = authService.getCurrentUser();
//   const isAdmin = authService.isAdmin();
  
//   console.log('🔐 AdminLayout - Vérification admin:', {
//     user: currentUser?.username,
//     is_staff: currentUser?.is_staff,
//     is_superuser: currentUser?.is_superuser,
//     isAdmin: isAdmin
//   });
  
//   if (!currentUser || !isAdmin) {
//     console.warn('⚠️ Accès refusé : utilisateur non admin', {
//       user: currentUser,
//       is_staff: currentUser?.is_staff,
//       is_superuser: currentUser?.is_superuser
//     });
//     return <Navigate to="/dashboard" replace />;
//   }

//   const menuItems = [
//     {
//       title: "Tableau de Bord",
//       icon: "dashboard",
//       path: "/admin",
//       component: AdminDashboard,
//       exact: true
//     },
//     {
//       title: "Déposer un Projet",
//       icon: "add_circle",
//       path: "/admin/submit-project",
//       component: SubmitProject,
//       badge: "Nouveau"
//     },
//     {
//       title: "Explorer",
//       icon: "explore",
//       path: "/admin/explore",
//       component: Explore
//     },
//     {
//       title: "Gestion Utilisateurs",
//       icon: "people",
//       path: "/admin/users",
//       component: UserManagement
//     },
//     {
//       title: "Gestion Projets",
//       icon: "folder",
//       path: "/admin/projects", 
//       component: ProjectManagement
//     },
//     {
//       title: "Statistiques",
//       icon: "analytics",
//       path: "/admin/analytics",
//       component: Analytics
//     },
//     {
//       title: "Profil",
//       icon: "person",
//       path: "/admin/profile",
//       component: Profile
//     },
//     {
//       title: "Paramètres",
//       icon: "settings",
//       path: "/admin/settings",
//       component: Settings
//     },
//   ];

//   const getDisplayName = () => {
//     if (currentUser.first_name && currentUser.last_name) {
//       return `${currentUser.first_name} ${currentUser.last_name}`;
//     }
//     return currentUser.username || 'Administrateur';
//   };

//   const isActive = (path) => {
//     if (path === '/admin') {
//       return location.pathname === '/admin' || location.pathname === '/admin/';
//     }
//     return location.pathname.startsWith(path);
//   };

//   return (
//     <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
//       {/* Sidebar */}
//       <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#001F3F] text-white transition-all duration-300 flex-shrink-0 fixed h-full z-10`}>
//         <div className="flex items-center justify-between p-4 border-b border-[#003265]">
//           {sidebarOpen && (
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 bg-[#E30613] rounded-full flex items-center justify-center">
//                 <span className="font-bold text-white">A</span>
//               </div>
//               <span className="text-white font-semibold">Admin Simplon</span>
//             </div>
//           )}
//           <button 
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="p-1 rounded hover:bg-[#003265] transition-colors"
//           >
//             {sidebarOpen ? (
//               <span className="material-symbols-outlined text-white">menu_open</span>
//             ) : (
//               <span className="material-symbols-outlined text-white">menu</span>
//             )}
//           </button>
//         </div>

//         <nav className="p-4 space-y-2">
//           {menuItems.map((item) => (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={`flex items-center gap-3 p-3 rounded-lg transition-colors relative ${
//                 isActive(item.path)
//                   ? 'bg-[#E30613] text-white' 
//                   : 'text-white/80 hover:bg-[#003265] hover:text-white'
//               }`}
//             >
//               <span className="material-symbols-outlined">{item.icon}</span>
//               {sidebarOpen && (
//                 <>
//                   <span className="text-sm font-medium">{item.title}</span>
//                   {item.badge && (
//                     <span className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-500 text-yellow-900 text-xs px-2 py-1 rounded-full animate-pulse">
//                       {item.badge}
//                     </span>
//                   )}
//                 </>
//               )}
//             </Link>
//           ))}
//         </nav>

//         {/* User info en bas */}
//         <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#003265]">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-[#E30613] rounded-full flex items-center justify-center">
//               <span className="font-bold text-white">
//                 {currentUser.username?.charAt(0).toUpperCase() || 'A'}
//               </span>
//             </div>
//             {sidebarOpen && (
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-white truncate">
//                   {getDisplayName()}
//                 </p>
//                 <p className="text-xs text-white/70 truncate">
//                   {currentUser.is_superuser ? 'Super Admin' : 'Administrateur'}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
//         {/* Header */}
//         <header className="bg-white dark:bg-[#0d1a29] border-b border-gray-200 dark:border-gray-700 p-4">
//           <div className="flex items-center justify-between">
//             <h1 className="text-xl font-bold text-[#001F3F] dark:text-white">
//               {menuItems.find(item => isActive(item.path))?.title || 'Admin Dashboard'}
//             </h1>
//             <div className="flex items-center gap-4">
//               <span className="text-sm text-gray-600 dark:text-gray-400 hidden md:inline">
//                 Connecté en tant que <strong className="text-[#001F3F] dark:text-white">{getDisplayName()}</strong>
//               </span>
//               <button
//                 onClick={() => authService.logout()}
//                 className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#c40511] text-sm font-medium transition-colors"
//               >
//                 Déconnexion
//               </button>
//               <Link 
//                 to="/Home"
//                 className="bg-[#001F3F] text-white px-4 py-2 rounded-lg hover:bg-[#003265] text-sm font-medium transition-colors"
//               >
//                 Retour au site
//               </Link>
//             </div>
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="flex-1 overflow-auto p-6">
//           <Routes>
//             <Route index element={<AdminDashboard />} />
//             <Route path="submit-project" element={<SubmitProject />} />
//             <Route path="explore" element={<Explore />} />
//             <Route path="users" element={<UserManagement />} />
//             <Route path="projects" element={<ProjectManagement />} />
//             <Route path="analytics" element={<Analytics />} />
//             <Route path="profile" element={<Profile />} />
//             <Route path="settings" element={<Settings />} />
//             <Route path="*" element={<Navigate to="/admin" replace />} />
//           </Routes>
//         </main>

//         {/* Footer */}
//         <footer className="bg-white dark:bg-[#0d1a29] border-t border-gray-200 dark:border-gray-700 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
//           <p>© {new Date().getFullYear()} Simplon - Plateforme Admin</p>
//           <p className="text-xs mt-1">Version 1.1.0</p>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout; // ⚠️ ASSUREZ-VOUS QUE C'EST BIEN export default




// // src/components/admin/AdminLayout.jsx - VERSION CORRIGÉE
// import React, { useState } from 'react';
// import { Routes, Route, Link, useLocation, Navigate, Outlet } from 'react-router-dom'; // ← Ajoutez Outlet
// import AdminDashboard from './AdminDashboard';
// import UserManagement from './UserManagement';
// import ProjectManagement from './ProjectManagement';
// import SubmitProject from './SubmitProject';
// import Explore from './Explore';
// import Analytics from './Analytics';
// import authService from '../../services/auth';
// import Settings from './Settings';
// import Profile from './Profile';

// const AdminLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const location = useLocation();
  
//   // Vérifier si l'utilisateur est admin
//   const currentUser = authService.getCurrentUser();
//   const isAdmin = authService.isAdmin();
  
//   console.log('🔐 AdminLayout - Vérification admin:', {
//     user: currentUser?.username,
//     is_staff: currentUser?.is_staff,
//     is_superuser: currentUser?.is_superuser,
//     isAdmin: isAdmin
//   });
  
//   if (!currentUser || !isAdmin) {
//     console.warn('⚠️ Accès refusé : utilisateur non admin', {
//       user: currentUser,
//       is_staff: currentUser?.is_staff,
//       is_superuser: currentUser?.is_superuser
//     });
//     return <Navigate to="/dashboard" replace />;
//   }

//   const menuItems = [
//     {
//       title: "Tableau de Bord",
//       icon: "dashboard",
//       path: "/admin",
//       exact: true
//     },
//     {
//       title: "Déposer un Projet",
//       icon: "add_circle",
//       path: "/admin/submit-project",
//       badge: "Nouveau"
//     },
//     {
//       title: "Explorer",
//       icon: "explore",
//       path: "/admin/explore"
//     },
//     {
//       title: "Gestion Utilisateurs",
//       icon: "people",
//       path: "/admin/users"
//     },
//     {
//       title: "Gestion Projets",
//       icon: "folder",
//       path: "/admin/projects"
//     },
//     {
//       title: "Statistiques",
//       icon: "analytics",
//       path: "/admin/analytics"
//     },
//     {
//       title: "Profil",
//       icon: "person",
//       path: "/admin/profile"
//     },
//     {
//       title: "Paramètres",
//       icon: "settings",
//       path: "/admin/settings"
//     },
//   ];

//   const getDisplayName = () => {
//     if (currentUser.first_name && currentUser.last_name) {
//       return `${currentUser.first_name} ${currentUser.last_name}`;
//     }
//     return currentUser.username || 'Administrateur';
//   };

//   const isActive = (path) => {
//     if (path === '/admin') {
//       return location.pathname === '/admin' || location.pathname === '/admin/';
//     }
//     return location.pathname.startsWith(path);
//   };

//   // Fonction pour déterminer le titre de la page
//   const getPageTitle = () => {
//     const currentPath = location.pathname;
//     const item = menuItems.find(item => 
//       item.path === '/admin' ? currentPath === '/admin' || currentPath === '/admin/' : 
//       currentPath.startsWith(item.path)
//     );
//     return item?.title || 'Admin Dashboard';
//   };

//   return (
//     <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
//       {/* Sidebar */}
//       <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#001F3F] text-white transition-all duration-300 flex-shrink-0 fixed h-full z-10`}>
//         <div className="flex items-center justify-between p-4 border-b border-[#003265]">
//           {sidebarOpen && (
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 bg-[#E30613] rounded-full flex items-center justify-center">
//                 <span className="font-bold text-white">A</span>
//               </div>
//               <span className="text-white font-semibold">Admin Simplon</span>
//             </div>
//           )}
//           <button 
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="p-1 rounded hover:bg-[#003265] transition-colors"
//           >
//             {sidebarOpen ? (
//               <span className="material-symbols-outlined text-white">menu_open</span>
//             ) : (
//               <span className="material-symbols-outlined text-white">menu</span>
//             )}
//           </button>
//         </div>

//         <nav className="p-4 space-y-2">
//           {menuItems.map((item) => (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={`flex items-center gap-3 p-3 rounded-lg transition-colors relative ${
//                 isActive(item.path)
//                   ? 'bg-[#E30613] text-white' 
//                   : 'text-white/80 hover:bg-[#003265] hover:text-white'
//               }`}
//             >
//               <span className="material-symbols-outlined">{item.icon}</span>
//               {sidebarOpen && (
//                 <>
//                   <span className="text-sm font-medium">{item.title}</span>
//                   {item.badge && (
//                     <span className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-500 text-yellow-900 text-xs px-2 py-1 rounded-full animate-pulse">
//                       {item.badge}
//                     </span>
//                   )}
//                 </>
//               )}
//             </Link>
//           ))}
//         </nav>

//         {/* User info en bas */}
//         <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#003265]">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-[#E30613] rounded-full flex items-center justify-center">
//               <span className="font-bold text-white">
//                 {currentUser.username?.charAt(0).toUpperCase() || 'A'}
//               </span>
//             </div>
//             {sidebarOpen && (
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-white truncate">
//                   {getDisplayName()}
//                 </p>
//                 <p className="text-xs text-white/70 truncate">
//                   {currentUser.is_superuser ? 'Super Admin' : 'Administrateur'}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
//         {/* Header */}
//         <header className="bg-white dark:bg-[#0d1a29] border-b border-gray-200 dark:border-gray-700 p-4">
//           <div className="flex items-center justify-between">
//             <h1 className="text-xl font-bold text-[#001F3F] dark:text-white">
//               {getPageTitle()}
//             </h1>
//             <div className="flex items-center gap-4">
//               <span className="text-sm text-gray-600 dark:text-gray-400 hidden md:inline">
//                 Connecté en tant que <strong className="text-[#001F3F] dark:text-white">{getDisplayName()}</strong>
//               </span>
//               <button
//                 onClick={() => authService.logout()}
//                 className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#c40511] text-sm font-medium transition-colors"
//               >
//                 Déconnexion
//               </button>
//               <Link 
//                 to="/"
//                 className="bg-[#001F3F] text-white px-4 py-2 rounded-lg hover:bg-[#003265] text-sm font-medium transition-colors"
//               >
//                 Retour au site
//               </Link>
//             </div>
//           </div>
//         </header>

//         {/* Page Content - UTILISEZ Outlet ICI */}
//         <main className="flex-1 overflow-auto p-6">
//           <Outlet /> {/* ← CECI REMPLACE Routes */}
//         </main>

//         {/* Footer */}
//         <footer className="bg-white dark:bg-[#0d1a29] border-t border-gray-200 dark:border-gray-700 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
//           <p>© {new Date().getFullYear()} Simplon - Plateforme Admin</p>
//           <p className="text-xs mt-1">Version 1.1.0</p>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;


// // src/components/admin/AdminLayout.jsx - VERSION CORRIGÉE ET AMÉLIORÉE
// import React, { useState, Suspense, lazy } from 'react';
// import { Routes, Route, Link, useLocation, Navigate, Outlet } from 'react-router-dom';
// import authService from '../../services/auth';

// // Import lazy pour éviter les erreurs de hot reload
// const AdminDashboard = lazy(() => import('./AdminDashboard'));
// const UserManagement = lazy(() => import('./UserManagement'));
// const ProjectManagement = lazy(() => import('./ProjectManagement'));
// const SubmitProject = lazy(() => import('./SubmitProject'));
// const Explore = lazy(() => import('./Explore'));
// const Analytics = lazy(() => import('./Analytics'));
// const Settings = lazy(() => import('./Settings'));
// const Profile = lazy(() => import('./Profile')); // Correction ici

// const AdminLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const location = useLocation();
  
//   // Vérifier si l'utilisateur est admin
//   const currentUser = authService.getCurrentUser();
//   const isAdmin = authService.isAdmin();
  
//   console.log('🔐 AdminLayout - Vérification admin:', {
//     user: currentUser?.username,
//     is_staff: currentUser?.is_staff,
//     is_superuser: currentUser?.is_superuser,
//     isAdmin: isAdmin
//   });
  
//   if (!currentUser || !isAdmin) {
//     console.warn('⚠️ Accès refusé : utilisateur non admin', {
//       user: currentUser,
//       is_staff: currentUser?.is_staff,
//       is_superuser: currentUser?.is_superuser
//     });
//     return <Navigate to="/dashboard" replace />;
//   }

//   const menuItems = [
//     {
//       title: "Tableau de Bord",
//       icon: "dashboard",
//       path: "/admin",
//       exact: true
//     },
//     {
//       title: "Déposer un Projet",
//       icon: "add_circle",
//       path: "/admin/submit-project",
//       badge: "Nouveau"
//     },
//     {
//       title: "Explorer",
//       icon: "explore",
//       path: "/admin/explore"
//     },
//     {
//       title: "Gestion Utilisateurs",
//       icon: "people",
//       path: "/admin/users"
//     },
//     {
//       title: "Gestion Projets",
//       icon: "folder",
//       path: "/admin/projects"
//     },
//     {
//       title: "Statistiques",
//       icon: "analytics",
//       path: "/admin/analytics"
//     },
//     {
//       title: "Profil",
//       icon: "person",
//       path: "/admin/profile"
//     },
//     {
//       title: "Paramètres",
//       icon: "settings",
//       path: "/admin/settings"
//     },
//   ];

//   const getDisplayName = () => {
//     if (currentUser.first_name && currentUser.last_name) {
//       return `${currentUser.first_name} ${currentUser.last_name}`;
//     }
//     return currentUser.username || 'Administrateur';
//   };

//   const isActive = (path) => {
//     if (path === '/admin') {
//       return location.pathname === '/admin' || location.pathname === '/admin/';
//     }
//     return location.pathname.startsWith(path);
//   };

//   const getPageTitle = () => {
//     const currentPath = location.pathname;
//     const item = menuItems.find(item => 
//       item.path === '/admin' ? currentPath === '/admin' || currentPath === '/admin/' : 
//       currentPath.startsWith(item.path)
//     );
//     return item?.title || 'Admin Dashboard';
//   };

//   const LoadingSpinner = () => (
//     <div className="flex items-center justify-center h-full">
//       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E30613]"></div>
//     </div>
//   );

//   return (
//     <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
//       {/* Sidebar */}
//       <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#001F3F] text-white transition-all duration-300 flex-shrink-0 fixed h-full z-10`}>
//         <div className="flex items-center justify-between p-4 border-b border-[#003265]">
//           {sidebarOpen && (
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 bg-[#E30613] rounded-full flex items-center justify-center">
//                 <span className="font-bold text-white">A</span>
//               </div>
//               <span className="text-white font-semibold">Admin Simplon</span>
//             </div>
//           )}
//           <button 
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="p-1 rounded hover:bg-[#003265] transition-colors"
//             aria-label={sidebarOpen ? "Réduire le menu" : "Développer le menu"}
//           >
//             {sidebarOpen ? (
//               <span className="material-symbols-outlined text-white">menu_open</span>
//             ) : (
//               <span className="material-symbols-outlined text-white">menu</span>
//             )}
//           </button>
//         </div>

//         <nav className="p-4 space-y-2">
//           {menuItems.map((item) => (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={`flex items-center gap-3 p-3 rounded-lg transition-colors relative ${
//                 isActive(item.path)
//                   ? 'bg-[#E30613] text-white' 
//                   : 'text-white/80 hover:bg-[#003265] hover:text-white'
//               }`}
//               title={!sidebarOpen ? item.title : ''}
//             >
//               <span className="material-symbols-outlined">{item.icon}</span>
//               {sidebarOpen && (
//                 <>
//                   <span className="text-sm font-medium">{item.title}</span>
//                   {item.badge && (
//                     <span className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-500 text-yellow-900 text-xs px-2 py-1 rounded-full animate-pulse">
//                       {item.badge}
//                     </span>
//                   )}
//                 </>
//               )}
//             </Link>
//           ))}
//         </nav>

//         {/* User info en bas */}
//         <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#003265]">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-[#E30613] rounded-full flex items-center justify-center">
//               <span className="font-bold text-white">
//                 {currentUser.username?.charAt(0).toUpperCase() || 'A'}
//               </span>
//             </div>
//             {sidebarOpen && (
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-white truncate">
//                   {getDisplayName()}
//                 </p>
//                 <p className="text-xs text-white/70 truncate">
//                   {currentUser.is_superuser ? 'Super Admin' : 'Administrateur'}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
//         {/* Header */}
//         <header className="bg-white dark:bg-[#0d1a29] border-b border-gray-200 dark:border-gray-700 p-4">
//           <div className="flex items-center justify-between">
//             <h1 className="text-xl font-bold text-[#001F3F] dark:text-white">
//               {getPageTitle()}
//             </h1>
//             <div className="flex items-center gap-4">
//               <span className="text-sm text-gray-600 dark:text-gray-400 hidden md:inline">
//                 Connecté en tant que <strong className="text-[#001F3F] dark:text-white">{getDisplayName()}</strong>
//               </span>
//               <button
//                 onClick={() => authService.logout()}
//                 className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#c40511] text-sm font-medium transition-colors"
//               >
//                 Déconnexion
//               </button>
//               <Link 
//                 to="/"
//                 className="bg-[#001F3F] text-white px-4 py-2 rounded-lg hover:bg-[#003265] text-sm font-medium transition-colors"
//               >
//                 Retour au site
//               </Link>
//             </div>
//           </div>
//         </header>

//         {/* Page Content avec Suspense */}
//         <main className="flex-1 overflow-auto p-4 md:p-6">
//           <Suspense fallback={<LoadingSpinner />}>
//             <Outlet />
//           </Suspense>
//         </main>

//         {/* Footer */}
//         <footer className="bg-white dark:bg-[#0d1a29] border-t border-gray-200 dark:border-gray-700 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
//           <p>© {new Date().getFullYear()} Simplon - Plateforme Admin</p>
//           <p className="text-xs mt-1">Version 1.2.0 • Connexion: {currentUser._source || 'simulation'}</p>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;


// src/components/admin/AdminLayout.jsx
import React, { useState, Suspense } from 'react';
import { Link, useLocation, Navigate, Outlet } from 'react-router-dom';
import authService from '../../services/auth';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  const currentUser = authService.getCurrentUser();
  const isAdmin = authService.isAdmin();
  
  console.log('🔐 AdminLayout - Vérification admin:', {
    user: currentUser?.username,
    isAdmin: isAdmin
  });
  
  if (!currentUser || !isAdmin) {
    console.warn('⚠️ Accès refusé : utilisateur non admin');
    return <Navigate to="/dashboard" replace />;
  }

  const menuItems = [
    { title: "Tableau de Bord", icon: "dashboard", path: "/admin" },
    { title: "Déposer un Projet", icon: "add_circle", path: "/admin/submit-project", badge: "Nouveau" },
    { title: "Explorer", icon: "explore", path: "/admin/explore" },
    { title: "Gestion Utilisateurs", icon: "people", path: "/admin/users" },
    { title: "Gestion Projets", icon: "folder", path: "/admin/projects" },
    { title: "Statistiques", icon: "analytics", path: "/admin/analytics" },
    { title: "Profil", icon: "person", path: "/admin/profile" },
    { title: "Paramètres", icon: "settings", path: "/admin/settings" },
  ];

  const getDisplayName = () => {
    if (currentUser.first_name && currentUser.last_name) {
      return `${currentUser.first_name} ${currentUser.last_name}`;
    }
    return currentUser.username || 'Administrateur';
  };

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin' || location.pathname === '/admin/';
    return location.pathname.startsWith(path);
  };

  const getPageTitle = () => {
    const currentPath = location.pathname;
    const item = menuItems.find(item => 
      item.path === '/admin' ? currentPath === '/admin' || currentPath === '/admin/' : 
      currentPath.startsWith(item.path)
    );
    return item?.title || 'Admin Dashboard';
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#001F3F] text-white transition-all duration-300 flex-shrink-0 fixed h-full z-10`}>
        <div className="flex items-center justify-between p-4 border-b border-[#003265]">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#E30613] rounded-full flex items-center justify-center">
                <span className="font-bold text-white">A</span>
              </div>
              <span className="text-white font-semibold">Admin Simplon</span>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded hover:bg-[#003265] transition-colors"
          >
            {sidebarOpen ? (
              <span className="material-symbols-outlined text-white">menu_open</span>
            ) : (
              <span className="material-symbols-outlined text-white">menu</span>
            )}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors relative ${
                isActive(item.path)
                  ? 'bg-[#E30613] text-white' 
                  : 'text-white/80 hover:bg-[#003265] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {sidebarOpen && (
                <>
                  <span className="text-sm font-medium">{item.title}</span>
                  {item.badge && (
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-500 text-yellow-900 text-xs px-2 py-1 rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          ))}
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#003265]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E30613] rounded-full flex items-center justify-center">
              <span className="font-bold text-white">
                {currentUser.username?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {getDisplayName()}
                </p>
                <p className="text-xs text-white/70 truncate">
                  {currentUser.is_superuser ? 'Super Admin' : 'Administrateur'}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="bg-white dark:bg-[#0d1a29] border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#001F3F] dark:text-white">
              {getPageTitle()}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400 hidden md:inline">
                Connecté en tant que <strong className="text-[#001F3F] dark:text-white">{getDisplayName()}</strong>
              </span>
              <button
                onClick={() => authService.logout()}
                className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#c40511] text-sm font-medium transition-colors"
              >
                Déconnexion
              </button>
              <Link 
                to="/"
                className="bg-[#001F3F] text-white px-4 py-2 rounded-lg hover:bg-[#003265] text-sm font-medium transition-colors"
              >
                Retour au site
              </Link>
            </div>
          </div>
        </header>

        {/* Content avec Suspense */}
        <main className="flex-1 overflow-auto p-6">
          <Suspense fallback={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E30613]"></div>
            </div>
          }>
            <Outlet />
          </Suspense>
        </main>

        <footer className="bg-white dark:bg-[#0d1a29] border-t border-gray-200 dark:border-gray-700 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Simplon - Plateforme Admin</p>
          <p className="text-xs mt-1">Version 1.2.0</p>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;