import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { Movie, Genre } from '../types/tmdb';
import { getMoviesByGenre, getGenres } from '../services/tmdbApi';

const Category: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genre, setGenre] = useState<Genre | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const [moviesData, genresData] = await Promise.all([
          getMoviesByGenre(parseInt(id), currentPage),
          getGenres()
        ]);
        
        setMovies(moviesData.results);
        setTotalPages(moviesData.total_pages);
        
        const foundGenre = genresData.genres.find(g => g.id === parseInt(id));
        setGenre(foundGenre || null);
      } catch (error) {
        console.error('Erreur lors du chargement de la catégorie:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  return (
    <div className="min-h-screen cyber-grid py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-retro font-bold neon-text mb-4 animate-neon-pulse">
            {genre ? genre.name.toUpperCase() : 'CATÉGORIE'}
          </h1>
          <p className="text-neon-blue font-cyber text-lg">
            Découvrez les meilleurs films de cette catégorie
          </p>
        </div>

        {/* Grille de films */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-retro-gray border border-neon-blue/30 rounded text-white font-cyber disabled:opacity-50 hover:border-neon-pink transition-colors"
            >
              ← PRÉCÉDENT
            </button>
            
            <span className="px-4 py-2 text-neon-blue font-cyber">
              {currentPage} / {Math.min(totalPages, 500)}
            </span>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || currentPage >= 500}
              className="px-4 py-2 bg-retro-gray border border-neon-blue/30 rounded text-white font-cyber disabled:opacity-50 hover:border-neon-pink transition-colors"
            >
              SUIVANT →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;