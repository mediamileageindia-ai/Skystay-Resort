import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const SECTIONS = [
  {
    title: '1. Reservations & Booking',
    points: [
      'All reservations are subject to availability and confirmation by Sky Stay Resorts.',
      'A valid government-issued photo ID is required at check-in for all guests.',
      'The resort reserves the right to cancel or modify bookings in exceptional circumstances with prior notice.',
    ],
  },
  {
    title: '2. Check-In & Check-Out',
    points: [
      'Standard check-in time is 1:00 PM and check-out time is 11:00 AM.',
      'Early check-in and late check-out are subject to availability and may incur additional charges.',
      'Guests are requested to carry a valid ID proof at the time of check-in.',
    ],
  },
  {
    title: '3. Cancellation Policy',
    points: [
      'Cancellations made more than 48 hours before the check-in date will receive a full refund.',
      'Cancellations within 48 hours of check-in will forfeit the advance payment.',
      'No-shows will be charged the full booking amount.',
      'Refunds, if applicable, will be processed within 7–10 business days.',
    ],
  },
  {
    title: '4. Payment Terms',
    points: [
      'A minimum advance of 50% of the total booking amount is required to confirm the reservation.',
      'Full payment must be completed at or before check-in.',
      'Accepted payment methods include cash, UPI, credit/debit cards, and bank transfer.',
    ],
  },
  {
    title: '5. Guest Conduct',
    points: [
      'Guests are expected to maintain decorum and respect other guests and resort staff.',
      'Any damage to resort property will be charged to the guest.',
      'The resort follows a strict no-smoking policy in all indoor areas.',
      'Consumption of outside alcohol is not permitted on resort premises.',
    ],
  },
  {
    title: '6. Facilities & Activities',
    points: [
      'Use of resort facilities is subject to availability and operating hours.',
      'Activities such as bonfires and guided treks may require advance booking.',
      'The resort is not responsible for any personal injury during activities undertaken at the guest\'s own risk.',
    ],
  },
  {
    title: '7. Privacy & Data',
    points: [
      'Guest information collected during booking is used solely for reservation and communication purposes.',
      'We do not share personal data with third parties without consent.',
      'By making a booking, guests agree to receive booking-related communications from the resort.',
    ],
  },
  {
    title: '8. Liability',
    points: [
      'Sky Stay Resorts is not liable for loss of personal belongings on the premises.',
      'Guests are advised to use the in-room safe for valuables.',
      'The resort reserves the right to amend these terms at any time without prior notice.',
    ],
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white pt-28">

      {/* Hero */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img src="/banner.jpg" alt="Terms" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-navy-900/60" />
        <div className="absolute top-6 left-0 right-0 max-w-7xl mx-auto px-6">
          <p className="text-sm text-white/70">
            <Link to="/" className="font-medium text-white/80 hover:text-white transition-colors">Home</Link>
            <span className="mx-2 text-white/50">&gt;</span>
            <span>Terms & Conditions</span>
          </p>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="font-serif text-white font-bold" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
            Terms & Conditions
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/70 text-sm mt-2">
            Please read these terms carefully before making a reservation.
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-gray-500 text-sm leading-relaxed mb-10 border-l-4 border-gold-400 pl-4">
          These Terms & Conditions govern the use of facilities and services provided by <strong className="text-navy-700">Sky Stay Resorts, Yercaud</strong>. By making a booking, you agree to abide by the following terms.
        </p>

        <div className="space-y-10">
          {SECTIONS.map((sec, i) => (
            <motion.div
              key={sec.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <h2 className="font-serif text-navy-800 text-lg font-bold mb-3">{sec.title}</h2>
              <ul className="space-y-2">
                {sec.points.map((p, j) => (
                  <li key={j} className="flex gap-3 text-sm text-gray-600 leading-relaxed">
                    <span className="text-gold-500 mt-1 flex-shrink-0">›</span>
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 border-t border-gray-100 pt-8 text-center">
          <p className="text-xs text-gray-400 mb-4">Last updated: July 2026 &nbsp;·&nbsp; Sky Stay Resorts, Yercaud</p>
          <Link to="/contact"
            className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-300 text-navy-800 font-semibold text-xs tracking-[2px] px-8 py-3 rounded-sm transition-colors">
            CONTACT US FOR QUERIES
          </Link>
        </div>
      </div>
    </div>
  )
}
