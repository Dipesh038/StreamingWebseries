"use client";

import { Movie } from '@/types/movie';
import { motion } from 'framer-motion';
import { Star, Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMovieSelect: (movie: Movie) => void;
}

export function MovieRow({ title, movies, onMovieSelect }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [hoveredMovie, setHoveredMovie] = useState<string | null>(null);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());

  const handleImageError = (movieId: string) => {
    setBrokenImages(prev => new Set(prev).add(movieId));
  };

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.offsetWidth * 0.8;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mb-12 group/row">
      <h2 className="text-2xl font-bold text-white mb-4 px-4 md:px-12">{title}</h2>
      
      <div className="relative">
        {/* Left scroll button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-black/80 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 flex items-center justify-center hover:from-black"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>

        {/* Movie cards container */}
        <div
          ref={rowRef}
          className="flex gap-2 overflow-x-scroll scrollbar-hide px-4 md:px-12 py-4 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.filter(movie => !brokenImages.has(movie.id)).map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="relative flex-shrink-0 w-[200px] md:w-[240px] cursor-pointer group/card"
              onMouseEnter={() => setHoveredMovie(movie.id)}
              onMouseLeave={() => setHoveredMovie(null)}
              onClick={() => onMovieSelect(movie)}
            >
              {/* Movie poster */}
              <div className="relative rounded-md overflow-hidden transition-transform duration-300 group-hover/card:scale-110 group-hover/card:z-20">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-[300px] md:h-[360px] object-cover"
                  loading="lazy"
                  onError={() => handleImageError(movie.id)}
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                
                {/* Hover info */}
                {hoveredMovie === movie.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-0 left-0 right-0 p-4 text-white"
                  >
                    <h3 className="font-bold text-sm mb-1 line-clamp-1">{movie.title}</h3>
                    
                    <div className="flex items-center gap-2 text-xs mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                        <span>{movie.rating}</span>
                      </div>
                      <span>{movie.year}</span>
                      <span className="px-1.5 py-0.5 bg-red-600 rounded text-[10px] font-semibold">
                        {movie.type === 'movie' ? 'MOVIE' : 'TV'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMovieSelect(movie);
                        }}
                        className="flex-1 bg-white text-black rounded-md py-1.5 px-3 flex items-center justify-center gap-1 hover:bg-white/90 transition text-xs font-semibold"
                      >
                        <Play className="w-3 h-3" fill="currentColor" />
                        Play
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMovieSelect(movie);
                        }}
                        className="bg-gray-700/80 text-white rounded-md p-1.5 hover:bg-gray-600 transition"
                        aria-label="More info"
                      >
                        <Info className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Title below poster (always visible) */}
              <div className="mt-2 px-1">
                <h3 className="text-white text-sm font-medium line-clamp-1">{movie.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                  <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                  <span>{movie.rating}</span>
                  <span>•</span>
                  <span>{movie.year}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right scroll button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-black/80 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 flex items-center justify-center hover:from-black"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      </div>
    </div>
  );
}
