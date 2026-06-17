import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, Star, Users, Filter } from 'lucide-react'
import { roomsService } from '@/services/api'

const ROOM_TYPES = ['all','deluxe','suite','villa','cottage','penthouse','romance']

const ROOMS = [
  { id:'1', slug:'deluxe-garden-room',     roomName:'Deluxe Garden Room',     roomType:'deluxe',    price:4999,  maxGuests:2, description:'Wake up to lush garden views. Premium handcrafted furniture, en-suite bathroom with rain shower, and a private balcony.', amenities:['Free WiFi','AC','Smart TV','Minibar','Safe','Hot water','Garden balcony'], images:[{url:'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80'}] },
  { id:'2', slug:'premium-valley-suite',   roomName:'Premium Valley Suite',   roomType:'suite',     price:7999,  maxGuests:2, description:'Sweeping valley panoramas from your private balcony. Separate living area, jacuzzi, and premium in-room dining service.', amenities:['Free WiFi','AC','Jacuzzi','Lounge area','Smart TV','Minibar','Valley view'], images:[{url:'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80'}] },
  { id:'3', slug:'luxury-pool-villa',      roomName:'Luxury Pool Villa',      roomType:'villa',     price:15999, maxGuests:4, description:'Your own private plunge pool, outdoor dining cabana, and dedicated butler service. The pinnacle of resort luxury.', amenities:['Private pool','Butler service','Outdoor dining','Free WiFi','AC','Full kitchen'], images:[{url:'https://images.unsplash.com/photo-1602343168117-bb8ced3e3204?w=600&q=80'}] },
  { id:'4', slug:'forest-retreat-cottage', roomName:'Forest Retreat Cottage', roomType:'cottage',   price:6499,  maxGuests:2, description:'Rustic luxury nestled in the forest. Wood-finished interiors, outdoor shower, hammock, and private bonfire pit.', amenities:['Free WiFi','AC','Outdoor shower','Bonfire pit','Forest view','Hammock'], images:[{url:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80'}] },
  { id:'5', slug:'horizon-penthouse',      roomName:'Horizon Penthouse',      roomType:'penthouse', price:22999, maxGuests:6, description:'Rooftop penthouse with 360° views, private terrace, chef service on request, and premium entertainment system.', amenities:['360° views','Private terrace','Chef service','Free WiFi','AC','6 guests'], images:[{url:'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80'}] },
  { id:'6', slug:'romance-suite',          roomName:'Romance Suite',          roomType:'romance',   price:9999,  maxGuests:2, description:'Designed for couples. Floral decor, rose petal bath, candle-lit dinner setup, private terrace, and champagne on arrival.', amenities:['Rose bath','Champagne','Private terrace','Couple spa','Free WiFi','AC'], images:[{url:'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80'}] },
]

function RoomCard({ room, index }: { room: typeof ROOMS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="bg-white border border-gray-200 rounded-sm overflow-hidden group hover:shadow-lg transition-shadow"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={room.images[0]?.url}
          alt={room.roomName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-navy-700/90 text-gold-400 text-[10px] tracking-[1px] px-2.5 py-1 rounded-sm capitalize">
          {room.roomType}
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-medium text-navy-700 text-lg mb-1">{room.roomName}</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{room.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {room.amenities.slice(0, 4).map(a => (
            <span key={a} className="text-[10px] bg-cream-100 text-navy-700 px-2 py-0.5 rounded-sm">{a}</span>
          ))}
          {room.amenities.length > 4 && (
            <span className="text-[10px] text-gray-400">+{room.amenities.length - 4} more</span>
          )}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-2xl font-medium text-navy-700">₹{room.price.toLocaleString('en-IN')}</span>
            <span className="text-xs text-gray-400 ml-1">/ night</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Users size={12} /> {room.maxGuests}
            </span>
            <Link
              to={`/rooms/${room.slug}`}
              className="bg-gold-400 hover:bg-gold-300 text-navy-800 text-xs tracking-[1px] px-4 py-2 rounded-sm transition-colors"
            >
              VIEW DETAILS
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function RoomsPage() {
  const [activeType, setActiveType] = useState('all')

  const { data } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomsService.getAll().then(r => r.data),
    placeholderData: { data: ROOMS },
  })

  const rooms = data?.data || ROOMS
  const filtered = activeType === 'all' ? rooms : rooms.filter((r: any) => r.roomType === activeType)

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      {/* Header */}
      <div className="bg-navy-700 py-16 text-center">
        <p className="text-gold-400 text-[11px] tracking-[5px] mb-3">ACCOMMODATIONS</p>
        <h1 className="font-serif text-4xl text-white mb-3">Our Rooms & Villas</h1>
        <p className="text-navy-300 text-sm max-w-xl mx-auto">
          Each space is thoughtfully crafted with locally-sourced materials, premium furnishings, and breathtaking views of Tamil Nadu's natural beauty.
        </p>
      </div>

      {/* Filters */}
      <div className="sticky top-20 z-30 bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-gray-400" />
          {ROOM_TYPES.map(type => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-1.5 rounded-sm text-xs tracking-[1px] capitalize transition-colors ${
                activeType === type
                  ? 'bg-navy-700 text-gold-400'
                  : 'border border-gray-200 text-gray-600 hover:border-gold-400 hover:text-gold-500'
              }`}
            >
              {type === 'all' ? 'ALL ROOMS' : type}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400">{filtered.length} rooms</span>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((room: any, i: number) => (
            <RoomCard key={room.id} room={room} index={i} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">No rooms found for this filter.</div>
        )}
      </div>
    </div>
  )
}
