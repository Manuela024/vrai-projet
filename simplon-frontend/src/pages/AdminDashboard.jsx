// AdminDashboard.jsx
import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 10,
    projects: 2,
    resolvedIssues: 4,
    performance: 100
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      title: "Erreur d'encodage UTF-8 résolue",
      time: "Il y a 2 heures",
      icon: "✅",
      type: "success"
    },
    {
      id: 2,
      title: "Nettoyage du cache Django effectué",
      time: "Il y a 3 heures",
      icon: "🔧",
      type: "info"
    },
    {
      id: 3,
      title: "Migration des données vers PostgreSQL",
      time: "Il y a 4 heures",
      icon: "🗃️",
      type: "success"
    },
    {
      id: 4,
      title: "Problème de connexion PostgreSQL résolu",
      time: "Il y a 5 heures",
      icon: "🔒",
      type: "success"
    }
  ]);

  const [systemStatus, setSystemStatus] = useState([
    {
      id: 1,
      title: "Base de données PostgreSQL opérationnelle",
      description: "Connexion stable et performante",
      status: "operational"
    },
    {
      id: 2,
      title: "Encodage UTF-8 correctement configuré",
      description: "Plus de problèmes de caractères spéciaux",
      status: "operational"
    },
    {
      id: 3,
      title: "Application prête pour la production",
      description: "Toutes les données ont été migrées",
      status: "operational"
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-blue-800 shadow-lg">
        <div className="flex items-center justify-center h-16 bg-blue-900">
          <h1 className="text-white text-xl font-semibold">Admin Django</h1>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            <a href="#" className="flex items-center px-4 py-3 text-white bg-blue-900 rounded-lg">
              <span className="mr-3">📊</span>
              Tableau de bord
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-blue-100 hover:bg-blue-700 rounded-lg transition-colors">
              <span className="mr-3">👥</span>
              Utilisateurs
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-blue-100 hover:bg-blue-700 rounded-lg transition-colors">
              <span className="mr-3">📂</span>
              Projets
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-blue-100 hover:bg-blue-700 rounded-lg transition-colors">
              <span className="mr-3">🔧</span>
              Paramètres
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-blue-100 hover:bg-blue-700 rounded-lg transition-colors">
              <span className="mr-3">📝</span>
              Journal
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-8 py-4">
            <h2 className="text-2xl font-semibold text-gray-800">Tableau de bord</h2>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Administrateur</span>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">
          {/* Status Panel */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-sm text-gray-500 mb-2">Base de données</div>
              <div className="text-2xl font-semibold text-green-600">PostgreSQL</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-sm text-gray-500 mb-2">Encodage</div>
              <div className="text-2xl font-semibold text-green-600">UTF-8</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-sm text-gray-500 mb-2">Environnement</div>
              <div className="text-2xl font-semibold text-yellow-600">Production</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-sm text-gray-500 mb-2">Performance</div>
              <div className="text-2xl font-semibold text-green-600">Optimale</div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Utilisateurs</h3>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  👥
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-800">{stats.users}</div>
              <p className="text-sm text-gray-500 mt-2">+2 depuis la dernière migration</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Projets</h3>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white">
                  📂
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-800">{stats.projects}</div>
              <p className="text-sm text-gray-500 mt-2">Tous actifs</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Erreurs résolues</h3>
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white">
                  ✅
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-800">{stats.resolvedIssues}</div>
              <p className="text-sm text-gray-500 mt-2">Dernière: Encodage UTF-8</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Performance</h3>
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center text-white">
                  🚀
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-800">{stats.performance}%</div>
              <p className="text-sm text-gray-500 mt-2">Optimisé avec PostgreSQL</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b">Activité récente</h3>
              <div className="space-y-4">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{activity.title}</h4>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-3 border-b">État du système</h3>
              <div className="space-y-4">
                {systemStatus.map(status => (
                  <div key={status.id} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      status.status === 'operational' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {status.status === 'operational' ? '✓' : '⚠'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{status.title}</h4>
                      <p className="text-sm text-gray-500">{status.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Actions rapides</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <span>👥</span>
                <span>Gérer utilisateurs</span>
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <span>📂</span>
                <span>Voir projets</span>
              </button>
              <button className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <span>📊</span>
                <span>Statistiques</span>
              </button>
              <button className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <span>⚙️</span>
                <span>Paramètres</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;