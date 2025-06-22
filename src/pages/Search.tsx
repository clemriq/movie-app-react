import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { searchMovies, getGenres } from '../services/tmdbApi';
import { Movie, Genre } from '../types/tmdb';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // États des filtres
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popularity.desc');
  const [minRating, setMinRating] = useState(searchParams.get('rating') || '');
  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = (movieList: Movie[]) => {
    let filtered = [...movieList];
    
    // Filtrer par genre
    if (selectedGenre) {
      filtered = filtered.filter(movie => 
        movie.genre_ids.includes(parseInt(selectedGenre))
      );
    }
    
    // Filtrer par note
    if (minRating) {
      filtered = filtered.filter(movie => 
        movie.vote_average >= parseFloat(minRating)
      );
    }
    
    // Trier
    switch (sortBy) {
      case 'rating.desc':
        filtered.sort((a, b) => b.vote_average - a.vote_average);
        break;
      case 'rating.asc':
        filtered.sort((a, b) => a.vote_average - b.vote_average);
        break;
      case 'release.desc':
        filtered.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
        break;
      case 'release.asc':
        filtered.sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());
        break;
      case 'title.asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'popularity.desc':
      default:
        // Garder l'ordre de popularité par défaut de l'API
        break;
    }
    
    return filtered;
  };

  const updateFilters = (newFilters: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    Object.entries({ 
      q: searchQuery, 
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
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    setSearchParams(params);
    
    // Réappliquer la recherche avec les filtres réinitialisés
    if (hasSearched && searchQuery) {
      performSearch(searchQuery, currentPage);
    }
  };

  const performSearch = async (query: string, page: number = 1) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const response = await searchMovies(query, page);
      let filteredMovies = response.results;
      
      // Appliquer les filtres
      filteredMovies = applyFilters(filteredMovies);
      
      setMovies(filteredMovies);
      setTotalPages(response.total_pages);
    } catch (err) {
      setError('Erreur lors de la recherche. Veuillez réessayer.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (searchQuery) {
      performSearch(searchQuery, page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // La recherche est maintenant gérée par useEffect
  };

  // Charger les genres au montage du composant
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

  // Nouveau useEffect pour la recherche automatique
  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchLoading(true);
    }
    
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery, 1);
        updateFilters({ q: searchQuery.trim() });
        setCurrentPage(1);
      } else if (searchParams.get('q')) {
        updateFilters({ q: undefined });
        setMovies([]);
        setHasSearched(false);
      }
      setSearchLoading(false);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      if (!searchQuery.trim()) {
        setSearchLoading(false);
      }
    };
  }, [searchQuery]);

  // Effectuer une recherche automatique si il y a un paramètre 'q' dans l'URL
  useEffect(() => {
    const query = searchParams.get('q');
    const genre = searchParams.get('genre');
    const sort = searchParams.get('sort');
    const rating = searchParams.get('rating');
    
    if (query && query !== searchQuery) {
      setSearchQuery(query);
      performSearch(query, currentPage);
    }
    
    if (genre !== selectedGenre) setSelectedGenre(genre || '');
    if (sort !== sortBy) setSortBy(sort || 'popularity.desc');
    if (rating !== minRating) setMinRating(rating || '');
  }, [searchParams]);

  // Réappliquer les filtres quand ils changent
  useEffect(() => {
    if (hasSearched && movies.length > 0) {
      // Refaire la recherche avec les nouveaux filtres
      if (searchQuery) {
        performSearch(searchQuery, currentPage);
      }
    }
  }, [selectedGenre, sortBy, minRating]);

  return (
    <div className="min-h-screen cyber-grid">
      <div className="container mx-auto px-4 py-8">
        {/* Header sans bouton de retour */}
        <div className="mb-8">
          <h1 className="text-4xl font-retro text-neon-pink mb-6">Recherche</h1>
        </div>
        
        {/* Barre de recherche */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  // Afficher les filtres dès qu'on tape du texte
                  if (e.target.value.trim()) {
                    setShowFilters(true);
                  }
                }}
                placeholder="Rechercher un film..."
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none pr-12"
                autoFocus
              />
              <button
                type="submit"
                disabled={loading || searchLoading || !searchQuery.trim()}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 transition-colors ${
                  searchQuery.trim() 
                    ? 'text-blue-500 hover:text-blue-400' 
                    : 'text-gray-400'
                }`}
              >
                {(loading || searchLoading) ? (
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Bouton filtres mobile */}
        {(hasSearched || searchQuery.trim()) && (
          <div className="mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors mb-4 w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                </svg>
                Filtres
              </span>
            </button>

            {/* Filtres */}
            <div className={`${(showFilters || searchQuery.trim()) ? 'block' : 'hidden lg:block'}`}>
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
          </div>
        )}

        {/* Messages d'état */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {hasSearched && !loading && movies.length === 0 && !error && (
          <div className="text-center text-gray-400 py-12">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-lg">Aucun film trouvé pour "<span className="font-medium">{searchQuery}</span>"</p>
            <p className="text-sm mt-2">Essayez avec d'autres mots-clés ou modifiez les filtres</p>
          </div>
        )}

        {!hasSearched && (
          <div className="text-center text-gray-400 py-12">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-lg">Recherchez vos films préférés</p>
            <p className="text-sm mt-2">Tapez le nom d'un film dans la barre de recherche ci-dessus</p>
          </div>
        )}

        {/* Résultats de recherche */}
        {movies.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">
              {movies.length} film{movies.length > 1 ? 's' : ''} trouvé{movies.length > 1 ? 's' : ''}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;