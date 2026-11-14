import React from 'react';
import { Language } from '../types';

interface MarqueeProps {
  lang: Language;
  reverse?: boolean;
  variant?: 'craft' | 'ritual';
}

export const Marquee: React.FC<MarqueeProps> = ({ lang, reverse = false, variant = 'craft' }) => {
  const craftWordsEn = [
    'CUSTOM PRECISION CUT',
    'HOT TOWEL BEARD SCULPT',
    'PINHEIROS, SÃO PAULO',
    'BY APPOINTMENT ONLY',
    'IMPECCABLE SCISSOR DETAIL',
    'UNHURRIED CRAFT',
  ];

  const craftWordsPt = [
    'CORTE PERSONALIZADO',
    'BARBA COM TOALHA QUENTE',
    'PINHEIROS, SÃO PAULO',
    'ATENDIMENTO COM HORA MARCADA',
    'ACABAMENTO IMPECÁVEL',
    'CAFEZINHO E CONVERSA BOA',
  ];

  const ritualWordsEn = [
    'THE AURA RITUAL',
    'SHEARS, CLIPPERS & RAZOR',
    'FRESH BREWED COFFEE',
    'DETAILS THAT ELEVATE',
    'YOUR UNHURRIED MOMENT',
  ];

  const ritualWordsPt = [
    'RITUAL AURA BARBERSHOP',
    'TESOURA, MÁQUINA E NAVALHA',
    'CAFÉ FRESCO NA ESPERA',
    'DETALHES QUE FAZEM DIFERENÇA',
    'O SEU MOMENTO DE CUIDADO',
  ];

  const words =
    variant === 'ritual'
      ? lang === 'en'
        ? ritualWordsEn
        : ritualWordsPt
      : lang === 'en'
      ? craftWordsEn
      : craftWordsPt;

  // Duplicate items for continuous seamless loop
  const trackWords = [...words, ...words, ...words, ...words];

  return (
    <div className="relative py-3.5 bg-primary text-primary-foreground overflow-hidden border-y border-primary-deep select-none shadow-md">
      <div
        className={`flex w-max ${
          reverse ? 'animate-marquee-reverse' : 'animate-marquee'
        } hover:[animation-play-state:paused]`}
      >
        {trackWords.map((word, idx) => (
          <div key={`${variant}-${idx}`} className="flex items-center gap-6 px-4">
            <span className="display text-xl sm:text-2xl tracking-wide uppercase font-black text-primary-foreground">
              {word}
            </span>
            <span className="text-primary-deep text-base font-black select-none">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};
