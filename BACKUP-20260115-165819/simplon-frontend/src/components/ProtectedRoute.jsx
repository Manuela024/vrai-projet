// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import authService from '../services/auth';

// const ProtectedRoute = ({ children }) => {
//   const isAuthenticated = authService.isAuthenticated();
  
//   if (!isAuthenticated) {
//     // Rediriger vers la page de login si non authentifié
//     return <Navigate to="/login" replace />;
//   }
  
//   return children;
// };

// export default ProtectedRoute;


// // src/components/ProtectedRoute.jsx - AJOUTEZ DES LOGS
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import authService from '../services/auth';

// const ProtectedRoute = ({ children, requireAdmin = false }) => {
//   console.log('🔒 ProtectedRoute - Vérification...');
  
//   // Vérifier si connecté
//   const isAuthenticated = authService.isAuthenticated();
//   const isAdmin = authService.isAdmin();
//   const user = authService.getCurrentUser();
  
//   console.log('📊 Statut authentification:', {
//     isAuthenticated,
//     isAdmin,
//     user: user?.username,
//     localStorageUser: localStorage.getItem('user'),
//     localStorageToken: localStorage.getItem('access_token')
//   });

//   if (!isAuthenticated) {
//     console.log('🔒 Non connecté, redirection vers /login');
//     return <Navigate to="/login" replace />;
//   }

//   // Si admin requis mais pas admin
//   if (requireAdmin && !isAdmin) {
//     console.log('🚫 Admin requis mais utilisateur non-admin');
//     console.log('🔄 Redirection vers /dashboard');
//     return <Navigate to="/dashboard" replace />;
//   }

//   console.log('✅ Accès autorisé');
//   return children;
// };

// export default ProtectedRoute;

// // src/components/ProtectedRoute.jsx
// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children, requireAdmin = false }) => {
//   const token = localStorage.getItem('token');
  
//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }
  
//   // Pour l'instant, on accepte tout le monde
//   return children;
// };

// export default ProtectedRoute;

// src/components/ProtectedRoute.jsx - VERSION CORRIGÉE
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  // Vérifie TOUTES les clés possibles
  const token = localStorage.getItem('simplon_access_token') || 
                localStorage.getItem('token') ||
                localStorage.getItem('access_token');
  
  console.log('🔐 ProtectedRoute - vérification token:');
  console.log('📦 localStorage keys:', Object.keys(localStorage));
  console.log('✅ Token trouvé?:', !!token);
  
  // Si pas de token, redirige vers login
  if (!token) {
    console.log('🚫 Pas de token - Redirection vers /login');
    return <Navigate to="/login" replace />;
  }
  
  // Si admin requis, vérifie le rôle
  if (requireAdmin) {
    const userStr = localStorage.getItem('simplon_user') || 
                    localStorage.getItem('user');
    
    console.log('👤 Vérification admin - User data:', userStr);
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const isAdmin = user.role === 'admin' || 
                        user.isAdmin === true ||
                        user.role === 'ADMIN' ||
                        user.username === 'admin';
        
        console.log('🎭 Rôle utilisateur:', user.role);
        console.log('👑 Est admin?:', isAdmin);
        
        if (!isAdmin) {
          console.log('📤 Pas admin - Redirection vers /dashboard');
          return <Navigate to="/dashboard" replace />;
        }
      } catch (error) {
        console.error('❌ Erreur parsing user:', error);
        return <Navigate to="/dashboard" replace />;
      }
    }
  }
  
  console.log('✅ Accès autorisé');
  return children;
};

export default ProtectedRoute;