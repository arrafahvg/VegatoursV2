import React, { useState } from 'react';
import { format } from 'date-fns';
import { Eye, Pencil, Trash2, Search, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

const STATUS_COLORS = {
  lead: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700',
  ongoing: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-600',
};

export default function BookingList({ bookings, isLoading, onView, onEdit, onDelete }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const statuses = ['all', 'lead', 'confirmed', 'ongoing', 'completed', 'cancelled'];

  const filtered = bookings.filter(b => {
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || b.customer_name?.toLowerCase().includes(q) || b.booking_code?.toLowerCase().includes(q) || b.package_name?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, code or package..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                statusFilter === s ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {['lead','confirmed','ongoing','completed','cancelled'].map(s => (
          <div key={s} className="bg-card border border-border/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-semibold text-foreground">{bookings.filter(b => b.status === s).length}</p>
            <p className="text-xs text-muted-foreground capitalize mt-0.5">{s}</p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground bg-card border border-border/50 rounded-2xl">No bookings found</div>
      ) : (
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Code</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Package</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pax</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs text-primary font-semibold">{b.booking_code || '—'}</span>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-foreground text-sm">{b.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{b.customer_country}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm text-muted-foreground">{b.package_name || '—'}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm text-muted-foreground">
                        {b.tour_date ? format(new Date(b.tour_date), 'dd MMM yy') : '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[b.status] || 'bg-secondary text-secondary-foreground'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm text-muted-foreground">{b.pax || 1}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        {b.customer_phone && (
                          <a href={`https://wa.me/${b.customer_phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-green-600 hover:bg-green-50 transition-colors" title="WhatsApp Customer">
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        )}
                        <button onClick={() => onView(b)} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => onEdit(b)} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => onDelete(b)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}