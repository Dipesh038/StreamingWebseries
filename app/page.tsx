"use client";

import { useState, useCallback, useEffect } from 'react';
import { PremiumVideoModal } from '@/components/premium-video-modal';
import { MovieRow } from '@/components/movie-row';
import { HeroBanner } from '@/components/hero-banner';
import { SearchBar } from '@/components/search-bar';
import { Search, X } from 'lucide-react';
import { 
  movieDatabase, 
  getMovies, 
  getSeries, 
  get4KContent, 
  getTrendingContent, 
  getTopRated,
  Movie 
} from '@/types/movie';

export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [tmdbMovies, setTmdbMovies] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Get featured movie (highest rated)
  const featuredMovie = getTrendingContent()[0] || movieDatabase[0];

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      setHasSearched(false);
      return;
    }

    console.log('Searching for:', query);
    setIsSearching(true);
    setHasSearched(true);
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      console.log('Search response status:', response.status);
      const data = await response.json();
      console.log('Search results:', data.results?.length || 0, 'movies found');
      setSearchResults(data.results || []);
    } catch (e) {
      console.error("Failed to perform search:", e);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };


  useEffect(() => {
    async function fetchPopularMovies() {
      setLoadingMovies(true);
      try {
        const response = await fetch('/api/movies/popular');
        const data = await response.json();
        setTmdbMovies(data.movies || []);
      } catch (e) {
        console.error("Failed to fetch popular movies:", e);
        setTmdbMovies([]);
      } finally {
        setLoadingMovies(false);
      }
    }
    fetchPopularMovies();
  }, []);

  // Remove console logs for production
  // console.log('VidStream app rendered with', movieDatabase.length, 'total content items');

  const handleMovieSelect = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleClosePlayer = useCallback(() => {
    setSelectedMovie(null);
  }, []);


  return (
    <div className="bg-black min-h-screen">
      {/* Search overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-2xl">
            <button
              onClick={() => {
                setShowSearch(false);
                setSearchResults([]);
                setIsSearching(false);
                setHasSearched(false);
              }}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
              aria-label="Close search"
            >
              <X className="w-6 h-6" />
            </button>
            <SearchBar onPerformSearch={(query) => {
              handleSearch(query);
            }} />
            
            {/* Search Results in overlay */}
            {isSearching && (
              <div className="text-center text-white py-10">Searching...</div>
            )}
            
            {!isSearching && hasSearched && searchResults.length === 0 && (
              <div className="text-center text-gray-400 py-10">
                <p>No results found. Try searching for a different movie or TV show.</p>
              </div>
            )}
            
            {searchResults.length > 0 && (
              <div className="mt-8 max-h-[60vh] overflow-y-auto">
                <h2 className="text-white text-xl font-bold mb-4">Search Results ({searchResults.length})</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {searchResults.map((movie) => (
                    <div
                      key={movie.id}
                      className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
                      onClick={() => {
                        handleMovieSelect(movie);
                        setShowSearch(false);
                        setSearchResults([]);
                      }}
                    >
                      {movie.poster ? (
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full rounded-lg shadow-lg"
                        />
                      ) : (
                        <div className="w-full aspect-[2/3] bg-gray-800 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500 text-sm">No Image</span>
                        </div>
                      )}
                      <h3 className="text-white text-sm mt-2 truncate">{movie.title}</h3>
                      <p className="text-gray-400 text-xs">{movie.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header/Navbar */}
      <header className="fixed top-0 w-full z-40 bg-gradient-to-b from-black/80 to-transparent px-4 md:px-12 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-red-600 text-2xl md:text-3xl font-bold">MOVIESTREAM</h1>
          <button
            onClick={() => setShowSearch(true)}
            className="text-white hover:text-gray-300 transition"
            aria-label="Search"
          >
            <Search className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <HeroBanner 
        movie={featuredMovie} 
        onPlayClick={handleMovieSelect}
        onInfoClick={handleMovieSelect}
      />

      {/* Movie Rows - Netflix Style */}
      {!showSearch && (
        <>
          {loadingMovies ? (
            <div className="text-center text-white py-10">Loading movies...</div>
          ) : tmdbMovies.length > 0 && (
            <MovieRow 
              title="Popular Movies"
              movies={tmdbMovies.slice(0, 20)}
              onMovieSelect={handleMovieSelect}
            />
          )}
          
          <MovieRow 
            title="Action Movies"
            movies={movieDatabase.filter(m => 
              m.genre.includes('Action') && 
              m.poster && 
              m.poster.trim() !== '' &&
              m.poster.trim() !== 'N/A' &&
              (m.poster.startsWith('https://') || m.poster.startsWith('http://'))
            ).slice(0, 20)}
            onMovieSelect={handleMovieSelect}
          />
          
          <MovieRow 
            title="Drama"
            movies={movieDatabase.filter(m => 
              m.genre.includes('Drama') && 
              m.poster && 
              m.poster.trim() !== '' &&
              m.poster.trim() !== 'N/A' &&
              (m.poster.startsWith('https://') || m.poster.startsWith('http://'))
            ).slice(0, 20)}
            onMovieSelect={handleMovieSelect}
          />
        </>
      )}
      
      {/* Premium Video Modal */}
      {selectedMovie && (
        <PremiumVideoModal movie={selectedMovie} onClose={handleClosePlayer} />
      )}

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-800 text-center bg-black">
        <p className="text-gray-400 mb-2">
          &copy; {new Date().getFullYear()} MovieStream. All Rights Reserved.
        </p>
        <p className="text-gray-400 mb-4">
          Developed by <a href="https://github.com/Dipesh038" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-500 underline">Dipesh</a>
        </p>
        <div className="flex justify-center space-x-4 text-sm text-gray-500">
          <span>Built with Next.js & Tailwind CSS</span>
        </div>
      </footer>
    </div>
  );
}
