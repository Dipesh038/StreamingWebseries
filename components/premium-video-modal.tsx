"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Plus, ThumbsUp, Volume2, VolumeX, Star, Clock, Calendar, ChevronDown, ExternalLink, Server } from 'lucide-react';
import { Movie } from '@/types/movie';

interface PremiumVideoModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export function PremiumVideoModal({ movie, onClose }: PremiumVideoModalProps) {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [selectedServer, setSelectedServer] = useState<'vidsrc' | 'vidsrc.pro' | 'vidsrc.cc' | '2embed' | 'embedsoap'>('vidsrc');

  useEffect(() => {
    if (movie) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [movie]);

  if (!movie) return null;

  const getEmbedUrl = () => {
    if (movie.type === 'movie') {
      switch (selectedServer) {
        case 'vidsrc':
          return `https://vidsrc.xyz/embed/movie/${movie.imdbId}`;
        case 'vidsrc.pro':
          return `https://vidsrc.pro/embed/movie/${movie.imdbId}`;
        case 'vidsrc.cc':
          return `https://vidsrc.cc/v2/embed/movie/${movie.imdbId}`;
        case '2embed':
          return `https://www.2embed.cc/embed/${movie.imdbId}`;
        case 'embedsoap':
          return `https://www.embedsoap.com/embed/movie/?id=${movie.imdbId}`;
        default:
          return `https://vidsrc.xyz/embed/movie/${movie.imdbId}`;
      }
    } else {
      switch (selectedServer) {
        case 'vidsrc':
          return `https://vidsrc.xyz/embed/tv/${movie.imdbId}/${selectedSeason}/${selectedEpisode}`;
        case 'vidsrc.pro':
          return `https://vidsrc.pro/embed/tv/${movie.imdbId}/${selectedSeason}/${selectedEpisode}`;
        case 'vidsrc.cc':
          return `https://vidsrc.cc/v2/embed/tv/${movie.imdbId}/${selectedSeason}/${selectedEpisode}`;
        case '2embed':
          return `https://www.2embed.cc/embedtv/${movie.imdbId}&s=${selectedSeason}&e=${selectedEpisode}`;
        case 'embedsoap':
          return `https://www.embedsoap.com/embed/tv/?id=${movie.imdbId}&s=${selectedSeason}&e=${selectedEpisode}`;
        default:
          return `https://vidsrc.xyz/embed/tv/${movie.imdbId}/${selectedSeason}/${selectedEpisode}`;
      }
    }
  };

  const embedUrl = getEmbedUrl();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black"
        onClick={onClose}
      >
        {/* Close button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onClick={onClose}
          className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center hover:bg-black/90 transition-all group"
        >
          <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
        </motion.button>

        {/* Scrollable content */}
        <div className="h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          {/* Hero section with video player */}
          <div className="relative h-[60vh] md:h-[80vh] bg-black">
            {!isPlaying ? (
              /* Poster/Preview */
              <div className="relative h-full">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
                
                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 lg:p-16">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-3xl"
                  >
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                      {movie.title}
                    </h1>
                    
                    <div className="flex items-center gap-4 mb-6 text-sm md:text-base">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
                        <span className="text-white font-semibold">{movie.rating}</span>
                      </div>
                      <span className="text-gray-300">{movie.year}</span>
                      {movie.type === 'tv' && movie.seasons && (
                        <span className="text-gray-300">{movie.seasons} Season{movie.seasons > 1 ? 's' : ''}</span>
                      )}
                      {movie.duration && (
                        <div className="flex items-center gap-1 text-gray-300">
                          <Clock className="w-4 h-4" />
                          <span>{movie.duration}</span>
                        </div>
                      )}
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded">
                        {movie.rating > 8 ? 'HD' : 'SD'}
                      </span>
                    </div>

                    <p className="text-gray-200 text-base md:text-lg mb-6 line-clamp-3 max-w-2xl leading-relaxed">
                      {movie.description}
                    </p>

                    {/* Server selector */}
                    <div className="mb-6">
                      <label className="text-gray-400 text-sm mb-2 block flex items-center gap-2">
                        <Server className="w-4 h-4" />
                        Select Server
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedServer('vidsrc')}
                          className={`px-4 py-2 rounded-md font-semibold text-sm transition ${
                            selectedServer === 'vidsrc'
                              ? 'bg-white text-black'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          Server 1
                        </button>
                        <button
                          onClick={() => setSelectedServer('vidsrc.pro')}
                          className={`px-4 py-2 rounded-md font-semibold text-sm transition ${
                            selectedServer === 'vidsrc.pro'
                              ? 'bg-white text-black'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          Server 2
                        </button>
                        <button
                          onClick={() => setSelectedServer('vidsrc.cc')}
                          className={`px-4 py-2 rounded-md font-semibold text-sm transition ${
                            selectedServer === 'vidsrc.cc'
                              ? 'bg-white text-black'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          Server 3
                        </button>
                        <button
                          onClick={() => setSelectedServer('2embed')}
                          className={`px-4 py-2 rounded-md font-semibold text-sm transition ${
                            selectedServer === '2embed'
                              ? 'bg-white text-black'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          Server 4
                        </button>
                        <button
                          onClick={() => setSelectedServer('embedsoap')}
                          className={`px-4 py-2 rounded-md font-semibold text-sm transition ${
                            selectedServer === 'embedsoap'
                              ? 'bg-white text-black'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          Server 5
                        </button>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsPlaying(true)}
                        className="bg-white text-black px-8 md:px-12 py-3 md:py-4 rounded-md font-bold flex items-center gap-3 hover:bg-gray-200 transition text-base md:text-lg shadow-xl"
                      >
                        <Play className="w-6 h-6" fill="currentColor" />
                        Watch Now
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsPlaying(true)}
                        className="bg-gray-700/70 backdrop-blur-sm text-white px-6 md:px-8 py-3 md:py-4 rounded-md font-semibold flex items-center gap-2 hover:bg-gray-600/70 transition"
                      >
                        <ExternalLink className="w-5 h-5" />
                        Quick Play
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gray-700/70 backdrop-blur-sm text-white px-6 md:px-8 py-3 md:py-4 rounded-md font-semibold flex items-center gap-2 hover:bg-gray-600/70 transition"
                      >
                        <Plus className="w-6 h-6" />
                        My List
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gray-700/70 backdrop-blur-sm text-white p-3 md:p-4 rounded-md hover:bg-gray-600/70 transition"
                      >
                        <ThumbsUp className="w-6 h-6" />
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </div>
            ) : (
              /* Video Player */
              <div className="relative h-full bg-black overflow-hidden">
                {/* Server selector - floating top right */}
                <div className="absolute top-4 right-4 z-50">
                  <div className="flex gap-2 bg-black/80 backdrop-blur-md px-3 py-2 rounded-lg border border-white/20 shadow-2xl">
                    <Server className="w-4 h-4 text-white my-auto" />
                    <span className="text-white/60 text-xs my-auto mr-2">Server:</span>
                    <button
                      onClick={() => setSelectedServer('vidsrc')}
                      className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                        selectedServer === 'vidsrc'
                          ? 'bg-red-600 text-white'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      1
                    </button>
                    <button
                      onClick={() => setSelectedServer('vidsrc.pro')}
                      className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                        selectedServer === 'vidsrc.pro'
                          ? 'bg-red-600 text-white'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      2
                    </button>
                    <button
                      onClick={() => setSelectedServer('vidsrc.cc')}
                      className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                        selectedServer === 'vidsrc.cc'
                          ? 'bg-red-600 text-white'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      3
                    </button>
                    <button
                      onClick={() => setSelectedServer('2embed')}
                      className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                        selectedServer === '2embed'
                          ? 'bg-red-600 text-white'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      4
                    </button>
                    <button
                      onClick={() => setSelectedServer('embedsoap')}
                      className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                        selectedServer === 'embedsoap'
                          ? 'bg-red-600 text-white'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      5
                    </button>
                  </div>
                </div>

                {/* Player container - full screen */}
                <div className="absolute inset-0">
                  <iframe
                    key={embedUrl}
                    src={embedUrl}
                    className="w-full h-full"
                    allowFullScreen
                    allow="autoplay; encrypted-media; picture-in-picture"
                    title={`${movie.title} video player`}
                    style={{ 
                      border: 'none',
                      display: 'block'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Details section */}
          <div className="bg-gradient-to-b from-black to-gray-900 px-8 md:px-12 lg:px-16 py-12">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left column - Main info */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Genres */}
                  <div>
                    <h3 className="text-gray-400 text-sm mb-3 uppercase tracking-wider">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.genre.map((genre, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm hover:bg-white/20 transition cursor-pointer"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-white text-2xl font-bold mb-4">About</h3>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {movie.description}
                    </p>
                    {!showMoreInfo && (
                      <button
                        onClick={() => setShowMoreInfo(true)}
                        className="mt-4 text-white hover:text-gray-300 transition flex items-center gap-2"
                      >
                        More Info
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Extended info */}
                  {showMoreInfo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Release Year:</span>
                          <span className="text-white ml-2">{movie.year}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Rating:</span>
                          <span className="text-white ml-2">{movie.rating}/10</span>
                        </div>
                        {movie.duration && (
                          <div>
                            <span className="text-gray-400">Duration:</span>
                            <span className="text-white ml-2">{movie.duration}</span>
                          </div>
                        )}
                        {movie.type === 'tv' && (
                          <div>
                            <span className="text-gray-400">Seasons:</span>
                            <span className="text-white ml-2">{movie.seasons}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Season/Episode selector for TV shows */}
                  {movie.type === 'tv' && movie.seasons && movie.seasons > 1 && isPlaying && (
                    <div className="space-y-4">
                      <h3 className="text-white text-xl font-bold">Episodes</h3>
                      <select
                        value={selectedSeason}
                        onChange={(e) => setSelectedSeason(Number(e.target.value))}
                        className="bg-white/10 backdrop-blur-sm text-white px-4 py-3 rounded-md border border-white/20 focus:border-white/40 outline-none transition"
                      >
                        {Array.from({ length: movie.seasons }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            Season {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Right column - Metadata */}
                <div className="space-y-6">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-white font-semibold mb-4">Details</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white ml-2 capitalize">{movie.type}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Quality:</span>
                        <span className="text-white ml-2">{movie.rating > 8 ? '4K' : 'HD'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">IMDB ID:</span>
                        <span className="text-white ml-2 font-mono text-xs">{movie.imdbId}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
