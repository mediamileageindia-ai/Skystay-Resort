import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, CheckCircle, Calendar, Target, BarChart2, MessageCircle } from 'lucide-react'
import { useAuthStore } from '@/store'

const loginSchema = z.object({
  email:    z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
})
type LoginForm = z.infer<typeof loginSchema>

const features = [
  { icon: Calendar,      text: 'Real-time booking management' },
  { icon: Target,        text: 'CRM & lead automation' },
  { icon: MessageCircle, text: 'WhatsApp & email campaigns' },
  { icon: BarChart2,     text: 'Revenue & occupancy reports' },
]

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false)
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const location  = useLocation()
  const from = (location.state as any)?.from?.pathname || '/'

  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: true },
  })

  const onSubmit = async (data: LoginForm) => {
    const ok = await login(data.email, data.password)
    if (ok) {
      navigate(from, { replace: true })
    } else {
      setError('root', { message: 'Invalid email or password. Please try again.' })
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 bg-navy-900 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg,#c9a84c 0,#c9a84c 1px,transparent 0,transparent 50%)', backgroundSize: '24px 24px' }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center"
        >
          {/* Logo SVG */}
          <div className="w-20 h-20 mx-auto mb-6">
            <svg viewBox="0 0 80 72" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="40,4 4,68 76,68" fill="none" stroke="#c9a84c" strokeWidth="2.5"/>
              <polygon points="40,20 20,60 60,60" fill="#c9a84c" fillOpacity="0.2"/>
              <text x="40" y="54" textAnchor="middle" fill="#c9a84c" fontSize="16" fontWeight="bold">SS</text>
            </svg>
          </div>

          <h1 className="text-3xl font-medium text-white tracking-wide">Sky Stay</h1>
          <p className="text-gold-400 text-xs tracking-[5px] mt-1 mb-4">RESORTS</p>
          <p className="text-navy-300 text-sm italic mb-10">Memories recreated.</p>

          {/* Stats */}
          <div className="flex gap-10 justify-center mb-10">
            {[['48+','SUITES'],['84%','OCCUPIED'],['4.8★','RATING']].map(([n,l]) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-medium text-gold-400">{n}</div>
                <div className="text-[10px] tracking-[2px] text-navy-400 mt-1">{l}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="space-y-3 text-left">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-navy-300 text-sm">
                <Icon size={15} className="text-gold-400 flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center bg-cream-50 p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="text-2xl font-medium text-navy-700">Sky Stay</div>
            <div className="text-gold-500 text-[10px] tracking-[4px]">RESORTS</div>
          </div>

          <h2 className="text-2xl font-medium text-navy-700 mb-1">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-8">Sign in to your Sky Stay account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[11px] tracking-[2px] text-gray-500 mb-2">EMAIL ADDRESS</label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                placeholder="admin@skystayresorts.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-sm text-sm text-navy-700 bg-white focus:outline-none focus:border-gold-400 transition-colors"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] tracking-[2px] text-gray-500 mb-2">PASSWORD</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-11 border border-gray-200 rounded-sm text-sm text-navy-700 bg-white focus:outline-none focus:border-gold-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy-700"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                <input {...register('remember')} type="checkbox" className="w-3.5 h-3.5 accent-gold-400" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-gold-500 hover:text-gold-600 text-xs tracking-wide">
                Forgot password?
              </Link>
            </div>

            {/* Root error */}
            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-sm p-3 text-sm text-red-600">
                {errors.root.message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gold-400 hover:bg-gold-300 disabled:opacity-60 text-navy-800 font-medium text-xs tracking-[2px] rounded-sm transition-colors"
            >
              {isLoading ? 'SIGNING IN…' : 'SIGN IN TO DASHBOARD'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <Link
            to="/register"
            className="w-full py-3 border border-gray-200 bg-white text-navy-700 text-sm rounded-sm flex items-center justify-center gap-2 hover:bg-cream-100 transition-colors"
          >
            Create a guest account
          </Link>

          <p className="text-center text-xs text-gray-400 mt-6">
            Not an admin?{' '}
            <span className="text-gold-500 cursor-pointer">Request access</span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
