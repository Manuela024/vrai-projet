// // src/components/admin/Settings.jsx
// import React, { useState, useEffect } from 'react';

// const Settings = () => {
//   const [settings, setSettings] = useState({
//     siteName: 'Simplon Admin',
//     siteDescription: 'Plateforme d\'administration Simplon',
//     notificationsEnabled: true,
//     emailNotifications: true,
//     darkMode: false,
//     maintenanceMode: false,
//     maxProjectsPerUser: 5,
//     autoApproveProjects: false,
//     requireApproval: true
//   });

//   const [loading, setLoading] = useState(false);
//   const [saveSuccess, setSaveSuccess] = useState(false);

//   useEffect(() => {
//     // Simuler le chargement des paramètres depuis l'API
//     setTimeout(() => {
//       setSettings(prev => ({
//         ...prev,
//         darkMode: localStorage.getItem('darkMode') === 'true'
//       }));
//     }, 500);
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setSettings(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleSaveSettings = async () => {
//     setLoading(true);
//     try {
//       // Simuler l'enregistrement des paramètres
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // Sauvegarder les paramètres
//       localStorage.setItem('darkMode', settings.darkMode);
      
//       setSaveSuccess(true);
//       setTimeout(() => setSaveSuccess(false), 3000);
//       console.log('✅ Paramètres sauvegardés:', settings);
//     } catch (error) {
//       console.error('❌ Erreur lors de la sauvegarde:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResetSettings = () => {
//     if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
//       setSettings({
//         siteName: 'Simplon Admin',
//         siteDescription: 'Plateforme d\'administration Simplon',
//         notificationsEnabled: true,
//         emailNotifications: true,
//         darkMode: false,
//         maintenanceMode: false,
//         maxProjectsPerUser: 5,
//         autoApproveProjects: false,
//         requireApproval: true
//       });
//       console.log('🔄 Paramètres réinitialisés');
//     }
//   };

//   const sections = [
//     {
//       title: 'Général',
//       icon: 'settings',
//       items: [
//         {
//           name: 'siteName',
//           label: 'Nom du site',
//           type: 'text',
//           description: 'Nom affiché dans le dashboard admin'
//         },
//         {
//           name: 'siteDescription',
//           label: 'Description du site',
//           type: 'textarea',
//           description: 'Description de la plateforme admin'
//         }
//       ]
//     },
//     {
//       title: 'Notifications',
//       icon: 'notifications',
//       items: [
//         {
//           name: 'notificationsEnabled',
//           label: 'Activer les notifications',
//           type: 'switch',
//           description: 'Activer/désactiver toutes les notifications'
//         },
//         {
//           name: 'emailNotifications',
//           label: 'Notifications par email',
//           type: 'switch',
//           description: 'Envoyer des notifications par email'
//         }
//       ]
//     },
//     {
//       title: 'Affichage',
//       icon: 'palette',
//       items: [
//         {
//           name: 'darkMode',
//           label: 'Mode sombre',
//           type: 'switch',
//           description: 'Activer le mode sombre par défaut'
//         }
//       ]
//     },
//     {
//       title: 'Système',
//       icon: 'build',
//       items: [
//         {
//           name: 'maintenanceMode',
//           label: 'Mode maintenance',
//           type: 'switch',
//           description: 'Mettre le site en mode maintenance'
//         },
//         {
//           name: 'maxProjectsPerUser',
//           label: 'Projets max par utilisateur',
//           type: 'number',
//           description: 'Nombre maximum de projets par utilisateur',
//           min: 1,
//           max: 20
//         }
//       ]
//     },
//     {
//       title: 'Validation des projets',
//       icon: 'check_circle',
//       items: [
//         {
//           name: 'autoApproveProjects',
//           label: 'Approbation automatique',
//           type: 'switch',
//           description: 'Approuver automatiquement les nouveaux projets'
//         },
//         {
//           name: 'requireApproval',
//           label: 'Approbation requise',
//           type: 'switch',
//           description: 'Exiger l\'approbation manuelle des projets'
//         }
//       ]
//     }
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-[#001F3F] dark:text-white">
//             <span className="material-symbols-outlined align-middle mr-2">settings</span>
//             Paramètres de l'administration
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-1">
//             Configurez les paramètres de la plateforme admin
//           </p>
//         </div>
        
//         <div className="flex gap-2">
//           <button
//             onClick={handleResetSettings}
//             className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium flex items-center gap-2"
//           >
//             <span className="material-symbols-outlined">restart_alt</span>
//             Réinitialiser
//           </button>
//           <button
//             onClick={handleSaveSettings}
//             disabled={loading}
//             className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#c40511] transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                 Sauvegarde...
//               </>
//             ) : (
//               <>
//                 <span className="material-symbols-outlined">save</span>
//                 Sauvegarder les paramètres
//               </>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Message de succès */}
//       {saveSuccess && (
//         <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
//           <div className="flex items-center">
//             <span className="material-symbols-outlined text-green-500 mr-2">check_circle</span>
//             <p className="text-green-700 dark:text-green-300">
//               Paramètres sauvegardés avec succès !
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Sections des paramètres */}
//       <div className="space-y-6">
//         {sections.map((section, sectionIndex) => (
//           <div key={sectionIndex} className="bg-white dark:bg-[#1a2f44] rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
//             <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0d1a29]">
//               <h2 className="font-semibold text-[#001F3F] dark:text-white flex items-center gap-2">
//                 <span className="material-symbols-outlined">{section.icon}</span>
//                 {section.title}
//               </h2>
//             </div>
            
//             <div className="p-6 space-y-6">
//               {section.items.map((item, itemIndex) => (
//                 <div key={itemIndex} className="flex flex-col md:flex-row md:items-start justify-between gap-4">
//                   <div className="md:w-1/3">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                       {item.label}
//                     </label>
//                     {item.description && (
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         {item.description}
//                       </p>
//                     )}
//                   </div>
                  
//                   <div className="md:w-2/3">
//                     {item.type === 'text' ? (
//                       <input
//                         type="text"
//                         name={item.name}
//                         value={settings[item.name]}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
//                       />
//                     ) : item.type === 'textarea' ? (
//                       <textarea
//                         name={item.name}
//                         value={settings[item.name]}
//                         onChange={handleInputChange}
//                         rows="3"
//                         className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white resize-none"
//                       />
//                     ) : item.type === 'number' ? (
//                       <input
//                         type="number"
//                         name={item.name}
//                         value={settings[item.name]}
//                         onChange={handleInputChange}
//                         min={item.min || 1}
//                         max={item.max || 100}
//                         className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
//                       />
//                     ) : item.type === 'switch' ? (
//                       <div className="flex items-center">
//                         <button
//                           type="button"
//                           role="switch"
//                           aria-checked={settings[item.name]}
//                           onClick={() => setSettings(prev => ({
//                             ...prev,
//                             [item.name]: !prev[item.name]
//                           }))}
//                           className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E30613] focus:ring-offset-2 ${
//                             settings[item.name] ? 'bg-[#E30613]' : 'bg-gray-300 dark:bg-gray-600'
//                           }`}
//                         >
//                           <span
//                             className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                               settings[item.name] ? 'translate-x-6' : 'translate-x-1'
//                             }`}
//                           />
//                         </button>
//                         <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
//                           {settings[item.name] ? 'Activé' : 'Désactivé'}
//                         </span>
//                       </div>
//                     ) : null}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

      

//       {/* Section avancée */}
//       <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
//         <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2 flex items-center gap-2">
//           <span className="material-symbols-outlined">warning</span>
//           Zone avancée
//         </h3>
//         <p className="text-yellow-700 dark:text-yellow-400 text-sm mb-4">
//           Ces actions sont irréversibles. Utilisez-les avec précaution.
//         </p>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <button
//             onClick={() => {
//               if (window.confirm('Vider le cache effacera toutes les données temporaires. Continuer ?')) {
//                 console.log('🗑️ Cache vidé');
//                 alert('✅ Cache vidé avec succès');
//               }
//             }}
//             className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors font-medium flex items-center justify-center gap-2"
//           >
//             <span className="material-symbols-outlined">delete_sweep</span>
//             Vider le cache
//           </button>
          
//           <button
//             onClick={() => {
//               if (window.confirm('Cette action va recalculer toutes les statistiques. Cela peut prendre du temps. Continuer ?')) {
//                 console.log('📊 Statistiques recalculées');
//                 alert('✅ Statistiques recalculées avec succès');
//               }
//             }}
//             className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors font-medium flex items-center justify-center gap-2"
//           >
//             <span className="material-symbols-outlined">calculate</span>
//             Recalculer les stats
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Settings;

// // src/components/admin/Settings.jsx - VERSION AVEC MODIFICATION DU MOT DE PASSE
// import React, { useState, useEffect } from 'react';
// import authService from '../../services/auth';

// const Settings = () => {
//   const [settings, setSettings] = useState({
//     siteName: 'Simplon Admin',
//     siteDescription: 'Plateforme d\'administration Simplon',
//     notificationsEnabled: true,
//     emailNotifications: true,
//     darkMode: false,
//     maintenanceMode: false,
//     maxProjectsPerUser: 5,
//     autoApproveProjects: false,
//     requireApproval: true
//   });

//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });

//   const [loading, setLoading] = useState(false);
//   const [saveSuccess, setSaveSuccess] = useState(false);
//   const [passwordSuccess, setPasswordSuccess] = useState(false);
//   const [passwordError, setPasswordError] = useState('');
//   const [passwordLoading, setPasswordLoading] = useState(false);

//   useEffect(() => {
//     // Simuler le chargement des paramètres depuis l'API
//     setTimeout(() => {
//       setSettings(prev => ({
//         ...prev,
//         darkMode: localStorage.getItem('darkMode') === 'true'
//       }));
//     }, 500);
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setSettings(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target;
//     setPasswordData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     // Effacer les erreurs précédentes
//     if (passwordError) {
//       setPasswordError('');
//     }
//   };

//   const handleSaveSettings = async () => {
//     setLoading(true);
//     try {
//       // Simuler l'enregistrement des paramètres
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // Sauvegarder les paramètres
//       localStorage.setItem('darkMode', settings.darkMode);
      
//       setSaveSuccess(true);
//       setTimeout(() => setSaveSuccess(false), 3000);
//       console.log('✅ Paramètres sauvegardés:', settings);
//     } catch (error) {
//       console.error('❌ Erreur lors de la sauvegarde:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChangePassword = async () => {
//     // Validation
//     if (!passwordData.currentPassword) {
//       setPasswordError('Veuillez saisir votre mot de passe actuel');
//       return;
//     }

//     if (!passwordData.newPassword) {
//       setPasswordError('Veuillez saisir un nouveau mot de passe');
//       return;
//     }

//     if (passwordData.newPassword.length < 8) {
//       setPasswordError('Le nouveau mot de passe doit contenir au moins 8 caractères');
//       return;
//     }

//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       setPasswordError('Les nouveaux mots de passe ne correspondent pas');
//       return;
//     }

//     if (passwordData.currentPassword === passwordData.newPassword) {
//       setPasswordError('Le nouveau mot de passe doit être différent de l\'ancien');
//       return;
//     }

//     setPasswordLoading(true);
//     setPasswordError('');

//     try {
//       // Simulation de la modification du mot de passe
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       // Ici, vous appelleriez votre API Django
//       // Exemple: await authService.changePassword(passwordData);
      
//       console.log('🔐 Tentative de changement de mot de passe:', {
//         current: passwordData.currentPassword.substring(0, 3) + '***',
//         new: passwordData.newPassword.substring(0, 3) + '***'
//       });

//       // Réinitialiser le formulaire
//       setPasswordData({
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: ''
//       });

//       setPasswordSuccess(true);
//       setTimeout(() => setPasswordSuccess(false), 3000);

//       console.log('✅ Mot de passe changé avec succès');
//       alert('✅ Mot de passe modifié avec succès !');

//     } catch (error) {
//       console.error('❌ Erreur lors du changement de mot de passe:', error);
//       setPasswordError('Erreur lors du changement de mot de passe. Vérifiez votre mot de passe actuel.');
//     } finally {
//       setPasswordLoading(false);
//     }
//   };

//   const handleResetSettings = () => {
//     if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
//       setSettings({
//         siteName: 'Simplon Admin',
//         siteDescription: 'Plateforme d\'administration Simplon',
//         notificationsEnabled: true,
//         emailNotifications: true,
//         darkMode: false,
//         maintenanceMode: false,
//         maxProjectsPerUser: 5,
//         autoApproveProjects: false,
//         requireApproval: true
//       });
//       console.log('🔄 Paramètres réinitialisés');
//     }
//   };

//   const sections = [
//     {
//       title: 'Général',
//       icon: 'settings',
//       items: [
//         {
//           name: 'siteName',
//           label: 'Nom du site',
//           type: 'text',
//           description: 'Nom affiché dans le dashboard admin'
//         },
//         {
//           name: 'siteDescription',
//           label: 'Description du site',
//           type: 'textarea',
//           description: 'Description de la plateforme admin'
//         }
//       ]
//     },
//     {
//       title: 'Notifications',
//       icon: 'notifications',
//       items: [
//         {
//           name: 'notificationsEnabled',
//           label: 'Activer les notifications',
//           type: 'switch',
//           description: 'Activer/désactiver toutes les notifications'
//         },
//         {
//           name: 'emailNotifications',
//           label: 'Notifications par email',
//           type: 'switch',
//           description: 'Envoyer des notifications par email'
//         }
//       ]
//     },
//     {
//       title: 'Affichage',
//       icon: 'palette',
//       items: [
//         {
//           name: 'darkMode',
//           label: 'Mode sombre',
//           type: 'switch',
//           description: 'Activer le mode sombre par défaut'
//         }
//       ]
//     },
//     {
//       title: 'Système',
//       icon: 'build',
//       items: [
//         {
//           name: 'maintenanceMode',
//           label: 'Mode maintenance',
//           type: 'switch',
//           description: 'Mettre le site en mode maintenance'
//         },
//         {
//           name: 'maxProjectsPerUser',
//           label: 'Projets max par utilisateur',
//           type: 'number',
//           description: 'Nombre maximum de projets par utilisateur',
//           min: 1,
//           max: 20
//         }
//       ]
//     },
//     {
//       title: 'Validation des projets',
//       icon: 'check_circle',
//       items: [
//         {
//           name: 'autoApproveProjects',
//           label: 'Approbation automatique',
//           type: 'switch',
//           description: 'Approuver automatiquement les nouveaux projets'
//         },
//         {
//           name: 'requireApproval',
//           label: 'Approbation requise',
//           type: 'switch',
//           description: 'Exiger l\'approbation manuelle des projets'
//         }
//       ]
//     }
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-[#001F3F] dark:text-white">
//             <span className="material-symbols-outlined align-middle mr-2">settings</span>
//             Paramètres de l'administration
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-1">
//             Configurez les paramètres de la plateforme admin
//           </p>
//         </div>
        
//         <div className="flex gap-2">
//           <button
//             onClick={handleResetSettings}
//             className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium flex items-center gap-2"
//           >
//             <span className="material-symbols-outlined">restart_alt</span>
//             Réinitialiser
//           </button>
//           <button
//             onClick={handleSaveSettings}
//             disabled={loading}
//             className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#c40511] transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                 Sauvegarde...
//               </>
//             ) : (
//               <>
//                 <span className="material-symbols-outlined">save</span>
//                 Sauvegarder les paramètres
//               </>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Message de succès pour les paramètres */}
//       {saveSuccess && (
//         <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
//           <div className="flex items-center">
//             <span className="material-symbols-outlined text-green-500 mr-2">check_circle</span>
//             <p className="text-green-700 dark:text-green-300">
//               Paramètres sauvegardés avec succès !
//             </p>
//           </div>
//         </div>
//       )}

//       {/* SECTION MODIFICATION DU MOT DE PASSE */}
//       <div className="bg-white dark:bg-[#1a2f44] rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
//         <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#001F3F] to-[#003265]">
//           <h2 className="font-semibold text-white flex items-center gap-2">
//             <span className="material-symbols-outlined text-white">lock</span>
//             Modifier le mot de passe
//           </h2>
//         </div>
        
//         <div className="p-6 space-y-6">
//           {/* Message de succès pour le mot de passe */}
//           {passwordSuccess && (
//             <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
//               <div className="flex items-center">
//                 <span className="material-symbols-outlined text-green-500 mr-2">check_circle</span>
//                 <p className="text-green-700 dark:text-green-300">
//                   Mot de passe modifié avec succès !
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Message d'erreur */}
//           {passwordError && (
//             <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
//               <div className="flex items-center">
//                 <span className="material-symbols-outlined text-red-500 mr-2">error</span>
//                 <p className="text-red-700 dark:text-red-300">
//                   {passwordError}
//                 </p>
//               </div>
//             </div>
//           )}

//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Mot de passe actuel *
//               </label>
//               <input
//                 type="password"
//                 name="currentPassword"
//                 value={passwordData.currentPassword}
//                 onChange={handlePasswordChange}
//                 placeholder="Saisissez votre mot de passe actuel"
//                 className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Nouveau mot de passe *
//                 </label>
//                 <input
//                   type="password"
//                   name="newPassword"
//                   value={passwordData.newPassword}
//                   onChange={handlePasswordChange}
//                   placeholder="Minimum 8 caractères"
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Confirmer le nouveau mot de passe *
//                 </label>
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   value={passwordData.confirmPassword}
//                   onChange={handlePasswordChange}
//                   placeholder="Retapez le nouveau mot de passe"
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
//                 />
//               </div>
//             </div>

//             {/* Conseils de sécurité */}
//             <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
//               <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
//                 <span className="material-symbols-outlined text-base">security</span>
//                 Conseils pour un mot de passe sécurisé
//               </h4>
//               <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
//                 <li>Utilisez au moins 8 caractères</li>
//                 <li>Mélangez majuscules et minuscules</li>
//                 <li>Ajoutez des chiffres (ex: 123)</li>
//                 <li>Incluez des symboles (ex: @#$%)</li>
//                 <li>Évitez les mots courants ou informations personnelles</li>
//               </ul>
//             </div>

//             <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
//               <button
//                 onClick={handleChangePassword}
//                 disabled={passwordLoading}
//                 className="bg-gradient-to-r from-[#001F3F] to-[#003265] text-white px-6 py-3 rounded-lg hover:from-[#003265] hover:to-[#004080] transition-all duration-300 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
//               >
//                 {passwordLoading ? (
//                   <>
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                     Modification en cours...
//                   </>
//                 ) : (
//                   <>
//                     <span className="material-symbols-outlined">lock_reset</span>
//                     Modifier le mot de passe
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Sections des paramètres */}
//       <div className="space-y-6">
//         {sections.map((section, sectionIndex) => (
//           <div key={sectionIndex} className="bg-white dark:bg-[#1a2f44] rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
//             <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0d1a29]">
//               <h2 className="font-semibold text-[#001F3F] dark:text-white flex items-center gap-2">
//                 <span className="material-symbols-outlined">{section.icon}</span>
//                 {section.title}
//               </h2>
//             </div>
            
//             <div className="p-6 space-y-6">
//               {section.items.map((item, itemIndex) => (
//                 <div key={itemIndex} className="flex flex-col md:flex-row md:items-start justify-between gap-4">
//                   <div className="md:w-1/3">
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                       {item.label}
//                     </label>
//                     {item.description && (
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         {item.description}
//                       </p>
//                     )}
//                   </div>
                  
//                   <div className="md:w-2/3">
//                     {item.type === 'text' ? (
//                       <input
//                         type="text"
//                         name={item.name}
//                         value={settings[item.name]}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
//                       />
//                     ) : item.type === 'textarea' ? (
//                       <textarea
//                         name={item.name}
//                         value={settings[item.name]}
//                         onChange={handleInputChange}
//                         rows="3"
//                         className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white resize-none"
//                       />
//                     ) : item.type === 'number' ? (
//                       <input
//                         type="number"
//                         name={item.name}
//                         value={settings[item.name]}
//                         onChange={handleInputChange}
//                         min={item.min || 1}
//                         max={item.max || 100}
//                         className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
//                       />
//                     ) : item.type === 'switch' ? (
//                       <div className="flex items-center">
//                         <button
//                           type="button"
//                           role="switch"
//                           aria-checked={settings[item.name]}
//                           onClick={() => setSettings(prev => ({
//                             ...prev,
//                             [item.name]: !prev[item.name]
//                           }))}
//                           className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E30613] focus:ring-offset-2 ${
//                             settings[item.name] ? 'bg-[#E30613]' : 'bg-gray-300 dark:bg-gray-600'
//                           }`}
//                         >
//                           <span
//                             className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                               settings[item.name] ? 'translate-x-6' : 'translate-x-1'
//                             }`}
//                           />
//                         </button>
//                         <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
//                           {settings[item.name] ? 'Activé' : 'Désactivé'}
//                         </span>
//                       </div>
//                     ) : null}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Section avancée */}
//       <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
//         <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2 flex items-center gap-2">
//           <span className="material-symbols-outlined">warning</span>
//           Zone avancée
//         </h3>
//         <p className="text-yellow-700 dark:text-yellow-400 text-sm mb-4">
//           Ces actions sont irréversibles. Utilisez-les avec précaution.
//         </p>
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <button
//             onClick={() => {
//               if (window.confirm('Vider le cache effacera toutes les données temporaires. Continuer ?')) {
//                 console.log('🗑️ Cache vidé');
//                 alert('✅ Cache vidé avec succès');
//               }
//             }}
//             className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors font-medium flex items-center justify-center gap-2"
//           >
//             <span className="material-symbols-outlined">delete_sweep</span>
//             Vider le cache
//           </button>
          
//           <button
//             onClick={() => {
//               if (window.confirm('Cette action va recalculer toutes les statistiques. Cela peut prendre du temps. Continuer ?')) {
//                 console.log('📊 Statistiques recalculées');
//                 alert('✅ Statistiques recalculées avec succès');
//               }
//             }}
//             className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors font-medium flex items-center justify-center gap-2"
//           >
//             <span className="material-symbols-outlined">calculate</span>
//             Recalculer les stats
//           </button>

//           <button
//             onClick={() => {
//               if (window.confirm('Cette action vous déconnectera immédiatement. Continuer ?')) {
//                 authService.logout();
//                 window.location.href = '/login';
//               }
//             }}
//             className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-medium flex items-center justify-center gap-2"
//           >
//             <span className="material-symbols-outlined">logout</span>
//             Déconnexion forcée
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Settings;


// // src/components/admin/Settings.jsx - VERSION AVEC MODIFICATION DU MOT DE PASSE
// import React, { useState, useEffect } from 'react';
// import authService from '../../services/auth';

// const Settings = () => {
//   const [settings, setSettings] = useState({
//     siteName: 'Simplon Admin',
//     siteDescription: 'Plateforme d\'administration Simplon',
//     notificationsEnabled: true,
//     emailNotifications: true,
//     darkMode: false,
//     maintenanceMode: false,
//     maxProjectsPerUser: 5,
//     autoApproveProjects: false,
//     requireApproval: true,
//     simpleMode: false,
//     projectsPerPage: 10,
//     compactView: false
//   });

//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });

//   const [loading, setLoading] = useState(false);
//   const [saveSuccess, setSaveSuccess] = useState(false);
//   const [passwordSuccess, setPasswordSuccess] = useState(false);
//   const [passwordError, setPasswordError] = useState('');
//   const [passwordLoading, setPasswordLoading] = useState(false);

//   useEffect(() => {
//     // Simuler le chargement des paramètres depuis l'API
//     setTimeout(() => {
//       const savedDarkMode = localStorage.getItem('darkMode') === 'true';
//       const savedSimpleMode = localStorage.getItem('simpleMode') === 'true';
      
//       setSettings(prev => ({
//         ...prev,
//         darkMode: savedDarkMode,
//         simpleMode: savedSimpleMode
//       }));
//     }, 500);
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setSettings(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value
//     }));
//   };

//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target;
//     setPasswordData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     // Effacer les erreurs précédentes
//     if (passwordError) {
//       setPasswordError('');
//     }
//   };

//   const handleSaveSettings = async () => {
//     setLoading(true);
//     try {
//       // Simuler l'enregistrement des paramètres
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // Sauvegarder les paramètres d'affichage
//       localStorage.setItem('darkMode', settings.darkMode);
//       localStorage.setItem('simpleMode', settings.simpleMode);
      
//       setSaveSuccess(true);
//       setTimeout(() => setSaveSuccess(false), 3000);
//       console.log('✅ Paramètres sauvegardés:', settings);
//     } catch (error) {
//       console.error('❌ Erreur lors de la sauvegarde:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChangePassword = async () => {
//     // Validation
//     if (!passwordData.currentPassword) {
//       setPasswordError('Veuillez saisir votre mot de passe actuel');
//       return;
//     }

//     if (!passwordData.newPassword) {
//       setPasswordError('Veuillez saisir un nouveau mot de passe');
//       return;
//     }

//     if (passwordData.newPassword.length < 8) {
//       setPasswordError('Le nouveau mot de passe doit contenir au moins 8 caractères');
//       return;
//     }

//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       setPasswordError('Les nouveaux mots de passe ne correspondent pas');
//       return;
//     }

//     if (passwordData.currentPassword === passwordData.newPassword) {
//       setPasswordError('Le nouveau mot de passe doit être différent de l\'ancien');
//       return;
//     }

//     setPasswordLoading(true);
//     setPasswordError('');

//     try {
//       // Simulation de la modification du mot de passe
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       // Ici, vous appelleriez votre API Django
//       // Exemple: await authService.changePassword(passwordData);
      
//       console.log('🔐 Tentative de changement de mot de passe:', {
//         current: passwordData.currentPassword.substring(0, 3) + '***',
//         new: passwordData.newPassword.substring(0, 3) + '***'
//       });

//       // Réinitialiser le formulaire
//       setPasswordData({
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: ''
//       });

//       setPasswordSuccess(true);
//       setTimeout(() => setPasswordSuccess(false), 3000);

//       console.log('✅ Mot de passe changé avec succès');
//       alert('✅ Mot de passe modifié avec succès !');

//     } catch (error) {
//       console.error('❌ Erreur lors du changement de mot de passe:', error);
//       setPasswordError('Erreur lors du changement de mot de passe. Vérifiez votre mot de passe actuel.');
//     } finally {
//       setPasswordLoading(false);
//     }
//   };

//   const handleResetSettings = () => {
//     if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
//       setSettings({
//         siteName: 'Simplon Admin',
//         siteDescription: 'Plateforme d\'administration Simplon',
//         notificationsEnabled: true,
//         emailNotifications: true,
//         darkMode: false,
//         maintenanceMode: false,
//         maxProjectsPerUser: 5,
//         autoApproveProjects: false,
//         requireApproval: true,
//         simpleMode: false,
//         projectsPerPage: 10,
//         compactView: false
//       });
//       console.log('🔄 Paramètres réinitialisés');
//     }
//   };

//   const renderInputField = (item) => {
//     const value = settings[item.name];
    
//     switch (item.type) {
//       case 'text':
//         return (
//           <input
//             type="text"
//             name={item.name}
//             value={value}
//             onChange={handleInputChange}
//             className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
//           />
//         );
      
//       case 'textarea':
//         return (
//           <textarea
//             name={item.name}
//             value={value}
//             onChange={handleInputChange}
//             rows="3"
//             className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white resize-none"
//           />
//         );
      
//       case 'number':
//         return (
//           <input
//             type="number"
//             name={item.name}
//             value={value}
//             onChange={handleInputChange}
//             min={item.min || 1}
//             max={item.max || 100}
//             className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
//           />
//         );
      
//       case 'switch':
//         return (
//           <div className="flex items-center">
//             <button
//               type="button"
//               role="switch"
//               aria-checked={value}
//               onClick={() => setSettings(prev => ({
//                 ...prev,
//                 [item.name]: !prev[item.name]
//               }))}
//               className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E30613] focus:ring-offset-2 ${
//                 value ? 'bg-[#E30613]' : 'bg-gray-300 dark:bg-gray-600'
//               }`}
//             >
//               <span
//                 className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                   value ? 'translate-x-6' : 'translate-x-1'
//                 }`}
//               />
//             </button>
//             <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
//               {value ? 'Activé' : 'Désactivé'}
//             </span>
//           </div>
//         );
      
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-[#001F3F] dark:text-white">
//             <span className="material-symbols-outlined align-middle mr-2">settings</span>
//             Paramètres de l'administration
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mt-1">
//             Configurez les paramètres de la plateforme admin
//           </p>
//         </div>
        
//         <div className="flex gap-2">
//           <button
//             onClick={handleResetSettings}
//             className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium flex items-center gap-2"
//           >
//             <span className="material-symbols-outlined">restart_alt</span>
//             Réinitialiser
//           </button>
//           <button
//             onClick={handleSaveSettings}
//             disabled={loading}
//             className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#c40511] transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                 Sauvegarde...
//               </>
//             ) : (
//               <>
//                 <span className="material-symbols-outlined">save</span>
//                 Sauvegarder les paramètres
//               </>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Message de succès pour les paramètres */}
//       {saveSuccess && (
//         <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
//           <div className="flex items-center">
//             <span className="material-symbols-outlined text-green-500 mr-2">check_circle</span>
//             <p className="text-green-700 dark:text-green-300">
//               Paramètres sauvegardés avec succès !
//             </p>
//           </div>
//         </div>
//       )}

//       {/* SECTION MODIFICATION DU MOT DE PASSE */}
//       <div className="bg-white dark:bg-[#1a2f44] rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
//         <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#001F3F] to-[#003265]">
//           <h2 className="font-semibold text-white flex items-center gap-2">
//             <span className="material-symbols-outlined text-white">lock</span>
//             Modifier le mot de passe
//           </h2>
//         </div>
        
//         <div className="p-6 space-y-6">
//           {/* Message de succès pour le mot de passe */}
//           {passwordSuccess && (
//             <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
//               <div className="flex items-center">
//                 <span className="material-symbols-outlined text-green-500 mr-2">check_circle</span>
//                 <p className="text-green-700 dark:text-green-300">
//                   Mot de passe modifié avec succès !
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Message d'erreur */}
//           {passwordError && (
//             <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
//               <div className="flex items-center">
//                 <span className="material-symbols-outlined text-red-500 mr-2">error</span>
//                 <p className="text-red-700 dark:text-red-300">
//                   {passwordError}
//                 </p>
//               </div>
//             </div>
//           )}

//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Mot de passe actuel *
//               </label>
//               <input
//                 type="password"
//                 name="currentPassword"
//                 value={passwordData.currentPassword}
//                 onChange={handlePasswordChange}
//                 placeholder="Saisissez votre mot de passe actuel"
//                 className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Nouveau mot de passe *
//                 </label>
//                 <input
//                   type="password"
//                   name="newPassword"
//                   value={passwordData.newPassword}
//                   onChange={handlePasswordChange}
//                   placeholder="Minimum 8 caractères"
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Confirmer le nouveau mot de passe *
//                 </label>
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   value={passwordData.confirmPassword}
//                   onChange={handlePasswordChange}
//                   placeholder="Retapez le nouveau mot de passe"
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
//                 />
//               </div>
//             </div>

//             {/* Conseils de sécurité */}
//             <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
//               <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
//                 <span className="material-symbols-outlined text-base">security</span>
//                 Conseils pour un mot de passe sécurisé
//               </h4>
//               <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
//                 <li>Utilisez au moins 8 caractères</li>
//                 <li>Mélangez majuscules et minuscules</li>
//                 <li>Ajoutez des chiffres (ex: 123)</li>
//                 <li>Incluez des symboles (ex: @#$%)</li>
//                 <li>Évitez les mots courants ou informations personnelles</li>
//               </ul>
//             </div>

//             <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
//               <button
//                 onClick={handleChangePassword}
//                 disabled={passwordLoading}
//                 className="bg-gradient-to-r from-[#001F3F] to-[#003265] text-white px-6 py-3 rounded-lg hover:from-[#003265] hover:to-[#004080] transition-all duration-300 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
//               >
//                 {passwordLoading ? (
//                   <>
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                     Modification en cours...
//                   </>
//                 ) : (
//                   <>
//                     <span className="material-symbols-outlined">lock_reset</span>
//                     Modifier le mot de passe
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Sections des paramètres */}
//       <div className="space-y-6">
//         {/* Section Général */}
//         <div className="bg-white dark:bg-[#1a2f44] rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0d1a29]">
//             <h2 className="font-semibold text-[#001F3F] dark:text-white flex items-center gap-2">
//               <span className="material-symbols-outlined">settings</span>
//               Général
//             </h2>
//           </div>
          
//           <div className="p-6 space-y-6">
//             <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
//               <div className="md:w-1/3">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Nom du site
//                 </label>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   Nom affiché dans le dashboard admin
//                 </p>
//               </div>
//               <div className="md:w-2/3">
//                 <input
//                   type="text"
//                   name="siteName"
//                   value={settings.siteName}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
//                 />
//               </div>
//             </div>
            
//             <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
//               <div className="md:w-1/3">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Description du site
//                 </label>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   Description de la plateforme admin
//                 </p>
//               </div>
//               <div className="md:w-2/3">
//                 <textarea
//                   name="siteDescription"
//                   value={settings.siteDescription}
//                   onChange={handleInputChange}
//                   rows="3"
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white resize-none"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Section Notifications */}
//         <div className="bg-white dark:bg-[#1a2f44] rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0d1a29]">
//             <h2 className="font-semibold text-[#001F3F] dark:text-white flex items-center gap-2">
//               <span className="material-symbols-outlined">notifications</span>
//               Notifications
//             </h2>
//           </div>
          
//           <div className="p-6 space-y-6">
//             <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
//               <div className="md:w-1/3">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Activer les notifications
//                 </label>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   Activer/désactiver toutes les notifications
//                 </p>
//               </div>
//               <div className="md:w-2/3">
//                 <div className="flex items-center">
//                   <button
//                     type="button"
//                     role="switch"
//                     aria-checked={settings.notificationsEnabled}
//                     onClick={() => setSettings(prev => ({
//                       ...prev,
//                       notificationsEnabled: !prev.notificationsEnabled
//                     }))}
//                     className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E30613] focus:ring-offset-2 ${
//                       settings.notificationsEnabled ? 'bg-[#E30613]' : 'bg-gray-300 dark:bg-gray-600'
//                     }`}
//                   >
//                     <span
//                       className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                         settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
//                       }`}
//                     />
//                   </button>
//                   <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
//                     {settings.notificationsEnabled ? 'Activé' : 'Désactivé'}
//                   </span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
//               <div className="md:w-1/3">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Notifications par email
//                 </label>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   Envoyer des notifications par email
//                 </p>
//               </div>
//               <div className="md:w-2/3">
//                 <div className="flex items-center">
//                   <button
//                     type="button"
//                     role="switch"
//                     aria-checked={settings.emailNotifications}
//                     onClick={() => setSettings(prev => ({
//                       ...prev,
//                       emailNotifications: !prev.emailNotifications
//                     }))}
//                     className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E30613] focus:ring-offset-2 ${
//                       settings.emailNotifications ? 'bg-[#E30613]' : 'bg-gray-300 dark:bg-gray-600'
//                     }`}
//                   >
//                     <span
//                       className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                         settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
//                       }`}
//                     />
//                   </button>
//                   <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
//                     {settings.emailNotifications ? 'Activé' : 'Désactivé'}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Section Affichage */}
//         <div className="bg-white dark:bg-[#1a2f44] rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0d1a29]">
//             <h2 className="font-semibold text-[#001F3F] dark:text-white flex items-center gap-2">
//               <span className="material-symbols-outlined">palette</span>
//               Affichage
//             </h2>
//           </div>
          
//           <div className="p-6 space-y-6">
//             <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
//               <div className="md:w-1/3">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Mode sombre
//                 </label>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   Activer le mode sombre par défaut
//                 </p>
//               </div>
//               <div className="md:w-2/3">
//                 <div className="flex items-center">
//                   <button
//                     type="button"
//                     role="switch"
//                     aria-checked={settings.darkMode}
//                     onClick={() => setSettings(prev => ({
//                       ...prev,
//                       darkMode: !prev.darkMode
//                     }))}
//                     className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E30613] focus:ring-offset-2 ${
//                       settings.darkMode ? 'bg-[#E30613]' : 'bg-gray-300 dark:bg-gray-600'
//                     }`}
//                   >
//                     <span
//                       className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                         settings.darkMode ? 'translate-x-6' : 'translate-x-1'
//                       }`}
//                     />
//                   </button>
//                   <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
//                     {settings.darkMode ? 'Activé' : 'Désactivé'}
//                   </span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
//               <div className="md:w-1/3">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Mode simple
//                 </label>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   Interface simplifiée pour les débutants
//                 </p>
//               </div>
//               <div className="md:w-2/3">
//                 <div className="flex items-center">
//                   <button
//                     type="button"
//                     role="switch"
//                     aria-checked={settings.simpleMode}
//                     onClick={() => setSettings(prev => ({
//                       ...prev,
//                       simpleMode: !prev.simpleMode
//                     }))}
//                     className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E30613] focus:ring-offset-2 ${
//                       settings.simpleMode ? 'bg-[#E30613]' : 'bg-gray-300 dark:bg-gray-600'
//                     }`}
//                   >
//                     <span
//                       className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                         settings.simpleMode ? 'translate-x-6' : 'translate-x-1'
//                       }`}
//                     />
//                   </button>
//                   <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
//                     {settings.simpleMode ? 'Activé' : 'Désactivé'}
//                   </span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
//               <div className="md:w-1/3">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Vue compacte
//                 </label>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   Réduire l'espacement entre les éléments
//                 </p>
//               </div>
//               <div className="md:w-2/3">
//                 <div className="flex items-center">
//                   <button
//                     type="button"
//                     role="switch"
//                     aria-checked={settings.compactView}
//                     onClick={() => setSettings(prev => ({
//                       ...prev,
//                       compactView: !prev.compactView
//                     }))}
//                     className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E30613] focus:ring-offset-2 ${
//                       settings.compactView ? 'bg-[#E30613]' : 'bg-gray-300 dark:bg-gray-600'
//                     }`}
//                   >
//                     <span
//                       className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                         settings.compactView ? 'translate-x-6' : 'translate-x-1'
//                       }`}
//                     />
//                   </button>
//                   <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
//                     {settings.compactView ? 'Activé' : 'Désactivé'}
//                   </span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
//               <div className="md:w-1/3">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Projets par page
//                 </label>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   Nombre de projets affichés par page
//                 </p>
//               </div>
//               <div className="md:w-2/3">
//                 <input
//                   type="number"
//                   name="projectsPerPage"
//                   value={settings.projectsPerPage}
//                   onChange={handleInputChange}
//                   min="5"
//                   max="50"
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Section Système */}
//         <div className="bg-white dark:bg-[#1a2f44] rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0d1a29]">
//             <h2 className="font-semibold text-[#001F3F] dark:text-white flex items-center gap-2">
//               <span className="material-symbols-outlined">build</span>
//               Système
//             </h2>
//           </div>
          
//           <div className="p-6 space-y-6">
//             <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
//               <div className="md:w-1/3">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Mode maintenance
//                 </label>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   Mettre le site en mode maintenance
//                 </p>
//               </div>
//               <div className="md:w-2/3">
//                 <div className="flex items-center">
//                   <button
//                     type="button"
//                     role="switch"
//                     aria-checked={settings.maintenanceMode}
//                     onClick={() => setSettings(prev => ({
//                       ...prev,
//                       maintenanceMode: !prev.maintenanceMode
//                     }))}
//                     className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E30613] focus:ring-offset-2 ${
//                       settings.maintenanceMode ? 'bg-[#E30613]' : 'bg-gray-300 dark:bg-gray-600'
//                     }`}
//                   >
//                     <span
//                       className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                         settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
//                       }`}
//                     />
//                   </button>
//                   <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
//                     {settings.maintenanceMode ? 'Activé' : 'Désactivé'}
//                   </span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
//               <div className="md:w-1/3">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Projets max par utilisateur
//                 </label>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   Nombre maximum de projets par utilisateur
//                 </p>
//               </div>
//               <div className="md:w-2/3">
//                 <input
//                   type="number"
//                   name="maxProjectsPerUser"
//                   value={settings.maxProjectsPerUser}
//                   onChange={handleInputChange}
//                   min="1"
//                   max="20"
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Section Validation des projets */}
//         <div className="bg-white dark:bg-[#1a2f44] rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0d1a29]">
//             <h2 className="font-semibold text-[#001F3F] dark:text-white flex items-center gap-2">
//               <span className="material-symbols-outlined">check_circle</span>
//               Validation des projets
//             </h2>
//           </div>
          
//           <div className="p-6 space-y-6">
//             <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
//               <div className="md:w-1/3">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Approbation automatique
//                 </label>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   Approuver automatiquement les nouveaux projets
//                 </p>
//               </div>
//               <div className="md:w-2/3">
//                 <div className="flex items-center">
//                   <button
//                     type="button"
//                     role="switch"
//                     aria-checked={settings.autoApproveProjects}
//                     onClick={() => setSettings(prev => ({
//                       ...prev,
//                       autoApproveProjects: !prev.autoApproveProjects
//                     }))}
//                     className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E30613] focus:ring-offset-2 ${
//                       settings.autoApproveProjects ? 'bg-[#E30613]' : 'bg-gray-300 dark:bg-gray-600'
//                     }`}
//                   >
//                     <span
//                       className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                         settings.autoApproveProjects ? 'translate-x-6' : 'translate-x-1'
//                       }`}
//                     />
//                   </button>
//                   <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
//                     {settings.autoApproveProjects ? 'Activé' : 'Désactivé'}
//                   </span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
//               <div className="md:w-1/3">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Approbation requise
//                 </label>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   Exiger l'approbation manuelle des projets
//                 </p>
//               </div>
//               <div className="md:w-2/3">
//                 <div className="flex items-center">
//                   <button
//                     type="button"
//                     role="switch"
//                     aria-checked={settings.requireApproval}
//                     onClick={() => setSettings(prev => ({
//                       ...prev,
//                       requireApproval: !prev.requireApproval
//                     }))}
//                     className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E30613] focus:ring-offset-2 ${
//                       settings.requireApproval ? 'bg-[#E30613]' : 'bg-gray-300 dark:bg-gray-600'
//                     }`}
//                   >
//                     <span
//                       className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                         settings.requireApproval ? 'translate-x-6' : 'translate-x-1'
//                       }`}
//                     />
//                   </button>
//                   <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
//                     {settings.requireApproval ? 'Activé' : 'Désactivé'}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Section avancée */}
//       <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
//         <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2 flex items-center gap-2">
//           <span className="material-symbols-outlined">warning</span>
//           Zone avancée
//         </h3>
//         <p className="text-yellow-700 dark:text-yellow-400 text-sm mb-4">
//           Ces actions sont irréversibles. Utilisez-les avec précaution.
//         </p>
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <button
//             onClick={() => {
//               if (window.confirm('Vider le cache effacera toutes les données temporaires. Continuer ?')) {
//                 console.log('🗑️ Cache vidé');
//                 alert('✅ Cache vidé avec succès');
//               }
//             }}
//             className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors font-medium flex items-center justify-center gap-2"
//           >
//             <span className="material-symbols-outlined">delete_sweep</span>
//             Vider le cache
//           </button>
          
//           <button
//             onClick={() => {
//               if (window.confirm('Cette action va recalculer toutes les statistiques. Cela peut prendre du temps. Continuer ?')) {
//                 console.log('📊 Statistiques recalculées');
//                 alert('✅ Statistiques recalculées avec succès');
//               }
//             }}
//             className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors font-medium flex items-center justify-center gap-2"
//           >
//             <span className="material-symbols-outlined">calculate</span>
//             Recalculer les stats
//           </button>

//           <button
//             onClick={() => {
//               if (window.confirm('Cette action vous déconnectera immédiatement. Continuer ?')) {
//                 authService.logout();
//                 window.location.href = '/login';
//               }
//             }}
//             className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-medium flex items-center justify-center gap-2"
//           >
//             <span className="material-symbols-outlined">logout</span>
//             Déconnexion forcée
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Settings;


// src/components/admin/Settings.jsx - VERSION CORRIGÉE
import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw, Lock, Bell, Palette, Shield, AlertTriangle, CheckCircle, Eye, EyeOff, Trash2, LogOut, Download } from 'lucide-react';
import authService from '../../services/auth';

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Simplon Admin',
    siteDescription: 'Plateforme d\'administration Simplon',
    notificationsEnabled: true,
    emailNotifications: true,
    darkMode: false,
    maintenanceMode: false,
    maxProjectsPerUser: 5,
    autoApproveProjects: false,
    requireApproval: true,
    simpleMode: false,
    projectsPerPage: 10,
    compactView: false
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    // Charger les paramètres depuis localStorage
    const loadSettings = () => {
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';
      const savedSimpleMode = localStorage.getItem('simpleMode') === 'true';
      const savedCompactView = localStorage.getItem('compactView') === 'true';
      const savedProjectsPerPage = parseInt(localStorage.getItem('projectsPerPage') || '10');
      
      setSettings(prev => ({
        ...prev,
        darkMode: savedDarkMode,
        simpleMode: savedSimpleMode,
        compactView: savedCompactView,
        projectsPerPage: savedProjectsPerPage
      }));
    };

    loadSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer les erreurs précédentes
    if (passwordError) {
      setPasswordError('');
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Simuler l'enregistrement des paramètres
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sauvegarder les paramètres dans localStorage
      localStorage.setItem('darkMode', settings.darkMode);
      localStorage.setItem('simpleMode', settings.simpleMode);
      localStorage.setItem('compactView', settings.compactView);
      localStorage.setItem('projectsPerPage', settings.projectsPerPage);
      
      // Appliquer le mode sombre au body si nécessaire
      if (settings.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      console.log('✅ Paramètres sauvegardés:', settings);
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    // Validation
    if (!passwordData.currentPassword) {
      setPasswordError('Veuillez saisir votre mot de passe actuel');
      return;
    }

    if (!passwordData.newPassword) {
      setPasswordError('Veuillez saisir un nouveau mot de passe');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError('Le nouveau mot de passe doit être différent de l\'ancien');
      return;
    }

    setPasswordLoading(true);
    setPasswordError('');

    try {
      // Simuler la modification du mot de passe
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('🔐 Tentative de changement de mot de passe');

      // Ici, vous intégrerez l'appel API réel
      // Exemple avec votre backend Django:
      /*
      const response = await fetch('http://localhost:8000/api/auth/change-password/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authService.getAccessToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          old_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
          confirm_password: passwordData.confirmPassword
        })
      });
      
      if (!response.ok) {
        throw new Error('Erreur API');
      }
      */

      // Réinitialiser le formulaire
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);

      console.log('✅ Mot de passe changé avec succès');
      
      // Afficher une notification
      showNotification('✅ Mot de passe modifié avec succès !');

    } catch (error) {
      console.error('❌ Erreur lors du changement de mot de passe:', error);
      setPasswordError('Erreur lors du changement de mot de passe. Vérifiez votre mot de passe actuel.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const showNotification = (message) => {
    // Créer une notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const handleResetSettings = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ? Cette action est irréversible.')) {
      setSettings({
        siteName: 'Simplon Admin',
        siteDescription: 'Plateforme d\'administration Simplon',
        notificationsEnabled: true,
        emailNotifications: true,
        darkMode: false,
        maintenanceMode: false,
        maxProjectsPerUser: 5,
        autoApproveProjects: false,
        requireApproval: true,
        simpleMode: false,
        projectsPerPage: 10,
        compactView: false
      });
      
      // Réinitialiser localStorage
      localStorage.removeItem('darkMode');
      localStorage.removeItem('simpleMode');
      localStorage.removeItem('compactView');
      localStorage.removeItem('projectsPerPage');
      
      document.documentElement.classList.remove('dark');
      
      console.log('🔄 Paramètres réinitialisés');
      showNotification('🔄 Paramètres réinitialisés avec succès');
    }
  };

  const handleExportSettings = () => {
    const settingsData = {
      ...settings,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const dataStr = JSON.stringify(settingsData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `simplon-settings-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('📥 Paramètres exportés avec succès');
  };

  const handleClearCache = () => {
    if (window.confirm('Vider le cache effacera toutes les données temporaires. Continuer ?')) {
      // Effacer les données temporaires de localStorage (sauf l'authentification)
      const preserveKeys = [
        'simplon_access_token', 'simplon_user', 'simplon_user_id', 'simplon_user_role',
        'access_token', 'user', 'refresh_token', 'auth_timestamp'
      ];
      
      Object.keys(localStorage).forEach(key => {
        if (!preserveKeys.includes(key)) {
          localStorage.removeItem(key);
        }
      });
      
      console.log('🗑️ Cache vidé');
      showNotification('🗑️ Cache vidé avec succès');
    }
  };

  const handleForceLogout = () => {
    if (window.confirm('Cette action vous déconnectera immédiatement. Continuer ?')) {
      authService.logout();
      window.location.href = '/login';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#001F3F] dark:text-white flex items-center gap-2">
            <SettingsIcon size={24} />
            Paramètres de l'administration
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configurez les paramètres de la plateforme admin
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleResetSettings}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Réinitialiser
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={loading}
            className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#c40511] transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sauvegarde...
              </>
            ) : (
              <>
                <Save size={16} />
                Sauvegarder
              </>
            )}
          </button>
        </div>
      </div>

      {/* Message de succès */}
      {saveSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="text-green-500 mr-2" size={20} />
            <p className="text-green-700 dark:text-green-300">
              Paramètres sauvegardés avec succès !
            </p>
          </div>
        </div>
      )}

      {/* SECTION MODIFICATION DU MOT DE PASSE */}
      <div className="bg-white dark:bg-[#1a2f44] rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#001F3F] to-[#003265]">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Lock size={20} />
            Modifier le mot de passe
          </h2>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Message de succès */}
          {passwordSuccess && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="text-green-500 mr-2" size={20} />
                <p className="text-green-700 dark:text-green-300">
                  Mot de passe modifié avec succès !
                </p>
              </div>
            </div>
          )}

          {/* Message d'erreur */}
          {passwordError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="text-red-500 mr-2" size={20} />
                <p className="text-red-700 dark:text-red-300">
                  {passwordError}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Mot de passe actuel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mot de passe actuel *
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Saisissez votre mot de passe actuel"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Nouveaux mots de passe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nouveau mot de passe *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Minimum 8 caractères"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirmer le mot de passe *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Retapez le nouveau mot de passe"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Conseils de sécurité */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                <Shield size={16} />
                Conseils pour un mot de passe sécurisé
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                  Utilisez au moins 8 caractères
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                  Mélangez majuscules et minuscules
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                  Ajoutez des chiffres (ex: 123)
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                  Incluez des symboles (ex: @#$%)
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                  Évitez les mots courants ou informations personnelles
                </li>
              </ul>
            </div>

            {/* Bouton de modification */}
            <div className="pt-4">
              <button
                onClick={handleChangePassword}
                disabled={passwordLoading}
                className="bg-gradient-to-r from-[#001F3F] to-[#003265] text-white px-6 py-3 rounded-lg hover:from-[#003265] hover:to-[#004080] transition-all duration-300 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {passwordLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Modification...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Modifier le mot de passe
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section Général */}
      <div className="bg-white dark:bg-[#1a2f44] rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0d1a29]">
          <h2 className="font-semibold text-[#001F3F] dark:text-white flex items-center gap-2">
            <SettingsIcon size={20} />
            Général
          </h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom du site
              </label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section Notifications */}
      <div className="bg-white dark:bg-[#1a2f44] rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0d1a29]">
          <h2 className="font-semibold text-[#001F3F] dark:text-white flex items-center gap-2">
            <Bell size={20} />
            Notifications
          </h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700 dark:text-gray-300">
                Activer les notifications
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Activer/désactiver toutes les notifications
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="notificationsEnabled"
                checked={settings.notificationsEnabled}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E30613]"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700 dark:text-gray-300">
                Notifications par email
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Envoyer des notifications par email
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E30613]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Section Affichage */}
      <div className="bg-white dark:bg-[#1a2f44] rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0d1a29]">
          <h2 className="font-semibold text-[#001F3F] dark:text-white flex items-center gap-2">
            <Palette size={20} />
            Affichage
          </h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700 dark:text-gray-300">
                Mode sombre
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Activer le mode sombre par défaut
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="darkMode"
                checked={settings.darkMode}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E30613]"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700 dark:text-gray-300">
                Mode simple
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Interface simplifiée pour les débutants
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="simpleMode"
                checked={settings.simpleMode}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E30613]"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700 dark:text-gray-300">
                Vue compacte
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Réduire l'espacement entre les éléments
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="compactView"
                checked={settings.compactView}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E30613]"></div>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Projets par page
            </label>
            <input
              type="number"
              name="projectsPerPage"
              value={settings.projectsPerPage}
              onChange={handleInputChange}
              min="5"
              max="50"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Section Système */}
      <div className="bg-white dark:bg-[#1a2f44] rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0d1a29]">
          <h2 className="font-semibold text-[#001F3F] dark:text-white flex items-center gap-2">
            <Shield size={20} />
            Système
          </h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700 dark:text-gray-300">
                Mode maintenance
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Mettre le site en mode maintenance
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E30613]"></div>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Projets max par utilisateur
            </label>
            <input
              type="number"
              name="maxProjectsPerUser"
              value={settings.maxProjectsPerUser}
              onChange={handleInputChange}
              min="1"
              max="20"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-[#E30613] dark:bg-[#0d1a29] dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Actions avancées */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
        <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-4 flex items-center gap-2">
          <AlertTriangle size={20} />
          Actions avancées
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleExportSettings}
            className="px-4 py-3 bg-white dark:bg-[#1a2f44] border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-[#253b52] transition-colors font-medium flex flex-col items-center gap-2"
          >
            <Download size={20} />
            <span>Exporter paramètres</span>
          </button>
          
          <button
            onClick={handleClearCache}
            className="px-4 py-3 bg-white dark:bg-[#1a2f44] border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-[#253b52] transition-colors font-medium flex flex-col items-center gap-2"
          >
            <Trash2 size={20} />
            <span>Vider le cache</span>
          </button>

          <button
            onClick={handleForceLogout}
            className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium flex flex-col items-center gap-2"
          >
            <LogOut size={20} />
            <span>Déconnexion forcée</span>
          </button>
        </div>
        
        <p className="mt-4 text-sm text-yellow-700 dark:text-yellow-400">
          Ces actions sont irréversibles. Utilisez-les avec précaution.
        </p>
      </div>
    </div>
  );
};

export default Settings;