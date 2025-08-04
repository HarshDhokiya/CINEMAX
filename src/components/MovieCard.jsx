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
      className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 cursor-pointer hover:scale-105"
      onClick={handleClick}
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 transition duration-500 blur" />

      <div className="relative">
        {/* Poster */}
        <div className="relative overflow-hidden">
          <img
            src={movieApi.getImageUrl(item.poster_path) || "/placeholder.svg"}
            alt={title}
            className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/30">
              <Play className="w-8 h-8 text-white fill-current" />
            </div>
          </div>

          {/* Rating badge */}
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-yellow-500/30">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-white text-sm font-bold">{rating}</span>
          </div>

          {/* Media type badge */}
          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-purple-500/30">
            {isMovie ? <Film className="w-4 h-4 text-purple-400" /> : <Tv className="w-4 h-4 text-pink-400" />}
            <span className="text-white text-xs font-bold uppercase">{isMovie ? "Movie" : "TV"}</span>
          </div>
        </div>

        {/* Content Info */}
        <div className="p-6">
          <h3 className="font-bold text-xl text-white mb-3 line-clamp-2 leading-tight group-hover:text-purple-300 transition-colors">
            {title}
          </h3>

          <div className="flex items-center gap-2 text-gray-400 mb-4">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">{releaseYear}</span>
          </div>

          <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed mb-4">
            {item.overview || "No description available."}
          </p>

          {/* View Details */}
          <div className="flex items-center justify-between">
            <span className="text-purple-400 text-sm font-semibold group-hover:text-pink-400 transition-colors">
              View Details
            </span>
            <div className="w-6 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </div>
  )
}
