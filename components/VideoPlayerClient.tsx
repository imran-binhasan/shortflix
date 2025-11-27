// components/VideoPlayerClient.tsx
'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useVideoStore } from '@/lib/store';
import { useVideoPlayerStore } from '@/lib/videoPlayerStore';
import VideoPlayer from './VideoPlayer';
import VideoInfo from './VideoInfo';
import VideoComments from './VideoComments';
import RelatedVideosSidebar from './RelatedVideosSidebar';

interface VideoPlayerClientProps {
  videoId: string;
}

export default function VideoPlayerClient({ videoId }: VideoPlayerClientProps) {
  const router = useRouter();
  const { videos, fetchVideos, isLoading } = useVideoStore();
  const { resetPlayerState, autoPlayCountdown, setAutoPlayCountdown } = useVideoPlayerStore();

  // Fetch videos if not loaded
  useEffect(() => {
    if (videos.length === 0) {
      fetchVideos();
    }
  }, [videos.length, fetchVideos]);

  const video = useMemo(() => 
    videos.find((v) => v.id === videoId),
    [videos, videoId]
  );

  const relatedVideos = useMemo(() => {
    if (!video) return [];
    return videos
      .filter((v) => v.id !== video.id && v.tags.some((tag) => video.tags.includes(tag)))
      .slice(0, 8);
  }, [video, videos]);

  const currentVideoIndex = useMemo(() => 
    videos.findIndex((v) => v.id === videoId),
    [videos, videoId]
  );

  // Reset player state when video changes
  useEffect(() => {
    resetPlayerState();
  }, [videoId, resetPlayerState]);

  // Handle auto-play countdown redirect
  useEffect(() => {
    if (autoPlayCountdown === 0 && videos.length > 0) {
      const nextIndex = (currentVideoIndex + 1) % videos.length;
      const nextVideo = videos[nextIndex];
      router.push(`/shorts/${nextVideo.id}`);
      setAutoPlayCountdown(null);
    }
  }, [autoPlayCountdown, currentVideoIndex, videos, router, setAutoPlayCountdown]);

  const goToNextVideo = () => {
    if (videos.length === 0) return;
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    const nextVideo = videos[nextIndex];
    router.push(`/shorts/${nextVideo.id}`);
  };

  const goToPreviousVideo = () => {
    if (videos.length === 0) return;
    const prevIndex = currentVideoIndex === 0 ? videos.length - 1 : currentVideoIndex - 1;
    const prevVideo = videos[prevIndex];
    router.push(`/shorts/${prevVideo.id}`);
  };

  // Loading state
  if (isLoading || !video) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-[#E50914]" />
          <p className="text-gray-400">Loading video...</p>
        </div>
      </div>
    );
  }

  return (
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
            <VideoPlayer
              video={video}
              onNext={goToNextVideo}
              onPrevious={goToPreviousVideo}
            />
            <VideoInfo video={video} />
            <VideoComments video={video} />
          </div>

          {/* Related Videos Sidebar */}
          <div className="lg:col-span-1">
            <RelatedVideosSidebar
              allVideos={videos}
              relatedVideos={relatedVideos}
              currentVideoIndex={currentVideoIndex}
            />
          </div>
        </div>
      </div>
    </div>
  );
}