// // src/contexts/AuthContext.jsx
// import React, { createContext, useState, useContext, useEffect } from 'react';

// const AuthContext = createContext({});

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Connexion simple
//   const login = (email, password) => {
//     setLoading(true);
    
//     // Simulation
//     setTimeout(() => {
//       const mockUser = {
//         id: 1,
//         email: 'admin@simplon.com',
//         name: 'Admin',
//         role: 'admin'
//       };
      
//       localStorage.setItem('token', 'mock_token');
//       localStorage.setItem('user', JSON.stringify(mockUser));
//       setUser(mockUser);
//       setLoading(false);
      
//       return { success: true };
//     }, 500);
//   };

//   // Déconnexion
//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//   };

//   // Vérifications
//   const isAuthenticated = () => {
//     return !!localStorage.getItem('token');
//   };

//   const isAdmin = () => {
//     return user?.role === 'admin';
//   };

//   return (
//     <AuthContext.Provider value={{
//       user,
//       loading,
//       login,
//       logout,
//       isAuthenticated,
//       isAdmin
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


// // src/contexts/AuthContext.jsx
// import React, { createContext, useState, useContext, useEffect } from 'react';

// const AuthContext = createContext({});

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     // Charger l'utilisateur au démarrage
//     const storedUser = localStorage.getItem('simplon_user') || localStorage.getItem('user');
//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (e) {
//         console.error('Erreur parsing user:', e);
//       }
//     }
//   }, []);

//   const login = (email, password) => {
//     setLoading(true);
    
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         const mockUser = {
//           id: 1,
//           email: 'admin@simplon.com',
//           name: 'Admin',
//           role: 'admin',
//           username: 'admin'
//         };
        
//         localStorage.setItem('simplon_access_token', 'mock_token');
//         localStorage.setItem('simplon_user', JSON.stringify(mockUser));
//         setUser(mockUser);
//         setLoading(false);
        
//         resolve({ success: true, user: mockUser });
//       }, 500);
//     });
//   };

//   const logout = () => {
//     localStorage.removeItem('simplon_access_token');
//     localStorage.removeItem('simplon_user');
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//   };

//   const isAuthenticated = () => {
//     return !!localStorage.getItem('simplon_access_token') || !!localStorage.getItem('token');
//   };

//   const isAdmin = () => {
//     return user?.role === 'admin' || user?.isAdmin === true;
//   };

//   return (
//     <AuthContext.Provider value={{
//       user,
//       loading,
//       login,
//       logout,
//       isAuthenticated,
//       isAdmin
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


// // src/context/AuthContext.jsx
// import React, { createContext, useState, useContext, useEffect } from 'react';

// const AuthContext = createContext({});

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     // Charger l'utilisateur au démarrage
//     const storedUser = localStorage.getItem('simplon_user') || localStorage.getItem('user');
//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (e) {
//         console.error('Erreur parsing user:', e);
//       }
//     }
//   }, []);

//   const login = (email, password) => {
//     setLoading(true);
    
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         const mockUser = {
//           id: 1,
//           email: 'admin@simplon.com',
//           name: 'Admin',
//           role: 'admin',
//           username: 'admin'
//         };
        
//         localStorage.setItem('simplon_access_token', 'mock_token');
//         localStorage.setItem('simplon_user', JSON.stringify(mockUser));
//         setUser(mockUser);
//         setLoading(false);
        
//         resolve({ success: true, user: mockUser });
//       }, 500);
//     });
//   };

//   const logout = () => {
//     localStorage.removeItem('simplon_access_token');
//     localStorage.removeItem('simplon_user');
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//   };

//   const isAuthenticated = () => {
//     return !!localStorage.getItem('simplon_access_token') || !!localStorage.getItem('token');
//   };

//   const isAdmin = () => {
//     return user?.role === 'admin' || user?.isAdmin === true;
//   };

//   return (
//     <AuthContext.Provider value={{
//       user,
//       loading,
//       login,
//       logout,
//       isAuthenticated,
//       isAdmin
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


// src/context/AuthContext.jsx - VERSION CORRIGÉE
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  // Charger l'utilisateur au démarrage depuis authService
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Vérifier si un token existe
        const token = authService.getAccessToken();
        
        if (token) {
          // Récupérer l'utilisateur depuis authService
          const userData = authService.getCurrentUser();
          
          if (userData) {
            setUser(userData);
            setIsAuth(true);
          } else {
            // Essayer de synchroniser avec le backend
            const synced = await authService.syncWithDatabase();
            if (synced) {
              const refreshedUser = authService.getCurrentUser();
              setUser(refreshedUser);
              setIsAuth(true);
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
      }
    };

    loadUser();
  }, []);

  // Connexion avec le service auth
  const login = async (username, password) => {
    setLoading(true);
    
    try {
      const result = await authService.login(username, password);
      
      if (result.success) {
        setUser(result.user);
        setIsAuth(true);
        return { success: true, user: result.user };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return { success: false, message: error.message || 'Erreur de connexion' };
    } finally {
      setLoading(false);
    }
  };

  // Connexion rapide
  const quickLogin = async (username = 'admin') => {
    setLoading(true);
    
    try {
      const result = await authService.quickLogin(username, 'admin123');
      
      if (result.success) {
        setUser(result.user);
        setIsAuth(true);
        return { success: true, user: result.user };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Erreur de connexion rapide:', error);
      return { success: false, message: error.message || 'Erreur de connexion' };
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuth(false);
  };

  // Vérifier si authentifié
  const isAuthenticated = () => {
    return isAuth && !!authService.getAccessToken();
  };

  // Vérifier si admin
  const isAdmin = () => {
    return user?.is_staff || user?.role === 'admin' || user?.isAdmin === true;
  };

  // Rafraîchir l'utilisateur depuis le backend
  const refreshUser = async () => {
    try {
      const synced = await authService.syncWithDatabase();
      if (synced) {
        const refreshedUser = authService.getCurrentUser();
        setUser(refreshedUser);
        return true;
      }
    } catch (error) {
      console.error('Erreur de rafraîchissement:', error);
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: isAuthenticated(),
      isAdmin: isAdmin(),
      login,
      quickLogin,
      logout,
      refreshUser,
      authService // Exposer le service pour un accès direct si nécessaire
    }}>
      {children}
    </AuthContext.Provider>
  );
};