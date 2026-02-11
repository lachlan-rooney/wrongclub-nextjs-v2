import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, CartItem, Listing } from '@/types'

interface AppState {
  // Auth
  user: User | null
  setUser: (user: User | null) => void
  
  // Hydration
  hydrated: boolean
  setHydrated: (hydrated: boolean) => void
  
  // Cart
  cart: CartItem[]
  addToCart: (listing: Listing) => void
  removeFromCart: (listingId: string) => void
  clearCart: () => void
  
  // UI
  viewMode: 'course' | 'grid'
  setViewMode: (mode: 'course' | 'grid') => void
  
  // Filters
  filters: {
    gender: string | null
    category: string | null
    brand: string | null
    minPrice: number | null
    maxPrice: number | null
  }
  setFilter: (key: string, value: string | number | null) => void
  clearFilters: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      setUser: (user) => set({ user }),
      
      // Hydration
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),
      
      // Cart
      cart: [],
      addToCart: (listing) => {
        const cart = get().cart
        if (!cart.find(item => item.listing.id === listing.id)) {
          const newCart = [...cart, { listing, added_at: new Date().toISOString() }]
          
          // Auto-add Fairway Fingers (item #16) if adding Walkers clothing (items #1, #7, #12, #15)
          const walkersClothingIds = ['1', '7', '12', '15']
          if (walkersClothingIds.includes(listing.id) && !newCart.find(item => item.listing.id === '16')) {
            // Create a mock Fairway Fingers listing for auto-add
            const fairwayFingers: Listing = {
              id: '16',
              seller_id: 'seller1',
              brand: 'Walkers x Wrong Club',
              title: 'Fairway Fingers Shortbread',
              price: 500,
              category: 'accessories',
              gender: 'mens',
              description: 'Delicious Walkers Shortbread Fairway Fingers paired with your Wrong Club collaboration purchase. A perfect sweet treat after your round.',
              condition: 'new_with_tags',
              size: 'One Size',
              images: ['/images/fairway-fingers.png'],
              status: 'active',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
            newCart.push({ listing: fairwayFingers, added_at: new Date().toISOString() })
          }
          
          set({ cart: newCart })
        }
      },
      removeFromCart: (listingId) => {
        set({ cart: get().cart.filter(item => item.listing.id !== listingId) })
      },
      clearCart: () => set({ cart: [] }),
      
      // UI
      viewMode: 'course',
      setViewMode: (mode) => set({ viewMode: mode }),
      
      // Filters
      filters: {
        gender: null,
        category: null,
        brand: null,
        minPrice: null,
        maxPrice: null,
      },
      setFilter: (key, value) => {
        set({ filters: { ...get().filters, [key]: value } })
      },
      clearFilters: () => {
        set({
          filters: {
            gender: null,
            category: null,
            brand: null,
            minPrice: null,
            maxPrice: null,
          },
        })
      },
    }),
    {
      name: 'wrongclub-storage',
      partialize: (state) => ({ user: state.user, cart: state.cart, viewMode: state.viewMode }),
    }
  )
)
