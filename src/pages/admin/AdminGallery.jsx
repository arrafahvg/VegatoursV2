import React from 'react';
import EntityManager from '@/components/admin/EntityManager';

const fields = [
  { key: 'image_url', label: 'Image', type: 'image' },
  { key: 'caption_en', label: 'Caption (English)', type: 'text', placeholder: 'Optional caption' },
  { key: 'caption_id', label: 'Caption (Bahasa Indonesia)', type: 'text', placeholder: 'Keterangan opsional' },
  { key: 'sort_order', label: 'Sort Order', type: 'number' },
];

export default function AdminGallery() {
  return (
    <EntityManager
      entityName="GalleryImage"
      queryKey="galleryImages"
      fields={fields}
      renderCard={(item) => (
        <div className="flex items-center gap-3">
          {item.image_url && <img src={item.image_url} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />}
          <p className="text-sm text-muted-foreground">{item.caption_en || 'No caption'}</p>
        </div>
      )}
    />
  );
}