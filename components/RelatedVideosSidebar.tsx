'use client';

import Link from 'next/link';
import { Play, SkipForward } from 'lucide-react';
import { ShortVideo } from '@/lib/schemas';
import { useVideoPlayerStore } from '@/lib/videoPlayerStore';
import { formatDuration, formatCount } from '@/lib/utils';

interface RelatedVideosSidebarProps {
  allVideos: ShortVideo[];
  relatedVideos: ShortVideo[];
  currentVideoIndex: number;
}

export default function RelatedVideosSidebar({
  allVideos,
  relatedVideos,
  currentVideoIndex,
}: RelatedVideosSidebarProps) {
  const { autoPlay, setAutoPlayCountdown } = useVideoPlayerStore();

  const nextVideo = allVideos[(currentVideoIndex + 1) % allVideos.length];

  return (
    <>
      {/* Up Next */}
      {autoPlay && allVideos.length > 1 && nextVideo && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <SkipForward className="h-5 w-5 text-[#E50914]" />
            Up Next
          </h3>
          <Link
            href={`/shorts/${nextVideo.id}`}
            className="block group cursor-pointer"
            onClick={() => setAutoPlayCountdown(null)}
          >
            <div className="relative aspect-9/16 sm:aspect-video rounded-lg overflow-hidden bg-gray-800 mb-3">
              <video src={nextVideo.videoUrl} className="w-full h-full object-cover" muted preload="metadata" />
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
            <p className="text-sm text-gray-400">{formatCount(nextVideo.likes)} views</p>
          </Link>
        </div>
      )}

      {/* Related Videos */}
      <h2 className="text-xl font-semibold text-white mb-4">Related Videos</h2>
      <div className="space-y-3">
        {relatedVideos.slice(0, 5).map((video) => (
          <Link key={video.id} href={`/shorts/${video.id}`} className="flex gap-3 group cursor-pointer">
            <div className="relative w-40 aspect-9/16 sm:aspect-video rounded-md overflow-hidden bg-gray-800 shrink-0">
              <video src={video.videoUrl} className="w-full h-full object-cover" muted preload="metadata" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                <Play className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 text-xs text-white rounded">
                {formatDuration(video.duration)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-[#E50914] transition-colors">
                {video.title}
              </h3>
              <p className="text-xs text-gray-400 mt-1">{formatCount(video.likes)} views</p>
              <div className="flex gap-1 mt-1">
                {video.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-xs text-gray-500">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}