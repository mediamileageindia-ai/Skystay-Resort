import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'

const STORAGE_KEY = 'skystay_notif_asked'

export default function PushNotificationPrompt() {
  const [visible, setVisible] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return
    if (sessionStorage.getItem(STORAGE_KEY)) return
    if (Notification.permission !== 'default') return

    // Show prompt after 8 seconds
    const t = setTimeout(() => setVisible(true), 8000)
    return () => clearTimeout(t)
  }, [])

  const registerSW = async () => {
    try {
      await navigator.serviceWorker.register('/sw.js')
    } catch { /* silent */ }
  }

  const handleAllow = async () => {
    setVisible(false)
    sessionStorage.setItem(STORAGE_KEY, '1')
    await registerSW()
    const result = await Notification.requestPermission()
    setPermission(result)
    if (result === 'granted') {
      // Welcome notification
      setTimeout(() => {
        new Notification('Welcome to Sky Stay Resorts! 🏨', {
          body: 'Get exclusive deals & early check-in offers. We\'ll keep you updated!',
          icon: '/logo2.png',
          badge: '/logo2.png',
        })
      }, 1000)
    }
  }

  const handleDismiss = () => {
    setVisible(false)
    sessionStorage.setItem(STORAGE_KEY, '1')
  }

  if (!visible || permission !== 'default') return null

  return (
    <div className="fixed bottom-24 right-6 z-50 w-80 bg-navy-800 rounded-lg shadow-2xl border border-gold-400/30 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-navy-900">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gold-400/20 flex items-center justify-center">
            <Bell size={14} className="text-gold-400" />
          </div>
          <span className="text-white text-sm font-medium">Stay Updated</span>
        </div>
        <button onClick={handleDismiss} className="text-gray-400 hover:text-white">
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        <p className="text-gray-300 text-xs leading-relaxed mb-3">
          Get notified about <span className="text-gold-400 font-medium">exclusive offers</span>, seasonal deals, and availability updates from Sky Stay Resorts.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleAllow}
            className="flex-1 bg-gold-400 hover:bg-gold-300 text-navy-800 text-xs font-semibold py-2 rounded-md transition-colors"
          >
            Allow Notifications
          </button>
          <button
            onClick={handleDismiss}
            className="px-3 text-gray-400 hover:text-white text-xs border border-gray-600 rounded-md transition-colors"
          >
            No
          </button>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="h-0.5 bg-gradient-to-r from-gold-400 via-gold-300 to-gold-400" />
    </div>
  )
}
