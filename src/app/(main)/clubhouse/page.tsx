'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Settings, Plus } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

// Helper: Get tier display info
function getTierDisplay(tier: string) {
  const tiers: { [key: string]: { name: string; emoji: string } } = {
    birdie: { name: 'Birdie', emoji: '🐦' },
    eagle: { name: 'Eagle', emoji: '🦅' },
    albatross: { name: 'Albatross', emoji: '🌟' },
    hole_in_one: { name: 'Hole-in-One', emoji: '🏆' },
  }
  return tiers[tier] || tiers.birdie
}
const mockListings = [
  { id: '1', title: 'Travis Mathew Polo', brand: 'Travis Mathew', price: 6500, status: 'active', views: 124, saves: 8, created_at: '2026-01-17T10:00:00Z' },
  { id: '2', title: 'Malbon Bucket Hat', brand: 'Malbon Golf', price: 5800, status: 'active', views: 89, saves: 12, created_at: '2026-01-15T14:30:00Z' },
  { id: '3', title: 'FootJoy Premieres', brand: 'FootJoy', price: 16500, status: 'sold', views: 234, saves: 15, created_at: '2026-01-10T09:00:00Z' },
  { id: '4', title: 'Nike Dri-FIT Polo', brand: 'Nike', price: 4500, status: 'draft', views: 0, saves: 0, created_at: '2026-01-20T11:00:00Z' },
]

const mockOrders = [
  {
    id: 'o1',
    order_number: 'WC-2026-54321',
    listing: { id: '3', title: 'FootJoy Premieres', price: 16500 },
    buyer: { username: 'golfpro99', name: 'James T.' },
    status: 'awaiting_shipment',
    shipping_address: { full_name: 'James Thompson', address_line_1: '456 Oak Avenue', city: 'Austin', state: 'TX', zip_code: '78701' },
    seller_earnings: 14850,
    tracking_number: null,
    created_at: '2026-01-20T09:00:00Z',
  },
]

const mockPurchases = [
  {
    id: 'p1',
    order_number: 'WC-2026-12345',
    listing: { id: '10', title: 'Good Good Rope Hat', price: 3800 },
    seller: { username: 'mikep', name: 'Mike P.' },
    status: 'shipped',
    tracking_number: '1Z999AA10123456784',
    tracking_url: 'https://www.ups.com/track?tracknum=1Z999AA10123456784',
    estimated_delivery: '2026-01-25',
    total_paid: 3899,
    created_at: '2026-01-18T14:30:00Z',
    review_left: false,
  },
]

const mockEarnings = {
  available_balance: 24750,
  pending_balance: 11830,
  this_month: { sales_count: 4, revenue: 31200, fees: 2808, net: 28392 },
  all_time: { sales_count: 47, revenue: 384700, fees: 34623, net: 350077 },
  transactions: [
    { id: 't1', type: 'sale', description: 'Travis Mathew Polo', amount: 5915, status: 'pending', created_at: '2026-01-20T09:00:00Z' },
    { id: 't2', type: 'withdrawal', description: 'Withdrawal to ****4242', amount: -20000, status: 'complete', created_at: '2026-01-18T12:00:00Z' },
    { id: 't3', type: 'sale', description: 'Malbon Bucket Hat', amount: 5220, status: 'available', created_at: '2026-01-15T10:30:00Z' },
    { id: 't4', type: 'sale', description: 'FootJoy Premieres', amount: 14850, status: 'available', created_at: '2026-01-12T16:45:00Z' },
  ],
}

const mockMessages = [
  { id: 'm1', participant: { username: 'golfpro99', name: 'James T.' }, listing: { title: 'FootJoy Premieres' }, last_message: { content: "What's the pit-to-pit measurement on this?", sent_at: '2026-01-20T14:30:00Z', is_read: false }, unread_count: 1 },
  { id: 'm2', participant: { username: 'mikep', name: 'Mike P.' }, listing: { title: 'Good Good Rope Hat' }, last_message: { content: "Shipped! Here's your tracking number", sent_at: '2026-01-19T10:00:00Z', is_read: true }, unread_count: 0 },
]

// Helper functions
function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getRelativeTime(dateString: string) {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(dateString)
}

// Tab Components
function ListingsTab() {
  const [listings, setListings] = useState(mockListings)
  const [filter, setFilter] = useState('all')
  const [showTrackingModal, setShowTrackingModal] = useState<string | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState<string | null>(null)
  const [deleteReason, setDeleteReason] = useState('')
  const [otherReason, setOtherReason] = useState('')

  const deleteReasons = [
    'Sold elsewhere',
    'Changed my mind about selling',
    'Listed by mistake',
    'Item no longer available',
    'Creating a new listing for this item',
    'Other',
  ]

  const filters = ['all', 'active', 'drafts', 'sold', 'archived']
  const filteredListings = filter === 'all' ? listings : listings.filter(l => {
    if (filter === 'drafts') return l.status === 'draft'
    return l.status === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'draft':
        return 'bg-gray-100 text-gray-600'
      case 'sold':
        return 'bg-blue-100 text-blue-700'
      case 'archived':
        return 'bg-gray-100 text-gray-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'active':
        return '🟢'
      case 'draft':
        return '⚪'
      case 'sold':
        return '🔵'
      case 'archived':
        return '⚪'
      default:
        return '⚪'
    }
  }

  const handleDeleteConfirm = (id: string) => {
    if (!deleteReason) {
      alert('Please select a reason for deletion')
      return
    }
    setListings(listings.filter(l => l.id !== id))
    setDeleteModalOpen(null)
    setDeleteReason('')
    setOtherReason('')
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-2 border-b border-gray-200">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`pb-2 px-3 text-sm font-medium capitalize border-b-2 transition ${
              filter === f
                ? 'border-[#5f6651] text-[#5f6651]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Listings */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't listed anything yet</p>
          <Link
            href="/sell"
            className="inline-block bg-[#5f6651] text-white px-6 py-2 rounded-lg hover:opacity-90 font-medium"
          >
            List Your First Item
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredListings.map(listing => (
            <div key={listing.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
              <div className="flex gap-4">
                <div className="text-4xl">🏌️</div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{listing.title}</h3>
                  <p className="text-sm text-gray-600">{listing.brand}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Listed {getRelativeTime(listing.created_at)} • {listing.views} views • {listing.saves} saves
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="font-bold text-lg">{formatPrice(listing.price)}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(listing.status)}`}>
                      {getStatusDot(listing.status)} {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                {listing.status === 'active' && (
                  <>
                    <button className="text-sm px-3 py-1 text-[#5f6651] hover:bg-gray-50 rounded font-medium">
                      Edit
                    </button>
                    <button className="text-sm px-3 py-1 text-[#5f6651] hover:bg-gray-50 rounded font-medium">
                      Boost
                    </button>
                  </>
                )}
                {listing.status === 'draft' && (
                  <>
                    <button className="text-sm px-3 py-1 text-[#5f6651] hover:bg-gray-50 rounded font-medium">
                      Edit
                    </button>
                    <button className="text-sm px-3 py-1 text-[#5f6651] hover:bg-gray-50 rounded font-medium">
                      Post
                    </button>
                  </>
                )}
                {listing.status === 'sold' && (
                  <button
                    onClick={() => setListings(listings.map(l => l.id === listing.id ? { ...l, status: 'archived' } : l))}
                    className="text-sm px-3 py-1 text-[#5f6651] hover:bg-gray-50 rounded font-medium"
                  >
                    Archive
                  </button>
                )}
                {listing.status === 'archived' && (
                  <span className="text-sm text-gray-500 py-1">Archived</span>
                )}
                <button
                  onClick={() => setDeleteModalOpen(listing.id)}
                  className="text-sm px-3 py-1 text-red-600 hover:bg-red-50 rounded font-medium ml-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Listing</h2>
            <p className="text-sm text-gray-600 mb-3">Help us improve by letting us know why you're deleting this listing.</p>
            
            {/* Warning Message */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-xs text-red-700 font-medium">⚠️ Deleting a listing is permanent and cannot be undone.</p>
            </div>

            <div className="space-y-2 mb-6">
              {deleteReasons.map(reason => (
                <label key={reason} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                  <input
                    type="radio"
                    name="deleteReason"
                    value={reason}
                    checked={deleteReason === reason}
                    onChange={(e) => {
                      setDeleteReason(e.target.value)
                      if (reason !== 'Other') {
                        setOtherReason('')
                      }
                    }}
                    className="w-4 h-4 text-[#5f6651]"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">{reason}</span>
                </label>
              ))}
            </div>

            {deleteReason === 'Other' && (
              <textarea
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                placeholder="Tell us more..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
                rows={3}
              />
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setDeleteModalOpen(null)
                  setDeleteReason('')
                  setOtherReason('')
                }}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConfirm(deleteModalOpen)}
                disabled={!deleteReason || (deleteReason === 'Other' && !otherReason.trim())}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                  !deleteReason || (deleteReason === 'Other' && !otherReason.trim())
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function OrdersTab() {
  const [orders, setOrders] = useState(mockOrders)
  const [filter, setFilter] = useState('all')
  const [showTrackingModal, setShowTrackingModal] = useState<string | null>(null)
  const [trackingData, setTrackingData] = useState({ carrier: 'UPS', number: '' })

  const filters = ['all', 'awaiting_shipment', 'shipped', 'delivered', 'complete']
  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'awaiting_shipment':
        return <span className="text-orange-600 font-semibold">⏳ Awaiting Shipment</span>
      case 'shipped':
        return <span className="text-blue-600 font-semibold">📦 Shipped</span>
      case 'delivered':
        return <span className="text-green-600 font-semibold">✅ Delivered</span>
      case 'complete':
        return <span className="text-gray-600 font-semibold">Complete</span>
      default:
        return null
    }
  }

  const handleAddTracking = (orderId: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'shipped', tracking_number: trackingData.number as any } : o))
    setShowTrackingModal(null)
    setTrackingData({ carrier: 'UPS', number: '' })
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`pb-2 px-3 text-sm font-medium capitalize border-b-2 transition whitespace-nowrap ${
              filter === f
                ? 'border-[#5f6651] text-[#5f6651]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Orders */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No orders yet. When you make a sale, it'll show up here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
              <div className="flex gap-4">
                <div className="text-4xl">🏌️</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{order.listing.title}</h3>
                      <p className="text-sm text-gray-600">Sold to @{order.buyer.username} • {formatDate(order.created_at)}</p>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Order #{order.order_number}</span>
                  </div>

                  <p className="text-sm text-gray-700 mt-2">
                    {formatPrice(order.listing.price)} → You earn: <span className="font-bold text-green-600">{formatPrice(order.seller_earnings)}</span>
                  </p>

                  <div className="mt-3 text-sm">
                    <p className="font-semibold text-gray-900 mb-1">Ship to: {order.shipping_address.full_name}</p>
                    <p className="text-gray-600 text-xs">
                      {order.shipping_address.address_line_1}, {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip_code}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm">{getStatusBadge(order.status)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                {order.status === 'awaiting_shipment' && (
                  <button
                    onClick={() => setShowTrackingModal(order.id)}
                    className="text-sm px-3 py-1 text-[#5f6651] hover:bg-gray-50 rounded font-medium"
                  >
                    Add Tracking
                  </button>
                )}
                <button className="text-sm px-3 py-1 text-[#5f6651] hover:bg-gray-50 rounded font-medium">
                  Message Buyer
                </button>
                <button className="text-sm px-3 py-1 text-[#5f6651] hover:bg-gray-50 rounded font-medium">
                  Help
                </button>
              </div>

              {/* Tracking Modal */}
              {showTrackingModal === order.id && (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold mb-3">Add Tracking Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Carrier</label>
                      <select
                        value={trackingData.carrier}
                        onChange={(e) => setTrackingData({ ...trackingData, carrier: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option>UPS</option>
                        <option>USPS</option>
                        <option>FedEx</option>
                        <option>DHL</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                      <input
                        type="text"
                        value={trackingData.number}
                        onChange={(e) => setTrackingData({ ...trackingData, number: e.target.value })}
                        placeholder="Enter tracking number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddTracking(order.id)}
                        className="bg-[#5f6651] text-white px-4 py-2 rounded-lg font-medium text-sm hover:opacity-90"
                      >
                        Save Tracking
                      </button>
                      <button
                        onClick={() => setShowTrackingModal(null)}
                        className="text-gray-700 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PurchasesTab() {
  const [purchases] = useState(mockPurchases)
  const [filter, setFilter] = useState('all')

  const filters = ['all', 'in_transit', 'delivered', 'complete', 'issues']
  const filteredPurchases = filter === 'all' ? purchases : purchases.filter(p => p.status.replace('_', '') === filter.replace('_', ''))

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_transit':
        return <span className="text-blue-600 font-semibold">📦 In Transit</span>
      case 'shipped':
        return <span className="text-blue-600 font-semibold">📦 In Transit</span>
      case 'delivered':
        return <span className="text-green-600 font-semibold">✅ Delivered</span>
      case 'complete':
        return <span className="text-gray-600 font-semibold">Complete</span>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`pb-2 px-3 text-sm font-medium capitalize border-b-2 transition whitespace-nowrap ${
              filter === f
                ? 'border-[#5f6651] text-[#5f6651]'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Purchases */}
      {filteredPurchases.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't bought anything yet</p>
          <Link
            href="/browse"
            className="inline-block bg-[#5f6651] text-white px-6 py-2 rounded-lg hover:opacity-90 font-medium"
          >
            Browse Items
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPurchases.map(purchase => (
            <div key={purchase.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
              <div className="flex gap-4">
                <div className="text-4xl">🏌️</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{purchase.listing.title}</h3>
                      <p className="text-sm text-gray-600">From @{purchase.seller.username} • {formatDate(purchase.created_at)}</p>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Order #{purchase.order_number}</span>
                  </div>

                  <p className="text-sm text-gray-700 mt-2 font-semibold">{formatPrice(purchase.total_paid)} total</p>

                  {purchase.tracking_number && (
                    <div className="mt-3 text-sm">
                      <p className="text-gray-600">Tracking: {purchase.tracking_number}</p>
                      <p className="text-gray-600">Est. delivery: {purchase.estimated_delivery}</p>
                    </div>
                  )}

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm">{getStatusBadge(purchase.status)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                <button className="text-sm px-3 py-1 text-[#5f6651] hover:bg-gray-50 rounded font-medium">
                  Track Package
                </button>
                <button className="text-sm px-3 py-1 text-[#5f6651] hover:bg-gray-50 rounded font-medium">
                  Message Seller
                </button>
                {purchase.status === 'delivered' && !purchase.review_left && (
                  <>
                    <button className="text-sm px-3 py-1 text-[#5f6651] hover:bg-gray-50 rounded font-medium">
                      Confirm Receipt
                    </button>
                    <button className="text-sm px-3 py-1 text-[#5f6651] hover:bg-gray-50 rounded font-medium">
                      Leave Review
                    </button>
                  </>
                )}
                <button className="text-sm px-3 py-1 text-[#5f6651] hover:bg-gray-50 rounded font-medium ml-auto">
                  Report Issue
                </button>
              </div>

              {purchase.status === 'delivered' && !purchase.review_left && (
                <div className="mt-3 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                  Confirm receipt to release funds to seller
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function EarningsTab() {
  const [filter, setFilter] = useState('all')

  return (
    <div className="space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-600 mb-2">Available Balance</p>
          <div className="flex justify-between items-end">
            <p className="text-3xl font-bold text-green-600">{formatPrice(mockEarnings.available_balance)}</p>
            <button className="bg-[#5f6651] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90">
              Withdraw to Bank
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-600 mb-2">Pending (awaiting delivery confirmation)</p>
          <p className="text-3xl font-bold text-orange-600">{formatPrice(mockEarnings.pending_balance)}</p>
        </div>
      </div>

      {/* Monthly vs All-Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4">This Month</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Sales</span>
              <span className="font-semibold">{mockEarnings.this_month.sales_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Revenue</span>
              <span className="font-semibold">{formatPrice(mockEarnings.this_month.revenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fees</span>
              <span className="font-semibold text-red-600">-{formatPrice(Math.abs(mockEarnings.this_month.fees))}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200 font-bold">
              <span>Net</span>
              <span className="text-green-600">{formatPrice(mockEarnings.this_month.net)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4">All Time</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Sales</span>
              <span className="font-semibold">{mockEarnings.all_time.sales_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Revenue</span>
              <span className="font-semibold">{formatPrice(mockEarnings.all_time.revenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fees</span>
              <span className="font-semibold text-red-600">-{formatPrice(Math.abs(mockEarnings.all_time.fees))}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200 font-bold">
              <span>Net</span>
              <span className="text-green-600">{formatPrice(mockEarnings.all_time.net)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Transaction History</h3>
          <button className="text-sm text-[#5f6651] font-medium hover:bg-gray-50 px-3 py-1 rounded">
            Filter ▼
          </button>
        </div>

        <div className="space-y-3">
          {mockEarnings.transactions.map(tx => {
            const isPositive = tx.amount > 0
            const statusColor = tx.status === 'pending' ? 'bg-orange-100 text-orange-700' : tx.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'

            return (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{tx.description}</p>
                  <p className="text-xs text-gray-500">{formatDate(tx.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}{formatPrice(tx.amount)}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded font-medium whitespace-nowrap ${statusColor}`}>
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <button className="text-center w-full mt-4 text-[#5f6651] font-medium hover:bg-gray-50 py-2 rounded">
          Load More
        </button>
      </div>
    </div>
  )
}

function MessagesTab() {
  const [messages] = useState(mockMessages)

  return (
    <div className="space-y-3">
      {messages.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          No messages yet
        </div>
      ) : (
        messages.map(msg => (
          <Link
            key={msg.id}
            href="/messages"
            className="w-full text-left bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition hover:border-gray-300 block"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0">
                {msg.unread_count > 0 ? '●' : '○'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <p className={`font-semibold text-gray-900 ${msg.unread_count > 0 ? 'font-bold' : ''}`}>
                    @{msg.participant.username}
                  </p>
                  <p className="text-xs text-gray-500">{getRelativeTime(msg.last_message.sent_at)}</p>
                </div>
                <p className="text-xs text-gray-600 mb-1">Re: {msg.listing.title}</p>
                <p className={`text-sm text-gray-600 truncate ${msg.unread_count > 0 ? 'font-medium' : ''}`}>
                  "{msg.last_message.content}"
                </p>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  )
}

// Main Component
export default function ClubhousePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { profile, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'listings')
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5f6651]"></div>
      </div>
    )
  }

  // Get display name and username from profile
  const displayName = profile?.display_name || profile?.username || 'User'
  const username = profile?.username || 'unknown'
  const sellerTier = getTierDisplay(profile?.tier_seller || 'birdie')
  const sellerHandicap = profile?.handicap_seller ?? 18.0
  
  // Real stats for user (new users have 0 sales, $0 earned)
  // TODO: Query these from database once we have the API endpoints
  const stats = {
    sales: 0,      // SELECT COUNT(*) FROM orders WHERE seller_id = profile.id
    earned: 0,     // SELECT SUM(seller_earnings_cents) FROM orders WHERE seller_id = profile.id
    purchases: 0,  // SELECT COUNT(*) FROM orders WHERE buyer_id = profile.id
    rating: 4.8,   // TODO: Calculate from reviews table
  }

  const handleTabChange = (tab: string) => {
    // Save scroll position before any state changes
    const currentScrollPos = window.scrollY
    
    setActiveTab(tab)
    
    // Use requestAnimationFrame for more reliable scroll restoration
    requestAnimationFrame(() => {
      router.push(`?tab=${tab}`, { scroll: false })
      requestAnimationFrame(() => {
        window.scrollTo(0, currentScrollPos)
      })
    })
  }

  const hasUnreadMessages = mockMessages.some(m => m.unread_count > 0)
  const awaitingShipment = mockOrders.some(o => o.status === 'awaiting_shipment')

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 z-40">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Clubhouse</h1>
              <p className="text-gray-600 mt-1">
                @{username} • {sellerTier.emoji} {sellerTier.name} • {sellerHandicap.toFixed(1)} Handicap
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/sell"
                className="flex items-center gap-2 bg-[#5f6651] text-white px-4 py-2 rounded-lg hover:opacity-90 font-medium"
              >
                <Plus size={18} />
                List Item
              </Link>
              <Link
                href="/course-builder"
                className="flex items-center gap-2 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 font-medium"
              >
                🏌️ Course Builder
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-2 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 font-medium"
              >
                <Settings size={18} />
                Settings
              </Link>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#5f6651]">{formatPrice(stats.earned)}</p>
              <p className="text-xs text-gray-600 mt-1">Earned</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#5f6651]">{stats.sales}</p>
              <p className="text-xs text-gray-600 mt-1">Sales</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#5f6651]">{stats.purchases}</p>
              <p className="text-xs text-gray-600 mt-1">Purchases</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#5f6651]">{stats.rating}</p>
              <p className="text-xs text-gray-600 mt-1">Rating</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-8 overflow-x-auto">
          {['listings', 'orders', 'purchases', 'earnings', 'messages'].map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`pb-4 px-1 text-sm font-medium capitalize border-b-2 transition relative ${
                activeTab === tab
                  ? 'border-[#5f6651] text-[#5f6651]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
              {tab === 'orders' && awaitingShipment && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
              {tab === 'messages' && hasUnreadMessages && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'listings' && <ListingsTab />}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'purchases' && <PurchasesTab />}
        {activeTab === 'earnings' && <EarningsTab />}
        {activeTab === 'messages' && <MessagesTab />}
      </div>
    </div>
  )
}
