import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { MessageCircle, Pencil, Trash2, FileText } from 'lucide-react';
import { generateItineraryPDF } from '@/lib/pdfUtils';
import InvoicesPanel from './InvoicesPanel';

const STATUS_COLORS = {
  lead: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700',
  ongoing: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-600',
};

function Section({ title, children }) {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6">
      <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider mb-4 pb-3 border-b border-border/50">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
      <span className="text-xs text-muted-foreground w-32 flex-shrink-0">{label}</span>
      <span className="text-sm text-foreground font-medium">{value}</span>
    </div>
  );
}

export default function BookingDetail({ booking: b, onEdit, onDelete }) {
  const waCustomer = b.customer_phone ? `https://wa.me/${b.customer_phone.replace(/\D/g,'')}` : null;
  const waPIC = b.pic_phone ? `https://wa.me/${b.pic_phone.replace(/\D/g,'')}` : null;

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 bg-card border border-border/50 rounded-2xl p-6">
        <div>
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <span className="font-mono text-sm text-primary font-bold">{b.booking_code || '—'}</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[b.status] || 'bg-secondary'}`}>{b.status}</span>
          </div>
          <h2 className="font-serif text-2xl font-medium text-foreground">{b.customer_name}</h2>
          <p className="text-muted-foreground text-sm">{b.package_name}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {waCustomer && (
            <a href={waCustomer} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="rounded-xl gap-2 border-green-200 text-green-700 hover:bg-green-50">
                <MessageCircle className="w-4 h-4" /> Customer
              </Button>
            </a>
          )}
          {waPIC && (
            <a href={waPIC} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="rounded-xl gap-2 border-green-200 text-green-700 hover:bg-green-50">
                <MessageCircle className="w-4 h-4" /> PIC
              </Button>
            </a>
          )}
          <Button variant="outline" size="sm" className="rounded-xl gap-2" onClick={() => generateItineraryPDF(b)} disabled={!b.itinerary}>
            <FileText className="w-4 h-4" /> Itinerary PDF
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl gap-2" onClick={onEdit}>
            <Pencil className="w-4 h-4" /> Edit
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl gap-2 border-destructive/30 text-destructive hover:bg-destructive/10" onClick={onDelete}>
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Section title="Customer">
          <Row label="Name" value={b.customer_name} />
          <Row label="Email" value={b.customer_email} />
          <Row label="WhatsApp" value={b.customer_phone} />
          <Row label="Country" value={b.customer_country} />
          <Row label="Pax" value={b.pax} />
        </Section>

        <Section title="Booking">
          <Row label="Package" value={b.package_name} />
          <Row label="Tour Date" value={b.tour_date ? format(new Date(b.tour_date), 'dd MMM yyyy') : null} />
          <Row label="End Date" value={b.end_date ? format(new Date(b.end_date), 'dd MMM yyyy') : null} />
          <Row label="Service Notes" value={b.service_notes} />
        </Section>

        <Section title="Partner / PIC">
          <Row label="Partner" value={b.partner_name} />
          <Row label="PIC Name" value={b.pic_name} />
          <Row label="PIC Phone" value={b.pic_phone} />
          <Row label="PIC Email" value={b.pic_email} />
        </Section>

        {b.internal_notes && (
          <Section title="Internal Notes">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{b.internal_notes}</p>
          </Section>
        )}
      </div>

      {b.itinerary && (
        <Section title="Itinerary">
          <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">{b.itinerary}</pre>
        </Section>
      )}

      {/* Multi-invoice panel */}
      <div className="bg-card border border-border/50 rounded-2xl p-6">
        <InvoicesPanel booking={b} />
      </div>
    </div>
  );
}