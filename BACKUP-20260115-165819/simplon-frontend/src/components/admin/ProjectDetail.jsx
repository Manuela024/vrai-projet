// // src/components/admin/ProjectDetail.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import authService from '../../services/auth';

// const ProjectDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
  
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
//   const [isDemoMode, setIsDemoMode] = useState(false);
//   const [activeTab, setActiveTab] = useState('details');
//   const [downloading, setDownloading] = useState(false);

//   // ✅ CHARGER LES DONNÉES DU PROJET
//   const fetchProjectData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const currentUser = authService.getCurrentUser();
//       setUser(currentUser);
      
//       // Essayer de récupérer depuis sessionStorage d'abord
//       const storedProject = sessionStorage.getItem('selectedProject');
//       if (storedProject) {
//         const parsedProject = JSON.parse(storedProject);
//         if (parsedProject.id == id) {
//           setProject(parsedProject);
//           setLoading(false);
//           return;
//         }
//       }
      
//       // Si pas dans sessionStorage, essayer l'API Django
//       try {
//         const endpointsToTry = [
//           `http://localhost:8000/api/projects/projects/${id}/`,
//           `http://localhost:8000/api/projects/projects/${id}`,
//           `http://localhost:8000/api/projects/${id}/`
//         ];
        
//         let projectData = null;
        
//         for (const endpoint of endpointsToTry) {
//           try {
//             const response = await fetch(endpoint);
//             if (response.ok) {
//               projectData = await response.json();
//               console.log('✅ Projet chargé depuis API:', endpoint);
//               setIsDemoMode(false);
//               break;
//             }
//           } catch (err) {
//             console.log(`❌ ${endpoint}: ${err.message}`);
//           }
//         }
        
//         if (projectData) {
//           // Transformer les données si nécessaire
//           const transformedProject = transformProjectData(projectData);
//           setProject(transformedProject);
//         } else {
//           throw new Error('Projet non trouvé dans l\'API');
//         }
        
//       } catch (apiError) {
//         // Mode démo si l'API échoue
//         console.log('📦 Passage en mode démo');
//         setIsDemoMode(true);
//         const demoProject = getDemoProject(id);
//         if (demoProject) {
//           setProject(demoProject);
//         } else {
//           throw new Error('Projet non trouvé');
//         }
//       }
      
//     } catch (error) {
//       console.error('❌ Erreur chargement projet:', error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ TRANSFORMER LES DONNÉES DE L'API
//   const transformProjectData = (projectData) => {
//     let authorInfo = {};
//     let authorName = '';
//     let authorEmail = '';
//     let authorUsername = '';
    
//     if (projectData.author) {
//       if (typeof projectData.author === 'object') {
//         authorInfo = {
//           id: projectData.author.id || 1,
//           username: projectData.author.username || `user${projectData.author.id || 1}`,
//           first_name: projectData.author.first_name || '',
//           last_name: projectData.author.last_name || '',
//           email: projectData.author.email || '',
//           is_staff: projectData.author.is_staff || false
//         };
//         authorName = projectData.author.first_name && projectData.author.last_name 
//           ? `${projectData.author.first_name} ${projectData.author.last_name}`
//           : projectData.author.username || '';
//         authorEmail = projectData.author.email || '';
//         authorUsername = projectData.author.username || '';
//       }
//     }
    
//     if (!authorName && projectData.author_name) authorName = projectData.author_name;
//     if (!authorEmail && projectData.author_email) authorEmail = projectData.author_email;
//     if (!authorUsername && projectData.author_username) authorUsername = projectData.author_username;
    
//     if (!authorName && !authorEmail && !authorUsername) {
//       authorInfo = {
//         id: projectData.author_id || 1,
//         username: `user${projectData.author_id || 1}`,
//         first_name: 'Utilisateur',
//         last_name: projectData.author_id ? `#${projectData.author_id}` : '',
//         email: `user${projectData.author_id || 1}@simplon.local`,
//         is_staff: false
//       };
//       authorName = authorInfo.username;
//       authorEmail = authorInfo.email;
//       authorUsername = authorInfo.username;
//     }
    
//     const status = projectData.status || 'draft';
//     const isPublished = status === 'published' || projectData.is_published === true;
//     const isDraft = status === 'draft' || projectData.is_draft === true;
//     const isRejected = status === 'rejected' || projectData.is_rejected === true;
//     const isApproved = status === 'approved' || projectData.is_approved === true;
    
//     return {
//       id: projectData.id || id,
//       title: projectData.title || projectData.name || 'Sans titre',
//       description: projectData.description || projectData.short_description || '',
//       full_description: projectData.full_description || projectData.content || projectData.details || 
//                        projectData.description || 'Aucune description détaillée disponible.',
//       technologies: projectData.technologies || projectData.tech_stack || projectData.tags || '',
//       category: projectData.category || 'web',
//       status: status,
//       cohort: projectData.cohort || 'Promotion 2024',
//       github_url: projectData.github_url || projectData.github_repo || projectData.repository_url || '',
//       demo_url: projectData.demo_url || projectData.live_url || projectData.website || '',
//       image: projectData.image || projectData.screenshot || projectData.featured_image || projectData.thumbnail,
//       created_at: projectData.created_at || projectData.date_created || new Date().toISOString(),
//       updated_at: projectData.updated_at || projectData.date_updated || new Date().toISOString(),
      
//       user: {
//         id: authorInfo.id || projectData.author_id || 1,
//         username: authorUsername || authorInfo.username,
//         first_name: authorInfo.first_name || authorName.split(' ')[0] || '',
//         last_name: authorInfo.last_name || authorName.split(' ').slice(1).join(' ') || '',
//         email: authorEmail || authorInfo.email,
//         is_staff: authorInfo.is_staff || false
//       },
      
//       author_name: authorName,
//       author_email: authorEmail,
//       author_username: authorUsername,
      
//       is_published: isPublished,
//       is_draft: isDraft,
//       is_rejected: isRejected,
//       is_approved: isApproved,
//       is_pending: status === 'pending' || status === 'review'
//     };
//   };

//   // ✅ DONNÉES DE DÉMONSTRATION
//   const getDemoProject = (projectId) => {
//     const demoProjects = {
//       1: {
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
//         technologies: "React, TypeScript, Tailwind CSS, Vite, ESLint",
//         description: "Portfolio moderne développé avec React, TypeScript et Tailwind CSS",
//         full_description: `
// # Portfolio React Modern

// ## Description du projet
// Ce portfolio moderne a été développé en utilisant les dernières technologies front-end. Il présente mes compétences en développement web avec des animations fluides, un design responsive et une architecture modulaire.

// ## Fonctionnalités principales
// - **Design responsive** : Adapté à tous les appareils (mobile, tablette, desktop)
// - **Animations fluides** : Utilisation de Framer Motion pour des transitions élégantes
// - **Mode sombre/clair** : Support des préférences utilisateur
// - **Optimisation SEO** : Métadonnées et structure sémantique optimisées
// - **Performance** : Score Lighthouse de 95+ sur mobile et desktop

// ## Architecture technique
// - **Frontend** : React 18 avec TypeScript
// - **Styling** : Tailwind CSS avec configuration personnalisée
// - **Build tool** : Vite pour un développement rapide
// - **Linting** : ESLint + Prettier pour un code propre
// - **Deploiement** : Netlify avec CI/CD intégré

// ## Défis relevés
// - Implémentation d'un système de thèmes dynamique
// - Optimisation des performances pour un chargement rapide
// - Création d'un design cohérent sur toutes les plateformes

// ## Compétences démontrées
// - Développement frontend moderne
// - Responsive design
// - Optimisation des performances
// - Déploiement continu
//         `,
//         image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//         github_url: "https://github.com/example/portfolio-react",
//         demo_url: "https://portfolio-react-demo.netlify.app",
//         created_at: "2024-03-15T10:30:00Z",
//         updated_at: "2024-03-20T14:30:00Z",
//         author_name: "Léa Martin",
//         author_email: "lea.martin@example.com"
//       },
//       2: {
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
//         technologies: "React, Node.js, MongoDB, Express, Stripe, JWT",
//         description: "Une application e-commerce complète avec panier et paiement",
//         full_description: `
// # Application E-commerce Complète

// ## Description du projet
// Application e-commerce complète avec système de panier, authentification utilisateur, intégration de paiement Stripe, et tableau de bord administrateur. Utilise une architecture MERN (MongoDB, Express, React, Node.js).

// ## Fonctionnalités principales
// - **Catalogue produits** : Filtrage, recherche, pagination
// - **Système de panier** : Ajout/retrait, quantité, sauvegarde session
// - **Authentification** : Inscription, connexion, JWT, sessions
// - **Paiement** : Intégration Stripe, tunnel de paiement sécurisé
// - **Tableau de bord admin** : Gestion produits, commandes, utilisateurs
// - **Notifications** : Email de confirmation, suivi commande

// ## Architecture technique
// - **Frontend** : React avec Redux pour le state management
// - **Backend** : Node.js + Express API RESTful
// - **Base de données** : MongoDB avec Mongoose ODM
// - **Authentification** : JWT + bcrypt pour le hashage
// - **Paiement** : Stripe API avec webhooks
// - **Stockage** : Cloudinary pour les images produits

// ## Sécurité
// - Validation des inputs côté serveur
// - Protection CSRF
// - Rate limiting
// - HTTPS obligatoire
// - Données sensibles chiffrées

// ## Déploiement
// - **Frontend** : Vercel
// - **Backend** : Heroku
// - **Base de données** : MongoDB Atlas
// - **Monitoring** : Sentry pour les erreurs
//         `,
//         github_url: "https://github.com/example/ecommerce-app",
//         demo_url: "https://ecommerce-demo.vercel.app",
//         created_at: "2024-04-20T14:15:00Z",
//         updated_at: "2024-04-25T09:45:00Z",
//         author_name: "Mohamed Ali",
//         author_email: "mohamed.ali@example.com"
//       },
//       3: {
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
//         technologies: "JavaScript, HTML5, Canvas, CSS3, Web Audio API",
//         description: "Un jeu en JavaScript utilisant Canvas",
//         full_description: `
// # Jeu JavaScript avec Canvas

// ## Description du projet
// Jeu développé en JavaScript pur utilisant l'API Canvas. Le jeu implémente un système de collision, des animations fluides et une gestion des scores. Compatible avec tous les navigateurs modernes.

// ## Mécaniques de jeu
// - **Contrôles** : Clavier (flèches) et tactile (mobile)
// - **Physique** : Gravité, collisions, vitesse
// - **Système de score** : Points, niveaux, difficulté progressive
// - **Effets visuels** : Particules, animations, transitions
// - **Audio** : Effets sonores, musique de fond

// ## Technologies utilisées
// - **Canvas API** : Rendu graphique 2D
// - **Web Audio API** : Gestion du son
// - **Local Storage** : Sauvegarde des meilleurs scores
// - **CSS Grid/Flexbox** : Interface utilisateur responsive
// - **Service Worker** : Installation PWA possible

// ## Défis techniques
// - **Performance** : Optimisation du rendu à 60 FPS
// - **Responsive** : Adaptation aux différentes tailles d'écran
// - **Cross-browser** : Compatibilité avec tous les navigateurs
// - **Accessibilité** : Support des lecteurs d'écran

// ## Améliorations futures
// - Mode multijoueur en ligne
// - Éditeur de niveaux
// - Système d'achievements
// - Intégration avec Google Play Games
//         `,
//         github_url: "https://github.com/example/javascript-game",
//         demo_url: "https://js-game-demo.netlify.app",
//         created_at: "2024-02-10T09:45:00Z",
//         updated_at: "2024-02-15T16:20:00Z",
//         author_name: "Sophie",
//         author_email: "sophie@example.com"
//       }
//     };
    
//     return demoProjects[projectId] || null;
//   };

//   // ✅ TÉLÉCHARGER LES DONNÉES DU PROJET
//   const downloadProjectData = async () => {
//     if (!project) return;
    
//     setDownloading(true);
    
//     try {
//       const projectDataStr = JSON.stringify(project, null, 2);
//       const blob = new Blob([projectDataStr], { type: 'application/json' });
//       const url = URL.createObjectURL(blob);
      
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `projet-${project.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-details-${new Date().toISOString().split('T')[0]}.json`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
      
//     } catch (error) {
//       console.error('Erreur lors du téléchargement:', error);
//       setError('Erreur lors du téléchargement des données');
//     } finally {
//       setTimeout(() => {
//         setDownloading(false);
//       }, 500);
//     }
//   };

//   // ✅ FORMATER LA DATE
//   const formatDate = (dateString) => {
//     if (!dateString) return 'Date inconnue';
    
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('fr-FR', {
//         weekday: 'long',
//         day: '2-digit',
//         month: 'long',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch (error) {
//       return 'Date invalide';
//     }
//   };

//   // ✅ OBTENIR LES TECHNOLOGIES
//   const getTechnologies = () => {
//     if (!project || !project.technologies) return [];
    
//     if (Array.isArray(project.technologies)) {
//       return project.technologies;
//     }
    
//     if (typeof project.technologies === 'string') {
//       return project.technologies.split(',').map(t => t.trim()).filter(t => t.length > 0);
//     }
    
//     return [];
//   };

//   // ✅ OBTENIR L'IMAGE DU PROJET
//   const getProjectImage = () => {
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
    
//     const category = project.category || 'other';
//     return defaultImages[category] || defaultImages.other;
//   };

//   // ✅ OBTENIR LE BADGE DE STATUT
//   const getStatusBadge = () => {
//     if (!project) return null;
    
//     const status = project.status?.toLowerCase() || 'draft';
//     const isPublished = project.is_published || status === 'published' || status === 'approved';
//     const isDraft = project.is_draft || status === 'draft';
//     const isRejected = project.is_rejected || status === 'rejected';
//     const isPending = project.is_pending || status === 'pending';
    
//     let label = 'Inconnu';
//     let color = 'bg-gray-100 text-gray-800';
//     let icon = 'help';
    
//     if (isPublished) {
//       label = 'Publié';
//       color = 'bg-green-100 text-green-800';
//       icon = 'check_circle';
//     } else if (isDraft) {
//       label = 'Brouillon';
//       color = 'bg-gray-100 text-gray-800';
//       icon = 'draft';
//     } else if (isRejected) {
//       label = 'Rejeté';
//       color = 'bg-red-100 text-red-800';
//       icon = 'block';
//     } else if (isPending) {
//       label = 'En attente';
//       color = 'bg-yellow-100 text-yellow-800';
//       icon = 'schedule';
//     } else if (status === 'approved') {
//       label = 'Approuvé';
//       color = 'bg-blue-100 text-blue-800';
//       icon = 'verified';
//     }
    
//     return { label, color, icon };
//   };

//   // ✅ OBTENIR LE NOM DE LA CATÉGORIE
//   const getCategoryLabel = () => {
//     if (!project) return 'Non catégorisé';
    
//     const categories = {
//       web: 'Développement Web',
//       mobile: 'Application Mobile',
//       ai: 'Intelligence Artificielle',
//       data: 'Data Science',
//       iot: 'IoT / Embedded',
//       game: 'Jeux Vidéo',
//       other: 'Autre'
//     };
    
//     return categories[project.category] || project.category || 'Non catégorisé';
//   };

//   // ✅ EFFET POUR CHARGER LES DONNÉES
//   useEffect(() => {
//     fetchProjectData();
//   }, [id]);

//   // ✅ AFFICHAGE CHARGEMENT
//   if (loading) {
//     return (
//       <div className="flex flex-col justify-center items-center min-h-screen p-4">
//         <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-[#E30613] mb-6"></div>
//         <p className="text-2xl font-medium text-gray-700 mb-2 text-center">Chargement du projet...</p>
//         <p className="text-gray-600 text-center max-w-md">
//           {isDemoMode ? 'Chargement des données démo' : 'Récupération des détails depuis l\'API'}
//         </p>
//       </div>
//     );
//   }

//   // ✅ AFFICHAGE ERREUR
//   if (error || !project) {
//     return (
//       <div className="max-w-4xl mx-auto px-4 py-8">
//         <div className="text-center py-12">
//           <span className="material-symbols-outlined text-6xl text-red-500 mb-4">
//             error
//           </span>
//           <h1 className="text-3xl font-bold text-gray-800 mb-4">Projet non trouvé</h1>
//           <p className="text-gray-600 mb-8">
//             {error || "Le projet demandé n'existe pas ou n'est pas accessible."}
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button
//               onClick={() => navigate('/admin/explore')}
//               className="px-6 py-3 bg-[#001F3F] text-white rounded-lg hover:bg-[#003265] transition-colors font-medium flex items-center justify-center gap-2"
//             >
//               <span className="material-symbols-outlined">arrow_back</span>
//               Retour aux projets
//             </button>
//             <button
//               onClick={fetchProjectData}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
//             >
//               <span className="material-symbols-outlined">refresh</span>
//               Réessayer
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const projectImage = getProjectImage();
//   const technologies = getTechnologies();
//   const statusBadge = getStatusBadge();
//   const createdDate = formatDate(project.created_at);
//   const updatedDate = formatDate(project.updated_at);

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       {/* En-tête */}
//       <div className="mb-8">
//         <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
//           <div className="flex-1">
//             <button
//               onClick={() => navigate('/admin/explore')}
//               className="inline-flex items-center gap-2 text-gray-600 hover:text-[#001F3F] mb-6 transition-colors"
//             >
//               <span className="material-symbols-outlined">arrow_back</span>
//               Retour aux projets
//             </button>
            
//             <div className="flex flex-wrap items-center gap-4 mb-4">
//               <h1 className="text-3xl lg:text-4xl font-bold text-[#001F3F]">
//                 {project.title}
//               </h1>
              
//               {statusBadge && (
//                 <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusBadge.color} flex items-center gap-2`}>
//                   <span className="material-symbols-outlined text-base">{statusBadge.icon}</span>
//                   {statusBadge.label}
//                 </span>
//               )}
//             </div>
            
//             <div className="flex flex-wrap items-center gap-4 text-gray-600">
//               <div className="flex items-center gap-2">
//                 <span className="material-symbols-outlined">person</span>
//                 <span className="font-medium">{project.author_name || project.user?.username}</span>
//               </div>
              
//               {project.cohort && (
//                 <div className="flex items-center gap-2">
//                   <span className="material-symbols-outlined">school</span>
//                   <span>{project.cohort}</span>
//                 </div>
//               )}
              
//               <div className="flex items-center gap-2">
//                 <span className="material-symbols-outlined">category</span>
//                 <span>{getCategoryLabel()}</span>
//               </div>
//             </div>
//           </div>
          
//           {/* Actions */}
//           <div className="flex flex-col gap-3">
//             <div className="flex gap-3">
//               {project.github_url && (
//                 <a
//                   href={project.github_url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors font-medium flex items-center justify-center gap-2"
//                 >
//                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
//                   </svg>
//                   GitHub
//                 </a>
//               )}
              
//               {project.demo_url && (
//                 <a
//                   href={project.demo_url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-all font-medium flex items-center justify-center gap-2"
//                 >
//                   <span className="material-symbols-outlined">open_in_new</span>
//                   Démo
//                 </a>
//               )}
//             </div>
            
//             <button
//               onClick={downloadProjectData}
//               disabled={downloading}
//               className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
//             >
//               <span className="material-symbols-outlined">
//                 {downloading ? 'download' : 'download'}
//               </span>
//               {downloading ? 'Téléchargement...' : 'Télécharger les données'}
//             </button>
//           </div>
//         </div>
        
//         {/* Mode info */}
//         {isDemoMode && (
//           <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//             <div className="flex items-center gap-3">
//               <span className="material-symbols-outlined text-yellow-600">warning</span>
//               <div>
//                 <p className="font-medium text-yellow-800">Mode démo activé</p>
//                 <p className="text-sm text-yellow-700">Les données affichées sont des données de démonstration.</p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Colonne gauche - Image et infos */}
//         <div className="lg:col-span-2 space-y-8">
//           {/* Image */}
//           {projectImage && (
//             <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
//               <div className="relative h-64 md:h-80 lg:h-96">
//                 <img 
//                   src={projectImage} 
//                   alt={project.title}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     e.target.style.display = 'none';
//                     e.target.parentElement.classList.add('bg-gradient-to-br', 'from-blue-50', 'to-indigo-100');
//                     e.target.parentElement.innerHTML = `
//                       <div class="w-full h-full flex flex-col items-center justify-center p-8">
//                         <span class="material-symbols-outlined text-gray-400 text-6xl mb-4">code</span>
//                         <p class="text-gray-600 text-center">Image non disponible</p>
//                       </div>
//                     `;
//                   }}
//                 />
//               </div>
//             </div>
//           )}

//           {/* Onglets */}
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//             {/* En-tête onglets */}
//             <div className="border-b border-gray-200">
//               <div className="flex overflow-x-auto">
//                 <button
//                   onClick={() => setActiveTab('details')}
//                   className={`px-6 py-4 font-medium text-sm md:text-base flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
//                     activeTab === 'details' 
//                       ? 'border-[#E30613] text-[#E30613]' 
//                       : 'border-transparent text-gray-600 hover:text-gray-900'
//                   }`}
//                 >
//                   <span className="material-symbols-outlined">description</span>
//                   Détails du projet
//                 </button>
                
//                 <button
//                   onClick={() => setActiveTab('technologies')}
//                   className={`px-6 py-4 font-medium text-sm md:text-base flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
//                     activeTab === 'technologies' 
//                       ? 'border-[#E30613] text-[#E30613]' 
//                       : 'border-transparent text-gray-600 hover:text-gray-900'
//                   }`}
//                 >
//                   <span className="material-symbols-outlined">code</span>
//                   Technologies
//                 </button>
                
//                 <button
//                   onClick={() => setActiveTab('author')}
//                   className={`px-6 py-4 font-medium text-sm md:text-base flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
//                     activeTab === 'author' 
//                       ? 'border-[#E30613] text-[#E30613]' 
//                       : 'border-transparent text-gray-600 hover:text-gray-900'
//                   }`}
//                 >
//                   <span className="material-symbols-outlined">person</span>
//                   Auteur
//                 </button>
//               </div>
//             </div>

//             {/* Contenu onglets */}
//             <div className="p-6">
//               {activeTab === 'details' && (
//                 <div className="space-y-6">
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-800 mb-3">Description</h3>
//                     <div className="prose max-w-none">
//                       <p className="text-gray-700 whitespace-pre-line">{project.full_description}</p>
//                     </div>
//                   </div>
                  
//                   {project.description && project.description !== project.full_description && (
//                     <div>
//                       <h3 className="text-xl font-bold text-gray-800 mb-3">Description courte</h3>
//                       <p className="text-gray-700">{project.description}</p>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {activeTab === 'technologies' && (
//                 <div className="space-y-6">
//                   <h3 className="text-xl font-bold text-gray-800">Stack technique</h3>
                  
//                   {technologies.length > 0 ? (
//                     <div className="flex flex-wrap gap-3">
//                       {technologies.map((tech, index) => (
//                         <span 
//                           key={index}
//                           className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg border border-blue-200 font-medium"
//                         >
//                           {tech}
//                         </span>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-gray-500 italic">Aucune technologie spécifiée</p>
//                   )}
//                 </div>
//               )}

//               {activeTab === 'author' && (
//                 <div className="space-y-6">
//                   <div className="flex items-center gap-4">
//                     <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
//                       {project.author_name?.charAt(0)?.toUpperCase() || 'U'}
//                     </div>
//                     <div>
//                       <h3 className="text-2xl font-bold text-gray-800">{project.author_name}</h3>
//                       <p className="text-gray-600">{project.user?.email || project.author_email}</p>
//                     </div>
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                       <p className="text-sm text-gray-600 mb-1">Identifiant</p>
//                       <p className="font-medium">{project.user?.id || 'N/A'}</p>
//                     </div>
                    
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                       <p className="text-sm text-gray-600 mb-1">Nom d'utilisateur</p>
//                       <p className="font-medium">{project.user?.username || project.author_username || 'N/A'}</p>
//                     </div>
                    
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                       <p className="text-sm text-gray-600 mb-1">Email</p>
//                       <p className="font-medium break-all">{project.user?.email || project.author_email || 'N/A'}</p>
//                     </div>
                    
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                       <p className="text-sm text-gray-600 mb-1">Administrateur</p>
//                       <p className="font-medium">
//                         {project.user?.is_staff ? 'Oui' : 'Non'}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Colonne droite - Informations */}
//         <div className="space-y-6">
//           {/* Statut et dates */}
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
//             <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//               <span className="material-symbols-outlined text-[#E30613]">info</span>
//               Informations
//             </h3>
            
//             <div className="space-y-4">
//               <div>
//                 <p className="text-sm text-gray-600 mb-1">Date de création</p>
//                 <p className="font-medium">{createdDate}</p>
//               </div>
              
//               <div>
//                 <p className="text-sm text-gray-600 mb-1">Dernière modification</p>
//                 <p className="font-medium">{updatedDate}</p>
//               </div>
              
//               <div>
//                 <p className="text-sm text-gray-600 mb-1">Catégorie</p>
//                 <div className="flex items-center gap-2">
//                   <span className="material-symbols-outlined text-gray-500 text-sm">label</span>
//                   <p className="font-medium">{getCategoryLabel()}</p>
//                 </div>
//               </div>
              
//               <div>
//                 <p className="text-sm text-gray-600 mb-1">Statut</p>
//                 {statusBadge && (
//                   <div className="flex items-center gap-2">
//                     <span className="material-symbols-outlined text-sm">{statusBadge.icon}</span>
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
//                       {statusBadge.label}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Cohorte */}
//           {project.cohort && (
//             <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
//               <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//                 <span className="material-symbols-outlined text-[#001F3F]">school</span>
//                 Promotion
//               </h3>
//               <p className="text-lg font-medium text-gray-700">{project.cohort}</p>
//             </div>
//           )}

//           {/* Liens */}
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
//             <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//               <span className="material-symbols-outlined text-green-600">link</span>
//               Liens
//             </h3>
            
//             <div className="space-y-3">
//               {project.github_url && (
//                 <a
//                   href={project.github_url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
//                 >
//                   <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
//                     <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
//                     </svg>
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-medium text-gray-800">Repository GitHub</p>
//                     <p className="text-sm text-gray-600 truncate">{project.github_url.replace('https://', '')}</p>
//                   </div>
//                   <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-600">
//                     open_in_new
//                   </span>
//                 </a>
//               )}
              
//               {project.demo_url && (
//                 <a
//                   href={project.demo_url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
//                 >
//                   <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
//                     <span className="material-symbols-outlined text-white">open_in_new</span>
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-medium text-gray-800">Démo en ligne</p>
//                     <p className="text-sm text-gray-600 truncate">{project.demo_url.replace('https://', '')}</p>
//                   </div>
//                   <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-600">
//                     open_in_new
//                   </span>
//                 </a>
//               )}
//             </div>
//           </div>

//           {/* Actions rapides */}
//           <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
//             <h3 className="text-xl font-bold text-gray-800 mb-4">Actions</h3>
            
//             <div className="space-y-3">
//               {/* <button
//                 onClick={() => window.location.href = `/admin/projects/${project.id}/edit`}
//                 className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
//               >  <span className="material-symbols-outlined">edit</span>
//                 Modifier le projet
//               </button>
              
//               <button
//                 onClick={() => {
//                   if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${project.title}" ?`)) {
//                     setError(isDemoMode ? 'Action non disponible en mode démo' : `Suppression de "${project.title}" en cours...`);
//                     setTimeout(() => {
//                       navigate('/admin/explore');
//                     }, 1500);
//                   }
//                 }}
//                 className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
//               >
//                 <span className="material-symbols-outlined">delete</span>
//                 Supprimer le projet
//               </button> */}
              
              
//               <button
//                 onClick={() => navigate('/admin/explore')}
//                 className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
//               >
//                 <span className="material-symbols-outlined">arrow_back</span>
//                 Retour aux projets
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectDetail;

// src/components/admin/ProjectDetail.jsx - VERSION COMPLÈTE AVEC APPROBATION/REJET
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [downloading, setDownloading] = useState(false);
  
  // États pour les modales d'approbation/rejet
  const [approvalModal, setApprovalModal] = useState({
    open: false,
    criteria: '✅ Projet bien structuré\n✅ Code propre et documenté\n✅ Fonctionnalités complètes\n✅ Bonnes pratiques respectées'
  });
  
  const [rejectionModal, setRejectionModal] = useState({
    open: false,
    criteria: '❌ Documentation insuffisante\n❌ Code non optimisé\n❌ Tests manquants\n❌ UI/UX à améliorer'
  });
  
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  
  const API_BASE = 'http://127.0.0.1:8000/api';

  // ✅ CHARGER LES DONNÉES DU PROJET
  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`📡 Récupération du projet ${id}...`);
      
      // Essayer de récupérer depuis l'état de navigation
      if (location.state?.project) {
        console.log('📦 Projet depuis navigation:', location.state.project);
        setProject(location.state.project);
        setIsDemoMode(false);
        setLoading(false);
        return;
      }
      
      // Sinon, essayer l'API
      const endpoints = [
        `${API_BASE}/projects/projects/${id}/`,
        `${API_BASE}/projects/${id}/`
      ];
      
      let projectData = null;
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint);
          if (response.ok) {
            projectData = await response.json();
            console.log(`✅ Données depuis ${endpoint}:`, projectData);
            break;
          }
        } catch (err) {
          console.log(`❌ ${endpoint}: ${err.message}`);
        }
      }
      
      if (projectData) {
        const transformed = transformProjectData(projectData);
        setProject(transformed);
        setIsDemoMode(false);
      } else {
        throw new Error('Projet non trouvé dans l\'API');
      }
      
    } catch (error) {
      console.error('❌ Erreur:', error);
      setError(error.message);
      
      // Activer le mode démo si erreur
      const demoProject = getDemoProject();
      setProject(demoProject);
      setIsDemoMode(true);
      setError(`⚠️ Mode démo activé: ${error.message}`);
      
    } finally {
      setLoading(false);
    }
  };

  // ✅ TRANSFORMATION DES DONNÉES
  const transformProjectData = (projectData) => {
    return {
      id: projectData.id || id,
      title: projectData.title || 'Projet sans titre',
      description: projectData.description || 'Aucune description',
      full_description: projectData.full_description || projectData.description || 'Aucune description détaillée',
      technologies: projectData.technologies || '',
      category: projectData.category || 'other',
      status: projectData.status || 'draft',
      cohort: projectData.cohort || 'Non spécifiée',
      github_url: projectData.github_url || '',
      demo_url: projectData.demo_url || '',
      image: projectData.image || '',
      created_at: projectData.created_at || new Date().toISOString(),
      updated_at: projectData.updated_at || new Date().toISOString(),
      author_name: projectData.author_name || projectData.author?.username || 'Auteur inconnu',
      author_email: projectData.author_email || projectData.author?.email || '',
      author_id: projectData.author || projectData.author_id,
      
      // Flags de statut
      is_approved: projectData.is_approved || projectData.status === 'approved',
      is_pending: projectData.is_pending || projectData.status === 'pending',
      is_rejected: projectData.is_rejected || projectData.status === 'rejected',
      is_draft: projectData.is_draft || projectData.status === 'draft'
    };
  };

  // ✅ DONNÉES DE DÉMO
  const getDemoProject = () => {
    return {
      id: id,
      title: "Portfolio React Modern",
      description: "Portfolio moderne développé avec React, TypeScript et Tailwind CSS",
      full_description: `# Portfolio React Modern\n\n## Description du projet\nCe portfolio moderne a été développé en utilisant les dernières technologies front-end.`,
      technologies: "React, TypeScript, Tailwind CSS, Vite",
      category: "web",
      status: "pending",
      cohort: "DWWM - Mars 2024",
      github_url: "https://github.com/example/portfolio-react",
      demo_url: "https://portfolio-react-demo.netlify.app",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3",
      created_at: "2024-03-15T10:30:00Z",
      updated_at: "2024-03-20T14:30:00Z",
      author_name: "Léa Martin",
      author_email: "lea.martin@example.com",
      author_id: 1,
      is_approved: false,
      is_pending: true,
      is_rejected: false,
      is_draft: false
    };
  };

  // ✅ APPROUVER LE PROJET
  const handleApproveProject = async () => {
    if (!project) return;
    
    setActionLoading(true);
    setActionMessage('');
    
    try {
      if (isDemoMode) {
        // Mode démo: simuler l'approbation
        setProject(prev => ({
          ...prev,
          status: 'approved',
          is_approved: true,
          is_pending: false,
          is_rejected: false
        }));
        setActionMessage('✅ Projet approuvé (mode démo)');
        
        // Fermer la modale après un délai
        setTimeout(() => {
          setApprovalModal({ open: false, criteria: '' });
          setActionMessage('');
        }, 2000);
      } else {
        // Mode réel: appel API
        const token = localStorage.getItem('access_token');
        const headers = { 'Content-Type': 'application/json' };
        
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const response = await fetch(`${API_BASE}/projects/${project.id}/`, {
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
          const updatedProject = await response.json();
          setProject(transformProjectData(updatedProject));
          setActionMessage('✅ Projet approuvé avec succès !');
          
          // Fermer la modale
          setTimeout(() => {
            setApprovalModal({ open: false, criteria: '' });
            setActionMessage('');
          }, 2000);
        } else {
          throw new Error(`Erreur ${response.status}`);
        }
      }
    } catch (error) {
      console.error('❌ Erreur approbation:', error);
      setActionMessage(`❌ Erreur: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ REJETER LE PROJET
  const handleRejectProject = async () => {
    if (!project) return;
    
    setActionLoading(true);
    setActionMessage('');
    
    try {
      if (isDemoMode) {
        // Mode démo: simuler le rejet
        setProject(prev => ({
          ...prev,
          status: 'rejected',
          is_approved: false,
          is_pending: false,
          is_rejected: true
        }));
        setActionMessage('❌ Projet rejeté (mode démo)');
        
        // Fermer la modale
        setTimeout(() => {
          setRejectionModal({ open: false, criteria: '' });
          setActionMessage('');
        }, 2000);
      } else {
        // Mode réel: appel API
        const token = localStorage.getItem('access_token');
        const headers = { 'Content-Type': 'application/json' };
        
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const response = await fetch(`${API_BASE}/projects/${project.id}/`, {
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
          const updatedProject = await response.json();
          setProject(transformProjectData(updatedProject));
          setActionMessage('❌ Projet rejeté avec succès');
          
          // Fermer la modale
          setTimeout(() => {
            setRejectionModal({ open: false, criteria: '' });
            setActionMessage('');
          }, 2000);
        } else {
          throw new Error(`Erreur ${response.status}`);
        }
      }
    } catch (error) {
      console.error('❌ Erreur rejet:', error);
      setActionMessage(`❌ Erreur: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ MODALES
  const openApprovalModal = () => {
    setApprovalModal({
      open: true,
      criteria: `✅ Projet "${project.title}"\n\nCritères d'approbation:\n• Code propre et bien documenté\n• Fonctionnalités complètes\n• Bonnes pratiques respectées\n• Documentation adéquate\n• Tests fonctionnels\n\nCommentaires supplémentaires:`
    });
  };

  const openRejectionModal = () => {
    setRejectionModal({
      open: true,
      criteria: `❌ Projet "${project.title}"\n\nMotifs de rejet:\n• Documentation insuffisante\n• Code non optimisé\n• Tests manquants\n• UI/UX à améliorer\n• Fonctionnalités incomplètes\n\nCommentaires détaillés:`
    });
  };

  const closeApprovalModal = () => {
    setApprovalModal({ open: false, criteria: '' });
    setActionMessage('');
  };

  const closeRejectionModal = () => {
    setRejectionModal({ open: false, criteria: '' });
    setActionMessage('');
  };

  // ✅ FONCTIONS UTILITAIRES
  const getStatusColor = () => {
    if (!project) return 'bg-gray-100 text-gray-800';
    
    if (project.is_approved) return 'bg-green-100 text-green-800';
    if (project.is_rejected) return 'bg-red-100 text-red-800';
    if (project.is_pending) return 'bg-yellow-100 text-yellow-800';
    if (project.is_draft) return 'bg-blue-100 text-blue-800';
    
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusText = () => {
    if (!project) return 'Inconnu';
    
    if (project.is_approved) return '✅ Approuvé';
    if (project.is_rejected) return '❌ Rejeté';
    if (project.is_pending) return '⏳ En attente';
    if (project.is_draft) return '📝 Brouillon';
    
    return project.status || '❓ Inconnu';
  };

  const getStatusIcon = () => {
    if (!project) return 'help';
    
    if (project.is_approved) return 'check_circle';
    if (project.is_rejected) return 'cancel';
    if (project.is_pending) return 'pending';
    if (project.is_draft) return 'draft';
    
    return 'help';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  const getProjectImage = () => {
    if (!project || !project.image) {
      const defaultImages = {
        web: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
        mobile: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c',
        other: 'https://images.unsplash.com/photo-1551650975-87deedd944c3'
      };
      return defaultImages[project?.category || 'other'];
    }
    
    if (project.image.startsWith('http')) {
      return project.image;
    } else if (project.image.startsWith('/media/') || project.image.startsWith('/static/')) {
      return `http://127.0.0.1:8000${project.image}`;
    }
    
    return project.image;
  };

  // ✅ CHARGEMENT
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-[#E30613] mb-6"></div>
        <p className="text-2xl font-medium text-gray-700 mb-2 text-center">Chargement du projet...</p>
        <p className="text-gray-600 text-center max-w-md">
          {isDemoMode ? 'Chargement des données démo' : 'Récupération depuis la base de données'}
        </p>
      </div>
    );
  }

  // ✅ ERREUR
  if (error && !project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Projet non trouvé</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/admin/projects')}
              className="px-6 py-3 bg-[#001F3F] text-white rounded-lg hover:bg-[#003265] transition-colors font-medium flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Retour aux projets
            </button>
            <button
              onClick={fetchProjectData}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">refresh</span>
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête avec actions */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <button
              onClick={() => navigate('/admin/projects')}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-[#001F3F] mb-6 transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Retour aux projets
            </button>
            
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-[#001F3F]">
                {project.title}
              </h1>
              
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor()} flex items-center gap-2`}>
                <span className="material-symbols-outlined text-base">{getStatusIcon()}</span>
                {getStatusText()}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">person</span>
                <span className="font-medium">{project.author_name}</span>
              </div>
              
              {project.cohort && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined">school</span>
                  <span>{project.cohort}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined">calendar_today</span>
                <span>{formatDate(project.created_at)}</span>
              </div>
            </div>
          </div>
          
          {/* Actions d'approbation/rejet */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  GitHub
                </a>
              )}
              
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-all font-medium flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">open_in_new</span>
                  Démo
                </a>
              )}
            </div>
            
            {/* Boutons d'action */}
            <div className="grid grid-cols-2 gap-3">
              {!project.is_approved && (
                <button
                  onClick={openApprovalModal}
                  disabled={actionLoading}
                  className="px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">check_circle</span>
                  Approuver
                </button>
              )}
              
              {!project.is_rejected && (
                <button
                  onClick={openRejectionModal}
                  disabled={actionLoading}
                  className="px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">cancel</span>
                  Rejeter
                </button>
              )}
            </div>
            
            {/* Message d'action */}
            {actionMessage && (
              <div className={`p-3 rounded-lg ${actionMessage.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined">
                    {actionMessage.includes('✅') ? 'check_circle' : 'error'}
                  </span>
                  <span className="font-medium">{actionMessage}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Mode info */}
        {isDemoMode && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-yellow-600">warning</span>
              <div>
                <p className="font-medium text-yellow-800">Mode démo activé</p>
                <p className="text-sm text-yellow-700">Les actions seront simulées.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne gauche - Image et détails */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="relative h-64 md:h-80 lg:h-96">
              <img 
                src={getProjectImage()} 
                alt={project.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <div class="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
                      <span class="material-symbols-outlined text-gray-400 text-6xl mb-4">code</span>
                      <p class="text-gray-600 text-center">Image non disponible</p>
                      <p class="text-sm text-gray-500 mt-2">${project.title}</p>
                    </div>
                  `;
                }}
              />
            </div>
          </div>

          {/* Onglets */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`px-6 py-4 font-medium flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                    activeTab === 'details' 
                      ? 'border-[#E30613] text-[#E30613]' 
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="material-symbols-outlined">description</span>
                  Détails
                </button>
                
                <button
                  onClick={() => setActiveTab('technologies')}
                  className={`px-6 py-4 font-medium flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                    activeTab === 'technologies' 
                      ? 'border-[#E30613] text-[#E30613]' 
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="material-symbols-outlined">code</span>
                  Technologies
                </button>
                
                <button
                  onClick={() => setActiveTab('validation')}
                  className={`px-6 py-4 font-medium flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                    activeTab === 'validation' 
                      ? 'border-[#E30613] text-[#E30613]' 
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="material-symbols-outlined">verified</span>
                  Validation
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Description</h3>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-line">{project.full_description}</p>
                    </div>
                  </div>
                  
                  {project.description && project.description !== project.full_description && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">Description courte</h3>
                      <p className="text-gray-700">{project.description}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'technologies' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800">Technologies utilisées</h3>
                  
                  {project.technologies ? (
                    <div className="flex flex-wrap gap-3">
                      {project.technologies.split(',').map((tech, index) => (
                        <span 
                          key={index}
                          className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg border border-blue-200 font-medium"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Aucune technologie spécifiée</p>
                  )}
                </div>
              )}

              {activeTab === 'validation' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Statut de validation</h3>
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor()} flex items-center gap-2`}>
                        <span className="material-symbols-outlined text-base">{getStatusIcon()}</span>
                        {getStatusText()}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-2">Historique</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Créé le</p>
                          <p className="text-sm text-gray-600">{formatDate(project.created_at)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Dernière modification</p>
                          <p className="text-sm text-gray-600">{formatDate(project.updated_at)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">Actions disponibles</h4>
                    <div className="flex flex-wrap gap-3">
                      {!project.is_approved && (
                        <button
                          onClick={openApprovalModal}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined">check_circle</span>
                          Approuver le projet
                        </button>
                      )}
                      
                      {!project.is_rejected && (
                        <button
                          onClick={openRejectionModal}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined">cancel</span>
                          Rejeter le projet
                        </button>
                      )}
                      
                      <button
                        onClick={() => navigate('/admin/projects')}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined">arrow_back</span>
                        Retour
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Colonne droite - Informations */}
        <div className="space-y-6">
          {/* Informations générales */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#E30613]">info</span>
              Informations
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">ID du projet</p>
                <p className="font-medium font-mono">{project.id}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Catégorie</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-gray-500 text-sm">category</span>
                  <p className="font-medium">{project.category || 'Non catégorisé'}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Cohorte</p>
                <p className="font-medium">{project.cohort}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Date de création</p>
                <p className="font-medium">{formatDate(project.created_at)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Dernière modification</p>
                <p className="font-medium">{formatDate(project.updated_at)}</p>
              </div>
            </div>
          </div>

          {/* Auteur */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">person</span>
              Auteur
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {project.author_name?.[0]?.toUpperCase() || 'A'}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{project.author_name}</p>
                  <p className="text-sm text-gray-600 truncate max-w-[200px]">{project.author_email}</p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">1</p>
                    <p className="text-xs text-gray-600">Projet</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">1</p>
                    <p className="text-xs text-gray-600">En attente</p>
                  </div>
                </div>
              </div>
              
              {project.author_id && (
                <button
                  onClick={() => navigate(`/admin/users/${project.author_id}`)}
                  className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">person_search</span>
                  Voir le profil
                </button>
              )}
            </div>
          </div>
          
          {/* Liens rapides */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-green-600">link</span>
              Liens
            </h3>
            
            <div className="space-y-3">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                    <div>
                      <p className="font-medium text-gray-800">Repository GitHub</p>
                      <p className="text-xs text-gray-600 truncate max-w-[200px]">
                        {project.github_url.replace('https://', '')}
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-600">open_in_new</span>
                </a>
              )}
              
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-blue-600">public</span>
                    <div>
                      <p className="font-medium text-gray-800">Démo en ligne</p>
                      <p className="text-xs text-gray-600 truncate max-w-[200px]">
                        {project.demo_url.replace('https://', '')}
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-600">open_in_new</span>
                </a>
              )}
              
              {!project.github_url && !project.demo_url && (
                <p className="text-gray-500 italic text-center py-4">Aucun lien disponible</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modale d'approbation */}
      {approvalModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600">check_circle</span>
                  Approuver le projet
                </h3>
                <p className="text-gray-600 mt-1">Valider et publier "{project.title}"</p>
              </div>
              <button
                onClick={closeApprovalModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Critères d'approbation
                </label>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="space-y-2">
                    {approvalModal.criteria.split('\n').map((line, index) => (
                      <div key={index} className="flex items-start gap-2">
                        {line.includes('✅') ? (
                          <span className="material-symbols-outlined text-green-600 text-sm">check_circle</span>
                        ) : line.includes('❌') ? (
                          <span className="material-symbols-outlined text-red-600 text-sm">cancel</span>
                        ) : null}
                        <span className={`${line.includes('✅') ? 'text-green-800' : line.includes('❌') ? 'text-red-800' : 'text-gray-700'}`}>
                          {line.replace('✅', '').replace('❌', '').trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <textarea
                  value={approvalModal.criteria}
                  onChange={(e) => setApprovalModal({...approvalModal, criteria: e.target.value})}
                  rows="8"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
                  placeholder="Ajoutez vos commentaires d'approbation..."
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-blue-600">info</span>
                  <div>
                    <p className="font-medium text-blue-800">Informations</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Une fois approuvé, le projet sera marqué comme publié et visible publiquement.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={closeApprovalModal}
                  disabled={actionLoading}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleApproveProject}
                  disabled={actionLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Traitement...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">check_circle</span>
                      Approuver le projet
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-600">cancel</span>
                  Rejeter le projet
                </h3>
                <p className="text-gray-600 mt-1">Demander des modifications pour "{project.title}"</p>
              </div>
              <button
                onClick={closeRejectionModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motifs de rejet
                </label>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="space-y-2">
                    {rejectionModal.criteria.split('\n').map((line, index) => (
                      <div key={index} className="flex items-start gap-2">
                        {line.includes('❌') ? (
                          <span className="material-symbols-outlined text-red-600 text-sm">cancel</span>
                        ) : line.includes('✅') ? (
                          <span className="material-symbols-outlined text-green-600 text-sm">check_circle</span>
                        ) : null}
                        <span className={`${line.includes('❌') ? 'text-red-800' : line.includes('✅') ? 'text-green-800' : 'text-gray-700'}`}>
                          {line.replace('✅', '').replace('❌', '').trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <textarea
                  value={rejectionModal.criteria}
                  onChange={(e) => setRejectionModal({...rejectionModal, criteria: e.target.value})}
                  rows="8"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-400"
                  placeholder="Détaillez les raisons du rejet et les améliorations nécessaires..."
                />
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-yellow-600">warning</span>
                  <div>
                    <p className="font-medium text-yellow-800">Attention</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Le projet sera marqué comme rejeté. L'auteur pourra le modifier et le soumettre à nouveau.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={closeRejectionModal}
                  disabled={actionLoading}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleRejectProject}
                  disabled={actionLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Traitement...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">cancel</span>
                      Rejeter le projet
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

export default ProjectDetail;