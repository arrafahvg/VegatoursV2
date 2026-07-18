import React from 'react';
import EntityManager from '@/components/admin/EntityManager';

const fields = [
  { key: 'question_en', label: 'Question (English)', type: 'text', placeholder: 'Enter the question' },
  { key: 'question_id', label: 'Question (Bahasa Indonesia)', type: 'text', placeholder: 'Masukkan pertanyaan' },
  { key: 'answer_en', label: 'Answer (English)', type: 'textarea', placeholder: 'Enter the answer' },
  { key: 'answer_id', label: 'Answer (Bahasa Indonesia)', type: 'textarea', placeholder: 'Masukkan jawaban' },
  { key: 'sort_order', label: 'Sort Order', type: 'number' },
];

export default function AdminFAQ() {
  return (
    <EntityManager
      entityName="FAQ"
      queryKey="faqs"
      fields={fields}
      renderCard={(item) => (
        <div>
          <p className="font-medium text-foreground text-sm">{item.question_en}</p>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{item.answer_en}</p>
        </div>
      )}
    />
  );
}