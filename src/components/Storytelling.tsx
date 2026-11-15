import React, { useRef, useState } from 'react';
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
  const pinnedContentRef = useRef<HTMLDivElement>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const steps: StoryStep[] = [
    {
      num: '01',
      tag: 'Understand',
      badge: '01 • CONSULTATION & ANALYSIS',
      title: 'The Intentional Consultation',
      subtitle: 'Before the shears, an architectural dialogue.',
      text: 'Your lifestyle, facial geometry, natural growth contours, and daily styling habits guide the bespoke blueprint before a single cut is made.',
      image: '/assets/hero/set_b_barber-at-work.webp',
      highlights: ['Facial Anatomy Analysis', 'Natural Growth Mapping', 'Bespoke Silhouette Plan'],
    },
    {
      num: '02',
      tag: 'Execute',
      badge: '02 • PRECISION & TECHNIQUE',
      title: 'Millimeter Precision & Scissor Architecture',
      subtitle: 'Handcrafted tapering and weight graduation.',
      text: 'Sculpting seamless gradients, scissor weight dissipation, and clean classic transitions with steady Japanese steel shears and master clippers.',
      image: '/assets/process/set_a_precision-fade.webp',
      highlights: ['Seamless Taper & Fade Architecture', 'Scissor Weight Graduation', 'Micro-metric Edge Alignment'],
    },
    {
      num: '03',
      tag: 'Refine',
      badge: '03 • RITUALISTIC FINISH',
      title: 'The Steamed Towel & Straight-Razor Polish',
      subtitle: 'The ceremonial climax of unhurried grooming.',
      text: 'Essential herbal steam softens the dermal perimeter before an artisan straight-razor cleanup, followed by soothing cold stone finish and styling.',
      image: '/assets/process/set_a_hot-towel.webp',
      highlights: ['Herbal Steam Infusion', 'Straight-Razor Perimeter Polish', 'Cold Stone Scalp Soothing'],
    },
  ];

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const isDesktop = window.innerWidth >= 1024;
      if (!isDesktop) {
        // Mobile / Tablet: Smooth staggered entrance for vertical cards
        gsap.from('.mobile-story-card', {
          scrollTrigger: {
            trigger: '.mobile-story-list',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          y: 40,
          opacity: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: 'power3.out',
        });
        return;
      }

      // Desktop: Pinned 3-step timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.35) {
              setActiveStepIndex(0);
            } else if (p < 0.70) {
              setActiveStepIndex(1);
            } else {
              setActiveStepIndex(2);
            }
          },
        },
      });

      // Initial state: Step 0 visible, Steps 1 and 2 hidden
      gsap.set(['.story-img-1', '.story-img-2'], { opacity: 0, scale: 1.05 });
      gsap.set('.story-img-0', { opacity: 1, scale: 1 });
      gsap.set(['.story-text-1', '.story-text-2'], { opacity: 0, y: 25, pointerEvents: 'none' });
      gsap.set('.story-text-0', { opacity: 1, y: 0, pointerEvents: 'auto' });

      // Step 0 hold -> Transition to Step 1
      tl.to({}, { duration: 1 })
        .to('.story-img-0', { opacity: 0, scale: 0.98, duration: 1, ease: 'power2.inOut' }, 'step1')
        .to('.story-img-1', { opacity: 1, scale: 1, duration: 1, ease: 'power2.inOut' }, 'step1')
        .to('.story-text-0', { opacity: 0, y: -20, pointerEvents: 'none', duration: 0.6, ease: 'power2.in' }, 'step1')
        .to('.story-text-1', { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.8, ease: 'power2.out' }, 'step1+=0.3')
        // Step 1 hold -> Transition to Step 2
        .to({}, { duration: 1 })
        .to('.story-img-1', { opacity: 0, scale: 0.98, duration: 1, ease: 'power2.inOut' }, 'step2')
        .to('.story-img-2', { opacity: 1, scale: 1, duration: 1, ease: 'power2.inOut' }, 'step2')
        .to('.story-text-1', { opacity: 0, y: -20, pointerEvents: 'none', duration: 0.6, ease: 'power2.in' }, 'step2')
        .to('.story-text-2', { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.8, ease: 'power2.out' }, 'step2+=0.3')
        // Step 2 hold
        .to({}, { duration: 1 });
    },
    { scope: containerRef }
  );

  return (
    <section
      id="craft"
      ref={containerRef}
      className="relative bg-[#0E0D0B] border-t border-border overflow-hidden select-none"
    >
      {/* Desktop View: Pinned Editorial Showcase */}
      <div
        ref={pinnedContentRef}
        className="hidden lg:flex min-h-screen w-full flex-col justify-center py-16"
      >
        <div className="container-x w-full">
          {/* Section Header */}
          <div className="max-w-3xl mb-12">
            <div className="eyebrow mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>The Moda Methodology</span>
            </div>
            <h2 className="display text-4xl sm:text-5xl md:text-6xl text-foreground uppercase tracking-tight mb-3">
              THE CRAFT IS IN THE <span className="pill-word">DETAILS.</span>
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Three deliberate chapters designed to respect your schedule, listen to your desires, and deliver absolute confidence.
            </p>
          </div>

          {/* Interactive Navigation Track */}
          <div className="grid grid-cols-3 gap-5 mb-10 max-w-4xl">
            {steps.map((st, i) => (
              <div
                key={st.num}
                className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                  activeStepIndex === i
                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                    : 'border-border/60 bg-card/60 opacity-60'
                }`}
              >
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-bold">
                    {st.num} / {st.tag}
                  </span>
                  <p className="font-semibold text-xs mt-0.5 text-foreground">{st.title}</p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                    activeStepIndex === i
                      ? 'bg-primary text-primary-foreground font-bold'
                      : 'bg-surface-raised text-muted-foreground'
                  }`}
                >
                  {activeStepIndex > i ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
              </div>
            ))}
          </div>

          {/* 2-Column Synchronized Showcase */}
          <div className="grid grid-cols-12 gap-10 items-center">
            {/* Left Column: Dynamic Step Narrative Layers */}
            <div className="col-span-5 relative min-h-[300px]">
              {steps.map((st, i) => (
                <div
                  key={st.num}
                  className={`story-text-${i} absolute inset-0 flex flex-col justify-center transition-all duration-300`}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-raised border border-border text-xs font-mono font-bold text-primary mb-4 w-fit">
                    {st.badge}
                  </div>
                  <h3 className="display text-3xl xl:text-4xl text-foreground mb-3 leading-tight uppercase">
                    {st.title}
                  </h3>
                  <p className="text-base text-primary/95 italic font-serif mb-4">
                    {st.subtitle}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {st.text}
                  </p>
                  <div className="space-y-2 pt-4 border-t border-border/60">
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

            {/* Right Column: Heroic Editorial Image Stage */}
            <div className="col-span-7">
              <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-border bg-[#141210] shadow-2xl">
                {/* Ambient warm radial glow */}
                <div className="absolute inset-0 bg-radial-gradient from-primary/20 via-transparent to-transparent opacity-75 z-10 pointer-events-none" />

                {/* Layered Crossfading Photos */}
                {steps.map((st, i) => (
                  <img
                    key={st.num}
                    src={st.image}
                    alt={st.title}
                    className={`story-img-${i} absolute inset-0 w-full h-full object-cover transition-transform duration-700`}
                    loading="lazy"
                  />
                ))}

                {/* Subtle Edge Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D0B]/80 via-transparent to-[#0E0D0B]/40 pointer-events-none z-10" />

                {/* Dynamic Step Watermark Tag */}
                <div className="absolute bottom-4 right-4 z-20 px-3.5 py-1.5 rounded-full bg-[#0E0D0B]/85 backdrop-blur-md border border-border text-xs font-mono font-bold text-primary tracking-wider uppercase">
                  {steps[activeStepIndex].badge}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet View: Clean Vertical Flow (No Pinning, No Overlapping) */}
      <div className="lg:hidden py-16">
        <div className="container-x">
          <div className="max-w-2xl mb-12">
            <div className="eyebrow mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>The Moda Methodology</span>
            </div>
            <h2 className="display text-3xl sm:text-4xl text-foreground uppercase tracking-tight mb-3">
              THE CRAFT IS IN THE <span className="pill-word">DETAILS.</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
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
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#0E0D0B]/85 backdrop-blur-md border border-border text-xs font-mono font-bold text-primary">
                    {st.badge}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="display text-2xl text-foreground mb-2 leading-tight uppercase">
                    {st.title}
                  </h3>
                  <p className="text-sm text-primary/95 italic font-serif mb-3">
                    {st.subtitle}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    {st.text}
                  </p>
                  <div className="space-y-2 pt-4 border-t border-border">
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
