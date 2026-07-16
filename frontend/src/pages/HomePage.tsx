import { useState, useRef, useEffect, memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, ChevronLeft, Star, Wifi, Utensils, Trees, Car, Building2, Flame, Baby, Navigation } from 'lucide-react'
import { offersService, googleReviewsService } from '@/services/api'
import ScratchCard from '@/components/ScratchCard'

// ---- EXPERIENCES ----
const EXPERIENCES = [
  { title: 'Lake Boating',            desc: 'Glide across Yercaud Lake at dawn as morning mist dances gently on the water surface.',          img: '/exp-romantic-dining.jpg',  fallback: 'https://images.unsplash.com/photo-1563878396-ce3e8e1e5f7a?w=600&q=80',  link: '/places-to-visit'         },
  { title: 'Bonfire Evening',         desc: 'Gather under the stars for a private bonfire with music and the crisp forest air around you.',    img: '/exp-poolside-dinner.jpg',  fallback: 'https://images.unsplash.com/photo-1476611338391-6f395a0dd82e?w=600&q=80', link: '/resort-activities'       },
  { title: 'Boat House',              desc: 'Experience serene lake boating at the iconic Yercaud Boat House, a timeless Yercaud memory.',     img: '/exp-family-firecamp.jpg',  fallback: 'https://images.unsplash.com/photo-1569152811536-fb47aced8409?w=600&q=80', link: '/places-to-visit'         },
  { title: 'Valley of Clouds',        desc: 'Watch morning clouds roll through the valleys below from your private hilltop viewpoint.',        img: '/exp-infinity-pool.jpg',    fallback: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', link: '/places-to-visit'         },
  { title: 'Fire Camp Night',         desc: 'A magical evening around the campfire with your family under an infinite canopy of stars.',       img: '/exp-firecamp-night.jpg',   fallback: 'https://images.unsplash.com/photo-1518992028844-b1fb4e00b63c?w=600&q=80', link: '/resort-activities'       },
  { title: 'Family Fire Camp',        desc: 'Bond over fire, food, and stories with the whole family in the warm open evening air.',           img: '/exp-boat-house.jpg',       fallback: 'https://images.unsplash.com/photo-1475483768296-6163e08872a1?w=600&q=80', link: '/resort-activities'       },
  { title: 'Starlit Poolside Dinner', desc: 'Dine under a sky full of stars poolside with curated menus, glowing candles, and soft music.',    img: '/exp-bonfire-evening.jpg',  fallback: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80', link: '/rooms/luxury-pool-villa' },
  { title: 'Romantic Dining',         desc: 'A candlelit dinner for two with fresh cuisine and a sweeping panoramic forest view below.',        img: '/exp-lake-boating.jpg',     fallback: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', link: '/rooms/romance-suite'     },
]

function ExperienceShowcase() {
  const [active, setActive] = useState(2)
  const [imgSrcs, setImgSrcs] = useState<Record<number, string>>({})

  const go = (dir: number) => setActive(i => Math.max(0, Math.min(EXPERIENCES.length - 1, i + dir)))
  const getImg = (i: number) => imgSrcs[i] ?? EXPERIENCES[i].img
  const onErr = (i: number) => setImgSrcs(p => ({ ...p, [i]: EXPERIENCES[i].fallback }))

  const visible = EXPERIENCES.map((_, i) => i).filter(i => Math.abs(i - active) <= 2)

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1540541338537-41369a6e5c6f?w=1600&q=75"
          className="w-full h-full object-cover"
          alt=""
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(240,235,224,0.92) 0%, rgba(240,235,224,0.78) 50%, rgba(240,235,224,0.92) 100%)' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <SectionHeader
          label="Stories & Moments"
          title="Experiences at Sky Stay"
          subtitle="Every stay is a story waiting to be told. Discover the moments that make Sky Stay unforgettable."
        />

        {/* MOBILE: simple horizontal scroll */}
        <div className="md:hidden -mx-6 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="flex gap-4 px-6" style={{ width: 'max-content' }}>
            {EXPERIENCES.map((exp, i) => (
              <div
                key={exp.title}
                className="bg-white rounded-2xl overflow-hidden flex flex-col flex-shrink-0"
                style={{ width: 240, boxShadow: '0 4px 20px rgba(0,0,0,0.10)' }}
              >
                <div className="overflow-hidden flex-shrink-0" style={{ height: 150 }}>
                  <img src={getImg(i)} onError={() => onErr(i)} alt={exp.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex flex-col" style={{ height: 160 }}>
                  <h3 className="font-serif text-navy-800 mb-1 leading-snug flex-shrink-0" style={{ fontSize: '0.95rem', fontWeight: 600 }}>{exp.title}</h3>
                  <p className="text-gray-500 flex-1 overflow-hidden" style={{ fontSize: 11, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const }}>{exp.desc}</p>
                  <Link to={exp.link} className="inline-block text-center rounded-full font-sans font-semibold text-white w-full flex-shrink-0 mt-3" style={{ fontSize: 10, letterSpacing: '0.06em', padding: '7px 0', background: 'linear-gradient(135deg, #b8933a, #d4aa55)' }}>Explore More</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP: fan carousel */}
        <div className="hidden md:block relative">
          {/* Prev — fixed position, never moves */}
          <button
            onClick={() => go(-1)}
            disabled={active === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-navy-700 flex items-center justify-center text-navy-700 hover:bg-navy-700 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: 'rgba(255,255,255,0.85)' }}
          >
            <ChevronLeft size={18} />
          </button>

          {/* Cards */}
          <div className="flex items-end justify-center gap-4 overflow-hidden px-14" style={{ minHeight: 400 }}>
            {visible.map(i => {
              const exp = EXPERIENCES[i]
              const isActive = i === active
              const dist = Math.abs(i - active)
              return (
                <motion.div
                  key={exp.title}
                  layout
                  animate={{
                    scale: isActive ? 1 : dist === 1 ? 0.9 : 0.78,
                    opacity: isActive ? 1 : dist === 1 ? 0.88 : 0.6,
                    y: isActive ? -20 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  onClick={() => setActive(i)}
                  className="bg-white rounded-2xl overflow-hidden cursor-pointer flex-shrink-0 flex flex-col"
                  style={{
                    width: isActive ? 310 : 220,
                    height: 360,
                    boxShadow: isActive
                      ? '0 28px 64px rgba(0,0,0,0.22)'
                      : '0 6px 20px rgba(0,0,0,0.09)',
                  }}
                >
                  {/* Image — ALL cards, same height */}
                  <div className="overflow-hidden flex-shrink-0" style={{ height: 180 }}>
                    <motion.img
                      src={getImg(i)}
                      onError={() => onErr(i)}
                      alt={exp.title}
                      animate={{ scale: isActive ? 1 : 1.06 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Body — fixed height so button never moves */}
                  <div className="p-5 flex flex-col" style={{ height: 180 }}>
                    <h3
                      className="font-serif text-navy-800 mb-2 leading-snug flex-shrink-0"
                      style={{ fontSize: isActive ? '1.15rem' : '0.92rem', fontWeight: 600 }}
                    >
                      {exp.title}
                    </h3>
                    <p
                      className="text-gray-500 flex-1 overflow-hidden"
                      style={{
                        fontSize: isActive ? 13 : 11,
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical' as const,
                      }}
                    >
                      {exp.desc}
                    </p>
                    <Link
                      to={exp.link}
                      onClick={e => e.stopPropagation()}
                      className="inline-block text-center rounded-full font-sans font-semibold text-white w-full flex-shrink-0 mt-3"
                      style={{
                        fontSize: 11,
                        letterSpacing: '0.06em',
                        padding: '8px 0',
                        background: 'linear-gradient(135deg, #b8933a, #d4aa55)',
                      }}
                    >
                      Explore More
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Next — fixed position, never moves */}
          <button
            onClick={() => go(1)}
            disabled={active === EXPERIENCES.length - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-navy-700 flex items-center justify-center text-navy-700 hover:bg-navy-700 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: 'rgba(255,255,255,0.85)' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Dots — desktop only */}
        <div className="hidden md:flex justify-center gap-2 mt-8">
          {EXPERIENCES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === active ? 28 : 8,
                height: 8,
                background: i === active ? '#b8933a' : '#c8b99a',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ---- VIEW POINTS ----
const VIEWPOINTS = [
  { name: "Lady's Seat",        img: '/place-ladys-seat.jpg',        fallback: '', desc: 'Best at Sunrise & Sunset'      },
  { name: 'Botanical Garden',   img: '/place-botanical-garden.jpg',  fallback: '', desc: '9 AM to 6 PM'                  },
  { name: 'Killiyur Falls',     img: '/place-killiyur-falls.jpg',    fallback: '', desc: 'All Day'                       },
  { name: "Bear's Cave",        img: '/place-bears-cave.jpg',        fallback: '', desc: '9 AM to 5 PM'                  },
  { name: 'Sunset Point',       img: '/place-sunset-point.jpg',      fallback: '', desc: 'Best at Sunset'                },
  { name: 'Yercaud Lake',       img: '/place-yercaud-lake.jpg',      fallback: '', desc: '9 AM to 6 PM'                  },
  { name: 'Boat House',         img: '/place-boathouse.jpg',         fallback: '', desc: '8 AM to 6 PM'                  },
  { name: 'Anna Park',          img: '/place-anna-park.jpg',         fallback: '', desc: '8 AM to 7 PM'                  },
  { name: 'Temple View Point',  img: '/place-temple-view.jpg',       fallback: '', desc: 'All Day'                       },
]

function ViewPointCard({ vp, i }: { vp: typeof VIEWPOINTS[0], i: number }) {
  const [src, setSrc] = useState(vp.img)
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.07, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="cursor-pointer"
    >
      <div className="overflow-hidden mb-4" style={{ borderRadius: 16, aspectRatio: '4/3' }}>
        <img
          src={src}
          alt={vp.name}
          onError={() => setSrc(vp.fallback)}
          loading="lazy"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      <h3 className="font-serif text-navy-800 text-center mb-1" style={{ fontSize: '1.3rem', fontWeight: 600 }}>
        {vp.name}
      </h3>
      <p className="font-sans text-gray-400 text-center" style={{ fontSize: '13px' }}>
        {vp.desc}
      </p>
    </motion.div>
  )
}

// ---- AMENITIES ----
const amenities = [
  { icon: Flame,     label: 'Fire Camp',            desc: 'Starlit bonfire evenings' },
  { icon: Baby,      label: "Children's Play Area", desc: 'Safe & fun for kids' },
  { icon: Car,       label: 'Jeep Safari',          desc: 'Guided off-road adventure' },
  { icon: Wifi,      label: 'High-Speed WiFi',      desc: 'Fibre optic throughout' },
  { icon: Utensils,  label: 'Restaurant',           desc: 'Multi-cuisine dining & room service' },
  { icon: Building2, label: 'Meeting Hall',         desc: 'Events & conference space' },
  { icon: Trees,     label: 'Nature Trails',        desc: '3 km curated walk' },
  { icon: Navigation,label: 'Tracking',             desc: 'Guided nature tracking' },
]

// ---- FALLBACK DATA ----
const ROOMS = [
  { id:'1', slug:'luxury-villa-01', roomName:'Premium Villa Type 1BH', price:4999,  description:'Wake up to lush garden views with premium handcrafted furniture and en-suite amenities.', images:[{ url:'/rooms/room-deluxe-1.png',    isPrimary:true }], maxGuests:2 },
  { id:'2', slug:'luxury-villa-02', roomName:'Premium Villa Type 1BH', price:7999,  description:'Sweeping valley panoramas from your private balcony with jacuzzi and separate lounge.',    images:[{ url:'/rooms/room-suite-1.jpg',     isPrimary:true }], maxGuests:2 },
  { id:'3', slug:'luxury-villa-03', roomName:'Premium Villa Type 1BH', price:15999, description:'Private plunge pool, outdoor dining cabana, and dedicated butler service.',                images:[{ url:'/rooms/room-villa-1.png',     isPrimary:true }], maxGuests:4 },
  { id:'4', slug:'luxury-villa-04', roomName:'Premium Villa Type 1BH', price:6499,  description:'Rustic luxury nestled in the forest with wood interiors, outdoor shower, and bonfire pit.',images:[{ url:'/rooms/room-cottage-1.png',   isPrimary:true }], maxGuests:2 },
  { id:'5', slug:'luxury-villa-05', roomName:'Premium Villa Type 1BH', price:22999, description:'Rooftop penthouse with 360° views, private terrace, and chef service on request.',         images:[{ url:'/rooms/room-penthouse-1.png', isPrimary:true }], maxGuests:6 },
  { id:'6', slug:'luxury-villa-06', roomName:'Premium Villa Type 1BH', price:9999,  description:'Designed for couples — rose bath, candle-lit dinner setup and complimentary champagne.',   images:[{ url:'/rooms/room-romance-2.png',   isPrimary:true }], maxGuests:2 },
  { id:'7', slug:'luxury-villa-07', roomName:'Premium Villa Type 1BH', price:8999,  description:'Elegant suite with forest canopy views, king bed, and a private sit-out terrace.',         images:[{ url:'/rooms/room-deluxe-2.png',    isPrimary:true }], maxGuests:2 },
  { id:'8', slug:'luxury-villa-08', roomName:'Premium Villa Type 1BH', price:11999, description:'Spacious family suite with panoramic hill views and modern luxury interiors.',              images:[{ url:'/rooms/room-suite-2.jpg',     isPrimary:true }], maxGuests:4 },
]

const OFFERS = [
  { id:'1', title:'Weekend Getaway',   tag:'WEEKEND',    couponCode:'WEEKEND20',  description:'Stay 2 nights, save big. Includes breakfast for 2 and welcome drinks.',    discountValue:20,   discountType:'percentage' as const },
  { id:'2', title:'Early Bird 30',     tag:'EARLY BIRD', couponCode:'EARLYBIRD30', description:'Book 30 days in advance and unlock our best-ever rates on all room types.', discountValue:30,   discountType:'percentage' as const },
  { id:'3', title:'Honeymoon Special', tag:'HONEYMOON',  couponCode:'HONEY2000',  description:'Candle-lit dinner, rose bath, couple spa and a bottle of champagne.',       discountValue:2000, discountType:'fixed' as const },
]

const GUEST_STORIES = [
  { name:'Priya Ramesh',  city:'Chennai',    room:'Premium Villa Type 1BH', video:'/Video/V1.mp4', poster:'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=70', rating:5, date:'12 May 2025', comment:'Very clean rooms and excellent hospitality. The views from the villa were absolutely breathtaking every single morning.' },
  { name:'Arun Krishnan', city:'Bangalore',  room:'Premium Villa Type 1BH', video:'/Video/V2.mp4', poster:'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=70', rating:5, date:'20 Apr 2025', comment:'The food was delicious and the rooms were spotless. Best anniversary trip we have ever taken as a couple.' },
  { name:'Meena Sundar',  city:'Coimbatore', room:'Premium Villa Type 1BH', video:'/Video/V3.mp4', poster:'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=70', rating:5, date:'05 May 2025', comment:'Best resort experience in Yercaud. Woke up to absolute silence and nature. Will definitely be back soon.' },
  { name:'Karthik Raja',  city:'Madurai',    room:'Premium Villa Type 1BH', video:'/Video/V4.mp4', poster:'https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?w=600&q=70', rating:5, date:'18 Apr 2025', comment:'Peaceful ambiance and luxurious stay. The bonfire evening was truly unforgettable for the entire family.' },
  { name:'Divya Nair',    city:'Kochi',      room:'Premium Villa Type 1BH', video:'/Video/V5.mp4', poster:'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=70', rating:5, date:'28 Mar 2025', comment:'Celebrated our honeymoon here. Everything was perfect — roses, champagne, and the most beautiful candlelit dinner.' },
  { name:'Rajesh Kumar',  city:'Hyderabad',  room:'Premium Villa Type 1BH', video:'/Video/V6.mp4', poster:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=70', rating:5, date:'10 Mar 2025', comment:'360° views from the penthouse are unmatched. The chef service on request was an absolutely lovely touch.' },
  { name:'Ananya Iyer',   city:'Mumbai',     room:'Premium Villa Type 1BH', video:'/Video/V7.mp4', poster:'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=70', rating:5, date:'15 Feb 2025', comment:'A tranquil escape from the city. The nature trails and bonfire evenings made this trip absolutely memorable.' },
  { name:'Suresh Pillai', city:'Trivandrum', room:'Premium Villa Type 1BH', video:'/Video/V8.mp4', poster:'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=70', rating:5, date:'02 Feb 2025', comment:'Exceptional service and stunning views. Every staff member made us feel like royalty throughout the stay.' },
]

// ---- STORY CARD (needs own play state) ----
function StoryCard({ s, i }: { s: typeof GUEST_STORIES[0]; i: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)

  const togglePlay = () => {
    if (videoFailed || !videoRef.current) return
    if (playing) { videoRef.current.pause(); setPlaying(false) }
    else { videoRef.current.play(); setPlaying(true) }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: i * 0.07 }}
      className="flex-shrink-0 bg-white rounded-2xl overflow-hidden flex flex-col"
      style={{ width: 'min(300px, calc(100vw - 48px))', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
    >
      {/* Video / fallback thumbnail */}
      <div className="relative cursor-pointer" style={{ aspectRatio: '4/3' }} onClick={togglePlay}>
        {videoFailed ? (
          <img src={s.poster} alt={s.name} className="w-full h-full object-cover" />
        ) : (
          <video
            ref={videoRef} src={s.video} playsInline
            preload="metadata"
            className="w-full h-full object-cover"
            onEnded={() => setPlaying(false)}
            onError={() => setVideoFailed(true)}
          />
        )}
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 pt-3 pointer-events-none">
          <div className="w-7 h-7 rounded-md bg-black/60 flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="white"><path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
          </div>
        </div>
        {/* Play / pause overlay */}
        {!playing && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full border-2 border-white bg-black/30 flex items-center justify-center backdrop-blur-sm">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="white"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Guest info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center text-white flex-shrink-0"
            style={{ fontSize: 11, fontWeight: 600 }}>
            {s.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-sans font-semibold text-navy-800" style={{ fontSize: 13 }}>{s.name}</span>
              <span className="flex items-center gap-0.5 text-gold-500" style={{ fontSize: 10 }}>
                <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor"><path d="M8 0l1.6 4.9H15l-4.2 3 1.6 4.9L8 10 3.6 12.8l1.6-4.9L1 5.9h5.4z"/></svg>
                Verified Guest
              </span>
            </div>
            <p className="text-gray-400 flex items-center gap-1" style={{ fontSize: 11 }}>
              <Navigation size={9} /> {s.city}
            </p>
          </div>
        </div>
        <p className="text-gray-500" style={{ fontSize: 11 }}>
          Stayed at: <span className="text-gold-500 font-medium">{s.room}</span>
        </p>
        <div className="flex items-center gap-1.5">
          {[1,2,3,4,5].map(j => <Star key={j} size={13} className="fill-gold-400 text-gold-400" />)}
          <span className="font-sans font-semibold text-navy-700" style={{ fontSize: 12 }}>5.0</span>
        </div>
        <p className="text-gray-600 leading-relaxed flex-1" style={{ fontSize: 12, fontStyle: 'italic' }}>
          &ldquo;{s.comment}&rdquo;
        </p>
        <div className="flex items-center gap-2 flex-wrap border-t border-gray-100 pt-2" style={{ fontSize: 10, color: '#9ca3af' }}>
          <span className="flex items-center gap-1"><Navigation size={8} />{s.city}</span>
          <span>·</span>
          <span>{s.room}</span>
          <span>·</span>
          <span>{s.date}</span>
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 pt-2">
          {[{ icon: '♡', label: 'Helpful' }, { icon: '↑', label: 'Share' }].map(a => (
            <button key={a.label} className="flex items-center gap-1 text-gray-400 hover:text-navy-700 transition-colors" style={{ fontSize: 11 }}>
              <span>{a.icon}</span>{a.label}
            </button>
          ))}
          <button onClick={togglePlay} className="flex items-center gap-1 text-gold-500 hover:text-gold-400 transition-colors font-medium" style={{ fontSize: 11 }}>
            <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8S12.42 0 8 0zm3.5 8.5l-5 3A.5.5 0 0 1 6 11V5a.5.5 0 0 1 .5-.5l5 3a.5.5 0 0 1 0 .87z"/></svg>
            {playing ? 'Pause Video' : 'Watch Review'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ---- SECTION HEADER - GRT ornament pattern ----
function SectionHeader({ label, title, subtitle, light = false }: { label: string; title: string; subtitle?: string; light?: boolean }) {
  return (
    <div className="text-center mb-14">
      <motion.p
        className={`font-sans uppercase mb-3 ${light ? 'text-gold-300' : 'text-gold-500'}`}
        style={{ fontSize: '10px', letterSpacing: '0.3em', fontWeight: 400 }}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >{label}</motion.p>
      <motion.div
        className={`flex items-center justify-center gap-3 mb-4 ${light ? 'text-gold-300' : 'text-gold-500'}`}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <span style={{ display: 'block', width: 36, height: 1, background: 'currentColor', opacity: 0.5 }} />
        <span style={{ fontSize: 8 }}>◆</span>
        <span style={{ display: 'block', width: 36, height: 1, background: 'currentColor', opacity: 0.5 }} />
      </motion.div>
      <motion.h2
        className={`font-serif font-light ${light ? 'text-white' : 'text-navy-800'}`}
        style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '0.02em' }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.18 } } }}
      >
        {title.split(' ').map((word, i) => (
          <motion.span
            key={i}
            className="inline-block mr-[0.25em]"
            variants={{
              hidden: { opacity: 0, y: 32, filter: 'blur(8px)' },
              show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.h2>
      {subtitle && (
        <motion.p
          className={`mt-4 font-sans font-light leading-relaxed mx-auto max-w-xl ${light ? 'text-white/60' : 'text-gray-500'}`}
          style={{ fontSize: '14px' }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >{subtitle}</motion.p>
      )}
    </div>
  )
}

// Local images (user uploaded) — primary fallback
const LOCAL_ROOM_IMGS: Record<string, string> = {
  'luxury-villa-01': '/slide-5.jpg',
  'luxury-villa-02': '/slide-3.jpg',
  'luxury-villa-03': '/slide-4.jpg',
  'luxury-villa-04': '/slide-2.jpg',
  'luxury-villa-05': '/slide-3.jpg',
  'luxury-villa-06': '/slide-4.jpg',
  'luxury-villa-07': '/slide-2.jpg',
  'luxury-villa-08': '/slide-3.jpg',
}



const HERO_SLIDES = [
  { src: '/banner-img1.jpg',  alt: 'Sky Stay Resorts' },
  { src: '/banner-img2.jpg',  alt: 'Sky Stay Resorts' },
  { src: '/banner-img6.jpg',  alt: 'Sky Stay Resorts' },
  { src: '/banner-img4.jpg',  alt: 'Sky Stay Resorts' },
  { src: '/banner-ssr010.jpg', alt: 'Sky Stay Resorts' },
  { src: '/banner-ssr011.jpg', alt: 'Sky Stay Resorts' },
]

const HeroVideo = memo(() => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(i => (i + 1) % HERO_SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {HERO_SLIDES.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        />
      ))}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to top, rgba(11,18,50,0.80) 0%, rgba(11,18,50,0.35) 45%, rgba(11,18,50,0.10) 100%)'
      }} />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="rounded-full transition-all duration-300"
            style={{ width: i === current ? 24 : 8, height: 8, background: i === current ? '#c9a84c' : 'rgba(255,255,255,0.5)' }}
          />
        ))}
      </div>
    </div>
  )
})

// ---- ROOM CAROUSEL ----
function RoomCarousel({ items }: { items: typeof ROOMS }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'right' ? 380 : -380, behavior: 'smooth' })
  }
  return (
    <section className="py-16" style={{ background: '#faf6ee' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div />
          <div className="flex gap-3">
            <button onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-navy-700 flex items-center justify-center text-navy-700 hover:bg-navy-700 hover:text-white transition-colors">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-navy-700 flex items-center justify-center text-navy-700 hover:bg-navy-700 hover:text-white transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((room) => {
            const imgSrc = LOCAL_ROOM_IMGS[room.slug] || room.images?.[0]?.url || ''
            return (
              <div key={room.id} className="flex-shrink-0" style={{ width: 'min(340px, calc(100vw - 48px))' }}>
                <div className="rounded-2xl overflow-hidden mb-4" style={{ height: 240 }}>
                  <img
                    src={imgSrc}
                    alt={room.roomName}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-serif text-navy-800 mb-2" style={{ fontSize: '1.15rem', fontWeight: 600 }}>
                  {room.roomName}
                </h3>
                <Link
                  to="/rooms"
                  className="inline-flex items-center gap-2 border border-gold-400 text-gold-600 hover:bg-gold-400 hover:text-navy-900 transition-all duration-300"
                  style={{ fontSize: '10px', letterSpacing: '0.2em', padding: '9px 22px' }}
                >
                  VIEW ROOM <ChevronRight size={10} />
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ---- INSTAGRAM REELS ----
const INSTAGRAM_REELS = [
  'DaUwfX8P8C5', 'DZVPEwAvLqi', 'DZXZq3gPSdO', 'DZC_FbbvsGh', 'DZKhG7Xvt78',
  'DZAm5ESPf2m', 'DY-ID9cvZ60', 'DY-ISiyvRhG', 'DY49CHePHFC', 'DYuhN0uvvzt',
  'DYe1jEzPDbU', 'DYV-HmPvk9V', 'DYSWlKlvTsr', 'DYPuQeEvBNw', 'DYPuk5bPNJh',
  'DX4aZADPMLE', 'DX0rX5LvdlP', 'DVjQ8VOj3_u', 'DS8HT8ZkgYo', 'DR02Cn1Ejx2',
  'DRrymMYktEd', 'DRhbL-_EuLO', 'DReESz1kmYs', 'DReBw7yksRO', 'DRbgAqSknhe',
  'DRbZl2gEiXO', 'DQ2OB4IEzdC', 'DNVDrtnPt5l', 'DCdphfasngv', 'DCQnffFPwfs',
]

function InstagramReelCard({ code }: { code: string }) {
  const [loaded, setLoaded] = useState(false)
  const [showEmbed, setShowEmbed] = useState(false)
  const url = `https://www.instagram.com/reel/${code}/`

  if (showEmbed) {
    return (
      <div
        className="flex-shrink-0 rounded-xl overflow-hidden"
        style={{ width: 280, height: 500, boxShadow: '0 4px 24px rgba(0,0,0,0.14)', background: '#000', position: 'relative' }}
      >
        <iframe
          src={`https://www.instagram.com/reel/${code}/embed/`}
          width="280"
          height="500"
          frameBorder="0"
          scrolling="no"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          style={{ display: 'block', opacity: loaded ? 1 : 0, transition: 'opacity 0.4s' }}
          title={`Instagram reel`}
          onLoad={() => setLoaded(true)}
        />
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)' }}>
            <div className="w-8 h-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
          </div>
        )}
      </div>
    )
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={e => { e.preventDefault(); setShowEmbed(true) }}
      className="flex-shrink-0 rounded-xl overflow-hidden cursor-pointer group"
      style={{ width: 280, height: 500, boxShadow: '0 4px 24px rgba(0,0,0,0.14)', display: 'flex', flexDirection: 'column', textDecoration: 'none', background: 'linear-gradient(135deg,#833ab4 0%,#fd1d1d 50%,#fcb045 100%)' }}
    >
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-3" style={{ background: 'rgba(0,0,0,0.25)' }}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
        </svg>
        <span style={{ color: 'white', fontSize: 12, fontWeight: 600, letterSpacing: '0.04em' }}>skystayresorts</span>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, marginLeft: 'auto' }}>Reels</span>
      </div>

      {/* Center play area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        {/* Play button */}
        <div
          className="group-hover:scale-110 transition-transform duration-300"
          style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', border: '2.5px solid rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
        >
          <svg viewBox="0 0 24 24" width="32" height="32" fill="white" style={{ marginLeft: 4 }}>
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
        <p style={{ color: 'white', fontSize: 13, fontWeight: 600, letterSpacing: '0.05em' }}>Tap to Watch</p>

        {/* Reel indicator lines */}
        <div className="flex items-end gap-1" style={{ height: 32 }}>
          {[14,22,18,28,16,24,20,26,15,19].map((h, i) => (
            <div key={i} style={{ width: 3, height: h, background: 'rgba(255,255,255,0.5)', borderRadius: 2 }} />
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="px-4 pb-4 pt-3" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, lineHeight: 1.5 }}>
          Sky Stay Resorts · Yercaud
        </p>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10, marginTop: 2 }}>
          Guest experience reel ▶
        </p>
      </div>
    </a>
  )
}

function InstagramReviews() {
  const doubled = [...INSTAGRAM_REELS, ...INSTAGRAM_REELS]
  return (
    <section className="py-20 overflow-hidden" style={{ background: '#fdf6ee' }}>
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <p className="section-label mb-3">ON INSTAGRAM</p>
        <div className="section-ornament">◆</div>
        <h2 className="font-serif text-navy-900 mt-3 font-light" style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', letterSpacing: '0.02em' }}>
          ❤ Guest Stories
        </h2>
        <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
          Real guests, real moments — tap any card to watch the reel from our visitors at Sky Stay Resorts.
        </p>
        <a
          href="https://www.instagram.com/skystayresorts"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 font-semibold tracking-widest uppercase"
          style={{ fontSize: 10, color: '#c9a84c', letterSpacing: '0.2em' }}
        >
          @skystayresorts &nbsp;
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
          </svg>
        </a>
      </div>

      {/* Auto-scroll marquee */}
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        <div style={{ position:'absolute', left:0, top:0, bottom:0, width:80, background:'linear-gradient(to right, #fdf6ee, transparent)', zIndex:2, pointerEvents:'none' }} />
        <div style={{ position:'absolute', right:0, top:0, bottom:0, width:80, background:'linear-gradient(to left, #fdf6ee, transparent)', zIndex:2, pointerEvents:'none' }} />
        <div className="instagram-marquee-track" style={{ display:'flex', gap:12, width:'max-content', paddingBottom:8, alignItems:'flex-start' }}>
          {doubled.map((code, i) => (
            <InstagramReelCard key={`${code}-${i}`} code={code} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// HOME PAGE
// ============================================
const GALLERY_TABS = [
  {
    key: 'stay',
    label: 'Stay',
    images: [
      '/gallery-room-1.jpg', '/gallery-room-2.jpg', '/gallery-room-3.jpg', '/gallery-room-4.jpg',
      '/gallery-room-5.jpg', '/gallery-room-6.jpg', '/gallery-room-7.jpg', '/gallery-room-8.jpg',
    ],
  },
  {
    key: 'dining',
    label: 'Dining',
    images: ['/gallery-dining-1.jpg'],
  },
  {
    key: 'corporate',
    label: 'Corporate Events',
    images: [
      '/gallery-hall-1.jpg', '/gallery-hall-2.jpg', '/gallery-hall-3.jpg',
      '/gallery-hall-4.jpg', '/gallery-hall-5.jpg', '/gallery-meeting-hall.jpg',
    ],
  },
  {
    key: 'family',
    label: 'Family Activities',
    images: [
      '/gallery-bonfire.jpg', '/gallery-carrom.jpg', '/gallery-chess.jpg',
      '/gallery-kids-play.jpg', '/gallery-kids-playing.jpg',
    ],
  },
]

function LifeAtSkyStay() {
  const [activeTab, setActiveTab] = useState(0)
  const tab = GALLERY_TABS[activeTab]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <p className="section-label mb-3">RESORT GALLERY</p>
          <div className="section-ornament">◆</div>
          <h2 className="text-3xl md:text-4xl font-serif text-navy-900 mt-3">Life at Sky Stay</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
            A glimpse into the moments, spaces, and nature that define a stay at our hill sanctuary.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {GALLERY_TABS.map((t, i) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(i)}
              className="transition-all duration-200 font-sans text-xs font-semibold tracking-widest uppercase px-5 py-2.5 rounded-full border"
              style={activeTab === i
                ? { background: '#c9a84c', color: '#fff', borderColor: '#c9a84c' }
                : { background: 'transparent', color: '#6b7280', borderColor: '#e5e7eb' }
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Image grid */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          {tab.images.map((src, i) => (
            <motion.div
              key={src}
              className="overflow-hidden group cursor-pointer"
              style={{ borderRadius: 12, aspectRatio: '4/3' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
            >
              <img
                src={src}
                alt={`${tab.label} ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-10">
          <Link to="/gallery" className="btn-luxury text-sm">
            VIEW FULL GALLERY <ChevronRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  const { data: offersData }  = useQuery({ queryKey:['offers'], queryFn:() => offersService.getAll().then(r=>r.data), placeholderData:{ data: OFFERS } })
  const { data: googleData }  = useQuery({ queryKey:['google-reviews'], queryFn:() => googleReviewsService.getAll(), staleTime: 3600000 })
  const offers  = offersData?.data  || OFFERS
  const googleRevs      = googleData?.reviews ?? []
  const overallRating   = googleData?.overallRating ?? 4.9
  const totalRatings    = googleData?.totalRatings ?? null

  const [scratchOffer, setScratchOffer] = useState<typeof OFFERS[0] | null>(null)

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ===== HERO ===== */}
      <section className="relative bg-navy-900 flex flex-col lg:flex lg:min-h-screen overflow-hidden" style={{ minHeight: '100svh' }}>
        <HeroVideo />

        {/* Hero text */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 w-full pt-40 md:pt-52 pb-10 lg:pb-56">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
              className="text-gold-400 text-[10px] md:text-[11px] tracking-[4px] md:tracking-[5px] mb-3 md:mb-4"
            >
              TAMIL NADU · EST. 2018
            </motion.p>
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-3"
              style={{ fontFamily: "'PT Sans', 'Poppins', sans-serif", fontWeight: 700 }}
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.13, delayChildren: 0.3 } } }}
            >
              {['Where', 'Luxury'].map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-[0.3em]"
                  variants={{
                    hidden: { opacity: 0, y: 48, filter: 'blur(10px)' },
                    show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  {word}
                </motion.span>
              ))}
              <br />
              {[
                { text: 'Meets',    cls: 'text-white' },
                { text: 'Serenity', cls: 'text-gold-400' },
              ].map((w, i) => (
                <motion.span
                  key={i}
                  className={`inline-block mr-[0.3em] ${w.cls}`}
                  variants={{
                    hidden: { opacity: 0, y: 48, filter: 'blur(10px)' },
                    show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  {w.text}
                </motion.span>
              ))}
            </motion.h1>
            <motion.p
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.38 }}
              className="text-gold-300 text-sm md:text-base tracking-widest uppercase mb-4 md:mb-6"
            >
              Experience the Art of Peaceful Living
            </motion.p>
            <motion.p
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.45 }}
              className="text-gray-300 text-base md:text-lg leading-relaxed"
            >
              Nestled amidst the scenic hills of Tamil Nadu, Sky Stay Resorts offers luxurious stays, panoramic views, exceptional hospitality, and unforgettable experiences designed to refresh your body, mind, and soul.
            </motion.p>
          </div>
        </div>

      </section>

      {/* ===== ABOUT STRIP ===== */}
      <section className="bg-navy-700 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[['20+','Luxury Suites'],['4.9★','Guest Rating'],['95%','Return Guests'],['3+','Years of Excellence']].map(([n,l]) => (
              <div key={l} className="text-center">
                <div className="font-serif font-light text-gold-400 mb-1" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', letterSpacing: '0.02em' }}>{n}</div>
                <div className="font-sans text-navy-300" style={{ fontSize: '9px', letterSpacing: '0.2em' }}>{l.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ===== ROOM CAROUSEL ===== */}
      <RoomCarousel items={ROOMS} />

      {/* ===== AMENITIES ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader label="Facilities" title="World-Class Amenities" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {amenities.map(({ icon: Icon, label, desc }, idx) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.07, duration: 0.5 }}
                whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(27,43,107,0.11)' }}
                className="bg-white rounded-xl border border-cream-200 p-4 md:p-8 text-center cursor-default"
                style={{ boxShadow: '0 2px 8px rgba(27,43,107,0.06)' }}
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: '#f5ede0' }}>
                  <Icon size={24} className="text-navy-700" />
                </div>
                <h3 className="font-serif text-navy-700 mb-2" style={{ fontSize: '1rem', fontWeight: 500 }}>{label}</h3>
                <p className="font-sans font-light text-gray-400" style={{ fontSize: '12px', lineHeight: 1.6 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EXPERIENCES ===== */}
      <ExperienceShowcase />

      {/* ===== GOOGLE REVIEWS ===== */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader label="Guest Reviews" title="What Our Guests Say" />

          {/* Google rating summary */}
          <div className="flex flex-col items-center gap-3 -mt-8 mb-12">
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={28} className={i <= Math.round(overallRating) ? 'fill-gold-400 text-gold-400' : 'text-cream-200'} />
              ))}
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-serif text-navy-700 font-bold" style={{ fontSize: '2rem' }}>{overallRating.toFixed(1)}</span>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="font-sans text-gray-500 text-sm font-medium">Google Reviews</span>
                </div>
                {totalRatings && (
                  <span className="font-sans text-gray-400 text-xs">{totalRatings.toLocaleString('en-IN')} reviews</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Infinite auto-scroll marquee — full width */}
        {(() => {
          const reviewList = googleRevs.length > 0 ? googleRevs : [
            { name:'Priya Ramesh',  rating:5, comment:'Absolutely magical! The valley views from our suite took our breath away. Staff was extremely warm and attentive.', date:'Dec 2025', profilePhoto:null },
            { name:'Arun Krishnan', rating:5, comment:'Best anniversary gift to my wife. The romance suite was adorned beautifully. Hospitality is top-notch!', date:'Nov 2025', profilePhoto:null },
            { name:'Meena Sundar',  rating:5, comment:'The pool villa is worth every rupee. Woke up to absolute silence and nature. Will be back soon!', date:'Oct 2025', profilePhoto:null },
            { name:'Karthik Raja',  rating:5, comment:'Perfect family getaway. The cottage was cozy and the bonfire night was truly unforgettable for the kids. Highly recommended!', date:'Sep 2025', profilePhoto:null },
            { name:'Divya Nair',    rating:5, comment:'Celebrated our honeymoon here. Everything was curated to perfection — roses, champagne, the works! A dream stay.', date:'Aug 2025', profilePhoto:null },
          ]
          const doubled = [...reviewList, ...reviewList]
          const ReviewCard = ({ r, i }: { r: any; i: number }) => (
            <div
              key={i}
              className="flex-shrink-0 bg-cream-50 border border-cream-200 rounded-xl p-6 flex flex-col"
              style={{ width: 360, boxShadow: '0 2px 8px rgba(27,43,107,0.05)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(j => (
                    <Star key={j} size={13} className={j <= (r.rating ?? 5) ? 'fill-gold-400 text-gold-400' : 'text-cream-200'} />
                  ))}
                </div>
                <svg viewBox="0 0 24 24" width="14" height="14" xmlns="http://www.w3.org/2000/svg" className="opacity-60">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <p className="font-sans font-light text-gray-600 leading-relaxed flex-1 mb-5 line-clamp-3"
                style={{ fontSize: '13px', fontStyle: 'italic' }}>
                "{r.comment}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-cream-200">
                {r.profilePhoto
                  ? <img src={r.profilePhoto} alt={r.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" referrerPolicy="no-referrer" />
                  : <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center text-white flex-shrink-0"
                      style={{ fontSize: '11px', fontWeight: 600 }}>
                      {r.name?.split(' ').map((n: string) => n[0]).join('').slice(0,2)}
                    </div>
                }
                <div>
                  <p className="font-sans text-navy-700" style={{ fontSize: '13px', fontWeight: 600 }}>{r.name}</p>
                  <p className="font-sans font-light text-gray-400" style={{ fontSize: '11px' }}>{r.date}</p>
                </div>
              </div>
            </div>
          )
          return (
            <div style={{ overflow: 'hidden', position: 'relative' }}>
              {/* fade edges */}
              <div style={{ position:'absolute', left:0, top:0, bottom:0, width:80, background:'linear-gradient(to right, white, transparent)', zIndex:2, pointerEvents:'none' }} />
              <div style={{ position:'absolute', right:0, top:0, bottom:0, width:80, background:'linear-gradient(to left, white, transparent)', zIndex:2, pointerEvents:'none' }} />
              <div className="reviews-marquee-track" style={{ display:'flex', gap:24, width:'max-content', paddingBottom:8 }}>
                {doubled.map((r, i) => <ReviewCard key={i} r={r} i={i} />)}
              </div>
            </div>
          )
        })()}
      </section>

      {/* ===== INSTAGRAM GUEST REELS ===== */}
      <InstagramReviews />

      {/* ===== YERCAUD VIEW POINTS ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader label="Explore Yercaud" title="Best View Points Near Us" subtitle="Discover the most scenic and memorable spots around Yercaud — all within easy reach of Sky Stay Resorts." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {VIEWPOINTS.map((vp, i) => <ViewPointCard key={vp.name} vp={vp} i={i} />)}
          </div>
        </div>
      </section>


      {/* ===== FINAL CTA ===== */}
      <section className="relative py-32 overflow-hidden">
        <img src="/cta-bg.jpg" alt="Sky Stay Resort" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy-900/75" />
        <div className="relative z-10 text-center max-w-xl mx-auto px-6">
          <p className="font-sans text-gold-400 mb-4" style={{ fontSize: '10px', letterSpacing: '0.35em' }}>YOUR ESCAPE AWAITS</p>
          <div className="flex items-center justify-center gap-3 mb-6 text-gold-400">
            <span style={{ display: 'block', width: 30, height: 1, background: 'currentColor', opacity: 0.5 }} />
            <span style={{ fontSize: 8 }}>◆</span>
            <span style={{ display: 'block', width: 30, height: 1, background: 'currentColor', opacity: 0.5 }} />
          </div>
          <h2 className="font-serif font-light text-white mb-5" style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', letterSpacing: '0.02em' }}>Ready to Create Memories?</h2>
          <p className="font-sans font-light text-white/55 leading-relaxed mb-10" style={{ fontSize: '14px' }}>
            Contact us directly for the best rates, complimentary breakfast, and personalised service.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/contact" className="bg-gold-400 hover:bg-gold-300 text-navy-900 transition-all duration-300"
              style={{ fontSize: '9px', letterSpacing: '0.25em', padding: '13px 32px', fontWeight: 700 }}>
              CONTACT US
            </Link>
            <a href="https://wa.me/919003010567" target="_blank" rel="noopener noreferrer"
              className="border border-white/50 text-white hover:border-white hover:bg-white hover:text-navy-900 transition-all duration-300"
              style={{ fontSize: '9px', letterSpacing: '0.25em', padding: '13px 32px' }}>
              WHATSAPP US
            </a>
          </div>
        </div>
      </section>

      {/* ── RESORT PHOTO GALLERY ── */}
      <LifeAtSkyStay />

      {/* ===== SEO CONTENT ===== */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="section-label mb-3">WHY CHOOSE US</p>
            <div className="section-ornament">◆</div>
            <h2 className="text-3xl md:text-4xl font-serif text-navy-900 mt-3">Best Resort in Salem | Premium Family Resort Near Yercaud</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10 text-sm text-gray-600 leading-relaxed">
            <div>
              <h3 className="font-serif text-navy-900 text-xl mb-3">Best Family Resort in Salem</h3>
              <p className="mb-4">Sky Stay Resort is recognized as one of the best family resorts in Salem, offering spacious luxury rooms, premium villas, exciting outdoor activities, and entertainment for guests of every age. Perfect for family vacations, weekend trips, corporate outings, birthday celebrations, and anniversary parties.</p>
              <h3 className="font-serif text-navy-900 text-xl mb-3">Kids Best Resort in Salem</h3>
              <p>Our kid-friendly resort features children's play area, indoor games, outdoor games, open green lawn, family campfire, nature walks, and photography spots — making Sky Stay Resort the perfect destination for unforgettable family memories.</p>
            </div>
            <div>
              <h3 className="font-serif text-navy-900 text-xl mb-3">Premium Resort in Salem & Best Resort in Yercaud</h3>
              <p className="mb-4">Enjoy luxury like never before at our premium resort in Salem. Featuring luxury family rooms, executive suites, premium villas, valley view rooms, multi-cuisine restaurant, 24×7 room service, free Wi-Fi, private parking, event hall, conference facilities, bonfire nights, and scenic hill views.</p>
              <h3 className="font-serif text-navy-900 text-xl mb-3">Luxury Resort Near Salem</h3>
              <p>Searching for a resort near me? Sky Stay Resort is the top-rated luxury resort near Salem — perfect for couples, families, and corporate groups seeking a weekend resort in Salem with hill views and premium hospitality.</p>
            </div>
          </div>
          <div className="mt-10 p-6 bg-white rounded-lg border border-gold-200">
            <h3 className="font-serif text-navy-900 text-xl mb-4 text-center">Nearby Attractions</h3>
            <div className="flex flex-wrap gap-3 justify-center text-xs text-gray-500">
              {['Yercaud Lake','Lady\'s Seat','Pagoda Point','Kiliyur Falls','Botanical Garden','Anna Park','Rose Garden','Silk Farm','Bear\'s Cave'].map(place => (
                <span key={place} className="px-3 py-1 bg-cream-50 border border-gold-200 rounded-full">{place}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {scratchOffer && (
        <ScratchCard
          offer={scratchOffer}
          onClose={() => setScratchOffer(null)}
        />
      )}
    </div>
  )
}

