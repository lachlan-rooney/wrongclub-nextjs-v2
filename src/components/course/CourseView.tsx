'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Listing } from '@/types'
import { formatPrice, cn } from '@/lib/utils'

interface CourseViewProps {
  listings: Listing[]
  onPositionUpdate?: (listingId: string, x: number, y: number) => void
}

export function CourseView({ listings, onPositionUpdate }: CourseViewProps) {
  const [hoveredListing, setHoveredListing] = useState<Listing | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const courseRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (courseRef.current) {
      const rect = courseRef.current.getBoundingClientRect()
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
    
    // Handle dragging
    if (draggingId && courseRef.current) {
      const rect = courseRef.current.getBoundingClientRect()
      const newX = e.clientX - rect.left
      const newY = e.clientY - rect.top
      
      // Calculate percentage position
      const percentX = (newX / rect.width) * 100
      const percentY = (newY / rect.height) * 100
      
      // Clamp to 0-100%
      const clampedX = Math.max(0, Math.min(100, percentX))
      const clampedY = Math.max(0, Math.min(100, percentY))
      
      setDragOffset({ x: clampedX, y: clampedY })
    }
  }

  const handlePinMouseDown = (e: React.MouseEvent, listing: Listing) => {
    e.preventDefault()
    e.stopPropagation()
    setDraggingId(listing.id)
    setHoveredListing(null)
  }

  const handleMouseUp = () => {
    if (draggingId && courseRef.current) {
      const listing = listings.find(l => l.id === draggingId)
      if (listing && onPositionUpdate) {
        onPositionUpdate(draggingId, dragOffset.x, dragOffset.y)
      }
    }
    setDraggingId(null)
    setDragOffset({ x: 0, y: 0 })
  }

  return (
    <div
      ref={courseRef}
      className="relative w-full h-[calc(100vh-200px)] bg-white rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Course background - you'd replace this with your actual course image */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200" />

      {/* Product pins */}
      {listings.map((listing) => {
        // Use dragged position if currently dragging this pin, otherwise use stored position
        const isBeingDragged = draggingId === listing.id
        const displayX = isBeingDragged ? dragOffset.x : (listing.position_x || 50)
        const displayY = isBeingDragged ? dragOffset.y : (listing.position_y || 50)
        
        return (
          <div
            key={listing.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{
              left: `${displayX}%`,
              top: `${displayY}%`,
            }}
            onMouseMove={(e) => handleMouseMove(e as React.MouseEvent<HTMLDivElement>)}
            onMouseLeave={() => !isBeingDragged && setHoveredListing(null)}
          >
            <Link
              href={`/listing/${listing.id}`}
              className={cn(
                "block transition-transform cursor-move",
                isBeingDragged ? "scale-125" : "hover:scale-110"
              )}
              onClick={(e) => draggingId && e.preventDefault()}
              onMouseDown={(e) => handlePinMouseDown(e, listing)}
            >
              <div className="w-[75px] h-[75px] rounded-full overflow-hidden bg-white shadow-lg border-2 border-white">
                {listing.images[0] ? (
                  <Image
                    src={listing.images[0]}
                    alt={listing.title}
                    width={75}
                    height={75}
                    className="object-cover w-full h-full pointer-events-none select-none"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                    No img
                  </div>
                )}
              </div>
            </Link>
          </div>
        )
      })}

      {/* Tooltip */}
      {hoveredListing && (
        <div
          className="absolute z-20 bg-white rounded-xl shadow-xl p-3 pointer-events-none transform -translate-x-1/2"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y - 120,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
              {hoveredListing.images[0] && (
                <Image
                  src={hoveredListing.images[0]}
                  alt={hoveredListing.title}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500">{hoveredListing.brand}</p>
              <p className="font-medium text-sm">{hoveredListing.title}</p>
              <p className="text-brand-green font-bold">{formatPrice(hoveredListing.price)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hint */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-600">
        👆 Hover to preview • Drag to reposition • Click to view
      </div>
    </div>
  )
}
