// import React, { useState, useEffect } from 'react';
// import MetricCard from './MetricCard';

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalProjects: 0,
//     totalDownloads: 0,
//     pendingModeration: 0
//   });

//   const [recentActivity, setRecentActivity] = useState([]);

//   useEffect(() => {
//     // Données mockées pour commencer - à remplacer par l'API réelle
//     setStats({
//       totalUsers: 1247,
//       totalProjects: 543,
//       totalDownloads: 2891,
//       pendingModeration: 23
//     });

//     setRecentActivity([
//       {
//         id: 1,
//         user: 'Jean Dupont',
//         action: 'a déposé un projet',
//         project: 'Site E-commerce React',
//         time: 'Il y a 5 min',
//         type: 'project'
//       },
//       {
//         id: 2,
//         user: 'Marie Martin', 
//         action: 's\'est inscrite',
//         time: 'Il y a 15 min',
//         type: 'user'
//       },
//       {
//         id: 3,
//         user: 'Admin',
//         action: 'a approuvé un projet',
//         project: 'App TaskMaster',
//         time: 'Il y a 1 heure',
//         type: 'moderation'
//       }
//     ]);
//   }, []);

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <MetricCard
//           title="Utilisateurs Totaux"
//           value={stats.totalUsers.toLocaleString()}
//           trend="+12% ce mois"
//           icon="people"
//           color="blue"
//         />
//         <MetricCard
//           title="Projets Déposés"
//           value={stats.totalProjects.toLocaleString()}
//           trend="+8% ce mois"
//           icon="folder"
//           color="green"
//         />
//         <MetricCard
//           title="Téléchargements"
//           value={stats.totalDownloads.toLocaleString()}
//           trend="+15% ce mois"
//           icon="download"
//           color="orange"
//         />
//         <MetricCard
//           title="En Attente"
//           value={stats.pendingModeration}
//           trend="À modérer"
//           icon="warning"
//           color="red"
//         />
//       </div>

//       {/* Activité Récente */}
//       <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-6 shadow-sm">
//         <h2 className="text-lg font-semibold text-[#001F3F] dark:text-white mb-4">
//           Activité Récente
//         </h2>
//         <div className="space-y-3">
//           {recentActivity.map((activity) => (
//             <div key={activity.id} className="flex items-center gap-4 p-3 border border-gray-100 dark:border-gray-700 rounded-lg">
//               <div className={`p-2 rounded-full ${
//                 activity.type === 'project' ? 'bg-blue-100 dark:bg-blue-900/20' :
//                 activity.type === 'user' ? 'bg-green-100 dark:bg-green-900/20' :
//                 'bg-orange-100 dark:bg-orange-900/20'
//               }`}>
//                 <span className={`material-symbols-outlined text-sm ${
//                   activity.type === 'project' ? 'text-blue-600 dark:text-blue-400' :
//                   activity.type === 'user' ? 'text-green-600 dark:text-green-400' :
//                   'text-orange-600 dark:text-orange-400'
//                 }`}>
//                   {activity.type === 'project' ? 'folder' :
//                    activity.type === 'user' ? 'person_add' : 'verified'}
//                 </span>
//               </div>
//               <div className="flex-1">
//                 <p className="text-sm text-[#001F3F] dark:text-white">
//                   <strong>{activity.user}</strong> {activity.action}
//                   {activity.project && <strong> "{activity.project}"</strong>}
//                 </p>
//                 <p className="text-xs text-gray-500 dark:text-gray-400">
//                   {activity.time}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-6 shadow-sm">
//         <h2 className="text-lg font-semibold text-[#001F3F] dark:text-white mb-4">
//           Actions Rapides
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#0d1a29] transition-colors">
//             <span className="material-symbols-outlined text-[#E30613]">warning</span>
//             <span className="text-sm font-medium text-[#001F3F] dark:text-white">
//               Vérifier les projets en attente
//             </span>
//           </button>
//           <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#0d1a29] transition-colors">
//             <span className="material-symbols-outlined text-[#E30613]">person_add</span>
//             <span className="text-sm font-medium text-[#001F3F] dark:text-white">
//               Ajouter un utilisateur
//             </span>
//           </button>
//           <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#0d1a29] transition-colors">
//             <span className="material-symbols-outlined text-[#E30613]">analytics</span>
//             <span className="text-sm font-medium text-[#001F3F] dark:text-white">
//               Voir les statistiques détaillées
//             </span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import MetricCard from "./MetricCard";
// import { projectService } from "../services/projects";
// import { authService } from "../services/auth";
// CORRECTION : Utilisez "../../services/projects" au lieu de "../services/projects"
import { projectService } from "../../services/projects";
import { authService } from "../../services/auth";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalDownloads: 0,
    pendingModeration: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [topProjects, setTopProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Vérifier les permissions admin
      authService.checkAdminPermission();

      // Récupérer toutes les données en parallèle
      const [
        usersData,
        projectsData,
        downloadsData,
        pendingData,
        activityData,
        topProjectsData
      ] = await Promise.all([
        authService.getTotalUsers(),
        projectService.getTotalProjects(),
        projectService.getTotalDownloads(),
        projectService.getPendingProjects(),
        projectService.getRecentActivity(),
        projectService.getTopDownloadedProjects(3)
      ]);

      // Mettre à jour les statistiques principales
      setStats({
        totalUsers: usersData.total || usersData.count || 0,
        totalProjects: projectsData.total || projectsData.count || 0,
        totalDownloads: downloadsData.total || downloadsData.count || 0,
        pendingModeration: Array.isArray(pendingData) ? pendingData.length : (pendingData.pending || pendingData.count || 0)
      });

      // Mettre à jour l'activité récente
      if (Array.isArray(activityData)) {
        setRecentActivity(activityData.slice(0, 5));
      } else {
        setRecentActivity(projectService.getMockRecentActivity().slice(0, 5));
      }

      // Mettre à jour les projets populaires
      if (Array.isArray(topProjectsData)) {
        setTopProjects(topProjectsData);
      } else {
        setTopProjects(projectService.getMockTopProjects());
      }

    } catch (err) {
      console.error('Erreur lors du chargement du dashboard:', err);
      
      if (err.message.includes('droits administrateur')) {
        setError('Accès refusé. Droits administrateur requis.');
        navigate('/unauthorized');
        return;
      }

      setError('Erreur lors du chargement des données. Utilisation des données de démonstration.');
      
      // Données mockées en cas d'erreur
      setStats({
        totalUsers: 1247,
        totalProjects: 543,
        totalDownloads: 2891,
        pendingModeration: 23
      });

      setRecentActivity(projectService.getMockRecentActivity().slice(0, 5));
      setTopProjects(projectService.getMockTopProjects());
      
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'moderation':
        navigate('/admin/projects?status=pending');
        break;
      case 'add-user':
        navigate('/admin/users/new');
        break;
      case 'analytics':
        navigate('/admin/analytics');
        break;
      case 'users':
        navigate('/admin/users');
        break;
      default:
        break;
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      project: 'folder',
      user: 'person_add',
      moderation: 'verified',
      download: 'download',
      update: 'update'
    };
    return icons[type] || 'notifications';
  };

  const getActivityColor = (type) => {
    const colors = {
      project: 'blue',
      user: 'green',
      moderation: 'orange',
      download: 'purple',
      update: 'cyan'
    };
    return colors[type] || 'gray';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E30613]"></div>
        <span className="ml-3 text-[#001F3F] dark:text-white">Chargement du tableau de bord...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#001F3F] dark:text-white">
          Tableau de Bord Administrateur
        </h1>
        <button 
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2 bg-[#E30613] text-white rounded-lg hover:bg-[#c40511] transition-colors"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          Actualiser
        </button>
      </div>

      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <strong>Note: </strong> {error}
        </div>
      )}

      {/* Cartes de métriques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Utilisateurs Totaux"
          value={stats.totalUsers.toLocaleString()}
          trend="+12% ce mois"
          icon="people"
          color="blue"
          description="Nombre total d'utilisateurs inscrits sur l'application"
        />
        <MetricCard
          title="Projets Déposés"
          value={stats.totalProjects.toLocaleString()}
          trend="+8% ce mois"
          icon="folder"
          color="green"
          description="Nombre total de projets déposés sur l'application"
        />
        <MetricCard
          title="Téléchargements"
          value={stats.totalDownloads.toLocaleString()}
          trend="+15% ce mois"
          icon="download"
          color="orange"
          description="Nombre total de projets téléchargés par les utilisateurs"
        />
        <MetricCard
          title="En Attente"
          value={stats.pendingModeration}
          trend="À modérer"
          icon="warning"
          color="red"
          description="Projets en attente de modération"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activité Récente */}
        <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#001F3F] dark:text-white">
              Activité Récente
            </h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {recentActivity.length} activités
            </span>
          </div>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#0d1a29] transition-colors">
                  <div className={`p-2 rounded-full ${
                    getActivityColor(activity.type) === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
                    getActivityColor(activity.type) === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
                    getActivityColor(activity.type) === 'orange' ? 'bg-orange-100 dark:bg-orange-900/20' :
                    getActivityColor(activity.type) === 'purple' ? 'bg-purple-100 dark:bg-purple-900/20' :
                    'bg-cyan-100 dark:bg-cyan-900/20'
                  }`}>
                    <span className={`material-symbols-outlined text-sm ${
                      getActivityColor(activity.type) === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                      getActivityColor(activity.type) === 'green' ? 'text-green-600 dark:text-green-400' :
                      getActivityColor(activity.type) === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                      getActivityColor(activity.type) === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                      'text-cyan-600 dark:text-cyan-400'
                    }`}>
                      {getActivityIcon(activity.type)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#001F3F] dark:text-white truncate">
                      <strong>{activity.user}</strong> {activity.action}
                      {activity.project && (
                        <strong className="ml-1">"{activity.project}"</strong>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                Aucune activité récente
              </p>
            )}
          </div>
        </div>

        {/* Projets Populaires */}
        <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#001F3F] dark:text-white mb-4">
            Projets les plus Téléchargés
          </h2>
          <div className="space-y-4">
            {topProjects.length > 0 ? (
              topProjects.map((project, index) => (
                <div key={project.id} className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-[#E30613] text-white rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#001F3F] dark:text-white truncate">
                        {project.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {project.author_name} • {project.technologies}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                    <span className="material-symbols-outlined text-sm">download</span>
                    <span className="text-sm font-medium">{project.download_count}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                Aucun projet populaire
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Actions Rapides */}
      <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#001F3F] dark:text-white mb-4">
          Actions Rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => handleQuickAction('moderation')}
            className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#0d1a29] transition-colors group"
          >
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg group-hover:bg-red-200 dark:group-hover:bg-red-900/30">
              <span className="material-symbols-outlined text-[#E30613]">warning</span>
            </div>
            <div className="text-left">
              <span className="text-sm font-medium text-[#001F3F] dark:text-white block">
                Modération
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {stats.pendingModeration} en attente
              </span>
            </div>
          </button>
          
          <button 
            onClick={() => handleQuickAction('users')}
            className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#0d1a29] transition-colors group"
          >
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30">
              <span className="material-symbols-outlined text-[#E30613]">group</span>
            </div>
            <div className="text-left">
              <span className="text-sm font-medium text-[#001F3F] dark:text-white block">
                Utilisateurs
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Gérer les comptes
              </span>
            </div>
          </button>
          
          <button 
            onClick={() => handleQuickAction('add-user')}
            className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#0d1a29] transition-colors group"
          >
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/30">
              <span className="material-symbols-outlined text-[#E30613]">person_add</span>
            </div>
            <div className="text-left">
              <span className="text-sm font-medium text-[#001F3F] dark:text-white block">
                Ajouter
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Nouvel utilisateur
              </span>
            </div>
          </button>
          
          <button 
            onClick={() => handleQuickAction('analytics')}
            className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#0d1a29] transition-colors group"
          >
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-900/30">
              <span className="material-symbols-outlined text-[#E30613]">analytics</span>
            </div>
            <div className="text-left">
              <span className="text-sm font-medium text-[#001F3F] dark:text-white block">
                Analytics
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Statistiques détaillées
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;