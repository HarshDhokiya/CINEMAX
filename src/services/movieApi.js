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

  searchTVShows: async (query) => {
    if (!query.trim()) return { results: [] }

    try {
      const response = await fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=1`)

      if (!response.ok) {
        throw new Error("Failed to fetch TV shows")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error searching TV shows:", error)
      throw error
    }
  },

  searchMulti: async (query) => {
    if (!query.trim()) return { results: [] }

    try {
      const response = await fetch(
        `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=1`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch content")
      }

      const data = await response.json()
      // Filter out person results, keep only movies and TV shows
      const filteredResults = data.results.filter((item) => item.media_type === "movie" || item.media_type === "tv")
      return { ...data, results: filteredResults }
    } catch (error) {
      console.error("Error searching multi:", error)
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

  getPopularTVShows: async () => {
    try {
      const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&page=1`)

      if (!response.ok) {
        throw new Error("Failed to fetch popular TV shows")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching popular TV shows:", error)
      throw error
    }
  },

  getTrending: async () => {
    try {
      const response = await fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}&page=1`)

      if (!response.ok) {
        throw new Error("Failed to fetch trending content")
      }

      const data = await response.json()
      // Filter out person results
      const filteredResults = data.results.filter((item) => item.media_type === "movie" || item.media_type === "tv")
      return { ...data, results: filteredResults }
    } catch (error) {
      console.error("Error fetching trending content:", error)
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
      return { ...data, media_type: "movie" }
    } catch (error) {
      console.error("Error fetching movie details:", error)
      throw error
    }
  },

  getTVShowDetails: async (tvId) => {
    try {
      const response = await fetch(`${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&append_to_response=credits,videos`)

      if (!response.ok) {
        throw new Error("Failed to fetch TV show details")
      }

      const data = await response.json()
      return { ...data, media_type: "tv" }
    } catch (error) {
      console.error("Error fetching TV show details:", error)
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

  getTVShowImages: async (tvId) => {
    try {
      const response = await fetch(`${BASE_URL}/tv/${tvId}/images?api_key=${API_KEY}`)

      if (!response.ok) {
        throw new Error("Failed to fetch TV show images")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching TV show images:", error)
      throw error
    }
  },

  getMovieWatchProviders: async (movieId) => {
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

  getTVShowWatchProviders: async (tvId) => {
    try {
      const response = await fetch(`${BASE_URL}/tv/${tvId}/watch/providers?api_key=${API_KEY}`)

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

  // Helper function to get details based on media type
  getDetails: async (id, mediaType) => {
    return mediaType === "movie" ? movieApi.getMovieDetails(id) : movieApi.getTVShowDetails(id)
  },

  // Helper function to get images based on media type
  getImages: async (id, mediaType) => {
    return mediaType === "movie" ? movieApi.getMovieImages(id) : movieApi.getTVShowImages(id)
  },

  // Helper function to get watch providers based on media type
  getWatchProviders: async (id, mediaType) => {
    return mediaType === "movie" ? movieApi.getMovieWatchProviders(id) : movieApi.getTVShowWatchProviders(id)
  },
}
