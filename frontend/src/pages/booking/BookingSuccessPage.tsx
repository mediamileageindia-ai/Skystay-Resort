import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, ArrowRight, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import { useBookingStore } from '@/store'

export function BookingSuccessPage() {
  const [params] = useSearchParams()
  const bookingNumber = params.get('ref') || 'SKY-2025-XXXX'
  const { selectedRoomName, checkIn, checkOut, getTotalAmount, reset } = useBookingStore()

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-16 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full mx-4"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-600 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={36} className="text-green-600" />
          </div>
          <p className="text-[11px] tracking-[4px] text-gold-500 mb-2">BOOKING CONFIRMED</p>
          <h1 className="font-serif text-3xl text-navy-700 mb-1">{bookingNumber}</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
            Your booking is confirmed. A confirmation has been sent to your email and WhatsApp.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm p-6 mb-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Room</span>
            <span className="text-navy-700 font-medium">{selectedRoomName || 'Sky Stay Room'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Check-in</span>
            <span className="text-navy-700">{checkIn || '—'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Check-out</span>
            <span className="text-navy-700">{checkOut || '—'}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-gray-100 pt-3">
            <span className="text-gray-500">Amount paid</span>
            <span className="text-gold-500 font-medium">₹{getTotalAmount().toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Check-in info */}
        <div className="bg-navy-700 rounded-sm p-4 mb-6 text-sm text-white space-y-1">
          <p className="text-gold-400 text-xs tracking-[1px] mb-2">CHECK-IN INFORMATION</p>
          <p>📍 Sky Stay Resorts, Kodaikanal Road, Tamil Nadu 624101</p>
          <p>⏰ Check-in from 2:00 PM · Check-out by 11:00 AM</p>
          <p>📞 <a href="tel:+919876543210" className="text-gold-400">+91 98765 43210</a></p>
        </div>

        <div className="flex gap-3">
          <Link to="/portal/bookings" onClick={reset}
            className="flex-1 bg-gold-400 hover:bg-gold-300 text-navy-800 font-medium text-xs tracking-[2px] py-3 rounded-sm text-center transition-colors">
            VIEW MY BOOKINGS
          </Link>
          <Link to="/" onClick={reset}
            className="flex-1 border border-gold-400 text-gold-500 text-xs tracking-[2px] py-3 rounded-sm text-center hover:bg-gold-50 transition-colors">
            BACK TO HOME
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export function BookingFailurePage() {
  const { reset } = useBookingStore()

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-16 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full mx-4 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-red-50 border-2 border-red-500 flex items-center justify-center mx-auto mb-5">
          <XCircle size={36} className="text-red-500" />
        </div>
        <p className="text-[11px] tracking-[4px] text-red-500 mb-2">PAYMENT FAILED</p>
        <h1 className="font-serif text-3xl text-navy-700 mb-3">Something went wrong</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Your payment could not be processed. No amount has been charged. Please try again or contact us for assistance.
        </p>

        <div className="space-y-3">
          <Link to="/booking"
            className="w-full flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-300 text-navy-800 font-medium text-xs tracking-[2px] py-3 rounded-sm transition-colors">
            TRY AGAIN <ArrowRight size={14} />
          </Link>
          <a href="tel:+919876543210"
            className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 text-xs tracking-[1px] py-3 rounded-sm hover:bg-gray-50 transition-colors">
            <Phone size={14} /> CALL US — +91 98765 43210
          </a>
          <Link to="/" onClick={reset}
            className="block text-sm text-gray-400 hover:text-gray-600 transition-colors pt-2">
            Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
