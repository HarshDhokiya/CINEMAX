"use client"

import { useState, useEffect } from "react"
import { Search, TrendingUp, Zap } from "lucide-react"
import { SearchBar } from "./components/SearchBar"
import { MovieCard } from "./components/MovieCard"
import { LoadingSpinner } from "./components/LoadingSpinner"
import { MovieDetailsModal } from "./components/MovieDetailsModal"
import { movieApi } from "./services/movieApi"

function App() {
  const [movies, setMovies] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [, setIsLoadingDetails] = useState(false)

  // Load popular movies on mount
  useEffect(() => {
    loadPopularMovies()
  }, [])

  const loadPopularMovies = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await movieApi.getPopularMovies()
      setMovies(data.results || [])
    } catch (error) {
      setError("Failed to load popular movies. Please try again.",error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const data = await movieApi.searchMovies(searchQuery)
      setMovies(data.results || [])
    } catch (error) {
      setError("Failed to search movies. Please try again.",error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMovieClick = async (movie) => {
    setIsLoadingDetails(true)
    setIsModalOpen(true)

    try {
      const detailedMovie = await movieApi.getMovieDetails(movie.id)
      setSelectedMovie(detailedMovie)
    } catch (error) {
      console.error("Failed to load movie details:",error)
      setSelectedMovie(movie)
    } finally {
      setIsLoadingDetails(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedMovie(null)
  }

  const getTitle = () => {
    if (!hasSearched) return "Trending Now"
    if (searchQuery) return `Results for "${searchQuery}"`
    return "Movies"
  }

  const getSubtitle = () => {
    if (!hasSearched) return "Discover the hottest movies everyone's talking about"
    if (movies.length === 0 && !isLoading) return "No movies found. Try a different search term."
    return `${movies.length} movie${movies.length !== 1 ? "s" : ""} found`
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
                  MOVIES
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Explore the world of cinema with our cutting-edge movie discovery platform
              </p>
            </div>

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
                onClick={hasSearched ? handleSearch : loadPopularMovies}
                className="mt-6 bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-semibold"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && <LoadingSpinner />}

          {/* Movies Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onClick={() => handleMovieClick(movie)} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && movies.length === 0 && hasSearched && (
            <div className="text-center py-20">
              <div className="relative mb-8">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20  to-pink-500/20 rounded-full blur-xl" />
                <div className="relative bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto border border-gray-700">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">No Movies Found</h3>
              <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                {"We couldn't find any movies matching your search. Try different keywords or explore trending movies."}
              </p>
              <button
                onClick={loadPopularMovies}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold text-lg"
              >
                Show Trending Movies
              </button>
            </div>
          )}

          {/* Movie Details Modal */}
          <MovieDetailsModal movie={selectedMovie} isOpen={isModalOpen} onClose={handleCloseModal} />
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
              href="https://github.com/HarshDhokiya"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              Harsh❤️
            </a>
          </p>
        </div>
  
      </footer>
    </div>
  )
}

export default App
