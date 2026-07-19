import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, AlertCircle, Bike } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { WHATSAPP_MESSAGE_URL } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export default function BikeDetailModal({ bike, open, onClose }) {
  const { lang } = useLang();
  if (!bike) return null;

  const isId = lang === 'id';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-medium">{bike.name}</DialogTitle>
          {bike.type && (
            <p className="text-xs font-semibold text-primary tracking-widest uppercase">{bike.type}</p>
          )}
        </DialogHeader>

        {bike.image_url && (
          <img src={bike.image_url} alt={bike.name} className="w-full h-44 object-cover rounded-xl" />
        )}

        <div className="space-y-5">
          {/* Price */}
          {bike.price && (
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {bike.price}
                <sup className="text-[10px] text-muted-foreground font-normal align-super ml-0.5">*</sup>
              </p>
              {bike.capacity && (
                <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <Bike className="w-3.5 h-3.5" /> {bike.capacity}
                </p>
              )}
            </div>
          )}

          {/* Includes */}
          {(() => {
            const items = isId && bike.includes_id?.length ? bike.includes_id : bike.includes_en;
            return items?.length > 0 ? (
              <div>
                <p className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
                  {isId ? 'Termasuk:' : 'Included:'}
                </p>
                <div className="space-y-1.5">
                  {items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null;
          })()}

          {/* Terms */}
          {(() => {
            const items = isId && bike.terms_id?.length ? bike.terms_id : bike.terms_en;
            return items?.length > 0 ? (
              <div>
                <p className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
                  {isId ? 'Ketentuan:' : 'Terms & Conditions:'}
                </p>
                <div className="space-y-1.5">
                  {items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary flex-shrink-0 mt-0.5">▪</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null;
          })()}

          {/* Features */}
          {bike.features?.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
                {isId ? 'Fasilitas:' : 'Features:'}
              </p>
              <div className="space-y-1.5">
                {bike.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price note */}
          {bike.price_note && (
            <div className="pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground">{bike.price_note}</p>
            </div>
          )}

          {/* Rent Now CTA */}
          <a
            href={WHATSAPP_MESSAGE_URL(`Hi! I'm interested in renting the ${bike.name} (${bike.type || ''}).`)}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
              {isId ? 'Sewa Sekarang' : 'Rent Now'}
            </Button>
          </a>

          {/* Disclaimer */}
          <div className="flex items-start gap-1.5 pt-2 border-t border-border/50">
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