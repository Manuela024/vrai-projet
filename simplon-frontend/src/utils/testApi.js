// src/utils/testApi.js
export const testBackendConnection = async () => {
  console.log('🔍 Test de connexion au backend Django...');
  
  try {
    // Test simple
    const response = await fetch('http://localhost:8000/api/projects/projects/');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Afficher le résultat
    console.log('🎉 Backend accessible!');
    console.log('📊 Format des données:', Object.keys(data));
    
    if (data.projects && Array.isArray(data.projects)) {
      console.log(`📂 ${data.projects.length} projets trouvés`);
      console.log('📝 Exemple projet:', data.projects[0]);
    } else if (Array.isArray(data)) {
      console.log(`📂 ${data.length} projets trouvés (format tableau)`);
      console.log('📝 Exemple projet:', data[0]);
    } else if (data.results && Array.isArray(data.results)) {
      console.log(`📂 ${data.results.length} projets trouvés (format results)`);
      console.log('📝 Exemple projet:', data.results[0]);
    } else {
      console.log('📝 Données complètes:', data);
    }
    
    return {
      success: true,
      data: data,
      message: 'Backend Django accessible'
    };
    
  } catch (error) {
    console.error('❌ Backend inaccessible:', error.message);
    
    return {
      success: false,
      error: error.message,
      message: 'Backend Django non accessible',
      suggestion: 'Vérifiez que Django est démarré: python manage.py runserver'
    };
  }
};

// Ajoutez ce script dans votre console navigateur
export const addTestToConsole = () => {
  if (typeof window !== 'undefined') {
    window.testBackend = testBackendConnection;
    console.log('🔧 Script de test ajouté. Tapez "testBackend()" dans la console.');
  }
};

// Exécutez automatiquement
if (typeof window !== 'undefined') {
  setTimeout(() => {
    addTestToConsole();
    console.log('🔧 Pour tester le backend, tapez: await testBackend()');
  }, 2000);
}