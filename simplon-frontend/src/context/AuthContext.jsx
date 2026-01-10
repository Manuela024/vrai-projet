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


// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Charger l'utilisateur au démarrage
    const storedUser = localStorage.getItem('simplon_user') || localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Erreur parsing user:', e);
      }
    }
  }, []);

  const login = (email, password) => {
    setLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = {
          id: 1,
          email: 'admin@simplon.com',
          name: 'Admin',
          role: 'admin',
          username: 'admin'
        };
        
        localStorage.setItem('simplon_access_token', 'mock_token');
        localStorage.setItem('simplon_user', JSON.stringify(mockUser));
        setUser(mockUser);
        setLoading(false);
        
        resolve({ success: true, user: mockUser });
      }, 500);
    });
  };

  const logout = () => {
    localStorage.removeItem('simplon_access_token');
    localStorage.removeItem('simplon_user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('simplon_access_token') || !!localStorage.getItem('token');
  };

  const isAdmin = () => {
    return user?.role === 'admin' || user?.isAdmin === true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAuthenticated,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};