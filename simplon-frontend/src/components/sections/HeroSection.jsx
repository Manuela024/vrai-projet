import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="py-16">
      {/* Votre contenu hero existant */}
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-[#001F3F] dark:text-white mb-6">
          Plateforme Simplon
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Gestion des projets de code
        </p>
        <Link 
          to="/login"
          className="bg-[#E30613] text-white px-8 py-4 rounded-lg hover:bg-[#E30613]/90 font-bold text-lg"
        >
          Commencer
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;