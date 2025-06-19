import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoWhite from '../assets/images/logo-white.png';
import logoBlack from '../assets/images/logo-black.png';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/movies/popular?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <header className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img 
                src={logoWhite} 
                alt="L'écran total Logo" 
                className="w-auto h-14"
              />
            </Link>
            
            {/* Navigation desktop */}
            <nav className="hidden lg:flex space-x-6 xl:space-x-8">
              <Link 
                to="/" 
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                Accueil
              </Link>
              <Link 
                to="/movies/popular" 
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                Films populaires
              </Link>
              <Link 
                to="/movies/now-playing" 
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                À l'affiche
              </Link>
              <Link 
                to="/movies/upcoming" 
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                Prochainement
              </Link>
            </nav>

            {/* Search and Menu */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <form onSubmit={handleSearch} className="hidden md:block">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un film..."
                  className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none w-48 lg:w-64"
                />
              </form>
              
              {/* Bouton PWA Install dans le header */}
              <button 
                id="install-button-header"
                className="hidden bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                title="Installer l'application"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">Installer</span>
              </button>
              
              {/* Menu mobile button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menu mobile overlay */}
      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed top-[73px] left-0 right-0 bg-gray-900 border-b border-gray-800 z-50 lg:hidden">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-3">
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-white transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Accueil
                </Link>
                <Link 
                  to="/movies/popular" 
                  className="text-gray-300 hover:text-white transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Films populaires
                </Link>
                <Link 
                  to="/movies/now-playing" 
                  className="text-gray-300 hover:text-white transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  À l'affiche
                </Link>
                <Link 
                  to="/movies/upcoming" 
                  className="text-gray-300 hover:text-white transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Prochainement
                </Link>
              </nav>
              
              <form onSubmit={handleSearch} className="mt-4 md:hidden">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none w-full"
                />
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
    