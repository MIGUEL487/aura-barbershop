import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/barbershopData';
import { Language } from '../types';

interface TestimonialsProps {
  lang: Language;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ lang }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="section-y relative bg-card/40 border-t border-border overflow-hidden">
      <div className="container-x">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <div className="eyebrow mb-4">
              <span>{lang === 'en' ? 'Client Experience' : 'O Cuidado Percebido'}</span>
            </div>
            <h2 className="display text-4xl sm:text-5xl text-foreground uppercase tracking-tight">
              {lang === 'en' ? 'TESTIMONIALS & REVIEWS.' : 'DEPOIMENTOS DE QUEM FREQUENTA.'}
            </h2>
          </div>

          <div className="demo-tag self-start md:self-end">
            <span>{lang === 'en' ? 'Simulated Reviews' : 'Relatos Demonstrativos Fictícios'}</span>
          </div>
        </div>

        {/* Carousel Card */}
        <div className="relative rounded-2xl border border-border bg-card p-8 md:p-14 shadow-2xl">
          <Quote className="w-12 h-12 text-primary/40 mb-6" />

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
              <span className="text-xs font-mono text-muted-foreground">
                0{currentIndex + 1} / 0{TESTIMONIALS.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  className="p-3 rounded-xl border border-border bg-surface-raised hover:border-primary text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="p-3 rounded-xl border border-border bg-surface-raised hover:border-primary text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
