// // src/components/admin/Profile.jsx - VERSION CORRIGÉE POUR BD
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { 
//   User, Mail, Phone, Camera, Save, Edit, X,
//   FolderOpen, Download, Eye, Github, Linkedin, Globe,
//   GraduationCap, CheckCircle, Bell, Lock, Trash2
// } from 'lucide-react';

// const Profile = () => {
//   // États principaux
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [activeTab, setActiveTab] = useState('profile');
//   const [uploadingImage, setUploadingImage] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showBioModal, setShowBioModal] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [message, setMessage] = useState({ text: '', type: '' });
//   const [userStats, setUserStats] = useState({
//     projectsCount: 0,
//     totalDownloads: 0,
//     totalViews: 0
//   });

//   const fileInputRef = useRef(null);
//   const API_BASE = 'http://localhost:8000/api/users';
//   const navigate = useNavigate();

//   // Données du formulaire
//   const [formData, setFormData] = useState({
//     // Données de base
//     first_name: '',
//     last_name: '',
//     email: '',
    
//     // Données étendues
//     phone: '',
//     bio: '',
//     location: '',
//     company: '',
//     position: '',
//     website: '',
//     github: '',
//     linkedin: '',
//     twitter: '',
//     cohort: '',
//     specialite: '',
//     date_entree: '',
//     date_sortie: '',
//   });

//   // ✅ Obtenir le token
//   const getToken = useCallback(() => {
//     const token = localStorage.getItem('access_token') || 
//                   localStorage.getItem('simplon_access_token') || 
//                   localStorage.getItem('authToken');
    
//     if (token && token !== 'undefined' && token !== 'null') {
//       return token;
//     }
//     return null;
//   }, []);

//   // ✅ Afficher un message
//   const showMessage = useCallback((text, type = 'info') => {
//     setMessage({ text, type });
//     setTimeout(() => setMessage({ text: '', type: '' }), 4000);
//   }, []);

//   // ✅ Charger toutes les données du profil
//   const loadProfile = useCallback(async () => {
//     const token = getToken();
    
//     try {
//       setLoading(true);
      
//       if (token) {
//         // Utiliser le nouvel endpoint qui retourne tout
//         const response = await axios.get(`${API_BASE}/profile/complete-data/`, {
//           headers: { 
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         const { base_profile, extended_profile } = response.data;
        
//         // Fusionner les données
//         const mergedData = {
//           ...base_profile,
//           ...extended_profile
//         };
        
//         setUser(mergedData);
        
//         // Mettre à jour le formulaire
//         setFormData({
//           // Données de base
//           first_name: base_profile?.first_name || '',
//           last_name: base_profile?.last_name || '',
//           email: base_profile?.email || '',
          
//           // Données étendues
//           phone: extended_profile?.phone || '',
//           bio: extended_profile?.bio || '',
//           location: extended_profile?.location || '',
//           company: extended_profile?.company || '',
//           position: extended_profile?.position || '',
//           website: extended_profile?.website || '',
//           github: extended_profile?.github || '',
//           linkedin: extended_profile?.linkedin || '',
//           twitter: extended_profile?.twitter || '',
//           cohort: extended_profile?.cohort || '',
//           specialite: extended_profile?.specialite || '',
//           date_entree: extended_profile?.date_entree || '',
//           date_sortie: extended_profile?.date_sortie || '',
//         });
        
//         showMessage('✅ Profil chargé depuis la base de données', 'success');
        
//         // Charger les statistiques
//         try {
//           const statsResponse = await axios.get(`${API_BASE}/stats/`, {
//             headers: { 
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             }
//           });
//           const stats = statsResponse.data;
//           setUserStats({
//             projectsCount: stats.projects?.total || 0,
//             totalDownloads: 234, // À remplacer par vos vraies données
//             totalViews: 1567    // À remplacer par vos vraies données
//           });
//         } catch (statsError) {
//           console.log('Stats non disponibles:', statsError);
//         }
        
//       } else {
//         // Mode démo si pas de token
//         loadDemoData();
//       }
//     } catch (error) {
//       console.error('Erreur chargement profil:', error);
      
//       // Essayer de charger séparément si l'endpoint complet échoue
//       if (error.response?.status === 404) {
//         await loadProfileSeparately();
//       } else {
//         showMessage('❌ Erreur lors du chargement du profil', 'error');
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [getToken, showMessage]);

//   // ✅ Charger les données séparément (fallback)
//   const loadProfileSeparately = async () => {
//     const token = getToken();
    
//     try {
//       // Charger le profil de base
//       const baseResponse = await axios.get(`${API_BASE}/profile/`, {
//         headers: { 
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       const baseData = baseResponse.data;
      
//       // Charger le profil étendu
//       const extendedResponse = await axios.get(`${API_BASE}/profile/extended/`, {
//         headers: { 
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       const extendedData = extendedResponse.data;
      
//       // Fusionner
//       setUser({
//         ...baseData,
//         ...extendedData
//       });
      
//       setFormData({
//         first_name: baseData.first_name || '',
//         last_name: baseData.last_name || '',
//         email: baseData.email || '',
//         phone: extendedData.phone || '',
//         bio: extendedData.bio || '',
//         github: extendedData.github || '',
//         linkedin: extendedData.linkedin || '',
//         website: extendedData.website || '',
//         cohort: extendedData.cohort || '',
//         specialite: extendedData.specialite || '',
//         date_entree: extendedData.date_entree || '',
//         date_sortie: extendedData.date_sortie || '',
//       });
      
//       showMessage('✅ Profil chargé (mode fallback)', 'success');
      
//     } catch (error) {
//       console.error('Erreur chargement fallback:', error);
//       loadDemoData();
//     }
//   };

//   // ✅ Charger les données de démo
//   const loadDemoData = useCallback(() => {
//     const demoUser = {
//       id: 1,
//       username: 'admin.simplon',
//       email: 'admin@simplon.com',
//       first_name: 'Admin',
//       last_name: 'System',
//       phone: '+33 1 23 45 67 89',
//       bio: 'Administrateur système de la plateforme Simplon. Passionné par le développement web et la gestion de projets.',
//       github: 'https://github.com/admin-simplon',
//       linkedin: 'https://linkedin.com/in/admin-simplon',
//       website: 'https://portfolio-admin.simplon.com',
//       cohort: 'Admin - 2024',
//       specialite: 'Administration Système & Développement',
//       date_entree: '2024-01-01',
//       date_sortie: '2024-12-31',
//       avatar_url: null,
//     };

//     setUser(demoUser);
//     setFormData({
//       first_name: demoUser.first_name,
//       last_name: demoUser.last_name,
//       email: demoUser.email,
//       phone: demoUser.phone,
//       bio: demoUser.bio,
//       github: demoUser.github,
//       linkedin: demoUser.linkedin,
//       website: demoUser.website,
//       cohort: demoUser.cohort,
//       specialite: demoUser.specialite,
//       date_entree: demoUser.date_entree,
//       date_sortie: demoUser.date_sortie,
//     });

//     // Statistiques de démo
//     setUserStats({
//       projectsCount: 15,
//       totalDownloads: 234,
//       totalViews: 1567
//     });

//     showMessage('⚠️ Mode démo activé - Connexion requise pour sauvegarder', 'warning');
//   }, [showMessage]);

//   // ✅ Sauvegarder le profil
//   const saveProfile = useCallback(async () => {
//     const token = getToken();
    
//     try {
//       setLoading(true);
      
//       if (token) {
//         // 1. Mettre à jour le profil de base
//         const baseData = {
//           first_name: formData.first_name,
//           last_name: formData.last_name,
//           email: formData.email,
//         };
        
//         await axios.patch(
//           `${API_BASE}/profile/`,
//           baseData,
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
        
//         // 2. Mettre à jour le profil étendu
//         const extendedData = {
//           phone: formData.phone || null,
//           bio: formData.bio || null,
//           location: formData.location || null,
//           company: formData.company || null,
//           position: formData.position || null,
//           website: formData.website || null,
//           github: formData.github || null,
//           linkedin: formData.linkedin || null,
//           twitter: formData.twitter || null,
//           cohort: formData.cohort || null,
//           specialite: formData.specialite || null,
//           date_entree: formData.date_entree || null,
//           date_sortie: formData.date_sortie || null,
//         };
        
//         // Filtrer les champs vides
//         const filteredData = Object.fromEntries(
//           Object.entries(extendedData).filter(([_, v]) => v !== null && v !== '')
//         );
        
//         await axios.patch(
//           `${API_BASE}/profile/extended/`,
//           filteredData,
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
        
//         showMessage('✅ Profil sauvegardé dans la base de données !', 'success');
//         loadProfile(); // Recharger pour avoir les données fraîches
//       } else {
//         showMessage('❌ Connectez-vous pour sauvegarder dans la base de données', 'error');
//       }
      
//       setEditMode(false);
//     } catch (error) {
//       console.error('Erreur sauvegarde:', error);
//       showMessage(`❌ Erreur: ${error.response?.data?.message || error.message}`, 'error');
//     } finally {
//       setLoading(false);
//     }
//   }, [formData, getToken, showMessage, loadProfile]);

//   // ✅ Uploader une photo de profil
//   const handleImageUpload = useCallback(async (file) => {
//     const token = getToken();
    
//     try {
//       setUploadingImage(true);
      
//       if (token) {
//         const uploadFormData = new FormData();
//         uploadFormData.append('avatar', file);
        
//         await axios.post(
//           `${API_BASE}/profile/avatar/`,
//           uploadFormData,
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'multipart/form-data'
//             }
//           }
//         );
        
//         showMessage('✅ Photo de profil sauvegardée dans la base de données !', 'success');
//         loadProfile(); // Recharger les données
//       } else {
//         showMessage('❌ Connectez-vous pour sauvegarder la photo', 'error');
//       }
//     } catch (error) {
//       console.error('Erreur upload:', error);
//       showMessage(`❌ Erreur: ${error.response?.data?.message || error.message}`, 'error');
//     } finally {
//       setUploadingImage(false);
//       setShowEditModal(false);
//     }
//   }, [getToken, showMessage, loadProfile]);

//   // ✅ Supprimer la photo de profil
//   const deleteProfilePicture = useCallback(async () => {
//     const token = getToken();
    
//     try {
//       if (token) {
//         await axios.delete(`${API_BASE}/profile/avatar/`, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
        
//         showMessage('✅ Photo de profil supprimée de la base de données', 'success');
//         loadProfile(); // Recharger les données
//       } else {
//         showMessage('❌ Connectez-vous pour supprimer la photo', 'error');
//       }
//     } catch (error) {
//       console.error('Erreur suppression:', error);
//       showMessage('❌ Erreur lors de la suppression', 'error');
//     }
//   }, [getToken, showMessage, loadProfile]);

//   // ✅ Gérer le changement d'input
//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   // ✅ Sélectionner une image
//   const handleImageSelect = (event) => {
//     const file = event.target.files[0];
    
//     if (file) {
//       if (!file.type.startsWith('image/')) {
//         showMessage('⚠️ Veuillez sélectionner une image valide (JPEG, PNG, etc.)', 'error');
//         return;
//       }
      
//       if (file.size > 5 * 1024 * 1024) {
//         showMessage('⚠️ L\'image est trop volumineuse. Taille maximale: 5MB', 'error');
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

//   // ✅ Sauvegarder la bio
//   const saveBio = async () => {
//     try {
//       setLoading(true);
//       await saveProfile();
//       setShowBioModal(false);
//     } catch (error) {
//       console.error('Erreur sauvegarde bio:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Rafraîchir les données
//   const refreshStats = () => {
//     loadProfile();
//     showMessage('🔄 Données rafraîchies', 'info');
//   };

//   // ✅ Effet initial
//   useEffect(() => {
//     loadProfile();
//   }, [loadProfile]);

//   // ✅ Photo de profil à afficher
//   const displayProfilePicture = imagePreview || user?.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOEWiUsTwO8WM7eKk9ihSrGB-yTnj6Oer1pTWTf_spAb7eV22RX0LZ1UPKdK02_ir9OQKkn8UyJmlDqQxkPJTiLDMtzFAooBHzRyfkt-Sd-kOGWZbn9ccGU4THtkk5AaCXc-z4SkYtd3sivd8r20LAIccUBtibXZ_A7paRHquHcmJf213-GbmYibvQg5l1uG5cGw7UfGO0xOi3aakHJGD9Q2TOoZkBSgguzhYUSkp0eFWQ5O-3rHqcGZBxV1iCxccixEJXXB1uloI';

//   if (loading && !user) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E30613] mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Chargement du profil depuis la base de données...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
//       <main className="p-6">
//         <div className="mx-auto max-w-6xl space-y-6">
          
//           {/* Profile Header Section */}
//           <section className="rounded-xl bg-white p-8 shadow-sm dark:bg-[#1a2f44]">
//             <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
//               {/* Profile Picture */}
//               <div className="relative group">
//                 <div 
//                   className="h-28 w-28 shrink-0 rounded-full bg-cover bg-center bg-no-repeat ring-4 ring-white dark:ring-gray-800 shadow-lg cursor-pointer transition-transform group-hover:scale-105"
//                   style={{ backgroundImage: `url(${displayProfilePicture})` }}
//                   onClick={() => setShowEditModal(true)}
//                   title="Cliquez pour modifier votre photo de profil"
//                 />
//                 <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
//                   <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
//                 </div>
//                 <div className="absolute -bottom-2 -right-2 bg-[#E30613] text-white rounded-full p-2 shadow-lg">
//                   <Edit size={14} />
//                 </div>
//               </div>
              
//               {/* Profile Info */}
//               <div className="flex-grow space-y-4 text-center sm:text-left">
//                 <div>
//                   <h2 className="text-2xl font-bold text-[#001F3F] dark:text-white">
//                     {formData.first_name} {formData.last_name}
//                   </h2>
//                   <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
//                     <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 rounded-full text-sm font-medium">
//                       <User size={14} />
//                       {user?.username || 'utilisateur'}
//                     </span>
//                     {formData.cohort && (
//                       <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 rounded-full text-sm font-medium">
//                         <GraduationCap size={14} />
//                         {formData.cohort}
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-gray-600 dark:text-gray-400 mt-3 flex items-center gap-2 justify-center sm:justify-start">
//                     <Mail size={18} />
//                     {formData.email}
//                   </p>
//                   {formData.phone && (
//                     <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2 justify-center sm:justify-start">
//                       <Phone size={18} />
//                       {formData.phone}
//                     </p>
//                   )}
//                 </div>

//                 {/* Bio Section */}
//                 <div className="max-w-2xl">
//                   <div className="flex items-center justify-between mb-3">
//                     <h3 className="font-semibold text-[#001F3F] dark:text-white flex items-center gap-2">
//                       <span className="material-symbols-outlined text-lg">description</span>
//                       Bio
//                     </h3>
//                     <button 
//                       onClick={() => setShowBioModal(true)}
//                       className="flex items-center gap-1 text-[#E30613] hover:text-[#E30613]/80 text-sm font-medium transition-colors"
//                     >
//                       <Edit size={14} />
//                       {formData.bio ? 'Modifier' : 'Ajouter une bio'}
//                     </button>
//                   </div>
                  
//                   {formData.bio ? (
//                     <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-line bg-gray-50 dark:bg-[#0d1a29] rounded-lg p-4 border border-gray-200 dark:border-gray-700">
//                       {formData.bio}
//                     </p>
//                   ) : (
//                     <div 
//                       className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-[#E30613] transition-colors"
//                       onClick={() => setShowBioModal(true)}
//                     >
//                       <Edit size={32} className="text-gray-400 mb-2 mx-auto" />
//                       <p className="text-gray-400 dark:text-gray-500 text-sm">
//                         Cliquez pour ajouter une bio et vous présenter
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
              
//               {/* Edit Buttons */}
//               <div className="flex gap-3 w-full sm:w-auto">
//                 <button 
//                   onClick={() => setShowEditModal(true)}
//                   className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#E30613] px-6 text-sm font-semibold text-white hover:bg-[#E30613]/90 transition-colors shadow-sm w-full sm:w-auto"
//                 >
//                   <Camera size={18} />
//                   <span>Modifier la photo</span>
//                 </button>
//                 <button 
//                   onClick={() => setEditMode(true)}
//                   className="flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm w-full sm:w-auto dark:border-gray-600 dark:bg-[#1a2f44] dark:text-white dark:hover:bg-[#253b52]"
//                 >
//                   <Edit size={18} />
//                   <span>Modifier le profil</span>
//                 </button>
//               </div>
//             </div>
//           </section>

//           {/* Statistics Section */}
//           <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
//             {/* Projets créés */}
//             <div className="flex items-center gap-6 rounded-xl bg-white p-6 shadow-sm dark:bg-[#1a2f44] hover:shadow-md transition-shadow">
//               <div className="flex items-center justify-center w-14 h-14 bg-red-50 dark:bg-[#E30613]/10 rounded-xl">
//                 <FolderOpen className="text-2xl text-[#E30613]" />
//               </div>
//               <div>
//                 <div className="flex items-center gap-2">
//                   <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Projets gérés</p>
//                   <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 rounded-full">
//                     total
//                   </span>
//                 </div>
//                 <p className="text-3xl font-bold text-[#001F3F] dark:text-white">
//                   {userStats.projectsCount.toLocaleString()}
//                 </p>
//                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                   Projets dans la base de données
//                 </p>
//               </div>
//             </div>
            
//             {/* Téléchargements */}
//             <div className="flex items-center gap-6 rounded-xl bg-white p-6 shadow-sm dark:bg-[#1a2f44] hover:shadow-md transition-shadow">
//               <div className="flex items-center justify-center w-14 h-14 bg-red-50 dark:bg-[#E30613]/10 rounded-xl">
//                 <Download className="text-2xl text-[#E30613]" />
//               </div>
//               <div>
//                 <div className="flex items-center gap-2">
//                   <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Statut</p>
//                   <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 rounded-full">
//                     {user ? 'Connecté' : 'Démo'}
//                   </span>
//                 </div>
//                 <p className="text-3xl font-bold text-[#001F3F] dark:text-white">
//                   {getToken() ? '✅' : '⚠️'}
//                 </p>
//                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                   {getToken() ? 'Connecté à la BD' : 'Mode démo activé'}
//                 </p>
//               </div>
//             </div>
            
//             {/* Vues totales */}
//             <div className="flex items-center gap-6 rounded-xl bg-white p-6 shadow-sm dark:bg-[#1a2f44] hover:shadow-md transition-shadow">
//               <div className="flex items-center justify-center w-14 h-14 bg-red-50 dark:bg-[#E30613]/10 rounded-xl">
//                 <Eye className="text-2xl text-[#E30613]" />
//               </div>
//               <div>
//                 <div className="flex items-center gap-2">
//                   <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Données</p>
//                   <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 rounded-full">
//                     {user ? 'BD Active' : 'Démo'}
//                   </span>
//                 </div>
//                 <p className="text-3xl font-bold text-[#001F3F] dark:text-white">
//                   💾
//                 </p>
//                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                   {getToken() ? 'Sauvegarde active' : 'Sauvegarde désactivée'}
//                 </p>
//               </div>
//             </div>
//           </section>

//           {/* Navigation des onglets */}
//           <div className="bg-white rounded-xl shadow-lg p-2 border border-gray-200 dark:bg-[#1a2f44] dark:border-gray-700">
//             <div className="flex flex-wrap gap-2">
//               <button
//                 onClick={() => setActiveTab('profile')}
//                 className={`flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-300 font-medium ${
//                   activeTab === 'profile'
//                     ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
//                     : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200'
//                 }`}
//               >
//                 <User size={20} />
//                 <span>Profil</span>
//               </button>
              
//               <button
//                 onClick={() => setActiveTab('security')}
//                 className={`flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-300 font-medium ${
//                   activeTab === 'security'
//                     ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
//                     : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200'
//                 }`}
//               >
//                 <Lock size={20} />
//                 <span>Sécurité</span>
//               </button>
              
//               <button
//                 onClick={() => setActiveTab('notifications')}
//                 className={`flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-300 font-medium ${
//                   activeTab === 'notifications'
//                     ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
//                     : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200'
//                 }`}
//               >
//                 <Bell size={20} />
//                 <span>Notifications</span>
//               </button>
//             </div>
//           </div>

//           {/* Contenu des onglets - Profile */}
//           {activeTab === 'profile' && (
//             <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 dark:bg-[#1a2f44] dark:border-gray-700">
//               <div className="flex items-center justify-between mb-8">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Informations personnelles</h2>
//                   <p className="text-gray-600 dark:text-gray-400 mt-1">
//                     {getToken() ? 'Vos données sont sauvegardées dans la base de données' : 'Mode démo - Connectez-vous pour sauvegarder'}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
//                   <div className={`w-2 h-2 rounded-full ${editMode ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
//                   {editMode ? 'Mode édition' : 'Mode consultation'}
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* Section informations de base */}
//                 <div className="space-y-6">
//                   <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 dark:from-blue-900/10 dark:to-indigo-900/10 dark:border-blue-800/20">
//                     <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
//                       <div className="p-2 bg-white dark:bg-[#0d1a29] rounded-lg shadow-sm">
//                         <User size={20} className="text-blue-600 dark:text-blue-400" />
//                       </div>
//                       Informations de base
//                     </h3>
                    
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Prénom
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.first_name}
//                           onChange={(e) => handleInputChange('first_name', e.target.value)}
//                           disabled={!editMode}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="Votre prénom"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Nom
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.last_name}
//                           onChange={(e) => handleInputChange('last_name', e.target.value)}
//                           disabled={!editMode}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="Votre nom"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Email
//                         </label>
//                         <input
//                           type="email"
//                           value={formData.email}
//                           onChange={(e) => handleInputChange('email', e.target.value)}
//                           disabled={!editMode}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="votre@email.com"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Téléphone
//                         </label>
//                         <input
//                           type="tel"
//                           value={formData.phone}
//                           onChange={(e) => handleInputChange('phone', e.target.value)}
//                           disabled={!editMode}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="+33 1 23 45 67 89"
//                         />
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Section informations supplémentaires */}
//                   <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 dark:from-purple-900/10 dark:to-pink-900/10 dark:border-purple-800/20">
//                     <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Informations supplémentaires</h3>
                    
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Localisation
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.location}
//                           onChange={(e) => handleInputChange('location', e.target.value)}
//                           disabled={!editMode}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="Ville, Pays"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Entreprise
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.company}
//                           onChange={(e) => handleInputChange('company', e.target.value)}
//                           disabled={!editMode}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="Nom de l'entreprise"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Poste
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.position}
//                           onChange={(e) => handleInputChange('position', e.target.value)}
//                           disabled={!editMode}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="Votre poste"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Section informations Simplon et liens */}
//                 <div className="space-y-6">
//                   <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 dark:from-green-900/10 dark:to-emerald-900/10 dark:border-green-800/20">
//                     <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
//                       <div className="p-2 bg-white dark:bg-[#0d1a29] rounded-lg shadow-sm">
//                         <GraduationCap size={20} className="text-green-600 dark:text-green-400" />
//                       </div>
//                       Informations Simplon
//                     </h3>
                    
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Promotion
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.cohort}
//                           onChange={(e) => handleInputChange('cohort', e.target.value)}
//                           disabled={!editMode}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="Ex: Admin 2024"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Spécialité
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.specialite}
//                           onChange={(e) => handleInputChange('specialite', e.target.value)}
//                           disabled={!editMode}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="Ex: Administration Système"
//                         />
//                       </div>
                      
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                             Date d'entrée
//                           </label>
//                           <input
//                             type="date"
//                             value={formData.date_entree}
//                             onChange={(e) => handleInputChange('date_entree', e.target.value)}
//                             disabled={!editMode}
//                             className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           />
//                         </div>
                        
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                             Date de sortie
//                           </label>
//                           <input
//                             type="date"
//                             value={formData.date_sortie}
//                             onChange={(e) => handleInputChange('date_sortie', e.target.value)}
//                             disabled={!editMode}
//                             className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Section liens */}
//                   <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100 dark:from-orange-900/10 dark:to-amber-900/10 dark:border-orange-800/20">
//                     <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Liens professionnels</h3>
                    
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
//                           <Github size={18} className="text-gray-700 dark:text-gray-300" />
//                           GitHub
//                         </label>
//                         <input
//                           type="url"
//                           value={formData.github}
//                           onChange={(e) => handleInputChange('github', e.target.value)}
//                           disabled={!editMode}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 dark:focus:ring-gray-400 dark:focus:border-gray-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="https://github.com/votre-username"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
//                           <Linkedin size={18} className="text-blue-600 dark:text-blue-400" />
//                           LinkedIn
//                         </label>
//                         <input
//                           type="url"
//                           value={formData.linkedin}
//                           onChange={(e) => handleInputChange('linkedin', e.target.value)}
//                           disabled={!editMode}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="https://linkedin.com/in/votre-profile"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
//                           <Globe size={18} className="text-green-600 dark:text-green-400" />
//                           Portfolio / Site web
//                         </label>
//                         <input
//                           type="url"
//                           value={formData.website}
//                           onChange={(e) => handleInputChange('website', e.target.value)}
//                           disabled={!editMode}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="https://votre-portfolio.com"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Boutons d'action pour la section profil */}
//               {editMode && (
//                 <div className="flex gap-3 justify-end mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
//                   <button
//                     onClick={() => {
//                       setEditMode(false);
//                       loadProfile();
//                     }}
//                     className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg font-medium"
//                   >
//                     <X size={20} />
//                     Annuler
//                   </button>
                  
//                   <button
//                     onClick={saveProfile}
//                     disabled={loading}
//                     className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-500 transition-all duration-300 shadow-lg hover:shadow-xl font-medium disabled:opacity-50"
//                   >
//                     {loading ? (
//                       <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
//                     ) : (
//                       <Save size={20} />
//                     )}
//                     {getToken() ? 'Sauvegarder dans la BD' : 'Sauvegarder (démo)'}
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Sections Sécurité et Notifications restent similaires */}
          
//         </div>
//       </main>

//       {/* Modals */}
      
//       {/* Profile Picture Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//           <div className="bg-white dark:bg-[#1a2f44] rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-bold text-[#001F3F] dark:text-white flex items-center gap-2">
//                 <Camera size={20} />
//                 Photo de profil
//               </h3>
//               <button 
//                 onClick={() => setShowEditModal(false)}
//                 className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             <div className="flex flex-col items-center gap-6 mb-6">
//               <div 
//                 className="h-32 w-32 rounded-full bg-cover bg-center bg-no-repeat border-4 border-gray-200 dark:border-gray-600 shadow-lg"
//                 style={{ backgroundImage: `url(${imagePreview || displayProfilePicture})` }}
//               />
              
//               <div className="flex flex-col gap-3 w-full">
//                 <label className="flex items-center justify-center gap-3 bg-[#E30613] text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-[#E30613]/90 transition-colors font-medium shadow-sm">
//                   <Camera size={20} />
//                   <span>Choisir une photo</span>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageSelect}
//                     className="hidden"
//                   />
//                 </label>
                
//                 <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
//                   Formats supportés: JPG, PNG, GIF • Max: 5MB
//                 </p>
//               </div>

//               {/* Bouton réinitialiser */}
//               {displayProfilePicture && !displayProfilePicture.includes('googleusercontent.com') && (
//                 <button 
//                   onClick={deleteProfilePicture}
//                   className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
//                 >
//                   <Trash2 size={16} />
//                   Supprimer la photo
//                 </button>
//               )}
//             </div>

//             <div className="flex gap-3 justify-end">
//               <button 
//                 onClick={() => setShowEditModal(false)}
//                 className="px-6 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
//               >
//                 Annuler
//               </button>
//               <button 
//                 onClick={() => {
//                   if (selectedImage) {
//                     handleImageUpload(selectedImage);
//                   } else {
//                     setShowEditModal(false);
//                   }
//                 }}
//                 disabled={uploadingImage}
//                 className="flex items-center gap-2 bg-[#E30613] text-white px-6 py-2.5 rounded-lg hover:bg-[#E30613]/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm"
//               >
//                 {uploadingImage ? (
//                   <>
//                     <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
//                     Enregistrement...
//                   </>
//                 ) : (
//                   <>
//                     <Save size={20} />
//                     {getToken() ? 'Enregistrer dans la BD' : 'Enregistrer (démo)'}
//                   </>
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
//               <h3 className="text-lg font-bold text-[#001F3F] dark:text-white flex items-center gap-2">
//                 <Edit size={20} />
//                 {formData.bio ? 'Modifier la bio' : 'Ajouter une bio'}
//               </h3>
//               <button 
//                 onClick={() => setShowBioModal(false)}
//                 className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             <div className="mb-6">
//               <textarea
//                 value={formData.bio}
//                 onChange={(e) => handleInputChange('bio', e.target.value)}
//                 rows="6"
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white resize-none transition-colors"
//                 placeholder="Parlez de vous, de vos compétences, de vos passions... (300 caractères maximum)"
//                 maxLength="300"
//               />
//               <div className="flex justify-between items-center mt-2">
//                 <p className="text-xs text-gray-500 dark:text-gray-400">
//                   Décrivez-vous en quelques mots
//                 </p>
//                 <p className={`text-xs ${formData.bio.length >= 280 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
//                   {formData.bio.length}/300 caractères
//                 </p>
//               </div>
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
//                 disabled={loading}
//                 className="flex items-center gap-2 bg-[#E30613] text-white px-6 py-2.5 rounded-lg hover:bg-[#E30613]/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm"
//               >
//                 {loading ? (
//                   <>
//                     <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
//                     Enregistrement...
//                   </>
//                 ) : (
//                   <>
//                     <Save size={20} />
//                     Enregistrer
//                   </>
//                 )}
//               </button> 
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Message Toast */}
//       {message.text && (
//         <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl max-w-sm ${
//           message.type === 'success' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-800 dark:text-green-300' :
//           message.type === 'error' ? 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 text-red-800 dark:from-red-900/20 dark:to-orange-900/20 dark:border-red-800 dark:text-red-300' :
//           message.type === 'warning' ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 text-yellow-800 dark:from-yellow-900/20 dark:to-amber-900/20 dark:border-yellow-800 dark:text-yellow-300' :
//           'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 text-blue-800 dark:from-blue-900/20 dark:to-cyan-900/20 dark:border-blue-800 dark:text-blue-300'
//         }`}>
//           <div className="flex items-center gap-3">
//             {message.type === 'success' ? (
//               <CheckCircle size={24} className="flex-shrink-0" />
//             ) : message.type === 'error' ? (
//               <X size={24} className="flex-shrink-0" />
//             ) : (
//               <Bell size={24} className="flex-shrink-0" />
//             )}
//             <div className="flex-1">
//               <p className="font-medium">{message.text}</p>
//             </div>
//             <button
//               onClick={() => setMessage({ text: '', type: '' })}
//               className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
//             >
//               <X size={20} />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Profile;

// // src/components/admin/Profile.jsx - VERSION CORRIGÉE POUR BD
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { 
//   User, Mail, Phone, Camera, Save, Edit, X,
//   FolderOpen, Download, Eye, Github, Linkedin, Globe,
//   GraduationCap, CheckCircle, Bell, Lock, Trash2
// } from 'lucide-react';

// const Profile = () => {
//   // États principaux
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [activeTab, setActiveTab] = useState('profile');
//   const [uploadingImage, setUploadingImage] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showBioModal, setShowBioModal] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [message, setMessage] = useState({ text: '', type: '' });
//   const [userStats, setUserStats] = useState({
//     projectsCount: 0,
//     totalDownloads: 0,
//     totalViews: 0
//   });

//   const fileInputRef = useRef(null);
//   const API_BASE = 'http://localhost:8000/api'; // URL de base
//   const navigate = useNavigate();

//   // Données du formulaire
//   const [formData, setFormData] = useState({
//     // Données de base
//     first_name: '',
//     last_name: '',
//     email: '',
    
//     // Données étendues
//     phone: '',
//     bio: '',
//     location: '',
//     company: '',
//     position: '',
//     website: '',
//     github: '',
//     linkedin: '',
//     twitter: '',
//     cohort: '',
//     specialite: '',
//     date_entree: '',
//     date_sortie: '',
//   });

//   // ✅ Obtenir le token
//   const getToken = useCallback(() => {
//     const token = localStorage.getItem('access_token') || 
//                   localStorage.getItem('simplon_access_token') || 
//                   localStorage.getItem('authToken');
    
//     if (token && token !== 'undefined' && token !== 'null') {
//       return token;
//     }
//     return null;
//   }, []);

//   // ✅ Afficher un message
//   const showMessage = useCallback((text, type = 'info') => {
//     setMessage({ text, type });
//     setTimeout(() => setMessage({ text: '', type: '' }), 4000);
//   }, []);

//   // ✅ Charger toutes les données du profil
//   const loadProfile = useCallback(async () => {
//     const token = getToken();
    
//     try {
//       setLoading(true);
      
//       if (token) {
//         // CORRIGÉ : Utiliser les endpoints existants de votre API Django
//         // 1. Récupérer le profil de base
//         const baseResponse = await axios.get(`${API_BASE}/users/profile/`, {
//           headers: { 
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         const baseData = baseResponse.data;
        
//         // 2. Récupérer le profil étendu (si disponible)
//         let extendedData = {};
//         try {
//           const extendedResponse = await axios.get(`${API_BASE}/users/profile/extended/`, {
//             headers: { 
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             }
//           });
//           extendedData = extendedResponse.data;
//         } catch (extendedError) {
//           console.log('Profil étendu non disponible:', extendedError);
//         }
        
//         // Fusionner les données
//         const mergedData = {
//           ...baseData,
//           ...extendedData
//         };
        
//         setUser(mergedData);
        
//         // Mettre à jour le formulaire
//         setFormData({
//           // Données de base
//           first_name: baseData?.first_name || '',
//           last_name: baseData?.last_name || '',
//           email: baseData?.email || '',
          
//           // Données étendues
//           phone: extendedData?.phone || '',
//           bio: extendedData?.bio || '',
//           location: extendedData?.location || '',
//           company: extendedData?.company || '',
//           position: extendedData?.position || '',
//           website: extendedData?.website || '',
//           github: extendedData?.github || '',
//           linkedin: extendedData?.linkedin || '',
//           twitter: extendedData?.twitter || '',
//           cohort: extendedData?.cohort || '',
//           specialite: extendedData?.specialite || '',
//           date_entree: extendedData?.date_entree || '',
//           date_sortie: extendedData?.date_sortie || '',
//         });
        
//         showMessage('✅ Profil chargé depuis la base de données', 'success');
        
//         // Charger les statistiques des projets
//         try {
//           const projectsResponse = await axios.get(`${API_BASE}/projects/projects/`, {
//             headers: { 
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             }
//           });
          
//           const projectsData = projectsResponse.data;
//           const userProjectsCount = projectsData.results?.filter(
//             project => project.author?.id === baseData.id
//           ).length || 0;
          
//           setUserStats({
//             projectsCount: userProjectsCount,
//             totalDownloads: 0, // À adapter si vous avez ces données
//             totalViews: 0      // À adapter si vous avez ces données
//           });
//         } catch (statsError) {
//           console.log('Stats projets non disponibles:', statsError);
//           setUserStats({
//             projectsCount: 0,
//             totalDownloads: 0,
//             totalViews: 0
//           });
//         }
        
//       } else {
//         // Mode démo si pas de token
//         showMessage('⚠️ Connectez-vous pour charger votre profil', 'warning');
//         setUserStats({
//           projectsCount: 0,
//           totalDownloads: 0,
//           totalViews: 0
//         });
//       }
//     } catch (error) {
//       console.error('Erreur chargement profil:', error);
      
//       if (error.response?.status === 401) {
//         showMessage('❌ Session expirée, veuillez vous reconnecter', 'error');
//         localStorage.removeItem('access_token');
//       } else {
//         showMessage('❌ Erreur lors du chargement du profil', 'error');
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [getToken, showMessage]);

//   // ✅ Sauvegarder le profil
//   const saveProfile = useCallback(async () => {
//     const token = getToken();
    
//     try {
//       setLoading(true);
      
//       if (token) {
//         // 1. Mettre à jour le profil de base
//         const baseData = {
//           first_name: formData.first_name,
//           last_name: formData.last_name,
//           email: formData.email,
//         };
        
//         await axios.patch(
//           `${API_BASE}/users/profile/`,
//           baseData,
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
        
//         // 2. Mettre à jour le profil étendu
//         const extendedData = {
//           phone: formData.phone || null,
//           bio: formData.bio || null,
//           location: formData.location || null,
//           company: formData.company || null,
//           position: formData.position || null,
//           website: formData.website || null,
//           github: formData.github || null,
//           linkedin: formData.linkedin || null,
//           twitter: formData.twitter || null,
//           cohort: formData.cohort || null,
//           specialite: formData.specialite || null,
//           date_entree: formData.date_entree || null,
//           date_sortie: formData.date_sortie || null,
//         };
        
//         // Filtrer les champs vides
//         const filteredData = Object.fromEntries(
//           Object.entries(extendedData).filter(([_, v]) => v !== null && v !== '')
//         );
        
//         try {
//           await axios.patch(
//             `${API_BASE}/users/profile/extended/`,
//             filteredData,
//             {
//               headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//               }
//             }
//           );
//         } catch (extendedError) {
//           console.log('Profil étendu non mis à jour:', extendedError);
//         }
        
//         showMessage('✅ Profil sauvegardé avec succès !', 'success');
//         loadProfile(); // Recharger pour avoir les données fraîches
//       } else {
//         showMessage('❌ Connectez-vous pour sauvegarder votre profil', 'error');
//       }
      
//       setEditMode(false);
//     } catch (error) {
//       console.error('Erreur sauvegarde:', error);
//       showMessage(`❌ Erreur: ${error.response?.data?.message || error.message}`, 'error');
//     } finally {
//       setLoading(false);
//     }
//   }, [formData, getToken, showMessage, loadProfile]);

//   // ✅ Uploader une photo de profil
//   const handleImageUpload = useCallback(async (file) => {
//     const token = getToken();
    
//     try {
//       setUploadingImage(true);
      
//       if (token) {
//         const uploadFormData = new FormData();
//         uploadFormData.append('avatar', file);
        
//         await axios.post(
//           `${API_BASE}/users/profile/avatar/`,
//           uploadFormData,
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'multipart/form-data'
//             }
//           }
//         );
        
//         showMessage('✅ Photo de profil mise à jour !', 'success');
//         loadProfile(); // Recharger les données
//       } else {
//         showMessage('❌ Connectez-vous pour modifier votre photo', 'error');
//       }
//     } catch (error) {
//       console.error('Erreur upload:', error);
//       showMessage(`❌ Erreur: ${error.response?.data?.message || error.message}`, 'error');
//     } finally {
//       setUploadingImage(false);
//       setShowEditModal(false);
//     }
//   }, [getToken, showMessage, loadProfile]);

//   // ✅ Supprimer la photo de profil
//   const deleteProfilePicture = useCallback(async () => {
//     const token = getToken();
    
//     try {
//       if (token) {
//         await axios.delete(`${API_BASE}/users/profile/avatar/`, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
        
//         showMessage('✅ Photo de profil supprimée', 'success');
//         loadProfile(); // Recharger les données
//       } else {
//         showMessage('❌ Connectez-vous pour supprimer la photo', 'error');
//       }
//     } catch (error) {
//       console.error('Erreur suppression:', error);
//       showMessage('❌ Erreur lors de la suppression', 'error');
//     }
//   }, [getToken, showMessage, loadProfile]);

//   // ✅ Gérer le changement d'input
//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   // ✅ Sélectionner une image
//   const handleImageSelect = (event) => {
//     const file = event.target.files[0];
    
//     if (file) {
//       if (!file.type.startsWith('image/')) {
//         showMessage('⚠️ Veuillez sélectionner une image valide (JPEG, PNG, etc.)', 'error');
//         return;
//       }
      
//       if (file.size > 5 * 1024 * 1024) {
//         showMessage('⚠️ L\'image est trop volumineuse. Taille maximale: 5MB', 'error');
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

//   // ✅ Sauvegarder la bio
//   const saveBio = async () => {
//     try {
//       setLoading(true);
//       await saveProfile();
//       setShowBioModal(false);
//     } catch (error) {
//       console.error('Erreur sauvegarde bio:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Se connecter
//   const handleLogin = () => {
//     navigate('/login');
//   };

//   // ✅ Effet initial
//   useEffect(() => {
//     loadProfile();
//   }, [loadProfile]);

//   // ✅ Photo de profil à afficher
//   const displayProfilePicture = imagePreview || 
//     (user?.avatar_url && !user.avatar_url.includes('googleusercontent.com') ? user.avatar_url : null) ||
//     'https://ui-avatars.com/api/?name=' + encodeURIComponent(`${formData.first_name}+${formData.last_name}`) + 
//     '&background=random&color=fff&size=128';

//   if (loading && !user) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E30613] mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Chargement du profil...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
//       <main className="p-6">
//         <div className="mx-auto max-w-6xl space-y-6">
          
//           {/* Profile Header Section */}
//           <section className="rounded-xl bg-white p-8 shadow-sm dark:bg-[#1a2f44]">
//             <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
//               {/* Profile Picture */}
//               <div className="relative group">
//                 <div 
//                   className="h-28 w-28 shrink-0 rounded-full bg-cover bg-center bg-no-repeat ring-4 ring-white dark:ring-gray-800 shadow-lg cursor-pointer transition-transform group-hover:scale-105"
//                   style={{ backgroundImage: `url(${displayProfilePicture})` }}
//                   onClick={() => setShowEditModal(true)}
//                   title="Cliquez pour modifier votre photo de profil"
//                 />
//                 <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
//                   <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
//                 </div>
//                 <div className="absolute -bottom-2 -right-2 bg-[#E30613] text-white rounded-full p-2 shadow-lg">
//                   <Edit size={14} />
//                 </div>
//               </div>
              
//               {/* Profile Info */}
//               <div className="flex-grow space-y-4 text-center sm:text-left">
//                 <div>
//                   <h2 className="text-2xl font-bold text-[#001F3F] dark:text-white">
//                     {formData.first_name} {formData.last_name}
//                   </h2>
//                   <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
//                     <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 rounded-full text-sm font-medium">
//                       <User size={14} />
//                       {user?.username || 'Utilisateur'}
//                     </span>
//                     {formData.cohort && (
//                       <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 rounded-full text-sm font-medium">
//                         <GraduationCap size={14} />
//                         {formData.cohort}
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-gray-600 dark:text-gray-400 mt-3 flex items-center gap-2 justify-center sm:justify-start">
//                     <Mail size={18} />
//                     {formData.email || 'Non renseigné'}
//                   </p>
//                   {formData.phone && (
//                     <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2 justify-center sm:justify-start">
//                       <Phone size={18} />
//                       {formData.phone}
//                     </p>
//                   )}
//                 </div>

//                 {/* Bio Section */}
//                 <div className="max-w-2xl">
//                   <div className="flex items-center justify-between mb-3">
//                     <h3 className="font-semibold text-[#001F3F] dark:text-white flex items-center gap-2">
//                       <span className="material-symbols-outlined text-lg">description</span>
//                       Bio
//                     </h3>
//                     {getToken() && (
//                       <button 
//                         onClick={() => setShowBioModal(true)}
//                         className="flex items-center gap-1 text-[#E30613] hover:text-[#E30613]/80 text-sm font-medium transition-colors"
//                       >
//                         <Edit size={14} />
//                         {formData.bio ? 'Modifier' : 'Ajouter une bio'}
//                       </button>
//                     )}
//                   </div>
                  
//                   {formData.bio ? (
//                     <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-line bg-gray-50 dark:bg-[#0d1a29] rounded-lg p-4 border border-gray-200 dark:border-gray-700">
//                       {formData.bio}
//                     </p>
//                   ) : (
//                     <div 
//                       className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-[#E30613] transition-colors"
//                       onClick={() => getToken() ? setShowBioModal(true) : showMessage('Connectez-vous pour modifier', 'warning')}
//                     >
//                       <Edit size={32} className="text-gray-400 mb-2 mx-auto" />
//                       <p className="text-gray-400 dark:text-gray-500 text-sm">
//                         {getToken() ? 'Cliquez pour ajouter une bio' : 'Connectez-vous pour modifier votre profil'}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
              
//               {/* Edit Buttons */}
//               <div className="flex flex-col gap-3 w-full sm:w-auto">
//                 {getToken() ? (
//                   <>
//                     <button 
//                       onClick={() => setShowEditModal(true)}
//                       className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#E30613] px-6 text-sm font-semibold text-white hover:bg-[#E30613]/90 transition-colors shadow-sm w-full sm:w-auto"
//                     >
//                       <Camera size={18} />
//                       <span>Modifier la photo</span>
//                     </button>
//                     <button 
//                       onClick={() => setEditMode(true)}
//                       className="flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm w-full sm:w-auto dark:border-gray-600 dark:bg-[#1a2f44] dark:text-white dark:hover:bg-[#253b52]"
//                     >
//                       <Edit size={18} />
//                       <span>Modifier le profil</span>
//                     </button>
//                   </>
//                 ) : (
//                   <button 
//                     onClick={handleLogin}
//                     className="flex h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#E30613] to-red-600 px-6 text-sm font-semibold text-white hover:from-red-600 hover:to-[#E30613] transition-all shadow-lg w-full sm:w-auto"
//                   >
//                     <User size={18} />
//                     <span>Se connecter</span>
//                   </button>
//                 )}
//               </div>
//             </div>
//           </section>

//           {/* Statistics Section */}
//           <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
//             {/* Projets créés */}
//             <div className="flex items-center gap-6 rounded-xl bg-white p-6 shadow-sm dark:bg-[#1a2f44] hover:shadow-md transition-shadow">
//               <div className="flex items-center justify-center w-14 h-14 bg-red-50 dark:bg-[#E30613]/10 rounded-xl">
//                 <FolderOpen className="text-2xl text-[#E30613]" />
//               </div>
//               <div>
//                 <div className="flex items-center gap-2">
//                   <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Projets créés</p>
//                   <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 rounded-full">
//                     {getToken() ? 'BD' : 'Démo'}
//                   </span>
//                 </div>
//                 <p className="text-3xl font-bold text-[#001F3F] dark:text-white">
//                   {userStats.projectsCount.toLocaleString()}
//                 </p>
//                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                   {getToken() ? 'Dans votre base de données' : 'Mode démonstration'}
//                 </p>
//               </div>
//             </div>
            
//             {/* Statut */}
//             <div className="flex items-center gap-6 rounded-xl bg-white p-6 shadow-sm dark:bg-[#1a2f44] hover:shadow-md transition-shadow">
//               <div className="flex items-center justify-center w-14 h-14 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
//                 <User className="text-2xl text-blue-600 dark:text-blue-400" />
//               </div>
//               <div>
//                 <div className="flex items-center gap-2">
//                   <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Statut</p>
//                   <span className={`text-xs px-1.5 py-0.5 rounded-full ${
//                     getToken() 
//                       ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
//                       : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
//                   }`}>
//                     {getToken() ? 'Connecté' : 'Non connecté'}
//                   </span>
//                 </div>
//                 <p className="text-3xl font-bold text-[#001F3F] dark:text-white">
//                   {getToken() ? '✅' : '⚠️'}
//                 </p>
//                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                   {getToken() ? 'Connecté à la BD' : 'Connectez-vous pour sauvegarder'}
//                 </p>
//               </div>
//             </div>
            
//             {/* Actions */}
//             <div className="flex items-center gap-6 rounded-xl bg-white p-6 shadow-sm dark:bg-[#1a2f44] hover:shadow-md transition-shadow">
//               <div className="flex items-center justify-center w-14 h-14 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
//                 <Eye className="text-2xl text-purple-600 dark:text-purple-400" />
//               </div>
//               <div>
//                 <div className="flex items-center gap-2">
//                   <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Actions</p>
//                   <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 rounded-full">
//                     {editMode ? 'Édition' : 'Lecture'}
//                   </span>
//                 </div>
//                 <div className="flex gap-2 mt-2">
//                   <button 
//                     onClick={() => setEditMode(!editMode)}
//                     className={`px-4 py-2 text-sm rounded-lg transition-colors ${
//                       editMode 
//                         ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300'
//                         : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300'
//                     }`}
//                   >
//                     {editMode ? 'Annuler' : 'Modifier'}
//                   </button>
//                   {editMode && (
//                     <button 
//                       onClick={saveProfile}
//                       className="px-4 py-2 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors dark:bg-blue-900/20 dark:text-blue-300"
//                     >
//                       Sauvegarder
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Navigation des onglets */}
//           <div className="bg-white rounded-xl shadow-lg p-2 border border-gray-200 dark:bg-[#1a2f44] dark:border-gray-700">
//             <div className="flex flex-wrap gap-2">
//               <button
//                 onClick={() => setActiveTab('profile')}
//                 className={`flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-300 font-medium ${
//                   activeTab === 'profile'
//                     ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
//                     : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200'
//                 }`}
//               >
//                 <User size={20} />
//                 <span>Profil</span>
//               </button>
              
//               {getToken() && (
//                 <>
//                   <button
//                     onClick={() => setActiveTab('security')}
//                     className={`flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-300 font-medium ${
//                       activeTab === 'security'
//                         ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
//                         : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200'
//                     }`}
//                   >
//                     <Lock size={20} />
//                     <span>Sécurité</span>
//                   </button>
                  
//                   <button
//                     onClick={() => setActiveTab('notifications')}
//                     className={`flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-300 font-medium ${
//                       activeTab === 'notifications'
//                         ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
//                         : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200'
//                     }`}
//                   >
//                     <Bell size={20} />
//                     <span>Notifications</span>
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Contenu des onglets - Profile */}
//           {activeTab === 'profile' && (
//             <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 dark:bg-[#1a2f44] dark:border-gray-700">
//               <div className="flex items-center justify-between mb-8">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Informations personnelles</h2>
//                   <p className="text-gray-600 dark:text-gray-400 mt-1">
//                     {getToken() 
//                       ? 'Vos données sont sauvegardées dans votre base de données' 
//                       : 'Connectez-vous pour sauvegarder vos modifications'
//                     }
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   {!getToken() && (
//                     <button 
//                       onClick={handleLogin}
//                       className="px-4 py-2 text-sm bg-gradient-to-r from-[#E30613] to-red-600 text-white rounded-lg hover:from-red-600 hover:to-[#E30613] transition-all"
//                     >
//                       Se connecter
//                     </button>
//                   )}
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* Section informations de base */}
//                 <div className="space-y-6">
//                   <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 dark:from-blue-900/10 dark:to-indigo-900/10 dark:border-blue-800/20">
//                     <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
//                       <div className="p-2 bg-white dark:bg-[#0d1a29] rounded-lg shadow-sm">
//                         <User size={20} className="text-blue-600 dark:text-blue-400" />
//                       </div>
//                       Informations de base
//                     </h3>
                    
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Prénom
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.first_name}
//                           onChange={(e) => handleInputChange('first_name', e.target.value)}
//                           disabled={!editMode || !getToken()}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="Votre prénom"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Nom
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.last_name}
//                           onChange={(e) => handleInputChange('last_name', e.target.value)}
//                           disabled={!editMode || !getToken()}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="Votre nom"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Email
//                         </label>
//                         <input
//                           type="email"
//                           value={formData.email}
//                           onChange={(e) => handleInputChange('email', e.target.value)}
//                           disabled={!editMode || !getToken()}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="votre@email.com"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Téléphone
//                         </label>
//                         <input
//                           type="tel"
//                           value={formData.phone}
//                           onChange={(e) => handleInputChange('phone', e.target.value)}
//                           disabled={!editMode || !getToken()}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="+33 1 23 45 67 89"
//                         />
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Section informations supplémentaires */}
//                   <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 dark:from-purple-900/10 dark:to-pink-900/10 dark:border-purple-800/20">
//                     <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Informations supplémentaires</h3>
                    
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Localisation
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.location}
//                           onChange={(e) => handleInputChange('location', e.target.value)}
//                           disabled={!editMode || !getToken()}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="Ville, Pays"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Entreprise
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.company}
//                           onChange={(e) => handleInputChange('company', e.target.value)}
//                           disabled={!editMode || !getToken()}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="Nom de l'entreprise"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Poste
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.position}
//                           onChange={(e) => handleInputChange('position', e.target.value)}
//                           disabled={!editMode || !getToken()}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="Votre poste"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Section informations Simplon et liens */}
//                 <div className="space-y-6">
//                   <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 dark:from-green-900/10 dark:to-emerald-900/10 dark:border-green-800/20">
//                     <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
//                       <div className="p-2 bg-white dark:bg-[#0d1a29] rounded-lg shadow-sm">
//                         <GraduationCap size={20} className="text-green-600 dark:text-green-400" />
//                       </div>
//                       Informations Simplon
//                     </h3>
                    
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Promotion
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.cohort}
//                           onChange={(e) => handleInputChange('cohort', e.target.value)}
//                           disabled={!editMode || !getToken()}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="Ex: Admin 2024"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Spécialité
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.specialite}
//                           onChange={(e) => handleInputChange('specialite', e.target.value)}
//                           disabled={!editMode || !getToken()}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="Ex: Administration Système"
//                         />
//                       </div>
                      
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                             Date d'entrée
//                           </label>
//                           <input
//                             type="date"
//                             value={formData.date_entree}
//                             onChange={(e) => handleInputChange('date_entree', e.target.value)}
//                             disabled={!editMode || !getToken()}
//                             className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           />
//                         </div>
                        
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                             Date de sortie
//                           </label>
//                           <input
//                             type="date"
//                             value={formData.date_sortie}
//                             onChange={(e) => handleInputChange('date_sortie', e.target.value)}
//                             disabled={!editMode || !getToken()}
//                             className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Section liens */}
//                   <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100 dark:from-orange-900/10 dark:to-amber-900/10 dark:border-orange-800/20">
//                     <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Liens professionnels</h3>
                    
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
//                           <Github size={18} className="text-gray-700 dark:text-gray-300" />
//                           GitHub
//                         </label>
//                         <input
//                           type="url"
//                           value={formData.github}
//                           onChange={(e) => handleInputChange('github', e.target.value)}
//                           disabled={!editMode || !getToken()}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 dark:focus:ring-gray-400 dark:focus:border-gray-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="https://github.com/votre-username"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
//                           <Linkedin size={18} className="text-blue-600 dark:text-blue-400" />
//                           LinkedIn
//                         </label>
//                         <input
//                           type="url"
//                           value={formData.linkedin}
//                           onChange={(e) => handleInputChange('linkedin', e.target.value)}
//                           disabled={!editMode || !getToken()}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="https://linkedin.com/in/votre-profile"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
//                           <Globe size={18} className="text-green-600 dark:text-green-400" />
//                           Portfolio / Site web
//                         </label>
//                         <input
//                           type="url"
//                           value={formData.website}
//                           onChange={(e) => handleInputChange('website', e.target.value)}
//                           disabled={!editMode || !getToken()}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="https://votre-portfolio.com"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Boutons d'action pour la section profil */}
//               {getToken() && editMode && (
//                 <div className="flex gap-3 justify-end mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
//                   <button
//                     onClick={() => {
//                       setEditMode(false);
//                       loadProfile();
//                     }}
//                     className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg font-medium"
//                   >
//                     <X size={20} />
//                     Annuler
//                   </button>
                  
//                   <button
//                     onClick={saveProfile}
//                     disabled={loading}
//                     className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-500 transition-all duration-300 shadow-lg hover:shadow-xl font-medium disabled:opacity-50"
//                   >
//                     {loading ? (
//                       <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
//                     ) : (
//                       <Save size={20} />
//                     )}
//                     Sauvegarder les modifications
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Section Sécurité */}
//           {activeTab === 'security' && getToken() && (
//             <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 dark:bg-[#1a2f44] dark:border-gray-700">
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Sécurité du compte</h2>
//               <div className="space-y-6">
//                 <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
//                   <div className="flex items-start gap-4">
//                     <Lock size={24} className="text-red-600 dark:text-red-400 mt-1" />
//                     <div>
//                       <h3 className="font-semibold text-red-700 dark:text-red-300 mb-2">Changer le mot de passe</h3>
//                       <p className="text-red-600 dark:text-red-400 text-sm mb-4">
//                         Pour changer votre mot de passe, veuillez vous déconnecter et utiliser le lien "Mot de passe oublié".
//                       </p>
//                       <button
//                         onClick={() => {
//                           localStorage.removeItem('access_token');
//                           localStorage.removeItem('simplon_access_token');
//                           localStorage.removeItem('authToken');
//                           showMessage('✅ Déconnecté avec succès', 'success');
//                           navigate('/login');
//                         }}
//                         className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
//                       >
//                         Se déconnecter
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Section Notifications */}
//           {activeTab === 'notifications' && getToken() && (
//             <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 dark:bg-[#1a2f44] dark:border-gray-700">
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Notifications</h2>
//               <div className="text-center py-12">
//                 <Bell size={48} className="text-gray-400 dark:text-gray-600 mx-auto mb-4" />
//                 <p className="text-gray-500 dark:text-gray-400">
//                   Aucune notification pour le moment
//                 </p>
//               </div>
//             </div>
//           )}
          
//         </div>
//       </main>

//       {/* Modals */}
      
//       {/* Profile Picture Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//           <div className="bg-white dark:bg-[#1a2f44] rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-bold text-[#001F3F] dark:text-white flex items-center gap-2">
//                 <Camera size={20} />
//                 Photo de profil
//               </h3>
//               <button 
//                 onClick={() => setShowEditModal(false)}
//                 className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             <div className="flex flex-col items-center gap-6 mb-6">
//               <div 
//                 className="h-32 w-32 rounded-full bg-cover bg-center bg-no-repeat border-4 border-gray-200 dark:border-gray-600 shadow-lg"
//                 style={{ backgroundImage: `url(${imagePreview || displayProfilePicture})` }}
//               />
              
//               <div className="flex flex-col gap-3 w-full">
//                 <label className="flex items-center justify-center gap-3 bg-[#E30613] text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-[#E30613]/90 transition-colors font-medium shadow-sm">
//                   <Camera size={20} />
//                   <span>Choisir une photo</span>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageSelect}
//                     className="hidden"
//                   />
//                 </label>
                
//                 <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
//                   Formats supportés: JPG, PNG, GIF • Max: 5MB
//                 </p>
//               </div>

//               {/* Bouton réinitialiser */}
//               {displayProfilePicture && !displayProfilePicture.includes('ui-avatars.com') && getToken() && (
//                 <button 
//                   onClick={deleteProfilePicture}
//                   className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
//                 >
//                   <Trash2 size={16} />
//                   Supprimer la photo
//                 </button>
//               )}
//             </div>

//             <div className="flex gap-3 justify-end">
//               <button 
//                 onClick={() => setShowEditModal(false)}
//                 className="px-6 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
//               >
//                 Annuler
//               </button>
//               <button 
//                 onClick={() => {
//                   if (selectedImage) {
//                     handleImageUpload(selectedImage);
//                   } else {
//                     setShowEditModal(false);
//                   }
//                 }}
//                 disabled={uploadingImage || !getToken()}
//                 className="flex items-center gap-2 bg-[#E30613] text-white px-6 py-2.5 rounded-lg hover:bg-[#E30613]/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm"
//               >
//                 {uploadingImage ? (
//                   <>
//                     <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
//                     Enregistrement...
//                   </>
//                 ) : (
//                   <>
//                     <Save size={20} />
//                     {getToken() ? 'Enregistrer' : 'Connectez-vous'}
//                   </>
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
//               <h3 className="text-lg font-bold text-[#001F3F] dark:text-white flex items-center gap-2">
//                 <Edit size={20} />
//                 {formData.bio ? 'Modifier la bio' : 'Ajouter une bio'}
//               </h3>
//               <button 
//                 onClick={() => setShowBioModal(false)}
//                 className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             <div className="mb-6">
//               <textarea
//                 value={formData.bio}
//                 onChange={(e) => handleInputChange('bio', e.target.value)}
//                 rows="6"
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white resize-none transition-colors"
//                 placeholder="Parlez de vous, de vos compétences, de vos passions... (300 caractères maximum)"
//                 maxLength="300"
//               />
//               <div className="flex justify-between items-center mt-2">
//                 <p className="text-xs text-gray-500 dark:text-gray-400">
//                   Décrivez-vous en quelques mots
//                 </p>
//                 <p className={`text-xs ${formData.bio.length >= 280 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
//                   {formData.bio.length}/300 caractères
//                 </p>
//               </div>
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
//                 disabled={loading || !getToken()}
//                 className="flex items-center gap-2 bg-[#E30613] text-white px-6 py-2.5 rounded-lg hover:bg-[#E30613]/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm"
//               >
//                 {loading ? (
//                   <>
//                     <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
//                     Enregistrement...
//                   </>
//                 ) : (
//                   <>
//                     <Save size={20} />
//                     Enregistrer
//                   </>
//                 )}
//               </button> 
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Message Toast */}
//       {message.text && (
//         <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl max-w-sm ${
//           message.type === 'success' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-800 dark:text-green-300' :
//           message.type === 'error' ? 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 text-red-800 dark:from-red-900/20 dark:to-orange-900/20 dark:border-red-800 dark:text-red-300' :
//           message.type === 'warning' ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 text-yellow-800 dark:from-yellow-900/20 dark:to-amber-900/20 dark:border-yellow-800 dark:text-yellow-300' :
//           'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 text-blue-800 dark:from-blue-900/20 dark:to-cyan-900/20 dark:border-blue-800 dark:text-blue-300'
//         }`}>
//           <div className="flex items-center gap-3">
//             {message.type === 'success' ? (
//               <CheckCircle size={24} className="flex-shrink-0" />
//             ) : message.type === 'error' ? (
//               <X size={24} className="flex-shrink-0" />
//             ) : (
//               <Bell size={24} className="flex-shrink-0" />
//             )}
//             <div className="flex-1">
//               <p className="font-medium">{message.text}</p>
//             </div>
//             <button
//               onClick={() => setMessage({ text: '', type: '' })}
//               className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
//             >
//               <X size={20} />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Profile;

// // src/components/admin/Profile.jsx - VERSION COMPLÈTE CORRIGÉE


// // DEBUG: Afficher le token actuel
// useEffect(() => {
//   console.log('🔍 DEBUG - Tokens dans localStorage:');
//   console.log('access_token:', localStorage.getItem('access_token'));
//   console.log('simplon_access_token:', localStorage.getItem('simplon_access_token'));
//   console.log('authToken:', localStorage.getItem('authToken'));
//   console.log('refresh_token:', localStorage.getItem('refresh_token'));
// }, []);
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { 
//   User, Mail, Phone, Camera, Save, Edit, X,
//   FolderOpen, Download, Eye, Github, Linkedin, Globe,
//   GraduationCap, CheckCircle, Bell, Lock, Trash2, LogOut
// } from 'lucide-react';

// const Profile = () => {
//   // États principaux
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [activeTab, setActiveTab] = useState('profile');
//   const [uploadingImage, setUploadingImage] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showBioModal, setShowBioModal] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [message, setMessage] = useState({ text: '', type: '' });
//   const [userStats, setUserStats] = useState({
//     projectsCount: 0,
//     totalDownloads: 0,
//     totalViews: 0
//   });

//   const fileInputRef = useRef(null);
//   const API_BASE = 'http://localhost:8000/api';
//   const navigate = useNavigate();

//   // Données du formulaire
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     phone: '',
//     bio: '',
//     location: '',
//     company: '',
//     position: '',
//     website: '',
//     github: '',
//     linkedin: '',
//     twitter: '',
//     cohort: '',
//     specialite: '',
//     date_entree: '',
//     date_sortie: '',
//   });

//   // ✅ DEBUG: Fonction pour inspecter les tokens
//   const debugTokens = useCallback(() => {
//     const tokens = {
//       access_token: localStorage.getItem('access_token'),
//       simplon_access_token: localStorage.getItem('simplon_access_token'),
//       authToken: localStorage.getItem('authToken'),
//       refresh_token: localStorage.getItem('refresh_token')
//     };
    
//     console.log('🔍 TOKENS STOCKÉS:', tokens);
    
//     // Vérifier la validité du format
//     const mainToken = tokens.access_token || tokens.simplon_access_token || tokens.authToken;
//     if (mainToken) {
//       console.log('📏 Longueur du token:', mainToken.length);
//       console.log('🔤 Début du token:', mainToken.substring(0, 50) + '...');
      
//       // Décoder le JWT pour voir son expiration
//       try {
//         const payload = JSON.parse(atob(mainToken.split('.')[1]));
//         console.log('📄 Payload JWT:', payload);
//         const expires = new Date(payload.exp * 1000);
//         console.log('⏰ Token expire le:', expires.toLocaleString());
//         console.log('⏰ Token expiré?', expires < new Date());
//       } catch (e) {
//         console.log('❌ Token non-JWT ou mal formaté');
//       }
//     }
    
//     return mainToken;
//   }, []);

//   // ✅ Nouvelle fonction getToken améliorée
//   const getToken = useCallback(() => {
//     // DEBUG
//     debugTokens();
    
//     // Chercher dans plusieurs clés
//     const tokenKeys = [
//       'access_token',
//       'simplon_access_token', 
//       'authToken',
//       'token',
//       'jwt'
//     ];
    
//     for (const key of tokenKeys) {
//       const token = localStorage.getItem(key);
//       if (token && token !== 'undefined' && token !== 'null' && token.length > 20) {
//         console.log(`✅ Token trouvé dans ${key}:`, token.substring(0, 30) + '...');
        
//         // Nettoyer si nécessaire
//         let cleanToken = token;
//         if (cleanToken.startsWith('Bearer ')) {
//           cleanToken = cleanToken.replace('Bearer ', '');
//         }
//         if (cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
//           cleanToken = cleanToken.slice(1, -1);
//         }
        
//         return cleanToken;
//       }
//     }
    
//     console.log('❌ Aucun token valide trouvé');
//     return null;
//   }, [debugTokens]);

//   // ✅ Tester la connexion à l'API
//   const testAPIConnection = useCallback(async () => {
//     try {
//       console.log('🔄 Test de connexion à l\'API...');
//       const response = await axios.get(`${API_BASE}/`, {
//         timeout: 5000
//       });
//       console.log('✅ API accessible:', response.data);
//       return true;
//     } catch (error) {
//       console.error('❌ API inaccessible:', error.message);
//       return false;
//     }
//   }, []);

//   // ✅ Tester l'authentification avec un token
//   const testAuth = useCallback(async (token) => {
//     if (!token) return false;
    
//     try {
//       console.log('🔐 Test d\'authentification avec token...');
//       const response = await axios.get(`${API_BASE}/users/profile/`, {
//         headers: { 
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         validateStatus: () => true // Accepter tous les status
//       });
      
//       console.log('📊 Status de réponse:', response.status);
//       console.log('📄 Données de réponse:', response.data);
      
//       return response.status === 200;
//     } catch (error) {
//       console.error('❌ Erreur test auth:', error.message);
//       return false;
//     }
//   }, []);

//   // ✅ Afficher un message
//   const showMessage = useCallback((text, type = 'info') => {
//     setMessage({ text, type });
//     setTimeout(() => setMessage({ text: '', type: '' }), 4000);
//   }, []);

//   // ✅ Fonction de déconnexion
//   const handleLogout = useCallback(() => {
//     console.log('🚪 Déconnexion...');
    
//     // Supprimer tous les tokens
//     const tokenKeys = [
//       'access_token',
//       'simplon_access_token',
//       'authToken',
//       'refresh_token',
//       'token',
//       'jwt'
//     ];
    
//     tokenKeys.forEach(key => localStorage.removeItem(key));
    
//     showMessage('✅ Déconnecté avec succès', 'success');
    
//     // Rediriger après un délai
//     setTimeout(() => {
//       navigate('/login');
//     }, 1500);
//   }, [navigate, showMessage]);

//   // ✅ Charger le profil (version robuste)
//   const loadProfile = useCallback(async () => {
//     try {
//       setLoading(true);
      
//       // 1. Tester la connexion API
//       const apiAvailable = await testAPIConnection();
//       if (!apiAvailable) {
//         showMessage('❌ API inaccessible. Mode démo activé.', 'warning');
//         setUser(demoUser);
//         setLoading(false);
//         return;
//       }
      
//       // 2. Récupérer le token
//       const token = getToken();
      
//       if (!token) {
//         console.log('👤 Mode invité (pas de token)');
//         showMessage('👋 Connectez-vous pour accéder à votre profil complet', 'info');
//         setUser(demoUser);
//         setLoading(false);
//         return;
//       }
      
//       // 3. Tester l'authentification
//       const isAuthenticated = await testAuth(token);
      
//       if (!isAuthenticated) {
//         console.log('🔒 Token invalide ou expiré');
//         showMessage('🔒 Session expirée. Déconnexion...', 'error');
//         handleLogout();
//         return;
//       }
      
//       // 4. Charger les données du profil
//       console.log('📥 Chargement des données du profil...');
      
//       try {
//         const response = await axios.get(`${API_BASE}/users/profile/`, {
//           headers: { 
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//           timeout: 10000
//         });
        
//         console.log('✅ Données reçues:', response.data);
        
//         const userData = response.data;
//         setUser(userData);
        
//         // Mettre à jour le formulaire
//         setFormData({
//           first_name: userData?.first_name || '',
//           last_name: userData?.last_name || '',
//           email: userData?.email || '',
//           phone: userData?.phone || '',
//           bio: userData?.bio || '',
//           location: userData?.location || '',
//           company: userData?.company || '',
//           position: userData?.position || '',
//           website: userData?.website || '',
//           github: userData?.github || '',
//           linkedin: userData?.linkedin || '',
//           twitter: userData?.twitter || '',
//           cohort: userData?.cohort || '',
//           specialite: userData?.specialite || '',
//           date_entree: userData?.date_entree || '',
//           date_sortie: userData?.date_sortie || '',
//         });
        
//         // Charger les statistiques
//         try {
//           const projectsResponse = await axios.get(`${API_BASE}/projects/user-projects/`, {
//             headers: { 
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             }
//           });
          
//           const projects = projectsResponse.data.results || projectsResponse.data || [];
//           setUserStats({
//             projectsCount: projects.length,
//             totalDownloads: projects.reduce((sum, project) => sum + (project.downloads || 0), 0),
//             totalViews: projects.reduce((sum, project) => sum + (project.views || 0), 0)
//           });
//         } catch (statsError) {
//           console.log('⚠️ Stats non disponibles:', statsError.message);
//         }
        
//         showMessage('✅ Profil chargé avec succès', 'success');
        
//       } catch (apiError) {
//         console.error('❌ Erreur API:', apiError.response?.status, apiError.message);
        
//         if (apiError.response?.status === 401) {
//           showMessage('🔒 Session expirée. Veuillez vous reconnecter.', 'error');
//           handleLogout();
//         } else {
//           showMessage('⚠️ Erreur de chargement. Mode démo activé.', 'warning');
//           setUser(demoUser);
//         }
//       }
      
//     } catch (error) {
//       console.error('❌ Erreur générale:', error);
//       showMessage('⚠️ Erreur de connexion au serveur', 'error');
//       setUser(demoUser);
//     } finally {
//       setLoading(false);
//     }
//   }, [getToken, testAPIConnection, testAuth, showMessage, handleLogout]);

//   // ✅ Données de démonstration
//   const demoUser = {
//     id: 'demo',
//     username: 'invité',
//     first_name: 'Invité',
//     last_name: 'Utilisateur',
//     email: 'invite@example.com',
//     avatar_url: null,
//     bio: 'Connectez-vous pour accéder à votre profil complet.',
//     cohort: 'Demo 2024',
//     specialite: 'Développement Web'
//   };

//   // ✅ Sauvegarder le profil
//   const saveProfile = useCallback(async () => {
//     const token = getToken();
    
//     if (!token) {
//       showMessage('🔒 Connectez-vous pour sauvegarder', 'error');
//       navigate('/login');
//       return;
//     }
    
//     try {
//       setLoading(true);
      
//       const dataToSend = {
//         first_name: formData.first_name,
//         last_name: formData.last_name,
//         email: formData.email,
//         phone: formData.phone || null,
//         bio: formData.bio || null,
//         location: formData.location || null,
//         company: formData.company || null,
//         position: formData.position || null,
//         website: formData.website || null,
//         github: formData.github || null,
//         linkedin: formData.linkedin || null,
//         twitter: formData.twitter || null,
//         cohort: formData.cohort || null,
//         specialite: formData.specialite || null,
//         date_entree: formData.date_entree || null,
//         date_sortie: formData.date_sortie || null,
//       };
      
//       // Filtrer les valeurs nulles
//       const filteredData = Object.fromEntries(
//         Object.entries(dataToSend).filter(([_, v]) => v !== null && v !== '')
//       );
      
//       console.log('📤 Données à envoyer:', filteredData);
      
//       const response = await axios.patch(
//         `${API_BASE}/users/profile/`,
//         filteredData,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
      
//       console.log('✅ Réponse sauvegarde:', response.data);
//       showMessage('✅ Profil sauvegardé avec succès !', 'success');
      
//       // Recharger les données
//       await loadProfile();
//       setEditMode(false);
      
//     } catch (error) {
//       console.error('❌ Erreur sauvegarde:', error);
      
//       if (error.response?.status === 401) {
//         showMessage('🔒 Session expirée. Reconnexion nécessaire.', 'error');
//         handleLogout();
//       } else {
//         showMessage(`❌ Erreur: ${error.response?.data?.detail || error.message}`, 'error');
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [formData, getToken, showMessage, navigate, loadProfile, handleLogout]);

//   // ✅ Gérer le changement d'input
//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   // ✅ Sélectionner une image
//   const handleImageSelect = (event) => {
//     const file = event.target.files[0];
    
//     if (file) {
//       if (!file.type.startsWith('image/')) {
//         showMessage('⚠️ Veuillez sélectionner une image valide', 'error');
//         return;
//       }
      
//       if (file.size > 5 * 1024 * 1024) {
//         showMessage('⚠️ L\'image est trop volumineuse (max 5MB)', 'error');
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

//   // ✅ Sauvegarder la bio
//   const saveBio = async () => {
//     try {
//       setLoading(true);
//       await saveProfile();
//       setShowBioModal(false);
//     } catch (error) {
//       console.error('Erreur sauvegarde bio:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Se connecter
//   const handleLogin = () => {
//     navigate('/login');
//   };

//   // ✅ Effet initial
//   useEffect(() => {
//     console.log('🏁 Initialisation du composant Profile');
//     loadProfile();
//   }, [loadProfile]);

//   // ✅ Photo de profil à afficher
//   const displayProfilePicture = imagePreview || 
//     (user?.avatar_url && !user.avatar_url.includes('googleusercontent.com') ? user.avatar_url : null) ||
//     'https://ui-avatars.com/api/?name=' + encodeURIComponent(`${formData.first_name}+${formData.last_name}`) + 
//     '&background=random&color=fff&size=128';

//   // ✅ Vérifier si l'utilisateur est connecté
//   const isLoggedIn = getToken() && user && user.id !== 'demo';

//   // ⏳ Loading state
//   if (loading && !user) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E30613] mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Chargement du profil...</p>
//           <p className="text-gray-400 text-sm mt-2">Connexion à l'API en cours</p>
//         </div>
//       </div>
//     );
//   }

//   // 🎨 Rendu principal
//   return (
//     <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
//       {/* Bandeau de débogage (à retirer en production) */}
//       <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-sm text-yellow-800">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <span className="font-semibold">Mode:</span>
//             <span className={`px-2 py-1 rounded ${isLoggedIn ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
//               {isLoggedIn ? 'Connecté' : 'Invité'}
//             </span>
//           </div>
//           <button 
//             onClick={debugTokens}
//             className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-xs"
//           >
//             Debug Tokens
//           </button>
//         </div>
//       </div>

//       <main className="p-6">
//         <div className="mx-auto max-w-6xl space-y-6">
          
//           {/* Header Section */}
//           <section className="rounded-xl bg-white p-8 shadow-sm dark:bg-[#1a2f44]">
//             <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
              
//               {/* Photo de profil */}
//               <div className="relative group">
//                 <div 
//                   className="h-28 w-28 shrink-0 rounded-full bg-cover bg-center bg-no-repeat ring-4 ring-white dark:ring-gray-800 shadow-lg cursor-pointer transition-transform group-hover:scale-105"
//                   style={{ backgroundImage: `url(${displayProfilePicture})` }}
//                   onClick={() => setShowEditModal(true)}
//                   title="Cliquez pour modifier votre photo"
//                 />
//                 <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
//                   <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
//                 </div>
//                 <div className="absolute -bottom-2 -right-2 bg-[#E30613] text-white rounded-full p-2 shadow-lg">
//                   <Edit size={14} />
//                 </div>
//               </div>
              
//               {/* Informations */}
//               <div className="flex-grow space-y-4 text-center sm:text-left">
//                 <div>
//                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
//                     <h2 className="text-2xl font-bold text-[#001F3F] dark:text-white">
//                       {formData.first_name} {formData.last_name}
//                     </h2>
//                     {isLoggedIn ? (
//                       <button 
//                         onClick={handleLogout}
//                         className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
//                       >
//                         <LogOut size={16} />
//                         Déconnexion
//                       </button>
//                     ) : (
//                       <button 
//                         onClick={handleLogin}
//                         className="flex items-center gap-2 text-sm bg-[#E30613] text-white px-3 py-1 rounded-lg hover:bg-[#E30613]/90 transition-colors"
//                       >
//                         <User size={16} />
//                         Se connecter
//                       </button>
//                     )}
//                   </div>
                  
//                   <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
//                     <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 rounded-full text-sm font-medium">
//                       <User size={14} />
//                       {user?.username || 'Utilisateur'}
//                     </span>
//                     {formData.cohort && (
//                       <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 rounded-full text-sm font-medium">
//                         <GraduationCap size={14} />
//                         {formData.cohort}
//                       </span>
//                     )}
//                     <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
//                       isLoggedIn 
//                         ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
//                         : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
//                     }`}>
//                       {isLoggedIn ? '✅ Connecté' : '⚠️ Invité'}
//                     </span>
//                   </div>
                  
//                   <p className="text-gray-600 dark:text-gray-400 mt-3 flex items-center gap-2 justify-center sm:justify-start">
//                     <Mail size={18} />
//                     {formData.email || 'Non renseigné'}
//                   </p>
                  
//                   {formData.phone && (
//                     <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2 justify-center sm:justify-start">
//                       <Phone size={18} />
//                       {formData.phone}
//                     </p>
//                   )}
//                 </div>

//                 {/* Bio */}
//                 <div className="max-w-2xl">
//                   <div className="flex items-center justify-between mb-3">
//                     <h3 className="font-semibold text-[#001F3F] dark:text-white flex items-center gap-2">
//                       Bio
//                     </h3>
//                     {isLoggedIn && (
//                       <button 
//                         onClick={() => setShowBioModal(true)}
//                         className="flex items-center gap-1 text-[#E30613] hover:text-[#E30613]/80 text-sm font-medium transition-colors"
//                       >
//                         <Edit size={14} />
//                         {formData.bio ? 'Modifier' : 'Ajouter une bio'}
//                       </button>
//                     )}
//                   </div>
                  
//                   {formData.bio ? (
//                     <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-line bg-gray-50 dark:bg-[#0d1a29] rounded-lg p-4 border border-gray-200 dark:border-gray-700">
//                       {formData.bio}
//                     </p>
//                   ) : (
//                     <div 
//                       className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-[#E30613] transition-colors"
//                       onClick={() => isLoggedIn ? setShowBioModal(true) : showMessage('Connectez-vous pour modifier', 'warning')}
//                     >
//                       <Edit size={32} className="text-gray-400 mb-2 mx-auto" />
//                       <p className="text-gray-400 dark:text-gray-500 text-sm">
//                         {isLoggedIn ? 'Cliquez pour ajouter une bio' : 'Connectez-vous pour modifier votre profil'}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
              
//               {/* Boutons d'action */}
//               <div className="flex flex-col gap-3 w-full sm:w-auto">
//                 {isLoggedIn ? (
//                   <>
//                     <button 
//                       onClick={() => setShowEditModal(true)}
//                       className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#E30613] px-6 text-sm font-semibold text-white hover:bg-[#E30613]/90 transition-colors shadow-sm w-full sm:w-auto"
//                     >
//                       <Camera size={18} />
//                       <span>Modifier la photo</span>
//                     </button>
//                     <button 
//                       onClick={() => setEditMode(true)}
//                       className="flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm w-full sm:w-auto dark:border-gray-600 dark:bg-[#1a2f44] dark:text-white dark:hover:bg-[#253b52]"
//                     >
//                       <Edit size={18} />
//                       <span>Modifier le profil</span>
//                     </button>
//                   </>
//                 ) : (
//                   <button 
//                     onClick={handleLogin}
//                     className="flex h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#E30613] to-red-600 px-6 text-sm font-semibold text-white hover:from-red-600 hover:to-[#E30613] transition-all shadow-lg w-full sm:w-auto"
//                   >
//                     <User size={18} />
//                     <span>Se connecter</span>
//                   </button>
//                 )}
//               </div>
//             </div>
//           </section>

//           {/* Statistiques */}
//           <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
//             <div className="flex items-center gap-6 rounded-xl bg-white p-6 shadow-sm dark:bg-[#1a2f44] hover:shadow-md transition-shadow">
//               <div className="flex items-center justify-center w-14 h-14 bg-red-50 dark:bg-[#E30613]/10 rounded-xl">
//                 <FolderOpen className="text-2xl text-[#E30613]" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Projets créés</p>
//                 <p className="text-3xl font-bold text-[#001F3F] dark:text-white">
//                   {userStats.projectsCount.toLocaleString()}
//                 </p>
//                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                   {isLoggedIn ? 'Dans votre base de données' : 'Mode démonstration'}
//                 </p>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-6 rounded-xl bg-white p-6 shadow-sm dark:bg-[#1a2f44] hover:shadow-md transition-shadow">
//               <div className="flex items-center justify-center w-14 h-14 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
//                 <User className="text-2xl text-blue-600 dark:text-blue-400" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Statut</p>
//                 <p className="text-3xl font-bold text-[#001F3F] dark:text-white">
//                   {isLoggedIn ? '✅' : '⚠️'}
//                 </p>
//                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                   {isLoggedIn ? 'Connecté à la BD' : 'Mode invité'}
//                 </p>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-6 rounded-xl bg-white p-6 shadow-sm dark:bg-[#1a2f44] hover:shadow-md transition-shadow">
//               <div className="flex items-center justify-center w-14 h-14 bg-green-50 dark:bg-green-900/10 rounded-xl">
//                 <Eye className="text-2xl text-green-600 dark:text-green-400" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Mode</p>
//                 <p className="text-3xl font-bold text-[#001F3F] dark:text-white">
//                   {editMode ? '✏️' : '👁️'}
//                 </p>
//                 <div className="flex gap-2 mt-2">
//                   <button 
//                     onClick={() => isLoggedIn ? setEditMode(!editMode) : showMessage('Connectez-vous pour modifier', 'warning')}
//                     className={`px-4 py-2 text-sm rounded-lg transition-colors ${
//                       editMode 
//                         ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300'
//                         : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300'
//                     } ${!isLoggedIn && 'opacity-50 cursor-not-allowed'}`}
//                   >
//                     {editMode ? 'Annuler' : 'Modifier'}
//                   </button>
//                   {editMode && isLoggedIn && (
//                     <button 
//                       onClick={saveProfile}
//                       className="px-4 py-2 text-sm bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors dark:bg-green-900/20 dark:text-green-300"
//                     >
//                       Sauvegarder
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Onglets */}
//           <div className="bg-white rounded-xl shadow-lg p-2 border border-gray-200 dark:bg-[#1a2f44] dark:border-gray-700">
//             <div className="flex flex-wrap gap-2">
//               <button
//                 onClick={() => setActiveTab('profile')}
//                 className={`flex items-center gap-3 px-5 py-3 rounded-lg transition-all font-medium ${
//                   activeTab === 'profile'
//                     ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
//                     : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200'
//                 }`}
//               >
//                 <User size={20} />
//                 <span>Profil</span>
//               </button>
              
//               {isLoggedIn && (
//                 <>
//                   <button
//                     onClick={() => setActiveTab('security')}
//                     className={`flex items-center gap-3 px-5 py-3 rounded-lg transition-all font-medium ${
//                       activeTab === 'security'
//                         ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
//                         : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200'
//                     }`}
//                   >
//                     <Lock size={20} />
//                     <span>Sécurité</span>
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Contenu Profil */}
//           {activeTab === 'profile' && (
//             <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 dark:bg-[#1a2f44] dark:border-gray-700">
//               <div className="flex items-center justify-between mb-8">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Informations personnelles</h2>
//                   <p className="text-gray-600 dark:text-gray-400 mt-1">
//                     {isLoggedIn 
//                       ? 'Vos données sont sauvegardées dans la base de données' 
//                       : 'Connectez-vous pour sauvegarder vos modifications'
//                     }
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   {!isLoggedIn && (
//                     <button 
//                       onClick={handleLogin}
//                       className="px-4 py-2 text-sm bg-gradient-to-r from-[#E30613] to-red-600 text-white rounded-lg hover:from-red-600 hover:to-[#E30613] transition-all"
//                     >
//                       Se connecter
//                     </button>
//                   )}
//                 </div>
//               </div>
              
//               {/* Formulaire - structure identique à votre code original */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* ... Votre code de formulaire existant ... */}
//               </div>
              
//               {/* Boutons de sauvegarde */}
//               {isLoggedIn && editMode && (
//                 <div className="flex gap-3 justify-end mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
//                   <button
//                     onClick={() => {
//                       setEditMode(false);
//                       loadProfile();
//                     }}
//                     className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg font-medium"
//                   >
//                     <X size={20} />
//                     Annuler
//                   </button>
                  
//                   <button
//                     onClick={saveProfile}
//                     disabled={loading}
//                     className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-500 transition-all shadow-lg font-medium disabled:opacity-50"
//                   >
//                     {loading ? (
//                       <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
//                     ) : (
//                       <Save size={20} />
//                     )}
//                     Sauvegarder
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Autres onglets... */}
//         </div>
//       </main>

//       {/* Modales et messages toast... */}
//     </div>
//   );
// };

// export default Profile;


// // src/components/admin/Profile.jsx - VERSION COMPLÈTE CORRIGÉE
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { 
//   User, Mail, Phone, Camera, Save, Edit, X,
//   FolderOpen, Eye, Github, Linkedin, Globe,
//   GraduationCap, CheckCircle, Bell, Lock, Trash2, LogOut, AlertCircle
// } from 'lucide-react';
// import authService from '../../services/auth';
// import api from '../../services/api';

// const Profile = () => {
//   // États principaux
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [activeTab, setActiveTab] = useState('profile');
//   const [uploadingImage, setUploadingImage] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showBioModal, setShowBioModal] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [message, setMessage] = useState({ text: '', type: '' });
//   const [userStats, setUserStats] = useState({
//     projectsCount: 0,
//     totalDownloads: 0,
//     totalViews: 0
//   });
//   const [apiStatus, setApiStatus] = useState('checking');

//   const fileInputRef = useRef(null);
//   const navigate = useNavigate();

//   // Données du formulaire
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     phone: '',
//     bio: '',
//     location: '',
//     company: '',
//     position: '',
//     website: '',
//     github: '',
//     linkedin: '',
//     twitter: '',
//     cohort: '',
//     specialite: '',
//     date_entree: '',
//     date_sortie: '',
//   });

//   // ✅ AFFICHER UN MESSAGE
//   const showMessage = useCallback((text, type = 'info') => {
//     setMessage({ text, type });
//     setTimeout(() => setMessage({ text: '', type: '' }), 4000);
//   }, []);

//   // ✅ VÉRIFIER LE MODE D'AUTHENTIFICATION - VERSION CORRIGÉE
//   // const getAuthMode = useCallback(() => {
//   //   const token = authService.getAccessToken();
//   //   const user = authService.getCurrentUser();
    
//   //   console.log('🔍 Vérification auth - Token:', token ? 'OUI' : 'NON');
//   //   console.log('🔍 Vérification auth - User:', user);
//   //   console.log('🔍 Vérification auth - isAuthenticated:', authService.isAuthenticated());
    
//   //   if (!token || !user) {
//   //     console.log('🔍 Aucun token ou utilisateur');
//   //     return { isLoggedIn: false, isSimulation: false };
//   //   }
    
//   //   // Vérifier si c'est un token de simulation
//   //   const isSimulation = token.startsWith('mock_') || 
//   //                        token.startsWith('simplon_mock_') || 
//   //                        token.startsWith('mock_token_') ||
//   //                        user._source === 'simulation';
    
//   //   console.log('🔍 Mode détecté:', isSimulation ? 'Simulation' : 'JWT');
    
//   //   return {
//   //     isLoggedIn: true,
//   //     isSimulation,
//   //     user,
//   //     token
//   //   };
//   // }, []);

//   // RÉPLACEZ la fonction getAuthMode par ceci :
// const getAuthMode = useCallback(() => {
//   // Chercher le token dans TOUTES les clés possibles
//   const token = 
//     localStorage.getItem('access_token') ||
//     localStorage.getItem('simplon_access_token') ||
//     localStorage.getItem('token') ||
//     localStorage.getItem('authToken') ||
//     localStorage.getItem('jwt');
  
//   // Chercher l'utilisateur dans TOUTES les clés possibles
//   let user = null;
//   const userKeys = ['simplon_user', 'user', 'currentUser', 'authUser'];
  
//   for (const key of userKeys) {
//     const userStr = localStorage.getItem(key);
//     if (userStr) {
//       try {
//         user = JSON.parse(userStr);
//         break;
//       } catch (e) {
//         console.log(`Erreur parsing ${key}:`, e);
//       }
//     }
//   }
  
//   console.log('🔍 DEBUG - Token trouvé:', token ? 'OUI' : 'NON');
//   console.log('🔍 DEBUG - Token valeur:', token?.substring(0, 50) + '...');
//   console.log('🔍 DEBUG - User trouvé:', user ? 'OUI' : 'NON');
//   console.log('🔍 DEBUG - User:', user);
  
//   if (!token || !user) {
//     console.log('🔍 Mode invité (pas de token ou user)');
//     return { isLoggedIn: false, isSimulation: false };
//   }
  
//   // Détecter si c'est un token de simulation
//   const isSimulation = 
//     token.startsWith('mock_') || 
//     token.startsWith('mock_token_') ||
//     token.startsWith('simplon_mock_') ||
//     token.length < 50 || // Les vrais JWT sont longs
//     (user && user._source === 'simulation');
  
//   console.log('🔍 Mode détecté:', isSimulation ? 'Simulation 🎭' : 'JWT Django 🚀');
  
//   return {
//     isLoggedIn: true,
//     isSimulation,
//     user,
//     token
//   };
// }, []);

//   // ✅ DONNÉES DE DÉMONSTRATION
//   const getDemoUser = useCallback(() => ({
//     id: 'demo',
//     username: 'invité',
//     first_name: 'Invité',
//     last_name: 'Utilisateur',
//     email: 'invite@example.com',
//     avatar_url: null,
//     bio: 'Connectez-vous pour accéder à votre profil complet et sauvegarder vos modifications.',
//     cohort: 'Demo 2024',
//     specialite: 'Développement Web',
//     isAdmin: false,
//     role: 'guest',
//     _source: 'demo'
//   }), []);

//   // ✅ CHARGER LE PROFIL - VERSION CORRIGÉE
//   const loadProfile = useCallback(async () => {
//     try {
//       setLoading(true);
      
//       const { isLoggedIn, isSimulation, user: authUser } = getAuthMode();
      
//       console.log('🔍 loadProfile - isLoggedIn:', isLoggedIn);
//       console.log('🔍 loadProfile - isSimulation:', isSimulation);
//       console.log('🔍 loadProfile - authUser:', authUser);
      
//       if (!isLoggedIn) {
//         // Mode invité
//         console.log('👤 Mode invité activé');
//         setUser(getDemoUser());
//         setApiStatus('guest');
//         showMessage('👋 Connectez-vous pour accéder à votre profil complet', 'info');
//         setLoading(false);
//         return;
//       }
      
//       if (isSimulation) {
//         // MODE SIMULATION - Données mockées
//         console.log('🎭 Mode simulation - Chargement données locales');
        
//         // Vérifier si nous avons des données étendues dans localStorage
//         const storedUser = JSON.parse(localStorage.getItem('simplon_user') || '{}');
//         const extendedData = JSON.parse(localStorage.getItem('simplon_profile_extended') || '{}');
        
//         // Fusionner les données
//         const mockUser = {
//           ...authUser,
//           ...storedUser,
//           ...extendedData,
//           // Assurer les champs de base
//           id: authUser.id || storedUser.id || 1,
//           username: authUser.username || storedUser.username || 'admin',
//           email: authUser.email || storedUser.email || 'admin@simplon.com',
//           first_name: authUser.first_name || storedUser.first_name || 'Admin',
//           last_name: authUser.last_name || storedUser.last_name || 'System',
//           is_staff: authUser.is_staff || storedUser.is_staff || true,
//           is_superuser: authUser.is_superuser || storedUser.is_superuser || true,
//           is_active: authUser.is_active !== undefined ? authUser.is_active : true,
//           cohort: authUser.cohort || storedUser.cohort || extendedData.cohort || 'Simplon 2024',
//           _source: 'simulation'
//         };
        
//         setUser(mockUser);
        
//         // Mettre à jour le formulaire avec TOUTES les données disponibles
//         setFormData({
//           first_name: mockUser.first_name || '',
//           last_name: mockUser.last_name || '',
//           email: mockUser.email || '',
//           phone: extendedData.phone || mockUser.phone || '',
//           bio: extendedData.bio || mockUser.bio || '',
//           location: extendedData.location || mockUser.location || '',
//           company: extendedData.company || mockUser.company || '',
//           position: extendedData.position || mockUser.position || '',
//           website: extendedData.website || mockUser.website || '',
//           github: extendedData.github || mockUser.github || '',
//           linkedin: extendedData.linkedin || mockUser.linkedin || '',
//           twitter: extendedData.twitter || mockUser.twitter || '',
//           cohort: mockUser.cohort || '',
//           specialite: extendedData.specialite || mockUser.specialite || '',
//           date_entree: extendedData.date_entree || mockUser.date_entree || '',
//           date_sortie: extendedData.date_sortie || mockUser.date_sortie || '',
//         });
        
//         // Charger les projets de l'utilisateur pour les statistiques
//         try {
//           const userProjects = await api.projects.getUserProjects();
//           const projectsCount = Array.isArray(userProjects) ? userProjects.length : 
//                               (userProjects?.results?.length || userProjects?.projects?.length || 0);
          
//           setUserStats({
//             projectsCount: projectsCount || 12,
//             totalDownloads: 345,
//             totalViews: 1234
//           });
//         } catch (statsError) {
//           console.log('📊 Stats projets non disponibles, valeurs par défaut');
//           setUserStats({
//             projectsCount: 12,
//             totalDownloads: 345,
//             totalViews: 1234
//           });
//         }
        
//         setApiStatus('simulation');
//         showMessage('✅ Profil chargé (mode simulation)', 'success');
//         setLoading(false);
//         return;
//       }
      
//       // MODE JWT - API Django
//       console.log('🚀 Mode JWT - Tentative de connexion à Django...');
      
//       try {
//         // Tester la connexion
//         const testResult = await api.testConnection();
//         if (!testResult.success) {
//           throw new Error('API Django inaccessible');
//         }
        
//         // Charger le profil depuis l'API
//         console.log('📥 Chargement du profil depuis Django...');
//         const profileData = await api.users.getProfile();
        
//         console.log('✅ Données profil API:', profileData);
        
//         setUser(profileData);
        
//         // Mettre à jour le formulaire
//         setFormData({
//           first_name: profileData.first_name || '',
//           last_name: profileData.last_name || '',
//           email: profileData.email || '',
//           phone: profileData.phone || '',
//           bio: profileData.bio || '',
//           location: profileData.location || '',
//           company: profileData.company || '',
//           position: profileData.position || '',
//           website: profileData.website || '',
//           github: profileData.github || '',
//           linkedin: profileData.linkedin || '',
//           twitter: profileData.twitter || '',
//           cohort: profileData.cohort || '',
//           specialite: profileData.specialite || '',
//           date_entree: profileData.date_entree || '',
//           date_sortie: profileData.date_sortie || '',
//         });
        
//         // Charger les statistiques
//         try {
//           const userProjects = await api.projects.getUserProjects();
//           const projects = Array.isArray(userProjects) ? userProjects : 
//                           userProjects?.results || userProjects?.projects || [];
          
//           setUserStats({
//             projectsCount: projects.length,
//             totalDownloads: projects.reduce((sum, p) => sum + (p.downloads || 0), 0),
//             totalViews: projects.reduce((sum, p) => sum + (p.views || 0), 0)
//           });
//         } catch (statsError) {
//           console.warn('⚠️ Impossible de charger les statistiques:', statsError);
//         }
        
//         setApiStatus('jwt');
//         showMessage('✅ Profil chargé depuis Django JWT', 'success');
        
//       } catch (apiError) {
//         console.error('❌ Erreur API Django:', apiError);
        
//         if (apiError.response?.status === 401) {
//           showMessage('🔒 Session expirée. Veuillez vous reconnecter.', 'error');
//           authService.logout();
//           navigate('/login');
//         } else {
//           showMessage('⚠️ API inaccessible. Mode simulation activé.', 'warning');
//           // Basculer en mode simulation
//           const currentUser = authService.getCurrentUser();
//           if (currentUser) {
//             console.log('🔄 Basculement en mode simulation');
//             localStorage.setItem('simplon_access_token', `mock_token_${Date.now()}`);
//             loadProfile();
//           }
//         }
//       }
      
//     } catch (error) {
//       console.error('❌ Erreur chargement profil:', error);
//       showMessage('❌ Erreur lors du chargement du profil', 'error');
//       setUser(getDemoUser());
//     } finally {
//       setLoading(false);
//     }
//   }, [getAuthMode, showMessage, navigate, getDemoUser]);

//   // ✅ SAUVEGARDER LE PROFIL
//   const saveProfile = useCallback(async () => {
//     const { isLoggedIn, isSimulation } = getAuthMode();
    
//     if (!isLoggedIn) {
//       showMessage('🔒 Connectez-vous pour sauvegarder', 'error');
//       navigate('/login');
//       return;
//     }
    
//     try {
//       setLoading(true);
      
//       if (isSimulation) {
//         // Sauvegarde en mode simulation
//         const currentUser = JSON.parse(localStorage.getItem('simplon_user') || '{}');
//         const extendedData = JSON.parse(localStorage.getItem('simplon_profile_extended') || '{}');
        
//         // Mettre à jour l'utilisateur de base
//         const updatedUser = {
//           ...currentUser,
//           first_name: formData.first_name,
//           last_name: formData.last_name,
//           email: formData.email,
//           cohort: formData.cohort || currentUser.cohort
//         };
        
//         // Mettre à jour les données étendues
//         const updatedExtended = {
//           ...extendedData,
//           phone: formData.phone || null,
//           bio: formData.bio || null,
//           location: formData.location || null,
//           company: formData.company || null,
//           position: formData.position || null,
//           website: formData.website || null,
//           github: formData.github || null,
//           linkedin: formData.linkedin || null,
//           twitter: formData.twitter || null,
//           specialite: formData.specialite || null,
//           date_entree: formData.date_entree || null,
//           date_sortie: formData.date_sortie || null,
//         };
        
//         // Sauvegarder
//         localStorage.setItem('simplon_user', JSON.stringify(updatedUser));
//         localStorage.setItem('simplon_profile_extended', JSON.stringify(updatedExtended));
        
//         // Mettre à jour l'état
//         setUser(updatedUser);
        
//         showMessage('✅ Profil sauvegardé (mode simulation)', 'success');
//         setEditMode(false);
        
//       } else {
//         // Sauvegarde via API Django JWT
//         const dataToSend = {
//           first_name: formData.first_name,
//           last_name: formData.last_name,
//           email: formData.email,
//           phone: formData.phone || null,
//           bio: formData.bio || null,
//           location: formData.location || null,
//           company: formData.company || null,
//           position: formData.position || null,
//           website: formData.website || null,
//           github: formData.github || null,
//           linkedin: formData.linkedin || null,
//           twitter: formData.twitter || null,
//           cohort: formData.cohort || null,
//           specialite: formData.specialite || null,
//           date_entree: formData.date_entree || null,
//           date_sortie: formData.date_sortie || null,
//         };
        
//         // Filtrer les valeurs nulles
//         const filteredData = Object.fromEntries(
//           Object.entries(dataToSend).filter(([_, v]) => v !== null && v !== '')
//         );
        
//         console.log('📤 Envoi des données à Django:', filteredData);
        
//         const response = await api.users.updateProfile(filteredData);
//         console.log('✅ Réponse Django:', response);
        
//         showMessage('✅ Profil sauvegardé avec succès!', 'success');
        
//         // Recharger les données
//         await loadProfile();
//         setEditMode(false);
//       }
      
//     } catch (error) {
//       console.error('❌ Erreur sauvegarde:', error);
      
//       if (error.response?.status === 401) {
//         showMessage('🔒 Session expirée. Reconnexion nécessaire.', 'error');
//         handleLogout();
//       } else {
//         showMessage(`❌ Erreur: ${error.response?.data?.detail || error.message}`, 'error');
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [formData, getAuthMode, showMessage, navigate, loadProfile]);

//   // ✅ GÉRER LE CHANGEMENT D'INPUT
//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   // ✅ SÉLECTIONNER UNE IMAGE
//   const handleImageSelect = (event) => {
//     const file = event.target.files[0];
    
//     if (file) {
//       if (!file.type.startsWith('image/')) {
//         showMessage('⚠️ Veuillez sélectionner une image valide', 'error');
//         return;
//       }
      
//       if (file.size > 5 * 1024 * 1024) {
//         showMessage('⚠️ L\'image est trop volumineuse (max 5MB)', 'error');
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

//   // ✅ UPLOADER UNE PHOTO
//   const handleImageUpload = useCallback(async (file) => {
//     const { isSimulation } = getAuthMode();
    
//     try {
//       setUploadingImage(true);
      
//       if (isSimulation) {
//         // Simulation d'upload
//         setTimeout(() => {
//           showMessage('✅ Photo mise à jour (simulation)', 'success');
//           setImagePreview(URL.createObjectURL(file));
//           setUploadingImage(false);
//           setShowEditModal(false);
//         }, 1500);
//       } else {
//         // Upload réel vers Django
//         const response = await api.users.uploadAvatar(file);
//         console.log('✅ Photo uploadée:', response);
        
//         showMessage('✅ Photo de profil mise à jour!', 'success');
//         await loadProfile();
//       }
      
//     } catch (error) {
//       console.error('❌ Erreur upload:', error);
//       showMessage(`❌ Erreur: ${error.response?.data?.message || error.message}`, 'error');
//     } finally {
//       if (!isSimulation) {
//         setUploadingImage(false);
//         setShowEditModal(false);
//       }
//     }
//   }, [getAuthMode, showMessage, loadProfile]);

//   // ✅ SUPPRIMER LA PHOTO
//   const deleteProfilePicture = useCallback(async () => {
//     const { isSimulation } = getAuthMode();
    
//     if (isSimulation) {
//       showMessage('🗑️ Photo supprimée (simulation)', 'success');
//       setImagePreview(null);
//     } else {
//       showMessage('⚠️ Fonctionnalité non disponible', 'warning');
//     }
//   }, [getAuthMode, showMessage]);

//   // ✅ SE DÉCONNECTER
//   const handleLogout = useCallback(() => {
//     authService.logout();
//     showMessage('✅ Déconnecté avec succès', 'success');
//     setTimeout(() => navigate('/login'), 1000);
//   }, [navigate, showMessage]);

//   // ✅ SE CONNECTER
//   const handleLogin = () => {
//     navigate('/login');
//   };

//   // ✅ SAUVEGARDER LA BIO
//   const saveBio = async () => {
//     try {
//       setLoading(true);
//       await saveProfile();
//       setShowBioModal(false);
//     } catch (error) {
//       console.error('Erreur sauvegarde bio:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ EFFET INITIAL
//   useEffect(() => {
//     console.log('🏁 Initialisation du composant Profile');
//     loadProfile();
//   }, [loadProfile]);

//   // ✅ ÉTAT D'AUTHENTIFICATION
//   const { isLoggedIn, isSimulation } = getAuthMode();

//   // ✅ PHOTO DE PROFIL À AFFICHER
//   const displayProfilePicture = imagePreview || 
//     (user?.avatar_url && !user.avatar_url.includes('googleusercontent.com') ? user.avatar_url : null) ||
//     'https://ui-avatars.com/api/?name=' + encodeURIComponent(`${formData.first_name}+${formData.last_name}`) + 
//     '&background=random&color=fff&size=128';

//   // ⏳ ÉCRAN DE CHARGEMENT
//   if (loading && !user) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E30613] mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Chargement du profil...</p>
//           <p className="text-gray-400 text-sm mt-2">
//             {apiStatus === 'checking' ? 'Vérification de la connexion...' : 
//              apiStatus === 'jwt' ? 'Connexion à Django...' : 
//              apiStatus === 'simulation' ? 'Mode simulation' : 'Mode invité'}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
//       {/* Bandeau d'information */}
//       {isSimulation && isLoggedIn && (
//         <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-sm text-yellow-800">
//           <div className="flex items-center justify-center gap-2">
//             <AlertCircle size={16} />
//             <span className="font-medium">Mode simulation activé</span>
//             <span className="text-yellow-600">- Les modifications sont sauvegardées localement</span>
//           </div>
//         </div>
//       )}
      
//       {apiStatus === 'jwt' && (
//         <div className="bg-green-50 border-b border-green-200 px-4 py-2 text-sm text-green-800">
//           <div className="flex items-center justify-center gap-2">
//             <CheckCircle size={16} />
//             <span className="font-medium">Connecté à Django JWT</span>
//             <span className="text-green-600">- Données sauvegardées sur le serveur</span>
//           </div>
//         </div>
//       )}

//       <main className="p-6">
//         <div className="mx-auto max-w-6xl space-y-6">
          
//           {/* Header Section */}
//           <section className="rounded-xl bg-white p-8 shadow-sm dark:bg-[#1a2f44]">
//             <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
              
//               {/* Photo de profil */}
//               <div className="relative group">
//                 <div 
//                   className="h-28 w-28 shrink-0 rounded-full bg-cover bg-center bg-no-repeat ring-4 ring-white dark:ring-gray-800 shadow-lg cursor-pointer transition-transform group-hover:scale-105"
//                   style={{ backgroundImage: `url(${displayProfilePicture})` }}
//                   onClick={() => isLoggedIn ? setShowEditModal(true) : showMessage('Connectez-vous pour modifier', 'warning')}
//                   title={isLoggedIn ? "Modifier la photo" : "Connectez-vous"}
//                 />
//                 <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
//                   <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
//                 </div>
//                 {isLoggedIn && (
//                   <div className="absolute -bottom-2 -right-2 bg-[#E30613] text-white rounded-full p-2 shadow-lg">
//                     <Edit size={14} />
//                   </div>
//                 )}
//               </div>
              
//               {/* Informations */}
//               <div className="flex-grow space-y-4 text-center sm:text-left">
//                 <div>
//                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
//                     <h2 className="text-2xl font-bold text-[#001F3F] dark:text-white">
//                       {formData.first_name} {formData.last_name}
//                     </h2>
//                     <div className="flex items-center gap-2">
//                       {isLoggedIn && (
//                         <button 
//                           onClick={handleLogout}
//                           className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
//                         >
//                           <LogOut size={16} />
//                           Déconnexion
//                         </button>
//                       )}
//                       {apiStatus === 'jwt' && (
//                         <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
//                           ✅ Django JWT
//                         </span>
//                       )}
//                       {isSimulation && (
//                         <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
//                           🎭 Simulation
//                         </span>
//                       )}
//                     </div>
//                   </div>
                  
//                   <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
//                     <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 rounded-full text-sm font-medium">
//                       <User size={14} />
//                       {user?.username || 'Utilisateur'}
//                     </span>
//                     {formData.cohort && (
//                       <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 rounded-full text-sm font-medium">
//                         <GraduationCap size={14} />
//                         {formData.cohort}
//                       </span>
//                     )}
//                     <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
//                       isLoggedIn 
//                         ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
//                         : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
//                     }`}>
//                       {isLoggedIn ? '✅ Connecté' : '👤 Invité'}
//                     </span>
//                   </div>
                  
//                   <p className="text-gray-600 dark:text-gray-400 mt-3 flex items-center gap-2 justify-center sm:justify-start">
//                     <Mail size={18} />
//                     {formData.email || 'Non renseigné'}
//                   </p>
                  
//                   {formData.phone && (
//                     <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2 justify-center sm:justify-start">
//                       <Phone size={18} />
//                       {formData.phone}
//                     </p>
//                   )}
//                 </div>

//                 {/* Bio */}
//                 <div className="max-w-2xl">
//                   <div className="flex items-center justify-between mb-3">
//                     <h3 className="font-semibold text-[#001F3F] dark:text-white flex items-center gap-2">
//                       Bio
//                     </h3>
//                     {isLoggedIn && (
//                       <button 
//                         onClick={() => setShowBioModal(true)}
//                         className="flex items-center gap-1 text-[#E30613] hover:text-[#E30613]/80 text-sm font-medium transition-colors"
//                       >
//                         <Edit size={14} />
//                         {formData.bio ? 'Modifier' : 'Ajouter une bio'}
//                       </button>
//                     )}
//                   </div>
                  
//                   {formData.bio ? (
//                     <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-line bg-gray-50 dark:bg-[#0d1a29] rounded-lg p-4 border border-gray-200 dark:border-gray-700">
//                       {formData.bio}
//                     </p>
//                   ) : (
//                     <div 
//                       className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-[#E30613] transition-colors"
//                       onClick={() => isLoggedIn ? setShowBioModal(true) : showMessage('Connectez-vous pour modifier', 'warning')}
//                     >
//                       <Edit size={32} className="text-gray-400 mb-2 mx-auto" />
//                       <p className="text-gray-400 dark:text-gray-500 text-sm">
//                         {isLoggedIn ? 'Cliquez pour ajouter une bio' : 'Connectez-vous pour modifier votre profil'}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
              
//               {/* Boutons d'action */}
//               <div className="flex flex-col gap-3 w-full sm:w-auto">
//                 {isLoggedIn ? (
//                   <>
//                     <button 
//                       onClick={() => setShowEditModal(true)}
//                       className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#E30613] px-6 text-sm font-semibold text-white hover:bg-[#E30613]/90 transition-colors shadow-sm w-full sm:w-auto"
//                     >
//                       <Camera size={18} />
//                       <span>Modifier la photo</span>
//                     </button>
//                     <button 
//                       onClick={() => setEditMode(true)}
//                       className="flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm w-full sm:w-auto dark:border-gray-600 dark:bg-[#1a2f44] dark:text-white dark:hover:bg-[#253b52]"
//                     >
//                       <Edit size={18} />
//                       <span>Modifier le profil</span>
//                     </button>
//                   </>
//                 ) : (
//                   <button 
//                     onClick={handleLogin}
//                     className="flex h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#E30613] to-red-600 px-6 text-sm font-semibold text-white hover:from-red-600 hover:to-[#E30613] transition-all shadow-lg w-full sm:w-auto"
//                   >
//                     <User size={18} />
//                     <span>Se connecter</span>
//                   </button>
//                 )}
//               </div>
//             </div>
//           </section>

//           {/* Statistiques */}
//           <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
//             <div className="flex items-center gap-6 rounded-xl bg-white p-6 shadow-sm dark:bg-[#1a2f44] hover:shadow-md transition-shadow">
//               <div className="flex items-center justify-center w-14 h-14 bg-red-50 dark:bg-[#E30613]/10 rounded-xl">
//                 <FolderOpen className="text-2xl text-[#E30613]" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Projets créés</p>
//                 <p className="text-3xl font-bold text-[#001F3F] dark:text-white">
//                   {userStats.projectsCount.toLocaleString()}
//                 </p>
//                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                   {isLoggedIn ? (isSimulation ? 'Données simulées' : 'Base de données') : 'Mode invité'}
//                 </p>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-6 rounded-xl bg-white p-6 shadow-sm dark:bg-[#1a2f44] hover:shadow-md transition-shadow">
//               <div className="flex items-center justify-center w-14 h-14 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
//                 <User className="text-2xl text-blue-600 dark:text-blue-400" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Mode</p>
//                 <p className="text-3xl font-bold text-[#001F3F] dark:text-white">
//                   {apiStatus === 'jwt' ? '🚀' : apiStatus === 'simulation' ? '🎭' : '👤'}
//                 </p>
//                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                   {apiStatus === 'jwt' ? 'Django JWT' : 
//                    apiStatus === 'simulation' ? 'Simulation' : 'Invité'}
//                 </p>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-6 rounded-xl bg-white p-6 shadow-sm dark:bg-[#1a2f44] hover:shadow-md transition-shadow">
//               <div className="flex items-center justify-center w-14 h-14 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
//                 <Eye className="text-2xl text-purple-600 dark:text-purple-400" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Actions</p>
//                 <p className="text-3xl font-bold text-[#001F3F] dark:text-white">
//                   {editMode ? '✏️' : '👁️'}
//                 </p>
//                 <div className="flex gap-2 mt-2">
//                   <button 
//                     onClick={() => isLoggedIn ? setEditMode(!editMode) : showMessage('Connectez-vous pour modifier', 'warning')}
//                     className={`px-4 py-2 text-sm rounded-lg transition-colors ${
//                       editMode 
//                         ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300'
//                         : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300'
//                     } ${!isLoggedIn && 'opacity-50 cursor-not-allowed'}`}
//                   >
//                     {editMode ? 'Annuler' : 'Modifier'}
//                   </button>
//                   {editMode && isLoggedIn && (
//                     <button 
//                       onClick={saveProfile}
//                       disabled={loading}
//                       className="px-4 py-2 text-sm bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors dark:bg-green-900/20 dark:text-green-300 disabled:opacity-50"
//                     >
//                       {loading ? '...' : 'Sauvegarder'}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Onglets */}
//           <div className="bg-white rounded-xl shadow-lg p-2 border border-gray-200 dark:bg-[#1a2f44] dark:border-gray-700">
//             <div className="flex flex-wrap gap-2">
//               <button
//                 onClick={() => setActiveTab('profile')}
//                 className={`flex items-center gap-3 px-5 py-3 rounded-lg transition-all font-medium ${
//                   activeTab === 'profile'
//                     ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
//                     : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200'
//                 }`}
//               >
//                 <User size={20} />
//                 <span>Profil</span>
//               </button>
              
//               {isLoggedIn && (
//                 <button
//                   onClick={() => setActiveTab('security')}
//                   className={`flex items-center gap-3 px-5 py-3 rounded-lg transition-all font-medium ${
//                     activeTab === 'security'
//                       ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
//                       : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200'
//                   }`}
//                 >
//                   <Lock size={20} />
//                   <span>Sécurité</span>
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Contenu Profil */}
//           {activeTab === 'profile' && (
//             <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 dark:bg-[#1a2f44] dark:border-gray-700">
//               <div className="flex items-center justify-between mb-8">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Informations personnelles</h2>
//                   <p className="text-gray-600 dark:text-gray-400 mt-1">
//                     {apiStatus === 'jwt' 
//                       ? 'Vos données sont sauvegardées dans la base de données Django' 
//                       : apiStatus === 'simulation'
//                       ? 'Mode simulation - Les données sont sauvegardées localement'
//                       : 'Connectez-vous pour sauvegarder vos modifications'
//                     }
//                   </p>
//                 </div>
//                 {!isLoggedIn && (
//                   <button 
//                     onClick={handleLogin}
//                     className="px-4 py-2 text-sm bg-gradient-to-r from-[#E30613] to-red-600 text-white rounded-lg hover:from-red-600 hover:to-[#E30613] transition-all"
//                   >
//                     Se connecter
//                   </button>
//                 )}
//               </div>
              
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* Section informations de base */}
//                 <div className="space-y-6">
//                   <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 dark:from-blue-900/10 dark:to-indigo-900/10 dark:border-blue-800/20">
//                     <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
//                       <div className="p-2 bg-white dark:bg-[#0d1a29] rounded-lg shadow-sm">
//                         <User size={20} className="text-blue-600 dark:text-blue-400" />
//                       </div>
//                       Informations de base
//                     </h3>
                    
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Prénom
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.first_name}
//                           onChange={(e) => handleInputChange('first_name', e.target.value)}
//                           disabled={!editMode || !isLoggedIn}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="Votre prénom"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Nom
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.last_name}
//                           onChange={(e) => handleInputChange('last_name', e.target.value)}
//                           disabled={!editMode || !isLoggedIn}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="Votre nom"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Email
//                         </label>
//                         <input
//                           type="email"
//                           value={formData.email}
//                           onChange={(e) => handleInputChange('email', e.target.value)}
//                           disabled={!editMode || !isLoggedIn}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="votre@email.com"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Téléphone
//                         </label>
//                         <input
//                           type="tel"
//                           value={formData.phone}
//                           onChange={(e) => handleInputChange('phone', e.target.value)}
//                           disabled={!editMode || !isLoggedIn}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="+33 1 23 45 67 89"
//                         />
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Section informations supplémentaires */}
//                   <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 dark:from-purple-900/10 dark:to-pink-900/10 dark:border-purple-800/20">
//                     <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Informations supplémentaires</h3>
                    
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Localisation
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.location}
//                           onChange={(e) => handleInputChange('location', e.target.value)}
//                           disabled={!editMode || !isLoggedIn}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="Ville, Pays"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Entreprise
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.company}
//                           onChange={(e) => handleInputChange('company', e.target.value)}
//                           disabled={!editMode || !isLoggedIn}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="Nom de l'entreprise"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Poste
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.position}
//                           onChange={(e) => handleInputChange('position', e.target.value)}
//                           disabled={!editMode || !isLoggedIn}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="Votre poste"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Section informations Simplon et liens */}
//                 <div className="space-y-6">
//                   <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 dark:from-green-900/10 dark:to-emerald-900/10 dark:border-green-800/20">
//                     <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
//                       <div className="p-2 bg-white dark:bg-[#0d1a29] rounded-lg shadow-sm">
//                         <GraduationCap size={20} className="text-green-600 dark:text-green-400" />
//                       </div>
//                       Informations Simplon
//                     </h3>
                    
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Promotion
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.cohort}
//                           onChange={(e) => handleInputChange('cohort', e.target.value)}
//                           disabled={!editMode || !isLoggedIn}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="Ex: Admin 2024"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                           Spécialité
//                         </label>
//                         <input
//                           type="text"
//                           value={formData.specialite}
//                           onChange={(e) => handleInputChange('specialite', e.target.value)}
//                           disabled={!editMode || !isLoggedIn}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="Ex: Administration Système"
//                         />
//                       </div>
                      
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                             Date d'entrée
//                           </label>
//                           <input
//                             type="date"
//                             value={formData.date_entree}
//                             onChange={(e) => handleInputChange('date_entree', e.target.value)}
//                             disabled={!editMode || !isLoggedIn}
//                             className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           />
//                         </div>
                        
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                             Date de sortie
//                           </label>
//                           <input
//                             type="date"
//                             value={formData.date_sortie}
//                             onChange={(e) => handleInputChange('date_sortie', e.target.value)}
//                             disabled={!editMode || !isLoggedIn}
//                             className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Section liens */}
//                   <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100 dark:from-orange-900/10 dark:to-amber-900/10 dark:border-orange-800/20">
//                     <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Liens professionnels</h3>
                    
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
//                           <Github size={18} className="text-gray-700 dark:text-gray-300" />
//                           GitHub
//                         </label>
//                         <input
//                           type="url"
//                           value={formData.github}
//                           onChange={(e) => handleInputChange('github', e.target.value)}
//                           disabled={!editMode || !isLoggedIn}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 dark:focus:ring-gray-400 dark:focus:border-gray-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="https://github.com/votre-username"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
//                           <Linkedin size={18} className="text-blue-600 dark:text-blue-400" />
//                           LinkedIn
//                         </label>
//                         <input
//                           type="url"
//                           value={formData.linkedin}
//                           onChange={(e) => handleInputChange('linkedin', e.target.value)}
//                           disabled={!editMode || !isLoggedIn}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="https://linkedin.com/in/votre-profile"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
//                           <Globe size={18} className="text-green-600 dark:text-green-400" />
//                           Portfolio / Site web
//                         </label>
//                         <input
//                           type="url"
//                           value={formData.website}
//                           onChange={(e) => handleInputChange('website', e.target.value)}
//                           disabled={!editMode || !isLoggedIn}
//                           className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
//                           placeholder="https://votre-portfolio.com"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Boutons d'action pour la section profil */}
//               {isLoggedIn && editMode && (
//                 <div className="flex gap-3 justify-end mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
//                   <button
//                     onClick={() => {
//                       setEditMode(false);
//                       loadProfile();
//                     }}
//                     className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg font-medium"
//                   >
//                     <X size={20} />
//                     Annuler
//                   </button>
                  
//                   <button
//                     onClick={saveProfile}
//                     disabled={loading}
//                     className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-500 transition-all duration-300 shadow-lg hover:shadow-xl font-medium disabled:opacity-50"
//                   >
//                     {loading ? (
//                       <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
//                     ) : (
//                       <Save size={20} />
//                     )}
//                     {isSimulation ? 'Sauvegarder (simulation)' : 'Sauvegarder sur Django'}
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Section Sécurité */}
//           {activeTab === 'security' && isLoggedIn && (
//             <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 dark:bg-[#1a2f44] dark:border-gray-700">
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Sécurité du compte</h2>
              
//               {isSimulation ? (
//                 <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
//                   <div className="flex items-start gap-4">
//                     <AlertCircle size={24} className="text-yellow-600 dark:text-yellow-400 mt-1" />
//                     <div>
//                       <h3 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2">Mode simulation</h3>
//                       <p className="text-yellow-600 dark:text-yellow-400 text-sm mb-4">
//                         En mode simulation, les fonctionnalités de sécurité ne sont pas disponibles.
//                         Pour utiliser l'authentification complète, connectez-vous à l'API Django.
//                       </p>
//                       <button
//                         onClick={handleLogout}
//                         className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
//                       >
//                         Se déconnecter
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-6">
//                   <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
//                     <div className="flex items-start gap-4">
//                       <Lock size={24} className="text-red-600 dark:text-red-400 mt-1" />
//                       <div>
//                         <h3 className="font-semibold text-red-700 dark:text-red-300 mb-2">Changer le mot de passe</h3>
//                         <p className="text-red-600 dark:text-red-400 text-sm mb-4">
//                           Utilisez le formulaire de réinitialisation de mot de passe pour modifier vos identifiants.
//                         </p>
//                         <button
//                           onClick={handleLogout}
//                           className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
//                         >
//                           Se déconnecter
//                         </button>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
//                     <div className="flex items-start gap-4">
//                       <CheckCircle size={24} className="text-green-600 dark:text-green-400 mt-1" />
//                       <div>
//                         <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">Authentification JWT</h3>
//                         <p className="text-green-600 dark:text-green-400 text-sm mb-4">
//                           Vous êtes authentifié avec JSON Web Token. Votre session est sécurisée.
//                         </p>
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => authService.debug()}
//                             className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
//                           >
//                             Debug Token
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
          
//         </div>
//       </main>

//       {/* Modals */}
      
//       {/* Profile Picture Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//           <div className="bg-white dark:bg-[#1a2f44] rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-bold text-[#001F3F] dark:text-white flex items-center gap-2">
//                 <Camera size={20} />
//                 Photo de profil
//                 {isSimulation && (
//                   <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Simulation</span>
//                 )}
//               </h3>
//               <button 
//                 onClick={() => setShowEditModal(false)}
//                 className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             <div className="flex flex-col items-center gap-6 mb-6">
//               <div 
//                 className="h-32 w-32 rounded-full bg-cover bg-center bg-no-repeat border-4 border-gray-200 dark:border-gray-600 shadow-lg"
//                 style={{ backgroundImage: `url(${imagePreview || displayProfilePicture})` }}
//               />
              
//               <div className="flex flex-col gap-3 w-full">
//                 <label className="flex items-center justify-center gap-3 bg-[#E30613] text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-[#E30613]/90 transition-colors font-medium shadow-sm">
//                   <Camera size={20} />
//                   <span>Choisir une photo</span>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageSelect}
//                     className="hidden"
//                   />
//                 </label>
                
//                 <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
//                   Formats supportés: JPG, PNG, GIF • Max: 5MB
//                 </p>
//               </div>

//               {/* Bouton réinitialiser */}
//               {displayProfilePicture && !displayProfilePicture.includes('ui-avatars.com') && isLoggedIn && (
//                 <button 
//                   onClick={deleteProfilePicture}
//                   className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
//                 >
//                   <Trash2 size={16} />
//                   Supprimer la photo
//                 </button>
//               )}
//             </div>

//             <div className="flex gap-3 justify-end">
//               <button 
//                 onClick={() => setShowEditModal(false)}
//                 className="px-6 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
//               >
//                 Annuler
//               </button>
//               <button 
//                 onClick={() => {
//                   if (selectedImage) {
//                     handleImageUpload(selectedImage);
//                   } else {
//                     setShowEditModal(false);
//                   }
//                 }}
//                 disabled={uploadingImage}
//                 className="flex items-center gap-2 bg-[#E30613] text-white px-6 py-2.5 rounded-lg hover:bg-[#E30613]/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm"
//               >
//                 {uploadingImage ? (
//                   <>
//                     <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
//                     {isSimulation ? 'Simulation...' : 'Enregistrement...'}
//                   </>
//                 ) : (
//                   <>
//                     <Save size={20} />
//                     {isSimulation ? 'Simuler l\'upload' : 'Enregistrer'}
//                   </>
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
//               <h3 className="text-lg font-bold text-[#001F3F] dark:text-white flex items-center gap-2">
//                 <Edit size={20} />
//                 {formData.bio ? 'Modifier la bio' : 'Ajouter une bio'}
//               </h3>
//               <button 
//                 onClick={() => setShowBioModal(false)}
//                 className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             <div className="mb-6">
//               <textarea
//                 value={formData.bio}
//                 onChange={(e) => handleInputChange('bio', e.target.value)}
//                 rows="6"
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white resize-none transition-colors"
//                 placeholder="Parlez de vous, de vos compétences, de vos passions... (300 caractères maximum)"
//                 maxLength="300"
//               />
//               <div className="flex justify-between items-center mt-2">
//                 <p className="text-xs text-gray-500 dark:text-gray-400">
//                   Décrivez-vous en quelques mots
//                 </p>
//                 <p className={`text-xs ${formData.bio.length >= 280 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
//                   {formData.bio.length}/300 caractères
//                 </p>
//               </div>
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
//                 disabled={loading}
//                 className="flex items-center gap-2 bg-[#E30613] text-white px-6 py-2.5 rounded-lg hover:bg-[#E30613]/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm"
//               >
//                 {loading ? (
//                   <>
//                     <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
//                     Enregistrement...
//                   </>
//                 ) : (
//                   <>
//                     <Save size={20} />
//                     Enregistrer
//                   </>
//                 )}
//               </button> 
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Message Toast */}
//       {message.text && (
//         <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl max-w-sm ${
//           message.type === 'success' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-800 dark:text-green-300' :
//           message.type === 'error' ? 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 text-red-800 dark:from-red-900/20 dark:to-orange-900/20 dark:border-red-800 dark:text-red-300' :
//           message.type === 'warning' ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 text-yellow-800 dark:from-yellow-900/20 dark:to-amber-900/20 dark:border-yellow-800 dark:text-yellow-300' :
//           'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 text-blue-800 dark:from-blue-900/20 dark:to-cyan-900/20 dark:border-blue-800 dark:text-blue-300'
//         }`}>
//           <div className="flex items-center gap-3">
//             {message.type === 'success' ? (
//               <CheckCircle size={24} className="flex-shrink-0" />
//             ) : message.type === 'error' ? (
//               <X size={24} className="flex-shrink-0" />
//             ) : (
//               <Bell size={24} className="flex-shrink-0" />
//             )}
//             <div className="flex-1">
//               <p className="font-medium">{message.text}</p>
//             </div>
//             <button
//               onClick={() => setMessage({ text: '', type: '' })}
//               className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
//             >
//               <X size={20} />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Profile;


// src/components/admin/Profile.jsx - VERSION CORRIGÉE POUR AUTHENTIFICATION
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Camera, Save, Edit, X,
  FolderOpen, Eye, Github, Linkedin, Globe,
  GraduationCap, CheckCircle, Bell, Lock, Trash2, LogOut, AlertCircle
} from 'lucide-react';
import authService from '../../services/auth';

const Profile = () => {
  // États principaux
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBioModal, setShowBioModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [userStats, setUserStats] = useState({
    projectsCount: 0,
    totalDownloads: 0,
    totalViews: 0
  });
  const [apiStatus, setApiStatus] = useState('checking');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Données du formulaire
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    company: '',
    position: '',
    website: '',
    github: '',
    linkedin: '',
    twitter: '',
    cohort: '',
    specialite: '',
    date_entree: '',
    date_sortie: '',
  });

  // ✅ AFFICHER UN MESSAGE
  const showMessage = useCallback((text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  }, []);

  // ✅ VÉRIFIER L'AUTHENTIFICATION - SIMPLIFIÉ
  const checkAuthentication = useCallback(() => {
    const authenticated = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();
    
    console.log('🔍 Vérification auth:', {
      authenticated,
      user: currentUser,
      token: authService.getAccessToken()?.substring(0, 20) + '...'
    });
    
    setIsAuthenticated(authenticated);
    
    if (!authenticated) {
      showMessage('🔒 Veuillez vous connecter pour accéder à votre profil', 'warning');
      setTimeout(() => navigate('/login'), 1500);
    }
    
    return {
      isLoggedIn: authenticated,
      user: currentUser
    };
  }, [showMessage, navigate]);

  // ✅ CHARGER LE PROFIL DEPUIS LA BASE DE DONNÉES
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      
      const { isLoggedIn, user: authUser } = checkAuthentication();
      
      if (!isLoggedIn || !authUser) {
        setLoading(false);
        return;
      }
      
      console.log('📥 Chargement du profil pour:', authUser.username);
      
      try {
        // 1. Charger le profil utilisateur depuis l'API Django
        const profileResponse = await axios.get('http://localhost:8000/api/users/profile/', {
          headers: authService.getAuthHeaders()
        });
        
        const profileData = profileResponse.data;
        console.log('✅ Données récupérées depuis BD:', profileData);
        
        // 2. Mettre à jour l'état utilisateur
        setUser(profileData);
        
        // 3. Remplir le formulaire avec les données de la BD
        setFormData({
          first_name: profileData.first_name || authUser.first_name || '',
          last_name: profileData.last_name || authUser.last_name || '',
          email: profileData.email || authUser.email || '',
          phone: profileData.phone || '',
          bio: profileData.bio || '',
          location: profileData.location || '',
          company: profileData.company || '',
          position: profileData.position || '',
          website: profileData.website || '',
          github: profileData.github || '',
          linkedin: profileData.linkedin || '',
          twitter: profileData.twitter || '',
          cohort: profileData.cohort || authUser.cohort || '',
          specialite: profileData.specialite || '',
          date_entree: profileData.date_entree || '',
          date_sortie: profileData.date_sortie || '',
        });
        
        // 4. Charger les statistiques depuis la BD
        try {
          const projectsResponse = await axios.get('http://localhost:8000/api/projects/user/', {
            headers: authService.getAuthHeaders()
          });
          
          const projects = projectsResponse.data.results || projectsResponse.data || [];
          
          const stats = {
            projectsCount: projects.length,
            totalDownloads: projects.reduce((sum, p) => sum + (p.downloads || 0), 0),
            totalViews: projects.reduce((sum, p) => sum + (p.views || 0), 0)
          };
          
          setUserStats(stats);
        } catch (statsError) {
          console.warn('⚠️ Impossible de charger les statistiques:', statsError);
          setUserStats({
            projectsCount: 0,
            totalDownloads: 0,
            totalViews: 0
          });
        }
        
        setApiStatus('connected');
        showMessage('✅ Profil chargé depuis la base de données', 'success');
        
      } catch (apiError) {
        console.error('❌ Erreur API Django:', apiError);
        
        if (apiError.response?.status === 401) {
          showMessage('🔒 Session expirée. Veuillez vous reconnecter.', 'error');
          authService.logout();
          setTimeout(() => navigate('/login'), 1000);
          return;
        }
        
        // Utiliser les données locales
        console.log('🔄 Utilisation des données locales');
        setUser(authUser);
        
        // Charger les données étendues depuis localStorage
        const extendedData = JSON.parse(localStorage.getItem('simplon_profile_extended') || '{}');
        
        setFormData({
          first_name: authUser.first_name || '',
          last_name: authUser.last_name || '',
          email: authUser.email || '',
          phone: extendedData.phone || '',
          bio: extendedData.bio || '',
          location: extendedData.location || '',
          company: extendedData.company || '',
          position: extendedData.position || '',
          website: extendedData.website || '',
          github: extendedData.github || '',
          linkedin: extendedData.linkedin || '',
          twitter: extendedData.twitter || '',
          cohort: authUser.cohort || '',
          specialite: extendedData.specialite || '',
          date_entree: extendedData.date_entree || '',
          date_sortie: extendedData.date_sortie || '',
        });
        
        setApiStatus('offline');
        showMessage('⚠️ Base de données temporairement inaccessible. Mode hors-ligne activé.', 'warning');
      }
      
    } catch (error) {
      console.error('❌ Erreur chargement profil:', error);
      showMessage('❌ Impossible de charger le profil', 'error');
      setApiStatus('error');
    } finally {
      setLoading(false);
    }
  }, [checkAuthentication, showMessage, navigate]);

  // ✅ SAUVEGARDER LE PROFIL DANS LA BASE DE DONNÉES
  const saveProfile = useCallback(async () => {
    const { isLoggedIn } = checkAuthentication();
    
    if (!isLoggedIn) {
      showMessage('🔒 Connectez-vous pour sauvegarder', 'error');
      navigate('/login');
      return;
    }
    
    try {
      setLoading(true);
      
      // Préparer les données pour l'API
      const dataToSend = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone || '',
        bio: formData.bio || '',
        location: formData.location || '',
        company: formData.company || '',
        position: formData.position || '',
        website: formData.website || '',
        github: formData.github || '',
        linkedin: formData.linkedin || '',
        twitter: formData.twitter || '',
        cohort: formData.cohort || '',
        specialite: formData.specialite || '',
        date_entree: formData.date_entree || '',
        date_sortie: formData.date_sortie || '',
      };
      
      console.log('📤 Sauvegarde dans la base de données:', dataToSend);
      
      try {
        // Envoyer les données à l'API Django
        const response = await axios.patch(
          'http://localhost:8000/api/users/profile/',
          dataToSend,
          {
            headers: authService.getAuthHeaders()
          }
        );
        
        console.log('✅ Réponse sauvegarde:', response.data);
        
        // Mettre à jour le localStorage avec les nouvelles données
        const currentUser = authService.getCurrentUser();
        const updatedUser = {
          ...currentUser,
          ...response.data
        };
        authService.setCurrentUser(updatedUser);
        
        setApiStatus('connected');
        showMessage('✅ Profil sauvegardé avec succès dans la base de données!', 'success');
        
      } catch (apiError) {
        console.error('❌ Erreur sauvegarde API:', apiError);
        
        if (apiError.response?.status === 401) {
          showMessage('🔒 Session expirée. Veuillez vous reconnecter.', 'error');
          authService.logout();
          setTimeout(() => navigate('/login'), 1000);
          return;
        }
        
        // Sauvegarde en mode hors-ligne
        const currentUser = authService.getCurrentUser();
        const updatedUser = {
          ...currentUser,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          cohort: formData.cohort
        };
        
        authService.setCurrentUser(updatedUser);
        
        // Sauvegarder les données étendues dans localStorage
        const extendedData = {
          phone: formData.phone,
          bio: formData.bio,
          location: formData.location,
          company: formData.company,
          position: formData.position,
          website: formData.website,
          github: formData.github,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          specialite: formData.specialite,
          date_entree: formData.date_entree,
          date_sortie: formData.date_sortie,
        };
        
        localStorage.setItem('simplon_profile_extended', JSON.stringify(extendedData));
        
        setApiStatus('offline');
        showMessage('⚠️ Base de données inaccessible. Données sauvegardées localement.', 'warning');
      }
      
      setEditMode(false);
      
      // Recharger les données fraîches
      await loadProfile();
      
    } catch (error) {
      console.error('❌ Erreur générale sauvegarde:', error);
      showMessage('❌ Erreur lors de la sauvegarde', 'error');
    } finally {
      setLoading(false);
    }
  }, [formData, checkAuthentication, showMessage, navigate, loadProfile]);

  // ✅ GÉRER LE CHANGEMENT D'INPUT
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ✅ SÉLECTIONNER UNE IMAGE
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        showMessage('⚠️ Veuillez sélectionner une image valide', 'error');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        showMessage('⚠️ L\'image est trop volumineuse (max 5MB)', 'error');
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

  // ✅ UPLOADER UNE PHOTO DE PROFIL
  const handleImageUpload = useCallback(async (file) => {
    try {
      setUploadingImage(true);
      
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await axios.post(
        'http://localhost:8000/api/users/upload-avatar/',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${authService.getAccessToken()}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      console.log('✅ Photo uploadée:', response.data);
      
      // Mettre à jour l'utilisateur local
      const currentUser = authService.getCurrentUser();
      const updatedUser = {
        ...currentUser,
        avatar_url: response.data.avatar_url
      };
      authService.setCurrentUser(updatedUser);
      
      showMessage('✅ Photo de profil mise à jour!', 'success');
      
      // Recharger le profil
      await loadProfile();
      
    } catch (error) {
      console.error('❌ Erreur upload:', error);
      
      if (error.response?.status === 401) {
        showMessage('🔒 Session expirée. Veuillez vous reconnecter.', 'error');
        authService.logout();
        navigate('/login');
      } else {
        showMessage(`❌ Erreur: ${error.response?.data?.message || error.message}`, 'error');
      }
    } finally {
      setUploadingImage(false);
      setShowEditModal(false);
      setSelectedImage(null);
      setImagePreview(null);
    }
  }, [showMessage, loadProfile, navigate]);

  // ✅ SUPPRIMER LA PHOTO DE PROFIL
  const deleteProfilePicture = useCallback(async () => {
    try {
      const response = await axios.delete(
        'http://localhost:8000/api/users/delete-avatar/',
        {
          headers: authService.getAuthHeaders()
        }
      );
      
      console.log('✅ Photo supprimée:', response.data);
      
      // Mettre à jour l'utilisateur local
      const currentUser = authService.getCurrentUser();
      const updatedUser = {
        ...currentUser,
        avatar_url: null
      };
      authService.setCurrentUser(updatedUser);
      
      setImagePreview(null);
      showMessage('✅ Photo de profil supprimée', 'success');
      
      // Recharger le profil
      await loadProfile();
      
    } catch (error) {
      console.error('❌ Erreur suppression:', error);
      showMessage('❌ Impossible de supprimer la photo de profil', 'error');
    }
  }, [showMessage, loadProfile]);

  // ✅ SE DÉCONNECTER
  const handleLogout = useCallback(() => {
    authService.logout();
    showMessage('✅ Déconnecté avec succès', 'success');
    setTimeout(() => navigate('/login'), 1000);
  }, [navigate, showMessage]);

  // ✅ SAUVEGARDER LA BIO
  const saveBio = async () => {
    try {
      setLoading(true);
      await saveProfile();
      setShowBioModal(false);
    } catch (error) {
      console.error('Erreur sauvegarde bio:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ EFFET INITIAL - Charger le profil au montage
  useEffect(() => {
    console.log('🏁 Initialisation du composant Profile');
    loadProfile();
  }, [loadProfile]);

  // ✅ PHOTO DE PROFIL À AFFICHER
  const displayProfilePicture = user?.avatar_url || 
    imagePreview ||
    'https://ui-avatars.com/api/?name=' + encodeURIComponent(`${formData.first_name}+${formData.last_name}`) + 
    '&background=random&color=fff&size=128';

  // ⏳ ÉCRAN DE CHARGEMENT
  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E30613] mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement du profil...</p>
          <p className="text-gray-400 text-sm mt-2">
            {apiStatus === 'checking' ? 'Vérification de l\'authentification...' : 
             apiStatus === 'connected' ? 'Connexion à la base de données...' : 
             apiStatus === 'offline' ? 'Mode hors-ligne' : 
             'Erreur de connexion'}
          </p>
        </div>
      </div>
    );
  }

  // Si non authentifié, afficher un message
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Accès non autorisé</h2>
          <p className="text-gray-600 mb-8">Vous devez être connecté pour accéder à cette page.</p>
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-[#E30613] text-white rounded-lg hover:bg-[#E30613]/90 transition-colors font-medium"
            >
              Se connecter
            </button>
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium ml-4"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
      {/* Bandeau d'information */}
      {apiStatus === 'offline' && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-sm text-yellow-800">
          <div className="flex items-center justify-center gap-2">
            <AlertCircle size={16} />
            <span className="font-medium">Mode hors-ligne</span>
            <span className="text-yellow-600">- Base de données temporairement inaccessible</span>
          </div>
        </div>
      )}
      
      {apiStatus === 'connected' && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-2 text-sm text-green-800">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle size={16} />
            <span className="font-medium">Connecté à la base de données</span>
            <span className="text-green-600">- Données synchronisées</span>
          </div>
        </div>
      )}

      <main className="p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          
          {/* Header Section */}
          <section className="rounded-xl bg-white p-8 shadow-sm dark:bg-[#1a2f44]">
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
              
              {/* Photo de profil */}
              <div className="relative group">
                <div 
                  className="h-28 w-28 shrink-0 rounded-full bg-cover bg-center bg-no-repeat ring-4 ring-white dark:ring-gray-800 shadow-lg cursor-pointer transition-transform group-hover:scale-105"
                  style={{ backgroundImage: `url(${displayProfilePicture})` }}
                  onClick={() => isAuthenticated ? setShowEditModal(true) : showMessage('Connectez-vous pour modifier', 'warning')}
                  title={isAuthenticated ? "Modifier la photo" : "Connectez-vous"}
                />
                <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                  <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                </div>
                {isAuthenticated && (
                  <div className="absolute -bottom-2 -right-2 bg-[#E30613] text-white rounded-full p-2 shadow-lg">
                    <Edit size={14} />
                  </div>
                )}
              </div>
              
              {/* Informations */}
              <div className="flex-grow space-y-4 text-center sm:text-left">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h2 className="text-2xl font-bold text-[#001F3F] dark:text-white">
                      {formData.first_name} {formData.last_name}
                    </h2>
                    <div className="flex items-center gap-2">
                      {isAuthenticated && (
                        <button 
                          onClick={handleLogout}
                          className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          Déconnexion
                        </button>
                      )}
                      {apiStatus === 'connected' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          ✅ Base de données
                        </span>
                      )}
                      {apiStatus === 'offline' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          ⚠️ Hors ligne
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 rounded-full text-sm font-medium">
                      <User size={14} />
                      {user?.username || 'Utilisateur'}
                    </span>
                    {formData.cohort && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 rounded-full text-sm font-medium">
                        <GraduationCap size={14} />
                        {formData.cohort}
                      </span>
                    )}
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                      isAuthenticated 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                    }`}>
                      {isAuthenticated ? '✅ Connecté' : '🔒 Non connecté'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mt-3 flex items-center gap-2 justify-center sm:justify-start">
                    <Mail size={18} />
                    {formData.email || 'Non renseigné'}
                  </p>
                  
                  {formData.phone && (
                    <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-2 justify-center sm:justify-start">
                      <Phone size={18} />
                      {formData.phone}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div className="max-w-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-[#001F3F] dark:text-white flex items-center gap-2">
                      Bio
                    </h3>
                    {isAuthenticated && (
                      <button 
                        onClick={() => setShowBioModal(true)}
                        className="flex items-center gap-1 text-[#E30613] hover:text-[#E30613]/80 text-sm font-medium transition-colors"
                      >
                        <Edit size={14} />
                        {formData.bio ? 'Modifier' : 'Ajouter une bio'}
                      </button>
                    )}
                  </div>
                  
                  {formData.bio ? (
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-line bg-gray-50 dark:bg-[#0d1a29] rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      {formData.bio}
                    </p>
                  ) : (
                    <div 
                      className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-[#E30613] transition-colors"
                      onClick={() => isAuthenticated ? setShowBioModal(true) : showMessage('Connectez-vous pour modifier', 'warning')}
                    >
                      <Edit size={32} className="text-gray-400 mb-2 mx-auto" />
                      <p className="text-gray-400 dark:text-gray-500 text-sm">
                        {isAuthenticated ? 'Cliquez pour ajouter une bio' : 'Connectez-vous pour modifier votre profil'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Boutons d'action */}
              <div className="flex flex-col gap-3 w-full sm:w-auto">
                {isAuthenticated ? (
                  <>
                    <button 
                      onClick={() => setShowEditModal(true)}
                      className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#E30613] px-6 text-sm font-semibold text-white hover:bg-[#E30613]/90 transition-colors shadow-sm w-full sm:w-auto"
                    >
                      <Camera size={18} />
                      <span>Modifier la photo</span>
                    </button>
                    <button 
                      onClick={() => setEditMode(true)}
                      className="flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm w-full sm:w-auto dark:border-gray-600 dark:bg-[#1a2f44] dark:text-white dark:hover:bg-[#253b52]"
                    >
                      <Edit size={18} />
                      <span>Modifier le profil</span>
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => navigate('/login')}
                    className="flex h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#E30613] to-red-600 px-6 text-sm font-semibold text-white hover:from-red-600 hover:to-[#E30613] transition-all shadow-lg w-full sm:w-auto"
                  >
                    <User size={18} />
                    <span>Se connecter</span>
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Statistiques */}
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex items-center gap-6 rounded-xl bg-white p-6 shadow-sm dark:bg-[#1a2f44] hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-14 h-14 bg-red-50 dark:bg-[#E30613]/10 rounded-xl">
                <FolderOpen className="text-2xl text-[#E30613]" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Projets créés</p>
                <p className="text-3xl font-bold text-[#001F3F] dark:text-white">
                  {userStats.projectsCount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {apiStatus === 'connected' ? 'Base de données' : 'Données locales'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 rounded-xl bg-white p-6 shadow-sm dark:bg-[#1a2f44] hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-14 h-14 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                <User className="text-2xl text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Statut</p>
                <p className="text-3xl font-bold text-[#001F3F] dark:text-white">
                  {apiStatus === 'connected' ? '✅' : apiStatus === 'offline' ? '⚠️' : '❌'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {apiStatus === 'connected' ? 'Connecté à la BD' : 
                   apiStatus === 'offline' ? 'Hors ligne' : 'Non connecté'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 rounded-xl bg-white p-6 shadow-sm dark:bg-[#1a2f44] hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-14 h-14 bg-purple-50 dark:bg-purple-900/10 rounded-xl">
                <Eye className="text-2xl text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Mode</p>
                <p className="text-3xl font-bold text-[#001F3F] dark:text-white">
                  {editMode ? '✏️' : '👁️'}
                </p>
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => isAuthenticated ? setEditMode(!editMode) : showMessage('Connectez-vous pour modifier', 'warning')}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      editMode 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300'
                    } ${!isAuthenticated && 'opacity-50 cursor-not-allowed'}`}
                  >
                    {editMode ? 'Annuler' : 'Modifier'}
                  </button>
                  {editMode && isAuthenticated && (
                    <button 
                      onClick={saveProfile}
                      disabled={loading}
                      className="px-4 py-2 text-sm bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors dark:bg-green-900/20 dark:text-green-300 disabled:opacity-50"
                    >
                      {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Onglets */}
          <div className="bg-white rounded-xl shadow-lg p-2 border border-gray-200 dark:bg-[#1a2f44] dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-3 px-5 py-3 rounded-lg transition-all font-medium ${
                  activeTab === 'profile'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200'
                }`}
              >
                <User size={20} />
                <span>Profil</span>
              </button>
              
              {isAuthenticated && (
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center gap-3 px-5 py-3 rounded-lg transition-all font-medium ${
                    activeTab === 'security'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200'
                  }`}
                >
                  <Lock size={20} />
                  <span>Sécurité</span>
                </button>
              )}
            </div>
          </div>

          {/* Contenu Profil */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 dark:bg-[#1a2f44] dark:border-gray-700">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Informations personnelles</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {apiStatus === 'connected' 
                      ? 'Vos données sont sauvegardées dans la base de données'
                      : 'Mode hors-ligne - Les modifications seront synchronisées lors de la reconnexion'
                    }
                  </p>
                </div>
                {!isAuthenticated && (
                  <button 
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-sm bg-gradient-to-r from-[#E30613] to-red-600 text-white rounded-lg hover:from-red-600 hover:to-[#E30613] transition-all"
                  >
                    Se connecter
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Section informations de base */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 dark:from-blue-900/10 dark:to-indigo-900/10 dark:border-blue-800/20">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-[#0d1a29] rounded-lg shadow-sm">
                        <User size={20} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      Informations de base
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Prénom
                        </label>
                        <input
                          type="text"
                          value={formData.first_name}
                          onChange={(e) => handleInputChange('first_name', e.target.value)}
                          disabled={!editMode || !isAuthenticated}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
                          placeholder="Votre prénom"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Nom
                        </label>
                        <input
                          type="text"
                          value={formData.last_name}
                          onChange={(e) => handleInputChange('last_name', e.target.value)}
                          disabled={!editMode || !isAuthenticated}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
                          placeholder="Votre nom"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!editMode || !isAuthenticated}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
                          placeholder="votre@email.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!editMode || !isAuthenticated}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
                          placeholder="+33 1 23 45 67 89"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Section informations supplémentaires */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 dark:from-purple-900/10 dark:to-pink-900/10 dark:border-purple-800/20">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Informations supplémentaires</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Localisation
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          disabled={!editMode || !isAuthenticated}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
                          placeholder="Ville, Pays"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Entreprise
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          disabled={!editMode || !isAuthenticated}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
                          placeholder="Nom de l'entreprise"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Poste
                        </label>
                        <input
                          type="text"
                          value={formData.position}
                          onChange={(e) => handleInputChange('position', e.target.value)}
                          disabled={!editMode || !isAuthenticated}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
                          placeholder="Votre poste"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Section informations Simplon et liens */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 dark:from-green-900/10 dark:to-emerald-900/10 dark:border-green-800/20">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-[#0d1a29] rounded-lg shadow-sm">
                        <GraduationCap size={20} className="text-green-600 dark:text-green-400" />
                      </div>
                      Informations Simplon
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Promotion
                        </label>
                        <input
                          type="text"
                          value={formData.cohort}
                          onChange={(e) => handleInputChange('cohort', e.target.value)}
                          disabled={!editMode || !isAuthenticated}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
                          placeholder="Ex: Admin 2024"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Spécialité
                        </label>
                        <input
                          type="text"
                          value={formData.specialite}
                          onChange={(e) => handleInputChange('specialite', e.target.value)}
                          disabled={!editMode || !isAuthenticated}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
                          placeholder="Ex: Administration Système"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Date d'entrée
                          </label>
                          <input
                            type="date"
                            value={formData.date_entree}
                            onChange={(e) => handleInputChange('date_entree', e.target.value)}
                            disabled={!editMode || !isAuthenticated}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Date de sortie
                          </label>
                          <input
                            type="date"
                            value={formData.date_sortie}
                            onChange={(e) => handleInputChange('date_sortie', e.target.value)}
                            disabled={!editMode || !isAuthenticated}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Section liens */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100 dark:from-orange-900/10 dark:to-amber-900/10 dark:border-orange-800/20">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Liens professionnels</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <Github size={18} className="text-gray-700 dark:text-gray-300" />
                          GitHub
                        </label>
                        <input
                          type="url"
                          value={formData.github}
                          onChange={(e) => handleInputChange('github', e.target.value)}
                          disabled={!editMode || !isAuthenticated}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 dark:focus:ring-gray-400 dark:focus:border-gray-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
                          placeholder="https://github.com/votre-username"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <Linkedin size={18} className="text-blue-600 dark:text-blue-400" />
                          LinkedIn
                        </label>
                        <input
                          type="url"
                          value={formData.linkedin}
                          onChange={(e) => handleInputChange('linkedin', e.target.value)}
                          disabled={!editMode || !isAuthenticated}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
                          placeholder="https://linkedin.com/in/votre-profile"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          <Globe size={18} className="text-green-600 dark:text-green-400" />
                          Portfolio / Site web
                        </label>
                        <input
                          type="url"
                          value={formData.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          disabled={!editMode || !isAuthenticated}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 outline-none transition-all disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:text-gray-500 dark:text-white dark:bg-[#0d1a29]"
                          placeholder="https://votre-portfolio.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Boutons d'action pour la section profil */}
              {isAuthenticated && editMode && (
                <div className="flex gap-3 justify-end mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      setEditMode(false);
                      loadProfile();
                    }}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg font-medium"
                  >
                    <X size={20} />
                    Annuler
                  </button>
                  
                  <button
                    onClick={saveProfile}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-500 transition-all duration-300 shadow-lg hover:shadow-xl font-medium disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <Save size={20} />
                    )}
                    {apiStatus === 'connected' ? 'Sauvegarder dans la BD' : 'Sauvegarder localement'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Section Sécurité */}
          {activeTab === 'security' && isAuthenticated && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 dark:bg-[#1a2f44] dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Sécurité du compte</h2>
              
              <div className="space-y-6">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <Lock size={24} className="text-red-600 dark:text-red-400 mt-1" />
                    <div>
                      <h3 className="font-semibold text-red-700 dark:text-red-300 mb-2">Déconnexion</h3>
                      <p className="text-red-600 dark:text-red-400 text-sm mb-4">
                        Déconnectez-vous de votre session en cours.
                      </p>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle size={24} className="text-green-600 dark:text-green-400 mt-1" />
                    <div>
                      <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">Authentification JWT</h3>
                      <p className="text-green-600 dark:text-green-400 text-sm mb-4">
                        Vous êtes authentifié avec JSON Web Token. Votre session est sécurisée.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => authService.debug()}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                        >
                          Debug Token
                        </button>
                        <button
                          onClick={() => {
                            console.log('🔍 Debug auth:');
                            console.log('Token:', authService.getAccessToken());
                            console.log('User:', authService.getCurrentUser());
                            console.log('Authenticated:', authService.isAuthenticated());
                            showMessage('Informations de debug affichées dans la console', 'info');
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Vérifier Auth
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {apiStatus === 'connected' && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle size={24} className="text-blue-600 dark:text-blue-400 mt-1" />
                      <div>
                        <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Connexion Base de données</h3>
                        <p className="text-blue-600 dark:text-blue-400 text-sm mb-4">
                          ✅ Connecté à la base de données Django<br/>
                          📊 Données synchronisées<br/>
                          🔒 Authentification sécurisée
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
        </div>
      </main>

      {/* Modals */}
      
      {/* Profile Picture Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a2f44] rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#001F3F] dark:text-white flex items-center gap-2">
                <Camera size={20} />
                Photo de profil
              </h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col items-center gap-6 mb-6">
              <div 
                className="h-32 w-32 rounded-full bg-cover bg-center bg-no-repeat border-4 border-gray-200 dark:border-gray-600 shadow-lg"
                style={{ backgroundImage: `url(${imagePreview || displayProfilePicture})` }}
              />
              
              <div className="flex flex-col gap-3 w-full">
                <label className="flex items-center justify-center gap-3 bg-[#E30613] text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-[#E30613]/90 transition-colors font-medium shadow-sm">
                  <Camera size={20} />
                  <span>Choisir une photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Formats supportés: JPG, PNG, GIF • Max: 5MB
                </p>
              </div>

              {/* Bouton réinitialiser */}
              {displayProfilePicture && !displayProfilePicture.includes('ui-avatars.com') && isAuthenticated && (
                <button 
                  onClick={deleteProfilePicture}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                >
                  <Trash2 size={16} />
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
                onClick={() => {
                  if (selectedImage) {
                    handleImageUpload(selectedImage);
                  } else {
                    setShowEditModal(false);
                  }
                }}
                disabled={uploadingImage || !selectedImage}
                className="flex items-center gap-2 bg-[#E30613] text-white px-6 py-2.5 rounded-lg hover:bg-[#E30613]/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm"
              >
                {uploadingImage ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    {selectedImage ? 'Enregistrer' : 'Fermer'}
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
                <Edit size={20} />
                {formData.bio ? 'Modifier la bio' : 'Ajouter une bio'}
              </h3>
              <button 
                onClick={() => setShowBioModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white resize-none transition-colors"
                placeholder="Parlez de vous, de vos compétences, de vos passions... (300 caractères maximum)"
                maxLength="300"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Décrivez-vous en quelques mots
                </p>
                <p className={`text-xs ${formData.bio.length >= 280 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                  {formData.bio.length}/300 caractères
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
                disabled={loading}
                className="flex items-center gap-2 bg-[#E30613] text-white px-6 py-2.5 rounded-lg hover:bg-[#E30613]/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Enregistrer
                  </>
                )}
              </button> 
            </div>
          </div>
        </div>
      )}

      {/* Message Toast */}
      {message.text && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl max-w-sm ${
          message.type === 'success' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-800 dark:text-green-300' :
          message.type === 'error' ? 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 text-red-800 dark:from-red-900/20 dark:to-orange-900/20 dark:border-red-800 dark:text-red-300' :
          message.type === 'warning' ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 text-yellow-800 dark:from-yellow-900/20 dark:to-amber-900/20 dark:border-yellow-800 dark:text-yellow-300' :
          'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 text-blue-800 dark:from-blue-900/20 dark:to-cyan-900/20 dark:border-blue-800 dark:text-blue-300'
        }`}>
          <div className="flex items-center gap-3">
            {message.type === 'success' ? (
              <CheckCircle size={24} className="flex-shrink-0" />
            ) : message.type === 'error' ? (
              <X size={24} className="flex-shrink-0" />
            ) : (
              <Bell size={24} className="flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className="font-medium">{message.text}</p>
            </div>
            <button
              onClick={() => setMessage({ text: '', type: '' })}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;