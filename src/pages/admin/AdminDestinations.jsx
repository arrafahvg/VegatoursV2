import React from 'react';
import EntityManager from '@/components/admin/EntityManager';

const fields = [
  { key: 'image_url', label: 'Image', type: 'image' },
  { key: 'name_en', label: 'Name (English)', type: 'text', placeholder: 'e.g. Ubud' },
  { key: 'name_id', label: 'Name (Bahasa Indonesia)', type: 'text', placeholder: 'e.g. Ubud' },
  { key: 'desc_en', label: 'Description (English)', type: 'textarea', placeholder: 'Short description...' },
  { key: 'desc_id', label: 'Description (Bahasa Indonesia)', type: 'textarea', placeholder: 'Deskripsi singkat...' },
  { key: 'is_featured', label: 'Featured', type: 'boolean' },
  { key: 'sort_order', label: 'Sort Order', type: 'number' },
];

export default function AdminDestinations() {
  return (
    <EntityManager
      entityName="Destination"
      queryKey="destinations"
      fields={fields}
      renderCard={(item) => (
        <div className="flex items-center gap-3">
          {item.image_url && (
            <img src={item.image_url} alt={item.name_en} className="h-10 w-16 object-cover rounded-lg flex-shrink-0" />
          )}
          <div>
            <p className="font-medium text-foreground text-sm">{item.name_en}</p>
            {item.desc_en && <p className="text-xs text-muted-foreground line-clamp-1">{item.desc_en}</p>}
          </div>
        </div>
      )}
    />
  );
}