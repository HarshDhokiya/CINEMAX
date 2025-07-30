"use client"

import { Search, Sparkles } from "lucide-react"

export function SearchBar({ searchQuery, setSearchQuery, onSearch, isLoading }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch()
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300" />

        {/* Search input */}
        <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden">
          <div className="flex items-center">
            <div className="pl-6 pr-4 py-5">
              <Search className="w-6 h-6 text-purple-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies, actors, directors..."
              className="flex-1 bg-transparent text-white placeholder-gray-400 text-lg focus:outline-none pr-6 py-5"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !searchQuery.trim()}
              className="mr-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
