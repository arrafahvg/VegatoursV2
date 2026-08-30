import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Maximize2, ZoomIn, ZoomOut, RotateCw, X } from 'lucide-react';

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

/**
 * Clickable, accessible image thumbnail that opens a lightbox Dialog.
 * Inside the lightbox the image can be zoomed (click or toolbar), panned
 * (click-drag) and rotated — no extra dependencies required.
 *
 * Props:
 *  - src: image url
 *  - alt: accessible label (also used as the button aria-label)
 *  - imgClassName: extra classes applied to the <img> (e.g. hover-zoom)
 *  - className: extra classes applied to the thumbnail wrapper button
 *  - overlayZoom: show a small zoom icon over the thumbnail (default true)
 */
export default function ImageViewer({ src, alt = '', imgClassName, className, overlayZoom = true }) {
  const [open, setOpen] = useState(false);

  // lightbox view state
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [natural, setNatural] = useState(null); // { w, h } of the image
  const [container, setContainer] = useState({ w: 0, h: 0 });

  const dragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const moved = useRef(false);
  const containerRef = useRef(null);

  const openDialog = () => {
    setScale(1);
    setPos({ x: 0, y: 0 });
    setRotation(0);
    setOpen(true);
  };

  // Measure the lightbox viewport once it's mounted so we can clamp panning.
  useEffect(() => {
    if (open && containerRef.current) {
      setContainer({ w: containerRef.current.offsetWidth, h: containerRef.current.offsetHeight });
    }
  }, [open]);

  const onImgLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setNatural({ w: naturalWidth, h: naturalHeight });
  };

  // Max pan allowed for the current zoom level (so edges can't be dragged into
  // empty space). Falls back to null when dimensions aren't known yet.
  const boundsFor = (s) => {
    if (!natural || !container.w) return null;
    const r = Math.min(container.w / natural.w, container.h / natural.h);
    const baseW = natural.w * r;
    const baseH = natural.h * r;
    const curW = baseW * s;
    const curH = baseH * s;
    return {
      maxX: Math.max(0, (curW - container.w) / 2),
      maxY: Math.max(0, (curH - container.h) / 2),
    };
  };

  const startDrag = (e) => {
    if (scale <= 1) return;
    e.preventDefault();
    dragging.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    moved.current = false;
  };

  const onDrag = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    startPos.current = { x: e.clientX, y: e.clientY };
    if (Math.hypot(dx, dy) > 8) moved.current = true;
    const b = boundsFor(scale);
    if (b) {
      setPos((p) => ({
        x: clamp(p.x + dx, -b.maxX, b.maxX),
        y: clamp(p.y + dy, -b.maxY, b.maxY),
      }));
    } else {
      setPos((p) => ({ x: p.x + dx, y: p.y + dy }));
    }
  };

  const stopDrag = () => {
    dragging.current = false;
  };

  // Click on the image = toggle zoom (click vs. drag distinguished via `moved`).
  const onClickImg = () => {
    if (moved.current) {
      moved.current = false;
      return;
    }
    if (scale <= 1) setScale(2);
    else setScale(1);
    setPos({ x: 0, y: 0 });
  };

  const zoomIn = () => setScale((s) => Math.min(s + 0.5, 4));
  const zoomOut = () => setScale((s) => Math.max(s - 0.5, 1));
  const fit = () => { setScale(1); setPos({ x: 0, y: 0 }); setRotation(0); };
  const rotate = () => setRotation((r) => r + 90);

  const imgStyle = {
    transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale}) rotate(${rotation}deg)`,
    transformOrigin: 'center',
  };

  return (
    <>
      {/* Thumbnail / trigger — the whole image is clickable */}
      <button
        type="button"
        aria-label={alt || 'View image'}
        onClick={openDialog}
        className={cn(
          'group relative block h-full w-full cursor-zoom-in bg-transparent border-0 p-0 text-left',
          'overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          className
        )}
      >
        <img
          src={src}
          alt=""
          loading="lazy"
          draggable={false}
          onLoad={onImgLoad}
          className={cn('block h-full w-full object-cover', imgClassName)}
        />
        {overlayZoom && (
          <Maximize2 className="absolute bottom-2 right-2 h-4 w-4 text-white/70 opacity-60 group-hover:opacity-100" />
        )}
      </button>

      {/* Lightbox */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(
            'fixed left-1/2 top-1/2 z-50 grid w-[90vw] max-w-6xl -translate-x-1/2 -translate-y-1/2',
            'gap-0 border-0 bg-transparent p-0 shadow-none sm:rounded-none',
            'data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          )}
        >
          {/* Prominent close affordance (a built-in X exists too; this one stays
              visible over any image background via high z-index). */}
          <DialogClose asChild>
            <button
              type="button"
              className="fixed top-4 right-4 z-[60] rounded-full bg-white/15 p-2 text-white hover:bg-white/25"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogClose>

          <div
            ref={containerRef}
            className="relative flex h-[80vh] w-full items-center justify-center overflow-hidden"
            style={{ cursor: scale > 1 ? (dragging.current ? 'grabbing' : 'grab') : 'zoom-in' }}
            onMouseDown={startDrag}
            onMouseMove={onDrag}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
          >
            <img
              src={src}
              alt={alt}
              draggable={false}
              onLoad={onImgLoad}
              onClick={onClickImg}
              style={imgStyle}
              className="max-h-full max-w-full object-contain transition-transform duration-200"
            />
          </div>

          {/* Toolbar */}
          <div className="absolute bottom-6 left-1/2 z-40 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1.5 text-white">
            <button
              type="button"
              onClick={zoomOut}
              disabled={scale <= 1}
              className="rounded-full p-1.5 hover:bg-white/20 disabled:opacity-40"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={zoomIn}
              disabled={scale >= 4}
              className="rounded-full p-1.5 hover:bg-white/20 disabled:opacity-40"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <div className="mx-1 h-4 w-px bg-white/30" />
            <button
              type="button"
              onClick={rotate}
              className="rounded-full p-1.5 hover:bg-white/20"
              aria-label="Rotate"
            >
              <RotateCw className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={fit}
              disabled={scale === 1 && rotation === 0}
              className="rounded-full p-1.5 text-xs font-medium hover:bg-white/20 disabled:opacity-40"
              aria-label="Fit to screen"
            >
              Fit
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}