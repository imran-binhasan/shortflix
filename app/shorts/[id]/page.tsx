'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ThumbsUp, ThumbsDown, Share2, Flag, Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipForward, SkipBack } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import { ShortVideo, Comment } from '@/types';
import { formatDuration, formatCount } from '@/lib/utils';

export default function VideoPage() {
  const params = useParams();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [video, setVideo] = useState<ShortVideo | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<ShortVideo[]>([]);
  const [allVideos, setAllVideos] = useState<ShortVideo[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  
  // Video player controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true); // Default to true for autoplay experience
  const [autoPlayCountdown, setAutoPlayCountdown] = useState<number | null>(null);
  const [nextVideoId, setNextVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (nextVideoId) {
      router.push(`/shorts/${nextVideoId}`);
      setNextVideoId(null);
    }
  }, [nextVideoId, router]);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`/api/shorts`);
        const data = await response.json();
        const videos: ShortVideo[] = Array.isArray(data) ? data : data.data;
        const foundVideo = videos.find(v => v.id === params.id);
        
        if (foundVideo) {
          setVideo(foundVideo);
          setComments(foundVideo.comments || []);
          // Get related videos (same tags)
          const related = videos
            .filter(v => v.id !== foundVideo.id && v.tags.some(tag => foundVideo.tags.includes(tag)))
            .slice(0, 8);
          setRelatedVideos(related);
          
          // Get all videos for navigation
          setAllVideos(videos);
          
          // Find current video index
          const currentIndex = videos.findIndex(v => v.id === params.id);
          setCurrentVideoIndex(currentIndex);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Failed to fetch video:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [params.id, router]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; // Don't handle keyboard shortcuts when typing
      }

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          goToNextVideo();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPreviousVideo();
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.volume = Math.min(1, videoRef.current.volume + 0.1);
            setVolume(videoRef.current.volume);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.volume = Math.max(0, videoRef.current.volume - 0.1);
            setVolume(videoRef.current.volume);
          }
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
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
  }, [allVideos, currentVideoIndex]);

  // Auto-play video when loaded
  useEffect(() => {
    if (videoRef.current && !loading && video) {
      // Auto-play if coming from another video or if autoplay is enabled
      const shouldAutoPlay = autoPlay || document.referrer.includes('/shorts/');
      if (shouldAutoPlay) {
        videoRef.current.play().catch(() => {
          // Auto-play failed (likely due to browser policy), show play button
          setIsPlaying(false);
        });
      }
    }
  }, [video, loading, autoPlay]);

  // Video player functions
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = async () => {
    if (videoRef.current) {
      const actualDuration = Math.floor(videoRef.current.duration);
      setDuration(actualDuration);
      
      // Update video duration in data if it's different
      if (video && actualDuration !== video.duration) {
        try {
          const response = await fetch('/api/shorts', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: video.id, action: 'updateDuration', duration: actualDuration }),
          });
          
          if (response.ok) {
            const updatedVideo = await response.json();
            setVideo(updatedVideo);
          }
        } catch (error) {
          console.error('Failed to update duration:', error);
        }
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
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

  const handleLike = async () => {
    if (!video) return;
    
    const action = isLiked ? 'unlike' : 'like';
    try {
      const response = await fetch('/api/shorts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: video.id, action }),
      });
      
      if (response.ok) {
        const updatedVideo = await response.json();
        setVideo(updatedVideo);
        setIsLiked(!isLiked);
      }
    } catch (error) {
      console.error('Failed to update like:', error);
    }
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleAddComment = async () => {
    if (!video || !newComment.trim()) return;

    try {
      const response = await fetch('/api/shorts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: video.id,
          action: 'comment',
          comment: { author: 'User', text: newComment.trim() }
        }),
      });

      if (response.ok) {
        const updatedVideo = await response.json();
        setVideo(updatedVideo);
        setComments(updatedVideo.comments || []);
        setNewComment('');
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleRating = async (rating: number) => {
    if (!video || hasRated) return;

    try {
      const response = await fetch('/api/shorts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: video.id, action: 'rate', rating }),
      });

      if (response.ok) {
        const updatedVideo = await response.json();
        setVideo(updatedVideo);
        setUserRating(rating);
        setHasRated(true);
      }
    } catch (error) {
      console.error('Failed to add rating:', error);
    }
  };

  const goToNextVideo = () => {
    if (allVideos.length === 0 || currentVideoIndex === -1) return;
    
    const nextIndex = (currentVideoIndex + 1) % allVideos.length;
    const nextVideo = allVideos[nextIndex];
    setNextVideoId(nextVideo.id);
  };

  const goToPreviousVideo = () => {
    if (allVideos.length === 0 || currentVideoIndex === -1) return;
    
    const prevIndex = currentVideoIndex === 0 ? allVideos.length - 1 : currentVideoIndex - 1;
    const prevVideo = allVideos[prevIndex];
    setNextVideoId(prevVideo.id);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="aspect-[9/16] sm:aspect-video w-full rounded-md bg-gray-800" />
            <div className="mt-6 h-8 w-3/4 rounded bg-gray-800" />
            <div className="mt-3 h-4 w-1/2 rounded bg-gray-800" />
          </div>
        </div>
      </>
    );
  }

  if (!video) return null;

  const progressPercentage = (currentTime / duration) * 100;

  return (
    <>
      <Header />
      <div className="bg-black min-h-screen">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Video Section */}
            <div className="lg:col-span-2">
              {/* Custom Video Player */}
              <div 
                className="relative aspect-[9/16] sm:aspect-video w-full rounded-md overflow-hidden bg-black group"
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(isPlaying ? false : true)}
              >
                <video
                  ref={videoRef}
                  src={video.videoUrl}
                  className="w-full h-full"
                  onClick={togglePlay}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onLoadedData={() => setVideoLoading(false)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => {
                    setIsPlaying(false);
                    if (autoPlay && allVideos.length > 1) {
                      // Start countdown for auto-play
                      setAutoPlayCountdown(3);
                      const countdownInterval = setInterval(() => {
                        setAutoPlayCountdown(prev => {
                          if (prev === null || prev <= 1) {
                            clearInterval(countdownInterval);
                            goToNextVideo();
                            return null;
                          }
                          return prev - 1;
                        });
                      }, 1000);
                    }
                  }}
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
                {!isPlaying && (
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
                {autoPlayCountdown !== null && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-center">
                      <div className="text-white text-6xl font-bold mb-4">{autoPlayCountdown}</div>
                      <div className="text-white text-lg">Next video in...</div>
                      <button
                        onClick={() => {
                          setAutoPlayCountdown(null);
                          goToNextVideo();
                        }}
                        className="mt-4 px-6 py-2 bg-[#E50914] text-white rounded-full hover:bg-[#c20913] transition-colors"
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                )}

                {/* Custom Controls */}
                <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                  {/* Keyboard Shortcuts Hint */}
                  <div className="text-center mb-2">
                    <span className="text-white/60 text-xs">
                      Use ← → arrow keys to navigate • Space to play/pause
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 mb-3 appearance-none bg-gray-600 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#E50914] [&::-webkit-slider-thumb]:cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #E50914 0%, #E50914 ${progressPercentage}%, #4B5563 ${progressPercentage}%, #4B5563 100%)`
                    }}
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Play/Pause */}
                      <button onClick={togglePlay} className="text-white hover:text-[#E50914] transition-colors">
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </button>

                      {/* Volume */}
                      <div className="flex items-center gap-2">
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
                          className={`h-1 appearance-none bg-gray-600 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer transition-all duration-200 ${showVolumeSlider ? 'w-20 opacity-100' : 'w-0 opacity-0'}`}
                        />
                      </div>

                      {/* Time */}
                      <span className="text-white text-sm">
                        {formatDuration(Math.floor(currentTime))} / {formatDuration(Math.floor(duration))}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Previous Video */}
                      <button
                        onClick={goToPreviousVideo}
                        className="text-white hover:text-[#E50914] transition-colors"
                        title="Previous video (←)"
                      >
                        <SkipBack className="h-5 w-5" />
                      </button>

                      {/* Auto-play Toggle */}
                      <button
                        onClick={() => setAutoPlay(!autoPlay)}
                        className={`text-white hover:text-[#E50914] transition-colors flex items-center gap-1 ${
                          autoPlay ? 'text-[#E50914]' : ''
                        }`}
                        title={autoPlay ? 'Auto-play is on' : 'Auto-play is off'}
                      >
                        <SkipForward className="h-5 w-5" />
                        <span className="text-sm">Auto</span>
                      </button>

                      {/* Next Video */}
                      <button
                        onClick={goToNextVideo}
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

              {/* Video Info */}
              <div className="mt-4">
                <h1 className="text-2xl font-semibold text-white mb-3">
                  {video.title}
                </h1>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">{formatCount(video.likes + (isLiked ? 1 : 0))} views</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                        isLiked ? 'bg-[#E50914] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <ThumbsUp className={`h-5 w-5 ${isLiked ? 'fill-white' : ''}`} />
                      <span className="text-sm font-medium">Like</span>
                    </button>

                    <button
                      onClick={handleDislike}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                        isDisliked ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <ThumbsDown className={`h-5 w-5 ${isDisliked ? 'fill-white' : ''}`} />
                    </button>

                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      <Share2 className="h-5 w-5" />
                      <span className="text-sm font-medium">Share</span>
                    </button>

                    <button className="p-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors">
                      <Flag className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gray-900 rounded-lg p-4 mb-4">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {video.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {video.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-xs hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rating Section */}
                <div className="bg-gray-900 rounded-lg p-4 mb-4">
                  <h3 className="text-white font-medium mb-2">Rate this video</h3>
                  <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(star)}
                        disabled={hasRated}
                        className={`text-2xl ${hasRated ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform ${
                          (hasRated ? userRating : 0) >= star ? 'text-yellow-400' : 'text-gray-600'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="text-gray-400 text-sm ml-2">
                      {video.rating ? `${video.rating.toFixed(1)} (${video.totalRatings} ratings)` : 'No ratings yet'}
                    </span>
                  </div>
                  {hasRated && <p className="text-green-400 text-sm">Thanks for your rating!</p>}
                </div>

                {/* Comments Section */}
                <div className="bg-gray-900 rounded-lg p-4 mb-4">
                  <h3 className="text-white font-medium mb-3">Comments ({comments.length})</h3>
                  
                  {/* Add Comment */}
                  <div className="mb-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                        placeholder="Add a comment..."
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914] text-sm"
                      />
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="bg-[#E50914] hover:bg-[#c20913] disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Post
                      </button>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {comments.length === 0 ? (
                      <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="border-b border-gray-800 pb-3 last:border-b-0">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-[#E50914] rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                              {comment.author.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-white font-medium text-sm">{comment.author}</span>
                                <span className="text-gray-500 text-xs">
                                  {new Date(comment.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-300 text-sm leading-relaxed">{comment.text}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <button className="text-gray-500 hover:text-white text-xs flex items-center gap-1">
                                  <ThumbsUp className="h-3 w-3" />
                                  {comment.likes}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Related Videos Sidebar */}
            <div className="lg:col-span-1">
              {/* Up Next */}
              {autoPlay && allVideos.length > 1 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <SkipForward className="h-5 w-5 text-[#E50914]" />
                    Up Next
                  </h3>
                  {(() => {
                    const nextIndex = (currentVideoIndex + 1) % allVideos.length;
                    const nextVideo = allVideos[nextIndex];
                    return (
                      <Link
                        href={`/shorts/${nextVideo.id}`}
                        className="block group cursor-pointer"
                        onClick={() => setAutoPlayCountdown(null)}
                      >
                        <div className="relative aspect-[9/16] sm:aspect-video rounded-lg overflow-hidden bg-gray-800 mb-3">
                          <video
                            src={nextVideo.videoUrl}
                            className="w-full h-full object-cover"
                            muted
                            preload="metadata"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                            <Play className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 text-xs text-white rounded">
                            {formatDuration(nextVideo.duration)}
                          </span>
                          {nextVideo.quality && (
                            <span className="absolute top-2 left-2 bg-[#E50914]/90 px-2 py-1 text-xs text-white rounded">
                              {nextVideo.quality}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-medium text-white line-clamp-2 group-hover:text-[#E50914] transition-colors">
                          {nextVideo.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatCount(nextVideo.likes)} views
                        </p>
                      </Link>
                    );
                  })()}
                </div>
              )}

              <h2 className="text-xl font-semibold text-white mb-4">More Videos</h2>
              <div className="space-y-3">
                {allVideos.slice(currentVideoIndex + 1, currentVideoIndex + 6).concat(
                  allVideos.slice(0, Math.max(0, 5 - (allVideos.length - currentVideoIndex - 1)))
                ).map((nextVideo) => (
                  <Link
                    key={nextVideo.id}
                    href={`/shorts/${nextVideo.id}`}
                    className="flex gap-3 group cursor-pointer"
                  >
                    <div className="relative w-40 aspect-[9/16] sm:aspect-video rounded-md overflow-hidden bg-gray-800 flex-shrink-0">
                      <video
                        src={nextVideo.videoUrl}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                        <Play className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 text-xs text-white rounded">
                        {formatDuration(nextVideo.duration)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-[#E50914] transition-colors">
                        {nextVideo.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatCount(nextVideo.likes)} views
                      </p>
                      <div className="flex gap-1 mt-1">
                        {nextVideo.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-xs text-gray-500">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
