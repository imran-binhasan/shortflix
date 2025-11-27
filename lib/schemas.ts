// lib/schemas.ts
import { z } from 'zod';

// Comment schema
export const commentSchema = z.object({
  id: z.string(),
  author: z.string().min(1, 'Author name is required'),
  text: z.string().min(1, 'Comment text is required').max(500, 'Comment is too long'),
  timestamp: z.number(),
  likes: z.number().int().min(0).default(0),
});

// Short video schema
export const shortVideoSchema = z.object({
  id: z.string(),
  videoUrl: z.string().url('Invalid video URL'),
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').default(''),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  duration: z.number().int().min(0, 'Duration must be positive').default(0),
  likes: z.number().int().min(0).default(0),
  quality: z.string().optional(),
  comments: z.array(commentSchema).default([]),
  rating: z.number().min(0).max(5).default(0),
  totalRatings: z.number().int().min(0).default(0),
});

// Input schema used by POST (form input)
export const videoInputSchema = z.object({
  videoUrl: z.string().url('Please enter a valid video URL'),
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  duration: z.number().int().min(0, 'Duration must be positive').optional(),
});

// PATCH body schema (discriminated union by action)
export const patchLikeSchema = z.object({
  action: z.literal('like'),
  id: z.string(),
});
export const patchUnlikeSchema = z.object({
  action: z.literal('unlike'),
  id: z.string(),
});
export const patchCommentSchema = z.object({
  action: z.literal('comment'),
  id: z.string(),
  comment: z.object({
    author: z.string().optional(),
    text: z.string().min(1),
  }),
});
export const patchRateSchema = z.object({
  action: z.literal('rate'),
  id: z.string(),
  rating: z.number().min(0).max(5),
});
export const patchDurationSchema = z.object({
  action: z.literal('updateDuration'),
  id: z.string(),
  duration: z.number().int().min(0),
});

export const patchSchema = z.discriminatedUnion('action', [
  patchLikeSchema,
  patchUnlikeSchema,
  patchCommentSchema,
  patchRateSchema,
  patchDurationSchema,
]);

// exports
export type Comment = z.infer<typeof commentSchema>;
export type ShortVideo = z.infer<typeof shortVideoSchema>;
export type VideoInput = z.infer<typeof videoInputSchema>;
export type PatchBody = z.infer<typeof patchSchema>;
