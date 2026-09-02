import React from 'react';
import EntityManager from '@/components/admin/EntityManager';
import { formatPriceRange, formatPrice } from '@/lib/utils';

const fields = [
  { key: 'name', label: 'Bike Name', type: 'text', placeholder: 'e.g. Honda Vario 150' },
  { key: 'type', label: 'Bike Type', type: 'text', placeholder: 'e.g. Automatic, Manual, Sport' },
  { key: 'capacity', label: 'Engine Capacity (CC)', type: 'text', placeholder: 'e.g. 150cc, 250cc' },
  { key: 'price', label: 'Daily Price (numbers only, e.g. 200000 = Rp200,000,-) — shown as the main price', type: 'number', placeholder: 'e.g. 200000' },
  { key: 'price_weekly', label: 'Weekly Price — optional, shown in small text (e.g. 1200000 = Rp1,200,000,- / week)', type: 'number', placeholder: 'e.g. 1200000' },
  { key: 'price_monthly', label: 'Monthly Price — optional, shown in small text (e.g. 3500000 = Rp3,500,000,- / month)', type: 'number', placeholder: 'e.g. 3500000' },
  { key: 'price_max', label: 'Price Max — optional. Enter to show a RANGE (e.g. 500000 => Rp200,000,- – Rp500,000,-). Discount is ignored when a range is set.', type: 'number', placeholder: 'e.g. 500000' },
  { key: 'price_discount', label: 'Discounted Price — optional. Enter for a single price with the original struck through (e.g. 150000). Only for single prices, not ranges.', type: 'number', placeholder: 'e.g. 150000', hidden: (fd) => !!fd.price_max },
  { key: 'includes_en', label: 'Included (English)', type: 'array' },
  { key: 'includes_id', label: 'Termasuk (Bahasa Indonesia)', type: 'array' },
  { key: 'terms_en', label: 'Terms & Conditions (English)', type: 'array' },
  { key: 'terms_id', label: 'Ketentuan (Bahasa Indonesia)', type: 'array' },
  { key: 'features', label: 'Features / Fasilitas Tambahan', type: 'array' },
  { key: 'image_url', label: 'Photo', type: 'image' },
  { key: 'price_note', label: 'Price Note', type: 'text', placeholder: 'e.g. Harga per hari, tidak termasuk bensin' },
  { key: 'is_available', label: 'Available for Rent / Tersedia Untuk Disewa', type: 'boolean' },
  { key: 'sort_order', label: 'Sort Order', type: 'number' },
];

export default function AdminBikes() {
  return (
    <EntityManager
      entityName="Bikes"
      queryKey="bikes"
      fields={fields}
      missingFieldWarning={['is_available']}
      renderCard={(item) => (
        <div className="flex items-center gap-3">
          {item.image_url && (
            <img src={item.image_url} alt={item.name} className="h-10 w-16 object-cover rounded-lg flex-shrink-0" />
          )}
          <div>
            <p className="font-medium text-foreground text-sm flex items-center gap-2 flex-wrap">
              {item.name}
              {item.is_available === false ? (
                <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Not Available</span>
              ) : (
                <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Available</span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">{item.type}{item.capacity ? ` · ${item.capacity}` : ''}</p>
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
            {item.price_weekly ? <p className="text-[11px] text-muted-foreground">{formatPrice(item.price_weekly)} / week</p> : null}
            {item.price_monthly ? <p className="text-[11px] text-muted-foreground">{formatPrice(item.price_monthly)} / month</p> : null}
          </div>
        </div>
      )}
    />
  );
}