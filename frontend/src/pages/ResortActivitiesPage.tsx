import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight, Clock, Check } from 'lucide-react'

const ACTIVITIES = [
  {
    name: 'Bonfire Night',
    category: 'RECREATION & LEISURE',
    duration: 'Evening',
    tag: 'SEASONAL',
    image: '/gallery-bonfire.jpg',
    desc: 'Curated bonfire evenings with folk music, roasted snacks, and storytelling under the stars. A perfect way to end the day in the hills.',
    highlights: ['Folk music & storytelling', 'Roasted snacks & marshmallows', 'Stargazing experience'],
  },
  {
    name: 'Carrom & Indoor Games',
    category: 'RECREATION & LEISURE',
    duration: 'Flexible',
    tag: 'COMPLIMENTARY',
    image: '/gallery-carrom.jpg',
    desc: 'Enjoy carrom, chess, and a variety of indoor games at the resort — perfect for families, couples, and groups of all ages.',
    highlights: ['Carrom board', 'Multiple game options', 'Open all day'],
  },
  {
    name: 'Chess',
    category: 'RECREATION & LEISURE',
    duration: 'Flexible',
    tag: 'COMPLIMENTARY',
    image: '/gallery-chess.jpg',
    desc: 'Challenge your mind with a classic game of chess in our dedicated indoor games area. Available for all in-house guests.',
    highlights: ['Premium chess sets', 'Indoor games hall', 'All skill levels welcome'],
  },
  {
    name: "Children's Play Area",
    category: 'KIDS & FAMILY',
    duration: 'All Day',
    tag: 'COMPLIMENTARY',
    image: '/gallery-kids-play.jpg',
    desc: 'A vibrant and safe play area designed for younger guests with a variety of fun activities to keep them engaged throughout the day.',
    highlights: ['Safe & supervised', 'Outdoor play equipment', 'Open 8 AM to 7 PM'],
  },
  {
    name: 'Kids Fun Zone',
    category: 'KIDS & FAMILY',
    duration: 'All Day',
    tag: 'COMPLIMENTARY',
    image: '/gallery-kids-playing.jpg',
    desc: 'A dedicated indoor play zone for little ones featuring ride-on toys, rocking horses, slides, a foosball table, and a safe play pen.',
    highlights: ['Indoor play pen', 'Ride-on toys & slides', 'Foosball table'],
  },
]

const tagStyle: Record<string, { background: string; color: string }> = {
  'COMPLIMENTARY': { background: '#dcfce7', color: '#15803d' },
  'GUIDED':        { background: '#dbeafe', color: '#1d4ed8' },
  'DAILY':         { background: '#fef9c3', color: '#a16207' },
  'BY BOOKING':    { background: '#f3e8ff', color: '#7e22ce' },
  'SEASONAL':      { background: '#fef3c7', color: '#b45309' },
  'PRE-ORDER':     { background: '#f1f5f9', color: '#475569' },
}

export default function ResortActivitiesPage() {
  return (
    <div className="min-h-screen bg-white pt-28">

      {/* Hero banner */}
      <div className="relative h-64 md:h-[400px] overflow-hidden">
        <img src="/banner.jpg" alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-navy-900/55" />
        <div className="absolute top-6 left-0 right-0 max-w-7xl mx-auto px-6">
          <p className="text-sm text-white/70">
            <Link to="/" className="font-medium text-white/80 hover:text-white transition-colors">Home</Link>
            <span className="mx-2 text-white/50">&gt;</span>
            <span>Resort Activities</span>
          </p>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-gold-400 text-[10px] tracking-[4px] uppercase mb-3">Sky Stay Resorts, Yercaud</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-white font-bold mb-3" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Resort Activities
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/75 text-sm max-w-md leading-relaxed">
            From bonfire nights and indoor games to kids' play zones — every moment crafted for memory.
          </motion.p>
        </div>
      </div>

      {/* Individual activity sections */}
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-0">
        {ACTIVITIES.map((act, i) => {
          const isEven = i % 2 === 0
          return (
            <motion.div
              key={act.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="grid lg:grid-cols-2 items-center gap-10 lg:gap-16 py-14 border-b border-gray-100 last:border-0"
            >
              {/* Image */}
              <div className={isEven ? '' : 'lg:order-2'}>
                <div className="relative overflow-hidden rounded-2xl group" style={{ aspectRatio: '4/3' }}>
                  <img
                    src={act.image}
                    alt={act.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Tag overlay */}
                  <span
                    className="absolute top-4 left-4 text-[9px] tracking-[0.15em] font-bold px-3 py-1.5 rounded-full shadow"
                    style={tagStyle[act.tag] || { background: '#f1f5f9', color: '#475569' }}
                  >
                    {act.tag}
                  </span>
                  {/* Duration overlay */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white rounded-full px-3 py-1.5">
                    <Clock size={10} />
                    <span style={{ fontSize: '10px', letterSpacing: '0.05em' }}>{act.duration}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={isEven ? '' : 'lg:order-1'}>
                <p className="text-gold-500 text-[10px] tracking-[3px] uppercase mb-2">{act.category}</p>
                <h2 className="font-serif text-navy-800 mb-4" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', fontWeight: 700 }}>
                  {act.name}
                </h2>
                <div className="w-10 h-0.5 bg-gold-400 mb-5" />
                <p className="text-gray-600 leading-relaxed mb-6" style={{ fontSize: '14px' }}>
                  {act.desc}
                </p>
                <ul className="space-y-2">
                  {act.highlights.map(h => (
                    <li key={h} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-gold-400/15 flex items-center justify-center flex-shrink-0">
                        <Check size={11} className="text-gold-500" />
                      </div>
                      <span className="text-sm text-gray-600">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-navy-800 rounded-2xl p-10 md:p-14 text-center">
          <p className="text-gold-400 text-[10px] tracking-[0.35em] mb-4">PLAN YOUR STAY</p>
          <h2 className="font-serif text-white mb-3" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 600 }}>
            Reserve Your Experience
          </h2>
          <p className="text-navy-300 text-sm mb-8 max-w-md mx-auto leading-relaxed">
            Some activities require advance booking. Contact our concierge while reserving your room to ensure availability.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="https://wa.me/919003010567?text=Hello%20Sky%20Stay%20Resorts%2C%20I%20would%20like%20to%20book%20a%20room."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold-400 hover:bg-gold-300 text-navy-900 font-bold transition-all duration-300 rounded-full"
              style={{ fontSize: '10px', letterSpacing: '0.2em', padding: '14px 36px' }}
            >
              BOOK YOUR STAY
            </a>
            <Link
              to="/contact"
              className="border border-white/30 text-white hover:border-white hover:bg-white/10 transition-all duration-300 inline-flex items-center gap-2 rounded-full"
              style={{ fontSize: '10px', letterSpacing: '0.2em', padding: '14px 36px' }}
            >
              CONTACT CONCIERGE <ChevronRight size={11} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
