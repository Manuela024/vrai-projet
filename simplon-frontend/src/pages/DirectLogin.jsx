// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { authService } from '../services/auth';

// const DirectLogin = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: ''
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData({
//       ...formData,
//       [id]: value
//     });
//     if (error) setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.username || !formData.password) {
//       setError('Veuillez remplir tous les champs');
//       return;
//     }

//     setIsLoading(true);
//     setError('');
    
//     try {
//       // Utilisez la connexion directe
//       await authService.directLogin(formData.username, formData.password);
//       navigate('/dashboard');
      
//     } catch (err) {
//       setError(err.message || 'Identifiants incorrects');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="relative flex h-auto min-h-screen w-full flex-col items-center justify-center bg-[#001F3F] p-4">
//       <div className="layout-container flex w-full max-w-md flex-col items-center">
        
//         {/* Logo */}
//         <div className="mb-8">
//           <img 
//             alt="Logo Simplon" 
//             className="h-10 w-auto" 
//             src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr2Hh8RdHugKXsMlpzt87rop1Xk7oFN4AsaTJDGNvVcD-0-qG4KsdlDxRy0ThwVhSw4Hizoz1aes7JycM9gX1hZct3xMzMTIp80qMTk5gPeDUgj1WKzKYbVBEpiXK2iQqir854bGaLeunLPwOKMNl_JS9ZLr8MOO9IxysxHsJWwlVfLLl3-JAXHkpKn9C43fZE7K0cw8itQFhEXxaBqw7RrVFWlqjjqxL-fOSY9wg3vmXJfXF7nE0xC9AG2CuNcsdgn6uOkqRZl0k"
//           />
//         </div>
        
//         {/* Formulaire */}
//         <div className="layout-content-container flex w-full flex-col items-center rounded-xl bg-white p-6 sm:p-8 md:p-10 shadow-lg">
//           <h1 className="text-center text-3xl font-bold leading-tight tracking-tight text-[#1c0d0e]">
//             Connexion Directe
//           </h1>
//           <p className="mt-2 text-center text-gray-500">
//             Mode développement - Utilisez vos identifiants Django
//           </p>
          
//           {error && (
//             <div className="mt-4 w-full p-3 bg-red-50 border border-red-400 rounded-lg">
//               <p className="text-red-700 text-sm text-center">{error}</p>
//             </div>
//           )}
          
//           <form onSubmit={handleSubmit} className="mt-8 w-full">
//             <div className="flex w-full flex-col gap-6">
              
//               <div className="flex w-full flex-col">
//                 <label htmlFor="username" className="mb-2 text-base font-medium leading-normal text-[#1c0d0e]">
//                   Nom d'utilisateur
//                 </label>
//                 <input
//                   id="username"
//                   type="text"
//                   placeholder="stell ou test@example.com"
//                   value={formData.username}
//                   onChange={handleChange}
//                   className="form-input h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border border-[#e9ced0] bg-[#fcf8f8] p-[15px] text-base font-normal leading-normal text-[#1c0d0e] placeholder:text-gray-400 focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>

//               <div className="flex w-full flex-col">
//                 <label htmlFor="password" className="mb-2 text-base font-medium leading-normal text-[#1c0d0e]">
//                   Mot de passe
//                 </label>
//                 <input
//                   id="password"
//                   type="password"
//                   placeholder="Votre mot de passe"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="form-input h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border border-[#e9ced0] bg-[#fcf8f8] p-[15px] text-base font-normal leading-normal text-[#1c0d0e] placeholder:text-gray-400 focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>
//             </div>

//             <div className="mt-8 flex w-full">
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className={`flex h-12 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg px-5 text-base font-bold leading-normal tracking-[0.015em] text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 ${
//                   isLoading 
//                     ? 'bg-gray-400 cursor-not-allowed' 
//                     : 'bg-[#E30613] hover:bg-[#E30613]/90 hover:scale-[1.02] active:scale-[0.98]'
//                 }`}
//               >
//                 {isLoading ? (
//                   <div className="flex items-center gap-2">
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     <span>Connexion...</span>
//                   </div>
//                 ) : (
//                   <span>Se connecter</span>
//                 )}
//               </button>
//             </div>

//             <div className="mt-6 text-center">
//               <button
//                 type="button"
//                 onClick={() => navigate('/login')}
//                 className="text-[#E30613] hover:text-[#E30613]/80 text-sm font-medium transition-colors"
//               >
//                 ← Retour au login normal
//               </button>
//             </div>
// {/* Ajoutez ce code dans le formulaire de connexion, après le bouton de connexion */}
// <div className="mt-4 text-center">
//   <button
//     type="button"
//     onClick={() => navigate('/forgot-password')}
//     className="text-[#E30613] hover:text-[#E30613]/80 text-sm font-medium transition-colors underline"
//   >
//     🔐 Mot de passe oublié ?
//   </button>
// </div>
//             <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//               <p className="text-yellow-700 text-sm text-center">
//                 <strong>Mode développement:</strong><br/>
//                 Utilisez: <code>stell</code> / votre mot de passe
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DirectLogin;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

const DirectLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
    if (error) setError('');
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   if (!formData.username || !formData.password) {
  //     setError('Veuillez remplir tous les champs');
  //     return;
  //   }

  //   setIsLoading(true);
  //   setError('');
    
  //   try {
  //     // Utilisez la connexion directe
  //     const userData = await authService.directLogin(formData.username, formData.password);
      
  //     // ✅ NOUVEAU CODE : Redirection selon le rôle
  //     if (formData.username === "admin" || formData.username === "admin@simplon.com" || formData.username.includes("admin")) {
  //       // Forcer le rôle admin
  //       const adminUser = {
  //         ...userData,
  //         role: "admin",
  //         first_name: userData.first_name || "Admin",
  //         last_name: userData.last_name || "Simplon"
  //       };
  //       localStorage.setItem('user', JSON.stringify(adminUser));
  //       console.log('🔑 Connexion admin réussie - Redirection vers /admin');
  //       navigate('/admin');
  //     } else {
  //       // Vérifier si l'utilisateur a déjà un rôle admin
  //       if (userData.role === 'admin') {
  //         console.log('🔑 Utilisateur admin détecté - Redirection vers /admin');
  //         navigate('/admin');
  //       } else {
  //         console.log('👤 Connexion utilisateur standard - Redirection vers /dashboard');
  //         navigate('/dashboard');
  //       }
  //     }
      
  //   } catch (err) {
  //     setError(err.message || 'Identifiants incorrects');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.username || !formData.password) {
    setError('Veuillez remplir tous les champs');
    return;
  }

  // ✅ DÉTECTION ADMIN - Créer un admin temporaire si identifiants admin
  if (formData.username === 'admin' && formData.password === 'Admin123!') {
    const tempAdmin = {
      id: 1,
      username: 'admin',
      email: 'admin@simplon.com',
      first_name: 'Admin',
      last_name: 'Simplon',
      role: 'admin',
      matricule: 'ADMIN001'
    };
    
    localStorage.setItem('user', JSON.stringify(tempAdmin));
    localStorage.setItem('access_token', 'admin-token-' + Date.now());
    
    console.log('✅ Connexion admin réussie - Redirection vers /admin');
    navigate('/admin');
    return;
  }

  setIsLoading(true);
  setError('');
  
  try {
    // Connexion normale pour les autres utilisateurs
    const userData = await authService.directLogin(formData.username, formData.password);
    
    // ✅ Redirection selon le rôle (si le backend renvoie un rôle)
    if (userData.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
    
  } catch (err) {
    setError(err.message || 'Identifiants incorrects');
  } finally {
    setIsLoading(false);
  }
};

  // ✅ NOUVEAU : Connexion rapide admin pour tests
  const handleQuickAdminLogin = () => {
    setFormData({
      username: 'admin',
      password: 'Admin123!'
    });
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col items-center justify-center bg-[#001F3F] p-4">
      <div className="layout-container flex w-full max-w-md flex-col items-center">
        
        {/* Logo */}
        <div className="mb-8">
          <img 
            alt="Logo Simplon" 
            className="h-10 w-auto" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr2Hh8RdHugKXsMlpzt87rop1Xk7oFN4AsaTJDGNvVcD-0-qG4KsdlDxRy0ThwVhSw4Hizoz1aes7JycM9gX1hZct3xMzMTIp80qMTk5gPeDUgj1WKzKYbVBEpiXK2iQqir854bGaLeunLPwOKMNl_JS9ZLr8MOO9IxysxHsJWwlVfLLl3-JAXHkpKn9C43fZE7K0cw8itQFhEXxaBqw7RrVFWlqjjqxL-fOSY9wg3vmXJfXF7nE0xC9AG2CuNcsdgn6uOkqRZl0k"
          />
        </div>
        
        {/* Formulaire */}
        <div className="layout-content-container flex w-full flex-col items-center rounded-xl bg-white p-6 sm:p-8 md:p-10 shadow-lg">
          <h1 className="text-center text-3xl font-bold leading-tight tracking-tight text-[#1c0d0e]">
            Connexion Directe
          </h1>
          <p className="mt-2 text-center text-gray-500">
            Mode développement - Utilisez vos identifiants Django
          </p>
          
          {/* ✅ NOUVEAU : Bouton de test admin */}
          {/* <div className="mt-4 w-full">
            <button
              onClick={handleQuickAdminLogin}
              className="w-full p-3 bg-purple-100 border border-purple-300 rounded-lg text-purple-700 text-sm font-medium hover:bg-purple-200 transition-colors"
            >
              🚀 Test Admin Rapide (Remplit les champs)
            </button>
            <p className="text-purple-600 text-xs text-center mt-1">
              Utilisateur: <strong>admin</strong> | Mot de passe: <strong>Admin123!</strong>
            </p>
          </div> */}
          {/* Indication des identifiants de test */}
<div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
  <p className="text-blue-700 text-sm text-center">
    <strong>Identifiants de test :</strong><br/>
    • Admin: <code>admin</code> / <code>Admin123!</code><br/>
    • Utilisateur normal: <code>stell</code> / votre mot de passe
  </p>
</div>
          
          {error && (
            <div className="mt-4 w-full p-3 bg-red-50 border border-red-400 rounded-lg">
              <p className="text-red-700 text-sm text-center">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="mt-6 w-full">
            <div className="flex w-full flex-col gap-6">
              
              <div className="flex w-full flex-col">
                <label htmlFor="username" className="mb-2 text-base font-medium leading-normal text-[#1c0d0e]">
                  Nom d'utilisateur
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="stell ou test@example.com"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-input h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border border-[#e9ced0] bg-[#fcf8f8] p-[15px] text-base font-normal leading-normal text-[#1c0d0e] placeholder:text-gray-400 focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex w-full flex-col">
                <label htmlFor="password" className="mb-2 text-base font-medium leading-normal text-[#1c0d0e]">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Votre mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border border-[#e9ced0] bg-[#fcf8f8] p-[15px] text-base font-normal leading-normal text-[#1c0d0e] placeholder:text-gray-400 focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="mt-8 flex w-full">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex h-12 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg px-5 text-base font-bold leading-normal tracking-[0.015em] text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#E30613] hover:bg-[#E30613]/90 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Connexion...</span>
                  </div>
                ) : (
                  <span>Se connecter</span>
                )}
              </button>
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-[#E30613] hover:text-[#E30613]/80 text-sm font-medium transition-colors"
              >
                ← Retour au login normal
              </button>
            </div>

            {/* Lien mot de passe oublié */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-[#E30613] hover:text-[#E30613]/80 text-sm font-medium transition-colors underline"
              >
                🔐 Mot de passe oublié ?
              </button>
            </div>

            {/* Info mode développement */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700 text-sm text-center">
                <strong>Mode développement:</strong><br/>
                Utilisez: <code>stell</code> / votre mot de passe<br/>
                <strong>Admin:</strong> <code>admin</code> / <code>Admin123!</code>
              </p>
            </div>

            {/* ✅ NOUVEAU : Lien direct vers admin */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => navigate('/admin-login')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors underline"
              >
                🎯 Accès administrateur dédié
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DirectLogin;