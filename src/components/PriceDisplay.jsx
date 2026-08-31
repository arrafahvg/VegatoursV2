import React from 'react';
import { formatPrice, hasPriceDiscount } from '@/lib/utils';
import { cn } from '@/lib/utils';

// Renders a price as either:
//   - a range:  From Rp420,000,- / to Rp820,000,-
//   - a single price with strikethrough discount: ~~Rp1,500,000,-~~ Rp1,200,000,-
//   - a plain single price: Rp1,500,000,-
export default function PriceDisplay({ price, priceMax, priceDiscount, className }) {
  if (price === null || price === undefined || price === '') return null;
  const isRange = priceMax
    && priceMax !== ''
    && !Number.isNaN(Number(priceMax))
    && !Number.isNaN(Number(price))
    && Number(priceMax) > Number(price);

  return (
    <div className={cn('font-semibold text-foreground', className)}>
      {isRange ? (
        <>
          <span className="block">From {formatPrice(price)}</span>
          <span className="block text-muted-foreground font-medium">to&nbsp;{formatPrice(priceMax)}</span>
        </>
      ) : hasPriceDiscount(price, priceDiscount, priceMax) ? (
        <>
          <span className="line-through text-muted-foreground font-normal mr-2">{formatPrice(price)}</span>
          <span className="text-primary">{formatPrice(priceDiscount)}</span>
        </>
      ) : (
        <>{formatPrice(price)}</>
      )}
    </div>
  );
}