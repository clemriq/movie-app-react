import axios from 'axios';
import { TMDB_BASE_URL, TMDB_ACCESS_TOKEN } from '../utils/constants';
import { Movie, Actor, Genre, MovieCredits, TMDBResponse } from '../types/tmdb';

const api = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  },
  params: {
    language: 'fr-FR'
  }
});

export const tmdbApi = {
  // Films populaires et nouveautés
  getPopularMovies: (page = 1): Promise<TMDBResponse<Movie>> =>
    api.get('/movie/popular', { params: { page } }).then(res => res.data),

  getNowPlayingMovies: (page = 1): Promise<TMDBResponse<Movie>> =>
    api.get('/movie/now_playing', { params: { page } }).then(res => res.data),

  getUpcomingMovies: (page = 1): Promise<TMDBResponse<Movie>> =>
    api.get('/movie/upcoming', { params: { page } }).then(res => res.data),

  // Détails d'un film
  getMovieDetails: (movieId: number): Promise<Movie> =>
    api.get(`/movie/${movieId}`).then(res => res.data),

  // Crédits d'un film
  getMovieCredits: (movieId: number): Promise<MovieCredits> =>
    api.get(`/movie/${movieId}/credits`).then(res => res.data),

  // Genres
  getGenres: (): Promise<{ genres: Genre[] }> =>
    api.get('/genre/movie/list').then(res => res.data),

  // Films par genre
  getMoviesByGenre: (genreId: number, page = 1): Promise<TMDBResponse<Movie>> =>
    api.get('/discover/movie', { 
      params: { 
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc'
      } 
    }).then(res => res.data),

  // Recherche de films
  searchMovies: (query: string, page = 1): Promise<TMDBResponse<Movie>> =>
    api.get('/search/movie', { params: { query, page } }).then(res => res.data),

  // Détails d'un acteur
  getActorDetails: (actorId: number): Promise<Actor> =>
    api.get(`/person/${actorId}`).then(res => res.data),

  // Filmographie d'un acteur
  getActorMovies: (actorId: number): Promise<{ cast: Movie[] }> =>
    api.get(`/person/${actorId}/movie_credits`).then(res => res.data)
};

// Individual exports for direct imports
export const getPopularMovies = tmdbApi.getPopularMovies;
export const getNowPlayingMovies = tmdbApi.getNowPlayingMovies;
export const getUpcomingMovies = tmdbApi.getUpcomingMovies;
export const getMovieDetails = tmdbApi.getMovieDetails;
export const getMovieCredits = tmdbApi.getMovieCredits;
export const getGenres = tmdbApi.getGenres;
export const getMoviesByGenre = tmdbApi.getMoviesByGenre;
export const searchMovies = tmdbApi.searchMovies;
export const getActorDetails = tmdbApi.getActorDetails;
export const getActorMovies = tmdbApi.getActorMovies;
