import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

import BookingList from '@/components/crm/BookingList';
import BookingDetail from '@/components/crm/BookingDetail';
import BookingForm from '@/components/crm/BookingForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_LABELS = { lead: 'Lead', confirmed: 'Confirmed', ongoing: 'Ongoing', completed: 'Completed', cancelled: 'Cancelled' };

export default function AdminCRM() {
  const [view, setView] = useState('list'); // list | detail | form
  const [selected, setSelected] = useState(null);
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_date', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    initialData: [],
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (selected?.id) {
        const { error } = await supabase.from('bookings').update(data).eq('id', selected.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('bookings').insert({ ...data, booking_code: `VBT-${Date.now().toString().slice(-6)}` });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success(selected?.id ? 'Booking updated' : 'Booking created');
      setView('list');
      setSelected(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking deleted');
      setView('list');
      setSelected(null);
    },
  });

  const handleNew = () => { setSelected(null); setView('form'); };
  const handleEdit = (b) => { setSelected(b); setView('form'); };
  const handleView = (b) => { setSelected(b); setView('detail'); };
  const handleDelete = (b) => {
    if (window.confirm(`Delete booking for "${b.customer_name}"?`)) deleteMutation.mutate(b.id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">CRM</h1>
          <p className="text-muted-foreground mt-1">Manage bookings, customers, itineraries & invoices</p>
        </div>
        <div className="flex items-center gap-3">
          {view !== 'list' && (
            <Button variant="outline" className="rounded-xl" onClick={() => { setView('list'); setSelected(null); }}>
              ← Back to List
            </Button>
          )}
          {view === 'list' && (
            <Button onClick={handleNew} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gap-2">
              <Plus className="w-4 h-4" /> New Booking
            </Button>
          )}
        </div>
      </div>

      {view === 'list' && (
        <BookingList
          bookings={bookings}
          isLoading={isLoading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {view === 'detail' && selected && (
        <BookingDetail
          booking={selected}
          onEdit={() => handleEdit(selected)}
          onDelete={() => handleDelete(selected)}
        />
      )}
      {view === 'form' && (
        <BookingForm
          booking={selected}
          onSave={(data) => saveMutation.mutate(data)}
          saving={saveMutation.isPending}
        />
      )}
    </div>
  );
}