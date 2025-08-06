"use client"

import { Film, Tv, Zap } from "lucide-react"

export function ContentTypeSelector({ contentType, setContentType }) {
  const options = [
    { value: "all", label: "All", icon: Zap },
    { value: "movie", label: "Movies", icon: Film },
    { value: "tv", label: "TV Shows", icon: Tv },
  ]

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl blur opacity-25" />

        <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700 rounded-xl sm:rounded-2xl p-1 sm:p-2 flex gap-1 sm:gap-2">
          {options.map((option) => {
            const Icon = option.icon
            const isActive = contentType === option.value

            return (
              <button
                key={option.value}
                onClick={() => setContentType(option.value)}
                className={`
                  flex items-center gap-1 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 text-xs sm:text-sm lg:text-base
                  ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }
                `}
              >
                <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{option.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
