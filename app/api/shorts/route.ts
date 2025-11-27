import { NextRequest, NextResponse } from 'next/server';
import { shortsData } from '@/lib/data';
import {
  shortVideoSchema,
  videoInputSchema,
  patchSchema,
  ShortVideo,
} from '@/lib/schemas';
import { z } from 'zod';

// helper: validate entire array before returning
function validateVideosArray(items: unknown) {
  const arrSchema = z.array(shortVideoSchema);
  return arrSchema.parse(items);
}

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
          (video.description || '').toLowerCase().includes(searchQuery)
      );
    }

    if (tagFilter) {
      filteredVideos = filteredVideos.filter((video) =>
        video.tags.some((tag) => tag.toLowerCase() === tagFilter)
      );
    }

    // Validate output (throws ZodError if invalid)
    const validated = validateVideosArray(filteredVideos);

    return NextResponse.json(validated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Data validation error', details: err.flatten() }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    const parseResult = videoInputSchema.safeParse(raw);

    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid input', details: parseResult.error.flatten() }, { status: 400 });
    }

    const data = parseResult.data;

    // Build full object and let shortVideoSchema apply defaults / validation
    const toParse: Partial<ShortVideo> = {
      id: (shortsData.length + 1).toString(),
      videoUrl: data.videoUrl,
      title: data.title,
      description: data.description ?? '',
      tags: Array.isArray(data.tags) ? data.tags : [String(data.tags)],
      duration: data.duration ?? 0,
      likes: 0,
      quality: 'Auto',
      comments: [],
      rating: 0,
      totalRatings: 0,
    };

    const newVideo = shortVideoSchema.parse(toParse);
    shortsData.push(newVideo);

    return NextResponse.json(newVideo, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to add video' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const raw = await request.json();
    const parseResult = patchSchema.safeParse(raw);

    if (!parseResult.success) {
      return NextResponse.json({ error: 'Invalid patch payload', details: parseResult.error.flatten() }, { status: 400 });
    }

    const body = parseResult.data;

    const idx = shortsData.findIndex((v) => v.id === body.id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const video = shortsData[idx];

    switch (body.action) {
      case 'like':
        video.likes = (video.likes || 0) + 1;
        break;
      case 'unlike':
        video.likes = Math.max(0, (video.likes || 0) - 1);
        break;
      case 'comment': {
        const newComment = {
          id: Date.now().toString(),
          author: body.comment.author ?? 'Anonymous',
          text: body.comment.text,
          timestamp: Date.now(),
          likes: 0,
        };
        video.comments = video.comments || [];
        video.comments.push(newComment);
        break;
      }
      case 'rate': {
        const currentRating = video.rating ?? 0;
        const currentTotal = video.totalRatings ?? 0;
        const newTotal = currentTotal + 1;
        const newRating = ((currentRating * currentTotal) + body.rating) / newTotal;
        video.rating = Number(newRating.toFixed(2));
        video.totalRatings = newTotal;
        break;
      }
      case 'updateDuration':
        video.duration = body.duration;
        break;
      default:
        return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
    }

    // validate mutated item before returning
    const validated = shortVideoSchema.parse(video);
    shortsData[idx] = validated;

    return NextResponse.json(validated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: err.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 });
  }
}
