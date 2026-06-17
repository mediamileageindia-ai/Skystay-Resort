import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  Wifi, Wind, Utensils, Trees, Dumbbell, Car, Waves, Shield,
  Coffee, Music, Camera, Star, Phone, Mail, MapPin, Send
} from 'lucide-react'
import { offersService } from '@/services/api'
import toast from 'react-hot-toast'

// ============================================
// AMENITIES PAGE
// ============================================
const AMENITY_SECTIONS = [
  {
    title: 'Dining & Bar',
    icon: Utensils,
    items: [
      { name: 'The Valley Restaurant', desc: 'Multi-cuisine fine dining with valley views. Open 7 AM–11 PM daily.' },
      { name: 'The Ridge Bar', desc: 'Craft cocktails, curated wines, and live acoustic music on weekends.' },
      { name: 'In-Room Dining', desc: 'Round-the-clock room service with our full restaurant menu.' },
      { name: 'Breakfast Terrace', desc: 'Buffet breakfast with live counters overlooking the garden.' },
    ]
  },
  {
    title: 'Wellness & Spa',
    icon: Wind,
    items: [
      { name: 'Serenity Spa', desc: 'Ayurvedic, Swedish, deep tissue, and hot stone massages.' },
      { name: 'Yoga Pavilion', desc: 'Daily sunrise yoga sessions by a certified instructor.' },
      { name: 'Meditation Garden', desc: 'Dedicated garden space for mindfulness and reflection.' },
      { name: 'Steam & Sauna', desc: 'Traditional Finnish sauna and steam room open daily.' },
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
    <div className="min-h-screen bg-cream-50 pt-20">
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
        {AMENITY_SECTIONS.map((section, si) => {
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
        <Link to="/booking" className="inline-block bg-gold-400 hover:bg-gold-300 text-navy-800 text-xs tracking-[2px] font-medium px-8 py-3 rounded-sm transition-colors">
          BOOK YOUR STAY
        </Link>
      </div>
    </div>
  )
}

// ============================================
// GALLERY PAGE
// ============================================
const GALLERY_IMAGES = [
  { url:'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80', category:'rooms', caption:'Lobby & Exterior' },
  { url:'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80', category:'rooms', caption:'Deluxe Garden Room' },
  { url:'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80', category:'rooms', caption:'Valley Suite' },
  { url:'https://images.unsplash.com/photo-1602343168117-bb8ced3e3204?w=600&q=80', category:'rooms', caption:'Pool Villa' },
  { url:'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80', category:'views', caption:'Panoramic Valley View' },
  { url:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', category:'nature', caption:'Forest Trails' },
  { url:'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80', category:'dining', caption:'The Valley Restaurant' },
  { url:'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80', category:'views', caption:'Sunrise from Penthouse' },
  { url:'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80', category:'rooms', caption:'Romance Suite' },
  { url:'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&q=80', category:'nature', caption:'Forest Cottage' },
  { url:'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80', category:'pool', caption:'Infinity Pool' },
  { url:'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80', category:'rooms', caption:'Bedroom Details' },
]

const GALLERY_CATS = ['all','rooms','views','dining','pool','nature']

export function GalleryPage() {
  const [cat, setCat] = useState('all')
  const filtered = cat === 'all' ? GALLERY_IMAGES : GALLERY_IMAGES.filter(i => i.category === cat)

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      <div className="bg-navy-700 py-16 text-center">
        <p className="text-gold-400 text-[11px] tracking-[5px] mb-3">GALLERY</p>
        <h1 className="font-serif text-4xl text-white mb-3">Experience Sky Stay</h1>
        <p className="text-navy-300 text-sm">A visual journey through our resort</p>
      </div>

      {/* Filter tabs */}
      <div className="sticky top-20 z-30 bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6 flex gap-2 flex-wrap justify-center">
          {GALLERY_CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-4 py-1.5 rounded-sm text-xs tracking-[1px] capitalize transition-colors ${
                cat === c ? 'bg-navy-700 text-gold-400' : 'border border-gray-200 text-gray-600 hover:border-gold-400'
              }`}>
              {c === 'all' ? 'ALL' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry-like grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {filtered.map((img, i) => (
            <motion.div
              key={img.url}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="break-inside-avoid group relative overflow-hidden rounded-sm cursor-pointer"
            >
              <img src={img.url} alt={img.caption} className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/50 transition-all flex items-end p-3">
                <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">{img.caption}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// OFFERS PAGE
// ============================================
const OFFERS_DATA = [
  { id:'1', title:'Weekend Getaway', tag:'SAVE 20%', description:'Stay 2 nights on any weekend and save 20% on your room. Includes complimentary breakfast for 2 and welcome drinks on arrival.', discountType:'percentage' as const, discountValue:20, couponCode:'WEEKEND20', validTo:'31 Mar 2026', conditions:['Minimum 2 night stay','Friday to Sunday','Subject to availability'] },
  { id:'2', title:'Early Bird 30', tag:'SAVE 30%', description:'Book 30+ days in advance and unlock our best-ever rates across all room categories. Perfect for planned getaways.', discountType:'percentage' as const, discountValue:30, couponCode:'EARLY30', validTo:'31 Dec 2025', conditions:['Book 30 days in advance','Non-refundable','Valid all week'] },
  { id:'3', title:'Honeymoon Special', tag:'SAVE ₹2000', description:'Celebrate your love with rose petal bath, candle-lit private dinner, couple spa session, and champagne on arrival.', discountType:'fixed' as const, discountValue:2000, couponCode:'HONEY2000', validTo:'31 Dec 2025', conditions:['Romance Suite only','Must mention at booking','Add-on available for other rooms'] },
  { id:'4', title:'Pongal Festival Stay', tag:'SAVE 15%', description:'Ring in Pongal at Sky Stay! Traditional feast, cultural performances, bonfire night, and 15% off your room rate.', discountType:'percentage' as const, discountValue:15, couponCode:'PONGAL25', validTo:'20 Jan 2026', conditions:['Jan 13–16 only','All room types','Subject to availability'] },
]

export function OffersPage() {
  const { data } = useQuery({
    queryKey: ['offers'],
    queryFn: () => offersService.getAll().then(r => r.data),
    placeholderData: { data: OFFERS_DATA },
  })
  const offers = data?.data || OFFERS_DATA

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      <div className="bg-navy-900 py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage:'repeating-linear-gradient(45deg,#c9a84c 0,#c9a84c 1px,transparent 0,transparent 50%)', backgroundSize:'24px 24px' }}
        />
        <div className="relative z-10">
          <p className="text-gold-400 text-[11px] tracking-[5px] mb-3">EXCLUSIVE DEALS</p>
          <h1 className="font-serif text-4xl text-white mb-3">Special Offers</h1>
          <p className="text-navy-400 text-sm">Book directly for the best rates guaranteed</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-6">
        {offers.map((offer: any, i: number) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-200 rounded-sm overflow-hidden flex flex-col md:flex-row"
          >
            <div className="md:w-2 bg-gold-400 flex-shrink-0" />
            <div className="flex-1 p-7">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-[10px] tracking-[2px] text-white bg-navy-700 px-2.5 py-1 rounded-sm">{offer.tag}</span>
                  <h2 className="text-xl font-medium text-navy-700 mt-2">{offer.title}</h2>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-medium text-gold-500">
                    {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Valid till {offer.validTo}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-5">{offer.description}</p>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 mb-1">USE COUPON CODE</p>
                  <code className="text-sm font-medium bg-cream-100 text-navy-700 px-3 py-1.5 rounded-sm tracking-widest">
                    {offer.couponCode}
                  </code>
                </div>
                <Link to="/booking"
                  className="bg-gold-400 hover:bg-gold-300 text-navy-800 text-xs tracking-[2px] font-medium px-6 py-2.5 rounded-sm transition-colors">
                  BOOK NOW
                </Link>
              </div>
              {offer.conditions && (
                <div className="flex gap-4 mt-4 flex-wrap">
                  {offer.conditions.map((c: string) => (
                    <span key={c} className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Star size={9} className="text-gold-400 fill-gold-400" /> {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// CONTACT PAGE
// ============================================
export function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    toast.success('Message sent! We will reply within 2 hours.')
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      <div className="bg-navy-700 py-16 text-center">
        <p className="text-gold-400 text-[11px] tracking-[5px] mb-3">GET IN TOUCH</p>
        <h1 className="font-serif text-4xl text-white mb-3">Contact Us</h1>
        <p className="text-navy-300 text-sm">We reply within 2 hours — usually much faster</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12">
        {/* Info */}
        <div className="space-y-8">
          <div>
            <h2 className="font-serif text-2xl text-navy-700 mb-6">Find Us</h2>
            {[
              { icon: MapPin, label:'Address', value:'Sky Stay Resorts, Kodaikanal Road, Tamil Nadu — 624101' },
              { icon: Phone,  label:'Phone',   value:'+91 98765 43210' },
              { icon: Mail,   label:'Email',   value:'hello@skystayresorts.com' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-4 mb-5">
                <div className="w-10 h-10 rounded-full bg-navy-100 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-navy-700" />
                </div>
                <div>
                  <p className="text-[11px] tracking-[1px] text-gray-400 mb-0.5">{label.toUpperCase()}</p>
                  <p className="text-sm text-navy-700">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-medium text-navy-700 mb-4">Hours</h3>
            <div className="space-y-2 text-sm">
              {[['Front Desk','24 hours, 7 days'],['Restaurant','7:00 AM – 11:00 PM'],['Spa','9:00 AM – 8:00 PM'],['Pool','6:00 AM – 10:00 PM']].map(([k,v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">{k}</span>
                  <span className="text-navy-700">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map embed placeholder */}
          <div className="h-48 bg-navy-100 rounded-sm flex items-center justify-center">
            <div className="text-center">
              <MapPin size={24} className="text-navy-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Kodaikanal Road, Tamil Nadu</p>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"
                className="text-xs text-gold-500 mt-1 block hover:text-gold-600">Open in Google Maps →</a>
            </div>
          </div>
        </div>

        {/* Form */}
        <div>
          <h2 className="font-serif text-2xl text-navy-700 mb-6">Send a Message</h2>
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key:'name',    label:'YOUR NAME',     type:'text',  placeholder:'Ravi Kumar' },
                { key:'email',   label:'EMAIL ADDRESS', type:'email', placeholder:'ravi@email.com' },
                { key:'phone',   label:'PHONE NUMBER',  type:'tel',   placeholder:'+91 98765 43210' },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-[11px] tracking-[2px] text-gray-500 mb-2">{label}</label>
                  <input type={type} value={(form as any)[key]} placeholder={placeholder}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm text-navy-700 bg-white focus:outline-none focus:border-gold-400"
                  />
                </div>
              ))}
              <div>
                <label className="block text-[11px] tracking-[2px] text-gray-500 mb-2">MESSAGE</label>
                <textarea value={form.message} rows={5} placeholder="How can we help you?"
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm text-navy-700 bg-white focus:outline-none focus:border-gold-400 resize-none"
                />
              </div>
              <button type="submit"
                className="w-full bg-gold-400 hover:bg-gold-300 text-navy-800 font-medium text-xs tracking-[2px] py-3 rounded-sm transition-colors flex items-center justify-center gap-2">
                <Send size={14} /> SEND MESSAGE
              </button>
            </form>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-600 flex items-center justify-center mx-auto mb-5">
                <Star size={24} className="text-green-600" />
              </div>
              <h3 className="text-xl font-medium text-navy-700 mb-2">Message Sent!</h3>
              <p className="text-gray-500 text-sm">We'll get back to you within 2 hours.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// ABOUT PAGE
// ============================================
export function AboutPage() {
  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      <div className="bg-navy-700 py-16 text-center">
        <p className="text-gold-400 text-[11px] tracking-[5px] mb-3">OUR STORY</p>
        <h1 className="font-serif text-4xl text-white mb-3">About Sky Stay Resorts</h1>
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
    <div className="min-h-screen bg-cream-50 pt-20">
      <div className="bg-navy-700 py-16 text-center">
        <p className="text-gold-400 text-[11px] tracking-[5px] mb-3">JOURNAL</p>
        <h1 className="font-serif text-4xl text-white mb-3">Stories & Guides</h1>
        <p className="text-navy-300 text-sm">Travel tips, wellness guides, and resort updates</p>
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
