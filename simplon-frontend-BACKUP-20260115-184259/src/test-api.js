import projectService from './services/projects';

async function testAPI() {
  console.log('🧪 Test de l\'API...');
  
  try {
    // 1. Tester la santé de l'API
    await projectService.checkAPIHealth();
    
    // 2. Tester la récupération des projets
    const projects = await projectService.getAllProjects();
    console.log('📊 Projets récupérés:', projects.length);
    
    // 3. Tester la création (si l'utilisateur est connecté)
    const user = projectService.getCurrentUser();
    if (user) {
      console.log('👤 Utilisateur connecté:', user.username);
      
      const testData = {
        title: "Test API " + new Date().toISOString(),
        technologies: "React, Django",
        description: "Test d'API",
        cohort: "DWWM - Test",
        tags: "test",
        status: "pending"
      };
      
      try {
        const created = await projectService.createProject(testData);
        console.log('✅ Projet créé:', created.id);
      } catch (createError) {
        console.log('⚠️ Création échouée (normal si pas de serveur):', createError.message);
      }
    } else {
      console.log('👤 Aucun utilisateur connecté');
    }
  } catch (error) {
    console.error('❌ Test échoué:', error.message);
  }
}

// Exécuter le test
testAPI();