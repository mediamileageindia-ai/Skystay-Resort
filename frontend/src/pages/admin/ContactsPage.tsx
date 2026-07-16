import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Search, Mail, Phone, Clock } from 'lucide-react'

async function fetchContacts() {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export default function ContactsPage() {
  const [search, setSearch] = useState('')

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: fetchContacts,
  })

  const filtered = contacts.filter((c: any) => {
    const q = search.toLowerCase()
    if (!q) return true
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.includes(q) ||
      c.message?.toLowerCase().includes(q)
    )
  })

  const fmt = (d: string) =>
    new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div>
        <p className="text-[11px] tracking-[2px] text-gold-500 mb-1">MESSAGES</p>
        <h1 className="text-xl font-medium text-navy-700">Contact Enquiries</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Messages', value: contacts.length },
          { label: 'Today',          value: contacts.filter((c: any) => new Date(c.created_at).toDateString() === new Date().toDateString()).length },
          { label: 'This Week',      value: contacts.filter((c: any) => (Date.now() - new Date(c.created_at).getTime()) < 7 * 86400000).length },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-sm p-4">
            <p className="text-[10px] tracking-[1px] text-gray-400 mb-1">{s.label.toUpperCase()}</p>
            <p className="text-2xl font-semibold text-navy-700">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-2 max-w-80">
        <Search size={14} className="text-gray-400 flex-shrink-0" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, phone..."
          className="bg-transparent text-sm text-navy-700 outline-none w-full"
        />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading messages...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">No messages found.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c: any) => (
            <div key={c.id} className="bg-white border border-gray-200 rounded-sm p-5 hover:border-gold-400/40 transition-colors">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                <div>
                  <h3 className="font-medium text-navy-700 text-sm">{c.name}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <a href={`mailto:${c.email}`} className="flex items-center gap-1 text-xs text-gold-500 hover:text-gold-600">
                      <Mail size={11} /> {c.email}
                    </a>
                    {c.phone && (
                      <a href={`tel:${c.phone}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-navy-700">
                        <Phone size={11} /> {c.phone}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock size={11} />
                  {c.created_at ? fmt(c.created_at) : '—'}
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed bg-cream-50 rounded px-3 py-2">
                {c.message}
              </p>
              <div className="flex gap-2 mt-3">
                <a href={`mailto:${c.email}?subject=Re: Your enquiry at Sky Stay Resorts`}
                  className="text-xs px-3 py-1.5 bg-gold-400 hover:bg-gold-300 text-navy-800 rounded-sm font-medium transition-colors">
                  Reply via Email
                </a>
                {c.phone && (
                  <a href={`https://wa.me/91${c.phone.replace(/\D/g, '')}?text=Hello ${c.name}, thank you for contacting Sky Stay Resorts!`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 bg-[#25D366] hover:bg-[#1fbc59] text-white rounded-sm font-medium transition-colors">
                    Reply on WhatsApp
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
