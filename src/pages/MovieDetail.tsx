import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Movie, Actor } from '../types/tmdb';
import { getMovieDetails, getMovieCredits } from '../services/tmdbApi';
import { getPosterUrl, getBackdropUrl, getProfileUrl, formatRuntime } from '../utils/constants';

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;
      
      try {
        const [movieData, creditsData] = await Promise.all([
          getMovieDetails(parseInt(id)),
          getMovieCredits(parseInt(id))
        ]);
        
        setMovie(movieData);
        setCast(creditsData.cast.slice(0, 12));
      } catch (error) {
        console.error('Erreur lors du chargement du film:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center cyber-grid">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neon-blue font-cyber text-xl">CHARGEMENT...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center cyber-grid">
        <div className="text-center">
          <h1 className="text-4xl font-retro text-neon-pink mb-4">FILM NON TROUVÉ</h1>
          <Link to="/" className="text-neon-blue hover:text-neon-pink transition-colors font-cyber">
            ← RETOUR À L'ACCUEIL
          </Link>
        </div>
      </div>
    );
  }

  const backdropUrl = getBackdropUrl(movie.backdrop_path); // peut être null
  const posterUrl = getPosterUrl(movie.poster_path);

  return (
    <div className="min-h-screen cyber-grid">
      {/* Hero Section avec backdrop */}
      {backdropUrl && (
        <div 
          className="relative h-96 bg-cover bg-center"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-retro-dark via-retro-dark/70 to-transparent"></div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <div className="retro-card overflow-hidden animate-glow">
              <img 
                src={posterUrl}
                alt={movie.title}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Informations principales */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl md:text-6xl font-retro font-bold neon-text mb-4 animate-neon-pulse">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-lg font-bold">
                ⭐ {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-gray-400">
                {new Date(movie.release_date).getFullYear()}
              </span>
              {movie.runtime && (
                <span className="text-gray-400">
                  {formatRuntime(movie.runtime)}
                </span>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres?.map((genre) => (
                <span 
                  key={genre.id}
                  className="px-3 py-1 bg-retro-dark border border-neon-blue text-neon-blue rounded-lg font-cyber text-sm hover:bg-neon-blue hover:text-retro-dark transition-colors"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Synopsis */}
            <div className="mb-8">
              <h2 className="text-2xl font-retro text-neon-pink mb-4">SYNOPSIS</h2>
              <p className="text-gray-300 leading-relaxed font-cyber text-lg">
                {movie.overview}
              </p>
            </div>
          </div>
        </div>

        {/* Casting */}
        {cast.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-retro text-neon-pink mb-8 text-center">CASTING PRINCIPAL</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {cast.map((actor) => {
                const profileUrl = getProfileUrl(actor.profile_path);
                return (
                  <Link 
                    key={actor.id} 
                    to={`/actor/${actor.id}`}
                    className="group text-center"
                  >
                    <div className="retro-card overflow-hidden group-hover:animate-retro-glow mb-3">
                      <img 
                        src={profileUrl}
                        alt={actor.name}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="font-retro text-white group-hover:text-neon-pink transition-colors text-sm mb-1">
                      {actor.name}
                    </h3>
                    <p className="text-gray-400 font-cyber text-xs">
                      {actor.character}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;