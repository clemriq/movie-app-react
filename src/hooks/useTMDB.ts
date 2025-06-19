import { useState, useEffect } from 'react';
import { tmdbApi } from '../services/tmdbApi';
import { Movie, Actor, Genre } from '../types/tmdb';

export const useMovies = (type: 'popular' | 'now_playing' | 'upcoming' = 'popular', page = 1) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        let response;
        switch (type) {
          case 'popular':
            response = await tmdbApi.getPopularMovies(page);
            break;
          case 'now_playing':
            response = await tmdbApi.getNowPlayingMovies(page);
            break;
          case 'upcoming':
            response = await tmdbApi.getUpcomingMovies(page);
            break;
        }
        setMovies(response.results);
        setTotalPages(response.total_pages);
      } catch (err) {
        setError('Erreur lors du chargement des films');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [type, page]);

  return { movies, loading, error, totalPages };
};

export const useGenres = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await tmdbApi.getGenres();
        setGenres(response.genres);
      } catch (err) {
        console.error('Erreur lors du chargement des genres');
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  return { genres, loading };
};