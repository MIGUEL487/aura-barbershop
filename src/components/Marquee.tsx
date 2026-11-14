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

  const isRitual = variant === 'ritual';

  return (
    <div
      className={`relative py-3.5 overflow-hidden select-none border-y ${
        isRitual
          ? 'bg-[#12110F] text-[#C5A059] border-border/80 shadow-inner'
          : 'bg-primary text-primary-foreground border-primary-deep shadow-md'
      }`}
    >
      <div
        className={`flex w-max ${
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        } hover:[animation-play-state:paused]`}
      >
        {trackWords.map((word, idx) => (
          <div key={`${variant}-${idx}`} className="flex items-center gap-6 px-4">
            <span
              className={`display text-xl sm:text-2xl tracking-wide uppercase font-black ${
                isRitual ? 'text-primary' : 'text-primary-foreground'
              }`}
            >
              {word}
            </span>
            <span
              className={`text-base font-black select-none ${
                isRitual ? 'text-muted-foreground/50' : 'text-primary-deep'
              }`}
            >
              ✦
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
