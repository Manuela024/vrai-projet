

// // src/App.jsx - AVEC MIGRATION
// import React, { useEffect } from 'react';
// import { ProjectProvider } from './context/ProjectContext';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import ProtectedRoute from './components/ProtectedRoute';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import UploadProject from './pages/UploadProject';
// import ExploreProjects from './pages/ExploreProjects';
// import ProjectDetail from './pages/ProjectDetail';
// import Profile from './pages/Profile';
// import ProjectSuccess from './pages/ProjectSuccess';
// import Home from './pages/Home';
// import SetupPassword from './pages/SetupPassword';
// import DirectLogin from './pages/DirectLogin';
// import QuickLogin from './pages/QuickLogin';
// import ForgotPassword from './pages/ForgotPassword';
// import ResetPassword from './pages/ResetPassword';
// import Parametre from './pages/Parametre';
// import AdminLayout from './components/admin/AdminLayout';
// import { migrateAuthKeys } from './utils/migrateAuthKeys';

// function App() {
//   useEffect(() => {
//     // Migrer les clés au démarrage
//     migrateAuthKeys();
    
//     // Debug
//     console.log('🚀 App démarrée');
//     console.log('Keys in localStorage:', Object.keys(localStorage));
//   }, []);

//   return (
//     <ProjectProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/quick-login" element={<QuickLogin />} />
//           <Route path="/setup-password" element={<SetupPassword />} />
//           <Route path="/direct-login" element={<DirectLogin />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/reset-password" element={<ResetPassword />} />
          
//           <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//           <Route path="/upload" element={<ProtectedRoute><UploadProject /></ProtectedRoute>} />
//           <Route path="/explore" element={<ProtectedRoute><ExploreProjects /></ProtectedRoute>} />
//           <Route path="/project/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
//           <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
//           <Route path="/project-success" element={<ProtectedRoute><ProjectSuccess /></ProtectedRoute>} />
//           <Route path="/parametre" element={<ProtectedRoute><Parametre /></ProtectedRoute>} />
          
//           <Route path="/admin/*" element={<ProtectedRoute requireAdmin={true}><AdminLayout /></ProtectedRoute>} />
          
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </BrowserRouter>
//     </ProjectProvider>
//   );
// }

// export default App;


// // src/App.jsx - VERSION CORRIGÉE
// import React, { useEffect } from 'react';
// import { migrateAuthKeys } from './utils/migrateAuthKeys';
// import { ProjectProvider } from './context/ProjectContext';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import ProtectedRoute from './components/ProtectedRoute';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import UploadProject from './pages/UploadProject';
// import ExploreProjects from './pages/ExploreProjects';
// import ProjectDetail from './pages/ProjectDetail';
// import Profile from './pages/Profile';
// import ProjectSuccess from './pages/ProjectSuccess';
// import Home from './pages/Home';
// import SetupPassword from './pages/SetupPassword';
// import DirectLogin from './pages/DirectLogin';
// import QuickLogin from './pages/QuickLogin';
// import ForgotPassword from './pages/ForgotPassword';
// import ResetPassword from './pages/ResetPassword';
// import Parametre from './pages/Parametre';
// import AdminLayout from './components/admin/AdminLayout';

// // Fonction de migration simple (sans import)
// const migrateAuthKeys = () => {
//   console.log('🔄 Migration des clés d\'authentification...');
  
//   // Migration de 'access_token' vers 'simplon_access_token'
//   const oldToken = localStorage.getItem('access_token');
//   if (oldToken) {
//     localStorage.setItem('simplon_access_token', oldToken);
//     console.log('✅ Token migré');
//   }
  
//   // Migration de 'user' vers 'simplon_user'
//   const oldUser = localStorage.getItem('user');
//   if (oldUser) {
//     localStorage.setItem('simplon_user', oldUser);
//     console.log('✅ User migré');
//   }
// };

// function App() {
//   useEffect(() => {
//     // Exécuter la migration au démarrage
//     migrateAuthKeys();
    
//     // Debug
//     console.log('🚀 Application démarrée');
//     console.log('📦 localStorage keys:', Object.keys(localStorage));
    
//     // Vérifier l'état de l'authentification
//     const user = localStorage.getItem('simplon_user');
//     const token = localStorage.getItem('simplon_access_token');
    
//     console.log('🔐 État auth:', {
//       hasUser: !!user,
//       hasToken: !!token,
//       user: user ? JSON.parse(user) : null
//     });
//   }, []);

//   return (
//     <ProjectProvider>
//       <BrowserRouter>
//         <Routes>
//           {/* Routes publiques */}
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/quick-login" element={<QuickLogin />} />
//           <Route path="/setup-password" element={<SetupPassword />} />
//           <Route path="/direct-login" element={<DirectLogin />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/reset-password" element={<ResetPassword />} />
          
//           {/* Routes protégées utilisateur */}
//           <Route path="/dashboard" element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           } />
//           <Route path="/upload" element={
//             <ProtectedRoute>
//               <UploadProject />
//             </ProtectedRoute>
//           } />
//           <Route path="/explore" element={
//             <ProtectedRoute>
//               <ExploreProjects />
//             </ProtectedRoute>
//           } />
//           <Route path="/project/:id" element={
//             <ProtectedRoute>
//               <ProjectDetail />
//             </ProtectedRoute>
//           } />
//           <Route path="/profile" element={
//             <ProtectedRoute>
//               <Profile />
//             </ProtectedRoute>
//           } />
//           <Route path="/project-success" element={
//             <ProtectedRoute>
//               <ProjectSuccess />
//             </ProtectedRoute>
//           } />
//           <Route path="/parametre" element={
//             <ProtectedRoute>
//               <Parametre />
//             </ProtectedRoute>
//           } />
          
//           {/* Routes admin */}
//           <Route path="/admin/*" element={
//             <ProtectedRoute requireAdmin={true}>
//               <AdminLayout />
//             </ProtectedRoute>
//           } />
          
//           {/* Route 404 */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </BrowserRouter>
//     </ProjectProvider>
//   );
// }

// export default App;

// // src/App.jsx - VOTRE VERSION ORIGINALE CORRIGÉE
// import React, { useEffect } from 'react';
// import { ProjectProvider } from './context/ProjectContext';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import ProtectedRoute from './components/ProtectedRoute';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import UploadProject from './pages/UploadProject';
// import ExploreProjects from './pages/ExploreProjects';
// import ProjectDetail from './pages/ProjectDetail';
// import Profile from './pages/Profile';
// import ProjectSuccess from './pages/ProjectSuccess';
// import Home from './pages/Home';
// import SetupPassword from './pages/SetupPassword';
// import DirectLogin from './pages/DirectLogin';
// import QuickLogin from './pages/QuickLogin';
// import ForgotPassword from './pages/ForgotPassword';
// import ResetPassword from './pages/ResetPassword';
// import Parametre from './pages/Parametre';
// import ProjectDetail from './components/admin/ProjectDetail';
// import AdminLayout from './components/admin/AdminLayout';

// // DEBUG: Vérifier les imports
// console.log('🔍 DEBUG - Vérification des imports:');
// console.log('ProjectProvider:', typeof ProjectProvider);
// console.log('ProtectedRoute:', typeof ProtectedRoute);
// console.log('AdminLayout:', typeof AdminLayout);
// console.log('Login:', typeof Login);

// function App() {
//   useEffect(() => {
//     console.log('🚀 Application Simplon démarrée');
//   }, []);

//   return (
//     <ProjectProvider>
//       <BrowserRouter>
//         <Routes>
//           {/* Routes publiques */}
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/quick-login" element={<QuickLogin />} />
//           <Route path="/setup-password" element={<SetupPassword />} />
//           <Route path="/direct-login" element={<DirectLogin />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/reset-password" element={<ResetPassword />} />
//            <Route path="/admin/projects/:id" element={<ProjectDetail />} />
          
//           {/* Routes protégées utilisateur */}
//           <Route path="/dashboard" element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           } />
//           <Route path="/upload" element={
//             <ProtectedRoute>
//               <UploadProject />
//             </ProtectedRoute>
//           } />
//           <Route path="/explore" element={
//             <ProtectedRoute>
//               <ExploreProjects />
//             </ProtectedRoute>
//           } />
//           <Route path="/project/:id" element={
//             <ProtectedRoute>
//               <ProjectDetail />
//             </ProtectedRoute>
//           } />
//           <Route path="/profile" element={
//             <ProtectedRoute>
//               <Profile />
//             </ProtectedRoute>
//           } />
//           <Route path="/project-success" element={
//             <ProtectedRoute>
//               <ProjectSuccess />
//             </ProtectedRoute>
//           } />
//           <Route path="/parametre" element={
//             <ProtectedRoute>
//               <Parametre />
//             </ProtectedRoute>
//           } />
          
//           {/* Routes admin */}
//           <Route path="/admin/*" element={
//             <ProtectedRoute requireAdmin={true}>
//               <AdminLayout />
//             </ProtectedRoute>
//           } />
          
//           {/* Route 404 */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </BrowserRouter>
//     </ProjectProvider>
//   );
// }

// export default App;

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from './contexts/AuthContext';
// import ProtectedRoute from './components/ProtectedRoute';

// // Import des pages publiques
// import LandingPage from './pages/LandingPage';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import ResetPassword from './pages/ResetPassword';
// import Parametre from './pages/Parametre';

// // Import des composants admin
// import AdminLayout from './components/admin/AdminLayout';
// import ProjectManagement from './components/admin/ProjectManagement';
// import UserManagement from './components/admin/UserManagement';
// import Analytics from './components/admin/Analytics';
// import Settings from './components/admin/Settings';
// import Profile from './components/admin/Profile';
// import SubmitProject from './components/admin/SubmitProject';
// import Explore from './components/admin/Explore';
// import ProjectDetail from './components/admin/ProjectDetail'; // UNE SEULE FOIS

// // Import des autres pages
// import Dashboard from './pages/Dashboard';
// import ExplorePage from './pages/ExplorePage';

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           {/* Routes publiques */}
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/reset-password" element={<ResetPassword />} />
//           <Route path="/parametre" element={<Parametre />} />
          
//           {/* Route protégée pour Dashboard */}
//           <Route path="/dashboard" element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           } />
          
//           {/* Route protégée pour ExplorePage */}
//           <Route path="/explore" element={
//             <ProtectedRoute>
//               <ExplorePage />
//             </ProtectedRoute>
//           } />
          
//           {/* Routes Admin */}
//           <Route path="/admin" element={
//             <ProtectedRoute requireAdmin={true}>
//               <AdminLayout />
//             </ProtectedRoute>
//           }>
//             <Route index element={<Navigate to="project-management" replace />} />
//             <Route path="project-management" element={<ProjectManagement />} />
//             <Route path="user-management" element={<UserManagement />} />
//             <Route path="analytics" element={<Analytics />} />
//             <Route path="settings" element={<Settings />} />
//             <Route path="profile" element={<Profile />} />
//             <Route path="submit-project" element={<SubmitProject />} />
//             <Route path="explore" element={<Explore />} />
            
//             {/* Route pour les détails du projet - IMPORTANT */}
//             <Route path="projects/:id" element={<ProjectDetail />} />
            
//             {/* Redirection par défaut pour les routes admin inconnues */}
//             <Route path="*" element={<Navigate to="project-management" replace />} />
//           </Route>
          
//           {/* Redirection par défaut */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;


// // src/App.jsx - VERSION FINALE PROPRE
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// // Import des pages publiques
// import LandingPage from './pages/LandingPage';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import ResetPassword from './pages/ResetPassword';

// // Import des composants admin
// import AdminLayout from './components/admin/AdminLayout';
// import ProjectManagement from './components/admin/ProjectManagement';
// import UserManagement from './components/admin/UserManagement';
// import Analytics from './components/admin/Analytics';
// import Settings from './components/admin/Settings';
// import Profile from './components/admin/Profile';
// import SubmitProject from './components/admin/SubmitProject';
// import Explore from './components/admin/Explore';
// import ProjectDetail from './components/admin/ProjectDetail';

// // Import des autres pages
// import Dashboard from './pages/Dashboard';
// import ExplorePage from './pages/ExplorePage';

// // Composants
// import ProtectedRoute from './components/ProtectedRoute';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Route d'accueil PUBLIQUE */}
//         <Route path="/" element={<LandingPage />} />
        
//         {/* Routes publiques d'authentification */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/reset-password" element={<ResetPassword />} />
        
//         {/* Route protégée pour Dashboard */}
//         <Route path="/dashboard" element={
//           <ProtectedRoute>
//             <Dashboard />
//           </ProtectedRoute>
//         } />
        
//         {/* Route protégée pour ExplorePage */}
//         <Route path="/explore" element={
//           <ProtectedRoute>
//             <ExplorePage />
//           </ProtectedRoute>
//         } />
        
//         {/* Routes Admin */}
//         <Route path="/admin" element={
//           <ProtectedRoute requireAdmin={true}>
//             <AdminLayout />
//           </ProtectedRoute>
//         }>
//           <Route index element={<Navigate to="project-management" replace />} />
//           <Route path="project-management" element={<ProjectManagement />} />
//           <Route path="user-management" element={<UserManagement />} />
//           <Route path="analytics" element={<Analytics />} />
//           <Route path="settings" element={<Settings />} />
//           <Route path="profile" element={<Profile />} />
//           <Route path="submit-project" element={<SubmitProject />} />
//           <Route path="explore" element={<Explore />} />
          
//           {/* IMPORTANT : Route pour les détails du projet */}
//           <Route path="projects/:id" element={<ProjectDetail />} />
//         </Route>
        
//         {/* Redirection par défaut */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// // Import des pages publiques
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import ResetPassword from './pages/ResetPassword';

// // Import des pages utilisateur
// import Dashboard from './pages/Dashboard';
// import ExplorePage from './pages/ExplorePage';

// // Import des composants admin
// import AdminLayout from './components/admin/AdminLayout';
// import ProjectManagement from './components/admin/ProjectManagement';
// import UserManagement from './components/admin/UserManagement';
// import Analytics from './components/admin/Analytics';
// import Settings from './components/admin/Settings';
// import Profile from './components/admin/Profile';
// import SubmitProject from './components/admin/SubmitProject';
// import Explore from './components/admin/Explore';
// import ProjectDetail from './components/admin/ProjectDetail';

// // Composants
// import ProtectedRoute from './components/ProtectedRoute';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Route d'accueil PUBLIQUE */}
//         <Route path="/" element={<LandingPage />} />
        
//         {/* Routes publiques d'authentification */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/reset-password" element={<ResetPassword />} />
        
//         {/* Route protégée pour Dashboard utilisateur */}
//         <Route path="/dashboard" element={
//           <ProtectedRoute>
//             <Dashboard />
//           </ProtectedRoute>
//         } />
        
//         {/* Route protégée pour ExplorePage utilisateur */}
//         <Route path="/explore" element={
//           <ProtectedRoute>
//             <ExplorePage />
//           </ProtectedRoute>
//         } />
        
//         {/* Routes Admin */}
//         <Route path="/admin" element={
//           <ProtectedRoute requireAdmin={true}>
//             <AdminLayout />
//           </ProtectedRoute>
//         }>
//           <Route index element={<Navigate to="project-management" replace />} />
//           <Route path="project-management" element={<ProjectManagement />} />
//           <Route path="user-management" element={<UserManagement />} />
//           <Route path="analytics" element={<Analytics />} />
//           <Route path="settings" element={<Settings />} />
//           <Route path="profile" element={<Profile />} />
//           <Route path="submit-project" element={<SubmitProject />} />
//           <Route path="explore" element={<Explore />} />
          
//           {/* IMPORTANT : Route pour les détails du projet */}
//           <Route path="projects/:id" element={<ProjectDetail />} />
//         </Route>
        
//         {/* Redirection par défaut */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// // Import des pages publiques - UTILISEZ Home
// import Home from './pages/Home';  // VOTRE VRAIE PAGE D'ACCUEIL
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import ResetPassword from './pages/ResetPassword';

// // Import des pages utilisateur
// import Dashboard from './pages/Dashboard';
// import ExplorePage from './pages/ExplorePage';

// // Import des composants admin
// import AdminLayout from './components/admin/AdminLayout';
// import ProjectManagement from './components/admin/ProjectManagement';
// import UserManagement from './components/admin/UserManagement';
// import Analytics from './components/admin/Analytics';
// import Settings from './components/admin/Settings';
// import Profile from './components/admin/Profile';
// import SubmitProject from './components/admin/SubmitProject';
// import Explore from './components/admin/Explore';
// import ProjectDetail from './components/admin/ProjectDetail';

// // Composants
// import ProtectedRoute from './components/ProtectedRoute';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Route d'accueil - VOTRE Home.jsx */}
//         <Route path="/" element={<Home />} />
        
//         {/* Routes publiques d'authentification */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/reset-password" element={<ResetPassword />} />
        
//         {/* Route protégée pour Dashboard utilisateur */}
//         <Route path="/dashboard" element={
//           <ProtectedRoute>
//             <Dashboard />
//           </ProtectedRoute>
//         } />
        
//         {/* Route protégée pour ExplorePage utilisateur */}
//         <Route path="/explore" element={
//           <ProtectedRoute>
//             <ExplorePage />
//           </ProtectedRoute>
//         } />
        
//         {/* Routes Admin */}
//         <Route path="/admin" element={
//           <ProtectedRoute requireAdmin={true}>
//             <AdminLayout />
//           </ProtectedRoute>
//         }>
//           <Route index element={<Navigate to="project-management" replace />} />
//           <Route path="project-management" element={<ProjectManagement />} />
//           <Route path="user-management" element={<UserManagement />} />
//           <Route path="analytics" element={<Analytics />} />
//           <Route path="settings" element={<Settings />} />
//           <Route path="profile" element={<Profile />} />
//           <Route path="submit-project" element={<SubmitProject />} />
//           <Route path="explore" element={<Explore />} />
          
//           {/* Route pour les détails du projet */}
//           <Route path="projects/:id" element={<ProjectDetail />} />
//         </Route>
        
//         {/* Redirection par défaut */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// // Import des pages publiques
// import Home from './pages/Home';
// import Login from './pages/Login';
// import QuickLogin from './pages/QuickLogin';  // IMPORTANT !
// import Signup from './pages/Signup';
// import ResetPassword from './pages/ResetPassword';

// // Import des pages utilisateur
// import Dashboard from './pages/Dashboard';
// import ExplorePage from './pages/ExplorePage';

// // Import des composants admin
// import AdminLayout from './components/admin/AdminLayout';
// import ProjectManagement from './components/admin/ProjectManagement';
// import UserManagement from './components/admin/UserManagement';
// import Analytics from './components/admin/Analytics';
// import Settings from './components/admin/Settings';
// import Profile from './components/admin/Profile';
// import SubmitProject from './components/admin/SubmitProject';
// import Explore from './components/admin/Explore';
// import ProjectDetail from './components/admin/ProjectDetail';

// // Composants
// import ProtectedRoute from './components/ProtectedRoute';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Route d'accueil */}
//         <Route path="/" element={<Home />} />
        
//         {/* Routes publiques d'authentification */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/quick-login" element={<QuickLogin />} />  {/* IMPORTANT ! */}
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/reset-password" element={<ResetPassword />} />
        
//         {/* Route protégée pour Dashboard utilisateur */}
//         <Route path="/dashboard" element={
//           <ProtectedRoute>
//             <Dashboard />
//           </ProtectedRoute>
//         } />
        
//         {/* Route protégée pour ExplorePage utilisateur */}
//         <Route path="/explore" element={
//           <ProtectedRoute>
//             <ExplorePage />
//           </ProtectedRoute>
//         } />
        
//         {/* Routes Admin */}
//         <Route path="/admin" element={
//           <ProtectedRoute requireAdmin={true}>
//             <AdminLayout />
//           </ProtectedRoute>
//         }>
//           <Route index element={<Navigate to="project-management" replace />} />
//           <Route path="project-management" element={<ProjectManagement />} />
//           <Route path="user-management" element={<UserManagement />} />
//           <Route path="analytics" element={<Analytics />} />
//           <Route path="settings" element={<Settings />} />
//           <Route path="profile" element={<Profile />} />
//           <Route path="submit-project" element={<SubmitProject />} />
//           <Route path="explore" element={<Explore />} />
          
//           {/* Route pour les détails du projet */}
//           <Route path="projects/:id" element={<ProjectDetail />} />
//         </Route>
        
//         {/* Redirection par défaut */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


// // src/App.jsx - VERSION CORRIGÉE
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext'; // Vérifiez le chemin !
// import ProtectedRoute from './components/ProtectedRoute';
// import AdminLayout from './components/admin/AdminLayout'; // Importez AdminLayout
// import Home from './pages/Home';
// import Dashboard from './pages/Dashboard';
// import QuickLogin from './pages/QuickLogin';
// // ... autres imports

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <Routes>
//           {/* Route publique */}
//           <Route path="/" element={<Home />} />
//           <Route path="/quick-login" element={<QuickLogin />} />
          
//           {/* Route protégée utilisateur */}
//           <Route path="/dashboard" element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           } />
          
//           {/* Route admin - UNIQUEMENT AdminLayout */}
//           <Route path="/admin/*" element={
//             <ProtectedRoute requireAdmin={true}>
//               <AdminLayout /> {/* AdminLayout gère TOUTES les pages admin */}
//             </ProtectedRoute>
//           } />
          
//           {/* Route 404 */}
//           <Route path="*" element={<div>404 - Page non trouvée</div>} />
//         </Routes>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;


// // src/App.jsx - VERSION AVEC ROUTES NESTÉES
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import ProtectedRoute from './components/ProtectedRoute';
// import AdminLayout from './components/admin/AdminLayout';
// import AdminDashboard from './components/admin/AdminDashboard';
// import UserManagement from './components/admin/UserManagement';
// import ProjectManagement from './components/admin/ProjectManagement';
// import SubmitProject from './components/admin/SubmitProject';
// import Explore from './components/admin/Explore';
// import Analytics from './components/admin/Analytics';
// import Profile from './components/admin/Profile';
// import Settings from './components/admin/Settings';
// import Home from './pages/Home';
// import Dashboard from './pages/Dashboard';
// import QuickLogin from './pages/QuickLogin';
// import Login from './pages/Login';
// import ProjectSuccess from './components/admin/ProjectSuccess';

// function App() {
//   return (
//     <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
//       <AuthProvider>
//         <Routes>
//           {/* Routes publiques */}
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/quick-login" element={<QuickLogin />} />
          
//           {/* Route protégée utilisateur */}
//           <Route path="/dashboard" element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           } />
          
//           {/* Routes admin - NESTÉES dans AdminLayout */}
//           <Route path="/admin" element={
//             <ProtectedRoute requireAdmin={true}>
//               <AdminLayout />
//             </ProtectedRoute>
//           }>
//             <Route index element={<AdminDashboard />} />
//             <Route path="submit-project" element={<SubmitProject />} />
//             <Route path="explore" element={<Explore />} />
//             <Route path="users" element={<UserManagement />} />
//             <Route path="projects" element={<ProjectManagement />} />
//             <Route path="analytics" element={<Analytics />} />
//             <Route path="profile" element={<Profile />} />
//             <Route path="settings" element={<Settings />} />
//             <Route path="/admin/projects/success" element={<ProjectSuccess />} />

//             <Route path="projects/:id/edit" element={<ProjectEdit />} />

//             <Route path="*" element={<Navigate to="/admin" replace />} />
//           </Route>
          
//           {/* Route 404 */}
//           <Route path="*" element={
//             <div className="flex items-center justify-center h-screen">
//               <div className="text-center">
//                 <h1 className="text-4xl font-bold text-[#001F3F] mb-4">404</h1>
//                 <p className="text-gray-600">Page non trouvée</p>
//                 <a href="/" className="mt-4 inline-block text-[#E30613] hover:underline">
//                   Retour à l'accueil
//                 </a>
//               </div>
//             </div>
//           } />
//         </Routes>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;

// // src/App.jsx - VERSION CORRIGÉE (SANS ProjectEdit)
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import ProtectedRoute from './components/ProtectedRoute';
// import AdminLayout from './components/admin/AdminLayout';
// import AdminDashboard from './components/admin/AdminDashboard';
// import UserManagement from './components/admin/UserManagement';
// import ProjectManagement from './components/admin/ProjectManagement';
// import SubmitProject from './components/admin/SubmitProject';
// import Explore from './components/admin/Explore';
// import Analytics from './components/admin/Analytics';
// import Profile from './components/admin/Profile';
// import Settings from './components/admin/Settings';
// import Home from './pages/Home';
// import Dashboard from './pages/Dashboard';
// import QuickLogin from './pages/QuickLogin';
// import Login from './pages/Login';
// import ProjectSuccess from './components/admin/ProjectSuccess';
// import ProjectEdit from './components/admin/ProjectEdit';

// function App() {
//   return (
//     <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
//       <AuthProvider>
//         <Routes>
//           {/* Routes publiques */}
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/quick-login" element={<QuickLogin />} />
          
//           {/* Route protégée utilisateur */}
//           <Route path="/dashboard" element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           } />
          
//           {/* Routes admin - NESTÉES dans AdminLayout */}
//           <Route path="/admin" element={
//             <ProtectedRoute requireAdmin={true}>
//               <AdminLayout />
//             </ProtectedRoute>
//           }>
//             <Route index element={<AdminDashboard />} />
//             <Route path="submit-project" element={<SubmitProject />} />
//             <Route path="explore" element={<Explore />} />
//             <Route path="users" element={<UserManagement />} />
//             <Route path="projects" element={<ProjectManagement />} />
//             <Route path="analytics" element={<Analytics />} />
//             <Route path="profile" element={<Profile />} />
//             <Route path="settings" element={<Settings />} />
            
//             {/* Route pour la page de succès */}
//             <Route path="projects/success" element={<ProjectSuccess />} />
            
//             {/* ⚠️ SUPPRIMEZ ou COMMENTER cette ligne si ProjectEdit n'existe pas */}
//             {/* <Route path="projects/:id/edit" element={<ProjectEdit />} /> */}
            
//             <Route path="*" element={<Navigate to="/admin" replace />} />
//           </Route>
          
//           {/* Route 404 */}
//           <Route path="*" element={
//             <div className="flex items-center justify-center h-screen">
//               <div className="text-center">
//                 <h1 className="text-4xl font-bold text-[#001F3F] mb-4">404</h1>
//                 <p className="text-gray-600">Page non trouvée</p>
//                 <a href="/" className="mt-4 inline-block text-[#E30613] hover:underline">
//                   Retour à l'accueil
//                 </a>
//               </div>
//             </div>
//           } />
//         </Routes>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;


// src/App.jsx - VERSION COMPLÈTE AVEC ProjectProvider
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import ProjectManagement from './components/admin/ProjectManagement';
import SubmitProject from './components/admin/SubmitProject';
import Explore from './components/admin/Explore';
import Analytics from './components/admin/Analytics';
import Profile from './components/admin/Profile';
import Settings from './components/admin/Settings';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import QuickLogin from './pages/QuickLogin';
import Login from './pages/Login';
import ProjectSuccess from './components/admin/ProjectSuccess';
import ProjectDetail from './components/admin/ProjectDetail';
import './App.css';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <ProjectProvider>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/quick-login" element={<QuickLogin />} />
            
            {/* Route protégée utilisateur */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Routes admin - NESTÉES dans AdminLayout */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="submit-project" element={<SubmitProject />} />
              <Route path="explore" element={<Explore />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="projects" element={<ProjectManagement />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              
              {/* Route pour la page de succès */}
              <Route path="projects/success" element={<ProjectSuccess />} />
              
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
            
<Route path="/admin/projects/:id" element={<ProjectDetail />} />
            {/* Route 404 */}
            <Route path="*" element={
              <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-[#001F3F] mb-4">404</h1>
                  <p className="text-gray-600">Page non trouvée</p>
                  <a href="/" className="mt-4 inline-block text-[#E30613] hover:underline">
                    Retour à l'accueil
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </ProjectProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;