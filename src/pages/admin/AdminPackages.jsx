import React from 'react';
import EntityManager from '@/components/admin/EntityManager';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

const fields = [
  { key: 'title_en', label: 'Title (English)', type: 'text', placeholder: 'e.g. Ubud Highlight Tour' },
  { key: 'title_id', label: 'Title (Bahasa Indonesia)', type: 'text', placeholder: 'e.g. Tur Highlight Ubud' },
  { key: 'price', label: 'Price Display', type: 'text', placeholder: 'e.g. IDR 850,000 / car' },
  { key: 'duration_en', label: 'Duration (English)', type: 'text', placeholder: 'e.g. Full Day (10 Hours)' },
  { key: 'duration_id', label: 'Duration (Bahasa Indonesia)', type: 'text', placeholder: 'e.g. Sehari Penuh (10 Jam)' },
  { key: 'description_en', label: 'Description (English)', type: 'textarea' },
  { key: 'description_id', label: 'Description (Bahasa Indonesia)', type: 'textarea' },
  { key: 'highlights_en', label: 'Highlights (English)', type: 'array' },
  { key: 'highlights_id', label: 'Highlights (Bahasa Indonesia)', type: 'array' },
  { key: 'image_url', label: 'Package Image', type: 'image' },
  { key: 'is_popular', label: 'Most Popular Badge', type: 'boolean' },
  { key: 'cta_text_en', label: 'CTA Button (English)', type: 'text', placeholder: 'Book This Tour' },
  { key: 'cta_text_id', label: 'CTA Button (Bahasa Indonesia)', type: 'text', placeholder: 'Pesan Tur Ini' },
  { key: 'sort_order', label: 'Sort Order', type: 'number' },
];

export default function AdminPackages() {
  return (
    <EntityManager
      entityName="TourPackage"
      queryKey="tourPackages"
      fields={fields}
      renderCard={(item) => (
        <div className="flex items-center gap-3">
          {item.image_url && <img src={item.image_url} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground truncate">{item.title_en}</p>
              {item.is_popular && <Badge className="bg-primary/10 text-primary border-0 text-xs"><Star className="w-3 h-3 mr-1" />Popular</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{item.price}</p>
          </div>
        </div>
      )}
    />
  );
}