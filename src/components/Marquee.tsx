import React from 'react';
import { MARQUEE_WORDS, MARQUEE_WORDS_PT } from '../data/barbershopData';
import { Language } from '../types';

interface MarqueeProps {
  lang: Language;
}

export const Marquee: React.FC<MarqueeProps> = ({ lang }) => {
  const words = lang === 'en' ? MARQUEE_WORDS : MARQUEE_WORDS_PT;

  // Duplicate items for continuous seamless loop
  const trackWords = [...words, ...words, ...words];

  return (
    <div className="relative py-4 bg-primary text-primary-foreground overflow-hidden border-y border-primary-deep select-none shadow-md">
      {/* Top Track (Left to Right) */}
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {trackWords.map((word, idx) => (
          <div key={`m1-${idx}`} className="flex items-center gap-6 px-4">
            <span className="display text-xl sm:text-2xl md:text-3xl tracking-wide uppercase font-bold text-primary-foreground">
              {word}
            </span>
            <span className="text-primary-deep text-lg font-black select-none">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};
