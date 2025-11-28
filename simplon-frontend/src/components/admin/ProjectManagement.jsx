import React, { useState, useEffect } from 'react';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Données mockées
    const mockProjects = [
      {
        id: 1,
        title: "Site E-commerce React",
        author: "Jean Dupont",
        technologies: ["React", "Node.js", "MongoDB"],
        status: "approved",
        downloads: 45,
        views: 230,
        created_at: "2024-05-23",
        cohort: "Développeur Web 2024"
      },
      {
        id: 2,
        title: "Application de Gestion de Tâches",
        author: "Marie Martin",
        technologies: ["Vue.js", "Firebase"],
        status: "pending",
        downloads: 0,
        views: 15,
        created_at: "2024-06-01",
        cohort: "Data Analyst 2024"
      },
      {
        id: 3,
        title: "API REST avec Express",
        author: "Pierre Lambert",
        technologies: ["Node.js", "Express", "PostgreSQL"],
        status: "rejected",
        downloads: 0,
        views: 8,
        created_at: "2024-05-28",
        cohort: "Développeur Web 2024"
      }
    ];

    setProjects(mockProjects);
    setLoading(false);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Approuvé';
      case 'pending':
        return 'En attente';
      case 'rejected':
        return 'Rejeté';
      default:
        return 'Inconnu';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E30613]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#001F3F] dark:text-white">
          Gestion des Projets
        </h1>
        <div className="flex gap-2">
          <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium">
            Exporter
          </button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1a2f44] rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-[#001F3F] dark:text-white">{projects.length}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
        </div>
        <div className="bg-white dark:bg-[#1a2f44] rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {projects.filter(p => p.status === 'approved').length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Approuvés</div>
        </div>
        <div className="bg-white dark:bg-[#1a2f44] rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {projects.filter(p => p.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">En attente</div>
        </div>
        <div className="bg-white dark:bg-[#1a2f44] rounded-lg p-4 shadow-sm">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {projects.filter(p => p.status === 'rejected').length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Rejetés</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Rechercher un projet..."
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
          />
          <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white">
            <option value="">Tous les statuts</option>
            <option value="approved">Approuvé</option>
            <option value="pending">En attente</option>
            <option value="rejected">Rejeté</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white">
            <option value="">Toutes les cohortes</option>
            <option value="web">Développeur Web</option>
            <option value="data">Data Analyst</option>
          </select>
        </div>
      </div>

      {/* Liste des projets */}
      <div className="bg-white dark:bg-[#1a2f44] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#0d1a29]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Projet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Auteur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Technologies
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statistiques
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-[#0d1a29] transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-[#001F3F] dark:text-white">
                      {project.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {project.cohort}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {project.author}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div>📥 {project.downloads} téléchargements</div>
                      <div>👁️ {project.views} vues</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" title="Voir">
                        <span className="material-symbols-outlined text-lg">visibility</span>
                      </button>
                      <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300" title="Approuver">
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Rejeter">
                        <span className="material-symbols-outlined text-lg">cancel</span>
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300" title="Supprimer">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectManagement;