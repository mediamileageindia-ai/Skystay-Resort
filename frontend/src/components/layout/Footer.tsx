import { Link } from 'react-router-dom'
import { Mail, Phone } from 'lucide-react'

const IconFacebook = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
)
const IconWhatsApp = () => (
  <svg viewBox="0 0 32 32" width="20" height="20" fill="currentColor">
    <path d="M16.003 2C8.28 2 2 8.28 2 16.003c0 2.47.643 4.79 1.77 6.802L2 30l7.397-1.74A13.94 13.94 0 0 0 16.003 30C23.72 30 30 23.72 30 16.003 30 8.28 23.72 2 16.003 2zm0 25.452a11.4 11.4 0 0 1-5.817-1.596l-.418-.248-4.39 1.033 1.058-4.277-.272-.44A11.388 11.388 0 0 1 4.61 16c0-6.285 5.112-11.394 11.393-11.394 6.282 0 11.394 5.11 11.394 11.394 0 6.283-5.112 11.452-11.394 11.452zm6.254-8.546c-.344-.172-2.035-1.004-2.35-1.118-.315-.115-.544-.172-.773.172-.229.344-.887 1.118-1.087 1.347-.2.23-.4.258-.744.086-.344-.172-1.452-.535-2.766-1.706-1.022-.913-1.712-2.04-1.912-2.384-.2-.344-.021-.53.15-.701.155-.154.344-.4.516-.6.172-.2.229-.344.344-.573.115-.23.057-.43-.029-.602-.086-.172-.773-1.863-1.059-2.55-.279-.67-.562-.578-.773-.588l-.659-.011c-.229 0-.6.086-.915.43-.315.344-1.202 1.175-1.202 2.866 0 1.691 1.23 3.324 1.402 3.553.172.229 2.42 3.695 5.863 5.183.82.354 1.459.565 1.958.723.823.261 1.572.224 2.163.136.66-.099 2.035-.831 2.321-1.635.287-.803.287-1.49.201-1.634-.085-.144-.315-.23-.659-.4z"/>
  </svg>
)
const IconYoutube = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const navLinks = [
  { label: 'Home',             to: '/' },
  { label: 'Rooms',            to: '/rooms' },
  { label: 'Amenities',        to: '/amenities' },
  { label: 'Facilities',       to: '/facilities' },
  { label: 'Gallery',          to: '/gallery' },
  { label: 'Offers',           to: '/offers' },
  { label: 'Places to Visit',  to: '/places-to-visit' },
  { label: 'Activities',       to: '/resort-activities' },
  { label: 'Contact Us',       to: '/contact' },
]

const socials = [
  { icon: IconFacebook,  href: 'https://facebook.com',                  label: 'Facebook' },
  { icon: IconInstagram, href: 'https://instagram.com',                  label: 'Instagram' },
  { icon: IconWhatsApp,  href: 'https://wa.me/919003010567',             label: 'WhatsApp' },
  { icon: IconYoutube,   href: 'https://youtube.com',                    label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#f2e4c8' }}>
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-6">

        {/* Top: two columns */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 mb-8">

          {/* LEFT — About */}
          <div className="flex-1 flex flex-col gap-3">
            <h2 className="font-serif text-gray-900" style={{ fontSize: '22px', fontWeight: 700 }}>
              Sky Stay Resorts, Yercaud
            </h2>
            <p className="tracking-[3px] text-gray-700 uppercase" style={{ fontSize: '13px', fontWeight: 800 }}>About Us</p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Sky Stay Resorts is a premium hill resort nestled in the serene mountains of Yercaud, Tamil Nadu. We offer luxurious accommodations, curated experiences, and warm hospitality — making every stay an unforgettable escape into nature.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              10-D, Asambur, Manjakuttai Road,<br />Yercaud - 636602, Tamil Nadu, India
            </p>
          </div>

          {/* RIGHT — Contact + Social */}
          <div className="flex flex-col gap-4">

            {/* Email */}
            <a href="mailto:info@skystayresorts.com"
              className="flex items-center gap-2.5 text-sm text-gray-800 hover:text-gray-900 transition-colors">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#1a1a1a' }}>
                <Mail size={14} className="text-white" />
              </span>
              info@skystayresorts.com
            </a>

            {/* Phone */}
            <div className="flex items-center gap-2.5 text-sm text-gray-800">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 self-center" style={{ background: '#1a1a1a' }}>
                <Phone size={14} className="text-white" />
              </span>
              <div className="flex flex-col" style={{ lineHeight: '1.65' }}>
                <a href="tel:+919003010567" className="hover:text-gray-900 transition-colors">+91 90030 10567</a>
                <a href="tel:+919488867071" className="hover:text-gray-900 transition-colors">+91 94888 67071</a>
              </div>
            </div>

            {/* Social */}
            <div className="flex flex-col gap-2 mt-1">
              <p className="text-sm text-gray-700 font-medium tracking-wide">Get In Touch</p>
              <div className="flex items-center gap-3">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="w-10 h-10 flex items-center justify-center transition-opacity hover:opacity-75"
                    style={{ background: '#1a1a1a', borderRadius: '10px', color: '#fff' }}>
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t" style={{ borderColor: 'rgba(0,0,0,0.15)' }} />

        {/* Bottom: nav + copyright */}
        <div className="pt-5 flex flex-col items-center gap-3">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to}
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>&copy; {new Date().getFullYear()} Sky Stay Resorts. All rights reserved.</span>
            <span className="opacity-40">|</span>
            <Link to="/terms-and-conditions" className="hover:text-gray-800 transition-colors underline underline-offset-2">
              Terms & Conditions
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
