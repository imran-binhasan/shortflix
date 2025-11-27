'use client';

import { create } from 'zustand';

interface VideoPlayerState {
  // Playback state
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isFullscreen: boolean;
  showControls: boolean;
  showVolumeSlider: boolean;
  videoLoading: boolean;

  // User interactions
  isLiked: boolean;
  isDisliked: boolean;
  userRating: number;
  hasRated: boolean;
  newComment: string;

  // Auto-play
  autoPlay: boolean;
  autoPlayCountdown: number | null;

  // Actions - Playback controls
  setIsPlaying: (playing: boolean) => void;
  setIsMuted: (muted: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setIsFullscreen: (fullscreen: boolean) => void;
  setShowControls: (show: boolean) => void;
  setShowVolumeSlider: (show: boolean) => void;
  setVideoLoading: (loading: boolean) => void;

  // Actions - User interactions
  setIsLiked: (liked: boolean) => void;
  setIsDisliked: (disliked: boolean) => void;
  setUserRating: (rating: number) => void;
  setHasRated: (rated: boolean) => void;
  setNewComment: (comment: string) => void;

  // Actions - Auto-play
  setAutoPlay: (autoPlay: boolean) => void;
  setAutoPlayCountdown: (countdown: number | null | ((prev: number | null) => number | null)) => void;

  // Reset state when changing videos
  resetPlayerState: () => void;
}

const initialState = {
  isPlaying: false,
  isMuted: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isFullscreen: false,
  showControls: true,
  showVolumeSlider: false,
  videoLoading: true,
  isLiked: false,
  isDisliked: false,
  userRating: 0,
  hasRated: false,
  newComment: '',
  autoPlay: false,
  autoPlayCountdown: null,
};

export const useVideoPlayerStore = create<VideoPlayerState>((set) => ({
  ...initialState,

  // Playback controls
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setIsMuted: (muted) => set({ isMuted: muted }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration: duration }),
  setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
  setIsFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),
  setShowControls: (show) => set({ showControls: show }),
  setShowVolumeSlider: (show) => set({ showVolumeSlider: show }),
  setVideoLoading: (loading) => set({ videoLoading: loading }),

  // User interactions
  setIsLiked: (liked) => set({ isLiked: liked, isDisliked: liked ? false : undefined }),
  setIsDisliked: (disliked) => set({ isDisliked: disliked, isLiked: disliked ? false : undefined }),
  setUserRating: (rating) => set({ userRating: rating }),
  setHasRated: (rated) => set({ hasRated: rated }),
  setNewComment: (comment) => set({ newComment: comment }),

  // Auto-play
  setAutoPlay: (autoPlay) => set({ autoPlay }),
  setAutoPlayCountdown: (countdown) =>
    set((state) => ({
      autoPlayCountdown: typeof countdown === 'function' ? countdown(state.autoPlayCountdown) : countdown,
    })),

  // Reset state
  resetPlayerState: () => set(initialState),
}));