import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from '@/store'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PushNotificationPrompt from '@/components/PushNotificationPrompt'

// Eager load only HomePage (above the fold, most visited)
import HomePage from '@/pages/HomePage'

// Lazy load all other pages — JS only downloads when user navigates there
const RoomsPage            = lazy(() => import('@/pages/RoomsPage'))
const RoomDetailPage       = lazy(() => import('@/pages/RoomDetailPage'))
const AmenitiesPage        = lazy(() => import('@/pages/AmenitiesPage'))
const PlacesToVisitPage    = lazy(() => import('@/pages/PlacesToVisitPage'))
const ResortActivitiesPage = lazy(() => import('@/pages/ResortActivitiesPage'))
const TermsPage            = lazy(() => import('@/pages/TermsPage'))

const GalleryPage     = lazy(() => import('@/pages/PublicPages').then(m => ({ default: m.GalleryPage })))
const OffersPage      = lazy(() => import('@/pages/PublicPages').then(m => ({ default: m.OffersPage })))
const ContactPage     = lazy(() => import('@/pages/PublicPages').then(m => ({ default: m.ContactPage })))
const AboutPage       = lazy(() => import('@/pages/PublicPages').then(m => ({ default: m.AboutPage })))
const BlogPage        = lazy(() => import('@/pages/PublicPages').then(m => ({ default: m.BlogPage })))
const FacilitiesPage  = lazy(() => import('@/pages/PublicPages').then(m => ({ default: m.FacilitiesPage })))

const LoginPage        = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage     = lazy(() => import('@/pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })))
const OTPPage          = lazy(() => import('@/pages/auth/RegisterPage').then(m => ({ default: m.OTPPage })))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/RegisterPage').then(m => ({ default: m.ForgotPasswordPage })))

const PortalLayout      = lazy(() => import('@/components/portal/PortalPages').then(m => ({ default: m.PortalLayout })))
const MyBookingsPage    = lazy(() => import('@/components/portal/PortalPages').then(m => ({ default: m.MyBookingsPage })))
const MyProfilePage     = lazy(() => import('@/components/portal/PortalPages').then(m => ({ default: m.MyProfilePage })))
const InvoicesPage      = lazy(() => import('@/components/portal/PortalPages').then(m => ({ default: m.InvoicesPage })))
const NotificationsPage = lazy(() => import('@/components/portal/PortalPages').then(m => ({ default: m.NotificationsPage })))
const WishlistPage      = lazy(() => import('@/components/portal/PortalPages').then(m => ({ default: m.WishlistPage })))

const AdminLayout      = lazy(() => import('@/components/admin/AdminLayout'))
const DashboardPage    = lazy(() => import('@/pages/admin/DashboardPage'))
const BookingsPage     = lazy(() => import('@/pages/admin/BookingsPage'))
const CRMPage          = lazy(() => import('@/pages/admin/CRMPage'))
const CampaignsPage    = lazy(() => import('@/pages/admin/CampaignsPage').then(m => ({ default: m.CampaignsPage })))
const AutomationPage   = lazy(() => import('@/pages/admin/CampaignsPage').then(m => ({ default: m.AutomationPage })))
const AdminRoomsPage     = lazy(() => import('@/pages/admin/AdminPages').then(m => ({ default: m.AdminRoomsPage })))
const AdminCustomersPage = lazy(() => import('@/pages/admin/AdminPages').then(m => ({ default: m.AdminCustomersPage })))
const AdminReportsPage   = lazy(() => import('@/pages/admin/AdminPages').then(m => ({ default: m.AdminReportsPage })))

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 300000, refetchOnWindowFocus: false } } })

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/" replace />
  return <>{children}</>
}
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <Navigate to="/portal/bookings" replace /> : <>{children}</>
}
function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919003010567?text=Hello%20Sky%20Stay%20Resorts%2C%20I%20would%20like%20to%20enquire%20about%20room%20availability."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
      style={{ background: '#25D366' }}
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 32 32" width="30" height="30" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.003 2C8.28 2 2 8.28 2 16.003c0 2.47.643 4.79 1.77 6.802L2 30l7.397-1.74A13.94 13.94 0 0 0 16.003 30C23.72 30 30 23.72 30 16.003 30 8.28 23.72 2 16.003 2zm0 25.452a11.4 11.4 0 0 1-5.817-1.596l-.418-.248-4.39 1.033 1.058-4.277-.272-.44A11.388 11.388 0 0 1 4.61 16c0-6.285 5.112-11.394 11.393-11.394 6.282 0 11.394 5.11 11.394 11.394 0 6.283-5.112 11.452-11.394 11.452zm6.254-8.546c-.344-.172-2.035-1.004-2.35-1.118-.315-.115-.544-.172-.773.172-.229.344-.887 1.118-1.087 1.347-.2.23-.4.258-.744.086-.344-.172-1.452-.535-2.766-1.706-1.022-.913-1.712-2.04-1.912-2.384-.2-.344-.021-.53.15-.701.155-.154.344-.4.516-.6.172-.2.229-.344.344-.573.115-.23.057-.43-.029-.602-.086-.172-.773-1.863-1.059-2.55-.279-.67-.562-.578-.773-.588l-.659-.011c-.229 0-.6.086-.915.43-.315.344-1.202 1.175-1.202 2.866 0 1.691 1.23 3.324 1.402 3.553.172.229 2.42 3.695 5.863 5.183.82.354 1.459.565 1.958.723.823.261 1.572.224 2.163.136.66-.099 2.035-.831 2.321-1.635.287-.803.287-1.49.201-1.634-.085-.144-.315-.23-.659-.4z"/>
      </svg>
    </a>
  )
}

function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#c9a84c', borderTopColor: 'transparent' }} />
        <p className="text-xs tracking-widest" style={{ color: '#1b2b6b' }}>LOADING</p>
      </div>
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])
  return null
}

const WithNav = ({ children }: { children: React.ReactNode }) => <><Navbar />{children}<Footer /><WhatsAppButton /></>

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <PushNotificationPrompt />
        <Toaster position="top-right" toastOptions={{ duration:3500, style:{ background:'#1b2b6b', color:'#fff', borderLeft:'4px solid #c9a84c', borderRadius:'3px', fontSize:'13px' } }} />
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"            element={<WithNav><HomePage /></WithNav>} />
          <Route path="/rooms"       element={<WithNav><RoomsPage /></WithNav>} />
          <Route path="/rooms/:slug" element={<WithNav><RoomDetailPage /></WithNav>} />
          <Route path="/amenities"   element={<WithNav><AmenitiesPage /></WithNav>} />
          <Route path="/gallery"     element={<WithNav><GalleryPage /></WithNav>} />
          <Route path="/facilities"  element={<WithNav><FacilitiesPage /></WithNav>} />
          <Route path="/offers"      element={<WithNav><OffersPage /></WithNav>} />
          <Route path="/contact"     element={<WithNav><ContactPage /></WithNav>} />
          <Route path="/about"       element={<WithNav><AboutPage /></WithNav>} />
          <Route path="/places-to-visit" element={<WithNav><PlacesToVisitPage /></WithNav>} />
          <Route path="/resort-activities" element={<WithNav><ResortActivitiesPage /></WithNav>} />
          <Route path="/terms-and-conditions" element={<WithNav><TermsPage /></WithNav>} />
          <Route path="/blog"        element={<WithNav><BlogPage /></WithNav>} />
          <Route path="/login"           element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
          <Route path="/register"        element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
          <Route path="/verify-otp"      element={<OTPPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/portal" element={<PrivateRoute><PortalLayout /></PrivateRoute>}>
            <Route index element={<Navigate to="bookings" replace />} />
            <Route path="bookings"      element={<MyBookingsPage />} />
            <Route path="profile"       element={<MyProfilePage />} />
            <Route path="invoices"      element={<InvoicesPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="wishlist"      element={<WishlistPage />} />
          </Route>
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"  element={<DashboardPage />} />
            <Route path="bookings"   element={<BookingsPage />} />
            <Route path="rooms"      element={<AdminRoomsPage />} />
            <Route path="customers"  element={<AdminCustomersPage />} />
            <Route path="crm"        element={<CRMPage />} />
            <Route path="campaigns"  element={<CampaignsPage />} />
            <Route path="automation" element={<AutomationPage />} />
            <Route path="reports"    element={<AdminReportsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
