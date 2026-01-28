

// // src/components/ProtectedRoute.jsx - VERSION CORRIGÉE
// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children, requireAdmin = false }) => {
//   // Vérifie TOUTES les clés possibles
//   const token = localStorage.getItem('simplon_access_token') || 
//                 localStorage.getItem('token') ||
//                 localStorage.getItem('access_token');
  
//   console.log('🔐 ProtectedRoute - vérification token:');
//   console.log('📦 localStorage keys:', Object.keys(localStorage));
//   console.log('✅ Token trouvé?:', !!token);
  
//   // Si pas de token, redirige vers login
//   if (!token) {
//     console.log('🚫 Pas de token - Redirection vers /login');
//     return <Navigate to="/login" replace />;
//   }
  
//   // Si admin requis, vérifie le rôle
//   if (requireAdmin) {
//     const userStr = localStorage.getItem('simplon_user') || 
//                     localStorage.getItem('user');
    
//     console.log('👤 Vérification admin - User data:', userStr);
    
//     if (userStr) {
//       try {
//         const user = JSON.parse(userStr);
//         const isAdmin = user.role === 'admin' || 
//                         user.isAdmin === true ||
//                         user.role === 'ADMIN' ||
//                         user.username === 'admin';
        
//         console.log('🎭 Rôle utilisateur:', user.role);
//         console.log('👑 Est admin?:', isAdmin);
        
//         if (!isAdmin) {
//           console.log('📤 Pas admin - Redirection vers /dashboard');
//           return <Navigate to="/dashboard" replace />;
//         }
//       } catch (error) {
//         console.error('❌ Erreur parsing user:', error);
//         return <Navigate to="/dashboard" replace />;
//       }
//     }
//   }
  
//   console.log('✅ Accès autorisé');
//   return children;
// };

// export default ProtectedRoute;


// src/components/ProtectedRoute.jsx - VERSION AMÉLIORÉE
import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/auth';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  // Vérifier l'authentification via authService
  const isAuthenticated = authService.isAuthenticated();
  const token = authService.getAccessToken();
  
  console.log('🔐 ProtectedRoute - vérification:');
  console.log('✅ Authentifié?:', isAuthenticated);
  console.log('🔑 Token:', token ? 'Oui' : 'Non');
  
  // Si pas authentifié, rediriger vers login
  if (!isAuthenticated || !token) {
    console.log('🚫 Non authentifié - Redirection vers /login');
    return <Navigate to="/login" replace />;
  }
  
  // Si admin requis, vérifier via authService
  if (requireAdmin) {
    const isAdmin = authService.isAdmin();
    const user = authService.getCurrentUser();
    
    console.log('👑 Vérification admin:');
    console.log('   👤 Utilisateur:', user?.username);
    console.log('   🎭 Rôle:', user?.role);
    console.log('   👑 Est admin?:', isAdmin);
    
    if (!isAdmin) {
      console.log('📤 Pas admin - Redirection vers /dashboard');
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  console.log('✅ Accès autorisé');
  return children;
};

export default ProtectedRoute;