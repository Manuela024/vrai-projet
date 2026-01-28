


// // src/services/api.js - VERSION AVEC REFRESH AUTOMATIQUE
// import axios from 'axios';

// // Création de l'instance axios
// const api = axios.create({
//   baseURL: 'http://localhost:8000/api/',
//   timeout: 15000,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   }
// });

// // 🔄 Variables pour gérer le rafraîchissement
// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach(prom => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// // 🔄 INTERCEPTEUR REQUEST - Ajoute le token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('access_token');
    
//     // Debug
//     console.log('📡 API Request:', {
//       url: config.url,
//       method: config.method,
//       hasToken: !!token,
//     });
    
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
    
//     return config;
//   },
//   (error) => {
//     console.error('❌ Erreur requête:', error);
//     return Promise.reject(error);
//   }
// );

// // 🔄 INTERCEPTEUR RESPONSE - Gère les 401 automatiquement
// api.interceptors.response.use(
//   (response) => {
//     // Debug des réponses réussies
//     if (response.config.url.includes('projects') || response.config.url.includes('users')) {
//       console.log('✅ API Success:', {
//         url: response.config.url,
//         status: response.status,
//         count: response.data?.length || response.data?.count || 'N/A',
//       });
//     }
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
    
//     // Debug de l'erreur
//     console.error('❌ API Error:', {
//       url: originalRequest?.url,
//       status: error.response?.status,
//       message: error.message,
//     });
    
//     // ✅ IMPORTANT : Si erreur 401 (token expiré) et pas déjà en train de rafraîchir
//     if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      
//       // Si on est déjà en train de rafraîchir, mettre en file d'attente
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         }).then(token => {
//           originalRequest.headers.Authorization = `Bearer ${token}`;
//           return api(originalRequest);
//         }).catch(err => {
//           return Promise.reject(err);
//         });
//       }
      
//       originalRequest._retry = true;
//       isRefreshing = true;
      
//       try {
//         console.log('🔄 Tentative de rafraîchissement automatique du token...');
        
//         // Rafraîchir le token
//         const refreshToken = localStorage.getItem('refresh_token');
//         if (!refreshToken) {
//           throw new Error('No refresh token');
//         }
        
//         // IMPORTANT: Utiliser axios sans intercepteur pour éviter les boucles
//         const response = await axios.post('http://localhost:8000/api/token/refresh/', {
//           refresh: refreshToken
//         });
        
//         const newAccessToken = response.data.access;
        
//         // Sauvegarder le nouveau token
//         localStorage.setItem('access_token', newAccessToken);
        
//         // Mettre à jour l'header par défaut
//         api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
//         console.log('✅ Token rafraîchi automatiquement!');
        
//         // Traiter la file d'attente
//         processQueue(null, newAccessToken);
        
//         // Réessayer la requête originale
//         return api(originalRequest);
        
//       } catch (refreshError) {
//         console.error('❌ Échec du rafraîchissement:', refreshError.message);
        
//         // Si le refresh échoue, déconnecter
//         processQueue(refreshError, null);
        
//         // Nettoyer les tokens
//         localStorage.removeItem('access_token');
//         localStorage.removeItem('refresh_token');
//         localStorage.removeItem('user');
        
//         // Rediriger vers la page de login si on est pas dessus
//         if (!window.location.pathname.includes('/login')) {
//           setTimeout(() => {
//             window.location.href = '/login';
//           }, 1000);
//         }
        
//         return Promise.reject(refreshError);
        
//       } finally {
//         isRefreshing = false;
//       }
//     }
    
//     // Gestion des autres erreurs
//     if (error.response) {
//       switch (error.response.status) {
//         case 403:
//           console.log('🚫 403 Forbidden - Permission refusée');
//           break;
//         case 404:
//           console.log('🔍 404 Not Found - Endpoint inexistant:', originalRequest?.url);
//           break;
//         case 500:
//           console.log('💥 500 Server Error - Problème Django');
//           break;
//       }
//     } else if (error.request) {
//       console.error('🌐 Serveur injoignable - Django est-il démarré?');
//     }
    
//     return Promise.reject(error);
//   }
// );

// // 🔧 FONCTIONS UTILITAIRES
// export const apiUtils = {
//   // Initialiser l'API avec un token existant
//   initialize() {
//     const token = localStorage.getItem('access_token');
//     if (token) {
//       api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       console.log('🔧 API initialisée avec token existant');
//     }
//   },
  
//   // Vérifier l'état du token
//   checkTokenStatus() {
//     const token = localStorage.getItem('access_token');
//     if (!token) {
//       return { hasToken: false, message: 'Aucun token trouvé' };
//     }
    
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       const expiry = new Date(payload.exp * 1000);
//       const now = new Date();
//       const isValid = expiry > now;
//       const minutesLeft = (expiry - now) / 1000 / 60;
      
//       return {
//         hasToken: true,
//         isValid,
//         username: payload.username,
//         userId: payload.user_id,
//         expires: expiry.toLocaleTimeString(),
//         minutesLeft: Math.round(minutesLeft)
//       };
//     } catch (e) {
//       return { hasToken: false, message: 'Token invalide' };
//     }
//   },
  
//   // Rafraîchir manuellement le token
//   async refreshToken() {
//     const refreshToken = localStorage.getItem('refresh_token');
//     if (!refreshToken) {
//       throw new Error('No refresh token');
//     }
    
//     try {
//       const response = await axios.post('http://localhost:8000/api/token/refresh/', {
//         refresh: refreshToken
//       });
      
//       const newAccessToken = response.data.access;
//       localStorage.setItem('access_token', newAccessToken);
//       api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      
//       console.log('✅ Token rafraîchi manuellement');
//       return newAccessToken;
//     } catch (error) {
//       console.error('❌ Échec du rafraîchissement manuel');
//       throw error;
//     }
//   }
// };

// // Initialiser automatiquement
// apiUtils.initialize();

// export default api;



// // src/services/api.js - VERSION CORRIGÉE
// import axios from 'axios';

// // Clés de stockage (DOIVENT MATCHER AVEC auth.js)
// const TOKEN_KEY = 'simplon_access_token';
// const REFRESH_TOKEN_KEY = 'simplon_refresh_token';

// // Création de l'instance axios
// const api = axios.create({
//   baseURL: 'http://localhost:8000/api/',
//   timeout: 15000,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   }
// });

// // 🔄 Variables pour gérer le rafraîchissement
// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach(prom => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// // 🔄 INTERCEPTEUR REQUEST - Ajoute le token
// api.interceptors.request.use(
//   (config) => {
//     // UTILISER LA MÊME CLÉ QUE auth.js
//     const token = localStorage.getItem(TOKEN_KEY) || localStorage.getItem('access_token');
    
//     // Debug
//     console.log('📡 API Request:', {
//       url: config.url,
//       method: config.method,
//       hasToken: !!token,
//       tokenKey: TOKEN_KEY,
//     });
    
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     } else {
//       console.warn('⚠️ Aucun token trouvé pour la requête');
//     }
    
//     // Pour FormData, laisser le navigateur gérer Content-Type
//     if (config.data instanceof FormData) {
//       delete config.headers['Content-Type'];
//     }
    
//     return config;
//   },
//   (error) => {
//     console.error('❌ Erreur requête:', error);
//     return Promise.reject(error);
//   }
// );

// // 🔄 INTERCEPTEUR RESPONSE - Gère les 401 automatiquement
// api.interceptors.response.use(
//   (response) => {
//     // Debug des réponses réussies
//     if (response.config.url.includes('projects') || response.config.url.includes('users')) {
//       console.log('✅ API Success:', {
//         url: response.config.url,
//         status: response.status,
//         count: response.data?.length || response.data?.count || 'N/A',
//       });
//     }
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
    
//     // Debug de l'erreur
//     console.error('❌ API Error:', {
//       url: originalRequest?.url,
//       status: error.response?.status,
//       message: error.message,
//       data: error.response?.data,
//     });
    
//     // ✅ IMPORTANT : Si erreur 401 (token expiré) et pas déjà en train de rafraîchir
//     if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      
//       // Si on est déjà en train de rafraîchir, mettre en file d'attente
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         }).then(token => {
//           originalRequest.headers.Authorization = `Bearer ${token}`;
//           return api(originalRequest);
//         }).catch(err => {
//           return Promise.reject(err);
//         });
//       }
      
//       originalRequest._retry = true;
//       isRefreshing = true;
      
//       try {
//         console.log('🔄 Tentative de rafraîchissement automatique du token...');
        
//         // UTILISER LA MÊME CLÉ QUE auth.js
//         const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) || localStorage.getItem('refresh_token');
//         if (!refreshToken) {
//           throw new Error('No refresh token found in localStorage');
//         }
        
//         console.log('🔑 Refresh token trouvé, tentative de rafraîchissement...');
        
//         // IMPORTANT: Utiliser axios sans intercepteur pour éviter les boucles
//         const response = await axios.post('http://localhost:8000/api/token/refresh/', {
//           refresh: refreshToken
//         }, {
//           headers: {
//             'Content-Type': 'application/json',
//           }
//         });
        
//         const newAccessToken = response.data.access;
        
//         // Sauvegarder le nouveau token AVEC LA BONNE CLÉ
//         localStorage.setItem(TOKEN_KEY, newAccessToken);
        
//         // Mettre à jour l'header par défaut
//         api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
//         console.log('✅ Token rafraîchi automatiquement!');
        
//         // Traiter la file d'attente
//         processQueue(null, newAccessToken);
        
//         // Réessayer la requête originale
//         return api(originalRequest);
        
//       } catch (refreshError) {
//         console.error('❌ Échec du rafraîchissement:', refreshError.message);
        
//         // Si le refresh échoue, déconnecter
//         processQueue(refreshError, null);
        
//         // Nettoyer les tokens AVEC LES BONNES CLÉS
//         localStorage.removeItem(TOKEN_KEY);
//         localStorage.removeItem(REFRESH_TOKEN_KEY);
//         localStorage.removeItem('simplon_user');
//         localStorage.removeItem('user');
        
//         // Rediriger vers la page de login si on est pas dessus
//         if (!window.location.pathname.includes('/login')) {
//           setTimeout(() => {
//             window.location.href = '/login';
//           }, 1000);
//         }
        
//         return Promise.reject(refreshError);
        
//       } finally {
//         isRefreshing = false;
//       }
//     }
    
//     // Gestion des autres erreurs
//     if (error.response) {
//       switch (error.response.status) {
//         case 403:
//           console.log('🚫 403 Forbidden - Permission refusée');
//           break;
//         case 404:
//           console.log('🔍 404 Not Found - Endpoint inexistant:', originalRequest?.url);
//           break;
//         case 500:
//           console.log('💥 500 Server Error - Problème Django');
//           break;
//       }
//     } else if (error.request) {
//       console.error('🌐 Serveur injoignable - Django est-il démarré?');
//     }
    
//     return Promise.reject(error);
//   }
// );

// // 🔧 FONCTIONS UTILITAIRES
// export const apiUtils = {
//   // Initialiser l'API avec un token existant
//   initialize() {
//     const token = localStorage.getItem(TOKEN_KEY);
//     if (token) {
//       api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       console.log('🔧 API initialisée avec token existant');
//     } else {
//       console.log('🔧 API initialisée sans token');
//     }
//   },
  
//   // Vérifier l'état du token
//   checkTokenStatus() {
//     const token = localStorage.getItem(TOKEN_KEY);
//     if (!token) {
//       return { hasToken: false, message: 'Aucun token trouvé' };
//     }
    
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       const expiry = new Date(payload.exp * 1000);
//       const now = new Date();
//       const isValid = expiry > now;
//       const minutesLeft = (expiry - now) / 1000 / 60;
      
//       return {
//         hasToken: true,
//         isValid,
//         username: payload.username,
//         userId: payload.user_id,
//         expires: expiry.toLocaleTimeString(),
//         minutesLeft: Math.round(minutesLeft)
//       };
//     } catch (e) {
//       return { hasToken: false, message: 'Token invalide' };
//     }
//   },
  
//   // Rafraîchir manuellement le token
//   async refreshToken() {
//     const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
//     if (!refreshToken) {
//       throw new Error('No refresh token');
//     }
    
//     try {
//       const response = await axios.post('http://localhost:8000/api/token/refresh/', {
//         refresh: refreshToken
//       });
      
//       const newAccessToken = response.data.access;
//       localStorage.setItem(TOKEN_KEY, newAccessToken);
//       api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      
//       console.log('✅ Token rafraîchi manuellement');
//       return newAccessToken;
//     } catch (error) {
//       console.error('❌ Échec du rafraîchissement manuel');
//       throw error;
//     }
//   },
  
//   // Nettoyer les anciennes clés
//   cleanupOldKeys() {
//     const oldKeys = ['access_token', 'refresh_token', 'token'];
//     oldKeys.forEach(key => {
//       if (localStorage.getItem(key)) {
//         console.log(`🗑️ Suppression ancienne clé: ${key}`);
//         localStorage.removeItem(key);
//       }
//     });
//   }
// };

// // Initialiser automatiquement
// apiUtils.initialize();
// apiUtils.cleanupOldKeys();

// export default api;


// // src/services/api.js - CORRECTION POUR VOTRE BACKEND
// import axios from 'axios';

// // Configuration basée sur votre backend
// const API_BASE_URL = 'http://localhost:8000';
// const DEBUG = true; // Activez le debug pour voir ce qui se passe

// console.log(`🔧 API initialisée avec URL: ${API_BASE_URL}`);

// // Instance axios principale
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   }
// });

// // Fonction pour obtenir le token
// const getToken = () => {
//   const token = localStorage.getItem('access_token') || 
//                 localStorage.getItem('simplon_access_token');
  
//   if (token && token !== 'undefined' && !token.startsWith('mock_token_')) {
//     return token;
//   }
  
//   return null;
// };

// // Intercepteur request
// api.interceptors.request.use(
//   (config) => {
//     const token = getToken();
    
//     if (DEBUG) {
//       console.log('📡 API Request:', {
//         url: config.url,
//         method: config.method,
//         hasToken: !!token
//       });
//     }
    
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
    
//     return config;
//   },
//   (error) => {
//     console.error('❌ Request Error:', error);
//     return Promise.reject(error);
//   }
// );

// // Intercepteur response
// api.interceptors.response.use(
//   (response) => {
//     if (DEBUG && response.config.url.includes('projects') || response.config.url.includes('users')) {
//       console.log('✅ API Success:', {
//         url: response.config.url,
//         status: response.status,
//         data: response.data
//       });
//     }
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
    
//     console.error('❌ API Error:', {
//       url: originalRequest?.url,
//       status: error.response?.status,
//       message: error.message,
//       data: error.response?.data
//     });
    
//     return Promise.reject(error);
//   }
// );

// // Fonctions API spécifiques pour votre backend
// export const apiService = {
//   // Vérifier la santé du backend
//   async checkHealth() {
//     try {
//       const response = await api.get('/api/projects/');
//       return {
//         status: 'online',
//         data: response.data,
//         message: 'Backend Django disponible'
//       };
//     } catch (error) {
//       return {
//         status: 'offline',
//         error: error.message,
//         message: 'Backend non disponible'
//       };
//     }
//   },
  
//   // Récupérer les projets
//   async getProjects() {
//     try {
//       // Votre endpoint est /api/projects/ mais il semble être un endpoint de status
//       // Essayons /api/projects/projects/ comme indiqué dans la réponse
//       const response = await api.get('/api/projects/projects/');
//       return response.data;
//     } catch (error) {
//       console.log('Essai endpoint alternatif...');
//       try {
//         const response = await api.get('/api/projects/');
//         return response.data;
//       } catch (secondError) {
//         throw secondError;
//       }
//     }
//   },
  
//   // Récupérer les utilisateurs
//   async getUsers() {
//     try {
//       const response = await api.get('/api/users/');
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },
  
//   // Login
//   async login(credentials) {
//     try {
//       const response = await api.post('/api/token/', credentials);
      
//       if (response.data.access) {
//         // Sauvegarder les tokens
//         localStorage.setItem('access_token', response.data.access);
//         if (response.data.refresh) {
//           localStorage.setItem('refresh_token', response.data.refresh);
//         }
        
//         // Mettre à jour l'header
//         api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
//       }
      
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },
  
//   // Rafraîchir le token
//   async refreshToken() {
//     const refreshToken = localStorage.getItem('refresh_token');
//     if (!refreshToken) {
//       throw new Error('No refresh token');
//     }
    
//     try {
//       const response = await api.post('/api/token/refresh/', {
//         refresh: refreshToken
//       });
      
//       const newAccessToken = response.data.access;
//       localStorage.setItem('access_token', newAccessToken);
//       api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
      
//       return newAccessToken;
//     } catch (error) {
//       // Nettoyer les tokens en cas d'erreur
//       localStorage.removeItem('access_token');
//       localStorage.removeItem('refresh_token');
//       delete api.defaults.headers.common['Authorization'];
//       throw error;
//     }
//   },
  
//   // Logout
//   logout() {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('refresh_token');
//     localStorage.removeItem('user');
//     delete api.defaults.headers.common['Authorization'];
//   },
  
//   // Vérifier le token
//   checkToken() {
//     const token = getToken();
//     if (!token) {
//       return { valid: false, message: 'No token' };
//     }
    
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       const expiry = new Date(payload.exp * 1000);
//       const isValid = expiry > new Date();
      
//       return {
//         valid: isValid,
//         username: payload.username,
//         userId: payload.user_id,
//         expires: expiry,
//         minutesLeft: Math.round((expiry - new Date()) / 1000 / 60)
//       };
//     } catch (error) {
//       return { valid: false, message: 'Invalid token' };
//     }
//   }
// };

// // Initialiser avec le token existant
// const initToken = getToken();
// if (initToken) {
//   api.defaults.headers.common['Authorization'] = `Bearer ${initToken}`;
//   console.log('🔑 Token chargé depuis localStorage');
// }

// export default api;


// // src/services/api.js - VERSION FINALE
// import axios from 'axios';

// // Configuration Django
// const API_BASE_URL = 'http://localhost:8000';
// const DEBUG = true;

// console.log(`🔧 API Django connectée: ${API_BASE_URL}`);

// // Instance axios simple pour Django
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   }
// });

// // Fonction pour tester directement l'API
// export const testDjangoApi = async () => {
//   console.log('🧪 Test direct API Django...');
  
//   try {
//     // Test 1: Endpoint des projets
//     const projectsResponse = await fetch('http://localhost:8000/api/projects/projects/');
//     const projectsData = await projectsResponse.json();
    
//     // Test 2: Endpoint utilisateurs
//     const usersResponse = await fetch('http://localhost:8000/api/users/');
//     const usersData = await usersResponse.json();
    
//     console.log('✅ Test API Django réussi:');
//     console.log(`   - Projets: ${projectsData.count || projectsData.projects?.length || 0}`);
//     console.log(`   - Utilisateurs: ${usersData.users?.length || usersData.length || 0}`);
//     console.log('   - Premier projet:', projectsData.projects?.[0]?.title);
    
//     return {
//       success: true,
//       projects: projectsData,
//       users: usersData
//     };
//   } catch (error) {
//     console.error('❌ Test API Django échoué:', error);
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// };

// // Vérifier la santé de l'API
// export const checkApiHealth = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/api/projects/projects/`, {
//       timeout: 5000
//     });
    
//     return {
//       status: 'online',
//       data: response.data,
//       message: 'Django API disponible',
//       projectsCount: response.data.count || response.data.projects?.length || 0,
//       timestamp: response.data.timestamp || new Date().toISOString()
//     };
//   } catch (error) {
//     return {
//       status: 'offline',
//       error: error.message,
//       message: 'Impossible de se connecter à Django',
//       suggestion: 'Vérifiez que le serveur Django est démarré (python manage.py runserver)'
//     };
//   }
// };

// // Récupérer les projets
// export const getProjects = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/api/projects/projects/`, {
//       timeout: 8000
//     });
    
//     // Votre format: {status: "success", count: 10, projects: [...]}
//     if (response.data.status === 'success' && response.data.projects) {
//       console.log(`✅ ${response.data.count} projets récupérés depuis Django`);
//       return response.data.projects;
//     }
    
//     // Fallback
//     if (Array.isArray(response.data)) {
//       return response.data;
//     }
    
//     console.warn('⚠️ Format inattendu, tentative d\'extraction...');
//     return [];
    
//   } catch (error) {
//     console.error('❌ Erreur récupération projets:', error.message);
    
//     // Fallback de développement
//     if (DEBUG) {
//       console.log('🔧 Mode développement: données factices');
//       return Array.from({ length: 10 }, (_, i) => ({
//         id: i + 1,
//         title: `Projet ${i + 1}`,
//         description: `Description du projet ${i + 1}`,
//         technologies: ['React', 'Django', 'PostgreSQL'][i % 3],
//         status: ['approved', 'pending', 'draft'][i % 3],
//         author_name: `Utilisateur ${i + 1}`,
//         views: Math.floor(Math.random() * 100),
//         likes: Math.floor(Math.random() * 50),
//         created_at: new Date(Date.now() - i * 86400000).toISOString()
//       }));
//     }
    
//     throw error;
//   }
// };

// // Récupérer les utilisateurs
// export const getUsers = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/api/users/`, {
//       timeout: 8000
//     });
    
//     console.log('👤 Réponse API Users:', response.data);
    
//     // Essayer différents formats
//     if (response.data.users && Array.isArray(response.data.users)) {
//       console.log(`✅ ${response.data.users.length} utilisateurs récupérés (format users)`);
//       return response.data.users;
//     }
    
//     if (Array.isArray(response.data)) {
//       console.log(`✅ ${response.data.length} utilisateurs récupérés (format tableau)`);
//       return response.data;
//     }
    
//     if (response.data.results && Array.isArray(response.data.results)) {
//       console.log(`✅ ${response.data.results.length} utilisateurs récupérés (format results)`);
//       return response.data.results;
//     }
    
//     // Si l'API retourne un objet mais pas de liste claire
//     console.warn('⚠️ Format utilisateurs non standard, extraction des données...');
    
//     // Essayer de trouver une liste dans l'objet
//     for (const key in response.data) {
//       if (Array.isArray(response.data[key]) && response.data[key].length > 0) {
//         const firstItem = response.data[key][0];
//         if (firstItem.username || firstItem.email) {
//           console.log(`🔍 Utilisateurs trouvés dans la clé: ${key}`);
//           return response.data[key];
//         }
//       }
//     }
    
//     return [];
    
//   } catch (error) {
//     console.error('❌ Erreur récupération utilisateurs:', error.message);
    
//     // Fallback de développement
//     if (DEBUG) {
//       console.log('🔧 Mode développement: utilisateurs factices');
//       return Array.from({ length: 13 }, (_, i) => ({
//         id: i + 1,
//         username: `user${i + 1}`,
//         email: `user${i + 1}@simplon.com`,
//         first_name: `Prénom ${i + 1}`,
//         last_name: `Nom ${i + 1}`,
//         is_active: true,
//         is_staff: i === 0 // Le premier est admin
//       }));
//     }
    
//     return [];
//   }
// };

// // Explorer les endpoints Django
// export const exploreDjangoEndpoints = async () => {
//   const endpoints = [
//     { name: 'Status API', url: '/api/projects/' },
//     { name: 'Projects List', url: '/api/projects/projects/' },
//     { name: 'Users API', url: '/api/users/' },
//     { name: 'Users List', url: '/api/users/users/' },
//     { name: 'Token Auth', url: '/api/token/' },
//     { name: 'Admin', url: '/admin/' }
//   ];
  
//   const results = [];
  
//   for (const endpoint of endpoints) {
//     try {
//       const response = await axios.get(`${API_BASE_URL}${endpoint.url}`, {
//         timeout: 3000,
//         validateStatus: (status) => status < 500 // Accepter les 404
//       });
      
//       results.push({
//         ...endpoint,
//         status: 'available',
//         code: response.status,
//         data: response.data
//       });
//     } catch (error) {
//       results.push({
//         ...endpoint,
//         status: 'unavailable',
//         code: error.response?.status || 0,
//         error: error.message
//       });
//     }
//   }
  
//   return results;
// };

// // Service principal
// export const djangoApiService = {
//   // Santé
//   checkHealth: checkApiHealth,
  
//   // Données
//   getProjects,
//   getUsers,
  
//   // Utilitaires
//   exploreEndpoints: exploreDjangoEndpoints,
//   testConnection: testDjangoApi,
  
//   // Statistiques rapides
//   async getStats() {
//     try {
//       const [projects, users] = await Promise.all([
//         getProjects(),
//         getUsers()
//       ]);
      
//       return {
//         projectsCount: projects.length,
//         usersCount: users.length,
//         activeUsers: users.filter(u => u.is_active === true).length,
//         technologies: [...new Set(projects.flatMap(p => 
//           p.technologies?.split(',').map(t => t.trim()).filter(Boolean) || []
//         ))],
//         timestamp: new Date().toISOString()
//       };
//     } catch (error) {
//       throw error;
//     }
//   }
// };

// // Export par défaut pour compatibilité
// const defaultExport = {
//   checkApiHealth,
//   getProjects,
//   getUsers,
//   exploreDjangoEndpoints,
//   testDjangoApi,
//   djangoApiService,
//   API_BASE_URL
// };

// export default defaultExport;

// // Tester au démarrage
// if (typeof window !== 'undefined') {
//   window.djangoApiTest = testDjangoApi;
  
//   setTimeout(() => {
//     console.log('🔍 Test automatique API Django...');
//     testDjangoApi().then(result => {
//       if (result.success) {
//         console.log('🎉 Django API prête !');
//       }
//     });
//   }, 1500);
// }

// // src/services/api.js - VERSION CORRIGÉE
// import axios from 'axios';

// // Configuration Django
// const API_BASE_URL = 'http://localhost:8000';
// const DEBUG = true;

// console.log(`🔧 API Django connectée: ${API_BASE_URL}`);

// // Instance axios simple pour Django
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   }
// });

// // Fonction pour tester directement l'API
// export const testDjangoApi = async () => {
//   console.log('🧪 Test direct API Django...');
  
//   try {
//     // Test 1: Endpoint des projets
//     const projectsResponse = await fetch('http://localhost:8000/api/projects/projects/');
//     const projectsData = await projectsResponse.json();
    
//     // Test 2: Endpoint utilisateurs (essayer différents formats)
//     let usersData = null;
//     let usersCount = 0;
    
//     try {
//       const usersResponse = await fetch('http://localhost:8000/api/users/');
//       usersData = await usersResponse.json();
//       console.log('👤 Format réponse users:', usersData);
      
//       // Différents formats possibles
//       if (usersData.users && Array.isArray(usersData.users)) {
//         usersCount = usersData.users.length;
//       } else if (Array.isArray(usersData)) {
//         usersCount = usersData.length;
//       } else if (usersData.results && Array.isArray(usersData.results)) {
//         usersCount = usersData.results.length;
//       } else if (usersData.count) {
//         usersCount = usersData.count;
//       }
//     } catch (usersError) {
//       console.warn('⚠️ Erreur users API:', usersError.message);
//     }
    
//     console.log('✅ Test API Django:');
//     console.log(`   - Projets: ${projectsData.count || projectsData.projects?.length || 0}`);
//     console.log(`   - Utilisateurs: ${usersCount}`);
    
//     return {
//       success: true,
//       projects: projectsData,
//       users: usersData,
//       usersCount: usersCount
//     };
//   } catch (error) {
//     console.error('❌ Test API Django échoué:', error);
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// };

// // Vérifier la santé de l'API
// export const checkApiHealth = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/api/projects/projects/`, {
//       timeout: 5000
//     });
    
//     return {
//       status: 'online',
//       data: response.data,
//       message: 'Django API disponible',
//       projectsCount: response.data.count || response.data.projects?.length || 0,
//       timestamp: response.data.timestamp || new Date().toISOString()
//     };
//   } catch (error) {
//     return {
//       status: 'offline',
//       error: error.message,
//       message: 'Impossible de se connecter à Django',
//       suggestion: 'Vérifiez que le serveur Django est démarré (python manage.py runserver)'
//     };
//   }
// };

// // Récupérer les projets
// export const getProjects = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/api/projects/projects/`, {
//       timeout: 8000
//     });
    
//     // Votre format: {status: "success", count: 10, projects: [...]}
//     if (response.data.status === 'success' && response.data.projects) {
//       console.log(`✅ ${response.data.count} projets récupérés depuis Django`);
//       return response.data.projects;
//     }
    
//     // Fallback
//     if (Array.isArray(response.data)) {
//       return response.data;
//     }
    
//     console.warn('⚠️ Format inattendu, tentative d\'extraction...');
//     return [];
    
//   } catch (error) {
//     console.error('❌ Erreur récupération projets:', error.message);
    
//     // Fallback de développement
//     if (DEBUG) {
//       console.log('🔧 Mode développement: données factices');
//       return Array.from({ length: 10 }, (_, i) => ({
//         id: i + 1,
//         title: `Projet ${i + 1}`,
//         description: `Description du projet ${i + 1}`,
//         technologies: ['React', 'Django', 'PostgreSQL'][i % 3],
//         status: ['approved', 'pending', 'draft'][i % 3],
//         author_name: `Utilisateur ${i + 1}`,
//         views: Math.floor(Math.random() * 100),
//         likes: Math.floor(Math.random() * 50),
//         created_at: new Date(Date.now() - i * 86400000).toISOString()
//       }));
//     }
    
//     throw error;
//   }
// };

// // Récupérer les utilisateurs - VERSION AMÉLIORÉE
// export const getUsers = async () => {
//   try {
//     console.log('👥 Tentative de récupération utilisateurs...');
    
//     // Essayer différents endpoints possibles
//     const endpoints = [
//       '/api/users/',
//       '/api/users/users/',
//       '/api/auth/users/',
//       '/api/users/all/'
//     ];
    
//     for (const endpoint of endpoints) {
//       try {
//         console.log(`   Essai endpoint: ${endpoint}`);
//         const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
//           timeout: 5000
//         });
        
//         console.log(`   ✅ Réponse de ${endpoint}:`, Object.keys(response.data));
        
//         // Essayer d'extraire les utilisateurs de différents formats
//         let usersArray = null;
        
//         if (response.data.users && Array.isArray(response.data.users)) {
//           usersArray = response.data.users;
//           console.log(`   👥 Format: users array (${usersArray.length} utilisateurs)`);
//         } else if (Array.isArray(response.data)) {
//           usersArray = response.data;
//           console.log(`   👥 Format: direct array (${usersArray.length} utilisateurs)`);
//         } else if (response.data.results && Array.isArray(response.data.results)) {
//           usersArray = response.data.results;
//           console.log(`   👥 Format: results array (${usersArray.length} utilisateurs)`);
//         } else if (response.data.count && response.data.results) {
//           usersArray = response.data.results;
//           console.log(`   👥 Format: count + results (${usersArray.length} utilisateurs)`);
//         }
        
//         if (usersArray && usersArray.length > 0) {
//           console.log(`   ✅ ${usersArray.length} utilisateurs récupérés depuis ${endpoint}`);
          
//           // S'assurer que chaque utilisateur a un champ is_active
//           const processedUsers = usersArray.map(user => ({
//             ...user,
//             is_active: user.is_active !== undefined ? user.is_active : true,
//             username: user.username || user.email?.split('@')[0] || `user_${user.id}`
//           }));
          
//           return processedUsers;
//         }
//       } catch (endpointError) {
//         console.log(`   ❌ ${endpoint}: ${endpointError.message}`);
//         continue;
//       }
//     }
    
//     // Si aucun endpoint ne fonctionne, essayer d'extraire des projets
//     console.log('🔍 Aucun endpoint users trouvé, extraction depuis les projets...');
//     try {
//       const projects = await getProjects();
//       const authors = projects
//         .map(p => p.author)
//         .filter(Boolean)
//         .filter((author, index, self) => 
//           self.findIndex(a => a.id === author.id) === index
//         );
      
//       if (authors.length > 0) {
//         console.log(`   👥 ${authors.length} auteurs extraits des projets`);
//         return authors.map(author => ({
//           ...author,
//           is_active: true,
//           username: author.username || author.email?.split('@')[0] || `user_${author.id}`
//         }));
//       }
//     } catch (projectError) {
//       console.log('   ❌ Impossible d\'extraire depuis les projets');
//     }
    
//     console.warn('⚠️ Aucun utilisateur trouvé, retourne tableau vide');
//     return [];
    
//   } catch (error) {
//     console.error('❌ Erreur récupération utilisateurs:', error.message);
    
//     // Fallback de développement - 13 utilisateurs comme vous l'avez dit
//     if (DEBUG) {
//       console.log('🔧 Mode développement: 13 utilisateurs factices');
//       return Array.from({ length: 13 }, (_, i) => ({
//         id: i + 1,
//         username: `user${i + 1}`,
//         email: `user${i + 1}@simplon.com`,
//         first_name: `Prénom ${i + 1}`,
//         last_name: `Nom ${i + 1}`,
//         is_active: true,
//         is_staff: i === 0,
//         date_joined: new Date(Date.now() - i * 86400000).toISOString()
//       }));
//     }
    
//     return [];
//   }
// };

// // Explorer les endpoints Django
// export const exploreDjangoEndpoints = async () => {
//   const endpoints = [
//     { name: 'Status API', url: '/api/projects/' },
//     { name: 'Projects List', url: '/api/projects/projects/' },
//     { name: 'Users API', url: '/api/users/' },
//     { name: 'Users List', url: '/api/users/users/' },
//     { name: 'Token Auth', url: '/api/token/' },
//     { name: 'Admin', url: '/admin/' }
//   ];
  
//   const results = [];
  
//   for (const endpoint of endpoints) {
//     try {
//       const response = await axios.get(`${API_BASE_URL}${endpoint.url}`, {
//         timeout: 3000,
//         validateStatus: (status) => status < 500 // Accepter les 404
//       });
      
//       results.push({
//         ...endpoint,
//         status: 'available',
//         code: response.status,
//         data: response.data
//       });
//     } catch (error) {
//       results.push({
//         ...endpoint,
//         status: 'unavailable',
//         code: error.response?.status || 0,
//         error: error.message
//       });
//     }
//   }
  
//   return results;
// };

// // Service principal
// export const djangoApiService = {
//   // Santé
//   checkHealth: checkApiHealth,
  
//   // Données
//   getProjects,
//   getUsers,
  
//   // Utilitaires
//   exploreEndpoints: exploreDjangoEndpoints,
//   testConnection: testDjangoApi,
  
//   // Statistiques rapides
//   async getStats() {
//     try {
//       const [projects, users] = await Promise.all([
//         getProjects(),
//         getUsers()
//       ]);
      
//       return {
//         projectsCount: projects.length,
//         usersCount: users.length,
//         activeUsers: users.filter(u => u.is_active === true).length,
//         technologies: [...new Set(projects.flatMap(p => 
//           p.technologies?.split(',').map(t => t.trim()).filter(Boolean) || []
//         ))],
//         timestamp: new Date().toISOString()
//       };
//     } catch (error) {
//       throw error;
//     }
//   }
// };

// // Export par défaut pour compatibilité
// const defaultExport = {
//   checkApiHealth,
//   getProjects,
//   getUsers,
//   exploreDjangoEndpoints,
//   testDjangoApi,
//   djangoApiService,
//   API_BASE_URL
// };

// export default defaultExport;

// // Tester au démarrage
// if (typeof window !== 'undefined') {
//   window.djangoApiTest = testDjangoApi;
  
//   setTimeout(() => {
//     console.log('🔍 Test automatique API Django...');
//     testDjangoApi().then(result => {
//       if (result.success) {
//         console.log('🎉 Django API prête !');
//       }
//     });
//   }, 1500);
// }


// // src/services/api.js - VERSION AMÉLIORÉE
// import axios from 'axios';
// import authService from './auth';

// const API_BASE_URL = 'http://localhost:8000';
// const DEBUG = true;

// console.log(`🔧 API Django: ${API_BASE_URL}`);

// // Configuration axios
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   }
// });

// // ✅ TEST DE CONNEXION AMÉLIORÉ
// export const testDjangoApi = async () => {
//   console.log('🧪 Test de connexion à Django...');
  
//   const endpointsToTest = [
//     { name: 'API Root', url: '/api/' },
//     { name: 'JWT Token', url: '/api/token/' },
//     { name: 'Users', url: '/api/users/' },
//     { name: 'Projects', url: '/api/projects/projects/' },
//     { name: 'Admin', url: '/admin/' }
//   ];
  
//   const results = [];
  
//   for (const endpoint of endpointsToTest) {
//     try {
//       const response = await api.get(endpoint.url, {
//         timeout: 3000,
//         validateStatus: (status) => true // Accepter tous les codes
//       });
      
//       results.push({
//         ...endpoint,
//         status: 'success',
//         code: response.status,
//         data: response.data ? 'OK' : 'Empty'
//       });
//     } catch (error) {
//       results.push({
//         ...endpoint,
//         status: 'error',
//         code: error.response?.status || 0,
//         error: error.message
//       });
//     }
//   }
  
//   // Analyser les résultats
//   const availableEndpoints = results.filter(r => r.code < 400);
//   const isApiAvailable = availableEndpoints.length > 0;
  
//   console.log('📊 Résultats des tests:');
//   results.forEach(r => {
//     console.log(`   ${r.status === 'success' ? '✅' : '❌'} ${r.name}: ${r.code} ${r.url}`);
//   });
  
//   return {
//     success: isApiAvailable,
//     available: isApiAvailable,
//     results,
//     message: isApiAvailable ? 
//       `API disponible (${availableEndpoints.length}/${endpointsToTest.length} endpoints)` :
//       'API Django non accessible'
//   };
// };

// // ✅ SERVICES API
// export const apiService = {
//   // ✅ PROFIL UTILISATEUR
//   getProfile: async () => {
//     try {
//       const token = authService.getAccessToken();
//       if (!token) {
//         throw new Error('Non authentifié');
//       }
      
//       const response = await api.get('/api/users/profile/', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('❌ Erreur getProfile:', error.message);
      
//       // Fallback vers les données locales
//       const localUser = localStorage.getItem('simplon_user');
//       if (localUser) {
//         console.log('📁 Utilisation des données locales');
//         return JSON.parse(localUser);
//       }
      
//       throw error;
//     }
//   },
  
//   updateProfile: async (data) => {
//     try {
//       const token = authService.getAccessToken();
//       if (!token) {
//         throw new Error('Non authentifié');
//       }
      
//       const response = await api.patch('/api/users/profile/', data, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('❌ Erreur updateProfile:', error.message);
//       throw error;
//     }
//   },
  
//   uploadAvatar: async (file) => {
//     try {
//       const token = authService.getAccessToken();
//       if (!token) {
//         throw new Error('Non authentifié');
//       }
      
//       const formData = new FormData();
//       formData.append('avatar', file);
      
//       const response = await api.post('/api/users/profile/avatar/', formData, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('❌ Erreur uploadAvatar:', error.message);
//       throw error;
//     }
//   },
  
//   // ✅ PROJETS
//   getProjects: async () => {
//     try {
//       // Essayer avec token d'abord
//       const token = authService.getAccessToken();
//       const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
//       const response = await api.get('/api/projects/projects/', { headers });
      
//       // Gérer différents formats de réponse
//       if (response.data.projects && Array.isArray(response.data.projects)) {
//         return response.data.projects;
//       } else if (response.data.results && Array.isArray(response.data.results)) {
//         return response.data.results;
//       } else if (Array.isArray(response.data)) {
//         return response.data;
//       }
      
//       return [];
//     } catch (error) {
//       console.error('❌ Erreur getProjects:', error.message);
      
//       // Fallback de développement
//       if (DEBUG) {
//         console.log('🔧 Mode développement: projets factices');
//         return Array.from({ length: 12 }, (_, i) => ({
//           id: i + 1,
//           title: `Projet ${i + 1}`,
//           description: `Description du projet ${i + 1}. Un projet innovant qui utilise les dernières technologies.`,
//           author: {
//             id: i + 1,
//             username: `user${i + 1}`,
//             first_name: `Prénom ${i + 1}`,
//             last_name: `Nom ${i + 1}`
//           },
//           status: ['approved', 'pending', 'draft'][i % 3],
//           views: Math.floor(Math.random() * 1000),
//           downloads: Math.floor(Math.random() * 100),
//           created_at: new Date(Date.now() - i * 86400000).toISOString()
//         }));
//       }
      
//       return [];
//     }
//   },
  
//   getUserProjects: async () => {
//     try {
//       const token = authService.getAccessToken();
//       if (!token) {
//         return [];
//       }
      
//       const response = await api.get('/api/projects/user-projects/', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       if (response.data.results && Array.isArray(response.data.results)) {
//         return response.data.results;
//       } else if (Array.isArray(response.data)) {
//         return response.data;
//       }
      
//       return [];
//     } catch (error) {
//       console.error('❌ Erreur getUserProjects:', error.message);
//       return [];
//     }
//   },
  
//   // ✅ UTILISATEURS
//   getUsers: async () => {
//     try {
//       const token = authService.getAccessToken();
//       const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
//       const response = await api.get('/api/users/', { headers });
      
//       let users = [];
      
//       if (response.data.results && Array.isArray(response.data.results)) {
//         users = response.data.results;
//       } else if (response.data.users && Array.isArray(response.data.users)) {
//         users = response.data.users;
//       } else if (Array.isArray(response.data)) {
//         users = response.data;
//       }
      
//       return users;
//     } catch (error) {
//       console.error('❌ Erreur getUsers:', error.message);
      
//       // Fallback de développement
//       if (DEBUG) {
//         console.log('🔧 Mode développement: utilisateurs factices');
//         return Array.from({ length: 13 }, (_, i) => ({
//           id: i + 1,
//           username: `user${i + 1}`,
//           email: `user${i + 1}@simplon.com`,
//           first_name: `Prénom ${i + 1}`,
//           last_name: `Nom ${i + 1}`,
//           is_active: true,
//           is_staff: i === 0,
//           is_superuser: i === 0,
//           cohort: `Simplon ${2023 + (i % 3)}`,
//           date_joined: new Date(Date.now() - i * 86400000).toISOString()
//         }));
//       }
      
//       return [];
//     }
//   },
  
//   // ✅ STATISTIQUES
//   getStats: async () => {
//     try {
//       const [projects, users] = await Promise.all([
//         apiService.getProjects().catch(() => []),
//         apiService.getUsers().catch(() => [])
//       ]);
      
//       return {
//         projectsCount: projects.length,
//         usersCount: users.length,
//         activeUsers: users.filter(u => u.is_active === true).length,
//         recentProjects: projects
//           .filter(p => p.created_at)
//           .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
//           .slice(0, 5),
//         timestamp: new Date().toISOString()
//       };
//     } catch (error) {
//       console.error('❌ Erreur getStats:', error.message);
//       return {
//         projectsCount: 0,
//         usersCount: 0,
//         activeUsers: 0,
//         recentProjects: [],
//         timestamp: new Date().toISOString()
//       };
//     }
//   },
  
//   // ✅ AUTHENTIFICATION
//   login: async (username, password) => {
//     try {
//       const response = await api.post('/api/token/', {
//         username,
//         password
//       });
//       return response.data;
//     } catch (error) {
//       console.error('❌ Erreur login:', error.message);
//       throw error;
//     }
//   },
  
//   refreshToken: async (refreshToken) => {
//     try {
//       const response = await api.post('/api/token/refresh/', {
//         refresh: refreshToken
//       });
//       return response.data;
//     } catch (error) {
//       console.error('❌ Erreur refreshToken:', error.message);
//       throw error;
//     }
//   }
// };

// // ✅ ALIAS pour compatibilité
// export const djangoApiService = apiService;

// // ✅ FONCTIONS EXPORTÉES INDIVIDUELLEMENT
// export const getProjects = apiService.getProjects;
// export const getUsers = apiService.getUsers;
// export const checkApiHealth = testDjangoApi;
// export const exploreDjangoEndpoints = testDjangoApi;

// // ✅ EXPORT PAR DÉFAUT
// const defaultExport = {
//   // Service principal
//   ...apiService,
  
//   // Pour compatibilité
//   djangoApiService: apiService,
//   apiService,
  
//   // Fonctions utilitaires
//   testConnection: testDjangoApi,
//   testDjangoApi,
//   checkApiHealth: testDjangoApi,
  
//   // Configuration
//   API_BASE_URL,
  
//   // Instance axios (pour les composants qui en ont besoin)
//   axios: api
// };

// export default defaultExport;

// // ✅ TEST AU DÉMARRAGE
// if (typeof window !== 'undefined') {
//   window.apiService = apiService;
//   window.testDjangoApi = testDjangoApi;
  
//   setTimeout(() => {
//     console.log('🔍 Test automatique de connexion...');
//     testDjangoApi().then(result => {
//       if (result.success) {
//         console.log(`🎉 ${result.message}`);
//       } else {
//         console.log(`⚠️ ${result.message}`);
//         console.log('💡 Vérifiez que Django est démarré:');
//         console.log('   1. Ouvrez un terminal dans votre dossier Django');
//         console.log('   2. Tapez: python manage.py runserver');
//         console.log('   3. Vérifiez que http://localhost:8000 est accessible');
//       }
//     });
//   }, 2000);
// }



// src/services/api.js - VERSION FINALE FONCTIONNELLE
import axios from 'axios';

// Configuration simple
const API_BASE_URL = 'http://localhost:8000';

console.log(`🔧 API Django: ${API_BASE_URL}`);

// Instance axios de base
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// ✅ FONCTION SIMPLE POUR RÉCUPÉRER LES DONNÉES
export const fetchRealProjects = async () => {
  console.log('📡 Tentative de récupération des projets...');
  
  try {
    // Test simple de l'endpoint
    const response = await axios.get(`${API_BASE_URL}/api/projects/projects/`, {
      timeout: 5000
    });
    
    console.log('✅ Réponse API:', {
      status: response.status,
      dataKeys: Object.keys(response.data)
    });
    
    // Extraire les projets selon le format
    let projects = [];
    
    if (response.data.projects && Array.isArray(response.data.projects)) {
      projects = response.data.projects;
      console.log(`✅ ${projects.length} projets trouvés dans .projects`);
    } else if (Array.isArray(response.data)) {
      projects = response.data;
      console.log(`✅ ${projects.length} projets trouvés (tableau direct)`);
    } else if (response.data.results && Array.isArray(response.data.results)) {
      projects = response.data.results;
      console.log(`✅ ${projects.length} projets trouvés dans .results`);
    } else {
      console.log('⚠️ Format de données inattendu:', response.data);
      return [];
    }
    
    return projects;
    
  } catch (error) {
    console.error('❌ Erreur API projets:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url
    });
    
    // PAS de mode démo ici !
    throw new Error(`API Django inaccessible: ${error.message}`);
  }
};

// ✅ FONCTION SIMPLE POUR RÉCUPÉRER LES UTILISATEURS
export const fetchRealUsers = async () => {
  console.log('📡 Tentative de récupération des utilisateurs...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/users/`, {
      timeout: 5000
    });
    
    console.log('✅ Réponse Users API:', {
      status: response.status,
      dataKeys: Object.keys(response.data)
    });
    
    let users = [];
    
    if (response.data.users && Array.isArray(response.data.users)) {
      users = response.data.users;
    } else if (Array.isArray(response.data)) {
      users = response.data;
    } else if (response.data.results && Array.isArray(response.data.results)) {
      users = response.data.results;
    }
    
    console.log(`✅ ${users.length} utilisateurs trouvés`);
    return users;
    
  } catch (error) {
    console.error('❌ Erreur API users:', error.message);
    throw new Error(`API Users inaccessible: ${error.message}`);
  }
};

// ✅ SERVICE PRINCIPAL (NO MODE DÉMO!)
export const realApiService = {
  // Santé de l'API
  async checkHealth() {
    try {
      await axios.get(`${API_BASE_URL}/api/projects/projects/`, { timeout: 3000 });
      return { healthy: true, message: '✅ API Django disponible' };
    } catch (error) {
      return { 
        healthy: false, 
        message: '❌ API Django injoignable',
        error: error.message 
      };
    }
  },
  
  // Récupérer tout (vraiment)
  async fetchAllData() {
    console.log('🚀 Récupération de TOUTES les données réelles...');
    
    try {
      const [projects, users] = await Promise.all([
        fetchRealProjects(),
        fetchRealUsers().catch(() => []) // Users optionnel
      ]);
      
      console.log(`🎉 Données réelles récupérées: ${projects.length} projets, ${users.length} utilisateurs`);
      
      return {
        success: true,
        projects: projects,
        users: users,
        stats: {
          totalProjects: projects.length,
          published: projects.filter(p => p.status === 'published').length,
          pending: projects.filter(p => p.status === 'pending').length,
          totalUsers: users.length
        }
      };
      
    } catch (error) {
      console.error('💥 Échec récupération données réelles:', error);
      return {
        success: false,
        error: error.message,
        projects: [],
        users: []
      };
    }
  },
  
  // Tester tous les endpoints
  async testAllEndpoints() {
    const endpoints = [
      { name: 'Projects', url: '/api/projects/projects/' },
      { name: 'Users', url: '/api/users/' },
      { name: 'Token', url: '/api/token/' },
      { name: 'Admin', url: '/admin/' }
    ];
    
    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${API_BASE_URL}${endpoint.url}`, {
          timeout: 3000,
          validateStatus: () => true // Accepter tous les codes
        });
        
        results.push({
          ...endpoint,
          status: 'success',
          code: response.status,
          data: response.data ? 'Données présentes' : 'Aucune donnée'
        });
      } catch (error) {
        results.push({
          ...endpoint,
          status: 'error',
          code: error.response?.status || 0,
          error: error.message
        });
      }
    }
    
    return results;
  },
  
  // Méthodes de base pour compatibilité
  get: (url, config) => api.get(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  patch: (url, data, config) => api.patch(url, data, config),
  delete: (url, config) => api.delete(url, config)
};

// ✅ EXPORT PAR DÉFAUT - CRITIQUE POUR VOS IMPORTS EXISTANTS
export default {
  // Méthodes de base axios
  get: realApiService.get,
  post: realApiService.post,
  put: realApiService.put,
  patch: realApiService.patch,
  delete: realApiService.delete,
  
  // Services
  realApiService,
  
  // Fonctions utilitaires
  fetchRealProjects,
  fetchRealUsers,
  
  // Alias pour compatibilité
  apiService: realApiService,
  djangoApiService: realApiService,
  
  // Vérification santé
  checkHealth: realApiService.checkHealth,
  
  // Instance axios directe
  axios: api
};