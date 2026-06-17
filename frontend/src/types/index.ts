// ============================================
// SKY STAY RESORTS — TypeScript Types
// ============================================

// ---------- AUTH ----------
export interface User {
  id: string
  name: string
  email: string
  phone: string
  city?: string
  role: 'guest' | 'admin'
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  name: string
  email: string
  phone: string
  password: string
  city?: string
}

// ---------- ROOMS ----------
export interface Room {
  id: string
  roomName: string
  slug: string
  roomType: RoomType
  price: number
  maxGuests: number
  description: string
  amenities: string[]
  status: 'available' | 'occupied' | 'maintenance'
  images: RoomImage[]
}

export type RoomType = 'deluxe' | 'suite' | 'villa' | 'cottage' | 'penthouse' | 'romance'

export interface RoomImage {
  id: string
  url: string
  isPrimary: boolean
}

export interface RoomSearchParams {
  checkIn: string
  checkOut: string
  guests: number
  roomType?: RoomType
}

export interface AvailabilityResult {
  room: Room
  isAvailable: boolean
  totalNights: number
  baseAmount: number
  taxAmount: number
  totalAmount: number
}

// ---------- BOOKINGS ----------
export interface Booking {
  id: string
  bookingNumber: string
  userId: string
  roomId: string
  room: Room
  user: User
  checkIn: string
  checkOut: string
  guests: number
  totalAmount: number
  advanceAmount?: number
  paymentMode: 'full' | 'advance'
  status: BookingStatus
  specialRequests?: string
  payment?: Payment
  createdAt: string
}

export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'

export interface CreateBookingDto {
  roomId: string
  checkIn: string
  checkOut: string
  guests: number
  paymentMode: 'full' | 'advance'
  couponCode?: string
  specialRequests?: string
  guestInfo: {
    name: string
    email: string
    phone: string
    city?: string
  }
}

// ---------- PAYMENTS ----------
export interface Payment {
  id: string
  bookingId: string
  gateway: 'razorpay'
  amount: number
  status: 'pending' | 'captured' | 'failed' | 'refunded'
  transactionId?: string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  createdAt: string
}

export interface RazorpayOrder {
  orderId: string
  amount: number
  currency: string
  keyId: string
}

// ---------- OFFERS ----------
export interface Offer {
  id: string
  title: string
  tag: string
  description: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  couponCode: string
  validFrom: string
  validTo: string
  isActive: boolean
}

// ---------- CRM ----------
export interface Lead {
  id: string
  name: string
  phone: string
  email?: string
  source: LeadSource
  status: LeadStatus
  interest?: string
  budget?: string
  notes?: string
  createdAt: string
}

export type LeadSource = 'website' | 'whatsapp' | 'google_ads' | 'facebook' | 'instagram' | 'direct'
export type LeadStatus = 'new' | 'warm' | 'hot' | 'converted' | 'lost'

// ---------- NOTIFICATIONS ----------
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  sentAt: string
}

export type NotificationType = 'booking_confirmed' | 'booking_cancelled' | 'offer' | 'reminder' | 'checkin_reminder'

// ---------- REVIEWS ----------
export interface Review {
  id: string
  userId: string
  user: User
  roomId?: string
  rating: number
  comment: string
  createdAt: string
}

// ---------- ADMIN STATS ----------
export interface DashboardStats {
  totalRevenue: number
  revenueToday: number
  bookingsToday: number
  occupancyRate: number
  checkInsToday: number
  checkOutsToday: number
  totalGuests: number
  newLeads: number
  monthlyRevenue: MonthlyRevenue[]
  topRooms: TopRoom[]
}

export interface MonthlyRevenue {
  month: string
  revenue: number
  bookings: number
}

export interface TopRoom {
  room: Room
  bookings: number
  revenue: number
}

// ---------- API RESPONSE ----------
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}

export interface ApiError {
  statusCode: number
  message: string
  error: string
}
