import React, { useRef } from 'react';
import { Calendar, ArrowRight, Clock, Award, ShieldCheck, Sparkles } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Language } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  lang: Language;
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, onOpenBooking }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const cutoutContainerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      // Entrance timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-badge', {
        y: -20,
        opacity: 0,
        duration: 0.6,
      })
        .from(
          '.hero-title-line',
          {
            y: 50,
            opacity: 0,
            stagger: 0.12,
            duration: 0.9,
          },
          '-=0.3'
        )
        .from(
          textRef.current,
          {
            y: 25,
            opacity: 0,
            duration: 0.7,
          },
          '-=0.5'
        )
        .from(
          ctaRef.current?.children || [],
          {
            y: 20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.6,
          },
          '-=0.4'
        )
        .from(
          badgesRef.current,
          {
            y: 15,
            opacity: 0,
            duration: 0.6,
          },
          '-=0.3'
        )
        .from(
          cutoutContainerRef.current,
          {
            scale: 0.92,
            y: 40,
            opacity: 0,
            duration: 1.1,
            ease: 'expo.out',
          },
          '-=0.9'
        );

      // Subtle scroll parallax on the cutout and background glow
      gsap.to(cutoutContainerRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
        y: 80,
        scale: 0.96,
        ease: 'none',
      });

      gsap.to(glowRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
        scale: 1.3,
        opacity: 0.3,
        ease: 'none',
      });
    },
    { scope: heroRef }
  );

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-28 lg:pt-20 lg:pb-32 bg-noise"
    >
      {/* Dynamic warm radial glow */}
      <div
        ref={glowRef}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] bg-primary/15 rounded-full blur-[150px] pointer-events-none"
      />

      <div className="container-x relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 z-10">
            {/* Eyebrow Pill */}
            <div className="hero-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-card/80 backdrop-blur-md mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-primary">
                {lang === 'en' ? 'Aura • Editorial Barbering Studio' : 'Aura • Barbearia em Pinheiros'}
              </span>
            </div>

            {/* Main Editorial Headline with Pill Word */}
            <h1
              ref={headlineRef}
              className="display text-5xl sm:text-6xl md:text-7xl lg:text-[5.4rem] leading-[0.92] tracking-tight uppercase text-foreground mb-6"
            >
              <span className="block hero-title-line title-gradient">
                {lang === 'en' ? 'YOUR STYLE SHARPENED.' : 'SEU ESTILO BEM DEFINIDO.'}
              </span>
              <span className="block hero-title-line mt-1">
                {lang === 'en' ? (
                  <>
                    YOUR TIME <span className="pill-word">HONORED.</span>
                  </>
                ) : (
                  <>
                    SEU HORÁRIO <span className="pill-word">RESPEITADO.</span>
                  </>
                )}
              </span>
            </h1>

            {/* Subtitle */}
            <p
              ref={textRef}
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mb-9 leading-relaxed font-normal"
            >
              {lang === 'en'
                ? 'Precision scissor tailoring, straight-razor hot towel sculpting, and absolute calendar punctuality. Choose your service and experience an unhurried chair.'
                : 'Corte personalizado na tesoura, barba com toalha quente e atenção minuciosa aos detalhes. Escolha seu serviço e encontre o melhor horário para você.'}
            </p>

            {/* CTAs */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:bg-[#FF8526] hover:scale-[1.02] active:scale-[0.98] transition-all glow-amber shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Calendar className="w-5 h-5" />
                <span>{lang === 'en' ? 'Book an Appointment' : 'Agendar Meu Horário'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#servicos"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-border hover:border-primary/80 bg-surface-raised/40 hover:bg-surface-raised text-foreground font-semibold text-base transition-all active:scale-[0.98] group"
              >
                <span>{lang === 'en' ? 'Explore Services' : 'Conhecer os Serviços'}</span>
                <span className="text-primary group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div
              ref={badgesRef}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-border/60 max-w-lg text-xs sm:text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span>{lang === 'en' ? 'Zero Wait Time' : 'Sem Fila de Espera'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-primary shrink-0" />
                <span>{lang === 'en' ? 'Master Barbers' : 'Barbeiros Mestres'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <span>{lang === 'en' ? 'Simulated Demo' : 'Demo Verificada'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Cutout Composition */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Cutout Container with ambient backlight */}
            <div
              ref={cutoutContainerRef}
              className="relative w-full max-w-[460px] lg:max-w-none flex flex-col items-center"
            >
              {/* Backlight halo behind cutout */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-primary/5 to-transparent rounded-3xl blur-2xl -z-10" />

              {/* Architectural Arch Backplate */}
              <div className="relative w-full aspect-[4/5] rounded-3xl border border-border/80 bg-gradient-to-b from-[#181614] via-[#121110] to-[#0E0D0C] overflow-hidden p-6 flex flex-col justify-between shadow-2xl">
                {/* Subtle ornamental corner markers */}
                <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest">
                  <span>✦ AURA CRAFT</span>
                  <span>EST. 2026</span>
                </div>

                {/* Floating Barber Cutout Image with rich depth shadow */}
                <div className="relative my-auto flex items-center justify-center">
                  <img
                    src="/assets/cutouts/hero-barber-cutout.png"
                    alt={
                      lang === 'en'
                        ? 'Master barber meticulously styling client with scissors'
                        : 'Barbeiro mestre executando corte clássico com tesoura'
                    }
                    className="w-full max-h-[380px] sm:max-h-[440px] object-contain cutout-shadow transition-transform duration-700 hover:scale-105"
                    loading="eager"
                  />
                </div>

                {/* Bottom Floating Pill Card */}
                <div className="relative z-10 p-3.5 rounded-xl bg-card/90 backdrop-blur-md border border-border flex items-center justify-between gap-3 shadow-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-mono tracking-widest text-primary font-bold">
                        {lang === 'en' ? 'Master Barbering' : 'Corte & Navalha'}
                      </p>
                      <p className="text-xs font-semibold text-foreground">
                        {lang === 'en' ? 'Custom Tailored Session' : 'Atendimento com Hora Marcada'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-muted-foreground px-2 py-1 rounded bg-surface-raised border border-border">
                    45 min
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
