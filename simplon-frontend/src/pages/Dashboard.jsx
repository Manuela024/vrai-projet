
// // src/pages/Dashboard.jsx - VERSION URGENCE SANS RATE LIMITING
// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { projectService } from '../services/projects';
// import authService from '../services/auth';
// import api from '../services/api';

// console.log('🔧 Dashboard.jsx chargé - VERSION URGENCE');

// const Dashboard = () => {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(false); // Changé à false pour éviter le loading
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const [downloading, setDownloading] = useState({});
//   const [userProfilePicture, setUserProfilePicture] = useState(null);
//   const [stats, setStats] = useState({
//     total: 0,
//     approved: 0,
//     rejected: 0
//   });
  
//   const navigate = useNavigate();

//   // Données MOCK basées sur vos données réelles de la BD
//   const getMockProjectsForUser = (currentUser) => {
//     if (!currentUser) return [];
    
//     const userEmail = currentUser.email?.toLowerCase();
//     const userName = currentUser.username || currentUser.first_name;
//     const userId = currentUser.id;
    
//     console.log(`🔍 Génération mock pour: ${userEmail} (ID: ${userId})`);
    
//     // BASÉ SUR VOS DONNÉES RÉELLES DE LA TABLE Projects_project
//     const allProjectsInDB = [
//       // Alice Martin (ID 18 dans la BD)
//       { id: 2, title: "maquette de jus", description: "c'est une maquette qui au visuel est assez simple mais le travail n'a pas été facile", technologies: "REACT , TAILWINDCSS", status: "draft", created_at: "2025-11-18T16:39:30.260Z", user_id: 18, author_name: "Alice Martin", author_email: "alice.martin@simplon.com", cohort: "simplon_2025001" },
//       { id: 8, title: "e commerce", description: "zerty iuytr sdfg wxc", technologies: "javascripts", status: "draft", created_at: "2025-12-08T14:27:36.750Z", user_id: 18, author_name: "Alice Martin", author_email: "alice.martin@simplon.com", cohort: "simplon_2025001" },
//       { id: 11, title: "Portfolio Personnel", description: "Mon portfolio développé avec React et Tailwind CSS", technologies: "React, Tailwind CSS, JavaScript", status: "approved", created_at: "2025-12-15T15:03:50.910Z", user_id: 8, author_name: "Alice Martin", author_email: "alice@simplon.com", cohort: "alice" },
//       { id: 14, title: "Dashboard Admin", description: "Tableau de bord pour administrateurs", technologies: "Vue.js, Python, Chart.js", status: "approved", created_at: "2025-12-15T15:03:50.940Z", user_id: 8, author_name: "Alice Martin", author_email: "alice@simplon.com", cohort: "alice" },
      
//       // Thomas Bernard (ID 14 dans la BD)
//       { id: 9, title: "Digital creator", description: "azertyuio qsdfghj wxcvbn,; ertyuio dfghjk rtyui oiytrez lkjhgf", technologies: "javascript,express.js,API gemini", status: "draft", created_at: "2025-12-15T09:41:50.896Z", user_id: 14, author_name: "Thomas Bernard", author_email: "thomas.bernard@simplon.com", cohort: "simplon_2025002" },
      
//       // Sophie Dubois (ID 15 dans la BD)
//       { id: 10, title: "IA PRODUCT", description: "poiuysgkqlxu,okscoufejds dtgdsjs dhdskde dfxgxjxkx dkdkdhd dkxks,s djxjkxkx dcfdddx", technologies: "Next.js", status: "draft", created_at: "2025-12-15T09:48:30.324Z", user_id: 15, author_name: "Sophie Dubois", author_email: "sophie.dubois@simplon.com", cohort: "simplon_2025003" },
      
//       // Admin (ID 3 dans la BD)
//       { id: 4, title: "Projet test après réinitialisation", description: "Description de test", technologies: "Python, Django, PostgreSQL", status: "draft", created_at: "2025-12-05T15:17:05.856Z", user_id: 3, author_name: "admin", author_email: "admin@simplon.com", cohort: "Simplon 2025" },
//       { id: 6, title: "Projet avec cohorte et tags", description: "Description de test", technologies: "Python, Django, React", status: "published", created_at: "2025-12-08T09:58:01.077Z", user_id: 3, author_name: "admin", author_email: "admin@simplon.com", cohort: "Bootcamp Développeur Web" },
      
//       // Autres utilisateurs (de vos données)
//       { id: 12, title: "API REST Simplon", description: "API pour la gestion des projets étudiants", technologies: "Django, Django REST Framework, PostgreSQL", status: "pending", created_at: "2025-12-15T15:03:50.925Z", user_id: 9, author_name: "Bob Dupont", author_email: "bob@simplon.com", cohort: "bob" },
//       { id: 13, title: "Application E-commerce", description: "Site e-commerce avec panier et paiement", technologies: "React, Node.js, MongoDB", status: "draft", created_at: "2025-12-15T15:03:50.934Z", user_id: 10, author_name: "Charlie Leroy", author_email: "charlie@simplon.com", cohort: "charlie" }
//     ];
    
//     // Filtrer les projets pour l'utilisateur actuel
//     const userProjects = allProjectsInDB.filter(project => {
//       // Correspondance par email
//       if (project.author_email && userEmail) {
//         const projectEmail = project.author_email.toLowerCase();
//         const userEmailLower = userEmail.toLowerCase();
        
//         // Correspondance exacte
//         if (projectEmail === userEmailLower) {
//           return true;
//         }
        
//         // Correspondance par nom (ex: alice@simplon.com et alice.martin@simplon.com)
//         const projectName = projectEmail.split('@')[0];
//         const userNameInEmail = userEmailLower.split('@')[0];
        
//         if (projectName === userNameInEmail.split('.')[0]) {
//           return true;
//         }
//       }
      
//       // Correspondance par ID
//       if (project.user_id && userId && project.user_id.toString() === userId.toString()) {
//         return true;
//       }
      
//       // Correspondance par nom d'utilisateur
//       if (project.author_name && userName) {
//         const projectName = project.author_name.toLowerCase();
//         const userNameLower = userName.toLowerCase();
        
//         if (projectName.includes(userNameLower) || userNameLower.includes(projectName)) {
//           return true;
//         }
//       }
      
//       return false;
//     });
    
//     console.log(`🎯 ${userProjects.length} projets mock générés pour ${userEmail}`);
    
//     return userProjects;
//   };

//   // Fonction pour charger les projets (version simple)
//   const loadProjects = () => {
//     const currentUser = authService.getCurrentUser();
    
//     if (!currentUser) {
//       navigate('/login');
//       return;
//     }
    
//     setUser(currentUser);
    
//     console.log('👤 Utilisateur connecté:', {
//       id: currentUser.id,
//       email: currentUser.email,
//       username: currentUser.username,
//       firstName: currentUser.first_name,
//       cohort: currentUser.cohort
//     });
    
//     // Utiliser les données MOCK (car l'API est bloquée)
//     const mockProjects = getMockProjectsForUser(currentUser);
    
//     setProjects(mockProjects);
    
//     // Calculer les statistiques
//     const approvedCount = mockProjects.filter(p => 
//       ['approved', 'approuvé', 'validé', 'accepté', 'published'].includes(p.status?.toLowerCase())
//     ).length;
    
//     const rejectedCount = mockProjects.filter(p => 
//       ['rejected', 'rejeté', 'refusé'].includes(p.status?.toLowerCase())
//     ).length;
    
//     setStats({
//       total: mockProjects.length,
//       approved: approvedCount,
//       rejected: rejectedCount
//     });
    
//     // Marquer comme chargé
//     setLoading(false);
    
//     // Afficher un message d'info
//     setError("⚠️ Mode démo: Les données affichées sont des données d'exemple basées sur votre compte. L'API Django est temporairement inaccessible (erreur 429).");
//   };

//   // Supprimer un projet (version locale seulement)
//   const handleDeleteProject = async (projectId, projectTitle) => {
//     if (!window.confirm(`Supprimer "${projectTitle}" ? (suppression locale seulement)`)) return;
    
//     // Supprimer localement seulement
//     setProjects(prev => prev.filter(p => p.id !== projectId));
//     setStats(prev => ({ ...prev, total: prev.total - 1 }));
    
//     alert('Projet supprimé localement (l\'API est inaccessible)');
//   };

//   // Télécharger un projet
//   const handleDownloadProject = async (projectId, projectTitle) => {
//     setDownloading(prev => ({ ...prev, [projectId]: true }));
    
//     try {
//       // Téléchargement simulé seulement
//       const project = projects.find(p => p.id === projectId);
      
//       const content = `PROJET: ${projectTitle}
// AUTEUR: ${project?.author_name || user?.username || 'Utilisateur'}
// EMAIL: ${project?.author_email || user?.email || ''}
// STATUT: ${getStatusText(project?.status) || 'Inconnu'}
// TECHNOLOGIES: ${project?.technologies || 'Non spécifié'}
// DESCRIPTION: ${project?.description || 'Aucune description'}
// DATE: ${new Date().toLocaleDateString('fr-FR')}

// === MODE DÉMO ===
// L'API Django est temporairement inaccessible.
// Ce fichier est une simulation.`;

//       const blob = new Blob([content], { type: 'text/plain' });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `${projectTitle.replace(/[^a-zA-Z0-9]/g, '-')}.txt`;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);
      
//     } finally {
//       setDownloading(prev => ({ ...prev, [projectId]: false }));
//     }
//   };

//   // Déconnexion
//   const handleLogout = () => {
//     authService.logout();
//     navigate('/login');
//   };

//   // Helper functions
//   const getStatusColor = (status) => {
//     const s = status?.toLowerCase();
//     if (['approved', 'approuvé', 'validé', 'accepté', 'published'].includes(s)) {
//       return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
//     }
//     if (['rejected', 'rejeté', 'refusé'].includes(s)) {
//       return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
//     }
//     if (['draft', 'brouillon'].includes(s)) {
//       return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
//     }
//     if (['pending', 'en attente', 'review', 'en révision'].includes(s)) {
//       return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
//     }
//     return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
//   };

//   const getStatusText = (status) => {
//     const s = status?.toLowerCase();
//     if (['approved', 'approuvé', 'validé', 'accepté', 'published'].includes(s)) return 'Approuvé';
//     if (['rejected', 'rejeté', 'refusé'].includes(s)) return 'Rejeté';
//     if (['draft', 'brouillon'].includes(s)) return 'Brouillon';
//     if (['pending', 'en attente', 'review', 'en révision'].includes(s)) return 'En attente';
//     return status || 'Inconnu';
//   };

//   const canDeleteProject = (project) => {
//     const status = project.status?.toLowerCase();
//     return !['approved', 'approuvé', 'validé', 'accepté', 'published'].includes(status);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Date inconnue';
//     try {
//       return new Date(dateString).toLocaleDateString('fr-FR');
//     } catch {
//       return 'Date invalide';
//     }
//   };

//   const getTechnologies = (project) => {
//     if (!project?.technologies) return [];
//     if (Array.isArray(project.technologies)) return project.technologies;
//     if (typeof project.technologies === 'string') {
//       return project.technologies.split(',').map(tech => tech.trim());
//     }
//     return [];
//   };

//   // Initialisation
//   useEffect(() => {
//     console.log('✅ Dashboard mounted - MODE DÉMO ACTIVÉ');
//     loadProjects();
//   }, [navigate]);

//   return (
//     <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen">
//       <div className="flex min-h-screen">
        
//         {/* Sidebar */}
//         <aside className="w-64 flex-shrink-0 bg-[#001F3F] text-white flex flex-col p-4">
//           <div className="flex items-center gap-3 px-3 py-2">
//             <img 
//               src="/src/logo.png" 
//               alt="Logo" 
//               className="size-10 rounded-full object-cover"
//               onError={(e) => e.target.src = "https://via.placeholder.com/40"}
//             />
//             <div>
//               <h1 className="text-white text-base font-medium">Simplon</h1>
//               <p className="text-gray-400 text-sm">Code Platform</p>
//             </div>
//           </div>
          
//           <nav className="mt-6 flex flex-col gap-2">
//             <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#003265]">
//               <span className="material-symbols-outlined">folder</span>
//               <span className="text-sm font-medium">Mes projets</span>
//             </Link>
//             <Link to="/upload" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10">
//               <span className="material-symbols-outlined">upload_file</span>
//               <span className="text-sm font-medium">Déposer un projet</span>
//             </Link>
//             <Link to="/explore" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10">
//               <span className="material-symbols-outlined">explore</span>
//               <span className="text-sm font-medium">Explorer</span>
//             </Link>
//           </nav>
          
//           <div className="mt-auto flex flex-col gap-1">
//             <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10">
//               <span className="material-symbols-outlined">person</span>
//               <span className="text-sm font-medium">Profil</span>
//             </Link>
//             <Link to="/parametre" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10">
//               <span className="material-symbols-outlined">settings</span>
//               <span>Paramètre</span>
//             </Link>
//             <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-left">
//               <span className="material-symbols-outlined">logout</span>
//               <span className="text-sm font-medium">Déconnexion</span>
//             </button>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-8">
//           <div className="max-w-7xl mx-auto">
            
//             {/* Header */}
//             <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
//               <div>
//                 <h1 className="text-4xl font-black text-[#1c0d0d] dark:text-gray-200">Tableau de Bord</h1>
//                 <p className="text-gray-500 dark:text-gray-400 mt-2">
//                   Bienvenue, {user?.first_name || user?.username || 'Utilisateur'} !
//                 </p>
//               </div>
              
//               <div className="flex items-center gap-3">
//                 <div 
//                   className="size-12 rounded-full border-2 border-[#E30613] bg-cover bg-center cursor-pointer"
//                   style={{ 
//                     backgroundImage: `url(${userProfilePicture || user?.avatar || "https://via.placeholder.com/150"})` 
//                   }}
//                   onClick={() => navigate('/profile')}
//                 ></div>
//                 <div className="text-right">
//                   <h2 className="text-base font-medium text-[#1c0d0d] dark:text-gray-200">
//                     {user?.username || 'Utilisateur'}
//                   </h2>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                     {user?.cohort || 'Stagiaire'} • {user?.email || ''}
//                   </p>
//                 </div>
//               </div>
//             </header>

//             {/* Alert IMPORTANT */}
//             <div className="mb-6 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg">
//               <div className="flex items-start">
//                 <span className="material-symbols-outlined mr-2">warning</span>
//                 <div className="flex-1">
//                   <strong>⚠️ MODE DÉMO ACTIVÉ</strong>
//                   <p className="mt-1 text-sm">
//                     Le serveur Django bloque temporairement les requêtes (erreur 429). 
//                     Les données affichées sont basées sur les informations de votre compte.
//                   </p>
//                   <p className="mt-2 text-xs">
//                     Pour résoudre définitivement : Redémarrez le serveur Django et ajustez les paramètres de rate limiting.
//                   </p>
//                 </div>
//                 <button 
//                   onClick={() => {
//                     // Essayer de rafraîchir avec un délai long
//                     setTimeout(() => loadProjects(), 10000); // 10 secondes
//                     setError("Nouvelle tentative dans 10 secondes...");
//                   }}
//                   className="ml-4 px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
//                 >
//                   Réessayer dans 10s
//                 </button>
//               </div>
//             </div>

//             {/* Statistics */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
//                     <p className="text-sm text-gray-600 dark:text-gray-400">Approuvés</p>
//                     <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.approved}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white dark:bg-[#1C2B3A] rounded-xl p-6 shadow">
//                 <div className="flex items-center">
//                   <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
//                     <span className="material-symbols-outlined text-red-600 dark:text-red-300">cancel</span>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm text-gray-600 dark:text-gray-400">Rejetés</p>
//                     <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.rejected}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Main Content */}
//             <div className="flex flex-col gap-6">
              
//               {/* Action Bar */}
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mes Projets</h2>
//                   <p className="text-gray-600 dark:text-gray-400">
//                     {stats.total > 0 
//                       ? `${stats.total} projet${stats.total > 1 ? 's' : ''} (données de démonstration)`
//                       : 'Gérez et partagez vos projets de code'}
//                   </p>
//                 </div>
                
//                 <button
//                   onClick={() => navigate('/upload')}
//                   className="bg-[#E30613] text-white px-6 py-3 rounded-lg hover:bg-[#E30613]/90 flex items-center gap-2 text-sm font-medium shadow-md"
//                 >
//                   <span className="material-symbols-outlined">add</span>
//                   Nouveau projet
//                 </button>
//               </div>

//               {/* Error Message */}
//               {error && !error.includes('MODE DÉMO') && (
//                 <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
//                   <div className="flex items-center justify-between">
//                     <span>{error}</span>
//                     <button 
//                       onClick={() => loadProjects()}
//                       className="text-red-700 hover:text-red-900 underline ml-2"
//                     >
//                       Réessayer
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* No Projects */}
//               {!loading && projects.length === 0 && (
//                 <div className="text-center py-16 bg-white dark:bg-[#1C2B3A] rounded-xl shadow-md">
//                   <div className="text-gray-400 mb-4">
//                     <span className="material-symbols-outlined text-6xl">folder_off</span>
//                   </div>
//                   <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
//                     Aucun projet trouvé
//                   </h3>
//                   <p className="text-gray-500 dark:text-gray-400 text-base mb-6">
//                     {user?.email === 'thomas.bernard@simplon.com' 
//                       ? "Vous devriez avoir un projet 'Digital creator' dans la base de données."
//                       : "Vous n'avez pas encore déposé de projet."}
//                   </p>
                  
//                   <button
//                     onClick={() => navigate('/upload')}
//                     className="bg-[#E30613] hover:bg-[#E30613]/90 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2"
//                   >
//                     <span className="material-symbols-outlined">upload_file</span>
//                     Déposer mon premier projet
//                   </button>
                  
//                   <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-left">
//                     <h4 className="font-semibold mb-2">Informations de débogage:</h4>
//                     <p><strong>Utilisateur:</strong> {user?.email}</p>
//                     <p><strong>Mode:</strong> Démo (API inaccessible)</p>
//                     <button 
//                       onClick={() => {
//                         console.log('Données utilisateur:', user);
//                         console.log('Projets mock:', projects);
//                       }}
//                       className="mt-2 text-blue-600 hover:text-blue-800"
//                     >
//                       Voir les données dans la console
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Projects Grid */}
//               {!loading && projects.length > 0 && (
//                 <>
//                   <div className="flex justify-between items-center mb-6">
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
//                         Mes projets ({projects.length})
//                       </h3>
//                       <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
//                         {stats.approved} approuvés • {stats.rejected} rejetés • Mode démo
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
//                         Données de démo
//                       </span>
//                       <button 
//                         onClick={() => loadProjects()}
//                         className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
//                       >
//                         <span className="material-symbols-outlined text-base">refresh</span>
//                         Rafraîchir
//                       </button>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {projects.map(project => {
//                       const deletable = canDeleteProject(project);
//                       const technologies = getTechnologies(project);
                      
//                       return (
//                         <div 
//                           key={project.id} 
//                           className="bg-white dark:bg-[#1C2B3A] rounded-xl shadow-md overflow-hidden flex flex-col cursor-pointer group h-[320px] border border-gray-200 dark:border-gray-700"
//                           onClick={() => navigate(`/project/${project.id}`)}
//                         >
//                           <div className="p-6 flex-grow">
//                             <div className="flex justify-between items-start mb-4">
//                               <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
//                                 {project.title || 'Sans titre'}
//                               </h2>
//                               <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
//                                 {getStatusText(project.status)}
//                               </span>
//                             </div>
                            
//                             {project.description && (
//                               <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
//                                 {project.description}
//                               </p>
//                             )}
                            
//                             {technologies.length > 0 && (
//                               <div className="flex flex-wrap gap-2 mt-4">
//                                 {technologies.slice(0, 4).map((tech, index) => (
//                                   <span 
//                                     key={index}
//                                     className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-2.5 py-1 rounded-full"
//                                   >
//                                     {tech.substring(0, 15)}
//                                   </span>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
                          
//                           <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800">
//                             <div className="flex justify-between items-center">
//                               <p className="text-sm text-gray-500 dark:text-gray-400">
//                                 {formatDate(project.created_at)}
//                               </p>
//                               <p className="text-sm text-gray-500 dark:text-gray-400">
//                                 {project.cohort || 'Sans cohorte'}
//                               </p>
//                             </div>
//                             <div className="mt-1 text-xs text-gray-400">
//                               {project.author_name}
//                             </div>
//                           </div>
                          
//                           <div 
//                             className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1C2B3A]/50 p-4 flex justify-end gap-2"
//                             onClick={e => e.stopPropagation()}
//                           >
//                             <button 
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleDownloadProject(project.id, project.title);
//                               }}
//                               disabled={downloading[project.id]}
//                               className="size-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200"
//                               title="Télécharger (démo)"
//                             >
//                               {downloading[project.id] ? (
//                                 <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent"></div>
//                               ) : (
//                                 <span className="material-symbols-outlined">download</span>
//                               )}
//                             </button>
                            
//                             {deletable && (
//                               <button 
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleDeleteProject(project.id, project.title);
//                                 }}
//                                 className="size-8 rounded-full flex items-center justify-center text-red-600 hover:bg-red-50"
//                                 title="Supprimer (local)"
//                               >
//                                 <span className="material-symbols-outlined">delete</span>
//                               </button>
//                             )}
                            
//                             <button 
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 navigate(`/project/${project.id}`);
//                               }}
//                               className="size-8 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-50"
//                               title="Voir détails"
//                             >
//                               <span className="material-symbols-outlined">visibility</span>
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

// export default Dashboard;



// // src/pages/Dashboard.jsx - VERSION CORRIGÉE AVEC FILTRAGE RÉEL
// import React, { useEffect, useState, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import authService from '../services/auth';
// import api from '../services/api';

// console.log('🔧 Dashboard.jsx chargé - VERSION CORRIGÉE FILTRAGE');

// const Dashboard = () => {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const [stats, setStats] = useState({
//     total: 0,
//     approved: 0,
//     rejected: 0,
//     pending: 0,
//     draft: 0
//   });
//   const [apiInfo, setApiInfo] = useState({
//     connected: false,
//     endpoints: [],
//     rawData: null,
//     debug: false
//   });
  
//   const navigate = useNavigate();
//   const isMounted = useRef(true);

//   // Fonction pour récupérer TOUS les projets de l'API
//   const fetchAllProjectsFromAPI = async () => {
//     console.log('📡 Récupération de TOUS les projets depuis l\'API...');
    
//     const endpoints = [
//       '/api/projects/projects/',
//       '/api/projects/',
//       '/api/project/',
//       '/api/users/projects/user/18/',
//       '/api/users/18/projects/'
//     ];
    
//     for (const endpoint of endpoints) {
//       try {
//         console.log(`🔄 Tentative: ${endpoint}`);
        
//         const token = authService.getAccessToken();
//         const headers = {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json'
//         };
        
//         if (token) {
//           headers['Authorization'] = `Bearer ${token}`;
//         }
        
//         const response = await fetch(`http://localhost:8000${endpoint}`, {
//           method: 'GET',
//           headers: headers,
//           signal: AbortSignal.timeout(5000)
//         });
        
//         if (response.ok) {
//           const data = await response.json();
//           console.log(`✅ Données récupérées de ${endpoint}:`, data);
          
//           // Retourner les données avec l'endpoint utilisé
//           return { data, endpoint };
//         }
//       } catch (err) {
//         console.log(`❌ ${endpoint} échoué:`, err.message);
//       }
//     }
    
//     throw new Error('Aucun endpoint API fonctionnel trouvé');
//   };

//   // Fonction intelligente pour filtrer les projets de l'utilisateur
//   const filterUserProjects = (allProjects, currentUser) => {
//     if (!allProjects || !currentUser) return [];
    
//     console.log('🔍 Filtrage des projets pour utilisateur:', {
//       userId: currentUser.id,
//       email: currentUser.email,
//       username: currentUser.username,
//       totalProjects: allProjects.length
//     });
    
//     const userId = currentUser.id?.toString();
//     const userEmail = currentUser.email?.toLowerCase().trim();
//     const username = currentUser.username?.toLowerCase().trim();
    
//     return allProjects.filter(project => {
//       if (!project) return false;
      
//       console.log('📋 Projet analysé:', {
//         id: project.id,
//         title: project.title,
//         author_id: project.author_id,
//         user_id: project.user_id,
//         author_email: project.author_email,
//         author: project.author
//       });
      
//       // 1. Vérifier par ID utilisateur direct
//       const projectUserId = project.author_id || project.user_id;
//       if (projectUserId && userId && projectUserId.toString() === userId) {
//         console.log(`✅ Correspondance par ID: ${projectUserId} === ${userId}`);
//         return true;
//       }
      
//       // 2. Vérifier si l'author est un objet avec id
//       if (project.author && typeof project.author === 'object') {
//         const authorId = project.author.id?.toString();
//         if (authorId && userId && authorId === userId) {
//           console.log(`✅ Correspondance par author.id: ${authorId} === ${userId}`);
//           return true;
//         }
        
//         // Vérifier par email dans l'objet author
//         const authorEmail = project.author.email?.toLowerCase().trim();
//         if (authorEmail && userEmail && authorEmail === userEmail) {
//           console.log(`✅ Correspondance par author.email: ${authorEmail} === ${userEmail}`);
//           return true;
//         }
//       }
      
//       // 3. Vérifier par email direct
//       const projectEmail = project.author_email?.toLowerCase().trim();
//       if (projectEmail && userEmail && projectEmail === userEmail) {
//         console.log(`✅ Correspondance par email: ${projectEmail} === ${userEmail}`);
//         return true;
//       }
      
//       // 4. Vérifier par username dans author (si c'est une chaîne)
//       if (project.author && typeof project.author === 'string') {
//         const authorUsername = project.author.toLowerCase().trim();
//         if (username && authorUsername.includes(username) || username.includes(authorUsername)) {
//           console.log(`✅ Correspondance par author string: ${authorUsername} === ${username}`);
//           return true;
//         }
//       }
      
//       // 5. Pour le débogage, afficher tous les projets si demandé
//       if (apiInfo.debug) {
//         console.log('⚠️ Projet inclus pour débogage');
//         return true;
//       }
      
//       console.log('❌ Aucune correspondance trouvée');
//       return false;
//     });
//   };

//   // Fonction pour extraire les projets d'une réponse API
//   const extractProjectsFromResponse = (responseData) => {
//     if (!responseData) return [];
    
//     console.log('📦 Extraction des projets depuis la réponse:', responseData);
    
//     // Différents formats possibles
//     if (Array.isArray(responseData)) {
//       console.log(`✅ Format: Tableau direct (${responseData.length} éléments)`);
//       return responseData;
//     }
    
//     if (responseData.results && Array.isArray(responseData.results)) {
//       console.log(`✅ Format: results (${responseData.results.length} éléments)`);
//       return responseData.results;
//     }
    
//     if (responseData.projects && Array.isArray(responseData.projects)) {
//       console.log(`✅ Format: projects (${responseData.projects.length} éléments)`);
//       return responseData.projects;
//     }
    
//     if (responseData.data && Array.isArray(responseData.data)) {
//       console.log(`✅ Format: data (${responseData.data.length} éléments)`);
//       return responseData.data;
//     }
    
//     // Chercher un tableau dans l'objet
//     for (const key in responseData) {
//       if (Array.isArray(responseData[key])) {
//         console.log(`✅ Format: ${key} (${responseData[key].length} éléments)`);
//         return responseData[key];
//       }
//     }
    
//     console.log('⚠️ Aucun tableau trouvé dans la réponse');
//     return [];
//   };

//   // Fonction principale pour charger les projets
//   const loadRealProjects = async () => {
//     if (!isMounted.current) return;
    
//     setLoading(true);
//     setError(null);
    
//     try {
//       console.log('🚀 Début du chargement des projets...');
      
//       const currentUser = authService.getCurrentUser();
      
//       if (!currentUser) {
//         navigate('/login');
//         return;
//       }
      
//       console.log('👤 Utilisateur connecté:', {
//         id: currentUser.id,
//         email: currentUser.email,
//         username: currentUser.username,
//         firstName: currentUser.first_name,
//         cohort: currentUser.cohort
//       });
      
//       setUser(currentUser);
      
//       // 1. Récupérer tous les projets depuis l'API
//       const apiResult = await fetchAllProjectsFromAPI();
//       const allProjects = extractProjectsFromResponse(apiResult.data);
      
//       console.log(`📊 ${allProjects.length} projets récupérés de ${apiResult.endpoint}`);
      
//       // Sauvegarder les données brutes pour débogage
//       setApiInfo(prev => ({
//         ...prev,
//         connected: true,
//         endpoints: [apiResult.endpoint],
//         rawData: apiResult.data
//       }));
      
//       // 2. Filtrer les projets pour cet utilisateur
//       const userProjects = filterUserProjects(allProjects, currentUser);
      
//       console.log(`🎯 ${userProjects.length} projets filtrés pour l'utilisateur`);
      
//       // 3. Si aucun projet n'est trouvé, afficher un message détaillé
//       if (userProjects.length === 0) {
//         console.log('📋 Tous les projets récupérés (pour débogage):', 
//           allProjects.map(p => ({
//             id: p.id,
//             title: p.title,
//             author_id: p.author_id,
//             user_id: p.user_id,
//             author_email: p.author_email,
//             author: p.author,
//             user: p.user
//           }))
//         );
        
//         setError(`
//           ℹ️ Aucun projet trouvé pour ${currentUser.email}.
          
//           Projets disponibles dans l'API: ${allProjects.length}
//           Vérifiez que vos projets ont bien votre ID (${currentUser.id}) ou email.
          
//           Cliquez sur "Afficher tout" pour voir tous les projets disponibles.
//         `);
        
//         // Option: afficher tous les projets pour débogage
//         if (window.confirm('Aucun projet trouvé pour votre compte. Voulez-vous voir tous les projets disponibles pour débogage ?')) {
//           setApiInfo(prev => ({ ...prev, debug: true }));
//           setProjects(allProjects);
//           calculateStats(allProjects);
//           return;
//         }
//       } else {
//         setProjects(userProjects);
//         calculateStats(userProjects);
//       }
      
//     } catch (err) {
//       console.error('❌ Erreur chargement projets:', err);
      
//       let errorMessage = 'Impossible de charger les projets';
      
//       if (err.message.includes('Aucun endpoint')) {
//         errorMessage = `
//           ❌ Aucun endpoint API fonctionnel trouvé.
          
//           Vérifiez que :
//           1. Django tourne sur http://localhost:8000
//           2. Vous avez des endpoints comme /api/projects/ dans urls.py
//           3. Le serveur n'est pas bloqué par le rate limiting
          
//           Endpoints testés:
//           - /api/projects/projects/
//           - /api/projects/
//           - /api/project/
//           - /api/users/projects/user/18/
//         `;
//       }
      
//       setError(errorMessage);
      
//     } finally {
//       if (isMounted.current) {
//         setLoading(false);
//       }
//     }
//   };

//   // Calculer les statistiques
//   const calculateStats = (projectList) => {
//     const approvedCount = projectList.filter(p => 
//       ['approved', 'approuvé', 'validé', 'accepté', 'published', 'publié'].includes(p.status?.toLowerCase())
//     ).length;
    
//     const rejectedCount = projectList.filter(p => 
//       ['rejected', 'rejeté', 'refusé'].includes(p.status?.toLowerCase())
//     ).length;
    
//     const pendingCount = projectList.filter(p => 
//       ['pending', 'en attente', 'en_attente', 'review', 'en révision'].includes(p.status?.toLowerCase())
//     ).length;
    
//     const draftCount = projectList.filter(p => 
//       ['draft', 'brouillon'].includes(p.status?.toLowerCase())
//     ).length;
    
//     setStats({
//       total: projectList.length,
//       approved: approvedCount,
//       rejected: rejectedCount,
//       pending: pendingCount,
//       draft: draftCount
//     });
//   };

//   // Helper functions
//   const getStatusColor = (status) => {
//     const s = status?.toLowerCase();
//     if (['approved', 'approuvé', 'validé', 'accepté', 'published', 'publié'].includes(s)) {
//       return 'bg-green-100 text-green-800';
//     }
//     if (['rejected', 'rejeté', 'refusé'].includes(s)) {
//       return 'bg-red-100 text-red-800';
//     }
//     if (['draft', 'brouillon'].includes(s)) {
//       return 'bg-yellow-100 text-yellow-800';
//     }
//     if (['pending', 'en attente', 'review', 'en révision'].includes(s)) {
//       return 'bg-purple-100 text-purple-800';
//     }
//     return 'bg-gray-100 text-gray-800';
//   };

//   const getStatusText = (status) => {
//     const s = status?.toLowerCase();
//     if (['approved', 'approuvé', 'validé', 'accepté', 'published', 'publié'].includes(s)) return 'Approuvé';
//     if (['rejected', 'rejeté', 'refusé'].includes(s)) return 'Rejeté';
//     if (['draft', 'brouillon'].includes(s)) return 'Brouillon';
//     if (['pending', 'en attente', 'review', 'en révision'].includes(s)) return 'En attente';
//     return status || 'Inconnu';
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Date inconnue';
//     try {
//       return new Date(dateString).toLocaleDateString('fr-FR');
//     } catch {
//       return 'Date invalide';
//     }
//   };

//   const getTechnologies = (project) => {
//     if (!project?.technologies) return [];
//     if (Array.isArray(project.technologies)) return project.technologies;
//     if (typeof project.technologies === 'string') {
//       return project.technologies.split(',').map(tech => tech.trim());
//     }
//     return [];
//   };

//   // Initialisation
//   useEffect(() => {
//     isMounted.current = true;
    
//     const currentUser = authService.getCurrentUser();
//     if (!currentUser) {
//       navigate('/login');
//       return;
//     }
    
//     setUser(currentUser);
//     loadRealProjects();
    
//     return () => {
//       isMounted.current = false;
//     };
//   }, [navigate]);

//   return (
//     <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen">
//       <div className="flex min-h-screen">
        
//         {/* Sidebar */}
//         <aside className="w-64 flex-shrink-0 bg-[#001F3F] text-white flex flex-col p-4">
//           <div className="flex items-center gap-3 px-3 py-2">
//             <img 
//               src="/src/logo.png" 
//               alt="Logo" 
//               className="size-10 rounded-full object-cover"
//               onError={(e) => e.target.src = "https://via.placeholder.com/40"}
//             />
//             <div>
//               <h1 className="text-white text-base font-medium">Simplon</h1>
//               <p className="text-gray-400 text-sm">Code Platform</p>
//             </div>
//           </div>
          
//           <nav className="mt-6 flex flex-col gap-2">
//             <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#003265]">
//               <span className="material-symbols-outlined">folder</span>
//               <span className="text-sm font-medium">Mes projets</span>
//             </Link>
//             <Link to="/upload" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10">
//               <span className="material-symbols-outlined">upload_file</span>
//               <span className="text-sm font-medium">Déposer un projet</span>
//             </Link>
//             <Link to="/explore" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10">
//               <span className="material-symbols-outlined">explore</span>
//               <span className="text-sm font-medium">Explorer</span>
//             </Link>
//           </nav>
          
//           <div className="mt-auto flex flex-col gap-1">
//             <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10">
//               <span className="material-symbols-outlined">person</span>
//               <span className="text-sm font-medium">Profil</span>
//             </Link>
//             <Link to="/parametre" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10">
//               <span className="material-symbols-outlined">settings</span>
//               <span>Paramètre</span>
//             </Link>
//             <button 
//               onClick={() => {
//                 authService.logout();
//                 navigate('/login');
//               }} 
//               className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-left"
//             >
//               <span className="material-symbols-outlined">logout</span>
//               <span className="text-sm font-medium">Déconnexion</span>
//             </button>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-8">
//           <div className="max-w-7xl mx-auto">
            
//             {/* Header */}
//             <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
//               <div>
//                 <h1 className="text-4xl font-black text-[#1c0d0d] dark:text-gray-200">Tableau de Bord</h1>
//                 <p className="text-gray-500 dark:text-gray-400 mt-2">
//                   Bienvenue, {user?.first_name || user?.username || 'Utilisateur'} !
//                 </p>
//                 <div className="mt-1 flex items-center gap-2">
//                   <span className={`text-xs px-2 py-1 rounded-full ${apiInfo.connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                     {apiInfo.connected ? '✅ API Connectée' : '❌ API Déconnectée'}
//                   </span>
//                   {apiInfo.debug && (
//                     <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
//                       Mode débogage
//                     </span>
//                   )}
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-3">
//                 <div 
//                   className="size-12 rounded-full border-2 border-[#E30613] bg-cover bg-center cursor-pointer"
//                   style={{ 
//                     backgroundImage: `url(${user?.avatar || "https://via.placeholder.com/150"})` 
//                   }}
//                   onClick={() => navigate('/profile')}
//                 ></div>
//                 <div className="text-right">
//                   <h2 className="text-base font-medium text-[#1c0d0d] dark:text-gray-200">
//                     {user?.username || 'Utilisateur'}
//                   </h2>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                     ID: {user?.id} • {user?.cohort || 'Stagiaire'}
//                   </p>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">
//                     {user?.email || ''}
//                   </p>
//                 </div>
//               </div>
//             </header>

//             {/* API Info */}
//             {apiInfo.connected && (
//               <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <strong>📡 Informations API</strong>
//                     <p className="text-sm mt-1">
//                       Endpoint: {apiInfo.endpoints[0]} • {projects.length} projets chargés
//                     </p>
//                     {apiInfo.debug && (
//                       <p className="text-sm mt-1 text-yellow-700">
//                         Mode débogage activé - Affichage de tous les projets
//                       </p>
//                     )}
//                   </div>
//                   <button 
//                     onClick={() => {
//                       console.log('Données API brutes:', apiInfo.rawData);
//                       console.log('Projets filtrés:', projects);
//                       console.log('Utilisateur:', user);
//                     }}
//                     className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//                   >
//                     Debug Console
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Error Message */}
//             {error && (
//               <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
//                 <div className="flex items-start">
//                   <span className="material-symbols-outlined mr-2">error</span>
//                   <div className="flex-1">
//                     <div className="whitespace-pre-line">{error}</div>
//                     <div className="mt-3 flex gap-2">
//                       <button 
//                         onClick={loadRealProjects}
//                         className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
//                       >
//                         Réessayer
//                       </button>
//                       <button 
//                         onClick={() => {
//                           setApiInfo(prev => ({ ...prev, debug: !prev.debug }));
//                           loadRealProjects();
//                         }}
//                         className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
//                       >
//                         {apiInfo.debug ? 'Désactiver débogage' : 'Afficher tout'}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Statistics */}
//             <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
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
//                     <p className="text-sm text-gray-600 dark:text-gray-400">Approuvés</p>
//                     <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.approved}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white dark:bg-[#1C2B3A] rounded-xl p-6 shadow">
//                 <div className="flex items-center">
//                   <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
//                     <span className="material-symbols-outlined text-red-600 dark:text-red-300">cancel</span>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm text-gray-600 dark:text-gray-400">Rejetés</p>
//                     <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.rejected}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white dark:bg-[#1C2B3A] rounded-xl p-6 shadow">
//                 <div className="flex items-center">
//                   <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
//                     <span className="material-symbols-outlined text-purple-600 dark:text-purple-300">hourglass_empty</span>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm text-gray-600 dark:text-gray-400">En attente</p>
//                     <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white dark:bg-[#1C2B3A] rounded-xl p-6 shadow">
//                 <div className="flex items-center">
//                   <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
//                     <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-300">draft</span>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm text-gray-600 dark:text-gray-400">Brouillons</p>
//                     <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.draft}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Main Content */}
//             <div className="flex flex-col gap-6">
              
//               {/* Action Bar */}
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//                     {apiInfo.debug ? 'Tous les projets' : 'Mes Projets'}
//                   </h2>
//                   <p className="text-gray-600 dark:text-gray-400">
//                     {stats.total > 0 
//                       ? `${stats.total} projet${stats.total > 1 ? 's' : ''} ${apiInfo.debug ? 'disponibles' : 'trouvés'}`
//                       : 'Gérez et partagez vos projets de code'}
//                   </p>
//                 </div>
                
//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => navigate('/upload')}
//                     className="bg-[#E30613] text-white px-6 py-3 rounded-lg hover:bg-[#E30613]/90 flex items-center gap-2 text-sm font-medium shadow-md"
//                   >
//                     <span className="material-symbols-outlined">add</span>
//                     Nouveau projet
//                   </button>
//                   <button
//                     onClick={loadRealProjects}
//                     disabled={loading}
//                     className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-2 text-sm"
//                   >
//                     {loading ? (
//                       <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent"></div>
//                     ) : (
//                       <span className="material-symbols-outlined">refresh</span>
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Loading */}
//               {loading && (
//                 <div className="text-center py-16">
//                   <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E30613] border-t-transparent mx-auto mb-4"></div>
//                   <p className="text-gray-600 dark:text-gray-400">
//                     Chargement des données depuis l'API Django...
//                   </p>
//                   <p className="text-sm text-gray-500 mt-2">
//                     Récupération et filtrage des projets
//                   </p>
//                 </div>
//               )}

//               {/* No Projects */}
//               {!loading && projects.length === 0 && !error && (
//                 <div className="text-center py-16 bg-white dark:bg-[#1C2B3A] rounded-xl shadow-md">
//                   <div className="text-gray-400 mb-4">
//                     <span className="material-symbols-outlined text-6xl">folder_off</span>
//                   </div>
//                   <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
//                     Aucun projet trouvé
//                   </h3>
//                   <p className="text-gray-500 dark:text-gray-400 text-base mb-6">
//                     {apiInfo.connected 
//                       ? "L'API est connectée mais aucun projet n'a été trouvé pour votre compte."
//                       : "Impossible de se connecter à l'API Django."}
//                   </p>
                  
//                   <div className="flex gap-3 justify-center">
//                     <button
//                       onClick={() => navigate('/upload')}
//                       className="bg-[#E30613] hover:bg-[#E30613]/90 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2"
//                     >
//                       <span className="material-symbols-outlined">upload_file</span>
//                       Déposer un projet
//                     </button>
//                     <button
//                       onClick={() => {
//                         setApiInfo(prev => ({ ...prev, debug: true }));
//                         loadRealProjects();
//                       }}
//                       className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2"
//                     >
//                       <span className="material-symbols-outlined">bug_report</span>
//                       Mode débogage
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Projects Grid */}
//               {!loading && projects.length > 0 && (
//                 <>
//                   <div className="flex justify-between items-center mb-6">
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
//                         {apiInfo.debug ? 'Tous les projets disponibles' : 'Mes projets'} ({projects.length})
//                       </h3>
//                       <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
//                         {stats.approved} approuvés • {stats.rejected} rejetés • {stats.pending} en attente
//                       </p>
//                     </div>
//                     <div className="text-sm text-gray-500">
//                       Données réelles • {new Date().toLocaleTimeString('fr-FR')}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {projects.map(project => {
//                       const technologies = getTechnologies(project);
//                       const isOwner = (
//                         (project.author_id && user?.id && project.author_id.toString() === user.id.toString()) ||
//                         (project.author_email && user?.email && project.author_email.toLowerCase() === user.email.toLowerCase())
//                       );
                      
//                       return (
//                         <div 
//                           key={project.id} 
//                           className="bg-white dark:bg-[#1C2B3A] rounded-xl shadow-md overflow-hidden flex flex-col cursor-pointer group h-[320px] border border-gray-200 dark:border-gray-700 hover:border-[#E30613] transition-all"
//                           onClick={() => navigate(`/project/${project.id}`)}
//                         >
//                           <div className="p-6 flex-grow">
//                             <div className="flex justify-between items-start mb-4">
//                               <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
//                                 {project.title || 'Sans titre'}
//                               </h2>
//                               <div className="flex flex-col items-end gap-1">
//                                 <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
//                                   {getStatusText(project.status)}
//                                 </span>
//                                 {!isOwner && apiInfo.debug && (
//                                   <span className="text-xs text-gray-500">
//                                     {project.author_name || project.author_email || 'Autre utilisateur'}
//                                   </span>
//                                 )}
//                               </div>
//                             </div>
                            
//                             {project.description && (
//                               <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
//                                 {project.description}
//                               </p>
//                             )}
                            
//                             {technologies.length > 0 && (
//                               <div className="flex flex-wrap gap-2 mt-4">
//                                 {technologies.slice(0, 4).map((tech, index) => (
//                                   <span 
//                                     key={index}
//                                     className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-2.5 py-1 rounded-full"
//                                   >
//                                     {tech.substring(0, 15)}
//                                   </span>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
                          
//                           <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800">
//                             <div className="flex justify-between items-center">
//                               <p className="text-sm text-gray-500 dark:text-gray-400">
//                                 {formatDate(project.created_at)}
//                               </p>
//                               <p className="text-sm text-gray-500 dark:text-gray-400">
//                                 {project.cohort || 'Sans cohorte'}
//                               </p>
//                             </div>
//                             {apiInfo.debug && (
//                               <div className="mt-1 text-xs text-gray-400">
//                                 ID: {project.id} • Auteur: {project.author_id || project.user_id || '?'}
//                               </div>
//                             )}
//                           </div>
                          
//                           <div 
//                             className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1C2B3A]/50 p-4 flex justify-end gap-2"
//                             onClick={e => e.stopPropagation()}
//                           >
//                             <button 
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 navigate(`/project/${project.id}`);
//                               }}
//                               className="size-8 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
//                               title="Voir détails"
//                             >
//                               <span className="material-symbols-outlined">visibility</span>
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

// export default Dashboard;



// // src/pages/Dashboard.jsx - VERSION CORRIGÉE ET OPTIMISÉE
// import React, { useEffect, useState, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import authService from '../services/auth';

// const Dashboard = () => {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const [stats, setStats] = useState({
//     total: 0,
//     approved: 0,
//     rejected: 0,
//     pending: 0,
//     draft: 0
//   });
//   const [apiInfo, setApiInfo] = useState({
//     connected: false,
//     endpoints: [],
//     debug: false
//   });
  
//   const navigate = useNavigate();
//   const isMounted = useRef(true);

//   // Fonction pour récupérer les projets de l'API
//   const fetchProjectsFromAPI = async () => {
//     const endpoints = [
//       '/api/projects/projects/',
//       '/api/projects/',
//       '/api/project/'
//     ];
    
//     for (const endpoint of endpoints) {
//       try {
//         const token = authService.getAccessToken();
//         const headers = {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json'
//         };
        
//         if (token) {
//           headers['Authorization'] = `Bearer ${token}`;
//         }
        
//         const response = await fetch(`http://localhost:8000${endpoint}`, {
//           method: 'GET',
//           headers: headers,
//           signal: AbortSignal.timeout(10000) // 10 secondes timeout
//         });
        
//         if (response.ok) {
//           const data = await response.json();
//           return { data, endpoint };
//         }
//       } catch (err) {
//         continue; // Essayer le prochain endpoint
//       }
//     }
    
//     throw new Error('Impossible de se connecter à l\'API Django');
//   };

//   // Fonction pour récupérer les projets de l'utilisateur spécifique
//   const fetchUserProjects = async () => {
//     const currentUser = authService.getCurrentUser();
//     if (!currentUser || !currentUser.id) return [];
    
//     const userId = currentUser.id;
    
//     // Essayer plusieurs endpoints pour les projets utilisateur
//     const userEndpoints = [
//       `/api/users/${userId}/projects/`,
//       `/api/users/projects/?user_id=${userId}`,
//       `/api/projects/?author=${userId}`,
//       `/api/projects/?user=${userId}`,
//       `/api/projects/?author_id=${userId}`
//     ];
    
//     for (const endpoint of userEndpoints) {
//       try {
//         const token = authService.getAccessToken();
//         const headers = {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json'
//         };
        
//         if (token) {
//           headers['Authorization'] = `Bearer ${token}`;
//         }
        
//         const response = await fetch(`http://localhost:8000${endpoint}`, {
//           method: 'GET',
//           headers: headers,
//           signal: AbortSignal.timeout(5000)
//         });
        
//         if (response.ok) {
//           const data = await response.json();
//           if (data && (Array.isArray(data) || data.results || data.projects)) {
//             return data;
//           }
//         }
//       } catch (err) {
//         continue;
//       }
//     }
    
//     return [];
//   };

//   // Fonction améliorée pour filtrer les projets de l'utilisateur
//   const filterUserProjects = (allProjects, currentUser) => {
//     if (!allProjects || !currentUser || allProjects.length === 0) return [];
    
//     const userId = currentUser.id?.toString();
//     const userEmail = currentUser.email?.toLowerCase().trim();
//     const username = currentUser.username?.toLowerCase().trim();
    
//     return allProjects.filter(project => {
//       if (!project) return false;
      
//       // 1. Vérifier par ID utilisateur direct
//       const projectUserId = project.author_id || project.user_id || project.author?.id;
//       if (projectUserId && userId && projectUserId.toString() === userId) {
//         return true;
//       }
      
//       // 2. Vérifier si l'author est un objet
//       if (project.author && typeof project.author === 'object') {
//         const authorId = project.author.id?.toString();
//         if (authorId && userId && authorId === userId) {
//           return true;
//         }
        
//         const authorEmail = project.author.email?.toLowerCase().trim();
//         if (authorEmail && userEmail && authorEmail === userEmail) {
//           return true;
//         }
        
//         const authorUsername = project.author.username?.toLowerCase().trim();
//         if (authorUsername && username && authorUsername === username) {
//           return true;
//         }
//       }
      
//       // 3. Vérifier par email direct
//       const projectEmail = project.author_email?.toLowerCase().trim();
//       if (projectEmail && userEmail && projectEmail === userEmail) {
//         return true;
//       }
      
//       // 4. Vérifier par username direct
//       const projectUsername = project.author_username?.toLowerCase().trim();
//       if (projectUsername && username && projectUsername === username) {
//         return true;
//       }
      
//       // 5. Pour le mode débogage, tout inclure
//       if (apiInfo.debug) {
//         return true;
//       }
      
//       return false;
//     });
//   };

//   // Fonction pour extraire les projets d'une réponse API
//   const extractProjectsFromResponse = (responseData) => {
//     if (!responseData) return [];
    
//     // Différents formats possibles
//     if (Array.isArray(responseData)) {
//       return responseData;
//     }
    
//     if (responseData.results && Array.isArray(responseData.results)) {
//       return responseData.results;
//     }
    
//     if (responseData.projects && Array.isArray(responseData.projects)) {
//       return responseData.projects;
//     }
    
//     if (responseData.data && Array.isArray(responseData.data)) {
//       return responseData.data;
//     }
    
//     // Chercher un tableau dans l'objet
//     for (const key in responseData) {
//       if (Array.isArray(responseData[key])) {
//         return responseData[key];
//       }
//     }
    
//     return [];
//   };

//   // Fonction principale pour charger les projets
//   const loadProjects = async () => {
//     if (!isMounted.current) return;
    
//     setLoading(true);
//     setError(null);
    
//     try {
//       const currentUser = authService.getCurrentUser();
      
//       if (!currentUser) {
//         navigate('/login');
//         return;
//       }
      
//       setUser(currentUser);
      
//       let allProjects = [];
      
//       // Essayer d'abord de récupérer les projets spécifiques à l'utilisateur
//       const userSpecificData = await fetchUserProjects();
//       const userSpecificProjects = extractProjectsFromResponse(userSpecificData);
      
//       if (userSpecificProjects.length > 0) {
//         allProjects = userSpecificProjects;
//         setApiInfo(prev => ({
//           ...prev,
//           connected: true,
//           endpoints: ['/api/users/{id}/projects/']
//         }));
//       } else {
//         // Fallback: récupérer tous les projets et filtrer
//         const apiResult = await fetchProjectsFromAPI();
//         allProjects = extractProjectsFromResponse(apiResult.data);
        
//         setApiInfo(prev => ({
//           ...prev,
//           connected: true,
//           endpoints: [apiResult.endpoint]
//         }));
//       }
      
//       // Filtrer les projets pour cet utilisateur (sauf en mode debug)
//       let userProjects = allProjects;
//       if (!apiInfo.debug) {
//         userProjects = filterUserProjects(allProjects, currentUser);
//       }
      
//       setProjects(userProjects);
//       calculateStats(userProjects);
      
//       if (userProjects.length === 0 && !apiInfo.debug) {
//         setError(`Aucun projet trouvé pour votre compte (${currentUser.email}).`);
//       }
      
//     } catch (err) {
//       let errorMessage = 'Impossible de charger les projets';
      
//       if (err.message.includes('Impossible de se connecter')) {
//         errorMessage = `
//           Impossible de se connecter à l'API Django.
          
//           Vérifiez que :
//           1. Django tourne sur http://localhost:8000
//           2. Les endpoints API sont correctement configurés
//           3. Vous êtes connecté avec un compte valide
//         `;
//       }
      
//       setError(errorMessage);
//       setApiInfo(prev => ({ ...prev, connected: false }));
      
//     } finally {
//       if (isMounted.current) {
//         setLoading(false);
//       }
//     }
//   };

//   // Calculer les statistiques
//   const calculateStats = (projectList) => {
//     const approvedCount = projectList.filter(p => 
//       ['approved', 'approuvé', 'validé', 'accepté', 'published', 'publié'].includes(p.status?.toLowerCase())
//     ).length;
    
//     const rejectedCount = projectList.filter(p => 
//       ['rejected', 'rejeté', 'refusé'].includes(p.status?.toLowerCase())
//     ).length;
    
//     const pendingCount = projectList.filter(p => 
//       ['pending', 'en attente', 'en_attente', 'review', 'en révision'].includes(p.status?.toLowerCase())
//     ).length;
    
//     const draftCount = projectList.filter(p => 
//       ['draft', 'brouillon'].includes(p.status?.toLowerCase())
//     ).length;
    
//     setStats({
//       total: projectList.length,
//       approved: approvedCount,
//       rejected: rejectedCount,
//       pending: pendingCount,
//       draft: draftCount
//     });
//   };

//   // Helper functions
//   const getStatusColor = (status) => {
//     const s = status?.toLowerCase();
//     if (['approved', 'approuvé', 'validé', 'accepté', 'published', 'publié'].includes(s)) {
//       return 'bg-green-100 text-green-800';
//     }
//     if (['rejected', 'rejeté', 'refusé'].includes(s)) {
//       return 'bg-red-100 text-red-800';
//     }
//     if (['draft', 'brouillon'].includes(s)) {
//       return 'bg-yellow-100 text-yellow-800';
//     }
//     if (['pending', 'en attente', 'review', 'en révision'].includes(s)) {
//       return 'bg-purple-100 text-purple-800';
//     }
//     return 'bg-gray-100 text-gray-800';
//   };

//   const getStatusText = (status) => {
//     const s = status?.toLowerCase();
//     if (['approved', 'approuvé', 'validé', 'accepté', 'published', 'publié'].includes(s)) return 'Approuvé';
//     if (['rejected', 'rejeté', 'refusé'].includes(s)) return 'Rejeté';
//     if (['draft', 'brouillon'].includes(s)) return 'Brouillon';
//     if (['pending', 'en attente', 'review', 'en révision'].includes(s)) return 'En attente';
//     return status || 'Inconnu';
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Date inconnue';
//     try {
//       return new Date(dateString).toLocaleDateString('fr-FR');
//     } catch {
//       return 'Date invalide';
//     }
//   };

//   const getTechnologies = (project) => {
//     if (!project?.technologies) return [];
//     if (Array.isArray(project.technologies)) return project.technologies;
//     if (typeof project.technologies === 'string') {
//       return project.technologies.split(',').map(tech => tech.trim());
//     }
//     return [];
//   };

//   // Initialisation
//   useEffect(() => {
//     isMounted.current = true;
    
//     const currentUser = authService.getCurrentUser();
//     if (!currentUser) {
//       navigate('/login');
//       return;
//     }
    
//     setUser(currentUser);
//     loadProjects();
    
//     return () => {
//       isMounted.current = false;
//     };
//   }, [navigate]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex">
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
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary bg-[#003265]"
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
//                 onClick={() => {
//                   authService.logout();
//                   navigate('/quicklogin');
//                 }}
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-left"
//               >
//                 <span className="material-symbols-outlined">logout</span>
//                 <p className="text-sm font-medium">Déconnexion</p>
//               </button>
//             </div>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-6 lg:p-8 overflow-auto">
//           <div className="max-w-7xl mx-auto">
            
//             {/* Header */}
//             <div className="mb-8">
//               <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
//                 <div className="flex-1">
//                   <h1 className="text-2xl lg:text-3xl font-bold text-[#001F3F] mb-2">
//                     Tableau de Bord
//                   </h1>
//                   <div className="space-y-2">
//                     <p className="text-gray-700">
//                       Bienvenue, {user?.first_name || user?.username || user?.email || 'Utilisateur'} !
//                     </p>
//                     <div className="flex flex-wrap gap-2">
//                       <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${apiInfo.connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                         {apiInfo.connected ? '✅ API Connectée' : '❌ API Déconnectée'}
//                       </span>
//                       <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
//                         📊 {stats.total} projet{stats.total !== 1 ? 's' : ''}
//                       </span>
//                       {apiInfo.debug && (
//                         <span className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
//                           Mode débogage
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Profil utilisateur */}
//                 <div className="flex items-center gap-3">
//                   <div 
//                     className="size-12 rounded-full border-2 border-[#E30613] bg-cover bg-center"
//                     style={{ 
//                       backgroundImage: `url(${user?.avatar || "https://via.placeholder.com/150"})` 
//                     }}
//                   ></div>
//                   <div className="flex flex-col text-right">
//                     <h2 className="text-[#001F3F] text-base font-medium">
//                       {user?.first_name || user?.username || 'Utilisateur'}
//                     </h2>
//                     <p className="text-gray-500 text-sm">
//                       {user?.cohort || 'Stagiaire Simplon'}
//                     </p>
//                     <p className="text-gray-500 text-xs">
//                       ID: {user?.id}
//                     </p>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Messages d'erreur */}
//               {error && (
//                 <div className="mt-6">
//                   <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-300">
//                     <div className="flex items-start gap-3">
//                       <span className="material-symbols-outlined text-xl mt-0.5 text-red-600">
//                         error
//                       </span>
//                       <div className="flex-1">
//                         <p className="text-sm font-medium text-red-800 whitespace-pre-line">
//                           {error}
//                         </p>
//                         <div className="mt-3 flex gap-2">
//                           <button 
//                             onClick={loadProjects}
//                             className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
//                           >
//                             Réessayer
//                           </button>
//                           <button 
//                             onClick={() => {
//                               setApiInfo(prev => ({ ...prev, debug: !prev.debug }));
//                               loadProjects();
//                             }}
//                             className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
//                           >
//                             {apiInfo.debug ? 'Désactiver débogage' : 'Mode débogage'}
//                           </button>
//                           <Link
//                             to="/upload"
//                             className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
//                           >
//                             Déposer un projet
//                           </Link>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Statistiques */}
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
//               <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
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

//               <div className="bg-white rounded-xl p-4 shadow border border-green-100">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-xs text-gray-600 mb-1">Approuvés</p>
//                     <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
//                   </div>
//                   <span className="material-symbols-outlined text-green-500 text-3xl opacity-80">
//                     check_circle
//                   </span>
//                 </div>
//               </div>

//               <div className="bg-white rounded-xl p-4 shadow border border-red-100">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-xs text-gray-600 mb-1">Rejetés</p>
//                     <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
//                   </div>
//                   <span className="material-symbols-outlined text-red-500 text-3xl opacity-80">
//                     cancel
//                   </span>
//                 </div>
//               </div>

//               <div className="bg-white rounded-xl p-4 shadow border border-purple-100">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-xs text-gray-600 mb-1">En attente</p>
//                     <p className="text-2xl font-bold text-purple-600">{stats.pending}</p>
//                   </div>
//                   <span className="material-symbols-outlined text-purple-500 text-3xl opacity-80">
//                     hourglass_empty
//                   </span>
//                 </div>
//               </div>

//               <div className="bg-white rounded-xl p-4 shadow border border-yellow-100">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-xs text-gray-600 mb-1">Brouillons</p>
//                     <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
//                   </div>
//                   <span className="material-symbols-outlined text-yellow-500 text-3xl opacity-80">
//                     draft
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Action Bar */}
//             <div className="flex justify-between items-center mb-8">
//               <div>
//                 <h2 className="text-xl lg:text-2xl font-bold text-[#001F3F]">
//                   {apiInfo.debug ? 'Tous les projets disponibles' : 'Mes Projets'}
//                 </h2>
//                 <p className="text-gray-600">
//                   {stats.total > 0 
//                     ? `${stats.total} projet${stats.total > 1 ? 's' : ''} trouvé${stats.total > 1 ? 's' : ''}`
//                     : 'Gérez et partagez vos projets de code'}
//                 </p>
//               </div>
              
//               <div className="flex gap-3">
//                 <Link
//                   to="/upload"
//                   className="bg-[#E30613] text-white px-6 py-3 rounded-lg hover:bg-[#E30613]/90 flex items-center gap-2 text-sm font-medium"
//                 >
//                   <span className="material-symbols-outlined">add</span>
//                   Nouveau projet
//                 </Link>
//                 <button
//                   onClick={loadProjects}
//                   disabled={loading}
//                   className="bg-[#001F3F] text-white px-4 py-3 rounded-lg hover:bg-[#003265] flex items-center gap-2 text-sm"
//                 >
//                   {loading ? (
//                     <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
//                   ) : (
//                     <span className="material-symbols-outlined">refresh</span>
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Chargement */}
//             {loading && (
//               <div className="text-center py-12">
//                 <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E30613] border-t-transparent mx-auto mb-4"></div>
//                 <p className="text-gray-600 text-lg font-medium">Chargement de vos projets...</p>
//               </div>
//             )}

//             {/* Aucun projet */}
//             {!loading && projects.length === 0 && !error && (
//               <div className="text-center py-12 bg-white rounded-xl shadow-inner border border-dashed border-gray-300">
//                 <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">
//                   folder_off
//                 </span>
//                 <h3 className="text-xl font-bold text-gray-700 mb-2">
//                   Aucun projet trouvé
//                 </h3>
//                 <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
//                   Vous n'avez pas encore de projet dans votre tableau de bord.
//                 </p>
//                 <div className="flex gap-3 justify-center">
//                   <Link
//                     to="/upload"
//                     className="px-6 py-2.5 bg-[#E30613] text-white rounded-lg hover:bg-[#E30613]/90 font-medium"
//                   >
//                     Créer votre premier projet
//                   </Link>
//                   <button
//                     onClick={() => {
//                       setApiInfo(prev => ({ ...prev, debug: true }));
//                       loadProjects();
//                     }}
//                     className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
//                   >
//                     Voir tous les projets
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Grille de projets */}
//             {!loading && projects.length > 0 && (
//               <div className="mb-8">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {projects.map(project => {
//                     const technologies = getTechnologies(project);
//                     const isOwner = (
//                       (project.author_id && user?.id && project.author_id.toString() === user.id.toString()) ||
//                       (project.author_email && user?.email && project.author_email.toLowerCase() === user.email.toLowerCase())
//                     );
                    
//                     return (
//                       <div 
//                         key={project.id} 
//                         className="group flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:border-[#E30613] hover:shadow-lg"
//                         onClick={() => navigate(`/project/${project.id}`)}
//                       >
//                         {/* Contenu */}
//                         <div className="flex-1 p-5">
//                           <div className="flex justify-between items-start mb-4">
//                             <h3 className="text-lg font-bold text-[#001F3F] line-clamp-2">
//                               {project.title || 'Sans titre'}
//                             </h3>
//                             <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
//                               {getStatusText(project.status)}
//                             </span>
//                           </div>
                          
//                           {project.description && (
//                             <p className="text-gray-600 text-sm line-clamp-2 mb-4">
//                               {project.description}
//                             </p>
//                           )}
                          
//                           {/* Technologies */}
//                           {technologies.length > 0 && (
//                             <div className="mb-4">
//                               <div className="flex flex-wrap gap-1">
//                                 {technologies.slice(0, 3).map((tech, index) => (
//                                   <span 
//                                     key={index}
//                                     className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200"
//                                   >
//                                     {tech.length > 15 ? tech.substring(0, 15) + '...' : tech}
//                                   </span>
//                                 ))}
//                                 {technologies.length > 3 && (
//                                   <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
//                                     +{technologies.length - 3}
//                                   </span>
//                                 )}
//                               </div>
//                             </div>
//                           )}
                          
//                           {/* Infos */}
//                           <div className="mt-4 text-sm text-gray-500">
//                             <div className="flex justify-between">
//                               <span>{formatDate(project.created_at)}</span>
//                               <span>{project.cohort || 'Sans cohorte'}</span>
//                             </div>
//                             {!isOwner && apiInfo.debug && (
//                               <div className="mt-2 text-xs">
//                                 Par: {project.author_name || project.author_email || 'Autre utilisateur'}
//                               </div>
//                             )}
//                           </div>
//                         </div>
                        
//                         {/* Actions */}
//                         <div className="px-5 pb-5 pt-0">
//                           <div className="flex items-center justify-between">
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 navigate(`/upload?edit=${project.id}`);
//                               }}
//                               className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50"
//                             >
//                               Modifier
//                             </button>
                            
//                             <div className="flex gap-1">
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   navigate(`/project/${project.id}`);
//                                 }}
//                                 className="p-2 bg-[#001F3F] text-white rounded hover:bg-[#003265]"
//                                 title="Voir détails"
//                               >
//                                 <span className="material-symbols-outlined text-sm">visibility</span>
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



// src/pages/Dashboard.jsx - VERSION AVEC TÉLÉCHARGEMENT ZIP
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
    draft: 0
  });
  const [apiInfo, setApiInfo] = useState({
    connected: false,
    endpoints: [],
    debug: false
  });
  const [downloading, setDownloading] = useState({});
  
  const navigate = useNavigate();
  const isMounted = useRef(true);

  // Fonction pour récupérer les projets de l'API
  const fetchProjectsFromAPI = async () => {
    const endpoints = [
      '/api/projects/projects/',
      '/api/projects/',
      '/api/project/'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const token = authService.getAccessToken();
        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`http://localhost:8000${endpoint}`, {
          method: 'GET',
          headers: headers,
          signal: AbortSignal.timeout(10000)
        });
        
        if (response.ok) {
          const data = await response.json();
          return { data, endpoint };
        }
      } catch (err) {
        continue;
      }
    }
    
    throw new Error('Impossible de se connecter à l\'API Django');
  };

  // Fonction pour récupérer les projets de l'utilisateur spécifique
  const fetchUserProjects = async () => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || !currentUser.id) return [];
    
    const userId = currentUser.id;
    
    const userEndpoints = [
      `/api/users/${userId}/projects/`,
      `/api/users/projects/?user_id=${userId}`,
      `/api/projects/?author=${userId}`,
      `/api/projects/?user=${userId}`,
      `/api/projects/?author_id=${userId}`
    ];
    
    for (const endpoint of userEndpoints) {
      try {
        const token = authService.getAccessToken();
        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`http://localhost:8000${endpoint}`, {
          method: 'GET',
          headers: headers,
          signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data && (Array.isArray(data) || data.results || data.projects)) {
            return data;
          }
        }
      } catch (err) {
        continue;
      }
    }
    
    return [];
  };

  // Fonction améliorée pour filtrer les projets de l'utilisateur
  const filterUserProjects = (allProjects, currentUser) => {
    if (!allProjects || !currentUser || allProjects.length === 0) return [];
    
    const userId = currentUser.id?.toString();
    const userEmail = currentUser.email?.toLowerCase().trim();
    const username = currentUser.username?.toLowerCase().trim();
    
    return allProjects.filter(project => {
      if (!project) return false;
      
      const projectUserId = project.author_id || project.user_id || project.author?.id;
      if (projectUserId && userId && projectUserId.toString() === userId) {
        return true;
      }
      
      if (project.author && typeof project.author === 'object') {
        const authorId = project.author.id?.toString();
        if (authorId && userId && authorId === userId) {
          return true;
        }
        
        const authorEmail = project.author.email?.toLowerCase().trim();
        if (authorEmail && userEmail && authorEmail === userEmail) {
          return true;
        }
        
        const authorUsername = project.author.username?.toLowerCase().trim();
        if (authorUsername && username && authorUsername === username) {
          return true;
        }
      }
      
      const projectEmail = project.author_email?.toLowerCase().trim();
      if (projectEmail && userEmail && projectEmail === userEmail) {
        return true;
      }
      
      const projectUsername = project.author_username?.toLowerCase().trim();
      if (projectUsername && username && projectUsername === username) {
        return true;
      }
      
      if (apiInfo.debug) {
        return true;
      }
      
      return false;
    });
  };

  // Fonction pour extraire les projets d'une réponse API
  const extractProjectsFromResponse = (responseData) => {
    if (!responseData) return [];
    
    if (Array.isArray(responseData)) {
      return responseData;
    }
    
    if (responseData.results && Array.isArray(responseData.results)) {
      return responseData.results;
    }
    
    if (responseData.projects && Array.isArray(responseData.projects)) {
      return responseData.projects;
    }
    
    if (responseData.data && Array.isArray(responseData.data)) {
      return responseData.data;
    }
    
    for (const key in responseData) {
      if (Array.isArray(responseData[key])) {
        return responseData[key];
      }
    }
    
    return [];
  };

  // Fonction pour télécharger le projet en ZIP
  const handleDownloadZip = async (project, e) => {
    if (e) {
      e.stopPropagation();
    }
    
    setDownloading(prev => ({ ...prev, [project.id]: true }));
    
    try {
      // Vérifier si le projet a un champ zip_file
      let zipFileUrl = project.zip_file;
      
      if (!zipFileUrl) {
        // Essayer de récupérer le fichier depuis l'API
        const endpoints = [
          `/api/projects/${project.id}/`,
          `/api/project/${project.id}/`,
          `/api/projects/projects/${project.id}/`
        ];
        
        let projectDetails = null;
        
        for (const endpoint of endpoints) {
          try {
            const token = authService.getAccessToken();
            const headers = {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            };
            
            if (token) {
              headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(`http://localhost:8000${endpoint}`, {
              method: 'GET',
              headers: headers,
              signal: AbortSignal.timeout(5000)
            });
            
            if (response.ok) {
              const data = await response.json();
              projectDetails = data;
              
              // Extraire l'URL du fichier ZIP
              if (data.zip_file) {
                zipFileUrl = data.zip_file;
                break;
              }
            }
          } catch (err) {
            continue;
          }
        }
        
        // Si toujours pas de fichier ZIP, essayer les champs communs
        if (!zipFileUrl && projectDetails) {
          const possibleFields = ['file', 'zip_url', 'download_url', 'archive_url', 'project_file'];
          for (const field of possibleFields) {
            if (projectDetails[field]) {
              zipFileUrl = projectDetails[field];
              break;
            }
          }
        }
      }
      
      // Si on a une URL, télécharger le fichier
      if (zipFileUrl) {
        // Normaliser l'URL
        let finalUrl = zipFileUrl;
        if (!zipFileUrl.startsWith('http')) {
          if (zipFileUrl.startsWith('/media/') || zipFileUrl.startsWith('/static/')) {
            finalUrl = `http://localhost:8000${zipFileUrl}`;
          } else {
            finalUrl = `http://localhost:8000/media/${zipFileUrl}`;
          }
        }
        
        // Créer un élément d'ancre pour le téléchargement
        const link = document.createElement('a');
        link.href = finalUrl;
        link.download = `${project.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.zip`;
        link.target = '_blank';
        
        // Ajouter un gestionnaire d'événement pour nettoyer après le téléchargement
        link.onload = () => {
          setTimeout(() => {
            setDownloading(prev => ({ ...prev, [project.id]: false }));
          }, 1000);
        };
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Afficher un message de succès
        setTimeout(() => {
          alert(`Téléchargement du projet "${project.title}" commencé !`);
          setDownloading(prev => ({ ...prev, [project.id]: false }));
        }, 500);
        
      } else {
        // Aucun fichier ZIP trouvé
        alert(`Aucun fichier ZIP disponible pour le projet "${project.title}".\n\nVérifiez que :\n1. Le projet a été déposé avec un fichier ZIP\n2. Le fichier existe sur le serveur\n3. Vous avez les permissions nécessaires`);
        setDownloading(prev => ({ ...prev, [project.id]: false }));
      }
      
    } catch (err) {
      console.error('Erreur lors du téléchargement:', err);
      alert(`Erreur lors du téléchargement: ${err.message}`);
      setDownloading(prev => ({ ...prev, [project.id]: false }));
    }
  };

  // Fonction principale pour charger les projets
  const loadProjects = async () => {
    if (!isMounted.current) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      setUser(currentUser);
      
      let allProjects = [];
      
      const userSpecificData = await fetchUserProjects();
      const userSpecificProjects = extractProjectsFromResponse(userSpecificData);
      
      if (userSpecificProjects.length > 0) {
        allProjects = userSpecificProjects;
        setApiInfo(prev => ({
          ...prev,
          connected: true,
          endpoints: ['/api/users/{id}/projects/']
        }));
      } else {
        const apiResult = await fetchProjectsFromAPI();
        allProjects = extractProjectsFromResponse(apiResult.data);
        
        setApiInfo(prev => ({
          ...prev,
          connected: true,
          endpoints: [apiResult.endpoint]
        }));
      }
      
      let userProjects = allProjects;
      if (!apiInfo.debug) {
        userProjects = filterUserProjects(allProjects, currentUser);
      }
      
      setProjects(userProjects);
      calculateStats(userProjects);
      
      if (userProjects.length === 0 && !apiInfo.debug) {
        setError(`Aucun projet trouvé pour votre compte (${currentUser.email}).`);
      }
      
    } catch (err) {
      let errorMessage = 'Impossible de charger les projets';
      
      if (err.message.includes('Impossible de se connecter')) {
        errorMessage = `
          Impossible de se connecter à l'API Django.
          
          Vérifiez que :
          1. Django tourne sur http://localhost:8000
          2. Les endpoints API sont correctement configurés
          3. Vous êtes connecté avec un compte valide
        `;
      }
      
      setError(errorMessage);
      setApiInfo(prev => ({ ...prev, connected: false }));
      
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  // Calculer les statistiques
  const calculateStats = (projectList) => {
    const approvedCount = projectList.filter(p => 
      ['approved', 'approuvé', 'validé', 'accepté', 'published', 'publié'].includes(p.status?.toLowerCase())
    ).length;
    
    const rejectedCount = projectList.filter(p => 
      ['rejected', 'rejeté', 'refusé'].includes(p.status?.toLowerCase())
    ).length;
    
    const pendingCount = projectList.filter(p => 
      ['pending', 'en attente', 'en_attente', 'review', 'en révision'].includes(p.status?.toLowerCase())
    ).length;
    
    const draftCount = projectList.filter(p => 
      ['draft', 'brouillon'].includes(p.status?.toLowerCase())
    ).length;
    
    setStats({
      total: projectList.length,
      approved: approvedCount,
      rejected: rejectedCount,
      pending: pendingCount,
      draft: draftCount
    });
  };

  // Helper functions
  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (['approved', 'approuvé', 'validé', 'accepté', 'published', 'publié'].includes(s)) {
      return 'bg-green-100 text-green-800';
    }
    if (['rejected', 'rejeté', 'refusé'].includes(s)) {
      return 'bg-red-100 text-red-800';
    }
    if (['draft', 'brouillon'].includes(s)) {
      return 'bg-yellow-100 text-yellow-800';
    }
    if (['pending', 'en attente', 'review', 'en révision'].includes(s)) {
      return 'bg-purple-100 text-purple-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const s = status?.toLowerCase();
    if (['approved', 'approuvé', 'validé', 'accepté', 'published', 'publié'].includes(s)) return 'Approuvé';
    if (['rejected', 'rejeté', 'refusé'].includes(s)) return 'Rejeté';
    if (['draft', 'brouillon'].includes(s)) return 'Brouillon';
    if (['pending', 'en attente', 'review', 'en révision'].includes(s)) return 'En attente';
    return status || 'Inconnu';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch {
      return 'Date invalide';
    }
  };

  const getTechnologies = (project) => {
    if (!project?.technologies) return [];
    if (Array.isArray(project.technologies)) return project.technologies;
    if (typeof project.technologies === 'string') {
      return project.technologies.split(',').map(tech => tech.trim());
    }
    return [];
  };

  // Initialisation
  useEffect(() => {
    isMounted.current = true;
    
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    setUser(currentUser);
    loadProjects();
    
    return () => {
      isMounted.current = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
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
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary bg-[#003265]"
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
                onClick={() => {
                  authService.logout();
                  navigate('/quicklogin');
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-left"
              >
                <span className="material-symbols-outlined">logout</span>
                <p className="text-sm font-medium">Déconnexion</p>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold text-[#001F3F] mb-2">
                    Tableau de Bord
                  </h1>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      Bienvenue, {user?.first_name || user?.username || user?.email || 'Utilisateur'} !
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${apiInfo.connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {apiInfo.connected ? '✅ API Connectée' : '❌ API Déconnectée'}
                      </span>
                      <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        📊 {stats.total} projet{stats.total !== 1 ? 's' : ''}
                      </span>
                      {apiInfo.debug && (
                        <span className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          Mode débogage
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Profil utilisateur */}
                <div className="flex items-center gap-3">
                  <div 
                    className="size-12 rounded-full border-2 border-[#E30613] bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url(${user?.avatar || "https://via.placeholder.com/150"})` 
                    }}
                  ></div>
                  <div className="flex flex-col text-right">
                    <h2 className="text-[#001F3F] text-base font-medium">
                      {user?.first_name || user?.username || 'Utilisateur'}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {user?.cohort || 'Stagiaire Simplon'}
                    </p>
                    <p className="text-gray-500 text-xs">
                      ID: {user?.id}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Messages d'erreur */}
              {error && (
                <div className="mt-6">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-300">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-xl mt-0.5 text-red-600">
                        error
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-800 whitespace-pre-line">
                          {error}
                        </p>
                        <div className="mt-3 flex gap-2">
                          <button 
                            onClick={loadProjects}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                          >
                            Réessayer
                          </button>
                          <button 
                            onClick={() => {
                              setApiInfo(prev => ({ ...prev, debug: !prev.debug }));
                              loadProjects();
                            }}
                            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
                          >
                            {apiInfo.debug ? 'Désactiver débogage' : 'Mode débogage'}
                          </button>
                          <Link
                            to="/upload"
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                          >
                            Déposer un projet
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
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

              <div className="bg-white rounded-xl p-4 shadow border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Approuvés</p>
                    <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                  </div>
                  <span className="material-symbols-outlined text-green-500 text-3xl opacity-80">
                    check_circle
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow border border-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Rejetés</p>
                    <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                  </div>
                  <span className="material-symbols-outlined text-red-500 text-3xl opacity-80">
                    cancel
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">En attente</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.pending}</p>
                  </div>
                  <span className="material-symbols-outlined text-purple-500 text-3xl opacity-80">
                    hourglass_empty
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow border border-yellow-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Brouillons</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
                  </div>
                  <span className="material-symbols-outlined text-yellow-500 text-3xl opacity-80">
                    draft
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-[#001F3F]">
                  {apiInfo.debug ? 'Tous les projets disponibles' : 'Mes Projets'}
                </h2>
                <p className="text-gray-600">
                  {stats.total > 0 
                    ? `${stats.total} projet${stats.total > 1 ? 's' : ''} trouvé${stats.total > 1 ? 's' : ''}`
                    : 'Gérez et partagez vos projets de code'}
                </p>
              </div>
              
              <div className="flex gap-3">
                <Link
                  to="/upload"
                  className="bg-[#E30613] text-white px-6 py-3 rounded-lg hover:bg-[#E30613]/90 flex items-center gap-2 text-sm font-medium"
                >
                  <span className="material-symbols-outlined">add</span>
                  Nouveau projet
                </Link>
                <button
                  onClick={loadProjects}
                  disabled={loading}
                  className="bg-[#001F3F] text-white px-4 py-3 rounded-lg hover:bg-[#003265] flex items-center gap-2 text-sm"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <span className="material-symbols-outlined">refresh</span>
                  )}
                </button>
              </div>
            </div>

            {/* Chargement */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E30613] border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg font-medium">Chargement de vos projets...</p>
              </div>
            )}

            {/* Aucun projet */}
            {!loading && projects.length === 0 && !error && (
              <div className="text-center py-12 bg-white rounded-xl shadow-inner border border-dashed border-gray-300">
                <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">
                  folder_off
                </span>
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  Aucun projet trouvé
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
                  Vous n'avez pas encore de projet dans votre tableau de bord.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link
                    to="/upload"
                    className="px-6 py-2.5 bg-[#E30613] text-white rounded-lg hover:bg-[#E30613]/90 font-medium"
                  >
                    Créer votre premier projet
                  </Link>
                  <button
                    onClick={() => {
                      setApiInfo(prev => ({ ...prev, debug: true }));
                      loadProjects();
                    }}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Voir tous les projets
                  </button>
                </div>
              </div>
            )}

            {/* Grille de projets */}
            {!loading && projects.length > 0 && (
              <div className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map(project => {
                    const technologies = getTechnologies(project);
                    const isOwner = (
                      (project.author_id && user?.id && project.author_id.toString() === user.id.toString()) ||
                      (project.author_email && user?.email && project.author_email.toLowerCase() === user.email.toLowerCase())
                    );
                    
                    return (
                      <div 
                        key={project.id} 
                        className="group flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:border-[#E30613] hover:shadow-lg"
                        onClick={() => navigate(`/project/${project.id}`)}
                      >
                        {/* Contenu */}
                        <div className="flex-1 p-5">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-[#001F3F] line-clamp-2">
                              {project.title || 'Sans titre'}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                              {getStatusText(project.status)}
                            </span>
                          </div>
                          
                          {project.description && (
                            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                              {project.description}
                            </p>
                          )}
                          
                          {/* Technologies */}
                          {technologies.length > 0 && (
                            <div className="mb-4">
                              <div className="flex flex-wrap gap-1">
                                {technologies.slice(0, 3).map((tech, index) => (
                                  <span 
                                    key={index}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200"
                                  >
                                    {tech.length > 15 ? tech.substring(0, 15) + '...' : tech}
                                  </span>
                                ))}
                                {technologies.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                                    +{technologies.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Infos */}
                          <div className="mt-4 text-sm text-gray-500">
                            <div className="flex justify-between">
                              <span>{formatDate(project.created_at)}</span>
                              <span>{project.cohort || 'Sans cohorte'}</span>
                            </div>
                            {!isOwner && apiInfo.debug && (
                              <div className="mt-2 text-xs">
                                Par: {project.author_name || project.author_email || 'Autre utilisateur'}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="px-5 pb-5 pt-0">
                          <div className="flex items-center justify-between">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/upload?edit=${project.id}`);
                              }}
                              className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50"
                            >
                              Modifier
                            </button>
                            
                            <div className="flex gap-1">
                              {/* Bouton Télécharger ZIP */}
                              <button
                                onClick={(e) => handleDownloadZip(project, e)}
                                disabled={downloading[project.id]}
                                className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                title="Télécharger le projet en ZIP"
                              >
                                <span className="material-symbols-outlined text-sm">
                                  {downloading[project.id] ? 'downloading' : 'download'}
                                </span>
                              </button>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/project/${project.id}`);
                                }}
                                className="p-2 bg-[#001F3F] text-white rounded hover:bg-[#003265]"
                                title="Voir détails"
                              >
                                <span className="material-symbols-outlined text-sm">visibility</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section d'information sur les téléchargements */}
            {projects.length > 0 && (
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-blue-600 mt-0.5">info</span>
                  <div>
                    <h3 className="text-blue-800 font-medium mb-1">📦 Téléchargement des projets</h3>
                    <p className="text-blue-700 text-sm">
                      Cliquez sur l'icône <span className="material-symbols-outlined align-middle text-sm">download</span> 
                      pour télécharger le fichier ZIP de votre projet.
                    </p>
                    <p className="text-blue-700 text-xs mt-2">
                      <strong>Note :</strong> Le téléchargement peut prendre quelques secondes selon la taille du fichier.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;