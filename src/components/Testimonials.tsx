import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TESTIMONIALS } from '../data/barbershopData';
import { Language } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface TestimonialsProps {
  lang: Language;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ lang }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const current = TESTIMONIALS[currentIndex];

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      gsap.from('.testimonials-card', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="section-y relative bg-[#0E0D0C] border-t border-border overflow-hidden">
      <div className="container-x">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <div className="eyebrow mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>{lang === 'en' ? 'Client Experience' : 'O Cuidado Percebido'}</span>
            </div>
            <h2 className="display text-4xl sm:text-5xl text-foreground uppercase tracking-tight">
              {lang === 'en' ? (
                <>
                  THE CARE FELT IN EVERY <span className="pill-word">PASS.</span>
                </>
              ) : (
                <>
                  O CUIDADO PERCEBIDO EM CADA <span className="pill-word">PASSAGEM.</span>
                </>
              )}
            </h2>
          </div>

          <div className="demo-tag self-start md:self-end">
            <span>{lang === 'en' ? 'Simulated Reviews' : 'Relatos Demonstrativos Fictícios'}</span>
          </div>
        </div>

        {/* Carousel Card */}
        <div className="testimonials-card relative rounded-3xl border border-border bg-card p-8 md:p-14 shadow-2xl glow-card">
          <Quote className="w-12 h-12 text-primary mb-6 opacity-80" />

          {/* Quote Text */}
          <blockquote className="text-xl sm:text-2xl md:text-3xl font-medium text-foreground leading-relaxed mb-10 max-w-3xl">
            "{lang === 'en' ? current.quote : current.quotePt}"
          </blockquote>

          {/* Author & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-bold text-primary font-mono text-base">
                {current.initials}
              </div>
              <div>
                <p className="font-bold text-lg text-foreground">{current.author}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {lang === 'en' ? current.role : current.rolePt}
                </p>
              </div>
            </div>

            {/* Pagination & Arrows */}
            <div className="flex items-center gap-4 self-end sm:self-auto">
              <span className="text-xs font-mono text-muted-foreground font-bold">
                0{currentIndex + 1} / 0{TESTIMONIALS.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  className="p-3.5 rounded-xl border border-border bg-surface-raised hover:border-primary text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="p-3.5 rounded-xl border border-border bg-surface-raised hover:border-primary text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
