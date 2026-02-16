'use client'

import { getFitRecommendation, getFitBadgeColor, getFitLabel } from '@/lib/sizing'

interface FitBadgeProps {
  fitScale: number
  userSize?: string
  listingSize?: string
  category?: 'tops' | 'bottoms_waist' | 'bottoms_length' | 'footwear' | 'headwear' | 'gloves'
  isOneSize?: boolean
  showRecommendation?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function FitBadge({ 
  fitScale, 
  userSize, 
  listingSize, 
  category = 'tops',
  isOneSize = false,
  showRecommendation = true,
  size = 'md',
}: FitBadgeProps) {
  const { bgColor, textColor, borderColor } = getFitBadgeColor(fitScale)
  const { label, emoji } = getFitLabel(fitScale)
  
  // Get personalized recommendation if user has sizes
  const recommendation = userSize && listingSize && showRecommendation
    ? getFitRecommendation(userSize, listingSize, fitScale, category)
    : null

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  }

  if (isOneSize) {
    return (
      <div className={`${sizeClasses[size]} rounded-full border-2 border-purple-300 bg-purple-50 text-purple-700 font-medium inline-flex items-center gap-2`}>
        <span>📏</span>
        <span>One Size</span>
      </div>
    )
  }

  return (
    <div className={`space-y-2`}>
      <div className={`${sizeClasses[size]} ${bgColor} ${textColor} ${borderColor} rounded-full border-2 font-medium inline-flex items-center gap-2`}>
        <span>{emoji}</span>
        <span>{label}</span>
      </div>
      
      {recommendation && (
        <p className="text-sm text-gray-600 italic">{recommendation}</p>
      )}
    </div>
  )
}

export default FitBadge
