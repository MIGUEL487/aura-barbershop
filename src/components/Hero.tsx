import React, { useRef } from 'react';
import { Calendar, ArrowRight, Sparkles, Scissors, CheckCircle2 } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const cutoutContainerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.hero-badge',
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      )
        .fromTo(
          '.hero-title-line',
          { y: 45, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.12, duration: 0.8 },
          '-=0.3'
        )
        .fromTo(
          '.hero-desc',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          '-=0.5'
        )
        .fromTo(
          '.hero-cta-btn',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.6 },
          '-=0.4'
        )
        .fromTo(
          '.hero-stat-item',
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.5 },
          '-=0.3'
        )
        .fromTo(
          cutoutContainerRef.current,
          { scale: 0.92, y: 30, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, duration: 1.1, ease: 'power2.out' },
          '-=0.9'
        )
        .fromTo(
          '.floating-chip',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.15, duration: 0.6 },
          '-=0.4'
        );

      // Subtle scroll parallax for the cutout and glowing halo
      if (cutoutContainerRef.current) {
        gsap.to(cutoutContainerRef.current, {
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
          y: 50,
          scale: 0.98,
          ease: 'none',
        });
      }

      if (circleRef.current) {
        gsap.to(circleRef.current, {
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
          rotate: 45,
          ease: 'none',
        });
      }

      if (glowRef.current) {
        gsap.to(glowRef.current, {
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.8,
          },
          scale: 1.2,
          opacity: 0.35,
          ease: 'none',
        });
      }
    },
    { scope: heroRef }
  );

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 lg:pt-16 lg:pb-28 bg-noise"
    >
      {/* Dynamic warm radial glow */}
      <div
        ref={glowRef}
        className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-primary/12 rounded-full blur-[150px] pointer-events-none -z-10"
      />
      <div className="absolute top-1/4 left-10 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Subtle architectural horizontal guide line */}
      <div className="absolute top-0 inset-x-0 hairline opacity-60" />
      <div className="absolute bottom-0 inset-x-0 hairline opacity-60" />

      <div className="container-x relative">
        {/* Subtle top metadata ticker line */}
        <div className="hidden md:flex items-center justify-between text-[11px] font-mono tracking-widest text-muted-foreground/60 uppercase pb-6 border-b border-border/40 mb-8">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>PINHEIROS ATELIER • EST. 2026</span>
          </div>
          <div className="flex items-center gap-6">
            <span>BY APPOINTMENT ONLY</span>
            <span className="text-border">•</span>
            <span>TUE — SAT 10:00 — 20:00</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 z-10">
            {/* Eyebrow Pill */}
            <div className="hero-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-[#161411]/90 backdrop-blur-md mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-primary">
                Aura • Editorial Barbering Studio
              </span>
            </div>

            {/* Main Editorial Headline with Burnished Gold Pill Word */}
            <h1 className="display text-5xl sm:text-6xl md:text-7xl lg:text-[5.3rem] leading-[0.92] tracking-tight uppercase text-foreground mb-6">
              <span className="block hero-title-line title-gradient">
                YOUR STYLE SHARPENED.
              </span>
              <span className="block hero-title-line mt-1">
                YOUR TIME <span className="pill-word">HONORED.</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="hero-desc text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mb-9 leading-relaxed font-normal">
              Precision scissor tailoring, straight-razor hot towel sculpting, and absolute calendar punctuality. Choose your ritual and experience a dedicated, private chair with zero wait time.
            </p>

            {/* CTAs in Burnished Gold & Architectural Glass */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-11">
              <button
                onClick={onOpenBooking}
                className="hero-cta-btn inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:bg-[#D4AF6A] hover:scale-[1.02] active:scale-[0.98] transition-all glow-gold shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#services"
                className="hero-cta-btn inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-border hover:border-primary/70 bg-surface-raised/60 hover:bg-surface-raised text-foreground font-semibold text-base transition-all active:scale-[0.98] group"
              >
                <span>Explore Services</span>
                <span className="text-primary group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>

            {/* Value Verification Row */}
            <div className="grid grid-cols-3 gap-6 pt-7 border-t border-border/60 max-w-xl">
              <div className="hero-stat-item">
                <div className="flex items-center gap-1.5 text-foreground font-mono text-xl sm:text-2xl font-bold">
                  <span className="text-primary">0</span>
                  <span className="text-xs uppercase text-muted-foreground font-normal">Min</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Zero Wait Time Policy</p>
              </div>

              <div className="hero-stat-item border-l border-border/50 pl-6">
                <div className="flex items-center gap-1.5 text-foreground font-mono text-xl sm:text-2xl font-bold">
                  <span className="text-primary">45</span>
                  <span className="text-xs uppercase text-muted-foreground font-normal">Min</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Dedicated Chair Session</p>
              </div>

              <div className="hero-stat-item border-l border-border/50 pl-6">
                <div className="flex items-center gap-1.5 text-foreground font-mono text-xl sm:text-2xl font-bold">
                  <span className="text-primary">12+</span>
                  <span className="text-xs uppercase text-muted-foreground font-normal">Yrs</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Master Barber Craft</p>
              </div>
            </div>
          </div>

          {/* Right Column: Unboxed Organic Cutout Composition */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[460px] sm:min-h-[540px] lg:min-h-[620px]">
            {/* Background Subtle Architectural Ring (Not a box!) */}
            <div
              ref={circleRef}
              className="absolute w-[440px] h-[440px] sm:w-[500px] sm:h-[500px] lg:w-[540px] lg:h-[540px] rounded-full border border-primary/20 pointer-events-none -z-10 flex items-center justify-center opacity-70"
            >
              <div className="w-[88%] h-[88%] rounded-full border border-dashed border-border/60" />
            </div>

            {/* Ambient Radial Depth Glow centered behind cutout */}
            <div className="absolute w-[360px] sm:w-[420px] h-[360px] sm:h-[420px] bg-gradient-to-tr from-primary/25 via-primary/10 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />

            {/* Unboxed Cutout Figure Container */}
            <div
              ref={cutoutContainerRef}
              className="relative w-full flex flex-col items-center justify-end z-10"
            >
              {/* Floating Top Pill Chip */}
              <div className="floating-chip absolute top-2 right-4 z-20 px-3.5 py-1.5 rounded-full bg-[#171513]/90 backdrop-blur-md border border-primary/30 flex items-center gap-2 shadow-xl">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-foreground">
                  Master Scissor Craft
                </span>
              </div>

              {/* The Hero Cutout Image: Unboxed, organic, breathing naturally */}
              <div className="relative w-full flex items-end justify-center">
                <img
                  src="/assets/cutouts/hero-barber-cutout.png"
                  alt="Master barber meticulously detailing client with precision scissors in open studio"
                  className="w-auto h-[420px] sm:h-[500px] lg:h-[560px] max-w-full object-contain cutout-shadow transition-transform duration-700 hover:scale-[1.02]"
                  loading="eager"
                />

                {/* Ground depth shadow under cutout */}
                <div className="absolute -bottom-4 w-3/4 h-8 bg-black/80 blur-xl rounded-full -z-10" />
              </div>

              {/* Floating Translucent Glass Feature Badge */}
              <div className="floating-chip relative mt-2 z-20 w-full max-w-[380px] p-3 rounded-2xl bg-[#151412]/85 backdrop-blur-xl border border-primary/25 shadow-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">
                        Bespoke Consultation
                      </span>
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                    </div>
                    <p className="text-xs font-semibold text-foreground">
                      45-Minute Unrushed Chair
                    </p>
                  </div>
                </div>

                <div className="text-right pl-2 border-l border-border/50">
                  <span className="text-xs font-mono font-bold text-primary">✦ 4.98</span>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground">850+ Cuts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
