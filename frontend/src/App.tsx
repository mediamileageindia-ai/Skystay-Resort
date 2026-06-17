import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from '@/store'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HomePage from '@/pages/HomePage'
import RoomsPage from '@/pages/RoomsPage'
import RoomDetailPage from '@/pages/RoomDetailPage'
import { AmenitiesPage, GalleryPage, OffersPage, ContactPage, AboutPage, BlogPage } from '@/pages/PublicPages'
import LoginPage from '@/pages/auth/LoginPage'
import { RegisterPage, OTPPage, ForgotPasswordPage } from '@/pages/auth/RegisterPage'
import { PortalLayout, MyBookingsPage, MyProfilePage, InvoicesPage, NotificationsPage, WishlistPage } from '@/components/portal/PortalPages'
import AdminLayout from '@/components/admin/AdminLayout'
import DashboardPage from '@/pages/admin/DashboardPage'
import BookingsPage from '@/pages/admin/BookingsPage'
import CRMPage from '@/pages/admin/CRMPage'
import { CampaignsPage, AutomationPage } from '@/pages/admin/CampaignsPage'
import { AdminRoomsPage, AdminCustomersPage, AdminReportsPage } from '@/pages/admin/AdminPages'

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
const WithNav = ({ children }: { children: React.ReactNode }) => <><Navbar />{children}<Footer /></>

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration:3500, style:{ background:'#1b2b6b', color:'#fff', borderLeft:'4px solid #c9a84c', borderRadius:'3px', fontSize:'13px' } }} />
        <Routes>
          <Route path="/"            element={<WithNav><HomePage /></WithNav>} />
          <Route path="/rooms"       element={<WithNav><RoomsPage /></WithNav>} />
          <Route path="/rooms/:slug" element={<WithNav><RoomDetailPage /></WithNav>} />
          <Route path="/amenities"   element={<WithNav><AmenitiesPage /></WithNav>} />
          <Route path="/gallery"     element={<WithNav><GalleryPage /></WithNav>} />
          <Route path="/offers"      element={<WithNav><OffersPage /></WithNav>} />
          <Route path="/contact"     element={<WithNav><ContactPage /></WithNav>} />
          <Route path="/about"       element={<WithNav><AboutPage /></WithNav>} />
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
      </BrowserRouter>
    </QueryClientProvider>
  )
}
