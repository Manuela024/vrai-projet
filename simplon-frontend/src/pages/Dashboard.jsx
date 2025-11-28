// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectService } from '../services/projects';
import { authService } from '../services/auth';
import { useProjects } from '../context/ProjectContext';

const Dashboard = () => {
  // ⭐ UTILISATION DU CONTEXTE GLOBAL
  const { projects, loading, error, deleteProject, refreshProjects } = useProjects();
  const [user, setUser] = useState(null);
  const [downloading, setDownloading] = useState({}); // État pour gérer les téléchargements individuels
  
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    
    // ⭐ FORCE LE RECHARGEMENT AU MONTAGE POUR ÊTRE SÛR
    refreshProjects();
  }, []); // ⭐ CORRECTION: Retirer refreshProjects des dépendances

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      return;
    }

    try {
      await projectService.deleteProject(projectId);
      deleteProject(projectId); // ⭐ UTILISE LA FONCTION DU CONTEXTE
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
    }
  };

  // ⭐ NOUVELLE FONCTION : Téléchargement du projet en ZIP
  const handleDownloadProject = async (projectId, projectTitle, fileName) => {
    setDownloading(prev => ({ ...prev, [projectId]: true }));

    try {
      console.log('📥 Début du téléchargement du projet:', projectTitle);
      
      // Essayer d'abord le téléchargement via le service
      await projectService.downloadProjectFile(projectId, fileName || projectTitle);
      console.log('✅ Téléchargement réussi pour le projet:', projectTitle);
      
    } catch (error) {
      console.error(`❌ Erreur téléchargement projet ${projectId}:`, error);
      
      // Fallback: Téléchargement simulé en ZIP
      console.log('🔄 Téléchargement ZIP simulé activé');
      await simulateZipDownload(projectId, projectTitle);
      
    } finally {
      setDownloading(prev => ({ ...prev, [projectId]: false }));
    }
  };

  // ⭐ FONCTION : Simulation de téléchargement ZIP simplifiée
  const simulateZipDownload = async (projectId, projectTitle) => {
    try {
      // Trouver le projet pour avoir plus d'informations
      const project = projects.find(p => p.id === projectId);
      
      // Créer un contenu simple pour le ZIP
      const content = `PROJET: ${projectTitle}
AUTEUR: ${project?.author_name || user?.username || 'Utilisateur'}
COHORTE: ${project?.cohort || 'Non spécifiée'}
TECHNOLOGIES: ${project?.technologies || 'Non spécifiées'}
DESCRIPTION: ${project?.description || 'Aucune description'}
STATUT: ${project?.status || 'Inconnu'}
DATE: ${project?.created_at ? new Date(project.created_at).toLocaleDateString('fr-FR') : 'Date inconnue'}

=== CONTENU DU PROJET ===

Ceci est une simulation du fichier ZIP du projet.
En production, ce fichier contiendrait le code source complet.

Structure typique:
- src/ (code source)
- public/ (fichiers publics)
- package.json (dépendances)
- README.md (documentation)

Généré le: ${new Date().toLocaleString()}
Plateforme Simplon`;

      // Créer et télécharger le fichier
      const blob = new Blob([content], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectTitle.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-${projectId}.zip`;
      document.body.appendChild(a);
      a.click();
      
      // Nettoyer
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('✅ Téléchargement ZIP simulé réussi');
      
    } catch (simError) {
      console.error('❌ Erreur téléchargement ZIP simulé:', simError);
      
      // Fallback ultime: téléchargement en texte
      const content = `Projet: ${projectTitle}
Auteur: ${project?.author_name || user?.username || 'Utilisateur'}
Cohort: ${project?.cohort || 'Non spécifiée'}
Technologies: ${project?.technologies || 'Non spécifiées'}
Description: ${project?.description || 'Aucune description'}
Statut: ${project?.status || 'Inconnu'}

Téléchargé le: ${new Date().toLocaleString()}

Note: Le fichier ZIP original n'est pas disponible.`;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectTitle.replace(/\s+/g, '-').toLowerCase()}-details.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Afficher un squelette de chargement
  if (loading) {
    return (
      <div className="font-display bg-background-light dark:bg-background-dark min-h-screen">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0 bg-[#0A2540] text-white flex flex-col p-4">
            <div className="flex items-center gap-3 px-3 py-2 mb-8">
              <div className="bg-gray-600 rounded-full size-10 animate-pulse"></div>
              <div className="flex flex-col">
                <div className="h-4 bg-gray-600 rounded w-20 mb-1 animate-pulse"></div>
                <div className="h-3 bg-gray-600 rounded w-16 animate-pulse"></div>
              </div>
            </div>
            
            {/* Navigation skeleton */}
            <div className="flex flex-col gap-2 flex-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg">
                  <div className="bg-gray-600 rounded size-6 animate-pulse"></div>
                  <div className="h-4 bg-gray-600 rounded w-24 animate-pulse"></div>
                </div>
              ))}
            </div>
          </aside>
          
          {/* Content skeleton */}
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-8 animate-pulse"></div>
              
              {/* Table skeleton */}
              <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark/50">
                <div className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  {/* Header skeleton */}
                  <div className="bg-gray-50 dark:bg-white/10 px-6 py-3">
                    <div className="flex space-x-6">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Rows skeleton */}
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="px-6 py-4">
                        <div className="flex space-x-6 items-center">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse ml-auto"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen">
      <div className="flex min-h-screen">
        
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 bg-[#0A2540] text-white flex flex-col p-4 sticky top-0 h-screen">
          <div className="flex items-center gap-3 px-3 py-2 mb-8">
            {/* <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" 
              style={{ 
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCFDn1tZoHFvMjYIPbnv1uGv8Lks2R0QpWwegwyhfrhzF8M4YyU5yjGEPbRXDqqoQJok0v5QCgQtw9nzWMIn9a-cc4A5rlXVrjOUxemqeTXkPNG46a_rT53sjQU4YOHC5IVLWN_3bona_6h0dlLK5323xW9FAorS84K7RF_8w9jh4pmkMQa2anu2CAudT3xUWRPQFm6g-hi717S2XwdAc0kQJ08A49riltIQwWcQKtqLA0dQyeprJG7uOcj_hLrL0wS4hcp3dzcVrw")' 
              }}
            ></div> */}
                           <img 
  src="/src/logo.png" 
  alt="Logo Simplon" 
  className="size-10 rounded-full object-cover"
/>
            <div className="flex flex-col">
              <h1 className="text-white text-base font-medium leading-normal">Simplon</h1>
              <p className="text-gray-400 text-sm font-normal leading-normal">Code Platform</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 flex-1">
            <Link 
              to="/dashboard" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-white"
            >
              <span className="material-symbols-outlined">folder</span>
              <p className="text-sm font-medium leading-normal">Mes projets</p>
            </Link>
            <Link 
              to="/upload" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined">upload_file</span>
              <p className="text-sm font-medium leading-normal">Déposer un projet</p>
            </Link>
            <Link 
              to="/explore" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined">explore</span>
              <p className="text-sm font-medium leading-normal">Explorer les projets</p>
            </Link>
            {/* <Link 
              to="/profile" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined">person</span>
              <p className="text-sm font-medium leading-normal">Profil</p>
            </Link> */}
          </nav>

          {/* Déconnexion */}
          <div className="mt-auto">
                   <Link 
              to="/profile" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined">person</span>
              <p className="text-sm font-medium leading-normal">Profil</p>
            </Link>

<Link to="/parametre" className="flex items-center gap-3 rounded px-3 py-2 text-white/70 hover:bg-[#003265] hover:text-white">
              <span className="material-symbols-outlined">settings</span>
              <span>Paramètre</span>
            </Link>


            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors w-full text-left"
            >
              <span className="material-symbols-outlined">logout</span>
              <p className="text-sm font-medium leading-normal">Déconnexion</p>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header avec bouton d'action */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-[#1c0d0d] dark:text-gray-200 text-4xl font-black leading-tight tracking-[-0.033em]">
                  Mes Projets
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal mt-2">
                  Gérez et partagez vos projets de code ici. {projects.length} projet(s) trouvé(s)
                </p>
              </div>
              <button
                onClick={() => navigate('/upload')}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Nouveau projet
              </button>
            </div>

            {error && (
              <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-200">
                <div className="flex items-center justify-between">
                  <span>{error}</span>
                  <button 
                    onClick={refreshProjects}
                    className="text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 underline"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            )}

            {/* Table des projets */}
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark/50 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-white/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Nom du projet
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Technologies
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Date de dépôt
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-background-dark/50 divide-y divide-gray-200 dark:divide-gray-700">
                      {projects && projects.length > 0 ? projects.map((project) => (
                        <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                                  <span className="material-symbols-outlined text-white text-sm">
                                    code
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                  {project.title || 'Sans titre'}
                                </div>
                                {project.description && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                    {project.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                              {project.status === 'published' ? '📢 Publié' : 
                               project.status === 'draft' ? '📝 Brouillon' : 
                               project.status === 'pending' ? '⏳ En attente' : 
                               '❓ ' + (project.status || 'Inconnu')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {Array.isArray(project.technologies) 
                                ? project.technologies.slice(0, 3).map((tech, index) => (
                                    <span 
                                      key={index}
                                      className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
                                    >
                                      {tech}
                                    </span>
                                  ))
                                : project.technologies || 'Non spécifié'
                              }
                              {Array.isArray(project.technologies) && project.technologies.length > 3 && (
                                <span className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-1 rounded text-xs">
                                  +{project.technologies.length - 3}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-base">calendar_today</span>
                              {formatDate(project.created_at || project.updated_at || project.date)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {/* Bouton Voir le projet */}
                              <Link 
                                to={`/project/${project.id}`}
                                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                title="Voir le projet"
                              >
                                <span className="material-symbols-outlined text-lg">visibility</span>
                              </Link>

                              {/* ⭐ BOUTON : Télécharger le projet en ZIP */}
                              <button 
                                onClick={() => handleDownloadProject(project.id, project.title, project.file || `projet-${project.id}.zip`)}
                                disabled={downloading[project.id]}
                                className={`text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${
                                  downloading[project.id] ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                title="Télécharger le projet (ZIP)"
                              >
                                {downloading[project.id] ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent"></div>
                                ) : (
                                  <span className="material-symbols-outlined text-lg">download</span>
                                )}
                              </button>

                              {/* Bouton Modifier le projet */}
                              <button 
                                onClick={() => navigate(`/upload?edit=${project.id}`)}
                                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                title="Modifier le projet"
                              >
                                <span className="material-symbols-outlined text-lg">edit</span>
                              </button>

                              {/* Bouton Supprimer le projet */}
                              <button 
                                onClick={() => handleDeleteProject(project.id)}
                                className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                title="Supprimer le projet"
                              >
                                <span className="material-symbols-outlined text-lg">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-16 text-center">
                            <div className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                              <div className="bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-3xl text-gray-400">
                                  folder_off
                                </span>
                              </div>
                              <h3 className="text-lg font-medium mb-2">Aucun projet trouvé</h3>
                              <p className="mb-6 text-sm">Commencez par créer votre premier projet pour le voir apparaître ici</p>
                              <button
                                onClick={() => navigate('/upload')}
                                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                              >
                                <span className="material-symbols-outlined">add</span>
                                Créer mon premier projet
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;