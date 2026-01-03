import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ShrineDataProvider } from './context/ShrineDataContext';
import { ShrineAuthProvider, useShrineAuth } from './context/ShrineAuthContext';
import { Toaster } from './components/ui/sonner';

// Public Components
import { PublicNavigation } from './components/PublicNavigation';
import { PublicFooter } from './components/PublicFooter';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { MassBookingPage } from './pages/MassBookingPage';
import { DonationsPage } from './pages/DonationsPage';
import { GalleryPage } from './pages/GalleryPage';
import { LiveStreamPage } from './pages/LiveStreamPage';
import { TestimoniesPage } from './pages/TestimoniesPage';
import { PrayerRequestPage } from './pages/PrayerRequestPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { ContactPage } from './pages/ContactPage';

// Admin Components & Pages
import { AdminNavigation } from './components/AdminNavigation';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminDonationsPage } from './pages/admin/AdminDonationsPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminTestimoniesPage } from './pages/admin/AdminTestimoniesPage';
import { AdminLivestreamPage } from './pages/admin/AdminLivestreamPage';
import { AdminAllInOnePage } from './pages/admin/AdminAllInOnePage';
import { AdminPrayerRequestsPage } from './pages/admin/AdminPrayerRequestsPage';
import { AdminAnnouncementsPage } from './pages/admin/AdminAnnouncementsPage';
import { AdminHomepageAnnouncementsPage } from './pages/admin/AdminHomepageAnnouncementsPage';
import FathersPage from './pages/admin/FathersPage';

// Payment Page
import { PaymentPage } from "./pages/PaymentPage";

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useShrineAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2 text-green-700">
          <div className="w-6 h-6 border-2 border-green-700 border-t-transparent rounded-full animate-spin"></div>
          <span>Verifying authentication...</span>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />;
};


const AdminRouteGuard: React.FC = () => {
  const { isAuthenticated, loading } = useShrineAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2 text-green-700">
          <div className="w-6 h-6 border-2 border-green-700 border-t-transparent rounded-full animate-spin"></div>
          <span>Checking access...</span>
        </div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  } else {
    return <Navigate to="/admin/login" replace />;
  }
};

// Admin Layout Component
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminNavigation />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

// Public Layout Component
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavigation />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
};

const AppContent = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <PublicLayout>
          <HomePage />
        </PublicLayout>
      } />
      
      <Route path="/about" element={
        <PublicLayout>
          <AboutPage />
        </PublicLayout>
      } />
      
      <Route path="/mass-booking" element={
        <PublicLayout>
          <MassBookingPage />
        </PublicLayout>
      } />
      
      <Route path="/donations" element={
        <PublicLayout>
          <DonationsPage />
        </PublicLayout>
      } />
      
      <Route path="/gallery" element={
        <PublicLayout>
          <GalleryPage />
        </PublicLayout>
      } />
      
      <Route path="/livestream" element={
        <PublicLayout>
          <LiveStreamPage />
        </PublicLayout>
      } />
      
      <Route path="/testimonies" element={
        <PublicLayout>
          <TestimoniesPage />
        </PublicLayout>
      } />
      
      <Route path="/prayer-request" element={
        <PublicLayout>
          <PrayerRequestPage />
        </PublicLayout>
      } />
      
      <Route path="/announcements" element={
        <PublicLayout>
          <AnnouncementsPage />
        </PublicLayout>
      } />
      
      <Route path="/contact" element={
        <PublicLayout>
          <ContactPage />
        </PublicLayout>
      } />
      
      <Route path="/fathers" element={
        <PublicLayout>
          <FathersPage />
        </PublicLayout>
      } />
      
      <Route path="/payment" element={
        <PublicLayout>
          <PaymentPage />
        </PublicLayout>
      } />

      {/* Admin Login Route - accessible to everyone */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin Root Route - redirects based on authentication */}
      <Route path="/admin" element={<AdminRouteGuard />} />

      {/* Protected Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/donations" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminDonationsPage />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/bookings" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminBookingsPage />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/gallery" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminGalleryPage />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/livestream" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminLivestreamPage />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/stream" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminLivestreamPage />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/testimonies" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminTestimoniesPage />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/prayer-requests" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminPrayerRequestsPage />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/requests" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminPrayerRequestsPage />
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/admin/fathers" element={
        <ProtectedRoute>
          <AdminLayout>
            <FathersPage />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/announcements" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminAnnouncementsPage />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/homepage-announcements" element={
        <ProtectedRoute>
          <AdminLayout>
            <AdminHomepageAnnouncementsPage />
          </AdminLayout>
        </ProtectedRoute>
      } />
      
      {/* Catch all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ShrineAuthProvider>
      <ShrineDataProvider>
        <AppContent />
        <Toaster position="top-right" />
      </ShrineDataProvider>
    </ShrineAuthProvider>
  );
};

export default App;