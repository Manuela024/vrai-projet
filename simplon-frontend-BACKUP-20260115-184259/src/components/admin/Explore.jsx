


// // src/components/admin/Explore.jsx - VERSION AMÉLIORÉE
// import React, { useState, useEffect } from 'react';
// import authService from '../../services/auth';

// const Explore = () => {
//   const [projects, setProjects] = useState([]);
//   const [filteredProjects, setFilteredProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState('all');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [sortBy, setSortBy] = useState('newest');
//   const [downloading, setDownloading] = useState({});
//   const [stats, setStats] = useState({
//     total: 0,
//     published: 0,
//     pending: 0,
//     draft: 0,
//     rejected: 0
//   });
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const [apiInfo, setApiInfo] = useState(null);
//   const [isDemoMode, setIsDemoMode] = useState(false);
//   const [dbCount, setDbCount] = useState(0);
//   const [endpointsFound, setEndpointsFound] = useState([]);
//   const [activeEndpoint, setActiveEndpoint] = useState('');

//   const categories = [
//     { value: 'all', label: 'Toutes les catégories' },
//     { value: 'web', label: 'Développement Web' },
//     { value: 'mobile', label: 'Application Mobile' },
//     { value: 'ai', label: 'Intelligence Artificielle' },
//     { value: 'data', label: 'Data Science' },
//     { value: 'iot', label: 'IoT / Embedded' },
//     { value: 'game', label: 'Jeux Vidéo' },
//     { value: 'other', label: 'Autre' }
//   ];

//   const statuses = [
//     { value: 'all', label: 'Tous les statuts' },
//     { value: 'published', label: 'Publié' },
//     { value: 'pending', label: 'En attente' },
//     { value: 'draft', label: 'Brouillon' },
//     { value: 'rejected', label: 'Rejeté' },
//     { value: 'approved', label: 'Approuvé' }
//   ];

//   const sortOptions = [
//     { value: 'newest', label: 'Plus récent' },
//     { value: 'oldest', label: 'Plus ancien' },
//     { value: 'az', label: 'A-Z' },
//     { value: 'za', label: 'Z-A' }
//   ];

//   // ✅ DÉTECTER LES ENDPOINTS DJANGO
//   const discoverDjangoEndpoints = async () => {
//     console.log('🔍 Recherche des endpoints Django...');
    
//     const endpointsToTest = [
//       'http://localhost:8000/api/projects/projects/',
//       'http://localhost:8000/api/users/with-projects/',
//       'http://localhost:8000/api/projects/projects-with-users/',
//       'http://localhost:8000/api/projects/projects-grouped/',
//       'http://localhost:8000/api/projects/stats/',
//       'http://localhost:8000/api/projects/projects/debug/',
//       'http://localhost:8000/api/status/',
//       'http://localhost:8000/api/users/'
//     ];
    
//     const foundEndpoints = [];
    
//     for (const endpoint of endpointsToTest) {
//       try {
//         const response = await fetch(endpoint);
        
//         if (response.ok) {
//           const data = await response.json();
//           foundEndpoints.push({
//             url: endpoint,
//             data: data,
//             status: 'success',
//             count: data.count || data.projects?.length || data.users_with_projects?.length || 0
//           });
          
//           if (endpoint.includes('/status/')) {
//             setApiInfo(data);
//             setDbCount(data.database?.projects_count || data.projects_count || 0);
//           }
          
//           if (endpoint.includes('/api/projects/projects/') && data.projects && Array.isArray(data.projects)) {
//             return { 
//               projectsEndpoint: endpoint, 
//               projectsData: data.projects,
//               allEndpoints: foundEndpoints 
//             };
//           }
          
//           if (endpoint.includes('/users/with-projects/') && data.users && Array.isArray(data.users)) {
//             const userProjects = data.users.flatMap(user => 
//               user.projects?.items || []
//             );
//             if (userProjects.length > 0) {
//               return { 
//                 projectsEndpoint: endpoint, 
//                 projectsData: userProjects,
//                 allEndpoints: foundEndpoints 
//               };
//             }
//           }
          
//           if (endpoint.includes('/projects-with-users/') && data.users_with_projects && Array.isArray(data.users_with_projects)) {
//             const allProjects = data.users_with_projects.flatMap(user => user.projects || []);
//             if (allProjects.length > 0) {
//               return { 
//                 projectsEndpoint: endpoint, 
//                 projectsData: allProjects,
//                 allEndpoints: foundEndpoints 
//               };
//             }
//           }
//         }
//       } catch (err) {
//         foundEndpoints.push({
//           url: endpoint,
//           error: err.message,
//           status: 'error'
//         });
//       }
//     }
    
//     setEndpointsFound(foundEndpoints);
    
//     if (foundEndpoints.length === 0) {
//       setIsDemoMode(true);
//       return { projectsEndpoint: null, projectsData: [], allEndpoints: foundEndpoints };
//     }
    
//     const firstValidEndpoint = foundEndpoints.find(ep => ep.status === 'success');
//     if (firstValidEndpoint) {
//       return { 
//         projectsEndpoint: firstValidEndpoint.url, 
//         projectsData: firstValidEndpoint.data.projects || firstValidEndpoint.data || [],
//         allEndpoints: foundEndpoints 
//       };
//     }
    
//     return { projectsEndpoint: null, projectsData: [], allEndpoints: foundEndpoints };
//   };

//   // ✅ CHARGER LES PROJETS
//   const loadRealProjects = async () => {
//     try {
//       const { projectsEndpoint, projectsData, allEndpoints } = await discoverDjangoEndpoints();
//       setEndpointsFound(allEndpoints);
      
//       if (projectsEndpoint && projectsData && projectsData.length > 0) {
//         setIsDemoMode(false);
//         setActiveEndpoint(projectsEndpoint);
        
//         const transformedProjects = projectsData.map((project, index) => {
//           let authorInfo = {};
//           let authorName = '';
//           let authorEmail = '';
//           let authorUsername = '';
          
//           if (project.author) {
//             if (typeof project.author === 'object') {
//               authorInfo = {
//                 id: project.author.id || index + 1,
//                 username: project.author.username || `user${index + 1}`,
//                 first_name: project.author.first_name || '',
//                 last_name: project.author.last_name || '',
//                 email: project.author.email || '',
//                 is_staff: project.author.is_staff || false
//               };
//               authorName = project.author.first_name && project.author.last_name 
//                 ? `${project.author.first_name} ${project.author.last_name}`
//                 : project.author.username || '';
//               authorEmail = project.author.email || '';
//               authorUsername = project.author.username || '';
//             }
//           }
          
//           if (!authorName && project.author_name) authorName = project.author_name;
//           if (!authorEmail && project.author_email) authorEmail = project.author_email;
//           if (!authorUsername && project.author_username) authorUsername = project.author_username;
          
//           if (!authorName && !authorEmail && !authorUsername) {
//             authorInfo = {
//               id: project.author_id || index + 1,
//               username: `user${project.author_id || index + 1}`,
//               first_name: 'Utilisateur',
//               last_name: project.author_id ? `#${project.author_id}` : '',
//               email: `user${project.author_id || index + 1}@simplon.local`,
//               is_staff: false
//             };
//             authorName = authorInfo.username;
//             authorEmail = authorInfo.email;
//             authorUsername = authorInfo.username;
//           }
          
//           const status = project.status || 'draft';
//           const isPublished = status === 'published' || project.is_published === true;
//           const isDraft = status === 'draft' || project.is_draft === true;
//           const isRejected = status === 'rejected' || project.is_rejected === true;
//           const isApproved = status === 'approved' || project.is_approved === true;
          
//           let category = project.category || 'web';
//           if (!categories.find(c => c.value === category)) category = 'web';
          
//           return {
//             id: project.id || index + 1,
//             title: project.title || project.name || 'Sans titre',
//             description: project.description || project.short_description || '',
//             technologies: project.technologies || project.tech_stack || project.tags || '',
//             category: category,
//             status: status,
//             cohort: project.cohort || 'Promotion 2024',
//             github_url: project.github_url || project.github_repo || project.repository_url || '',
//             demo_url: project.demo_url || project.live_url || project.website || '',
//             image: project.image || project.screenshot || project.featured_image || project.thumbnail,
//             created_at: project.created_at || project.date_created || new Date().toISOString(),
//             updated_at: project.updated_at || project.date_updated || new Date().toISOString(),
            
//             user: {
//               id: authorInfo.id || project.author_id || index + 1,
//               username: authorUsername || authorInfo.username,
//               first_name: authorInfo.first_name || authorName.split(' ')[0] || '',
//               last_name: authorInfo.last_name || authorName.split(' ').slice(1).join(' ') || '',
//               email: authorEmail || authorInfo.email,
//               is_staff: authorInfo.is_staff || false
//             },
            
//             author_name: authorName,
//             author_email: authorEmail,
//             author_username: authorUsername,
            
//             is_published: isPublished,
//             is_draft: isDraft,
//             is_rejected: isRejected,
//             is_approved: isApproved,
//             is_pending: status === 'pending' || status === 'review'
//           };
//         });
        
//         return transformedProjects;
//       }
      
//       setIsDemoMode(true);
//       return getDemoProjects();
      
//     } catch (error) {
//       setIsDemoMode(true);
//       return getDemoProjects();
//     }
//   };

//   // ✅ FONCTION PRINCIPALE
//   const fetchProjects = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const currentUser = authService.getCurrentUser();
//       setUser(currentUser);
      
//       const projectsData = await loadRealProjects();
      
//       setProjects(projectsData);
      
//       const statsData = {
//         total: projectsData.length,
//         published: projectsData.filter(p => 
//           p.status === 'published' || 
//           p.is_published === true ||
//           p.status === 'approved' ||
//           p.is_approved === true
//         ).length,
//         pending: projectsData.filter(p => 
//           p.status === 'pending' || 
//           p.is_pending === true
//         ).length,
//         draft: projectsData.filter(p => 
//           p.status === 'draft' || 
//           p.is_draft === true
//         ).length,
//         rejected: projectsData.filter(p => 
//           p.status === 'rejected' || 
//           p.is_rejected === true
//         ).length
//       };
//       setStats(statsData);

//       if (isDemoMode) {
//         setError(`⚠️ Mode démo - Données fictives (${dbCount > 0 ? dbCount + ' projets réels en base' : 'Base non accessible'})`);
//       } else {
//         setError(`✅ Mode production - ${projectsData.length} projets réels chargés depuis Django`);
//       }

//     } catch (error) {
//       const demoProjects = getDemoProjects();
//       setProjects(demoProjects);
//       setIsDemoMode(true);
      
//       const statsData = {
//         total: demoProjects.length,
//         published: 4,
//         pending: 2,
//         draft: 3,
//         rejected: 1
//       };
//       setStats(statsData);
      
//       setError(`❌ ${error.message} - Mode démo activé`);
      
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ DONNÉES DE DÉMONSTRATION
//   const getDemoProjects = () => {
//     return [
//       {
//         id: 1,
//         title: "Portfolio React Modern",
//         user: {
//           id: 1,
//           username: "lea.martin",
//           first_name: "Léa",
//           last_name: "Martin",
//           email: "lea.martin@example.com",
//           is_staff: false
//         },
//         cohort: "DWWM - Mars 2024",
//         category: "web",
//         status: "published",
//         is_published: true,
//         technologies: "React, TypeScript, Tailwind CSS",
//         description: "Portfolio moderne développé avec React, TypeScript et Tailwind CSS",
//         image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//         github_url: "https://github.com/example/portfolio-react",
//         demo_url: "https://portfolio-react-demo.netlify.app",
//         created_at: "2024-03-15T10:30:00Z",
//         author_name: "Léa Martin",
//         author_email: "lea.martin@example.com"
//       },
//       {
//         id: 2,
//         title: "Application E-commerce",
//         user: {
//           id: 2,
//           username: "mohamed.ali",
//           first_name: "Mohamed",
//           last_name: "Ali",
//           email: "mohamed.ali@example.com",
//           is_staff: false
//         },
//         cohort: "CDA - Avril 2024",
//         category: "web",
//         status: "pending",
//         is_pending: true,
//         technologies: "React, Node.js, MongoDB, Express",
//         description: "Une application e-commerce complète avec panier et paiement",
//         github_url: "https://github.com/example/ecommerce-app",
//         demo_url: "https://ecommerce-demo.vercel.app",
//         created_at: "2024-04-20T14:15:00Z",
//         author_name: "Mohamed Ali",
//         author_email: "mohamed.ali@example.com"
//       },
//       {
//         id: 3,
//         title: "Jeu JavaScript",
//         user: {
//           id: 3,
//           username: "sophie123",
//           first_name: "Sophie",
//           last_name: "",
//           email: "sophie@example.com",
//           is_staff: false
//         },
//         cohort: "DWWM - Février 2024",
//         category: "game",
//         status: "draft",
//         is_draft: true,
//         technologies: "JavaScript, HTML5, Canvas, CSS3",
//         description: "Un jeu en JavaScript utilisant Canvas",
//         github_url: "https://github.com/example/javascript-game",
//         demo_url: "https://js-game-demo.netlify.app",
//         created_at: "2024-02-10T09:45:00Z",
//         author_name: "Sophie",
//         author_email: "sophie@example.com"
//       }
//     ];
//   };

//   // ✅ TÉLÉCHARGER LES DONNÉES D'UN PROJET
//   const downloadProjectData = async (project) => {
//     if (!project) return;
    
//     setDownloading(prev => ({ ...prev, [project.id]: true }));
    
//     try {
//       let dataToExport;
      
//       if (isDemoMode) {
//         dataToExport = project;
//       } else {
//         try {
//           const response = await fetch(`${activeEndpoint}${project.id}/`);
//           if (response.ok) {
//             dataToExport = await response.json();
//           } else {
//             dataToExport = project;
//           }
//         } catch (error) {
//           dataToExport = project;
//         }
//       }
      
//       const projectDataStr = JSON.stringify(dataToExport, null, 2);
//       const blob = new Blob([projectDataStr], { type: 'application/json' });
//       const url = URL.createObjectURL(blob);
      
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `projet-${project.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
      
//     } catch (error) {
//       console.error('Erreur lors du téléchargement:', error);
//       setError('Erreur lors du téléchargement des données');
//     } finally {
//       setTimeout(() => {
//         setDownloading(prev => ({ ...prev, [project.id]: false }));
//       }, 500);
//     }
//   };

//   // ✅ TÉLÉCHARGER TOUS LES PROJETS (CSV)
//   const downloadAllProjectsCSV = () => {
//     try {
//       const headers = ['ID', 'Titre', 'Auteur', 'Email', 'Cohorte', 'Catégorie', 'Statut', 'Technologies', 'GitHub', 'Démo', 'Date de création'];
      
//       const csvRows = [
//         headers.join(','),
//         ...filteredProjects.map(project => {
//           const row = [
//             project.id,
//             `"${project.title.replace(/"/g, '""')}"`,
//             `"${getAuthorName(project).replace(/"/g, '""')}"`,
//             `"${project.user?.email || project.author_email || ''}"`,
//             `"${project.cohort || ''}"`,
//             `"${project.category || ''}"`,
//             `"${project.status || ''}"`,
//             `"${getTechnologies(project).join(', ').replace(/"/g, '""')}"`,
//             `"${project.github_url || ''}"`,
//             `"${project.demo_url || ''}"`,
//             `"${formatDate(project.created_at)}"`
//           ];
//           return row.join(',');
//         })
//       ];
      
//       const csvString = csvRows.join('\n');
//       const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
//       const url = URL.createObjectURL(blob);
      
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `tous-les-projets-${new Date().toISOString().split('T')[0]}.csv`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
      
//     } catch (error) {
//       console.error('Erreur lors de l\'export CSV:', error);
//       setError('Erreur lors de l\'export des données');
//     }
//   };

//   const getProjectImage = (project) => {
//     if (!project) return null;
    
//     const imageFields = ['image', 'screenshot', 'thumbnail', 'cover_image', 'featured_image', 'project_image'];
    
//     for (const field of imageFields) {
//       if (project[field]) {
//         const imageValue = project[field];
        
//         if (typeof imageValue === 'string') {
//           if (imageValue.startsWith('http')) return imageValue;
//           if (imageValue.startsWith('/media/') || imageValue.startsWith('/static/')) {
//             return `http://localhost:8000${imageValue}`;
//           }
//           if (imageValue.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
//             return `http://localhost:8000/media/${imageValue}`;
//           }
//         }
//       }
//     }
    
//     const defaultImages = {
//       web: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//       mobile: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//       ai: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//       data: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//       iot: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//       game: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//       other: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
//     };
    
//     const category = project.category || project.project_category || 'other';
//     return defaultImages[category] || defaultImages.other;
//   };

//   const getAuthorName = (project) => {
//     if (!project) return 'Auteur inconnu';
    
//     if (project.author_name) return project.author_name;
    
//     if (project.user) {
//       if (project.user.first_name && project.user.last_name) {
//         return `${project.user.first_name} ${project.user.last_name}`;
//       }
//       if (project.user.first_name) return project.user.first_name;
//       if (project.user.last_name) return project.user.last_name;
//       if (project.user.username) return project.user.username;
//       if (project.user.email) return project.user.email.split('@')[0];
//     }
    
//     if (project.author_username) return project.author_username;
//     if (project.author_email) return project.author_email.split('@')[0];
    
//     return 'Auteur inconnu';
//   };

//   const getCohortName = (project) => {
//     if (!project) return null;
//     return project.cohort || project.user?.cohort || null;
//   };

//   const getTechnologies = (project) => {
//     if (!project) return [];
    
//     if (project.technologies) {
//       if (Array.isArray(project.technologies)) return project.technologies;
//       if (typeof project.technologies === 'string') {
//         return project.technologies.split(',').map(t => t.trim()).filter(t => t.length > 0);
//       }
//     }
    
//     return [];
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Date inconnue';
    
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('fr-FR', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric'
//       });
//     } catch (error) {
//       return 'Date invalide';
//     }
//   };

//   const getProjectLinks = (project) => {
//     const links = {
//       github: null,
//       demo: null
//     };
    
//     if (!project) return links;
    
//     const githubFields = ['github_url', 'github_repo', 'repository_url', 'github', 'repo_url'];
//     for (const field of githubFields) {
//       if (project[field]) {
//         let url = project[field];
//         if (url && !url.startsWith('http')) url = `https://${url}`;
//         links.github = url;
//         break;
//       }
//     }
    
//     const demoFields = ['demo_url', 'live_url', 'website', 'demo', 'url'];
//     for (const field of demoFields) {
//       if (project[field]) {
//         let url = project[field];
//         if (url && !url.startsWith('http')) url = `https://${url}`;
//         links.demo = url;
//         break;
//       }
//     }
    
//     return links;
//   };

//   const filterAndSortProjects = () => {
//     let filtered = [...projects];

//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = filtered.filter(project => {
//         const titleMatch = project.title?.toLowerCase().includes(searchLower) || false;
//         const descMatch = project.description?.toLowerCase().includes(searchLower) || false;
//         const authorMatch = getAuthorName(project).toLowerCase().includes(searchLower);
//         const techMatch = getTechnologies(project).some(tech => 
//           tech.toLowerCase().includes(searchLower)
//         );
//         const cohortMatch = getCohortName(project)?.toLowerCase().includes(searchLower) || false;
        
//         return titleMatch || descMatch || authorMatch || techMatch || cohortMatch;
//       });
//     }

//     if (categoryFilter !== 'all') {
//       filtered = filtered.filter(project => {
//         const projectCategory = (project.category || 'other').toLowerCase();
//         return projectCategory === categoryFilter;
//       });
//     }

//     if (statusFilter !== 'all') {
//       filtered = filtered.filter(project => {
//         const status = project.status?.toLowerCase() || 'draft';
//         return status === statusFilter;
//       });
//     }

//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case 'newest':
//           return new Date(b.created_at) - new Date(a.created_at);
//         case 'oldest':
//           return new Date(a.created_at) - new Date(b.created_at);
//         case 'az':
//           return (a.title || '').localeCompare(b.title || '');
//         case 'za':
//           return (b.title || '').localeCompare(a.title || '');
//         default:
//           return 0;
//       }
//     });

//     setFilteredProjects(filtered);
//   };

//   const getStatusBadge = (project) => {
//     const status = project.status?.toLowerCase() || 'draft';
//     const isPublished = project.is_published || status === 'published' || status === 'approved';
//     const isDraft = project.is_draft || status === 'draft';
//     const isRejected = project.is_rejected || status === 'rejected';
//     const isPending = project.is_pending || status === 'pending';
    
//     let label = 'Inconnu';
//     let color = 'bg-gray-100 text-gray-800';
    
//     if (isPublished) {
//       label = 'Publié';
//       color = 'bg-green-100 text-green-800';
//     } else if (isDraft) {
//       label = 'Brouillon';
//       color = 'bg-gray-100 text-gray-800';
//     } else if (isRejected) {
//       label = 'Rejeté';
//       color = 'bg-red-100 text-red-800';
//     } else if (isPending) {
//       label = 'En attente';
//       color = 'bg-yellow-100 text-yellow-800';
//     } else if (status === 'approved') {
//       label = 'Approuvé';
//       color = 'bg-blue-100 text-blue-800';
//     }
    
//     return (
//       <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${color}`}>
//         {label}
//       </span>
//     );
//   };

//   const getCategoryIcon = (category) => {
//     const icons = {
//       web: 'language',
//       mobile: 'smartphone',
//       ai: 'smart_toy',
//       data: 'bar_chart',
//       iot: 'settings_input_antenna',
//       game: 'sports_esports',
//       other: 'category'
//     };
//     return icons[category] || 'folder';
//   };

//   const handleManualSearch = async () => {
//     setLoading(true);
//     try {
//       const { projectsEndpoint, projectsData } = await discoverDjangoEndpoints();
      
//       if (projectsEndpoint && projectsData.length > 0) {
//         setProjects(projectsData);
//         setIsDemoMode(false);
//         setActiveEndpoint(projectsEndpoint);
//         setError(`✅ ${projectsData.length} projets trouvés sur ${projectsEndpoint}`);
//       } else {
//         setError('❌ Aucun endpoint de projets trouvé. Mode démo activé.');
//         setProjects(getDemoProjects());
//         setIsDemoMode(true);
//       }
//     } catch (error) {
//       setError(`❌ Erreur: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRefresh = () => {
//     fetchProjects();
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   useEffect(() => {
//     filterAndSortProjects();
//   }, [projects, searchTerm, categoryFilter, statusFilter, sortBy]);

//   if (loading) {
//     return (
//       <div className="flex flex-col justify-center items-center h-96 p-4">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E30613] mb-6"></div>
//         <p className="text-xl font-medium text-gray-700 mb-2 text-center">Chargement des projets...</p>
//         <p className="text-gray-600 text-center max-w-md">
//           {isDemoMode ? 'Chargement des données démo' : 'Connexion à l\'API Django en cours'}
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-6">
//       {/* En-tête avec informations */}
//       <div className="mb-8">
//         <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
//           <div className="flex-1">
//             <h1 className="text-2xl lg:text-3xl font-bold text-[#001F3F] mb-3">
//               Administration des Projets
//             </h1>
//             <div className="space-y-2">
//               <p className="text-gray-700 text-sm lg:text-base">
//                 {user ? `👤 Connecté en tant que: ${user.first_name || user.username || user.email}` : '🔒 Non connecté'}
//               </p>
//               <div className="flex flex-wrap gap-2">
//                 <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${isDemoMode ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
//                   {isDemoMode ? '⚠️ Mode démo' : '✅ Mode production'}
//                 </span>
//                 <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
//                   📊 {stats.total} projet{stats.total !== 1 ? 's' : ''}
//                 </span>
//                 {dbCount > 0 && (
//                   <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
//                     🗄️ {dbCount} en base
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
          
//           {/* Actions */}
//           {/* <div className="flex flex-col gap-3 min-w-[280px] max-w-full">
//             <button
//               onClick={handleManualSearch}
//               className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 font-medium text-sm lg:text-base"
//             >
//               <span className="material-symbols-outlined text-lg">search</span>
//               Rechercher les projets
//             </button>
            
//             <button
//               onClick={handleRefresh}
//               className="px-4 py-3 bg-[#001F3F] text-white rounded-xl hover:bg-[#003265] transition-all flex items-center justify-center gap-2 font-medium text-sm lg:text-base"
//             >
//               <span className="material-symbols-outlined text-lg">refresh</span>
//               Actualiser
//             </button>
            
//             {filteredProjects.length > 0 && (
//               <button
//                 onClick={downloadAllProjectsCSV}
//                 className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 font-medium text-sm lg:text-base"
//               >
//                 <span className="material-symbols-outlined text-lg">download</span>
//                 Exporter tous ({filteredProjects.length})
//               </button> */}
//             {/* )}
//           </div> */}
//         </div>
        
//         {/* Messages d'information/erreur */}
//         {error && (
//           <div className="mt-6">
//             <div className={`p-4 rounded-xl ${
//               error.includes('✅') ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300' : 
//               error.includes('⚠️') ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-300' : 
//               'bg-gradient-to-r from-red-50 to-pink-50 border border-red-300'
//             }`}>
//               <div className="flex items-start gap-3">
//                 <span className="material-symbols-outlined text-xl mt-0.5">
//                   {error.includes('✅') ? 'check_circle' : 
//                    error.includes('⚠️') ? 'warning' : 'error'}
//                 </span>
//                 <div className="flex-1">
//                   <p className={`text-sm font-medium ${
//                     error.includes('✅') ? 'text-green-800' : 
//                     error.includes('⚠️') ? 'text-yellow-800' : 'text-red-800'
//                   }`}>
//                     {error}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Statistiques */}
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
//         <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 shadow border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs text-gray-600 mb-1">Total</p>
//               <p className="text-2xl font-bold text-[#001F3F]">{stats.total}</p>
//             </div>
//             <span className="material-symbols-outlined text-[#E30613] text-3xl opacity-80">
//               layers
//             </span>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-white to-green-50 rounded-xl p-4 shadow border border-green-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs text-gray-600 mb-1">Publiés</p>
//               <p className="text-2xl font-bold text-green-600">{stats.published}</p>
//             </div>
//             <span className="material-symbols-outlined text-green-500 text-3xl opacity-80">
//               check_circle
//             </span>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-white to-yellow-50 rounded-xl p-4 shadow border border-yellow-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs text-gray-600 mb-1">En attente</p>
//               <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
//             </div>
//             <span className="material-symbols-outlined text-yellow-500 text-3xl opacity-80">
//               schedule
//             </span>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 shadow border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs text-gray-600 mb-1">Brouillons</p>
//               <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
//             </div>
//             <span className="material-symbols-outlined text-gray-500 text-3xl opacity-80">
//               draft
//             </span>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-white to-red-50 rounded-xl p-4 shadow border border-red-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs text-gray-600 mb-1">Rejetés</p>
//               <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
//             </div>
//             <span className="material-symbols-outlined text-red-500 text-3xl opacity-80">
//               block
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Barre de recherche et filtres */}
//       <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow p-5 mb-8 border border-gray-200">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
//           {/* Recherche */}
//           <div className="lg:col-span-4">
//             <div className="relative">
//               <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
//                 search
//               </span>
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Rechercher..."
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] bg-white text-gray-800"
//               />
//             </div>
//           </div>

//           {/* Catégorie */}
//           <div className="lg:col-span-2">
//             <select
//               value={categoryFilter}
//               onChange={(e) => setCategoryFilter(e.target.value)}
//               className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] bg-white text-gray-800"
//             >
//               {categories.map(cat => (
//                 <option key={cat.value} value={cat.value}>{cat.label}</option>
//               ))}
//             </select>
//           </div>

//           {/* Statut */}
//           <div className="lg:col-span-2">
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] bg-white text-gray-800"
//             >
//               {statuses.map(status => (
//                 <option key={status.value} value={status.value}>{status.label}</option>
//               ))}
//             </select>
//           </div>

//           {/* Tri */}
//           <div className="lg:col-span-2">
//             <div className="flex items-center gap-2 h-full">
//               <span className="text-gray-600 text-sm whitespace-nowrap">Trier:</span>
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] bg-white text-gray-800"
//               >
//                 {sortOptions.map(option => (
//                   <option key={option.value} value={option.value}>{option.label}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Export */}
//           <div className="lg:col-span-2">
//             <button
//               onClick={downloadAllProjectsCSV}
//               disabled={filteredProjects.length === 0}
//               className={`w-full px-3 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
//                 filteredProjects.length === 0 
//                   ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
//                   : 'bg-gradient-to-r from-[#001F3F] to-[#003265] text-white hover:opacity-90'
//               }`}
//             >
//               <span className="material-symbols-outlined">download</span>
//               <span className="hidden sm:inline">Exporter</span>
//             </button>
//           </div>
//         </div>
        
//         {/* Résumé filtres */}
//         <div className="mt-4 pt-4 border-t border-gray-200">
//           <div className="flex flex-wrap items-center justify-between gap-3">
//             <div className="flex items-center gap-2">
//               <span className="text-gray-700 font-medium">
//                 {filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''}
//                 {searchTerm && ` pour "${searchTerm}"`}
//               </span>
//               {(categoryFilter !== 'all' || statusFilter !== 'all') && (
//                 <div className="flex flex-wrap gap-2">
//                   {categoryFilter !== 'all' && (
//                     <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
//                       {categories.find(c => c.value === categoryFilter)?.label}
//                     </span>
//                   )}
//                   {statusFilter !== 'all' && (
//                     <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
//                       {statuses.find(s => s.value === statusFilter)?.label}
//                     </span>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Grille de projets */}
//       <div className="mb-8">
//         {filteredProjects.length === 0 ? (
//           <div className="text-center py-12 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-inner border border-dashed border-gray-300">
//             <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">
//               search_off
//             </span>
//             <h3 className="text-xl font-bold text-gray-700 mb-2">
//               Aucun projet trouvé
//             </h3>
//             <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
//               Aucun projet ne correspond à vos critères de recherche.
//             </p>
//             <button
//               onClick={() => {
//                 setSearchTerm('');
//                 setCategoryFilter('all');
//                 setStatusFilter('all');
//               }}
//               className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
//             >
//               Réinitialiser les filtres
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//             {filteredProjects.map(project => {
//               const projectImage = getProjectImage(project);
//               const authorName = getAuthorName(project);
//               const cohortName = getCohortName(project);
//               const technologies = getTechnologies(project);
//               const formattedDate = formatDate(project.created_at);
//               const projectLinks = getProjectLinks(project);
              
//               return (
//                 <div 
//                   key={project.id} 
//                   className="group flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:border-[#E30613] hover:shadow-lg"
//                 >
//                   {/* Image du projet */}
//                   <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
//                     {projectImage ? (
//                       <img 
//                         src={projectImage} 
//                         alt={project.title}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                         onError={(e) => {
//                           e.target.style.display = 'none';
//                           e.target.parentElement.classList.add('bg-gradient-to-br', 'from-blue-50', 'to-indigo-100');
//                         }}
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
//                         <span className="material-symbols-outlined text-gray-400 text-5xl">
//                           {getCategoryIcon(project.category)}
//                         </span>
//                       </div>
//                     )}
                    
//                     {/* Badge de statut */}
//                     <div className="absolute top-2 right-2">
//                       {getStatusBadge(project)}
//                     </div>
//                   </div>
                  
//                   {/* Contenu */}
//                   <div className="flex-1 p-4">
//                     <div className="mb-3">
//                       <h3 className="text-base font-bold text-[#001F3F] mb-1 line-clamp-1">
//                         {project.title}
//                       </h3>
                      
//                       {project.description && (
//                         <p className="text-gray-600 text-xs line-clamp-2 mb-2">
//                           {project.description}
//                         </p>
//                       )}
//                     </div>
                    
//                     {/* Infos auteur et date */}
//                     <div className="space-y-2 mb-3">
//                       <div className="flex items-center gap-2">
//                         <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
//                           {authorName.charAt(0).toUpperCase()}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="font-medium text-gray-800 text-sm truncate">{authorName}</p>
//                           <p className="text-xs text-gray-500">{formattedDate}</p>
//                         </div>
//                       </div>
                      
//                       {cohortName && (
//                         <div className="flex items-center gap-1 text-xs text-gray-600">
//                           <span className="material-symbols-outlined text-sm">school</span>
//                           <span className="truncate">{cohortName}</span>
//                         </div>
//                       )}
//                     </div>
                    
//                     {/* Technologies */}
//                     {technologies.length > 0 && (
//                       <div className="mb-3">
//                         <div className="flex flex-wrap gap-1">
//                           {technologies.slice(0, 2).map((tech, index) => (
//                             <span 
//                               key={index}
//                               className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200"
//                             >
//                               {tech.length > 15 ? tech.substring(0, 15) + '...' : tech}
//                             </span>
//                           ))}
//                           {technologies.length > 2 && (
//                             <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded">
//                               +{technologies.length - 2}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>
                  
//                   {/* Actions */}
//                   <div className="px-4 pb-4 pt-0">
//                     <div className="flex items-center justify-between gap-2">
//                       {/* Liens */}
//                       {(projectLinks.github || projectLinks.demo) && (
//                         <div className="flex gap-1">
//                           {projectLinks.github && (
//                             <a
//                               href={projectLinks.github}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="px-2 py-1.5 bg-gray-900 text-white rounded text-xs font-medium flex items-center gap-1"
//                               onClick={(e) => e.stopPropagation()}
//                               title="GitHub"
//                             >
//                               <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
//                                 <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
//                               </svg>
//                             </a>
//                           )}
//                           {projectLinks.demo && (
//                             <a
//                               href={projectLinks.demo}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="px-2 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded text-xs font-medium flex items-center gap-1"
//                               onClick={(e) => e.stopPropagation()}
//                               title="Démo"
//                             >
//                               <span className="material-symbols-outlined text-xs">open_in_new</span>
//                             </a>
//                           )}
//                         </div>
//                       )}
                      
//                       {/* Actions admin */}
//                       <div className="flex items-center gap-1">
//                         <button
//                           onClick={() => downloadProjectData(project)}
//                           disabled={downloading[project.id]}
//                           className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
//                           title="Télécharger les données"
//                         >
//                           <span className="material-symbols-outlined text-sm">
//                             {downloading[project.id] ? 'download' : 'download'}
//                           </span>
//                         </button>
//                         <button
//                           onClick={() => window.confirm(`Supprimer "${project.title}" ?`) && 
//                             setError(isDemoMode ? 'Action non disponible en mode démo' : `Suppression de "${project.title}"`) }
//                           className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
//                           title="Supprimer"
//                         >
//                           <span className="material-symbols-outlined text-sm">delete</span>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Explore;


// src/components/admin/Explore.jsx - VERSION AVEC BOUTON DÉTAIL
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth';

const Explore = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [downloading, setDownloading] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    pending: 0,
    draft: 0,
    rejected: 0
  });
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [apiInfo, setApiInfo] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [dbCount, setDbCount] = useState(0);
  const [endpointsFound, setEndpointsFound] = useState([]);
  const [activeEndpoint, setActiveEndpoint] = useState('');

  const navigate = useNavigate();

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'web', label: 'Développement Web' },
    { value: 'mobile', label: 'Application Mobile' },
    { value: 'ai', label: 'Intelligence Artificielle' },
    { value: 'data', label: 'Data Science' },
    { value: 'iot', label: 'IoT / Embedded' },
    { value: 'game', label: 'Jeux Vidéo' },
    { value: 'other', label: 'Autre' }
  ];

  const statuses = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'published', label: 'Publié' },
    { value: 'pending', label: 'En attente' },
    { value: 'draft', label: 'Brouillon' },
    { value: 'rejected', label: 'Rejeté' },
    { value: 'approved', label: 'Approuvé' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Plus récent' },
    { value: 'oldest', label: 'Plus ancien' },
    { value: 'az', label: 'A-Z' },
    { value: 'za', label: 'Z-A' }
  ];

  // ✅ DÉTECTER LES ENDPOINTS DJANGO
  const discoverDjangoEndpoints = async () => {
    console.log('🔍 Recherche des endpoints Django...');
    
    const endpointsToTest = [
      'http://localhost:8000/api/projects/projects/',
      'http://localhost:8000/api/users/with-projects/',
      'http://localhost:8000/api/projects/projects-with-users/',
      'http://localhost:8000/api/projects/projects-grouped/',
      'http://localhost:8000/api/projects/stats/',
      'http://localhost:8000/api/projects/projects/debug/',
      'http://localhost:8000/api/status/',
      'http://localhost:8000/api/users/'
    ];
    
    const foundEndpoints = [];
    
    for (const endpoint of endpointsToTest) {
      try {
        const response = await fetch(endpoint);
        
        if (response.ok) {
          const data = await response.json();
          foundEndpoints.push({
            url: endpoint,
            data: data,
            status: 'success',
            count: data.count || data.projects?.length || data.users_with_projects?.length || 0
          });
          
          if (endpoint.includes('/status/')) {
            setApiInfo(data);
            setDbCount(data.database?.projects_count || data.projects_count || 0);
          }
          
          if (endpoint.includes('/api/projects/projects/') && data.projects && Array.isArray(data.projects)) {
            return { 
              projectsEndpoint: endpoint, 
              projectsData: data.projects,
              allEndpoints: foundEndpoints 
            };
          }
          
          if (endpoint.includes('/users/with-projects/') && data.users && Array.isArray(data.users)) {
            const userProjects = data.users.flatMap(user => 
              user.projects?.items || []
            );
            if (userProjects.length > 0) {
              return { 
                projectsEndpoint: endpoint, 
                projectsData: userProjects,
                allEndpoints: foundEndpoints 
              };
            }
          }
          
          if (endpoint.includes('/projects-with-users/') && data.users_with_projects && Array.isArray(data.users_with_projects)) {
            const allProjects = data.users_with_projects.flatMap(user => user.projects || []);
            if (allProjects.length > 0) {
              return { 
                projectsEndpoint: endpoint, 
                projectsData: allProjects,
                allEndpoints: foundEndpoints 
              };
            }
          }
        }
      } catch (err) {
        foundEndpoints.push({
          url: endpoint,
          error: err.message,
          status: 'error'
        });
      }
    }
    
    setEndpointsFound(foundEndpoints);
    
    if (foundEndpoints.length === 0) {
      setIsDemoMode(true);
      return { projectsEndpoint: null, projectsData: [], allEndpoints: foundEndpoints };
    }
    
    const firstValidEndpoint = foundEndpoints.find(ep => ep.status === 'success');
    if (firstValidEndpoint) {
      return { 
        projectsEndpoint: firstValidEndpoint.url, 
        projectsData: firstValidEndpoint.data.projects || firstValidEndpoint.data || [],
        allEndpoints: foundEndpoints 
      };
    }
    
    return { projectsEndpoint: null, projectsData: [], allEndpoints: foundEndpoints };
  };

  // ✅ CHARGER LES PROJETS
  const loadRealProjects = async () => {
    try {
      const { projectsEndpoint, projectsData, allEndpoints } = await discoverDjangoEndpoints();
      setEndpointsFound(allEndpoints);
      
      if (projectsEndpoint && projectsData && projectsData.length > 0) {
        setIsDemoMode(false);
        setActiveEndpoint(projectsEndpoint);
        
        const transformedProjects = projectsData.map((project, index) => {
          let authorInfo = {};
          let authorName = '';
          let authorEmail = '';
          let authorUsername = '';
          
          if (project.author) {
            if (typeof project.author === 'object') {
              authorInfo = {
                id: project.author.id || index + 1,
                username: project.author.username || `user${index + 1}`,
                first_name: project.author.first_name || '',
                last_name: project.author.last_name || '',
                email: project.author.email || '',
                is_staff: project.author.is_staff || false
              };
              authorName = project.author.first_name && project.author.last_name 
                ? `${project.author.first_name} ${project.author.last_name}`
                : project.author.username || '';
              authorEmail = project.author.email || '';
              authorUsername = project.author.username || '';
            }
          }
          
          if (!authorName && project.author_name) authorName = project.author_name;
          if (!authorEmail && project.author_email) authorEmail = project.author_email;
          if (!authorUsername && project.author_username) authorUsername = project.author_username;
          
          if (!authorName && !authorEmail && !authorUsername) {
            authorInfo = {
              id: project.author_id || index + 1,
              username: `user${project.author_id || index + 1}`,
              first_name: 'Utilisateur',
              last_name: project.author_id ? `#${project.author_id}` : '',
              email: `user${project.author_id || index + 1}@simplon.local`,
              is_staff: false
            };
            authorName = authorInfo.username;
            authorEmail = authorInfo.email;
            authorUsername = authorInfo.username;
          }
          
          const status = project.status || 'draft';
          const isPublished = status === 'published' || project.is_published === true;
          const isDraft = status === 'draft' || project.is_draft === true;
          const isRejected = status === 'rejected' || project.is_rejected === true;
          const isApproved = status === 'approved' || project.is_approved === true;
          
          let category = project.category || 'web';
          if (!categories.find(c => c.value === category)) category = 'web';
          
          return {
            id: project.id || index + 1,
            title: project.title || project.name || 'Sans titre',
            description: project.description || project.short_description || '',
            full_description: project.full_description || project.content || project.details || '',
            technologies: project.technologies || project.tech_stack || project.tags || '',
            category: category,
            status: status,
            cohort: project.cohort || 'Promotion 2024',
            github_url: project.github_url || project.github_repo || project.repository_url || '',
            demo_url: project.demo_url || project.live_url || project.website || '',
            image: project.image || project.screenshot || project.featured_image || project.thumbnail,
            created_at: project.created_at || project.date_created || new Date().toISOString(),
            updated_at: project.updated_at || project.date_updated || new Date().toISOString(),
            
            user: {
              id: authorInfo.id || project.author_id || index + 1,
              username: authorUsername || authorInfo.username,
              first_name: authorInfo.first_name || authorName.split(' ')[0] || '',
              last_name: authorInfo.last_name || authorName.split(' ').slice(1).join(' ') || '',
              email: authorEmail || authorInfo.email,
              is_staff: authorInfo.is_staff || false
            },
            
            author_name: authorName,
            author_email: authorEmail,
            author_username: authorUsername,
            
            is_published: isPublished,
            is_draft: isDraft,
            is_rejected: isRejected,
            is_approved: isApproved,
            is_pending: status === 'pending' || status === 'review'
          };
        });
        
        return transformedProjects;
      }
      
      setIsDemoMode(true);
      return getDemoProjects();
      
    } catch (error) {
      setIsDemoMode(true);
      return getDemoProjects();
    }
  };

  // ✅ FONCTION PRINCIPALE
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      
      const projectsData = await loadRealProjects();
      
      setProjects(projectsData);
      
      const statsData = {
        total: projectsData.length,
        published: projectsData.filter(p => 
          p.status === 'published' || 
          p.is_published === true ||
          p.status === 'approved' ||
          p.is_approved === true
        ).length,
        pending: projectsData.filter(p => 
          p.status === 'pending' || 
          p.is_pending === true
        ).length,
        draft: projectsData.filter(p => 
          p.status === 'draft' || 
          p.is_draft === true
        ).length,
        rejected: projectsData.filter(p => 
          p.status === 'rejected' || 
          p.is_rejected === true
        ).length
      };
      setStats(statsData);

      if (isDemoMode) {
        setError(`⚠️ Mode démo - Données fictives (${dbCount > 0 ? dbCount + ' projets réels en base' : 'Base non accessible'})`);
      } else {
        setError(`✅ Mode production - ${projectsData.length} projets réels chargés depuis Django`);
      }

    } catch (error) {
      const demoProjects = getDemoProjects();
      setProjects(demoProjects);
      setIsDemoMode(true);
      
      const statsData = {
        total: demoProjects.length,
        published: 4,
        pending: 2,
        draft: 3,
        rejected: 1
      };
      setStats(statsData);
      
      setError(`❌ ${error.message} - Mode démo activé`);
      
    } finally {
      setLoading(false);
    }
  };

  // ✅ DONNÉES DE DÉMONSTRATION
  const getDemoProjects = () => {
    return [
      {
        id: 1,
        title: "Portfolio React Modern",
        user: {
          id: 1,
          username: "lea.martin",
          first_name: "Léa",
          last_name: "Martin",
          email: "lea.martin@example.com",
          is_staff: false
        },
        cohort: "DWWM - Mars 2024",
        category: "web",
        status: "published",
        is_published: true,
        technologies: "React, TypeScript, Tailwind CSS",
        description: "Portfolio moderne développé avec React, TypeScript et Tailwind CSS",
        full_description: "Ce portfolio moderne a été développé en utilisant les dernières technologies front-end. Il présente mes compétences en développement web avec des animations fluides, un design responsive et une architecture modulaire.",
        image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        github_url: "https://github.com/example/portfolio-react",
        demo_url: "https://portfolio-react-demo.netlify.app",
        created_at: "2024-03-15T10:30:00Z",
        author_name: "Léa Martin",
        author_email: "lea.martin@example.com"
      },
      {
        id: 2,
        title: "Application E-commerce",
        user: {
          id: 2,
          username: "mohamed.ali",
          first_name: "Mohamed",
          last_name: "Ali",
          email: "mohamed.ali@example.com",
          is_staff: false
        },
        cohort: "CDA - Avril 2024",
        category: "web",
        status: "pending",
        is_pending: true,
        technologies: "React, Node.js, MongoDB, Express",
        description: "Une application e-commerce complète avec panier et paiement",
        full_description: "Application e-commerce complète avec système de panier, authentification utilisateur, intégration de paiement Stripe, et tableau de bord administrateur. Utilise une architecture MERN (MongoDB, Express, React, Node.js).",
        github_url: "https://github.com/example/ecommerce-app",
        demo_url: "https://ecommerce-demo.vercel.app",
        created_at: "2024-04-20T14:15:00Z",
        author_name: "Mohamed Ali",
        author_email: "mohamed.ali@example.com"
      },
      {
        id: 3,
        title: "Jeu JavaScript",
        user: {
          id: 3,
          username: "sophie123",
          first_name: "Sophie",
          last_name: "",
          email: "sophie@example.com",
          is_staff: false
        },
        cohort: "DWWM - Février 2024",
        category: "game",
        status: "draft",
        is_draft: true,
        technologies: "JavaScript, HTML5, Canvas, CSS3",
        description: "Un jeu en JavaScript utilisant Canvas",
        full_description: "Jeu développé en JavaScript pur utilisant l'API Canvas. Le jeu implémente un système de collision, des animations fluides et une gestion des scores. Compatible avec tous les navigateurs modernes.",
        github_url: "https://github.com/example/javascript-game",
        demo_url: "https://js-game-demo.netlify.app",
        created_at: "2024-02-10T09:45:00Z",
        author_name: "Sophie",
        author_email: "sophie@example.com"
      }
    ];
  };

  // ✅ NAVIGUER VERS LA PAGE DE DÉTAIL
  const handleViewDetails = (project) => {
    // Stocker le projet dans le sessionStorage pour l'utiliser sur la page de détail
    sessionStorage.setItem('selectedProject', JSON.stringify(project));
    
    // Naviguer vers la page de détail
    navigate(`/admin/projects/${project.id}`);
  };

  // ✅ TÉLÉCHARGER LES DONNÉES D'UN PROJET
  const downloadProjectData = async (project) => {
    if (!project) return;
    
    setDownloading(prev => ({ ...prev, [project.id]: true }));
    
    try {
      let dataToExport;
      
      if (isDemoMode) {
        dataToExport = project;
      } else {
        try {
          const response = await fetch(`${activeEndpoint}${project.id}/`);
          if (response.ok) {
            dataToExport = await response.json();
          } else {
            dataToExport = project;
          }
        } catch (error) {
          dataToExport = project;
        }
      }
      
      const projectDataStr = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([projectDataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `projet-${project.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      setError('Erreur lors du téléchargement des données');
    } finally {
      setTimeout(() => {
        setDownloading(prev => ({ ...prev, [project.id]: false }));
      }, 500);
    }
  };

  // ✅ TÉLÉCHARGER TOUS LES PROJETS (CSV)
  const downloadAllProjectsCSV = () => {
    try {
      const headers = ['ID', 'Titre', 'Auteur', 'Email', 'Cohorte', 'Catégorie', 'Statut', 'Technologies', 'GitHub', 'Démo', 'Date de création'];
      
      const csvRows = [
        headers.join(','),
        ...filteredProjects.map(project => {
          const row = [
            project.id,
            `"${project.title.replace(/"/g, '""')}"`,
            `"${getAuthorName(project).replace(/"/g, '""')}"`,
            `"${project.user?.email || project.author_email || ''}"`,
            `"${project.cohort || ''}"`,
            `"${project.category || ''}"`,
            `"${project.status || ''}"`,
            `"${getTechnologies(project).join(', ').replace(/"/g, '""')}"`,
            `"${project.github_url || ''}"`,
            `"${project.demo_url || ''}"`,
            `"${formatDate(project.created_at)}"`
          ];
          return row.join(',');
        })
      ];
      
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `tous-les-projets-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Erreur lors de l\'export CSV:', error);
      setError('Erreur lors de l\'export des données');
    }
  };

  const getProjectImage = (project) => {
    if (!project) return null;
    
    const imageFields = ['image', 'screenshot', 'thumbnail', 'cover_image', 'featured_image', 'project_image'];
    
    for (const field of imageFields) {
      if (project[field]) {
        const imageValue = project[field];
        
        if (typeof imageValue === 'string') {
          if (imageValue.startsWith('http')) return imageValue;
          if (imageValue.startsWith('/media/') || imageValue.startsWith('/static/')) {
            return `http://localhost:8000${imageValue}`;
          }
          if (imageValue.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
            return `http://localhost:8000/media/${imageValue}`;
          }
        }
      }
    }
    
    const defaultImages = {
      web: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      mobile: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      ai: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      data: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      iot: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      game: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      other: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    };
    
    const category = project.category || project.project_category || 'other';
    return defaultImages[category] || defaultImages.other;
  };

  const getAuthorName = (project) => {
    if (!project) return 'Auteur inconnu';
    
    if (project.author_name) return project.author_name;
    
    if (project.user) {
      if (project.user.first_name && project.user.last_name) {
        return `${project.user.first_name} ${project.user.last_name}`;
      }
      if (project.user.first_name) return project.user.first_name;
      if (project.user.last_name) return project.user.last_name;
      if (project.user.username) return project.user.username;
      if (project.user.email) return project.user.email.split('@')[0];
    }
    
    if (project.author_username) return project.author_username;
    if (project.author_email) return project.author_email.split('@')[0];
    
    return 'Auteur inconnu';
  };

  const getCohortName = (project) => {
    if (!project) return null;
    return project.cohort || project.user?.cohort || null;
  };

  const getTechnologies = (project) => {
    if (!project) return [];
    
    if (project.technologies) {
      if (Array.isArray(project.technologies)) return project.technologies;
      if (typeof project.technologies === 'string') {
        return project.technologies.split(',').map(t => t.trim()).filter(t => t.length > 0);
      }
    }
    
    return [];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  const getProjectLinks = (project) => {
    const links = {
      github: null,
      demo: null
    };
    
    if (!project) return links;
    
    const githubFields = ['github_url', 'github_repo', 'repository_url', 'github', 'repo_url'];
    for (const field of githubFields) {
      if (project[field]) {
        let url = project[field];
        if (url && !url.startsWith('http')) url = `https://${url}`;
        links.github = url;
        break;
      }
    }
    
    const demoFields = ['demo_url', 'live_url', 'website', 'demo', 'url'];
    for (const field of demoFields) {
      if (project[field]) {
        let url = project[field];
        if (url && !url.startsWith('http')) url = `https://${url}`;
        links.demo = url;
        break;
      }
    }
    
    return links;
  };

  const filterAndSortProjects = () => {
    let filtered = [...projects];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(project => {
        const titleMatch = project.title?.toLowerCase().includes(searchLower) || false;
        const descMatch = project.description?.toLowerCase().includes(searchLower) || false;
        const authorMatch = getAuthorName(project).toLowerCase().includes(searchLower);
        const techMatch = getTechnologies(project).some(tech => 
          tech.toLowerCase().includes(searchLower)
        );
        const cohortMatch = getCohortName(project)?.toLowerCase().includes(searchLower) || false;
        
        return titleMatch || descMatch || authorMatch || techMatch || cohortMatch;
      });
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(project => {
        const projectCategory = (project.category || 'other').toLowerCase();
        return projectCategory === categoryFilter;
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => {
        const status = project.status?.toLowerCase() || 'draft';
        return status === statusFilter;
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'az':
          return (a.title || '').localeCompare(b.title || '');
        case 'za':
          return (b.title || '').localeCompare(a.title || '');
        default:
          return 0;
      }
    });

    setFilteredProjects(filtered);
  };

  const getStatusBadge = (project) => {
    const status = project.status?.toLowerCase() || 'draft';
    const isPublished = project.is_published || status === 'published' || status === 'approved';
    const isDraft = project.is_draft || status === 'draft';
    const isRejected = project.is_rejected || status === 'rejected';
    const isPending = project.is_pending || status === 'pending';
    
    let label = 'Inconnu';
    let color = 'bg-gray-100 text-gray-800';
    
    if (isPublished) {
      label = 'Publié';
      color = 'bg-green-100 text-green-800';
    } else if (isDraft) {
      label = 'Brouillon';
      color = 'bg-gray-100 text-gray-800';
    } else if (isRejected) {
      label = 'Rejeté';
      color = 'bg-red-100 text-red-800';
    } else if (isPending) {
      label = 'En attente';
      color = 'bg-yellow-100 text-yellow-800';
    } else if (status === 'approved') {
      label = 'Approuvé';
      color = 'bg-blue-100 text-blue-800';
    }
    
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };

  const getCategoryIcon = (category) => {
    const icons = {
      web: 'language',
      mobile: 'smartphone',
      ai: 'smart_toy',
      data: 'bar_chart',
      iot: 'settings_input_antenna',
      game: 'sports_esports',
      other: 'category'
    };
    return icons[category] || 'folder';
  };

  const handleManualSearch = async () => {
    setLoading(true);
    try {
      const { projectsEndpoint, projectsData } = await discoverDjangoEndpoints();
      
      if (projectsEndpoint && projectsData.length > 0) {
        setProjects(projectsData);
        setIsDemoMode(false);
        setActiveEndpoint(projectsEndpoint);
        setError(`✅ ${projectsData.length} projets trouvés sur ${projectsEndpoint}`);
      } else {
        setError('❌ Aucun endpoint de projets trouvé. Mode démo activé.');
        setProjects(getDemoProjects());
        setIsDemoMode(true);
      }
    } catch (error) {
      setError(`❌ Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterAndSortProjects();
  }, [projects, searchTerm, categoryFilter, statusFilter, sortBy]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E30613] mb-6"></div>
        <p className="text-xl font-medium text-gray-700 mb-2 text-center">Chargement des projets...</p>
        <p className="text-gray-600 text-center max-w-md">
          {isDemoMode ? 'Chargement des données démo' : 'Connexion à l\'API Django en cours'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* En-tête avec informations */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#001F3F] mb-3">
              Administration des Projets
            </h1>
            <div className="space-y-2">
              <p className="text-gray-700 text-sm lg:text-base">
                {user ? `👤 Connecté en tant que: ${user.first_name || user.username || user.email}` : '🔒 Non connecté'}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${isDemoMode ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                  {isDemoMode ? '⚠️ Mode démo' : '✅ Mode production'}
                </span>
                <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  📊 {stats.total} projet{stats.total !== 1 ? 's' : ''}
                </span>
                {dbCount > 0 && (
                  <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                    🗄️ {dbCount} en base
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Actions */}
          {/* <div className="flex flex-col gap-3 min-w-[280px] max-w-full">
            <button
              onClick={handleManualSearch}
              className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 font-medium text-sm lg:text-base"
            >
              <span className="material-symbols-outlined text-lg">search</span>
              Rechercher les projets
            </button>
            
            <button
              onClick={handleRefresh}
              className="px-4 py-3 bg-[#001F3F] text-white rounded-xl hover:bg-[#003265] transition-all flex items-center justify-center gap-2 font-medium text-sm lg:text-base"
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
              Actualiser
            </button>
            
            {filteredProjects.length > 0 && (
              <button
                onClick={downloadAllProjectsCSV}
                className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 font-medium text-sm lg:text-base"
              >
                <span className="material-symbols-outlined text-lg">download</span>
                Exporter tous ({filteredProjects.length})
              </button>
            )}
          </div> */}
        </div>
        
        {/* Messages d'information/erreur */}
        {error && (
          <div className="mt-6">
            <div className={`p-4 rounded-xl ${
              error.includes('✅') ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300' : 
              error.includes('⚠️') ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-300' : 
              'bg-gradient-to-r from-red-50 to-pink-50 border border-red-300'
            }`}>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-xl mt-0.5">
                  {error.includes('✅') ? 'check_circle' : 
                   error.includes('⚠️') ? 'warning' : 'error'}
                </span>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    error.includes('✅') ? 'text-green-800' : 
                    error.includes('⚠️') ? 'text-yellow-800' : 'text-red-800'
                  }`}>
                    {error}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-[#001F3F]">{stats.total}</p>
            </div>
            <span className="material-symbols-outlined text-[#E30613] text-3xl opacity-80">
              layers
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-green-50 rounded-xl p-4 shadow border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Publiés</p>
              <p className="text-2xl font-bold text-green-600">{stats.published}</p>
            </div>
            <span className="material-symbols-outlined text-green-500 text-3xl opacity-80">
              check_circle
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-yellow-50 rounded-xl p-4 shadow border border-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <span className="material-symbols-outlined text-yellow-500 text-3xl opacity-80">
              schedule
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Brouillons</p>
              <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
            </div>
            <span className="material-symbols-outlined text-gray-500 text-3xl opacity-80">
              draft
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-red-50 rounded-xl p-4 shadow border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Rejetés</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <span className="material-symbols-outlined text-red-500 text-3xl opacity-80">
              block
            </span>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow p-5 mb-8 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          {/* Recherche */}
          <div className="lg:col-span-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] bg-white text-gray-800"
              />
            </div>
          </div>

          {/* Catégorie */}
          <div className="lg:col-span-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] bg-white text-gray-800"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Statut */}
          <div className="lg:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] bg-white text-gray-800"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          {/* Tri */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 h-full">
              <span className="text-gray-600 text-sm whitespace-nowrap">Trier:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] bg-white text-gray-800"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Export */}
          <div className="lg:col-span-2">
            <button
              onClick={downloadAllProjectsCSV}
              disabled={filteredProjects.length === 0}
              className={`w-full px-3 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                filteredProjects.length === 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#001F3F] to-[#003265] text-white hover:opacity-90'
              }`}
            >
              <span className="material-symbols-outlined">download</span>
              <span className="hidden sm:inline">Exporter</span>
            </button>
          </div>
        </div>
        
        {/* Résumé filtres */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">
                {filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''}
                {searchTerm && ` pour "${searchTerm}"`}
              </span>
              {(categoryFilter !== 'all' || statusFilter !== 'all') && (
                <div className="flex flex-wrap gap-2">
                  {categoryFilter !== 'all' && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {categories.find(c => c.value === categoryFilter)?.label}
                    </span>
                  )}
                  {statusFilter !== 'all' && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      {statuses.find(s => s.value === statusFilter)?.label}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grille de projets */}
      <div className="mb-8">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-inner border border-dashed border-gray-300">
            <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">
              search_off
            </span>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              Aucun projet trouvé
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
              Aucun projet ne correspond à vos critères de recherche.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setStatusFilter('all');
              }}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProjects.map(project => {
              const projectImage = getProjectImage(project);
              const authorName = getAuthorName(project);
              const cohortName = getCohortName(project);
              const technologies = getTechnologies(project);
              const formattedDate = formatDate(project.created_at);
              const projectLinks = getProjectLinks(project);
              
              return (
                <div 
                  key={project.id} 
                  className="group flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:border-[#E30613] hover:shadow-lg"
                >
                  {/* Image du projet */}
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {projectImage ? (
                      <img 
                        src={projectImage} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.classList.add('bg-gradient-to-br', 'from-blue-50', 'to-indigo-100');
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                        <span className="material-symbols-outlined text-gray-400 text-5xl">
                          {getCategoryIcon(project.category)}
                        </span>
                      </div>
                    )}
                    
                    {/* Badge de statut */}
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(project)}
                    </div>
                  </div>
                  
                  {/* Contenu */}
                  <div className="flex-1 p-4">
                    <div className="mb-3">
                      <h3 className="text-base font-bold text-[#001F3F] mb-1 line-clamp-1">
                        {project.title}
                      </h3>
                      
                      {project.description && (
                        <p className="text-gray-600 text-xs line-clamp-2 mb-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                    
                    {/* Infos auteur et date */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                          {authorName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 text-sm truncate">{authorName}</p>
                          <p className="text-xs text-gray-500">{formattedDate}</p>
                        </div>
                      </div>
                      
                      {cohortName && (
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <span className="material-symbols-outlined text-sm">school</span>
                          <span className="truncate">{cohortName}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Technologies */}
                    {technologies.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {technologies.slice(0, 2).map((tech, index) => (
                            <span 
                              key={index}
                              className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200"
                            >
                              {tech.length > 15 ? tech.substring(0, 15) + '...' : tech}
                            </span>
                          ))}
                          {technologies.length > 2 && (
                            <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded">
                              +{technologies.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="px-4 pb-4 pt-0">
                    <div className="flex items-center justify-between gap-2">
                      {/* Liens */}
                      <div className="flex gap-1">
                        {/* Bouton Détail */}
                        <button
                          onClick={() => handleViewDetails(project)}
                          className="px-3 py-1.5 bg-[#001F3F] text-white rounded text-xs font-medium flex items-center gap-1 hover:bg-[#003265] transition-colors"
                          title="Voir les détails"
                        >
                          <span className="material-symbols-outlined text-xs">visibility</span>
                          Détail
                        </button>
                      </div>
                      
                      {/* Actions admin */}
                      <div className="flex items-center gap-1">
                        {(projectLinks.github || projectLinks.demo) && (
                          <>
                            {projectLinks.github && (
                              <a
                                href={projectLinks.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-gray-900 text-white rounded hover:bg-black transition-colors"
                                title="GitHub"
                              >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                                </svg>
                              </a>
                            )}
                            {projectLinks.demo && (
                              <a
                                href={projectLinks.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded hover:opacity-90"
                                title="Démo"
                              >
                                <span className="material-symbols-outlined text-xs">open_in_new</span>
                              </a>
                            )}
                          </>
                        )}
                        
                        <button
                          onClick={() => downloadProjectData(project)}
                          disabled={downloading[project.id]}
                          className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                          title="Télécharger les données"
                        >
                          <span className="material-symbols-outlined text-sm">
                            {downloading[project.id] ? 'download' : 'download'}
                          </span>
                        </button>
                        <button
                          onClick={() => window.confirm(`Supprimer "${project.title}" ?`) && 
                            setError(isDemoMode ? 'Action non disponible en mode démo' : `Suppression de "${project.title}"`) }
                          className="p-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          title="Supprimer"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;