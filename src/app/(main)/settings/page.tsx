'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

// Mock data (profile data will come from auth context)
const mockSettings = {
  account: {
    name: 'Lachlan',
    username: 'lachlan',
    email: 'lachlan@email.com',
    email_verified: true,
    phone: '+1 (555) 123-4567',
    avatar_url: null,
    two_factor_enabled: false,
  },
  addresses: [
    {
      id: 'addr1',
      is_default: true,
      full_name: 'Lachlan Rooney',
      address_line_1: '123 Main Street',
      address_line_2: null,
      city: 'San Francisco',
      state: 'CA',
      zip_code: '94102',
      country: 'United States',
      phone: '+1 (555) 123-4567',
    },
  ],
  payment_methods: [
    {
      id: 'pm1',
      type: 'card',
      brand: 'Visa',
      last4: '4242',
      exp_month: 12,
      exp_year: 2027,
      is_default: true,
    },
  ],
  payout: {
    connected: true,
    bank_name: 'Wells Fargo',
    last4: '1234',
    status: 'active',
  },
  tier: 'eagle',
  payout_days: 3,
  notifications: {
    push_messages: true,
    push_sold: true,
    push_price_drops: true,
    push_new_items: false,
    push_order_updates: true,
    push_drops: true,
    email_orders: true,
    email_shipping: true,
    email_marketing: false,
    email_digest: false,
    email_seller_tips: true,
  },
  privacy: {
    profile_public: true,
    show_handicap: true,
    show_sales: true,
    show_purchases: false,
    allow_messages_all: true,
    blocked_users: [],
  },
  sizes: {
    tops: 'L',
    bottoms_waist: '32',
    bottoms_length: '32',
    shoes: '10',
    hats: 'one_size',
    gloves: 'L',
  },
  seller: {
    vacation_mode: false,
    handling_time: '1-2 days',
    default_carrier: 'USPS',
    accept_returns: true,
    auto_accept_enabled: false,
    auto_accept_percent: 90,
  },
}

// Toggle Switch Component
function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`w-12 h-6 rounded-full transition-colors ${
        enabled ? 'bg-[#5f6651]' : 'bg-gray-300'
      }`}
    >
      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
    </button>
  )
}

export default function SettingsPage() {
  const { profile, isLoading, user, addresses, fetchAddresses, notification_preferences, updateNotificationPreferences, privacy_settings, updatePrivacySettings } = useAuth()
  const [settings, setSettings] = useState(mockSettings)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [sizes, setSizes] = useState(mockSettings.sizes)
  const [seller, setSeller] = useState(mockSettings.seller)

  // Account section state - initialized from profile
  const [accountData, setAccountData] = useState({
    display_name: profile?.display_name || '',
    username: profile?.username || '',
    email: profile?.email || '',
    phone: mockSettings.account.phone,
    two_factor_enabled: mockSettings.account.two_factor_enabled,
    email_verified: profile?.email ? true : false,
  })

  // Update account data when profile loads
  useEffect(() => {
    if (profile) {
      setAccountData((prev) => ({
        ...prev,
        display_name: profile.display_name || '',
        username: profile.username || '',
        email: profile.email || '',
        email_verified: profile.email ? true : false,
      }))
    }
  }, [profile])

  // Fetch addresses on mount
  useEffect(() => {
    if (user) {
      fetchAddresses()
    }
  }, [user, fetchAddresses])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5f6651]"></div>
      </div>
    )
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/clubhouse"
            className="flex items-center gap-2 text-[#5f6651] hover:opacity-80 mb-4 font-medium"
          >
            <ChevronLeft size={18} />
            Back to Clubhouse
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <button
            onClick={() => scrollToSection('account')}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition text-left"
          >
            <div className="text-3xl mb-2">👤</div>
            <h3 className="font-bold text-gray-900">Edit Profile</h3>
            <p className="text-xs text-gray-600">Update your info</p>
          </button>
          <button
            onClick={() => scrollToSection('addresses')}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition text-left"
          >
            <div className="text-3xl mb-2">📍</div>
            <h3 className="font-bold text-gray-900">My Addresses</h3>
            <p className="text-xs text-gray-600">Shipping addresses</p>
          </button>
          <button
            onClick={() => scrollToSection('payments')}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition text-left"
          >
            <div className="text-3xl mb-2">💳</div>
            <h3 className="font-bold text-gray-900">Payment Methods</h3>
            <p className="text-xs text-gray-600">Cards & payouts</p>
          </button>
        </div>

        {/* SECTION 1: Account */}
        <section id="account" className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Account</h2>

          {/* Profile Photo */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-4">Profile Photo</p>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#5f6651] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                {(accountData.display_name || accountData.username || 'U')[0].toUpperCase()}
              </div>
              <button className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200">
                Change Photo
              </button>
            </div>
          </div>

          {/* Display Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
            <input
              type="text"
              value={accountData.display_name}
              onChange={(e) => setAccountData({ ...accountData, display_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
            />
          </div>

          {/* Username */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={`@${accountData.username}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651] bg-gray-50"
              disabled
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={accountData.email}
                onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
              />
              <button className={`px-4 py-2 rounded-lg font-medium text-sm ${
                accountData.email_verified 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {accountData.email_verified ? '✓ Verified' : '⏳ Pending'}
              </button>
            </div>
          </div>

          {/* Phone */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={accountData.phone}
              onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
            />
          </div>

          {/* Password */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Password</p>
                <p className="text-gray-600">••••••••••</p>
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
                Change Password
              </button>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-sm font-semibold text-gray-700">Two-Factor Authentication</p>
              <p className="text-xs text-gray-600">Add an extra layer of security</p>
            </div>
            <ToggleSwitch
              enabled={accountData.two_factor_enabled}
              onChange={(value) =>
                setAccountData({
                  ...accountData,
                  two_factor_enabled: value,
                })
              }
            />
          </div>

          <button className="w-full bg-[#5f6651] text-white py-2 rounded-lg font-medium hover:opacity-90">
            Save Changes
          </button>
        </section>

        {/* SECTION 2: Addresses */}
        <section id="addresses" className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping & Addresses</h2>

          {/* Shipping Addresses */}
          {addresses.filter(a => !a.is_return_address).length > 0 ? (
            addresses
              .filter(a => !a.is_return_address)
              .map((addr) => (
                <div key={addr.id} className="mb-8 pb-8 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        {addr.is_default ? '⭐ Default Shipping Address' : 'Shipping Address'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-sm px-3 py-1 text-[#5f6651] hover:bg-gray-50 rounded font-medium">
                        Edit
                      </button>
                      <button className="text-sm px-3 py-1 text-red-600 hover:bg-red-50 rounded font-medium">
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
                    {addr.is_default && <p className="font-semibold text-gray-900">✓ Default</p>}
                    <p className="text-gray-700">{addr.full_name}</p>
                    <p className="text-gray-700">{addr.address_line_1}</p>
                    {addr.address_line_2 && <p className="text-gray-700">{addr.address_line_2}</p>}
                    <p className="text-gray-700">
                      {addr.city}, {addr.state} {addr.zip_code}
                    </p>
                    <p className="text-gray-700">{addr.country}</p>
                    {addr.phone && <p className="text-gray-700">{addr.phone}</p>}
                  </div>
                </div>
              ))
          ) : (
            <div className="mb-8 pb-8 border-b border-gray-200 text-gray-500">
              <p className="text-sm">No shipping addresses yet</p>
            </div>
          )}

          {/* Return Address */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-gray-700 mb-4">Return Address (for sellers)</p>
            {addresses.find(a => a.is_return_address) ? (
              <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
                {(() => {
                  const returnAddr = addresses.find(a => a.is_return_address)
                  return (
                    <>
                      <p className="text-gray-700">{returnAddr?.full_name}</p>
                      <p className="text-gray-700">{returnAddr?.address_line_1}</p>
                      {returnAddr?.address_line_2 && <p className="text-gray-700">{returnAddr.address_line_2}</p>}
                      <p className="text-gray-700">
                        {returnAddr?.city}, {returnAddr?.state} {returnAddr?.zip_code}
                      </p>
                      <p className="text-gray-700">{returnAddr?.country}</p>
                      {returnAddr?.phone && <p className="text-gray-700">{returnAddr.phone}</p>}
                    </>
                  )
                })()}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-sm flex justify-between items-center">
                <p className="text-gray-700">None - returns will use shipping address</p>
                <button className="text-sm px-3 py-1 text-[#5f6651] hover:bg-gray-100 rounded font-medium">
                  Add
                </button>
              </div>
            )}
          </div>

          <button className="w-full border border-[#5f6651] text-[#5f6651] py-2 rounded-lg font-medium hover:bg-gray-50">
            + Add New Address
          </button>
        </section>

        {/* SECTION 3: Payments */}
        <section id="payments" className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Payments & Payouts</h2>

          {/* Payment Methods */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-4">Payment Methods</p>
            {settings.payment_methods.map((pm) => (
              <div key={pm.id} className="bg-gray-50 rounded-lg p-4 mb-4 flex justify-between items-center">
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">
                    💳 {pm.brand} ending in {pm.last4}
                  </p>
                  <p className="text-gray-600">Expires {pm.exp_month}/{pm.exp_year}</p>
                  <p className="text-gray-600">Default</p>
                </div>
                <button className="text-sm text-red-600 hover:bg-red-50 px-3 py-1 rounded font-medium">
                  Remove
                </button>
              </div>
            ))}
            <button className="w-full border border-[#5f6651] text-[#5f6651] py-2 rounded-lg font-medium hover:bg-gray-50">
              + Add Payment Method
            </button>
          </div>

          {/* Payout Method */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-4">Payout Method</p>
            {settings.payout.connected ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-2">
                  🏦 Bank Account ending in {settings.payout.last4}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  {settings.payout.bank_name} • Connected via Stripe
                </p>
                <p className="text-sm text-green-700 font-medium">Status: ✅ Active</p>
                <button className="text-sm text-[#5f6651] hover:bg-gray-100 px-3 py-1 rounded font-medium mt-2">
                  Manage
                </button>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 mb-3">Connect a bank account to receive payouts</p>
                <button className="w-full bg-[#5f6651] text-white py-2 rounded-lg font-medium hover:opacity-90">
                  Connect with Stripe
                </button>
              </div>
            )}
          </div>

          {/* Payout Speed */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">Payout Speed</p>
            <p className="text-sm text-gray-600">Your tier: 🦅 Eagle • {settings.payout_days}-day payouts</p>
            <p className="text-sm text-gray-600">Upgrade to Albatross for 2-day payouts</p>
          </div>

          {/* Tax Documents */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-4">Tax Documents</p>
            <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
              <p className="text-sm text-gray-900">2025 1099-K</p>
              <button className="text-sm text-[#5f6651] hover:bg-gray-100 px-3 py-1 rounded font-medium">
                Download PDF
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 4: Notifications */}
        <section id="notifications" className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h2>

          {notification_preferences ? (
            <>
              {/* Push Notifications */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-4">Push Notifications</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-700">New messages</p>
                    <ToggleSwitch
                      enabled={notification_preferences.push_messages}
                      onChange={(value) => updateNotificationPreferences({ push_messages: value })}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-700">Item sold</p>
                    <ToggleSwitch
                      enabled={notification_preferences.push_sold}
                      onChange={(value) => updateNotificationPreferences({ push_sold: value })}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-700">Price drops on saved items</p>
                    <ToggleSwitch
                      enabled={notification_preferences.push_price_drops}
                      onChange={(value) => updateNotificationPreferences({ push_price_drops: value })}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-700">New items from sellers you follow</p>
                    <ToggleSwitch
                      enabled={notification_preferences.push_new_items}
                      onChange={(value) => updateNotificationPreferences({ push_new_items: value })}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-700">Order updates (shipped, delivered)</p>
                    <ToggleSwitch
                      enabled={notification_preferences.push_order_updates}
                      onChange={(value) => updateNotificationPreferences({ push_order_updates: value })}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-700">Drop alerts</p>
                    <ToggleSwitch
                      enabled={notification_preferences.push_drops}
                      onChange={(value) => updateNotificationPreferences({ push_drops: value })}
                    />
                  </div>
                </div>
              </div>

              {/* Email Notifications */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-4">Email Notifications</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-700">Order confirmations</p>
                    <ToggleSwitch
                      enabled={notification_preferences.email_orders}
                      onChange={(value) => updateNotificationPreferences({ email_orders: value })}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-700">Shipping updates</p>
                    <ToggleSwitch
                      enabled={notification_preferences.email_shipping}
                      onChange={(value) => updateNotificationPreferences({ email_shipping: value })}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-700">Marketing & promotions</p>
                    <ToggleSwitch
                      enabled={notification_preferences.email_marketing}
                      onChange={(value) => updateNotificationPreferences({ email_marketing: value })}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-700">Weekly digest</p>
                    <ToggleSwitch
                      enabled={notification_preferences.email_digest}
                      onChange={(value) => updateNotificationPreferences({ email_digest: value })}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-700">Seller tips & insights</p>
                    <ToggleSwitch
                      enabled={notification_preferences.email_seller_tips}
                      onChange={(value) => updateNotificationPreferences({ email_seller_tips: value })}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Loading notification preferences...</p>
          )}
        </section>

        {/* SECTION 5: Privacy */}
        <section id="privacy" className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy</h2>

          {privacy_settings ? (
            <>
              {/* Profile Visibility */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-4">Profile Visibility</p>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="profile_visibility"
                      checked={privacy_settings.profile_public}
                      onChange={() => updatePrivacySettings({ profile_public: true })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Public - Anyone can view your profile</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="profile_visibility"
                      checked={!privacy_settings.profile_public}
                      onChange={() => updatePrivacySettings({ profile_public: false })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Private - Only followers can view</span>
                  </label>
                </div>
              </div>

              {/* Show on Profile */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-4">Show on Profile</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-700">Handicap score</p>
                    <ToggleSwitch
                      enabled={privacy_settings.show_handicap}
                      onChange={(value) => updatePrivacySettings({ show_handicap: value })}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-700">Sales count</p>
                    <ToggleSwitch
                      enabled={privacy_settings.show_sales}
                      onChange={(value) => updatePrivacySettings({ show_sales: value })}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-700">Purchase history</p>
                    <ToggleSwitch
                      enabled={privacy_settings.show_purchases}
                      onChange={(value) => updatePrivacySettings({ show_purchases: value })}
                    />
                  </div>
                </div>
              </div>

              {/* Messaging */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Messaging</p>
                    <p className="text-xs text-gray-600 mt-1">Allow messages from anyone</p>
                    <p className="text-xs text-gray-600">(Turn off to only receive messages from buyers/sellers)</p>
                  </div>
                  <ToggleSwitch
                    enabled={privacy_settings.allow_messages_all}
                    onChange={(value) => updatePrivacySettings({ allow_messages_all: value })}
                  />
                </div>
              </div>

              {/* Blocked Users */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Blocked Users</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">You haven't blocked anyone</p>
                  <button className="text-sm text-[#5f6651] hover:bg-gray-50 px-3 py-1 rounded font-medium">
                    Manage Blocked Users
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Loading privacy settings...</p>
          )}
        </section>

        {/* SECTION 6: Your Sizes */}
        <section id="sizes" className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Sizes</h2>
          <p className="text-sm text-gray-600 mb-6">Save your sizes for faster shopping and better recommendations</p>

          <div className="space-y-6 mb-8">
            {/* Tops */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tops</label>
              <select
                value={sizes.tops}
                onChange={(e) => setSizes({ ...sizes, tops: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
              >
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Bottoms - Waist */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bottoms - Waist</label>
              <select
                value={sizes.bottoms_waist}
                onChange={(e) => setSizes({ ...sizes, bottoms_waist: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
              >
                {['28', '29', '30', '31', '32', '33', '34', '36', '38', '40', '42'].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Bottoms - Length */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bottoms - Length</label>
              <select
                value={sizes.bottoms_length}
                onChange={(e) => setSizes({ ...sizes, bottoms_length: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
              >
                {['28', '29', '30', '31', '32', '33', '34', '36'].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Shoes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Shoes</label>
              <select
                value={sizes.shoes}
                onChange={(e) => setSizes({ ...sizes, shoes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
              >
                {['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13', '14'].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Hats */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hats</label>
              <select
                value={sizes.hats}
                onChange={(e) => setSizes({ ...sizes, hats: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
              >
                <option value="one_size">One Size / Adjustable</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="xl">XL</option>
              </select>
            </div>

            {/* Gloves */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Gloves</label>
              <select
                value={sizes.gloves}
                onChange={(e) => setSizes({ ...sizes, gloves: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
              >
                {['S', 'M', 'M/L', 'L', 'XL'].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button className="w-full bg-[#5f6651] text-white py-2 rounded-lg font-medium hover:opacity-90">
            Save Sizes
          </button>
        </section>

        {/* SECTION 7: Seller Settings */}
        <section id="seller" className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Seller Settings</h2>

          {/* Vacation Mode */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-gray-700">Vacation Mode</p>
                <p className="text-xs text-gray-600 mt-1">Pause all your listings while you're away</p>
                <p className="text-xs text-gray-600">Your items won't appear in search or browse</p>
              </div>
              <ToggleSwitch
                enabled={seller.vacation_mode}
                onChange={(value) => setSeller({ ...seller, vacation_mode: value })}
              />
            </div>
          </div>

          {/* Default Handling Time */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Default Handling Time</label>
            <select
              value={seller.handling_time}
              onChange={(e) => setSeller({ ...seller, handling_time: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
            >
              <option>1 day</option>
              <option>1-2 days</option>
              <option>2-3 days</option>
              <option>3-5 days</option>
            </select>
          </div>

          {/* Default Shipping Carrier */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Default Shipping Carrier</label>
            <select
              value={seller.default_carrier}
              onChange={(e) => setSeller({ ...seller, default_carrier: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
            >
              <option>USPS</option>
              <option>UPS</option>
              <option>FedEx</option>
              <option>DHL</option>
            </select>
          </div>

          {/* Return Policy */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-4">Return Policy</p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="return_policy" defaultChecked className="w-4 h-4" />
                <span className="text-sm text-gray-700">Accept returns (within 14 days)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="return_policy" className="w-4 h-4" />
                <span className="text-sm text-gray-700">No returns accepted</span>
              </label>
            </div>
          </div>

          {/* Auto-Accept Offers */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-700">Auto-Accept Offers</p>
                <p className="text-xs text-gray-600">Automatically accept offers above:</p>
              </div>
              <ToggleSwitch
                enabled={seller.auto_accept_enabled}
                onChange={(value) => setSeller({ ...seller, auto_accept_enabled: value })}
              />
            </div>
            {seller.auto_accept_enabled && (
              <input
                type="number"
                value={seller.auto_accept_percent}
                onChange={(e) => setSeller({ ...seller, auto_accept_percent: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5f6651]"
                placeholder="% of listing price"
              />
            )}
          </div>
        </section>

        {/* SECTION 8: Your Data & Account */}
        <section id="danger" className="bg-red-50 border border-red-200 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-red-900 mb-6">Your Data & Account</h2>

          {/* Download Data */}
          <div className="mb-8 pb-8 border-b border-red-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-gray-900">⬇️ Download My Data</p>
                <p className="text-sm text-gray-700 mt-1">Get a copy of all your Wrong Club data</p>
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
                Request Data Export
              </button>
            </div>
          </div>

          {/* Deactivate Account */}
          <div className="mb-8 pb-8 border-b border-red-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-gray-900">⏸️ Deactivate Account</p>
                <p className="text-sm text-gray-700 mt-1">Temporarily hide your profile and listings</p>
                <p className="text-xs text-gray-600 mt-1">You can reactivate anytime by logging back in</p>
              </div>
              <button className="px-4 py-2 border border-orange-500 text-orange-600 rounded-lg font-medium hover:bg-orange-50">
                Deactivate Account
              </button>
            </div>
          </div>

          {/* Delete Account */}
          <div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-gray-900">🗑️ Delete Account</p>
                <p className="text-sm text-gray-700 mt-1">Permanently delete your account and all data</p>
                <p className="text-xs text-gray-600 mt-1">This action cannot be undone</p>
              </div>
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="px-4 py-2 border border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50"
              >
                Delete Account
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Delete Account Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-red-600 mb-4">Delete Account</h2>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-red-700 font-medium">⚠️ This action is permanent and cannot be undone.</p>
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-900 mb-2">Deleting your account will:</p>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Remove all your listings</li>
                <li>Delete your purchase history</li>
                <li>Remove your profile and Home Course</li>
                <li>Cancel any pending orders</li>
              </ul>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Type "DELETE" to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder=""
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setDeleteModalOpen(false)
                  setDeleteConfirmText('')
                }}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                disabled={deleteConfirmText !== 'DELETE'}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                  deleteConfirmText === 'DELETE'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Permanently Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
