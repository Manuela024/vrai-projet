
// // src/pages/ProjectDetail.jsx - VERSION PROFESSIONNELLE
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import authService from '../services/auth';

// const ProjectDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [similarProjects, setSimilarProjects] = useState([]);
//   const [user, setUser] = useState(null);
//   const [activeTab, setActiveTab] = useState('description');
//   const [downloading, setDownloading] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false);

//   useEffect(() => {
//     const currentUser = authService.getCurrentUser();
//     setUser(currentUser);
    
//     if (!currentUser) {
//       navigate('/login');
//       return;
//     }
    
//     loadProject();
//     checkIfFavorite();
//   }, [id, navigate]);

//   const loadProject = async () => {
//     try {
//       setLoading(true);
//       const token = authService.getAccessToken();
      
//       // Charger le projet avec plus de détails
//       const endpoints = [
//         `http://localhost:8000/api/projects/${id}/`,
//         `http://localhost:8000/api/projects/projects/${id}/`,
//         `http://localhost:8000/api/project/${id}/`
//       ];
      
//       let projectData = null;
      
//       for (const endpoint of endpoints) {
//         try {
//           const response = await fetch(endpoint, {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Accept': 'application/json'
//             }
//           });
          
//           if (response.ok) {
//             const data = await response.json();
//             projectData = data;
//             break;
//           }
//         } catch (error) {
//           continue;
//         }
//       }
      
//       if (projectData) {
//         setProject(projectData);
        
//         // Charger des projets similaires
//         if (projectData.technologies || projectData.category) {
//           loadSimilarProjects(projectData);
//         }
        
//         // Incrémenter les vues
//         incrementViews();
//       } else {
//         throw new Error('Projet non trouvé');
//       }
//     } catch (error) {
//       console.error('Erreur chargement projet:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadSimilarProjects = async (projectData) => {
//     try {
//       const token = authService.getAccessToken();
//       const techs = projectData.technologies ? encodeURIComponent(projectData.technologies.substring(0, 50)) : '';
//       const category = projectData.category ? encodeURIComponent(projectData.category) : '';
      
//       const response = await fetch(
//         `http://localhost:8000/api/projects/?${techs ? `technologies=${techs}` : ''}${category ? `&category=${category}` : ''}&exclude=${id}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Accept': 'application/json'
//           }
//         }
//       );
      
//       if (response.ok) {
//         const data = await response.json();
//         // Extraire les projets selon la structure
//         const projects = data.results || data.projects || data.data || data;
//         setSimilarProjects(projects.filter(p => p.id !== parseInt(id)).slice(0, 3));
//       }
//     } catch (error) {
//       console.error('Erreur chargement projets similaires:', error);
//     }
//   };

//   const incrementViews = async () => {
//     try {
//       const token = authService.getAccessToken();
//       await fetch(`http://localhost:8000/api/projects/${id}/increment-views/`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
//     } catch (error) {
//       // Ignorer l'erreur, ce n'est pas critique
//     }
//   };

//   const checkIfFavorite = () => {
//     // Vérifier si le projet est dans les favoris
//     const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
//     setIsFavorite(favorites.includes(parseInt(id)));
//   };

//   const toggleFavorite = () => {
//     const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
//     const projectId = parseInt(id);
    
//     if (isFavorite) {
//       const newFavorites = favorites.filter(favId => favId !== projectId);
//       localStorage.setItem('favorites', JSON.stringify(newFavorites));
//       setIsFavorite(false);
//     } else {
//       favorites.push(projectId);
//       localStorage.setItem('favorites', JSON.stringify(favorites));
//       setIsFavorite(true);
//     }
//   };

//   const handleDownloadZip = async () => {
//     if (!project || downloading) return;
    
//     setDownloading(true);
    
//     try {
//       let zipFileUrl = project.zip_file;
      
//       if (!zipFileUrl) {
//         // Essayer de récupérer depuis les détails complets
//         const token = authService.getAccessToken();
//         const response = await fetch(`http://localhost:8000/api/projects/${id}/`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Accept': 'application/json'
//           }
//         });
        
//         if (response.ok) {
//           const data = await response.json();
//           zipFileUrl = data.zip_file;
//         }
//       }
      
//       if (zipFileUrl) {
//         // Normaliser l'URL
//         let finalUrl = zipFileUrl;
//         if (!zipFileUrl.startsWith('http')) {
//           if (zipFileUrl.startsWith('/media/') || zipFileUrl.startsWith('/static/')) {
//             finalUrl = `http://localhost:8000${zipFileUrl}`;
//           } else {
//             finalUrl = `http://localhost:8000/media/${zipFileUrl}`;
//           }
//         }
        
//         // Créer un lien pour le téléchargement
//         const link = document.createElement('a');
//         link.href = finalUrl;
//         link.download = `${project.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.zip`;
//         link.target = '_blank';
        
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
        
//         // Enregistrer le téléchargement
//         await fetch(`http://localhost:8000/api/projects/${id}/increment-downloads/`, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${authService.getAccessToken()}`,
//             'Content-Type': 'application/json'
//           }
//         });
//       } else {
//         alert('Aucun fichier ZIP disponible pour ce projet.');
//       }
//     } catch (error) {
//       console.error('Erreur téléchargement:', error);
//       alert('Erreur lors du téléchargement. Veuillez réessayer.');
//     } finally {
//       setDownloading(false);
//     }
//   };

//   const shareProject = () => {
//     const shareUrl = window.location.href;
//     const title = project.title;
    
//     if (navigator.share) {
//       navigator.share({
//         title: title,
//         text: `Découvrez ce projet : ${title}`,
//         url: shareUrl,
//       });
//     } else {
//       navigator.clipboard.writeText(shareUrl);
//       alert('Lien copié dans le presse-papier !');
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Date inconnue';
//     try {
//       return new Date(dateString).toLocaleDateString('fr-FR', {
//         day: 'numeric',
//         month: 'long',
//         year: 'numeric'
//       });
//     } catch {
//       return 'Date invalide';
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statusMap = {
//       'published': { label: '✅ Publié', color: 'bg-green-100 text-green-800 border border-green-200' },
//       'pending': { label: '⏳ En attente', color: 'bg-yellow-100 text-yellow-800 border border-yellow-200' },
//       'draft': { label: '📝 Brouillon', color: 'bg-gray-100 text-gray-800 border border-gray-200' },
//       'approved': { label: '✅ Approuvé', color: 'bg-blue-100 text-blue-800 border border-blue-200' },
//       'rejected': { label: '❌ Rejeté', color: 'bg-red-100 text-red-800 border border-red-200' }
//     };
    
//     const statusInfo = statusMap[status?.toLowerCase()] || statusMap.draft;
    
//     return (
//       <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
//         {statusInfo.label}
//       </span>
//     );
//   };

//   const getTechnologies = () => {
//     if (!project?.technologies) return [];
//     if (Array.isArray(project.technologies)) return project.technologies;
//     if (typeof project.technologies === 'string') {
//       return project.technologies.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0);
//     }
//     return [];
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="relative">
//             <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#E30613] border-t-transparent mx-auto"></div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="h-8 w-8 bg-[#001F3F] rounded-full animate-pulse"></div>
//             </div>
//           </div>
//           <p className="mt-6 text-lg font-medium text-gray-700">Chargement du projet</p>
//           <p className="mt-2 text-sm text-gray-500">Nous préparons tous les détails...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!project) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
//         <div className="text-center max-w-md">
//           <div className="text-6xl mb-6">🔍</div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-3">Projet non trouvé</h1>
//           <p className="text-gray-600 mb-8">
//             Le projet que vous recherchez n'existe pas ou a été déplacé.
//           </p>
//           <div className="space-y-3">
//             <button
//               onClick={() => navigate('/explore')}
//               className="w-full px-6 py-3 bg-gradient-to-r from-[#001F3F] to-[#003265] text-white rounded-xl hover:opacity-90 transition-all font-medium"
//             >
//               Explorer les projets
//             </button>
//             <button
//               onClick={() => navigate(-1)}
//               className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
//             >
//               ← Retour
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const technologies = getTechnologies();
//   const isOwner = user && user.id && (user.id === project.author_id || user.id === project.author?.id);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Navigation */}
//       <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <button
//               onClick={() => navigate(-1)}
//               className="flex items-center gap-2 text-gray-600 hover:text-[#001F3F] transition-colors"
//             >
//               <span className="material-symbols-outlined">arrow_back</span>
//               <span className="font-medium">Retour</span>
//             </button>
            
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={toggleFavorite}
//                 className={`p-2 rounded-full ${isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
//                 title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
//               >
//                 <span className="material-symbols-outlined">
//                   {isFavorite ? 'favorite' : 'favorite_border'}
//                 </span>
//               </button>
              
//               <button
//                 onClick={shareProject}
//                 className="p-2 rounded-full text-gray-400 hover:text-[#001F3F] hover:bg-gray-100"
//                 title="Partager"
//               >
//                 <span className="material-symbols-outlined">share</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* En-tête */}
//         <div className="mb-8">
//           <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
//             <div className="flex-1">
//               <div className="flex items-center gap-3 mb-3">
//                 {getStatusBadge(project.status)}
//                 <span className="text-sm text-gray-500">
//                   {project.views || 0} vues • {project.downloads || 0} téléchargements
//                 </span>
//               </div>
              
//               <h1 className="text-3xl lg:text-4xl font-bold text-[#001F3F] mb-3">
//                 {project.title}
//               </h1>
              
//               <div className="flex flex-wrap items-center gap-4 text-gray-600">
//                 <div className="flex items-center gap-2">
//                   <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
//                     {project.author_name?.charAt(0) || 'U'}
//                   </div>
//                   <div>
//                     <p className="font-medium">{project.author_name || 'Auteur inconnu'}</p>
//                     <p className="text-xs text-gray-500">{project.cohort || 'Sans cohorte'}</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center gap-1">
//                   <span className="material-symbols-outlined text-sm">calendar_today</span>
//                   <span className="text-sm">{formatDate(project.created_at)}</span>
//                 </div>
                
//                 {project.category && (
//                   <div className="flex items-center gap-1">
//                     <span className="material-symbols-outlined text-sm">category</span>
//                     <span className="text-sm capitalize">{project.category}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             {/* Actions */}
//             <div className="flex flex-wrap gap-3">
//               {isOwner && (
//                 <Link
//                   to={`/upload?edit=${project.id}`}
//                   className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2 font-medium"
//                 >
//                   <span className="material-symbols-outlined">edit</span>
//                   Modifier
//                 </Link>
//               )}
              
//               <button
//                 onClick={handleDownloadZip}
//                 disabled={downloading}
//                 className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2 font-medium disabled:opacity-50"
//               >
//                 <span className="material-symbols-outlined">
//                   {downloading ? 'downloading' : 'download'}
//                 </span>
//                 {downloading ? 'Téléchargement...' : 'Télécharger le projet'}
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Colonne principale */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Image du projet */}
//             <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
//               {project.image ? (
//                 <img
//                   src={project.image}
//                   alt={project.title}
//                   className="w-full h-80 lg:h-96 object-cover"
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.src = `https://via.placeholder.com/800x400/001F3F/ffffff?text=${encodeURIComponent(project.title)}`;
//                   }}
//                 />
//               ) : (
//                 <div className="w-full h-80 lg:h-96 bg-gradient-to-br from-[#001F3F] to-[#003265] flex items-center justify-center">
//                   <div className="text-center p-8">
//                     <span className="material-symbols-outlined text-white text-6xl mb-4">
//                       code
//                     </span>
//                     <p className="text-white text-lg font-medium">{project.title}</p>
//                     <p className="text-white/70 mt-2">Projet de développement</p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Onglets */}
//             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
//               <div className="border-b border-gray-200">
//                 <nav className="flex">
//                   {['description', 'technologies', 'details'].map(tab => (
//                     <button
//                       key={tab}
//                       onClick={() => setActiveTab(tab)}
//                       className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
//                         activeTab === tab
//                           ? 'text-[#E30613] border-b-2 border-[#E30613]'
//                           : 'text-gray-600 hover:text-gray-900'
//                       }`}
//                     >
//                       {tab === 'description' && '📋 Description'}
//                       {tab === 'technologies' && '🛠️ Technologies'}
//                       {tab === 'details' && '📄 Détails'}
//                     </button>
//                   ))}
//                 </nav>
//               </div>
              
//               <div className="p-6">
//                 {activeTab === 'description' && (
//                   <div className="prose max-w-none">
//                     <h3 className="text-xl font-bold text-gray-900 mb-4">À propos de ce projet</h3>
//                     <div className="space-y-4 text-gray-700">
//                       {project.description ? (
//                         project.description.split('\n').map((paragraph, index) => (
//                           <p key={index} className="leading-relaxed">{paragraph}</p>
//                         ))
//                       ) : (
//                         <p className="text-gray-500 italic">Aucune description fournie pour ce projet.</p>
//                       )}
//                     </div>
//                   </div>
//                 )}
                
//                 {activeTab === 'technologies' && (
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-900 mb-6">Stack technique</h3>
//                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                       {technologies.map((tech, index) => (
//                         <div
//                           key={index}
//                           className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 text-center hover:border-blue-300 transition-colors"
//                         >
//                           <div className="text-2xl mb-2">
//                             {tech.toLowerCase().includes('react') && '⚛️'}
//                             {tech.toLowerCase().includes('node') && '🟢'}
//                             {tech.toLowerCase().includes('python') && '🐍'}
//                             {tech.toLowerCase().includes('django') && '🐳'}
//                             {tech.toLowerCase().includes('js') && '📜'}
//                             {!tech.toLowerCase().includes('react') && 
//                              !tech.toLowerCase().includes('node') && 
//                              !tech.toLowerCase().includes('python') && 
//                              !tech.toLowerCase().includes('django') && 
//                              !tech.toLowerCase().includes('js') && '💻'}
//                           </div>
//                           <span className="font-medium text-gray-800">{tech}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
                
//                 {activeTab === 'details' && (
//                   <div className="space-y-6">
//                     <div>
//                       <h4 className="font-bold text-gray-900 mb-3">📁 Structure du projet</h4>
//                       <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
//                         <p>{project.title}/</p>
//                         <p className="ml-4">├── src/</p>
//                         <p className="ml-4">├── public/</p>
//                         <p className="ml-4">├── package.json</p>
//                         <p className="ml-4">└── README.md</p>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <h4 className="font-bold text-gray-900 mb-3">🎯 Objectifs</h4>
//                       <ul className="space-y-2 text-gray-700">
//                         <li className="flex items-start gap-2">
//                           <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
//                           <span>Application fonctionnelle et responsive</span>
//                         </li>
//                         <li className="flex items-start gap-2">
//                           <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
//                           <span>Code propre et bien documenté</span>
//                         </li>
//                         <li className="flex items-start gap-2">
//                           <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
//                           <span>Architecture modulaire et scalable</span>
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Liens externes */}
//             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//               <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
//                 <span className="material-symbols-outlined">link</span>
//                 Ressources
//               </h3>
//               <div className="space-y-3">
//                 {project.github_url && (
//                   <a
//                     href={project.github_url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
//                         <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
//                           <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
//                         </svg>
//                       </div>
//                       <div>
//                         <p className="font-medium">Repository GitHub</p>
//                         <p className="text-xs text-gray-500">Code source</p>
//                       </div>
//                     </div>
//                     <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-600">open_in_new</span>
//                   </a>
//                 )}
                
//                 {project.demo_url && (
//                   <a
//                     href={project.demo_url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center justify-between p-3 bg-gradient-to-r from-[#001F3F] to-[#003265] text-white hover:opacity-90 rounded-lg transition-all group"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                         <span className="material-symbols-outlined">rocket_launch</span>
//                       </div>
//                       <div>
//                         <p className="font-medium">Démo en ligne</p>
//                         <p className="text-xs text-white/70">Voir en action</p>
//                       </div>
//                     </div>
//                     <span className="material-symbols-outlined">open_in_new</span>
//                   </a>
//                 )}
                
//                 {project.zip_file && (
//                   <button
//                     onClick={handleDownloadZip}
//                     disabled={downloading}
//                     className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:opacity-90 rounded-lg transition-all group disabled:opacity-50"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                         <span className="material-symbols-outlined">download</span>
//                       </div>
//                       <div>
//                         <p className="font-medium">Télécharger le ZIP</p>
//                         <p className="text-xs text-white/70">Archive complète</p>
//                       </div>
//                     </div>
//                     <span className="material-symbols-outlined">
//                       {downloading ? 'downloading' : 'download'}
//                     </span>
//                   </button>
//                 )}
                
//                 {!project.github_url && !project.demo_url && !project.zip_file && (
//                   <div className="text-center py-4">
//                     <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">link_off</span>
//                     <p className="text-gray-500 text-sm">Aucune ressource disponible</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Informations */}
//             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//               <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
//                 <span className="material-symbols-outlined">info</span>
//                 Informations
//               </h3>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                   <span className="text-gray-600">Statut</span>
//                   {getStatusBadge(project.status)}
//                 </div>
                
//                 <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                   <span className="text-gray-600">Cohorte</span>
//                   <span className="font-medium">{project.cohort || 'Non spécifiée'}</span>
//                 </div>
                
//                 <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                   <span className="text-gray-600">Date création</span>
//                   <span className="font-medium">{formatDate(project.created_at)}</span>
//                 </div>
                
//                 <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                   <span className="text-gray-600">Dernière mise à jour</span>
//                   <span className="font-medium">{formatDate(project.updated_at)}</span>
//                 </div>
                
//                 <div className="flex justify-between items-center py-2">
//                   <span className="text-gray-600">Catégorie</span>
//                   <span className="font-medium capitalize">{project.category || 'Développement'}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Projets similaires */}
//             {similarProjects.length > 0 && (
//               <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//                 <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
//                   <span className="material-symbols-outlined">auto_awesome</span>
//                   Projets similaires
//                 </h3>
//                 <div className="space-y-3">
//                   {similarProjects.map(similar => (
//                     <div
//                       key={similar.id}
//                       onClick={() => navigate(`/project/${similar.id}`)}
//                       className="group p-3 border border-gray-200 hover:border-[#E30613] rounded-lg cursor-pointer transition-all hover:shadow-md"
//                     >
//                       <div className="flex items-start gap-3">
//                         <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
//                           <span className="material-symbols-outlined text-blue-600 text-sm">code</span>
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <h4 className="font-medium text-gray-900 truncate group-hover:text-[#E30613]">
//                             {similar.title}
//                           </h4>
//                           <p className="text-xs text-gray-500 truncate">
//                             {similar.technologies?.split(',').slice(0, 2).join(', ')}
//                           </p>
//                         </div>
//                         <span className="material-symbols-outlined text-gray-400 group-hover:text-[#E30613] text-sm">
//                           arrow_forward
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Statistiques */}
//             <div className="bg-gradient-to-br from-[#001F3F] to-[#003265] rounded-2xl p-6 text-white">
//               <h3 className="text-lg font-bold mb-4">📊 Statistiques</h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold mb-1">{project.views || 0}</div>
//                   <div className="text-xs text-white/70">Vues</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold mb-1">{project.downloads || 0}</div>
//                   <div className="text-xs text-white/70">Téléchargements</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectDetail;


// // src/pages/ProjectDetail.jsx - VERSION PROFESSIONNELLE
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import authService from '../services/auth';

// const ProjectDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [similarProjects, setSimilarProjects] = useState([]);
//   const [user, setUser] = useState(null);
//   const [activeTab, setActiveTab] = useState('description');
//   const [downloading, setDownloading] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false);

//   useEffect(() => {
//     const currentUser = authService.getCurrentUser();
//     setUser(currentUser);
    
//     if (!currentUser) {
//       navigate('/login');
//       return;
//     }
    
//     loadProject();
//     checkIfFavorite();
//   }, [id, navigate]);

//   const loadProject = async () => {
//     try {
//       setLoading(true);
//       const token = authService.getAccessToken();
      
//       // Charger le projet avec plus de détails
//       const endpoints = [
//         `http://localhost:8000/api/projects/${id}/`,
//         `http://localhost:8000/api/projects/projects/${id}/`,
//         `http://localhost:8000/api/project/${id}/`
//       ];
      
//       let projectData = null;
      
//       for (const endpoint of endpoints) {
//         try {
//           const response = await fetch(endpoint, {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Accept': 'application/json'
//             }
//           });
          
//           if (response.ok) {
//             const data = await response.json();
//             projectData = data;
//             break;
//           }
//         } catch (error) {
//           continue;
//         }
//       }
      
//       if (projectData) {
//         setProject(projectData);
        
//         // Charger des projets similaires
//         if (projectData.technologies || projectData.category) {
//           loadSimilarProjects(projectData);
//         }
        
//         // Incrémenter les vues
//         incrementViews();
//       } else {
//         throw new Error('Projet non trouvé');
//       }
//     } catch (error) {
//       console.error('Erreur chargement projet:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadSimilarProjects = async (projectData) => {
//     try {
//       const token = authService.getAccessToken();
//       const techs = projectData.technologies ? encodeURIComponent(projectData.technologies.substring(0, 50)) : '';
//       const category = projectData.category ? encodeURIComponent(projectData.category) : '';
      
//       const response = await fetch(
//         `http://localhost:8000/api/projects/?${techs ? `technologies=${techs}` : ''}${category ? `&category=${category}` : ''}&exclude=${id}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Accept': 'application/json'
//           }
//         }
//       );
      
//       if (response.ok) {
//         const data = await response.json();
//         // Extraire les projets selon la structure
//         const projects = data.results || data.projects || data.data || data;
//         setSimilarProjects(projects.filter(p => p.id !== parseInt(id)).slice(0, 3));
//       }
//     } catch (error) {
//       console.error('Erreur chargement projets similaires:', error);
//     }
//   };

//   const incrementViews = async () => {
//     try {
//       const token = authService.getAccessToken();
//       await fetch(`http://localhost:8000/api/projects/${id}/increment-views/`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
//     } catch (error) {
//       // Ignorer l'erreur, ce n'est pas critique
//     }
//   };

//   const checkIfFavorite = () => {
//     // Vérifier si le projet est dans les favoris
//     const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
//     setIsFavorite(favorites.includes(parseInt(id)));
//   };

//   const toggleFavorite = () => {
//     const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
//     const projectId = parseInt(id);
    
//     if (isFavorite) {
//       const newFavorites = favorites.filter(favId => favId !== projectId);
//       localStorage.setItem('favorites', JSON.stringify(newFavorites));
//       setIsFavorite(false);
//     } else {
//       favorites.push(projectId);
//       localStorage.setItem('favorites', JSON.stringify(favorites));
//       setIsFavorite(true);
//     }
//   };

//   const handleDownloadZip = async () => {
//     if (!project || downloading) return;
    
//     setDownloading(true);
    
//     try {
//       let zipFileUrl = project.zip_file;
      
//       if (!zipFileUrl) {
//         // Essayer de récupérer depuis les détails complets
//         const token = authService.getAccessToken();
//         const response = await fetch(`http://localhost:8000/api/projects/${id}/`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Accept': 'application/json'
//           }
//         });
        
//         if (response.ok) {
//           const data = await response.json();
//           zipFileUrl = data.zip_file;
//         }
//       }
      
//       if (zipFileUrl) {
//         // Normaliser l'URL
//         let finalUrl = zipFileUrl;
//         if (!zipFileUrl.startsWith('http')) {
//           if (zipFileUrl.startsWith('/media/') || zipFileUrl.startsWith('/static/')) {
//             finalUrl = `http://localhost:8000${zipFileUrl}`;
//           } else {
//             finalUrl = `http://localhost:8000/media/${zipFileUrl}`;
//           }
//         }
        
//         // Créer un lien pour le téléchargement
//         const link = document.createElement('a');
//         link.href = finalUrl;
//         link.download = `${project.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.zip`;
//         link.target = '_blank';
        
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
        
//         // Enregistrer le téléchargement
//         await fetch(`http://localhost:8000/api/projects/${id}/increment-downloads/`, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${authService.getAccessToken()}`,
//             'Content-Type': 'application/json'
//           }
//         });
//       } else {
//         alert('Aucun fichier ZIP disponible pour ce projet.');
//       }
//     } catch (error) {
//       console.error('Erreur téléchargement:', error);
//       alert('Erreur lors du téléchargement. Veuillez réessayer.');
//     } finally {
//       setDownloading(false);
//     }
//   };

//   const shareProject = () => {
//     const shareUrl = window.location.href;
//     const title = project.title;
    
//     if (navigator.share) {
//       navigator.share({
//         title: title,
//         text: `Découvrez ce projet : ${title}`,
//         url: shareUrl,
//       });
//     } else {
//       navigator.clipboard.writeText(shareUrl);
//       alert('Lien copié dans le presse-papier !');
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Date inconnue';
//     try {
//       return new Date(dateString).toLocaleDateString('fr-FR', {
//         day: 'numeric',
//         month: 'long',
//         year: 'numeric'
//       });
//     } catch {
//       return 'Date invalide';
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statusMap = {
//       'published': { label: '✅ Publié', color: 'bg-green-100 text-green-800 border border-green-200' },
//       'pending': { label: '⏳ En attente', color: 'bg-yellow-100 text-yellow-800 border border-yellow-200' },
//       'draft': { label: '📝 Brouillon', color: 'bg-gray-100 text-gray-800 border border-gray-200' },
//       'approved': { label: '✅ Approuvé', color: 'bg-blue-100 text-blue-800 border border-blue-200' },
//       'rejected': { label: '❌ Rejeté', color: 'bg-red-100 text-red-800 border border-red-200' }
//     };
    
//     const statusInfo = statusMap[status?.toLowerCase()] || statusMap.draft;
    
//     return (
//       <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
//         {statusInfo.label}
//       </span>
//     );
//   };

//   const getTechnologies = () => {
//     if (!project?.technologies) return [];
//     if (Array.isArray(project.technologies)) return project.technologies;
//     if (typeof project.technologies === 'string') {
//       return project.technologies.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0);
//     }
//     return [];
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="relative">
//             <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#E30613] border-t-transparent mx-auto"></div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="h-8 w-8 bg-[#001F3F] rounded-full animate-pulse"></div>
//             </div>
//           </div>
//           <p className="mt-6 text-lg font-medium text-gray-700">Chargement du projet</p>
//           <p className="mt-2 text-sm text-gray-500">Nous préparons tous les détails...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!project) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
//         <div className="text-center max-w-md">
//           <div className="text-6xl mb-6">🔍</div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-3">Projet non trouvé</h1>
//           <p className="text-gray-600 mb-8">
//             Le projet que vous recherchez n'existe pas ou a été déplacé.
//           </p>
//           <div className="space-y-3">
//             <button
//               onClick={() => navigate('/explore')}
//               className="w-full px-6 py-3 bg-gradient-to-r from-[#001F3F] to-[#003265] text-white rounded-xl hover:opacity-90 transition-all font-medium"
//             >
//               Explorer les projets
//             </button>
//             <button
//               onClick={() => navigate(-1)}
//               className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
//             >
//               ← Retour
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const technologies = getTechnologies();
//   const isOwner = user && user.id && (user.id === project.author_id || user.id === project.author?.id);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Navigation */}
//       <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <button
//               onClick={() => navigate(-1)}
//               className="flex items-center gap-2 text-gray-600 hover:text-[#001F3F] transition-colors"
//             >
//               <span className="material-symbols-outlined">arrow_back</span>
//               <span className="font-medium">Retour</span>
//             </button>
            
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={toggleFavorite}
//                 className={`p-2 rounded-full ${isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
//                 title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
//               >
//                 <span className="material-symbols-outlined">
//                   {isFavorite ? 'favorite' : 'favorite_border'}
//                 </span>
//               </button>
              
//               <button
//                 onClick={shareProject}
//                 className="p-2 rounded-full text-gray-400 hover:text-[#001F3F] hover:bg-gray-100"
//                 title="Partager"
//               >
//                 <span className="material-symbols-outlined">share</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* En-tête */}
//         <div className="mb-8">
//           <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
//             <div className="flex-1">
//               <div className="flex items-center gap-3 mb-3">
//                 {getStatusBadge(project.status)}
//                 <span className="text-sm text-gray-500">
//                   {project.views || 0} vues • {project.downloads || 0} téléchargements
//                 </span>
//               </div>
              
//               <h1 className="text-3xl lg:text-4xl font-bold text-[#001F3F] mb-3">
//                 {project.title}
//               </h1>
              
//               <div className="flex flex-wrap items-center gap-4 text-gray-600">
//                 <div className="flex items-center gap-2">
//                   <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
//                     {project.author_name?.charAt(0) || 'U'}
//                   </div>
//                   <div>
//                     <p className="font-medium">{project.author_name || 'Auteur inconnu'}</p>
//                     <p className="text-xs text-gray-500">{project.cohort || 'Sans cohorte'}</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center gap-1">
//                   <span className="material-symbols-outlined text-sm">calendar_today</span>
//                   <span className="text-sm">{formatDate(project.created_at)}</span>
//                 </div>
                
//                 {project.category && (
//                   <div className="flex items-center gap-1">
//                     <span className="material-symbols-outlined text-sm">category</span>
//                     <span className="text-sm capitalize">{project.category}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
            
//             {/* Actions */}
//             <div className="flex flex-wrap gap-3">
//               {isOwner && (
//                 <Link
//                   to={`/upload?edit=${project.id}`}
//                   className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2 font-medium"
//                 >
//                   <span className="material-symbols-outlined">edit</span>
//                   Modifier
//                 </Link>
//               )}
              
//               <button
//                 onClick={handleDownloadZip}
//                 disabled={downloading}
//                 className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2 font-medium disabled:opacity-50"
//               >
//                 <span className="material-symbols-outlined">
//                   {downloading ? 'downloading' : 'download'}
//                 </span>
//                 {downloading ? 'Téléchargement...' : 'Télécharger le projet'}
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Colonne principale */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Image du projet */}
//             <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
//               {project.image ? (
//                 <img
//                   src={project.image}
//                   alt={project.title}
//                   className="w-full h-80 lg:h-96 object-cover"
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.src = `https://via.placeholder.com/800x400/001F3F/ffffff?text=${encodeURIComponent(project.title)}`;
//                   }}
//                 />
//               ) : (
//                 <div className="w-full h-80 lg:h-96 bg-gradient-to-br from-[#001F3F] to-[#003265] flex items-center justify-center">
//                   <div className="text-center p-8">
//                     <span className="material-symbols-outlined text-white text-6xl mb-4">
//                       code
//                     </span>
//                     <p className="text-white text-lg font-medium">{project.title}</p>
//                     <p className="text-white/70 mt-2">Projet de développement</p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Onglets - MAJ: Seulement 2 onglets */}
//             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
//               <div className="border-b border-gray-200">
//                 <nav className="flex">
//                   {['description', 'technologies'].map(tab => (
//                     <button
//                       key={tab}
//                       onClick={() => setActiveTab(tab)}
//                       className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
//                         activeTab === tab
//                           ? 'text-[#E30613] border-b-2 border-[#E30613]'
//                           : 'text-gray-600 hover:text-gray-900'
//                       }`}
//                     >
//                       {tab === 'description' && '📋 Description'}
//                       {tab === 'technologies' && '🛠️ Technologies'}
//                     </button>
//                   ))}
//                 </nav>
//               </div>
              
//               <div className="p-6">
//                 {activeTab === 'description' && (
//                   <div className="prose max-w-none">
//                     <h3 className="text-xl font-bold text-gray-900 mb-4">À propos de ce projet</h3>
//                     <div className="space-y-4 text-gray-700">
//                       {project.description ? (
//                         project.description.split('\n').map((paragraph, index) => (
//                           <p key={index} className="leading-relaxed">{paragraph}</p>
//                         ))
//                       ) : (
//                         <p className="text-gray-500 italic">Aucune description fournie pour ce projet.</p>
//                       )}
//                     </div>
//                   </div>
//                 )}
                
//                 {activeTab === 'technologies' && (
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-900 mb-6">Stack technique</h3>
//                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//                       {technologies.map((tech, index) => (
//                         <div
//                           key={index}
//                           className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 text-center hover:border-blue-300 transition-colors"
//                         >
//                           <div className="text-2xl mb-2">
//                             {tech.toLowerCase().includes('react') && '⚛️'}
//                             {tech.toLowerCase().includes('node') && '🟢'}
//                             {tech.toLowerCase().includes('python') && '🐍'}
//                             {tech.toLowerCase().includes('django') && '🐳'}
//                             {tech.toLowerCase().includes('js') && '📜'}
//                             {!tech.toLowerCase().includes('react') && 
//                              !tech.toLowerCase().includes('node') && 
//                              !tech.toLowerCase().includes('python') && 
//                              !tech.toLowerCase().includes('django') && 
//                              !tech.toLowerCase().includes('js') && '💻'}
//                           </div>
//                           <span className="font-medium text-gray-800">{tech}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Liens externes */}
//             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//               <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
//                 <span className="material-symbols-outlined">link</span>
//                 Ressources
//               </h3>
//               <div className="space-y-3">
//                 {project.github_url && (
//                   <a
//                     href={project.github_url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
//                         <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
//                           <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
//                         </svg>
//                       </div>
//                       <div>
//                         <p className="font-medium">Repository GitHub</p>
//                         <p className="text-xs text-gray-500">Code source</p>
//                       </div>
//                     </div>
//                     <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-600">open_in_new</span>
//                   </a>
//                 )}
                
//                 {project.demo_url && (
//                   <a
//                     href={project.demo_url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center justify-between p-3 bg-gradient-to-r from-[#001F3F] to-[#003265] text-white hover:opacity-90 rounded-lg transition-all group"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                         <span className="material-symbols-outlined">rocket_launch</span>
//                       </div>
//                       <div>
//                         <p className="font-medium">Démo en ligne</p>
//                         <p className="text-xs text-white/70">Voir en action</p>
//                       </div>
//                     </div>
//                     <span className="material-symbols-outlined">open_in_new</span>
//                   </a>
//                 )}
                
//                 {project.zip_file && (
//                   <button
//                     onClick={handleDownloadZip}
//                     disabled={downloading}
//                     className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:opacity-90 rounded-lg transition-all group disabled:opacity-50"
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                         <span className="material-symbols-outlined">download</span>
//                       </div>
//                       <div>
//                         <p className="font-medium">Télécharger le ZIP</p>
//                         <p className="text-xs text-white/70">Archive complète</p>
//                       </div>
//                     </div>
//                     <span className="material-symbols-outlined">
//                       {downloading ? 'downloading' : 'download'}
//                     </span>
//                   </button>
//                 )}
                
//                 {!project.github_url && !project.demo_url && !project.zip_file && (
//                   <div className="text-center py-4">
//                     <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">link_off</span>
//                     <p className="text-gray-500 text-sm">Aucune ressource disponible</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Informations */}
//             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//               <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
//                 <span className="material-symbols-outlined">info</span>
//                 Informations
//               </h3>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                   <span className="text-gray-600">Statut</span>
//                   {getStatusBadge(project.status)}
//                 </div>
                
//                 <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                   <span className="text-gray-600">Cohorte</span>
//                   <span className="font-medium">{project.cohort || 'Non spécifiée'}</span>
//                 </div>
                
//                 <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                   <span className="text-gray-600">Date création</span>
//                   <span className="font-medium">{formatDate(project.created_at)}</span>
//                 </div>
                
//                 <div className="flex justify-between items-center py-2 border-b border-gray-100">
//                   <span className="text-gray-600">Dernière mise à jour</span>
//                   <span className="font-medium">{formatDate(project.updated_at)}</span>
//                 </div>
                
//                 <div className="flex justify-between items-center py-2">
//                   <span className="text-gray-600">Catégorie</span>
//                   <span className="font-medium capitalize">{project.category || 'Développement'}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Projets similaires */}
//             {similarProjects.length > 0 && (
//               <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
//                 <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
//                   <span className="material-symbols-outlined">auto_awesome</span>
//                   Projets similaires
//                 </h3>
//                 <div className="space-y-3">
//                   {similarProjects.map(similar => (
//                     <div
//                       key={similar.id}
//                       onClick={() => navigate(`/project/${similar.id}`)}
//                       className="group p-3 border border-gray-200 hover:border-[#E30613] rounded-lg cursor-pointer transition-all hover:shadow-md"
//                     >
//                       <div className="flex items-start gap-3">
//                         <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
//                           <span className="material-symbols-outlined text-blue-600 text-sm">code</span>
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <h4 className="font-medium text-gray-900 truncate group-hover:text-[#E30613]">
//                             {similar.title}
//                           </h4>
//                           <p className="text-xs text-gray-500 truncate">
//                             {similar.technologies?.split(',').slice(0, 2).join(', ')}
//                           </p>
//                         </div>
//                         <span className="material-symbols-outlined text-gray-400 group-hover:text-[#E30613] text-sm">
//                           arrow_forward
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectDetail;


// src/pages/ProjectDetail.jsx - VERSION PROFESSIONNELLE
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarProjects, setSimilarProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [downloading, setDownloading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [zipAvailable, setZipAvailable] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    loadProject();
    checkIfFavorite();
  }, [id, navigate]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const token = authService.getAccessToken();
      
      // Charger le projet avec plus de détails
      const endpoints = [
        `http://localhost:8000/api/projects/${id}/`,
        `http://localhost:8000/api/projects/projects/${id}/`,
        `http://localhost:8000/api/project/${id}/`
      ];
      
      let projectData = null;
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            projectData = data;
            break;
          }
        } catch (error) {
          continue;
        }
      }
      
      if (projectData) {
        setProject(projectData);
        
        // Vérifier si un fichier ZIP est disponible
        checkZipAvailability(projectData, token);
        
        // Charger des projets similaires
        if (projectData.technologies || projectData.category) {
          loadSimilarProjects(projectData);
        }
        
        // Incrémenter les vues
        incrementViews();
      } else {
        throw new Error('Projet non trouvé');
      }
    } catch (error) {
      console.error('Erreur chargement projet:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkZipAvailability = async (projectData, token) => {
    try {
      // Vérifier d'abord dans les données du projet
      let zipFile = projectData.zip_file || projectData.zip || projectData.file;
      
      if (zipFile) {
        setZipAvailable(true);
        return;
      }
      
      // Si pas trouvé, essayer une requête spécifique
      const response = await fetch(`http://localhost:8000/api/projects/${id}/download/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.zip_file || data.download_url) {
          setZipAvailable(true);
          // Mettre à jour le projet avec l'URL du ZIP
          setProject(prev => ({
            ...prev,
            zip_file: data.zip_file || data.download_url
          }));
        }
      }
    } catch (error) {
      console.warn('Erreur vérification ZIP:', error);
    }
  };

  const loadSimilarProjects = async (projectData) => {
    try {
      const token = authService.getAccessToken();
      const techs = projectData.technologies ? encodeURIComponent(projectData.technologies.substring(0, 50)) : '';
      const category = projectData.category ? encodeURIComponent(projectData.category) : '';
      
      const response = await fetch(
        `http://localhost:8000/api/projects/?${techs ? `technologies=${techs}` : ''}${category ? `&category=${category}` : ''}&exclude=${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        // Extraire les projets selon la structure
        const projects = data.results || data.projects || data.data || data;
        setSimilarProjects(projects.filter(p => p.id !== parseInt(id)).slice(0, 3));
      }
    } catch (error) {
      console.error('Erreur chargement projets similaires:', error);
    }
  };

  const incrementViews = async () => {
    try {
      const token = authService.getAccessToken();
      await fetch(`http://localhost:8000/api/projects/${id}/increment-views/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      // Ignorer l'erreur, ce n'est pas critique
    }
  };

  const checkIfFavorite = () => {
    // Vérifier si le projet est dans les favoris
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(parseInt(id)));
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const projectId = parseInt(id);
    
    if (isFavorite) {
      const newFavorites = favorites.filter(favId => favId !== projectId);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
    } else {
      favorites.push(projectId);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  const handleDownloadZip = async () => {
    if (!project || downloading) return;
    
    setDownloading(true);
    
    try {
      const token = authService.getAccessToken();
      
      // 1. Essayer plusieurs endpoints pour le téléchargement
      const downloadEndpoints = [
        `http://localhost:8000/api/projects/${id}/download/`,
        `http://localhost:8000/api/projects/${id}/download-zip/`,
        `http://localhost:8000/api/projects/${id}/zip/`
      ];
      
      let downloadUrl = null;
      
      for (const endpoint of downloadEndpoints) {
        try {
          const response = await fetch(endpoint, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            downloadUrl = data.download_url || data.zip_file || data.url;
            if (downloadUrl) break;
          }
        } catch (error) {
          continue;
        }
      }
      
      // 2. Si pas d'URL spécifique, essayer le champ zip_file du projet
      if (!downloadUrl && project.zip_file) {
        downloadUrl = project.zip_file;
      }
      
      // 3. Si toujours pas d'URL, essayer directement le fichier media
      if (!downloadUrl) {
        // Construire l'URL du fichier basée sur le pattern Django
        downloadUrl = `http://localhost:8000/media/projects/project_${id}/project.zip`;
      }
      
      console.log('URL de téléchargement:', downloadUrl);
      
      // 4. Construire l'URL complète
      let finalUrl = downloadUrl;
      if (!downloadUrl.startsWith('http')) {
        if (downloadUrl.startsWith('/media/')) {
          finalUrl = `http://localhost:8000${downloadUrl}`;
        } else if (downloadUrl.startsWith('media/')) {
          finalUrl = `http://localhost:8000/${downloadUrl}`;
        } else {
          finalUrl = `http://localhost:8000/media/${downloadUrl}`;
        }
      }
      
      // 5. Télécharger le fichier avec différentes méthodes
      
      // Méthode 1: Redirection directe (la plus simple)
      window.open(finalUrl, '_blank');
      
      // OU Méthode 2: Créer un lien et le cliquer
      /*
      const link = document.createElement('a');
      link.href = finalUrl;
      link.download = project.title 
        ? `${project.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.zip`
        : `project-${id}.zip`;
      link.target = '_blank';
      
      // Ajouter le token si nécessaire
      if (!finalUrl.includes('?')) {
        link.href = `${finalUrl}?token=${token}`;
      }
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      */
      
      // 6. Enregistrer le téléchargement
      try {
        await fetch(`http://localhost:8000/api/projects/${id}/increment-downloads/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        // Mettre à jour localement le compteur
        setProject(prev => ({
          ...prev,
          downloads: (prev.downloads || 0) + 1
        }));
      } catch (statsError) {
        console.warn('Erreur incrémentation des téléchargements:', statsError);
      }
      
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      
      // Essayer une méthode alternative
      try {
        // Méthode alternative: Téléchargement via blob
        const token = authService.getAccessToken();
        const response = await fetch(`http://localhost:8000/api/projects/${id}/download/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `project-${id}.zip`;
          link.click();
          window.URL.revokeObjectURL(url);
        } else {
          throw new Error('Téléchargement échoué');
        }
      } catch (altError) {
        console.error('Erreur méthode alternative:', altError);
        alert('Impossible de télécharger le fichier. Le créateur n\'a peut-être pas déposé de fichier ZIP, ou le fichier a été supprimé.');
      }
    } finally {
      setDownloading(false);
    }
  };

  const shareProject = () => {
    const shareUrl = window.location.href;
    const title = project.title;
    
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Découvrez ce projet : ${title}`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Lien copié dans le presse-papier !');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'Date invalide';
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'published': { label: '✅ Publié', color: 'bg-green-100 text-green-800 border border-green-200' },
      'pending': { label: '⏳ En attente', color: 'bg-yellow-100 text-yellow-800 border border-yellow-200' },
      'draft': { label: '📝 Brouillon', color: 'bg-gray-100 text-gray-800 border border-gray-200' },
      'approved': { label: '✅ Approuvé', color: 'bg-blue-100 text-blue-800 border border-blue-200' },
      'rejected': { label: '❌ Rejeté', color: 'bg-red-100 text-red-800 border border-red-200' }
    };
    
    const statusInfo = statusMap[status?.toLowerCase()] || statusMap.draft;
    
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getTechnologies = () => {
    if (!project?.technologies) return [];
    if (Array.isArray(project.technologies)) return project.technologies;
    if (typeof project.technologies === 'string') {
      return project.technologies.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0);
    }
    return [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#E30613] border-t-transparent mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 bg-[#001F3F] rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700">Chargement du projet</p>
          <p className="mt-2 text-sm text-gray-500">Nous préparons tous les détails...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Projet non trouvé</h1>
          <p className="text-gray-600 mb-8">
            Le projet que vous recherchez n'existe pas ou a été déplacé.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/explore')}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#001F3F] to-[#003265] text-white rounded-xl hover:opacity-90 transition-all font-medium"
            >
              Explorer les projets
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
            >
              ← Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  const technologies = getTechnologies();
  const isOwner = user && user.id && (user.id === project.author_id || user.id === project.author?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-[#001F3F] transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="font-medium">Retour</span>
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-full ${isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                <span className="material-symbols-outlined">
                  {isFavorite ? 'favorite' : 'favorite_border'}
                </span>
              </button>
              
              <button
                onClick={shareProject}
                className="p-2 rounded-full text-gray-400 hover:text-[#001F3F] hover:bg-gray-100"
                title="Partager"
              >
                <span className="material-symbols-outlined">share</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                {getStatusBadge(project.status)}
                <span className="text-sm text-gray-500">
                  {project.views || 0} vues • {project.downloads || 0} téléchargements
                </span>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-[#001F3F] mb-3">
                {project.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {project.author_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-medium">{project.author_name || 'Auteur inconnu'}</p>
                    <p className="text-xs text-gray-500">{project.cohort || 'Sans cohorte'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  <span className="text-sm">{formatDate(project.created_at)}</span>
                </div>
                
                {project.category && (
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">category</span>
                    <span className="text-sm capitalize">{project.category}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {isOwner && (
                <Link
                  to={`/upload?edit=${project.id}`}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2 font-medium"
                >
                  <span className="material-symbols-outlined">edit</span>
                  Modifier
                </Link>
              )}
              
              <button
                onClick={handleDownloadZip}
                disabled={downloading}
                className={`px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 font-medium ${
                  zipAvailable 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:opacity-90'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                title={zipAvailable ? "Télécharger le projet" : "Aucun fichier ZIP disponible"}
              >
                <span className="material-symbols-outlined">
                  {downloading ? 'downloading' : 'download'}
                </span>
                {downloading ? 'Téléchargement...' : 'Télécharger le projet'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image du projet */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-80 lg:h-96 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://via.placeholder.com/800x400/001F3F/ffffff?text=${encodeURIComponent(project.title)}`;
                  }}
                />
              ) : (
                <div className="w-full h-80 lg:h-96 bg-gradient-to-br from-[#001F3F] to-[#003265] flex items-center justify-center">
                  <div className="text-center p-8">
                    <span className="material-symbols-outlined text-white text-6xl mb-4">
                      code
                    </span>
                    <p className="text-white text-lg font-medium">{project.title}</p>
                    <p className="text-white/70 mt-2">Projet de développement</p>
                  </div>
                </div>
              )}
            </div>

            {/* Onglets - MAJ: Seulement 2 onglets */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {['description', 'technologies'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                        activeTab === tab
                          ? 'text-[#E30613] border-b-2 border-[#E30613]'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab === 'description' && '📋 Description'}
                      {tab === 'technologies' && '🛠️ Technologies'}
                    </button>
                  ))}
                </nav>
              </div>
              
              <div className="p-6">
                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">À propos de ce projet</h3>
                    <div className="space-y-4 text-gray-700">
                      {project.description ? (
                        project.description.split('\n').map((paragraph, index) => (
                          <p key={index} className="leading-relaxed">{paragraph}</p>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">Aucune description fournie pour ce projet.</p>
                      )}
                    </div>
                  </div>
                )}
                
                {activeTab === 'technologies' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Stack technique</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {technologies.map((tech, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 text-center hover:border-blue-300 transition-colors"
                        >
                          <div className="text-2xl mb-2">
                            {tech.toLowerCase().includes('react') && '⚛️'}
                            {tech.toLowerCase().includes('node') && '🟢'}
                            {tech.toLowerCase().includes('python') && '🐍'}
                            {tech.toLowerCase().includes('django') && '🐳'}
                            {tech.toLowerCase().includes('js') && '📜'}
                            {!tech.toLowerCase().includes('react') && 
                             !tech.toLowerCase().includes('node') && 
                             !tech.toLowerCase().includes('python') && 
                             !tech.toLowerCase().includes('django') && 
                             !tech.toLowerCase().includes('js') && '💻'}
                          </div>
                          <span className="font-medium text-gray-800">{tech}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Liens externes */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">link</span>
                Ressources
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
                      <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Repository GitHub</p>
                        <p className="text-xs text-gray-500">Code source</p>
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
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-[#001F3F] to-[#003265] text-white hover:opacity-90 rounded-lg transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined">rocket_launch</span>
                      </div>
                      <div>
                        <p className="font-medium">Démo en ligne</p>
                        <p className="text-xs text-white/70">Voir en action</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined">open_in_new</span>
                  </a>
                )}
                
                {/* Bouton de téléchargement ZIP */}
                <button
                  onClick={handleDownloadZip}
                  disabled={downloading}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all group ${
                    zipAvailable
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:opacity-90'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  title={zipAvailable ? "Télécharger le projet" : "Aucun fichier ZIP disponible"}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      zipAvailable ? 'bg-white/20' : 'bg-gray-200'
                    }`}>
                      <span className="material-symbols-outlined">
                        {downloading ? 'downloading' : 'download'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">
                        {zipAvailable 
                          ? (downloading ? 'Téléchargement...' : 'Télécharger le ZIP') 
                          : 'ZIP non disponible'}
                      </p>
                      <p className="text-xs opacity-70">
                        {zipAvailable ? 'Archive complète' : 'Fichier manquant'}
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined">
                    {downloading ? 'downloading' : 'download'}
                  </span>
                </button>
                
                {!project.github_url && !project.demo_url && !zipAvailable && (
                  <div className="text-center py-4">
                    <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">link_off</span>
                    <p className="text-gray-500 text-sm">Aucune ressource disponible</p>
                  </div>
                )}
              </div>
            </div>

            {/* Informations */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">info</span>
                Informations
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Statut</span>
                  {getStatusBadge(project.status)}
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Cohorte</span>
                  <span className="font-medium">{project.cohort || 'Non spécifiée'}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Date création</span>
                  <span className="font-medium">{formatDate(project.created_at)}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Dernière mise à jour</span>
                  <span className="font-medium">{formatDate(project.updated_at)}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Fichier ZIP</span>
                  <span className={`font-medium ${zipAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {zipAvailable ? 'Disponible' : 'Indisponible'}
                  </span>
                </div>
              </div>
            </div>

            {/* Projets similaires */}
            {similarProjects.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined">auto_awesome</span>
                  Projets similaires
                </h3>
                <div className="space-y-3">
                  {similarProjects.map(similar => (
                    <div
                      key={similar.id}
                      onClick={() => navigate(`/project/${similar.id}`)}
                      className="group p-3 border border-gray-200 hover:border-[#E30613] rounded-lg cursor-pointer transition-all hover:shadow-md"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                          <span className="material-symbols-outlined text-blue-600 text-sm">code</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate group-hover:text-[#E30613]">
                            {similar.title}
                          </h4>
                          <p className="text-xs text-gray-500 truncate">
                            {similar.technologies?.split(',').slice(0, 2).join(', ')}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-gray-400 group-hover:text-[#E30613] text-sm">
                          arrow_forward
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;