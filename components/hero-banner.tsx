"use client";

import { Movie } from '@/types/movie';
import { motion } from 'framer-motion';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';

interface HeroBannerProps {
  movie: Movie;
  onPlayClick: (movie: Movie) => void;
  onInfoClick: (movie: Movie) => void;
}

export function HeroBanner({ movie, onPlayClick, onInfoClick }: HeroBannerProps) {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="relative h-[70vh] md:h-[85vh] w-full">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center px-4 md:px-12 max-w-7xl">
        <div className="max-w-2xl">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4"
          >
            {movie.title}
          </motion.h1>

          {/* Meta info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mb-4 text-sm md:text-base"
          >
            <span className="text-green-400 font-semibold">{Math.round(movie.rating * 10)}% Match</span>
            <span className="text-white">{movie.year}</span>
            {movie.type === 'tv' && movie.seasons && (
              <span className="text-white">{movie.seasons} Season{movie.seasons > 1 ? 's' : ''}</span>
            )}
            <span className="px-2 py-0.5 border border-gray-400 text-gray-300 text-xs">
              {movie.rating > 8 ? 'HD' : 'SD'}
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white text-sm md:text-lg mb-6 line-clamp-3 max-w-xl"
          >
            {movie.description}
          </motion.p>

          {/* Genres */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {movie.genre.slice(0, 3).map((genre, index) => (
              <span key={index} className="text-white text-sm">
                {genre}{index < Math.min(2, movie.genre.length - 1) && ' •'}
              </span>
            ))}
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-3"
          >
            <button
              onClick={() => onPlayClick(movie)}
              className="bg-white text-black px-8 py-3 rounded-md font-semibold flex items-center gap-2 hover:bg-white/90 transition text-base md:text-lg"
            >
              <Play className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" />
              Play
            </button>
            <button
              onClick={() => onInfoClick(movie)}
              className="bg-gray-700/80 text-white px-8 py-3 rounded-md font-semibold flex items-center gap-2 hover:bg-gray-600/80 transition text-base md:text-lg"
            >
              <Info className="w-5 h-5 md:w-6 md:h-6" />
              More Info
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mute button */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-8 right-4 md:right-12 p-2 rounded-full border-2 border-gray-400 text-white hover:bg-white/10 transition"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      {/* Age rating badge */}
      <div className="absolute top-4 right-4 md:top-8 md:right-12 bg-black/60 px-3 py-1 rounded-md text-white text-sm font-semibold">
        {movie.rating > 8 ? '13+' : movie.rating > 6 ? 'PG' : 'U'}
      </div>
    </div>
  );
}
