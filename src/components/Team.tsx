import React, { useRef } from 'react';
import { Calendar, Scissors, Award } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BARBERS } from '../data/barbershopData';
import { Barber } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface TeamProps {
  lang?: string;
  onSelectBarber: (barberId: string) => void;
}

export const Team: React.FC<TeamProps> = ({ onSelectBarber }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      gsap.fromTo(
        '.team-header',
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

      const cards = gsap.utils.toArray<HTMLElement>('.team-card');
      gsap.fromTo(
        cards,
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.team-grid',
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
    <section id="barbers" ref={containerRef} className="section-y relative bg-[#0C0B0A] border-t border-border">
      <div className="container-x">
        {/* Section Header */}
        <div className="team-header flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="eyebrow mb-4">
              <Scissors className="w-4 h-4 text-primary -rotate-45" />
              <span>The Craftsmen</span>
            </div>
            <h2 className="display text-4xl sm:text-5xl md:text-6xl text-foreground uppercase tracking-tight mb-4">
              WHO SHAPES YOUR <span className="pill-word">LOOK.</span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Select a craftsman whose focus matches your personal grooming goals, or choose any available seat during reservation.
            </p>
          </div>

          <div className="demo-tag self-start md:self-end">
            <span>Master Barbers</span>
          </div>
        </div>

        {/* Barbers Grid with Asymmetric Offset (Middle card slightly offset) */}
        <div className="team-grid grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {BARBERS.map((barber: Barber, idx: number) => {
            const isMiddle = idx === 1;

            return (
              <div
                key={barber.id}
                className={`team-card group relative rounded-3xl border border-border bg-card p-6 flex flex-col justify-between hover:border-primary/60 transition-all duration-500 shadow-xl ${
                  isMiddle ? 'md:translate-y-6 md:border-primary/40' : ''
                }`}
              >
                <div>
                  {/* Photo frame with smooth hover scale */}
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-surface-raised mb-6 relative">
                    <img
                      src={barber.avatar}
                      alt={barber.name}
                      className="w-full h-full object-cover object-[center_22%] group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-background/85 backdrop-blur-md border border-border text-[11px] font-mono font-bold text-primary">
                      0{idx + 1} • MASTER BARBER
                    </div>
                    <div className="absolute bottom-3.5 right-3.5 px-2.5 py-1 rounded-full bg-card/90 backdrop-blur-md border border-border text-[10px] font-mono text-muted-foreground flex items-center gap-1.5">
                      <Award className="w-3 h-3 text-primary" />
                      <span>{barber.experience}</span>
                    </div>
                  </div>

                  {/* Barber Info */}
                  <h3 className="display text-3xl text-foreground mb-1 uppercase tracking-tight group-hover:text-primary transition-colors">
                    {barber.name}
                  </h3>
                  <p className="text-sm font-semibold text-primary mb-3">
                    {barber.specialty}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-normal">
                    {barber.bio}
                  </p>
                </div>

                {/* Action */}
                <button
                  onClick={() => onSelectBarber(barber.id)}
                  className="w-full py-3.5 px-4 rounded-xl border border-border hover:border-primary bg-surface-raised hover:bg-primary hover:text-primary-foreground text-foreground font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] glow-gold"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reserve with {barber.name.split(' ')[0]}</span>
                  <span className="text-primary group-hover:text-primary-foreground">→</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
