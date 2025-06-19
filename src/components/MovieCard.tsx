import React from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../types/tmdb';
import { getPosterUrl } from '../utils/constants';

interface MovieCardProps {
  movie: Movie;
  size?: 'small' | 'medium' | 'large';
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, size = 'medium' }) => {
  const posterUrl = getPosterUrl(movie.poster_path);
  
  const sizeClasses = {
    small: 'w-32 h-48 sm:w-36 sm:h-54',
    medium: 'w-full h-60 sm:h-72 md:h-80',
    large: 'w-full h-72 sm:h-84 md:h-96'
  };

  return (
    <Link to={`/movie/${movie.id}`} className="group block">
      <div className={`${sizeClasses[size]} relative overflow-hidden rounded-lg bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
        <img 
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Rating badge */}
        <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 px-2 py-1 rounded text-xs sm:text-sm font-semibold">
          ⭐ {movie.vote_average.toFixed(1)}
        </div>
        
        {/* Movie info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-semibold text-sm sm:text-lg mb-1 sm:mb-2 line-clamp-2">
            {movie.title}
          </h3>
          <p className="text-gray-300 text-xs sm:text-sm mb-1 sm:mb-2">
            {new Date(movie.release_date).getFullYear()}
          </p>
          <p className="text-gray-400 text-xs line-clamp-2 sm:line-clamp-3 hidden sm:block">
            {movie.overview}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;