import React from 'react';
import { Link } from 'react-router-dom';
import logoWhite from '../assets/images/logo-white.png';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-16">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={logoWhite} 
                alt="TheMovieDB Logo" 
                className="w-auto h-14"
              />
              <h3 className="text-xl font-bold text-white">
                L'écran total
                <span className="block text-xs mt-1">by Clément Riquet</span>
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Découvrez les derniers films, explorez les détails de vos acteurs préférés 
              et restez informé des tendances cinématographiques. Votre destination 
              ultime pour tout ce qui concerne le cinéma.
            </p>
            <div className="mt-4">
              <p className="text-xs text-gray-500">
                Données fournies par{' '}
                <a 
                  href="https://www.themoviedb.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  The Movie Database (TMDB)
                </a>
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link 
                  to="/movies/popular" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Films populaires
                </Link>
              </li>
              <li>
                <Link 
                  to="/movies/now-playing" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  À l'affiche
                </Link>
              </li>
              <li>
                <Link 
                  to="/movies/upcoming" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Prochainement
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h4 className="text-white font-semibold mb-4">Application</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400 text-sm">Version 1.0.0</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">PWA Ready</span>
              </li>
              <li>
                <span className="text-gray-400 text-sm">React + TypeScript</span>
              </li>
            </ul>
            
            {/* Installation PWA */}
            <div className="mt-4">
              <button 
                id="install-button"
                className="hidden bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 w-full justify-center"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                📱 Installer l'app
              </button>
              
              {/* Banner PWA pour mobile */}
              <div id="pwa-banner" className="hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 z-50 shadow-lg">
                <div className="flex items-center justify-between max-w-md mx-auto">
                  <div className="flex-1">
                    <p className="font-medium text-sm">Installer L'écran total</p>
                    <p className="text-xs opacity-90">Accès rapide et mode hors-ligne</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button id="install-banner-btn" className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors">
                      Installer
                    </button>
                    <button id="dismiss-banner" className="text-white/80 hover:text-white p-1">
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {currentYear} TheMovieDB-React. Tous droits réservés.
            </p>
            <p className="text-gray-500 text-sm mt-2 sm:mt-0">
              Fait avec ❤️ pour les amateurs de cinéma
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;