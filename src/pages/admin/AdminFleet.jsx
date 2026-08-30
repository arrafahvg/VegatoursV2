import React from 'react';
import EntityManager from '@/components/admin/EntityManager';
import { formatPriceRange } from '@/lib/utils';

const fields = [
  { key: 'name', label: 'Vehicle Name', type: 'text', placeholder: 'e.g. HIACE PREMIO (12 seater)' },
  { key: 'type', label: 'Vehicle Type', type: 'text', placeholder: 'e.g. MPV, SUV, Minibus' },
  { key: 'capacity', label: 'Capacity (Passengers)', type: 'number' },
  { key: 'price', label: 'Price From (numbers only, e.g. 1500000 = Rp1,500,000,-)', type: 'number', placeholder: 'e.g. 420000' },
  { key: 'price_max', label: 'Price To — optional, for ranges (e.g. 820000 = Rp820,000,-)', type: 'number', placeholder: 'e.g. 820000' },
  { key: 'includes_en', label: 'Included (English)', type: 'array' },
  { key: 'includes_id', label: 'Termasuk (Bahasa Indonesia)', type: 'array' },
  { key: 'terms_en', label: 'Terms & Conditions (English)', type: 'array' },
  { key: 'terms_id', label: 'Ketentuan (Bahasa Indonesia)', type: 'array' },
  { key: 'features', label: 'Features / Fasilitas Tambahan', type: 'array' },
  { key: 'image_url', label: 'Photo', type: 'image' },
  { key: 'price_note', label: 'Price Note', type: 'text', placeholder: 'e.g. Harga diluar tarif parkir, toll, dan tips driver' },
  { key: 'sort_order', label: 'Sort Order', type: 'number' },
];

export default function AdminFleet() {
  return (
    <EntityManager
      entityName="Fleet"
      queryKey="fleet"
      fields={fields}
      renderCard={(item) => (
        <div className="flex items-center gap-3">
          {item.image_url && (
            <img src={item.image_url} alt={item.name} className="h-10 w-16 object-cover rounded-lg flex-shrink-0" />
          )}
          <div>
            <p className="font-medium text-foreground text-sm">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.type}{item.capacity ? ` · ${item.capacity} pax` : ''}{item.price ? ` · ${formatPriceRange(item.price, item.price_max)}` : ''}</p>
          </div>
        </div>
      )}
    />
  );
}