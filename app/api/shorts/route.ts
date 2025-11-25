import { NextRequest, NextResponse } from 'next/server';
import { shortsData } from '@/lib/data';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get('search')?.toLowerCase();
    const tagFilter = searchParams.get('tag')?.toLowerCase();

    let filteredVideos = [...shortsData];

    if (searchQuery) {
      filteredVideos = filteredVideos.filter(
        (video) =>
          video.title.toLowerCase().includes(searchQuery) ||
          video.description.toLowerCase().includes(searchQuery)
      );
    }

    if (tagFilter) {
      filteredVideos = filteredVideos.filter((video) =>
        video.tags.some((tag) => tag.toLowerCase() === tagFilter)
      );
    }

    return NextResponse.json(filteredVideos);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.title || !body.videoUrl || !body.tags) {
      return NextResponse.json(
        { error: 'Missing required fields: title, videoUrl, tags' },
        { status: 400 }
      );
    }

    const newVideo = {
      id: (shortsData.length + 1).toString(),
      videoUrl: body.videoUrl,
      title: body.title,
      description: body.description || '',
      tags: Array.isArray(body.tags) ? body.tags : [body.tags],
      duration: 0, // Will be detected dynamically when video loads
      likes: 0,
      quality: 'Auto', // Will be detected or set based on video properties
      comments: [],
      rating: 0,
      totalRatings: 0,
    };

    shortsData.push(newVideo);

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add video' },
      { status: 500 }
    );
  }
}

// Handle likes
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, comment, rating, duration } = body;

    const video = shortsData.find(v => v.id === id);
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    if (action === 'like') {
      video.likes += 1;
    } else if (action === 'unlike') {
      video.likes = Math.max(0, video.likes - 1);
    } else if (action === 'comment' && comment) {
      const newComment = {
        id: Date.now().toString(),
        author: comment.author || 'Anonymous',
        text: comment.text,
        timestamp: Date.now(),
        likes: 0,
      };
      video.comments = video.comments || [];
      video.comments.push(newComment);
    } else if (action === 'rate' && rating) {
      video.totalRatings = (video.totalRatings || 0) + 1;
      const currentRating = video.rating || 0;
      video.rating = ((currentRating * (video.totalRatings - 1)) + rating) / video.totalRatings;
    } else if (action === 'updateDuration' && duration !== undefined) {
      video.duration = duration;
    }

    return NextResponse.json(video);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    );
  }
}
