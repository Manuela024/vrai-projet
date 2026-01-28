

// import React, { useState, useEffect } from 'react';

// const ProjectManagement = () => {
//   const [projectsWithUsers, setProjectsWithUsers] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [cohortFilter, setCohortFilter] = useState('');
//   const [technologyFilter, setTechnologyFilter] = useState('');
//   const [isDemoMode, setIsDemoMode] = useState(false);
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [apiStatus, setApiStatus] = useState('🚀 Initialisation...');
//   const [stats, setStats] = useState({
//     total: 0,
//     approved: 0,
//     pending: 0,
//     rejected: 0,
//     draft: 0,
//     totalUsers: 0
//   });
  
//   // États pour les modales
//   const [approvalModal, setApprovalModal] = useState({
//     open: false,
//     projectId: null,
//     projectTitle: '',
//     criteria: ''
//   });
  
//   const [rejectionModal, setRejectionModal] = useState({
//     open: false,
//     projectId: null,
//     projectTitle: '',
//     criteria: ''
//   });

//   const API_BASE = 'http://127.0.0.1:8000/api';

//   useEffect(() => {
//     fetchRealDataFromDatabase();
//   }, [refreshKey]);

//   const fetchRealDataFromDatabase = async () => {
//     try {
//       setLoading(true);
//       setApiStatus('🔄 Chargement des données...');
      
//       // CORRECTION : Utiliser le bon endpoint
//       const response = await fetch(`${API_BASE}/projects/projects/`);
      
//       if (!response.ok) {
//         throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
//       }
      
//       const projects = await response.json();
      
//       console.log('📊 Données reçues:', projects.length, 'projets');
      
//       if (!Array.isArray(projects)) {
//         throw new Error('Les données reçues ne sont pas un tableau');
//       }
      
//       if (projects.length === 0) {
//         setApiStatus('📭 Aucun projet trouvé');
//         setIsDemoMode(true);
//         setLoading(false);
//         return;
//       }
      
//       // Transformer les données pour l'affichage par utilisateur
//       const usersMap = new Map();
      
//       projects.forEach(project => {
//         // CORRECTION : Utiliser author_info pour les informations complètes
//         const authorInfo = project.author_info || {};
//         const authorId = authorInfo.id || project.author;
        
//         if (!authorId) {
//           console.warn('⚠️ Projet sans auteur:', project.id);
//           return;
//         }
        
//         if (!usersMap.has(authorId)) {
//           usersMap.set(authorId, {
//             id: authorId,
//             full_name: authorInfo.full_name || project.author_name || `Auteur ${authorId}`,
//             first_name: authorInfo.full_name?.split(' ')[0] || 'Auteur',
//             last_name: authorInfo.full_name?.split(' ').slice(1).join(' ') || `#${authorId}`,
//             email: authorInfo.email || project.author_email || `auteur${authorId}@simplon.com`,
//             username: authorInfo.username || project.author_username || `user_${authorId}`,
//             is_staff: authorInfo.is_staff || false,
//             projects: [],
//             projects_count: 0
//           });
//         }
        
//         const user = usersMap.get(authorId);
        
//         // CORRECTION : Structure des données adaptée à votre API
//         user.projects.push({
//           id: project.id,
//           title: project.title || 'Projet sans titre',
//           description: project.description || 'Aucune description',
//           technologies: project.technologies || '',
//           status: project.status || 'draft',
//           cohort: project.cohort || '',
//           tags: project.tags || '',
//           github_url: project.github_url || '',
//           demo_url: project.demo_url || '',
//           image_url: project.image || '',
//           created_at: project.created_at,
//           updated_at: project.updated_at,
//           author_name: authorInfo.full_name || project.author_name,
//           author_email: authorInfo.email || project.author_email,
//           author_username: authorInfo.username || project.author_username,
//           author_id: authorId,
//           // Champs supplémentaires
//           is_approved: project.is_approved,
//           is_pending: project.is_pending,
//           days_since_creation: project.days_since_creation
//         });
        
//         user.projects_count = user.projects.length;
//       });
      
//       const usersWithProjects = Array.from(usersMap.values());
      
//       // Trier par nombre de projets
//       usersWithProjects.sort((a, b) => b.projects_count - a.projects_count);
      
//       // Trier les projets par date (plus récent d'abord)
//       usersWithProjects.forEach(user => {
//         user.projects.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
//       });
      
//       setProjectsWithUsers(usersWithProjects);
//       setFilteredData(usersWithProjects);
//       setIsDemoMode(false);
      
//       // Calculer les statistiques avec prise en compte de is_approved/is_pending
//       const allProjects = usersWithProjects.flatMap(user => user.projects || []);
//       const stats = {
//         total: allProjects.length,
//         approved: allProjects.filter(p => normalizeStatus(p.status) === 'approved' || p.is_approved).length,
//         pending: allProjects.filter(p => normalizeStatus(p.status) === 'pending' || p.is_pending).length,
//         rejected: allProjects.filter(p => normalizeStatus(p.status) === 'rejected').length,
//         draft: allProjects.filter(p => normalizeStatus(p.status) === 'draft').length,
//         totalUsers: usersWithProjects.length
//       };
      
//       setStats(stats);
//       setApiStatus(`✅ ${stats.total} projets • ${stats.totalUsers} auteurs • ${stats.approved} approuvés`);
      
//     } catch (error) {
//       console.error('❌ Erreur récupération données:', error);
//       setApiStatus(`❌ ${error.message}`);
      
//       if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
//         setApiStatus('🎭 Mode démo activé');
//         setIsDemoMode(true);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const testDatabaseConnection = async () => {
//     try {
//       setLoading(true);
//       setApiStatus('🔍 Test de connexion...');
      
//       // CORRECTION : Tester le bon endpoint
//       const response = await fetch(`${API_BASE}/projects/projects/`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }
      
//       const data = await response.json();
      
//       alert(`✅ Connexion réussie!\n\nNombre de projets: ${data.length}\nPremier projet: ${data[0]?.title || 'Aucun'}\n\n📊 Statut: ${apiStatus}`);
//       setApiStatus('✅ Test réussi');
      
//       fetchRealDataFromDatabase();
      
//     } catch (error) {
//       console.error('Test échoué:', error);
//       alert(`❌ Test échoué:\n${error.message}\n\nVérifiez que le serveur Django est en cours d'exécution.`);
//       setApiStatus('❌ Test échoué');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateAndSetStats = (data) => {
//     const allProjects = data.flatMap(user => user.projects || []);
    
//     const stats = {
//       total: allProjects.length,
//       approved: allProjects.filter(p => normalizeStatus(p.status) === 'approved' || p.is_approved).length,
//       pending: allProjects.filter(p => normalizeStatus(p.status) === 'pending' || p.is_pending).length,
//       rejected: allProjects.filter(p => normalizeStatus(p.status) === 'rejected').length,
//       draft: allProjects.filter(p => normalizeStatus(p.status) === 'draft').length,
//       totalUsers: data.length
//     };
    
//     setStats(stats);
//   };

//   useEffect(() => {
//     let filtered = [...projectsWithUsers];

//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase().trim();
//       filtered = filtered.map(user => ({
//         ...user,
//         projects: user.projects?.filter(project => 
//           (project.title?.toLowerCase() || '').includes(term) ||
//           (project.description?.toLowerCase() || '').includes(term) ||
//           (project.technologies?.toLowerCase() || '').includes(term) ||
//           (project.author_name?.toLowerCase() || '').includes(term) ||
//           (project.author_email?.toLowerCase() || '').includes(term) ||
//           (user.full_name?.toLowerCase() || '').includes(term) ||
//           (user.email?.toLowerCase() || '').includes(term)
//         ) || []
//       })).filter(user => user.projects && user.projects.length > 0);
//     }

//     if (statusFilter) {
//       filtered = filtered.map(user => ({
//         ...user,
//         projects: user.projects?.filter(project => 
//           normalizeStatus(project.status) === normalizeStatus(statusFilter)
//         ) || []
//       })).filter(user => user.projects && user.projects.length > 0);
//     }

//     if (cohortFilter) {
//       filtered = filtered.map(user => ({
//         ...user,
//         projects: user.projects?.filter(project => 
//           (project.cohort?.toLowerCase() || '').includes(cohortFilter.toLowerCase())
//         ) || []
//       })).filter(user => user.projects && user.projects.length > 0);
//     }

//     if (technologyFilter) {
//       filtered = filtered.map(user => ({
//         ...user,
//         projects: user.projects?.filter(project => 
//           (project.technologies?.toLowerCase() || '').includes(technologyFilter.toLowerCase())
//         ) || []
//       })).filter(user => user.projects && user.projects.length > 0);
//     }

//     setFilteredData(filtered);
//   }, [searchTerm, statusFilter, cohortFilter, technologyFilter, projectsWithUsers]);

//   const normalizeStatus = (status) => {
//     if (!status) return '';
//     const s = status.toLowerCase();
//     if (s.includes('approv') || s.includes('valid') || s.includes('publish')) return 'approved';
//     if (s.includes('pend') || s.includes('wait')) return 'pending';
//     if (s.includes('reject') || s.includes('refus')) return 'rejected';
//     if (s.includes('draft') || s.includes('brouillon')) return 'draft';
//     return s;
//   };

//   const getStatusColor = (status) => {
//     const norm = normalizeStatus(status);
//     switch (norm) {
//       case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800';
//       case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800';
//       case 'draft': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
//       case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800';
//       default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border border-gray-200 dark:border-gray-700';
//     }
//   };

//   const getStatusIcon = (status) => {
//     const norm = normalizeStatus(status);
//     switch (norm) {
//       case 'approved': return 'check_circle';
//       case 'pending': return 'pending';
//       case 'draft': return 'draft';
//       case 'rejected': return 'cancel';
//       default: return 'help';
//     }
//   };

//   const getStatusText = (status) => {
//     const norm = normalizeStatus(status);
//     switch (norm) {
//       case 'approved': return '✅ Approuvé';
//       case 'pending': return '⏳ En attente';
//       case 'draft': return '📝 Brouillon';
//       case 'rejected': return '❌ Rejeté';
//       default: return status || '❓ Inconnu';
//     }
//   };

//   const handleApproveProject = async (projectId, criteria = 'Projet conforme aux exigences pédagogiques') => {
//     try {
//       setLoading(true);
      
//       if (isDemoMode) {
//         setProjectsWithUsers(prev => 
//           prev.map(user => ({
//             ...user,
//             projects: user.projects?.map(project => 
//               project.id === projectId ? { ...project, status: 'approved', is_approved: true, is_pending: false } : project
//             ) || []
//           }))
//         );
//         setApiStatus('✅ Projet approuvé (mode démo)');
//       } else {
//         const token = localStorage.getItem('access_token');
//         const headers = { 'Content-Type': 'application/json' };
        
//         if (token) headers['Authorization'] = `Bearer ${token}`;
        
//         try {
//           const response = await fetch(`${API_BASE}/projects/${projectId}/`, {
//             method: 'PATCH',
//             headers,
//             body: JSON.stringify({ 
//               status: 'approved',
//               approval_criteria: criteria
//             })
//           });
          
//           if (response.ok) {
//             await fetchRealDataFromDatabase();
//             setApiStatus('✅ Projet approuvé avec succès');
//           } else {
//             throw new Error(`Erreur ${response.status}`);
//           }
//         } catch (apiError) {
//           setProjectsWithUsers(prev => 
//             prev.map(user => ({
//               ...user,
//               projects: user.projects?.map(project => 
//                 project.id === projectId ? { ...project, status: 'approved', is_approved: true, is_pending: false } : project
//               ) || []
//             }))
//           );
//           setApiStatus('✅ Projet approuvé (simulation)');
//         }
//       }
//     } catch (error) {
//       console.error('❌ Erreur approbation:', error);
//       setApiStatus(`❌ ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRejectProject = async (projectId, criteria = 'Projet nécessite des améliorations significatives') => {
//     try {
//       setLoading(true);
      
//       if (isDemoMode) {
//         setProjectsWithUsers(prev => 
//           prev.map(user => ({
//             ...user,
//             projects: user.projects?.map(project => 
//               project.id === projectId ? { ...project, status: 'rejected', is_approved: false, is_pending: false } : project
//             ) || []
//           }))
//         );
//         setApiStatus('❌ Projet rejeté (mode démo)');
//       } else {
//         const token = localStorage.getItem('access_token');
//         const headers = { 'Content-Type': 'application/json' };
        
//         if (token) headers['Authorization'] = `Bearer ${token}`;
        
//         try {
//           const response = await fetch(`${API_BASE}/projects/${projectId}/`, {
//             method: 'PATCH',
//             headers,
//             body: JSON.stringify({ 
//               status: 'rejected',
//               rejection_reasons: criteria
//             })
//           });
          
//           if (response.ok) {
//             await fetchRealDataFromDatabase();
//             setApiStatus('❌ Projet rejeté');
//           } else {
//             throw new Error(`Erreur ${response.status}`);
//           }
//         } catch (apiError) {
//           setProjectsWithUsers(prev => 
//             prev.map(user => ({
//               ...user,
//               projects: user.projects?.map(project => 
//                 project.id === projectId ? { ...project, status: 'rejected', is_approved: false, is_pending: false } : project
//               ) || []
//             }))
//           );
//           setApiStatus('❌ Projet rejeté (simulation)');
//         }
//       }
//     } catch (error) {
//       console.error('❌ Erreur rejet:', error);
//       setApiStatus(`❌ ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteProject = async (projectId) => {
//     if (!window.confirm('⚠️ Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.')) return;
    
//     try {
//       setLoading(true);
      
//       if (isDemoMode) {
//         setProjectsWithUsers(prev => 
//           prev.map(user => ({
//             ...user,
//             projects: user.projects?.filter(project => project.id !== projectId) || []
//           })).filter(user => user.projects && user.projects.length > 0)
//         );
//         setApiStatus('🗑️ Projet supprimé (mode démo)');
//       } else {
//         const token = localStorage.getItem('access_token');
//         const headers = {};
        
//         if (token) headers['Authorization'] = `Bearer ${token}`;
        
//         try {
//           const response = await fetch(`${API_BASE}/projects/${projectId}/`, {
//             method: 'DELETE',
//             headers
//           });
          
//           if (response.ok) {
//             await fetchRealDataFromDatabase();
//             setApiStatus('🗑️ Projet supprimé');
//           } else {
//             throw new Error(`Erreur ${response.status}`);
//           }
//         } catch (apiError) {
//           setProjectsWithUsers(prev => 
//             prev.map(user => ({
//               ...user,
//               projects: user.projects?.filter(project => project.id !== projectId) || []
//             })).filter(user => user.projects && user.projects.length > 0)
//           );
//           setApiStatus('🗑️ Projet supprimé (simulation)');
//         }
//       }
//     } catch (error) {
//       console.error('❌ Erreur suppression:', error);
//       setApiStatus(`❌ ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openApprovalModal = (projectId, projectTitle) => {
//     setApprovalModal({
//       open: true,
//       projectId,
//       projectTitle,
//       criteria: '✅ Projet bien structuré\n✅ Code propre et documenté\n✅ Fonctionnalités complètes\n✅ Bonnes pratiques respectées'
//     });
//   };

//   const openRejectionModal = (projectId, projectTitle) => {
//     setRejectionModal({
//       open: true,
//       projectId,
//       projectTitle,
//       criteria: '❌ Documentation insuffisante\n❌ Code non optimisé\n❌ Tests manquants\n❌ UI/UX à améliorer'
//     });
//   };

//   const closeApprovalModal = () => {
//     setApprovalModal({ open: false, projectId: null, projectTitle: '', criteria: '' });
//   };

//   const closeRejectionModal = () => {
//     setRejectionModal({ open: false, projectId: null, projectTitle: '', criteria: '' });
//   };

//   const handleApproveWithCriteria = async () => {
//     const { projectId, criteria } = approvalModal;
//     if (!criteria.trim()) {
//       alert('⚠️ Veuillez saisir les critères d\'approbation');
//       return;
//     }
//     await handleApproveProject(projectId, criteria);
//     closeApprovalModal();
//   };

//   const handleRejectWithCriteria = async () => {
//     const { projectId, criteria } = rejectionModal;
//     if (!criteria.trim()) {
//       alert('⚠️ Veuillez saisir les motifs de rejet');
//       return;
//     }
//     await handleRejectProject(projectId, criteria);
//     closeRejectionModal();
//   };

//   const handleViewDetails = (project) => {
//     const daysSince = project.days_since_creation ? ` (Il y a ${project.days_since_creation} jours)` : '';
    
//     const details = `
// 📋 DÉTAILS DU PROJET

// 📌 INFORMATIONS PROJET:
// Titre: ${project.title}
// Statut: ${getStatusText(project.status)}
// Approuvé: ${project.is_approved ? '✅ Oui' : '❌ Non'}
// En attente: ${project.is_pending ? '⏳ Oui' : '✅ Non'}
// Technologies: ${project.technologies || 'Non spécifié'}
// Cohorte: ${project.cohort || 'Non spécifiée'}
// Tags: ${project.tags || 'Aucun tag'}

// 👤 INFORMATIONS AUTEUR:
// Nom: ${project.author_name || 'Non défini'}
// Email: ${project.author_email || 'Non défini'}
// Username: ${project.author_username || 'Non défini'}
// ID Auteur: ${project.author_id}

// 📝 DESCRIPTION:
// ${project.description || 'Aucune description'}

// 📅 INFORMATIONS TEMPORELLES:
// Date création: ${project.created_at ? new Date(project.created_at).toLocaleDateString('fr-FR', { 
//   year: 'numeric', 
//   month: 'long', 
//   day: 'numeric',
//   hour: '2-digit',
//   minute: '2-digit'
// }) : 'Non disponible'}${daysSince}
// Dernière modification: ${project.updated_at ? new Date(project.updated_at).toLocaleDateString('fr-FR', { 
//   year: 'numeric', 
//   month: 'long', 
//   day: 'numeric' 
// }) : 'Non disponible'}

// 🔗 LIENS:
// ${project.github_url ? `• GitHub: ${project.github_url}` : '• GitHub: Non disponible'}
// ${project.demo_url ? `• Démo: ${project.demo_url}` : '• Démo: Non disponible'}
// ${project.image_url ? `• Image: http://127.0.0.1:8000${project.image_url}` : ''}
//     `;
//     alert(details);
//   };

//   const getUniqueCohorts = () => {
//     const cohorts = new Set();
//     projectsWithUsers.forEach(user => {
//       user.projects?.forEach(project => {
//         if (project.cohort) cohorts.add(project.cohort);
//       });
//     });
//     return Array.from(cohorts).sort();
//   };

//   const getUniqueTechnologies = () => {
//     const techs = new Set();
//     projectsWithUsers.forEach(user => {
//       user.projects?.forEach(project => {
//         if (project.technologies) {
//           project.technologies.split(',').map(t => t.trim()).filter(t => t).forEach(tech => techs.add(tech));
//         }
//       });
//     });
//     return Array.from(techs).sort();
//   };

//   const exportToCSV = () => {
//     if (projectsWithUsers.length === 0) {
//       alert('📭 Aucune donnée à exporter');
//       return;
//     }
    
//     const csvContent = [
//       ['Auteur', 'Email', 'Username', 'Projet', 'Statut', 'Technologies', 'Cohorte', 'Date création', 'URL GitHub', 'URL Démo'],
//       ...projectsWithUsers.flatMap(user => 
//         (user.projects || []).map(project => [
//           project.author_name || user.full_name,
//           project.author_email || user.email,
//           project.author_username || user.username,
//           project.title || '',
//           getStatusText(project.status),
//           project.technologies || '',
//           project.cohort || '',
//           project.created_at ? new Date(project.created_at).toLocaleDateString('fr-FR') : '',
//           project.github_url || '',
//           project.demo_url || ''
//         ])
//       )
//     ].map(row => row.join(';')).join('\n');
    
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
    
//     link.setAttribute('href', url);
//     link.setAttribute('download', `projets_simplon_${new Date().toISOString().split('T')[0]}.csv`);
//     link.style.visibility = 'hidden';
    
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
    
//     alert(`✅ Fichier CSV exporté avec succès\n\n${projectsWithUsers.length} auteurs\n${stats.total} projets`);
//   };

//   const activateDemoMode = () => {
//     const demoUsers = [
//       {
//         id: 1,
//         full_name: 'Jean Dupont',
//         email: 'jean.dupont@simplon.com',
//         username: 'jeandupont',
//         projects_count: 3,
//         projects: [
//           {
//             id: 101,
//             title: 'Plateforme E-commerce React/Node.js',
//             description: 'Site e-commerce complet avec panier, paiement et dashboard admin',
//             technologies: 'React, Node.js, MongoDB, Stripe',
//             status: 'approved',
//             cohort: 'Promo 2024-1',
//             tags: 'ecommerce, fullstack, paiement',
//             github_url: 'https://github.com/jeandupont/ecommerce',
//             demo_url: 'https://ecommerce-demo.simplon.com',
//             created_at: '2024-01-15T10:30:00Z',
//             author_name: 'Jean Dupont',
//             is_approved: true,
//             is_pending: false
//           },
//           {
//             id: 102,
//             title: 'Application Météo Progressive Web App',
//             description: 'PWA avec notifications push et fonctionnement hors-ligne',
//             technologies: 'PWA, JavaScript, Service Workers',
//             status: 'pending',
//             cohort: 'Promo 2024-1',
//             tags: 'pwa, météo, offline',
//             github_url: 'https://github.com/jeandupont/weather-pwa',
//             demo_url: '',
//             created_at: '2024-02-20T14:45:00Z',
//             author_name: 'Jean Dupont',
//             is_approved: false,
//             is_pending: true
//           }
//         ]
//       },
//       {
//         id: 2,
//         full_name: 'Marie Lambert',
//         email: 'marie.lambert@simplon.com',
//         username: 'marielambert',
//         projects_count: 2,
//         projects: [
//           {
//             id: 201,
//             title: 'Système de Réservation de Salles',
//             description: 'Application de gestion des réservations pour espaces de coworking',
//             technologies: 'Django, PostgreSQL, Vue.js',
//             status: 'approved',
//             cohort: 'Promo 2023-2',
//             tags: 'réservation, gestion, admin',
//             github_url: 'https://github.com/marielambert/room-booking',
//             demo_url: 'https://booking.simplon.com',
//             created_at: '2023-11-10T09:15:00Z',
//             author_name: 'Marie Lambert',
//             is_approved: true,
//             is_pending: false
//           }
//         ]
//       }
//     ];
    
//     setProjectsWithUsers(demoUsers);
//     setFilteredData(demoUsers);
//     setIsDemoMode(true);
    
//     const allDemoProjects = demoUsers.flatMap(user => user.projects);
//     setStats({
//       total: allDemoProjects.length,
//       approved: allDemoProjects.filter(p => normalizeStatus(p.status) === 'approved' || p.is_approved).length,
//       pending: allDemoProjects.filter(p => normalizeStatus(p.status) === 'pending' || p.is_pending).length,
//       rejected: 0,
//       draft: 0,
//       totalUsers: demoUsers.length
//     });
//   };

//   const renderStatusBanner = () => {
//     if (isDemoMode) {
//       return (
//         <div className="mb-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <span className="material-symbols-outlined text-blue-500">info</span>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
//                   🎭 Mode démonstration
//                 </p>
//                 <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
//                   Données de test - Serveur Django non disponible
//                 </p>
//               </div>
//             </div>
//             <button onClick={testDatabaseConnection} className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
//               <span className="material-symbols-outlined text-base">database</span>
//               Tester la connexion
//             </button>
//           </div>
//         </div>
//       );
//     }
    
//     return (
//       <div className="mb-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <div className="flex-shrink-0">
//               <span className="material-symbols-outlined text-green-500">check_circle</span>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm text-green-700 dark:text-green-300 font-medium">
//                 ✅ Données réelles PostgreSQL
//               </p>
//               <p className="text-xs text-green-600 dark:text-green-400 mt-1">
//                 {stats.totalUsers} auteurs • {stats.total} projets • {stats.approved} approuvés
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-full font-medium">
//               Base de données
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading && projectsWithUsers.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
//         <div className="relative">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#E30613] border-t-transparent"></div>
//           <div className="absolute inset-0 flex items-center justify-center">
//             <span className="material-symbols-outlined text-[#E30613] animate-pulse">database</span>
//           </div>
//         </div>
//         <div className="text-center">
//           <p className="text-gray-600 dark:text-gray-400 font-medium">{apiStatus}</p>
//           <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Chargement des projets...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {renderStatusBanner()}
      
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-[#001F3F] dark:text-white">
//             🚀 Gestion des Projets Simplon
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-2">
//             Plateforme de suivi et validation des projets des apprenants
//           </p>
//         </div>
//         <div className="flex flex-wrap gap-3">
//           <button onClick={testDatabaseConnection} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-[#0d1a29] text-gray-700 dark:text-gray-300 flex items-center gap-2 transition-all hover:scale-105">
//             <span className="material-symbols-outlined">database</span>
//             Tester la connexion
//           </button>
//           <button onClick={() => setRefreshKey(prev => prev + 1)} className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#c40511] font-medium flex items-center gap-2 transition-all hover:scale-105">
//             <span className="material-symbols-outlined">refresh</span>
//             Actualiser
//           </button>
//           <button onClick={exportToCSV} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 font-medium flex items-center gap-2 transition-all hover:scale-105">
//             <span className="material-symbols-outlined">download</span>
//             Exporter CSV
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//         <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-2xl font-bold text-[#001F3F] dark:text-white">{stats.total}</div>
//               <div className="text-sm text-gray-500 dark:text-gray-400">Total Projets</div>
//             </div>
//             <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-2xl">folder</span>
//           </div>
//         </div>
        
//         <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.approved}</div>
//               <div className="text-sm text-gray-500 dark:text-gray-400">Approuvés</div>
//             </div>
//             <span className="material-symbols-outlined text-green-500 text-2xl">check_circle</span>
//           </div>
//         </div>
        
//         <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
//               <div className="text-sm text-gray-500 dark:text-gray-400">En attente</div>
//             </div>
//             <span className="material-symbols-outlined text-yellow-500 text-2xl">pending</span>
//           </div>
//         </div>
        
//         <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</div>
//               <div className="text-sm text-gray-500 dark:text-gray-400">Rejetés</div>
//             </div>
//             <span className="material-symbols-outlined text-red-500 text-2xl">cancel</span>
//           </div>
//         </div>
        
//         <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.draft}</div>
//               <div className="text-sm text-gray-500 dark:text-gray-400">Brouillons</div>
//             </div>
//             <span className="material-symbols-outlined text-blue-500 text-2xl">draft</span>
//           </div>
//         </div>
        
//         <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalUsers}</div>
//               <div className="text-sm text-gray-500 dark:text-gray-400">Auteurs</div>
//             </div>
//             <span className="material-symbols-outlined text-purple-500 text-2xl">people</span>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
//           <div className="lg:col-span-2 relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <span className="material-symbols-outlined text-gray-400">search</span>
//             </div>
//             <input
//               type="text"
//               placeholder="Rechercher projet, auteur, technologie..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-[#0d1a29] dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
//             />
//           </div>
          
//           <select 
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-[#0d1a29] dark:text-white"
//           >
//             <option value="">📊 Tous les statuts</option>
//             <option value="approved">✅ Approuvés</option>
//             <option value="pending">⏳ En attente</option>
//             <option value="rejected">❌ Rejetés</option>
//             <option value="draft">📝 Brouillons</option>
//           </select>
          
//           <select 
//             value={cohortFilter}
//             onChange={(e) => setCohortFilter(e.target.value)}
//             className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-[#0d1a29] dark:text-white"
//           >
//             <option value="">👥 Toutes les cohortes</option>
//             {getUniqueCohorts().map(cohort => (
//               <option key={cohort} value={cohort}>{cohort}</option>
//             ))}
//           </select>
          
//           <select 
//             value={technologyFilter}
//             onChange={(e) => setTechnologyFilter(e.target.value)}
//             className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-[#0d1a29] dark:text-white"
//           >
//             <option value="">💻 Toutes les technologies</option>
//             {getUniqueTechnologies().map(tech => (
//               <option key={tech} value={tech}>{tech}</option>
//             ))}
//           </select>
//         </div>
        
//         <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
//           <div className="text-sm text-gray-600 dark:text-gray-400">
//             <span className="font-medium text-gray-900 dark:text-white">{filteredData.length}</span> utilisateur(s) trouvé(s)
//             {(searchTerm || statusFilter || cohortFilter || technologyFilter) && (
//               <span>
//                 {' '}sur <span className="font-medium">{projectsWithUsers.length}</span>
//                 <button 
//                   onClick={() => { 
//                     setSearchTerm(''); 
//                     setStatusFilter(''); 
//                     setCohortFilter(''); 
//                     setTechnologyFilter('');
//                   }} 
//                   className="ml-2 text-[#E30613] hover:text-[#c40511] font-medium flex items-center gap-1"
//                 >
//                   <span className="material-symbols-outlined text-base">close</span>
//                   Effacer les filtres
//                 </button>
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="space-y-4">
//         {filteredData.length > 0 ? (
//           filteredData.map((user) => (
//             <div key={user.id} className="bg-white dark:bg-[#1a2f44] rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
//               <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-[#0d1a29] dark:to-[#152536] px-6 py-4 border-b border-gray-200 dark:border-gray-700">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-[#E30613] to-[#ff6b6b] rounded-full flex items-center justify-center text-white font-bold">
//                       {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-[#001F3F] dark:text-white">
//                         {user.full_name}
//                         {user.is_staff && (
//                           <span className="ml-2 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 px-2 py-1 rounded">
//                             Admin
//                           </span>
//                         )}
//                       </h3>
//                       <p className="text-sm text-gray-600 dark:text-gray-400">
//                         {user.email} • {user.projects_count} projet(s)
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <span className="text-sm text-gray-500 dark:text-gray-400">
//                       ID: {user.id}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="divide-y divide-gray-200 dark:divide-gray-700">
//                 {(user.projects || []).map((project) => (
//                   <div key={project.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-[#0d1a29] transition-colors">
//                     <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
//                       <div className="flex-1">
//                         <div className="flex flex-wrap items-center gap-2 mb-3">
//                           <h4 className="font-medium text-[#001F3F] dark:text-white">
//                             {project.title}
//                           </h4>
//                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
//                             <span className="material-symbols-outlined text-xs mr-1">
//                               {getStatusIcon(project.status)}
//                             </span>
//                             {getStatusText(project.status)}
//                           </span>
//                           {project.cohort && (
//                             <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 px-2 py-0.5 rounded">
//                               {project.cohort}
//                             </span>
//                           )}
//                           {project.days_since_creation && (
//                             <span className="text-xs text-gray-500 dark:text-gray-400">
//                               Il y a {project.days_since_creation} jours
//                             </span>
//                           )}
//                         </div>
                        
//                         <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
//                           {project.description}
//                         </p>

//                         <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
//                           {project.technologies && (
//                             <div className="flex items-center space-x-1">
//                               <span className="material-symbols-outlined text-base">code</span>
//                               <span>{project.technologies}</span>
//                             </div>
//                           )}
                          
//                           {project.created_at && (
//                             <div className="flex items-center space-x-1">
//                               <span className="material-symbols-outlined text-base">calendar_today</span>
//                               <span>{new Date(project.created_at).toLocaleDateString('fr-FR')}</span>
//                             </div>
//                           )}
                          
//                           {project.github_url && (
//                             <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:underline">
//                               <span className="material-symbols-outlined text-base">code</span>
//                               <span>GitHub</span>
//                             </a>
//                           )}
                          
//                           {project.demo_url && (
//                             <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-green-600 hover:text-green-800 dark:text-green-400 hover:underline">
//                               <span className="material-symbols-outlined text-base">open_in_new</span>
//                               <span>Démo</span>
//                             </a>
//                           )}
                          
//                           {project.image_url && (
//                             <a href={`http://127.0.0.1:8000${project.image_url}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-purple-600 hover:text-purple-800 dark:text-purple-400 hover:underline">
//                               <span className="material-symbols-outlined text-base">image</span>
//                               <span>Image</span>
//                             </a>
//                           )}
//                         </div>
//                       </div>

//                       <div className="flex space-x-2">
//                         <button onClick={() => handleViewDetails(project)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20" title="Voir les détails">
//                           <span className="material-symbols-outlined">visibility</span>
//                         </button>
                        
//                         {normalizeStatus(project.status) !== 'approved' && (
//                           <button onClick={() => openApprovalModal(project.id, project.title)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20" title="Approuver">
//                             <span className="material-symbols-outlined">check_circle</span>
//                           </button>
//                         )}
                        
//                         {normalizeStatus(project.status) !== 'rejected' && (
//                           <button onClick={() => openRejectionModal(project.id, project.title)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" title="Rejeter">
//                             <span className="material-symbols-outlined">cancel</span>
//                           </button>
//                         )}
                        
//                         <button onClick={() => handleDeleteProject(project.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" title="Supprimer">
//                           <span className="material-symbols-outlined">delete</span>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
                
//                 {(!user.projects || user.projects.length === 0) && (
//                   <div className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
//                     Aucun projet pour cet utilisateur
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
//             <div className="text-gray-400 dark:text-gray-500 mb-2">
//               <span className="material-symbols-outlined text-4xl">search_off</span>
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
//               Aucun résultat trouvé
//             </h3>
//             <p className="text-gray-500 dark:text-gray-400 mb-4">
//               {projectsWithUsers.length === 0 
//                 ? 'Aucune donnée disponible. Essayez de tester la connexion ou utilisez le mode démo.' 
//                 : 'Aucun projet ne correspond à vos critères.'}
//             </p>
//             <div className="flex flex-wrap justify-center gap-3">
//               {(searchTerm || statusFilter || cohortFilter || technologyFilter) && (
//                 <button onClick={() => { setSearchTerm(''); setStatusFilter(''); setCohortFilter(''); setTechnologyFilter(''); }} className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#c40511] font-medium flex items-center gap-2">
//                   <span className="material-symbols-outlined">filter_alt_off</span>
//                   Réinitialiser les filtres
//                 </button>
//               )}
//               <button onClick={testDatabaseConnection} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 font-medium flex items-center gap-2">
//                 <span className="material-symbols-outlined">database</span>
//                 Tester la connexion
//               </button>
//               {isDemoMode && (
//                 <button onClick={() => setRefreshKey(prev => prev + 1)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
//                   <span className="material-symbols-outlined">refresh</span>
//                   Réessayer
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {approvalModal.open && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-[#1a2f44] rounded-2xl shadow-2xl w-full max-w-lg">
//             <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-xl font-bold text-green-800 dark:text-green-300 flex items-center gap-2">
//                     <span className="material-symbols-outlined">check_circle</span>
//                     Approuver le projet
//                   </h3>
//                   <p className="text-sm text-green-700 dark:text-green-400 mt-1">{approvalModal.projectTitle}</p>
//                 </div>
//                 <button onClick={closeApprovalModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
//                   <span className="material-symbols-outlined">close</span>
//                 </button>
//               </div>
//             </div>
//             <div className="p-6">
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
//                   Critères d'approbation <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   value={approvalModal.criteria}
//                   onChange={(e) => setApprovalModal(prev => ({ ...prev, criteria: e.target.value }))}
//                   placeholder="Décrivez les critères pour lesquels vous approuvez ce projet..."
//                   className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-[#0d1a29] dark:text-white resize-none placeholder-gray-400 dark:placeholder-gray-500"
//                   autoFocus
//                 />
//                 <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
//                   Ces critères seront enregistrés avec la validation
//                 </div>
//               </div>
//               <div className="flex justify-end gap-3">
//                 <button onClick={closeApprovalModal} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
//                   Annuler
//                 </button>
//                 <button onClick={handleApproveWithCriteria} className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 flex items-center gap-2">
//                   <span className="material-symbols-outlined">check_circle</span>
//                   Approuver le projet
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {rejectionModal.open && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-[#1a2f44] rounded-2xl shadow-2xl w-full max-w-lg">
//             <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-red-50 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-xl font-bold text-red-800 dark:text-red-300 flex items-center gap-2">
//                     <span className="material-symbols-outlined">cancel</span>
//                     Rejeter le projet
//                   </h3>
//                   <p className="text-sm text-red-700 dark:text-red-400 mt-1">{rejectionModal.projectTitle}</p>
//                 </div>
//                 <button onClick={closeRejectionModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
//                   <span className="material-symbols-outlined">close</span>
//                 </button>
//               </div>
//             </div>
//             <div className="p-6">
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
//                   Motifs de rejet <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   value={rejectionModal.criteria}
//                   onChange={(e) => setRejectionModal(prev => ({ ...prev, criteria: e.target.value }))}
//                   placeholder="Expliquez pourquoi vous rejetez ce projet..."
//                   className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-[#0d1a29] dark:text-white resize-none placeholder-gray-400 dark:placeholder-gray-500"
//                   autoFocus
//                 />
//                 <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
//                   Ces motifs seront communiqués à l'auteur
//                 </div>
//               </div>
//               <div className="flex justify-end gap-3">
//                 <button onClick={closeRejectionModal} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
//                   Annuler
//                 </button>
//                 <button onClick={handleRejectWithCriteria} className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 flex items-center gap-2">
//                   <span className="material-symbols-outlined">cancel</span>
//                   Rejeter le projet
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectManagement;



// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const ProjectManagement = () => {
//   const navigate = useNavigate();
//   const [projectsWithUsers, setProjectsWithUsers] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [cohortFilter, setCohortFilter] = useState('');
//   const [technologyFilter, setTechnologyFilter] = useState('');
//   const [isDemoMode, setIsDemoMode] = useState(false);
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [apiStatus, setApiStatus] = useState('🚀 Initialisation...');
//   const [stats, setStats] = useState({
//     total: 0,
//     approved: 0,
//     pending: 0,
//     rejected: 0,
//     draft: 0,
//     totalUsers: 0
//   });
  
//   // États pour les modales
//   const [approvalModal, setApprovalModal] = useState({
//     open: false,
//     projectId: null,
//     projectTitle: '',
//     criteria: ''
//   });
  
//   const [rejectionModal, setRejectionModal] = useState({
//     open: false,
//     projectId: null,
//     projectTitle: '',
//     criteria: ''
//   });

//   const API_BASE = 'http://127.0.0.1:8000/api';

//   useEffect(() => {
//     fetchRealDataFromDatabase();
//   }, [refreshKey]);

//   const fetchRealDataFromDatabase = async () => {
//     try {
//       setLoading(true);
//       setApiStatus('🔄 Chargement des données...');
      
//       const response = await fetch(`${API_BASE}/projects/projects/`);
      
//       if (!response.ok) {
//         throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
//       }
      
//       const projects = await response.json();
      
//       console.log('📊 Données reçues:', projects.length, 'projets');
      
//       if (!Array.isArray(projects)) {
//         throw new Error('Les données reçues ne sont pas un tableau');
//       }
      
//       if (projects.length === 0) {
//         setApiStatus('📭 Aucun projet trouvé');
//         setIsDemoMode(true);
//         setLoading(false);
//         return;
//       }
      
//       // Transformer les données pour l'affichage par utilisateur
//       const usersMap = new Map();
      
//       projects.forEach(project => {
//         const authorInfo = project.author_info || {};
//         const authorId = authorInfo.id || project.author;
        
//         if (!authorId) {
//           console.warn('⚠️ Projet sans auteur:', project.id);
//           return;
//         }
        
//         if (!usersMap.has(authorId)) {
//           usersMap.set(authorId, {
//             id: authorId,
//             full_name: authorInfo.full_name || project.author_name || `Auteur ${authorId}`,
//             first_name: authorInfo.full_name?.split(' ')[0] || 'Auteur',
//             last_name: authorInfo.full_name?.split(' ').slice(1).join(' ') || `#${authorId}`,
//             email: authorInfo.email || project.author_email || `auteur${authorId}@simplon.com`,
//             username: authorInfo.username || project.author_username || `user_${authorId}`,
//             is_staff: authorInfo.is_staff || false,
//             projects: [],
//             projects_count: 0
//           });
//         }
        
//         const user = usersMap.get(authorId);
        
//         user.projects.push({
//           id: project.id,
//           title: project.title || 'Projet sans titre',
//           description: project.description || 'Aucune description',
//           technologies: project.technologies || '',
//           status: project.status || 'draft',
//           cohort: project.cohort || '',
//           tags: project.tags || '',
//           github_url: project.github_url || '',
//           demo_url: project.demo_url || '',
//           image_url: project.image || '',
//           created_at: project.created_at,
//           updated_at: project.updated_at,
//           author_name: authorInfo.full_name || project.author_name,
//           author_email: authorInfo.email || project.author_email,
//           author_username: authorInfo.username || project.author_username,
//           author_id: authorId,
//           is_approved: project.is_approved,
//           is_pending: project.is_pending,
//           days_since_creation: project.days_since_creation
//         });
        
//         user.projects_count = user.projects.length;
//       });
      
//       const usersWithProjects = Array.from(usersMap.values());
      
//       // Trier par nombre de projets
//       usersWithProjects.sort((a, b) => b.projects_count - a.projects_count);
      
//       // Trier les projets par date (plus récent d'abord)
//       usersWithProjects.forEach(user => {
//         user.projects.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
//       });
      
//       setProjectsWithUsers(usersWithProjects);
//       setFilteredData(usersWithProjects);
//       setIsDemoMode(false);
      
//       // Calculer les statistiques
//       const allProjects = usersWithProjects.flatMap(user => user.projects || []);
//       const stats = {
//         total: allProjects.length,
//         approved: allProjects.filter(p => normalizeStatus(p.status) === 'approved' || p.is_approved).length,
//         pending: allProjects.filter(p => normalizeStatus(p.status) === 'pending' || p.is_pending).length,
//         rejected: allProjects.filter(p => normalizeStatus(p.status) === 'rejected').length,
//         draft: allProjects.filter(p => normalizeStatus(p.status) === 'draft').length,
//         totalUsers: usersWithProjects.length
//       };
      
//       setStats(stats);
//       setApiStatus(`✅ ${stats.total} projets • ${stats.totalUsers} auteurs • ${stats.approved} approuvés`);
      
//     } catch (error) {
//       console.error('❌ Erreur récupération données:', error);
//       setApiStatus(`❌ ${error.message}`);
      
//       if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
//         setApiStatus('🎭 Mode démo activé');
//         setIsDemoMode(true);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const testDatabaseConnection = async () => {
//     try {
//       setLoading(true);
//       setApiStatus('🔍 Test de connexion...');
      
//       const response = await fetch(`${API_BASE}/projects/projects/`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }
      
//       const data = await response.json();
      
//       alert(`✅ Connexion réussie!\n\nNombre de projets: ${data.length}\nPremier projet: ${data[0]?.title || 'Aucun'}\n\n📊 Statut: ${apiStatus}`);
//       setApiStatus('✅ Test réussi');
      
//       fetchRealDataFromDatabase();
      
//     } catch (error) {
//       console.error('Test échoué:', error);
//       alert(`❌ Test échoué:\n${error.message}\n\nVérifiez que le serveur Django est en cours d'exécution.`);
//       setApiStatus('❌ Test échoué');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateAndSetStats = (data) => {
//     const allProjects = data.flatMap(user => user.projects || []);
    
//     const stats = {
//       total: allProjects.length,
//       approved: allProjects.filter(p => normalizeStatus(p.status) === 'approved' || p.is_approved).length,
//       pending: allProjects.filter(p => normalizeStatus(p.status) === 'pending' || p.is_pending).length,
//       rejected: allProjects.filter(p => normalizeStatus(p.status) === 'rejected').length,
//       draft: allProjects.filter(p => normalizeStatus(p.status) === 'draft').length,
//       totalUsers: data.length
//     };
    
//     setStats(stats);
//   };

//   useEffect(() => {
//     let filtered = [...projectsWithUsers];

//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase().trim();
//       filtered = filtered.map(user => ({
//         ...user,
//         projects: user.projects?.filter(project => 
//           (project.title?.toLowerCase() || '').includes(term) ||
//           (project.description?.toLowerCase() || '').includes(term) ||
//           (project.technologies?.toLowerCase() || '').includes(term) ||
//           (project.author_name?.toLowerCase() || '').includes(term) ||
//           (project.author_email?.toLowerCase() || '').includes(term) ||
//           (user.full_name?.toLowerCase() || '').includes(term) ||
//           (user.email?.toLowerCase() || '').includes(term)
//         ) || []
//       })).filter(user => user.projects && user.projects.length > 0);
//     }

//     if (statusFilter) {
//       filtered = filtered.map(user => ({
//         ...user,
//         projects: user.projects?.filter(project => 
//           normalizeStatus(project.status) === normalizeStatus(statusFilter)
//         ) || []
//       })).filter(user => user.projects && user.projects.length > 0);
//     }

//     if (cohortFilter) {
//       filtered = filtered.map(user => ({
//         ...user,
//         projects: user.projects?.filter(project => 
//           (project.cohort?.toLowerCase() || '').includes(cohortFilter.toLowerCase())
//         ) || []
//       })).filter(user => user.projects && user.projects.length > 0);
//     }

//     if (technologyFilter) {
//       filtered = filtered.map(user => ({
//         ...user,
//         projects: user.projects?.filter(project => 
//           (project.technologies?.toLowerCase() || '').includes(technologyFilter.toLowerCase())
//         ) || []
//       })).filter(user => user.projects && user.projects.length > 0);
//     }

//     setFilteredData(filtered);
//   }, [searchTerm, statusFilter, cohortFilter, technologyFilter, projectsWithUsers]);

//   const normalizeStatus = (status) => {
//     if (!status) return '';
//     const s = status.toLowerCase();
//     if (s.includes('approv') || s.includes('valid') || s.includes('publish')) return 'approved';
//     if (s.includes('pend') || s.includes('wait')) return 'pending';
//     if (s.includes('reject') || s.includes('refus')) return 'rejected';
//     if (s.includes('draft') || s.includes('brouillon')) return 'draft';
//     return s;
//   };

//   const getStatusColor = (status) => {
//     const norm = normalizeStatus(status);
//     switch (norm) {
//       case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800';
//       case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800';
//       case 'draft': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
//       case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800';
//       default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border border-gray-200 dark:border-gray-700';
//     }
//   };

//   const getStatusIcon = (status) => {
//     const norm = normalizeStatus(status);
//     switch (norm) {
//       case 'approved': return 'check_circle';
//       case 'pending': return 'pending';
//       case 'draft': return 'draft';
//       case 'rejected': return 'cancel';
//       default: return 'help';
//     }
//   };

//   const getStatusText = (status) => {
//     const norm = normalizeStatus(status);
//     switch (norm) {
//       case 'approved': return '✅ Approuvé';
//       case 'pending': return '⏳ En attente';
//       case 'draft': return '📝 Brouillon';
//       case 'rejected': return '❌ Rejeté';
//       default: return status || '❓ Inconnu';
//     }
//   };

//   const handleApproveProject = async (projectId, criteria = 'Projet conforme aux exigences pédagogiques') => {
//     try {
//       setLoading(true);
      
//       if (isDemoMode) {
//         setProjectsWithUsers(prev => 
//           prev.map(user => ({
//             ...user,
//             projects: user.projects?.map(project => 
//               project.id === projectId ? { ...project, status: 'approved', is_approved: true, is_pending: false } : project
//             ) || []
//           }))
//         );
//         setApiStatus('✅ Projet approuvé (mode démo)');
//       } else {
//         const token = localStorage.getItem('access_token');
//         const headers = { 'Content-Type': 'application/json' };
        
//         if (token) headers['Authorization'] = `Bearer ${token}`;
        
//         try {
//           const response = await fetch(`${API_BASE}/projects/${projectId}/`, {
//             method: 'PATCH',
//             headers,
//             body: JSON.stringify({ 
//               status: 'approved',
//               approval_criteria: criteria
//             })
//           });
          
//           if (response.ok) {
//             await fetchRealDataFromDatabase();
//             setApiStatus('✅ Projet approuvé avec succès');
//           } else {
//             throw new Error(`Erreur ${response.status}`);
//           }
//         } catch (apiError) {
//           setProjectsWithUsers(prev => 
//             prev.map(user => ({
//               ...user,
//               projects: user.projects?.map(project => 
//                 project.id === projectId ? { ...project, status: 'approved', is_approved: true, is_pending: false } : project
//               ) || []
//             }))
//           );
//           setApiStatus('✅ Projet approuvé (simulation)');
//         }
//       }
//     } catch (error) {
//       console.error('❌ Erreur approbation:', error);
//       setApiStatus(`❌ ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRejectProject = async (projectId, criteria = 'Projet nécessite des améliorations significatives') => {
//     try {
//       setLoading(true);
      
//       if (isDemoMode) {
//         setProjectsWithUsers(prev => 
//           prev.map(user => ({
//             ...user,
//             projects: user.projects?.map(project => 
//               project.id === projectId ? { ...project, status: 'rejected', is_approved: false, is_pending: false } : project
//             ) || []
//           }))
//         );
//         setApiStatus('❌ Projet rejeté (mode démo)');
//       } else {
//         const token = localStorage.getItem('access_token');
//         const headers = { 'Content-Type': 'application/json' };
        
//         if (token) headers['Authorization'] = `Bearer ${token}`;
        
//         try {
//           const response = await fetch(`${API_BASE}/projects/${projectId}/`, {
//             method: 'PATCH',
//             headers,
//             body: JSON.stringify({ 
//               status: 'rejected',
//               rejection_reasons: criteria
//             })
//           });
          
//           if (response.ok) {
//             await fetchRealDataFromDatabase();
//             setApiStatus('❌ Projet rejeté');
//           } else {
//             throw new Error(`Erreur ${response.status}`);
//           }
//         } catch (apiError) {
//           setProjectsWithUsers(prev => 
//             prev.map(user => ({
//               ...user,
//               projects: user.projects?.map(project => 
//                 project.id === projectId ? { ...project, status: 'rejected', is_approved: false, is_pending: false } : project
//               ) || []
//             }))
//           );
//           setApiStatus('❌ Projet rejeté (simulation)');
//         }
//       }
//     } catch (error) {
//       console.error('❌ Erreur rejet:', error);
//       setApiStatus(`❌ ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteProject = async (projectId) => {
//     if (!window.confirm('⚠️ Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.')) return;
    
//     try {
//       setLoading(true);
      
//       if (isDemoMode) {
//         setProjectsWithUsers(prev => 
//           prev.map(user => ({
//             ...user,
//             projects: user.projects?.filter(project => project.id !== projectId) || []
//           })).filter(user => user.projects && user.projects.length > 0)
//         );
//         setApiStatus('🗑️ Projet supprimé (mode démo)');
//       } else {
//         const token = localStorage.getItem('access_token');
//         const headers = {};
        
//         if (token) headers['Authorization'] = `Bearer ${token}`;
        
//         try {
//           const response = await fetch(`${API_BASE}/projects/${projectId}/`, {
//             method: 'DELETE',
//             headers
//           });
          
//           if (response.ok) {
//             await fetchRealDataFromDatabase();
//             setApiStatus('🗑️ Projet supprimé');
//           } else {
//             throw new Error(`Erreur ${response.status}`);
//           }
//         } catch (apiError) {
//           setProjectsWithUsers(prev => 
//             prev.map(user => ({
//               ...user,
//               projects: user.projects?.filter(project => project.id !== projectId) || []
//             })).filter(user => user.projects && user.projects.length > 0)
//           );
//           setApiStatus('🗑️ Projet supprimé (simulation)');
//         }
//       }
//     } catch (error) {
//       console.error('❌ Erreur suppression:', error);
//       setApiStatus(`❌ ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openApprovalModal = (projectId, projectTitle) => {
//     setApprovalModal({
//       open: true,
//       projectId,
//       projectTitle,
//       criteria: '✅ Projet bien structuré\n✅ Code propre et documenté\n✅ Fonctionnalités complètes\n✅ Bonnes pratiques respectées'
//     });
//   };

//   const openRejectionModal = (projectId, projectTitle) => {
//     setRejectionModal({
//       open: true,
//       projectId,
//       projectTitle,
//       criteria: '❌ Documentation insuffisante\n❌ Code non optimisé\n❌ Tests manquants\n❌ UI/UX à améliorer'
//     });
//   };

//   const closeApprovalModal = () => {
//     setApprovalModal({ open: false, projectId: null, projectTitle: '', criteria: '' });
//   };

//   const closeRejectionModal = () => {
//     setRejectionModal({ open: false, projectId: null, projectTitle: '', criteria: '' });
//   };

//   const handleApproveWithCriteria = async () => {
//     const { projectId, criteria } = approvalModal;
//     if (!criteria.trim()) {
//       alert('⚠️ Veuillez saisir les critères d\'approbation');
//       return;
//     }
//     await handleApproveProject(projectId, criteria);
//     closeApprovalModal();
//   };

//   const handleRejectWithCriteria = async () => {
//     const { projectId, criteria } = rejectionModal;
//     if (!criteria.trim()) {
//       alert('⚠️ Veuillez saisir les motifs de rejet');
//       return;
//     }
//     await handleRejectProject(projectId, criteria);
//     closeRejectionModal();
//   };

//   const handleViewDetails = (project) => {
//     // Préparer les données pour la page de détail
//     const projectData = {
//       id: project.id,
//       title: project.title,
//       description: project.description,
//       status: project.status,
//       technologies: project.technologies,
//       cohort: project.cohort,
//       tags: project.tags,
//       github_url: project.github_url,
//       demo_url: project.demo_url,
//       image_url: project.image_url,
//       created_at: project.created_at,
//       updated_at: project.updated_at,
      
//       // Informations de l'auteur
//       author: {
//         id: project.author_id,
//         name: project.author_name,
//         email: project.author_email,
//         username: project.author_username
//       },
      
//       // Statistiques
//       stats: {
//         days_since_creation: project.days_since_creation,
//         is_approved: project.is_approved,
//         is_pending: project.is_pending
//       }
//     };
    
//     // Naviguer vers la page de détail
//     navigate(`/admin/projects/${project.id}`, {
//       state: { project: projectData }
//     });
//   };

//   const handleViewDetailsWithCheck = (project) => {
//     if (loading) {
//       alert('⏳ Veuillez patienter pendant le chargement des données...');
//       return;
//     }
    
//     handleViewDetails(project);
//   };

//   const getUniqueCohorts = () => {
//     const cohorts = new Set();
//     projectsWithUsers.forEach(user => {
//       user.projects?.forEach(project => {
//         if (project.cohort) cohorts.add(project.cohort);
//       });
//     });
//     return Array.from(cohorts).sort();
//   };

//   const getUniqueTechnologies = () => {
//     const techs = new Set();
//     projectsWithUsers.forEach(user => {
//       user.projects?.forEach(project => {
//         if (project.technologies) {
//           project.technologies.split(',').map(t => t.trim()).filter(t => t).forEach(tech => techs.add(tech));
//         }
//       });
//     });
//     return Array.from(techs).sort();
//   };

//   const exportToCSV = () => {
//     if (projectsWithUsers.length === 0) {
//       alert('📭 Aucune donnée à exporter');
//       return;
//     }
    
//     const csvContent = [
//       ['Auteur', 'Email', 'Username', 'Projet', 'Statut', 'Technologies', 'Cohorte', 'Date création', 'URL GitHub', 'URL Démo'],
//       ...projectsWithUsers.flatMap(user => 
//         (user.projects || []).map(project => [
//           project.author_name || user.full_name,
//           project.author_email || user.email,
//           project.author_username || user.username,
//           project.title || '',
//           getStatusText(project.status),
//           project.technologies || '',
//           project.cohort || '',
//           project.created_at ? new Date(project.created_at).toLocaleDateString('fr-FR') : '',
//           project.github_url || '',
//           project.demo_url || ''
//         ])
//       )
//     ].map(row => row.join(';')).join('\n');
    
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
    
//     link.setAttribute('href', url);
//     link.setAttribute('download', `projets_simplon_${new Date().toISOString().split('T')[0]}.csv`);
//     link.style.visibility = 'hidden';
    
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
    
//     alert(`✅ Fichier CSV exporté avec succès\n\n${projectsWithUsers.length} auteurs\n${stats.total} projets`);
//   };

//   const activateDemoMode = () => {
//     const demoUsers = [
//       {
//         id: 1,
//         full_name: 'Jean Dupont',
//         email: 'jean.dupont@simplon.com',
//         username: 'jeandupont',
//         projects_count: 3,
//         projects: [
//           {
//             id: 101,
//             title: 'Plateforme E-commerce React/Node.js',
//             description: 'Site e-commerce complet avec panier, paiement et dashboard admin',
//             technologies: 'React, Node.js, MongoDB, Stripe',
//             status: 'approved',
//             cohort: 'Promo 2024-1',
//             tags: 'ecommerce, fullstack, paiement',
//             github_url: 'https://github.com/jeandupont/ecommerce',
//             demo_url: 'https://ecommerce-demo.simplon.com',
//             created_at: '2024-01-15T10:30:00Z',
//             author_name: 'Jean Dupont',
//             is_approved: true,
//             is_pending: false
//           },
//           {
//             id: 102,
//             title: 'Application Météo Progressive Web App',
//             description: 'PWA avec notifications push et fonctionnement hors-ligne',
//             technologies: 'PWA, JavaScript, Service Workers',
//             status: 'pending',
//             cohort: 'Promo 2024-1',
//             tags: 'pwa, météo, offline',
//             github_url: 'https://github.com/jeandupont/weather-pwa',
//             demo_url: '',
//             created_at: '2024-02-20T14:45:00Z',
//             author_name: 'Jean Dupont',
//             is_approved: false,
//             is_pending: true
//           }
//         ]
//       },
//       {
//         id: 2,
//         full_name: 'Marie Lambert',
//         email: 'marie.lambert@simplon.com',
//         username: 'marielambert',
//         projects_count: 2,
//         projects: [
//           {
//             id: 201,
//             title: 'Système de Réservation de Salles',
//             description: 'Application de gestion des réservations pour espaces de coworking',
//             technologies: 'Django, PostgreSQL, Vue.js',
//             status: 'approved',
//             cohort: 'Promo 2023-2',
//             tags: 'réservation, gestion, admin',
//             github_url: 'https://github.com/marielambert/room-booking',
//             demo_url: 'https://booking.simplon.com',
//             created_at: '2023-11-10T09:15:00Z',
//             author_name: 'Marie Lambert',
//             is_approved: true,
//             is_pending: false
//           }
//         ]
//       }
//     ];
    
//     setProjectsWithUsers(demoUsers);
//     setFilteredData(demoUsers);
//     setIsDemoMode(true);
    
//     const allDemoProjects = demoUsers.flatMap(user => user.projects);
//     setStats({
//       total: allDemoProjects.length,
//       approved: allDemoProjects.filter(p => normalizeStatus(p.status) === 'approved' || p.is_approved).length,
//       pending: allDemoProjects.filter(p => normalizeStatus(p.status) === 'pending' || p.is_pending).length,
//       rejected: 0,
//       draft: 0,
//       totalUsers: demoUsers.length
//     });
//   };

//   const renderStatusBanner = () => {
//     if (isDemoMode) {
//       return (
//         <div className="mb-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <span className="material-symbols-outlined text-blue-500">info</span>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
//                   🎭 Mode démonstration
//                 </p>
//                 <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
//                   Données de test - Serveur Django non disponible
//                 </p>
//               </div>
//             </div>
//             <button onClick={testDatabaseConnection} className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
//               <span className="material-symbols-outlined text-base">database</span>
//               Tester la connexion
//             </button>
//           </div>
//         </div>
//       );
//     }
    
//     return (
//       <div className="mb-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//             <div className="flex-shrink-0">
//               <span className="material-symbols-outlined text-green-500">check_circle</span>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm text-green-700 dark:text-green-300 font-medium">
//                 ✅ Données réelles PostgreSQL
//               </p>
//               <p className="text-xs text-green-600 dark:text-green-400 mt-1">
//                 {stats.totalUsers} auteurs • {stats.total} projets • {stats.approved} approuvés
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-full font-medium">
//               Base de données
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading && projectsWithUsers.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
//         <div className="relative">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#E30613] border-t-transparent"></div>
//           <div className="absolute inset-0 flex items-center justify-center">
//             <span className="material-symbols-outlined text-[#E30613] animate-pulse">database</span>
//           </div>
//         </div>
//         <div className="text-center">
//           <p className="text-gray-600 dark:text-gray-400 font-medium">{apiStatus}</p>
//           <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Chargement des projets...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {renderStatusBanner()}
      
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-[#001F3F] dark:text-white">
//             🚀 Gestion des Projets Simplon
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-2">
//             Plateforme de suivi et validation des projets des apprenants
//           </p>
//         </div>
//         <div className="flex flex-wrap gap-3">
//           <button onClick={testDatabaseConnection} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-[#0d1a29] text-gray-700 dark:text-gray-300 flex items-center gap-2 transition-all hover:scale-105">
//             <span className="material-symbols-outlined">database</span>
//             Tester la connexion
//           </button>
//           <button onClick={() => setRefreshKey(prev => prev + 1)} className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#c40511] font-medium flex items-center gap-2 transition-all hover:scale-105">
//             <span className="material-symbols-outlined">refresh</span>
//             Actualiser
//           </button>
//           <button onClick={exportToCSV} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 font-medium flex items-center gap-2 transition-all hover:scale-105">
//             <span className="material-symbols-outlined">download</span>
//             Exporter CSV
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//         <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-2xl font-bold text-[#001F3F] dark:text-white">{stats.total}</div>
//               <div className="text-sm text-gray-500 dark:text-gray-400">Total Projets</div>
//             </div>
//             <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-2xl">folder</span>
//           </div>
//         </div>
        
//         <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.approved}</div>
//               <div className="text-sm text-gray-500 dark:text-gray-400">Approuvés</div>
//             </div>
//             <span className="material-symbols-outlined text-green-500 text-2xl">check_circle</span>
//           </div>
//         </div>
        
//         <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
//               <div className="text-sm text-gray-500 dark:text-gray-400">En attente</div>
//             </div>
//             <span className="material-symbols-outlined text-yellow-500 text-2xl">pending</span>
//           </div>
//         </div>
        
//         <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</div>
//               <div className="text-sm text-gray-500 dark:text-gray-400">Rejetés</div>
//             </div>
//             <span className="material-symbols-outlined text-red-500 text-2xl">cancel</span>
//           </div>
//         </div>
        
//         <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.draft}</div>
//               <div className="text-sm text-gray-500 dark:text-gray-400">Brouillons</div>
//             </div>
//             <span className="material-symbols-outlined text-blue-500 text-2xl">draft</span>
//           </div>
//         </div>
        
//         <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalUsers}</div>
//               <div className="text-sm text-gray-500 dark:text-gray-400">Auteurs</div>
//             </div>
//             <span className="material-symbols-outlined text-purple-500 text-2xl">people</span>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
//           <div className="lg:col-span-2 relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <span className="material-symbols-outlined text-gray-400">search</span>
//             </div>
//             <input
//               type="text"
//               placeholder="Rechercher projet, auteur, technologie..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-[#0d1a29] dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
//             />
//           </div>
          
//           <select 
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-[#0d1a29] dark:text-white"
//           >
//             <option value="">📊 Tous les statuts</option>
//             <option value="approved">✅ Approuvés</option>
//             <option value="pending">⏳ En attente</option>
//             <option value="rejected">❌ Rejetés</option>
//             <option value="draft">📝 Brouillons</option>
//           </select>
          
//           <select 
//             value={cohortFilter}
//             onChange={(e) => setCohortFilter(e.target.value)}
//             className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-[#0d1a29] dark:text-white"
//           >
//             <option value="">👥 Toutes les cohortes</option>
//             {getUniqueCohorts().map(cohort => (
//               <option key={cohort} value={cohort}>{cohort}</option>
//             ))}
//           </select>
          
//           <select 
//             value={technologyFilter}
//             onChange={(e) => setTechnologyFilter(e.target.value)}
//             className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-[#0d1a29] dark:text-white"
//           >
//             <option value="">💻 Toutes les technologies</option>
//             {getUniqueTechnologies().map(tech => (
//               <option key={tech} value={tech}>{tech}</option>
//             ))}
//           </select>
//         </div>
        
//         <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
//           <div className="text-sm text-gray-600 dark:text-gray-400">
//             <span className="font-medium text-gray-900 dark:text-white">{filteredData.length}</span> utilisateur(s) trouvé(s)
//             {(searchTerm || statusFilter || cohortFilter || technologyFilter) && (
//               <span>
//                 {' '}sur <span className="font-medium">{projectsWithUsers.length}</span>
//                 <button 
//                   onClick={() => { 
//                     setSearchTerm(''); 
//                     setStatusFilter(''); 
//                     setCohortFilter(''); 
//                     setTechnologyFilter('');
//                   }} 
//                   className="ml-2 text-[#E30613] hover:text-[#c40511] font-medium flex items-center gap-1"
//                 >
//                   <span className="material-symbols-outlined text-base">close</span>
//                   Effacer les filtres
//                 </button>
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="space-y-4">
//         {filteredData.length > 0 ? (
//           filteredData.map((user) => (
//             <div key={user.id} className="bg-white dark:bg-[#1a2f44] rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group">
//               <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-[#0d1a29] dark:to-[#152536] px-6 py-4 border-b border-gray-200 dark:border-gray-700">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-[#E30613] to-[#ff6b6b] rounded-full flex items-center justify-center text-white font-bold">
//                       {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-[#001F3F] dark:text-white">
//                         {user.full_name}
//                         {user.is_staff && (
//                           <span className="ml-2 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 px-2 py-1 rounded">
//                             Admin
//                           </span>
//                         )}
//                       </h3>
//                       <p className="text-sm text-gray-600 dark:text-gray-400">
//                         {user.email} • {user.projects_count} projet(s)
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <span className="text-sm text-gray-500 dark:text-gray-400">
//                       ID: {user.id}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="divide-y divide-gray-200 dark:divide-gray-700">
//                 {(user.projects || []).map((project) => (
//                   <div key={project.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-[#0d1a29] transition-colors">
//                     <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
//                       <div className="flex-1">
//                         <div className="flex flex-wrap items-center gap-2 mb-3">
//                           <h4 className="font-medium text-[#001F3F] dark:text-white">
//                             {project.title}
//                           </h4>
//                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
//                             <span className="material-symbols-outlined text-xs mr-1">
//                               {getStatusIcon(project.status)}
//                             </span>
//                             {getStatusText(project.status)}
//                           </span>
//                           {project.cohort && (
//                             <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 px-2 py-0.5 rounded">
//                               {project.cohort}
//                             </span>
//                           )}
//                           {project.days_since_creation && (
//                             <span className="text-xs text-gray-500 dark:text-gray-400">
//                               Il y a {project.days_since_creation} jours
//                             </span>
//                           )}
//                         </div>
                        
//                         <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
//                           {project.description}
//                         </p>

//                         <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
//                           {project.technologies && (
//                             <div className="flex items-center space-x-1">
//                               <span className="material-symbols-outlined text-base">code</span>
//                               <span>{project.technologies}</span>
//                             </div>
//                           )}
                          
//                           {project.created_at && (
//                             <div className="flex items-center space-x-1">
//                               <span className="material-symbols-outlined text-base">calendar_today</span>
//                               <span>{new Date(project.created_at).toLocaleDateString('fr-FR')}</span>
//                             </div>
//                           )}
                          
//                           {project.github_url && (
//                             <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:underline">
//                               <span className="material-symbols-outlined text-base">code</span>
//                               <span>GitHub</span>
//                             </a>
//                           )}
                          
//                           {project.demo_url && (
//                             <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-green-600 hover:text-green-800 dark:text-green-400 hover:underline">
//                               <span className="material-symbols-outlined text-base">open_in_new</span>
//                               <span>Démo</span>
//                             </a>
//                           )}
                          
//                           {project.image_url && (
//                             <a href={`http://127.0.0.1:8000${project.image_url}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-purple-600 hover:text-purple-800 dark:text-purple-400 hover:underline">
//                               <span className="material-symbols-outlined text-base">image</span>
//                               <span>Image</span>
//                             </a>
//                           )}
//                         </div>
//                       </div>

//                       <div className="flex space-x-2">
//                         {/* Bouton Visibility amélioré */}
//                         <button 
//                           onClick={() => handleViewDetailsWithCheck(project)} 
//                           disabled={loading}
//                           className="relative group flex items-center justify-center text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 hover:scale-105 active:scale-95 border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//                           title={loading ? "Chargement en cours..." : `Voir les détails de "${project.title}"`}
//                         >
//                           {/* Icône principale */}
//                           <span className="material-symbols-outlined relative z-10">
//                             visibility
//                           </span>
                          
//                           {/* Effet de halo au survol */}
//                           <span className="absolute inset-0 bg-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                          
//                           {/* Badge pour nouveaux projets */}
//                           {project.days_since_creation && project.days_since_creation <= 7 && (
//                             <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border border-white dark:border-gray-800"></span>
//                           )}
                          
//                           {/* Indicateur de statut */}
//                           <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800">
//                             <div className={`w-full h-full rounded-full ${
//                               project.is_approved ? 'bg-green-500' :
//                               project.is_pending ? 'bg-yellow-500' :
//                               'bg-gray-400'
//                             }`}></div>
//                           </div>
                          
//                           {/* Tooltip amélioré */}
//                           <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-max">
//                             <div className="flex items-center gap-1">
//                               <span className="material-symbols-outlined text-xs">open_in_new</span>
//                               <span>Voir les détails complets</span>
//                             </div>
//                             <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
//                               <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
//                             </div>
//                           </div>
//                         </button>
                        
//                         {normalizeStatus(project.status) !== 'approved' && (
//                           <button onClick={() => openApprovalModal(project.id, project.title)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20" title="Approuver">
//                             <span className="material-symbols-outlined">check_circle</span>
//                           </button>
//                         )}
                        
//                         {normalizeStatus(project.status) !== 'rejected' && (
//                           <button onClick={() => openRejectionModal(project.id, project.title)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" title="Rejeter">
//                             <span className="material-symbols-outlined">cancel</span>
//                           </button>
//                         )}
                        
//                         <button onClick={() => handleDeleteProject(project.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" title="Supprimer">
//                           <span className="material-symbols-outlined">delete</span>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
                
//                 {(!user.projects || user.projects.length === 0) && (
//                   <div className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
//                     Aucun projet pour cet utilisateur
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
//             <div className="text-gray-400 dark:text-gray-500 mb-2">
//               <span className="material-symbols-outlined text-4xl">search_off</span>
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
//               Aucun résultat trouvé
//             </h3>
//             <p className="text-gray-500 dark:text-gray-400 mb-4">
//               {projectsWithUsers.length === 0 
//                 ? 'Aucune donnée disponible. Essayez de tester la connexion ou utilisez le mode démo.' 
//                 : 'Aucun projet ne correspond à vos critères.'}
//             </p>
//             <div className="flex flex-wrap justify-center gap-3">
//               {(searchTerm || statusFilter || cohortFilter || technologyFilter) && (
//                 <button onClick={() => { setSearchTerm(''); setStatusFilter(''); setCohortFilter(''); setTechnologyFilter(''); }} className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#c40511] font-medium flex items-center gap-2">
//                   <span className="material-symbols-outlined">filter_alt_off</span>
//                   Réinitialiser les filtres
//                 </button>
//               )}
//               <button onClick={testDatabaseConnection} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 font-medium flex items-center gap-2">
//                 <span className="material-symbols-outlined">database</span>
//                 Tester la connexion
//               </button>
//               {isDemoMode && (
//                 <button onClick={() => setRefreshKey(prev => prev + 1)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
//                   <span className="material-symbols-outlined">refresh</span>
//                   Réessayer
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {approvalModal.open && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-[#1a2f44] rounded-2xl shadow-2xl w-full max-w-lg">
//             <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-xl font-bold text-green-800 dark:text-green-300 flex items-center gap-2">
//                     <span className="material-symbols-outlined">check_circle</span>
//                     Approuver le projet
//                   </h3>
//                   <p className="text-sm text-green-700 dark:text-green-400 mt-1">{approvalModal.projectTitle}</p>
//                 </div>
//                 <button onClick={closeApprovalModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
//                   <span className="material-symbols-outlined">close</span>
//                 </button>
//               </div>
//             </div>
//             <div className="p-6">
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
//                   Critères d'approbation <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   value={approvalModal.criteria}
//                   onChange={(e) => setApprovalModal(prev => ({ ...prev, criteria: e.target.value }))}
//                   placeholder="Décrivez les critères pour lesquels vous approuvez ce projet..."
//                   className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-[#0d1a29] dark:text-white resize-none placeholder-gray-400 dark:placeholder-gray-500"
//                   autoFocus
//                 />
//                 <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
//                   Ces critères seront enregistrés avec la validation
//                 </div>
//               </div>
//               <div className="flex justify-end gap-3">
//                 <button onClick={closeApprovalModal} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
//                   Annuler
//                 </button>
//                 <button onClick={handleApproveWithCriteria} className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 flex items-center gap-2">
//                   <span className="material-symbols-outlined">check_circle</span>
//                   Approuver le projet
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {rejectionModal.open && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-[#1a2f44] rounded-2xl shadow-2xl w-full max-w-lg">
//             <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-red-50 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-xl font-bold text-red-800 dark:text-red-300 flex items-center gap-2">
//                     <span className="material-symbols-outlined">cancel</span>
//                     Rejeter le projet
//                   </h3>
//                   <p className="text-sm text-red-700 dark:text-red-400 mt-1">{rejectionModal.projectTitle}</p>
//                 </div>
//                 <button onClick={closeRejectionModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
//                   <span className="material-symbols-outlined">close</span>
//                 </button>
//               </div>
//             </div>
//             <div className="p-6">
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
//                   Motifs de rejet <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   value={rejectionModal.criteria}
//                   onChange={(e) => setRejectionModal(prev => ({ ...prev, criteria: e.target.value }))}
//                   placeholder="Expliquez pourquoi vous rejetez ce projet..."
//                   className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-[#0d1a29] dark:text-white resize-none placeholder-gray-400 dark:placeholder-gray-500"
//                   autoFocus
//                 />
//                 <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
//                   Ces motifs seront communiqués à l'auteur
//                 </div>
//               </div>
//               <div className="flex justify-end gap-3">
//                 <button onClick={closeRejectionModal} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
//                   Annuler
//                 </button>
//                 <button onClick={handleRejectWithCriteria} className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 flex items-center gap-2">
//                   <span className="material-symbols-outlined">cancel</span>
//                   Rejeter le projet
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectManagement;


// // src/components/admin/ProjectManagement.jsx - VERSION AMÉLIORÉE AVEC DÉBOGAGE
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const ProjectManagement = () => {
//   const navigate = useNavigate();
//   const [projectsWithUsers, setProjectsWithUsers] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [cohortFilter, setCohortFilter] = useState('');
//   const [technologyFilter, setTechnologyFilter] = useState('');
//   const [isDemoMode, setIsDemoMode] = useState(false);
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [apiStatus, setApiStatus] = useState('🚀 Initialisation...');
//   const [apiResponse, setApiResponse] = useState(null); // Nouveau: pour débogage
//   const [connectionError, setConnectionError] = useState(null); // Nouveau: erreur détaillée
  
//   const [stats, setStats] = useState({
//     total: 0,
//     approved: 0,
//     pending: 0,
//     rejected: 0,
//     draft: 0,
//     totalUsers: 0
//   });
  
//   // États pour les modales
//   const [approvalModal, setApprovalModal] = useState({
//     open: false,
//     projectId: null,
//     projectTitle: '',
//     criteria: ''
//   });
  
//   const [rejectionModal, setRejectionModal] = useState({
//     open: false,
//     projectId: null,
//     projectTitle: '',
//     criteria: ''
//   });

//   // ✅ MULTIPLES ENDPOINTS POUR TESTER
//   const API_ENDPOINTS = [
//     'http://127.0.0.1:8000/api/projects/projects/',
//     'http://127.0.0.1:8000/api/projects/',
//     'http://localhost:8000/api/projects/projects/',
//     'http://localhost:8000/api/projects/'
//   ];

//   useEffect(() => {
//     fetchRealDataFromDatabase();
//   }, [refreshKey]);

//   // ✅ FONCTION AMÉLIORÉE POUR TESTER TOUS LES ENDPOINTS
//   const testAllEndpoints = async () => {
//     setLoading(true);
//     setApiStatus('🔍 Test de tous les endpoints...');
    
//     const results = [];
    
//     for (const endpoint of API_ENDPOINTS) {
//       try {
//         console.log(`🔍 Test de: ${endpoint}`);
//         const startTime = Date.now();
//         const response = await fetch(endpoint);
//         const endTime = Date.now();
        
//         if (response.ok) {
//           const data = await response.json();
//           results.push({
//             endpoint,
//             status: '✅ SUCCÈS',
//             time: endTime - startTime + 'ms',
//             dataType: Array.isArray(data) ? `Array[${data.length}]` : typeof data,
//             dataPreview: JSON.stringify(data).substring(0, 100) + '...'
//           });
          
//           // Si on trouve des données, on les affiche
//           if (Array.isArray(data) && data.length > 0) {
//             console.log(`🎯 Données trouvées sur ${endpoint}:`, data);
//             setApiResponse(data); // Stocker pour débogage
//           }
//         } else {
//           results.push({
//             endpoint,
//             status: `❌ ${response.status} ${response.statusText}`,
//             time: endTime - startTime + 'ms',
//             dataType: 'Erreur HTTP',
//             dataPreview: ''
//           });
//         }
//       } catch (error) {
//         results.push({
//           endpoint,
//           status: `❌ ${error.message}`,
//           time: 'N/A',
//           dataType: 'Erreur réseau',
//           dataPreview: ''
//         });
//       }
//     }
    
//     // Afficher les résultats
//     console.table(results);
    
//     // Créer un message résumé
//     const successCount = results.filter(r => r.status.includes('✅')).length;
//     const summary = results.map(r => `${r.endpoint}: ${r.status}`).join('\n');
    
//     alert(`Résultats des tests:\n\n${summary}\n\n✅ ${successCount}/${API_ENDPOINTS.length} endpoints fonctionnels`);
    
//     setApiStatus(`Test terminé: ${successCount}/${API_ENDPOINTS.length} OK`);
//     setLoading(false);
//   };

//   // ✅ FONCTION PRINCIPALE AMÉLIORÉE
//   const fetchRealDataFromDatabase = async () => {
//     try {
//       setLoading(true);
//       setConnectionError(null);
//       setApiResponse(null);
//       setApiStatus('🔄 Tentative de connexion à l\'API Django...');
      
//       // Essayer tous les endpoints
//       let projects = null;
//       let workingEndpoint = '';
      
//       for (const endpoint of API_ENDPOINTS) {
//         try {
//           console.log(`🔍 Tentative sur: ${endpoint}`);
//           const response = await fetch(endpoint);
          
//           if (response.ok) {
//             const data = await response.json();
//             console.log(`✅ Réponse de ${endpoint}:`, data);
            
//             if (Array.isArray(data)) {
//               projects = data;
//               workingEndpoint = endpoint;
//               break;
//             } else if (data && typeof data === 'object') {
//               // Si l'API retourne un objet avec une clé 'results' ou 'projects'
//               if (Array.isArray(data.results)) {
//                 projects = data.results;
//                 workingEndpoint = endpoint;
//                 break;
//               } else if (Array.isArray(data.projects)) {
//                 projects = data.projects;
//                 workingEndpoint = endpoint;
//                 break;
//               } else {
//                 // Convertir l'objet en tableau si nécessaire
//                 projects = Object.values(data);
//                 workingEndpoint = endpoint;
//                 break;
//               }
//             }
//           }
//         } catch (err) {
//           console.log(`❌ ${endpoint}: ${err.message}`);
//         }
//       }
      
//       if (!projects) {
//         throw new Error('Aucun endpoint ne retourne de données valides');
//       }
      
//       console.log(`🎯 Données récupérées depuis ${workingEndpoint}:`, projects);
//       console.log(`📊 ${projects.length} projets trouvés`);
      
//       // Stocker la réponse brute pour débogage
//       setApiResponse(projects);
      
//       if (projects.length === 0) {
//         setApiStatus('📭 Table projects_project vide (0 projets)');
//         setProjectsWithUsers([]);
//         setFilteredData([]);
//         setStats({
//           total: 0,
//           approved: 0,
//           pending: 0,
//           rejected: 0,
//           draft: 0,
//           totalUsers: 0
//         });
//         setIsDemoMode(false); // Mode production mais table vide
//       } else {
//         // Transformer les données
//         const transformedData = transformProjectsData(projects);
        
//         console.log('🔧 Données transformées:', transformedData);
        
//         setProjectsWithUsers(transformedData);
//         setFilteredData(transformedData);
//         setIsDemoMode(false);
        
//         // Calculer les statistiques
//         calculateAndSetStats(transformedData);
        
//         setApiStatus(`✅ ${workingEndpoint} • ${projects.length} projets • ${transformedData.length} auteurs`);
//       }
      
//     } catch (error) {
//       console.error('❌ Erreur récupération données:', error);
//       setConnectionError(error.message);
//       setApiStatus(`❌ ${error.message}`);
      
//       // Activer le mode démo
//       activateDemoMode();
      
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ TRANSFORMATION DES DONNÉES AMÉLIORÉE
//   const transformProjectsData = (projects) => {
//     if (!Array.isArray(projects)) {
//       console.error('❌ Les données ne sont pas un tableau:', projects);
//       return [];
//     }
    
//     const usersMap = new Map();
    
//     projects.forEach((project, index) => {
//       console.log(`📝 Transformation projet ${index + 1}/${projects.length}:`, project);
      
//       // Extraire les informations de l'auteur
//       let authorInfo = {};
//       let authorName = '';
//       let authorId = null;
      
//       // Méthode 1: author est un objet
//       if (project.author && typeof project.author === 'object') {
//         authorInfo = {
//           id: project.author.id || `author_${index}`,
//           username: project.author.username || `user_${project.author.id || index}`,
//           first_name: project.author.first_name || 'Utilisateur',
//           last_name: project.author.last_name || `#${project.author.id || index}`,
//           email: project.author.email || `user${project.author.id || index}@simplon.com`,
//           is_staff: project.author.is_staff || false
//         };
//         authorName = `${authorInfo.first_name} ${authorInfo.last_name}`.trim();
//         authorId = authorInfo.id;
//       }
//       // Méthode 2: author est un ID
//       else if (project.author) {
//         authorId = project.author;
//         authorName = `Auteur ${project.author}`;
//         authorInfo = {
//           id: project.author,
//           username: `user_${project.author}`,
//           first_name: 'Auteur',
//           last_name: `#${project.author}`,
//           email: `user${project.author}@simplon.com`,
//           is_staff: false
//         };
//       }
//       // Méthode 3: Champs dénormalisés
//       else {
//         authorId = project.author_id || project.user_id || `author_${index}`;
//         authorName = project.author_name || project.author_username || `Auteur ${authorId}`;
//         authorInfo = {
//           id: authorId,
//           username: project.author_username || `user_${authorId}`,
//           first_name: project.author_first_name || 'Auteur',
//           last_name: project.author_last_name || `#${authorId}`,
//           email: project.author_email || `user${authorId}@simplon.com`,
//           is_staff: project.author_is_staff || false
//         };
//       }
      
//       // Créer l'utilisateur s'il n'existe pas
//       if (!usersMap.has(authorId)) {
//         usersMap.set(authorId, {
//           id: authorId,
//           full_name: authorName,
//           first_name: authorInfo.first_name,
//           last_name: authorInfo.last_name,
//           email: authorInfo.email,
//           username: authorInfo.username,
//           is_staff: authorInfo.is_staff,
//           projects: [],
//           projects_count: 0
//         });
//       }
      
//       const user = usersMap.get(authorId);
      
//       // Déterminer le statut
//       let status = 'draft';
//       if (project.status) status = project.status;
//       else if (project.is_approved) status = 'approved';
//       else if (project.is_pending) status = 'pending';
//       else if (project.is_rejected) status = 'rejected';
      
//       // Ajouter le projet
//       user.projects.push({
//         id: project.id || `proj_${index}`,
//         title: project.title || project.name || `Projet ${index + 1}`,
//         description: project.description || project.short_description || 'Aucune description',
//         technologies: project.technologies || project.tech_stack || project.tags || '',
//         status: status,
//         cohort: project.cohort || project.promotion || 'Non spécifiée',
//         tags: project.tags || '',
//         github_url: project.github_url || project.repository_url || '',
//         demo_url: project.demo_url || project.live_url || project.website || '',
//         image_url: project.image || project.screenshot || project.featured_image || '',
//         created_at: project.created_at || project.date_created || new Date().toISOString(),
//         updated_at: project.updated_at || project.date_updated || new Date().toISOString(),
//         author_name: authorName,
//         author_email: authorInfo.email,
//         author_username: authorInfo.username,
//         author_id: authorId,
//         is_approved: status === 'approved' || project.is_approved,
//         is_pending: status === 'pending' || project.is_pending,
//         is_rejected: status === 'rejected' || project.is_rejected,
//         days_since_creation: project.created_at ? 
//           Math.floor((new Date() - new Date(project.created_at)) / (1000 * 60 * 60 * 24)) : null
//       });
      
//       user.projects_count = user.projects.length;
//     });
    
//     const usersWithProjects = Array.from(usersMap.values());
    
//     // Trier
//     usersWithProjects.sort((a, b) => b.projects_count - a.projects_count);
//     usersWithProjects.forEach(user => {
//       user.projects.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
//     });
    
//     console.log(`👥 ${usersWithProjects.length} auteurs transformés`);
//     return usersWithProjects;
//   };

//   // ✅ CALCUL DES STATISTIQUES
//   const calculateAndSetStats = (data) => {
//     const allProjects = data.flatMap(user => user.projects || []);
    
//     const stats = {
//       total: allProjects.length,
//       approved: allProjects.filter(p => normalizeStatus(p.status) === 'approved' || p.is_approved).length,
//       pending: allProjects.filter(p => normalizeStatus(p.status) === 'pending' || p.is_pending).length,
//       rejected: allProjects.filter(p => normalizeStatus(p.status) === 'rejected').length,
//       draft: allProjects.filter(p => normalizeStatus(p.status) === 'draft').length,
//       totalUsers: data.length
//     };
    
//     setStats(stats);
//     console.log('📈 Statistiques calculées:', stats);
//   };

//   // ✅ TEST DE CONNEXION SIMPLE
//   const testDatabaseConnection = async () => {
//     try {
//       setLoading(true);
//       setApiStatus('🔍 Test de connexion à l\'API...');
      
//       const response = await fetch('http://127.0.0.1:8000/api/projects/projects/');
      
//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }
      
//       const data = await response.json();
//       const isArray = Array.isArray(data);
//       const count = isArray ? data.length : 'Object';
      
//       alert(`✅ Connexion réussie!\n\nEndpoint: http://127.0.0.1:8000/api/projects/projects/\nType: ${isArray ? 'Array' : 'Object'}\nTaille: ${count}\n\nVérifiez la console pour les détails.`);
      
//       console.log('📊 Données de test:', data);
      
//       fetchRealDataFromDatabase();
      
//     } catch (error) {
//       console.error('Test échoué:', error);
//       alert(`❌ Test échoué:\n${error.message}\n\nVérifiez:\n1. Serveur Django en cours d'exécution\n2. URL correcte\n3. CORS configuré\n4. API accessible`);
      
//       // Tester tous les endpoints
//       testAllEndpoints();
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ FILTRES
//   useEffect(() => {
//     let filtered = [...projectsWithUsers];

//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase().trim();
//       filtered = filtered.map(user => ({
//         ...user,
//         projects: user.projects?.filter(project => 
//           (project.title?.toLowerCase() || '').includes(term) ||
//           (project.description?.toLowerCase() || '').includes(term) ||
//           (project.technologies?.toLowerCase() || '').includes(term) ||
//           (project.author_name?.toLowerCase() || '').includes(term) ||
//           (project.author_email?.toLowerCase() || '').includes(term) ||
//           (user.full_name?.toLowerCase() || '').includes(term) ||
//           (user.email?.toLowerCase() || '').includes(term)
//         ) || []
//       })).filter(user => user.projects && user.projects.length > 0);
//     }

//     if (statusFilter) {
//       filtered = filtered.map(user => ({
//         ...user,
//         projects: user.projects?.filter(project => 
//           normalizeStatus(project.status) === normalizeStatus(statusFilter)
//         ) || []
//       })).filter(user => user.projects && user.projects.length > 0);
//     }

//     if (cohortFilter) {
//       filtered = filtered.map(user => ({
//         ...user,
//         projects: user.projects?.filter(project => 
//           (project.cohort?.toLowerCase() || '').includes(cohortFilter.toLowerCase())
//         ) || []
//       })).filter(user => user.projects && user.projects.length > 0);
//     }

//     if (technologyFilter) {
//       filtered = filtered.map(user => ({
//         ...user,
//         projects: user.projects?.filter(project => 
//           (project.technologies?.toLowerCase() || '').includes(technologyFilter.toLowerCase())
//         ) || []
//       })).filter(user => user.projects && user.projects.length > 0);
//     }

//     setFilteredData(filtered);
//   }, [searchTerm, statusFilter, cohortFilter, technologyFilter, projectsWithUsers]);

//   // ✅ FONCTIONS UTILITAIRES (restent les mêmes)
//   const normalizeStatus = (status) => {
//     if (!status) return '';
//     const s = status.toLowerCase();
//     if (s.includes('approv') || s.includes('valid') || s.includes('publish')) return 'approved';
//     if (s.includes('pend') || s.includes('wait')) return 'pending';
//     if (s.includes('reject') || s.includes('refus')) return 'rejected';
//     if (s.includes('draft') || s.includes('brouillon')) return 'draft';
//     return s;
//   };

//   const getStatusColor = (status) => {
//     const norm = normalizeStatus(status);
//     switch (norm) {
//       case 'approved': return 'bg-green-100 text-green-800 border border-green-200';
//       case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
//       case 'draft': return 'bg-blue-100 text-blue-800 border border-blue-200';
//       case 'rejected': return 'bg-red-100 text-red-800 border border-red-200';
//       default: return 'bg-gray-100 text-gray-800 border border-gray-200';
//     }
//   };

//   const getStatusIcon = (status) => {
//     const norm = normalizeStatus(status);
//     switch (norm) {
//       case 'approved': return 'check_circle';
//       case 'pending': return 'pending';
//       case 'draft': return 'draft';
//       case 'rejected': return 'cancel';
//       default: return 'help';
//     }
//   };

//   const getStatusText = (status) => {
//     const norm = normalizeStatus(status);
//     switch (norm) {
//       case 'approved': return '✅ Approuvé';
//       case 'pending': return '⏳ En attente';
//       case 'draft': return '📝 Brouillon';
//       case 'rejected': return '❌ Rejeté';
//       default: return status || '❓ Inconnu';
//     }
//   };

//   // ✅ MODE DÉMO
//   const activateDemoMode = () => {
//     const demoUsers = [
//       {
//         id: 1,
//         full_name: 'Jean Dupont',
//         email: 'jean.dupont@simplon.com',
//         username: 'jeandupont',
//         projects_count: 2,
//         projects: [
//           {
//             id: 101,
//             title: 'Plateforme E-commerce React/Node.js',
//             description: 'Site e-commerce complet avec panier, paiement et dashboard admin',
//             technologies: 'React, Node.js, MongoDB, Stripe',
//             status: 'approved',
//             cohort: 'Promo 2024-1',
//             tags: 'ecommerce, fullstack',
//             github_url: 'https://github.com/jeandupont/ecommerce',
//             demo_url: 'https://ecommerce-demo.simplon.com',
//             created_at: '2024-01-15T10:30:00Z',
//             author_name: 'Jean Dupont',
//             is_approved: true
//           }
//         ]
//       }
//     ];
    
//     setProjectsWithUsers(demoUsers);
//     setFilteredData(demoUsers);
//     setIsDemoMode(true);
    
//     const allDemoProjects = demoUsers.flatMap(user => user.projects);
//     setStats({
//       total: allDemoProjects.length,
//       approved: 1,
//       pending: 0,
//       rejected: 0,
//       draft: 0,
//       totalUsers: 1
//     });
    
//     setApiStatus('🎭 Mode démo activé - Données de test');
//   };

//   // ✅ AFFICHAGE DU STATUT AMÉLIORÉ
//   const renderStatusBanner = () => {
//     return (
//       <div className="mb-6">
//         {/* Bannière principale */}
//         <div className={`mb-4 rounded-xl p-4 ${
//           isDemoMode 
//             ? 'bg-blue-50 border border-blue-200' 
//             : projectsWithUsers.length > 0 
//               ? 'bg-green-50 border border-green-200' 
//               : 'bg-yellow-50 border border-yellow-200'
//         }`}>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <span className="material-symbols-outlined text-lg">
//                   {isDemoMode ? 'warning' : 
//                    projectsWithUsers.length > 0 ? 'check_circle' : 'info'}
//                 </span>
//               </div>
//               <div className="ml-3">
//                 <p className={`text-sm font-medium ${
//                   isDemoMode ? 'text-blue-700' : 
//                   projectsWithUsers.length > 0 ? 'text-green-700' : 'text-yellow-700'
//                 }`}>
//                   {isDemoMode ? '🎭 Mode démonstration' : 
//                    projectsWithUsers.length > 0 ? '✅ Connecté à la base de données' : '📭 Base de données vide'}
//                 </p>
//                 <p className={`text-xs mt-1 ${
//                   isDemoMode ? 'text-blue-600' : 
//                   projectsWithUsers.length > 0 ? 'text-green-600' : 'text-yellow-600'
//                 }`}>
//                   {isDemoMode ? 'Données de test - Serveur Django non disponible' : 
//                    projectsWithUsers.length > 0 ? 
//                      `${stats.totalUsers} auteurs • ${stats.total} projets • ${stats.approved} approuvés` : 
//                      'La table projects_project est vide'}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               {!isDemoMode && (
//                 <div className={`text-xs px-3 py-1 rounded-full font-medium ${
//                   projectsWithUsers.length > 0 ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
//                 }`}>
//                   {projectsWithUsers.length > 0 ? 'PostgreSQL' : 'Table vide'}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
        
//         {/* Informations de débogage (visible seulement en développement) */}
//         {process.env.NODE_ENV === 'development' && (
//           <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
//             <details className="group">
//               <summary className="cursor-pointer text-sm text-gray-600 font-medium flex items-center gap-2">
//                 <span className="material-symbols-outlined text-base">bug_report</span>
//                 Informations techniques
//                 <span className="material-symbols-outlined text-sm group-open:rotate-180 transition-transform">
//                   expand_more
//                 </span>
//               </summary>
//               <div className="mt-3 space-y-2">
//                 {connectionError && (
//                   <div className="text-sm text-red-600 p-2 bg-red-50 rounded">
//                     <strong>Erreur:</strong> {connectionError}
//                   </div>
//                 )}
                
//                 {apiResponse && (
//                   <div>
//                     <p className="text-sm text-gray-600 mb-1">
//                       <strong>Réponse API:</strong> {Array.isArray(apiResponse) ? `${apiResponse.length} éléments` : 'Objet'}
//                     </p>
//                     <pre className="text-xs bg-gray-100 p-2 rounded max-h-40 overflow-auto">
//                       {JSON.stringify(apiResponse, null, 2).substring(0, 500)}...
//                     </pre>
//                   </div>
//                 )}
                
//                 <div className="text-xs text-gray-500">
//                   <p><strong>Endpoints testés:</strong> {API_ENDPOINTS.join(', ')}</p>
//                   <p><strong>Statut:</strong> {apiStatus}</p>
//                   <p><strong>Mode:</strong> {isDemoMode ? 'Démo' : 'Production'}</p>
//                 </div>
//               </div>
//             </details>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // ✅ RENDU PRINCIPAL
//   if (loading && projectsWithUsers.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
//         <div className="relative">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#E30613] border-t-transparent"></div>
//           <div className="absolute inset-0 flex items-center justify-center">
//             <span className="material-symbols-outlined text-[#E30613] animate-pulse">database</span>
//           </div>
//         </div>
//         <div className="text-center">
//           <p className="text-gray-600 font-medium">{apiStatus}</p>
//           <p className="text-sm text-gray-500 mt-2">Connexion à la base de données Django...</p>
//           <button 
//             onClick={() => setLoading(false)}
//             className="mt-4 text-sm text-[#E30613] hover:underline"
//           >
//             Annuler le chargement
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {renderStatusBanner()}
      
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-[#001F3F]">
//             🚀 Gestion des Projets Simplon
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Plateforme de suivi et validation des projets des apprenants
//           </p>
//         </div>
//         <div className="flex flex-wrap gap-3">
//           <button 
//             onClick={testAllEndpoints} 
//             className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 flex items-center gap-2 transition-all hover:scale-105"
//           >
//             <span className="material-symbols-outlined">wifi_find</span>
//             Tester tous les endpoints
//           </button>
//           <button 
//             onClick={testDatabaseConnection} 
//             className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 flex items-center gap-2 transition-all hover:scale-105"
//           >
//             <span className="material-symbols-outlined">database</span>
//             Tester la connexion
//           </button>
//           <button 
//             onClick={() => setRefreshKey(prev => prev + 1)} 
//             className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#c40511] font-medium flex items-center gap-2 transition-all hover:scale-105"
//           >
//             <span className="material-symbols-outlined">refresh</span>
//             Actualiser
//           </button>
//           {isDemoMode && (
//             <button 
//               onClick={() => {
//                 setIsDemoMode(false);
//                 fetchRealDataFromDatabase();
//               }}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition-all hover:scale-105"
//             >
//               <span className="material-symbols-outlined">database</span>
//               Mode réel
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Statistiques */}
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//         <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-2xl font-bold text-[#001F3F]">{stats.total}</div>
//               <div className="text-sm text-gray-500">Total Projets</div>
//             </div>
//             <span className="material-symbols-outlined text-gray-500 text-2xl">folder</span>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
//               <div className="text-sm text-gray-500">Approuvés</div>
//             </div>
//             <span className="material-symbols-outlined text-green-500 text-2xl">check_circle</span>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
//               <div className="text-sm text-gray-500">En attente</div>
//             </div>
//             <span className="material-symbols-outlined text-yellow-500 text-2xl">pending</span>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
//               <div className="text-sm text-gray-500">Rejetés</div>
//             </div>
//             <span className="material-symbols-outlined text-red-500 text-2xl">cancel</span>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-2xl font-bold text-blue-600">{stats.draft}</div>
//               <div className="text-sm text-gray-500">Brouillons</div>
//             </div>
//             <span className="material-symbols-outlined text-blue-500 text-2xl">draft</span>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-2xl font-bold text-purple-600">{stats.totalUsers}</div>
//               <div className="text-sm text-gray-500">Auteurs</div>
//             </div>
//             <span className="material-symbols-outlined text-purple-500 text-2xl">people</span>
//           </div>
//         </div>
//       </div>

//       {/* Filtres */}
//       <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
//           <div className="lg:col-span-2 relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <span className="material-symbols-outlined text-gray-400">search</span>
//             </div>
//             <input
//               type="text"
//               placeholder="Rechercher projet, auteur, technologie..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent placeholder-gray-500"
//             />
//           </div>
          
//           <select 
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
//           >
//             <option value="">📊 Tous les statuts</option>
//             <option value="approved">✅ Approuvés</option>
//             <option value="pending">⏳ En attente</option>
//             <option value="rejected">❌ Rejetés</option>
//             <option value="draft">📝 Brouillons</option>
//           </select>
          
//           <select 
//             value={cohortFilter}
//             onChange={(e) => setCohortFilter(e.target.value)}
//             className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
//           >
//             <option value="">👥 Toutes les cohortes</option>
//             {[...new Set(projectsWithUsers.flatMap(u => u.projects?.map(p => p.cohort) || []).filter(Boolean))].sort().map(cohort => (
//               <option key={cohort} value={cohort}>{cohort}</option>
//             ))}
//           </select>
          
//           <select 
//             value={technologyFilter}
//             onChange={(e) => setTechnologyFilter(e.target.value)}
//             className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
//           >
//             <option value="">💻 Toutes les technologies</option>
//             {[...new Set(projectsWithUsers.flatMap(u => 
//               u.projects?.flatMap(p => 
//                 (p.technologies || '').split(',').map(t => t.trim()).filter(t => t)
//               ) || []
//             ))].sort().map(tech => (
//               <option key={tech} value={tech}>{tech}</option>
//             ))}
//           </select>
//         </div>
        
//         <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
//           <div className="text-sm text-gray-600">
//             <span className="font-medium text-gray-900">{filteredData.length}</span> utilisateur(s) trouvé(s)
//             {(searchTerm || statusFilter || cohortFilter || technologyFilter) && (
//               <span>
//                 {' '}sur <span className="font-medium">{projectsWithUsers.length}</span>
//                 <button 
//                   onClick={() => { 
//                     setSearchTerm(''); 
//                     setStatusFilter(''); 
//                     setCohortFilter(''); 
//                     setTechnologyFilter('');
//                   }} 
//                   className="ml-2 text-[#E30613] hover:text-[#c40511] font-medium flex items-center gap-1"
//                 >
//                   <span className="material-symbols-outlined text-base">close</span>
//                   Effacer les filtres
//                 </button>
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Liste des projets */}
//       <div className="space-y-4">
//         {filteredData.length > 0 ? (
//           filteredData.map((user) => (
//             <div key={user.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
//               <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-[#E30613] to-[#ff6b6b] rounded-full flex items-center justify-center text-white font-bold">
//                       {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-[#001F3F]">
//                         {user.full_name}
//                         {user.is_staff && (
//                           <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
//                             Admin
//                           </span>
//                         )}
//                       </h3>
//                       <p className="text-sm text-gray-600">
//                         {user.email} • {user.projects_count} projet(s)
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <span className="text-sm text-gray-500">
//                       ID: {user.id}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="divide-y divide-gray-200">
//                 {(user.projects || []).map((project) => (
//                   <div key={project.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
//                     <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
//                       <div className="flex-1">
//                         <div className="flex flex-wrap items-center gap-2 mb-3">
//                           <h4 className="font-medium text-[#001F3F]">
//                             {project.title}
//                           </h4>
//                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
//                             <span className="material-symbols-outlined text-xs mr-1">
//                               {getStatusIcon(project.status)}
//                             </span>
//                             {getStatusText(project.status)}
//                           </span>
//                           {project.cohort && (
//                             <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
//                               {project.cohort}
//                             </span>
//                           )}
//                           {project.days_since_creation && (
//                             <span className="text-xs text-gray-500">
//                               Il y a {project.days_since_creation} jours
//                             </span>
//                           )}
//                         </div>
                        
//                         <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//                           {project.description}
//                         </p>

//                         <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
//                           {project.technologies && (
//                             <div className="flex items-center space-x-1">
//                               <span className="material-symbols-outlined text-base">code</span>
//                               <span>{project.technologies}</span>
//                             </div>
//                           )}
                          
//                           {project.created_at && (
//                             <div className="flex items-center space-x-1">
//                               <span className="material-symbols-outlined text-base">calendar_today</span>
//                               <span>{new Date(project.created_at).toLocaleDateString('fr-FR')}</span>
//                             </div>
//                           )}
                          
//                           {project.github_url && (
//                             <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 hover:underline">
//                               <span className="material-symbols-outlined text-base">code</span>
//                               <span>GitHub</span>
//                             </a>
//                           )}
                          
//                           {project.demo_url && (
//                             <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-green-600 hover:text-green-800 hover:underline">
//                               <span className="material-symbols-outlined text-base">open_in_new</span>
//                               <span>Démo</span>
//                             </a>
//                           )}
//                         </div>
//                       </div>

               
// <div className="flex space-x-2">
//   <button 
//     onClick={() => navigate(`/admin/project/${project.id}`)} 
//     className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors group relative"
//     title="Voir les détails"
//   >
//     <span className="material-symbols-outlined">visibility</span>
    
//     {/* Tooltip */}
//     <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-max">
//       <div className="flex items-center gap-1">
//         <span className="material-symbols-outlined text-xs">open_in_new</span>
//         <span>Voir les détails complets</span>
//       </div>
//       <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
//         <div className="border-4 border-transparent border-t-gray-900"></div>
//       </div>
//     </div>
//   </button>
  
//   {/* Boutons d'action rapide (optionnel) */}
//   {normalizeStatus(project.status) !== 'approved' && (
//     <button 
//       onClick={() => openApprovalModal(project.id, project.title)}
//       className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors"
//       title="Approuver"
//     >
//       <span className="material-symbols-outlined">check_circle</span>
//     </button>
//   )}
  
//   {normalizeStatus(project.status) !== 'rejected' && (
//     <button 
//       onClick={() => openRejectionModal(project.id, project.title)}
//       className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
//       title="Rejeter"
//     >
//       <span className="material-symbols-outlined">cancel</span>
//     </button>
//   )}
// </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
//             <div className="text-gray-400 mb-2">
//               <span className="material-symbols-outlined text-4xl">search_off</span>
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-1">
//               {projectsWithUsers.length === 0 ? 'Aucune donnée disponible' : 'Aucun résultat trouvé'}
//             </h3>
//             <p className="text-gray-500 mb-4">
//               {projectsWithUsers.length === 0 
//                 ? 'La base de données est vide ou inaccessible.' 
//                 : 'Aucun projet ne correspond à vos critères.'}
//             </p>
//             <div className="flex flex-wrap justify-center gap-3">
//               <button 
//                 onClick={testDatabaseConnection} 
//                 className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#c40511] font-medium flex items-center gap-2"
//               >
//                 <span className="material-symbols-outlined">database</span>
//                 Tester la connexion
//               </button>
//               {isDemoMode && (
//                 <button 
//                   onClick={activateDemoMode} 
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
//                 >
//                   <span className="material-symbols-outlined">visibility</span>
//                   Mode démo
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProjectManagement;


// // src/components/admin/ProjectManagement.jsx - VERSION CORRIGÉE
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const ProjectManagement = () => {
//   const navigate = useNavigate();
//   const [projectsWithUsers, setProjectsWithUsers] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [cohortFilter, setCohortFilter] = useState('');
//   const [technologyFilter, setTechnologyFilter] = useState('');
//   const [isDemoMode, setIsDemoMode] = useState(false);
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [apiStatus, setApiStatus] = useState('🚀 Initialisation...');
//   const [apiResponse, setApiResponse] = useState(null);
//   const [connectionError, setConnectionError] = useState(null);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [actionMessage, setActionMessage] = useState('');
  
//   const [stats, setStats] = useState({
//     total: 0,
//     approved: 0,
//     pending: 0,
//     rejected: 0,
//     draft: 0,
//     totalUsers: 0
//   });
  
//   // États pour les modales
//   const [approvalModal, setApprovalModal] = useState({
//     open: false,
//     projectId: null,
//     projectTitle: '',
//     criteria: '✅ Projet bien structuré\n✅ Code propre et documenté\n✅ Fonctionnalités complètes\n✅ Bonnes pratiques respectées'
//   });
  
//   const [rejectionModal, setRejectionModal] = useState({
//     open: false,
//     projectId: null,
//     projectTitle: '',
//     criteria: '❌ Documentation insuffisante\n❌ Code non optimisé\n❌ Tests manquants\n❌ UI/UX à améliorer'
//   });

//   const API_ENDPOINTS = [
//     'http://127.0.0.1:8000/api/projects/projects/',
//     'http://127.0.0.1:8000/api/projects/',
//     'http://localhost:8000/api/projects/projects/',
//     'http://localhost:8000/api/projects/'
//   ];

//   useEffect(() => {
//     fetchRealDataFromDatabase();
//   }, [refreshKey]);

//   // ✅ FONCTIONS POUR LES MODALES D'APPROBATION/REJET
//   const openApprovalModal = (projectId, projectTitle) => {
//     setApprovalModal({
//       open: true,
//       projectId,
//       projectTitle,
//       criteria: `✅ Projet "${projectTitle}"\n\nCritères d'approbation:\n• Code propre et bien documenté\n• Fonctionnalités complètes\n• Bonnes pratiques respectées\n• Documentation adéquate\n• Tests fonctionnels\n\nCommentaires supplémentaires:`
//     });
//   };

//   const openRejectionModal = (projectId, projectTitle) => {
//     setRejectionModal({
//       open: true,
//       projectId,
//       projectTitle,
//       criteria: `❌ Projet "${projectTitle}"\n\nMotifs de rejet:\n• Documentation insuffisante\n• Code non optimisé\n• Tests manquants\n• UI/UX à améliorer\n• Fonctionnalités incomplètes\n\nCommentaires détaillés:`
//     });
//   };

//   const closeApprovalModal = () => {
//     setApprovalModal({ open: false, projectId: null, projectTitle: '', criteria: '' });
//     setActionMessage('');
//   };

//   const closeRejectionModal = () => {
//     setRejectionModal({ open: false, projectId: null, projectTitle: '', criteria: '' });
//     setActionMessage('');
//   };

//   // ✅ APPROUVER UN PROJET DIRECTEMENT
//   const handleApproveProject = async () => {
//     if (!approvalModal.projectId) return;
    
//     setActionLoading(true);
//     setActionMessage('');
    
//     try {
//       if (isDemoMode) {
//         // Mode démo: simuler l'approbation
//         setProjectsWithUsers(prev => 
//           prev.map(user => ({
//             ...user,
//             projects: user.projects?.map(project => 
//               project.id === approvalModal.projectId 
//                 ? { 
//                     ...project, 
//                     status: 'approved',
//                     is_approved: true,
//                     is_pending: false,
//                     is_rejected: false 
//                   }
//                 : project
//             ) || []
//           }))
//         );
        
//         // Mettre à jour les statistiques
//         calculateAndSetStats(projectsWithUsers.map(user => ({
//           ...user,
//           projects: user.projects?.map(project => 
//             project.id === approvalModal.projectId 
//               ? { ...project, status: 'approved' }
//               : project
//           ) || []
//         })));
        
//         setActionMessage(`✅ Projet "${approvalModal.projectTitle}" approuvé (mode démo)`);
        
//         // Fermer la modale après un délai
//         setTimeout(() => {
//           closeApprovalModal();
//           setActionMessage('');
//         }, 2000);
//       } else {
//         // Mode réel: appel API
//         const token = localStorage.getItem('access_token');
//         const headers = { 'Content-Type': 'application/json' };
        
//         if (token) headers['Authorization'] = `Bearer ${token}`;
        
//         const response = await fetch(`http://127.0.0.1:8000/api/projects/${approvalModal.projectId}/`, {
//           method: 'PATCH',
//           headers,
//           body: JSON.stringify({ 
//             status: 'approved',
//             is_approved: true,
//             is_pending: false,
//             approval_notes: approvalModal.criteria,
//             validated_by: 'Administrateur',
//             validation_date: new Date().toISOString()
//           })
//         });
        
//         if (response.ok) {
//           // Actualiser les données
//           fetchRealDataFromDatabase();
//           setActionMessage(`✅ Projet "${approvalModal.projectTitle}" approuvé avec succès !`);
          
//           // Fermer la modale
//           setTimeout(() => {
//             closeApprovalModal();
//             setActionMessage('');
//           }, 2000);
//         } else {
//           throw new Error(`Erreur ${response.status}`);
//         }
//       }
//     } catch (error) {
//       console.error('❌ Erreur approbation:', error);
//       setActionMessage(`❌ Erreur: ${error.message}`);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // ✅ REJETER UN PROJET DIRECTEMENT
//   const handleRejectProject = async () => {
//     if (!rejectionModal.projectId) return;
    
//     setActionLoading(true);
//     setActionMessage('');
    
//     try {
//       if (isDemoMode) {
//         // Mode démo: simuler le rejet
//         setProjectsWithUsers(prev => 
//           prev.map(user => ({
//             ...user,
//             projects: user.projects?.map(project => 
//               project.id === rejectionModal.projectId 
//                 ? { 
//                     ...project, 
//                     status: 'rejected',
//                     is_approved: false,
//                     is_pending: false,
//                     is_rejected: true 
//                   }
//                 : project
//             ) || []
//           }))
//         );
        
//         // Mettre à jour les statistiques
//         calculateAndSetStats(projectsWithUsers.map(user => ({
//           ...user,
//           projects: user.projects?.map(project => 
//             project.id === rejectionModal.projectId 
//               ? { ...project, status: 'rejected' }
//               : project
//           ) || []
//         })));
        
//         setActionMessage(`❌ Projet "${rejectionModal.projectTitle}" rejeté (mode démo)`);
        
//         // Fermer la modale
//         setTimeout(() => {
//           closeRejectionModal();
//           setActionMessage('');
//         }, 2000);
//       } else {
//         // Mode réel: appel API
//         const token = localStorage.getItem('access_token');
//         const headers = { 'Content-Type': 'application/json' };
        
//         if (token) headers['Authorization'] = `Bearer ${token}`;
        
//         const response = await fetch(`http://127.0.0.1:8000/api/projects/${rejectionModal.projectId}/`, {
//           method: 'PATCH',
//           headers,
//           body: JSON.stringify({ 
//             status: 'rejected',
//             is_approved: false,
//             is_pending: false,
//             is_rejected: true,
//             rejection_reasons: rejectionModal.criteria,
//             rejected_by: 'Administrateur',
//             rejection_date: new Date().toISOString()
//           })
//         });
        
//         if (response.ok) {
//           // Actualiser les données
//           fetchRealDataFromDatabase();
//           setActionMessage(`❌ Projet "${rejectionModal.projectTitle}" rejeté avec succès`);
          
//           // Fermer la modale
//           setTimeout(() => {
//             closeRejectionModal();
//             setActionMessage('');
//           }, 2000);
//         } else {
//           throw new Error(`Erreur ${response.status}`);
//         }
//       }
//     } catch (error) {
//       console.error('❌ Erreur rejet:', error);
//       setActionMessage(`❌ Erreur: ${error.message}`);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // ✅ TESTER TOUS LES ENDPOINTS
//   const testAllEndpoints = async () => {
//     setLoading(true);
//     setApiStatus('🔍 Test de tous les endpoints...');
    
//     const results = [];
    
//     for (const endpoint of API_ENDPOINTS) {
//       try {
//         console.log(`🔍 Test de: ${endpoint}`);
//         const startTime = Date.now();
//         const response = await fetch(endpoint);
//         const endTime = Date.now();
        
//         if (response.ok) {
//           const data = await response.json();
//           results.push({
//             endpoint,
//             status: '✅ SUCCÈS',
//             time: endTime - startTime + 'ms',
//             dataType: Array.isArray(data) ? `Array[${data.length}]` : typeof data,
//             dataPreview: JSON.stringify(data).substring(0, 100) + '...'
//           });
          
//           if (Array.isArray(data) && data.length > 0) {
//             console.log(`🎯 Données trouvées sur ${endpoint}:`, data);
//             setApiResponse(data);
//           }
//         } else {
//           results.push({
//             endpoint,
//             status: `❌ ${response.status} ${response.statusText}`,
//             time: endTime - startTime + 'ms',
//             dataType: 'Erreur HTTP',
//             dataPreview: ''
//           });
//         }
//       } catch (error) {
//         results.push({
//           endpoint,
//           status: `❌ ${error.message}`,
//           time: 'N/A',
//           dataType: 'Erreur réseau',
//           dataPreview: ''
//         });
//       }
//     }
    
//     console.table(results);
    
//     const successCount = results.filter(r => r.status.includes('✅')).length;
//     const summary = results.map(r => `${r.endpoint}: ${r.status}`).join('\n');
    
//     alert(`Résultats des tests:\n\n${summary}\n\n✅ ${successCount}/${API_ENDPOINTS.length} endpoints fonctionnels`);
    
//     setApiStatus(`Test terminé: ${successCount}/${API_ENDPOINTS.length} OK`);
//     setLoading(false);
//   };

//   // ✅ FONCTION PRINCIPALE
//   const fetchRealDataFromDatabase = async () => {
//     try {
//       setLoading(true);
//       setConnectionError(null);
//       setApiResponse(null);
//       setApiStatus('🔄 Tentative de connexion à l\'API Django...');
      
//       let projects = null;
//       let workingEndpoint = '';
      
//       for (const endpoint of API_ENDPOINTS) {
//         try {
//           console.log(`🔍 Tentative sur: ${endpoint}`);
//           const response = await fetch(endpoint);
          
//           if (response.ok) {
//             const data = await response.json();
//             console.log(`✅ Réponse de ${endpoint}:`, data);
            
//             if (Array.isArray(data)) {
//               projects = data;
//               workingEndpoint = endpoint;
//               break;
//             } else if (data && typeof data === 'object') {
//               if (Array.isArray(data.results)) {
//                 projects = data.results;
//                 workingEndpoint = endpoint;
//                 break;
//               } else if (Array.isArray(data.projects)) {
//                 projects = data.projects;
//                 workingEndpoint = endpoint;
//                 break;
//               } else {
//                 projects = Object.values(data);
//                 workingEndpoint = endpoint;
//                 break;
//               }
//             }
//           }
//         } catch (err) {
//           console.log(`❌ ${endpoint}: ${err.message}`);
//         }
//       }
      
//       if (!projects) {
//         throw new Error('Aucun endpoint ne retourne de données valides');
//       }
      
//       console.log(`🎯 Données récupérées depuis ${workingEndpoint}:`, projects);
//       console.log(`📊 ${projects.length} projets trouvés`);
      
//       setApiResponse(projects);
      
//       if (projects.length === 0) {
//         setApiStatus('📭 Table projects_project vide (0 projets)');
//         setProjectsWithUsers([]);
//         setFilteredData([]);
//         setStats({
//           total: 0,
//           approved: 0,
//           pending: 0,
//           rejected: 0,
//           draft: 0,
//           totalUsers: 0
//         });
//         setIsDemoMode(false);
//       } else {
//         const transformedData = transformProjectsData(projects);
        
//         console.log('🔧 Données transformées:', transformedData);
        
//         setProjectsWithUsers(transformedData);
//         setFilteredData(transformedData);
//         setIsDemoMode(false);
        
//         calculateAndSetStats(transformedData);
        
//         setApiStatus(`✅ ${workingEndpoint} • ${projects.length} projets • ${transformedData.length} auteurs`);
//       }
      
//     } catch (error) {
//       console.error('❌ Erreur récupération données:', error);
//       setConnectionError(error.message);
//       setApiStatus(`❌ ${error.message}`);
      
//       activateDemoMode();
      
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ TRANSFORMATION DES DONNÉES
//   const transformProjectsData = (projects) => {
//     if (!Array.isArray(projects)) {
//       console.error('❌ Les données ne sont pas un tableau:', projects);
//       return [];
//     }
    
//     const usersMap = new Map();
    
//     projects.forEach((project, index) => {
//       console.log(`📝 Transformation projet ${index + 1}/${projects.length}:`, project);
      
//       let authorInfo = {};
//       let authorName = '';
//       let authorId = null;
      
//       if (project.author && typeof project.author === 'object') {
//         authorInfo = {
//           id: project.author.id || `author_${index}`,
//           username: project.author.username || `user_${project.author.id || index}`,
//           first_name: project.author.first_name || 'Utilisateur',
//           last_name: project.author.last_name || `#${project.author.id || index}`,
//           email: project.author.email || `user${project.author.id || index}@simplon.com`,
//           is_staff: project.author.is_staff || false
//         };
//         authorName = `${authorInfo.first_name} ${authorInfo.last_name}`.trim();
//         authorId = authorInfo.id;
//       }
//       else if (project.author) {
//         authorId = project.author;
//         authorName = `Auteur ${project.author}`;
//         authorInfo = {
//           id: project.author,
//           username: `user_${project.author}`,
//           first_name: 'Auteur',
//           last_name: `#${project.author}`,
//           email: `user${project.author}@simplon.com`,
//           is_staff: false
//         };
//       }
//       else {
//         authorId = project.author_id || project.user_id || `author_${index}`;
//         authorName = project.author_name || project.author_username || `Auteur ${authorId}`;
//         authorInfo = {
//           id: authorId,
//           username: project.author_username || `user_${authorId}`,
//           first_name: project.author_first_name || 'Auteur',
//           last_name: project.author_last_name || `#${authorId}`,
//           email: project.author_email || `user${authorId}@simplon.com`,
//           is_staff: project.author_is_staff || false
//         };
//       }
      
//       if (!usersMap.has(authorId)) {
//         usersMap.set(authorId, {
//           id: authorId,
//           full_name: authorName,
//           first_name: authorInfo.first_name,
//           last_name: authorInfo.last_name,
//           email: authorInfo.email,
//           username: authorInfo.username,
//           is_staff: authorInfo.is_staff,
//           projects: [],
//           projects_count: 0
//         });
//       }
      
//       const user = usersMap.get(authorId);
      
//       let status = 'draft';
//       if (project.status) status = project.status;
//       else if (project.is_approved) status = 'approved';
//       else if (project.is_pending) status = 'pending';
//       else if (project.is_rejected) status = 'rejected';
      
//       user.projects.push({
//         id: project.id || `proj_${index}`,
//         title: project.title || project.name || `Projet ${index + 1}`,
//         description: project.description || project.short_description || 'Aucune description',
//         technologies: project.technologies || project.tech_stack || project.tags || '',
//         status: status,
//         cohort: project.cohort || project.promotion || 'Non spécifiée',
//         tags: project.tags || '',
//         github_url: project.github_url || project.repository_url || '',
//         demo_url: project.demo_url || project.live_url || project.website || '',
//         image_url: project.image || project.screenshot || project.featured_image || '',
//         created_at: project.created_at || project.date_created || new Date().toISOString(),
//         updated_at: project.updated_at || project.date_updated || new Date().toISOString(),
//         author_name: authorName,
//         author_email: authorInfo.email,
//         author_username: authorInfo.username,
//         author_id: authorId,
//         is_approved: status === 'approved' || project.is_approved,
//         is_pending: status === 'pending' || project.is_pending,
//         is_rejected: status === 'rejected' || project.is_rejected,
//         days_since_creation: project.created_at ? 
//           Math.floor((new Date() - new Date(project.created_at)) / (1000 * 60 * 60 * 24)) : null
//       });
      
//       user.projects_count = user.projects.length;
//     });
    
//     const usersWithProjects = Array.from(usersMap.values());
    
//     usersWithProjects.sort((a, b) => b.projects_count - a.projects_count);
//     usersWithProjects.forEach(user => {
//       user.projects.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
//     });
    
//     console.log(`👥 ${usersWithProjects.length} auteurs transformés`);
//     return usersWithProjects;
//   };

//   // ✅ CALCUL DES STATISTIQUES
//   const calculateAndSetStats = (data) => {
//     const allProjects = data.flatMap(user => user.projects || []);
    
//     const stats = {
//       total: allProjects.length,
//       approved: allProjects.filter(p => normalizeStatus(p.status) === 'approved' || p.is_approved).length,
//       pending: allProjects.filter(p => normalizeStatus(p.status) === 'pending' || p.is_pending).length,
//       rejected: allProjects.filter(p => normalizeStatus(p.status) === 'rejected').length,
//       draft: allProjects.filter(p => normalizeStatus(p.status) === 'draft').length,
//       totalUsers: data.length
//     };
    
//     setStats(stats);
//     console.log('📈 Statistiques calculées:', stats);
//   };

//   // ✅ TEST DE CONNEXION
//   const testDatabaseConnection = async () => {
//     try {
//       setLoading(true);
//       setApiStatus('🔍 Test de connexion à l\'API...');
      
//       const response = await fetch('http://127.0.0.1:8000/api/projects/projects/');
      
//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }
      
//       const data = await response.json();
//       const isArray = Array.isArray(data);
//       const count = isArray ? data.length : 'Object';
      
//       alert(`✅ Connexion réussie!\n\nEndpoint: http://127.0.0.1:8000/api/projects/projects/\nType: ${isArray ? 'Array' : 'Object'}\nTaille: ${count}\n\nVérifiez la console pour les détails.`);
      
//       console.log('📊 Données de test:', data);
      
//       fetchRealDataFromDatabase();
      
//     } catch (error) {
//       console.error('Test échoué:', error);
//       alert(`❌ Test échoué:\n${error.message}\n\nVérifiez:\n1. Serveur Django en cours d'exécution\n2. URL correcte\n3. CORS configuré\n4. API accessible`);
      
//       testAllEndpoints();
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ FILTRES
//   useEffect(() => {
//     let filtered = [...projectsWithUsers];

//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase().trim();
//       filtered = filtered.map(user => ({
//         ...user,
//         projects: user.projects?.filter(project => 
//           (project.title?.toLowerCase() || '').includes(term) ||
//           (project.description?.toLowerCase() || '').includes(term) ||
//           (project.technologies?.toLowerCase() || '').includes(term) ||
//           (project.author_name?.toLowerCase() || '').includes(term) ||
//           (project.author_email?.toLowerCase() || '').includes(term) ||
//           (user.full_name?.toLowerCase() || '').includes(term) ||
//           (user.email?.toLowerCase() || '').includes(term)
//         ) || []
//       })).filter(user => user.projects && user.projects.length > 0);
//     }

//     if (statusFilter) {
//       filtered = filtered.map(user => ({
//         ...user,
//         projects: user.projects?.filter(project => 
//           normalizeStatus(project.status) === normalizeStatus(statusFilter)
//         ) || []
//       })).filter(user => user.projects && user.projects.length > 0);
//     }

//     if (cohortFilter) {
//       filtered = filtered.map(user => ({
//         ...user,
//         projects: user.projects?.filter(project => 
//           (project.cohort?.toLowerCase() || '').includes(cohortFilter.toLowerCase())
//         ) || []
//       })).filter(user => user.projects && user.projects.length > 0);
//     }

//     if (technologyFilter) {
//       filtered = filtered.map(user => ({
//         ...user,
//         projects: user.projects?.filter(project => 
//           (project.technologies?.toLowerCase() || '').includes(technologyFilter.toLowerCase())
//         ) || []
//       })).filter(user => user.projects && user.projects.length > 0);
//     }

//     setFilteredData(filtered);
//   }, [searchTerm, statusFilter, cohortFilter, technologyFilter, projectsWithUsers]);

//   // ✅ FONCTIONS UTILITAIRES
//   const normalizeStatus = (status) => {
//     if (!status) return '';
//     const s = status.toLowerCase();
//     if (s.includes('approv') || s.includes('valid') || s.includes('publish')) return 'approved';
//     if (s.includes('pend') || s.includes('wait')) return 'pending';
//     if (s.includes('reject') || s.includes('refus')) return 'rejected';
//     if (s.includes('draft') || s.includes('brouillon')) return 'draft';
//     return s;
//   };

//   const getStatusColor = (status) => {
//     const norm = normalizeStatus(status);
//     switch (norm) {
//       case 'approved': return 'bg-green-100 text-green-800 border border-green-200';
//       case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
//       case 'draft': return 'bg-blue-100 text-blue-800 border border-blue-200';
//       case 'rejected': return 'bg-red-100 text-red-800 border border-red-200';
//       default: return 'bg-gray-100 text-gray-800 border border-gray-200';
//     }
//   };

//   const getStatusIcon = (status) => {
//     const norm = normalizeStatus(status);
//     switch (norm) {
//       case 'approved': return 'check_circle';
//       case 'pending': return 'pending';
//       case 'draft': return 'draft';
//       case 'rejected': return 'cancel';
//       default: return 'help';
//     }
//   };

//   const getStatusText = (status) => {
//     const norm = normalizeStatus(status);
//     switch (norm) {
//       case 'approved': return '✅ Approuvé';
//       case 'pending': return '⏳ En attente';
//       case 'draft': return '📝 Brouillon';
//       case 'rejected': return '❌ Rejeté';
//       default: return status || '❓ Inconnu';
//     }
//   };

//   // ✅ MODE DÉMO
//   const activateDemoMode = () => {
//     const demoUsers = [
//       {
//         id: 1,
//         full_name: 'Jean Dupont',
//         email: 'jean.dupont@simplon.com',
//         username: 'jeandupont',
//         projects_count: 2,
//         projects: [
//           {
//             id: 101,
//             title: 'Plateforme E-commerce React/Node.js',
//             description: 'Site e-commerce complet avec panier, paiement et dashboard admin',
//             technologies: 'React, Node.js, MongoDB, Stripe',
//             status: 'pending',
//             cohort: 'Promo 2024-1',
//             tags: 'ecommerce, fullstack',
//             github_url: 'https://github.com/jeandupont/ecommerce',
//             demo_url: 'https://ecommerce-demo.simplon.com',
//             created_at: '2024-01-15T10:30:00Z',
//             author_name: 'Jean Dupont',
//             is_approved: false,
//             is_pending: true,
//             is_rejected: false
//           },
//           {
//             id: 102,
//             title: 'Application Mobile de Fitness',
//             description: 'App de suivi d\'entraînement avec IA',
//             technologies: 'React Native, Firebase, TensorFlow',
//             status: 'draft',
//             cohort: 'Promo 2024-1',
//             tags: 'mobile, fitness, ai',
//             github_url: 'https://github.com/jeandupont/fitness-app',
//             demo_url: '',
//             created_at: '2024-02-20T14:30:00Z',
//             author_name: 'Jean Dupont',
//             is_approved: false,
//             is_pending: false,
//             is_rejected: false
//           }
//         ]
//       },
//       {
//         id: 2,
//         full_name: 'Marie Lambert',
//         email: 'marie.lambert@simplon.com',
//         username: 'marielambert',
//         projects_count: 1,
//         projects: [
//           {
//             id: 103,
//             title: 'Système de Réservation de Salles',
//             description: 'Plateforme de réservation pour espaces de coworking',
//             technologies: 'Vue.js, Django, PostgreSQL',
//             status: 'approved',
//             cohort: 'Promo 2023-2',
//             tags: 'booking, coworking',
//             github_url: 'https://github.com/marielambert/booking-system',
//             demo_url: 'https://booking-demo.simplon.com',
//             created_at: '2023-11-10T09:15:00Z',
//             author_name: 'Marie Lambert',
//             is_approved: true,
//             is_pending: false,
//             is_rejected: false
//           }
//         ]
//       }
//     ];
    
//     setProjectsWithUsers(demoUsers);
//     setFilteredData(demoUsers);
//     setIsDemoMode(true);
    
//     const allDemoProjects = demoUsers.flatMap(user => user.projects);
//     setStats({
//       total: allDemoProjects.length,
//       approved: 1,
//       pending: 1,
//       rejected: 0,
//       draft: 1,
//       totalUsers: 2
//     });
    
//     setApiStatus('🎭 Mode démo activé - Données de test');
//   };

//   // ✅ AFFICHAGE DU STATUT
//   const renderStatusBanner = () => {
//     return (
//       <div className="mb-6">
//         <div className={`mb-4 rounded-xl p-4 ${
//           isDemoMode 
//             ? 'bg-blue-50 border border-blue-200' 
//             : projectsWithUsers.length > 0 
//               ? 'bg-green-50 border border-green-200' 
//               : 'bg-yellow-50 border border-yellow-200'
//         }`}>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <span className="material-symbols-outlined text-lg">
//                   {isDemoMode ? 'warning' : 
//                    projectsWithUsers.length > 0 ? 'check_circle' : 'info'}
//                 </span>
//               </div>
//               <div className="ml-3">
//                 <p className={`text-sm font-medium ${
//                   isDemoMode ? 'text-blue-700' : 
//                   projectsWithUsers.length > 0 ? 'text-green-700' : 'text-yellow-700'
//                 }`}>
//                   {isDemoMode ? '🎭 Mode démonstration' : 
//                    projectsWithUsers.length > 0 ? '✅ Connecté à la base de données' : '📭 Base de données vide'}
//                 </p>
//                 <p className={`text-xs mt-1 ${
//                   isDemoMode ? 'text-blue-600' : 
//                   projectsWithUsers.length > 0 ? 'text-green-600' : 'text-yellow-600'
//                 }`}>
//                   {isDemoMode ? 'Données de test - Serveur Django non disponible' : 
//                    projectsWithUsers.length > 0 ? 
//                      `${stats.totalUsers} auteurs • ${stats.total} projets • ${stats.approved} approuvés` : 
//                      'La table projects_project est vide'}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               {!isDemoMode && (
//                 <div className={`text-xs px-3 py-1 rounded-full font-medium ${
//                   projectsWithUsers.length > 0 ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
//                 }`}>
//                   {projectsWithUsers.length > 0 ? 'PostgreSQL' : 'Table vide'}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
        
//         {process.env.NODE_ENV === 'development' && (
//           <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
//             <details className="group">
//               <summary className="cursor-pointer text-sm text-gray-600 font-medium flex items-center gap-2">
//                 <span className="material-symbols-outlined text-base">bug_report</span>
//                 Informations techniques
//                 <span className="material-symbols-outlined text-sm group-open:rotate-180 transition-transform">
//                   expand_more
//                 </span>
//               </summary>
//               <div className="mt-3 space-y-2">
//                 {connectionError && (
//                   <div className="text-sm text-red-600 p-2 bg-red-50 rounded">
//                     <strong>Erreur:</strong> {connectionError}
//                   </div>
//                 )}
                
//                 {apiResponse && (
//                   <div>
//                     <p className="text-sm text-gray-600 mb-1">
//                       <strong>Réponse API:</strong> {Array.isArray(apiResponse) ? `${apiResponse.length} éléments` : 'Objet'}
//                     </p>
//                     <pre className="text-xs bg-gray-100 p-2 rounded max-h-40 overflow-auto">
//                       {JSON.stringify(apiResponse, null, 2).substring(0, 500)}...
//                     </pre>
//                   </div>
//                 )}
                
//                 <div className="text-xs text-gray-500">
//                   <p><strong>Endpoints testés:</strong> {API_ENDPOINTS.join(', ')}</p>
//                   <p><strong>Statut:</strong> {apiStatus}</p>
//                   <p><strong>Mode:</strong> {isDemoMode ? 'Démo' : 'Production'}</p>
//                 </div>
//               </div>
//             </details>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // ✅ RENDU PRINCIPAL
//   if (loading && projectsWithUsers.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
//         <div className="relative">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#E30613] border-t-transparent"></div>
//           <div className="absolute inset-0 flex items-center justify-center">
//             <span className="material-symbols-outlined text-[#E30613] animate-pulse">database</span>
//           </div>
//         </div>
//         <div className="text-center">
//           <p className="text-gray-600 font-medium">{apiStatus}</p>
//           <p className="text-sm text-gray-500 mt-2">Connexion à la base de données Django...</p>
//           <button 
//             onClick={() => setLoading(false)}
//             className="mt-4 text-sm text-[#E30613] hover:underline"
//           >
//             Annuler le chargement
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {renderStatusBanner()}
      
//       {/* Message d'action */}
//       {actionMessage && (
//         <div className={`p-4 rounded-lg ${actionMessage.includes('✅') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <span className="material-symbols-outlined text-lg">
//                 {actionMessage.includes('✅') ? 'check_circle' : 'error'}
//               </span>
//               <div>
//                 <p className={`font-medium ${actionMessage.includes('✅') ? 'text-green-800' : 'text-red-800'}`}>
//                   {actionMessage}
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={() => setActionMessage('')}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <span className="material-symbols-outlined">close</span>
//             </button>
//           </div>
//         </div>
//       )}
      
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-[#001F3F]">
//             🚀 Gestion des Projets Simplon
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Plateforme de suivi et validation des projets des apprenants
//           </p>
//         </div>
//         <div className="flex flex-wrap gap-3">
//           <button 
//             onClick={testAllEndpoints} 
//             className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 flex items-center gap-2 transition-all hover:scale-105"
//           >
//             <span className="material-symbols-outlined">wifi_find</span>
//             Tester tous les endpoints
//           </button>
//           <button 
//             onClick={testDatabaseConnection} 
//             className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 flex items-center gap-2 transition-all hover:scale-105"
//           >
//             <span className="material-symbols-outlined">database</span>
//             Tester la connexion
//           </button>
//           <button 
//             onClick={() => setRefreshKey(prev => prev + 1)} 
//             className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#c40511] font-medium flex items-center gap-2 transition-all hover:scale-105"
//           >
//             <span className="material-symbols-outlined">refresh</span>
//             Actualiser
//           </button>
//           {isDemoMode && (
//             <button 
//               onClick={() => {
//                 setIsDemoMode(false);
//                 fetchRealDataFromDatabase();
//               }}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition-all hover:scale-105"
//             >
//               <span className="material-symbols-outlined">database</span>
//               Mode réel
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Statistiques */}
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//         <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-2xl font-bold text-[#001F3F]">{stats.total}</div>
//               <div className="text-sm text-gray-500">Total Projets</div>
//             </div>
//             <span className="material-symbols-outlined text-gray-500 text-2xl">folder</span>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
//               <div className="text-sm text-gray-500">Approuvés</div>
//             </div>
//             <span className="material-symbols-outlined text-green-500 text-2xl">check_circle</span>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
//               <div className="text-sm text-gray-500">En attente</div>
//             </div>
//             <span className="material-symbols-outlined text-yellow-500 text-2xl">pending</span>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
//               <div className="text-sm text-gray-500">Rejetés</div>
//             </div>
//             <span className="material-symbols-outlined text-red-500 text-2xl">cancel</span>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-2xl font-bold text-blue-600">{stats.draft}</div>
//               <div className="text-sm text-gray-500">Brouillons</div>
//             </div>
//             <span className="material-symbols-outlined text-blue-500 text-2xl">draft</span>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <div className="text-2xl font-bold text-purple-600">{stats.totalUsers}</div>
//               <div className="text-sm text-gray-500">Auteurs</div>
//             </div>
//             <span className="material-symbols-outlined text-purple-500 text-2xl">people</span>
//           </div>
//         </div>
//       </div>

//       {/* Filtres */}
//       <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
//           <div className="lg:col-span-2 relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <span className="material-symbols-outlined text-gray-400">search</span>
//             </div>
//             <input
//               type="text"
//               placeholder="Rechercher projet, auteur, technologie..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent placeholder-gray-500"
//             />
//           </div>
          
//           <select 
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
//           >
//             <option value="">📊 Tous les statuts</option>
//             <option value="approved">✅ Approuvés</option>
//             <option value="pending">⏳ En attente</option>
//             <option value="rejected">❌ Rejetés</option>
//             <option value="draft">📝 Brouillons</option>
//           </select>
          
//           <select 
//             value={cohortFilter}
//             onChange={(e) => setCohortFilter(e.target.value)}
//             className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
//           >
//             <option value="">👥 Toutes les cohortes</option>
//             {[...new Set(projectsWithUsers.flatMap(u => u.projects?.map(p => p.cohort) || []).filter(Boolean))].sort().map(cohort => (
//               <option key={cohort} value={cohort}>{cohort}</option>
//             ))}
//           </select>
          
//           <select 
//             value={technologyFilter}
//             onChange={(e) => setTechnologyFilter(e.target.value)}
//             className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
//           >
//             <option value="">💻 Toutes les technologies</option>
//             {[...new Set(projectsWithUsers.flatMap(u => 
//               u.projects?.flatMap(p => 
//                 (p.technologies || '').split(',').map(t => t.trim()).filter(t => t)
//               ) || []
//             ))].sort().map(tech => (
//               <option key={tech} value={tech}>{tech}</option>
//             ))}
//           </select>
//         </div>
        
//         <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
//           <div className="text-sm text-gray-600">
//             <span className="font-medium text-gray-900">{filteredData.length}</span> utilisateur(s) trouvé(s)
//             {(searchTerm || statusFilter || cohortFilter || technologyFilter) && (
//               <span>
//                 {' '}sur <span className="font-medium">{projectsWithUsers.length}</span>
//                 <button 
//                   onClick={() => { 
//                     setSearchTerm(''); 
//                     setStatusFilter(''); 
//                     setCohortFilter(''); 
//                     setTechnologyFilter('');
//                   }} 
//                   className="ml-2 text-[#E30613] hover:text-[#c40511] font-medium flex items-center gap-1"
//                 >
//                   <span className="material-symbols-outlined text-base">close</span>
//                   Effacer les filtres
//                 </button>
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Liste des projets */}
//       <div className="space-y-4">
//         {filteredData.length > 0 ? (
//           filteredData.map((user) => (
//             <div key={user.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
//               <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 bg-gradient-to-br from-[#E30613] to-[#ff6b6b] rounded-full flex items-center justify-center text-white font-bold">
//                       {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-[#001F3F]">
//                         {user.full_name}
//                         {user.is_staff && (
//                           <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
//                             Admin
//                           </span>
//                         )}
//                       </h3>
//                       <p className="text-sm text-gray-600">
//                         {user.email} • {user.projects_count} projet(s)
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <span className="text-sm text-gray-500">
//                       ID: {user.id}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="divide-y divide-gray-200">
//                 {(user.projects || []).map((project) => (
//                   <div key={project.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
//                     <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
//                       <div className="flex-1">
//                         <div className="flex flex-wrap items-center gap-2 mb-3">
//                           <h4 className="font-medium text-[#001F3F]">
//                             {project.title}
//                           </h4>
//                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
//                             <span className="material-symbols-outlined text-xs mr-1">
//                               {getStatusIcon(project.status)}
//                             </span>
//                             {getStatusText(project.status)}
//                           </span>
//                           {project.cohort && (
//                             <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
//                               {project.cohort}
//                             </span>
//                           )}
//                           {project.days_since_creation && (
//                             <span className="text-xs text-gray-500">
//                               Il y a {project.days_since_creation} jours
//                             </span>
//                           )}
//                         </div>
                        
//                         <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//                           {project.description}
//                         </p>

//                         <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
//                           {project.technologies && (
//                             <div className="flex items-center space-x-1">
//                               <span className="material-symbols-outlined text-base">code</span>
//                               <span>{project.technologies}</span>
//                             </div>
//                           )}
                          
//                           {project.created_at && (
//                             <div className="flex items-center space-x-1">
//                               <span className="material-symbols-outlined text-base">calendar_today</span>
//                               <span>{new Date(project.created_at).toLocaleDateString('fr-FR')}</span>
//                             </div>
//                           )}
                          
//                           {project.github_url && (
//                             <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 hover:underline">
//                               <span className="material-symbols-outlined text-base">code</span>
//                               <span>GitHub</span>
//                             </a>
//                           )}
                          
//                           {project.demo_url && (
//                             <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-green-600 hover:text-green-800 hover:underline">
//                               <span className="material-symbols-outlined text-base">open_in_new</span>
//                               <span>Démo</span>
//                             </a>
//                           )}
//                         </div>
//                       </div>

//                       <div className="flex space-x-2">
//                         <button 
//                           onClick={() => navigate(`/admin/project/${project.id}`, { state: { project } })} 
//                           className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors group relative"
//                           title="Voir les détails"
//                         >
//                           <span className="material-symbols-outlined">visibility</span>
                          
//                           <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-max">
//                             <div className="flex items-center gap-1">
//                               <span className="material-symbols-outlined text-xs">open_in_new</span>
//                               <span>Voir les détails complets</span>
//                             </div>
//                             <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
//                               <div className="border-4 border-transparent border-t-gray-900"></div>
//                             </div>
//                           </div>
//                         </button>
                        
//                         {/* Boutons d'action rapide */}
//                         {normalizeStatus(project.status) !== 'approved' && (
//                           <button 
//                             onClick={() => openApprovalModal(project.id, project.title)}
//                             className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors"
//                             title="Approuver"
//                           >
//                             <span className="material-symbols-outlined">check_circle</span>
//                           </button>
//                         )}
                        
//                         {normalizeStatus(project.status) !== 'rejected' && (
//                           <button 
//                             onClick={() => openRejectionModal(project.id, project.title)}
//                             className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
//                             title="Rejeter"
//                           >
//                             <span className="material-symbols-outlined">cancel</span>
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
//             <div className="text-gray-400 mb-2">
//               <span className="material-symbols-outlined text-4xl">search_off</span>
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-1">
//               {projectsWithUsers.length === 0 ? 'Aucune donnée disponible' : 'Aucun résultat trouvé'}
//             </h3>
//             <p className="text-gray-500 mb-4">
//               {projectsWithUsers.length === 0 
//                 ? 'La base de données est vide ou inaccessible.' 
//                 : 'Aucun projet ne correspond à vos critères.'}
//             </p>
//             <div className="flex flex-wrap justify-center gap-3">
//               <button 
//                 onClick={testDatabaseConnection} 
//                 className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#c40511] font-medium flex items-center gap-2"
//               >
//                 <span className="material-symbols-outlined">database</span>
//                 Tester la connexion
//               </button>
//               {isDemoMode && (
//                 <button 
//                   onClick={activateDemoMode} 
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
//                 >
//                   <span className="material-symbols-outlined">visibility</span>
//                   Mode démo
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modale d'approbation */}
//       {approvalModal.open && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//                   <span className="material-symbols-outlined text-green-600">check_circle</span>
//                   Approuver le projet
//                 </h3>
//                 <p className="text-gray-600 mt-1">Valider et publier "{approvalModal.projectTitle}"</p>
//               </div>
//               <button
//                 onClick={closeApprovalModal}
//                 className="text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <span className="material-symbols-outlined">close</span>
//               </button>
//             </div>
            
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Critères d'approbation
//                 </label>
//                 <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
//                   <div className="space-y-2">
//                     {approvalModal.criteria.split('\n').map((line, index) => (
//                       <div key={index} className="flex items-start gap-2">
//                         {line.includes('✅') ? (
//                           <span className="material-symbols-outlined text-green-600 text-sm">check_circle</span>
//                         ) : line.includes('❌') ? (
//                           <span className="material-symbols-outlined text-red-600 text-sm">cancel</span>
//                         ) : null}
//                         <span className={`${line.includes('✅') ? 'text-green-800' : line.includes('❌') ? 'text-red-800' : 'text-gray-700'}`}>
//                           {line.replace('✅', '').replace('❌', '').trim()}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
                
//                 <textarea
//                   value={approvalModal.criteria}
//                   onChange={(e) => setApprovalModal({...approvalModal, criteria: e.target.value})}
//                   rows="8"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
//                   placeholder="Ajoutez vos commentaires d'approbation..."
//                 />
//               </div>
              
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                 <div className="flex items-start gap-3">
//                   <span className="material-symbols-outlined text-blue-600">info</span>
//                   <div>
//                     <p className="font-medium text-blue-800">Informations</p>
//                     <p className="text-sm text-blue-700 mt-1">
//                       Une fois approuvé, le projet sera marqué comme publié et visible publiquement.
//                     </p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="flex gap-3 pt-4">
//                 <button
//                   onClick={closeApprovalModal}
//                   disabled={actionLoading}
//                   className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   onClick={handleApproveProject}
//                   disabled={actionLoading}
//                   className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50"
//                 >
//                   {actionLoading ? (
//                     <>
//                       <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
//                       Traitement...
//                     </>
//                   ) : (
//                     <>
//                       <span className="material-symbols-outlined">check_circle</span>
//                       Approuver le projet
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modale de rejet */}
//       {rejectionModal.open && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//                   <span className="material-symbols-outlined text-red-600">cancel</span>
//                   Rejeter le projet
//                 </h3>
//                 <p className="text-gray-600 mt-1">Demander des modifications pour "{rejectionModal.projectTitle}"</p>
//               </div>
//               <button
//                 onClick={closeRejectionModal}
//                 className="text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <span className="material-symbols-outlined">close</span>
//               </button>
//             </div>
            
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Motifs de rejet
//                 </label>
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
//                   <div className="space-y-2">
//                     {rejectionModal.criteria.split('\n').map((line, index) => (
//                       <div key={index} className="flex items-start gap-2">
//                         {line.includes('❌') ? (
//                           <span className="material-symbols-outlined text-red-600 text-sm">cancel</span>
//                         ) : line.includes('✅') ? (
//                           <span className="material-symbols-outlined text-green-600 text-sm">check_circle</span>
//                         ) : null}
//                         <span className={`${line.includes('❌') ? 'text-red-800' : line.includes('✅') ? 'text-green-800' : 'text-gray-700'}`}>
//                           {line.replace('✅', '').replace('❌', '').trim()}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
                
//                 <textarea
//                   value={rejectionModal.criteria}
//                   onChange={(e) => setRejectionModal({...rejectionModal, criteria: e.target.value})}
//                   rows="8"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-400"
//                   placeholder="Détaillez les raisons du rejet et les améliorations nécessaires..."
//                 />
//               </div>
              
//               <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                 <div className="flex items-start gap-3">
//                   <span className="material-symbols-outlined text-yellow-600">warning</span>
//                   <div>
//                     <p className="font-medium text-yellow-800">Attention</p>
//                     <p className="text-sm text-yellow-700 mt-1">
//                       Le projet sera marqué comme rejeté. L'auteur pourra le modifier et le soumettre à nouveau.
//                     </p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="flex gap-3 pt-4">
//                 <button
//                   onClick={closeRejectionModal}
//                   disabled={actionLoading}
//                   className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   onClick={handleRejectProject}
//                   disabled={actionLoading}
//                   className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50"
//                 >
//                   {actionLoading ? (
//                     <>
//                       <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
//                       Traitement...
//                     </>
//                   ) : (
//                     <>
//                       <span className="material-symbols-outlined">cancel</span>
//                       Rejeter le projet
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectManagement;


// src/components/admin/ProjectManagement.jsx - VERSION AVEC MESSAGES COURTS
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectManagement = () => {
  const navigate = useNavigate();
  const [projectsWithUsers, setProjectsWithUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [cohortFilter, setCohortFilter] = useState('');
  const [technologyFilter, setTechnologyFilter] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [apiStatus, setApiStatus] = useState('🚀 Initialisation...');
  const [apiResponse, setApiResponse] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [actionType, setActionType] = useState(''); // 'success' ou 'error'
  
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    draft: 0,
    totalUsers: 0
  });
  
  // États pour les modales
  const [approvalModal, setApprovalModal] = useState({
    open: false,
    projectId: null,
    projectTitle: '',
    criteria: '✅ Code propre\n✅ Documentation\n✅ Tests fonctionnels\n✅ Bonnes pratiques'
  });
  
  const [rejectionModal, setRejectionModal] = useState({
    open: false,
    projectId: null,
    projectTitle: '',
    criteria: '❌ Améliorations nécessaires\n❌ Tests manquants\n❌ Documentation insuffisante'
  });

  const API_ENDPOINTS = [
    'http://127.0.0.1:8000/api/projects/projects/',
    'http://127.0.0.1:8000/api/projects/',
    'http://localhost:8000/api/projects/projects/',
    'http://localhost:8000/api/projects/'
  ];

  useEffect(() => {
    fetchRealDataFromDatabase();
  }, [refreshKey]);

  // ✅ FONCTIONS POUR LES MODALES D'APPROBATION/REJET
  const openApprovalModal = (projectId, projectTitle) => {
    setApprovalModal({
      open: true,
      projectId,
      projectTitle,
      criteria: `Critères d'approbation:\n• Code propre et documenté\n• Fonctionnalités complètes\n• Tests fonctionnels\n• Bonnes pratiques`
    });
  };

  const openRejectionModal = (projectId, projectTitle) => {
    setRejectionModal({
      open: true,
      projectId,
      projectTitle,
      criteria: `Motifs de rejet:\n• Améliorations nécessaires\n• Tests manquants\n• Documentation insuffisante\n• UI/UX à améliorer`
    });
  };

  const closeApprovalModal = () => {
    setApprovalModal({ open: false, projectId: null, projectTitle: '', criteria: '' });
    setActionMessage('');
    setActionType('');
  };

  const closeRejectionModal = () => {
    setRejectionModal({ open: false, projectId: null, projectTitle: '', criteria: '' });
    setActionMessage('');
    setActionType('');
  };

  // ✅ FONCTION POUR AFFICHER DES MESSAGES COURTS
  const showMessage = (message, type = 'success') => {
    setActionMessage(message);
    setActionType(type);
    
    // Masquer automatiquement après 3 secondes
    setTimeout(() => {
      setActionMessage('');
      setActionType('');
    }, 3000);
  };

  // ✅ APPROUVER UN PROJET DIRECTEMENT
  const handleApproveProject = async () => {
    if (!approvalModal.projectId) return;
    
    setActionLoading(true);
    
    try {
      if (isDemoMode) {
        // Mode démo: simuler l'approbation
        setProjectsWithUsers(prev => 
          prev.map(user => ({
            ...user,
            projects: user.projects?.map(project => 
              project.id === approvalModal.projectId 
                ? { 
                    ...project, 
                    status: 'approved',
                    is_approved: true,
                    is_pending: false,
                    is_rejected: false 
                  }
                : project
            ) || []
          }))
        );
        
        // Mettre à jour les statistiques
        calculateAndSetStats(projectsWithUsers.map(user => ({
          ...user,
          projects: user.projects?.map(project => 
            project.id === approvalModal.projectId 
              ? { ...project, status: 'approved' }
              : project
          ) || []
        })));
        
        showMessage(`✅ "${approvalModal.projectTitle}" approuvé`, 'success');
        
        // Fermer la modale
        setTimeout(() => {
          closeApprovalModal();
        }, 1500);
      } else {
        // Mode réel: appel API
        const token = localStorage.getItem('access_token');
        const headers = { 'Content-Type': 'application/json' };
        
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const response = await fetch(`http://127.0.0.1:8000/api/projects/${approvalModal.projectId}/`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ 
            status: 'approved',
            is_approved: true,
            is_pending: false,
            approval_notes: approvalModal.criteria,
            validated_by: 'Administrateur',
            validation_date: new Date().toISOString()
          })
        });
        
        if (response.ok) {
          // Actualiser les données
          fetchRealDataFromDatabase();
          showMessage(`✅ "${approvalModal.projectTitle}" approuvé`, 'success');
          
          // Fermer la modale
          setTimeout(() => {
            closeApprovalModal();
          }, 1500);
        } else {
          throw new Error(`Erreur ${response.status}`);
        }
      }
    } catch (error) {
      console.error('❌ Erreur approbation:', error);
      showMessage(`❌ Erreur lors de l'approbation`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ REJETER UN PROJET DIRECTEMENT
  const handleRejectProject = async () => {
    if (!rejectionModal.projectId) return;
    
    setActionLoading(true);
    
    try {
      if (isDemoMode) {
        // Mode démo: simuler le rejet
        setProjectsWithUsers(prev => 
          prev.map(user => ({
            ...user,
            projects: user.projects?.map(project => 
              project.id === rejectionModal.projectId 
                ? { 
                    ...project, 
                    status: 'rejected',
                    is_approved: false,
                    is_pending: false,
                    is_rejected: true 
                  }
                : project
            ) || []
          }))
        );
        
        // Mettre à jour les statistiques
        calculateAndSetStats(projectsWithUsers.map(user => ({
          ...user,
          projects: user.projects?.map(project => 
            project.id === rejectionModal.projectId 
              ? { ...project, status: 'rejected' }
              : project
          ) || []
        })));
        
        showMessage(`❌ "${rejectionModal.projectTitle}" rejeté`, 'success');
        
        // Fermer la modale
        setTimeout(() => {
          closeRejectionModal();
        }, 1500);
      } else {
        // Mode réel: appel API
        const token = localStorage.getItem('access_token');
        const headers = { 'Content-Type': 'application/json' };
        
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const response = await fetch(`http://127.0.0.1:8000/api/projects/${rejectionModal.projectId}/`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ 
            status: 'rejected',
            is_approved: false,
            is_pending: false,
            is_rejected: true,
            rejection_reasons: rejectionModal.criteria,
            rejected_by: 'Administrateur',
            rejection_date: new Date().toISOString()
          })
        });
        
        if (response.ok) {
          // Actualiser les données
          fetchRealDataFromDatabase();
          showMessage(`❌ "${rejectionModal.projectTitle}" rejeté`, 'success');
          
          // Fermer la modale
          setTimeout(() => {
            closeRejectionModal();
          }, 1500);
        } else {
          throw new Error(`Erreur ${response.status}`);
        }
      }
    } catch (error) {
      console.error('❌ Erreur rejet:', error);
      showMessage(`❌ Erreur lors du rejet`, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ TESTER TOUS LES ENDPOINTS (messages courts)
  const testAllEndpoints = async () => {
    setLoading(true);
    setApiStatus('🔍 Test des endpoints...');
    
    const results = [];
    
    for (const endpoint of API_ENDPOINTS) {
      try {
        const response = await fetch(endpoint);
        
        if (response.ok) {
          results.push({ endpoint, status: '✅' });
        } else {
          results.push({ endpoint, status: `❌ ${response.status}` });
        }
      } catch (error) {
        results.push({ endpoint, status: '❌ Erreur' });
      }
    }
    
    const successCount = results.filter(r => r.status.includes('✅')).length;
    
    if (successCount > 0) {
      showMessage(`✅ ${successCount}/${API_ENDPOINTS.length} endpoints OK`, 'success');
    } else {
      showMessage('❌ Aucun endpoint fonctionnel', 'error');
    }
    
    setApiStatus(`${successCount}/${API_ENDPOINTS.length} OK`);
    setLoading(false);
  };

  // ✅ TEST DE CONNEXION (messages courts)
  const testDatabaseConnection = async () => {
    try {
      setLoading(true);
      setApiStatus('🔍 Test connexion...');
      
      const response = await fetch('http://127.0.0.1:8000/api/projects/projects/');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const count = Array.isArray(data) ? data.length : 'Object';
      
      showMessage(`✅ Connecté (${count} projets)`, 'success');
      fetchRealDataFromDatabase();
      
    } catch (error) {
      console.error('Test échoué:', error);
      showMessage('❌ Connexion échouée', 'error');
      testAllEndpoints();
    } finally {
      setLoading(false);
    }
  };

  // ✅ FONCTION PRINCIPALE DE CHARGEMENT
  const fetchRealDataFromDatabase = async () => {
    try {
      setLoading(true);
      setConnectionError(null);
      setApiResponse(null);
      setApiStatus('🔄 Connexion...');
      
      let projects = null;
      let workingEndpoint = '';
      
      for (const endpoint of API_ENDPOINTS) {
        try {
          const response = await fetch(endpoint);
          
          if (response.ok) {
            const data = await response.json();
            
            if (Array.isArray(data)) {
              projects = data;
              workingEndpoint = endpoint;
              break;
            } else if (data && typeof data === 'object') {
              if (Array.isArray(data.results)) {
                projects = data.results;
                workingEndpoint = endpoint;
                break;
              } else if (Array.isArray(data.projects)) {
                projects = data.projects;
                workingEndpoint = endpoint;
                break;
              } else {
                projects = Object.values(data);
                workingEndpoint = endpoint;
                break;
              }
            }
          }
        } catch (err) {
          console.log(`❌ ${endpoint}: ${err.message}`);
        }
      }
      
      if (!projects) {
        throw new Error('API non accessible');
      }
      
      setApiResponse(projects);
      
      if (projects.length === 0) {
        setApiStatus('📭 Table vide');
        setProjectsWithUsers([]);
        setFilteredData([]);
        setStats({
          total: 0,
          approved: 0,
          pending: 0,
          rejected: 0,
          draft: 0,
          totalUsers: 0
        });
        setIsDemoMode(false);
      } else {
        const transformedData = transformProjectsData(projects);
        
        setProjectsWithUsers(transformedData);
        setFilteredData(transformedData);
        setIsDemoMode(false);
        
        calculateAndSetStats(transformedData);
        
        showMessage(`✅ ${projects.length} projets chargés`, 'success');
        setApiStatus(`${projects.length} projets`);
      }
      
    } catch (error) {
      console.error('❌ Erreur:', error);
      setConnectionError(error.message);
      setApiStatus(`❌ ${error.message}`);
      
      activateDemoMode();
      showMessage('🎭 Mode démo activé', 'info');
      
    } finally {
      setLoading(false);
    }
  };

  // ✅ TRANSFORMATION DES DONNÉES (inchangée)
  const transformProjectsData = (projects) => {
    if (!Array.isArray(projects)) {
      console.error('❌ Les données ne sont pas un tableau:', projects);
      return [];
    }
    
    const usersMap = new Map();
    
    projects.forEach((project, index) => {
      let authorInfo = {};
      let authorName = '';
      let authorId = null;
      
      if (project.author && typeof project.author === 'object') {
        authorInfo = {
          id: project.author.id || `author_${index}`,
          username: project.author.username || `user_${project.author.id || index}`,
          first_name: project.author.first_name || 'Utilisateur',
          last_name: project.author.last_name || `#${project.author.id || index}`,
          email: project.author.email || `user${project.author.id || index}@simplon.com`,
          is_staff: project.author.is_staff || false
        };
        authorName = `${authorInfo.first_name} ${authorInfo.last_name}`.trim();
        authorId = authorInfo.id;
      }
      else if (project.author) {
        authorId = project.author;
        authorName = `Auteur ${project.author}`;
        authorInfo = {
          id: project.author,
          username: `user_${project.author}`,
          first_name: 'Auteur',
          last_name: `#${project.author}`,
          email: `user${project.author}@simplon.com`,
          is_staff: false
        };
      }
      else {
        authorId = project.author_id || project.user_id || `author_${index}`;
        authorName = project.author_name || project.author_username || `Auteur ${authorId}`;
        authorInfo = {
          id: authorId,
          username: project.author_username || `user_${authorId}`,
          first_name: project.author_first_name || 'Auteur',
          last_name: project.author_last_name || `#${authorId}`,
          email: project.author_email || `user${authorId}@simplon.com`,
          is_staff: project.author_is_staff || false
        };
      }
      
      if (!usersMap.has(authorId)) {
        usersMap.set(authorId, {
          id: authorId,
          full_name: authorName,
          first_name: authorInfo.first_name,
          last_name: authorInfo.last_name,
          email: authorInfo.email,
          username: authorInfo.username,
          is_staff: authorInfo.is_staff,
          projects: [],
          projects_count: 0
        });
      }
      
      const user = usersMap.get(authorId);
      
      let status = 'draft';
      if (project.status) status = project.status;
      else if (project.is_approved) status = 'approved';
      else if (project.is_pending) status = 'pending';
      else if (project.is_rejected) status = 'rejected';
      
      user.projects.push({
        id: project.id || `proj_${index}`,
        title: project.title || project.name || `Projet ${index + 1}`,
        description: project.description || project.short_description || 'Aucune description',
        technologies: project.technologies || project.tech_stack || project.tags || '',
        status: status,
        cohort: project.cohort || project.promotion || 'Non spécifiée',
        tags: project.tags || '',
        github_url: project.github_url || project.repository_url || '',
        demo_url: project.demo_url || project.live_url || project.website || '',
        image_url: project.image || project.screenshot || project.featured_image || '',
        created_at: project.created_at || project.date_created || new Date().toISOString(),
        updated_at: project.updated_at || project.date_updated || new Date().toISOString(),
        author_name: authorName,
        author_email: authorInfo.email,
        author_username: authorInfo.username,
        author_id: authorId,
        is_approved: status === 'approved' || project.is_approved,
        is_pending: status === 'pending' || project.is_pending,
        is_rejected: status === 'rejected' || project.is_rejected,
        days_since_creation: project.created_at ? 
          Math.floor((new Date() - new Date(project.created_at)) / (1000 * 60 * 60 * 24)) : null
      });
      
      user.projects_count = user.projects.length;
    });
    
    const usersWithProjects = Array.from(usersMap.values());
    
    usersWithProjects.sort((a, b) => b.projects_count - a.projects_count);
    usersWithProjects.forEach(user => {
      user.projects.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    });
    
    return usersWithProjects;
  };

  // ✅ CALCUL DES STATISTIQUES
  const calculateAndSetStats = (data) => {
    const allProjects = data.flatMap(user => user.projects || []);
    
    const stats = {
      total: allProjects.length,
      approved: allProjects.filter(p => normalizeStatus(p.status) === 'approved' || p.is_approved).length,
      pending: allProjects.filter(p => normalizeStatus(p.status) === 'pending' || p.is_pending).length,
      rejected: allProjects.filter(p => normalizeStatus(p.status) === 'rejected').length,
      draft: allProjects.filter(p => normalizeStatus(p.status) === 'draft').length,
      totalUsers: data.length
    };
    
    setStats(stats);
  };

  // ✅ FILTRES
  useEffect(() => {
    let filtered = [...projectsWithUsers];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.map(user => ({
        ...user,
        projects: user.projects?.filter(project => 
          (project.title?.toLowerCase() || '').includes(term) ||
          (project.description?.toLowerCase() || '').includes(term) ||
          (project.technologies?.toLowerCase() || '').includes(term) ||
          (project.author_name?.toLowerCase() || '').includes(term) ||
          (project.author_email?.toLowerCase() || '').includes(term) ||
          (user.full_name?.toLowerCase() || '').includes(term) ||
          (user.email?.toLowerCase() || '').includes(term)
        ) || []
      })).filter(user => user.projects && user.projects.length > 0);
    }

    if (statusFilter) {
      filtered = filtered.map(user => ({
        ...user,
        projects: user.projects?.filter(project => 
          normalizeStatus(project.status) === normalizeStatus(statusFilter)
        ) || []
      })).filter(user => user.projects && user.projects.length > 0);
    }

    if (cohortFilter) {
      filtered = filtered.map(user => ({
        ...user,
        projects: user.projects?.filter(project => 
          (project.cohort?.toLowerCase() || '').includes(cohortFilter.toLowerCase())
        ) || []
      })).filter(user => user.projects && user.projects.length > 0);
    }

    if (technologyFilter) {
      filtered = filtered.map(user => ({
        ...user,
        projects: user.projects?.filter(project => 
          (project.technologies?.toLowerCase() || '').includes(technologyFilter.toLowerCase())
        ) || []
      })).filter(user => user.projects && user.projects.length > 0);
    }

    setFilteredData(filtered);
  }, [searchTerm, statusFilter, cohortFilter, technologyFilter, projectsWithUsers]);

  // ✅ FONCTIONS UTILITAIRES
  const normalizeStatus = (status) => {
    if (!status) return '';
    const s = status.toLowerCase();
    if (s.includes('approv') || s.includes('valid') || s.includes('publish')) return 'approved';
    if (s.includes('pend') || s.includes('wait')) return 'pending';
    if (s.includes('reject') || s.includes('refus')) return 'rejected';
    if (s.includes('draft') || s.includes('brouillon')) return 'draft';
    return s;
  };

  const getStatusColor = (status) => {
    const norm = normalizeStatus(status);
    switch (norm) {
      case 'approved': return 'bg-green-100 text-green-800 border border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'draft': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'rejected': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    const norm = normalizeStatus(status);
    switch (norm) {
      case 'approved': return 'check_circle';
      case 'pending': return 'pending';
      case 'draft': return 'draft';
      case 'rejected': return 'cancel';
      default: return 'help';
    }
  };

  const getStatusText = (status) => {
    const norm = normalizeStatus(status);
    switch (norm) {
      case 'approved': return '✅ Approuvé';
      case 'pending': return '⏳ En attente';
      case 'draft': return '📝 Brouillon';
      case 'rejected': return '❌ Rejeté';
      default: return status || '❓ Inconnu';
    }
  };

  // ✅ MODE DÉMO
  const activateDemoMode = () => {
    const demoUsers = [
      {
        id: 1,
        full_name: 'Jean Dupont',
        email: 'jean.dupont@simplon.com',
        username: 'jeandupont',
        projects_count: 2,
        projects: [
          {
            id: 101,
            title: 'Plateforme E-commerce',
            description: 'Site e-commerce avec panier et paiement',
            technologies: 'React, Node.js, MongoDB',
            status: 'pending',
            cohort: 'Promo 2024-1',
            tags: 'ecommerce',
            github_url: 'https://github.com/jeandupont/ecommerce',
            demo_url: 'https://ecommerce-demo.simplon.com',
            created_at: '2024-01-15T10:30:00Z',
            author_name: 'Jean Dupont',
            is_approved: false,
            is_pending: true,
            is_rejected: false
          }
        ]
      }
    ];
    
    setProjectsWithUsers(demoUsers);
    setFilteredData(demoUsers);
    setIsDemoMode(true);
    
    const allDemoProjects = demoUsers.flatMap(user => user.projects);
    setStats({
      total: allDemoProjects.length,
      approved: 0,
      pending: 1,
      rejected: 0,
      draft: 0,
      totalUsers: 1
    });
    
    setApiStatus('🎭 Mode démo');
  };

  // ✅ AFFICHAGE DU STATUT
  const renderStatusBanner = () => {
    return (
      <div className="mb-6">
        <div className={`mb-4 rounded-xl p-4 ${
          isDemoMode 
            ? 'bg-blue-50 border border-blue-200' 
            : projectsWithUsers.length > 0 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="material-symbols-outlined text-lg">
                  {isDemoMode ? 'warning' : 
                   projectsWithUsers.length > 0 ? 'check_circle' : 'info'}
                </span>
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  isDemoMode ? 'text-blue-700' : 
                  projectsWithUsers.length > 0 ? 'text-green-700' : 'text-yellow-700'
                }`}>
                  {isDemoMode ? '🎭 Mode démo' : 
                   projectsWithUsers.length > 0 ? '✅ Connecté' : '📭 Base vide'}
                </p>
                <p className={`text-xs mt-1 ${
                  isDemoMode ? 'text-blue-600' : 
                  projectsWithUsers.length > 0 ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {isDemoMode ? 'Données de test' : 
                   projectsWithUsers.length > 0 ? 
                     `${stats.total} projets • ${stats.approved} approuvés` : 
                     'Table vide'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isDemoMode && (
                <div className={`text-xs px-3 py-1 rounded-full font-medium ${
                  projectsWithUsers.length > 0 ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                }`}>
                  {projectsWithUsers.length > 0 ? 'PostgreSQL' : 'Vide'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ✅ RENDU PRINCIPAL
  if (loading && projectsWithUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#E30613] border-t-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#E30613] animate-pulse">database</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-gray-600 font-medium">{apiStatus}</p>
          <p className="text-sm text-gray-500 mt-2">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {renderStatusBanner()}
      
      {/* Message d'action court */}
      {actionMessage && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
          actionType === 'success' ? 'bg-green-50 border border-green-200' : 
          actionType === 'error' ? 'bg-red-50 border border-red-200' :
          'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined">
              {actionType === 'success' ? 'check_circle' : 
               actionType === 'error' ? 'error' : 'info'}
            </span>
            <div className="flex-1">
              <p className={`font-medium ${
                actionType === 'success' ? 'text-green-800' : 
                actionType === 'error' ? 'text-red-800' : 'text-blue-800'
              }`}>
                {actionMessage}
              </p>
            </div>
            <button
              onClick={() => setActionMessage('')}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#001F3F]">
            🚀 Gestion des Projets
          </h1>
          <p className="text-gray-600 mt-2">
            Plateforme de suivi et validation
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={testAllEndpoints} 
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 flex items-center gap-2"
          >
            <span className="material-symbols-outlined">wifi_find</span>
            Tester endpoints
          </button>
          <button 
            onClick={testDatabaseConnection} 
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 flex items-center gap-2"
          >
            <span className="material-symbols-outlined">database</span>
            Tester connexion
          </button>
          <button 
            onClick={() => setRefreshKey(prev => prev + 1)} 
            className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#c40511] font-medium flex items-center gap-2"
          >
            <span className="material-symbols-outlined">refresh</span>
            Actualiser
          </button>
          {isDemoMode && (
            <button 
              onClick={() => {
                setIsDemoMode(false);
                fetchRealDataFromDatabase();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
            >
              <span className="material-symbols-outlined">database</span>
              Mode réel
            </button>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-[#001F3F]">{stats.total}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
            <span className="material-symbols-outlined text-gray-500 text-2xl">folder</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <div className="text-sm text-gray-500">Approuvés</div>
            </div>
            <span className="material-symbols-outlined text-green-500 text-2xl">check_circle</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-500">En attente</div>
            </div>
            <span className="material-symbols-outlined text-yellow-500 text-2xl">pending</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-sm text-gray-500">Rejetés</div>
            </div>
            <span className="material-symbols-outlined text-red-500 text-2xl">cancel</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.draft}</div>
              <div className="text-sm text-gray-500">Brouillons</div>
            </div>
            <span className="material-symbols-outlined text-blue-500 text-2xl">draft</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">{stats.totalUsers}</div>
              <div className="text-sm text-gray-500">Auteurs</div>
            </div>
            <span className="material-symbols-outlined text-purple-500 text-2xl">people</span>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div className="lg:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-400">search</span>
            </div>
            <input
              type="text"
              placeholder="Rechercher projet, auteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent"
            />
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613]"
          >
            <option value="">📊 Tous les statuts</option>
            <option value="approved">✅ Approuvés</option>
            <option value="pending">⏳ En attente</option>
            <option value="rejected">❌ Rejetés</option>
            <option value="draft">📝 Brouillons</option>
          </select>
          
          <select 
            value={cohortFilter}
            onChange={(e) => setCohortFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613]"
          >
            <option value="">👥 Toutes cohortes</option>
            {[...new Set(projectsWithUsers.flatMap(u => u.projects?.map(p => p.cohort) || []).filter(Boolean))].sort().map(cohort => (
              <option key={cohort} value={cohort}>{cohort}</option>
            ))}
          </select>
          
          <select 
            value={technologyFilter}
            onChange={(e) => setTechnologyFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613]"
          >
            <option value="">💻 Toutes technos</option>
            {[...new Set(projectsWithUsers.flatMap(u => 
              u.projects?.flatMap(p => 
                (p.technologies || '').split(',').map(t => t.trim()).filter(t => t)
              ) || []
            ))].sort().map(tech => (
              <option key={tech} value={tech}>{tech}</option>
            ))}
          </select>
        </div>
        
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">{filteredData.length}</span> utilisateur(s)
            {(searchTerm || statusFilter || cohortFilter || technologyFilter) && (
              <span>
                {' '}sur <span className="font-medium">{projectsWithUsers.length}</span>
                <button 
                  onClick={() => { 
                    setSearchTerm(''); 
                    setStatusFilter(''); 
                    setCohortFilter(''); 
                    setTechnologyFilter('');
                  }} 
                  className="ml-2 text-[#E30613] hover:text-[#c40511] font-medium"
                >
                  Effacer
                </button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Liste des projets */}
      <div className="space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((user) => (
            <div key={user.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#E30613] to-[#ff6b6b] rounded-full flex items-center justify-center text-white font-bold">
                      {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#001F3F]">
                        {user.full_name}
                        {user.is_staff && (
                          <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            Admin
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {user.email} • {user.projects_count} projet(s)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      ID: {user.id}
                    </span>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {(user.projects || []).map((project) => (
                  <div key={project.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <h4 className="font-medium text-[#001F3F]">
                            {project.title}
                          </h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            <span className="material-symbols-outlined text-xs mr-1">
                              {getStatusIcon(project.status)}
                            </span>
                            {getStatusText(project.status)}
                          </span>
                          {project.cohort && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              {project.cohort}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          {project.technologies && (
                            <div className="flex items-center space-x-1">
                              <span className="material-symbols-outlined text-base">code</span>
                              <span>{project.technologies}</span>
                            </div>
                          )}
                          
                          {project.github_url && (
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-blue-600 hover:text-blue-800">
                              <span className="material-symbols-outlined text-base">code</span>
                              <span>GitHub</span>
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button 
                          onClick={() => navigate(`/admin/project/${project.id}`, { state: { project } })} 
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50"
                          title="Voir détails"
                        >
                          <span className="material-symbols-outlined">visibility</span>
                        </button>
                        
                        {/* Boutons d'action rapide */}
                        {normalizeStatus(project.status) !== 'approved' && (
                          <button 
                            onClick={() => openApprovalModal(project.id, project.title)}
                            className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50"
                            title="Approuver"
                          >
                            <span className="material-symbols-outlined">check_circle</span>
                          </button>
                        )}
                        
                        {normalizeStatus(project.status) !== 'rejected' && (
                          <button 
                            onClick={() => openRejectionModal(project.id, project.title)}
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50"
                            title="Rejeter"
                          >
                            <span className="material-symbols-outlined">cancel</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
            <div className="text-gray-400 mb-2">
              <span className="material-symbols-outlined text-4xl">search_off</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {projectsWithUsers.length === 0 ? 'Aucune donnée' : 'Aucun résultat'}
            </h3>
            <p className="text-gray-500 mb-4">
              {projectsWithUsers.length === 0 
                ? 'Base de données inaccessible.' 
                : 'Aucun projet correspondant.'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button 
                onClick={testDatabaseConnection} 
                className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#c40511] font-medium flex items-center gap-2"
              >
                <span className="material-symbols-outlined">database</span>
                Tester connexion
              </button>
              {isDemoMode && (
                <button 
                  onClick={activateDemoMode} 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Mode démo
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modale d'approbation */}
      {approvalModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600">check_circle</span>
                  Approuver le projet
                </h3>
                <p className="text-gray-600 mt-1">"{approvalModal.projectTitle}"</p>
              </div>
              <button
                onClick={closeApprovalModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commentaires
                </label>
                <textarea
                  value={approvalModal.criteria}
                  onChange={(e) => setApprovalModal({...approvalModal, criteria: e.target.value})}
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Commentaires d'approbation..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={closeApprovalModal}
                  disabled={actionLoading}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleApproveProject}
                  disabled={actionLoading}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      ...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">check_circle</span>
                      Approuver
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modale de rejet */}
      {rejectionModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-600">cancel</span>
                  Rejeter le projet
                </h3>
                <p className="text-gray-600 mt-1">"{rejectionModal.projectTitle}"</p>
              </div>
              <button
                onClick={closeRejectionModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Raisons
                </label>
                <textarea
                  value={rejectionModal.criteria}
                  onChange={(e) => setRejectionModal({...rejectionModal, criteria: e.target.value})}
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Raisons du rejet..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={closeRejectionModal}
                  disabled={actionLoading}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleRejectProject}
                  disabled={actionLoading}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      ...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">cancel</span>
                      Rejeter
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;