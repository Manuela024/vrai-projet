// import { Link } from 'react-router-dom';

// const ProjectSuccess = () => {
//   return (
//     <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-[#1c0d0e] dark:text-[#f8f5f6]">
      
//       {/* Header */}
//       <header className="w-full px-4 sm:px-6 lg:px-10 py-3">
//         <div className="mx-auto flex max-w-5xl items-center justify-between border-b border-solid border-gray-200 dark:border-gray-700 pb-3">
//           <div className="flex items-center gap-4 text-primary">
//             <div className="size-6">
//               <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z" fill="currentColor"></path>
//               </svg>
//             </div>
//             <h2 className="text-lg font-bold tracking-tight text-[#1c0d0e] dark:text-[#fcf8f8]">Simplon Projects</h2>
//           </div>
          
//           <div className="hidden sm:flex items-center gap-8">
//             <Link to="/dashboard" className="text-sm font-medium text-[#1c0d0e] dark:text-[#fcf8f8] hover:text-primary dark:hover:text-primary">
//               Dashboard
//             </Link>
//             <Link to="/dashboard" className="text-sm font-medium text-[#1c0d0e] dark:text-[#fcf8f8] hover:text-primary dark:hover:text-primary">
//               Mes Projets
//             </Link>
//             <Link to="/upload" className="text-sm font-medium text-[#1c0d0e] dark:text-[#fcf8f8] hover:text-primary dark:hover:text-primary">
//               Déposer un projet
//             </Link>
//           </div>
          
//           <div className="flex items-center gap-4">
//             <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary/10 text-primary text-sm font-bold leading-normal tracking-wide hover:bg-primary/20">
//               <span className="truncate">Déconnexion</span>
//             </button>
//             <div 
//               className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
//               style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCsAkhqXIncaDMbhVFxlEnY8Aly165zx8o8fXjAP5MGT1WvQch7z3lPexAEbmVxZPXJ8S1AilNfwTVUGyEZhocejXNKiYWaQra9TGRT7Ot9HJy2wWJ3xw26LwPs-a65x_RQHPUuKKW6IQjayugYCPwAH7VuAlVtxDNg8Dooaqc0ZWE9rNPcuL4flVvVStz_bx_8snrhAGADKRCKbmEOnmvv6r7qfRev0fiCnCKn9UVdPSFhSFpZT5Q9eky7VaZPJffbC1Pp9Ujvgik")'}}
//             ></div>
//           </div>
//         </div>
//       </header>

//       {/* Contenu principal */}
//       <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
//         <div className="w-full max-w-2xl text-center">
          
//           {/* Icône de succès */}
//           <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 mb-6">
//             <span className="material-symbols-outlined text-4xl text-green-600 dark:text-green-400">task_alt</span>
//           </div>
          
//           {/* Titre */}
//           <h1 className="text-[#1c0d0e] dark:text-white text-3xl sm:text-4xl font-bold tracking-tight">
//             Votre projet a été déposé avec succès !
//           </h1>
          
//           {/* Description */}
//           <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
//             Votre projet a bien été ajouté à la plateforme. Vous pouvez le consulter dès maintenant dans votre liste de projets.
//           </p>

//           {/* Récapitulatif */}
//           <div className="mt-8 text-left bg-white dark:bg-background-dark/80 border border-gray-200 dark:border-gray-700/60 rounded-xl shadow-sm">
//             <div className="p-4 sm:p-6">
//               <p className="text-lg font-bold leading-tight tracking-tight text-[#1c0d0e] dark:text-white">
//                 Récapitulatif du dépôt
//               </p>
//             </div>
            
//             <div className="border-t border-gray-200 dark:border-gray-700/60 px-4 sm:px-6 grid gap-y-4 py-5 text-sm">
              
//               <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-x-6 gap-y-1">
//                 <p className="font-medium text-gray-500 dark:text-gray-400">Titre du Projet:</p>
//                 <p className="text-[#1c0d0e] dark:text-gray-200">Portfolio Interactif en React</p>
//               </div>
              
//               <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-x-6 gap-y-1">
//                 <p className="font-medium text-gray-500 dark:text-gray-400">Technologies:</p>
//                 <p className="text-[#1c0d0e] dark:text-gray-200">React, Tailwind CSS, Framer Motion</p>
//               </div>
              
//               <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-x-6 gap-y-1">
//                 <p className="font-medium text-gray-500 dark:text-gray-400">Date de dépôt:</p>
//                 <p className="text-[#1c0d0e] dark:text-gray-200">24 Octobre 2023</p>
//               </div>
              
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
//             <Link 
//               to="/dashboard"
//               className="flex w-full sm:w-auto min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
//             >
//               <span className="truncate">Voir mes projets</span>
//             </Link>
            
//             <Link 
//               to="/upload"
//               className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
//             >
//               Déposer un autre projet
//             </Link>
//           </div>
          
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ProjectSuccess;

// src/pages/ProjectSuccess.jsx
import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
// import authService from '../services/auth';
import authService from '../services/auth'; // ⭐ CHANGEMENT ICI

const ProjectSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshProjects } = useProjects();
  
  // Récupère le projet depuis le state de navigation ou les paramètres d'URL
  const project = location.state?.project;
  const projectId = new URLSearchParams(location.search).get('projectId');

  const handleLogout = () => {
    authService.logout();
  };

  // Formatage de la date
  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString('fr-FR');
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Si pas de projet dans le state, on rafraîchit les données
  useEffect(() => {
    if (!project) {
      refreshProjects();
    }
  }, [project, refreshProjects]);

  // Si aucun projet n'est disponible, rediriger vers le dashboard après un délai
  useEffect(() => {
    if (!project && !projectId) {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [project, projectId, navigate]);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-[#1c0d0e] dark:text-[#f8f5f6]">
      
      {/* Header */}
      <header className="w-full px-4 sm:px-6 lg:px-10 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between border-b border-solid border-gray-200 dark:border-gray-700 pb-3">
          <div className="flex items-center gap-4 text-primary">
            <div className="size-6">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-lg font-bold tracking-tight text-[#1c0d0e] dark:text-[#fcf8f8]">Simplon Projects</h2>
          </div>
          
          <div className="hidden sm:flex items-center gap-8">
            <Link to="/dashboard" className="text-sm font-medium text-[#1c0d0e] dark:text-[#fcf8f8] hover:text-primary dark:hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/dashboard" className="text-sm font-medium text-[#1c0d0e] dark:text-[#fcf8f8] hover:text-primary dark:hover:text-primary transition-colors">
              Mes Projets
            </Link>
            <Link to="/upload" className="text-sm font-medium text-[#1c0d0e] dark:text-[#fcf8f8] hover:text-primary dark:hover:text-primary transition-colors">
              Déposer un projet
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary/10 text-primary text-sm font-bold leading-normal tracking-wide hover:bg-primary/20 transition-colors"
            >
              <span className="truncate">Déconnexion</span>
            </button>
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCsAkhqXIncaDMbhVFxlEnY8Aly165zx8o8fXjAP5MGT1WvQch7z3lPexAEbmVxZPXJ8S1AilNfwTVUGyEZhocejXNKiYWaQra9TGRT7Ot9HJy2wWJ3xw26LwPs-a65x_RQHPUuKKW6IQjayugYCPwAH7VuAlVtxDNg8Dooaqc0ZWE9rNPcuL4flVvVStz_bx_8snrhAGADKRCKbmEOnmvv6r7qfRev0fiCnCKn9UVdPSFhSFpZT5Q9eky7VaZPJffbC1Pp9Ujvgik")'
              }}
            ></div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl text-center">
          
          {/* Icône de succès animée */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 mb-6 animate-pulse">
            <span className="material-symbols-outlined text-4xl text-green-600 dark:text-green-400">task_alt</span>
          </div>
          
          {/* Titre */}
          <h1 className="text-[#1c0d0e] dark:text-white text-3xl sm:text-4xl font-bold tracking-tight">
            {project ? 'Projet déposé avec succès !' : 'Dépôt en cours de traitement...'}
          </h1>
          
          {/* Description */}
          <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
            {project 
              ? 'Votre projet a bien été ajouté à la plateforme. Vous pouvez le consulter dès maintenant dans votre liste de projets.'
              : 'Votre projet est en cours de traitement. Redirection automatique vers le dashboard...'
            }
          </p>

          {/* Récapitulatif du projet (uniquement si disponible) */}
          {project && (
            <div className="mt-8 text-left bg-white dark:bg-background-dark/80 border border-gray-200 dark:border-gray-700/60 rounded-xl shadow-sm">
              <div className="p-4 sm:p-6">
                <p className="text-lg font-bold leading-tight tracking-tight text-[#1c0d0e] dark:text-white">
                  Récapitulatif du dépôt
                </p>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700/60 px-4 sm:px-6 grid gap-y-4 py-5 text-sm">
                
                <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-x-6 gap-y-1">
                  <p className="font-medium text-gray-500 dark:text-gray-400">Titre du Projet:</p>
                  <p className="text-[#1c0d0e] dark:text-gray-200 font-medium">
                    {project.title || 'Sans titre'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-x-6 gap-y-1">
                  <p className="font-medium text-gray-500 dark:text-gray-400">Description:</p>
                  <p className="text-[#1c0d0e] dark:text-gray-200">
                    {project.description || 'Aucune description fournie'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-x-6 gap-y-1">
                  <p className="font-medium text-gray-500 dark:text-gray-400">Technologies:</p>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(project.technologies) && project.technologies.length > 0 ? (
                      project.technologies.map((tech, index) => (
                        <span 
                          key={index}
                          className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">Non spécifié</span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-x-6 gap-y-1">
                  <p className="font-medium text-gray-500 dark:text-gray-400">Statut:</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    project.status === 'published' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : project.status === 'draft' 
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {project.status === 'published' ? '📢 Publié' : 
                     project.status === 'draft' ? '📝 Brouillon' : 
                     project.status === 'pending' ? '⏳ En attente' : 
                     '❓ ' + (project.status || 'Inconnu')}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-x-6 gap-y-1">
                  <p className="font-medium text-gray-500 dark:text-gray-400">Date de dépôt:</p>
                  <p className="text-[#1c0d0e] dark:text-gray-200">
                    {formatDate(project.created_at || project.updated_at)}
                  </p>
                </div>

                {/* Lien GitHub si disponible */}
                {project.github_url && (
                  <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-x-6 gap-y-1">
                    <p className="font-medium text-gray-500 dark:text-gray-400">Lien GitHub:</p>
                    <a 
                      href={project.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors truncate"
                    >
                      {project.github_url}
                    </a>
                  </div>
                )}
                
              </div>
            </div>
          )}

          {/* Indicateur de chargement si pas de projet */}
          {!project && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span>Chargement des données du projet...</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/dashboard"
              className="flex w-full sm:w-auto min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
            >
              <span className="truncate flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">dashboard</span>
                Voir mes projets
              </span>
            </Link>
            
            <Link 
              to="/upload"
              className="flex w-full sm:w-auto min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="truncate flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">add</span>
                Déposer un autre projet
              </span>
            </Link>
          </div>

          {/* Lien rapide vers le projet si disponible */}
          {project && (
            <div className="mt-6">
              <Link 
                to={`/project/${project.id}`}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base">visibility</span>
                Voir la page du projet
              </Link>
            </div>
          )}
          
        </div>
      </main>
    </div>
  );
};

export default ProjectSuccess;
