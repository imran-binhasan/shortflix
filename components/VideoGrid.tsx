'use client';

import { useState, useEffect, useMemo } from 'react';
import { ShortVideo } from '@/types';
import { debounce } from '@/lib/utils';
import TagFilter from './TagFilter';
import VideoCard from './VideoCard';
import Header from './Header';

export default function VideoGrid() {
  const [videos, setVideos] = useState<ShortVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [isTrending, setIsTrending] = useState(false);

  const fetchVideos = async (search?: string, tag?: string | null, trending?: boolean) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (tag) params.append('tag', tag);
      if (trending) params.append('trending', 'true');

      const response = await fetch(`/api/shorts?${params.toString()}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        let processedVideos = data;
        if (trending) {
          // Sort by likes for trending
          processedVideos = [...data].sort((a, b) => b.likes - a.likes);
        }
        setVideos(processedVideos);
      } else if (data.success) {
        let processedVideos = data.data;
        if (trending) {
          processedVideos = [...data.data].sort((a, b) => b.likes - a.likes);
        }
        setVideos(processedVideos);
      } else {
        setError(data.error || 'Failed to fetch videos');
      }
    } catch (err) {
      setError('Failed to load videos. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        fetchVideos(query, selectedTag, isTrending);
      }, 300),
    [selectedTag, isTrending]
  );

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
    fetchVideos(searchQuery, tag, isTrending);
  };

  const handleTrendingToggle = () => {
    const newTrending = !isTrending;
    setIsTrending(newTrending);
    fetchVideos(searchQuery, selectedTag, newTrending);
  };

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    videos.forEach((video) => {
      video.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [videos]);

  const handleLike = async (videoId: string) => {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;

    const isCurrentlyLiked = likedVideos.has(videoId);
    const action = isCurrentlyLiked ? 'unlike' : 'like';

    try {
      const response = await fetch('/api/shorts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: videoId, action }),
      });

      if (response.ok) {
        const updatedVideo = await response.json();
        // Update the video in the local state
        setVideos(prev => prev.map(v => v.id === videoId ? updatedVideo : v));
        
        // Update liked state
        setLikedVideos(prev => {
          const newSet = new Set(prev);
          if (isCurrentlyLiked) {
            newSet.delete(videoId);
          } else {
            newSet.add(videoId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error('Failed to update like:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Header onSearch={handleSearchChange} searchValue={searchQuery} onTrending={handleTrendingToggle} isTrending={isTrending} />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="h-10 w-64 animate-pulse rounded bg-gray-800" />
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-9/16 w-full rounded-sm bg-gray-800" />
                <div className="mt-2 h-4 w-3/4 rounded bg-gray-800" />
                <div className="mt-1 h-3 w-1/2 rounded bg-gray-800" />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header onSearch={handleSearchChange} searchValue={searchQuery} onTrending={handleTrendingToggle} isTrending={isTrending} />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="mb-4 text-6xl">😞</div>
          <h2 className="mb-2 text-2xl font-semibold text-white">Something went wrong</h2>
          <p className="mb-6 text-gray-400">{error}</p>
          <button
            onClick={() => fetchVideos()}
            className="rounded bg-[#E50914] px-6 py-2 font-medium text-white hover:bg-[#c20913] transition-colors"
          >
            Try Again
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header onSearch={handleSearchChange} searchValue={searchQuery} onTrending={handleTrendingToggle} isTrending={isTrending} />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <TagFilter
            tags={allTags}
            selectedTag={selectedTag}
            onTagSelect={handleTagSelect}
          />
        </div>

        {videos.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mb-4 text-6xl">🎬</div>
            <h2 className="mb-2 text-xl font-medium text-white">No videos found</h2>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onLike={handleLike}
                isLiked={likedVideos.has(video.id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
