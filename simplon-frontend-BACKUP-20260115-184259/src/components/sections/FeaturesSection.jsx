import React from 'react';

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800 rounded-2xl my-12">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-[#001F3F] dark:text-white mb-8">
          Fonctionnalités
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Déposer</h3>
            <p className="text-gray-600 dark:text-gray-300">Partagez vos projets</p>
          </div>
          <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Explorer</h3>
            <p className="text-gray-600 dark:text-gray-300">Découvrez des projets</p>
          </div>
          <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Collaborer</h3>
            <p className="text-gray-600 dark:text-gray-300">Échangez avec la communauté</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;