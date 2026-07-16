import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, User, LogOut, Phone } from 'lucide-react'
import { useAuthStore } from '@/store'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Rooms', href: '/rooms' },
  {
    label: 'Amenities',
    href: '/amenities',
    dropdown: [
      { label: 'Resort Amenities', href: '/amenities' },
      { label: 'Resort Activities', href: '/resort-activities' },
      { label: 'Places to Visit', href: '/places-to-visit' },
    ],
  },
  { label: 'Facilities', href: '/facilities' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Offers', href: '/offers' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { isAuthenticated, user, logout } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  return (
    <>
      {/* Floating pill navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4" style={{ paddingTop: '35px' }}>
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-6xl"
        >
          {/* Pill container */}
          <div
            className="flex items-center justify-between px-6 lg:px-10 transition-all duration-300"
            style={{
              background: '#ffffff',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              borderRadius: '50px',
              boxShadow: scrolled
                ? '0 8px 40px rgba(11,18,50,0.18), 0 2px 8px rgba(0,0,0,0.08)'
                : '0 4px 24px rgba(11,18,50,0.12)',
              height: '85px',
              border: '1px solid rgba(201,168,76,0.18)',
            }}
          >
            {/* LOGO */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img
                src="/logo3.jpg"
                alt="Sky Stay Resorts"
                className="w-auto object-contain"
                style={{ height: '66px', borderRadius: '10px' }}
              />
            </Link>

            {/* DESKTOP NAV — centered links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => link.dropdown && setActiveDropdown(link.href)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      to={link.href}
                      className="flex items-center gap-1 px-3 py-2 rounded-full transition-all duration-200 font-sans"
                      style={{
                        fontSize: '13px',
                        letterSpacing: '0.06em',
                        fontWeight: isActive ? 700 : 600,
                        color: isActive ? '#c9a84c' : '#1b2b6b',
                        background: isActive ? 'rgba(201,168,76,0.08)' : 'transparent',
                      }}
                      onMouseEnter={e => {
                        if (!isActive) (e.currentTarget as HTMLElement).style.color = '#c9a84c'
                      }}
                      onMouseLeave={e => {
                        if (!isActive) (e.currentTarget as HTMLElement).style.color = '#1b2b6b'
                      }}
                    >
                      {link.label}
                      {link.dropdown && <ChevronDown size={11} className="ml-0.5 opacity-60" />}
                    </Link>

                    {/* Dropdown */}
                    <AnimatePresence>
                      {link.dropdown && activeDropdown === link.href && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-2 w-52 overflow-hidden shadow-xl"
                          style={{
                            background: 'rgba(255,255,255,0.98)',
                            borderRadius: '14px',
                            border: '1px solid rgba(201,168,76,0.15)',
                          }}
                        >
                          {link.dropdown.map((item, idx) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              className="block px-5 py-3 transition-colors"
                              style={{
                                fontSize: '11px',
                                letterSpacing: '0.05em',
                                fontWeight: 600,
                                color: '#1b2b6b',
                                borderBottom: idx < link.dropdown!.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                              }}
                              onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.06)'
                                ;(e.currentTarget as HTMLElement).style.color = '#c9a84c'
                              }}
                              onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.background = 'transparent'
                                ;(e.currentTarget as HTMLElement).style.color = '#1b2b6b'
                              }}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>

            {/* RIGHT — phone + book now */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href="tel:+919003010567"
                className="flex items-center gap-2 font-sans font-semibold transition-colors"
                style={{ fontSize: '14px', color: '#0b1232', letterSpacing: '0.02em' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#c9a84c'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#0b1232'}
              >
                <Phone size={13} className="text-gold-500" />
                +91 90030 10567
              </a>

              <a
                href="https://wa.me/919003010567?text=Hello%20Sky%20Stay%20Resorts%2C%20I%20would%20like%20to%20book%20a%20room."
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans font-semibold transition-all duration-300"
                style={{
                  fontSize: '12px',
                  letterSpacing: '0.12em',
                  padding: '10px 26px',
                  background: '#0b1232',
                  color: '#c9a84c',
                  borderRadius: '50px',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = '#c9a84c'
                  ;(e.currentTarget as HTMLElement).style.color = '#0b1232'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = '#0b1232'
                  ;(e.currentTarget as HTMLElement).style.color = '#c9a84c'
                }}
              >
                BOOK NOW
              </a>

              {isAuthenticated && (
                <div className="relative group">
                  <button className="flex items-center gap-2 transition-colors" style={{ color: '#1b2b6b' }}>
                    <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center" style={{ borderColor: '#c9a84c' }}>
                      <User size={13} style={{ color: '#c9a84c' }} />
                    </div>
                  </button>
                  <div
                    className="absolute right-0 top-full mt-3 w-44 overflow-hidden shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.98)', borderRadius: '14px', border: '1px solid rgba(201,168,76,0.15)' }}
                  >
                    {[['My Bookings', '/portal/bookings'], ['My Profile', '/portal/profile']].map(([label, href]) => (
                      <Link key={href} to={href} className="block px-5 py-3 border-b border-black/5 transition-colors"
                        style={{ fontSize: '11px', letterSpacing: '0.05em', color: '#1b2b6b' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#c9a84c'; (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.06)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#1b2b6b'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                        {label}
                      </Link>
                    ))}
                    {user?.role === 'admin' && (
                      <Link to="/admin/dashboard" className="block px-5 py-3 border-b border-black/5" style={{ fontSize: '11px', color: '#c9a84c' }}>Admin Panel</Link>
                    )}
                    <button onClick={logout} className="w-full text-left flex items-center gap-2 px-5 py-3 transition-colors"
                      style={{ fontSize: '11px', color: '#9ca3af' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#ef4444'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#9ca3af'}>
                      <LogOut size={11} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* MOBILE hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-full transition-colors"
              style={{ color: '#1b2b6b' }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* MOBILE MENU — also pill-shaped below the header */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="mt-2 overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.97)',
                  backdropFilter: 'blur(18px)',
                  borderRadius: '24px',
                  border: '1px solid rgba(201,168,76,0.15)',
                  boxShadow: '0 8px 32px rgba(11,18,50,0.14)',
                }}
              >
                <div className="px-6 py-4 space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="block py-3 px-3 rounded-xl transition-colors font-sans"
                      style={{
                        fontSize: '13px',
                        letterSpacing: '0.04em',
                        color: location.pathname === link.href ? '#c9a84c' : '#1b2b6b',
                        background: location.pathname === link.href ? 'rgba(201,168,76,0.08)' : 'transparent',
                        fontWeight: location.pathname === link.href ? 600 : 400,
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="pt-3 flex flex-col gap-2">
                    <a href="tel:+919003010567" className="flex items-center gap-2 px-3 py-3 font-semibold" style={{ fontSize: '13px', color: '#0b1232' }}>
                      <Phone size={14} style={{ color: '#c9a84c' }} /> +91 90030 10567
                    </a>
                    <a href="https://wa.me/919003010567?text=Hello%20Sky%20Stay%20Resorts%2C%20I%20would%20like%20to%20book%20a%20room."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center py-3 font-semibold rounded-full"
                      style={{ fontSize: '12px', letterSpacing: '0.12em', background: '#0b1232', color: '#c9a84c' }}>
                      BOOK NOW
                    </a>
                    {isAuthenticated && (
                      <button onClick={logout} className="block w-full text-center py-3 rounded-full" style={{ fontSize: '12px', color: '#9ca3af' }}>
                        Logout
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>

    </>
  )
}
