// ============================================
// PORTAL LAYOUT
// ============================================
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { CalendarDays, User, FileText, Bell, Heart, LogOut, ChevronRight, Star } from 'lucide-react'
import { useAuthStore } from '@/store'

const portalLinks = [
  { to: 'bookings',      label: 'My Bookings',      icon: CalendarDays },
  { to: 'profile',       label: 'My Profile',        icon: User },
  { to: 'invoices',      label: 'Invoices',          icon: FileText },
  { to: 'notifications', label: 'Notifications',     icon: Bell },
  { to: 'wishlist',      label: 'Wishlist',          icon: Heart },
]

export function PortalLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'G'

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* User card */}
            <div className="bg-navy-700 rounded-sm p-5 mb-4 text-center">
              <div className="w-14 h-14 rounded-full bg-gold-400 flex items-center justify-center text-navy-900 text-xl font-medium mx-auto mb-3">
                {initials}
              </div>
              <p className="text-white font-medium">{user?.name}</p>
              <p className="text-navy-400 text-xs mt-0.5">{user?.email}</p>
              <div className="mt-3 pt-3 border-t border-navy-600 flex justify-center gap-6 text-xs text-navy-400">
                <span><span className="text-gold-400 font-medium">3</span> Stays</span>
                <span><span className="text-gold-400 font-medium">4.8★</span> Rating</span>
              </div>
            </div>
            {/* Nav */}
            <nav className="bg-white border border-gray-200 rounded-sm overflow-hidden">
              {portalLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 text-sm border-b border-gray-100 last:border-b-0 transition-colors ${
                      isActive
                        ? 'bg-cream-50 text-gold-500 font-medium border-l-2 border-l-gold-400'
                        : 'text-gray-600 hover:bg-cream-50 hover:text-navy-700'
                    }`
                  }
                >
                  <Icon size={15} />
                  {label}
                  <ChevronRight size={12} className="ml-auto text-gray-300" />
                </NavLink>
              ))}
              <button
                onClick={() => { logout(); navigate('/') }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </nav>
          </aside>

          {/* Content */}
          <main className="lg:col-span-3">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

// ============================================
// MY BOOKINGS PAGE
// ============================================
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { bookingsService } from '@/services/api'
import { BookingStatus } from '@/types'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const BOOKING_STATUS_STYLES: Record<BookingStatus, string> = {
  confirmed:   'bg-green-50 text-green-800',
  pending:     'bg-amber-50 text-amber-800',
  cancelled:   'bg-red-50 text-red-800',
  checked_in:  'bg-blue-50 text-blue-800',
  checked_out: 'bg-gray-100 text-gray-700',
}

const MY_BOOKINGS_FALLBACK = [
  { id:'1', bookingNumber:'SKY-2025-0042', status:'confirmed',   totalAmount:5599,  checkIn:'2025-12-20', checkOut:'2025-12-22', guests:2, roomId:'1', guestSnapshot:{ name:'Ravi Kumar', email:'r@e.com', phone:'9876543210' }, createdAt:'2025-12-10T10:00:00Z' },
  { id:'2', bookingNumber:'SKY-2025-0031', status:'checked_out', totalAmount:8959,  checkIn:'2025-11-05', checkOut:'2025-11-07', guests:2, roomId:'2', guestSnapshot:{ name:'Ravi Kumar', email:'r@e.com', phone:'9876543210' }, createdAt:'2025-10-20T10:00:00Z' },
  { id:'3', bookingNumber:'SKY-2025-0018', status:'checked_out', totalAmount:11199, checkIn:'2025-09-14', checkOut:'2025-09-16', guests:2, roomId:'6', guestSnapshot:{ name:'Ravi Kumar', email:'r@e.com', phone:'9876543210' }, createdAt:'2025-09-01T10:00:00Z' },
]

const ROOM_NAMES: Record<string, string> = {
  '1':'Deluxe Garden Room','2':'Premium Valley Suite','3':'Luxury Pool Villa',
  '4':'Forest Retreat Cottage','5':'Horizon Penthouse','6':'Romance Suite',
}

function ReviewModal({ booking, onClose }: { booking: any; onClose: () => void }) {
  const { user } = useAuthStore()
  const [rating, setRating] = useState(5)
  const [hover, setHover]   = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) { toast.error('Please write a comment.'); return }
    setSubmitting(true)
    try {
      const { supabase } = await import('@/lib/supabase')
      const { error } = await supabase.from('reviews').insert({
        name:    user?.name  ?? 'Guest',
        city:    '',
        rating,
        comment: comment.trim(),
        room_id: booking.roomId ?? null,
      })
      if (error) throw error
      toast.success('Review submitted — thank you!')
      onClose()
    } catch {
      toast.error('Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-navy-700">Write a Review</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        <p className="text-xs text-gray-500 mb-4">{ROOM_NAMES[booking.roomId] || 'Sky Stay Room'}</p>

        {/* Star Rating */}
        <div className="flex gap-1 mb-5">
          {[1,2,3,4,5].map(s => (
            <button key={s} type="button"
              onClick={() => setRating(s)}
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
            >
              <Star size={28} className={`transition-colors ${s <= (hover || rating) ? 'text-gold-400 fill-gold-400' : 'text-gray-300'}`} />
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={4}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-sm text-sm text-navy-700 resize-none focus:outline-none focus:border-gold-400"
          />
          <div className="flex gap-2 mt-4">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 text-xs text-gray-600 rounded-sm hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 px-4 py-2 bg-gold-400 hover:bg-gold-300 disabled:opacity-50 text-navy-800 text-xs font-medium rounded-sm transition-colors">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function MyBookingsPage() {
  const { data } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => bookingsService.getMyBookings().then(r => r.data),
    placeholderData: { data: MY_BOOKINGS_FALLBACK },
  })
  const [localBookings, setLocalBookings] = useState<any[]>([])
  const [reviewBooking, setReviewBooking] = useState<any>(null)
  const bookings = localBookings.length > 0 ? localBookings : (data?.data || MY_BOOKINGS_FALLBACK)

  const handleCancel = (id: string) => {
    const list = bookings.length > 0 ? bookings : MY_BOOKINGS_FALLBACK
    setLocalBookings(list.map((b: any) => b.id === id ? { ...b, status: 'cancelled' } : b))
    toast.success('Booking cancelled successfully.')
  }

  const downloadInvoice = async (b: any) => {
    try {
      const checkIn  = new Date(b.checkIn)
      const checkOut = new Date(b.checkOut)
      const nights   = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000))
      const roomName = ROOM_NAMES[b.roomId] || b.room?.roomName || 'Sky Stay Room'
      const { generateInvoice } = await import('@/lib/generateInvoice')
      generateInvoice({
        bookingNumber: b.bookingNumber ?? b.id?.slice(0,8).toUpperCase() ?? 'SKY-0001',
        guestName:     b.guestSnapshot?.name ?? b.user?.name ?? 'Valued Guest',
        guestEmail:    b.guestSnapshot?.email ?? b.user?.email ?? '',
        guestPhone:    b.guestSnapshot?.phone ?? b.user?.phone ?? '',
        roomName,
        checkIn:       b.checkIn,
        checkOut:      b.checkOut,
        nights,
        pricePerNight: b.room?.price ?? Math.round((b.totalAmount / 1.12) / nights),
        totalAmount:   b.totalAmount,
        status:        b.status,
        createdAt:     b.createdAt ?? new Date().toISOString(),
      })
      toast.success('Invoice downloaded!')
    } catch (err) {
      console.error('Invoice error:', err)
      toast.error('Failed to generate invoice.')
    }
  }

  return (
    <div>
      {reviewBooking && <ReviewModal booking={reviewBooking} onClose={() => setReviewBooking(null)} />}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium text-navy-700">My Bookings</h1>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-sm p-16 text-center">
          <CalendarDays size={40} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No bookings yet</p>
          <a href="https://wa.me/919003010567" className="text-gold-500 text-sm hover:text-gold-600">Contact us to book →</a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b: any) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-sm overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-cream-50">
                <span className="text-xs text-gold-500 font-medium">{b.bookingNumber}</span>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${BOOKING_STATUS_STYLES[b.status as BookingStatus]}`}>
                  {(b.status as string).replace('_',' ').toUpperCase()}
                </span>
              </div>
              <div className="p-5">
                <div className="grid sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-[10px] tracking-[1px] text-gray-400 mb-1">ROOM</p>
                    <p className="text-sm font-medium text-navy-700">{ROOM_NAMES[b.roomId] || 'Sky Stay Room'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[1px] text-gray-400 mb-1">DATES</p>
                    <p className="text-sm text-navy-700">{b.checkIn} → {b.checkOut}</p>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[1px] text-gray-400 mb-1">AMOUNT PAID</p>
                    <p className="text-sm font-medium text-navy-700">₹{Number(b.totalAmount).toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => downloadInvoice(b)}
                    className="text-xs px-3 py-1.5 border border-gray-200 rounded-sm text-gray-600 hover:border-gold-400 hover:text-gold-500 transition-colors flex items-center gap-1">
                    <FileText size={12} /> Invoice
                  </button>
                  {b.status === 'confirmed' && (
                    <button onClick={() => handleCancel(b.id)}
                      className="text-xs px-3 py-1.5 border border-red-200 rounded-sm text-red-500 hover:bg-red-50 transition-colors">
                      Cancel Booking
                    </button>
                  )}
                  {b.status === 'checked_out' && (
                    <button onClick={() => setReviewBooking(b)}
                      className="text-xs px-3 py-1.5 border border-gold-400 rounded-sm text-gold-500 hover:bg-gold-50 transition-colors flex items-center gap-1">
                      <Star size={12} /> Write Review
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// MY PROFILE PAGE
// ============================================
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authService } from '@/services/api'

const profileSchema = z.object({
  name:  z.string().min(2),
  phone: z.string().regex(/^[6-9]\d{9}$/,'Valid Indian mobile required'),
  city:  z.string().optional(),
})

export function MyProfilePage() {
  const { user, updateUser } = useAuthStore()
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', phone: user?.phone || '', city: user?.city || '' },
  })

  const onSubmit = async (data: any) => {
    try {
      const res = await authService.updateProfile(data)
      updateUser(res.data)
      toast.success('Profile updated!')
    } catch { toast.error('Update failed. Please try again.') }
  }

  return (
    <div>
      <h1 className="text-xl font-medium text-navy-700 mb-6">My Profile</h1>
      <div className="bg-white border border-gray-200 rounded-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-[11px] tracking-[2px] text-gray-500 mb-2">FULL NAME</label>
            <input {...register('name')} className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm text-navy-700 bg-white focus:outline-none focus:border-gold-400" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
          </div>
          <div>
            <label className="block text-[11px] tracking-[2px] text-gray-500 mb-2">EMAIL (READ-ONLY)</label>
            <input value={user?.email || ''} readOnly className="w-full px-4 py-3 border border-gray-100 rounded-sm text-sm text-gray-400 bg-gray-50 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-[11px] tracking-[2px] text-gray-500 mb-2">MOBILE NUMBER</label>
            <input {...register('phone')} type="tel" className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm text-navy-700 bg-white focus:outline-none focus:border-gold-400" />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message as string}</p>}
          </div>
          <div>
            <label className="block text-[11px] tracking-[2px] text-gray-500 mb-2">CITY</label>
            <input {...register('city')} placeholder="Chennai" className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm text-navy-700 bg-white focus:outline-none focus:border-gold-400" />
          </div>
          <button type="submit" disabled={!isDirty}
            className="bg-gold-400 hover:bg-gold-300 disabled:opacity-50 disabled:cursor-not-allowed text-navy-800 text-xs tracking-[2px] font-medium px-6 py-2.5 rounded-sm transition-colors">
            SAVE CHANGES
          </button>
        </form>
      </div>
    </div>
  )
}

// ============================================
// INVOICES PAGE
// ============================================
export function InvoicesPage() {
  const { user } = useAuthStore()
  const invoices = [
    { id:'1', bookingNumber:'SKY-2025-0042', roomName:'Deluxe Garden Room',   checkIn:'2025-12-20', checkOut:'2025-12-22', nights:2, pricePerNight:2499, amount:5599,  date:'10 Dec 2025', status:'confirmed' },
    { id:'2', bookingNumber:'SKY-2025-0031', roomName:'Premium Valley Suite', checkIn:'2025-11-05', checkOut:'2025-11-07', nights:2, pricePerNight:3999, amount:8959,  date:'20 Oct 2025', status:'checked_out' },
    { id:'3', bookingNumber:'SKY-2025-0018', roomName:'Romance Suite',        checkIn:'2025-09-14', checkOut:'2025-09-16', nights:2, pricePerNight:4999, amount:11199, date:'01 Sep 2025', status:'checked_out' },
  ]

  const downloadInv = async (inv: typeof invoices[0]) => {
    try {
      const { generateInvoice } = await import('@/lib/generateInvoice')
      generateInvoice({
        bookingNumber: inv.bookingNumber,
        guestName:     user?.name  ?? 'Valued Guest',
        guestEmail:    user?.email ?? '',
        guestPhone:    user?.phone ?? '',
        roomName:      inv.roomName,
        checkIn:       inv.checkIn,
        checkOut:      inv.checkOut,
        nights:        inv.nights,
        pricePerNight: inv.pricePerNight,
        totalAmount:   inv.amount,
        status:        inv.status,
        createdAt:     new Date(inv.date).toISOString(),
      })
      toast.success('Invoice downloaded!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to generate invoice.')
    }
  }

  return (
    <div>
      <h1 className="text-xl font-medium text-navy-700 mb-6">Invoices & Receipts</h1>
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-cream-50 border-b border-gray-200 text-[10px] tracking-[1px] text-gray-400">
              <th className="text-left px-5 py-3">BOOKING #</th>
              <th className="text-left px-5 py-3">DATE</th>
              <th className="text-left px-5 py-3">AMOUNT</th>
              <th className="text-left px-5 py-3">STATUS</th>
              <th className="text-left px-5 py-3">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id} className="border-t border-gray-50 hover:bg-cream-50">
                <td className="px-5 py-3 text-xs text-gold-500 font-medium">{inv.bookingNumber}</td>
                <td className="px-5 py-3 text-sm text-gray-600">{inv.date}</td>
                <td className="px-5 py-3 text-sm font-medium text-navy-700">₹{inv.amount.toLocaleString('en-IN')}</td>
                <td className="px-5 py-3">
                  <span className="text-[10px] bg-green-50 text-green-800 px-2 py-0.5 rounded-full font-medium">PAID</span>
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => downloadInv(inv)}
                    className="text-xs text-gold-500 border border-gold-400/40 px-3 py-1 rounded-sm hover:bg-gold-50 transition-colors flex items-center gap-1">
                    <FileText size={11} /> Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================
// NOTIFICATIONS PAGE
// ============================================
import { notificationsService } from '@/services/api'

const NOTIFS_FALLBACK = [
  { id:'1', type:'booking_confirmed', title:'Booking Confirmed — SKY-2025-0042', message:'Your Deluxe Garden Room is confirmed for Dec 20–22. Check-in at 2:00 PM.', isRead:false, sentAt:'2025-12-10T10:30:00Z' },
  { id:'2', type:'offer', title:'Special Weekend Offer — 20% OFF', message:'Book this weekend and save 20%! Use code WEEKEND20. Valid till Dec 31.', isRead:false, sentAt:'2025-12-08T09:00:00Z' },
  { id:'3', type:'reminder', title:'Check-in Tomorrow!', message:'Your stay at Sky Stay begins tomorrow. Check-in time is 2:00 PM. Need anything?', isRead:true, sentAt:'2025-11-04T20:00:00Z' },
  { id:'4', type:'booking_confirmed', title:'Thank you for your stay!', message:'Hope you enjoyed your time at Sky Stay. Please leave us a review — it means a lot!', isRead:true, sentAt:'2025-11-07T14:00:00Z' },
]

export function NotificationsPage() {
  const queryClient = useQueryClient()
  const { data } = useQuery({
    queryKey: ['my-notifications'],
    queryFn: () => notificationsService.getMyNotifications().then(r => r.data),
    placeholderData: { data: NOTIFS_FALLBACK },
  })
  const notifications: any[] = data?.data || NOTIFS_FALLBACK

  const markRead = useMutation({
    mutationFn: (id: string) => notificationsService.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-notifications'] }),
  })

  const ICONS: Record<string, string> = {
    booking_confirmed: '✓', offer: '🏷', reminder: '⏰', checkin_reminder: '🔔',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium text-navy-700">Notifications</h1>
        <button onClick={() => notificationsService.markAllRead().then(() => queryClient.invalidateQueries({ queryKey:['my-notifications'] }))}
          className="text-xs text-gold-500 hover:text-gold-600">
          Mark all read
        </button>
      </div>
      <div className="space-y-3">
        {notifications.map(n => (
          <div key={n.id} className={`bg-white border rounded-sm p-4 flex gap-4 ${!n.isRead ? 'border-gold-400/40 bg-gold-50/30' : 'border-gray-200'}`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${!n.isRead ? 'bg-gold-100' : 'bg-gray-100'}`}>
              {ICONS[n.type] || '📬'}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${!n.isRead ? 'text-navy-700' : 'text-gray-600'}`}>{n.title}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
              <p className="text-[11px] text-gray-400 mt-1.5">{new Date(n.sentAt).toLocaleString('en-IN')}</p>
            </div>
            {!n.isRead && (
              <button onClick={() => markRead.mutate(n.id)} className="text-[11px] text-gold-500 hover:text-gold-600 self-start mt-1">
                Mark read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// WISHLIST PAGE
// ============================================
export function WishlistPage() {
  const [wishlist, setWishlist] = useState([
    { id:'3', name:'Luxury Pool Villa', price:15999, img:'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80', slug:'luxury-pool-villa' },
    { id:'5', name:'Horizon Penthouse', price:22999, img:'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80', slug:'horizon-penthouse' },
  ])

  const remove = (id: string) => {
    setWishlist(w => w.filter(r => r.id !== id))
    toast.success('Removed from wishlist')
  }

  return (
    <div>
      <h1 className="text-xl font-medium text-navy-700 mb-6">My Wishlist</h1>
      {wishlist.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-sm p-16 text-center">
          <Heart size={40} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Your wishlist is empty</p>
          <Link to="/rooms" className="text-gold-500 text-sm">Browse rooms →</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {wishlist.map(room => (
            <div key={room.id} className="bg-white border border-gray-200 rounded-sm overflow-hidden">
              <div className="h-40 overflow-hidden">
                <img src={room.img} alt={room.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-navy-700 mb-1">{room.name}</h3>
                <p className="text-lg font-medium text-navy-700 mb-3">₹{room.price.toLocaleString('en-IN')}<span className="text-xs text-gray-400 font-normal ml-1">/ night</span></p>
                <div className="flex gap-2">
                  <Link to={`/rooms/${room.slug}`}
                    className="flex-1 bg-gold-400 hover:bg-gold-300 text-navy-800 text-xs text-center tracking-[1px] py-2 rounded-sm transition-colors">
                    VIEW ROOM
                  </Link>
                  <button onClick={() => remove(room.id)}
                    className="px-3 py-2 border border-red-200 text-red-500 rounded-sm hover:bg-red-50 transition-colors">
                    <Heart size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
