"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Settings, Download, Share2, Flag } from 'lucide-react';
import { Movie } from '@/types/movie';
import { movieDatabase } from '@/types/movie';

export default function WatchPage() {
  const router = useRouter();
  const params = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;
    
    // Find movie by ID from database
    const movieId = Array.isArray(params.id) ? params.id[0] : params.id;
    
    // Try to find in local database first
    let foundMovie = movieDatabase.find(m => m.id === movieId);
    
    // If not found, try to find by IMDB ID (for search results)
    if (!foundMovie) {
      foundMovie = movieDatabase.find(m => m.imdbId === movieId);
    }
    
    console.log('Looking for movie with ID:', movieId);
    console.log('Found movie:', foundMovie?.title);
    
    if (foundMovie) {
      setMovie(foundMovie);
      setLoading(false);
      // Fetch episodes if TV show
      if (foundMovie.type === 'tv') {
        fetchEpisodes(foundMovie.imdbId, 1);
      }
    } else {
      console.error('Movie not found with ID:', movieId);
      setLoading(false);
    }
  }, [params]);

  const fetchEpisodes = async (imdbId: string, season: number) => {
    try {
      const res = await fetch(`/api/episodes?imdbId=${imdbId}&season=${season}`);
      const data = await res.json();
      setEpisodes(data.episodes || []);
    } catch (e) {
      console.error('Failed to fetch episodes:', e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="text-white text-2xl">Movie Not Found</div>
        <button
          onClick={() => router.back()}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const embedUrl = movie.type === 'movie'
    ? `https://vidsrc.xyz/embed/movie/${movie.imdbId}`
    : `https://vidsrc.xyz/embed/tv/${movie.imdbId}/${selectedSeason}/${selectedEpisode}`;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/80 to-transparent">
        <div className="flex items-center justify-between p-4 md:p-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white hover:text-gray-300 transition"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="hidden md:inline">Back</span>
          </button>
          
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
              <Share2 className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
              <Flag className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      <div className="pt-16 md:pt-20">
        {/* Video Player */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            title={movie.title}
          />
        </div>

        {/* Content Below Player */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title and Meta */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  {movie.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
                  <span className="bg-yellow-400 text-black px-2 py-1 rounded font-bold">
                    ⭐ {movie.rating}
                  </span>
                  <span>{movie.year}</span>
                  {movie.duration && <span>{movie.duration}</span>}
                  {movie.type === 'tv' && movie.seasons && (
                    <span>{movie.seasons} Season{movie.seasons > 1 ? 's' : ''}</span>
                  )}
                  <span className="px-2 py-1 bg-white/10 rounded text-xs">
                    {movie.rating > 8 ? '4K' : 'HD'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="text-white font-semibold flex items-center gap-2"
                >
                  About
                  <span className={`transform transition-transform ${showInfo ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showInfo && (
                  <div className="text-gray-300 leading-relaxed space-y-4">
                    <p>{movie.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <span className="text-white ml-2 capitalize">{movie.type}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">IMDB ID:</span>
                        <span className="text-white ml-2 font-mono">{movie.imdbId}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Genres */}
              <div>
                <h3 className="text-white font-semibold mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genre.map((g, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-white/10 rounded-full text-white text-sm hover:bg-white/20 transition cursor-pointer"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Episodes List for TV Shows */}
              {movie.type === 'tv' && movie.seasons && movie.seasons > 1 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold text-xl">Episodes</h3>
                    <select
                      value={selectedSeason}
                      onChange={(e) => {
                        const season = Number(e.target.value);
                        setSelectedSeason(season);
                        fetchEpisodes(movie.imdbId, season);
                      }}
                      className="bg-white/10 text-white px-4 py-2 rounded-md border border-white/20 focus:border-white/40 outline-none"
                    >
                      {Array.from({ length: movie.seasons }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Season {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    {episodes.length > 0 ? (
                      episodes.map((ep) => (
                        <button
                          key={ep.id}
                          onClick={() => setSelectedEpisode(ep.number)}
                          className={`w-full text-left p-4 rounded-lg transition ${
                            selectedEpisode === ep.number
                              ? 'bg-white/20 border border-white/30'
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="text-white font-bold text-lg">
                              {ep.number}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-semibold mb-1">
                                {ep.title}
                              </h4>
                              {ep.description && (
                                <p className="text-gray-400 text-sm line-clamp-2">
                                  {ep.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-gray-400 text-center py-8">
                        No episodes available for this season
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Additional Info */}
            <div className="space-y-6">
              {/* Details Card */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-4">Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Release Year</span>
                    <span className="text-white">{movie.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rating</span>
                    <span className="text-white">{movie.rating}/10</span>
                  </div>
                  {movie.duration && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration</span>
                      <span className="text-white">{movie.duration}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Quality</span>
                    <span className="text-white">
                      {movie.rating > 8 ? '4K Ultra HD' : 'Full HD'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Info
                </button>
                <button className="w-full bg-white/10 text-white py-3 rounded-lg font-semibold hover:bg-white/20 transition flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
