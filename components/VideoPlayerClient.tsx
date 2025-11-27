'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ShortVideo } from '@/lib/schemas';
import { useVideoPlayerStore } from '@/lib/videoPlayerStore';
import VideoPlayer from './VideoPlayer';
import VideoInfo from './VideoInfo';
import VideoComments from './VideoComments';
import RelatedVideosSidebar from './RelatedVideosSidebar';

interface VideoPlayerClientProps {
  video: ShortVideo;
  allVideos: ShortVideo[];
  relatedVideos: ShortVideo[];
  currentVideoIndex: number;
}

export default function VideoPlayerClient({
  video,
  allVideos,
  relatedVideos,
  currentVideoIndex,
}: VideoPlayerClientProps) {
  const router = useRouter();
  const { resetPlayerState, autoPlayCountdown, setAutoPlayCountdown } = useVideoPlayerStore();

  // Reset player state when video changes
  useEffect(() => {
    resetPlayerState();
  }, [video.id, resetPlayerState]);

  // Handle auto-play countdown redirect
  useEffect(() => {
    if (autoPlayCountdown === 0) {
      const nextIndex = (currentVideoIndex + 1) % allVideos.length;
      const nextVideo = allVideos[nextIndex];
      router.push(`/shorts/${nextVideo.id}`);
      setAutoPlayCountdown(null);
    }
  }, [autoPlayCountdown, currentVideoIndex, allVideos, router, setAutoPlayCountdown]);

  const goToNextVideo = () => {
    const nextIndex = (currentVideoIndex + 1) % allVideos.length;
    const nextVideo = allVideos[nextIndex];
    router.push(`/shorts/${nextVideo.id}`);
  };

  const goToPreviousVideo = () => {
    const prevIndex = currentVideoIndex === 0 ? allVideos.length - 1 : currentVideoIndex - 1;
    const prevVideo = allVideos[prevIndex];
    router.push(`/shorts/${prevVideo.id}`);
  };

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
              allVideos={allVideos}
              relatedVideos={relatedVideos}
              currentVideoIndex={currentVideoIndex}
            />
          </div>
        </div>
      </div>
    </div>
  );
}