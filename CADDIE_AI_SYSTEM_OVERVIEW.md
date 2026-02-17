# Caddie AI System - Technical Overview

## Executive Summary

Caddie AI is an AI-powered outfit recommendation engine that helps users discover coordinated golf apparel combinations from the Wrong Club marketplace. It uses Claude 3.5 Sonnet to generate personalized outfit suggestions based on user preferences, occasion, weather, and budget.

**Key Value:** Transforms marketplace browsing into an interactive styling session, increasing engagement and basket size.

---

## How It Works (User Perspective)

### The User Journey

1. **User clicks the Caddie button** (floating sparkles icon, bottom-right)
2. **Chat modal opens** with personalized greeting: *"Hey [Name]! What outfit are you looking for?"*
3. **User describes what they need**, e.g.:
   - *"I need a casual round outfit for hot weather"*
   - *"Looking for something sharp for a tournament"*
   - *"Corporate golf event - need to impress"*
4. **Caddie AI generates outfit** (takes ~2-3 seconds):
   - Shows outfit name (e.g., "Desert Heat Essentials")
   - Displays 3-4 item cards with images, brand, price
   - Explains why each item works ("Great for heat management")
   - Shows total outfit cost + 5% Caddie bundle discount
5. **User can:**
   - Click items to view full listing details
   - Add all items to cart with one click
   - Ask for different options ("Show me something bolder")
   - Save outfit for later

---

## System Architecture

### 1. Frontend Layer

#### Components

**CaddieButton** (`/src/components/CaddieButton.tsx`)
- Floating action button (position: fixed, bottom-right)
- Sparkles icon + "Ask Caddie AI" tooltip
- Opens CaddieChat modal on click
- Renders on all (main) layout pages globally

**CaddieChat** (`/src/components/CaddieChat.tsx`)
- Modal overlay with dark background
- Header with Caddie branding and close button
- Message history section (auto-scrolls to bottom)
- User messages: right-aligned, green background
- Caddie messages: left-aligned, grey background
- Outfit cards showing generated recommendations
- Input field at bottom + send button (or Enter key)
- Loading state with spinner during API calls
- Suggested prompts shown on first message

**Caddie Page** (`/src/app/(main)/caddie/page.tsx`)
- Full-page experience at `/caddie`
- Hero section with Caddie branding
- 4 quick-start buttons (Casual, Corporate, Tournament, Rainy)
- "How Caddie Works" (3-step explanation)
- "Start Styling Session" CTA
- Auth-protected route (redirects to login if not authenticated)
- Integrates CaddieChat modal

### 2. Backend Layer

#### API Endpoint

**Route:** `POST /api/caddie`

**Request Format:**
```json
{
  "type": "outfit_builder",  // or "style_match", "occasion", "wardrobe_gap"
  "prompt": "I need a casual round outfit for hot weather",
  "occasion": "casual_round",  // optional
  "budgetMin": 5000,  // cents, optional
  "budgetMax": 30000,  // cents, optional
  "gender": "men",  // optional
  "referenceListingId": "uuid"  // optional - for style matching
}
```

**Response Format:**
```json
{
  "success": true,
  "outfit": {
    "id": "uuid",
    "name": "Desert Heat Essentials",
    "description": "Perfect for hot weather casual rounds",
    "styleNotes": "Focus on breathable materials and light colors for maximum heat management",
    "listings": [
      {
        "id": "uuid",
        "title": "Polo Shirt - White",
        "brand": "Nike",
        "price": 9500,
        "image_url": "https://...",
        "whyItWorks": "Moisture-wicking fabric keeps you cool and dry"
      },
      // ... 3-4 more items
    ],
    "totalPrice": 45000,
    "bundleDiscount": 2250
  }
}
```

**Process Inside API:**

1. **Authentication Check**
   - Verify user is logged in via Supabase
   - Return 401 if unauthorized

2. **Fetch User Context**
   - Get user profile (display name, email)
   - Get user's style preferences (if exist)
   - Get reference listing (if provided)

3. **Query Marketplace Listings**
   - Fetch active listings from `listings` table
   - Filter: exclude user's own listings
   - Filter by gender (if specified)
   - Filter by budget range (if specified)
   - Limit to ~100 listings for context window
   - Include: id, title, brand, category, size, color, condition, price, fit_scale, image_url

4. **Build Claude Prompt**
   - System prompt: Golf fashion expertise, outfit coordination rules
   - User prompt includes:
     - User request
     - Available listings (formatted nicely)
     - User style preferences
     - Budget constraints
     - Instruction to respond with JSON

5. **Call Claude API**
   - Model: `claude-3-5-sonnet-20241022`
   - Max tokens: 2000
   - Temperature: default (0.5)
   - Expects JSON response with outfit structure

6. **Parse & Enrich Response**
   - Parse Claude's JSON output
   - Extract outfit name, description, style notes
   - Match suggested item IDs to actual listings
   - Calculate total price + 5% discount

7. **Save to Database**
   - Insert into `caddie_outfits` table:
     - user_id, prompt, occasion, outfit details
   - Insert into `caddie_recommendations` table:
     - Track which listings were recommended
     - Mark for future interaction tracking (clicks, purchases)

8. **Return Structured Response**
   - Send outfit data to frontend
   - Frontend renders immediately

---

## Database Schema

### Tables Created

#### 1. `caddie_outfits`
Stores generated outfit recommendations.

```sql
CREATE TABLE caddie_outfits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Request context
  prompt TEXT NOT NULL,                    -- User's original request
  occasion TEXT,                           -- e.g., "casual_round", "tournament"
  budget_min_cents INTEGER,
  budget_max_cents INTEGER,
  
  -- Generated outfit
  outfit_name TEXT,                        -- e.g., "Desert Heat Essentials"
  outfit_description TEXT,                 -- Short description
  style_notes TEXT,                        -- Styling tips
  
  -- Listings included
  listing_ids UUID[] NOT NULL DEFAULT '{}',  -- Array of item IDs in outfit
  
  -- Feedback
  was_helpful BOOLEAN,                     -- Did user like it?
  items_purchased INTEGER DEFAULT 0,       -- How many items bought?
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- RLS: Users can only view their own outfits
```

#### 2. `caddie_preferences`
Stores user style profile (brands, colors, price range).

```sql
CREATE TABLE caddie_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Style data
  favorite_brands TEXT[],                  -- Brands user loves
  disliked_brands TEXT[],                  -- Brands to avoid
  preferred_colors TEXT[],                 -- e.g., ["navy", "white", "grey"]
  avoided_colors TEXT[],
  style_keywords TEXT[],                   -- e.g., ["classic", "minimalist"]
  inferred_styles TEXT[],                  -- Auto-detected from outfit history
  price_range JSONB,                       -- {"min": 5000, "max": 30000}
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- RLS: Users can only view their own preferences
-- AUTO-CREATED: Trigger creates default preferences when user signs up
```

#### 3. `caddie_recommendations`
Tracks which items were recommended and user interactions.

```sql
CREATE TABLE caddie_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  listing_id UUID NOT NULL REFERENCES listings(id),
  outfit_id UUID NOT NULL REFERENCES caddie_outfits(id),
  
  -- Context
  context TEXT,                            -- e.g., "hot_weather_casual"
  
  -- Interaction tracking
  was_clicked BOOLEAN DEFAULT FALSE,       -- Did user view the listing?
  was_saved BOOLEAN DEFAULT FALSE,         -- Did user save the outfit?
  was_purchased BOOLEAN DEFAULT FALSE,     -- Did user buy this item?
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- RLS: Users can only view their own recommendations
```

### Key RLS Policies

All tables have Row Level Security (RLS) policies:
- **SELECT:** Users can only view their own rows (`auth.uid() = user_id`)
- **INSERT:** Users can only insert rows for themselves
- **UPDATE:** Users can only update their own rows
- **DELETE:** Restricted (typically disabled)

### Triggers

**Auto-create preferences on signup:**
When a user signs up, an `INSERT` trigger automatically creates a row in `caddie_preferences` with default values.

### RPC Functions

**`get_my_caddie_preferences()`**
- Client-side: Fetches user's current preferences
- Used by Caddie AI to personalize recommendations
- Returns style keywords, price range, preferred brands

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      USER INTERACTION                       │
│  Click Caddie Button → Type prompt → Hit send               │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (React)                          │
│  CaddieChat Component                                       │
│  - Collect user message                                     │
│  - Show loading spinner                                     │
│  - Add user bubble to message history                       │
└────────────────────────┬────────────────────────────────────┘
                         ↓
                   fetch() POST
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND API                               │
│  /api/caddie route                                          │
│                                                             │
│  1. Auth check (Supabase)                                   │
│  2. Fetch user profile + preferences                        │
│  3. Query marketplace listings (~100 items)                 │
│  4. Build context + Claude prompt                           │
│  5. Call Claude API (Anthropic)                             │
└────────────────────────┬────────────────────────────────────┘
                         ↓
                    Claude API
                    (Sonnet 3.5)
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              CLAUDE AI GENERATION                           │
│  Receives:                                                  │
│  - User request                                             │
│  - Available listings                                       │
│  - User preferences                                         │
│  - Style rules                                              │
│                                                             │
│  Responds with JSON:                                        │
│  - Outfit name                                              │
│  - Outfit description                                       │
│  - 3-4 recommended listings (by ID)                         │
│  - Style notes/tips                                         │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND PROCESSING                         │
│  1. Parse Claude JSON response                              │
│  2. Enrich with listing details (images, prices)            │
│  3. Save outfit to caddie_outfits table                      │
│  4. Save recommendations to caddie_recommendations           │
│  5. Return structured outfit to frontend                    │
└────────────────────────┬────────────────────────────────────┘
                         ↓
                  JSON Response
                         ↓
┌─────────────────────────────────────────────────────────────┐
│               FRONTEND DISPLAY                              │
│  CaddieChat Component                                       │
│  1. Remove loading spinner                                  │
│  2. Parse outfit JSON                                       │
│  3. Render Caddie message bubble                            │
│  4. Show outfit cards with images/prices                    │
│  5. Display "Add All to Cart" button                         │
│  6. Auto-scroll to latest message                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Security & Privacy

### Authentication
- All API requests require valid Supabase session
- User ID extracted from `auth.uid()` (server-side)
- Returns 401 if user not authenticated

### Data Isolation
- RLS policies ensure users can ONLY see their own:
  - Outfits
  - Preferences
  - Recommendations
- No cross-user data exposure

### API Key Management
- `ANTHROPIC_API_KEY` stored in environment variables
- Never exposed to client-side code
- Only used server-side in `/api/caddie` route

### Listing Privacy
- Recommendations only include **active, public listings**
- User cannot see their own listings recommended back to them
- Excludes listings from other sellers for privacy

---

## Performance Considerations

### Response Time
- **API call to Claude:** 1-3 seconds (network dependent)
- **Database queries:** <100ms (optimized indexes)
- **Total user-facing latency:** ~2-4 seconds

### Optimization Strategies
1. **Listing pre-filtering:** Only ~100 listings sent to Claude (not all 10,000+)
2. **Database indexes:** on `user_id`, `status`, `gender`, `price_cents`
3. **Caching:** User preferences cached in state after first fetch
4. **Connection pooling:** Supabase handles this automatically

### Scalability
- Stateless API (scales horizontally)
- Database scales with Supabase Pro tier
- Claude API has no per-request limits (costs scale with usage)

---

## Cost Analysis

### Per-Request Breakdown
- **Claude API tokens:** ~$0.01-0.05 per request
  - Input: ~1000 tokens (listings context)
  - Output: ~200 tokens (recommendation)
- **Supabase database:** ~$0.001 (4 queries)
- **Total cost per outfit generation:** ~$0.015

### Monthly Projections
| Users | Requests | Monthly Cost |
|-------|----------|-------------|
| 10    | 50       | $0.75       |
| 100   | 500      | $7.50       |
| 1,000 | 5,000    | $75         |
| 10,000| 50,000   | $750        |

### Cost Controls
1. **Set Anthropic spending limit:** https://console.anthropic.com → Billing
2. **Monitor usage dashboard:** See real-time token consumption
3. **Rate limiting:** Can add per-user request limits if needed

---

## Error Handling

### API Errors

**User not authenticated (401)**
```json
{ "error": "Unauthorized" }
```

**Claude API error (500)**
```json
{ "error": "Failed to generate outfit. Please try again." }
```

**Invalid request format (400)**
```json
{ "error": "Invalid request parameters" }
```

**Database error (500)**
```json
{ "error": "Failed to save recommendation" }
```

### User-Facing Experience
- Loading spinner shows while generating
- If error occurs: "Caddie had trouble this time. Try another prompt!"
- User can retry immediately without losing message history

---

## Testing Checklist (Before Launch)

- [ ] **Authentication:** Test logged-in and logged-out states
  - Logged in → Caddie button works
  - Logged out → Redirects to login

- [ ] **Chat Interface:** 
  - Messages appear in correct order
  - Auto-scroll works
  - Send button disabled while loading

- [ ] **Outfit Generation:**
  - API responds within 5 seconds
  - Outfit renders with all 4 items
  - Images load
  - Prices display correctly

- [ ] **Database:**
  - Outfit saves to `caddie_outfits`
  - Recommendations save to `caddie_recommendations`
  - User preferences auto-created on first login

- [ ] **Edge Cases:**
  - What if no listings match criteria? (graceful error)
  - What if user has no preferences? (uses defaults)
  - What if API key missing? (show friendly error)

- [ ] **Performance:**
  - Response time < 5 seconds
  - No UI freezing
  - Mobile responsive

- [ ] **Security:**
  - User can't access other users' outfits
  - API key not exposed in client code
  - RLS policies working

---

## Deployment Steps

### 1. Pre-Launch Setup

**Anthropic Console:**
```
1. Go to https://console.anthropic.com
2. Get/create API key
3. Set spending limit to $50/month
```

**Supabase SQL Editor:**
```
1. Copy contents of /supabase/migrations/caddie_ai_system.sql
2. Paste into SQL Editor
3. Click "Run" to create tables + RLS
```

**Environment Variables:**
```
ANTHROPIC_API_KEY=sk-ant-v7-xxxxx
```

### 2. Launch

```bash
npm run build          # Verify no errors
npm run dev            # Test locally

# When ready for production:
git push origin main   # Triggers Netlify/Vercel deploy
```

### 3. Post-Launch Monitoring

- [ ] Check Anthropic usage dashboard (should see requests coming in)
- [ ] Monitor Supabase for database errors
- [ ] Check frontend errors in browser console
- [ ] Track user feedback on outfit quality

---

## Known Limitations

1. **Claude creativity:** Will sometimes suggest items that don't perfectly match
   - Mitigated by human review of listings before Claude sees them

2. **No learning:** Doesn't improve over time based on user preferences
   - Could add feedback loop later to improve recommendations

3. **Static preferences:** Requires manual preference updates
   - Future: Auto-detect preferences from purchase history

4. **Limited outfit variation:** Claude tends to generate similar outfits for same occasion
   - Encourage users to ask for "something bolder" for variety

---

## Future Enhancements

1. **User Feedback Loop**
   - "Was this helpful?" button on outfits
   - Improve future recommendations based on feedback

2. **Style Profile Learning**
   - Auto-detect user style from browse history
   - Track which outfits user saves/purchases

3. **Seasonal Recommendations**
   - Weather-based automatic suggestions
   - Course-specific outfit recommendations

4. **Social Features**
   - Share outfits with friends
   - Public outfit gallery

5. **Advanced Filters**
   - Sustainability score
   - Brand exclusions
   - Fit scale preferences

---

## Support & Troubleshooting

### "Caddie button isn't showing"
- Ensure logged in
- Check browser console for errors
- Hard refresh (Cmd+Shift+R)

### "API key invalid"
- Verify `ANTHROPIC_API_KEY` in .env.local
- Check key hasn't been revoked on Anthropic console
- Restart dev server

### "Outfit generation taking too long"
- Check network connection
- Try simpler prompt
- Check Anthropic API status page

### "Outfit doesn't look right"
- Try rephrasing the prompt
- Specify more details (budget, occasion, style)
- Report to team for Claude prompt refinement

---

## Questions Before Launch?

Review this document and confirm:
- ✅ Architecture makes sense
- ✅ Security is acceptable
- ✅ Cost projections are reasonable
- ✅ User experience is clear
- ✅ Ready to deploy

Let me know if you want me to adjust anything!
