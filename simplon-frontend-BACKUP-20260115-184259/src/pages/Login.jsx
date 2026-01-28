// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import authService from '../services/auth'; // ⭐ CHANGEMENT ICI - import par défaut

// const Login = () => {
//   const [formData, setFormData] = useState({
//     matricule: '',
//     email: ''
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [successMessage, setSuccessMessage] = useState('');
  
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setFormData({
//       ...formData,
//       [id]: value
//     });
    
//     if (errors[id]) {
//       setErrors({
//         ...errors,
//         [id]: ''
//       });
//     }
    
//     if (successMessage) {
//       setSuccessMessage('');
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.matricule.trim()) {
//       newErrors.matricule = 'Le matricule est requis';
//     } else if (formData.matricule.length < 3) {
//       newErrors.matricule = 'Le matricule doit contenir au moins 3 caractères';
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = 'L\'email est requis';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'L\'email n\'est pas valide';
//     }

//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const formErrors = validateForm();
//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       return;
//     }

//     setIsLoading(true);
//     setErrors({});
    
//     try {
//       // 🔐 APPEL AU BACKEND POUR DEMANDER LE LIEN
//       const response = await authService.requestLoginLink(formData.matricule, formData.email);
      
//       if (response.success) {
//         setSuccessMessage('✅ Lien de connexion envoyé ! Vérifiez votre email.');
//       } else {
//         setErrors({ 
//           submit: response.message || 'Matricule et email ne correspondent pas' 
//         });
//       }
      
//     } catch (error) {
//       console.error('Erreur:', error);
//       setErrors({ 
//         submit: 'Erreur de connexion au serveur' 
//       });
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
//             Première connexion
//           </h1>
//           <p className="mt-2 text-center text-gray-500">
//             Recevez votre lien de connexion par email
//           </p>
          
//           {/* Message de succès */}
//           {successMessage && (
//             <div className="mt-4 w-full p-3 bg-green-50 border border-green-200 rounded-lg">
//               <p className="text-green-700 text-sm text-center">{successMessage}</p>
//             </div>
//           )}
          
//           {/* Message d'erreur général */}
//           {errors.submit && (
//             <div className="mt-4 w-full p-3 bg-red-50 border border-red-400 rounded-lg">
//               <p className="text-red-700 text-sm text-center">{errors.submit}</p>
//             </div>
//           )}
          
//           <form onSubmit={handleSubmit} className="mt-8 w-full">
//             <div className="flex w-full flex-col gap-6">
              
//               {/* Champ Matricule */}
//               <div className="flex w-full flex-col">
//                 <label 
//                   htmlFor="matricule" 
//                   className="mb-2 text-base font-medium leading-normal text-[#1c0d0e]"
//                 >
//                   Matricule Simplon
//                 </label>
//                 <input
//                   id="matricule"
//                   type="text"
//                   placeholder="Ex: simplon_2025002"
//                   value={formData.matricule}
//                   onChange={handleChange}
//                   className={`form-input h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border p-[15px] text-base font-normal leading-normal text-[#1c0d0e] placeholder:text-gray-400 focus:outline-0 focus:ring-2 focus:ring-primary/20 transition-colors ${
//                     errors.matricule 
//                       ? 'border-red-300 bg-red-50 focus:border-red-500' 
//                       : 'border-[#e9ced0] bg-[#fcf8f8] focus:border-primary/50'
//                   }`}
//                   required
//                   disabled={isLoading}
//                 />
//                 {errors.matricule && (
//                   <p className="mt-1 text-red-600 text-sm">{errors.matricule}</p>
//                 )}
//               </div>

//               {/* Champ Email */}
//               <div className="flex w-full flex-col">
//                 <label 
//                   htmlFor="email" 
//                   className="mb-2 text-base font-medium leading-normal text-[#1c0d0e]"
//                 >
//                   Email institutionnel
//                 </label>
//                 <input
//                   id="email"
//                   type="email"
//                   placeholder="votre.email@simplon.com"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className={`form-input h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border p-[15px] text-base font-normal leading-normal text-[#1c0d0e] placeholder:text-gray-400 focus:outline-0 focus:ring-2 focus:ring-primary/20 transition-colors ${
//                     errors.email 
//                       ? 'border-red-300 bg-red-50 focus:border-red-500' 
//                       : 'border-[#e9ced0] bg-[#fcf8f8] focus:border-primary/50'
//                   }`}
//                   required
//                   disabled={isLoading}
//                 />
//                 {errors.email && (
//                   <p className="mt-1 text-red-600 text-sm">{errors.email}</p>
//                 )}
//               </div>
//             </div>

//             {/* Bouton de soumission */}
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
//                     <span className="truncate">Envoi en cours...</span>
//                   </div>
//                 ) : (
//                   <span className="truncate">Recevoir mon lien de connexion</span>
//                 )}
//               </button>
//             </div>

//             {/* Lien de retour */}
//             <div className="mt-6 text-center">
//               <button
//                 type="button"
//                 onClick={() => navigate('/')}
//                 className="text-[#E30613] hover:text-[#E30613]/80 text-sm font-medium transition-colors"
//                 disabled={isLoading}
//               >
//                 ← Retour à l'accueil
//               </button>
//             </div>

//             <p className="mt-6 text-center text-sm text-gray-500">
//               Vous recevrez un lien sécurisé par email pour créer votre mot de passe.
//             </p>
//           </form>
//         </div>

//         {/* Footer */}
//         <div className="mt-8 text-center">
//           <p className="text-white/70 text-sm">
//             © 2025 Simplon.co - Plateforme interne
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


// // src/pages/Login.jsx
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import authService from '../services/auth'; // ⭐ CHANGEMENT ICI - import par défaut

// const Login = () => {
//   const [matricule, setMatricule] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       await authService.quickLogin(matricule, password); // ⭐ UTILISATION DIRECTE
//       navigate('/dashboard');
//     } catch (err) {
//       setError(err.message || 'Erreur de connexion');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Connexion
//           </h2>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//               {error}
//             </div>
//           )}
          
//           <div>
//             <label htmlFor="matricule" className="block text-sm font-medium text-gray-700">
//               Matricule
//             </label>
//             <input
//               id="matricule"
//               name="matricule"
//               type="text"
//               required
//               value={matricule}
//               onChange={(e) => setMatricule(e.target.value)}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E30613] focus:border-[#E30613]"
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//               Mot de passe
//             </label>
//             <input
//               id="password"
//               name="password"
//               type="password"
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#E30613] focus:border-[#E30613]"
//             />
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#E30613] hover:bg-[#c40511] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E30613] disabled:opacity-50"
//             >
//               {loading ? 'Connexion...' : 'Se connecter'}
//             </button>
//           </div>

//           <div className="text-center">
//             <Link to="/forgot-password" className="text-sm text-[#E30613] hover:text-[#c40511]">
//               Mot de passe oublié ?
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;


// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth'; // ✅ Import par défaut corrigé

const Login = () => {
  const [formData, setFormData] = useState({
    matricule: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
    
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: ''
      });
    }
    
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.matricule.trim()) {
      newErrors.matricule = 'Le matricule est requis';
    } else if (formData.matricule.length < 3) {
      newErrors.matricule = 'Le matricule doit contenir au moins 3 caractères';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      // 🔐 APPEL AU BACKEND POUR DEMANDER LE LIEN
      const response = await authService.requestLoginLink(formData.matricule, formData.email);
      
      if (response.success) {
        setSuccessMessage('✅ Lien de connexion envoyé ! Vérifiez votre email.');
      } else {
        setErrors({ 
          submit: response.message || 'Matricule et email ne correspondent pas' 
        });
      }
      
    } catch (error) {
      console.error('Erreur:', error);
      setErrors({ 
        submit: 'Erreur de connexion au serveur' 
      });
    } finally {
      setIsLoading(false);
    }
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
            Première connexion
          </h1>
          <p className="mt-2 text-center text-gray-500">
            Recevez votre lien de connexion par email
          </p>
          
          {/* Message de succès */}
          {successMessage && (
            <div className="mt-4 w-full p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm text-center">{successMessage}</p>
            </div>
          )}
          
          {/* Message d'erreur général */}
          {errors.submit && (
            <div className="mt-4 w-full p-3 bg-red-50 border border-red-400 rounded-lg">
              <p className="text-red-700 text-sm text-center">{errors.submit}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="mt-8 w-full">
            <div className="flex w-full flex-col gap-6">
              
              {/* Champ Matricule */}
              <div className="flex w-full flex-col">
                <label 
                  htmlFor="matricule" 
                  className="mb-2 text-base font-medium leading-normal text-[#1c0d0e]"
                >
                  Matricule Simplon
                </label>
                <input
                  id="matricule"
                  type="text"
                  placeholder="Ex: simplon_2025002"
                  value={formData.matricule}
                  onChange={handleChange}
                  className={`form-input h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border p-[15px] text-base font-normal leading-normal text-[#1c0d0e] placeholder:text-gray-400 focus:outline-0 focus:ring-2 focus:ring-primary/20 transition-colors ${
                    errors.matricule 
                      ? 'border-red-300 bg-red-50 focus:border-red-500' 
                      : 'border-[#e9ced0] bg-[#fcf8f8] focus:border-primary/50'
                  }`}
                  required
                  disabled={isLoading}
                />
                {errors.matricule && (
                  <p className="mt-1 text-red-600 text-sm">{errors.matricule}</p>
                )}
              </div>

              {/* Champ Email */}
              <div className="flex w-full flex-col">
                <label 
                  htmlFor="email" 
                  className="mb-2 text-base font-medium leading-normal text-[#1c0d0e]"
                >
                  Email institutionnel
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="votre.email@simplon.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border p-[15px] text-base font-normal leading-normal text-[#1c0d0e] placeholder:text-gray-400 focus:outline-0 focus:ring-2 focus:ring-primary/20 transition-colors ${
                    errors.email 
                      ? 'border-red-300 bg-red-50 focus:border-red-500' 
                      : 'border-[#e9ced0] bg-[#fcf8f8] focus:border-primary/50'
                  }`}
                  required
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="mt-1 text-red-600 text-sm">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Bouton de soumission */}
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
                    <span className="truncate">Envoi en cours...</span>
                  </div>
                ) : (
                  <span className="truncate">Recevoir mon lien de connexion</span>
                )}
              </button>
            </div>

            {/* Lien de retour */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-[#E30613] hover:text-[#E30613]/80 text-sm font-medium transition-colors"
                disabled={isLoading}
              >
                ← Retour à l'accueil
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-gray-500">
              Vous recevrez un lien sécurisé par email pour créer votre mot de passe.
            </p>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/70 text-sm">
            © 2025 Simplon.co - Plateforme interne
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;