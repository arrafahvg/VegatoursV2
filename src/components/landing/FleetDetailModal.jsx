import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, Users, AlertCircle } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export default function FleetDetailModal({ vehicle, open, onClose }) {
  const { lang } = useLang();
  if (!vehicle) return null;

  const isId = lang === 'id';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-medium">{vehicle.name}</DialogTitle>
          {vehicle.type && (
            <p className="text-xs font-semibold text-primary tracking-widest uppercase">{vehicle.type}</p>
          )}
        </DialogHeader>

        {vehicle.image_url && (
          <img src={vehicle.image_url} alt={vehicle.name} className="w-full h-44 object-cover rounded-xl" />
        )}

        <div className="space-y-5">
          {/* Price */}
          {vehicle.price && (
            <div>
              <p className="text-2xl font-semibold text-foreground">
                {vehicle.price}
                <sup className="text-[10px] text-muted-foreground font-normal align-super ml-0.5">*</sup>
              </p>
              {vehicle.capacity && (
                <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <Users className="w-3.5 h-3.5" /> {vehicle.capacity} {isId ? 'penumpang' : 'pax'}
                </p>
              )}
            </div>
          )}

          {/* Includes */}
          {(() => {
            const items = isId && vehicle.includes_id?.length ? vehicle.includes_id : vehicle.includes_en;
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
            const items = isId && vehicle.terms_id?.length ? vehicle.terms_id : vehicle.terms_en;
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
          {vehicle.features?.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
                {isId ? 'Fasilitas:' : 'Features:'}
              </p>
              <div className="space-y-1.5">
                {vehicle.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price note */}
          {vehicle.price_note && (
            <div className="pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground">{vehicle.price_note}</p>
            </div>
          )}

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