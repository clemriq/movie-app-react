import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { Movie, Genre } from '../types/tmdb';
import { getPopularMovies, getNowPlayingMovies, getUpcomingMovies, searchMovies, getGenres } from '../services/tmdbApi';

const Movies: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popularity.desc');
  const [minRating, setMinRating] = useState(searchParams.get('rating') || '');
  const [showFilters, setShowFilters] = useState(false);

  const getTitle = () => {
    switch (type) {
      case 'popular': return 'Films populaires';
      case 'now-playing': return 'À l\'affiche';
      case 'upcoming': return 'Prochainement';
      default: return 'Films';
    }
  };

  const fetchMovies = async (page: number, query?: string) => {
    setLoading(true);
    try {
      let response;
      if (query) {
        response = await searchMovies(query, page);
      } else {
        switch (type) {
          case 'popular':
            response = await getPopularMovies(page);
            break;
          case 'now-playing':
            response = await getNowPlayingMovies(page);
            break;
          case 'upcoming':
            response = await getUpcomingMovies(page);
            break;
          default:
            response = await getPopularMovies(page);
        }
      }
      
      let filteredMovies = response.results;
      
      // Filtrer par genre
      if (selectedGenre) {
        filteredMovies = filteredMovies.filter(movie => 
          movie.genre_ids.includes(parseInt(selectedGenre))
        );
      }
      
      // Filtrer par note
      if (minRating) {
        filteredMovies = filteredMovies.filter(movie => 
          movie.vote_average >= parseFloat(minRating)
        );
      }
      
      // Trier
      switch (sortBy) {
        case 'rating.desc':
          filteredMovies.sort((a, b) => b.vote_average - a.vote_average);
          break;
        case 'rating.asc':
          filteredMovies.sort((a, b) => a.vote_average - b.vote_average);
          break;
        case 'release.desc':
          filteredMovies.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
          break;
        case 'release.asc':
          filteredMovies.sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());
          break;
        case 'title.asc':
          filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
          break;
      }
      
      setMovies(filteredMovies);
      setTotalPages(response.total_pages);
    } catch (error) {
      console.error('Erreur lors du chargement des films:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await getGenres();
        setGenres(genresData.genres);
      } catch (error) {
        console.error('Erreur lors du chargement des genres:', error);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const query = searchParams.get('search');
    setSearchQuery(query || '');
    fetchMovies(currentPage, query || undefined);
  }, [type, currentPage, searchParams, selectedGenre, sortBy, minRating]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchQuery.trim() || undefined });
    setCurrentPage(1);
  };

  const updateFilters = (newFilters: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    Object.entries({ 
      search: searchQuery, 
      genre: selectedGenre, 
      sort: sortBy, 
      rating: minRating,
      ...newFilters 
    }).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSelectedGenre('');
    setSortBy('popularity.desc');
    setMinRating('');
    setSearchParams({});
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    <div className="min-h-screen bg-gray-900 py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header avec recherche */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6 sm:mb-8">
            {searchQuery ? `Recherche: "${searchQuery}"` : getTitle()}
          </h1>
          
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un film..."
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none pr-12"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Bouton filtres mobile */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors mb-4"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
              Filtres
            </span>
          </button>
        </div>

        {/* Filtres */}
        <div className={`mb-8 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Genre */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Genre</label>
                <select
                  value={selectedGenre}
                  onChange={(e) => {
                    setSelectedGenre(e.target.value);
                    updateFilters({ genre: e.target.value || undefined });
                  }}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Tous les genres</option>
                  {genres.map(genre => (
                    <option key={genre.id} value={genre.id}>{genre.name}</option>
                  ))}
                </select>
              </div>

              {/* Tri */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Trier par</label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    updateFilters({ sort: e.target.value });
                  }}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="popularity.desc">Popularité (décroissant)</option>
                  <option value="rating.desc">Note (décroissant)</option>
                  <option value="rating.asc">Note (croissant)</option>
                  <option value="release.desc">Date de sortie (récent)</option>
                  <option value="release.asc">Date de sortie (ancien)</option>
                  <option value="title.asc">Titre (A-Z)</option>
                </select>
              </div>

              {/* Note minimale */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Note minimale</label>
                <select
                  value={minRating}
                  onChange={(e) => {
                    setMinRating(e.target.value);
                    updateFilters({ rating: e.target.value || undefined });
                  }}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Toutes les notes</option>
                  <option value="8">8+ ⭐</option>
                  <option value="7">7+ ⭐</option>
                  <option value="6">6+ ⭐</option>
                  <option value="5">5+ ⭐</option>
                </select>
              </div>

              {/* Bouton reset */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Grille de films */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} size="medium" />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 sm:mt-12">
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-gray-800 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                Précédent
              </button>
              
              <span className="px-4 py-2 bg-blue-600 text-white rounded">
                {currentPage} / {Math.min(totalPages, 500)}
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || currentPage >= 500}
                className="px-3 py-2 bg-gray-800 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {movies.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">Aucun film trouvé avec ces critères.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;