import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Language } from '../types';

interface FinalCTAProps {
  lang: Language;
  onOpenBooking: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ lang, onOpenBooking }) => {
  return (
    <section className="relative py-24 md:py-32 bg-primary text-primary-foreground overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/15 via-transparent to-black/20 pointer-events-none" />

      <div className="container-x relative text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-deep/50 border border-black/20 text-xs uppercase font-mono font-bold tracking-widest text-primary-foreground mb-6">
          <span>{lang === 'en' ? 'Exclusive Grooming' : 'Cuidado Exclusivo'}</span>
        </div>

        <h2 className="display text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight text-primary-foreground mb-6 leading-[0.95]">
          {lang === 'en'
            ? 'YOUR NEXT SILHOUETTE DESERVES THIS CRAFT.'
            : 'SEU PRÓXIMO VISUAL MERECE ESSE CUIDADO.'}
        </h2>

        <p className="text-base sm:text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          {lang === 'en'
            ? 'Choose your service, select your craftsman, and test our unhurried booking demonstration in seconds.'
            : 'Escolha seu serviço e experimente o agendamento da Aura Barbershop em poucos passos.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-background text-foreground hover:bg-surface-raised font-bold text-base shadow-2xl transition-all active:scale-[0.98]"
          >
            <Calendar className="w-5 h-5 text-primary" />
            <span>{lang === 'en' ? 'Book Demonstration Slot' : 'Agendar Meu Horário'}</span>
            <ArrowRight className="w-4 h-4 text-primary" />
          </button>
        </div>
      </div>
    </section>
  );
};
