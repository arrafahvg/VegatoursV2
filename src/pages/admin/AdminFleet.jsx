import React from 'react';
import EntityManager from '@/components/admin/EntityManager';
import { formatPriceRange, formatPrice } from '@/lib/utils';

const fields = [
  { key: 'name', label: 'Vehicle Name', type: 'text', placeholder: 'e.g. HIACE PREMIO (12 seater)' },
  { key: 'type', label: 'Vehicle Type', type: 'text', placeholder: 'e.g. MPV, SUV, Minibus' },
  { key: 'capacity', label: 'Capacity (Passengers)', type: 'number' },
  { key: 'price', label: 'Price From (numbers only, e.g. 1500000 = Rp1,500,000,-)', type: 'number', placeholder: 'e.g. 420000' },
  { key: 'price_max', label: 'Price To — optional, for ranges (e.g. 820000 = Rp820,000,-)', type: 'number', placeholder: 'e.g. 820000' },
  { key: 'price_discount', label: 'Discounted Price (optional, single prices only)', type: 'number', placeholder: 'e.g. 1200000' },
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
            <p className="text-xs text-muted-foreground">{item.type}{item.capacity ? ` · ${item.capacity} pax` : ''}</p>
            {item.price ? (
              item.price_max ? (
                <p className="text-xs text-muted-foreground">{formatPriceRange(item.price, item.price_max)}</p>
              ) : item.price_discount ? (
                <p className="text-xs">
                  <span className="line-through text-muted-foreground mr-1">{formatPrice(item.price)}</span>
                  <span className="font-semibold text-primary">{formatPrice(item.price_discount)}</span>
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">{formatPrice(item.price)}</p>
              )
            ) : null}
          </div>
        </div>
      )}
    />
  );
}