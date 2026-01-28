// // src/context/ProjectContext.jsx
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { projectService } from '../services/projects';

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

//   const loadUserProjects = async () => {
//     try {
//       setLoading(true);
//       const data = await projectService.getUserProjects();
//       setProjects(data);
//       setError('');
//     } catch (err) {
//       console.error('Erreur:', err);
//       setError('Erreur lors du chargement des projets');
//       setProjects([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refreshProjects = () => {
//     loadUserProjects();
//   };

//   const addProject = (newProject) => {
//     setProjects(prev => [newProject, ...prev]);
//   };

//   const updateProject = (updatedProject) => {
//     setProjects(prev => 
//       prev.map(project => 
//         project.id === updatedProject.id ? updatedProject : project
//       )
//     );
//   };

//   const deleteProject = (projectId) => {
//     setProjects(prev => prev.filter(project => project.id !== projectId));
//   };

//   useEffect(() => {
//     loadUserProjects();
//   }, []);

//   const value = {
//     projects,
//     loading,
//     error,
//     refreshProjects,
//     addProject,
//     updateProject,
//     deleteProject
//   };

//   return (
//     <ProjectContext.Provider value={value}>
//       {children}
//     </ProjectContext.Provider>
//   );
// };



// src/context/ProjectContext.jsx - VERSION AMÉLIORÉE
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
      setProjects(data || []);
      setError('');
      console.log('📦 Projets chargés:', data?.length || 0);
    } catch (err) {
      console.error('❌ Erreur chargement projets:', err);
      setError('Erreur lors du chargement des projets');
      setProjects([]);
      
      // Fallback: charger depuis localStorage
      const savedProjects = localStorage.getItem('projects_fallback');
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les projets de l'utilisateur connecté
  const loadUserProjects = useCallback(async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        setUserProjects([]);
        return;
      }

      // Filtrer les projets par auteur
      const userProjectsData = projects.filter(project => 
        project.author === user.id || project.author?.id === user.id
      );
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
    setProjects(prev => {
      const updated = [newProject, ...prev];
      // Sauvegarder dans localStorage comme fallback
      localStorage.setItem('projects_fallback', JSON.stringify(updated));
      return updated;
    });
    
    // Mettre à jour les projets utilisateur
    const user = authService.getCurrentUser();
    if (user && (newProject.author === user.id || newProject.author?.id === user.id)) {
      setUserProjects(prev => [newProject, ...prev]);
    }
    
    console.log('✅ Projet ajouté:', newProject.title);
  }, []);

  // Mettre à jour un projet
  const updateProject = useCallback((updatedProject) => {
    setProjects(prev => {
      const updated = prev.map(project => 
        project.id === updatedProject.id ? updatedProject : project
      );
      // Sauvegarder dans localStorage comme fallback
      localStorage.setItem('projects_fallback', JSON.stringify(updated));
      return updated;
    });

    // Mettre à jour les projets utilisateur
    setUserProjects(prev => 
      prev.map(project => 
        project.id === updatedProject.id ? updatedProject : project
      )
    );
    
    console.log('✅ Projet mis à jour:', updatedProject.title);
  }, []);

  // Supprimer un projet
  const deleteProject = useCallback(async (projectId) => {
    try {
      await projectService.deleteProject(projectId);
      
      setProjects(prev => {
        const updated = prev.filter(project => project.id !== projectId);
        localStorage.setItem('projects_fallback', JSON.stringify(updated));
        return updated;
      });
      
      setUserProjects(prev => prev.filter(project => project.id !== projectId));
      
      console.log('🗑️ Projet supprimé:', projectId);
    } catch (err) {
      console.error('❌ Erreur suppression projet:', err);
      throw err;
    }
  }, []);

  // Obtenir un projet par ID
  const getProjectById = useCallback((projectId) => {
    return projects.find(project => project.id === projectId);
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
    projects,
    // Projets de l'utilisateur connecté
    userProjects,
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