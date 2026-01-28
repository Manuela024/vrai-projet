


// // src/context/ProjectContext.jsx - VERSION AMÉLIORÉE
// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { projectService } from '../services/projects';
// import authService from '../services/auth';

// const ProjectContext = createContext();

// export const useProjects = () => {
//   const context = useContext(ProjectContext);
//   if (!context) {
//     throw new Error('useProjects must be used within a ProjectProvider');
//   }
//   return context;
// };

// export const ProjectProvider = ({ children }) => {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [userProjects, setUserProjects] = useState([]);

//   // Charger tous les projets
//   const loadAllProjects = useCallback(async () => {
//     try {
//       setLoading(true);
//       const data = await projectService.getAllProjects();
//       setProjects(data || []);
//       setError('');
//       console.log('📦 Projets chargés:', data?.length || 0);
//     } catch (err) {
//       console.error('❌ Erreur chargement projets:', err);
//       setError('Erreur lors du chargement des projets');
//       setProjects([]);
      
//       // Fallback: charger depuis localStorage
//       const savedProjects = localStorage.getItem('projects_fallback');
//       if (savedProjects) {
//         setProjects(JSON.parse(savedProjects));
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Charger les projets de l'utilisateur connecté
//   const loadUserProjects = useCallback(async () => {
//     try {
//       const user = authService.getCurrentUser();
//       if (!user) {
//         setUserProjects([]);
//         return;
//       }

//       // Filtrer les projets par auteur
//       const userProjectsData = projects.filter(project => 
//         project.author === user.id || project.author?.id === user.id
//       );
//       setUserProjects(userProjectsData);
//     } catch (err) {
//       console.error('❌ Erreur chargement projets utilisateur:', err);
//       setUserProjects([]);
//     }
//   }, [projects]);

//   // Rafraîchir les projets
//   const refreshProjects = useCallback(() => {
//     loadAllProjects();
//   }, [loadAllProjects]);

//   // Ajouter un projet
//   const addProject = useCallback((newProject) => {
//     setProjects(prev => {
//       const updated = [newProject, ...prev];
//       // Sauvegarder dans localStorage comme fallback
//       localStorage.setItem('projects_fallback', JSON.stringify(updated));
//       return updated;
//     });
    
//     // Mettre à jour les projets utilisateur
//     const user = authService.getCurrentUser();
//     if (user && (newProject.author === user.id || newProject.author?.id === user.id)) {
//       setUserProjects(prev => [newProject, ...prev]);
//     }
    
//     console.log('✅ Projet ajouté:', newProject.title);
//   }, []);

//   // Mettre à jour un projet
//   const updateProject = useCallback((updatedProject) => {
//     setProjects(prev => {
//       const updated = prev.map(project => 
//         project.id === updatedProject.id ? updatedProject : project
//       );
//       // Sauvegarder dans localStorage comme fallback
//       localStorage.setItem('projects_fallback', JSON.stringify(updated));
//       return updated;
//     });

//     // Mettre à jour les projets utilisateur
//     setUserProjects(prev => 
//       prev.map(project => 
//         project.id === updatedProject.id ? updatedProject : project
//       )
//     );
    
//     console.log('✅ Projet mis à jour:', updatedProject.title);
//   }, []);

//   // Supprimer un projet
//   const deleteProject = useCallback(async (projectId) => {
//     try {
//       await projectService.deleteProject(projectId);
      
//       setProjects(prev => {
//         const updated = prev.filter(project => project.id !== projectId);
//         localStorage.setItem('projects_fallback', JSON.stringify(updated));
//         return updated;
//       });
      
//       setUserProjects(prev => prev.filter(project => project.id !== projectId));
      
//       console.log('🗑️ Projet supprimé:', projectId);
//     } catch (err) {
//       console.error('❌ Erreur suppression projet:', err);
//       throw err;
//     }
//   }, []);

//   // Obtenir un projet par ID
//   const getProjectById = useCallback((projectId) => {
//     return projects.find(project => project.id === projectId);
//   }, [projects]);

//   // Charger initialement
//   useEffect(() => {
//     loadAllProjects();
//   }, [loadAllProjects]);

//   // Mettre à jour les projets utilisateur quand projects change
//   useEffect(() => {
//     loadUserProjects();
//   }, [projects, loadUserProjects]);

//   const value = {
//     // Tous les projets
//     projects,
//     // Projets de l'utilisateur connecté
//     userProjects,
//     // État
//     loading,
//     error,
//     // Actions
//     refreshProjects,
//     loadAllProjects,
//     loadUserProjects,
//     addProject,
//     updateProject,
//     deleteProject,
//     getProjectById,
//     // Gestion d'erreur
//     setError
//   };

//   return (
//     <ProjectContext.Provider value={value}>
//       {children}
//     </ProjectContext.Provider>
//   );
// };


// src/context/ProjectContext.jsx - VERSION CORRIGÉE
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { projectService } from '../services/projects';
import authService from '../services/auth';

const ProjectContext = createContext();

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userProjects, setUserProjects] = useState([]);

  // Charger tous les projets
  const loadAllProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await projectService.getAllProjects();
      console.log('📦 Projets chargés depuis API:', data);
      
      // S'assurer que data est un tableau
      const projectsArray = Array.isArray(data) ? data : [];
      setProjects(projectsArray);
      setError('');
      
      // Sauvegarder dans localStorage comme fallback
      localStorage.setItem('projects_fallback', JSON.stringify(projectsArray));
    } catch (err) {
      console.error('❌ Erreur chargement projets:', err);
      setError('Erreur lors du chargement des projets');
      
      // Fallback: charger depuis localStorage
      try {
        const savedProjects = localStorage.getItem('projects_fallback');
        if (savedProjects) {
          const parsedProjects = JSON.parse(savedProjects);
          if (Array.isArray(parsedProjects)) {
            setProjects(parsedProjects);
          } else {
            setProjects([]);
          }
        } else {
          setProjects([]);
        }
      } catch (fallbackErr) {
        console.error('❌ Erreur fallback:', fallbackErr);
        setProjects([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les projets de l'utilisateur connecté
  const loadUserProjects = useCallback(async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user || !user.id) {
        setUserProjects([]);
        return;
      }

      console.log('👤 Chargement projets pour user:', user.id);
      console.log('📊 Total projets disponibles:', projects.length);
      
      // S'assurer que projects est un tableau
      const projectsArray = Array.isArray(projects) ? projects : [];
      
      // Filtrer les projets par auteur
      const userProjectsData = projectsArray.filter(project => {
        if (!project) return false;
        
        // Vérifier l'auteur par ID ou objet author
        const authorId = project.author?.id || project.author;
        return authorId === user.id;
      });
      
      console.log(`🎯 ${userProjectsData.length} projets trouvés pour l'utilisateur`);
      setUserProjects(userProjectsData);
    } catch (err) {
      console.error('❌ Erreur chargement projets utilisateur:', err);
      setUserProjects([]);
    }
  }, [projects]);

  // Rafraîchir les projets
  const refreshProjects = useCallback(() => {
    loadAllProjects();
  }, [loadAllProjects]);

  // Ajouter un projet
  const addProject = useCallback((newProject) => {
    console.log('📝 Ajout projet au contexte:', newProject);
    
    if (!newProject) {
      console.error('❌ Aucun projet à ajouter');
      return;
    }
    
    setProjects(prev => {
      // S'assurer que prev est un tableau
      const currentProjects = Array.isArray(prev) ? prev : [];
      const updated = [newProject, ...currentProjects];
      
      // Sauvegarder dans localStorage comme fallback
      try {
        localStorage.setItem('projects_fallback', JSON.stringify(updated));
      } catch (err) {
        console.error('❌ Erreur sauvegarde localStorage:', err);
      }
      
      return updated;
    });
    
    // Mettre à jour les projets utilisateur
    const user = authService.getCurrentUser();
    if (user && (newProject.author === user.id || newProject.author?.id === user.id)) {
      setUserProjects(prev => {
        const currentUserProjects = Array.isArray(prev) ? prev : [];
        return [newProject, ...currentUserProjects];
      });
    }
  }, []);

  // Mettre à jour un projet
  const updateProject = useCallback((updatedProject) => {
    if (!updatedProject || !updatedProject.id) {
      console.error('❌ Projet invalide pour mise à jour');
      return;
    }
    
    setProjects(prev => {
      const currentProjects = Array.isArray(prev) ? prev : [];
      const updated = currentProjects.map(project => 
        project.id === updatedProject.id ? updatedProject : project
      );
      
      // Sauvegarder dans localStorage comme fallback
      try {
        localStorage.setItem('projects_fallback', JSON.stringify(updated));
      } catch (err) {
        console.error('❌ Erreur sauvegarde localStorage:', err);
      }
      
      return updated;
    });

    // Mettre à jour les projets utilisateur
    setUserProjects(prev => {
      const currentUserProjects = Array.isArray(prev) ? prev : [];
      return currentUserProjects.map(project => 
        project.id === updatedProject.id ? updatedProject : project
      );
    });
    
    console.log('✅ Projet mis à jour:', updatedProject.title);
  }, []);

  // Supprimer un projet
  const deleteProject = useCallback(async (projectId) => {
    try {
      await projectService.deleteProject(projectId);
      
      setProjects(prev => {
        const currentProjects = Array.isArray(prev) ? prev : [];
        const updated = currentProjects.filter(project => project.id !== projectId);
        
        try {
          localStorage.setItem('projects_fallback', JSON.stringify(updated));
        } catch (err) {
          console.error('❌ Erreur sauvegarde localStorage:', err);
        }
        
        return updated;
      });
      
      setUserProjects(prev => {
        const currentUserProjects = Array.isArray(prev) ? prev : [];
        return currentUserProjects.filter(project => project.id !== projectId);
      });
      
      console.log('🗑️ Projet supprimé:', projectId);
    } catch (err) {
      console.error('❌ Erreur suppression projet:', err);
      throw err;
    }
  }, []);

  // Obtenir un projet par ID
  const getProjectById = useCallback((projectId) => {
    const projectsArray = Array.isArray(projects) ? projects : [];
    return projectsArray.find(project => project.id === projectId);
  }, [projects]);

  // Charger initialement
  useEffect(() => {
    loadAllProjects();
  }, [loadAllProjects]);

  // Mettre à jour les projets utilisateur quand projects change
  useEffect(() => {
    loadUserProjects();
  }, [projects, loadUserProjects]);

  const value = {
    // Tous les projets
    projects: Array.isArray(projects) ? projects : [],
    // Projets de l'utilisateur connecté
    userProjects: Array.isArray(userProjects) ? userProjects : [],
    // État
    loading,
    error,
    // Actions
    refreshProjects,
    loadAllProjects,
    loadUserProjects,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    // Gestion d'erreur
    setError
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};