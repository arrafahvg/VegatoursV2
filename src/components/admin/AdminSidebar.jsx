import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Package, MessageSquare, Users, Image, HelpCircle, LayoutDashboard,
  ArrowLeft, Settings, Inbox, Building2, Car, Briefcase, CreditCard,
  MapPin, ChevronDown, Globe, LogOut, Shield
} from 'lucide-react';
import { LOGO_URL } from '@/lib/constants';
import { useAuth } from '@/lib/AuthContext';

const menuGroups = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    ],
  },
  {
    label: 'CRM & Customers',
    items: [
      { label: 'Bookings (CRM)', icon: Briefcase, path: '/admin/crm' },
      { label: 'Inquiries', icon: Inbox, path: '/admin/inquiries' },
      { label: 'Users', icon: Users, path: '/admin/users' },
    ],
  },
  {
    label: 'Website Content',
    items: [
      { label: 'Tour Packages', icon: Package, path: '/admin/packages' },
      { label: 'Fleet', icon: Car, path: '/admin/fleet' },
      { label: 'Featured Destinations', icon: MapPin, path: '/admin/destinations' },
      { label: 'Partners', icon: Building2, path: '/admin/partners' },
      { label: 'Testimonials', icon: MessageSquare, path: '/admin/testimonials' },
      { label: 'Team Members', icon: Users, path: '/admin/team' },
      { label: 'Gallery', icon: Image, path: '/admin/gallery' },
      { label: 'FAQ', icon: HelpCircle, path: '/admin/faq' },
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: 'Site Settings', icon: Settings, path: '/admin/settings' },
      { label: 'Payment Settings', icon: CreditCard, path: '/admin/payment-settings' },
    ],
  },
];

const ROLE_LABELS = { admin: 'Admin', super_admin: 'Super Admin', user: 'User' };

export default function AdminSidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [openGroups, setOpenGroups] = useState(() =>
    menuGroups.reduce((acc, g) => ({ ...acc, [g.label]: true }), {})
  );

  const toggleGroup = (label) => setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }));

  const renderLink = (item) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={() => setMobileOpen?.(false)}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
        }`}
      >
        <item.icon className="w-4 h-4 flex-shrink-0" />
        {item.label}
      </Link>
    );
  };

  const content = (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-border/50">
        <img
          src={LOGO_URL}
          alt="Vegatours"
          className="h-14 w-auto object-contain rounded-lg"
        />
        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
          <Globe className="w-3 h-3" /> Admin Dashboard
        </p>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        {menuGroups.map(group => (
          <div key={group.label} className="mb-1">
            <button
              onClick={() => toggleGroup(group.label)}
              className="flex items-center justify-between w-full px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70 hover:text-muted-foreground transition-colors"
            >
              {group.label}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openGroups[group.label] ? '' : '-rotate-90'}`} />
            </button>
            {openGroups[group.label] && (
              <div className="space-y-0.5 mb-2">
                {group.items.map(renderLink)}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User profile section */}
      {user && (
        <div className="px-4 py-3 border-t border-border/50">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-secondary/30">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-primary">{user.name?.[0] || user.email?.[0]?.toUpperCase() || '?'}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">{user.name || 'User'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Shield className="w-3 h-3 text-primary" />
                <span className="text-[11px] font-medium text-primary">{ROLE_LABELS[user.role] || user.role || 'User'}</span>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      <div className="p-4 pt-2 border-t border-border/50">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Website
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-64 bg-card border-r border-border/50 flex-col fixed inset-y-0 left-0 z-30">
        {content}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-card shadow-xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
}