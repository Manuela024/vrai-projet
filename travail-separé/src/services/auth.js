// travail-separé\src\services\auth.js
// SERVICE D'AUTHENTIFICATION ADAPTÉ À VOTRE API
const API_URL = 'http://localhost:8000';

const authService = {
  endpoints: {
    // BASÉ SUR VOTRE STRUCTURE - À ADAPTER SI BESOIN
    login: `${API_URL}/api/users/auth/login/`,
    register: `${API_URL}/api/users/auth/register/`,
    currentUser: `${API_URL}/api/users/auth/me/`,
    logout: `${API_URL}/api/users/auth/logout/`,
    checkMatricule: `${API_URL}/api/users/check-matricule/`,
    forgotPassword: `${API_URL}/api/users/auth/forgot-password/`,
    resetPassword: `${API_URL}/api/users/auth/reset-password/`,
  },
  
  // VÉRIFICATION DE L'API
  async checkAPI() {
    try {
      const response = await fetch(`${API_URL}/api/health/`, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok;
    } catch {
      return false;
    }
  },
  
  // CONNEXION GÉNÉRIQUE
  async login(identifier, password) {
    try {
      console.log(`🔐 Tentative de connexion: ${identifier}`);
      
      // ESSAI 1: Format standard
      const response = await fetch(this.endpoints.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier,
          password: password
        })
      });
      
      // SI ÉCHEC, ESSAI 2: Avec username
      if (!response.ok) {
        const response2 = await fetch(this.endpoints.login, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: identifier,
            password: password
          })
        });
        
        if (response2.ok) {
          return this._handleLoginSuccess(await response2.json());
        }
      } else {
        return this._handleLoginSuccess(await response.json());
      }
      
      return {
        success: false,
        message: 'Identifiants incorrects'
      };
      
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      return {
        success: false,
        message: 'Erreur de connexion au serveur'
      };
    }
  },
  
  // TRAITEMENT RÉUSSITE
  _handleLoginSuccess(data) {
    // Stockage selon votre structure
    if (data.access || data.token) {
      localStorage.setItem('access_token', data.access || data.token);
    }
    if (data.refresh) {
      localStorage.setItem('refresh_token', data.refresh);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('user_id', data.user.id);
      localStorage.setItem('user_role', data.user.is_staff ? 'admin' : 'user');
    }
    
    console.log(`✅ Connexion réussie pour: ${data.user?.username || 'utilisateur'}`);
    return {
      success: true,
      user: data.user,
      token: data.access || data.token,
      message: 'Connexion réussie'
    };
  },
  
  // GETTERS SÛRS
  getAccessToken() {
    return localStorage.getItem('access_token');
  },
  
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },
  
  isAuthenticated() {
    return !!this.getAccessToken();
  },
  
  isAdmin() {
    const user = this.getCurrentUser();
    return user && (user.is_staff || user.is_superuser);
  },
  
  // DÉCONNEXION SÛRE
  logout() {
    const items = [
      'access_token', 'refresh_token', 'user',
      'user_id', 'user_role', 'user_email',
      'user_username', 'user_first_name', 'user_last_name'
    ];
    
    items.forEach(item => localStorage.removeItem(item));
    console.log('✅ Déconnexion effectuée');
  }
};

export default authService;