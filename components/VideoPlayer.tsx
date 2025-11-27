'use client';

import { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipForward, SkipBack } from 'lucide-react';
import { ShortVideo } from '@/lib/schemas';
import { useVideoPlayerStore } from '@/lib/videoPlayerStore';
import { formatDuration } from '@/lib/utils';

interface VideoPlayerProps {
  video: ShortVideo;
  onNext: () => void;
  onPrevious: () => void;
}

export default function VideoPlayer({ video, onNext, onPrevious }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    isPlaying,
    isMuted,
    duration,
    volume,
    isFullscreen,
    showControls,
    showVolumeSlider,
    videoLoading,
    autoPlay,
    autoPlayCountdown,
    setIsPlaying,
    setIsMuted,
    setCurrentTime,
    setDuration,
    setVolume,
    setIsFullscreen,
    setShowControls,
    setShowVolumeSlider,
    setVideoLoading,
    setAutoPlayCountdown,
  } = useVideoPlayerStore();

  // Auto-play on load
  useEffect(() => {
    if (videoRef.current && video) {
      const shouldAutoPlay = autoPlay || document.referrer.includes('/shorts/');
      if (shouldAutoPlay) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [video.id, autoPlay, setIsPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.parentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (videoRef.current) {
            const newVolume = Math.min(1, volume + 0.1);
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (videoRef.current) {
            const newVolume = Math.max(0, volume - 0.1);
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onNext();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
          }
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [volume, isMuted, onNext, onPrevious, setIsMuted, setVolume, toggleFullscreen, togglePlay]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      setProgressTime(time);
    }
  };

  const handleLoadedMetadata = async () => {
    if (videoRef.current) {
      const actualDuration = Math.floor(videoRef.current.duration);
      setDuration(actualDuration);

      // Update duration in backend if different
      if (actualDuration !== video.duration) {
        try {
          await fetch('/api/shorts', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: video.id,
              action: 'updateDuration',
              duration: actualDuration,
            }),
          });
        } catch (error) {
          console.error('Failed to update duration:', error);
        }
      }
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (autoPlay) {
      setAutoPlayCountdown(3);
      const interval = setInterval(() => {
        setAutoPlayCountdown((prev: number | null) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Smooth progress updates
  const [progressTime, setProgressTime] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    
    const updateProgress = () => {
      if (videoRef.current && isPlaying) {
        setProgressTime(videoRef.current.currentTime);
        animationFrame = requestAnimationFrame(updateProgress);
      }
    };

    if (isPlaying) {
      updateProgress();
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPlaying]);

  const progressPercentage = (progressTime / duration) * 100;

  return (
    <div
      className="relative aspect-9/16 sm:aspect-video w-full rounded-md overflow-hidden bg-black group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(isPlaying ? false : true)}
    >
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="w-full h-full"
        onClick={togglePlay}
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
        onLoadedMetadata={handleLoadedMetadata}
        onLoadedData={() => setVideoLoading(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleVideoEnd}
      />

      {/* Loading Spinner */}
      {videoLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-4 border-gray-600 border-t-[#E50914] rounded-full animate-spin" />
            <span className="text-white text-sm">Loading video...</span>
          </div>
        </div>
      )}

      {/* Play/Pause Overlay */}
      {!isPlaying && !autoPlayCountdown && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <button
            onClick={togglePlay}
            className="rounded-full bg-[#E50914] p-6 hover:bg-[#c20913] transition-all hover:scale-110"
          >
            <Play className="h-10 w-10 text-white" fill="white" />
          </button>
        </div>
      )}

      {/* Auto-play Countdown */}
      {autoPlayCountdown !== null && autoPlayCountdown > 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center">
            <div className="text-white text-6xl font-bold mb-4">{autoPlayCountdown}</div>
            <div className="text-white text-lg mb-4">Next video in...</div>
            <button
              onClick={() => {
                setAutoPlayCountdown(0);
              }}
              className="px-6 py-2 bg-[#E50914] text-white rounded-full hover:bg-[#c20913] transition-colors"
            >
              Play Now
            </button>
          </div>
        </div>
      )}

      {/* Custom Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 to-transparent p-4 transition-opacity ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <input
          type="range"
          min="0"
          max={duration}
          value={progressTime}
          onChange={handleSeek}
          className="w-full h-1 mb-3 appearance-none bg-gray-600 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#E50914] [&::-webkit-slider-thumb]:cursor-pointer"
          style={{
            background: `linear-gradient(to right, #E50914 0%, #E50914 ${progressPercentage}%, #4B5563 ${progressPercentage}%, #4B5563 100%)`,
          }}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Play/Pause */}
            <button onClick={togglePlay} className="text-white hover:text-[#E50914] transition-colors">
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                className="text-white hover:text-[#E50914] transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className={`h-1 appearance-none bg-gray-600 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer transition-all duration-200 ${
                  showVolumeSlider ? 'w-20 opacity-100' : 'w-0 opacity-0'
                }`}
              />
            </div>

            {/* Time */}
            <span className="text-white text-sm px-1">
              {formatDuration(Math.floor(progressTime))} / {formatDuration(Math.floor(duration))}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Previous Video */}
            <button
              onClick={onPrevious}
              className="text-white hover:text-[#E50914] transition-colors"
              title="Previous video (←)"
            >
              <SkipBack className="h-5 w-5" />
            </button>

            {/* Next Video */}
            <button
              onClick={onNext}
              className="text-white hover:text-[#E50914] transition-colors"
              title="Next video (→)"
            >
              <SkipForward className="h-5 w-5" />
            </button>

            {/* Fullscreen */}
            <button onClick={toggleFullscreen} className="text-white hover:text-[#E50914] transition-colors">
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}