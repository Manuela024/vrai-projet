// src/components/AdminRedirect.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';

const AdminRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAndRedirect = async () => {
      console.log('🔄 Vérification du rôle pour redirection...');
      
      // Attendre un peu pour que l'authentification soit complète
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = authService.getCurrentUser();
      const isAdmin = authService.isAdmin();
      
      console.log('🔍 État actuel:', {
        user: user?.username,
        isAdmin: isAdmin,
        is_staff: user?.is_staff,
        is_superuser: user?.is_superuser
      });
      
      if (isAdmin) {
        console.log('✅ Admin détecté - Redirection vers /admin');
        navigate('/admin/dashboard', { replace: true });
      } else {
        console.log('👤 Utilisateur normal - Redirection vers /dashboard');
        navigate('/dashboard', { replace: true });
      }
    };

    checkAndRedirect();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#E30613] mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-[#001F3F] mb-2">Redirection en cours</h2>
        <p className="text-gray-600">Détection de votre rôle utilisateur...</p>
        <div className="mt-4 flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-[#E30613] rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-[#E30613] rounded-full animate-pulse delay-150"></div>
          <div className="w-2 h-2 bg-[#E30613] rounded-full animate-pulse delay-300"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminRedirect;