// // src/components/admin/Profile.jsx
// import React, { useState, useEffect } from 'react';
// import authService from '../../services/auth';

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     username: '',
//     phone: '',
//     bio: '',
//     current_password: '',
//     new_password: '',
//     confirm_password: ''
//   });
//   const [saveLoading, setSaveLoading] = useState(false);
//   const [saveSuccess, setSaveSuccess] = useState(false);

//   useEffect(() => {
//     loadUserProfile();
//   }, []);

//   const loadUserProfile = async () => {
//     try {
//       setLoading(true);
//       const currentUser = authService.getCurrentUser();
      
//       if (currentUser) {
//         setUser(currentUser);
//         setFormData({
//           first_name: currentUser.first_name || '',
//           last_name: currentUser.last_name || '',
//           email: currentUser.email || '',
//           username: currentUser.username || '',
//           phone: currentUser.phone || '',
//           bio: currentUser.bio || '',
//           current_password: '',
//           new_password: '',
//           confirm_password: ''
//         });
//       }
//     } catch (error) {
//       console.error('❌ Erreur lors du chargement du profil:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSaveProfile = async () => {
//     try {
//       setSaveLoading(true);
      
//       // Validation des mots de passe
//       if (formData.new_password && formData.new_password !== formData.confirm_password) {
//         alert('Les nouveaux mots de passe ne correspondent pas');
//         return;
//       }
      
//       // Simuler l'enregistrement
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // Mettre à jour l'utilisateur local
//       const updatedUser = {
//         ...user,
//         first_name: formData.first_name,
//         last_name: formData.last_name,
//         email: formData.email,
//         phone: formData.phone,
//         bio: formData.bio
//       };
      
//       setUser(updatedUser);
      
//       // Mettre à jour dans localStorage
//       localStorage.setItem('user', JSON.stringify(updatedUser));
      
//       setSaveSuccess(true);
//       setTimeout(() => setSaveSuccess(false), 3000);
//       setEditMode(false);
      
//       console.log('✅ Profil mis à jour:', updatedUser);
//       alert('✅ Profil mis à jour avec succès');
      
//     } catch (error) {
//       console.error('❌ Erreur lors de la sauvegarde:', error);
//       alert('❌ Erreur lors de la sauvegarde');
//     } finally {
//       setSaveLoading(false);
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditMode(false);
//     loadUserProfile(); // Recharger les données originales
//   };

//   const getInitials = () => {
//     if (!user) return 'A';
//     return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || 'A';
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Non disponible';
//     return new Date(dateString).toLocaleDateString('fr-FR', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px]">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E30613] mb-4"></div>
//         <p className="text-gray-600 dark:text-gray-400">
//           Chargement du profil...
//         </p>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px]">
//         <div className="text-red-500 text-4xl mb-4">⚠️</div>
//         <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//           Profil non disponible
//         </h3>
//         <p className="text-gray-600 dark:text-gray-400">
//           Impossible de charger les informations du profil
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-[#001F3F] dark:text-white">
//             <span className="material-symbols-outlined align-middle mr-2">person</span>
//             Mon Profil Administrateur
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-1">
//             Gérez vos informations personnelles et vos paramètres de compte
//           </p>
//         </div>
        
//         {!editMode ? (
//           <button
//             onClick={() => setEditMode(true)}
//             className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#c40511] transition-colors font-medium flex items-center gap-2"
//           >
//             <span className="material-symbols-outlined">edit</span>
//             Modifier le profil
//           </button>
//         ) : (
//           <div className="flex gap-2">
//             <button
//               onClick={handleCancelEdit}
//               className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
//             >
//               Annuler
//             </button>
//             <button
//               onClick={handleSaveProfile}
//               disabled={saveLoading}
//               className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#c40511] transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {saveLoading ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                   Sauvegarde...
//                 </>
//               ) : (
//                 <>
//                   <span className="material-symbols-outlined">save</span>
//                   Enregistrer les modifications
//                 </>
//               )}
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Message de succès */}
//       {saveSuccess && (
//         <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
//           <div className="flex items-center">
//             <span className="material-symbols-outlined text-green-500 mr-2">check_circle</span>
//             <p className="text-green-700 dark:text-green-300">
//               Profil mis à jour avec succès !
//             </p>
//           </div>
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Carte de profil */}
//         <div className="lg:col-span-1">
//           <div className="bg-white dark:bg-[#1a2f44] rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6">
//             <div className="text-center">
//               <div className="w-32 h-32 bg-gradient-to-r from-[#E30613] to-[#001F3F] rounded-full flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4">
//                 {getInitials()}
//               </div>
              
//               <h2 className="text-xl font-bold text-[#001F3F] dark:text-white mb-1">
//                 {user.first_name || ''} {user.last_name || ''}
//                 {!user.first_name && !user.last_name && user.username}
//               </h2>
              
//               <p className="text-gray-600 dark:text-gray-400 mb-4">
//                 {user.is_superuser ? 'Super Administrateur' : 'Administrateur'}
//               </p>
              
//               <div className="space-y-3 text-left">
//                 <div className="flex items-center gap-2">
//                   <span className="material-symbols-outlined text-gray-400 text-sm">person</span>
//                   <span className="text-sm text-gray-600 dark:text-gray-400">
//                     @{user.username}
//                   </span>
//                 </div>
                
//                 <div className="flex items-center gap-2">
//                   <span className="material-symbols-outlined text-gray-400 text-sm">mail</span>
//                   <span className="text-sm text-gray-600 dark:text-gray-400">
//                     {user.email}
//                   </span>
//                 </div>
                
//                 {user.date_joined && (
//                   <div className="flex items-center gap-2">
//                     <span className="material-symbols-outlined text-gray-400 text-sm">calendar_today</span>
//                     <span className="text-sm text-gray-600 dark:text-gray-400">
//                       Membre depuis {formatDate(user.date_joined)}
//                     </span>
//                   </div>
//                 )}
                
//                 <div className="flex items-center gap-2">
//                   <span className="material-symbols-outlined text-gray-400 text-sm">shield</span>
//                   <span className="text-sm text-gray-600 dark:text-gray-400">
//                     {user.is_staff ? 'Accès staff' : 'Utilisateur standard'}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Formulaire d'édition */}
//         <div className="lg:col-span-2">
//           <div className="bg-white dark:bg-[#1a2f44] rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
//             <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0d1a29]">
//               <h3 className="font-semibold text-[#001F3F] dark:text-white">
//                 <span className="material-symbols-outlined align-middle mr-2">edit</span>
//                 Informations personnelles
//               </h3>
//             </div>
            
//             <div className="p-6 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Prénom
//                   </label>
//                   <input
//                     type="text"
//                     name="first_name"
//                     value={formData.first_name}
//                     onChange={handleInputChange}
//                     disabled={!editMode}
//                     className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Nom
//                   </label>
//                   <input
//                     type="text"
//                     name="last_name"
//                     value={formData.last_name}
//                     onChange={handleInputChange}
//                     disabled={!editMode}
//                     className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Nom d'utilisateur
//                 </label>
//                 <input
//                   type="text"
//                   name="username"
//                   value={formData.username}
//                   disabled
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-[#0d1a29] dark:text-white opacity-50 cursor-not-allowed"
//                   title="Le nom d'utilisateur ne peut pas être modifié"
//                 />
//                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                   Le nom d'utilisateur ne peut pas être modifié
//                 </p>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Adresse email
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   disabled={!editMode}
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Téléphone
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   disabled={!editMode}
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                   placeholder="+33 1 23 45 67 89"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Bio
//                 </label>
//                 <textarea
//                   name="bio"
//                   value={formData.bio}
//                   onChange={handleInputChange}
//                   disabled={!editMode}
//                   rows="3"
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white disabled:opacity-50 disabled:cursor-not-allowed resize-none"
//                   placeholder="Présentez-vous..."
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Section mot de passe */}
//           {/* <div className="bg-white dark:bg-[#1a2f44] rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden mt-6">
//             <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0d1a29]">
//               <h3 className="font-semibold text-[#001F3F] dark:text-white">
//                 <span className="material-symbols-outlined align-middle mr-2">lock</span>
//                 Changer le mot de passe
//               </h3>
//             </div>
            
//             <div className="p-6 space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Mot de passe actuel
//                 </label>
//                 <input
//                   type="password"
//                   name="current_password"
//                   value={formData.current_password}
//                   onChange={handleInputChange}
//                   disabled={!editMode}
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                   placeholder="••••••••"
//                 />
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Nouveau mot de passe
//                   </label>
//                   <input
//                     type="password"
//                     name="new_password"
//                     value={formData.new_password}
//                     onChange={handleInputChange}
//                     disabled={!editMode}
//                     className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                     placeholder="••••••••"
//                   />
//                 </div>
                
//                 <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Confirmer le mot de passe
//                   </label>
//                  <input
//                     type="password"
//                     name="confirm_password"
//                     value={formData.confirm_password}
//                     onChange={handleInputChange}
//                     disabled={!editMode}
//                     className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                     placeholder="••••••••"
//                 />
//                 </div>
//             </div>
              
//               <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
//                 <p className="text-sm text-blue-700 dark:text-blue-300">
//             <strong>💡 Conseil de sécurité :</strong> Utilisez un mot de passe fort avec au moins 8 caractères, incluant des majuscules, minuscules, chiffres et symboles.
//                 </p>
//               </div>
//             </div>
//           </div> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;


// // src/components/admin/Profile.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import authService from '../../services/auth';

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     username: '',
//     phone: '',
//     bio: '',
//     current_password: '',
//     new_password: '',
//     confirm_password: ''
//   });
//   const [saveLoading, setSaveLoading] = useState(false);
//   const [saveSuccess, setSaveSuccess] = useState(false);
//   const [error, setError] = useState(null);

//   const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
//   const API_ENDPOINTS = {
//     GET_PROFILE: `${API_BASE}/api/users/me/`,
//     UPDATE_PROFILE: `${API_BASE}/api/users/me/`,
//     CHANGE_PASSWORD: `${API_BASE}/api/users/change-password/`,
//     UPLOAD_AVATAR: `${API_BASE}/api/users/upload-avatar/`
//   };

//   useEffect(() => {
//     loadUserProfile();
//   }, []);

//   const getAuthHeaders = () => {
//     const token = authService.getAccessToken();
//     return {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     };
//   };

//   const loadUserProfile = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const currentUser = authService.getCurrentUser();
      
//       if (!currentUser) {
//         throw new Error('Aucun utilisateur connecté');
//       }

//       // Essayer de récupérer les données complètes depuis l'API
//       try {
//         const response = await axios.get(API_ENDPOINTS.GET_PROFILE, {
//           headers: getAuthHeaders()
//         });
        
//         const apiUser = response.data;
//         setUser(apiUser);
        
//         setFormData({
//           first_name: apiUser.first_name || '',
//           last_name: apiUser.last_name || '',
//           email: apiUser.email || '',
//           username: apiUser.username || '',
//           phone: apiUser.phone || apiUser.phone_number || '',
//           bio: apiUser.bio || apiUser.description || '',
//           current_password: '',
//           new_password: '',
//           confirm_password: ''
//         });
        
//         console.log('✅ Profil chargé depuis PostgreSQL:', apiUser);
        
//       } catch (apiError) {
//         console.warn('⚠️ API non disponible, utilisation des données locales');
//         // Fallback aux données locales
//         setUser(currentUser);
//         setFormData({
//           first_name: currentUser.first_name || '',
//           last_name: currentUser.last_name || '',
//           email: currentUser.email || '',
//           username: currentUser.username || '',
//           phone: currentUser.phone || '',
//           bio: currentUser.bio || '',
//           current_password: '',
//           new_password: '',
//           confirm_password: ''
//         });
//       }
      
//     } catch (error) {
//       console.error('❌ Erreur lors du chargement du profil:', error);
//       setError('Impossible de charger le profil');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const validateForm = () => {
//     if (formData.new_password && formData.new_password !== formData.confirm_password) {
//       setError('Les nouveaux mots de passe ne correspondent pas');
//       return false;
//     }
    
//     if (formData.new_password && !formData.current_password) {
//       setError('Le mot de passe actuel est requis pour changer le mot de passe');
//       return false;
//     }
    
//     if (formData.new_password && formData.new_password.length < 8) {
//       setError('Le nouveau mot de passe doit contenir au moins 8 caractères');
//       return false;
//     }
    
//     return true;
//   };

//   const handleSaveProfile = async () => {
//     try {
//       if (!validateForm()) {
//         return;
//       }
      
//       setSaveLoading(true);
//       setError(null);
//       setSaveSuccess(false);
      
//       const token = authService.getAccessToken();
//       if (!token) {
//         throw new Error('Token d\'authentification manquant');
//       }
      
//       const headers = getAuthHeaders();
      
//       // 1. Mettre à jour le profil
//       const profileData = {
//         first_name: formData.first_name,
//         last_name: formData.last_name,
//         email: formData.email,
//         phone: formData.phone,
//         bio: formData.bio
//       };
      
//       console.log('📤 Envoi des données du profil:', profileData);
      
//       const profileResponse = await axios.patch(
//         API_ENDPOINTS.UPDATE_PROFILE,
//         profileData,
//         { headers }
//       );
      
//       console.log('✅ Profil mis à jour:', profileResponse.data);
      
//       // 2. Si changement de mot de passe
//       if (formData.new_password && formData.current_password) {
//         const passwordData = {
//           current_password: formData.current_password,
//           new_password: formData.new_password
//         };
        
//         console.log('📤 Changement de mot de passe');
        
//         try {
//           await axios.post(
//             API_ENDPOINTS.CHANGE_PASSWORD,
//             passwordData,
//             { headers }
//           );
          
//           console.log('✅ Mot de passe changé avec succès');
          
//           // Réinitialiser les champs mot de passe
//           setFormData(prev => ({
//             ...prev,
//             current_password: '',
//             new_password: '',
//             confirm_password: ''
//           }));
//         } catch (passwordError) {
//           console.warn('⚠️ Erreur changement mot de passe:', passwordError.response?.data);
//           // On continue car le profil a été mis à jour, juste le mot de passe a échoué
//         }
//       }
      
//       // 3. Mettre à jour l'utilisateur local
//       const updatedUser = {
//         ...user,
//         ...profileResponse.data
//       };
      
//       setUser(updatedUser);
      
//       // 4. Mettre à jour l'utilisateur dans localStorage/authService
//       authService.updateCurrentUser(updatedUser);
      
//       // 5. Afficher le succès
//       setSaveSuccess(true);
//       setTimeout(() => setSaveSuccess(false), 5000);
      
//       // 6. Quitter le mode édition
//       setEditMode(false);
      
//       // 7. Rafraîchir les données
//       setTimeout(loadUserProfile, 1000);
      
//     } catch (error) {
//       console.error('❌ Erreur lors de la sauvegarde:', error);
      
//       let errorMessage = 'Erreur lors de la sauvegarde';
      
//       if (error.response) {
//         const { status, data } = error.response;
        
//         if (status === 400) {
//           // Validation errors from Django
//           if (data.email) {
//             errorMessage = `Email: ${data.email.join(', ')}`;
//           } else if (data.phone) {
//             errorMessage = `Téléphone: ${data.phone.join(', ')}`;
//           } else if (data.detail) {
//             errorMessage = data.detail;
//           } else if (typeof data === 'object') {
//             errorMessage = Object.entries(data)
//               .map(([key, value]) => `${key}: ${value}`)
//               .join(', ');
//           }
//         } else if (status === 401) {
//           errorMessage = 'Session expirée. Veuillez vous reconnecter.';
//           setTimeout(() => {
//             authService.logout();
//             window.location.href = '/login';
//           }, 2000);
//         } else if (status === 403) {
//           errorMessage = 'Permission refusée';
//         } else if (status === 404) {
//           errorMessage = 'Endpoint non trouvé';
//         } else {
//           errorMessage = `Erreur serveur (${status})`;
//         }
//       } else if (error.request) {
//         errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
//       }
      
//       setError(errorMessage);
      
//     } finally {
//       setSaveLoading(false);
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditMode(false);
//     setError(null);
//     loadUserProfile(); // Recharger les données originales
//   };

//   const getInitials = () => {
//     if (!user) return 'A';
//     return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || 'A';
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Non disponible';
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('fr-FR', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       });
//     } catch {
//       return 'Date invalide';
//     }
//   };

//   const handleTestConnection = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await axios.get(API_ENDPOINTS.GET_PROFILE, {
//         headers: getAuthHeaders()
//       });
      
//       console.log('✅ Connexion API réussie:', response.data);
//       alert('✅ Connexion à PostgreSQL établie avec succès !');
      
//       // Recharger les données
//       loadUserProfile();
      
//     } catch (error) {
//       console.error('❌ Test de connexion échoué:', error);
//       let message = 'Impossible de se connecter à l\'API Django.';
      
//       if (error.response?.status === 401) {
//         message += '\nToken invalide ou expiré.';
//       } else if (error.request) {
//         message += '\nServeur Django non accessible.';
//       }
      
//       alert(`❌ ${message}`);
//       setError(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px]">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E30613] mb-4"></div>
//         <p className="text-gray-600 dark:text-gray-400">
//           Chargement du profil...
//         </p>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px]">
//         <div className="text-red-500 text-4xl mb-4">⚠️</div>
//         <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//           Profil non disponible
//         </h3>
//         <p className="text-gray-600 dark:text-gray-400 mb-4">
//           Impossible de charger les informations du profil
//         </p>
//         <button
//           onClick={loadUserProfile}
//           className="px-4 py-2 bg-[#E30613] text-white rounded-lg hover:bg-[#c40511] transition-colors"
//         >
//           Réessayer
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-[#001F3F] dark:text-white">
//             <span className="material-symbols-outlined align-middle mr-2">person</span>
//             Mon Profil Administrateur
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-1">
//             Gérez vos informations personnelles dans PostgreSQL
//           </p>
//         </div>
        
//         <div className="flex gap-2">
//           {/* <button
//             onClick={handleTestConnection}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
//           >
//             <span className="material-symbols-outlined">wifi</span>
//             Tester API
//           </button> */}
          
//           {!editMode ? (
//             <button
//               onClick={() => setEditMode(true)}
//               className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#c40511] transition-colors font-medium flex items-center gap-2"
//             >
//               <span className="material-symbols-outlined">edit</span>
//               Modifier le profil
//             </button>
//           ) : (
//             <div className="flex gap-2">
//               <button
//                 onClick={handleCancelEdit}
//                 className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
//               >
//                 Annuler
//               </button>
//               <button
//                 onClick={handleSaveProfile}
//                 disabled={saveLoading}
//                 className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#c40511] transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {saveLoading ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                     Sauvegarde PostgreSQL...
//                   </>
//                 ) : (
//                   <>
//                     <span className="material-symbols-outlined">save</span>
//                     Enregistrer
//                   </>
//                 )}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Messages */}
//       {error && (
//         <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 rounded-r-lg">
//           <div className="flex items-start">
//             <span className="material-symbols-outlined text-red-400 mr-3">error</span>
//             <p className="font-medium text-red-800 dark:text-red-300 whitespace-pre-line">
//               {error}
//             </p>
//           </div>
//         </div>
//       )}

//       {saveSuccess && (
//         <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 p-4 rounded-r-lg">
//           <div className="flex items-center">
//             <span className="material-symbols-outlined text-green-400 mr-2">check_circle</span>
//             <p className="font-medium text-green-800 dark:text-green-300">
//               Profil mis à jour avec succès dans PostgreSQL !
//             </p>
//           </div>
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Carte de profil */}
//         <div className="lg:col-span-1">
//           <div className="bg-white dark:bg-[#1a2f44] rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6">
//             <div className="text-center">
//               <div className="w-32 h-32 bg-gradient-to-r from-[#E30613] to-[#001F3F] rounded-full flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4">
//                 {getInitials()}
//               </div>
              
//               <h2 className="text-xl font-bold text-[#001F3F] dark:text-white mb-1">
//                 {user.first_name || ''} {user.last_name || ''}
//                 {!user.first_name && !user.last_name && user.username}
//               </h2>
              
//               <p className="text-gray-600 dark:text-gray-400 mb-4">
//                 {user.is_superuser ? 'Super Administrateur' : 'Administrateur'}
//               </p>
              
//               <div className="space-y-3 text-left">
//                 <div className="flex items-center gap-2">
//                   <span className="material-symbols-outlined text-gray-400 text-sm">person</span>
//                   <span className="text-sm text-gray-600 dark:text-gray-400">
//                     @{user.username}
//                   </span>
//                 </div>
                
//                 <div className="flex items-center gap-2">
//                   <span className="material-symbols-outlined text-gray-400 text-sm">mail</span>
//                   <span className="text-sm text-gray-600 dark:text-gray-400">
//                     {user.email}
//                   </span>
//                 </div>
                
//                 {user.phone && (
//                   <div className="flex items-center gap-2">
//                     <span className="material-symbols-outlined text-gray-400 text-sm">phone</span>
//                     <span className="text-sm text-gray-600 dark:text-gray-400">
//                       {user.phone}
//                     </span>
//                   </div>
//                 )}
                
//                 {user.date_joined && (
//                   <div className="flex items-center gap-2">
//                     <span className="material-symbols-outlined text-gray-400 text-sm">calendar_today</span>
//                     <span className="text-sm text-gray-600 dark:text-gray-400">
//                       Membre depuis {formatDate(user.date_joined)}
//                     </span>
//                   </div>
//                 )}
                
//                 <div className="flex items-center gap-2">
//                   <span className="material-symbols-outlined text-gray-400 text-sm">shield</span>
//                   <span className="text-sm text-gray-600 dark:text-gray-400">
//                     {user.is_staff ? 'Accès staff' : 'Utilisateur standard'}
//                   </span>
//                 </div>
                
//                 {user.last_login && (
//                   <div className="flex items-center gap-2">
//                     <span className="material-symbols-outlined text-gray-400 text-sm">login</span>
//                     <span className="text-sm text-gray-600 dark:text-gray-400">
//                       Dernière connexion: {formatDate(user.last_login)}
//                     </span>
//                   </div>
//                 )}
//               </div>
              
//               <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
//                 <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
//                   <span className="material-symbols-outlined text-xs mr-1">database</span>
//                   {user.id ? `ID: ${user.id}` : 'Données locales'}
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Info box */}
//           {/* <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
//             <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center">
//               <span className="material-symbols-outlined mr-2">info</span>
//               Informations
//             </h4>
//             <p className="text-sm text-blue-700 dark:text-blue-400">
//               Les modifications seront enregistrées directement dans la base de données PostgreSQL via l'API Django REST.
//             </p>
//           </div> */}
//         </div>

//         {/* Formulaire d'édition */}
//         <div className="lg:col-span-2">
//           <div className="bg-white dark:bg-[#1a2f44] rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
//             <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0d1a29]">
//               <h3 className="font-semibold text-[#001F3F] dark:text-white">
//                 <span className="material-symbols-outlined align-middle mr-2">edit</span>
//                 Informations personnelles
//               </h3>
//             </div>
            
//             <div className="p-6 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Prénom *
//                   </label>
//                   <input
//                     type="text"
//                     name="first_name"
//                     value={formData.first_name}
//                     onChange={handleInputChange}
//                     disabled={!editMode}
//                     className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Nom *
//                   </label>
//                   <input
//                     type="text"
//                     name="last_name"
//                     value={formData.last_name}
//                     onChange={handleInputChange}
//                     disabled={!editMode}
//                     className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                     required
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Nom d'utilisateur
//                 </label>
//                 <input
//                   type="text"
//                   name="username"
//                   value={formData.username}
//                   disabled
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-[#0d1a29] dark:text-white opacity-50 cursor-not-allowed"
//                   title="Le nom d'utilisateur ne peut pas être modifié"
//                 />
//                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                   Le nom d'utilisateur ne peut pas être modifié
//                 </p>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Adresse email *
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   disabled={!editMode}
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                   required
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Téléphone
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   disabled={!editMode}
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                   placeholder="+225..."
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Bio / Description
//                 </label>
//                 <textarea
//                   name="bio"
//                   value={formData.bio}
//                   onChange={handleInputChange}
//                   disabled={!editMode}
//                   rows="3"
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white disabled:opacity-50 disabled:cursor-not-allowed resize-none"
//                   placeholder="Présentez-vous..."
//                 />
//                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                   Maximum 500 caractères
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Section mot de passe */}
//           <div className="bg-white dark:bg-[#1a2f44] rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden mt-6">
//             <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0d1a29]">
//               <h3 className="font-semibold text-[#001F3F] dark:text-white">
//                 <span className="material-symbols-outlined align-middle mr-2">lock</span>
//                 Changer le mot de passe
//               </h3>
//             </div>
            
//             <div className="p-6 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Mot de passe actuel
//                   </label>
//                   <input
//                     type="password"
//                     name="current_password"
//                     value={formData.current_password}
//                     onChange={handleInputChange}
//                     disabled={!editMode}
//                     className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                     placeholder="••••••••"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Nouveau mot de passe
//                   </label>
//                   <input
//                     type="password"
//                     name="new_password"
//                     value={formData.new_password}
//                     onChange={handleInputChange}
//                     disabled={!editMode}
//                     className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                     placeholder="••••••••"
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Confirmer le mot de passe
//                 </label>
//                 <input
//                   type="password"
//                   name="confirm_password"
//                   value={formData.confirm_password}
//                   onChange={handleInputChange}
//                   disabled={!editMode}
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                   placeholder="••••••••"
//                 />
//               </div>
              
//               <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
//                 <p className="text-sm text-blue-700 dark:text-blue-300">
//                   <strong>💡 Conseil de sécurité :</strong> Utilisez un mot de passe fort avec au moins 8 caractères, incluant des majuscules, minuscules, chiffres et symboles.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Informations système */}
//           {/* <div className="mt-6 bg-gray-50 dark:bg-[#0d1a29] rounded-lg p-4">
//             <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
//               <span className="material-symbols-outlined mr-2 text-gray-500">info</span>
//               Informations de connexion
//             </h4>
//             <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
//               <div className="flex items-center gap-2">
//                 <span className="material-symbols-outlined text-xs">link</span>
//                 <span>API: {API_BASE}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="material-symbols-outlined text-xs">database</span>
//                 <span>Base de données: PostgreSQL</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="material-symbols-outlined text-xs">security</span>
//                 <span>Authentification: JWT Bearer Token</span>
//               </div>
//             </div>
//           </div> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;



// // src/components/admin/Profile.jsx - VERSION CORRIGÉE
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     username: '',
//     phone: '',
//     bio: ''
//   });
//   const [saveLoading, setSaveLoading] = useState(false);
//   const [saveSuccess, setSaveSuccess] = useState(false);
//   const [error, setError] = useState(null);
//   const [apiTested, setApiTested] = useState(false);
//   const [debugInfo, setDebugInfo] = useState({});

//   const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

//   // 🎯 FONCTION DEBUG: Voir toutes les clés localStorage
//   const debugLocalStorage = () => {
//     console.log('🔍 DEBUG localStorage:');
//     for (let i = 0; i < localStorage.length; i++) {
//       const key = localStorage.key(i);
//       let value = localStorage.getItem(key);
      
//       // Essayer de parser si c'est du JSON
//       try {
//         value = JSON.parse(value);
//         console.log(`  📦 ${key}:`, value);
//       } catch {
//         console.log(`  📦 ${key}:`, value?.substring(0, 50) + '...');
//       }
//     }
    
//     // Chercher spécifiquement les tokens
//     const possibleTokenKeys = [
//       'authToken', 'token', 'access_token', 'accessToken',
//       'jwt_token', 'jwtToken', 'userToken', 'simplon_token'
//     ];
    
//     console.log('🔑 Recherche tokens:');
//     possibleTokenKeys.forEach(key => {
//       const value = localStorage.getItem(key);
//       if (value) {
//         console.log(`  ✅ ${key}: ${value.substring(0, 20)}...`);
//       }
//     });
//   };

//   // 🎯 FONCTION: Trouver le token dans localStorage
//   const findAuthToken = () => {
//     // Liste des clés possibles pour le token
//     const possibleKeys = [
//       'authToken',
//       'token',
//       'access_token', 
//       'accessToken',
//       'jwt_token',
//       'jwtToken',
//       'simplon_token',
//       'user_token'
//     ];
    
//     for (const key of possibleKeys) {
//       const token = localStorage.getItem(key);
//       if (token) {
//         console.log(`✅ Token trouvé sous la clé: ${key}`);
//         return token;
//       }
//     }
    
//     console.warn('❌ Aucun token trouvé dans localStorage');
//     return null;
//   };

//   // 🎯 FONCTION: Trouver l'utilisateur dans localStorage
//   const findUserInStorage = () => {
//     const possibleKeys = ['user', 'currentUser', 'simplon_user', 'auth_user'];
    
//     for (const key of possibleKeys) {
//       const userStr = localStorage.getItem(key);
//       if (userStr) {
//         try {
//           const user = JSON.parse(userStr);
//           console.log(`✅ Utilisateur trouvé sous la clé: ${key}`);
//           return user;
//         } catch (e) {
//           console.log(`⚠️ ${key}: JSON invalide`);
//         }
//       }
//     }
    
//     console.warn('❌ Aucun utilisateur trouvé dans localStorage');
//     return null;
//   };

//   // 🎯 FONCTION: Obtenir les headers d'authentification
//   const getAuthHeaders = () => {
//     const token = findAuthToken();
    
//     setDebugInfo(prev => ({
//       ...prev,
//       tokenFound: !!token,
//       tokenKey: token ? 'trouvé' : 'non trouvé'
//     }));
    
//     if (!token) {
//       console.warn('⚠️ Aucun token trouvé dans localStorage');
//       console.log('🔍 Vérification des clés localStorage...');
//       debugLocalStorage();
//       return {};
//     }
    
//     return {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     };
//   };

//   // 🎯 FONCTION: Charger le profil utilisateur
//   const loadUserProfile = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       console.log('🔄 Chargement du profil depuis Django...');
//       debugLocalStorage(); // Debug
      
//       const headers = getAuthHeaders();
      
//       // D'abord, charger depuis localStorage
//       const localUser = findUserInStorage();
//       if (localUser) {
//         console.log('📱 Utilisation données locales:', localUser);
//         setUser(localUser);
//         setFormData({
//           first_name: localUser.first_name || '',
//           last_name: localUser.last_name || '',
//           email: localUser.email || '',
//           username: localUser.username || '',
//           phone: localUser.phone || '',
//           bio: localUser.bio || ''
//         });
//       }
      
//       // Ensuite, essayer l'API si on a un token
//       if (headers.Authorization) {
//         console.log('🔐 Tentative connexion API avec token...');
        
//         // Endpoints à tester
//         const endpoints = [
//           `${API_BASE}/api/users/profile/`,
//           `${API_BASE}/api/users/user/`,
//           `${API_BASE}/api/profile/`,
//           `${API_BASE}/api/user/`,
//           `${API_BASE}/api/auth/user/`,
//           `${API_BASE}/api/current-user/`
//         ];
        
//         let apiUser = null;
        
//         for (const endpoint of endpoints) {
//           try {
//             console.log(`🔍 Essai endpoint: ${endpoint}`);
//             const response = await axios.get(endpoint, {
//               headers,
//               timeout: 3000
//             });
            
//             if (response.data) {
//               console.log(`✅ Réponse API de ${endpoint}:`, response.data);
//               apiUser = response.data;
//               setApiTested(true);
//               break;
//             }
//           } catch (err) {
//             console.log(`❌ ${endpoint}: ${err.response?.status || err.message}`);
//           }
//         }
        
//         if (apiUser) {
//           console.log('✅ Données API chargées avec succès');
//           setUser(apiUser);
          
//           // Mettre à jour localStorage avec les données fraîches
//           localStorage.setItem('user', JSON.stringify(apiUser));
          
//           setFormData({
//             first_name: apiUser.first_name || '',
//             last_name: apiUser.last_name || '',
//             email: apiUser.email || '',
//             username: apiUser.username || '',
//             phone: apiUser.phone || '',
//             bio: apiUser.bio || ''
//           });
//         } else {
//           console.warn('⚠️ API non accessible');
//           setError('Mode local - API Django non accessible');
//         }
//       } else {
//         console.warn('⚠️ Pas de token, mode local seulement');
//         setError('Mode local - Connectez-vous pour synchroniser avec PostgreSQL');
//       }
      
//     } catch (err) {
//       console.error('❌ Erreur chargement profil:', err);
//       setError('Erreur lors du chargement du profil: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🎯 FONCTION: Sauvegarder les modifications
//   const handleSaveProfile = async () => {
//     try {
//       setSaveLoading(true);
//       setError(null);
      
//       // Validation
//       if (!formData.first_name.trim() || !formData.last_name.trim()) {
//         setError('Le prénom et le nom sont obligatoires');
//         return;
//       }
      
//       if (!formData.email.trim()) {
//         setError('L\'email est obligatoire');
//         return;
//       }
      
//       // Préparer les données
//       const updateData = {
//         first_name: formData.first_name,
//         last_name: formData.last_name,
//         email: formData.email,
//         phone: formData.phone || '',
//         bio: formData.bio || ''
//       };
      
//       console.log('📤 Envoi des modifications:', updateData);
      
//       const headers = getAuthHeaders();
      
//       // 🎯 MODE API: Sauvegarde sur serveur
//       if (headers.Authorization) {
//         console.log('🔐 Tentative sauvegarde API...');
        
//         const updateEndpoints = [
//           { url: `${API_BASE}/api/users/profile/`, method: 'PATCH' },
//           { url: `${API_BASE}/api/users/user/`, method: 'PATCH' },
//           { url: `${API_BASE}/api/profile/`, method: 'PATCH' },
//           { url: `${API_BASE}/api/users/profile/`, method: 'PUT' },
//           { url: `${API_BASE}/api/users/user/`, method: 'PUT' }
//         ];
        
//         let updateSuccess = false;
        
//         for (const endpoint of updateEndpoints) {
//           try {
//             console.log(`🔍 ${endpoint.method} ${endpoint.url}`);
//             const response = await axios({
//               method: endpoint.method,
//               url: endpoint.url,
//               data: updateData,
//               headers,
//               timeout: 5000
//             });
            
//             if (response.status === 200 || response.status === 201) {
//               console.log(`✅ ${endpoint.method} réussie:`, response.data);
              
//               // Mettre à jour l'utilisateur local
//               const updatedUser = { ...user, ...response.data };
//               setUser(updatedUser);
//               localStorage.setItem('user', JSON.stringify(updatedUser));
              
//               setSaveSuccess(true);
//               setTimeout(() => setSaveSuccess(false), 3000);
//               setEditMode(false);
//               setApiTested(true);
              
//               updateSuccess = true;
//               break;
//             }
//           } catch (err) {
//             console.log(`❌ ${endpoint.method} ${endpoint.url}: ${err.response?.status || err.message}`);
//           }
//         }
        
//         if (updateSuccess) {
//           console.log('✅ Profil sauvegardé dans PostgreSQL!');
//           return;
//         }
        
//         // Si l'API échoue, continuer avec sauvegarde locale
//         console.warn('⚠️ API non accessible, sauvegarde locale');
//       }
      
//       // 🎯 MODE LOCAL: Sauvegarde dans localStorage seulement
//       console.log('💾 Sauvegarde locale...');
//       const updatedUser = { ...user, ...updateData };
//       setUser(updatedUser);
//       localStorage.setItem('user', JSON.stringify(updatedUser));
      
//       setSaveSuccess(true);
//       setTimeout(() => setSaveSuccess(false), 3000);
//       setEditMode(false);
      
//       setError('Sauvegarde locale (API non disponible)');
//       console.log('✅ Profil sauvegardé localement');
      
//     } catch (err) {
//       console.error('❌ Erreur sauvegarde:', err);
//       setError('Erreur lors de la sauvegarde: ' + (err.response?.data?.detail || err.message));
//     } finally {
//       setSaveLoading(false);
//     }
//   };

//   // 🎯 FONCTION: Tester la connexion API
//   const testApiConnection = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       console.log('🧪 Test de connexion API...');
//       debugLocalStorage();
      
//       const token = findAuthToken();
      
//       if (!token) {
//         alert('❌ Aucun token trouvé dans localStorage. Veuillez vous connecter.');
//         return;
//       }
      
//       const headers = {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       };
      
//       const endpoints = [
//         { url: `${API_BASE}/api/users/profile/`, name: 'Profile' },
//         { url: `${API_BASE}/api/users/user/`, name: 'User' },
//         { url: `${API_BASE}/api/profile/`, name: 'Profile simple' },
//         { url: `${API_BASE}/api/token/verify/`, name: 'Token Verify' },
//         { url: `${API_BASE}/api/users/`, name: 'Users list' }
//       ];
      
//       const results = [];
      
//       for (const endpoint of endpoints) {
//         try {
//           const response = await axios.get(endpoint.url, { 
//             headers,
//             timeout: 3000 
//           });
          
//           results.push(`✅ ${endpoint.name}: ${response.status}`);
//           console.log(`✅ ${endpoint.name} accessible`);
//         } catch (err) {
//           const status = err.response?.status || 'Error';
//           results.push(`❌ ${endpoint.name}: ${status} (${err.message})`);
//           console.log(`❌ ${endpoint.name}: ${status} - ${err.message}`);
//         }
//       }
      
//       // Afficher les résultats
//       const successCount = results.filter(r => r.startsWith('✅')).length;
//       const message = `Résultats tests API:\n\n${results.join('\n')}\n\n✅ ${successCount}/${endpoints.length} endpoints fonctionnels`;
      
//       alert(message);
      
//       // Recharger les données si certains endpoints fonctionnent
//       if (successCount > 0) {
//         setTimeout(loadUserProfile, 1000);
//       }
      
//     } catch (err) {
//       console.error('❌ Erreur test API:', err);
//       setError('Erreur test API: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleCancelEdit = () => {
//     setEditMode(false);
//     setError(null);
//     if (user) {
//       setFormData({
//         first_name: user.first_name || '',
//         last_name: user.last_name || '',
//         email: user.email || '',
//         username: user.username || '',
//         phone: user.phone || '',
//         bio: user.bio || ''
//       });
//     }
//   };

//   const getInitials = () => {
//     if (!user) return 'U';
//     const firstName = user.first_name || '';
//     const lastName = user.last_name || '';
//     return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || 'U';
//   };

//   // 🎯 FONCTION: Rafraîchir le token
//   const refreshToken = async () => {
//     try {
//       const refreshToken = localStorage.getItem('refreshToken') || localStorage.getItem('refresh_token');
      
//       if (!refreshToken) {
//         console.warn('❌ Pas de refresh token trouvé');
//         return null;
//       }
      
//       console.log('🔄 Tentative de rafraîchissement du token...');
      
//       const response = await axios.post(`${API_BASE}/api/token/refresh/`, {
//         refresh: refreshToken
//       });
      
//       if (response.data.access) {
//         console.log('✅ Token rafraîchi avec succès');
//         localStorage.setItem('authToken', response.data.access);
//         return response.data.access;
//       }
      
//       return null;
//     } catch (err) {
//       console.error('❌ Erreur rafraîchissement token:', err);
//       return null;
//     }
//   };

//   // Charger au démarrage
//   useEffect(() => {
//     loadUserProfile();
//   }, []);

//   // Rendu
//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px]">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E30613] mb-4"></div>
//         <p className="text-gray-600 dark:text-gray-400">
//           Chargement du profil...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-[#001F3F] dark:text-white">
//             <span className="material-symbols-outlined align-middle mr-2">person</span>
//             Mon Profil Administrateur
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-1">
//             {apiTested ? 'Connecté à PostgreSQL' : 'Mode local'}
//           </p>
//         </div>
        
//         <div className="flex flex-wrap gap-2">
//           <button
//             onClick={testApiConnection}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
//           >
//             <span className="material-symbols-outlined">wifi</span>
//             Tester API
//           </button>
          
//           <button
//             onClick={() => {
//               debugLocalStorage();
//               loadUserProfile();
//             }}
//             className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center gap-2"
//           >
//             <span className="material-symbols-outlined">refresh</span>
//             Actualiser
//           </button>
          
//           {!editMode ? (
//             <button
//               onClick={() => setEditMode(true)}
//               className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#c40511] transition-colors font-medium flex items-center gap-2"
//             >
//               <span className="material-symbols-outlined">edit</span>
//               Modifier
//             </button>
//           ) : (
//             <div className="flex gap-2">
//               <button
//                 onClick={handleCancelEdit}
//                 className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium flex items-center gap-2"
//               >
//                 <span className="material-symbols-outlined">close</span>
//                 Annuler
//               </button>
//               <button
//                 onClick={handleSaveProfile}
//                 disabled={saveLoading}
//                 className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#c40511] transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {saveLoading ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                     Sauvegarde...
//                   </>
//                 ) : (
//                   <>
//                     <span className="material-symbols-outlined">save</span>
//                     Enregistrer
//                   </>
//                 )}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Messages */}
//       {error && (
//         <div className={`${error.includes('Mode local') || error.includes('Sauvegarde locale') ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400' : 'bg-red-50 dark:bg-red-900/20 border-red-400'} border-l-4 p-4 rounded-r-lg`}>
//           <div className="flex items-start">
//             <span className={`material-symbols-outlined mr-3 ${error.includes('Mode local') || error.includes('Sauvegarde locale') ? 'text-yellow-400' : 'text-red-400'}`}>
//               {error.includes('Mode local') || error.includes('Sauvegarde locale') ? 'warning' : 'error'}
//             </span>
//             <div className="flex-1">
//               <p className={`font-medium ${error.includes('Mode local') || error.includes('Sauvegarde locale') ? 'text-yellow-800 dark:text-yellow-300' : 'text-red-800 dark:text-red-300'}`}>
//                 {error}
//               </p>
//               {error.includes('Mode local') && (
//                 <button
//                   onClick={testApiConnection}
//                   className="mt-2 text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded"
//                 >
//                   Tester la connexion
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {saveSuccess && (
//         <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 p-4 rounded-r-lg">
//           <div className="flex items-center">
//             <span className="material-symbols-outlined text-green-400 mr-2">check_circle</span>
//             <p className="font-medium text-green-800 dark:text-green-300">
//               {apiTested ? '✅ Profil sauvegardé dans PostgreSQL !' : '✅ Profil sauvegardé localement'}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Contenu */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Carte profil */}
//         <div className="lg:col-span-1">
//           <div className="bg-white dark:bg-[#1a2f44] rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6">
//             <div className="text-center">
//               <div className="w-32 h-32 bg-gradient-to-r from-[#E30613] to-[#001F3F] rounded-full flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4">
//                 {getInitials()}
//               </div>
              
//               <h2 className="text-xl font-bold text-[#001F3F] dark:text-white mb-1">
//                 {user?.first_name || 'Non'} {user?.last_name || 'renseigné'}
//               </h2>
              
//               <p className="text-gray-600 dark:text-gray-400 mb-4">
//                 {user?.is_superuser ? 'Super Administrateur' : user?.is_staff ? 'Administrateur' : 'Utilisateur'}
//               </p>
              
//               <div className="space-y-3 text-left">
//                 <div className="flex items-center gap-2">
//                   <span className="material-symbols-outlined text-gray-400 text-sm">person</span>
//                   <span className="text-sm text-gray-600 dark:text-gray-400">
//                     @{user?.username || 'Non défini'}
//                   </span>
//                 </div>
                
//                 <div className="flex items-center gap-2">
//                   <span className="material-symbols-outlined text-gray-400 text-sm">mail</span>
//                   <span className="text-sm text-gray-600 dark:text-gray-400">
//                     {user?.email || 'Non défini'}
//                   </span>
//                 </div>
                
//                 {user?.date_joined && (
//                   <div className="flex items-center gap-2">
//                     <span className="material-symbols-outlined text-gray-400 text-sm">calendar_today</span>
//                     <span className="text-sm text-gray-600 dark:text-gray-400">
//                       Membre depuis {new Date(user.date_joined).toLocaleDateString('fr-FR')}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
          
//           {/* Info box */}
//           <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
//             <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center">
//               <span className="material-symbols-outlined mr-2">info</span>
//               Information
//             </h4>
//             <p className="text-sm text-blue-700 dark:text-blue-400">
//               {apiTested 
//                 ? '✅ Connecté à PostgreSQL via Django REST'
//                 : '⚠️ Mode local - Les données sont sauvegardées dans votre navigateur seulement'
//               }
//             </p>
//             {!apiTested && (
//               <button
//                 onClick={testApiConnection}
//                 className="mt-2 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded"
//               >
//                 Tester la connexion
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Formulaire */}
//         <div className="lg:col-span-2">
//           <div className="bg-white dark:bg-[#1a2f44] rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6">
//             <h3 className="text-lg font-semibold text-[#001F3F] dark:text-white mb-6 flex items-center">
//               <span className="material-symbols-outlined mr-2">edit</span>
//               Informations personnelles
//             </h3>
            
//             <div className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Prénom *
//                   </label>
//                   <input
//                     type="text"
//                     name="first_name"
//                     value={formData.first_name}
//                     onChange={handleInputChange}
//                     disabled={!editMode}
//                     className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Nom *
//                   </label>
//                   <input
//                     type="text"
//                     name="last_name"
//                     value={formData.last_name}
//                     onChange={handleInputChange}
//                     disabled={!editMode}
//                     className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                     required
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Nom d'utilisateur
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.username}
//                   disabled
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-[#0d1a29] dark:text-white opacity-50 cursor-not-allowed"
//                 />
//                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                   Le nom d'utilisateur ne peut pas être modifié
//                 </p>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Email *
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   disabled={!editMode}
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
//                   required
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Bio / Description
//                 </label>
//                 <textarea
//                   name="bio"
//                   value={formData.bio}
//                   onChange={handleInputChange}
//                   disabled={!editMode}
//                   rows="3"
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white disabled:opacity-50 disabled:cursor-not-allowed resize-none"
//                   placeholder="Présentez-vous..."
//                   maxLength="500"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Debug panel */}
//       <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
//         <details className="text-sm">
//           <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 flex items-center">
//             <span className="material-symbols-outlined mr-2">bug_report</span>
//             Informations de débogage
//           </summary>
//           <div className="mt-3 space-y-2 text-gray-600 dark:text-gray-400">
//             <div><strong>🔗 API Base:</strong> {API_BASE}</div>
//             <div><strong>🆔 User ID:</strong> {user?.id || 'N/A'}</div>
//             <div><strong>📱 Mode:</strong> {apiTested ? 'API Connecté' : 'Local'}</div>
//             <div><strong>🔑 Token:</strong> {findAuthToken() ? '✅ Trouvé' : '❌ Absent'}</div>
//             <div><strong>👤 User in storage:</strong> {user ? '✅ Trouvé' : '❌ Absent'}</div>
//             <div><strong>🌐 Endpoints testés:</strong> /api/users/profile/, /api/users/user/, /api/profile/</div>
            
//             <button
//               onClick={debugLocalStorage}
//               className="mt-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
//             >
//               Afficher localStorage
//             </button>
//           </div>
//         </details>
//       </div>
//     </div>
//   );
// };

// export default Profile;



// // src/components/admin/Profile.jsx - VERSION FINALE CORRIGÉE
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: ''
//   });
//   const [saveLoading, setSaveLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [mode, setMode] = useState('local'); // 'local' ou 'django'

//   const API_BASE = 'http://localhost:8000';

//   // 1. TROUVER LE TOKEN
//   const getToken = () => {
//     return localStorage.getItem('simplon_access_token') || 
//            localStorage.getItem('authToken') || 
//            localStorage.getItem('token');
//   };

//   // 2. CHARGER LE PROFIL DEPUIS DJANGO
//   const loadFromDjango = async () => {
//     const token = getToken();
    
//     if (!token) {
//       console.log('Mode: Pas de token → Local');
//       loadFromLocal();
//       return;
//     }
    
//     try {
//       console.log('🔄 Chargement depuis Django...');
      
//       const response = await axios.get(`${API_BASE}/api/users/profile/`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         timeout: 3000
//       });
      
//       console.log('✅ Données Django:', response.data);
      
//       setUser(response.data);
//       setFormData({
//         first_name: response.data.first_name || '',
//         last_name: response.data.last_name || '',
//         email: response.data.email || ''
//       });
      
//       // Sauvegarder localement aussi
//       localStorage.setItem('user', JSON.stringify(response.data));
      
//       setMode('django');
//       setMessage('✅ Connecté à PostgreSQL');
      
//     } catch (error) {
//       console.error('❌ Erreur Django:', error.response?.status || error.message);
      
//       if (error.response?.status === 401) {
//         setMessage('❌ Token invalide ou expiré');
//       } else if (error.response?.status === 404) {
//         setMessage('❌ Endpoint non trouvé');
//       } else {
//         setMessage('⚠️ Django non accessible');
//       }
      
//       loadFromLocal();
//     }
//   };

//   // 3. CHARGER DEPUIS LOCALSTORAGE
//   const loadFromLocal = () => {
//     console.log('📱 Chargement depuis localStorage...');
    
//     const userStr = localStorage.getItem('user');
//     if (userStr) {
//       try {
//         const userData = JSON.parse(userStr);
//         console.log('✅ Données locales:', userData);
        
//         setUser(userData);
//         setFormData({
//           first_name: userData.first_name || '',
//           last_name: userData.last_name || '',
//           email: userData.email || ''
//         });
        
//         setMode('local');
//       } catch (e) {
//         console.error('❌ Erreur parsing:', e);
//       }
//     }
//   };

//   // 4. SAUVEGARDER DANS DJANGO (avec essai multiple)
//   const saveToDjango = async () => {
//     const token = getToken();
    
//     if (!token) {
//       setMessage('❌ Pas de token. Sauvegarde locale.');
//       saveToLocal();
//       return;
//     }
    
//     try {
//       setSaveLoading(true);
//       setMessage('Sauvegarde en cours...');
      
//       console.log('📤 Tentative sauvegarde Django...');
      
//       // Essayer plusieurs endpoints et méthodes
//       const endpoints = [
//         { url: `${API_BASE}/api/users/profile/`, methods: ['PUT', 'PATCH', 'POST'] },
//         { url: `${API_BASE}/api/users/me/`, methods: ['PUT', 'PATCH'] },
//         { url: `${API_BASE}/api/profile/`, methods: ['PUT', 'PATCH'] }
//       ];
      
//       let success = false;
//       let lastError = null;
      
//       for (const endpoint of endpoints) {
//         for (const method of endpoint.methods) {
//           try {
//             console.log(`🔍 Essai ${method} ${endpoint.url}`);
            
//             const response = await axios({
//               method: method,
//               url: endpoint.url,
//               data: formData,
//               headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//               },
//               timeout: 3000
//             });
            
//             if (response.status === 200 || response.status === 201) {
//               console.log(`✅ ${method} ${endpoint.url} réussie:`, response.data);
              
//               // Mettre à jour les données
//               setUser(response.data);
//               localStorage.setItem('user', JSON.stringify(response.data));
              
//               setMessage('✅ Sauvegardé dans PostgreSQL !');
//               setEditMode(false);
//               setMode('django');
              
//               success = true;
//               break;
//             }
//           } catch (error) {
//             console.log(`❌ ${method} ${endpoint.url}:`, error.response?.status || error.message);
//             lastError = error;
//           }
//         }
        
//         if (success) break;
//       }
      
//       if (!success) {
//         // Si aucune méthode ne fonctionne, vérifier l'endpoint
//         setMessage(`❌ Endpoint ne supporte pas PUT/PATCH (405). ${lastError?.response?.status || 'Erreur'}`);
//         saveToLocal();
//       }
      
//     } catch (error) {
//       console.error('❌ Erreur générale:', error);
//       setMessage('❌ Erreur de connexion');
//       saveToLocal();
//     } finally {
//       setSaveLoading(false);
//     }
//   };

//   // 5. SAUVEGARDER LOCALEMENT
//   const saveToLocal = () => {
//     console.log('💾 Sauvegarde locale...');
    
//     const updatedUser = { ...user, ...formData };
//     setUser(updatedUser);
//     localStorage.setItem('user', JSON.stringify(updatedUser));
    
//     setMessage('✅ Sauvegardé localement (dans le navigateur)');
//     setEditMode(false);
//     setMode('local');
//   };

//   // 6. SE CONNECTER À DJANGO
//   const loginToDjango = async () => {
//     const username = prompt('Username Django (ex: admin):');
//     if (!username) return;
    
//     const password = prompt('Mot de passe:');
//     if (!password) return;
    
//     try {
//       setLoading(true);
//       setMessage('Connexion en cours...');
      
//       const response = await axios.post(`${API_BASE}/api/token/`, {
//         username: username,
//         password: password
//       }, { timeout: 5000 });
      
//       console.log('✅ Connexion réussie:', response.data);
      
//       // Sauvegarder le token
//       localStorage.setItem('simplon_access_token', response.data.access);
//       localStorage.setItem('refreshToken', response.data.refresh);
      
//       setMessage('✅ Connecté à Django !');
      
//       // Recharger les données
//       setTimeout(() => {
//         loadFromDjango();
//         setLoading(false);
//       }, 1000);
      
//     } catch (error) {
//       console.error('❌ Erreur connexion:', error.response?.data || error.message);
//       setMessage('❌ Erreur: ' + (error.response?.data?.detail || 'Identifiants incorrects'));
//       setLoading(false);
//     }
//   };

//   // 7. AU DÉMARRAGE
//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
      
//       // D'abord charger depuis localStorage
//       loadFromLocal();
      
//       // Ensuite essayer Django
//       await loadFromDjango();
      
//       setLoading(false);
//     };
    
//     loadData();
//   }, []);

//   // 8. VÉRIFIER LES MÉTHODES AUTORISÉES
//   const checkAllowedMethods = async () => {
//     const token = getToken();
    
//     if (!token) {
//       alert('Pas de token trouvé');
//       return;
//     }
    
//     try {
//       const response = await fetch('http://localhost:8000/api/users/profile/', {
//         method: 'OPTIONS',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       const allowedMethods = response.headers.get('Allow');
//       alert(`Méthodes autorisées: ${allowedMethods}\n\nPour ajouter PATCH, modifiez votre vue Django.`);
      
//     } catch (error) {
//       console.error('❌ Erreur OPTIONS:', error);
//     }
//   };

//   if (loading) {
//     return (
//       <div style={{ padding: '40px', textAlign: 'center' }}>
//         <div style={{ marginBottom: '20px' }}>Chargement...</div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
//       {/* En-tête */}
//       <div style={{ marginBottom: '30px' }}>
//         <h1 style={{ fontSize: '28px', color: '#001F3F', marginBottom: '10px' }}>
//           👤 Mon Profil
//         </h1>
        
//         {/* Message */}
//         {message && (
//           <div style={{
//             padding: '12px',
//             marginBottom: '15px',
//             background: message.includes('✅') ? '#d4edda' : 
//                        message.includes('⚠️') ? '#fff3cd' : '#f8d7da',
//             border: message.includes('✅') ? '1px solid #c3e6cb' : 
//                     message.includes('⚠️') ? '1px solid #ffeaa7' : '1px solid #f5c6cb',
//             borderRadius: '6px',
//             color: message.includes('✅') ? '#155724' : 
//                    message.includes('⚠️') ? '#856404' : '#721c24'
//           }}>
//             {message}
//           </div>
//         )}
        
//         {/* Indicateur */}
//         <div style={{
//           display: 'inline-flex',
//           alignItems: 'center',
//           padding: '6px 12px',
//           background: mode === 'django' ? '#d4edda' : '#fff3cd',
//           border: mode === 'django' ? '1px solid #c3e6cb' : '1px solid #ffeaa7',
//           borderRadius: '20px',
//           marginBottom: '20px'
//         }}>
//           <span style={{
//             display: 'inline-block',
//             width: '10px',
//             height: '10px',
//             borderRadius: '50%',
//             background: mode === 'django' ? '#28a745' : '#ffc107',
//             marginRight: '8px'
//           }}></span>
//           <span style={{ fontSize: '14px', fontWeight: '500' }}>
//             {mode === 'django' ? '✅ PostgreSQL' : '📱 Local'}
//           </span>
//         </div>
//       </div>

//       {/* Contrôles */}
//       <div style={{
//         display: 'flex',
//         flexWrap: 'wrap',
//         gap: '10px',
//         marginBottom: '30px',
//         padding: '15px',
//         background: '#f8f9fa',
//         borderRadius: '8px'
//       }}>
//         <button
//           onClick={loadFromDjango}
//           style={{
//             padding: '10px 16px',
//             background: '#007bff',
//             color: 'white',
//             border: 'none',
//             borderRadius: '6px',
//             cursor: 'pointer'
//           }}
//         >
//           🔄 Actualiser
//         </button>
        
//         <button
//           onClick={loginToDjango}
//           style={{
//             padding: '10px 16px',
//             background: '#28a745',
//             color: 'white',
//             border: 'none',
//             borderRadius: '6px',
//             cursor: 'pointer'
//           }}
//         >
//           🔑 Connexion Django
//         </button>
        
//         <button
//           onClick={checkAllowedMethods}
//           style={{
//             padding: '10px 16px',
//             background: '#6c757d',
//             color: 'white',
//             border: 'none',
//             borderRadius: '6px',
//             cursor: 'pointer'
//           }}
//         >
//           ⚙️ Vérifier méthodes
//         </button>
//       </div>

//       {/* Formulaire */}
//       <div style={{
//         background: 'white',
//         padding: '25px',
//         borderRadius: '10px',
//         boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
//         marginBottom: '30px'
//       }}>
//         <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#333' }}>
//           Informations personnelles
//         </h2>
        
//         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
//           <div>
//             <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
//               Prénom
//             </label>
//             <input
//               type="text"
//               value={formData.first_name}
//               onChange={(e) => setFormData({...formData, first_name: e.target.value})}
//               disabled={!editMode}
//               style={{
//                 width: '100%',
//                 padding: '10px',
//                 border: '1px solid #ddd',
//                 borderRadius: '6px',
//                 fontSize: '16px',
//                 backgroundColor: editMode ? 'white' : '#f5f5f5'
//               }}
//             />
//           </div>
          
//           <div>
//             <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
//               Nom
//             </label>
//             <input
//               type="text"
//               value={formData.last_name}
//               onChange={(e) => setFormData({...formData, last_name: e.target.value})}
//               disabled={!editMode}
//               style={{
//                 width: '100%',
//                 padding: '10px',
//                 border: '1px solid #ddd',
//                 borderRadius: '6px',
//                 fontSize: '16px',
//                 backgroundColor: editMode ? 'white' : '#f5f5f5'
//               }}
//             />
//           </div>
          
//           <div style={{ gridColumn: 'span 2' }}>
//             <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
//               Email
//             </label>
//             <input
//               type="email"
//               value={formData.email}
//               onChange={(e) => setFormData({...formData, email: e.target.value})}
//               disabled={!editMode}
//               style={{
//                 width: '100%',
//                 padding: '10px',
//                 border: '1px solid #ddd',
//                 borderRadius: '6px',
//                 fontSize: '16px',
//                 backgroundColor: editMode ? 'white' : '#f5f5f5'
//               }}
//             />
//           </div>
//         </div>
        
//         {/* Boutons */}
//         <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
//           {!editMode ? (
//             <button
//               onClick={() => setEditMode(true)}
//               style={{
//                 padding: '12px 24px',
//                 background: '#E30613',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '6px',
//                 fontSize: '16px',
//                 cursor: 'pointer'
//               }}
//             >
//               ✏️ Modifier
//             </button>
//           ) : (
//             <>
//               <button
//                 onClick={() => {
//                   setEditMode(false);
//                   loadFromLocal();
//                 }}
//                 style={{
//                   padding: '12px 24px',
//                   background: '#6c757d',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '6px',
//                   fontSize: '16px',
//                   cursor: 'pointer'
//                 }}
//               >
//                 ❌ Annuler
//               </button>
              
//               <button
//                 onClick={saveToLocal}
//                 style={{
//                   padding: '12px 24px',
//                   background: '#ffc107',
//                   color: '#212529',
//                   border: 'none',
//                   borderRadius: '6px',
//                   fontSize: '16px',
//                   cursor: 'pointer'
//                 }}
//               >
//                 📱 Sauvegarder local
//               </button>
              
//               <button
//                 onClick={saveToDjango}
//                 disabled={saveLoading}
//                 style={{
//                   padding: '12px 24px',
//                   background: mode === 'django' ? '#28a745' : '#6c757d',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '6px',
//                   fontSize: '16px',
//                   cursor: saveLoading ? 'not-allowed' : 'pointer',
//                   opacity: saveLoading ? 0.7 : 1
//                 }}
//               >
//                 {saveLoading ? '⏳ Sauvegarde...' : '🗄️ Sauvegarder PostgreSQL'}
//               </button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Solution rapide pour Django */}
//       <div style={{
//         background: '#fff3cd',
//         padding: '20px',
//         borderRadius: '8px',
//         border: '1px solid #ffc107',
//         marginTop: '20px'
//       }}>
//         <h3 style={{ color: '#856404', marginTop: 0, marginBottom: '10px' }}>
//           ⚠️ Problème technique détecté
//         </h3>
//         <p style={{ color: '#856404', fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
//           L'endpoint Django <code>/api/users/profile/</code> n'accepte pas la méthode <strong>PATCH</strong>.<br/>
//           Il accepte seulement : <strong>GET</strong> (pour lire) mais pas PATCH/PUT (pour modifier).
//         </p>
        
//         <div style={{ background: 'white', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
//           <h4 style={{ marginTop: 0, marginBottom: '10px', fontSize: '16px' }}>Solution rapide :</h4>
//           <p style={{ fontSize: '14px', marginBottom: '10px' }}>
//             Modifiez votre vue Django dans <code>users/views.py</code> :
//           </p>
//           <pre style={{
//             background: '#f8f9fa',
//             padding: '10px',
//             borderRadius: '4px',
//             fontSize: '12px',
//             overflowX: 'auto'
//           }}>
// {`# Changez cette ligne dans users/views.py :
// class UserProfileView(generics.RetrieveAPIView):  # ← Seulement GET

// # En :
// class UserProfileView(generics.RetrieveUpdateAPIView):  # ← GET + PATCH
//     permission_classes = [permissions.IsAuthenticated]
//     serializer_class = UserSerializer
    
//     def get_object(self):
//         return self.request.user`}
//           </pre>
//         </div>
        
//         <button
//           onClick={checkAllowedMethods}
//           style={{
//             padding: '8px 16px',
//             background: '#856404',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             fontSize: '14px',
//             cursor: 'pointer'
//           }}
//         >
//           🔍 Vérifier les méthodes autorisées
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Profile;


// // src/components/admin/Profile.jsx - VERSION AMÉLIORÉE AVEC GESTION 405
// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: ''
//   });
//   const [saveLoading, setSaveLoading] = useState(false);
//   const [message, setMessage] = useState({ text: '', type: '' });
//   const [mode, setMode] = useState('local');
//   const [allowedMethods, setAllowedMethods] = useState([]);

//   const API_BASE = 'http://localhost:8000';
//   const PROFILE_ENDPOINT = `${API_BASE}/api/users/profile/`;

//   // Mémoisation des fonctions avec useCallback
//   const getToken = useCallback(() => {
//     const tokenKeys = ['simplon_access_token', 'authToken', 'token', 'access_token'];
//     for (const key of tokenKeys) {
//       const token = localStorage.getItem(key);
//       if (token && !token.startsWith('mock_token_')) {
//         return token;
//       }
//     }
//     return null;
//   }, []);

//   const showMessage = useCallback((text, type = 'info') => {
//     setMessage({ text, type });
//     setTimeout(() => setMessage({ text: '', type: '' }), 5000);
//   }, []);

//   // Charger depuis Django
//   const loadFromDjango = useCallback(async () => {
//     const token = getToken();
    
//     if (!token) {
//       showMessage('Mode local (pas de token)', 'warning');
//       loadFromLocal();
//       return;
//     }
    
//     try {
//       console.log('🔄 Chargement depuis Django...');
      
//       const response = await axios.get(PROFILE_ENDPOINT, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Accept': 'application/json'
//         },
//         timeout: 5000
//       });
      
//       if (response.data) {
//         setUser(response.data);
//         setFormData({
//           first_name: response.data.first_name || '',
//           last_name: response.data.last_name || '',
//           email: response.data.email || ''
//         });
        
//         localStorage.setItem('simplon_user', JSON.stringify(response.data));
//         setMode('django');
//         showMessage('✅ Connecté à PostgreSQL avec succès', 'success');
//       }
      
//     } catch (error) {
//       console.error('❌ Erreur Django:', error.response?.status || error.message);
      
//       if (error.response?.status === 401) {
//         showMessage('❌ Token invalide ou expiré', 'error');
//       } else if (error.response?.status === 404) {
//         showMessage('❌ Endpoint non trouvé', 'error');
//       } else if (error.code === 'ECONNABORTED') {
//         showMessage('⚠️ Timeout - Serveur non accessible', 'warning');
//       } else {
//         showMessage('⚠️ Django non accessible', 'warning');
//       }
      
//       loadFromLocal();
//     }
//   }, [getToken, showMessage]);

//   // Charger depuis localStorage
//   const loadFromLocal = useCallback(() => {
//     console.log('📱 Chargement depuis localStorage...');
    
//     const localKeys = ['user', 'simplon_user', 'currentUser'];
//     for (const key of localKeys) {
//       const userStr = localStorage.getItem(key);
//       if (userStr) {
//         try {
//           const userData = JSON.parse(userStr);
//           console.log(`✅ Données locales (${key}):`, userData);
          
//           setUser(userData);
//           setFormData({
//             first_name: userData.first_name || '',
//             last_name: userData.last_name || '',
//             email: userData.email || ''
//           });
          
//           setMode('local');
//           return true;
//         } catch (e) {
//           console.error(`❌ Erreur parsing ${key}:`, e);
//         }
//       }
//     }
    
//     // Si aucune donnée trouvée
//     const defaultUser = {
//       username: 'admin',
//       first_name: 'Admin',
//       last_name: 'System',
//       email: 'admin@simplon.com',
//       is_superuser: true
//     };
    
//     setUser(defaultUser);
//     setFormData({
//       first_name: defaultUser.first_name,
//       last_name: defaultUser.last_name,
//       email: defaultUser.email
//     });
    
//     localStorage.setItem('user', JSON.stringify(defaultUser));
//     setMode('local');
//     showMessage('📱 Mode simulation activé', 'info');
    
//     return false;
//   }, [showMessage]);

//   // Vérifier les méthodes autorisées
//   const checkAllowedMethods = useCallback(async () => {
//     const token = getToken();
    
//     if (!token) {
//       showMessage('Pas de token trouvé', 'error');
//       return;
//     }
    
//     try {
//       const response = await fetch(PROFILE_ENDPOINT, {
//         method: 'OPTIONS',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (response.ok) {
//         const allowed = response.headers.get('Allow');
//         const methods = allowed ? allowed.split(',').map(m => m.trim()) : [];
//         setAllowedMethods(methods);
        
//         if (!methods.includes('PATCH') && !methods.includes('PUT')) {
//           showMessage(`⚠️ Méthodes autorisées: ${methods.join(', ')}. PATCH/PUT manquant.`, 'warning');
//         } else {
//           showMessage(`✅ Méthodes autorisées: ${methods.join(', ')}`, 'success');
//         }
//       }
//     } catch (error) {
//       console.error('❌ Erreur OPTIONS:', error);
//       showMessage('Impossible de vérifier les méthodes', 'error');
//     }
//   }, [getToken, showMessage]);

//   // Sauvegarder dans Django avec gestion intelligente
//   const saveToDjango = useCallback(async () => {
//     const token = getToken();
    
//     if (!token) {
//       showMessage('❌ Pas de token. Sauvegarde locale.', 'error');
//       saveToLocal();
//       return;
//     }
    
//     // Vérifier d'abord les méthodes autorisées si non connues
//     if (allowedMethods.length === 0) {
//       await checkAllowedMethods();
//     }
    
//     try {
//       setSaveLoading(true);
//       showMessage('Sauvegarde en cours...', 'info');
      
//       // Essayer différentes combinaisons
//       const endpoints = [
//         { url: PROFILE_ENDPOINT, method: 'PATCH' },
//         { url: PROFILE_ENDPOINT, method: 'PUT' },
//         { url: `${API_BASE}/api/users/me/`, method: 'PATCH' },
//         { url: `${API_BASE}/api/profile/update/`, method: 'POST' }
//       ];
      
//       let success = false;
//       let lastError = null;
      
//       for (const endpoint of endpoints) {
//         try {
//           console.log(`🔍 Essai ${endpoint.method} ${endpoint.url}`);
          
//           const response = await axios({
//             method: endpoint.method,
//             url: endpoint.url,
//             data: formData,
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             },
//             timeout: 3000
//           });
          
//           if (response.status === 200 || response.status === 201) {
//             console.log(`✅ ${endpoint.method} réussie:`, response.data);
            
//             setUser(response.data);
//             localStorage.setItem('simplon_user', JSON.stringify(response.data));
            
//             showMessage('✅ Sauvegardé dans PostgreSQL !', 'success');
//             setEditMode(false);
//             setMode('django');
            
//             success = true;
//             break;
//           }
//         } catch (error) {
//           console.log(`❌ ${endpoint.method}:`, error.response?.status || error.message);
//           lastError = error;
//         }
//       }
      
//       if (!success) {
//         // Si 405, proposer une solution
//         if (lastError?.response?.status === 405) {
//           showMessage(
//             '❌ Endpoint ne supporte pas PATCH/PUT. Utilisez le formulaire Django admin ou modifiez la vue.',
//             'error'
//           );
//         } else {
//           showMessage('❌ Impossible de sauvegarder sur le serveur', 'error');
//         }
//         saveToLocal();
//       }
      
//     } catch (error) {
//       console.error('❌ Erreur générale:', error);
//       showMessage('❌ Erreur de connexion au serveur', 'error');
//       saveToLocal();
//     } finally {
//       setSaveLoading(false);
//     }
//   }, [getToken, formData, allowedMethods, checkAllowedMethods]);

//   // Sauvegarder localement
//   const saveToLocal = useCallback(() => {
//     console.log('💾 Sauvegarde locale...');
    
//     const updatedUser = { 
//       ...user, 
//       ...formData,
//       updated_at: new Date().toISOString()
//     };
    
//     setUser(updatedUser);
//     localStorage.setItem('simplon_user', JSON.stringify(updatedUser));
    
//     showMessage('✅ Sauvegardé localement (dans le navigateur)', 'success');
//     setEditMode(false);
//     setMode('local');
//   }, [user, formData, showMessage]);

//   // Connexion à Django
//   const loginToDjango = useCallback(async () => {
//     const username = prompt('Nom d\'utilisateur Django (ex: admin):');
//     if (!username) return;
    
//     const password = prompt('Mot de passe:');
//     if (!password) return;
    
//     try {
//       setLoading(true);
//       showMessage('Connexion en cours...', 'info');
      
//       const response = await axios.post(`${API_BASE}/api/token/`, {
//         username: username.trim(),
//         password: password
//       }, { 
//         timeout: 5000,
//         headers: { 'Content-Type': 'application/json' }
//       });
      
//       if (response.data.access) {
//         localStorage.setItem('simplon_access_token', response.data.access);
//         localStorage.setItem('refresh_token', response.data.refresh);
        
//         showMessage('✅ Connecté à Django avec succès !', 'success');
        
//         // Recharger les données
//         setTimeout(() => {
//           loadFromDjango();
//           checkAllowedMethods();
//           setLoading(false);
//         }, 1000);
//       }
      
//     } catch (error) {
//       console.error('❌ Erreur connexion:', error.response?.data || error.message);
//       const errorMsg = error.response?.data?.detail || 
//                       error.response?.data?.non_field_errors?.[0] || 
//                       'Identifiants incorrects ou serveur inaccessible';
//       showMessage(`❌ ${errorMsg}`, 'error');
//       setLoading(false);
//     }
//   }, [loadFromDjango, checkAllowedMethods, showMessage]);

//   // Effet au démarrage
//   useEffect(() => {
//     const initializeProfile = async () => {
//       setLoading(true);
      
//       // Charger d'abord localement (immédiat)
//       loadFromLocal();
      
//       // Puis essayer Django (asynchrone)
//       try {
//         await loadFromDjango();
//       } catch (error) {
//         console.log('Django non disponible, continuation en mode local');
//       }
      
//       // Vérifier les méthodes autorisées si token existe
//       const token = getToken();
//       if (token) {
//         checkAllowedMethods();
//       }
      
//       setLoading(false);
//     };
    
//     initializeProfile();
//   }, [loadFromLocal, loadFromDjango, checkAllowedMethods, getToken]);

//   // Rendu conditionnel
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E30613] mx-auto mb-4"></div>
//           <p className="text-gray-600 dark:text-gray-400">Chargement du profil...</p>
//         </div>
//       </div>
//     );
//   }

//   // Styles réutilisables
//   const styles = {
//     buttonPrimary: "px-4 py-2 bg-[#E30613] text-white rounded-lg hover:bg-[#c40511] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed",
//     buttonSecondary: "px-4 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003265] transition-colors font-medium",
//     buttonSuccess: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium",
//     buttonWarning: "px-4 py-2 bg-yellow-500 text-yellow-900 rounded-lg hover:bg-yellow-600 transition-colors font-medium",
//     inputField: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4 md:p-6">
//       {/* En-tête */}
//       <div className="mb-8">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-[#001F3F] dark:text-white">
//               👤 Mon Profil
//             </h1>
//             <p className="text-gray-600 dark:text-gray-400 mt-2">
//               Gérez vos informations personnelles
//             </p>
//           </div>
          
//           <div className="flex flex-wrap gap-2">
//             <button
//               onClick={loadFromDjango}
//               className={styles.buttonSecondary}
//             >
//               🔄 Actualiser
//             </button>
            
//             <button
//               onClick={loginToDjango}
//               className={styles.buttonSuccess}
//             >
//               🔑 Connexion Django
//             </button>
            
//             <button
//               onClick={checkAllowedMethods}
//               className={styles.buttonWarning}
//             >
//               ⚙️ Vérifier API
//             </button>
//           </div>
//         </div>

//         {/* Message d'état */}
//         {message.text && (
//           <div className={`p-4 rounded-lg mb-4 ${
//             message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
//             message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
//             message.type === 'warning' ? 'bg-yellow-50 border border-yellow-200 text-yellow-800' :
//             'bg-blue-50 border border-blue-200 text-blue-800'
//           }`}>
//             <div className="flex items-center">
//               {message.type === 'success' && '✅ '}
//               {message.type === 'error' && '❌ '}
//               {message.type === 'warning' && '⚠️ '}
//               <span className="ml-2">{message.text}</span>
//             </div>
//           </div>
//         )}

//         {/* Indicateur de mode */}
//         <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
//           mode === 'django' 
//             ? 'bg-green-100 text-green-800 border border-green-200' 
//             : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
//         }`}>
//           <span className={`w-2 h-2 rounded-full mr-2 ${
//             mode === 'django' ? 'bg-green-500' : 'bg-yellow-500'
//           }`}></span>
//           {mode === 'django' ? '✅ PostgreSQL' : '📱 Mode local'}
//           {user?._source && (
//             <span className="ml-2 text-xs opacity-75">
//               ({user._source})
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Conteneur principal */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Formulaire */}
//         <div className="lg:col-span-2">
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
//             <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
//               Informations personnelles
//             </h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Prénom
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.first_name}
//                   onChange={(e) => setFormData({...formData, first_name: e.target.value})}
//                   disabled={!editMode}
//                   className={`${styles.inputField} ${!editMode ? 'bg-gray-50 dark:bg-gray-700' : ''}`}
//                   placeholder="Votre prénom"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Nom
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.last_name}
//                   onChange={(e) => setFormData({...form-data, last_name: e.target.value})}
//                   disabled={!editMode}
//                   className={`${styles.inputField} ${!editMode ? 'bg-gray-50 dark:bg-gray-700' : ''}`}
//                   placeholder="Votre nom"
//                 />
//               </div>
              
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => setFormData({...formData, email: e.target.value})}
//                   disabled={!editMode}
//                   className={`${styles.inputField} ${!editMode ? 'bg-gray-50 dark:bg-gray-700' : ''}`}
//                   placeholder="votre@email.com"
//                 />
//               </div>
//             </div>
            
//             {/* Boutons d'action */}
//             <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
//               {!editMode ? (
//                 <button
//                   onClick={() => setEditMode(true)}
//                   className={styles.buttonPrimary}
//                 >
//                   ✏️ Modifier le profil
//                 </button>
//               ) : (
//                 <>
//                   <button
//                     onClick={() => {
//                       setEditMode(false);
//                       loadFromLocal();
//                     }}
//                     className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
//                   >
//                     ❌ Annuler
//                   </button>
                  
//                   <button
//                     onClick={saveToLocal}
//                     className="px-4 py-2 bg-yellow-500 text-yellow-900 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
//                   >
//                     📱 Sauvegarder local
//                   </button>
                  
//                   <button
//                     onClick={saveToDjango}
//                     disabled={saveLoading}
//                     className={`${styles.buttonSuccess} ${saveLoading ? 'opacity-70 cursor-wait' : ''}`}
//                   >
//                     {saveLoading ? (
//                       <>
//                         <span className="inline-block animate-spin mr-2">⟳</span>
//                         Sauvegarde...
//                       </>
//                     ) : (
//                       '🗄️ Sauvegarder PostgreSQL'
//                     )}
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Panel d'informations */}
//         <div className="space-y-6">
//           {/* Informations utilisateur */}
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
//             <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
//               Informations système
//             </h3>
//             <div className="space-y-3">
//               <div>
//                 <span className="text-sm text-gray-500 dark:text-gray-400">Nom d'utilisateur:</span>
//                 <p className="font-medium">{user?.username || 'N/A'}</p>
//               </div>
//               <div>
//                 <span className="text-sm text-gray-500 dark:text-gray-400">Rôle:</span>
//                 <p className="font-medium">
//                   {user?.is_superuser ? '👑 Super Admin' : 
//                    user?.is_staff ? '🛠️ Administrateur' : '👤 Utilisateur'}
//                 </p>
//               </div>
//               <div>
//                 <span className="text-sm text-gray-500 dark:text-gray-400">Matricule:</span>
//                 <p className="font-medium">{user?.matricule || 'N/A'}</p>
//               </div>
//               <div>
//                 <span className="text-sm text-gray-500 dark:text-gray-400">Promotion:</span>
//                 <p className="font-medium">{user?.cohort || 'N/A'}</p>
//               </div>
//             </div>
//           </div>

//           {/* Aide API */}
//           {allowedMethods.length > 0 && (
//             <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
//               <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-3">
//                 🔧 Informations API
//               </h3>
//               <div className="space-y-2">
//                 <p className="text-sm text-blue-700 dark:text-blue-400">
//                   Méthodes autorisées:
//                 </p>
//                 <div className="flex flex-wrap gap-2">
//                   {allowedMethods.map(method => (
//                     <span 
//                       key={method}
//                       className={`px-2 py-1 text-xs rounded ${
//                         method === 'GET' ? 'bg-green-100 text-green-800' :
//                         method === 'POST' ? 'bg-blue-100 text-blue-800' :
//                         method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
//                         method === 'PATCH' ? 'bg-purple-100 text-purple-800' :
//                         'bg-gray-100 text-gray-800'
//                       }`}
//                     >
//                       {method}
//                     </span>
//                   ))}
//                 </div>
//                 {(!allowedMethods.includes('PATCH') && !allowedMethods.includes('PUT')) && (
//                   <p className="text-sm text-red-600 dark:text-red-400 mt-3">
//                     ⚠️ L'API ne permet pas la modification. Contactez l'administrateur backend.
//                   </p>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Mode local info */}
//           {mode === 'local' && (
//             <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
//               <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-300 mb-3">
//                 📱 Mode local actif
//               </h3>
//               <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-3">
//                 Vous travaillez avec des données locales. Les modifications seront perdues si vous nettoyez le cache.
//               </p>
//               <button
//                 onClick={loginToDjango}
//                 className="w-full px-4 py-2 bg-yellow-500 text-yellow-900 rounded-lg hover:bg-yellow-600 transition-colors font-medium text-sm"
//               >
//                 Se connecter à Django
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Solution technique (seulement si problème API) */}
//       {allowedMethods.length > 0 && !allowedMethods.includes('PATCH') && !allowedMethods.includes('PUT') && (
//         <div className="mt-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
//           <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-3">
//             ⚠️ Correction requise côté backend
//           </h3>
//           <p className="text-sm text-red-700 dark:text-red-400 mb-4">
//             L'API ne permet pas la modification du profil. Contactez l'administrateur backend.
//           </p>
          
//           <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
//             <h4 className="font-medium text-gray-800 dark:text-white mb-2">
//               Solution à implémenter dans <code>users/views.py</code>:
//             </h4>
//             <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
// {`from rest_framework import generics, permissions
// from django.contrib.auth import get_user_model
// from .serializers import UserSerializer

// User = get_user_model()

// class UserProfileView(generics.RetrieveUpdateAPIView):
//     """Vue pour lire et modifier le profil utilisateur"""
//     permission_classes = [permissions.IsAuthenticated]
//     serializer_class = UserSerializer
    
//     def get_object(self):
//         return self.request.user`}
//             </pre>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Profile;


// // src/components/admin/Profile.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: ''
//   });
//   const [saveLoading, setSaveLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [mode, setMode] = useState('local');
//   const [apiMethods, setApiMethods] = useState([]);

//   const API_BASE = 'http://localhost:8000';
//   const PROFILE_ENDPOINT = `${API_BASE}/api/users/profile/`;

//   // Trouver le token
//   const getToken = () => {
//     // Chercher le vrai token (pas mock)
//     const realToken = localStorage.getItem('simplon_access_token');
//     if (realToken && !realToken.startsWith('mock_token_')) {
//       return realToken;
//     }
    
//     // Chercher dans autres clés
//     const otherKeys = ['authToken', 'token', 'access_token'];
//     for (const key of otherKeys) {
//       const token = localStorage.getItem(key);
//       if (token) return token;
//     }
    
//     return null;
//   };

//   // Charger depuis Django
//   const loadFromDjango = async () => {
//     const token = getToken();
    
//     if (!token) {
//       console.log('Mode: Pas de token → Local');
//       loadFromLocal();
//       return;
//     }
    
//     try {
//       console.log('🔄 Chargement depuis Django...');
      
//       const response = await axios.get(PROFILE_ENDPOINT, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         timeout: 3000
//       });
      
//       console.log('✅ Données Django:', response.data);
      
//       setUser(response.data);
//       setFormData({
//         first_name: response.data.first_name || '',
//         last_name: response.data.last_name || '',
//         email: response.data.email || ''
//       });
      
//       localStorage.setItem('user', JSON.stringify(response.data));
//       setMode('django');
//       setMessage('✅ Connecté à PostgreSQL');
      
//     } catch (error) {
//       console.error('❌ Erreur Django:', error.response?.status || error.message);
      
//       if (error.response?.status === 401) {
//         setMessage('❌ Token invalide ou expiré');
//       } else if (error.response?.status === 404) {
//         setMessage('❌ Endpoint non trouvé');
//       } else {
//         setMessage('⚠️ Django non accessible');
//       }
      
//       loadFromLocal();
//     }
//   };

//   // Charger depuis localStorage
//   const loadFromLocal = () => {
//     console.log('📱 Chargement depuis localStorage...');
    
//     const userStr = localStorage.getItem('user');
//     if (userStr) {
//       try {
//         const userData = JSON.parse(userStr);
//         console.log('✅ Données locales:', userData);
        
//         setUser(userData);
//         setFormData({
//           first_name: userData.first_name || '',
//           last_name: userData.last_name || '',
//           email: userData.email || ''
//         });
        
//         setMode('local');
//       } catch (e) {
//         console.error('❌ Erreur parsing:', e);
//       }
//     } else {
//       // Données par défaut
//       const defaultUser = {
//         username: 'admin',
//         first_name: 'Admin',
//         last_name: 'System',
//         email: 'admin@simplon.com',
//         is_superuser: true,
//         is_staff: true,
//         matricule: 'admin',
//         cohort: 'Simplon 2024',
//         _source: 'simulation'
//       };
      
//       setUser(defaultUser);
//       setFormData({
//         first_name: defaultUser.first_name,
//         last_name: defaultUser.last_name,
//         email: defaultUser.email
//       });
//       setMode('local');
//     }
//   };

//   // Sauvegarder dans Django
//   const saveToDjango = async () => {
//     const token = getToken();
    
//     if (!token) {
//       setMessage('❌ Pas de token. Sauvegarde locale.');
//       saveToLocal();
//       return;
//     }
    
//     try {
//       setSaveLoading(true);
//       setMessage('Sauvegarde en cours...');
      
//       // Vérifier d'abord les méthodes autorisées
//       if (apiMethods.length === 0) {
//         await checkAllowedMethods();
//       }
      
//       // Essayer PATCH d'abord, puis PUT
//       const methodsToTry = apiMethods.includes('PATCH') ? ['PATCH'] : 
//                           apiMethods.includes('PUT') ? ['PUT'] : 
//                           ['PATCH', 'PUT'];
      
//       let success = false;
      
//       for (const method of methodsToTry) {
//         try {
//           console.log(`🔍 Essai ${method} ${PROFILE_ENDPOINT}`);
          
//           const response = await axios({
//             method: method,
//             url: PROFILE_ENDPOINT,
//             data: formData,
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             },
//             timeout: 3000
//           });
          
//           if (response.status === 200) {
//             console.log(`✅ ${method} réussie:`, response.data);
            
//             setUser(response.data);
//             localStorage.setItem('user', JSON.stringify(response.data));
            
//             setMessage('✅ Sauvegardé dans PostgreSQL !');
//             setEditMode(false);
//             setMode('django');
            
//             success = true;
//             break;
//           }
//         } catch (error) {
//           console.log(`❌ ${method}:`, error.response?.status || error.message);
//         }
//       }
      
//       if (!success) {
//         setMessage('❌ Impossible de sauvegarder (méthode non autorisée).');
//         saveToLocal();
//       }
      
//     } catch (error) {
//       console.error('❌ Erreur générale:', error);
//       setMessage('❌ Erreur de connexion');
//       saveToLocal();
//     } finally {
//       setSaveLoading(false);
//     }
//   };

//   // Sauvegarder localement
//   const saveToLocal = () => {
//     console.log('💾 Sauvegarde locale...');
    
//     const updatedUser = { ...user, ...formData };
//     setUser(updatedUser);
//     localStorage.setItem('user', JSON.stringify(updatedUser));
    
//     setMessage('✅ Sauvegardé localement (dans le navigateur)');
//     setEditMode(false);
//     setMode('local');
//   };

//   // Vérifier les méthodes autorisées
//   const checkAllowedMethods = async () => {
//     const token = getToken();
    
//     if (!token) {
//       setMessage('Pas de token trouvé');
//       return;
//     }
    
//     try {
//       const response = await fetch(PROFILE_ENDPOINT, {
//         method: 'OPTIONS',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (response.ok) {
//         const allowed = response.headers.get('Allow');
//         const methods = allowed ? allowed.split(',').map(m => m.trim()) : ['GET'];
//         setApiMethods(methods);
        
//         setMessage(`Méthodes API: ${methods.join(', ')}`);
//       }
//     } catch (error) {
//       console.error('❌ Erreur OPTIONS:', error);
//     }
//   };

//   // Effet au démarrage
//   useEffect(() => {
//     const init = async () => {
//       setLoading(true);
      
//       // Charger local d'abord
//       loadFromLocal();
      
//       // Puis essayer Django
//       await loadFromDjango();
      
//       setLoading(false);
//     };
    
//     init();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E30613] mx-auto mb-4"></div>
//           <p className="text-gray-600 dark:text-gray-400">Chargement du profil...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       {/* En-tête */}
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-[#001F3F] dark:text-white mb-2">
//           👤 Mon Profil
//         </h1>
        
//         {/* Message */}
//         {message && (
//           <div className={`p-3 rounded-lg mb-4 ${
//             message.includes('✅') ? 'bg-green-50 border border-green-200 text-green-800' :
//             message.includes('❌') ? 'bg-red-50 border border-red-200 text-red-800' :
//             'bg-blue-50 border border-blue-200 text-blue-800'
//           }`}>
//             {message}
//           </div>
//         )}
        
//         {/* Indicateur de mode */}
//         <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${
//           mode === 'django' 
//             ? 'bg-green-100 text-green-800 border border-green-200' 
//             : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
//         }`}>
//           <span className={`w-2 h-2 rounded-full mr-2 ${
//             mode === 'django' ? 'bg-green-500' : 'bg-yellow-500'
//           }`}></span>
//           {mode === 'django' ? '✅ PostgreSQL' : '📱 Mode local'}
//         </div>
        
//         {/* Contrôles */}
//         <div className="flex flex-wrap gap-2 mb-6">
//           <button
//             onClick={loadFromDjango}
//             className="px-4 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003265] transition-colors"
//           >
//             🔄 Actualiser
//           </button>
          
//           <button
//             onClick={checkAllowedMethods}
//             className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
//           >
//             ⚙️ Vérifier API
//           </button>
//         </div>
//       </div>

//       {/* Formulaire */}
//       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
//         <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
//           Informations personnelles
//         </h2>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Prénom
//             </label>
//             <input
//               type="text"
//               value={formData.first_name}
//               onChange={(e) => setFormData({...formData, first_name: e.target.value})}
//               disabled={!editMode}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Nom
//             </label>
//             <input
//               type="text"
//               value={formData.last_name}
//               onChange={(e) => setFormData({...formData, last_name: e.target.value})}
//               disabled={!editMode}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
//             />
//           </div>
          
//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Email
//             </label>
//             <input
//               type="email"
//               value={formData.email}
//               onChange={(e) => setFormData({...formData, email: e.target.value})}
//               disabled={!editMode}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
//             />
//           </div>
//         </div>
        
//         {/* Boutons */}
//         <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
//           {!editMode ? (
//             <button
//               onClick={() => setEditMode(true)}
//               className="px-6 py-2 bg-[#E30613] text-white rounded-lg hover:bg-[#c40511] transition-colors font-medium"
//             >
//               ✏️ Modifier
//             </button>
//           ) : (
//             <>
//               <button
//                 onClick={() => {
//                   setEditMode(false);
//                   loadFromLocal();
//                 }}
//                 className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
//               >
//                 ❌ Annuler
//               </button>
              
//               <button
//                 onClick={saveToLocal}
//                 className="px-6 py-2 bg-yellow-500 text-yellow-900 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
//               >
//                 📱 Sauvegarder local
//               </button>
              
//               <button
//                 onClick={saveToDjango}
//                 disabled={saveLoading}
//                 className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium ${
//                   saveLoading ? 'opacity-70 cursor-not-allowed' : ''
//                 }`}
//               >
//                 {saveLoading ? '⏳ Sauvegarde...' : '🗄️ Sauvegarder PostgreSQL'}
//               </button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Informations système */}
//       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
//         <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
//           Informations système
//         </h3>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <div>
//             <span className="text-sm text-gray-500 dark:text-gray-400">Nom d'utilisateur:</span>
//             <p className="font-medium">{user?.username || 'N/A'}</p>
//           </div>
//           <div>
//             <span className="text-sm text-gray-500 dark:text-gray-400">Rôle:</span>
//             <p className="font-medium">
//               {user?.is_superuser ? '👑 Super Admin' : 
//                user?.is_staff ? '🛠️ Admin' : '👤 Utilisateur'}
//             </p>
//           </div>
//           <div>
//             <span className="text-sm text-gray-500 dark:text-gray-400">Matricule:</span>
//             <p className="font-medium">{user?.matricule || 'N/A'}</p>
//           </div>
//           <div>
//             <span className="text-sm text-gray-500 dark:text-gray-400">Promotion:</span>
//             <p className="font-medium">{user?.cohort || 'N/A'}</p>
//           </div>
//         </div>
//       </div>

//       {/* Info API */}
//       {apiMethods.length > 0 && !apiMethods.includes('PATCH') && !apiMethods.includes('PUT') && (
//         <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-6">
//           <h3 className="text-lg font-bold text-red-800 mb-3">
//             ⚠️ Action requise côté backend
//           </h3>
//           <p className="text-sm text-red-700 mb-4">
//             L'API ne permet pas la modification (PATCH/PUT manquant). 
//             Seules ces méthodes sont autorisées: <strong>{apiMethods.join(', ')}</strong>
//           </p>
          
//           <div className="bg-white rounded-lg p-4">
//             <h4 className="font-medium text-gray-800 mb-2">
//               Ajoutez dans <code>users/views.py</code>:
//             </h4>
//             <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
// {`from rest_framework import generics, permissions

// class UserProfileView(generics.RetrieveUpdateAPIView):
//     permission_classes = [permissions.IsAuthenticated]
//     serializer_class = UserSerializer
    
//     def get_object(self):
//         return self.request.user`}
//             </pre>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Profile;


// // src/components/admin/Profile.jsx - VERSION COMPLÈTE AMÉLIORÉE
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import axios from 'axios';
// import { 
//   User, Mail, Phone, Briefcase, Calendar, GraduationCap,
//   Github, Linkedin, Globe, Camera, Upload, CheckCircle,
//   History, Bell, Settings, Save, Edit, X, Image as ImageIcon
// } from 'lucide-react';

// const Profile = () => {
//   // États principaux
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [activeTab, setActiveTab] = useState('profile');
//   const [uploadingImage, setUploadingImage] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [profileHistory, setProfileHistory] = useState([]);
//   const [stats, setStats] = useState(null);

//   const fileInputRef = useRef(null);
//   const API_BASE = 'http://localhost:8000';

//   // Données du formulaire
//   const [formData, setFormData] = useState({
//     // Informations de base
//     first_name: '',
//     last_name: '',
//     email: '',
    
//     // Profil étendu
//     profile: {
//       phone: '',
//       bio: '',
//       github_url: '',
//       linkedin_url: '',
//       portfolio_url: '',
//       cohort: '',
//       specialite: '',
//       date_entree: '',
//       date_sortie: '',
//       email_notifications: true,
//       dark_mode: false,
//     }
//   });

//   const [message, setMessage] = useState({ text: '', type: '' });

//   // Obtenir le token
//   const getToken = useCallback(() => {
//     const tokenKeys = ['simplon_access_token', 'authToken', 'token', 'access_token'];
//     for (const key of tokenKeys) {
//       const token = localStorage.getItem(key);
//       if (token && !token.startsWith('mock_token_')) {
//         return token;
//       }
//     }
//     return null;
//   }, []);

//   // Afficher un message
//   const showMessage = useCallback((text, type = 'info') => {
//     setMessage({ text, type });
//     setTimeout(() => setMessage({ text: '', type: '' }), 5000);
//   }, []);

//   // Charger le profil complet
//   const loadCompleteProfile = useCallback(async () => {
//     const token = getToken();
//     if (!token) {
//       showMessage('Mode local (pas de token)', 'warning');
//       loadFromLocal();
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await axios.get(`${API_BASE}/api/users/profile/complete/`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       const userData = response.data;
//       setUser(userData);
//       setFormData({
//         first_name: userData.first_name || '',
//         last_name: userData.last_name || '',
//         email: userData.email || '',
//         profile: {
//           phone: userData.profile?.phone || '',
//           bio: userData.profile?.bio || '',
//           github_url: userData.profile?.github_url || '',
//           linkedin_url: userData.profile?.linkedin_url || '',
//           portfolio_url: userData.profile?.portfolio_url || '',
//           cohort: userData.profile?.cohort || '',
//           specialite: userData.profile?.specialite || '',
//           date_entree: userData.profile?.date_entree || '',
//           date_sortie: userData.profile?.date_sortie || '',
//           email_notifications: userData.profile?.email_notifications ?? true,
//           dark_mode: userData.profile?.dark_mode ?? false,
//         }
//       });

//       showMessage('✅ Profil chargé avec succès', 'success');
      
//     } catch (error) {
//       console.error('Erreur chargement profil:', error);
//       showMessage('⚠️ Impossible de charger le profil complet', 'warning');
//       loadFromLocal();
//     } finally {
//       setLoading(false);
//     }
//   }, [getToken, showMessage]);

//   // Charger depuis localStorage
//   const loadFromLocal = useCallback(() => {
//     const userStr = localStorage.getItem('simplon_user');
//     if (userStr) {
//       try {
//         const userData = JSON.parse(userStr);
//         setUser(userData);
//         setFormData({
//           first_name: userData.first_name || '',
//           last_name: userData.last_name || '',
//           email: userData.email || '',
//           profile: {
//             phone: userData.profile?.phone || '',
//             bio: userData.profile?.bio || '',
//             github_url: userData.profile?.github_url || '',
//             linkedin_url: userData.profile?.linkedin_url || '',
//             portfolio_url: userData.profile?.portfolio_url || '',
//             cohort: userData.profile?.cohort || '',
//             specialite: userData.profile?.specialite || '',
//             date_entree: userData.profile?.date_entree || '',
//             date_sortie: userData.profile?.date_sortie || '',
//             email_notifications: userData.profile?.email_notifications ?? true,
//             dark_mode: userData.profile?.dark_mode ?? false,
//           }
//         });
//       } catch (e) {
//         console.error('Erreur parsing:', e);
//       }
//     }
//   }, []);

//   // Sauvegarder le profil
//   const saveProfile = useCallback(async () => {
//     const token = getToken();
//     if (!token) {
//       showMessage('❌ Pas de token. Sauvegarde locale.', 'error');
//       saveToLocal();
//       return;
//     }

//     try {
//       setLoading(true);
//       showMessage('Sauvegarde en cours...', 'info');

//       const response = await axios.patch(
//         `${API_BASE}/api/users/profile/complete/`,
//         formData,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       setUser(response.data);
//       localStorage.setItem('simplon_user', JSON.stringify(response.data));
      
//       showMessage('✅ Profil sauvegardé avec succès !', 'success');
//       setEditMode(false);
      
//     } catch (error) {
//       console.error('Erreur sauvegarde:', error);
//       showMessage('❌ Erreur lors de la sauvegarde', 'error');
//     } finally {
//       setLoading(false);
//     }
//   }, [formData, getToken, showMessage]);

//   // Sauvegarder localement
//   const saveToLocal = useCallback(() => {
//     const updatedUser = { 
//       ...user, 
//       ...formData,
//       updated_at: new Date().toISOString()
//     };
    
//     setUser(updatedUser);
//     localStorage.setItem('simplon_user', JSON.stringify(updatedUser));
    
//     showMessage('✅ Sauvegardé localement', 'success');
//     setEditMode(false);
//   }, [user, formData, showMessage]);

//   // Uploader une photo de profil
//   const uploadProfileImage = useCallback(async (file) => {
//     const token = getToken();
//     if (!token) {
//       showMessage('❌ Pas de token', 'error');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('profile_picture', file);

//     try {
//       setUploadingImage(true);
//       const response = await axios.patch(
//         `${API_BASE}/api/users/profile/image/`,
//         formData,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data'
//           }
//         }
//       );

//       // Mettre à jour l'utilisateur
//       setUser(prev => ({
//         ...prev,
//         profile: {
//           ...prev.profile,
//           ...response.data
//         }
//       }));

//       showMessage('✅ Photo de profil mise à jour !', 'success');
      
//     } catch (error) {
//       console.error('Erreur upload:', error);
//       showMessage('❌ Erreur lors du téléchargement', 'error');
//     } finally {
//       setUploadingImage(false);
//     }
//   }, [getToken, showMessage]);

//   // Charger les notifications
//   const loadNotifications = useCallback(async () => {
//     const token = getToken();
//     if (!token) return;

//     try {
//       const response = await axios.get(`${API_BASE}/api/users/notifications/`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       setNotifications(response.data.notifications || []);
//     } catch (error) {
//       console.error('Erreur notifications:', error);
//     }
//   }, [getToken]);

//   // Charger l'historique
//   const loadProfileHistory = useCallback(async () => {
//     const token = getToken();
//     if (!token) return;

//     try {
//       const response = await axios.get(`${API_BASE}/api/users/profile/history/`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       setProfileHistory(response.data || []);
//     } catch (error) {
//       console.error('Erreur historique:', error);
//     }
//   }, [getToken]);

//   // Charger les statistiques
//   const loadStats = useCallback(async () => {
//     const token = getToken();
//     if (!token) return;

//     try {
//       const response = await axios.get(`${API_BASE}/api/users/stats/`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       setStats(response.data);
//     } catch (error) {
//       console.error('Erreur stats:', error);
//     }
//   }, [getToken]);

//   // Effet initial
//   useEffect(() => {
//     loadCompleteProfile();
//     loadNotifications();
//     loadStats();
//   }, [loadCompleteProfile, loadNotifications, loadStats]);

//   // Rendu conditionnel
//   if (loading && !user) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E30613] mx-auto mb-4"></div>
//           <p className="text-gray-600">Chargement du profil...</p>
//         </div>
//       </div>
//     );
//   }

//   // Composants UI
//   const ProfileHeader = () => (
//     <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
//       <div className="flex flex-col md:flex-row items-center gap-6">
//         {/* Photo de profil */}
//         <div className="relative">
//           <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#E30613] bg-gray-100">
//             {user?.profile?.profile_picture_url ? (
//               <img 
//                 src={user.profile.profile_picture_url} 
//                 alt="Profile" 
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
//                 <User size={48} className="text-gray-400" />
//               </div>
//             )}
//           </div>
          
//           <button
//             onClick={() => fileInputRef.current?.click()}
//             disabled={uploadingImage}
//             className="absolute bottom-2 right-2 bg-[#E30613] text-white p-2 rounded-full hover:bg-[#c40511] transition-colors disabled:opacity-50"
//           >
//             {uploadingImage ? (
//               <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
//             ) : (
//               <Camera size={20} />
//             )}
//           </button>
          
//           <input
//             type="file"
//             ref={fileInputRef}
//             className="hidden"
//             accept="image/*"
//             onChange={(e) => {
//               const file = e.target.files[0];
//               if (file) uploadProfileImage(file);
//             }}
//           />
//         </div>

//         {/* Infos utilisateur */}
//         <div className="flex-1 text-center md:text-left">
//           <h1 className="text-2xl font-bold text-gray-800">
//             {user?.first_name && user?.last_name 
//               ? `${user.first_name} ${user.last_name}`
//               : user?.username}
//           </h1>
          
//           <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
//             <div className="flex items-center gap-2 text-gray-600">
//               <User size={16} />
//               <span>{user?.username}</span>
//             </div>
            
//             <div className="flex items-center gap-2 text-gray-600">
//               <Mail size={16} />
//               <span>{user?.email}</span>
//             </div>
            
//             {user?.profile?.phone && (
//               <div className="flex items-center gap-2 text-gray-600">
//                 <Phone size={16} />
//                 <span>{user.profile.phone}</span>
//               </div>
//             )}
            
//             {user?.profile?.cohort && (
//               <div className="flex items-center gap-2 text-gray-600">
//                 <GraduationCap size={16} />
//                 <span>{user.profile.cohort}</span>
//               </div>
//             )}
//           </div>
          
//           {stats && (
//             <div className="mt-4">
//               <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
//                 <span>Profil complété à {stats.profile_stats?.profile_completion || 0}%</span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Boutons d'action */}
//         <div className="flex gap-3">
//           {!editMode ? (
//             <button
//               onClick={() => setEditMode(true)}
//               className="flex items-center gap-2 px-4 py-2 bg-[#E30613] text-white rounded-lg hover:bg-[#c40511] transition-colors"
//             >
//               <Edit size={18} />
//               Modifier
//             </button>
//           ) : (
//             <>
//               <button
//                 onClick={() => {
//                   setEditMode(false);
//                   loadCompleteProfile();
//                 }}
//                 className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
//               >
//                 <X size={18} />
//                 Annuler
//               </button>
              
//               <button
//                 onClick={saveProfile}
//                 disabled={loading}
//                 className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
//               >
//                 {loading ? (
//                   <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
//                 ) : (
//                   <Save size={18} />
//                 )}
//                 Sauvegarder
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   const TabsNavigation = () => (
//     <div className="bg-white rounded-xl shadow-lg p-1 mb-6">
//       <div className="flex flex-wrap gap-1">
//         {[
//           { id: 'profile', label: 'Profil', icon: User },
//           { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.filter(n => !n.is_read).length },
//           { id: 'history', label: 'Historique', icon: History },
//           { id: 'settings', label: 'Paramètres', icon: Settings },
//         ].map(tab => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
//               activeTab === tab.id
//                 ? 'bg-[#E30613] text-white'
//                 : 'text-gray-600 hover:bg-gray-100'
//             }`}
//           >
//             <tab.icon size={18} />
//             <span>{tab.label}</span>
//             {tab.badge && tab.badge > 0 && (
//               <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
//                 {tab.badge}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>
//     </div>
//   );

//   const ProfileTab = () => (
//     <div className="bg-white rounded-xl shadow-lg p-6">
//       <h2 className="text-xl font-bold text-gray-800 mb-6">Informations personnelles</h2>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Section informations de base */}
//         <div className="space-y-6">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
//               <User size={18} />
//               Informations de base
//             </h3>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Prénom
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.first_name}
//                   onChange={(e) => setFormData({...formData, first_name: e.target.value})}
//                   disabled={!editMode}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Nom
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.last_name}
//                   onChange={(e) => setFormData({...formData, last_name: e.target.value})}
//                   disabled={!editMode}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => setFormData({...formData, email: e.target.value})}
//                   disabled={!editMode}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Téléphone
//                 </label>
//                 <input
//                   type="tel"
//                   value={formData.profile.phone}
//                   onChange={(e) => setFormData({
//                     ...formData, 
//                     profile: {...formData.profile, phone: e.target.value}
//                   })}
//                   disabled={!editMode}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
//                 />
//               </div>
//             </div>
//           </div>
          
//           {/* Section biographie */}
//           <div>
//             <h3 className="text-lg font-semibold text-gray-700 mb-4">Biographie</h3>
//             <textarea
//               value={formData.profile.bio}
//               onChange={(e) => setFormData({
//                 ...formData, 
//                 profile: {...formData.profile, bio: e.target.value}
//               })}
//               disabled={!editMode}
//               rows="4"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
//               placeholder="Parlez-nous de vous..."
//             />
//           </div>
//         </div>
        
//         {/* Section informations Simplon et liens */}
//         <div className="space-y-6">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
//               <GraduationCap size={18} />
//               Informations Simplon
//             </h3>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Promotion
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.profile.cohort}
//                   onChange={(e) => setFormData({
//                     ...formData, 
//                     profile: {...formData.profile, cohort: e.target.value}
//                   })}
//                   disabled={!editMode}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
//                   placeholder="Ex: Simplon 2024"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Spécialité
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.profile.specialite}
//                   onChange={(e) => setFormData({
//                     ...formData, 
//                     profile: {...formData.profile, specialite: e.target.value}
//                   })}
//                   disabled={!editMode}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
//                   placeholder="Ex: Développement Web"
//                 />
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Date d'entrée
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.profile.date_entree}
//                     onChange={(e) => setFormData({
//                       ...formData, 
//                       profile: {...formData.profile, date_entree: e.target.value}
//                     })}
//                     disabled={!editMode}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Date de sortie
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.profile.date_sortie}
//                     onChange={(e) => setFormData({
//                       ...formData, 
//                       profile: {...formData.profile, date_sortie: e.target.value}
//                     })}
//                     disabled={!editMode}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Section liens */}
//           <div>
//             <h3 className="text-lg font-semibold text-gray-700 mb-4">Liens</h3>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
//                   <Github size={16} />
//                   GitHub
//                 </label>
//                 <input
//                   type="url"
//                   value={formData.profile.github_url}
//                   onChange={(e) => setFormData({
//                     ...formData, 
//                     profile: {...formData.profile, github_url: e.target.value}
//                   })}
//                   disabled={!editMode}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
//                   placeholder="https://github.com/username"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
//                   <Linkedin size={16} />
//                   LinkedIn
//                 </label>
//                 <input
//                   type="url"
//                   value={formData.profile.linkedin_url}
//                   onChange={(e) => setFormData({
//                     ...formData, 
//                     profile: {...formData.profile, linkedin_url: e.target.value}
//                   })}
//                   disabled={!editMode}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
//                   placeholder="https://linkedin.com/in/username"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
//                   <Globe size={16} />
//                   Portfolio
//                 </label>
//                 <input
//                   type="url"
//                   value={formData.profile.portfolio_url}
//                   onChange={(e) => setFormData({
//                     ...formData, 
//                     profile: {...formData.profile, portfolio_url: e.target.value}
//                   })}
//                   disabled={!editMode}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
//                   placeholder="https://votresite.com"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const NotificationsTab = () => (
//     <div className="bg-white rounded-xl shadow-lg p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
//         <button
//           onClick={async () => {
//             const token = getToken();
//             if (!token) return;
            
//             try {
//               await axios.post(
//                 `${API_BASE}/api/users/notifications/mark-all-read/`,
//                 {},
//                 { headers: { 'Authorization': `Bearer ${token}` } }
//               );
//               showMessage('✅ Toutes les notifications marquées comme lues', 'success');
//               loadNotifications();
//             } catch (error) {
//               showMessage('❌ Erreur', 'error');
//             }
//           }}
//           className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
//         >
//           Tout marquer comme lu
//         </button>
//       </div>
      
//       {notifications.length === 0 ? (
//         <div className="text-center py-12">
//           <Bell size={48} className="mx-auto text-gray-300 mb-4" />
//           <p className="text-gray-500">Aucune notification</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {notifications.map(notification => (
//             <div
//               key={notification.id}
//               className={`p-4 rounded-lg border ${
//                 notification.is_read
//                   ? 'bg-gray-50 border-gray-200'
//                   : 'bg-blue-50 border-blue-200'
//               }`}
//             >
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2 mb-1">
//                     <span className={`px-2 py-1 rounded text-xs font-medium ${
//                       notification.type === 'PROFILE_UPDATE' ? 'bg-green-100 text-green-800' :
//                       notification.type === 'PASSWORD_CHANGE' ? 'bg-red-100 text-red-800' :
//                       notification.type === 'SYSTEM' ? 'bg-purple-100 text-purple-800' :
//                       'bg-blue-100 text-blue-800'
//                     }`}>
//                       {notification.type === 'PROFILE_UPDATE' ? 'Profil' :
//                        notification.type === 'PASSWORD_CHANGE' ? 'Sécurité' :
//                        notification.type === 'SYSTEM' ? 'Système' : 'Info'}
//                     </span>
//                     {!notification.is_read && (
//                       <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
//                     )}
//                   </div>
                  
//                   <h3 className="font-semibold text-gray-800">{notification.title}</h3>
//                   <p className="text-gray-600 mt-1">{notification.message}</p>
                  
//                   <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
//                     <span>{notification.time_ago}</span>
//                     {notification.read_at && (
//                       <span>Lu le {new Date(notification.read_at).toLocaleDateString()}</span>
//                     )}
//                   </div>
//                 </div>
                
//                 {!notification.is_read && (
//                   <button
//                     onClick={async () => {
//                       const token = getToken();
//                       if (!token) return;
                      
//                       try {
//                         await axios.patch(
//                           `${API_BASE}/api/users/notifications/${notification.id}/read/`,
//                           {},
//                           { headers: { 'Authorization': `Bearer ${token}` } }
//                         );
//                         showMessage('✅ Notification marquée comme lue', 'success');
//                         loadNotifications();
//                       } catch (error) {
//                         showMessage('❌ Erreur', 'error');
//                       }
//                     }}
//                     className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
//                   >
//                     Marquer comme lu
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );

//   const HistoryTab = () => (
//     <div className="bg-white rounded-xl shadow-lg p-6">
//       <h2 className="text-xl font-bold text-gray-800 mb-6">Historique des modifications</h2>
      
//       {profileHistory.length === 0 ? (
//         <div className="text-center py-12">
//           <History size={48} className="mx-auto text-gray-300 mb-4" />
//           <p className="text-gray-500">Aucune modification enregistrée</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {profileHistory.map(history => (
//             <div key={history.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
//               <div className="flex items-center justify-between mb-2">
//                 <div className="flex items-center gap-2">
//                   <span className={`px-2 py-1 rounded text-xs font-medium ${
//                     history.action === 'CREATE' ? 'bg-green-100 text-green-800' :
//                     history.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
//                     'bg-red-100 text-red-800'
//                   }`}>
//                     {history.action === 'CREATE' ? 'Création' :
//                      history.action === 'UPDATE' ? 'Modification' : 'Suppression'}
//                   </span>
//                   <span className="text-sm font-medium text-gray-700">
//                     {history.field_name.replace('profile.', '').replace('_', ' ')}
//                   </span>
//                 </div>
//                 <span className="text-sm text-gray-500">
//                   {new Date(history.changed_at).toLocaleString()}
//                 </span>
//               </div>
              
//               <div className="grid grid-cols-2 gap-4 mt-2">
//                 <div>
//                   <p className="text-xs text-gray-500 mb-1">Ancienne valeur</p>
//                   <p className="text-sm bg-red-50 p-2 rounded border border-red-100">
//                     {history.old_value || <em className="text-gray-400">Vide</em>}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500 mb-1">Nouvelle valeur</p>
//                   <p className="text-sm bg-green-50 p-2 rounded border border-green-100">
//                     {history.new_value || <em className="text-gray-400">Vide</em>}
//                   </p>
//                 </div>
//               </div>
              
//               {history.ip_address && (
//                 <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
//                   <span>IP: {history.ip_address}</span>
//                   {history.changed_by_username && (
//                     <span>Par: {history.changed_by_username}</span>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );

//   const SettingsTab = () => (
//     <div className="bg-white rounded-xl shadow-lg p-6">
//       <h2 className="text-xl font-bold text-gray-800 mb-6">Paramètres</h2>
      
//       <div className="space-y-6">
//         <div>
//           <h3 className="text-lg font-semibold text-gray-700 mb-4">Préférences</h3>
          
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-medium text-gray-700">Notifications par email</p>
//                 <p className="text-sm text-gray-500">Recevoir des notifications par email</p>
//               </div>
//               <label className="relative inline-flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={formData.profile.email_notifications}
//                   onChange={(e) => setFormData({
//                     ...formData,
//                     profile: {...formData.profile, email_notifications: e.target.checked}
//                   })}
//                   disabled={!editMode}
//                   className="sr-only peer"
//                 />
//                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
//               </label>
//             </div>
            
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-medium text-gray-700">Mode sombre</p>
//                 <p className="text-sm text-gray-500">Activer le thème sombre</p>
//               </div>
//               <label className="relative inline-flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={formData.profile.dark_mode}
//                   onChange={(e) => setFormData({
//                     ...formData,
//                     profile: {...formData.profile, dark_mode: e.target.checked}
//                   })}
//                   disabled={!editMode}
//                   className="sr-only peer"
//                 />
//                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
//               </label>
//             </div>
//           </div>
//         </div>
        
//         <div>
//           <h3 className="text-lg font-semibold text-gray-700 mb-4">Compte</h3>
          
//           <div className="space-y-4">
//             <div>
//               <p className="font-medium text-gray-700 mb-2">Date de création</p>
//               <p className="text-gray-600">
//                 {user?.date_joined ? new Date(user.date_joined).toLocaleDateString('fr-FR', {
//                   day: 'numeric',
//                   month: 'long',
//                   year: 'numeric',
//                   hour: '2-digit',
//                   minute: '2-digit'
//                 }) : 'Non disponible'}
//               </p>
//             </div>
            
//             <div>
//               <p className="font-medium text-gray-700 mb-2">Dernière connexion</p>
//               <p className="text-gray-600">
//                 {user?.last_login ? new Date(user.last_login).toLocaleDateString('fr-FR', {
//                   day: 'numeric',
//                   month: 'long',
//                   year: 'numeric',
//                   hour: '2-digit',
//                   minute: '2-digit'
//                 }) : 'Jamais'}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="max-w-7xl mx-auto p-4 md:p-6">
//       {/* Message */}
//       {message.text && (
//         <div className={`p-4 rounded-lg mb-6 ${
//           message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
//           message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
//           'bg-blue-50 border border-blue-200 text-blue-800'
//         }`}>
//           <div className="flex items-center">
//             {message.type === 'success' && <CheckCircle size={20} className="mr-2" />}
//             <span>{message.text}</span>
//           </div>
//         </div>
//       )}
      
//       {/* Header */}
//       <ProfileHeader />
      
//       {/* Navigation */}
//       <TabsNavigation />
      
//       {/* Contenu des onglets */}
//       {activeTab === 'profile' && <ProfileTab />}
//       {activeTab === 'notifications' && <NotificationsTab />}
//       {activeTab === 'history' && <HistoryTab />}
//       {activeTab === 'settings' && <SettingsTab />}
      
//       {/* Statistiques (sidebar) */}
//       {stats && (
//         <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h3 className="font-semibold text-gray-700 mb-4">Statistiques profil</h3>
//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Complétion</span>
//                 <span className="font-semibold">{stats.profile_stats?.profile_completion || 0}%</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Photo</span>
//                 <span className={`font-semibold ${stats.profile_stats?.has_profile_picture ? 'text-green-600' : 'text-gray-400'}`}>
//                   {stats.profile_stats?.has_profile_picture ? '✓' : '✗'}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Liens sociaux</span>
//                 <span className="font-semibold">{stats.profile_stats?.has_links || 0}/3</span>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h3 className="font-semibold text-gray-700 mb-4">Activité</h3>
//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Modifications</span>
//                 <span className="font-semibold">{stats.activity_stats?.profile_updates || 0}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Notifications non lues</span>
//                 <span className="font-semibold">{stats.activity_stats?.unread_notifications || 0}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Membre depuis</span>
//                 <span className="font-semibold">{stats.user_info?.days_since_join || 0} jours</span>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <h3 className="font-semibold text-gray-700 mb-4">Actions rapides</h3>
//             <div className="space-y-3">
//               <button
//                 onClick={() => fileInputRef.current?.click()}
//                 className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
//               >
//                 <Upload size={16} />
//                 Changer la photo
//               </button>
//               <button
//                 onClick={() => window.open('mailto:contact@simplon.co', '_blank')}
//                 className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
//               >
//                 <Mail size={16} />
//                 Contacter le support
//               </button>
//               <button
//                 onClick={() => window.location.href = '/admin/settings'}
//                 className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
//               >
//                 <Settings size={16} />
//                 Paramètres avancés
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Profile;



// // src/components/admin/Profile.jsx - VERSION COMPLÈTE OPÉRATIONNELLE
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import axios from 'axios';
// import { 
//   User, Mail, Phone, Briefcase, Calendar, GraduationCap,
//   Github, Linkedin, Globe, Camera, Upload, CheckCircle,
//   History, Bell, Settings, Save, Edit, X, Image as ImageIcon,
//   Shield, Lock, Eye, EyeOff, Key
// } from 'lucide-react';

// const Profile = () => {
//   // États principaux
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [activeTab, setActiveTab] = useState('profile');
//   const [uploadingImage, setUploadingImage] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [profileHistory, setProfileHistory] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [passwordData, setPasswordData] = useState({
//     current_password: '',
//     new_password: '',
//     confirm_password: ''
//   });

//   const fileInputRef = useRef(null);
//   const API_BASE = 'http://localhost:8000';

//   // Données du formulaire
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     profile: {
//       phone: '',
//       bio: '',
//       github_url: '',
//       linkedin_url: '',
//       portfolio_url: '',
//       cohort: '',
//       specialite: '',
//       date_entree: '',
//       date_sortie: '',
//       email_notifications: true,
//       dark_mode: false,
//     }
//   });

//   const [message, setMessage] = useState({ text: '', type: '' });

//   // ✅ Obtenir le token
//   const getToken = useCallback(() => {
//     const token = localStorage.getItem('access_token') || 
//                   localStorage.getItem('simplon_access_token') || 
//                   localStorage.getItem('authToken');
    
//     if (token && token !== 'undefined' && !token.startsWith('mock_token_')) {
//       return token;
//     }
//     return null;
//   }, []);

//   // ✅ Afficher un message
//   const showMessage = useCallback((text, type = 'info') => {
//     setMessage({ text, type });
//     setTimeout(() => setMessage({ text: '', type: '' }), 4000);
//   }, []);

//   // ✅ Charger les données de démo si l'API échoue
//   const loadDemoData = useCallback(() => {
//     const demoUser = {
//       id: 1,
//       username: 'admin.simplon',
//       email: 'admin@simplon.com',
//       first_name: 'Admin',
//       last_name: 'System',
//       date_joined: '2024-01-15T10:30:00Z',
//       last_login: new Date().toISOString(),
//       profile: {
//         phone: '+33 1 23 45 67 89',
//         bio: 'Administrateur système de la plateforme Simplon. Passionné par le développement web et la gestion de projets.',
//         github_url: 'https://github.com/admin-simplon',
//         linkedin_url: 'https://linkedin.com/in/admin-simplon',
//         portfolio_url: 'https://portfolio-admin.simplon.com',
//         cohort: 'Admin - 2024',
//         specialite: 'Administration Système & Développement',
//         date_entree: '2024-01-01',
//         date_sortie: '2024-12-31',
//         profile_picture_url: null,
//         email_notifications: true,
//         dark_mode: false,
//       }
//     };

//     setUser(demoUser);
//     setFormData({
//       first_name: demoUser.first_name,
//       last_name: demoUser.last_name,
//       email: demoUser.email,
//       profile: {
//         phone: demoUser.profile.phone,
//         bio: demoUser.profile.bio,
//         github_url: demoUser.profile.github_url,
//         linkedin_url: demoUser.profile.linkedin_url,
//         portfolio_url: demoUser.profile.portfolio_url,
//         cohort: demoUser.profile.cohort,
//         specialite: demoUser.profile.specialite,
//         date_entree: demoUser.profile.date_entree,
//         date_sortie: demoUser.profile.date_sortie,
//         email_notifications: demoUser.profile.email_notifications,
//         dark_mode: demoUser.profile.dark_mode,
//       }
//     });

//     // Données de démo pour les notifications
//     const demoNotifications = [
//       {
//         id: 1,
//         title: 'Profil mis à jour',
//         message: 'Votre profil a été mis à jour avec succès',
//         type: 'PROFILE_UPDATE',
//         is_read: false,
//         time_ago: 'Il y a 2 heures',
//         read_at: null
//       },
//       {
//         id: 2,
//         title: 'Nouveau projet soumis',
//         message: 'Un nouveau projet a été soumis pour validation',
//         type: 'SYSTEM',
//         is_read: true,
//         time_ago: 'Il y a 1 jour',
//         read_at: '2024-01-20T14:30:00Z'
//       },
//       {
//         id: 3,
//         title: 'Sécurité',
//         message: 'Votre mot de passe a été changé avec succès',
//         type: 'PASSWORD_CHANGE',
//         is_read: false,
//         time_ago: 'Il y a 3 jours',
//         read_at: null
//       }
//     ];
//     setNotifications(demoNotifications);

//     // Données de démo pour l'historique
//     const demoHistory = [
//       {
//         id: 1,
//         action: 'UPDATE',
//         field_name: 'profile.bio',
//         old_value: 'Ancienne bio...',
//         new_value: demoUser.profile.bio,
//         changed_at: '2024-01-20T10:30:00Z',
//         changed_by_username: 'admin.simplon',
//         ip_address: '192.168.1.1'
//       },
//       {
//         id: 2,
//         action: 'UPDATE',
//         field_name: 'profile.phone',
//         old_value: '+33 0 00 00 00 00',
//         new_value: demoUser.profile.phone,
//         changed_at: '2024-01-19T15:45:00Z',
//         changed_by_username: 'admin.simplon',
//         ip_address: '192.168.1.1'
//       }
//     ];
//     setProfileHistory(demoHistory);

//     // Statistiques de démo
//     const demoStats = {
//       profile_stats: {
//         profile_completion: 85,
//         has_profile_picture: false,
//         has_links: 3
//       },
//       activity_stats: {
//         profile_updates: 12,
//         unread_notifications: 2
//       },
//       user_info: {
//         days_since_join: 15
//       }
//     };
//     setStats(demoStats);

//     showMessage('✅ Mode démo activé - Données de test', 'info');
//   }, [showMessage]);

//   // ✅ Charger le profil
//   const loadProfile = useCallback(async () => {
//     const token = getToken();
    
//     try {
//       setLoading(true);
      
//       if (token) {
//         // Essayer l'API
//         const response = await axios.get(`${API_BASE}/api/users/profile/`, {
//           headers: { 
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         const userData = response.data;
//         setUser(userData);
//         setFormData({
//           first_name: userData.first_name || '',
//           last_name: userData.last_name || '',
//           email: userData.email || '',
//           profile: {
//             phone: userData.profile?.phone || '',
//             bio: userData.profile?.bio || '',
//             github_url: userData.profile?.github_url || '',
//             linkedin_url: userData.profile?.linkedin_url || '',
//             portfolio_url: userData.profile?.portfolio_url || '',
//             cohort: userData.profile?.cohort || '',
//             specialite: userData.profile?.specialite || '',
//             date_entree: userData.profile?.date_entree || '',
//             date_sortie: userData.profile?.date_sortie || '',
//             email_notifications: userData.profile?.email_notifications ?? true,
//             dark_mode: userData.profile?.dark_mode ?? false,
//           }
//         });
        
//         showMessage('✅ Profil chargé depuis l\'API', 'success');
//       } else {
//         // Pas de token, charger les données de démo
//         loadDemoData();
//       }
//     } catch (error) {
//       console.log('API non disponible, chargement des données de démo');
//       loadDemoData();
//     } finally {
//       setLoading(false);
//     }
//   }, [getToken, loadDemoData, showMessage]);

//   // ✅ Sauvegarder le profil
//   const saveProfile = useCallback(async () => {
//     const token = getToken();
    
//     try {
//       setLoading(true);
      
//       if (token) {
//         // Sauvegarder via API
//         const response = await axios.patch(
//           `${API_BASE}/api/users/profile/`,
//           formData,
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
        
//         setUser(response.data);
//         showMessage('✅ Profil sauvegardé avec succès !', 'success');
//       } else {
//         // Sauvegarder localement
//         const updatedUser = { 
//           ...user, 
//           ...formData,
//           updated_at: new Date().toISOString()
//         };
//         setUser(updatedUser);
//         showMessage('✅ Profil sauvegardé localement', 'success');
//       }
      
//       setEditMode(false);
//     } catch (error) {
//       console.error('Erreur sauvegarde:', error);
//       showMessage('⚠️ Erreur lors de la sauvegarde', 'error');
//     } finally {
//       setLoading(false);
//     }
//   }, [formData, getToken, user, showMessage]);

//   // ✅ Changer le mot de passe
//   const handlePasswordChange = useCallback(async () => {
//     const token = getToken();
    
//     if (passwordData.new_password !== passwordData.confirm_password) {
//       showMessage('❌ Les mots de passe ne correspondent pas', 'error');
//       return;
//     }
    
//     if (passwordData.new_password.length < 8) {
//       showMessage('❌ Le mot de passe doit faire au moins 8 caractères', 'error');
//       return;
//     }
    
//     try {
//       setLoading(true);
      
//       if (token) {
//         await axios.post(
//           `${API_BASE}/api/users/change-password/`,
//           passwordData,
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
        
//         showMessage('✅ Mot de passe changé avec succès', 'success');
//         setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
//       } else {
//         showMessage('✅ Mot de passe changé (mode démo)', 'success');
//         setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
//       }
//     } catch (error) {
//       console.error('Erreur changement mot de passe:', error);
//       showMessage('❌ Erreur lors du changement de mot de passe', 'error');
//     } finally {
//       setLoading(false);
//     }
//   }, [passwordData, getToken, showMessage]);

//   // ✅ Uploader une photo de profil
//   const handleImageUpload = useCallback(async (file) => {
//     const token = getToken();
    
//     try {
//       setUploadingImage(true);
      
//       if (token) {
//         const formData = new FormData();
//         formData.append('profile_picture', file);
        
//         const response = await axios.patch(
//           `${API_BASE}/api/users/profile/image/`,
//           formData,
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'multipart/form-data'
//             }
//           }
//         );
        
//         setUser(prev => ({
//           ...prev,
//           profile: {
//             ...prev.profile,
//             ...response.data
//           }
//         }));
        
//         showMessage('✅ Photo de profil mise à jour !', 'success');
//       } else {
//         // Simuler l'upload en mode démo
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           setUser(prev => ({
//             ...prev,
//             profile: {
//               ...prev.profile,
//               profile_picture_url: e.target.result
//             }
//           }));
//           showMessage('✅ Photo de profil mise à jour (mode démo)', 'success');
//         };
//         reader.readAsDataURL(file);
//       }
//     } catch (error) {
//       console.error('Erreur upload:', error);
//       showMessage('❌ Erreur lors du téléchargement', 'error');
//     } finally {
//       setUploadingImage(false);
//     }
//   }, [getToken, showMessage]);

//   // ✅ Effet initial
//   useEffect(() => {
//     loadProfile();
//   }, [loadProfile]);

//   // ✅ Rendu conditionnel
//   if (loading && !user) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <div className="text-center">
//           <div className="relative">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E30613] mx-auto mb-4"></div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <User className="text-[#E30613] animate-pulse" size={24} />
//             </div>
//           </div>
//           <p className="text-gray-600 font-medium mt-4">Chargement du profil...</p>
//           <p className="text-sm text-gray-500 mt-2">Patientez un instant</p>
//         </div>
//       </div>
//     );
//   }

//   // ✅ Composants UI

//   const ProfileHeader = () => (
//     <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
//       <div className="flex flex-col lg:flex-row items-center gap-8">
//         {/* Photo de profil */}
//         <div className="relative group">
//           <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#E30613] bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg">
//             {user?.profile?.profile_picture_url ? (
//               <img 
//                 src={user.profile.profile_picture_url} 
//                 alt="Profile" 
//                 className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
//               />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center">
//                 <div className="text-center">
//                   <User size={64} className="text-gray-300 mx-auto" />
//                   <p className="text-sm text-gray-400 mt-2">Pas de photo</p>
//                 </div>
//               </div>
//             )}
//           </div>
          
//           <button
//             onClick={() => fileInputRef.current?.click()}
//             disabled={uploadingImage}
//             className="absolute bottom-4 right-4 bg-[#E30613] text-white p-3 rounded-full hover:bg-[#c40511] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 transform hover:scale-110"
//             title="Changer la photo"
//           >
//             {uploadingImage ? (
//               <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
//             ) : (
//               <Camera size={24} />
//             )}
//           </button>
          
//           <input
//             type="file"
//             ref={fileInputRef}
//             className="hidden"
//             accept="image/*"
//             onChange={(e) => {
//               const file = e.target.files[0];
//               if (file) handleImageUpload(file);
//               e.target.value = '';
//             }}
//           />
//         </div>

//         {/* Infos utilisateur */}
//         <div className="flex-1 text-center lg:text-left">
//           <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
//             <h1 className="text-3xl font-bold text-gray-900">
//               {user?.first_name && user?.last_name 
//                 ? `${user.first_name} ${user.last_name}`
//                 : user?.username || 'Utilisateur'}
//             </h1>
//             {user?.profile?.cohort && (
//               <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-full">
//                 {user.profile.cohort}
//               </span>
//             )}
//           </div>
          
//           <p className="text-gray-600 text-lg mb-6">
//             {user?.profile?.specialite || 'Administrateur système'}
//           </p>
          
//           <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
//             <div className="flex items-center gap-2 text-gray-700">
//               <div className="p-2 bg-gray-100 rounded-lg">
//                 <Mail size={18} className="text-[#E30613]" />
//               </div>
//               <span>{user?.email}</span>
//             </div>
            
//             {user?.profile?.phone && (
//               <div className="flex items-center gap-2 text-gray-700">
//                 <div className="p-2 bg-gray-100 rounded-lg">
//                   <Phone size={18} className="text-[#E30613]" />
//                 </div>
//                 <span>{user.profile.phone}</span>
//               </div>
//             )}
            
//             {user?.username && (
//               <div className="flex items-center gap-2 text-gray-700">
//                 <div className="p-2 bg-gray-100 rounded-lg">
//                   <User size={18} className="text-[#E30613]" />
//                 </div>
//                 <span>@{user.username}</span>
//               </div>
//             )}
//           </div>
          
//           {stats && (
//             <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full">
//               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//               <span className="text-green-800 font-medium">
//                 Profil complété à <span className="text-green-600 font-bold">{stats.profile_stats?.profile_completion || 0}%</span>
//               </span>
//             </div>
//           )}
//         </div>

//         {/* Boutons d'action */}
//         <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
//           {!editMode ? (
//             <button
//               onClick={() => setEditMode(true)}
//               className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E30613] to-red-600 text-white rounded-xl hover:from-red-600 hover:to-[#E30613] transition-all duration-300 shadow-lg hover:shadow-xl font-medium min-w-[180px]"
//             >
//               <Edit size={20} />
//               Modifier le profil
//             </button>
//           ) : (
//             <>
//               <button
//                 onClick={() => {
//                   setEditMode(false);
//                   loadProfile();
//                 }}
//                 className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg font-medium min-w-[180px]"
//               >
//                 <X size={20} />
//                 Annuler
//               </button>
              
//               <button
//                 onClick={saveProfile}
//                 disabled={loading}
//                 className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-500 transition-all duration-300 shadow-lg hover:shadow-xl font-medium min-w-[180px] disabled:opacity-50"
//               >
//                 {loading ? (
//                   <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
//                 ) : (
//                   <Save size={20} />
//                 )}
//                 Sauvegarder
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   const TabsNavigation = () => (
//     <div className="bg-white rounded-xl shadow-lg p-2 mb-8 border border-gray-200">
//       <div className="flex flex-wrap gap-2">
//         {[
//           { id: 'profile', label: 'Profil', icon: User, color: 'blue' },
//           { id: 'security', label: 'Sécurité', icon: Shield, color: 'red' },
//           { id: 'notifications', label: 'Notifications', icon: Bell, color: 'purple', badge: notifications.filter(n => !n.is_read).length },
//           { id: 'history', label: 'Historique', icon: History, color: 'green' },
//           { id: 'settings', label: 'Paramètres', icon: Settings, color: 'gray' },
//         ].map(tab => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             className={`flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-300 font-medium ${
//               activeTab === tab.id
//                 ? `bg-${tab.color}-50 text-${tab.color}-700 border border-${tab.color}-200 shadow-sm`
//                 : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//             }`}
//           >
//             <tab.icon size={20} className={`${activeTab === tab.id ? `text-${tab.color}-600` : 'text-gray-400'}`} />
//             <span>{tab.label}</span>
//             {tab.badge && tab.badge > 0 && (
//               <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px]">
//                 {tab.badge}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>
//     </div>
//   );

//   const ProfileTab = () => (
//     <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Informations personnelles</h2>
//           <p className="text-gray-600 mt-1">Gérez vos informations personnelles et professionnelles</p>
//         </div>
//         <div className="flex items-center gap-2 text-sm text-gray-500">
//           <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//           {editMode ? 'Mode édition' : 'Mode consultation'}
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Section informations de base */}
//         <div className="space-y-6">
//           <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
//               <div className="p-2 bg-white rounded-lg shadow-sm">
//                 <User size={20} className="text-blue-600" />
//               </div>
//               Informations de base
//             </h3>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                   <span className="text-[#E30613]">*</span>
//                   Prénom
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.first_name}
//                   onChange={(e) => setFormData({...formData, first_name: e.target.value})}
//                   disabled={!editMode}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="Votre prénom"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                   <span className="text-[#E30613]">*</span>
//                   Nom
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.last_name}
//                   onChange={(e) => setFormData({...formData, last_name: e.target.value})}
//                   disabled={!editMode}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="Votre nom"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                   <span className="text-[#E30613]">*</span>
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => setFormData({...formData, email: e.target.value})}
//                   disabled={!editMode}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="votre@email.com"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Téléphone
//                 </label>
//                 <input
//                   type="tel"
//                   value={formData.profile.phone}
//                   onChange={(e) => setFormData({
//                     ...formData, 
//                     profile: {...formData.profile, phone: e.target.value}
//                   })}
//                   disabled={!editMode}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="+33 1 23 45 67 89"
//                 />
//               </div>
//             </div>
//           </div>
          
//           {/* Section biographie */}
//           <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Biographie</h3>
//             <textarea
//               value={formData.profile.bio}
//               onChange={(e) => setFormData({
//                 ...formData, 
//                 profile: {...formData.profile, bio: e.target.value}
//               })}
//               disabled={!editMode}
//               rows="5"
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//               placeholder="Décrivez votre parcours, vos compétences et vos passions..."
//             />
//             <p className="text-sm text-gray-500 mt-2">
//               {formData.profile.bio?.length || 0}/500 caractères
//             </p>
//           </div>
//         </div>
        
//         {/* Section informations Simplon et liens */}
//         <div className="space-y-6">
//           <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
//               <div className="p-2 bg-white rounded-lg shadow-sm">
//                 <GraduationCap size={20} className="text-green-600" />
//               </div>
//               Informations Simplon
//             </h3>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Promotion
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.profile.cohort}
//                   onChange={(e) => setFormData({
//                     ...formData, 
//                     profile: {...formData.profile, cohort: e.target.value}
//                   })}
//                   disabled={!editMode}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="Ex: Simplon 2024"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Spécialité
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.profile.specialite}
//                   onChange={(e) => setFormData({
//                     ...formData, 
//                     profile: {...formData.profile, specialite: e.target.value}
//                   })}
//                   disabled={!editMode}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="Ex: Développement Web Full Stack"
//                 />
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Date d'entrée
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.profile.date_entree}
//                     onChange={(e) => setFormData({
//                       ...formData, 
//                       profile: {...formData.profile, date_entree: e.target.value}
//                     })}
//                     disabled={!editMode}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Date de sortie
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.profile.date_sortie}
//                     onChange={(e) => setFormData({
//                       ...formData, 
//                       profile: {...formData.profile, date_sortie: e.target.value}
//                     })}
//                     disabled={!editMode}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Section liens */}
//           <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Liens professionnels</h3>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                   <Github size={18} className="text-gray-700" />
//                   GitHub
//                 </label>
//                 <input
//                   type="url"
//                   value={formData.profile.github_url}
//                   onChange={(e) => setFormData({
//                     ...formData, 
//                     profile: {...formData.profile, github_url: e.target.value}
//                   })}
//                   disabled={!editMode}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="https://github.com/votre-username"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                   <Linkedin size={18} className="text-blue-600" />
//                   LinkedIn
//                 </label>
//                 <input
//                   type="url"
//                   value={formData.profile.linkedin_url}
//                   onChange={(e) => setFormData({
//                     ...formData, 
//                     profile: {...formData.profile, linkedin_url: e.target.value}
//                   })}
//                   disabled={!editMode}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="https://linkedin.com/in/votre-profile"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                   <Globe size={18} className="text-green-600" />
//                   Portfolio
//                 </label>
//                 <input
//                   type="url"
//                   value={formData.profile.portfolio_url}
//                   onChange={(e) => setFormData({
//                     ...formData, 
//                     profile: {...formData.profile, portfolio_url: e.target.value}
//                   })}
//                   disabled={!editMode}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="https://votre-portfolio.com"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const SecurityTab = () => (
//     <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
//       <div className="flex items-center gap-3 mb-8">
//         <div className="p-3 bg-red-50 rounded-lg">
//           <Shield size={24} className="text-red-600" />
//         </div>
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Sécurité du compte</h2>
//           <p className="text-gray-600 mt-1">Gérez la sécurité de votre compte et changez votre mot de passe</p>
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Changement de mot de passe */}
//         <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-100">
//           <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
//             <Key size={20} className="text-red-600" />
//             Changer le mot de passe
//           </h3>
          
//           <div className="space-y-5">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Mot de passe actuel
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={passwordData.current_password}
//                   onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none pr-12"
//                   placeholder="••••••••"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Nouveau mot de passe
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={passwordData.new_password}
//                   onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none pr-12"
//                   placeholder="••••••••"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//               <p className="text-xs text-gray-500 mt-2">Minimum 8 caractères avec chiffres et lettres</p>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Confirmer le mot de passe
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={passwordData.confirm_password}
//                   onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none pr-12"
//                   placeholder="••••••••"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//             </div>
            
//             <button
//               onClick={handlePasswordChange}
//               disabled={loading || !passwordData.current_password || !passwordData.new_password}
//               className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-orange-500 hover:to-red-500 transition-all duration-300 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
//               ) : (
//                 <>
//                   <Lock size={20} />
//                   Changer le mot de passe
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
        
//         {/* Conseils de sécurité */}
//         <div className="space-y-6">
//           <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Conseils de sécurité</h3>
//             <ul className="space-y-3">
//               <li className="flex items-start gap-3">
//                 <div className="p-1 bg-blue-100 rounded mt-1">
//                   <Shield size={14} className="text-blue-600" />
//                 </div>
//                 <span className="text-gray-700">Utilisez un mot de passe unique et complexe</span>
//               </li>
//               <li className="flex items-start gap-3">
//                 <div className="p-1 bg-blue-100 rounded mt-1">
//                   <Shield size={14} className="text-blue-600" />
//                 </div>
//                 <span className="text-gray-700">Activez l'authentification à deux facteurs si disponible</span>
//               </li>
//               <li className="flex items-start gap-3">
//                 <div className="p-1 bg-blue-100 rounded mt-1">
//                   <Shield size={14} className="text-blue-600" />
//                 </div>
//                 <span className="text-gray-700">Ne partagez jamais vos identifiants</span>
//               </li>
//               <li className="flex items-start gap-3">
//                 <div className="p-1 bg-blue-100 rounded mt-1">
//                   <Shield size={14} className="text-blue-600" />
//                 </div>
//                 <span className="text-gray-700">Déconnectez-vous sur les appareils partagés</span>
//               </li>
//             </ul>
//           </div>
          
//           <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Sessions actives</h3>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
//                 <div>
//                   <p className="font-medium text-gray-800">Navigateur actuel</p>
//                   <p className="text-sm text-gray-500">Chrome sur Windows • Il y a 5 min</p>
//                 </div>
//                 <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
//               </div>
//               <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
//                 Voir toutes les sessions
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const NotificationsTab = () => (
//     <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center gap-3">
//           <div className="p-3 bg-purple-50 rounded-lg">
//             <Bell size={24} className="text-purple-600" />
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
//             <p className="text-gray-600 mt-1">Gérez vos notifications et préférences</p>
//           </div>
//         </div>
//         <button
//           onClick={() => {
//             const updatedNotifications = notifications.map(n => ({...n, is_read: true}));
//             setNotifications(updatedNotifications);
//             showMessage('✅ Toutes les notifications marquées comme lues', 'success');
//           }}
//           className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
//         >
//           Tout marquer comme lu
//         </button>
//       </div>
      
//       {notifications.length === 0 ? (
//         <div className="text-center py-12">
//           <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
//             <Bell size={48} className="text-gray-300" />
//           </div>
//           <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune notification</h3>
//           <p className="text-gray-500 max-w-md mx-auto">
//             Vous n'avez aucune notification en attente. 
//             Nous vous informerons lorsque quelque chose d'important se produira.
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {notifications.map(notification => (
//             <div
//               key={notification.id}
//               className={`p-5 rounded-xl border transition-all duration-300 hover:shadow-md ${
//                 notification.is_read
//                   ? 'bg-gray-50 border-gray-200'
//                   : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
//               }`}
//             >
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-3 mb-3">
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                       notification.type === 'PROFILE_UPDATE' ? 'bg-green-100 text-green-800' :
//                       notification.type === 'PASSWORD_CHANGE' ? 'bg-red-100 text-red-800' :
//                       notification.type === 'SYSTEM' ? 'bg-purple-100 text-purple-800' :
//                       'bg-blue-100 text-blue-800'
//                     }`}>
//                       {notification.type === 'PROFILE_UPDATE' ? 'Profil' :
//                        notification.type === 'PASSWORD_CHANGE' ? 'Sécurité' :
//                        notification.type === 'SYSTEM' ? 'Système' : 'Info'}
//                     </span>
                    
//                     <div className="flex items-center gap-2">
//                       {!notification.is_read && (
//                         <div className="flex items-center gap-1">
//                           <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//                           <span className="text-xs text-blue-600 font-medium">Nouveau</span>
//                         </div>
//                       )}
//                       <span className="text-sm text-gray-500">•</span>
//                       <span className="text-sm text-gray-500">{notification.time_ago}</span>
//                     </div>
//                   </div>
                  
//                   <h3 className="font-semibold text-gray-800 text-lg mb-2">{notification.title}</h3>
//                   <p className="text-gray-600">{notification.message}</p>
                  
//                   {notification.read_at && (
//                     <p className="text-xs text-gray-500 mt-3">
//                       Lu le {new Date(notification.read_at).toLocaleDateString('fr-FR')}
//                     </p>
//                   )}
//                 </div>
                
//                 {!notification.is_read && (
//                   <button
//                     onClick={() => {
//                       const updatedNotifications = notifications.map(n => 
//                         n.id === notification.id ? {...n, is_read: true} : n
//                       );
//                       setNotifications(updatedNotifications);
//                       showMessage('✅ Notification marquée comme lue', 'success');
//                     }}
//                     className="ml-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium whitespace-nowrap"
//                   >
//                     Marquer comme lu
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );

//   const HistoryTab = () => (
//     <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
//       <div className="flex items-center gap-3 mb-8">
//         <div className="p-3 bg-green-50 rounded-lg">
//           <History size={24} className="text-green-600" />
//         </div>
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Historique des modifications</h2>
//           <p className="text-gray-600 mt-1">Suivez toutes les modifications apportées à votre profil</p>
//         </div>
//       </div>
      
//       {profileHistory.length === 0 ? (
//         <div className="text-center py-12">
//           <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
//             <History size={48} className="text-gray-300" />
//           </div>
//           <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune modification</h3>
//           <p className="text-gray-500 max-w-md mx-auto">
//             Vous n'avez encore effectué aucune modification sur votre profil.
//             L'historique apparaîtra ici lorsque vous modifierez vos informations.
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {profileHistory.map(history => (
//             <div key={history.id} className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-3">
//                   <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                     history.action === 'CREATE' ? 'bg-green-100 text-green-800' :
//                     history.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
//                     'bg-red-100 text-red-800'
//                   }`}>
//                     {history.action === 'CREATE' ? 'Création' :
//                      history.action === 'UPDATE' ? 'Modification' : 'Suppression'}
//                   </span>
//                   <span className="font-medium text-gray-700">
//                     {history.field_name.replace('profile.', '').replace(/_/g, ' ')}
//                   </span>
//                 </div>
//                 <span className="text-sm text-gray-500">
//                   {new Date(history.changed_at).toLocaleString('fr-FR', {
//                     day: 'numeric',
//                     month: 'short',
//                     year: 'numeric',
//                     hour: '2-digit',
//                     minute: '2-digit'
//                   })}
//                 </span>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-xs text-gray-500 mb-2 uppercase font-medium">Ancienne valeur</p>
//                   <div className="p-3 bg-white rounded-lg border border-red-100">
//                     <p className="text-sm text-gray-700 truncate">
//                       {history.old_value || <span className="text-gray-400 italic">Vide</span>}
//                     </p>
//                   </div>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500 mb-2 uppercase font-medium">Nouvelle valeur</p>
//                   <div className="p-3 bg-white rounded-lg border border-green-100">
//                     <p className="text-sm text-gray-700 truncate">
//                       {history.new_value || <span className="text-gray-400 italic">Vide</span>}
//                     </p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 pt-4 border-t border-gray-200">
//                 <div className="flex items-center gap-2">
//                   <Globe size={12} />
//                   <span>IP: {history.ip_address}</span>
//                 </div>
//                 {history.changed_by_username && (
//                   <div className="flex items-center gap-2">
//                     <User size={12} />
//                     <span>Par: {history.changed_by_username}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );

//   const SettingsTab = () => (
//     <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
//       <div className="flex items-center gap-3 mb-8">
//         <div className="p-3 bg-gray-100 rounded-lg">
//           <Settings size={24} className="text-gray-700" />
//         </div>
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Paramètres du compte</h2>
//           <p className="text-gray-600 mt-1">Personnalisez vos préférences et paramètres</p>
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <div className="space-y-6">
//           {/* Préférences */}
//           <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Préférences</h3>
            
//             <div className="space-y-4">
//               <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
//                 <div>
//                   <p className="font-medium text-gray-700">Notifications par email</p>
//                   <p className="text-sm text-gray-500">Recevoir des notifications importantes par email</p>
//                 </div>
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={formData.profile.email_notifications}
//                     onChange={(e) => setFormData({
//                       ...formData,
//                       profile: {...formData.profile, email_notifications: e.target.checked}
//                     })}
//                     className="sr-only peer"
//                   />
//                   <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
//                 </label>
//               </div>
              
//               <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
//                 <div>
//                   <p className="font-medium text-gray-700">Mode sombre</p>
//                   <p className="text-sm text-gray-500">Activer le thème sombre pour l'interface</p>
//                 </div>
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={formData.profile.dark_mode}
//                     onChange={(e) => setFormData({
//                       ...formData,
//                       profile: {...formData.profile, dark_mode: e.target.checked}
//                     })}
//                     className="sr-only peer"
//                   />
//                   <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
//                 </label>
//               </div>
//             </div>
//           </div>
          
//           {/* Informations du compte */}
//           <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations du compte</h3>
            
//             <div className="space-y-4">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Date de création</p>
//                 <p className="font-medium text-gray-800">
//                   {user?.date_joined ? new Date(user.date_joined).toLocaleDateString('fr-FR', {
//                     day: 'numeric',
//                     month: 'long',
//                     year: 'numeric'
//                   }) : 'Non disponible'}
//                 </p>
//               </div>
              
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Dernière connexion</p>
//                 <p className="font-medium text-gray-800">
//                   {user?.last_login ? new Date(user.last_login).toLocaleDateString('fr-FR', {
//                     day: 'numeric',
//                     month: 'long',
//                     year: 'numeric',
//                     hour: '2-digit',
//                     minute: '2-digit'
//                   }) : 'Jamais'}
//                 </p>
//               </div>
              
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Statut</p>
//                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
//                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                   Actif
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <div className="space-y-6">
//           {/* Actions rapides */}
//           <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions rapides</h3>
            
//             <div className="space-y-3">
//               <button
//                 onClick={() => fileInputRef.current?.click()}
//                 className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-purple-100 rounded-lg">
//                     <Camera size={20} className="text-purple-600" />
//                   </div>
//                   <div className="text-left">
//                     <p className="font-medium text-gray-800">Changer la photo de profil</p>
//                     <p className="text-sm text-gray-500">Mettre à jour votre photo</p>
//                   </div>
//                 </div>
//                 <Upload size={20} className="text-gray-400" />
//               </button>
              
//               <button
//                 onClick={() => window.open('mailto:support@simplon.com', '_blank')}
//                 className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-blue-100 rounded-lg">
//                     <Mail size={20} className="text-blue-600" />
//                   </div>
//                   <div className="text-left">
//                     <p className="font-medium text-gray-800">Contacter le support</p>
//                     <p className="text-sm text-gray-500">Aide et assistance</p>
//                   </div>
//                 </div>
//                 <Globe size={20} className="text-gray-400" />
//               </button>
              
//               <button
//                 onClick={() => setActiveTab('security')}
//                 className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-red-100 rounded-lg">
//                     <Shield size={20} className="text-red-600" />
//                   </div>
//                   <div className="text-left">
//                     <p className="font-medium text-gray-800">Sécurité du compte</p>
//                     <p className="text-sm text-gray-500">Changer le mot de passe</p>
//                   </div>
//                 </div>
//                 <Lock size={20} className="text-gray-400" />
//               </button>
              
//               <button
//                 onClick={() => {
//                   localStorage.clear();
//                   window.location.href = '/login';
//                 }}
//                 className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-300"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-orange-100 rounded-lg">
//                     <X size={20} className="text-orange-600" />
//                   </div>
//                   <div className="text-left">
//                     <p className="font-medium text-gray-800">Déconnexion</p>
//                     <p className="text-sm text-gray-500">Se déconnecter du compte</p>
//                   </div>
//                 </div>
//                 <span className="text-orange-600 font-medium">Déconnexion</span>
//               </button>
//             </div>
//           </div>
          
//           {/* Statistiques */}
//           {stats && (
//             <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-100">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistiques</h3>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="text-center p-4 bg-white rounded-lg border border-amber-200">
//                   <p className="text-2xl font-bold text-amber-600">{stats.profile_stats?.profile_completion || 0}%</p>
//                   <p className="text-sm text-gray-600">Complétion</p>
//                 </div>
//                 <div className="text-center p-4 bg-white rounded-lg border border-amber-200">
//                   <p className="text-2xl font-bold text-amber-600">{stats.activity_stats?.profile_updates || 0}</p>
//                   <p className="text-sm text-gray-600">Modifications</p>
//                 </div>
//                 <div className="text-center p-4 bg-white rounded-lg border border-amber-200">
//                   <p className="text-2xl font-bold text-amber-600">{stats.activity_stats?.unread_notifications || 0}</p>
//                   <p className="text-sm text-gray-600">Notifications</p>
//                 </div>
//                 <div className="text-center p-4 bg-white rounded-lg border border-amber-200">
//                   <p className="text-2xl font-bold text-amber-600">{stats.user_info?.days_since_join || 0}</p>
//                   <p className="text-sm text-gray-600">Jours</p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="max-w-7xl mx-auto p-4 md:p-6">
//         {/* Message */}
//         {message.text && (
//           <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl max-w-sm animate-slide-in ${
//             message.type === 'success' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800' :
//             message.type === 'error' ? 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 text-red-800' :
//             'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 text-blue-800'
//           }`}>
//             <div className="flex items-center gap-3">
//               {message.type === 'success' ? (
//                 <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
//               ) : message.type === 'error' ? (
//                 <X size={24} className="text-red-600 flex-shrink-0" />
//               ) : (
//                 <Bell size={24} className="text-blue-600 flex-shrink-0" />
//               )}
//               <div className="flex-1">
//                 <p className="font-medium">{message.text}</p>
//               </div>
//               <button
//                 onClick={() => setMessage({ text: '', type: '' })}
//                 className="text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//           </div>
//         )}
        
//         {/* Header */}
//         <ProfileHeader />
        
//         {/* Navigation */}
//         <TabsNavigation />
        
//         {/* Contenu des onglets */}
//         {activeTab === 'profile' && <ProfileTab />}
//         {activeTab === 'security' && <SecurityTab />}
//         {activeTab === 'notifications' && <NotificationsTab />}
//         {activeTab === 'history' && <HistoryTab />}
//         {activeTab === 'settings' && <SettingsTab />}
//       </div>
//     </div>
//   );
// };

// export default Profile;



// // src/components/admin/Profile.jsx - VERSION SIMPLIFIÉE
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import axios from 'axios';
// import { 
//   User, Mail, Phone, GraduationCap,
//   Github, Linkedin, Globe, Camera, Upload, CheckCircle,
//   History, Bell, Save, Edit, X,
//   Shield, Eye, EyeOff, Key, Lock
// } from 'lucide-react';

// const Profile = () => {
//   // États principaux
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [activeTab, setActiveTab] = useState('profile');
//   const [uploadingImage, setUploadingImage] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [profileHistory, setProfileHistory] = useState([]);

//   const fileInputRef = useRef(null);
//   const API_BASE = 'http://localhost:8000';

//   // Données du formulaire
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     profile: {
//       phone: '',
//       bio: '',
//       github_url: '',
//       linkedin_url: '',
//       portfolio_url: '',
//       cohort: '',
//       specialite: '',
//       date_entree: '',
//       date_sortie: '',
//     }
//   });

//   const [message, setMessage] = useState({ text: '', type: '' });

//   // ✅ Obtenir le token
//   const getToken = useCallback(() => {
//     const token = localStorage.getItem('access_token') || 
//                   localStorage.getItem('simplon_access_token') || 
//                   localStorage.getItem('authToken');
    
//     if (token && token !== 'undefined' && !token.startsWith('mock_token_')) {
//       return token;
//     }
//     return null;
//   }, []);

//   // ✅ Afficher un message
//   const showMessage = useCallback((text, type = 'info') => {
//     setMessage({ text, type });
//     setTimeout(() => setMessage({ text: '', type: '' }), 4000);
//   }, []);

//   // ✅ Charger les données de démo si l'API échoue
//   const loadDemoData = useCallback(() => {
//     const demoUser = {
//       id: 1,
//       username: 'admin.simplon',
//       email: 'admin@simplon.com',
//       first_name: 'Admin',
//       last_name: 'System',
//       date_joined: '2024-01-15T10:30:00Z',
//       last_login: new Date().toISOString(),
//       profile: {
//         phone: '+33 1 23 45 67 89',
//         bio: 'Administrateur système de la plateforme Simplon. Passionné par le développement web et la gestion de projets.',
//         github_url: 'https://github.com/admin-simplon',
//         linkedin_url: 'https://linkedin.com/in/admin-simplon',
//         portfolio_url: 'https://portfolio-admin.simplon.com',
//         cohort: 'Admin - 2024',
//         specialite: 'Administration Système & Développement',
//         date_entree: '2024-01-01',
//         date_sortie: '2024-12-31',
//         profile_picture_url: null,
//       }
//     };

//     setUser(demoUser);
//     setFormData({
//       first_name: demoUser.first_name,
//       last_name: demoUser.last_name,
//       email: demoUser.email,
//       profile: {
//         phone: demoUser.profile.phone,
//         bio: demoUser.profile.bio,
//         github_url: demoUser.profile.github_url,
//         linkedin_url: demoUser.profile.linkedin_url,
//         portfolio_url: demoUser.profile.portfolio_url,
//         cohort: demoUser.profile.cohort,
//         specialite: demoUser.profile.specialite,
//         date_entree: demoUser.profile.date_entree,
//         date_sortie: demoUser.profile.date_sortie,
//       }
//     });

//     // Données de démo pour les notifications
//     const demoNotifications = [
//       {
//         id: 1,
//         title: 'Profil mis à jour',
//         message: 'Votre profil a été mis à jour avec succès',
//         type: 'PROFILE_UPDATE',
//         is_read: false,
//         time_ago: 'Il y a 2 heures',
//         read_at: null
//       },
//       {
//         id: 2,
//         title: 'Nouveau projet soumis',
//         message: 'Un nouveau projet a été soumis pour validation',
//         type: 'SYSTEM',
//         is_read: true,
//         time_ago: 'Il y a 1 jour',
//         read_at: '2024-01-20T14:30:00Z'
//       },
//       {
//         id: 3,
//         title: 'Bienvenue sur la plateforme',
//         message: 'Merci de vous être inscrit sur notre plateforme',
//         type: 'WELCOME',
//         is_read: true,
//         time_ago: 'Il y a 15 jours',
//         read_at: '2024-01-15T09:00:00Z'
//       }
//     ];
//     setNotifications(demoNotifications);

//     // Données de démo pour l'historique
//     const demoHistory = [
//       {
//         id: 1,
//         action: 'UPDATE',
//         field_name: 'profile.bio',
//         old_value: 'Ancienne bio...',
//         new_value: demoUser.profile.bio,
//         changed_at: '2024-01-20T10:30:00Z',
//         changed_by_username: 'admin.simplon',
//         ip_address: '192.168.1.1'
//       },
//       {
//         id: 2,
//         action: 'UPDATE',
//         field_name: 'profile.phone',
//         old_value: '+33 0 00 00 00 00',
//         new_value: demoUser.profile.phone,
//         changed_at: '2024-01-19T15:45:00Z',
//         changed_by_username: 'admin.simplon',
//         ip_address: '192.168.1.1'
//       }
//     ];
//     setProfileHistory(demoHistory);

//     showMessage('✅ Mode démo activé - Données de test', 'info');
//   }, [showMessage]);

//   // ✅ Charger le profil
//   const loadProfile = useCallback(async () => {
//     const token = getToken();
    
//     try {
//       setLoading(true);
      
//       if (token) {
//         // Essayer l'API
//         const response = await axios.get(`${API_BASE}/api/users/profile/`, {
//           headers: { 
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         const userData = response.data;
//         setUser(userData);
//         setFormData({
//           first_name: userData.first_name || '',
//           last_name: userData.last_name || '',
//           email: userData.email || '',
//           profile: {
//             phone: userData.profile?.phone || '',
//             bio: userData.profile?.bio || '',
//             github_url: userData.profile?.github_url || '',
//             linkedin_url: userData.profile?.linkedin_url || '',
//             portfolio_url: userData.profile?.portfolio_url || '',
//             cohort: userData.profile?.cohort || '',
//             specialite: userData.profile?.specialite || '',
//             date_entree: userData.profile?.date_entree || '',
//             date_sortie: userData.profile?.date_sortie || '',
//           }
//         });
        
//         showMessage('✅ Profil chargé depuis l\'API', 'success');
//       } else {
//         // Pas de token, charger les données de démo
//         loadDemoData();
//       }
//     } catch (error) {
//       console.log('API non disponible, chargement des données de démo');
//       loadDemoData();
//     } finally {
//       setLoading(false);
//     }
//   }, [getToken, loadDemoData, showMessage]);

//   // ✅ Sauvegarder le profil
//   const saveProfile = useCallback(async () => {
//     const token = getToken();
    
//     try {
//       setLoading(true);
      
//       if (token) {
//         // Sauvegarder via API
//         const response = await axios.patch(
//           `${API_BASE}/api/users/profile/`,
//           formData,
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
        
//         setUser(response.data);
//         showMessage('✅ Profil sauvegardé avec succès !', 'success');
//       } else {
//         // Sauvegarder localement
//         const updatedUser = { 
//           ...user, 
//           ...formData,
//           updated_at: new Date().toISOString()
//         };
//         setUser(updatedUser);
//         showMessage('✅ Profil sauvegardé localement', 'success');
//       }
      
//       setEditMode(false);
//     } catch (error) {
//       console.error('Erreur sauvegarde:', error);
//       showMessage('⚠️ Erreur lors de la sauvegarde', 'error');
//     } finally {
//       setLoading(false);
//     }
//   }, [formData, getToken, user, showMessage]);

//   // ✅ Uploader une photo de profil
//   const handleImageUpload = useCallback(async (file) => {
//     const token = getToken();
    
//     try {
//       setUploadingImage(true);
      
//       if (token) {
//         const formData = new FormData();
//         formData.append('profile_picture', file);
        
//         const response = await axios.patch(
//           `${API_BASE}/api/users/profile/image/`,
//           formData,
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'multipart/form-data'
//             }
//           }
//         );
        
//         setUser(prev => ({
//           ...prev,
//           profile: {
//             ...prev.profile,
//             ...response.data
//           }
//         }));
        
//         showMessage('✅ Photo de profil mise à jour !', 'success');
//       } else {
//         // Simuler l'upload en mode démo
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           setUser(prev => ({
//             ...prev,
//             profile: {
//               ...prev.profile,
//               profile_picture_url: e.target.result
//             }
//           }));
//           showMessage('✅ Photo de profil mise à jour (mode démo)', 'success');
//         };
//         reader.readAsDataURL(file);
//       }
//     } catch (error) {
//       console.error('Erreur upload:', error);
//       showMessage('❌ Erreur lors du téléchargement', 'error');
//     } finally {
//       setUploadingImage(false);
//     }
//   }, [getToken, showMessage]);

//   // ✅ Effet initial
//   useEffect(() => {
//     loadProfile();
//   }, [loadProfile]);

//   // ✅ Rendu conditionnel
//   if (loading && !user) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <div className="text-center">
//           <div className="relative">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E30613] mx-auto mb-4"></div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <User className="text-[#E30613] animate-pulse" size={24} />
//             </div>
//           </div>
//           <p className="text-gray-600 font-medium mt-4">Chargement du profil...</p>
//           <p className="text-sm text-gray-500 mt-2">Patientez un instant</p>
//         </div>
//       </div>
//     );
//   }

//   // ✅ Composants UI

//   const ProfileHeader = () => (
//     <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
//       <div className="flex flex-col lg:flex-row items-center gap-8">
//         {/* Photo de profil */}
//         <div className="relative group">
//           <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#E30613] bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg">
//             {user?.profile?.profile_picture_url ? (
//               <img 
//                 src={user.profile.profile_picture_url} 
//                 alt="Profile" 
//                 className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
//               />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center">
//                 <div className="text-center">
//                   <User size={64} className="text-gray-300 mx-auto" />
//                   <p className="text-sm text-gray-400 mt-2">Pas de photo</p>
//                 </div>
//               </div>
//             )}
//           </div>
          
//           <button
//             onClick={() => fileInputRef.current?.click()}
//             disabled={uploadingImage}
//             className="absolute bottom-4 right-4 bg-[#E30613] text-white p-3 rounded-full hover:bg-[#c40511] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 transform hover:scale-110"
//             title="Changer la photo"
//           >
//             {uploadingImage ? (
//               <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
//             ) : (
//               <Camera size={24} />
//             )}
//           </button>
          
//           <input
//             type="file"
//             ref={fileInputRef}
//             className="hidden"
//             accept="image/*"
//             onChange={(e) => {
//               const file = e.target.files[0];
//               if (file) handleImageUpload(file);
//               e.target.value = '';
//             }}
//           />
//         </div>

//         {/* Infos utilisateur */}
//         <div className="flex-1 text-center lg:text-left">
//           <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
//             <h1 className="text-3xl font-bold text-gray-900">
//               {user?.first_name && user?.last_name 
//                 ? `${user.first_name} ${user.last_name}`
//                 : user?.username || 'Utilisateur'}
//             </h1>
//             {user?.profile?.cohort && (
//               <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-full">
//                 {user.profile.cohort}
//               </span>
//             )}
//           </div>
          
//           <p className="text-gray-600 text-lg mb-6">
//             {user?.profile?.specialite || 'Administrateur système'}
//           </p>
          
//           <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
//             <div className="flex items-center gap-2 text-gray-700">
//               <div className="p-2 bg-gray-100 rounded-lg">
//                 <Mail size={18} className="text-[#E30613]" />
//               </div>
//               <span>{user?.email}</span>
//             </div>
            
//             {user?.profile?.phone && (
//               <div className="flex items-center gap-2 text-gray-700">
//                 <div className="p-2 bg-gray-100 rounded-lg">
//                   <Phone size={18} className="text-[#E30613]" />
//                 </div>
//                 <span>{user.profile.phone}</span>
//               </div>
//             )}
            
//             {user?.username && (
//               <div className="flex items-center gap-2 text-gray-700">
//                 <div className="p-2 bg-gray-100 rounded-lg">
//                   <User size={18} className="text-[#E30613]" />
//                 </div>
//                 <span>@{user.username}</span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Boutons d'action */}
//         <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
//           {!editMode ? (
//             <button
//               onClick={() => setEditMode(true)}
//               className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E30613] to-red-600 text-white rounded-xl hover:from-red-600 hover:to-[#E30613] transition-all duration-300 shadow-lg hover:shadow-xl font-medium min-w-[180px]"
//             >
//               <Edit size={20} />
//               Modifier le profil
//             </button>
//           ) : (
//             <>
//               <button
//                 onClick={() => {
//                   setEditMode(false);
//                   loadProfile();
//                 }}
//                 className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg font-medium min-w-[180px]"
//               >
//                 <X size={20} />
//                 Annuler
//               </button>
              
//               <button
//                 onClick={saveProfile}
//                 disabled={loading}
//                 className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-500 transition-all duration-300 shadow-lg hover:shadow-xl font-medium min-w-[180px] disabled:opacity-50"
//               >
//                 {loading ? (
//                   <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
//                 ) : (
//                   <Save size={20} />
//                 )}
//                 Sauvegarder
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   const TabsNavigation = () => (
//     <div className="bg-white rounded-xl shadow-lg p-2 mb-8 border border-gray-200">
//       <div className="flex flex-wrap gap-2">
//         {[
//           { id: 'profile', label: 'Profil', icon: User, color: 'blue' },
//           { id: 'notifications', label: 'Notifications', icon: Bell, color: 'purple', badge: notifications.filter(n => !n.is_read).length },
//           { id: 'history', label: 'Historique', icon: History, color: 'green' },
//         ].map(tab => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             className={`flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-300 font-medium ${
//               activeTab === tab.id
//                 ? `bg-${tab.color}-50 text-${tab.color}-700 border border-${tab.color}-200 shadow-sm`
//                 : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//             }`}
//           >
//             <tab.icon size={20} className={`${activeTab === tab.id ? `text-${tab.color}-600` : 'text-gray-400'}`} />
//             <span>{tab.label}</span>
//             {tab.badge && tab.badge > 0 && (
//               <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px]">
//                 {tab.badge}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>
//     </div>
//   );

//   const ProfileTab = () => (
//     <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Informations personnelles</h2>
//           <p className="text-gray-600 mt-1">Gérez vos informations personnelles et professionnelles</p>
//         </div>
//         <div className="flex items-center gap-2 text-sm text-gray-500">
//           <div className={`w-2 h-2 rounded-full ${editMode ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
//           {editMode ? 'Mode édition' : 'Mode consultation'}
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Section informations de base */}
//         <div className="space-y-6">
//           <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
//               <div className="p-2 bg-white rounded-lg shadow-sm">
//                 <User size={20} className="text-blue-600" />
//               </div>
//               Informations de base
//             </h3>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                   <span className="text-[#E30613]">*</span>
//                   Prénom
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.first_name}
//                   onChange={(e) => setFormData({...formData, first_name: e.target.value})}
//                   disabled={!editMode}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="Votre prénom"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                   <span className="text-[#E30613]">*</span>
//                   Nom
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.last_name}
//                   onChange={(e) => setFormData({...formData, last_name: e.target.value})}
//                   disabled={!editMode}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="Votre nom"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                   <span className="text-[#E30613]">*</span>
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => setFormData({...formData, email: e.target.value})}
//                   disabled={!editMode}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="votre@email.com"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Téléphone
//                 </label>
//                 <input
//                   type="tel"
//                   value={formData.profile.phone}
//                   onChange={(e) => setFormData({
//                     ...formData, 
//                     profile: {...formData.profile, phone: e.target.value}
//                   })}
//                   disabled={!editMode}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="+33 1 23 45 67 89"
//                 />
//               </div>
//             </div>
//           </div>
          
//           {/* Section biographie */}
//           <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Biographie</h3>
//             <textarea
//               value={formData.profile.bio}
//               onChange={(e) => setFormData({
//                 ...formData, 
//                 profile: {...formData.profile, bio: e.target.value}
//               })}
//               disabled={!editMode}
//               rows="5"
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//               placeholder="Décrivez votre parcours, vos compétences et vos passions..."
//             />
//             <p className="text-sm text-gray-500 mt-2">
//               {formData.profile.bio?.length || 0}/500 caractères
//             </p>
//           </div>
//         </div>
        
//         {/* Section informations Simplon et liens */}
//         <div className="space-y-6">
//           <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
//               <div className="p-2 bg-white rounded-lg shadow-sm">
//                 <GraduationCap size={20} className="text-green-600" />
//               </div>
//               Informations Simplon
//             </h3>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Promotion
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.profile.cohort}
//                   onChange={(e) => setFormData({
//                     ...formData, 
//                     profile: {...formData.profile, cohort: e.target.value}
//                   })}
//                   disabled={!editMode}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="Ex: Simplon 2024"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Spécialité
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.profile.specialite}
//                   onChange={(e) => setFormData({
//                     ...formData, 
//                     profile: {...formData.profile, specialite: e.target.value}
//                   })}
//                   disabled={!editMode}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="Ex: Développement Web Full Stack"
//                 />
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Date d'entrée
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.profile.date_entree}
//                     onChange={(e) => setFormData({
//                       ...formData, 
//                       profile: {...formData.profile, date_entree: e.target.value}
//                     })}
//                     disabled={!editMode}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Date de sortie
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.profile.date_sortie}
//                     onChange={(e) => setFormData({
//                       ...formData, 
//                       profile: {...formData.profile, date_sortie: e.target.value}
//                     })}
//                     disabled={!editMode}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Section liens */}
//           <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Liens professionnels</h3>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                   <Github size={18} className="text-gray-700" />
//                   GitHub
//                 </label>
//                 <input
//                   type="url"
//                   value={formData.profile.github_url}
//                   onChange={(e) => setFormData({
//                     ...formData, 
//                     profile: {...formData.profile, github_url: e.target.value}
//                   })}
//                   disabled={!editMode}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="https://github.com/votre-username"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                   <Linkedin size={18} className="text-blue-600" />
//                   LinkedIn
//                 </label>
//                 <input
//                   type="url"
//                   value={formData.profile.linkedin_url}
//                   onChange={(e) => setFormData({
//                     ...formData, 
//                     profile: {...formData.profile, linkedin_url: e.target.value}
//                   })}
//                   disabled={!editMode}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="https://linkedin.com/in/votre-profile"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                   <Globe size={18} className="text-green-600" />
//                   Portfolio
//                 </label>
//                 <input
//                   type="url"
//                   value={formData.profile.portfolio_url}
//                   onChange={(e) => setFormData({
//                     ...formData, 
//                     profile: {...formData.profile, portfolio_url: e.target.value}
//                   })}
//                   disabled={!editMode}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="https://votre-portfolio.com"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const NotificationsTab = () => (
//     <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center gap-3">
//           <div className="p-3 bg-purple-50 rounded-lg">
//             <Bell size={24} className="text-purple-600" />
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
//             <p className="text-gray-600 mt-1">Gérez vos notifications</p>
//           </div>
//         </div>
//         {notifications.some(n => !n.is_read) && (
//           <button
//             onClick={() => {
//               const updatedNotifications = notifications.map(n => ({...n, is_read: true}));
//               setNotifications(updatedNotifications);
//               showMessage('✅ Toutes les notifications marquées comme lues', 'success');
//             }}
//             className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
//           >
//             Tout marquer comme lu
//           </button>
//         )}
//       </div>
      
//       {notifications.length === 0 ? (
//         <div className="text-center py-12">
//           <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
//             <Bell size={48} className="text-gray-300" />
//           </div>
//           <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune notification</h3>
//           <p className="text-gray-500 max-w-md mx-auto">
//             Vous n'avez aucune notification en attente.
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {notifications.map(notification => (
//             <div
//               key={notification.id}
//               className={`p-5 rounded-xl border transition-all duration-300 hover:shadow-md ${
//                 notification.is_read
//                   ? 'bg-gray-50 border-gray-200'
//                   : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
//               }`}
//             >
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-3 mb-3">
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                       notification.type === 'PROFILE_UPDATE' ? 'bg-green-100 text-green-800' :
//                       notification.type === 'SYSTEM' ? 'bg-purple-100 text-purple-800' :
//                       notification.type === 'WELCOME' ? 'bg-blue-100 text-blue-800' :
//                       'bg-gray-100 text-gray-800'
//                     }`}>
//                       {notification.type === 'PROFILE_UPDATE' ? 'Profil' :
//                        notification.type === 'SYSTEM' ? 'Système' :
//                        notification.type === 'WELCOME' ? 'Bienvenue' : 'Info'}
//                     </span>
                    
//                     <div className="flex items-center gap-2">
//                       {!notification.is_read && (
//                         <div className="flex items-center gap-1">
//                           <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//                           <span className="text-xs text-blue-600 font-medium">Nouveau</span>
//                         </div>
//                       )}
//                       <span className="text-sm text-gray-500">•</span>
//                       <span className="text-sm text-gray-500">{notification.time_ago}</span>
//                     </div>
//                   </div>
                  
//                   <h3 className="font-semibold text-gray-800 text-lg mb-2">{notification.title}</h3>
//                   <p className="text-gray-600">{notification.message}</p>
                  
//                   {notification.read_at && (
//                     <p className="text-xs text-gray-500 mt-3">
//                       Lu le {new Date(notification.read_at).toLocaleDateString('fr-FR')}
//                     </p>
//                   )}
//                 </div>
                
//                 {!notification.is_read && (
//                   <button
//                     onClick={() => {
//                       const updatedNotifications = notifications.map(n => 
//                         n.id === notification.id ? {...n, is_read: true} : n
//                       );
//                       setNotifications(updatedNotifications);
//                       showMessage('✅ Notification marquée comme lue', 'success');
//                     }}
//                     className="ml-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium whitespace-nowrap"
//                   >
//                     Marquer comme lu
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );

//   const HistoryTab = () => (
//     <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
//       <div className="flex items-center gap-3 mb-8">
//         <div className="p-3 bg-green-50 rounded-lg">
//           <History size={24} className="text-green-600" />
//         </div>
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Historique des modifications</h2>
//           <p className="text-gray-600 mt-1">Suivez toutes les modifications apportées à votre profil</p>
//         </div>
//       </div>
      
//       {profileHistory.length === 0 ? (
//         <div className="text-center py-12">
//           <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
//             <History size={48} className="text-gray-300" />
//           </div>
//           <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune modification</h3>
//           <p className="text-gray-500 max-w-md mx-auto">
//             Vous n'avez encore effectué aucune modification sur votre profil.
//             L'historique apparaîtra ici lorsque vous modifierez vos informations.
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {profileHistory.map(history => (
//             <div key={history.id} className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-3">
//                   <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                     history.action === 'CREATE' ? 'bg-green-100 text-green-800' :
//                     history.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
//                     'bg-red-100 text-red-800'
//                   }`}>
//                     {history.action === 'CREATE' ? 'Création' :
//                      history.action === 'UPDATE' ? 'Modification' : 'Suppression'}
//                   </span>
//                   <span className="font-medium text-gray-700">
//                     {history.field_name.replace('profile.', '').replace(/_/g, ' ')}
//                   </span>
//                 </div>
//                 <span className="text-sm text-gray-500">
//                   {new Date(history.changed_at).toLocaleString('fr-FR', {
//                     day: 'numeric',
//                     month: 'short',
//                     year: 'numeric',
//                     hour: '2-digit',
//                     minute: '2-digit'
//                   })}
//                 </span>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-xs text-gray-500 mb-2 uppercase font-medium">Ancienne valeur</p>
//                   <div className="p-3 bg-white rounded-lg border border-red-100">
//                     <p className="text-sm text-gray-700 truncate">
//                       {history.old_value || <span className="text-gray-400 italic">Vide</span>}
//                     </p>
//                   </div>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500 mb-2 uppercase font-medium">Nouvelle valeur</p>
//                   <div className="p-3 bg-white rounded-lg border border-green-100">
//                     <p className="text-sm text-gray-700 truncate">
//                       {history.new_value || <span className="text-gray-400 italic">Vide</span>}
//                     </p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 pt-4 border-t border-gray-200">
//                 <div className="flex items-center gap-2">
//                   <Globe size={12} />
//                   <span>IP: {history.ip_address}</span>
//                 </div>
//                 {history.changed_by_username && (
//                   <div className="flex items-center gap-2">
//                     <User size={12} />
//                     <span>Par: {history.changed_by_username}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="max-w-7xl mx-auto p-4 md:p-6">
//         {/* Message */}
//         {message.text && (
//           <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl max-w-sm ${
//             message.type === 'success' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800' :
//             message.type === 'error' ? 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 text-red-800' :
//             'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 text-blue-800'
//           }`}>
//             <div className="flex items-center gap-3">
//               {message.type === 'success' ? (
//                 <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
//               ) : message.type === 'error' ? (
//                 <X size={24} className="text-red-600 flex-shrink-0" />
//               ) : (
//                 <Bell size={24} className="text-blue-600 flex-shrink-0" />
//               )}
//               <div className="flex-1">
//                 <p className="font-medium">{message.text}</p>
//               </div>
//               <button
//                 onClick={() => setMessage({ text: '', type: '' })}
//                 className="text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//           </div>
//         )}
        
//         {/* Header */}
//         <ProfileHeader />
        
//         {/* Navigation */}
//         <TabsNavigation />
        
//         {/* Contenu des onglets */}
//         {activeTab === 'profile' && <ProfileTab />}
//         {activeTab === 'notifications' && <NotificationsTab />}
//         {activeTab === 'history' && <HistoryTab />}
//       </div>
//     </div>
//   );
// };

// export default Profile;



// // src/components/admin/Profile.jsx - VERSION FINALE SIMPLIFIÉE
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import axios from 'axios';
// import { 
//   User, Mail, Phone, GraduationCap,
//   Github, Linkedin, Globe, Camera, Upload, CheckCircle,
//   Bell, Save, Edit, X
// } from 'lucide-react';

// const Profile = () => {
//   // États principaux
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [activeTab, setActiveTab] = useState('profile');
//   const [uploadingImage, setUploadingImage] = useState(false);
//   const [notifications, setNotifications] = useState([]);

//   const fileInputRef = useRef(null);
//   const API_BASE = 'http://localhost:8000';

//   // Données du formulaire
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     profile: {
//       phone: '',
//       bio: '',
//       github_url: '',
//       linkedin_url: '',
//       portfolio_url: '',
//       cohort: '',
//       specialite: '',
//       date_entree: '',
//       date_sortie: '',
//     }
//   });

//   const [message, setMessage] = useState({ text: '', type: '' });

//   // ✅ Obtenir le token
//   const getToken = useCallback(() => {
//     const token = localStorage.getItem('access_token') || 
//                   localStorage.getItem('simplon_access_token') || 
//                   localStorage.getItem('authToken');
    
//     if (token && token !== 'undefined' && !token.startsWith('mock_token_')) {
//       return token;
//     }
//     return null;
//   }, []);

//   // ✅ Afficher un message
//   const showMessage = useCallback((text, type = 'info') => {
//     setMessage({ text, type });
//     setTimeout(() => setMessage({ text: '', type: '' }), 4000);
//   }, []);

//   // ✅ Charger les données de démo si l'API échoue
//   const loadDemoData = useCallback(() => {
//     const demoUser = {
//       id: 1,
//       username: 'admin.simplon',
//       email: 'admin@simplon.com',
//       first_name: 'Admin',
//       last_name: 'System',
//       date_joined: '2024-01-15T10:30:00Z',
//       last_login: new Date().toISOString(),
//       profile: {
//         phone: '+33 1 23 45 67 89',
//         bio: 'Administrateur système de la plateforme Simplon. Passionné par le développement web et la gestion de projets.',
//         github_url: 'https://github.com/admin-simplon',
//         linkedin_url: 'https://linkedin.com/in/admin-simplon',
//         portfolio_url: 'https://portfolio-admin.simplon.com',
//         cohort: 'Admin - 2024',
//         specialite: 'Administration Système & Développement',
//         date_entree: '2024-01-01',
//         date_sortie: '2024-12-31',
//         profile_picture_url: null,
//       }
//     };

//     setUser(demoUser);
//     setFormData({
//       first_name: demoUser.first_name,
//       last_name: demoUser.last_name,
//       email: demoUser.email,
//       profile: {
//         phone: demoUser.profile.phone,
//         bio: demoUser.profile.bio,
//         github_url: demoUser.profile.github_url,
//         linkedin_url: demoUser.profile.linkedin_url,
//         portfolio_url: demoUser.profile.portfolio_url,
//         cohort: demoUser.profile.cohort,
//         specialite: demoUser.profile.specialite,
//         date_entree: demoUser.profile.date_entree,
//         date_sortie: demoUser.profile.date_sortie,
//       }
//     });

//     // Données de démo pour les notifications
//     const demoNotifications = [
//       {
//         id: 1,
//         title: 'Profil mis à jour',
//         message: 'Votre profil a été mis à jour avec succès',
//         type: 'PROFILE_UPDATE',
//         is_read: false,
//         time_ago: 'Il y a 2 heures',
//         read_at: null
//       },
//       {
//         id: 2,
//         title: 'Nouveau projet soumis',
//         message: 'Un nouveau projet a été soumis pour validation',
//         type: 'SYSTEM',
//         is_read: true,
//         time_ago: 'Il y a 1 jour',
//         read_at: '2024-01-20T14:30:00Z'
//       },
//       {
//         id: 3,
//         title: 'Bienvenue sur la plateforme',
//         message: 'Merci de vous être inscrit sur notre plateforme',
//         type: 'WELCOME',
//         is_read: true,
//         time_ago: 'Il y a 15 jours',
//         read_at: '2024-01-15T09:00:00Z'
//       }
//     ];
//     setNotifications(demoNotifications);

//     showMessage('✅ Mode démo activé - Données de test', 'info');
//   }, [showMessage]);

//   // ✅ Charger le profil
//   const loadProfile = useCallback(async () => {
//     const token = getToken();
    
//     try {
//       setLoading(true);
      
//       if (token) {
//         // Essayer l'API
//         const response = await axios.get(`${API_BASE}/api/users/profile/`, {
//           headers: { 
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         const userData = response.data;
//         setUser(userData);
//         setFormData({
//           first_name: userData.first_name || '',
//           last_name: userData.last_name || '',
//           email: userData.email || '',
//           profile: {
//             phone: userData.profile?.phone || '',
//             bio: userData.profile?.bio || '',
//             github_url: userData.profile?.github_url || '',
//             linkedin_url: userData.profile?.linkedin_url || '',
//             portfolio_url: userData.profile?.portfolio_url || '',
//             cohort: userData.profile?.cohort || '',
//             specialite: userData.profile?.specialite || '',
//             date_entree: userData.profile?.date_entree || '',
//             date_sortie: userData.profile?.date_sortie || '',
//           }
//         });
        
//         showMessage('✅ Profil chargé depuis l\'API', 'success');
//       } else {
//         // Pas de token, charger les données de démo
//         loadDemoData();
//       }
//     } catch (error) {
//       console.log('API non disponible, chargement des données de démo');
//       loadDemoData();
//     } finally {
//       setLoading(false);
//     }
//   }, [getToken, loadDemoData, showMessage]);

//   // ✅ Sauvegarder le profil
//   const saveProfile = useCallback(async () => {
//     const token = getToken();
    
//     try {
//       setLoading(true);
      
//       if (token) {
//         // Sauvegarder via API
//         const response = await axios.patch(
//           `${API_BASE}/api/users/profile/`,
//           formData,
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
        
//         setUser(response.data);
//         showMessage('✅ Profil sauvegardé avec succès !', 'success');
//       } else {
//         // Sauvegarder localement
//         const updatedUser = { 
//           ...user, 
//           ...formData,
//           updated_at: new Date().toISOString()
//         };
//         setUser(updatedUser);
//         showMessage('✅ Profil sauvegardé localement', 'success');
//       }
      
//       setEditMode(false);
//     } catch (error) {
//       console.error('Erreur sauvegarde:', error);
//       showMessage('⚠️ Erreur lors de la sauvegarde', 'error');
//     } finally {
//       setLoading(false);
//     }
//   }, [formData, getToken, user, showMessage]);

//   // ✅ Uploader une photo de profil
//   const handleImageUpload = useCallback(async (file) => {
//     const token = getToken();
    
//     try {
//       setUploadingImage(true);
      
//       if (token) {
//         const formData = new FormData();
//         formData.append('profile_picture', file);
        
//         const response = await axios.patch(
//           `${API_BASE}/api/users/profile/image/`,
//           formData,
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'multipart/form-data'
//             }
//           }
//         );
        
//         setUser(prev => ({
//           ...prev,
//           profile: {
//             ...prev.profile,
//             ...response.data
//           }
//         }));
        
//         showMessage('✅ Photo de profil mise à jour !', 'success');
//       } else {
//         // Simuler l'upload en mode démo
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           setUser(prev => ({
//             ...prev,
//             profile: {
//               ...prev.profile,
//               profile_picture_url: e.target.result
//             }
//           }));
//           showMessage('✅ Photo de profil mise à jour (mode démo)', 'success');
//         };
//         reader.readAsDataURL(file);
//       }
//     } catch (error) {
//       console.error('Erreur upload:', error);
//       showMessage('❌ Erreur lors du téléchargement', 'error');
//     } finally {
//       setUploadingImage(false);
//     }
//   }, [getToken, showMessage]);

//   // ✅ Effet initial
//   useEffect(() => {
//     loadProfile();
//   }, [loadProfile]);

//   // ✅ Rendu conditionnel
//   if (loading && !user) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <div className="text-center">
//           <div className="relative">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E30613] mx-auto mb-4"></div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <User className="text-[#E30613] animate-pulse" size={24} />
//             </div>
//           </div>
//           <p className="text-gray-600 font-medium mt-4">Chargement du profil...</p>
//           <p className="text-sm text-gray-500 mt-2">Patientez un instant</p>
//         </div>
//       </div>
//     );
//   }

//   // ✅ Composants UI

//   const ProfileHeader = () => (
//     <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
//       <div className="flex flex-col lg:flex-row items-center gap-8">
//         {/* Photo de profil */}
//         <div className="relative group">
//           <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#E30613] bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg">
//             {user?.profile?.profile_picture_url ? (
//               <img 
//                 src={user.profile.profile_picture_url} 
//                 alt="Profile" 
//                 className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
//               />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center">
//                 <div className="text-center">
//                   <User size={64} className="text-gray-300 mx-auto" />
//                   <p className="text-sm text-gray-400 mt-2">Pas de photo</p>
//                 </div>
//               </div>
//             )}
//           </div>
          
//           <button
//             onClick={() => fileInputRef.current?.click()}
//             disabled={uploadingImage}
//             className="absolute bottom-4 right-4 bg-[#E30613] text-white p-3 rounded-full hover:bg-[#c40511] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 transform hover:scale-110"
//             title="Changer la photo"
//           >
//             {uploadingImage ? (
//               <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
//             ) : (
//               <Camera size={24} />
//             )}
//           </button>
          
//           <input
//             type="file"
//             ref={fileInputRef}
//             className="hidden"
//             accept="image/*"
//             onChange={(e) => {
//               const file = e.target.files[0];
//               if (file) handleImageUpload(file);
//               e.target.value = '';
//             }}
//           />
//         </div>

//         {/* Infos utilisateur */}
//         <div className="flex-1 text-center lg:text-left">
//           <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
//             <h1 className="text-3xl font-bold text-gray-900">
//               {user?.first_name && user?.last_name 
//                 ? `${user.first_name} ${user.last_name}`
//                 : user?.username || 'Utilisateur'}
//             </h1>
//             {user?.profile?.cohort && (
//               <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-full">
//                 {user.profile.cohort}
//               </span>
//             )}
//           </div>
          
//           <p className="text-gray-600 text-lg mb-6">
//             {user?.profile?.specialite || 'Administrateur système'}
//           </p>
          
//           <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
//             <div className="flex items-center gap-2 text-gray-700">
//               <div className="p-2 bg-gray-100 rounded-lg">
//                 <Mail size={18} className="text-[#E30613]" />
//               </div>
//               <span>{user?.email}</span>
//             </div>
            
//             {user?.profile?.phone && (
//               <div className="flex items-center gap-2 text-gray-700">
//                 <div className="p-2 bg-gray-100 rounded-lg">
//                   <Phone size={18} className="text-[#E30613]" />
//                 </div>
//                 <span>{user.profile.phone}</span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Boutons d'action */}
//         <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
//           {!editMode ? (
//             <button
//               onClick={() => setEditMode(true)}
//               className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E30613] to-red-600 text-white rounded-xl hover:from-red-600 hover:to-[#E30613] transition-all duration-300 shadow-lg hover:shadow-xl font-medium min-w-[180px]"
//             >
//               <Edit size={20} />
//               Modifier le profil
//             </button>
//           ) : (
//             <>
//               <button
//                 onClick={() => {
//                   setEditMode(false);
//                   loadProfile();
//                 }}
//                 className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg font-medium min-w-[180px]"
//               >
//                 <X size={20} />
//                 Annuler
//               </button>
              
//               <button
//                 onClick={saveProfile}
//                 disabled={loading}
//                 className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-500 transition-all duration-300 shadow-lg hover:shadow-xl font-medium min-w-[180px] disabled:opacity-50"
//               >
//                 {loading ? (
//                   <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
//                 ) : (
//                   <Save size={20} />
//                 )}
//                 Sauvegarder
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   const TabsNavigation = () => (
//     <div className="bg-white rounded-xl shadow-lg p-2 mb-8 border border-gray-200">
//       <div className="flex flex-wrap gap-2">
//         {[
//           { id: 'profile', label: 'Profil', icon: User, color: 'blue' },
//           { id: 'notifications', label: 'Notifications', icon: Bell, color: 'purple', badge: notifications.filter(n => !n.is_read).length },
//         ].map(tab => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             className={`flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-300 font-medium ${
//               activeTab === tab.id
//                 ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
//                 : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//             }`}
//           >
//             <tab.icon size={20} className={`${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`} />
//             <span>{tab.label}</span>
//             {tab.badge && tab.badge > 0 && (
//               <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px]">
//                 {tab.badge}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>
//     </div>
//   );

//   const ProfileTab = () => (
//     <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Informations personnelles</h2>
//           <p className="text-gray-600 mt-1">Gérez vos informations personnelles et professionnelles</p>
//         </div>
//         <div className="flex items-center gap-2 text-sm text-gray-500">
//           <div className={`w-2 h-2 rounded-full ${editMode ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
//           {editMode ? 'Mode édition' : 'Mode consultation'}
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Section informations de base */}
//         <div className="space-y-6">
//           <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
//               <div className="p-2 bg-white rounded-lg shadow-sm">
//                 <User size={20} className="text-blue-600" />
//               </div>
//               Informations de base
//             </h3>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Prénom
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.first_name}
//                   onChange={(e) => setFormData({...formData, first_name: e.target.value})}
//                   disabled={!editMode}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="Votre prénom"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Nom
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.last_name}
//                   onChange={(e) => setFormData({...formData, last_name: e.target.value})}
//                   disabled={!editMode}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="Votre nom"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => setFormData({...formData, email: e.target.value})}
//                   disabled={!editMode}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="votre@email.com"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Téléphone
//                 </label>
//                 <input
//                   type="tel"
//                   value={formData.profile.phone}
//                   onChange={(e) => setFormData({
//                     ...formData, 
//                     profile: {...formData.profile, phone: e.target.value}
//                   })}
//                   disabled={!editMode}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="+33 1 23 45 67 89"
//                 />
//               </div>
//             </div>
//           </div>
          
//           {/* Section biographie */}
//           <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Biographie</h3>
//             <textarea
//               value={formData.profile.bio}
//               onChange={(e) => setFormData({
//                 ...formData, 
//                 profile: {...formData.profile, bio: e.target.value}
//               })}
//               disabled={!editMode}
//               rows="5"
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//               placeholder="Décrivez votre parcours, vos compétences et vos passions..."
//             />
//             <p className="text-sm text-gray-500 mt-2">
//               {formData.profile.bio?.length || 0}/500 caractères
//             </p>
//           </div>
//         </div>
        
//         {/* Section informations Simplon et liens */}
//         <div className="space-y-6">
//           <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
//               <div className="p-2 bg-white rounded-lg shadow-sm">
//                 <GraduationCap size={20} className="text-green-600" />
//               </div>
//               Informations Simplon
//             </h3>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Promotion
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.profile.cohort}
//                   onChange={(e) => setFormData({
//                     ...formData, 
//                     profile: {...formData.profile, cohort: e.target.value}
//                   })}
//                   disabled={!editMode}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="Ex: Simplon 2024"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Spécialité
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.profile.specialite}
//                   onChange={(e) => setFormData({
//                     ...formData, 
//                     profile: {...formData.profile, specialite: e.target.value}
//                   })}
//                   disabled={!editMode}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="Ex: Développement Web Full Stack"
//                 />
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Date d'entrée
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.profile.date_entree}
//                     onChange={(e) => setFormData({
//                       ...formData, 
//                       profile: {...formData.profile, date_entree: e.target.value}
//                     })}
//                     disabled={!editMode}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Date de sortie
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.profile.date_sortie}
//                     onChange={(e) => setFormData({
//                       ...formData, 
//                       profile: {...formData.profile, date_sortie: e.target.value}
//                     })}
//                     disabled={!editMode}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Section liens */}
//           <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Liens professionnels</h3>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                   <Github size={18} className="text-gray-700" />
//                   GitHub
//                 </label>
//                 <input
//                   type="url"
//                   value={formData.profile.github_url}
//                   onChange={(e) => setFormData({
//                     ...formData, 
//                     profile: {...formData.profile, github_url: e.target.value}
//                   })}
//                   disabled={!editMode}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="https://github.com/votre-username"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                   <Linkedin size={18} className="text-blue-600" />
//                   LinkedIn
//                 </label>
//                 <input
//                   type="url"
//                   value={formData.profile.linkedin_url}
//                   onChange={(e) => setFormData({
//                     ...formData, 
//                     profile: {...formData.profile, linkedin_url: e.target.value}
//                   })}
//                   disabled={!editMode}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="https://linkedin.com/in/votre-profile"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                   <Globe size={18} className="text-green-600" />
//                   Portfolio
//                 </label>
//                 <input
//                   type="url"
//                   value={formData.profile.portfolio_url}
//                   onChange={(e) => setFormData({
//                     ...formData, 
//                     profile: {...formData.profile, portfolio_url: e.target.value}
//                   })}
//                   disabled={!editMode}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
//                   placeholder="https://votre-portfolio.com"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const NotificationsTab = () => (
//     <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center gap-3">
//           <div className="p-3 bg-purple-50 rounded-lg">
//             <Bell size={24} className="text-purple-600" />
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
//             <p className="text-gray-600 mt-1">Gérez vos notifications</p>
//           </div>
//         </div>
//         {notifications.some(n => !n.is_read) && (
//           <button
//             onClick={() => {
//               const updatedNotifications = notifications.map(n => ({...n, is_read: true}));
//               setNotifications(updatedNotifications);
//               showMessage('✅ Toutes les notifications marquées comme lues', 'success');
//             }}
//             className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
//           >
//             Tout marquer comme lu
//           </button>
//         )}
//       </div>
      
//       {notifications.length === 0 ? (
//         <div className="text-center py-12">
//           <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
//             <Bell size={48} className="text-gray-300" />
//           </div>
//           <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune notification</h3>
//           <p className="text-gray-500 max-w-md mx-auto">
//             Vous n'avez aucune notification en attente.
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {notifications.map(notification => (
//             <div
//               key={notification.id}
//               className={`p-5 rounded-xl border transition-all duration-300 hover:shadow-md ${
//                 notification.is_read
//                   ? 'bg-gray-50 border-gray-200'
//                   : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
//               }`}
//             >
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-3 mb-3">
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                       notification.type === 'PROFILE_UPDATE' ? 'bg-green-100 text-green-800' :
//                       notification.type === 'SYSTEM' ? 'bg-purple-100 text-purple-800' :
//                       notification.type === 'WELCOME' ? 'bg-blue-100 text-blue-800' :
//                       'bg-gray-100 text-gray-800'
//                     }`}>
//                       {notification.type === 'PROFILE_UPDATE' ? 'Profil' :
//                        notification.type === 'SYSTEM' ? 'Système' :
//                        notification.type === 'WELCOME' ? 'Bienvenue' : 'Info'}
//                     </span>
                    
//                     <div className="flex items-center gap-2">
//                       {!notification.is_read && (
//                         <div className="flex items-center gap-1">
//                           <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//                           <span className="text-xs text-blue-600 font-medium">Nouveau</span>
//                         </div>
//                       )}
//                       <span className="text-sm text-gray-500">•</span>
//                       <span className="text-sm text-gray-500">{notification.time_ago}</span>
//                     </div>
//                   </div>
                  
//                   <h3 className="font-semibold text-gray-800 text-lg mb-2">{notification.title}</h3>
//                   <p className="text-gray-600">{notification.message}</p>
                  
//                   {notification.read_at && (
//                     <p className="text-xs text-gray-500 mt-3">
//                       Lu le {new Date(notification.read_at).toLocaleDateString('fr-FR')}
//                     </p>
//                   )}
//                 </div>
                
//                 {!notification.is_read && (
//                   <button
//                     onClick={() => {
//                       const updatedNotifications = notifications.map(n => 
//                         n.id === notification.id ? {...n, is_read: true} : n
//                       );
//                       setNotifications(updatedNotifications);
//                       showMessage('✅ Notification marquée comme lue', 'success');
//                     }}
//                     className="ml-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium whitespace-nowrap"
//                   >
//                     Marquer comme lu
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="max-w-7xl mx-auto p-4 md:p-6">
//         {/* Message */}
//         {message.text && (
//           <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl max-w-sm ${
//             message.type === 'success' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800' :
//             message.type === 'error' ? 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 text-red-800' :
//             'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 text-blue-800'
//           }`}>
//             <div className="flex items-center gap-3">
//               {message.type === 'success' ? (
//                 <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
//               ) : message.type === 'error' ? (
//                 <X size={24} className="text-red-600 flex-shrink-0" />
//               ) : (
//                 <Bell size={24} className="text-blue-600 flex-shrink-0" />
//               )}
//               <div className="flex-1">
//                 <p className="font-medium">{message.text}</p>
//               </div>
//               <button
//                 onClick={() => setMessage({ text: '', type: '' })}
//                 className="text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//           </div>
//         )}
        
//         {/* Header */}
//         <ProfileHeader />
        
//         {/* Navigation */}
//         <TabsNavigation />
        
//         {/* Contenu des onglets */}
//         {activeTab === 'profile' && <ProfileTab />}
//         {activeTab === 'notifications' && <NotificationsTab />}
//       </div>
//     </div>
//   );
// };

// export default Profile;


// src/components/admin/Profile.jsx - VERSION AVEC INTÉGRATION API COMPLÈTE
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { 
  User, Mail, Phone, GraduationCap,
  Github, Linkedin, Globe, Camera, Upload, CheckCircle,
  Bell, Save, Edit, X, Trash2, Eye, EyeOff
} from 'lucide-react';

const Profile = () => {
  // États principaux
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPassword, setShowPassword] = useState({
    current_password: false,
    new_password: false,
    confirm_password: false
  });

  const fileInputRef = useRef(null);
  const API_BASE = 'http://localhost:8000/api';

  // Données du formulaire
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    github_url: '',
    linkedin_url: '',
    portfolio_url: '',
    cohort: '',
    specialite: '',
    date_entree: '',
    date_sortie: '',
  });

  const [message, setMessage] = useState({ text: '', type: '' });

  // ✅ Obtenir le token
  const getToken = useCallback(() => {
    const token = localStorage.getItem('access_token') || 
                  localStorage.getItem('simplon_access_token') || 
                  localStorage.getItem('authToken');
    
    if (token && token !== 'undefined' && token !== 'null') {
      return token;
    }
    return null;
  }, []);

  // ✅ Obtenir l'ID utilisateur depuis le token
  const getUserIdFromToken = useCallback(() => {
    const token = getToken();
    if (!token) return null;
    
    try {
      // Décoder le JWT (partie payload)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id;
    } catch (error) {
      console.error('Erreur décodage token:', error);
      return null;
    }
  }, [getToken]);

  // ✅ Afficher un message
  const showMessage = useCallback((text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  }, []);

  // ✅ Charger les données de démo si l'API échoue
  const loadDemoData = useCallback(() => {
    const demoUser = {
      id: 1,
      username: 'admin.simplon',
      email: 'admin@simplon.com',
      first_name: 'Admin',
      last_name: 'System',
      phone: '+33 1 23 45 67 89',
      bio: 'Administrateur système de la plateforme Simplon. Passionné par le développement web et la gestion de projets.',
      github_url: 'https://github.com/admin-simplon',
      linkedin_url: 'https://linkedin.com/in/admin-simplon',
      portfolio_url: 'https://portfolio-admin.simplon.com',
      cohort: 'Admin - 2024',
      specialite: 'Administration Système & Développement',
      date_entree: '2024-01-01',
      date_sortie: '2024-12-31',
      profile_picture: null,
      date_joined: '2024-01-15T10:30:00Z',
      last_login: new Date().toISOString(),
    };

    setUser(demoUser);
    setFormData({
      first_name: demoUser.first_name,
      last_name: demoUser.last_name,
      email: demoUser.email,
      phone: demoUser.phone,
      bio: demoUser.bio,
      github_url: demoUser.github_url,
      linkedin_url: demoUser.linkedin_url,
      portfolio_url: demoUser.portfolio_url,
      cohort: demoUser.cohort,
      specialite: demoUser.specialite,
      date_entree: demoUser.date_entree,
      date_sortie: demoUser.date_sortie,
    });

    // Données de démo pour les notifications
    const demoNotifications = [
      {
        id: 1,
        title: 'Profil mis à jour',
        message: 'Votre profil a été mis à jour avec succès',
        type: 'PROFILE_UPDATE',
        is_read: false,
        time_ago: 'Il y a 2 heures',
        read_at: null
      },
      {
        id: 2,
        title: 'Nouveau projet soumis',
        message: 'Un nouveau projet a été soumis pour validation',
        type: 'SYSTEM',
        is_read: true,
        time_ago: 'Il y a 1 jour',
        read_at: '2024-01-20T14:30:00Z'
      },
      {
        id: 3,
        title: 'Bienvenue sur la plateforme',
        message: 'Merci de vous être inscrit sur notre plateforme',
        type: 'WELCOME',
        is_read: true,
        time_ago: 'Il y a 15 jours',
        read_at: '2024-01-15T09:00:00Z'
      }
    ];
    setNotifications(demoNotifications);

    showMessage('✅ Mode démo activé - Données de test', 'info');
  }, [showMessage]);

  // ✅ Charger le profil depuis l'API
  const loadProfile = useCallback(async () => {
    const token = getToken();
    const userId = getUserIdFromToken();
    
    try {
      setLoading(true);
      
      if (token && userId) {
        // Essayer l'API
        const response = await axios.get(`${API_BASE}/users/${userId}/`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const userData = response.data;
        setUser(userData);
        setFormData({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          bio: userData.bio || '',
          github_url: userData.github_url || '',
          linkedin_url: userData.linkedin_url || '',
          portfolio_url: userData.portfolio_url || '',
          cohort: userData.cohort || '',
          specialite: userData.specialite || '',
          date_entree: userData.date_entree || '',
          date_sortie: userData.date_sortie || '',
        });
        
        showMessage('✅ Profil chargé depuis l\'API', 'success');
        
        // Charger les notifications
        try {
          const notificationsResponse = await axios.get(`${API_BASE}/notifications/user/${userId}/`, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          setNotifications(notificationsResponse.data);
        } catch (notifError) {
          console.log('Notifications API non disponible');
        }
      } else {
        // Pas de token, charger les données de démo
        loadDemoData();
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error);
      loadDemoData();
    } finally {
      setLoading(false);
    }
  }, [getToken, getUserIdFromToken, loadDemoData, showMessage]);

  // ✅ Sauvegarder le profil
  const saveProfile = useCallback(async () => {
    const token = getToken();
    const userId = getUserIdFromToken();
    
    try {
      setLoading(true);
      
      if (token && userId) {
        // Sauvegarder via API
        const response = await axios.patch(
          `${API_BASE}/users/${userId}/`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        setUser(response.data);
        showMessage('✅ Profil sauvegardé avec succès !', 'success');
      } else {
        // Sauvegarder localement (mode démo)
        const updatedUser = { 
          ...user, 
          ...formData,
          updated_at: new Date().toISOString()
        };
        setUser(updatedUser);
        showMessage('✅ Profil sauvegardé localement', 'success');
      }
      
      setEditMode(false);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      showMessage('❌ Erreur lors de la sauvegarde', 'error');
    } finally {
      setLoading(false);
    }
  }, [formData, getToken, getUserIdFromToken, user, showMessage]);

  // ✅ Uploader une photo de profil
  const handleImageUpload = useCallback(async (file) => {
    const token = getToken();
    const userId = getUserIdFromToken();
    
    try {
      setUploadingImage(true);
      
      if (token && userId) {
        const formData = new FormData();
        formData.append('profile_picture', file);
        
        const response = await axios.patch(
          `${API_BASE}/users/${userId}/upload-profile-picture/`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        setUser(prev => ({
          ...prev,
          ...response.data
        }));
        
        showMessage('✅ Photo de profil mise à jour !', 'success');
      } else {
        // Simuler l'upload en mode démo
        const reader = new FileReader();
        reader.onload = (e) => {
          setUser(prev => ({
            ...prev,
            profile_picture: e.target.result
          }));
          showMessage('✅ Photo de profil mise à jour (mode démo)', 'success');
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      showMessage('❌ Erreur lors du téléchargement', 'error');
    } finally {
      setUploadingImage(false);
    }
  }, [getToken, getUserIdFromToken, showMessage]);

  // ✅ Supprimer la photo de profil
  const deleteProfilePicture = useCallback(async () => {
    const token = getToken();
    const userId = getUserIdFromToken();
    
    try {
      if (token && userId) {
        await axios.delete(`${API_BASE}/users/${userId}/delete-profile-picture/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setUser(prev => ({
          ...prev,
          profile_picture: null
        }));
        
        showMessage('✅ Photo de profil supprimée', 'success');
      } else {
        // Mode démo
        setUser(prev => ({
          ...prev,
          profile_picture: null
        }));
        showMessage('✅ Photo de profil supprimée (mode démo)', 'success');
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      showMessage('❌ Erreur lors de la suppression', 'error');
    }
  }, [getToken, getUserIdFromToken, showMessage]);

  // ✅ Changer le mot de passe
  const handleChangePassword = useCallback(async () => {
    const token = getToken();
    const userId = getUserIdFromToken();
    
    // Validation
    if (!passwordForm.current_password) {
      showMessage('⚠️ Veuillez saisir votre mot de passe actuel', 'error');
      return;
    }
    
    if (!passwordForm.new_password) {
      showMessage('⚠️ Veuillez saisir un nouveau mot de passe', 'error');
      return;
    }
    
    if (passwordForm.new_password.length < 8) {
      showMessage('⚠️ Le mot de passe doit contenir au moins 8 caractères', 'error');
      return;
    }
    
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      showMessage('⚠️ Les mots de passe ne correspondent pas', 'error');
      return;
    }
    
    try {
      setLoading(true);
      
      if (token && userId) {
        await axios.post(
          `${API_BASE}/users/${userId}/change-password/`,
          passwordForm,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        setPasswordForm({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
        
        showMessage('✅ Mot de passe changé avec succès !', 'success');
      } else {
        showMessage('✅ Mot de passe changé (mode démo)', 'success');
      }
    } catch (error) {
      console.error('Erreur changement mot de passe:', error);
      showMessage('❌ Erreur lors du changement de mot de passe', 'error');
    } finally {
      setLoading(false);
    }
  }, [passwordForm, getToken, getUserIdFromToken, showMessage]);

  // ✅ Effet initial
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // ✅ Rendu conditionnel
  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E30613] mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="text-[#E30613] animate-pulse" size={24} />
            </div>
          </div>
          <p className="text-gray-600 font-medium mt-4">Chargement du profil...</p>
          <p className="text-sm text-gray-500 mt-2">Patientez un instant</p>
        </div>
      </div>
    );
  }

  // ✅ Composants UI

  const ProfileHeader = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Photo de profil */}
        <div className="relative group">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#E30613] bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg">
            {user?.profile_picture ? (
              <img 
                src={user.profile_picture} 
                alt="Profile" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <User size={64} className="text-gray-300 mx-auto" />
                  <p className="text-sm text-gray-400 mt-2">Pas de photo</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="bg-[#E30613] text-white p-3 rounded-full hover:bg-[#c40511] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 transform hover:scale-110"
              title="Changer la photo"
            >
              {uploadingImage ? (
                <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <Camera size={24} />
              )}
            </button>
            
            {user?.profile_picture && (
              <button
                onClick={deleteProfilePicture}
                className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                title="Supprimer la photo"
              >
                <Trash2 size={24} />
              </button>
            )}
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) handleImageUpload(file);
              e.target.value = '';
            }}
          />
        </div>

        {/* Infos utilisateur */}
        <div className="flex-1 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
            <h1 className="text-3xl font-bold text-gray-900">
              {user?.first_name && user?.last_name 
                ? `${user.first_name} ${user.last_name}`
                : user?.username || 'Utilisateur'}
            </h1>
            {user?.cohort && (
              <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-full">
                {user.cohort}
              </span>
            )}
          </div>
          
          <p className="text-gray-600 text-lg mb-6">
            {user?.specialite || 'Administrateur système'}
          </p>
          
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-700">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Mail size={18} className="text-[#E30613]" />
              </div>
              <span>{user?.email}</span>
            </div>
            
            {user?.phone && (
              <div className="flex items-center gap-2 text-gray-700">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Phone size={18} className="text-[#E30613]" />
                </div>
                <span>{user.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E30613] to-red-600 text-white rounded-xl hover:from-red-600 hover:to-[#E30613] transition-all duration-300 shadow-lg hover:shadow-xl font-medium min-w-[180px]"
            >
              <Edit size={20} />
              Modifier le profil
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setEditMode(false);
                  loadProfile();
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg font-medium min-w-[180px]"
              >
                <X size={20} />
                Annuler
              </button>
              
              <button
                onClick={saveProfile}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-500 transition-all duration-300 shadow-lg hover:shadow-xl font-medium min-w-[180px] disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <Save size={20} />
                )}
                Sauvegarder
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const TabsNavigation = () => (
    <div className="bg-white rounded-xl shadow-lg p-2 mb-8 border border-gray-200">
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'profile', label: 'Profil', icon: User, color: 'blue' },
          { id: 'security', label: 'Sécurité', icon: '🔒', color: 'green' },
          { id: 'notifications', label: 'Notifications', icon: Bell, color: 'purple', badge: notifications.filter(n => !n.is_read).length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-300 font-medium ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {typeof tab.icon === 'string' ? (
              <span className="text-lg">{tab.icon}</span>
            ) : (
              <tab.icon size={20} className={`${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`} />
            )}
            <span>{tab.label}</span>
            {tab.badge && tab.badge > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px]">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const ProfileTab = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Informations personnelles</h2>
          <p className="text-gray-600 mt-1">Gérez vos informations personnelles et professionnelles</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className={`w-2 h-2 rounded-full ${editMode ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
          {editMode ? 'Mode édition' : 'Mode consultation'}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section informations de base */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <User size={20} className="text-blue-600" />
              </div>
              Informations de base
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  disabled={!editMode}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Votre prénom"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  disabled={!editMode}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Votre nom"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={!editMode}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="votre@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  disabled={!editMode}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
            </div>
          </div>
          
          {/* Section biographie */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Biographie</h3>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              disabled={!editMode}
              rows="5"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Décrivez votre parcours, vos compétences et vos passions..."
            />
            <p className="text-sm text-gray-500 mt-2">
              {formData.bio?.length || 0}/500 caractères
            </p>
          </div>
        </div>
        
        {/* Section informations Simplon et liens */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <GraduationCap size={20} className="text-green-600" />
              </div>
              Informations Simplon
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promotion
                </label>
                <input
                  type="text"
                  value={formData.cohort}
                  onChange={(e) => setFormData({...formData, cohort: e.target.value})}
                  disabled={!editMode}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Ex: Simplon 2024"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spécialité
                </label>
                <input
                  type="text"
                  value={formData.specialite}
                  onChange={(e) => setFormData({...formData, specialite: e.target.value})}
                  disabled={!editMode}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Ex: Développement Web Full Stack"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'entrée
                  </label>
                  <input
                    type="date"
                    value={formData.date_entree}
                    onChange={(e) => setFormData({...formData, date_entree: e.target.value})}
                    disabled={!editMode}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de sortie
                  </label>
                  <input
                    type="date"
                    value={formData.date_sortie}
                    onChange={(e) => setFormData({...formData, date_sortie: e.target.value})}
                    disabled={!editMode}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Section liens */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Liens professionnels</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Github size={18} className="text-gray-700" />
                  GitHub
                </label>
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                  disabled={!editMode}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="https://github.com/votre-username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Linkedin size={18} className="text-blue-600" />
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                  disabled={!editMode}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="https://linkedin.com/in/votre-profile"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Globe size={18} className="text-green-600" />
                  Portfolio
                </label>
                <input
                  type="url"
                  value={formData.portfolio_url}
                  onChange={(e) => setFormData({...formData, portfolio_url: e.target.value})}
                  disabled={!editMode}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="https://votre-portfolio.com"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-50 rounded-lg">
            <span className="text-2xl">🔒</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sécurité</h2>
            <p className="text-gray-600 mt-1">Gérez votre mot de passe et la sécurité du compte</p>
          </div>
        </div>
      </div>
      
      <div className="max-w-2xl">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Changer le mot de passe</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe actuel
              </label>
              <div className="relative">
                <input
                  type={showPassword.current_password ? "text" : "password"}
                  value={passwordForm.current_password}
                  onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all pr-12"
                  placeholder="Saisissez votre mot de passe actuel"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({...showPassword, current_password: !showPassword.current_password})}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword.current_password ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword.new_password ? "text" : "password"}
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all pr-12"
                  placeholder="Minimum 8 caractères"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({...showPassword, new_password: !showPassword.new_password})}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword.new_password ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirm_password ? "text" : "password"}
                  value={passwordForm.confirm_password}
                  onChange={(e) => setPasswordForm({...passwordForm, confirm_password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all pr-12"
                  placeholder="Retapez le nouveau mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({...showPassword, confirm_password: !showPassword.confirm_password})}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword.confirm_password ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <button
              onClick={handleChangePassword}
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-500 transition-all duration-300 shadow-lg hover:shadow-xl font-medium disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Changement en cours...
                </div>
              ) : 'Changer le mot de passe'}
            </button>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Zone de danger</h3>
          <p className="text-gray-600 mb-4">
            Ces actions sont irréversibles. Veuillez les utiliser avec précaution.
          </p>
          
          <button
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
                showMessage('⚠️ Cette fonctionnalité sera bientôt disponible', 'error');
              }
            }}
            className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-red-500 transition-all duration-300 shadow-lg font-medium"
          >
            Supprimer le compte
          </button>
        </div>
      </div>
    </div>
  );

  const NotificationsTab = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-50 rounded-lg">
            <Bell size={24} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
            <p className="text-gray-600 mt-1">Gérez vos notifications</p>
          </div>
        </div>
        {notifications.some(n => !n.is_read) && (
          <button
            onClick={() => {
              const updatedNotifications = notifications.map(n => ({...n, is_read: true}));
              setNotifications(updatedNotifications);
              showMessage('✅ Toutes les notifications marquées comme lues', 'success');
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Tout marquer comme lu
          </button>
        )}
      </div>
      
      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
            <Bell size={48} className="text-gray-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune notification</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Vous n'avez aucune notification en attente.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-5 rounded-xl border transition-all duration-300 hover:shadow-md ${
                notification.is_read
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      notification.type === 'PROFILE_UPDATE' ? 'bg-green-100 text-green-800' :
                      notification.type === 'SYSTEM' ? 'bg-purple-100 text-purple-800' :
                      notification.type === 'WELCOME' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {notification.type === 'PROFILE_UPDATE' ? 'Profil' :
                       notification.type === 'SYSTEM' ? 'Système' :
                       notification.type === 'WELCOME' ? 'Bienvenue' : 'Info'}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      {!notification.is_read && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-blue-600 font-medium">Nouveau</span>
                        </div>
                      )}
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{notification.time_ago}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">{notification.title}</h3>
                  <p className="text-gray-600">{notification.message}</p>
                  
                  {notification.read_at && (
                    <p className="text-xs text-gray-500 mt-3">
                      Lu le {new Date(notification.read_at).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
                
                {!notification.is_read && (
                  <button
                    onClick={() => {
                      const updatedNotifications = notifications.map(n => 
                        n.id === notification.id ? {...n, is_read: true} : n
                      );
                      setNotifications(updatedNotifications);
                      showMessage('✅ Notification marquée comme lue', 'success');
                    }}
                    className="ml-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium whitespace-nowrap"
                  >
                    Marquer comme lu
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Message */}
        {message.text && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl max-w-sm ${
            message.type === 'success' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800' :
            message.type === 'error' ? 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 text-red-800' :
            'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-center gap-3">
              {message.type === 'success' ? (
                <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
              ) : message.type === 'error' ? (
                <X size={24} className="text-red-600 flex-shrink-0" />
              ) : (
                <Bell size={24} className="text-blue-600 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="font-medium">{message.text}</p>
              </div>
              <button
                onClick={() => setMessage({ text: '', type: '' })}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}
        
        {/* Header */}
        <ProfileHeader />
        
        {/* Navigation */}
        <TabsNavigation />
        
        {/* Contenu des onglets */}
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'security' && <SecurityTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
      </div>
    </div>
  );
};

export default Profile;