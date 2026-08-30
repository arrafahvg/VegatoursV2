import React from 'react';
import EntityManager from '@/components/admin/EntityManager';

const fields = [
  { key: 'quote_en', label: 'Testimonial Quote (English)', type: 'textarea', placeholder: 'What did the traveler say?' },
  { key: 'quote_id', label: 'Testimonial Quote (Bahasa Indonesia)', type: 'textarea', placeholder: 'Apa kata wisatawan?' },
  { key: 'author_name', label: 'Author Name', type: 'text', placeholder: 'e.g. Sarah' },
  { key: 'author_location', label: 'Author Location', type: 'text', placeholder: 'e.g. Australia' },
  { key: 'author_photo', label: 'Author Photo', type: 'image' },
  { key: 'rating', label: 'Rating (1-5)', type: 'number' },
  { key: 'sort_order', label: 'Sort Order', type: 'number' },
];

export default function AdminTestimonials() {
  return (
    <EntityManager
      entityName="Testimonial"
      queryKey="testimonials"
      tableName="testimonials"
      fields={fields}
      renderCard={(item) => (
        <div>
          <p className="text-sm text-foreground line-clamp-2 italic">"{item.quote_en || item.quote}"</p>
          <p className="text-xs text-muted-foreground mt-1">— {item.author_name}{item.author_location ? `, ${item.author_location}` : ''}</p>
        </div>
      )}
    />
  );
}