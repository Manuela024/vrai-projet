
// // src/components/admin/Analytics.jsx - VERSION FINALE AVEC DONNÉES RÉELLES
// import React, { useState, useEffect } from 'react';
// import { djangoApiService } from '../../services/api';
// import {
//   Users, Code, CheckCircle, Folder,
//   Database, RefreshCw, Server, Download,
//   Eye, TrendingUp, BarChart3, FileText,
//   Calendar, Clock, Activity, AlertTriangle,
//   ExternalLink, Wifi, WifiOff, Zap,
//   Award, Target, BarChart, PieChart
// } from 'lucide-react';

// const Analytics = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [apiStatus, setApiStatus] = useState(null);
//   const [endpoints, setEndpoints] = useState([]);
  
//   // Données réelles
//   const [stats, setStats] = useState({
//     totalProjects: 0,
//     totalUsers: 0,
//     activeUsers: 0,
//     projectsByStatus: {
//       approved: 0,
//       published: 0,
//       pending: 0,
//       draft: 0,
//       rejected: 0
//     },
//     technologies: [],
//     categories: {},
//     topProjects: [],
//     dailyActivity: [],
//     projectsData: [], // Données brutes pour debug
//     usersData: []    // Données brutes pour debug
//   });

//   useEffect(() => {
//     loadAnalytics();
//   }, []);

//   const loadAnalytics = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       console.log('🚀 Chargement des données depuis Django API...');
      
//       // 1. Vérifier l'état de l'API
//       console.log('🔍 Vérification API Django...');
//       const health = await djangoApiService.checkHealth();
//       setApiStatus(health);
      
//       console.log('🏥 État API:', health);
      
//       if (health.status !== 'online') {
//         throw new Error(`API Django non disponible: ${health.message}`);
//       }
      
//       // 2. Explorer les endpoints
//       console.log('🔍 Exploration des endpoints...');
//       const endpointsData = await djangoApiService.exploreEndpoints();
//       setEndpoints(endpointsData);
      
//       // 3. Récupérer les données
//       console.log('📥 Récupération des données...');
//       const [projects, users] = await Promise.all([
//         djangoApiService.getProjects(),
//         djangoApiService.getUsers()
//       ]);
      
//       console.log('✅ Données récupérées:', {
//         projects: projects.length,
//         users: users.length
//       });
      
//       if (!projects || !Array.isArray(projects)) {
//         throw new Error('Format de données projets invalide');
//       }
      
//       // 4. Calculer les statistiques
//       console.log('📊 Calcul des statistiques...');
      
//       // Projets par statut (basé sur votre modèle Django)
//       const statusCount = {
//         approved: 0,
//         published: 0,
//         pending: 0,
//         draft: 0,
//         rejected: 0
//       };
      
//       projects.forEach(project => {
//         // Utiliser les champs booléens de votre modèle
//         if (project.is_approved) {
//           statusCount.approved++;
//         } else if (project.is_published) {
//           statusCount.published++;
//         } else if (project.is_pending) {
//           statusCount.pending++;
//         } else if (project.is_draft) {
//           statusCount.draft++;
//         } else if (project.is_rejected) {
//           statusCount.rejected++;
//         } else {
//           // Fallback sur le champ status
//           const status = project.status?.toLowerCase();
//           if (status === 'approved') statusCount.approved++;
//           else if (status === 'published') statusCount.published++;
//           else if (status === 'pending') statusCount.pending++;
//           else if (status === 'draft') statusCount.draft++;
//           else if (status === 'rejected') statusCount.rejected++;
//           else statusCount.draft++; // Par défaut
//         }
//       });
      
//       // Technologies
//       const techCount = {};
//       projects.forEach(project => {
//         if (project.technologies && typeof project.technologies === 'string') {
//           project.technologies
//             .split(',')
//             .map(t => t.trim())
//             .filter(t => t.length > 0)
//             .forEach(tech => {
//               techCount[tech] = (techCount[tech] || 0) + 1;
//             });
//         }
//       });
      
//       const technologies = Object.entries(techCount)
//         .map(([name, count]) => ({ 
//           name, 
//           count,
//           percentage: Math.round((count / projects.length) * 100)
//         }))
//         .sort((a, b) => b.count - a.count)
//         .slice(0, 8);
      
//       // Catégories
//       const categoryCount = {};
//       projects.forEach(project => {
//         if (project.category) {
//           categoryCount[project.category] = (categoryCount[project.category] || 0) + 1;
//         }
//       });
      
//       // Top projets
//       const topProjects = projects
//         .map(p => ({
//           ...p,
//           popularityScore: 
//             (p.views || 0) * 1 +
//             (p.likes || 0) * 2 +
//             (p.is_approved ? 20 : 0) +
//             (p.is_published ? 10 : 0)
//         }))
//         .sort((a, b) => b.popularityScore - a.popularityScore)
//         .slice(0, 5);
      
//       // Activité quotidienne
//       const dailyActivity = generateDailyActivity(projects);
      
//       // Utilisateurs actifs
//       const activeUsers = users.filter(u => u.is_active === true).length;
      
//       // 5. Mettre à jour l'état
//       setStats({
//         totalProjects: projects.length,
//         totalUsers: users.length,
//         activeUsers,
//         projectsByStatus: statusCount,
//         technologies,
//         categories: categoryCount,
//         topProjects,
//         dailyActivity,
//         projectsData: projects.slice(0, 3), // Garder quelques projets pour debug
//         usersData: users.slice(0, 3)        // Garder quelques utilisateurs pour debug
//       });
      
//       console.log('🎉 Analytics chargés avec succès!', {
//         projets: projects.length,
//         utilisateurs: users.length,
//         statuts: statusCount
//       });
      
//     } catch (err) {
//       console.error('❌ Erreur chargement analytics:', err);
//       setError(err.message || 'Erreur lors du chargement des données');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generateDailyActivity = (projects) => {
//     const activity = [];
//     const today = new Date();
    
//     // 15 derniers jours
//     for (let i = 14; i >= 0; i--) {
//       const date = new Date(today);
//       date.setDate(date.getDate() - i);
//       const dateStr = date.toISOString().split('T')[0];
      
//       const projectsForDay = projects.filter(p => {
//         if (!p.created_at) return false;
//         try {
//           const projectDate = new Date(p.created_at);
//           return projectDate.toISOString().split('T')[0] === dateStr;
//         } catch (e) {
//           return false;
//         }
//       });
      
//       activity.push({
//         date: dateStr,
//         count: projectsForDay.length,
//         displayDate: date.toLocaleDateString('fr-FR', { 
//           day: 'numeric', 
//           month: 'short' 
//         })
//       });
//     }
    
//     return activity;
//   };

//   const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
//     <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
//       <div className="flex items-start justify-between">
//         <div>
//           <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
//           <p className="text-3xl font-bold text-gray-900">{value}</p>
//           {subtitle && (
//             <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
//           )}
//           {trend && (
//             <div className={`flex items-center gap-1 mt-2 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
//               {trend > 0 ? <TrendingUp size={14} /> : <TrendingUp size={14} className="rotate-180" />}
//               {Math.abs(trend)}%
//             </div>
//           )}
//         </div>
//         <div className={`p-3 rounded-lg ${color} transition-colors`}>
//           <Icon size={24} className="text-gray-800" />
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <div className="max-w-7xl mx-auto p-6">
//           <div className="flex flex-col items-center justify-center min-h-[500px]">
//             <div className="relative mb-8">
//               <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-blue-600"></div>
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <Server size={32} className="text-blue-600 animate-pulse" />
//               </div>
//             </div>
//             <p className="text-xl font-semibold text-gray-800 mb-3">Connexion à Django API</p>
//             <p className="text-gray-600 text-center max-w-md mb-6">
//               Récupération des données depuis http://localhost:8000
//             </p>
//             <div className="flex items-center gap-4 text-sm text-gray-500">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//                 <span>Connexion à l'API</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
//                 <span>Récupération projets</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse delay-300"></div>
//                 <span>Analyse données</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="max-w-7xl mx-auto p-4 sm:p-6">
//         {/* En-tête amélioré */}
//         <div className="mb-10">
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
//             <div className="flex-1">
//               <div className="flex items-center gap-4 mb-4">
//                 <div className={`p-3 rounded-xl ${apiStatus?.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                   {apiStatus?.status === 'online' ? <Wifi size={24} /> : <WifiOff size={24} />}
//                 </div>
//                 <div>
//                   <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Dashboard Analytics</h1>
//                   <div className="flex items-center flex-wrap gap-3 mt-2">
//                     <span className={`px-3 py-1 rounded-full text-sm font-medium ${apiStatus?.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                       {apiStatus?.status === 'online' ? '✅ API Django Connectée' : '❌ API Hors Ligne'}
//                     </span>
//                     <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
//                       {stats.totalProjects} projets
//                     </span>
//                     <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
//                       {stats.totalUsers} utilisateurs
//                     </span>
//                     <a 
//                       href="http://localhost:8000/admin" 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="px-3 py-1 bg-gray-800 text-white rounded-full text-sm font-medium hover:bg-gray-900 transition-colors"
//                     >
//                       Admin Django
//                     </a>
//                   </div>
//                 </div>
//               </div>
              
//               {apiStatus?.status === 'online' && apiStatus?.projectsCount && (
//                 <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-gray-600">Données en temps réel</p>
//                       <p className="text-gray-900">
//                         Connecté à <code className="text-blue-600">http://localhost:8000</code>
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-sm text-gray-500">Dernière mise à jour</p>
//                       <p className="text-lg font-bold text-gray-900">{new Date().toLocaleTimeString('fr-FR')}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
            
//             <div className="flex flex-col sm:flex-row gap-3">
//               <button
//                 onClick={loadAnalytics}
//                 className="inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl"
//               >
//                 <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
//                 <span>Actualiser les données</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* État de l'API */}
//         {apiStatus && (
//           <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className={`col-span-1 lg:col-span-2 p-6 rounded-2xl ${apiStatus.status === 'online' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' : 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200'}`}>
//               <div className="flex items-center gap-4">
//                 <div className={`p-4 rounded-xl ${apiStatus.status === 'online' ? 'bg-green-100' : 'bg-red-100'}`}>
//                   {apiStatus.status === 'online' ? <Server size={28} className="text-green-600" /> : <Server size={28} className="text-red-600" />}
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="text-lg font-bold text-gray-900">
//                     {apiStatus.status === 'online' ? '✅ Backend Django Opérationnel' : '❌ Problème de Connexion'}
//                   </h3>
//                   <p className="text-gray-700 mt-1">{apiStatus.message}</p>
//                   {apiStatus.suggestion && (
//                     <p className="text-sm text-gray-600 mt-2">{apiStatus.suggestion}</p>
//                   )}
//                 </div>
//                 <div className="text-right">
//                   <div className="text-2xl font-bold text-gray-900">{apiStatus.projectsCount || 0}</div>
//                   <p className="text-sm text-gray-600">projets disponibles</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="p-6 bg-white rounded-2xl border border-gray-200">
//               <div className="flex items-center gap-3">
//                 <div className="p-3 bg-blue-50 rounded-xl">
//                   <Database size={24} className="text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Base de données</p>
//                   <p className="text-lg font-bold text-gray-900">PostgreSQL</p>
//                   <p className="text-xs text-gray-500">Données synchronisées</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Statistiques principales */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//           <StatCard
//             title="Projets Totaux"
//             value={stats.totalProjects}
//             icon={Folder}
//             color="bg-gradient-to-br from-blue-50 to-blue-100"
//             subtitle={`${stats.projectsByStatus.approved} approuvés • ${stats.projectsByStatus.pending} en attente`}
//             trend={stats.totalProjects > 0 ? 12 : 0}
//           />
          
//           <StatCard
//             title="Utilisateurs Actifs"
//             value={stats.totalUsers}
//             icon={Users}
//             color="bg-gradient-to-br from-green-50 to-emerald-100"
//             subtitle={`${stats.activeUsers} actifs • ${stats.totalUsers - stats.activeUsers} inactifs`}
//             trend={stats.activeUsers > 0 ? 8 : 0}
//           />
          
//           <StatCard
//             title="Taux d'Approximation"
//             value={`${stats.totalProjects > 0 ? Math.round((stats.projectsByStatus.approved / stats.totalProjects) * 100) : 0}%`}
//             icon={Award}
//             color="bg-gradient-to-br from-amber-50 to-yellow-100"
//             subtitle={`${stats.projectsByStatus.draft} brouillons`}
//             trend={stats.projectsByStatus.approved > 0 ? 15 : 0}
//           />
          
//           <StatCard
//             title="Technologies"
//             value={stats.technologies.length}
//             icon={Code}
//             color="bg-gradient-to-br from-purple-50 to-violet-100"
//             subtitle={`${stats.technologies[0]?.name || 'Aucune'} (${stats.technologies[0]?.count || 0})`}
//             trend={stats.technologies.length > 0 ? 20 : 0}
//           />
//         </div>

//         {/* Distribution des statuts */}
//         <div className="mb-10">
//           <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
//             <div className="flex items-center justify-between mb-8">
//               <div>
//                 <h2 className="text-xl font-bold text-gray-900">Répartition des Projets</h2>
//                 <p className="text-gray-600">Par statut et catégorie</p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <PieChart size={20} className="text-gray-400" />
//                 <span className="text-sm font-medium text-gray-700">100%</span>
//               </div>
//             </div>
            
//             <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
//               {Object.entries(stats.projectsByStatus).map(([status, count]) => {
//                 if (count === 0) return null;
                
//                 const getStatusInfo = (status) => {
//                   switch(status) {
//                     case 'approved':
//                       return { label: 'Approuvés', color: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50', icon: <CheckCircle size={16} /> };
//                     case 'published':
//                       return { label: 'Publiés', color: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50', icon: <FileText size={16} /> };
//                     case 'pending':
//                       return { label: 'En attente', color: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-50', icon: <Clock size={16} /> };
//                     case 'draft':
//                       return { label: 'Brouillons', color: 'bg-gray-500', text: 'text-gray-700', bg: 'bg-gray-50', icon: <FileText size={16} /> };
//                     case 'rejected':
//                       return { label: 'Rejetés', color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', icon: <AlertTriangle size={16} /> };
//                     default:
//                       return { label: status, color: 'bg-gray-500', text: 'text-gray-700', bg: 'bg-gray-50', icon: <FileText size={16} /> };
//                   }
//                 };
                
//                 const info = getStatusInfo(status);
//                 const percentage = stats.totalProjects > 0 ? Math.round((count / stats.totalProjects) * 100) : 0;
                
//                 return (
//                   <div key={status} className="text-center group">
//                     <div className="relative mb-4 mx-auto w-24 h-24">
//                       <svg className="w-full h-full transform -rotate-90">
//                         <circle
//                           cx="48"
//                           cy="48"
//                           r="40"
//                           strokeWidth="8"
//                           stroke={info.color.replace('bg-', '').split('-')[0] === 'gray' ? '#e5e7eb' : `${info.color.replace('bg-', '').split('-')[0]}100`}
//                           fill="none"
//                         />
//                         <circle
//                           cx="48"
//                           cy="48"
//                           r="40"
//                           strokeWidth="8"
//                           stroke={info.color.replace('bg-', '')}
//                           fill="none"
//                           strokeDasharray={`${percentage * 2.51} 251`}
//                           className="transition-all duration-700"
//                         />
//                       </svg>
//                       <div className="absolute inset-0 flex items-center justify-center">
//                         <div className={`p-3 rounded-full ${info.bg} transition-transform group-hover:scale-110`}>
//                           {info.icon}
//                         </div>
//                       </div>
//                     </div>
//                     <div>
//                       <p className="text-2xl font-bold text-gray-900">{count}</p>
//                       <p className={`text-sm font-medium mt-1 ${info.text}`}>{info.label}</p>
//                       <p className="text-xs text-gray-500 mt-1">{percentage}% du total</p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* Technologies et Top Projets */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
//           {/* Technologies */}
//           <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
//             <div className="flex items-center justify-between mb-8">
//               <div>
//                 <h2 className="text-xl font-bold text-gray-900">Technologies Utilisées</h2>
//                 <p className="text-gray-600">Stack technique des projets</p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Code size={20} className="text-gray-400" />
//                 <span className="text-sm font-medium text-gray-700">{stats.technologies.length} technologies</span>
//               </div>
//             </div>
            
//             <div className="space-y-6">
//               {stats.technologies.length > 0 ? (
//                 stats.technologies.map((tech, index) => (
//                   <div key={index} className="group">
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="flex items-center gap-3">
//                         <div className={`p-2.5 rounded-lg ${index < 3 ? 'bg-blue-50' : 'bg-gray-50'} transition-colors group-hover:bg-blue-50`}>
//                           <Code size={18} className={index < 3 ? 'text-blue-600' : 'text-gray-600'} />
//                         </div>
//                         <div>
//                           <span className="font-semibold text-gray-900">{tech.name}</span>
//                           <p className="text-xs text-gray-500">{tech.count} projets</p>
//                         </div>
//                       </div>
//                       <span className="text-sm font-bold text-gray-900">{tech.percentage}%</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
//                       <div
//                         className={`h-2.5 rounded-full ${index < 3 ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-gray-400 to-gray-500'} transition-all duration-700`}
//                         style={{ width: `${tech.percentage}%` }}
//                       />
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-12">
//                   <Code size={56} className="mx-auto mb-4 text-gray-300" />
//                   <p className="text-gray-500 text-lg">Aucune technologie spécifiée</p>
//                   <p className="text-gray-400 text-sm mt-2">Les projets n'ont pas de technologies définies</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Top Projets */}
//           <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
//             <div className="flex items-center justify-between mb-8">
//               <div>
//                 <h2 className="text-xl font-bold text-gray-900">Projets Populaires</h2>
//                 <p className="text-gray-600">Classés par popularité</p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <TrendingUp size={20} className="text-gray-400" />
//                 <span className="text-sm font-medium text-gray-700">Top {stats.topProjects.length}</span>
//               </div>
//             </div>
            
//             <div className="space-y-4">
//               {stats.topProjects.length > 0 ? (
//                 stats.topProjects.map((project, index) => (
//                   <div key={project.id} className="group p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300">
//                     <div className="flex items-center gap-4">
//                       <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 font-bold text-lg">
//                         #{index + 1}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <h3 className="font-bold text-gray-900 truncate">{project.title}</h3>
//                         <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
//                           <span className="flex items-center gap-1">
//                             <Eye size={14} />
//                             {project.views || 0} vues
//                           </span>
//                           <span className="flex items-center gap-1">
//                             <Download size={14} />
//                             {project.likes || 0} likes
//                           </span>
//                           {project.author_name && (
//                             <span className="truncate">par {project.author_name}</span>
//                           )}
//                         </div>
//                       </div>
//                       <div className="flex flex-col items-end">
//                         <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                           project.is_approved ? 'bg-green-100 text-green-800' :
//                           project.is_published ? 'bg-blue-100 text-blue-800' :
//                           'bg-gray-100 text-gray-800'
//                         }`}>
//                           {project.is_approved ? 'Approuvé' : 
//                            project.is_published ? 'Publié' : 
//                            project.status || 'Draft'}
//                         </span>
//                         <span className="text-xs text-gray-500 mt-1">
//                           Score: {project.popularityScore || 0}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-12">
//                   <BarChart size={56} className="mx-auto mb-4 text-gray-300" />
//                   <p className="text-gray-500 text-lg">Aucun projet populaire</p>
//                   <p className="text-gray-400 text-sm mt-2">Les projets n'ont pas de métriques de popularité</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Informations API */}
//         <div className="mb-8">
//           <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 text-white">
//             <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
//               <div className="flex-1">
//                 <div className="flex items-center gap-4 mb-6">
//                   <div className="p-3 bg-white/10 rounded-xl">
//                     <Server size={28} className="text-green-400" />
//                   </div>
//                   <div>
//                     <h3 className="text-2xl font-bold">API Django REST Framework</h3>
//                     <p className="text-gray-300">Données synchronisées en temps réel</p>
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   <div className="p-4 bg-white/5 rounded-xl">
//                     <p className="text-sm text-gray-400">URL API</p>
//                     <p className="font-mono text-sm truncate">http://localhost:8000</p>
//                   </div>
//                   <div className="p-4 bg-white/5 rounded-xl">
//                     <p className="text-sm text-gray-400">Base de données</p>
//                     <p className="font-medium">PostgreSQL</p>
//                   </div>
//                   <div className="p-4 bg-white/5 rounded-xl">
//                     <p className="text-sm text-gray-400">Endpoint principal</p>
//                     <p className="font-mono text-sm">/api/projects/projects/</p>
//                   </div>
//                   <div className="p-4 bg-white/5 rounded-xl">
//                     <p className="text-sm text-gray-400">Statut</p>
//                     <div className="flex items-center gap-2">
//                       <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                       <span className="font-medium">En ligne</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="text-center lg:text-right">
//                 <div className="text-5xl font-bold mb-2">{stats.totalProjects}</div>
//                 <p className="text-gray-300">projets actifs</p>
//                 <p className="text-gray-400 text-sm mt-4">
//                   Synchronisé à {new Date().toLocaleTimeString('fr-FR', { 
//                     hour: '2-digit', 
//                     minute: '2-digit',
//                     second: '2-digit'
//                   })}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Debug section (optionnel) */}
//         {process.env.NODE_ENV === 'development' && (
//           <details className="mb-6">
//             <summary className="text-sm text-gray-600 font-medium cursor-pointer p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
//               Informations techniques & Debug
//             </summary>
//             <div className="mt-4 p-6 bg-gray-900 rounded-xl">
//               <div className="text-xs text-gray-300 space-y-4">
//                 <div>
//                   <h4 className="text-green-400 font-medium mb-2">Données récupérées:</h4>
//                   <pre className="whitespace-pre-wrap overflow-auto max-h-64 p-4 bg-gray-800 rounded-lg">
//                     {JSON.stringify({
//                       summary: {
//                         totalProjects: stats.totalProjects,
//                         totalUsers: stats.totalUsers,
//                         activeUsers: stats.activeUsers,
//                         statusDistribution: stats.projectsByStatus,
//                         technologiesCount: stats.technologies.length
//                       },
//                       apiStatus: apiStatus,
//                       sampleProjects: stats.projectsData.length > 0 ? stats.projectsData : 'Aucun',
//                       sampleUsers: stats.usersData.length > 0 ? stats.usersData : 'Aucun'
//                     }, null, 2)}
//                   </pre>
//                 </div>
                
//                 <div>
//                   <h4 className="text-blue-400 font-medium mb-2">Endpoints testés:</h4>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     {endpoints.map((endpoint, idx) => (
//                       <div key={idx} className="p-3 bg-gray-800 rounded-lg">
//                         <div className="flex items-center justify-between mb-2">
//                           <code className="text-xs truncate">{endpoint.url}</code>
//                           <span className={`px-2 py-1 text-xs rounded ${
//                             endpoint.status === 'available' 
//                               ? 'bg-green-900 text-green-300' 
//                               : 'bg-red-900 text-red-300'
//                           }`}>
//                             {endpoint.status === 'available' ? 'OK' : 'ERROR'}
//                           </span>
//                         </div>
//                         <div className="text-xs text-gray-400">
//                           {endpoint.name} • Status: {endpoint.code || 'N/A'}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </details>
//         )}

//         {/* Test manuel */}
//         <div className="flex justify-center">
//           <button
//             onClick={async () => {
//               console.log('🧪 Test manuel API Django...');
//               try {
//                 const response = await fetch('http://localhost:8000/api/projects/projects/');
//                 const data = await response.json();
//                 console.log('📊 Résultat API:', data);
//                 alert(`✅ API Django fonctionne! ${data.count} projets disponibles. Voir console pour détails.`);
//               } catch (err) {
//                 console.error('❌ Test API échoué:', err);
//                 alert(`❌ Erreur: ${err.message}`);
//               }
//             }}
//             className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:from-gray-900 hover:to-black transition-all duration-300 font-medium shadow-lg"
//           >
//             <Zap size={18} />
//             Tester l'API manuellement
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Analytics;


// src/components/admin/Analytics.jsx - VERSION COMPLÈTE
import React, { useState, useEffect } from 'react';
import { djangoApiService } from '../../services/api';
import {
  Users, Code, CheckCircle, Folder,
  Database, RefreshCw, Server, Download,
  Eye, TrendingUp, BarChart3, FileText,
  Calendar, Clock, Activity, AlertTriangle,
  ExternalLink, Wifi, WifiOff, Zap,
  Award, Target, BarChart, PieChart,
  Clock as ClockIcon, User, UserCheck,
  ChevronRight, Star, Flame, TrendingUp as TrendingUpIcon,
  Calendar as CalendarIcon
} from 'lucide-react';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);
  const [endpoints, setEndpoints] = useState([]);
  
  // Données réelles
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalUsers: 0,
    activeUsers: 0,
    projectsByStatus: {
      approved: 0,
      published: 0,
      pending: 0,
      draft: 0,
      rejected: 0
    },
    technologies: [],
    topProjects: [],
    recentProjects: [], // NOUVEAU: Projets récents
    dailyActivity: [],
    usersData: [],     // Données brutes utilisateurs
    projectsData: []   // Données brutes projets
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Chargement des données depuis Django API...');
      
      // 1. Vérifier l'état de l'API
      console.log('🔍 Vérification API Django...');
      const health = await djangoApiService.checkHealth();
      setApiStatus(health);
      
      console.log('🏥 État API:', health);
      
      if (health.status !== 'online') {
        throw new Error(`API Django non disponible: ${health.message}`);
      }
      
      // 2. Explorer les endpoints
      console.log('🔍 Exploration des endpoints...');
      const endpointsData = await djangoApiService.exploreEndpoints();
      setEndpoints(endpointsData);
      
      // 3. Récupérer les données
      console.log('📥 Récupération des données...');
      const [projects, users] = await Promise.all([
        djangoApiService.getProjects(),
        djangoApiService.getUsers()
      ]);
      
      console.log('✅ Données récupérées:', {
        projects: projects.length,
        users: users.length,
        sampleUser: users[0],
        sampleProject: projects[0]
      });
      
      if (!projects || !Array.isArray(projects)) {
        throw new Error('Format de données projets invalide');
      }
      
      // 4. Calculer les statistiques
      console.log('📊 Calcul des statistiques...');
      
      // Projets par statut (basé sur votre modèle Django)
      const statusCount = {
        approved: 0,
        published: 0,
        pending: 0,
        draft: 0,
        rejected: 0
      };
      
      projects.forEach(project => {
        // Utiliser les champs booléens de votre modèle
        if (project.is_approved) {
          statusCount.approved++;
        } else if (project.is_published) {
          statusCount.published++;
        } else if (project.is_pending) {
          statusCount.pending++;
        } else if (project.is_draft) {
          statusCount.draft++;
        } else if (project.is_rejected) {
          statusCount.rejected++;
        } else {
          // Fallback sur le champ status
          const status = project.status?.toLowerCase();
          if (status === 'approved') statusCount.approved++;
          else if (status === 'published') statusCount.published++;
          else if (status === 'pending') statusCount.pending++;
          else if (status === 'draft') statusCount.draft++;
          else if (status === 'rejected') statusCount.rejected++;
          else statusCount.draft++; // Par défaut
        }
      });
      
      // Technologies
      const techCount = {};
      projects.forEach(project => {
        if (project.technologies && typeof project.technologies === 'string') {
          project.technologies
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0)
            .forEach(tech => {
              techCount[tech] = (techCount[tech] || 0) + 1;
            });
        }
      });
      
      const technologies = Object.entries(techCount)
        .map(([name, count]) => ({ 
          name, 
          count,
          percentage: Math.round((count / projects.length) * 100)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);
      
      // Utilisateurs actifs
      const activeUsers = users.filter(u => u.is_active === true).length;
      
      // Projets récents (triés par date de création)
      const recentProjects = [...projects]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
        .map(project => ({
          ...project,
          daysAgo: calculateDaysAgo(project.created_at),
          formattedDate: formatDate(project.created_at)
        }));
      
      // Top projets (basés sur les vues/likes)
      const topProjects = projects
        .map(p => ({
          ...p,
          popularityScore: 
            (p.views || 0) * 1 +
            (p.likes || 0) * 2 +
            (p.is_approved ? 20 : 0) +
            (p.is_published ? 10 : 0),
          daysAgo: calculateDaysAgo(p.created_at),
          formattedDate: formatDate(p.created_at)
        }))
        .sort((a, b) => b.popularityScore - a.popularityScore)
        .slice(0, 3);
      
      // Activité quotidienne
      const dailyActivity = generateDailyActivity(projects);
      
      // 5. Mettre à jour l'état
      setStats({
        totalProjects: projects.length,
        totalUsers: users.length,
        activeUsers,
        projectsByStatus: statusCount,
        technologies,
        topProjects,
        recentProjects, // NOUVEAU
        dailyActivity,
        usersData: users.slice(0, 5), // Garder pour debug
        projectsData: projects.slice(0, 3)
      });
      
      console.log('🎉 Analytics chargés avec succès!', {
        projets: projects.length,
        utilisateurs: users.length,
        actifs: activeUsers,
        statuts: statusCount
      });
      
    } catch (err) {
      console.error('❌ Erreur chargement analytics:', err);
      setError(err.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Fonctions utilitaires
  const calculateDaysAgo = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    return `Il y a ${Math.floor(diffDays / 30)} mois`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const generateDailyActivity = (projects) => {
    const activity = [];
    const today = new Date();
    
    // 15 derniers jours
    for (let i = 14; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const projectsForDay = projects.filter(p => {
        if (!p.created_at) return false;
        try {
          const projectDate = new Date(p.created_at);
          return projectDate.toISOString().split('T')[0] === dateStr;
        } catch (e) {
          return false;
        }
      });
      
      activity.push({
        date: dateStr,
        count: projectsForDay.length,
        displayDate: date.toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'short' 
        })
      });
    }
    
    return activity;
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? <TrendingUp size={14} /> : <TrendingUp size={14} className="rotate-180" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color} transition-colors`}>
          <Icon size={24} className="text-gray-800" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex flex-col items-center justify-center min-h-[500px]">
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Server size={32} className="text-blue-600 animate-pulse" />
              </div>
            </div>
            <p className="text-xl font-semibold text-gray-800 mb-3">Connexion à Django API</p>
            <p className="text-gray-600 text-center max-w-md mb-6">
              Récupération des données depuis http://localhost:8000
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Connexion à l'API</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                <span>Récupération projets</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse delay-300"></div>
                <span>Analyse données</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* En-tête amélioré */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-xl ${apiStatus?.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {apiStatus?.status === 'online' ? <Wifi size={24} /> : <WifiOff size={24} />}
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Dashboard Analytics</h1>
                  <div className="flex items-center flex-wrap gap-3 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${apiStatus?.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {apiStatus?.status === 'online' ? '✅ API Django Connectée' : '❌ API Hors Ligne'}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {stats.totalProjects} projets
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      {stats.totalUsers} utilisateurs
                    </span>
                    <a 
                      href="http://localhost:8000/admin" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-gray-800 text-white rounded-full text-sm font-medium hover:bg-gray-900 transition-colors"
                    >
                      Admin Django
                    </a>
                  </div>
                </div>
              </div>
              
              {apiStatus?.status === 'online' && apiStatus?.projectsCount && (
                <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Données en temps réel</p>
                      <p className="text-gray-900">
                        Connecté à <code className="text-blue-600">http://localhost:8000</code>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {stats.totalUsers} utilisateurs • {stats.activeUsers} actifs
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Dernière mise à jour</p>
                      <p className="text-lg font-bold text-gray-900">{new Date().toLocaleTimeString('fr-FR')}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
          
          </div>
        </div>

        {/* État de l'API */}
        {apiStatus && (
          <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`col-span-1 lg:col-span-2 p-6 rounded-2xl ${apiStatus.status === 'online' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' : 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-xl ${apiStatus.status === 'online' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {apiStatus.status === 'online' ? <Server size={28} className="text-green-600" /> : <Server size={28} className="text-red-600" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {apiStatus.status === 'online' ? '✅ Backend Django Opérationnel' : '❌ Problème de Connexion'}
                  </h3>
                  <p className="text-gray-700 mt-1">{apiStatus.message}</p>
                  {apiStatus.suggestion && (
                    <p className="text-sm text-gray-600 mt-2">{apiStatus.suggestion}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{apiStatus.projectsCount || 0}</div>
                  <p className="text-sm text-gray-600">projets disponibles</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-white rounded-2xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Database size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Base de données</p>
                  <p className="text-lg font-bold text-gray-900">PostgreSQL</p>
                  <p className="text-xs text-gray-500">13 utilisateurs • 10 projets</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Projets Totaux"
            value={stats.totalProjects}
            icon={Folder}
            color="bg-gradient-to-br from-blue-50 to-blue-100"
            subtitle={`${stats.projectsByStatus.approved} approuvés • ${stats.projectsByStatus.pending} en attente`}
          />
          
          <StatCard
            title="Utilisateurs"
            value={stats.totalUsers}
            icon={Users}
            color="bg-gradient-to-br from-green-50 to-emerald-100"
            subtitle={`${stats.activeUsers} actifs • ${stats.totalUsers - stats.activeUsers} inactifs`}
          />
          
          <StatCard
            title="Taux d'Approximation"
            value={`${stats.totalProjects > 0 ? Math.round((stats.projectsByStatus.approved / stats.totalProjects) * 100) : 0}%`}
            icon={Award}
            color="bg-gradient-to-br from-amber-50 to-yellow-100"
            subtitle={`${stats.projectsByStatus.draft} brouillons`}
          />
          
          <StatCard
            title="Technologies"
            value={stats.technologies.length}
            icon={Code}
            color="bg-gradient-to-br from-purple-50 to-violet-100"
            subtitle={`${stats.technologies[0]?.name || 'Aucune'} (${stats.technologies[0]?.count || 0})`}
          />
        </div>

        {/* Technologies et Projets Récents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Technologies */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Technologies Utilisées</h2>
                <p className="text-gray-600">Stack technique des projets</p>
              </div>
              <div className="flex items-center gap-2">
                <Code size={20} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{stats.technologies.length} technologies</span>
              </div>
            </div>
            
            <div className="space-y-6">
              {stats.technologies.length > 0 ? (
                stats.technologies.map((tech, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${index < 3 ? 'bg-blue-50' : 'bg-gray-50'} transition-colors group-hover:bg-blue-50`}>
                          <Code size={18} className={index < 3 ? 'text-blue-600' : 'text-gray-600'} />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">{tech.name}</span>
                          <p className="text-xs text-gray-500">{tech.count} projets</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{tech.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full ${index < 3 ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-gray-400 to-gray-500'} transition-all duration-700`}
                        style={{ width: `${tech.percentage}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Code size={56} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 text-lg">Aucune technologie spécifiée</p>
                  <p className="text-gray-400 text-sm mt-2">Les projets n'ont pas de technologies définies</p>
                </div>
              )}
            </div>
          </div>

          {/* PROJETS RÉCENTS - REMPLACEMENT */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Projets Récents</h2>
                <p className="text-gray-600">Derniers projets ajoutés</p>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon size={20} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Derniers {stats.recentProjects.length}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {stats.recentProjects.length > 0 ? (
                stats.recentProjects.map((project, index) => (
                  <div key={project.id} className="group p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${index === 0 ? 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700' : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700'}`}>
                          {index === 0 ? <Flame size={20} /> : <CalendarIcon size={20} />}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900 truncate">{project.title}</h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.description}</p>
                          </div>
                          <div className="flex-shrink-0 ml-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              project.is_approved ? 'bg-green-100 text-green-800' :
                              project.is_published ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {project.is_approved ? 'Approuvé' : 
                               project.is_published ? 'Publié' : 
                               project.status || 'Draft'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <ClockIcon size={14} />
                            {project.daysAgo}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span>{project.formattedDate}</span>
                          <span className="text-gray-400">•</span>
                          {project.author_name && (
                            <span className="truncate">par {project.author_name}</span>
                          )}
                          <span className="text-gray-400">•</span>
                          <span className="flex items-center gap-1">
                            <Eye size={14} />
                            {project.views || 0} vues
                          </span>
                        </div>
                        
                        {project.technologies && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {project.technologies
                              .split(',')
                              .slice(0, 3)
                              .map((tech, techIndex) => (
                                <span key={techIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                  {tech.trim()}
                                </span>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <CalendarIcon size={56} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 text-lg">Aucun projet récent</p>
                  <p className="text-gray-400 text-sm mt-2">Aucun projet n'a été ajouté récemment</p>
                </div>
              )}
            </div>
            
            {stats.recentProjects.length > 0 && (
              <div className="pt-6 mt-6 border-t border-gray-200">
                <button
                  onClick={() => window.location.href = '/admin/projects'}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm font-medium"
                >
                  <Folder size={16} />
                  Voir tous les projets
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Top Projets (optionnel - peut être caché ou conservé) */}
        {stats.topProjects.length > 0 && (
          <div className="mb-10">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Projets Populaires</h2>
                  <p className="text-gray-600">Les plus consultés et likés</p>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUpIcon size={20} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Top {stats.topProjects.length}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.topProjects.map((project, index) => (
                  <div key={project.id} className="group p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-50 to-amber-100 text-yellow-700' :
                          index === 1 ? 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700' :
                          'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700'
                        }`}>
                          {index === 0 ? <Star size={20} /> : 
                           index === 1 ? <TrendingUpIcon size={20} /> : 
                           <Flame size={20} />}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          project.is_approved ? 'bg-green-100 text-green-800' :
                          project.is_published ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {project.is_approved ? 'Approuvé' : 
                           project.is_published ? 'Publié' : 
                           project.status || 'Draft'}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{project.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">{project.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Popularité</span>
                          <span className="font-bold text-gray-900">{project.popularityScore || 0} pts</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Eye size={14} />
                              {project.views || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star size={14} />
                              {project.likes || 0}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">{project.daysAgo}</span>
                        </div>
                        
                        {project.author_name && (
                          <div className="text-sm text-gray-600 truncate">
                            par {project.author_name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Informations API */}
        {/* <div className="mb-8">
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 text-white">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <Server size={28} className="text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">API Django REST Framework</h3>
                    <p className="text-gray-300">Données synchronisées en temps réel</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-sm text-gray-400">URL API</p>
                    <p className="font-mono text-sm truncate">http://localhost:8000</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-sm text-gray-400">Projets</p>
                    <p className="font-medium text-lg">{stats.totalProjects}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-sm text-gray-400">Utilisateurs</p>
                    <p className="font-medium text-lg">{stats.totalUsers}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-sm text-gray-400">Statut</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">En ligne</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center lg:text-right">
                <div className="text-5xl font-bold mb-2">{stats.totalProjects}</div>
                <p className="text-gray-300">projets actifs</p>
                <p className="text-gray-400 text-sm mt-4">
                  {stats.totalUsers} utilisateurs • {stats.activeUsers} actifs
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Synchronisé à {new Date().toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Bouton pour tester manuellement */}
        {/* <div className="flex justify-center">
          <button
            onClick={async () => {
              console.log('🧪 Test manuel API Django...');
              try {
                const response = await fetch('http://localhost:8000/api/projects/projects/');
                const data = await response.json();
                console.log('📊 Résultat API:', data);
                alert(`✅ API Django fonctionne! ${data.count} projets disponibles. Voir console pour détails.`);
              } catch (err) {
                console.error('❌ Test API échoué:', err);
                alert(`❌ Erreur: ${err.message}`);
              }
            }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:from-gray-900 hover:to-black transition-all duration-300 font-medium shadow-lg"
          >
            <Zap size={18} />
            Tester l'API manuellement
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Analytics;