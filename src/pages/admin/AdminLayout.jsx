import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AdminAuthGuard>
    <div className="min-h-screen bg-background">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-card border-b border-border/50">
        <span className="font-serif text-lg font-semibold text-foreground tracking-wide">
          VEGA<span className="text-primary">TOURS</span>
        </span>
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
    </AdminAuthGuard>
  );
}