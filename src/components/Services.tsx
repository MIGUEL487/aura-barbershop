import React, { useRef } from 'react';
import { Clock, Check, ArrowRight, Sparkles } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SERVICES } from '../data/barbershopData';
import { Language, Service } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface ServicesProps {
  lang: Language;
  onSelectService: (serviceId: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ lang, onSelectService }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const serviceCutouts: Record<string, string> = {
    corte: '/assets/cutouts/fade-cutout.png',
    barba: '/assets/cutouts/hot-towel-cutout.png',
    combo: '/assets/cutouts/tools-cutout.png',
  };

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      gsap.fromTo(
        '.services-header',
        { y: 30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            once: true,
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
        }
      );

      const cards = gsap.utils.toArray<HTMLElement>('.service-card');
      gsap.fromTo(
        cards,
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 85%',
            once: true,
          },
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out',
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section id="servicos" ref={containerRef} className="section-y relative bg-[#0C0B0A] border-t border-border">
      <div className="container-x">
        {/* Header */}
        <div className="services-header flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="eyebrow mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>{lang === 'en' ? 'Craft Menu' : 'Cardápio de Serviços'}</span>
            </div>
            <h2 className="display text-4xl sm:text-5xl md:text-6xl text-foreground uppercase tracking-tight mb-4">
              {lang === 'en' ? (
                <>
                  CHOOSE YOUR <span className="pill-word">RITUAL.</span>
                </>
              ) : (
                <>
                  ESCOLHA SEU <span className="pill-word">RITUAL.</span>
                </>
              )}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {lang === 'en'
                ? 'Dedicated appointment blocks tailored to unhurried excellence. You leave with clean lines and peace of mind.'
                : 'Serviços com tempo reservado para fazer bem feito. Valores e horários claramente sinalizados.'}
            </p>
          </div>

          <div className="demo-tag self-start md:self-end">
            <span>{lang === 'en' ? 'Demonstration Pricing' : 'Valores Demonstrativos'}</span>
          </div>
        </div>

        {/* 3 Services Cards Grid */}
        <div className="services-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.map((service: Service, idx: number) => {
            const isCombo = service.id === 'combo';
            const cutoutImg = serviceCutouts[service.id];

            return (
              <div
                key={service.id}
                className={`service-card relative rounded-3xl border p-8 flex flex-col justify-between transition-all duration-500 group hover:-translate-y-2 glow-card ${
                  isCombo
                    ? 'border-primary/80 bg-gradient-to-b from-[#1F1A15] to-[#141210] shadow-2xl'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                {/* Popular / Discount Badge */}
                {service.badge && (
                  <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider shadow-lg glow-amber">
                    {lang === 'en' ? service.badge : service.badgePt}
                  </div>
                )}

                <div>
                  {/* Service Number & Duration */}
                  <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
                    <span className="text-primary font-bold">0{idx + 1} / SERVICE</span>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-raised border border-border">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span className="tnum font-medium text-foreground">{service.duration} min</span>
                    </div>
                  </div>

                  {/* Cutout Image Stage inside Service Card */}
                  <div className="relative w-full h-44 mb-6 rounded-2xl bg-surface-raised/40 border border-border/50 flex items-center justify-center p-3 overflow-hidden group-hover:border-primary/40 transition-colors">
                    <div className="absolute inset-0 bg-radial-gradient from-primary/10 via-transparent to-transparent opacity-60" />
                    <img
                      src={cutoutImg}
                      alt={service.name}
                      className="max-h-36 max-w-full object-contain cutout-shadow group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="display text-2xl sm:text-3xl text-foreground mb-3 uppercase leading-tight group-hover:text-primary transition-colors">
                    {lang === 'en' ? service.name : service.namePt}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {lang === 'en' ? service.description : service.descriptionPt}
                  </p>

                  {/* Feature Highlights */}
                  <div className="space-y-2.5 mb-8 text-xs text-muted-foreground border-t border-border/60 pt-5">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{lang === 'en' ? 'Personalized hair consultation' : 'Análise facial e de rotina'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{lang === 'en' ? 'Washing and conditioning' : 'Lavagem e produtos premium'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{lang === 'en' ? 'Straight razor detailing' : 'Acabamento navalhado'}</span>
                    </div>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="pt-6 border-t border-border flex flex-col gap-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs uppercase font-mono tracking-wider text-muted-foreground font-semibold">
                      {lang === 'en' ? 'Investment' : 'Valor Previsto'}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-primary font-bold">R$</span>
                      <span className="tnum display text-3xl sm:text-4xl text-primary font-bold">
                        {service.price}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectService(service.id)}
                    className={`w-full py-4 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                      isCombo
                        ? 'bg-primary text-primary-foreground hover:bg-[#FF8526] shadow-xl glow-amber'
                        : 'border border-border text-foreground hover:border-primary hover:bg-surface-raised'
                    }`}
                  >
                    <span>{lang === 'en' ? 'Book This Service' : 'Quero Este Serviço'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
