"use client";

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Movie } from '@/types/movie';
import { Play, Pause, Settings, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

interface AdaptivePlayerProps {
  src: string; // HLS (.m3u8) or DASH (.mpd) URL
  poster?: string;
  autoPlay?: boolean;
}

export function AdaptivePlayer({ src, poster, autoPlay = false }: AdaptivePlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [levels, setLevels] = useState<{height: number; bitrate: number}[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number | 'auto'>('auto');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Prefer native HLS on Safari/iOS
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    } else if (Hls.isSupported()) {
      const hls = new Hls({
        // Conservative buffer settings to reduce stalls
        maxBufferLength: 20,
        maxMaxBufferLength: 60,
        liveSyncDuration: 10,
      });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        const lvls = data.levels.map((l: any) => ({ height: l.height, bitrate: l.bitrate }));
        setLevels(lvls);
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        // Graceful error handling
        if (data.fatal && hls) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });
    } else {
      // Fallback: just set src (for MP4 or browsers without HLS support)
      video.src = src;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (autoPlay) video.play().catch(() => {});
  }, [autoPlay]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = async () => {
    const el = videoRef.current?.parentElement;
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const setQuality = (levelIndex: number | 'auto') => {
    setCurrentLevel(levelIndex);
    const hls = hlsRef.current;
    if (hls) {
      hls.currentLevel = levelIndex === 'auto' ? -1 : (levelIndex as number);
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        controls={false}
        playsInline
        muted={isMuted}
        poster={poster}
        className="w-full h-full"
      />

      {/* Controls overlay */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-3 md:p-4">
        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={togglePlay} className="bg-white text-black rounded px-3 py-2 text-sm font-semibold flex items-center gap-1">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          <button onClick={toggleMute} className="bg-white/15 text-white rounded px-3 py-2 text-sm font-semibold hover:bg-white/25">
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Quality selector */}
          {levels.length > 0 && (
            <div className="relative">
              <select
                value={currentLevel as any}
                onChange={(e) => setQuality(e.target.value === 'auto' ? 'auto' : Number(e.target.value))}
                className="bg-white/15 text-white rounded px-2 py-2 text-sm font-semibold hover:bg-white/25"
              >
                <option value="auto">Auto</option>
                {levels.map((lvl, idx) => (
                  <option value={idx} key={idx}>{lvl.height}p</option>
                ))}
              </select>
            </div>
          )}

          <div className="ml-auto" />

          <button onClick={toggleFullscreen} className="bg-white/15 text-white rounded px-3 py-2 text-sm font-semibold hover:bg-white/25">
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
