


// // src/components/admin/ProjectSuccess.jsx
// import React, { useEffect, useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import authService from '../../services/auth';

// const ProjectSuccess = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [project, setProject] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // Récupérer l'utilisateur
//     const currentUser = authService.getCurrentUser();
//     setUser(currentUser);

//     console.log('📍 ProjectSuccess - Location state:', location.state);
//     console.log('📍 ProjectSuccess - Location:', location);

//     // Essayer de récupérer le projet depuis plusieurs sources
//     let projectData = null;
//     let editing = false;

//     // 1. Depuis le state de navigation
//     if (location.state) {
//       projectData = location.state.project;
//       editing = location.state.isEditing || false;
//       console.log('✅ Projet récupéré depuis state:', projectData);
//     }
    
//     // 2. Depuis sessionStorage (fallback)
//     if (!projectData) {
//       const savedProject = sessionStorage.getItem('lastCreatedProject');
//       if (savedProject) {
//         projectData = JSON.parse(savedProject);
//         editing = sessionStorage.getItem('lastProjectAction') === 'edit';
//         console.log('✅ Projet récupéré depuis sessionStorage:', projectData);
//       }
//     }

//     // 3. Depuis localStorage (fallback ultime)
//     if (!projectData) {
//       const allProjects = JSON.parse(localStorage.getItem('projects_fallback') || '[]');
//       if (allProjects.length > 0) {
//         projectData = allProjects[0]; // Prendre le plus récent
//         console.log('✅ Projet récupéré depuis localStorage (fallback):', projectData);
//       }
//     }

//     if (projectData) {
//       setProject(projectData);
//       setIsEditing(editing);
      
//       // Sauvegarder dans sessionStorage pour persistance
//       sessionStorage.setItem('lastCreatedProject', JSON.stringify(projectData));
//       sessionStorage.setItem('lastProjectAction', editing ? 'edit' : 'create');
//     } else {
//       console.warn('⚠️ Aucun projet trouvé pour afficher');
//     }

//     setLoading(false);

//     // Nettoyer sessionStorage après 30 secondes
//     const cleanupTimer = setTimeout(() => {
//       sessionStorage.removeItem('lastCreatedProject');
//       sessionStorage.removeItem('lastProjectAction');
//     }, 30000);

//     return () => clearTimeout(cleanupTimer);
//   }, [location]);

//   // Fonction pour formater la date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'Date non disponible';
    
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('fr-FR', {
//         day: 'numeric',
//         month: 'long',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch (error) {
//       return dateString;
//     }
//   };

//   // Fonction pour obtenir l'avatar de l'utilisateur
//   const getUserAvatar = () => {
//     if (user?.profile_picture) return user.profile_picture;
//     if (user?.avatar) return user.avatar;
//     return "https://lh3.googleusercontent.com/aida-public/A6AXuA8VxS_x8jwDh_tF-ygq2OirDNuL2iAY7iNaZiMUFP0ulnWyCKEm_PI1Gc0ciC2TN952cGudRb6wvbJbWPWVGo903BPnvhSXGPboDyDNJD8iZzXEJfiOfRe0gXFHiPnJlAg73UmjlUMXqsg7hI0ME57JNKDz_c82g19tlQb4FmCTdsxqi8jz0nMLTwlAIUvOj4x0iE62XhOCawgbKi0PPQiv7Cz6CfFpzMGaxuCg9bUKa62_BIjWKT5M4ZTd9MB-KOhIR0FHkzz25w";
//   };

//   // Fonction pour obtenir le nom complet
//   const getUserFullName = () => {
//     if (user?.first_name && user?.last_name) return `${user.first_name} ${user.last_name}`;
//     if (user?.username) return user.username;
//     return 'Utilisateur';
//   };

//   // Affichage pendant le chargement
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 dark:text-gray-400">Chargement des détails du projet...</p>
//         </div>
//       </div>
//     );
//   }

//   // Si pas de projet trouvé
//   if (!project) {
//     return (
//       <div className="min-h-screen bg-background-light dark:bg-background-dark">
//         <div className="container mx-auto px-4 py-16">
//           <div className="max-w-lg mx-auto bg-white dark:bg-[#001F3F] rounded-xl shadow-lg p-8 text-center">
//             <div className="text-red-500 mb-6">
//               <span className="material-symbols-outlined text-6xl">error</span>
//             </div>
//             <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
//               Aucun projet spécifié
//             </h1>
//             <p className="text-gray-600 dark:text-gray-300 mb-8">
//               Impossible de trouver les détails du projet. 
//               {isEditing ? ' Le projet modifié n\'a pas pu être récupéré.' : ' Le projet créé n\'a pas pu être récupéré.'}
//             </p>
//             <div className="space-y-4">
//               <button
//                 onClick={() => navigate('/admin/projects')}
//                 className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition"
//               >
//                 Retour aux projets
//               </button>
//               <button
//                 onClick={() => navigate('/admin/submit-project')}
//                 className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
//               >
//                 Créer un nouveau projet
//               </button>
//               <Link
//                 to="/admin"
//                 className="block text-primary dark:text-blue-400 hover:underline py-2"
//               >
//                 Retour au tableau de bord
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Affichage normal du succès
//   return (
//     <div className="min-h-screen bg-background-light dark:bg-background-dark">
//       <div className="container mx-auto px-4 py-8">
        
//         {/* Header avec profil utilisateur */}
//         <header className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-[#001F3F] dark:text-white">
//               {isEditing ? 'Projet modifié avec succès !' : 'Projet soumis avec succès !'}
//             </h1>
//             <p className="text-gray-600 dark:text-gray-400 mt-2">
//               {isEditing 
//                 ? 'Votre projet a été mis à jour avec succès.' 
//                 : 'Félicitations ! Votre projet a été soumis.'}
//             </p>
//           </div>
          
//           {/* Profil utilisateur */}
//           <div className="flex items-center gap-3">
//             <div 
//               className="w-12 h-12 rounded-full border-2 border-primary bg-cover bg-center"
//               style={{ backgroundImage: `url(${getUserAvatar()})` }}
//               title={getUserFullName()}
//             ></div>
//             <div className="text-right">
//               <p className="font-medium text-[#001F3F] dark:text-white">{getUserFullName()}</p>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 {user?.cohort || 'Stagiaire Simplon'}
//               </p>
//             </div>
//           </div>
//         </header>

//         {/* Carte de succès */}
//         <div className="max-w-4xl mx-auto">
//           <div className="bg-white dark:bg-[#001F3F]/30 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
            
//             {/* Bannière de succès */}
//             <div className="flex items-center gap-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
//               <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
//                 <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-4xl">
//                   check_circle
//                 </span>
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold text-green-800 dark:text-green-300">
//                   {isEditing ? 'Modification réussie !' : 'Soumission réussie !'}
//                 </h2>
//                 <p className="text-green-700 dark:text-green-400 mt-1">
//                   {isEditing 
//                     ? 'Votre projet a été mis à jour et est disponible dans votre portfolio.'
//                     : 'Votre projet a été enregistré et sera bientôt disponible pour la communauté.'}
//                 </p>
//               </div>
//             </div>

//             {/* Détails du projet */}
//             <div className="mb-8">
//               <h3 className="text-2xl font-bold text-[#001F3F] dark:text-white mb-6">
//                 Détails du projet
//               </h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Colonne gauche */}
//                 <div className="space-y-4">
//                   <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg">
//                     <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Nom du projet</p>
//                     <p className="text-lg font-semibold text-[#001F3F] dark:text-white">{project.title}</p>
//                   </div>
                  
//                   <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg">
//                     <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Technologies</p>
//                     <p className="text-[#001F3F] dark:text-white">
//                       {project.technologies || 'Non spécifiées'}
//                     </p>
//                   </div>
                  
//                   <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg">
//                     <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Cohorte</p>
//                     <p className="text-[#001F3F] dark:text-white">{project.cohort || 'Non spécifiée'}</p>
//                   </div>
//                 </div>
                
//                 {/* Colonne droite */}
//                 <div className="space-y-4">
//                   {project.github_url && (
//                     <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg">
//                       <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">GitHub</p>
//                       <a 
//                         href={project.github_url} 
//                         target="_blank" 
//                         rel="noopener noreferrer"
//                         className="text-primary hover:underline flex items-center gap-2"
//                       >
//                         <span className="material-symbols-outlined">link</span>
//                         {project.github_url.substring(0, 40)}...
//                       </a>
//                     </div>
//                   )}
                  
//                   {project.demo_url && (
//                     <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg">
//                       <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Démo</p>
//                       <a 
//                         href={project.demo_url} 
//                         target="_blank" 
//                         rel="noopener noreferrer"
//                         className="text-primary hover:underline flex items-center gap-2"
//                       >
//                         <span className="material-symbols-outlined">open_in_new</span>
//                         {project.demo_url.substring(0, 40)}...
//                       </a>
//                     </div>
//                   )}
                  
//                   <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg">
//                     <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date de {isEditing ? 'modification' : 'soumission'}</p>
//                     <p className="text-[#001F3F] dark:text-white">
//                       {formatDate(project.updated_at || project.created_at || new Date().toISOString())}
//                     </p>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Description */}
//               {project.description && (
//                 <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
//                   <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Description</p>
//                   <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
//                     {project.description}
//                   </p>
//                 </div>
//               )}
              
//               {/* Tags */}
//               {project.tags && (
//                 <div className="mt-6">
//                   <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</p>
//                   <div className="flex flex-wrap gap-2">
//                     {project.tags.split(',').map((tag, index) => (
//                       <span 
//                         key={index}
//                         className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
//                       >
//                         {tag.trim()}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Boutons d'action */}
//             <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <button
//                   onClick={() => navigate('/admin/projects')}
//                   className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-dark transition flex items-center justify-center gap-2"
//                 >
//                   <span className="material-symbols-outlined">folder</span>
//                   Voir tous mes projets
//                 </button>
                
//                 <button
//                   onClick={() => navigate('/admin/submit-project')}
//                   className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2"
//                 >
//                   <span className="material-symbols-outlined">add</span>
//                   Créer un autre projet
//                 </button>
//               </div>
              
//               <div className="mt-4 text-center">
//                 <Link
//                   to="/admin"
//                   className="inline-flex items-center gap-2 text-primary hover:text-primary-dark dark:text-blue-400 dark:hover:text-blue-300"
//                 >
//                   <span className="material-symbols-outlined">arrow_back</span>
//                   Retour au tableau de bord
//                 </Link>
//               </div>
//             </div>

//             {/* Message informatif */}
//             <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
//               <div className="flex items-start gap-3">
//                 <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 mt-0.5">info</span>
//                 <div>
//                   <p className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">
//                     Prochaines étapes
//                   </p>
//                   <ul className="text-yellow-700 dark:text-yellow-400 text-sm space-y-1">
//                     <li>• Votre projet sera visible dans votre portfolio</li>
//                     <li>• Vous pouvez le modifier à tout moment</li>
//                     <li>• Partagez-le avec la communauté Simplon</li>
//                     <li>• Consultez régulièrement les commentaires et retours</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectSuccess;

// // src/components/admin/ProjectSuccess.jsx - VERSION SIMPLIFIÉE POUR DÉBOGAGE
// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// const ProjectSuccess = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [project, setProject] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     console.log('🔍 DEBUG ProjectSuccess - Location:', location);
//     console.log('🔍 DEBUG Location state:', location.state);
    
//     // Vérifier toutes les sources possibles
//     console.log('🔍 DEBUG sessionStorage lastProjectSuccess:', sessionStorage.getItem('lastProjectSuccess'));
//     console.log('🔍 DEBUG localStorage lastProjectSuccess:', localStorage.getItem('lastProjectSuccess'));
//     console.log('🔍 DEBUG localStorage lastCreatedProject:', localStorage.getItem('lastCreatedProject'));
    
//     let projectData = null;
    
//     // 1. Priorité au state de navigation
//     if (location.state?.project) {
//       projectData = location.state.project;
//       console.log('✅ Projet trouvé dans location.state');
//     }
//     // 2. Sinon sessionStorage
//     else if (sessionStorage.getItem('lastProjectSuccess')) {
//       projectData = JSON.parse(sessionStorage.getItem('lastProjectSuccess'));
//       console.log('✅ Projet trouvé dans sessionStorage');
//     }
//     // 3. Sinon localStorage
//     else if (localStorage.getItem('lastProjectSuccess')) {
//       projectData = JSON.parse(localStorage.getItem('lastProjectSuccess'));
//       console.log('✅ Projet trouvé dans localStorage');
//     }
    
//     if (projectData) {
//       console.log('📊 Données projet trouvées:', projectData);
//       setProject(projectData);
//       setIsEditing(location.state?.isEditing || projectData.isEditing || false);
//     } else {
//       console.warn('⚠️ AUCUN PROJET TROUVÉ !');
//       console.warn('Toutes les sources sont vides');
//     }
//   }, [location]);

//   if (!project) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
//           <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur de chargement</h2>
//           <p className="text-gray-600 mb-6">
//             Impossible de charger les détails du projet. 
//             Cela peut être dû à une page rafraîchie ou à un problème de navigation.
//           </p>
//           <div className="space-y-3">
//             <button
//               onClick={() => navigate('/admin/submit-project')}
//               className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition"
//             >
//               Créer un nouveau projet
//             </button>
//             <button
//               onClick={() => navigate('/admin/projects')}
//               className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
//             >
//               Voir mes projets
//             </button>
//           </div>
//           <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
//             <p className="text-sm text-yellow-800">
//               <strong>Note de débogage :</strong> Les données du projet n'ont pas été transmises correctement.
//               Assurez-vous de ne pas rafraîchir la page après la création.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white rounded-xl shadow-lg p-8">
//           <div className="text-center mb-8">
//             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <span className="material-symbols-outlined text-green-600 text-4xl">
//                 check_circle
//               </span>
//             </div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               {isEditing ? 'Projet modifié !' : 'Projet créé !'}
//             </h1>
//             <p className="text-gray-600">
//               {isEditing 
//                 ? 'Votre projet a été mis à jour avec succès.'
//                 : 'Félicitations ! Votre projet a été enregistré.'}
//             </p>
//           </div>

//           {/* Section DEBUG - Afficher toutes les données */}
//           <div className="mb-8 p-4 bg-blue-50 rounded-lg">
//             <h3 className="font-bold text-blue-800 mb-2">DEBUG - Données reçues :</h3>
//             <pre className="text-sm bg-gray-800 text-white p-4 rounded overflow-auto">
//               {JSON.stringify(project, null, 2)}
//             </pre>
//           </div>

//           {/* Détails du projet */}
//           <div className="bg-gray-50 p-6 rounded-lg mb-8">
//             <h2 className="text-xl font-bold text-gray-800 mb-4">Détails du projet</h2>
            
//             <div className="space-y-3">
//               <div>
//                 <span className="text-gray-600 font-medium">Nom : </span>
//                 <span className="font-semibold">{project.title || 'Non spécifié'}</span>
//               </div>
              
//               <div>
//                 <span className="text-gray-600 font-medium">Technologies : </span>
//                 <span>{project.technologies || 'Non spécifiées'}</span>
//               </div>
              
//               <div>
//                 <span className="text-gray-600 font-medium">Description : </span>
//                 <p className="mt-1 text-gray-700 whitespace-pre-line">
//                   {project.description || 'Aucune description'}
//                 </p>
//               </div>
              
//               <div>
//                 <span className="text-gray-600 font-medium">Cohorte : </span>
//                 <span>{project.cohort || 'Non spécifiée'}</span>
//               </div>
              
//               <div>
//                 <span className="text-gray-600 font-medium">Tags : </span>
//                 <span>{project.tags || 'Aucun tag'}</span>
//               </div>
              
//               {project.github_url && (
//                 <div>
//                   <span className="text-gray-600 font-medium">GitHub : </span>
//                   <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
//                     {project.github_url}
//                   </a>
//                 </div>
//               )}
              
//               {project.demo_url && (
//                 <div>
//                   <span className="text-gray-600 font-medium">Démo : </span>
//                   <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
//                     {project.demo_url}
//                   </a>
//                 </div>
//               )}
              
//               <div>
//                 <span className="text-gray-600 font-medium">ID : </span>
//                 <code className="bg-gray-200 px-2 py-1 rounded text-sm">{project.id}</code>
//               </div>
              
//               <div>
//                 <span className="text-gray-600 font-medium">Date : </span>
//                 <span>{new Date(project.timestamp || project.created_at || Date.now()).toLocaleString()}</span>
//               </div>
//             </div>
//           </div>

//           <div className="flex gap-4">
//             <button
//               onClick={() => navigate('/admin/submit-project')}
//               className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition"
//             >
//               Créer un autre projet
//             </button>
//             <button
//               onClick={() => navigate('/admin/projects')}
//               className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition"
//             >
//               Voir tous les projets
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectSuccess;


// src/components/admin/ProjectSuccess.jsx - VERSION AMÉLIORÉE
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '../../services/auth';

const ProjectSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Récupérer l'utilisateur
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    console.log('📍 ProjectSuccess - Location state:', location.state);
    console.log('📍 ProjectSuccess - Location:', location);

    // Vérifier si la réponse contient une erreur
    if (location.state?.project?.success === false) {
      console.error('❌ Projet a échoué:', location.state.project);
      setHasError(true);
      setErrorMessage(location.state.project.error || location.state.project.message || 'Erreur inconnue');
      setLoading(false);
      return;
    }

    // Essayer de récupérer le projet depuis plusieurs sources
    let projectData = null;
    let editing = false;

    // 1. Depuis le state de navigation
    if (location.state?.project && location.state.project.success !== false) {
      projectData = location.state.project;
      editing = location.state.isEditing || false;
      console.log('✅ Projet récupéré depuis state:', projectData);
    }
    
    // 2. Depuis sessionStorage (fallback)
    if (!projectData) {
      const savedProject = sessionStorage.getItem('lastProjectSuccess');
      if (savedProject) {
        const parsed = JSON.parse(savedProject);
        if (parsed.success !== false) {
          projectData = parsed;
          editing = sessionStorage.getItem('lastProjectAction') === 'edit';
          console.log('✅ Projet récupéré depuis sessionStorage:', projectData);
        }
      }
    }

    if (projectData) {
      // Vérifier que le projet a les données minimales
      if (!projectData.title || !projectData.technologies) {
        console.warn('⚠️ Projet incomplet:', projectData);
        setHasError(true);
        setErrorMessage('Les données du projet sont incomplètes');
      } else {
        setProject(projectData);
        setIsEditing(editing);
      }
    } else {
      console.warn('⚠️ Aucun projet trouvé pour afficher');
      setHasError(true);
      setErrorMessage('Aucun projet trouvé. Essayez de créer un nouveau projet.');
    }

    setLoading(false);
  }, [location]);

  // Fonction pour créer un nouveau projet
  const handleCreateNewProject = () => {
    // Nettoyer sessionStorage
    sessionStorage.removeItem('lastProjectSuccess');
    sessionStorage.removeItem('lastProjectAction');
    navigate('/admin/submit-project');
  };

  // Fonction pour voir les projets
  const handleViewProjects = () => {
    navigate('/admin/projects');
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement des détails du projet...</p>
        </div>
      </div>
    );
  }

  // Si erreur de création
  if (hasError) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#001F3F] rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="text-red-500 mb-6 text-center">
            <span className="material-symbols-outlined text-6xl">error</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
            Échec de la création
          </h1>
          
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-700 dark:text-red-300 text-center">
              {errorMessage}
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={handleCreateNewProject}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition"
            >
              Réessayer de créer un projet
            </button>
            
            <button
              onClick={handleViewProjects}
              className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Voir mes projets existants
            </button>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
              Si le problème persiste, vérifiez que vous êtes bien connecté.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Si pas de projet trouvé (mais pas d'erreur explicite)
  if (!project) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#001F3F] rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="text-yellow-500 mb-6 text-center">
            <span className="material-symbols-outlined text-6xl">warning</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
            Projet non trouvé
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
            Les détails du projet n'ont pas pu être chargés. 
            Cela peut arriver si vous avez rafraîchi la page.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={handleCreateNewProject}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition"
            >
              Créer un nouveau projet
            </button>
            
            <button
              onClick={handleViewProjects}
              className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Voir mes projets
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Affichage normal du succès
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-[#001F3F]/30 rounded-xl shadow-lg p-8">
          
          {/* Bannière de succès */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-4xl">
                check_circle
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {isEditing ? 'Projet modifié !' : 'Projet créé !'}
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {isEditing 
                ? 'Votre projet a été mis à jour avec succès.'
                : 'Félicitations ! Votre projet a été enregistré.'}
            </p>
          </div>

          {/* Détails du projet */}
          <div className="bg-gray-50 dark:bg-gray-800/30 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Détails du projet
            </h2>
            
            <div className="space-y-4">
              <div>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Nom : </span>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {project.title || 'Non spécifié'}
                </span>
              </div>
              
              <div>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Technologies : </span>
                <span className="text-gray-800 dark:text-gray-300">
                  {project.technologies || 'Non spécifiées'}
                </span>
              </div>
              
              <div>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Description : </span>
                <p className="mt-1 text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {project.description || 'Aucune description'}
                </p>
              </div>
              
              <div>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Cohorte : </span>
                <span className="text-gray-800 dark:text-gray-300">
                  {project.cohort || 'Non spécifiée'}
                </span>
              </div>
              
              <div>
                <span className="text-gray-600 dark:text-gray-400 font-medium">Tags : </span>
                <span className="text-gray-800 dark:text-gray-300">
                  {project.tags || 'Aucun tag'}
                </span>
              </div>
              
              {project.github_url && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400 font-medium">GitHub : </span>
                  <a 
                    href={project.github_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline"
                  >
                    {project.github_url}
                  </a>
                </div>
              )}
              
              {project.demo_url && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Démo : </span>
                  <a 
                    href={project.demo_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline"
                  >
                    {project.demo_url}
                  </a>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Statut : </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                  {project.status === 'published' ? 'Publié' : 'En attente de validation'}
                </span>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleCreateNewProject}
              className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">add</span>
              Créer un autre projet
            </button>
            
            <button
              onClick={handleViewProjects}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">folder</span>
              Voir tous mes projets
            </button>
          </div>

          {/* Message informatif */}
          <div className="mt-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 mt-0.5">info</span>
              <div>
                <p className="font-medium text-green-800 dark:text-green-300 mb-1">
                  {isEditing ? 'Modification réussie' : 'Prochaines étapes'}
                </p>
                <ul className="text-green-700 dark:text-green-400 text-sm space-y-1">
                  {isEditing ? (
                    <>
                      <li>• Votre projet a été mis à jour dans votre portfolio</li>
                      <li>• Les modifications sont immédiatement visibles</li>
                      <li>• Vous pouvez continuer à le modifier si nécessaire</li>
                    </>
                  ) : (
                    <>
                      <li>• Votre projet sera visible dans votre portfolio</li>
                      <li>• Vous pouvez le modifier à tout moment</li>
                      <li>• Partagez-le avec la communauté Simplon</li>
                      <li>• Consultez régulièrement les commentaires et retours</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSuccess;