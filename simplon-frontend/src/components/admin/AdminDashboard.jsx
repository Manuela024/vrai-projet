
// // src/components/admin/AdminDashboard.jsx - VERSION SANS SIDEBAR
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";
// import { 
//   LayoutDashboard, FolderPlus, Compass, Users, 
//   Kanban, BarChart3, User, Settings,
//   Filter, Search, UserPlus, Upload,
//   ArrowRight, PlusCircle
// } from 'lucide-react';
// import api from "../../services/api";
// import authService from "../../services/auth";

// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [showAddMatriculesModal, setShowAddMatriculesModal] = useState(false);
//   const [matriculeInput, setMatriculeInput] = useState('');
//   const [selectedMatricules, setSelectedMatricules] = useState([]);

//   // Données
//   const [stats, setStats] = useState({
//     totalProjects: 0,
//     published: 0,
//     pending: 0,
//     totalUsers: 0,
//     activeUsers: 0,
//     myProjects: 0
//   });

//   const [myProjects, setMyProjects] = useState([]);
//   const [recentActivity, setRecentActivity] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const user = authService.getCurrentUser();
//       setCurrentUser(user);
      
//       if (!user || !(user.is_staff || user.is_superuser)) {
//         navigate('/dashboard');
//         return;
//       }

//       try {
//         // Récupérer les projets de l'admin
//         const projectsRes = await api.get(`/api/projects/?author=${user.id}&limit=6&ordering=-created_at`);
//         const projectsData = projectsRes.data.results || projectsRes.data;
//         setMyProjects(projectsData);

//         // Récupérer tous les projets pour les stats
//         const allProjectsRes = await api.get('/api/projects/?limit=100');
//         const allProjectsData = allProjectsRes.data.results || allProjectsRes.data;
        
//         // Calculer les stats
//         const published = allProjectsData.filter(p => p.status === 'published').length;
//         const pending = allProjectsData.filter(p => p.status === 'pending').length;

//         // Récupérer les utilisateurs
//         const usersRes = await api.get('/api/users/?limit=100');
//         const usersData = usersRes.data.results || usersRes.data;
//         const activeUsers = usersData.filter(u => u.is_active).length;

//         setStats({
//           totalProjects: allProjectsData.length,
//           published,
//           pending,
//           totalUsers: usersData.length,
//           activeUsers,
//           myProjects: projectsData.length
//         });

//         // Générer l'activité récente
//         generateRecentActivity(allProjectsData);

//       } catch (error) {
//         console.log('Mode démo activé');
//         loadDemoData();
//       }

//     } catch (error) {
//       console.error('Erreur:', error);
//       loadDemoData();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadDemoData = () => {
//     const user = authService.getCurrentUser() || { 
//       id: 1, 
//       username: 'admin', 
//       first_name: 'Admin',
//       last_name: 'System',
//       email: 'admin@simplon.com'
//     };
//     setCurrentUser(user);
    
//     const demoProjects = [
//       {
//         id: 1,
//         title: 'API E-commerce',
//         author: { id: 1, username: 'admin', first_name: 'Admin', last_name: 'System' },
//         status: 'published',
//         created_at: '2023-10-12T10:30:00Z',
//         technologies: ['Node.js', 'MongoDB', 'Express'],
//         downloads: 42,
//         views: 156
//       },
//       {
//         id: 2,
//         title: 'Portfolio App',
//         author: { id: 1, username: 'admin', first_name: 'Admin', last_name: 'System' },
//         status: 'published',
//         created_at: '2023-10-05T14:20:00Z',
//         technologies: ['React', 'Tailwind', 'Framer Motion'],
//         downloads: 28,
//         views: 89
//       },
//       {
//         id: 3,
//         title: 'Data Scraper',
//         author: { id: 1, username: 'admin', first_name: 'Admin', last_name: 'System' },
//         status: 'published',
//         created_at: '2023-09-28T09:15:00Z',
//         technologies: ['Python', 'Scrapy', 'Pandas'],
//         downloads: 31,
//         views: 112
//       },
//       {
//         id: 4,
//         title: 'Application RH',
//         author: { id: 1, username: 'admin', first_name: 'Admin', last_name: 'System' },
//         status: 'pending',
//         created_at: '2023-09-15T11:45:00Z',
//         technologies: ['PHP', 'Laravel', 'MySQL'],
//         downloads: 0,
//         views: 45
//       }
//     ];
    
//     setMyProjects(demoProjects);
//     setStats({
//       totalProjects: 156,
//       published: 132,
//       pending: 24,
//       totalUsers: 124,
//       activeUsers: 89,
//       myProjects: demoProjects.length
//     });
    
//     const activity = [
//       {
//         id: 1,
//         user: 'Marie Leroy',
//         action: 'a soumis un projet',
//         project: 'Dashboard Analytics',
//         time: 'Il y a 2 heures'
//       },
//       {
//         id: 2,
//         user: 'Thomas Martin',
//         action: 's\'est inscrit',
//         time: 'Il y a 4 heures'
//       },
//       {
//         id: 3,
//         user: 'Sophie Dupont',
//         action: 'a publié un projet',
//         project: 'Système de Réservation',
//         time: 'Hier'
//       }
//     ];
//     setRecentActivity(activity);
//   };

//   const generateRecentActivity = (projectsData) => {
//     const recentProjects = projectsData.slice(0, 3);
//     const activity = recentProjects.map((project, index) => ({
//       id: index + 1,
//       user: `${project.author?.first_name || 'Utilisateur'} ${project.author?.last_name || ''}`.trim(),
//       action: project.status === 'published' ? 'a publié un projet' : 'a soumis un projet',
//       project: project.title,
//       time: formatTimeAgo(project.created_at)
//     }));
//     setRecentActivity(activity);
//   };

//   const handleAddMatricule = () => {
//     if (matriculeInput.trim() && !selectedMatricules.includes(matriculeInput.trim())) {
//       setSelectedMatricules([...selectedMatricules, matriculeInput.trim()]);
//       setMatriculeInput('');
//     }
//   };

//   const handleRemoveMatricule = (index) => {
//     const newMatricules = [...selectedMatricules];
//     newMatricules.splice(index, 1);
//     setSelectedMatricules(newMatricules);
//   };

//   const handleSaveMatricules = async () => {
//     try {
//       // Envoyer les matricules au backend
//       await api.post('/api/admin/authorized-matricules/', {
//         matricules: selectedMatricules
//       });
      
//       alert(`${selectedMatricules.length} matricule(s) ajouté(s) avec succès !`);
//       setShowAddMatriculesModal(false);
//       setSelectedMatricules([]);
//       setMatriculeInput('');
//     } catch (error) {
//       console.error('Erreur lors de l\'ajout des matricules:', error);
//       alert('Erreur lors de l\'ajout des matricules');
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('fr-FR', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   };

//   const formatTimeAgo = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffMs = now - date;
//     const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
//     if (diffHours < 1) {
//       return 'À l\'instant';
//     } else if (diffHours < 24) {
//       return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
//     } else {
//       const diffDays = Math.floor(diffHours / 24);
//       return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background-light dark:bg-background-dark">
//         <div className="max-w-6xl mx-auto px-10 py-12">
//           <div className="text-center py-20">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
//             <p className="text-gray-600 dark:text-gray-400">Chargement du dashboard...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
//       {/* Main Content Area */}
//       <main className="flex-1 overflow-y-auto bg-white dark:bg-background-dark">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           {/* Header avec infos utilisateur */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-navy dark:text-white">
//                 Tableau de Bord Admin
//               </h1>
//               <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
//                 Connecté en tant que: {currentUser?.first_name || 'Admin'} {currentUser?.last_name || 'System'} • Super Admin
//               </p>
//             </div>
//           </div>

//           {/* Action Header */}
//           <div className="flex flex-wrap gap-4 mb-12">
//             <button
//               onClick={() => setShowAddMatriculesModal(true)}
//               className="flex items-center gap-2 bg-primary hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold text-sm transition-all shadow-md active:scale-95"
//             >
//               <UserPlus size={20} />
//               Ajouter des matricules
//             </button>
            
//             <button
//               onClick={() => navigate('/admin/submit-project')}
//               className="flex items-center gap-2 border-2 border-navy dark:border-slate-700 hover:bg-navy hover:text-white text-navy dark:text-slate-300 px-6 py-3 rounded-lg font-bold text-sm transition-all active:scale-95"
//             >
//               <Upload size={20} />
//               Ajouter un projet
//             </button>
//           </div>
          
//           {/* Section Header */}
//           <div className="flex items-center justify-between mb-8">
//             <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-navy dark:text-white">
//               Mes Projets ({stats.myProjects})
//             </h2>
//             <div className="flex gap-2">
//               <button className="p-2 text-slate-400 hover:text-navy dark:hover:text-white transition-colors">
//                 <Filter size={20} />
//               </button>
//               <button className="p-2 text-slate-400 hover:text-navy dark:hover:text-white transition-colors">
//                 <Search size={20} />
//               </button>
//             </div>
//           </div>
          
//           {/* Projects Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {myProjects.map((project) => (
//               <div 
//                 key={project.id} 
//                 className="group bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-6 rounded-xl hover:shadow-xl hover:border-primary/20 transition-all"
//               >
//                 <div className="flex flex-col h-full">
//                   <div className="mb-4">
//                     <h3 className="text-lg font-bold text-navy dark:text-white group-hover:text-primary transition-colors">
//                       {project.title}
//                     </h3>
//                     <p className="text-sm text-slate-400 mt-1">
//                       Créé le {formatDate(project.created_at)}
//                     </p>
//                   </div>
                  
//                   <div className="flex flex-wrap gap-2 mb-6">
//                     {project.technologies && project.technologies.length > 0 ? (
//                       project.technologies.slice(0, 3).map((tech, index) => (
//                         <span 
//                           key={index}
//                           className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded"
//                         >
//                           {tech}
//                         </span>
//                       ))
//                     ) : (
//                       <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded">
//                         Non spécifié
//                       </span>
//                     )}
//                   </div>
                  
//                   <div className="mt-auto">
//                     <button
//                       onClick={() => navigate(`/admin/projects/${project.id}`)}
//                       className="w-full py-2.5 border border-slate-200 dark:border-slate-700 text-navy dark:text-slate-300 font-bold text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
//                     >
//                       Voir les détails
//                       <ArrowRight size={18} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
            
//             {/* Empty State Placeholder (Decorative) */}
//             <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 p-6 rounded-xl flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
//                  onClick={() => navigate('/admin/submit-project')}
//             >
//               <PlusCircle size={40} className="text-slate-300 mb-2" />
//               <p className="text-sm text-slate-500 font-medium">Nouveau projet</p>
//             </div>
//           </div>

//           {/* Quick Navigation */}
//           <div className="mt-12 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
//             <h3 className="text-lg font-semibold text-navy dark:text-white mb-4">Navigation Rapide</h3>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <button
//                 onClick={() => navigate('/submit')}
//                 className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
//               >
//                 <FolderPlus size={24} className="text-primary mb-2" />
//                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Déposer</span>
//               </button>
              
//               <button
//                 onClick={() => navigate('/admin/users')}
//                 className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
//               >
//                 <Users size={24} className="text-primary mb-2" />
//                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Utilisateurs</span>
//               </button>
              
//               <button
//                 onClick={() => navigate('/admin/projects')}
//                 className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
//               >
//                 <Kanban size={24} className="text-primary mb-2" />
//                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Projets</span>
//               </button>
              
//               <button
//                 onClick={() => navigate('/admin/analytics')}
//                 className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
//               >
//                 <BarChart3 size={24} className="text-primary mb-2" />
//                 <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Statistiques</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>
      
//       {/* Modal pour ajouter les matricules */}
//       {showAddMatriculesModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-md">
//             <div className="p-6 border-b border-slate-200 dark:border-slate-700">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-lg font-semibold text-navy dark:text-white">Ajouter des matricules autorisés</h3>
//                 <button
//                   onClick={() => setShowAddMatriculesModal(false)}
//                   className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//                 >
//                   ✕
//                 </button>
//               </div>
//               <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//                 Ajoutez les matricules des étudiants autorisés à accéder à la plateforme
//               </p>
//             </div>
            
//             <div className="p-6">
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Entrez un matricule
//                 </label>
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     value={matriculeInput}
//                     onChange={(e) => setMatriculeInput(e.target.value)}
//                     placeholder="Ex: SIM2024001"
//                     className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
//                     onKeyPress={(e) => e.key === 'Enter' && handleAddMatricule()}
//                   />
//                   <button
//                     onClick={handleAddMatricule}
//                     className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700"
//                   >
//                     Ajouter
//                   </button>
//                 </div>
//               </div>

//               {selectedMatricules.length > 0 && (
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Matricules à ajouter ({selectedMatricules.length})
//                   </label>
//                   <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-3 max-h-40 overflow-y-auto">
//                     {selectedMatricules.map((matricule, index) => (
//                       <div key={index} className="flex items-center justify-between py-2 px-3 bg-white dark:bg-slate-800 rounded border border-gray-200 dark:border-gray-700 mb-2 last:mb-0">
//                         <span className="font-medium text-gray-800 dark:text-gray-200">{matricule}</span>
//                         <button
//                           onClick={() => handleRemoveMatricule(index)}
//                           className="text-red-500 hover:text-red-700"
//                         >
//                           ✕
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => setShowAddMatriculesModal(false)}
//                   className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   onClick={handleSaveMatricules}
//                   disabled={selectedMatricules.length === 0}
//                   className={`px-4 py-2 rounded-lg font-medium ${
//                     selectedMatricules.length === 0
//                       ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
//                       : 'bg-primary text-white hover:bg-red-700'
//                   }`}
//                 >
//                   Ajouter {selectedMatricules.length} matricule(s)
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;


// src/components/admin/AdminDashboard.jsx - VERSION RÉELLE
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, FolderPlus, Compass, Users, 
  Kanban, BarChart3, User, Settings,
  Filter, Search, UserPlus, Upload, Trash2,
  ArrowRight, PlusCircle, CheckCircle, XCircle
} from 'lucide-react';
import api from "../../services/api";
import authService from "../../services/auth";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showAddMatriculesModal, setShowAddMatriculesModal] = useState(false);
  const [matriculeInput, setMatriculeInput] = useState('');
  const [selectedMatricules, setSelectedMatricules] = useState([]);
  const [authorizedMatricules, setAuthorizedMatricules] = useState([]);
  const [loadingMatricules, setLoadingMatricules] = useState(false);
  const [matriculeError, setMatriculeError] = useState('');

  // Données
  const [stats, setStats] = useState({
    totalProjects: 0,
    published: 0,
    pending: 0,
    totalUsers: 0,
    activeUsers: 0,
    myProjects: 0
  });

  const [myProjects, setMyProjects] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchAuthorizedMatricules();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const user = authService.getCurrentUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      setCurrentUser(user);
      
      // Vérifier que l'utilisateur est admin
      if (!(user.is_staff || user.is_superuser)) {
        navigate('/dashboard');
        return;
      }

      // Récupérer les données de la base de données
      const [projectsRes, allProjectsRes, usersRes, activityRes] = await Promise.all([
        api.get(`/api/projects/?author=${user.id}&limit=6&ordering=-created_at`),
        api.get('/api/projects/?limit=100'),
        api.get('/api/users/?limit=100'),
        api.get('/api/admin/recent-activity/?limit=5')
      ]);

      // Projets de l'admin
      const projectsData = projectsRes.data.results || projectsRes.data;
      setMyProjects(projectsData);

      // Tous les projets pour les stats
      const allProjectsData = allProjectsRes.data.results || allProjectsRes.data;
      const published = allProjectsData.filter(p => p.status === 'published').length;
      const pending = allProjectsData.filter(p => p.status === 'pending').length;

      // Utilisateurs
      const usersData = usersRes.data.results || usersRes.data;
      const activeUsers = usersData.filter(u => u.is_active).length;

      // Stats
      setStats({
        totalProjects: allProjectsData.length,
        published,
        pending,
        totalUsers: usersData.length,
        activeUsers,
        myProjects: projectsData.length
      });

      // Activité récente
      const activityData = activityRes.data.results || activityRes.data;
      setRecentActivity(activityData);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      // Rediriger en cas d'erreur d'authentification
      if (error.response?.status === 401 || error.response?.status === 403) {
        authService.logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthorizedMatricules = async () => {
    try {
      setLoadingMatricules(true);
      const response = await api.get('/api/admin/authorized-matricules/');
      setAuthorizedMatricules(response.data.results || response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des matricules:', error);
      setAuthorizedMatricules([]);
    } finally {
      setLoadingMatricules(false);
    }
  };

  const handleAddMatricule = () => {
    const matricule = matriculeInput.trim().toUpperCase();
    
    if (!matricule) {
      setMatriculeError('Veuillez entrer un matricule');
      return;
    }
    
    // Validation du format (ex: SIM2024001)
    if (!/^[A-Z]{3}\d{7}$/.test(matricule)) {
      setMatriculeError('Format invalide. Exemple: SIM2024001');
      return;
    }
    
    // Vérifier si le matricule existe déjà
    if (selectedMatricules.includes(matricule) || 
        authorizedMatricules.some(m => m.matricule === matricule)) {
      setMatriculeError('Ce matricule existe déjà');
      return;
    }
    
    setSelectedMatricules([...selectedMatricules, matricule]);
    setMatriculeInput('');
    setMatriculeError('');
  };

  const handleRemoveMatricule = (index) => {
    const newMatricules = [...selectedMatricules];
    newMatricules.splice(index, 1);
    setSelectedMatricules(newMatricules);
  };

  const handleSaveMatricules = async () => {
    try {
      if (selectedMatricules.length === 0) {
        alert('Veuillez ajouter au moins un matricule');
        return;
      }

      // Envoyer les matricules au backend
      const response = await api.post('/api/admin/authorized-matricules/bulk-create/', {
        matricules: selectedMatricules
      });
      
      alert(`${selectedMatricules.length} matricule(s) ajouté(s) avec succès !`);
      setShowAddMatriculesModal(false);
      setSelectedMatricules([]);
      setMatriculeInput('');
      
      // Recharger la liste des matricules
      fetchAuthorizedMatricules();
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout des matricules:', error);
      if (error.response?.data) {
        const errorMsg = error.response.data.detail || 
                        error.response.data.error || 
                        'Erreur lors de l\'ajout des matricules';
        alert(`Erreur: ${errorMsg}`);
      } else {
        alert('Erreur de connexion au serveur');
      }
    }
  };

  const handleDeleteMatricule = async (matriculeId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce matricule ?')) {
      try {
        await api.delete(`/api/admin/authorized-matricules/${matriculeId}/`);
        alert('Matricule supprimé avec succès !');
        fetchAuthorizedMatricules();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      return 'À l\'instant';
    } else if (diffHours < 24) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <div className="max-w-6xl mx-auto px-10 py-12">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Chargement du dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <main className="flex-1 overflow-y-auto bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header avec infos utilisateur */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-navy dark:text-white">
                Tableau de Bord Admin
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Connecté en tant que: {currentUser?.first_name || currentUser?.username} {currentUser?.last_name || ''}
                {currentUser?.is_superuser ? ' • Super Admin' : currentUser?.is_staff ? ' • Staff' : ''}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {currentUser?.email}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Dernière connexion: {formatDate(currentUser?.last_login || new Date())}
                </p>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Projets totaux</p>
                  <p className="text-2xl font-bold text-navy dark:text-white mt-2">{stats.totalProjects}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FolderPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {stats.published} publiés
                </span>
                <span className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center">
                  <XCircle className="w-3 h-3 mr-1" />
                  {stats.pending} en attente
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Utilisateurs</p>
                  <p className="text-2xl font-bold text-navy dark:text-white mt-2">{stats.totalUsers}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
                {stats.activeUsers} utilisateurs actifs
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Mes Projets</p>
                  <p className="text-2xl font-bold text-navy dark:text-white mt-2">{stats.myProjects}</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Kanban className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Matricules autorisés</p>
                  <p className="text-2xl font-bold text-navy dark:text-white mt-2">{authorizedMatricules.length}</p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <UserPlus className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Header */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={() => setShowAddMatriculesModal(true)}
              className="flex items-center gap-2 bg-primary hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <UserPlus size={20} />
              Ajouter des matricules
            </button>
            
            <button
              onClick={() => navigate('/admin/submit-project')}
              className="flex items-center gap-2 border-2 border-navy dark:border-slate-700 hover:bg-navy hover:text-white text-navy dark:text-slate-300 px-6 py-3 rounded-lg font-bold text-sm transition-all hover:shadow-lg active:scale-95"
            >
              <Upload size={20} />
              Ajouter un projet
            </button>

            <button
              onClick={() => navigate('/admin/users')}
              className="flex items-center gap-2 border-2 border-green-600 dark:border-green-700 hover:bg-green-600 hover:text-white text-green-600 dark:text-green-400 px-6 py-3 rounded-lg font-bold text-sm transition-all hover:shadow-lg active:scale-95"
            >
              <Users size={20} />
              Gérer les utilisateurs
            </button>
          </div>

          {/* Section des matricules existants */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-navy dark:text-white">
                Matricules autorisés ({authorizedMatricules.length})
              </h2>
              <button
                onClick={fetchAuthorizedMatricules}
                disabled={loadingMatricules}
                className="text-sm text-primary hover:text-red-700 font-medium disabled:opacity-50"
              >
                {loadingMatricules ? 'Chargement...' : 'Actualiser'}
              </button>
            </div>

            {loadingMatricules ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Chargement des matricules...</p>
              </div>
            ) : authorizedMatricules.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
                <UserPlus className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 mb-2">Aucun matricule autorisé</p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  Ajoutez des matricules pour autoriser l'accès à la plateforme
                </p>
                <button
                  onClick={() => setShowAddMatriculesModal(true)}
                  className="mt-4 inline-flex items-center gap-2 bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  <UserPlus size={16} />
                  Ajouter des matricules
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Matricule
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Date d'ajout
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Ajouté par
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {authorizedMatricules.map((matricule) => (
                        <tr key={matricule.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono font-bold text-slate-900 dark:text-white">
                              {matricule.matricule}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                            {formatDate(matricule.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                            {matricule.created_by?.username || 'Système'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleDeleteMatricule(matricule.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Supprimer"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Section Projets */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-navy dark:text-white">
                Mes Projets récents ({stats.myProjects})
              </h2>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-navy dark:hover:text-white transition-colors">
                  <Filter size={20} />
                </button>
                <button className="p-2 text-slate-400 hover:text-navy dark:hover:text-white transition-colors">
                  <Search size={20} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="group bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-6 rounded-xl hover:shadow-xl hover:border-primary/20 transition-all"
                >
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-navy dark:text-white group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          project.status === 'published' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {project.status === 'published' ? 'Publié' : 'En attente'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">
                        Créé le {formatDate(project.created_at)}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies && project.technologies.length > 0 ? (
                        project.technologies.slice(0, 3).map((tech, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded"
                          >
                            {tech}
                          </span>
                        ))
                      ) : (
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded">
                          Non spécifié
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-auto">
                      <button
                        onClick={() => navigate(`/admin/projects/${project.id}`)}
                        className="w-full py-2.5 border border-slate-200 dark:border-slate-700 text-navy dark:text-slate-300 font-bold text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                      >
                        Voir les détails
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <div 
                className="border-2 border-dashed border-slate-200 dark:border-slate-800 p-6 rounded-xl flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer hover:border-primary/30"
                onClick={() => navigate('/admin/submit-project')}
              >
                <PlusCircle size={40} className="text-slate-300 mb-2" />
                <p className="text-sm text-slate-500 font-medium">Nouveau projet</p>
              </div>
            </div>
          </div>

          {/* Section Activité récente */}
          {recentActivity.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-navy dark:text-white mb-4">Activité récente</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-900 dark:text-white">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                        {activity.project && (
                          <span className="font-medium text-primary"> "{activity.project}"</span>
                        )}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {formatTimeAgo(activity.created_at || activity.time)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Modal pour ajouter les matricules */}
      {showAddMatriculesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-navy dark:text-white">Ajouter des matricules autorisés</h3>
                <button
                  onClick={() => {
                    setShowAddMatriculesModal(false);
                    setMatriculeError('');
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Ajoutez les matricules des étudiants autorisés à accéder à la plateforme
              </p>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Entrez un matricule (Format: XXX0000000)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={matriculeInput}
                    onChange={(e) => {
                      setMatriculeInput(e.target.value);
                      setMatriculeError('');
                    }}
                    placeholder="Ex: SIM2024001"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white uppercase"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddMatricule()}
                  />
                  <button
                    onClick={handleAddMatricule}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 font-medium"
                  >
                    Ajouter
                  </button>
                </div>
                {matriculeError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{matriculeError}</p>
                )}
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Format: 3 lettres suivies de 7 chiffres (ex: SIM2024001)
                </p>
              </div>

              {selectedMatricules.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Matricules à ajouter ({selectedMatricules.length})
                  </label>
                  <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-3 max-h-40 overflow-y-auto">
                    {selectedMatricules.map((matricule, index) => (
                      <div key={index} className="flex items-center justify-between py-2 px-3 bg-white dark:bg-slate-800 rounded border border-gray-200 dark:border-gray-700 mb-2 last:mb-0">
                        <span className="font-mono font-medium text-gray-800 dark:text-gray-200">{matricule}</span>
                        <button
                          onClick={() => handleRemoveMatricule(index)}
                          className="text-red-500 hover:text-red-700"
                          title="Supprimer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => {
                    setShowAddMatriculesModal(false);
                    setMatriculeError('');
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveMatricules}
                  disabled={selectedMatricules.length === 0}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedMatricules.length === 0
                      ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-red-700 hover:shadow-lg'
                  }`}
                >
                  Ajouter {selectedMatricules.length} matricule(s)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;