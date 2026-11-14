import React, { useRef } from 'react';
import { Compass, Sparkles, Sliders, Shield } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Language } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface AtmosphereProps {
  lang: Language;
}

export const Atmosphere: React.FC<AtmosphereProps> = ({ lang }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainPhotoRef = useRef<HTMLDivElement>(null);
  const secondaryPhotoRef = useRef<HTMLDivElement>(null);

  const pillars = [
    {
      icon: Compass,
      title: lang === 'en' ? 'You Co-Create The Cut' : 'Você Participa da Escolha',
      desc:
        lang === 'en'
          ? 'References, lifestyle habits, and face geometry are thoroughly analyzed before any blade moves.'
          : 'Referências, rotina e preferências entram na conversa antes do primeiro corte.',
    },
    {
      icon: Sliders,
      title: lang === 'en' ? 'Unhurried Craftsmanship' : 'Cada Etapa Recebe Atenção',
      desc:
        lang === 'en'
          ? 'Generous time blocked specifically for your seat. No overlapping clients or rushed scissor passes.'
          : 'Tempo reservado para cortar, ajustar e revisar sem pressa ou fila de espera.',
    },
    {
      icon: Shield,
      title: lang === 'en' ? 'Engineered To Last' : 'O Visual Acompanha Sua Rotina',
      desc:
        lang === 'en'
          ? 'Cut specifically with natural growth patterns so your hair and beard look clean weeks after.'
          : 'Você sai sabendo exatamente como manter o corte alinhado no seu dia a dia.',
    },
  ];

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      // Parallax scroll on atmospheric photos
      gsap.to(secondaryPhotoRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
        y: -40,
        ease: 'none',
      });

      // Pillars stagger entrance
      gsap.from('.atmosphere-pillar', {
        scrollTrigger: {
          trigger: '.atmosphere-pillars-list',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 35,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="section-y relative bg-[#121110] border-t border-border overflow-hidden">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Visual Showcase (Dual photo composition) */}
          <div className="lg:col-span-7 relative">
            <div
              ref={mainPhotoRef}
              className="relative rounded-3xl overflow-hidden border border-border/80 shadow-2xl bg-surface-raised group"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src="/assets/interior/set_a_barbershop-atmosphere.webp"
                  alt={lang === 'en' ? 'Aura barbershop interior ambiance' : 'Ambiente e cadeiras da barbearia'}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>

              {/* Overlay note */}
              <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-background/85 backdrop-blur-md border border-border text-xs text-primary font-mono font-bold">
                ✦ {lang === 'en' ? 'Editorial Studio Space' : 'Ambiente Conceitual em Pinheiros'}
              </div>
            </div>

            {/* Overlapping Detail Photo Card with Parallax */}
            <div
              ref={secondaryPhotoRef}
              className="hidden sm:block absolute -bottom-10 -right-6 w-3/5 rounded-3xl overflow-hidden border-2 border-border shadow-2xl bg-background group"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="/assets/interior/set_b_barbershop-atmosphere.webp"
                  alt={lang === 'en' ? 'Interior detail' : 'Detalhe do espaço'}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div className="p-3.5 bg-surface-raised/95 border-t border-border flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">
                  {lang === 'en' ? 'Vintage Leather Chairs & Calm Lighting' : 'Cadeiras de Couro & Iluminação Quente'}
                </span>
                <span className="text-[10px] font-mono text-primary font-bold">RITUAL</span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & 3 Core Pillars */}
          <div className="lg:col-span-5 lg:pl-6">
            <div className="eyebrow mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>{lang === 'en' ? 'The Atmosphere' : 'Ritual & Ambiente'}</span>
            </div>

            <h2 className="display text-4xl sm:text-5xl text-foreground uppercase tracking-tight mb-6 leading-tight">
              {lang === 'en' ? (
                <>
                  YOUR TIME. <span className="pill-word">FROM START TO FINISH.</span>
                </>
              ) : (
                <>
                  UM TEMPO SEU. <span className="pill-word">DO INÍCIO AO FIM.</span>
                </>
              )}
            </h2>

            <p className="text-base text-muted-foreground leading-relaxed mb-8">
              {lang === 'en'
                ? 'We designed our studio as a retreat from city noise. Freshly brewed coffee, warm acoustics, and barbers who respect your schedule as much as you do.'
                : 'Uma conversa para alinhar a ideia, cuidado durante o atendimento e uma finalização pensada para a sua rotina.'}
            </p>

            {/* 3 Pillars List with ScrollTrigger stagger */}
            <div className="atmosphere-pillars-list space-y-4">
              {pillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="atmosphere-pillar flex items-start gap-4 p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/50 transition-all hover:-translate-x-1"
                  >
                    <div className="w-10 h-10 rounded-xl bg-surface-raised border border-border flex items-center justify-center text-primary shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-foreground mb-1">
                        {pillar.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
