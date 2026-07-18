import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Save, Upload } from 'lucide-react';

const PAYMENT_SETTINGS = [
  { key: 'bank_name', label: 'Bank Name', value: 'BCA' },
  { key: 'bank_account_name', label: 'Account Name', value: 'Mochamad Vega Arrafah Setiawan' },
  { key: 'bank_account_number', label: 'Account Number', value: '2310872558' },
];

export default function AdminPaymentSettings() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({});
  const [qrisFile, setQrisFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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
    if (isLoading) return;
    const map = {};
    settings.forEach(s => { map[s.key] = s.value; });
    const init = {};
    PAYMENT_SETTINGS.forEach(d => {
      init[d.key] = map[d.key] !== undefined ? map[d.key] : d.value;
    });
    init.qris_image_url = map.qris_image_url || '';
    setFormData(init);
  }, [isLoading, settings]);

  const saveSetting = async (key, label, value) => {
    const existing = settings.find(s => s.key === key);
    if (existing) {
      const { error } = await supabase.from('site_settings').update({ value }).eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('site_settings').insert({ key, label, value });
      if (error) throw error;
    }
  };

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      for (const def of PAYMENT_SETTINGS) {
        await saveSetting(def.key, def.label, data[def.key] ?? def.value);
      }
      if (data.qris_image_url) {
        await saveSetting('qris_image_url', 'QRIS Image URL', data.qris_image_url);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
      toast.success('Payment settings saved!');
    },
  });

  const handleQrisUpload = async () => {
    if (!qrisFile) return;
    setUploading(true);
    try {
      // Upload to Supabase Storage bucket 'public'
      const fileExt = qrisFile.name.split('.').pop();
      const fileName = `qris_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('public').upload(fileName, qrisFile);
      if (uploadError) throw uploadError;
      // Get public URL
      const { data } = supabase.storage.from('public').getPublicUrl(fileName);
      setFormData(p => ({ ...p, qris_image_url: data.publicUrl }));
      toast.success('QRIS image uploaded');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    }
    setUploading(false);
  };

  if (isLoading) return <div className="text-muted-foreground py-12 text-center">Loading...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Payment Settings</h1>
        <p className="text-muted-foreground mt-1">Configure bank transfer and QRIS payment details shown in invoices.</p>
      </div>

      <div className="space-y-6 max-w-xl">
        {/* Bank Transfer */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-foreground">Bank Transfer</h3>
          {PAYMENT_SETTINGS.map(def => (
            <div key={def.key}>
              <Label className="text-sm font-medium mb-1.5 block">{def.label}</Label>
              <Input
                value={formData[def.key] ?? ''}
                onChange={e => setFormData(p => ({ ...p, [def.key]: e.target.value }))}
                className="rounded-xl"
              />
            </div>
          ))}
        </div>

        {/* QRIS */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-foreground">QRIS</h3>
          <p className="text-sm text-muted-foreground">Upload your active QRIS code image. It will appear automatically on QRIS invoices.</p>
          {formData.qris_image_url && (
            <img src={formData.qris_image_url} alt="QRIS" className="w-40 h-40 object-contain border border-border rounded-xl" />
          )}
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Label className="text-sm font-medium mb-1.5 block">Upload QRIS Image</Label>
              <Input type="file" accept="image/*" onChange={e => setQrisFile(e.target.files[0])} className="rounded-xl" />
            </div>
            <Button type="button" variant="outline" className="rounded-xl gap-2" onClick={handleQrisUpload} disabled={!qrisFile || uploading}>
              <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Or paste image URL</Label>
            <Input
              value={formData.qris_image_url || ''}
              onChange={e => setFormData(p => ({ ...p, qris_image_url: e.target.value }))}
              placeholder="https://..."
              className="rounded-xl"
            />
          </div>
        </div>

        <Button
          onClick={() => saveMutation.mutate(formData)}
          disabled={saveMutation.isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gap-2"
        >
          <Save className="w-4 h-4" />
          {saveMutation.isPending ? 'Saving...' : 'Save Payment Settings'}
        </Button>
      </div>
    </div>
  );
}