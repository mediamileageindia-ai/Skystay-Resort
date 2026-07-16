import { motion } from 'framer-motion'
import { Utensils, Dumbbell, Shield, Car, CheckCircle, ChevronRight, Baby } from 'lucide-react'
import { Link } from 'react-router-dom'

const FALLBACK_SECTIONS = [
  {
    title: 'Dining',
    icon: Utensils,
    image: '/gallery-dining-1.jpg',
    tagline: 'Flavours crafted for the hills',
    items: [
      { name: 'Restaurant',  desc: 'Multi-cuisine fine dining with panoramic valley views. Open 7 AM – 11 PM daily with live counters and à la carte menu.' },
      { name: '24-Hour Room Service',   desc: 'Full restaurant menu delivered to your room at any hour. Special dietary menus available on request.' },
      { name: 'Breakfast Terrace',      desc: 'Elaborate buffet breakfast with live egg station, South Indian, Continental and fresh fruit counters overlooking the garden.' },
    ],
  },
  {
    title: 'Recreation',
    icon: Dumbbell,
    image: '/gallery-hall-2.jpg',
    tagline: 'Adventure and leisure at every turn',
    items: [
      { name: 'Meeting Hall',      desc: 'Fully equipped conference and events hall ideal for corporate meetings, family gatherings, and private celebrations.' },
      { name: 'Nature Trails',     desc: '3 km guided forest walk with birdwatching spots, endemic flora identification boards, and scenic rest points.' },
      { name: 'Bonfire Evenings',  desc: 'Curated evening bonfires with stargazing, traditional storytelling, marshmallow roasting, and folk music performances.' },
    ],
  },
  {
    title: 'Services',
    icon: Shield,
    image: '/gallery-services.jpg',
    tagline: 'Every detail taken care of',
    items: [
      { name: '24/7 Concierge',     desc: 'Dedicated concierge team for sightseeing arrangements, taxi bookings, event planning, and local recommendations.' },
      { name: 'Airport Transfers',  desc: 'Comfortable AC vehicle transfers from Salem, Coimbatore, or Madurai airports. Pre-booking required.' },
      { name: 'Valet & Parking',    desc: 'Secure covered parking for up to 40 vehicles with full valet service. EV charging points available.' },
      { name: 'Kids Club',          desc: 'Supervised indoor and outdoor activities for children aged 5–12 including art, games, and nature scavenger hunts.' },
    ],
  },
  {
    title: 'Transport',
    icon: Car,
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80',
    tagline: 'Explore Yercaud with ease',
    items: [
      { name: 'Resort Shuttle',         desc: 'Complimentary shuttle service to Yercaud Lake, Lady\'s Seat, and Anna Park twice daily.' },
      { name: 'Vehicle Hire',           desc: 'Hire our resort jeeps or sedans with driver for full-day sightseeing across Yercaud and nearby villages.' },
      { name: 'Bicycle Rentals',        desc: 'Explore the scenic hill roads on our well-maintained cycles. Helmets and route maps provided.' },
      { name: 'Plantation Tour Pickup', desc: 'Dedicated vehicle pickup for our partner coffee and spice plantation tours. Bookable at the concierge.' },
    ],
  },
]

const stats = [
  { value: '6', label: 'Dining Venues' },
  { value: '24/7', label: 'Concierge' },
  { value: '3 km', label: 'Nature Trail' },
  { value: '40+', label: 'Room Types' },
  { value: '100%', label: 'Eco Friendly' },
]

export default function AmenitiesPage() {

  return (
    <div className="min-h-screen bg-white pt-28">

      {/* Hero banner */}
      <div className="relative h-64 md:h-[400px] overflow-hidden">
        <img
          src="/banner.jpg"
          alt="Amenities"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-navy-900/55" />
        <div className="absolute top-6 left-0 right-0 max-w-7xl mx-auto px-6">
          <p className="text-sm text-white/70">
            <Link to="/" className="font-medium text-white/80 hover:text-white transition-colors">Home</Link>
            <span className="mx-2 text-white/50">&gt;</span>
            <span>Amenities</span>
          </p>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-gold-400 text-[10px] tracking-[4px] uppercase mb-3">Sky Stay Resorts, Yercaud</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-white font-bold mb-3" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            World-Class Amenities
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/75 text-sm max-w-md leading-relaxed">
            Every facility crafted for an extraordinary stay — from infinity pools to gourmet dining.
          </motion.p>
        </div>
      </div>

      {/* Hero — 3-column property-style layout */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16 items-start">

          {/* Left — Label + Heading + CTA */}
          <div>
            <p className="text-gold-500 text-[11px] tracking-[4px] font-sans mb-4">[ SKY STAY RESORTS ]</p>
            <h1 className="font-serif text-navy-800 leading-tight mb-8" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 700 }}>
              World-Class<br />Amenities
            </h1>
            <a
              href="https://wa.me/919003010567?text=Hello%20Sky%20Stay%20Resorts%2C%20I%20would%20like%20to%20book%20a%20room."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gold-500 hover:bg-gold-400 text-white font-sans uppercase transition-colors"
              style={{ fontSize: '11px', letterSpacing: '0.22em', padding: '14px 36px', fontWeight: 600 }}
            >
              BOOK YOUR STAY
            </a>
          </div>

          {/* Center — About text */}
          <div>
            <p className="font-sans text-[11px] tracking-[3px] text-gray-400 mb-5">ABOUT THE RESORT</p>
            <p className="text-gray-600 leading-relaxed mb-5" style={{ fontSize: '14px' }}>
              Sky Stay Resorts is nestled in the misty hills of Yercaud, Tamil Nadu. Every facility here is designed with care — from the infinity pool overlooking the valley to our multi-cuisine restaurant with panoramic views.
            </p>
            <p className="text-gray-600 leading-relaxed" style={{ fontSize: '14px' }}>
              Whether you seek adventure in the forest trails, relaxation by the pool, or a quiet evening by the bonfire — our amenities ensure every moment of your stay is extraordinary.
            </p>
          </div>

          {/* Right — Highlights list */}
          <div>
            <p className="font-sans text-[11px] tracking-[3px] text-gray-400 mb-5">HIGHLIGHTS</p>
            <ul className="space-y-3">
              {[
                { label: 'Meeting Hall',                 href: '#recreation' },
                { label: 'Restaurant',                  href: '#dining' },
                { label: '24/7 Concierge & Room Service', href: '#services' },
                { label: 'High-Speed Fibre Wi-Fi',      href: '#connectivity' },
                { label: 'Nature Trails & Bonfire',     href: '#recreation' },
                { label: 'Resort Shuttle & Transfers',  href: '#transport' },
              ].map(item => (
                <li key={item.label}>
                  <a href={item.href}
                    className="flex items-center justify-between text-navy-700 hover:text-gold-500 transition-colors border-b border-gray-100 pb-2 group"
                    style={{ fontSize: '13px' }}>
                    <span>{item.label}</span>
                    <ChevronRight size={14} className="text-gold-400 group-hover:translate-x-1 transition-transform" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Icon row */}
        <div className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Utensils,  label: 'Fine Dining',       sub: 'Multi-cuisine restaurant' },
              { icon: Baby,      label: 'Kids Play Area',    sub: 'Safe & fun zone for children' },
              { icon: Shield,    label: 'Premium Services',  sub: 'Concierge & transfers' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 border border-gray-200 flex items-center justify-center rounded-sm">
                  <Icon size={22} className="text-gold-500" strokeWidth={1.5} />
                </div>
                <div className="w-8 h-px bg-gold-400" />
                <p className="font-sans text-navy-700 text-sm font-medium">{label}</p>
                <p className="font-sans text-gray-400 text-xs">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-navy-900 border-b border-navy-800">
        <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-3 md:grid-cols-5 gap-4 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <p className="text-2xl font-medium text-gold-400">{s.value}</p>
              <p className="text-[10px] tracking-[1.5px] text-navy-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stay section */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gold-500 text-[10px] tracking-[3px] uppercase mb-2">LUXURY ACCOMMODATION</p>
          <h2 className="font-serif text-2xl text-navy-700 mb-2">Stay</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-xl leading-relaxed">
            Our thoughtfully designed rooms and villas blend comfort with the natural beauty of Yercaud's misty hills.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              '/gallery-room-1.jpg',
              '/gallery-room-2.jpg',
              '/gallery-room-3.jpg',
              '/gallery-room-4.jpg',
              '/gallery-room-5.jpg',
              '/gallery-room-6.jpg',
              '/gallery-room-7.jpg',
              '/gallery-room-8.jpg',
            ].map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="relative overflow-hidden rounded-xl group"
                style={{ aspectRatio: '4/3' }}
              >
                <img
                  src={src}
                  alt={`Premium Villa Type 1BH ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                  <p className="text-white text-[11px] font-medium leading-tight">Premium Villa Type 1BH</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Amenity sections */}
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
        {FALLBACK_SECTIONS.map((section, si) => {
          const Icon = section.icon
          const isEven = si % 2 === 0
          return (
            <motion.div
              id={section.title.toLowerCase().replace(/[^a-z]/g, '')}
              key={section.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative bg-cream-50 border border-gray-100 rounded-3xl overflow-visible shadow-sm"
            >
              <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-6 lg:gap-0`}>

                {/* Circle image — overflows the card */}
                <div className="flex-shrink-0 flex items-center justify-center px-8 lg:px-12">
                  <div className="relative" style={{ marginTop: '-36px', marginBottom: '-36px' }}>
                    <div className="w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden shadow-2xl"
                      style={{ border: '6px solid white' }}>
                      <img
                        src={section.image}
                        alt={section.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Icon badge */}
                    <div className="absolute bottom-12 right-0 w-11 h-11 rounded-full bg-gold-400 flex items-center justify-center shadow-lg"
                      style={{ border: '3px solid white' }}>
                      <Icon size={18} className="text-white" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-8 lg:p-12">
                  <p className="text-gold-500 text-[10px] tracking-[3px] mb-2">{section.tagline.toUpperCase()}</p>
                  <h2 className="font-serif text-2xl text-navy-700 mb-6">{section.title}</h2>
                  <div className="space-y-4">
                    {section.items.map((item: { name: string; desc: string }) => (
                      <div key={item.name} className="flex gap-3">
                        <CheckCircle size={16} className="text-gold-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-navy-700">{item.name}</p>
                          <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )
        })}
      </div>

      {/* CTA */}
      <div className="bg-navy-700 py-16 text-center">
        <p className="text-gold-400 text-[11px] tracking-[4px] mb-3">EXPERIENCE IT ALL</p>
        <h2 className="font-serif text-2xl text-white mb-3">Ready for an Extraordinary Stay?</h2>
        <p className="text-navy-300 text-sm mb-6 max-w-md mx-auto">
          All amenities are complimentary or available at nominal charges for in-house guests.
        </p>
        <a
          href="https://wa.me/919003010567?text=Hello%20Sky%20Stay%20Resorts%2C%20I%20would%20like%20to%20book%20a%20room."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-300 text-navy-800 font-semibold text-xs tracking-[2px] px-8 py-3 rounded-sm transition-colors"
        >
          BOOK YOUR STAY <ChevronRight size={14} />
        </a>
      </div>
    </div>
  )
}
