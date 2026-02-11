# Wrong Club 🏌️

The peer-to-peer marketplace for golf apparel and accessories.

> "One person's rough is another's perfect lie."

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payments**: Stripe Connect
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account

### Setup

1. Clone the repo:
```bash
git clone https://github.com/yourusername/wrongclub.git
cd wrongclub
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Fill in your environment variables in `.env.local`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── (main)/            # Main app pages
│   │   ├── browse/        # Browse listings
│   │   ├── listing/[id]/  # Listing detail
│   │   ├── sell/          # Create listing
│   │   ├── profile/[id]/  # User profile
│   │   ├── messages/      # Messages
│   │   └── cart/          # Shopping cart
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── listings/         # Listing components
│   └── course/           # Course view components
├── lib/                  # Utilities
│   ├── supabase.ts      # Supabase client
│   ├── stripe.ts        # Stripe client
│   ├── store.ts         # Zustand store
│   └── utils.ts         # Helper functions
├── hooks/               # Custom React hooks
└── types/               # TypeScript types
```

## Features

- [ ] User authentication
- [ ] Create/edit listings
- [ ] Course view (drag & drop product pins)
- [ ] Grid view
- [ ] Search & filters
- [ ] Shopping cart
- [ ] Stripe checkout
- [ ] Seller payouts (Stripe Connect)
- [ ] Messaging
- [ ] Golf ball rating system
- [ ] 19th Hole live video feed

## License

Proprietary - Wrong Club © 2025
