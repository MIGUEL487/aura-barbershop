import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Calendar, ArrowRight, Scissors } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Ignore mobile URL bar expand/collapse resizes to prevent pin jumps
ScrollTrigger.config({ ignoreMobileResize: true });

const TOTAL_FRAMES = 133;

interface CinematicHeroProps {
  onOpenBooking: () => void;
  onHeroProgressChange?: (progress: number) => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({
  onOpenBooking,
  onHeroProgressChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const brandRevealRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // Synchronously initialize device mode so mobile NEVER loads desktop frames
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  // Separate caches for desktop and mobile - strictly isolated, never mixed
  const desktopImagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const mobileImagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));

  const currentRenderedIndexRef = useRef<number>(-1);

  // Helper to format frame path
  const getFramePath = useCallback((idx: number, mobile: boolean) => {
    const numStr = String(idx + 1).padStart(4, '0');
    const folder = mobile ? 'frames_mobile' : 'frames_desktop';
    return `/moda_barbershop_hero/${folder}/frame_${numStr}.webp`;
  }, []);

  // Monitor viewport size and orientation changes
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Preloading system for current mode (desktop or mobile)
  useEffect(() => {
    let isCancelled = false;
    const targetCache = isMobile ? mobileImagesRef.current : desktopImagesRef.current;

    // 1. Load First Frame with immediate priority
    if (!targetCache[0]) {
      const firstImg = new Image();
      firstImg.src = getFramePath(0, isMobile);
      firstImg.onload = () => {
        if (isCancelled) return;
        targetCache[0] = firstImg;
        drawFrame(currentRenderedIndexRef.current >= 0 ? currentRenderedIndexRef.current : 0);
      };
    } else {
      drawFrame(currentRenderedIndexRef.current >= 0 ? currentRenderedIndexRef.current : 0);
    }

    // 2. Load Priority Initial Batch (frames 1–20)
    for (let i = 1; i <= 20; i++) {
      if (!targetCache[i]) {
        const img = new Image();
        img.src = getFramePath(i, isMobile);
        img.onload = () => {
          if (!isCancelled) {
            targetCache[i] = img;
          }
        };
      }
    }

    // 3. Progressively load the remaining frames in non-blocking batches
    const loadRemaining = async () => {
      const batchSize = 6;
      for (let i = 21; i < TOTAL_FRAMES; i += batchSize) {
        if (isCancelled) break;
        await new Promise((r) => setTimeout(r, 30));

        const batchPromises: Promise<void>[] = [];
        for (let j = i; j < Math.min(i + batchSize, TOTAL_FRAMES); j++) {
          if (!targetCache[j]) {
            batchPromises.push(
              new Promise((resolve) => {
                const img = new Image();
                img.src = getFramePath(j, isMobile);
                img.onload = () => {
                  if (!isCancelled) {
                    targetCache[j] = img;
                  }
                  resolve();
                };
                img.onerror = () => resolve();
              })
            );
          }
        }
        await Promise.all(batchPromises);
      }
    };

    const timeout = setTimeout(loadRemaining, 150);

    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, [isMobile, getFramePath]);

  // Find closest loaded frame in the active cache to prevent blank flicker
  const getClosestLoadedFrame = useCallback(
    (target: number, mobile: boolean): HTMLImageElement | null => {
      const cache = mobile ? mobileImagesRef.current : desktopImagesRef.current;
      const targetImg = cache[target];
      if (targetImg && targetImg.complete && targetImg.naturalWidth > 0) {
        return targetImg;
      }

      // Search closest loaded neighbor
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = target - offset;
        if (prev >= 0 && cache[prev] && cache[prev]!.complete && cache[prev]!.naturalWidth > 0) {
          return cache[prev];
        }
        const next = target + offset;
        if (next < TOTAL_FRAMES && cache[next] && cache[next]!.complete && cache[next]!.naturalWidth > 0) {
          return cache[next];
        }
      }
      return (cache[0] && cache[0].complete && cache[0].naturalWidth > 0) ? cache[0] : null;
    },
    []
  );

  // Exact contain logic without DPR duplication
  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const currentMobile = window.innerWidth < 768;
      const img = getClosestLoadedFrame(index, currentMobile);
      if (!img || !img.naturalWidth || !img.naturalHeight) return;

      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      // Adapt canvas to display size & Device Pixel Ratio
      const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2.5));
      const targetWidth = Math.round(rect.width * dpr);
      const targetHeight = Math.round(rect.height * dpr);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      // Official contain scale formula in canvas pixel space:
      // scale = min(canvas.width / image.width, canvas.height / image.height)
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;

      const scale = Math.min(
        canvas.width / imgWidth,
        canvas.height / imgHeight
      );

      const renderWidth = imgWidth * scale;
      const renderHeight = imgHeight * scale;

      // Perfectly center horizontally and vertically
      const x = (canvas.width - renderWidth) / 2;
      const y = (canvas.height - renderHeight) / 2;

      // White background seamlessly matching original video frame background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the frame without crop, distortion, or scale duplication
      ctx.drawImage(img, x, y, renderWidth, renderHeight);

      currentRenderedIndexRef.current = index;
    },
    [getClosestLoadedFrame]
  );

  // Window resize & orientation redrawing
  useEffect(() => {
    const handleResizeRedraw = () => {
      drawFrame(currentRenderedIndexRef.current >= 0 ? currentRenderedIndexRef.current : 0);
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResizeRedraw);
    window.addEventListener('orientationchange', handleResizeRedraw);
    return () => {
      window.removeEventListener('resize', handleResizeRedraw);
      window.removeEventListener('orientationchange', handleResizeRedraw);
    };
  }, [drawFrame]);

  // GSAP ScrollTrigger Sequence Setup
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        drawFrame(TOTAL_FRAMES - 1);
        if (overlayRef.current) overlayRef.current.style.opacity = '0.88';
        if (brandRevealRef.current) {
          brandRevealRef.current.style.opacity = '1';
          brandRevealRef.current.style.pointerEvents = 'auto';
        }
        if (onHeroProgressChange) onHeroProgressChange(1);
        return;
      }

      const st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: isMobile ? '+=380%' : '+=460%',
        pin: true,
        anticipatePin: 1,
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          if (onHeroProgressChange) {
            onHeroProgressChange(progress);
          }

          // 1. Scroll Indicator fadeout (0.00 -> 0.05)
          if (scrollIndicatorRef.current) {
            const indOpacity = Math.max(0, 1 - progress * 20);
            scrollIndicatorRef.current.style.opacity = String(indOpacity);
            scrollIndicatorRef.current.style.pointerEvents = indOpacity <= 0 ? 'none' : 'auto';
          }

          // 2. Zone 1: Frame sequence playback (progress 0.00 -> 0.75)
          // 133 frames distributed across 0.00 to 0.75
          if (progress <= 0.75) {
            const frameRatio = progress / 0.75;
            const targetFrame = Math.min(TOTAL_FRAMES - 1, Math.floor(frameRatio * TOTAL_FRAMES));
            drawFrame(targetFrame);

            // Overlay & brand remain hidden during pole rotation
            if (overlayRef.current) {
              overlayRef.current.style.opacity = '0';
            }
            if (brandRevealRef.current) {
              brandRevealRef.current.style.opacity = '0';
              brandRevealRef.current.style.pointerEvents = 'none';
              brandRevealRef.current.style.transform = 'translateY(30px)';
            }
          } else {
            // Keep final frame (132) firmly pinned
            drawFrame(TOTAL_FRAMES - 1);

            // 3. Zone 2: Smooth darkening overlay & Brand typography reveal (progress 0.75 -> 0.90)
            const revealProgress = Math.min(1, Math.max(0, (progress - 0.75) / 0.15));

            if (overlayRef.current) {
              // Deep warm espresso vignette overlay fades from 0.0 to 0.88
              overlayRef.current.style.opacity = String(revealProgress * 0.88);
            }

            if (brandRevealRef.current) {
              brandRevealRef.current.style.opacity = String(revealProgress);
              brandRevealRef.current.style.pointerEvents = revealProgress > 0.6 ? 'auto' : 'none';
              const yOffset = (1 - revealProgress) * 30;
              brandRevealRef.current.style.transform = `translateY(${yOffset}px)`;
            }
          }
        },
      });

      return () => {
        st.kill();
      };
    },
    { dependencies: [isMobile, drawFrame, onHeroProgressChange], scope: containerRef }
  );

  return (
    <section
      id="top"
      ref={containerRef}
      className="relative w-full h-[100dvh] min-h-[100dvh] overflow-hidden bg-white select-none"
      style={{ overscrollBehaviorY: 'none' }}
    >
      {/* 2D Canvas Frame Sequence - Pure block canvas taking 100% of container */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none"
        aria-label="Moda Barbershop cinematic rotating pole sequence"
      />

      {/* Darkening Warm Espresso & Charcoal Vignette Overlay (0.75 -> 0.90) */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-b from-[#14100C]/75 via-[#100D0A]/90 to-[#0E0D0B] opacity-0 transition-opacity duration-300 pointer-events-none z-10"
      />

      {/* Subtle Hairline Frame Border */}
      <div className="absolute inset-0 border border-border/20 pointer-events-none z-10" />

      {/* Initial Scroll Prompt (Fades out when scrolling begins) */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 inset-x-0 z-20 flex flex-col items-center justify-center text-center pointer-events-none transition-opacity duration-500"
      >
        <span className="text-[11px] font-mono tracking-widest text-[#241C15]/70 uppercase font-bold mb-2">
          Scroll to explore craft
        </span>
        <div className="w-6 h-9 rounded-full border-2 border-[#241C15]/40 flex items-start justify-center p-1 shadow-sm bg-white/40 backdrop-blur-sm">
          <div className="w-1.5 h-2 rounded-full bg-[#B89A5C] animate-bounce" />
        </div>
      </div>

      {/* Brand Typography & Action Reveal in End-Zone (0.75 -> 1.00) */}
      <div
        ref={brandRevealRef}
        className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 sm:px-12 text-center opacity-0 pointer-events-none transition-all duration-300"
      >
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          {/* Atelier Eyebrow Chip */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-[#161310]/90 backdrop-blur-md mb-6 shadow-xl">
            <Scissors className="w-3.5 h-3.5 text-primary -rotate-45" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-primary">
              Moda Barbershop • Est. 2026
            </span>
          </div>

          {/* Master Editorial Serif Headline */}
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl tracking-tight uppercase text-foreground leading-[0.92] mb-5">
            <span className="block drop-shadow-md">MODA</span>
            <span className="block text-3xl sm:text-4xl md:text-5xl font-sans tracking-[0.2em] font-normal text-muted-foreground mt-2">
              BARBERSHOP
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-primary/95 mb-6 max-w-xl">
            Timeless Craft. Modern Ritual.
          </p>

          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mb-9 leading-relaxed font-normal">
            Bespoke scissor tailoring, straight-razor hot towel sculpting, and absolute calendar punctuality in a quiet, unhurried Pinheiros sanctuary.
          </p>

          {/* CTAs in Brushed Gold & Ivory Glass */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:bg-[#CDB173] active:scale-[0.98] transition-all glow-gold shadow-2xl"
            >
              <Calendar className="w-5 h-5 text-primary-foreground" />
              <span>Book Appointment</span>
              <ArrowRight className="w-4 h-4 text-primary-foreground" />
            </button>

            <a
              href="#craft"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-border hover:border-primary/60 bg-[#181512]/80 hover:bg-[#201C18] text-foreground font-semibold text-base transition-all"
            >
              <span>Explore The Craft</span>
              <span className="text-primary">↓</span>
            </a>
          </div>

          {/* Metadata Ticker Row */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 mt-10 pt-6 border-t border-border/40 text-[11px] font-mono tracking-wider text-muted-foreground/80 uppercase">
            <span>Pinheiros Atelier</span>
            <span>•</span>
            <span>Zero Wait Policy</span>
            <span>•</span>
            <span>Dedicated Chair</span>
          </div>
        </div>
      </div>
    </section>
  );
};
