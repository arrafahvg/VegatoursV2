import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { LOGO_URL } from '@/lib/constants';

import Home from '@/pages/Home';
import TeamPage from '@/pages/TeamPage';
import PackagesPage from '@/pages/PackagesPage';
import BikeRentPage from '@/pages/BikeRentPage';
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminPackages from '@/pages/admin/AdminPackages';
import AdminTestimonials from '@/pages/admin/AdminTestimonials';
import AdminTeam from '@/pages/admin/AdminTeam';
import AdminGallery from '@/pages/admin/AdminGallery';
import AdminFAQ from '@/pages/admin/AdminFAQ';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminInquiries from '@/pages/admin/AdminInquiries';
import AdminPartners from '@/pages/admin/AdminPartners';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminFleet from '@/pages/admin/AdminFleet';
import AdminBikes from '@/pages/admin/AdminBikes';
import AdminDestinations from '@/pages/admin/AdminDestinations';
import AdminCRM from '@/pages/admin/AdminCRM';
import AdminPaymentSettings from '@/pages/admin/AdminPaymentSettings';

const AuthenticatedApp = () => {
  const { isLoadingPublicSettings, authError } = useAuth();

  if (isLoadingPublicSettings) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <img src={LOGO_URL} alt="Vegatours" className="h-24 w-auto object-contain mx-auto mb-5" />
          <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground font-medium tracking-wide">Vegatours</p>
        </div>
      </div>
    );
  }

  if (authError && authError.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/packages" element={<PackagesPage />} />
      <Route path="/bike-rent" element={<BikeRentPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="packages" element={<AdminPackages />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="team" element={<AdminTeam />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="faq" element={<AdminFAQ />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="inquiries" element={<AdminInquiries />} />
        <Route path="partners" element={<AdminPartners />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="fleet" element={<AdminFleet />} />
        <Route path="bikes" element={<AdminBikes />} />
        <Route path="destinations" element={<AdminDestinations />} />
        <Route path="crm" element={<AdminCRM />} />
        <Route path="payment-settings" element={<AdminPaymentSettings />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <AuthProvider>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
        {/* Admin pages (EntityManager, CRM, Settings...) use sonner toasts — mount its renderer too */}
        <SonnerToaster position="top-right" richColors closeButton />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App