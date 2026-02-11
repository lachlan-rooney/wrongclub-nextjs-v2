'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Lock, ChevronDown } from 'lucide-react'

interface Listing {
  id: string
  title: string
  price: number
  position: { x: number; y: number }
  featured?: boolean
  img?: string
}

interface CourseSettings {
  name: string
  tagline: string
  terrain: 'links' | 'parkland' | 'desert' | 'mountain' | 'night_golf'
  pin_style: 'flag' | 'marker' | 'dot' | 'ball'
  pin_color: string
  product_labels: 'price_and_title' | 'price_only' | 'title_only' | 'hover_only'
  featured_product_id: string | null
  clubhouse_position: 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right' | 'custom'
  clubhouse_custom_position: { x: number; y: number } | null
  banner_url: string | null
  time_of_day: 'morning' | 'midday' | 'golden' | 'dusk'
  flag_flutter: boolean
  grass_sway: boolean
  accent_color: string
  tier_badge_display: 'prominent' | 'subtle' | 'hidden'
}

const mockUser = {
  name: 'Lachlan',
  username: 'lachlan',
  tier: 'hole_in_one',
  avatar_url: null,
  rating: 4.9,
  total_sales: 47,
}

const mockListings: Listing[] = [
  { id: '1', title: 'Varsity Jacket', price: 24500, position: { x: 30, y: 40 }, img: '/images/walkers-varsity-jacket.png' },
  { id: '2', title: 'FootJoy Premieres', price: 16500, position: { x: 60, y: 25 }, img: '/images/footjoy.png', featured: true },
  { id: '3', title: 'Good Good Hat', price: 3800, position: { x: 50, y: 75 }, img: '/images/good-hat.png' },
  { id: '4', title: 'Performance Shorts', price: 8800, position: { x: 20, y: 60 }, img: '/images/shorts.png' },
  { id: '5', title: 'YETI Cooler', price: 27500, position: { x: 75, y: 50 }, img: '/images/yeti-cooler.png' },
]

const mockCourseSettings: CourseSettings = {
  name: "Lachlan's Links",
  tagline: 'Premium golf gear, priced right',
  terrain: 'parkland',
  pin_style: 'flag',
  pin_color: '#5f6651',
  product_labels: 'price_and_title',
  featured_product_id: '3',
  clubhouse_position: 'top_left',
  clubhouse_custom_position: null,
  banner_url: null,
  time_of_day: 'midday',
  flag_flutter: false,
  grass_sway: false,
  accent_color: '#5f6651',
  tier_badge_display: 'prominent',
}

const terrainStyles = {
  parkland: {
    background: '/browse-background.png',
    fallback: '#6B7F5E',
    name: '🌳 Parkland',
    description: 'Lush tree-lined fairways',
  },
  links: {
    background: '/images/links.png',
    fallback: '#8B9A7D',
    name: '🌿 Links',
    description: 'Scottish coastal links',
  },
  desert: {
    background: '/images/desert.png',
    fallback: '#C4A77D',
    name: '🏜️ Desert',
    description: 'Arizona desert style',
  },
  mountain: {
    background: '/images/links.png',
    fallback: '#7A8B8C',
    name: '⛰️ Mountain',
    description: 'Elevated dramatic views',
  },
  night_golf: {
    background: '/images/night.png',
    fallback: '#2D3748',
    name: '🌙 Night Golf',
    description: 'After dark vibes',
  },
}

const timeOverlays = {
  morning: 'bg-gradient-to-br from-amber-100/10 to-transparent',
  midday: '',
  golden: 'bg-gradient-to-br from-amber-200/15 to-orange-100/10',
  dusk: 'bg-gradient-to-br from-slate-400/15 to-slate-600/20',
}

const tierUnlocks = {
  birdie: ['links'],
  eagle: ['links', 'parkland'],
  albatross: ['links', 'parkland', 'desert'],
  hole_in_one: ['links', 'parkland', 'desert', 'mountain', 'night_golf'],
}

const tierNames = {
  birdie: '🐦 Birdie',
  eagle: '🦅 Eagle',
  albatross: '🪶 Albatross',
  hole_in_one: '⭐ Hole-in-One',
}

const pinColors = [
  { name: 'Sage', value: '#5f6651' },
  { name: 'Slate', value: '#64748b' },
  { name: 'Rust', value: '#9a6b4c' },
  { name: 'Charcoal', value: '#374151' },
  { name: 'Sand', value: '#a89a7d' },
  { name: 'Navy', value: '#334155' },
]

function isFeatureUnlocked(feature: string, userTier: string): boolean {
  const features: Record<string, string[]> = {
    basics: ['birdie', 'eagle', 'albatross', 'hole_in_one'],
    pins_display: ['eagle', 'albatross', 'hole_in_one'],
    layout: ['albatross', 'hole_in_one'],
    atmosphere: ['hole_in_one'],
  }
  return features[feature]?.includes(userTier) || false
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

function CollapsibleSection({ title, children, locked = false, requiredTier = null }: any) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="border-b border-gray-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50/50 transition-colors ${
          locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <span className="font-semibold text-gray-900 text-xs uppercase tracking-wide">{title}</span>
        <div className="flex items-center gap-2">
          {locked && <Lock className="w-3 h-3 text-gray-400" />}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen && !locked ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {isOpen && !locked && <div className="px-4 py-4 space-y-4">{children}</div>}
      {locked && requiredTier && (
        <div className="px-4 py-3 text-xs text-gray-500">
          🔒 Unlock at {tierNames[requiredTier as keyof typeof tierNames]}
        </div>
      )}
    </div>
  )
}

export default function CourseBuilderPage() {
  const [settings, setSettings] = useState<CourseSettings>(mockCourseSettings)
  const [listings, setListings] = useState<Listing[]>(mockListings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [selectedPin, setSelectedPin] = useState<string | null>(null)
  const [headerImage, setHeaderImage] = useState<string | null>(null)
  const [headerPosition, setHeaderPosition] = useState(50)
  const [isRepositioning, setIsRepositioning] = useState(false)
  const [tempPosition, setTempPosition] = useState(50)
  const [dragging, setDragging] = useState<string | null>(null)
  const [startPos, setStartPos] = useState({ mouseX: 0, mouseY: 0, pinX: 0, pinY: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const courseRef = useRef<HTMLDivElement>(null)

  const handleSave = async () => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleDragPin = (e: React.MouseEvent, listing: Listing) => {
    e.preventDefault()
    const rect = courseRef.current?.getBoundingClientRect()
    if (!rect) return

    setDragging(listing.id)
    setStartPos({
      mouseX: e.clientX,
      mouseY: e.clientY,
      pinX: listing.position.x,
      pinY: listing.position.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !courseRef.current) return

    const rect = courseRef.current.getBoundingClientRect()
    const deltaX = ((e.clientX - startPos.mouseX) / rect.width) * 100
    const deltaY = ((e.clientY - startPos.mouseY) / rect.height) * 100

    setListings((prev) =>
      prev.map((l) =>
        l.id === dragging
          ? {
              ...l,
              position: {
                x: Math.max(5, Math.min(95, startPos.pinX + deltaX)),
                y: Math.max(5, Math.min(95, startPos.pinY + deltaY)),
              },
            }
          : l
      )
    )
  }

  const handleMouseUp = () => {
    setDragging(null)
  }

  const handleHeaderImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setHeaderImage(event.target?.result as string)
        setHeaderPosition(50)
        setTempPosition(50)
        setIsRepositioning(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrag = (e: React.MouseEvent) => {
    if (!isRepositioning) return

    e.preventDefault()
    e.stopPropagation()
    
    const startY = e.clientY
    const startPosition = tempPosition
    const containerHeight = (e.currentTarget as HTMLElement).getBoundingClientRect().height

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY
      const newPosition = Math.max(0, Math.min(100, startPosition - (deltaY / containerHeight) * 50))
      setTempPosition(newPosition)
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const savePosition = () => {
    setHeaderPosition(tempPosition)
    setIsRepositioning(false)
  }

  const cancelReposition = () => {
    setTempPosition(headerPosition)
    setIsRepositioning(false)
  }

  const getPinIcon = () => {
    const icons = {
      flag: '🚩',
      marker: '📍',
      dot: '●',
      ball: '⛳',
    }
    return icons[settings.pin_style as keyof typeof icons]
  }

  const clubhousePositions: Record<string, string> = {
    top_left: 'top-4 left-4',
    top_right: 'top-4 right-4',
    bottom_left: 'bottom-4 left-4',
    bottom_right: 'bottom-4 right-4',
    custom: 'top-4 left-4',
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Home Course Builder</h1>
          <div className="flex items-center gap-3">
            <Link
              href={`/profile/${mockUser.username}`}
              className="px-4 py-2 text-gray-700 text-sm font-medium hover:bg-gray-100 rounded-full transition-colors"
            >
              View Course
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-[#5f6651] text-white text-sm font-medium rounded-full hover:bg-[#4a5040] disabled:opacity-50 transition-colors"
            >
              {saving ? '⏳' : saved ? '✓' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden h-fit bg-[#fafafa]">
            {/* BASICS */}
            <CollapsibleSection title="Basics">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Course Name</label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5f6651] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Tagline</label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5f6651] bg-white"
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* TERRAIN */}
            <CollapsibleSection title="Terrain">
              <div className="space-y-2">
                {Object.entries(terrainStyles).map(([key, terrain]) => {
                  const isLocked = !tierUnlocks[mockUser.tier as keyof typeof tierUnlocks]?.includes(key as any)
                  return (
                    <label
                      key={key}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer text-sm transition-colors ${
                        isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="terrain"
                        checked={settings.terrain === key}
                        onChange={() => !isLocked && setSettings({ ...settings, terrain: key as any })}
                        disabled={isLocked}
                        className="w-3 h-3"
                      />
                      <span className="text-gray-900">{terrain.name}</span>
                      {isLocked && <Lock className="w-3 h-3 text-gray-400 ml-auto" />}
                    </label>
                  )
                })}
              </div>
            </CollapsibleSection>

            {/* PINS & DISPLAY */}
            {isFeatureUnlocked('pins_display', mockUser.tier) ? (
              <CollapsibleSection title="Pins & Display">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Pin Style</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['flag', 'marker', 'dot', 'ball'].map((style) => (
                        <button
                          key={style}
                          onClick={() => setSettings({ ...settings, pin_style: style as any })}
                          className={`p-2 rounded-lg text-center border-2 transition-colors text-lg ${
                            settings.pin_style === style
                              ? 'border-[#5f6651] bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {style === 'flag' && '🚩'}
                          {style === 'marker' && '📍'}
                          {style === 'dot' && '●'}
                          {style === 'ball' && '⛳'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Background Color</label>
                    <div className="grid grid-cols-6 gap-2">
                      {pinColors.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setSettings({ ...settings, accent_color: color.value })}
                          className={`w-8 h-8 rounded-full border-2 transition-transform ${
                            settings.accent_color === color.value ? 'border-gray-900 scale-110' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Product Labels</label>
                    <div className="space-y-2">
                      {[
                        { value: 'price_and_title', label: 'Price & title' },
                        { value: 'price_only', label: 'Price only' },
                        { value: 'title_only', label: 'Title only' },
                        { value: 'hover_only', label: 'Hover only' },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer text-sm">
                          <input
                            type="radio"
                            name="labels"
                            checked={settings.product_labels === option.value}
                            onChange={() => setSettings({ ...settings, product_labels: option.value as any })}
                            className="w-3 h-3"
                          />
                          <span className="text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Featured</label>
                    <select
                      value={settings.featured_product_id || ''}
                      onChange={(e) => setSettings({ ...settings, featured_product_id: e.target.value || null })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5f6651] bg-white"
                    >
                      <option value="">None</option>
                      {listings.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CollapsibleSection>
            ) : (
              <CollapsibleSection title="Pins & Display" locked requiredTier="eagle" />
            )}

            {/* LAYOUT */}
            {isFeatureUnlocked('layout', mockUser.tier) ? (
              <CollapsibleSection title="Layout">
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    ✓ Custom drag & drop is enabled. Drag products to reposition them on your course.
                  </p>
                </div>
              </CollapsibleSection>
            ) : (
              <CollapsibleSection title="Layout" locked requiredTier="albatross" />
            )}

            {/* ATMOSPHERE */}
            {isFeatureUnlocked('atmosphere', mockUser.tier) ? (
              <CollapsibleSection title="Atmosphere">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Time of Day</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['morning', 'midday', 'golden', 'dusk'].map((time) => (
                        <button
                          key={time}
                          onClick={() => setSettings({ ...settings, time_of_day: time as any })}
                          className={`p-2 rounded-lg text-center text-lg border-2 transition-colors ${
                            settings.time_of_day === time
                              ? 'border-[#5f6651] bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {time === 'morning' && '🌅'}
                          {time === 'midday' && '☀️'}
                          {time === 'golden' && '🌇'}
                          {time === 'dusk' && '🌙'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CollapsibleSection>
            ) : (
              <CollapsibleSection title="Atmosphere" locked requiredTier="hole_in_one" />
            )}
          </div>

          {/* Right Panel - Preview */}
          <div className="space-y-6">
            {/* Course Preview */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              {/* Banner / Header Image */}
              <div className="relative h-48 overflow-hidden bg-gray-200 user-select-none">
                {headerImage ? (
                  <>
                    <img
                      src={headerImage}
                      alt="Course header"
                      className="w-full h-full object-cover select-none"
                      style={{
                        objectPosition: `center ${isRepositioning ? tempPosition : headerPosition}%`,
                        willChange: isRepositioning ? 'object-position' : 'auto',
                      }}
                      draggable={false}
                    />

                    {/* Reposition overlay */}
                    {isRepositioning && (
                      <div
                        className="absolute inset-0 bg-black/30 cursor-grab active:cursor-grabbing flex items-center justify-center select-none"
                        onMouseDown={handleDrag}
                      >
                        <div className="text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-full pointer-events-none">
                          Drag to reposition
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="absolute bottom-3 right-3 flex gap-2">
                      {isRepositioning ? (
                        <>
                          <button
                            onClick={cancelReposition}
                            className="px-3 py-1.5 bg-white text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 shadow"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={savePosition}
                            className="px-3 py-1.5 bg-[#5f6651] text-white text-sm font-medium rounded-lg hover:bg-[#4a5040] shadow"
                          >
                            Save Position
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setTempPosition(headerPosition)
                              setIsRepositioning(true)
                            }}
                            className="px-3 py-1.5 bg-white/90 text-gray-700 text-sm font-medium rounded-lg hover:bg-white shadow"
                          >
                            Reposition
                          </button>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 bg-white/90 text-gray-700 text-sm font-medium rounded-lg hover:bg-white shadow"
                          >
                            Change Photo
                          </button>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-full flex flex-col items-center justify-center text-gray-500 hover:bg-gray-300 transition-colors"
                  >
                    <span className="text-3xl mb-2">📷</span>
                    <span className="text-sm font-medium">Add Cover Photo</span>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleHeaderImageUpload}
                  className="hidden"
                />
              </div>

              {/* Course */}
              <div className="p-8 bg-white">
                {/* Clubhouse Info */}
                <div className="mb-8 pb-6 border-b border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg bg-[#5f6651] text-white flex items-center justify-center font-bold text-2xl flex-shrink-0">
                      {mockUser.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900">{settings.name}</h2>
                      <p className="text-sm text-gray-600 mt-0.5">{settings.tagline}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                        <span>🦅 Eagle</span>
                        <span>⭐ {mockUser.rating}</span>
                        <span>{mockUser.total_sales} sales</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Layout */}
                <div
                  ref={courseRef}
                  className="rounded-2xl h-96 relative overflow-hidden cursor-default"
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  style={{
                    backgroundImage: `url(${terrainStyles[settings.terrain].background})`,
                    backgroundColor: settings.accent_color,
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {/* Time of Day Overlay */}
                  <div
                    className={`absolute inset-0 ${timeOverlays[settings.time_of_day]} pointer-events-none`}
                  />

                  {/* Product Pins */}
                  {listings.map((listing) => {
                    const isFeatured = settings.featured_product_id === listing.id
                    const isDraggingThis = dragging === listing.id

                    return (
                      <div
                        key={listing.id}
                        className={`absolute cursor-grab active:cursor-grabbing transition-transform ${
                          isDraggingThis ? 'scale-110 z-10' : 'hover:scale-105'
                        }`}
                        style={{
                          left: `${listing.position.x}%`,
                          top: `${listing.position.y}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                        onMouseDown={(e) => handleDragPin(e, listing)}
                      >
                        {/* Product image thumbnail */}
                        {listing.img ? (
                          <img src={listing.img} alt={listing.title} className="w-14 h-14 object-contain" />
                        ) : (
                          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-lg bg-white flex items-center justify-center text-lg">
                            🏌️
                          </div>
                        )}

                        {/* Price label */}
                        {settings.product_labels !== 'hover_only' && (
                          <div className="text-xs font-semibold text-white bg-black/70 rounded-full px-2 py-0.5 mt-1 whitespace-nowrap text-center">
                            {settings.product_labels === 'title_only'
                              ? listing.title.substring(0, 15) +
                                (listing.title.length > 15 ? '...' : '')
                              : settings.product_labels === 'price_only'
                                ? formatPrice(listing.price)
                                : `${formatPrice(listing.price)}`}
                          </div>
                        )}

                        {/* Featured badge */}
                        {isFeatured && (
                          <div className="text-xs text-white bg-amber-500 rounded-full px-2 py-0.5 mt-1 whitespace-nowrap font-semibold text-center">
                            ⭐ Featured
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {/* Helper text */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-white/80 bg-black/40 px-3 py-1 rounded-full pointer-events-none">
                    Drag pins to reposition
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
