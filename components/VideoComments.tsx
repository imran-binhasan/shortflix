'use client';

import { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { ShortVideo, Comment } from '@/lib/schemas';
import { useVideoPlayerStore } from '@/lib/videoPlayerStore';

interface VideoCommentsProps {
  video: ShortVideo;
}

export default function VideoComments({ video: initialVideo }: VideoCommentsProps) {
  const [video, setVideo] = useState(initialVideo);
  const [comments, setComments] = useState<Comment[]>(initialVideo.comments || []);
  const { newComment, setNewComment } = useVideoPlayerStore();

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch('/api/shorts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: video.id,
          action: 'comment',
          comment: { author: 'User', text: newComment.trim() },
        }),
      });

      if (response.ok) {
        const updatedVideo = await response.json();
        setVideo(updatedVideo);
        setComments(updatedVideo.comments || []);
        setNewComment('');
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 mb-4">
      <h3 className="text-white font-medium mb-3">Comments ({comments.length})</h3>

      {/* Add Comment */}
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            placeholder="Add a comment..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914] text-sm"
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="bg-[#E50914] hover:bg-[#c20913] disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Post
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-800 pb-3 last:border-b-0">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#E50914] rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  {comment.author.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium text-sm">{comment.author}</span>
                    <span className="text-gray-500 text-xs">
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{comment.text}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <button className="text-gray-500 hover:text-white text-xs flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {comment.likes}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}