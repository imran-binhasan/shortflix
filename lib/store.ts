'use client';

import { create } from 'zustand';
import { ShortVideo } from './schemas';

interface VideoStore {
  // State
  videos: ShortVideo[];
  currentVideoIndex: number;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedTag: string | null;
  isTrending: boolean;

  // Basic actions
  setVideos: (videos: ShortVideo[]) => void;
  addVideo: (video: ShortVideo) => void;
  setCurrentVideoIndex: (index: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Filter actions
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string | null) => void;
  setIsTrending: (trending: boolean) => void;

  // Fetch videos
  fetchVideos: () => Promise<void>;
}

export const useVideoStore = create<VideoStore>((set) => ({
  // Initial state
  videos: [],
  currentVideoIndex: 0,
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedTag: null,
  isTrending: false,

  // Basic setters
  setVideos: (videos) => set({ videos }),
  addVideo: (video) => set((state) => ({ videos: [video, ...state.videos] })),
  setCurrentVideoIndex: (index) => set({ currentVideoIndex: index }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // Filter setters
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedTag: (tag) => set({ selectedTag: tag }),
  setIsTrending: (trending) => set({ isTrending: trending }),

  // Fetch videos from API
  fetchVideos: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/shorts');
      if (!res.ok) throw new Error('Failed to fetch videos');
      const data: ShortVideo[] = await res.json();
      set({ videos: data, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Something went wrong',
        isLoading: false,
      });
    }
  },
}));