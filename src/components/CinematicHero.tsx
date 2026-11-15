import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Calendar, ArrowRight, Scissors } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Cached images storage
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const loadedIndicesRef = useRef<Set<number>>(new Set());
  const currentRenderedIndexRef = useRef<number>(-1);

  // Helper to format frame path
  const getFramePath = useCallback(
    (idx: number, mobile: boolean) => {
      const numStr = String(idx + 1).padStart(4, '0');
      const folder = mobile ? 'frames_mobile' : 'frames_desktop';
      return `/moda_barbershop_hero/${folder}/frame_${numStr}.webp`;
    },
    []
  );

  // Detect mobile device / portrait ratio
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || window.innerWidth / window.innerHeight < 0.85;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Preloading system
  useEffect(() => {
    let isCancelled = false;
    loadedIndicesRef.current.clear();
    imagesRef.current = new Array(TOTAL_FRAMES).fill(null);

    // 1. Load First Frame with top priority
    const firstImg = new Image();
    firstImg.src = getFramePath(0, isMobile);
    firstImg.onload = () => {
      if (isCancelled) return;
      imagesRef.current[0] = firstImg;
      loadedIndicesRef.current.add(0);
      drawFrame(0);
    };

    // 2. Load Priority Initial Batch (frames 1–15)
    for (let i = 1; i <= 15; i++) {
      const img = new Image();
      img.src = getFramePath(i, isMobile);
      img.onload = () => {
        if (isCancelled) return;
        imagesRef.current[i] = img;
        loadedIndicesRef.current.add(i);
      };
    }

    // 3. Progressively load the remaining frames in non-blocking batches
    const loadRemaining = async () => {
      const batchSize = 4;
      for (let i = 16; i < TOTAL_FRAMES; i += batchSize) {
        if (isCancelled) break;
        await new Promise((r) => setTimeout(r, 40));

        const batchPromises: Promise<void>[] = [];
        for (let j = i; j < Math.min(i + batchSize, TOTAL_FRAMES); j++) {
          batchPromises.push(
            new Promise((resolve) => {
              const img = new Image();
              img.src = getFramePath(j, isMobile);
              img.onload = () => {
                if (!isCancelled) {
                  imagesRef.current[j] = img;
                  loadedIndicesRef.current.add(j);
                }
                resolve();
              };
              img.onerror = () => resolve();
            })
          );
        }
        await Promise.all(batchPromises);
      }
    };

    const timeout = setTimeout(loadRemaining, 200);

    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, [isMobile, getFramePath]);

  // Find closest loaded frame to avoid any blank flicker
  const getClosestLoadedFrame = useCallback((target: number): HTMLImageElement | null => {
    if (imagesRef.current[target]) return imagesRef.current[target];

    // Search closest loaded frame
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = target - offset;
      if (prev >= 0 && imagesRef.current[prev]) return imagesRef.current[prev];
      const next = target + offset;
      if (next < TOTAL_FRAMES && imagesRef.current[next]) return imagesRef.current[next];
    }
    return imagesRef.current[0] || null;
  }, []);

  // Draw frame to canvas respecting aspect ratio and DPR
  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = getClosestLoadedFrame(index);
      if (!img || !img.naturalWidth || !img.naturalHeight) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const targetW = Math.round(rect.width * dpr);
      const targetH = Math.round(rect.height * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // White background seamlessly matching original video frame background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, rect.width, rect.height);

      if (isMobile) {
        // Mobile vertical frames (608x1080)
        // Maintain contain with generous breathing room so the pole is central and complete
        const scale = Math.min(rect.width / img.naturalWidth, rect.height / img.naturalHeight) * 0.95;
        const dw = img.naturalWidth * scale;
        const dh = img.naturalHeight * scale;
        const dx = (rect.width - dw) / 2;
        const dy = (rect.height - dh) / 2;
        ctx.drawImage(img, dx, dy, dw, dh);
      } else {
        // Desktop landscape frames (1920x1080)
        // Scale to fit viewport with perfect margins
        const scale = Math.min(rect.width / img.naturalWidth, rect.height / img.naturalHeight);
        const dw = img.naturalWidth * scale;
        const dh = img.naturalHeight * scale;
        const dx = (rect.width - dw) / 2;
        const dy = (rect.height - dh) / 2;
        ctx.drawImage(img, dx, dy, dw, dh);
      }

      ctx.restore();
      currentRenderedIndexRef.current = index;
    },
    [isMobile, getClosestLoadedFrame]
  );

  // Resize handler with debounce
  useEffect(() => {
    const handleResize = () => {
      drawFrame(currentRenderedIndexRef.current >= 0 ? currentRenderedIndexRef.current : 0);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame]);

  // GSAP ScrollTrigger Sequence Setup
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        // Static view for reduced motion
        drawFrame(TOTAL_FRAMES - 1);
        if (overlayRef.current) overlayRef.current.style.opacity = '0.85';
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
        end: isMobile ? '+=360%' : '+=440%',
        pin: true,
        anticipatePin: 1,
        scrub: 1.1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          if (onHeroProgressChange) {
            onHeroProgressChange(progress);
          }

          // 1. Scroll Indicator fadeout (0 -> 0.06)
          if (scrollIndicatorRef.current) {
            const indOpacity = Math.max(0, 1 - progress * 16);
            scrollIndicatorRef.current.style.opacity = String(indOpacity);
            scrollIndicatorRef.current.style.pointerEvents = indOpacity <= 0 ? 'none' : 'auto';
          }

          // 2. Zone 1: Frame sequence playback (progress 0 -> 0.80)
          if (progress <= 0.80) {
            const frameRatio = progress / 0.80;
            const targetFrame = Math.min(TOTAL_FRAMES - 1, Math.floor(frameRatio * TOTAL_FRAMES));
            drawFrame(targetFrame);

            // Overlay is transparent during frame rotation
            if (overlayRef.current) {
              overlayRef.current.style.opacity = '0';
            }
            if (brandRevealRef.current) {
              brandRevealRef.current.style.opacity = '0';
              brandRevealRef.current.style.pointerEvents = 'none';
              brandRevealRef.current.style.transform = 'translateY(35px)';
            }
          } else {
            // Ensure last frame is pinned
            drawFrame(TOTAL_FRAMES - 1);

            // 3. Zone 2: Darkening overlay & Brand typography reveal (progress 0.80 -> 0.92)
            const revealProgress = Math.min(1, (progress - 0.80) / 0.12);

            if (overlayRef.current) {
              // Deep espresso vignette overlay fades from 0 to 0.82
              overlayRef.current.style.opacity = String(revealProgress * 0.82);
            }

            if (brandRevealRef.current) {
              brandRevealRef.current.style.opacity = String(revealProgress);
              brandRevealRef.current.style.pointerEvents = revealProgress > 0.6 ? 'auto' : 'none';
              const yOffset = (1 - revealProgress) * 35;
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
      className="relative w-full h-[100dvh] min-h-[100svh] overflow-hidden bg-white select-none"
      style={{ overscrollBehaviorY: 'none' }}
    >
      {/* 2D Canvas Frame Sequence */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        aria-label="Moda Barbershop cinematic rotating pole sequence"
      />

      {/* Darkening Warm Espresso & Charcoal Vignette Overlay (0.80 -> 0.92) */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-b from-[#14100C]/70 via-[#100D0A]/85 to-[#0E0D0B] opacity-0 transition-opacity duration-300 pointer-events-none z-10"
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

      {/* Brand Typography & Action Reveal in End-Zone (0.80 -> 1.00) */}
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
