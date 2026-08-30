import React from 'react';
import EntityManager from '@/components/admin/EntityManager';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import PriceDisplay from '@/components/PriceDisplay';

const fields = [
  { key: 'title_en', label: 'Title (English)', type: 'text', placeholder: 'e.g. Ubud Highlight Tour' },
  { key: 'title_id', label: 'Title (Bahasa Indonesia)', type: 'text', placeholder: 'e.g. Tur Highlight Ubud' },
  { key: 'price', label: 'Price From (numbers only, e.g. 850000 = Rp850,000,-)', type: 'number', placeholder: 'e.g. 850000' },
  { key: 'price_max', label: 'Price Max — optional. Enter to show a RANGE (e.g. 1200000 => Rp850,000,- – Rp1,200,000,-). Discount is ignored when a range is set.', type: 'number', placeholder: 'e.g. 1200000' },
  { key: 'price_discount', label: 'Discounted Price — optional. Enter for a single price with the original struck through (e.g. 700000). Only for single prices, not ranges.', type: 'number', placeholder: 'e.g. 700000', hidden: (fd) => !!fd.price_max },
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
      queryKey="tour_packages"
      tableName="tour_packages"
      fields={fields}
      renderCard={(item) => (
        <div className="flex items-center gap-3">
          {item.image_url && <img src={item.image_url} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground truncate">{item.title_en}</p>
              {item.is_popular && <Badge className="bg-primary/10 text-primary border-0 text-xs"><Star className="w-3 h-3 mr-1" />Popular</Badge>}
            </div>
            {item.price ? <PriceDisplay price={item.price} priceMax={item.price_max} priceDiscount={item.price_discount} className="text-sm" /> : null}
          </div>
        </div>
      )}
    />
  );
}