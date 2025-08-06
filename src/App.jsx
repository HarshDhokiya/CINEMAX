"use client"

import { useState, useEffect } from "react"
import { Search, TrendingUp, Zap } from "lucide-react"
import { Routes, Route, useNavigate, useSearchParams } from "react-router-dom"
import { SearchBar } from "./components/SearchBar"
import { MovieCard } from "./components/MovieCard"
import { LoadingSpinner } from "./components/LoadingSpinner"
import { MovieDetailsModal } from "./components/MovieDetailsModal"
import { ContentTypeSelector } from "./components/ContentTypeSelector"
import { movieApi } from "./services/movieApi"

function App() {
  const [content, setContent] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [contentType, setContentType] = useState("all") // 'all', 'movie', 'tv'
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // Listen for URL parameter changes (including browser back/forward)
  useEffect(() => {
    const urlQuery = searchParams.get("q") || ""
    const urlType = searchParams.get("type") || "all"

    // Update local state to match URL
    setSearchQuery(urlQuery)
    setContentType(urlType)

    if (urlQuery) {
      setHasSearched(true)
      performSearch(urlQuery, urlType)
    } else {
      setHasSearched(false)
      loadTrendingContent(urlType)
    }
  }, [searchParams]) // Re-run whenever URL search params change

  const loadTrendingContent = async (type = contentType) => {
    setIsLoading(true)
    setError(null)
    try {
      let data
      if (type === "movie") {
        data = await movieApi.getPopularMovies()
        // Add media_type to movie results
        data.results = data.results.map((item) => ({ ...item, media_type: "movie" }))
      } else if (type === "tv") {
        data = await movieApi.getPopularTVShows()
        // Add media_type to TV results
        data.results = data.results.map((item) => ({ ...item, media_type: "tv" }))
      } else {
        data = await movieApi.getTrending()
      }
      setContent(data.results || [])
    } catch (err) {
      setError("Failed to load content. Please try again.",err)
    } finally {
      setIsLoading(false)
    }
  }

  const performSearch = async (query, type = contentType) => {
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      let data
      if (type === "movie") {
        data = await movieApi.searchMovies(query)
        // Add media_type to movie results
        data.results = data.results.map((item) => ({ ...item, media_type: "movie" }))
      } else if (type === "tv") {
        data = await movieApi.searchTVShows(query)
        // Add media_type to TV results
        data.results = data.results.map((item) => ({ ...item, media_type: "tv" }))
      } else {
        data = await movieApi.searchMulti(query)
      }
      setContent(data.results || [])
    } catch (err) {
      setError("Failed to search content. Please try again.",err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    // Update URL with search parameters
    const params = new URLSearchParams()
    params.set("q", searchQuery)
    if (contentType !== "all") {
      params.set("type", contentType)
    }
    setSearchParams(params)
    // The useEffect will handle the actual search when searchParams changes
  }

  const handleContentTypeChange = (newType) => {
    const params = new URLSearchParams(searchParams)

    if (newType !== "all") {
      params.set("type", newType)
    } else {
      params.delete("type")
    }

    setSearchParams(params)
    // The useEffect will handle loading content when searchParams changes
  }

  const handleContentClick = (item) => {
    const mediaType = item.media_type || (item.title ? "movie" : "tv")
    navigate(`/${mediaType}/${item.id}`)
  }

  const handleShowTrending = () => {
    // Clear all search parameters to go back to trending
    setSearchParams({})
    // The useEffect will handle loading trending content
  }

  const getTitle = () => {
    if (!hasSearched) {
      if (contentType === "movie") return "Popular Movies"
      if (contentType === "tv") return "Popular TV Shows"
      return "Trending Now"
    }
    if (searchQuery) {
      if (contentType === "movie") return `Movie Results for "${searchQuery}"`
      if (contentType === "tv") return `TV Show Results for "${searchQuery}"`
      return `Results for "${searchQuery}"`
    }
    return "Content"
  }

  const getSubtitle = () => {
    if (!hasSearched) {
      if (contentType === "movie") return "Discover the most popular movies right now"
      if (contentType === "tv") return "Discover the most popular TV shows and series"
      return "Discover the hottest movies and TV shows everyone's talking about"
    }
    if (content.length === 0 && !isLoading) return "No content found. Try a different search term."
    const itemType = contentType === "movie" ? "movie" : contentType === "tv" ? "TV show" : "item"
    return `${content.length} ${itemType}${content.length !== 1 ? "s" : ""} found`
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-red-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />

        {/* Header */}
        <header className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="max-w-7xl mx-auto">
            {/* Logo */}
            <div className="flex items-center justify-center mb-8 sm:mb-10 lg:mb-12">
              <div className="relative">
                <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur opacity-75" />
                <div className="relative bg-black p-2 sm:p-3 lg:p-4 rounded-full border border-purple-500/30">
                  <Zap className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-400" />
                </div>
              </div>
              <h1 className="ml-3 sm:ml-4 text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                CINEMAX
              </h1>
            </div>

            {/* Hero Text */}
            <div className="text-center mb-8 sm:mb-10 lg:mb-12">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  DISCOVER
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ENTERTAINMENT
                </span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-xl lg:max-w-2xl mx-auto leading-relaxed px-4">
                Explore the world of movies, TV shows, and web series with our cutting-edge discovery platform
              </p>
            </div>

            {/* Content Type Selector */}
            <div className="mb-6 sm:mb-8 lg:mb-10">
              <ContentTypeSelector contentType={contentType} setContentType={handleContentTypeChange} />
            </div>

            {/* Search Bar */}
            <div className="flex justify-center mb-8 sm:mb-12 lg:mb-16">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
                isLoading={isLoading}
              />
            </div>
          </div>
        </header>
      </div>

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex-shrink-0">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold text-white truncate">{getTitle()}</h3>
                <p className="text-sm sm:text-base text-gray-400 line-clamp-2 sm:line-clamp-1">{getSubtitle()}</p>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 text-center backdrop-blur-sm">
              <p className="text-red-300 font-medium text-base sm:text-lg mb-4">{error}</p>
              <button
                onClick={hasSearched ? handleSearch : () => loadTrendingContent()}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-semibold text-sm sm:text-base"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && <LoadingSpinner />}

          {/* Content Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
              {content.map((item) => (
                <MovieCard
                  key={`${item.media_type || "unknown"}-${item.id}`}
                  item={item}
                  onClick={() => handleContentClick(item)}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && content.length === 0 && hasSearched && (
            <div className="text-center py-12 sm:py-16 lg:py-20 px-4">
              <div className="relative mb-6 sm:mb-8">
                <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl" />
                <div className="relative bg-gray-800 rounded-full w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center mx-auto border border-gray-700">
                  <Search className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">No Content Found</h3>
              <p className="text-gray-400 text-base sm:text-lg mb-6 sm:mb-8 max-w-sm sm:max-w-md mx-auto leading-relaxed">
                {
                  "We couldn't find any content matching your search. Try different keywords or explore trending content."
                }
              </p>
              <button
                onClick={handleShowTrending}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold text-base sm:text-lg"
              >
                Show Trending Content
              </button>
            </div>
          )}

          {/* Content Details Modal - Now rendered via Route */}
          <Routes>
            <Route path="/movie/:contentId" element={<MovieDetailsModal mediaType="movie" />} />
            <Route path="/tv/:contentId" element={<MovieDetailsModal mediaType="tv" />} />
            <Route path="/" element={null} />
          </Routes>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse delay-75" />
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-150" />
          </div>
          <p className="text-gray-400 text-sm sm:text-base">
            Created by{" "}
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              Harsh Dhokiya
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
