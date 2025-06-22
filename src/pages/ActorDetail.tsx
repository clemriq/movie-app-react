import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Actor, Movie } from '../types/tmdb';
import { getActorDetails, getActorMovies } from '../services/tmdbApi';
import { getProfileUrl } from '../utils/constants';
import MovieCard from '../components/MovieCard';
import BackButton from '../components/BackButton';

const ActorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [actor, setActor] = useState<Actor | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActorData = async () => {
      if (!id) return;
      
      try {
        const [actorData, moviesData] = await Promise.all([
          getActorDetails(parseInt(id)),
          getActorMovies(parseInt(id))
        ]);
        
        setActor(actorData);
        // Trier par popularité et prendre les 20 premiers
        const sortedMovies = moviesData.cast
          .sort((a, b) => b.vote_average - a.vote_average)
          .slice(0, 20);
        setMovies(sortedMovies);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'acteur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActorData();
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

  if (!actor) {
    return (
      <div className="min-h-screen flex items-center justify-center cyber-grid">
        <div className="text-center">
          <BackButton className="mb-4" />
          <h1 className="text-4xl font-retro text-neon-pink mb-4">ACTEUR NON TROUVÉ</h1>
          <Link to="/" className="text-neon-blue hover:text-neon-pink transition-colors font-cyber">
            ← RETOUR À L'ACCUEIL
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cyber-grid">
      {/* Bouton de retour en haut de la page */}
      <div className="container mx-auto px-4 pt-6">
        <BackButton />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Photo de profil */}
          <div className="lg:col-span-1">
            <div className="retro-card overflow-hidden animate-glow">
              <img 
                src={getProfileUrl(actor.profile_path)}
                alt={actor.name}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Informations */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl md:text-6xl font-retro font-bold neon-text mb-6 animate-neon-pulse">
              {actor.name}
            </h1>
            
            <div className="space-y-4 mb-8">
              {actor.birthday && (
                <div>
                  <span className="text-neon-pink font-retro text-lg">NAISSANCE: </span>
                  <span className="text-white font-cyber">
                    {new Date(actor.birthday).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              )}
              
              {actor.place_of_birth && (
                <div>
                  <span className="text-neon-pink font-retro text-lg">LIEU: </span>
                  <span className="text-white font-cyber">
                    {actor.place_of_birth}
                  </span>
                </div>
              )}
            </div>

            {/* Biographie */}
            {actor.biography && (
              <div>
                <h2 className="text-2xl font-retro text-neon-pink mb-4">BIOGRAPHIE</h2>
                <p className="text-gray-300 leading-relaxed font-cyber">
                  {actor.biography}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Filmographie */}
        {movies.length > 0 && (
          <div>
            <h2 className="text-3xl font-retro text-neon-pink mb-8 text-center">FILMOGRAPHIE</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActorDetail;