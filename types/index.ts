export interface ShortVideo {
  id: string;
  videoUrl: string;
  title: string;
  description: string;
  tags: string[];
  duration: number;
  likes: number;
  quality?: string; // e.g., '1080p', '720p', etc.
  comments?: Comment[];
  rating?: number; // Average rating 1-5
  totalRatings?: number;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: number;
  likes: number;
}