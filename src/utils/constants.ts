export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
export const TMDB_ACCESS_TOKEN = process.env.REACT_APP_TMDB_ACCESS_TOKEN || '';

export const IMAGE_SIZES = {
  poster: {
    w92: 'w92',
    w154: 'w154',
    w185: 'w185',
    w342: 'w342',
    w500: 'w500',
    w780: 'w780',
    original: 'original'
  },
  backdrop: {
    w300: 'w300',
    w780: 'w780',
    w1280: 'w1280',
    original: 'original'
  },
  profile: {
    w45: 'w45',
    w185: 'w185',
    h632: 'h632',
    original: 'original'
  }
};

// Fonctions utilitaires pour construire les URLs d'images
export const getImageUrl = (path: string | null, size: string): string => {
  if (!path) return '/placeholder-movie.jpg';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const getPosterUrl = (path: string | null, size: keyof typeof IMAGE_SIZES.poster = 'w500'): string => {
  if (!path) return '/placeholder-movie.jpg';
  return `${TMDB_IMAGE_BASE_URL}/${IMAGE_SIZES.poster[size]}${path}`;
};

export const getBackdropUrl = (path: string | null, size: keyof typeof IMAGE_SIZES.backdrop = 'w1280'): string | null => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${IMAGE_SIZES.backdrop[size]}${path}`;
};

export const getProfileUrl = (path: string | null, size: keyof typeof IMAGE_SIZES.profile = 'w185'): string => {
  if (!path) return '/placeholder-actor.jpg';
  return `${TMDB_IMAGE_BASE_URL}/${IMAGE_SIZES.profile[size]}${path}`;
};

export const formatRuntime = (minutes: number): string => {
  if (!minutes || minutes <= 0) return 'Durée inconnue';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes} min`;
  } else if (remainingMinutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${remainingMinutes}min`;
  }
};