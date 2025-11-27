// components/VideoGrid.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import TagFilter from './TagFilter';
import VideoCard from './VideoCard';
import { useVideoStore } from '@/lib/store';

export default function VideoGridClient() {
  const {
    videos,
    isLoading,
    error,
    fetchVideos,
    searchQuery,
    selectedTag,
    setSelectedTag,
    isTrending,
    updateVideoLike,
  } = useVideoStore();

  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());

  // Fetch videos on mount
  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const filteredVideos = useMemo(() => {
    let filtered = [...videos];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.title.toLowerCase().includes(query) ||
          v.description.toLowerCase().includes(query) ||
          v.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Tag filter
    if (selectedTag) {
      filtered = filtered.filter((v) => v.tags.includes(selectedTag));
    }

    // Trending filter (sort by likes)
    if (isTrending) {
      filtered = filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }

    return filtered;
  }, [videos, searchQuery, selectedTag, isTrending]);

  const handleLike = async (videoId: string) => {
    const wasLiked = likedVideos.has(videoId);
    
    // Optimistic UI update
    setLikedVideos((prev) => {
      const newSet = new Set(prev);
      wasLiked ? newSet.delete(videoId) : newSet.add(videoId);
      return newSet;
    });

    // Sync with backend
    try {
      await updateVideoLike(videoId, wasLiked ? 'unlike' : 'like');
    } catch (error) {
      // Rollback on error
      setLikedVideos((prev) => {
        const newSet = new Set(prev);
        wasLiked ? newSet.add(videoId) : newSet.delete(videoId);
        return newSet;
      });
    }
  };

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    videos.forEach((v) => v.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [videos]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="h-10 w-64 animate-pulse rounded bg-gray-800" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-9/16 w-full rounded-sm bg-gray-800" />
              <div className="mt-2 h-4 w-3/4 rounded bg-gray-800" />
              <div className="mt-1 h-3 w-1/2 rounded bg-gray-800" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-4 text-6xl">😞</div>
        <h2 className="mb-2 text-2xl font-semibold text-white">
          Something went wrong
        </h2>
        <p className="mb-6 text-gray-400">{error}</p>

        <button
          onClick={() => window.location.reload()}
          className="rounded bg-[#E50914] px-6 py-2 font-medium text-white hover:bg-[#c20913] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <TagFilter
          tags={allTags}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
        />
      </div>

      {filteredVideos.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mb-4 text-6xl">🎬</div>
          <h2 className="mb-2 text-xl font-medium text-white">
            No videos found
          </h2>
          <p className="text-gray-400">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
          {filteredVideos.map((video) => (
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
  );
}