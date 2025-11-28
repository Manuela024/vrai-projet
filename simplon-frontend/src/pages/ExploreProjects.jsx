
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { projectService } from '../services/projects';
// import { authService } from '../services/auth';

// const ExploreProjects = () => {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filters, setFilters] = useState({
//     technologies: [],
//     cohorts: []
//   });
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);
//   const [downloading, setDownloading] = useState({});
//   const [searchTimeout, setSearchTimeout] = useState(null);
  
//   // ✅ NOUVEAU : État pour la photo de profil
//   const [userProfilePicture, setUserProfilePicture] = useState(null);

//   // Options de filtres - Récupérées dynamiquement des projets
//   const [technologyOptions, setTechnologyOptions] = useState([]);
//   const [cohortOptions, setCohortOptions] = useState([]);

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

//   // Charger les projets depuis l'API
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         setLoading(true);
//         console.log('🔄 Chargement des projets depuis l\'API...');
        
//         const projectsData = await projectService.getAllProjects();
//         console.log('✅ Projets chargés:', projectsData);
        
//         setProjects(projectsData);
        
//         // Extraire les options de filtres dynamiquement des projets
//         extractFilterOptions(projectsData);
        
//         // Récupérer l'utilisateur connecté
//         const currentUser = authService.getCurrentUser();
//         setUser(currentUser);
        
//       } catch (error) {
//         console.error('❌ Erreur chargement projets:', error);
//         // En cas d'erreur, utiliser les données mockées enrichies
//         const mockProjects = [
//           {
//             id: 1,
//             title: "Portfolio React Modern",
//             author_name: "Léa Martin",
//             cohort: "DWWM - Mars 2024",
//             technologies: "React,TypeScript,Tailwind CSS,Vite,Node.js",
//             description: "Un portfolio moderne développé avec React, TypeScript et Tailwind CSS, optimisé avec Vite",
//             file: "portfolio-react.zip"
//           },
//           {
//             id: 2,
//             title: "API E-commerce Complète", 
//             author_name: "Karim Bennani",
//             cohort: "CDA - Janvier 2024",
//             technologies: "Node.js,Express,MongoDB,React,JWT,Stripe",
//             description: "API REST complète pour une plateforme e-commerce avec interface React et paiement Stripe",
//             file: "api-ecommerce.zip"
//           },
//           {
//             id: 3,
//             title: "Data Visualization Dashboard",
//             author_name: "Sofia Chen", 
//             cohort: "AI Engineer - Mai 2024",
//             technologies: "Python,Flask,D3.js,PostgreSQL,Chart.js",
//             description: "Application de visualisation de données avec Flask, D3.js et base de données PostgreSQL",
//             file: "data-visualization.zip"
//           },
//           {
//             id: 4,
//             title: "Application Mobile React Native",
//             author_name: "Thomas Leroy",
//             cohort: "DWWM - Mars 2024", 
//             technologies: "React Native,JavaScript,Firebase,Redux,Expo",
//             description: "Application mobile cross-platform développée avec React Native et Firebase",
//             file: "mobile-app.zip"
//           },
//           {
//             id: 5,
//             title: "Site E-commerce WordPress Avancé",
//             author_name: "Marie Dubois",
//             cohort: "CDA - Janvier 2024",
//             technologies: "WordPress,PHP,MySQL,JavaScript,WooCommerce,Elementor",
//             description: "Site e-commerce complet avec WordPress, WooCommerce et personnalisations PHP avancées",
//             file: "ecommerce-wp.zip"
//           },
//           {
//             id: 6,
//             title: "Dashboard Analytics Entreprise",
//             author_name: "Ahmed Khan",
//             cohort: "AI Engineer - Mai 2024",
//             technologies: "Python,Dash,Plotly,SQL,React,FastAPI",
//             description: "Tableau de bord analytique avec visualisations interactives en React et API FastAPI",
//             file: "analytics-dashboard.zip"
//           },
//           {
//             id: 7,
//             title: "Application Full Stack MERN",
//             author_name: "David Moreau",
//             cohort: "DWWM - Mars 2024",
//             technologies: "React,Node.js,Express,MongoDB,Mongoose,JWT",
//             description: "Application full stack complète avec la stack MERN (MongoDB, Express, React, Node.js)",
//             file: "fullstack-app.zip"
//           },
//           {
//             id: 8,
//             title: "Jeux Vidéo JavaScript",
//             author_name: "Emma Laurent",
//             cohort: "DWWM - Mars 2024",
//             technologies: "JavaScript,HTML5,CSS3,Canvas,WebGL",
//             description: "Collection de jeux vidéo développés en JavaScript pur avec Canvas et WebGL",
//             file: "javascript-games.zip"
//           },
//           {
//             id: 9,
//             title: "API Microservices",
//             author_name: "Marc Petit",
//             cohort: "CDA - Janvier 2024",
//             technologies: "Node.js,Docker,Kubernetes,Redis,PostgreSQL,GraphQL",
//             description: "Architecture microservices avec Docker, Kubernetes et API GraphQL",
//             file: "microservices-api.zip"
//           },
//           {
//             id: 10,
//             title: "Application Vue.js Progressive",
//             author_name: "Lucie Bernard",
//             cohort: "CDA - Janvier 2024",
//             technologies: "Vue.js,Vuex,Vue Router,Vite,Pinia,TypeScript",
//             description: "Application progressive Vue.js avec state management Pinia et routing avancé",
//             file: "vuejs-app.zip"
//           },
//           {
//             id: 11,
//             title: "Système de Recommendation IA",
//             author_name: "Pierre Nguyen",
//             cohort: "AI Engineer - Mai 2024",
//             technologies: "Python,TensorFlow,Scikit-learn,Pandas,Flask,React",
//             description: "Système de recommendation utilisant l'IA avec TensorFlow et interface React",
//             file: "ai-recommendation.zip"
//           },
//           {
//             id: 12,
//             title: "Plateforme de Cours en Ligne",
//             author_name: "Sarah Cohen",
//             cohort: "Promo Lyon 2023",
//             technologies: "React,Node.js,MongoDB,Stripe,WebRTC,Socket.io",
//             description: "Plateforme complète de cours en ligne avec vidéo conférence WebRTC et paiements Stripe",
//             file: "elearning-platform.zip"
//           },
//           {
//             id: 13,
//             title: "Application Angular Enterprise",
//             author_name: "Antoine Martin",
//             cohort: "Promo Paris 2024",
//             technologies: "Angular,TypeScript,RxJS,NgRx,SCSS,Jest",
//             description: "Application enterprise Angular avec state management NgRx et tests unitaires Jest",
//             file: "angular-enterprise.zip"
//           },
//           {
//             id: 14,
//             title: "Automation DevOps",
//             author_name: "Nadia Kadi",
//             cohort: "AI Engineer - Mai 2024",
//             technologies: "Python,Docker,Jenkins,AWS,Terraform,Ansible",
//             description: "Pipeline DevOps complet avec automation, conteneurisation et infrastructure as code",
//             file: "devops-automation.zip"
//           },
//           {
//             id: 15,
//             title: "Application Real-Time Chat",
//             author_name: "Julien Morel",
//             cohort: "Promo Lyon 2023",
//             technologies: "React,Node.js,Socket.io,MongoDB,Redis,JWT",
//             description: "Application de chat en temps réel avec WebSockets et stockage Redis",
//             file: "realtime-chat.zip"
//           }
//         ];
        
//         setProjects(mockProjects);
//         extractFilterOptions(mockProjects);
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

//   // Extraire les options de filtres des projets
//   const extractFilterOptions = (projectsData) => {
//     const allTechnologies = new Set();
//     const allCohorts = new Set();

//     projectsData.forEach(project => {
//       // Extraire les technologies
//       if (project.technologies) {
//         project.technologies.split(',').forEach(tech => {
//           if (tech.trim()) {
//             allTechnologies.add(tech.trim());
//           }
//         });
//       }
      
//       // Extraire les cohortes
//       if (project.cohort) {
//         allCohorts.add(project.cohort);
//       }
//     });

//     setTechnologyOptions(Array.from(allTechnologies).sort());
//     setCohortOptions(Array.from(allCohorts).sort());
    
//     console.log('🎯 Options technologies:', Array.from(allTechnologies));
//     console.log('🎯 Options cohortes:', Array.from(allCohorts));
//   };

//   // Recherche avec debounce - CORRIGÉE POUR LES COHORTES
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

//   // Gestion des filtres
//   const handleFilterChange = (filterType, value, isChecked) => {
//     console.log(`🎯 Filtre ${filterType}: ${value} -> ${isChecked ? 'activé' : 'désactivé'}`);
    
//     setFilters(prev => {
//       const newFilters = { ...prev };
      
//       if (isChecked) {
//         // Ajouter le filtre
//         newFilters[filterType] = [...(prev[filterType] || []), value];
//       } else {
//         // Retirer le filtre
//         newFilters[filterType] = (prev[filterType] || []).filter(item => item !== value);
//       }
      
//       console.log(`🎯 Nouveaux filtres ${filterType}:`, newFilters[filterType]);
//       return newFilters;
//     });
//   };

//   const resetFilters = () => {
//     console.log('🔄 Réinitialisation de tous les filtres');
//     setFilters({
//       technologies: [],
//       cohorts: []
//     });
//     setSearchTerm('');
//   };

//   // Filtrage des projets - CORRIGÉ POUR LA RECHERCHE PAR COHORTES
//   const filteredProjects = projects.filter(project => {
//     if (!project) return false;

//     // Recherche texte - MAINTENANT INCLUT LES COHORTES
//     const searchLower = searchTerm.toLowerCase();
//     const matchesSearch = searchTerm === '' || 
//       (project.title && project.title.toLowerCase().includes(searchLower)) ||
//       (project.author_name && project.author_name.toLowerCase().includes(searchLower)) ||
//       (project.description && project.description.toLowerCase().includes(searchLower)) ||
//       (project.technologies && project.technologies.toLowerCase().includes(searchLower)) ||
//       (project.cohort && project.cohort.toLowerCase().includes(searchLower)); // ⭐ AJOUTÉ

//     // Filtre par technologies - ET LOGIQUE (AND)
//     const matchesTech = filters.technologies.length === 0 || 
//       (project.technologies && filters.technologies.every(tech => {
//         const projectTechs = project.technologies.split(',').map(t => t.trim().toLowerCase());
//         return projectTechs.includes(tech.toLowerCase());
//       }));

//     // Filtre par cohortes - ET LOGIQUE (AND)
//     const matchesCohort = filters.cohorts.length === 0 || 
//       (project.cohort && filters.cohorts.every(cohort => 
//         project.cohort.includes(cohort)
//       ));

//     const isVisible = matchesSearch && matchesTech && matchesCohort;
    
//     // Debug logging pour la recherche
//     if (searchTerm && project.cohort && project.cohort.toLowerCase().includes(searchLower)) {
//       console.log(`🔍 Projet "${project.title}" correspond à la recherche de cohorte:`, {
//         searchTerm,
//         cohort: project.cohort,
//         matchesSearch
//       });
//     }

//     return isVisible;
//   });

//   const handleLogout = () => {
//     authService.logout();
//     navigate('/login');
//   };

//   // Fonction pour créer un contenu de démonstration pour le ZIP
//   const createMockZipContent = (projectTitle, projectData) => {
//     // Créer une structure de fichiers factice pour le ZIP
//     const filesContent = `
// FICHIER ZIP DE DÉMONSTRATION - ${projectTitle.toUpperCase()}
// ===========================================================

// Ceci est une simulation de fichier ZIP contenant la structure du projet.

// STRUCTURE DU PROJET:
// -------------------
// 📁 ${projectTitle.replace(/\s+/g, '-').toLowerCase()}/
// ├── 📄 README.md
// ├── 📄 package.json
// ├── 📁 src/
// │   └── 📄 index.js
// ├── 📁 public/
// │   └── 📄 index.html
// └── 📄 PROJECT_INFO.json

// CONTENU DES FICHIERS:
// --------------------

// 📄 README.md:
// # ${projectTitle}

// ${projectData.description || 'Aucune description disponible.'}

// ## Technologies utilisées
// ${projectData.technologies ? projectData.technologies.split(',').map(tech => `- ${tech.trim()}`).join('\n') : 'Non spécifiées'}

// ## Auteur
// ${projectData.author_name || 'Inconnu'}

// ## Cohort
// ${projectData.cohort || 'Non spécifiée'}

// ## Installation
// \`\`\`bash
// npm install
// npm start
// \`\`\`

// 📄 package.json:
// {
//   "name": "${projectTitle.toLowerCase().replace(/\s+/g, '-')}",
//   "version": "1.0.0",
//   "description": "${projectData.description || ''}",
//   "main": "src/index.js",
//   "scripts": {
//     "start": "node src/index.js",
//     "dev": "nodemon src/index.js",
//     "build": "npm run build"
//   },
//   "keywords": ["${projectData.technologies ? projectData.technologies.split(',')[0].trim() : 'project'}"],
//   "author": "${projectData.author_name || 'Inconnu'}",
//   "license": "MIT",
//   "dependencies": {},
//   "devDependencies": {}
// }

// 📄 src/index.js:
// // ${projectTitle}
// // Projet généré le ${new Date().toLocaleString()}

// console.log('🚀 Bienvenue dans le projet ${projectTitle}');
// console.log('👨‍💻 Auteur: ${projectData.author_name || 'Inconnu'}');
// console.log('🎓 Cohort: ${projectData.cohort || 'Non spécifiée'}');
// console.log('🛠 Technologies: ${projectData.technologies || 'Non spécifiées'}');

// function main() {
//     console.log('✅ Application démarrée avec succès!');
//     console.log('📅 Date: ${new Date().toLocaleString()}');
// }

// main();

// 📄 PROJECT_INFO.json:
// {
//   "project_id": ${projectData.id},
//   "title": "${projectTitle}",
//   "author": "${projectData.author_name}",
//   "cohort": "${projectData.cohort}",
//   "technologies": ${projectData.technologies ? JSON.stringify(projectData.technologies.split(',').map(t => t.trim())) : '[]'},
//   "description": "${projectData.description || ''}",
//   "download_date": "${new Date().toISOString()}",
//   "generated_by": "Simplon Code Platform",
//   "note": "Ceci est une démonstration de téléchargement ZIP. En production, ce serait un vrai fichier ZIP avec le code source."
// }

// INFORMATIONS:
// ------------
// • Projet ID: ${projectData.id}
// • Téléchargé le: ${new Date().toLocaleString()}
// • Format: ZIP de démonstration
// • Statut: Simulation réussie

// REMARQUE:
// ---------
// Ce fichier représente une démonstration du système de téléchargement.
// Dans un environnement de production, vous recevriez un vrai fichier ZIP
// contenant le code source complet du projet.

// Pour toute question, contactez l'administrateur de la plateforme.
//     `.trim();

//     return filesContent;
//   };

//   // Fonction principale de téléchargement
//   const handleDownload = async (projectId, projectTitle, fileName) => {
//     try {
//       setDownloading(prev => ({ ...prev, [projectId]: true }));
//       console.log(`📥 Début du téléchargement du projet ${projectId}: ${projectTitle}`);
      
//       // Essayer d'abord le téléchargement réel via l'API
//       try {
//         const blob = await projectService.downloadProjectFile(projectId, fileName || projectTitle);
        
//         // Créer un URL pour le blob
//         const url = window.URL.createObjectURL(blob);
        
//         // Créer un élément anchor pour le téléchargement
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `${projectTitle.replace(/\s+/g, '-').toLowerCase()}.zip`;
//         document.body.appendChild(a);
//         a.click();
        
//         // Nettoyer
//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(a);
        
//       } catch (apiError) {
//         console.log('📦 API non disponible, création d\'un fichier de démonstration...');
//         // Si l'API échoue, créer un fichier de démonstration
//         const projectData = projects.find(p => p.id === projectId) || {};
//         const content = createMockZipContent(projectTitle, projectData);
        
//         // Créer un blob avec le contenu
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
        
//         {/* Sidebar */}
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
//                <Link 
//                 to="/profile" 
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10"
//               >
//                 <span className="material-symbols-outlined">person</span>
//                 <p className="text-sm font-medium leading-normal">Profil</p>
//               </Link>

//               <Link to="/parametre" className="flex items-center gap-3 rounded px-3 py-2 text-white/70 hover:bg-[#003265] hover:text-white">
//                             <span className="material-symbols-outlined">settings</span>
//                             <span>Paramètre</span>
//                           </Link>
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
//         <main className="flex-1 p-6 lg:p-10">
//           <div className="max-w-7xl mx-auto">
            
//             {/* Header avec profil utilisateur */}
//             <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
//               <div>
//                 <h1 className="text-[#001F3F] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
//                   Explorer les Projets
//                 </h1>
//                 <p className="text-gray-500 dark:text-gray-400 mt-1">
//                   Découvrez et téléchargez les projets partagés par la communauté Simplon
//                 </p>
                
//                 {/* Indicateur de recherche/filtres actifs */}
//                 {(searchTerm || filters.technologies.length > 0 || filters.cohorts.length > 0) && (
//                   <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
//                     <span className="text-blue-600 flex items-center gap-1">
//                       <span className="material-symbols-outlined text-base">filter_alt</span>
//                       Filtres actifs:
//                     </span>
//                     {searchTerm && (
//                       <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
//                         Recherche: "{searchTerm}"
//                       </span>
//                     )}
//                     {filters.technologies.length > 0 && (
//                       <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
//                         Technologies: {filters.technologies.join(' + ')}
//                       </span>
//                     )}
//                     {filters.cohorts.length > 0 && (
//                       <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
//                         Cohortes: {filters.cohorts.join(' + ')}
//                       </span>
//                     )}
//                   </div>
//                 )}
//               </div>
              
//               <div className="flex items-center gap-3">
//                 {/* ✅ PHOTO DE PROFIL CORRIGÉE - MÊME QUE DANS PROFILE.JSX */}
//                 <div 
//                   className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 border-2 border-primary cursor-pointer hover:border-primary/80 transition-colors"
//                   style={{ 
//                     backgroundImage: `url(${userProfilePicture || user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCOEWiUsTwO8WM7eKk9ihSrGB-yTnj6Oer1pTWTf_spAb7eV22RX0LZ1UPKdK02_ir9OQKkn8UyJmlDqQxkPJTiLDMtzFAooBHzRyfkt-Sd-kOGWZbn9ccGU4THtkk5AaCXc-z4SkYtd3sivd8r20LAIccUBtibXZ_A7paRHquHcmJf213-GbmYibvQg5l1uG5cGw7UfGO0xOi3aakHJGD9Q2TOoZkBSgguzhYUSkp0eFWQ5O-3rHqcGZBxV1iCxccixEJXXB1uloI"})` 
//                   }}
//                   onClick={() => navigate('/profile')}
//                   title="Voir mon profil"
//                 ></div>
//                 <div className="flex flex-col text-right">
//                   <h2 className="text-[#001F3F] dark:text-white text-base font-medium">
//                     {user?.username || 'Utilisateur'}
//                   </h2>
//                   <p className="text-gray-500 dark:text-gray-400 text-sm">
//                     {user?.cohort || 'Stagiaire'}
//                   </p>
//                 </div>
//               </div>
//             </header>

//             {/* Contenu principal avec recherche et filtres */}
//             <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
//               {/* Section projets - 3/4 de largeur */}
//               <div className="lg:col-span-3 flex flex-col gap-6">
                
//                 {/* Barre de recherche - PLACEHOLDER MIS À JOUR */}
//                 <div className="relative">
//                   <div className="flex items-center gap-3 mb-2">
//                     <label htmlFor="search-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                       Rechercher un projet
//                     </label>
//                     {searchTerm && (
//                       <button
//                         onClick={() => setSearchTerm('')}
//                         className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
//                       >
//                         <span className="material-symbols-outlined text-sm">close</span>
//                         Effacer
//                       </button>
//                     )}
//                   </div>
                  
//                   <div className="flex w-full flex-1 items-stretch rounded-lg h-12 bg-white dark:bg-[#001F3F]/50 border border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/50 transition-all">
//                     <div className="text-gray-500 flex items-center justify-center pl-4">
//                       <span className="material-symbols-outlined">search</span>
//                     </div>
//                     <input
//                       id="search-input"
//                       type="text"
//                       placeholder="Rechercher par titre, auteur, technologie, cohorte ou description..."
//                       value={searchTerm}
//                       onChange={handleSearchChange}
//                       className="flex w-full min-w-0 flex-1 resize-none overflow-hidden bg-transparent text-[#001F3F] dark:text-white h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 text-base font-normal leading-normal focus:outline-none"
//                     />
//                     {searchTerm && (
//                       <div className="flex items-center pr-3 text-gray-400">
//                         <span className="text-sm">{filteredProjects.length}</span>
//                       </div>
//                     )}
//                   </div>

//                   {/* Suggestions de recherche par cohorte */}
//                   {searchTerm && (
//                     <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
//                       <div className="p-3">
//                         <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Suggestions de recherche:
//                         </p>
//                         <div className="space-y-1">
//                           {/* Suggestions de cohortes */}
//                           {cohortOptions.filter(cohort => 
//                             cohort.toLowerCase().includes(searchTerm.toLowerCase())
//                           ).slice(0, 3).map(cohort => (
//                             <button
//                               key={cohort}
//                               onClick={() => setSearchTerm(cohort)}
//                               className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded flex items-center gap-2"
//                             >
//                               <span className="material-symbols-outlined text-base">school</span>
//                               <span>Cohorte: {cohort}</span>
//                             </button>
//                           ))}
                          
//                           {/* Suggestions de technologies */}
//                           {technologyOptions.filter(tech => 
//                             tech.toLowerCase().includes(searchTerm.toLowerCase())
//                           ).slice(0, 3).map(tech => (
//                             <button
//                               key={tech}
//                               onClick={() => setSearchTerm(tech)}
//                               className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded flex items-center gap-2"
//                             >
//                               <span className="material-symbols-outlined text-base">code</span>
//                               <span>Technologie: {tech}</span>
//                             </button>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Indicateur de chargement */}
//                 {loading && (
//                   <div className="flex justify-center items-center py-12">
//                     <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
//                     <span className="ml-3 text-gray-600">Chargement des projets...</span>
//                   </div>
//                 )}

//                 {/* Message si aucun projet */}
//                 {!loading && filteredProjects.length === 0 && (
//                   <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
//                     <div className="text-gray-400 mb-3">
//                       <span className="material-symbols-outlined text-6xl">search_off</span>
//                     </div>
//                     <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
//                       {searchTerm || filters.technologies.length > 0 || filters.cohorts.length > 0 
//                         ? "Aucun projet trouvé" 
//                         : "Aucun projet disponible"}
//                     </h3>
//                     <p className="text-gray-500 dark:text-gray-400 mb-4">
//                       {filters.technologies.length > 1 
//                         ? `Aucun projet ne contient toutes ces technologies: ${filters.technologies.join(', ')}`
//                         : searchTerm 
//                         ? `Aucun projet ne correspond à "${searchTerm}"`
//                         : filters.technologies.length > 0 || filters.cohorts.length > 0
//                         ? "Aucun projet ne correspond à vos filtres"
//                         : "Aucun projet n'a été partagé pour le moment."}
//                     </p>
                    
//                     {/* Suggestions de cohortes si recherche vide */}
//                     {searchTerm && cohortOptions.some(cohort => 
//                       cohort.toLowerCase().includes(searchTerm.toLowerCase())
//                     ) && (
//                       <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                         <p className="text-sm text-blue-700 dark:text-blue-300">
//                           💡 Essayez de rechercher une cohorte spécifique comme:
//                         </p>
//                         <div className="flex flex-wrap gap-2 mt-2">
//                           {cohortOptions.filter(cohort => 
//                             cohort.toLowerCase().includes(searchTerm.toLowerCase())
//                           ).map(cohort => (
//                             <button
//                               key={cohort}
//                               onClick={() => setSearchTerm(cohort)}
//                               className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
//                             >
//                               {cohort}
//                             </button>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     <div className="flex gap-3 justify-center">
//                       <button
//                         onClick={resetFilters}
//                         className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
//                       >
//                         {searchTerm || filters.technologies.length > 0 || filters.cohorts.length > 0
//                           ? "Réinitialiser tout"
//                           : "Actualiser"}
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {/* Grille des projets */}
//                 {!loading && filteredProjects.length > 0 && (
//                   <>
//                     {/* En-tête des résultats */}
//                     <div className="flex justify-between items-center">
//                       <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
//                         {filters.technologies.length > 1 
//                           ? `Projets avec ${filters.technologies.join(' + ')}`
//                           : searchTerm 
//                           ? `Résultats pour "${searchTerm}"` 
//                           : filters.technologies.length > 0 || filters.cohorts.length > 0
//                           ? "Projets filtrés"
//                           : "Tous les projets"}
//                         <span className="text-sm font-normal text-gray-500 ml-2">
//                           ({filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''})
//                         </span>
//                       </h3>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//                       {filteredProjects.map(project => (
//                         <div key={project.id} className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#001F3F]/30 overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]">
//                           <div className="p-5 flex flex-col gap-4 flex-1">
//                             <div className="flex flex-col gap-1">
//                               <h3 className="text-[#001F3F] dark:text-white text-lg font-bold line-clamp-2">
//                                 {project.title}
//                               </h3>
//                               <p className="text-gray-500 dark:text-gray-400 text-sm">
//                                 Par {project.author_name}
//                               </p>
//                               {project.cohort && (
//                                 <p className={`text-xs font-medium px-2 py-1 rounded-full inline-block mt-1 ${
//                                   searchTerm && project.cohort.toLowerCase().includes(searchTerm.toLowerCase())
//                                     ? 'bg-purple-500 text-white'
//                                     : 'text-gray-400 dark:text-gray-500'
//                                 }`}>
//                                   {project.cohort}
//                                 </p>
//                               )}
//                             </div>
                            
//                             {/* Description courte */}
//                             {project.description && (
//                               <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
//                                 {project.description}
//                               </p>
//                             )}
                            
//                             {/* Badges technologies */}
//                             {project.technologies && (
//                               <div className="flex flex-wrap gap-1">
//                                 {project.technologies.split(',').slice(0, 5).map((tech, index) => (
//                                   <span 
//                                     key={index}
//                                     className={`text-xs font-medium px-2 py-1 rounded-full ${
//                                       filters.technologies.includes(tech.trim())
//                                         ? 'bg-green-500 text-white'
//                                         : searchTerm && tech.trim().toLowerCase().includes(searchTerm.toLowerCase())
//                                         ? 'bg-blue-500 text-white'
//                                         : 'bg-primary/10 text-primary'
//                                     }`}
//                                   >
//                                     {tech.trim()}
//                                   </span>
//                                 ))}
//                                 {project.technologies.split(',').length > 5 && (
//                                   <span className="text-xs font-medium bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
//                                     +{project.technologies.split(',').length - 5}
//                                   </span>
//                                 )}
//                               </div>
//                             )}
//                           </div>
                          
//                           {/* Actions */}
//                           <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between gap-2">
//                             <button 
//                               onClick={() => navigate(`/project/${project.id}`)}
//                               className="flex-1 text-center text-sm font-semibold bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
//                             >
//                               <span className="material-symbols-outlined text-base">visibility</span>
//                               Voir détails
//                             </button>
//                             <button 
//                               onClick={() => handleDownload(project.id, project.title, project.file)}
//                               disabled={downloading[project.id]}
//                               className={`shrink-0 flex items-center justify-center h-9 w-9 rounded-lg border transition-colors ${
//                                 downloading[project.id]
//                                   ? 'bg-gray-300 border-gray-400 text-gray-600 cursor-not-allowed'
//                                   : 'bg-white dark:bg-[#001F3F]/50 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
//                               }`}
//                               title={`Télécharger ${project.title} en ZIP`}
//                             >
//                               {downloading[project.id] ? (
//                                 <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
//                               ) : (
//                                 <span className="material-symbols-outlined text-base">download</span>
//                               )}
//                             </button>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 )}
//               </div>

//               {/* Sidebar des filtres */}
//               <div className="lg:col-span-1 flex flex-col gap-6">
//                 <div className="flex flex-col gap-4 sticky top-28">
//                   <div className="flex justify-between items-center">
//                     <h3 className="text-[#001F3F] dark:text-white text-lg font-bold">Filtres</h3>
//                     {(filters.technologies.length > 0 || filters.cohorts.length > 0) && (
//                       <button 
//                         onClick={resetFilters}
//                         className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
//                       >
//                         <span className="material-symbols-outlined text-base">close</span>
//                         Tout effacer
//                       </button>
//                     )}
//                   </div>
                  
//                   <div className="flex flex-col">
                    
//                     {/* Filtre Technologies */}
//                     <details className="flex flex-col border-t border-gray-200 dark:border-gray-700 py-2 group" open>
//                       <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-2">
//                         <p className="text-[#001F3F] dark:text-white text-sm font-medium leading-normal">
//                           Technologies
//                           {filters.technologies.length > 0 && (
//                             <span className="ml-1 text-xs bg-green-500 text-white rounded-full px-1.5 py-0.5">
//                               {filters.technologies.length}
//                             </span>
//                           )}
//                         </p>
//                         <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 group-open:rotate-180 transition-transform">
//                           expand_more
//                         </span>
//                       </summary>
//                       <div className="flex flex-col gap-2 pt-2 max-h-64 overflow-y-auto">
//                         {technologyOptions.length > 0 ? (
//                           technologyOptions.map(tech => (
//                             <label key={tech} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 px-2 py-1 rounded cursor-pointer">
//                               <input
//                                 type="checkbox"
//                                 checked={filters.technologies.includes(tech)}
//                                 onChange={(e) => handleFilterChange('technologies', tech, e.target.checked)}
//                                 className="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary/50 bg-white dark:bg-[#001F3F]/50 cursor-pointer"
//                               />
//                               <span className="flex-1">{tech}</span>
//                               <span className="text-xs text-gray-400">
//                                 ({projects.filter(p => p.technologies && p.technologies.includes(tech)).length})
//                               </span>
//                             </label>
//                           ))
//                         ) : (
//                           <p className="text-xs text-gray-500 text-center py-2">Chargement...</p>
//                         )}
//                       </div>
//                       {filters.technologies.length > 0 && (
//                         <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs text-green-700 dark:text-green-300">
//                           <span className="font-medium">Filtre ET activé:</span> Les projets doivent contenir <strong>toutes</strong> les technologies sélectionnées
//                         </div>
//                       )}
//                     </details>

//                     {/* Filtre Cohortes */}
//                     <details className="flex flex-col border-t border-gray-200 dark:border-gray-700 py-2 group">
//                       <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-2">
//                         <p className="text-[#001F3F] dark:text-white text-sm font-medium leading-normal">
//                           Cohortes
//                           {filters.cohorts.length > 0 && (
//                             <span className="ml-1 text-xs bg-purple-500 text-white rounded-full px-1.5 py-0.5">
//                               {filters.cohorts.length}
//                             </span>
//                           )}
//                         </p>
//                         <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 group-open:rotate-180 transition-transform">
//                           expand_more
//                         </span>
//                       </summary>
//                       <div className="flex flex-col gap-2 pt-2 max-h-48 overflow-y-auto">
//                         {cohortOptions.length > 0 ? (
//                           cohortOptions.map(cohort => (
//                             <label key={cohort} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 px-2 py-1 rounded cursor-pointer">
//                               <input
//                                 type="checkbox"
//                                 checked={filters.cohorts.includes(cohort)}
//                                 onChange={(e) => handleFilterChange('cohorts', cohort, e.target.checked)}
//                                 className="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary/50 bg-white dark:bg-[#001F3F]/50 cursor-pointer"
//                               />
//                               <span className="flex-1">{cohort}</span>
//                               <span className="text-xs text-gray-400">
//                                 ({projects.filter(p => p.cohort === cohort).length})
//                               </span>
//                             </label>
//                           ))
//                         ) : (
//                           <p className="text-xs text-gray-500 text-center py-2">Chargement...</p>
//                         )}
//                       </div>
//                     </details>

//                   </div>

//                   {/* Statistiques */}
//                   <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
//                     <p className="text-sm text-blue-800 dark:text-blue-200">
//                       <strong>{filteredProjects.length}</strong> projet(s) sur <strong>{projects.length}</strong>
//                     </p>
//                     {filters.technologies.length > 0 && (
//                       <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
//                         {filters.technologies.length} technologie(s) sélectionnée(s)
//                       </p>
//                     )}
//                     {searchTerm && (
//                       <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
//                         Recherche: "{searchTerm}"
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default ExploreProjects;


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectService } from '../services/projects';
import { authService } from '../services/auth';

const ExploreProjects = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [downloading, setDownloading] = useState({});
  const [searchTimeout, setSearchTimeout] = useState(null);
  
  // ✅ État pour la photo de profil
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

  // Charger les projets depuis l'API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        console.log('🔄 Chargement des projets depuis l\'API...');
        
        const projectsData = await projectService.getAllProjects();
        console.log('✅ Projets chargés:', projectsData);
        
        setProjects(projectsData);
        
        // Récupérer l'utilisateur connecté
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        
      } catch (error) {
        console.error('❌ Erreur chargement projets:', error);
        // En cas d'erreur, utiliser les données mockées enrichies
        const mockProjects = [
          {
            id: 1,
            title: "Portfolio React Modern",
            author_name: "Léa Martin",
            cohort: "DWWM - Mars 2024",
            technologies: "React,TypeScript,Tailwind CSS,Vite,Node.js",
            description: "Un portfolio moderne développé avec React, TypeScript et Tailwind CSS, optimisé avec Vite",
            file: "portfolio-react.zip"
          },
          {
            id: 2,
            title: "API E-commerce Complète", 
            author_name: "Karim Bennani",
            cohort: "CDA - Janvier 2024",
            technologies: "Node.js,Express,MongoDB,React,JWT,Stripe",
            description: "API REST complète pour une plateforme e-commerce avec interface React et paiement Stripe",
            file: "api-ecommerce.zip"
          },
          {
            id: 3,
            title: "Data Visualization Dashboard",
            author_name: "Sofia Chen", 
            cohort: "AI Engineer - Mai 2024",
            technologies: "Python,Flask,D3.js,PostgreSQL,Chart.js",
            description: "Application de visualisation de données avec Flask, D3.js et base de données PostgreSQL",
            file: "data-visualization.zip"
          },
          {
            id: 4,
            title: "Application Mobile React Native",
            author_name: "Thomas Leroy",
            cohort: "DWWM - Mars 2024", 
            technologies: "React Native,JavaScript,Firebase,Redux,Expo",
            description: "Application mobile cross-platform développée avec React Native et Firebase",
            file: "mobile-app.zip"
          },
          {
            id: 5,
            title: "Site E-commerce WordPress Avancé",
            author_name: "Marie Dubois",
            cohort: "CDA - Janvier 2024",
            technologies: "WordPress,PHP,MySQL,JavaScript,WooCommerce,Elementor",
            description: "Site e-commerce complet avec WordPress, WooCommerce et personnalisations PHP avancées",
            file: "ecommerce-wp.zip"
          },
          {
            id: 6,
            title: "Dashboard Analytics Entreprise",
            author_name: "Ahmed Khan",
            cohort: "AI Engineer - Mai 2024",
            technologies: "Python,Dash,Plotly,SQL,React,FastAPI",
            description: "Tableau de bord analytique avec visualisations interactives en React et API FastAPI",
            file: "analytics-dashboard.zip"
          },
          {
            id: 7,
            title: "Application Full Stack MERN",
            author_name: "David Moreau",
            cohort: "DWWM - Mars 2024",
            technologies: "React,Node.js,Express,MongoDB,Mongoose,JWT",
            description: "Application full stack complète avec la stack MERN (MongoDB, Express, React, Node.js)",
            file: "fullstack-app.zip"
          },
          {
            id: 8,
            title: "Jeux Vidéo JavaScript",
            author_name: "Emma Laurent",
            cohort: "DWWM - Mars 2024",
            technologies: "JavaScript,HTML5,CSS3,Canvas,WebGL",
            description: "Collection de jeux vidéo développés en JavaScript pur avec Canvas et WebGL",
            file: "javascript-games.zip"
          },
          {
            id: 9,
            title: "API Microservices",
            author_name: "Marc Petit",
            cohort: "CDA - Janvier 2024",
            technologies: "Node.js,Docker,Kubernetes,Redis,PostgreSQL,GraphQL",
            description: "Architecture microservices avec Docker, Kubernetes et API GraphQL",
            file: "microservices-api.zip"
          },
          {
            id: 10,
            title: "Application Vue.js Progressive",
            author_name: "Lucie Bernard",
            cohort: "CDA - Janvier 2024",
            technologies: "Vue.js,Vuex,Vue Router,Vite,Pinia,TypeScript",
            description: "Application progressive Vue.js avec state management Pinia et routing avancé",
            file: "vuejs-app.zip"
          },
          {
            id: 11,
            title: "Système de Recommendation IA",
            author_name: "Pierre Nguyen",
            cohort: "AI Engineer - Mai 2024",
            technologies: "Python,TensorFlow,Scikit-learn,Pandas,Flask,React",
            description: "Système de recommendation utilisant l'IA avec TensorFlow et interface React",
            file: "ai-recommendation.zip"
          },
          {
            id: 12,
            title: "Plateforme de Cours en Ligne",
            author_name: "Sarah Cohen",
            cohort: "Promo Lyon 2023",
            technologies: "React,Node.js,MongoDB,Stripe,WebRTC,Socket.io",
            description: "Plateforme complète de cours en ligne avec vidéo conférence WebRTC et paiements Stripe",
            file: "elearning-platform.zip"
          },
          {
            id: 13,
            title: "Application Angular Enterprise",
            author_name: "Antoine Martin",
            cohort: "Promo Paris 2024",
            technologies: "Angular,TypeScript,RxJS,NgRx,SCSS,Jest",
            description: "Application enterprise Angular avec state management NgRx et tests unitaires Jest",
            file: "angular-enterprise.zip"
          },
          {
            id: 14,
            title: "Automation DevOps",
            author_name: "Nadia Kadi",
            cohort: "AI Engineer - Mai 2024",
            technologies: "Python,Docker,Jenkins,AWS,Terraform,Ansible",
            description: "Pipeline DevOps complet avec automation, conteneurisation et infrastructure as code",
            file: "devops-automation.zip"
          },
          {
            id: 15,
            title: "Application Real-Time Chat",
            author_name: "Julien Morel",
            cohort: "Promo Lyon 2023",
            technologies: "React,Node.js,Socket.io,MongoDB,Redis,JWT",
            description: "Application de chat en temps réel avec WebSockets et stockage Redis",
            file: "realtime-chat.zip"
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

  // ✅ RECHERCHE AVANCÉE MULTI-CRITÈRES
  const filteredProjects = projects.filter(project => {
    if (!project) return false;

    // Si pas de recherche, afficher tous les projets
    if (searchTerm === '') {
      return true;
    }

    const searchLower = searchTerm.toLowerCase();
    
    // ✅ RECHERCHE PAR COHORTE
    const matchesCohort = project.cohort && 
      project.cohort.toLowerCase().includes(searchLower);
    
    // ✅ RECHERCHE PAR AUTEUR
    const matchesAuthor = project.author_name && 
      project.author_name.toLowerCase().includes(searchLower);
    
    // ✅ RECHERCHE PAR TITRE
    const matchesTitle = project.title && 
      project.title.toLowerCase().includes(searchLower);
    
    // ✅ RECHERCHE PAR DESCRIPTION
    const matchesDescription = project.description && 
      project.description.toLowerCase().includes(searchLower);
    
    // ✅ RECHERCHE PAR TECHNOLOGIES (multiple, séparées par virgules)
    const matchesTechnologies = project.technologies && 
      searchLower.split(',').some(tech => 
        project.technologies.toLowerCase().includes(tech.trim())
      );

    // ✅ COMBINAISON : OU logique entre les différents critères
    return matchesCohort || matchesAuthor || matchesTitle || 
           matchesDescription || matchesTechnologies;
  });

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Fonction pour créer un contenu de démonstration pour le ZIP
  const createMockZipContent = (projectTitle, projectData) => {
    // Créer une structure de fichiers factice pour le ZIP
    const filesContent = `
FICHIER ZIP DE DÉMONSTRATION - ${projectTitle.toUpperCase()}
===========================================================

Ceci est une simulation de fichier ZIP contenant la structure du projet.

STRUCTURE DU PROJET:
-------------------
📁 ${projectTitle.replace(/\s+/g, '-').toLowerCase()}/
├── 📄 README.md
├── 📄 package.json
├── 📁 src/
│   └── 📄 index.js
├── 📁 public/
│   └── 📄 index.html
└── 📄 PROJECT_INFO.json

CONTENU DES FICHIERS:
--------------------

📄 README.md:
# ${projectTitle}

${projectData.description || 'Aucune description disponible.'}

## Technologies utilisées
${projectData.technologies ? projectData.technologies.split(',').map(tech => `- ${tech.trim()}`).join('\n') : 'Non spécifiées'}

## Auteur
${projectData.author_name || 'Inconnu'}

## Cohort
${projectData.cohort || 'Non spécifiée'}

## Installation
\`\`\`bash
npm install
npm start
\`\`\`

📄 package.json:
{
  "name": "${projectTitle.toLowerCase().replace(/\s+/g, '-')}",
  "version": "1.0.0",
  "description": "${projectData.description || ''}",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "build": "npm run build"
  },
  "keywords": ["${projectData.technologies ? projectData.technologies.split(',')[0].trim() : 'project'}"],
  "author": "${projectData.author_name || 'Inconnu'}",
  "license": "MIT",
  "dependencies": {},
  "devDependencies": {}
}

📄 src/index.js:
// ${projectTitle}
// Projet généré le ${new Date().toLocaleString()}

console.log('🚀 Bienvenue dans le projet ${projectTitle}');
console.log('👨‍💻 Auteur: ${projectData.author_name || 'Inconnu'}');
console.log('🎓 Cohort: ${projectData.cohort || 'Non spécifiée'}');
console.log('🛠 Technologies: ${projectData.technologies || 'Non spécifiées'}');

function main() {
    console.log('✅ Application démarrée avec succès!');
    console.log('📅 Date: ${new Date().toLocaleString()}');
}

main();

📄 PROJECT_INFO.json:
{
  "project_id": ${projectData.id},
  "title": "${projectTitle}",
  "author": "${projectData.author_name}",
  "cohort": "${projectData.cohort}",
  "technologies": ${projectData.technologies ? JSON.stringify(projectData.technologies.split(',').map(t => t.trim())) : '[]'},
  "description": "${projectData.description || ''}",
  "download_date": "${new Date().toISOString()}",
  "generated_by": "Simplon Code Platform",
  "note": "Ceci est une démonstration de téléchargement ZIP. En production, ce serait un vrai fichier ZIP avec le code source."
}

INFORMATIONS:
------------
• Projet ID: ${projectData.id}
• Téléchargé le: ${new Date().toLocaleString()}
• Format: ZIP de démonstration
• Statut: Simulation réussie

REMARQUE:
---------
Ce fichier représente une démonstration du système de téléchargement.
Dans un environnement de production, vous recevriez un vrai fichier ZIP
contenant le code source complet du projet.

Pour toute question, contactez l'administrateur de la plateforme.
    `.trim();

    return filesContent;
  };

  // Fonction principale de téléchargement
  const handleDownload = async (projectId, projectTitle, fileName) => {
    try {
      setDownloading(prev => ({ ...prev, [projectId]: true }));
      console.log(`📥 Début du téléchargement du projet ${projectId}: ${projectTitle}`);
      
      // Essayer d'abord le téléchargement réel via l'API
      try {
        const blob = await projectService.downloadProjectFile(projectId, fileName || projectTitle);
        
        // Créer un URL pour le blob
        const url = window.URL.createObjectURL(blob);
        
        // Créer un élément anchor pour le téléchargement
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectTitle.replace(/\s+/g, '-').toLowerCase()}.zip`;
        document.body.appendChild(a);
        a.click();
        
        // Nettoyer
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
      } catch (apiError) {
        console.log('📦 API non disponible, création d\'un fichier de démonstration...');
        // Si l'API échoue, créer un fichier de démonstration
        const projectData = projects.find(p => p.id === projectId) || {};
        const content = createMockZipContent(projectTitle, projectData);
        
        // Créer un blob avec le contenu
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

  // Extraire les cohortes uniques pour les suggestions
  const cohortOptions = [...new Set(projects.map(p => p.cohort).filter(Boolean))].sort();
  // Extraire les technologies uniques pour les suggestions
  const allTechnologies = new Set();
  projects.forEach(project => {
    if (project.technologies) {
      project.technologies.split(',').forEach(tech => {
        if (tech.trim()) allTechnologies.add(tech.trim());
      });
    }
  });
  const technologyOptions = Array.from(allTechnologies).sort();

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
        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">
            
            {/* Header avec profil utilisateur */}
            <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
              <div>
                <h1 className="text-[#001F3F] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                  Explorer les Projets
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Découvrez et téléchargez les projets partagés par la communauté Simplon
                </p>
                
                {/* Indicateur de recherche active */}
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
                {/* ✅ PHOTO DE PROFIL CORRIGÉE - MÊME QUE DANS PROFILE.JSX */}
                <div 
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 border-2 border-primary cursor-pointer hover:border-primary/80 transition-colors"
                  style={{ 
                    backgroundImage: `url(${userProfilePicture || user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCOEWiUsTwO8WM7eKk9ihSrGB-yTnj6Oer1pTWTf_spAb7eV22RX0LZ1UPKdK02_ir9OQKkn8UyJmlDqQxkPJTiLDMtzFAooBHzRyfkt-Sd-kOGWZbn9ccGU4THtkk5AaCXc-z4SkYtd3sivd8r20LAIccUBtibXZ_A7paRHquHcmJf213-GbmYibvQg5l1uG5cGw7UfGO0xOi3aakHJGD9Q2TOoZkBSgguzhYUSkp0eFWQ5O-3rHqcGZBxV1iCxccixEJXXB1uloI"})` 
                  }}
                  onClick={() => navigate('/profile')}
                  title="Voir mon profil"
                ></div>
                <div className="flex flex-col text-right">
                  <h2 className="text-[#001F3F] dark:text-white text-base font-medium">
                    {user?.username || 'Utilisateur'}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {user?.cohort || 'Stagiaire'}
                  </p>
                </div>
              </div>
            </header>

            {/* Contenu principal avec recherche avancée */}
            <div className="flex flex-col gap-6">
              
              {/* Barre de recherche AVANCÉE */}
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
                
                <div className="flex w-full flex-1 items-stretch rounded-lg h-12 bg-white dark:bg-[#001F3F]/50 border border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/50 transition-all">
                  <div className="text-gray-500 flex items-center justify-center pl-4">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                  <input
                    id="search-input"
                    type="text"
                    placeholder="Rechercher par titre, auteur, technologie (séparer par ,), cohorte, description..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden bg-transparent text-[#001F3F] dark:text-white h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 text-base font-normal leading-normal focus:outline-none"
                  />
                  {searchTerm && (
                    <div className="flex items-center pr-3 text-gray-400">
                      <span className="text-sm">{filteredProjects.length}</span>
                    </div>
                  )}
                </div>

                {/* Suggestions de recherche avancée */}
                {searchTerm && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Suggestions de recherche:
                      </p>
                      <div className="space-y-1">
                        {/* Suggestions de cohortes */}
                        {cohortOptions.filter(cohort => 
                          cohort.toLowerCase().includes(searchTerm.toLowerCase())
                        ).slice(0, 2).map(cohort => (
                          <button
                            key={cohort}
                            onClick={() => setSearchTerm(cohort)}
                            className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-base">school</span>
                            <span>Cohorte: {cohort}</span>
                          </button>
                        ))}
                        
                        {/* Suggestions de technologies */}
                        {technologyOptions.filter(tech => 
                          tech.toLowerCase().includes(searchTerm.toLowerCase())
                        ).slice(0, 2).map(tech => (
                          <button
                            key={tech}
                            onClick={() => setSearchTerm(tech)}
                            className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-base">code</span>
                            <span>Technologie: {tech}</span>
                          </button>
                        ))}

                        {/* Suggestion de recherche multiple */}
                        {searchTerm.includes(',') && (
                          <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs text-yellow-700 dark:text-yellow-300">
                            💡 <strong>Recherche multiple activée</strong><br/>
                            Recherche des projets contenant <strong>au moins une</strong> de ces technologies
                          </div>
                        )}

                        {/* Exemples de recherche */}
                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Exemples:</p>
                          <div className="flex flex-wrap gap-1">
                            <button
                              onClick={() => setSearchTerm('React,Node.js')}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200"
                            >
                              React,Node.js
                            </button>
                            <button
                              onClick={() => setSearchTerm('DWWM')}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200"
                            >
                              DWWM
                            </button>
                            <button
                              onClick={() => setSearchTerm('Léa Martin')}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200"
                            >
                              Léa Martin
                            </button>
                            <button
                              onClick={() => setSearchTerm('e-commerce')}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200"
                            >
                              e-commerce
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Indicateur de chargement */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                  <span className="ml-3 text-gray-600">Chargement des projets...</span>
                </div>
              )}

              {/* Message si aucun projet */}
              {!loading && filteredProjects.length === 0 && (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-gray-400 mb-3">
                    <span className="material-symbols-outlined text-6xl">search_off</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                    {searchTerm 
                      ? "Aucun projet trouvé" 
                      : "Aucun projet disponible"}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {searchTerm 
                      ? `Aucun projet ne correspond à "${searchTerm}" dans les titres, auteurs, technologies, cohortes ou descriptions`
                      : "Aucun projet n'a été partagé pour le moment."}
                  </p>
                  
                  {/* Suggestions si recherche vide */}
                  {searchTerm && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                        💡 Essayez de rechercher par:
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <button
                          onClick={() => setSearchTerm('React')}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                        >
                          Technologie (React)
                        </button>
                        <button
                          onClick={() => setSearchTerm('DWWM')}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                        >
                          Cohorte (DWWM)
                        </button>
                        <button
                          onClick={() => setSearchTerm('Léa Martin')}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                        >
                          Auteur
                        </button>
                        <button
                          onClick={() => setSearchTerm('React,Node.js')}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                        >
                          Technologies multiples
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setSearchTerm('')}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      {searchTerm ? "Voir tous les projets" : "Actualiser"}
                    </button>
                  </div>
                </div>
              )}

              {/* Grille des projets */}
              {!loading && filteredProjects.length > 0 && (
                <>
                  {/* En-tête des résultats */}
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        {searchTerm ? (
                          <>
                            Résultats pour "{searchTerm}"
                            {searchTerm.includes(',') && (
                              <span className="ml-2 text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">
                                Recherche multiple
                              </span>
                            )}
                          </>
                        ) : (
                          "Tous les projets disponibles"
                        )}
                      </h3>
                      {searchTerm && (
                        <p className="text-sm text-gray-500 mt-1">
                          Recherche dans: Titres, Auteurs, Technologies, Cohortes, Descriptions
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-normal text-gray-500">
                      ({filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProjects.map(project => (
                      <div key={project.id} className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#001F3F]/30 overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]">
                        <div className="p-5 flex flex-col gap-4 flex-1">
                          <div className="flex flex-col gap-1">
                            <h3 className="text-[#001F3F] dark:text-white text-lg font-bold line-clamp-2">
                              {project.title}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                              Par {project.author_name}
                            </p>
                            {project.cohort && (
                              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mt-1">
                                {project.cohort}
                              </p>
                            )}
                          </div>
                          
                          {/* Description courte */}
                          {project.description && (
                            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                              {project.description}
                            </p>
                          )}
                          
                          {/* Badges technologies */}
                          {project.technologies && (
                            <div className="flex flex-wrap gap-1">
                              {project.technologies.split(',').slice(0, 5).map((tech, index) => (
                                <span 
                                  key={index}
                                  className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary"
                                >
                                  {tech.trim()}
                                </span>
                              ))}
                              {project.technologies.split(',').length > 5 && (
                                <span className="text-xs font-medium bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                  +{project.technologies.split(',').length - 5}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Actions */}
                        <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between gap-2">
                          <button 
                            onClick={() => navigate(`/project/${project.id}`)}
                            className="flex-1 text-center text-sm font-semibold bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-base">visibility</span>
                            Voir détails
                          </button>
                          <button 
                            onClick={() => handleDownload(project.id, project.title, project.file)}
                            disabled={downloading[project.id]}
                            className={`shrink-0 flex items-center justify-center h-9 w-9 rounded-lg border transition-colors ${
                              downloading[project.id]
                                ? 'bg-gray-300 border-gray-400 text-gray-600 cursor-not-allowed'
                                : 'bg-white dark:bg-[#001F3F]/50 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                            title={`Télécharger ${project.title} en ZIP`}
                          >
                            {downloading[project.id] ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                            ) : (
                              <span className="material-symbols-outlined text-base">download</span>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
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
