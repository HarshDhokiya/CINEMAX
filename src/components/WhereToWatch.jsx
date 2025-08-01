"use client"

import { Tv, ShoppingCart, Download, ExternalLink } from "lucide-react"
import { movieApi } from "../services/movieApi"

export function WhereToWatch({ watchProviders, movieTitle }) {
  if (!watchProviders || !watchProviders.results) {
    return null
  }

  // Get US providers (you can change this to your preferred region)
  const usProviders = watchProviders.results.US
  const tmdbLink = watchProviders.results.US?.link // This is the link to the TMDB page with all providers

  if (!usProviders) {
    return (
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
          <Tv className="w-6 h-6 text-purple-400" />
          Where to Watch
        </h3>
        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 text-center">
          <p className="text-gray-400">Streaming information not available for this movie.</p>
        </div>
      </div>
    )
  }

  const streamingProviders = usProviders.flatrate || []
  const rentProviders = usProviders.rent || []
  const buyProviders = usProviders.buy || []

  // Function to handle provider click - now always opens the TMDB link
  const handleProviderClick = () => {
    if (tmdbLink) {
      window.open(tmdbLink, "_blank", "noopener,noreferrer")
    } else {
      alert("No direct link available for this movie on TMDB.")
    }
  }

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
        <Tv className="w-6 h-6 text-purple-400" />
        Where to Watch
      </h3>

      <div className="space-y-6">
        {/* Streaming Services */}
        {streamingProviders.length > 0 && (
          <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Tv className="w-5 h-5 text-green-400" />
              <h4 className="font-bold text-white text-lg">Stream</h4>
              <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs font-medium border border-green-500/30">
                Subscription Required
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {streamingProviders.map((provider) => (
                <button
                  key={provider.provider_id}
                  onClick={handleProviderClick} // Now always opens the TMDB link
                  className="group relative bg-gray-700/50 p-4 rounded-xl border border-gray-600 hover:border-green-500/50 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  title={`View streaming options for "${movieTitle}" on TMDB`}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-20 transition duration-300 blur" />
                  <div className="relative text-center">
                    <img
                      src={movieApi.getImageUrl(provider.logo_path, "w92") || "/placeholder.svg"}
                      alt={provider.provider_name}
                      className="w-12 h-12 mx-auto mb-2 rounded-lg"
                    />
                    <p className="text-white text-sm font-medium">{provider.provider_name}</p>
                    <p className="text-green-400 text-xs mt-1">View options</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Rent Options */}
        {rentProviders.length > 0 && (
          <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Download className="w-5 h-5 text-blue-400" />
              <h4 className="font-bold text-white text-lg">Rent</h4>
              <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs font-medium border border-blue-500/30">
                From $3.99
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {rentProviders.map((provider) => (
                <button
                  key={provider.provider_id}
                  onClick={handleProviderClick} // Now always opens the TMDB link
                  className="group relative bg-gray-700/50 p-4 rounded-xl border border-gray-600 hover:border-blue-500/50 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  title={`View rental options for "${movieTitle}" on TMDB`}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-20 transition duration-300 blur" />
                  <div className="relative text-center">
                    <img
                      src={movieApi.getImageUrl(provider.logo_path, "w92") || "/placeholder.svg"}
                      alt={provider.provider_name}
                      className="w-12 h-12 mx-auto mb-2 rounded-lg"
                    />
                    <p className="text-white text-sm font-medium">{provider.provider_name}</p>
                    <p className="text-blue-400 text-xs mt-1">View options</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Buy Options */}
        {buyProviders.length > 0 && (
          <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="w-5 h-5 text-purple-400" />
              <h4 className="font-bold text-white text-lg">Buy</h4>
              <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs font-medium border border-purple-500/30">
                From $9.99
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {buyProviders.map((provider) => (
                <button
                  key={provider.provider_id}
                  onClick={handleProviderClick} // Now always opens the TMDB link
                  className="group relative bg-gray-700/50 p-4 rounded-xl border border-gray-600 hover:border-purple-500/50 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  title={`View purchase options for "${movieTitle}" on TMDB`}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-20 transition duration-300 blur" />
                  <div className="relative text-center">
                    <img
                      src={movieApi.getImageUrl(provider.logo_path, "w92") || "/placeholder.svg"}
                      alt={provider.provider_name}
                      className="w-12 h-12 mx-auto mb-2 rounded-lg"
                    />
                    <p className="text-white text-sm font-medium">{provider.provider_name}</p>
                    <p className="text-purple-400 text-xs mt-1">View options</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TMDB Link */}
        {tmdbLink && (
          <div className="text-center">
            <a
              href={tmdbLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold"
            >
              <ExternalLink className="w-5 h-5" />
              View All Options on TMDB
            </a>
          </div>
        )}

        {/* No providers available */}
        {streamingProviders.length === 0 && rentProviders.length === 0 && buyProviders.length === 0 && (
          <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 text-center">
            <Tv className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-white mb-2">Not Available for Streaming</h4>
            <p className="text-gray-400 mb-4">
              This movie is not currently available on major streaming platforms in the US.
            </p>
            <p className="text-sm text-gray-500">
              Check back later or look for it in theaters, on DVD, or other regional platforms.
            </p>
          </div>
        )}
      </div>

      {/* Enhanced Disclaimer */}
      <div className="mt-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
        <p className="text-xs text-gray-400 text-center">
          <strong>Note:</strong> Clicking on a platform logo will take you to the official TMDB page for this movie,
          where you can find direct links to watch, rent, or buy. Availability and pricing may vary by region and change
          over time.
          <br />
          Data provided by{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            The Movie Database (TMDB)
          </a>
        </p>
      </div>
    </div>
  )
}
