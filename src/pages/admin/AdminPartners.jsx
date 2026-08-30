import React, { useState } from 'react';
import EntityManager from '@/components/admin/EntityManager';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageCircle, Mail, Globe, MapPin, Star, Eye } from 'lucide-react';

const fields = [
  { key: 'name', label: 'Company / Agency Name', type: 'text', placeholder: 'e.g. Bali Travel Co.' },
  { key: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Car Rentals / Scooter Rentals / Tour Partner' },
  { key: 'pic_name', label: 'PIC Name', type: 'text', placeholder: 'Person in charge' },
  { key: 'pic_phone', label: 'PIC WhatsApp', type: 'text', placeholder: '628123456789' },
  { key: 'email', label: 'Email', type: 'text', placeholder: 'partner@example.com' },
  { key: 'address', label: 'Street Address', type: 'text', placeholder: 'e.g. Jl. Raya Ubud No. 12' },
  { key: 'city', label: 'City / Area', type: 'text', placeholder: 'e.g. Ubud' },
  { key: 'maps_url', label: 'Google Maps URL', type: 'text', placeholder: 'https://maps.google.com/...' },
  { key: 'rating', label: 'Rating (0-5)', type: 'number', step: '0.1' },
  { key: 'reviews_count', label: 'Reviews Count', type: 'number' },
  { key: 'description', label: 'Short Description', type: 'text', placeholder: 'Optional short description' },
  { key: 'notes', label: 'Internal Notes', type: 'text', placeholder: 'Internal notes (not public)' },
  { key: 'logo_url', label: 'Logo', type: 'image' },
  { key: 'website_url', label: 'Website URL', type: 'text', placeholder: 'https://...' },
  { key: 'is_active', label: 'Active Partner', type: 'boolean' },
  { key: 'publish_on_website', label: 'Publish on Website', type: 'boolean' },
  { key: 'sort_order', label: 'Sort Order', type: 'number' },
];

const waLink = (phone) => `https://wa.me/${(phone || '').replace(/\D/g, '')}`;

function ContactButtons({ item }) {
  const btn = 'inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-border/60 hover:bg-primary/10 hover:border-primary/40 transition-colors';
  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-2">
      {item.pic_phone && (
        <a href={waLink(item.pic_phone)} target="_blank" rel="noopener noreferrer" className={`${btn} text-green-700`} title={`WhatsApp ${item.pic_phone}`}>
          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
        </a>
      )}
      {item.email && (
        <a href={`mailto:${item.email}`} className={`${btn} text-blue-700`} title={item.email}>
          <Mail className="w-3.5 h-3.5" /> Email
        </a>
      )}
      {item.website_url && (
        <a href={item.website_url} target="_blank" rel="noopener noreferrer" className={btn} title={item.website_url}>
          <Globe className="w-3.5 h-3.5" /> Website
        </a>
      )}
      {item.maps_url && (
        <a href={item.maps_url} target="_blank" rel="noopener noreferrer" className={`${btn} text-red-700`} title="Open in Google Maps">
          <MapPin className="w-3.5 h-3.5" /> Maps
        </a>
      )}
    </div>
  );
}

function LocationLine({ item }) {
  const loc = [item.address, item.city].filter(Boolean).join(', ');
  if (!loc && !item.rating) return null;
  return (
    <p className="text-xs text-muted-foreground mt-0.5 flex items-center flex-wrap gap-x-2">
      {loc && (
        <span className="inline-flex items-center gap-1">
          <MapPin className="w-3 h-3 text-red-500" /> {loc}
        </span>
      )}
      {item.rating != null && item.rating !== '' && (
        <span className="inline-flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> {Number(item.rating).toFixed(1)}
          {item.reviews_count ? ` (${item.reviews_count} reviews)` : ''}
        </span>
      )}
    </p>
  );
}

function DetailRow({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}


export default function AdminPartners() {
  const [viewing, setViewing] = useState(null);
  return (
    <>
      <EntityManager
        entityName="Partner"
        queryKey="partners"
        tableName="partners"
        fields={fields}
        searchKeys={['name', 'city', 'address', 'category', 'pic_name', 'pic_phone', 'email', 'description']}
        filters={[
          {
            key: 'category',
            label: 'Category',
            allLabel: 'All Categories',
            options: (items) => {
              const cats = [...new Set(items.map(i => i.category).filter(Boolean))];
              return cats.map(c => ({ value: c, label: c }));
            },
            match: (item, value) => item.category === value,
          },
          {
            key: 'status',
            label: 'Status',
            allLabel: 'All Statuses',
            options: [
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'on_website', label: 'On Website' },
            ],
            match: (item, value) => {
              if (value === 'active') return !!item.is_active;
              if (value === 'inactive') return !item.is_active;
              if (value === 'on_website') return !!item.publish_on_website;
              return true;
            },
          },
        ]}
        renderCard={(item) => (
          <div className="flex items-start gap-3">
            {item.logo_url && (
              <img src={item.logo_url} alt={item.name} className="h-8 w-auto object-contain" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setViewing(item)}
                  className="font-medium text-foreground text-sm hover:text-primary hover:underline text-left"
                  title="View partner details"
                >
                  {item.name}
                </button>
                {item.category && <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">{item.category}</span>}
                {!item.is_active && <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Inactive</span>}
                {item.publish_on_website && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">On Website</span>}
              </div>
              {item.pic_name && <p className="text-xs text-muted-foreground">PIC: {item.pic_name}{item.pic_phone ? ` · ${item.pic_phone}` : ''}</p>}
              <LocationLine item={item} />
              {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
              <ContactButtons item={item} />
            </div>
            <button
              onClick={() => setViewing(item)}
              className="h-8 w-8 flex-shrink-0 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              title="View details"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-w-md w-[calc(100vw-1.5rem)] max-h-[90dvh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 flex-wrap">
              {viewing?.name}
              {viewing?.category && <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-normal">{viewing.category}</span>}
            </DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-3 mt-2">
              {viewing.logo_url && <img src={viewing.logo_url} alt={viewing.name} className="h-16 w-auto object-contain" />}
              <LocationLine item={viewing} />
              {viewing.description && <p className="text-sm text-muted-foreground">{viewing.description}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <DetailRow label="PIC Name" value={viewing.pic_name} />
                <DetailRow label="PIC WhatsApp" value={viewing.pic_phone} />
                <DetailRow label="Email" value={viewing.email} />
                <DetailRow label="Street Address" value={viewing.address} />
                <DetailRow label="City / Area" value={viewing.city} />
                <DetailRow label="Internal Notes" value={viewing.notes} />
              </div>
              <ContactButtons item={viewing} />
              <div className="flex items-center gap-2 pt-1">
                {!viewing.is_active && <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Inactive</span>}
                {viewing.publish_on_website && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">On Website</span>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
