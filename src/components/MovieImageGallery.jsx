"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react"
import { movieApi } from "../services/movieApi"

export function MovieImageGallery({ images, movieTitle }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) return null

  const openLightbox = (image, index) => {
    setSelectedImage(image)
    setCurrentIndex(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % images.length
    setCurrentIndex(nextIndex)
    setSelectedImage(images[nextIndex])
  }

  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length
    setCurrentIndex(prevIndex)
    setSelectedImage(images[prevIndex])
  }

  const handleKeyDown = (e) => {
    if (e.key === "Escape") closeLightbox()
    if (e.key === "ArrowRight") nextImage()
    if (e.key === "ArrowLeft") prevImage()
  }

  return (
    <>
      <div className="mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
          <div className="w-1 h-5 sm:h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
          <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
          Screenshots & Images
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          {images.slice(0, 12).map((image, index) => (
            <div
              key={index}
              className="group relative cursor-pointer overflow-hidden rounded-lg sm:rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
              onClick={() => openLightbox(image, index)}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-30 transition duration-300 blur" />

              <div className="relative aspect-video overflow-hidden rounded-lg sm:rounded-xl">
                <img
                  src={movieApi.getImageUrl(image.file_path, "w500") || "/placeholder.svg"}
                  alt={`${movieTitle} screenshot ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 sm:p-3 border border-white/30">
                    <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {images.length > 12 && (
          <div className="text-center mt-4 sm:mt-6">
            <p className="text-gray-400 text-sm sm:text-base">Showing 12 of {images.length} images</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[60] flex items-center justify-center p-2 sm:p-4"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-3 sm:top-4 lg:top-6 right-3 sm:right-4 lg:right-6 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-colors backdrop-blur-sm border border-gray-600 z-10"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-3 sm:left-4 lg:left-6 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-colors backdrop-blur-sm border border-gray-600 z-10"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-3 sm:right-4 lg:right-6 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-colors backdrop-blur-sm border border-gray-600 z-10"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          {/* Image counter */}
          <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-600 text-sm sm:text-base">
            {currentIndex + 1} of {images.length}
          </div>

          {/* Main image */}
          <div className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={movieApi.getImageUrl(selectedImage.file_path, "original") || "/placeholder.svg"}
              alt={`${movieTitle} screenshot`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  )
}
