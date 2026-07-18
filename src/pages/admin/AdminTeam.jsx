import React from 'react';
import EntityManager from '@/components/admin/EntityManager';

const fields = [
  { key: 'name', label: 'Name', type: 'text', placeholder: 'Full name' },
  { key: 'role_en', label: 'Role (English)', type: 'text', placeholder: 'e.g. Travel Facilitator' },
  { key: 'role_id', label: 'Role (Bahasa Indonesia)', type: 'text', placeholder: 'e.g. Fasilitator Perjalanan' },
  { key: 'bio_en', label: 'Bio (English)', type: 'textarea' },
  { key: 'bio_id', label: 'Bio (Bahasa Indonesia)', type: 'textarea' },
  { key: 'photo_url', label: 'Photo', type: 'image' },
  { key: 'sort_order', label: 'Sort Order', type: 'number' },
];

export default function AdminTeam() {
  return (
    <EntityManager
      entityName="TeamMember"
      queryKey="teamMembers"
      fields={fields}
      renderCard={(item) => (
        <div className="flex items-center gap-3">
          {item.photo_url ? (
            <img src={item.photo_url} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-semibold">{item.name?.[0]}</span>
            </div>
          )}
          <div>
            <p className="font-medium text-foreground">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.role_en}</p>
          </div>
        </div>
      )}
    />
  );
}