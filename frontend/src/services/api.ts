import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

// ============================================
// SKY STAY — Axios API Client
// ============================================

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// REQUEST INTERCEPTOR — attach JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('skystay_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// RESPONSE INTERCEPTOR — handle errors globally
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ message: string }>) => {
    const status = error.response?.status

    // No response = backend offline; silently reject so UI can use fallback data
    if (!status) return Promise.reject(error)

    const message = error.response?.data?.message || 'Something went wrong'

    if (status === 401) {
      localStorage.removeItem('skystay_token')
      localStorage.removeItem('skystay_user')
      window.location.href = '/login'
      toast.error('Session expired. Please login again.')
    } else if (status === 403) {
      toast.error('Access denied.')
    } else if (status === 429) {
      toast.error('Too many requests. Please slow down.')
    } else if (status >= 500) {
      // suppress — backend may be offline; UI uses fallback data
    } else if (status === 404) {
      // handled per-request
    } else {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

export default api

// ============================================
// AUTH SERVICE
// ============================================
export const authService = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  register: (data: { name: string; email: string; phone: string; password: string; city?: string }) =>
    api.post('/auth/register', data),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),

  getProfile: () =>
    api.get('/auth/me'),

  updateProfile: (data: Partial<{ name: string; phone: string; city: string }>) =>
    api.patch('/auth/me', data),

  sendOtp: (phone: string) =>
    api.post('/auth/send-otp', { phone }),

  verifyOtp: (phone: string, otp: string) =>
    api.post('/auth/verify-otp', { phone, otp }),
}

// ============================================
// HELPERS — normalize Supabase snake_case → camelCase
// ============================================
function normalizeRoom(r: any) {
  return {
    id: r.id,
    slug: r.slug,
    roomName: r.room_name ?? r.roomName,
    roomType: r.room_type ?? r.roomType,
    price: r.price,
    maxGuests: r.max_guests ?? r.maxGuests,
    description: r.description,
    amenities: r.amenities ?? [],
    images: (r.images ?? []).map((img: any) =>
      typeof img === 'string' ? { url: img } : img
    ),
    isFeatured: r.is_featured ?? r.isFeatured,
    status: r.status ?? 'available',
  }
}

function normalizeOffer(o: any) {
  return {
    id: o.id,
    title: o.title,
    tag: o.tag,
    description: o.description,
    discountType: o.discount_type ?? o.discountType,
    discountValue: o.discount_value ?? o.discountValue,
    couponCode: o.coupon_code ?? o.couponCode,
    isActive: o.is_active ?? true,
  }
}

function normalizeReview(rv: any) {
  return {
    id: rv.id,
    name: rv.name,
    city: rv.city,
    rating: rv.rating,
    comment: rv.comment,
    date: rv.created_at ? new Date(rv.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '',
  }
}

// ============================================
// ROOMS SERVICE — Supabase primary, API fallback
// ============================================
export const roomsService = {
  getAll: async (params?: { type?: string; status?: string }) => {
    try {
      let query = supabase.from('rooms').select('*').order('price', { ascending: true })
      if (params?.type && params.type !== 'all') query = query.eq('room_type', params.type)
      if (params?.status) query = query.eq('status', params.status)
      const { data, error } = await query
      if (error) throw error
      return { data: { data: (data ?? []).map(normalizeRoom) } }
    } catch {
      return api.get('/rooms', { params })
    }
  },

  getBySlug: async (slug: string) => {
    try {
      const { data, error } = await supabase.from('rooms').select('*').eq('slug', slug).single()
      if (error) throw error
      return { data: { data: normalizeRoom(data) } }
    } catch {
      return api.get(`/rooms/${slug}`)
    }
  },

  getFeatured: async () => {
    const { data, error } = await supabase.from('rooms').select('*').eq('is_featured', true).order('price')
    if (error) throw error
    return { data: { data: (data ?? []).map(normalizeRoom) } }
  },

  checkAvailability: (params: {
    checkIn: string; checkOut: string; guests: number; roomType?: string
  }) => api.get('/rooms/availability', { params }),

  // Admin
  create: (data: FormData) =>
    api.post('/rooms', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: Partial<{ roomName: string; price: number; status: string }>) =>
    api.patch(`/rooms/${id}`, data),
  delete: (id: string) => api.delete(`/rooms/${id}`),
  uploadImages: (id: string, images: FormData) =>
    api.post(`/rooms/${id}/images`, images, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

// ============================================
// BOOKINGS SERVICE
// ============================================
export const bookingsService = {
  create: (data: {
    roomId: string
    checkIn: string
    checkOut: string
    guests: number
    paymentMode: 'full' | 'advance'
    couponCode?: string
    specialRequests?: string
    guestInfo: { name: string; email: string; phone: string; city?: string }
  }) => api.post('/bookings', data),

  getMyBookings: () =>
    api.get('/bookings/my'),

  getById: (id: string) =>
    api.get(`/bookings/${id}`),

  cancel: (id: string, reason?: string) =>
    api.patch(`/bookings/${id}/cancel`, { reason }),

  // Admin
  getAll: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get('/bookings', { params }),

  confirm: (id: string) =>
    api.patch(`/bookings/${id}/confirm`),

  modify: (id: string, data: { checkIn?: string; checkOut?: string; guests?: number }) =>
    api.patch(`/bookings/${id}`, data),
}

// ============================================
// PAYMENTS SERVICE
// ============================================
export const paymentsService = {
  createOrder: (bookingId: string) =>
    api.post('/payments/create-order', { bookingId }),

  verifyPayment: (data: {
    razorpayOrderId: string
    razorpayPaymentId: string
    razorpaySignature: string
    bookingId: string
  }) => api.post('/payments/verify', data),

  getInvoice: (bookingId: string) =>
    api.get(`/payments/invoice/${bookingId}`, { responseType: 'blob' }),

  refund: (paymentId: string, amount?: number) =>
    api.post(`/payments/refund/${paymentId}`, { amount }),
}

// ============================================
// OFFERS SERVICE — Supabase primary
// ============================================
export const offersService = {
  getAll: async () => {
    try {
      const { data, error } = await supabase.from('offers').select('*').eq('is_active', true)
      if (error) throw error
      return { data: { data: (data ?? []).map(normalizeOffer) } }
    } catch {
      return api.get('/offers')
    }
  },
  validateCoupon: (code: string, roomId: string, checkIn: string, checkOut: string) =>
    api.post('/offers/validate', { code, roomId, checkIn, checkOut }),
  create: (data: object) => api.post('/offers', data),
  update: (id: string, data: object) => api.patch(`/offers/${id}`, data),
  delete: (id: string) => api.delete(`/offers/${id}`),
}

// ============================================
// CRM SERVICE
// ============================================
export const crmService = {
  trackVisit: (data: { page: string; roomSlug?: string; timeSpent?: number }) =>
    api.post('/crm/track', data),

  captureLead: (data: {
    name?: string
    phone?: string
    email?: string
    source: string
    interest?: string
  }) => api.post('/crm/lead', data),

  // Admin
  getLeads: (params?: { status?: string; source?: string }) =>
    api.get('/crm/leads', { params }),

  updateLead: (id: string, data: { status?: string; notes?: string }) =>
    api.patch(`/crm/leads/${id}`, data),

  triggerWhatsApp: (leadId: string, templateId: string) =>
    api.post(`/crm/leads/${leadId}/whatsapp`, { templateId }),
}

// ============================================
// NOTIFICATIONS SERVICE
// ============================================
export const notificationsService = {
  getMyNotifications: () =>
    api.get('/notifications/my'),

  markAsRead: (id: string) =>
    api.patch(`/notifications/${id}/read`),

  markAllRead: () =>
    api.patch('/notifications/read-all'),

  // Admin
  sendCampaign: (data: {
    channel: 'email' | 'whatsapp' | 'sms'
    templateId: string
    targetAudience: 'all' | 'returning' | 'new'
  }) => api.post('/notifications/campaign', data),
}

// ============================================
// ADMIN SERVICE
// ============================================
export const adminService = {
  getDashboard: () =>
    api.get('/admin/dashboard'),

  getRevenue: (period: 'daily' | 'monthly' | 'yearly') =>
    api.get('/admin/revenue', { params: { period } }),

  getOccupancy: () =>
    api.get('/admin/occupancy'),
}

// ============================================
// REVIEWS SERVICE — Supabase primary
// ============================================
export const reviewsService = {
  getAll: async (roomId?: string) => {
    try {
      let query = supabase.from('reviews').select('*').eq('is_approved', true).order('created_at', { ascending: false })
      if (roomId) query = query.eq('room_slug', roomId)
      const { data, error } = await query
      if (error) throw error
      return { data: { data: (data ?? []).map(normalizeReview) } }
    } catch {
      return api.get('/reviews', { params: { roomId } })
    }
  },
  create: (data: { roomId?: string; rating: number; comment: string }) =>
    api.post('/reviews', data),
}

// ============================================
// AMENITIES SERVICE — Supabase primary
// ============================================
export const amenitiesService = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('amenities')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
      if (error) throw error
      return { data: { data: data ?? [] } }
    } catch {
      return { data: { data: [] } }
    }
  },
}

// ============================================
// PLACES TO VISIT SERVICE — Supabase primary
// ============================================
export const placesService = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('places_to_visit')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
      if (error) throw error
      return { data: { data: data ?? [] } }
    } catch {
      return { data: { data: [] } }
    }
  },
}

// ============================================
// GOOGLE REVIEWS SERVICE — Vercel serverless proxy
// ============================================
export const googleReviewsService = {
  getAll: async () => {
    try {
      const base = import.meta.env.PROD ? '' : 'http://localhost:3000'
      const res = await fetch(`${base}/api/google-reviews`)
      if (!res.ok) throw new Error('fetch failed')
      return await res.json()
    } catch {
      return { reviews: [], overallRating: null, totalRatings: null }
    }
  },
}

// ============================================
// GALLERY SERVICE — Supabase primary
// ============================================
export const galleryService = {
  getAll: async (category?: string) => {
    try {
      let query = supabase.from('gallery').select('*').eq('is_active', true).order('display_order')
      if (category && category !== 'all') query = query.eq('category', category)
      const { data, error } = await query
      if (error) throw error
      return { data: { data: data ?? [] } }
    } catch {
      return { data: { data: [] } }
    }
  },
}
