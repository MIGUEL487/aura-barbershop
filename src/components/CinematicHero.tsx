import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 133;
const FINAL_FRAME = FRAME_COUNT - 1;
const FRAME_RANGE = 0.78;
const TITLE_REVEAL = 0.80;
const TITLE_EXIT = 0.94;
const SCROLL_SCREENS = 3.8;
const BACKGROUND = '#E9E8E4';
const CACHE_SIZE = 18;
const CONCURRENT_LOADS = 5;
const FRAME_ROOT = '/moda_barbershop_hero';

function frameUrl(index: number) {
  return `${FRAME_ROOT}/frames_desktop/frame_${String(index + 1).padStart(4, '0')}.webp`;
}

export function CinematicHero({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const requestFrame = useRef<(index: number) => void>(() => {});
  const target = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const section = sectionRef.current!;
    canvas.style.visibility = '';
    delete canvas.dataset.frame;
    delete section.dataset.revealReady;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) {
      section.dataset.revealReady = 'true';
      return;
    }

    const cache = new Map<number, HTMLImageElement>();
    const pending = new Map<number, () => void>();
    const failed = new Set<number>();
    let raf = 0;
    let lastImage: HTMLImageElement | undefined;
    let direction = 1;

    function draw() {
      raf = 0;
      if (!context) return;
      const candidates = [...cache.keys()].filter(index => index !== FINAL_FRAME || target.current >= FINAL_FRAME - 3);
      const index = candidates.reduce<number | undefined>((nearest, candidate) => (
        nearest === undefined || Math.abs(candidate - target.current) < Math.abs(nearest - target.current)
          ? candidate : nearest
      ), undefined);
      const image = index === undefined ? lastImage : cache.get(index);
      if (!image) return;

      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      const width = Math.round(canvas.clientWidth * dpr);
      const height = Math.round(canvas.clientHeight * dpr);
      if (!width || !height) return;
      if (image === lastImage && canvas.width === width && canvas.height === height) return;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
      const frameWidth = image.naturalWidth * scale;
      const frameHeight = image.naturalHeight * scale;

      context.fillStyle = BACKGROUND;
      context.fillRect(0, 0, width, height);
      context.drawImage(image, (width - frameWidth) / 2, (height - frameHeight) / 2, frameWidth, frameHeight);
      canvas.dataset.frame = index === undefined ? '' : String(index + 1);
      canvas.style.visibility = 'visible';
      lastImage = image;
      if (index === FINAL_FRAME) section.dataset.revealReady = 'true';
    }

    function queueDraw() {
      if (!raf) raf = requestAnimationFrame(draw);
    }

    function fillQueue() {
      const offsets = reducedMotion ? [0] : [0, 1, 2, 3, -1, 4, -2, 5, -3, 6, -4, 7, -5];
      const indices = offsets.map(offset => target.current + offset * direction);
      if (!reducedMotion) indices.splice(1, 0, FINAL_FRAME);
      for (const index of indices) {
        if (pending.size >= CONCURRENT_LOADS) break;
        if (index < 0 || index >= FRAME_COUNT || cache.has(index) || pending.has(index) || failed.has(index)) continue;
        load(index);
      }
    }

    function load(index: number) {
      const image = new Image();
      image.decoding = 'async';
      const cleanup = () => {
        clearTimeout(timeout);
        image.onload = null;
        image.onerror = null;
      };
      const finish = (loaded: boolean) => {
        cleanup();
        pending.delete(index);
        if (loaded) {
          cache.set(index, image);
          if (cache.size > CACHE_SIZE) {
            const farthest = [...cache.keys()].filter(key => key !== FINAL_FRAME).reduce((a, b) =>
              Math.abs(a - target.current) >= Math.abs(b - target.current) ? a : b);
            cache.delete(farthest);
          }
          queueDraw();
        } else {
          failed.add(index);
          if (index === FINAL_FRAME) section.dataset.revealReady = 'true';
          image.removeAttribute('src');
        }
        fillQueue();
      };
      const timeout = window.setTimeout(() => finish(false), 8000);
      pending.set(index, () => {
        cleanup();
        image.removeAttribute('src');
      });
      image.onload = () => finish(true);
      image.onerror = () => finish(false);
      image.src = frameUrl(index);
    }

    requestFrame.current = index => {
      if (index !== target.current) direction = Math.sign(index - target.current);
      target.current = index;
      fillQueue();
      queueDraw();
    };

    const resize = new ResizeObserver(queueDraw);
    resize.observe(canvas);
    fillQueue();

    return () => {
      requestFrame.current = () => {};
      resize.disconnect();
      pending.forEach(cancel => cancel());
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  useGSAP(() => {
    const scene = { frame: 0 };
    const section = sectionRef.current!;
    if (reducedMotion) {
      target.current = 0;
      gsap.set(titleRef.current, { autoAlpha: 1, y: 0 });
      return;
    }

    const updateFrame = () => {
      const index = Math.round(scene.frame);
      if (index === target.current) return;
      requestFrame.current(index);
      target.current = index;
    };

    let progressBeforeResize: number | undefined;
    let resizeFrame = 0;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => '+=' + Math.round(section.clientHeight * SCROLL_SCREENS),
        pin: true,
        scrub: true,
        refreshPriority: 2,
        onRefreshInit: trigger => {
          const distance = Math.round(section.clientHeight * SCROLL_SCREENS);
          const scroll = trigger.scroll();
          const previousDistance = trigger.end - trigger.start;
          progressBeforeResize = Math.abs(previousDistance - distance) > 1 && scroll > trigger.start && scroll < trigger.end
            ? (scroll - trigger.start) / previousDistance
            : undefined;
        },
        onRefresh: trigger => {
          if (progressBeforeResize === undefined) return;
          const top = Math.round(trigger.start + progressBeforeResize * (trigger.end - trigger.start));
          progressBeforeResize = undefined;
          cancelAnimationFrame(resizeFrame);
          resizeFrame = requestAnimationFrame(() => window.scrollTo({ top, behavior: 'instant' }));
        },
      },
    });

    timeline
      .to(scene, { frame: FINAL_FRAME, duration: FRAME_RANGE, ease: 'none', onUpdate: updateFrame }, 0)
      .to(overlayRef.current, { opacity: 0.22, duration: 0.11, ease: 'none' }, FRAME_RANGE)
      .fromTo(titleRef.current, { y: 12 }, { autoAlpha: 1, y: 0, duration: 0.1, ease: 'power2.out' }, TITLE_REVEAL)
      .to(titleRef.current, { autoAlpha: 0, y: -16, duration: 1 - TITLE_EXIT, ease: 'power1.in' }, TITLE_EXIT);

    return () => cancelAnimationFrame(resizeFrame);
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true });

  return (
    <section id="hero" ref={sectionRef} data-reduced-motion={reducedMotion}
      className="cinematic-hero relative h-[100svh] w-full select-none" style={{ backgroundColor: BACKGROUND }}>
      <img
        src={`${FRAME_ROOT}/frames_original/frame_0001.jpg`}
        alt="Barber pole"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-contain"
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="invisible pointer-events-none absolute inset-0 block h-full w-full"
      />
      <div className="hero-reveal pointer-events-none absolute inset-0">
        <div ref={overlayRef} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black opacity-0" />
        <div ref={titleRef} className="invisible pointer-events-none absolute inset-0 grid place-items-center opacity-0">
          <h1
            className="m-0 pl-[0.25em] text-center font-serif font-bold uppercase tracking-[0.25em] text-[#F5F2EB]"
            style={{ fontSize: 'clamp(2.75rem, 7vw, 6rem)', textShadow: '0 2px 14px #1C1916, 0 1px 3px #1C1916' }}
          >
            MODA
          </h1>
        </div>
      </div>
    </section>
  );
}
