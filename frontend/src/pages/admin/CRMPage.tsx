import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  UserPlus, Flame, CheckCircle2, Send, Filter,
  MessageCircle, Mail, Phone, Search, TrendingUp, MoreHorizontal
} from 'lucide-react'
import { crmService } from '@/services/api'
import toast from 'react-hot-toast'
import { Lead, LeadStatus, LeadSource } from '@/types'

// ---- FALLBACK DATA ----
const FALLBACK_LEADS: Lead[] = [
  { id:'1', name:'Arjun M',   phone:'+91 99887 76655', email:'arjun@email.com',   source:'google_ads', status:'hot',       interest:'Pool Villa',     createdAt:'2025-12-16T10:30:00Z', budget:'₹15,000+' },
  { id:'2', name:'Kavitha R', phone:'+91 88776 65544', email:'kavitha@email.com', source:'facebook',   status:'warm',      interest:'Romance Suite',   createdAt:'2025-12-16T09:15:00Z', budget:'₹10,000' },
  { id:'3', name:'Dinesh K',  phone:'+91 77665 54433', email:'dinesh@email.com',  source:'website',    status:'converted', interest:'Deluxe Garden',   createdAt:'2025-12-15T14:00:00Z', budget:'₹5,000' },
  { id:'4', name:'Preethi A', phone:'+91 66554 43322', email:'p@email.com',       source:'instagram',  status:'hot',       interest:'Pool Villa',     createdAt:'2025-12-16T08:00:00Z', budget:'₹15,000+' },
  { id:'5', name:'Nithya R',  phone:'+91 55443 32211', email:'n@email.com',       source:'website',    status:'new',       interest:'Deluxe Garden',   createdAt:'2025-12-16T11:00:00Z', budget:'₹5,000' },
  { id:'6', name:'Karthik S', phone:'+91 44332 21100', email:'k@email.com',       source:'google_ads', status:'new',       interest:'Penthouse',       createdAt:'2025-12-16T07:30:00Z', budget:'₹22,000+' },
  { id:'7', name:'Senthil K', phone:'+91 33221 10099', email:'s2@email.com',      source:'whatsapp',   status:'warm',      interest:'Valley Suite',    createdAt:'2025-12-15T16:00:00Z', budget:'₹8,000' },
  { id:'8', name:'Asha T',    phone:'+91 22110 09988', email:'a@email.com',       source:'instagram',  status:'hot',       interest:'Romance Suite',   createdAt:'2025-12-16T06:00:00Z', budget:'₹10,000' },
]

const COLUMNS: { key: LeadStatus; label: string; color: string; bg: string; textColor: string }[] = [
  { key:'new',       label:'New',       color:'bg-blue-600',  bg:'bg-blue-50',  textColor:'text-blue-800'  },
  { key:'warm',      label:'Warm',      color:'bg-amber-500', bg:'bg-amber-50', textColor:'text-amber-800' },
  { key:'hot',       label:'Hot',       color:'bg-red-500',   bg:'bg-red-50',   textColor:'text-red-800'   },
  { key:'converted', label:'Converted', color:'bg-green-600', bg:'bg-green-50', textColor:'text-green-800' },
]

const SOURCE_COLORS: Record<LeadSource, string> = {
  google_ads: 'bg-blue-50 text-blue-800',
  facebook:   'bg-indigo-50 text-indigo-800',
  instagram:  'bg-pink-50 text-pink-800',
  whatsapp:   'bg-green-50 text-green-800',
  website:    'bg-amber-50 text-amber-800',
  direct:     'bg-gray-100 text-gray-700',
}

const SOURCE_LABELS: Record<LeadSource, string> = {
  google_ads: 'Google Ads',
  facebook:   'Facebook',
  instagram:  'Instagram',
  whatsapp:   'WhatsApp',
  website:    'Website',
  direct:     'Direct',
}

// ---- STAT CARD ----
function CRMStat({ label, value, sub, icon: Icon, accent }: any) {
  return (
    <div className={`bg-white border border-gray-200 rounded-md p-4 border-r-[3px] ${accent}`}>
      <div className="text-gold-400 mb-2"><Icon size={18} /></div>
      <p className="text-[10px] tracking-[1px] text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-medium text-navy-700">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  )
}

// ---- LEAD CARD ----
function LeadCard({ lead, onAction }: { lead: Lead; onAction: (action: string, lead: Lead) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-gray-200 rounded bg-cream-50 p-3 cursor-pointer hover:border-gold-400 transition-colors"
    >
      <p className="text-sm font-medium text-navy-700">{lead.name}</p>
      <p className="text-xs text-gray-500 mt-0.5">{lead.interest}</p>
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${SOURCE_COLORS[lead.source]}`}>
          {SOURCE_LABELS[lead.source]}
        </span>
        {lead.budget && <span className="text-[10px] text-gray-500">{lead.budget}</span>}
      </div>
      <div className="flex gap-1.5 mt-3">
        <button
          onClick={() => onAction('whatsapp', lead)}
          className="flex items-center gap-1 text-[11px] px-2 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
        >
          <MessageCircle size={11} /> WA
        </button>
        <button
          onClick={() => onAction('email', lead)}
          className="flex items-center gap-1 text-[11px] px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
        >
          <Mail size={11} /> Email
        </button>
        {lead.status !== 'converted' && (
          <button
            onClick={() => onAction('convert', lead)}
            className="flex items-center gap-1 text-[11px] px-2 py-1 bg-gold-50 text-gold-700 rounded hover:bg-gold-100 transition-colors ml-auto"
          >
            <CheckCircle2 size={11} /> Convert
          </button>
        )}
      </div>
    </motion.div>
  )
}

// ============================================
// MAIN CRM PAGE
// ============================================
export default function CRMPage() {
  const [view, setView] = useState<'pipeline' | 'list' | 'sources'>('pipeline')
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'all'>('all')
  const [filterSource, setFilterSource] = useState<LeadSource | 'all'>('all')
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const { data: leads = FALLBACK_LEADS } = useQuery<Lead[]>({
    queryKey: ['crm-leads'],
    queryFn: () => crmService.getLeads().then(r => r.data),
    placeholderData: FALLBACK_LEADS,
  })

  const updateLead = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status?: string } }) =>
      crmService.updateLead(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['crm-leads'] }),
  })

  const handleAction = (action: string, lead: Lead) => {
    if (action === 'whatsapp') {
      toast.success(`WhatsApp sent to ${lead.name}! ✓`, { icon: '📱' })
    } else if (action === 'email') {
      toast.success(`Follow-up email sent to ${lead.name}! ✓`)
    } else if (action === 'convert') {
      updateLead.mutate({ id: lead.id, data: { status: 'converted' } })
      toast.success(`${lead.name} marked as converted! ✓`)
    }
  }

  const filteredLeads = leads.filter(l => {
    if (filterStatus !== 'all' && l.status !== filterStatus) return false
    if (filterSource !== 'all' && l.source !== filterSource) return false
    if (search && !l.name.toLowerCase().includes(search.toLowerCase()) &&
        !l.phone.includes(search) && !(l.email || '').toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const countByStatus = (status: LeadStatus) => leads.filter(l => l.status === status).length

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] tracking-[2px] text-gold-500 mb-1">MARKETING</p>
          <h1 className="text-xl font-medium text-navy-700">CRM Leads</h1>
        </div>
        <button
          onClick={() => toast.success('Lead capture form opened!')}
          className="bg-gold-400 hover:bg-gold-300 text-navy-800 text-xs tracking-[1px] font-medium px-4 py-2 rounded-sm transition-colors"
        >
          + Add Lead
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <CRMStat label="NEW LEADS TODAY"   value="22"  sub="↑ 8 from yesterday" icon={UserPlus}    accent="border-r-blue-500" />
        <CRMStat label="HOT LEADS"         value={String(countByStatus('hot'))} sub="Need follow-up" icon={Flame} accent="border-r-red-500" />
        <CRMStat label="CONVERSION RATE"   value="67%" sub="↑ 5% this week"    icon={TrendingUp}   accent="border-r-green-600" />
        <CRMStat label="AUTO MSGS SENT"    value="145" sub="Today"              icon={Send}          accent="border-r-gold-400" />
      </div>

      {/* View Tabs */}
      <div className="flex gap-0 border-b border-gray-200">
        {(['pipeline','list','sources'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-5 py-2.5 text-sm border-b-2 -mb-px transition-colors capitalize ${
              view === v
                ? 'text-navy-700 border-gold-400 font-medium'
                : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            {v === 'pipeline' ? 'Pipeline' : v === 'list' ? 'List View' : 'Lead Sources'}
          </button>
        ))}
      </div>

      {/* ===== PIPELINE VIEW ===== */}
      {view === 'pipeline' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {COLUMNS.map(col => {
            const colLeads = filteredLeads.filter(l => l.status === col.key)
            return (
              <div key={col.key}>
                <div className={`${col.bg} px-3 py-2 rounded-t-md flex items-center justify-between`}>
                  <span className={`text-xs font-medium tracking-wide ${col.textColor}`}>{col.label}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${col.color} text-white`}>
                    {colLeads.length}
                  </span>
                </div>
                <div className="border border-t-0 border-gray-200 rounded-b-md p-2 space-y-2 bg-white min-h-[200px]">
                  {colLeads.map(lead => (
                    <LeadCard key={lead.id} lead={lead} onAction={handleAction} />
                  ))}
                  {colLeads.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-6">No leads</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ===== LIST VIEW ===== */}
      {view === 'list' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-cream-50 border border-gray-200 rounded px-3 py-2 flex-1 max-w-64">
              <Search size={14} className="text-gray-400 flex-shrink-0" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Name, phone, email..."
                className="border-none bg-transparent text-sm text-navy-700 outline-none w-full"
              />
            </div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-200 rounded text-sm text-navy-700 bg-white"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="warm">Warm</option>
              <option value="hot">Hot</option>
              <option value="converted">Converted</option>
            </select>
            <select
              value={filterSource}
              onChange={e => setFilterSource(e.target.value as any)}
              className="px-3 py-2 border border-gray-200 rounded text-sm text-navy-700 bg-white"
            >
              <option value="all">All Sources</option>
              <option value="website">Website</option>
              <option value="google_ads">Google Ads</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
            <button
              onClick={() => toast.success('Leads exported to CSV ✓')}
              className="px-3 py-2 border border-gray-200 rounded text-sm text-gray-600 bg-white hover:bg-gray-50 flex items-center gap-1.5"
            >
              <Send size={13} /> Export
            </button>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-cream-50 text-[10px] tracking-[1px] text-gray-400 border-b border-gray-200">
                  <th className="text-left px-4 py-3">NAME</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">PHONE</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">SOURCE</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">INTEREST</th>
                  <th className="text-left px-4 py-3">STATUS</th>
                  <th className="text-left px-4 py-3">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map(lead => (
                  <tr key={lead.id} className="border-t border-gray-50 hover:bg-cream-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-navy-700">{lead.name}</p>
                      <p className="text-xs text-gray-500">{lead.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{lead.phone}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${SOURCE_COLORS[lead.source]}`}>
                        {SOURCE_LABELS[lead.source]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{lead.interest}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${{
                        new:       'bg-blue-50 text-blue-800',
                        warm:      'bg-amber-50 text-amber-800',
                        hot:       'bg-red-50 text-red-800',
                        converted: 'bg-green-50 text-green-800',
                        lost:      'bg-gray-100 text-gray-600',
                      }[lead.status]}`}>
                        {lead.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleAction('whatsapp', lead)}
                          className="p-1.5 rounded bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                          title="Send WhatsApp"
                        >
                          <MessageCircle size={13} />
                        </button>
                        <button
                          onClick={() => handleAction('email', lead)}
                          className="p-1.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                          title="Send Email"
                        >
                          <Mail size={13} />
                        </button>
                        {lead.status !== 'converted' && (
                          <button
                            onClick={() => handleAction('convert', lead)}
                            className="px-2 py-1 rounded bg-gold-50 text-gold-700 hover:bg-gold-100 text-[11px] transition-colors"
                          >
                            Convert
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredLeads.length === 0 && (
              <p className="text-center py-10 text-gray-400 text-sm">No leads match your filters</p>
            )}
          </div>
        </div>
      )}

      {/* ===== LEAD SOURCES ===== */}
      {view === 'sources' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { source:'Google Ads', pct:42, color:'#4285F4',  leads:94  },
              { source:'Instagram',  pct:28, color:'#E1306C',  leads:62  },
              { source:'Website',    pct:15, color:'#c9a84c',  leads:33  },
              { source:'WhatsApp',   pct:8,  color:'#25D366',  leads:18  },
              { source:'Facebook',   pct:5,  color:'#4267B2',  leads:11  },
              { source:'Direct',     pct:2,  color:'#888',     leads:5   },
            ].map(s => (
              <div key={s.source} className="bg-white border border-gray-200 rounded-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-navy-700">{s.source}</p>
                  <span className="text-xs text-gray-500">{s.leads} leads</span>
                </div>
                <p className="text-2xl font-medium text-navy-700 mb-2">{s.pct}%</p>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-gray-200 rounded-md p-5">
            <h3 className="text-sm font-medium text-navy-700 mb-4">Conversion by source</h3>
            <div className="space-y-3">
              {[
                { source:'Direct', rate:89, color:'#888' },
                { source:'Website', rate:72, color:'#c9a84c' },
                { source:'WhatsApp', rate:68, color:'#25D366' },
                { source:'Instagram', rate:52, color:'#E1306C' },
                { source:'Google Ads', rate:48, color:'#4285F4' },
                { source:'Facebook', rate:35, color:'#4267B2' },
              ].map(s => (
                <div key={s.source} className="flex items-center gap-3 text-sm">
                  <span className="w-28 text-gray-500 text-xs">{s.source}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.rate}%`, background: s.color }} />
                  </div>
                  <span className="text-xs font-medium text-navy-700 w-10 text-right">{s.rate}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
