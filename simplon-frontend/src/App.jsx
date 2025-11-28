// src/App.jsx
// import React from 'react';
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

// import Parametre from './pages/Parametre';  // ← AJOUTEZ CETTE LIGNE
// // ⭐ IMPORT DU CONTEXTE
// import { ProjectProvider } from './context/ProjectContext';
// import AdminLayout from './components/admin/AdminLayout';
// import ProtectedRoute from "./components/ProtectedRoute";

// function App() {
//   return (
//     <ProjectProvider> {/* ⭐ ENVELOPPE TOUTE L'APP */}
//       <BrowserRouter
//         future={{
//           v7_startTransition: true,
//           v7_relativeSplatPath: true,
//         }}
//       >
//         <Routes>
//           {/* Page d'accueil publique */}
//           <Route path="/" element={<Home />} />
          
//           {/* Pages d'authentification publiques */}
//           <Route path="/login" element={<Login />} />
//           <Route path="/setup-password" element={<SetupPassword />} />
//           <Route path="/direct-login" element={<DirectLogin />} />
//           <Route path="/quick-login" element={<QuickLogin />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/reset-password" element={<ResetPassword />} />
          
//           {/* Routes protégées */}
//           <Route 
//             path="/dashboard" 
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/upload" 
//             element={
//               <ProtectedRoute>
//                 <UploadProject />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/explore" 
//             element={
//               <ProtectedRoute>
//                 <ExploreProjects />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/project/:id" 
//             element={
//               <ProtectedRoute>
//                 <ProjectDetail />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/profile" 
//             element={
//               <ProtectedRoute>
//                 <Profile />
//               </ProtectedRoute>
//             } 
//           />
//           <Route 
//             path="/project-success" 
//             element={
//               <ProtectedRoute>
//                 <ProjectSuccess />
//               </ProtectedRoute>
//             } 
//           />

// <Route 
//   path="/parametre" 
//   element={
//     <ProtectedRoute>
//       <Parametre />
//     </ProtectedRoute>
//   } 
// />

// // Ajoutez cette route dans votre composant Routes :
// <Route 
//   path="/admin/*" 
//   element={
//     <ProtectedRoute>
//       <AdminLayout />
//     </ProtectedRoute>
//   } 
// />

         
          
//           {/* Redirection par défaut */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </BrowserRouter>
//     </ProjectProvider>
//   );
// }

// export default App;

// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'; // ← GARDEZ CELUI-CI
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadProject from './pages/UploadProject';
import ExploreProjects from './pages/ExploreProjects';
import ProjectDetail from './pages/ProjectDetail';
import Profile from './pages/Profile';
import ProjectSuccess from './pages/ProjectSuccess';
import Home from './pages/Home';
import SetupPassword from './pages/SetupPassword';
import DirectLogin from './pages/DirectLogin';
import QuickLogin from './pages/QuickLogin';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import Parametre from './pages/Parametre';
// ⭐ IMPORT DU CONTEXTE
import { ProjectProvider } from './context/ProjectContext';
import AdminLayout from './components/admin/AdminLayout';
// ⭐ SUPPRIMEZ CETTE LIGNE EN DOUBLE ↓
// import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <ProjectProvider> {/* ⭐ ENVELOPPE TOUTE L'APP */}
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          {/* Page d'accueil publique */}
          <Route path="/" element={<Home />} />
          
          {/* Pages d'authentification publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/setup-password" element={<SetupPassword />} />
          <Route path="/direct-login" element={<DirectLogin />} />
          <Route path="/quick-login" element={<QuickLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Routes protégées */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute>
                <UploadProject />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/explore" 
            element={
              <ProtectedRoute>
                <ExploreProjects />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/project/:id" 
            element={
              <ProtectedRoute>
                <ProjectDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/project-success" 
            element={
              <ProtectedRoute>
                <ProjectSuccess />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/parametre" 
            element={
              <ProtectedRoute>
                <Parametre />
              </ProtectedRoute>
            } 
          />

          {/* ⭐ CORRECTION : Route admin sans commentaire JSX dans le JSX */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ProjectProvider>
  );
}

export default App;