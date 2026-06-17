import toast from 'react-hot-toast'
import { useState } from 'react'
import { Send, Mail, MessageCircle, Phone, Plus, ToggleLeft, ToggleRight, BarChart2 } from 'lucide-react'

// ============================================
// CAMPAIGNS PAGE
// ============================================
const CAMPAIGNS = [
  {
    id:'1', name:'Weekend Getaway Blast', channel:'whatsapp', icon: MessageCircle,
    iconBg:'bg-green-50', iconColor:'text-green-700',
    schedule:'Every Friday at 9:00 AM', recipients:1248,
    openRate:68, status:'running',
    lastRun:'16 Dec 2025',
  },
  {
    id:'2', name:'Pongal Festival Offer', channel:'email+whatsapp', icon: Mail,
    iconBg:'bg-blue-50', iconColor:'text-blue-700',
    schedule:'Jan 14 at 8:00 AM', recipients:1248,
    openRate:null, status:'scheduled',
    lastRun:'—',
  },
  {
    id:'3', name:'Abandoned Visit — 1 Hour', channel:'whatsapp+email', icon: MessageCircle,
    iconBg:'bg-amber-50', iconColor:'text-amber-700',
    schedule:'Auto — 1 hour after visit', recipients:null,
    openRate:34, status:'running',
    lastRun:'Continuous',
  },
  {
    id:'4', name:'Check-in Reminder SMS', channel:'sms', icon: Phone,
    iconBg:'bg-red-50', iconColor:'text-red-700',
    schedule:'Night before check-in', recipients:null,
    openRate:91, status:'running',
    lastRun:'Continuous',
  },
  {
    id:'5', name:'Post-checkout Review', channel:'email', icon: Mail,
    iconBg:'bg-purple-50', iconColor:'text-purple-700',
    schedule:'2 hours after check-out', recipients:null,
    openRate:45, status:'running',
    lastRun:'Continuous',
  },
]

export function CampaignsPage() {
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] tracking-[2px] text-gold-500 mb-1">MARKETING</p>
          <h1 className="text-xl font-medium text-navy-700">Campaigns</h1>
        </div>
        <button
          onClick={() => toast.success('Campaign builder opened!')}
          className="flex items-center gap-1.5 bg-gold-400 hover:bg-gold-300 text-navy-800 text-xs tracking-[1px] font-medium px-4 py-2 rounded-sm transition-colors"
        >
          <Plus size={14} /> New Campaign
        </button>
      </div>

      {/* Channel Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label:'WhatsApp open rate', value:'68%', color:'text-green-700', bg:'bg-green-50 border-green-200', icon: MessageCircle },
          { label:'Email open rate',    value:'42%', color:'text-blue-700',  bg:'bg-blue-50 border-blue-200',  icon: Mail },
          { label:'SMS delivery rate',  value:'91%', color:'text-red-700',   bg:'bg-red-50 border-red-200',    icon: Phone },
        ].map(c => {
          const Icon = c.icon
          return (
            <div key={c.label} className={`border rounded-md p-4 ${c.bg}`}>
              <Icon size={16} className={`${c.color} mb-2`} />
              <p className={`text-xl font-medium ${c.color}`}>{c.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{c.label}</p>
            </div>
          )
        })}
      </div>

      {/* Campaign List */}
      <div className="space-y-3">
        {CAMPAIGNS.map(c => {
          const Icon = c.icon
          return (
            <div key={c.id} className="bg-white border border-gray-200 rounded-md p-4 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-lg ${c.iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={20} className={c.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-navy-700">{c.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {c.channel.toUpperCase()} · {c.schedule}
                  {c.recipients ? ` · ${c.recipients.toLocaleString('en-IN')} recipients` : ''}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                {c.openRate !== null ? (
                  <>
                    <p className="text-base font-medium text-navy-700">{c.openRate}%</p>
                    <p className="text-[11px] text-gray-400">open rate</p>
                    <div className="w-24 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-gold-400 rounded-full" style={{ width: `${c.openRate}%` }} />
                    </div>
                  </>
                ) : (
                  <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    Scheduled
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {c.status === 'running' ? (
                  <span className="text-[10px] px-2 py-0.5 bg-green-50 text-green-800 rounded-full font-medium">RUNNING</span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-800 rounded-full font-medium">SCHEDULED</span>
                )}
                <button
                  onClick={() => toast.success(`${c.name} sent now! ✓`)}
                  className="p-1.5 rounded bg-gold-50 text-gold-700 hover:bg-gold-100 transition-colors"
                  title="Send now"
                >
                  <Send size={13} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================
// AUTOMATION PAGE
// ============================================
const AUTOMATIONS = [
  {
    id:'1', name:'Abandoned visit',
    desc:'Visitor enters site but leaves without booking. WhatsApp + Email after 1 hour.',
    trigger:'1 hour after visit', firedToday:32, active:true, color:'bg-red-500',
  },
  {
    id:'2', name:'Room viewed, not booked',
    desc:'Guest viewed a specific room but didn\'t complete booking. Room-specific WhatsApp after 24 hours.',
    trigger:'24 hours after room view', firedToday:18, active:true, color:'bg-amber-500',
  },
  {
    id:'3', name:'Weekend reminder',
    desc:'Send weekend getaway offer to all guests who haven\'t booked in 30 days.',
    trigger:'Every Friday at 9:00 AM', firedToday:1248, active:true, color:'bg-gold-400',
  },
  {
    id:'4', name:'Check-in reminder',
    desc:'SMS + WhatsApp with room details, directions, and early check-in options.',
    trigger:'Night before check-in', firedToday:5, active:true, color:'bg-green-600',
  },
  {
    id:'5', name:'Post-checkout review request',
    desc:'Email 2 hours after checkout requesting Google review. Earn loyalty points.',
    trigger:'2 hours after checkout', firedToday:3, active:true, color:'bg-blue-600',
  },
  {
    id:'6', name:'Anniversary reminder',
    desc:'Special offer email on guest\'s anniversary date. Drives repeat romance bookings.',
    trigger:'On anniversary date', firedToday:0, active:false, color:'bg-pink-500',
  },
  {
    id:'7', name:'Pongal campaign',
    desc:'Festival special with 15% discount via WhatsApp + Email to all guests.',
    trigger:'Jan 14 at 8:00 AM', firedToday:0, active:false, color:'bg-gray-300',
  },
]

export function AutomationPage() {
  const [automations, setAutomations] = useState(AUTOMATIONS)

  const toggle = (id: string) =>
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a))

  const activeCount = automations.filter(a => a.active).length
  const totalFired  = automations.reduce((s, a) => s + a.firedToday, 0)

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] tracking-[2px] text-gold-500 mb-1">MARKETING</p>
          <h1 className="text-xl font-medium text-navy-700">Marketing Automation</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {activeCount} active automations · {totalFired} messages sent today
          </p>
        </div>
        <button
          onClick={() => toast.success('Automation builder opened!')}
          className="flex items-center gap-1.5 bg-gold-400 hover:bg-gold-300 text-navy-800 text-xs tracking-[1px] font-medium px-4 py-2 rounded-sm transition-colors"
        >
          <Plus size={14} /> New Automation
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <p className="text-2xl font-medium text-navy-700">{activeCount}</p>
          <p className="text-xs text-gray-400 mt-0.5">Active automations</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <p className="text-2xl font-medium text-navy-700">{totalFired}</p>
          <p className="text-xs text-gray-400 mt-0.5">Messages sent today</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <p className="text-2xl font-medium text-green-700">34%</p>
          <p className="text-xs text-gray-400 mt-0.5">Avg conversion rate</p>
        </div>
      </div>

      {/* Automations */}
      <div className="space-y-3">
        {automations.map(auto => (
          <div key={auto.id} className="bg-white border border-gray-200 rounded-md p-4 flex items-center gap-4">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${auto.active ? auto.color : 'bg-gray-300'}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-navy-700">{auto.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{auto.desc}</p>
              <p className="text-[11px] text-gray-400 mt-1">Trigger: {auto.trigger}</p>
            </div>
            <div className="text-right flex-shrink-0 mr-2">
              <p className="text-sm font-medium text-navy-700">{auto.firedToday}</p>
              <p className="text-[11px] text-gray-400">fired today</p>
            </div>
            <button
              onClick={() => toggle(auto.id)}
              className={`flex-shrink-0 ${auto.active ? 'text-gold-500' : 'text-gray-300'} transition-colors`}
              title={auto.active ? 'Disable' : 'Enable'}
            >
              {auto.active ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
            </button>
          </div>
        ))}
      </div>

      {/* Flow diagram */}
      <div className="bg-navy-900 rounded-md p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={16} className="text-gold-400" />
          <h2 className="text-sm font-medium">Automation funnel — this month</h2>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { label:'Triggered', value:'4,280', pct:100 },
            { label:'Delivered',  value:'4,110', pct:96 },
            { label:'Opened',     value:'2,795', pct:65 },
            { label:'Clicked',    value:'1,540', pct:36 },
            { label:'Converted',  value:'890',   pct:21 },
          ].map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              <div className="text-center">
                <div className="text-base font-medium text-gold-400">{s.value}</div>
                <div className="text-[10px] text-navy-400">{s.label}</div>
                <div className="text-[10px] text-navy-500">{s.pct}%</div>
              </div>
              {i < 4 && <div className="text-navy-600 text-lg">→</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CampaignsPage
