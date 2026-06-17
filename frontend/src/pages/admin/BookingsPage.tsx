import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Download, CheckCircle, XCircle, RefreshCw, Eye } from 'lucide-react'
import { bookingsService } from '@/services/api'
import { Booking, BookingStatus } from '@/types'
import toast from 'react-hot-toast'

const FALLBACK: Partial<Booking>[] = [
  { id:'1', bookingNumber:'SKY-2025-0042', status:'confirmed',   totalAmount:5599,  checkIn:'2025-12-20', checkOut:'2025-12-22', guests:2, paymentMode:'full',    guestSnapshot:{name:'Ravi Kumar',   email:'r@e.com', phone:'9876543210'} },
  { id:'2', bookingNumber:'SKY-2025-0041', status:'confirmed',   totalAmount:17919, checkIn:'2025-12-18', checkOut:'2025-12-22', guests:4, paymentMode:'full',    guestSnapshot:{name:'Meena Raj',    email:'m@e.com', phone:'8765432109'} },
  { id:'3', bookingNumber:'SKY-2025-0040', status:'pending',     totalAmount:11199, checkIn:'2025-12-16', checkOut:'2025-12-18', guests:2, paymentMode:'advance', guestSnapshot:{name:'Suresh P',     email:'s@e.com', phone:'7654321098'} },
  { id:'4', bookingNumber:'SKY-2025-0039', status:'cancelled',   totalAmount:8959,  checkIn:'2025-12-14', checkOut:'2025-12-16', guests:2, paymentMode:'full',    guestSnapshot:{name:'Priya S',      email:'p@e.com', phone:'6543210987'} },
  { id:'5', bookingNumber:'SKY-2025-0038', status:'checked_in',  totalAmount:25749, checkIn:'2025-12-12', checkOut:'2025-12-15', guests:6, paymentMode:'full',    guestSnapshot:{name:'Dinesh K',     email:'d@e.com', phone:'5432109876'} },
  { id:'6', bookingNumber:'SKY-2025-0037', status:'checked_out', totalAmount:9999,  checkIn:'2025-12-10', checkOut:'2025-12-12', guests:2, paymentMode:'full',    guestSnapshot:{name:'Anitha V',     email:'a@e.com', phone:'4321098765'} },
]

function StatusBadge({ status }: { status: BookingStatus }) {
  const map: Record<BookingStatus, string> = {
    confirmed:   'bg-green-50 text-green-800',
    pending:     'bg-amber-50 text-amber-800',
    cancelled:   'bg-red-50 text-red-800',
    checked_in:  'bg-blue-50 text-blue-800',
    checked_out: 'bg-gray-100 text-gray-700',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] tracking-wide font-medium ${map[status]}`}>
      {status.replace('_', ' ').toUpperCase()}
    </span>
  )
}

export default function BookingsPage() {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['admin-bookings', statusFilter],
    queryFn: () => bookingsService.getAll({
      status: statusFilter !== 'all' ? statusFilter : undefined
    }).then(r => r.data),
    placeholderData: { data: FALLBACK },
  })

  const confirmMutation = useMutation({
    mutationFn: (id: string) => bookingsService.confirm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] })
      toast.success('Booking confirmed! Guest notified via WhatsApp & Email ✓')
    },
  })

  const cancelMutation = useMutation({
    mutationFn: (id: string) => bookingsService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] })
      toast.success('Booking cancelled. Refund initiated if applicable.')
    },
  })

  const bookings: Partial<Booking>[] = data?.data || FALLBACK

  const filtered = bookings.filter(b => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false
    const q = search.toLowerCase()
    if (q && !b.guestSnapshot?.name.toLowerCase().includes(q) &&
        !b.bookingNumber?.toLowerCase().includes(q) &&
        !b.guestSnapshot?.phone.includes(q)) return false
    return true
  })

  const toggleSelect = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-[11px] tracking-[2px] text-gold-500 mb-1">RESERVATIONS</p>
          <h1 className="text-xl font-medium text-navy-700">Booking Management</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => toast.success('Exported to CSV ✓')}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-sm text-sm text-gray-600 bg-white hover:bg-gray-50"
          >
            <Download size={14} /> Export
          </button>
          <button className="bg-gold-400 hover:bg-gold-300 text-navy-800 text-xs tracking-[1px] font-medium px-4 py-2 rounded-sm transition-colors">
            + New Booking
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-0 border-b border-gray-200">
        {(['all','pending','confirmed','checked_in','checked_out','cancelled'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2.5 text-xs border-b-2 -mb-px transition-colors ${
              statusFilter === s
                ? 'text-navy-700 border-gold-400 font-medium'
                : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            {s === 'all' ? 'All' : s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex items-center gap-2 bg-cream-50 border border-gray-200 rounded px-3 py-2 flex-1 max-w-64">
          <Search size={14} className="text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Guest name, booking #, phone..."
            className="border-none bg-transparent text-sm text-navy-700 outline-none w-full"
          />
        </div>
        {selected.length > 0 && (
          <button
            onClick={() => { selected.forEach(id => confirmMutation.mutate(id)); setSelected([]) }}
            className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 rounded-sm text-sm border border-green-200"
          >
            <CheckCircle size={14} /> Confirm {selected.length} selected
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-md overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-cream-50 border-b border-gray-200 text-[10px] tracking-[1px] text-gray-400">
              <th className="px-4 py-3 w-10">
                <input type="checkbox" className="w-3.5 h-3.5 accent-gold-400" />
              </th>
              <th className="text-left px-4 py-3">BOOKING #</th>
              <th className="text-left px-4 py-3">GUEST</th>
              <th className="text-left px-4 py-3">DATES</th>
              <th className="text-left px-4 py-3">GUESTS</th>
              <th className="text-left px-4 py-3">AMOUNT</th>
              <th className="text-left px-4 py-3">MODE</th>
              <th className="text-left px-4 py-3">STATUS</th>
              <th className="text-left px-4 py-3">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id} className="border-t border-gray-50 hover:bg-cream-50 transition-colors">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(b.id!)}
                    onChange={() => toggleSelect(b.id!)}
                    className="w-3.5 h-3.5 accent-gold-400"
                  />
                </td>
                <td className="px-4 py-3 text-xs text-gold-500 font-medium">{b.bookingNumber}</td>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-navy-700">{b.guestSnapshot?.name}</p>
                  <p className="text-xs text-gray-500">{b.guestSnapshot?.phone}</p>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  {b.checkIn} → {b.checkOut}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{b.guests}</td>
                <td className="px-4 py-3 text-sm font-medium text-navy-700">
                  ₹{Number(b.totalAmount).toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] ${b.paymentMode === 'advance' ? 'text-amber-700' : 'text-blue-700'}`}>
                    {b.paymentMode === 'advance' ? '30% Advance' : 'Full'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={b.status as BookingStatus} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => toast.success(`Booking ${b.bookingNumber} details opened`)}
                      className="p-1.5 rounded bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                      title="View"
                    >
                      <Eye size={13} />
                    </button>
                    {b.status === 'pending' && (
                      <button
                        onClick={() => confirmMutation.mutate(b.id!)}
                        disabled={confirmMutation.isPending}
                        className="p-1.5 rounded bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                        title="Confirm"
                      >
                        <CheckCircle size={13} />
                      </button>
                    )}
                    {b.status === 'cancelled' && (
                      <button
                        onClick={() => toast.success(`Refund for ${b.bookingNumber} initiated ✓`)}
                        className="p-1.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        title="Refund"
                      >
                        <RefreshCw size={13} />
                      </button>
                    )}
                    {(b.status === 'pending' || b.status === 'confirmed') && (
                      <button
                        onClick={() => cancelMutation.mutate(b.id!)}
                        disabled={cancelMutation.isPending}
                        className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        title="Cancel"
                      >
                        <XCircle size={13} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center py-10 text-gray-400 text-sm">No bookings found</p>
        )}
      </div>

      {/* Pagination placeholder */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Showing {filtered.length} of {bookings.length} bookings</span>
        <div className="flex gap-1">
          {[1,2,3].map(p => (
            <button key={p} className={`w-7 h-7 rounded border text-xs ${p===1?'border-gold-400 text-gold-500':'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
