// src/pages/TestApi.jsx
import React, { useEffect } from 'react';
import api from '../services/api';

const TestApi = () => {
  useEffect(() => {
    testEndpoints();
  }, []);

  const testEndpoints = async () => {
    console.log('🧪 Test des endpoints API Django');
    
    const endpoints = [
      '/token/',
      '/profile/',
      '/user/',
      '/projects/',
      '/my-projects/'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 Test ${endpoint}...`);
        const response = await api.get(endpoint);
        console.log(`✅ ${endpoint}:`, response.status, response.data ? 'DATA OK' : 'NO DATA');
      } catch (error) {
        console.log(`❌ ${endpoint}:`, error.response?.status || error.message);
      }
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <h1>🧪 Test API Django</h1>
      <p>Ouvrez la console (F12) pour voir les résultats</p>
      <button onClick={testEndpoints} style={{ padding: '10px 20px', marginTop: '20px' }}>
        Tester à nouveau
      </button>
    </div>
  );
};

export default TestApi;