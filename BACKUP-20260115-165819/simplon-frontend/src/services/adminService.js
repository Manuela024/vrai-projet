// // src/services/adminService.js
// import api from "./api";

// const adminService = {
//   // Vérifier si l'utilisateur est admin
//   async isAdmin() {
//     try {
//       const user = JSON.parse(localStorage.getItem("user") || "null");
//       return !!(user?.is_staff || user?.is_superuser);
//     } catch {
//       return false;
//     }
//   },
  
//   // Statistiques dashboard
//   async getDashboardStats() {
//     try {
//       console.log("📊 Récupération des stats dashboard...");
      
//       // Endpoint spécifique admin
//       const response = await api.get("/admin/stats/");
//       return response.data;
//     } catch (error) {
//       console.error("❌ Erreur stats dashboard:", error);
      
//       // Fallback: récupérer les données séparément
//       return this.getFallbackStats();
//     }
//   },
  
//   // Utilisateurs admin
//   async getUsers(params = {}) {
//     try {
//       console.log("👥 Récupération des utilisateurs admin...");
      
//       const response = await api.get("/admin/users/", { params });
      
//       // Formatage standard DRF
//       if (response.data?.results) {
//         return {
//           users: response.data.results,
//           count: response.data.count,
//           next: response.data.next,
//           previous: response.data.previous
//         };
//       }
      
//       return {
//         users: response.data || [],
//         count: response.data?.length || 0
//       };
//     } catch (error) {
//       console.error("❌ Erreur récupération utilisateurs:", error);
      
//       // Fallback: utilisateurs mockés
//       return {
//         users: this.getMockUsers(),
//         count: 3,
//         error: error.message
//       };
//     }
//   },
  
//   // Projets admin
//   async getAdminProjects(params = {}) {
//     try {
//       console.log("📋 Récupération des projets admin...");
      
//       const response = await api.get("/admin/projects/", { params });
      
//       if (response.data?.results) {
//         return {
//           projects: response.data.results,
//           count: response.data.count
//         };
//       }
      
//       return {
//         projects: response.data || [],
//         count: response.data?.length || 0
//       };
//     } catch (error) {
//       console.error("❌ Erreur projets admin:", error);
//       return {
//         projects: [],
//         count: 0,
//         error: error.message
//       };
//     }
//   },
  
//   // Données fallback (mock)
//   getFallbackStats() {
//     return {
//       success: true,
//       stats: {
//         total_users: 1247,
//         total_projects: 543,
//         total_downloads: 2891,
//         pending_projects: 23,
//         approved_projects: 320,
//         draft_projects: 200,
//         active_users: 1100,
//         inactive_users: 147,
//         staff_users: 15
//       },
//       recent_users: this.getMockUsers().slice(0, 5),
//       recent_projects: this.getMockProjects().slice(0, 5),
//       is_mock: true
//     };
//   },
  
//   getMockUsers() {
//     return [
//       {
//         id: 1,
//         username: 'admin',
//         email: 'admin@simplon.com',
//         first_name: 'Admin',
//         last_name: 'System',
//         is_staff: true,
//         is_superuser: true,
//         is_active: true,
//         date_joined: new Date().toISOString(),
//         last_login: new Date().toISOString()
//       },
//       {
//         id: 2,
//         username: 'simplon_2025001',
//         email: 'alice.martin@simplon.com',
//         first_name: 'Alice',
//         last_name: 'Martin',
//         is_staff: false,
//         is_superuser: false,
//         is_active: true,
//         date_joined: new Date(Date.now() - 86400000).toISOString(),
//         last_login: new Date(Date.now() - 3600000).toISOString()
//       },
//       {
//         id: 3,
//         username: 'simplon_2025002',
//         email: 'bob.dupont@simplon.com',
//         first_name: 'Bob',
//         last_name: 'Dupont',
//         is_staff: false,
//         is_superuser: false,
//         is_active: true,
//         date_joined: new Date(Date.now() - 172800000).toISOString(),
//         last_login: new Date(Date.now() - 7200000).toISOString()
//       }
//     ];
//   },
  
//   getMockProjects() {
//     return [
//       {
//         id: 1,
//         title: 'Application E-commerce React/Node',
//         author: {
//           username: 'simplon_2025001',
//           first_name: 'Alice',
//           last_name: 'Martin'
//         },
//         status: 'published',
//         created_at: new Date().toISOString(),
//         technologies: 'React, Node.js, MongoDB'
//       },
//       {
//         id: 2,
//         title: 'Système de Gestion de Bibliothèque',
//         author: {
//           username: 'simplon_2025002',
//           first_name: 'Bob',
//           last_name: 'Dupont'
//         },
//         status: 'pending',
//         created_at: new Date(Date.now() - 86400000).toISOString(),
//         technologies: 'Django, PostgreSQL'
//       }
//     ];
//   }
// };

// export default adminService;

// src/services/adminService.js - SERVICE ADMIN COMPLET
import api from "./api";

const adminService = {
  // ==================== VÉRIFICATION ADMIN ====================
  
  async isAdmin() {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const token = localStorage.getItem("access_token");
      
      if (!user || !token) {
        console.log("⚠️ Utilisateur non connecté");
        return false;
      }
      
      // Vérifier les flags admin
      const isAdmin = !!(user.is_staff || user.is_superuser || user.isAdmin);
      console.log(`👑 Vérification admin: ${user.username} -> ${isAdmin ? 'ADMIN' : 'USER'}`);
      
      return isAdmin;
      
    } catch (error) {
      console.error("❌ Erreur vérification admin:", error);
      return false;
    }
  },
  
  async verifyAdminAccess() {
    try {
      const isAdmin = await this.isAdmin();
      if (!isAdmin) {
        throw new Error("Accès réservé aux administrateurs");
      }
      
      // Tester l'accès à un endpoint admin
      await api.get("/admin/stats/");
      return true;
      
    } catch (error) {
      console.error("❌ Erreur vérification accès admin:", error);
      throw error;
    }
  },

  // ==================== STATISTIQUES ====================
  
  async getDashboardStats() {
    try {
      console.log("📊 Récupération stats dashboard admin...");
      
      // Vérifier l'accès admin
      await this.verifyAdminAccess();
      
      const response = await api.get("/admin/stats/");
      
      if (response.data?.success === false) {
        throw new Error(response.data.error || "Erreur serveur");
      }
      
      console.log("✅ Stats dashboard récupérées");
      return {
        success: true,
        data: response.data,
        isReal: true
      };
      
    } catch (error) {
      console.error("❌ Erreur récupération stats:", error);
      
      // Fallback avec données mockées
      return {
        success: false,
        data: this.getMockDashboardStats(),
        isMock: true,
        error: error.message
      };
    }
  },
  
  getMockDashboardStats() {
    return {
      success: true,
      stats: {
        total_users: 1247,
        total_projects: 543,
        total_downloads: 2891,
        pending_projects: 23,
        approved_projects: 320,
        draft_projects: 200,
        active_users: 1100,
        inactive_users: 147,
        staff_users: 15,
        superuser_users: 3,
        recent_users: 12
      },
      recent_users: [
        {
          id: 1,
          username: 'admin',
          email: 'admin@simplon.com',
          first_name: 'Admin',
          last_name: 'System',
          date_joined: new Date().toISOString(),
          last_login: new Date().toISOString(),
          is_active: true
        },
        {
          id: 2,
          username: 'simplon_2025001',
          email: 'alice.martin@simplon.com',
          first_name: 'Alice',
          last_name: 'Martin',
          date_joined: new Date(Date.now() - 86400000).toISOString(),
          last_login: new Date(Date.now() - 3600000).toISOString(),
          is_active: true
        },
        {
          id: 3,
          username: 'simplon_2025002',
          email: 'bob.dupont@simplon.com',
          first_name: 'Bob',
          last_name: 'Dupont',
          date_joined: new Date(Date.now() - 172800000).toISOString(),
          last_login: new Date(Date.now() - 7200000).toISOString(),
          is_active: true
        }
      ],
      recent_projects: [
        {
          id: 1,
          title: 'Application E-commerce React/Node',
          author: {
            username: 'simplon_2025001',
            first_name: 'Alice',
            last_name: 'Martin'
          },
          status: 'published',
          created_at: new Date().toISOString(),
          technologies: 'React, Node.js, MongoDB'
        },
        {
          id: 2,
          title: 'Système de Gestion de Bibliothèque',
          author: {
            username: 'simplon_2025002',
            first_name: 'Bob',
            last_name: 'Dupont'
          },
          status: 'pending',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          technologies: 'Django, PostgreSQL'
        }
      ],
      timestamp: new Date().toISOString(),
      is_mock: true
    };
  },

  // ==================== GESTION UTILISATEURS ====================
  
  async getUsers(params = {}) {
    try {
      console.log("👥 Récupération utilisateurs admin...");
      
      await this.verifyAdminAccess();
      
      const response = await api.get("/admin/users/", { params });
      
      // Formatage standard DRF
      const data = response.data;
      
      return {
        success: true,
        users: data.results || data,
        count: data.count || (Array.isArray(data) ? data.length : 0),
        next: data.next,
        previous: data.previous,
        page: data.page || parseInt(params.page) || 1,
        pageSize: data.page_size || parseInt(params.page_size) || 20
      };
      
    } catch (error) {
      console.error("❌ Erreur récupération utilisateurs:", error);
      
      return {
        success: false,
        users: this.getMockUsers(),
        count: 3,
        error: error.message,
        isMock: true
      };
    }
  },
  
  async getUserDetails(userId) {
    try {
      console.log(`🔍 Détails utilisateur ${userId}...`);
      
      await this.verifyAdminAccess();
      
      const response = await api.get(`/admin/users/${userId}/`);
      
      return {
        success: true,
        user: response.data.user || response.data,
        isReal: true
      };
      
    } catch (error) {
      console.error(`❌ Erreur détails utilisateur ${userId}:`, error);
      
      return {
        success: false,
        user: this.getMockUsers().find(u => u.id === userId) || null,
        error: error.message,
        isMock: true
      };
    }
  },
  
  async createUser(userData) {
    try {
      console.log("🆕 Création utilisateur...");
      
      await this.verifyAdminAccess();
      
      const response = await api.post("/admin/users/", userData);
      
      return {
        success: true,
        user: response.data.user || response.data,
        message: response.data.message || "Utilisateur créé avec succès"
      };
      
    } catch (error) {
      console.error("❌ Erreur création utilisateur:", error);
      
      let errorMessage = "Erreur lors de la création";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      return {
        success: false,
        error: errorMessage,
        details: error.response?.data
      };
    }
  },
  
  async updateUser(userId, userData) {
    try {
      console.log(`✏️ Mise à jour utilisateur ${userId}...`);
      
      await this.verifyAdminAccess();
      
      const response = await api.put(`/admin/users/${userId}/`, userData);
      
      return {
        success: true,
        user: response.data.user || response.data,
        message: response.data.message || "Utilisateur mis à jour"
      };
      
    } catch (error) {
      console.error(`❌ Erreur mise à jour utilisateur ${userId}:`, error);
      
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  },
  
  async deleteUser(userId) {
    try {
      console.log(`🗑️ Suppression utilisateur ${userId}...`);
      
      await this.verifyAdminAccess();
      
      const response = await api.delete(`/admin/users/${userId}/`);
      
      return {
        success: true,
        message: response.data?.message || "Utilisateur supprimé"
      };
      
    } catch (error) {
      console.error(`❌ Erreur suppression utilisateur ${userId}:`, error);
      
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  },
  
  async toggleUserStatus(userId, currentStatus) {
    try {
      console.log(`🔀 Changement statut utilisateur ${userId}...`);
      
      await this.verifyAdminAccess();
      
      const response = await api.put(`/admin/users/${userId}/`, {
        is_active: !currentStatus
      });
      
      return {
        success: true,
        user: response.data.user || response.data,
        message: `Utilisateur ${!currentStatus ? 'activé' : 'désactivé'}`
      };
      
    } catch (error) {
      console.error(`❌ Erreur changement statut ${userId}:`, error);
      
      return {
        success: false,
        error: error.message
      };
    }
  },

  // ==================== GESTION PROJETS ADMIN ====================
  
  async getAdminProjects(params = {}) {
    try {
      console.log("📋 Récupération projets admin...");
      
      await this.verifyAdminAccess();
      
      const response = await api.get("/admin/projects/", { params });
      
      return {
        success: true,
        projects: response.data.results || response.data,
        count: response.data.count || (Array.isArray(response.data) ? response.data.length : 0),
        next: response.data.next,
        previous: response.data.previous
      };
      
    } catch (error) {
      console.error("❌ Erreur récupération projets admin:", error);
      
      return {
        success: false,
        projects: this.getMockProjects(),
        count: 2,
        error: error.message,
        isMock: true
      };
    }
  },
  
  async getAdminProjectDetails(projectId) {
    try {
      console.log(`🔍 Détails projet admin ${projectId}...`);
      
      await this.verifyAdminAccess();
      
      const response = await api.get(`/admin/projects/${projectId}/`);
      
      return {
        success: true,
        project: response.data.project || response.data,
        isReal: true
      };
      
    } catch (error) {
      console.error(`❌ Erreur détails projet admin ${projectId}:`, error);
      
      return {
        success: false,
        project: null,
        error: error.message
      };
    }
  },
  
  async updateProjectStatus(projectId, status) {
    try {
      console.log(`🔄 Changement statut projet ${projectId} -> ${status}`);
      
      await this.verifyAdminAccess();
      
      const response = await api.put(`/admin/projects/${projectId}/`, {
        status: status
      });
      
      return {
        success: true,
        message: response.data?.message || "Statut mis à jour"
      };
      
    } catch (error) {
      console.error(`❌ Erreur changement statut projet ${projectId}:`, error);
      
      return {
        success: false,
        error: error.message
      };
    }
  },

  // ==================== DONNÉES MOCKÉES ====================
  
  getMockUsers() {
    return [
      {
        id: 1,
        username: 'admin',
        email: 'admin@simplon.com',
        first_name: 'Admin',
        last_name: 'System',
        is_active: true,
        is_staff: true,
        is_superuser: true,
        date_joined: new Date().toISOString(),
        last_login: new Date().toISOString(),
        projects_count: 5,
        groups: [],
        user_permissions: []
      },
      {
        id: 2,
        username: 'simplon_2025001',
        email: 'alice.martin@simplon.com',
        first_name: 'Alice',
        last_name: 'Martin',
        is_active: true,
        is_staff: false,
        is_superuser: false,
        date_joined: new Date(Date.now() - 86400000).toISOString(),
        last_login: new Date(Date.now() - 3600000).toISOString(),
        projects_count: 3,
        groups: ['students'],
        user_permissions: []
      },
      {
        id: 3,
        username: 'simplon_2025002',
        email: 'bob.dupont@simplon.com',
        first_name: 'Bob',
        last_name: 'Dupont',
        is_active: true,
        is_staff: false,
        is_superuser: false,
        date_joined: new Date(Date.now() - 172800000).toISOString(),
        last_login: new Date(Date.now() - 7200000).toISOString(),
        projects_count: 2,
        groups: ['students'],
        user_permissions: []
      }
    ];
  },
  
  getMockProjects() {
    return [
      {
        id: 1,
        title: 'Application E-commerce React/Node',
        description: 'Plateforme e-commerce complète',
        technologies: 'React, Node.js, MongoDB',
        status: 'published',
        github_url: 'https://github.com/demo/ecommerce',
        demo_url: 'https://demo-ecommerce.vercel.app',
        author: {
          id: 2,
          username: 'simplon_2025001',
          email: 'alice.martin@simplon.com'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        download_count: 45
      },
      {
        id: 2,
        title: 'Système de Gestion de Bibliothèque',
        description: 'Application de gestion de bibliothèque',
        technologies: 'Django, PostgreSQL',
        status: 'pending',
        github_url: 'https://github.com/demo/library',
        demo_url: 'https://library-demo.vercel.app',
        author: {
          id: 3,
          username: 'simplon_2025002',
          email: 'bob.dupont@simplon.com'
        },
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 43200000).toISOString(),
        download_count: 23
      }
    ];
  },

  // ==================== UTILITAIRES ====================
  
  formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date invalide';
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  },
  
  getStatusColor(status) {
    const colors = {
      'published': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      'draft': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
      'archived': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  },
  
  getStatusText(status) {
    const texts = {
      'published': 'Publié',
      'pending': 'En attente',
      'draft': 'Brouillon',
      'archived': 'Archivé'
    };
    return texts[status] || status;
  }
};

export default adminService;