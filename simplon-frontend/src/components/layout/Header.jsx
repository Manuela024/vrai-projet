import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      {/* Votre header existant */}
      <div className="flex justify-between items-center py-6">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#001F3F] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-2xl font-black text-[#001F3F] dark:text-white">Simplon</span>
        </Link>
        <nav className="flex items-center space-x-6">
          <Link to="/login" className="bg-[#E30613] text-white px-6 py-3 rounded-lg hover:bg-[#E30613]/90 font-bold">
            Se connecter
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;