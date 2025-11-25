import { Videotape } from 'lucide-react';
export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-linear-to-br from-red-500 to-red-600 p-2.5 shadow-lg shadow-red-500/20">
              <Videotape className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-linear-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Short-flix
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Discover amazing videos for free
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}