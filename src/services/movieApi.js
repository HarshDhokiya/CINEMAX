const API_KEY = "a07e22bc18f5cb106bfe4cc1f83ad8ed" // Demo key - replace with your own
const BASE_URL = "https://api.themoviedb.org/3"
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

export const movieApi = {
  searchMovies: async (query) => {
    if (!query.trim()) return { results: [] }

    try {
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=1`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch movies")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error searching movies:", error)
      throw error
    }
  },

  getPopularMovies: async () => {
    try {
      const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=1`)

      if (!response.ok) {
        throw new Error("Failed to fetch popular movies")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching popular movies:", error)
      throw error
    }
  },

  getMovieDetails: async (movieId) => {
    try {
      const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos`)

      if (!response.ok) {
        throw new Error("Failed to fetch movie details")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching movie details:", error)
      throw error
    }
  },

  getMovieImages: async (movieId) => {
    try {
      const response = await fetch(`${BASE_URL}/movie/${movieId}/images?api_key=${API_KEY}`)

      if (!response.ok) {
        throw new Error("Failed to fetch movie images")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching movie images:", error)
      throw error
    }
  },

  getWatchProviders: async (movieId) => {
    try {
      const response = await fetch(`${BASE_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}`)

      if (!response.ok) {
        throw new Error("Failed to fetch watch providers")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching watch providers:", error)
      throw error
    }
  },

  getImageUrl: (path, size = "w500") => {
    const IMAGE_BASE_URL = `https://image.tmdb.org/t/p/${size}`
    return path ? `${IMAGE_BASE_URL}${path}` : "/placeholder.svg?height=400&width=300"
  },
}
