'use client';

import { Play, Heart } from 'lucide-react';
import Link from 'next/link';
import { ShortVideo } from '@/lib/schemas';
import { formatDuration, formatCount } from '@/lib/utils';

interface VideoCardProps {
  video: ShortVideo;
  onLike: (id: string) => void;
  isLiked: boolean;
}

export default function VideoCard({ video, onLike, isLiked }: VideoCardProps) {
  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLike(video.id);
  };

  return (
    <Link href={`/shorts/${video.id}`} className="group">
      <div className="relative">
        {/* Vertical Short Video Thumbnail */}
        <div className="relative aspect-9/16 w-full overflow-hidden rounded-lg bg-linear-to-br from-gray-900 to-black shadow-lg group-hover:shadow-2xl group-hover:shadow-red-900/20 transition-all duration-300">
          <video
            src={video.videoUrl}
            className="h-full w-full object-cover"
            muted
            preload="metadata"
          />
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-60" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="rounded-full bg-[#E50914] p-4 transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
              <Play className="h-8 w-8 text-white" fill="white" />
            </div>
          </div>

          {/* Duration Badge */}
          <div className="absolute top-2 right-2 bg-black/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-white shadow-lg">
            {formatDuration(video.duration)}
          </div>

          {/* Quality Badge */}
          {video.quality && (
            <div className="absolute top-2 left-2 bg-[#E50914]/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-white shadow-lg">
              {video.quality}
            </div>
          )}

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-0 transition-transform duration-300">
            <h3 className="text-sm font-semibold text-white line-clamp-2 mb-1 drop-shadow-lg">
              {video.title}
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-gray-200">
                <span className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
                  {video.tags[0]}
                </span>
              </div>

              <button
                onClick={handleLikeClick}
                className="flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full hover:bg-[#E50914] transition-all duration-200"
              >
                <Heart
                  className={`h-3.5 w-3.5 ${
                    isLiked ? 'fill-white text-white' : 'text-white'
                  }`}
                />
                <span className="text-xs font-semibold text-white">
                  {formatCount(video.likes)}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
