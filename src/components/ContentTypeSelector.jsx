"use client"

import { Film, Tv, Zap } from "lucide-react"

export function ContentTypeSelector({ contentType, setContentType }) {
  const options = [
    { value: "all", label: "All", icon: Zap },
    { value: "movie", label: "Movies", icon: Film },
    { value: "tv", label: "TV Shows", icon: Tv },
  ]

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-25" />

        <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-2 flex gap-2">
          {options.map((option) => {
            const Icon = option.icon
            const isActive = contentType === option.value

            return (
              <button
                key={option.value}
                onClick={() => setContentType(option.value)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {option.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
