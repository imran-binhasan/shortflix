'use client';

import { useState } from 'react';
import { formatDuration } from '@/lib/utils';
import { Upload, Plus, X, Check, AlertCircle, CheckCircle, UploadCloud } from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';

export default function AdminPage() {
  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    description: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validatingVideo, setValidatingVideo] = useState(false);
  const [videoValid, setVideoValid] = useState<boolean | null>(null);
  const [detectedDuration, setDetectedDuration] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if video URL is valid
    if (videoValid !== true) {
      setError('Please enter a valid video URL before submitting.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      const response = await fetch('/api/shorts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          videoUrl: formData.videoUrl,
          description: formData.description,
          tags: tagsArray,
          duration: detectedDuration || 0, // Use detected duration or 0 as fallback
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setShowSuccessModal(true);
        setFormData({
          title: '',
          videoUrl: '',
          description: '',
          tags: '',
        });
        setVideoValid(null); // Reset validation state
        setDetectedDuration(null); // Reset detected duration
        setTimeout(() => {
          setSuccess(false);
          setShowSuccessModal(false);
        }, 3000);
      } else {
        setError(data.error || 'Failed to add video');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateVideoUrl = async (url: string): Promise<{ isValid: boolean; duration?: number }> => {
    try {
      setValidatingVideo(true);
      setVideoValid(null);
      setDetectedDuration(null);
      
      // Try to create a video element and see if it can load metadata
      return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        
        video.onloadedmetadata = () => {
          // Video loaded successfully
          const duration = Math.floor(video.duration);
          setDetectedDuration(duration);
          resolve({ isValid: true, duration });
        };
        
        video.onerror = () => {
          // Video failed to load
          resolve({ isValid: false });
        };
        
        // Set a timeout in case the video takes too long
        setTimeout(() => {
          resolve({ isValid: false });
        }, 10000); // 10 second timeout
        
        video.src = url;
      });
    } catch (error) {
      console.error('Video validation error:', error);
      return { isValid: false };
    } finally {
      setValidatingVideo(false);
    }
  };

  const handleVideoUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData({
      ...formData,
      videoUrl: url,
    });
    
    // Clear previous validation state
    setVideoValid(null);
    setDetectedDuration(null);
    
    // If URL is not empty, validate it
    if (url.trim()) {
      const result = await validateVideoUrl(url);
      setVideoValid(result.isValid);
      if (result.isValid && result.duration) {
        setDetectedDuration(result.duration);
      }
    }
  };

  const sampleVideos = [
    'https://www.w3schools.com/html/mov_bbb.mp4',
    'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    'https://samplelib.com/lib/preview/mp4/sample-10s.mp4',
    'https://samplelib.com/lib/preview/mp4/sample-15s.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
            >
              <X className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-gradient-to-br from-[#E50914] to-[#c20913] rounded-xl">
                <UploadCloud className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-white">Add New Video</h1>
                <p className="text-gray-400">Upload a new short video to the platform</p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-900/30 border border-green-500/50 rounded-lg flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500" />
              <span className="text-green-400 font-medium">Video added successfully!</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-400 font-medium">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Video URL */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <label className="block text-sm font-semibold text-white mb-2">
                Video URL *
              </label>
              <div className="relative">
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleVideoUrlChange}
                  required
                  placeholder="https://example.com/video.mp4"
                  className={`w-full bg-gray-900 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors pr-12 ${
                    videoValid === true ? 'border-green-500 focus:border-green-500' : 
                    videoValid === false ? 'border-red-500 focus:border-red-500' : 
                    'border-gray-700 focus:border-[#E50914]'
                  }`}
                />
                {validatingVideo && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-5 w-5 border-2 border-gray-400 border-t-[#E50914] rounded-full animate-spin" />
                  </div>
                )}
                {!validatingVideo && videoValid !== null && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {videoValid ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">Enter a direct link to an MP4 video file</p>
              
              {/* Validation Message */}
              {videoValid === false && (
                <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Invalid video URL. Please check the link and try again.
                </p>
              )}
              {videoValid === true && (
                <p className="mt-2 text-xs text-green-400 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Video URL is valid and accessible.
                </p>
              )}
              
              {/* Sample Videos */}
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-400 mb-2">Sample video URLs:</p>
                <div className="space-y-1">
                  {sampleVideos.map((url, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, videoUrl: url });
                        setVideoValid(null); // Reset validation when using sample
                        setDetectedDuration(null); // Reset detected duration
                      }}
                      className="block w-full text-left px-3 py-2 bg-gray-800/50 hover:bg-gray-800 rounded text-xs text-gray-400 hover:text-[#E50914] transition-colors"
                    >
                      {url}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Duration Display */}
            {detectedDuration !== null && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <label className="block text-sm font-semibold text-white mb-2">
                  Detected Duration
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">{formatDuration(detectedDuration)}</span>
                  <span className="text-xs text-gray-500">({detectedDuration} seconds)</span>
                </div>
              </div>
            )}

            {/* Title */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <label className="block text-sm font-semibold text-white mb-2">
                Video Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter video title"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914] transition-colors"
              />
            </div>

            {/* Description */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <label className="block text-sm font-semibold text-white mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Enter video description"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914] transition-colors resize-none"
              />
            </div>

            {/* Tags */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <label className="block text-sm font-semibold text-white mb-2">
                Tags *
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                required
                placeholder="animation, nature, adventure"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914] transition-colors"
              />
              <p className="mt-2 text-xs text-gray-500">Separate tags with commas</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || videoValid !== true}
              className="w-full bg-linear-to-r from-[#E50914] to-[#c20913] hover:from-[#c20913] hover:to-[#a00812] text-white font-medium py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-red-900/50"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Adding Video...</span>
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  <span>Add Video to Platform</span>
                </>
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-8 p-6 bg-gray-900/30 border border-gray-800 rounded-xl">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-[#E50914]" />
              Important Notes
            </h3>
            <ul className="text-sm text-gray-400 space-y-1 ml-7">
              <li>• Videos are stored in memory and will reset on server restart</li>
              <li>• Make sure the video URL is publicly accessible</li>
              <li>• Video URLs are validated before adding to ensure they work</li>
              <li>• Supported format: MP4</li>
              <li>• Duration and quality are detected automatically from the video</li>
              <li>• All fields marked with * are required</li>
            </ul>
          </div>
        </div>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 max-w-md w-full mx-4 text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-green-500/20 rounded-full">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Video Added Successfully!</h3>
              <p className="text-gray-400 mb-6">Your video has been added to the platform and is now live.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Continue Adding
                </button>
                <Link
                  href="/"
                  className="flex-1 bg-[#E50914] hover:bg-[#c20913] text-white font-medium py-2 px-4 rounded-lg transition-colors text-center"
                >
                  View Videos
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
