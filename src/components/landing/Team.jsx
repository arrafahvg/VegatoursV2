import React from 'react';
import { useLang } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export default function Team() {
  const { t, lang } = useLang();
  const { data: members, isLoading } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    initialData: []
  });

  return (
    <section className="lg:py-28 bg-card py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">{t('team.subtitle')}</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground">{t('team.title')}</h2>
            <div className="mt-4 w-16 h-px bg-primary mx-auto" />
          </motion.div>
        </div>

        {isLoading ?
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[1, 2].map((i) =>
          <div key={i} className="text-center">
                <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-32 mx-auto mb-2" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
          )}
          </div> :

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {members.map((member, i) => {
            const role = lang === 'id' && member.role_id ? member.role_id : member.role_en;
            const bio = lang === 'id' && member.bio_id ? member.bio_id : member.bio_en;

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group">
                
                  <div className="relative w-36 h-36 mx-auto mb-6 rounded-full overflow-hidden border-4 border-background shadow-lg">
                    {member.photo_url ?
                  <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" /> :

                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <span className="font-serif text-3xl text-primary">{member.name?.[0]}</span>
                      </div>
                  }
                  </div>
                  <h3 className="font-serif text-xl font-medium text-foreground">{member.name}</h3>
                  <p className="text-primary text-sm font-medium mt-1 mb-3">{role}</p>
                  {bio && <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">{bio}</p>}
                </motion.div>);

          })}
          </div>
        }
      </div>
    </section>);

}