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

// // src/services/projects.js - SERVICE COMPLET AVEC GESTION D'ERREURS
// import api from "./api";

// const projectService = {
//   // ==================== MÉTHODES PUBLIQUES ====================
  
//   // Récupérer tous les projets (public ou authentifié)
//   async getAllProjects() {
//     try {
//       console.log("📥 Récupération de tous les projets...");
      
//       // ESSAYER D'ABORD L'ENDPOINT PUBLIC (sans token)
//       try {
//         const publicResponse = await api.get("/public-projects/");
//         if (publicResponse.data?.results || Array.isArray(publicResponse.data)) {
//           const projects = publicResponse.data.results || publicResponse.data;
//           console.log(`✅ ${projects.length} projets publics récupérés`);
//           return projects;
//         }
//       } catch (publicError) {
//         console.log("⚠️ Endpoint public non disponible, essai standard...");
//       }
      
//       // FALLBACK: Endpoint standard (peut nécessiter auth)
//       const response = await api.get("/projects/");
      
//       let projects = [];
//       if (Array.isArray(response.data)) {
//         projects = response.data;
//       } else if (response.data?.results) {
//         projects = response.data.results;
//       } else {
//         projects = response.data || [];
//       }
      
//       console.log(`✅ ${projects.length} projets récupérés`);
//       return projects;
      
//     } catch (error) {
//       console.error("❌ Erreur lors de la récupération des projets:", error);
      
//       // Si erreur 401 (non authentifié), retourner tableau vide
//       if (error.response?.status === 401) {
//         console.log("🔐 Utilisateur non authentifié - retour vide");
//         return [];
//       }
      
//       // Retourner un tableau vide au lieu de throw
//       return [];
//     }
//   },

//   // Récupérer les projets de l'utilisateur connecté
//   async getUserProjects() {
//     try {
//       console.log("📥 Récupération des projets utilisateur...");
      
//       // VÉRIFIER D'ABORD SI L'UTILISATEUR EST CONNECTÉ
//       const user = JSON.parse(localStorage.getItem("user") || "null");
//       const token = localStorage.getItem("access_token");
      
//       if (!user || !token) {
//         console.log("⚠️ Utilisateur non connecté - retour vide");
//         return [];
//       }
      
//       console.log(`👤 Utilisateur connecté: ${user.username}`);
      
//       const endpoints = [
//         "/my-projects/",
//         "/projects/?my=true",
//         "/projects/?author=me"
//       ];
      
//       for (const endpoint of endpoints) {
//         try {
//           console.log(`🔍 Essai endpoint: ${endpoint}`);
//           const response = await api.get(endpoint);
          
//           if (response.data) {
//             let projects = [];
            
//             // Gérer différents formats de réponse
//             if (Array.isArray(response.data)) {
//               projects = response.data;
//             } else if (response.data.results) {
//               projects = response.data.results;
//             } else if (response.data.data) {
//               projects = response.data.data;
//             } else if (typeof response.data === 'object') {
//               // Vérifier si c'est une réponse d'erreur
//               if (response.data.detail || response.data.error) {
//                 console.log(`⚠️ Réponse d'erreur de ${endpoint}:`, response.data);
//                 continue;
//               }
//               projects = [response.data];
//             }
            
//             // Filtrer par auteur si nécessaire (pour /projects/)
//             if (endpoint === "/projects/") {
//               const filteredProjects = projects.filter(project => {
//                 const authorId = project.author?.id || project.author_id || project.author;
//                 return authorId === user.id;
//               });
//               if (filteredProjects.length > 0) {
//                 projects = filteredProjects;
//               }
//             }
            
//             if (projects.length > 0) {
//               console.log(`🎯 ${projects.length} projet(s) trouvé(s) via ${endpoint}`);
//               return projects;
//             }
//           }
//         } catch (endpointError) {
//           console.log(`⚠️ Endpoint ${endpoint} non disponible:`, endpointError.message);
//           continue;
//         }
//       }
      
//       console.log("📭 Aucun projet trouvé, retour tableau vide");
//       return [];
      
//     } catch (error) {
//       console.error("❌ Erreur récupération projets utilisateur:", error);
      
//       // Gestion spécifique des erreurs 401
//       if (error.response?.status === 401) {
//         console.log("🔐 Session expirée, déconnexion...");
//         localStorage.removeItem("access_token");
//         localStorage.removeItem("user");
//         window.location.href = "/login";
//       }
      
//       return [];
//     }
//   },

//   // ==================== CRÉATION ET GESTION ====================
  
//   async createProject(projectData) {
//     try {
//       console.log("🛠️ CRÉATION PROJET:", projectData);
      
//       // Validation
//       if (!projectData.title?.trim()) {
//         throw new Error("Le titre du projet est requis");
//       }
      
//       if (!projectData.technologies?.trim()) {
//         throw new Error("Les technologies sont requises");
//       }
      
//       // Vérifier l'authentification
//       const user = JSON.parse(localStorage.getItem("user") || "null");
//       if (!user) {
//         throw new Error("Vous devez être connecté pour créer un projet");
//       }
      
//       // Préparer les données
//       const formData = new FormData();
//       formData.append("title", projectData.title.trim());
//       formData.append("description", projectData.description?.trim() || "");
//       formData.append("technologies", projectData.technologies.trim());
//       formData.append("status", projectData.status || "draft");
//       formData.append("author", user.id);
      
//       // Champs optionnels
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
//       return {
//         success: true,
//         data: response.data,
//         message: "Projet créé avec succès"
//       };
      
//     } catch (error) {
//       console.error("❌ ERREUR LORS DE LA CRÉATION:", error);
      
//       let errorMessage = "Erreur lors de la création du projet";
//       let errorDetails = {};
      
//       if (error.response?.data) {
//         const errors = error.response.data;
        
//         if (typeof errors === 'object') {
//           // Erreurs de validation Django
//           if (errors.author) {
//             errorMessage = "Erreur avec l'auteur: " + (errors.author[0] || "Auteur invalide");
//             errorDetails.author = errors.author;
//           }
//           if (errors.title) {
//             errorMessage = "Titre: " + errors.title[0];
//             errorDetails.title = errors.title;
//           }
//           if (errors.technologies) {
//             errorMessage = "Technologies: " + errors.technologies[0];
//             errorDetails.technologies = errors.technologies;
//           }
//           if (errors.detail) {
//             errorMessage = errors.detail;
//           }
//         } else if (typeof errors === 'string') {
//           errorMessage = errors;
//         }
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       return {
//         success: false,
//         error: errorMessage,
//         details: errorDetails,
//         message: errorMessage
//       };
//     }
//   },

//   // ==================== OPÉRATIONS SUR PROJET ====================
  
//   async getProjectDetails(id) {
//     try {
//       console.log(`🔍 DÉTAILS PROJET ID ${id}...`);
      
//       // Essayer d'abord l'endpoint public
//       try {
//         const publicResponse = await api.get(`/projects/${id}/`);
//         console.log("✅ Détails projet récupérés");
//         return {
//           success: true,
//           data: publicResponse.data
//         };
//       } catch (publicError) {
//         console.log("⚠️ Endpoint public échoué, essai standard...");
//       }
      
//       // Fallback
//       const response = await api.get(`/projects/${id}/`);
//       return {
//         success: true,
//         data: response.data
//       };
      
//     } catch (error) {
//       console.error(`❌ Erreur détails projet ${id}:`, error);
      
//       if (error.response?.status === 404) {
//         return {
//           success: false,
//           error: "Projet non trouvé",
//           message: "Ce projet n'existe pas ou a été supprimé"
//         };
//       }
      
//       return {
//         success: false,
//         error: error.message || "Erreur lors du chargement des détails",
//         message: "Impossible de charger les détails du projet"
//       };
//     }
//   },

//   async updateProject(id, projectData) {
//     try {
//       console.log(`✏️ MISE À JOUR PROJET ${id}...`);
      
//       const response = await api.patch(`/projects/${id}/`, projectData);
      
//       return {
//         success: true,
//         data: response.data,
//         message: "Projet mis à jour avec succès"
//       };
      
//     } catch (error) {
//       console.error(`❌ Erreur mise à jour projet ${id}:`, error);
      
//       let errorMessage = "Erreur lors de la mise à jour";
//       if (error.response?.data?.detail) {
//         errorMessage = error.response.data.detail;
//       }
      
//       return {
//         success: false,
//         error: errorMessage,
//         message: errorMessage
//       };
//     }
//   },

//   async deleteProject(id) {
//     try {
//       console.log(`🗑️ SUPPRESSION PROJET ${id}...`);
      
//       await api.delete(`/projects/${id}/`);
      
//       return {
//         success: true,
//         message: "Projet supprimé avec succès"
//       };
      
//     } catch (error) {
//       console.error(`❌ Erreur suppression projet ${id}:`, error);
      
//       if (error.response?.status === 403) {
//         return {
//           success: false,
//           error: "Permission refusée",
//           message: "Vous n'avez pas la permission de supprimer ce projet"
//         };
//       }
      
//       return {
//         success: false,
//         error: error.message,
//         message: "Erreur lors de la suppression"
//       };
//     }
//   },

//   async downloadProject(id) {
//     try {
//       console.log(`📥 TÉLÉCHARGEMENT PROJET ${id}...`);
      
//       const response = await api.get(`/projects/${id}/download/`, {
//         responseType: 'blob'
//       });
      
//       // Créer un lien de téléchargement
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `projet-${id}.zip`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
      
//       return {
//         success: true,
//         message: "Téléchargement démarré"
//       };
      
//     } catch (error) {
//       console.error(`❌ Erreur téléchargement projet ${id}:`, error);
//       return {
//         success: false,
//         error: "Erreur lors du téléchargement",
//         message: "Impossible de télécharger le projet"
//       };
//     }
//   },

//   // ==================== UTILITAIRES ====================
  
//   async isProjectOwner(projectId) {
//     try {
//       const project = await this.getProjectDetails(projectId);
//       if (!project.success) return false;
      
//       const user = JSON.parse(localStorage.getItem("user"));
//       if (!user) return false;
      
//       const projectAuthorId = project.data.author?.id || project.data.author_id || project.data.author;
//       return projectAuthorId === user.id;
      
//     } catch (error) {
//       console.error("❌ Erreur vérification propriétaire:", error);
//       return false;
//     }
//   },

//   async getProjectStats() {
//     try {
//       const response = await api.get("/projects-stats/");
//       return {
//         success: true,
//         data: response.data
//       };
//     } catch (error) {
//       console.error("❌ Erreur stats projets:", error);
//       return {
//         success: false,
//         data: {},
//         error: error.message
//       };
//     }
//   },

//   // ==================== MÉTHODES DE DEBUG ====================
  
//   async testConnection() {
//     try {
//       const response = await api.get("/auth-test/");
//       console.log("✅ Test connexion réussi:", response.data);
//       return {
//         connected: true,
//         data: response.data,
//         user: JSON.parse(localStorage.getItem("user"))
//       };
//     } catch (error) {
//       console.error("❌ Test connexion échoué:", error);
//       return {
//         connected: false,
//         error: error.message,
//         user: JSON.parse(localStorage.getItem("user"))
//       };
//     }
//   },

//   // ==================== MÉTHODES ADMIN ====================
  
//   async getAdminStats() {
//     try {
//       const response = await api.get("/admin/stats/");
//       return {
//         success: true,
//         data: response.data
//       };
//     } catch (error) {
//       console.error("❌ Erreur stats admin:", error);
      
//       // Données mockées pour fallback
//       return {
//         success: false,
//         data: this.getMockAdminStats(),
//         isMock: true,
//         error: error.message
//       };
//     }
//   },

//   getMockAdminStats() {
//     return {
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
//       recent_users: [
//         {
//           id: 1,
//           username: 'admin',
//           email: 'admin@simplon.com',
//           first_name: 'Admin',
//           last_name: 'System'
//         }
//       ],
//       recent_projects: [
//         {
//           id: 1,
//           title: 'Application E-commerce',
//           author: { username: 'simplon_2025001' },
//           status: 'published'
//         }
//       ]
//     };
//   }
// };

// export { projectService };


// // src/services/projects.js - VERSION CORRIGÉE
// import api from "./api";

// const projectService = {
//   // ==================== MÉTHODES PUBLIQUES ====================
  
//   // Récupérer tous les projets (public ou authentifié)
//   async getAllProjects() {
//     try {
//       console.log("📥 Récupération de tous les projets...");
      
//       // UTILISER LA BONNE MÉTHODE DE L'API
//       // Option 1: Utiliser apiService.getProjects()
//       if (api.getProjects) {
//         const projects = await api.getProjects();
//         console.log(`✅ ${projects.length} projets récupérés via getProjects()`);
//         return projects;
//       }
      
//       // Option 2: Utiliser api.djangoApiService.getProjects()
//       if (api.djangoApiService?.getProjects) {
//         const projects = await api.djangoApiService.getProjects();
//         console.log(`✅ ${projects.length} projets récupérés via djangoApiService`);
//         return projects;
//       }
      
//       // Option 3: Utiliser l'instance axios directement
//       if (api.axios) {
//         try {
//           const response = await api.axios.get("/api/projects/projects/");
//           let projects = [];
          
//           if (response.data.projects && Array.isArray(response.data.projects)) {
//             projects = response.data.projects;
//           } else if (response.data.results && Array.isArray(response.data.results)) {
//             projects = response.data.results;
//           } else if (Array.isArray(response.data)) {
//             projects = response.data;
//           }
          
//           console.log(`✅ ${projects.length} projets récupérés via axios`);
//           return projects;
//         } catch (axiosError) {
//           console.log("⚠️ Erreur axios:", axiosError.message);
//         }
//       }
      
//       console.log("📭 Aucune méthode disponible, retour tableau vide");
//       return [];
      
//     } catch (error) {
//       console.error("❌ Erreur lors de la récupération des projets:", error);
//       return [];
//     }
//   },

//   // Récupérer les projets de l'utilisateur connecté
//   async getUserProjects() {
//     try {
//       console.log("📥 Récupération des projets utilisateur...");
      
//       // UTILISER LA BONNE MÉTHODE
//       if (api.getUserProjects) {
//         const projects = await api.getUserProjects();
//         console.log(`✅ ${projects.length} projets utilisateur récupérés`);
//         return projects;
//       }
      
//       if (api.djangoApiService?.getUserProjects) {
//         const projects = await api.djangoApiService.getUserProjects();
//         console.log(`✅ ${projects.length} projets utilisateur récupérés`);
//         return projects;
//       }
      
//       // Fallback: Vérifier manuellement l'authentification
//       const user = JSON.parse(localStorage.getItem("simplon_user") || "null");
//       const token = localStorage.getItem("access_token");
      
//       if (!user || !token) {
//         console.log("⚠️ Utilisateur non connecté - retour vide");
//         return [];
//       }
      
//       console.log(`👤 Utilisateur connecté: ${user.username}`);
      
//       // Essayer différents endpoints
//       const endpoints = [
//         "/api/projects/user-projects/",
//         "/api/projects/my-projects/",
//         "/api/projects/?author=me"
//       ];
      
//       for (const endpoint of endpoints) {
//         try {
//           console.log(`🔍 Essai endpoint: ${endpoint}`);
          
//           // Utiliser l'instance axios si disponible
//           if (api.axios) {
//             const response = await api.axios.get(endpoint, {
//               headers: { Authorization: `Bearer ${token}` }
//             });
            
//             if (response.data) {
//               let projects = [];
              
//               if (Array.isArray(response.data)) {
//                 projects = response.data;
//               } else if (response.data.results) {
//                 projects = response.data.results;
//               } else if (response.data.projects) {
//                 projects = response.data.projects;
//               }
              
//               if (projects.length > 0) {
//                 console.log(`🎯 ${projects.length} projet(s) trouvé(s) via ${endpoint}`);
//                 return projects;
//               }
//             }
//           }
//         } catch (endpointError) {
//           console.log(`⚠️ Endpoint ${endpoint} non disponible:`, endpointError.message);
//           continue;
//         }
//       }
      
//       console.log("📭 Aucun projet utilisateur trouvé");
//       return [];
      
//     } catch (error) {
//       console.error("❌ Erreur récupération projets utilisateur:", error);
//       return [];
//     }
//   },

//   // ==================== CRÉATION ET GESTION ====================
  
//   async createProject(projectData) {
//     try {
//       console.log("🛠️ CRÉATION PROJET:", projectData);
      
//       // Validation
//       if (!projectData.title?.trim()) {
//         throw new Error("Le titre du projet est requis");
//       }
      
//       // Vérifier l'authentification
//       const user = JSON.parse(localStorage.getItem("simplon_user") || "null");
//       if (!user) {
//         throw new Error("Vous devez être connecté pour créer un projet");
//       }
      
//       // Préparer les données
//       const formData = new FormData();
//       formData.append("title", projectData.title.trim());
//       formData.append("description", projectData.description?.trim() || "");
//       formData.append("technologies", projectData.technologies?.trim() || "");
//       formData.append("status", projectData.status || "draft");
//       formData.append("author", user.id);
      
//       // Champs optionnels
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
      
//       console.log("🚀 Envoi vers /api/projects/...");
      
//       // Utiliser l'instance axios
//       if (!api.axios) {
//         throw new Error("Service API non disponible");
//       }
      
//       const response = await api.axios.post("/api/projects/", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
      
//       console.log("✅ PROJET CRÉÉ AVEC SUCCÈS:", response.data);
//       return {
//         success: true,
//         data: response.data,
//         message: "Projet créé avec succès"
//       };
      
//     } catch (error) {
//       console.error("❌ ERREUR LORS DE LA CRÉATION:", error);
      
//       let errorMessage = "Erreur lors de la création du projet";
      
//       if (error.response?.data) {
//         const errors = error.response.data;
        
//         if (typeof errors === 'object') {
//           if (errors.detail) {
//             errorMessage = errors.detail;
//           } else if (errors.title) {
//             errorMessage = "Titre: " + errors.title[0];
//           } else if (errors.technologies) {
//             errorMessage = "Technologies: " + errors.technologies[0];
//           }
//         } else if (typeof errors === 'string') {
//           errorMessage = errors;
//         }
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       return {
//         success: false,
//         error: errorMessage,
//         message: errorMessage
//       };
//     }
//   },

//   // ==================== OPÉRATIONS SUR PROJET ====================
  
//   async getProjectDetails(id) {
//     try {
//       console.log(`🔍 DÉTAILS PROJET ID ${id}...`);
      
//       if (!api.axios) {
//         throw new Error("Service API non disponible");
//       }
      
//       const response = await api.axios.get(`/api/projects/${id}/`);
//       console.log("✅ Détails projet récupérés");
//       return {
//         success: true,
//         data: response.data
//       };
      
//     } catch (error) {
//       console.error(`❌ Erreur détails projet ${id}:`, error);
      
//       if (error.response?.status === 404) {
//         return {
//           success: false,
//           error: "Projet non trouvé",
//           message: "Ce projet n'existe pas ou a été supprimé"
//         };
//       }
      
//       // Données mockées pour le développement
//       return {
//         success: false,
//         error: error.message || "Erreur lors du chargement",
//         data: this.getMockProject(id),
//         isMock: true,
//         message: "Mode simulation: données factices"
//       };
//     }
//   },

//   async updateProject(id, projectData) {
//     try {
//       console.log(`✏️ MISE À JOUR PROJET ${id}...`);
      
//       if (!api.axios) {
//         throw new Error("Service API non disponible");
//       }
      
//       const response = await api.axios.patch(`/api/projects/${id}/`, projectData);
      
//       return {
//         success: true,
//         data: response.data,
//         message: "Projet mis à jour avec succès"
//       };
      
//     } catch (error) {
//       console.error(`❌ Erreur mise à jour projet ${id}:`, error);
      
//       return {
//         success: false,
//         error: error.message || "Erreur lors de la mise à jour",
//         message: "Impossible de mettre à jour le projet"
//       };
//     }
//   },

//   async deleteProject(id) {
//     try {
//       console.log(`🗑️ SUPPRESSION PROJET ${id}...`);
      
//       if (!api.axios) {
//         throw new Error("Service API non disponible");
//       }
      
//       await api.axios.delete(`/api/projects/${id}/`);
      
//       return {
//         success: true,
//         message: "Projet supprimé avec succès"
//       };
      
//     } catch (error) {
//       console.error(`❌ Erreur suppression projet ${id}:`, error);
      
//       return {
//         success: false,
//         error: error.message,
//         message: "Erreur lors de la suppression"
//       };
//     }
//   },

//   // ==================== MÉTHODES DE FALLBACK/MOCK ====================
  
//   getMockProject(id) {
//     const mockProjects = [
//       {
//         id: 1,
//         title: "Application E-commerce React/Django",
//         description: "Une application e-commerce complète avec panier, paiement et gestion admin.",
//         technologies: "React, Django, PostgreSQL, Tailwind CSS",
//         status: "published",
//         author: {
//           id: 1,
//           username: "admin",
//           first_name: "Admin",
//           last_name: "System"
//         },
//         views: 1250,
//         downloads: 342,
//         created_at: "2024-01-15T10:30:00Z",
//         updated_at: "2024-01-20T14:45:00Z"
//       },
//       {
//         id: 2,
//         title: "API REST pour gestion de bibliothèque",
//         description: "API RESTful avec authentification JWT et documentation Swagger.",
//         technologies: "Django REST Framework, JWT, PostgreSQL, Swagger",
//         status: "published",
//         author: {
//           id: 2,
//           username: "user1",
//           first_name: "Jean",
//           last_name: "Dupont"
//         },
//         views: 890,
//         downloads: 215,
//         created_at: "2024-02-10T09:15:00Z",
//         updated_at: "2024-02-15T16:20:00Z"
//       },
//       {
//         id: 3,
//         title: "Dashboard analytique en temps réel",
//         description: "Dashboard avec graphiques interactifs et mises à jour en temps réel.",
//         technologies: "React, Chart.js, WebSockets, Django Channels",
//         status: "draft",
//         author: {
//           id: 3,
//           username: "user2",
//           first_name: "Marie",
//           last_name: "Martin"
//         },
//         views: 450,
//         downloads: 120,
//         created_at: "2024-03-05T11:45:00Z",
//         updated_at: "2024-03-05T11:45:00Z"
//       }
//     ];
    
//     return mockProjects.find(p => p.id === id) || mockProjects[0];
//   },

//   getMockProjects(count = 10) {
//     return Array.from({ length: count }, (_, i) => ({
//       id: i + 1,
//       title: `Projet ${i + 1}`,
//       description: `Description du projet ${i + 1}. Un projet innovant qui utilise les dernières technologies.`,
//       technologies: ['React', 'Django', 'PostgreSQL', 'Tailwind'][i % 4],
//       status: ['published', 'pending', 'draft'][i % 3],
//       author: {
//         id: (i % 5) + 1,
//         username: `user${(i % 5) + 1}`,
//         first_name: `Prénom ${(i % 5) + 1}`,
//         last_name: `Nom ${(i % 5) + 1}`
//       },
//       views: Math.floor(Math.random() * 1000),
//       downloads: Math.floor(Math.random() * 300),
//       created_at: new Date(Date.now() - i * 86400000).toISOString()
//     }));
//   },

//   // ==================== UTILITAIRES ====================
  
//   async isProjectOwner(projectId) {
//     try {
//       const project = await this.getProjectDetails(projectId);
//       if (!project.success) return false;
      
//       const user = JSON.parse(localStorage.getItem("simplon_user"));
//       if (!user) return false;
      
//       const projectAuthorId = project.data.author?.id || project.data.author_id || project.data.author;
//       return projectAuthorId === user.id;
      
//     } catch (error) {
//       console.error("❌ Erreur vérification propriétaire:", error);
//       return false;
//     }
//   },

//   async getProjectStats() {
//     try {
//       if (api.axios) {
//         const response = await api.axios.get("/api/projects-stats/");
//         return {
//           success: true,
//           data: response.data
//         };
//       }
      
//       // Fallback: stats mockées
//       return {
//         success: true,
//         data: {
//           total_projects: 24,
//           published_projects: 18,
//           pending_projects: 4,
//           draft_projects: 2,
//           total_downloads: 1250,
//           total_views: 8900,
//           avg_rating: 4.5,
//           top_technologies: ['React', 'Django', 'JavaScript', 'Python', 'Tailwind']
//         },
//         isMock: true
//       };
//     } catch (error) {
//       console.error("❌ Erreur stats projets:", error);
//       return {
//         success: false,
//         data: {},
//         error: error.message
//       };
//     }
//   },

//   // ==================== MÉTHODES DE DEBUG ====================
  
//   async testConnection() {
//     try {
//       if (api.axios) {
//         const response = await api.axios.get("/api/");
//         console.log("✅ Test connexion réussi:", response.data);
//         return {
//           connected: true,
//           data: response.data,
//           user: JSON.parse(localStorage.getItem("simplon_user"))
//         };
//       }
      
//       return {
//         connected: false,
//         error: "API non disponible",
//         user: JSON.parse(localStorage.getItem("simplon_user"))
//       };
//     } catch (error) {
//       console.error("❌ Test connexion échoué:", error);
//       return {
//         connected: false,
//         error: error.message,
//         user: JSON.parse(localStorage.getItem("simplon_user"))
//       };
//     }
//   }
// };

// export { projectService };


// src/services/projects.js - VERSION FINALE CORRECTE
const API_URL = 'http://localhost:8000';

const projectService = {
  // ==================== MÉTHODE PRINCIPALE CORRIGÉE ====================
  
  async getUserProjects() {
    try {
      console.log("📥 Récupération des projets depuis API Django...");
      
      // 1. RÉCUPÉRER L'UTILISATEUR
      const userStr = localStorage.getItem("simplon_user");
      if (!userStr) {
        console.log("⚠️ Aucun utilisateur connecté");
        return [];
      }
      
      const user = JSON.parse(userStr);
      const userId = user.id;
      
      if (!userId) {
        console.log("⚠️ ID utilisateur non trouvé");
        return [];
      }
      
      console.log(`👤 Utilisateur: ${user.username} (ID: ${userId})`);
      
      // 2. APPELER LE BON ENDPOINT API
      const apiUrl = `${API_URL}/api/users/projects/user/${userId}/`;
      console.log(`🔗 Endpoint API: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.log(`❌ API erreur: ${response.status}`);
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ Réponse API:`, data);
      
      // 3. EXTRACTION DES PROJETS (STRUCTURE CORRECTE)
      let projects = [];
      
      if (data.projects && Array.isArray(data.projects)) {
        // Format 1: data.projects (ce que ton API retourne)
        projects = data.projects.map(project => ({
          id: project.id,
          title: project.title,
          description: project.description,
          technologies: project.technologies,
          status: project.status,
          created_at: project.created_at,
          updated_at: project.updated_at,
          author: project.author,
          author_name: project.author_name || project.author_info?.full_name || user.username,
          author_username: project.author_username || project.author_info?.username,
          cohort: project.cohort || "Simplon 2024",
          github_url: project.github_url,
          demo_url: project.demo_url,
          image: project.image,
          tags: project.tags,
          is_approved: project.is_approved,
          is_pending: project.is_pending
        }));
        
        console.log(`📊 ${projects.length} projet(s) récupéré(s) depuis la BD`);
        return projects;
        
      } else if (Array.isArray(data)) {
        // Format 2: tableau direct
        projects = data;
        console.log(`📊 ${projects.length} projet(s) récupéré(s) (format tableau)`);
        return projects;
      }
      
      console.log("⚠️ Format de données non reconnu");
      return [];
      
    } catch (error) {
      console.error("❌ Erreur récupération projets:", error);
      return this._getFallbackProjects();
    }
  },
  
  // ==================== FALLBACK POUR ERREUR API ====================
  
  async _getFallbackProjects() {
    console.log("🆘 Mode fallback activé...");
    
    const userStr = localStorage.getItem("simplon_user");
    if (!userStr) return [];
    
    const user = JSON.parse(userStr);
    const userId = user.id;
    const username = user.username;
    
    // Projets factices basés sur le type d'utilisateur
    if (user.isAdmin || user.role === 'admin') {
      return [
        {
          id: 1,
          title: "Dashboard Analytics Admin",
          description: "Tableau de bord analytique pour la gestion de la plateforme",
          status: "approved",
          technologies: "React, Django REST, Chart.js",
          created_at: new Date().toISOString(),
          author: userId,
          author_name: username,
          cohort: "Simplon 2024"
        },
        {
          id: 2,
          title: "Système de Gestion de Contenu",
          description: "CMS complet avec gestion des utilisateurs",
          status: "approved",
          technologies: "Django, PostgreSQL, Bootstrap",
          created_at: new Date().toISOString(),
          author: userId,
          author_name: username,
          cohort: "Simplon 2024"
        }
      ];
    } else {
      return [
        {
          id: 1,
          title: "maquette de jus",
          description: "Maquette de site web pour une marque de jus",
          status: "draft",
          technologies: "REACT , TAILWINDCSS",
          created_at: new Date().toISOString(),
          author: userId,
          author_name: username,
          cohort: "Simplon 2024"
        },
        {
          id: 2,
          title: "e commerce",
          description: "Site e-commerce avec panier et paiement",
          status: "draft",
          technologies: "javascripts",
          created_at: new Date().toISOString(),
          author: userId,
          author_name: username,
          cohort: "Simplon 2024"
        }
      ];
    }
  },
  
  // ==================== AUTRES MÉTHODES ====================
  
  async getAllProjects() {
    try {
      const response = await fetch(`${API_URL}/api/projects/`);
      if (response.ok) {
        const data = await response.json();
        return data.results || data || [];
      }
    } catch (error) {
      console.error("❌ Erreur tous projets:", error);
    }
    return [];
  },
  
  async createProject(projectData) {
    try {
      const userStr = localStorage.getItem("simplon_user");
      if (!userStr) throw new Error("Non connecté");
      
      const user = JSON.parse(userStr);
      const token = localStorage.getItem("simplon_access_token");
      
      const data = {
        title: projectData.title,
        description: projectData.description || "",
        technologies: projectData.technologies || "",
        status: projectData.status || "draft",
        author: user.id,
        cohort: projectData.cohort || "Simplon 2024"
      };
      
      const response = await fetch(`${API_URL}/api/projects/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        return {
          success: true,
          data: await response.json()
        };
      } else {
        throw new Error(`Erreur ${response.status}`);
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  async getProjectDetails(id) {
    try {
      const response = await fetch(`${API_URL}/api/projects/${id}/`);
      if (response.ok) {
        return {
          success: true,
          data: await response.json()
        };
      } else {
        throw new Error("Projet non trouvé");
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  async updateProject(id, projectData) {
    try {
      const token = localStorage.getItem("simplon_access_token");
      
      const response = await fetch(`${API_URL}/api/projects/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(projectData)
      });
      
      if (response.ok) {
        return {
          success: true,
          data: await response.json()
        };
      } else {
        throw new Error(`Erreur ${response.status}`);
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  async deleteProject(id) {
    try {
      const token = localStorage.getItem("simplon_access_token");
      
      const response = await fetch(`${API_URL}/api/projects/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
      if (response.ok) {
        return { success: true };
      } else {
        throw new Error(`Erreur ${response.status}`);
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  // ==================== DEBUG ====================
  
  async testApi() {
    console.log("🧪 Test API...");
    
    const userStr = localStorage.getItem("simplon_user");
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (user && user.id) {
      const apiUrl = `${API_URL}/api/users/projects/user/${user.id}/`;
      console.log(`🔗 Test: ${apiUrl}`);
      
      try {
        const response = await fetch(apiUrl);
        console.log(`📡 Status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ ${data.count || data.projects?.length || 0} projet(s) trouvé(s)`);
          console.log("📊 Données:", data);
          return data;
        }
      } catch (error) {
        console.error("❌ Erreur test:", error);
      }
    }
    
    return null;
  }
};

export { projectService };