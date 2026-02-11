'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Listing } from '@/types'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ListingCardProps {
  listing: Listing
  className?: string
}

export function ListingCard({ listing, className }: ListingCardProps) {
  return (
    <Link
      href={`/listing/${listing.id}`}
      className={cn(
        'group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-200',
        className
      )}
    >
      {/* Image */}
      <div className="aspect-square relative bg-gray-100 overflow-hidden">
        {listing.images[0] ? (
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
        
        {/* Condition badge */}
        <span className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium">
          {listing.condition.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{listing.brand}</p>
        <h3 className="font-medium text-gray-900 mt-1 line-clamp-1">{listing.title}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-brand-green">
            {formatPrice(listing.price)}
          </span>
          <span className="text-sm text-gray-500">
            Size {listing.size}
          </span>
        </div>
      </div>
    </Link>
  )
}
