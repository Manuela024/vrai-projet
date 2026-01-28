
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


// // src/pages/ExploreProjects.jsx - VERSION AVEC IMAGE DE BACKGROUND
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { projectService } from '../services/projects';
// import authService from '../services/auth';

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

//   // ✅ FONCTION POUR EXTRACTION DE L'IMAGE DU PROJET
//   const getProjectImage = (project) => {
//     if (!project) return null;
    
//     const possibleImageFields = [
//       'image',
//       'image_url',
//       'thumbnail',
//       'thumbnail_url',
//       'screenshot',
//       'cover_image',
//       'preview_image',
//       'image_path'
//     ];
    
//     for (const field of possibleImageFields) {
//       if (project[field]) {
//         // Vérifier si c'est une URL valide
//         if (typeof project[field] === 'string' && 
//             (project[field].startsWith('http') || 
//              project[field].startsWith('/') ||
//              project[field].startsWith('data:'))) {
//           return project[field];
//         }
//       }
//     }
    
//     return null;
//   };

//   // ✅ FONCTION CORRIGÉE POUR EXTRACTION DU NOM D'AUTEUR
//   const getAuthorName = (project) => {
//     if (!project) return 'Auteur inconnu';
    
//     const possibleAuthorFields = [
//       'author_name',
//       'author',
//       'user',
//       'created_by',
//       'owner',
//       'user_name',
//     ];
    
//     for (const field of possibleAuthorFields) {
//       if (project[field]) {
//         if (typeof project[field] === 'object') {
//           const authorObj = project[field];
          
//           if (authorObj.first_name && authorObj.last_name) {
//             return `${authorObj.first_name} ${authorObj.last_name}`;
//           }
          
//           if (authorObj.first_name) {
//             return authorObj.first_name;
//           }
          
//           if (authorObj.last_name) {
//             return authorObj.last_name;
//           }
          
//           if (authorObj.name) {
//             return authorObj.name;
//           }
          
//           if (authorObj.email) {
//             const namePart = authorObj.email.split('@')[0];
//             return namePart
//               .split(/[._]/)
//               .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//               .join(' ');
//           }
//         }
//         else if (typeof project[field] === 'string') {
//           return project[field];
//         }
//       }
//     }
    
//     if (project.user?.username) {
//       const username = project.user.username;
//       if (username.includes('@')) {
//         const namePart = username.split('@')[0];
//         return namePart
//           .split(/[._]/)
//           .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//           .join(' ');
//       }
//       return username;
//     }
    
//     if (project.username && typeof project.username === 'string') {
//       return project.username;
//     }
    
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

//   // ✅ FONCTION POUR EXTRACTION DES LIENS GITHUB ET DÉMO
//   const getProjectLinks = (project) => {
//     const links = {
//       github: null,
//       demo: null
//     };
    
//     if (!project) return links;
    
//     // Chercher le lien GitHub
//     const possibleGithubFields = [
//       'github_url',
//       'github',
//       'repository_url',
//       'repo',
//       'git_url',
//       'source_code'
//     ];
    
//     for (const field of possibleGithubFields) {
//       if (project[field] && typeof project[field] === 'string') {
//         let url = project[field];
//         // S'assurer que l'URL commence par http/https
//         if (!url.startsWith('http')) {
//           url = `https://${url}`;
//         }
//         links.github = url;
//         break;
//       }
//     }
    
//     // Chercher le lien de démo
//     const possibleDemoFields = [
//       'demo_url',
//       'demo',
//       'live_url',
//       'live_demo',
//       'website',
//       'url'
//     ];
    
//     for (const field of possibleDemoFields) {
//       if (project[field] && typeof project[field] === 'string') {
//         let url = project[field];
//         if (!url.startsWith('http')) {
//           url = `https://${url}`;
//         }
//         links.demo = url;
//         break;
//       }
//     }
    
//     return links;
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
        
//         // 🔍 DEBUG : Vérifier les images disponibles
//         if (projectsData && projectsData.length > 0) {
//           console.log('🔍 VÉRIFICATION DES IMAGES DES PROJETS:');
//           projectsData.slice(0, 3).forEach((project, index) => {
//             const imageUrl = getProjectImage(project);
//             console.log(`Projet ${index + 1}: ${project.title}`);
//             console.log(`  - Image disponible: ${imageUrl ? 'OUI' : 'NON'}`);
//             console.log(`  - URL: ${imageUrl || 'Aucune'}`);
//           });
//         }
        
//         setProjects(projectsData);
        
//         // Récupérer l'utilisateur connecté
//         const currentUser = authService.getCurrentUser();
//         setUser(currentUser);
        
//       } catch (error) {
//         console.error('❌ Erreur chargement projets:', error);
//         // En cas d'erreur, utiliser les données mockées avec images
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
//             image_url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//             github_url: "https://github.com/example/portfolio-react",
//             demo_url: "https://portfolio-react-demo.netlify.app",
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
//             thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//             github: "https://github.com/example/ecommerce-app",
//             demo: "https://ecommerce-demo.vercel.app",
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
//             // Pas d'image pour ce projet (reste blanc)
//             github_url: "https://github.com/example/javascript-game",
//             demo_url: "https://js-game-demo.netlify.app",
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

//   // ✅ RECHERCHE AVANCÉE
//   const filteredProjects = projects.filter(project => {
//     if (!project) return false;

//     if (searchTerm === '') {
//       return true;
//     }

//     const searchLower = searchTerm.toLowerCase();
    
//     const authorName = getAuthorName(project);
//     const matchesAuthor = authorName.toLowerCase().includes(searchLower);
    
//     const cohortName = getCohortName(project);
//     const matchesCohort = cohortName && 
//       cohortName.toLowerCase().includes(searchLower);
    
//     const matchesTitle = project.title && 
//       project.title.toLowerCase().includes(searchLower);
    
//     const matchesDescription = project.description && 
//       project.description.toLowerCase().includes(searchLower);
    
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

//                   {/* CARTES AVEC IMAGE EN BACKGROUND */}
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//                     {filteredProjects.map(project => {
//                       const authorName = getAuthorName(project);
//                       const cohortName = getCohortName(project);
//                       const technologies = getTechnologies(project);
//                       const depositDate = getDepositDate(project);
//                       const formattedDate = formatDepositDate(depositDate);
//                       const projectImage = getProjectImage(project);
//                       const projectLinks = getProjectLinks(project);
                      
//                       return (
//                         <div 
//                           key={project.id} 
//                           className="flex flex-col rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] group h-[300px] relative"
//                         >
//                           {/* ✅ BACKGROUND AVEC IMAGE DU PROJET OU BLANC */}
//                           <div 
//                             className={`absolute inset-0 bg-cover bg-center transition-opacity duration-300 group-hover:opacity-90 ${
//                               projectImage ? '' : 'bg-white dark:bg-[#001F3F]/30'
//                             }`}
//                             style={projectImage ? { 
//                               backgroundImage: `url(${projectImage})`,
//                               backgroundSize: 'cover',
//                               backgroundPosition: 'center',
//                               backgroundRepeat: 'no-repeat'
//                             } : {}}
//                           >
//                             {/* Overlay pour améliorer la lisibilité du texte */}
//                             {projectImage && (
//                               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
//                             )}
//                           </div>
                          
//                           {/* Contenu par-dessus l'image */}
//                           <div className="relative z-10 p-4 flex flex-col gap-3 flex-1">
//                             {/* Header avec titre */}
//                             <div className="flex flex-col gap-1">
//                               <h3 className={`text-sm font-bold line-clamp-2 ${
//                                 projectImage 
//                                   ? 'text-white drop-shadow-md' 
//                                   : 'text-[#001F3F] dark:text-white'
//                               }`}>
//                                 {project.title || 'Sans titre'}
//                               </h3>
                              
//                               {/* Auteur */}
//                               <div className="flex items-center gap-2 text-xs">
//                                 <span className={`material-symbols-outlined text-xs ${
//                                   projectImage ? 'text-white/80' : 'text-gray-500'
//                                 }`}>person</span>
//                                 <span className={`font-medium ${
//                                   projectImage 
//                                     ? 'text-white drop-shadow-sm' 
//                                     : 'text-gray-600 dark:text-gray-300'
//                                 }`}>
//                                   {authorName}
//                                 </span>
//                               </div>
                              
//                               {/* Cohort */}
//                               {cohortName && (
//                                 <div className="flex items-center gap-2 text-xs mt-1">
//                                   <span className={`material-symbols-outlined text-xs ${
//                                     projectImage ? 'text-white/80' : 'text-gray-500'
//                                   }`}>school</span>
//                                   <span className={
//                                     projectImage 
//                                       ? 'text-white/90 drop-shadow-sm' 
//                                       : 'text-gray-500 dark:text-gray-400'
//                                   }>
//                                     {cohortName}
//                                   </span>
//                                 </div>
//                               )}
                              
//                               {/* Date de dépôt */}
//                               {depositDate && (
//                                 <div className="flex items-center gap-2 text-xs mt-1">
//                                   <span className={`material-symbols-outlined text-xs ${
//                                     projectImage ? 'text-white/80' : 'text-gray-500'
//                                   }`}>calendar_today</span>
//                                   <span className={
//                                     projectImage 
//                                       ? 'text-white/90 drop-shadow-sm' 
//                                       : 'text-gray-500 dark:text-gray-400'
//                                   }>
//                                     {formattedDate}
//                                   </span>
//                                 </div>
//                               )}
//                             </div>
                            
//                             {/* Description courte */}
//                             {project.description && (
//                               <p className={`text-xs line-clamp-3 flex-1 mt-2 ${
//                                 projectImage 
//                                   ? 'text-white/95 drop-shadow-sm' 
//                                   : 'text-gray-600 dark:text-gray-300'
//                               }`}>
//                                 {project.description}
//                               </p>
//                             )}
                            
//                             {/* Badges technologies */}
//                             {technologies.length > 0 && (
//                               <div className="flex flex-wrap gap-1 mt-auto">
//                                 {technologies.slice(0, 3).map((tech, index) => (
//                                   <span 
//                                     key={index}
//                                     className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
//                                       projectImage
//                                         ? 'bg-white/20 text-white backdrop-blur-sm'
//                                         : 'bg-primary/10 text-primary'
//                                     }`}
//                                   >
//                                     {tech.substring(0, 12)}
//                                   </span>
//                                 ))}
//                                 {technologies.length > 3 && (
//                                   <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
//                                     projectImage
//                                       ? 'bg-white/20 text-white backdrop-blur-sm'
//                                       : 'bg-gray-200 text-gray-600'
//                                   }`}>
//                                     +{technologies.length - 3}
//                                   </span>
//                                 )}
//                               </div>
//                             )}
//                           </div>
                          
//                           {/* ✅ LIENS GITHUB ET DÉMO */}
//                           {(projectLinks.github || projectLinks.demo) && (
//                             <div className="relative z-10 px-4 pb-2 flex flex-wrap gap-2">
//                               {projectLinks.github && (
//                                 <a
//                                   href={projectLinks.github}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
//                                     projectImage
//                                       ? 'bg-gray-900/80 text-white hover:bg-gray-900'
//                                       : 'bg-gray-800 text-white hover:bg-gray-900'
//                                   } transition-colors`}
//                                   onClick={(e) => e.stopPropagation()}
//                                   title="Voir sur GitHub"
//                                 >
//                                   <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                                     <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
//                                   </svg>
//                                   GitHub
//                                 </a>
//                               )}
//                               {projectLinks.demo && (
//                                 <a
//                                   href={projectLinks.demo}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
//                                     projectImage
//                                       ? 'bg-green-700/80 text-white hover:bg-green-700'
//                                       : 'bg-green-600 text-white hover:bg-green-700'
//                                   } transition-colors`}
//                                   onClick={(e) => e.stopPropagation()}
//                                   title="Voir la démo"
//                                 >
//                                   <span className="material-symbols-outlined text-xs">open_in_new</span>
//                                   Démo
//                                 </a>
//                               )}
//                             </div>
//                           )}
                          
//                           {/* Actions */}
//                           <div className="relative z-10 border-t border-gray-200/50 dark:border-gray-700/50 p-3 flex items-center justify-between gap-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
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
//                                   : 'bg-white border-gray-200 dark:border-gray-600 text-gray-600 hover:bg-gray-100 hover:text-green-600'
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



// // src/pages/ExploreProjects.jsx - VERSION EXACTEMENT COMME ADMIN MAIS POUR UTILISATEURS
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import authService from '../services/auth';



// const ExploreProjects = () => {
//   const [projects, setProjects] = useState([]);
//   const [filteredProjects, setFilteredProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState('all');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [sortBy, setSortBy] = useState('newest');
//   const [downloading, setDownloading] = useState({});
//   const [stats, setStats] = useState({
//     total: 0,
//     published: 0,
//     pending: 0,
//     draft: 0,
//     rejected: 0
//   });
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const [apiInfo, setApiInfo] = useState(null);
//   const [isDemoMode, setIsDemoMode] = useState(false);
//   const [dbCount, setDbCount] = useState(0);
//   const [endpointsFound, setEndpointsFound] = useState([]);
//   const [activeEndpoint, setActiveEndpoint] = useState('');

//   const navigate = useNavigate();

//   const categories = [
//     { value: 'all', label: 'Toutes les catégories' },
//     { value: 'web', label: 'Développement Web' },
//     { value: 'mobile', label: 'Application Mobile' },
//     { value: 'ai', label: 'Intelligence Artificielle' },
//     { value: 'data', label: 'Data Science' },
//     { value: 'iot', label: 'IoT / Embedded' },
//     { value: 'game', label: 'Jeux Vidéo' },
//     { value: 'other', label: 'Autre' }
//   ];

//   const statuses = [
//     { value: 'all', label: 'Tous les statuts' },
//     { value: 'published', label: 'Publié' },
//     { value: 'pending', label: 'En attente' },
//     { value: 'draft', label: 'Brouillon' },
//     { value: 'rejected', label: 'Rejeté' },
//     { value: 'approved', label: 'Approuvé' }
//   ];

//   const sortOptions = [
//     { value: 'newest', label: 'Plus récent' },
//     { value: 'oldest', label: 'Plus ancien' },
//     { value: 'az', label: 'A-Z' },
//     { value: 'za', label: 'Z-A' }
//   ];

//   // ✅ DÉTECTER LES ENDPOINTS DJANGO
//   const discoverDjangoEndpoints = async () => {
//     console.log('🔍 Recherche des endpoints Django...');
    
//     const endpointsToTest = [
//       'http://localhost:8000/api/projects/projects/',
//       'http://localhost:8000/api/users/with-projects/',
//       'http://localhost:8000/api/projects/projects-with-users/',
//       'http://localhost:8000/api/projects/projects-grouped/',
//       'http://localhost:8000/api/projects/stats/',
//       'http://localhost:8000/api/projects/projects/debug/',
//       'http://localhost:8000/api/status/',
//       'http://localhost:8000/api/users/'
//     ];
    
//     const foundEndpoints = [];
    
//     for (const endpoint of endpointsToTest) {
//       try {
//         const response = await fetch(endpoint);
        
//         if (response.ok) {
//           const data = await response.json();
//           foundEndpoints.push({
//             url: endpoint,
//             data: data,
//             status: 'success',
//             count: data.count || data.projects?.length || data.users_with_projects?.length || 0
//           });
          
//           if (endpoint.includes('/status/')) {
//             setApiInfo(data);
//             setDbCount(data.database?.projects_count || data.projects_count || 0);
//           }
          
//           if (endpoint.includes('/api/projects/projects/') && data.projects && Array.isArray(data.projects)) {
//             return { 
//               projectsEndpoint: endpoint, 
//               projectsData: data.projects,
//               allEndpoints: foundEndpoints 
//             };
//           }
          
//           if (endpoint.includes('/users/with-projects/') && data.users && Array.isArray(data.users)) {
//             const userProjects = data.users.flatMap(user => 
//               user.projects?.items || []
//             );
//             if (userProjects.length > 0) {
//               return { 
//                 projectsEndpoint: endpoint, 
//                 projectsData: userProjects,
//                 allEndpoints: foundEndpoints 
//               };
//             }
//           }
          
//           if (endpoint.includes('/projects-with-users/') && data.users_with_projects && Array.isArray(data.users_with_projects)) {
//             const allProjects = data.users_with_projects.flatMap(user => user.projects || []);
//             if (allProjects.length > 0) {
//               return { 
//                 projectsEndpoint: endpoint, 
//                 projectsData: allProjects,
//                 allEndpoints: foundEndpoints 
//               };
//             }
//           }
//         }
//       } catch (err) {
//         foundEndpoints.push({
//           url: endpoint,
//           error: err.message,
//           status: 'error'
//         });
//       }
//     }
    
//     setEndpointsFound(foundEndpoints);
    
//     if (foundEndpoints.length === 0) {
//       setIsDemoMode(true);
//       return { projectsEndpoint: null, projectsData: [], allEndpoints: foundEndpoints };
//     }
    
//     const firstValidEndpoint = foundEndpoints.find(ep => ep.status === 'success');
//     if (firstValidEndpoint) {
//       return { 
//         projectsEndpoint: firstValidEndpoint.url, 
//         projectsData: firstValidEndpoint.data.projects || firstValidEndpoint.data || [],
//         allEndpoints: foundEndpoints 
//       };
//     }
    
//     return { projectsEndpoint: null, projectsData: [], allEndpoints: foundEndpoints };
//   };

//   // ✅ CHARGER LES PROJETS
//   const loadRealProjects = async () => {
//     try {
//       const { projectsEndpoint, projectsData, allEndpoints } = await discoverDjangoEndpoints();
//       setEndpointsFound(allEndpoints);
      
//       if (projectsEndpoint && projectsData && projectsData.length > 0) {
//         setIsDemoMode(false);
//         setActiveEndpoint(projectsEndpoint);
        
//         const transformedProjects = projectsData.map((project, index) => {
//           let authorInfo = {};
//           let authorName = '';
//           let authorEmail = '';
//           let authorUsername = '';
          
//           if (project.author) {
//             if (typeof project.author === 'object') {
//               authorInfo = {
//                 id: project.author.id || index + 1,
//                 username: project.author.username || `user${index + 1}`,
//                 first_name: project.author.first_name || '',
//                 last_name: project.author.last_name || '',
//                 email: project.author.email || '',
//                 is_staff: project.author.is_staff || false
//               };
//               authorName = project.author.first_name && project.author.last_name 
//                 ? `${project.author.first_name} ${project.author.last_name}`
//                 : project.author.username || '';
//               authorEmail = project.author.email || '';
//               authorUsername = project.author.username || '';
//             }
//           }
          
//           if (!authorName && project.author_name) authorName = project.author_name;
//           if (!authorEmail && project.author_email) authorEmail = project.author_email;
//           if (!authorUsername && project.author_username) authorUsername = project.author_username;
          
//           if (!authorName && !authorEmail && !authorUsername) {
//             authorInfo = {
//               id: project.author_id || index + 1,
//               username: `user${project.author_id || index + 1}`,
//               first_name: 'Utilisateur',
//               last_name: project.author_id ? `#${project.author_id}` : '',
//               email: `user${project.author_id || index + 1}@simplon.local`,
//               is_staff: false
//             };
//             authorName = authorInfo.username;
//             authorEmail = authorInfo.email;
//             authorUsername = authorInfo.username;
//           }
          
//           const status = project.status || 'draft';
//           const isPublished = status === 'published' || project.is_published === true;
//           const isDraft = status === 'draft' || project.is_draft === true;
//           const isRejected = status === 'rejected' || project.is_rejected === true;
//           const isApproved = status === 'approved' || project.is_approved === true;
          
//           let category = project.category || 'web';
//           if (!categories.find(c => c.value === category)) category = 'web';
          
//           return {
//             id: project.id || index + 1,
//             title: project.title || project.name || 'Sans titre',
//             description: project.description || project.short_description || '',
//             full_description: project.full_description || project.content || project.details || '',
//             technologies: project.technologies || project.tech_stack || project.tags || '',
//             category: category,
//             status: status,
//             cohort: project.cohort || 'Promotion 2024',
//             github_url: project.github_url || project.github_repo || project.repository_url || '',
//             demo_url: project.demo_url || project.live_url || project.website || '',
//             image: project.image || project.screenshot || project.featured_image || project.thumbnail,
//             created_at: project.created_at || project.date_created || new Date().toISOString(),
//             updated_at: project.updated_at || project.date_updated || new Date().toISOString(),
            
//             user: {
//               id: authorInfo.id || project.author_id || index + 1,
//               username: authorUsername || authorInfo.username,
//               first_name: authorInfo.first_name || authorName.split(' ')[0] || '',
//               last_name: authorInfo.last_name || authorName.split(' ').slice(1).join(' ') || '',
//               email: authorEmail || authorInfo.email,
//               is_staff: authorInfo.is_staff || false
//             },
            
//             author_name: authorName,
//             author_email: authorEmail,
//             author_username: authorUsername,
            
//             is_published: isPublished,
//             is_draft: isDraft,
//             is_rejected: isRejected,
//             is_approved: isApproved,
//             is_pending: status === 'pending' || status === 'review'
//           };
//         });
        
//         return transformedProjects;
//       }
      
//       setIsDemoMode(true);
//       return getDemoProjects();
      
//     } catch (error) {
//       setIsDemoMode(true);
//       return getDemoProjects();
//     }
//   };

//   // ✅ FONCTION PRINCIPALE
//   const fetchProjects = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const currentUser = authService.getCurrentUser();
//       setUser(currentUser);
      
//       const projectsData = await loadRealProjects();
      
//       setProjects(projectsData);
      
//       const statsData = {
//         total: projectsData.length,
//         published: projectsData.filter(p => 
//           p.status === 'published' || 
//           p.is_published === true ||
//           p.status === 'approved' ||
//           p.is_approved === true
//         ).length,
//         pending: projectsData.filter(p => 
//           p.status === 'pending' || 
//           p.is_pending === true
//         ).length,
//         draft: projectsData.filter(p => 
//           p.status === 'draft' || 
//           p.is_draft === true
//         ).length,
//         rejected: projectsData.filter(p => 
//           p.status === 'rejected' || 
//           p.is_rejected === true
//         ).length
//       };
//       setStats(statsData);

//       if (isDemoMode) {
//         setError(`⚠️ Mode démo - Données fictives (${dbCount > 0 ? dbCount + ' projets réels en base' : 'Base non accessible'})`);
//       } else {
//         setError(`✅ Mode production - ${projectsData.length} projets réels chargés depuis Django`);
//       }

//     } catch (error) {
//       const demoProjects = getDemoProjects();
//       setProjects(demoProjects);
//       setIsDemoMode(true);
      
//       const statsData = {
//         total: demoProjects.length,
//         published: 4,
//         pending: 2,
//         draft: 3,
//         rejected: 1
//       };
//       setStats(statsData);
      
//       setError(`❌ ${error.message} - Mode démo activé`);
      
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ DONNÉES DE DÉMONSTRATION
//   const getDemoProjects = () => {
//     return [
//       {
//         id: 1,
//         title: "Portfolio React Modern",
//         user: {
//           id: 1,
//           username: "lea.martin",
//           first_name: "Léa",
//           last_name: "Martin",
//           email: "lea.martin@example.com",
//           is_staff: false
//         },
//         cohort: "DWWM - Mars 2024",
//         category: "web",
//         status: "published",
//         is_published: true,
//         technologies: "React, TypeScript, Tailwind CSS",
//         description: "Portfolio moderne développé avec React, TypeScript et Tailwind CSS",
//         full_description: "Ce portfolio moderne a été développé en utilisant les dernières technologies front-end. Il présente mes compétences en développement web avec des animations fluides, un design responsive et une architecture modulaire.",
//         image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//         github_url: "https://github.com/example/portfolio-react",
//         demo_url: "https://portfolio-react-demo.netlify.app",
//         created_at: "2024-03-15T10:30:00Z",
//         author_name: "Léa Martin",
//         author_email: "lea.martin@example.com"
//       },
//       {
//         id: 2,
//         title: "Application E-commerce",
//         user: {
//           id: 2,
//           username: "mohamed.ali",
//           first_name: "Mohamed",
//           last_name: "Ali",
//           email: "mohamed.ali@example.com",
//           is_staff: false
//         },
//         cohort: "CDA - Avril 2024",
//         category: "web",
//         status: "pending",
//         is_pending: true,
//         technologies: "React, Node.js, MongoDB, Express",
//         description: "Une application e-commerce complète avec panier et paiement",
//         full_description: "Application e-commerce complète avec système de panier, authentification utilisateur, intégration de paiement Stripe, et tableau de bord administrateur. Utilise une architecture MERN (MongoDB, Express, React, Node.js).",
//         github_url: "https://github.com/example/ecommerce-app",
//         demo_url: "https://ecommerce-demo.vercel.app",
//         created_at: "2024-04-20T14:15:00Z",
//         author_name: "Mohamed Ali",
//         author_email: "mohamed.ali@example.com"
//       },
//       {
//         id: 3,
//         title: "Jeu JavaScript",
//         user: {
//           id: 3,
//           username: "sophie123",
//           first_name: "Sophie",
//           last_name: "",
//           email: "sophie@example.com",
//           is_staff: false
//         },
//         cohort: "DWWM - Février 2024",
//         category: "game",
//         status: "draft",
//         is_draft: true,
//         technologies: "JavaScript, HTML5, Canvas, CSS3",
//         description: "Un jeu en JavaScript utilisant Canvas",
//         full_description: "Jeu développé en JavaScript pur utilisant l'API Canvas. Le jeu implémente un système de collision, des animations fluides et une gestion des scores. Compatible avec tous les navigateurs modernes.",
//         github_url: "https://github.com/example/javascript-game",
//         demo_url: "https://js-game-demo.netlify.app",
//         created_at: "2024-02-10T09:45:00Z",
//         author_name: "Sophie",
//         author_email: "sophie@example.com"
//       }
//     ];
//   };

//   // ✅ NAVIGUER VERS LA PAGE DE DÉTAIL
//   const handleViewDetails = (project) => {
//     // Stocker le projet dans le sessionStorage pour l'utiliser sur la page de détail
//     sessionStorage.setItem('selectedProject', JSON.stringify(project));
    
//     // Naviguer vers la page de détail
//     navigate(`/project/${project.id}`);
//   };

//   // ✅ TÉLÉCHARGER LES DONNÉES D'UN PROJET
//   const downloadProjectData = async (project) => {
//     if (!project) return;
    
//     setDownloading(prev => ({ ...prev, [project.id]: true }));
    
//     try {
//       let dataToExport;
      
//       if (isDemoMode) {
//         dataToExport = project;
//       } else {
//         try {
//           const response = await fetch(`${activeEndpoint}${project.id}/`);
//           if (response.ok) {
//             dataToExport = await response.json();
//           } else {
//             dataToExport = project;
//           }
//         } catch (error) {
//           dataToExport = project;
//         }
//       }
      
//       const projectDataStr = JSON.stringify(dataToExport, null, 2);
//       const blob = new Blob([projectDataStr], { type: 'application/json' });
//       const url = URL.createObjectURL(blob);
      
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `projet-${project.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
      
//     } catch (error) {
//       console.error('Erreur lors du téléchargement:', error);
//       setError('Erreur lors du téléchargement des données');
//     } finally {
//       setTimeout(() => {
//         setDownloading(prev => ({ ...prev, [project.id]: false }));
//       }, 500);
//     }
//   };

//   // ✅ TÉLÉCHARGER TOUS LES PROJETS (CSV)
//   const downloadAllProjectsCSV = () => {
//     try {
//       const headers = ['ID', 'Titre', 'Auteur', 'Email', 'Cohorte', 'Catégorie', 'Statut', 'Technologies', 'GitHub', 'Démo', 'Date de création'];
      
//       const csvRows = [
//         headers.join(','),
//         ...filteredProjects.map(project => {
//           const row = [
//             project.id,
//             `"${project.title.replace(/"/g, '""')}"`,
//             `"${getAuthorName(project).replace(/"/g, '""')}"`,
//             `"${project.user?.email || project.author_email || ''}"`,
//             `"${project.cohort || ''}"`,
//             `"${project.category || ''}"`,
//             `"${project.status || ''}"`,
//             `"${getTechnologies(project).join(', ').replace(/"/g, '""')}"`,
//             `"${project.github_url || ''}"`,
//             `"${project.demo_url || ''}"`,
//             `"${formatDate(project.created_at)}"`
//           ];
//           return row.join(',');
//         })
//       ];
      
//       const csvString = csvRows.join('\n');
//       const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
//       const url = URL.createObjectURL(blob);
      
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `tous-les-projets-${new Date().toISOString().split('T')[0]}.csv`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
      
//     } catch (error) {
//       console.error('Erreur lors de l\'export CSV:', error);
//       setError('Erreur lors de l\'export des données');
//     }
//   };

//   const getProjectImage = (project) => {
//     if (!project) return null;
    
//     const imageFields = ['image', 'screenshot', 'thumbnail', 'cover_image', 'featured_image', 'project_image'];
    
//     for (const field of imageFields) {
//       if (project[field]) {
//         const imageValue = project[field];
        
//         if (typeof imageValue === 'string') {
//           if (imageValue.startsWith('http')) return imageValue;
//           if (imageValue.startsWith('/media/') || imageValue.startsWith('/static/')) {
//             return `http://localhost:8000${imageValue}`;
//           }
//           if (imageValue.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
//             return `http://localhost:8000/media/${imageValue}`;
//           }
//         }
//       }
//     }
    
//     const defaultImages = {
//       web: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//       mobile: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//       ai: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//       data: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//       iot: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//       game: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//       other: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
//     };
    
//     const category = project.category || project.project_category || 'other';
//     return defaultImages[category] || defaultImages.other;
//   };

//   const getAuthorName = (project) => {
//     if (!project) return 'Auteur inconnu';
    
//     if (project.author_name) return project.author_name;
    
//     if (project.user) {
//       if (project.user.first_name && project.user.last_name) {
//         return `${project.user.first_name} ${project.user.last_name}`;
//       }
//       if (project.user.first_name) return project.user.first_name;
//       if (project.user.last_name) return project.user.last_name;
//       if (project.user.username) return project.user.username;
//       if (project.user.email) return project.user.email.split('@')[0];
//     }
    
//     if (project.author_username) return project.author_username;
//     if (project.author_email) return project.author_email.split('@')[0];
    
//     return 'Auteur inconnu';
//   };

//   const getCohortName = (project) => {
//     if (!project) return null;
//     return project.cohort || project.user?.cohort || null;
//   };

//   const getTechnologies = (project) => {
//     if (!project) return [];
    
//     if (project.technologies) {
//       if (Array.isArray(project.technologies)) return project.technologies;
//       if (typeof project.technologies === 'string') {
//         return project.technologies.split(',').map(t => t.trim()).filter(t => t.length > 0);
//       }
//     }
    
//     return [];
//   };

//   const formatDate = (dateString) => {
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

//   const getProjectLinks = (project) => {
//     const links = {
//       github: null,
//       demo: null
//     };
    
//     if (!project) return links;
    
//     const githubFields = ['github_url', 'github_repo', 'repository_url', 'github', 'repo_url'];
//     for (const field of githubFields) {
//       if (project[field]) {
//         let url = project[field];
//         if (url && !url.startsWith('http')) url = `https://${url}`;
//         links.github = url;
//         break;
//       }
//     }
    
//     const demoFields = ['demo_url', 'live_url', 'website', 'demo', 'url'];
//     for (const field of demoFields) {
//       if (project[field]) {
//         let url = project[field];
//         if (url && !url.startsWith('http')) url = `https://${url}`;
//         links.demo = url;
//         break;
//       }
//     }
    
//     return links;
//   };

//   const filterAndSortProjects = () => {
//     let filtered = [...projects];

//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = filtered.filter(project => {
//         const titleMatch = project.title?.toLowerCase().includes(searchLower) || false;
//         const descMatch = project.description?.toLowerCase().includes(searchLower) || false;
//         const authorMatch = getAuthorName(project).toLowerCase().includes(searchLower);
//         const techMatch = getTechnologies(project).some(tech => 
//           tech.toLowerCase().includes(searchLower)
//         );
//         const cohortMatch = getCohortName(project)?.toLowerCase().includes(searchLower) || false;
        
//         return titleMatch || descMatch || authorMatch || techMatch || cohortMatch;
//       });
//     }

//     if (categoryFilter !== 'all') {
//       filtered = filtered.filter(project => {
//         const projectCategory = (project.category || 'other').toLowerCase();
//         return projectCategory === categoryFilter;
//       });
//     }

//     if (statusFilter !== 'all') {
//       filtered = filtered.filter(project => {
//         const status = project.status?.toLowerCase() || 'draft';
//         return status === statusFilter;
//       });
//     }

//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case 'newest':
//           return new Date(b.created_at) - new Date(a.created_at);
//         case 'oldest':
//           return new Date(a.created_at) - new Date(b.created_at);
//         case 'az':
//           return (a.title || '').localeCompare(b.title || '');
//         case 'za':
//           return (b.title || '').localeCompare(a.title || '');
//         default:
//           return 0;
//       }
//     });

//     setFilteredProjects(filtered);
//   };

//   const getStatusBadge = (project) => {
//     const status = project.status?.toLowerCase() || 'draft';
//     const isPublished = project.is_published || status === 'published' || status === 'approved';
//     const isDraft = project.is_draft || status === 'draft';
//     const isRejected = project.is_rejected || status === 'rejected';
//     const isPending = project.is_pending || status === 'pending';
    
//     let label = 'Inconnu';
//     let color = 'bg-gray-100 text-gray-800';
    
//     if (isPublished) {
//       label = 'Publié';
//       color = 'bg-green-100 text-green-800';
//     } else if (isDraft) {
//       label = 'Brouillon';
//       color = 'bg-gray-100 text-gray-800';
//     } else if (isRejected) {
//       label = 'Rejeté';
//       color = 'bg-red-100 text-red-800';
//     } else if (isPending) {
//       label = 'En attente';
//       color = 'bg-yellow-100 text-yellow-800';
//     } else if (status === 'approved') {
//       label = 'Approuvé';
//       color = 'bg-blue-100 text-blue-800';
//     }
    
//     return (
//       <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${color}`}>
//         {label}
//       </span>
//     );
//   };

//   const getCategoryIcon = (category) => {
//     const icons = {
//       web: 'language',
//       mobile: 'smartphone',
//       ai: 'smart_toy',
//       data: 'bar_chart',
//       iot: 'settings_input_antenna',
//       game: 'sports_esports',
//       other: 'category'
//     };
//     return icons[category] || 'folder';
//   };

//   const handleManualSearch = async () => {
//     setLoading(true);
//     try {
//       const { projectsEndpoint, projectsData } = await discoverDjangoEndpoints();
      
//       if (projectsEndpoint && projectsData.length > 0) {
//         setProjects(projectsData);
//         setIsDemoMode(false);
//         setActiveEndpoint(projectsEndpoint);
//         setError(`✅ ${projectsData.length} projets trouvés sur ${projectsEndpoint}`);
//       } else {
//         setError('❌ Aucun endpoint de projets trouvé. Mode démo activé.');
//         setProjects(getDemoProjects());
//         setIsDemoMode(true);
//       }
//     } catch (error) {
//       setError(`❌ Erreur: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRefresh = () => {
//     fetchProjects();
//   };

//   const handleLogout = () => {
//     authService.logout();
//     navigate('/quicklogin');
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   useEffect(() => {
//     filterAndSortProjects();
//   }, [projects, searchTerm, categoryFilter, statusFilter, sortBy]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E30613] border-t-transparent mx-auto"></div>
//           <p className="mt-4 text-gray-600 text-lg font-medium">Chargement des projets...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <div className="flex">


//          <aside className="w-64 flex-shrink-0 bg-[#001F3F] text-white flex flex-col p-4">
//                   <div className="flex items-center gap-3 px-3 py-2">
//                     <img 
//                       src="/src/logo.png" 
//                       alt="Logo Simplon" 
//                       className="size-10 rounded-full object-cover"
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.src = "https://via.placeholder.com/40";
//                       }}
//                     />
//                     <div className="flex flex-col">
//                       <h1 className="text-white text-base font-medium leading-normal">Simplon</h1>
//                       <p className="text-gray-400 text-sm font-normal leading-normal">Code Platform</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex flex-col justify-between flex-grow mt-6">
//                     <nav className="flex flex-col gap-2">
//                       <Link 
//                         to="/dashboard" 
//                         className="flex items-center gap-3 px-3 py-2 rounded-lg 
//                         text-white"
//                       >
//                         <span className="material-symbols-outlined">folder</span>
//                         <p className="text-sm font-medium">Mes projets</p>
//                       </Link>
//                       <Link 
//                         to="/upload" 
//                         className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10"
//                       >
//                         <span className="material-symbols-outlined">upload_file</span>
//                         <p className="text-sm font-medium">Déposer un projet</p>
//                       </Link>
//                       <Link 
//                         to="/explore" 
//                         className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary bg-[#003265] "
//                       >
//                         <span className="material-symbols-outlined">explore</span>
//                         <p className="text-sm font-medium">Explorer les projets</p>
//                       </Link>
//                     </nav>
                    
//                     <div className="flex flex-col gap-1">
//                       <Link 
//                         to="/profile" 
//                         className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10"
//                       >
//                         <span className="material-symbols-outlined">person</span>
//                         <p className="text-sm font-medium leading-normal">Profil</p>
//                       </Link>
        
//                       <Link to="/parametre" className="flex items-center gap-3 rounded px-3 py-2 text-white/70 hover:bg-[#003265] hover:text-white">
//                         <span className="material-symbols-outlined">settings</span>
//                         <span>Paramètre</span>
//                       </Link>
//                       <button 
//                         onClick={handleLogout}
//                         className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-left"
//                       >
//                         <span className="material-symbols-outlined">logout</span>
//                         <p className="text-sm font-medium">Déconnexion</p>
//                       </button>
//                     </div>
//                   </div>
//                 </aside>

//         {/* Contenu principal */}
//         <main className="flex-1 p-6 lg:p-8 overflow-auto">
//           <div className="max-w-7xl mx-auto">
            
//             {/* En-tête avec informations */}
//             <div className="mb-8">
//               <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
//                 <div className="flex-1">
//                   <h1 className="text-2xl lg:text-3xl font-bold text-[#001F3F] mb-3">
//                     Explorer les Projets
//                   </h1>
//                   <div className="space-y-2">
//                     <p className="text-gray-700 text-sm lg:text-base">
//                       {user ? `👤 Connecté en tant que: ${user.first_name || user.username || user.email}` : '🔒 Non connecté'}
//                     </p>
//                     <div className="flex flex-wrap gap-2">
//                       <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${isDemoMode ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
//                         {isDemoMode ? '⚠️ Mode démo' : '✅ Mode production'}
//                       </span>
//                       <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
//                         📊 {stats.total} projet{stats.total !== 1 ? 's' : ''}
//                       </span>
//                       {dbCount > 0 && (
//                         <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
//                           🗄️ {dbCount} en base
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Actions */}
//                 {/* <div className="flex flex-col gap-3 min-w-[280px] max-w-full">
//                   <button
//                     onClick={handleManualSearch}
//                     className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 font-medium text-sm lg:text-base"
//                   >
//                     <span className="material-symbols-outlined text-lg">search</span>
//                     Rechercher les projets
//                   </button>
                  
//                   <button
//                     onClick={handleRefresh}
//                     className="px-4 py-3 bg-[#001F3F] text-white rounded-xl hover:bg-[#003265] transition-all flex items-center justify-center gap-2 font-medium text-sm lg:text-base"
//                   >
//                     <span className="material-symbols-outlined text-lg">refresh</span>
//                     Actualiser
//                   </button>
                  
//                   {filteredProjects.length > 0 && (
//                     <button
//                       onClick={downloadAllProjectsCSV}
//                       className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 font-medium text-sm lg:text-base"
//                     >
//                       <span className="material-symbols-outlined text-lg">download</span>
//                       Exporter tous ({filteredProjects.length})
//                     </button>
//                   )}
//                 </div> */}
//               </div>
              
//               {/* Messages d'information/erreur */}
//               {error && (
//                 <div className="mt-6">
//                   <div className={`p-4 rounded-xl ${
//                     error.includes('✅') ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300' : 
//                     error.includes('⚠️') ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-300' : 
//                     'bg-gradient-to-r from-red-50 to-pink-50 border border-red-300'
//                   }`}>
//                     <div className="flex items-start gap-3">
//                       <span className="material-symbols-outlined text-xl mt-0.5">
//                         {error.includes('✅') ? 'check_circle' : 
//                          error.includes('⚠️') ? 'warning' : 'error'}
//                       </span>
//                       <div className="flex-1">
//                         <p className={`text-sm font-medium ${
//                           error.includes('✅') ? 'text-green-800' : 
//                           error.includes('⚠️') ? 'text-yellow-800' : 'text-red-800'
//                         }`}>
//                           {error}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Statistiques */}
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
//               <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 shadow border border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-xs text-gray-600 mb-1">Total</p>
//                     <p className="text-2xl font-bold text-[#001F3F]">{stats.total}</p>
//                   </div>
//                   <span className="material-symbols-outlined text-[#E30613] text-3xl opacity-80">
//                     layers
//                   </span>
//                 </div>
//               </div>

//               <div className="bg-gradient-to-br from-white to-green-50 rounded-xl p-4 shadow border border-green-100">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-xs text-gray-600 mb-1">Publiés</p>
//                     <p className="text-2xl font-bold text-green-600">{stats.published}</p>
//                   </div>
//                   <span className="material-symbols-outlined text-green-500 text-3xl opacity-80">
//                     check_circle
//                   </span>
//                 </div>
//               </div>

//               <div className="bg-gradient-to-br from-white to-yellow-50 rounded-xl p-4 shadow border border-yellow-100">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-xs text-gray-600 mb-1">En attente</p>
//                     <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
//                   </div>
//                   <span className="material-symbols-outlined text-yellow-500 text-3xl opacity-80">
//                     schedule
//                   </span>
//                 </div>
//               </div>

//               <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 shadow border border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-xs text-gray-600 mb-1">Brouillons</p>
//                     <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
//                   </div>
//                   <span className="material-symbols-outlined text-gray-500 text-3xl opacity-80">
//                     draft
//                   </span>
//                 </div>
//               </div>

//               <div className="bg-gradient-to-br from-white to-red-50 rounded-xl p-4 shadow border border-red-100">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-xs text-gray-600 mb-1">Rejetés</p>
//                     <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
//                   </div>
//                   <span className="material-symbols-outlined text-red-500 text-3xl opacity-80">
//                     block
//                   </span>
//                 </div>
//               </div>
//             </div>
//             {/* Barre de recherche et filtres */}
//             <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow p-5 mb-8 border border-gray-200">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
//                 {/* Recherche */}
//                 <div className="lg:col-span-4">
//                   <div className="relative">
//                     <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
//                       search
//                     </span>
//                     <input
//                       type="text"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       placeholder="Rechercher..."
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] bg-white text-gray-800"
//                     />
//                   </div>
//                 </div>

//                 {/* Catégorie */}
//                 <div className="lg:col-span-2">
//                   <select
//                     value={categoryFilter}
//                     onChange={(e) => setCategoryFilter(e.target.value)}
//                     className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] bg-white text-gray-800"
//                   >
//                     {categories.map(cat => (
//                       <option key={cat.value} value={cat.value}>{cat.label}</option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Statut */}
//                 <div className="lg:col-span-2">
//                   <select
//                     value={statusFilter}
//                     onChange={(e) => setStatusFilter(e.target.value)}
//                     className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] bg-white text-gray-800"
//                   >
//                     {statuses.map(status => (
//                       <option key={status.value} value={status.value}>{status.label}</option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Tri */}
//                 <div className="lg:col-span-2">
//                   <div className="flex items-center gap-2 h-full">
//                     <span className="text-gray-600 text-sm whitespace-nowrap">Trier:</span>
//                     <select
//                       value={sortBy}
//                       onChange={(e) => setSortBy(e.target.value)}
//                       className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] bg-white text-gray-800"
//                     >
//                       {sortOptions.map(option => (
//                         <option key={option.value} value={option.value}>{option.label}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 {/* Export */}
//                 <div className="lg:col-span-2">
//                   {/* <button
//                     onClick={downloadAllProjectsCSV}
//                     disabled={filteredProjects.length === 0}
//                     className={`w-full px-3 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
//                       filteredProjects.length === 0 
//                         ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
//                         : 'bg-gradient-to-r from-[#001F3F] to-[#003265] text-white hover:opacity-90'
//                     }`}
//                   >
//                     <span className="material-symbols-outlined">download</span>
//                     <span className="hidden sm:inline">Exporter</span>
//                   </button> */}
//                 </div>
//               </div>
              
//               {/* Résumé filtres */}
//               <div className="mt-4 pt-4 border-t border-gray-200">
//                 <div className="flex flex-wrap items-center justify-between gap-3">
//                   <div className="flex items-center gap-2">
//                     <span className="text-gray-700 font-medium">
//                       {filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''}
//                       {searchTerm && ` pour "${searchTerm}"`}
//                     </span>
//                     {(categoryFilter !== 'all' || statusFilter !== 'all') && (
//                       <div className="flex flex-wrap gap-2">
//                         {categoryFilter !== 'all' && (
//                           <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
//                             {categories.find(c => c.value === categoryFilter)?.label}
//                           </span>
//                         )}
//                         {statusFilter !== 'all' && (
//                           <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
//                             {statuses.find(s => s.value === statusFilter)?.label}
//                           </span>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Grille de projets */}
//             <div className="mb-8">
//               {filteredProjects.length === 0 ? (
//                 <div className="text-center py-12 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-inner border border-dashed border-gray-300">
//                   <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">
//                     search_off
//                   </span>
//                   <h3 className="text-xl font-bold text-gray-700 mb-2">
//                     Aucun projet trouvé
//                   </h3>
//                   <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
//                     Aucun projet ne correspond à vos critères de recherche.
//                   </p>
//                   <button
//                     onClick={() => {
//                       setSearchTerm('');
//                       setCategoryFilter('all');
//                       setStatusFilter('all');
//                     }}
//                     className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
//                   >
//                     Réinitialiser les filtres
//                   </button>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//                   {filteredProjects.map(project => {
//                     const projectImage = getProjectImage(project);
//                     const authorName = getAuthorName(project);
//                     const cohortName = getCohortName(project);
//                     const technologies = getTechnologies(project);
//                     const formattedDate = formatDate(project.created_at);
//                     const projectLinks = getProjectLinks(project);
                    
//                     return (
//                       <div 
//                         key={project.id} 
//                         className="group flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:border-[#E30613] hover:shadow-lg"
//                       >
//                         {/* Image du projet */}
//                         <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
//                           {projectImage ? (
//                             <img 
//                               src={projectImage} 
//                               alt={project.title}
//                               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                               onError={(e) => {
//                                 e.target.style.display = 'none';
//                                 e.target.parentElement.classList.add('bg-gradient-to-br', 'from-blue-50', 'to-indigo-100');
//                               }}
//                             />
//                           ) : (
//                             <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
//                               <span className="material-symbols-outlined text-gray-400 text-5xl">
//                                 {getCategoryIcon(project.category)}
//                               </span>
//                             </div>
//                           )}
                          
//                           {/* Badge de statut */}
//                           <div className="absolute top-2 right-2">
//                             {getStatusBadge(project)}
//                           </div>
//                         </div>
                        
//                         {/* Contenu */}
//                         <div className="flex-1 p-4">
//                           <div className="mb-3">
//                             <h3 className="text-base font-bold text-[#001F3F] mb-1 line-clamp-1">
//                               {project.title}
//                             </h3>
                            
//                             {project.description && (
//                               <p className="text-gray-600 text-xs line-clamp-2 mb-2">
//                                 {project.description}
//                               </p>
//                             )}
//                           </div>
                          
//                           {/* Infos auteur et date */}
//                           <div className="space-y-2 mb-3">
//                             <div className="flex items-center gap-2">
//                               <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
//                                 {authorName.charAt(0).toUpperCase()}
//                               </div>
//                               <div className="flex-1 min-w-0">
//                                 <p className="font-medium text-gray-800 text-sm truncate">{authorName}</p>
//                                 <p className="text-xs text-gray-500">{formattedDate}</p>
//                               </div>
//                             </div>
                            
//                             {cohortName && (
//                               <div className="flex items-center gap-1 text-xs text-gray-600">
//                                 <span className="material-symbols-outlined text-sm">school</span>
//                                 <span className="truncate">{cohortName}</span>
//                               </div>
//                             )}
//                           </div>
                          
//                           {/* Technologies */}
//                           {technologies.length > 0 && (
//                             <div className="mb-3">
//                               <div className="flex flex-wrap gap-1">
//                                 {technologies.slice(0, 2).map((tech, index) => (
//                                   <span 
//                                     key={index}
//                                     className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200"
//                                   >
//                                     {tech.length > 15 ? tech.substring(0, 15) + '...' : tech}
//                                   </span>
//                                 ))}
//                                 {technologies.length > 2 && (
//                                   <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded">
//                                     +{technologies.length - 2}
//                                   </span>
//                                 )}
//                               </div>
//                             </div>
//                           )}
//                         </div>
                        
//                         {/* Actions */}
//                         <div className="px-4 pb-4 pt-0">
//                           <div className="flex items-center justify-between gap-2">
//                             {/* Liens */}
//                             <div className="flex gap-1">
//                               {/* Bouton Détail */}
//                               <button
//                                 onClick={() => handleViewDetails(project)}
//                                 className="px-3 py-1.5 bg-[#001F3F] text-white rounded text-xs font-medium flex items-center gap-1 hover:bg-[#003265] transition-colors"
//                                 title="Voir les détails"
//                               >
//                                 <span className="material-symbols-outlined text-xs">visibility</span>
//                                 Détail
//                               </button>
//                             </div>
                            
//                             {/* Actions admin */}
//                             <div className="flex items-center gap-1">
//                               {(projectLinks.github || projectLinks.demo) && (
//                                 <>
//                                   {projectLinks.github && (
//                                     <a
//                                       href={projectLinks.github}
//                                       target="_blank"
//                                       rel="noopener noreferrer"
//                                       className="p-1.5 bg-gray-900 text-white rounded hover:bg-black transition-colors"
//                                       title="GitHub"
//                                     >
//                                       <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
//                                         <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
//                                       </svg>
//                                     </a>
//                                   )}
//                                   {projectLinks.demo && (
//                                     <a
//                                       href={projectLinks.demo}
//                                       target="_blank"
//                                       rel="noopener noreferrer"
//                                       className="p-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded hover:opacity-90"
//                                       title="Démo"
//                                     >
//                                       <span className="material-symbols-outlined text-xs">open_in_new</span>
//                                     </a>
//                                   )}
//                                 </>
//                               )}
                              
//                               <button
//                                 onClick={() => downloadProjectData(project)}
//                                 disabled={downloading[project.id]}
//                                 className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
//                                 title="Télécharger les données"
//                               >
//                                 <span className="material-symbols-outlined text-sm">
//                                   {downloading[project.id] ? 'download' : 'download'}
//                                 </span>
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* Pied de page */}
//             <div className="mt-8 pt-6 border-t border-gray-200">
//               <div className="text-center text-sm text-gray-500">
//                 <p>Vous pouvez télécharger n'importe quel projet pour l'étudier localement.</p>
//                 <p className="mt-1">Les projets sont partagés par les apprenants de Simplon.</p>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default ExploreProjects;



// src/pages/ExploreProjects.jsx - VERSION CORRIGÉE POUR AFFICHER TOUS LES PROJETS
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth';

const ExploreProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [downloading, setDownloading] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    pending: 0,
    draft: 0,
    rejected: 0
  });
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [apiInfo, setApiInfo] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [dbCount, setDbCount] = useState(0);
  const [endpointsFound, setEndpointsFound] = useState([]);
  const [activeEndpoint, setActiveEndpoint] = useState('');

  const navigate = useNavigate();

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'web', label: 'Développement Web' },
    { value: 'mobile', label: 'Application Mobile' },
    { value: 'ai', label: 'Intelligence Artificielle' },
    { value: 'data', label: 'Data Science' },
    { value: 'iot', label: 'IoT / Embedded' },
    { value: 'game', label: 'Jeux Vidéo' },
    { value: 'other', label: 'Autre' }
  ];

  const statuses = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'published', label: 'Publié' },
    { value: 'pending', label: 'En attente' },
    { value: 'draft', label: 'Brouillon' },
    { value: 'rejected', label: 'Rejeté' },
    { value: 'approved', label: 'Approuvé' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Plus récent' },
    { value: 'oldest', label: 'Plus ancien' },
    { value: 'az', label: 'A-Z' },
    { value: 'za', label: 'Z-A' }
  ];

  // ✅ DÉTECTER LES ENDPOINTS DJANGO - VERSION AMÉLIORÉE
  const discoverDjangoEndpoints = async () => {
    console.log('🔍 Recherche approfondie des endpoints Django...');
    
    const endpointsToTest = [
      'http://localhost:8000/api/projects/',
      'http://localhost:8000/api/projects/projects/',
      'http://localhost:8000/api/projects/all/',
      'http://localhost:8000/api/projects/list/',
      'http://localhost:8000/api/users/with-projects/',
      'http://localhost:8000/api/projects/projects-with-users/',
      'http://localhost:8000/api/projects/projects-grouped/',
      'http://localhost:8000/api/projects/stats/',
      'http://localhost:8000/api/status/',
      'http://localhost:8000/api/users/'
    ];
    
    const foundEndpoints = [];
    let bestEndpoint = null;
    let bestData = [];
    let maxProjects = 0;
    
    for (const endpoint of endpointsToTest) {
      try {
        console.log(`🔗 Test de l'endpoint: ${endpoint}`);
        const response = await fetch(endpoint, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Endpoint ${endpoint} accessible`);
          console.log('📊 Structure des données:', Object.keys(data));
          
          let count = 0;
          let extractedProjects = [];
          
          // Essayer d'extraire les projets de différentes structures
          if (data.results && Array.isArray(data.results)) {
            extractedProjects = data.results;
            count = data.count || data.results.length;
          } else if (data.projects && Array.isArray(data.projects)) {
            extractedProjects = data.projects;
            count = data.count || data.projects.length;
          } else if (Array.isArray(data)) {
            extractedProjects = data;
            count = data.length;
          } else if (data.items && Array.isArray(data.items)) {
            extractedProjects = data.items;
            count = data.count || data.items.length;
          } else if (data.users_with_projects && Array.isArray(data.users_with_projects)) {
            // Cas spécial pour users/with-projects
            extractedProjects = data.users_with_projects.flatMap(user => 
              user.projects || []
            );
            count = extractedProjects.length;
          } else if (data.users && Array.isArray(data.users)) {
            // Cas spécial pour users/with-projects
            extractedProjects = data.users.flatMap(user => 
              user.projects?.items || []
            );
            count = extractedProjects.length;
          }
          
          console.log(`📦 ${extractedProjects.length} projets extraits de ${endpoint}`);
          
          foundEndpoints.push({
            url: endpoint,
            data: data,
            status: 'success',
            count: count,
            extractedProjects: extractedProjects
          });
          
          // Récupérer les infos de statut
          if (endpoint.includes('/status/')) {
            setApiInfo(data);
            setDbCount(data.database?.projects_count || data.projects_count || 0);
          }
          
          // Garder l'endpoint avec le plus de projets
          if (extractedProjects.length > maxProjects) {
            maxProjects = extractedProjects.length;
            bestEndpoint = endpoint;
            bestData = extractedProjects;
          }
        } else {
          console.log(`❌ Endpoint ${endpoint} inaccessible: ${response.status}`);
          foundEndpoints.push({
            url: endpoint,
            status: 'error',
            error: `HTTP ${response.status}`
          });
        }
      } catch (err) {
        console.log(`❌ Erreur avec ${endpoint}:`, err.message);
        foundEndpoints.push({
          url: endpoint,
          error: err.message,
          status: 'error'
        });
      }
    }
    
    setEndpointsFound(foundEndpoints);
    console.log(`🏆 Meilleur endpoint: ${bestEndpoint} avec ${bestData.length} projets`);
    
    if (bestEndpoint && bestData.length > 0) {
      return { 
        projectsEndpoint: bestEndpoint, 
        projectsData: bestData,
        allEndpoints: foundEndpoints 
      };
    }
    
    console.log('⚠️ Aucun endpoint valide trouvé, activation du mode démo');
    setIsDemoMode(true);
    return { projectsEndpoint: null, projectsData: [], allEndpoints: foundEndpoints };
  };

  // ✅ GESTION DE LA PAGINATION
  const fetchAllProjectsWithPagination = async (baseUrl) => {
    let allProjects = [];
    let nextUrl = baseUrl;
    let page = 1;
    
    console.log(`📄 Début de la pagination depuis: ${baseUrl}`);
    
    try {
      while (nextUrl && page <= 10) { // Limite à 10 pages pour éviter les boucles infinies
        console.log(`📖 Chargement page ${page}: ${nextUrl}`);
        
        const response = await fetch(nextUrl, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          console.log(`❌ Erreur page ${page}: HTTP ${response.status}`);
          break;
        }
        
        const data = await response.json();
        console.log(`✅ Page ${page} chargée, structure:`, Object.keys(data));
        
        // Extraire les projets selon la structure
        let pageProjects = [];
        if (data.results && Array.isArray(data.results)) {
          pageProjects = data.results;
        } else if (data.projects && Array.isArray(data.projects)) {
          pageProjects = data.projects;
        } else if (Array.isArray(data)) {
          pageProjects = data;
        } else if (data.items && Array.isArray(data.items)) {
          pageProjects = data.items;
        }
        
        console.log(`📦 Page ${page}: ${pageProjects.length} projets`);
        
        allProjects = [...allProjects, ...pageProjects];
        
        // Vérifier la pagination
        if (data.next) {
          nextUrl = data.next;
        } else if (data.links && data.links.next) {
          nextUrl = data.links.next;
        } else {
          nextUrl = null;
        }
        
        page++;
        
        // Pause pour éviter de surcharger l'API
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error('❌ Erreur de pagination:', error);
    }
    
    console.log(`✅ Pagination terminée: ${allProjects.length} projets au total`);
    return allProjects;
  };

  // ✅ CHARGER LES PROJETS - VERSION CORRIGÉE
  const loadRealProjects = async () => {
    try {
      console.log('=== DÉBUT DU CHARGEMENT DES PROJETS ===');
      
      const { projectsEndpoint, projectsData, allEndpoints } = await discoverDjangoEndpoints();
      
      console.log('📊 Résultat de la découverte:');
      console.log('- Endpoint:', projectsEndpoint);
      console.log('- Projets bruts:', projectsData?.length || 0);
      console.log('- Mode démo:', isDemoMode);
      
      setEndpointsFound(allEndpoints);
      
      let finalProjects = [];
      
      if (projectsEndpoint && projectsData && projectsData.length > 0) {
        setIsDemoMode(false);
        setActiveEndpoint(projectsEndpoint);
        
        console.log(`🎯 Transformation de ${projectsData.length} projets...`);
        
        // Vérifier si nous avons besoin de pagination
        if (projectsData.length < dbCount && dbCount > 0) {
          console.log(`📚 Pagination nécessaire: ${projectsData.length} < ${dbCount}`);
          const allProjects = await fetchAllProjectsWithPagination(projectsEndpoint);
          finalProjects = allProjects.length > 0 ? allProjects : projectsData;
        } else {
          finalProjects = projectsData;
        }
        
        console.log(`🔄 Transformation de ${finalProjects.length} projets...`);
        
        const transformedProjects = finalProjects
          .filter(project => project != null) // Filtrer les projets null
          .map((project, index) => {
            // Log pour déboguer chaque projet
            if (index < 3) { // Log seulement les 3 premiers pour éviter le spam
              console.log(`📋 Projet ${index}:`, {
                id: project.id,
                title: project.title,
                author: project.author,
                status: project.status
              });
            }
            
            // Informations sur l'auteur
            let authorInfo = {};
            let authorName = '';
            let authorEmail = '';
            let authorUsername = '';
            
            // Extraction des informations d'auteur
            if (project.author) {
              if (typeof project.author === 'object') {
                authorInfo = {
                  id: project.author.id || index + 1,
                  username: project.author.username || `user${index + 1}`,
                  first_name: project.author.first_name || '',
                  last_name: project.author.last_name || '',
                  email: project.author.email || '',
                  is_staff: project.author.is_staff || false
                };
                authorName = project.author.first_name && project.author.last_name 
                  ? `${project.author.first_name} ${project.author.last_name}`
                  : project.author.username || '';
                authorEmail = project.author.email || '';
                authorUsername = project.author.username || '';
              } else if (typeof project.author === 'string') {
                authorName = project.author;
                authorUsername = project.author;
              }
            }
            
            // Fallback sur les champs directs
            if (!authorName && project.author_name) authorName = project.author_name;
            if (!authorEmail && project.author_email) authorEmail = project.author_email;
            if (!authorUsername && project.author_username) authorUsername = project.author_username;
            
            // Valeurs par défaut si toujours pas d'auteur
            if (!authorName && !authorEmail && !authorUsername) {
              authorInfo = {
                id: project.author_id || index + 1,
                username: `user${project.author_id || index + 1}`,
                first_name: 'Utilisateur',
                last_name: project.author_id ? `#${project.author_id}` : '',
                email: `user${project.author_id || index + 1}@simplon.local`,
                is_staff: false
              };
              authorName = authorInfo.username;
              authorEmail = authorInfo.email;
              authorUsername = authorInfo.username;
            }
            
            // Détermination du statut
            const status = project.status || 'draft';
            const isPublished = status === 'published' || project.is_published === true;
            const isDraft = status === 'draft' || project.is_draft === true;
            const isRejected = status === 'rejected' || project.is_rejected === true;
            const isApproved = status === 'approved' || project.is_approved === true;
            
            // Catégorie avec fallback
            let category = project.category || 'web';
            if (!categories.find(c => c.value === category)) category = 'web';
            
            // URL du fichier ZIP
            let zipFileUrl = '';
            if (project.zip_file) {
              if (typeof project.zip_file === 'string') {
                if (project.zip_file.startsWith('http')) {
                  zipFileUrl = project.zip_file;
                } else if (project.zip_file.startsWith('/media/')) {
                  zipFileUrl = `http://localhost:8000${project.zip_file}`;
                } else if (project.zip_file.includes('.zip')) {
                  zipFileUrl = `http://localhost:8000/media/${project.zip_file}`;
                }
              }
            }
            
            // Construction de l'objet projet final
            const transformed = {
              id: project.id || `api-${index}`,
              title: project.title || project.name || 'Sans titre',
              description: project.description || project.short_description || '',
              full_description: project.full_description || project.content || project.details || project.description || '',
              technologies: project.technologies || project.tech_stack || project.tags || '',
              category: category,
              status: status,
              cohort: project.cohort || project.user?.cohort || 'Promotion 2024',
              github_url: project.github_url || project.github_repo || project.repository_url || '',
              demo_url: project.demo_url || project.live_url || project.website || '',
              zip_file: zipFileUrl,
              image: project.image || project.screenshot || project.featured_image || project.thumbnail,
              created_at: project.created_at || project.date_created || new Date().toISOString(),
              updated_at: project.updated_at || project.date_updated || new Date().toISOString(),
              
              user: {
                id: authorInfo.id || project.author_id || index + 1,
                username: authorUsername || authorInfo.username,
                first_name: authorInfo.first_name || authorName.split(' ')[0] || '',
                last_name: authorInfo.last_name || authorName.split(' ').slice(1).join(' ') || '',
                email: authorEmail || authorInfo.email,
                is_staff: authorInfo.is_staff || false
              },
              
              author_name: authorName,
              author_email: authorEmail,
              author_username: authorUsername,
              
              is_published: isPublished,
              is_draft: isDraft,
              is_rejected: isRejected,
              is_approved: isApproved,
              is_pending: status === 'pending' || status === 'review' || project.is_pending === true
            };
            
            return transformed;
          })
          .filter(project => project != null); // Double vérification
        
        console.log(`✅ ${transformedProjects.length} projets transformés avec succès`);
        return transformedProjects;
      } else {
        console.log('⚠️ Aucun projet trouvé dans l\'API, activation du mode démo');
        setIsDemoMode(true);
        return getDemoProjects();
      }
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des projets:', error);
      setIsDemoMode(true);
      return getDemoProjects();
    }
  };

  // ✅ FONCTION PRINCIPALE DE CHARGEMENT
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      
      console.log('🔄 Début du chargement des projets...');
      
      const projectsData = await loadRealProjects();
      
      console.log(`📊 ${projectsData.length} projets chargés`);
      
      setProjects(projectsData);
      
      // Calcul des statistiques
      const statsData = {
        total: projectsData.length,
        published: projectsData.filter(p => 
          p.status === 'published' || 
          p.is_published === true ||
          p.status === 'approved' ||
          p.is_approved === true
        ).length,
        pending: projectsData.filter(p => 
          p.status === 'pending' || 
          p.is_pending === true
        ).length,
        draft: projectsData.filter(p => 
          p.status === 'draft' || 
          p.is_draft === true
        ).length,
        rejected: projectsData.filter(p => 
          p.status === 'rejected' || 
          p.is_rejected === true
        ).length
      };
      setStats(statsData);
      
      // Message d'information
      if (isDemoMode) {
        setError(`⚠️ Mode démo - Données fictives (${dbCount > 0 ? dbCount + ' projets réels en base' : 'Base non accessible'})`);
      } else {
        setError(`✅ Mode production - ${projectsData.length} projets réels chargés depuis Django`);
      }

    } catch (error) {
      console.error('❌ Erreur dans fetchProjects:', error);
      const demoProjects = getDemoProjects();
      setProjects(demoProjects);
      setIsDemoMode(true);
      
      const statsData = {
        total: demoProjects.length,
        published: 4,
        pending: 2,
        draft: 3,
        rejected: 1
      };
      setStats(statsData);
      
      setError(`❌ ${error.message} - Mode démo activé`);
      
    } finally {
      setLoading(false);
      console.log('✅ Chargement terminé');
    }
  };

  // ✅ DONNÉES DE DÉMONSTRATION
  const getDemoProjects = () => {
    console.log('🎭 Chargement des projets de démonstration');
    return [
      {
        id: 1,
        title: "Portfolio React Modern",
        user: {
          id: 1,
          username: "lea.martin",
          first_name: "Léa",
          last_name: "Martin",
          email: "lea.martin@example.com",
          is_staff: false
        },
        cohort: "DWWM - Mars 2024",
        category: "web",
        status: "published",
        is_published: true,
        technologies: "React, TypeScript, Tailwind CSS",
        description: "Portfolio moderne développé avec React, TypeScript et Tailwind CSS",
        full_description: "Ce portfolio moderne a été développé en utilisant les dernières technologies front-end. Il présente mes compétences en développement web avec des animations fluides, un design responsive et une architecture modulaire.",
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        github_url: "https://github.com/example/portfolio-react",
        demo_url: "https://portfolio-react-demo.netlify.app",
        zip_file: "https://example.com/downloads/portfolio-react.zip",
        created_at: "2024-03-15T10:30:00Z",
        author_name: "Léa Martin",
        author_email: "lea.martin@example.com"
      },
      {
        id: 2,
        title: "Application E-commerce",
        user: {
          id: 2,
          username: "mohamed.ali",
          first_name: "Mohamed",
          last_name: "Ali",
          email: "mohamed.ali@example.com",
          is_staff: false
        },
        cohort: "CDA - Avril 2024",
        category: "web",
        status: "pending",
        is_pending: true,
        technologies: "React, Node.js, MongoDB, Express",
        description: "Une application e-commerce complète avec panier et paiement",
        full_description: "Application e-commerce complète avec système de panier, authentification utilisateur, intégration de paiement Stripe, et tableau de bord administrateur. Utilise une architecture MERN (MongoDB, Express, React, Node.js).",
        github_url: "https://github.com/example/ecommerce-app",
        demo_url: "https://ecommerce-demo.vercel.app",
        zip_file: "https://example.com/downloads/ecommerce-app.zip",
        created_at: "2024-04-20T14:15:00Z",
        author_name: "Mohamed Ali",
        author_email: "mohamed.ali@example.com"
      },
      {
        id: 3,
        title: "Jeu JavaScript",
        user: {
          id: 3,
          username: "sophie123",
          first_name: "Sophie",
          last_name: "",
          email: "sophie@example.com",
          is_staff: false
        },
        cohort: "DWWM - Février 2024",
        category: "game",
        status: "draft",
        is_draft: true,
        technologies: "JavaScript, HTML5, Canvas, CSS3",
        description: "Un jeu en JavaScript utilisant Canvas",
        full_description: "Jeu développé en JavaScript pur utilisant l'API Canvas. Le jeu implémente un système de collision, des animations fluides et une gestion des scores. Compatible avec tous les navigateurs modernes.",
        github_url: "https://github.com/example/javascript-game",
        demo_url: "https://js-game-demo.netlify.app",
        zip_file: "",
        created_at: "2024-02-10T09:45:00Z",
        author_name: "Sophie",
        author_email: "sophie@example.com"
      },
      {
        id: 4,
        title: "Application Météo React Native",
        user: {
          id: 4,
          username: "thomas.bernard",
          first_name: "Thomas",
          last_name: "Bernard",
          email: "thomas@example.com",
          is_staff: false
        },
        cohort: "Mobile - Janvier 2024",
        category: "mobile",
        status: "rejected",
        is_rejected: true,
        technologies: "React Native, Expo, OpenWeatherMap API, Redux",
        description: "Application météo pour mobile avec React Native",
        full_description: "Application météo développée avec React Native pour iOS et Android. Utilise l'API OpenWeatherMap pour les données en temps réel et propose des prévisions sur 7 jours.",
        github_url: "https://github.com/example/weather-app",
        demo_url: "",
        zip_file: "https://example.com/downloads/weather-app.zip",
        created_at: "2024-01-05T11:20:00Z",
        author_name: "Thomas Bernard",
        author_email: "thomas@example.com"
      }
    ];
  };

  // ✅ NAVIGUER VERS LA PAGE DE DÉTAIL
  const handleViewDetails = (project) => {
    const projectWithFullData = {
      ...project,
      full_description: project.full_description || project.description || 'Aucune description détaillée disponible',
      author_id: project.user?.id || project.author_id || null,
      is_approved: project.is_approved || project.status === 'approved',
      is_pending: project.is_pending || project.status === 'pending',
      is_rejected: project.is_rejected || project.status === 'rejected',
      is_draft: project.is_draft || project.status === 'draft'
    };
    
    navigate(`/project/${project.id}`, { 
      state: { project: projectWithFullData } 
    });
  };

  // ✅ TÉLÉCHARGER LES DONNÉES D'UN PROJET
  const downloadProjectData = async (project) => {
    if (!project) return;
    
    setDownloading(prev => ({ ...prev, [project.id]: true }));
    
    try {
      let dataToExport;
      
      if (isDemoMode) {
        dataToExport = project;
      } else {
        try {
          const endpoint = activeEndpoint.endsWith('/') ? activeEndpoint : `${activeEndpoint}/`;
          const response = await fetch(`${endpoint}${project.id}/`);
          if (response.ok) {
            dataToExport = await response.json();
          } else {
            dataToExport = project;
          }
        } catch (error) {
          dataToExport = project;
        }
      }
      
      const projectDataStr = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([projectDataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `projet-${project.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      setError('Erreur lors du téléchargement des données');
    } finally {
      setTimeout(() => {
        setDownloading(prev => ({ ...prev, [project.id]: false }));
      }, 500);
    }
  };

  // ✅ TÉLÉCHARGER LE FICHIER ZIP
  const handleDownloadZip = (project) => {
    if (!project.zip_file) {
      alert('Aucun fichier ZIP disponible pour ce projet');
      return;
    }
    
    const link = document.createElement('a');
    link.href = project.zip_file;
    link.download = `${project.title.replace(/\s+/g, '-').toLowerCase()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✅ TÉLÉCHARGER TOUS LES PROJETS (CSV)
  const downloadAllProjectsCSV = () => {
    try {
      const headers = ['ID', 'Titre', 'Auteur', 'Email', 'Cohorte', 'Catégorie', 'Statut', 'Technologies', 'GitHub', 'Démo', 'Date de création'];
      
      const csvRows = [
        headers.join(','),
        ...filteredProjects.map(project => {
          const row = [
            project.id,
            `"${project.title.replace(/"/g, '""')}"`,
            `"${getAuthorName(project).replace(/"/g, '""')}"`,
            `"${project.user?.email || project.author_email || ''}"`,
            `"${project.cohort || ''}"`,
            `"${project.category || ''}"`,
            `"${project.status || ''}"`,
            `"${getTechnologies(project).join(', ').replace(/"/g, '""')}"`,
            `"${project.github_url || ''}"`,
            `"${project.demo_url || ''}"`,
            `"${formatDate(project.created_at)}"`
          ];
          return row.join(',');
        })
      ];
      
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `tous-les-projets-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Erreur lors de l\'export CSV:', error);
      setError('Erreur lors de l\'export des données');
    }
  };

  const getProjectImage = (project) => {
    if (!project) return null;
    
    const imageFields = ['image', 'screenshot', 'thumbnail', 'cover_image', 'featured_image', 'project_image'];
    
    for (const field of imageFields) {
      if (project[field]) {
        const imageValue = project[field];
        
        if (typeof imageValue === 'string') {
          if (imageValue.startsWith('http')) return imageValue;
          if (imageValue.startsWith('/media/') || imageValue.startsWith('/static/')) {
            return `http://localhost:8000${imageValue}`;
          }
          if (imageValue.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
            return `http://localhost:8000/media/${imageValue}`;
          }
        }
      }
    }
    
    const defaultImages = {
      web: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      mobile: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ai: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      data: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      iot: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      game: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      other: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    };
    
    const category = project.category || project.project_category || 'other';
    return defaultImages[category] || defaultImages.other;
  };

  const getAuthorName = (project) => {
    if (!project) return 'Auteur inconnu';
    
    if (project.author_name) return project.author_name;
    
    if (project.user) {
      if (project.user.first_name && project.user.last_name) {
        return `${project.user.first_name} ${project.user.last_name}`;
      }
      if (project.user.first_name) return project.user.first_name;
      if (project.user.last_name) return project.user.last_name;
      if (project.user.username) return project.user.username;
      if (project.user.email) return project.user.email.split('@')[0];
    }
    
    if (project.author_username) return project.author_username;
    if (project.author_email) return project.author_email.split('@')[0];
    
    return 'Auteur inconnu';
  };

  const getCohortName = (project) => {
    if (!project) return null;
    return project.cohort || project.user?.cohort || null;
  };

  const getTechnologies = (project) => {
    if (!project) return [];
    
    if (project.technologies) {
      if (Array.isArray(project.technologies)) return project.technologies;
      if (typeof project.technologies === 'string') {
        return project.technologies.split(',').map(t => t.trim()).filter(t => t.length > 0);
      }
    }
    
    return [];
  };

  const formatDate = (dateString) => {
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

  const getProjectLinks = (project) => {
    const links = {
      github: null,
      demo: null
    };
    
    if (!project) return links;
    
    const githubFields = ['github_url', 'github_repo', 'repository_url', 'github', 'repo_url'];
    for (const field of githubFields) {
      if (project[field]) {
        let url = project[field];
        if (url && !url.startsWith('http')) url = `https://${url}`;
        links.github = url;
        break;
      }
    }
    
    const demoFields = ['demo_url', 'live_url', 'website', 'demo', 'url'];
    for (const field of demoFields) {
      if (project[field]) {
        let url = project[field];
        if (url && !url.startsWith('http')) url = `https://${url}`;
        links.demo = url;
        break;
      }
    }
    
    return links;
  };

  const filterAndSortProjects = () => {
    console.log('🎯 Filtrage en cours...');
    console.log('📋 Total des projets:', projects.length);
    console.log('🔍 Terme de recherche:', searchTerm);
    console.log('🗂️ Catégorie filtrée:', categoryFilter);
    console.log('📊 Statut filtré:', statusFilter);
    
    let filtered = [...projects];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(project => {
        const titleMatch = project.title?.toLowerCase().includes(searchLower) || false;
        const descMatch = project.description?.toLowerCase().includes(searchLower) || false;
        const authorMatch = getAuthorName(project).toLowerCase().includes(searchLower);
        const techMatch = getTechnologies(project).some(tech => 
          tech.toLowerCase().includes(searchLower)
        );
        const cohortMatch = getCohortName(project)?.toLowerCase().includes(searchLower) || false;
        
        return titleMatch || descMatch || authorMatch || techMatch || cohortMatch;
      });
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(project => {
        const projectCategory = (project.category || 'other').toLowerCase();
        return projectCategory === categoryFilter;
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => {
        const status = project.status?.toLowerCase() || 'draft';
        return status === statusFilter;
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'az':
          return (a.title || '').localeCompare(b.title || '');
        case 'za':
          return (b.title || '').localeCompare(a.title || '');
        default:
          return 0;
      }
    });

    console.log(`✅ ${filtered.length} projets après filtrage`);
    setFilteredProjects(filtered);
  };

  const getStatusBadge = (project) => {
    const status = project.status?.toLowerCase() || 'draft';
    const isPublished = project.is_published || status === 'published' || status === 'approved';
    const isDraft = project.is_draft || status === 'draft';
    const isRejected = project.is_rejected || status === 'rejected';
    const isPending = project.is_pending || status === 'pending';
    
    let label = 'Inconnu';
    let color = 'bg-gray-100 text-gray-800';
    let icon = 'help';
    
    if (isPublished) {
      label = '✅ Publié';
      color = 'bg-green-100 text-green-800';
      icon = 'check_circle';
    } else if (isDraft) {
      label = '📝 Brouillon';
      color = 'bg-gray-100 text-gray-800';
      icon = 'draft';
    } else if (isRejected) {
      label = '❌ Rejeté';
      color = 'bg-red-100 text-red-800';
      icon = 'cancel';
    } else if (isPending) {
      label = '⏳ En attente';
      color = 'bg-yellow-100 text-yellow-800';
      icon = 'pending';
    } else if (status === 'approved') {
      label = '✅ Approuvé';
      color = 'bg-blue-100 text-blue-800';
      icon = 'verified';
    }
    
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 ${color}`}>
        <span className="material-symbols-outlined text-xs">{icon}</span>
        {label}
      </span>
    );
  };

  const getCategoryIcon = (category) => {
    const icons = {
      web: 'language',
      mobile: 'smartphone',
      ai: 'smart_toy',
      data: 'bar_chart',
      iot: 'settings_input_antenna',
      game: 'sports_esports',
      other: 'category'
    };
    return icons[category] || 'folder';
  };

  const handleManualSearch = async () => {
    setLoading(true);
    try {
      const { projectsEndpoint, projectsData } = await discoverDjangoEndpoints();
      
      if (projectsEndpoint && projectsData.length > 0) {
        setProjects(projectsData);
        setIsDemoMode(false);
        setActiveEndpoint(projectsEndpoint);
        setError(`✅ ${projectsData.length} projets trouvés sur ${projectsEndpoint}`);
      } else {
        setError('❌ Aucun endpoint de projets trouvé. Mode démo activé.');
        setProjects(getDemoProjects());
        setIsDemoMode(true);
      }
    } catch (error) {
      setError(`❌ Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    console.log('🔄 Actualisation des projets...');
    fetchProjects();
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/quicklogin');
  };

  useEffect(() => {
    console.log('🚀 Initialisation de la page ExploreProjects');
    fetchProjects();
  }, []);

  useEffect(() => {
    filterAndSortProjects();
  }, [projects, searchTerm, categoryFilter, statusFilter, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E30613] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg font-medium">Chargement des projets...</p>
          <p className="text-sm text-gray-500 mt-2">
            {isDemoMode ? 'Mode démo' : 'Connexion à l\'API Django'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="flex">
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
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-white"
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
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary bg-[#003265]"
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

        {/* Contenu principal */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            
            {/* En-tête avec informations */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold text-[#001F3F] mb-3">
                    Explorer les Projets
                  </h1>
                  <div className="space-y-2">
                    <p className="text-gray-700 text-sm lg:text-base">
                      {user ? `👤 Connecté en tant que: ${user.first_name || user.username || user.email}` : '🔒 Non connecté'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${isDemoMode ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {isDemoMode ? '⚠️ Mode démo' : '✅ Mode production'}
                      </span>
                      <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        📊 {stats.total} projet{stats.total !== 1 ? 's' : ''}
                      </span>
                      {dbCount > 0 && (
                        <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          🗄️ {dbCount} en base
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                {/* <div className="flex flex-col gap-3 min-w-[280px] max-w-full">
                  <button
                    onClick={handleManualSearch}
                    className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 font-medium text-sm lg:text-base"
                  >
                    <span className="material-symbols-outlined text-lg">search</span>
                    Rechercher les projets
                  </button>
                  
                  <button
                    onClick={handleRefresh}
                    className="px-4 py-3 bg-[#001F3F] text-white rounded-xl hover:bg-[#003265] transition-all flex items-center justify-center gap-2 font-medium text-sm lg:text-base"
                  >
                    <span className="material-symbols-outlined text-lg">refresh</span>
                    Actualiser
                  </button>
                  
                  {filteredProjects.length > 0 && (
                    <button
                      onClick={downloadAllProjectsCSV}
                      className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 font-medium text-sm lg:text-base"
                    >
                      <span className="material-symbols-outlined text-lg">download</span>
                      Exporter tous ({filteredProjects.length})
                    </button>
                  )}
                </div> */}
              </div>
              
              {/* Messages d'information/erreur */}
              {/* {error && (
                <div className="mt-6">
                  <div className={`p-4 rounded-xl ${
                    error.includes('✅') ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300' : 
                    error.includes('⚠️') ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-300' : 
                    'bg-gradient-to-r from-red-50 to-pink-50 border border-red-300'
                  }`}> */}
                    {/* <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-xl mt-0.5">
                        {error.includes('✅') ? 'check_circle' : 
                         error.includes('⚠️') ? 'warning' : 'error'}
                      </span>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          error.includes('✅') ? 'text-green-800' : 
                          error.includes('⚠️') ? 'text-yellow-800' : 'text-red-800'
                        }`}> */}
                          {/* {error}
                        </p>
                        {endpointsFound.length > 0 && (
                          <details className="mt-2 text-xs">
                            <summary className="cursor-pointer text-gray-600">Voir les détails de connexion</summary>
                            <div className="mt-2 space-y-1">
                              {endpointsFound.map((ep, idx) => (
                                <div key={idx} className={`text-xs ${ep.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                  {ep.url}: {ep.status === 'success' ? `✅ ${ep.count} projets` : `❌ ${ep.error}`}
                                </div>
                              ))}
                            </div>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                </div> */}
              {/* )} */}
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 shadow border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total</p>
                    <p className="text-2xl font-bold text-[#001F3F]">{stats.total}</p>
                  </div>
                  <span className="material-symbols-outlined text-[#E30613] text-3xl opacity-80">
                    layers
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-green-50 rounded-xl p-4 shadow border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Publiés</p>
                    <p className="text-2xl font-bold text-green-600">{stats.published}</p>
                  </div>
                  <span className="material-symbols-outlined text-green-500 text-3xl opacity-80">
                    check_circle
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-yellow-50 rounded-xl p-4 shadow border border-yellow-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">En attente</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                  <span className="material-symbols-outlined text-yellow-500 text-3xl opacity-80">
                    schedule
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 shadow border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Brouillons</p>
                    <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
                  </div>
                  <span className="material-symbols-outlined text-gray-500 text-3xl opacity-80">
                    draft
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-red-50 rounded-xl p-4 shadow border border-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Rejetés</p>
                    <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                  </div>
                  <span className="material-symbols-outlined text-red-500 text-3xl opacity-80">
                    block
                  </span>
                </div>
              </div>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow p-5 mb-8 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
                {/* Recherche */}
                <div className="lg:col-span-4">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                      search
                    </span>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Rechercher un projet, auteur, technologie..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] bg-white text-gray-800"
                    />
                  </div>
                </div>

                {/* Catégorie */}
                <div className="lg:col-span-2">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] bg-white text-gray-800"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Statut */}
                <div className="lg:col-span-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] bg-white text-gray-800"
                  >
                    {statuses.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>

                {/* Tri */}
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-2 h-full">
                    <span className="text-gray-600 text-sm whitespace-nowrap">Trier:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] bg-white text-gray-800"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Export */}
                {/* <div className="lg:col-span-2">
                  <button
                    onClick={downloadAllProjectsCSV}
                    disabled={filteredProjects.length === 0}
                    className={`w-full px-3 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                      filteredProjects.length === 0 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-[#001F3F] to-[#003265] text-white hover:opacity-90'
                    }`}
                  >
                    <span className="material-symbols-outlined">download</span>
                    <span className="hidden sm:inline">Exporter</span>
                  </button>
                </div> */}
              </div>
              
              {/* Résumé filtres */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium">
                      {filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''}
                      {searchTerm && ` pour "${searchTerm}"`}
                    </span>
                    {(categoryFilter !== 'all' || statusFilter !== 'all') && (
                      <div className="flex flex-wrap gap-2">
                        {categoryFilter !== 'all' && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {categories.find(c => c.value === categoryFilter)?.label}
                          </span>
                        )}
                        {statusFilter !== 'all' && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                            {statuses.find(s => s.value === statusFilter)?.label}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  {/* <div className="text-sm text-gray-500">
                    Base de données: {dbCount} projets
                  </div> */}
                </div>
              </div>
            </div>

            {/* Grille de projets */}
            <div className="mb-8">
              {filteredProjects.length === 0 ? (
                <div className="text-center py-12 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-inner border border-dashed border-gray-300">
                  <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">
                    search_off
                  </span>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    Aucun projet trouvé
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
                    Aucun projet ne correspond à vos critères de recherche.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setCategoryFilter('all');
                      setStatusFilter('all');
                    }}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-4 text-sm text-gray-600">
                    Affichage de {filteredProjects.length} projets sur {projects.length} disponibles
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredProjects.map(project => {
                      const projectImage = getProjectImage(project);
                      const authorName = getAuthorName(project);
                      const cohortName = getCohortName(project);
                      const technologies = getTechnologies(project);
                      const formattedDate = formatDate(project.created_at);
                      const projectLinks = getProjectLinks(project);
                      
                      return (
                        <div 
                          key={project.id} 
                          className="group flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:border-[#E30613] hover:shadow-lg"
                        >
                          {/* Image du projet */}
                          <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                            {projectImage ? (
                              <img 
                                src={projectImage} 
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.classList.add('bg-gradient-to-br', 'from-blue-50', 'to-indigo-100');
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                                <span className="material-symbols-outlined text-gray-400 text-5xl">
                                  {getCategoryIcon(project.category)}
                                </span>
                              </div>
                            )}
                            
                            {/* Badge de statut */}
                            <div className="absolute top-2 right-2">
                              {getStatusBadge(project)}
                            </div>
                          </div>
                          
                          {/* Contenu */}
                          <div className="flex-1 p-4">
                            <div className="mb-3">
                              <h3 className="text-base font-bold text-[#001F3F] mb-1 line-clamp-1">
                                {project.title}
                              </h3>
                              
                              {project.description && (
                                <p className="text-gray-600 text-xs line-clamp-2 mb-2">
                                  {project.description}
                                </p>
                              )}
                            </div>
                            
                            {/* Infos auteur et date */}
                            <div className="space-y-2 mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                  {authorName.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-800 text-sm truncate">{authorName}</p>
                                  <p className="text-xs text-gray-500">{formattedDate}</p>
                                </div>
                              </div>
                              
                              {cohortName && (
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                  <span className="material-symbols-outlined text-sm">school</span>
                                  <span className="truncate">{cohortName}</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Technologies */}
                            {technologies.length > 0 && (
                              <div className="mb-3">
                                <div className="flex flex-wrap gap-1">
                                  {technologies.slice(0, 2).map((tech, index) => (
                                    <span 
                                      key={index}
                                      className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200"
                                    >
                                      {tech.length > 15 ? tech.substring(0, 15) + '...' : tech}
                                    </span>
                                  ))}
                                  {technologies.length > 2 && (
                                    <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded">
                                      +{technologies.length - 2}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Actions */}
                          <div className="px-4 pb-4 pt-0">
                            <div className="flex items-center justify-between gap-2">
                              {/* Bouton Détail */}
                              <button
                                onClick={() => handleViewDetails(project)}
                                className="px-3 py-1.5 bg-[#001F3F] text-white rounded text-xs font-medium flex items-center gap-1 hover:bg-[#003265] transition-colors"
                                title="Voir les détails"
                              >
                                <span className="material-symbols-outlined text-xs">visibility</span>
                                Détail
                              </button>
                              
                              {/* Actions */}
                              <div className="flex items-center gap-1">
                                {/* Bouton Télécharger ZIP */}
                                {project.zip_file && (
                                  <button
                                    onClick={() => handleDownloadZip(project)}
                                    className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    title="Télécharger le fichier ZIP"
                                  >
                                    <span className="material-symbols-outlined text-sm">download</span>
                                  </button>
                                )}
                                
                                {(projectLinks.github || projectLinks.demo) && (
                                  <>
                                    {projectLinks.github && (
                                      <a
                                        href={projectLinks.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 bg-gray-900 text-white rounded hover:bg-black transition-colors"
                                        title="GitHub"
                                      >
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                                        </svg>
                                      </a>
                                    )}
                                    {projectLinks.demo && (
                                      <a
                                        href={projectLinks.demo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded hover:opacity-90"
                                        title="Démo"
                                      >
                                        <span className="material-symbols-outlined text-xs">open_in_new</span>
                                      </a>
                                    )}
                                  </>
                                )}
                                
                                <button
                                  onClick={() => downloadProjectData(project)}
                                  disabled={downloading[project.id]}
                                  className="p-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:opacity-50"
                                  title="Télécharger les données JSON"
                                >
                                  <span className="material-symbols-outlined text-sm">
                                    {downloading[project.id] ? 'downloading' : 'download'}
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Pied de page */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-500">
                <p>Vous pouvez télécharger n'importe quel projet pour l'étudier localement.</p>
                <p className="mt-1">Les projets sont partagés par les apprenants de Simplon.</p>
                <div className="mt-3 text-xs text-gray-400">
                  <p>Endpoint actif: {activeEndpoint || 'Mode démo'}</p>
                  <p>Projets chargés: {projects.length} | Base de données: {dbCount}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExploreProjects;