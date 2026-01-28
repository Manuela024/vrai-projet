// src/services/mockApi.js
export const mockApi = {
  // Simuler les projets de l'utilisateur
  getUserProjects() {
    console.log('📡 [MOCK API] Récupération des projets simulés');
    
    // Projets fictifs
    return Promise.resolve({
      success: true,
      data: [
        {
          id: 1,
          title: "Projet IA pour la santé",
          description: "Système de diagnostic assisté par IA",
          status: "published",
          created_at: "2024-01-15T10:30:00Z",
          updated_at: "2024-01-20T14:45:00Z"
        },
        {
          id: 2,
          title: "Application de gestion des compétences",
          description: "Plateforme pour évaluer et développer les compétences",
          status: "draft",
          created_at: "2024-01-10T09:15:00Z",
          updated_at: "2024-01-18T16:20:00Z"
        }
      ]
    });
  },

  // Simuler tous les projets publics
  getAllProjects() {
    console.log('📡 [MOCK API] Récupération de tous les projets');
    
    return Promise.resolve({
      success: true,
      data: [
        {
          id: 1,
          title: "Projet IA pour la santé",
          description: "Système de diagnostic assisté par IA",
          status: "published",
          author: { username: "admin", first_name: "Admin" },
          created_at: "2024-01-15T10:30:00Z",
          likes_count: 15,
          views_count: 120
        },
        {
          id: 2,
          title: "Application de gestion des compétences",
          description: "Plateforme pour évaluer et développer les compétences",
          status: "published",
          author: { username: "user1", first_name: "John" },
          created_at: "2024-01-10T09:15:00Z",
          likes_count: 8,
          views_count: 85
        },
        {
          id: 3,
          title: "Système de réservation intelligent",
          description: "Application de gestion de rendez-vous",
          status: "published",
          author: { username: "marie", first_name: "Marie" },
          created_at: "2024-01-05T14:20:00Z",
          likes_count: 22,
          views_count: 200
        }
      ]
    });
  },

  // Simuler l'upload d'un projet
  uploadProject(projectData) {
    console.log('📡 [MOCK API] Upload de projet simulé:', projectData);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Projet créé avec succès !",
          project: {
            id: Math.floor(Math.random() * 1000) + 10,
            ...projectData,
            status: "published",
            created_at: new Date().toISOString()
          }
        });
      }, 1500); // Simuler un délai réseau
    });
  },

  // Simuler la suppression
  deleteProject(projectId) {
    console.log(`📡 [MOCK API] Suppression du projet ${projectId}`);
    
    return Promise.resolve({
      success: true,
      message: "Projet supprimé avec succès"
    });
  }
};

export default mockApi;