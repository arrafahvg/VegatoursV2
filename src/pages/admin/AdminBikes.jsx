import React from 'react';
import EntityManager from '@/components/admin/EntityManager';

const fields = [
  { key: 'name', label: 'Bike Name', type: 'text', placeholder: 'e.g. Honda Vario 150' },
  { key: 'type', label: 'Bike Type', type: 'text', placeholder: 'e.g. Automatic, Manual, Sport' },
  { key: 'capacity', label: 'Engine Capacity (CC)', type: 'text', placeholder: 'e.g. 150cc, 250cc' },
  { key: 'price', label: 'Price', type: 'text', placeholder: 'e.g. IDR 200,000' },
  { key: 'includes_en', label: 'Included (English)', type: 'array' },
  { key: 'includes_id', label: 'Termasuk (Bahasa Indonesia)', type: 'array' },
  { key: 'terms_en', label: 'Terms & Conditions (English)', type: 'array' },
  { key: 'terms_id', label: 'Ketentuan (Bahasa Indonesia)', type: 'array' },
  { key: 'features', label: 'Features / Fasilitas Tambahan', type: 'array' },
  { key: 'image_url', label: 'Photo', type: 'image' },
  { key: 'price_note', label: 'Price Note', type: 'text', placeholder: 'e.g. Harga per hari,不包括 bensin' },
  { key: 'sort_order', label: 'Sort Order', type: 'number' },
];

export default function AdminBikes() {
  return (
    <EntityManager
      entityName="Bikes"
      queryKey="bikes"
      fields={fields}
      renderCard={(item) => (
        <div className="flex items-center gap-3">
          {item.image_url && (
            <img src={item.image_url} alt={item.name} className="h-10 w-16 object-cover rounded-lg flex-shrink-0" />
          )}
          <div>
            <p className="font-medium text-foreground text-sm">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.type}{item.capacity ? ` · ${item.capacity}` : ''}{item.price ? ` · ${item.price}` : ''}</p>
          </div>
        </div>
      )}
    />
  );
}