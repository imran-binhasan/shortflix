// app/shorts/[id]/page.tsx
import Header from '@/components/Header';
import VideoPlayerClient from '@/components/VideoPlayerClient';

interface VideoPageProps {
  params: Promise<{ id: string }>;
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { id } = await params;

  return (
    <>
      <Header />
      <VideoPlayerClient videoId={id} />
    </>
  );
}