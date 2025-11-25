import { NextRequest, NextResponse } from 'next/server';
import { shortsData } from '@/lib/data';


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get('search')?.toLowerCase();
    const tagFilter = searchParams.get('tag')?.toLowerCase();

    let filteredVideos = [...shortsData];

    // Apply search filter
    if (searchQuery) {
      filteredVideos = filteredVideos.filter(
        (video) =>
          video.title.toLowerCase().includes(searchQuery) ||
          video.description.toLowerCase().includes(searchQuery)
      );
    }

    // Apply tag filter
    if (tagFilter) {
      filteredVideos = filteredVideos.filter((video) =>
        video.tags.some((tag) => tag.toLowerCase() === tagFilter)
      );
    }

    // Return direct array format (matches task specification exactly)
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
    
    // Validate required fields
    if (!body.title || !body.videoUrl || !body.tags) {
      return NextResponse.json(
        { error: 'Missing required fields: title, videoUrl, tags' },
        { status: 400 }
      );
    }

    // Create new video entry
    const newVideo = {
      id: (shortsData.length + 1).toString(),
      videoUrl: body.videoUrl,
      title: body.title,
      description: body.description || '',
      tags: Array.isArray(body.tags) ? body.tags : [body.tags],
      duration: body.duration || 0,
      likes: 0,
    };

    // Add to in-memory array (will reset on server restart)
    shortsData.push(newVideo);

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add video' },
      { status: 500 }
    );
  }
}