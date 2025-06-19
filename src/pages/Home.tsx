import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { Movie, Genre } from '../types/tmdb';
import { getPopularMovies, getNowPlayingMovies, getGenres, getUpcomingMovies } from '../services/tmdbApi';
import { getPosterUrl } from '../utils/constants';

const Home: React.FC = () => {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [popular, nowPlaying, upcoming, genresData] = await Promise.all([
          getPopularMovies(),
          getNowPlayingMovies(),
          getUpcomingMovies(),
          getGenres()
        ]);
        
        setPopularMovies(popular.results.slice(0, 12));
        setNowPlayingMovies(nowPlaying.results.slice(0, 12));
        setUpcomingMovies(upcoming.results.slice(0, 12));
        setGenres(genresData.genres.slice(0, 8));
        setFeaturedMovie(popular.results[0]);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section - Featured Movie */}
      {featuredMovie && (
        <section className="relative h-screen flex items-center">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${getPosterUrl(featuredMovie.backdrop_path || featuredMovie.poster_path, 'original')})`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="relative z-10 container mx-auto px-6">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                {featuredMovie.title}
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {featuredMovie.overview}
              </p>
              <div className="flex items-center space-x-6 mb-8">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-white font-semibold">{featuredMovie.vote_average.toFixed(1)}</span>
                </div>
                <span className="text-gray-400">
                  {new Date(featuredMovie.release_date).getFullYear()}
                </span>
              </div>
              <div className="flex space-x-4">
                <Link 
                  to={`/movie/${featuredMovie.id}`}
                  className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <span>Voir les détails</span>
                </Link>
                <button className="bg-gray-600/80 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
                  + Ma liste
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Movie Sections */}
      <div className="relative z-10 -mt-32">
        {/* Films populaires */}
        <section className="mb-12">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Films populaires</h2>
              <Link to="/movies/popular" className="text-blue-400 hover:text-blue-300 transition-colors">
                Voir tout →
              </Link>
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {popularMovies.map((movie) => (
                <div key={movie.id} className="flex-shrink-0">
                  <MovieCard movie={movie} size="medium" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* À l'affiche */}
        <section className="mb-12">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">À l'affiche</h2>
              <Link to="/movies/now-playing" className="text-blue-400 hover:text-blue-300 transition-colors">
                Voir tout →
              </Link>
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {nowPlayingMovies.map((movie) => (
                <div key={movie.id} className="flex-shrink-0">
                  <MovieCard movie={movie} size="medium" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Prochainement */}
        <section className="mb-12">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Prochainement</h2>
              <Link to="/movies/upcoming" className="text-blue-400 hover:text-blue-300 transition-colors">
                Voir tout →
              </Link>
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {upcomingMovies.map((movie) => (
                <div key={movie.id} className="flex-shrink-0">
                  <MovieCard movie={movie} size="medium" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Genres */}
        <section className="mb-12 bg-gradient-to-b from-transparent to-prime-dark">
          <div className="container mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 font-amazon-ember">
                Explorer par genre
              </h2>
              <p className="text-prime-gray-300 text-lg">
                Découvrez vos films préférés par catégorie
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {genres.map((genre, index) => {
                // Couleurs Prime Video pour chaque genre
                const primeColors = [
                  'from-prime-blue to-prime-blue-dark',
                  'from-prime-orange to-prime-orange-dark', 
                  'from-prime-teal to-prime-teal-dark',
                  'from-prime-purple to-prime-purple-dark',
                  'from-prime-red to-prime-red-dark',
                  'from-prime-green to-prime-green-dark'
                ];
                const colorClass = primeColors[index % primeColors.length];
                
                // Icônes pour différents genres
                const getGenreIcon = (genreName: string) => {
                  const name = genreName.toLowerCase();
                  if (name.includes('action')) return '⚡';
                  if (name.includes('comedy') || name.includes('comédie')) return '😄';
                  if (name.includes('drama') || name.includes('drame')) return '🎭';
                  if (name.includes('horror') || name.includes('horreur')) return '👻';
                  if (name.includes('romance')) return '💕';
                  if (name.includes('thriller')) return '🔥';
                  if (name.includes('science') || name.includes('fiction')) return '🚀';
                  if (name.includes('fantasy') || name.includes('fantastique')) return '🧙‍♂️';
                  if (name.includes('adventure') || name.includes('aventure')) return '🗺️';
                  if (name.includes('animation')) return '🎨';
                  if (name.includes('crime')) return '🕵️';
                  if (name.includes('documentary') || name.includes('documentaire')) return '📹';
                  if (name.includes('family') || name.includes('familial')) return '👨‍👩‍👧‍👦';
                  if (name.includes('music') || name.includes('musical')) return '🎵';
                  if (name.includes('mystery') || name.includes('mystère')) return '🔍';
                  if (name.includes('war') || name.includes('guerre')) return '⚔️';
                  if (name.includes('western')) return '🤠';
                  return '🎬';
                };
                
                return (
                  <Link
                    key={genre.id}
                    to={`/genre/${genre.id}`}
                    className={`genre-card-prime group relative bg-gradient-to-br ${colorClass} text-white p-4 md:p-6 rounded-xl text-center transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden border-2 border-prime-gray-600 hover:border-prime-blue`}
                  >
                    {/* Effet de brillance Prime Video */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    
                    {/* Contenu */}
                    <div className="relative z-10">
                      <div className="text-2xl md:text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                        {getGenreIcon(genre.name)}
                      </div>
                      <span className="font-amazon-ember font-medium text-sm md:text-base leading-tight block">
                        {genre.name}
                      </span>
                    </div>
                    
                    {/* Effet de lueur Prime Video */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-t from-prime-blue/20 to-transparent"></div>
                    </div>
                  </Link>
                );
              })}
            </div>
            
            {/* Bouton Prime Video style */}
            <div className="text-center mt-10">
              <Link 
                to="/movies/popular" 
                className="inline-flex items-center px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
              >
                <span>Voir tous les films</span>
                <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;