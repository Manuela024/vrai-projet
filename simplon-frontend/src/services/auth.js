


// // src/services/auth.js - VERSION AVEC DONNÉES RÉELLES
// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:8000/api';

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
//   // ✅ LOGIN AVEC DONNÉES RÉELLES
//   async login(matricule, password) {
//     console.log('🔐 Login attempt for:', matricule);
    
//     try {
//       // 1. Obtenir le token JWT
//       const tokenResponse = await axios.post(`${API_BASE_URL}/token/`, {
//         username: matricule,
//         password: password
//       });
      
//       const { access, refresh } = tokenResponse.data;
      
//       // Stocker les tokens
//       localStorage.setItem('access_token', access);
//       localStorage.setItem('refresh_token', refresh);
      
//       console.log('✅ Token received');
      
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
      
//       console.log('✅ Storing user:', userToStore);
//       localStorage.setItem('user', JSON.stringify(userToStore));
      
//       return { success: true, user: userToStore };
      
//     } catch (error) {
//       console.error('❌ Login error:', error.message);
      
//       if (error.response?.status === 401) {
//         throw new Error('Matricule ou mot de passe incorrect');
//       }
      
//       throw error;
//     }
//   },

//   // ✅ QUICK LOGIN
//   async quickLogin(matricule, password) {
//     console.log('🚀 Quick login for:', matricule);
    
//     try {
//       return await this.login(matricule, password);
//     } catch (error) {
//       console.log('🔄 Trying simulation...');
//       return this.mockLogin(matricule, password);
//     }
//   },

//   // ✅ MOCK LOGIN (utilise aussi les vraies données si disponible)
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
        
//         localStorage.setItem('user', JSON.stringify(user));
//         localStorage.setItem('access_token', 'mock_token_' + Date.now());
//         localStorage.setItem('refresh_token', 'mock_refresh_' + Date.now());
        
//         console.log('✅ User created:', user);
//         resolve({ success: true, user, isSimulation: true });
        
//       }, 500);
//     });
//   },

//   // ✅ IS AUTHENTICATED
//   isAuthenticated() {
//     const user = localStorage.getItem('user');
//     const token = localStorage.getItem('access_token');
//     return !!(user && token);
//   },

//   // ✅ IS ADMIN
//   isAdmin() {
//     try {
//       const userStr = localStorage.getItem('user');
//       if (!userStr) return false;
      
//       const user = JSON.parse(userStr);
//       return !!(user.is_staff || user.is_superuser || user.isAdmin);
//     } catch (error) {
//       console.error('isAdmin error:', error);
//       return false;
//     }
//   },

//   // ✅ GET CURRENT USER
//   getCurrentUser() {
//     try {
//       const userStr = localStorage.getItem('user');
//       const user = userStr ? JSON.parse(userStr) : null;
      
//       // Debug: afficher les données
//       if (user) {
//         console.log('🔍 getCurrentUser - Data:', {
//           first_name: user.first_name,
//           last_name: user.last_name,
//           email: user.email,
//           source: user._source
//         });
//       }
      
//       return user;
//     } catch (error) {
//       console.error('getCurrentUser error:', error);
//       return null;
//     }
//   },

//   // ✅ LOGOUT
//   logout() {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('refresh_token');
//     localStorage.removeItem('user');
//     window.location.href = '/login';
//   },

//   // ✅ METTRE À JOUR LOCALEMENT
//   updateProfile(updates) {
//     try {
//       const currentUser = this.getCurrentUser();
//       if (!currentUser) return false;
      
//       const updatedUser = { ...currentUser, ...updates };
//       localStorage.setItem('user', JSON.stringify(updatedUser));
      
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
      
//       localStorage.setItem('user', JSON.stringify(user));
//       console.log('✅ Forced real data:', user);
//       return user;
//     }
//     return null;
//   }
// };

// export default authService;



// // src/services/auth.js - VERSION SIMPLIFIÉE
// const TOKEN_KEY = 'simplon_access_token';
// const USER_KEY = 'simplon_user';

// const authService = {
//   // Login simplifié pour test
//   async login(matricule, password) {
//     console.log('🔐 Tentative de connexion:', matricule);
    
//     // Simulation
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         // Test avec admin
//         if (matricule === 'admin' && password === 'admin123') {
//           const user = {
//             id: 1,
//             username: 'admin',
//             email: 'admin@simplon.com',
//             first_name: 'Admin',
//             last_name: 'System',
//             is_staff: true,
//             is_superuser: true,
//             isAdmin: true,
//             role: 'admin'
//           };
          
//           localStorage.setItem(USER_KEY, JSON.stringify(user));
//           localStorage.setItem(TOKEN_KEY, 'mock_token_' + Date.now());
          
//           console.log('✅ Connexion admin réussie');
//           resolve({ success: true, user });
          
//         } else if (matricule && password) {
//           // Utilisateur normal
//           const user = {
//             id: Date.now(),
//             username: matricule,
//             email: `${matricule}@simplon.com`,
//             first_name: 'Utilisateur',
//             last_name: 'Test',
//             is_staff: false,
//             is_superuser: false,
//             isAdmin: false,
//             role: 'user'
//           };
          
//           localStorage.setItem(USER_KEY, JSON.stringify(user));
//           localStorage.setItem(TOKEN_KEY, 'mock_token_user_' + Date.now());
          
//           console.log('✅ Connexion utilisateur réussie');
//           resolve({ success: true, user });
          
//         } else {
//           reject(new Error('Identifiants invalides'));
//         }
//       }, 500);
//     });
//   },

//   isAuthenticated() {
//     const token = localStorage.getItem(TOKEN_KEY);
//     const user = localStorage.getItem(USER_KEY);
//     return !!(token && user);
//   },

//   isAdmin() {
//     try {
//       const userStr = localStorage.getItem(USER_KEY);
//       if (!userStr) return false;
      
//       const user = JSON.parse(userStr);
//       return !!(user.is_staff || user.is_superuser || user.isAdmin);
//     } catch (error) {
//       console.error('isAdmin error:', error);
//       return false;
//     }
//   },

//   getCurrentUser() {
//     try {
//       const userStr = localStorage.getItem(USER_KEY);
//       if (!userStr) return null;
      
//       return JSON.parse(userStr);
//     } catch (error) {
//       console.error('getCurrentUser error:', error);
//       return null;
//     }
//   },

//   getAccessToken() {
//     return localStorage.getItem(TOKEN_KEY);
//   },

//   logout() {
//     localStorage.removeItem(TOKEN_KEY);
//     localStorage.removeItem(USER_KEY);
//     window.location.href = '/login';
//   }
// };

// export default authService;



// // src/services/auth.js - VERSION COMPLÈTE
// const TOKEN_KEY = 'simplon_access_token';
// const USER_KEY = 'simplon_user';

// const authService = {
//   // Login normal
//   async login(matricule, password) {
//     console.log('🔐 Login for:', matricule);
    
//     try {
//       // Simulation pour test
//       return new Promise((resolve, reject) => {
//         setTimeout(() => {
//           if (matricule === 'admin' && password === 'admin123') {
//             const user = {
//               id: 1,
//               username: 'admin',
//               email: 'admin@simplon.com',
//               first_name: 'Admin',
//               last_name: 'System',
//               is_staff: true,
//               is_superuser: true,
//               isAdmin: true,
//               role: 'admin'
//             };
            
//             localStorage.setItem(USER_KEY, JSON.stringify(user));
//             localStorage.setItem(TOKEN_KEY, 'mock_admin_token_' + Date.now());
            
//             resolve({ success: true, user });
            
//           } else if (matricule && password) {
//             const user = {
//               id: Date.now(),
//               username: matricule,
//               email: `${matricule}@simplon.com`,
//               first_name: 'User',
//               last_name: 'Test',
//               is_staff: false,
//               is_superuser: false,
//               isAdmin: false,
//               role: 'user'
//             };
            
//             localStorage.setItem(USER_KEY, JSON.stringify(user));
//             localStorage.setItem(TOKEN_KEY, 'mock_user_token_' + Date.now());
            
//             resolve({ success: true, user });
            
//           } else {
//             reject(new Error('Identifiants invalides'));
//           }
//         }, 500);
//       });
      
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   },

//   // Mock Login (pour QuickLogin)
//   mockLogin(matricule, password) {
//     console.log('🎭 Mock login for:', matricule);
    
//     return new Promise((resolve, reject) => {
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
        
//         // Créer l'utilisateur
//         const user = {
//           id: Date.now(),
//           username: matricule,
//           email: `${matricule}@simplon.com`,
//           first_name: 'Mock',
//           last_name: 'User',
//           is_staff: matricule === 'admin',
//           is_superuser: matricule === 'admin',
//           isAdmin: matricule === 'admin',
//           role: matricule === 'admin' ? 'admin' : 'user'
//         };
        
//         localStorage.setItem(USER_KEY, JSON.stringify(user));
//         localStorage.setItem(TOKEN_KEY, 'mock_token_' + Date.now());
        
//         resolve({ success: true, user, isSimulation: true });
        
//       }, 500);
//     });
//   },

//   // Quick Login
//   async quickLogin(matricule, password) {
//     console.log('🚀 Quick login for:', matricule);
    
//     try {
//       // Essayer d'abord le login normal
//       return await this.login(matricule, password);
//     } catch (error) {
//       console.log('🔄 Fallback to mock login');
//       return this.mockLogin(matricule, password);
//     }
//   },

//   // Vérifier l'authentification
//   isAuthenticated() {
//     const token = localStorage.getItem(TOKEN_KEY);
//     const user = localStorage.getItem(USER_KEY);
//     const isAuth = !!(token && user);
//     console.log('🔐 isAuthenticated:', isAuth);
//     return isAuth;
//   },

//   // Vérifier si admin
//   isAdmin() {
//     try {
//       const userStr = localStorage.getItem(USER_KEY);
//       if (!userStr) return false;
      
//       const user = JSON.parse(userStr);
//       const isAdmin = !!(user.is_staff || user.is_superuser || user.isAdmin);
//       console.log('👑 isAdmin:', isAdmin, 'for user:', user.username);
//       return isAdmin;
//     } catch (error) {
//       console.error('isAdmin error:', error);
//       return false;
//     }
//   },

//   // Récupérer l'utilisateur actuel
//   getCurrentUser() {
//     try {
//       const userStr = localStorage.getItem(USER_KEY);
//       if (!userStr) {
//         console.warn('⚠️ No user in localStorage');
//         return null;
//       }
      
//       const user = JSON.parse(userStr);
//       console.log('👤 getCurrentUser:', user.username);
//       return user;
//     } catch (error) {
//       console.error('getCurrentUser error:', error);
//       return null;
//     }
//   },

//   // Récupérer le token
//   getAccessToken() {
//     const token = localStorage.getItem(TOKEN_KEY);
//     console.log('🔑 getAccessToken:', token ? 'present' : 'missing');
//     return token;
//   },

//   // Déconnexion
//   logout() {
//     console.log('👋 Logout');
//     localStorage.removeItem(TOKEN_KEY);
//     localStorage.removeItem(USER_KEY);
//     window.location.href = '/login';
//   }
// };

// export default authService;


// // src/services/auth.js - VERSION CORRIGÉE ET SIMPLIFIÉE
// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:8000/api';

// // Clés de stockage standardisées
// const TOKEN_KEY = 'simplon_access_token';
// const USER_KEY = 'simplon_user';

// const authService = {
//   // ✅ LOGIN PRINCIPAL - Essaie d'abord l'API, sinon simulation
//   async login(matricule, password) {
//     console.log('🔐 Tentative de connexion pour:', matricule);
    
//     try {
//       // 1. Essayer l'API Django d'abord
//       const tokenResponse = await axios.post(`${API_BASE_URL}/token/`, {
//         username: matricule,
//         password: password
//       });
      
//       const { access, refresh } = tokenResponse.data;
      
//       // Stocker les tokens
//       localStorage.setItem(TOKEN_KEY, access);
//       localStorage.setItem('refresh_token', refresh);
      
//       console.log('✅ Token JWT reçu');
      
//       // 2. Essayer de récupérer les infos utilisateur
//       let userData = null;
//       try {
//         // Chercher par username
//         const response = await axios.get(`${API_BASE_URL}/users/?search=${encodeURIComponent(matricule)}`, {
//           headers: {
//             'Authorization': `Bearer ${access}`,
//             'Content-Type': 'application/json',
//           },
//         });
        
//         if (response.data.results && response.data.results.length > 0) {
//           userData = response.data.results[0];
//           console.log('✅ Données utilisateur API:', userData);
//         }
//       } catch (apiError) {
//         console.log('⚠️ Récupération utilisateur API échouée, utilisation données par défaut');
//       }
      
//       // 3. Construire l'objet utilisateur
//       const userToStore = {
//         // Données de base
//         id: userData?.id || Date.now(),
//         username: userData?.username || matricule,
//         email: userData?.email || `${matricule}@simplon.com`,
//         first_name: userData?.first_name || 'Utilisateur',
//         last_name: userData?.last_name || 'Simplon',
        
//         // Permissions
//         is_staff: userData?.is_staff || false,
//         is_superuser: userData?.is_superuser || false,
//         is_active: userData?.is_active !== undefined ? userData.is_active : true,
        
//         // Champs personnalisés
//         matricule: matricule,
//         cohort: userData?.cohort || 'Simplon 2024',
//         date_joined: userData?.date_joined || new Date().toISOString(),
        
//         // Champs calculés
//         isAdmin: !!(userData?.is_staff || userData?.is_superuser),
//         role: (userData?.is_staff || userData?.is_superuser) ? 'admin' : 'user',
        
//         // Source
//         _source: userData ? 'django_api' : 'default'
//       };
      
//       console.log('✅ Utilisateur stocké:', userToStore);
//       localStorage.setItem(USER_KEY, JSON.stringify(userToStore));
      
//       return { success: true, user: userToStore };
      
//     } catch (error) {
//       console.log('❌ Erreur API, tentative de connexion simulée:', error.message);
      
//       // Fallback: simulation si API échoue
//       return this.mockLogin(matricule, password);
//     }
//   },

//   // ✅ CONNEXION SIMULÉE (fallback)
//   mockLogin(matricule, password) {
//     return new Promise((resolve, reject) => {
//       console.log('🎭 Mode simulation');
      
//       setTimeout(() => {
//         // Vérifier les identifiants de test
//         const testCredentials = {
//           'admin': 'admin123',
//           'simplon_2025001': 'simplon2024',
//           'user123': 'password123'
//         };
        
//         if (!testCredentials[matricule] || testCredentials[matricule] !== password) {
//           reject(new Error('Matricule ou mot de passe incorrect'));
//           return;
//         }
        
//         // Données simulées
//         const isAdmin = matricule === 'admin';
//         const user = {
//           id: 1,
//           username: matricule,
//           email: `${matricule}@simplon.com`,
//           first_name: isAdmin ? 'Admin' : 'Utilisateur',
//           last_name: isAdmin ? 'System' : 'Test',
//           is_staff: isAdmin,
//           is_superuser: isAdmin,
//           is_active: true,
//           matricule: matricule,
//           cohort: 'Simplon 2024',
//           date_joined: new Date().toISOString(),
//           isAdmin: isAdmin,
//           role: isAdmin ? 'admin' : 'user',
//           _source: 'simulation'
//         };
        
//         localStorage.setItem(USER_KEY, JSON.stringify(user));
//         localStorage.setItem(TOKEN_KEY, 'mock_token_' + Date.now());
        
//         console.log('✅ Connexion simulée réussie:', user);
//         resolve({ success: true, user, isSimulation: true });
//       }, 500);
//     });
//   },

//   // ✅ CONNEXION RAPIDE (pour développement)
//   quickLogin(matricule = 'admin', password = 'admin123') {
//     console.log('🚀 Connexion rapide:', matricule);
//     return this.login(matricule, password).catch(() => {
//       // Si erreur, utiliser la simulation
//       return this.mockLogin(matricule, password);
//     });
//   },

//   // ✅ VÉRIFIER SI AUTHENTIFIÉ
//   isAuthenticated() {
//     const token = localStorage.getItem(TOKEN_KEY);
//     const user = localStorage.getItem(USER_KEY);
//     return !!(token && user);
//   },

//   // ✅ VÉRIFIER SI ADMIN
//   isAdmin() {
//     try {
//       const userStr = localStorage.getItem(USER_KEY);
//       if (!userStr) return false;
      
//       const user = JSON.parse(userStr);
//       return !!(user.is_staff || user.is_superuser || user.isAdmin);
//     } catch (error) {
//       console.error('Erreur isAdmin:', error);
//       return false;
//     }
//   },

//   // ✅ OBTENIR L'UTILISATEUR COURANT
//   getCurrentUser() {
//     try {
//       const userStr = localStorage.getItem(USER_KEY);
//       if (!userStr) return null;
      
//       const user = JSON.parse(userStr);
//       console.log('🔍 Utilisateur courant:', {
//         nom: `${user.first_name} ${user.last_name}`,
//         email: user.email,
//         role: user.role,
//         source: user._source
//       });
      
//       return user;
//     } catch (error) {
//       console.error('Erreur getCurrentUser:', error);
//       return null;
//     }
//   },

//   // ✅ OBTENIR LE TOKEN
//   getAccessToken() {
//     return localStorage.getItem(TOKEN_KEY) || localStorage.getItem('access_token');
//   },

//   // ✅ DÉCONNEXION
//   logout() {
//     localStorage.removeItem(TOKEN_KEY);
//     localStorage.removeItem('refresh_token');
//     localStorage.removeItem(USER_KEY);
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('user');
    
//     console.log('🚪 Déconnexion effectuée');
//     window.location.href = '/login';
//   },

//   // ✅ METTRE À JOUR LE PROFIL (localement)
//   updateProfile(updates) {
//     try {
//       const currentUser = this.getCurrentUser();
//       if (!currentUser) return false;
      
//       const updatedUser = { ...currentUser, ...updates };
//       localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      
//       console.log('✅ Profil mis à jour:', updatedUser);
//       return true;
//     } catch (error) {
//       console.error('❌ Erreur mise à jour profil:', error);
//       return false;
//     }
//   },

//   // ✅ DEBUG - Afficher l'état de l'authentification
//   debug() {
//     console.log('🔍 DEBUG Authentification:');
//     console.log('- Token:', localStorage.getItem(TOKEN_KEY) ? '✓ Présent' : '✗ Absent');
//     console.log('- User:', localStorage.getItem(USER_KEY) ? '✓ Présent' : '✗ Absent');
//     console.log('- isAuthenticated:', this.isAuthenticated());
//     console.log('- isAdmin:', this.isAdmin());
//     console.log('- Current User:', this.getCurrentUser());
//   },

//   // ✅ MIGRATION - Compatibilité avec anciennes clés
//   migrateOldKeys() {
//     const oldToken = localStorage.getItem('access_token');
//     const oldUser = localStorage.getItem('user');
    
//     if (oldToken && !localStorage.getItem(TOKEN_KEY)) {
//       localStorage.setItem(TOKEN_KEY, oldToken);
//       console.log('✅ Token migré depuis access_token');
//     }
    
//     if (oldUser && !localStorage.getItem(USER_KEY)) {
//       localStorage.setItem(USER_KEY, oldUser);
//       console.log('✅ Utilisateur migré depuis user');
//     }
//   }
// };

// // Migration automatique au chargement
// authService.migrateOldKeys();

// export default authService;



// // src/services/auth.js - VERSION AMÉLIORÉE
// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:8000/api';

// // Clés de stockage
// const TOKEN_KEY = 'simplon_access_token';
// const REFRESH_TOKEN_KEY = 'simplon_refresh_token';
// const USER_KEY = 'simplon_user';

// const authService = {
//   // ✅ VÉRIFIER ET RAJOUTER LE TOKEN SI NÉCESSAIRE
//   async ensureValidToken() {
//     console.log('🔐 Vérification du token...');
    
//     const token = this.getAccessToken();
//     const refreshToken = this.getRefreshToken();
    
//     if (!token) {
//       console.log('❌ Aucun token trouvé');
//       return null;
//     }
    
//     // Vérifier si le token est expiré
//     if (this.isTokenExpired(token)) {
//       console.log('⚠️ Token expiré, tentative de rafraîchissement...');
      
//       if (refreshToken) {
//         try {
//           const newTokens = await this.refreshAccessToken(refreshToken);
//           return newTokens.access;
//         } catch (refreshError) {
//           console.error('❌ Échec du rafraîchissement:', refreshError);
//           this.logout();
//           return null;
//         }
//       } else {
//         console.log('❌ Pas de refresh token disponible');
//         this.logout();
//         return null;
//       }
//     }
    
//     console.log('✅ Token valide');
//     return token;
//   },
  
//   // ✅ RAFRAÎCHIR LE TOKEN
//   async refreshAccessToken(refreshToken) {
//     console.log('🔄 Rafraîchissement du token...');
    
//     try {
//       const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
//         refresh: refreshToken
//       });
      
//       const { access, refresh: newRefresh } = response.data;
      
//       // Sauvegarder les nouveaux tokens
//       this.setAccessToken(access);
//       if (newRefresh) {
//         this.setRefreshToken(newRefresh);
//       }
      
//       console.log('✅ Token rafraîchi avec succès');
//       return { access, refresh: newRefresh || refreshToken };
      
//     } catch (error) {
//       console.error('❌ Erreur lors du rafraîchissement:', error);
//       throw error;
//     }
//   },
  
//   // ✅ VÉRIFIER SI LE TOKEN EST EXPIRÉ
//   isTokenExpired(token) {
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       const expiry = payload.exp * 1000; // Convertir en millisecondes
//       const now = Date.now();
//       return now >= expiry;
//     } catch (error) {
//       console.error('❌ Erreur lors de la vérification du token:', error);
//       return true; // Si erreur, considérer comme expiré
//     }
//   },
  
//   // ✅ CONNEXION AMÉLIORÉE
//   async login(username, password) {
//     console.log('🔐 Tentative de connexion pour:', username);
    
//     try {
//       // Essayer l'API Django
//       const tokenResponse = await axios.post(`${API_BASE_URL}/token/`, {
//         username: username,
//         password: password
//       });
      
//       const { access, refresh } = tokenResponse.data;
      
//       // Sauvegarder les tokens
//       this.setAccessToken(access);
//       this.setRefreshToken(refresh);
      
//       console.log('✅ Tokens reçus avec succès');
      
//       // Récupérer les infos utilisateur
//       let userData = null;
//       try {
//         const userResponse = await axios.get(`${API_BASE_URL}/users/me/`, {
//           headers: {
//             'Authorization': `Bearer ${access}`,
//             'Content-Type': 'application/json',
//           },
//         });
        
//         if (userResponse.data) {
//           userData = userResponse.data;
//           console.log('✅ Données utilisateur API:', userData);
//         }
//       } catch (apiError) {
//         console.log('⚠️ Récupération utilisateur API échouée:', apiError.message);
//         // Utiliser des données par défaut
//         userData = {
//           id: Date.now(),
//           username: username,
//           email: `${username}@simplon.com`,
//           first_name: 'Utilisateur',
//           last_name: 'Simplon',
//           is_staff: username === 'admin',
//           is_superuser: username === 'admin',
//           is_active: true,
//           cohort: 'Simplon 2024',
//         };
//       }
      
//       // Préparer l'objet utilisateur
//       const userToStore = {
//         id: userData?.id || Date.now(),
//         username: userData?.username || username,
//         email: userData?.email || `${username}@simplon.com`,
//         first_name: userData?.first_name || 'Utilisateur',
//         last_name: userData?.last_name || 'Simplon',
//         is_staff: userData?.is_staff || false,
//         is_superuser: userData?.is_superuser || false,
//         is_active: userData?.is_active !== undefined ? userData.is_active : true,
//         cohort: userData?.cohort || 'Simplon 2024',
//         date_joined: userData?.date_joined || new Date().toISOString(),
//         isAdmin: !!(userData?.is_staff || userData?.is_superuser),
//         role: (userData?.is_staff || userData?.is_superuser) ? 'admin' : 'user',
//         _source: userData ? 'django_api' : 'default'
//       };
      
//       console.log('✅ Utilisateur stocké:', userToStore);
//       this.setCurrentUser(userToStore);
      
//       return { success: true, user: userToStore };
      
//     } catch (error) {
//       console.log('❌ Erreur API, tentative de connexion simulée:', error.message);
      
//       // Fallback: simulation
//       return this.mockLogin(username, password);
//     }
//   },
  
//   // ✅ FONCTIONS DE BASE (garder celles existantes)
//   setAccessToken(token) {
//     localStorage.setItem(TOKEN_KEY, token);
//   },
  
//   getAccessToken() {
//     return localStorage.getItem(TOKEN_KEY);
//   },
  
//   setRefreshToken(token) {
//     localStorage.setItem(REFRESH_TOKEN_KEY, token);
//   },
  
//   getRefreshToken() {
//     return localStorage.getItem(REFRESH_TOKEN_KEY);
//   },
  
//   setCurrentUser(user) {
//     localStorage.setItem(USER_KEY, JSON.stringify(user));
//   },
  
//   getCurrentUser() {
//     try {
//       const userStr = localStorage.getItem(USER_KEY);
//       return userStr ? JSON.parse(userStr) : null;
//     } catch (error) {
//       console.error('Erreur getCurrentUser:', error);
//       return null;
//     }
//   },
  
//   isAuthenticated() {
//     const token = this.getAccessToken();
//     return !!(token && !this.isTokenExpired(token));
//   },
  
//   logout() {
//     localStorage.removeItem(TOKEN_KEY);
//     localStorage.removeItem(REFRESH_TOKEN_KEY);
//     localStorage.removeItem(USER_KEY);
//     console.log('🚪 Déconnexion effectuée');
//     window.location.href = '/login';
//   },
  
//   // ✅ CONNEXION RAPIDE POUR TEST
//   async quickLogin(username = 'admin', password = 'admin123') {
//     console.log('🚀 Connexion rapide:', username);
//     return this.login(username, password).catch(() => {
//       return this.mockLogin(username, password);
//     });
//   },
  
//   // ✅ MOCK LOGIN (fallback)
//   mockLogin(username, password) {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         const testCredentials = {
//           'admin': 'admin123',
//           'simplon_2025001': 'simplon2024',
//           'user123': 'password123'
//         };
        
//         if (!testCredentials[username] || testCredentials[username] !== password) {
//           reject(new Error('Matricule ou mot de passe incorrect'));
//           return;
//         }
        
//         const isAdmin = username === 'admin';
//         const user = {
//           id: 1,
//           username: username,
//           email: `${username}@simplon.com`,
//           first_name: isAdmin ? 'Admin' : 'Utilisateur',
//           last_name: isAdmin ? 'System' : 'Test',
//           is_staff: isAdmin,
//           is_superuser: isAdmin,
//           is_active: true,
//           cohort: 'Simplon 2024',
//           date_joined: new Date().toISOString(),
//           isAdmin: isAdmin,
//           role: isAdmin ? 'admin' : 'user',
//           _source: 'simulation'
//         };
        
//         this.setCurrentUser(user);
//         this.setAccessToken('mock_token_' + Date.now());
//         this.setRefreshToken('mock_refresh_' + Date.now());
        
//         console.log('✅ Connexion simulée réussie');
//         resolve({ success: true, user, isSimulation: true });
//       }, 500);
//     });
//   },
  
//   // ✅ DEBUG
//   debug() {
//     console.log('🔍 DEBUG Authentification:');
//     console.log('- Token présent:', !!this.getAccessToken());
//     console.log('- Refresh token présent:', !!this.getRefreshToken());
//     console.log('- User présent:', !!this.getCurrentUser());
//     console.log('- Token expiré:', this.getAccessToken() ? this.isTokenExpired(this.getAccessToken()) : 'N/A');
//     console.log('- Authentifié:', this.isAuthenticated());
//     console.log('- Current User:', this.getCurrentUser());
//   }
// };

// export default authService;


// // src/services/auth.js - VERSION AMÉLIORÉE
// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:8000/api';

// // Clés de stockage
// const TOKEN_KEY = 'simplon_access_token';
// const REFRESH_TOKEN_KEY = 'simplon_refresh_token';
// const USER_KEY = 'simplon_user';

// const authService = {
//   // ✅ VÉRIFIER ET RAJOUTER LE TOKEN SI NÉCESSAIRE
//   async ensureValidToken() {
//     console.log('🔐 Vérification du token...');
    
//     const token = this.getAccessToken();
//     const refreshToken = this.getRefreshToken();
    
//     if (!token) {
//       console.log('❌ Aucun token trouvé');
//       return null;
//     }
    
//     // Vérifier si le token est expiré
//     if (this.isTokenExpired(token)) {
//       console.log('⚠️ Token expiré, tentative de rafraîchissement...');
      
//       if (refreshToken) {
//         try {
//           const newTokens = await this.refreshAccessToken(refreshToken);
//           return newTokens.access;
//         } catch (refreshError) {
//           console.error('❌ Échec du rafraîchissement:', refreshError);
//           this.logout();
//           return null;
//         }
//       } else {
//         console.log('❌ Pas de refresh token disponible');
//         this.logout();
//         return null;
//       }
//     }
    
//     console.log('✅ Token valide');
//     return token;
//   },
  
//   // ✅ RAFRAÎCHIR LE TOKEN
//   async refreshAccessToken(refreshToken) {
//     console.log('🔄 Rafraîchissement du token...');
    
//     try {
//       const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
//         refresh: refreshToken
//       });
      
//       const { access, refresh: newRefresh } = response.data;
      
//       // Sauvegarder les nouveaux tokens
//       this.setAccessToken(access);
//       if (newRefresh) {
//         this.setRefreshToken(newRefresh);
//       }
      
//       console.log('✅ Token rafraîchi avec succès');
//       return { access, refresh: newRefresh || refreshToken };
      
//     } catch (error) {
//       console.error('❌ Erreur lors du rafraîchissement:', error);
//       throw error;
//     }
//   },
  
//   // ✅ VÉRIFIER SI LE TOKEN EST EXPIRÉ
//   isTokenExpired(token) {
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       const expiry = payload.exp * 1000; // Convertir en millisecondes
//       const now = Date.now();
//       return now >= expiry;
//     } catch (error) {
//       console.error('❌ Erreur lors de la vérification du token:', error);
//       return true; // Si erreur, considérer comme expiré
//     }
//   },
  
//   // ✅ CONNEXION AMÉLIORÉE
//   async login(username, password) {
//     console.log('🔐 Tentative de connexion pour:', username);
    
//     try {
//       // Essayer l'API Django
//       const tokenResponse = await axios.post(`${API_BASE_URL}/token/`, {
//         username: username,
//         password: password
//       });
      
//       const { access, refresh } = tokenResponse.data;
      
//       // Sauvegarder les tokens
//       this.setAccessToken(access);
//       this.setRefreshToken(refresh);
      
//       console.log('✅ Tokens reçus avec succès');
      
//       // Récupérer les infos utilisateur
//       let userData = null;
//       try {
//         const userResponse = await axios.get(`${API_BASE_URL}/users/me/`, {
//           headers: {
//             'Authorization': `Bearer ${access}`,
//             'Content-Type': 'application/json',
//           },
//         });
        
//         if (userResponse.data) {
//           userData = userResponse.data;
//           console.log('✅ Données utilisateur API:', userData);
//         }
//       } catch (apiError) {
//         console.log('⚠️ Récupération utilisateur API échouée:', apiError.message);
//         // Utiliser des données par défaut
//         userData = {
//           id: Date.now(),
//           username: username,
//           email: `${username}@simplon.com`,
//           first_name: 'Utilisateur',
//           last_name: 'Simplon',
//           is_staff: username === 'admin',
//           is_superuser: username === 'admin',
//           is_active: true,
//           cohort: 'Simplon 2024',
//         };
//       }
      
//       // Préparer l'objet utilisateur
//       const userToStore = {
//         id: userData?.id || Date.now(),
//         username: userData?.username || username,
//         email: userData?.email || `${username}@simplon.com`,
//         first_name: userData?.first_name || 'Utilisateur',
//         last_name: userData?.last_name || 'Simplon',
//         is_staff: userData?.is_staff || false,
//         is_superuser: userData?.is_superuser || false,
//         is_active: userData?.is_active !== undefined ? userData.is_active : true,
//         cohort: userData?.cohort || 'Simplon 2024',
//         date_joined: userData?.date_joined || new Date().toISOString(),
//         isAdmin: !!(userData?.is_staff || userData?.is_superuser),
//         role: (userData?.is_staff || userData?.is_superuser) ? 'admin' : 'user',
//         _source: userData ? 'django_api' : 'default'
//       };
      
//       console.log('✅ Utilisateur stocké:', userToStore);
//       this.setCurrentUser(userToStore);
      
//       return { success: true, user: userToStore };
      
//     } catch (error) {
//       console.log('❌ Erreur API, tentative de connexion simulée:', error.message);
      
//       // Fallback: simulation
//       return this.mockLogin(username, password);
//     }
//   },
  
//   // ✅ FONCTIONS DE BASE (garder celles existantes)
//   setAccessToken(token) {
//     localStorage.setItem(TOKEN_KEY, token);
//   },
  
//   getAccessToken() {
//     return localStorage.getItem(TOKEN_KEY);
//   },
  
//   setRefreshToken(token) {
//     localStorage.setItem(REFRESH_TOKEN_KEY, token);
//   },
  
//   getRefreshToken() {
//     return localStorage.getItem(REFRESH_TOKEN_KEY);
//   },
  
//   setCurrentUser(user) {
//     localStorage.setItem(USER_KEY, JSON.stringify(user));
//   },
  
//   getCurrentUser() {
//     try {
//       const userStr = localStorage.getItem(USER_KEY);
//       return userStr ? JSON.parse(userStr) : null;
//     } catch (error) {
//       console.error('Erreur getCurrentUser:', error);
//       return null;
//     }
//   },
  
//   isAuthenticated() {
//     const token = this.getAccessToken();
//     return !!(token && !this.isTokenExpired(token));
//   },
  
//   logout() {
//     localStorage.removeItem(TOKEN_KEY);
//     localStorage.removeItem(REFRESH_TOKEN_KEY);
//     localStorage.removeItem(USER_KEY);
//     console.log('🚪 Déconnexion effectuée');
//     window.location.href = '/login';
//   },
  
//   // ✅ CONNEXION RAPIDE POUR TEST
//   async quickLogin(username = 'admin', password = 'admin123') {
//     console.log('🚀 Connexion rapide:', username);
//     return this.login(username, password).catch(() => {
//       return this.mockLogin(username, password);
//     });
//   },
  
//   // ✅ MOCK LOGIN (fallback)
//   mockLogin(username, password) {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         const testCredentials = {
//           'admin': 'admin123',
//           'simplon_2025001': 'simplon2024',
//           'user123': 'password123'
//         };
        
//         if (!testCredentials[username] || testCredentials[username] !== password) {
//           reject(new Error('Matricule ou mot de passe incorrect'));
//           return;
//         }
        
//         const isAdmin = username === 'admin';
//         const user = {
//           id: 1,
//           username: username,
//           email: `${username}@simplon.com`,
//           first_name: isAdmin ? 'Admin' : 'Utilisateur',
//           last_name: isAdmin ? 'System' : 'Test',
//           is_staff: isAdmin,
//           is_superuser: isAdmin,
//           is_active: true,
//           cohort: 'Simplon 2024',
//           date_joined: new Date().toISOString(),
//           isAdmin: isAdmin,
//           role: isAdmin ? 'admin' : 'user',
//           _source: 'simulation'
//         };
        
//         this.setCurrentUser(user);
//         this.setAccessToken('mock_token_' + Date.now());
//         this.setRefreshToken('mock_refresh_' + Date.now());
        
//         console.log('✅ Connexion simulée réussie');
//         resolve({ success: true, user, isSimulation: true });
//       }, 500);
//     });
//   },
  
//   // ✅ DEBUG
//   debug() {
//     console.log('🔍 DEBUG Authentification:');
//     console.log('- Token présent:', !!this.getAccessToken());
//     console.log('- Refresh token présent:', !!this.getRefreshToken());
//     console.log('- User présent:', !!this.getCurrentUser());
//     console.log('- Token expiré:', this.getAccessToken() ? this.isTokenExpired(this.getAccessToken()) : 'N/A');
//     console.log('- Authentifié:', this.isAuthenticated());
//     console.log('- Current User:', this.getCurrentUser());
//   }
// };

// export default authService;


// src/services/auth.js - VERSION COMPLÈTE AVEC isAdmin()
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Clés de stockage
const TOKEN_KEY = 'simplon_access_token';
const REFRESH_TOKEN_KEY = 'simplon_refresh_token';
const USER_KEY = 'simplon_user';

const authService = {
  // ✅ VÉRIFIER SI L'UTILISATEUR EST ADMIN
  isAdmin() {
    try {
      const user = this.getCurrentUser();
      console.log('🔍 isAdmin - Vérification pour:', user?.username);
      
      if (!user) {
        console.log('❌ isAdmin: Pas d\'utilisateur connecté');
        return false;
      }
      
      // Vérifier plusieurs propriétés possibles
      const isAdminUser = 
        user.isAdmin === true ||
        user.role === 'admin' ||
        user.is_staff === true ||
        user.is_superuser === true ||
        user.role === 'administrator';
      
      console.log('🔍 isAdmin - Détails:', {
        username: user.username,
        isAdmin: user.isAdmin,
        role: user.role,
        is_staff: user.is_staff,
        is_superuser: user.is_superuser,
        result: isAdminUser
      });
      
      return isAdminUser;
    } catch (error) {
      console.error('❌ Erreur isAdmin:', error);
      return false;
    }
  },

  // ✅ VÉRIFIER ET RAJOUTER LE TOKEN SI NÉCESSAIRE
  async ensureValidToken() {
    console.log('🔐 Vérification du token...');
    
    const token = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    
    if (!token) {
      console.log('❌ Aucun token trouvé');
      return null;
    }
    
    // Vérifier si le token est expiré
    if (this.isTokenExpired(token)) {
      console.log('⚠️ Token expiré, tentative de rafraîchissement...');
      
      if (refreshToken) {
        try {
          const newTokens = await this.refreshAccessToken(refreshToken);
          return newTokens.access;
        } catch (refreshError) {
          console.error('❌ Échec du rafraîchissement:', refreshError);
          this.logout();
          return null;
        }
      } else {
        console.log('❌ Pas de refresh token disponible');
        this.logout();
        return null;
      }
    }
    
    console.log('✅ Token valide');
    return token;
  },
  
  // ✅ RAFRAÎCHIR LE TOKEN
  async refreshAccessToken(refreshToken) {
    console.log('🔄 Rafraîchissement du token...');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
        refresh: refreshToken
      });
      
      const { access, refresh: newRefresh } = response.data;
      
      // Sauvegarder les nouveaux tokens
      this.setAccessToken(access);
      if (newRefresh) {
        this.setRefreshToken(newRefresh);
      }
      
      console.log('✅ Token rafraîchi avec succès');
      return { access, refresh: newRefresh || refreshToken };
      
    } catch (error) {
      console.error('❌ Erreur lors du rafraîchissement:', error);
      throw error;
    }
  },
  
  // ✅ VÉRIFIER SI LE TOKEN EST EXPIRÉ
  isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convertir en millisecondes
      const now = Date.now();
      return now >= expiry;
    } catch (error) {
      console.error('❌ Erreur lors de la vérification du token:', error);
      return true; // Si erreur, considérer comme expiré
    }
  },
  
  // ✅ CONNEXION AMÉLIORÉE
  async login(username, password) {
    console.log('🔐 Tentative de connexion pour:', username);
    
    try {
      // Essayer l'API Django
      const tokenResponse = await axios.post(`${API_BASE_URL}/token/`, {
        username: username,
        password: password
      });
      
      const { access, refresh } = tokenResponse.data;
      
      // Sauvegarder les tokens
      this.setAccessToken(access);
      this.setRefreshToken(refresh);
      
      console.log('✅ Tokens reçus avec succès');
      
      // Récupérer les infos utilisateur
      let userData = null;
      try {
        const userResponse = await axios.get(`${API_BASE_URL}/users/me/`, {
          headers: {
            'Authorization': `Bearer ${access}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (userResponse.data) {
          userData = userResponse.data;
          console.log('✅ Données utilisateur API:', userData);
        }
      } catch (apiError) {
        console.log('⚠️ Récupération utilisateur API échouée:', apiError.message);
        // Utiliser des données par défaut
        userData = {
          id: Date.now(),
          username: username,
          email: `${username}@simplon.com`,
          first_name: 'Utilisateur',
          last_name: 'Simplon',
          is_staff: username === 'admin',
          is_superuser: username === 'admin',
          is_active: true,
          cohort: 'Simplon 2024',
        };
      }
      
      // Préparer l'objet utilisateur
      const userToStore = {
        id: userData?.id || Date.now(),
        username: userData?.username || username,
        email: userData?.email || `${username}@simplon.com`,
        first_name: userData?.first_name || 'Utilisateur',
        last_name: userData?.last_name || 'Simplon',
        is_staff: userData?.is_staff || false,
        is_superuser: userData?.is_superuser || false,
        is_active: userData?.is_active !== undefined ? userData.is_active : true,
        cohort: userData?.cohort || 'Simplon 2024',
        date_joined: userData?.date_joined || new Date().toISOString(),
        isAdmin: !!(userData?.is_staff || userData?.is_superuser),
        role: (userData?.is_staff || userData?.is_superuser) ? 'admin' : 'user',
        _source: userData ? 'django_api' : 'default'
      };
      
      console.log('✅ Utilisateur stocké:', userToStore);
      this.setCurrentUser(userToStore);
      
      return { success: true, user: userToStore };
      
    } catch (error) {
      console.log('❌ Erreur API, tentative de connexion simulée:', error.message);
      
      // Fallback: simulation
      return this.mockLogin(username, password);
    }
  },
  
  // ✅ FONCTIONS DE BASE
  setAccessToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  
  getAccessToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  
  setRefreshToken(token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  
  setCurrentUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Erreur getCurrentUser:', error);
      return null;
    }
  },
  
  isAuthenticated() {
    const token = this.getAccessToken();
    return !!(token && !this.isTokenExpired(token));
  },
  
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    console.log('🚪 Déconnexion effectuée');
    window.location.href = '/login';
  },
  
  // ✅ CONNEXION RAPIDE POUR TEST
  async quickLogin(username = 'admin', password = 'admin123') {
    console.log('🚀 Connexion rapide:', username);
    return this.login(username, password).catch(() => {
      return this.mockLogin(username, password);
    });
  },
  
  // ✅ MOCK LOGIN (fallback)
  mockLogin(username, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const testCredentials = {
          'admin': 'admin123',
          'simplon_2025001': 'simplon2024',
          'user123': 'password123'
        };
        
        if (!testCredentials[username] || testCredentials[username] !== password) {
          reject(new Error('Matricule ou mot de passe incorrect'));
          return;
        }
        
        const isAdmin = username === 'admin';
        const user = {
          id: 1,
          username: username,
          email: `${username}@simplon.com`,
          first_name: isAdmin ? 'Admin' : 'Utilisateur',
          last_name: isAdmin ? 'System' : 'Test',
          is_staff: isAdmin,
          is_superuser: isAdmin,
          is_active: true,
          cohort: 'Simplon 2024',
          date_joined: new Date().toISOString(),
          isAdmin: isAdmin,
          role: isAdmin ? 'admin' : 'user',
          _source: 'simulation'
        };
        
        this.setCurrentUser(user);
        this.setAccessToken('mock_token_' + Date.now());
        this.setRefreshToken('mock_refresh_' + Date.now());
        
        console.log('✅ Connexion simulée réussie');
        resolve({ success: true, user, isSimulation: true });
      }, 500);
    });
  },
  
  // ✅ VÉRIFIER LES PERMISSIONS (optionnel)
  hasPermission(requiredRole) {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // Logique simple de permission
    const userRole = user.role || 'user';
    const roleHierarchy = {
      'superadmin': 3,
      'admin': 2,
      'moderator': 1,
      'user': 0
    };
    
    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;
    
    return userLevel >= requiredLevel;
  },
  
  // ✅ DEBUG
  debug() {
    console.log('🔍 DEBUG Authentification:');
    console.log('- Token présent:', !!this.getAccessToken());
    console.log('- Refresh token présent:', !!this.getRefreshToken());
    console.log('- User présent:', !!this.getCurrentUser());
    console.log('- Token expiré:', this.getAccessToken() ? this.isTokenExpired(this.getAccessToken()) : 'N/A');
    console.log('- Authentifié:', this.isAuthenticated());
    console.log('- Est admin?:', this.isAdmin());
    console.log('- Current User:', this.getCurrentUser());
  },
  
  // ✅ NETTOYAGE (optionnel)
  cleanup() {
    // Nettoyer les anciennes clés si existent
    const oldKeys = ['token', 'refresh_token', 'user'];
    oldKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`🗑️ Ancienne clé supprimée: ${key}`);
      }
    });
  },
  
  // ✅ INITIALISATION (optionnel)
  init() {
    this.cleanup();
    console.log('🚀 AuthService initialisé');
  }
};

// Initialiser au chargement
authService.init();

export default authService;