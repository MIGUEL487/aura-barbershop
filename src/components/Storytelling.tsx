import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Check, ChevronRight } from 'lucide-react';
import { Language } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface StorytellingProps {
  lang: Language;
}

export const Storytelling: React.FC<StorytellingProps> = ({ lang }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      tag: lang === 'en' ? 'Understand' : 'Entender',
      title: lang === 'en' ? 'Before the scissors, a conversation.' : 'Antes da tesoura, uma conversa.',
      text:
        lang === 'en'
          ? 'Your lifestyle, face geometry, and natural hair texture guide the tailored blueprint before cutting.'
          : 'Seu estilo, sua rotina e a textura do seu cabelo orientam o corte antes da primeira tesourada.',
      image: '/assets/cutouts/fade-cutout.png',
      detail: lang === 'en' ? 'Facial Anatomy Analysis' : 'Análise da estrutura facial',
    },
    {
      num: '02',
      tag: lang === 'en' ? 'Execute' : 'Executar',
      title: lang === 'en' ? 'Precision in every pass.' : 'Precisão em cada passagem.',
      text:
        lang === 'en'
          ? 'Sculpting clean tapers, scissor transitions, and weight balance with steady razor craftsmanship.'
          : 'Forma, proporção e acabamento tratados com atenção milimétrica e tesoura afiada.',
      image: '/assets/cutouts/scissor-craft-cutout.png',
      detail: lang === 'en' ? 'Seamless Gradient Fades' : 'Degradês e transições limpas',
    },
    {
      num: '03',
      tag: lang === 'en' ? 'Refine' : 'Finalizar',
      title: lang === 'en' ? 'The detail elevates the whole.' : 'O detalhe muda o conjunto.',
      text:
        lang === 'en'
          ? 'Steamed hot towel relaxation, straight razor neck cleanup, and clear advice to maintain the look at home.'
          : 'Finalização cuidadosa com toalha quente, navalha e orientações para manter o visual no dia a dia.',
      image: '/assets/cutouts/hot-towel-cutout.png',
      detail: lang === 'en' ? 'Signature Hot Towel Finish' : 'Ritual de toalha quente',
    },
  ];

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      // Section header reveal
      gsap.from('.story-header', {
        scrollTrigger: {
          trigger: '.story-header',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Cards stagger animation with ScrollTrigger
      const cards = gsap.utils.toArray<HTMLElement>('.story-step-card');
      gsap.from(cards, {
        scrollTrigger: {
          trigger: '.story-cards-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 60,
        opacity: 0,
        stagger: 0.18,
        duration: 0.9,
        ease: 'power3.out',
      });

      // Subtle parallax on cutouts inside cards
      cards.forEach((card) => {
        const img = card.querySelector('.story-cutout-img');
        if (img) {
          gsap.to(img, {
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
            y: -15,
            ease: 'none',
          });
        }
      });
    },
    { scope: containerRef }
  );

  return (
    <section id="experiencia" ref={containerRef} className="section-y relative bg-card/40 border-t border-border">
      <div className="container-x">
        {/* Section Header with Pill Word */}
        <div className="story-header max-w-3xl mb-16">
          <div className="eyebrow mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>{lang === 'en' ? 'The Ritual & Story' : 'O Cuidado nos Detalhes'}</span>
          </div>
          <h2 className="display text-4xl sm:text-5xl md:text-6xl text-foreground uppercase tracking-tight mb-5">
            {lang === 'en' ? (
              <>
                THE CRAFT IS IN THE <span className="pill-word">DETAILS.</span>
              </>
            ) : (
              <>
                O CUIDADO ESTÁ NOS <span className="pill-word">DETALHES.</span>
              </>
            )}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {lang === 'en'
              ? 'Three deliberate chapters designed to respect your time, listen to your desires, and leave you feeling revitalized.'
              : 'Três etapas visuais pensadas para valorizar o seu tempo, alinhar a ideia e entregar um resultado que permanece impecável.'}
          </p>
        </div>

        {/* Desktop Interactive Progress Steps */}
        <div className="hidden md:grid grid-cols-3 gap-6 mb-12">
          {steps.map((st, i) => (
            <button
              key={st.num}
              onClick={() => setActiveStep(i)}
              className={`p-4 rounded-2xl border transition-all text-left flex items-start justify-between ${
                activeStep === i
                  ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
                  {st.num} / {st.tag}
                </span>
                <p className="font-semibold text-sm mt-1 text-foreground">{st.detail}</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                  activeStep === i ? 'bg-primary text-primary-foreground font-bold' : 'bg-surface-raised text-muted-foreground'
                }`}
              >
                {activeStep > i ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
            </button>
          ))}
        </div>

        {/* 3 Story Steps Cards Grid */}
        <div className="story-cards-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.num}
              className="story-step-card flex flex-col rounded-3xl border border-border bg-card overflow-hidden group hover:border-primary/60 transition-all duration-500 shadow-xl"
            >
              {/* Step Cutout Stage with Warm Vignette Backplate */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-[#1C1A16] to-[#121110] flex items-center justify-center p-4">
                {/* Background radial highlight */}
                <div className="absolute inset-0 bg-radial-gradient from-primary/10 via-transparent to-transparent opacity-80" />

                <img
                  src={step.image}
                  alt={step.title}
                  className="story-cutout-img max-h-[85%] max-w-[90%] object-contain cutout-shadow group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />

                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/85 backdrop-blur-md border border-border text-xs font-mono font-bold text-primary">
                  {step.num} • {step.tag.toUpperCase()}
                </div>
              </div>

              {/* Step Content */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="display text-2xl text-foreground mb-3 leading-tight uppercase group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 font-normal">
                    {step.text}
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                  <span>{step.detail}</span>
                  <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
