import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Search, Download, CheckCircle, XCircle, RefreshCw, LogIn, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'checked_in' | 'checked_out'

const STATUS_STYLES: Record<BookingStatus, string> = {
  confirmed:   'bg-green-50 text-green-800',
  pending:     'bg-amber-50 text-amber-800',
  cancelled:   'bg-red-50 text-red-800',
  checked_in:  'bg-blue-50 text-blue-800',
  checked_out: 'bg-gray-100 text-gray-700',
}

function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] tracking-wide font-medium ${STATUS_STYLES[status]}`}>
      {status.replace('_', ' ').toUpperCase()}
    </span>
  )
}

async function fetchBookings(statusFilter: string) {
  let query = supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
  if (statusFilter !== 'all') query = query.eq('status', statusFilter)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

async function updateStatus(id: string, status: BookingStatus) {
  const { error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

function exportCSV(bookings: any[]) {
  const headers = ['Booking #','Guest Name','Email','Phone','Room','Check-in','Check-out','Guests','Amount','Status','Payment Mode']
  const rows = bookings.map(b => [
    b.booking_number, b.guest_name, b.guest_email, b.guest_phone ?? '',
    b.room_name ?? '', b.check_in, b.check_out, b.guests,
    b.total_amount, b.status, b.payment_mode
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = 'SkyStay-Bookings.csv'
  a.click(); URL.revokeObjectURL(url)
}

export default function BookingsPage() {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['admin-bookings', statusFilter],
    queryFn: () => fetchBookings(statusFilter),
  })

  const handleStatus = async (id: string, status: BookingStatus, label: string) => {
    try {
      await updateStatus(id, status)
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] })
      toast.success(`${label} successfully.`)
    } catch {
      toast.error('Failed to update booking.')
    }
  }

  const filtered = bookings.filter((b: any) => {
    const q = search.toLowerCase()
    if (!q) return true
    return (
      b.guest_name?.toLowerCase().includes(q) ||
      b.booking_number?.toLowerCase().includes(q) ||
      b.guest_phone?.includes(q) ||
      b.guest_email?.toLowerCase().includes(q)
    )
  })

  const totalRevenue = bookings
    .filter((b: any) => b.status !== 'cancelled')
    .reduce((sum: number, b: any) => sum + Number(b.total_amount), 0)

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
            onClick={() => exportCSV(filtered)}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-sm text-sm text-gray-600 bg-white hover:bg-gray-50"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: bookings.length, color: 'text-navy-700' },
          { label: 'Confirmed',      value: bookings.filter((b:any) => b.status === 'confirmed').length,  color: 'text-green-700' },
          { label: 'Pending',        value: bookings.filter((b:any) => b.status === 'pending').length,    color: 'text-amber-700' },
          { label: 'Total Revenue',  value: `₹${totalRevenue.toLocaleString('en-IN')}`, color: 'text-gold-600' },
        ].map(card => (
          <div key={card.label} className="bg-white border border-gray-200 rounded-sm p-4">
            <p className="text-[10px] tracking-[1px] text-gray-400 mb-1">{card.label.toUpperCase()}</p>
            <p className={`text-xl font-semibold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Status Tabs */}
      <div className="flex gap-0 border-b border-gray-200 overflow-x-auto">
        {(['all','pending','confirmed','checked_in','checked_out','cancelled'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2.5 text-xs border-b-2 -mb-px transition-colors whitespace-nowrap ${
              statusFilter === s
                ? 'text-navy-700 border-gold-400 font-medium'
                : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            {s === 'all' ? 'All' : s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            <span className="ml-1.5 text-[10px] bg-gray-100 text-gray-500 rounded-full px-1.5 py-0.5">
              {s === 'all' ? bookings.length : bookings.filter((b:any) => b.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-cream-50 border border-gray-200 rounded px-3 py-2 max-w-80">
        <Search size={14} className="text-gray-400 flex-shrink-0" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Guest name, booking #, phone, email..."
          className="border-none bg-transparent text-sm text-navy-700 outline-none w-full"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-x-auto">
        {isLoading ? (
          <div className="py-20 text-center text-gray-400 text-sm">Loading bookings...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">No bookings found.</div>
        ) : (
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-cream-50 border-b border-gray-200 text-[10px] tracking-[1px] text-gray-400">
                <th className="text-left px-4 py-3">BOOKING #</th>
                <th className="text-left px-4 py-3">GUEST</th>
                <th className="text-left px-4 py-3">ROOM</th>
                <th className="text-left px-4 py-3">DATES</th>
                <th className="text-left px-4 py-3">GUESTS</th>
                <th className="text-left px-4 py-3">AMOUNT</th>
                <th className="text-left px-4 py-3">STATUS</th>
                <th className="text-left px-4 py-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b: any) => (
                <tr key={b.id} className="border-t border-gray-50 hover:bg-cream-50 transition-colors">
                  <td className="px-4 py-3 text-xs text-gold-500 font-medium whitespace-nowrap">{b.booking_number}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-navy-700">{b.guest_name}</p>
                    <p className="text-xs text-gray-500">{b.guest_phone}</p>
                    <p className="text-xs text-gray-400">{b.guest_email}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{b.room_name ?? '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                    {b.check_in} → {b.check_out}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-center">{b.guests}</td>
                  <td className="px-4 py-3 text-sm font-medium text-navy-700 whitespace-nowrap">
                    ₹{Number(b.total_amount).toLocaleString('en-IN')}
                    <p className="text-[10px] text-gray-400 font-normal">{b.payment_mode === 'advance' ? '30% Advance' : 'Full'}</p>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 flex-wrap">
                      {b.status === 'pending' && (
                        <button
                          onClick={() => handleStatus(b.id, 'confirmed', 'Booking confirmed')}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 text-xs"
                          title="Confirm"
                        >
                          <CheckCircle size={12} /> Confirm
                        </button>
                      )}
                      {b.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatus(b.id, 'checked_in', 'Guest checked in')}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs"
                          title="Check In"
                        >
                          <LogIn size={12} /> Check In
                        </button>
                      )}
                      {b.status === 'checked_in' && (
                        <button
                          onClick={() => handleStatus(b.id, 'checked_out', 'Guest checked out')}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-gray-50 text-gray-700 hover:bg-gray-100 text-xs"
                          title="Check Out"
                        >
                          <LogOut size={12} /> Check Out
                        </button>
                      )}
                      {(b.status === 'pending' || b.status === 'confirmed') && (
                        <button
                          onClick={() => handleStatus(b.id, 'cancelled', 'Booking cancelled')}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100 text-xs"
                          title="Cancel"
                        >
                          <XCircle size={12} /> Cancel
                        </button>
                      )}
                      {b.status === 'cancelled' && (
                        <button
                          onClick={() => handleStatus(b.id, 'pending', 'Booking restored')}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs"
                          title="Restore"
                        >
                          <RefreshCw size={12} /> Restore
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-gray-400">
        Showing {filtered.length} of {bookings.length} bookings
      </p>
    </div>
  )
}
