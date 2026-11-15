import React from 'react';
import { MARQUEE_WORDS_CRAFT, MARQUEE_WORDS_RITUAL } from '../data/barbershopData';

interface MarqueeProps {
  lang?: string;
  reverse?: boolean;
  variant?: 'craft' | 'ritual';
}

export const Marquee: React.FC<MarqueeProps> = ({ reverse = false, variant = 'craft' }) => {
  const words = variant === 'ritual' ? MARQUEE_WORDS_RITUAL : MARQUEE_WORDS_CRAFT;
  const trackWords = [...words, ...words, ...words, ...words];

  return (
    <div
      className="relative py-3.5 overflow-hidden select-none border-y border-[#C5A059]/20 bg-[#0E0D0B] shadow-inner"
    >
      {/* Subtle edge fade gradient mask */}
      <div className="absolute inset-y-0 left-0 w-20 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div
        className={`flex w-max ${
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        } hover:[animation-play-state:paused]`}
      >
        {trackWords.map((word, idx) => (
          <div key={`${variant}-${idx}`} className="flex items-center gap-6 px-5">
            <span
              className={`display text-lg sm:text-xl md:text-2xl tracking-wider uppercase font-black transition-colors ${
                idx % 2 === 0 ? 'text-[#C5A059]' : 'text-foreground/80'
              }`}
            >
              {word}
            </span>
            <span className="text-sm font-black text-[#C5A059]/40 select-none">
              ✦
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
