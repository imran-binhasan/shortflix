export interface ShortVideo {
  id: string;
  videoUrl: string;
  title: string;
  description: string;
  tags: string[];
  duration: number; // in seconds
  likes: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface VideoPlayerProps {
  video: ShortVideo | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: (id: string) => void;
  isLiked: boolean;
}

export interface VideoCardProps {
  video: ShortVideo;
  onClick: () => void;
  onLike: (id: string) => void;
  isLiked: boolean;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export interface TagFilterProps {
  tags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}