import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Utensils, Dumbbell, Shield,
  Star, Phone, Mail, MapPin, Send, ChevronLeft, ChevronRight, X
} from 'lucide-react'
import toast from 'react-hot-toast'

// ============================================
// AMENITIES PAGE
// ============================================
const AMENITY_SECTIONS = [
  {
    title: 'Dining',
    icon: Utensils,
    items: [
      { name: 'The Valley Restaurant', desc: 'Multi-cuisine fine dining with valley views. Open 7 AM–11 PM daily.' },
      { name: 'In-Room Dining', desc: 'Round-the-clock room service with our full restaurant menu.' },
      { name: 'Breakfast Terrace', desc: 'Buffet breakfast with live counters overlooking the garden.' },
    ]
  },
  {
    title: 'Recreation',
    icon: Dumbbell,
    items: [
      { name: 'Infinity Pool', desc: 'Heated infinity pool with valley views, open 6 AM–10 PM.' },
      { name: 'Fitness Centre', desc: 'Modern gym with Technogym equipment, open 24 hours.' },
      { name: 'Nature Trails', desc: '3 km curated forest walk with bird watching spots.' },
      { name: 'Bonfire Evenings', desc: 'Evening bonfires with stargazing and folklore storytelling.' },
    ]
  },
  {
    title: 'Services',
    icon: Shield,
    items: [
      { name: '24/7 Concierge', desc: 'Personal concierge for travel planning, sightseeing, and arrangements.' },
      { name: 'Airport Transfer', desc: 'Comfortable AC transfers from Madurai or Coimbatore airport.' },
      { name: 'Valet Parking', desc: 'Secure covered parking with valet service.' },
      { name: 'Kids Club', desc: 'Supervised activities for children aged 5–12 years.' },
    ]
  },
]

export function AmenitiesPage() {
  return (
    <div className="min-h-screen bg-cream-50 pt-28">
      <div className="bg-navy-700 py-16 text-center">
        <p className="text-gold-400 text-[11px] tracking-[5px] mb-3">FACILITIES</p>
        <h1 className="font-serif text-4xl text-white mb-3">World-Class Amenities</h1>
        <p className="text-navy-300 text-sm max-w-xl mx-auto">
          Everything you need for an extraordinary stay — from gourmet dining to rejuvenating wellness experiences.
        </p>
      </div>

      {/* Hero image */}
      <div className="h-64 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80" alt="Amenities" className="w-full h-full object-cover" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        {AMENITY_SECTIONS.map((section) => {
          const Icon = section.icon
          return (
            <div key={section.title}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center">
                  <Icon size={18} className="text-gold-400" />
                </div>
                <h2 className="font-serif text-2xl text-navy-700">{section.title}</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {section.items.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white border border-gray-200 rounded-sm p-5 hover:border-gold-400/50 hover:shadow-sm transition-all"
                  >
                    <h3 className="font-medium text-navy-700 mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* CTA */}
      <div className="bg-navy-900 py-16 text-center">
        <h2 className="font-serif text-2xl text-white mb-4">Ready to Experience It All?</h2>
        <a href="https://wa.me/919003010567?text=Hello%20Sky%20Stay%20Resorts%2C%20I%20would%20like%20to%20book%20a%20room." target="_blank" rel="noopener noreferrer" className="inline-block bg-gold-400 hover:bg-gold-300 text-navy-800 text-xs tracking-[2px] font-medium px-8 py-3 rounded-sm transition-colors">
          BOOK YOUR STAY
        </a>
      </div>
    </div>
  )
}

// ============================================
// GALLERY PAGE
// ============================================
const GALLERY_ITEMS: { url: string; category: string; caption: string }[] = [
  { url: '/gallery-carrom.jpg',      category: 'activities',   caption: 'Carrom & Indoor Games'    },
  { url: '/gallery-chess.jpg',       category: 'activities',   caption: 'Chess Board'              },
  { url: '/gallery-kids-play.jpg',   category: 'activities',   caption: "Children's Play Area"     },
  { url: '/gallery-kids-playing.jpg',category: 'activities',   caption: 'Kids Fun Zone'            },
  { url: '/gallery-bonfire.jpg',     category: 'activities',   caption: 'Bonfire Night'            },
  { url: '/gallery-hall-1.jpg',      category: 'facilities',   caption: 'Meeting & Event Hall'     },
  { url: '/gallery-hall-2.jpg',      category: 'facilities',   caption: 'Event Hall — View 2'      },
  { url: '/gallery-hall-3.jpg',      category: 'facilities',   caption: 'Event Hall — Stage View'  },
  { url: '/gallery-hall-4.jpg',      category: 'facilities',   caption: 'Event Hall — View 4'      },
  { url: '/gallery-hall-5.jpg',      category: 'facilities',   caption: 'Event Hall — View 5'      },
  { url: '/gallery-dining-1.jpg',    category: 'dining',          caption: 'Dining Hall'               },
  { url: '/gallery-room-1.jpg',      category: 'accommodations',  caption: 'Luxury Room'               },
  { url: '/gallery-room-2.jpg',      category: 'accommodations',  caption: 'Suite Interior'            },
  { url: '/gallery-room-3.jpg',      category: 'accommodations',  caption: 'Deluxe Room'               },
  { url: '/gallery-room-4.jpg',      category: 'accommodations',  caption: 'Premium Room'              },
  { url: '/gallery-room-5.jpg',      category: 'accommodations',  caption: 'Room with TV Lounge'       },
  { url: '/gallery-room-6.jpg',      category: 'accommodations',  caption: 'Room with Attached Bath'   },
  { url: '/gallery-room-7.jpg',      category: 'accommodations',  caption: 'Classic Double Room'       },
  { url: '/gallery-room-8.jpg',      category: 'accommodations',  caption: 'Elegant Double Room'       },
]

const GALLERY_TABS: { key: string; label: string }[] = [
  { key:'all',            label:'All Photos' },
  { key:'activities',     label:'Activities' },
  { key:'accommodations', label:'Accommodations' },
  { key:'facade',         label:'Facade' },
  { key:'dining',         label:'Dining' },
  { key:'facilities',     label:'Facilities' },
]

export function GalleryPage() {
  const [cat, setCat] = useState('all')
  const [lightbox, setLightbox] = useState<number | null>(null)

  const filtered = cat === 'all' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(i => i.category === cat)

  const openLightbox = (idx: number) => setLightbox(idx)
  const closeLightbox = () => setLightbox(null)
  const prev = useCallback(() => setLightbox(i => i !== null ? (i - 1 + filtered.length) % filtered.length : null), [filtered.length])
  const next = useCallback(() => setLightbox(i => i !== null ? (i + 1) % filtered.length : null), [filtered.length])

  useEffect(() => {
    if (lightbox === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, prev, next])

  const currentItem = lightbox !== null ? filtered[lightbox] : null
  const catLabel = GALLERY_TABS.find(t => t.key === currentItem?.category)?.label ?? ''

  return (
    <div className="min-h-screen pt-28 bg-white">

      {/* Hero banner */}
      <div className="relative h-64 md:h-[400px] overflow-hidden">
        <img
          src="/banner.jpg"
          alt="Gallery"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-navy-900/55" />
        <div className="absolute top-6 left-0 right-0 max-w-7xl mx-auto px-6">
          <p className="text-sm text-white/70">
            <Link to="/" className="font-medium text-white/80 hover:text-white transition-colors">Home</Link>
            <span className="mx-2 text-white/50">&gt;</span>
            <span>Gallery</span>
          </p>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-gold-400 text-[10px] tracking-[4px] uppercase mb-3">Sky Stay Resorts, Yercaud</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-white font-bold mb-3" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Gallery
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/75 text-sm max-w-md leading-relaxed">
            A visual journey through our resort, rooms, and the breathtaking hills of Yercaud.
          </motion.p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex justify-center gap-6 flex-wrap px-6 pt-12 mb-10">
        {GALLERY_TABS.map(tab => (
          <button key={tab.key} onClick={() => { setCat(tab.key); setLightbox(null) }}
            className="font-sans transition-colors"
            style={{
              fontSize: '15px',
              fontWeight: cat === tab.key ? 500 : 400,
              color: cat === tab.key ? '#c9a84c' : '#374151',
              borderBottom: cat === tab.key ? '2px solid #c9a84c' : '2px solid transparent',
              paddingBottom: '4px',
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3-column grid */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-gold-400 text-[10px] tracking-[4px] uppercase mb-3">Coming Soon</p>
            <p className="text-navy-700 font-serif text-2xl mb-2">Photos Coming Soon</p>
            <p className="text-gray-400 text-sm">We're curating beautiful moments to share with you.</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((img, i) => (
            <motion.div
              key={img.url + cat}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
              className="overflow-hidden cursor-pointer group"
              style={{ borderRadius: 16 }}
              onClick={() => openLightbox(i)}
            >
              <div className="relative" style={{ aspectRatio: '4/3' }}>
                <img
                  src={img.url} alt={img.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300 flex items-end p-4">
                  <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {img.caption}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && currentItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={closeLightbox}
        >
          <div
            className="relative bg-white rounded-2xl overflow-hidden flex flex-col"
            style={{ width: '90vw', maxWidth: 900, maxHeight: '92vh' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <p className="font-sans text-navy-800 font-medium" style={{ fontSize: 15 }}>
                {catLabel}, Sky Stay Resorts
              </p>
              <button onClick={closeLightbox} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Image area */}
            <div className="relative flex-1 flex items-center justify-center bg-gray-50 overflow-hidden" style={{ minHeight: 0 }}>
              <img
                src={currentItem.url} alt={currentItem.caption}
                className="object-contain"
                style={{ maxHeight: '70vh', maxWidth: '100%' }}
              />

              {/* Prev */}
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-colors"
              >
                <ChevronLeft size={20} className="text-navy-700" />
              </button>

              {/* Next */}
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-colors"
              >
                <ChevronRight size={20} className="text-navy-700" />
              </button>
            </div>

            {/* Caption + counter */}
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-100">
              <p className="text-sm text-gray-600">{currentItem.caption}</p>
              <p className="text-xs text-gray-400">{lightbox + 1} / {filtered.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// OFFERS PAGE
// ============================================
const OFFER_CARDS = [
  {
    id: '1',
    tag: 'A FAMILY ESCAPE INTO THE HILLS',
    title: 'Weekend Family Getaway',
    image: '/offers-bg.jpg',
    price: '₹12,999',
    priceNote: 'per room per night',
    inclusions: ['Room + Breakfast (4 Adults)', 'Early Check-In', 'Local Sightseeing', 'Massage for 2 Adults', 'Manjakuttai Off-Road Adventure', 'Oak Trail, Tree-Top Adventure & Drop', 'Salem Pickup & Drop', 'Weekdays Stay'],
    cta: 'Plan the Perfect Getaway',
  },
  {
    id: '2',
    tag: 'EXPLORE',
    title: 'Adventure Escape Package',
    image: '/exp-valley-clouds.jpg',
    price: '₹40,999',
    priceNote: 'Starting at',
    inclusions: ['2 Rooms + Breakfast', 'Balloon Shooting', 'Local Sightseeing', 'Massage for 2 Adults', 'Manjakuttai Off-Road Adventure', 'Oak Trail, Tree-Top Adventure', 'Weekdays Stay'],
    cta: 'Reserve Your Escape',
  },
  {
    id: '3',
    tag: 'SPEED, NATURE & THRILL',
    title: 'Adventure Speed Package',
    image: '/exp-lake-boating.jpg',
    price: '₹19,999',
    priceNote: 'Starting at',
    inclusions: ['Room + Breakfast', 'Early Check-In', 'Local Sightseeing', 'Balloon Shooting', 'Manjakuttai Off-Road Adventure', 'Complimentary Cake', 'Pickup & Drop from Salem Bypass Stand', 'Weekdays Stay'],
    cta: 'Reserve Your Escape',
  },
  {
    id: '4',
    tag: 'CELEBRATE YOUR LOVE',
    title: 'Honeymoon Special',
    image: '/exp-romantic-dining.jpg',
    price: '₹14,999',
    priceNote: 'Starting at',
    inclusions: ['Room + Breakfast', 'Early Check-In', 'Floral Décor', 'Local Sightseeing', 'Couple Massage', 'Balloon Shooting', 'Candle-light Dinner', 'Complimentary Cake', 'Weekdays Stay'],
    cta: 'Book Your Experience Now',
  },
]

const PROMO_CARDS = [
  { title: 'Open Sky Dining', subtitle: 'Dine under the stars', image: '/exp-poolside-dinner.jpg' },
  { title: 'Bonfire Night', subtitle: 'Evenings by the fire', image: '/exp-bonfire-evening.jpg' },
  { title: 'Family Fire Camp', subtitle: 'Memories that last', image: '/exp-family-firecamp.jpg' },
]

export function OffersPage() {
  return (
    <div className="min-h-screen bg-white pt-28">

      {/* Hero banner */}
      <div className="relative h-64 md:h-[400px] overflow-hidden">
        <img src="/banner.jpg" alt="Offers" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-navy-900/55" />
        <div className="absolute top-6 left-0 right-0 max-w-7xl mx-auto px-6">
          <p className="text-sm text-white/70">
            <Link to="/" className="font-medium text-white/80 hover:text-white transition-colors">Home</Link>
            <span className="mx-2 text-white/50">&gt;</span>
            <span>Offers</span>
          </p>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-gold-400 text-[10px] tracking-[4px] uppercase mb-3">Exclusive Escapes</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-white font-bold mb-3" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Special Offers
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/75 text-sm max-w-md leading-relaxed">
            Unbeatable deals and curated packages at Sky Stay Resorts, Yercaud.
          </motion.p>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(201,168,76,0.10)' }}>
          <Star size={28} className="text-gold-400" />
        </div>
        <p className="text-gold-400 text-[10px] tracking-[4px] uppercase mb-3">Stay Tuned</p>
        <h2 className="font-serif text-navy-800 mb-4" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 700 }}>
          Offers Coming Soon
        </h2>
        <p className="text-gray-400 text-sm max-w-md leading-relaxed mb-8">
          We're preparing exclusive deals and special packages just for you. Check back soon or contact us directly for the best rates.
        </p>
        <a
          href="https://wa.me/919003010567?text=Hello%20Sky%20Stay%20Resorts%2C%20I%20would%20like%20to%20know%20about%20your%20current%20offers."
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans font-semibold text-white transition-all"
          style={{ background: '#0b1232', borderRadius: 50, padding: '12px 32px', fontSize: '12px', letterSpacing: '0.1em' }}
        >
          ENQUIRE NOW
        </a>
      </div>
    </div>
  )
}

// ============================================
// CONTACT PAGE
// ============================================
export function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', comments:'' })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const { supabase } = await import('@/lib/supabase')
      const { error } = await supabase.from('contacts').insert({
        name: form.name, email: form.email, phone: form.phone, message: form.comments,
      })
      if (error) throw error
      setSent(true)
      toast.success('Message sent! We will reply within 2 hours.')
    } catch {
      toast.error('Failed to send. Please try WhatsApp or call us.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pt-28">

      {/* Hero banner */}
      <div className="relative h-64 md:h-[400px] overflow-hidden">
        <img
          src="/contact-resort.jpg"
          alt="Contact Us"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-navy-900/55" />
        <div className="absolute top-6 left-0 right-0 max-w-7xl mx-auto px-6">
          <p className="text-sm text-white/70">
            <Link to="/" className="font-medium text-white/80 hover:text-white transition-colors">Home</Link>
            <span className="mx-2 text-white/50">&gt;</span>
            <span>Contact</span>
          </p>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-gold-400 text-[10px] tracking-[4px] uppercase mb-3">Have a Query?</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-white font-bold mb-3" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Contact Us
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/75 text-sm max-w-md leading-relaxed">
            Our team is available 24/7 — reach out for reservations, enquiries, or special requests.
          </motion.p>
        </div>
      </div>

      {/* Info card + Resort photo */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-0 items-stretch" style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}>

          {/* Left — address card */}
          <div className="bg-white px-6 py-8 md:px-10 md:py-12 flex flex-col justify-center gap-5">
            <p className="font-semibold" style={{ color: '#c9a84c', fontSize: '17px' }}>Sky Stay Resorts, Yercaud</p>

            {/* Address */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#f5f0e8' }}>
                <MapPin size={16} style={{ color: '#c9a84c' }} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 tracking-wider mb-0.5">ADDRESS</p>
                <p className="text-sm text-gray-700 leading-relaxed">10-D, Asambur, Manjakuttai Road,<br />Yercaud - 636602, Tamil Nadu, India</p>
                <a href="https://www.google.com/maps/search/10-D,+Asambur,+Manjakuttai+Road,+Yercaud,+Tamil+Nadu+636602"
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs font-medium mt-1 inline-block hover:underline" style={{ color: '#c9a84c' }}>
                  View on Map →
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#f5f0e8' }}>
                <Mail size={16} style={{ color: '#c9a84c' }} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 tracking-wider mb-0.5">EMAIL</p>
                <a href="mailto:info@skystayresorts.com" className="text-sm text-gray-700 hover:underline">info@skystayresorts.com</a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#f5f0e8' }}>
                <Phone size={16} style={{ color: '#c9a84c' }} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 tracking-wider mb-0.5">PHONE</p>
                <a href="tel:+919003010567" className="text-sm text-gray-700 hover:underline block">+91 90030 10567</a>
                <a href="tel:+919488867071" className="text-sm text-gray-700 hover:underline block">+91 94888 67071</a>
              </div>
            </div>
          </div>

          {/* Right — photo */}
          <div style={{ minHeight: 320 }}>
            <img src="/contact-resort.jpg" alt="Sky Stay Resorts" className="w-full h-full object-cover" style={{ minHeight: 320 }} />
          </div>
        </div>
      </div>

      {/* Contact form */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="font-serif text-center text-navy-900 mb-8" style={{ fontSize: '2rem', fontWeight: 700 }}>
          Reach Out to Us
        </h2>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-0">
            {/* Name + Email row */}
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Name<span className="text-red-500">*</span></label>
                <input type="text" required value={form.name} placeholder="Enter Name"
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-800 bg-white focus:outline-none focus:border-gold-400"
                  style={{ borderRadius: 4 }}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Email<span className="text-red-500">*</span></label>
                <input type="email" required value={form.email} placeholder="Enter Email"
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-800 bg-white focus:outline-none focus:border-gold-400"
                  style={{ borderRadius: 4 }}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-1.5">Phone<span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-3 border border-gray-300 bg-white text-sm text-gray-700" style={{ borderRadius: 4 }}>
                  <span>🇮🇳</span><span>+91</span>
                </div>
                <input type="tel" required value={form.phone} placeholder="Enter Phone Number"
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="flex-1 px-4 py-3 border border-gray-300 text-sm text-gray-800 bg-white focus:outline-none focus:border-gold-400"
                  style={{ borderRadius: 4 }}
                />
              </div>
            </div>

            {/* Comments */}
            <div className="mb-5">
              <label className="block text-sm text-gray-700 mb-1.5">Comments</label>
              <textarea value={form.comments} rows={5} placeholder="Enter Comments"
                onChange={e => setForm(f => ({ ...f, comments: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-800 bg-white focus:outline-none focus:border-gold-400 resize-none"
                style={{ borderRadius: 4 }}
              />
            </div>

            {/* Submit */}
            <button type="submit" disabled={submitting}
              className="w-full py-3.5 text-white font-semibold text-sm tracking-wide transition-opacity disabled:opacity-60"
              style={{ background: '#c9a84c', borderRadius: 4 }}>
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-500 flex items-center justify-center mx-auto mb-5">
              <Send size={22} className="text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-navy-700 mb-2">Message Sent!</h3>
            <p className="text-gray-500 text-sm">We'll get back to you within 2 hours.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// ABOUT PAGE
// ============================================
export function AboutPage() {
  return (
    <div className="min-h-screen bg-cream-50 pt-28">

      {/* Hero banner */}
      <div className="relative h-64 md:h-[400px] overflow-hidden">
        <img
          src="/banner.jpg"
          alt="About Sky Stay Resorts"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-navy-900/55" />
        <div className="absolute top-6 left-0 right-0 max-w-7xl mx-auto px-6">
          <p className="text-sm text-white/70">
            <Link to="/" className="font-medium text-white/80 hover:text-white transition-colors">Home</Link>
            <span className="mx-2 text-white/50">&gt;</span>
            <span>About Us</span>
          </p>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-gold-400 text-[10px] tracking-[4px] uppercase mb-3">Since 2018</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-white font-bold mb-3" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            About Us
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/75 text-sm max-w-md leading-relaxed">
            A sanctuary where luxury meets the natural grandeur of Tamil Nadu's highlands.
          </motion.p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-gold-500 text-[11px] tracking-[3px] mb-3">SINCE 2018</p>
            <h2 className="font-serif text-3xl text-navy-700 mb-5">A Legacy of Hospitality</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Sky Stay Resorts was founded with a singular vision: to create a sanctuary where luxury meets the natural grandeur of Tamil Nadu's highlands. Nestled between rolling hills and lush forests, our resort has been welcoming guests since 2018.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Every detail — from the locally-sourced furniture to the farm-to-table cuisine — reflects our deep respect for the land and our commitment to creating memories that last a lifetime.
            </p>
          </div>
          <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80" alt="About" className="rounded-sm h-72 w-full object-cover" />
        </div>

        {/* Values */}
        <div>
          <p className="text-gold-500 text-[11px] tracking-[3px] mb-3 text-center">OUR VALUES</p>
          <h2 className="font-serif text-3xl text-navy-700 mb-10 text-center">What Drives Us</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon:'🌿', title:'Sustainability', desc:'Solar-powered, zero-waste kitchen, and rainwater harvesting. We protect the ecosystem that surrounds us.' },
              { icon:'🤝', title:'Community', desc:'70% of our staff are from local villages. We source produce from nearby farms and artisans.' },
              { icon:'✨', title:'Excellence', desc:'Every guest interaction is an opportunity to exceed expectations. 4.8★ average across 2,000+ reviews.' },
            ].map(v => (
              <div key={v.title} className="text-center p-6 bg-white border border-gray-200 rounded-sm">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-medium text-navy-700 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-navy-700 rounded-sm p-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[['6+','Years'],['48','Suites'],['4.8★','Rating'],['50K+','Guests']].map(([n,l]) => (
            <div key={l}>
              <div className="text-3xl font-light text-gold-400 mb-1">{n}</div>
              <div className="text-[11px] tracking-[2px] text-navy-300">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// BLOG PAGE (stub)
// ============================================
const POSTS = [
  { title:'Top 5 Things to Do Near Kodaikanal',  date:'Dec 10, 2025', category:'Travel', img:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80', excerpt:"From the famous lake to the hidden waterfalls, here's your guide to exploring around Sky Stay." },
  { title:'A Guide to Ayurvedic Wellness',         date:'Nov 28, 2025', category:'Wellness', img:'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&q=80', excerpt:'Our spa director shares the ancient wisdom behind Ayurvedic treatments and how they restore balance.' },
  { title:'Planning the Perfect Honeymoon Stay',   date:'Nov 15, 2025', category:'Romance', img:'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&q=80', excerpt:'Everything you need to know about our Romance Suite packages and what to add for an unforgettable trip.' },
]

export function BlogPage() {
  return (
    <div className="min-h-screen bg-cream-50 pt-28">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-2">
        <p className="text-sm text-gray-500">
          <Link to="/" className="font-medium text-gray-700 hover:text-navy-700 transition-colors">Home</Link>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span>Blog</span>
        </p>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {POSTS.map(post => (
            <div key={post.title} className="bg-white border border-gray-200 rounded-sm overflow-hidden group hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden">
                <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] tracking-[1px] bg-cream-100 text-navy-700 px-2 py-0.5 rounded-sm">{post.category}</span>
                  <span className="text-[11px] text-gray-400">{post.date}</span>
                </div>
                <h3 className="font-medium text-navy-700 mb-2 leading-snug">{post.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{post.excerpt}</p>
                <button className="text-xs text-gold-500 hover:text-gold-600">Read more →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// FACILITIES PAGE
// ============================================
const FACILITY_GROUPS = [
  {
    category: 'Stay',
    items: [
      { name: 'Premium Villa Type 1BH', timing: 'Check-in 2 PM · Check-out 11 AM', image: '/slide-2.jpg' },
      { name: 'Premium Villa Type 1BH', timing: 'Check-in 2 PM · Check-out 11 AM', image: '/slide-3.jpg' },
      { name: 'Premium Villa Type 1BH', timing: 'Check-in 2 PM · Check-out 11 AM', image: '/slide-4.jpg' },
    ],
  },
  {
    category: 'Dining',
    items: [
      { name: 'Dining Hall', timing: '7 AM to 10 PM', image: '/gallery-dining-1.jpg' },
      { name: 'Poolside Dinner', timing: '7 PM to 10 PM', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80' },
      { name: 'BBQ Night', timing: '7 PM to 10 PM', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80' },
    ],
  },
  {
    category: 'Experiences',
    items: [
      { name: 'Bonfire Evening', timing: '6 PM to 9 PM', image: 'https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?w=600&q=80' },
      { name: 'Family Fire Camp', timing: '6 PM to 9 PM', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80' },
      { name: 'Fire Camp Night', timing: '7 PM to 10 PM', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80' },
    ],
  },
  {
    category: 'Celebrations',
    items: [
      { name: 'Birthday Celebration', timing: 'By Booking', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80' },
      { name: 'Anniversary Celebration', timing: 'By Booking', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80' },
      { name: 'Honeymoon Decoration', timing: 'By Booking', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80' },
    ],
  },
  {
    category: 'Corporate Events',
    items: [
      { name: 'Conference Hall', timing: '8 AM to 8 PM', image: '/gallery-hall-1.jpg' },
      { name: 'Meeting Hall', timing: '8 AM to 8 PM', image: '/gallery-hall-2.jpg' },
      { name: 'Event Hall — Stage View', timing: '8 AM to 8 PM', image: '/gallery-hall-3.jpg' },
      { name: 'Event Hall — View 4', timing: 'By Booking', image: '/gallery-hall-4.jpg' },
      { name: 'Event Hall — View 5', timing: 'By Booking', image: '/gallery-hall-5.jpg' },
      { name: 'Team Outing', timing: 'By Booking', image: '/gallery-meeting-hall.jpg' },
    ],
  },
  {
    category: 'Family Activities',
    items: [
      { name: 'Bonfire Night', timing: 'Evening', image: '/gallery-bonfire.jpg' },
      { name: 'Carrom & Indoor Games', timing: '8 AM to 7 PM', image: '/gallery-carrom.jpg' },
      { name: 'Chess', timing: '8 AM to 7 PM', image: '/gallery-chess.jpg' },
      { name: "Children's Play Area", timing: '8 AM to 7 PM', image: '/gallery-kids-play.jpg' },
      { name: 'Kids Fun Zone', timing: '8 AM to 7 PM', image: '/gallery-kids-playing.jpg' },
    ],
  },
  {
    category: 'Nearby Attractions',
    items: [
      { name: "Lady's Seat", timing: 'Best at Sunrise & Sunset', image: '/place-ladys-seat.jpg' },
      { name: 'Botanical Garden', timing: '9 AM to 6 PM', image: '/place-botanical-garden.jpg' },
      { name: 'Killiyur Falls', timing: 'All Day', image: '/place-killiyur-falls.jpg' },
      { name: "Bear's Cave", timing: '9 AM to 5 PM', image: '/place-bears-cave.jpg' },
      { name: 'Sunset Point', timing: 'Best at Sunset', image: '/place-sunset-point.jpg' },
      { name: 'Yercaud Lake', timing: '9 AM to 6 PM', image: '/place-yercaud-lake.jpg' },
      { name: 'Boat House', timing: '8 AM to 6 PM', image: '/place-boathouse.jpg' },
      { name: 'Anna Park', timing: '8 AM to 7 PM', image: '/place-anna-park.jpg' },
      { name: 'Temple View Point', timing: 'All Day', image: '/place-temple-view.jpg' },
    ],
  },
]

export function FacilitiesPage() {
  return (
    <div className="min-h-screen bg-white pt-28">

      {/* Hero banner */}
      <div className="relative h-64 md:h-[400px] overflow-hidden">
        <img
          src="/banner.jpg"
          alt="Facilities"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-navy-900/55" />
        <div className="absolute top-6 left-0 right-0 max-w-7xl mx-auto px-6">
          <p className="text-sm text-white/70">
            <Link to="/" className="font-medium text-white/80 hover:text-white transition-colors">Home</Link>
            <span className="mx-2 text-white/50">&gt;</span>
            <span>Facilities</span>
          </p>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-gold-400 text-[10px] tracking-[4px] uppercase mb-3">Sky Stay Resorts, Yercaud</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-white font-bold mb-3" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Facilities
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/75 text-sm max-w-md leading-relaxed">
            Explore all the experiences and activities available at Sky Stay Resorts.
          </motion.p>
        </div>
      </div>

      {/* Category sections */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        {FACILITY_GROUPS.map((group) => (
          <div key={group.category}>
            {/* Category heading */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-gray-100" />
              <h2 className="font-serif text-navy-800 font-semibold whitespace-nowrap" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)' }}>
                {group.category}
              </h2>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {group.items.map((facility, i) => (
                <motion.div
                  key={facility.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="flex flex-col"
                >
                  <div className="overflow-hidden" style={{ borderRadius: 12, aspectRatio: '4/3' }}>
                    <img
                      src={facility.image}
                      alt={facility.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="pt-4 text-center">
                    <h3 className="font-sans text-gray-900 font-semibold mb-1" style={{ fontSize: '17px' }}>
                      {facility.name}
                    </h3>
                    {facility.timing.split('\n').map((line, idx) => (
                      <p key={idx} className="text-gray-500 text-sm">{line}</p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
