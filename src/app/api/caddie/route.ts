import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Types
interface CaddieRequest {
  type: 'outfit_builder' | 'style_match' | 'occasion' | 'wardrobe_gap'
  prompt: string
  referenceListingId?: string
  occasion?: string
  budgetMin?: number
  budgetMax?: number
  gender?: string
}

interface ListingForCaddie {
  id: string
  title: string
  brand: string
  category: string
  gender: string
  size: string
  color: string | null
  condition: string
  price_cents: number
  fit_scale: number
  description: string | null
  image_url: string
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile with sizes
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    const body: CaddieRequest = await request.json()

    // Fetch available listings
    let listingsQuery = supabase
      .from('listings')
      .select(`
        id, title, brand, category, gender, size, color, condition, 
        price_cents, fit_scale, description, is_one_size,
        images:listing_images(url, display_order)
      `)
      .eq('status', 'active')
      .neq('seller_id', user.id)

    // Apply gender filter
    if (body.gender || profile?.gender_preference) {
      const gender = body.gender || profile?.gender_preference
      if (gender !== 'all') {
        listingsQuery = listingsQuery.or(`gender.eq.${gender},gender.eq.unisex`)
      }
    }

    // Apply budget filter
    if (body.budgetMin) {
      listingsQuery = listingsQuery.gte('price_cents', body.budgetMin * 100)
    }
    if (body.budgetMax) {
      listingsQuery = listingsQuery.lte('price_cents', body.budgetMax * 100)
    }

    const { data: listings, error: listingsError } = await listingsQuery.limit(100)

    if (listingsError) throw listingsError

    // Format listings for AI
    const formattedListings: ListingForCaddie[] = (listings || []).map((l: any) => ({
      id: l.id,
      title: l.title,
      brand: l.brand || 'Unknown',
      category: l.category,
      gender: l.gender,
      size: l.size,
      color: l.color || 'Not specified',
      condition: l.condition,
      price_cents: l.price_cents,
      fit_scale: l.fit_scale,
      description: l.description || '',
      image_url:
        l.images?.sort((a: any, b: any) => a.display_order - b.display_order)[0]?.url || '',
    }))

    // Get reference listing if provided
    let referenceListing = null
    if (body.referenceListingId) {
      const { data } = await supabase
        .from('listings')
        .select('*')
        .eq('id', body.referenceListingId)
        .single()
      referenceListing = data
    }

    // Get user's style preferences
    const { data: preferences } = await supabase
      .from('caddie_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Build the AI prompts
    const systemPrompt = buildCaddieSystemPrompt()
    const userPrompt = buildCaddieUserPrompt(
      body,
      formattedListings,
      profile,
      preferences,
      referenceListing
    )

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    // Parse the AI response
    const aiResponse =
      response.content[0].type === 'text' ? response.content[0].text : ''

    const parsedOutfit = parseOutfitResponse(aiResponse, formattedListings)

    // Save the recommendation to database
    if (parsedOutfit.listings.length > 0) {
      const { data: outfit } = await supabase
        .from('caddie_outfits')
        .insert({
          user_id: user.id,
          prompt: body.prompt,
          occasion: body.occasion,
          outfit_name: parsedOutfit.name,
          outfit_description: parsedOutfit.description,
          style_notes: parsedOutfit.styleNotes,
          listing_ids: parsedOutfit.listings.map((l: ListingForCaddie) => l.id),
        })
        .select('id')
        .single()

      // Track individual recommendations
      if (outfit) {
        for (const listing of parsedOutfit.listings) {
          await supabase.from('caddie_recommendations').insert({
            user_id: user.id,
            listing_id: listing.id,
            outfit_id: outfit.id,
            context: body.type,
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      outfit: parsedOutfit,
    })
  } catch (error) {
    console.error('Caddie AI error:', error)
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}

function buildCaddieSystemPrompt(): string {
  return `You are Caddie AI, the personal golf style assistant for Wrong Club - America's Golf Marketplace.

Your role is to help golfers find the perfect outfits from available listings. You have deep knowledge of:
- Golf fashion and course dress codes
- Brand reputations and style signatures
- Color coordination and pattern mixing
- Appropriate attire for different occasions (casual round, tournament, corporate event)
- Seasonal considerations
- How to balance style with functionality

When recommending outfits:
1. Always prioritize items that are ACTUALLY AVAILABLE in the listings provided
2. Consider the user's size preferences when possible
3. Explain WHY pieces work together
4. Suggest 1-3 outfit options when possible
5. Note any dress code considerations
6. Be personable and enthusiastic about golf fashion

Response Format:
Return your recommendations as JSON with this structure:
{
  "outfits": [
    {
      "name": "The Country Club Classic",
      "description": "A timeless look that works at any course",
      "items": [
        {
          "listing_id": "uuid-here",
          "role": "top",
          "why": "This navy polo is versatile and the fit is perfect for golf"
        }
      ],
      "style_notes": "Tuck in the polo for a polished look.",
      "total_price_cents": 15000,
      "occasions": ["casual round", "member-guest"]
    }
  ]
}`
}

function buildCaddieUserPrompt(
  request: CaddieRequest,
  listings: ListingForCaddie[],
  profile: any,
  preferences: any,
  referenceListing: any
): string {
  let prompt = `## User Request
Type: ${request.type}
Request: "${request.prompt}"
${request.occasion ? `Occasion: ${request.occasion}` : ''}
${request.budgetMax ? `Budget: Up to $${request.budgetMax}` : ''}

## User Profile
${profile ? `
- Gender: ${profile.gender_preference || 'Not specified'}
- Top size: ${profile.size_tops || 'Not specified'}
- Bottom size: ${profile.size_bottoms_waist || 'Not specified'}
- Shoe size: ${profile.size_footwear || 'Not specified'}
` : ''}

${preferences ? `
## Style Preferences
- Favorite brands: ${preferences.favorite_brands?.length > 0 ? preferences.favorite_brands.join(', ') : 'None specified'}
- Preferred colors: ${preferences.preferred_colors?.length > 0 ? preferences.preferred_colors.join(', ') : 'None specified'}
- Style keywords: ${preferences.style_keywords?.length > 0 ? preferences.style_keywords.join(', ') : 'None specified'}
` : ''}

${referenceListing ? `
## Reference Item (match this style)
- ${referenceListing.title}
- Brand: ${referenceListing.brand}
- Category: ${referenceListing.category}
` : ''}

## Available Listings (use ONLY these IDs):

${listings
  .slice(0, 50)
  .map(
    (l) => `
[${l.id}]
Title: ${l.title}
Brand: ${l.brand}
Category: ${l.category}
Size: ${l.size}
Color: ${l.color}
Condition: ${l.condition}
Price: $${(l.price_cents / 100).toFixed(2)}
`
  )
  .join('\n')}

Please recommend 1-3 complete outfit options using ONLY the listing IDs provided above.`

  return prompt
}

function parseOutfitResponse(aiResponse: string, availableListings: ListingForCaddie[]) {
  try {
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const parsed = JSON.parse(jsonMatch[0])

    const enrichedOutfits = parsed.outfits?.map((outfit: any) => ({
      name: outfit.name,
      description: outfit.description,
      styleNotes: outfit.style_notes,
      totalPrice: outfit.total_price_cents || 0,
      occasions: outfit.occasions || [],
      items: outfit.items
        ?.map((item: any) => {
          const listing = availableListings.find((l) => l.id === item.listing_id)
          return listing
            ? {
                ...listing,
                role: item.role,
                why: item.why,
              }
            : null
        })
        .filter(Boolean),
    })) || []

    return {
      outfits: enrichedOutfits,
      listings: enrichedOutfits.flatMap((o: any) => o.items),
      name: enrichedOutfits[0]?.name || 'Caddie Recommendation',
      description: enrichedOutfits[0]?.description || '',
      styleNotes: enrichedOutfits[0]?.styleNotes || '',
    }
  } catch (error) {
    console.error('Failed to parse AI response:', error)
    return {
      outfits: [],
      listings: [],
      name: '',
      description: '',
      styleNotes: '',
      error: 'Failed to parse recommendations',
    }
  }
}
