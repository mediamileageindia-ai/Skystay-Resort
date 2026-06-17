import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard, CalendarCheck, DoorOpen, Users, Target,
  Send, Bot, BarChart2, Bell, Search, LogOut, ChevronDown,
  Menu, X
} from 'lucide-react'
import { useAuthStore } from '@/store'

const navItems = [
  { section: 'MAIN' },
  { label: 'Dashboard',    icon: LayoutDashboard, to: '/admin/dashboard' },
  { label: 'Bookings',     icon: CalendarCheck,   to: '/admin/bookings' },
  { label: 'Rooms',        icon: DoorOpen,        to: '/admin/rooms' },
  { label: 'Customers',    icon: Users,           to: '/admin/customers' },
  { section: 'MARKETING' },
  { label: 'CRM Leads',   icon: Target,           to: '/admin/crm' },
  { label: 'Campaigns',    icon: Send,            to: '/admin/campaigns' },
  { label: 'Automation',   icon: Bot,             to: '/admin/automation' },
  { section: 'ANALYTICS' },
  { label: 'Reports',      icon: BarChart2,       to: '/admin/reports' },
]

export default function AdminLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'A'

  const Sidebar = () => (
    <aside className="w-[220px] flex-shrink-0 bg-navy-900 flex flex-col h-full">
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 py-4 border-b border-white/5 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <div className="w-8 h-7 flex-shrink-0"
          style={{ background: '#c9a84c', clipPath: 'polygon(50% 0%,0% 100%,100% 100%)' }}
        />
        <div>
          <div className="text-sm font-medium text-white">Sky Stay</div>
          <div className="text-[9px] tracking-[3px] text-gold-400">ADMIN</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navItems.map((item, i) => {
          if ('section' in item) {
            return (
              <p key={i} className="text-[9px] tracking-[3px] text-navy-500 px-5 pt-5 pb-1.5">
                {item.section}
              </p>
            )
          }
          const Icon = item.icon!
          return (
            <NavLink
              key={item.to}
              to={item.to!}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-5 py-2.5 text-sm transition-all border-l-[3px] ${
                  isActive
                    ? 'bg-white/5 text-gold-400 border-gold-400'
                    : 'text-navy-400 border-transparent hover:bg-white/[0.03] hover:text-navy-200'
                }`
              }
            >
              <Icon size={16} aria-hidden="true" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-full bg-gold-400 flex items-center justify-center text-xs font-medium text-navy-900 flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-[11px] text-navy-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-xs text-navy-500 hover:text-red-400 transition-colors mt-1"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-[#f4f0e8] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="flex-shrink-0">
            <Sidebar />
          </div>
          <button
            className="flex-1 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 flex-shrink-0">
          <button
            className="lg:hidden text-gray-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="flex items-center gap-2 bg-cream-50 border border-gray-200 rounded px-3 py-2 flex-1 max-w-72">
            <Search size={14} className="text-gray-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search bookings, guests..."
              className="border-none bg-transparent text-sm text-navy-700 outline-none w-full placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Notifications */}
            <button className="relative w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            {/* Admin avatar */}
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gold-400 flex items-center justify-center text-xs font-medium text-navy-900">
                {initials}
              </div>
              <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
