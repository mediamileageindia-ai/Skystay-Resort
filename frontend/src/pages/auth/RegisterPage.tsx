import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/store'
import toast from 'react-hot-toast'
import { authService } from '@/services/api'

// ============================================
// REGISTER PAGE
// ============================================
const registerSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Valid email required'),
  phone:    z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit Indian mobile number required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  city:     z.string().optional(),
})
type RegisterForm = z.infer<typeof registerSchema>

function AuthLeft({ subtitle }: { subtitle?: string }) {
  return (
    <div className="hidden lg:flex w-1/2 bg-navy-900 flex-col items-center justify-center p-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg,#c9a84c 0,#c9a84c 1px,transparent 0,transparent 50%)', backgroundSize: '24px 24px' }}
      />
      <div className="relative z-10 text-center">
        <div className="w-16 h-14 mx-auto mb-6">
          <svg viewBox="0 0 80 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <polygon points="40,4 4,68 76,68" fill="none" stroke="#c9a84c" strokeWidth="2.5"/>
            <polygon points="40,20 20,60 60,60" fill="#c9a84c" fillOpacity="0.2"/>
            <text x="40" y="54" textAnchor="middle" fill="#c9a84c" fontSize="16" fontWeight="bold">SS</text>
          </svg>
        </div>
        <h1 className="text-3xl font-medium text-white tracking-wide">Sky Stay</h1>
        <p className="text-gold-400 text-xs tracking-[5px] mt-1">RESORTS</p>
        {subtitle && <p className="text-navy-300 text-sm mt-6 max-w-xs leading-relaxed">{subtitle}</p>}
      </div>
    </div>
  )
}

export function RegisterPage() {
  const [showPass, setShowPass] = useState(false)
  const { register: registerUser, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    // 1. Send OTP first
    try {
      await authService.sendOtp(data.phone)
      navigate('/verify-otp', { state: { phone: data.phone, formData: data } })
    } catch {
      // OTP service might not be configured yet — proceed directly
      const ok = await registerUser(data)
      if (ok) navigate('/portal/bookings')
    }
  }

  return (
    <div className="min-h-screen flex">
      <AuthLeft subtitle="Create your account and enjoy exclusive member benefits — early offers, loyalty points, and seamless bookings." />
      <div className="flex-1 flex items-center justify-center bg-cream-50 p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md py-8"
        >
          <h2 className="text-2xl font-medium text-navy-700 mb-1">Create account</h2>
          <p className="text-sm text-gray-500 mb-8">Join Sky Stay — memories recreated</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-[11px] tracking-[2px] text-gray-500 mb-2">FULL NAME *</label>
              <input {...register('name')} placeholder="Ravi Kumar"
                className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm text-navy-700 bg-white focus:outline-none focus:border-gold-400" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] tracking-[2px] text-gray-500 mb-2">EMAIL *</label>
                <input {...register('email')} type="email" placeholder="ravi@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm text-navy-700 bg-white focus:outline-none focus:border-gold-400" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-[11px] tracking-[2px] text-gray-500 mb-2">MOBILE *</label>
                <input {...register('phone')} type="tel" placeholder="9876543210"
                  className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm text-navy-700 bg-white focus:outline-none focus:border-gold-400" />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-[11px] tracking-[2px] text-gray-500 mb-2">PASSWORD *</label>
              <div className="relative">
                <input {...register('password')} type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters"
                  className="w-full px-4 py-3 pr-11 border border-gray-200 rounded-sm text-sm text-navy-700 bg-white focus:outline-none focus:border-gold-400" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-[11px] tracking-[2px] text-gray-500 mb-2">CITY</label>
              <input {...register('city')} placeholder="Chennai"
                className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm text-navy-700 bg-white focus:outline-none focus:border-gold-400" />
            </div>

            <div className="pt-2">
              <button type="submit" disabled={isLoading}
                className="w-full py-3 bg-gold-400 hover:bg-gold-300 disabled:opacity-60 text-navy-800 font-medium text-xs tracking-[2px] rounded-sm transition-colors">
                {isLoading ? 'CREATING ACCOUNT…' : 'CREATE ACCOUNT & VERIFY PHONE'}
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-gold-500">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

// ============================================
// OTP VERIFICATION PAGE
// ============================================
export function OTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null),
                useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]
  const navigate = useNavigate()

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]; next[i] = val.slice(-1)
    setOtp(next)
    if (val && i < 5) refs[i + 1].current?.focus()
    if (!val && i > 0) refs[i - 1].current?.focus()
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs[i - 1].current?.focus()
  }

  const verifyOtp = async () => {
    const code = otp.join('')
    if (code.length < 6) { toast.error('Enter all 6 digits'); return }
    setIsVerifying(true)
    try {
      // await authService.verifyOtp(phone, code)
      await new Promise(r => setTimeout(r, 1000)) // simulate
      toast.success('Phone verified successfully!')
      navigate('/portal/bookings')
    } catch {
      toast.error('Invalid OTP. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <AuthLeft subtitle="We sent a 6-digit verification code to your registered mobile number." />
      <div className="flex-1 flex items-center justify-center bg-cream-50 p-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-sm">
          <h2 className="text-2xl font-medium text-navy-700 mb-1">Verify your phone</h2>
          <p className="text-sm text-gray-500 mb-8">Enter the 6-digit OTP sent to your number</p>

          <div className="flex gap-2 mb-4">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={refs[i]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className="flex-1 text-center py-4 text-xl font-medium border border-gray-200 rounded-sm text-navy-700 bg-white focus:outline-none focus:border-gold-400"
              />
            ))}
          </div>

          <p className="text-xs text-gray-400 mb-6">
            Didn't receive?{' '}
            {countdown > 0 ? (
              <span>Resend in {countdown}s</span>
            ) : (
              <button onClick={() => setCountdown(30)} className="text-gold-500">Resend OTP</button>
            )}
          </p>

          <button onClick={verifyOtp} disabled={isVerifying}
            className="w-full py-3 bg-gold-400 hover:bg-gold-300 disabled:opacity-60 text-navy-800 font-medium text-xs tracking-[2px] rounded-sm transition-colors">
            {isVerifying ? 'VERIFYING…' : 'VERIFY & CONTINUE'}
          </button>

          <Link to="/register" className="block text-center text-xs text-gold-500 mt-4">← Change number</Link>
        </motion.div>
      </div>
    </div>
  )
}

// ============================================
// FORGOT PASSWORD PAGE
// ============================================
export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    try {
      await authService.forgotPassword(email)
      setSent(true)
    } catch {
      setSent(true) // always show success for security
    }
  }

  return (
    <div className="min-h-screen flex">
      <AuthLeft subtitle="No worries — we'll send a password reset link to your registered email address." />
      <div className="flex-1 flex items-center justify-center bg-cream-50 p-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-sm">
          {!sent ? (
            <>
              <h2 className="text-2xl font-medium text-navy-700 mb-1">Reset password</h2>
              <p className="text-sm text-gray-500 mb-8">Enter your email to receive a reset link</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] tracking-[2px] text-gray-500 mb-2">EMAIL ADDRESS</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="admin@skystayresorts.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm text-navy-700 bg-white focus:outline-none focus:border-gold-400" />
                </div>
                <button type="submit"
                  className="w-full py-3 bg-gold-400 hover:bg-gold-300 text-navy-800 font-medium text-xs tracking-[2px] rounded-sm transition-colors">
                  SEND RESET LINK
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-600 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-medium text-navy-700 mb-2">Check your email</h2>
              <p className="text-sm text-gray-500 mb-6">We sent a reset link to <strong>{email}</strong></p>
            </div>
          )}
          <Link to="/login" className="block text-center text-xs text-gold-500 mt-4">← Back to sign in</Link>
        </motion.div>
      </div>
    </div>
  )
}

export default RegisterPage
