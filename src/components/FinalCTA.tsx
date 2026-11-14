import React, { useRef } from 'react';
import { Calendar, ArrowRight, Scissors } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FinalCTAProps {
  lang?: string;
  onOpenBooking: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenBooking }) => {
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
    <section
      ref={containerRef}
      className="relative py-28 md:py-36 bg-gradient-to-b from-[#141210] via-[#0E0D0B] to-[#080706] text-foreground overflow-hidden select-none border-t border-primary/30"
    >
      {/* Background ambient lighting vignette */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-primary/12 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 hairline opacity-60" />

      <div className="final-cta-content container-x relative text-center max-w-4xl mx-auto z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181613] border border-primary/40 text-primary text-xs uppercase font-mono font-bold tracking-widest mb-8 shadow-xl">
          <Scissors className="w-3.5 h-3.5 text-primary -rotate-45" />
          <span>Exclusive Grooming Atelier</span>
        </div>

        <h2 className="display text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-foreground mb-6 leading-[0.93]">
          YOUR NEXT SILHOUETTE DESERVES THIS <span className="pill-word">CRAFT.</span>
        </h2>

        <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Select your ritual, choose your master craftsman, and experience our unhurried appointment booking in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-xl bg-primary text-primary-foreground hover:bg-[#D4AF6A] hover:scale-105 active:scale-95 font-bold text-base shadow-2xl glow-gold transition-all"
          >
            <Calendar className="w-5 h-5 text-primary-foreground" />
            <span>Book Appointment</span>
            <ArrowRight className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
};
