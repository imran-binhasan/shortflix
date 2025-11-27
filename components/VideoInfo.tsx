'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Share2, Flag } from 'lucide-react';
import { ShortVideo } from '@/lib/schemas';
import { useVideoPlayerStore } from '@/lib/videoPlayerStore';
import { useVideoStore } from '@/lib/store';
import { formatCount } from '@/lib/utils';

interface VideoInfoProps {
  video: ShortVideo;
}

export default function VideoInfo({ video: initialVideo }: VideoInfoProps) {
  const [video, setVideo] = useState(initialVideo);
  const { updateVideoLike, updateVideoRating } = useVideoStore();
  const { isLiked, isDisliked, userRating, hasRated, setIsLiked, setIsDisliked, setUserRating, setHasRated } =
    useVideoPlayerStore();

  const handleLike = async () => {
    const action = isLiked ? 'unlike' : 'like';
    setIsLiked(!isLiked);

    try {
      const updatedVideo = await updateVideoLike(video.id, action);
      setVideo(updatedVideo);
    } catch (error) {
      console.error('Failed to update like:', error);
      setIsLiked(isLiked); // Rollback
    }
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleRating = async (rating: number) => {
    if (hasRated) return;

    setUserRating(rating);
    setHasRated(true);

    try {
      const updatedVideo = await updateVideoRating(video.id, rating);
      setVideo(updatedVideo);
    } catch (error) {
      console.error('Failed to add rating:', error);
      setHasRated(false);
      setUserRating(0);
    }
  };

  return (
    <div className="mt-4">
      <h1 className="text-2xl font-semibold text-white mb-3">{video.title}</h1>

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
            <ThumbsUp className={`h-4 w-4 sm:h-5 sm:w-5 ${isLiked ? 'fill-white' : ''}`} />
            <span className="text-xs sm:text-sm sm:font-medium">Like</span>
          </button>

          <button
            onClick={handleDislike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              isDisliked ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <ThumbsDown className={`h-4 w-4 sm:h-5 sm:w-5 ${isDisliked ? 'fill-white' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-xs sm:text-sm sm:font-medium">Share</span>
          </button>

          <button className="p-2 rounded-full bg-gray-800 px-4 text-gray-300 hover:bg-gray-700 transition-colors">
            <Flag className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="bg-gray-900 rounded-lg p-4 mb-4">
        <p className="text-gray-300 text-sm leading-relaxed">{video.description}</p>
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
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              disabled={hasRated}
              className={`text-2xl tracking-tighter ${
                hasRated ? 'cursor-default' : 'cursor-pointer hover:scale-110'
              } transition-transform ${(hasRated ? userRating : 0) >= star ? 'text-yellow-400' : 'text-gray-600'}`}
            >
              ★
            </button>
          ))}
          <span className="text-gray-400 text-sm ml-2">
            {video.rating ? `${video.rating.toFixed(1)} (${video.totalRatings} ratings)` : 'No ratings yet'}
          </span>
        </div>
        {hasRated && <p className="text-green-400 text-sm mt-2">Thanks for your rating!</p>}
      </div>
    </div>
  );
}