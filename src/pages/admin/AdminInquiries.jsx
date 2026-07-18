import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Calendar, MessageSquare, User } from 'lucide-react';
import { format } from 'date-fns';

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  closed: 'bg-green-100 text-green-700',
};

export default function AdminInquiries() {
  const queryClient = useQueryClient();

  const { data: inquiries, isLoading } = useQuery({
    queryKey: ['inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_date', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inquiries'] }),
  });

  const newCount = inquiries.filter(i => i.status === 'new').length;

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Inquiries</h1>
          <p className="text-muted-foreground mt-1">Messages submitted via the contact form</p>
        </div>
        {newCount > 0 && (
          <span className="ml-2 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
            {newCount} new
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
          <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No inquiries yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map(inq => (
            <div key={inq.id} className="bg-card border border-border/50 rounded-2xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{inq.name}</p>
                    <a href={`mailto:${inq.email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {inq.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[inq.status]}`}>
                    {inq.status}
                  </span>
                  <Select value={inq.status} onValueChange={(val) => updateMutation.mutate({ id: inq.id, status: val })}>
                    <SelectTrigger className="w-36 h-8 rounded-xl text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {inq.travel_dates && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{inq.travel_dates}</span>
                </div>
              )}

              <p className="text-sm text-foreground/80 bg-secondary/50 rounded-xl p-3 leading-relaxed">
                {inq.message}
              </p>

              <p className="text-xs text-muted-foreground">
                {inq.created_date ? format(new Date(inq.created_date), 'dd MMM yyyy, HH:mm') : ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}