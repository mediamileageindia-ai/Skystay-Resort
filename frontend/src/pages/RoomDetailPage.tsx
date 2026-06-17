import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Users, ChevronLeft, Star, Check, Share2 } from 'lucide-react'
import { roomsService } from '@/services/api'
import toast from 'react-hot-toast'

const ROOMS: Record<string, any> = {
  'deluxe-garden-room': { id:'1', roomName:'Deluxe Garden Room', roomType:'deluxe', price:4999, maxGuests:2, description:'Wake up to lush garden views in our spacious Deluxe Garden Room. The room features premium handcrafted wooden furniture, a king-size bed with Egyptian cotton linens, and a private balcony that overlooks our manicured gardens. The en-suite bathroom is fitted with a rain shower and premium toiletries. Perfect for couples seeking a tranquil escape.', amenities:['Free WiFi (100 Mbps)','Air Conditioning','55" Smart TV','Minibar','Electronic Safe','Rain Shower','Garden View Balcony','Daily Housekeeping','Room Service 24/7','Welcome Drink'], images:['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80','https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80','https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80'] },
  'premium-valley-suite': { id:'2', roomName:'Premium Valley Suite', roomType:'suite', price:7999, maxGuests:2, description:'Experience sweeping valley panoramas from your private balcony in this luxurious suite. The Premium Valley Suite features a separate living area, a master bedroom with valley-facing king bed, and a private jacuzzi bath. An ideal choice for a romantic getaway or anniversary celebration.', amenities:['Free WiFi','AC','Jacuzzi','Separate lounge','65" Smart TV','Minibar','Valley view balcony','Bathrobe & slippers','In-room dining','Daily fruit basket'], images:['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80','https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80','https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80'] },
  'luxury-pool-villa': { id:'3', roomName:'Luxury Pool Villa', roomType:'villa', price:15999, maxGuests:4, description:'The pinnacle of resort luxury. Your own private plunge pool, outdoor dining cabana, full kitchen, and a dedicated butler who anticipates your every need. Wake up at sunrise and take a dip in your personal pool while watching the valley mist roll in. Ideal for families or groups seeking an exclusive experience.', amenities:['Private plunge pool','Dedicated butler','Outdoor dining cabana','Full kitchen','Free WiFi','AC','2 Bedrooms','BBQ grill','Infinity bath','Premium bar'], images:['https://images.unsplash.com/photo-1602343168117-bb8ced3e3204?w=800&q=80','https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80','https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80'] },
  'forest-retreat-cottage': { id:'4', roomName:'Forest Retreat Cottage', roomType:'cottage', price:6499, maxGuests:2, description:'Escape into nature without sacrificing comfort. The Forest Retreat Cottage is nestled among century-old trees, featuring rustic wood-finished interiors, a unique outdoor shower surrounded by ferns, a hammock on the porch, and a private bonfire pit for starlit evenings.', amenities:['Free WiFi','AC','Outdoor shower','Bonfire pit','Hammock','Forest view','Guided nature trail','Organic breakfast','Bird watching kit','No TV (by design)'], images:['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80','https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80','https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80'] },
  'horizon-penthouse': { id:'5', roomName:'Horizon Penthouse', roomType:'penthouse', price:22999, maxGuests:6, description:'Our crown jewel. The Horizon Penthouse occupies the entire top floor with 360° views of the valley, hills, and sky. Features a private terrace with sun loungers, an entertainment room, chef service on request, and a glass-sided infinity bath.', amenities:['360° panoramic views','Private terrace','Personal chef (on request)','2 master bedrooms','Home theatre','Game room','Free WiFi','AC','Infinity bath','Airport transfer'], images:['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80','https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80','https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80'] },
  'romance-suite': { id:'6', roomName:'Romance Suite', roomType:'romance', price:9999, maxGuests:2, description:'Designed exclusively for couples. Our Romance Suite features floral room decoration on arrival, a rose petal bath, a candle-lit private dinner setup on your personal terrace, and a bottle of premium champagne. Every detail is curated to create the perfect romantic experience.', amenities:['Rose petal bath','Champagne on arrival','Candle-lit dinner setup','Private terrace','Couple spa (1 session)','Flower decoration','Free WiFi','AC','King bed','Turn-down service'], images:['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80','https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80','https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80'] },
}

export default function RoomDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const { data: roomData } = useQuery({
    queryKey: ['room', slug],
    queryFn: () => roomsService.getBySlug(slug!).then(r => r.data),
    enabled: !!slug,
    placeholderData: slug ? { data: ROOMS[slug] } : undefined,
  })

  const room = roomData?.data || (slug ? ROOMS[slug] : null)

  if (!room) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center">
        <p className="text-gray-500 mb-4">Room not found.</p>
        <button onClick={() => navigate('/rooms')} className="text-gold-500 text-sm">← Back to rooms</button>
      </div>
    </div>
  )

  const [mainImg, setMainImg] = useState(0)

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Back */}
        <button onClick={() => navigate('/rooms')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-navy-700 mb-6">
          <ChevronLeft size={16} /> Back to all rooms
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: gallery + info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="space-y-2">
              <div className="rounded-sm overflow-hidden h-80 lg:h-96">
                <motion.img
                  key={mainImg}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  src={room.images[mainImg]}
                  alt={room.roomName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2">
                {room.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setMainImg(i)}
                    className={`flex-1 h-20 rounded-sm overflow-hidden border-2 transition-colors ${
                      mainImg === i ? 'border-gold-400' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] tracking-[3px] text-gold-500 capitalize">{room.roomType}</span>
                <h1 className="font-serif text-3xl text-navy-700 mt-1">{room.roomName}</h1>
                <div className="flex items-center gap-3 mt-2">
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
                className="p-2 rounded border border-gray-200 text-gray-500 hover:border-gold-400 hover:text-gold-500 transition-colors"
              >
                <Share2 size={16} />
              </button>
            </div>

            {/* Description */}
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <h2 className="text-sm font-medium text-navy-700 mb-3">About This Room</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{room.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <h2 className="text-sm font-medium text-navy-700 mb-4">Room Amenities</h2>
              <div className="grid grid-cols-2 gap-2.5">
                {room.amenities.map((a: string) => (
                  <div key={a} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check size={13} className="text-gold-400 flex-shrink-0" />
                    {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Policies */}
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <h2 className="text-sm font-medium text-navy-700 mb-4">Policies</h2>
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                {[['Check-in','2:00 PM'],['Check-out','11:00 AM'],['Cancellation','Free till 48 hrs before'],['Payment','Full or 30% advance'],['Pets','Not allowed'],['Smoking','Designated areas only']].map(([k,v]) => (
                  <div key={k}><span className="text-gray-400 text-xs">{k}</span><br/><span>{v}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contact sidebar */}
          <div>
            <div className="bg-navy-700 rounded-sm p-6 sticky top-24">
              <p className="text-[11px] tracking-[2px] text-gold-400 mb-1">STARTING FROM</p>
              <p className="text-3xl font-light text-white mb-1">₹{room.price.toLocaleString('en-IN')}</p>
              <p className="text-xs text-navy-400 mb-6">per night + taxes</p>
              <p className="text-sm text-navy-300 mb-6 leading-relaxed">
                Interested in this room? Contact us directly for availability and reservations.
              </p>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
                className="w-full bg-gold-400 hover:bg-gold-300 text-navy-800 font-medium text-xs tracking-[2px] py-3 rounded-sm flex items-center justify-center transition-colors mb-3">
                ENQUIRE ON WHATSAPP
              </a>
              <a href="tel:+919876543210"
                className="w-full border border-white/20 text-white text-xs tracking-[1px] py-2.5 rounded-sm flex items-center justify-center hover:border-white/40 transition-colors">
                CALL US
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Need useState import at top
import { useState } from 'react'
