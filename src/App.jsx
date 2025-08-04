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
      setError("Failed to load content. Please try again.")
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
      setError("Failed to search content. Please try again.")
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
        <header className="relative z-10 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Logo */}
            <div className="flex items-center justify-center mb-12">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur opacity-75" />
                <div className="relative bg-black p-4 rounded-full border border-purple-500/30">
                  <Zap className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              <h1 className="ml-4 text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                CINEMAX
              </h1>
            </div>

            {/* Hero Text */}
            <div className="text-center mb-12">
              <h2 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  DISCOVER
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ENTERTAINMENT
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Explore the world of movies, TV shows, and web series with our cutting-edge discovery platform
              </p>
            </div>

            {/* Content Type Selector */}
            <ContentTypeSelector contentType={contentType} setContentType={handleContentTypeChange} />

            {/* Search Bar */}
            <div className="flex justify-center mb-16">
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
      <main className="relative z-10 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{getTitle()}</h3>
                <p className="text-gray-400">{getSubtitle()}</p>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8 mb-8 text-center backdrop-blur-sm">
              <p className="text-red-300 font-medium text-lg">{error}</p>
              <button
                onClick={hasSearched ? handleSearch : () => loadTrendingContent()}
                className="mt-6 bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-semibold"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && <LoadingSpinner />}

          {/* Content Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
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
            <div className="text-center py-20">
              <div className="relative mb-8">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl" />
                <div className="relative bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto border border-gray-700">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">No Content Found</h3>
              <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                {
                  "We couldn't find any content matching your search. Try different keywords or explore trending content."
                }
              </p>
              <button
                onClick={handleShowTrending}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold text-lg"
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
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse delay-75" />
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-150" />
          </div>
          <p className="text-gray-400">
            Powered by{" "}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              The Movie Database
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
