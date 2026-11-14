import React, { useRef } from 'react';
import { Calendar, ArrowRight, ShieldCheck, Clock, Award } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Language } from '../types';
import { ThreeEmblem } from './ThreeEmblem';

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
  const imageFrameRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Check if user has reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(headlineRef.current?.querySelectorAll('.headline-line') || [], {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 1.0,
      })
        .from(
          textRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
          },
          '-=0.6'
        )
        .from(
          ctaRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
          },
          '-=0.5'
        )
        .from(
          badgesRef.current,
          {
            opacity: 0,
            y: 15,
            duration: 0.7,
          },
          '-=0.4'
        )
        .from(
          imageFrameRef.current,
          {
            scale: 0.94,
            opacity: 0,
            duration: 1.2,
            ease: 'expo.out',
          },
          '-=1.0'
        );
    },
    { scope: heroRef }
  );

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 lg:pt-16 lg:pb-28"
    >
      {/* Background ambient radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-x relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 z-10">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface-raised/80 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                {lang === 'en' ? 'Aura • Editorial Barber Studio' : 'Aura • Barbearia Conceitual'}
              </span>
            </div>

            {/* Main Editorial Headline */}
            <h1
              ref={headlineRef}
              className="display text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] leading-[0.94] tracking-tight uppercase text-foreground mb-6"
            >
              <span className="block headline-line title-gradient">
                {lang === 'en' ? 'YOUR STYLE SHARPENED.' : 'SEU ESTILO BEM DEFINIDO.'}
              </span>
              <span className="block headline-line gold-gradient">
                {lang === 'en' ? 'YOUR TIME HONORED.' : 'SEU HORÁRIO RESPEITADO.'}
              </span>
            </h1>

            {/* Subtitle */}
            <p
              ref={textRef}
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mb-8 leading-relaxed font-normal"
            >
              {lang === 'en'
                ? 'Precision scissor tailoring, straight-razor hot towel sculpting, and absolute calendar punctuality. Choose your ritual and relax in an unhurried chair.'
                : 'Corte personalizado na tesoura, barba com toalha quente e atenção minuciosa aos detalhes. Escolha seu serviço e encontre o melhor horário para você.'}
            </p>

            {/* CTAs */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:bg-[#F39A3C] active:scale-[0.98] transition-all shadow-xl shadow-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Calendar className="w-5 h-5" />
                <span>{lang === 'en' ? 'Book an Appointment' : 'Agendar Meu Horário'}</span>
              </button>

              <a
                href="#servicos"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-border hover:border-primary text-foreground font-semibold text-base hover:bg-surface-raised active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary group"
              >
                <span>{lang === 'en' ? 'Explore Services' : 'Conhecer os Serviços'}</span>
                <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
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

          {/* Right Column: Editorial Photo Frame + 3D Emblem Overlay */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* 3D Shears / Razor Emblem floating over corner */}
            <div className="absolute -top-10 -left-10 md:-top-14 md:-left-12 z-20 hidden sm:block">
              <ThreeEmblem className="drop-shadow-2xl" />
            </div>

            {/* Photo Container Frame with precise aspect ratio and object position */}
            <div
              ref={imageFrameRef}
              className="relative w-full max-w-[420px] lg:max-w-none rounded-2xl overflow-hidden border border-border bg-card shadow-2xl shadow-black/80 group"
            >
              {/* Image Frame with gradient overlay */}
              <div className="aspect-[4/5] sm:aspect-[3/4] relative overflow-hidden">
                <img
                  src="/assets/hero/set_a_barber-at-work.webp"
                  alt={
                    lang === 'en'
                      ? 'Master barber at work with precision scissors in editorial barbershop'
                      : 'Barbeiro mestre trabalhando o corte com tesoura de precisão'
                  }
                  className="w-full h-full object-cover object-[center_28%] transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                  fetchPriority="high"
                />

                {/* Subtle lighting vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-transparent" />

                {/* Floating Bottom Card */}
                <div className="absolute bottom-5 inset-x-5 p-4 rounded-xl bg-card/90 backdrop-blur-md border border-border/80 flex items-center justify-between gap-3 shadow-lg">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-primary font-bold">
                      {lang === 'en' ? 'Heritage & Modernity' : 'Tradição & Técnica'}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {lang === 'en' ? 'Tailored to your facial lines' : 'Alinhado à sua anatomia'}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-sm">
                    45m
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
