
// import React from 'react';
// import Header from '../components/layout/Header';
// import Footer from '../components/layout/Footer';
// import HeroSection from '../components/sections/HeroSection';
// import FeaturesSection from '../components/sections/FeaturesSection';
// import { Link } from 'react-router-dom';

// const Home = () => {
//   return (
//     <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
//       <div className="flex h-full grow flex-col">
//         <div className="px-4 sm:px-6 lg:px-8 xl:px-40 flex flex-1 justify-center py-5">
//           <div className="flex flex-col max-w-6xl flex-1">
            
//             <Header />
            
//             <main className="flex-grow">
//               {/* Section Hero avec disposition modifiée */}
//               <div className="@container">
//                 <div className="flex flex-col gap-10 px-4 py-16 @[864px]:flex-row @[864px]:items-center @[864px]:justify-between">
                  
//                   {/* 🌟 TEXTE ET BOUTON - DÉPLACÉ À GAUCHE */}
//                   <div className="flex flex-col gap-6 text-left @[864px]:w-1/2 @[864px]:pr-8">
//                     <div className="flex flex-col gap-4">
//                       <h1 className="text-4xl font-black leading-tight tracking-tighter @[480px]:text-5xl">
//                         Centralisez, partagez et valorisez vos projets de code Simplon.
//                       </h1>
//                       <h2 className="text-base font-normal leading-normal text-gray-700 dark:text-gray-300">
//                         La plateforme pour stocker, gérer et partager les projets de code des stagiaires Simplon.
//                       </h2>
//                     </div>
//                     <Link 
//                       to="/login"
//                       className="flex min-w-[84px] max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] transition-transform hover:scale-105"
//                     >
//                       <span className="truncate">Découvrir les projets</span>
//                     </Link>
//                   </div>

//                   {/* 🌟 IMAGE - DÉPLACÉE À DROITE */}
//                   <div className="w-full @[864px]:w-1/2 @[864px]:flex @[864px]:justify-end">
//                     <div 
//                       className="bg-center bg-no-repeat aspect-video bg-cover rounded-xl w-full max-w-lg"
//                       style={{ 
//                         backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA5gn_s7MnMEjAqOed9HXBakgtrfF69Ts5EyO8C_GtrO_utoIetn0OT7fG2AsVrXEHcGYlHEF15an6S0EXpRsZbc4dOVYEivws_857nIY3NI4ueCNyB70V95BhpvgFjZ1PrHVMXzLq6VoNLdoIAWLCndQ1PqyKkw9DuLcyhc7rRis-hqSZoA2qysiadY66jC39vTf0vOEBBJZG1kPA0Q9hYgmdKyzOgpvxoyESv8m5kEraot4wRpI-NF7lOyAbWf6rrqZYvpGWTnzE")' 
//                       }}
//                     ></div>
//                   </div>

//                 </div>
//               </div>
              
//               <FeaturesSection />
//             </main>
            
//             <Footer />
            
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;

import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
      <div className="flex h-full grow flex-col">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-40 flex flex-1 justify-center py-5">
          <div className="flex flex-col max-w-6xl flex-1">
            
            {/* Header intégré directement */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-800 px-6 sm:px-10 py-4">
              <div className="flex items-center gap-4">
                                           <img 
  src="/src/logo.png" 
  alt="Logo Simplon" 
  className="size-10 rounded-full object-cover"
/>
                <h2 className="text-xl font-bold tracking-[-0.015em]">Simplon</h2>
              </div>
              <nav className="hidden md:flex items-center gap-9">
                <Link className="text-primary text-sm font-bold leading-normal" to="/">
                  Accueil
                </Link>
                <Link className="text-sm font-medium leading-normal transition-colors hover:text-primary" to="/login">
                  Activer mon compte
                </Link>
                <Link className="text-sm font-medium leading-normal transition-colors hover:text-primary" to="/quick-login">
                  Connexion
                </Link>
              </nav>
            </header>

            {/* Main Content */}
            <main className="flex-grow">
              {/* Hero Section intégrée directement */}
              <div className="@container">
                <div className="flex flex-col gap-10 px-4 py-16 @[864px]:flex-row @[864px]:items-center">
                  <div className="flex flex-col gap-6 text-left @[864px]:w-1/2">
                    <div className="flex flex-col gap-4">
                      <h1 className="text-4xl font-black leading-tight tracking-tighter @[480px]:text-5xl">
                        Centralisez, partagez et valorisez vos projets de code Simplon.
                      </h1>
                      <h2 className="text-base font-normal leading-normal text-gray-700 dark:text-gray-300">
                        La plateforme pour stocker, gérer et partager les projets de code des stagiaires Simplon.
                      </h2>
                    </div>
                    <Link 
                      to="/explore"
                      className="flex min-w-[84px] max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] transition-transform hover:scale-105"
                    >
                      <span className="truncate">Découvrir les projets</span>
                    </Link>
                  </div>
                  <div className="w-full @[864px]:w-1/2">
                    <div 
                      className="bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                      style={{ 
                        backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA5gn_s7MnMEjAqOed9HXBakgtrfF69Ts5EyO8C_GtrO_utoIetn0OT7fG2AsVrXEHcGYlHEF15an6S0EXpRsZbc4dOVYEivws_857nIY3NI4ueCNyB70V95BhpvgFjZ1PrHVMXzLq6VoNLdoIAWLCndQ1PqyKkw9DuLcyhc7rRis-hqSZoA2qysiadY66jC39vTf0vOEBBJZG1kPA0Q9hYgmdKyzOgpvxoyESv8m5kEraot4wRpI-NF7lOyAbWf6rrqZYvpGWTnzE")'
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Features Section intégrée directement */}
              <div className="flex flex-col gap-10 px-4 py-16 bg-gray-50 dark:bg-background-dark/50 @container">
                <div className="flex flex-col gap-4 max-w-3xl mx-auto text-center">
                  <h1 className="text-3xl font-bold leading-tight tracking-tight @[480px]:text-4xl">
                    Une plateforme pour votre réussite
                  </h1>
                  <p className="text-base font-normal leading-normal text-gray-700 dark:text-gray-300">
                    Tirez le meilleur parti de votre formation en centralisant vos travaux et en valorisant vos compétences.
                  </p>
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 p-0">
                  {/* Feature 1 */}
                  <div className="flex flex-1 gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-background-light dark:bg-background-dark p-6 flex-col text-center items-center">
                    <div className="text-primary text-4xl">
                      <span className="material-symbols-outlined !text-4xl">rocket_launch</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-lg font-bold leading-tight">Boostez votre apprentissage</h2>
                      <p className="text-sm font-normal leading-normal text-gray-600 dark:text-gray-400">
                        Centralisez tous vos projets pour suivre facilement votre progression et identifier vos points forts.
                      </p>
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex flex-1 gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-background-light dark:bg-background-dark p-6 flex-col text-center items-center">
                    <div className="text-primary text-4xl">
                      <span className="material-symbols-outlined !text-4xl">groups</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-lg font-bold leading-tight">Développez votre réseau professionnel</h2>
                      <p className="text-sm font-normal leading-normal text-gray-600 dark:text-gray-400">
                        Partagez vos réalisations avec vos pairs et des recruteurs potentiels pour étendre vos opportunités.
                      </p>
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex flex-1 gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-background-light dark:bg-background-dark p-6 flex-col text-center items-center">
                    <div className="text-primary text-4xl">
                      <span className="material-symbols-outlined !text-4xl">business_center</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className="text-lg font-bold leading-tight">Créez votre portfolio numérique</h2>
                      <p className="text-sm font-normal leading-normal text-gray-600 dark:text-gray-400">
                        Utilisez la plateforme comme une vitrine de vos compétences pour présenter un portfolio convaincant.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </main>

            {/* Footer intégré directement */}
            <footer className="flex flex-col gap-6 px-5 py-10 text-center @container border-t border-gray-200 dark:border-gray-800 mt-16">
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 @[480px]:flex-row @[480px]:justify-center">
                <a className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal min-w-40 transition-colors hover:text-primary" href="#">
                  Mentions Légales
                </a>
                <a className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal min-w-40 transition-colors hover:text-primary" href="#">
                  Contact
                </a>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal">
                © 2025 Simplon.co
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;