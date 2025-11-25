export interface ShortVideo {
  id: string;
  videoUrl: string;
  title: string;
  description: string;
  tags: string[];
  duration: number;
  likes: number;
  quality?: string; 
  comments?: Comment[];
  rating?: number;
  totalRatings?: number;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: number;
  likes: number;
}