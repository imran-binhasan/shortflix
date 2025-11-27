// app/shorts/[id]/page.tsx
import { notFound } from 'next/navigation';
import { ShortVideo } from '@/lib/schemas';
import Header from '@/components/Header';
import VideoPlayerClient from '@/components/VideoPlayerClient';

interface VideoPageProps {
  params: Promise<{ id: string }>;
}

async function getVideo(id: string): Promise<{ video: ShortVideo; allVideos: ShortVideo[] } | null> {
  try {
    const res = await fetch('/api/shorts', {
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const videos: ShortVideo[] = await res.json();
    const video = videos.find((v) => v.id === id);

    if (!video) return null;

    return { video, allVideos: videos };
  } catch (error) {
    console.error('Failed to fetch video:', error);
    return null;
  }
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { id } = await params;
  const data = await getVideo(id);

  if (!data) {
    notFound();
  }

  const { video, allVideos } = data;
  
  // Get related videos (same tags)
  const relatedVideos = allVideos
    .filter((v) => v.id !== video.id && v.tags.some((tag) => video.tags.includes(tag)))
    .slice(0, 8);

  // Find current video index
  const currentVideoIndex = allVideos.findIndex((v) => v.id === id);

  return (
    <>
      <Header />
      <VideoPlayerClient
        video={video}
        allVideos={allVideos}
        relatedVideos={relatedVideos}
        currentVideoIndex={currentVideoIndex}
      />
    </>
  );
}