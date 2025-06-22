import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  className?: string;
  fallbackPath?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  className = '', 
  fallbackPath = '/' 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Utiliser navigate(-1) pour revenir à la page précédente
    // Si l'utilisateur est arrivé directement sur cette page, 
    // cela le redirigera vers la page d'accueil
    try {
      navigate(-1);
    } catch (error) {
      // En cas d'erreur, rediriger vers la page de fallback
      navigate(fallbackPath);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-200 backdrop-blur-sm ${className}`}
      aria-label="Retour"
    >
      <svg 
        className="w-4 h-4 mr-2" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 19l-7-7 7-7" 
        />
      </svg>
      Retour
    </button>
  );
};

export default BackButton;