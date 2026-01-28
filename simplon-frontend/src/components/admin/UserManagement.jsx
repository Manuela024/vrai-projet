

// src/components/admin/UserManagement.jsx - VERSION FINALE CORRIGÉE
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users, Search, RefreshCw, Check, X,
  Crown, Shield, User, AlertCircle, CheckCircle,
  Mail, Database, Calendar, Activity,
  Eye, UserCheck, GraduationCap,
  Loader2, ExternalLink, Lock, Info
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [apiResponse, setApiResponse] = useState(null);
  
  const API_BASE = 'http://localhost:8000';
  
  // ✅ UTILISEZ VOTRE ENDPOINT EXISTANT
  const USERS_API = `${API_BASE}/api/users/all/`;
  const ADMIN_API = `${API_BASE}/admin/`;

  // 🎯 DÉTECTION DES SUPER-ADMINS BASÉE SUR VOTRE BD
  const SUPER_ADMIN_IDS = [3, 11, 12]; // IDs des super-admins dans votre BD
  const SUPER_ADMIN_USERNAMES = ['admin', 'admin_user', 'admin_simplon'];

  // 🎯 Charger les utilisateurs depuis VOTRE API Django
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🔄 Chargement depuis: ${USERS_API}`);
      
      const response = await axios.get(USERS_API, {
        timeout: 10000,
        headers: { 'Accept': 'application/json' }
      });
      
      console.log('📦 Réponse API brute:', response.data);
      setApiResponse(response.data);
      
      if (!response.data) {
        throw new Error('Aucune donnée reçue');
      }
      
      // ✅ ANALYSE DE LA STRUCTURE DE LA RÉPONSE
      let usersArray = [];
      
      if (Array.isArray(response.data)) {
        // Si la réponse est directement un array
        usersArray = response.data;
        console.log('✅ Structure: Array direct');
      } else if (response.data.users && Array.isArray(response.data.users)) {
        // Si la réponse est { users: [...] }
        usersArray = response.data.users;
        console.log('✅ Structure: data.users');
      } else if (response.data.results && Array.isArray(response.data.results)) {
        // Si la réponse est { results: [...] }
        usersArray = response.data.results;
        console.log('✅ Structure: data.results');
      } else {
        // Chercher un array dans l'objet
        const arrayKeys = Object.keys(response.data).filter(key => 
          Array.isArray(response.data[key])
        );
        if (arrayKeys.length > 0) {
          usersArray = response.data[arrayKeys[0]];
          console.log(`✅ Structure: data.${arrayKeys[0]}`);
        } else {
          throw new Error('Format de réponse non reconnu');
        }
      }
      
      if (usersArray.length === 0) {
        throw new Error('Aucun utilisateur trouvé');
      }
      
      // 🔍 DEBUG: Vérifier le premier utilisateur
      const firstUser = usersArray[0];
      console.log('🔍 Premier utilisateur:', firstUser);
      console.log('🔍 Champs disponibles:', Object.keys(firstUser));
      console.log('🔍 is_superuser présent?', 'is_superuser' in firstUser);
      console.log('🔍 is_staff présent?', 'is_staff' in firstUser);
      
      // 🎯 TRAITEMENT DES DONNÉES
      const processedUsers = usersArray.map(user => {
        // Extraction des dates
        let dateJoined = null;
        let lastLogin = null;
        
        try {
          if (user.date_joined) {
            dateJoined = new Date(user.date_joined);
          }
          if (user.last_login) {
            lastLogin = new Date(user.last_login);
          }
        } catch (e) {
          console.warn('⚠️ Erreur de parsing de date:', e);
        }
        
        // 🎯 CRITIQUE: Détection des rôles
        // 1. Si l'API retourne les champs, les utiliser
        // 2. Sinon, détecter basé sur votre BD réelle
        const id = user.id || 0;
        const username = user.username || '';
        
        // Vérifier d'abord si l'API retourne les champs
        let isSuperuser = user.is_superuser;
        let isStaff = user.is_staff;
        let isActive = user.is_active;
        
        // Si les champs ne sont pas dans la réponse, les détecter
        if (isSuperuser === undefined) {
          // Détection basée sur votre BD
          isSuperuser = SUPER_ADMIN_IDS.includes(id) || SUPER_ADMIN_USERNAMES.includes(username);
          console.log(`🔍 ${username} (ID: ${id}) -> isSuperuser: ${isSuperuser} (détecté)`);
        }
        
        if (isStaff === undefined) {
          // Dans votre BD, tous les super-admins sont aussi staff
          isStaff = isSuperuser || false;
        }
        
        if (isActive === undefined) {
          isActive = true; // Par défaut
        }
        
        return {
          // Champs de base
          id: id,
          username: username,
          email: user.email || '',
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          
          // 🎯 RÔLES CORRECTS
          is_superuser: isSuperuser,
          is_staff: isStaff,
          is_active: isActive,
          
          // Dates
          date_joined: dateJoined,
          last_login: lastLogin,
          
          // Affichage
          display_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || username,
          date_joined_display: dateJoined 
            ? dateJoined.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })
            : 'Date inconnue',
          last_login_display: lastLogin 
            ? lastLogin.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })
            : 'Jamais'
        };
      });
      
      // Vérification finale
      const superusers = processedUsers.filter(u => u.is_superuser);
      console.log(`✅ ${processedUsers.length} utilisateurs traités`);
      console.log(`👑 Super-admins détectés: ${superusers.length}`);
      console.log('📋 Liste:', superusers.map(u => `${u.username} (ID: ${u.id})`));
      
      setUsers(processedUsers);
      
    } catch (err) {
      console.error('❌ Erreur:', err);
      
      let errorMessage = `Erreur: ${err.message}`;
      
      if (err.code === 'ECONNREFUSED') {
        errorMessage = 'Serveur Django non accessible. Lancez: python manage.py runserver';
      } else if (err.response) {
        errorMessage = `API (${err.response.status}): ${err.response.data?.message || err.response.statusText}`;
      } else if (err.request) {
        errorMessage = 'Pas de réponse du serveur';
      }
      
      setError(errorMessage);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Chargement initial
  useEffect(() => {
    loadUsers();
  }, []);

  // 🎯 Formatage date
  const getRelativeTime = (date) => {
    if (!date) return 'Jamais';
    
    try {
      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Aujourd\'hui';
      if (diffDays === 1) return 'Hier';
      if (diffDays < 7) return `Il y a ${diffDays} jours`;
      if (diffDays < 30) return `Il y a ${Math.floor(diffDays/7)} semaines`;
      
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return 'Date inconnue';
    }
  };

  // 🎯 Filtrer
  const filteredUsers = users.filter(user => {
    const searchMatch = !search || 
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.display_name.toLowerCase().includes(search.toLowerCase());
    
    let roleMatch = true;
    if (roleFilter !== 'all') {
      switch (roleFilter) {
        case 'superadmin': roleMatch = user.is_superuser; break;
        case 'admin': roleMatch = user.is_staff && !user.is_superuser; break;
        case 'user': roleMatch = !user.is_staff && !user.is_superuser; break;
      }
    }
    
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
    withLogin: users.filter(u => u.last_login).length,
    adminRegular: users.filter(u => u.is_staff && !u.is_superuser).length
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600 mb-4" />
        <p className="text-gray-600 mb-2">Chargement des utilisateurs...</p>
        <p className="text-sm text-gray-500">Connexion à Django...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Database className="text-blue-600" size={24} />
                Gestion des Utilisateurs
              </h1>
              <div className="mt-2">
                <p className="text-gray-600">
                  <span className="font-semibold">{stats.total}</span> utilisateurs • 
                  <span className="ml-2">Base de données Django</span>
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-sm flex items-center gap-1 ${error ? 'text-red-600' : 'text-green-600'}`}>
                    {error ? (
                      <>
                        <AlertCircle size={14} />
                        Erreur
                      </>
                    ) : (
                      <>
                        <CheckCircle size={14} />
                        Connecté
                      </>
                    )}
                  </span>
                  <a 
                    href={USERS_API} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <ExternalLink size={12} />
                    Voir l'API
                  </a>
                  <button
                    onClick={() => {
                      console.log('API Response:', apiResponse);
                      console.log('Processed Users:', users);
                      alert('Données affichées dans la console (F12)');
                    }}
                    className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1"
                  >
                    <Info size={12} />
                    Debug
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href={ADMIN_API}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Lock size={16} />
                Admin Django
              </a>
              <button
                onClick={loadUsers}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw size={20} />
                Actualiser
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-500 mt-0.5" size={20} />
                <div>
                  <p className="text-red-700 font-medium mb-1">Erreur de chargement</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========== STATISTIQUES CORRECTES ========== */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
          
          {/* 🎯 SUPER ADMINS - DEVRAIT ÊTRE 3 */}
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
          
          {/* 🎯 ADMINS - DEVRAIT ÊTRE 0 */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-purple-600">{stats.adminRegular}</p>
                <p className="text-xs text-gray-500">staff</p>
              </div>
              <Shield className="text-purple-600" size={20} />
            </div>
          </div>
          
          {/* 🎯 APPRENANTS - DEVRAIT ÊTRE 10 */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Apprenants</p>
                <p className="text-2xl font-bold text-blue-600">{stats.regular}</p>
                <p className="text-xs text-gray-500">simploniens</p>
              </div>
              <GraduationCap className="text-blue-600" size={20} />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">API</p>
                <p className="text-sm font-bold text-gray-900">Django</p>
                <p className={`text-xs ${error ? 'text-red-600' : 'text-green-600'}`}>
                  {error ? '● Erreur' : '● Connecté'}
                </p>
              </div>
              <Database className="text-gray-600" size={20} />
            </div>
          </div>
        </div>

        {/* Vérification des super-admins */}
        {stats.super > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-medium text-red-800 mb-3 flex items-center gap-2">
              <Crown size={18} />
              Super Admins détectés ({stats.super})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {users.filter(u => u.is_superuser).map(superuser => (
                <div key={superuser.id} className="p-3 bg-white border border-red-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                      {(superuser.first_name?.[0] || superuser.username?.[0]).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{superuser.display_name}</div>
                      <div className="text-sm text-gray-500">@{superuser.username}</div>
                      <div className="text-xs text-gray-400">ID: {superuser.id}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">Tous les rôles</option>
                <option value="superadmin">Super Admins</option>
                <option value="admin">Admins</option>
                <option value="user">Utilisateurs</option>
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Effacer
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-3 text-sm text-gray-600">
            {filteredUsers.length} utilisateur(s) trouvé(s) sur {stats.total}
            {roleFilter === 'superadmin' && (
              <span className="ml-2 text-red-600 font-medium">
                ({stats.super} super-admin{stats.super > 1 ? 's' : ''})
              </span>
            )}
            {roleFilter === 'user' && (
              <span className="ml-2 text-blue-600 font-medium">
                ({stats.regular} apprenant{stats.regular > 1 ? 's' : ''})
              </span>
            )}
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Informations
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle & Statut
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activité
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${
                          user.is_superuser ? 'bg-red-600' :
                          user.is_staff ? 'bg-purple-600' :
                          'bg-green-600'
                        }`}>
                          {(user.first_name?.[0] || user.username?.[0] || 'U').toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            {user.display_name}
                            {user.is_superuser && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                                👑
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{user.username}
                          </div>
                          <div className="text-xs text-gray-400">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900 flex items-start gap-1">
                          <Mail size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="break-all">{user.email}</span>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar size={12} />
                          Inscrit le {user.date_joined_display}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {user.is_superuser ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                              <Crown size={10} />
                              Super Admin
                            </span>
                          ) : user.is_staff ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                              <Shield size={10} />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              <User size={10} />
                              Apprenant
                            </span>
                          )}
                        </div>
                        
                        <div>
                          {user.is_active ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              <Check size={12} />
                              Actif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                              <X size={12} />
                              Inactif
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
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
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const role = user.is_superuser ? 'Super Admin' : 
                                       user.is_staff ? 'Admin' : 'Apprenant';
                            alert(
                              `📋 Détails utilisateur\n\n` +
                              `👤 Nom: ${user.display_name}\n` +
                              `📧 Email: ${user.email}\n` +
                              `🆔 ID: ${user.id}\n` +
                              `👑 Rôle: ${role}\n` +
                              `✅ Statut: ${user.is_active ? 'Actif' : 'Inactif'}\n` +
                              `📅 Inscription: ${user.date_joined_display}\n` +
                              `🔗 Dernière connexion: ${getRelativeTime(user.last_login)}`
                            );
                          }}
                          className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                          title="Voir les détails"
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
          
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Search className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">Aucun utilisateur ne correspond aux critères</p>
              <button
                onClick={() => {
                  setSearch('');
                  setRoleFilter('all');
                  setStatusFilter('all');
                }}
                className="mt-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="px-4 py-3 bg-gray-50 border-t text-xs text-gray-500">
              {filteredUsers.length} utilisateur(s) affiché(s)
            </div>
          )}
        </div>

        {/* Résumé final */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-3xl font-bold text-red-600">{stats.super}</div>
              <div className="text-sm font-medium text-gray-900">Super Admins</div>
              <div className="text-xs text-gray-500 mt-2">
                admin, admin_user, admin_simplon
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-3xl font-bold text-blue-600">{stats.regular}</div>
              <div className="text-sm font-medium text-gray-900">Apprenants</div>
              <div className="text-xs text-gray-500 mt-2">
                10 simploniens actifs
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-3xl font-bold text-green-600">{stats.total}</div>
              <div className="text-sm font-medium text-gray-900">Total</div>
              <div className="text-xs text-gray-500 mt-2">
                13 utilisateurs (BD Django)
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white rounded border text-xs text-gray-500">
            <p className="font-medium text-gray-700 mb-1">ℹ️ Détection automatique des rôles</p>
            <p>Les super-admins sont détectés par ID (3, 11, 12) et username (admin, admin_user, admin_simplon)</p>
            <p className="mt-1">Pour corriger définitivement, modifiez votre API Django pour retourner les champs <code>is_superuser</code> et <code>is_staff</code>.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;