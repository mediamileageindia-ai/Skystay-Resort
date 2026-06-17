import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { TrendingUp, CalendarCheck, Percent, UserPlus, ArrowUpRight, Clock } from 'lucide-react'
import { adminService, bookingsService } from '@/services/api'
import { DashboardStats, Booking } from '@/types'

// ---- Stat Card ----
function StatCard({
  label, value, change, changeType, icon: Icon, accent,
}: {
  label: string; value: string; change?: string; changeType?: 'up'|'down'|'neutral';
  icon: React.ElementType; accent: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border border-gray-200 rounded-md p-5 relative overflow-hidden border-r-[3px] ${accent}`}
    >
      <div className="text-gold-400 mb-3">
        <Icon size={20} aria-hidden="true" />
      </div>
      <p className="text-[11px] tracking-[1px] text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-medium text-navy-700">{value}</p>
      {change && (
        <p className={`text-xs mt-1 ${
          changeType === 'up' ? 'text-green-700' :
          changeType === 'down' ? 'text-red-600' : 'text-gray-500'
        }`}>
          {change}
        </p>
      )}
    </motion.div>
  )
}

// ---- Revenue Bar Chart ----
function RevenueChart({ data }: { data: { month: string; revenue: number }[] }) {
  const max = Math.max(...data.map(d => d.revenue))
  return (
    <div className="flex items-end gap-1.5 h-32 relative">
      <div className="absolute bottom-5 left-0 right-0 h-px bg-gray-100" />
      {data.map((d, i) => (
        <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full bg-gold-400 rounded-t-sm hover:bg-gold-300 transition-colors cursor-pointer"
            style={{ height: `${(d.revenue / max) * 90}%`, minHeight: 4 }}
            title={`₹${d.revenue.toLocaleString('en-IN')}`}
          />
          <span className="text-[9px] text-gray-400">{d.month}</span>
        </div>
      ))}
    </div>
  )
}

// ---- Status Badge ----
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed: 'bg-green-50 text-green-800',
    pending:   'bg-amber-50 text-amber-800',
    cancelled: 'bg-red-50 text-red-800',
    checked_in:'bg-blue-50 text-blue-800',
    checked_out:'bg-gray-100 text-gray-700',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] tracking-wide font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status.replace('_', ' ').toUpperCase()}
    </span>
  )
}

// ---- FALLBACK DATA (before API connects) ----
const FALLBACK_STATS: DashboardStats = {
  totalRevenue:    480000,
  revenueToday:    42350,
  bookingsToday:   7,
  occupancyRate:   84,
  checkInsToday:   5,
  checkOutsToday:  3,
  totalGuests:     1248,
  newLeads:        22,
  monthlyRevenue: [
    {month:'Jan',revenue:220000,bookings:44},{month:'Feb',revenue:270000,bookings:54},
    {month:'Mar',revenue:195000,bookings:39},{month:'Apr',revenue:305000,bookings:61},
    {month:'May',revenue:345000,bookings:69},{month:'Jun',revenue:285000,bookings:57},
    {month:'Jul',revenue:415000,bookings:83},{month:'Aug',revenue:440000,bookings:88},
    {month:'Sep',revenue:355000,bookings:71},{month:'Oct',revenue:382000,bookings:76},
    {month:'Nov',revenue:465000,bookings:93},{month:'Dec',revenue:490000,bookings:98},
  ],
  topRooms: [],
}

const FALLBACK_BOOKINGS: Partial<Booking>[] = [
  { id:'1', bookingNumber:'SKY-2025-0042', status:'confirmed',  totalAmount:5599,  checkIn:'2025-12-20', guestSnapshot:{name:'Ravi Kumar',email:'r@e.com',phone:'9876543210'} },
  { id:'2', bookingNumber:'SKY-2025-0041', status:'confirmed',  totalAmount:17919, checkIn:'2025-12-18', guestSnapshot:{name:'Meena Raj',email:'m@e.com',phone:'8765432109'} },
  { id:'3', bookingNumber:'SKY-2025-0040', status:'pending',    totalAmount:11199, checkIn:'2025-12-16', guestSnapshot:{name:'Suresh P',email:'s@e.com',phone:'7654321098'} },
  { id:'4', bookingNumber:'SKY-2025-0039', status:'cancelled',  totalAmount:8959,  checkIn:'2025-12-14', guestSnapshot:{name:'Priya S',email:'p@e.com',phone:'6543210987'} },
]

const ACTIVITIES = [
  { icon:'✓', color:'bg-green-50 text-green-700',  text:'Ravi Kumar checked in — Deluxe Garden', time:'10:30 AM' },
  { icon:'₹', color:'bg-blue-50 text-blue-700',    text:'Payment ₹17,919 received — Pool Villa',  time:'9:15 AM' },
  { icon:'!', color:'bg-amber-50 text-amber-700',  text:'New lead — Arjun M (Google Ads)',         time:'8:42 AM' },
  { icon:'✕', color:'bg-red-50 text-red-700',      text:'Booking cancelled — SKY-2025-039',        time:'7:00 AM' },
]

// ============================================
// MAIN COMPONENT
// ============================================
export default function DashboardPage() {
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['admin-dashboard'],
    queryFn:  () => adminService.getDashboard().then(r => r.data),
    placeholderData: FALLBACK_STATS,
  })

  const { data: bookingsData } = useQuery({
    queryKey: ['recent-bookings'],
    queryFn:  () => bookingsService.getAll({ limit: 5 }).then(r => r.data),
    placeholderData: { data: FALLBACK_BOOKINGS },
  })

  const s = stats || FALLBACK_STATS
  const bookings = bookingsData?.data || FALLBACK_BOOKINGS

  const fmt = (n: number) => `₹${(n / 100000).toFixed(1)}L`

  return (
    <div className="p-6 space-y-5">
      {/* Page header */}
      <div>
        <p className="text-[11px] tracking-[2px] text-gold-500 mb-1">OVERVIEW</p>
        <h1 className="text-xl font-medium text-navy-700">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="TOTAL REVENUE"    value={fmt(s.totalRevenue)}  change="↑ 18% this month"  changeType="up"    icon={TrendingUp}    accent="border-r-gold-400" />
        <StatCard label="BOOKINGS TODAY"   value={String(s.bookingsToday)} change="↑ 3 from yesterday" changeType="up"  icon={CalendarCheck} accent="border-r-green-600" />
        <StatCard label="OCCUPANCY RATE"   value={`${s.occupancyRate}%`}  change="↑ 12% vs last week" changeType="up"  icon={Percent}       accent="border-r-blue-600" />
        <StatCard label="NEW LEADS TODAY"  value={String(s.newLeads)}   change="↑ 8 from yesterday" changeType="up"    icon={UserPlus}      accent="border-r-red-500" />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-navy-700">Monthly revenue</h2>
            <select className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600 bg-white">
              <option>2025</option><option>2024</option>
            </select>
          </div>
          <RevenueChart data={s.monthlyRevenue} />
        </div>

        {/* Quick Stats */}
        <div className="bg-white border border-gray-200 rounded-md p-5">
          <h2 className="text-sm font-medium text-navy-700 mb-4">Today at a glance</h2>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              ['Check-ins',  s.checkInsToday],
              ['Check-outs', s.checkOutsToday],
              ['Occupied',   Math.round(s.totalGuests * s.occupancyRate / 100 / 26)],
              ['Available',  48 - Math.round(s.totalGuests * s.occupancyRate / 100 / 26)],
            ].map(([l,v]) => (
              <div key={String(l)} className="bg-cream-50 rounded p-3 text-center">
                <p className="text-lg font-medium text-navy-700">{v}</p>
                <p className="text-[10px] tracking-[1px] text-gray-400 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-amber-50 rounded p-2.5 text-xs">
              <span className="text-amber-800">Pending confirmations</span>
              <strong className="text-amber-900">3</strong>
            </div>
            <div className="flex justify-between items-center bg-red-50 rounded p-2.5 text-xs">
              <span className="text-red-800">Hot leads to follow up</span>
              <strong className="text-red-900">8</strong>
            </div>
            <div className="flex justify-between items-center bg-green-50 rounded p-2.5 text-xs">
              <span className="text-green-800">Payments verified today</span>
              <strong className="text-green-900">7</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-medium text-navy-700">Recent bookings</h2>
            <a href="/admin/bookings" className="text-xs text-gold-500 flex items-center gap-1 hover:text-gold-600">
              View all <ArrowUpRight size={12} />
            </a>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-cream-50 text-[10px] tracking-[1px] text-gray-400">
                <th className="text-left px-5 py-3">BOOKING #</th>
                <th className="text-left px-5 py-3">GUEST</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">CHECK-IN</th>
                <th className="text-left px-5 py-3">AMOUNT</th>
                <th className="text-left px-5 py-3">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b: any) => (
                <tr key={b.id} className="border-t border-gray-50 hover:bg-cream-50 transition-colors">
                  <td className="px-5 py-3 text-xs text-gold-500 font-medium">{b.bookingNumber}</td>
                  <td className="px-5 py-3 text-sm text-navy-700">{b.guestSnapshot?.name || '—'}</td>
                  <td className="px-5 py-3 text-xs text-gray-500 hidden md:table-cell">{b.checkIn}</td>
                  <td className="px-5 py-3 text-sm font-medium text-navy-700">
                    ₹{Number(b.totalAmount).toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Activity Feed */}
        <div className="bg-white border border-gray-200 rounded-md p-5">
          <h2 className="text-sm font-medium text-navy-700 mb-4 flex items-center gap-2">
            <Clock size={14} className="text-gold-400" /> Today's activity
          </h2>
          <div className="space-y-4">
            {ACTIVITIES.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${a.color}`}>
                  {a.icon}
                </div>
                <div>
                  <p className="text-xs text-navy-700 leading-snug">{a.text}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
