import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube } from 'lucide-react'

const rooms = [
  { label: 'Deluxe Garden Room',     to: '/rooms/deluxe-garden-room' },
  { label: 'Premium Valley Suite',   to: '/rooms/premium-valley-suite' },
  { label: 'Luxury Pool Villa',      to: '/rooms/luxury-pool-villa' },
  { label: 'Forest Retreat Cottage', to: '/rooms/forest-retreat-cottage' },
  { label: 'Horizon Penthouse',      to: '/rooms/horizon-penthouse' },
  { label: 'Romance Suite',          to: '/rooms/romance-suite' },
]

const quickLinks = [
  { label: 'About Us',         to: '/about' },
  { label: 'Amenities',        to: '/amenities' },
  { label: 'Gallery',          to: '/gallery' },
  { label: 'Offers & Packages',to: '/offers' },
  { label: 'Blog',             to: '/blog' },
  { label: 'Contact Us',       to: '/contact' },
]

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-8" style={{ background: '#c9a84c', clipPath: 'polygon(50% 0%,0% 100%,100% 100%)' }} />
            <div>
              <div className="text-lg font-medium tracking-wide">Sky Stay</div>
              <div className="text-[9px] tracking-[4px] text-gold-400">RESORTS</div>
            </div>
          </div>
          <p className="text-navy-400 text-sm leading-relaxed mb-5">
            A premium resort nestled in Tamil Nadu, offering luxury accommodation, curated experiences, and memories that last a lifetime.
          </p>
          <div className="flex gap-3">
            {[
              { icon: Instagram, href: 'https://instagram.com' },
              { icon: Facebook,  href: 'https://facebook.com' },
              { icon: Youtube,   href: 'https://youtube.com' },
            ].map(({ icon: Icon, href }) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded border border-navy-700 flex items-center justify-center text-navy-400 hover:border-gold-400 hover:text-gold-400 transition-colors">
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Rooms */}
        <div>
          <h3 className="text-xs tracking-[3px] text-gold-400 mb-5">OUR ROOMS</h3>
          <ul className="space-y-2.5">
            {rooms.map(r => (
              <li key={r.to}>
                <Link to={r.to} className="text-navy-400 text-sm hover:text-gold-400 transition-colors">
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xs tracking-[3px] text-gold-400 mb-5">EXPLORE</h3>
          <ul className="space-y-2.5">
            {quickLinks.map(l => (
              <li key={l.to}>
                <Link to={l.to} className="text-navy-400 text-sm hover:text-gold-400 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xs tracking-[3px] text-gold-400 mb-5">REACH US</h3>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <MapPin size={15} className="text-gold-400 mt-0.5 flex-shrink-0" />
              <span className="text-navy-400 text-sm leading-relaxed">Sky Stay Resorts, Kodaikanal Road, Tamil Nadu — 624101</span>
            </li>
            <li className="flex gap-3">
              <Phone size={15} className="text-gold-400 mt-0.5 flex-shrink-0" />
              <a href="tel:+919876543210" className="text-navy-400 text-sm hover:text-gold-400 transition-colors">+91 98765 43210</a>
            </li>
            <li className="flex gap-3">
              <Mail size={15} className="text-gold-400 mt-0.5 flex-shrink-0" />
              <a href="mailto:hello@skystayresorts.com" className="text-navy-400 text-sm hover:text-gold-400 transition-colors">hello@skystayresorts.com</a>
            </li>
          </ul>

          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/919876543210?text=Hi! I'd like to book a stay at Sky Stay Resorts."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-[#25D366] hover:bg-[#1fbc59] text-white text-xs rounded-sm transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-navy-500">
          <span>© {new Date().getFullYear()} Sky Stay Resorts. All rights reserved.</span>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-gold-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms"   className="hover:text-gold-400 transition-colors">Terms of Use</Link>
            <Link to="/cancellation" className="hover:text-gold-400 transition-colors">Cancellation</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
