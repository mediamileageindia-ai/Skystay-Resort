import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Room = {
  id: string
  slug: string
  room_name: string
  room_type: string
  price: number
  max_guests: number
  description: string
  amenities: string[]
  images: { url: string; isPrimary?: boolean }[]
  is_featured: boolean
  status: string
}

export type Offer = {
  id: string
  title: string
  tag: string
  description: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  coupon_code: string
  is_active: boolean
}

export type Review = {
  id: string
  name: string
  city: string
  rating: number
  comment: string
  created_at: string
}
