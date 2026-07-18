import React from 'react';
import { useLang } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FAQs() {
  const { t, lang } = useLang();
  const { data: faqs } = useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    initialData: [],
  });

  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="py-20 lg:py-28 bg-card">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">{t('faq.subtitle')}</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground">{t('faq.title')}</h2>
            <div className="mt-4 w-16 h-px bg-primary mx-auto" />
          </motion.div>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => {
            const question = lang === 'id' && faq.question_id ? faq.question_id : faq.question_en;
            const answer = lang === 'id' && faq.answer_id ? faq.answer_id : faq.answer_en;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <AccordionItem value={faq.id} className="border border-border/50 rounded-xl px-6 bg-background">
                  <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-5">
                    {question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}