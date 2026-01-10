// // src/services/projects.js - SERVICE COMPLET
// import api from "./api";

// console.log("📦 projects.js chargé, export type: nommé (avec accolades)");

// const projectService = {
//   async getAllProjects() {
//     try {
//       console.log("📥 Récupération de tous les projets...");
//       const response = await api.get("/projects/");
      
//       let projects = [];
//       if (Array.isArray(response.data)) {
//         projects = response.data;
//       } else if (response.data && response.data.results) {
//         projects = response.data.results;
//       } else if (response.data && response.data.data) {
//         projects = response.data.data;
//       } else {
//         projects = response.data || [];
//       }
      
//       console.log(`✅ ${projects.length} projets récupérés`);
//       return projects;
//     } catch (error) {
//       console.error("❌ Erreur lors de la récupération des projets:", error);
//       throw new Error("Erreur lors du chargement des projets");
//     }
//   },

//   async getUserProjects() {
//     try {
//       console.log("📥 Récupération des projets utilisateur...");
      
//       const endpoints = [
//         "/my-projects/",
//         "/projects/?my=true",
//         "/projects/?author=me",
//         "/projects/"
//       ];
      
//       for (const endpoint of endpoints) {
//         try {
//           console.log(`🔍 Essai endpoint: ${endpoint}`);
//           const response = await api.get(endpoint);
          
//           if (response.data) {
//             console.log(`✅ Réponse de ${endpoint}:`, response.data);
            
//             let projects = [];
//             if (Array.isArray(response.data)) {
//               projects = response.data;
//             } else if (response.data.results) {
//               projects = response.data.results;
//             } else if (response.data.data) {
//               projects = response.data.data;
//             } else if (response.data.projects) {
//               projects = response.data.projects;
//             } else {
//               projects = [response.data];
//             }
            
//             if (endpoint === "/projects/" && projects.length > 0) {
//               const user = JSON.parse(localStorage.getItem("user"));
//               if (user && user.id) {
//                 const filteredProjects = projects.filter(project => {
//                   const authorId = project.author || project.author_id || (project.author && project.author.id);
//                   return authorId === user.id;
//                 });
//                 if (filteredProjects.length > 0) {
//                   console.log(`🎯 ${filteredProjects.length} projets filtrés`);
//                   return filteredProjects;
//                 }
//               }
//             } else if (projects.length > 0) {
//               console.log(`🎯 ${projects.length} projets récupérés`);
//               return projects;
//             }
//           }
//         } catch {
//           console.log(`⚠️ Endpoint ${endpoint} non disponible`);
//           continue;
//         }
//       }
      
//       console.log("📭 Aucun projet trouvé, retour tableau vide");
//       return [];
      
//     } catch (error) {
//       console.error("❌ Erreur récupération projets utilisateur:", error);
//       return [];
//     }
//   },

//   async createProject(projectData) {
//     try {
//       console.log("🛠️ CRÉATION PROJET:", projectData);
      
//       if (!projectData.title?.trim()) {
//         throw new Error("Le titre du projet est requis");
//       }
      
//       if (!projectData.technologies?.trim()) {
//         throw new Error("Les technologies sont requises");
//       }
      
//       if (!projectData.author) {
//         throw new Error("Auteur non spécifié");
//       }
      
//       const formData = new FormData();
//       formData.append("title", projectData.title.trim());
//       formData.append("description", projectData.description?.trim() || "");
//       formData.append("technologies", projectData.technologies.trim());
//       formData.append("status", projectData.status || "draft");
//       formData.append("author", projectData.author);
      
//       if (projectData.cohort?.trim()) {
//         formData.append("cohort", projectData.cohort.trim());
//       }
      
//       if (projectData.tags?.trim()) {
//         formData.append("tags", projectData.tags.trim());
//       }
      
//       if (projectData.github_url?.trim()) {
//         formData.append("github_url", projectData.github_url.trim());
//       }
      
//       if (projectData.demo_url?.trim()) {
//         formData.append("demo_url", projectData.demo_url.trim());
//       }
      
//       if (projectData.image && projectData.image instanceof File) {
//         formData.append("image", projectData.image);
//       }
      
//       if (projectData.zip_file && projectData.zip_file instanceof File) {
//         formData.append("zip_file", projectData.zip_file);
//       }
      
//       console.log("🚀 Envoi vers /projects/...");
//       const response = await api.post("/projects/", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
      
//       console.log("✅ PROJET CRÉÉ AVEC SUCCÈS:", response.data);
//       return response.data;
      
//     } catch (error) {
//       console.error("❌ ERREUR LORS DE LA CRÉATION:", error);
      
//       let errorMessage = "Erreur lors de la création du projet";
//       if (error.response?.data) {
//         const errors = error.response.data;
//         if (typeof errors === "object") {
//           if (errors.author) {
//             errorMessage = "Erreur avec l'auteur: " + (errors.author[0] || "Auteur invalide");
//           } else if (errors.title) {
//             errorMessage = "Titre: " + errors.title[0];
//           } else if (errors.technologies) {
//             errorMessage = "Technologies: " + errors.technologies[0];
//           }
//         }
//       }
      
//       throw new Error(errorMessage);
//     }
//   },

//   async getProjectDetails(id) {
//     try {
//       console.log(`🔍 DÉTAILS PROJET ID ${id}...`);
//       const response = await api.get(`/projects/${id}/`);
//       console.log("✅ Détails projet récupérés");
//       return response.data;
//     } catch (error) {
//       console.error(`❌ Erreur détails projet ${id}:`, error);
//       throw new Error("Erreur lors du chargement des détails");
//     }
//   },

//   async isProjectOwner(projectId) {
//     try {
//       const project = await this.getProjectDetails(projectId);
//       const user = JSON.parse(localStorage.getItem("user"));
//       return project.author === user?.id || project.author_id === user?.id;
//     } catch (error) {
//       console.error("❌ Erreur vérification propriétaire:", error);
//       return false;
//     }
//   }
// };

// export { projectService };

// src/services/projects.js - SERVICE COMPLET AVEC GESTION D'ERREURS
import api from "./api";

const projectService = {
  // ==================== MÉTHODES PUBLIQUES ====================
  
  // Récupérer tous les projets (public ou authentifié)
  async getAllProjects() {
    try {
      console.log("📥 Récupération de tous les projets...");
      
      // ESSAYER D'ABORD L'ENDPOINT PUBLIC (sans token)
      try {
        const publicResponse = await api.get("/public-projects/");
        if (publicResponse.data?.results || Array.isArray(publicResponse.data)) {
          const projects = publicResponse.data.results || publicResponse.data;
          console.log(`✅ ${projects.length} projets publics récupérés`);
          return projects;
        }
      } catch (publicError) {
        console.log("⚠️ Endpoint public non disponible, essai standard...");
      }
      
      // FALLBACK: Endpoint standard (peut nécessiter auth)
      const response = await api.get("/projects/");
      
      let projects = [];
      if (Array.isArray(response.data)) {
        projects = response.data;
      } else if (response.data?.results) {
        projects = response.data.results;
      } else {
        projects = response.data || [];
      }
      
      console.log(`✅ ${projects.length} projets récupérés`);
      return projects;
      
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des projets:", error);
      
      // Si erreur 401 (non authentifié), retourner tableau vide
      if (error.response?.status === 401) {
        console.log("🔐 Utilisateur non authentifié - retour vide");
        return [];
      }
      
      // Retourner un tableau vide au lieu de throw
      return [];
    }
  },

  // Récupérer les projets de l'utilisateur connecté
  async getUserProjects() {
    try {
      console.log("📥 Récupération des projets utilisateur...");
      
      // VÉRIFIER D'ABORD SI L'UTILISATEUR EST CONNECTÉ
      const user = JSON.parse(localStorage.getItem("user") || "null");
      const token = localStorage.getItem("access_token");
      
      if (!user || !token) {
        console.log("⚠️ Utilisateur non connecté - retour vide");
        return [];
      }
      
      console.log(`👤 Utilisateur connecté: ${user.username}`);
      
      const endpoints = [
        "/my-projects/",
        "/projects/?my=true",
        "/projects/?author=me"
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`🔍 Essai endpoint: ${endpoint}`);
          const response = await api.get(endpoint);
          
          if (response.data) {
            let projects = [];
            
            // Gérer différents formats de réponse
            if (Array.isArray(response.data)) {
              projects = response.data;
            } else if (response.data.results) {
              projects = response.data.results;
            } else if (response.data.data) {
              projects = response.data.data;
            } else if (typeof response.data === 'object') {
              // Vérifier si c'est une réponse d'erreur
              if (response.data.detail || response.data.error) {
                console.log(`⚠️ Réponse d'erreur de ${endpoint}:`, response.data);
                continue;
              }
              projects = [response.data];
            }
            
            // Filtrer par auteur si nécessaire (pour /projects/)
            if (endpoint === "/projects/") {
              const filteredProjects = projects.filter(project => {
                const authorId = project.author?.id || project.author_id || project.author;
                return authorId === user.id;
              });
              if (filteredProjects.length > 0) {
                projects = filteredProjects;
              }
            }
            
            if (projects.length > 0) {
              console.log(`🎯 ${projects.length} projet(s) trouvé(s) via ${endpoint}`);
              return projects;
            }
          }
        } catch (endpointError) {
          console.log(`⚠️ Endpoint ${endpoint} non disponible:`, endpointError.message);
          continue;
        }
      }
      
      console.log("📭 Aucun projet trouvé, retour tableau vide");
      return [];
      
    } catch (error) {
      console.error("❌ Erreur récupération projets utilisateur:", error);
      
      // Gestion spécifique des erreurs 401
      if (error.response?.status === 401) {
        console.log("🔐 Session expirée, déconnexion...");
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      
      return [];
    }
  },

  // ==================== CRÉATION ET GESTION ====================
  
  async createProject(projectData) {
    try {
      console.log("🛠️ CRÉATION PROJET:", projectData);
      
      // Validation
      if (!projectData.title?.trim()) {
        throw new Error("Le titre du projet est requis");
      }
      
      if (!projectData.technologies?.trim()) {
        throw new Error("Les technologies sont requises");
      }
      
      // Vérifier l'authentification
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (!user) {
        throw new Error("Vous devez être connecté pour créer un projet");
      }
      
      // Préparer les données
      const formData = new FormData();
      formData.append("title", projectData.title.trim());
      formData.append("description", projectData.description?.trim() || "");
      formData.append("technologies", projectData.technologies.trim());
      formData.append("status", projectData.status || "draft");
      formData.append("author", user.id);
      
      // Champs optionnels
      if (projectData.cohort?.trim()) {
        formData.append("cohort", projectData.cohort.trim());
      }
      
      if (projectData.tags?.trim()) {
        formData.append("tags", projectData.tags.trim());
      }
      
      if (projectData.github_url?.trim()) {
        formData.append("github_url", projectData.github_url.trim());
      }
      
      if (projectData.demo_url?.trim()) {
        formData.append("demo_url", projectData.demo_url.trim());
      }
      
      if (projectData.image && projectData.image instanceof File) {
        formData.append("image", projectData.image);
      }
      
      if (projectData.zip_file && projectData.zip_file instanceof File) {
        formData.append("zip_file", projectData.zip_file);
      }
      
      console.log("🚀 Envoi vers /projects/...");
      const response = await api.post("/projects/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log("✅ PROJET CRÉÉ AVEC SUCCÈS:", response.data);
      return {
        success: true,
        data: response.data,
        message: "Projet créé avec succès"
      };
      
    } catch (error) {
      console.error("❌ ERREUR LORS DE LA CRÉATION:", error);
      
      let errorMessage = "Erreur lors de la création du projet";
      let errorDetails = {};
      
      if (error.response?.data) {
        const errors = error.response.data;
        
        if (typeof errors === 'object') {
          // Erreurs de validation Django
          if (errors.author) {
            errorMessage = "Erreur avec l'auteur: " + (errors.author[0] || "Auteur invalide");
            errorDetails.author = errors.author;
          }
          if (errors.title) {
            errorMessage = "Titre: " + errors.title[0];
            errorDetails.title = errors.title;
          }
          if (errors.technologies) {
            errorMessage = "Technologies: " + errors.technologies[0];
            errorDetails.technologies = errors.technologies;
          }
          if (errors.detail) {
            errorMessage = errors.detail;
          }
        } else if (typeof errors === 'string') {
          errorMessage = errors;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage,
        details: errorDetails,
        message: errorMessage
      };
    }
  },

  // ==================== OPÉRATIONS SUR PROJET ====================
  
  async getProjectDetails(id) {
    try {
      console.log(`🔍 DÉTAILS PROJET ID ${id}...`);
      
      // Essayer d'abord l'endpoint public
      try {
        const publicResponse = await api.get(`/projects/${id}/`);
        console.log("✅ Détails projet récupérés");
        return {
          success: true,
          data: publicResponse.data
        };
      } catch (publicError) {
        console.log("⚠️ Endpoint public échoué, essai standard...");
      }
      
      // Fallback
      const response = await api.get(`/projects/${id}/`);
      return {
        success: true,
        data: response.data
      };
      
    } catch (error) {
      console.error(`❌ Erreur détails projet ${id}:`, error);
      
      if (error.response?.status === 404) {
        return {
          success: false,
          error: "Projet non trouvé",
          message: "Ce projet n'existe pas ou a été supprimé"
        };
      }
      
      return {
        success: false,
        error: error.message || "Erreur lors du chargement des détails",
        message: "Impossible de charger les détails du projet"
      };
    }
  },

  async updateProject(id, projectData) {
    try {
      console.log(`✏️ MISE À JOUR PROJET ${id}...`);
      
      const response = await api.patch(`/projects/${id}/`, projectData);
      
      return {
        success: true,
        data: response.data,
        message: "Projet mis à jour avec succès"
      };
      
    } catch (error) {
      console.error(`❌ Erreur mise à jour projet ${id}:`, error);
      
      let errorMessage = "Erreur lors de la mise à jour";
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      return {
        success: false,
        error: errorMessage,
        message: errorMessage
      };
    }
  },

  async deleteProject(id) {
    try {
      console.log(`🗑️ SUPPRESSION PROJET ${id}...`);
      
      await api.delete(`/projects/${id}/`);
      
      return {
        success: true,
        message: "Projet supprimé avec succès"
      };
      
    } catch (error) {
      console.error(`❌ Erreur suppression projet ${id}:`, error);
      
      if (error.response?.status === 403) {
        return {
          success: false,
          error: "Permission refusée",
          message: "Vous n'avez pas la permission de supprimer ce projet"
        };
      }
      
      return {
        success: false,
        error: error.message,
        message: "Erreur lors de la suppression"
      };
    }
  },

  async downloadProject(id) {
    try {
      console.log(`📥 TÉLÉCHARGEMENT PROJET ${id}...`);
      
      const response = await api.get(`/projects/${id}/download/`, {
        responseType: 'blob'
      });
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `projet-${id}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return {
        success: true,
        message: "Téléchargement démarré"
      };
      
    } catch (error) {
      console.error(`❌ Erreur téléchargement projet ${id}:`, error);
      return {
        success: false,
        error: "Erreur lors du téléchargement",
        message: "Impossible de télécharger le projet"
      };
    }
  },

  // ==================== UTILITAIRES ====================
  
  async isProjectOwner(projectId) {
    try {
      const project = await this.getProjectDetails(projectId);
      if (!project.success) return false;
      
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return false;
      
      const projectAuthorId = project.data.author?.id || project.data.author_id || project.data.author;
      return projectAuthorId === user.id;
      
    } catch (error) {
      console.error("❌ Erreur vérification propriétaire:", error);
      return false;
    }
  },

  async getProjectStats() {
    try {
      const response = await api.get("/projects-stats/");
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error("❌ Erreur stats projets:", error);
      return {
        success: false,
        data: {},
        error: error.message
      };
    }
  },

  // ==================== MÉTHODES DE DEBUG ====================
  
  async testConnection() {
    try {
      const response = await api.get("/auth-test/");
      console.log("✅ Test connexion réussi:", response.data);
      return {
        connected: true,
        data: response.data,
        user: JSON.parse(localStorage.getItem("user"))
      };
    } catch (error) {
      console.error("❌ Test connexion échoué:", error);
      return {
        connected: false,
        error: error.message,
        user: JSON.parse(localStorage.getItem("user"))
      };
    }
  },

  // ==================== MÉTHODES ADMIN ====================
  
  async getAdminStats() {
    try {
      const response = await api.get("/admin/stats/");
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error("❌ Erreur stats admin:", error);
      
      // Données mockées pour fallback
      return {
        success: false,
        data: this.getMockAdminStats(),
        isMock: true,
        error: error.message
      };
    }
  },

  getMockAdminStats() {
    return {
      stats: {
        total_users: 1247,
        total_projects: 543,
        total_downloads: 2891,
        pending_projects: 23,
        approved_projects: 320,
        draft_projects: 200,
        active_users: 1100,
        inactive_users: 147,
        staff_users: 15
      },
      recent_users: [
        {
          id: 1,
          username: 'admin',
          email: 'admin@simplon.com',
          first_name: 'Admin',
          last_name: 'System'
        }
      ],
      recent_projects: [
        {
          id: 1,
          title: 'Application E-commerce',
          author: { username: 'simplon_2025001' },
          status: 'published'
        }
      ]
    };
  }
};

export { projectService };

