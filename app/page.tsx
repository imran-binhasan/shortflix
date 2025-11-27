// app/page.tsx
import { ShortVideo } from '@/lib/schemas';
import Header from '@/components/Header';
import VideoGridClient from '@/components/VideoGrid';

// Server-side data fetching
async function getVideos(): Promise<ShortVideo[]> {
  try {
    // Fetch from your own API route
    const res = await fetch('/api/shorts', {
      cache: 'no-store', // Always get fresh data
      // Or use: next: { revalidate: 60 } for ISR
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch videos');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
}

export default async function Home() {
  // Fetch data on the server
  const initialVideos = await getVideos();

  return (
    <>
      <Header />
      <VideoGridClient initialVideos={initialVideos} />
    </>
  );
}