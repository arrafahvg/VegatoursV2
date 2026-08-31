import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Star, ArrowRight, AlertCircle } from 'lucide-react';
import { useSiteSettings } from '@/lib/hooks/useSiteSettings';
import { useLang } from '@/lib/i18n';
import PriceDisplay from '@/components/PriceDisplay';
import MarkdownView from '@/components/MarkdownView';

export default function PackageDetailModal({ pkg, open, onClose }) {
    const { t, lang } = useLang();
  const { getWhatsappMessageUrl } = useSiteSettings();
  if (!pkg) return null;

  const isId = lang === 'id';
  const title = isId && pkg.title_id ? pkg.title_id : pkg.title_en;
  const duration = isId && pkg.duration_id ? pkg.duration_id : pkg.duration_en;
  const highlights = isId && pkg.highlights_id?.length ? pkg.highlights_id : (pkg.highlights_en || []);
  const description = isId && pkg.description_id ? pkg.description_id : pkg.description_en;
  const ctaText = isId && pkg.cta_text_id ? pkg.cta_text_id : (pkg.cta_text_en || t('packages.bookCta'));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <DialogTitle className="font-serif text-xl font-medium">{title}</DialogTitle>
            {pkg.is_popular && (
              <Badge className="bg-primary text-primary-foreground border-0 rounded-full px-2 py-0.5 text-xs">
                <Star className="w-3 h-3 mr-1" /> {t('packages.popular')}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {pkg.image_url && (
          <img src={pkg.image_url} alt={title} className="w-full h-44 object-cover rounded-xl" />
        )}

        <div className="space-y-5">
          {/* Price & Duration */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">{t('packages.startingFrom')}</p>
              <PriceDisplay price={pkg.price} priceMax={pkg.price_max} priceDiscount={pkg.price_discount} className="text-2xl" />
            </div>
            {duration && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground mt-5">
                <Clock className="w-3.5 h-3.5" /> {duration}
              </span>
            )}
          </div>

          {/* Description */}
          {description && (
            <MarkdownView>{description}</MarkdownView>
          )}

          {/* Highlights */}
          {highlights.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
                {isId ? 'Destinasi:' : 'Highlights:'}
              </p>
              <div className="space-y-1.5">
                {highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <a
            href={getWhatsappMessageUrl(`Hi! I'm interested in the ${pkg.title_en} package.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
            onClick={onClose}
          >
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
              {ctaText}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>

          {/* Disclaimer */}
          <div className="flex items-start gap-1.5 pt-1 border-t border-border/50">
            <AlertCircle className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground italic">
              {isId
                ? '* Harga dapat berubah sewaktu-waktu.'
                : '* Pricing is subject to change at any time.'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}