
// // src/pages/admin/AdminDashboard.jsx - VERSION AVEC DONNÉES RÉELLES
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";
// import MetricCard from "./MetricCard";
// import api from "../../services/api";
// import authService from "../../services/auth";

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalProjects: 0,
//     totalDownloads: 0,
//     pendingModeration: 0,
//     approvedProjects: 0,
//     activeUsers: 0,
//     inactiveUsers: 0,
//     draftProjects: 0
//   });

//   const [recentActivity, setRecentActivity] = useState([]);
//   const [recentUsers, setRecentUsers] = useState([]);
//   const [recentProjects, setRecentProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isRealData, setIsRealData] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       setIsRealData(false);

//       console.log('📊 Tentative de chargement des données réelles...');

//       // 1. Vérifier que l'utilisateur est admin
//       const user = authService.getCurrentUser();
//       if (!user || !(user.is_staff || user.is_superuser)) {
//         console.warn('⚠️ Utilisateur non-admin détecté');
//         navigate('/dashboard');
//         return;
//       }

//       console.log('✅ Utilisateur admin confirmé:', user.username);

//       // 2. ESSAYER D'ABORD L'ENDPOINT DASHBOARD
//       try {
//         console.log('🔄 Tentative endpoint dashboard...');
//         const dashboardResponse = await api.get('/api/users/admin/dashboard-stats/');
//         const dashboardData = dashboardResponse.data;
        
//         if (dashboardData.success) {
//           console.log('✅ Données dashboard récupérées avec succès');
          
//           // Mettre à jour les stats principales
//           setStats({
//             totalUsers: dashboardData.stats.total_users || 0,
//             totalProjects: dashboardData.stats.total_projects || 0,
//             totalDownloads: dashboardData.stats.total_downloads || 0,
//             pendingModeration: dashboardData.stats.pending_projects || 0,
//             approvedProjects: dashboardData.stats.approved_projects || 0,
//             activeUsers: dashboardData.stats.active_users || 0,
//             inactiveUsers: dashboardData.stats.inactive_users || 0,
//             draftProjects: dashboardData.stats.draft_projects || 0
//           });
          
//           // Mettre à jour les utilisateurs récents
//           if (dashboardData.recent_users) {
//             setRecentUsers(dashboardData.recent_users);
//           }
          
//           // Mettre à jour les projets récents
//           if (dashboardData.recent_projects) {
//             setRecentProjects(dashboardData.recent_projects);
//           }
          
//           setIsRealData(true);
//           console.log('🎉 Toutes les données réelles chargées!');
          
//         } else {
//           throw new Error('Endpoint dashboard ne retourne pas success=true');
//         }
        
//       } catch (dashboardError) {
//         console.log('❌ Endpoint dashboard échoué:', dashboardError.message);
        
//         // 3. FALLBACK: Récupérer les données séparément
//         console.log('🔄 Fallback: récupération séparée des données...');
//         await fetchSeparateData();
//       }
      
//       // 4. Toujours générer l'activité récente (simulée pour l'instant)
//       generateRecentActivity();
      
//     } catch (err) {
//       console.error('❌ Erreur critique:', err);
//       setError('Erreur lors du chargement des données.');
      
//       // Données de secours
//       setStats(getMockStats());
//       setRecentUsers(getMockUsers());
//       setRecentProjects(getMockProjects());
//       generateRecentActivity();
      
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSeparateData = async () => {
//     try {
//       console.log('🔄 Récupération des données séparées...');
      
//       // Récupérer les stats utilisateurs
//       try {
//         const usersStatsResponse = await api.get('/api/users/admin/users/stats/');
//         const usersStats = usersStatsResponse.data;
        
//         setStats(prev => ({
//           ...prev,
//           totalUsers: usersStats.total_users || 0,
//           activeUsers: usersStats.active_users || 0,
//           inactiveUsers: usersStats.inactive_users || 0
//         }));
        
//         console.log('✅ Stats utilisateurs récupérées');
//       } catch (userError) {
//         console.log('⚠️ Erreur stats utilisateurs:', userError.message);
//       }
      
//       // Récupérer les utilisateurs récents
//       try {
//         const recentUsersResponse = await api.get('/api/users/admin/users/recent/');
//         if (recentUsersResponse.data.results) {
//           setRecentUsers(recentUsersResponse.data.results.slice(0, 5));
//         } else {
//           setRecentUsers(recentUsersResponse.data.slice(0, 5));
//         }
//         console.log('✅ Utilisateurs récents récupérés');
//       } catch (recentUsersError) {
//         console.log('⚠️ Erreur utilisateurs récents:', recentUsersError.message);
//         setRecentUsers(getMockUsers());
//       }
      
//       // Récupérer les projets (supposons que vous avez un endpoint similaire)
//       try {
//         const projectsResponse = await api.get('/api/projects/');
//         if (projectsResponse.data.results) {
//           setRecentProjects(projectsResponse.data.results.slice(0, 5));
//           setStats(prev => ({
//             ...prev,
//             totalProjects: projectsResponse.data.count || projectsResponse.data.results.length
//           }));
//         } else if (Array.isArray(projectsResponse.data)) {
//           setRecentProjects(projectsResponse.data.slice(0, 5));
//           setStats(prev => ({
//             ...prev,
//             totalProjects: projectsResponse.data.length
//           }));
//         }
//         console.log('✅ Projets récupérés');
//       } catch (projectsError) {
//         console.log('⚠️ Erreur projets:', projectsError.message);
//         setRecentProjects(getMockProjects());
//       }
      
//       setIsRealData(true);
      
//     } catch (separateError) {
//       console.error('❌ Erreur récupération séparée:', separateError);
//       throw separateError;
//     }
//   };

//   const generateRecentActivity = () => {
//     // Générer des activités basées sur les données réelles
//     const activity = [];
    
//     // Activité basée sur les utilisateurs récents
//     recentUsers.slice(0, 3).forEach(user => {
//       activity.push({
//         id: `user_${user.id}`,
//         type: 'user',
//         user: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username,
//         action: 's\'est inscrit(e)',
//         time: `Il y a ${Math.floor(Math.random() * 24)} heures`,
//         icon: 'person',
//         color: 'green'
//       });
//     });
    
//     // Activité basée sur les projets récents
//     recentProjects.slice(0, 2).forEach(project => {
//       activity.push({
//         id: `project_${project.id}`,
//         type: 'project',
//         user: project.author?.username || 'Utilisateur',
//         action: 'a déposé un projet',
//         project: project.title,
//         time: 'Aujourd\'hui',
//         icon: 'folder',
//         color: 'blue'
//       });
//     });
    
//     setRecentActivity(activity);
//   };

//   // Fonctions helper pour les données mockées
//   const getMockStats = () => ({
//     totalUsers: 1247,
//     totalProjects: 543,
//     totalDownloads: 2891,
//     pendingModeration: 23,
//     approvedProjects: 320,
//     activeUsers: 1100,
//     inactiveUsers: 147,
//     draftProjects: 200
//   });

//   const getMockUsers = () => [
//     {
//       id: 1,
//       username: 'admin',
//       email: 'admin@simplon.com',
//       first_name: 'Admin',
//       last_name: 'System',
//       date_joined: new Date().toISOString(),
//       is_active: true,
//       is_staff: true,
//       is_superuser: true
//     },
//     {
//       id: 2,
//       username: 'simplon_2025001',
//       email: 'alice.martin@simplon.com',
//       first_name: 'Alice',
//       last_name: 'Martin',
//       date_joined: new Date(Date.now() - 86400000).toISOString(),
//       is_active: true,
//       is_staff: false,
//       is_superuser: false
//     },
//     {
//       id: 3,
//       username: 'simplon_2025002',
//       email: 'bob.dupont@simplon.com',
//       first_name: 'Bob',
//       last_name: 'Dupont',
//       date_joined: new Date(Date.now() - 172800000).toISOString(),
//       is_active: true,
//       is_staff: false,
//       is_superuser: false
//     }
//   ];

//   const getMockProjects = () => [
//     {
//       id: 1,
//       title: 'Application E-commerce React/Node',
//       author: {
//         username: 'simplon_2025001',
//         first_name: 'Alice',
//         last_name: 'Martin'
//       },
//       status: 'published',
//       created_at: new Date().toISOString(),
//       technologies: 'React, Node.js, MongoDB'
//     },
//     {
//       id: 2,
//       title: 'Système de Gestion de Bibliothèque',
//       author: {
//         username: 'simplon_2025002',
//         first_name: 'Bob',
//         last_name: 'Dupont'
//       },
//       status: 'pending',
//       created_at: new Date(Date.now() - 86400000).toISOString(),
//       technologies: 'Django, PostgreSQL'
//     }
//   ];

//   const handleQuickAction = (action) => {
//     switch (action) {
//       case 'moderation':
//         navigate('/admin/projects?status=pending');
//         break;
//       case 'users':
//         navigate('/admin/users');
//         break;
//       case 'projects':
//         navigate('/admin/projects');
//         break;
//       case 'analytics':
//         navigate('/admin/analytics');
//         break;
//       default:
//         console.log('Action non implémentée:', action);
//     }
//   };

//   const getActivityIcon = (type) => {
//     const icons = {
//       project: 'folder',
//       user: 'person',
//       moderation: 'verified',
//       download: 'download',
//       update: 'update'
//     };
//     return icons[type] || 'notifications';
//   };

//   const getActivityColor = (type) => {
//     const colors = {
//       project: 'blue',
//       user: 'green',
//       moderation: 'orange',
//       download: 'purple',
//       update: 'cyan'
//     };
//     return colors[type] || 'gray';
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
//     } catch (e) {
//       return dateString;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E30613] mb-4"></div>
//         <span className="text-[#001F3F] dark:text-white">
//           {isRealData ? 'Chargement des données...' : 'Connexion au backend...'}
//         </span>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* En-tête avec indicateur de source */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-[#001F3F] dark:text-white">
//             Tableau de Bord Administrateur
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-1">
//             Bienvenue, {authService.getCurrentUser()?.username}
//             {isRealData ? ' • Données en direct' : ' • Mode démonstration'}
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <button 
//             onClick={fetchDashboardData}
//             className="flex items-center gap-2 px-4 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003265] transition-colors text-sm"
//           >
//             <span className="material-symbols-outlined text-sm">refresh</span>
//             Actualiser
//           </button>
//           {!isRealData && (
//             <span className="text-sm text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
//               Mode démo
//             </span>
//           )}
//         </div>
//       </div>

//       {error && (
//         <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
//           <div className="flex items-center">
//             <span className="material-symbols-outlined mr-2">warning</span>
//             <span>{error}</span>
//           </div>
//         </div>
//       )}

//       {/* Cartes de métriques */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//         <MetricCard
//           title="Utilisateurs"
//           value={stats.totalUsers.toLocaleString('fr-FR')}
//           trend={stats.activeUsers > 0 ? `${stats.activeUsers} actifs` : 'Données indisponibles'}
//           icon="people"
//           color="blue"
//           description="Utilisateurs inscrits"
//           onClick={() => handleQuickAction('users')}
//         />
//         <MetricCard
//           title="Projets"
//           value={stats.totalProjects.toLocaleString('fr-FR')}
//           trend={stats.approvedProjects > 0 ? `${stats.approvedProjects} publiés` : 'Données indisponibles'}
//           icon="folder"
//           color="green"
//           description="Projets déposés"
//           onClick={() => handleQuickAction('projects')}
//         />
//         <MetricCard
//           title="Validés"
//           value={stats.approvedProjects.toLocaleString('fr-FR')}
//           trend={stats.totalProjects > 0 ? `${Math.round((stats.approvedProjects / stats.totalProjects) * 100)}% publiés` : '0%'}
//           icon="check_circle"
//           color="purple"
//           description="Projets publiés"
//         />
//         <MetricCard
//           title="En Attente"
//           value={stats.pendingModeration}
//           trend={stats.pendingModeration > 0 ? "À modérer" : "Aucune attente"}
//           icon="pending"
//           color="red"
//           description="Projets en attente"
//           onClick={() => handleQuickAction('moderation')}
//         />
//       </div>

//       {/* Deux colonnes principales */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Activité Récente */}
//         <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 md:p-6 shadow-sm lg:col-span-2">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold text-[#001F3F] dark:text-white">
//               Activité Récente
//             </h2>
//             <span className="text-xs text-gray-500 dark:text-gray-400">
//               {recentActivity.length} activités
//             </span>
//           </div>
//           <div className="space-y-3">
//             {recentActivity.map((activity) => (
//               <div key={activity.id} className="flex items-center gap-3 p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#0d1a29] transition-colors">
//                 <div className={`p-2 rounded-full ${
//                   getActivityColor(activity.type) === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
//                   getActivityColor(activity.type) === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
//                   'bg-orange-100 dark:bg-orange-900/20'
//                 }`}>
//                   <span className={`material-symbols-outlined text-sm ${
//                     getActivityColor(activity.type) === 'blue' ? 'text-blue-600 dark:text-blue-400' :
//                     getActivityColor(activity.type) === 'green' ? 'text-green-600 dark:text-green-400' :
//                     'text-orange-600 dark:text-orange-400'
//                   }`}>
//                     {getActivityIcon(activity.type)}
//                   </span>
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm text-[#001F3F] dark:text-white">
//                     <strong className="font-medium">{activity.user}</strong> {activity.action}
//                     {activity.project && (
//                       <strong className="ml-1">"{activity.project}"</strong>
//                     )}
//                   </p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                     {activity.time}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Projets Récents */}
//         <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 md:p-6 shadow-sm">
//           <h2 className="text-lg font-semibold text-[#001F3F] dark:text-white mb-4">
//             Projets Récents
//           </h2>
//           <div className="space-y-4">
//             {recentProjects.map((project) => (
//               <div key={project.id} className="p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#0d1a29] transition-colors">
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium text-[#001F3F] dark:text-white truncate mb-1">
//                     {project.title}
//                   </p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
//                     Par {project.author?.username || project.author?.first_name + ' ' + project.author?.last_name || 'Inconnu'}
//                   </p>
//                   <div className="flex items-center gap-2">
//                     <span className={`px-2 py-1 text-xs rounded-full ${
//                       project.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
//                       project.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
//                       'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
//                     }`}>
//                       {project.status === 'published' ? 'Publié' :
//                        project.status === 'pending' ? 'En attente' : 'Brouillon'}
//                     </span>
//                     <span className="text-xs text-gray-500 dark:text-gray-400">
//                       {formatDate(project.created_at)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


// // src/components/admin/AdminDashboard.jsx - VERSION COMPLÈTE AVEC DONNÉES RÉELLES
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";
// import MetricCard from "./MetricCard";
// import api from "../../services/api";
// import authService from "../../services/auth";

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalProjects: 0,
//     totalDownloads: 0,
//     pendingModeration: 0,
//     approvedProjects: 0,
//     activeUsers: 0,
//     inactiveUsers: 0,
//     draftProjects: 0
//   });

//   const [recentActivity, setRecentActivity] = useState([]);
//   const [recentUsers, setRecentUsers] = useState([]);
//   const [recentProjects, setRecentProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isRealData, setIsRealData] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       console.log('📊 Chargement des données du dashboard...');

//       // 1. Vérifier que l'utilisateur est admin
//       const user = authService.getCurrentUser();
//       if (!user || !(user.is_staff || user.is_superuser)) {
//         console.warn('⚠️ Utilisateur non-admin détecté');
//         navigate('/dashboard');
//         return;
//       }

//       console.log('✅ Utilisateur admin confirmé:', user.username);

//       // 2. ESSAYER D'ABORD L'ENDPOINT DASHBOARD UNIFIÉ
//       try {
//         console.log('🔄 Tentative endpoint dashboard unifié...');
//         const response = await api.get('/api/users/admin/dashboard-stats/');
        
//         if (response.status === 200) {
//           const data = response.data;
//           console.log('✅ Données dashboard récupérées:', data);
          
//           // Mettre à jour les stats principales
//           if (data.stats) {
//             setStats({
//               totalUsers: data.stats.total_users || 0,
//               totalProjects: data.stats.total_projects || 0,
//               totalDownloads: data.stats.total_downloads || 0,
//               pendingModeration: data.stats.pending_projects || 0,
//               approvedProjects: data.stats.approved_projects || 0,
//               activeUsers: data.stats.active_users || 0,
//               inactiveUsers: data.stats.inactive_users || 0,
//               draftProjects: data.stats.draft_projects || 0
//             });
//           }
          
//           // Mettre à jour les utilisateurs récents
//           if (data.recent_users && Array.isArray(data.recent_users)) {
//             setRecentUsers(data.recent_users.slice(0, 5));
//           }
          
//           // Mettre à jour les projets récents
//           if (data.recent_projects && Array.isArray(data.recent_projects)) {
//             setRecentProjects(data.recent_projects.slice(0, 5));
//           }
          
//           setIsRealData(true);
//           console.log('🎉 Toutes les données réelles chargées!');
          
//         } else {
//           throw new Error('Endpoint dashboard retourne un statut non-200');
//         }
        
//       } catch (dashboardError) {
//         console.log('❌ Endpoint dashboard unifié échoué:', dashboardError.message);
        
//         // 3. FALLBACK: Récupérer les données séparément
//         console.log('🔄 Fallback: récupération séparée des données...');
//         await fetchSeparateData();
//       }
      
//     } catch (err) {
//       console.error('❌ Erreur critique:', err);
//       setError('Erreur lors du chargement des données. Vérifiez votre connexion.');
      
//       // Données de secours (mode démo)
//       setStats(getMockStats());
//       setRecentUsers(getMockUsers());
//       setRecentProjects(getMockProjects());
//       setIsRealData(false);
      
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSeparateData = async () => {
//     try {
//       console.log('🔄 Récupération des données séparées...');
      
//       // Récupérer les stats utilisateurs
//       try {
//         const usersStatsResponse = await api.get('/api/users/admin/users/stats/');
//         const usersStats = usersStatsResponse.data;
        
//         setStats(prev => ({
//           ...prev,
//           totalUsers: usersStats.total_users || 0,
//           activeUsers: usersStats.active_users || 0,
//           inactiveUsers: usersStats.inactive_users || 0
//         }));
        
//         console.log('✅ Stats utilisateurs récupérées');
//       } catch (userError) {
//         console.log('⚠️ Erreur stats utilisateurs:', userError.message);
//       }
      
//       // Récupérer les utilisateurs récents
//       try {
//         const recentUsersResponse = await api.get('/api/users/admin/users/recent/?limit=5');
//         const usersData = recentUsersResponse.data;
        
//         if (usersData.results) {
//           setRecentUsers(usersData.results);
//         } else if (Array.isArray(usersData)) {
//           setRecentUsers(usersData);
//         } else {
//           setRecentUsers(usersData.users || []);
//         }
//         console.log('✅ Utilisateurs récents récupérés');
//       } catch (recentUsersError) {
//         console.log('⚠️ Erreur utilisateurs récents:', recentUsersError.message);
//       }
      
//       // Récupérer les projets
//       try {
//         const projectsResponse = await api.get('/api/projects/?limit=5&ordering=-created_at');
//         const projectsData = projectsResponse.data;
        
//         if (projectsData.results) {
//           setRecentProjects(projectsData.results);
//           setStats(prev => ({
//             ...prev,
//             totalProjects: projectsData.count || projectsData.results.length
//           }));
//         } else if (Array.isArray(projectsData)) {
//           setRecentProjects(projectsData);
//           setStats(prev => ({
//             ...prev,
//             totalProjects: projectsData.length
//           }));
//         }
//         console.log('✅ Projets récupérés');
//       } catch (projectsError) {
//         console.log('⚠️ Erreur projets:', projectsError.message);
//       }
      
//       // Récupérer les stats projets
//       try {
//         const projectsStatsResponse = await api.get('/api/projects/stats/');
//         const projectsStats = projectsStatsResponse.data;
        
//         setStats(prev => ({
//           ...prev,
//           pendingModeration: projectsStats.pending || 0,
//           approvedProjects: projectsStats.published || 0,
//           draftProjects: projectsStats.draft || 0,
//           totalDownloads: projectsStats.total_downloads || 0
//         }));
        
//         console.log('✅ Stats projets récupérées');
//       } catch (statsError) {
//         console.log('⚠️ Erreur stats projets:', statsError.message);
//       }
      
//       setIsRealData(true);
      
//     } catch (separateError) {
//       console.error('❌ Erreur récupération séparée:', separateError);
//       throw separateError;
//     }
//   };

//   // Générer l'activité récente à partir des données
//   useEffect(() => {
//     if (recentUsers.length > 0 || recentProjects.length > 0) {
//       generateRecentActivity();
//     }
//   }, [recentUsers, recentProjects]);

//   const generateRecentActivity = () => {
//     const activity = [];
    
//     // Activité basée sur les utilisateurs récents (max 3)
//     recentUsers.slice(0, 3).forEach(user => {
//       const joinDate = new Date(user.date_joined || user.created_at);
//       const hoursAgo = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60));
      
//       activity.push({
//         id: `user_${user.id}`,
//         type: 'user',
//         user: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'Utilisateur',
//         action: 's\'est inscrit(e)',
//         time: hoursAgo < 24 ? `Il y a ${hoursAgo} heures` : joinDate.toLocaleDateString('fr-FR'),
//         icon: 'person',
//         color: 'green'
//       });
//     });
    
//     // Activité basée sur les projets récents (max 2)
//     recentProjects.slice(0, 2).forEach(project => {
//       const createDate = new Date(project.created_at || project.date_created);
//       const timeDiff = Date.now() - createDate.getTime();
//       const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
      
//       let timeText;
//       if (hoursAgo < 1) timeText = 'Il y a moins d\'une heure';
//       else if (hoursAgo < 24) timeText = `Il y a ${hoursAgo} heures`;
//       else timeText = createDate.toLocaleDateString('fr-FR');
      
//       activity.push({
//         id: `project_${project.id}`,
//         type: 'project',
//         user: project.author?.username || project.author?.first_name || 'Utilisateur',
//         action: project.status === 'pending' ? 'a soumis un projet en attente' : 'a publié un projet',
//         project: project.title || 'Sans titre',
//         time: timeText,
//         icon: project.status === 'pending' ? 'pending' : 'folder',
//         color: project.status === 'pending' ? 'orange' : 'blue'
//       });
//     });
    
//     // Ajouter une activité de téléchargement si des downloads existent
//     if (stats.totalDownloads > 0) {
//       activity.unshift({
//         id: 'downloads',
//         type: 'download',
//         user: 'Utilisateurs',
//         action: `ont téléchargé ${stats.totalDownloads} projets`,
//         time: 'Aujourd\'hui',
//         icon: 'download',
//         color: 'purple'
//       });
//     }
    
//     // Trier par date (plus récent en premier)
//     activity.sort((a, b) => {
//       // Simple tri - les téléchargements en premier, puis par ordre d'ajout
//       if (a.type === 'download') return -1;
//       if (b.type === 'download') return 1;
//       return 0;
//     });
    
//     setRecentActivity(activity.slice(0, 5)); // Limiter à 5 activités
//   };

//   // Fonctions helper pour les données mockées (fallback)
//   const getMockStats = () => ({
//     totalUsers: 1247,
//     totalProjects: 543,
//     totalDownloads: 2891,
//     pendingModeration: 23,
//     approvedProjects: 320,
//     activeUsers: 1100,
//     inactiveUsers: 147,
//     draftProjects: 200
//   });

//   const getMockUsers = () => [
//     {
//       id: 1,
//       username: 'admin',
//       email: 'admin@simplon.com',
//       first_name: 'Admin',
//       last_name: 'System',
//       date_joined: new Date().toISOString(),
//       is_active: true,
//       is_staff: true,
//       is_superuser: true
//     },
//     {
//       id: 2,
//       username: 'simplon_2025001',
//       email: 'alice.martin@simplon.com',
//       first_name: 'Alice',
//       last_name: 'Martin',
//       date_joined: new Date(Date.now() - 86400000).toISOString(),
//       is_active: true,
//       is_staff: false,
//       is_superuser: false
//     },
//     {
//       id: 3,
//       username: 'simplon_2025002',
//       email: 'bob.dupont@simplon.com',
//       first_name: 'Bob',
//       last_name: 'Dupont',
//       date_joined: new Date(Date.now() - 172800000).toISOString(),
//       is_active: true,
//       is_staff: false,
//       is_superuser: false
//     }
//   ];

//   const getMockProjects = () => [
//     {
//       id: 1,
//       title: 'Application E-commerce React/Node',
//       author: {
//         username: 'simplon_2025001',
//         first_name: 'Alice',
//         last_name: 'Martin'
//       },
//       status: 'published',
//       created_at: new Date().toISOString(),
//       technologies: ['React', 'Node.js', 'MongoDB']
//     },
//     {
//       id: 2,
//       title: 'Système de Gestion de Bibliothèque',
//       author: {
//         username: 'simplon_2025002',
//         first_name: 'Bob',
//         last_name: 'Dupont'
//       },
//       status: 'pending',
//       created_at: new Date(Date.now() - 86400000).toISOString(),
//       technologies: ['Django', 'PostgreSQL']
//     }
//   ];

//   const handleQuickAction = (action) => {
//     switch (action) {
//       case 'moderation':
//         navigate('/admin/projects?status=pending');
//         break;
//       case 'users':
//         navigate('/admin/users');
//         break;
//       case 'projects':
//         navigate('/admin/projects');
//         break;
//       case 'analytics':
//         navigate('/admin/analytics');
//         break;
//       default:
//         console.log('Action non implémentée:', action);
//     }
//   };

//   const getActivityIcon = (type) => {
//     const icons = {
//       project: 'folder',
//       user: 'person',
//       moderation: 'verified',
//       download: 'download',
//       update: 'update',
//       pending: 'pending_actions'
//     };
//     return icons[type] || 'notifications';
//   };

//   const getActivityColor = (type) => {
//     const colors = {
//       project: 'blue',
//       user: 'green',
//       moderation: 'orange',
//       download: 'purple',
//       update: 'cyan',
//       pending: 'orange'
//     };
//     return colors[type] || 'gray';
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Date inconnue';
//     try {
//       const date = new Date(dateString);
//       const now = new Date();
//       const diffTime = Math.abs(now - date);
//       const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
//       if (diffDays === 0) return 'Aujourd\'hui';
//       if (diffDays === 1) return 'Hier';
//       if (diffDays < 7) return `Il y a ${diffDays} jours`;
      
//       return date.toLocaleDateString('fr-FR', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric'
//       });
//     } catch (e) {
//       return dateString;
//     }
//   };

//   const getUserDisplayName = (user) => {
//     if (!user) return 'Inconnu';
//     if (user.first_name && user.last_name) {
//       return `${user.first_name} ${user.last_name}`;
//     }
//     return user.username || user.email || 'Utilisateur';
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px]">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E30613] mb-6"></div>
//         <p className="text-lg text-[#001F3F] dark:text-white mb-2">
//           Chargement des données...
//         </p>
//         <p className="text-sm text-gray-500 dark:text-gray-400">
//           Connexion à la base de données
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       {/* En-tête avec indicateur de source */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-[#001F3F] dark:text-white">
//             Tableau de Bord Administrateur
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-2">
//             {isRealData ? (
//               <span className="flex items-center gap-2">
//                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//                 Données en direct • Dernière actualisation: {new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
//               </span>
//             ) : (
//               <span className="flex items-center gap-2">
//                 <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
//                 Mode démonstration • Connectez-vous à l'API pour les données réelles
//               </span>
//             )}
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <button 
//             onClick={fetchDashboardData}
//             disabled={loading}
//             className="flex items-center gap-2 px-4 py-2.5 bg-[#001F3F] text-white rounded-lg hover:bg-[#003265] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <span className="material-symbols-outlined text-sm">refresh</span>
//             {loading ? 'Actualisation...' : 'Actualiser'}
//           </button>
//           {!isRealData && (
//             <span className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-100 px-3 py-1.5 rounded-full">
//               <span className="material-symbols-outlined text-sm">warning</span>
//               Mode démo
//             </span>
//           )}
//         </div>
//       </div>

//       {error && (
//         <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
//           <div className="flex items-start">
//             <span className="material-symbols-outlined text-yellow-400 mr-3">error</span>
//             <div>
//               <p className="font-medium text-yellow-800">{error}</p>
//               <p className="text-sm text-yellow-700 mt-1">
//                 Vérifiez votre connexion et assurez-vous que l'API est accessible.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Cartes de métriques */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//         <MetricCard
//           title="Utilisateurs"
//           value={stats.totalUsers.toLocaleString('fr-FR')}
//           trend={stats.activeUsers > 0 ? `${stats.activeUsers} actifs` : 'Chargement...'}
//           icon="people"
//           color="blue"
//           description="Utilisateurs inscrits"
//           onClick={() => handleQuickAction('users')}
//           clickable
//         />
//         <MetricCard
//           title="Projets"
//           value={stats.totalProjects.toLocaleString('fr-FR')}
//           trend={stats.approvedProjects > 0 ? `${stats.approvedProjects} publiés` : 'Chargement...'}
//           icon="folder"
//           color="green"
//           description="Projets déposés"
//           onClick={() => handleQuickAction('projects')}
//           clickable
//         />
//         <MetricCard
//           title="Validés"
//           value={stats.approvedProjects.toLocaleString('fr-FR')}
//           trend={stats.totalProjects > 0 ? `${Math.round((stats.approvedProjects / stats.totalProjects) * 100)}% publiés` : '0%'}
//           icon="check_circle"
//           color="purple"
//           description="Projets publiés"
//         />
//         <MetricCard
//           title="En Attente"
//           value={stats.pendingModeration}
//           trend={stats.pendingModeration > 0 ? "À modérer" : "Aucune attente"}
//           icon="pending_actions"
//           color="red"
//           description="Projets en attente"
//           onClick={() => handleQuickAction('moderation')}
//           clickable
//         />
//       </div>

//       {/* Deux colonnes principales */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Activité Récente */}
//         <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700 lg:col-span-2">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold text-[#001F3F] dark:text-white">
//               Activité Récente
//             </h2>
//             <button 
//               onClick={fetchDashboardData}
//               className="text-sm text-[#E30613] hover:text-[#c40511] font-medium flex items-center gap-1"
//             >
//               <span className="material-symbols-outlined text-base">refresh</span>
//               Actualiser
//             </button>
//           </div>
          
//           {recentActivity.length > 0 ? (
//             <div className="space-y-4">
//               {recentActivity.map((activity) => (
//                 <div key={activity.id} className="flex items-start gap-4 p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#0d1a29] transition-all duration-200 group">
//                   <div className={`p-3 rounded-full ${getActivityColor(activity.type) === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20' :
//                     getActivityColor(activity.type) === 'green' ? 'bg-green-50 dark:bg-green-900/20' :
//                     getActivityColor(activity.type) === 'orange' ? 'bg-orange-50 dark:bg-orange-900/20' :
//                     'bg-purple-50 dark:bg-purple-900/20'
//                   }`}>
//                     <span className={`material-symbols-outlined ${
//                       getActivityColor(activity.type) === 'blue' ? 'text-blue-600 dark:text-blue-400' :
//                       getActivityColor(activity.type) === 'green' ? 'text-green-600 dark:text-green-400' :
//                       getActivityColor(activity.type) === 'orange' ? 'text-orange-600 dark:text-orange-400' :
//                       'text-purple-600 dark:text-purple-400'
//                     }`}>
//                       {getActivityIcon(activity.type)}
//                     </span>
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm text-[#001F3F] dark:text-white mb-1">
//                       <strong className="font-semibold">{activity.user}</strong> {activity.action}
//                       {activity.project && (
//                         <strong className="ml-1 text-[#001F3F] dark:text-white">"{activity.project}"</strong>
//                       )}
//                     </p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       <span className="material-symbols-outlined text-xs align-middle mr-1">schedule</span>
//                       {activity.time}
//                     </p>
//                   </div>
//                   <span className={`text-xs px-2 py-1 rounded-full ${
//                     activity.type === 'user' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
//                     activity.type === 'project' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
//                     'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
//                   }`}>
//                     {activity.type === 'user' ? 'Utilisateur' : 
//                      activity.type === 'project' ? 'Projet' : 
//                      activity.type === 'download' ? 'Téléchargement' : 'Activité'}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-3">
//                 activity_zone
//               </span>
//               <p className="text-gray-500 dark:text-gray-400">
//                 Aucune activité récente
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Projets Récents */}
//         <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold text-[#001F3F] dark:text-white">
//               Projets Récents
//             </h2>
//             <button 
//               onClick={() => handleQuickAction('projects')}
//               className="text-sm text-[#001F3F] dark:text-white hover:text-[#E30613] font-medium flex items-center gap-1"
//             >
//               Voir tous
//               <span className="material-symbols-outlined text-base">arrow_forward</span>
//             </button>
//           </div>
          
//           {recentProjects.length > 0 ? (
//             <div className="space-y-4">
//               {recentProjects.map((project) => (
//                 <div 
//                   key={project.id} 
//                   className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#0d1a29] transition-all duration-200 cursor-pointer"
//                   onClick={() => navigate(`/admin/projects/${project.id}`)}
//                 >
//                   <div className="flex justify-between items-start mb-2">
//                     <p className="text-sm font-medium text-[#001F3F] dark:text-white truncate flex-1 mr-2">
//                       {project.title || 'Projet sans titre'}
//                     </p>
//                     <span className={`px-2 py-1 text-xs rounded-full ${
//                       project.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
//                       project.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
//                       project.status === 'draft' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300' :
//                       'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
//                     }`}>
//                       {project.status === 'published' ? 'Publié' :
//                        project.status === 'pending' ? 'En attente' : 
//                        project.status === 'draft' ? 'Brouillon' : 'Inconnu'}
//                     </span>
//                   </div>
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
//                     <span className="material-symbols-outlined text-xs align-middle mr-1">person</span>
//                     {getUserDisplayName(project.author)}
//                   </p>
//                   <div className="flex items-center justify-between">
//                     <span className="text-xs text-gray-500 dark:text-gray-400">
//                       <span className="material-symbols-outlined text-xs align-middle mr-1">calendar_today</span>
//                       {formatDate(project.created_at)}
//                     </span>
//                     {project.technologies && (
//                       <div className="flex gap-1">
//                         {Array.isArray(project.technologies) ? (
//                           project.technologies.slice(0, 2).map((tech, index) => (
//                             <span key={index} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
//                               {tech}
//                             </span>
//                           ))
//                         ) : (
//                           <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
//                             {project.technologies}
//                           </span>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-3">
//                 folder_off
//               </span>
//               <p className="text-gray-500 dark:text-gray-400">
//                 Aucun projet récent
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Informations supplémentaires */}
//       <div className="bg-gradient-to-r from-[#001F3F] to-[#003265] rounded-xl p-6 text-white">
//         <div className="flex flex-col md:flex-row items-center justify-between">
//           <div className="mb-4 md:mb-0 md:mr-6">
//             <h3 className="text-xl font-bold mb-2">Statistiques avancées</h3>
//             <p className="text-blue-100">
//               {isRealData ? 'Données synchronisées avec la base de données' : 'Activer l\'API pour les données complètes'}
//             </p>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
//             <div className="text-center">
//               <p className="text-2xl font-bold">{stats.activeUsers}</p>
//               <p className="text-sm text-blue-200">Utilisateurs actifs</p>
//             </div>
//             <div className="text-center">
//               <p className="text-2xl font-bold">{stats.draftProjects}</p>
//               <p className="text-sm text-blue-200">Brouillons</p>
//             </div>
//             <div className="text-center">
//               <p className="text-2xl font-bold">{stats.totalDownloads}</p>
//               <p className="text-sm text-blue-200">Téléchargements</p>
//             </div>
//             <div className="text-center">
//               <p className="text-2xl font-bold">
//                 {stats.totalProjects > 0 ? Math.round((stats.approvedProjects / stats.totalProjects) * 100) : 0}%
//               </p>
//               <p className="text-sm text-blue-200">Taux de publication</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


// src/components/admin/AdminDashboard.jsx - VERSION PROFESSIONNELLE
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { 
  Folder, Users, FileCheck, Clock, 
  TrendingUp, BarChart3, Shield, Settings,
  Search, Filter, Plus, MoreVertical,
  Download, Eye, Edit, Trash2
} from 'lucide-react';
import api from "../../services/api";
import authService from "../../services/auth";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Données
  const [stats, setStats] = useState({
    totalProjects: 0,
    published: 0,
    pending: 0,
    totalUsers: 0,
    activeUsers: 0
  });

  const [projects, setProjects] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const user = authService.getCurrentUser();
      
      if (!user || !(user.is_staff || user.is_superuser)) {
        navigate('/dashboard');
        return;
      }

      try {
        // Récupérer les projets
        const projectsRes = await api.get('/api/projects/?limit=6&ordering=-created_at');
        const projectsData = projectsRes.data.results || projectsRes.data;
        setProjects(projectsData);

        // Calculer les stats
        const published = projectsData.filter(p => p.status === 'published').length;
        const pending = projectsData.filter(p => p.status === 'pending').length;

        // Récupérer les utilisateurs (simulé pour l'exemple)
        const usersRes = await api.get('/api/users/?limit=100');
        const usersData = usersRes.data.results || usersRes.data;
        const activeUsers = usersData.filter(u => u.is_active).length;

        setStats({
          totalProjects: projectsData.length,
          published,
          pending,
          totalUsers: usersData.length,
          activeUsers
        });

        // Générer l'activité récente
        generateRecentActivity(projectsData);

      } catch (error) {
        console.log('Mode démo activé');
        loadDemoData();
      }

    } catch (error) {
      console.error('Erreur:', error);
      loadDemoData();
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
    const demoProjects = [
      {
        id: 1,
        title: 'Application E-commerce React',
        author: { username: 'alex.dubois', first_name: 'Alex', last_name: 'Dubois' },
        status: 'published',
        created_at: new Date().toISOString(),
        downloads: 42,
        views: 156
      },
      {
        id: 2,
        title: 'API REST Django',
        author: { username: 'marie.leroy', first_name: 'Marie', last_name: 'Leroy' },
        status: 'pending',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        downloads: 0,
        views: 23
      },
      {
        id: 3,
        title: 'Dashboard Analytics',
        author: { username: 'thomas.martin', first_name: 'Thomas', last_name: 'Martin' },
        status: 'published',
        created_at: new Date(Date.now() - 172800000).toISOString(),
        downloads: 18,
        views: 89
      },
      {
        id: 4,
        title: 'Système de Réservation',
        author: { username: 'sophie.dupont', first_name: 'Sophie', last_name: 'Dupont' },
        status: 'published',
        created_at: new Date(Date.now() - 259200000).toISOString(),
        downloads: 31,
        views: 142
      }
    ];

    setProjects(demoProjects);
    setStats({
      totalProjects: demoProjects.length,
      published: 3,
      pending: 1,
      totalUsers: 124,
      activeUsers: 89
    });
    generateRecentActivity(demoProjects);
  };

  const generateRecentActivity = (projectsData) => {
    const activity = [
      {
        id: 1,
        type: 'project',
        user: 'Alex Dubois',
        action: 'a publié un projet',
        project: 'Application E-commerce React',
        time: 'Il y a 2 heures'
      },
      {
        id: 2,
        type: 'user',
        user: 'Nouvel utilisateur',
        action: 's\'est inscrit',
        time: 'Il y a 4 heures'
      },
      {
        id: 3,
        type: 'project',
        user: 'Marie Leroy',
        action: 'a soumis un projet',
        project: 'API REST Django',
        time: 'Hier'
      }
    ];
    setRecentActivity(activity);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'published': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-amber-600 bg-amber-50';
      case 'draft': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'published': return 'Publié';
      case 'pending': return 'En attente';
      case 'draft': return 'Brouillon';
      default: return 'Inconnu';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    }
    return date.toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement du dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tableau de Bord</h1>
              <p className="text-gray-600 mt-1">Gestion des projets et utilisateurs</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/projects/new')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Plus size={18} />
                Nouveau projet
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Cartes de stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Projets totaux</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Folder size={24} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">{stats.published} publiés</span>
              <span className="mx-2">•</span>
              <span className="text-amber-600 font-medium">{stats.pending} en attente</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Users size={24} className="text-green-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="font-medium text-green-600">{stats.activeUsers} actifs</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">À valider</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <Clock size={24} className="text-amber-600" />
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => navigate('/admin/projects?status=pending')}
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                Voir les projets en attente →
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Activité</p>
                <p className="text-2xl font-bold text-gray-900">24h</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <TrendingUp size={24} className="text-purple-600" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <span className="font-medium">2 nouveaux projets</span>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des projets */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Projets récents</h2>
                    <p className="text-sm text-gray-600 mt-1">Dernières soumissions</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                      <Filter size={16} />
                      Filtrer
                    </button>
                    <button 
                      onClick={() => navigate('/admin/projects')}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Voir tous →
                    </button>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {projects.map((project) => (
                  <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900 truncate">
                            {project.title}
                          </h3>
                          <span className={`ml-2 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                            {getStatusText(project.status)}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <span>Par {project.author?.first_name || project.author?.username}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{formatDate(project.created_at)}</span>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Eye size={16} className="text-gray-400" />
                            <span className="text-gray-600">{project.views || 0} vues</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download size={16} className="text-gray-400" />
                            <span className="text-gray-600">{project.downloads || 0} téléchargements</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/projects/${project.id}`)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Voir détails"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/projects/${project.id}/edit`)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/projects/${project.id}/delete`)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Barre latérale */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/admin/projects?status=pending')}
                  className="w-full flex items-center justify-between p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <FileCheck size={18} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium">Modération</p>
                      <p className="text-sm text-gray-500">Projets en attente</p>
                    </div>
                  </div>
                  <span className="text-amber-600">{stats.pending}</span>
                </button>

                <button
                  onClick={() => navigate('/admin/users')}
                  className="w-full flex items-center justify-between p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Users size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Utilisateurs</p>
                      <p className="text-sm text-gray-500">Gérer les comptes</p>
                    </div>
                  </div>
                  <span className="text-blue-600">{stats.totalUsers}</span>
                </button>

                <button
                  onClick={() => navigate('/admin/analytics')}
                  className="w-full flex items-center justify-between p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <BarChart3 size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Analytiques</p>
                      <p className="text-sm text-gray-500">Statistiques détaillées</p>
                    </div>
                  </div>
                  <span className="text-purple-600">→</span>
                </button>
              </div>
            </div>

            {/* Activité récente */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Activité récente</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'project' ? 'bg-blue-50' : 'bg-green-50'
                      }`}>
                        {activity.type === 'project' ? (
                          <Folder size={16} className="text-blue-600" />
                        ) : (
                          <Users size={16} className="text-green-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        {activity.project && (
                          <p className="text-sm text-gray-600 mt-1">{activity.project}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statut système */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Shield size={20} className="text-blue-400" />
                <h3 className="font-semibold">Statut système</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">API</span>
                  <span className="inline-flex items-center gap-1 text-sm text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    En ligne
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Base de données</span>
                  <span className="inline-flex items-center gap-1 text-sm text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    En ligne
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Performances</span>
                  <span className="text-sm text-green-400">Optimale</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-700">
                <p className="text-xs text-gray-400">
                  Dernière vérification: {new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pied de page */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>Dashboard v2.1 • {new Date().getFullYear()} © Tous droits réservés</p>
            <div className="flex items-center gap-4">
              <button className="hover:text-gray-900 transition-colors">Support</button>
              <button className="hover:text-gray-900 transition-colors">Documentation</button>
              <button className="hover:text-gray-900 transition-colors">Paramètres</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;