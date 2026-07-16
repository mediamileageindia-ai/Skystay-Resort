import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, ChevronLeft, ChevronRight, Star, Check, Share2, Wifi, BedDouble, Maximize2, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

const ROOMS: Record<string, {
  id: string; roomName: string; roomType: string; price: number;
  maxGuests: number; size: string; bedType: string; description: string;
  amenities: string[]; images: string[];
}> = {
  'deluxe-garden-room': {
    id: '1', roomName: 'Premium Villa Type 1BH', roomType: 'Deluxe', price: 4999, maxGuests: 2,
    size: '280 sq. ft.', bedType: 'Queen Size Bed',
    description: 'Wake up to lush garden views from your private balcony. Handcrafted premium furniture, en-suite bathroom with rain shower, and a serene outdoor seating nook make this room the perfect retreat for couples seeking comfort amidst nature.',
    amenities: ['Free Wi-Fi (100 Mbps)', 'Air Conditioning', '55" Smart TV', 'Minibar', 'Electronic Safe', 'Rain Shower', 'Garden View Balcony', 'Daily Housekeeping', 'Room Service 24/7', 'Welcome Drink'],
    images: ['/gallery-room-3.jpg', '/gallery-room-4.jpg'],
  },
  'premium-valley-suite': {
    id: '2', roomName: 'Premium Villa Type 1BH', roomType: 'Suite', price: 7999, maxGuests: 2,
    size: '420 sq. ft.', bedType: 'King Size Bed',
    description: 'Sweeping valley panoramas greet you from your private balcony. The suite features a separate living area, jacuzzi bathtub, and premium in-room dining service — an indulgent stay for those who appreciate the finer details.',
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Jacuzzi Bathtub', 'Separate Lounge', '65" Smart TV', 'Minibar', 'Valley View Balcony', 'Bathrobe & Slippers', 'In-Room Dining', 'Daily Fruit Basket'],
    images: ['/gallery-room-1.jpg', '/gallery-room-2.jpg'],
  },
  'luxury-pool-villa': {
    id: '3', roomName: 'Premium Villa Type 1BH', roomType: 'Villa', price: 15999, maxGuests: 4,
    size: '800 sq. ft.', bedType: 'King Size Bed',
    description: 'Your own private plunge pool, outdoor dining cabana, and a dedicated butler service. Designed for those who seek the pinnacle of resort luxury, the villa immerses you in nature while surrounding you with world-class comfort.',
    amenities: ['Private Plunge Pool', 'Dedicated Butler', 'Outdoor Dining Cabana', 'Full Kitchen', 'Free Wi-Fi', 'Air Conditioning', '2 Bedrooms', 'BBQ Grill', 'Infinity Bath', 'Premium Bar'],
    images: ['/gallery-room-7.jpg', '/gallery-room-8.jpg'],
  },
  'forest-retreat-cottage': {
    id: '4', roomName: 'Premium Villa Type 1BH', roomType: 'Cottage', price: 6499, maxGuests: 2,
    size: '320 sq. ft.', bedType: 'Queen Size Bed',
    description: 'Rustic luxury nestled deep in the forest. Wood-finished interiors, an outdoor rain shower, hammock under the canopy, and a private bonfire pit offer an authentic hill retreat experience unlike any other.',
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'Outdoor Rain Shower', 'Private Bonfire Pit', 'Hammock', 'Forest View', 'Guided Nature Trail', 'Organic Breakfast', 'Bird Watching Kit', 'No TV (by design)'],
    images: ['/gallery-room-5.jpg', '/gallery-room-6.jpg'],
  },
  'horizon-penthouse': {
    id: '5', roomName: 'Premium Villa Type 1BH', roomType: 'Penthouse', price: 22999, maxGuests: 6,
    size: '1200 sq. ft.', bedType: 'King Size Bed',
    description: 'A rooftop penthouse with 360° panoramic views of the Yercaud hills. Features a private terrace, chef-on-call service, and a premium entertainment system — ideal for families or groups seeking an unforgettable hilltop experience.',
    amenities: ['360° Panoramic Views', 'Private Terrace', 'Personal Chef (on request)', '2 Master Bedrooms', 'Home Theatre', 'Game Room', 'Free Wi-Fi', 'Air Conditioning', 'Infinity Bath', 'Airport Transfer'],
    images: ['/gallery-room-4.jpg', '/gallery-room-3.jpg'],
  },
  'romance-suite': {
    id: '6', roomName: 'Premium Villa Type 1BH', roomType: 'Romance', price: 9999, maxGuests: 2,
    size: '380 sq. ft.', bedType: 'King Size Bed',
    description: 'Crafted for couples in love. Arrive to a champagne welcome, rose petal bath, and candle-lit dinner setup. The private terrace with valley views makes every evening magical — the perfect stay for anniversaries and honeymoons.',
    amenities: ['Rose Petal Bath', 'Champagne on Arrival', 'Candle-lit Dinner Setup', 'Private Terrace', 'Couple Spa (1 session)', 'Flower Decoration', 'Free Wi-Fi', 'Air Conditioning', 'King Bed', 'Turn-down Service'],
    images: ['/gallery-room-7.jpg', '/gallery-room-1.jpg'],
  },
}

export default function RoomDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [mainImg, setMainImg] = useState(0)

  const room = slug ? ROOMS[slug] : null

  if (!room) return (
    <div className="min-h-screen flex items-center justify-center pt-28">
      <div className="text-center">
        <p className="text-gray-500 mb-4">Room not found.</p>
        <button onClick={() => navigate('/rooms')} className="text-gold-500 text-sm">← Back to rooms</button>
      </div>
    </div>
  )

  const total = room.images.length

  return (
    <div className="min-h-screen bg-white pt-28">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Breadcrumb */}
        <p className="text-sm text-gray-500 mb-6">
          <Link to="/" className="font-medium text-gray-700 hover:text-navy-700 transition-colors">Home</Link>
          <span className="mx-2 text-gray-400">&gt;</span>
          <Link to="/rooms" className="font-medium text-gray-700 hover:text-navy-700 transition-colors">Rooms</Link>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span>{room.roomName}</span>
        </p>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* Left col: gallery + details */}
          <div className="lg:col-span-2 space-y-8">

            {/* Gallery */}
            <div>
              <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: '16/9' }}>
                <motion.img
                  key={mainImg}
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={room.images[mainImg]}
                  alt={room.roomName}
                  className="w-full h-full object-cover"
                />
                {total > 1 && (
                  <>
                    <button
                      onClick={() => setMainImg(i => (i - 1 + total) % total)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white shadow flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft size={16} className="text-navy-700" />
                    </button>
                    <button
                      onClick={() => setMainImg(i => (i + 1) % total)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white shadow flex items-center justify-center transition-colors"
                    >
                      <ChevronRight size={16} className="text-navy-700" />
                    </button>
                  </>
                )}
              </div>
              {total > 1 && (
                <div className="flex gap-2 mt-2">
                  {room.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setMainImg(i)}
                      className={`flex-1 h-20 rounded-sm overflow-hidden border-2 transition-colors ${mainImg === i ? 'border-gold-400' : 'border-transparent'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Room header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gold-500 text-[10px] tracking-[3px] uppercase mb-1">{room.roomType}</p>
                <h1 className="font-serif text-navy-800 mb-2" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 700 }}>
                  {room.roomName}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} size={13} className="fill-gold-400 text-gold-400" />)}
                  </div>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Users size={12} /> Up to {room.maxGuests} guests
                  </span>
                </div>
              </div>
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!') }}
                className="p-2 border border-gray-200 text-gray-400 hover:border-gold-400 hover:text-gold-500 transition-colors rounded-sm"
              >
                <Share2 size={16} />
              </button>
            </div>

            {/* Quick specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Maximize2, label: 'Room Size',  value: room.size },
                { icon: BedDouble, label: 'Bed Type',   value: room.bedType },
                { icon: Users,     label: 'Max Guests', value: `${room.maxGuests} guests` },
                { icon: Wifi,      label: 'Wi-Fi',      value: 'Complimentary' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="border border-gray-100 rounded-sm p-4 text-center">
                  <Icon size={18} className="text-gold-400 mx-auto mb-2" strokeWidth={1.5} />
                  <p className="text-[10px] tracking-[1.5px] text-gray-400 uppercase mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-navy-700">{value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="border border-gray-100 rounded-sm p-6">
              <h2 className="font-serif text-navy-700 text-lg mb-3">About This Room</h2>
              <p className="text-gray-600 leading-relaxed" style={{ fontSize: '14px' }}>{room.description}</p>
            </div>

            {/* Amenities */}
            <div className="border border-gray-100 rounded-sm p-6">
              <h2 className="font-serif text-navy-700 text-lg mb-5">Room Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {room.amenities.map(a => (
                  <div key={a} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-gold-400/10 flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-gold-500" />
                    </div>
                    <span className="text-sm text-gray-600">{a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Policies */}
            <div className="border border-gray-100 rounded-sm p-6">
              <h2 className="font-serif text-navy-700 text-lg mb-5">
                <Shield size={16} className="inline mr-2 text-gold-400" />
                Policies
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  ['Check-in',     '2:00 PM onwards'],
                  ['Check-out',    'By 11:00 AM'],
                  ['Cancellation', 'Free up to 48 hrs prior'],
                  ['Payment',      'Full or 30% advance'],
                  ['Pets',         'Not allowed'],
                  ['Smoking',      'Designated areas only'],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3 border-b border-gray-50 pb-3">
                    <div className="w-1 bg-gold-400/30 rounded flex-shrink-0" />
                    <div>
                      <p className="text-[10px] tracking-[1.5px] text-gray-400 uppercase">{k}</p>
                      <p className="text-sm text-navy-700 mt-0.5">{v}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div>
            <div className="sticky top-28 space-y-4">

              {/* Book card */}
              <div className="border border-gray-200 rounded-sm p-6">
                <a
                  href="https://wa.me/919003010567?text=Hello%20Sky%20Stay%20Resorts%2C%20I%20would%20like%20to%20book%20the%20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gold-400 hover:bg-gold-300 text-navy-800 font-semibold text-xs tracking-[2px] py-3.5 rounded-sm flex items-center justify-center transition-colors mb-3"
                >
                  ENQUIRE ON WHATSAPP
                </a>
                <a
                  href="tel:+919003010567"
                  className="w-full border border-navy-700 text-navy-700 hover:bg-navy-700 hover:text-white text-xs tracking-[1.5px] py-3 rounded-sm flex items-center justify-center transition-colors"
                >
                  CALL US
                </a>
              </div>

              {/* Need help card */}
              <div className="bg-navy-900 rounded-sm p-6 text-center">
                <p className="text-gold-400 text-[10px] tracking-[3px] mb-2">NEED HELP?</p>
                <p className="text-navy-300 text-xs leading-relaxed mb-4">
                  Our team is available 24/7 to assist with reservations and special requests.
                </p>
                <Link to="/contact"
                  className="text-gold-400 text-xs tracking-[1px] hover:text-gold-300 transition-colors">
                  Contact Concierge →
                </Link>
              </div>

              {/* Back link */}
              <button
                onClick={() => navigate('/rooms')}
                className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-navy-700 transition-colors py-2"
              >
                <ChevronLeft size={14} /> Back to all rooms
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
