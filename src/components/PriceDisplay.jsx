import React from 'react';
import { formatPrice, formatPriceRange, hasPriceDiscount } from '@/lib/utils';
import { cn } from '@/lib/utils';

// Renders a price as either: a range ("Rp420,000,- – Rp820,000,-"),
// a single price with strikethrough discount (~~Rp1,500,000,-~~ Rp1,200,000,-),
// or a plain single price.
export default function PriceDisplay({ price, priceMax, priceDiscount, className }) {
  if (price === null || price === undefined || price === '') return null;
  return (
    <p className={cn('font-semibold text-foreground', className)}>
      {priceMax ? (
        <>
          {formatPriceRange(price, priceMax)}
          <sup className="text-[10px] text-muted-foreground font-normal align-super ml-0.5">*</sup>
        </>
      ) : hasPriceDiscount(price, priceDiscount, priceMax) ? (
        <>
          <span className="line-through text-muted-foreground font-normal mr-2">{formatPrice(price)}</span>
          <span className="text-primary">{formatPrice(priceDiscount)}</span>
          <sup className="text-[10px] text-muted-foreground font-normal align-super ml-0.5">*</sup>
        </>
      ) : (
        <>
          {formatPrice(price)}
          <sup className="text-[10px] text-muted-foreground font-normal align-super ml-0.5">*</sup>
        </>
      )}
    </p>
  );
}