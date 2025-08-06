export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 border-4 border-gray-700 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-purple-500 rounded-full animate-spin" />
        </div>

        {/* Inner ring */}
        <div className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 lg:top-2 lg:left-2 w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 border-4 border-gray-800 rounded-full animate-spin animation-delay-150">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-pink-500 rounded-full animate-spin" />
        </div>

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>

      <p className="mt-4 sm:mt-6 text-gray-400 font-medium text-sm sm:text-base">Loading amazing content...</p>
    </div>
  )
}
