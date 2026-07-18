import React from 'react';
import EntityManager from '@/components/admin/EntityManager';

const fields = [
  { key: 'name', label: 'Company / Agency Name', type: 'text', placeholder: 'e.g. Bali Travel Co.' },
  { key: 'pic_name', label: 'PIC Name', type: 'text', placeholder: 'Person in charge' },
  { key: 'pic_phone', label: 'PIC WhatsApp', type: 'text', placeholder: '628123456789' },
  { key: 'email', label: 'Email', type: 'text', placeholder: 'partner@example.com' },
  { key: 'description', label: 'Short Description', type: 'text', placeholder: 'Optional short description' },
  { key: 'notes', label: 'Internal Notes', type: 'text', placeholder: 'Internal notes (not public)' },
  { key: 'logo_url', label: 'Logo', type: 'image' },
  { key: 'website_url', label: 'Website URL', type: 'text', placeholder: 'https://...' },
  { key: 'is_active', label: 'Active Partner', type: 'boolean' },
  { key: 'publish_on_website', label: 'Publish on Website', type: 'boolean' },
  { key: 'sort_order', label: 'Sort Order', type: 'number' },
];

export default function AdminPartners() {
  return (
    <EntityManager
      entityName="Partner"
      queryKey="partners"
      fields={fields}
      renderCard={(item) => (
        <div className="flex items-center gap-3">
          {item.logo_url && (
            <img src={item.logo_url} alt={item.name} className="h-8 w-auto object-contain" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground text-sm">{item.name}</p>
              {!item.is_active && <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Inactive</span>}
              {item.publish_on_website && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">On Website</span>}
            </div>
            {item.pic_name && <p className="text-xs text-muted-foreground">PIC: {item.pic_name}</p>}
            {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
          </div>
        </div>
      )}
    />
  );
}