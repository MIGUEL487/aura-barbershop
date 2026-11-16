import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Prevent mobile dynamic toolbar resizes from resetting or breaking pin positions
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
  const onHeroCompleteRef = useRef(onHeroComplete);

  useEffect(() => {
    onHeroCompleteRef.current = onHeroComplete;
  }, [onHeroComplete]);

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

  // High-performance prioritized preloading
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
          if (!isCancelled) {
            targetCache[idx] = img;
            // If user is currently looking at this frame or adjacent, immediately paint
            if (Math.abs(requestedFrameRef.current - idx) <= 1) {
              scheduleRender(requestedFrameRef.current);
            }
          }
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
        renderFrame(0);
      }
    });

    // 2. Rapidly preload keyframes across the sequence (every 5th frame)
    // Ensures immediate continuous scrub even if user scrolls instantaneously
    for (let i = 0; i < TOTAL_FRAMES; i += 5) {
      if (!targetCache[i]) {
        loadSingleImage(i);
      }
    }

    // 3. Eagerly preload all remaining frames
    const loadRemaining = () => {
      for (let i = 1; i < TOTAL_FRAMES; i++) {
        if (isCancelled) break;
        if (!targetCache[i]) {
          loadSingleImage(i);
        }
      }
    };

    // Dispatch load queue on next microtask
    const timer = setTimeout(loadRemaining, 30);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isMobile, getFramePath, scheduleRender, renderFrame]);

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

  // GSAP ScrollTrigger Sequence Setup: single deterministic timeline owner of the pin
  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        scheduleRender(TOTAL_FRAMES - 1);
        if (overlayRef.current) {
          overlayRef.current.style.opacity = '0.22';
          overlayRef.current.style.backgroundColor = '#000000';
        }
        if (brandRevealRef.current) {
          brandRevealRef.current.style.opacity = '1';
          brandRevealRef.current.style.transform = 'translateY(0px) scale(1)';
        }
        if (onHeroCompleteRef.current) onHeroCompleteRef.current(true);
        return;
      }

      const frameObj = { frame: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: isMobile ? '+=300%' : '+=380%',
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.8,
          invalidateOnRefresh: false,
        },
      });

      // Phase 1 (0.0s -> 7.2s): Smooth scroll-controlled frame-by-frame scrub
      tl.to(
        frameObj,
        {
          frame: TOTAL_FRAMES - 1,
          ease: 'none',
          duration: 7.2,
          onUpdate: () => {
            const targetFrame = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(frameObj.frame)));
            scheduleRender(targetFrame);
          },
        },
        0
      );

      // Phase 2 (7.2s -> 8.6s): Subtle dark overlay (max 0.22 tint, pole remains clearly visible!) & ivory MODA entrance
      tl.to(
        overlayRef.current,
        {
          opacity: 0.22,
          backgroundColor: '#000000',
          ease: 'power1.out',
          duration: 1.4,
        },
        7.2
      );

      tl.to(
        brandRevealRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'power2.out',
          duration: 1.4,
        },
        7.2
      );

      // Phase 3 (8.6s -> 9.2s): Hold stage - MODA title is held and appreciated over the subtly dimmed pole
      // (implicit hold of 0.6s)

      // Phase 4 (9.2s -> 10.0s): Smooth animated exit of MODA and seamless transition to dark theme
      tl.to(
        brandRevealRef.current,
        {
          opacity: 0,
          y: -16,
          scale: 0.98,
          ease: 'power1.in',
          duration: 0.8,
        },
        9.2
      );

      tl.to(
        overlayRef.current,
        {
          backgroundColor: '#0E0D0B',
          opacity: 1,
          ease: 'power1.inOut',
          duration: 0.8,
        },
        9.2
      );

      return () => {
        tl.kill();
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      };
    },
    { dependencies: [isMobile], scope: containerRef }
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

      {/* Light Dimming Overlay (Max 0.22 opacity so the barber pole is always visible behind MODA, transitions to #0E0D0B on unpin) */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black opacity-0 pointer-events-none z-10 transition-none"
        style={{ willChange: 'opacity, background-color' }}
      />

      {/* Cinematic Brand Reveal — ONLY the balanced, editorial MODA title in high-contrast ivory */}
      <div
        ref={brandRevealRef}
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none opacity-0"
        style={{ willChange: 'opacity, transform' }}
      >
        <h1
          className="font-serif font-bold uppercase tracking-[0.25em] pl-[0.25em] text-[#F5F2EB] select-none m-0 text-center drop-shadow-[0_2px_24px_rgba(197,160,89,0.35)]"
          style={{ fontSize: 'clamp(2.75rem, 7vw, 6rem)' }}
        >
          MODA
        </h1>
      </div>
    </section>
  );
};
