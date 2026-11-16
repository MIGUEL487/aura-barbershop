import React, { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface StoryStep {
  num: string;
  tag: string;
  badge: string;
  title: string;
  subtitle: string;
  text: string;
  image: string;
  highlights: string[];
}

export const Storytelling: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStepRef = useRef(0);
  const stRef = useRef<ScrollTrigger | null>(null);

  const steps: StoryStep[] = [
    {
      num: '01',
      tag: 'UNDERSTAND',
      badge: '01 • ARCHITECTURAL CONSULTATION',
      title: 'The Intentional Dialogue',
      subtitle: 'Analyzing bone geometry and growth patterns before the cut.',
      text: 'Your lifestyle, facial structure, growth spirals, and daily routine guide the tailored blueprint before a single shear touches hair.',
      image: '/assets/hero/set_b_barber-at-work.webp',
      highlights: ['Facial Bone Analysis', 'Hair Growth Mapping', 'Tailored Silhouette Plan'],
    },
    {
      num: '02',
      tag: 'EXECUTE',
      badge: '02 • PRECISION SCISSOR ARCHITECTURE',
      title: 'Millimeter Precision & Scissor Craft',
      subtitle: 'Japanese steel shears, disciplined graduation, and clean taper lines.',
      text: 'Sculpting seamless gradients, scissor weight dissipation, and clean classic transitions with steady shears and master clippers.',
      image: '/assets/process/set_a_precision-fade.webp',
      highlights: ['Micro-metric Shear Tension', 'Seamless Weight Graduation', 'Clean Taper & Fade Geometry'],
    },
    {
      num: '03',
      tag: 'REFINE',
      badge: '03 • THE RITUALISTIC FINISH',
      title: 'Steamed Towel & Straight-Razor Polish',
      subtitle: 'Herbal aromatherapy steam and straight-razor detailing.',
      text: 'Essential herbal steam softens the dermal perimeter before an artisan straight-razor cleanup, followed by bespoke cold stone soothing.',
      image: '/assets/process/set_a_hot-towel.webp',
      highlights: ['Herbal Steam Infusion', 'Artisan Straight-Razor Detailing', 'Cold Stone Scalp Soothing'],
    },
  ];

  // Eagerly preload methodology images to guarantee instantaneous crossfade
  useEffect(() => {
    steps.forEach((step) => {
      const img = new Image();
      img.src = step.image;
      if (typeof img.decode === 'function') {
        img.decode().catch(() => {});
      }
    });
  }, []);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const isDesktop = window.innerWidth >= 1024;
      if (!isDesktop) {
        // Mobile: Subtle staggered entrance for vertical cards
        gsap.from('.mobile-story-card', {
          scrollTrigger: {
            trigger: '.mobile-story-list',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          y: 40,
          opacity: 0,
          stagger: 0.18,
          duration: 0.8,
          ease: 'power3.out',
        });
        return;
      }

      // Desktop: Single deterministic GSAP pin for Methodology (Bounded scroll distance, ZERO empty black void)
      const st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=150%',
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.5,
        invalidateOnRefresh: false,
        onUpdate: (self) => {
          const p = self.progress;
          let newIndex = 0;
          if (p < 0.35) {
            newIndex = 0;
          } else if (p < 0.70) {
            newIndex = 1;
          } else {
            newIndex = 2;
          }

          if (newIndex !== activeStepRef.current) {
            activeStepRef.current = newIndex;
            setActiveStepIndex(newIndex);
          }
        },
      });

      stRef.current = st;

      return () => {
        st.kill();
        stRef.current = null;
      };
    },
    { scope: containerRef }
  );

  const handleStepClick = (idx: number) => {
    activeStepRef.current = idx;
    setActiveStepIndex(idx);
    if (stRef.current && window.innerWidth >= 1024) {
      const start = stRef.current.start;
      const end = stRef.current.end;
      const targetScroll = start + (idx / 2) * (end - start);
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(targetScroll, { duration: 0.8 });
      } else {
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id="craft"
      ref={containerRef}
      className="relative bg-[#0E0D0B] border-t border-border overflow-hidden select-none"
    >
      {/* Desktop Pinned Showcase: Single GSAP Pin with 150% progression — ZERO jumps, ZERO empty voids */}
      <div className="hidden lg:flex flex-col justify-center w-full h-[100dvh] min-h-[100dvh] py-10">
        <div className="container-x w-full">
          {/* Section Header */}
          <div className="max-w-3xl mb-7">
            <div className="eyebrow mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>The Moda Methodology</span>
            </div>
            <h2 className="display text-4xl sm:text-5xl md:text-6xl text-foreground uppercase tracking-tight mb-2">
              THE CRAFT IS IN THE <span className="pill-word">DETAILS.</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
              Three deliberate chapters designed to respect your schedule, listen to your desires, and deliver absolute confidence.
            </p>
          </div>

          {/* Interactive Step Switcher */}
          <div className="grid grid-cols-3 gap-4 mb-7 max-w-3xl">
            {steps.map((st, i) => (
              <button
                key={st.num}
                type="button"
                onClick={() => handleStepClick(i)}
                className={`p-3 rounded-2xl border transition-all duration-300 text-left flex items-center justify-between cursor-pointer ${
                  activeStepIndex === i
                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10 scale-[1.01]'
                    : 'border-border/60 bg-card/60 opacity-60 hover:opacity-90'
                }`}
              >
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-bold">
                    {st.num} / {st.tag}
                  </span>
                  <p className="font-semibold text-xs mt-0.5 text-foreground truncate">{st.title}</p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors shrink-0 ml-2 ${
                    activeStepIndex === i
                      ? 'bg-primary text-primary-foreground font-bold'
                      : 'bg-surface-raised text-muted-foreground'
                  }`}
                >
                  {activeStepIndex > i ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
              </button>
            ))}
          </div>

          {/* 2-Column Synchronized Layout */}
          <div className="grid grid-cols-12 gap-8 items-center max-w-6xl">
            {/* Left Column: Contextual Narrative Details */}
            <div className="col-span-5 relative min-h-[290px] flex flex-col justify-center">
              {steps.map((st, i) => (
                <div
                  key={st.num}
                  className={`transition-all duration-500 ease-out ${
                    activeStepIndex === i
                      ? 'opacity-100 translate-y-0 pointer-events-auto relative'
                      : 'opacity-0 translate-y-4 pointer-events-none absolute inset-0'
                  }`}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-raised border border-border text-xs font-mono font-bold text-primary mb-3 w-fit">
                    {st.badge}
                  </div>
                  <h3 className="display text-2xl xl:text-3xl text-foreground mb-2 leading-tight uppercase">
                    {st.title}
                  </h3>
                  <p className="text-sm text-primary/95 italic font-serif mb-3">
                    {st.subtitle}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    {st.text}
                  </p>
                  <div className="space-y-1.5 pt-3 border-t border-border/60">
                    {st.highlights.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Matched Contextual Editorial Imagery */}
            <div className="col-span-7">
              <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-border bg-[#141210] shadow-2xl">
                {/* Subtle warm radial highlight */}
                <div className="absolute inset-0 bg-radial-gradient from-primary/15 via-transparent to-transparent opacity-60 z-10 pointer-events-none" />

                {/* Synchronized Images with Crossfade (always exactly one fully active) */}
                {steps.map((st, i) => (
                  <img
                    key={st.num}
                    src={st.image}
                    alt={st.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                      activeStepIndex === i
                        ? 'opacity-100 scale-100 z-1'
                        : 'opacity-0 scale-[1.03] z-0'
                    }`}
                    loading="eager"
                  />
                ))}

                {/* Soft bottom vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D0B]/80 via-transparent to-[#0E0D0B]/30 pointer-events-none z-10" />

                {/* Watermark Tag */}
                <div className="absolute bottom-4 right-4 z-20 px-3.5 py-1.5 rounded-full bg-[#0E0D0B]/85 backdrop-blur-md border border-border text-xs font-mono font-bold text-primary tracking-wider uppercase">
                  {steps[activeStepIndex].badge}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet View: Clean Vertical Flow (Zero Pinning, Zero Layout Collisions) */}
      <div className="lg:hidden py-16">
        <div className="container-x">
          <div className="max-w-2xl mb-10">
            <div className="eyebrow mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>The Moda Methodology</span>
            </div>
            <h2 className="display text-3xl sm:text-4xl text-foreground uppercase tracking-tight mb-2">
              THE CRAFT IS IN THE <span className="pill-word">DETAILS.</span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Three deliberate chapters designed to respect your schedule, listen to your desires, and deliver absolute confidence.
            </p>
          </div>

          <div className="mobile-story-list space-y-8">
            {steps.map((st) => (
              <div
                key={st.num}
                className="mobile-story-card rounded-3xl border border-border bg-card overflow-hidden shadow-xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#141210]">
                  <img
                    src={st.image}
                    alt={st.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0E0D0B]/85 backdrop-blur-md border border-border text-xs font-mono font-bold text-primary">
                    {st.badge}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="display text-2xl text-foreground mb-1.5 leading-tight uppercase">
                    {st.title}
                  </h3>
                  <p className="text-sm text-primary/95 italic font-serif mb-2.5">
                    {st.subtitle}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {st.text}
                  </p>
                  <div className="space-y-1.5 pt-3 border-t border-border">
                    {st.highlights.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                        <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
