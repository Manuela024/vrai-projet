// src/services/admin.js
import api from './api';

const adminService = {
  async getDashboardStats() {
    try {
      console.log('📊 Tentative de récupération des statistiques admin...');
      const response = await api.get('/admin/stats/');
      console.log('✅ Statistiques récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur récupération stats:', error);
      // Données mockées temporaires
      return {
        total_users: 1247,
        total_projects: 543,
        approved_projects: 320,
        pending_projects: 23,
        total_downloads: 2891
      };
    }
  },

  async getRecentUsers() {
    try {
      console.log('👤 Tentative de récupération des utilisateurs récents...');
      const response = await api.get('/admin/users/?limit=5');
      console.log('✅ Utilisateurs récupérés:', response.data?.length || 0);
      return response.data || [];
    } catch (error) {
      console.warn('⚠️ Erreur récupération utilisateurs:', error);
      return [
        {
          id: 1,
          username: 'admin',
          email: 'admin@simplon.com',
          first_name: 'Admin',
          last_name: 'Simplon',
          is_staff: true,
          is_superuser: true,
          date_joined: new Date().toISOString()
        },
        {
          id: 2,
          username: 'teacher1',
          email: 'teacher@simplon.com',
          first_name: 'Marie',
          last_name: 'Curie',
          is_staff: true,
          is_superuser: false,
          date_joined: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 3,
          username: 'student1',
          email: 'student@simplon.com',
          first_name: 'Jean',
          last_name: 'Dupont',
          is_staff: false,
          is_superuser: false,
          date_joined: new Date(Date.now() - 172800000).toISOString()
        }
      ];
    }
  },

  async getRecentProjects() {
    try {
      console.log('📁 Tentative de récupération des projets récents...');
      const response = await api.get('/admin/projects/?limit=5');
      console.log('✅ Projets récupérés:', response.data?.length || 0);
      return response.data || [];
    } catch (error) {
      console.warn('⚠️ Erreur récupération projets:', error);
      return [
        {
          id: 1,
          title: 'Application E-commerce avec React',
          description: 'Un projet complet de boutique en ligne',
          status: 'published',
          author: { username: 'jeandupont', email: 'jean@simplon.com' },
          created_at: new Date(Date.now() - 3600000).toISOString(),
          download_count: 45
        },
        {
          id: 2,
          title: 'API REST avec Django REST Framework',
          description: 'Backend pour application mobile',
          status: 'pending',
          author: { username: 'mariedurand', email: 'marie@simplon.com' },
          created_at: new Date(Date.now() - 7200000).toISOString(),
          download_count: 32
        },
        {
          id: 3,
          title: 'Système de réservation en ligne',
          description: 'Gestion de rendez-vous',
          status: 'published',
          author: { username: 'pierremartin', email: 'pierre@simplon.com' },
          created_at: new Date(Date.now() - 10800000).toISOString(),
          download_count: 28
        }
      ];
    }
  },

  async getRecentActivity() {
    console.log('📝 Récupération activité récente (mock)...');
    // Données mockées
    return [
      {
        id: 1,
        type: 'project',
        user: 'Jean Dupont',
        action: 'a déposé un nouveau projet',
        project: 'Application E-commerce',
        time: 'Il y a 2 heures'
      },
      {
        id: 2,
        type: 'moderation',
        user: 'Admin',
        action: 'a validé le projet',
        project: 'Système de Gestion',
        time: 'Il y a 4 heures'
      },
      {
        id: 3,
        type: 'user',
        user: 'Marie Curie',
        action: 's\'est inscrite sur la plateforme',
        time: 'Il y a 6 heures'
      },
      {
        id: 4,
        type: 'download',
        user: 'Pierre Martin',
        action: 'a téléchargé le projet',
        project: 'API REST Django',
        time: 'Il y a 1 jour'
      },
      {
        id: 5,
        type: 'update',
        user: 'Admin',
        action: 'a mis à jour les permissions',
        time: 'Il y a 2 jours'
      }
    ];
  },

  async getTopProjects() {
    console.log('🏆 Récupération projets populaires (mock)...');
    // Données mockées
    return [
      {
        id: 1,
        title: 'Application E-commerce React/Node',
        author_name: 'Jean Dupont',
        technologies: 'React, Node.js, MongoDB',
        download_count: 245
      },
      {
        id: 2,
        title: 'Système de Gestion de Projets',
        author_name: 'Marie Curie',
        technologies: 'Django, PostgreSQL',
        download_count: 189
      },
      {
        id: 3,
        title: 'API REST avec Django REST Framework',
        author_name: 'Pierre Martin',
        technologies: 'Django, Django REST',
        download_count: 156
      }
    ];
  },

  // Pour compatibilité avec l'ancien code
  async getTotalUsers() {
    const stats = await this.getDashboardStats();
    return { total: stats.total_users, count: stats.total_users };
  },

  async getTotalProjects() {
    const stats = await this.getDashboardStats();
    return { total: stats.total_projects, count: stats.total_projects };
  },

  async getTotalDownloads() {
    const stats = await this.getDashboardStats();
    return { total: stats.total_downloads, count: stats.total_downloads };
  },

  async getPendingProjects() {
    const stats = await this.getDashboardStats();
    return { pending: stats.pending_projects, count: stats.pending_projects };
  }
};

export default adminService;