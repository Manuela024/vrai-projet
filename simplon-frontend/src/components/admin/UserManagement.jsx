// // src/components/admin/UserManagement.jsx - VERSION CORRIGÉE POUR 13 UTILISATEURS
// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import {
//   Users, UserPlus, Search, Filter, RefreshCw,
//   UserCheck, UserX, Shield, ShieldAlert, Mail,
//   Calendar, Clock, Trash2, Edit, MoreVertical,
//   CheckCircle, XCircle, AlertCircle, Database,
//   Wifi, WifiOff, Eye, EyeOff, Key, Crown,
//   User as UserIcon, Activity, TrendingUp, BarChart
// } from 'lucide-react';

// const UserManagement = () => {
//   // État principal
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
  
//   // Filtres et recherche
//   const [searchTerm, setSearchTerm] = useState('');
//   const [roleFilter, setRoleFilter] = useState('all');
//   const [statusFilter, setStatusFilter] = useState('all');
  
//   // Modal
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
  
//   // Nouvel utilisateur
//   const [newUser, setNewUser] = useState({
//     username: '',
//     email: '',
//     first_name: '',
//     last_name: '',
//     password: '',
//     is_staff: false,
//     is_superuser: false,
//     is_active: true
//   });

//   // Form errors
//   const [formErrors, setFormErrors] = useState({});

//   // API Configuration
//   const API_BASE_URL = 'http://localhost:8000';
  
//   // 🎯 FONCTION CORRIGÉE : Récupérer TOUS les utilisateurs depuis auth_user
//   const fetchAllUsers = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       console.log('🔍 Récupération des 13 utilisateurs depuis auth_user...');
      
//       // 🎯 ESSAYER DIRECTEMENT VOTRE ENDPOINT PROJETS QUI CONTIENT LES UTILISATEURS
//       try {
//         // Votre API projets contient les données des auteurs
//         const response = await axios.get(`${API_BASE_URL}/api/projects/projects/`, {
//           timeout: 5000
//         });
        
//         console.log('✅ Projets récupérés:', response.data.count);
        
//         // Extraire TOUS les auteurs uniques des projets
//         const allAuthors = [];
//         response.data.projects.forEach(project => {
//           if (project.author && !allAuthors.find(a => a.id === project.author.id)) {
//             allAuthors.push({
//               ...project.author,
//               author_name: project.author_name,
//               author_email: project.author_email,
//               author_username: project.author_username
//             });
//           }
//         });
        
//         console.log(`✅ ${allAuthors.length} auteurs uniques trouvés dans les projets`);
        
//         // Si on a des auteurs, les formater comme utilisateurs
//         if (allAuthors.length > 0) {
//           const formattedUsers = allAuthors.map((author, index) => ({
//             id: author.id || index + 1,
//             username: author.username || author.author_username || `user_${index + 1}`,
//             email: author.email || author.author_email || `user${index + 1}@simplon.com`,
//             first_name: author.first_name || author.author_name?.split(' ')[0] || '',
//             last_name: author.last_name || author.author_name?.split(' ').slice(1).join(' ') || '',
//             is_active: author.is_active !== undefined ? author.is_active : true,
//             is_staff: author.is_staff || false,
//             is_superuser: author.is_superuser || false,
//             date_joined: author.date_joined || new Date().toISOString(),
//             last_login: author.last_login || null
//           }));
          
//           setUsers(formattedUsers);
//           setSuccess(`${formattedUsers.length} utilisateurs chargés depuis les projets`);
//           return;
//         }
//       } catch (projectError) {
//         console.log('❌ Impossible de récupérer via les projets:', projectError.message);
//       }
      
//       // 🎯 SI LES PROJETS NE FONCTIONNENT PAS, ESSAYER L'API UTILISATEURS DIRECTE
//       console.log('🔄 Essai API users directe...');
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/users/`, {
//           timeout: 5000
//         });
        
//         console.log('✅ Réponse API Users:', response.data);
        
//         let usersData = [];
        
//         // Gérer différents formats
//         if (Array.isArray(response.data)) {
//           usersData = response.data;
//         } else if (response.data.users && Array.isArray(response.data.users)) {
//           usersData = response.data.users;
//         } else if (response.data.results && Array.isArray(response.data.results)) {
//           usersData = response.data.results;
//         }
        
//         if (usersData.length === 0) {
//           // Essayer d'extraire les données de l'objet
//           const keys = Object.keys(response.data);
//           for (const key of keys) {
//             if (Array.isArray(response.data[key]) && response.data[key].length > 0) {
//               const firstItem = response.data[key][0];
//               if (firstItem.username || firstItem.email) {
//                 usersData = response.data[key];
//                 break;
//               }
//             }
//           }
//         }
        
//         if (usersData.length > 0) {
//           const formattedUsers = usersData.map((user, index) => ({
//             id: user.id || index + 1,
//             username: user.username || `user_${index + 1}`,
//             email: user.email || `user${index + 1}@simplon.com`,
//             first_name: user.first_name || '',
//             last_name: user.last_name || '',
//             is_active: user.is_active !== undefined ? user.is_active : true,
//             is_staff: user.is_staff || false,
//             is_superuser: user.is_superuser || false,
//             date_joined: user.date_joined || new Date().toISOString(),
//             last_login: user.last_login || null
//           }));
          
//           setUsers(formattedUsers);
//           setSuccess(`${formattedUsers.length} utilisateurs chargés depuis l'API users`);
//           return;
//         }
        
//       } catch (usersError) {
//         console.log('❌ API users échouée:', usersError.message);
//       }
      
//       // 🎯 FALLBACK : UTILISER DES DONNÉES FACTICES BASÉES SUR LES 13 UTILISATEURS RÉELS
//       console.log('📱 Chargement des 13 utilisateurs factices...');
//       const fakeUsers = generate13Users();
//       setUsers(fakeUsers);
//       setSuccess('13 utilisateurs chargés (données factices)');
      
//     } catch (err) {
//       console.error('❌ Erreur récupération utilisateurs:', err);
//       setError('Impossible de charger les utilisateurs. Vérifiez la connexion Django.');
//       // Charger les 13 utilisateurs factices
//       const fakeUsers = generate13Users();
//       setUsers(fakeUsers);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🎯 GÉNÉRER 13 UTILISATEURS FACTICES (basés sur vos données réelles)
//   const generate13Users = () => {
//     const users = [];
//     const baseNames = [
//       { first: 'Admin', last: 'System', username: 'admin', email: 'admin@simplon.com', staff: true, superuser: true },
//       { first: 'Alice', last: 'Martin', username: 'alice', email: 'alice@simplon.com' },
//       { first: 'Bob', last: 'Dupont', username: 'bob', email: 'bob@simplon.com' },
//       { first: 'Charlie', last: 'Leroy', username: 'charlie', email: 'charlie@simplon.com' },
//       { first: 'Sophie', last: 'Dubois', username: 'simplon_2025003', email: 'sophie.dubois@simplon.com' },
//       { first: 'Thomas', last: 'Bernard', username: 'simplon_2025002', email: 'thomas.bernard@simplon.com' },
//       { first: 'Alice', last: 'Martin', username: 'simplon_2025001', email: 'alice.martin@simplon.com' },
//       { first: 'Emma', last: 'Petit', username: 'simplon_2025004', email: 'emma.petit@simplon.com' },
//       { first: 'Lucas', last: 'Moreau', username: 'simplon_2025005', email: 'lucas.moreau@simplon.com' },
//       { first: 'Chloé', last: 'Laurent', username: 'simplon_2025006', email: 'chloe.laurent@simplon.com' },
//       { first: 'Hugo', last: 'Simon', username: 'simplon_2025007', email: 'hugo.simon@simplon.com' },
//       { first: 'Léa', last: 'Michel', username: 'simplon_2025008', email: 'lea.michel@simplon.com' },
//       { first: 'Mathis', last: 'Durand', username: 'simplon_2025009', email: 'mathis.durand@simplon.com' }
//     ];
    
//     const now = new Date();
    
//     baseNames.forEach((user, index) => {
//       const daysAgo = Math.floor(Math.random() * 365); // Inscrit il y a 0-365 jours
//       const lastLoginDays = Math.floor(Math.random() * 30); // Connecté il y a 0-30 jours
      
//       users.push({
//         id: index + 1,
//         username: user.username,
//         email: user.email,
//         first_name: user.first,
//         last_name: user.last,
//         is_active: Math.random() > 0.2, // 80% actifs
//         is_staff: user.staff || false,
//         is_superuser: user.superuser || false,
//         date_joined: new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
//         last_login: Math.random() > 0.3 ? 
//           new Date(now.getTime() - lastLoginDays * 24 * 60 * 60 * 1000).toISOString() : 
//           null
//       });
//     });
    
//     return users;
//   };

//   // Filtrer les utilisateurs
//   useEffect(() => {
//     let filtered = [...users];
    
//     // Filtre par recherche
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(user =>
//         user.username.toLowerCase().includes(term) ||
//         user.email.toLowerCase().includes(term) ||
//         `${user.first_name} ${user.last_name}`.toLowerCase().includes(term)
//       );
//     }
    
//     // Filtre par rôle
//     if (roleFilter !== 'all') {
//       switch (roleFilter) {
//         case 'admin':
//           filtered = filtered.filter(user => user.is_staff && !user.is_superuser);
//           break;
//         case 'superadmin':
//           filtered = filtered.filter(user => user.is_superuser);
//           break;
//         case 'user':
//           filtered = filtered.filter(user => !user.is_staff && !user.is_superuser);
//           break;
//       }
//     }
    
//     // Filtre par statut
//     if (statusFilter !== 'all') {
//       switch (statusFilter) {
//         case 'active':
//           filtered = filtered.filter(user => user.is_active);
//           break;
//         case 'inactive':
//           filtered = filtered.filter(user => !user.is_active);
//           break;
//         case 'online':
//           filtered = filtered.filter(user => isUserOnline(user));
//           break;
//         case 'offline':
//           filtered = filtered.filter(user => !isUserOnline(user));
//           break;
//       }
//     }
    
//     setFilteredUsers(filtered);
//   }, [users, searchTerm, roleFilter, statusFilter]);

//   // Vérifier si un utilisateur est en ligne
//   const isUserOnline = (user) => {
//     if (!user.last_login || !user.is_active) return false;
//     const lastLogin = new Date(user.last_login);
//     const now = new Date();
//     const diffMs = now - lastLogin;
//     return diffMs < 15 * 60 * 1000; // 15 minutes
//   };

//   // Formater la date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'Jamais';
//     try {
//       const date = new Date(dateString);
//       const now = new Date();
//       const diffMs = now - date;
//       const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
//       if (diffDays === 0) {
//         const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
//         if (diffHours < 1) {
//           const diffMins = Math.floor(diffMs / (1000 * 60));
//           return `Il y a ${diffMins} min`;
//         }
//         return `Il y a ${diffHours} h`;
//       } else if (diffDays === 1) {
//         return 'Hier';
//       } else if (diffDays < 7) {
//         return `Il y a ${diffDays} jours`;
//       } else {
//         return date.toLocaleDateString('fr-FR');
//       }
//     } catch {
//       return 'Date invalide';
//     }
//   };

//   // Calculer les statistiques pour 13 utilisateurs
//   const calculateStats = () => {
//     const total = users.length;
//     const active = users.filter(u => u.is_active).length;
//     const inactive = total - active;
//     const admins = users.filter(u => u.is_staff && !u.is_superuser).length;
//     const superadmins = users.filter(u => u.is_superuser).length;
//     const regular = users.filter(u => !u.is_staff && !u.is_superuser).length;
//     const online = users.filter(isUserOnline).length;
//     const offline = total - online;
    
//     return {
//       total,
//       active,
//       inactive,
//       admins,
//       superadmins,
//       regular,
//       online,
//       offline,
//       activePercentage: total > 0 ? Math.round((active / total) * 100) : 0,
//       onlinePercentage: total > 0 ? Math.round((online / total) * 100) : 0
//     };
//   };

//   // Gérer l'ajout d'utilisateur
//   const handleAddUser = async (e) => {
//     e.preventDefault();
    
//     // Validation
//     const errors = {};
//     if (!newUser.username) errors.username = 'Le nom d\'utilisateur est requis';
//     if (!newUser.email) errors.email = 'L\'email est requis';
//     if (!newUser.password) errors.password = 'Le mot de passe est requis';
    
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }
    
//     try {
//       // Créer le nouvel utilisateur
//       const newUserId = Math.max(...users.map(u => u.id), 0) + 1;
//       const userToAdd = {
//         ...newUser,
//         id: newUserId,
//         date_joined: new Date().toISOString(),
//         last_login: null
//       };
      
//       setUsers(prev => [userToAdd, ...prev]);
//       setSuccess(`Utilisateur "${newUser.username}" ajouté avec succès`);
//       setShowAddModal(false);
//       setNewUser({
//         username: '',
//         email: '',
//         first_name: '',
//         last_name: '',
//         password: '',
//         is_staff: false,
//         is_superuser: false,
//         is_active: true
//       });
      
//     } catch (err) {
//       setError('Erreur lors de l\'ajout de l\'utilisateur');
//     }
//   };

//   // Gérer la suppression
//   const handleDeleteUser = (userId) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
//       setUsers(prev => prev.filter(user => user.id !== userId));
//       setSuccess('Utilisateur supprimé avec succès');
//     }
//   };

//   // Gérer le changement de statut
//   const handleToggleStatus = (userId, currentStatus) => {
//     setUsers(prev => prev.map(user =>
//       user.id === userId ? { ...user, is_active: !currentStatus } : user
//     ));
//     setSuccess(`Statut ${!currentStatus ? 'activé' : 'désactivé'} avec succès`);
//   };

//   // Initialiser le chargement
//   useEffect(() => {
//     fetchAllUsers();
//   }, []);

//   // Calculer les statistiques
//   const stats = calculateStats();

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Chargement des 13 utilisateurs...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* En-tête */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
//               <p className="text-gray-600">13 utilisateurs de la plateforme</p>
//             </div>
//             <button
//               onClick={() => setShowAddModal(true)}
//               className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               <UserPlus size={20} />
//               Ajouter un utilisateur
//             </button>
//           </div>

//           {/* Messages d'alerte */}
//           {error && (
//             <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
//               <div className="flex items-center gap-3">
//                 <AlertCircle className="text-red-500" size={20} />
//                 <p className="text-red-700">{error}</p>
//               </div>
//             </div>
//           )}

//           {success && (
//             <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
//               <div className="flex items-center gap-3">
//                 <CheckCircle className="text-green-500" size={20} />
//                 <p className="text-green-700">{success}</p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Statistiques détaillées */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           {/* Cartes de statistiques */}
//           <div className="bg-white p-6 rounded-xl border">
//             <h2 className="text-lg font-bold mb-4">Vue d'ensemble</h2>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//               <div className="text-center p-4 bg-blue-50 rounded-lg">
//                 <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
//                 <div className="text-sm text-gray-600">Total</div>
//               </div>
//               <div className="text-center p-4 bg-green-50 rounded-lg">
//                 <div className="text-2xl font-bold text-green-600">{stats.active}</div>
//                 <div className="text-sm text-gray-600">Actifs</div>
//                 <div className="text-xs text-gray-500 mt-1">{stats.activePercentage}%</div>
//               </div>
//               <div className="text-center p-4 bg-purple-50 rounded-lg">
//                 <div className="text-2xl font-bold text-purple-600">{stats.admins + stats.superadmins}</div>
//                 <div className="text-sm text-gray-600">Admins</div>
//               </div>
//             </div>
            
//             <div className="mt-6">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-sm text-gray-600">Taux d'activité</span>
//                 <span className="text-sm font-bold">{stats.activePercentage}%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div 
//                   className="bg-green-500 h-2 rounded-full" 
//                   style={{ width: `${stats.activePercentage}%` }}
//                 ></div>
//               </div>
//             </div>
//           </div>

//           {/* Distribution des rôles */}
//           <div className="bg-white p-6 rounded-xl border">
//             <h2 className="text-lg font-bold mb-4">Distribution des rôles</h2>
//             <div className="space-y-4">
//               <div>
//                 <div className="flex justify-between mb-1">
//                   <span className="text-sm text-gray-600">Utilisateurs réguliers</span>
//                   <span className="text-sm font-bold">{stats.regular}</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div 
//                     className="bg-blue-500 h-2 rounded-full" 
//                     style={{ width: `${stats.total > 0 ? (stats.regular / stats.total) * 100 : 0}%` }}
//                   ></div>
//                 </div>
//               </div>
              
//               <div>
//                 <div className="flex justify-between mb-1">
//                   <span className="text-sm text-gray-600">Administrateurs</span>
//                   <span className="text-sm font-bold">{stats.admins}</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div 
//                     className="bg-purple-500 h-2 rounded-full" 
//                     style={{ width: `${stats.total > 0 ? (stats.admins / stats.total) * 100 : 0}%` }}
//                   ></div>
//                 </div>
//               </div>
              
//               <div>
//                 <div className="flex justify-between mb-1">
//                   <span className="text-sm text-gray-600">Super Administrateurs</span>
//                   <span className="text-sm font-bold">{stats.superadmins}</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div 
//                     className="bg-red-500 h-2 rounded-full" 
//                     style={{ width: `${stats.total > 0 ? (stats.superadmins / stats.total) * 100 : 0}%` }}
//                   ></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Filtres */}
//         <div className="bg-white p-4 rounded-lg border mb-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 <input
//                   type="text"
//                   placeholder="Rechercher parmi 13 utilisateurs..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border rounded-lg"
//                 />
//               </div>
//             </div>
            
//             <div className="flex gap-2">
//               <select
//                 value={roleFilter}
//                 onChange={(e) => setRoleFilter(e.target.value)}
//                 className="px-4 py-2 border rounded-lg"
//               >
//                 <option value="all">Tous les rôles</option>
//                 <option value="user">Utilisateurs (11)</option>
//                 <option value="admin">Administrateurs (1)</option>
//                 <option value="superadmin">Super Admins (1)</option>
//               </select>
              
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="px-4 py-2 border rounded-lg"
//               >
//                 <option value="all">Tous les statuts</option>
//                 <option value="active">Actifs ({stats.active})</option>
//                 <option value="inactive">Inactifs ({stats.inactive})</option>
//                 <option value="online">En ligne ({stats.online})</option>
//                 <option value="offline">Hors ligne ({stats.offline})</option>
//               </select>
              
//               <button
//                 onClick={fetchAllUsers}
//                 className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
//               >
//                 <RefreshCw size={20} />
//                 Actualiser
//               </button>
//             </div>
//           </div>
          
//           <div className="mt-3 text-sm text-gray-600">
//             {filteredUsers.length} utilisateur(s) trouvé(s) sur {stats.total}
//           </div>
//         </div>

//         {/* Tableau des 13 utilisateurs */}
//         <div className="bg-white rounded-lg border overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Utilisateur
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Contact
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Rôle & Statut
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Dernière activité
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {filteredUsers.map((user) => (
//                   <tr key={user.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center">
//                         <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${
//                           user.is_superuser ? 'bg-red-600' :
//                           user.is_staff ? 'bg-purple-600' :
//                           user.is_active ? 'bg-blue-600' : 'bg-gray-400'
//                         }`}>
//                           {(user.first_name?.[0] || user.username?.[0] || 'U').toUpperCase()}
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">
//                             {user.first_name} {user.last_name}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             @{user.username}
//                             {user.id <= 13 && (
//                               <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
//                                 {user.id <= 7 ? 'Actif' : 'Nouveau'}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-900">{user.email}</div>
//                       <div className="text-sm text-gray-500">
//                         ID: {user.id} • Inscrit le {new Date(user.date_joined).toLocaleDateString('fr-FR')}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="space-y-2">
//                         <div className="flex items-center">
//                           <div className={`h-2 w-2 rounded-full mr-2 ${
//                             isUserOnline(user) ? 'bg-green-500 animate-pulse' :
//                             user.is_active ? 'bg-yellow-500' : 'bg-gray-400'
//                           }`}></div>
//                           <span className={`text-sm font-medium ${
//                             isUserOnline(user) ? 'text-green-600' :
//                             user.is_active ? 'text-yellow-600' : 'text-gray-500'
//                           }`}>
//                             {isUserOnline(user) ? 'En ligne' :
//                              user.is_active ? 'Hors ligne' : 'Inactif'}
//                           </span>
//                         </div>
                        
//                         <div className="flex flex-wrap gap-1">
//                           {user.is_superuser && (
//                             <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
//                               Super Admin
//                             </span>
//                           )}
//                           {user.is_staff && !user.is_superuser && (
//                             <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
//                               Admin
//                             </span>
//                           )}
//                           {!user.is_staff && !user.is_superuser && (
//                             <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
//                               Utilisateur
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-900">
//                         {formatDate(user.last_login)}
//                       </div>
//                       <div className="text-xs text-gray-500">
//                         {user.last_login ? 'Dernière connexion' : 'Jamais connecté'}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => handleToggleStatus(user.id, user.is_active)}
//                           className={`p-2 rounded ${
//                             user.is_active 
//                               ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
//                               : 'bg-green-100 text-green-600 hover:bg-green-200'
//                           }`}
//                           title={user.is_active ? 'Désactiver' : 'Activer'}
//                         >
//                           {user.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
//                         </button>
                        
//                         <button
//                           onClick={() => setEditingUser(user)}
//                           className="p-2 rounded bg-blue-100 text-blue-600 hover:bg-blue-200"
//                           title="Modifier"
//                         >
//                           <Edit size={16} />
//                         </button>
                        
//                         <button
//                           onClick={() => handleDeleteUser(user.id)}
//                           className="p-2 rounded bg-red-100 text-red-600 hover:bg-red-200"
//                           title="Supprimer"
//                           disabled={user.is_superuser}
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
          
//           {filteredUsers.length === 0 && (
//             <div className="text-center py-12">
//               <Users className="mx-auto text-gray-300 mb-4" size={48} />
//               <p className="text-gray-500">Aucun utilisateur ne correspond aux critères</p>
//               <button
//                 onClick={() => {
//                   setSearchTerm('');
//                   setRoleFilter('all');
//                   setStatusFilter('all');
//                 }}
//                 className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               >
//                 Réinitialiser les filtres
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Informations */}
//         <div className="mt-6 text-center text-sm text-gray-500">
//           <div className="flex items-center justify-center gap-4">
//             <div className="flex items-center gap-2">
//               <div className="h-2 w-2 bg-green-500 rounded-full"></div>
//               <span>En ligne</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
//               <span>Hors ligne</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
//               <span>Inactif</span>
//             </div>
//           </div>
//           <p className="mt-2">Total: 13 utilisateurs • Base de données: PostgreSQL • API: Django REST</p>
//         </div>
//       </div>

//       {/* Modal d'ajout */}
//       {showAddModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h2 className="text-lg font-bold mb-4">Ajouter un utilisateur</h2>
            
//             <form onSubmit={handleAddUser}>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Nom d'utilisateur *</label>
//                   <input
//                     type="text"
//                     value={newUser.username}
//                     onChange={(e) => setNewUser({...newUser, username: e.target.value})}
//                     className="w-full px-3 py-2 border rounded-lg"
//                     placeholder="simplon_2025010"
//                   />
//                   {formErrors.username && (
//                     <p className="text-sm text-red-600 mt-1">{formErrors.username}</p>
//                   )}
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Email *</label>
//                   <input
//                     type="email"
//                     value={newUser.email}
//                     onChange={(e) => setNewUser({...newUser, email: e.target.value})}
//                     className="w-full px-3 py-2 border rounded-lg"
//                     placeholder="nouveau@simplon.com"
//                   />
//                   {formErrors.email && (
//                     <p className="text-sm text-red-600 mt-1">{formErrors.email}</p>
//                   )}
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Prénom</label>
//                     <input
//                       type="text"
//                       value={newUser.first_name}
//                       onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
//                       className="w-full px-3 py-2 border rounded-lg"
//                       placeholder="Jean"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1">Nom</label>
//                     <input
//                       type="text"
//                       value={newUser.last_name}
//                       onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
//                       className="w-full px-3 py-2 border rounded-lg"
//                       placeholder="Dupont"
//                     />
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Mot de passe *</label>
//                   <input
//                     type="password"
//                     value={newUser.password}
//                     onChange={(e) => setNewUser({...newUser, password: e.target.value})}
//                     className="w-full px-3 py-2 border rounded-lg"
//                     placeholder="••••••••"
//                   />
//                   {formErrors.password && (
//                     <p className="text-sm text-red-600 mt-1">{formErrors.password}</p>
//                   )}
//                 </div>
                
//                 <div className="space-y-2">
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={newUser.is_staff}
//                       onChange={(e) => setNewUser({...newUser, is_staff: e.target.checked})}
//                       className="mr-2"
//                     />
//                     <label className="text-sm">Administrateur</label>
//                   </div>
                  
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={newUser.is_superuser}
//                       onChange={(e) => setNewUser({...newUser, is_superuser: e.target.checked})}
//                       className="mr-2"
//                     />
//                     <label className="text-sm">Super administrateur</label>
//                   </div>
                  
//                   <div className="flex items-center">
//                     <input
//                       type="checkbox"
//                       checked={newUser.is_active}
//                       onChange={(e) => setNewUser({...newUser, is_active: e.target.checked})}
//                       className="mr-2"
//                     />
//                     <label className="text-sm">Compte actif</label>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
//                 <button
//                   type="button"
//                   onClick={() => setShowAddModal(false)}
//                   className="px-4 py-2 border rounded-lg hover:bg-gray-50"
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   Ajouter l'utilisateur
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


// // src/components/admin/UserManagement.jsx - VERSION ADMIN AVEC SUPPRESSION SEULEMENT
// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import {
//   Users, UserPlus, Search, Filter, RefreshCw,
//   UserCheck, UserX, Shield, ShieldAlert, Mail,
//   Calendar, Clock, Trash2, MoreVertical,
//   CheckCircle, XCircle, AlertCircle, Database,
//   Wifi, WifiOff, Eye, EyeOff, Key, Crown,
//   User as UserIcon, Activity, TrendingUp, BarChart,
//   Lock, Unlock, LogOut, LogIn
// } from 'lucide-react';

// const UserManagement = () => {
//   // État principal
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
  
//   // Filtres et recherche
//   const [searchTerm, setSearchTerm] = useState('');
//   const [roleFilter, setRoleFilter] = useState('all');
//   const [statusFilter, setStatusFilter] = useState('all');
  
//   // Modal de confirmation de suppression
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [userToDelete, setUserToDelete] = useState(null);
  
//   // API Configuration
//   const API_BASE_URL = 'http://localhost:8000';
  
//   // 🎯 FONCTION : Récupérer les 13 utilisateurs réels
//   const fetchAllUsers = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       console.log('🔍 Récupération des 13 utilisateurs depuis PostgreSQL...');
      
//       // 🎯 ESSAYER L'API UTILISATEURS DIRECTE
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/users/`, {
//           timeout: 5000
//         });
        
//         console.log('✅ Réponse API Users:', response.data);
        
//         let usersData = [];
        
//         // Gérer différents formats
//         if (Array.isArray(response.data)) {
//           usersData = response.data;
//         } else if (response.data.users && Array.isArray(response.data.users)) {
//           usersData = response.data.users;
//         } else if (response.data.results && Array.isArray(response.data.results)) {
//           usersData = response.data.results;
//         } else if (response.data.data && Array.isArray(response.data.data)) {
//           usersData = response.data.data;
//         }
        
//         // Si on a des données, les formater
//         if (usersData.length > 0) {
//           const formattedUsers = usersData.map((user, index) => ({
//             id: user.id || index + 1,
//             username: user.username || `user_${index + 1}`,
//             email: user.email || `user${index + 1}@simplon.com`,
//             first_name: user.first_name || '',
//             last_name: user.last_name || '',
//             is_active: user.is_active !== undefined ? user.is_active : true,
//             is_staff: user.is_staff || false,
//             is_superuser: user.is_superuser || false,
//             date_joined: user.date_joined || new Date().toISOString(),
//             last_login: user.last_login || null
//           }));
          
//           // Trier pour avoir l'admin en premier
//           const sortedUsers = formattedUsers.sort((a, b) => {
//             if (a.is_superuser && !b.is_superuser) return -1;
//             if (!a.is_superuser && b.is_superuser) return 1;
//             if (a.is_staff && !b.is_staff) return -1;
//             if (!a.is_staff && b.is_staff) return 1;
//             return 0;
//           });
          
//           setUsers(sortedUsers);
//           setSuccess(`${sortedUsers.length} utilisateurs chargés depuis la base de données`);
//           return;
//         }
        
//       } catch (usersError) {
//         console.log('❌ API users échouée:', usersError.message);
//       }
      
//       // 🎯 FALLBACK : UTILISER DES DONNÉES FACTICES POUR LES 13 UTILISATEURS
//       console.log('📱 Chargement des 13 utilisateurs factices...');
//       const fakeUsers = generate13Users();
//       setUsers(fakeUsers);
//       setSuccess('13 utilisateurs chargés (données factices)');
      
//     } catch (err) {
//       console.error('❌ Erreur récupération utilisateurs:', err);
//       setError('Impossible de charger les utilisateurs depuis PostgreSQL.');
//       const fakeUsers = generate13Users();
//       setUsers(fakeUsers);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🎯 GÉNÉRER 13 UTILISATEURS FACTICES (similaire à votre base)
//   const generate13Users = () => {
//     const users = [];
//     const baseUsers = [
//       // Super Admin
//       { id: 1, username: 'admin', email: 'admin@simplon.com', first_name: 'Admin', last_name: 'System', 
//         is_active: true, is_staff: true, is_superuser: true, last_login: new Date().toISOString() },
      
//       // Admins staff (non superuser)
//       { id: 2, username: 'alice', email: 'alice@simplon.com', first_name: 'Alice', last_name: 'Martin',
//         is_active: true, is_staff: true, is_superuser: false, last_login: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
      
//       // Utilisateurs réguliers
//       { id: 3, username: 'bob', email: 'bob@simplon.com', first_name: 'Bob', last_name: 'Dupont',
//         is_active: true, is_staff: false, is_superuser: false, last_login: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      
//       { id: 4, username: 'charlie', email: 'charlie@simplon.com', first_name: 'Charlie', last_name: 'Leroy',
//         is_active: true, is_staff: false, is_superuser: false, last_login: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
      
//       { id: 5, username: 'simplon_2025003', email: 'sophie.dubois@simplon.com', first_name: 'Sophie', last_name: 'Dubois',
//         is_active: true, is_staff: false, is_superuser: false, last_login: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
      
//       { id: 6, username: 'simplon_2025002', email: 'thomas.bernard@simplon.com', first_name: 'Thomas', last_name: 'Bernard',
//         is_active: true, is_staff: false, is_superuser: false, last_login: new Date(Date.now() - 45 * 60 * 1000).toISOString() },
      
//       { id: 7, username: 'simplon_2025001', email: 'alice.martin@simplon.com', first_name: 'Alice', last_name: 'Martin',
//         is_active: true, is_staff: false, is_superuser: false, last_login: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      
//       { id: 8, username: 'simplon_2025004', email: 'emma.petit@simplon.com', first_name: 'Emma', last_name: 'Petit',
//         is_active: false, is_staff: false, is_superuser: false, last_login: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
      
//       { id: 9, username: 'simplon_2025005', email: 'lucas.moreau@simplon.com', first_name: 'Lucas', last_name: 'Moreau',
//         is_active: true, is_staff: false, is_superuser: false, last_login: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
      
//       { id: 10, username: 'simplon_2025006', email: 'chloe.laurent@simplon.com', first_name: 'Chloé', last_name: 'Laurent',
//         is_active: true, is_staff: false, is_superuser: false, last_login: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
      
//       { id: 11, username: 'simplon_2025007', email: 'hugo.simon@simplon.com', first_name: 'Hugo', last_name: 'Simon',
//         is_active: true, is_staff: false, is_superuser: false, last_login: new Date(Date.now() - 20 * 60 * 1000).toISOString() },
      
//       { id: 12, username: 'simplon_2025008', email: 'lea.michel@simplon.com', first_name: 'Léa', last_name: 'Michel',
//         is_active: false, is_staff: false, is_superuser: false, last_login: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
      
//       { id: 13, username: 'simplon_2025009', email: 'mathis.durand@simplon.com', first_name: 'Mathis', last_name: 'Durand',
//         is_active: true, is_staff: false, is_superuser: false, last_login: new Date(Date.now() - 30 * 60 * 1000).toISOString() }
//     ];
    
//     const now = new Date();
//     baseUsers.forEach((user, index) => {
//       const daysAgo = Math.floor(Math.random() * 365);
//       users.push({
//         ...user,
//         date_joined: new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString()
//       });
//     });
    
//     return users;
//   };

//   // Filtrer les utilisateurs
//   useEffect(() => {
//     let filtered = [...users];
    
//     // Filtre par recherche
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(user =>
//         user.username.toLowerCase().includes(term) ||
//         user.email.toLowerCase().includes(term) ||
//         `${user.first_name} ${user.last_name}`.toLowerCase().includes(term)
//       );
//     }
    
//     // Filtre par rôle
//     if (roleFilter !== 'all') {
//       switch (roleFilter) {
//         case 'admin':
//           filtered = filtered.filter(user => user.is_staff && !user.is_superuser);
//           break;
//         case 'superadmin':
//           filtered = filtered.filter(user => user.is_superuser);
//           break;
//         case 'user':
//           filtered = filtered.filter(user => !user.is_staff && !user.is_superuser);
//           break;
//       }
//     }
    
//     // Filtre par statut
//     if (statusFilter !== 'all') {
//       switch (statusFilter) {
//         case 'active':
//           filtered = filtered.filter(user => user.is_active);
//           break;
//         case 'inactive':
//           filtered = filtered.filter(user => !user.is_active);
//           break;
//         case 'online':
//           filtered = filtered.filter(user => isUserOnline(user));
//           break;
//         case 'offline':
//           filtered = filtered.filter(user => !isUserOnline(user) && user.is_active);
//           break;
//       }
//     }
    
//     setFilteredUsers(filtered);
//   }, [users, searchTerm, roleFilter, statusFilter]);

//   // 🎯 Vérifier si un utilisateur est en ligne (basé sur last_login)
//   const isUserOnline = (user) => {
//     if (!user.last_login || !user.is_active) return false;
//     const lastLogin = new Date(user.last_login);
//     const now = new Date();
//     const diffMs = now - lastLogin;
//     return diffMs < 15 * 60 * 1000; // 15 minutes
//   };

//   // Formater la date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'Jamais';
//     try {
//       const date = new Date(dateString);
//       const now = new Date();
//       const diffMs = now - date;
//       const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
//       if (diffDays === 0) {
//         const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
//         if (diffHours < 1) {
//           const diffMins = Math.floor(diffMs / (1000 * 60));
//           return `Il y a ${diffMins} min`;
//         }
//         return `Il y a ${diffHours} h`;
//       } else if (diffDays === 1) {
//         return 'Hier';
//       } else if (diffDays < 7) {
//         return `Il y a ${diffDays} jours`;
//       } else {
//         return date.toLocaleDateString('fr-FR');
//       }
//     } catch {
//       return 'Date invalide';
//     }
//   };

//   // 🎯 Calculer les statistiques
//   const calculateStats = () => {
//     const total = users.length;
//     const active = users.filter(u => u.is_active).length;
//     const inactive = total - active;
//     const admins = users.filter(u => u.is_staff && !u.is_superuser).length;
//     const superadmins = users.filter(u => u.is_superuser).length;
//     const regular = users.filter(u => !u.is_staff && !u.is_superuser).length;
//     const online = users.filter(isUserOnline).length;
//     const offline = active - online;
    
//     return {
//       total,
//       active,
//       inactive,
//       admins,
//       superadmins,
//       regular,
//       online,
//       offline,
//       activePercentage: total > 0 ? Math.round((active / total) * 100) : 0,
//       onlinePercentage: active > 0 ? Math.round((online / active) * 100) : 0
//     };
//   };

//   // 🎯 Gérer la suppression d'utilisateur
//   const handleDeleteUser = (userId) => {
//     setUserToDelete(userId);
//     setShowDeleteModal(true);
//   };

//   // 🎯 Confirmer la suppression
//   const confirmDeleteUser = () => {
//     if (userToDelete) {
//       const user = users.find(u => u.id === userToDelete);
//       if (user) {
//         // Empêcher la suppression de l'admin principal
//         if (user.is_superuser && user.username === 'admin') {
//           setError('Impossible de supprimer le super administrateur principal');
//           setShowDeleteModal(false);
//           return;
//         }
        
//         // Supprimer l'utilisateur
//         setUsers(prev => prev.filter(u => u.id !== userToDelete));
//         setSuccess(`Utilisateur "${user.username}" supprimé avec succès`);
//       }
//     }
//     setShowDeleteModal(false);
//     setUserToDelete(null);
//   };

//   // Initialiser le chargement
//   useEffect(() => {
//     fetchAllUsers();
//   }, []);

//   // Calculer les statistiques
//   const stats = calculateStats();

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Chargement des 13 utilisateurs...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* En-tête */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
//               <p className="text-gray-600">13 utilisateurs - PostgreSQL</p>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
//                 {stats.online} en ligne
//               </span>
//               <button
//                 onClick={fetchAllUsers}
//                 className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
//               >
//                 <RefreshCw size={20} />
//                 Actualiser
//               </button>
//             </div>
//           </div>

//           {/* Messages d'alerte */}
//           {error && (
//             <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
//               <div className="flex items-center gap-3">
//                 <AlertCircle className="text-red-500" size={20} />
//                 <p className="text-red-700">{error}</p>
//               </div>
//             </div>
//           )}

//           {success && (
//             <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
//               <div className="flex items-center gap-3">
//                 <CheckCircle className="text-green-500" size={20} />
//                 <p className="text-green-700">{success}</p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Statistiques */}
//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
//           <div className="bg-white p-4 rounded-lg border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-600">Total</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
//               </div>
//               <Users className="text-gray-600" size={20} />
//             </div>
//           </div>
          
//           <div className="bg-white p-4 rounded-lg border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-600">En ligne</p>
//                 <p className="text-2xl font-bold text-green-600">{stats.online}</p>
//               </div>
//               <Wifi className="text-green-600" size={20} />
//             </div>
//           </div>
          
//           <div className="bg-white p-4 rounded-lg border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-600">Hors ligne</p>
//                 <p className="text-2xl font-bold text-yellow-600">{stats.offline}</p>
//               </div>
//               <WifiOff className="text-yellow-600" size={20} />
//             </div>
//           </div>
          
//           <div className="bg-white p-4 rounded-lg border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-600">Actifs</p>
//                 <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
//               </div>
//               <UserCheck className="text-emerald-600" size={20} />
//             </div>
//           </div>
          
//           <div className="bg-white p-4 rounded-lg border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-600">Inactifs</p>
//                 <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
//               </div>
//               <UserX className="text-gray-600" size={20} />
//             </div>
//           </div>
          
//           <div className="bg-white p-4 rounded-lg border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-600">Admins</p>
//                 <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
//               </div>
//               <Shield className="text-purple-600" size={20} />
//             </div>
//           </div>
          
//           <div className="bg-white p-4 rounded-lg border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-600">Super Admins</p>
//                 <p className="text-2xl font-bold text-red-600">{stats.superadmins}</p>
//               </div>
//               <Crown className="text-red-600" size={20} />
//             </div>
//           </div>
          
//           <div className="bg-white p-4 rounded-lg border">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-gray-600">Utilisateurs</p>
//                 <p className="text-2xl font-bold text-blue-600">{stats.regular}</p>
//               </div>
//               <UserIcon className="text-blue-600" size={20} />
//             </div>
//           </div>
//         </div>

//         {/* Filtres */}
//         <div className="bg-white p-4 rounded-lg border mb-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 <input
//                   type="text"
//                   placeholder="Rechercher un utilisateur..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>
            
//             <div className="flex gap-2">
//               <select
//                 value={roleFilter}
//                 onChange={(e) => setRoleFilter(e.target.value)}
//                 className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="all">Tous les rôles</option>
//                 <option value="superadmin">Super Admins</option>
//                 <option value="admin">Administrateurs</option>
//                 <option value="user">Utilisateurs</option>
//               </select>
              
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="all">Tous les statuts</option>
//                 <option value="online">En ligne</option>
//                 <option value="offline">Hors ligne</option>
//                 <option value="active">Comptes actifs</option>
//                 <option value="inactive">Comptes inactifs</option>
//               </select>
              
//               {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
//                 <button
//                   onClick={() => {
//                     setSearchTerm('');
//                     setRoleFilter('all');
//                     setStatusFilter('all');
//                   }}
//                   className="px-4 py-2 border rounded-lg hover:bg-gray-50"
//                 >
//                   Effacer
//                 </button>
//               )}
//             </div>
//           </div>
          
//           <div className="mt-3 text-sm text-gray-600">
//             {filteredUsers.length} utilisateur(s) trouvé(s) sur {stats.total}
//           </div>
//         </div>

//         {/* Tableau des utilisateurs */}
//         <div className="bg-white rounded-lg border overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Utilisateur
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Informations
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Statut & Rôle
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Activité
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {filteredUsers.map((user) => {
//                   const online = isUserOnline(user);
                  
//                   return (
//                     <tr key={user.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center">
//                           <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${
//                             user.is_superuser ? 'bg-red-600' :
//                             user.is_staff ? 'bg-purple-600' :
//                             online ? 'bg-green-600' :
//                             user.is_active ? 'bg-blue-600' : 'bg-gray-400'
//                           }`}>
//                             {(user.first_name?.[0] || user.username?.[0] || 'U').toUpperCase()}
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">
//                               {user.first_name} {user.last_name}
//                             </div>
//                             <div className="text-sm text-gray-500">
//                               @{user.username}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-900">{user.email}</div>
//                         <div className="text-xs text-gray-500 mt-1">
//                           ID: {user.id} • Inscrit le {new Date(user.date_joined).toLocaleDateString('fr-FR')}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="space-y-2">
//                           <div className="flex items-center">
//                             <div className={`h-2 w-2 rounded-full mr-2 ${
//                               online ? 'bg-green-500 animate-pulse' :
//                               user.is_active ? 'bg-blue-500' : 'bg-gray-400'
//                             }`}></div>
//                             <span className={`text-sm font-medium ${
//                               online ? 'text-green-600' :
//                               user.is_active ? 'text-blue-600' : 'text-gray-500'
//                             }`}>
//                               {online ? 'En ligne' :
//                                user.is_active ? 'Actif' : 'Inactif'}
//                             </span>
//                           </div>
                          
//                           <div className="flex flex-wrap gap-1">
//                             {user.is_superuser ? (
//                               <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
//                                 Super Admin
//                               </span>
//                             ) : user.is_staff ? (
//                               <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
//                                 Admin
//                               </span>
//                             ) : (
//                               <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
//                                 Utilisateur
//                               </span>
//                             )}
                            
//                             {online && (
//                               <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
//                                 Connecté
//                               </span>
//                             )}
                            
//                             {!user.is_active && (
//                               <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
//                                 Compte inactif
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-900">
//                           {user.last_login ? (
//                             <>
//                               <div className="flex items-center gap-1">
//                                 {online ? <LogIn size={14} /> : <LogOut size={14} />}
//                                 {formatDate(user.last_login)}
//                               </div>
//                               <div className="text-xs text-gray-500 mt-1">
//                                 {online ? 'Connecté en ce moment' : 'Dernière connexion'}
//                               </div>
//                             </>
//                           ) : (
//                             'Jamais connecté'
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         {/* 🎯 SEULE ACTION : SUPPRIMER */}
//                         <button
//                           onClick={() => handleDeleteUser(user.id)}
//                           disabled={user.is_superuser && user.username === 'admin'}
//                           className={`p-2 rounded ${
//                             user.is_superuser && user.username === 'admin'
//                               ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                               : 'bg-red-100 text-red-600 hover:bg-red-200'
//                           }`}
//                           title={
//                             user.is_superuser && user.username === 'admin'
//                               ? 'Impossible de supprimer le super admin principal'
//                               : 'Supprimer cet utilisateur'
//                           }
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
          
//           {filteredUsers.length === 0 && (
//             <div className="text-center py-12">
//               <Search className="mx-auto text-gray-300 mb-4" size={48} />
//               <p className="text-gray-500">Aucun utilisateur ne correspond aux critères</p>
//               <button
//                 onClick={() => {
//                   setSearchTerm('');
//                   setRoleFilter('all');
//                   setStatusFilter('all');
//                 }}
//                 className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               >
//                 Réinitialiser les filtres
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Légende et informations */}
//         <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//             <div>
//               <h3 className="text-sm font-medium text-gray-900 mb-2">Légende</h3>
//               <div className="flex flex-wrap gap-3 text-xs">
//                 <div className="flex items-center gap-1">
//                   <div className="h-2 w-2 bg-green-500 rounded-full"></div>
//                   <span>En ligne (connecté il y a moins de 15 min)</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
//                   <span>Actif mais hors ligne</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
//                   <span>Compte inactif</span>
//                 </div>
//               </div>
//             </div>
//             <div className="text-sm text-gray-600 text-right">
//               <p>Total: 13 utilisateurs • PostgreSQL • API Django</p>
//               <p className="text-xs mt-1">Statut "actif" géré automatiquement par le système de connexion</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 🎯 MODAL DE CONFIRMATION DE SUPPRESSION */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <div className="flex items-center gap-3 mb-4">
//               <AlertCircle className="text-red-500" size={24} />
//               <h2 className="text-lg font-bold">Confirmer la suppression</h2>
//             </div>
            
//             {userToDelete && (
//               <div className="mb-6">
//                 <p className="text-gray-700 mb-2">
//                   Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
//                 </p>
//                 <div className="p-4 bg-red-50 rounded-lg">
//                   <div className="font-medium text-red-800">
//                     {users.find(u => u.id === userToDelete)?.username}
//                   </div>
//                   <div className="text-sm text-red-600">
//                     {users.find(u => u.id === userToDelete)?.email}
//                   </div>
//                   <div className="text-xs text-red-500 mt-1">
//                     Toutes les données associées seront perdues.
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => {
//                   setShowDeleteModal(false);
//                   setUserToDelete(null);
//                 }}
//                 className="px-4 py-2 border rounded-lg hover:bg-gray-50"
//               >
//                 Annuler
//               </button>
//               <button
//                 onClick={confirmDeleteUser}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//               >
//                 Supprimer définitivement
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserManagement;



// src/components/admin/UserManagement.jsx - VERSION FINALE QUI FONCTIONNE
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users, Search, RefreshCw, Check, X,
  Crown, Shield, User, AlertCircle, CheckCircle,
  Trash2, Mail, Database, Calendar, Activity,
  Eye, UserCheck, UserX, TrendingUp, Target
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const API_BASE = 'http://localhost:8000';
  const USERS_API = `${API_BASE}/api/users/all/`;

  // 🎯 Charger les utilisateurs depuis l'API Django
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Chargement des utilisateurs depuis:', USERS_API);
      
      const response = await axios.get(USERS_API, { timeout: 5000 });
      
      if (response.data.status === 'success') {
        const usersData = response.data.users.map(user => ({
          ...user,
          // Ajouter une propriété pour l'affichage
          display_name: `${user.first_name} ${user.last_name}`.trim() || user.username,
          // Formatage des dates
          date_joined_display: new Date(user.date_joined).toLocaleDateString('fr-FR'),
          last_login_display: user.last_login 
            ? new Date(user.last_login).toLocaleDateString('fr-FR')
            : 'Jamais'
        }));
        
        setUsers(usersData);
        console.log(`✅ ${usersData.length} utilisateurs chargés depuis Django`);
      } else {
        throw new Error('Format de réponse invalide');
      }
      
    } catch (err) {
      console.error('❌ Erreur:', err);
      setError(`Impossible de charger les utilisateurs: ${err.message}`);
      // Mode démo en cas d'erreur
      setUsers(generateDemoUsers());
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Données de démo (fallback)
  const generateDemoUsers = () => {
    return [
      {
        id: 1,
        username: 'admin',
        email: 'admin@simplon.com',
        first_name: 'Admin',
        last_name: 'System',
        is_active: true,
        is_staff: true,
        is_superuser: true,
        date_joined: new Date().toISOString(),
        display_name: 'Admin System'
      }
    ];
  };

  // 🎯 Initialisation
  useEffect(() => {
    loadUsers();
  }, []);

  // 🎯 Filtrer les utilisateurs
  const filteredUsers = users.filter(user => {
    // Filtre par recherche
    const searchMatch = !search || 
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.display_name.toLowerCase().includes(search.toLowerCase());
    
    // Filtre par rôle
    let roleMatch = true;
    if (roleFilter !== 'all') {
      switch (roleFilter) {
        case 'superadmin': roleMatch = user.is_superuser; break;
        case 'admin': roleMatch = user.is_staff && !user.is_superuser; break;
        case 'user': roleMatch = !user.is_staff && !user.is_superuser; break;
      }
    }
    
    // Filtre par statut
    let statusMatch = true;
    if (statusFilter !== 'all') {
      switch (statusFilter) {
        case 'active': statusMatch = user.is_active; break;
        case 'inactive': statusMatch = !user.is_active; break;
      }
    }
    
    return searchMatch && roleMatch && statusMatch;
  });

  // 🎯 Statistiques
  const stats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    staff: users.filter(u => u.is_staff).length,
    super: users.filter(u => u.is_superuser).length,
    regular: users.filter(u => !u.is_staff && !u.is_superuser).length,
    withLogin: users.filter(u => u.last_login).length
  };

  // 🎯 Formatage date relative
  const getRelativeTime = (dateString) => {
    if (!dateString) return 'Jamais';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays/7)} semaines`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des utilisateurs...</p>
          <p className="text-sm text-gray-500 mt-2">{USERS_API}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Database className="text-blue-600" size={24} />
                Gestion des Utilisateurs
              </h1>
              <p className="text-gray-600">
                {stats.total} utilisateurs • Base de données Django
              </p>
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <CheckCircle size={14} />
                ✅ Connecté à l'API Django
              </p>
            </div>
            <button
              onClick={loadUsers}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={20} />
              Actualiser
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-500" size={20} />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-gray-500">utilisateurs</p>
              </div>
              <Users className="text-blue-600" size={20} />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Actifs</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                <p className="text-xs text-gray-500">
                  {stats.withLogin} connecté(s)
                </p>
              </div>
              <UserCheck className="text-green-600" size={20} />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Super Admins</p>
                <p className="text-2xl font-bold text-red-600">{stats.super}</p>
                <p className="text-xs text-gray-500">niveau système</p>
              </div>
              <Crown className="text-red-600" size={20} />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-purple-600">{stats.staff}</p>
                <p className="text-xs text-gray-500">staff</p>
              </div>
              <Shield className="text-purple-600" size={20} />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Apprenants</p>
                <p className="text-2xl font-bold text-blue-600">{stats.regular}</p>
                <p className="text-xs text-gray-500">utilisateurs</p>
              </div>
              <User className="text-blue-600" size={20} />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">API</p>
                <p className="text-xl font-bold text-gray-800">Django</p>
                <p className="text-xs text-green-600">● Connecté</p>
              </div>
              <Database className="text-gray-600" size={20} />
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white p-4 rounded-lg border shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou username..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les rôles</option>
                <option value="superadmin">Super Admins</option>
                <option value="admin">Admins</option>
                <option value="user">Utilisateurs</option>
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
              </select>
              
              {(search || roleFilter !== 'all' || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearch('');
                    setRoleFilter('all');
                    setStatusFilter('all');
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Effacer
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-3 text-sm text-gray-600">
            {filteredUsers.length} utilisateur(s) trouvé(s) sur {stats.total}
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Informations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle & Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${
                          user.is_superuser ? 'bg-red-600' :
                          user.is_staff ? 'bg-purple-600' :
                          user.is_active ? 'bg-green-600' : 'bg-gray-400'
                        }`}>
                          {(user.first_name?.[0] || user.username?.[0] || 'U').toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.display_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{user.username}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-900 flex items-center gap-1">
                          <Mail size={14} className="text-gray-400" />
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar size={12} />
                          Inscrit le {user.date_joined_display}
                        </div>
                        {user.projects_count > 0 && (
                          <div className="text-xs text-blue-600">
                            {user.projects_count} projet{user.projects_count > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {/* Rôle */}
                        <div className="flex flex-wrap gap-1">
                          {user.is_superuser ? (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center gap-1">
                              <Crown size={10} />
                              Super Admin
                            </span>
                          ) : user.is_staff ? (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full flex items-center gap-1">
                              <Shield size={10} />
                              Admin
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1">
                              <User size={10} />
                              Utilisateur
                            </span>
                          )}
                        </div>
                        
                        {/* Statut du compte */}
                        <div>
                          {user.is_active ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              <Check size={12} />
                              Compte actif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                              <X size={12} />
                              Compte désactivé
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">
                          {getRelativeTime(user.last_login)}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Activity size={12} />
                          {user.last_login ? 'Dernière connexion' : 'Jamais connecté'}
                        </div>
                        <div className="text-xs text-gray-400">
                          Inscrit {getRelativeTime(user.date_joined)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            // Pour l'instant, suppression locale seulement
                            if (window.confirm(`Supprimer l'utilisateur ${user.username} ?`)) {
                              setUsers(prev => prev.filter(u => u.id !== user.id));
                            }
                          }}
                          disabled={user.is_superuser && user.username === 'admin'}
                          className={`p-2 rounded transition-colors ${
                            user.is_superuser && user.username === 'admin'
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}
                          title={
                            user.is_superuser && user.username === 'admin'
                              ? 'Impossible de supprimer le super admin principal'
                              : `Supprimer ${user.username}`
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            // Voir les détails
                            console.log('Détails utilisateur:', user);
                            alert(`Détails de ${user.username}\nEmail: ${user.email}\nRôle: ${user.is_superuser ? 'Super Admin' : user.is_staff ? 'Admin' : 'Utilisateur'}`);
                          }}
                          className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                          title={`Voir les détails de ${user.username}`}
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Search className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">Aucun utilisateur ne correspond aux critères</p>
              <button
                onClick={() => {
                  setSearch('');
                  setRoleFilter('all');
                  setStatusFilter('all');
                }}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>

        {/* Résumé */}
        {/* <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"> */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
            {/* <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Target size={20} />
                Résumé de la base de données
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex justify-between">
                  <span>Total utilisateurs :</span>
                  <span className="font-medium">{stats.total}</span>
                </li>
                <li className="flex justify-between">
                  <span>Super admins :</span>
                  <span className="font-medium text-red-600">{stats.super}</span>
                </li>
                <li className="flex justify-between">
                  <span>Admins staff :</span>
                  <span className="font-medium text-purple-600">{stats.staff}</span>
                </li>
                <li className="flex justify-between">
                  <span>Apprenants :</span>
                  <span className="font-medium text-blue-600">{stats.regular}</span>
                </li>
                <li className="flex justify-between">
                  <span>Avec connexion récente :</span>
                  <span className="font-medium text-green-600">{stats.withLogin}</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp size={20} />
                Endpoints API disponibles
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a 
                    href={`${API_BASE}/api/users/all/`} 
                    target="_blank"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Database size={12} />
                    /api/users/all/ (public)
                  </a>
                </li>
                <li>
                  <a 
                    href={`${API_BASE}/api/users/summary/`} 
                    target="_blank"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Database size={12} />
                    /api/users/summary/ (statistiques)
                  </a>
                </li>
                <li>
                  <a 
                    href={`${API_BASE}/api/users/all/admin/`} 
                    target="_blank"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Database size={12} />
                    /api/users/all/admin/ (admin)
                  </a>
                </li>
                <li>
                  <a 
                    href={`${API_BASE}/admin/`} 
                    target="_blank"
                    className="text-gray-600 hover:underline flex items-center gap-1"
                  >
                    🔐 Admin Django
                  </a>
                </li> */}
              {/* </ul>
            </div> */}
          {/* </div> */}
        {/* </div> */}

        {/* Notes */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Définitions</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-start gap-2">
                  <div className="h-3 w-3 bg-red-600 rounded-full mt-1"></div>
                  <span><strong>Super Admin</strong> : Accès complet au système</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-3 w-3 bg-purple-600 rounded-full mt-1"></div>
                  <span><strong>Admin</strong> : Gestion des contenus et utilisateurs</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-3 w-3 bg-green-600 rounded-full mt-1"></div>
                  <span><strong>Compte actif</strong> : Peut se connecter</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Permissions admin</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-center gap-1">
                  <CheckCircle size={12} className="text-green-500" />
                  <span>Voir tous les utilisateurs</span>
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle size={12} className="text-green-500" />
                  <span>Supprimer des utilisateurs (sauf super admin)</span>
                </li>
                <li className="flex items-center gap-1">
                  <AlertCircle size={12} className="text-gray-400" />
                  <span>Modification via admin Django</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;