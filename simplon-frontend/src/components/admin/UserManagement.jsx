// import React, { useState, useEffect } from 'react';

// const UserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Données mockées
//     const mockUsers = [
//       {
//         id: 1,
//         first_name: 'Jean',
//         last_name: 'Dupont',
//         email: 'jean.dupont@simplon.com',
//         matricule: '12345',
//         cohort: 'Développeur Web 2024',
//         projects_count: 5,
//         status: 'active',
//         joined_date: '2024-01-15'
//       },
//       {
//         id: 2,
//         first_name: 'Marie',
//         last_name: 'Martin',
//         email: 'marie.martin@simplon.com',
//         matricule: '12346',
//         cohort: 'Data Analyst 2024',
//         projects_count: 3,
//         status: 'active',
//         joined_date: '2024-02-01'
//       },
//       {
//         id: 3,
//         first_name: 'Pierre',
//         last_name: 'Lambert',
//         email: 'pierre.lambert@simplon.com',
//         matricule: '12347',
//         cohort: 'Développeur Web 2024',
//         projects_count: 0,
//         status: 'inactive',
//         joined_date: '2024-01-20'
//       }
//     ];

//     setUsers(mockUsers);
//     setLoading(false);
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E30613]"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-[#001F3F] dark:text-white">
//           Gestion des Utilisateurs
//         </h1>
//         <button className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#E30613]/90 transition-colors font-medium">
//           <span className="material-symbols-outlined align-middle mr-2">person_add</span>
//           Ajouter un utilisateur
//         </button>
//       </div>

//       {/* Filtres */}
//       <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 shadow-sm">
//         <div className="flex flex-wrap gap-4">
//           <input
//             type="text"
//             placeholder="Rechercher un utilisateur..."
//             className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
//           />
//           <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white">
//             <option value="">Tous les statuts</option>
//             <option value="active">Actif</option>
//             <option value="inactive">Inactif</option>
//           </select>
//           <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white">
//             <option value="">Toutes les cohortes</option>
//             <option value="web">Développeur Web</option>
//             <option value="data">Data Analyst</option>
//           </select>
//         </div>
//       </div>

//       {/* Tableau des utilisateurs */}
//       <div className="bg-white dark:bg-[#1a2f44] rounded-xl shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 dark:bg-[#0d1a29]">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                   Utilisateur
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                   Matricule
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                   Cohorte
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                   Projets
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                   Statut
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//               {users.map((user) => (
//                 <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-[#0d1a29] transition-colors">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0 h-10 w-10 bg-[#E30613] rounded-full flex items-center justify-center text-white font-semibold">
//                         {user.first_name[0]}{user.last_name[0]}
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-[#001F3F] dark:text-white">
//                           {user.first_name} {user.last_name}
//                         </div>
//                         <div className="text-sm text-gray-500 dark:text-gray-400">
//                           {user.email}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
//                     {user.matricule}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
//                     {user.cohort}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
//                       {user.projects_count} projets
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                       user.status === 'active' 
//                         ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
//                         : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
//                     }`}>
//                       {user.status === 'active' ? 'Actif' : 'Inactif'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex space-x-2">
//                       <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
//                         <span className="material-symbols-outlined text-lg">edit</span>
//                       </button>
//                       <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
//                         <span className="material-symbols-outlined text-lg">delete</span>
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserManagement;


// import React, { useState, useEffect } from 'react';
// import { authService } from '../../services/auth';
// import { projectService } from '../../services/projects';

// const UserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddUserModal, setShowAddUserModal] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [cohortFilter, setCohortFilter] = useState('');
//   const [projectsFilter, setProjectsFilter] = useState('');

//   // État pour le formulaire d'ajout
//   const [newUser, setNewUser] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     matricule: '',
//     cohort: '',
//     role: 'student'
//   });

//   useEffect(() => {
//     fetchUsersData();
//   }, []);

//   useEffect(() => {
//     filterUsers();
//   }, [users, searchTerm, statusFilter, cohortFilter, projectsFilter]);

//   const fetchUsersData = async () => {
//     try {
//       setLoading(true);
      
//       // Récupérer les utilisateurs depuis l'API
//       let usersData;
//       try {
//         usersData = await authService.getAllUsers();
//         // Si l'API retourne un objet avec une propriété users
//         usersData = usersData.users || usersData;
//       } catch (apiError) {
//         console.error('Erreur API utilisateurs:', apiError);
//         usersData = getMockUsersData();
//       }

//       // Pour chaque utilisateur, récupérer le nombre de projets
//       const usersWithProjects = await Promise.all(
//         usersData.map(async (user) => {
//           try {
//             let userProjects = [];
//             try {
//               // Essayer de récupérer les projets de l'utilisateur
//               userProjects = await projectService.getUserProjects(user.id);
//             } catch (projectError) {
//               // Si échec, utiliser tous les projets et filtrer
//               const allProjects = await projectService.getAllProjects();
//               userProjects = allProjects.filter(project => project.author === user.id);
//             }
            
//             return {
//               ...user,
//               projects_count: Array.isArray(userProjects) ? userProjects.length : 0,
//               status: user.status || 'active',
//               role: user.role || 'student'
//             };
//           } catch (error) {
//             console.error(`Erreur récupération projets pour ${user.email}:`, error);
//             return {
//               ...user,
//               projects_count: 0,
//               status: user.status || 'active',
//               role: user.role || 'student'
//             };
//           }
//         })
//       );

//       setUsers(usersWithProjects);
//     } catch (err) {
//       console.error('Erreur lors du chargement des utilisateurs:', err);
//       // Fallback sur les données mockées
//       const mockUsers = getMockUsersData();
//       setUsers(mockUsers);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getMockUsersData = () => {
//     return [
//       {
//         id: 1,
//         first_name: 'Jean',
//         last_name: 'Dupont',
//         email: 'jean.dupont@simplon.com',
//         matricule: 'SIM001',
//         cohort: 'Développeur Web 2024',
//         projects_count: 5,
//         status: 'active',
//         role: 'student',
//         joined_date: '2024-01-15'
//       },
//       {
//         id: 2,
//         first_name: 'Marie',
//         last_name: 'Martin',
//         email: 'marie.martin@simplon.com',
//         matricule: 'SIM002',
//         cohort: 'Data Analyst 2024',
//         projects_count: 3,
//         status: 'active',
//         role: 'student',
//         joined_date: '2024-02-01'
//       },
//       {
//         id: 3,
//         first_name: 'Pierre',
//         last_name: 'Lambert',
//         email: 'pierre.lambert@simplon.com',
//         matricule: 'SIM003',
//         cohort: 'Développeur Web 2024',
//         projects_count: 0,
//         status: 'inactive',
//         role: 'student',
//         joined_date: '2024-01-20'
//       },
//       {
//         id: 4,
//         first_name: 'Sophie',
//         last_name: 'Chen',
//         email: 'sophie.chen@simplon.com',
//         matricule: 'SIM004',
//         cohort: 'Data Analyst 2024',
//         projects_count: 7,
//         status: 'active',
//         role: 'student',
//         joined_date: '2024-03-10'
//       },
//       {
//         id: 5,
//         first_name: 'Admin',
//         last_name: 'System',
//         email: 'admin@simplon.com',
//         matricule: 'ADM001',
//         cohort: 'Administration',
//         projects_count: 0,
//         status: 'active',
//         role: 'admin',
//         joined_date: '2024-01-01'
//       }
//     ];
//   };

//   const filterUsers = () => {
//     let filtered = users;

//     // Filtre par recherche (nom, email, matricule)
//     if (searchTerm) {
//       filtered = filtered.filter(user =>
//         user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.cohort.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Filtre par statut
//     if (statusFilter) {
//       filtered = filtered.filter(user => user.status === statusFilter);
//     }

//     // Filtre par cohorte
//     if (cohortFilter) {
//       filtered = filtered.filter(user => user.cohort === cohortFilter);
//     }

//     // Filtre par nombre de projets
//     if (projectsFilter) {
//       switch (projectsFilter) {
//         case '0':
//           filtered = filtered.filter(user => user.projects_count === 0);
//           break;
//         case '1-5':
//           filtered = filtered.filter(user => user.projects_count >= 1 && user.projects_count <= 5);
//           break;
//         case '5+':
//           filtered = filtered.filter(user => user.projects_count > 5);
//           break;
//         default:
//           break;
//       }
//     }

//     setFilteredUsers(filtered);
//   };

//   const handleAddUser = async (e) => {
//     e.preventDefault();
    
//     try {
//       // Simulation d'ajout d'utilisateur
//       const newUserData = {
//         id: Date.now(), // ID temporaire
//         ...newUser,
//         projects_count: 0,
//         status: 'active',
//         joined_date: new Date().toISOString().split('T')[0]
//       };

//       // Ici, vous appelleriez votre API pour créer l'utilisateur
//       // await authService.createUser(newUser);
      
//       setUsers(prev => [...prev, newUserData]);
//       setShowAddUserModal(false);
//       setNewUser({
//         first_name: '',
//         last_name: '',
//         email: '',
//         matricule: '',
//         cohort: '',
//         role: 'student'
//       });
      
//       alert('Utilisateur ajouté avec succès!');
//     } catch (error) {
//       console.error('Erreur lors de l\'ajout:', error);
//       alert('Erreur lors de l\'ajout de l\'utilisateur');
//     }
//   };

//   const handleStatusChange = async (userId, newStatus) => {
//     try {
//       // Simulation de changement de statut
//       // await authService.updateUserStatus(userId, newStatus);
      
//       setUsers(users.map(user =>
//         user.id === userId ? { ...user, status: newStatus } : user
//       ));
//     } catch (error) {
//       console.error('Erreur changement statut:', error);
//       alert('Erreur lors du changement de statut');
//     }
//   };

//   const handleDeleteUser = async (userId) => {
//     if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
//       return;
//     }

//     try {
//       // Simulation de suppression
//       // await authService.deleteUser(userId);
      
//       setUsers(users.filter(user => user.id !== userId));
//       alert('Utilisateur supprimé avec succès!');
//     } catch (error) {
//       console.error('Erreur suppression:', error);
//       alert('Erreur lors de la suppression');
//     }
//   };

//   const getUniqueCohorts = () => {
//     const cohorts = users.map(user => user.cohort);
//     return [...new Set(cohorts)].filter(Boolean);
//   };

//   const getStatusStats = () => {
//     const active = users.filter(user => user.status === 'active').length;
//     const inactive = users.filter(user => user.status === 'inactive').length;
//     const total = users.length;
//     return { active, inactive, total };
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E30613]"></div>
//         <span className="ml-3 text-[#001F3F] dark:text-white">Chargement des utilisateurs...</span>
//       </div>
//     );
//   }

//   const stats = getStatusStats();

//   return (
//     <div className="space-y-6">
//       {/* En-tête avec statistiques */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-[#001F3F] dark:text-white">
//             Gestion des Utilisateurs
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-1">
//             {stats.total} utilisateurs • {stats.active} actifs • {stats.inactive} inactifs
//           </p>
//         </div>
//         <button 
//           onClick={() => setShowAddUserModal(true)}
//           className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#E30613]/90 transition-colors font-medium flex items-center"
//         >
//           <span className="material-symbols-outlined align-middle mr-2">person_add</span>
//           Ajouter un utilisateur
//         </button>
//       </div>

//       {/* Cartes de statistiques */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
//               <p className="text-2xl font-bold text-[#001F3F] dark:text-white">{stats.total}</p>
//             </div>
//             <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
//               <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">people</span>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Actifs</p>
//               <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
//             </div>
//             <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
//               <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inactifs</p>
//               <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.inactive}</p>
//             </div>
//             <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
//               <span className="material-symbols-outlined text-red-600 dark:text-red-400">cancel</span>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Projets</p>
//               <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
//                 {users.reduce((total, user) => total + user.projects_count, 0)}
//               </p>
//             </div>
//             <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
//               <span className="material-symbols-outlined text-orange-600 dark:text-orange-400">folder</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filtres améliorés */}
//       <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 shadow-sm">
//         <div className="flex flex-wrap gap-4">
//           <input
//             type="text"
//             placeholder="Rechercher par nom, email, matricule..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white flex-1 min-w-[250px]"
//           />
          
//           <select 
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
//           >
//             <option value="">Tous les statuts</option>
//             <option value="active">Actif</option>
//             <option value="inactive">Inactif</option>
//           </select>
          
//           <select 
//             value={cohortFilter}
//             onChange={(e) => setCohortFilter(e.target.value)}
//             className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
//           >
//             <option value="">Toutes les cohortes</option>
//             {getUniqueCohorts().map(cohort => (
//               <option key={cohort} value={cohort}>{cohort}</option>
//             ))}
//           </select>

//           <select 
//             value={projectsFilter}
//             onChange={(e) => setProjectsFilter(e.target.value)}
//             className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
//           >
//             <option value="">Tous les projets</option>
//             <option value="0">0 projet</option>
//             <option value="1-5">1-5 projets</option>
//             <option value="5+">5+ projets</option>
//           </select>
          
//           <button 
//             onClick={() => {
//               setSearchTerm('');
//               setStatusFilter('');
//               setCohortFilter('');
//               setProjectsFilter('');
//             }}
//             className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-[#0d1a29] transition-colors text-gray-600 dark:text-gray-400"
//           >
//             Réinitialiser
//           </button>
//         </div>
//       </div>

//       {/* Tableau des utilisateurs */}
//       <div className="bg-white dark:bg-[#1a2f44] rounded-xl shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 dark:bg-[#0d1a29]">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                   Utilisateur
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                   Matricule
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                   Cohorte
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                   Projets
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                   Statut
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//               {filteredUsers.map((user) => (
//                 <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-[#0d1a29] transition-colors">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0 h-10 w-10 bg-[#E30613] rounded-full flex items-center justify-center text-white font-semibold">
//                         {user.first_name[0]}{user.last_name[0]}
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-[#001F3F] dark:text-white">
//                           {user.first_name} {user.last_name}
//                         </div>
//                         <div className="text-sm text-gray-500 dark:text-gray-400">
//                           {user.email}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
//                     {user.matricule}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
//                     {user.cohort}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                       user.projects_count > 0 
//                         ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
//                         : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
//                     }`}>
//                       {user.projects_count} projet{user.projects_count !== 1 ? 's' : ''}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <select
//                       value={user.status}
//                       onChange={(e) => handleStatusChange(user.id, e.target.value)}
//                       className={`text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-[#E30613] px-3 py-1 ${
//                         user.status === 'active' 
//                           ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
//                           : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
//                       }`}
//                     >
//                       <option value="active">Actif</option>
//                       <option value="inactive">Inactif</option>
//                     </select>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex space-x-2">
//                       <button 
//                         className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
//                         title="Modifier"
//                       >
//                         <span className="material-symbols-outlined text-lg">edit</span>
//                       </button>
//                       <button 
//                         onClick={() => handleDeleteUser(user.id)}
//                         className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
//                         title="Supprimer"
//                       >
//                         <span className="material-symbols-outlined text-lg">delete</span>
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {filteredUsers.length === 0 && (
//           <div className="text-center py-12 text-gray-500 dark:text-gray-400">
//             <span className="material-symbols-outlined text-4xl mb-3">search_off</span>
//             <p className="text-lg font-medium">Aucun utilisateur trouvé</p>
//             <p className="text-sm mt-1">Essayez de modifier vos critères de recherche</p>
//           </div>
//         )}
//       </div>

//       {/* Modal d'ajout d'utilisateur */}
//       {showAddUserModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-6 w-full max-w-md">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#001F3F] dark:text-white">
//                 Ajouter un utilisateur
//               </h2>
//               <button 
//                 onClick={() => setShowAddUserModal(false)}
//                 className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//               >
//                 <span className="material-symbols-outlined">close</span>
//               </button>
//             </div>

//             <form onSubmit={handleAddUser} className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Prénom *
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     value={newUser.first_name}
//                     onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Nom *
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     value={newUser.last_name}
//                     onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Email *
//                 </label>
//                 <input
//                   type="email"
//                   required
//                   value={newUser.email}
//                   onChange={(e) => setNewUser({...newUser, email: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Matricule *
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={newUser.matricule}
//                   onChange={(e) => setNewUser({...newUser, matricule: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Cohorte
//                 </label>
//                 <input
//                   type="text"
//                   value={newUser.cohort}
//                   onChange={(e) => setNewUser({...newUser, cohort: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
//                   placeholder="Ex: Développeur Web 2024"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Rôle
//                 </label>
//                 <select
//                   value={newUser.role}
//                   onChange={(e) => setNewUser({...newUser, role: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
//                 >
//                   <option value="student">Étudiant</option>
//                   <option value="admin">Administrateur</option>
//                 </select>
//               </div>

//               <div className="flex justify-end space-x-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setShowAddUserModal(false)}
//                   className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#0d1a29] transition-colors"
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-[#E30613] text-white rounded-lg hover:bg-[#E30613]/90 transition-colors"
//                 >
//                   Ajouter
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserManagement;



import React, { useState, useEffect } from 'react';
import { authService } from '../../services/auth';
import { projectService } from '../../services/projects';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [cohortFilter, setCohortFilter] = useState('');
  const [projectsFilter, setProjectsFilter] = useState('');

  // État pour le formulaire d'ajout
  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    matricule: '',
    cohort: '',
    role: 'student',
    password: '',
    confirm_password: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchUsersData();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, statusFilter, cohortFilter, projectsFilter]);

  const fetchUsersData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Vérifier les permissions admin
      authService.checkAdminPermission();

      // Récupérer les utilisateurs depuis la base de données
      const usersData = await authService.getAllUsers();
      
      console.log('📊 Données utilisateurs récupérées:', usersData);

      // Pour chaque utilisateur, récupérer le nombre de projets depuis la BD
      const usersWithProjects = await Promise.all(
        usersData.map(async (user) => {
          try {
            let userProjects = [];
            try {
              // Essayer de récupérer les projets de l'utilisateur
              userProjects = await projectService.getUserProjects(user.id);
            } catch (projectError) {
              console.log(`⚠️ Impossible de récupérer les projets pour ${user.email}:`, projectError);
              // Fallback: utiliser tous les projets et filtrer par auteur
              const allProjects = await projectService.getAllProjects();
              userProjects = allProjects.filter(project => project.author === user.id || project.author_id === user.id);
            }
            
            return {
              id: user.id,
              first_name: user.first_name || user.first_name || 'Non',
              last_name: user.last_name || user.last_name || 'Défini',
              email: user.email,
              matricule: user.matricule || user.username || 'N/A',
              cohort: user.cohort || user.groups?.[0] || 'Non assigné',
              projects_count: Array.isArray(userProjects) ? userProjects.length : 0,
              status: user.is_active ? 'active' : 'inactive',
              role: user.is_staff ? 'admin' : 'student',
              date_joined: user.date_joined || user.created_at,
              last_login: user.last_login
            };
          } catch (error) {
            console.error(`❌ Erreur traitement utilisateur ${user.email}:`, error);
            return {
              id: user.id,
              first_name: user.first_name || 'Erreur',
              last_name: user.last_name || 'Chargement',
              email: user.email,
              matricule: user.matricule || 'N/A',
              cohort: 'Erreur',
              projects_count: 0,
              status: 'inactive',
              role: 'student',
              date_joined: null,
              last_login: null
            };
          }
        })
      );

      setUsers(usersWithProjects);
      setSuccess('✅ Données utilisateurs chargées avec succès');

    } catch (err) {
      console.error('❌ Erreur lors du chargement des utilisateurs:', err);
      setError(err.message || 'Erreur lors du chargement des utilisateurs depuis la base de données');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filtre par recherche (nom, email, matricule, cohorte)
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.cohort.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter) {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // Filtre par cohorte
    if (cohortFilter) {
      filtered = filtered.filter(user => user.cohort === cohortFilter);
    }

    // Filtre par nombre de projets
    if (projectsFilter) {
      switch (projectsFilter) {
        case '0':
          filtered = filtered.filter(user => user.projects_count === 0);
          break;
        case '1-5':
          filtered = filtered.filter(user => user.projects_count >= 1 && user.projects_count <= 5);
          break;
        case '5+':
          filtered = filtered.filter(user => user.projects_count > 5);
          break;
        default:
          break;
      }
    }

    setFilteredUsers(filtered);
  };

  const validateForm = () => {
    const errors = {};

    if (!newUser.first_name.trim()) errors.first_name = 'Le prénom est requis';
    if (!newUser.last_name.trim()) errors.last_name = 'Le nom est requis';
    if (!newUser.email.trim()) {
      errors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
      errors.email = 'L\'email est invalide';
    }
    if (!newUser.matricule.trim()) errors.matricule = 'Le matricule est requis';
    if (!newUser.password) {
      errors.password = 'Le mot de passe est requis';
    } else if (newUser.password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    if (newUser.password !== newUser.confirm_password) {
      errors.confirm_password = 'Les mots de passe ne correspondent pas';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // Préparer les données pour l'API Django
      const userData = {
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        username: newUser.matricule, // Utiliser le matricule comme username
        matricule: newUser.matricule,
        cohort: newUser.cohort,
        password: newUser.password,
        is_staff: newUser.role === 'admin',
        is_active: true
      };

      console.log('📤 Envoi des données utilisateur:', userData);

      // Appel API pour créer l'utilisateur dans la base de données
      const createdUser = await authService.createUser(userData);
      
      console.log('✅ Utilisateur créé dans la BD:', createdUser);

      // Recharger la liste des utilisateurs
      await fetchUsersData();
      
      // Fermer le modal et réinitialiser le formulaire
      setShowAddUserModal(false);
      setNewUser({
        first_name: '',
        last_name: '',
        email: '',
        matricule: '',
        cohort: '',
        role: 'student',
        password: '',
        confirm_password: ''
      });
      setFormErrors({});
      
      setSuccess('✅ Utilisateur créé avec succès dans la base de données');

    } catch (error) {
      console.error('❌ Erreur lors de la création:', error);
      setError(error.message || 'Erreur lors de la création de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      // Appel API pour changer le statut dans la BD
      await authService.updateUserStatus(userId, newStatus);
      
      // Mise à jour locale
      setUsers(users.map(user =>
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      
      setSuccess(`✅ Statut de l'utilisateur changé à: ${newStatus === 'active' ? 'Actif' : 'Inactif'}`);

    } catch (error) {
      console.error('❌ Erreur changement statut:', error);
      setError(error.message || 'Erreur lors du changement de statut');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
      return;
    }

    try {
      setLoading(true);
      
      // Appel API pour suppression dans la BD
      await authService.deleteUser(userId);
      
      // Mise à jour locale
      setUsers(users.filter(user => user.id !== userId));
      
      setSuccess('✅ Utilisateur supprimé avec succès de la base de données');

    } catch (error) {
      console.error('❌ Erreur suppression:', error);
      setError(error.message || 'Erreur lors de la suppression de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const getUniqueCohorts = () => {
    const cohorts = users.map(user => user.cohort);
    return [...new Set(cohorts)].filter(Boolean).sort();
  };

  const getStatusStats = () => {
    const active = users.filter(user => user.status === 'active').length;
    const inactive = users.filter(user => user.status === 'inactive').length;
    const total = users.length;
    const totalProjects = users.reduce((total, user) => total + user.projects_count, 0);
    return { active, inactive, total, totalProjects };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Effacer les messages après 5 secondes
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E30613]"></div>
        <span className="ml-3 text-[#001F3F] dark:text-white">Chargement des utilisateurs depuis la base de données...</span>
      </div>
    );
  }

  const stats = getStatusStats();

  return (
    <div className="space-y-6">
      {/* Messages d'alerte */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Erreur: </strong>
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={() => setError(null)}
            className="absolute top-0 right-0 px-4 py-3"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Succès: </strong>
          <span className="block sm:inline">{success}</span>
          <button 
            onClick={() => setSuccess(null)}
            className="absolute top-0 right-0 px-4 py-3"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* En-tête avec statistiques */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#001F3F] dark:text-white">
            Gestion des Utilisateurs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {stats.total} utilisateurs • {stats.active} actifs • {stats.inactive} inactifs
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={fetchUsersData}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-[#0d1a29] transition-colors text-gray-700 dark:text-gray-300 flex items-center disabled:opacity-50"
          >
            <span className="material-symbols-outlined align-middle mr-2">refresh</span>
            Actualiser
          </button>
          <button 
            onClick={() => setShowAddUserModal(true)}
            disabled={loading}
            className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#E30613]/90 transition-colors font-medium flex items-center disabled:opacity-50"
          >
            <span className="material-symbols-outlined align-middle mr-2">person_add</span>
            Ajouter un utilisateur
          </button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Utilisateurs</p>
              <p className="text-2xl font-bold text-[#001F3F] dark:text-white">{stats.total}</p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">people</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Actifs</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Inactifs</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.inactive}</p>
            </div>
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <span className="material-symbols-outlined text-red-600 dark:text-red-400">cancel</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Projets</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.totalProjects}</p>
            </div>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <span className="material-symbols-outlined text-orange-600 dark:text-orange-400">folder</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres améliorés */}
      <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Rechercher par nom, email, matricule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white flex-1 min-w-[250px]"
          />
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>
          
          <select 
            value={cohortFilter}
            onChange={(e) => setCohortFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
          >
            <option value="">Toutes les cohortes</option>
            {getUniqueCohorts().map(cohort => (
              <option key={cohort} value={cohort}>{cohort}</option>
            ))}
          </select>

          <select 
            value={projectsFilter}
            onChange={(e) => setProjectsFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
          >
            <option value="">Tous les projets</option>
            <option value="0">0 projet</option>
            <option value="1-5">1-5 projets</option>
            <option value="5+">5+ projets</option>
          </select>
          
          <button 
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('');
              setCohortFilter('');
              setProjectsFilter('');
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-[#0d1a29] transition-colors text-gray-600 dark:text-gray-400"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="bg-white dark:bg-[#1a2f44] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#0d1a29]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Matricule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cohorte
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Projets
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-[#0d1a29] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-[#E30613] rounded-full flex items-center justify-center text-white font-semibold">
                        {user.first_name[0]}{user.last_name[0]}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-[#001F3F] dark:text-white">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {user.role === 'admin' ? 'Administrateur' : 'Étudiant'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-mono">
                    {user.matricule}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {user.cohort}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.projects_count > 0 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                    }`}>
                      {user.projects_count} projet{user.projects_count !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.status}
                      onChange={(e) => handleStatusChange(user.id, e.target.value)}
                      className={`text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-[#E30613] px-3 py-1 ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                      }`}
                    >
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(user.date_joined)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Modifier"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Supprimer"
                        disabled={loading}
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <span className="material-symbols-outlined text-4xl mb-3">search_off</span>
            <p className="text-lg font-medium">Aucun utilisateur trouvé</p>
            <p className="text-sm mt-1">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>

      {/* Modal d'ajout d'utilisateur */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#001F3F] dark:text-white">
                Ajouter un utilisateur
              </h2>
              <button 
                onClick={() => {
                  setShowAddUserModal(false);
                  setFormErrors({});
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUser.first_name}
                    onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white ${
                      formErrors.first_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {formErrors.first_name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.first_name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUser.last_name}
                    onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white ${
                      formErrors.last_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {formErrors.last_name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.last_name}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Matricule *
                </label>
                <input
                  type="text"
                  required
                  value={newUser.matricule}
                  onChange={(e) => setNewUser({...newUser, matricule: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white ${
                    formErrors.matricule ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {formErrors.matricule && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.matricule}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cohorte
                </label>
                <input
                  type="text"
                  value={newUser.cohort}
                  onChange={(e) => setNewUser({...newUser, cohort: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
                  placeholder="Ex: Développeur Web 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rôle
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
                >
                  <option value="student">Étudiant</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mot de passe *
                </label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white ${
                    formErrors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {formErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirmer le mot de passe *
                </label>
                <input
                  type="password"
                  required
                  value={newUser.confirm_password}
                  onChange={(e) => setNewUser({...newUser, confirm_password: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white ${
                    formErrors.confirm_password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {formErrors.confirm_password && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.confirm_password}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddUserModal(false);
                    setFormErrors({});
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#0d1a29] transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#E30613] text-white rounded-lg hover:bg-[#E30613]/90 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Création...' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;