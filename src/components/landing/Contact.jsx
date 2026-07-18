import React, { useState } from 'react';
import { useLang } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { WHATSAPP_URL, WHATSAPP_MESSAGE_URL } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, Mail, CheckCircle } from 'lucide-react';

export default function Contact() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: '', email: '', dates: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from('inquiries')
      .insert({
        name: form.name,
        email: form.email,
        travel_dates: form.dates,
        message: form.message,
        status: 'new'
      });
    if (error) throw error;
    setLoading(false);
    setSubmitted(true);
    // Also open WhatsApp
    const msg = `Hi! I'm ${form.name}.\nTravel dates: ${form.dates}\nEmail: ${form.email}\n\n${form.message}`;
    window.open(WHATSAPP_MESSAGE_URL(msg), '_blank');
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground">{t('contact.title')}</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">{t('contact.subtitle')}</p>
            <div className="mt-4 w-16 h-px bg-primary mx-auto" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            {submitted ?
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-serif text-2xl font-light text-foreground">Thank you!</h3>
                <p className="text-muted-foreground">Your inquiry has been received. We'll be in touch soon via WhatsApp.</p>
                <Button variant="outline" className="rounded-full mt-2" onClick={() => {setSubmitted(false);setForm({ name: '', email: '', dates: '', message: '' });}}>
                  Send Another Inquiry
                </Button>
              </div> :

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  placeholder={t('contact.form.name')}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="bg-card border-border/50 rounded-xl pl-4 py-6"
                  required />
                
              </div>
              <div className="relative">
                <Input
                  type="email"
                  placeholder={t('contact.form.email')}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="bg-card border-border/50 rounded-xl pl-4 py-6"
                  required />
                
              </div>
              <div className="relative">
                <Input
                  placeholder={t('contact.form.dates')}
                  value={form.dates}
                  onChange={(e) => setForm({ ...form, dates: e.target.value })}
                  className="bg-card border-border/50 rounded-xl pl-4 py-6" />
                
              </div>
              <Textarea
                placeholder={t('contact.form.message')}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="bg-card border-border/50 rounded-xl min-h-[120px] resize-none"
                required />
              
              <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full py-6 text-base font-medium">
                <Send className="w-4 h-4 mr-2" />
                {loading ? 'Sending...' : t('contact.form.send')}
              </Button>
            </form>
            }
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center gap-6">
            
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <MessageCircle className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-light text-foreground">
                {t('contact.whatsappCta')}
              </h3>
              <p className="text-muted-foreground max-w-sm leading-relaxed">
                {t('contact.subtitle')}
              </p>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full py-6 text-base font-medium px-10 my-3">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {t('contact.whatsappCta')}
                </Button>
              </a>

            </div>
          </motion.div>
        </div>
      </div>
    </section>);

}