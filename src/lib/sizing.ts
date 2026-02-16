// Sizing system constants for Wrong Club

export const SIZE_OPTIONS = {
  // Tops (Polos, Shirts, Sweaters, Jackets)
  tops: {
    label: 'Tops',
    description: 'Polos, shirts, sweaters, jackets',
    options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
  },

  // Bottoms - Waist
  bottomsWaist: {
    label: 'Bottoms (Waist)',
    description: 'Pants, shorts waist size',
    options: ['28', '30', '32', '34', '36', '38', '40', '42', '44']
  },

  // Bottoms - Length
  bottomsLength: {
    label: 'Bottoms (Length)',
    description: 'Pants inseam length',
    options: ['28', '30', '32', '34', '36']
  },

  // Footwear - US sizing
  footwear: {
    label: 'Footwear',
    description: 'Golf shoes, sneakers (US sizing)',
    options: {
      mens: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13', '14'],
      womens: ['5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '11']
    }
  },

  // Headwear
  headwear: {
    label: 'Headwear',
    description: 'Caps, bucket hats, beanies',
    options: ['S/M', 'M/L', 'L/XL', 'One Size', 'Adjustable']
  },

  // Gloves
  gloves: {
    label: 'Gloves',
    description: 'Golf gloves',
    options: ['S', 'M', 'ML', 'L', 'XL', 'Cadet S', 'Cadet M', 'Cadet ML', 'Cadet L']
  }
}

export const FIT_SCALE = [
  { value: -2, label: 'Runs Very Small', description: 'Size up 1-2 sizes', emoji: '↓↓' },
  { value: -1, label: 'Runs Small', description: 'Consider sizing up', emoji: '↓' },
  { value: 0, label: 'True to Size', description: 'Fits as expected', emoji: '✓' },
  { value: 1, label: 'Runs Large', description: 'Consider sizing down', emoji: '↑' },
  { value: 2, label: 'Runs Very Large', description: 'Size down 1-2 sizes', emoji: '↑↑' },
]

export const GENDER_OPTIONS = [
  { value: 'mens', label: "Men's" },
  { value: 'womens', label: "Women's" },
  { value: 'all', label: 'Both' }
]

/**
 * Get personalized fit recommendation based on user size, listing size, and fit scale
 */
export const getFitRecommendation = (
  userSize: string,
  listingSize: string,
  fitScale: number,
  category: 'tops' | 'bottoms_waist' | 'bottoms_length' | 'footwear' | 'headwear' | 'gloves'
): string => {
  // Handle top sizes
  if (category === 'tops') {
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
    const userIndex = sizes.indexOf(userSize)
    const listingIndex = sizes.indexOf(listingSize)

    if (userIndex === -1 || listingIndex === -1) return 'Size comparison unavailable'

    // Adjust for fit scale
    const effectiveListingIndex = listingIndex + fitScale

    if (effectiveListingIndex === userIndex) {
      return 'Should fit perfectly! ✓'
    } else if (effectiveListingIndex === userIndex - 1) {
      return 'May fit slightly snug'
    } else if (effectiveListingIndex === userIndex + 1) {
      return 'May fit slightly loose'
    } else if (effectiveListingIndex < userIndex) {
      return 'Likely too small for you'
    } else {
      return 'Likely too large for you'
    }
  }

  // Handle numeric sizes (bottoms, shoes)
  if (['bottoms_waist', 'bottoms_length', 'footwear'].includes(category)) {
    const userNum = parseFloat(userSize)
    const listingNum = parseFloat(listingSize)

    if (isNaN(userNum) || isNaN(listingNum)) return 'Size comparison unavailable'

    // Apply fit scale as +/- 0.5-1 inch/size unit
    const effectiveSize = listingNum + (fitScale * 0.5)

    const difference = Math.abs(effectiveSize - userNum)

    if (difference < 0.25) return 'Should fit perfectly! ✓'
    if (difference < 0.75) return 'Should fit well'
    if (difference < 1.5) return 'May have fit issues'
    return 'Likely too different from your size'
  }

  return 'Perfect fit comparison coming soon'
}

/**
 * Get fit badge color based on fit scale
 */
export const getFitBadgeColor = (fitScale: number): string => {
  switch (fitScale) {
    case -2:
    case -1:
      return 'bg-orange-100 text-orange-700'
    case 0:
      return 'bg-green-100 text-green-700'
    case 1:
    case 2:
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

/**
 * Get fit label with emoji
 */
export const getFitLabel = (fitScale: number): { label: string; emoji: string } => {
  const fit = FIT_SCALE.find(f => f.value === fitScale)
  return fit ? { label: fit.label, emoji: fit.emoji } : { label: 'Unknown', emoji: '?' }
}
