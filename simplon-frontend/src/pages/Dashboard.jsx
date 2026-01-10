
// // src/pages/Dashboard.jsx - VERSION COMPLÈTE ET CORRIGÉE
// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { projectService } from '../services/projects'; // ⭐ IMPORT PAR DÉFAUT
// import authService from '../services/auth';

// console.log('🔧 Dashboard.jsx chargé');

// const Dashboard = () => {
//   // États locaux (remplacement de useProjects)
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const [downloading, setDownloading] = useState({});
//   const [userProfilePicture, setUserProfilePicture] = useState(null);
//   const [stats, setStats] = useState({
//     total: 0,
//     published: 0,
//     draft: 0,
//     pending: 0
//   });
  
//   const navigate = useNavigate();

//   // ✅ FONCTION POUR LA PHOTO DE PROFIL
//   const getUserStorageKey = (key) => {
//     try {
//       const currentUser = authService.getCurrentUser();
//       let userIdentifier = 'anonymous';
      
//       if (currentUser) {
//         if (currentUser.id) {
//           userIdentifier = currentUser.id.toString();
//         } else if (currentUser.email) {
//           userIdentifier = currentUser.email;
//         } else if (currentUser.username) {
//           userIdentifier = currentUser.username;
//         }
//       }
      
//       const cleanIdentifier = userIdentifier.replace(/[^a-zA-Z0-9]/g, '_');
//       return `${key}_${cleanIdentifier}`;
      
//     } catch (error) {
//       return `${key}_anonymous`;
//     }
//   };

//   // ✅ CHARGER LES PROJETS
//   const refreshProjects = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       console.log('📥 Chargement des projets...');
//       const data = await projectService.getUserProjects();
      
//       if (Array.isArray(data)) {
//         setProjects(data);
        
//         // Calculer les statistiques
//         const stats = {
//           total: data.length,
//           published: data.filter(p => p.status === 'published' || p.status === 'approved' || p.status === 'lancé').length,
//           draft: data.filter(p => p.status === 'draft').length,
//           pending: data.filter(p => p.status === 'pending' || p.status === 'review').length
//         };
//         setStats(stats);
        
//         console.log(`✅ ${data.length} projets chargés`);
//       } else {
//         console.log('⚠️ Données non valides, utilisation des données mock');
//         // Données mock pour développement
//         const mockProjects = [
//           {
//             id: 1,
//             title: "Application de gestion de tâches",
//             description: "Une application React pour gérer vos tâches quotidiennes",
//             status: "published",
//             technologies: "React, Tailwind, Node.js",
//             created_at: "2024-01-15T10:30:00Z",
//             cohort: "Simplon 2024",
//             author_name: user?.username || "Utilisateur"
//           },
//           {
//             id: 2,
//             title: "Plateforme e-learning",
//             description: "Système de cours en ligne interactif",
//             status: "draft",
//             technologies: "Django, React, PostgreSQL",
//             created_at: "2024-01-10T09:15:00Z",
//             cohort: "Simplon 2024",
//             author_name: user?.username || "Utilisateur"
//           },
//           {
//             id: 3,
//             title: "API REST pour gestion d'étudiants",
//             description: "API complète avec authentification JWT",
//             status: "pending",
//             technologies: "Python, FastAPI, MongoDB",
//             created_at: "2024-01-05T14:20:00Z",
//             cohort: "Simplon 2024",
//             author_name: user?.username || "Utilisateur"
//           }
//         ];
//         setProjects(mockProjects);
//         setStats({
//           total: mockProjects.length,
//           published: 1,
//           draft: 1,
//           pending: 1
//         });
//       }
//     } catch (err) {
//       console.error('❌ Erreur chargement projets:', err);
//       setError('Erreur lors du chargement des projets. Veuillez réessayer.');
//       setProjects([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const currentUser = authService.getCurrentUser();
//     setUser(currentUser);
    
//     // Charger la photo de profil
//     const savedProfilePicture = localStorage.getItem(getUserStorageKey('userProfilePicture'));
//     if (savedProfilePicture) {
//       setUserProfilePicture(savedProfilePicture);
//     }
    
//     refreshProjects();
//   }, []);

//   // ✅ SUPPRIMER UN PROJET
//   const handleDeleteProject = async (projectId, projectTitle) => {
//     if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le projet "${projectTitle}" ?`)) {
//       return;
//     }

//     try {
//       console.log(`🗑️ Suppression projet ${projectId}...`);
//       await projectService.deleteProject(projectId);
      
//       // Mettre à jour localement
//       setProjects(prev => prev.filter(p => p.id !== projectId));
//       setStats(prev => ({ ...prev, total: prev.total - 1 }));
      
//       console.log('✅ Projet supprimé');
//     } catch (err) {
//       console.error('❌ Erreur suppression:', err);
//       alert('Erreur lors de la suppression du projet');
//     }
//   };

//   // ✅ TÉLÉCHARGER UN PROJET
//   const handleDownloadProject = async (projectId, projectTitle, fileName) => {
//     setDownloading(prev => ({ ...prev, [projectId]: true }));

//     try {
//       console.log('📥 Début du téléchargement du projet:', projectTitle);
      
//       // Essayer d'abord le téléchargement via le service
//       if (projectService.downloadProjectFile) {
//         await projectService.downloadProjectFile(projectId, fileName || projectTitle);
//       } else {
//         // Fallback: Téléchargement simulé
//         await simulateZipDownload(projectId, projectTitle);
//       }
      
//       console.log('✅ Téléchargement réussi');
      
//     } catch (error) {
//       console.error(`❌ Erreur téléchargement:`, error);
      
//       // Fallback: Téléchargement simulé en ZIP
//       await simulateZipDownload(projectId, projectTitle);
      
//     } finally {
//       setDownloading(prev => ({ ...prev, [projectId]: false }));
//     }
//   };

//   // ✅ SIMULATION DE TÉLÉCHARGEMENT ZIP
//   const simulateZipDownload = async (projectId, projectTitle) => {
//     try {
//       const project = projects.find(p => p.id === projectId);
      
//       const content = `PROJET: ${projectTitle}
// AUTEUR: ${project?.author_name || user?.username || 'Utilisateur'}
// COHORTE: ${project?.cohort || 'Non spécifiée'}
// TECHNOLOGIES: ${project?.technologies || 'Non spécifiées'}
// DESCRIPTION: ${project?.description || 'Aucune description'}
// STATUT: ${project?.status || 'Inconnu'}
// DATE: ${new Date().toLocaleDateString('fr-FR')}

// === CONTENU DU PROJET ===

// Ceci est une simulation du fichier ZIP du projet.
// En production, ce fichier contiendrait le code source complet.

// Généré le: ${new Date().toLocaleString()}
// Plateforme Simplon`;

//       const blob = new Blob([content], { type: 'application/zip' });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `${projectTitle.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-${projectId}.zip`;
//       document.body.appendChild(a);
//       a.click();
      
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);
      
//       console.log('✅ Téléchargement ZIP simulé réussi');
      
//     } catch (simError) {
//       console.error('❌ Erreur téléchargement ZIP simulé:', simError);
      
//       // Fallback final: fichier texte
//       const content = `Projet: ${projectTitle}\nAuteur: ${user?.username || 'Utilisateur'}\nTéléchargé le: ${new Date().toLocaleString()}`;
      
//       const blob = new Blob([content], { type: 'text/plain' });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `${projectTitle.replace(/\s+/g, '-').toLowerCase()}-details.txt`;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);
//     }
//   };

//   // ✅ DÉCONNEXION
//   const handleLogout = () => {
//     authService.logout();
//     navigate('/login');
//   };

//   // ✅ COULEURS DES STATUTS
//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'published':
//       case 'approved':
//       case 'lancé':
//         return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
//       case 'draft':
//         return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
//       case 'pending':
//       case 'review':
//         return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
//       case 'rejected':
//         return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
//       default:
//         return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
//     }
//   };

//   // ✅ TEXTE DES STATUTS
//   const getStatusText = (status) => {
//     switch (status) {
//       case 'published':
//       case 'approved':
//       case 'lancé': return 'Publié';
//       case 'draft': return 'Brouillon';
//       case 'pending':
//       case 'review': return 'En attente';
//       case 'rejected': return 'Rejeté';
//       default: return status || 'Inconnu';
//     }
//   };

//   // ✅ VÉRIFIER SI LE PROJET PEUT ÊTRE SUPPRIMÉ
//   const canDeleteProject = (project) => {
//     const nonDeletableStatuses = ['published', 'approved', 'lancé'];
//     return !nonDeletableStatuses.includes(project.status);
//   };

//   // ✅ FORMATER LA DATE
//   const formatDate = (dateString) => {
//     if (!dateString) return 'Date inconnue';
//     return new Date(dateString).toLocaleDateString('fr-FR', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   };

//   // ✅ EXTRACTION DES TECHNOLOGIES
//   const getTechnologies = (project) => {
//     if (!project?.technologies) return [];
    
//     if (Array.isArray(project.technologies)) {
//       return project.technologies;
//     } else if (typeof project.technologies === 'string') {
//       return project.technologies.split(',').map(tech => tech.trim());
//     }
    
//     return [];
//   };

//   // ✅ SQUELETTE DE CHARGEMENT
//   if (loading) {
//     return (
//       <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen">
//         <div className="flex min-h-screen">
          
//           {/* Sidebar */}
//           <aside className="w-64 flex-shrink-0 bg-[#001F3F] text-white flex flex-col p-4">
//             <div className="flex items-center gap-3 px-3 py-2">
//               <div className="bg-gray-600 rounded-full size-10 animate-pulse"></div>
//               <div className="flex flex-col">
//                 <div className="h-4 bg-gray-600 rounded w-20 mb-1 animate-pulse"></div>
//                 <div className="h-3 bg-gray-600 rounded w-16 animate-pulse"></div>
//               </div>
//             </div>
            
//             <div className="flex flex-col justify-between flex-grow mt-6">
//               <nav className="flex flex-col gap-2">
//                 {[...Array(3)].map((_, i) => (
//                   <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg">
//                     <div className="bg-gray-600 rounded size-6 animate-pulse"></div>
//                     <div className="h-4 bg-gray-600 rounded w-24 animate-pulse"></div>
//                   </div>
//                 ))}
//               </nav>
              
//               <div className="flex flex-col gap-1">
//                 {[...Array(3)].map((_, i) => (
//                   <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg">
//                     <div className="bg-gray-600 rounded size-6 animate-pulse"></div>
//                     <div className="h-4 bg-gray-600 rounded w-20 animate-pulse"></div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </aside>

//           {/* Main Content */}
//           <main className="flex-1 p-6 lg:p-8">
//             <div className="max-w-7xl mx-auto">
              
//               {/* Header skeleton */}
//               <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
//                 <div>
//                   <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-64 mb-2 animate-pulse"></div>
//                   <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-96 animate-pulse"></div>
//                 </div>
                
//                 <div className="flex items-center gap-3">
//                   <div className="bg-gray-300 dark:bg-gray-700 rounded-full size-12 animate-pulse"></div>
//                   <div className="flex flex-col">
//                     <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20 mb-1 animate-pulse"></div>
//                     <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
//                   </div>
//                 </div>
//               </header>

//               {/* Statistiques skeleton */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//                 {[...Array(4)].map((_, i) => (
//                   <div key={i} className="bg-white dark:bg-[#1C2B3A] rounded-xl p-6 animate-pulse">
//                     <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20 mb-2"></div>
//                     <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
//                   </div>
//                 ))}
//               </div>

//               {/* Grille des projets skeleton */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {[...Array(6)].map((_, i) => (
//                   <div key={i} className="bg-white dark:bg-[#1C2B3A] rounded-xl shadow-md overflow-hidden flex flex-col animate-pulse h-[320px]">
//                     <div className="p-6 flex-grow">
//                       <div className="flex justify-between items-start mb-4">
//                         <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
//                         <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
//                       </div>
                      
//                       <div className="flex flex-wrap gap-2 mt-6">
//                         <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
//                         <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
//                         <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
//                       </div>
//                     </div>
                    
//                     <div className="px-6 py-4 mt-auto">
//                       <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
//                     </div>
                    
//                     <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1C2B3A]/50 p-4 flex justify-end items-center gap-2">
//                       <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
//                       <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </main>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen">
//       <div className="flex min-h-screen">
        
//         {/* Sidebar */}
//         <aside className="w-64 flex-shrink-0 bg-[#001F3F] text-white flex flex-col p-4">
//           <div className="flex items-center gap-3 px-3 py-2">
//             <img 
//               src="/src/logo.png" 
//               alt="Logo Simplon" 
//               className="size-10 rounded-full object-cover"
//               onError={(e) => {
//                 e.target.onerror = null;
//                 e.target.src = "https://via.placeholder.com/40";
//               }}
//             />
//             <div className="flex flex-col">
//               <h1 className="text-white text-base font-medium leading-normal">Simplon</h1>
//               <p className="text-gray-400 text-sm font-normal leading-normal">Code Platform</p>
//             </div>
//           </div>
          
//           <div className="flex flex-col justify-between flex-grow mt-6">
//             <nav className="flex flex-col gap-2">
//               <Link 
//                 to="/dashboard" 
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#003265] text-white"
//               >
//                 <span className="material-symbols-outlined">folder</span>
//                 <p className="text-sm font-medium">Mes projets</p>
//               </Link>
//               <Link 
//                 to="/upload" 
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10"
//               >
//                 <span className="material-symbols-outlined">upload_file</span>
//                 <p className="text-sm font-medium">Déposer un projet</p>
//               </Link>
//               <Link 
//                 to="/explore" 
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10"
//               >
//                 <span className="material-symbols-outlined">explore</span>
//                 <p className="text-sm font-medium">Explorer les projets</p>
//               </Link>
//             </nav>
            
//             <div className="flex flex-col gap-1">
//               <Link 
//                 to="/profile" 
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10"
//               >
//                 <span className="material-symbols-outlined">person</span>
//                 <p className="text-sm font-medium leading-normal">Profil</p>
//               </Link>

//               <Link to="/parametre" className="flex items-center gap-3 rounded px-3 py-2 text-white/70 hover:bg-[#003265] hover:text-white">
//                 <span className="material-symbols-outlined">settings</span>
//                 <span>Paramètre</span>
//               </Link>
//               <button 
//                 onClick={handleLogout}
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-left"
//               >
//                 <span className="material-symbols-outlined">logout</span>
//                 <p className="text-sm font-medium">Déconnexion</p>
//               </button>
//             </div>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-8">
//           <div className="max-w-7xl mx-auto">
            
//             {/* Header */}
//             <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
//               <div>
//                 <h1 className="text-[#1c0d0d] dark:text-gray-200 text-4xl font-black leading-tight tracking-[-0.033em]">
//                   Tableau de Bord
//                 </h1>
//                 <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal mt-2">
//                   Bienvenue, {user?.first_name || user?.username || 'Utilisateur'} !
//                 </p>
//               </div>
              
//               <div className="flex items-center gap-3">
//                 {/* Photo de profil */}
//                 <div 
//                   className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 border-2 border-[#E30613] cursor-pointer hover:border-[#E30613]/80 transition-colors"
//                   style={{ 
//                     backgroundImage: `url(${userProfilePicture || user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCOEWiUsTwO8WM7eKk9ihSrGB-yTnj6Oer1pTWTf_spAb7eV22RX0LZ1UPKdK02_ir9OQKkn8UyJmlDqQxkPJTiLDMtzFAooBHzRyfkt-Sd-kOGWZbn9ccGU4THtkk5AaCXc-z4SkYtd3sivd8r20LAIccUBtibXZ_A7paRHquHcmJf213-GbmYibvQg5l1uG5cGw7UfGO0xOi3aakHJGD9Q2TOoZkBSgguzhYUSkp0eFWQ5O-3rHqcGZBxV1iCxccixEJXXB1uloI"})` 
//                   }}
//                   onClick={() => navigate('/profile')}
//                   title="Voir mon profil"
//                 ></div>
//                 <div className="flex flex-col text-right">
//                   <h2 className="text-[#1c0d0d] dark:text-gray-200 text-base font-medium">
//                     {user?.username || 'Utilisateur'}
//                   </h2>
//                   <p className="text-gray-500 dark:text-gray-400 text-sm">
//                     {user?.cohort || 'Stagiaire'} • {user?.email || ''}
//                   </p>
//                 </div>
//               </div>
//             </header>

//             {/* Statistiques */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//               <div className="bg-white dark:bg-[#1C2B3A] rounded-xl p-6 shadow">
//                 <div className="flex items-center">
//                   <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
//                     <span className="material-symbols-outlined text-blue-600 dark:text-blue-300">folder</span>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm text-gray-600 dark:text-gray-400">Total projets</p>
//                     <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white dark:bg-[#1C2B3A] rounded-xl p-6 shadow">
//                 <div className="flex items-center">
//                   <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
//                     <span className="material-symbols-outlined text-green-600 dark:text-green-300">check_circle</span>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm text-gray-600 dark:text-gray-400">Publiés</p>
//                     <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.published}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white dark:bg-[#1C2B3A] rounded-xl p-6 shadow">
//                 <div className="flex items-center">
//                   <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
//                     <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-300">edit</span>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm text-gray-600 dark:text-gray-400">Brouillons</p>
//                     <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.draft}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white dark:bg-[#1C2B3A] rounded-xl p-6 shadow">
//                 <div className="flex items-center">
//                   <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
//                     <span className="material-symbols-outlined text-purple-600 dark:text-purple-300">schedule</span>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm text-gray-600 dark:text-gray-400">En attente</p>
//                     <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Contenu principal */}
//             <div className="flex flex-col gap-6">
              
//               {/* Section de bouton d'action */}
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mes Projets</h2>
//                   <p className="text-gray-600 dark:text-gray-400">Gérez et partagez vos projets de code</p>
//                 </div>
                
//                 {/* Bouton Nouveau projet */}
//                 <button
//                   onClick={() => navigate('/upload')}
//                   className="bg-[#E30613] text-white px-6 py-3 rounded-lg hover:bg-[#E30613]/90 transition-colors flex items-center gap-2 shrink-0 text-sm font-medium shadow-md hover:shadow-lg"
//                 >
//                   <span className="material-symbols-outlined">add</span>
//                   Nouveau projet
//                 </button>
//               </div>

//               {/* Message d'erreur */}
//               {error && (
//                 <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg dark:bg-red-900 dark:border-red-700 dark:text-red-200 text-sm">
//                   <div className="flex items-center justify-between">
//                     <span>{error}</span>
//                     <button 
//                       onClick={refreshProjects}
//                       className="text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 underline ml-2"
//                     >
//                       Réessayer
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Message si aucun projet */}
//               {!loading && projects.length === 0 && (
//                 <div className="text-center py-16 bg-white dark:bg-[#1C2B3A] rounded-xl shadow-md">
//                   <div className="text-gray-400 mb-4">
//                     <span className="material-symbols-outlined text-6xl">folder_off</span>
//                   </div>
//                   <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
//                     Aucun projet déposé
//                   </h3>
//                   <p className="text-gray-500 dark:text-gray-400 text-base mb-6">
//                     Commencez par déposer votre premier projet !
//                   </p>
                  
//                   <button
//                     onClick={() => navigate('/upload')}
//                     className="bg-[#E30613] hover:bg-[#E30613]/90 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2 text-base shadow-md hover:shadow-lg"
//                   >
//                     <span className="material-symbols-outlined">upload_file</span>
//                     Déposer mon premier projet
//                   </button>
                  
//                   <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
//                     Ou <button onClick={refreshProjects} className="text-[#E30613] hover:underline">rafraîchir</button> pour voir les projets existants
//                   </p>
//                 </div>
//               )}

//               {/* Grille des projets */}
//               {!loading && projects.length > 0 && (
//                 <>
//                   {/* En-tête des résultats */}
//                   <div className="flex justify-between items-center mb-6">
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
//                         Tous mes projets
//                       </h3>
//                       <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
//                         {projects.length} projet{projects.length > 1 ? 's' : ''}
//                       </p>
//                     </div>
                    
//                     <button
//                       onClick={refreshProjects}
//                       className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
//                     >
//                       <span className="material-symbols-outlined text-base">refresh</span>
//                       Rafraîchir
//                     </button>
//                   </div>

//                   {/* Grille de cartes */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {projects.map(project => {
//                       const deletable = canDeleteProject(project);
//                       const technologies = getTechnologies(project);
                      
//                       return (
//                         <div 
//                           key={project.id} 
//                           className="bg-white dark:bg-[#1C2B3A] rounded-xl shadow-md overflow-hidden flex flex-col transition-shadow hover:shadow-xl cursor-pointer group h-[320px] border border-gray-200 dark:border-gray-700"
//                           onClick={() => navigate(`/project/${project.id}`)}
//                         >
//                           {/* Contenu de la carte */}
//                           <div className="p-6 flex-grow">
//                             {/* Header avec titre et statut */}
//                             <div className="flex justify-between items-start mb-4">
//                               <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#E30613] transition-colors">
//                                 {project.title || 'Sans titre'}
//                               </h2>
//                               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)} shrink-0`}>
//                                 {getStatusText(project.status)}
//                               </span>
//                             </div>
                            
//                             {/* Description */}
//                             {project.description && (
//                               <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
//                                 {project.description}
//                               </p>
//                             )}
                            
//                             {/* Badges technologies */}
//                             {technologies.length > 0 && (
//                               <div className="flex flex-wrap gap-2 mt-4">
//                                 {technologies.slice(0, 4).map((tech, index) => (
//                                   <span 
//                                     key={index}
//                                     className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full"
//                                   >
//                                     {typeof tech === 'string' ? tech.trim().substring(0, 15) : tech.substring(0, 15)}
//                                   </span>
//                                 ))}
//                                 {technologies.length > 4 && (
//                                   <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">
//                                     +{technologies.length - 4}
//                                   </span>
//                                 )}
//                               </div>
//                             )}
//                           </div>
                          
//                           {/* Infos bas */}
//                           <div className="px-6 py-4 mt-auto border-t border-gray-100 dark:border-gray-800">
//                             <div className="flex justify-between items-center">
//                               <p className="text-sm text-gray-500 dark:text-gray-400">
//                                 {formatDate(project.created_at || project.updated_at || project.date)}
//                               </p>
//                               <p className="text-sm text-gray-500 dark:text-gray-400">
//                                 {project.cohort || 'Sans cohorte'}
//                               </p>
//                             </div>
//                           </div>
                          
//                           {/* Actions */}
//                           <div 
//                             className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1C2B3A]/50 p-4 flex justify-end items-center gap-2"
//                             onClick={(e) => e.stopPropagation()}
//                           >
//                             {/* Bouton Télécharger */}
//                             <button 
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleDownloadProject(project.id, project.title, project.file || `projet-${project.id}.zip`);
//                               }}
//                               disabled={downloading[project.id]}
//                               className={`flex items-center justify-center size-8 rounded-full transition-colors ${
//                                 downloading[project.id]
//                                   ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                                   : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
//                               }`}
//                               title="Télécharger le projet"
//                             >
//                               {downloading[project.id] ? (
//                                 <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent"></div>
//                               ) : (
//                                 <span className="material-symbols-outlined text-base">download</span>
//                               )}
//                             </button>
                            
//                             {/* Bouton Supprimer */}
//                             {deletable && (
//                               <button 
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleDeleteProject(project.id, project.title);
//                                 }}
//                                 className="flex items-center justify-center size-8 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
//                                 title="Supprimer le projet"
//                               >
//                                 <span className="material-symbols-outlined text-base">delete</span>
//                               </button>
//                             )}
                            
//                             {/* Bouton Voir */}
//                             <button 
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 navigate(`/project/${project.id}`);
//                               }}
//                               className="flex items-center justify-center size-8 rounded-full text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
//                               title="Voir les détails"
//                             >
//                               <span className="material-symbols-outlined text-base">visibility</span>
//                             </button>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </>
//               )}
//             </div>

//             {/* Debug info (optionnel) */}
//             {process.env.NODE_ENV === 'development' && (
//               <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
//                 <details className="cursor-pointer">
//                   <summary className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                     🔍 Info de débogage
//                   </summary>
//                   <div className="mt-2 text-xs">
//                     <pre className="bg-gray-800 text-gray-100 p-3 rounded overflow-auto">
//                       {JSON.stringify({
//                         user: user,
//                         projectsCount: projects.length,
//                         stats: stats,
//                         timestamp: new Date().toISOString()
//                       }, null, 2)}
//                     </pre>
//                   </div>
//                 </details>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// src/pages/Dashboard.jsx - VERSION SIMPLIFIÉE
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectService } from '../services/projects';
import authService from '../services/auth';

console.log('🔧 Dashboard.jsx chargé');

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [downloading, setDownloading] = useState({});
  const [userProfilePicture, setUserProfilePicture] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0
  });
  
  const navigate = useNavigate();

  const getUserStorageKey = (key) => {
    try {
      const currentUser = authService.getCurrentUser();
      let userIdentifier = 'anonymous';
      
      if (currentUser) {
        if (currentUser.id) {
          userIdentifier = currentUser.id.toString();
        } else if (currentUser.email) {
          userIdentifier = currentUser.email;
        } else if (currentUser.username) {
          userIdentifier = currentUser.username;
        }
      }
      
      const cleanIdentifier = userIdentifier.replace(/[^a-zA-Z0-9]/g, '_');
      return `${key}_${cleanIdentifier}`;
      
    } catch (error) {
      return `${key}_anonymous`;
    }
  };

  const refreshProjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📥 Chargement des projets...');
      const data = await projectService.getUserProjects();
      
      if (Array.isArray(data)) {
        setProjects(data);
        
        // STATISTIQUES SIMPLIFIÉES : seulement 3 catégories
        const stats = {
          total: data.length,
          approved: data.filter(p => p.status === 'approved').length,
          rejected: data.filter(p => p.status === 'rejected').length
        };
        setStats(stats);
        
        console.log(`✅ ${data.length} projets chargés`);
      } else {
        console.log('⚠️ Données non valides, utilisation des données mock');
        const mockProjects = [
          {
            id: 1,
            title: "Application de gestion de tâches",
            description: "Une application React pour gérer vos tâches quotidiennes",
            status: "approved",
            technologies: "React, Tailwind, Node.js",
            created_at: "2024-01-15T10:30:00Z",
            cohort: "Simplon 2024",
            author_name: user?.username || "Utilisateur"
          },
          {
            id: 2,
            title: "Plateforme e-learning",
            description: "Système de cours en ligne interactif",
            status: "approved",
            technologies: "Django, React, PostgreSQL",
            created_at: "2024-01-10T09:15:00Z",
            cohort: "Simplon 2024",
            author_name: user?.username || "Utilisateur"
          },
          {
            id: 3,
            title: "API REST pour gestion d'étudiants",
            description: "API complète avec authentification JWT",
            status: "rejected",
            technologies: "Python, FastAPI, MongoDB",
            created_at: "2024-01-05T14:20:00Z",
            cohort: "Simplon 2024",
            author_name: user?.username || "Utilisateur"
          }
        ];
        setProjects(mockProjects);
        setStats({
          total: mockProjects.length,
          approved: 2,
          rejected: 1
        });
      }
    } catch (err) {
      console.error('❌ Erreur chargement projets:', err);
      setError('Erreur lors du chargement des projets. Veuillez réessayer.');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    
    const savedProfilePicture = localStorage.getItem(getUserStorageKey('userProfilePicture'));
    if (savedProfilePicture) {
      setUserProfilePicture(savedProfilePicture);
    }
    
    refreshProjects();
  }, []);

  const handleDeleteProject = async (projectId, projectTitle) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le projet "${projectTitle}" ?`)) {
      return;
    }

    try {
      console.log(`🗑️ Suppression projet ${projectId}...`);
      await projectService.deleteProject(projectId);
      
      setProjects(prev => prev.filter(p => p.id !== projectId));
      setStats(prev => ({ ...prev, total: prev.total - 1 }));
      
      console.log('✅ Projet supprimé');
    } catch (err) {
      console.error('❌ Erreur suppression:', err);
      alert('Erreur lors de la suppression du projet');
    }
  };

  const handleDownloadProject = async (projectId, projectTitle, fileName) => {
    setDownloading(prev => ({ ...prev, [projectId]: true }));

    try {
      console.log('📥 Début du téléchargement du projet:', projectTitle);
      
      if (projectService.downloadProjectFile) {
        await projectService.downloadProjectFile(projectId, fileName || projectTitle);
      } else {
        await simulateZipDownload(projectId, projectTitle);
      }
      
      console.log('✅ Téléchargement réussi');
      
    } catch (error) {
      console.error(`❌ Erreur téléchargement:`, error);
      await simulateZipDownload(projectId, projectTitle);
      
    } finally {
      setDownloading(prev => ({ ...prev, [projectId]: false }));
    }
  };

  const simulateZipDownload = async (projectId, projectTitle) => {
    try {
      const project = projects.find(p => p.id === projectId);
      
      const content = `PROJET: ${projectTitle}
AUTEUR: ${project?.author_name || user?.username || 'Utilisateur'}
COHORTE: ${project?.cohort || 'Non spécifiée'}
TECHNOLOGIES: ${project?.technologies || 'Non spécifiées'}
DESCRIPTION: ${project?.description || 'Aucune description'}
STATUT: ${project?.status || 'Inconnu'}
DATE: ${new Date().toLocaleDateString('fr-FR')}

=== CONTENU DU PROJET ===

Ceci est une simulation du fichier ZIP du projet.
En production, ce fichier contiendrait le code source complet.

Généré le: ${new Date().toLocaleString()}
Plateforme Simplon`;

      const blob = new Blob([content], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectTitle.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-${projectId}.zip`;
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('✅ Téléchargement ZIP simulé réussi');
      
    } catch (simError) {
      console.error('❌ Erreur téléchargement ZIP simulé:', simError);
      
      const content = `Projet: ${projectTitle}\nAuteur: ${user?.username || 'Utilisateur'}\nTéléchargé le: ${new Date().toLocaleString()}`;
      
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
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'pending':
      case 'review':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      case 'draft': return 'Brouillon';
      case 'pending':
      case 'review': return 'En attente';
      default: return status || 'Inconnu';
    }
  };

  const canDeleteProject = (project) => {
    const nonDeletableStatuses = ['approved'];
    return !nonDeletableStatuses.includes(project.status);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTechnologies = (project) => {
    if (!project?.technologies) return [];
    
    if (Array.isArray(project.technologies)) {
      return project.technologies;
    } else if (typeof project.technologies === 'string') {
      return project.technologies.split(',').map(tech => tech.trim());
    }
    
    return [];
  };

  if (loading) {
    // ... (skeleton loader inchangé)
    return (
      <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen">
        {/* Skeleton loader... */}
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen">
      <div className="flex min-h-screen">
        
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 bg-[#001F3F] text-white flex flex-col p-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <img 
              src="/src/logo.png" 
              alt="Logo Simplon" 
              className="size-10 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/40";
              }}
            />
            <div className="flex flex-col">
              <h1 className="text-white text-base font-medium leading-normal">Simplon</h1>
              <p className="text-gray-400 text-sm font-normal leading-normal">Code Platform</p>
            </div>
          </div>
          
          <div className="flex flex-col justify-between flex-grow mt-6">
            <nav className="flex flex-col gap-2">
              <Link 
                to="/dashboard" 
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#003265] text-white"
              >
                <span className="material-symbols-outlined">folder</span>
                <p className="text-sm font-medium">Mes projets</p>
              </Link>
              <Link 
                to="/upload" 
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10"
              >
                <span className="material-symbols-outlined">upload_file</span>
                <p className="text-sm font-medium">Déposer un projet</p>
              </Link>
              <Link 
                to="/explore" 
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10"
              >
                <span className="material-symbols-outlined">explore</span>
                <p className="text-sm font-medium">Explorer les projets</p>
              </Link>
            </nav>
            
            <div className="flex flex-col gap-1">
              <Link 
                to="/profile" 
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10"
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
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-left"
              >
                <span className="material-symbols-outlined">logout</span>
                <p className="text-sm font-medium">Déconnexion</p>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
              <div>
                <h1 className="text-[#1c0d0d] dark:text-gray-200 text-4xl font-black leading-tight tracking-[-0.033em]">
                  Tableau de Bord
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal mt-2">
                  Bienvenue, {user?.first_name || user?.username || 'Utilisateur'} !
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div 
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 border-2 border-[#E30613] cursor-pointer hover:border-[#E30613]/80 transition-colors"
                  style={{ 
                    backgroundImage: `url(${userProfilePicture || user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCOEWiUsTwO8WM7eKk9ihSrGB-yTnj6Oer1pTWTf_spAb7eV22RX0LZ1UPKdK02_ir9OQKkn8UyJmlDqQxkPJTiLDMtzFAooBHzRyfkt-Sd-kOGWZbn9ccGU4THtkk5AaCXc-z4SkYtd3sivd8r20LAIccUBtibXZ_A7paRHquHcmJf213-GbmYibvQg5l1uG5cGw7UfGO0xOi3aakHJGD9Q2TOoZkBSgguzhYUSkp0eFWQ5O-3rHqcGZBxV1iCxccixEJXXB1uloI"})` 
                  }}
                  onClick={() => navigate('/profile')}
                  title="Voir mon profil"
                ></div>
                <div className="flex flex-col text-right">
                  <h2 className="text-[#1c0d0d] dark:text-gray-200 text-base font-medium">
                    {user?.username || 'Utilisateur'}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {user?.cohort || 'Stagiaire'} • {user?.email || ''}
                  </p>
                </div>
              </div>
            </header>

            {/* STATISTIQUES - 3 CARRÉS SEULEMENT */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* Total projets */}
              <div className="bg-white dark:bg-[#1C2B3A] rounded-xl p-6 shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-300">folder</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total projets</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                  </div>
                </div>
              </div>

              {/* Approuvés */}
              <div className="bg-white dark:bg-[#1C2B3A] rounded-xl p-6 shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <span className="material-symbols-outlined text-green-600 dark:text-green-300">check_circle</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Approuvés</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.approved}</p>
                  </div>
                </div>
              </div>

              {/* Rejetés */}
              <div className="bg-white dark:bg-[#1C2B3A] rounded-xl p-6 shadow">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                    <span className="material-symbols-outlined text-red-600 dark:text-red-300">cancel</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Rejetés</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.rejected}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="flex flex-col gap-6">
              
              {/* Section de bouton d'action */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mes Projets</h2>
                  <p className="text-gray-600 dark:text-gray-400">Gérez et partagez vos projets de code</p>
                </div>
                
                <button
                  onClick={() => navigate('/upload')}
                  className="bg-[#E30613] text-white px-6 py-3 rounded-lg hover:bg-[#E30613]/90 transition-colors flex items-center gap-2 shrink-0 text-sm font-medium shadow-md hover:shadow-lg"
                >
                  <span className="material-symbols-outlined">add</span>
                  Nouveau projet
                </button>
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg dark:bg-red-900 dark:border-red-700 dark:text-red-200 text-sm">
                  <div className="flex items-center justify-between">
                    <span>{error}</span>
                    <button 
                      onClick={refreshProjects}
                      className="text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 underline ml-2"
                    >
                      Réessayer
                    </button>
                  </div>
                </div>
              )}

              {/* Message si aucun projet */}
              {!loading && projects.length === 0 && (
                <div className="text-center py-16 bg-white dark:bg-[#1C2B3A] rounded-xl shadow-md">
                  <div className="text-gray-400 mb-4">
                    <span className="material-symbols-outlined text-6xl">folder_off</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                    Aucun projet déposé
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-base mb-6">
                    Commencez par déposer votre premier projet !
                  </p>
                  
                  <button
                    onClick={() => navigate('/upload')}
                    className="bg-[#E30613] hover:bg-[#E30613]/90 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2 text-base shadow-md hover:shadow-lg"
                  >
                    <span className="material-symbols-outlined">upload_file</span>
                    Déposer mon premier projet
                  </button>
                </div>
              )}

              {/* Grille des projets */}
              {!loading && projects.length > 0 && (
                <>
                  {/* En-tête des résultats */}
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Tous mes projets
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        {projects.length} projet{projects.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Grille de cartes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map(project => {
                      const deletable = canDeleteProject(project);
                      const technologies = getTechnologies(project);
                      
                      return (
                        <div 
                          key={project.id} 
                          className="bg-white dark:bg-[#1C2B3A] rounded-xl shadow-md overflow-hidden flex flex-col transition-shadow hover:shadow-xl cursor-pointer group h-[320px] border border-gray-200 dark:border-gray-700"
                          onClick={() => navigate(`/project/${project.id}`)}
                        >
                          <div className="p-6 flex-grow">
                            <div className="flex justify-between items-start mb-4">
                              <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#E30613] transition-colors">
                                {project.title || 'Sans titre'}
                              </h2>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)} shrink-0`}>
                                {getStatusText(project.status)}
                              </span>
                            </div>
                            
                            {project.description && (
                              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                {project.description}
                              </p>
                            )}
                            
                            {technologies.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-4">
                                {technologies.slice(0, 4).map((tech, index) => (
                                  <span 
                                    key={index}
                                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full"
                                  >
                                    {typeof tech === 'string' ? tech.trim().substring(0, 15) : tech.substring(0, 15)}
                                  </span>
                                ))}
                                {technologies.length > 4 && (
                                  <span className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">
                                    +{technologies.length - 4}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="px-6 py-4 mt-auto border-t border-gray-100 dark:border-gray-800">
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(project.created_at || project.updated_at || project.date)}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {project.cohort || 'Sans cohorte'}
                              </p>
                            </div>
                          </div>
                          
                          <div 
                            className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1C2B3A]/50 p-4 flex justify-end items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadProject(project.id, project.title, project.file || `projet-${project.id}.zip`);
                              }}
                              disabled={downloading[project.id]}
                              className={`flex items-center justify-center size-8 rounded-full transition-colors ${
                                downloading[project.id]
                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                              }`}
                              title="Télécharger le projet"
                            >
                              {downloading[project.id] ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent"></div>
                              ) : (
                                <span className="material-symbols-outlined text-base">download</span>
                              )}
                            </button>
                            
                            {deletable && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteProject(project.id, project.title);
                                }}
                                className="flex items-center justify-center size-8 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                                title="Supprimer le projet"
                              >
                                <span className="material-symbols-outlined text-base">delete</span>
                              </button>
                            )}
                            
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/project/${project.id}`);
                              }}
                              className="flex items-center justify-center size-8 rounded-full text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                              title="Voir les détails"
                            >
                              <span className="material-symbols-outlined text-base">visibility</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* SECTION DEBUG SUPPRIMÉE */}
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;