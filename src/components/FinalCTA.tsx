import React, { useRef } from 'react';
import { Calendar, ArrowRight, Scissors } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Language } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface FinalCTAProps {
  lang: Language;
  onOpenBooking: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ lang, onOpenBooking }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      gsap.from('.final-cta-content', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        scale: 0.96,
        duration: 0.9,
        ease: 'power3.out',
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="relative py-28 md:py-36 bg-[#FF6E00] text-[#0E0D0C] overflow-hidden select-none">
      {/* Background ambient lighting vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/25 pointer-events-none" />

      <div className="final-cta-content container-x relative text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E0D0C] text-[#F5F4F0] text-xs uppercase font-mono font-bold tracking-widest mb-8 shadow-xl">
          <Scissors className="w-3.5 h-3.5 text-[#FF6E00]" />
          <span>{lang === 'en' ? 'Exclusive Grooming' : 'Cuidado Exclusivo'}</span>
        </div>

        <h2 className="display text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-[#0E0D0C] mb-6 leading-[0.93]">
          {lang === 'en' ? (
            <>
              YOUR NEXT SILHOUETTE DESERVES THIS <span className="underline decoration-4 decoration-[#0E0D0C]">CRAFT.</span>
            </>
          ) : (
            <>
              SEU PRÓXIMO VISUAL MERECE ESSE <span className="underline decoration-4 decoration-[#0E0D0C]">CUIDADO.</span>
            </>
          )}
        </h2>

        <p className="text-base sm:text-xl text-[#1A1816] max-w-2xl mx-auto mb-10 leading-relaxed font-semibold">
          {lang === 'en'
            ? 'Choose your service, select your craftsman, and test our unhurried booking demonstration in seconds.'
            : 'Escolha seu serviço e experimente o agendamento da Aura Barbershop em poucos passos.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-2xl bg-[#0E0D0C] text-[#F5F4F0] hover:bg-[#1A1715] hover:scale-105 active:scale-95 font-bold text-base shadow-2xl transition-all"
          >
            <Calendar className="w-5 h-5 text-[#FF6E00]" />
            <span>{lang === 'en' ? 'Book Demonstration Slot' : 'Agendar Meu Horário'}</span>
            <ArrowRight className="w-4 h-4 text-[#FF6E00]" />
          </button>
        </div>
      </div>
    </section>
  );
};
