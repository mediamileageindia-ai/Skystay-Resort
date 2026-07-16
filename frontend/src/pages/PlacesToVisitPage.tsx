import { motion } from 'framer-motion'
import { MapPin, Clock, Car, ChevronRight, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

const VIEWPOINTS = [
  {
    name: "Lady's Seat",
    distance: '3 km',
    duration: '8 min drive',
    best: 'SUNSET',
    description: 'The most iconic viewpoint in Yercaud. Sweeping panoramas of the Salem plains and mist-draped valleys stretching to the horizon.',
    image: '/place-ladys-seat.jpg',
  },
  {
    name: 'Botanical Garden',
    distance: '4 km',
    duration: '10 min drive',
    best: 'ALL DAY',
    description: 'Rare plants, colourful flower beds, and peaceful walking trails — a relaxing escape within the heart of Yercaud.',
    image: '/place-botanical-garden.jpg',
  },
  {
    name: 'Killiyur Falls',
    distance: '5 km',
    duration: '12 min drive',
    best: 'MONSOON',
    description: 'A stunning 300-ft waterfall cascading through dense forest. The trek to the base is refreshing and memorable.',
    image: '/place-killiyur-falls.jpg',
  },
  {
    name: "Bear's Cave",
    distance: '8 km',
    duration: '18 min drive',
    best: 'SUNRISE',
    description: 'A dramatic cliff-top viewpoint with a 360° panorama of the valley and surrounding hills — one of the most breathtaking spots in the range.',
    image: '/place-bears-cave.jpg',
  },
  {
    name: 'Sunset Point',
    distance: '3.5 km',
    duration: '9 min drive',
    best: 'SUNSET',
    description: 'Watch the sun dip below the Salem plains from this elegant gazebo viewpoint. A golden hour experience like no other.',
    image: '/place-sunset-point.jpg',
  },
  {
    name: 'Yercaud Lake',
    distance: '2 km',
    duration: '5 min drive',
    best: 'MORNING',
    description: 'A serene artificial lake surrounded by lush gardens and manicured lawns — ideal for a peaceful morning walk or boating.',
    image: '/place-yercaud-lake.jpg',
  },
  {
    name: 'Boat House',
    distance: '2 km',
    duration: '5 min drive',
    best: 'ALL DAY',
    description: 'Enjoy pedal boating and rowing on Yercaud Lake with scenic hill views. A favourite spot for families and couples.',
    image: '/place-boathouse.jpg',
  },
  {
    name: 'Anna Park',
    distance: '2.5 km',
    duration: '6 min drive',
    best: 'MORNING',
    description: 'Lush green lawns, well-kept gardens, and family-friendly walking paths. Perfect for a gentle morning stroll.',
    image: '/place-anna-park.jpg',
  },
  {
    name: 'Temple View Point',
    distance: '6 km',
    duration: '15 min drive',
    best: 'ALL DAY',
    description: 'A scenic hillside path leading to a hilltop temple with panoramic views of the Yercaud valleys and forest cover.',
    image: '/place-temple-view.jpg',
  },
]


export default function PlacesToVisitPage() {
  return (
    <div className="min-h-screen bg-cream-50 pt-28">

      {/* Hero banner */}
      <div className="relative h-64 md:h-[400px] overflow-hidden">
        <img
          src="/banner.jpg"
          alt="Yercaud Hills"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-navy-900/55" />
        {/* Breadcrumb */}
        <div className="absolute top-6 left-0 right-0 max-w-7xl mx-auto px-6">
          <p className="text-sm text-white/70">
            <Link to="/" className="font-medium text-white/80 hover:text-white transition-colors">Home</Link>
            <span className="mx-2 text-white/50">&gt;</span>
            <span>Places to Visit</span>
          </p>
        </div>
        {/* Title */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-gold-400 text-[10px] tracking-[4px] uppercase mb-3"
          >
            Sky Stay Resorts, Yercaud
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-white font-bold mb-3"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
          >
            Places to Visit
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/75 text-sm max-w-md leading-relaxed"
          >
            Discover the finest viewpoints, waterfalls, temples, and hidden gems around the Yercaud hills.
          </motion.p>
        </div>
      </div>

      {/* Intro strip */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap gap-6 justify-center text-center">
          {[
            { icon: MapPin, label: 'Yercaud, Salem District', sub: 'Tamil Nadu, India' },
            { icon: Car,    label: '1,515 m above sea level', sub: 'Eastern Ghats' },
            { icon: Clock,  label: 'Best time: Oct – Jun',     sub: 'Pleasant all year' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-full bg-gold-400/10 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-gold-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-navy-700">{label}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Viewpoints Near Us */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-gray-200" />
          <div className="flex items-center gap-2 flex-shrink-0">
            <Eye size={15} className="text-gold-500" />
            <span className="text-[11px] tracking-[0.3em] text-gold-500 font-semibold uppercase">Best Viewpoints Near Us</span>
          </div>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <p className="text-center text-gray-500 text-sm max-w-lg mx-auto mb-10 leading-relaxed">
          Yercaud's hills frame some of the most breathtaking vistas in Tamil Nadu. Here are the viewpoints closest to Sky Stay Resorts.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {VIEWPOINTS.map((vp, i) => (
            <motion.div
              key={vp.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-2xl cursor-pointer"
              style={{ aspectRatio: '3/4' }}
            >
              {/* Background image */}
              <img
                src={vp.image}
                alt={vp.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Base gradient — always visible */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-navy-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Best time badge */}
              <div className="absolute top-4 left-4">
                <span className="text-[9px] tracking-[0.18em] font-bold bg-gold-400 text-navy-900 px-3 py-1.5 rounded-full shadow-lg">
                  {vp.best}
                </span>
              </div>

              {/* Distance badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1 text-white/90 text-[10px] bg-black/40 backdrop-blur-sm px-2.5 py-1.5 rounded-full">
                <MapPin size={9} />
                {vp.distance}
              </div>

              {/* Content — slides up on hover */}
              <div className="absolute inset-x-0 bottom-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                {/* Drive time */}
                <div className="flex items-center gap-1.5 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                  <Car size={10} className="text-gold-400" />
                  <span className="text-[10px] text-gold-300 tracking-wider">{vp.duration}</span>
                </div>

                {/* Name */}
                <h3 className="font-serif text-white text-xl font-bold mb-2 leading-tight drop-shadow-md">
                  {vp.name}
                </h3>

                {/* Gold divider */}
                <div className="w-8 h-0.5 bg-gold-400 mb-3 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />

                {/* Description — only visible on hover */}
                <p className="text-white/80 text-xs leading-relaxed max-h-0 overflow-hidden group-hover:max-h-24 transition-all duration-500 ease-out">
                  {vp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-navy-700 rounded-sm p-6 md:p-10 text-center">
          <p className="text-gold-400 text-[11px] tracking-[4px] mb-3">STAY WITH US</p>
          <h2 className="font-serif text-2xl text-white mb-3">Ready to Explore Yercaud?</h2>
          <p className="text-navy-300 text-sm mb-6 max-w-md mx-auto">
            Book your stay at Sky Stay Resorts and let us help you plan the perfect Yercaud experience.
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
    </div>
  )
}
