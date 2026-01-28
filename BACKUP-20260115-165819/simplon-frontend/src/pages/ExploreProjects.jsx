
// // src/pages/ExploreProjects.jsx - VERSION AVEC DATE DE DÉPÔT
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { projectService } from '../services/projects';
// import authService from '../services/auth';

// console.log('🔧 Import projectService dans', 
//   (new Error().stack?.split('\n')[2] || '').trim() || 'Unknown location'
// );

// const ExploreProjects = () => {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);
//   const [downloading, setDownloading] = useState({});
//   const [searchTimeout, setSearchTimeout] = useState(null);
//   const [userProfilePicture, setUserProfilePicture] = useState(null);

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

//   // ✅ FONCTION CORRIGÉE POUR EXTRACTION DU NOM D'AUTEUR (NOM COMPLET)
//   const getAuthorName = (project) => {
//     if (!project) return 'Auteur inconnu';
    
//     // ⚡ CORRECTION PRINCIPALE : Chercher d'abord les champs de nom avant le username
//     const possibleAuthorFields = [
//       'author_name',      // Format mock
//       'author',           // Peut être un objet ou une string
//       'user',             // Format Django avec objet user
//       'created_by',       // Format backend
//       'owner',            // Autre format
//       'user_name',        // Format alternatif
//     ];
    
//     for (const field of possibleAuthorFields) {
//       if (project[field]) {
//         // Si c'est un objet avec des propriétés (comme user dans Django)
//         if (typeof project[field] === 'object') {
//           const authorObj = project[field];
          
//           // 1. PRIORITÉ : Nom complet (first_name + last_name)
//           if (authorObj.first_name && authorObj.last_name) {
//             return `${authorObj.first_name} ${authorObj.last_name}`;
//           }
          
//           // 2. PRIORITÉ : Prénom seul
//           if (authorObj.first_name) {
//             return authorObj.first_name;
//           }
          
//           // 3. PRIORITÉ : Nom seul
//           if (authorObj.last_name) {
//             return authorObj.last_name;
//           }
          
//           // 4. PRIORITÉ : Champ 'name' personnalisé
//           if (authorObj.name) {
//             return authorObj.name;
//           }
          
//           // 5. PRIORITÉ : Email (extraire le nom)
//           if (authorObj.email) {
//             const namePart = authorObj.email.split('@')[0];
//             return namePart
//               .split(/[._]/)
//               .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//               .join(' ');
//           }
          
//           // ⚡ IMPORTANT : NE PAS retourner username ici, on le garde pour plus tard
//           // Le username (matricule) est notre dernier recours
//         }
//         // Si c'est une string directement
//         else if (typeof project[field] === 'string') {
//           return project[field];
//         }
//       }
//     }
    
//     // ⚡ APRÈS avoir essayé tous les champs, essayer le username
//     // Vérifier d'abord dans l'objet user
//     if (project.user?.username) {
//       // Essayer de formater le matricule si c'est un email
//       const username = project.user.username;
//       if (username.includes('@')) {
//         const namePart = username.split('@')[0];
//         return namePart
//           .split(/[._]/)
//           .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//           .join(' ');
//       }
//       // Si ce n'est pas un email, retourner le matricule
//       return username;
//     }
    
//     // Vérifier le champ username direct
//     if (project.username && typeof project.username === 'string') {
//       return project.username;
//     }
    
//     // Si l'auteur est un ID numérique
//     if (project.author_id && typeof project.author_id === 'number') {
//       return `Utilisateur #${project.author_id}`;
//     }
    
//     if (project.user_id && typeof project.user_id === 'number') {
//       return `Utilisateur #${project.user_id}`;
//     }
    
//     return 'Auteur inconnu';
//   };

//   // ✅ FONCTION POUR EXTRACTION DE LA COHORTE
//   const getCohortName = (project) => {
//     if (!project) return null;
    
//     const possibleCohortFields = [
//       'cohort',
//       'cohort_name',
//       'promotion',
//       'batch',
//       'group',
//       'class'
//     ];
    
//     for (const field of possibleCohortFields) {
//       if (project[field]) {
//         return project[field];
//       }
//     }
    
//     return null;
//   };

//   // ✅ FONCTION POUR EXTRACTION DES TECHNOLOGIES
//   const getTechnologies = (project) => {
//     if (!project) return [];
    
//     const possibleTechFields = [
//       'technologies',
//       'tech_stack',
//       'skills',
//       'tools',
//       'languages'
//     ];
    
//     for (const field of possibleTechFields) {
//       if (project[field]) {
//         if (Array.isArray(project[field])) {
//           return project[field];
//         } else if (typeof project[field] === 'string') {
//           return project[field].split(',').map(tech => tech.trim());
//         }
//       }
//     }
    
//     return [];
//   };

//   // ✅ FONCTION POUR FORMATER LA DATE DE DÉPÔT
//   const formatDepositDate = (dateString) => {
//     if (!dateString) return 'Date inconnue';
    
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('fr-FR', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric'
//       });
//     } catch (error) {
//       return 'Date invalide';
//     }
//   };

//   // ✅ FONCTION POUR EXTRACTION DE LA DATE
//   const getDepositDate = (project) => {
//     if (!project) return null;
    
//     const possibleDateFields = [
//       'created_at',
//       'created_date',
//       'upload_date',
//       'deposit_date',
//       'date',
//       'updated_at'
//     ];
    
//     for (const field of possibleDateFields) {
//       if (project[field]) {
//         return project[field];
//       }
//     }
    
//     return null;
//   };

//   // Charger les projets depuis l'API
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         setLoading(true);
//         console.log('🔄 Chargement des projets depuis l\'API...');
        
//         const projectsData = await projectService.getAllProjects();
//         console.log('✅ Projets chargés:', projectsData);
        
//         // 🔍 DEBUG DÉTAILLÉ POUR COMPRENDRE LA STRUCTURE
//         if (projectsData && projectsData.length > 0) {
//           const firstProject = projectsData[0];
//           console.log('🔍 STRUCTURE COMPLÈTE DU PREMIER PROJET:');
//           console.log('1. Objet complet:', firstProject);
//           console.log('2. Toutes les clés:', Object.keys(firstProject));
          
//           // Analyser l'objet user s'il existe
//           if (firstProject.user) {
//             console.log('3. OBJET USER DÉTAILLÉ:');
//             console.log('   - Type:', typeof firstProject.user);
//             console.log('   - Contenu:', firstProject.user);
//             console.log('   - Clés:', Object.keys(firstProject.user));
//             console.log('   - first_name:', firstProject.user.first_name);
//             console.log('   - last_name:', firstProject.user.last_name);
//             console.log('   - username:', firstProject.user.username);
//             console.log('   - email:', firstProject.user.email);
//           }
          
//           // Tester l'extraction des données
//           console.log('🧪 TEST EXTRACTION:');
//           console.log('  - Auteur:', getAuthorName(firstProject));
//           console.log('  - Cohort:', getCohortName(firstProject));
//           console.log('  - Technologies:', getTechnologies(firstProject));
//           console.log('  - Date de dépôt:', getDepositDate(firstProject));
//           console.log('  - Date formatée:', formatDepositDate(getDepositDate(firstProject)));
//         }
        
//         setProjects(projectsData);
        
//         // Récupérer l'utilisateur connecté
//         const currentUser = authService.getCurrentUser();
//         setUser(currentUser);
        
//       } catch (error) {
//         console.error('❌ Erreur chargement projets:', error);
//         // En cas d'erreur, utiliser les données mockées avec dates
//         const mockProjects = [
//           {
//             id: 1,
//             title: "Portfolio React Modern",
//             user: {
//               id: 1,
//               first_name: "Léa",
//               last_name: "Martin",
//               username: "lea.martin",
//               email: "lea.martin@example.com"
//             },
//             cohort: "DWWM - Mars 2024",
//             technologies: "React,TypeScript,Tailwind CSS,Vite,Node.js",
//             description: "Un portfolio moderne développé avec React, TypeScript et Tailwind CSS, optimisé avec Vite",
//             file: "portfolio-react.zip",
//             created_at: "2024-03-15T10:30:00Z"
//           },
//           {
//             id: 2,
//             title: "Application E-commerce",
//             user: {
//               id: 2,
//               first_name: "Mohamed",
//               last_name: "Ali",
//               username: "mohamed.ali",
//               email: "mohamed.ali@example.com"
//             },
//             cohort: "CDA - Avril 2024",
//             technologies: "React,Node.js,MongoDB,Express",
//             description: "Une application e-commerce complète avec panier et paiement",
//             file: "ecommerce-app.zip",
//             created_at: "2024-04-20T14:15:00Z"
//           },
//           {
//             id: 3,
//             title: "Jeu JavaScript",
//             user: {
//               id: 3,
//               first_name: "Sophie",
//               username: "sophie123",
//               email: "sophie@example.com"
//             },
//             cohort: "DWWM - Février 2024",
//             technologies: "JavaScript,HTML5,CSS3",
//             description: "Un jeu en JavaScript utilisant Canvas",
//             file: "javascript-game.zip",
//             created_at: "2024-02-10T09:45:00Z"
//           }
//         ];
        
//         setProjects(mockProjects);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjects();
//   }, []);

//   // ✅ CHARGER LA PHOTO DE PROFIL
//   useEffect(() => {
//     const savedProfilePicture = localStorage.getItem(getUserStorageKey('userProfilePicture'));
//     if (savedProfilePicture) {
//       setUserProfilePicture(savedProfilePicture);
//     }
//   }, [user]);

//   // Recherche avec debounce
//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);
    
//     if (searchTimeout) {
//       clearTimeout(searchTimeout);
//     }
    
//     setSearchTimeout(
//       setTimeout(() => {
//         console.log('🔍 Recherche avec terme:', value);
//       }, 300)
//     );
//   };

//   // ✅ RECHERCHE AVANCÉE AVEC EXTRACTION DE DONNÉES
//   const filteredProjects = projects.filter(project => {
//     if (!project) return false;

//     if (searchTerm === '') {
//       return true;
//     }

//     const searchLower = searchTerm.toLowerCase();
    
//     // Recherche par auteur (avec extraction)
//     const authorName = getAuthorName(project);
//     const matchesAuthor = authorName.toLowerCase().includes(searchLower);
    
//     // Recherche par cohorte (avec extraction)
//     const cohortName = getCohortName(project);
//     const matchesCohort = cohortName && 
//       cohortName.toLowerCase().includes(searchLower);
    
//     // Recherche par titre
//     const matchesTitle = project.title && 
//       project.title.toLowerCase().includes(searchLower);
    
//     // Recherche par description
//     const matchesDescription = project.description && 
//       project.description.toLowerCase().includes(searchLower);
    
//     // Recherche par technologies (avec extraction)
//     const technologies = getTechnologies(project);
//     const matchesTechnologies = technologies.length > 0 && 
//       searchLower.split(',').some(tech => 
//         technologies.some(t => 
//           t.toLowerCase().includes(tech.trim())
//         )
//       );

//     return matchesCohort || matchesAuthor || matchesTitle || 
//            matchesDescription || matchesTechnologies;
//   });

//   const handleLogout = () => {
//     authService.logout();
//     navigate('/login');
//   };

//   // Fonction de téléchargement
//   const handleDownload = async (projectId, projectTitle, fileName) => {
//     try {
//       setDownloading(prev => ({ ...prev, [projectId]: true }));
//       console.log(`📥 Début du téléchargement du projet ${projectId}: ${projectTitle}`);
      
//       try {
//         const blob = await projectService.downloadProjectFile(projectId, fileName || projectTitle);
        
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `${projectTitle.replace(/\s+/g, '-').toLowerCase()}.zip`;
//         document.body.appendChild(a);
//         a.click();
        
//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(a);
        
//       } catch (apiError) {
//         console.log('📦 API non disponible, création d\'un fichier de démonstration...');
//         const projectData = projects.find(p => p.id === projectId) || {};
//         const authorName = getAuthorName(projectData);
//         const depositDate = formatDepositDate(getDepositDate(projectData));
        
//         const content = `PROJET: ${projectTitle}
// AUTEUR: ${authorName}
// COHORTE: ${getCohortName(projectData) || 'Non spécifiée'}
// DATE DE DÉPÔT: ${depositDate}
// TECHNOLOGIES: ${getTechnologies(projectData).join(', ') || 'Non spécifiées'}
// DESCRIPTION: ${projectData.description || 'Aucune description'}

// Généré le: ${new Date().toLocaleString()}
// Plateforme Simplon`;
        
//         const blob = new Blob([content], { 
//           type: 'application/zip' 
//         });
        
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `${projectTitle.replace(/\s+/g, '-').toLowerCase()}-demo.zip`;
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(a);
//       }
      
//       console.log(`✅ Téléchargement réussi pour le projet ${projectId}`);
      
//     } catch (error) {
//       console.error(`❌ Erreur téléchargement projet ${projectId}:`, error);
      
//       let errorMessage = 'Erreur lors du téléchargement';
//       if (error.message.includes('401') || error.message.includes('403')) {
//         errorMessage = 'Accès non autorisé. Vérifiez votre connexion.';
//       } else if (error.message.includes('404')) {
//         errorMessage = 'Fichier non trouvé sur le serveur.';
//       } else if (error.message.includes('Failed to fetch')) {
//         errorMessage = 'Erreur de connexion au serveur.';
//       }
      
//       alert(`❌ ${errorMessage}\n\nProjet: "${projectTitle}"`);
//     } finally {
//       setDownloading(prev => ({ ...prev, [projectId]: false }));
//     }
//   };

//   // Nettoyer le timeout
//   useEffect(() => {
//     return () => {
//       if (searchTimeout) {
//         clearTimeout(searchTimeout);
//       }
//     };
//   }, [searchTimeout]);

//   // Extraire les cohortes uniques pour les suggestions
//   const cohortOptions = [...new Set(projects.map(p => getCohortName(p)).filter(Boolean))].sort();
  
//   // Extraire les technologies uniques pour les suggestions
//   const allTechnologies = new Set();
//   projects.forEach(project => {
//     getTechnologies(project).forEach(tech => {
//       if (tech.trim()) allTechnologies.add(tech.trim());
//     });
//   });
//   const technologyOptions = Array.from(allTechnologies).sort();

//   return (
//     <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen">
//       <div className="flex min-h-screen">
        
//         {/* Sidebar - inchangé */}
//         <aside className="w-64 flex-shrink-0 bg-[#001F3F] text-white flex flex-col p-4">
//           <div className="flex items-center gap-3 px-3 py-2">
//             <img 
//               src="/src/logo.png" 
//               alt="Logo Simplon" 
//               className="size-10 rounded-full object-cover"
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
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10"
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
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-white"
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
//         <main className="flex-1 p-6 lg:p-8">
//           <div className="max-w-7xl mx-auto">
            
//             {/* Header avec profil utilisateur */}
//             <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
//               <div>
//                 <h1 className="text-[#001F3F] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
//                   Explorer les Projets
//                 </h1>
//                 <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
//                   Découvrez et téléchargez les projets partagés par la communauté Simplon
//                 </p>
                
//                 {/* Indicateur de recherche active */}
//                 {searchTerm && (
//                   <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
//                     <span className="text-blue-600 flex items-center gap-1">
//                       <span className="material-symbols-outlined text-base">search</span>
//                       Recherche: "{searchTerm}"
//                     </span>
//                     {searchTerm.includes(',') && (
//                       <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
//                         Recherche multiple activée
//                       </span>
//                     )}
//                   </div>
//                 )}
//               </div>
              
//               <div className="flex items-center gap-3">
//                 {/* Photo de profil */}
//                 <div 
//                   className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary cursor-pointer hover:border-primary/80 transition-colors"
//                   style={{ 
//                     backgroundImage: `url(${userProfilePicture || user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCOEWiUsTwO8WM7eKk9ihSrGB-yTnj6Oer1pTWTf_spAb7eV22RX0LZ1UPKdK02_ir9OQKkn8UyJmlDqQxkPJTiLDMtzFAooBHzRyfkt-Sd-kOGWZbn9ccGU4THtkk5AaCXc-z4SkYtd3sivd8r20LAIccUBtibXZ_A7paRHquHcmJf213-GbmYibvQg5l1uG5cGw7UfGO0xOi3aakHJGD9Q2TOoZkBSgguzhYUSkp0eFWQ5O-3rHqcGZBxV1iCxccixEJXXB1uloI"})` 
//                   }}
//                   onClick={() => navigate('/profile')}
//                   title="Voir mon profil"
//                 ></div>
//                 <div className="flex flex-col text-right">
//                   <h2 className="text-[#001F3F] dark:text-white text-base font-medium">
//                     {user?.first_name || user?.username || 'Utilisateur'}
//                   </h2>
//                   <p className="text-gray-500 dark:text-gray-400 text-sm">
//                     {user?.cohort || 'Stagiaire'}
//                   </p>
//                 </div>
//               </div>
//             </header>

//             {/* Contenu principal */}
//             <div className="flex flex-col gap-6">
              
//               {/* Barre de recherche */}
//               <div className="relative">
//                 <div className="flex items-center gap-3 mb-2">
//                   <label htmlFor="search-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Recherche avancée
//                   </label>
//                   {searchTerm && (
//                     <button
//                       onClick={() => setSearchTerm('')}
//                       className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
//                     >
//                       <span className="material-symbols-outlined text-sm">close</span>
//                       Effacer
//                     </button>
//                   )}
//                 </div>
                
//                 <div className="flex w-full flex-1 items-stretch rounded-lg h-11 bg-white dark:bg-[#001F3F]/50 border border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/50 transition-all">
//                   <div className="text-gray-500 flex items-center justify-center pl-4">
//                     <span className="material-symbols-outlined">search</span>
//                   </div>
//                   <input
//                     id="search-input"
//                     type="text"
//                     placeholder="Rechercher par titre, auteur, technologie, cohorte..."
//                     value={searchTerm}
//                     onChange={handleSearchChange}
//                     className="flex w-full min-w-0 flex-1 resize-none overflow-hidden bg-transparent text-[#001F3F] dark:text-white h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 text-sm font-normal leading-normal focus:outline-none"
//                   />
//                   {searchTerm && (
//                     <div className="flex items-center pr-3 text-gray-400">
//                       <span className="text-sm">{filteredProjects.length}</span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Indicateur de chargement */}
//               {loading && (
//                 <div className="flex justify-center items-center py-8">
//                   <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-500 border-t-transparent"></div>
//                   <span className="ml-3 text-gray-600 text-sm">Chargement des projets...</span>
//                 </div>
//               )}

//               {/* Message si aucun projet */}
//               {!loading && filteredProjects.length === 0 && (
//                 <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
//                   <div className="text-gray-400 mb-2">
//                     <span className="material-symbols-outlined text-5xl">search_off</span>
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-1">
//                     {searchTerm 
//                       ? "Aucun projet trouvé" 
//                       : "Aucun projet disponible"}
//                   </h3>
//                   <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
//                     {searchTerm 
//                       ? `Aucun projet ne correspond à "${searchTerm}"`
//                       : "Aucun projet n'a été partagé pour le moment."}
//                   </p>
//                 </div>
//               )}

//               {/* Grille des projets */}
//               {!loading && filteredProjects.length > 0 && (
//                 <>
//                   {/* En-tête des résultats */}
//                   <div className="flex justify-between items-center mb-3">
//                     <div>
//                       <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">
//                         {searchTerm 
//                           ? `Résultats pour "${searchTerm}"`
//                           : "Tous les projets disponibles"}
//                       </h3>
//                       <p className="text-xs text-gray-500 mt-0.5">
//                         {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''}
//                       </p>
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       {projects.length} projet{projects.length > 1 ? 's' : ''} au total
//                     </div>
//                   </div>

//                   {/* CARTES COMPACTES AVEC DATE DE DÉPÔT */}
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//                     {filteredProjects.map(project => {
//                       const authorName = getAuthorName(project);
//                       const cohortName = getCohortName(project);
//                       const technologies = getTechnologies(project);
//                       const depositDate = getDepositDate(project);
//                       const formattedDate = formatDepositDate(depositDate);
                      
//                       return (
//                         <div key={project.id} className="flex flex-col rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#001F3F]/30 overflow-hidden transition-all hover:shadow-md hover:scale-[1.02] group h-[300px]">
//                           {/* Contenu de la carte */}
//                           <div className="p-4 flex flex-col gap-3 flex-1">
//                             {/* Header avec titre */}
//                             <div className="flex flex-col gap-1">
//                               <h3 className="text-[#001F3F] dark:text-white text-sm font-bold line-clamp-2">
//                                 {project.title || 'Sans titre'}
//                               </h3>
                              
//                               {/* ✅ NOM DE L'AUTEUR (MAINTENANT LE NOM COMPLET) */}
//                               <div className="flex items-center gap-2 text-xs">
//                                 <span className="material-symbols-outlined text-xs text-gray-500">person</span>
//                                 <span className="text-gray-600 dark:text-gray-300 font-medium">
//                                   {authorName}
//                                 </span>
//                                 {project.user?.username && authorName !== project.user.username && (
//                                   <span className="text-gray-400 text-[10px]">
//                                     ({project.user.username})
//                                   </span>
//                                 )}
//                               </div>
                              
//                               {/* Cohort */}
//                               {cohortName && (
//                                 <div className="flex items-center gap-2 text-xs mt-1">
//                                   <span className="material-symbols-outlined text-xs text-gray-500">school</span>
//                                   <span className="text-gray-500 dark:text-gray-400">
//                                     {cohortName}
//                                   </span>
//                                 </div>
//                               )}
                              
//                               {/* ✅ DATE DE DÉPÔT */}
//                               {depositDate && (
//                                 <div className="flex items-center gap-2 text-xs mt-1">
//                                   <span className="material-symbols-outlined text-xs text-gray-500">calendar_today</span>
//                                   <span className="text-gray-500 dark:text-gray-400">
//                                     {formattedDate}
//                                   </span>
//                                 </div>
//                               )}
//                             </div>
                            
//                             {/* Description courte */}
//                             {project.description && (
//                               <p className="text-gray-600 dark:text-gray-300 text-xs line-clamp-3 flex-1 mt-2">
//                                 {project.description}
//                               </p>
//                             )}
                            
//                             {/* Badges technologies */}
//                             {technologies.length > 0 && (
//                               <div className="flex flex-wrap gap-1 mt-auto">
//                                 {technologies.slice(0, 3).map((tech, index) => (
//                                   <span 
//                                     key={index}
//                                     className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary"
//                                   >
//                                     {tech.substring(0, 12)}
//                                   </span>
//                                 ))}
//                                 {technologies.length > 3 && (
//                                   <span className="text-xs font-medium bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">
//                                     +{technologies.length - 3}
//                                   </span>
//                                 )}
//                               </div>
//                             )}
//                           </div>
                          
//                           {/* Actions */}
//                           <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between gap-2 bg-gray-50 dark:bg-gray-800/30">
//                             {/* Bouton Voir détails */}
//                             <button 
//                               onClick={() => navigate(`/project/${project.id}`)}
//                               className="text-xs font-medium bg-primary text-white py-1.5 px-3 rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5"
//                             >
//                               <span className="material-symbols-outlined text-sm">visibility</span>
//                               Voir
//                             </button>
                            
//                             {/* Bouton Télécharger */}
//                             <button 
//                               onClick={() => handleDownload(project.id, project.title || 'Projet', project.file)}
//                               disabled={downloading[project.id]}
//                               className={`shrink-0 flex items-center justify-center h-8 w-8 rounded border transition-colors ${
//                                 downloading[project.id]
//                                   ? 'bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed'
//                                   : 'bg-white dark:bg-[#001F3F]/50 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-green-600 dark:hover:text-green-400'
//                               }`}
//                               title={`Télécharger ${project.title || 'projet'}`}
//                             >
//                               {downloading[project.id] ? (
//                                 <div className="animate-spin rounded-full h-3 w-3 border-2 border-green-500 border-t-transparent"></div>
//                               ) : (
//                                 <span className="material-symbols-outlined text-sm">download</span>
//                               )}
//                             </button>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default ExploreProjects;


// src/pages/ExploreProjects.jsx - VERSION AVEC IMAGE DE BACKGROUND
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectService } from '../services/projects';
import authService from '../services/auth';

const ExploreProjects = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [downloading, setDownloading] = useState({});
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [userProfilePicture, setUserProfilePicture] = useState(null);

  // ✅ FONCTION POUR LA PHOTO DE PROFIL
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

  // ✅ FONCTION POUR EXTRACTION DE L'IMAGE DU PROJET
  const getProjectImage = (project) => {
    if (!project) return null;
    
    const possibleImageFields = [
      'image',
      'image_url',
      'thumbnail',
      'thumbnail_url',
      'screenshot',
      'cover_image',
      'preview_image',
      'image_path'
    ];
    
    for (const field of possibleImageFields) {
      if (project[field]) {
        // Vérifier si c'est une URL valide
        if (typeof project[field] === 'string' && 
            (project[field].startsWith('http') || 
             project[field].startsWith('/') ||
             project[field].startsWith('data:'))) {
          return project[field];
        }
      }
    }
    
    return null;
  };

  // ✅ FONCTION CORRIGÉE POUR EXTRACTION DU NOM D'AUTEUR
  const getAuthorName = (project) => {
    if (!project) return 'Auteur inconnu';
    
    const possibleAuthorFields = [
      'author_name',
      'author',
      'user',
      'created_by',
      'owner',
      'user_name',
    ];
    
    for (const field of possibleAuthorFields) {
      if (project[field]) {
        if (typeof project[field] === 'object') {
          const authorObj = project[field];
          
          if (authorObj.first_name && authorObj.last_name) {
            return `${authorObj.first_name} ${authorObj.last_name}`;
          }
          
          if (authorObj.first_name) {
            return authorObj.first_name;
          }
          
          if (authorObj.last_name) {
            return authorObj.last_name;
          }
          
          if (authorObj.name) {
            return authorObj.name;
          }
          
          if (authorObj.email) {
            const namePart = authorObj.email.split('@')[0];
            return namePart
              .split(/[._]/)
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
          }
        }
        else if (typeof project[field] === 'string') {
          return project[field];
        }
      }
    }
    
    if (project.user?.username) {
      const username = project.user.username;
      if (username.includes('@')) {
        const namePart = username.split('@')[0];
        return namePart
          .split(/[._]/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
      return username;
    }
    
    if (project.username && typeof project.username === 'string') {
      return project.username;
    }
    
    if (project.author_id && typeof project.author_id === 'number') {
      return `Utilisateur #${project.author_id}`;
    }
    
    if (project.user_id && typeof project.user_id === 'number') {
      return `Utilisateur #${project.user_id}`;
    }
    
    return 'Auteur inconnu';
  };

  // ✅ FONCTION POUR EXTRACTION DE LA COHORTE
  const getCohortName = (project) => {
    if (!project) return null;
    
    const possibleCohortFields = [
      'cohort',
      'cohort_name',
      'promotion',
      'batch',
      'group',
      'class'
    ];
    
    for (const field of possibleCohortFields) {
      if (project[field]) {
        return project[field];
      }
    }
    
    return null;
  };

  // ✅ FONCTION POUR EXTRACTION DES TECHNOLOGIES
  const getTechnologies = (project) => {
    if (!project) return [];
    
    const possibleTechFields = [
      'technologies',
      'tech_stack',
      'skills',
      'tools',
      'languages'
    ];
    
    for (const field of possibleTechFields) {
      if (project[field]) {
        if (Array.isArray(project[field])) {
          return project[field];
        } else if (typeof project[field] === 'string') {
          return project[field].split(',').map(tech => tech.trim());
        }
      }
    }
    
    return [];
  };

  // ✅ FONCTION POUR EXTRACTION DES LIENS GITHUB ET DÉMO
  const getProjectLinks = (project) => {
    const links = {
      github: null,
      demo: null
    };
    
    if (!project) return links;
    
    // Chercher le lien GitHub
    const possibleGithubFields = [
      'github_url',
      'github',
      'repository_url',
      'repo',
      'git_url',
      'source_code'
    ];
    
    for (const field of possibleGithubFields) {
      if (project[field] && typeof project[field] === 'string') {
        let url = project[field];
        // S'assurer que l'URL commence par http/https
        if (!url.startsWith('http')) {
          url = `https://${url}`;
        }
        links.github = url;
        break;
      }
    }
    
    // Chercher le lien de démo
    const possibleDemoFields = [
      'demo_url',
      'demo',
      'live_url',
      'live_demo',
      'website',
      'url'
    ];
    
    for (const field of possibleDemoFields) {
      if (project[field] && typeof project[field] === 'string') {
        let url = project[field];
        if (!url.startsWith('http')) {
          url = `https://${url}`;
        }
        links.demo = url;
        break;
      }
    }
    
    return links;
  };

  // ✅ FONCTION POUR FORMATER LA DATE DE DÉPÔT
  const formatDepositDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  // ✅ FONCTION POUR EXTRACTION DE LA DATE
  const getDepositDate = (project) => {
    if (!project) return null;
    
    const possibleDateFields = [
      'created_at',
      'created_date',
      'upload_date',
      'deposit_date',
      'date',
      'updated_at'
    ];
    
    for (const field of possibleDateFields) {
      if (project[field]) {
        return project[field];
      }
    }
    
    return null;
  };

  // Charger les projets depuis l'API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        console.log('🔄 Chargement des projets depuis l\'API...');
        
        const projectsData = await projectService.getAllProjects();
        console.log('✅ Projets chargés:', projectsData);
        
        // 🔍 DEBUG : Vérifier les images disponibles
        if (projectsData && projectsData.length > 0) {
          console.log('🔍 VÉRIFICATION DES IMAGES DES PROJETS:');
          projectsData.slice(0, 3).forEach((project, index) => {
            const imageUrl = getProjectImage(project);
            console.log(`Projet ${index + 1}: ${project.title}`);
            console.log(`  - Image disponible: ${imageUrl ? 'OUI' : 'NON'}`);
            console.log(`  - URL: ${imageUrl || 'Aucune'}`);
          });
        }
        
        setProjects(projectsData);
        
        // Récupérer l'utilisateur connecté
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        
      } catch (error) {
        console.error('❌ Erreur chargement projets:', error);
        // En cas d'erreur, utiliser les données mockées avec images
        const mockProjects = [
          {
            id: 1,
            title: "Portfolio React Modern",
            user: {
              id: 1,
              first_name: "Léa",
              last_name: "Martin",
              username: "lea.martin",
              email: "lea.martin@example.com"
            },
            cohort: "DWWM - Mars 2024",
            technologies: "React,TypeScript,Tailwind CSS,Vite,Node.js",
            description: "Un portfolio moderne développé avec React, TypeScript et Tailwind CSS, optimisé avec Vite",
            image_url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            github_url: "https://github.com/example/portfolio-react",
            demo_url: "https://portfolio-react-demo.netlify.app",
            created_at: "2024-03-15T10:30:00Z"
          },
          {
            id: 2,
            title: "Application E-commerce",
            user: {
              id: 2,
              first_name: "Mohamed",
              last_name: "Ali",
              username: "mohamed.ali",
              email: "mohamed.ali@example.com"
            },
            cohort: "CDA - Avril 2024",
            technologies: "React,Node.js,MongoDB,Express",
            description: "Une application e-commerce complète avec panier et paiement",
            thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            github: "https://github.com/example/ecommerce-app",
            demo: "https://ecommerce-demo.vercel.app",
            created_at: "2024-04-20T14:15:00Z"
          },
          {
            id: 3,
            title: "Jeu JavaScript",
            user: {
              id: 3,
              first_name: "Sophie",
              username: "sophie123",
              email: "sophie@example.com"
            },
            cohort: "DWWM - Février 2024",
            technologies: "JavaScript,HTML5,CSS3",
            description: "Un jeu en JavaScript utilisant Canvas",
            // Pas d'image pour ce projet (reste blanc)
            github_url: "https://github.com/example/javascript-game",
            demo_url: "https://js-game-demo.netlify.app",
            created_at: "2024-02-10T09:45:00Z"
          }
        ];
        
        setProjects(mockProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // ✅ CHARGER LA PHOTO DE PROFIL
  useEffect(() => {
    const savedProfilePicture = localStorage.getItem(getUserStorageKey('userProfilePicture'));
    if (savedProfilePicture) {
      setUserProfilePicture(savedProfilePicture);
    }
  }, [user]);

  // Recherche avec debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    setSearchTimeout(
      setTimeout(() => {
        console.log('🔍 Recherche avec terme:', value);
      }, 300)
    );
  };

  // ✅ RECHERCHE AVANCÉE
  const filteredProjects = projects.filter(project => {
    if (!project) return false;

    if (searchTerm === '') {
      return true;
    }

    const searchLower = searchTerm.toLowerCase();
    
    const authorName = getAuthorName(project);
    const matchesAuthor = authorName.toLowerCase().includes(searchLower);
    
    const cohortName = getCohortName(project);
    const matchesCohort = cohortName && 
      cohortName.toLowerCase().includes(searchLower);
    
    const matchesTitle = project.title && 
      project.title.toLowerCase().includes(searchLower);
    
    const matchesDescription = project.description && 
      project.description.toLowerCase().includes(searchLower);
    
    const technologies = getTechnologies(project);
    const matchesTechnologies = technologies.length > 0 && 
      searchLower.split(',').some(tech => 
        technologies.some(t => 
          t.toLowerCase().includes(tech.trim())
        )
      );

    return matchesCohort || matchesAuthor || matchesTitle || 
           matchesDescription || matchesTechnologies;
  });

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Fonction de téléchargement
  const handleDownload = async (projectId, projectTitle, fileName) => {
    try {
      setDownloading(prev => ({ ...prev, [projectId]: true }));
      console.log(`📥 Début du téléchargement du projet ${projectId}: ${projectTitle}`);
      
      try {
        const blob = await projectService.downloadProjectFile(projectId, fileName || projectTitle);
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectTitle.replace(/\s+/g, '-').toLowerCase()}.zip`;
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
      } catch (apiError) {
        console.log('📦 API non disponible, création d\'un fichier de démonstration...');
        const projectData = projects.find(p => p.id === projectId) || {};
        const authorName = getAuthorName(projectData);
        const depositDate = formatDepositDate(getDepositDate(projectData));
        
        const content = `PROJET: ${projectTitle}
AUTEUR: ${authorName}
COHORTE: ${getCohortName(projectData) || 'Non spécifiée'}
DATE DE DÉPÔT: ${depositDate}
TECHNOLOGIES: ${getTechnologies(projectData).join(', ') || 'Non spécifiées'}
DESCRIPTION: ${projectData.description || 'Aucune description'}

Généré le: ${new Date().toLocaleString()}
Plateforme Simplon`;
        
        const blob = new Blob([content], { 
          type: 'application/zip' 
        });
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectTitle.replace(/\s+/g, '-').toLowerCase()}-demo.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
      
      console.log(`✅ Téléchargement réussi pour le projet ${projectId}`);
      
    } catch (error) {
      console.error(`❌ Erreur téléchargement projet ${projectId}:`, error);
      
      let errorMessage = 'Erreur lors du téléchargement';
      if (error.message.includes('401') || error.message.includes('403')) {
        errorMessage = 'Accès non autorisé. Vérifiez votre connexion.';
      } else if (error.message.includes('404')) {
        errorMessage = 'Fichier non trouvé sur le serveur.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Erreur de connexion au serveur.';
      }
      
      alert(`❌ ${errorMessage}\n\nProjet: "${projectTitle}"`);
    } finally {
      setDownloading(prev => ({ ...prev, [projectId]: false }));
    }
  };

  // Nettoyer le timeout
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen">
      <div className="flex min-h-screen">
        
        {/* Sidebar - inchangé */}
        <aside className="w-64 flex-shrink-0 bg-[#001F3F] text-white flex flex-col p-4">
          <div className="flex items-center gap-3 px-3 py-2">
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
          
          <div className="flex flex-col justify-between flex-grow mt-6">
            <nav className="flex flex-col gap-2">
              <Link 
                to="/dashboard" 
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10"
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
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-white"
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
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Header avec profil utilisateur */}
            <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <div>
                <h1 className="text-[#001F3F] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
                  Explorer les Projets
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                  Découvrez et téléchargez les projets partagés par la communauté Simplon
                </p>
                
                {searchTerm && (
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-blue-600 flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">search</span>
                      Recherche: "{searchTerm}"
                    </span>
                    {searchTerm.includes(',') && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                        Recherche multiple activée
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <div 
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary cursor-pointer hover:border-primary/80 transition-colors"
                  style={{ 
                    backgroundImage: `url(${userProfilePicture || user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCOEWiUsTwO8WM7eKk9ihSrGB-yTnj6Oer1pTWTf_spAb7eV22RX0LZ1UPKdK02_ir9OQKkn8UyJmlDqQxkPJTiLDMtzFAooBHzRyfkt-Sd-kOGWZbn9ccGU4THtkk5AaCXc-z4SkYtd3sivd8r20LAIccUBtibXZ_A7paRHquHcmJf213-GbmYibvQg5l1uG5cGw7UfGO0xOi3aakHJGD9Q2TOoZkBSgguzhYUSkp0eFWQ5O-3rHqcGZBxV1iCxccixEJXXB1uloI"})` 
                  }}
                  onClick={() => navigate('/profile')}
                  title="Voir mon profil"
                ></div>
                <div className="flex flex-col text-right">
                  <h2 className="text-[#001F3F] dark:text-white text-base font-medium">
                    {user?.first_name || user?.username || 'Utilisateur'}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {user?.cohort || 'Stagiaire'}
                  </p>
                </div>
              </div>
            </header>

            {/* Contenu principal */}
            <div className="flex flex-col gap-6">
              
              {/* Barre de recherche */}
              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <label htmlFor="search-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Recherche avancée
                  </label>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                      Effacer
                    </button>
                  )}
                </div>
                
                <div className="flex w-full flex-1 items-stretch rounded-lg h-11 bg-white dark:bg-[#001F3F]/50 border border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/50 transition-all">
                  <div className="text-gray-500 flex items-center justify-center pl-4">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                  <input
                    id="search-input"
                    type="text"
                    placeholder="Rechercher par titre, auteur, technologie, cohorte..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden bg-transparent text-[#001F3F] dark:text-white h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 text-sm font-normal leading-normal focus:outline-none"
                  />
                  {searchTerm && (
                    <div className="flex items-center pr-3 text-gray-400">
                      <span className="text-sm">{filteredProjects.length}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Indicateur de chargement */}
              {loading && (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-500 border-t-transparent"></div>
                  <span className="ml-3 text-gray-600 text-sm">Chargement des projets...</span>
                </div>
              )}

              {/* Message si aucun projet */}
              {!loading && filteredProjects.length === 0 && (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-gray-400 mb-2">
                    <span className="material-symbols-outlined text-5xl">search_off</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    {searchTerm 
                      ? "Aucun projet trouvé" 
                      : "Aucun projet disponible"}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                    {searchTerm 
                      ? `Aucun projet ne correspond à "${searchTerm}"`
                      : "Aucun projet n'a été partagé pour le moment."}
                  </p>
                </div>
              )}

              {/* Grille des projets */}
              {!loading && filteredProjects.length > 0 && (
                <>
                  {/* En-tête des résultats */}
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">
                        {searchTerm 
                          ? `Résultats pour "${searchTerm}"`
                          : "Tous les projets disponibles"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {projects.length} projet{projects.length > 1 ? 's' : ''} au total
                    </div>
                  </div>

                  {/* CARTES AVEC IMAGE EN BACKGROUND */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProjects.map(project => {
                      const authorName = getAuthorName(project);
                      const cohortName = getCohortName(project);
                      const technologies = getTechnologies(project);
                      const depositDate = getDepositDate(project);
                      const formattedDate = formatDepositDate(depositDate);
                      const projectImage = getProjectImage(project);
                      const projectLinks = getProjectLinks(project);
                      
                      return (
                        <div 
                          key={project.id} 
                          className="flex flex-col rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] group h-[300px] relative"
                        >
                          {/* ✅ BACKGROUND AVEC IMAGE DU PROJET OU BLANC */}
                          <div 
                            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-300 group-hover:opacity-90 ${
                              projectImage ? '' : 'bg-white dark:bg-[#001F3F]/30'
                            }`}
                            style={projectImage ? { 
                              backgroundImage: `url(${projectImage})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat'
                            } : {}}
                          >
                            {/* Overlay pour améliorer la lisibilité du texte */}
                            {projectImage && (
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                            )}
                          </div>
                          
                          {/* Contenu par-dessus l'image */}
                          <div className="relative z-10 p-4 flex flex-col gap-3 flex-1">
                            {/* Header avec titre */}
                            <div className="flex flex-col gap-1">
                              <h3 className={`text-sm font-bold line-clamp-2 ${
                                projectImage 
                                  ? 'text-white drop-shadow-md' 
                                  : 'text-[#001F3F] dark:text-white'
                              }`}>
                                {project.title || 'Sans titre'}
                              </h3>
                              
                              {/* Auteur */}
                              <div className="flex items-center gap-2 text-xs">
                                <span className={`material-symbols-outlined text-xs ${
                                  projectImage ? 'text-white/80' : 'text-gray-500'
                                }`}>person</span>
                                <span className={`font-medium ${
                                  projectImage 
                                    ? 'text-white drop-shadow-sm' 
                                    : 'text-gray-600 dark:text-gray-300'
                                }`}>
                                  {authorName}
                                </span>
                              </div>
                              
                              {/* Cohort */}
                              {cohortName && (
                                <div className="flex items-center gap-2 text-xs mt-1">
                                  <span className={`material-symbols-outlined text-xs ${
                                    projectImage ? 'text-white/80' : 'text-gray-500'
                                  }`}>school</span>
                                  <span className={
                                    projectImage 
                                      ? 'text-white/90 drop-shadow-sm' 
                                      : 'text-gray-500 dark:text-gray-400'
                                  }>
                                    {cohortName}
                                  </span>
                                </div>
                              )}
                              
                              {/* Date de dépôt */}
                              {depositDate && (
                                <div className="flex items-center gap-2 text-xs mt-1">
                                  <span className={`material-symbols-outlined text-xs ${
                                    projectImage ? 'text-white/80' : 'text-gray-500'
                                  }`}>calendar_today</span>
                                  <span className={
                                    projectImage 
                                      ? 'text-white/90 drop-shadow-sm' 
                                      : 'text-gray-500 dark:text-gray-400'
                                  }>
                                    {formattedDate}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* Description courte */}
                            {project.description && (
                              <p className={`text-xs line-clamp-3 flex-1 mt-2 ${
                                projectImage 
                                  ? 'text-white/95 drop-shadow-sm' 
                                  : 'text-gray-600 dark:text-gray-300'
                              }`}>
                                {project.description}
                              </p>
                            )}
                            
                            {/* Badges technologies */}
                            {technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-auto">
                                {technologies.slice(0, 3).map((tech, index) => (
                                  <span 
                                    key={index}
                                    className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                                      projectImage
                                        ? 'bg-white/20 text-white backdrop-blur-sm'
                                        : 'bg-primary/10 text-primary'
                                    }`}
                                  >
                                    {tech.substring(0, 12)}
                                  </span>
                                ))}
                                {technologies.length > 3 && (
                                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                                    projectImage
                                      ? 'bg-white/20 text-white backdrop-blur-sm'
                                      : 'bg-gray-200 text-gray-600'
                                  }`}>
                                    +{technologies.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {/* ✅ LIENS GITHUB ET DÉMO */}
                          {(projectLinks.github || projectLinks.demo) && (
                            <div className="relative z-10 px-4 pb-2 flex flex-wrap gap-2">
                              {projectLinks.github && (
                                <a
                                  href={projectLinks.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                                    projectImage
                                      ? 'bg-gray-900/80 text-white hover:bg-gray-900'
                                      : 'bg-gray-800 text-white hover:bg-gray-900'
                                  } transition-colors`}
                                  onClick={(e) => e.stopPropagation()}
                                  title="Voir sur GitHub"
                                >
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                  </svg>
                                  GitHub
                                </a>
                              )}
                              {projectLinks.demo && (
                                <a
                                  href={projectLinks.demo}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                                    projectImage
                                      ? 'bg-green-700/80 text-white hover:bg-green-700'
                                      : 'bg-green-600 text-white hover:bg-green-700'
                                  } transition-colors`}
                                  onClick={(e) => e.stopPropagation()}
                                  title="Voir la démo"
                                >
                                  <span className="material-symbols-outlined text-xs">open_in_new</span>
                                  Démo
                                </a>
                              )}
                            </div>
                          )}
                          
                          {/* Actions */}
                          <div className="relative z-10 border-t border-gray-200/50 dark:border-gray-700/50 p-3 flex items-center justify-between gap-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                            {/* Bouton Voir détails */}
                            <button 
                              onClick={() => navigate(`/project/${project.id}`)}
                              className="text-xs font-medium bg-primary text-white py-1.5 px-3 rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5"
                            >
                              <span className="material-symbols-outlined text-sm">visibility</span>
                              Voir
                            </button>
                            
                            {/* Bouton Télécharger */}
                            <button 
                              onClick={() => handleDownload(project.id, project.title || 'Projet', project.file)}
                              disabled={downloading[project.id]}
                              className={`shrink-0 flex items-center justify-center h-8 w-8 rounded border transition-colors ${
                                downloading[project.id]
                                  ? 'bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-white border-gray-200 dark:border-gray-600 text-gray-600 hover:bg-gray-100 hover:text-green-600'
                              }`}
                              title={`Télécharger ${project.title || 'projet'}`}
                            >
                              {downloading[project.id] ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-2 border-green-500 border-t-transparent"></div>
                              ) : (
                                <span className="material-symbols-outlined text-sm">download</span>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExploreProjects;