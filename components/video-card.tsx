"use client";

import { Movie } from '@/types/movie';
import { motion } from 'framer-motion';
import { Star, Clock, Calendar, Play } from 'lucide-react';
import React, { useEffect, useState, memo } from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { X } from "lucide-react";

interface VideoCardProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  index: number;
}

// Define the structure for an episode
export interface Episode {
  id: string | number;
  number: number;
  title: string;
  description?: string;
}

// Optionally, define a structure for a season if your API provides more details
export interface Season {
  number: number;
  episodes?: Episode[];
}

// Example interface for series data (adapt as needed)
export interface SeriesData {
  seriesId: number;
  seasons: number[]; // e.g., [1, 2, 3, 4, 5]
}

interface CleanShow {
  title: string;
  poster: string;
  rating: number;
  // ...other allowed fields
}

export const VideoCard = memo(function VideoCard({ movie, onPlay, index }: VideoCardProps) {
  const [posterUrl, setPosterUrl] = useState<string | null>(movie.poster);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  useEffect(() => {
    // When the movie prop changes, update the posterUrl state.
    // This is important if the component is reused with different movies.
    setPosterUrl(movie.poster);
  }, [movie.poster]);

  const fetchPosterFromAPI = async () => {
    if (!movie.imdbId) return;
    try {
      const res = await fetch(`/api/poster?imdbId=${movie.imdbId}&type=${movie.type}`);
      const data = await res.json();
      if (data.posterUrl) {
        setPosterUrl(data.posterUrl);
      } else {
        setPosterUrl(null);
      }
    } catch (e) {
      setPosterUrl(null);
    }
  };

  useEffect(() => {
    if (movie?.type === 'tv') {
      setLoadingEpisodes(true);
      fetch(`/api/episodes?imdbId=${movie.imdbId}&season=${selectedSeason}`)
        .then(res => res.json())
        .then(data => setEpisodes(data.episodes || []))
        .catch(() => setEpisodes([]))
        .finally(() => setLoadingEpisodes(false));
    }
  }, [movie, selectedSeason]);

  const seasons = movie?.seasons ? Array.from({ length: movie.seasons }, (_, i) => i + 1) : [];

  const handleSeasonClick = (season: number) => {
    setSelectedSeason(season);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.3 }
      }}
      className="video-card group cursor-pointer"
      onClick={() => onPlay(movie)}
      role="button"
      tabIndex={0}
      aria-label={`Play ${movie.title} (${movie.year})`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPlay(movie);
        }
      }}
    >
      <div className="relative overflow-hidden rounded-lg mb-4">
        {posterUrl ? (
          <img 
            src={posterUrl} 
            alt={movie.title}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            onError={fetchPosterFromAPI}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-64 bg-cinema-dark flex items-center justify-center text-cinema-gray" role="img" aria-label="No poster available">
            No Image
          </div>
        )}
        
        {/* Overlay with play button */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="bg-cinema-coral rounded-full p-4 shadow-lg"
            aria-hidden="true"
          >
            <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
          </motion.div>
        </div>
        
        {/* Rating badge */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
          <Star className="w-3 h-3 text-yellow-400" fill="currentColor" aria-hidden="true" />
          <span className="text-xs font-medium text-white">{movie.rating}</span>
        </div>
        
        {/* Type badge */}
        <div className="absolute top-3 left-3 bg-cinema-coral/90 backdrop-blur-sm rounded-full px-2 py-1">
          <span className="text-xs font-medium text-white uppercase">
            {movie.type}
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-bold text-lg text-cinema-white group-hover:text-cinema-coral transition-colors duration-300 line-clamp-1" id={`movie-title-${movie.id}`}>
          {movie.title}
        </h3>
        
        <div className="flex items-center space-x-4 text-sm text-cinema-gray">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <span>{movie.year}</span>
          </div>
          
          {movie.type === 'movie' && movie.duration && (
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" aria-hidden="true" />
              <span>{movie.duration}</span>
            </div>
          )}
          
          {movie.type === 'tv' && (
            <div className="flex items-center space-x-1">
              <span>{movie.seasons} Season{movie.seasons !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1">
          {movie.genre.slice(0, 2).map((g, i) => (
            <span 
              key={i}
              className="bg-cinema-dark text-cinema-white text-xs px-2 py-1 rounded-full"
            >
              {g}
            </span>
          ))}
        </div>
        
        <p className="text-sm text-cinema-gray line-clamp-2 group-hover:text-cinema-white transition-colors duration-300">
          {movie.description}
        </p>
      </div>
      {/* Remove the action button area from the card */}
      {/* <div className="mt-6">
        <Button
          onClick={() =>
            window.open(
              `https://vidsrc.xyz/embed/${movie.type === "movie"
                ? `movie/${movie.imdbId}`
                : `tv/${movie.imdbId}/${selectedSeason}/1`
              }`,
              "_blank"
            )
          }
          className="btn-secondary w-full"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open in New Tab
        </Button>
      </div> */}
    </motion.div>
  );
});

interface VideoPlayerProps {
  movie: Movie | null;
  onClose: () => void;
}

export function VideoPlayer({ movie, onClose }: VideoPlayerProps) {
  // --- State management for selected season ---
  // Accepts either a number (e.g., 5) or an array (e.g., [1,2,3,4,5])
  const seasons: number[] =
    typeof movie?.seasons === "number"
      ? Array.from({ length: movie.seasons }, (_, i) => i + 1)
      : Array.isArray(movie?.seasons)
      ? movie.seasons
      : [];

  const [selectedSeason, setSelectedSeason] = useState<number>(
    seasons.length > 0 ? seasons[0] : 1
  );

  // --- Handle season change ---
  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeason(Number(e.target.value));
  };

  if (!movie) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-2 sm:p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="relative w-full max-w-6xl mx-auto bg-clip-padding-strong rounded-lg shadow-2xl shadow-black/40 backdrop-blur-xl"
      >
        {/* Close button */}
        <Button
          onClick={onClose}
          variant="outline"
          size="icon"
          className="absolute top-3 right-3 z-10 bg-black/50 border-white/20 text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Grid layout for player and details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[90vh] overflow-y-auto p-2 sm:p-6">
          {/* Left side: Video Player */}
          <div className="lg:col-span-1">
            {/* Audio Language Label */}
            <div className="mb-2 flex flex-col gap-2">
              <span className="inline-block bg-cinema-coral text-white px-3 py-1 rounded font-semibold text-sm w-fit">
                English Audio
              </span>
            </div>
            {/* Video embed */}
            <div className="relative bg-black rounded-lg overflow-hidden shadow-lg" style={{ aspectRatio: '16/9' }}>
                <iframe
                  src="https://vidsrc.xyz/embed/movie/tt0111161?lang=en"
                  className="w-full h-full opacity-100 transition-opacity duration-500 rounded-lg"
                  allowFullScreen
                  allow="autoplay; encrypted-media; picture-in-picture"
                />
            </div>
          </div>

          {/* Right side: Movie Details */}
          <div className="lg:col-span-1 flex flex-col pt-4 lg:pt-0 px-1 sm:px-4">
          {/* Movie info header */}
            <div className="mb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-cinema-white mb-2">
                The Shawshank Redemption
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-cinema-gray">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                  <span>9.3</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>1994</span>
                </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>2h 22min</span>
                  </div>
                <span className="bg-cinema-coral px-2 py-1 rounded text-xs font-medium text-white uppercase">
                  MOVIE
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-cinema-gray mb-4 text-sm leading-relaxed">
              Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.
            </p>

            {/* Genres */}
            <div className="mb-4 flex flex-wrap gap-2">
                <span className="bg-cinema-dark text-cinema-white text-xs px-3 py-1 rounded-full">Drama</span>
            </div>

            {/* Season Selector */}
            {/* Action Buttons */}
            <div className="mt-auto flex items-center space-x-4">
              <Button className="btn-primary flex-1">
                <Play className="w-5 h-5 mr-2" />
                Watch Now
              </Button>
              <Button
                onClick={() => window.open(`https://www.imdb.com/title/${movie?.imdbId}`, '_blank')}
                className="btn-secondary"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

<div className="relative bg-gradient-to-br from-[#181c24] via-[#23283a] to-[#181c24] py-[30px] px-[40px] min-h-[500px] flex flex-col items-center justify-center overflow-hidden">
  {/* Section Title */}
  <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-2 tracking-tight drop-shadow-lg">
    Trending Now
  </h1>
  {/* Subtitle */}
  <div className="text-lg text-cinema-gray font-light text-center py-[10px] mb-6">
    The hottest and most popular content right now
  </div>

  {/* Category Buttons */}
  <div className="flex flex-wrap justify-center gap-4 mb-8">
    {/* Trending */}
    <button className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl px-6 py-[15px] shadow transition">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
      Trending
    </button>
    {/* Movies */}
    <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl px-6 py-[15px] shadow transition">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <rect x="8" y="8" width="8" height="8" rx="2" fill="currentColor" className="text-gray-400" />
      </svg>
      Movies
    </button>
    {/* TV Series */}
    <button className="flex items-center gap-2 bg-cinema-coral hover:bg-pink-400 text-white font-semibold rounded-xl px-6 py-[15px] shadow transition">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M16 3l-4 4-4-4" stroke="currentColor" strokeWidth="2" />
      </svg>
      TV Series
    </button>
    {/* Top Rated */}
    <button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-xl px-6 py-[15px] shadow transition">
      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
        <polygon points="12,2 15,9 22,9.2 17,14 18.5,21 12,17.5 5.5,21 7,14 2,9.2 9,9" />
      </svg>
      Top Rated
    </button>
  </div>

  {/* Start Watching Button */}
  <button
    className="bg-gradient-to-r from-cinema-teal to-cinema-coral text-white font-bold text-xl rounded-2xl px-10 py-5 mt-8 shadow-lg mb-8 transition hover:scale-105"
    style={{padding: '20px'}}
  >
    Start Watching
  </button>

  {/* Content Stats */}
  <div className="flex flex-wrap justify-center gap-6 mt-2">
    <div className="bg-white/10 backdrop-blur-md rounded-lg px-6 py-4 text-center">
      <div className="text-2xl font-bold text-cinema-coral">1,045+</div>
      <div className="text-cinema-gray text-sm">Movies & TV Shows</div>
    </div>
    <div className="bg-white/10 backdrop-blur-md rounded-lg px-6 py-4 text-center">
      <div className="text-2xl font-bold text-cinema-teal">50+</div>
      <div className="text-cinema-gray text-sm">Movies</div>
    </div>
    <div className="bg-white/10 backdrop-blur-md rounded-lg px-6 py-4 text-center">
      <div className="text-2xl font-bold text-cinema-coral">50+</div>
      <div className="text-cinema-gray text-sm">TV Series</div>
    </div>
    <div className="bg-white/10 backdrop-blur-md rounded-lg px-6 py-4 text-center">
      <div className="text-2xl font-bold text-pink-400">355+</div>
      <div className="text-cinema-gray text-sm">4K Content</div>
    </div>
  </div>
</div>