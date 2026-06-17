import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, User, LogOut, Bell } from 'lucide-react'
import { useAuthStore } from '@/store'

const navLinks = [
  { label: 'Home', href: '/' },
  {
    label: 'Rooms',
    href: '/rooms',
    dropdown: [
      { label: 'Deluxe Garden Room', href: '/rooms/deluxe-garden-room' },
      { label: 'Premium Valley Suite', href: '/rooms/premium-valley-suite' },
      { label: 'Luxury Pool Villa', href: '/rooms/luxury-pool-villa' },
      { label: 'Forest Retreat Cottage', href: '/rooms/forest-retreat-cottage' },
      { label: 'Horizon Penthouse', href: '/rooms/horizon-penthouse' },
      { label: 'Romance Suite', href: '/rooms/romance-suite' },
    ],
  },
  { label: 'Amenities', href: '/amenities' },
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

  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const navBg = isHome
    ? scrolled ? 'bg-navy-700/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    : 'bg-navy-700 shadow-lg'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img
              src="/logo.svg"
              alt="Sky Stay Resorts"
              className="h-10 w-10 lg:h-12 lg:w-12 rounded-sm object-contain"
            />
            <div>
              <div className="font-serif text-white text-lg lg:text-xl font-bold leading-tight tracking-wide">
                Sky Stay
              </div>
              <div className="text-gold-400 text-[10px] lg:text-xs tracking-[3px] font-light -mt-0.5">
                RESORTS
              </div>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => link.dropdown && setActiveDropdown(link.href)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={link.href}
                  className={`flex items-center gap-1 text-sm tracking-wide transition-colors ${
                    location.pathname === link.href
                      ? 'text-gold-400'
                      : 'text-gray-200 hover:text-gold-400'
                  }`}
                >
                  {link.label}
                  {link.dropdown && <ChevronDown size={14} />}
                </Link>

                {/* Dropdown */}
                <AnimatePresence>
                  {link.dropdown && activeDropdown === link.href && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-navy-700 border border-gold-400/20 rounded shadow-xl overflow-hidden"
                    >
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-navy-600 hover:text-gold-400 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="hidden lg:flex items-center gap-3">
                <Link to="/portal/notifications" className="relative p-2 text-gray-300 hover:text-gold-400">
                  <Bell size={18} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-gold-400 rounded-full" />
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 text-sm text-gray-200 hover:text-gold-400">
                    <div className="w-8 h-8 rounded-full bg-gold-400/20 border border-gold-400/40 flex items-center justify-center">
                      <User size={14} className="text-gold-400" />
                    </div>
                    <span>{user?.name.split(' ')[0]}</span>
                    <ChevronDown size={14} />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-navy-700 border border-gold-400/20 rounded shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link to="/portal/bookings" className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-navy-600 hover:text-gold-400">My Bookings</Link>
                    <Link to="/portal/profile" className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-navy-600 hover:text-gold-400">My Profile</Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin/dashboard" className="block px-4 py-2.5 text-sm text-gold-400 hover:bg-navy-600">Admin Panel</Link>
                    )}
                    <div className="border-t border-white/10" />
                    <button
                      onClick={logout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-navy-600 hover:text-red-400"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden lg:block text-sm text-gray-300 hover:text-gold-400 transition-colors"
              >
                Login
              </Link>
            )}

            {/* MOBILE HAMBURGER */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-gold-400"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-navy-800 border-t border-gold-400/20 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block py-2.5 px-3 text-gray-200 hover:text-gold-400 hover:bg-navy-700 rounded text-sm"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-white/10 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/portal/bookings" className="block py-2.5 px-3 text-gray-200 hover:text-gold-400 text-sm">My Account</Link>
                    <button onClick={logout} className="block py-2.5 px-3 text-red-400 text-sm">Logout</button>
                  </>
                ) : (
                  <Link to="/login" className="block py-2.5 px-3 text-gray-200 hover:text-gold-400 text-sm">Login / Register</Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
