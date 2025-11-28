
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { authService } from '../services/auth';

// const Parametre = () => {
//   const [activeSection, setActiveSection] = useState('profil');
//   const [settings, setSettings] = useState({
//     // Profil Simplon
//     nom: '',
//     prenom: '',
//     email: '',
//     telephone: '',
//     bio: '',
//     siteWeb: '',
//     localisation: '',
//     photoProfil: '',
//     specialisation: '',
//     competences: [],
//     cohorte: '',
//     statut: 'en_formation',
//     github: '',
//     linkedin: '',
    
//     // Sécurité
//     deuxFacteurs: false,
//     alertesConnexion: true,
    
//     // Notifications Simplon
//     notifNouveauxProjets: true,
//     notifCommentaires: true,
//     notifActualites: true,
//     notifRappels: true,
//     newsletterSimplon: true,
    
//     // Apparence
//     theme: 'auto',
//     langue: 'fr',
//     modeCompact: false,
    
//     // Préférences projets
//     afficherProjetsPrives: true,
//     autoriserTelechargements: true,
//     triProjetsParDefaut: 'date',
//     afficherStatsPubliques: true
//   });

//   const [user, setUser] = useState(null);
//   const [saveStatus, setSaveStatus] = useState('');
//   const [newCompetence, setNewCompetence] = useState('');
//   const [niveauCompetence, setNiveauCompetence] = useState('debutant');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const currentUser = authService.getCurrentUser();
//     setUser(currentUser);
    
//     // Pré-remplir les champs avec les données de l'utilisateur connecté
//     if (currentUser) {
//       setSettings(prev => ({
//         ...prev,
//         nom: currentUser.last_name || currentUser.nom || '',
//         prenom: currentUser.first_name || currentUser.prenom || '',
//         email: currentUser.email || '',
//         telephone: currentUser.phone || currentUser.telephone || '',
//         bio: currentUser.bio || currentUser.description || '',
//         siteWeb: currentUser.website || currentUser.site_web || '',
//         localisation: currentUser.location || currentUser.localisation || '',
//         specialisation: currentUser.specialisation || '',
//         cohorte: currentUser.cohorte || currentUser.promotion || '',
//         statut: currentUser.statut || 'en_formation',
//         github: currentUser.github || '',
//         linkedin: currentUser.linkedin || '',
//         competences: currentUser.competences || []
//       }));
//     }
    
//     // Charger les paramètres sauvegardés
//     const savedSettings = localStorage.getItem('userSettings');
//     if (savedSettings) {
//       const parsedSettings = JSON.parse(savedSettings);
//       setSettings(prev => ({
//         ...prev,
//         ...parsedSettings,
//         // Garder les données utilisateur prioritaires
//         nom: currentUser?.last_name || currentUser?.nom || parsedSettings.nom || '',
//         prenom: currentUser?.first_name || currentUser?.prenom || parsedSettings.prenom || '',
//         email: currentUser?.email || parsedSettings.email || '',
//       }));
//     }
//   }, []);

//   const handleSettingChange = (key, value) => {
//     setSettings(prev => ({
//       ...prev,
//       [key]: value
//     }));
//   };

//   const addCompetence = () => {
//     if (newCompetence.trim() && !settings.competences.find(c => c.nom === newCompetence.trim())) {
//       const nouvelleCompetence = {
//         id: Date.now(),
//         nom: newCompetence.trim(),
//         niveau: niveauCompetence,
//         dateAjout: new Date().toISOString()
//       };
      
//       setSettings(prev => ({
//         ...prev,
//         competences: [...prev.competences, nouvelleCompetence]
//       }));
      
//       setNewCompetence('');
//       setNiveauCompetence('debutant');
//     }
//   };

//   const removeCompetence = (id) => {
//     setSettings(prev => ({
//       ...prev,
//       competences: prev.competences.filter(c => c.id !== id)
//     }));
//   };

//   const saveSettings = () => {
//     localStorage.setItem('userSettings', JSON.stringify(settings));
//     setSaveStatus('✅ Paramètres sauvegardés avec succès !');
//     setTimeout(() => setSaveStatus(''), 3000);
//   };

//   const getNiveauColor = (niveau) => {
//     switch (niveau) {
//       case 'debutant': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
//       case 'intermediaire': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
//       case 'avance': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
//       case 'expert': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
//       default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
//     }
//   };

//   const getNiveauText = (niveau) => {
//     switch (niveau) {
//       case 'debutant': return 'Débutant';
//       case 'intermediaire': return 'Intermédiaire';
//       case 'avance': return 'Avancé';
//       case 'expert': return 'Expert';
//       default: return niveau;
//     }
//   };

//   const Switch = ({ checked, onChange, id }) => (
//     <label className="relative inline-flex items-center cursor-pointer">
//       <input 
//         type="checkbox" 
//         checked={checked}
//         onChange={onChange}
//         className="sr-only peer" 
//         id={id}
//       />
//       <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#E30613]"></div>
//     </label>
//   );

//   const renderSection = () => {
//     switch (activeSection) {
//       case 'profil':
//         return (
//           <div className="space-y-6">
//             {/* En-tête du profil avec photo */}
//             <div className="flex items-center gap-6 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
//               <div className="relative">
//                 <div className="bg-gray-300 rounded-full size-20 flex items-center justify-center overflow-hidden">
//                   {settings.photoProfil ? (
//                     <img 
//                       src={settings.photoProfil} 
//                       alt="Photo de profil" 
//                       className="rounded-full size-20 object-cover"
//                     />
//                   ) : (
//                     <span className="material-symbols-outlined text-gray-600 text-3xl">
//                       person
//                     </span>
//                   )}
//                 </div>
//                 <button className="absolute bottom-0 right-0 bg-[#E30613] text-white p-1 rounded-full">
//                   <span className="material-symbols-outlined text-sm">edit</span>
//                 </button>
//               </div>
//               <div className="flex-1">
//                 <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
//                   {settings.prenom && settings.nom 
//                     ? `${settings.prenom} ${settings.nom}`
//                     : user?.username || user?.name || 'Utilisateur'
//                   }
//                 </h2>
//                 <p className="text-gray-500 dark:text-gray-400">
//                   {settings.specialisation ? 
//                     `Spécialisation: ${settings.specialisation}` : 
//                     'Membre Simplon'
//                   }
//                 </p>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   {settings.cohorte || 'Cohorte non définie'}
//                 </p>
//               </div>
//             </div>

//             {/* Informations de base */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Prénom *
//                 </label>
//                 <input
//                   type="text"
//                   value={settings.prenom}
//                   onChange={(e) => handleSettingChange('prenom', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   placeholder="Votre prénom"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Nom *
//                 </label>
//                 <input
//                   type="text"
//                   value={settings.nom}
//                   onChange={(e) => handleSettingChange('nom', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   placeholder="Votre nom"
//                 />
//               </div>
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Email *
//               </label>
//               <input
//                 type="email"
//                 value={settings.email}
//                 onChange={(e) => handleSettingChange('email', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                 placeholder="votre@email.com"
//               />
//             </div>

//             {/* Téléphone */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Téléphone
//               </label>
//               <input
//                 type="tel"
//                 value={settings.telephone}
//                 onChange={(e) => handleSettingChange('telephone', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                 placeholder="+33 1 23 45 67 89"
//               />
//             </div>

//             {/* Bio */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Bio
//               </label>
//               <textarea
//                 value={settings.bio}
//                 onChange={(e) => handleSettingChange('bio', e.target.value)}
//                 rows="3"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                 placeholder="Décrivez-vous en quelques mots..."
//               />
//               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                 {settings.bio.length}/160 caractères
//               </p>
//             </div>

//             {/* Liens sociaux */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   GitHub
//                 </label>
//                 <input
//                   type="url"
//                   value={settings.github}
//                   onChange={(e) => handleSettingChange('github', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   placeholder="https://github.com/username"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   LinkedIn
//                 </label>
//                 <input
//                   type="url"
//                   value={settings.linkedin}
//                   onChange={(e) => handleSettingChange('linkedin', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   placeholder="https://linkedin.com/in/username"
//                 />
//               </div>
//             </div>

//             {/* Site web et localisation */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Site web
//                 </label>
//                 <input
//                   type="url"
//                   value={settings.siteWeb}
//                   onChange={(e) => handleSettingChange('siteWeb', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   placeholder="https://example.com"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Localisation
//                 </label>
//                 <input
//                   type="text"
//                   value={settings.localisation}
//                   onChange={(e) => handleSettingChange('localisation', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   placeholder="Ville, Pays"
//                 />
//               </div>
//             </div>

//             {/* Informations système */}
//             <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
//               <h3 className="font-medium text-gray-900 dark:text-white mb-3">Informations système</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <span className="text-gray-500 dark:text-gray-400">Matricule:</span>
//                   <p className="font-medium">{user?.username || user?.matricule || 'Non défini'}</p>
//                 </div>
//                 <div>
//                   <span className="text-gray-500 dark:text-gray-400">Membre depuis:</span>
//                   <p className="font-medium">
//                     {user?.date_joined ? new Date(user.date_joined).toLocaleDateString('fr-FR') : 'Date inconnue'}
//                   </p>
//                 </div>
//                 <div>
//                   <span className="text-gray-500 dark:text-gray-400">Dernière connexion:</span>
//                   <p className="font-medium">
//                     {user?.last_login ? new Date(user.last_login).toLocaleDateString('fr-FR') : 'Maintenant'}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       case 'competences':
//         return (
//           <div className="space-y-6">
//             {/* Spécialisation */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Spécialisation principale
//               </label>
//               <select 
//                 value={settings.specialisation}
//                 onChange={(e) => handleSettingChange('specialisation', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//               >
//                 <option value="">Choisir une spécialisation</option>
//                 <option value="developpement_web">Développement Web</option>
//                 <option value="data_science">Data Science</option>
//                 <option value="cybersecurite">Cybersécurité</option>
//                 <option value="devops">DevOps</option>
//                 <option value="mobile">Développement Mobile</option>
//                 <option value="ai_ml">IA & Machine Learning</option>
//                 <option value="cloud">Cloud Computing</option>
//               </select>
//             </div>

//             {/* Ajout de compétence */}
//             <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
//               <h3 className="font-medium text-gray-900 dark:text-white mb-3">Ajouter une compétence</h3>
//               <div className="flex gap-3 mb-3">
//                 <input
//                   type="text"
//                   value={newCompetence}
//                   onChange={(e) => setNewCompetence(e.target.value)}
//                   className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   placeholder="ex: React, Python, Docker..."
//                   onKeyPress={(e) => e.key === 'Enter' && addCompetence()}
//                 />
//                 <select 
//                   value={niveauCompetence}
//                   onChange={(e) => setNiveauCompetence(e.target.value)}
//                   className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                 >
//                   <option value="debutant">Débutant</option>
//                   <option value="intermediaire">Intermédiaire</option>
//                   <option value="avance">Avancé</option>
//                   <option value="expert">Expert</option>
//                 </select>
//                 <button 
//                   onClick={addCompetence}
//                   className="px-4 py-2 bg-[#E30613] text-white rounded-lg hover:bg-[#D40512] font-medium"
//                 >
//                   Ajouter
//                 </button>
//               </div>
//             </div>

//             {/* Liste des compétences */}
//             <div>
//               <h3 className="font-medium text-gray-900 dark:text-white mb-3">
//                 Mes compétences ({settings.competences.length})
//               </h3>
//               {settings.competences.length === 0 ? (
//                 <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
//                   <span className="material-symbols-outlined text-4xl mb-2">code_blocks</span>
//                   <p>Aucune compétence ajoutée</p>
//                   <p className="text-sm">Ajoutez vos premières compétences ci-dessus</p>
//                 </div>
//               ) : (
//                 <div className="grid gap-2">
//                   {settings.competences.map((competence) => (
//                     <div key={competence.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg dark:border-gray-700">
//                       <div className="flex items-center gap-3">
//                         <span className="material-symbols-outlined text-gray-400">code</span>
//                         <span className="font-medium">{competence.nom}</span>
//                         <span className={`px-2 py-1 text-xs rounded-full ${getNiveauColor(competence.niveau)}`}>
//                           {getNiveauText(competence.niveau)}
//                         </span>
//                       </div>
//                       <button 
//                         onClick={() => removeCompetence(competence.id)}
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         <span className="material-symbols-outlined">delete</span>
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         );

//       case 'formation':
//         return (
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Cohorte/Promotion
//               </label>
//               <input
//                 type="text"
//                 value={settings.cohorte}
//                 onChange={(e) => handleSettingChange('cohorte', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                 placeholder="ex: Promo 2024"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Statut actuel
//               </label>
//               <select 
//                 value={settings.statut}
//                 onChange={(e) => handleSettingChange('statut', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//               >
//                 <option value="en_formation">En formation</option>
//                 <option value="diplome">Diplômé</option>
//                 <option value="alternance">En alternance</option>
//                 <option value="stage">En stage</option>
//                 <option value="recherche">En recherche d'emploi</option>
//                 <option value="emploi">En poste</option>
//               </select>
//             </div>

//             <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
//               <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Informations Simplon</h3>
//               <p className="text-sm text-blue-700 dark:text-blue-300">
//                 Ces informations aident la communauté Simplon à mieux vous connaître et facilitent les échanges entre apprenants.
//               </p>
//             </div>
//           </div>
//         );

//       case 'securite':
//         return (
//           <div className="space-y-6">
//             <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
//               <div>
//                 <h3 className="font-medium text-gray-900 dark:text-white">Authentification à deux facteurs</h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">Ajoutez une couche de sécurité supplémentaire à votre compte</p>
//               </div>
//               <Switch 
//                 checked={settings.deuxFacteurs}
//                 onChange={(e) => handleSettingChange('deuxFacteurs', e.target.checked)}
//               />
//             </div>

//             <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
//               <div>
//                 <h3 className="font-medium text-gray-900 dark:text-white">Alertes de connexion</h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">Recevez des alertes pour les nouvelles connexions</p>
//               </div>
//               <Switch 
//                 checked={settings.alertesConnexion}
//                 onChange={(e) => handleSettingChange('alertesConnexion', e.target.checked)}
//               />
//             </div>

//             <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
//               <h3 className="font-medium text-gray-900 dark:text-white mb-4">Changer le mot de passe</h3>
//               <div className="space-y-4">
//                 <input
//                   type="password"
//                   placeholder="Nouveau mot de passe"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                 />
//                 <input
//                   type="password"
//                   placeholder="Confirmer le mot de passe"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                 />
//                 <button className="px-4 py-2 bg-[#E30613] text-white rounded-lg hover:bg-[#D40512] font-medium">
//                   Mettre à jour le mot de passe
//                 </button>
//               </div>
//             </div>
//           </div>
//         );

//       case 'notifications':
//         return (
//           <div className="space-y-6">
//             <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
//               <div>
//                 <h3 className="font-medium text-gray-900 dark:text-white">Nouveaux projets de ma cohorte</h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">Être notifié des nouveaux projets publiés</p>
//               </div>
//               <Switch 
//                 checked={settings.notifNouveauxProjets}
//                 onChange={(e) => handleSettingChange('notifNouveauxProjets', e.target.checked)}
//               />
//             </div>

//             <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
//               <div>
//                 <h3 className="font-medium text-gray-900 dark:text-white">Commentaires sur mes projets</h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">Recevoir les notifications de commentaires</p>
//               </div>
//               <Switch 
//                 checked={settings.notifCommentaires}
//                 onChange={(e) => handleSettingChange('notifCommentaires', e.target.checked)}
//               />
//             </div>

//             <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
//               <div>
//                 <h3 className="font-medium text-gray-900 dark:text-white">Actualités de la plateforme</h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">Nouvelles fonctionnalités et annonces</p>
//               </div>
//               <Switch 
//                 checked={settings.notifActualites}
//                 onChange={(e) => handleSettingChange('notifActualites', e.target.checked)}
//               />
//             </div>

//             <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
//               <div>
//                 <h3 className="font-medium text-gray-900 dark:text-white">Rappels de mise à jour</h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">Suggestions pour améliorer votre profil</p>
//               </div>
//               <Switch 
//                 checked={settings.notifRappels}
//                 onChange={(e) => handleSettingChange('notifRappels', e.target.checked)}
//               />
//             </div>

//             <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
//               <div>
//                 <h3 className="font-medium text-gray-900 dark:text-white">Newsletter Simplon</h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">Recevoir les actualités de la communauté</p>
//               </div>
//               <Switch 
//                 checked={settings.newsletterSimplon}
//                 onChange={(e) => handleSettingChange('newsletterSimplon', e.target.checked)}
//               />
//             </div>
//           </div>
//         );

//       case 'apparence':
//         return (
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Thème
//               </label>
//               <select 
//                 value={settings.theme}
//                 onChange={(e) => handleSettingChange('theme', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//               >
//                 <option value="auto">Automatique (système)</option>
//                 <option value="light">Clair</option>
//                 <option value="dark">Sombre</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Langue
//               </label>
//               <select 
//                 value={settings.langue}
//                 onChange={(e) => handleSettingChange('langue', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//               >
//                 <option value="fr">Français</option>
//                 <option value="en">English</option>
//               </select>
//             </div>

//             <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
//               <div>
//                 <h3 className="font-medium text-gray-900 dark:text-white">Mode compact</h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">Afficher plus d'éléments par page</p>
//               </div>
//               <Switch 
//                 checked={settings.modeCompact}
//                 onChange={(e) => handleSettingChange('modeCompact', e.target.checked)}
//               />
//             </div>
//           </div>
//         );

//       case 'projets':
//         return (
//           <div className="space-y-6">
//             <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
//               <div>
//                 <h3 className="font-medium text-gray-900 dark:text-white">Afficher les projets privés</h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">Inclure les projets privés dans mon portfolio public</p>
//               </div>
//               <Switch 
//                 checked={settings.afficherProjetsPrives}
//                 onChange={(e) => handleSettingChange('afficherProjetsPrives', e.target.checked)}
//               />
//             </div>

//             <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
//               <div>
//                 <h3 className="font-medium text-gray-900 dark:text-white">Autoriser les téléchargements</h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">Permettre le téléchargement du code source de mes projets</p>
//               </div>
//               <Switch 
//                 checked={settings.autoriserTelechargements}
//                 onChange={(e) => handleSettingChange('autoriserTelechargements', e.target.checked)}
//               />
//             </div>

//             <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
//               <div>
//                 <h3 className="font-medium text-gray-900 dark:text-white">Statistiques publiques</h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">Afficher les statistiques de vues sur mes projets</p>
//               </div>
//               <Switch 
//                 checked={settings.afficherStatsPubliques}
//                 onChange={(e) => handleSettingChange('afficherStatsPubliques', e.target.checked)}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Tri par défaut des projets
//               </label>
//               <select 
//                 value={settings.triProjetsParDefaut}
//                 onChange={(e) => handleSettingChange('triProjetsParDefaut', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//               >
//                 <option value="date">Plus récents</option>
//                 <option value="popularite">Plus populaires</option>
//                 <option value="nom">Ordre alphabétique</option>
//                 <option value="technologie">Par technologie</option>
//               </select>
//             </div>
//           </div>
//         );

//       default:
//         return (
//           <div className="text-center py-8 text-gray-500 dark:text-gray-400">
//             <span className="material-symbols-outlined text-4xl mb-2">settings</span>
//             <p>Section en développement</p>
//           </div>
//         );
//     }
//   };

//   const menuItems = [
//     { id: 'profil', label: 'Profil', icon: 'person' },
//     { id: 'competences', label: 'Compétences', icon: 'code' },
//     { id: 'formation', label: 'Formation', icon: 'school' },
//     { id: 'securite', label: 'Sécurité', icon: 'security' },
//     { id: 'notifications', label: 'Notifications', icon: 'notifications' },
//     { id: 'apparence', label: 'Apparence', icon: 'palette' },
//     { id: 'projets', label: 'Projets', icon: 'folder' }
//   ];

//   return (
//     <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
//       {/* Sidebar */}
//       <aside className="w-64 bg-[#001F3F] text-white min-h-screen p-4 flex flex-col">
//         <div className="flex items-center gap-3 px-3 py-2 mb-8">
//           <div className="bg-gray-400 rounded-full size-10 flex items-center justify-center">
//             <span className="material-symbols-outlined text-white">school</span>
//           </div>
//           <div className="flex flex-col">
//             <h1 className="text-white text-base font-medium">Simplon</h1>
//             <p className="text-gray-400 text-sm">Code Platform</p>
//           </div>
//         </div>

//         <nav className="flex flex-col justify-between flex-grow">
//           <div className="flex flex-col gap-2">
//             <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10">
//               <span className="material-symbols-outlined">folder</span>
//               <span>Mes projets</span>
//             </Link>
//             <Link to="/upload" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10">
//               <span className="material-symbols-outlined">upload_file</span>
//               <span>Déposer un projet</span>
//             </Link>
//             <Link to="/explore" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10">
//               <span className="material-symbols-outlined">explore</span>
//               <span>Explorer les projets</span>
//             </Link>
//             <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10">
//               <span className="material-symbols-outlined">person</span>
//               <span>Profil</span>
//             </Link>
//           </div>
          
//           <div className="flex flex-col gap-1">
//             <Link to="/parametre" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#E30613]">
//               <span className="material-symbols-outlined">settings</span>
//               <span>Paramètres</span>
//             </Link>
//             <button 
//               onClick={() => {
//                 authService.logout();
//                 navigate('/login');
//               }}
//               className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-left"
//             >
//               <span className="material-symbols-outlined">logout</span>
//               <span>Déconnexion</span>
//             </button>
//           </div>
//         </nav>
//       </aside>

//       {/* Contenu principal */}
//       <main className="flex-1 p-6 lg:p-8">
//         <div className="max-w-6xl mx-auto">
//           <header className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//               Paramètres
//             </h1>
//             <p className="text-gray-600 dark:text-gray-400">
//               Gérez vos préférences et paramètres de compte
//             </p>
//           </header>

//           {saveStatus && (
//             <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg dark:bg-green-900 dark:border-green-700 dark:text-green-200">
//               {saveStatus}
//             </div>
//           )}

//           <div className="flex gap-8">
//             {/* Menu latéral des sections */}
//             <div className="w-64 flex-shrink-0">
//               <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
//                 <nav className="space-y-1">
//                   {menuItems.map((item) => (
//                     <button
//                       key={item.id}
//                       onClick={() => setActiveSection(item.id)}
//                       className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
//                         activeSection === item.id
//                           ? 'bg-[#E30613] text-white'
//                           : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
//                       }`}
//                     >
//                       <span className="material-symbols-outlined text-lg">{item.icon}</span>
//                       <span className="text-sm font-medium">{item.label}</span>
//                     </button>
//                   ))}
//                 </nav>
//               </div>
//             </div>

//             {/* Contenu de la section active */}
//             <div className="flex-1">
//               <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
//                 {renderSection()}
                
//                 {/* Bouton sauvegarder */}
//                 <div className="flex justify-end pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
//                   <button 
//                     onClick={saveSettings}
//                     className="px-6 py-2 bg-[#E30613] text-white rounded-lg hover:bg-[#D40512] font-medium transition-colors"
//                   >
//                     Sauvegarder les modifications
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Parametre;


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

const Parametre = () => {
  const [activeSection, setActiveSection] = useState('profil');
  const [settings, setSettings] = useState({
    // Profil Simplon
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    bio: '',
    siteWeb: '',
    localisation: '',
    photoProfil: '',
    specialisation: '',
    competences: [],
    cohorte: '',
    statut: 'en_formation',
    github: '',
    linkedin: '',
    
    // Sécurité
    deuxFacteurs: false,
    
    // Notifications Simplon
    notifNouveauxProjets: true,
    notifActualites: true,
    
    // Apparence
    theme: 'auto',
    langue: 'fr',
    
    // Préférences projets
    afficherProjetsPrives: true,
    triProjetsParDefaut: 'date',
    afficherStatsPubliques: true
  });

  const [user, setUser] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');
  const [newCompetence, setNewCompetence] = useState('');
  const [niveauCompetence, setNiveauCompetence] = useState('debutant');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    
    // Pré-remplir les champs avec les données de l'utilisateur connecté
    if (currentUser) {
      setSettings(prev => ({
        ...prev,
        nom: currentUser.last_name || currentUser.nom || '',
        prenom: currentUser.first_name || currentUser.prenom || '',
        email: currentUser.email || '',
        telephone: currentUser.phone || currentUser.telephone || '',
        bio: currentUser.bio || currentUser.description || '',
        siteWeb: currentUser.website || currentUser.site_web || '',
        localisation: currentUser.location || currentUser.localisation || '',
        specialisation: currentUser.specialisation || '',
        cohorte: currentUser.cohorte || currentUser.promotion || '',
        statut: currentUser.statut || 'en_formation',
        github: currentUser.github || '',
        linkedin: currentUser.linkedin || '',
        competences: currentUser.competences || []
      }));
    }
    
    // Charger les paramètres sauvegardés
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(prev => ({
        ...prev,
        ...parsedSettings,
        // Garder les données utilisateur prioritaires
        nom: currentUser?.last_name || currentUser?.nom || parsedSettings.nom || '',
        prenom: currentUser?.first_name || currentUser?.prenom || parsedSettings.prenom || '',
        email: currentUser?.email || parsedSettings.email || '',
      }));
    }
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePasswordChange = (key, value) => {
    setPasswordData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const addCompetence = () => {
    if (newCompetence.trim() && !settings.competences.find(c => c.nom === newCompetence.trim())) {
      const nouvelleCompetence = {
        id: Date.now(),
        nom: newCompetence.trim(),
        niveau: niveauCompetence,
        dateAjout: new Date().toISOString()
      };
      
      setSettings(prev => ({
        ...prev,
        competences: [...prev.competences, nouvelleCompetence]
      }));
      
      setNewCompetence('');
      setNiveauCompetence('debutant');
    }
  };

  const removeCompetence = (id) => {
    setSettings(prev => ({
      ...prev,
      competences: prev.competences.filter(c => c.id !== id)
    }));
  };

  const saveSettings = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    setSaveStatus('✅ Paramètres sauvegardés avec succès !');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const changePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Les nouveaux mots de passe ne correspondent pas');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    // Ici vous appelleriez votre API pour changer le mot de passe
    console.log('Changement de mot de passe:', {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
    
    alert('Mot de passe changé avec succès !');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const getNiveauColor = (niveau) => {
    switch (niveau) {
      case 'debutant': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'intermediaire': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'avance': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'expert': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getNiveauText = (niveau) => {
    switch (niveau) {
      case 'debutant': return 'Débutant';
      case 'intermediaire': return 'Intermédiaire';
      case 'avance': return 'Avancé';
      case 'expert': return 'Expert';
      default: return niveau;
    }
  };

  const Switch = ({ checked, onChange, id }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        checked={checked}
        onChange={onChange}
        className="sr-only peer" 
        id={id}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#E30613]"></div>
    </label>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'profil':
        return (
          <div className="space-y-6">
            {/* En-tête du profil avec photo */}
            <div className="flex items-center gap-6 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="relative">
                <div className="bg-gray-300 rounded-full size-20 flex items-center justify-center overflow-hidden">
                  {settings.photoProfil ? (
                    <img 
                      src={settings.photoProfil} 
                      alt="Photo de profil" 
                      className="rounded-full size-20 object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-gray-600 text-3xl">
                      person
                    </span>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 bg-[#E30613] text-white p-1 rounded-full">
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {settings.prenom && settings.nom 
                    ? `${settings.prenom} ${settings.nom}`
                    : user?.username || user?.name || 'Utilisateur'
                  }
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {settings.specialisation ? 
                    `Spécialisation: ${settings.specialisation}` : 
                    'Membre Simplon'
                  }
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {settings.cohorte || 'Cohorte non définie'}
                </p>
              </div>
            </div>

            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  value={settings.prenom}
                  onChange={(e) => handleSettingChange('prenom', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Votre prénom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  value={settings.nom}
                  onChange={(e) => handleSettingChange('nom', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Votre nom"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleSettingChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="votre@email.com"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                value={settings.telephone}
                onChange={(e) => handleSettingChange('telephone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="+33 1 23 45 67 89"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={settings.bio}
                onChange={(e) => handleSettingChange('bio', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Décrivez-vous en quelques mots..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {settings.bio.length}/160 caractères
              </p>
            </div>

            {/* Liens sociaux */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GitHub
                </label>
                <input
                  type="url"
                  value={settings.github}
                  onChange={(e) => handleSettingChange('github', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={settings.linkedin}
                  onChange={(e) => handleSettingChange('linkedin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>

            {/* Site web et localisation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site web
                </label>
                <input
                  type="url"
                  value={settings.siteWeb}
                  onChange={(e) => handleSettingChange('siteWeb', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Localisation
                </label>
                <input
                  type="text"
                  value={settings.localisation}
                  onChange={(e) => handleSettingChange('localisation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Ville, Pays"
                />
              </div>
            </div>

            {/* Informations système */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Informations système</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Matricule:</span>
                  <p className="font-medium">{user?.username || user?.matricule || 'Non défini'}</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Membre depuis:</span>
                  <p className="font-medium">
                    {user?.date_joined ? new Date(user.date_joined).toLocaleDateString('fr-FR') : 'Date inconnue'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Dernière connexion:</span>
                  <p className="font-medium">
                    {user?.last_login ? new Date(user.last_login).toLocaleDateString('fr-FR') : 'Maintenant'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'competences':
        return (
          <div className="space-y-6">
            {/* Spécialisation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Spécialisation principale
              </label>
              <select 
                value={settings.specialisation}
                onChange={(e) => handleSettingChange('specialisation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Choisir une spécialisation</option>
                <option value="developpement_web">Développement Web</option>
                <option value="data_science">Data Science</option>
                <option value="cybersecurite">Cybersécurité</option>
                <option value="devops">DevOps</option>
                <option value="mobile">Développement Mobile</option>
                <option value="ai_ml">IA & Machine Learning</option>
                <option value="cloud">Cloud Computing</option>
              </select>
            </div>

            {/* Ajout de compétence */}
            <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Ajouter une compétence</h3>
              <div className="flex gap-3 mb-3">
                <input
                  type="text"
                  value={newCompetence}
                  onChange={(e) => setNewCompetence(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="ex: React, Python, Docker..."
                  onKeyPress={(e) => e.key === 'Enter' && addCompetence()}
                />
                <select 
                  value={niveauCompetence}
                  onChange={(e) => setNiveauCompetence(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="debutant">Débutant</option>
                  <option value="intermediaire">Intermédiaire</option>
                  <option value="avance">Avancé</option>
                  <option value="expert">Expert</option>
                </select>
                <button 
                  onClick={addCompetence}
                  className="px-4 py-2 bg-[#E30613] text-white rounded-lg hover:bg-[#D40512] font-medium"
                >
                  Ajouter
                </button>
              </div>
            </div>

            {/* Liste des compétences */}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                Mes compétences ({settings.competences.length})
              </h3>
              {settings.competences.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <span className="material-symbols-outlined text-4xl mb-2">code_blocks</span>
                  <p>Aucune compétence ajoutée</p>
                  <p className="text-sm">Ajoutez vos premières compétences ci-dessus</p>
                </div>
              ) : (
                <div className="grid gap-2">
                  {settings.competences.map((competence) => (
                    <div key={competence.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-gray-400">code</span>
                        <span className="font-medium">{competence.nom}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getNiveauColor(competence.niveau)}`}>
                          {getNiveauText(competence.niveau)}
                        </span>
                      </div>
                      <button 
                        onClick={() => removeCompetence(competence.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'formation':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cohorte/Promotion
              </label>
              <input
                type="text"
                value={settings.cohorte}
                onChange={(e) => handleSettingChange('cohorte', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="ex: Promo 2024"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Statut actuel
              </label>
              <select 
                value={settings.statut}
                onChange={(e) => handleSettingChange('statut', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="en_formation">En formation</option>
                <option value="diplome">Diplômé</option>
                <option value="alternance">En alternance</option>
                <option value="stage">En stage</option>
                <option value="recherche">En recherche d'emploi</option>
                <option value="emploi">En poste</option>
              </select>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Informations Simplon</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Ces informations aident la communauté Simplon à mieux vous connaître et facilitent les échanges entre apprenants.
              </p>
            </div>
          </div>
        );

      case 'securite':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Authentification à deux facteurs</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ajoutez une couche de sécurité supplémentaire à votre compte</p>
              </div>
              <Switch 
                checked={settings.deuxFacteurs}
                onChange={(e) => handleSettingChange('deuxFacteurs', e.target.checked)}
              />
            </div>

            <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">Changer le mot de passe</h3>
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Mot de passe actuel"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                  type="password"
                  placeholder="Nouveau mot de passe"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <input
                  type="password"
                  placeholder="Confirmer le nouveau mot de passe"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button 
                  onClick={changePassword}
                  className="px-4 py-2 bg-[#E30613] text-white rounded-lg hover:bg-[#D40512] font-medium"
                >
                  Mettre à jour le mot de passe
                </button>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Nouveaux projets de ma cohorte</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Être notifié des nouveaux projets publiés</p>
              </div>
              <Switch 
                checked={settings.notifNouveauxProjets}
                onChange={(e) => handleSettingChange('notifNouveauxProjets', e.target.checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Actualités de la plateforme</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Nouvelles fonctionnalités, événements Simplon et annonces importantes
                </p>
              </div>
              <Switch 
                checked={settings.notifActualites}
                onChange={(e) => handleSettingChange('notifActualites', e.target.checked)}
              />
            </div>
          </div>
        );

      case 'apparence':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Thème
              </label>
              <select 
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="auto">Automatique (système)</option>
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Langue
              </label>
              <select 
                value={settings.langue}
                onChange={(e) => handleSettingChange('langue', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        );

      case 'projets':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Afficher les projets privés</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Inclure les projets privés dans mon portfolio public</p>
              </div>
              <Switch 
                checked={settings.afficherProjetsPrives}
                onChange={(e) => handleSettingChange('afficherProjetsPrives', e.target.checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Statistiques publiques</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Afficher les statistiques de vues sur mes projets</p>
              </div>
              <Switch 
                checked={settings.afficherStatsPubliques}
                onChange={(e) => handleSettingChange('afficherStatsPubliques', e.target.checked)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tri par défaut des projets
              </label>
              <select 
                value={settings.triProjetsParDefaut}
                onChange={(e) => handleSettingChange('triProjetsParDefaut', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="date">Plus récents</option>
                <option value="popularite">Plus populaires</option>
                <option value="nom">Ordre alphabétique</option>
                <option value="technologie">Par technologie</option>
              </select>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <span className="material-symbols-outlined text-4xl mb-2">settings</span>
            <p>Section en développement</p>
          </div>
        );
    }
  };

  const menuItems = [
    { id: 'profil', label: 'Profil', icon: 'person' },
    { id: 'competences', label: 'Compétences', icon: 'code' },
    { id: 'formation', label: 'Formation', icon: 'school' },
    { id: 'securite', label: 'Sécurité', icon: 'security' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'apparence', label: 'Apparence', icon: 'palette' },
    { id: 'projets', label: 'Projets', icon: 'folder' }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-[#001F3F] text-white min-h-screen p-4 flex flex-col">
        <div className="flex items-center gap-3 px-3 py-2 mb-8">
          <div className="bg-gray-400 rounded-full size-10 flex items-center justify-center">
            <span className="material-symbols-outlined text-white">school</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-base font-medium">Simplon</h1>
            <p className="text-gray-400 text-sm">Code Platform</p>
          </div>
        </div>

        <nav className="flex flex-col justify-between flex-grow">
          <div className="flex flex-col gap-2">
            <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10">
              <span className="material-symbols-outlined">folder</span>
              <span>Mes projets</span>
            </Link>
            <Link to="/upload" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10">
              <span className="material-symbols-outlined">upload_file</span>
              <span>Déposer un projet</span>
            </Link>
            <Link to="/explore" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10">
              <span className="material-symbols-outlined">explore</span>
              <span>Explorer les projets</span>
            </Link>
            <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10">
              <span className="material-symbols-outlined">person</span>
              <span>Profil</span>
            </Link>
          </div>
          
          <div className="flex flex-col gap-1">
            <Link to="/parametre" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#E30613]">
              <span className="material-symbols-outlined">settings</span>
              <span>Paramètres</span>
            </Link>
            <button 
              onClick={() => {
                authService.logout();
                navigate('/login');
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-left"
            >
              <span className="material-symbols-outlined">logout</span>
              <span>Déconnexion</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Paramètres
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gérez vos préférences et paramètres de compte
            </p>
          </header>

          {saveStatus && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg dark:bg-green-900 dark:border-green-700 dark:text-green-200">
              {saveStatus}
            </div>
          )}

          <div className="flex gap-8">
            {/* Menu latéral des sections */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === item.id
                          ? 'bg-[#E30613] text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Contenu de la section active */}
            <div className="flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                {renderSection()}
                
                {/* Bouton sauvegarder */}
                <div className="flex justify-end pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={saveSettings}
                    className="px-6 py-2 bg-[#E30613] text-white rounded-lg hover:bg-[#D40512] font-medium transition-colors"
                  >
                    Sauvegarder les modifications
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Parametre;