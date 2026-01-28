


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



// // src/services/auth.js - VERSION SIMPLIFIÉE ET FONCTIONNELLE
// const authService = {
//   // ✅ STOCKAGE
//   setAccessToken(token) {
//     localStorage.setItem('access_token', token);
//   },
  
//   getAccessToken() {
//     return localStorage.getItem('access_token');
//   },
  
//   setCurrentUser(user) {
//     localStorage.setItem('simplon_user', JSON.stringify(user));
//   },
  
//   getCurrentUser() {
//     try {
//       const userStr = localStorage.getItem('simplon_user');
//       return userStr ? JSON.parse(userStr) : null;
//     } catch {
//       return null;
//     }
//   },
  
//   // ✅ VÉRIFICATIONS
//   isAuthenticated() {
//     return !!this.getAccessToken();
//   },
  
//   isAdmin() {
//     const user = this.getCurrentUser();
//     return user && (user.is_staff || user.is_superuser || user.role === 'admin');
//   },
  
//   // ✅ LOGIN SIMPLE (sans API compliquée)
//   async login(username, password) {
//     console.log('🔐 Tentative de connexion pour:', username);
    
//     // Simulation simple SI l'API ne fonctionne pas
//     if (username === 'admin' && password === 'admin123') {
//       const user = {
//         id: 1,
//         username: 'admin',
//         email: 'admin@simplon.com',
//         first_name: 'Admin',
//         last_name: 'System',
//         is_staff: true,
//         is_superuser: true,
//         is_active: true,
//         cohort: 'Simplon 2024',
//         date_joined: new Date().toISOString(),
//         isAdmin: true,
//         role: 'admin'
//       };
      
//       this.setCurrentUser(user);
//       this.setAccessToken('simplon_mock_token_' + Date.now());
      
//       console.log('✅ Connexion simulée réussie');
//       return {
//         success: true,
//         user: user
//       };
//     }
    
//     // Si ce n'est pas admin/admin123, essayer l'API réelle
//     try {
//       const response = await fetch('http://localhost:8000/api/token/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password })
//       });
      
//       if (!response.ok) {
//         throw new Error('Identifiants incorrects');
//       }
      
//       const data = await response.json();
      
//       // Stocker le token
//       if (data.access) {
//         this.setAccessToken(data.access);
//       }
      
//       // Récupérer l'utilisateur
//       let userData = null;
//       try {
//         const userResponse = await fetch('http://localhost:8000/api/users/me/', {
//           headers: { 'Authorization': `Bearer ${data.access}` }
//         });
        
//         if (userResponse.ok) {
//           userData = await userResponse.json();
//         }
//       } catch (userError) {
//         console.warn('⚠️ Impossible de récupérer le profil:', userError);
//       }
      
//       // Préparer l'utilisateur
//       const user = {
//         id: userData?.id || Date.now(),
//         username: userData?.username || username,
//         email: userData?.email || `${username}@simplon.com`,
//         first_name: userData?.first_name || 'Utilisateur',
//         last_name: userData?.last_name || username,
//         is_staff: userData?.is_staff || false,
//         is_superuser: userData?.is_superuser || false,
//         is_active: userData?.is_active !== undefined ? userData.is_active : true,
//         cohort: userData?.cohort || 'Simplon 2024',
//         date_joined: userData?.date_joined || new Date().toISOString(),
//         isAdmin: !!(userData?.is_staff || userData?.is_superuser),
//         role: (userData?.is_staff || userData?.is_superuser) ? 'admin' : 'user'
//       };
      
//       this.setCurrentUser(user);
//       console.log('✅ Connexion API réussie');
      
//       return {
//         success: true,
//         user: user,
//         token: data.access
//       };
      
//     } catch (error) {
//       console.error('❌ Erreur connexion:', error.message);
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   },
  
//   // ✅ LOGIN RAPIDE POUR TEST (sans quickLogin, juste login)
//   async quickLogin(username = 'admin', password = 'admin123') {
//     return this.login(username, password);
//   },
  
//   // ✅ LOGOUT
//   logout() {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('simplon_user');
//     console.log('🚪 Déconnexion effectuée');
//     window.location.href = '/login';
//   },
  
//   // ✅ DEBUG
//   debug() {
//     console.log('🔍 Auth Debug:');
//     console.log('- Token:', this.getAccessToken());
//     console.log('- User:', this.getCurrentUser());
//     console.log('- Authentifié:', this.isAuthenticated());
//     console.log('- Admin?:', this.isAdmin());
//   }
// };

// // ⚠️ EXPORT PAR DÉFAUT OBLIGATOIRE
// export default authService;


// // src/services/auth.js - VERSION DYNAMIQUE (RECOMMANDÉE)
// const API_URL = 'http://localhost:8000';

// const authService = {
//   // ==================== CONFIGURATION ====================
  
//   // URLs API
//   endpoints: {
//     token: `${API_URL}/api/token/`,
//     userMe: `${API_URL}/api/users/me/`,
//     userProfile: `${API_URL}/api/users/profile/`,
//     userProjects: `${API_URL}/api/users/projects/user/`,
//     allUsers: `${API_URL}/api/users/all/`
//   },
  
//   // ==================== STOCKAGE ====================
  
//   setAccessToken(token) {
//     localStorage.setItem('simplon_access_token', token);
//   },
  
//   getAccessToken() {
//     return localStorage.getItem('simplon_access_token');
//   },
  
//   setCurrentUser(user) {
//     localStorage.setItem('simplon_user', JSON.stringify(user));
//     if (user?.id) {
//       localStorage.setItem('user_id', user.id.toString());
//       localStorage.setItem('user_role', user.is_staff ? 'admin' : 'user');
//     }
//   },
  
//   getCurrentUser() {
//     try {
//       const userStr = localStorage.getItem('simplon_user');
//       return userStr ? JSON.parse(userStr) : null;
//     } catch {
//       return null;
//     }
//   },
  
//   getUserId() {
//     const user = this.getCurrentUser();
//     return user?.id || parseInt(localStorage.getItem('user_id')) || null;
//   },
  
//   // ==================== AUTHENTIFICATION DYNAMIQUE ====================
  
//   async login(username, password) {
//     console.log(`🔐 Connexion: ${username}`);
    
//     try {
//       // 1. ESSAYER L'API DJANGO RÉELLE
//       return await this._loginViaApi(username, password);
//     } catch (apiError) {
//       console.log(`❌ API échouée: ${apiError.message}`);
      
//       // 2. FALLBACK INTELLIGENT
//       try {
//         return await this._loginWithDynamicFallback(username, password);
//       } catch (fallbackError) {
//         console.error(`❌ Fallback échoué: ${fallbackError.message}`);
//         throw new Error('Échec de connexion');
//       }
//     }
//   },
  
//   // ==================== MÉTHODES PRIVÉES ====================
  
//   async _loginViaApi(username, password) {
//     console.log('🌐 Tentative connexion API Django...');
    
//     // 1. Obtenir token JWT
//     const tokenResponse = await fetch(this.endpoints.token, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ username, password })
//     });
    
//     if (!tokenResponse.ok) {
//       const error = await tokenResponse.json().catch(() => ({}));
//       throw new Error(error.detail || 'Identifiants incorrects');
//     }
    
//     const { access, refresh } = await tokenResponse.json();
    
//     // 2. Stocker tokens
//     this.setAccessToken(access);
//     if (refresh) {
//       localStorage.setItem('simplon_refresh_token', refresh);
//     }
    
//     // 3. Récupérer profil utilisateur
//     const user = await this._fetchUserProfile(access);
    
//     // 4. Stocker utilisateur
//     this.setCurrentUser(user);
    
//     console.log(`✅ Connexion API réussie: ${user.username} (ID: ${user.id})`);
    
//     return {
//       success: true,
//       user: user,
//       token: access
//     };
//   },
  
//   async _fetchUserProfile(token) {
//     try {
//       const response = await fetch(this.endpoints.userMe, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
      
//       if (response.ok) {
//         const userData = await response.json();
//         return this._formatUserData(userData);
//       }
//     } catch (error) {
//       console.warn('⚠️ Impossible de récupérer le profil complet');
//     }
    
//     // Fallback: créer un profil basique
//     return this._formatUserData({ username: 'utilisateur' });
//   },
  
//   _formatUserData(userData) {
//     return {
//       id: userData.id || Date.now(),
//       username: userData.username || 'utilisateur',
//       email: userData.email || `${userData.username || 'user'}@simplon.com`,
//       first_name: userData.first_name || 'Prénom',
//       last_name: userData.last_name || 'Nom',
//       is_staff: userData.is_staff || false,
//       is_superuser: userData.is_superuser || false,
//       is_active: userData.is_active !== undefined ? userData.is_active : true,
//       cohort: userData.cohort || 'Simplon 2024',
//       date_joined: userData.date_joined || new Date().toISOString(),
//       last_login: userData.last_login || new Date().toISOString(),
//       isAdmin: !!(userData.is_staff || userData.is_superuser),
//       role: (userData.is_staff || userData.is_superuser) ? 'admin' : 'user'
//     };
//   },
  
//   async _loginWithDynamicFallback(username, password) {
//     console.log('🔄 Mode fallback intelligent...');
    
//     // 1. Détecter le type d'utilisateur
//     const userType = this._detectUserType(username);
    
//     // 2. Vérifier les identifiants communs
//     if (!this._validateCommonCredentials(username, password)) {
//       throw new Error('Identifiants incorrects');
//     }
    
//     // 3. Chercher l'utilisateur dans la BD via API (si disponible)
//     try {
//       const userFromDb = await this._findUserInDatabase(username);
//       if (userFromDb) {
//         console.log(`✅ Utilisateur trouvé dans DB: ${userFromDb.username}`);
//         this.setCurrentUser(userFromDb);
//         return {
//           success: true,
//           user: userFromDb,
//           token: 'fallback_token_' + Date.now(),
//           message: 'Mode fallback (utilisateur DB)'
//         };
//       }
//     } catch (dbError) {
//       console.log('⚠️ Impossible d\'accéder à la DB:', dbError.message);
//     }
    
//     // 4. Créer un utilisateur dynamique
//     const dynamicUser = this._createDynamicUser(username, userType);
    
//     this.setCurrentUser(dynamicUser);
//     this.setAccessToken('dynamic_token_' + Date.now());
    
//     console.log(`✅ Utilisateur dynamique créé: ${dynamicUser.username} (ID: ${dynamicUser.id})`);
    
//     return {
//       success: true,
//       user: dynamicUser,
//       message: 'Mode simulation dynamique'
//     };
//   },
  
//   _detectUserType(username) {
//     // Détection intelligente basée sur le username
//     if (username === 'admin' || username.includes('administrateur')) {
//       return 'admin';
//     }
    
//     if (username.includes('simplon_')) {
//       return 'apprenant';
//     }
    
//     if (username.includes('mod') || username.includes('manager')) {
//       return 'moderateur';
//     }
    
//     return 'utilisateur';
//   },
  
//   _validateCommonCredentials(username, password) {
//     // Liste des identifiants communs acceptés en fallback
//     const commonCredentials = {
//       'admin': ['admin123', 'password', 'admin'],
//       'simplon_2025001': ['123', 'password', 'simplon'],
//       'simplon_2025002': ['123', 'password', 'simplon'],
//       'simplon_2025003': ['123', 'password', 'simplon'],
//       'alice': ['123', 'password', 'alice'],
//       'bob': ['123', 'password', 'bob'],
//       'charlie': ['123', 'password', 'charlie']
//     };
    
//     const validPasswords = commonCredentials[username] || ['123', 'password'];
//     return validPasswords.includes(password);
//   },
  
//   async _findUserInDatabase(username) {
//     try {
//       // Essayer de récupérer tous les utilisateurs via API
//       const response = await fetch(this.endpoints.allUsers, {
//         method: 'GET',
//         headers: { 'Accept': 'application/json' }
//       });
      
//       if (response.ok) {
//         const data = await response.json();
        
//         if (data.users && Array.isArray(data.users)) {
//           const foundUser = data.users.find(u => u.username === username);
//           if (foundUser) {
//             return this._formatUserData(foundUser);
//           }
//         }
//       }
//     } catch (error) {
//       // API non disponible, on continue
//     }
    
//     return null;
//   },
  
//   _createDynamicUser(username, userType) {
//     // Générer un ID basé sur le username (hash simple)
//     const userId = this._generateUserId(username);
    
//     const isAdmin = userType === 'admin';
    
//     return {
//       id: userId,
//       username: username,
//       email: `${username}@simplon.com`,
//       first_name: this._getFirstName(username),
//       last_name: this._getLastName(username),
//       is_staff: isAdmin,
//       is_superuser: isAdmin,
//       is_active: true,
//       cohort: 'Simplon 2024',
//       date_joined: new Date().toISOString(),
//       last_login: new Date().toISOString(),
//       isAdmin: isAdmin,
//       role: isAdmin ? 'admin' : 'user'
//     };
//   },
  
//   _generateUserId(username) {
//     // Générer un ID stable basé sur le username
//     let hash = 0;
//     for (let i = 0; i < username.length; i++) {
//       hash = ((hash << 5) - hash) + username.charCodeAt(i);
//       hash |= 0; // Convertir en entier 32-bit
//     }
//     return Math.abs(hash) % 1000 + 1; // ID entre 1 et 1000
//   },
  
//   _getFirstName(username) {
//     const nameMap = {
//       'admin': 'Admin',
//       'simplon_2025001': 'Alice',
//       'simplon_2025002': 'Thomas',
//       'simplon_2025003': 'Sophie',
//       'alice': 'Alice',
//       'bob': 'Bob',
//       'charlie': 'Charlie'
//     };
    
//     return nameMap[username] || 'Utilisateur';
//   },
  
//   _getLastName(username) {
//     const nameMap = {
//       'admin': 'System',
//       'simplon_2025001': 'Martin',
//       'simplon_2025002': 'Bernard',
//       'simplon_2025003': 'Dubois',
//       'alice': 'Dupont',
//       'bob': 'Martin',
//       'charlie': 'Bernard'
//     };
    
//     return nameMap[username] || 'Simpson';
//   },
  
//   // ==================== MÉTHODES PUBLIQUES ====================
  
//   isAuthenticated() {
//     return !!this.getAccessToken();
//   },
  
//   isAdmin() {
//     const user = this.getCurrentUser();
//     return user && (user.is_staff || user.is_superuser || user.role === 'admin');
//   },
  
//   async quickLogin(username = 'admin', password = 'admin123') {
//     return this.login(username, password);
//   },
  
//   logout() {
//     const keepKeys = ['dark_mode', 'language', 'theme'];
//     const allKeys = Object.keys(localStorage);
    
//     allKeys.forEach(key => {
//       if (!keepKeys.includes(key) && 
//           (key.includes('token') || key.includes('user') || key.includes('auth'))) {
//         localStorage.removeItem(key);
//       }
//     });
    
//     console.log('✅ Déconnexion complète');
//   },
  
//   // ==================== MÉTHODES AVANCÉES ====================
  
//   async refreshToken() {
//     const refreshToken = localStorage.getItem('simplon_refresh_token');
//     if (!refreshToken) return null;
    
//     try {
//       const response = await fetch(`${API_URL}/api/token/refresh/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ refresh: refreshToken })
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         this.setAccessToken(data.access);
//         return data.access;
//       }
//     } catch (error) {
//       console.error('❌ Erreur refresh token:', error);
//     }
    
//     return null;
//   },
  
//   async syncWithDatabase() {
//     try {
//       const token = this.getAccessToken();
//       const currentUser = this.getCurrentUser();
      
//       if (!token || !currentUser) return false;
      
//       // Récupérer les données fraîches depuis l'API
//       const response = await fetch(this.endpoints.userMe, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
      
//       if (response.ok) {
//         const freshData = await response.json();
//         const updatedUser = this._formatUserData(freshData);
//         this.setCurrentUser(updatedUser);
//         console.log('✅ Utilisateur synchronisé avec DB');
//         return true;
//       }
//     } catch (error) {
//       console.warn('⚠️ Synchronisation échouée:', error);
//     }
    
//     return false;
//   },
  
//   async discoverUsers() {
//     try {
//       const response = await fetch(this.endpoints.allUsers);
//       if (response.ok) {
//         const data = await response.json();
//         console.log(`🔍 ${data.users?.length || 0} utilisateur(s) découvert(s)`);
//         return data.users || [];
//       }
//     } catch (error) {
//       console.warn('⚠️ Impossible de découvrir les utilisateurs');
//     }
    
//     return [];
//   },
  
//   // ==================== DÉBOGAGE ====================
  
//   debug() {
//     console.log('=== DEBUG AUTH SERVICE ===');
//     console.log('API URL:', API_URL);
//     console.log('Token:', this.getAccessToken()?.substring(0, 20) + '...');
//     console.log('User:', this.getCurrentUser());
//     console.log('User ID:', this.getUserId());
//     console.log('Admin?:', this.isAdmin());
//     console.log('Authenticated?:', this.isAuthenticated());
    
//     // Lister tous les utilisateurs potentiels
//     console.log('=== UTILISATEURS POTENTIELS ===');
//     const potentialUsers = ['admin', 'simplon_2025001', 'simplon_2025002', 'simplon_2025003', 'alice', 'bob', 'charlie'];
//     potentialUsers.forEach(user => {
//       const id = this._generateUserId(user);
//       console.log(`  ${user}: ID=${id}, Type=${this._detectUserType(user)}`);
//     });
//   }
// };

// export default authService;


// src/services/auth.js - VERSION SIMPLIFIÉE POUR LE TEST
const API_URL = 'http://localhost:8000';

const authService = {
  endpoints: {
    login: `${API_URL}/api/users/auth/login/`,
    quickLogin: `${API_URL}/api/users/auth/quick-login/`,
    currentUser: `${API_URL}/api/users/auth/me/`,
  },
  
  async login(identifier, password) {
    console.log(`🔐 Tentative login: ${identifier}`);
    
    try {
      const response = await fetch(this.endpoints.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          identifier: identifier,
          password: password
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        this._storeAuthData(data.tokens.access, data.user);
        
        if (data.tokens.refresh) {
          localStorage.setItem('refresh_token', data.tokens.refresh);
        }
        
        console.log(`✅ Login réussi: ${data.user.username}`);
        return {
          success: true,
          user: data.user,
          access: data.tokens.access
        };
      } else {
        return {
          success: false,
          message: data.message || 'Échec de connexion'
        };
      }
      
    } catch (error) {
      console.error('❌ Erreur login:', error);
      return {
        success: false,
        message: 'Serveur indisponible'
      };
    }
  },
  
  async quickLogin(username) {
    console.log(`⚡ Login rapide: ${username}`);
    
    try {
      const response = await fetch(this.endpoints.quickLogin, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        this._storeAuthData(data.tokens.access, data.user);
        
        if (data.tokens.refresh) {
          localStorage.setItem('refresh_token', data.tokens.refresh);
        }
        
        console.log(`✅ Login rapide réussi: ${data.user.username}`);
        return {
          success: true,
          user: data.user,
          access: data.tokens.access
        };
      } else {
        return {
          success: false,
          message: data.message || 'Échec de connexion rapide'
        };
      }
      
    } catch (error) {
      console.error('❌ Erreur login rapide:', error);
      return {
        success: false,
        message: 'Serveur indisponible'
      };
    }
  },
  
  _storeAuthData(accessToken, userData) {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('user_id', userData.id);
    localStorage.setItem('user_role', userData.role);
    localStorage.setItem('last_login', new Date().toISOString());
    
    console.log('💾 Données stockées pour:', userData.username);
  },
  
  getAccessToken() {
    return localStorage.getItem('access_token');
  },
  
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('❌ Erreur parsing user:', error);
      return null;
    }
  },
  
  isAuthenticated() {
    const token = this.getAccessToken();
    if (!token) return false;
    
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      const expiry = payload.exp * 1000;
      return Date.now() < expiry;
    } catch {
      return !!token;
    }
  },
  
  isAdmin() {
    const user = this.getCurrentUser();
    return user && (user.is_staff || user.role === 'admin');
  },
  
  logout() {
    const keys = [
      'access_token', 'refresh_token', 'user',
      'user_id', 'user_role', 'last_login'
    ];
    
    keys.forEach(key => localStorage.removeItem(key));
    console.log('✅ Déconnexion effectuée');
  }
};

export default authService;