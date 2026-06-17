import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, Star, Wifi, Wind, Utensils, Trees, Dumbbell, Car, Waves, Shield } from 'lucide-react'
import { roomsService, offersService, reviewsService } from '@/services/api'

// ---- AMENITIES ----
const amenities = [
  { icon: Wifi,      label: 'High-Speed WiFi',     desc: 'Fibre optic throughout' },
  { icon: Utensils,  label: 'Multi-Cuisine Restaurant', desc: 'South Indian & Continental' },
  { icon: Waves,     label: 'Infinity Pool',        desc: 'Valley-view heated pool' },
  { icon: Dumbbell,  label: 'Fitness Centre',       desc: '24/7 modern gym' },
  { icon: Trees,     label: 'Nature Trails',        desc: '3 km curated walk' },
  { icon: Car,       label: 'Free Parking',         desc: 'Secure valet parking' },
  { icon: Wind,      label: 'Spa & Wellness',       desc: 'Ayurvedic & Deep tissue' },
  { icon: Shield,    label: '24/7 Concierge',       desc: 'Round-the-clock assistance' },
]

// ---- FALLBACK DATA ----
const ROOMS = [
  { id:'1', slug:'deluxe-garden-room',    roomName:'Deluxe Garden Room',     price:4999,  description:'Wake up to lush garden views with premium handcrafted furniture and en-suite amenities.', images:[{ url:'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80', isPrimary:true }], maxGuests:2 },
  { id:'2', slug:'premium-valley-suite',  roomName:'Premium Valley Suite',   price:7999,  description:'Sweeping valley panoramas from your private balcony with jacuzzi and separate lounge.', images:[{ url:'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80', isPrimary:true }], maxGuests:2 },
  { id:'3', slug:'luxury-pool-villa',     roomName:'Luxury Pool Villa',      price:15999, description:'Private plunge pool, outdoor dining cabana, and dedicated butler service.', images:[{ url:'https://images.unsplash.com/photo-1602343168117-bb8ced3e3204?w=600&q=80', isPrimary:true }], maxGuests:4 },
  { id:'4', slug:'forest-retreat-cottage',roomName:'Forest Retreat Cottage', price:6499,  description:'Rustic luxury nestled in the forest with wood interiors, outdoor shower, and bonfire pit.', images:[{ url:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', isPrimary:true }], maxGuests:2 },
  { id:'5', slug:'horizon-penthouse',     roomName:'Horizon Penthouse',      price:22999, description:'Rooftop penthouse with 360° views, private terrace, and chef service on request.', images:[{ url:'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80', isPrimary:true }], maxGuests:6 },
  { id:'6', slug:'romance-suite',         roomName:'Romance Suite',          price:9999,  description:'Designed for couples — rose bath, candle-lit dinner setup and complimentary champagne.', images:[{ url:'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80', isPrimary:true }], maxGuests:2 },
]

const OFFERS = [
  { id:'1', title:'Weekend Getaway',   tag:'WEEKEND',     description:'Stay 2 nights, save big. Includes breakfast for 2 and welcome drinks.',    discountValue:20, discountType:'percentage' as const },
  { id:'2', title:'Early Bird 30',     tag:'EARLY BIRD',  description:'Book 30 days in advance and unlock our best-ever rates on all room types.', discountValue:30, discountType:'percentage' as const },
  { id:'3', title:'Honeymoon Special', tag:'HONEYMOON',   description:'Candle-lit dinner, rose bath, couple spa and a bottle of champagne.',       discountValue:2000, discountType:'fixed' as const },
]

const REVIEWS = [
  { name:'Priya Ramesh',   city:'Chennai',    rating:5, comment:'Absolutely magical! The valley views from our suite took our breath away. Staff was extremely warm and attentive.', date:'Dec 2025' },
  { name:'Arun Krishnan',  city:'Bangalore',  rating:5, comment:'Best anniversary gift to my wife. The romance suite was adorned beautifully. Hospitality is top-notch!', date:'Nov 2025' },
  { name:'Meena Sundar',   city:'Coimbatore', rating:5, comment:'The pool villa is worth every rupee. Woke up to absolute silence and nature. Will be back soon!', date:'Oct 2025' },
]

// ---- ROOM CARD ----
function RoomCard({ room }: { room: typeof ROOMS[0] }) {
  const img = room.images?.[0]?.url
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-sm overflow-hidden border border-gray-200 group hover:shadow-lg transition-shadow"
    >
      <div className="relative overflow-hidden h-52">
        {img
          ? <img src={img} alt={room.roomName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full bg-cream-200 flex items-center justify-center text-4xl">🏨</div>
        }
        <div className="absolute top-3 right-3 bg-navy-700/90 text-gold-400 text-xs px-2.5 py-1 rounded-sm">
          Up to {room.maxGuests} guests
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-medium text-navy-700 mb-1">{room.roomName}</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{room.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-medium text-navy-700">₹{room.price.toLocaleString('en-IN')}</span>
            <span className="text-xs text-gray-400 ml-1">/ night</span>
          </div>
          <Link
            to={`/rooms/${room.slug}`}
            className="flex items-center gap-1 text-xs tracking-[1px] text-gold-500 hover:text-gold-600 border border-gold-400/50 hover:border-gold-400 px-3 py-1.5 rounded-sm transition-colors"
          >
            VIEW ROOM <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

// ---- STAR RATING ----
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={13} className={i <= rating ? 'fill-gold-400 text-gold-400' : 'text-gray-300'} />
      ))}
    </div>
  )
}

// ============================================
// HOME PAGE
// ============================================
export default function HomePage() {
  const { data: roomsData }   = useQuery({ queryKey:['rooms'], queryFn:() => roomsService.getAll().then(r=>r.data), placeholderData:{ data: ROOMS } })
  const { data: offersData }  = useQuery({ queryKey:['offers'], queryFn:() => offersService.getAll().then(r=>r.data), placeholderData:{ data: OFFERS } })
  const rooms   = roomsData?.data   || ROOMS
  const offers  = offersData?.data  || OFFERS

  return (
    <div className="min-h-screen">

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1600&q=80"
            alt="Sky Stay Resorts"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-navy-900/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
          <div className="max-w-2xl mb-12">
            <motion.p
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
              className="text-gold-400 text-[11px] tracking-[5px] mb-4"
            >
              TAMIL NADU · EST. 2018
            </motion.p>
            <motion.h1
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
              className="font-serif text-5xl lg:text-6xl text-white font-light leading-tight mb-6"
            >
              Where Luxury<br />Meets <span className="text-gold-400">Nature</span>
            </motion.h1>
            <motion.p
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
              className="text-gray-300 text-lg leading-relaxed"
            >
              Nestled in the hills of Tamil Nadu, Sky Stay Resorts offers an unparalleled escape with breathtaking views, world-class amenities, and personalised service.
            </motion.p>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0,8,0] }} transition={{ repeat:Infinity, duration:1.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-px h-10 bg-white/30" />
          <span className="text-white/40 text-[10px] tracking-[3px]">EXPLORE</span>
        </motion.div>
      </section>

      {/* ===== ABOUT STRIP ===== */}
      <section className="bg-navy-700 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[['48+','Luxury Suites'],['4.8★','Guest Rating'],['84%','Occupancy'],['6+','Years of Excellence']].map(([n,l]) => (
              <div key={l}>
                <div className="text-3xl font-light text-gold-400 mb-1">{n}</div>
                <div className="text-[11px] tracking-[2px] text-navy-300">{l.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ROOMS ===== */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-gold-500 text-[11px] tracking-[4px] mb-3">ACCOMMODATIONS</p>
            <h2 className="font-serif text-3xl text-navy-700 mb-3">Our Rooms & Villas</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              Each space is thoughtfully designed with locally-sourced materials, premium furnishings, and breathtaking views.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.slice(0, 6).map((r: any) => <RoomCard key={r.id} room={r} />)}
          </div>
          <div className="text-center mt-10">
            <Link to="/rooms"
              className="inline-flex items-center gap-2 border border-navy-700 text-navy-700 hover:bg-navy-700 hover:text-white text-xs tracking-[2px] px-8 py-3 rounded-sm transition-colors">
              VIEW ALL ROOMS <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== AMENITIES ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-gold-500 text-[11px] tracking-[4px] mb-3">FACILITIES</p>
            <h2 className="font-serif text-3xl text-navy-700">World-Class Amenities</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {amenities.map(({ icon: Icon, label, desc }) => (
              <motion.div
                key={label}
                initial={{ opacity:0, y:16 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }}
                className="text-center p-5 rounded-sm border border-gray-100 hover:border-gold-400/50 hover:shadow-sm transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-cream-100 group-hover:bg-gold-50 flex items-center justify-center mx-auto mb-3 transition-colors">
                  <Icon size={20} className="text-navy-700 group-hover:text-gold-500 transition-colors" />
                </div>
                <h3 className="text-sm font-medium text-navy-700 mb-1">{label}</h3>
                <p className="text-xs text-gray-500">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OFFERS ===== */}
      <section className="py-20 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage:'repeating-linear-gradient(45deg,#c9a84c 0,#c9a84c 1px,transparent 0,transparent 50%)', backgroundSize:'32px 32px' }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-gold-400 text-[11px] tracking-[4px] mb-3">EXCLUSIVE</p>
            <h2 className="font-serif text-3xl text-white">Special Offers</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {offers.slice(0,3).map((o: any) => (
              <motion.div
                key={o.id}
                initial={{ opacity:0, y:16 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }}
                className="border border-gold-400/30 rounded-sm p-6 hover:border-gold-400/60 transition-colors"
              >
                <span className="text-[10px] tracking-[3px] text-gold-400 bg-gold-400/10 px-2 py-1 rounded-sm">
                  {o.tag}
                </span>
                <h3 className="text-lg font-medium text-white mt-3 mb-2">{o.title}</h3>
                <p className="text-navy-400 text-sm leading-relaxed mb-4">{o.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-medium text-gold-400">
                    {o.discountType === 'percentage' ? `${o.discountValue}% OFF` : `₹${o.discountValue} OFF`}
                  </span>
                  <Link to="/booking"
                    className="text-xs text-gold-400 border border-gold-400/50 hover:border-gold-400 px-3 py-1.5 rounded-sm transition-colors">
                    BOOK NOW
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/offers" className="text-gold-400 text-xs tracking-[2px] hover:text-gold-300 flex items-center gap-2 justify-center">
              VIEW ALL OFFERS <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-gold-500 text-[11px] tracking-[4px] mb-3">TESTIMONIALS</p>
            <h2 className="font-serif text-3xl text-navy-700">What Our Guests Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity:0, y:16 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-gray-200 rounded-sm p-6"
              >
                <Stars rating={r.rating} />
                <p className="text-gray-600 text-sm leading-relaxed mt-3 mb-5 italic">"{r.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-navy-700 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                    {r.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-700">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.city} · {r.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative py-24 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80"
          alt="Contact us"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy-900/70" />
        <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
          <p className="text-gold-400 text-[11px] tracking-[5px] mb-4">YOUR ESCAPE AWAITS</p>
          <h2 className="font-serif text-4xl text-white mb-4">Ready to Create Memories?</h2>
          <p className="text-gray-300 text-sm mb-8 leading-relaxed">
            Contact us directly for the best rates, complimentary breakfast, and personalised service.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/contact"
              className="bg-gold-400 hover:bg-gold-300 text-navy-800 font-medium text-xs tracking-[2px] px-8 py-3.5 rounded-sm transition-colors">
              CONTACT US
            </Link>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
              className="border border-white text-white hover:bg-white hover:text-navy-700 text-xs tracking-[2px] px-8 py-3.5 rounded-sm transition-colors">
              CHAT WITH US
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
