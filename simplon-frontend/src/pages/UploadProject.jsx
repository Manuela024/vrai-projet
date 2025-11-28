
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { projectService } from '../services/projects';
import { authService } from '../services/auth';
import { useProjects } from '../context/ProjectContext';

const UploadProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    technologies: '',
    description: '',
    cohort: '',
    tags: '',
    status: 'draft'
  });
  const [file, setFile] = useState(null);
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
    setUser(currentUser);
    
    // Pré-remplir la cohorte avec celle de l'utilisateur si disponible
    if (currentUser?.cohort) {
      setFormData(prev => ({
        ...prev,
        cohort: currentUser.cohort
      }));
    }

    const editId = searchParams.get('edit');
    if (editId) {
      loadProjectForEdit(editId);
    }
  }, [searchParams]);

  const loadProjectForEdit = async (projectId) => {
    try {
      const project = await projectService.getProjectById(projectId);
      setFormData({
        title: project.title || '',
        technologies: project.technologies || '',
        description: project.description || '',
        cohort: project.cohort || '',
        tags: project.tags || '',
        status: project.status || 'draft'
      });
      setIsEditing(true);
      setEditProjectId(projectId);
    } catch (err) {
      setError('Erreur lors du chargement du projet');
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
    if (selectedFile) {
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('📝 DEBUG - Début handleSubmit');
    
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

    setIsUploading(true);

    try {
      // Préparation des données comme texte simple
      const projectData = {
        title: formData.title.trim(),
        technologies: formData.technologies.trim(),
        description: formData.description.trim(),
        cohort: formData.cohort.trim(),
        tags: formData.tags.trim(),
        status: formData.status
      };

      console.log('🎯 DEBUG - Données envoyées à l\'API:', projectData);

      let project;

      if (isEditing) {
        // Mise à jour
        project = await projectService.updateProject(editProjectId, projectData);
        updateProject(project);
        
        console.log('✅ DEBUG - Projet modifié, redirection...');
        navigate('/project-success', { 
          state: { 
            project: project,
            isEditing: true
          } 
        });
      } else {
        // Création
        console.log('🚀 DEBUG - Tentative de création du projet...');
        const createdProject = await projectService.createProject(projectData);
        console.log('✅ DEBUG - Projet créé:', createdProject);
        project = createdProject;

        // Validation robuste de l'ID
        if (!project.id) {
          console.error('❌ CRITIQUE: Aucun ID reçu après création');
          const tempId = `temp_${Date.now()}`;
          project.id = tempId;
          console.log('🆔 ID temporaire généré:', project.id);
        } else {
          console.log('🆔 ID du projet:', project.id);
        }
        
        // Upload du fichier si création et si fichier existe
        if (file && project.id && project.id !== 'undefined') {
          try {
            console.log('📤 DEBUG - Upload du fichier pour projet ID:', project.id);
            setUploadProgress(50);
            await projectService.uploadProjectFile(project.id, file);
            setUploadProgress(100);
            
            // Récupère le projet mis à jour
            const updatedProject = await projectService.getProjectById(project.id);
            console.log('✅ DEBUG - Projet avec fichier:', updatedProject);
            project = updatedProject;
          } catch (uploadError) {
            console.error('❌ Erreur upload fichier, mais projet créé:', uploadError);
            // Continue même si l'upload échoue - le projet est déjà créé
          }
        } else if (file) {
          console.warn('⚠️ Upload fichier ignoré - ID invalide:', project.id);
        }

        // Ajoute au contexte global
        addProject(project);
        
        console.log('✅ DEBUG - Redirection vers succès...');
        navigate('/project-success', { 
          state: { 
            project: project,
            isEditing: false
          } 
        });
      }

    } catch (err) {
      console.error('❌ DEBUG - Erreur dans handleSubmit:', err);
      console.error('❌ DEBUG - Response data:', err.response?.data);
      
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
            errorMessage = 'Erreur serveur - Veuillez réessayer';
          } else {
            errorMessage = errors;
          }
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      title: '',
      technologies: '',
      description: '',
      cohort: user?.cohort || '', // Conserve la cohorte de l'utilisateur
      tags: '',
      status: 'draft'
    });
    setFile(null);
    setError('');
  };

  // Fonction pour obtenir l'URL de l'avatar de l'utilisateur
  const getUserAvatar = () => {
    if (user?.profile_picture) {
      return user.profile_picture;
    }
    if (user?.avatar) {
      return user.avatar;
    }
    // Avatar par défaut
    return "https://lh3.googleusercontent.com/aida-public/A6AXuA8VxS_x8jwDh_tF-ygq2OirDNuL2iAY7iNaZiMUFP0ulnWyCKEm_PI1Gc0ciC2TN952cGudRb6wvbJbWPWVGo903BPnvhSXGPboDyDNJD8iZzXEJfiOfRe0gXFHiPnJlAg73UmjlUMXqsg7hI0ME57JNKDz_c82g19tlQb4FmCTdsxqi8jz0nMLTwlAIUvOj4x0iE62XhOCawgbKi0PPQiv7Cz6CfFpzMGaxuCg9bUKa62_BIjWKT5M4ZTd9MB-KOhIR0FHkzz25w";
  };

  // Fonction pour obtenir le nom complet de l'utilisateur
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

  // Fonction pour obtenir la cohorte de l'utilisateur
  const getUserCohort = () => {
    return user?.cohort || 'Stagiaire Simplon';
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200 min-h-screen">
      <div className="flex min-h-screen">
        
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 bg-[#001F3F] text-white flex flex-col p-4">
          <div className="flex items-center gap-3 px-3 py-2 mb-8">
            {/* <div 
            //   className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" 
            //   style={{ 
            //     backgroundImage: 'url("https://lh3.googleuserconten.com/aida-public/AB6AXuCFDn1tZoHFvMjYIPbnv1uGv8Lks2R0QpWwegwyhfrhzF8M4YyU5yjGEPbRXDqqoQJok0v5QCgQtw9nzWMIn9a-cc4A5rlXVrjOUxemqeTXkPNG46a_rT53sjQU4YOHC5IVLWN_3bona_6h0dlLK5323xW9FAorS84K7RF_8w9jh4pmkMQa2anu2CAudT3xUWRPQFm6g-hi717S2XwdAc0kQJ08A49riltIQwWcQKtqLA0dQyeprJG7uOcj_hLrL0wS4hcp3dzcVrw")' 
            //   }}
            ></div> */}

                  <img 
  src="/src/logo.png" 
  alt="Logo Simplon" 
  className="size-10 rounded-full object-cover"
/>
            <div className="flex flex-col">
              
              <h1 className="text-white text-base font-medium leading-normal">Simplon</h1>
              <p className="text-gray-400 text-sm font-normal leading-normal">Code Platform</p>
            </div>
          </div>

          <div className="flex flex-col justify-between flex-grow">
            <nav className="flex flex-col gap-2">
              <Link 
                to="/dashboard" 
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined">folder</span>
                <p className="text-sm font-medium">Mes projets</p>
              </Link>
              <Link 
                to="/upload" 
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-white"
              >
                <span className="material-symbols-outlined">upload_file</span>
                <p className="text-sm font-medium">Déposer un projet</p>
              </Link>
              <Link 
                to="/explore" 
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined">explore</span>
                <p className="text-sm font-medium">Explorer les projets</p>
              </Link>
              {/* <Link 
                to="/profile" 
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined">person</span>
                <p className="text-sm font-medium leading-normal">Profil</p>
              </Link> */}
            </nav>
            
            <div className="flex flex-col gap-1">
               <Link 
                to="/profile" 
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
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
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left"
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
                <h1 className="text-[#001F3F] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                  {isEditing ? 'Modifier le Projet' : 'Déposer un Projet'}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {isEditing 
                    ? 'Modifiez les informations de votre projet existant' 
                    : 'Remplissez les informations ci-dessous pour partager votre création avec la communauté Simplon.'}
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
                    {error}
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
                    placeholder="Ex: React, Node.js, MongoDB, Tailwind CSS, Python, Django..."
                    value={formData.technologies}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
                    required
                    disabled={isUploading}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Séparez les technologies par des virgules. Ex: "React, Node.js, MongoDB"
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="description">
                    Description détaillée
                  </label>
                  <textarea
                    id="description"
                    placeholder="Décrivez votre projet, ses fonctionnalités principales, les défis techniques rencontrés, ce que vous avez appris..."
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors resize-none"
                    disabled={isUploading}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Une bonne description aide les autres à comprendre votre projet.
                  </p>
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
                    {user?.cohort && !formData.cohort && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        💡 Votre cohorte: {user.cohort}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="tags">
                      Tags ou mots-clés
                    </label>
                    <input
                      id="tags"
                      type="text"
                      placeholder="portfolio, api, data-visualisation, e-commerce, responsive"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
                      disabled={isUploading}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Séparez les tags par des virgules pour une meilleure découvrabilité.
                    </p>
                  </div>
                </div>

                {/* Statut du projet */}
                <div>
                  <label className="text-sm font-medium text-[#001F3F] dark:text-gray-300" htmlFor="status">
                    Statut du projet
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-[#001F3F]/50 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 p-3 transition-colors"
                    disabled={isUploading}
                  >
                    <option value="draft">📝 Brouillon (visible uniquement par vous)</option>
                    <option value="pending">⏳ En attente de validation</option>
                    <option value="published">📢 Publié (visible par tous)</option>
                  </select>
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
                          Archive ZIP contenant votre code source (max. 50MB)
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
                            {isUploading ? '📤 Téléversement...' : '✅ Prêt'}
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
                    onClick={() => navigate('/dashboard')}
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
                          <span>{isEditing ? 'Modifier le projet' : 'Publier mon projet'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </section>

            {/* Informations supplémentaires */}
            {!isEditing && (
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 mt-0.5">info</span>
                  <div>
                    <h3 className="text-blue-800 dark:text-blue-300 font-medium mb-1">
                      Conseils pour un bon dépôt de projet
                    </h3>
                    <ul className="text-blue-700 dark:text-blue-400 text-sm space-y-1">
                      <li>• Assurez-vous que votre code est bien documenté</li>
                      <li>• Incluez un README.md avec les instructions d'installation</li>
                      <li>• Vérifiez que toutes les dépendances sont listées</li>
                      <li>• Testez votre projet avant de le déposer</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UploadProject;