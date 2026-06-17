import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Download, Edit, Trash2, Plus, TrendingUp, Users, BarChart2, Calendar } from 'lucide-react'
import { adminService } from '@/services/api'
import toast from 'react-hot-toast'

// ============================================
// ADMIN ROOMS PAGE
// ============================================
const ROOMS_DATA = [
  { id:'1', roomName:'Deluxe Garden Room',     roomType:'deluxe',    price:4999,  status:'available', units:10, occupied:8, emoji:'🛏️' },
  { id:'2', roomName:'Premium Valley Suite',   roomType:'suite',     price:7999,  status:'available', units:8,  occupied:5, emoji:'🌄' },
  { id:'3', roomName:'Luxury Pool Villa',       roomType:'villa',     price:15999, status:'occupied',  units:4,  occupied:4, emoji:'🏡' },
  { id:'4', roomName:'Forest Retreat Cottage', roomType:'cottage',   price:6499,  status:'available', units:6,  occupied:3, emoji:'🌿' },
  { id:'5', roomName:'Horizon Penthouse',       roomType:'penthouse', price:22999, status:'available', units:2,  occupied:1, emoji:'🌅' },
  { id:'6', roomName:'Romance Suite',           roomType:'romance',   price:9999,  status:'available', units:6,  occupied:2, emoji:'💑' },
]

export function AdminRoomsPage() {
  const [showModal, setShowModal] = useState(false)

  const totalUnits    = ROOMS_DATA.reduce((s, r) => s + r.units, 0)
  const totalOccupied = ROOMS_DATA.reduce((s, r) => s + r.occupied, 0)

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-[11px] tracking-[2px] text-gold-500 mb-1">INVENTORY</p>
          <h1 className="text-xl font-medium text-navy-700">Room Management</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => toast.success('Room list exported!')}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-sm text-sm text-gray-600 bg-white hover:bg-gray-50">
            <Download size={14} /> Export
          </button>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-gold-400 hover:bg-gold-300 text-navy-800 text-xs tracking-[1px] font-medium px-4 py-2 rounded-sm transition-colors">
            <Plus size={14} /> Add Room
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <p className="text-2xl font-medium text-navy-700">{totalUnits}</p>
          <p className="text-xs text-gray-400 mt-0.5">Total units</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <p className="text-2xl font-medium text-navy-700">{totalOccupied}/{totalUnits}</p>
          <p className="text-xs text-gray-400 mt-0.5">Occupied today</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <p className="text-2xl font-medium text-green-700">{Math.round(totalOccupied / totalUnits * 100)}%</p>
          <p className="text-xs text-gray-400 mt-0.5">Occupancy rate</p>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-cream-50 border-b border-gray-200 text-[10px] tracking-[1px] text-gray-400">
              <th className="text-left px-5 py-3">ROOM</th>
              <th className="text-left px-5 py-3">TYPE</th>
              <th className="text-left px-5 py-3">PRICE/NIGHT</th>
              <th className="text-left px-5 py-3">OCCUPANCY</th>
              <th className="text-left px-5 py-3">STATUS</th>
              <th className="text-left px-5 py-3">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {ROOMS_DATA.map(room => (
              <tr key={room.id} className="border-t border-gray-50 hover:bg-cream-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-cream-100 flex items-center justify-center text-xl">{room.emoji}</div>
                    <span className="text-sm font-medium text-navy-700">{room.roomName}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs capitalize text-gray-600 bg-gray-100 px-2 py-0.5 rounded-sm">{room.roomType}</span>
                </td>
                <td className="px-5 py-4 text-sm font-medium text-navy-700">₹{room.price.toLocaleString('en-IN')}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 max-w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gold-400 rounded-full" style={{ width: `${(room.occupied / room.units) * 100}%` }} />
                    </div>
                    <span className="text-xs text-gray-600">{room.occupied}/{room.units}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    room.occupied === room.units ? 'bg-amber-50 text-amber-800' : 'bg-green-50 text-green-800'
                  }`}>
                    {room.occupied === room.units ? 'FULLY BOOKED' : 'AVAILABLE'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-1.5">
                    <button onClick={() => toast.success(`Editing ${room.roomName}`)}
                      className="p-1.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors" title="Edit">
                      <Edit size={13} />
                    </button>
                    <button onClick={() => toast.success('Pricing updated!')}
                      className="px-2 py-1 rounded border border-gray-200 text-xs text-gray-600 hover:bg-gray-50">
                      Pricing
                    </button>
                    <button onClick={() => toast.success('Room images updated!')}
                      className="px-2 py-1 rounded border border-gray-200 text-xs text-gray-600 hover:bg-gray-50">
                      Photos
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================
// ADMIN CUSTOMERS PAGE
// ============================================
const CUSTOMERS = [
  { id:'1', name:'Ravi Kumar',   email:'ravi@email.com',   phone:'+91 98765 43210', city:'Chennai',    bookings:3, spent:25757, lastStay:'Dec 2025', type:'loyal' },
  { id:'2', name:'Meena Raj',    email:'meena@email.com',  phone:'+91 87654 32109', city:'Bangalore',  bookings:5, spent:68420, lastStay:'Dec 2025', type:'vip' },
  { id:'3', name:'Suresh P',     email:'suresh@email.com', phone:'+91 76543 21098', city:'Coimbatore', bookings:2, spent:19318, lastStay:'Nov 2025', type:'regular' },
  { id:'4', name:'Dinesh K',     email:'dinesh@email.com', phone:'+91 65432 10987', city:'Madurai',    bookings:4, spent:44200, lastStay:'Dec 2025', type:'loyal' },
  { id:'5', name:'Priya S',      email:'priya@email.com',  phone:'+91 54321 09876', city:'Chennai',    bookings:1, spent:8959,  lastStay:'Dec 2025', type:'new' },
  { id:'6', name:'Kavitha R',    email:'kavitha@email.com',phone:'+91 43210 98765', city:'Salem',      bookings:2, spent:22198, lastStay:'Oct 2025', type:'regular' },
]

const TYPE_STYLES: Record<string, string> = {
  vip:     'bg-gold-50 text-gold-700',
  loyal:   'bg-green-50 text-green-800',
  regular: 'bg-blue-50 text-blue-800',
  new:     'bg-gray-100 text-gray-700',
}

export function AdminCustomersPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState<typeof CUSTOMERS[0] | null>(null)

  const filtered = CUSTOMERS.filter(c => {
    if (typeFilter !== 'all' && c.type !== typeFilter) return false
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.phone.includes(search)) return false
    return true
  })

  const totalRevenue = CUSTOMERS.reduce((s, c) => s + c.spent, 0)

  if (selectedCustomer) {
    return (
      <div className="p-6">
        <button onClick={() => setSelectedCustomer(null)} className="text-xs text-gold-500 mb-5 flex items-center gap-1">
          ← Back to customers
        </button>
        <div className="bg-navy-900 rounded-md p-6 text-white flex items-center gap-6 mb-5">
          <div className="w-14 h-14 rounded-full bg-gold-400 flex items-center justify-center text-navy-900 text-2xl font-medium flex-shrink-0">
            {selectedCustomer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-medium">{selectedCustomer.name}</h2>
            <p className="text-navy-400 text-sm mt-0.5">{selectedCustomer.email} · {selectedCustomer.phone}</p>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium mt-2 inline-block uppercase ${TYPE_STYLES[selectedCustomer.type]}`}>{selectedCustomer.type}</span>
          </div>
          <div className="flex gap-8">
            {[['₹'+selectedCustomer.spent.toLocaleString('en-IN'),'LIFETIME VALUE'],[selectedCustomer.bookings,'TOTAL STAYS'],['4.8★','AVG RATING']].map(([v,l]) => (
              <div key={String(l)} className="text-center">
                <div className="text-xl font-medium text-gold-400">{v}</div>
                <div className="text-[10px] text-navy-400">{l}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => toast.success('WhatsApp sent!')} className="px-3 py-1.5 bg-green-500 text-white text-xs rounded-sm">WhatsApp</button>
            <button onClick={() => toast.success('Email sent!')} className="px-3 py-1.5 border border-white/20 text-white text-xs rounded-sm">Email</button>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-md p-5">
            <h3 className="text-sm font-medium text-navy-700 mb-4">Preferences</h3>
            <div className="space-y-3 text-sm">
              {[['Preferred room','Deluxe / Suite'],['Avg stay duration','2 nights'],['City',selectedCustomer.city],['Last stay',selectedCustomer.lastStay],['Marketing consent','Yes ✓']].map(([k,v]) => (
                <div key={String(k)} className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500 text-xs">{k}</span>
                  <span className="text-navy-700 text-xs">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-md p-5">
            <h3 className="text-sm font-medium text-navy-700 mb-4">Revenue contribution</h3>
            <p className="text-3xl font-light text-gold-500 mb-1">₹{selectedCustomer.spent.toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-400">over {selectedCustomer.bookings} bookings</p>
            <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gold-400 rounded-full" style={{ width: `${(selectedCustomer.spent / totalRevenue) * 100}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">{((selectedCustomer.spent / totalRevenue) * 100).toFixed(1)}% of total revenue</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-[11px] tracking-[2px] text-gold-500 mb-1">GUESTS</p>
          <h1 className="text-xl font-medium text-navy-700">Customer Management</h1>
        </div>
        <button onClick={() => toast.success('Customer list exported!')}
          className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-sm text-sm text-gray-600 bg-white hover:bg-gray-50">
          <Download size={14} /> Export
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <p className="text-2xl font-medium text-navy-700">1,248</p><p className="text-xs text-gray-400">Total guests</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <p className="text-2xl font-medium text-navy-700">34%</p><p className="text-xs text-gray-400">Returning guests</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <p className="text-2xl font-medium text-navy-700">₹28.4K</p><p className="text-xs text-gray-400">Avg lifetime value</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex items-center gap-2 bg-cream-50 border border-gray-200 rounded px-3 py-2 flex-1 max-w-64">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or phone..." className="border-none bg-transparent text-sm text-navy-700 outline-none w-full" />
        </div>
        {['all','vip','loyal','regular','new'].map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 rounded-sm text-xs capitalize transition-colors ${typeFilter === t ? 'bg-navy-700 text-gold-400' : 'border border-gray-200 text-gray-600 hover:border-gold-400'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-cream-50 border-b border-gray-200 text-[10px] tracking-[1px] text-gray-400">
              <th className="text-left px-4 py-3">GUEST</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">PHONE</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">CITY</th>
              <th className="text-left px-4 py-3">STAYS</th>
              <th className="text-left px-4 py-3">SPENT</th>
              <th className="text-left px-4 py-3">TYPE</th>
              <th className="text-left px-4 py-3">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-t border-gray-50 hover:bg-cream-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-navy-700 text-white flex items-center justify-center text-xs flex-shrink-0">
                      {c.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy-700">{c.name}</p>
                      <p className="text-xs text-gray-400 hidden sm:block">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{c.phone}</td>
                <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{c.city}</td>
                <td className="px-4 py-3 text-sm text-navy-700">{c.bookings}</td>
                <td className="px-4 py-3 text-sm font-medium text-navy-700">₹{c.spent.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${TYPE_STYLES[c.type]}`}>{c.type}</span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => setSelectedCustomer(c)}
                    className="text-xs text-gold-500 border border-gold-400/40 px-3 py-1 rounded-sm hover:bg-gold-50 transition-colors">
                    Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================
// ADMIN REPORTS PAGE
// ============================================
export function AdminReportsPage() {
  const [period, setPeriod] = useState<'monthly'|'yearly'>('monthly')
  const { data: revenueData } = useQuery({
    queryKey: ['revenue', period],
    queryFn: () => adminService.getRevenue(period).then(r => r.data),
    placeholderData: null,
  })

  const monthlyData = [
    { month:'Jan', revenue:220000, bookings:44 },{ month:'Feb', revenue:270000, bookings:54 },
    { month:'Mar', revenue:195000, bookings:39 },{ month:'Apr', revenue:305000, bookings:61 },
    { month:'May', revenue:345000, bookings:69 },{ month:'Jun', revenue:285000, bookings:57 },
    { month:'Jul', revenue:415000, bookings:83 },{ month:'Aug', revenue:440000, bookings:88 },
    { month:'Sep', revenue:355000, bookings:71 },{ month:'Oct', revenue:382000, bookings:76 },
    { month:'Nov', revenue:465000, bookings:93 },{ month:'Dec', revenue:490000, bookings:98 },
  ]
  const maxRev = Math.max(...monthlyData.map(d => d.revenue))

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-[11px] tracking-[2px] text-gold-500 mb-1">ANALYTICS</p>
          <h1 className="text-xl font-medium text-navy-700">Revenue Reports</h1>
        </div>
        <div className="flex gap-2">
          <select value={period} onChange={e => setPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-200 rounded-sm text-sm text-navy-700 bg-white">
            <option value="monthly">This Year — Monthly</option>
            <option value="yearly">All Time — Yearly</option>
          </select>
          <button onClick={() => toast.success('Report exported as PDF ✓')}
            className="flex items-center gap-1.5 px-3 py-2 bg-gold-400 hover:bg-gold-300 text-navy-800 text-xs rounded-sm font-medium">
            <Download size={14} /> Export PDF
          </button>
        </div>
      </div>

      {/* Big Revenue */}
      <div className="bg-navy-900 rounded-md p-8 text-center">
        <p className="text-[11px] tracking-[3px] text-gold-400 mb-2">TOTAL REVENUE — 2025</p>
        <p className="text-5xl font-light text-gold-400 mb-2">₹48.6L</p>
        <p className="text-green-400 text-sm">↑ 24% vs 2024</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label:'This Month',     value:'₹4.8L', icon:TrendingUp, color:'text-gold-500' },
          { label:'Occupancy',      value:'84%',   icon:BarChart2,  color:'text-blue-600' },
          { label:'Avg Booking',    value:'₹28.4K',icon:Calendar,   color:'text-green-600' },
          { label:'Repeat Guests',  value:'34%',   icon:Users,      color:'text-navy-600' },
        ].map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-white border border-gray-200 rounded-md p-4">
              <Icon size={18} className={`${s.color} mb-2`} />
              <p className="text-2xl font-medium text-navy-700">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* Bar Chart */}
      <div className="bg-white border border-gray-200 rounded-md p-5">
        <h2 className="text-sm font-medium text-navy-700 mb-5">Monthly revenue breakdown</h2>
        <div className="flex items-end gap-2 h-36">
          {monthlyData.map(d => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-gold-400 hover:bg-gold-300 rounded-t-sm transition-colors cursor-pointer"
                style={{ height: `${(d.revenue / maxRev) * 100}%`, minHeight: 4 }}
                title={`₹${(d.revenue/1000).toFixed(0)}K`}
              />
              <span className="text-[9px] text-gray-400">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue by Room */}
      <div className="bg-white border border-gray-200 rounded-md p-5">
        <h2 className="text-sm font-medium text-navy-700 mb-5">Revenue by room type</h2>
        <div className="space-y-3">
          {[
            { room:'Luxury Pool Villa',      rev:14.2, color:'bg-gold-400' },
            { room:'Horizon Penthouse',       rev:11.8, color:'bg-navy-700' },
            { room:'Premium Valley Suite',   rev:9.1,  color:'bg-blue-600' },
            { room:'Romance Suite',           rev:7.3,  color:'bg-green-600' },
            { room:'Forest Retreat Cottage', rev:6.2,  color:'bg-amber-500' },
            { room:'Deluxe Garden Room',      rev:5.9,  color:'bg-gray-400' },
          ].map(r => (
            <div key={r.room} className="flex items-center gap-3 text-sm">
              <span className="w-44 text-xs text-gray-500 truncate">{r.room}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${r.color}`} style={{ width: `${(r.rev / 14.2) * 100}%` }} />
              </div>
              <span className="text-xs font-medium text-navy-700 w-12 text-right">₹{r.rev}L</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
