import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, Shield, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'
import { useBookingStore, useAuthStore } from '@/store'
import { bookingsService, paymentsService, roomsService, offersService } from '@/services/api'
import { Room } from '@/types'

// ============================================
// ZOD SCHEMAS
// ============================================
const guestSchema = z.object({
  firstName:       z.string().min(2, 'First name required'),
  lastName:        z.string().min(1, 'Last name required'),
  email:           z.string().email('Valid email required'),
  phone:           z.string().regex(/^[6-9]\d{9}$/, 'Valid Indian mobile number required'),
  city:            z.string().optional(),
  specialRequests: z.string().optional(),
  agreeTerms:      z.boolean().refine(v => v, 'Please accept terms'),
})
type GuestFormData = z.infer<typeof guestSchema>

// ============================================
// STEP INDICATOR
// ============================================
const steps = ['Room & Dates', 'Guest Details', 'Payment', 'Confirmed']

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((label, i) => {
        const idx = i + 1
        const done = idx < current
        const active = idx === current
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all ${
                done    ? 'bg-navy-700 border-navy-700 text-gold-400' :
                active  ? 'bg-gold-400 border-gold-400 text-navy-800' :
                          'bg-white border-gray-200 text-gray-400'
              }`}>
                {done ? <Check size={16} /> : idx}
              </div>
              <span className={`mt-2 text-[11px] tracking-wide whitespace-nowrap ${
                active ? 'text-gold-500 font-medium' : done ? 'text-navy-700' : 'text-gray-400'
              }`}>{label.toUpperCase()}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-16 sm:w-24 h-[1px] mx-2 mb-5 transition-colors ${
                done ? 'bg-navy-700' : 'bg-gray-200'
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ============================================
// MAIN BOOKING PAGE
// ============================================
export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [bookingRef, setBookingRef] = useState('')
  const navigate = useNavigate()

  const {
    checkIn, checkOut, guests, selectedRoomId, selectedRoomName, pricePerNight,
    couponCode, discount, paymentMode,
    setDates, setGuests, selectRoom, setCoupon, setPaymentMode,
    getNights, getBaseAmount, getTaxAmount, getTotalAmount, getAdvanceAmount,
  } = useBookingStore()

  const { isAuthenticated, user } = useAuthStore()

  const { register, handleSubmit, formState: { errors } } = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName:  user?.name?.split(' ')[1] || '',
      email:     user?.email || '',
      phone:     user?.phone || '',
    },
  })

  // Fetch rooms for selection
  const { data: rooms } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomsService.getAll().then(r => r.data),
  })

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: bookingsService.create,
    onSuccess: (res) => {
      setBookingId(res.data.id)
      setBookingRef(res.data.bookingNumber)
    },
  })

  // Validate coupon
  const validateCoupon = async (code: string) => {
    if (!selectedRoomId || !code) return
    try {
      const res = await offersService.validateCoupon(code, selectedRoomId, checkIn, checkOut)
      const { discountAmount } = res.data
      setCoupon(code, discountAmount)
      toast.success(`Coupon applied! ₹${discountAmount.toLocaleString('en-IN')} off`)
    } catch {
      toast.error('Invalid or expired coupon code')
    }
  }

  // Initiate Razorpay
  const initiatePayment = async (guestData: GuestFormData) => {
    if (!selectedRoomId) { toast.error('Please select a room'); return }

    const guestInfo = {
      name:  `${guestData.firstName} ${guestData.lastName}`,
      email: guestData.email,
      phone: guestData.phone,
      city:  guestData.city,
    }

    try {
      // 1. Create booking
      const bookingRes = await createBookingMutation.mutateAsync({
        roomId:          selectedRoomId,
        checkIn,
        checkOut,
        guests,
        paymentMode,
        couponCode:      couponCode || undefined,
        specialRequests: guestData.specialRequests,
        guestInfo,
      })
      const newBookingId = bookingRes.data.id

      // 2. Create Razorpay order
      const orderRes = await paymentsService.createOrder(newBookingId)
      const { orderId, amount, currency, keyId } = orderRes.data

      // 3. Open Razorpay checkout
      const options = {
        key:          keyId,
        amount,
        currency,
        name:         'Sky Stay Resorts',
        description:  `Booking ${bookingRes.data.bookingNumber}`,
        order_id:     orderId,
        prefill: {
          name:    guestInfo.name,
          email:   guestInfo.email,
          contact: guestInfo.phone,
        },
        theme: { color: '#c9a84c' },
        handler: async (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          try {
            await paymentsService.verifyPayment({
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              bookingId:         newBookingId,
            })
            setStep(4)
            toast.success('Payment successful! Booking confirmed.')
          } catch {
            navigate('/booking/failure')
          }
        },
        modal: {
          ondismiss: () => toast.error('Payment cancelled'),
        },
      }

      // Load Razorpay script if not already loaded
      if (!(window as any).Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Razorpay load failed'))
          document.body.appendChild(script)
        })
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error(err)
    }
  }

  const nights    = getNights()
  const baseAmt   = getBaseAmount()
  const taxAmt    = getTaxAmount()
  const totalAmt  = getTotalAmount()
  const advAmt    = getAdvanceAmount()
  const payNow    = paymentMode === 'full' ? totalAmt : advAmt

  return (
    <div className="min-h-screen bg-cream-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4">

        {/* HEADER */}
        <div className="text-center mb-10 pt-8">
          <p className="text-gold-500 text-[11px] tracking-[4px] mb-2">RESERVATION</p>
          <h1 className="font-serif text-3xl text-navy-700">Book Your Stay</h1>
        </div>

        <StepIndicator current={step} />

        <AnimatePresence mode="wait">

          {/* ===== STEP 1: Room & Dates ===== */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Main form */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Date & Guests */}
                  <div className="bg-white border border-gray-200 rounded p-6">
                    <h2 className="text-lg font-medium text-navy-700 mb-5">Select Dates</h2>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-[11px] tracking-[2px] text-gray-500 mb-2">CHECK-IN</label>
                        <input
                          type="date"
                          value={checkIn}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={e => setDates(e.target.value, checkOut)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded text-sm text-navy-700 focus:outline-none focus:border-gold-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] tracking-[2px] text-gray-500 mb-2">CHECK-OUT</label>
                        <input
                          type="date"
                          value={checkOut}
                          min={checkIn}
                          onChange={e => setDates(checkIn, e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded text-sm text-navy-700 focus:outline-none focus:border-gold-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] tracking-[2px] text-gray-500 mb-2">GUESTS</label>
                      <select
                        value={guests}
                        onChange={e => setGuests(Number(e.target.value))}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded text-sm text-navy-700 focus:outline-none focus:border-gold-400"
                      >
                        {[1,2,3,4,5,6].map(n => (
                          <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Room Selection */}
                  <div className="bg-white border border-gray-200 rounded p-6">
                    <h2 className="text-lg font-medium text-navy-700 mb-5">Choose Room</h2>
                    <div className="space-y-3">
                      {(rooms?.data || FALLBACK_ROOMS).map((room: Room) => (
                        <div
                          key={room.id}
                          onClick={() => selectRoom(room.id, room.roomName, room.price)}
                          className={`border rounded p-4 cursor-pointer transition-all ${
                            selectedRoomId === room.id
                              ? 'border-gold-400 bg-gold-50'
                              : 'border-gray-200 hover:border-gold-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                selectedRoomId === room.id ? 'border-gold-400' : 'border-gray-300'
                              }`}>
                                {selectedRoomId === room.id && (
                                  <div className="w-2 h-2 rounded-full bg-gold-400" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-navy-700">{room.roomName}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{room.description?.slice(0, 60)}…</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Coupon */}
                  <div className="bg-white border border-gray-200 rounded p-6">
                    <h2 className="text-sm font-medium text-navy-700 mb-3">Have a Coupon?</h2>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        defaultValue={couponCode}
                        id="coupon-input"
                        className="flex-1 px-3 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-gold-400"
                      />
                      <button
                        onClick={() => validateCoupon((document.getElementById('coupon-input') as HTMLInputElement).value)}
                        className="px-5 py-2.5 border border-gold-400 text-gold-500 text-sm rounded hover:bg-gold-50 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {discount > 0 && (
                      <p className="text-green-600 text-sm mt-2">✓ Coupon applied — ₹{discount.toLocaleString('en-IN')} off</p>
                    )}
                  </div>
                </div>

                {/* Price Summary */}
                <div>
                  <div className="bg-navy-700 text-white rounded p-6 sticky top-24">
                    <p className="text-[11px] tracking-[2px] text-gold-400 mb-4">PRICE SUMMARY</p>
                    {selectedRoomName && (
                      <p className="font-medium mb-4 pb-4 border-b border-white/10">{selectedRoomName}</p>
                    )}
                    <button
                      onClick={() => {
                        if (!selectedRoomId) { toast.error('Please select a room'); return }
                        if (!checkIn || !checkOut) { toast.error('Please select dates'); return }
                        setStep(2)
                      }}
                      className="w-full mt-6 bg-gold-400 hover:bg-gold-300 text-navy-800 font-semibold text-xs tracking-[2px] py-3 rounded-sm transition-colors flex items-center justify-center gap-2"
                    >
                      CONTINUE <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ===== STEP 2: Guest Details ===== */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <form onSubmit={handleSubmit(initiatePayment)}>
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-200 rounded p-6">
                      <h2 className="text-lg font-medium text-navy-700 mb-6">Guest Information</h2>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-[11px] tracking-[2px] text-gray-500 mb-2">FIRST NAME *</label>
                          <input
                            {...register('firstName')}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-gold-400"
                            placeholder="Ravi"
                          />
                          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                        </div>
                        <div>
                          <label className="block text-[11px] tracking-[2px] text-gray-500 mb-2">LAST NAME *</label>
                          <input
                            {...register('lastName')}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-gold-400"
                            placeholder="Kumar"
                          />
                          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-[11px] tracking-[2px] text-gray-500 mb-2">EMAIL *</label>
                          <input
                            {...register('email')}
                            type="email"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-gold-400"
                            placeholder="ravi@example.com"
                          />
                          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                          <label className="block text-[11px] tracking-[2px] text-gray-500 mb-2">PHONE *</label>
                          <input
                            {...register('phone')}
                            type="tel"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-gold-400"
                            placeholder="9876543210"
                          />
                          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-[11px] tracking-[2px] text-gray-500 mb-2">CITY</label>
                        <input
                          {...register('city')}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-gold-400"
                          placeholder="Chennai"
                        />
                      </div>
                      <div className="mb-6">
                        <label className="block text-[11px] tracking-[2px] text-gray-500 mb-2">SPECIAL REQUESTS</label>
                        <textarea
                          {...register('specialRequests')}
                          rows={3}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-gold-400 resize-none"
                          placeholder="Late check-in, honeymoon decoration, dietary preferences..."
                        />
                      </div>
                      <div className="mb-6">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" {...register('agreeTerms')} className="mt-0.5" />
                          <span className="text-sm text-gray-600">
                            I agree to the <span className="text-gold-500 underline cursor-pointer">Terms & Conditions</span> and{' '}
                            <span className="text-gold-500 underline cursor-pointer">Cancellation Policy</span>
                          </span>
                        </label>
                        {errors.agreeTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeTerms.message}</p>}
                      </div>

                      {/* Payment Mode */}
                      <div className="mb-6">
                        <p className="text-[11px] tracking-[2px] text-gray-500 mb-3">PAYMENT MODE</p>
                        <div className="space-y-3">
                          <div
                            onClick={() => setPaymentMode('full')}
                            className={`border rounded p-4 cursor-pointer flex items-center gap-3 transition-all ${
                              paymentMode === 'full' ? 'border-gold-400 bg-gold-50' : 'border-gray-200'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMode === 'full' ? 'border-gold-400' : 'border-gray-300'}`}>
                              {paymentMode === 'full' && <div className="w-2 h-2 bg-gold-400 rounded-full" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-navy-700">Pay Full Amount — ₹{totalAmt.toLocaleString('en-IN')}</p>
                              <p className="text-xs text-gray-500">UPI · GPay · PhonePe · Cards · Net Banking</p>
                            </div>
                            <CreditCard size={18} className="text-gray-400" />
                          </div>
                          <div
                            onClick={() => setPaymentMode('advance')}
                            className={`border rounded p-4 cursor-pointer flex items-center gap-3 transition-all ${
                              paymentMode === 'advance' ? 'border-gold-400 bg-gold-50' : 'border-gray-200'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMode === 'advance' ? 'border-gold-400' : 'border-gray-300'}`}>
                              {paymentMode === 'advance' && <div className="w-2 h-2 bg-gold-400 rounded-full" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-navy-700">Pay 30% Advance — ₹{advAmt.toLocaleString('en-IN')}</p>
                              <p className="text-xs text-gray-500">Remaining ₹{(totalAmt - advAmt).toLocaleString('en-IN')} due at check-in</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded p-3 mb-6">
                        <Shield size={16} className="text-gold-400 flex-shrink-0" />
                        100% secure payment via Razorpay. Your information is encrypted and safe.
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="flex-1 py-3 border border-gray-200 text-gray-500 text-sm rounded hover:bg-gray-50 transition-colors"
                        >
                          ← Back
                        </button>
                        <button
                          type="submit"
                          disabled={createBookingMutation.isPending}
                          className="flex-2 flex-grow-[2] py-3 bg-gold-400 hover:bg-gold-300 text-navy-800 font-semibold text-xs tracking-[2px] rounded-sm transition-colors disabled:opacity-60"
                        >
                          {createBookingMutation.isPending ? 'PROCESSING…' : `PAY ₹${payNow.toLocaleString('en-IN')} VIA RAZORPAY →`}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Summary sidebar */}
                  <div>
                    <div className="bg-navy-700 text-white rounded p-6">
                      <p className="text-[11px] tracking-[2px] text-gold-400 mb-4">BOOKING SUMMARY</p>
                      <p className="font-medium mb-1">{selectedRoomName}</p>
                      <p className="text-sm text-gray-400 mb-4">{checkIn} → {checkOut}</p>
                      <div className="space-y-2 text-sm border-t border-white/10 pt-4">
                        <div className="flex justify-between text-gray-300"><span>Subtotal</span><span>₹{baseAmt.toLocaleString('en-IN')}</span></div>
                        <div className="flex justify-between text-gray-300"><span>GST</span><span>₹{taxAmt.toLocaleString('en-IN')}</span></div>
                        <div className="flex justify-between text-gold-400 font-medium text-base pt-2 border-t border-white/10">
                          <span>Total</span><span>₹{totalAmt.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-green-400 text-xs pt-1">
                          <span>Pay now ({paymentMode === 'full' ? '100%' : '30%'})</span>
                          <span>₹{payNow.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {/* ===== STEP 4: Confirmation ===== */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="max-w-xl mx-auto text-center">
                <div className="w-20 h-20 rounded-full bg-gold-50 border-2 border-gold-400 flex items-center justify-center mx-auto mb-6">
                  <Check size={36} className="text-gold-400" />
                </div>
                <p className="text-[11px] tracking-[4px] text-gold-500 mb-2">BOOKING CONFIRMED</p>
                <h2 className="font-serif text-2xl text-navy-700 mb-1">{bookingRef}</h2>
                <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                  Your booking is confirmed! A confirmation has been sent to your email and WhatsApp.
                  We look forward to welcoming you to Sky Stay Resorts.
                </p>
                <div className="bg-cream-100 border border-gray-200 rounded p-6 text-left mb-8 space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Room</span><span className="text-navy-700 font-medium">{selectedRoomName}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Check-in</span><span className="text-navy-700">{checkIn}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Check-out</span><span className="text-navy-700">{checkOut}</span></div>
                  <div className="flex justify-between text-sm border-t border-gray-200 pt-3"><span className="text-gray-500">Amount Paid</span><span className="text-gold-500 font-medium">₹{payNow.toLocaleString('en-IN')}</span></div>
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => navigate('/portal/bookings')}
                    className="bg-gold-400 hover:bg-gold-300 text-navy-800 font-semibold text-xs tracking-[2px] px-8 py-3 rounded-sm transition-colors"
                  >
                    VIEW MY BOOKINGS
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="border border-gold-400 text-gold-500 text-xs tracking-[2px] px-8 py-3 rounded-sm hover:bg-gold-50 transition-colors"
                  >
                    BACK TO HOME
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

// Fallback rooms when API not connected
const FALLBACK_ROOMS = [
  { id: '1', roomName: 'Deluxe Garden Room', price: 4999, description: 'Garden-facing rooms with premium amenities and handcrafted furniture.' },
  { id: '2', roomName: 'Premium Valley Suite', price: 7999, description: 'Panoramic valley views with private balcony and jacuzzi bath.' },
  { id: '3', roomName: 'Luxury Pool Villa', price: 15999, description: 'Private plunge pool, outdoor dining, and butler service.' },
  { id: '4', roomName: 'Forest Retreat Cottage', price: 6499, description: 'Rustic luxury in the forest with outdoor shower and bonfire pit.' },
  { id: '5', roomName: 'Horizon Penthouse', price: 22999, description: 'Rooftop penthouse with 360° views and personal chef service.' },
  { id: '6', roomName: 'Romance Suite', price: 9999, description: 'Designed for couples with rose bath and complimentary champagne.' },
]
