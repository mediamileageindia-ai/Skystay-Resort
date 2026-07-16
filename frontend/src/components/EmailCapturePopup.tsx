import { useState, useEffect } from 'react'
import { X, Mail, Gift } from 'lucide-react'
import toast from 'react-hot-toast'

const STORAGE_KEY = 'skystay_email_captured'

export default function EmailCapturePopup() {
  const [visible, setVisible]     = useState(false)
  const [email, setEmail]         = useState('')
  const [name, setName]           = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone]           = useState(false)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return
    const t = setTimeout(() => setVisible(true), 6000)
    return () => clearTimeout(t)
  }, [])

  const handleClose = () => {
    setVisible(false)
    localStorage.setItem(STORAGE_KEY, '1')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitting(true)
    try {
      const { supabase } = await import('@/lib/supabase')
      const { error } = await supabase.from('subscribers').insert({
        email: email.trim().toLowerCase(),
        name:  name.trim() || null,
        source: 'popup',
      })
      if (error && error.code !== '23505') throw error
      setDone(true)
      localStorage.setItem(STORAGE_KEY, '1')
      toast.success('Thank you! We will send you exclusive offers.')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-sm shadow-2xl overflow-hidden">

        {/* Close */}
        <button onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-white/80 text-gray-500 hover:text-gray-800 shadow">
          <X size={15} />
        </button>

        {/* Top image band */}
        <div className="relative h-32 bg-navy-800 flex items-center justify-center overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80"
            alt="Sky Stay Resorts"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="relative z-10 text-center px-6">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Gift size={18} className="text-gold-400" />
              <span className="text-gold-400 text-[11px] tracking-[3px] font-medium">SPECIAL OFFER</span>
            </div>
            <p className="text-white text-xl font-serif font-semibold">Get Exclusive Deals</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {!done ? (
            <>
              <p className="text-gray-600 text-sm text-center mb-5 leading-relaxed">
                Subscribe and be the first to know about <span className="text-navy-700 font-medium">seasonal offers</span>, early check-in perks, and resort events.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Your Name (optional)"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-sm text-sm text-navy-700 focus:outline-none focus:border-gold-400"
                  />
                </div>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Your Email Address *"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-sm text-sm text-navy-700 focus:outline-none focus:border-gold-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gold-400 hover:bg-gold-300 disabled:opacity-60 text-navy-800 font-semibold text-xs tracking-[2px] py-3 rounded-sm transition-colors"
                >
                  {submitting ? 'SUBSCRIBING...' : 'GET EXCLUSIVE OFFERS'}
                </button>
              </form>

              <button onClick={handleClose}
                className="w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-3 pb-1">
                No thanks, I'll pay full price
              </button>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-green-50 border-2 border-green-500 flex items-center justify-center mx-auto mb-3">
                <Mail size={22} className="text-green-600" />
              </div>
              <h3 className="text-navy-700 font-medium text-lg mb-1">You're In! 🎉</h3>
              <p className="text-gray-500 text-sm mb-4">We'll send exclusive offers to <span className="text-navy-700 font-medium">{email}</span></p>
              <button onClick={handleClose}
                className="bg-navy-700 hover:bg-navy-600 text-white text-xs tracking-[1px] px-6 py-2 rounded-sm transition-colors">
                EXPLORE RESORT
              </button>
            </div>
          )}
        </div>

        {/* Bottom gold line */}
        <div className="h-1 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300" />
      </div>
    </div>
  )
}
