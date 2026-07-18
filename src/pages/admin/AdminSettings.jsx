import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

const DEFAULT_SETTINGS = [
  { key: 'whatsapp_number', label: 'WhatsApp Number (e.g. 62896461000)', value: '62896461000' },
  { key: 'whatsapp_cta_en', label: 'WhatsApp CTA Button (English)', value: 'Chat on WhatsApp' },
  { key: 'whatsapp_cta_id', label: 'WhatsApp CTA Button (Bahasa)', value: 'Chat di WhatsApp' },
  { key: 'contact_location', label: 'Location (Footer)', value: 'Bali, Indonesia' },
  { key: 'contact_email', label: 'Email (Footer, leave blank to hide)', value: '' },
];

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_settings').select('*').order('key', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    initialData: [],
  });

  useEffect(() => {
    if (settings.length === 0) return;
    const map = {};
    settings.forEach(s => { map[s.key] = s.value; });
    setFormData(map);
  }, [settings]);

  // Pre-fill defaults for keys not yet in DB
  useEffect(() => {
    if (isLoading) return;
    const existingKeys = settings.map(s => s.key);
    const initial = {};
    DEFAULT_SETTINGS.forEach(d => {
      initial[d.key] = existingKeys.includes(d.key)
        ? settings.find(s => s.key === d.key)?.value
        : d.value;
    });
    setFormData(initial);
  }, [isLoading]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      for (const def of DEFAULT_SETTINGS) {
        const existing = settings.find(s => s.key === def.key);
        const value = data[def.key] ?? '';
        if (existing) {
          const { error } = await supabase.from('site_settings').update({ value }).eq('id', existing.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('site_settings').insert({ key: def.key, label: def.label, value });
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
      toast.success('Settings saved!');
    },
  });

  if (isLoading) return <div className="text-muted-foreground py-12 text-center">Loading...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Site Settings</h1>
        <p className="text-muted-foreground mt-1">Manage WhatsApp number, CTAs, and contact info shown on the website.</p>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-6 max-w-xl space-y-5">
        {DEFAULT_SETTINGS.map(def => (
          <div key={def.key}>
            <Label className="text-sm font-medium mb-1.5 block">{def.label}</Label>
            <Input
              value={formData[def.key] ?? ''}
              onChange={e => setFormData(prev => ({ ...prev, [def.key]: e.target.value }))}
              placeholder={def.value}
              className="rounded-xl"
            />
          </div>
        ))}

        <Button
          onClick={() => saveMutation.mutate(formData)}
          disabled={saveMutation.isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gap-2 mt-2"
        >
          <Save className="w-4 h-4" />
          {saveMutation.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}