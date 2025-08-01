"use client"

import { X, Star, Calendar, Clock, Globe, Play, Users, DollarSign } from "lucide-react"
import { movieApi } from "../services/movieApi"

export function MovieDetailsModal({ movie, isOpen, onClose }) {
    if (!isOpen || !movie) return null

    const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"
    const runtime = movie.runtime ? `${movie.runtime} min` : "N/A"
    const budget = movie.budget ? `$${movie.budget.toLocaleString()}` : "N/A"
    const revenue = movie.revenue ? `$${movie.revenue.toLocaleString()}` : "N/A"

    const director = movie.credits?.crew?.find((person) => person.job === "Director")?.name || "N/A"
    const mainCast = movie.credits?.cast?.slice(0, 6) || []
    const trailer = movie.videos?.results?.find((video) => video.type === "Trailer" && video.site === "YouTube")

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-gray-900 border border-gray-700 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header with backdrop */}
                <div className="relative">
                    {movie.backdrop_path && (
                        <div className="relative h-64 md:h-96">
                            <img
                                src={movieApi.getImageUrl(movie.backdrop_path) || "/placeholder.svg"}
                                alt={movie.title}
                                className="w-full h-full object-cover rounded-t-3xl"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent rounded-t-3xl" />
                        </div>
                    )}

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors backdrop-blur-sm border border-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>

         
                    {trailer && (
                        <a
                            href={`https://www.youtube.com/watch?v=${trailer.key}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="absolute bottom-6 left-6 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-full flex items-center gap-3 transition-all duration-300 font-semibold"
                        >
                            <Play className="w-5 h-5" />
                            Watch Trailer
                        </a>
                    )}
                </div>

                <div className="p-8">
                    {/* Movie info header */}
                    <div className="flex flex-col lg:flex-row gap-8 mb-8">
                        {/* Poster */}
                        <div className="flex-shrink-0">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-25" />
                                <img
                                    src={movieApi.getImageUrl(movie.poster_path) || "/placeholder.svg"}
                                    alt={movie.title}
                                    className="relative w-64 h-96 object-cover rounded-2xl shadow-2xl mx-auto lg:mx-0 border border-gray-700"
                                />
                            </div>
                        </div>

                        {/* Movie details */}
                        <div className="flex-1">
                            <h1 className="text-4xl font-black text-white mb-4 leading-tight">{movie.title}</h1>

                            {movie.tagline && <p className="text-xl text-purple-300 italic mb-6 font-medium">"{movie.tagline}"</p>}

                            {/* Rating and basic info */}
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-2 rounded-full border border-yellow-500/30">
                                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                    <span className="font-bold text-white">{rating}</span>
                                    <span className="text-gray-300">({movie.vote_count} votes)</span>
                                </div>

                                <div className="flex items-center gap-2 text-gray-300 bg-gray-800/50 px-4 py-2 rounded-full">
                                    <Calendar className="w-5 h-5 text-purple-400" />
                                    <span>{releaseYear}</span>
                                </div>

                                <div className="flex items-center gap-2 text-gray-300 bg-gray-800/50 px-4 py-2 rounded-full">
                                    <Clock className="w-5 h-5 text-pink-400" />
                                    <span>{runtime}</span>
                                </div>
                            </div>

                            {/* Genres */}
                            {movie.genres && movie.genres.length > 0 && (
                                <div className="mb-6">
                                    <div className="flex flex-wrap gap-3">
                                        {movie.genres.map((genre) => (
                                            <span
                                                key={genre.id}
                                                className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-semibold border border-purple-500/30"
                                            >
                                                {genre.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Overview */}
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                                    Overview
                                </h3>
                                <p className="text-gray-300 leading-relaxed text-lg">{movie.overview || "No overview available."}</p>
                            </div>

                            {/* Director */}
                            <div className="mb-6">
                                <h4 className="font-bold text-white text-lg mb-2 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-purple-400" />
                                    Director
                                </h4>
                                <p className="text-gray-300 text-lg">{director}</p>
                            </div>
                        </div>
                    </div>

                    {/* Cast */}
                    {mainCast.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                                Main Cast
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                                {mainCast.map((actor) => (
                                    <div key={actor.id} className="text-center group">
                                        <div className="relative mb-3">
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-50 transition duration-300 blur" />
                                            <img
                                                src={movieApi.getImageUrl(actor.profile_path) || "/placeholder.svg?height=120&width=90"}
                                                alt={actor.name}
                                                className="relative w-20 h-24 object-cover rounded-xl mx-auto border border-gray-700"
                                            />
                                        </div>
                                        <p className="font-semibold text-white text-sm mb-1">{actor.name}</p>
                                        <p className="text-xs text-gray-400">{actor.character}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Additional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-700">
                        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
                            <h4 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-green-400" />
                                Production Details
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Budget:</span>
                                    <span className="font-semibold text-white">{budget}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Revenue:</span>
                                    <span className="font-semibold text-white">{revenue}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Status:</span>
                                    <span className="font-semibold text-white">{movie.status || "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
                            <h4 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-blue-400" />
                                Languages
                            </h4>
                            <div className="space-y-3">
                                {movie.spoken_languages && movie.spoken_languages.length > 0 ? (
                                    movie.spoken_languages.slice(0, 3).map((lang, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                                            <span className="text-gray-300">{lang.english_name}</span>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-gray-400">N/A</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
