import React, { useState, useEffect } from 'react';
import { useLang } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Testimonials() {
  const { t } = useLang();
  const { data: testimonials } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    initialData: [],
  });

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  const prev = () => setCurrent(c => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent(c => (c + 1) % testimonials.length);

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">{t('testimonials.subtitle')}</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground">{t('testimonials.title')}</h2>
            <div className="mt-4 w-16 h-px bg-primary mx-auto" />
          </motion.div>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <Quote className="w-10 h-10 text-primary/30 mx-auto mb-6" />
              <blockquote className="font-serif text-xl sm:text-2xl lg:text-3xl font-light text-foreground leading-relaxed italic mb-8">
                "{testimonials[current].quote}"
              </blockquote>
              <div className="flex items-center justify-center gap-2 mb-2">
                {Array.from({ length: testimonials[current].rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <div className="flex items-center justify-center gap-3">
                {testimonials[current].author_photo && (
                  <img src={testimonials[current].author_photo} alt={testimonials[current].author_name} className="w-10 h-10 rounded-full object-cover" />
                )}
                <div>
                  <p className="font-semibold text-foreground">{testimonials[current].author_name}</p>
                  {testimonials[current].author_location && (
                    <p className="text-sm text-muted-foreground">{testimonials[current].author_location}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-10">
            <Button variant="outline" size="icon" onClick={prev} className="rounded-full w-10 h-10 border-border">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-primary' : 'bg-border'}`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={next} className="rounded-full w-10 h-10 border-border">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}