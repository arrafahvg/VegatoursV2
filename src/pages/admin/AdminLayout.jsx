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
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-card/95 backdrop-blur border-b border-border/50">
        <span className="font-serif text-lg font-semibold text-foreground tracking-wide">
          VEGA<span className="text-primary">TOURS</span>
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(true)}
          className="h-11 w-11"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 pb-16">
        <Outlet />
      </main>
    </div>
    </AdminAuthGuard>
  );
}