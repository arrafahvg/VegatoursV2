import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';

const STATUSES = ['lead', 'confirmed', 'ongoing', 'completed', 'cancelled'];

export default function BookingForm({ booking, onSave, saving }) {
  const [form, setForm] = useState(booking || {
    status: 'lead', customer_name: '', customer_email: '', customer_phone: '',
    customer_country: '', pax: 1, tour_date: '', end_date: '', package_name: '',
    service_notes: '', partner_id: '', partner_name: '', pic_name: '', pic_phone: '', pic_email: '',
    itinerary: '', internal_notes: '',
  });

  const { data: partners } = useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    initialData: [],
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handlePartnerSelect = (partnerId) => {
    const p = partners.find(p => p.id === partnerId);
    if (p) {
      set('partner_id', partnerId);
      setForm(prev => ({
        ...prev,
        partner_id: partnerId,
        partner_name: p.name,
        pic_name: p.pic_name || prev.pic_name,
        pic_phone: p.pic_phone || prev.pic_phone,
        pic_email: p.email || prev.pic_email,
      }));
    } else {
      set('partner_id', '');
    }
  };

  const section = (title) => (
    <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider mb-4 pt-4 border-t border-border/50 first:border-t-0 first:pt-0">{title}</h3>
  );

  const field = (label, key, type = 'text', props = {}) => (
    <div>
      <Label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</Label>
      <Input type={type} value={form[key] || ''} onChange={e => set(key, type === 'number' ? Number(e.target.value) : e.target.value)} className="rounded-xl" {...props} />
    </div>
  );

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-5 max-w-4xl">
      {section('Booking Info')}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-1 block">Status</Label>
          <Select value={form.status} onValueChange={v => set('status', v)}>
            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {field('Package / Service', 'package_name')}
        {field('Tour Date', 'tour_date', 'date')}
        {field('End Date', 'end_date', 'date')}
        {field('Pax (passengers)', 'pax', 'number', { min: 1 })}
      </div>

      {section('Customer Details')}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field('Full Name *', 'customer_name', 'text', { required: true })}
        {field('Email', 'customer_email', 'email')}
        {field('WhatsApp (with country code)', 'customer_phone', 'tel', { placeholder: '628123456789' })}
        {field('Country / City', 'customer_country')}
      </div>
      <div>
        <Label className="text-xs font-medium text-muted-foreground mb-1 block">Service Notes / Special Requests</Label>
        <Textarea value={form.service_notes || ''} onChange={e => set('service_notes', e.target.value)} rows={3} className="rounded-xl resize-none" />
      </div>

      {section('Partner / PIC')}
      <div>
        <Label className="text-xs font-medium text-muted-foreground mb-1 block">Select Partner (from database)</Label>
        <Select value={form.partner_id || ''} onValueChange={handlePartnerSelect}>
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="Choose a partner or leave blank for manual entry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>— Manual entry —</SelectItem>
            {partners.map(p => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}{p.pic_name ? ` (${p.pic_name})` : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field('Partner / Agency Name', 'partner_name')}
        {field('PIC Name', 'pic_name')}
        {field('PIC WhatsApp', 'pic_phone', 'tel', { placeholder: '628123456789' })}
        {field('PIC Email', 'pic_email', 'email')}
      </div>

      {section('Itinerary')}
      <div>
        <Label className="text-xs font-medium text-muted-foreground mb-1 block">Day-by-Day Itinerary</Label>
        <Textarea value={form.itinerary || ''} onChange={e => set('itinerary', e.target.value)} rows={8} className="rounded-xl resize-none font-mono text-sm" placeholder={"Day 1 – Arrival\n- Pick up from airport\n- Check-in hotel\n\nDay 2 – Ubud Tour\n- ..."} />
      </div>

      {section('Internal Notes')}
      <div>
        <Textarea value={form.internal_notes || ''} onChange={e => set('internal_notes', e.target.value)} rows={3} className="rounded-xl resize-none" placeholder="Private notes for the team..." />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gap-2 px-8">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Booking'}
        </Button>
      </div>
    </form>
  );
}