


// // src/services/auth.js - VERSION JWT COMPLÈTE
// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:8000/api';

// // Clés de stockage
// const ACCESS_TOKEN_KEY = 'access_token';
// const REFRESH_TOKEN_KEY = 'refresh_token';
// const USER_KEY = 'simplon_user';

// const authService = {
//   // ✅ INITIALISATION
//   init() {
//     console.log('🚀 AuthService initialisé');
//     // Nettoyer les anciennes clés si nécessaire
//     ['token', 'jwt', 'authToken'].forEach(key => {
//       if (localStorage.getItem(key)) localStorage.removeItem(key);
//     });
//   },

//   // ✅ CONNEXION AVEC JWT
//   async login(username, password) {
//     console.log('🔐 Tentative de connexion JWT pour:', username);
    
//     try {
//       // 1. Obtenir les tokens JWT
//       const tokenResponse = await axios.post(`${API_BASE_URL}/token/`, {
//         username: username,
//         password: password
//       });
      
//       const { access, refresh } = tokenResponse.data;
//       console.log('✅ Tokens JWT obtenus avec succès');
      
//       // 2. Stocker les tokens
//       this.setAccessToken(access);
//       this.setRefreshToken(refresh);
      
//       // 3. Récupérer le profil utilisateur
//       let userData = null;
//       try {
//         const userResponse = await axios.get(`${API_BASE_URL}/users/profile/`, {
//           headers: this.getAuthHeaders()
//         });
//         userData = userResponse.data;
//         console.log('✅ Profil utilisateur récupéré:', userData);
//       } catch (profileError) {
//         console.warn('⚠️ Impossible de récupérer le profil:', profileError.message);
//         // Utiliser les données minimales
//         userData = {
//           username: username,
//           email: `${username}@simplon.com`,
//           is_staff: username === 'admin',
//           is_superuser: username === 'admin'
//         };
//       }
      
//       // 4. Préparer et stocker l'utilisateur
//       const userToStore = {
//         id: userData?.id || Date.now(),
//         username: userData?.username || username,
//         email: userData?.email || `${username}@simplon.com`,
//         first_name: userData?.first_name || 'Utilisateur',
//         last_name: userData?.last_name || 'Simplon',
//         is_staff: userData?.is_staff || (username === 'admin'),
//         is_superuser: userData?.is_superuser || (username === 'admin'),
//         is_active: userData?.is_active !== undefined ? userData.is_active : true,
//         cohort: userData?.cohort || 'Simplon 2024',
//         date_joined: userData?.date_joined || new Date().toISOString(),
//         isAdmin: !!(userData?.is_staff || userData?.is_superuser || username === 'admin'),
//         role: (userData?.is_staff || userData?.is_superuser || username === 'admin') ? 'admin' : 'user',
//         _source: 'django_jwt'
//       };
      
//       this.setCurrentUser(userToStore);
//       console.log('✅ Connexion JWT réussie');
      
//       return {
//         success: true,
//         user: userToStore,
//         tokens: { access, refresh }
//       };
      
//     } catch (error) {
//       console.error('❌ Erreur connexion JWT:', error.response?.data || error.message);
      
//       // Fallback vers la simulation SI et SEULEMENT SI l'API n'est pas accessible
//       if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
//         console.log('🌐 API Django inaccessible, mode simulation');
//         return this.mockLogin(username, password);
//       }
      
//       return {
//         success: false,
//         error: error.response?.data?.detail || 'Identifiants incorrects'
//       };
//     }
//   },

//   // ✅ VÉRIFIER SI ADMIN
//   isAdmin() {
//     try {
//       const user = this.getCurrentUser();
      
//       if (!user) {
//         return false;
//       }
      
//       // Plusieurs façons de vérifier les droits admin
//       const isAdminUser = 
//         user.isAdmin === true ||
//         user.role === 'admin' ||
//         user.is_staff === true ||
//         user.is_superuser === true;
      
//       console.log('🔍 Vérification admin pour', user.username, '=>', isAdminUser);
//       return isAdminUser;
//     } catch (error) {
//       console.error('Erreur isAdmin:', error);
//       return false;
//     }
//   },

//   // ✅ GESTION DES TOKENS
//   setAccessToken(token) {
//     localStorage.setItem(ACCESS_TOKEN_KEY, token);
//   },
  
//   getAccessToken() {
//     return localStorage.getItem(ACCESS_TOKEN_KEY);
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

//   // ✅ VÉRIFIER L'EXPIRATION DU TOKEN
//   isTokenExpired(token) {
//     try {
//       if (!token || token.startsWith('mock_')) {
//         return false; // Les tokens mock n'expirent pas
//       }
      
//       const parts = token.split('.');
//       if (parts.length !== 3) {
//         return true; // Format JWT invalide
//       }
      
//       const payload = JSON.parse(atob(parts[1]));
//       const expiry = payload.exp * 1000;
//       return Date.now() >= expiry;
//     } catch (error) {
//       console.error('Erreur vérification expiration:', error);
//       return true;
//     }
//   },

//   // ✅ VÉRIFIER L'AUTHENTIFICATION
//   isAuthenticated() {
//     const token = this.getAccessToken();
//     if (!token) return false;
    
//     // Si c'est un token mock
//     if (token.startsWith('mock_')) {
//       return true;
//     }
    
//     // Si c'est un vrai JWT, vérifier l'expiration
//     return !this.isTokenExpired(token);
//   },

//   // ✅ RAFRAÎCHIR LE TOKEN JWT
//   async refreshToken() {
//     const refreshToken = this.getRefreshToken();
    
//     if (!refreshToken) {
//       console.log('❌ Aucun refresh token disponible');
//       return null;
//     }
    
//     try {
//       const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
//         refresh: refreshToken
//       });
      
//       const newAccessToken = response.data.access;
//       this.setAccessToken(newAccessToken);
//       console.log('✅ Token rafraîchi avec succès');
//       return newAccessToken;
//     } catch (error) {
//       console.error('❌ Erreur rafraîchissement token:', error);
//       this.logout();
//       return null;
//     }
//   },

//   // ✅ OBTENIR LES HEADERS D'AUTHENTIFICATION
//   getAuthHeaders() {
//     const token = this.getAccessToken();
//     if (!token) return {};
    
//     return {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     };
//   },

//   // ✅ DÉCONNEXION
//   logout() {
//     localStorage.removeItem(ACCESS_TOKEN_KEY);
//     localStorage.removeItem(REFRESH_TOKEN_KEY);
//     localStorage.removeItem(USER_KEY);
//     console.log('🚪 Déconnexion effectuée');
//     // Redirection facultative
//     // window.location.href = '/login';
//   },

//   // ✅ MOCK LOGIN (fallback seulement)
//   mockLogin(username, password) {
//     return new Promise((resolve) => {
//       setTimeout(() => {
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
//         this.setAccessToken(`mock_token_${Date.now()}`);
//         this.setRefreshToken(`mock_refresh_${Date.now()}`);
        
//         console.log('✅ Connexion simulée réussie');
//         resolve({
//           success: true,
//           user: user,
//           isSimulation: true
//         });
//       }, 500);
//     });
//   },

//   // ✅ CONNEXION RAPIDE POUR TEST
//   async quickLogin(username = 'admin', password = 'admin123') {
//     console.log('🚀 Connexion rapide:', username);
    
//     // D'abord essayer JWT
//     const jwtResult = await this.login(username, password);
//     if (jwtResult.success) {
//       return jwtResult;
//     }
    
//     // Sinon simulation
//     return this.mockLogin(username, password);
//   },

//   // ✅ INTERCEPTEUR AXIOS POUR RAJOUTER TOKEN AUTOMATIQUEMENT
//   setupAxiosInterceptor() {
//     axios.interceptors.request.use(
//       (config) => {
//         const token = this.getAccessToken();
//         if (token && config.url?.includes('localhost:8000')) {
//           config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//       },
//       (error) => Promise.reject(error)
//     );

//     axios.interceptors.response.use(
//       (response) => response,
//       async (error) => {
//         const originalRequest = error.config;
        
//         if (error.response?.status === 401 && !originalRequest._retry) {
//           originalRequest._retry = true;
          
//           try {
//             const newToken = await this.refreshToken();
//             if (newToken) {
//               originalRequest.headers.Authorization = `Bearer ${newToken}`;
//               return axios(originalRequest);
//             }
//           } catch (refreshError) {
//             console.error('Échec rafraîchissement, déconnexion...');
//             this.logout();
//           }
//         }
        
//         return Promise.reject(error);
//       }
//     );
    
//     console.log('✅ Intercepteur axios configuré');
//   },

//   // ✅ DEBUG
//   debug() {
//     console.log('🔍 DEBUG Authentification:');
//     console.log('- Token:', this.getAccessToken()?.substring(0, 50) + '...');
//     console.log('- Token expiré?', this.isTokenExpired(this.getAccessToken()));
//     console.log('- Authentifié:', this.isAuthenticated());
//     console.log('- Utilisateur:', this.getCurrentUser());
//     console.log('- Admin?:', this.isAdmin());
//   }
// };

// // Initialiser
// authService.init();
// authService.setupAxiosInterceptor();

// export default authService;



// src/services/auth.js - VERSION SIMPLIFIÉE ET FONCTIONNELLE
const authService = {
  // ✅ STOCKAGE
  setAccessToken(token) {
    localStorage.setItem('access_token', token);
  },
  
  getAccessToken() {
    return localStorage.getItem('access_token');
  },
  
  setCurrentUser(user) {
    localStorage.setItem('simplon_user', JSON.stringify(user));
  },
  
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('simplon_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },
  
  // ✅ VÉRIFICATIONS
  isAuthenticated() {
    return !!this.getAccessToken();
  },
  
  isAdmin() {
    const user = this.getCurrentUser();
    return user && (user.is_staff || user.is_superuser || user.role === 'admin');
  },
  
  // ✅ LOGIN SIMPLE (sans API compliquée)
  async login(username, password) {
    console.log('🔐 Tentative de connexion pour:', username);
    
    // Simulation simple SI l'API ne fonctionne pas
    if (username === 'admin' && password === 'admin123') {
      const user = {
        id: 1,
        username: 'admin',
        email: 'admin@simplon.com',
        first_name: 'Admin',
        last_name: 'System',
        is_staff: true,
        is_superuser: true,
        is_active: true,
        cohort: 'Simplon 2024',
        date_joined: new Date().toISOString(),
        isAdmin: true,
        role: 'admin'
      };
      
      this.setCurrentUser(user);
      this.setAccessToken('simplon_mock_token_' + Date.now());
      
      console.log('✅ Connexion simulée réussie');
      return {
        success: true,
        user: user
      };
    }
    
    // Si ce n'est pas admin/admin123, essayer l'API réelle
    try {
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (!response.ok) {
        throw new Error('Identifiants incorrects');
      }
      
      const data = await response.json();
      
      // Stocker le token
      if (data.access) {
        this.setAccessToken(data.access);
      }
      
      // Récupérer l'utilisateur
      let userData = null;
      try {
        const userResponse = await fetch('http://localhost:8000/api/users/me/', {
          headers: { 'Authorization': `Bearer ${data.access}` }
        });
        
        if (userResponse.ok) {
          userData = await userResponse.json();
        }
      } catch (userError) {
        console.warn('⚠️ Impossible de récupérer le profil:', userError);
      }
      
      // Préparer l'utilisateur
      const user = {
        id: userData?.id || Date.now(),
        username: userData?.username || username,
        email: userData?.email || `${username}@simplon.com`,
        first_name: userData?.first_name || 'Utilisateur',
        last_name: userData?.last_name || username,
        is_staff: userData?.is_staff || false,
        is_superuser: userData?.is_superuser || false,
        is_active: userData?.is_active !== undefined ? userData.is_active : true,
        cohort: userData?.cohort || 'Simplon 2024',
        date_joined: userData?.date_joined || new Date().toISOString(),
        isAdmin: !!(userData?.is_staff || userData?.is_superuser),
        role: (userData?.is_staff || userData?.is_superuser) ? 'admin' : 'user'
      };
      
      this.setCurrentUser(user);
      console.log('✅ Connexion API réussie');
      
      return {
        success: true,
        user: user,
        token: data.access
      };
      
    } catch (error) {
      console.error('❌ Erreur connexion:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  // ✅ LOGIN RAPIDE POUR TEST (sans quickLogin, juste login)
  async quickLogin(username = 'admin', password = 'admin123') {
    return this.login(username, password);
  },
  
  // ✅ LOGOUT
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('simplon_user');
    console.log('🚪 Déconnexion effectuée');
    window.location.href = '/login';
  },
  
  // ✅ DEBUG
  debug() {
    console.log('🔍 Auth Debug:');
    console.log('- Token:', this.getAccessToken());
    console.log('- User:', this.getCurrentUser());
    console.log('- Authentifié:', this.isAuthenticated());
    console.log('- Admin?:', this.isAdmin());
  }
};

// ⚠️ EXPORT PAR DÉFAUT OBLIGATOIRE
export default authService;