// src/services/endpointDiscovery.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Tester un endpoint spécifique
export const testEndpoint = async (endpoint) => {
  try {
    console.log(`🔍 Test endpoint: ${endpoint}`);
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      timeout: 3000,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    return {
      endpoint,
      available: true,
      status: response.status,
      data: response.data,
      message: 'Endpoint disponible'
    };
  } catch (error) {
    return {
      endpoint,
      available: false,
      status: error.response?.status || 0,
      error: error.message,
      message: error.response?.status === 404 ? 'Non trouvé' : 'Erreur'
    };
  }
};

// Découvrir tous les endpoints disponibles
export const discoverAllEndpoints = async () => {
  console.log('🚀 Démarrage de la découverte des endpoints...');
  
  const endpointsToTest = [
    // Projets (selon votre réponse curl)
    '/api/projects/',
    '/api/projects/projects/',
    '/api/projects/all/',
    
    // Utilisateurs
    '/api/users/',
    '/api/users/users/',
    '/api/users/all/',
    
    // Auth
    '/api/token/',
    '/api/token/refresh/',
    '/api/token/verify/',
    
    // Status
    '/api/status/',
    
    // Auth (alternative)
    '/api/auth/'
  ];
  
  const results = [];
  
  for (const endpoint of endpointsToTest) {
    const result = await testEndpoint(endpoint);
    results.push(result);
    
    if (result.available) {
      console.log(`✅ ${endpoint} - DISPONIBLE (${result.status})`);
    } else {
      console.log(`❌ ${endpoint} - ${result.message}`);
    }
  }
  
  // Filtrer les endpoints disponibles
  const availableEndpoints = results.filter(r => r.available);
  
  console.log('📊 Résumé de la découverte:');
  console.log(`   Total testés: ${results.length}`);
  console.log(`   Disponibles: ${availableEndpoints.length}`);
  console.log(`   Indisponibles: ${results.length - availableEndpoints.length}`);
  
  return {
    all: results,
    available: availableEndpoints,
    summary: {
      total: results.length,
      available: availableEndpoints.length,
      unavailable: results.length - availableEndpoints.length
    }
  };
};

// Obtenir la configuration pour le frontend
export const getFrontendConfig = async () => {
  const discovery = await discoverAllEndpoints();
  
  // Trouver l'endpoint principal pour les projets
  const projectsEndpoint = discovery.available.find(e => 
    e.endpoint.includes('projects') && 
    e.endpoint !== '/api/projects/' // Exclure l'endpoint de status
  );
  
  // Trouver l'endpoint pour les utilisateurs
  const usersEndpoint = discovery.available.find(e => 
    e.endpoint.includes('users')
  );
  
  // Trouver l'endpoint d'authentification
  const authEndpoint = discovery.available.find(e => 
    e.endpoint.includes('token')
  );
  
  return {
    projects: projectsEndpoint?.endpoint || '/api/projects/projects/',
    users: usersEndpoint?.endpoint || '/api/users/',
    auth: authEndpoint?.endpoint || '/api/token/',
    status: '/api/projects/', // Votre endpoint de status
    discovery
  };
};