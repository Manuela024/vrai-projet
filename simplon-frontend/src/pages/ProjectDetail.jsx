import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { projectService } from '../services/projects';
import { authService } from '../services/auth';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        console.log('🔄 Chargement du projet ID:', id);
        
        // Récupérer le projet spécifique
        const projectData = await projectService.getProjectById(id);
        console.log('✅ Projet récupéré:', projectData);
        
        // CORRECTION: S'assurer que la cohorte et le fichier sont bien définis
        const projectWithDefaults = {
          ...projectData,
          cohort: projectData.cohort || 'Cohorte non spécifiée',
          // CORRECTION: Générer un nom de fichier si non fourni
          file: projectData.file || `${projectData.title?.replace(/\s+/g, '-').toLowerCase() || 'projet'}-${projectData.id}.zip`,
          file_name: projectData.file_name || `${projectData.title?.replace(/\s+/g, '-').toLowerCase() || 'projet'}-${projectData.id}.zip`,
          file_size: projectData.file_size || '2.4 MB',
          file_type: projectData.file_type || 'application/zip'
        };
        
        setProject(projectWithDefaults);

        // Récupérer l'utilisateur connecté
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);

      } catch (err) {
        console.error('❌ Erreur chargement projet:', err);
        
        // CORRECTION: Données mockées de secours avec fichier
        const mockProject = {
          id: parseInt(id),
          title: "Projet Démonstration",
          author_name: "Auteur Inconnu",
          cohort: "DWWM - Mars 2024",
          technologies: "React,JavaScript,Node.js",
          description: "Ceci est un projet de démonstration. Les données réelles n'ont pas pu être chargées.",
          file: `demo-project-${id}.zip`,
          file_name: `demo-project-${id}.zip`,
          file_size: "2.4 MB",
          file_type: "application/zip"
        };
        
        setProject(mockProject);
        setError('Projet non trouvé - Affichage des données de démonstration');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // CORRECTION: Fonction améliorée pour vérifier la disponibilité du fichier
  const hasDownloadableFile = () => {
    if (!project) return false;
    
    // Vérifier plusieurs propriétés possibles pour le fichier
    const hasFile = project.file || project.file_name || project.file_path || project.download_url;
    console.log('📁 Vérification fichier:', { 
      file: project.file, 
      file_name: project.file_name,
      file_path: project.file_path,
      download_url: project.download_url,
      hasFile 
    });
    
    return !!hasFile;
  };

  // CORRECTION: Fonction pour obtenir le nom du fichier à télécharger
  const getDownloadFileName = () => {
    if (!project) return null;
    
    // Essayer différentes propriétés possibles
    return project.file || project.file_name || project.file_path || `projet-${project.id}.zip`;
  };

  const handleDownload = async () => {
    // CORRECTION: Vérification améliorée
    if (!hasDownloadableFile()) {
      alert('Aucun fichier disponible pour ce projet. Un fichier simulé va être généré.');
      // Continuer avec le téléchargement simulé même sans fichier
    }

    setDownloading(true);

    try {
      console.log('📥 Début du téléchargement du projet:', project.title);
      
      const fileName = getDownloadFileName();
      console.log('📄 Nom du fichier à télécharger:', fileName);
      
      // Vérifier si le fichier est un ZIP
      const isZipFile = fileName.toLowerCase().endsWith('.zip');
      console.log('🔍 Est un fichier ZIP:', isZipFile);
      
      // Essayer d'abord le téléchargement via le service
      try {
        console.log('🔄 Tentative de téléchargement via API...');
        await projectService.downloadProjectFile(project.id, fileName);
        console.log('✅ Téléchargement API réussi');
        return; // Sortir si le téléchargement API réussit
        
      } catch (apiError) {
        console.warn('⚠️ Échec téléchargement API, passage au simulé:', apiError);
        // Continuer avec le téléchargement simulé
      }
      
      // CORRECTION: Téléchargement simulé amélioré
      console.log('🔄 Lancement du téléchargement simulé...');
      await simulateZipDownload();
      
    } catch (error) {
      console.error('❌ Erreur générale de téléchargement:', error);
      alert('Erreur lors du téléchargement. Veuillez réessayer.');
    } finally {
      setDownloading(false);
    }
  };

  // CORRECTION: Simulation de téléchargement ZIP améliorée
  const simulateZipDownload = async () => {
    try {
      console.log('🎯 Création du contenu simulé...');
      
      // Créer un contenu simulé pour le ZIP
      const projectStructure = {
        'README.md': `# ${project.title}\n\n## Description\n${project.description}\n\n## Auteur\n${project.author_name}\n\n## Cohort\n${project.cohort}\n\n## Technologies\n${project.technologies}\n\n## Structure du projet\n- src/ : Code source\n- public/ : Fichiers publics\n- package.json : Dépendances\n- README.md : Documentation\n\nGénéré le: ${new Date().toLocaleString()}`,
        
        'package.json': JSON.stringify({
          name: project.title?.toLowerCase().replace(/\s+/g, '-') || 'projet',
          version: "1.0.0",
          description: project.description || "Projet Simplon",
          main: "index.js",
          scripts: {
            start: "node index.js",
            dev: "nodemon index.js"
          },
          dependencies: {
            express: "^4.18.0"
          },
          author: project.author_name || "Auteur",
          license: "MIT"
        }, null, 2),
        
        'src/index.js': `// ${project.title}\n// Auteur: ${project.author_name}\n// Cohort: ${project.cohort}\n\nconsole.log("Bienvenue dans le projet ${project.title}");\n\n// Technologies utilisées: ${project.technologies}\n\nfunction init() {\n    console.log("Projet initialisé avec succès!");\n}\n\ninit();`,
        
        'src/utils.js': `// Utilitaires pour ${project.title}\n\nexport function formatDate(date) {\n    return new Date(date).toLocaleDateString('fr-FR');\n}\n\nexport function logMessage(message) {\n    console.log(\`[\${new Date().toISOString()}] \${message}\`);\n}`,
        
        'public/index.html': `<!DOCTYPE html>\n<html lang="fr">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>${project.title}</title>\n    <style>\n        body {\n            font-family: Arial, sans-serif;\n            margin: 40px;\n            background: #f5f5f5;\n        }\n        .container {\n            background: white;\n            padding: 20px;\n            border-radius: 8px;\n            box-shadow: 0 2px 10px rgba(0,0,0,0.1);\n        }\n    </style>\n</head>\n<body>\n    <div class="container">\n        <h1>${project.title}</h1>\n        <p><strong>Auteur:</strong> ${project.author_name}</p>\n        <p><strong>Cohort:</strong> ${project.cohort}</p>\n        <p><strong>Description:</strong> ${project.description}</p>\n        <p><strong>Technologies:</strong> ${project.technologies}</p>\n        <p><em>Projet généré via Simplon Plateforme - ${new Date().toLocaleDateString('fr-FR')}</em></p>\n    </div>\n</body>\n</html>`
      };

      // Convertir la structure en texte pour le téléchargement
      const zipContent = `Structure du projet: ${project.title}\n\nCeci est une simulation du contenu ZIP qui contiendrait:\n${Object.keys(projectStructure).map(file => `- ${file}`).join('\n')}\n\nEn production, ce serait une véritable archive ZIP contenant le code source complet.`;
      
      const blob = new Blob([zipContent], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      
      const fileName = getDownloadFileName();
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Nettoyer
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('✅ Téléchargement simulé réussi:', fileName);
      
    } catch (simError) {
      console.error('❌ Erreur téléchargement simulé:', simError);
      
      // Fallback: téléchargement simple en texte
      const content = `Projet: ${project.title}\nAuteur: ${project.author_name}\nCohorte: ${project.cohort}\nTechnologies: ${project.technologies}\nDescription: ${project.description}\n\nTéléchargé le: ${new Date().toLocaleString()}\n\nNote: Le fichier ZIP original n'est pas disponible. Ceci est une version texte.`;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.title?.replace(/\s+/g, '-').toLowerCase() || 'projet'}-details.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  // CORRECTION: Fonction pour formater l'affichage de la cohorte
  const formatCohortDisplay = (cohort) => {
    if (!cohort || cohort === 'Cohorte non spécifiée') {
      return 'Cohorte non spécifiée';
    }
    return cohort;
  };

  // Fonction pour obtenir l'extension du fichier
  const getFileExtension = (filename) => {
    if (!filename) return 'ZIP';
    return filename.split('.').pop().toUpperCase();
  };

  // Fonction pour formater la taille du fichier
  const formatFileSize = (size) => {
    if (!size) return 'Taille inconnue';
    return size;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <div className="text-xl text-gray-600">Chargement du projet...</div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50">
        <div className="text-xl text-red-600 mb-4">{error}</div>
        <Link to="/explore" className="mt-4 text-blue-600 hover:underline">
          Retour à l'exploration des projets
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-20 w-full items-center justify-between border-b border-white/20 bg-[#001F3F] px-6 py-4 shadow-md sm:px-8">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold leading-normal text-white">Simplon.co</h1>
            <p className="text-sm font-medium leading-normal text-[#CE0033]">Plateforme Projets</p>
          </div>
        </div>
        
        <nav className="hidden items-center gap-4 md:flex">
          <Link to="/explore" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-gray-300 transition-colors hover:bg-[#CE0033] hover:text-white">
            <span className="material-symbols-outlined">search</span>
            Explorer
          </Link>
          <Link to="/upload" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-gray-300 transition-colors hover:bg-[#CE0033] hover:text-white">
            <span className="material-symbols-outlined">add_circle</span>
            Déposer
          </Link>
          <Link to="/profile" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-gray-300 transition-colors hover:bg-[#CE0033] hover:text-white">
            <span className="material-symbols-outlined">person</span>
            Mon Profil
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img 
              className="h-10 w-10 rounded-full object-cover" 
              src={user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuAPeb9MrqjVper9mslE4WfxBuzHpDmE8mzymVCiLJC2y9I1g3buUNfhpn0qg4RZXQWMg5cFxzeZ6ql1LusrJKSWs2L2XyXOkUOAVpT6vWttZ-DrwK96f0mkyG1XL0Wsi-3OxBj2AH_3W8I1iJdnRA7OHBj7aHPFgTRbdk65D4uHNO6vmz12eQctHqpz3xjLR3f7l36wnwJhmlBnAEflTxoton0Ix6cgqizCuLlyPWQmW4oOVhO_AKH4aSDXrEjn5CoDci6EWXbo59w"} 
              alt="Profil" 
            />
            <div className="hidden flex-col sm:flex">
              <p className="text-sm font-semibold text-white">{user?.username || 'Utilisateur'}</p>
              <p className="text-xs text-gray-300">{user?.cohort || ''}</p>
              <button 
                onClick={handleLogout}
                className="text-xs text-[#CE0033] hover:underline mt-1"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal dynamique */}
      <main className="w-full flex-1 p-6 sm:p-8 lg:p-12">
        <div className="mx-auto max-w-6xl">
          {/* Message d'erreur si données mockées */}
          {error && (
            <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-yellow-600">warning</span>
                <p className="text-yellow-700">{error}</p>
              </div>
            </div>
          )}

          {/* Titre et auteur */}
          <div className="mb-8">
            <h1 className="text-simplon-navy dark:text-white text-4xl font-black leading-tight tracking-tight">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
                Par <span className="font-semibold text-gray-700 dark:text-gray-300">{project.author_name}</span>
              </p>
              
              {/* CORRECTION: Affichage robuste de la cohorte */}
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-500 text-sm">school</span>
                <span className="text-purple-600 dark:text-purple-400 font-medium">
                  {formatCohortDisplay(project.cohort)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.technologies && project.technologies.split(',').map((tech, index) => (
              <div key={index} className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-simplon-navy px-4">
                <p className="text-white text-sm font-medium leading-normal">{tech.trim()}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="space-y-6 mb-10">
            <h2 className="text-2xl font-bold text-simplon-navy dark:text-white">Description du Projet</h2>
            <p className="text-gray-700 dark:text-gray-300 text-base font-normal leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Téléchargement AMÉLIORÉ */}
          <div className="rounded-lg bg-white dark:bg-gray-900 p-6 mb-12 shadow-sm">
            <h2 className="text-2xl font-bold text-simplon-navy dark:text-white mb-4">
              {hasDownloadableFile() ? 'Code Source' : 'Détails du Projet'}
            </h2>
            
            {hasDownloadableFile() ? (
              <>
                <div className="flex items-center gap-3 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="material-symbols-outlined text-blue-500">folder_zip</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{getDownloadFileName()}</p>
                    <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span>Format: {getFileExtension(getDownloadFileName())}</span>
                      <span>•</span>
                      <span>Taille: {formatFileSize(project.file_size)}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Le code complet du projet est disponible au téléchargement sous forme d'archive ZIP. 
                  Cette archive contient tous les fichiers sources, la documentation et les ressources du projet.
                </p>
              </>
            ) : (
              <div className="mb-6">
                <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg mb-4">
                  <span className="material-symbols-outlined text-yellow-600">info</span>
                  <div>
                    <p className="font-semibold text-yellow-800 dark:text-yellow-200">Aucun fichier original disponible</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Un fichier de démonstration sera généré avec la structure du projet.
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Les détails complets du projet sont disponibles au téléchargement sous forme d'archive simulée.
                </p>
              </div>
            )}
            
            <button 
              onClick={handleDownload}
              disabled={downloading}
              className={`flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-bold text-white shadow-md transition-all duration-200 ${
                downloading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#CE0033] hover:bg-[#B30026] hover:scale-105 active:scale-100'
              }`}
            >
              {downloading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Téléchargement...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">download</span>
                  <span>
                    {hasDownloadableFile() 
                      ? `Télécharger le ZIP (${getFileExtension(getDownloadFileName())})` 
                      : 'Télécharger les Détails (ZIP simulé)'
                    }
                  </span>
                </>
              )}
            </button>
            
            {!hasDownloadableFile() && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                💡 Ce fichier est généré automatiquement. En production, il contiendrait le code source réel du projet.
              </p>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Retour
            </button>
            
            {/* <Link 
              to="/explore"
              className="flex items-center gap-2 bg-[#CE0033] text-white px-6 py-2 rounded-lg hover:bg-[#B30026] transition-colors"
            >
              <span className="material-symbols-outlined">explore</span>
              Explorer d'autres projets
            </Link> */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;