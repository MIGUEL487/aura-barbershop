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
          ? 'Your lifestyle, face shape, and natural hair texture guide the tailored blueprint before cutting.'
          : 'Seu estilo, sua rotina e a textura do seu cabelo orientam o corte antes da primeira tesourada.',
      image: '/assets/process/set_a_precision-fade.webp',
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
      image: '/assets/process/set_b_precision-fade.webp',
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
      image: '/assets/process/set_a_hot-towel.webp',
      detail: lang === 'en' ? 'Signature Hot Towel Finish' : 'Ritual de toalha quente',
    },
  ];

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const cards = gsap.utils.toArray<HTMLElement>('.story-step-card');

      cards.forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
            onEnter: () => setActiveStep(index),
            onEnterBack: () => setActiveStep(index),
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <section id="experiencia" ref={containerRef} className="section-y relative bg-card/40 border-t border-border">
      <div className="container-x">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="eyebrow mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>{lang === 'en' ? 'The Ritual & Story' : 'O Cuidado nos Detalhes'}</span>
          </div>
          <h2 className="display text-4xl sm:text-5xl md:text-6xl text-foreground uppercase tracking-tight mb-5">
            {lang === 'en' ? 'HOW WE ELEVATE YOUR GROOMING.' : 'O CUIDADO ESTÁ NOS DETALHES.'}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {lang === 'en'
              ? 'Three deliberate chapters designed to respect your time, listen to your desires, and leave you feeling energized.'
              : 'Três etapas visuais pensadas para valorizar o seu tempo, alinhar a ideia e entregar um resultado que permanece nos próximos dias.'}
          </p>
        </div>

        {/* Desktop Sticky Progress Indicators */}
        <div className="hidden md:grid grid-cols-3 gap-6 mb-12">
          {steps.map((st, i) => (
            <button
              key={st.num}
              onClick={() => setActiveStep(i)}
              className={`p-4 rounded-xl border transition-all text-left flex items-start justify-between ${
                activeStep === i
                  ? 'border-primary bg-primary/10 shadow-lg shadow-primary/5'
                  : 'border-border bg-card/60 hover:border-border/80'
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.num}
              className="story-step-card flex flex-col rounded-2xl border border-border bg-card overflow-hidden group hover:border-primary/50 transition-all duration-300"
            >
              {/* Step Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-raised">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
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
