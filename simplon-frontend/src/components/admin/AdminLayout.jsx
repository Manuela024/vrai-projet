import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';
import ProjectManagement from './ProjectManagement';
import Analytics from './Analytics';
import { authService } from '../../services/auth';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  // Vérifier si l'utilisateur est admin
  const currentUser = authService.getCurrentUser();
  
  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const menuItems = [
    {
      title: "Tableau de Bord",
      icon: "dashboard",
      path: "/admin",
      component: AdminDashboard
    },
    {
      title: "Gestion Utilisateurs",
      icon: "people",
      path: "/admin/users",
      component: UserManagement
    },
    {
      title: "Gestion Projets",
      icon: "folder",
      path: "/admin/projects", 
      component: ProjectManagement
    },
    {
      title: "Statistiques",
      icon: "analytics",
      path: "/admin/analytics",
      component: Analytics
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#001F3F] text-white transition-all duration-300`}>
        <div className="flex items-center justify-between p-4 border-b border-[#003265]">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <img src="/src/logo.png" alt="Logo Simplon" className="size-8 rounded-full" />
              <span className="text-white font-semibold">Admin Simplon</span>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded hover:bg-[#003265]"
          >
            <span className="material-symbols-outlined">
              {sidebarOpen ? 'menu_open' : 'menu'}
            </span>
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                location.pathname === item.path 
                  ? 'bg-[#E30613] text-white' 
                  : 'text-white/80 hover:bg-[#003265] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium">{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-[#0d1a29] border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#001F3F] dark:text-white">
              {menuItems.find(item => item.path === location.pathname)?.title || 'Admin Dashboard'}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Connecté en tant que <strong>{currentUser.first_name} {currentUser.last_name}</strong>
              </span>
              <Link 
                to="/Home"
                className="bg-[#E30613] text-white px-4 py-2 rounded-lg hover:bg-[#E30613]/90 text-sm font-medium"
              >
                Retour au site
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            {menuItems.map((item) => (
              <Route 
                key={item.path} 
                path={item.path.replace('/admin', '')} 
                element={<item.component />} 
              />
            ))}
            <Route path="/" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;