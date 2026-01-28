
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