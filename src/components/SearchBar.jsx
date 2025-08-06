"use client"

import { Search, Sparkles } from "lucide-react"

export function SearchBar({ searchQuery, setSearchQuery, onSearch, isLoading }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch()
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xs sm:max-w-md lg:max-w-2xl">
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300" />

        {/* Search input */}
        <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700 rounded-xl sm:rounded-2xl overflow-hidden">
          <div className="flex items-center">
            <div className="pl-3 sm:pl-4 lg:pl-6 pr-2 sm:pr-3 lg:pr-4 py-3 sm:py-4 lg:py-5">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies, shows..."
              className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm sm:text-base lg:text-lg focus:outline-none pr-2 sm:pr-4 lg:pr-6 py-3 sm:py-4 lg:py-5 min-w-0"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !searchQuery.trim()}
              className="mr-1 sm:mr-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 rounded-lg sm:rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-xs sm:text-sm lg:text-base flex items-center gap-1 sm:gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="hidden sm:inline">Searching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Search</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
