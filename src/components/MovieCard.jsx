"use client"

import { Star, Play, Calendar, Tv, Film } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { movieApi } from "../services/movieApi"

export function MovieCard({ item }) {
  const navigate = useNavigate()

  // Handle both movies and TV shows
  const isMovie = item.media_type === "movie" || (!item.media_type && item.title)
  const title = isMovie ? item.title : item.name
  const releaseDate = isMovie ? item.release_date : item.first_air_date
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : "N/A"
  const rating = item.vote_average ? item.vote_average.toFixed(1) : "N/A"
  const mediaType = item.media_type || (isMovie ? "movie" : "tv")

  const handleClick = () => {
    navigate(`/${mediaType}/${item.id}`)
  }

  return (
    <div
      className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 cursor-pointer hover:scale-105"
      onClick={handleClick}
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg sm:rounded-xl lg:rounded-2xl opacity-0 group-hover:opacity-20 transition duration-500 blur" />

      <div className="relative">
        {/* Poster */}
        <div className="relative overflow-hidden">
          <img
            src={movieApi.getImageUrl(item.poster_path) || "/placeholder.svg"}
            alt={title}
            className="w-full h-60 sm:h-72 md:h-80 lg:h-96 object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-3 lg:p-4 border border-white/30">
              <Play className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white fill-current" />
            </div>
          </div>

          {/* Rating badge */}
          <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 bg-black/70 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 sm:py-1.5 flex items-center gap-1 sm:gap-1.5 border border-yellow-500/30">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
            <span className="text-white text-xs sm:text-sm font-bold">{rating}</span>
          </div>

          {/* Media type badge */}
          <div className="absolute top-2 sm:top-3 lg:top-4 left-2 sm:left-3 lg:left-4 bg-black/70 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 sm:py-1.5 flex items-center gap-1 sm:gap-1.5 border border-purple-500/30">
            {isMovie ? (
              <Film className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
            ) : (
              <Tv className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400" />
            )}
            <span className="text-white text-xs font-bold uppercase hidden sm:inline">{isMovie ? "Movie" : "TV"}</span>
          </div>
        </div>

        {/* Content Info */}
        <div className="p-3 sm:p-4 lg:p-6">
          <h3 className="font-bold text-sm sm:text-base lg:text-xl text-white mb-2 sm:mb-3 line-clamp-2 leading-tight group-hover:text-purple-300 transition-colors">
            {title}
          </h3>

          <div className="flex items-center gap-1 sm:gap-2 text-gray-400 mb-2 sm:mb-3 lg:mb-4">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium">{releaseYear}</span>
          </div>

          <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 leading-relaxed mb-2 sm:mb-3 lg:mb-4 hidden sm:block">
            {item.overview || "No description available."}
          </p>

          {/* View Details */}
          <div className="flex items-center justify-between">
            <span className="text-purple-400 text-xs sm:text-sm font-semibold group-hover:text-pink-400 transition-colors">
              View Details
            </span>
            <div className="w-4 sm:w-6 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </div>
  )
}
