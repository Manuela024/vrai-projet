



// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { projectService } from '../services/projects';
// import { authService } from '../services/auth';

// const Profile = () => {
//   const [userStats, setUserStats] = useState({
//     projectsCount: 0,
//     totalDownloads: 0,
//     totalViews: 0,
//     userProjects: []
//   });
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showInfoModal, setShowInfoModal] = useState(false);
//   const [showBioModal, setShowBioModal] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [editingUser, setEditingUser] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     cohort: '',
//     bio: ''
//   });
//   const [savingInfo, setSavingInfo] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     loadUserData();
//     loadSavedProfilePicture();
//   }, []);

//   const loadSavedProfilePicture = () => {
//     const savedProfilePicture = localStorage.getItem('userProfilePicture');
//     const savedBio = localStorage.getItem('userBio');
    
//     if (savedProfilePicture) {
//       setImagePreview(savedProfilePicture);
//     }
    
//     if (savedBio) {
//       setEditingUser(prev => ({ ...prev, bio: savedBio }));
//     }
//   };

//   const parseTechnologies = (technologies) => {
//     if (!technologies) return [];
    
//     if (Array.isArray(technologies)) {
//       return technologies;
//     }
    
//     if (typeof technologies === 'string') {
//       return technologies.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0);
//     }
    
//     return [];
//   };

//   const loadUserData = async () => {
//     try {
//       const currentUser = authService.getCurrentUser();
//       setUser(currentUser);
      
//       const savedBio = localStorage.getItem('userBio');
      
//       if (currentUser) {
//         setEditingUser({
//           first_name: currentUser.first_name || '',
//           last_name: currentUser.last_name || '',
//           email: currentUser.email || '',
//           cohort: currentUser.cohort || '',
//           bio: savedBio || currentUser.bio || ''
//         });
//       }

//       const userProjects = await projectService.getUserProjects();
      
//       const projectsCount = userProjects.length;
//       const totalDownloads = userProjects.reduce((sum, project) => sum + (project.download_count || 0), 0);
//       const totalViews = userProjects.reduce((sum, project) => sum + (project.view_count || 0), 0);

//       const formattedProjects = userProjects.map(project => ({
//         ...project,
//         technologies: parseTechnologies(project.technologies)
//       }));

//       setUserStats({
//         projectsCount,
//         totalDownloads,
//         totalViews,
//         userProjects: formattedProjects.slice(0, 5)
//       });
//     } catch (error) {
//       console.error('Erreur lors du chargement des données:', error);
//       setUserStats({
//         projectsCount: 12,
//         totalDownloads: 142,
//         totalViews: 873,
//         userProjects: [
//           {
//             id: 1,
//             title: "Site E-commerce 'Innovashop'",
//             technologies: ["HTML", "CSS", "JavaScript"],
//             created_at: "2024-05-23",
//             download_count: 45,
//             view_count: 230
//           },
//           {
//             id: 2,
//             title: "App 'TaskMaster'",
//             technologies: ["React Native", "Firebase"],
//             created_at: "2024-04-15",
//             download_count: 32,
//             view_count: 187
//           }
//         ]
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImageSelect = (event) => {
//     const file = event.target.files[0];
    
//     if (file) {
//       if (!file.type.startsWith('image/')) {
//         alert('Veuillez sélectionner une image valide (JPEG, PNG, etc.)');
//         return;
//       }
      
//       if (file.size > 5 * 1024 * 1024) {
//         alert('L\'image est trop volumineuse. Taille maximale: 5MB');
//         return;
//       }
      
//       setSelectedImage(file);
      
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setImagePreview(e.target.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const saveProfilePicture = async () => {
//     if (!imagePreview) {
//       alert('Veuillez sélectionner une image');
//       return;
//     }

//     setUploading(true);
    
//     try {
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       localStorage.setItem('userProfilePicture', imagePreview);
      
//       setUser(prev => ({
//         ...prev,
//         profile_picture: imagePreview,
//         avatar: imagePreview
//       }));
      
//       alert('Photo de profil mise à jour avec succès!');
//       setShowEditModal(false);
//       setSelectedImage(null);
      
//     } catch (error) {
//       console.error('Erreur lors de la sauvegarde:', error);
//       alert('Erreur lors de la sauvegarde de la photo');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const resetProfilePicture = () => {
//     localStorage.removeItem('userProfilePicture');
//     setImagePreview(null);
//     setSelectedImage(null);
//     setUser(prev => ({
//       ...prev,
//       profile_picture: null,
//       avatar: null
//     }));
//     alert('Photo de profil réinitialisée');
//   };

//   const saveUserInfo = async () => {
//     setSavingInfo(true);
    
//     try {
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       const updatedUser = {
//         ...user,
//         ...editingUser
//       };
      
//       setUser(updatedUser);
      
//       if (editingUser.bio) {
//         localStorage.setItem('userBio', editingUser.bio);
//       }
      
//       alert('Informations mises à jour avec succès!');
//       setShowInfoModal(false);
      
//     } catch (error) {
//       console.error('Erreur lors de la sauvegarde:', error);
//       alert('Erreur lors de la mise à jour des informations');
//     } finally {
//       setSavingInfo(false);
//     }
//   };

//   const saveBio = async () => {
//     setSavingInfo(true);
    
//     try {
//       await new Promise(resolve => setTimeout(resolve, 800));
      
//       localStorage.setItem('userBio', editingUser.bio);
      
//       setUser(prev => ({
//         ...prev,
//         bio: editingUser.bio
//       }));
      
//       alert('Bio mise à jour avec succès!');
//       setShowBioModal(false);
      
//     } catch (error) {
//       console.error('Erreur lors de la sauvegarde:', error);
//       alert('Erreur lors de la mise à jour de la bio');
//     } finally {
//       setSavingInfo(false);
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setEditingUser(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleDeleteProject = async (projectId) => {
//     if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
//       return;
//     }

//     try {
//       await projectService.deleteProject(projectId);
//       loadUserData();
//     } catch (error) {
//       console.error('Erreur lors de la suppression:', error);
//       alert('Erreur lors de la suppression du projet');
//     }
//   };

//   const handleLogout = () => {
//     authService.logout();
//     navigate('/login');
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Date inconnue';
//     return new Date(dateString).toLocaleDateString('fr-FR');
//   };

//   const displayProfilePicture = imagePreview || user?.profile_picture || user?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOEWiUsTwO8WM7eKk9ihSrGB-yTnj6Oer1pTWTf_spAb7eV22RX0LZ1UPKdK02_ir9OQKkn8UyJmlDqQxkPJTiLDMtzFAooBHzRyfkt-Sd-kOGWZbn9ccGU4THtkk5AaCXc-z4SkYtd3sivd8r20LAIccUBtibXZ_A7paRHquHcmJf213-GbmYibvQg5l1uG5cGw7UfGO0xOi3aakHJGD9Q2TOoZkBSgguzhYUSkp0eFWQ5O-3rHqcGZBxV1iCxccixEJXXB1uloI';

//   if (loading) {
//     return (
//       <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
//         {/* Sidebar Skeleton */}
//         <aside className="hidden w-64 shrink-0 flex-col bg-[#001F3F] text-white md:flex">
//           <div className="flex h-16 shrink-0 items-center px-6">
//             <div className="flex items-center gap-3">
//               <div className="bg-gray-600 rounded-full size-10 animate-pulse"></div>
//               <div className="flex flex-col">
//                 <div className="h-4 bg-gray-600 rounded w-20 mb-1 animate-pulse"></div>
//                 <div className="h-3 bg-gray-600 rounded w-16 animate-pulse"></div>
//               </div>
//             </div>
//           </div>
//         </aside>

//         {/* Main Content Skeleton */}
//         <div className="flex flex-1 flex-col">
//           <main className="flex-grow p-8">
//             <div className="mx-auto max-w-6xl space-y-8">
//               {/* Profile Header Skeleton */}
//               <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-8 shadow-sm">
//                 <div className="flex items-center gap-6">
//                   <div className="bg-gray-300 rounded-full size-24 animate-pulse"></div>
//                   <div className="flex-1 space-y-4">
//                     <div className="h-6 bg-gray-300 rounded w-48 animate-pulse"></div>
//                     <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
//                     <div className="h-4 bg-gray-300 rounded w-64 animate-pulse"></div>
//                   </div>
//                 </div>
//               </div>

//               {/* Stats Skeleton */}
//               <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
//                 {[...Array(3)].map((_, i) => (
//                   <div key={i} className="bg-white dark:bg-[#1a2f44] rounded-xl p-6 shadow-sm">
//                     <div className="flex items-center gap-4">
//                       <div className="bg-gray-300 rounded-lg size-12 animate-pulse"></div>
//                       <div className="flex-1">
//                         <div className="h-4 bg-gray-300 rounded w-20 mb-2 animate-pulse"></div>
//                         <div className="h-8 bg-gray-300 rounded w-12 animate-pulse"></div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </main>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
//       {/* Sidebar */}
//       <aside className="hidden w-64 shrink-0 flex-col bg-[#001F3F] text-white md:flex">
//         <div className="flex h-16 shrink-0 items-center px-6 border-b border-[#003265]">
//           <div className="flex items-center gap-3">
//             {/* <div className="bg-white rounded-lg size-8 flex items-center justify-center">
//               <span className="material-symbols-outlined text-[#001F3F] text-lg">school</span>
//             </div> */}
//                            <img 
//   src="/src/logo.png" 
//   alt="Logo Simplon" 
//   className="size-10 rounded-full object-cover"
// />
//             <div className="flex flex-col">
//               <h1 className="text-white text-base font-semibold">Simplon</h1>
//               <p className="text-gray-400 text-xs">Code Platform</p>
//             </div>
//           </div>
//         </div>
        
//         <nav className="flex flex-1 flex-col justify-between p-4">
//           <div className="flex flex-col gap-1">
//             <Link to="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-white/80 hover:bg-[#003265] hover:text-white transition-colors">
//               <span className="material-symbols-outlined text-lg">folder</span>
//               <span className="text-sm font-medium">Mes projets</span>
//             </Link>
//             <Link to="/upload" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-white/80 hover:bg-[#003265] hover:text-white transition-colors">
//               <span className="material-symbols-outlined text-lg">upload_file</span>
//               <span className="text-sm font-medium">Déposer un projet</span>
//             </Link>
//             <Link to="/explore" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-white/80 hover:bg-[#003265] hover:text-white transition-colors">
//               <span className="material-symbols-outlined text-lg">explore</span>
//               <span className="text-sm font-medium">Explorer les projets</span>
//             </Link>
//           </div>
          
//           <div className="flex flex-col gap-1">
//             <Link to="/profile" className="flex items-center gap-3 rounded-lg bg-[#E30613] px-3 py-2.5 font-semibold text-white transition-colors">
//               <span className="material-symbols-outlined text-lg">person</span>
//               <span className="text-sm">Profil</span>
//             </Link>

//             <Link to="/parametre" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-white/80 hover:bg-[#003265] hover:text-white transition-colors">
//               <span className="material-symbols-outlined text-lg">settings</span>
//               <span className="text-sm">Paramètres</span>
//             </Link>
            
//             <button 
//               onClick={handleLogout}
//               className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-white/80 hover:bg-[#003265] hover:text-white transition-colors text-left"
//             >
//               <span className="material-symbols-outlined text-lg">logout</span>
//               <span className="text-sm">Déconnexion</span>
//             </button>
//           </div>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <div className="flex flex-1 flex-col">
//         {/* Header */}
//         <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-[#0d1a29]">
//           <h1 className="text-xl font-bold text-[#001F3F] dark:text-white">Profil</h1>
//           <div className="flex items-center gap-3">
//             <button className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors">
//               <span className="material-symbols-outlined text-xl">notifications</span>
//             </button>
//             <button 
//               onClick={() => setShowEditModal(true)}
//               className="h-9 w-9 rounded-full bg-cover bg-center bg-no-repeat ring-2 ring-white dark:ring-gray-800 hover:ring-[#E30613] transition-all cursor-pointer"
//               style={{ backgroundImage: `url(${displayProfilePicture})` }}
//               title="Modifier la photo"
//             />
//           </div>
//         </header>

//         {/* Profile Content */}
//         <main className="flex-grow p-6">
//           <div className="mx-auto max-w-6xl space-y-6">
            
//             {/* Profile Header Section */}
//             <section className="rounded-xl bg-white p-8 shadow-sm dark:bg-[#1a2f44]">
//               <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
//                 {/* Profile Picture */}
//                 <div className="relative group">
//                   <div 
//                     className="h-28 w-28 shrink-0 rounded-full bg-cover bg-center bg-no-repeat ring-4 ring-white dark:ring-gray-800 shadow-lg cursor-pointer transition-transform group-hover:scale-105"
//                     style={{ backgroundImage: `url(${displayProfilePicture})` }}
//                     onClick={() => setShowEditModal(true)}
//                     title="Modifier la photo"
//                   />
//                   <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
//                     <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity">
//                       photo_camera
//                     </span>
//                   </div>
//                 </div>
                
//                 {/* Profile Info */}
//                 <div className="flex-grow space-y-4 text-center sm:text-left">
//                   <div>
//                     <h2 className="text-2xl font-bold text-[#001F3F] dark:text-white">
//                       {user?.first_name && user?.last_name 
//                         ? `${user.first_name} ${user.last_name}`
//                         : user?.username || 'Jean Dupont'
//                       }
//                     </h2>
//                     <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
//                       <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 rounded-full text-sm font-medium">
//                         <span className="material-symbols-outlined text-sm">badge</span>
//                         {user?.username || '12345'}
//                       </span>
//                       <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 rounded-full text-sm font-medium">
//                         <span className="material-symbols-outlined text-sm">groups</span>
//                         {user?.cohort || 'Développeur Web'}
//                       </span>
//                     </div>
//                     <p className="text-gray-600 dark:text-gray-400 mt-3 flex items-center gap-2 justify-center sm:justify-start">
//                       <span className="material-symbols-outlined text-lg">mail</span>
//                       {user?.email || 'utilisateur@example.com'}
//                     </p>
//                   </div>

//                   {/* Bio Section */}
//                   <div className="max-w-2xl">
//                     <div className="flex items-center justify-between mb-3">
//                       <h3 className="font-semibold text-[#001F3F] dark:text-white flex items-center gap-2">
//                         <span className="material-symbols-outlined text-lg">description</span>
//                         Bio
//                       </h3>
//                       <button 
//                         onClick={() => setShowBioModal(true)}
//                         className="flex items-center gap-1 text-[#E30613] hover:text-[#E30613]/80 text-sm font-medium transition-colors"
//                       >
//                         <span className="material-symbols-outlined text-sm">edit</span>
//                         {editingUser.bio ? 'Modifier' : 'Ajouter'}
//                       </button>
//                     </div>
                    
//                     {editingUser.bio ? (
//                       <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-line bg-gray-50 dark:bg-[#0d1a29] rounded-lg p-4">
//                         {editingUser.bio}
//                       </p>
//                     ) : (
//                       <div className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
//                         <span className="material-symbols-outlined text-3xl text-gray-400 mb-2 inline-block">edit_note</span>
//                         <p className="text-gray-400 dark:text-gray-500 text-sm">
//                           Aucune bio pour le moment.
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
                
//                 {/* Edit Button */}
//                 <div className="flex gap-3 w-full sm:w-auto">
//                   <button 
//                     onClick={() => setShowInfoModal(true)}
//                     className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#E30613] px-6 text-sm font-semibold text-white hover:bg-[#E30613]/90 transition-colors shadow-sm w-full sm:w-auto"
//                   >
//                     <span className="material-symbols-outlined text-lg">edit</span>
//                     <span>Modifier le profil</span>
//                   </button>
//                 </div>
//               </div>
//             </section>

//             {/* Statistics Section */}
//             <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
//               <div className="flex items-center gap-6 rounded-xl bg-white p-6 shadow-sm dark:bg-[#1a2f44]">
//                 <div className="flex items-center justify-center w-14 h-14 bg-red-50 dark:bg-[#E30613]/10 rounded-xl">
//                   <span className="material-symbols-outlined text-2xl text-[#E30613]">folder_open</span>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Projets</p>
//                   <p className="text-3xl font-bold text-[#001F3F] dark:text-white">{userStats.projectsCount}</p>
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-6 rounded-xl bg-white p-6 shadow-sm dark:bg-[#1a2f44]">
//                 <div className="flex items-center justify-center w-14 h-14 bg-red-50 dark:bg-[#E30613]/10 rounded-xl">
//                   <span className="material-symbols-outlined text-2xl text-[#E30613]">download</span>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Téléchargements</p>
//                   <p className="text-3xl font-bold text-[#001F3F] dark:text-white">{userStats.totalDownloads}</p>
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-6 rounded-xl bg-white p-6 shadow-sm dark:bg-[#1a2f44]">
//                 <div className="flex items-center justify-center w-14 h-14 bg-red-50 dark:bg-[#E30613]/10 rounded-xl">
//                   <span className="material-symbols-outlined text-2xl text-[#E30613]">visibility</span>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Vues</p>
//                   <p className="text-3xl font-bold text-[#001F3F] dark:text-white">{userStats.totalViews}</p>
//                 </div>
//               </div>
//             </section>

//             {/* Projects Section */}
//             <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-[#1a2f44]">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl font-bold text-[#001F3F] dark:text-white flex items-center gap-2">
//                   <span className="material-symbols-outlined text-xl">folder</span>
//                   Mes Projets Récents
//                 </h2>
//                 <Link 
//                   to="/dashboard"
//                   className="flex items-center gap-2 text-[#E30613] hover:text-[#E30613]/80 text-sm font-medium transition-colors"
//                 >
//                   <span>Voir tous</span>
//                   <span className="material-symbols-outlined text-lg">arrow_forward</span>
//                 </Link>
//               </div>
              
//               {userStats.userProjects.length > 0 ? (
//                 <div className="space-y-4">
//                   {userStats.userProjects.map((project) => {
//                     const projectTechnologies = parseTechnologies(project.technologies);
                    
//                     return (
//                       <div key={project.id} className="flex flex-col gap-4 border border-gray-100 rounded-lg p-4 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors sm:flex-row sm:items-center sm:justify-between">
//                         <div className="flex-grow">
//                           <div className="flex items-start justify-between">
//                             <p className="font-semibold text-[#001F3F] dark:text-white">{project.title}</p>
//                             <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
//                               <span className="flex items-center gap-1">
//                                 <span className="material-symbols-outlined text-sm">visibility</span>
//                                 {project.view_count || 0}
//                               </span>
//                               <span className="flex items-center gap-1">
//                                 <span className="material-symbols-outlined text-sm">download</span>
//                                 {project.download_count || 0}
//                               </span>
//                             </div>
//                           </div>
//                           <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
//                             <span className="flex items-center gap-1">
//                               <span className="material-symbols-outlined text-sm">calendar_today</span>
//                               Déposé le {formatDate(project.created_at)}
//                             </span>
//                           </div>
//                           <div className="mt-3 flex flex-wrap gap-2">
//                             {projectTechnologies.slice(0, 4).map((tech, index) => (
//                               <span 
//                                 key={index}
//                                 className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
//                               >
//                                 {tech}
//                               </span>
//                             ))}
//                           </div>
//                         </div>
//                         <div className="flex gap-2">
//                           <Link 
//                             to={`/upload?edit=${project.id}`}
//                             className="flex h-9 items-center gap-2 rounded-lg bg-gray-100 px-3 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
//                           >
//                             <span className="material-symbols-outlined text-sm">edit</span>
//                             Modifier
//                           </Link>
//                           <button 
//                             onClick={() => handleDeleteProject(project.id)}
//                             className="flex h-9 items-center gap-2 rounded-lg bg-red-100 px-3 text-xs font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors"
//                           >
//                             <span className="material-symbols-outlined text-sm">delete</span>
//                             Supprimer
//                           </button>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 <div className="text-center py-12">
//                   <span className="material-symbols-outlined text-4xl text-gray-300 mb-4 inline-block">folder_off</span>
//                   <p className="text-gray-500 dark:text-gray-400 mb-4 font-medium">Aucun projet déposé</p>
//                   <Link 
//                     to="/upload"
//                     className="inline-flex items-center gap-2 text-[#E30613] hover:text-[#E30613]/80 text-sm font-medium transition-colors"
//                   >
//                     <span className="material-symbols-outlined text-lg">add</span>
//                     <span>Créer votre premier projet</span>
//                   </Link>
//                 </div>
//               )}
//             </section>
//           </div>
//         </main>
//       </div>

//       {/* Profile Picture Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//           <div className="bg-white dark:bg-[#1a2f44] rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-bold text-[#001F3F] dark:text-white">
//                 Photo de profil
//               </h3>
//               <button 
//                 onClick={() => setShowEditModal(false)}
//                 className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
//               >
//                 <span className="material-symbols-outlined text-xl">close</span>
//               </button>
//             </div>

//             <div className="flex flex-col items-center gap-6 mb-6">
//               <div 
//                 className="h-32 w-32 rounded-full bg-cover bg-center bg-no-repeat border-4 border-gray-200 dark:border-gray-600 shadow-lg"
//                 style={{ backgroundImage: `url(${imagePreview || displayProfilePicture})` }}
//               />
              
//               <label className="flex items-center gap-3 bg-[#E30613] text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-[#E30613]/90 transition-colors font-medium shadow-sm">
//                 <span className="material-symbols-outlined text-lg">photo_camera</span>
//                 <span>Changer la photo</span>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageSelect}
//                   className="hidden"
//                 />
//               </label>
//             </div>

//             <div className="flex gap-3 justify-end">
//               <button 
//                 onClick={() => setShowEditModal(false)}
//                 className="px-6 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
//               >
//                 Annuler
//               </button>
//               <button 
//                 onClick={saveProfilePicture}
//                 disabled={!imagePreview || uploading}
//                 className="flex items-center gap-2 bg-[#E30613] text-white px-6 py-2.5 rounded-lg hover:bg-[#E30613]/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm"
//               >
//                 {uploading ? (
//                   <>
//                     <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
//                     Enregistrement...
//                   </>
//                 ) : (
//                   'Enregistrer'
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Profile Info Modal */}
//       {showInfoModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//           <div className="bg-white dark:bg-[#1a2f44] rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-bold text-[#001F3F] dark:text-white">
//                 Modifier le profil
//               </h3>
//               <button 
//                 onClick={() => setShowInfoModal(false)}
//                 className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
//               >
//                 <span className="material-symbols-outlined text-xl">close</span>
//               </button>
//             </div>

//             <div className="space-y-4 mb-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Prénom
//                 </label>
//                 <input
//                   type="text"
//                   value={editingUser.first_name}
//                   onChange={(e) => handleInputChange('first_name', e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:border-gray-600 dark:text-white transition-colors"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Nom
//                 </label>
//                 <input
//                   type="text"
//                   value={editingUser.last_name}
//                   onChange={(e) => handleInputChange('last_name', e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:border-gray-600 dark:text-white transition-colors"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={editingUser.email}
//                   onChange={(e) => handleInputChange('email', e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:border-gray-600 dark:text-white transition-colors"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Cohorte
//                 </label>
//                 <input
//                   type="text"
//                   value={editingUser.cohort}
//                   onChange={(e) => handleInputChange('cohort', e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:border-gray-600 dark:text-white transition-colors"
//                 />
//               </div>
//             </div>

//             <div className="flex gap-3 justify-end">
//               <button 
//                 onClick={() => setShowInfoModal(false)}
//                 className="px-6 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
//               >
//                 Annuler
//               </button>
//               <button 
//                 onClick={saveUserInfo}
//                 disabled={savingInfo}
//                 className="flex items-center gap-2 bg-[#E30613] text-white px-6 py-2.5 rounded-lg hover:bg-[#E30613]/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm"
//               >
//                 {savingInfo ? (
//                   <>
//                     <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
//                     Enregistrement...
//                   </>
//                 ) : (
//                   'Enregistrer'
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Bio Modal */}
//       {showBioModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//           <div className="bg-white dark:bg-[#1a2f44] rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-bold text-[#001F3F] dark:text-white">
//                 {editingUser.bio ? 'Modifier la bio' : 'Ajouter une bio'}
//               </h3>
//               <button 
//                 onClick={() => setShowBioModal(false)}
//                 className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
//               >
//                 <span className="material-symbols-outlined text-xl">close</span>
//               </button>
//             </div>

//             <div className="mb-6">
//               <textarea
//                 value={editingUser.bio}
//                 onChange={(e) => handleInputChange('bio', e.target.value)}
//                 rows="4"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:border-gray-600 dark:text-white resize-none transition-colors"
//                 placeholder="Décrivez-vous en quelques mots..."
//                 maxLength="300"
//               />
//               <p className="text-xs text-gray-500 mt-2 text-right">
//                 {editingUser.bio.length}/300 caractères
//               </p>
//             </div>

//             <div className="flex gap-3 justify-end">
//               <button 
//                 onClick={() => setShowBioModal(false)}
//                 className="px-6 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
//               >
//                 Annuler
//               </button>
//               <button 
//                 onClick={saveBio}
//                 disabled={savingInfo}
//                 className="flex items-center gap-2 bg-[#E30613] text-white px-6 py-2.5 rounded-lg hover:bg-[#E30613]/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm"
//               >
//                 {savingInfo ? (
//                   <>
//                     <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
//                     Enregistrement...
//                   </>
//                 ) : (
//                   'Enregistrer'
//                 )}
//               </button> 
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Profile;


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectService } from '../services/projects';
import { authService } from '../services/auth';

const Profile = () => {
  const [userStats, setUserStats] = useState({
    projectsCount: 0,
    totalDownloads: 0,
    totalViews: 0,
    userProjects: []
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showBioModal, setShowBioModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingUser, setEditingUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    cohort: '',
    bio: ''
  });
  const [savingInfo, setSavingInfo] = useState(false);
  const navigate = useNavigate();

  // ✅ FONCTION UTILITAIRE CORRIGÉE POUR LES CLÉS UNIQUES
  const getUserStorageKey = (key) => {
    try {
      const currentUser = authService.getCurrentUser();
      
      // ✅ Convertir TOUT en string pour éviter l'erreur .replace()
      let userIdentifier = 'anonymous';
      
      if (currentUser) {
        if (currentUser.id) {
          userIdentifier = currentUser.id.toString();
        } else if (currentUser.email) {
          userIdentifier = currentUser.email;
        } else if (currentUser.username) {
          userIdentifier = currentUser.username;
        }
      }
      
      // ✅ Nettoyer l'identifiant pour les clés localStorage
      const cleanIdentifier = userIdentifier.replace(/[^a-zA-Z0-9]/g, '_');
      const storageKey = `${key}_${cleanIdentifier}`;
      
      console.log('🔑 Clé de stockage générée:', storageKey);
      return storageKey;
      
    } catch (error) {
      console.error('❌ Erreur dans getUserStorageKey:', error);
      return `${key}_anonymous`;
    }
  };

  useEffect(() => {
    loadUserData();
    loadSavedProfilePicture();
  }, []);

  const loadSavedProfilePicture = () => {
    const savedProfilePicture = localStorage.getItem(getUserStorageKey('userProfilePicture'));
    const savedBio = localStorage.getItem(getUserStorageKey('userBio'));
    
    console.log('📸 Chargement photo profil - Clé:', getUserStorageKey('userProfilePicture'));
    
    if (savedProfilePicture) {
      setImagePreview(savedProfilePicture);
    }
    
    if (savedBio) {
      setEditingUser(prev => ({ ...prev, bio: savedBio }));
    }
  };

  const parseTechnologies = (technologies) => {
    if (!technologies) return [];
    
    if (Array.isArray(technologies)) {
      return technologies;
    }
    
    if (typeof technologies === 'string') {
      return technologies.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0);
    }
    
    return [];
  };

  const loadUserData = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      
      const savedBio = localStorage.getItem(getUserStorageKey('userBio'));
      
      if (currentUser) {
        setEditingUser({
          first_name: currentUser.first_name || '',
          last_name: currentUser.last_name || '',
          email: currentUser.email || '',
          cohort: currentUser.cohort || '',
          bio: savedBio || currentUser.bio || ''
        });
      }

      const userProjects = await projectService.getUserProjects();
      
      const projectsCount = userProjects.length;
      const totalDownloads = userProjects.reduce((sum, project) => sum + (project.download_count || 0), 0);
      const totalViews = userProjects.reduce((sum, project) => sum + (project.view_count || 0), 0);

      const formattedProjects = userProjects.map(project => ({
        ...project,
        technologies: parseTechnologies(project.technologies)
      }));

      setUserStats({
        projectsCount,
        totalDownloads,
        totalViews,
        userProjects: formattedProjects.slice(0, 5)
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setUserStats({
        projectsCount: 12,
        totalDownloads: 142,
        totalViews: 873,
        userProjects: [
          {
            id: 1,
            title: "Site E-commerce 'Innovashop'",
            technologies: ["HTML", "CSS", "JavaScript"],
            created_at: "2024-05-23",
            download_count: 45,
            view_count: 230
          },
          {
            id: 2,
            title: "App 'TaskMaster'",
            technologies: ["React Native", "Firebase"],
            created_at: "2024-04-15",
            download_count: 32,
            view_count: 187
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image valide (JPEG, PNG, etc.)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image est trop volumineuse. Taille maximale: 5MB');
        return;
      }
      
      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfilePicture = async () => {
    if (!imagePreview) {
      alert('Veuillez sélectionner une image');
      return;
    }

    setUploading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // ✅ CORRECTION : Utilisation de clé unique par utilisateur
      localStorage.setItem(getUserStorageKey('userProfilePicture'), imagePreview);
      
      setUser(prev => ({
        ...prev,
        profile_picture: imagePreview,
        avatar: imagePreview
      }));
      
      alert('✅ Photo de profil mise à jour avec succès!');
      setShowEditModal(false);
      setSelectedImage(null);
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('❌ Erreur lors de la sauvegarde de la photo');
    } finally {
      setUploading(false);
    }
  };

  const resetProfilePicture = () => {
    // ✅ CORRECTION : Suppression avec clé unique
    localStorage.removeItem(getUserStorageKey('userProfilePicture'));
    setImagePreview(null);
    setSelectedImage(null);
    setUser(prev => ({
      ...prev,
      profile_picture: null,
      avatar: null
    }));
    alert('🔄 Photo de profil réinitialisée');
  };

  const saveUserInfo = async () => {
    setSavingInfo(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = {
        ...user,
        ...editingUser
      };
      
      setUser(updatedUser);
      
      if (editingUser.bio) {
        // ✅ CORRECTION : Sauvegarde avec clé unique
        localStorage.setItem(getUserStorageKey('userBio'), editingUser.bio);
      }
      
      alert('✅ Informations mises à jour avec succès!');
      setShowInfoModal(false);
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('❌ Erreur lors de la mise à jour des informations');
    } finally {
      setSavingInfo(false);
    }
  };

  const saveBio = async () => {
    setSavingInfo(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // ✅ CORRECTION : Sauvegarde avec clé unique
      localStorage.setItem(getUserStorageKey('userBio'), editingUser.bio);
      
      setUser(prev => ({
        ...prev,
        bio: editingUser.bio
      }));
      
      alert('✅ Bio mise à jour avec succès!');
      setShowBioModal(false);
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('❌ Erreur lors de la mise à jour de la bio');
    } finally {
      setSavingInfo(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditingUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      return;
    }

    try {
      await projectService.deleteProject(projectId);
      loadUserData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du projet');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // ✅ PHOTO DE PROFIL INDIVIDUELLE POUR CHAQUE UTILISATEUR
  const displayProfilePicture = imagePreview || user?.profile_picture || user?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOEWiUsTwO8WM7eKk9ihSrGB-yTnj6Oer1pTWTf_spAb7eV22RX0LZ1UPKdK02_ir9OQKkn8UyJmlDqQxkPJTiLDMtzFAooBHzRyfkt-Sd-kOGWZbn9ccGU4THtkk5AaCXc-z4SkYtd3sivd8r20LAIccUBtibXZ_A7paRHquHcmJf213-GbmYibvQg5l1uG5cGw7UfGO0xOi3aakHJGD9Q2TOoZkBSgguzhYUSkp0eFWQ5O-3rHqcGZBxV1iCxccixEJXXB1uloI';

  if (loading) {
    return (
      <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
        {/* Sidebar Skeleton */}
        <aside className="hidden w-64 shrink-0 flex-col bg-[#001F3F] text-white md:flex">
          <div className="flex h-16 shrink-0 items-center px-6">
            <div className="flex items-center gap-3">
              <div className="bg-gray-600 rounded-full size-10 animate-pulse"></div>
              <div className="flex flex-col">
                <div className="h-4 bg-gray-600 rounded w-20 mb-1 animate-pulse"></div>
                <div className="h-3 bg-gray-600 rounded w-16 animate-pulse"></div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <div className="flex flex-1 flex-col">
          <main className="flex-grow p-8">
            <div className="mx-auto max-w-6xl space-y-8">
              {/* Profile Header Skeleton */}
              <div className="bg-white dark:bg-[#1a2f44] rounded-xl p-8 shadow-sm">
                <div className="flex items-center gap-6">
                  <div className="bg-gray-300 rounded-full size-24 animate-pulse"></div>
                  <div className="flex-1 space-y-4">
                    <div className="h-6 bg-gray-300 rounded w-48 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-64 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Stats Skeleton */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-[#1a2f44] rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-300 rounded-lg size-12 animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded w-20 mb-2 animate-pulse"></div>
                        <div className="h-8 bg-gray-300 rounded w-12 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-[#001F3F] text-white md:flex">
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-[#003265]">
          <div className="flex items-center gap-3">
            <img 
              src="/src/logo.png" 
              alt="Logo Simplon" 
              className="size-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <h1 className="text-white text-base font-semibold">Simplon</h1>
              <p className="text-gray-400 text-xs">Code Platform</p>
            </div>
          </div>
        </div>
        
        <nav className="flex flex-1 flex-col justify-between p-4">
          <div className="flex flex-col gap-1">
            <Link to="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-white/80 hover:bg-[#003265] hover:text-white transition-colors">
              <span className="material-symbols-outlined text-lg">folder</span>
              <span className="text-sm font-medium">Mes projets</span>
            </Link>
            <Link to="/upload" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-white/80 hover:bg-[#003265] hover:text-white transition-colors">
              <span className="material-symbols-outlined text-lg">upload_file</span>
              <span className="text-sm font-medium">Déposer un projet</span>
            </Link>
            <Link to="/explore" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-white/80 hover:bg-[#003265] hover:text-white transition-colors">
              <span className="material-symbols-outlined text-lg">explore</span>
              <span className="text-sm font-medium">Explorer les projets</span>
            </Link>
          </div>
          
          <div className="flex flex-col gap-1">
            <Link to="/profile" className="flex items-center gap-3 rounded-lg bg-[#E30613] px-3 py-2.5 font-semibold text-white transition-colors">
              <span className="material-symbols-outlined text-lg">person</span>
              <span className="text-sm">Profil</span>
            </Link>

            <Link to="/parametre" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-white/80 hover:bg-[#003265] hover:text-white transition-colors">
              <span className="material-symbols-outlined text-lg">settings</span>
              <span className="text-sm">Paramètres</span>
            </Link>
            
            <button 
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-white/80 hover:bg-[#003265] hover:text-white transition-colors text-left"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              <span className="text-sm">Déconnexion</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-[#0d1a29]">
          <h1 className="text-xl font-bold text-[#001F3F] dark:text-white">Profil</h1>
          <div className="flex items-center gap-3">
            <button className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>
            <button 
              onClick={() => setShowEditModal(true)}
              className="h-9 w-9 rounded-full bg-cover bg-center bg-no-repeat ring-2 ring-white dark:ring-gray-800 hover:ring-[#E30613] transition-all cursor-pointer"
              style={{ backgroundImage: `url(${displayProfilePicture})` }}
              title="Modifier la photo de profil"
            />
          </div>
        </header>

        {/* Profile Content */}
        <main className="flex-grow p-6">
          <div className="mx-auto max-w-6xl space-y-6">
            
            {/* Profile Header Section */}
            <section className="rounded-xl bg-white p-8 shadow-sm dark:bg-[#1a2f44]">
              <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
                {/* Profile Picture */}
                <div className="relative group">
                  <div 
                    className="h-28 w-28 shrink-0 rounded-full bg-cover bg-center bg-no-repeat ring-4 ring-white dark:ring-gray-800 shadow-lg cursor-pointer transition-transform group-hover:scale-105"
                    style={{ backgroundImage: `url(${displayProfilePicture})` }}
                    onClick={() => setShowEditModal(true)}
                    title="Cliquez pour modifier votre photo de profil"
                  />
                  <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                    <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      photo_camera
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-[#E30613] text-white rounded-full p-1 shadow-lg">
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </div>
                </div>
                
                {/* Profile Info */}
                <div className="flex-grow space-y-4 text-center sm:text-left">
                  <div>
                    <h2 className="text-2xl font-bold text-[#001F3F] dark:text-white">
                      {user?.first_name && user?.last_name 
                        ? `${user.first_name} ${user.last_name}`
                        : user?.username || 'Utilisateur Simplon'
                      }
                    </h2>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 rounded-full text-sm font-medium">
                        <span className="material-symbols-outlined text-sm">badge</span>
                        {user?.username || user?.email?.split('@')[0] || 'utilisateur'}
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 rounded-full text-sm font-medium">
                        <span className="material-symbols-outlined text-sm">groups</span>
                        {user?.cohort || 'Développeur Web'}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-3 flex items-center gap-2 justify-center sm:justify-start">
                      <span className="material-symbols-outlined text-lg">mail</span>
                      {user?.email || 'utilisateur@simplon.com'}
                    </p>
                  </div>

                  {/* Bio Section */}
                  <div className="max-w-2xl">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-[#001F3F] dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">description</span>
                        Bio
                      </h3>
                      <button 
                        onClick={() => setShowBioModal(true)}
                        className="flex items-center gap-1 text-[#E30613] hover:text-[#E30613]/80 text-sm font-medium transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                        {editingUser.bio ? 'Modifier' : 'Ajouter une bio'}
                      </button>
                    </div>
                    
                    {editingUser.bio ? (
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-line bg-gray-50 dark:bg-[#0d1a29] rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        {editingUser.bio}
                      </p>
                    ) : (
                      <div 
                        className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-[#E30613] transition-colors"
                        onClick={() => setShowBioModal(true)}
                      >
                        <span className="material-symbols-outlined text-3xl text-gray-400 mb-2 inline-block">edit_note</span>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">
                          Cliquez pour ajouter une bio et vous présenter
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Edit Button */}
                <div className="flex gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => setShowEditModal(true)}
                    className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#E30613] px-6 text-sm font-semibold text-white hover:bg-[#E30613]/90 transition-colors shadow-sm w-full sm:w-auto"
                  >
                    <span className="material-symbols-outlined text-lg">photo_camera</span>
                    <span>Modifier la photo</span>
                  </button>
                  <button 
                    onClick={() => setShowInfoModal(true)}
                    className="flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm w-full sm:w-auto dark:border-gray-600 dark:bg-[#1a2f44] dark:text-white dark:hover:bg-[#253b52]"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                    <span>Modifier le profil</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Statistics Section */}
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="flex items-center gap-6 rounded-xl bg-white p-6 shadow-sm dark:bg-[#1a2f44] hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-14 h-14 bg-red-50 dark:bg-[#E30613]/10 rounded-xl">
                  <span className="material-symbols-outlined text-2xl text-[#E30613]">folder_open</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Projets créés</p>
                  <p className="text-3xl font-bold text-[#001F3F] dark:text-white">{userStats.projectsCount}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 rounded-xl bg-white p-6 shadow-sm dark:bg-[#1a2f44] hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-14 h-14 bg-red-50 dark:bg-[#E30613]/10 rounded-xl">
                  <span className="material-symbols-outlined text-2xl text-[#E30613]">download</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Téléchargements</p>
                  <p className="text-3xl font-bold text-[#001F3F] dark:text-white">{userStats.totalDownloads}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 rounded-xl bg-white p-6 shadow-sm dark:bg-[#1a2f44] hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-14 h-14 bg-red-50 dark:bg-[#E30613]/10 rounded-xl">
                  <span className="material-symbols-outlined text-2xl text-[#E30613]">visibility</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Vues totales</p>
                  <p className="text-3xl font-bold text-[#001F3F] dark:text-white">{userStats.totalViews}</p>
                </div>
              </div>
            </section>

            {/* Projects Section */}
            <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-[#1a2f44]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#001F3F] dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl">folder</span>
                  Mes Projets Récents
                </h2>
                <Link 
                  to="/dashboard"
                  className="flex items-center gap-2 text-[#E30613] hover:text-[#E30613]/80 text-sm font-medium transition-colors"
                >
                  <span>Voir tous mes projets</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
              </div>
              
              {userStats.userProjects.length > 0 ? (
                <div className="space-y-4">
                  {userStats.userProjects.map((project) => {
                    const projectTechnologies = parseTechnologies(project.technologies);
                    
                    return (
                      <div key={project.id} className="flex flex-col gap-4 border border-gray-100 rounded-lg p-4 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-grow">
                          <div className="flex items-start justify-between">
                            <p className="font-semibold text-[#001F3F] dark:text-white">{project.title}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">visibility</span>
                                {project.view_count || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">download</span>
                                {project.download_count || 0}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">calendar_today</span>
                              Déposé le {formatDate(project.created_at)}
                            </span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {projectTechnologies.slice(0, 4).map((tech, index) => (
                              <span 
                                key={index}
                                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link 
                            to={`/upload?edit=${project.id}`}
                            className="flex h-9 items-center gap-2 rounded-lg bg-gray-100 px-3 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                            Modifier
                          </Link>
                          <button 
                            onClick={() => handleDeleteProject(project.id)}
                            className="flex h-9 items-center gap-2 rounded-lg bg-red-100 px-3 text-xs font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                            Supprimer
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-4xl text-gray-300 mb-4 inline-block">folder_off</span>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 font-medium">Aucun projet déposé pour le moment</p>
                  <Link 
                    to="/upload"
                    className="inline-flex items-center gap-2 bg-[#E30613] text-white px-6 py-3 rounded-lg hover:bg-[#E30613]/90 transition-colors font-medium"
                  >
                    <span className="material-symbols-outlined text-lg">add</span>
                    <span>Créer votre premier projet</span>
                  </Link>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      {/* Profile Picture Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a2f44] rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#001F3F] dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">photo_camera</span>
                Photo de profil
              </h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="flex flex-col items-center gap-6 mb-6">
              <div 
                className="h-32 w-32 rounded-full bg-cover bg-center bg-no-repeat border-4 border-gray-200 dark:border-gray-600 shadow-lg"
                style={{ backgroundImage: `url(${imagePreview || displayProfilePicture})` }}
              />
              
              <div className="flex flex-col gap-3 w-full">
                <label className="flex items-center justify-center gap-3 bg-[#E30613] text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-[#E30613]/90 transition-colors font-medium shadow-sm">
                  <span className="material-symbols-outlined text-lg">photo_camera</span>
                  <span>Choisir une photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
                
                <p className="text-xs text-gray-500 text-center">
                  Formats supportés: JPG, PNG, GIF • Max: 5MB
                </p>
              </div>

              {/* Bouton réinitialiser */}
              {imagePreview && (
                <button 
                  onClick={resetProfilePicture}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Supprimer la photo
                </button>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowEditModal(false)}
                className="px-6 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={saveProfilePicture}
                disabled={!imagePreview || uploading}
                className="flex items-center gap-2 bg-[#E30613] text-white px-6 py-2.5 rounded-lg hover:bg-[#E30613]/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm"
              >
                {uploading ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">save</span>
                    Enregistrer la photo
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a2f44] rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#001F3F] dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">person</span>
                Modifier le profil
              </h3>
              <button 
                onClick={() => setShowInfoModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  value={editingUser.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:border-gray-600 dark:text-white transition-colors"
                  placeholder="Votre prénom"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  value={editingUser.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:border-gray-600 dark:text-white transition-colors"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:border-gray-600 dark:text-white transition-colors"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cohorte / Promotion
                </label>
                <input
                  type="text"
                  value={editingUser.cohort}
                  onChange={(e) => handleInputChange('cohort', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:border-gray-600 dark:text-white transition-colors"
                  placeholder="Ex: Développeur Web 2024"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowInfoModal(false)}
                className="px-6 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={saveUserInfo}
                disabled={savingInfo}
                className="flex items-center gap-2 bg-[#E30613] text-white px-6 py-2.5 rounded-lg hover:bg-[#E30613]/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm"
              >
                {savingInfo ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">save</span>
                    Enregistrer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bio Modal */}
      {showBioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a2f44] rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#001F3F] dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">description</span>
                {editingUser.bio ? 'Modifier la bio' : 'Ajouter une bio'}
              </h3>
              <button 
                onClick={() => setShowBioModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="mb-6">
              <textarea
                value={editingUser.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:border-gray-600 dark:text-white resize-none transition-colors"
                placeholder="Parlez de vous, de vos compétences, de vos passions... (300 caractères maximum)"
                maxLength="300"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  Décrivez-vous en quelques mots
                </p>
                <p className={`text-xs ${editingUser.bio.length >= 280 ? 'text-red-500' : 'text-gray-500'}`}>
                  {editingUser.bio.length}/300 caractères
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowBioModal(false)}
                className="px-6 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={saveBio}
                disabled={savingInfo}
                className="flex items-center gap-2 bg-[#E30613] text-white px-6 py-2.5 rounded-lg hover:bg-[#E30613]/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm"
              >
                {savingInfo ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">save</span>
                    Enregistrer la bio
                  </>
                )}
              </button> 
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;