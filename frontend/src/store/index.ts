import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'
import { supabase } from '@/lib/supabase'
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

        // Demo bypass for admin/guest accounts
        const DEMO: Record<string, { password: string; name: string; role: 'admin' | 'guest' }> = {
          'admin@skystayresorts.com': { password: 'Admin@123', name: 'Resort Admin', role: 'admin' },
          'guest@skystayresorts.com': { password: 'Guest@123', name: 'Demo Guest',   role: 'guest' },
        }
        const demo = DEMO[email.toLowerCase()]
        if (demo && demo.password === password) {
          const user: User = { id: 'demo-' + demo.role, name: demo.name, email, phone: '', role: demo.role, createdAt: new Date().toISOString() }
          set({ user, token: 'demo-token-' + demo.role, isAuthenticated: true, isLoading: false })
          localStorage.setItem('skystay_token', 'demo-token-' + demo.role)
          toast.success(`Welcome back, ${demo.name.split(' ')[0]}!`)
          return true
        }

        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password })
          if (error) throw error

          // Fetch role from profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, role, phone, city')
            .eq('id', data.user.id)
            .single()

          const user: User = {
            id: data.user.id,
            name: profile?.name ?? data.user.user_metadata?.name ?? email.split('@')[0],
            email: data.user.email!,
            phone: profile?.phone ?? '',
            role: (profile?.role ?? 'guest') as 'admin' | 'guest',
            createdAt: data.user.created_at,
          }

          set({ user, token: data.session?.access_token ?? null, isAuthenticated: true, isLoading: false })
          localStorage.setItem('skystay_token', data.session?.access_token ?? '')
          toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
          return true
        } catch (err: any) {
          set({ isLoading: false })
          toast.error(err?.message === 'Invalid login credentials' ? 'Invalid email or password.' : 'Login failed. Please try again.')
          return false
        }
      },

      register: async (data) => {
        set({ isLoading: true })
        try {
          const { data: authData, error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: { data: { name: data.name } },
          })
          if (error) throw error
          if (!authData.user) throw new Error('Signup failed')

          // Create profile
          await supabase.from('profiles').insert({
            id: authData.user.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            city: data.city ?? '',
            role: 'guest',
          })

          const user: User = {
            id: authData.user.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            role: 'guest',
            createdAt: authData.user.created_at,
          }

          set({ user, token: authData.session?.access_token ?? null, isAuthenticated: true, isLoading: false })
          localStorage.setItem('skystay_token', authData.session?.access_token ?? '')
          toast.success(`Welcome to Sky Stay, ${data.name.split(' ')[0]}!`)
          return true
        } catch (err: any) {
          set({ isLoading: false })
          toast.error(err?.message ?? 'Registration failed.')
          return false
        }
      },

      logout: async () => {
        await supabase.auth.signOut()
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
