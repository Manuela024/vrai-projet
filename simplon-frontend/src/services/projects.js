

// // src/services/projects.js
// import api from './api';

// export const projectService = {
//   // Récupérer tous les projets (publics)
//   async getAllProjects() {
//     try {
//       const response = await api.get('/projects/');
//       console.log('✅ Tous les projets récupérés:', response.data.length);
//       return response.data;
//     } catch (error) {
//       console.error('❌ Erreur /projects/:', error.response?.data);
//       return this.getMockProjects();
//     }
//   },

//   // Récupérer les projets de l'utilisateur connecté
//   async getUserProjects() {
//     try {
//       const response = await api.get('/projects/my-projects/', {
//         withCredentials: true,
//       });
//       console.log('✅ Projets utilisateur récupérés:', response.data.length);
//       return response.data;
//     } catch (error) {
//       console.error('❌ Erreur my-projects:', error.response?.data);
      
//       if (error.response?.status === 401) {
//         console.log('🔐 Non authentifié - redirection vers login');
//       }
      
//       try {
//         console.log('🔄 Fallback: utilisation de getAllProjects');
//         return await this.getAllProjects();
//       } catch (fallbackError) {
//         console.error('❌ Tous les fallbacks ont échoué');
//         return this.getMockProjects();
//       }
//     }
//   },

//   async getProjectById(id) {
//     try {
//       const response = await api.get(`/projects/${id}/`);
//       return response.data;
//     } catch (error) {
//       console.error('❌ Erreur getProjectById:', error);
//       return this.getMockProject(id);
//     }
//   },

//   async createProject(projectData) {
//     try {
//       console.log('🎯 Données envoyées à l\'API:', projectData);
      
//       const response = await api.post('/projects/', projectData, {
//         withCredentials: true,
//       });
      
//       console.log('✅ Projet créé avec succès:', response.data);
      
//       // ⭐⭐ CORRECTION : Gestion robuste de l'ID
//       if (response.data && response.data.id) {
//         console.log('🆔 ID du projet créé:', response.data.id);
//         return response.data;
//       } else {
//         console.warn('⚠️ Aucun ID dans la réponse:', response.data);
//         // Essaie de trouver l'ID dans différentes propriétés possibles
//         const projectId = response.data.id || response.data.pk || response.data.project_id;
//         if (projectId) {
//           console.log('🆔 ID trouvé dans autre propriété:', projectId);
//           return { ...response.data, id: projectId };
//         }
//         // Si toujours pas d'ID, crée un ID temporaire
//         const tempId = Date.now();
//         console.log('🆔 ID temporaire généré:', tempId);
//         return { ...response.data, id: tempId };
//       }
      
//     } catch (error) {
//       console.error('❌ ERREUR DÉTAILLÉE création projet:');
      
//       if (error.response) {
//         console.log('📊 Status:', error.response.status);
//         console.log('📋 Données erreur:', error.response.data);
        
//         if (error.response.data) {
//           console.log('🚨 ERREURS DE VALIDATION:');
//           for (const [field, errors] of Object.entries(error.response.data)) {
//             console.log(`   ${field}:`, errors);
//           }
//         }
//       } else if (error.request) {
//         console.log('🌐 Pas de réponse du serveur:', error.request);
//       } else {
//         console.log('⚡ Erreur config:', error.message);
//       }
      
//       throw error;
//     }
//   },

//   async updateProject(id, projectData) {
//     try {
//       console.log('🎯 DEBUG - Mise à jour projet:', id, projectData);
      
//       const response = await api.patch(`/projects/${id}/`, projectData, {
//         withCredentials: true,
//       });
      
//       console.log('✅ DEBUG - Projet mis à jour:', response.data);
//       return response.data;
      
//     } catch (error) {
//       console.error('❌ DEBUG - Erreur mise à jour projet:');
      
//       if (error.response) {
//         console.log('📊 Status:', error.response.status);
//         console.log('📋 Données erreur:', error.response.data);
//       }
      
//       throw error;
//     }
//   },

//   async uploadProjectFile(projectId, file) {
//     try {
//       console.log('📤 DEBUG - Upload fichier pour projet:', projectId);
      
//       // ⭐⭐ CORRECTION : Validation de l'ID
//       if (!projectId || projectId === 'undefined') {
//         throw new Error(`ID de projet invalide: ${projectId}`);
//       }
      
//       const formData = new FormData();
//       formData.append('file', file);
      
//       const response = await api.post(`/projects/${projectId}/upload/`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         withCredentials: true,
//       });
      
//       console.log('✅ DEBUG - Fichier uploadé:', response.data);
//       return response.data;
      
//     } catch (error) {
//       console.error('❌ DEBUG - Erreur upload fichier:');
//       console.error('📋 Détails:', error.response?.data);
//       throw error;
//     }
//   },

//   async deleteProject(id) {
//     try {
//       const response = await api.delete(`/projects/${id}/`, {
//         withCredentials: true,
//       });
//       return response.data;
//     } catch (error) {
//       console.error('❌ Erreur suppression projet:', error);
//       return { success: true, message: 'Projet supprimé (mock)' };
//     }
//   },

//   // Méthodes mockées pour le fallback
//   getMockProjects() {
//     console.log('🔄 Utilisation des données mockées');
//     return [
//       {
//         id: 1,
//         title: "Portfolio en React",
//         status: "published",
//         technologies: "React, Tailwind CSS, Node.js",
//         description: "Un portfolio personnel développé avec React",
//         cohort: "DWWM - Mars 2024",
//         tags: "portfolio, web, react",
//         created_at: "2024-01-15T10:00:00Z",
//         author: 1,
//         author_name: "Utilisateur Demo",
//         download_count: 5,
//         view_count: 25
//       },
//       {
//         id: 2,
//         title: "API E-commerce",
//         status: "draft", 
//         technologies: "Django, PostgreSQL, REST",
//         description: "API backend pour un site e-commerce",
//         cohort: "CDA - Janvier 2024",
//         tags: "api, ecommerce, backend",
//         created_at: "2024-01-10T14:30:00Z",
//         author: 1,
//         author_name: "Utilisateur Demo",
//         download_count: 3,
//         view_count: 18
//       }
//     ];
//   },

//   getMockProject(id, projectData = {}) {
//     return {
//       id: id,
//       title: projectData.title || "Projet de démonstration",
//       status: projectData.status || "published",
//       technologies: projectData.technologies || "React, Django",
//       description: projectData.description || "Ceci est un projet de démonstration",
//       cohort: projectData.cohort || "DWWM - Mars 2024",
//       tags: projectData.tags || "portfolio, web",
//       created_at: new Date().toISOString(),
//       author: 1,
//       author_name: "Utilisateur Demo",
//       download_count: 0,
//       view_count: 0,
//       ...projectData
//     };
//   }
// };


// src/services/projects.js
import api from './api';

export const projectService = {
  // ==================== MÉTHODES EXISTANTES ====================

  // Récupérer tous les projets (publics)
  async getAllProjects() {
    try {
      const response = await api.get('/projects/');
      console.log('✅ Tous les projets récupérés:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur /projects/:', error.response?.data);
      return this.getMockProjects();
    }
  },

  // Récupérer les projets de l'utilisateur connecté
  async getUserProjects() {
    try {
      const response = await api.get('/projects/my-projects/', {
        withCredentials: true,
      });
      console.log('✅ Projets utilisateur récupérés:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur my-projects:', error.response?.data);
      
      if (error.response?.status === 401) {
        console.log('🔐 Non authentifié - redirection vers login');
      }
      
      try {
        console.log('🔄 Fallback: utilisation de getAllProjects');
        return await this.getAllProjects();
      } catch (fallbackError) {
        console.error('❌ Tous les fallbacks ont échoué');
        return this.getMockProjects();
      }
    }
  },

  async getProjectById(id) {
    try {
      const response = await api.get(`/projects/${id}/`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur getProjectById:', error);
      return this.getMockProject(id);
    }
  },

  async createProject(projectData) {
    try {
      console.log('🎯 Données envoyées à l\'API:', projectData);
      
      const response = await api.post('/projects/', projectData, {
        withCredentials: true,
      });
      
      console.log('✅ Projet créé avec succès:', response.data);
      
      // ⭐⭐ CORRECTION : Gestion robuste de l'ID
      if (response.data && response.data.id) {
        console.log('🆔 ID du projet créé:', response.data.id);
        return response.data;
      } else {
        console.warn('⚠️ Aucun ID dans la réponse:', response.data);
        // Essaie de trouver l'ID dans différentes propriétés possibles
        const projectId = response.data.id || response.data.pk || response.data.project_id;
        if (projectId) {
          console.log('🆔 ID trouvé dans autre propriété:', projectId);
          return { ...response.data, id: projectId };
        }
        // Si toujours pas d'ID, crée un ID temporaire
        const tempId = Date.now();
        console.log('🆔 ID temporaire généré:', tempId);
        return { ...response.data, id: tempId };
      }
      
    } catch (error) {
      console.error('❌ ERREUR DÉTAILLÉE création projet:');
      
      if (error.response) {
        console.log('📊 Status:', error.response.status);
        console.log('📋 Données erreur:', error.response.data);
        
        if (error.response.data) {
          console.log('🚨 ERREURS DE VALIDATION:');
          for (const [field, errors] of Object.entries(error.response.data)) {
            console.log(`   ${field}:`, errors);
          }
        }
      } else if (error.request) {
        console.log('🌐 Pas de réponse du serveur:', error.request);
      } else {
        console.log('⚡ Erreur config:', error.message);
      }
      
      throw error;
    }
  },

  async updateProject(id, projectData) {
    try {
      console.log('🎯 DEBUG - Mise à jour projet:', id, projectData);
      
      const response = await api.patch(`/projects/${id}/`, projectData, {
        withCredentials: true,
      });
      
      console.log('✅ DEBUG - Projet mis à jour:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ DEBUG - Erreur mise à jour projet:');
      
      if (error.response) {
        console.log('📊 Status:', error.response.status);
        console.log('📋 Données erreur:', error.response.data);
      }
      
      throw error;
    }
  },

  async uploadProjectFile(projectId, file) {
    try {
      console.log('📤 DEBUG - Upload fichier pour projet:', projectId);
      
      // ⭐⭐ CORRECTION : Validation de l'ID
      if (!projectId || projectId === 'undefined') {
        throw new Error(`ID de projet invalide: ${projectId}`);
      }
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post(`/projects/${projectId}/upload/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      
      console.log('✅ DEBUG - Fichier uploadé:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ DEBUG - Erreur upload fichier:');
      console.error('📋 Détails:', error.response?.data);
      throw error;
    }
  },

  async deleteProject(id) {
    try {
      const response = await api.delete(`/projects/${id}/`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur suppression projet:', error);
      return { success: true, message: 'Projet supprimé (mock)' };
    }
  },

  // ==================== NOUVELLES MÉTHODES POUR ADMIN DASHBOARD ====================
  
  // Récupérer les statistiques des projets pour l'admin
  async getProjectStats() {
    try {
      const response = await api.get('/projects/stats/');
      console.log('✅ Statistiques projets récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur stats projets:', error.response?.data);
      // Fallback avec des données mockées
      return this.getMockProjectStats();
    }
  },

  // Récupérer le nombre total de projets
  async getTotalProjects() {
    try {
      const response = await api.get('/projects/count/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur count projets:', error);
      return { total: 543, count: 543 }; // Fallback mock
    }
  },

  // Récupérer le nombre total de téléchargements
  async getTotalDownloads() {
    try {
      const response = await api.get('/projects/downloads/count/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur count téléchargements:', error);
      return { total: 2891, count: 2891 }; // Fallback mock
    }
  },

  // Récupérer les projets en attente de modération
  async getPendingProjects() {
    try {
      const response = await api.get('/projects/?status=pending');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur projets en attente:', error);
      return []; // Fallback tableau vide
    }
  },

  // Récupérer l'activité récente
  async getRecentActivity() {
    try {
      const response = await api.get('/activity/recent/');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur activité récente:', error);
      return this.getMockRecentActivity();
    }
  },

  // Récupérer les projets les plus téléchargés
  async getTopDownloadedProjects(limit = 5) {
    try {
      const response = await api.get(`/projects/top-downloaded/?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur projets populaires:', error);
      return this.getMockTopProjects();
    }
  },

  // Récupérer les projets par statut (pour admin)
  async getProjectsByStatus(status) {
    try {
      const response = await api.get(`/projects/?status=${status}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Erreur projets ${status}:`, error);
      return this.getMockProjects().filter(project => project.status === status);
    }
  },

  // Modérer un projet (approuver/rejeter)
  async moderateProject(projectId, action, reason = '') {
    try {
      const response = await api.post(`/projects/${projectId}/moderate/`, {
        action: action, // 'approve' ou 'reject'
        reason: reason
      });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur modération projet:', error);
      throw error;
    }
  },

  // ==================== MÉTHODES MOCKÉES POUR FALLBACK ====================

  getMockProjects() {
    console.log('🔄 Utilisation des données mockées');
    return [
      {
        id: 1,
        title: "Portfolio en React",
        status: "published",
        technologies: "React, Tailwind CSS, Node.js",
        description: "Un portfolio personnel développé avec React",
        cohort: "DWWM - Mars 2024",
        tags: "portfolio, web, react",
        created_at: "2024-01-15T10:00:00Z",
        author: 1,
        author_name: "Utilisateur Demo",
        download_count: 5,
        view_count: 25,
        file_url: "/files/portfolio-react.zip",
        thumbnail_url: "/thumbnails/portfolio-react.jpg"
      },
      {
        id: 2,
        title: "API E-commerce",
        status: "draft", 
        technologies: "Django, PostgreSQL, REST",
        description: "API backend pour un site e-commerce",
        cohort: "CDA - Janvier 2024",
        tags: "api, ecommerce, backend",
        created_at: "2024-01-10T14:30:00Z",
        author: 1,
        author_name: "Utilisateur Demo",
        download_count: 3,
        view_count: 18,
        file_url: "/files/api-ecommerce.zip",
        thumbnail_url: "/thumbnails/api-ecommerce.jpg"
      },
      {
        id: 3,
        title: "Application Mobile de Gestion de Tâches",
        status: "pending",
        technologies: "React Native, Firebase, Redux",
        description: "Application mobile de gestion de tâches avec synchronisation en temps réel",
        cohort: "DWWM - Avril 2024",
        tags: "mobile, react-native, firebase, tasks",
        created_at: "2024-01-20T09:15:00Z",
        author: 2,
        author_name: "Marie Martin",
        download_count: 0,
        view_count: 12,
        file_url: "/files/task-mobile-app.zip",
        thumbnail_url: "/thumbnails/task-app.jpg"
      },
      {
        id: 4,
        title: "Site Vitrine pour Restaurant",
        status: "published",
        technologies: "HTML, CSS, JavaScript, PHP",
        description: "Site vitrine responsive pour un restaurant avec système de réservation",
        cohort: "DWWM - Février 2024",
        tags: "restaurant, responsive, php, reservation",
        created_at: "2024-01-18T16:45:00Z",
        author: 3,
        author_name: "Pierre Lambert",
        download_count: 8,
        view_count: 32,
        file_url: "/files/restaurant-site.zip",
        thumbnail_url: "/thumbnails/restaurant-site.jpg"
      }
    ];
  },

  getMockProject(id, projectData = {}) {
    return {
      id: id,
      title: projectData.title || "Projet de démonstration",
      status: projectData.status || "published",
      technologies: projectData.technologies || "React, Django",
      description: projectData.description || "Ceci est un projet de démonstration",
      cohort: projectData.cohort || "DWWM - Mars 2024",
      tags: projectData.tags || "portfolio, web",
      created_at: new Date().toISOString(),
      author: 1,
      author_name: "Utilisateur Demo",
      download_count: 0,
      view_count: 0,
      file_url: projectData.file_url || "/files/demo-project.zip",
      thumbnail_url: projectData.thumbnail_url || "/thumbnails/demo-project.jpg",
      ...projectData
    };
  },

  getMockProjectStats() {
    console.log('🔄 Utilisation des stats mockées');
    return {
      total_projects: 543,
      total_downloads: 2891,
      projects_by_status: {
        published: 520,
        pending: 23,
        draft: 15,
        rejected: 5
      },
      downloads_by_month: [
        { month: 'Jan', downloads: 245 },
        { month: 'Fév', downloads: 312 },
        { month: 'Mar', downloads: 289 },
        { month: 'Avr', downloads: 356 },
        { month: 'Mai', downloads: 421 },
        { month: 'Juin', downloads: 389 }
      ],
      projects_by_technology: {
        'React': 156,
        'Django': 89,
        'Vue.js': 67,
        'Laravel': 54,
        'Node.js': 43,
        'Flask': 32,
        'Autres': 102
      }
    };
  },

  getMockRecentActivity() {
    return [
      {
        id: 1,
        user: 'Jean Dupont',
        action: 'a déposé un projet',
        project: 'Site E-commerce React',
        time: 'Il y a 5 min',
        type: 'project',
        avatar: '/avatars/user1.jpg'
      },
      {
        id: 2,
        user: 'Marie Martin', 
        action: 's\'est inscrite',
        time: 'Il y a 15 min',
        type: 'user',
        avatar: '/avatars/user2.jpg'
      },
      {
        id: 3,
        user: 'Admin System',
        action: 'a approuvé un projet',
        project: 'App TaskMaster',
        time: 'Il y a 1 heure',
        type: 'moderation',
        avatar: '/avatars/admin.jpg'
      },
      {
        id: 4,
        user: 'Pierre Lambert',
        action: 'a téléchargé',
        project: 'API REST Django',
        time: 'Il y a 2 heures',
        type: 'download',
        avatar: '/avatars/user3.jpg'
      },
      {
        id: 5,
        user: 'Sophie Chen',
        action: 'a mis à jour son projet',
        project: 'Portfolio Creative',
        time: 'Il y a 3 heures',
        type: 'update',
        avatar: '/avatars/user4.jpg'
      },
      {
        id: 6,
        user: 'Thomas Bernard',
        action: 'a commenté',
        project: 'Site E-commerce React',
        time: 'Il y a 4 heures',
        type: 'comment',
        avatar: '/avatars/user5.jpg'
      }
    ];
  },

  getMockTopProjects() {
    return [
      {
        id: 1,
        title: "Portfolio React Modern",
        download_count: 156,
        author_name: "Jean Dupont",
        technologies: "React, Tailwind, Framer Motion",
        description: "Portfolio moderne avec animations fluides et design responsive",
        status: "published",
        created_at: "2024-01-10T10:00:00Z"
      },
      {
        id: 2,
        title: "API E-commerce Django",
        download_count: 134,
        author_name: "Marie Martin",
        technologies: "Django, Django REST, PostgreSQL",
        description: "API complète pour site e-commerce avec gestion des commandes",
        status: "published",
        created_at: "2024-01-08T14:30:00Z"
      },
      {
        id: 3,
        title: "App Mobile React Native",
        download_count: 98,
        author_name: "Pierre Lambert",
        technologies: "React Native, Expo, Firebase",
        description: "Application mobile de gestion de tâches avec authentification",
        status: "published",
        created_at: "2024-01-05T09:15:00Z"
      },
      {
        id: 4,
        title: "Dashboard Admin Vue.js",
        download_count: 87,
        author_name: "Sophie Chen",
        technologies: "Vue.js, Vuex, Chart.js",
        description: "Tableau de bord administratif avec graphiques et statistiques",
        status: "published",
        created_at: "2024-01-03T16:20:00Z"
      },
      {
        id: 5,
        title: "CMS Laravel",
        download_count: 76,
        author_name: "Thomas Bernard",
        technologies: "Laravel, MySQL, Blade",
        description: "Système de gestion de contenu avec interface d'administration",
        status: "published",
        created_at: "2024-01-01T11:45:00Z"
      }
    ];
  },

  // ==================== MÉTHODES UTILITAIRES ====================

  // Formater les données de projet pour l'affichage
  formatProjectForDisplay(project) {
    return {
      ...project,
      formatted_date: new Date(project.created_at).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      short_description: project.description.length > 100 
        ? project.description.substring(0, 100) + '...' 
        : project.description,
      technologies_array: project.technologies ? project.technologies.split(',').map(tech => tech.trim()) : [],
      tags_array: project.tags ? project.tags.split(',').map(tag => tag.trim()) : []
    };
  },

  // Valider les données d'un projet avant création/mise à jour
  validateProjectData(projectData) {
    const errors = [];

    if (!projectData.title || projectData.title.trim().length < 3) {
      errors.push('Le titre doit contenir au moins 3 caractères');
    }

    if (!projectData.description || projectData.description.trim().length < 10) {
      errors.push('La description doit contenir au moins 10 caractères');
    }

    if (!projectData.technologies || projectData.technologies.trim().length === 0) {
      errors.push('Les technologies sont requises');
    }

    if (!projectData.cohort || projectData.cohort.trim().length === 0) {
      errors.push('La cohorte est requise');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  },

  // Rechercher des projets
  async searchProjects(query, filters = {}) {
    try {
      const params = new URLSearchParams();
      params.append('search', query);
      
      if (filters.technologies) {
        params.append('technologies', filters.technologies);
      }
      if (filters.cohort) {
        params.append('cohort', filters.cohort);
      }
      if (filters.status) {
        params.append('status', filters.status);
      }

      const response = await api.get(`/projects/search/?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur recherche projets:', error);
      // Fallback: recherche dans les projets mockés
      const mockProjects = this.getMockProjects();
      const filteredProjects = mockProjects.filter(project => 
        project.title.toLowerCase().includes(query.toLowerCase()) ||
        project.description.toLowerCase().includes(query.toLowerCase()) ||
        project.technologies.toLowerCase().includes(query.toLowerCase()) ||
        project.tags.toLowerCase().includes(query.toLowerCase())
      );
      return filteredProjects;
    }
  },

  // Télécharger un projet
  async downloadProject(projectId) {
    try {
      const response = await api.post(`/projects/${projectId}/download/`);
      
      // Incrémenter le compteur localement pour feedback immédiat
      const projects = await this.getAllProjects();
      const project = projects.find(p => p.id === projectId);
      if (project) {
        project.download_count = (project.download_count || 0) + 1;
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Erreur téléchargement projet:', error);
      
      // Simuler le téléchargement en cas d'erreur
      const projects = await this.getAllProjects();
      const project = projects.find(p => p.id === projectId);
      if (project) {
        project.download_count = (project.download_count || 0) + 1;
      }
      
      return { success: true, message: 'Téléchargement simulé (mode démo)' };
    }
  },

  // Récupérer les projets similaires
  async getSimilarProjects(projectId, limit = 4) {
    try {
      const response = await api.get(`/projects/${projectId}/similar/?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur projets similaires:', error);
      
      // Fallback: trouver des projets similaires basés sur les tags
      const currentProject = await this.getProjectById(projectId);
      const allProjects = await this.getAllProjects();
      
      const similarProjects = allProjects
        .filter(project => 
          project.id !== projectId && 
          project.status === 'published' &&
          this.calculateSimilarity(currentProject, project) > 0.3
        )
        .slice(0, limit);
      
      return similarProjects;
    }
  },

  // Calculer la similarité entre deux projets (pour fallback)
  calculateSimilarity(project1, project2) {
    let score = 0;
    
    // Similarité par technologies
    const tech1 = project1.technologies?.toLowerCase().split(',').map(t => t.trim()) || [];
    const tech2 = project2.technologies?.toLowerCase().split(',').map(t => t.trim()) || [];
    const commonTech = tech1.filter(tech => tech2.includes(tech)).length;
    score += commonTech / Math.max(tech1.length, tech2.length) * 0.4;
    
    // Similarité par tags
    const tags1 = project1.tags?.toLowerCase().split(',').map(t => t.trim()) || [];
    const tags2 = project2.tags?.toLowerCase().split(',').map(t => t.trim()) || [];
    const commonTags = tags1.filter(tag => tags2.includes(tag)).length;
    score += commonTags / Math.max(tags1.length, tags2.length) * 0.4;
    
    // Similarité par cohorte
    if (project1.cohort === project2.cohort) {
      score += 0.2;
    }
    
    return score;
  }
};

export default projectService;