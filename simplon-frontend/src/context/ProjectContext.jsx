// src/context/ProjectContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { projectService } from '../services/projects';

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

  const loadUserProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getUserProjects();
      setProjects(data);
      setError('');
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors du chargement des projets');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshProjects = () => {
    loadUserProjects();
  };

  const addProject = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
  };

  const updateProject = (updatedProject) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  };

  const deleteProject = (projectId) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  useEffect(() => {
    loadUserProjects();
  }, []);

  const value = {
    projects,
    loading,
    error,
    refreshProjects,
    addProject,
    updateProject,
    deleteProject
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};