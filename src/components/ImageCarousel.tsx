'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface ImageCarouselProps {
  images: string[]
  alt: string
}

export function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }
    if (isRightSwipe) {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  return (
    <div className="relative w-full bg-white px-4 sm:px-6 py-4">
      {/* Carousel Container */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden bg-[var(--sand-light)] rounded-xl sm:rounded-2xl"
        style={{ aspectRatio: '1' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Images */}
        <div
          className="flex h-full w-full"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: 'transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        >
          {images.map((image, idx) => (
            <div
              key={idx}
              className="relative w-full h-full flex-shrink-0 bg-[var(--sand-light)]"
            >
              <Image
                src={image}
                alt={`${alt} ${idx + 1}`}
                fill
                className="object-contain"
                priority={idx === 0}
                sizes="100vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-1.5 py-3">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className="transition-all duration-300"
            style={{
              width: currentIndex === idx ? '20px' : '6px',
              height: '6px',
              backgroundColor:
                currentIndex === idx ? 'var(--brand)' : '#E8E5DF',
              borderRadius: '100px',
            }}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
