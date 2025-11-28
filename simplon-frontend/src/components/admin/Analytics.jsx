import React from 'react';

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#001F3F] dark:text-white">
          Statistiques et Analytics
        </h1>
        <div className="flex gap-2">
          <button className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#E30613]/90 transition-colors font-medium">
            <span className="material-symbols-outlined align-middle mr-2">download</span>
            Exporter les données
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique d'activité */}
        <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#001F3F] dark:text-white mb-4">
            Activité des 30 derniers jours
          </h2>
          <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Graphique d'activité à implémenter</p>
          </div>
        </div>

        {/* Technologies populaires */}
        <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#001F3F] dark:text-white mb-4">
            Technologies Populaires
          </h2>
          <div className="space-y-3">
            {[
              { name: 'React', count: 45, color: 'bg-blue-500' },
              { name: 'Node.js', count: 38, color: 'bg-green-500' },
              { name: 'Python', count: 32, color: 'bg-yellow-500' },
              { name: 'Vue.js', count: 28, color: 'bg-emerald-500' },
              { name: 'Express', count: 25, color: 'bg-gray-500' }
            ].map((tech, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${tech.color}`}></div>
                  <span className="text-sm font-medium text-[#001F3F] dark:text-white">
                    {tech.name}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {tech.count} projets
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Répartition par cohorte */}
        <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#001F3F] dark:text-white mb-4">
            Répartition par Cohorte
          </h2>
          <div className="space-y-3">
            {[
              { name: 'Développeur Web 2024', count: 124, color: 'bg-[#E30613]' },
              { name: 'Data Analyst 2024', count: 89, color: 'bg-blue-500' },
              { name: 'Développeur Web 2023', count: 67, color: 'bg-green-500' },
              { name: 'Data Analyst 2023', count: 45, color: 'bg-purple-500' }
            ].map((cohort, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${cohort.color}`}></div>
                  <span className="text-sm font-medium text-[#001F3F] dark:text-white">
                    {cohort.name}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {cohort.count} utilisateurs
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top projets */}
        <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#001F3F] dark:text-white mb-4">
            Top Projets
          </h2>
          <div className="space-y-3">
            {[
              { name: 'Site E-commerce React', downloads: 45, author: 'Jean Dupont' },
              { name: 'App TaskMaster', downloads: 38, author: 'Marie Martin' },
              { name: 'API REST Express', downloads: 32, author: 'Pierre Lambert' },
              { name: 'Dashboard Analytics', downloads: 28, author: 'Sophie Bernard' },
              { name: 'Jeux en JavaScript', downloads: 25, author: 'Luc Petit' }
            ].map((project, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-[#001F3F] dark:text-white">
                    {project.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    par {project.author}
                  </p>
                </div>
                <span className="text-sm font-medium text-[#E30613]">
                  {project.downloads} 📥
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;