


// // src/components/admin/SubmitProject.jsx - AVEC CHAMP ZIP
// import React, { useState } from 'react';
// import axios from 'axios';
// import authService from '../../services/auth';

// const SubmitProject = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     category: 'web',
//     status: 'draft',
//     tags: '',
//     demo_url: '',
//     github_url: '',
//     documentation_url: '',
//     technologies: [],
//     featured_image: null,
//     project_zip: null, // Nouveau champ pour le ZIP
//     screenshots: [],
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
//   const [previewImage, setPreviewImage] = useState(null);
//   const [zipFileName, setZipFileName] = useState('');

//   const categories = [
//     { value: 'web', label: 'Développement Web' },
//     { value: 'mobile', label: 'Application Mobile' },
//     { value: 'ai', label: 'Intelligence Artificielle' },
//     { value: 'data', label: 'Data Science' },
//     { value: 'iot', label: 'IoT / Embedded' },
//     { value: 'game', label: 'Jeux Vidéo' },
//     { value: 'other', label: 'Autre' }
//   ];

//   const statuses = [
//     { value: 'draft', label: 'Brouillon' },
//     { value: 'pending', label: 'En attente' },
//     { value: 'approved', label: 'Approuvé' },
//     { value: 'published', label: 'Publié' },
//     { value: 'rejected', label: 'Rejeté' }
//   ];

//   const technologiesList = [
//     'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Django', 'Flask',
//     'Java', 'Spring', 'PHP', 'Laravel', 'Symfony', 'Ruby', 'Rails',
//     'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Docker', 'Kubernetes',
//     'AWS', 'Azure', 'Google Cloud', 'Firebase', 'GraphQL', 'REST API'
//   ];

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;
    
//     if (type === 'file') {
//       if (name === 'featured_image' && files[0]) {
//         setFormData({
//           ...formData,
//           [name]: files[0]
//         });
        
//         // Créer une preview
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setPreviewImage(reader.result);
//         };
//         reader.readAsDataURL(files[0]);
        
//       } else if (name === 'project_zip' && files[0]) {
//         // Vérifier que c'est un fichier ZIP
//         if (!files[0].name.toLowerCase().endsWith('.zip')) {
//           setMessage({
//             type: 'error',
//             text: 'Veuillez sélectionner un fichier ZIP (.zip)'
//           });
//           return;
//         }
        
//         // Vérifier la taille (max 50MB)
//         if (files[0].size > 50 * 1024 * 1024) {
//           setMessage({
//             type: 'error',
//             text: 'Le fichier ZIP ne doit pas dépasser 50MB'
//           });
//           return;
//         }
        
//         setFormData({
//           ...formData,
//           [name]: files[0]
//         });
//         setZipFileName(files[0].name);
        
//       } else if (name === 'screenshots') {
//         setFormData({
//           ...formData,
//           [name]: Array.from(files)
//         });
//       }
//     } else if (name === 'technologies') {
//       const selectedTechs = Array.from(e.target.selectedOptions, option => option.value);
//       setFormData({ ...formData, technologies: selectedTechs });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       const token = authService.getAccessToken();
      
//       // Créer FormData pour les fichiers
//       const submitData = new FormData();
      
//       // Ajouter tous les champs
//       Object.keys(formData).forEach(key => {
//         if (key === 'technologies') {
//           formData[key].forEach(tech => submitData.append('technologies[]', tech));
//         } else if (key === 'screenshots' && formData[key].length > 0) {
//           formData[key].forEach((file, index) => {
//             submitData.append(`screenshots_${index}`, file);
//           });
//         } else if (key === 'featured_image' && formData[key]) {
//           submitData.append('featured_image', formData[key]);
//         } else if (key === 'project_zip' && formData[key]) {
//           submitData.append('project_zip', formData[key]);
//         } else {
//           submitData.append(key, formData[key]);
//         }
//       });

//       console.log('📤 Envoi du projet avec fichiers...');
      
//       const response = await axios.post('/api/projects/', submitData, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//         // Augmenter le timeout pour les gros fichiers
//         timeout: 60000,
//       });

//       setMessage({
//         type: 'success',
//         text: 'Projet créé avec succès! Redirection...'
//       });

//       // Réinitialiser le formulaire
//       setFormData({
//         title: '',
//         description: '',
//         category: 'web',
//         status: 'draft',
//         tags: '',
//         demo_url: '',
//         github_url: '',
//         documentation_url: '',
//         technologies: [],
//         featured_image: null,
//         project_zip: null,
//         screenshots: [],
//       });
//       setPreviewImage(null);
//       setZipFileName('');

//       // Rediriger après 2 secondes
//       setTimeout(() => {
//         window.location.href = `/admin/projects/${response.data.id}/edit`;
//       }, 2000);

//     } catch (error) {
//       console.error('Erreur lors de la création du projet:', error);
//       setMessage({
//         type: 'error',
//         text: error.response?.data?.detail || error.message || 'Erreur lors de la création du projet'
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addTechnology = (tech) => {
//     if (!formData.technologies.includes(tech)) {
//       setFormData({
//         ...formData,
//         technologies: [...formData.technologies, tech]
//       });
//     }
//   };

//   const removeTechnology = (techToRemove) => {
//     setFormData({
//       ...formData,
//       technologies: formData.technologies.filter(tech => tech !== techToRemove)
//     });
//   };

//   return (
//     <div className="max-w-6xl mx-auto">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-[#001F3F] dark:text-white mb-2">
//           Déposer un Nouveau Projet
//         </h1>
//         <p className="text-gray-600 dark:text-gray-400">
//           Remplissez ce formulaire pour ajouter un nouveau projet à la plateforme
//         </p>
//       </div>

//       {message.text && (
//         <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
//           {message.text}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="bg-white dark:bg-[#0d1a29] rounded-xl shadow-lg p-6">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Colonne 1: Informations de base */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Titre */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Titre du Projet *
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-800 dark:text-white"
//                 placeholder="Ex: Plateforme E-commerce Simplon"
//               />
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Description *
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 required
//                 rows="6"
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-800 dark:text-white"
//                 placeholder="Décrivez votre projet en détail..."
//               />
//             </div>

//             {/* Catégorie et Statut */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Catégorie *
//                 </label>
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-800 dark:text-white"
//                 >
//                   {categories.map(cat => (
//                     <option key={cat.value} value={cat.value}>{cat.label}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Statut *
//                 </label>
//                 <select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-800 dark:text-white"
//                 >
//                   {statuses.map(status => (
//                     <option key={status.value} value={status.value}>{status.label}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Tags */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Tags (séparés par des virgules)
//               </label>
//               <input
//                 type="text"
//                 name="tags"
//                 value={formData.tags}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-800 dark:text-white"
//                 placeholder="Ex: ecommerce, react, django, postgresql"
//               />
//               <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//                 Ces tags aideront à la recherche et au filtrage
//               </p>
//             </div>

//             {/* Technologies */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Technologies utilisées
//               </label>
//               <div className="flex flex-wrap gap-2 mb-3">
//                 {formData.technologies.map(tech => (
//                   <span
//                     key={tech}
//                     className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
//                   >
//                     {tech}
//                     <button
//                       type="button"
//                       onClick={() => removeTechnology(tech)}
//                       className="text-blue-600 hover:text-blue-800"
//                     >
//                       ×
//                     </button>
//                   </span>
//                 ))}
//               </div>
//               <select
//                 name="technologies"
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-800 dark:text-white"
//                 multiple={false}
//               >
//                 <option value="">Ajouter une technologie...</option>
//                 {technologiesList.map(tech => (
//                   <option key={tech} value={tech}>{tech}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Colonne 2: Fichiers et Liens */}
//           <div className="space-y-6">
//             {/* Image principale */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Image principale
//               </label>
//               <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
//                 {previewImage ? (
//                   <div className="relative">
//                     <img 
//                       src={previewImage} 
//                       alt="Preview" 
//                       className="w-full h-48 object-cover rounded-lg"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setFormData({...formData, featured_image: null});
//                         setPreviewImage(null);
//                       }}
//                       className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ) : (
//                   <div>
//                     <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">
//                       image
//                     </span>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Cliquez pour uploader une image
//                     </p>
//                   </div>
//                 )}
//                 <input
//                   type="file"
//                   name="featured_image"
//                   onChange={handleChange}
//                   accept="image/*"
//                   className="hidden"
//                   id="featured-image"
//                 />
//                 <label
//                   htmlFor="featured-image"
//                   className="inline-block mt-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer text-sm"
//                 >
//                   Choisir une image
//                 </label>
//               </div>
//             </div>

//             {/* Fichier ZIP du projet */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Fichier du projet (ZIP) *
//               </label>
//               <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
//                 {zipFileName ? (
//                   <div className="relative">
//                     <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
//                       <div className="flex items-center justify-center gap-2">
//                         <span className="material-symbols-outlined text-green-600 dark:text-green-400">
//                           folder_zip
//                         </span>
//                         <div className="text-left">
//                           <p className="font-medium text-green-800 dark:text-green-300 truncate">
//                             {zipFileName}
//                           </p>
//                           <p className="text-xs text-green-600 dark:text-green-400">
//                             Fichier ZIP sélectionné
//                           </p>
//                         </div>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setFormData({...formData, project_zip: null});
//                           setZipFileName('');
//                         }}
//                         className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
//                       >
//                         ×
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div>
//                     <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">
//                       folder_zip
//                     </span>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Téléversez votre projet (fichier ZIP)
//                     </p>
//                   </div>
//                 )}
//                 <input
//                   type="file"
//                   name="project_zip"
//                   onChange={handleChange}
//                   accept=".zip,application/zip"
//                   className="hidden"
//                   id="project-zip"
//                   required
//                 />
//                 <label
//                   htmlFor="project-zip"
//                   className="inline-block mt-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer text-sm"
//                 >
//                   {zipFileName ? 'Changer le fichier' : 'Sélectionner un ZIP'}
//                 </label>
//               </div>
//               <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1">
//                 <p>• Format accepté : .zip uniquement</p>
//                 <p>• Taille max : 50MB</p>
//                 <p>• Structure recommandée :</p>
//                 <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs mt-1">
// projet/<br/>
// ├── src/<br/>
// ├── package.json<br/>
// ├── README.md<br/>
// └── ...
//                 </pre>
//               </div>
//             </div>

//             {/* Liens */}
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   URL de démo
//                 </label>
//                 <input
//                   type="url"
//                   name="demo_url"
//                   value={formData.demo_url}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-800 dark:text-white"
//                   placeholder="https://demo.votre-projet.com"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   URL GitHub
//                 </label>
//                 <input
//                   type="url"
//                   name="github_url"
//                   value={formData.github_url}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-800 dark:text-white"
//                   placeholder="https://github.com/username/projet"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Documentation
//                 </label>
//                 <input
//                   type="url"
//                   name="documentation_url"
//                   value={formData.documentation_url}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-800 dark:text-white"
//                   placeholder="https://docs.votre-projet.com"
//                 />
//               </div>
//             </div>

//             {/* Screenshots */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Captures d'écran
//               </label>
//               <input
//                 type="file"
//                 name="screenshots"
//                 onChange={handleChange}
//                 accept="image/*"
//                 multiple
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-800 dark:text-white"
//               />
//               <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//                 Maximum 5 images, 5MB par image
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Boutons de soumission */}
//         <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
//           <button
//             type="button"
//             onClick={() => {
//               setFormData({
//                 ...formData,
//                 status: 'draft'
//               });
//             }}
//             className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//           >
//             Enregistrer comme brouillon
//           </button>
//           <button
//             type="submit"
//             disabled={loading || !formData.project_zip}
//             className="px-6 py-3 bg-[#E30613] text-white rounded-lg hover:bg-[#c40511] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <span className="material-symbols-outlined animate-spin">
//                   refresh
//                 </span>
//                 Création en cours...
//               </>
//             ) : (
//               <>
//                 <span className="material-symbols-outlined">
//                   upload
//                 </span>
//                 {formData.project_zip ? 'Publier le projet' : 'Sélectionnez un fichier ZIP'}
//               </>
//             )}
//           </button>
//         </div>
//       </form>

//       {/* Aide */}
//       <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
//         <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
//           <span className="material-symbols-outlined">info</span>
//           Instructions pour le dépôt de projet
//         </h3>
//         <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-2 list-disc pl-5">
//           <li>
//             <strong>Fichier ZIP requis :</strong> Compressez votre projet complet dans un fichier .zip
//           </li>
//           <li>
//             <strong>Structure recommandée :</strong> Incluez tous les fichiers sources, documentation et dépendances
//           </li>
//           <li>
//             <strong>Validation :</strong> Le fichier sera extrait et vérifié automatiquement
//           </li>
//           <li>
//             <strong>Limites :</strong> 50MB maximum, pas de fichiers exécutables dangereux
//           </li>
//           <li>
//             <strong>Conseil :</strong> Incluez un README.md détaillé dans votre archive
//           </li>
//         </ul>
//       </div>

//       {/* Informations techniques */}
//       <div className="mt-4 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
//         {/* <h3 className="font-medium text-gray-800 dark:text-gray-300 mb-2 flex items-center gap-2">
//           <span className="material-symbols-outlined">engineering</span>
//           Traitement automatique du ZIP
//         </h3> */}
//         {/* <p className="text-sm text-gray-600 dark:text-gray-400">
//           Après soumission, votre fichier ZIP sera :
//         </p> */}
//         {/* <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal pl-5 mt-2">
//           <li>Vérifié pour les virus/malwares</li>
//           <li>Extrait dans un dossier sécurisé</li>
//           <li>Analysé pour détecter la structure du projet</li>
//           <li>Indexé pour la recherche</li>
//           <li>Rendu disponible pour téléchargement par les autres utilisateurs</li>
//         </ol> */}
//       </div>
//     </div>
//   );
// };

// export default SubmitProject;



// // src/components/admin/SubmitProject.jsx - VERSION COMPATIBLE AVEC VOTRE AUTH SERVICE
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import authService from '../../services/auth';

// const SubmitProject = () => {
//   const navigate = useNavigate();
  
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     category: 'web',
//     status: 'draft',
//     tags: '',
//     demo_url: '',
//     github_url: '',
//     documentation_url: '',
//     technologies: [],
//     featured_image: null,
//     project_zip: null,
//     screenshots: [],
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '', details: '' });
//   const [previewImage, setPreviewImage] = useState(null);
//   const [zipFileName, setZipFileName] = useState('');
//   const [apiUrl] = useState('http://localhost:8000/api/projects/');
//   const [validationErrors, setValidationErrors] = useState({});
//   const [progress, setProgress] = useState(0);
//   const [isDirty, setIsDirty] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const categories = [
//     { value: 'web', label: 'Développement Web' },
//     { value: 'mobile', label: 'Application Mobile' },
//     { value: 'ai', label: 'Intelligence Artificielle' },
//     { value: 'data', label: 'Data Science' },
//     { value: 'iot', label: 'IoT / Embedded' },
//     { value: 'game', label: 'Jeux Vidéo' },
//     { value: 'other', label: 'Autre' }
//   ];

//   const statuses = [
//     { value: 'draft', label: 'Brouillon' },
//     { value: 'pending', label: 'En attente de validation' },
//     { value: 'published', label: 'Publié' }
//   ];

//   const technologiesList = [
//     'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Django', 'Flask',
//     'Java', 'Spring', 'PHP', 'Laravel', 'Symfony', 'Ruby', 'Rails',
//     'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Docker', 'Kubernetes',
//     'AWS', 'Azure', 'Google Cloud', 'Firebase', 'GraphQL', 'REST API',
//     'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'SASS', 'Tailwind CSS',
//     'Next.js', 'Nuxt.js', 'Express.js', 'FastAPI'
//   ];

//   // Vérifier l'authentification au chargement
//   useEffect(() => {
//     const checkAuth = () => {
//       const authenticated = authService.isAuthenticated();
//       setIsAuthenticated(authenticated);
      
//       if (!authenticated) {
//         console.log('⚠️ Non authentifié, redirection vers login...');
//         // Stocker l'URL actuelle pour redirection après login
//         sessionStorage.setItem('redirectAfterLogin', '/admin/projects/new');
//         navigate('/login', { 
//           replace: true,
//           state: { 
//             message: 'Veuillez vous connecter pour déposer un projet',
//             from: '/admin/projects/new'
//           }
//         });
//       } else {
//         console.log('✅ Authentifié:', authService.getCurrentUser());
//       }
//     };

//     checkAuth();
    
//     // Déboguer l'état d'authentification
//     console.log('🔍 État auth:', {
//       isAuthenticated: authService.isAuthenticated(),
//       token: authService.getAccessToken() ? 'Présent' : 'Absent',
//       user: authService.getCurrentUser()
//     });
//   }, [navigate]);

//   // Calculer la progression
//   useEffect(() => {
//     let progressValue = 0;
//     const totalFields = 8;
    
//     if (formData.title) progressValue += 15;
//     if (formData.description) progressValue += 20;
//     if (formData.category) progressValue += 10;
//     if (formData.technologies.length > 0) progressValue += 15;
//     if (formData.project_zip) progressValue += 25;
//     if (formData.github_url || formData.demo_url) progressValue += 10;
//     if (formData.featured_image) progressValue += 5;

//     setProgress(progressValue);
//   }, [formData]);

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;
//     setIsDirty(true);
    
//     if (validationErrors[name]) {
//       setValidationErrors(prev => ({ ...prev, [name]: undefined }));
//     }

//     if (type === 'file') {
//       if (name === 'featured_image' && files[0]) {
//         if (!files[0].type.startsWith('image/')) {
//           setValidationErrors(prev => ({
//             ...prev,
//             featured_image: 'Le fichier doit être une image'
//           }));
//           return;
//         }
//         if (files[0].size > 5 * 1024 * 1024) {
//           setValidationErrors(prev => ({
//             ...prev,
//             featured_image: 'L\'image ne doit pas dépasser 5MB'
//           }));
//           return;
//         }

//         setFormData({
//           ...formData,
//           [name]: files[0]
//         });
        
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setPreviewImage(reader.result);
//         };
//         reader.readAsDataURL(files[0]);
        
//       } else if (name === 'project_zip' && files[0]) {
//         if (!files[0].name.toLowerCase().endsWith('.zip')) {
//           setValidationErrors(prev => ({
//             ...prev,
//             project_zip: 'Veuillez sélectionner un fichier ZIP (.zip)'
//           }));
//           return;
//         }
        
//         if (files[0].size > 50 * 1024 * 1024) {
//           setValidationErrors(prev => ({
//             ...prev,
//             project_zip: 'Le fichier ZIP ne doit pas dépasser 50MB'
//           }));
//           return;
//         }
        
//         setFormData({
//           ...formData,
//           [name]: files[0]
//         });
//         setZipFileName(files[0].name);
        
//       } else if (name === 'screenshots') {
//         const screenshotsArray = Array.from(files);
        
//         const invalidFiles = screenshotsArray.filter(file => 
//           !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024
//         );
        
//         if (invalidFiles.length > 0) {
//           setValidationErrors(prev => ({
//             ...prev,
//             screenshots: 'Chaque image doit être inférieure à 5MB'
//           }));
//           return;
//         }
        
//         if (screenshotsArray.length > 10) {
//           setValidationErrors(prev => ({
//             ...prev,
//             screenshots: 'Maximum 10 images autorisées'
//           }));
//           return;
//         }
        
//         setFormData({
//           ...formData,
//           [name]: screenshotsArray
//         });
//       }
//     } else if (name === 'technologies') {
//       const selectedTechs = Array.from(e.target.selectedOptions, option => option.value);
//       setFormData({ ...formData, technologies: selectedTechs });
//     } else {
//       if ((name === 'demo_url' || name === 'github_url' || name === 'documentation_url') && value) {
//         try {
//           new URL(value);
//         } catch (e) {
//           setValidationErrors(prev => ({
//             ...prev,
//             [name]: 'URL invalide'
//           }));
//         }
//       }
      
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const validateForm = () => {
//     const errors = {};
    
//     if (!formData.title.trim()) {
//       errors.title = 'Le titre est requis';
//     } else if (formData.title.length < 3) {
//       errors.title = 'Le titre doit contenir au moins 3 caractères';
//     }
    
//     if (!formData.description.trim()) {
//       errors.description = 'La description est requise';
//     } else if (formData.description.length < 50) {
//       errors.description = 'La description doit contenir au moins 50 caractères';
//     }
    
//     if (!formData.project_zip) {
//       errors.project_zip = 'Le fichier ZIP est requis';
//     }

//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       setMessage({
//         type: 'error',
//         text: 'Veuillez corriger les erreurs dans le formulaire'
//       });
//       return;
//     }

//     // Vérifier à nouveau l'authentification
//     if (!authService.isAuthenticated()) {
//       setMessage({
//         type: 'error',
//         text: 'Session expirée',
//         details: 'Veuillez vous reconnecter pour déposer un projet'
//       });
//       setTimeout(() => {
//         sessionStorage.setItem('redirectAfterLogin', '/admin/projects/new');
//         navigate('/login');
//       }, 2000);
//       return;
//     }

//     setLoading(true);
//     setMessage({ type: '', text: '', details: '' });

//     try {
//       const token = authService.getAccessToken();
//       const user = authService.getCurrentUser();
      
//       console.log('🔑 Token:', token);
//       console.log('👤 Utilisateur:', user);
      
//       if (!token) {
//         throw new Error('Token non disponible');
//       }

//       // Créer FormData
//       const submitData = new FormData();
      
//       submitData.append('title', formData.title.trim());
//       submitData.append('description', formData.description.trim());
//       submitData.append('category', formData.category);
//       submitData.append('status', formData.status === 'draft' ? 'pending' : formData.status);
//       submitData.append('tags', formData.tags.trim());
//       submitData.append('demo_url', formData.demo_url.trim());
//       submitData.append('github_url', formData.github_url.trim());
//       submitData.append('documentation_url', formData.documentation_url.trim());
      
//       submitData.append('technologies', JSON.stringify(formData.technologies));
      
//       if (user && user.id) {
//         submitData.append('author', user.id);
//       }

//       if (formData.featured_image) {
//         submitData.append('featured_image', formData.featured_image);
//       }
      
//       if (formData.project_zip) {
//         submitData.append('project_zip', formData.project_zip);
//       }
      
//       if (formData.screenshots && formData.screenshots.length > 0) {
//         formData.screenshots.forEach((file) => {
//           submitData.append('screenshots', file);
//         });
//       }

//       // Debug: Afficher les données
//       console.log('📤 Données FormData:');
//       for (let pair of submitData.entries()) {
//         console.log(pair[0] + ':', pair[1]);
//       }

//       // Vérifier d'abord si l'API est accessible
//       try {
//         const testResponse = await fetch('http://localhost:8000/api/projects/', {
//           method: 'OPTIONS'
//         });
//         console.log('✅ Test API réussi:', testResponse.status);
//       } catch (testError) {
//         console.error('❌ API inaccessible:', testError);
//         setMessage({
//           type: 'error',
//           text: 'Serveur inaccessible',
//           details: 'Vérifiez que Django est démarré sur http://localhost:8000'
//         });
//         setLoading(false);
//         return;
//       }

//       // Envoyer la requête
//       const response = await axios.post(apiUrl, submitData, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//         timeout: 120000,
//       });

//       console.log('✅ Réponse API:', response.data);

//       setMessage({
//         type: 'success',
//         text: `✅ Projet "${response.data.title}" créé avec succès!`,
//         details: 'Redirection vers la page de confirmation...'
//       });

//       // Réinitialiser le formulaire
//       setFormData({
//         title: '',
//         description: '',
//         category: 'web',
//         status: 'draft',
//         tags: '',
//         demo_url: '',
//         github_url: '',
//         documentation_url: '',
//         technologies: [],
//         featured_image: null,
//         project_zip: null,
//         screenshots: [],
//       });
//       setPreviewImage(null);
//       setZipFileName('');

//       // Rediriger vers la page de succès
//     //   setTimeout(() => {
//     //     navigate('/admin/projects/success', { 
//     //       state: { 
//     //         projectId: response.data.id,
//     //         projectTitle: response.data.title
//     //       } 
//     //     });
//     //   }, 1500);

//     // Dans la fonction handleSubmit de SubmitProject.jsx
// // Remplacer cette partie :
// setTimeout(() => {
//   navigate('/admin/projects/success', { 
//     state: { 
//       projectId: response.data.id,
//       projectTitle: response.data.title
//     } 
//   });
// }, 1500);

// // Par ceci :
// setTimeout(() => {
//   // Utiliser navigate avec state
//   navigate('success', { 
//     state: { 
//       projectId: response.data.id,
//       projectTitle: response.data.title,
//       projectData: response.data
//     },
//     replace: true  // Empêche de revenir en arrière vers le formulaire
//   });
// }, 1500);
//     } catch (error) {
//       console.error('❌ Erreur complète:', error);
      
//       let errorMessage = 'Erreur lors de la création du projet';
//       let errorDetails = '';
      
//       if (error.response) {
//         console.error('📊 Statut:', error.response.status);
//         console.error('📊 Données:', error.response.data);
        
//         if (error.response.status === 401) {
//           errorMessage = 'Session expirée';
//           errorDetails = 'Veuillez vous reconnecter';
          
//           // Déconnexion et redirection
//           authService.logout();
//           setTimeout(() => {
//             sessionStorage.setItem('redirectAfterLogin', '/admin/projects/new');
//             navigate('/login');
//           }, 2000);
          
//         } else if (error.response.status === 400) {
//           errorMessage = 'Erreur de validation';
//           const errors = error.response.data;
//           errorDetails = Object.keys(errors).map(key => 
//             `${key}: ${Array.isArray(errors[key]) ? errors[key].join(', ') : errors[key]}`
//           ).join(' | ');
          
//         } else if (error.response.status === 403) {
//           errorMessage = 'Permission refusée';
//           errorDetails = 'Vous n\'avez pas les droits pour créer un projet';
          
//         } else if (error.response.status === 413) {
//           errorMessage = 'Fichier trop volumineux';
//           errorDetails = 'Le fichier ZIP dépasse la limite de 50MB';
          
//         } else {
//           errorMessage = error.response.data.detail || errorMessage;
//           errorDetails = JSON.stringify(error.response.data);
//         }
        
//       } else if (error.request) {
//         errorMessage = 'Serveur inaccessible';
//         errorDetails = 'Vérifiez que Django tourne sur http://localhost:8000';
        
//       } else {
//         errorMessage = error.message;
//       }
      
//       setMessage({
//         type: 'error',
//         text: errorMessage,
//         details: errorDetails
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addTechnology = (tech) => {
//     if (!formData.technologies.includes(tech)) {
//       setFormData({
//         ...formData,
//         technologies: [...formData.technologies, tech]
//       });
//       setIsDirty(true);
//     }
//   };

//   const removeTechnology = (techToRemove) => {
//     setFormData({
//       ...formData,
//       technologies: formData.technologies.filter(tech => tech !== techToRemove)
//     });
//     setIsDirty(true);
//   };

//   const handleQuickLogin = async () => {
//     try {
//       setMessage({
//         type: 'info',
//         text: 'Connexion rapide en cours...',
//         details: ''
//       });
      
//       await authService.quickLogin();
//       setIsAuthenticated(true);
      
//       setMessage({
//         type: 'success',
//         text: 'Connecté avec succès!',
//         details: 'Vous pouvez maintenant déposer votre projet.'
//       });
      
//     } catch (error) {
//       setMessage({
//         type: 'error',
//         text: 'Échec de la connexion rapide',
//         details: error.message
//       });
//     }
//   };

//   // Si non authentifié, afficher un message
//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
//         <div className="max-w-md w-full bg-white dark:bg-[#0d1a29] rounded-2xl shadow-xl p-8 text-center">
//           <div className="text-5xl mb-6">🔒</div>
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
//             Accès non autorisé
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 mb-6">
//             Vous devez être connecté pour déposer un projet.
//           </p>
          
//           <div className="space-y-4">
//             <button
//               onClick={() => navigate('/login', { 
//                 state: { from: '/admin/projects/new' } 
//               })}
//               className="w-full px-6 py-3 bg-[#E30613] text-white rounded-lg hover:bg-[#c40511] transition-colors font-medium"
//             >
//               Se connecter
//             </button>
            
//             <button
//               onClick={handleQuickLogin}
//               className="w-full px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
//             >
//               Connexion rapide (admin)
//             </button>
//           </div>
          
//           <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               <strong>Identifiants de test :</strong><br/>
//               • admin / admin123<br/>
//               • simplon_2025001 / simplon2024
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Formulaire pour utilisateur authentifié
//   return (
//     <div className="max-w-7xl mx-auto p-4 lg:p-6">
//       {/* En-tête avec infos utilisateur */}
//       <div className="mb-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//           <div>
//             <h1 className="text-3xl lg:text-4xl font-bold text-[#001F3F] dark:text-white mb-2">
//               Déposer un Nouveau Projet
//             </h1>
//             <p className="text-gray-600 dark:text-gray-400">
//               Connecté en tant que <span className="font-semibold text-[#E30613]">
//                 {authService.getCurrentUser()?.username || 'Utilisateur'}
//               </span>
//             </p>
//           </div>
          
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full text-sm">
//               <span className="material-symbols-outlined text-sm">verified</span>
//               Connecté
//             </div>
//             <button
//               onClick={() => authService.logout()}
//               className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
//             >
//               Déconnexion
//             </button>
//           </div>
//         </div>

//         {/* Barre de progression */}
//         <div className="mb-6">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//               Complétude du formulaire
//             </span>
//             <span className="text-sm font-bold text-[#E30613]">
//               {progress}%
//             </span>
//           </div>
//           <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
//             <div 
//               className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-[#E30613] transition-all duration-500"
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//         </div>
//       </div>

//       {/* Messages */}
//       {message.text && (
//         <div className={`mb-6 p-4 rounded-xl border ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : message.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'}`}>
//           <div className="flex items-start gap-3">
//             <span className={`material-symbols-outlined mt-0.5 ${message.type === 'success' ? 'text-green-600 dark:text-green-400' : message.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
//               {message.type === 'success' ? 'check_circle' : message.type === 'error' ? 'error' : 'info'}
//             </span>
//             <div className="flex-1">
//               <p className={`font-medium ${message.type === 'success' ? 'text-green-800 dark:text-green-300' : message.type === 'error' ? 'text-red-800 dark:text-red-300' : 'text-blue-800 dark:text-blue-300'}`}>
//                 {message.text}
//               </p>
//               {message.details && (
//                 <p className="text-sm mt-1 opacity-80">
//                   {message.details}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="bg-white dark:bg-[#0d1a29] rounded-2xl shadow-xl p-6 lg:p-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Colonne 1: Informations de base */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Titre */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Titre du Projet *
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 required
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors ${
//                   validationErrors.title 
//                     ? 'border-red-500 dark:border-red-500' 
//                     : 'border-gray-300 dark:border-gray-600'
//                 }`}
//                 placeholder="Ex: Plateforme E-commerce Simplon avec React et Django"
//               />
//               {validationErrors.title && (
//                 <p className="text-sm text-red-600 dark:text-red-400 mt-1">
//                   {validationErrors.title}
//                 </p>
//               )}
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Description *
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 required
//                 rows="6"
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors ${
//                   validationErrors.description 
//                     ? 'border-red-500 dark:border-red-500' 
//                     : 'border-gray-300 dark:border-gray-600'
//                 }`}
//                 placeholder="Décrivez votre projet en détail : objectifs, fonctionnalités, technologies utilisées..."
//               />
//               {validationErrors.description && (
//                 <p className="text-sm text-red-600 dark:text-red-400 mt-1">
//                   {validationErrors.description}
//                 </p>
//               )}
//             </div>

//             {/* Catégorie et Statut */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Catégorie *
//                 </label>
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-800 dark:text-white"
//                 >
//                   {categories.map(cat => (
//                     <option key={cat.value} value={cat.value}>{cat.label}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Statut *
//                 </label>
//                 <select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-800 dark:text-white"
//                 >
//                   {statuses.map(status => (
//                     <option key={status.value} value={status.value}>{status.label}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Technologies */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Technologies utilisées
//               </label>
//               <div className="flex flex-wrap gap-2 mb-3">
//                 {formData.technologies.map(tech => (
//                   <span
//                     key={tech}
//                     className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
//                   >
//                     {tech}
//                     <button
//                       type="button"
//                       onClick={() => removeTechnology(tech)}
//                       className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
//                     >
//                       ×
//                     </button>
//                   </span>
//                 ))}
//               </div>
//               <select
//                 name="technologies"
//                 onChange={(e) => {
//                   if (e.target.value) {
//                     addTechnology(e.target.value);
//                     e.target.value = '';
//                   }
//                 }}
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-800 dark:text-white"
//               >
//                 <option value="">Sélectionner une technologie...</option>
//                 {technologiesList.map(tech => (
//                   <option key={tech} value={tech}>{tech}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Tags */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Tags (séparés par des virgules)
//               </label>
//               <input
//                 type="text"
//                 name="tags"
//                 value={formData.tags}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-800 dark:text-white"
//                 placeholder="Ex: ecommerce, react, django, postgresql"
//               />
//             </div>
//           </div>

//           {/* Colonne 2: Fichiers et Liens */}
//           <div className="space-y-6">
//             {/* Fichier ZIP */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Fichier du projet (ZIP) *
//               </label>
//               <div className={`border-2 ${!formData.project_zip ? 'border-dashed' : ''} ${
//                 validationErrors.project_zip 
//                   ? 'border-red-500 dark:border-red-500' 
//                   : formData.project_zip 
//                     ? 'border-green-500 dark:border-green-600' 
//                     : 'border-gray-300 dark:border-gray-600'
//               } rounded-lg p-6 text-center`}>
//                 {zipFileName ? (
//                   <div className="relative">
//                     <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
//                       <div className="flex items-center justify-center gap-3">
//                         <span className="material-symbols-outlined text-green-600 dark:text-green-400">
//                           folder_zip
//                         </span>
//                         <div className="text-left">
//                           <p className="font-medium text-green-800 dark:text-green-300 truncate">
//                             {zipFileName}
//                           </p>
//                           <p className="text-xs text-green-600 dark:text-green-400">
//                             Fichier ZIP sélectionné
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="py-6">
//                     <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">
//                       folder_zip
//                     </span>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Téléversez votre projet (fichier ZIP)
//                     </p>
//                   </div>
//                 )}
//                 <input
//                   type="file"
//                   name="project_zip"
//                   onChange={handleChange}
//                   accept=".zip,application/zip"
//                   className="hidden"
//                   id="project-zip"
//                   required
//                 />
//                 <label
//                   htmlFor="project-zip"
//                   className={`inline-block mt-4 px-5 py-2.5 rounded-lg cursor-pointer text-sm font-medium ${
//                     zipFileName 
//                       ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
//                       : 'bg-[#E30613] text-white hover:bg-[#c40511]'
//                   }`}
//                 >
//                   {zipFileName ? 'Changer le fichier' : 'Sélectionner un ZIP'}
//                 </label>
//                 {validationErrors.project_zip && (
//                   <p className="text-sm text-red-600 dark:text-red-400 mt-2">
//                     {validationErrors.project_zip}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Image principale */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Image principale
//               </label>
//               <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
//                 {previewImage ? (
//                   <div className="relative">
//                     <img 
//                       src={previewImage} 
//                       alt="Preview" 
//                       className="w-full h-48 object-cover rounded-lg"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setFormData({...formData, featured_image: null});
//                         setPreviewImage(null);
//                       }}
//                       className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="py-6">
//                     <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">
//                       image
//                     </span>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Cliquez pour uploader une image
//                     </p>
//                   </div>
//                 )}
//                 <input
//                   type="file"
//                   name="featured_image"
//                   onChange={handleChange}
//                   accept="image/*"
//                   className="hidden"
//                   id="featured-image"
//                 />
//                 <label
//                   htmlFor="featured-image"
//                   className="inline-block mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer text-sm"
//                 >
//                   Choisir une image
//                 </label>
//               </div>
//             </div>

//             {/* Liens */}
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   URL GitHub (recommandé)
//                 </label>
//                 <input
//                   type="url"
//                   name="github_url"
//                   value={formData.github_url}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-800 dark:text-white"
//                   placeholder="https://github.com/votre-username/projet"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   URL de démo
//                 </label>
//                 <input
//                   type="url"
//                   name="demo_url"
//                   value={formData.demo_url}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-800 dark:text-white"
//                   placeholder="https://demo.votre-projet.com"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Boutons de soumission */}
//         <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
//           <button
//             type="submit"
//             disabled={loading || !formData.project_zip || !formData.title || !formData.description}
//             className="px-8 py-3 bg-[#E30613] text-white rounded-lg hover:bg-[#c40511] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
//           >
//             {loading ? (
//               <>
//                 <span className="material-symbols-outlined animate-spin">
//                   refresh
//                 </span>
//                 Publication en cours...
//               </>
//             ) : (
//               <>
//                 <span className="material-symbols-outlined">
//                   upload
//                 </span>
//                 Publier le projet
//               </>
//             )}
//           </button>
//         </div>
//       </form>

//       {/* Section debug */}
//       <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
//         <details>
//           <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 font-medium">
//             🔍 Informations de débogage
//           </summary>
//           <div className="mt-3 text-xs space-y-2">
//             <div className="grid grid-cols-2 gap-2">
//               <div>
//                 <strong>Authentification:</strong>
//                 <p>• Token: {authService.getAccessToken() ? '✅ Présent' : '❌ Absent'}</p>
//                 <p>• Authentifié: {authService.isAuthenticated() ? '✅ Oui' : '❌ Non'}</p>
//                 <p>• Utilisateur: {authService.getCurrentUser()?.username || 'Non défini'}</p>
//               </div>
//               <div>
//                 <strong>API:</strong>
//                 <p>• URL: {apiUrl}</p>
//                 <p>• Formulaire prêt: {progress >= 70 ? '✅ Oui' : '⚠️ Non'}</p>
//                 <p>• ZIP: {formData.project_zip ? '✅ Présent' : '❌ Manquant'}</p>
//               </div>
//             </div>
//             <button
//               onClick={() => {
//                 authService.debug();
//                 console.log('FormData:', formData);
//               }}
//               className="px-3 py-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs"
//             >
//               Afficher debug dans console
//             </button>
//           </div>
//         </details>
//       </div>
//     </div>
//   );
// };

// export default SubmitProject;

// // src/components/admin/SubmitProject.jsx - VERSION AMÉLIORÉE AVEC TOUTES LES FONCTIONNALITÉS
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import authService from '../../services/auth';

// const SubmitProject = () => {
//   const navigate = useNavigate();
  
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     category: 'web',
//     status: 'draft',
//     tags: '',
//     demo_url: '',
//     github_url: '',
//     documentation_url: '',
//     technologies: [],
//     featured_image: null,
//     project_zip: null,
//     screenshots: [],
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '', details: '' });
//   const [previewImage, setPreviewImage] = useState(null);
//   const [zipFileName, setZipFileName] = useState('');
//   const [validationErrors, setValidationErrors] = useState({});
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const categories = [
//     { value: 'web', label: 'Développement Web' },
//     { value: 'mobile', label: 'Application Mobile' },
//     { value: 'ai', label: 'Intelligence Artificielle' },
//     { value: 'data', label: 'Data Science' },
//     { value: 'iot', label: 'IoT / Embedded' },
//     { value: 'game', label: 'Jeux Vidéo' },
//     { value: 'other', label: 'Autre' }
//   ];

//   const statuses = [
//     { value: 'draft', label: 'Brouillon' },
//     { value: 'pending', label: 'En attente de validation' },
//     { value: 'published', label: 'Publié' }
//   ];

//   const technologiesList = [
//     'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Django', 'Flask',
//     'Java', 'Spring', 'PHP', 'Laravel', 'Symfony', 'Ruby', 'Rails',
//     'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Docker', 'Kubernetes',
//     'AWS', 'Azure', 'Google Cloud', 'Firebase', 'GraphQL', 'REST API',
//     'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'SASS', 'Tailwind CSS',
//     'Next.js', 'Nuxt.js', 'Express.js', 'FastAPI'
//   ];

//   // Vérifier l'authentification au chargement
//   useEffect(() => {
//     const checkAuth = () => {
//       const authenticated = authService.isAuthenticated();
//       setIsAuthenticated(authenticated);
      
//       if (!authenticated) {
//         console.log('⚠️ Non authentifié, redirection...');
//         sessionStorage.setItem('redirectAfterLogin', '/admin/submit-project');
//         navigate('/login', { 
//           replace: true,
//           state: { 
//             message: 'Veuillez vous connecter pour déposer un projet',
//             from: '/admin/submit-project'
//           }
//         });
//       }
//     };

//     checkAuth();
//   }, [navigate]);

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;
    
//     // Clear validation error for this field
//     if (validationErrors[name]) {
//       setValidationErrors(prev => ({ ...prev, [name]: undefined }));
//     }

//     if (type === 'file') {
//       if (name === 'featured_image' && files[0]) {
//         // Validation de l'image
//         if (!files[0].type.startsWith('image/')) {
//           setValidationErrors(prev => ({
//             ...prev,
//             featured_image: 'Le fichier doit être une image'
//           }));
//           return;
//         }
//         if (files[0].size > 5 * 1024 * 1024) {
//           setValidationErrors(prev => ({
//             ...prev,
//             featured_image: 'L\'image ne doit pas dépasser 5MB'
//           }));
//           return;
//         }

//         setFormData({
//           ...formData,
//           [name]: files[0]
//         });
        
//         // Créer une preview
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setPreviewImage(reader.result);
//         };
//         reader.readAsDataURL(files[0]);
        
//       } else if (name === 'project_zip' && files[0]) {
//         // Vérifier que c'est un fichier ZIP
//         if (!files[0].name.toLowerCase().endsWith('.zip')) {
//           setValidationErrors(prev => ({
//             ...prev,
//             project_zip: 'Veuillez sélectionner un fichier ZIP (.zip)'
//           }));
//           setMessage({
//             type: 'error',
//             text: 'Format de fichier incorrect',
//             details: 'Seuls les fichiers .zip sont acceptés'
//           });
//           return;
//         }
        
//         // Vérifier la taille (max 50MB)
//         if (files[0].size > 50 * 1024 * 1024) {
//           setValidationErrors(prev => ({
//             ...prev,
//             project_zip: 'Le fichier ZIP ne doit pas dépasser 50MB'
//           }));
//           setMessage({
//             type: 'error',
//             text: 'Fichier trop volumineux',
//             details: 'Le fichier ZIP doit faire moins de 50MB'
//           });
//           return;
//         }
        
//         setFormData({
//           ...formData,
//           [name]: files[0]
//         });
//         setZipFileName(files[0].name);
        
//       } else if (name === 'screenshots') {
//         const screenshotsArray = Array.from(files);
        
//         // Validation des screenshots
//         const invalidFiles = screenshotsArray.filter(file => 
//           !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024
//         );
        
//         if (invalidFiles.length > 0) {
//           setValidationErrors(prev => ({
//             ...prev,
//             screenshots: 'Chaque image doit être inférieure à 5MB'
//           }));
//           return;
//         }
        
//         if (screenshotsArray.length > 10) {
//           setValidationErrors(prev => ({
//             ...prev,
//             screenshots: 'Maximum 10 images autorisées'
//           }));
//           return;
//         }
        
//         setFormData({
//           ...formData,
//           [name]: screenshotsArray
//         });
//       }
//     } else if (name === 'technologies') {
//       const selectedTechs = Array.from(e.target.selectedOptions, option => option.value);
//       setFormData({ ...formData, technologies: selectedTechs });
//     } else {
//       // Validation pour les URLs
//       if ((name === 'demo_url' || name === 'github_url' || name === 'documentation_url') && value) {
//         try {
//           new URL(value);
//         } catch (e) {
//           setValidationErrors(prev => ({
//             ...prev,
//             [name]: 'URL invalide'
//           }));
//         }
//       }
      
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const validateForm = () => {
//     const errors = {};
    
//     if (!formData.title.trim()) {
//       errors.title = 'Le titre est requis';
//     } else if (formData.title.length < 3) {
//       errors.title = 'Le titre doit contenir au moins 3 caractères';
//     }
    
//     if (!formData.description.trim()) {
//       errors.description = 'La description est requise';
//     } else if (formData.description.length < 50) {
//       errors.description = 'La description doit contenir au moins 50 caractères';
//     }
    
//     if (!formData.project_zip) {
//       errors.project_zip = 'Le fichier ZIP est requis';
//     }
    
//     if (formData.demo_url && !formData.demo_url.startsWith('http')) {
//       errors.demo_url = 'URL invalide';
//     }
    
//     if (formData.github_url && !formData.github_url.startsWith('http')) {
//       errors.github_url = 'URL invalide';
//     }

//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       setMessage({
//         type: 'error',
//         text: 'Veuillez corriger les erreurs dans le formulaire'
//       });
//       return;
//     }

//     // Vérifier l'authentification
//     if (!authService.isAuthenticated()) {
//       setMessage({
//         type: 'error',
//         text: 'Session expirée',
//         details: 'Veuillez vous reconnecter'
//       });
//       setTimeout(() => {
//         sessionStorage.setItem('redirectAfterLogin', '/admin/submit-project');
//         navigate('/login');
//       }, 2000);
//       return;
//     }

//     setLoading(true);
//     setMessage({ type: '', text: '', details: '' });

//     try {
//       const token = authService.getAccessToken();
//       const user = authService.getCurrentUser();
      
//       console.log('🔑 Token:', token ? 'Présent' : 'Absent');
//       console.log('👤 Utilisateur:', user);

//       if (!token) {
//         throw new Error('Token non disponible');
//       }

//       // Vérifier si l'API est accessible
//       try {
//         await fetch('http://localhost:8000/api/projects/', {
//           method: 'OPTIONS'
//         });
//       } catch (testError) {
//         throw new Error('Serveur Django inaccessible. Vérifiez qu\'il est démarré sur http://localhost:8000');
//       }

//       // Créer FormData
//       const submitData = new FormData();
      
//       // Ajouter tous les champs
//       submitData.append('title', formData.title.trim());
//       submitData.append('description', formData.description.trim());
//       submitData.append('category', formData.category);
//       submitData.append('status', formData.status === 'draft' ? 'pending' : formData.status);
//       submitData.append('tags', formData.tags.trim());
//       submitData.append('demo_url', formData.demo_url.trim());
//       submitData.append('github_url', formData.github_url.trim());
//       submitData.append('documentation_url', formData.documentation_url.trim());
      
//       // Technologies comme JSON string
//       submitData.append('technologies', JSON.stringify(formData.technologies));
      
//       // Ajouter l'utilisateur
//       if (user && user.id) {
//         submitData.append('author', user.id);
//       }

//       // Ajouter les fichiers
//       if (formData.featured_image) {
//         submitData.append('featured_image', formData.featured_image);
//       }
      
//       if (formData.project_zip) {
//         submitData.append('project_zip', formData.project_zip);
//       }
      
//       // Ajouter les screenshots
//       if (formData.screenshots && formData.screenshots.length > 0) {
//         formData.screenshots.forEach((file) => {
//           submitData.append('screenshots', file);
//         });
//       }

//       // Utiliser l'URL complète de l'API
//       const API_URL = 'http://localhost:8000/api/projects/';
      
//       const response = await axios.post(API_URL, submitData, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//         timeout: 120000, // 2 minutes timeout
//       });

//       console.log('✅ Réponse API:', response.data);

//       setMessage({
//         type: 'success',
//         text: `✅ Projet "${response.data.title}" créé avec succès!`,
//         details: 'Redirection vers la page de confirmation...'
//       });

//       // Réinitialiser le formulaire
//       setFormData({
//         title: '',
//         description: '',
//         category: 'web',
//         status: 'draft',
//         tags: '',
//         demo_url: '',
//         github_url: '',
//         documentation_url: '',
//         technologies: [],
//         featured_image: null,
//         project_zip: null,
//         screenshots: [],
//       });
//       setPreviewImage(null);
//       setZipFileName('');

//       // Rediriger vers la page de succès
//       setTimeout(() => {
//         // Navigation relative dans le contexte admin
//         navigate('projects/success', { 
//           state: { 
//             projectId: response.data.id,
//             projectTitle: response.data.title,
//             projectData: response.data
//           },
//           replace: true
//         });
//       }, 1500);

//     } catch (error) {
//       console.error('❌ Erreur:', error);
      
//       let errorMessage = 'Erreur lors de la création du projet';
//       let errorDetails = '';
      
//       if (error.response) {
//         console.error('📊 Statut:', error.response.status);
//         console.error('📊 Données:', error.response.data);
        
//         if (error.response.status === 401) {
//           errorMessage = 'Session expirée';
//           errorDetails = 'Veuillez vous reconnecter';
          
//           // Déconnexion
//           authService.logout();
//           setTimeout(() => {
//             sessionStorage.setItem('redirectAfterLogin', '/admin/submit-project');
//             navigate('/login');
//           }, 2000);
          
//         } else if (error.response.status === 400) {
//           errorMessage = 'Erreur de validation';
//           const errors = error.response.data;
//           errorDetails = Object.keys(errors).map(key => 
//             `${key}: ${Array.isArray(errors[key]) ? errors[key].join(', ') : errors[key]}`
//           ).join(' | ');
          
//         } else if (error.response.status === 403) {
//           errorMessage = 'Permission refusée';
//           errorDetails = 'Vous n\'avez pas les droits pour créer un projet';
          
//         } else if (error.response.status === 413) {
//           errorMessage = 'Fichier trop volumineux';
//           errorDetails = 'Le fichier ZIP dépasse la limite de 50MB';
          
//         } else if (error.response.status === 415) {
//           errorMessage = 'Type de fichier non supporté';
//           errorDetails = 'Seuls les fichiers ZIP sont acceptés';
          
//         } else {
//           errorMessage = error.response.data.detail || errorMessage;
//         }
        
//       } else if (error.request) {
//         errorMessage = 'Serveur inaccessible';
//         errorDetails = 'Vérifiez que Django tourne sur http://localhost:8000';
        
//       } else {
//         errorMessage = error.message;
//       }
      
//       setMessage({
//         type: 'error',
//         text: errorMessage,
//         details: errorDetails
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addTechnology = (tech) => {
//     if (!formData.technologies.includes(tech)) {
//       setFormData({
//         ...formData,
//         technologies: [...formData.technologies, tech]
//       });
//     }
//   };

//   const removeTechnology = (techToRemove) => {
//     setFormData({
//       ...formData,
//       technologies: formData.technologies.filter(tech => tech !== techToRemove)
//     });
//   };

//   const handleSaveDraft = async () => {
//     try {
//       const token = authService.getAccessToken();
//       const user = authService.getCurrentUser();
      
//       if (!token) {
//         setMessage({
//           type: 'error',
//           text: 'Session expirée',
//           details: 'Veuillez vous reconnecter'
//         });
//         return;
//       }

//       const draftData = {
//         title: formData.title || 'Brouillon sans titre',
//         description: formData.description,
//         category: formData.category,
//         status: 'draft',
//         tags: formData.tags,
//         demo_url: formData.demo_url,
//         github_url: formData.github_url,
//         documentation_url: formData.documentation_url,
//         technologies: formData.technologies,
//         author: user?.id
//       };

//       const response = await axios.post('http://localhost:8000/api/projects/', draftData, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         }
//       });

//       setMessage({
//         type: 'success',
//         text: `✅ Brouillon "${response.data.title}" sauvegardé!`,
//         details: 'Vous pourrez le compléter plus tard.'
//       });

//       // Réinitialiser partiellement
//       setFormData({
//         ...formData,
//         title: '',
//         description: '',
//         tags: '',
//         demo_url: '',
//         github_url: '',
//         documentation_url: '',
//         technologies: [],
//         featured_image: null,
//         project_zip: null,
//         screenshots: [],
//       });
//       setPreviewImage(null);
//       setZipFileName('');

//     } catch (error) {
//       console.error('Erreur sauvegarde brouillon:', error);
//       setMessage({
//         type: 'error',
//         text: 'Erreur lors de la sauvegarde',
//         details: error.response?.data?.detail || error.message
//       });
//     }
//   };

//   const handleQuickLogin = async () => {
//     try {
//       setMessage({
//         type: 'info',
//         text: 'Connexion rapide en cours...',
//         details: ''
//       });
      
//       await authService.quickLogin();
//       setIsAuthenticated(true);
      
//       setMessage({
//         type: 'success',
//         text: 'Connecté avec succès!',
//         details: 'Vous pouvez maintenant déposer votre projet.'
//       });
      
//     } catch (error) {
//       setMessage({
//         type: 'error',
//         text: 'Échec de la connexion rapide',
//         details: error.message
//       });
//     }
//   };

//   // Si non authentifié, afficher un message
//   if (!isAuthenticated) {
//     return (
//       <div className="max-w-6xl mx-auto p-6">
//         <div className="bg-white dark:bg-[#0d1a29] rounded-xl shadow-lg p-8 text-center">
//           <div className="text-5xl mb-6">🔒</div>
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
//             Accès non autorisé
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 mb-6">
//             Vous devez être connecté pour déposer un projet.
//           </p>
          
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button
//               onClick={() => navigate('/login', { 
//                 state: { from: '/admin/submit-project' } 
//               })}
//               className="px-6 py-3 bg-[#E30613] text-white rounded-lg hover:bg-[#c40511] transition-colors font-medium"
//             >
//               Se connecter
//             </button>
            
//             <button
//               onClick={handleQuickLogin}
//               className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
//             >
//               Connexion rapide (admin)
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-[#001F3F] dark:text-white mb-2">
//           Déposer un Nouveau Projet
//         </h1>
//         <p className="text-gray-600 dark:text-gray-400">
//           Connecté en tant que <span className="font-semibold text-[#E30613]">
//             {authService.getCurrentUser()?.username || 'Utilisateur'}
//           </span>
//         </p>
//       </div>

//       {message.text && (
//         <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' : message.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'}`}>
//           <div className="flex items-start gap-3">
//             <span className={`material-symbols-outlined mt-0.5 ${message.type === 'success' ? 'text-green-600' : message.type === 'error' ? 'text-red-600' : 'text-blue-600'}`}>
//               {message.type === 'success' ? 'check_circle' : message.type === 'error' ? 'error' : 'info'}
//             </span>
//             <div>
//               <p className="font-medium">{message.text}</p>
//               {message.details && (
//                 <p className="text-sm mt-1 opacity-80">{message.details}</p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="bg-white dark:bg-[#0d1a29] rounded-xl shadow-lg p-6">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Colonne 1: Informations de base */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Titre */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Titre du Projet *
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 required
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-800 dark:text-white ${
//                   validationErrors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
//                 }`}
//                 placeholder="Ex: Plateforme E-commerce Simplon"
//               />
//               {validationErrors.title && (
//                 <p className="text-sm text-red-600 dark:text-red-400 mt-1">{validationErrors.title}</p>
//               )}
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Description *
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 required
//                 rows="6"
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-800 dark:text-white ${
//                   validationErrors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
//                 }`}
//                 placeholder="Décrivez votre projet en détail..."
//               />
//               {validationErrors.description && (
//                 <p className="text-sm text-red-600 dark:text-red-400 mt-1">{validationErrors.description}</p>
//               )}
//             </div>

//             {/* Catégorie et Statut */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Catégorie *
//                 </label>
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-800 dark:text-white"
//                 >
//                   {categories.map(cat => (
//                     <option key={cat.value} value={cat.value}>{cat.label}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Statut *
//                 </label>
//                 <select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-800 dark:text-white"
//                 >
//                   {statuses.map(status => (
//                     <option key={status.value} value={status.value}>{status.label}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Tags */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Tags (séparés par des virgules)
//               </label>
//               <input
//                 type="text"
//                 name="tags"
//                 value={formData.tags}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-800 dark:text-white"
//                 placeholder="Ex: ecommerce, react, django, postgresql"
//               />
//               <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//                 Ces tags aideront à la recherche et au filtrage
//               </p>
//             </div>

//             {/* Technologies */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Technologies utilisées
//               </label>
//               <div className="flex flex-wrap gap-2 mb-3">
//                 {formData.technologies.map(tech => (
//                   <span
//                     key={tech}
//                     className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
//                   >
//                     {tech}
//                     <button
//                       type="button"
//                       onClick={() => removeTechnology(tech)}
//                       className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
//                     >
//                       ×
//                     </button>
//                   </span>
//                 ))}
//               </div>
//               <select
//                 name="technologies"
//                 onChange={(e) => {
//                   if (e.target.value) {
//                     addTechnology(e.target.value);
//                     e.target.value = '';
//                   }
//                 }}
//                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-800 dark:text-white"
//                 multiple={false}
//               >
//                 <option value="">Ajouter une technologie...</option>
//                 {technologiesList.map(tech => (
//                   <option key={tech} value={tech}>{tech}</option>
//                 ))}
//               </select>
//               <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//                 Cliquez sur une technologie pour l'ajouter
//               </p>
//             </div>
//           </div>

//           {/* Colonne 2: Fichiers et Liens */}
//           <div className="space-y-6">
//             {/* Image principale */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Image principale
//               </label>
//               <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
//                 {previewImage ? (
//                   <div className="relative">
//                     <img 
//                       src={previewImage} 
//                       alt="Preview" 
//                       className="w-full h-48 object-cover rounded-lg"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setFormData({...formData, featured_image: null});
//                         setPreviewImage(null);
//                       }}
//                       className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ) : (
//                   <div>
//                     <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">
//                       image
//                     </span>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Cliquez pour uploader une image
//                     </p>
//                   </div>
//                 )}
//                 <input
//                   type="file"
//                   name="featured_image"
//                   onChange={handleChange}
//                   accept="image/*"
//                   className="hidden"
//                   id="featured-image"
//                 />
//                 <label
//                   htmlFor="featured-image"
//                   className="inline-block mt-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer text-sm"
//                 >
//                   Choisir une image
//                 </label>
//                 {validationErrors.featured_image && (
//                   <p className="text-sm text-red-600 dark:text-red-400 mt-1">
//                     {validationErrors.featured_image}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Fichier ZIP du projet */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Fichier du projet (ZIP) *
//               </label>
//               <div className={`border-2 ${!formData.project_zip ? 'border-dashed' : ''} ${
//                 validationErrors.project_zip 
//                   ? 'border-red-500 dark:border-red-500' 
//                   : formData.project_zip 
//                     ? 'border-green-500 dark:border-green-600' 
//                     : 'border-gray-300 dark:border-gray-600'
//               } rounded-lg p-4 text-center`}>
//                 {zipFileName ? (
//                   <div className="relative">
//                     <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
//                       <div className="flex items-center justify-center gap-2">
//                         <span className="material-symbols-outlined text-green-600 dark:text-green-400">
//                           folder_zip
//                         </span>
//                         <div className="text-left">
//                           <p className="font-medium text-green-800 dark:text-green-300 truncate">
//                             {zipFileName}
//                           </p>
//                           <p className="text-xs text-green-600 dark:text-green-400">
//                             {formData.project_zip ? Math.round(formData.project_zip.size / 1024 / 1024 * 100) / 100 + ' MB' : 'Fichier ZIP sélectionné'}
//                           </p>
//                         </div>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setFormData({...formData, project_zip: null});
//                           setZipFileName('');
//                         }}
//                         className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
//                       >
//                         ×
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div>
//                     <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">
//                       folder_zip
//                     </span>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Téléversez votre projet (fichier ZIP)
//                     </p>
//                   </div>
//                 )}
//                 <input
//                   type="file"
//                   name="project_zip"
//                   onChange={handleChange}
//                   accept=".zip,application/zip"
//                   className="hidden"
//                   id="project-zip"
//                   required
//                 />
//                 <label
//                   htmlFor="project-zip"
//                   className={`inline-block mt-2 px-4 py-2 rounded-lg cursor-pointer text-sm ${
//                     zipFileName 
//                       ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
//                       : 'bg-[#E30613] text-white hover:bg-[#c40511]'
//                   }`}
//                 >
//                   {zipFileName ? 'Changer le fichier' : 'Sélectionner un ZIP'}
//                 </label>
//                 {validationErrors.project_zip && (
//                   <p className="text-sm text-red-600 dark:text-red-400 mt-1">
//                     {validationErrors.project_zip}
//                   </p>
//                 )}
//               </div>
//               <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1">
//                 <p>• Format accepté : .zip uniquement</p>
//                 <p>• Taille max : 50MB</p>
//                 <p>• Structure recommandée :</p>
//                 <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs mt-1">
// projet/<br/>
// ├── src/<br/>
// ├── package.json<br/>
// ├── README.md<br/>
// └── ...
//                 </pre>
//               </div>
//             </div>

//             {/* Liens */}
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   URL de démo
//                 </label>
//                 <input
//                   type="url"
//                   name="demo_url"
//                   value={formData.demo_url}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-800 dark:text-white ${
//                     validationErrors.demo_url ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
//                   }`}
//                   placeholder="https://demo.votre-projet.com"
//                 />
//                 {validationErrors.demo_url && (
//                   <p className="text-sm text-red-600 dark:text-red-400 mt-1">{validationErrors.demo_url}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   URL GitHub
//                 </label>
//                 <input
//                   type="url"
//                   name="github_url"
//                   value={formData.github_url}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-800 dark:text-white ${
//                     validationErrors.github_url ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
//                   }`}
//                   placeholder="https://github.com/username/projet"
//                 />
//                 {validationErrors.github_url && (
//                   <p className="text-sm text-red-600 dark:text-red-400 mt-1">{validationErrors.github_url}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Documentation
//                 </label>
//                 <input
//                   type="url"
//                   name="documentation_url"
//                   value={formData.documentation_url}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E30613] focus:border-transparent dark:bg-gray-800 dark:text-white ${
//                     validationErrors.documentation_url ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
//                   }`}
//                   placeholder="https://docs.votre-projet.com"
//                 />
//                 {validationErrors.documentation_url && (
//                   <p className="text-sm text-red-600 dark:text-red-400 mt-1">{validationErrors.documentation_url}</p>
//                 )}
//               </div>
//             </div>

//             {/* Screenshots */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Captures d'écran
//               </label>
//               <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
//                 <span className="material-symbols-outlined text-gray-400 text-3xl mb-2">
//                   collections
//                 </span>
//                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
//                   {formData.screenshots.length > 0 
//                     ? `${formData.screenshots.length} image(s) sélectionnée(s)`
//                     : 'Ajouter des captures d\'écran'
//                   }
//                 </p>
//                 <input
//                   type="file"
//                   name="screenshots"
//                   onChange={handleChange}
//                   accept="image/*"
//                   multiple
//                   className="hidden"
//                   id="screenshots"
//                 />
//                 <label
//                   htmlFor="screenshots"
//                   className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer text-sm"
//                 >
//                   {formData.screenshots.length > 0 ? 'Ajouter plus' : 'Sélectionner'}
//                 </label>
//                 {formData.screenshots.length > 0 && (
//                   <button
//                     type="button"
//                     onClick={() => setFormData({...formData, screenshots: []})}
//                     className="ml-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 text-sm"
//                   >
//                     Tout effacer
//                   </button>
//                 )}
//                 {validationErrors.screenshots && (
//                   <p className="text-sm text-red-600 dark:text-red-400 mt-1">
//                     {validationErrors.screenshots}
//                   </p>
//                 )}
//               </div>
//               <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//                 Maximum 10 images, 5MB par image
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Boutons de soumission */}
//         <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
//           <button
//             type="button"
//             onClick={handleSaveDraft}
//             disabled={loading}
//             className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//           >
//             <span className="material-symbols-outlined">save</span>
//             Enregistrer comme brouillon
//           </button>
//           <button
//             type="submit"
//             disabled={loading || !formData.project_zip || !formData.title || !formData.description}
//             className="px-6 py-3 bg-[#E30613] text-white rounded-lg hover:bg-[#c40511] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <span className="material-symbols-outlined animate-spin">
//                   refresh
//                 </span>
//                 Publication en cours...
//               </>
//             ) : (
//               <>
//                 <span className="material-symbols-outlined">
//                   upload
//                 </span>
//                 {formData.project_zip ? 'Publier le projet' : 'Sélectionnez un fichier ZIP'}
//               </>
//             )}
//           </button>
//         </div>

//         {/* Indicateur de validation */}
//         <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
//           <div className="flex items-center gap-4">
//             <div className={`flex items-center gap-1 ${!formData.project_zip ? 'text-red-600' : 'text-green-600'}`}>
//               <span className="material-symbols-outlined text-sm">
//                 {!formData.project_zip ? 'close' : 'check_circle'}
//               </span>
//               <span>Fichier ZIP</span>
//             </div>
//             <div className={`flex items-center gap-1 ${!formData.title ? 'text-red-600' : 'text-green-600'}`}>
//               <span className="material-symbols-outlined text-sm">
//                 {!formData.title ? 'close' : 'check_circle'}
//               </span>
//               <span>Titre</span>
//             </div>
//             <div className={`flex items-center gap-1 ${!formData.description ? 'text-red-600' : formData.description.length < 50 ? 'text-yellow-600' : 'text-green-600'}`}>
//               <span className="material-symbols-outlined text-sm">
//                 {!formData.description ? 'close' : formData.description.length < 50 ? 'warning' : 'check_circle'}
//               </span>
//               <span>Description</span>
//             </div>
//           </div>
//           <button
//             type="button"
//             onClick={() => {
//               console.log('🔍 Debug:', {
//                 user: authService.getCurrentUser(),
//                 token: authService.getAccessToken(),
//                 formData: formData
//               });
//             }}
//             className="text-xs text-gray-500 hover:text-gray-700"
//           >
//             Debug
//           </button>
//         </div>
//       </form>

//       {/* Aide */}
//       <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
//         <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
//           <span className="material-symbols-outlined">info</span>
//           Instructions pour le dépôt de projet
//         </h3>
//         <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-2 list-disc pl-5">
//           <li>
//             <strong>Fichier ZIP requis :</strong> Compressez votre projet complet dans un fichier .zip
//           </li>
//           <li>
//             <strong>Structure recommandée :</strong> Incluez tous les fichiers sources, documentation et dépendances
//           </li>
//           <li>
//             <strong>Validation :</strong> Le fichier sera extrait et vérifié automatiquement
//           </li>
//           <li>
//             <strong>Limites :</strong> 50MB maximum, pas de fichiers exécutables dangereux
//           </li>
//           <li>
//             <strong>Conseil :</strong> Incluez un README.md détaillé dans votre archive
//           </li>
//         </ul>
//       </div>

//       {/* Section test API */}
//       <div className="mt-4 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
//         <button
//           onClick={async () => {
//             try {
//               const response = await fetch('http://localhost:8000/api/projects/', {
//                 method: 'OPTIONS'
//               });
//               alert(`✅ API accessible!\nStatus: ${response.status}\n\nVous pouvez soumettre votre projet.`);
//             } catch (error) {
//               alert(`❌ API inaccessible!\n\n${error.message}\n\nVérifiez que Django est démarré sur http://localhost:8000`);
//             }
//           }}
//           className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 flex items-center gap-1"
//         >
//           <span className="material-symbols-outlined text-sm">wifi</span>
//           Tester la connexion API
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SubmitProject;


// // src/SubmitProject.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import { projectService } from '../../services/projects';      // CORRIGÉ
// import authService from '../../services/auth';                 // CORRIGÉ
// import { useProjects } from '../../context/ProjectContext';    // CORRIGÉ

// const SubmitProject = () => {
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
//     console.log('👤 UTILISATEUR - Connecté:', currentUser);
    
//     if (!currentUser) {
//       console.log('⚠️ Aucun utilisateur connecté, redirection vers login');
//       navigate('/login');
//       return;
//     }
    
//     setUser(currentUser);
    
//     // Pré-remplir la cohorte avec celle de l'utilisateur si disponible
//     if (currentUser?.cohort) {
//       setFormData(prev => ({
//         ...prev,
//         cohort: currentUser.cohort
//       }));
//     }

//     // Vérifier si on est en mode édition
//     const editId = searchParams.get('edit');
//     if (editId) {
//       loadProjectForEdit(editId);
//     }
//   }, [searchParams, navigate]);

//   const loadProjectForEdit = async (projectId) => {
//     try {
//       console.log('📥 Chargement du projet pour édition:', projectId);
//       const project = await projectService.getProjectDetails(projectId);
      
//       if (!project) {
//         throw new Error('Projet non trouvé');
//       }
      
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
      
//       console.log('✅ Projet chargé pour édition:', project.title);
//     } catch (err) {
//       console.error('❌ Erreur chargement projet:', err);
//       setError('Erreur lors du chargement du projet');
//       setTimeout(() => navigate('/dashboard'), 2000);
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
//     if (!selectedFile) return;
    
//     if (selectedFile.size > 50 * 1024 * 1024) {
//       setError('Le fichier est trop volumineux. Taille maximum: 50MB');
//       return;
//     }
    
//     if (!selectedFile.name.toLowerCase().endsWith('.zip')) {
//       setError('Veuillez sélectionner un fichier ZIP');
//       return;
//     }

//     setFile(selectedFile);
//     setError('');
//     console.log('📦 Fichier sélectionné:', selectedFile.name);
//   };

//   const handleImageChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (!selectedFile) return;
    
//     if (selectedFile.size > 5 * 1024 * 1024) {
//       setError('L\'image est trop volumineuse. Taille maximum: 5MB');
//       return;
//     }
    
//     const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
//     if (!validTypes.includes(selectedFile.type)) {
//       setError('Format d\'image non supporté. Utilisez JPG, PNG ou GIF');
//       return;
//     }

//     setImageFile(selectedFile);
//     setError('');
//     console.log('🖼️ Image sélectionnée:', selectedFile.name);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     console.log('🚀 Début de la soumission du projet');
    
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

//     // Vérification de l'utilisateur connecté
//     if (!user || !user.id) {
//       setError('Vous devez être connecté pour créer ou modifier un projet');
//       console.error('❌ Aucun utilisateur connecté');
//       return;
//     }

//     setIsUploading(true);
//     setUploadProgress(10);

//     try {
//       // Préparation des données
//       const projectData = {
//         title: formData.title.trim(),
//         technologies: formData.technologies.trim(),
//         description: formData.description.trim(),
//         cohort: formData.cohort.trim(),
//         tags: formData.tags.trim(),
//         github_url: formData.github_url.trim(),
//         demo_url: formData.demo_url.trim(),
//         author: user.id
//       };

//       console.log('📋 Données du projet:', projectData);
//       setUploadProgress(30);

//       let project;

//       if (isEditing) {
//         // Mise à jour du projet existant
//         console.log('✏️ Mise à jour du projet:', editProjectId);
        
//         // Ajouter l'image si une nouvelle est fournie
//         if (imageFile) {
//           projectData.image = imageFile;
//         }
        
//         // Simuler progression
//         setUploadProgress(60);
        
//         // Appel API pour mise à jour
//         project = await projectService.updateProject(editProjectId, projectData);
//         updateProject(project);
        
//         setUploadProgress(100);
//         console.log('✅ Projet modifié avec succès:', project.title);
        
//         // Redirection vers le succès
//         setTimeout(() => {
//           navigate('/project-success', { 
//             state: { 
//               project: project,
//               isEditing: true
//             } 
//           });
//         }, 500);

//       } else {
//         // Création d'un nouveau projet
//         console.log('🆕 Création d\'un nouveau projet');
        
//         // Ajouter les fichiers
//         if (file) {
//           projectData.zip_file = file;
//         }
//         if (imageFile) {
//           projectData.image = imageFile;
//         }
        
//         setUploadProgress(50);
        
//         // Appel API pour création
//         const createdProject = await projectService.createProject(projectData);
//         project = createdProject;

//         setUploadProgress(80);
        
//         // Validation de l'ID reçu
//         if (!project.id) {
//           console.warn('⚠️ Aucun ID reçu après création, génération d\'un ID temporaire');
//           project.id = `temp_${Date.now()}`;
//         }
        
//         // Ajouter au contexte global
//         addProject(project);
        
//         setUploadProgress(100);
//         console.log('✅ Projet créé avec succès:', project.title);
        
//         // Redirection vers le succès
//         setTimeout(() => {
//           navigate('/project-success', { 
//             state: { 
//               project: project,
//               isEditing: false
//             } 
//           });
//         }, 500);
//       }

//     } catch (err) {
//       console.error('❌ Erreur lors de la soumission:', err);
      
//       let errorMessage = `Erreur lors de ${isEditing ? 'la modification' : 'la création'} du projet`;
      
//       if (err.response?.data) {
//         const errors = err.response.data;
        
//         if (typeof errors === 'object') {
//           const errorDetails = Object.entries(errors)
//             .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
//             .join('; ');
//           errorMessage = `Erreurs de validation: ${errorDetails}`;
//         } else if (typeof errors === 'string') {
//           if (errors.includes('<!DOCTYPE html>')) {
//             errorMessage = 'Erreur serveur - Veuillez réessayer plus tard';
//           } else {
//             errorMessage = errors;
//           }
//         }
//       } else if (err.message) {
//         errorMessage = err.message;
//       }
      
//       setError(errorMessage);
//       setUploadProgress(0);
//     } finally {
//       if (!error) {
//         setIsUploading(false);
//       }
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
//     console.log('🔄 Formulaire réinitialisé');
//   };

//   const getUserAvatar = () => {
//     if (user?.profile_picture) {
//       return user.profile_picture;
//     }
//     if (user?.avatar) {
//       return user.avatar;
//     }
//     return "https://lh3.googleusercontent.com/aida-public/A6AXuA8VxS_x8jwDh_tF-ygq2OirDNuL2iAY7iNaZiMUFP0ulnWyCKEm_PI1Gc0ciC2TN952cGudRb6wvbJbWPWVGo903BPnvhSXGPboDyDNJD8iZzXEJfiOfRe0gXFHiPnJlAg73UmjlUMXqsg7hI0ME57JNKDz_c82g19tlQb4FmCTdsxqi8jz0nMLTwlAIUvOj4x0iE62XhOCawgbKi0PPQiv7Cz6CfFpzMGaxuCg9bUKa62_BIjWKT5M4ZTd9MB-KOhIR0FHkzz25w";
//   };

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

//   const getUserCohort = () => {
//     return user?.cohort || 'Stagiaire Simplon';
//   };

//   // Si pas d'utilisateur, afficher un loader
//   if (!user) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 dark:text-gray-400">Chargement de votre session...</p>
//         </div>
//       </div>
//     );
//   }

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
//                 to="/submit-project" 
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
//                   {isEditing ? 'Modifier le Projet' : 'Soumettre un Projet'}
//                 </h1>
//                 <p className="text-gray-500 dark:text-gray-400 mt-1">
//                   {isEditing 
//                     ? 'Modifiez les informations de votre projet existant' 
//                     : 'Partagez votre création avec la communauté Simplon.'}
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
//                     placeholder="Ex: React, Node.js, MongoDB, Tailwind CSS..."
//                     value={formData.technologies}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
//                     required
//                     disabled={isUploading}
//                   />
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                     Séparez les technologies par des virgules
//                   </p>
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="description">
//                     Description détaillée
//                   </label>
//                   <textarea
//                     id="description"
//                     placeholder="Décrivez votre projet, ses fonctionnalités, les défis techniques..."
//                     rows="4"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors resize-none"
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
//                   </div>
                  
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="tags">
//                       Tags ou mots-clés
//                     </label>
//                     <input
//                       id="tags"
//                       type="text"
//                       placeholder="portfolio, api, data-visualisation, e-commerce"
//                       value={formData.tags}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
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
//                           ✓ {imageFile.name}
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
//                           Archive ZIP (max. 50MB)
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
//                             {isUploading ? '📤 Envoi...' : '✅ Prêt'}
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
//                           <span>{isEditing ? 'Modifier le projet' : 'Soumettre le projet'}</span>
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
//                       Conseils pour une bonne soumission
//                     </h3>
//                     <ul className="text-blue-700 dark:text-blue-400 text-sm space-y-1">
//                       <li>• Incluez un README.md avec les instructions d'installation</li>
//                       <li>• Vérifiez que toutes les dépendances sont listées</li>
//                       <li>• Testez votre projet avant de le soumettre</li>
//                       <li>• Ajoutez une image de présentation</li>
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

// export default SubmitProject;


// // src/components/admin/SubmitProject.jsx - VERSION CORRIGÉE
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import { projectService } from '../../services/projects';
// import authService from '../../services/auth';
// import { useProjects } from '../../context/ProjectContext';

// const SubmitProject = () => {
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
//     console.log('👤 UTILISATEUR - Connecté:', currentUser);
    
//     if (!currentUser) {
//       console.log('⚠️ Aucun utilisateur connecté, redirection vers login');
//       navigate('/login');
//       return;
//     }
    
//     setUser(currentUser);
    
//     // Pré-remplir la cohorte avec celle de l'utilisateur si disponible
//     if (currentUser?.cohort) {
//       setFormData(prev => ({
//         ...prev,
//         cohort: currentUser.cohort
//       }));
//     }

//     // Vérifier si on est en mode édition
//     const editId = searchParams.get('edit');
//     if (editId) {
//       loadProjectForEdit(editId);
//     }
//   }, [searchParams, navigate]);

//   const loadProjectForEdit = async (projectId) => {
//     try {
//       console.log('📥 Chargement du projet pour édition:', projectId);
//       const project = await projectService.getProjectDetails(projectId);
      
//       if (!project) {
//         throw new Error('Projet non trouvé');
//       }
      
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
      
//       console.log('✅ Projet chargé pour édition:', project.title);
//     } catch (err) {
//       console.error('❌ Erreur chargement projet:', err);
//       setError('Erreur lors du chargement du projet');
//       setTimeout(() => navigate('/dashboard'), 2000);
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
//     if (!selectedFile) return;
    
//     if (selectedFile.size > 50 * 1024 * 1024) {
//       setError('Le fichier est trop volumineux. Taille maximum: 50MB');
//       return;
//     }
    
//     if (!selectedFile.name.toLowerCase().endsWith('.zip')) {
//       setError('Veuillez sélectionner un fichier ZIP');
//       return;
//     }

//     setFile(selectedFile);
//     setError('');
//     console.log('📦 Fichier sélectionné:', selectedFile.name);
//   };

//   const handleImageChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (!selectedFile) return;
    
//     if (selectedFile.size > 5 * 1024 * 1024) {
//       setError('L\'image est trop volumineuse. Taille maximum: 5MB');
//       return;
//     }
    
//     const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
//     if (!validTypes.includes(selectedFile.type)) {
//       setError('Format d\'image non supporté. Utilisez JPG, PNG ou GIF');
//       return;
//     }

//     setImageFile(selectedFile);
//     setError('');
//     console.log('🖼️ Image sélectionnée:', selectedFile.name);
//   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError('');
// //     console.log('🚀 Début de la soumission du projet');
    
// //     // Validation de base
// //     if (!formData.title.trim()) {
// //       setError('Veuillez saisir un nom pour votre projet');
// //       return;
// //     }

// //     if (!formData.technologies.trim()) {
// //       setError('Veuillez saisir les technologies utilisées');
// //       return;
// //     }

// //     if (!isEditing && !file) {
// //       setError('Veuillez sélectionner un fichier ZIP');
// //       return;
// //     }

// //     // Vérification de l'utilisateur connecté
// //     if (!user || !user.id) {
// //       setError('Vous devez être connecté pour créer ou modifier un projet');
// //       console.error('❌ Aucun utilisateur connecté');
// //       return;
// //     }

// //     setIsUploading(true);
// //     setUploadProgress(10);

// //     try {
// //       // Préparation des données
// //       const projectData = {
// //         title: formData.title.trim(),
// //         technologies: formData.technologies.trim(),
// //         description: formData.description.trim(),
// //         cohort: formData.cohort.trim(),
// //         tags: formData.tags.trim(),
// //         github_url: formData.github_url.trim(),
// //         demo_url: formData.demo_url.trim(),
// //         author: user.id
// //       };

// //       console.log('📋 Données du projet:', projectData);
// //       setUploadProgress(30);

// //       let project;

// //       if (isEditing) {
// //         // Mise à jour du projet existant
// //         console.log('✏️ Mise à jour du projet:', editProjectId);
        
// //         // Ajouter l'image si une nouvelle est fournie
// //         if (imageFile) {
// //           projectData.image = imageFile;
// //         }
        
// //         // Simuler progression
// //         setUploadProgress(60);
        
// //         // Appel API pour mise à jour
// //         project = await projectService.updateProject(editProjectId, projectData);
// //         updateProject(project);
        
// //         setUploadProgress(100);
// //         console.log('✅ Projet modifié avec succès:', project.title);
        
// //         // Redirection vers le succès
// //         setTimeout(() => {
// //           navigate('/admin/projects/success', { 
// //             state: { 
// //               project: project,
// //               isEditing: true
// //             } 
// //           });
// //         }, 500);

// //       } else {
// //         // Création d'un nouveau projet
// //         console.log('🆕 Création d\'un nouveau projet');
        
// //         // Ajouter les fichiers
// //         if (file) {
// //           projectData.zip_file = file;
// //         }
// //         if (imageFile) {
// //           projectData.image = imageFile;
// //         }
        
// //         setUploadProgress(50);
        
// //         // Appel API pour création
// //         const createdProject = await projectService.createProject(projectData);
// //         project = createdProject;

// //         setUploadProgress(80);
        
// //         // Validation de l'ID reçu
// //         if (!project.id) {
// //           console.warn('⚠️ Aucun ID reçu après création, génération d\'un ID temporaire');
// //           project.id = `temp_${Date.now()}`;
// //         }
        
// //         // Ajouter au contexte global
// //         addProject(project);
        
// //         setUploadProgress(100);
// //         console.log('✅ Projet créé avec succès:', project.title);
        
// //         // Redirection vers le succès
// //         setTimeout(() => {
// //           navigate('/admin/projects/success', { 
// //             state: { 
// //               project: project,
// //               isEditing: false
// //             } 
// //           });
// //         }, 500);
// //       }

// //     } catch (err) {
// //       console.error('❌ Erreur lors de la soumission:', err);
      
// //       let errorMessage = `Erreur lors de ${isEditing ? 'la modification' : 'la création'} du projet`;
      
// //       if (err.response?.data) {
// //         const errors = err.response.data;
        
// //         if (typeof errors === 'object') {
// //           const errorDetails = Object.entries(errors)
// //             .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
// //             .join('; ');
// //           errorMessage = `Erreurs de validation: ${errorDetails}`;
// //         } else if (typeof errors === 'string') {
// //           if (errors.includes('<!DOCTYPE html>')) {
// //             errorMessage = 'Erreur serveur - Veuillez réessayer plus tard';
// //           } else {
// //             errorMessage = errors;
// //           }
// //         }
// //       } else if (err.message) {
// //         errorMessage = err.message;
// //       }
      
// //       setError(errorMessage);
// //       setUploadProgress(0);
// //     } finally {
// //       if (!error) {
// //         setIsUploading(false);
// //       }
// //     }
// //   };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError('');
//   console.log('🚀 Début de la soumission du projet');
  
//   // Validation de base
//   if (!formData.title.trim()) {
//     setError('Veuillez saisir un nom pour votre projet');
//     return;
//   }

//   if (!formData.technologies.trim()) {
//     setError('Veuillez saisir les technologies utilisées');
//     return;
//   }

//   if (!isEditing && !file) {
//     setError('Veuillez sélectionner un fichier ZIP');
//     return;
//   }

//   // Vérification de l'utilisateur connecté
//   if (!user || !user.id) {
//     setError('Vous devez être connecté pour créer ou modifier un projet');
//     console.error('❌ Aucun utilisateur connecté');
//     return;
//   }

//   setIsUploading(true);
//   setUploadProgress(10);

//   try {
//     // Préparation des données
//     const projectData = {
//       title: formData.title.trim(),
//       technologies: formData.technologies.trim(),
//       description: formData.description.trim(),
//       cohort: formData.cohort.trim(),
//       tags: formData.tags.trim(),
//       github_url: formData.github_url.trim(),
//       demo_url: formData.demo_url.trim(),
//       author: user.id
//     };

//     console.log('📋 Données du projet:', projectData);
//     setUploadProgress(30);

//     let project;

//     if (isEditing) {
//       // Mise à jour du projet existant
//       console.log('✏️ Mise à jour du projet:', editProjectId);
      
//       // Ajouter l'image si une nouvelle est fournie
//       if (imageFile) {
//         projectData.image = imageFile;
//       }
      
//       // Simuler progression
//       setUploadProgress(60);
      
//       // Appel API pour mise à jour
//       project = await projectService.updateProject(editProjectId, projectData);
//       updateProject(project);
      
//       setUploadProgress(100);
//       console.log('✅ Projet modifié avec succès:', project.title);
      
//       // Redirection CORRIGÉE
//       navigate('/admin/projects/success', { 
//         state: { 
//           project: project,
//           isEditing: true
//         } 
//       });

//     } else {
//       // Création d'un nouveau projet
//       console.log('🆕 Création d\'un nouveau projet');
      
//       // Ajouter les fichiers
//       if (file) {
//         projectData.zip_file = file;
//       }
//       if (imageFile) {
//         projectData.image = imageFile;
//       }
      
//       setUploadProgress(50);
      
//       // Appel API pour création
//       const createdProject = await projectService.createProject(projectData);
//       project = createdProject;

//       setUploadProgress(80);
      
//       // Validation de l'ID reçu
//       if (!project.id) {
//         console.warn('⚠️ Aucun ID reçu après création, génération d\'un ID temporaire');
//         project.id = `temp_${Date.now()}`;
//       }
      
//       // Ajouter au contexte global
//       addProject(project);
      
//       setUploadProgress(100);
//       console.log('✅ Projet créé avec succès:', project.title);
      
//       // Redirection CORRIGÉE
//       navigate('/admin/projects/success', { 
//         state: { 
//           project: project,
//           isEditing: false
//         } 
//       });
//     }

//   } catch (err) {
//     console.error('❌ Erreur lors de la soumission:', err);
    
//     let errorMessage = `Erreur lors de ${isEditing ? 'la modification' : 'la création'} du projet`;
    
//     if (err.response?.data) {
//       const errors = err.response.data;
      
//       if (typeof errors === 'object') {
//         const errorDetails = Object.entries(errors)
//           .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
//           .join('; ');
//         errorMessage = `Erreurs de validation: ${errorDetails}`;
//       } else if (typeof errors === 'string') {
//         if (errors.includes('<!DOCTYPE html>')) {
//           errorMessage = 'Erreur serveur - Veuillez réessayer plus tard';
//         } else {
//           errorMessage = errors;
//         }
//       }
//     } else if (err.message) {
//       errorMessage = err.message;
//     }
    
//     setError(errorMessage);
//     setUploadProgress(0);
//   } finally {
//     setIsUploading(false);
//   }
// };
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
//     console.log('🔄 Formulaire réinitialisé');
//   };

//   const getUserAvatar = () => {
//     if (user?.profile_picture) {
//       return user.profile_picture;
//     }
//     if (user?.avatar) {
//       return user.avatar;
//     }
//     return "https://lh3.googleusercontent.com/aida-public/A6AXuA8VxS_x8jwDh_tF-ygq2OirDNuL2iAY7iNaZiMUFP0ulnWyCKEm_PI1Gc0ciC2TN952cGudRb6wvbJbWPWVGo903BPnvhSXGPboDyDNJD8iZzXEJfiOfRe0gXFHiPnJlAg73UmjlUMXqsg7hI0ME57JNKDz_c82g19tlQb4FmCTdsxqi8jz0nMLTwlAIUvOj4x0iE62XhOCawgbKi0PPQiv7Cz6CfFpzMGaxuCg9bUKa62_BIjWKT5M4ZTd9MB-KOhIR0FHkzz25w";
//   };

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

//   const getUserCohort = () => {
//     return user?.cohort || 'Stagiaire Simplon';
//   };

//   // Si pas d'utilisateur, afficher un loader
//   if (!user) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 dark:text-gray-400">Chargement de votre session...</p>
//         </div>
//       </div>
//     );
//   }

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
//                 to="/admin" 
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
//               >
//                 <span className="material-symbols-outlined">dashboard</span>
//                 <p className="text-sm font-medium">Tableau de bord</p>
//               </Link>
//               <Link 
//                 to="/admin/submit-project" 
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-white"
//               >
//                 <span className="material-symbols-outlined">upload_file</span>
//                 <p className="text-sm font-medium">Déposer un projet</p>
//               </Link>
//               <Link 
//                 to="/admin/projects" 
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
//               >
//                 <span className="material-symbols-outlined">folder</span>
//                 <p className="text-sm font-medium">Gestion projets</p>
//               </Link>
//               <Link 
//                 to="/admin/explore" 
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
//               >
//                 <span className="material-symbols-outlined">explore</span>
//                 <p className="text-sm font-medium">Explorer</p>
//               </Link>
//             </nav>
            
//             <div className="flex flex-col gap-1">
//               <Link 
//                 to="/admin/profile" 
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
//               >
//                 <span className="material-symbols-outlined">person</span>
//                 <p className="text-sm font-medium leading-normal">Profil</p>
//               </Link>
//               <Link 
//                 to="/admin/settings" 
//                 className="flex items-center gap-3 rounded px-3 py-2 text-white/70 hover:bg-[#003265] hover:text-white"
//               >
//                 <span className="material-symbols-outlined">settings</span>
//                 <span>Paramètres</span>
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
//                   {isEditing ? 'Modifier le Projet' : 'Soumettre un Projet'}
//                 </h1>
//                 <p className="text-gray-500 dark:text-gray-400 mt-1">
//                   {isEditing 
//                     ? 'Modifiez les informations de votre projet existant' 
//                     : 'Partagez votre création avec la communauté Simplon.'}
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
//                     placeholder="Ex: React, Node.js, MongoDB, Tailwind CSS..."
//                     value={formData.technologies}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
//                     required
//                     disabled={isUploading}
//                   />
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                     Séparez les technologies par des virgules
//                   </p>
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="description">
//                     Description détaillée
//                   </label>
//                   <textarea
//                     id="description"
//                     placeholder="Décrivez votre projet, ses fonctionnalités, les défis techniques..."
//                     rows="4"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors resize-none"
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
//                   </div>
                  
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="tags">
//                       Tags ou mots-clés
//                     </label>
//                     <input
//                       id="tags"
//                       type="text"
//                       placeholder="portfolio, api, data-visualisation, e-commerce"
//                       value={formData.tags}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
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
//                           ✓ {imageFile.name}
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
//                           Archive ZIP (max. 50MB)
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
//                             {isUploading ? '📤 Envoi...' : '✅ Prêt'}
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
//                     onClick={() => navigate('/admin')}
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
//                           <span>{isEditing ? 'Modifier le projet' : 'Soumettre le projet'}</span>
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
//                       Conseils pour une bonne soumission
//                     </h3>
//                     <ul className="text-blue-700 dark:text-blue-400 text-sm space-y-1">
//                       <li>• Incluez un README.md avec les instructions d'installation</li>
//                       <li>• Vérifiez que toutes les dépendances sont listées</li>
//                       <li>• Testez votre projet avant de le soumettre</li>
//                       <li>• Ajoutez une image de présentation</li>
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

// export default SubmitProject;


// // src/components/admin/SubmitProject.jsx - SANS LA BARRE BLEUE
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import { projectService } from '../../services/projects';
// import authService from '../../services/auth';
// import { useProjects } from '../../context/ProjectContext';

// const SubmitProject = () => {
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
//     console.log('👤 UTILISATEUR - Connecté:', currentUser);
    
//     if (!currentUser) {
//       console.log('⚠️ Aucun utilisateur connecté, redirection vers login');
//       navigate('/login');
//       return;
//     }
    
//     setUser(currentUser);
    
//     // Pré-remplir la cohorte avec celle de l'utilisateur si disponible
//     if (currentUser?.cohort) {
//       setFormData(prev => ({
//         ...prev,
//         cohort: currentUser.cohort
//       }));
//     }

//     // Vérifier si on est en mode édition
//     const editId = searchParams.get('edit');
//     if (editId) {
//       loadProjectForEdit(editId);
//     }
//   }, [searchParams, navigate]);

//   const loadProjectForEdit = async (projectId) => {
//     try {
//       console.log('📥 Chargement du projet pour édition:', projectId);
//       const project = await projectService.getProjectDetails(projectId);
      
//       if (!project) {
//         throw new Error('Projet non trouvé');
//       }
      
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
      
//       console.log('✅ Projet chargé pour édition:', project.title);
//     } catch (err) {
//       console.error('❌ Erreur chargement projet:', err);
//       setError('Erreur lors du chargement du projet');
//       setTimeout(() => navigate('/dashboard'), 2000);
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
//     if (!selectedFile) return;
    
//     if (selectedFile.size > 50 * 1024 * 1024) {
//       setError('Le fichier est trop volumineux. Taille maximum: 50MB');
//       return;
//     }
    
//     if (!selectedFile.name.toLowerCase().endsWith('.zip')) {
//       setError('Veuillez sélectionner un fichier ZIP');
//       return;
//     }

//     setFile(selectedFile);
//     setError('');
//     console.log('📦 Fichier sélectionné:', selectedFile.name);
//   };

//   const handleImageChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (!selectedFile) return;
    
//     if (selectedFile.size > 5 * 1024 * 1024) {
//       setError('L\'image est trop volumineuse. Taille maximum: 5MB');
//       return;
//     }
    
//     const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
//     if (!validTypes.includes(selectedFile.type)) {
//       setError('Format d\'image non supporté. Utilisez JPG, PNG ou GIF');
//       return;
//     }

//     setImageFile(selectedFile);
//     setError('');
//     console.log('🖼️ Image sélectionnée:', selectedFile.name);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     console.log('🚀 Début de la soumission du projet');
    
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

//     // Vérification de l'utilisateur connecté
//     if (!user || !user.id) {
//       setError('Vous devez être connecté pour créer ou modifier un projet');
//       console.error('❌ Aucun utilisateur connecté');
//       return;
//     }

//     setIsUploading(true);
//     setUploadProgress(10);

//     try {
//       // Préparation des données
//       const projectData = {
//         title: formData.title.trim(),
//         technologies: formData.technologies.trim(),
//         description: formData.description.trim(),
//         cohort: formData.cohort.trim(),
//         tags: formData.tags.trim(),
//         github_url: formData.github_url.trim(),
//         demo_url: formData.demo_url.trim(),
//         author: user.id
//       };

//       console.log('📋 Données du projet:', projectData);
//       setUploadProgress(30);

//       let project;

//       if (isEditing) {
//         // Mise à jour du projet existant
//         console.log('✏️ Mise à jour du projet:', editProjectId);
        
//         // Ajouter l'image si une nouvelle est fournie
//         if (imageFile) {
//           projectData.image = imageFile;
//         }
        
//         // Simuler progression
//         setUploadProgress(60);
        
//         // Appel API pour mise à jour
//         project = await projectService.updateProject(editProjectId, projectData);
//         updateProject(project);
        
//         setUploadProgress(100);
//         console.log('✅ Projet modifié avec succès:', project.title);
        
//         // Redirection vers le succès
//         setTimeout(() => {
//           navigate('/admin/projects/success', { 
//             state: { 
//               project: project,
//               isEditing: true
//             } 
//           });
//         }, 500);

//       } else {
//         // Création d'un nouveau projet
//         console.log('🆕 Création d\'un nouveau projet');
        
//         // Ajouter les fichiers
//         if (file) {
//           projectData.zip_file = file;
//         }
//         if (imageFile) {
//           projectData.image = imageFile;
//         }
        
//         setUploadProgress(50);
        
//         // Appel API pour création
//         const createdProject = await projectService.createProject(projectData);
//         project = createdProject;

//         setUploadProgress(80);
        
//         // Validation de l'ID reçu
//         if (!project.id) {
//           console.warn('⚠️ Aucun ID reçu après création, génération d\'un ID temporaire');
//           project.id = `temp_${Date.now()}`;
//         }
        
//         // Ajouter au contexte global
//         addProject(project);
        
//         setUploadProgress(100);
//         console.log('✅ Projet créé avec succès:', project.title);
        
//         // Redirection vers le succès
//         setTimeout(() => {
//           navigate('/admin/projects/success', { 
//             state: { 
//               project: project,
//               isEditing: false
//             } 
//           });
//         }, 500);
//       }

//     } catch (err) {
//       console.error('❌ Erreur lors de la soumission:', err);
      
//       let errorMessage = `Erreur lors de ${isEditing ? 'la modification' : 'la création'} du projet`;
      
//       if (err.response?.data) {
//         const errors = err.response.data;
        
//         if (typeof errors === 'object') {
//           const errorDetails = Object.entries(errors)
//             .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
//             .join('; ');
//           errorMessage = `Erreurs de validation: ${errorDetails}`;
//         } else if (typeof errors === 'string') {
//           if (errors.includes('<!DOCTYPE html>')) {
//             errorMessage = 'Erreur serveur - Veuillez réessayer plus tard';
//           } else {
//             errorMessage = errors;
//           }
//         }
//       } else if (err.message) {
//         errorMessage = err.message;
//       }
      
//       setError(errorMessage);
//       setUploadProgress(0);
//     } finally {
//       if (!error) {
//         setIsUploading(false);
//       }
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
//     console.log('🔄 Formulaire réinitialisé');
//   };

//   const getUserAvatar = () => {
//     if (user?.profile_picture) {
//       return user.profile_picture;
//     }
//     if (user?.avatar) {
//       return user.avatar;
//     }
//     return "https://lh3.googleusercontent.com/aida-public/A6AXuA8VxS_x8jwDh_tF-ygq2OirDNuL2iAY7iNaZiMUFP0ulnWyCKEm_PI1Gc0ciC2TN952cGudRb6wvbJbWPWVGo903BPnvhSXGPboDyDNJD8iZzXEJfiOfRe0gXFHiPnJlAg73UmjlUMXqsg7hI0ME57JNKDz_c82g19tlQb4FmCTdsxqi8jz0nMLTwlAIUvOj4x0iE62XhOCawgbKi0PPQiv7Cz6CfFpzMGaxuCg9bUKa62_BIjWKT5M4ZTd9MB-KOhIR0FHkzz25w";
//   };

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

//   const getUserCohort = () => {
//     return user?.cohort || 'Stagiaire Simplon';
//   };

//   // Si pas d'utilisateur, afficher un loader
//   if (!user) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 dark:text-gray-400">Chargement de votre session...</p>
//         </div>
//       </div>
//     );
//   }

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
//                 to="/admin" 
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
//               >
//                 <span className="material-symbols-outlined">dashboard</span>
//                 <p className="text-sm font-medium">Tableau de bord</p>
//               </Link>
//               <Link 
//                 to="/admin/submit-project" 
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-white"
//               >
//                 <span className="material-symbols-outlined">upload_file</span>
//                 <p className="text-sm font-medium">Déposer un projet</p>
//               </Link>
//               <Link 
//                 to="/admin/projects" 
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
//               >
//                 <span className="material-symbols-outlined">folder</span>
//                 <p className="text-sm font-medium">Gestion projets</p>
//               </Link>
//               <Link 
//                 to="/admin/explore" 
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
//               >
//                 <span className="material-symbols-outlined">explore</span>
//                 <p className="text-sm font-medium">Explorer</p>
//               </Link>
//             </nav>
            
//             <div className="flex flex-col gap-1">
//               <Link 
//                 to="/admin/profile" 
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
//               >
//                 <span className="material-symbols-outlined">person</span>
//                 <p className="text-sm font-medium leading-normal">Profil</p>
//               </Link>
//               <Link 
//                 to="/admin/settings" 
//                 className="flex items-center gap-3 rounded px-3 py-2 text-white/70 hover:bg-[#003265] hover:text-white"
//               >
//                 <span className="material-symbols-outlined">settings</span>
//                 <span>Paramètres</span>
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
//                     : 'Remplissez le formulaire ci-dessous pour partager votre création.'}
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
//                     placeholder="Ex: React, Node.js, MongoDB, Tailwind CSS..."
//                     value={formData.technologies}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
//                     required
//                     disabled={isUploading}
//                   />
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                     Séparez les technologies par des virgules
//                   </p>
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="description">
//                     Description détaillée
//                   </label>
//                   <textarea
//                     id="description"
//                     placeholder="Décrivez votre projet, ses fonctionnalités, les défis techniques..."
//                     rows="4"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors resize-none"
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
//                   </div>
                  
//                   <div>
//                     <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="tags">
//                       Tags ou mots-clés
//                     </label>
//                     <input
//                       id="tags"
//                       type="text"
//                       placeholder="portfolio, api, data-visualisation, e-commerce"
//                       value={formData.tags}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
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
//                           ✓ {imageFile.name}
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
//                           Archive ZIP (max. 50MB)
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
//                             {isUploading ? '📤 Envoi...' : '✅ Prêt'}
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
//                     onClick={() => navigate('/admin')}
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
//                           <span>{isEditing ? 'Modifier le projet' : 'Déposer le projet'}</span>
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             </section>

//             {/* REMOVED: Section "Informations supplémentaires" avec la barre bleue */}
//             {/* Cette section a été supprimée comme demandé */}
            
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default SubmitProject;


// src/components/admin/SubmitProject.jsx - VERSION SANS SIDEBAR BLEUE
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { projectService } from '../../services/projects';
import authService from '../../services/auth';
import { useProjects } from '../../context/ProjectContext';

const SubmitProject = () => {
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
      const project = await projectService.getProjectDetails(projectId);
      
      if (!project) {
        throw new Error('Projet non trouvé');
      }
      
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
        project = await projectService.updateProject(editProjectId, projectData);
        updateProject(project);
        
        setUploadProgress(100);
        console.log('✅ Projet modifié avec succès:', project.title);
        
        // Redirection vers le succès
        setTimeout(() => {
          navigate('/admin/projects/success', { 
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
        const createdProject = await projectService.createProject(projectData);
        project = createdProject;

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
          navigate('/admin/projects/success', { 
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
      
      if (err.response?.data) {
        const errors = err.response.data;
        
        if (typeof errors === 'object') {
          const errorDetails = Object.entries(errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ');
          errorMessage = `Erreurs de validation: ${errorDetails}`;
        } else if (typeof errors === 'string') {
          if (errors.includes('<!DOCTYPE html>')) {
            errorMessage = 'Erreur serveur - Veuillez réessayer plus tard';
          } else {
            errorMessage = errors;
          }
        }
      } else if (err.message) {
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
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement de votre session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen">
      {/* SUPPRIMÉ: La div avec className="flex min-h-screen" et la sidebar */}
      
      {/* Main Content - PREND TOUTE LA PAGE */}
      <main className="p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Header avec profil utilisateur */}
          <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div>
              <h1 className="text-[#001F3F] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                {isEditing ? 'Modifier le Projet' : 'Déposer un Projet'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {isEditing 
                  ? 'Modifiez les informations de votre projet existant' 
                  : 'Remplissez le formulaire ci-dessous pour partager votre création.'}
              </p>
            </div>
            
            {/* Profil de l'utilisateur connecté */}
            <div className="flex items-center gap-3">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 border-2 border-primary"
                style={{ 
                  backgroundImage: `url(${getUserAvatar()})` 
                }}
                title={`Profil de ${getUserFullName()}`}
              ></div>
              <div className="flex flex-col text-right">
                <h2 className="text-[#001F3F] dark:text-white text-base font-medium">
                  {getUserFullName()}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {getUserCohort()}
                </p>
              </div>
            </div>
          </header>

          {/* Formulaire */}
          <section className="bg-white dark:bg-[#001F3F]/30 rounded-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-sm">
            {error && (
              <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900 dark:border-red-700 dark:text-red-200">
                <div className="flex items-center">
                  <span className="material-symbols-outlined mr-2">error</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Nom du projet */}
              <div>
                <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="title">
                  Nom du projet *
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Ex: Mon portfolio interactif, API de gestion de tâches..."
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
                  required
                  disabled={isUploading}
                />
              </div>

              {/* Technologies utilisées */}
              <div>
                <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="technologies">
                  Technologies utilisées *
                </label>
                <input
                  id="technologies"
                  type="text"
                  placeholder="Ex: React, Node.js, MongoDB, Tailwind CSS..."
                  value={formData.technologies}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
                  required
                  disabled={isUploading}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Séparez les technologies par des virgules
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="description">
                  Description détaillée
                </label>
                <textarea
                  id="description"
                  placeholder="Décrivez votre projet, ses fonctionnalités, les défis techniques..."
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors resize-none"
                  disabled={isUploading}
                />
              </div>

              {/* Liens GitHub et Démo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="github_url">
                    Lien GitHub (optionnel)
                  </label>
                  <input
                    id="github_url"
                    type="url"
                    placeholder="https://github.com/votre-username/projet"
                    value={formData.github_url}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
                    disabled={isUploading}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="demo_url">
                    Lien de démo (optionnel)
                  </label>
                  <input
                    id="demo_url"
                    type="url"
                    placeholder="https://votre-projet.vercel.app"
                    value={formData.demo_url}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
                    disabled={isUploading}
                  />
                </div>
              </div>

              {/* Cohorte et Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="cohort">
                    Cohorte / promotion
                  </label>
                  <select
                    id="cohort"
                    value={formData.cohort}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
                    disabled={isUploading}
                  >
                    <option value="">Sélectionnez votre cohorte</option>
                    {cohortsList.map(cohort => (
                      <option key={cohort} value={cohort}>{cohort}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="tags">
                    Tags ou mots-clés
                  </label>
                  <input
                    id="tags"
                    type="text"
                    placeholder="portfolio, api, data-visualisation, e-commerce"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
                    disabled={isUploading}
                  />
                </div>
              </div>

              {/* Image du projet */}
              <div>
                <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300">
                  Image du projet (optionnel)
                </label>
                <div className={`mt-1 flex justify-center rounded-lg border-2 border-dashed px-6 pt-5 pb-6 transition-all ${
                  imageFile 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'
                }`}>
                  <div className="space-y-1 text-center">
                    <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">
                      {imageFile ? 'image' : 'add_photo_alternate'}
                    </span>
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary">
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
                      <p className="text-xs text-green-600 dark:text-green-400">
                        ✓ {imageFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload de fichier - seulement pour la création */}
              {!isEditing && (
                <div>
                  <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300">
                    Fichier du projet (.zip) *
                  </label>
                  <div className={`mt-1 flex justify-center rounded-lg border-2 border-dashed px-6 pt-5 pb-6 transition-all ${
                    file 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'
                  }`}>
                    <div className="space-y-1 text-center">
                      <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">
                        {file ? 'folder_zip' : 'cloud_upload'}
                      </span>
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary">
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
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Archive ZIP (max. 50MB)
                      </p>
                    </div>
                  </div>
                  
                  {/* Affichage du fichier sélectionné et progression */}
                  {file && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-base">description</span>
                          <p className="font-medium text-[#001F3F] dark:text-gray-300 truncate flex-1">
                            {file.name}
                          </p>
                        </div>
                        <p className={`text-sm ${
                          isUploading ? 'text-primary' : 'text-green-600 dark:text-green-400'
                        }`}>
                          {isUploading ? '📤 Envoi...' : '✅ Prêt'}
                        </p>
                      </div>
                      {isUploading && (
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Boutons */}
              <div className="pt-4 flex flex-col sm:flex-row justify-end gap-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                  disabled={isUploading}
                >
                  Annuler
                </button>
                <div className="flex gap-3">
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                      disabled={isUploading}
                    >
                      Réinitialiser
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-8 bg-primary text-white text-base font-bold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
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
  );
};

export default SubmitProject;