import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Prevent mobile URL bar expand/collapse resizes from causing pin jumps
ScrollTrigger.config({ ignoreMobileResize: true });

const TOTAL_FRAMES = 133;

interface CinematicHeroProps {
  onOpenBooking?: () => void;
  onHeroComplete?: (completed: boolean) => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({
  onHeroComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const brandRevealRef = useRef<HTMLDivElement>(null);

  // Synchronously initialize device mode to strictly isolate mobile vs desktop sets
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  // Strict separate image caches in memory (no DOM elements created per frame)
  const desktopImagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const mobileImagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));

  // Render tracking to throttle draws to display refresh and avoid redundant renders
  const currentRenderedIndexRef = useRef<number>(-1);
  const requestedFrameRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const isCompletedRef = useRef<boolean>(false);

  // Helper to format frame path
  const getFramePath = useCallback((idx: number, mobile: boolean) => {
    const numStr = String(idx + 1).padStart(4, '0');
    const folder = mobile ? 'frames_mobile' : 'frames_desktop';
    return `/moda_barbershop_hero/${folder}/frame_${numStr}.webp`;
  }, []);

  // Monitor resize & orientation changes
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

  // Find closest loaded frame in active cache to prevent blank flicker
  const getClosestLoadedFrame = useCallback(
    (target: number, mobile: boolean): HTMLImageElement | null => {
      const cache = mobile ? mobileImagesRef.current : desktopImagesRef.current;
      const targetImg = cache[target];
      if (targetImg && targetImg.complete && targetImg.naturalWidth > 0) {
        return targetImg;
      }

      // Search closest loaded neighbor (backward first, then forward)
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

  // Exact contain logic matching original frame ratio, centered with DPR compensation
  const renderFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      const currentMobile = window.innerWidth < 768;
      const img = getClosestLoadedFrame(index, currentMobile);
      if (!img || !img.naturalWidth || !img.naturalHeight) return;

      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      // Limit devicePixelRatio to max 2 to prevent GPU memory saturation on high-density devices
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetWidth = Math.round(rect.width * dpr);
      const targetHeight = Math.round(rect.height * dpr);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;

      // Contain scaling logic: keeps the full pole completely visible without distortion
      const scale = Math.min(
        canvas.width / imgWidth,
        canvas.height / imgHeight
      );

      const renderWidth = imgWidth * scale;
      const renderHeight = imgHeight * scale;

      // Perfectly center on canvas
      const x = (canvas.width - renderWidth) / 2;
      const y = (canvas.height - renderHeight) / 2;

      // Seamlessly fill canvas background matching frame background (#E9E8E4)
      ctx.fillStyle = '#E9E8E4';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, x, y, renderWidth, renderHeight);

      currentRenderedIndexRef.current = index;
    },
    [getClosestLoadedFrame]
  );

  // Throttled draw using requestAnimationFrame for smooth 60 FPS
  const scheduleRender = useCallback(
    (index: number) => {
      requestedFrameRef.current = index;
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = null;
          renderFrame(requestedFrameRef.current);
        });
      }
    },
    [renderFrame]
  );

  // Non-blocking prioritized preloading with off-thread image decoding
  useEffect(() => {
    let isCancelled = false;
    const targetCache = isMobile ? mobileImagesRef.current : desktopImagesRef.current;

    const loadSingleImage = (idx: number): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        if (targetCache[idx]) {
          resolve(targetCache[idx]!);
          return;
        }
        const img = new Image();
        img.src = getFramePath(idx, isMobile);
        img.onload = () => {
          if (!isCancelled) targetCache[idx] = img;
          resolve(img);
        };
        img.onerror = () => resolve(img);
        if (typeof img.decode === 'function') {
          img.decode().catch(() => {});
        }
      });
    };

    // 1. Immediately load frame 0 and render
    loadSingleImage(0).then(() => {
      if (!isCancelled) {
        scheduleRender(currentRenderedIndexRef.current >= 0 ? currentRenderedIndexRef.current : 0);
      }
    });

    // 2. Eagerly preload initial batch (frames 1–25)
    for (let i = 1; i <= 25; i++) {
      loadSingleImage(i);
    }

    // 3. Progressively load remaining frames in small batches
    const loadRemaining = async () => {
      const batchSize = 6;
      for (let i = 26; i < TOTAL_FRAMES; i += batchSize) {
        if (isCancelled) break;
        await new Promise((r) => setTimeout(r, 25));

        const batchPromises: Promise<HTMLImageElement>[] = [];
        for (let j = i; j < Math.min(i + batchSize, TOTAL_FRAMES); j++) {
          batchPromises.push(loadSingleImage(j));
        }
        await Promise.all(batchPromises);
      }
    };

    const timeout = setTimeout(loadRemaining, 100);

    return () => {
      isCancelled = true;
      clearTimeout(timeout);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isMobile, getFramePath, scheduleRender]);

  // Window resize & orientation redrawing
  useEffect(() => {
    const handleResizeRedraw = () => {
      scheduleRender(currentRenderedIndexRef.current >= 0 ? currentRenderedIndexRef.current : 0);
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResizeRedraw);
    window.addEventListener('orientationchange', handleResizeRedraw);
    return () => {
      window.removeEventListener('resize', handleResizeRedraw);
      window.removeEventListener('orientationchange', handleResizeRedraw);
    };
  }, [scheduleRender]);

  // GSAP ScrollTrigger Sequence Setup
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        scheduleRender(TOTAL_FRAMES - 1);
        if (overlayRef.current) overlayRef.current.style.opacity = '1';
        if (brandRevealRef.current) {
          brandRevealRef.current.style.opacity = '1';
          brandRevealRef.current.style.transform = 'translateY(0px) scale(1)';
        }
        if (onHeroComplete) onHeroComplete(true);
        return;
      }

      const st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: isMobile ? '+=360%' : '+=440%',
        pin: true,
        anticipatePin: 1,
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;

          // Header appearance threshold - only notify when crossing the boundary
          const isComplete = progress >= 1.0;
          if (isComplete !== isCompletedRef.current) {
            isCompletedRef.current = isComplete;
            if (onHeroComplete) {
              onHeroComplete(isComplete);
            }
          }

          // Phase 1: Frame sequence playback (progress 0.00 -> 0.70)
          if (progress <= 0.70) {
            const frameRatio = progress / 0.70;
            const targetFrame = Math.min(TOTAL_FRAMES - 1, Math.floor(frameRatio * TOTAL_FRAMES));
            scheduleRender(targetFrame);

            // Overlay & brand remain hidden during pole rotation
            if (overlayRef.current) {
              overlayRef.current.style.opacity = '0';
            }
            if (brandRevealRef.current) {
              brandRevealRef.current.style.opacity = '0';
              brandRevealRef.current.style.transform = 'translateY(25px) scale(0.96)';
            }
          } else {
            // Keep final frame (132) firmly held on canvas
            scheduleRender(TOTAL_FRAMES - 1);

            // Phase 2: Smooth darkening espresso overlay (progress 0.70 -> 0.82)
            const fadeProgress = Math.min(1, Math.max(0, (progress - 0.70) / 0.12));
            if (overlayRef.current) {
              overlayRef.current.style.opacity = String(fadeProgress);
            }

            // Phase 3 & 4: Majestic MODA title reveal & hold buffer (progress 0.76 -> 1.00)
            if (progress >= 0.76) {
              const titleProgress = Math.min(1, Math.max(0, (progress - 0.76) / 0.14));
              if (brandRevealRef.current) {
                brandRevealRef.current.style.opacity = String(titleProgress);
                const yOffset = (1 - titleProgress) * 25;
                const scale = 0.96 + titleProgress * 0.04;
                brandRevealRef.current.style.transform = `translateY(${yOffset}px) scale(${scale})`;
              }
            } else {
              if (brandRevealRef.current) {
                brandRevealRef.current.style.opacity = '0';
                brandRevealRef.current.style.transform = 'translateY(25px) scale(0.96)';
              }
            }
          }
        },
      });

      return () => {
        st.kill();
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      };
    },
    { dependencies: [isMobile, scheduleRender, onHeroComplete], scope: containerRef }
  );

  return (
    <section
      id="top"
      ref={containerRef}
      className="relative w-full h-[100dvh] min-h-[100dvh] overflow-hidden bg-[#E9E8E4] select-none"
      style={{ overscrollBehaviorY: 'none' }}
    >
      {/* 2D Canvas Frame Sequence - Pure high-performance canvas with contain scaling */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none"
        aria-label="Moda Barbershop cinematic rotating pole sequence"
      />

      {/* Smooth Darkening Charcoal & Espresso Transition Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-[#0E0D0B] opacity-0 pointer-events-none z-10"
        style={{ willChange: 'opacity' }}
      />

      {/* Cinematic Brand Reveal — ONLY the majestic MODA title */}
      <div
        ref={brandRevealRef}
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none opacity-0"
        style={{ willChange: 'opacity, transform' }}
      >
        <h1 className="font-serif text-7xl sm:text-9xl md:text-[11rem] lg:text-[13rem] font-bold tracking-[0.25em] uppercase text-[#F5F2EB] drop-shadow-[0_12px_45px_rgba(0,0,0,0.85)] select-none m-0 pl-[0.25em]">
          MODA
        </h1>
      </div>
    </section>
  );
};
