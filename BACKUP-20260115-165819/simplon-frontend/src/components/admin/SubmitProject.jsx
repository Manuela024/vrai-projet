
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