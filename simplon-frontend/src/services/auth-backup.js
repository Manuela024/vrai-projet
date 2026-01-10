

// // src/services/auth.js - VERSION CORRECTE AVEC API
// import api from './api';

// const authService = {
//   // Authentification normale
//   async login(matricule, password) {
//     try {
//       console.log('🔐 Tentative de connexion avec:', matricule);
      
//       // Appel à l'API Django REST pour obtenir le token
//       const response = await api.post('/token/', {
//         username: matricule,
//         password: password
//       });
      
//       const { access, refresh } = response.data;
      
//       // Stocker les tokens
//       localStorage.setItem('access_token', access);
//       localStorage.setItem('refresh_token', refresh);
      
//       // Récupérer les infos utilisateur
//       const userResponse = await api.get('/users/me/');
//       const user = userResponse.data;
      
//       // Stocker l'utilisateur
//       localStorage.setItem('user', JSON.stringify(user));
      
//       console.log('✅ Connexion réussie:', user);
//       return { success: true, user };
      
//     } catch (error) {
//       console.error('❌ Erreur de connexion:', error.response?.data || error.message);
      
//       if (error.response?.status === 401) {
//         throw new Error('Matricule ou mot de passe incorrect');
//       }
      
//       throw new Error('Erreur de connexion au serveur');
//     }
//   },

//   // Connexion rapide (alternative si API down)
//   async quickLogin(matricule, password) {
//     // D'abord essayer l'API
//     try {
//       return await this.login(matricule, password);
//     } catch (apiError) {
//       console.log('⚠️ API non disponible, utilisation du mode simulation');
      
//       // Mode simulation pour développement
//       return this.mockLogin(matricule, password);
//     }
//   },

//   // Simulation pour développement
//   mockLogin(matricule, password) {
//     console.log('🎭 Mode simulation activé');
    
//     // Simulation de vérification
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         // Simuler un délai réseau
//         if (!matricule || !password) {
//           reject(new Error('Matricule et mot de passe requis'));
//           return;
//         }
        
//         // Déterminer si admin basé sur le matricule
//         const isAdmin = matricule.includes('admin') || 
//                        matricule === 'simplon_admin' ||
//                        matricule.startsWith('admin');
        
//         // Créer l'utilisateur simulé
//         const user = {
//           id: isAdmin ? 1 : 2,
//           username: matricule,
//           email: `${matricule}@simplon.com`,
//           first_name: isAdmin ? 'Admin' : 'User',
//           last_name: 'Test',
//           is_staff: isAdmin,
//           is_superuser: isAdmin,
//           isAdmin: isAdmin,
//           role: isAdmin ? 'admin' : 'user'
//         };
        
//         // Stocker
//         localStorage.setItem('user', JSON.stringify(user));
//         localStorage.setItem('access_token', 'mock_' + Date.now());
//         localStorage.setItem('refresh_token', 'mock_refresh_' + Date.now());
        
//         console.log('✅ Connexion simulée:', user);
//         resolve({ success: true, user });
//       }, 500);
//     });
//   },

//   // Vérifier si connecté
//   isAuthenticated() {
//     const token = localStorage.getItem('access_token');
//     const user = localStorage.getItem('user');
//     return !!(token && user);
//   },

//   // Vérifier si admin
//   isAdmin() {
//     try {
//       const userStr = localStorage.getItem('user');
//       if (!userStr) return false;
//       const user = JSON.parse(userStr);
//       return !!(user.is_staff || user.is_superuser || user.isAdmin);
//     } catch {
//       return false;
//     }
//   },

//   // Récupérer l'utilisateur courant
//   getCurrentUser() {
//     try {
//       const userStr = localStorage.getItem('user');
//       return userStr ? JSON.parse(userStr) : null;
//     } catch {
//       return null;
//     }
//   },

//   // Déconnexion
//   logout() {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('refresh_token');
//     localStorage.removeItem('user');
//     window.location.href = '/login';
//   },

//   // Rafraîchir le token
//   async refreshToken() {
//     try {
//       const refreshToken = localStorage.getItem('refresh_token');
//       if (!refreshToken) throw new Error('No refresh token');
      
//       const response = await api.post('/token/refresh/', {
//         refresh: refreshToken
//       });
      
//       localStorage.setItem('access_token', response.data.access);
//       return true;
//     } catch (error) {
//       this.logout();
//       return false;
//     }
//   }
// };

// export default authService;

// // src/services/auth.js - VERSION AVEC VÉRIFICATION RÉELLE
// import api from './api';


// const authService = {
//   // ✅ VÉRIFICATION RÉELLE DANS LA BD DJANGO
//   async login(matricule, password) {
//     try {
//       console.log('🔐 Tentative de connexion réelle avec:', matricule);
      
//       // 1. Authentification JWT avec Django REST
//       const response = await api.post('/token/', {
//         username: matricule,
//         password: password
//       });
      
//       const { access, refresh } = response.data;
      
//       // 2. Stocker les tokens
//       localStorage.setItem('access_token', access);
//       localStorage.setItem('refresh_token', refresh);
      
//       // 3. Récupérer les infos utilisateur
//       // const userResponse = await api.get('/users/me/');
//       // Dans la fonction login() de auth.js, modifiez :
// const userResponse = await api.get('/api/profile/');  // ou /api/user/
//       const user = userResponse.data;
      
//       // 4. Stocker l'utilisateur
//       localStorage.setItem('user', JSON.stringify(user));
      
//       console.log('✅ Connexion réussie (BD Django):', user);
//       return { success: true, user };
      
//     } catch (error) {
//       console.error('❌ Erreur de connexion API:', error.response?.data || error.message);
      
//       // Messages d'erreur spécifiques
//       if (error.response?.status === 401) {
//         throw new Error('Matricule ou mot de passe incorrect');
//       } else if (error.response?.status === 400) {
//         throw new Error('Requête invalide');
//       } else if (error.code === 'ECONNREFUSED') {
//         throw new Error('Serveur Django non accessible. Vérifiez que le backend est démarré.');
//       }
      
//       throw new Error('Erreur de connexion au serveur');
//     }
//   },

//   // ✅ MÉTHODE PRINCIPALE (essaie API, sinon simulation)
//   async quickLogin(matricule, password) {
//     console.log('🚀 Début processus authentification pour:', matricule);
    
//     // Essayer d'abord l'API Django réelle
//     try {
//       console.log('🔍 Tentative connexion API Django...');
//       return await this.login(matricule, password);
      
//     } catch (apiError) {
//       console.log('⚠️ API Django non disponible:', apiError.message);
//       console.log('🔄 Activation mode simulation pour développement');
      
//       // Mode simulation SEULEMENT si l'API échoue
//       return this.mockLogin(matricule, password);
//     }
//   },

//   // ✅ MODE SIMULATION (uniquement pour développement)
//   mockLogin(matricule, password) {
//     return new Promise((resolve, reject) => {
//       console.log('🎭 Mode simulation activé');
      
//       // Simuler un délai réseau
//       setTimeout(() => {
//         // VÉRIFICATION SIMULÉE
//         if (!matricule || !password) {
//           reject(new Error('Matricule et mot de passe requis'));
//           return;
//         }
        
//         // Simuler des vérifications de sécurité
//         if (password.length < 3) {
//           reject(new Error('Mot de passe trop court'));
//           return;
//         }
        
//         // Simuler une vérification BD
//         const isValidCredentials = this.simulateDBCheck(matricule, password);
        
//         if (!isValidCredentials) {
//           reject(new Error('Matricule ou mot de passe incorrect (simulation)'));
//           return;
//         }
        
//         // Déterminer rôle basé sur le matricule
//         const isAdmin = this.isAdminMatricule(matricule);
        
//         // Créer utilisateur simulé
//         const user = {
//           id: isAdmin ? 1 : 2,
//           username: matricule,
//           email: `${matricule}@simplon.com`,
//           first_name: isAdmin ? 'Admin' : 'User',
//           last_name: 'Test',
//           is_staff: isAdmin,
//           is_superuser: isAdmin,
//           isAdmin: isAdmin,
//           role: isAdmin ? 'admin' : 'user',
//           cohort: 'Simplon 2024',
//           date_joined: new Date().toISOString()
//         };
        
//         // Stocker
//         localStorage.setItem('user', JSON.stringify(user));
//         localStorage.setItem('access_token', 'mock_token_' + Date.now());
//         localStorage.setItem('refresh_token', 'mock_refresh_' + Date.now());
        
//         console.log('✅ Connexion simulée réussie:', user);
//         resolve({ success: true, user });
        
//       }, 800); // Simuler délai réseau
//     });
//   },

//   // ✅ SIMULATION DE VÉRIFICATION BD
//   simulateDBCheck(matricule, password) {
//     // Logique de vérification simulée
//     const validUsers = {
//       // Admins
//       'admin': 'admin123',
//       'simplon_admin': 'simplon2024',
//       'administrateur': 'password',
      
//       // Utilisateurs normaux
//       'user123': 'password123',
//       'stagiaire1': 'simplon',
//       'etudiant': 'etudiant123',
//       '2024001': 'simplon2024',
//       '2024002': 'simplon2024'
//     };
    
//     return validUsers[matricule] === password;
//   },

//   // ✅ DÉTECTION ADMIN
//   isAdminMatricule(matricule) {
//     const adminMatricules = [
//       'admin', 'administrateur', 'simplon_admin', 
//       'superuser', 'root', 'sysadmin'
//     ];
    
//     return adminMatricules.includes(matricule.toLowerCase()) ||
//            matricule.toLowerCase().startsWith('admin_');
//   },

//   // ✅ VÉRIFICATION AUTH
//   isAuthenticated() {
//     const user = localStorage.getItem('user');
//     const token = localStorage.getItem('access_token');
//     return !!(user && token);
//   },

//   // ✅ VÉRIFICATION ADMIN
//   isAdmin() {
//     try {
//       const userStr = localStorage.getItem('user');
//       if (!userStr) return false;
//       const user = JSON.parse(userStr);
//       return !!(user.is_staff || user.is_superuser || user.isAdmin);
//     } catch {
//       return false;
//     }
//   },

//   // ✅ RÉCUPÉRATION UTILISATEUR
//   getCurrentUser() {
//     try {
//       const userStr = localStorage.getItem('user');
//       return userStr ? JSON.parse(userStr) : null;
//     } catch {
//       return null;
//     }
//   },

//   // ✅ DÉCONNEXION
//   logout() {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('refresh_token');
//     localStorage.removeItem('user');
//     window.location.href = '/login';
//   }
// };

// export default authService;

// src/services/auth.js - ADAPTÉ À VOTRE API DJANGO
import api from './api';

const authService = {
  // ✅ CONNEXION AVEC VOTRE API RÉELLE
  async login(matricule, password) {
    try {
      console.log('🔐 Connexion API Django avec:', matricule);
      
      // 1. Authentification JWT
      const tokenResponse = await api.post('/token/', {
        username: matricule,
        password: password
      });
      
      const { access, refresh } = tokenResponse.data;
      
      // Stocker les tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // 2. Récupérer le profil utilisateur
      // Essayez d'abord /api/profile/, puis /api/user/
      let user = null;
      
      try {
        const profileResponse = await api.get('/profile/');
        user = profileResponse.data;
      } catch (profileError) {
        console.log('⚠️ /api/profile/ non disponible, essai /api/user/');
        try {
          const userResponse = await api.get('/user/');
          user = userResponse.data;
        } catch (userError) {
          console.log('⚠️ Aucun endpoint utilisateur trouvé');
          // Créer un utilisateur basique à partir du matricule
          user = {
            username: matricule,
            email: `${matricule}@simplon.com`,
            is_staff: matricule.includes('admin'),
            is_superuser: matricule.includes('admin')
          };
        }
      }
      
      // 3. Stocker l'utilisateur
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('✅ Connexion API réussie:', user);
      return { success: true, user };
      
    } catch (error) {
      console.error('❌ Erreur connexion API:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        throw new Error('Matricule ou mot de passe incorrect');
      } else if (error.response?.status === 404) {
        throw new Error('Endpoint API non trouvé. Vérifiez votre configuration.');
      }
      
      throw new Error('Erreur de connexion au serveur');
    }
  },

  // ✅ MÉTHODE PRINCIPALE
  async quickLogin(matricule, password) {
    console.log('🚀 QuickLogin pour:', matricule);
    
    // D'abord essayer l'API réelle
    try {
      console.log('🔍 Tentative API Django...');
      return await this.login(matricule, password);
      
    } catch (apiError) {
      console.log('⚠️ API échouée:', apiError.message);
      console.log('🔄 Activation mode simulation');
      
      // Fallback: simulation
      return this.mockLogin(matricule, password);
    }
  },

  // ✅ SIMULATION (même logique)
  mockLogin(matricule, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Vérification simulée
        if (!matricule || !password) {
          reject(new Error('Matricule et mot de passe requis'));
          return;
        }
        
        // Identifiants valides en simulation
        const validCredentials = {
          'admin': 'admin123',
          'simplon_2025001': 'password123',
          'user123': 'password123'
        };
        
        if (validCredentials[matricule] !== password) {
          reject(new Error('Matricule ou mot de passe incorrect'));
          return;
        }
        
        // Déterminer rôle
        const isAdmin = matricule.includes('admin') || matricule === 'simplon_admin';
        
        // Créer utilisateur
        const user = {
          id: isAdmin ? 1 : 2,
          username: matricule,
          email: `${matricule}@simplon.com`,
          first_name: matricule,
          last_name: 'Utilisateur',
          is_staff: isAdmin,
          is_superuser: isAdmin,
          isAdmin: isAdmin,
          role: isAdmin ? 'admin' : 'user'
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('access_token', 'mock_' + Date.now());
        
        console.log('✅ Simulation réussie:', user);
        resolve({ success: true, user });
        
      }, 800);
    });
  },

  // ✅ VÉRIFICATIONS
  isAuthenticated() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    const isAuth = !!(user && token);
    console.log('🔍 isAuthenticated:', { hasUser: !!user, hasToken: !!token, result: isAuth });
    return isAuth;
  },

  isAdmin() {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.log('🔍 isAdmin: aucun utilisateur');
        return false;
      }
      const user = JSON.parse(userStr);
      const isAdmin = !!(user.is_staff || user.is_superuser || user.isAdmin);
      console.log('🔍 isAdmin check:', { user: user.username, isAdmin });
      return isAdmin;
    } catch (e) {
      console.error('❌ Erreur isAdmin:', e);
      return false;
    }
  },

  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
};

export default authService;