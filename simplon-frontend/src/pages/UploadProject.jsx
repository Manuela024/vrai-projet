
// // src/UploadProject.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import { projectService } from '../services/projects';
// import authService from '../services/auth';
// import { useProjects } from '../context/ProjectContext';

// console.log('🔧 Import projectService dans', 
//   (new Error().stack?.split('\n')[2] || '').trim() || 'Unknown location'
// );
// const UploadProject = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     technologies: '',
//     description: '',
//     cohort: '',
//     tags: '',
//     github_url: '',
//     demo_url: '',
//     status: 'draft'
//   });
//   const [file, setFile] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [error, setError] = useState('');
//   const [isEditing, setIsEditing] = useState(false);
//   const [editProjectId, setEditProjectId] = useState(null);
//   const [user, setUser] = useState(null);
  
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const { addProject, updateProject } = useProjects();

//   const cohortsList = [
//     'DWWM - Mars 2024',
//     'CDA - Janvier 2024', 
//     'AI Engineer - Mai 2024',
//     'DWWM - Novembre 2023',
//     'CDA - Septembre 2023'
//   ];

//   useEffect(() => {
//     // Récupérer l'utilisateur connecté
//     const currentUser = authService.getCurrentUser();
//     console.log('👤 DEBUG - Utilisateur connecté:', currentUser);
//     console.log('👤 DEBUG - User ID:', currentUser?.id);
//     console.log('👤 DEBUG - User structure:', JSON.stringify(currentUser, null, 2));
    
//     setUser(currentUser);
    
//     // Pré-remplir la cohorte avec celle de l'utilisateur si disponible
//     if (currentUser?.cohort) {
//       setFormData(prev => ({
//         ...prev,
//         cohort: currentUser.cohort
//       }));
//     }

//     const editId = searchParams.get('edit');
//     if (editId) {
//       loadProjectForEdit(editId);
//     }
//   }, [searchParams]);

//   const loadProjectForEdit = async (projectId) => {
//     try {
//       const project = await projectService.getProjectDetails(projectId);
      
//       // Map des statuts Django vers statuts React
//       const statusMapFromDjango = {
//         'draft': 'draft',
//         'pending': 'pending',
//         'approved': 'published',
//         'rejected': 'draft'
//       };
      
//       setFormData({
//         title: project.title || '',
//         technologies: project.technologies || '',
//         description: project.description || '',
//         cohort: project.cohort || '',
//         tags: project.tags || '',
//         github_url: project.github_url || '',
//         demo_url: project.demo_url || '',
//         status: statusMapFromDjango[project.status] || 'draft'
//       });
//       setIsEditing(true);
//       setEditProjectId(projectId);
//     } catch (err) {
//       console.error('Erreur chargement projet:', err);
//       setError('Erreur lors du chargement du projet');
//     }
//   };

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [id]: value
//     }));
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       if (selectedFile.size > 50 * 1024 * 1024) {
//         setError('Le fichier est trop volumineux. Taille maximum: 50MB');
//         return;
//       }
      
//       if (!selectedFile.name.toLowerCase().endsWith('.zip')) {
//         setError('Veuillez sélectionner un fichier ZIP');
//         return;
//       }

//       setFile(selectedFile);
//       setError('');
//     }
//   };

//   const handleImageChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       if (selectedFile.size > 5 * 1024 * 1024) {
//         setError('L\'image est trop volumineuse. Taille maximum: 5MB');
//         return;
//       }
      
//       const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
//       if (!validTypes.includes(selectedFile.type)) {
//         setError('Format d\'image non supporté. Utilisez JPG, PNG ou GIF');
//         return;
//       }

//       setImageFile(selectedFile);
//       setError('');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     console.log('📝 DEBUG - Début handleSubmit');
    
//     // Validation de base
//     if (!formData.title.trim()) {
//       setError('Veuillez saisir un nom pour votre projet');
//       return;
//     }

//     if (!formData.technologies.trim()) {
//       setError('Veuillez saisir les technologies utilisées');
//       return;
//     }

//     if (!isEditing && !file) {
//       setError('Veuillez sélectionner un fichier ZIP');
//       return;
//     }

//     // ⭐ VÉRIFICATION CRITIQUE : Utilisateur connecté
//     if (!user || !user.id) {
//       setError('Vous devez être connecté pour créer un projet');
//       console.error('❌ Aucun utilisateur connecté:', user);
//       return;
//     }

//     setIsUploading(true);

//     try {
//       // Map des statuts React vers statuts Django
//       const statusMapToDjango = {
//         'draft': 'draft',
//         'pending': 'pending', 
//         'published': 'approved'
//       };

//       // ⭐ CORRECTION : Ajouter l'utilisateur
//       const projectData = {
//         title: formData.title.trim(),
//         technologies: formData.technologies.trim(),
//         description: formData.description.trim(),
//         cohort: formData.cohort.trim(),
//         tags: formData.tags.trim(),
//         github_url: formData.github_url.trim(),
//         demo_url: formData.demo_url.trim(),
//         status: statusMapToDjango[formData.status] || 'draft',
//         // ⭐ AJOUT CRITIQUE : L'ID de l'utilisateur
//         author: user.id
//       };

//       console.log('🎯 DEBUG - Données envoyées à l\'API:', projectData);
//       console.log('👤 DEBUG - User ID:', user.id);

//       let project;

//       if (isEditing) {
//         // Mise à jour du projet existant
//         console.log('✏️ DEBUG - Mise à jour du projet:', editProjectId);
        
//         // Si nouvelle image, l'ajouter
//         if (imageFile) {
//           projectData.image = imageFile;
//         }
        
//         project = await projectService.updateProject(editProjectId, projectData);
//         updateProject(project);
        
//         console.log('✅ DEBUG - Projet modifié, redirection...');
//         navigate('/project-success', { 
//           state: { 
//             project: project,
//             isEditing: true
//           } 
//         });
//       } else {
//         // Création d'un nouveau projet
//         console.log('🚀 DEBUG - Tentative de création du projet...');
//         console.log('📋 DEBUG - Data envoyée:', JSON.stringify(projectData, null, 2));
        
//         // Ajouter les fichiers pour la création
//         if (file) {
//           projectData.zip_file = file;
//         }
//         if (imageFile) {
//           projectData.image = imageFile;
//         }
        
//         const createdProject = await projectService.createProject(projectData);
//         console.log('✅ DEBUG - Projet créé:', createdProject);
//         project = createdProject;

//         // Validation de l'ID reçu
//         if (!project.id) {
//           console.error('❌ CRITIQUE: Aucun ID reçu après création');
//           // Générer un ID temporaire pour la suite du processus
//           const tempId = `temp_${Date.now()}`;
//           project.id = tempId;
//           console.log('🆔 ID temporaire généré:', project.id);
//         } else {
//           console.log('🆔 ID du projet:', project.id);
//         }
        
//         // Ajoute au contexte global
//         addProject(project);
        
//         console.log('✅ DEBUG - Redirection vers succès...');
//         navigate('/project-success', { 
//           state: { 
//             project: project,
//             isEditing: false
//           } 
//         });
//       }

//     } catch (err) {
//       console.error('❌ DEBUG - Erreur dans handleSubmit:', err);
//       console.error('❌ DEBUG - Response data:', err.response?.data);
      
//       let errorMessage = `Erreur lors de ${isEditing ? 'la modification' : 'la création'} du projet`;
      
//       if (err.response?.data) {
//         const errors = err.response.data;
        
//         // Traitement spécifique pour l'erreur de statut
//         if (typeof errors === 'object') {
//           if (errors.status && Array.isArray(errors.status)) {
//             // Erreur de validation Django sur le champ status
//             const statusError = errors.status[0];
//             if (statusError.includes("n'est pas un choix valide")) {
//               errorMessage = 'Erreur de statut: veuillez sélectionner un statut valide (draft, pending, ou approved)';
//             } else {
//               errorMessage = `Erreur de statut: ${statusError}`;
//             }
//           } else {
//             // Autres erreurs de validation
//             const errorDetails = Object.entries(errors)
//               .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
//               .join('; ');
//             errorMessage = `Erreurs de validation: ${errorDetails}`;
//           }
//         } else if (typeof errors === 'string') {
//           if (errors.includes('<!DOCTYPE html>')) {
//             errorMessage = 'Erreur serveur - Veuillez réessayer';
//           } else {
//             errorMessage = errors;
//           }
//         }
//       } else if (err.message) {
//         errorMessage = err.message;
//       }
      
//       setError(errorMessage);
//     } finally {
//       setIsUploading(false);
//       setUploadProgress(0);
//     }
//   };

//   const handleLogout = () => {
//     authService.logout();
//     navigate('/login');
//   };

//   // Fonction pour réinitialiser le formulaire
//   const resetForm = () => {
//     setFormData({
//       title: '',
//       technologies: '',
//       description: '',
//       cohort: user?.cohort || '',
//       tags: '',
//       github_url: '',
//       demo_url: '',
//       status: 'draft'
//     });
//     setFile(null);
//     setImageFile(null);
//     setError('');
//   };

//   // Fonction pour obtenir l'URL de l'avatar de l'utilisateur
//   const getUserAvatar = () => {
//     if (user?.profile_picture) {
//       return user.profile_picture;
//     }
//     if (user?.avatar) {
//       return user.avatar;
//     }
//     // Avatar par défaut
//     return "https://lh3.googleusercontent.com/aida-public/A6AXuA8VxS_x8jwDh_tF-ygq2OirDNuL2iAY7iNaZiMUFP0ulnWyCKEm_PI1Gc0ciC2TN952cGudRb6wvbJbWPWVGo903BPnvhSXGPboDyDNJD8iZzXEJfiOfRe0gXFHiPnJlAg73UmjlUMXqsg7hI0ME57JNKDz_c82g19tlQb4FmCTdsxqi8jz0nMLTwlAIUvOj4x0iE62XhOCawgbKi0PPQiv7Cz6CfFpzMGaxuCg9bUKa62_BIjWKT5M4ZTd9MB-KOhIR0FHkzz25w";
//   };

//   // Fonction pour obtenir le nom complet de l'utilisateur
//   const getUserFullName = () => {
//     if (user?.first_name && user?.last_name) {
//       return `${user.first_name} ${user.last_name}`;
//     }
//     if (user?.username) {
//       return user.username;
//     }
//     if (user?.name) {
//       return user.name;
//     }
//     return 'Utilisateur';
//   };

//   // Fonction pour obtenir la cohorte de l'utilisateur
//   const getUserCohort = () => {
//     return user?.cohort || 'Stagiaire Simplon';
//   };

//   return (
//     <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen">
//       <div className="flex min-h-screen">
        
//         {/* Sidebar */}
//         <aside className="w-64 flex-shrink-0 bg-[#001F3F] text-white flex flex-col p-4">
//           <div className="flex items-center gap-3 px-3 py-2 mb-8">
//             <img 
//               src="/src/logo.png" 
//               alt="Logo Simplon" 
//               className="size-10 rounded-full object-cover"
//             />
//             <div className="flex flex-col">
//               <h1 className="text-white text-base font-medium leading-normal">Simplon</h1>
//               <p className="text-gray-400 text-sm font-normal leading-normal">Code Platform</p>
//             </div>
//           </div>

//           <div className="flex flex-col justify-between flex-grow">
//             <nav className="flex flex-col gap-2">
//               <Link 
//                 to="/dashboard" 
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
//               >
//                 <span className="material-symbols-outlined">folder</span>
//                 <p className="text-sm font-medium">Mes projets</p>
//               </Link>
//               <Link 
//                 to="/upload" 
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-white"
//               >
//                 <span className="material-symbols-outlined">upload_file</span>
//                 <p className="text-sm font-medium">Déposer un projet</p>
//               </Link>
//               <Link 
//                 to="/explore" 
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
//               >
//                 <span className="material-symbols-outlined">explore</span>
//                 <p className="text-sm font-medium">Explorer les projets</p>
//               </Link>
//             </nav>
            
//             <div className="flex flex-col gap-1">
//               <Link 
//                 to="/profile" 
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
//               >
//                 <span className="material-symbols-outlined">person</span>
//                 <p className="text-sm font-medium leading-normal">Profil</p>
//               </Link>
//               <Link to="/parametre" className="flex items-center gap-3 rounded px-3 py-2 text-white/70 hover:bg-[#003265] hover:text-white">
//                 <span className="material-symbols-outlined">settings</span>
//                 <span>Paramètre</span>
//               </Link>

//               <button
//                 onClick={handleLogout}
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left"
//               >
//                 <span className="material-symbols-outlined">logout</span>
//                 <p className="text-sm font-medium">Déconnexion</p>
//               </button>
//             </div>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-6 lg:p-10">
//           <div className="max-w-4xl mx-auto">
            
//             {/* Header avec profil utilisateur */}
//             <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
//               <div>
//                 <h1 className="text-[#001F3F] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
//                   {isEditing ? 'Modifier le Projet' : 'Déposer un Projet'}
//                 </h1>
//                 <p className="text-gray-500 dark:text-gray-400 mt-1">
//                   {isEditing 
//                     ? 'Modifiez les informations de votre projet existant' 
//                     : 'Remplissez les informations ci-dessous pour partager votre création avec la communauté Simplon.'}
//                 </p>
//               </div>
              
//               {/* Profil de l'utilisateur connecté */}
//               <div className="flex items-center gap-3">
//                 <div 
//                   className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 border-2 border-primary"
//                   style={{ 
//                     backgroundImage: `url(${getUserAvatar()})` 
//                   }}
//                   title={`Profil de ${getUserFullName()}`}
//                 ></div>
//                 <div className="flex flex-col text-right">
//                   <h2 className="text-[#001F3F] dark:text-white text-base font-medium">
//                     {getUserFullName()}
//                   </h2>
//                   <p className="text-gray-500 dark:text-gray-400 text-sm">
//                     {getUserCohort()}
//                   </p>
//                 </div>
//               </div>
//             </header>

//             {/* Formulaire */}
//             <section className="bg-white dark:bg-[#001F3F]/30 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm">
//               {error && (
//                 <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-200">
//                   <div className="flex items-center">
//                     <span className="material-symbols-outlined mr-2">error</span>
//                     <span>{error}</span>
//                   </div>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-6">
                
//                 {/* Nom du projet */}
//                 <div>
//                   <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="title">
//                     Nom du projet *
//                   </label>
//                   <input
//                     id="title"
//                     type="text"
//                     placeholder="Ex: Mon portfolio interactif, API de gestion de tâches..."
//                     value={formData.title}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
//                     required
//                     disabled={isUploading}
//                   />
//                 </div>

//                 {/* Technologies utilisées */}
//                 <div>
//                   <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="technologies">
//                     Technologies utilisées *
//                   </label>
//                   <input
//                     id="technologies"
//                     type="text"
//                     placeholder="Ex: React, Node.js, MongoDB, Tailwind CSS, Python, Django..."
//                     value={formData.technologies}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
//                     required
//                     disabled={isUploading}
//                   />
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                     Séparez les technologies par des virgules. Ex: "React, Node.js, MongoDB"
//                   </p>
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="description">
//                     Description détaillée
//                   </label>
//                   <textarea
//                     id="description"
//                     placeholder="Décrivez votre projet, ses fonctionnalités principales, les défis techniques rencontrés, ce que vous avez appris..."
//                     rows="4"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors resize-none"
//                     disabled={isUploading}
//                   />
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                     Une bonne description aide les autres à comprendre votre projet.
//                   </p>
//                 </div>

//                 {/* Liens GitHub et Démo */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="github_url">
//                       Lien GitHub (optionnel)
//                     </label>
//                     <input
//                       id="github_url"
//                       type="url"
//                       placeholder="https://github.com/votre-username/projet"
//                       value={formData.github_url}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
//                       disabled={isUploading}
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="demo_url">
//                       Lien de démo (optionnel)
//                     </label>
//                     <input
//                       id="demo_url"
//                       type="url"
//                       placeholder="https://votre-projet.vercel.app"
//                       value={formData.demo_url}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
//                       disabled={isUploading}
//                     />
//                   </div>
//                 </div>

//                 {/* Cohorte et Tags */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="cohort">
//                       Cohorte / promotion
//                     </label>
//                     <select
//                       id="cohort"
//                       value={formData.cohort}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
//                       disabled={isUploading}
//                     >
//                       <option value="">Sélectionnez votre cohorte</option>
//                       {cohortsList.map(cohort => (
//                         <option key={cohort} value={cohort}>{cohort}</option>
//                       ))}
//                     </select>
//                     {user?.cohort && !formData.cohort && (
//                       <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
//                         💡 Votre cohorte: {user.cohort}
//                       </p>
//                     )}
//                   </div>
                  
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="tags">
//                       Tags ou mots-clés
//                     </label>
//                     <input
//                       id="tags"
//                       type="text"
//                       placeholder="portfolio, api, data-visualisation, e-commerce, responsive"
//                       value={formData.tags}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
//                       disabled={isUploading}
//                     />
//                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                       Séparez les tags par des virgules pour une meilleure découvrabilité.
//                     </p>
//                   </div>
//                 </div>

//                 {/* Image du projet */}
//                 <div>
//                   <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300">
//                     Image du projet (optionnel)
//                   </label>
//                   <div className={`mt-1 flex justify-center rounded-lg border-2 border-dashed px-6 pt-5 pb-6 transition-all ${
//                     imageFile 
//                       ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
//                       : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'
//                   }`}>
//                     <div className="space-y-1 text-center">
//                       <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">
//                         {imageFile ? 'image' : 'add_photo_alternate'}
//                       </span>
//                       <div className="flex text-sm text-gray-600 dark:text-gray-400">
//                         <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary">
//                           <span>{imageFile ? 'Changer l\'image' : 'Ajouter une image'}</span>
//                           <input
//                             className="sr-only"
//                             type="file"
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             disabled={isUploading}
//                           />
//                         </label>
//                         <p className="pl-1">{imageFile ? 'sélectionnée' : 'JPEG, PNG, GIF (max 5MB)'}</p>
//                       </div>
//                       {imageFile && (
//                         <p className="text-xs text-green-600 dark:text-green-400">
//                           ✓ {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Statut du projet */}
//                 <div>
//                   <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="status">
//                     Statut du projet
//                   </label>
//                   <select
//                     id="status"
//                     value={formData.status}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
//                     disabled={isUploading}
//                   >
//                     <option value="draft">📝 Brouillon (visible uniquement par vous)</option>
//                     <option value="pending">⏳ En attente de validation</option>
//                     <option value="published">📢 Publié (visible par tous)</option>
//                   </select>
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                     <strong>Note:</strong> Les statuts sont mappés à Django: "draft" → draft, "published" → approved
//                   </p>
//                 </div>

//                 {/* Upload de fichier - seulement pour la création */}
//                 {!isEditing && (
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300">
//                       Fichier du projet (.zip) *
//                     </label>
//                     <div className={`mt-1 flex justify-center rounded-lg border-2 border-dashed px-6 pt-5 pb-6 transition-all ${
//                       file 
//                         ? 'border-primary bg-primary/5' 
//                         : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'
//                     }`}>
//                       <div className="space-y-1 text-center">
//                         <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">
//                           {file ? 'folder_zip' : 'cloud_upload'}
//                         </span>
//                         <div className="flex text-sm text-gray-600 dark:text-gray-400">
//                           <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary">
//                             <span>{file ? 'Changer le fichier' : 'Télécharger un fichier'}</span>
//                             <input
//                               className="sr-only"
//                               type="file"
//                               accept=".zip"
//                               onChange={handleFileChange}
//                               disabled={isUploading}
//                             />
//                           </label>
//                           <p className="pl-1">{file ? 'sélectionné' : 'ou glissez-déposez'}</p>
//                         </div>
//                         <p className="text-xs text-gray-500 dark:text-gray-500">
//                           Archive ZIP contenant votre code source (max. 50MB)
//                         </p>
//                       </div>
//                     </div>
                    
//                     {/* Affichage du fichier sélectionné et progression */}
//                     {file && (
//                       <div className="mt-4 space-y-2">
//                         <div className="flex justify-between items-center text-sm">
//                           <div className="flex items-center gap-2">
//                             <span className="material-symbols-outlined text-primary text-base">description</span>
//                             <p className="font-medium text-[#001F3F] dark:text-gray-300 truncate flex-1">
//                               {file.name}
//                             </p>
//                           </div>
//                           <p className={`text-sm ${
//                             isUploading ? 'text-primary' : 'text-green-600 dark:text-green-400'
//                           }`}>
//                             {isUploading ? '📤 Téléversement...' : '✅ Prêt'}
//                           </p>
//                         </div>
//                         {isUploading && (
//                           <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
//                             <div 
//                               className="bg-primary h-2.5 rounded-full transition-all duration-300"
//                               style={{ width: `${uploadProgress}%` }}
//                             ></div>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Boutons */}
//                 <div className="pt-4 flex flex-col sm:flex-row justify-end gap-4 border-t border-gray-200 dark:border-gray-700">
//                   <button
//                     type="button"
//                     onClick={() => navigate('/dashboard')}
//                     className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
//                     disabled={isUploading}
//                   >
//                     Annuler
//                   </button>
//                   <div className="flex gap-3">
//                     {!isEditing && (
//                       <button
//                         type="button"
//                         onClick={resetForm}
//                         className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
//                         disabled={isUploading}
//                       >
//                         Réinitialiser
//                       </button>
//                     )}
//                     <button
//                       type="submit"
//                       disabled={isUploading}
//                       className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-8 bg-primary text-white text-base font-bold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
//                     >
//                       {isUploading ? (
//                         <>
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                           <span>{isEditing ? 'Modification...' : 'Publication...'}</span>
//                         </>
//                       ) : (
//                         <>
//                           <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
//                             {isEditing ? 'save' : 'publish'}
//                           </span>
//                           <span>{isEditing ? 'Modifier le projet' : 'Publier mon projet'}</span>
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             </section>

//             {/* Informations supplémentaires */}
//             {!isEditing && (
//               <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
//                 <div className="flex items-start gap-3">
//                   <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 mt-0.5">info</span>
//                   <div>
//                     <h3 className="text-blue-800 dark:text-blue-300 font-medium mb-1">
//                       Conseils pour un bon dépôt de projet
//                     </h3>
//                     <ul className="text-blue-700 dark:text-blue-400 text-sm space-y-1">
//                       <li>• Assurez-vous que votre code est bien documenté</li>
//                       <li>• Incluez un README.md avec les instructions d'installation</li>
//                       <li>• Vérifiez que toutes les dépendances sont listées</li>
//                       <li>• Testez votre projet avant de le déposer</li>
//                       <li>• Ajoutez une image de présentation pour rendre votre projet plus attrayant</li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default UploadProject;



// // src/UploadProject.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import { projectService } from '../services/projects';
// import authService from '../services/auth';
// import { useProjects } from '../context/ProjectContext';

// console.log('🔧 Import projectService dans', 
//   (new Error().stack?.split('\n')[2] || '').trim() || 'Unknown location'
// );
// const UploadProject = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     technologies: '',
//     description: '',
//     cohort: '',
//     tags: '',
//     github_url: '',
//     demo_url: ''
//   });
//   const [file, setFile] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [error, setError] = useState('');
//   const [isEditing, setIsEditing] = useState(false);
//   const [editProjectId, setEditProjectId] = useState(null);
//   const [user, setUser] = useState(null);
  
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const { addProject, updateProject } = useProjects();

//   const cohortsList = [
//     'DWWM - Mars 2024',
//     'CDA - Janvier 2024', 
//     'AI Engineer - Mai 2024',
//     'DWWM - Novembre 2023',
//     'CDA - Septembre 2023'
//   ];

//   useEffect(() => {
//     // Récupérer l'utilisateur connecté
//     const currentUser = authService.getCurrentUser();
//     console.log('👤 DEBUG - Utilisateur connecté:', currentUser);
//     console.log('👤 DEBUG - User ID:', currentUser?.id);
//     console.log('👤 DEBUG - User structure:', JSON.stringify(currentUser, null, 2));
    
//     setUser(currentUser);
    
//     // Pré-remplir la cohorte avec celle de l'utilisateur si disponible
//     if (currentUser?.cohort) {
//       setFormData(prev => ({
//         ...prev,
//         cohort: currentUser.cohort
//       }));
//     }

//     const editId = searchParams.get('edit');
//     if (editId) {
//       loadProjectForEdit(editId);
//     }
//   }, [searchParams]);

//   const loadProjectForEdit = async (projectId) => {
//     try {
//       const project = await projectService.getProjectDetails(projectId);
      
//       setFormData({
//         title: project.title || '',
//         technologies: project.technologies || '',
//         description: project.description || '',
//         cohort: project.cohort || '',
//         tags: project.tags || '',
//         github_url: project.github_url || '',
//         demo_url: project.demo_url || ''
//       });
//       setIsEditing(true);
//       setEditProjectId(projectId);
//     } catch (err) {
//       console.error('Erreur chargement projet:', err);
//       setError('Erreur lors du chargement du projet');
//     }
//   };

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [id]: value
//     }));
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       if (selectedFile.size > 50 * 1024 * 1024) {
//         setError('Le fichier est trop volumineux. Taille maximum: 50MB');
//         return;
//       }
      
//       if (!selectedFile.name.toLowerCase().endsWith('.zip')) {
//         setError('Veuillez sélectionner un fichier ZIP');
//         return;
//       }

//       setFile(selectedFile);
//       setError('');
//     }
//   };

//   const handleImageChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       if (selectedFile.size > 5 * 1024 * 1024) {
//         setError('L\'image est trop volumineuse. Taille maximum: 5MB');
//         return;
//       }
      
//       const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
//       if (!validTypes.includes(selectedFile.type)) {
//         setError('Format d\'image non supporté. Utilisez JPG, PNG ou GIF');
//         return;
//       }

//       setImageFile(selectedFile);
//       setError('');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     console.log('📝 DEBUG - Début handleSubmit');
    
//     // Validation de base
//     if (!formData.title.trim()) {
//       setError('Veuillez saisir un nom pour votre projet');
//       return;
//     }

//     if (!formData.technologies.trim()) {
//       setError('Veuillez saisir les technologies utilisées');
//       return;
//     }

//     if (!isEditing && !file) {
//       setError('Veuillez sélectionner un fichier ZIP');
//       return;
//     }

//     // ⭐ VÉRIFICATION CRITIQUE : Utilisateur connecté
//     if (!user || !user.id) {
//       setError('Vous devez être connecté pour créer un projet');
//       console.error('❌ Aucun utilisateur connecté:', user);
//       return;
//     }

//     setIsUploading(true);

//     try {
//       // ⭐ CORRECTION : Ajouter l'utilisateur
//       const projectData = {
//         title: formData.title.trim(),
//         technologies: formData.technologies.trim(),
//         description: formData.description.trim(),
//         cohort: formData.cohort.trim(),
//         tags: formData.tags.trim(),
//         github_url: formData.github_url.trim(),
//         demo_url: formData.demo_url.trim(),
//         // ⭐ AJOUT CRITIQUE : L'ID de l'utilisateur
//         author: user.id
//       };

//       console.log('🎯 DEBUG - Données envoyées à l\'API:', projectData);
//       console.log('👤 DEBUG - User ID:', user.id);

//       let project;

//       if (isEditing) {
//         // Mise à jour du projet existant
//         console.log('✏️ DEBUG - Mise à jour du projet:', editProjectId);
        
//         // Si nouvelle image, l'ajouter
//         if (imageFile) {
//           projectData.image = imageFile;
//         }
        
//         project = await projectService.updateProject(editProjectId, projectData);
//         updateProject(project);
        
//         console.log('✅ DEBUG - Projet modifié, redirection...');
//         navigate('/project-success', { 
//           state: { 
//             project: project,
//             isEditing: true
//           } 
//         });
//       } else {
//         // Création d'un nouveau projet
//         console.log('🚀 DEBUG - Tentative de création du projet...');
//         console.log('📋 DEBUG - Data envoyée:', JSON.stringify(projectData, null, 2));
        
//         // Ajouter les fichiers pour la création
//         if (file) {
//           projectData.zip_file = file;
//         }
//         if (imageFile) {
//           projectData.image = imageFile;
//         }
        
//         const createdProject = await projectService.createProject(projectData);
//         console.log('✅ DEBUG - Projet créé:', createdProject);
//         project = createdProject;

//         // Validation de l'ID reçu
//         if (!project.id) {
//           console.error('❌ CRITIQUE: Aucun ID reçu après création');
//           // Générer un ID temporaire pour la suite du processus
//           const tempId = `temp_${Date.now()}`;
//           project.id = tempId;
//           console.log('🆔 ID temporaire généré:', project.id);
//         } else {
//           console.log('🆔 ID du projet:', project.id);
//         }
        
//         // Ajoute au contexte global
//         addProject(project);
        
//         console.log('✅ DEBUG - Redirection vers succès...');
//         navigate('/project-success', { 
//           state: { 
//             project: project,
//             isEditing: false
//           } 
//         });
//       }

//     } catch (err) {
//       console.error('❌ DEBUG - Erreur dans handleSubmit:', err);
//       console.error('❌ DEBUG - Response data:', err.response?.data);
      
//       let errorMessage = `Erreur lors de ${isEditing ? 'la modification' : 'la création'} du projet`;
      
//       if (err.response?.data) {
//         const errors = err.response.data;
        
//         // Traitement des erreurs de validation
//         if (typeof errors === 'object') {
//           const errorDetails = Object.entries(errors)
//             .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
//             .join('; ');
//           errorMessage = `Erreurs de validation: ${errorDetails}`;
//         } else if (typeof errors === 'string') {
//           if (errors.includes('<!DOCTYPE html>')) {
//             errorMessage = 'Erreur serveur - Veuillez réessayer';
//           } else {
//             errorMessage = errors;
//           }
//         }
//       } else if (err.message) {
//         errorMessage = err.message;
//       }
      
//       setError(errorMessage);
//     } finally {
//       setIsUploading(false);
//       setUploadProgress(0);
//     }
//   };

//   const handleLogout = () => {
//     authService.logout();
//     navigate('/login');
//   };

//   // Fonction pour réinitialiser le formulaire
//   const resetForm = () => {
//     setFormData({
//       title: '',
//       technologies: '',
//       description: '',
//       cohort: user?.cohort || '',
//       tags: '',
//       github_url: '',
//       demo_url: ''
//     });
//     setFile(null);
//     setImageFile(null);
//     setError('');
//   };

//   // Fonction pour obtenir l'URL de l'avatar de l'utilisateur
//   const getUserAvatar = () => {
//     if (user?.profile_picture) {
//       return user.profile_picture;
//     }
//     if (user?.avatar) {
//       return user.avatar;
//     }
//     // Avatar par défaut
//     return "https://lh3.googleusercontent.com/aida-public/A6AXuA8VxS_x8jwDh_tF-ygq2OirDNuL2iAY7iNaZiMUFP0ulnWyCKEm_PI1Gc0ciC2TN952cGudRb6wvbJbWPWVGo903BPnvhSXGPboDyDNJD8iZzXEJfiOfRe0gXFHiPnJlAg73UmjlUMXqsg7hI0ME57JNKDz_c82g19tlQb4FmCTdsxqi8jz0nMLTwlAIUvOj4x0iE62XhOCawgbKi0PPQiv7Cz6CfFpzMGaxuCg9bUKa62_BIjWKT5M4ZTd9MB-KOhIR0FHkzz25w";
//   };

//   // Fonction pour obtenir le nom complet de l'utilisateur
//   const getUserFullName = () => {
//     if (user?.first_name && user?.last_name) {
//       return `${user.first_name} ${user.last_name}`;
//     }
//     if (user?.username) {
//       return user.username;
//     }
//     if (user?.name) {
//       return user.name;
//     }
//     return 'Utilisateur';
//   };

//   // Fonction pour obtenir la cohorte de l'utilisateur
//   const getUserCohort = () => {
//     return user?.cohort || 'Stagiaire Simplon';
//   };

//   return (
//     <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen">
//       <div className="flex min-h-screen">
        
//         {/* Sidebar */}
//         <aside className="w-64 flex-shrink-0 bg-[#001F3F] text-white flex flex-col p-4">
//           <div className="flex items-center gap-3 px-3 py-2 mb-8">
//             <img 
//               src="/src/logo.png" 
//               alt="Logo Simplon" 
//               className="size-10 rounded-full object-cover"
//             />
//             <div className="flex flex-col">
//               <h1 className="text-white text-base font-medium leading-normal">Simplon</h1>
//               <p className="text-gray-400 text-sm font-normal leading-normal">Code Platform</p>
//             </div>
//           </div>

//           <div className="flex flex-col justify-between flex-grow">
//             <nav className="flex flex-col gap-2">
//               <Link 
//                 to="/dashboard" 
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
//               >
//                 <span className="material-symbols-outlined">folder</span>
//                 <p className="text-sm font-medium">Mes projets</p>
//               </Link>
//               <Link 
//                 to="/upload" 
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-white"
//               >
//                 <span className="material-symbols-outlined">upload_file</span>
//                 <p className="text-sm font-medium">Déposer un projet</p>
//               </Link>
//               <Link 
//                 to="/explore" 
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
//               >
//                 <span className="material-symbols-outlined">explore</span>
//                 <p className="text-sm font-medium">Explorer les projets</p>
//               </Link>
//             </nav>
            
//             <div className="flex flex-col gap-1">
//               <Link 
//                 to="/profile" 
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
//               >
//                 <span className="material-symbols-outlined">person</span>
//                 <p className="text-sm font-medium leading-normal">Profil</p>
//               </Link>
//               <Link to="/parametre" className="flex items-center gap-3 rounded px-3 py-2 text-white/70 hover:bg-[#003265] hover:text-white">
//                 <span className="material-symbols-outlined">settings</span>
//                 <span>Paramètre</span>
//               </Link>

//               <button
//                 onClick={handleLogout}
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left"
//               >
//                 <span className="material-symbols-outlined">logout</span>
//                 <p className="text-sm font-medium">Déconnexion</p>
//               </button>
//             </div>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-6 lg:p-10">
//           <div className="max-w-4xl mx-auto">
            
//             {/* Header avec profil utilisateur */}
//             <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
//               <div>
//                 <h1 className="text-[#001F3F] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
//                   {isEditing ? 'Modifier le Projet' : 'Déposer un Projet'}
//                 </h1>
//                 <p className="text-gray-500 dark:text-gray-400 mt-1">
//                   {isEditing 
//                     ? 'Modifiez les informations de votre projet existant' 
//                     : 'Remplissez les informations ci-dessous pour partager votre création avec la communauté Simplon.'}
//                 </p>
//               </div>
              
//               {/* Profil de l'utilisateur connecté */}
//               <div className="flex items-center gap-3">
//                 <div 
//                   className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 border-2 border-primary"
//                   style={{ 
//                     backgroundImage: `url(${getUserAvatar()})` 
//                   }}
//                   title={`Profil de ${getUserFullName()}`}
//                 ></div>
//                 <div className="flex flex-col text-right">
//                   <h2 className="text-[#001F3F] dark:text-white text-base font-medium">
//                     {getUserFullName()}
//                   </h2>
//                   <p className="text-gray-500 dark:text-gray-400 text-sm">
//                     {getUserCohort()}
//                   </p>
//                 </div>
//               </div>
//             </header>

//             {/* Formulaire */}
//             <section className="bg-white dark:bg-[#001F3F]/30 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm">
//               {error && (
//                 <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-200">
//                   <div className="flex items-center">
//                     <span className="material-symbols-outlined mr-2">error</span>
//                     <span>{error}</span>
//                   </div>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-6">
                
//                 {/* Nom du projet */}
//                 <div>
//                   <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="title">
//                     Nom du projet *
//                   </label>
//                   <input
//                     id="title"
//                     type="text"
//                     placeholder="Ex: Mon portfolio interactif, API de gestion de tâches..."
//                     value={formData.title}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
//                     required
//                     disabled={isUploading}
//                   />
//                 </div>

//                 {/* Technologies utilisées */}
//                 <div>
//                   <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="technologies">
//                     Technologies utilisées *
//                   </label>
//                   <input
//                     id="technologies"
//                     type="text"
//                     placeholder="Ex: React, Node.js, MongoDB, Tailwind CSS, Python, Django..."
//                     value={formData.technologies}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
//                     required
//                     disabled={isUploading}
//                   />
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                     Séparez les technologies par des virgules. Ex: "React, Node.js, MongoDB"
//                   </p>
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="description">
//                     Description détaillée
//                   </label>
//                   <textarea
//                     id="description"
//                     placeholder="Décrivez votre projet, ses fonctionnalités principales, les défis techniques rencontrés, ce que vous avez appris..."
//                     rows="4"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors resize-none"
//                     disabled={isUploading}
//                   />
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                     Une bonne description aide les autres à comprendre votre projet.
//                   </p>
//                 </div>

//                 {/* Liens GitHub et Démo */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="github_url">
//                       Lien GitHub (optionnel)
//                     </label>
//                     <input
//                       id="github_url"
//                       type="url"
//                       placeholder="https://github.com/votre-username/projet"
//                       value={formData.github_url}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
//                       disabled={isUploading}
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="demo_url">
//                       Lien de démo (optionnel)
//                     </label>
//                     <input
//                       id="demo_url"
//                       type="url"
//                       placeholder="https://votre-projet.vercel.app"
//                       value={formData.demo_url}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
//                       disabled={isUploading}
//                     />
//                   </div>
//                 </div>

//                 {/* Cohorte et Tags */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="cohort">
//                       Cohorte / promotion
//                     </label>
//                     <select
//                       id="cohort"
//                       value={formData.cohort}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
//                       disabled={isUploading}
//                     >
//                       <option value="">Sélectionnez votre cohorte</option>
//                       {cohortsList.map(cohort => (
//                         <option key={cohort} value={cohort}>{cohort}</option>
//                       ))}
//                     </select>
//                     {user?.cohort && !formData.cohort && (
//                       <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
//                         💡 Votre cohorte: {user.cohort}
//                       </p>
//                     )}
//                   </div>
                  
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="tags">
//                       Tags ou mots-clés
//                     </label>
//                     <input
//                       id="tags"
//                       type="text"
//                       placeholder="portfolio, api, data-visualisation, e-commerce, responsive"
//                       value={formData.tags}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
//                       disabled={isUploading}
//                     />
//                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                       Séparez les tags par des virgules pour une meilleure découvrabilité.
//                     </p>
//                   </div>
//                 </div>

//                 {/* Image du projet */}
//                 <div>
//                   <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300">
//                     Image du projet (optionnel)
//                   </label>
//                   <div className={`mt-1 flex justify-center rounded-lg border-2 border-dashed px-6 pt-5 pb-6 transition-all ${
//                     imageFile 
//                       ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
//                       : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'
//                   }`}>
//                     <div className="space-y-1 text-center">
//                       <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">
//                         {imageFile ? 'image' : 'add_photo_alternate'}
//                       </span>
//                       <div className="flex text-sm text-gray-600 dark:text-gray-400">
//                         <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary">
//                           <span>{imageFile ? 'Changer l\'image' : 'Ajouter une image'}</span>
//                           <input
//                             className="sr-only"
//                             type="file"
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             disabled={isUploading}
//                           />
//                         </label>
//                         <p className="pl-1">{imageFile ? 'sélectionnée' : 'JPEG, PNG, GIF (max 5MB)'}</p>
//                       </div>
//                       {imageFile && (
//                         <p className="text-xs text-green-600 dark:text-green-400">
//                           ✓ {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Upload de fichier - seulement pour la création */}
//                 {!isEditing && (
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300">
//                       Fichier du projet (.zip) *
//                     </label>
//                     <div className={`mt-1 flex justify-center rounded-lg border-2 border-dashed px-6 pt-5 pb-6 transition-all ${
//                       file 
//                         ? 'border-primary bg-primary/5' 
//                         : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'
//                     }`}>
//                       <div className="space-y-1 text-center">
//                         <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">
//                           {file ? 'folder_zip' : 'cloud_upload'}
//                         </span>
//                         <div className="flex text-sm text-gray-600 dark:text-gray-400">
//                           <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary">
//                             <span>{file ? 'Changer le fichier' : 'Télécharger un fichier'}</span>
//                             <input
//                               className="sr-only"
//                               type="file"
//                               accept=".zip"
//                               onChange={handleFileChange}
//                               disabled={isUploading}
//                             />
//                           </label>
//                           <p className="pl-1">{file ? 'sélectionné' : 'ou glissez-déposez'}</p>
//                         </div>
//                         <p className="text-xs text-gray-500 dark:text-gray-500">
//                           Archive ZIP contenant votre code source (max. 50MB)
//                         </p>
//                       </div>
//                     </div>
                    
//                     {/* Affichage du fichier sélectionné et progression */}
//                     {file && (
//                       <div className="mt-4 space-y-2">
//                         <div className="flex justify-between items-center text-sm">
//                           <div className="flex items-center gap-2">
//                             <span className="material-symbols-outlined text-primary text-base">description</span>
//                             <p className="font-medium text-[#001F3F] dark:text-gray-300 truncate flex-1">
//                               {file.name}
//                             </p>
//                           </div>
//                           <p className={`text-sm ${
//                             isUploading ? 'text-primary' : 'text-green-600 dark:text-green-400'
//                           }`}>
//                             {isUploading ? '📤 Téléversement...' : '✅ Prêt'}
//                           </p>
//                         </div>
//                         {isUploading && (
//                           <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
//                             <div 
//                               className="bg-primary h-2.5 rounded-full transition-all duration-300"
//                               style={{ width: `${uploadProgress}%` }}
//                             ></div>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Boutons */}
//                 <div className="pt-4 flex flex-col sm:flex-row justify-end gap-4 border-t border-gray-200 dark:border-gray-700">
//                   <button
//                     type="button"
//                     onClick={() => navigate('/dashboard')}
//                     className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
//                     disabled={isUploading}
//                   >
//                     Annuler
//                   </button>
//                   <div className="flex gap-3">
//                     {!isEditing && (
//                       <button
//                         type="button"
//                         onClick={resetForm}
//                         className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
//                         disabled={isUploading}
//                       >
//                         Réinitialiser
//                       </button>
//                     )}
//                     <button
//                       type="submit"
//                       disabled={isUploading}
//                       className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-8 bg-primary text-white text-base font-bold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
//                     >
//                       {isUploading ? (
//                         <>
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                           <span>{isEditing ? 'Modification...' : 'Publication...'}</span>
//                         </>
//                       ) : (
//                         <>
//                           <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
//                             {isEditing ? 'save' : 'publish'}
//                           </span>
//                           <span>{isEditing ? 'Modifier le projet' : 'Publier mon projet'}</span>
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             </section>

//             {/* Informations supplémentaires */}
//             {!isEditing && (
//               <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
//                 <div className="flex items-start gap-3">
//                   <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 mt-0.5">info</span>
//                   <div>
//                     <h3 className="text-blue-800 dark:text-blue-300 font-medium mb-1">
//                       Conseils pour un bon dépôt de projet
//                     </h3>
//                     <ul className="text-blue-700 dark:text-blue-400 text-sm space-y-1">
//                       <li>• Assurez-vous que votre code est bien documenté</li>
//                       <li>• Incluez un README.md avec les instructions d'installation</li>
//                       <li>• Vérifiez que toutes les dépendances sont listées</li>
//                       <li>• Testez votre projet avant de le déposer</li>
//                       <li>• Ajoutez une image de présentation pour rendre votre projet plus attrayant</li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default UploadProject;



// // src/pages/UploadProject.jsx - VERSION CORRIGÉE
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import axios from 'axios';
// import authService from '../services/auth';
// import { useProjects } from '../context/ProjectContext';

// const UploadProject = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     technologies: '',
//     description: '',
//     cohort: '',
//     tags: '',
//     github_url: '',
//     demo_url: ''
//   });
//   const [file, setFile] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState('');
//   const [isEditing, setIsEditing] = useState(false);
//   const [editProjectId, setEditProjectId] = useState(null);
//   const [user, setUser] = useState(null);
  
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const { addProject, updateProject } = useProjects();

//   const cohortsList = [
//     'DWWM - Mars 2024',
//     'CDA - Janvier 2024', 
//     'AI Engineer - Mai 2024',
//     'DWWM - Novembre 2023',
//     'CDA - Septembre 2023'
//   ];

//   useEffect(() => {
//     const currentUser = authService.getCurrentUser();
//     console.log('👤 DEBUG - Utilisateur connecté:', currentUser);
//     setUser(currentUser);
    
//     if (currentUser?.cohort) {
//       setFormData(prev => ({
//         ...prev,
//         cohort: currentUser.cohort
//       }));
//     }

//     const editId = searchParams.get('edit');
//     if (editId) {
//       loadProjectForEdit(editId);
//     }
//   }, [searchParams]);

//   const loadProjectForEdit = async (projectId) => {
//     try {
//       const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
//       const token = authService.getToken();
      
//       const response = await axios.get(`${baseUrl}/api/projects/${projectId}/`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       const project = response.data;
//       setFormData({
//         title: project.title || '',
//         technologies: project.technologies || '',
//         description: project.description || '',
//         cohort: project.cohort || '',
//         tags: project.tags || '',
//         github_url: project.github_url || '',
//         demo_url: project.demo_url || ''
//       });
//       setIsEditing(true);
//       setEditProjectId(projectId);
//     } catch (err) {
//       console.error('Erreur chargement projet:', err);
//       setError('Erreur lors du chargement du projet');
//     }
//   };

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [id]: value
//     }));
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       if (selectedFile.size > 50 * 1024 * 1024) {
//         setError('Le fichier est trop volumineux. Taille maximum: 50MB');
//         return;
//       }
      
//       if (!selectedFile.name.toLowerCase().endsWith('.zip')) {
//         setError('Veuillez sélectionner un fichier ZIP');
//         return;
//       }

//       setFile(selectedFile);
//       setError('');
//     }
//   };

//   const handleImageChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       if (selectedFile.size > 5 * 1024 * 1024) {
//         setError('L\'image est trop volumineuse. Taille maximum: 5MB');
//         return;
//       }
      
//       const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
//       if (!validTypes.includes(selectedFile.type)) {
//         setError('Format d\'image non supporté. Utilisez JPG, PNG ou GIF');
//         return;
//       }

//       setImageFile(selectedFile);
//       setError('');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     console.log('📝 DEBUG - Début handleSubmit');
    
//     // Validation de base
//     if (!formData.title.trim()) {
//       setError('Veuillez saisir un nom pour votre projet');
//       return;
//     }

//     if (!formData.technologies.trim()) {
//       setError('Veuillez saisir les technologies utilisées');
//       return;
//     }

//     if (!isEditing && !file) {
//       setError('Veuillez sélectionner un fichier ZIP');
//       return;
//     }

//     // Vérification utilisateur
//     if (!user || !user.id) {
//       setError('Vous devez être connecté pour créer un projet');
//       return;
//     }

//     setIsUploading(true);

//     try {
//       const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
//       const token = authService.getToken();
      
//       // Créer FormData
//       const formDataToSend = new FormData();
//       formDataToSend.append('title', formData.title.trim());
//       formDataToSend.append('technologies', formData.technologies.trim());
//       formDataToSend.append('description', formData.description.trim());
//       formDataToSend.append('cohort', formData.cohort.trim());
//       formDataToSend.append('tags', formData.tags.trim());
//       formDataToSend.append('github_url', formData.github_url.trim());
//       formDataToSend.append('demo_url', formData.demo_url.trim());
//       formDataToSend.append('author', user.id.toString()); // ⭐ Convertir en string
      
//       if (file) {
//         formDataToSend.append('zip_file', file);
//       }
      
//       if (imageFile) {
//         formDataToSend.append('image', imageFile);
//       }
      
//       console.log('🎯 DEBUG - Données à envoyer:');
//       for (let [key, value] of formDataToSend.entries()) {
//         console.log(`${key}:`, typeof value === 'object' ? value.name : value);
//       }

//       let response;
//       let project;
      
//       if (isEditing) {
//         // Mise à jour
//         console.log('✏️ DEBUG - Mise à jour du projet:', editProjectId);
        
//         response = await axios.put(
//           `${baseUrl}/api/projects/${editProjectId}/`,
//           formDataToSend,
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'multipart/form-data'
//             }
//           }
//         );
        
//         project = response.data;
//         updateProject(project);
        
//         console.log('✅ DEBUG - Projet modifié:', project);
//       } else {
//         // Création - ESSAYER DIFFÉRENTES URLS
//         console.log('🚀 DEBUG - Tentative de création du projet...');
        
//         const possibleUrls = [
//           `${baseUrl}/api/projects/create/`,
//           `${baseUrl}/api/projects/`,
//           `${baseUrl}/api/projects/projects/`
//         ];
        
//         let lastError;
        
//         for (const url of possibleUrls) {
//           try {
//             console.log(`🔄 Tentative avec URL: ${url}`);
//             response = await axios.post(url, formDataToSend, {
//               headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'multipart/form-data'
//               }
//             });
//             console.log(`✅ Succès avec URL: ${url}`);
//             break;
//           } catch (err) {
//             lastError = err;
//             console.log(`❌ Échec avec URL: ${url} - Status: ${err.response?.status}`);
//             continue;
//           }
//         }
        
//         if (!response) {
//           throw lastError || new Error('Aucune URL API fonctionnelle trouvée');
//         }
        
//         project = response.data;
        
//         // Validation de l'ID
//         if (!project.id) {
//           console.warn('⚠️ Aucun ID reçu de l\'API, génération d\'un ID temporaire');
//           project.id = `temp_${Date.now()}`;
//         }
        
//         console.log('✅ DEBUG - Projet créé:', project);
        
//         // Ajouter au contexte
//         addProject(project);
//       }
      
//       // Rediriger vers la page de succès
//       console.log('✅ DEBUG - Redirection vers succès...');
//       navigate('/project-success', {
//         state: {
//           project: project,
//           isEditing: isEditing,
//           timestamp: Date.now()
//         }
//       });
      
//     } catch (err) {
//       console.error('❌ Erreur complète:', err);
//       console.error('❌ Response data:', err.response?.data);
//       console.error('❌ Response status:', err.response?.status);
      
//       let errorMessage = `Erreur lors de ${isEditing ? 'la modification' : 'la création'} du projet`;
      
//       if (err.response?.status === 405) {
//         errorMessage = 'Méthode HTTP non autorisée. Vérifiez l\'URL de l\'API.';
//       } else if (err.response?.status === 401) {
//         errorMessage = 'Non autorisé. Veuillez vous reconnecter.';
//       } else if (err.response?.status === 400) {
//         if (err.response.data) {
//           const errors = err.response.data;
//           if (typeof errors === 'object') {
//             const errorDetails = Object.entries(errors)
//               .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
//               .join('; ');
//             errorMessage = `Erreurs de validation: ${errorDetails}`;
//           } else if (typeof errors === 'string') {
//             errorMessage = errors;
//           }
//         }
//       } else if (err.response?.status === 500) {
//         errorMessage = 'Erreur serveur interne. Veuillez réessayer plus tard.';
//       } else if (err.message) {
//         errorMessage = err.message;
//       }
      
//       setError(errorMessage);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleLogout = () => {
//     authService.logout();
//     navigate('/login');
//   };

//   const resetForm = () => {
//     setFormData({
//       title: '',
//       technologies: '',
//       description: '',
//       cohort: user?.cohort || '',
//       tags: '',
//       github_url: '',
//       demo_url: ''
//     });
//     setFile(null);
//     setImageFile(null);
//     setError('');
//   };

//   const getUserAvatar = () => {
//     if (user?.profile_picture) return user.profile_picture;
//     if (user?.avatar) return user.avatar;
//     return "https://lh3.googleusercontent.com/aida-public/A6AXuA8VxS_x8jwDh_tF-ygq2OirDNuL2iAY7iNaZiMUFP0ulnWyCKEm_PI1Gc0ciC2TN952cGudRb6wvbJbWPWVGo903BPnvhSXGPboDyDNJD8iZzXEJfiOfRe0gXFHiPnJlAg73UmjlUMXqsg7hI0ME57JNKDz_c82g19tlQb4FmCTdsxqi8jz0nMLTwlAIUvOj4x0iE62XhOCawgbKi0PPQiv7Cz6CfFpzMGaxuCg9bUKa62_BIjWKT5M4ZTd9MB-KOhIR0FHkzz25w";
//   };

//   const getUserFullName = () => {
//     if (user?.first_name && user?.last_name) return `${user.first_name} ${user.last_name}`;
//     if (user?.username) return user.username;
//     if (user?.name) return user.name;
//     return 'Utilisateur';
//   };

//   const getUserCohort = () => {
//     return user?.cohort || 'Stagiaire Simplon';
//   };

//   return (
//     <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen">
//       <div className="flex min-h-screen">
        
//         {/* Sidebar */}
//         <aside className="w-64 flex-shrink-0 bg-[#001F3F] text-white flex flex-col p-4">
//           <div className="flex items-center gap-3 px-3 py-2 mb-8">
//             <img 
//               src="/src/logo.png" 
//               alt="Logo Simplon" 
//               className="size-10 rounded-full object-cover"
//             />
//             <div className="flex flex-col">
//               <h1 className="text-white text-base font-medium leading-normal">Simplon</h1>
//               <p className="text-gray-400 text-sm font-normal leading-normal">Code Platform</p>
//             </div>
//           </div>

//           <div className="flex flex-col justify-between flex-grow">
//             <nav className="flex flex-col gap-2">
//               <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
//                 <span className="material-symbols-outlined">folder</span>
//                 <p className="text-sm font-medium">Mes projets</p>
//               </Link>
//               <Link to="/upload" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#E30613] text-white">
//                 <span className="material-symbols-outlined">upload_file</span>
//                 <p className="text-sm font-medium">Déposer un projet</p>
//               </Link>
//               <Link to="/explore" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
//                 <span className="material-symbols-outlined">explore</span>
//                 <p className="text-sm font-medium">Explorer les projets</p>
//               </Link>
//             </nav>
            
//             <div className="flex flex-col gap-1">
//               <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
//                 <span className="material-symbols-outlined">person</span>
//                 <p className="text-sm font-medium leading-normal">Profil</p>
//               </Link>
//               <Link to="/parametre" className="flex items-center gap-3 rounded px-3 py-2 text-white/70 hover:bg-[#003265] hover:text-white">
//                 <span className="material-symbols-outlined">settings</span>
//                 <span>Paramètre</span>
//               </Link>

//               <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left">
//                 <span className="material-symbols-outlined">logout</span>
//                 <p className="text-sm font-medium">Déconnexion</p>
//               </button>
//             </div>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-6 lg:p-10">
//           <div className="max-w-4xl mx-auto">
            
//             {/* Header */}
//             <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
//               <div>
//                 <h1 className="text-[#001F3F] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
//                   {isEditing ? 'Modifier le Projet' : 'Déposer un Projet'}
//                 </h1>
//                 <p className="text-gray-500 dark:text-gray-400 mt-1">
//                   {isEditing 
//                     ? 'Modifiez les informations de votre projet existant' 
//                     : 'Remplissez les informations ci-dessous pour partager votre création avec la communauté Simplon.'}
//                 </p>
//               </div>
              
//               {/* Profil */}
//               <div className="flex items-center gap-3">
//                 <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 border-2 border-[#E30613]"
//                   style={{ backgroundImage: `url(${getUserAvatar()})` }}>
//                 </div>
//                 <div className="flex flex-col text-right">
//                   <h2 className="text-[#001F3F] dark:text-white text-base font-medium">
//                     {getUserFullName()}
//                   </h2>
//                   <p className="text-gray-500 dark:text-gray-400 text-sm">
//                     {getUserCohort()}
//                   </p>
//                 </div>
//               </div>
//             </header>

//             {/* Formulaire */}
//             <section className="bg-white dark:bg-[#001F3F]/30 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm">
//               {error && (
//                 <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-200">
//                   <div className="flex items-center">
//                     <span className="material-symbols-outlined mr-2">error</span>
//                     <span>{error}</span>
//                   </div>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-6">
                
//                 {/* Nom du projet */}
//                 <div>
//                   <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="title">
//                     Nom du projet *
//                   </label>
//                   <input
//                     id="title"
//                     type="text"
//                     placeholder="Ex: Mon portfolio interactif, API de gestion de tâches..."
//                     value={formData.title}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors"
//                     required
//                     disabled={isUploading}
//                   />
//                 </div>

//                 {/* Technologies utilisées */}
//                 <div>
//                   <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="technologies">
//                     Technologies utilisées *
//                   </label>
//                   <input
//                     id="technologies"
//                     type="text"
//                     placeholder="Ex: React, Node.js, MongoDB, Tailwind CSS, Python, Django..."
//                     value={formData.technologies}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors"
//                     required
//                     disabled={isUploading}
//                   />
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                     Séparez les technologies par des virgules. Ex: "React, Node.js, MongoDB"
//                   </p>
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="description">
//                     Description détaillée
//                   </label>
//                   <textarea
//                     id="description"
//                     placeholder="Décrivez votre projet, ses fonctionnalités principales, les défis techniques rencontrés, ce que vous avez appris..."
//                     rows="4"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors resize-none"
//                     disabled={isUploading}
//                   />
//                 </div>

//                 {/* Liens GitHub et Démo */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="github_url">
//                       Lien GitHub (optionnel)
//                     </label>
//                     <input
//                       id="github_url"
//                       type="url"
//                       placeholder="https://github.com/votre-username/projet"
//                       value={formData.github_url}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors"
//                       disabled={isUploading}
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="demo_url">
//                       Lien de démo (optionnel)
//                     </label>
//                     <input
//                       id="demo_url"
//                       type="url"
//                       placeholder="https://votre-projet.vercel.app"
//                       value={formData.demo_url}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors"
//                       disabled={isUploading}
//                     />
//                   </div>
//                 </div>

//                 {/* Cohorte et Tags */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="cohort">
//                       Cohorte / promotion
//                     </label>
//                     <select
//                       id="cohort"
//                       value={formData.cohort}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors"
//                       disabled={isUploading}
//                     >
//                       <option value="">Sélectionnez votre cohorte</option>
//                       {cohortsList.map(cohort => (
//                         <option key={cohort} value={cohort}>{cohort}</option>
//                       ))}
//                     </select>
//                   </div>
                  
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="tags">
//                       Tags ou mots-clés
//                     </label>
//                     <input
//                       id="tags"
//                       type="text"
//                       placeholder="portfolio, api, data-visualisation, e-commerce, responsive"
//                       value={formData.tags}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors"
//                       disabled={isUploading}
//                     />
//                   </div>
//                 </div>

//                 {/* Image du projet */}
//                 <div>
//                   <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300">
//                     Image du projet (optionnel)
//                   </label>
//                   <div className={`mt-1 flex justify-center rounded-lg border-2 border-dashed px-6 pt-5 pb-6 transition-all ${
//                     imageFile ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-[#E30613]/50'
//                   }`}>
//                     <div className="space-y-1 text-center">
//                       <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">
//                         {imageFile ? 'image' : 'add_photo_alternate'}
//                       </span>
//                       <div className="flex text-sm text-gray-600 dark:text-gray-400">
//                         <label className="relative cursor-pointer rounded-md font-medium text-[#E30613] hover:text-[#E30613]/80">
//                           <span>{imageFile ? 'Changer l\'image' : 'Ajouter une image'}</span>
//                           <input
//                             className="sr-only"
//                             type="file"
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             disabled={isUploading}
//                           />
//                         </label>
//                         <p className="pl-1">{imageFile ? 'sélectionnée' : 'JPEG, PNG, GIF (max 5MB)'}</p>
//                       </div>
//                       {imageFile && (
//                         <p className="text-xs text-green-600 dark:text-green-400">
//                           ✓ {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Upload de fichier - seulement pour la création */}
//                 {!isEditing && (
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300">
//                       Fichier du projet (.zip) *
//                     </label>
//                     <div className={`mt-1 flex justify-center rounded-lg border-2 border-dashed px-6 pt-5 pb-6 transition-all ${
//                       file ? 'border-[#E30613] bg-[#E30613]/5' : 'border-gray-300 dark:border-gray-600 hover:border-[#E30613]/50'
//                     }`}>
//                       <div className="space-y-1 text-center">
//                         <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">
//                           {file ? 'folder_zip' : 'cloud_upload'}
//                         </span>
//                         <div className="flex text-sm text-gray-600 dark:text-gray-400">
//                           <label className="relative cursor-pointer rounded-md font-medium text-[#E30613] hover:text-[#E30613]/80">
//                             <span>{file ? 'Changer le fichier' : 'Télécharger un fichier'}</span>
//                             <input
//                               className="sr-only"
//                               type="file"
//                               accept=".zip"
//                               onChange={handleFileChange}
//                               disabled={isUploading}
//                             />
//                           </label>
//                           <p className="pl-1">{file ? 'sélectionné' : 'ou glissez-déposez'}</p>
//                         </div>
//                         <p className="text-xs text-gray-500 dark:text-gray-500">
//                           Archive ZIP contenant votre code source (max. 50MB)
//                         </p>
//                       </div>
//                     </div>
                    
//                     {/* Affichage du fichier sélectionné */}
//                     {file && (
//                       <div className="mt-4 space-y-2">
//                         <div className="flex justify-between items-center text-sm">
//                           <div className="flex items-center gap-2">
//                             <span className="material-symbols-outlined text-[#E30613] text-base">description</span>
//                             <p className="font-medium text-[#001F3F] dark:text-gray-300 truncate flex-1">
//                               {file.name}
//                             </p>
//                           </div>
//                           <p className={`text-sm ${isUploading ? 'text-[#E30613]' : 'text-green-600 dark:text-green-400'}`}>
//                             {isUploading ? '📤 Téléversement...' : '✅ Prêt'}
//                           </p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Boutons */}
//                 <div className="pt-4 flex flex-col sm:flex-row justify-end gap-4 border-t border-gray-200 dark:border-gray-700">
//                   <button
//                     type="button"
//                     onClick={() => navigate('/dashboard')}
//                     className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
//                     disabled={isUploading}
//                   >
//                     Annuler
//                   </button>
//                   <div className="flex gap-3">
//                     {!isEditing && (
//                       <button
//                         type="button"
//                         onClick={resetForm}
//                         className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
//                         disabled={isUploading}
//                       >
//                         Réinitialiser
//                       </button>
//                     )}
//                     <button
//                       type="submit"
//                       disabled={isUploading}
//                       className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-8 bg-[#E30613] text-white text-base font-bold hover:bg-[#E30613]/90 focus:outline-none focus:ring-2 focus:ring-[#E30613] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
//                     >
//                       {isUploading ? (
//                         <>
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                           <span>{isEditing ? 'Modification...' : 'Publication...'}</span>
//                         </>
//                       ) : (
//                         <>
//                           <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
//                             {isEditing ? 'save' : 'publish'}
//                           </span>
//                           <span>{isEditing ? 'Modifier le projet' : 'Publier mon projet'}</span>
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             </section>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default UploadProject;


// // src/pages/UploadProject.jsx - VERSION CORRIGÉE
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import axios from 'axios';
// import authService from '../services/auth';
// import { useProjects } from '../context/ProjectContext';

// const UploadProject = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     technologies: '',
//     description: '',
//     cohort: '',
//     tags: '',
//     github_url: '',
//     demo_url: ''
//   });
//   const [file, setFile] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState('');
//   const [isEditing, setIsEditing] = useState(false);
//   const [editProjectId, setEditProjectId] = useState(null);
//   const [user, setUser] = useState(null);
  
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const { addProject, updateProject } = useProjects();

//   const cohortsList = [
//     'DWWM - Mars 2024',
//     'CDA - Janvier 2024', 
//     'AI Engineer - Mai 2024',
//     'DWWM - Novembre 2023',
//     'CDA - Septembre 2023'
//   ];

//   useEffect(() => {
//     const currentUser = authService.getCurrentUser();
//     console.log('👤 DEBUG - Utilisateur connecté:', currentUser);
//     setUser(currentUser);
    
//     if (currentUser?.cohort) {
//       setFormData(prev => ({
//         ...prev,
//         cohort: currentUser.cohort
//       }));
//     }

//     const editId = searchParams.get('edit');
//     if (editId) {
//       loadProjectForEdit(editId);
//     }
//   }, [searchParams]);

//   const loadProjectForEdit = async (projectId) => {
//     try {
//       const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
//       const token = authService.getAccessToken();
      
//       const response = await axios.get(`${baseUrl}/api/projects/${projectId}/`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       const project = response.data;
//       setFormData({
//         title: project.title || '',
//         technologies: project.technologies || '',
//         description: project.description || '',
//         cohort: project.cohort || '',
//         tags: project.tags || '',
//         github_url: project.github_url || '',
//         demo_url: project.demo_url || ''
//       });
//       setIsEditing(true);
//       setEditProjectId(projectId);
//     } catch (err) {
//       console.error('Erreur chargement projet:', err);
//       setError('Erreur lors du chargement du projet');
//     }
//   };

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [id]: value
//     }));
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       if (selectedFile.size > 50 * 1024 * 1024) {
//         setError('Le fichier est trop volumineux. Taille maximum: 50MB');
//         return;
//       }
      
//       if (!selectedFile.name.toLowerCase().endsWith('.zip')) {
//         setError('Veuillez sélectionner un fichier ZIP');
//         return;
//       }

//       setFile(selectedFile);
//       setError('');
//     }
//   };

//   const handleImageChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       if (selectedFile.size > 5 * 1024 * 1024) {
//         setError('L\'image est trop volumineuse. Taille maximum: 5MB');
//         return;
//       }
      
//       const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
//       if (!validTypes.includes(selectedFile.type)) {
//         setError('Format d\'image non supporté. Utilisez JPG, PNG ou GIF');
//         return;
//       }

//       setImageFile(selectedFile);
//       setError('');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     console.log('📝 DEBUG - Début handleSubmit');
    
//     // Validation de base
//     if (!formData.title.trim()) {
//       setError('Veuillez saisir un nom pour votre projet');
//       return;
//     }

//     if (!formData.technologies.trim()) {
//       setError('Veuillez saisir les technologies utilisées');
//       return;
//     }

//     if (!isEditing && !file) {
//       setError('Veuillez sélectionner un fichier ZIP');
//       return;
//     }

//     // Vérification utilisateur
//     if (!user || !user.id) {
//       setError('Vous devez être connecté pour créer un projet');
//       return;
//     }

//     setIsUploading(true);

//     try {
//       const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
//       const token = authService.getAccessToken();
      
//       // Créer FormData pour gérer les fichiers
//       const formDataToSend = new FormData();
//       formDataToSend.append('title', formData.title.trim());
//       formDataToSend.append('technologies', formData.technologies.trim());
//       formDataToSend.append('description', formData.description.trim());
//       formDataToSend.append('cohort', formData.cohort.trim());
//       formDataToSend.append('tags', formData.tags.trim());
//       formDataToSend.append('github_url', formData.github_url.trim());
//       formDataToSend.append('demo_url', formData.demo_url.trim());
//       formDataToSend.append('author', user.id.toString());
      
//       if (file) {
//         formDataToSend.append('zip_file', file);
//       }
      
//       if (imageFile) {
//         formDataToSend.append('image', imageFile);
//       }
      
//       console.log('🎯 DEBUG - Données à envoyer:');
//       for (let [key, value] of formDataToSend.entries()) {
//         console.log(`${key}:`, typeof value === 'object' ? value.name : value);
//       }

//       let response;
//       let project;
      
//       if (isEditing) {
//         // Mise à jour
//         console.log('✏️ DEBUG - Mise à jour du projet:', editProjectId);
        
//         response = await axios.put(
//           `${baseUrl}/api/projects/${editProjectId}/`,
//           formDataToSend,
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'multipart/form-data'
//             }
//           }
//         );
        
//         project = response.data;
//         updateProject(project);
        
//         console.log('✅ DEBUG - Projet modifié:', project);
//       } else {
//         // Création - Tenter plusieurs URLs possibles
//         console.log('🚀 DEBUG - Tentative de création du projet...');
        
//         const possibleUrls = [
//           `${baseUrl}/api/projects/`,
//           `${baseUrl}/api/projects/create/`,
//           `${baseUrl}/api/project/`,
//           `${baseUrl}/projects/`
//         ];
        
//         let lastError;
        
//         for (const url of possibleUrls) {
//           try {
//             console.log(`🔄 Tentative POST avec URL: ${url}`);
//             response = await axios.post(url, formDataToSend, {
//               headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'multipart/form-data'
//               }
//             });
//             console.log(`✅ SUCCÈS avec URL: ${url}`);
//             break;
//           } catch (err) {
//             lastError = err;
//             console.log(`❌ Échec avec URL: ${url} - Status: ${err.response?.status}`);
//             // Continuer avec l'URL suivante
//             continue;
//           }
//         }
        
//         if (!response) {
//           // Si aucune URL n'a fonctionné, essayer sans authentification pour tester
//           console.log('⚠️ Essayons sans authentification pour tester...');
//           try {
//             response = await axios.post(`${baseUrl}/api/projects/`, formDataToSend, {
//               headers: {
//                 'Content-Type': 'multipart/form-data'
//               }
//             });
//             console.log('✅ POST réussi sans authentification (permissions à vérifier)');
//           } catch (finalErr) {
//             console.error('❌ Échec final:', finalErr);
//             throw lastError || new Error('Impossible de créer le projet. Vérifiez la configuration de l\'API.');
//           }
//         }
        
//         project = response.data;
        
//         console.log('✅ DEBUG - Projet créé avec succès:', project);
        
//         // Ajouter au contexte
//         addProject(project);
//       }
      
//       // ⭐⭐ REDIRECTION GARANTIE - Même si l'API a des problèmes
//       console.log('✅ DEBUG - Redirection vers /project-success...');
      
//       // Créer un objet projet minimal pour la redirection
//       const projectForSuccess = {
//         id: project?.id || `temp_${Date.now()}`,
//         title: formData.title,
//         technologies: formData.technologies,
//         description: formData.description,
//         cohort: formData.cohort,
//         tags: formData.tags,
//         github_url: formData.github_url,
//         demo_url: formData.demo_url,
//         created_at: new Date().toISOString(),
//         author: user.id,
//         author_name: user.first_name ? `${user.first_name} ${user.last_name}` : user.username
//       };
      
//       navigate('/project-success', {
//         state: {
//           project: projectForSuccess,
//           isEditing: isEditing,
//           timestamp: Date.now()
//         }
//       });
      
//     } catch (err) {
//       console.error('❌ DEBUG - Erreur dans handleSubmit:', err);
//       console.error('❌ Response data:', err.response?.data);
//       console.error('❌ Response status:', err.response?.status);
      
//       let errorMessage = `Erreur lors de ${isEditing ? 'la modification' : 'la création'} du projet`;
      
//       if (err.response?.status === 404) {
//         errorMessage = 'Endpoint API introuvable (404). Vérifiez que l\'API Django est configurée.';
//       } else if (err.response?.status === 405) {
//         errorMessage = 'Méthode non autorisée (405). L\'endpoint n\'accepte pas POST.';
//       } else if (err.response?.status === 401) {
//         errorMessage = 'Non autorisé (401). Veuillez vous reconnecter.';
//       } else if (err.response?.status === 400) {
//         if (err.response.data) {
//           const errors = err.response.data;
//           if (typeof errors === 'object') {
//             const errorDetails = Object.entries(errors)
//               .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
//               .join('; ');
//             errorMessage = `Erreurs de validation: ${errorDetails}`;
//           } else if (typeof errors === 'string') {
//             errorMessage = errors;
//           }
//         }
//       } else if (err.message) {
//         errorMessage = err.message;
//       }
      
//       setError(errorMessage);
      
//       // ⭐ OPTION : Rediriger quand même vers le succès en mode "simulation"
//       // Décommentez ces lignes si vous voulez tester la navigation sans API
//       /*
//       console.log('⚠️ Mode simulation - Redirection quand même vers succès');
//       const mockProject = {
//         id: `mock_${Date.now()}`,
//         title: formData.title,
//         technologies: formData.technologies,
//         created_at: new Date().toISOString(),
//         author: user.id
//       };
      
//       navigate('/project-success', {
//         state: {
//           project: mockProject,
//           isEditing: isEditing,
//           timestamp: Date.now(),
//           isMock: true
//         }
//       });
//       */
      
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleLogout = () => {
//     authService.logout();
//     navigate('/login');
//   };

//   const resetForm = () => {
//     setFormData({
//       title: '',
//       technologies: '',
//       description: '',
//       cohort: user?.cohort || '',
//       tags: '',
//       github_url: '',
//       demo_url: ''
//     });
//     setFile(null);
//     setImageFile(null);
//     setError('');
//   };

//   const getUserAvatar = () => {
//     if (user?.profile_picture) return user.profile_picture;
//     if (user?.avatar) return user.avatar;
//     return "https://lh3.googleusercontent.com/aida-public/A6AXuA8VxS_x8jwDh_tF-ygq2OirDNuL2iAY7iNaZiMUFP0ulnWyCKEm_PI1Gc0ciC2TN952cGudRb6wvbJbWPWVGo903BPnvhSXGPboDyDNJD8iZzXEJfiOfRe0gXFHiPnJlAg73UmjlUMXqsg7hI0ME57JNKDz_c82g19tlQb4FmCTdsxqi8jz0nMLTwlAIUvOj4x0iE62XhOCawgbKi0PPQiv7Cz6CfFpzMGaxuCg9bUKa62_BIjWKT5M4ZTd9MB-KOhIR0FHkzz25w";
//   };

//   const getUserFullName = () => {
//     if (user?.first_name && user?.last_name) return `${user.first_name} ${user.last_name}`;
//     if (user?.username) return user.username;
//     if (user?.name) return user.name;
//     return 'Utilisateur';
//   };

//   const getUserCohort = () => {
//     return user?.cohort || 'Stagiaire Simplon';
//   };

//   return (
//     <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen">
//       <div className="flex min-h-screen">
        
//         {/* Sidebar */}
//         <aside className="w-64 flex-shrink-0 bg-[#001F3F] text-white flex flex-col p-4">
//           <div className="flex items-center gap-3 px-3 py-2 mb-8">
//             <img 
//               src="/src/logo.png" 
//               alt="Logo Simplon" 
//               className="size-10 rounded-full object-cover"
//             />
//             <div className="flex flex-col">
//               <h1 className="text-white text-base font-medium leading-normal">Simplon</h1>
//               <p className="text-gray-400 text-sm font-normal leading-normal">Code Platform</p>
//             </div>
//           </div>

//           <div className="flex flex-col justify-between flex-grow">
//             <nav className="flex flex-col gap-2">
//               <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
//                 <span className="material-symbols-outlined">folder</span>
//                 <p className="text-sm font-medium">Mes projets</p>
//               </Link>
//               <Link to="/upload" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#E30613] text-white">
//                 <span className="material-symbols-outlined">upload_file</span>
//                 <p className="text-sm font-medium">Déposer un projet</p>
//               </Link>
//               <Link to="/explore" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
//                 <span className="material-symbols-outlined">explore</span>
//                 <p className="text-sm font-medium">Explorer les projets</p>
//               </Link>
//             </nav>
            
//             <div className="flex flex-col gap-1">
//               <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
//                 <span className="material-symbols-outlined">person</span>
//                 <p className="text-sm font-medium leading-normal">Profil</p>
//               </Link>
//               <Link to="/parametre" className="flex items-center gap-3 rounded px-3 py-2 text-white/70 hover:bg-[#003265] hover:text-white">
//                 <span className="material-symbols-outlined">settings</span>
//                 <span>Paramètre</span>
//               </Link>

//               <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left">
//                 <span className="material-symbols-outlined">logout</span>
//                 <p className="text-sm font-medium">Déconnexion</p>
//               </button>
//             </div>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-6 lg:p-10">
//           <div className="max-w-4xl mx-auto">
            
//             {/* Header */}
//             <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
//               <div>
//                 <h1 className="text-[#001F3F] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
//                   {isEditing ? 'Modifier le Projet' : 'Déposer un Projet'}
//                 </h1>
//                 <p className="text-gray-500 dark:text-gray-400 mt-1">
//                   {isEditing 
//                     ? 'Modifiez les informations de votre projet existant' 
//                     : 'Remplissez les informations ci-dessous pour partager votre création avec la communauté Simplon.'}
//                 </p>
//               </div>
              
//               {/* Profil */}
//               <div className="flex items-center gap-3">
//                 <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 border-2 border-[#E30613]"
//                   style={{ backgroundImage: `url(${getUserAvatar()})` }}>
//                 </div>
//                 <div className="flex flex-col text-right">
//                   <h2 className="text-[#001F3F] dark:text-white text-base font-medium">
//                     {getUserFullName()}
//                   </h2>
//                   <p className="text-gray-500 dark:text-gray-400 text-sm">
//                     {getUserCohort()}
//                   </p>
//                 </div>
//               </div>
//             </header>

//             {/* Formulaire */}
//             <section className="bg-white dark:bg-[#001F3F]/30 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm">
//               {error && (
//                 <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-200">
//                   <div className="flex items-center">
//                     <span className="material-symbols-outlined mr-2">error</span>
//                     <span>{error}</span>
//                   </div>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-6">
                
//                 {/* Nom du projet */}
//                 <div>
//                   <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="title">
//                     Nom du projet *
//                   </label>
//                   <input
//                     id="title"
//                     type="text"
//                     placeholder="Ex: Mon portfolio interactif, API de gestion de tâches..."
//                     value={formData.title}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors"
//                     required
//                     disabled={isUploading}
//                   />
//                 </div>

//                 {/* Technologies utilisées */}
//                 <div>
//                   <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="technologies">
//                     Technologies utilisées *
//                   </label>
//                   <input
//                     id="technologies"
//                     type="text"
//                     placeholder="Ex: React, Node.js, MongoDB, Tailwind CSS, Python, Django..."
//                     value={formData.technologies}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors"
//                     required
//                     disabled={isUploading}
//                   />
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                     Séparez les technologies par des virgules. Ex: "React, Node.js, MongoDB"
//                   </p>
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="description">
//                     Description détaillée
//                   </label>
//                   <textarea
//                     id="description"
//                     placeholder="Décrivez votre projet, ses fonctionnalités principales, les défis techniques rencontrés, ce que vous avez appris..."
//                     rows="4"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors resize-none"
//                     disabled={isUploading}
//                   />
//                 </div>

//                 {/* Liens GitHub et Démo */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="github_url">
//                       Lien GitHub (optionnel)
//                     </label>
//                     <input
//                       id="github_url"
//                       type="url"
//                       placeholder="https://github.com/votre-username/projet"
//                       value={formData.github_url}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors"
//                       disabled={isUploading}
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="demo_url">
//                       Lien de démo (optionnel)
//                     </label>
//                     <input
//                       id="demo_url"
//                       type="url"
//                       placeholder="https://votre-projet.vercel.app"
//                       value={formData.demo_url}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors"
//                       disabled={isUploading}
//                     />
//                   </div>
//                 </div>

//                 {/* Cohorte et Tags */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="cohort">
//                       Cohorte / promotion
//                     </label>
//                     <select
//                       id="cohort"
//                       value={formData.cohort}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors"
//                       disabled={isUploading}
//                     >
//                       <option value="">Sélectionnez votre cohorte</option>
//                       {cohortsList.map(cohort => (
//                         <option key={cohort} value={cohort}>{cohort}</option>
//                       ))}
//                     </select>
//                   </div>
                  
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="tags">
//                       Tags ou mots-clés
//                     </label>
//                     <input
//                       id="tags"
//                       type="text"
//                       placeholder="portfolio, api, data-visualisation, e-commerce, responsive"
//                       value={formData.tags}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors"
//                       disabled={isUploading}
//                     />
//                   </div>
//                 </div>

//                 {/* Image du projet */}
//                 <div>
//                   <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300">
//                     Image du projet (optionnel)
//                   </label>
//                   <div className={`mt-1 flex justify-center rounded-lg border-2 border-dashed px-6 pt-5 pb-6 transition-all ${
//                     imageFile ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-[#E30613]/50'
//                   }`}>
//                     <div className="space-y-1 text-center">
//                       <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">
//                         {imageFile ? 'image' : 'add_photo_alternate'}
//                       </span>
//                       <div className="flex text-sm text-gray-600 dark:text-gray-400">
//                         <label className="relative cursor-pointer rounded-md font-medium text-[#E30613] hover:text-[#E30613]/80">
//                           <span>{imageFile ? 'Changer l\'image' : 'Ajouter une image'}</span>
//                           <input
//                             className="sr-only"
//                             type="file"
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             disabled={isUploading}
//                           />
//                         </label>
//                         <p className="pl-1">{imageFile ? 'sélectionnée' : 'JPEG, PNG, GIF (max 5MB)'}</p>
//                       </div>
//                       {imageFile && (
//                         <p className="text-xs text-green-600 dark:text-green-400">
//                           ✓ {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Upload de fichier - seulement pour la création */}
//                 {!isEditing && (
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300">
//                       Fichier du projet (.zip) *
//                     </label>
//                     <div className={`mt-1 flex justify-center rounded-lg border-2 border-dashed px-6 pt-5 pb-6 transition-all ${
//                       file ? 'border-[#E30613] bg-[#E30613]/5' : 'border-gray-300 dark:border-gray-600 hover:border-[#E30613]/50'
//                     }`}>
//                       <div className="space-y-1 text-center">
//                         <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">
//                           {file ? 'folder_zip' : 'cloud_upload'}
//                         </span>
//                         <div className="flex text-sm text-gray-600 dark:text-gray-400">
//                           <label className="relative cursor-pointer rounded-md font-medium text-[#E30613] hover:text-[#E30613]/80">
//                             <span>{file ? 'Changer le fichier' : 'Télécharger un fichier'}</span>
//                             <input
//                               className="sr-only"
//                               type="file"
//                               accept=".zip"
//                               onChange={handleFileChange}
//                               disabled={isUploading}
//                             />
//                           </label>
//                           <p className="pl-1">{file ? 'sélectionné' : 'ou glissez-déposez'}</p>
//                         </div>
//                         <p className="text-xs text-gray-500 dark:text-gray-500">
//                           Archive ZIP contenant votre code source (max. 50MB)
//                         </p>
//                       </div>
//                     </div>
                    
//                     {/* Affichage du fichier sélectionné */}
//                     {file && (
//                       <div className="mt-4 space-y-2">
//                         <div className="flex justify-between items-center text-sm">
//                           <div className="flex items-center gap-2">
//                             <span className="material-symbols-outlined text-[#E30613] text-base">description</span>
//                             <p className="font-medium text-[#001F3F] dark:text-gray-300 truncate flex-1">
//                               {file.name}
//                             </p>
//                           </div>
//                           <p className={`text-sm ${isUploading ? 'text-[#E30613]' : 'text-green-600 dark:text-green-400'}`}>
//                             {isUploading ? '📤 Téléversement...' : '✅ Prêt'}
//                           </p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Boutons */}
//                 <div className="pt-4 flex flex-col sm:flex-row justify-end gap-4 border-t border-gray-200 dark:border-gray-700">
//                   <button
//                     type="button"
//                     onClick={() => navigate('/dashboard')}
//                     className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
//                     disabled={isUploading}
//                   >
//                     Annuler
//                   </button>
//                   <div className="flex gap-3">
//                     {!isEditing && (
//                       <button
//                         type="button"
//                         onClick={resetForm}
//                         className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
//                         disabled={isUploading}
//                       >
//                         Réinitialiser
//                       </button>
//                     )}
//                     <button
//                       type="submit"
//                       disabled={isUploading}
//                       className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-8 bg-[#E30613] text-white text-base font-bold hover:bg-[#E30613]/90 focus:outline-none focus:ring-2 focus:ring-[#E30613] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
//                     >
//                       {isUploading ? (
//                         <>
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                           <span>{isEditing ? 'Modification...' : 'Publication...'}</span>
//                         </>
//                       ) : (
//                         <>
//                           <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
//                             {isEditing ? 'save' : 'publish'}
//                           </span>
//                           <span>{isEditing ? 'Modifier le projet' : 'Publier mon projet'}</span>
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             </section>

//             {/* Instructions de débogage */}
//             <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
//               <div className="flex items-start gap-3">
//                 <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 mt-0.5">bug_report</span>
//                 <div>
//                   <h3 className="text-blue-800 dark:text-blue-300 font-medium mb-1">
//                     Problème de redirection ?
//                   </h3>
//                   <p className="text-blue-700 dark:text-blue-400 text-sm">
//                     Si la redirection ne fonctionne pas, ouvrez la console du navigateur (F12) pour voir les erreurs.
//                     Vérifiez aussi que la route <code>/project-success</code> existe dans votre <code>App.jsx</code>.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default UploadProject;


// // src/pages/UploadProject.jsx - VERSION CORRIGÉE POUR ERREUR 405
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import { projectService } from '../services/projects';
// import authService from '../services/auth';
// import { useProjects } from '../context/ProjectContext';

// const UploadProject = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     technologies: '',
//     description: '',
//     cohort: '',
//     tags: '',
//     github_url: '',
//     demo_url: ''
//   });
//   const [file, setFile] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState('');
//   const [isEditing, setIsEditing] = useState(false);
//   const [editProjectId, setEditProjectId] = useState(null);
//   const [user, setUser] = useState(null);
//   const [apiEndpoints, setApiEndpoints] = useState([]);
  
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const { addProject, updateProject } = useProjects();

//   const cohortsList = [
//     'DWWM - Mars 2024',
//     'CDA - Janvier 2024', 
//     'AI Engineer - Mai 2024',
//     'DWWM - Novembre 2023',
//     'CDA - Septembre 2023'
//   ];

//   useEffect(() => {
//     const currentUser = authService.getCurrentUser();
//     console.log('👤 DEBUG - Utilisateur connecté:', currentUser);
//     setUser(currentUser);
    
//     if (currentUser?.cohort) {
//       setFormData(prev => ({
//         ...prev,
//         cohort: currentUser.cohort
//       }));
//     }

//     const editId = searchParams.get('edit');
//     if (editId) {
//       loadProjectForEdit(editId);
//     }

//     // Tester les endpoints au chargement
//     testEndpoints();
//   }, [searchParams]);

//   // Fonction pour tester les endpoints disponibles
//   const testEndpoints = async () => {
//     const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
//     const endpoints = [
//       '/api/projects/',
//       '/api/projects/create/',
//       '/api/project/',
//       '/api/upload/',
//       '/projects/',
//       '/api/upload/project/',
//       '/api/project/create/',
//       '/api/create/project/'
//     ];

//     const testedEndpoints = [];

//     for (const endpoint of endpoints) {
//       try {
//         const response = await fetch(`${baseUrl}${endpoint}`, {
//           method: 'OPTIONS',
//           headers: {
//             'Accept': 'application/json'
//           }
//         });
        
//         const allowedMethods = response.headers.get('allow') || '';
//         const status = response.status;
        
//         testedEndpoints.push({
//           url: endpoint,
//           status: status,
//           allowed: allowedMethods,
//           canPost: allowedMethods.includes('POST')
//         });
        
//         console.log(`🔍 ${endpoint}: Status ${status}, POST: ${allowedMethods.includes('POST') ? '✅' : '❌'}`);
//       } catch (err) {
//         testedEndpoints.push({
//           url: endpoint,
//           status: 0,
//           allowed: 'Erreur',
//           canPost: false
//         });
//         console.log(`🔍 ${endpoint}: ❌ Erreur - ${err.message}`);
//       }
//     }

//     setApiEndpoints(testedEndpoints);
//     console.log('📊 Endpoints testés:', testedEndpoints);
//   };

//   const loadProjectForEdit = async (projectId) => {
//     try {
//       const result = await projectService.getProjectDetails(projectId);
      
//       if (result.success) {
//         const project = result.data;
//         setFormData({
//           title: project.title || '',
//           technologies: project.technologies || '',
//           description: project.description || '',
//           cohort: project.cohort || '',
//           tags: project.tags || '',
//           github_url: project.github_url || '',
//           demo_url: project.demo_url || ''
//         });
//         setIsEditing(true);
//         setEditProjectId(projectId);
//       } else {
//         throw new Error(result.error || 'Erreur de chargement');
//       }
//     } catch (err) {
//       console.error('Erreur chargement projet:', err);
//       setError('Erreur lors du chargement du projet');
//     }
//   };

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [id]: value
//     }));
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       if (selectedFile.size > 50 * 1024 * 1024) {
//         setError('Le fichier est trop volumineux. Taille maximum: 50MB');
//         return;
//       }
      
//       if (!selectedFile.name.toLowerCase().endsWith('.zip')) {
//         setError('Veuillez sélectionner un fichier ZIP');
//         return;
//       }

//       setFile(selectedFile);
//       setError('');
//     }
//   };

//   const handleImageChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       if (selectedFile.size > 5 * 1024 * 1024) {
//         setError('L\'image est trop volumineuse. Taille maximum: 5MB');
//         return;
//       }
      
//       const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
//       if (!validTypes.includes(selectedFile.type)) {
//         setError('Format d\'image non supporté. Utilisez JPG, PNG ou GIF');
//         return;
//       }

//       setImageFile(selectedFile);
//       setError('');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     console.log('📝 DEBUG - Début handleSubmit');
    
//     // Validation de base
//     if (!formData.title.trim()) {
//       setError('Veuillez saisir un nom pour votre projet');
//       return;
//     }

//     if (!formData.technologies.trim()) {
//       setError('Veuillez saisir les technologies utilisées');
//       return;
//     }

//     if (!isEditing && !file) {
//       setError('Veuillez sélectionner un fichier ZIP');
//       return;
//     }

//     // Vérification utilisateur
//     if (!user || !user.id) {
//       setError('Vous devez être connecté pour créer un projet');
//       return;
//     }

//     setIsUploading(true);

//     try {
//       // Préparer les données du projet
//       const projectData = {
//         title: formData.title.trim(),
//         technologies: formData.technologies.trim(),
//         description: formData.description.trim(),
//         cohort: formData.cohort.trim(),
//         tags: formData.tags.trim(),
//         github_url: formData.github_url.trim(),
//         demo_url: formData.demo_url.trim(),
//       };

//       // Ajouter les fichiers
//       if (file) {
//         projectData.zip_file = file;
//       }
//       if (imageFile) {
//         projectData.image = imageFile;
//       }

//       console.log('🎯 DEBUG - Données préparées pour l\'upload');
//       console.log('👤 User ID:', user.id);
//       console.log('📁 Fichier ZIP:', file ? file.name : 'Aucun');
//       console.log('🖼️ Image:', imageFile ? imageFile.name : 'Aucune');

//       let project;

//       if (isEditing) {
//         // Mise à jour du projet existant
//         console.log('✏️ DEBUG - Mise à jour du projet:', editProjectId);
        
//         const result = await projectService.updateProject(editProjectId, projectData);
//         if (result.success) {
//           project = result.data;
//           updateProject(project);
//           console.log('✅ DEBUG - Projet modifié:', project);
//         } else {
//           throw new Error(result.error || result.message || 'Erreur de mise à jour');
//         }
//       } else {
//         // Création d'un nouveau projet - ESSAYER DIRECTEMENT AVEC FETCH
//         console.log('🚀 DEBUG - Tentative de création du projet...');
        
//         // Vérifier quels endpoints supportent POST
//         const endpointsWithPost = apiEndpoints.filter(ep => ep.canPost);
//         console.log('🔍 Endpoints supportant POST:', endpointsWithPost);
        
//         if (endpointsWithPost.length === 0) {
//           throw new Error('Aucun endpoint ne supporte la méthode POST. Vérifiez la configuration de l\'API Django.');
//         }
        
//         // Essayer chaque endpoint supportant POST
//         const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
//         const token = authService.getAccessToken();
        
//         let result = null;
//         let lastError = null;
        
//         for (const endpoint of endpointsWithPost) {
//           try {
//             console.log(`🔄 Tentative POST sur: ${baseUrl}${endpoint.url}`);
            
//             // Créer FormData
//             const formDataToSend = new FormData();
//             formDataToSend.append('title', projectData.title);
//             formDataToSend.append('technologies', projectData.technologies);
//             formDataToSend.append('description', projectData.description);
//             formDataToSend.append('cohort', projectData.cohort);
//             formDataToSend.append('tags', projectData.tags);
//             formDataToSend.append('github_url', projectData.github_url);
//             formDataToSend.append('demo_url', projectData.demo_url);
//             formDataToSend.append('author', user.id.toString());
            
//             if (projectData.zip_file) {
//               formDataToSend.append('zip_file', projectData.zip_file);
//             }
//             if (projectData.image) {
//               formDataToSend.append('image', projectData.image);
//             }
            
//             // Log FormData
//             console.log('📋 FormData:');
//             for (let [key, value] of formDataToSend.entries()) {
//               console.log(`${key}:`, typeof value === 'object' ? value.name : value);
//             }
            
//             const response = await fetch(`${baseUrl}${endpoint.url}`, {
//               method: 'POST',
//               headers: {
//                 'Authorization': token ? `Bearer ${token}` : ''
//                 // NE PAS mettre Content-Type pour FormData
//               },
//               body: formDataToSend
//             });
            
//             console.log(`📡 Status: ${response.status}`);
            
//             if (response.ok) {
//               const data = await response.json();
//               console.log(`✅ POST réussi sur ${endpoint.url}:`, data);
//               project = data;
//               break;
//             } else {
//               const errorText = await response.text();
//               console.log(`❌ POST échoué sur ${endpoint.url}: ${response.status} - ${errorText.substring(0, 200)}`);
//               lastError = new Error(`Erreur ${response.status} sur ${endpoint.url}: ${errorText.substring(0, 100)}`);
//             }
//           } catch (err) {
//             console.log(`❌ Erreur réseau sur ${endpoint.url}:`, err.message);
//             lastError = err;
//           }
//         }
        
//         if (!project) {
//           // Si aucune méthode ne fonctionne, utiliser projectService comme fallback
//           console.log('⚠️ Tentative avec projectService comme fallback...');
//           const serviceResult = await projectService.createProject(projectData);
          
//           if (serviceResult.success) {
//             project = serviceResult.data;
//             console.log('✅ Projet créé via projectService:', project);
//           } else {
//             throw lastError || new Error(serviceResult.error || serviceResult.message || 'Impossible de créer le projet');
//           }
//         }
        
//         // Validation de l'ID reçu
//         if (!project.id) {
//           console.warn('⚠️ Aucun ID reçu de l\'API, génération d\'un ID temporaire');
//           project.id = `temp_${Date.now()}`;
//         }
        
//         console.log('🆔 ID du projet:', project.id);
        
//         // Ajouter au contexte
//         addProject(project);
//       }
      
//       // REDIRECTION VERS LA PAGE DE SUCCÈS
//       console.log('✅ DEBUG - Redirection vers /project-success...');
      
//       // Créer un objet projet complet pour la redirection
//       const projectForSuccess = {
//         id: project?.id || `temp_${Date.now()}`,
//         title: formData.title,
//         technologies: formData.technologies,
//         description: formData.description,
//         cohort: formData.cohort,
//         tags: formData.tags,
//         github_url: formData.github_url,
//         demo_url: formData.demo_url,
//         created_at: new Date().toISOString(),
//         author: user.id,
//         author_name: user.first_name ? `${user.first_name} ${user.last_name}` : user.username,
//         status: 'draft'
//       };
      
//       navigate('/project-success', {
//         state: {
//           project: projectForSuccess,
//           isEditing: isEditing,
//           timestamp: Date.now(),
//           success: true
//         }
//       });
      
//     } catch (err) {
//       console.error('❌ DEBUG - Erreur dans handleSubmit:', err);
//       console.error('❌ Message d\'erreur complet:', err.message);
      
//       let errorMessage = `Erreur lors de ${isEditing ? 'la modification' : 'la création'} du projet`;
      
//       if (err.message.includes('405')) {
//         errorMessage = 'Méthode POST non autorisée (405). Les endpoints testés:\n\n';
//         apiEndpoints.forEach(ep => {
//           errorMessage += `${ep.url} - Status: ${ep.status}, POST: ${ep.canPost ? '✅' : '❌'}\n`;
//         });
//         errorMessage += '\nVérifiez que votre API Django accepte POST sur un de ces endpoints.';
//       } else if (err.message.includes('404')) {
//         errorMessage = 'Endpoint non trouvé (404). Vérifiez les routes Django.';
//       } else if (err.message.includes('401')) {
//         errorMessage = 'Non autorisé (401). Veuillez vous reconnecter.';
//       } else if (err.message) {
//         errorMessage = err.message;
//       }
      
//       setError(errorMessage);
      
//       // Ré-tester les endpoints en cas d'erreur
//       testEndpoints();
      
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleLogout = () => {
//     authService.logout();
//     navigate('/login');
//   };

//   const resetForm = () => {
//     setFormData({
//       title: '',
//       technologies: '',
//       description: '',
//       cohort: user?.cohort || '',
//       tags: '',
//       github_url: '',
//       demo_url: ''
//     });
//     setFile(null);
//     setImageFile(null);
//     setError('');
//   };

//   const getUserAvatar = () => {
//     if (user?.profile_picture) return user.profile_picture;
//     if (user?.avatar) return user.avatar;
//     return "https://lh3.googleusercontent.com/aida-public/A6AXuA8VxS_x8jwDh_tF-ygq2OirDNuL2iAY7iNaZiMUFP0ulnWyCKEm_PI1Gc0ciC2TN952cGudRb6wvbJbWPWVGo903BPnvhSXGPboDyDNJD8iZzXEJfiOfRe0gXFHiPnJlAg73UmjlUMXqsg7hI0ME57JNKDz_c82g19tlQb4FmCTdsxqi8jz0nMLTwlAIUvOj4x0iE62XhOCawgbKi0PPQiv7Cz6CfFpzMGaxuCg9bUKa62_BIjWKT5M4ZTd9MB-KOhIR0FHkzz25w";
//   };

//   const getUserFullName = () => {
//     if (user?.first_name && user?.last_name) return `${user.first_name} ${user.last_name}`;
//     if (user?.username) return user.username;
//     if (user?.name) return user.name;
//     return 'Utilisateur';
//   };

//   const getUserCohort = () => {
//     return user?.cohort || 'Stagiaire Simplon';
//   };

//   return (
//     <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen">
//       <div className="flex min-h-screen">
        
//         {/* Sidebar */}
//         <aside className="w-64 flex-shrink-0 bg-[#001F3F] text-white flex flex-col p-4">
//           <div className="flex items-center gap-3 px-3 py-2 mb-8">
//             <img 
//               src="/src/logo.png" 
//               alt="Logo Simplon" 
//               className="size-10 rounded-full object-cover"
//             />
//             <div className="flex flex-col">
//               <h1 className="text-white text-base font-medium leading-normal">Simplon</h1>
//               <p className="text-gray-400 text-sm font-normal leading-normal">Code Platform</p>
//             </div>
//           </div>

//           <div className="flex flex-col justify-between flex-grow">
//             <nav className="flex flex-col gap-2">
//               <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
//                 <span className="material-symbols-outlined">folder</span>
//                 <p className="text-sm font-medium">Mes projets</p>
//               </Link>
//               <Link to="/upload" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#E30613] text-white">
//                 <span className="material-symbols-outlined">upload_file</span>
//                 <p className="text-sm font-medium">Déposer un projet</p>
//               </Link>
//               <Link to="/explore" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
//                 <span className="material-symbols-outlined">explore</span>
//                 <p className="text-sm font-medium">Explorer les projets</p>
//               </Link>
//             </nav>
            
//             <div className="flex flex-col gap-1">
//               <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
//                 <span className="material-symbols-outlined">person</span>
//                 <p className="text-sm font-medium leading-normal">Profil</p>
//               </Link>
//               <Link to="/parametre" className="flex items-center gap-3 rounded px-3 py-2 text-white/70 hover:bg-[#003265] hover:text-white">
//                 <span className="material-symbols-outlined">settings</span>
//                 <span>Paramètre</span>
//               </Link>

//               <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left">
//                 <span className="material-symbols-outlined">logout</span>
//                 <p className="text-sm font-medium">Déconnexion</p>
//               </button>
//             </div>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-6 lg:p-10">
//           <div className="max-w-4xl mx-auto">
            
//             {/* Header */}
//             <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
//               <div>
//                 <h1 className="text-[#001F3F] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
//                   {isEditing ? 'Modifier le Projet' : 'Déposer un Projet'}
//                 </h1>
//                 <p className="text-gray-500 dark:text-gray-400 mt-1">
//                   {isEditing 
//                     ? 'Modifiez les informations de votre projet existant' 
//                     : 'Remplissez les informations ci-dessous pour partager votre création avec la communauté Simplon.'}
//                 </p>
//               </div>
              
//               {/* Profil */}
//               <div className="flex items-center gap-3">
//                 <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 border-2 border-[#E30613]"
//                   style={{ backgroundImage: `url(${getUserAvatar()})` }}>
//                 </div>
//                 <div className="flex flex-col text-right">
//                   <h2 className="text-[#001F3F] dark:text-white text-base font-medium">
//                     {getUserFullName()}
//                   </h2>
//                   <p className="text-gray-500 dark:text-gray-400 text-sm">
//                     {getUserCohort()}
//                   </p>
//                 </div>
//               </div>
//             </header>

//             {/* Informations API */}
//             {apiEndpoints.length > 0 && (
//               <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
//                 <div className="flex justify-between items-center mb-2">
//                   <h3 className="font-bold text-blue-800 dark:text-blue-300">🔧 État de l'API</h3>
//                   <button 
//                     onClick={testEndpoints}
//                     className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
//                   >
//                     Re-tester
//                   </button>
//                 </div>
//                 <div className="text-sm">
//                   <p className="text-blue-700 dark:text-blue-400 mb-2">
//                     Endpoints testés: {apiEndpoints.filter(ep => ep.status === 200).length}/{apiEndpoints.length}
//                   </p>
//                   <div className="max-h-32 overflow-y-auto bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
//                     {apiEndpoints.map((ep, idx) => (
//                       <div key={idx} className="flex items-center gap-2 py-1 border-b border-blue-200">
//                         <span className={`px-2 py-0.5 text-xs rounded ${
//                           ep.status === 200 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                         }`}>
//                           {ep.status || 'Err'}
//                         </span>
//                         <code className="flex-1 text-xs">{ep.url}</code>
//                         <span className={`px-2 py-0.5 text-xs rounded ${
//                           ep.canPost ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                         }`}>
//                           POST: {ep.canPost ? 'Oui' : 'Non'}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Formulaire */}
//             <section className="bg-white dark:bg-[#001F3F]/30 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm">
//               {error && (
//                 <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-200">
//                   <div className="flex items-center">
//                     <span className="material-symbols-outlined mr-2">error</span>
//                     <span className="whitespace-pre-line">{error}</span>
//                   </div>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-6">
                
//                 {/* Nom du projet */}
//                 <div>
//                   <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="title">
//                     Nom du projet *
//                   </label>
//                   <input
//                     id="title"
//                     type="text"
//                     placeholder="Ex: Mon portfolio interactif, API de gestion de tâches..."
//                     value={formData.title}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors"
//                     required
//                     disabled={isUploading}
//                   />
//                 </div>

//                 {/* Technologies utilisées */}
//                 <div>
//                   <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="technologies">
//                     Technologies utilisées *
//                   </label>
//                   <input
//                     id="technologies"
//                     type="text"
//                     placeholder="Ex: React, Node.js, MongoDB, Tailwind CSS, Python, Django..."
//                     value={formData.technologies}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors"
//                     required
//                     disabled={isUploading}
//                   />
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                     Séparez les technologies par des virgules. Ex: "React, Node.js, MongoDB"
//                   </p>
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="description">
//                     Description détaillée
//                   </label>
//                   <textarea
//                     id="description"
//                     placeholder="Décrivez votre projet, ses fonctionnalités principales, les défis techniques rencontrés, ce que vous avez appris..."
//                     rows="4"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors resize-none"
//                     disabled={isUploading}
//                   />
//                 </div>

//                 {/* Liens GitHub et Démo */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="github_url">
//                       Lien GitHub (optionnel)
//                     </label>
//                     <input
//                       id="github_url"
//                       type="url"
//                       placeholder="https://github.com/votre-username/projet"
//                       value={formData.github_url}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors"
//                       disabled={isUploading}
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="demo_url">
//                       Lien de démo (optionnel)
//                     </label>
//                     <input
//                       id="demo_url"
//                       type="url"
//                       placeholder="https://votre-projet.vercel.app"
//                       value={formData.demo_url}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors"
//                       disabled={isUploading}
//                     />
//                   </div>
//                 </div>

//                 {/* Cohorte et Tags */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="cohort">
//                       Cohorte / promotion
//                     </label>
//                     <select
//                       id="cohort"
//                       value={formData.cohort}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors"
//                       disabled={isUploading}
//                     >
//                       <option value="">Sélectionnez votre cohorte</option>
//                       {cohortsList.map(cohort => (
//                         <option key={cohort} value={cohort}>{cohort}</option>
//                       ))}
//                     </select>
//                   </div>
                  
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="tags">
//                       Tags ou mots-clés
//                     </label>
//                     <input
//                       id="tags"
//                       type="text"
//                       placeholder="portfolio, api, data-visualisation, e-commerce, responsive"
//                       value={formData.tags}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors"
//                       disabled={isUploading}
//                     />
//                   </div>
//                 </div>

//                 {/* Image du projet */}
//                 <div>
//                   <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300">
//                     Image du projet (optionnel)
//                   </label>
//                   <div className={`mt-1 flex justify-center rounded-lg border-2 border-dashed px-6 pt-5 pb-6 transition-all ${
//                     imageFile ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-[#E30613]/50'
//                   }`}>
//                     <div className="space-y-1 text-center">
//                       <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">
//                         {imageFile ? 'image' : 'add_photo_alternate'}
//                       </span>
//                       <div className="flex text-sm text-gray-600 dark:text-gray-400">
//                         <label className="relative cursor-pointer rounded-md font-medium text-[#E30613] hover:text-[#E30613]/80">
//                           <span>{imageFile ? 'Changer l\'image' : 'Ajouter une image'}</span>
//                           <input
//                             className="sr-only"
//                             type="file"
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             disabled={isUploading}
//                           />
//                         </label>
//                         <p className="pl-1">{imageFile ? 'sélectionnée' : 'JPEG, PNG, GIF (max 5MB)'}</p>
//                       </div>
//                       {imageFile && (
//                         <p className="text-xs text-green-600 dark:text-green-400">
//                           ✓ {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Upload de fichier - seulement pour la création */}
//                 {!isEditing && (
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300">
//                       Fichier du projet (.zip) *
//                     </label>
//                     <div className={`mt-1 flex justify-center rounded-lg border-2 border-dashed px-6 pt-5 pb-6 transition-all ${
//                       file ? 'border-[#E30613] bg-[#E30613]/5' : 'border-gray-300 dark:border-gray-600 hover:border-[#E30613]/50'
//                     }`}>
//                       <div className="space-y-1 text-center">
//                         <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">
//                           {file ? 'folder_zip' : 'cloud_upload'}
//                         </span>
//                         <div className="flex text-sm text-gray-600 dark:text-gray-400">
//                           <label className="relative cursor-pointer rounded-md font-medium text-[#E30613] hover:text-[#E30613]/80">
//                             <span>{file ? 'Changer le fichier' : 'Télécharger un fichier'}</span>
//                             <input
//                               className="sr-only"
//                               type="file"
//                               accept=".zip"
//                               onChange={handleFileChange}
//                               disabled={isUploading}
//                             />
//                           </label>
//                           <p className="pl-1">{file ? 'sélectionné' : 'ou glissez-déposez'}</p>
//                         </div>
//                         <p className="text-xs text-gray-500 dark:text-gray-500">
//                           Archive ZIP contenant votre code source (max. 50MB)
//                         </p>
//                       </div>
//                     </div>
                    
//                     {/* Affichage du fichier sélectionné */}
//                     {file && (
//                       <div className="mt-4 space-y-2">
//                         <div className="flex justify-between items-center text-sm">
//                           <div className="flex items-center gap-2">
//                             <span className="material-symbols-outlined text-[#E30613] text-base">description</span>
//                             <p className="font-medium text-[#001F3F] dark:text-gray-300 truncate flex-1">
//                               {file.name}
//                             </p>
//                           </div>
//                           <p className={`text-sm ${isUploading ? 'text-[#E30613]' : 'text-green-600 dark:text-green-400'}`}>
//                             {isUploading ? '📤 Téléversement...' : '✅ Prêt'}
//                           </p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Boutons */}
//                 <div className="pt-4 flex flex-col sm:flex-row justify-end gap-4 border-t border-gray-200 dark:border-gray-700">
//                   <button
//                     type="button"
//                     onClick={() => navigate('/dashboard')}
//                     className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
//                     disabled={isUploading}
//                   >
//                     Annuler
//                   </button>
//                   <div className="flex gap-3">
//                     {!isEditing && (
//                       <button
//                         type="button"
//                         onClick={resetForm}
//                         className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
//                         disabled={isUploading}
//                       >
//                         Réinitialiser
//                       </button>
//                     )}
//                     <button
//                       type="submit"
//                       disabled={isUploading}
//                       className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-8 bg-[#E30613] text-white text-base font-bold hover:bg-[#E30613]/90 focus:outline-none focus:ring-2 focus:ring-[#E30613] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
//                     >
//                       {isUploading ? (
//                         <>
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                           <span>{isEditing ? 'Modification...' : 'Publication...'}</span>
//                         </>
//                       ) : (
//                         <>
//                           <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
//                             {isEditing ? 'save' : 'publish'}
//                           </span>
//                           <span>{isEditing ? 'Modifier le projet' : 'Publier mon projet'}</span>
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             </section>

//             {/* Section de débogage */}
//             <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
//               <div className="flex items-start gap-3">
//                 <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 mt-0.5">warning</span>
//                 <div>
//                   <h3 className="text-yellow-800 dark:text-yellow-300 font-medium mb-1">
//                     Problème d'API détecté (Erreur 405)
//                   </h3>
//                   <p className="text-yellow-700 dark:text-yellow-400 text-sm mb-2">
//                     L'API Django ne semble pas accepter la méthode POST. Voici ce que vous devez vérifier :
//                   </p>
//                   <ol className="list-decimal list-inside text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
//                     <li>Ouvrir <code>http://localhost:8000/admin/</code> pour vérifier que Django fonctionne</li>
//                     <li>Vérifier les routes dans votre fichier <code>urls.py</code></li>
//                     <li>S'assurer que la vue correspondante accepte POST</li>
//                     <li>Vérifier les permissions Django REST Framework</li>
//                     <li>Tester avec Postman ou curl directement</li>
//                   </ol>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default UploadProject;



// // src/pages/UploadProject.jsx - VERSION CORRIGÉE
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import axios from 'axios'; // Import direct d'axios
// import authService from '../services/auth';

// const UploadProject = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     technologies: '',
//     description: '',
//     cohort: '',
//     tags: '',
//     github_url: '',
//     demo_url: ''
//   });
//   const [file, setFile] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState('');
//   const [isEditing, setIsEditing] = useState(false);
//   const [editProjectId, setEditProjectId] = useState(null);
//   const [user, setUser] = useState(null);
//   const [apiStatus, setApiStatus] = useState({});
  
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   const cohortsList = [
//     'DWWM - Mars 2024',
//     'CDA - Janvier 2024', 
//     'AI Engineer - Mai 2024',
//     'DWWM - Novembre 2023',
//     'CDA - Septembre 2023'
//   ];

//   // Configuration de l'API
//   const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
//   const API_ENDPOINTS = {
//     projects: '/api/projects/',
//     create: '/api/projects/create/',
//     upload: '/api/upload/',
//     debug: '/api/projects/debug/',
//     status: '/api/status/'
//   };

//   useEffect(() => {
//     const currentUser = authService.getCurrentUser();
//     console.log('👤 Utilisateur connecté:', currentUser);
//     setUser(currentUser);
    
//     if (currentUser?.cohort) {
//       setFormData(prev => ({
//         ...prev,
//         cohort: currentUser.cohort
//       }));
//     }

//     const editId = searchParams.get('edit');
//     if (editId) {
//       loadProjectForEdit(editId);
//     }

//     // Tester la connexion API
//     checkApiConnection();
//   }, [searchParams]);

//   const checkApiConnection = async () => {
//     try {
//       console.log('🔍 Vérification de la connexion API...');
      
//       // Test 1: Vérifier le statut de l'API
//       const statusResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.status}`);
//       console.log('✅ API Status:', statusResponse.data);
      
//       // Test 2: Vérifier les endpoints disponibles
//       const endpoints = {};
      
//       for (const [key, endpoint] of Object.entries(API_ENDPOINTS)) {
//         try {
//           const response = await axios.options(`${API_BASE_URL}${endpoint}`);
//           const allowedMethods = response.headers['allow'] || '';
//           endpoints[key] = {
//             url: endpoint,
//             status: response.status,
//             allowed: allowedMethods,
//             canPost: allowedMethods.includes('POST'),
//             canGet: allowedMethods.includes('GET')
//           };
//           console.log(`🔍 ${key}: ${allowedMethods.includes('POST') ? '✅ POST' : '❌ POST'}`);
//         } catch (err) {
//           endpoints[key] = {
//             url: endpoint,
//             status: err.response?.status || 0,
//             allowed: 'Erreur',
//             canPost: false,
//             canGet: false
//           };
//         }
//       }
      
//       setApiStatus(endpoints);
      
//     } catch (err) {
//       console.error('❌ Erreur de connexion API:', err.message);
//       setApiStatus({ error: 'API non accessible' });
//     }
//   };

//   const loadProjectForEdit = async (projectId) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/projects/${projectId}/`);
      
//       if (response.status === 200) {
//         const project = response.data;
//         setFormData({
//           title: project.title || '',
//           technologies: project.technologies || '',
//           description: project.description || '',
//           cohort: project.cohort || '',
//           tags: project.tags || '',
//           github_url: project.github_url || '',
//           demo_url: project.demo_url || ''
//         });
//         setIsEditing(true);
//         setEditProjectId(projectId);
//       }
//     } catch (err) {
//       console.error('Erreur chargement projet:', err);
//       setError('Erreur lors du chargement du projet');
//     }
//   };

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [id]: value
//     }));
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       if (selectedFile.size > 50 * 1024 * 1024) {
//         setError('Le fichier est trop volumineux. Taille maximum: 50MB');
//         return;
//       }
      
//       if (!selectedFile.name.toLowerCase().endsWith('.zip')) {
//         setError('Veuillez sélectionner un fichier ZIP');
//         return;
//       }

//       setFile(selectedFile);
//       setError('');
//     }
//   };

//   const handleImageChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       if (selectedFile.size > 5 * 1024 * 1024) {
//         setError('L\'image est trop volumineuse. Taille maximum: 5MB');
//         return;
//       }
      
//       const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
//       if (!validTypes.includes(selectedFile.type)) {
//         setError('Format d\'image non supporté. Utilisez JPG, PNG ou GIF');
//         return;
//       }

//       setImageFile(selectedFile);
//       setError('');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     console.log('📝 Début de la soumission...');
    
//     // Validation
//     if (!formData.title.trim()) {
//       setError('Veuillez saisir un nom pour votre projet');
//       return;
//     }

//     if (!formData.technologies.trim()) {
//       setError('Veuillez saisir les technologies utilisées');
//       return;
//     }

//     if (!isEditing && !file) {
//       setError('Veuillez sélectionner un fichier ZIP');
//       return;
//     }

//     if (!user || !user.id) {
//       setError('Vous devez être connecté pour créer un projet');
//       return;
//     }

//     setIsUploading(true);

//     try {
//       // Récupérer le token JWT
//       const token = localStorage.getItem('access_token') || localStorage.getItem('token');
//       console.log('🔑 Token JWT:', token ? 'Présent' : 'Absent');

//       // Créer FormData
//       const formDataToSend = new FormData();
      
//       // Ajouter les champs texte
//       formDataToSend.append('title', formData.title.trim());
//       formDataToSend.append('technologies', formData.technologies.trim());
//       formDataToSend.append('description', formData.description.trim());
//       formDataToSend.append('cohort', formData.cohort.trim());
//       formDataToSend.append('tags', formData.tags.trim());
//       formDataToSend.append('github_url', formData.github_url.trim());
//       formDataToSend.append('demo_url', formData.demo_url.trim());
//       formDataToSend.append('author', user.id.toString());
      
//       // Ajouter les fichiers
//       if (file) {
//         formDataToSend.append('zip_file', file);
//       }
//       if (imageFile) {
//         formDataToSend.append('image', imageFile);
//       }

//       // Afficher le contenu de FormData (pour débogage)
//       console.log('📋 FormData à envoyer:');
//       for (let [key, value] of formDataToSend.entries()) {
//         console.log(`${key}:`, typeof value === 'object' ? value.name : value);
//       }

//       // Configurer les headers
//       const headers = {};
//       if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//       }
      
//       // Ajouter le header CSRF pour Django
//       const csrfToken = document.cookie.split('; ')
//         .find(row => row.startsWith('csrftoken='))
//         ?.split('=')[1];
      
//       if (csrfToken) {
//         headers['X-CSRFToken'] = csrfToken;
//       }

//       // D'abord, essayer l'endpoint principal
//       const endpoint = isEditing 
//         ? `${API_BASE_URL}/api/projects/${editProjectId}/`
//         : `${API_BASE_URL}${API_ENDPOINTS.projects}`;
      
//       const method = isEditing ? 'PUT' : 'POST';
      
//       console.log(`🚀 Envoi ${method} à: ${endpoint}`);

//       const response = await axios({
//         method: method,
//         url: endpoint,
//         data: formDataToSend,
//         headers: headers,
//         // Important: Ne pas définir Content-Type pour FormData
//         // Axys le fera automatiquement avec la boundary correcte
//       });

//       console.log('✅ Réponse API:', response.data);
      
//       // Succès
//       if (isEditing) {
//         alert('✅ Projet modifié avec succès !');
//       } else {
//         alert('✅ Projet créé avec succès !');
//       }
      
//       // Redirection vers le dashboard
//       navigate('/dashboard', {
//         state: { 
//           success: true,
//           message: `Projet "${formData.title}" ${isEditing ? 'modifié' : 'créé'} avec succès!`
//         }
//       });

//     } catch (err) {
//       console.error('❌ Erreur détaillée:', err);
      
//       let errorMessage = `Erreur lors de ${isEditing ? 'la modification' : 'la création'} du projet`;
      
//       if (err.response) {
//         // Erreur avec réponse du serveur
//         console.log('📡 Réponse erreur:', err.response.status, err.response.data);
        
//         switch (err.response.status) {
//           case 400:
//             errorMessage = 'Données invalides: ' + 
//               (err.response.data.detail || JSON.stringify(err.response.data));
//             break;
//           case 401:
//             errorMessage = 'Non autorisé. Veuillez vous reconnecter.';
//             break;
//           case 403:
//             errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
//             break;
//           case 404:
//             errorMessage = 'Endpoint non trouvé. Vérifiez la configuration de l\'API.';
//             break;
//           case 405:
//             errorMessage = 'Méthode non autorisée (405). L\'API n\'accepte pas POST sur cet endpoint.';
//             break;
//           case 413:
//             errorMessage = 'Fichier trop volumineux. Taille maximum: 50MB';
//             break;
//           case 500:
//             errorMessage = 'Erreur interne du serveur. Contactez l\'administrateur.';
//             break;
//           default:
//             errorMessage = `Erreur ${err.response.status}: ${JSON.stringify(err.response.data)}`;
//         }
//       } else if (err.request) {
//         // Pas de réponse du serveur
//         errorMessage = 'Pas de réponse du serveur. Vérifiez:';
//         errorMessage += '\n1. Que le serveur Django est en cours d\'exécution';
//         errorMessage += '\n2. Que l\'URL API est correcte: ' + API_BASE_URL;
//         errorMessage += '\n3. Que CORS est configuré dans Django';
//       } else {
//         // Autre erreur
//         errorMessage = err.message || 'Erreur inconnue';
//       }
      
//       setError(errorMessage);
      
//       // Re-vérifier la connexion API
//       await checkApiConnection();
      
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleLogout = () => {
//     authService.logout();
//     navigate('/login');
//   };

//   const resetForm = () => {
//     setFormData({
//       title: '',
//       technologies: '',
//       description: '',
//       cohort: user?.cohort || '',
//       tags: '',
//       github_url: '',
//       demo_url: ''
//     });
//     setFile(null);
//     setImageFile(null);
//     setError('');
//   };

//   const getUserAvatar = () => {
//     if (user?.profile_picture) return user.profile_picture;
//     if (user?.avatar) return user.avatar;
//     return "https://lh3.googleusercontent.com/aida-public/A6AXuA8VxS_x8jwDh_tF-ygq2OirDNuL2iAY7iNaZiMUFP0ulnWyCKEm_PI1Gc0ciC2TN952cGudRb6wvbJbWPWVGo903BPnvhSXGPboDyDNJD8iZzXEJfiOfRe0gXFHiPnJlAg73UmjlUMXqsg7hI0ME57JNKDz_c82g19tlQb4FmCTdsxqi8jz0nMLTwlAIUvOj4x0iE62XhOCawgbKi0PPQiv7Cz6CfFpzMGaxuCg9bUKa62_BIjWKT5M4ZTd9MB-KOhIR0FHkzz25w";
//   };

//   const getUserFullName = () => {
//     if (user?.first_name && user?.last_name) return `${user.first_name} ${user.last_name}`;
//     if (user?.username) return user.username;
//     if (user?.name) return user.name;
//     return 'Utilisateur';
//   };

//   const getUserCohort = () => {
//     return user?.cohort || 'Stagiaire Simplon';
//   };

//   return (
//     <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen">
//       <div className="flex min-h-screen">
        
//         {/* Sidebar (inchangée) */}
//         <aside className="w-64 flex-shrink-0 bg-[#001F3F] text-white flex flex-col p-4">
//           {/* ... votre sidebar existante ... */}
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-6 lg:p-10">
//           <div className="max-w-4xl mx-auto">
            
//             {/* Header */}
//             <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
//               <div>
//                 <h1 className="text-[#001F3F] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
//                   {isEditing ? 'Modifier le Projet' : 'Déposer un Projet'}
//                 </h1>
//                 <p className="text-gray-500 dark:text-gray-400 mt-1">
//                   {isEditing 
//                     ? 'Modifiez les informations de votre projet existant' 
//                     : 'Remplissez les informations ci-dessous pour partager votre création avec la communauté Simplon.'}
//                 </p>
//               </div>
              
//               {/* Profil */}
//               <div className="flex items-center gap-3">
//                 <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 border-2 border-[#E30613]"
//                   style={{ backgroundImage: `url(${getUserAvatar()})` }}>
//                 </div>
//                 <div className="flex flex-col text-right">
//                   <h2 className="text-[#001F3F] dark:text-white text-base font-medium">
//                     {getUserFullName()}
//                   </h2>
//                   <p className="text-gray-500 dark:text-gray-400 text-sm">
//                     {getUserCohort()}
//                   </p>
//                 </div>
//               </div>
//             </header>

//             {/* Informations API */}
//             {Object.keys(apiStatus).length > 0 && (
//               <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
//                 <div className="flex justify-between items-center mb-2">
//                   <h3 className="font-bold text-blue-800 dark:text-blue-300">🔧 État de l'API</h3>
//                   <button 
//                     onClick={checkApiConnection}
//                     className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
//                   >
//                     Re-vérifier
//                   </button>
//                 </div>
//                 <div className="text-sm">
//                   <p className="text-blue-700 dark:text-blue-400 mb-2">
//                     Base URL: <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">{API_BASE_URL}</code>
//                   </p>
//                   <div className="max-h-32 overflow-y-auto bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
//                     {Object.entries(apiStatus).map(([key, ep]) => (
//                       ep.url && (
//                         <div key={key} className="flex items-center gap-2 py-1 border-b border-blue-200">
//                           <span className={`px-2 py-0.5 text-xs rounded ${
//                             ep.status === 200 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                           }`}>
//                             {ep.status || 'Err'}
//                           </span>
//                           <code className="flex-1 text-xs">{ep.url}</code>
//                           <span className={`px-2 py-0.5 text-xs rounded ${
//                             ep.canPost ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                           }`}>
//                             POST: {ep.canPost ? '✅' : '❌'}
//                           </span>
//                         </div>
//                       )
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Formulaire (inchangé sauf pour les boutons) */}
//             <section className="bg-white dark:bg-[#001F3F]/30 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm">
//               {error && (
//                 <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-200">
//                   <div className="flex items-center">
//                     <span className="material-symbols-outlined mr-2">error</span>
//                     <span className="whitespace-pre-line font-medium">{error}</span>
//                   </div>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* ... tous vos champs de formulaire existants ... */}
                
//                 {/* Boutons */}
//                 <div className="pt-4 flex flex-col sm:flex-row justify-end gap-4 border-t border-gray-200 dark:border-gray-700">
//                   <button
//                     type="button"
//                     onClick={() => navigate('/dashboard')}
//                     className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
//                     disabled={isUploading}
//                   >
//                     Annuler
//                   </button>
//                   <div className="flex gap-3">
//                     {!isEditing && (
//                       <button
//                         type="button"
//                         onClick={resetForm}
//                         className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
//                         disabled={isUploading}
//                       >
//                         Réinitialiser
//                       </button>
//                     )}
//                     <button
//                       type="submit"
//                       disabled={isUploading}
//                       className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-8 bg-[#E30613] text-white text-base font-bold hover:bg-[#E30613]/90 focus:outline-none focus:ring-2 focus:ring-[#E30613] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
//                     >
//                       {isUploading ? (
//                         <>
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                           <span>{isEditing ? 'Modification...' : 'Publication...'}</span>
//                         </>
//                       ) : (
//                         <>
//                           <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
//                             {isEditing ? 'save' : 'publish'}
//                           </span>
//                           <span>{isEditing ? 'Modifier le projet' : 'Publier mon projet'}</span>
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             </section>

//             {/* Guide de dépannage */}
//             <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
//               <div className="flex items-start gap-3">
//                 <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 mt-0.5">info</span>
//                 <div>
//                   <h3 className="text-yellow-800 dark:text-yellow-300 font-medium mb-1">
//                     Guide de dépannage
//                   </h3>
//                   <p className="text-yellow-700 dark:text-yellow-400 text-sm mb-2">
//                     Si vous avez des erreurs 405, vérifiez ces points :
//                   </p>
//                   <ol className="list-decimal list-inside text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
//                     <li>
//                       <strong>Vérifiez que Django tourne :</strong>{' '}
//                       <a href="http://localhost:8000/admin" target="_blank" className="text-blue-600 dark:text-blue-400 underline">
//                         http://localhost:8000/admin
//                       </a>
//                     </li>
//                     <li>
//                       <strong>Testez l'API manuellement :</strong>{' '}
//                       <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">curl http://localhost:8000/api/projects/</code>
//                     </li>
//                     <li>
//                       <strong>Vérifiez les permissions dans Django :</strong> 
//                       Assurez-vous que <code>IsAuthenticated</code> est dans les permissions
//                     </li>
//                     <li>
//                       <strong>Vérifiez les headers CORS :</strong>
//                       Assurez-vous que <code>corsheaders</code> est installé et configuré
//                     </li>
//                   </ol>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default UploadProject;



// src/pages/UploadProject.jsx - VERSION COMPLÈTE AVEC TOUTES LES FONCTIONNALITÉS
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { projectService } from '../services/projects';
import authService from '../services/auth';
import { useProjects } from '../context/ProjectContext';

const UploadProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    technologies: '',
    description: '',
    cohort: '',
    tags: '',
    github_url: '',
    demo_url: ''
  });
  const [file, setFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);
  const [user, setUser] = useState(null);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addProject, updateProject } = useProjects();

  const cohortsList = [
    'DWWM - Mars 2024',
    'CDA - Janvier 2024', 
    'AI Engineer - Mai 2024',
    'DWWM - Novembre 2023',
    'CDA - Septembre 2023'
  ];

  useEffect(() => {
    // Récupérer l'utilisateur connecté
    const currentUser = authService.getCurrentUser();
    console.log('👤 UTILISATEUR - Connecté:', currentUser);
    
    if (!currentUser) {
      console.log('⚠️ Aucun utilisateur connecté, redirection vers login');
      navigate('/login');
      return;
    }
    
    setUser(currentUser);
    
    // Pré-remplir la cohorte avec celle de l'utilisateur si disponible
    if (currentUser?.cohort) {
      setFormData(prev => ({
        ...prev,
        cohort: currentUser.cohort
      }));
    }

    // Vérifier si on est en mode édition
    const editId = searchParams.get('edit');
    if (editId) {
      loadProjectForEdit(editId);
    }
  }, [searchParams, navigate]);

  const loadProjectForEdit = async (projectId) => {
    try {
      console.log('📥 Chargement du projet pour édition:', projectId);
      const result = await projectService.getProjectDetails(projectId);
      
      if (result.success && result.data) {
        const project = result.data;
        
        setFormData({
          title: project.title || '',
          technologies: project.technologies || '',
          description: project.description || '',
          cohort: project.cohort || '',
          tags: project.tags || '',
          github_url: project.github_url || '',
          demo_url: project.demo_url || ''
        });
        setIsEditing(true);
        setEditProjectId(projectId);
        
        console.log('✅ Projet chargé pour édition:', project.title);
      } else {
        throw new Error(result.error || 'Projet non trouvé');
      }
    } catch (err) {
      console.error('❌ Erreur chargement projet:', err);
      setError('Erreur lors du chargement du projet');
      setTimeout(() => navigate('/dashboard'), 2000);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('Le fichier est trop volumineux. Taille maximum: 50MB');
      return;
    }
    
    if (!selectedFile.name.toLowerCase().endsWith('.zip')) {
      setError('Veuillez sélectionner un fichier ZIP');
      return;
    }

    setFile(selectedFile);
    setError('');
    console.log('📦 Fichier sélectionné:', selectedFile.name);
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('L\'image est trop volumineuse. Taille maximum: 5MB');
      return;
    }
    
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Format d\'image non supporté. Utilisez JPG, PNG ou GIF');
      return;
    }

    setImageFile(selectedFile);
    setError('');
    console.log('🖼️ Image sélectionnée:', selectedFile.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('🚀 Début de la soumission du projet');
    
    // Validation de base
    if (!formData.title.trim()) {
      setError('Veuillez saisir un nom pour votre projet');
      return;
    }

    if (!formData.technologies.trim()) {
      setError('Veuillez saisir les technologies utilisées');
      return;
    }

    if (!isEditing && !file) {
      setError('Veuillez sélectionner un fichier ZIP');
      return;
    }

    // Vérification de l'utilisateur connecté
    if (!user || !user.id) {
      setError('Vous devez être connecté pour créer ou modifier un projet');
      console.error('❌ Aucun utilisateur connecté');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Préparation des données
      const projectData = {
        title: formData.title.trim(),
        technologies: formData.technologies.trim(),
        description: formData.description.trim(),
        cohort: formData.cohort.trim(),
        tags: formData.tags.trim(),
        github_url: formData.github_url.trim(),
        demo_url: formData.demo_url.trim(),
        author: user.id
      };

      console.log('📋 Données du projet:', projectData);
      setUploadProgress(30);

      let project;

      if (isEditing) {
        // Mise à jour du projet existant
        console.log('✏️ Mise à jour du projet:', editProjectId);
        
        // Ajouter l'image si une nouvelle est fournie
        if (imageFile) {
          projectData.image = imageFile;
        }
        
        // Simuler progression
        setUploadProgress(60);
        
        // Appel API pour mise à jour
        const result = await projectService.updateProject(editProjectId, projectData);
        
        if (result.success) {
          project = result.data;
          updateProject(project);
        } else {
          throw new Error(result.error || 'Erreur lors de la mise à jour');
        }
        
        setUploadProgress(100);
        console.log('✅ Projet modifié avec succès:', project.title);
        
        // Redirection vers le succès
        setTimeout(() => {
          navigate('/project-success', { 
            state: { 
              project: project,
              isEditing: true
            } 
          });
        }, 500);

      } else {
        // Création d'un nouveau projet
        console.log('🆕 Création d\'un nouveau projet');
        
        // Ajouter les fichiers
        if (file) {
          projectData.zip_file = file;
        }
        if (imageFile) {
          projectData.image = imageFile;
        }
        
        setUploadProgress(50);
        
        // Appel API pour création
        const result = await projectService.createProject(projectData);
        
        if (result.success) {
          project = result.data;
        } else {
          throw new Error(result.error || 'Erreur lors de la création');
        }

        setUploadProgress(80);
        
        // Validation de l'ID reçu
        if (!project.id) {
          console.warn('⚠️ Aucun ID reçu après création, génération d\'un ID temporaire');
          project.id = `temp_${Date.now()}`;
        }
        
        // Ajouter au contexte global
        addProject(project);
        
        setUploadProgress(100);
        console.log('✅ Projet créé avec succès:', project.title);
        
        // Redirection vers le succès
        setTimeout(() => {
          navigate('/project-success', { 
            state: { 
              project: project,
              isEditing: false
            } 
          });
        }, 500);
      }

    } catch (err) {
      console.error('❌ Erreur lors de la soumission:', err);
      
      let errorMessage = `Erreur lors de ${isEditing ? 'la modification' : 'la création'} du projet`;
      
      if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setUploadProgress(0);
    } finally {
      if (!error) {
        setIsUploading(false);
      }
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      technologies: '',
      description: '',
      cohort: user?.cohort || '',
      tags: '',
      github_url: '',
      demo_url: ''
    });
    setFile(null);
    setImageFile(null);
    setError('');
    console.log('🔄 Formulaire réinitialisé');
  };

  const getUserAvatar = () => {
    if (user?.profile_picture) {
      return user.profile_picture;
    }
    if (user?.avatar) {
      return user.avatar;
    }
    return "https://lh3.googleusercontent.com/aida-public/A6AXuA8VxS_x8jwDh_tF-ygq2OirDNuL2iAY7iNaZiMUFP0ulnWyCKEm_PI1Gc0ciC2TN952cGudRb6wvbJbWPWVGo903BPnvhSXGPboDyDNJD8iZzXEJfiOfRe0gXFHiPnJlAg73UmjlUMXqsg7hI0ME57JNKDz_c82g19tlQb4FmCTdsxqi8jz0nMLTwlAIUvOj4x0iE62XhOCawgbKi0PPQiv7Cz6CfFpzMGaxuCg9bUKa62_BIjWKT5M4ZTd9MB-KOhIR0FHkzz25w";
  };

  const getUserFullName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user?.username) {
      return user.username;
    }
    if (user?.name) {
      return user.name;
    }
    return 'Utilisateur';
  };

  const getUserCohort = () => {
    return user?.cohort || 'Stagiaire Simplon';
  };

  // Si pas d'utilisateur, afficher un loader
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E30613] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 bg-[#001F3F] text-white flex flex-col p-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <img 
              src="/src/logo.png" 
              alt="Logo Simplon" 
              className="size-10 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/40";
              }}
            />
            <div className="flex flex-col">
              <h1 className="text-white text-base font-medium leading-normal">Simplon</h1>
              <p className="text-gray-400 text-sm font-normal leading-normal">Code Platform</p>
            </div>
          </div>
          
          <div className="flex flex-col justify-between flex-grow mt-6">
            <nav className="flex flex-col gap-2">
              <Link 
                to="/dashboard" 
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-white"
              >
                <span className="material-symbols-outlined">folder</span>
                <p className="text-sm font-medium">Mes projets</p>
              </Link>
              <Link 
                to="/upload" 
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary bg-[#003265]"
              >
                <span className="material-symbols-outlined">upload_file</span>
                <p className="text-sm font-medium">Déposer un projet</p>
              </Link>
              <Link 
                to="/explore" 
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10"
              >
                <span className="material-symbols-outlined">explore</span>
                <p className="text-sm font-medium">Explorer les projets</p>
              </Link>
            </nav>
            
            <div className="flex flex-col gap-1">
              <Link 
                to="/profile" 
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10"
              >
                <span className="material-symbols-outlined">person</span>
                <p className="text-sm font-medium leading-normal">Profil</p>
              </Link>

              <Link to="/parametre" className="flex items-center gap-3 rounded px-3 py-2 text-white/70 hover:bg-[#003265] hover:text-white">
                <span className="material-symbols-outlined">settings</span>
                <span>Paramètre</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-left"
              >
                <span className="material-symbols-outlined">logout</span>
                <p className="text-sm font-medium">Déconnexion</p>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-4xl mx-auto">
            
            {/* Header avec profil utilisateur */}
            <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
              <div>
                <h1 className="text-[#001F3F] text-3xl lg:text-4xl font-bold mb-2">
                  {isEditing ? 'Modifier le Projet' : 'Déposer un Projet'}
                </h1>
                <p className="text-gray-600">
                  {isEditing 
                    ? 'Modifiez les informations de votre projet existant' 
                    : 'Remplissez le formulaire ci-dessous pour partager votre création.'}
                </p>
              </div>
              
              {/* Profil de l'utilisateur connecté */}
              <div className="flex items-center gap-3">
                <div 
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 border-2 border-[#E30613]"
                  style={{ 
                    backgroundImage: `url(${getUserAvatar()})` 
                  }}
                  title={`Profil de ${getUserFullName()}`}
                ></div>
                <div className="flex flex-col text-right">
                  <h2 className="text-[#001F3F] text-base font-medium">
                    {getUserFullName()}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {getUserCohort()}
                  </p>
                </div>
              </div>
            </header>

            {/* Formulaire */}
            <section className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              {error && (
                <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <div className="flex items-center">
                    <span className="material-symbols-outlined mr-2">error</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Nom du projet */}
                <div>
                  <label className="text-sm font-medium text-[#001F3F]" htmlFor="title">
                    Nom du projet *
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Ex: Mon portfolio interactif, API de gestion de tâches..."
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white text-gray-800 focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors"
                    required
                    disabled={isUploading}
                  />
                </div>

                {/* Technologies utilisées */}
                <div>
                  <label className="text-sm font-medium text-[#001F3F]" htmlFor="technologies">
                    Technologies utilisées *
                  </label>
                  <input
                    id="technologies"
                    type="text"
                    placeholder="Ex: React, Node.js, MongoDB, Tailwind CSS..."
                    value={formData.technologies}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white text-gray-800 focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors"
                    required
                    disabled={isUploading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Séparez les technologies par des virgules
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-[#001F3F]" htmlFor="description">
                    Description détaillée
                  </label>
                  <textarea
                    id="description"
                    placeholder="Décrivez votre projet, ses fonctionnalités, les défis techniques..."
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white text-gray-800 focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors resize-none"
                    disabled={isUploading}
                  />
                </div>

                {/* Liens GitHub et Démo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-[#001F3F]" htmlFor="github_url">
                      Lien GitHub (optionnel)
                    </label>
                    <input
                      id="github_url"
                      type="url"
                      placeholder="https://github.com/votre-username/projet"
                      value={formData.github_url}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg border border-gray-300 bg-white text-gray-800 focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors"
                      disabled={isUploading}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-[#001F3F]" htmlFor="demo_url">
                      Lien de démo (optionnel)
                    </label>
                    <input
                      id="demo_url"
                      type="url"
                      placeholder="https://votre-projet.vercel.app"
                      value={formData.demo_url}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg border border-gray-300 bg-white text-gray-800 focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors"
                      disabled={isUploading}
                    />
                  </div>
                </div>

                {/* Cohorte et Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-[#001F3F]" htmlFor="cohort">
                      Cohorte / promotion
                    </label>
                    <select
                      id="cohort"
                      value={formData.cohort}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg border border-gray-300 bg-white text-gray-800 focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors"
                      disabled={isUploading}
                    >
                      <option value="">Sélectionnez votre cohorte</option>
                      {cohortsList.map(cohort => (
                        <option key={cohort} value={cohort}>{cohort}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-[#001F3F]" htmlFor="tags">
                      Tags ou mots-clés
                    </label>
                    <input
                      id="tags"
                      type="text"
                      placeholder="portfolio, api, data-visualisation, e-commerce"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg border border-gray-300 bg-white text-gray-800 focus:border-[#E30613] focus:ring-2 focus:ring-[#E30613]/20 p-3 transition-colors"
                      disabled={isUploading}
                    />
                  </div>
                </div>

                {/* Image du projet */}
                <div>
                  <label className="text-sm font-medium text-[#001F3F]">
                    Image du projet (optionnel)
                  </label>
                  <div className={`mt-1 flex justify-center rounded-lg border-2 border-dashed px-6 pt-5 pb-6 transition-all ${
                    imageFile 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 hover:border-[#E30613]/50'
                  }`}>
                    <div className="space-y-1 text-center">
                      <span className="material-symbols-outlined text-4xl text-gray-400">
                        {imageFile ? 'image' : 'add_photo_alternate'}
                      </span>
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer rounded-md font-medium text-[#E30613] hover:text-[#E30613]/80">
                          <span>{imageFile ? 'Changer l\'image' : 'Ajouter une image'}</span>
                          <input
                            className="sr-only"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={isUploading}
                          />
                        </label>
                        <p className="pl-1">{imageFile ? 'sélectionnée' : 'JPEG, PNG, GIF (max 5MB)'}</p>
                      </div>
                      {imageFile && (
                        <p className="text-xs text-green-600">
                          ✓ {imageFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Upload de fichier - seulement pour la création */}
                {!isEditing && (
                  <div>
                    <label className="text-sm font-medium text-[#001F3F]">
                      Fichier du projet (.zip) *
                    </label>
                    <div className={`mt-1 flex justify-center rounded-lg border-2 border-dashed px-6 pt-5 pb-6 transition-all ${
                      file 
                        ? 'border-[#E30613] bg-[#E30613]/5' 
                        : 'border-gray-300 hover:border-[#E30613]/50'
                    }`}>
                      <div className="space-y-1 text-center">
                        <span className="material-symbols-outlined text-4xl text-gray-400">
                          {file ? 'folder_zip' : 'cloud_upload'}
                        </span>
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer rounded-md font-medium text-[#E30613] hover:text-[#E30613]/80">
                            <span>{file ? 'Changer le fichier' : 'Télécharger un fichier'}</span>
                            <input
                              className="sr-only"
                              type="file"
                              accept=".zip"
                              onChange={handleFileChange}
                              disabled={isUploading}
                            />
                          </label>
                          <p className="pl-1">{file ? 'sélectionné' : 'ou glissez-déposez'}</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          Archive ZIP (max. 50MB)
                        </p>
                      </div>
                    </div>
                    
                    {/* Affichage du fichier sélectionné et progression */}
                    {file && (
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#E30613] text-base">description</span>
                            <p className="font-medium text-[#001F3F] truncate flex-1">
                              {file.name}
                            </p>
                          </div>
                          <p className={`text-sm ${
                            isUploading ? 'text-[#E30613]' : 'text-green-600'
                          }`}>
                            {isUploading ? '📤 Envoi...' : '✅ Prêt'}
                          </p>
                        </div>
                        {isUploading && (
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-[#E30613] h-2.5 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Boutons */}
                <div className="pt-4 flex flex-col sm:flex-row justify-end gap-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    disabled={isUploading}
                  >
                    Annuler
                  </button>
                  <div className="flex gap-3">
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        disabled={isUploading}
                      >
                        Réinitialiser
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-8 bg-[#E30613] text-white text-base font-bold hover:bg-[#E30613]/90 focus:outline-none focus:ring-2 focus:ring-[#E30613] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
                    >
                      {isUploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>{isEditing ? 'Modification...' : 'Publication...'}</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                            {isEditing ? 'save' : 'publish'}
                          </span>
                          <span>{isEditing ? 'Modifier le projet' : 'Déposer le projet'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UploadProject;