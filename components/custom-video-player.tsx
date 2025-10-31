"use client";

import { useEffect, useRef, useState } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import { Server } from 'lucide-react';

interface CustomVideoPlayerProps {
  imdbId: string;
  type: 'movie' | 'tv';
  season?: number;
  episode?: number;
  title: string;
}

export function CustomVideoPlayer({ 
  imdbId, 
  type, 
  season = 1, 
  episode = 1,
  title 
}: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);
  const [selectedServer, setSelectedServer] = useState<'vidsrc' | 'vidsrc.pro' | 'vidsrc.cc' | '2embed' | 'embedsoap'>('vidsrc');

  const getEmbedUrl = () => {
    if (type === 'movie') {
      switch (selectedServer) {
        case 'vidsrc':
          return `https://vidsrc.xyz/embed/movie/${imdbId}`;
        case 'vidsrc.pro':
          return `https://vidsrc.pro/embed/movie/${imdbId}`;
        case 'vidsrc.cc':
          return `https://vidsrc.cc/v2/embed/movie/${imdbId}`;
        case '2embed':
          return `https://www.2embed.cc/embed/${imdbId}`;
        case 'embedsoap':
          return `https://www.embedsoap.com/embed/movie/?id=${imdbId}`;
        default:
          return `https://vidsrc.xyz/embed/movie/${imdbId}`;
      }
    } else {
      switch (selectedServer) {
        case 'vidsrc':
          return `https://vidsrc.xyz/embed/tv/${imdbId}/${season}/${episode}`;
        case 'vidsrc.pro':
          return `https://vidsrc.pro/embed/tv/${imdbId}/${season}/${episode}`;
        case 'vidsrc.cc':
          return `https://vidsrc.cc/v2/embed/tv/${imdbId}/${season}/${episode}`;
        case '2embed':
          return `https://www.2embed.cc/embedtv/${imdbId}&s=${season}&e=${episode}`;
        case 'embedsoap':
          return `https://www.embedsoap.com/embed/tv/?id=${imdbId}&s=${season}&e=${episode}`;
        default:
          return `https://vidsrc.xyz/embed/tv/${imdbId}/${season}/${episode}`;
      }
    }
  };

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      playerRef.current = new Plyr(videoRef.current, {
        controls: [
          'play-large',
          'play',
          'progress',
          'current-time',
          'duration',
          'mute',
          'volume',
          'settings',
          'pip',
          'airplay',
          'fullscreen'
        ],
        settings: ['quality', 'speed'],
        quality: {
          default: 1080,
          options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240]
        },
        speed: {
          selected: 1,
          options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
        },
        ratio: '16:9',
        autoplay: false,
        hideControls: true,
        resetOnEnd: false,
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  const embedUrl = getEmbedUrl();

  return (
    <div className="relative w-full h-full bg-black">
      {/* Server selector */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between">
        <div className="flex gap-2 bg-black/80 backdrop-blur-md p-2 rounded-lg border border-white/10 shadow-xl">
          <Server className="w-5 h-5 text-white my-auto" />
          <button
            onClick={() => setSelectedServer('vidsrc')}
            className={`px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 ${
              selectedServer === 'vidsrc'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/50 scale-105'
                : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105'
            }`}
          >
            Server 1
          </button>
          <button
            onClick={() => setSelectedServer('vidsrc.pro')}
            className={`px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 ${
              selectedServer === 'vidsrc.pro'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/50 scale-105'
                : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105'
            }`}
          >
            Server 2
          </button>
          <button
            onClick={() => setSelectedServer('vidsrc.cc')}
            className={`px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 ${
              selectedServer === 'vidsrc.cc'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/50 scale-105'
                : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105'
            }`}
          >
            Server 3
          </button>
          <button
            onClick={() => setSelectedServer('2embed')}
            className={`px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 ${
              selectedServer === '2embed'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/50 scale-105'
                : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105'
            }`}
          >
            Server 4
          </button>
          <button
            onClick={() => setSelectedServer('embedsoap')}
            className={`px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 ${
              selectedServer === 'embedsoap'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/50 scale-105'
                : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105'
            }`}
          >
            Server 5
          </button>
        </div>
      </div>

      {/* Iframe embed - We still need to use iframe for free streaming sources */}
      <iframe
        key={embedUrl}
        src={embedUrl}
        className="w-full h-full"
        allowFullScreen
        allow="autoplay; encrypted-media; picture-in-picture"
        title={`${title} video player`}
        style={{ border: 'none' }}
      />
    </div>
  );
}
