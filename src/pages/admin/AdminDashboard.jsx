import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

import { Link } from 'react-router-dom';
import { Package, MessageSquare, Users, Image, HelpCircle, ExternalLink } from 'lucide-react';

export default function AdminDashboard() {
  const { data: packages } = useQuery({ queryKey: ['tourPackages'], queryFn: async () => { const { data, error } = await supabase.from('tour_packages').select('*').order('sort_order', { ascending: true }); if (error) throw error; return data || []; }, initialData: [] });
  const { data: testimonials } = useQuery({ queryKey: ['testimonials'], queryFn: async () => { const { data, error } = await supabase.from('testimonials').select('*').order('sort_order', { ascending: true }); if (error) throw error; return data || []; }, initialData: [] });
  const { data: team } = useQuery({ queryKey: ['teamMembers'], queryFn: async () => { const { data, error } = await supabase.from('team_members').select('*').order('sort_order', { ascending: true }); if (error) throw error; return data || []; }, initialData: [] });
  const { data: gallery } = useQuery({ queryKey: ['galleryImages'], queryFn: async () => { const { data, error } = await supabase.from('gallery_images').select('*').order('sort_order', { ascending: true }); if (error) throw error; return data || []; }, initialData: [] });
  const { data: faqs } = useQuery({ queryKey: ['faqs'], queryFn: async () => { const { data, error } = await supabase.from('faqs').select('*').order('sort_order', { ascending: true }); if (error) throw error; return data || []; }, initialData: [] });

  const statCards = [
    { label: 'Tour Packages', icon: Package, count: packages.length, path: '/admin/packages' },
    { label: 'Testimonials', icon: MessageSquare, count: testimonials.length, path: '/admin/testimonials' },
    { label: 'Team Members', icon: Users, count: team.length, path: '/admin/team' },
    { label: 'Gallery Images', icon: Image, count: gallery.length, path: '/admin/gallery' },
    { label: 'FAQs', icon: HelpCircle, count: faqs.length, path: '/admin/faq' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your Vegatours website content</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map(card => (
          <Link
            key={card.path}
            to={card.path}
            className="group p-6 bg-card border border-border/50 rounded-2xl hover:border-primary/30 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <card.icon className="w-6 h-6 text-primary" />
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-3xl font-semibold text-foreground">{card.count}</p>
            <p className="text-sm text-muted-foreground mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-6 bg-card border border-border/50 rounded-2xl">
        <h3 className="font-semibold text-foreground mb-2">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link to="/admin/packages" className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors text-sm text-muted-foreground hover:text-foreground">
            <Package className="w-4 h-4 text-primary" /> Manage Tour Packages
          </Link>
          <Link to="/admin/gallery" className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors text-sm text-muted-foreground hover:text-foreground">
            <Image className="w-4 h-4 text-primary" /> Upload Gallery Images
          </Link>
          <Link to="/admin/testimonials" className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors text-sm text-muted-foreground hover:text-foreground">
            <MessageSquare className="w-4 h-4 text-primary" /> Add Testimonials
          </Link>
          <Link to="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors text-sm text-muted-foreground hover:text-foreground">
            <ExternalLink className="w-4 h-4 text-primary" /> View Website
          </Link>
        </div>
      </div>
    </div>
  );
}