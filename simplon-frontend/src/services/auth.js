// // src/services/auth.js
// const API_URL = 'http://localhost:8000/api';

// // ==================== SERVICE D'AUTHENTIFICATION PRINCIPAL ====================
// const authService = {
  
//   // ==================== FLOW LIEN MAGIQUE ====================
  
//   async requestLoginLink(matricule, email) {
//     try {
//       const response = await fetch(`${API_URL}/auth/request-login/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ matricule, email }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         return { success: true, message: data.message, token: data.token };
//       } else {
//         const errorData = await response.json();
//         return { success: false, message: errorData.message || 'Erreur lors de l\'envoi du lien' };
//       }
//     } catch (error) {
//       console.error('Request login link error:', error);
//       return { 
//         success: false, 
//         message: 'Erreur de connexion au serveur' 
//       };
//     }
//   },

//   async setupPassword(token, matricule, email, username, password) {
//     try {
//       const response = await fetch(`${API_URL}/auth/setup-password/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           token, 
//           matricule, 
//           email, 
//           username, 
//           password 
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         return { 
//           success: true, 
//           message: data.message, 
//           username: data.username 
//         };
//       } else {
//         const errorData = await response.json();
//         return { 
//           success: false, 
//           message: errorData.message || 'Erreur lors de la création du compte' 
//         };
//       }
//     } catch (error) {
//       console.error('Setup password error:', error);
//       return { 
//         success: false, 
//         message: 'Erreur de connexion au serveur' 
//       };
//     }
//   },

//   // ==================== CONNEXION DIRECTE ====================

//   async directLogin(username, password) {
//     try {
//       const response = await fetch(`${API_URL}/auth/direct-login/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, password }),
//       });

//       if (response.ok) {
//         const data = await response.json();
        
//         // Stocker les tokens
//         localStorage.setItem('access_token', data.access);
//         localStorage.setItem('refresh_token', data.refresh);
//         localStorage.setItem('user', JSON.stringify(data.user));
        
//         return data;
//       } else {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Identifiants incorrects');
//       }
//     } catch (error) {
//       console.error('Direct login error:', error);
//       throw error;
//     }
//   },


//   // auth.js - CORRECTION DE LA GESTION D'ERREUR
// async quickLogin(matricule, password) {
//   try {
//     console.log('🔐 DEBUG - Tentative de connexion avec:', { matricule, password });
    
//     const requestData = {
//       username: matricule,  // ⭐ IMPORTANT: Utiliser 'username' au lieu de 'matricule'
//       password: password
//     };
    
//     console.log('📤 DEBUG - Données envoyées:', requestData);
    
//     const response = await fetch(`${API_URL}/auth/quick-login/`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(requestData),
//     });

//     console.log('📊 DEBUG - Status HTTP:', response.status);

//     const data = await response.json();
//     console.log('📋 DEBUG - Réponse serveur:', data);

//     if (!response.ok) {
//       console.error('❌ DEBUG - Erreur serveur:', data);
      
//       // ⭐ CORRECTION CRITIQUE : Créer un objet d'erreur structuré
//       const error = new Error(data.error || data.message || 'Erreur de connexion');
//       error.response = {
//         status: response.status,
//         data: data
//       };
//       throw error;
//     }

//     console.log('✅ DEBUG - Connexion réussie:', data);

//     // Stocker les tokens
//     if (data.access && data.refresh) {
//       localStorage.setItem('access_token', data.access);
//       localStorage.setItem('refresh_token', data.refresh);
//       localStorage.setItem('user', JSON.stringify(data.user));
//     }

//     return data;
//   } catch (error) {
//     console.error('❌ DEBUG - ERREUR COMPLÈTE quick login:');
    
//     // ⭐ CORRECTION : Vérifier si error.message existe
//     if (error.message) {
//       console.error('⚡ Message:', error.message);
//     } else {
//       console.error('⚡ Message: Aucun message d\'erreur');
//     }
    
//     console.error('🔢 Code:', error.code);
//     console.error('📊 Status:', error.response?.status);
//     console.error('📋 Données erreur:', error.response?.data);
    
//     // Relancer l'erreur pour que le composant puisse la gérer
//     throw error;
//   }
// },

//   // ==================== CONNEXION JWT STANDARD ====================

//   async login(username, password) {
//     try {
//       const response = await fetch(`${API_URL}/auth/token/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, password }),
//       });

//       // ⭐ CORRECTION : Gestion des erreurs de connexion
//       if (!response.ok && response.status === 0) {
//         throw new Error('CONNECTION_REFUSED');
//       }

//       if (response.ok) {
//         const data = await response.json();
        
//         localStorage.setItem('access_token', data.access);
//         localStorage.setItem('refresh_token', data.refresh);
        
//         // Récupérer le profil utilisateur
//         await this.getUserProfile();
        
//         return data;
//       } else {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || 'Identifiants incorrects');
//       }
//     } catch (error) {
//       console.error('Login error:', error);
      
//       // ⭐ CORRECTION : Message spécifique pour erreur de connexion
//       if (error.message === 'CONNECTION_REFUSED' || error.message.includes('Failed to fetch')) {
//         throw new Error('❌ Serveur Django non démarré. Vérifiez que le backend est en cours d\'exécution sur le port 8000.');
//       }
      
//       throw error;
//     }
//   },

//   // ==================== MOT DE PASSE OUBLIÉ ====================

//   async forgotPassword(email) {
//     try {
//       const response = await fetch(`${API_URL}/auth/forgot-password/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email }),
//       });

//       // Gestion spécifique de l'erreur de connexion
//       if (!response.ok && response.status === 0) {
//         throw new Error('CONNECTION_REFUSED');
//       }

//       const data = await response.json();
      
//       if (response.ok) {
//         return { 
//           success: true, 
//           message: data.message 
//         };
//       } else {
//         return { 
//           success: false, 
//           message: data.message || 'Erreur lors de la demande de réinitialisation' 
//         };
//       }
//     } catch (error) {
//       console.error('Forgot password error:', error);
      
//       // Message spécifique pour erreur de connexion
//       if (error.message === 'CONNECTION_REFUSED' || error.message.includes('Failed to fetch')) {
//         return { 
//           success: false, 
//           message: '❌ Serveur indisponible. Vérifiez que le serveur Django est démarré sur le port 8000.' 
//         };
//       }
      
//       return { 
//         success: false, 
//         message: 'Erreur de connexion au serveur' 
//       };
//     }
//   },

//   async resetPassword(token, email, new_password) {
//     try {
//       const response = await fetch(`${API_URL}/auth/reset-password/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           token, 
//           email, 
//           new_password 
//         }),
//       });

//       console.log('🔍 Reset password response status:', response.status);

//       // Gestion spécifique des erreurs 500
//       if (response.status === 500) {
//         console.error('❌ Erreur 500 du serveur');
//         return { 
//           success: false, 
//           message: 'Erreur serveur. Le système de réinitialisation est temporairement indisponible. Veuillez réessayer plus tard ou contacter l\'administrateur.' 
//         };
//       }

//       let data;
//       try {
//         data = await response.json();
//       } catch (jsonError) {
//         console.error('❌ Erreur parsing JSON:', jsonError);
//         // Si la réponse n'est pas du JSON valide (comme une page HTML d'erreur)
//         if (response.status >= 400) {
//           return { 
//             success: false, 
//             message: 'Erreur technique. Veuillez vérifier que votre lien de réinitialisation est encore valide.' 
//           };
//         }
//         throw jsonError;
//       }
      
//       if (response.ok) {
//         return { 
//           success: true, 
//           message: data.message 
//         };
//       } else {
//         return { 
//           success: false, 
//           message: data.message || 'Erreur lors de la réinitialisation du mot de passe' 
//         };
//       }
//     } catch (error) {
//       console.error('❌ Reset password error:', error);
      
//       // Messages d'erreur plus spécifiques
//       if (error.message && error.message.includes('Unexpected token')) {
//         return { 
//           success: false, 
//           message: 'Erreur de communication avec le serveur. Veuillez réessayer.' 
//         };
//       }
      
//       return { 
//         success: false, 
//         message: 'Erreur de connexion au serveur. Vérifiez votre connexion internet.' 
//       };
//     }
//   },

//   // ==================== FONCTIONS UTILITAIRES ====================

//   async getUserProfile() {
//     try {
//       const token = this.getAccessToken();
//       if (!token) return null;

//       const response = await fetch(`${API_URL}/auth/user/`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.ok) {
//         const userData = await response.json();
//         localStorage.setItem('user', JSON.stringify(userData));
//         return userData;
//       }
//       return null;
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//       return null;
//     }
//   },

//   logout() {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('refresh_token');
//     localStorage.removeItem('user');
//     window.location.href = '/login';
//   },

//   getAccessToken() {
//     return localStorage.getItem('access_token');
//   },

//   getCurrentUser() {
//     const userStr = localStorage.getItem('user');
//     return userStr ? JSON.parse(userStr) : null;
//   },

//   isAuthenticated() {
//     return !!this.getAccessToken();
//   },

//   // ==================== REFRESH TOKEN ====================

//   async refreshToken() {
//     try {
//       const refreshToken = localStorage.getItem('refresh_token');
//       if (!refreshToken) {
//         this.logout();
//         return null;
//       }

//       const response = await fetch(`${API_URL}/auth/token/refresh/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ refresh: refreshToken }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         localStorage.setItem('access_token', data.access);
//         return data.access;
//       } else {
//         this.logout();
//         return null;
//       }
//     } catch (error) {
//       console.error('Refresh token error:', error);
//       this.logout();
//       return null;
//     }
//   },

//   // ==================== VÉRIFICATION SANTÉ API ====================

//   async checkAPIHealth() {
//     try {
//       const response = await fetch(`${API_URL}/auth/token/`, {
//         method: 'GET',
//       });
//       return response.status === 401 || response.status === 200;
//     } catch (error) {
//       console.error('API health check failed:', error);
//       return false;
//     }
//   },

//   // ⭐ NOUVELLE FONCTION : Vérifier si le serveur Django est démarré
//   async checkDjangoServer() {
//     try {
//       const response = await fetch(`${API_URL}/auth/token/`, {
//         method: 'GET',
//       });
//       return true;
//     } catch (error) {
//       console.error('❌ Serveur Django non accessible:', error);
//       return false;
//     }
//   }
// };

// // ==================== INTERCEPTEUR POUR REQUÊTES AUTORISÉES ====================
// const authInterceptor = {
//   getAuthHeader() {
//     const token = authService.getAccessToken();
//     return token ? { 'Authorization': `Bearer ${token}` } : {};
//   },

//   async fetchWithAuth(url, options = {}) {
//     const headers = {
//       'Content-Type': 'application/json',
//       ...this.getAuthHeader(),
//       ...options.headers,
//     };

//     try {
//       const response = await fetch(url, { ...options, headers });
      
//       // Si token expiré, essayer de le rafraîchir
//       if (response.status === 401) {
//         const newToken = await authService.refreshToken();
//         if (newToken) {
//           headers['Authorization'] = `Bearer ${newToken}`;
//           return await fetch(url, { ...options, headers });
//         }
//       }
      
//       return response;
//     } catch (error) {
//       console.error('Auth interceptor error:', error);
//       throw error;
//     }
//   }
// };

// // ⭐ CORRECTION CRITIQUE : Exports nommés et par défaut
// export { authService, authInterceptor };
// export default authService;

// src/services/auth.js
const API_URL = 'http://localhost:8000/api';

// ==================== SERVICE D'AUTHENTIFICATION PRINCIPAL ====================
const authService = {
  
  // ==================== FLOW LIEN MAGIQUE ====================
  
  async requestLoginLink(matricule, email) {
    try {
      const response = await fetch(`${API_URL}/auth/request-login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matricule, email }),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, message: data.message, token: data.token };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message || 'Erreur lors de l\'envoi du lien' };
      }
    } catch (error) {
      console.error('Request login link error:', error);
      return { 
        success: false, 
        message: 'Erreur de connexion au serveur' 
      };
    }
  },

  async setupPassword(token, matricule, email, username, password) {
    try {
      const response = await fetch(`${API_URL}/auth/setup-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token, 
          matricule, 
          email, 
          username, 
          password 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return { 
          success: true, 
          message: data.message, 
          username: data.username 
        };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          message: errorData.message || 'Erreur lors de la création du compte' 
        };
      }
    } catch (error) {
      console.error('Setup password error:', error);
      return { 
        success: false, 
        message: 'Erreur de connexion au serveur' 
      };
    }
  },

  // ==================== CONNEXION DIRECTE ====================

  async directLogin(username, password) {
    try {
      const response = await fetch(`${API_URL}/auth/direct-login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Stocker les tokens
        this.setTokens(data.access, data.refresh);
        await this.setUserData(data.user);
        
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Identifiants incorrects');
      }
    } catch (error) {
      console.error('Direct login error:', error);
      throw error;
    }
  },

  // ==================== CONNEXION RAPIDE ====================

  async quickLogin(matricule, password) {
    try {
      console.log('🔐 DEBUG - Tentative de connexion avec:', { matricule, password });
      
      const requestData = {
        username: matricule,
        password: password
      };
      
      console.log('📤 DEBUG - Données envoyées:', requestData);
      
      const response = await fetch(`${API_URL}/auth/quick-login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('📊 DEBUG - Status HTTP:', response.status);

      const data = await response.json();
      console.log('📋 DEBUG - Réponse serveur:', data);

      if (!response.ok) {
        console.error('❌ DEBUG - Erreur serveur:', data);
        
        const error = new Error(data.error || data.message || 'Erreur de connexion');
        error.response = {
          status: response.status,
          data: data
        };
        throw error;
      }

      console.log('✅ DEBUG - Connexion réussie:', data);

      // Stocker les tokens
      if (data.access && data.refresh) {
        this.setTokens(data.access, data.refresh);
        await this.setUserData(data.user);
      }

      return data;
    } catch (error) {
      console.error('❌ DEBUG - ERREUR COMPLÈTE quick login:');
      
      if (error.message) {
        console.error('⚡ Message:', error.message);
      } else {
        console.error('⚡ Message: Aucun message d\'erreur');
      }
      
      console.error('🔢 Code:', error.code);
      console.error('📊 Status:', error.response?.status);
      console.error('📋 Données erreur:', error.response?.data);
      
      throw error;
    }
  },

  // ==================== CONNEXION JWT STANDARD ====================

  async login(username, password) {
    try {
      const response = await fetch(`${API_URL}/auth/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok && response.status === 0) {
        throw new Error('CONNECTION_REFUSED');
      }

      if (response.ok) {
        const data = await response.json();
        
        this.setTokens(data.access, data.refresh);
        await this.getUserProfile();
        
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Identifiants incorrects');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.message === 'CONNECTION_REFUSED' || error.message.includes('Failed to fetch')) {
        throw new Error('❌ Serveur Django non démarré. Vérifiez que le backend est en cours d\'exécution sur le port 8000.');
      }
      
      throw error;
    }
  },

  // ==================== GESTION DES UTILISATEURS (ADMIN) ====================

  async getAllUsers(page = 1, limit = 100) {
    try {
      const token = await this.getValidAccessToken();
      if (!token) {
        throw new Error('Token d\'accès manquant - Veuillez vous reconnecter');
      }

      console.log('🔐 Token utilisé pour la requête:', token.substring(0, 20) + '...');

      const response = await fetch(`${API_URL}/users/?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📊 Status réponse utilisateurs:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Utilisateurs récupérés:', data.length || data.results?.length || 'N/A');
        return Array.isArray(data) ? data : data.results || data.users || [];
      } else {
        console.error('❌ Erreur récupération utilisateurs:', response.status);
        
        if (response.status === 401) {
          await this.refreshToken();
          return await this.getAllUsers(page, limit);
        }
        
        if (response.status === 404) {
          console.log('🔄 Essai endpoint alternatif...');
          return await this.tryAlternativeUserEndpoint();
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || `Erreur ${response.status} lors de la récupération des utilisateurs`);
      }
    } catch (error) {
      console.error('❌ Erreur fetch utilisateurs:', error);
      throw error;
    }
  },

  async createUser(userData) {
    try {
      const token = await this.getValidAccessToken();
      if (!token) {
        throw new Error('Token d\'accès manquant - Veuillez vous reconnecter');
      }

      console.log('📤 Création utilisateur avec token:', token.substring(0, 20) + '...');

      const response = await fetch(`${API_URL}/users/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('📊 Status création utilisateur:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Utilisateur créé:', data);
        return data;
      } else {
        if (response.status === 401) {
          await this.refreshToken();
          return await this.createUser(userData);
        }
        
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Erreur création utilisateur:', errorData);
        
        if (response.status === 404 || response.status === 405) {
          console.log('🔄 Essai endpoint alternatif pour création...');
          return await this.tryAlternativeCreateUser(userData);
        }
        
        throw new Error(errorData.detail || errorData.message || errorData.error || `Erreur ${response.status} lors de la création de l'utilisateur`);
      }
    } catch (error) {
      console.error('❌ Erreur fetch création utilisateur:', error);
      throw error;
    }
  },

  async updateUser(userId, userData) {
    try {
      const token = await this.getValidAccessToken();
      const response = await fetch(`${API_URL}/users/${userId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        if (response.status === 401) {
          await this.refreshToken();
          return await this.updateUser(userId, userData);
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || `Erreur ${response.status} lors de la mise à jour de l'utilisateur`);
      }
    } catch (error) {
      console.error('Erreur mise à jour utilisateur:', error);
      throw error;
    }
  },

  async deleteUser(userId) {
    try {
      const token = await this.getValidAccessToken();
      const response = await fetch(`${API_URL}/users/${userId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        return { success: true, message: 'Utilisateur supprimé avec succès' };
      } else {
        if (response.status === 401) {
          await this.refreshToken();
          return await this.deleteUser(userId);
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || `Erreur ${response.status} lors de la suppression de l'utilisateur`);
      }
    } catch (error) {
      console.error('Erreur suppression utilisateur:', error);
      throw error;
    }
  },

  async updateUserStatus(userId, status) {
    return this.updateUser(userId, { 
      is_active: status === 'active'
    });
  },

  // ==================== GESTION DES TOKENS AMÉLIORÉE ====================

  setTokens(accessToken, refreshToken) {
    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
      console.log('💾 Token d\'accès sauvegardé');
    }
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
      console.log('💾 Token de rafraîchissement sauvegardé');
    }
  },

  async getValidAccessToken() {
    let token = this.getAccessToken();
    
    if (!token) {
      console.log('🔐 Aucun token trouvé, tentative de rafraîchissement...');
      token = await this.refreshToken();
    }
    
    if (!token) {
      console.error('❌ Impossible d\'obtenir un token valide');
      return null;
    }
    
    return token;
  },

  getAccessToken() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('🔐 Aucun token d\'accès en localStorage');
      return null;
    }
    
    // Vérifier si le token est expiré (simplifié)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiration = payload.exp * 1000;
      if (Date.now() >= expiration) {
        console.log('🔐 Token expiré');
        return null;
      }
      return token;
    } catch (error) {
      console.error('❌ Erreur vérification token:', error);
      return token; // Retourner le token même en cas d'erreur de parsing
    }
  },

  async setUserData(user) {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      console.log('💾 Données utilisateur sauvegardées:', user.email);
    }
  },

  // ==================== FONCTIONS UTILITAIRES ====================

  async getUserProfile() {
    try {
      const token = await this.getValidAccessToken();
      if (!token) return null;

      const response = await fetch(`${API_URL}/auth/user/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        await this.setUserData(userData);
        return userData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    console.log('🔒 Déconnexion effectuée');
    window.location.href = '/login';
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      console.log('🔐 Aucun utilisateur en session');
      return null;
    }
    
    try {
      const user = JSON.parse(userStr);
      return user;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  isAuthenticated() {
    const token = this.getAccessToken();
    const isAuth = !!token;
    console.log('🔐 Utilisateur authentifié:', isAuth);
    return isAuth;
  },

  // ==================== PERMISSIONS ADMIN ====================

  checkAdminPermission() {
    const user = this.getCurrentUser();
    if (!user) {
      console.log('🔐 Utilisateur non authentifié');
      return false;
    }
    
    const isAdmin = user.is_staff || user.is_superuser || user.role === 'admin';
    console.log('🔐 Vérification permissions admin:', { 
      user: user.email, 
      is_staff: user.is_staff, 
      is_superuser: user.is_superuser,
      role: user.role,
      isAdmin: isAdmin
    });
    
    return isAdmin;
  },

  isAdmin() {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    return user.is_staff || user.is_superuser || user.role === 'admin';
  },

  // ==================== REFRESH TOKEN AMÉLIORÉ ====================

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        console.log('🔐 Aucun token de rafraîchissement disponible');
        this.logout();
        return null;
      }

      console.log('🔐 Tentative de rafraîchissement du token...');
      const response = await fetch(`${API_URL}/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setTokens(data.access, null); // Garder le même refresh token
        console.log('✅ Token rafraîchi avec succès');
        return data.access;
      } else {
        console.error('❌ Échec rafraîchissement token');
        this.logout();
        return null;
      }
    } catch (error) {
      console.error('Refresh token error:', error);
      this.logout();
      return null;
    }
  },

  // ==================== MÉTHODES DE FALLBACK ====================

  async tryAlternativeUserEndpoint() {
    try {
      const token = await this.getValidAccessToken();
      const endpoints = [
        `${API_URL}/auth/users/`,
        `${API_URL}/admin/users/`,
        `${API_URL}/profiles/`
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log(`✅ Utilisateurs récupérés depuis ${endpoint}`);
            return Array.isArray(data) ? data : data.results || data.users || [];
          }
        } catch (e) {
          console.log(`❌ Échec endpoint ${endpoint}:`, e.message);
          continue;
        }
      }
      
      throw new Error('Aucun endpoint utilisateur disponible');
    } catch (error) {
      console.error('❌ Tous les endpoints ont échoué:', error);
      throw error;
    }
  },

  async tryAlternativeCreateUser(userData) {
    try {
      const token = await this.getValidAccessToken();
      const endpoints = [
        `${API_URL}/auth/register/`,
        `${API_URL}/auth/users/`,
        `${API_URL}/admin/users/`
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          if (response.ok) {
            const data = await response.json();
            console.log(`✅ Utilisateur créé via ${endpoint}`);
            return data;
          }
        } catch (e) {
          console.log(`❌ Échec création via ${endpoint}:`, e.message);
          continue;
        }
      }
      
      throw new Error('Aucun endpoint de création utilisateur disponible');
    } catch (error) {
      console.error('❌ Tous les endpoints de création ont échoué:', error);
      throw error;
    }
  }
};

// ==================== INTERCEPTEUR POUR REQUÊTES AUTORISÉES ====================
const authInterceptor = {
  async getAuthHeader() {
    const token = await authService.getValidAccessToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  async fetchWithAuth(url, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(await this.getAuthHeader()),
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      
      if (response.status === 401) {
        console.log('🔄 Token expiré, tentative de rafraîchissement...');
        const newToken = await authService.refreshToken();
        if (newToken) {
          headers['Authorization'] = `Bearer ${newToken}`;
          return await fetch(url, { ...options, headers });
        } else {
          authService.logout();
          throw new Error('Session expirée');
        }
      }
      
      return response;
    } catch (error) {
      console.error('Auth interceptor error:', error);
      throw error;
    }
  }
};

// ⭐ CORRECTION CRITIQUE : Exports nommés et par défaut
export { authService, authInterceptor };
export default authService;