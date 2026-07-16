import { useState } from 'react' // used in RoomRow
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Wifi, BedDouble, Users, Maximize2 } from 'lucide-react'

const ROOMS = [
  {
    id: '1', slug: 'deluxe-garden-room', roomName: 'Premium Villa Type 1BH',
    roomType: 'deluxe', price: 4999, maxGuests: 2, size: '280 sq. ft.', bedType: 'Queen Size Bed',
    description: 'Wake up to lush garden views from your private balcony. Handcrafted premium furniture, en-suite bathroom with rain shower, and a serene outdoor seating nook make this room the perfect retreat for couples seeking comfort amidst nature.',
    images: ['/gallery-room-3.jpg', '/gallery-room-4.jpg'],
  },
  {
    id: '2', slug: 'premium-valley-suite', roomName: 'Premium Villa Type 1BH',
    roomType: 'suite', price: 7999, maxGuests: 2, size: '420 sq. ft.', bedType: 'King Size Bed',
    description: 'Sweeping valley panoramas greet you from your private balcony. The suite features a separate living area, jacuzzi bathtub, and premium in-room dining service — an indulgent stay for those who appreciate the finer details.',
    images: ['/gallery-room-1.jpg', '/gallery-room-2.jpg'],
  },
  {
    id: '3', slug: 'luxury-pool-villa', roomName: 'Premium Villa Type 1BH',
    roomType: 'villa', price: 15999, maxGuests: 4, size: '800 sq. ft.', bedType: 'King Size Bed',
    description: 'Your own private plunge pool, outdoor dining cabana, and a dedicated butler service. Designed for those who seek the pinnacle of resort luxury, the villa immerses you in nature while surrounding you with world-class comfort.',
    images: ['/gallery-room-7.jpg', '/gallery-room-8.jpg'],
  },
  {
    id: '4', slug: 'forest-retreat-cottage', roomName: 'Premium Villa Type 1BH',
    roomType: 'cottage', price: 6499, maxGuests: 2, size: '320 sq. ft.', bedType: 'Queen Size Bed',
    description: 'Rustic luxury nestled deep in the forest. Wood-finished interiors, an outdoor rain shower, hammock under the canopy, and a private bonfire pit offer an authentic hill retreat experience unlike any other.',
    images: ['/gallery-room-5.jpg', '/gallery-room-6.jpg'],
  },
  {
    id: '5', slug: 'horizon-penthouse', roomName: 'Premium Villa Type 1BH',
    roomType: 'penthouse', price: 22999, maxGuests: 6, size: '1200 sq. ft.', bedType: 'King Size Bed',
    description: 'A rooftop penthouse with 360° panoramic views of the Yercaud hills. Features a private terrace, chef-on-call service, and a premium entertainment system — ideal for families or groups seeking an unforgettable hilltop experience.',
    images: ['/gallery-room-4.jpg', '/gallery-room-3.jpg'],
  },
  {
    id: '6', slug: 'romance-suite', roomName: 'Premium Villa Type 1BH',
    roomType: 'romance', price: 9999, maxGuests: 2, size: '380 sq. ft.', bedType: 'King Size Bed',
    description: 'Crafted for couples in love. Arrive to a champagne welcome, rose petal bath, and candle-lit dinner setup. The private terrace with valley views makes every evening magical — the perfect stay for anniversaries and honeymoons.',
    images: ['/gallery-room-7.jpg', '/gallery-room-1.jpg'],
  },
]


const GUEST_WORDS: Record<number, string> = { 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six' }

function RoomRow({ room, index }: { room: typeof ROOMS[0]; index: number }) {
  const [imgIdx, setImgIdx] = useState(0)
  const isEven = index % 2 === 0
  const total = room.images.length
  const prev = () => setImgIdx(i => (i - 1 + total) % total)
  const next = () => setImgIdx(i => (i + 1) % total)

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className="grid lg:grid-cols-2 items-center gap-10 lg:gap-16 py-14 border-b border-gray-100 last:border-0"
    >
      {/* Image carousel */}
      <div className={isEven ? '' : 'lg:order-2'}>
        <div className="relative overflow-hidden" style={{ borderRadius: 16, aspectRatio: '4/3' }}>
          <img
            src={room.images[imgIdx]}
            alt={room.roomName}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white shadow flex items-center justify-center transition-colors"
              >
                <ChevronLeft size={16} className="text-navy-700" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white shadow flex items-center justify-center transition-colors"
              >
                <ChevronRight size={16} className="text-navy-700" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {room.images.map((_, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? 'bg-white w-4' : 'bg-white/50'}`} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={isEven ? '' : 'lg:order-1'}>
        <p className="text-gold-500 text-[10px] tracking-[3px] uppercase mb-2">{room.roomType}</p>
        <h2 className="font-serif text-navy-800 mb-4" style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 700 }}>
          {room.roomName}
        </h2>
        <p className="text-gray-600 leading-relaxed mb-7" style={{ fontSize: '14px' }}>
          {room.description}
        </p>

        {/* Specs grid */}
        <div className="grid grid-cols-2 gap-x-6 mb-8">
          {[
            { icon: Maximize2, label: room.size },
            { icon: Wifi,      label: 'Complimentary Wi-Fi' },
            { icon: BedDouble, label: room.bedType },
            { icon: Users,     label: `Up to ${GUEST_WORDS[room.maxGuests] || room.maxGuests} Guests` },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 border-b border-gray-200 py-3">
              <Icon size={15} className="text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-600">{label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-8">
          <Link
            to={`/rooms/${room.slug}`}
            className="bg-gold-400 hover:bg-gold-300 text-white font-medium transition-colors"
            style={{ borderRadius: 8, padding: '12px 36px', fontSize: '14px' }}
          >
            Explore
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function RoomsPage() {
  return (
    <div className="min-h-screen bg-white pt-28">

      {/* Hero banner */}
      <div className="relative h-64 md:h-[400px] overflow-hidden">
        <img
          src="/banner.jpg"
          alt="Our Rooms"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-navy-900/55" />
        <div className="absolute top-6 left-0 right-0 max-w-7xl mx-auto px-6">
          <p className="text-sm text-white/70">
            <Link to="/" className="font-medium text-white/80 hover:text-white transition-colors">Home</Link>
            <span className="mx-2 text-white/50">&gt;</span>
            <span>Rooms</span>
          </p>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-gold-400 text-[10px] tracking-[4px] uppercase mb-3">Sky Stay Resorts, Yercaud</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-white font-bold mb-3" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Our Rooms & Villas
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/75 text-sm max-w-md leading-relaxed">
            From garden-view deluxe rooms to private pool villas — find the perfect space for your stay.
          </motion.p>
        </div>
      </div>

      {/* Room list */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {ROOMS.map((room, i) => <RoomRow key={room.id} room={room} index={i} />)}
      </div>
    </div>
  )
}
