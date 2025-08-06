"use client"

import {
  X,
  Star,
  Calendar,
  Clock,
  Globe,
  Play,
  Users,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Tv,
  Film,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { movieApi } from "../services/movieApi"
import { MovieImageGallery } from "./MovieImageGallery"
import { WhereToWatch } from "./WhereToWatch"

export function MovieDetailsModal({ mediaType }) {
  const { contentId } = useParams()
  const navigate = useNavigate()
  const [content, setContent] = useState(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(true)
  const [showAllLanguages, setShowAllLanguages] = useState(false)

  useEffect(() => {
    const fetchDetails = async () => {
      if (!contentId || !mediaType) {
        setContent(null)
        setIsLoadingDetails(false)
        return
      }

      setIsLoadingDetails(true)
      try {
        const [detailedContent, contentImages, watchProviders] = await Promise.all([
          movieApi.getDetails(contentId, mediaType),
          movieApi.getImages(contentId, mediaType),
          movieApi.getWatchProviders(contentId, mediaType),
        ])

        const contentWithExtras = {
          ...detailedContent,
          images: contentImages,
          watchProviders: watchProviders,
          media_type: mediaType,
        }
        setContent(contentWithExtras)
      } catch (err) {
        console.error("Failed to load content details:", err)
        setContent(null)
      } finally {
        setIsLoadingDetails(false)
      }
    }

    fetchDetails()
  }, [contentId, mediaType])

  if (!content || isLoadingDetails) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="text-white text-lg sm:text-xl">Loading details...</div>
      </div>
    )
  }

  const isMovie = mediaType === "movie"
  const title = isMovie ? content.title : content.name
  const releaseDate = isMovie ? content.release_date : content.first_air_date
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : "N/A"
  const rating = content.vote_average ? content.vote_average.toFixed(1) : "N/A"
  const runtime = isMovie
    ? content.runtime
      ? `${content.runtime} min`
      : "N/A"
    : content.number_of_seasons
      ? `${content.number_of_seasons} Season${content.number_of_seasons !== 1 ? "s" : ""}`
      : "N/A"

  const budget = isMovie ? (content.budget ? `$${content.budget.toLocaleString()}` : "N/A") : "N/A"
  const revenue = isMovie ? (content.revenue ? `$${content.revenue.toLocaleString()}` : "N/A") : "N/A"

  // For movies, get director; for TV shows, get creator
  const creator = isMovie
    ? content.credits?.crew?.find((person) => person.job === "Director")?.name || "N/A"
    : content.created_by?.map((creator) => creator.name).join(", ") || "N/A"

  const mainCast = content.credits?.cast?.slice(0, 6) || []
  const trailer = content.videos?.results?.find((video) => video.type === "Trailer" && video.site === "YouTube")

  // Handle languages display
  const allLanguages = content.spoken_languages || []
  const displayedLanguages = showAllLanguages ? allLanguages : allLanguages.slice(0, 3)

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      navigate(-1)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-2xl sm:rounded-3xl max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header with backdrop */}
        <div className="relative">
          {content.backdrop_path && (
            <div className="relative h-48 sm:h-64 md:h-80 lg:h-96">
              <img
                src={movieApi.getImageUrl(content.backdrop_path) || "/placeholder.svg"}
                alt={title}
                className="w-full h-full object-cover rounded-t-2xl sm:rounded-t-3xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent rounded-t-2xl sm:rounded-t-3xl" />
            </div>
          )}

          {/* Close button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-3 sm:top-4 lg:top-6 right-3 sm:right-4 lg:right-6 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-colors backdrop-blur-sm border border-gray-600"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Media type badge */}
          <div className="absolute top-3 sm:top-4 lg:top-6 left-3 sm:left-4 lg:left-6 bg-black/70 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 border border-purple-500/30">
            {isMovie ? (
              <Film className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            ) : (
              <Tv className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
            )}
            <span className="text-white text-xs sm:text-sm font-bold uppercase">{isMovie ? "Movie" : "TV Series"}</span>
          </div>

          {/* Play trailer button */}
          {trailer && (
            <a
              href={`https://www.youtube.com/watch?v=${trailer.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 sm:bottom-4 lg:bottom-6 left-3 sm:left-4 lg:left-6 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full flex items-center gap-2 sm:gap-3 transition-all duration-300 font-semibold text-sm sm:text-base"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Watch Trailer</span>
              <span className="sm:hidden">Trailer</span>
            </a>
          )}
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Content info header */}
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Poster */}
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <div className="relative group">
                <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl blur opacity-25" />
                <img
                  src={movieApi.getImageUrl(content.poster_path) || "/placeholder.svg"}
                  alt={title}
                  className="relative w-48 sm:w-56 lg:w-64 h-72 sm:h-84 lg:h-96 object-cover rounded-xl sm:rounded-2xl shadow-2xl border border-gray-700"
                />
              </div>
            </div>

            {/* Content details */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3 sm:mb-4 leading-tight">
                {title}
              </h1>

              {content.tagline && (
                <p className="text-lg sm:text-xl text-purple-300 italic mb-4 sm:mb-6 font-medium">
                  "{content.tagline}"
                </p>
              )}

              {/* Rating and basic info */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-yellow-500/30">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                  <span className="font-bold text-white text-sm sm:text-base">{rating}</span>
                  <span className="text-gray-300 text-xs sm:text-sm">({content.vote_count} votes)</span>
                </div>

                <div className="flex items-center gap-2 text-gray-300 bg-gray-800/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  <span className="text-sm sm:text-base">{releaseYear}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-300 bg-gray-800/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
                  <span className="text-sm sm:text-base">{runtime}</span>
                </div>
              </div>

              {/* Additional TV show info */}
              {!isMovie && (
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                  {content.number_of_episodes && (
                    <div className="text-gray-300 bg-gray-800/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base">
                      <span className="font-semibold">{content.number_of_episodes}</span> Episodes
                    </div>
                  )}
                  {content.status && (
                    <div className="text-gray-300 bg-gray-800/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base">
                      Status: <span className="font-semibold">{content.status}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Genres */}
              {content.genres && content.genres.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {content.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border border-purple-500/30"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Overview */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <div className="w-1 h-5 sm:h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                  Overview
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base lg:text-lg">
                  {content.overview || "No overview available."}
                </p>
              </div>

              {/* Creator/Director */}
              <div className="mb-4 sm:mb-6">
                <h4 className="font-bold text-white text-base sm:text-lg mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                  {isMovie ? "Director" : "Created by"}
                </h4>
                <p className="text-gray-300 text-sm sm:text-base lg:text-lg">{creator}</p>
              </div>
            </div>
          </div>

          {/* Cast */}
          {mainCast.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                <div className="w-1 h-5 sm:h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                Main Cast
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
                {mainCast.map((actor) => (
                  <div key={actor.id} className="text-center group">
                    <div className="relative mb-2 sm:mb-3">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-50 transition duration-300 blur" />
                      <img
                        src={movieApi.getImageUrl(actor.profile_path) || "/placeholder.svg?height=120&width=90"}
                        alt={actor.name}
                        className="relative w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-lg sm:rounded-xl mx-auto border border-gray-700"
                      />
                    </div>
                    <p className="font-semibold text-white text-xs sm:text-sm mb-1 line-clamp-2">{actor.name}</p>
                    <p className="text-xs text-gray-400 line-clamp-2">{actor.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Where to Watch Section */}
          {content.watchProviders && <WhereToWatch watchProviders={content.watchProviders} movieTitle={title} />}

          {/* Content Images Gallery */}
          {content.images && (content.images.backdrops?.length > 0 || content.images.posters?.length > 0) && (
            <MovieImageGallery
              images={[...(content.images.backdrops || []), ...(content.images.posters || [])]}
              movieTitle={title}
            />
          )}

          {/* Additional Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 pt-6 sm:pt-8 border-t border-gray-700">
            {isMovie ? (
              <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-700">
                <h4 className="font-bold text-white text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                  Production Details
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm sm:text-base">Budget:</span>
                    <span className="font-semibold text-white text-sm sm:text-base">{budget}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm sm:text-base">Revenue:</span>
                    <span className="font-semibold text-white text-sm sm:text-base">{revenue}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm sm:text-base">Status:</span>
                    <span className="font-semibold text-white text-sm sm:text-base">{content.status || "N/A"}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-700">
                <h4 className="font-bold text-white text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                  <Tv className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
                  Series Details
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm sm:text-base">Seasons:</span>
                    <span className="font-semibold text-white text-sm sm:text-base">
                      {content.number_of_seasons || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm sm:text-base">Episodes:</span>
                    <span className="font-semibold text-white text-sm sm:text-base">
                      {content.number_of_episodes || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm sm:text-base">Status:</span>
                    <span className="font-semibold text-white text-sm sm:text-base">{content.status || "N/A"}</span>
                  </div>
                  {content.last_air_date && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm sm:text-base">Last Aired:</span>
                      <span className="font-semibold text-white text-sm sm:text-base">
                        {new Date(content.last_air_date).getFullYear()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-700">
              <h4 className="font-bold text-white text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                Languages
              </h4>
              <div className="space-y-2 sm:space-y-3">
                {allLanguages.length > 0 ? (
                  <>
                    {displayedLanguages.map((lang, index) => (
                      <div key={index} className="flex items-center gap-2 sm:gap-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex-shrink-0" />
                        <span className="text-gray-300 text-sm sm:text-base">{lang.english_name}</span>
                        {lang.name !== lang.english_name && (
                          <span className="text-gray-500 text-xs sm:text-sm">({lang.name})</span>
                        )}
                      </div>
                    ))}

                    {/* Show More/Less button */}
                    {allLanguages.length > 3 && (
                      <button
                        onClick={() => setShowAllLanguages(!showAllLanguages)}
                        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-xs sm:text-sm font-medium mt-2 sm:mt-3"
                      >
                        {showAllLanguages ? (
                          <>
                            <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                            Show All ({allLanguages.length} languages)
                          </>
                        )}
                      </button>
                    )}
                  </>
                ) : (
                  <span className="text-gray-400 text-sm sm:text-base">N/A</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
