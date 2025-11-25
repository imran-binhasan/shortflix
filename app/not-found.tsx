'use client';

import Link from 'next/link';
import { Home, Search, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#E50914] to-[#c20913] rounded-full mb-6">
            <AlertTriangle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-6xl font-black text-white mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">Page Not Found</h2>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-[#E50914] to-[#c20913] hover:from-[#c20913] hover:to-[#a00812] text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-red-900/50"
          >
            <Home className="h-5 w-5" />
            Go Home
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors border border-gray-700"
          >
            <Search className="h-5 w-5" />
            Browse Videos
          </Link>
        </div>
      </div>
    </div>
  );
}