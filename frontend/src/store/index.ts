import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'
import { authService } from '@/services/api'
import toast from 'react-hot-toast'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean

  login: (email: string, password: string) => Promise<boolean>
  register: (data: { name: string; email: string; phone: string; password: string; city?: string }) => Promise<boolean>
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })

        // Demo bypass — works without backend
        const DEMO_USERS: Record<string, { password: string; user: any; token: string }> = {
          'admin@skystayresorts.com': {
            password: 'Admin@123',
            token: 'demo-admin-token',
            user: { id: '1', name: 'Resort Admin', email: 'admin@skystayresorts.com', phone: '9999999999', role: 'admin', createdAt: new Date().toISOString() },
          },
          'guest@skystayresorts.com': {
            password: 'Guest@123',
            token: 'demo-guest-token',
            user: { id: '2', name: 'Demo Guest', email: 'guest@skystayresorts.com', phone: '9876543210', role: 'guest', createdAt: new Date().toISOString() },
          },
        }
        const demo = DEMO_USERS[email]
        if (demo && demo.password === password) {
          set({ user: demo.user, token: demo.token, isAuthenticated: true, isLoading: false })
          localStorage.setItem('skystay_token', demo.token)
          toast.success(`Welcome back, ${demo.user.name.split(' ')[0]}!`)
          return true
        }

        try {
          const res = await authService.login({ email, password })
          const { user, access_token } = res.data
          set({ user, token: access_token, isAuthenticated: true, isLoading: false })
          localStorage.setItem('skystay_token', access_token)
          toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
          return true
        } catch {
          set({ isLoading: false })
          return false
        }
      },

      register: async (data) => {
        set({ isLoading: true })
        try {
          const res = await authService.register(data)
          const { user, access_token } = res.data
          set({ user, token: access_token, isAuthenticated: true, isLoading: false })
          localStorage.setItem('skystay_token', access_token)
          toast.success(`Welcome to Sky Stay, ${user.name.split(' ')[0]}!`)
          return true
        } catch {
          set({ isLoading: false })
          return false
        }
      },

      logout: () => {
        localStorage.removeItem('skystay_token')
        set({ user: null, token: null, isAuthenticated: false })
        toast.success('Logged out successfully.')
      },

      updateUser: (userData) => {
        const current = get().user
        if (current) set({ user: { ...current, ...userData } })
      },
    }),
    {
      name: 'skystay-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)

// Booking store
interface BookingStore {
  checkIn: string
  checkOut: string
  guests: number
  selectedRoomId: string | null
  selectedRoomName: string
  pricePerNight: number
  couponCode: string
  discount: number
  paymentMode: 'full' | 'advance'

  setDates: (checkIn: string, checkOut: string) => void
  setGuests: (guests: number) => void
  selectRoom: (id: string, name: string, price: number) => void
  setCoupon: (code: string, discount: number) => void
  setPaymentMode: (mode: 'full' | 'advance') => void
  reset: () => void

  // Computed
  getNights: () => number
  getBaseAmount: () => number
  getTaxAmount: () => number
  getTotalAmount: () => number
  getAdvanceAmount: () => number
}

const today = new Date().toISOString().split('T')[0]
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

export const useBookingStore = create<BookingStore>((set, get) => ({
  checkIn: today,
  checkOut: tomorrow,
  guests: 2,
  selectedRoomId: null,
  selectedRoomName: '',
  pricePerNight: 0,
  couponCode: '',
  discount: 0,
  paymentMode: 'full',

  setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
  setGuests: (guests) => set({ guests }),
  selectRoom: (id, name, price) => set({ selectedRoomId: id, selectedRoomName: name, pricePerNight: price }),
  setCoupon: (code, discount) => set({ couponCode: code, discount }),
  setPaymentMode: (mode) => set({ paymentMode: mode }),
  reset: () => set({ selectedRoomId: null, couponCode: '', discount: 0, paymentMode: 'full' }),

  getNights: () => {
    const { checkIn, checkOut } = get()
    if (!checkIn || !checkOut) return 1
    const diff = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000
    return Math.max(1, Math.round(diff))
  },
  getBaseAmount: () => {
    const { pricePerNight, discount } = get()
    const nights = get().getNights()
    const sub = pricePerNight * nights
    return sub - discount
  },
  getTaxAmount: () => Math.round(get().getBaseAmount() * 0.12),
  getTotalAmount: () => get().getBaseAmount() + get().getTaxAmount(),
  getAdvanceAmount: () => Math.round(get().getTotalAmount() * 0.3),
}))
