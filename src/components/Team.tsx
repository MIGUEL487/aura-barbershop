import React from 'react';
import { Calendar, Scissors } from 'lucide-react';
import { BARBERS } from '../data/barbershopData';
import { Language, Barber } from '../types';

interface TeamProps {
  lang: Language;
  onSelectBarber: (barberId: string) => void;
}

export const Team: React.FC<TeamProps> = ({ lang, onSelectBarber }) => {
  return (
    <section id="equipe" className="section-y relative bg-background border-t border-border">
      <div className="container-x">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="eyebrow mb-4">
              <Scissors className="w-4 h-4 text-primary -rotate-45" />
              <span>{lang === 'en' ? 'Master Craftspeople' : 'Equipe de Mestres'}</span>
            </div>
            <h2 className="display text-4xl sm:text-5xl md:text-6xl text-foreground uppercase tracking-tight mb-4">
              {lang === 'en' ? 'CHOOSE YOUR BARBER.' : 'CONHEÇA NOSSOS PROFISSIONAIS.'}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {lang === 'en'
                ? 'Select a barber whose specialty matches your vision, or choose "Any Available" during booking.'
                : 'Conheça os perfis e escolha com quem você quer agendar seu atendimento.'}
            </p>
          </div>

          <div className="demo-tag self-start md:self-end">
            <span>{lang === 'en' ? 'Fictional Demo Profiles' : 'Personagens Fictícios para Demonstração'}</span>
          </div>
        </div>

        {/* Barbers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BARBERS.map((barber: Barber, idx: number) => (
            <div
              key={barber.id}
              className="group relative rounded-2xl border border-border bg-card p-6 flex flex-col justify-between hover:border-primary/50 transition-all duration-300"
            >
              <div>
                {/* Photo frame */}
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-surface-raised mb-6 relative">
                  <img
                    src={barber.avatar}
                    alt={barber.name}
                    className="w-full h-full object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-background/85 backdrop-blur-md border border-border text-[11px] font-mono font-bold text-primary">
                    0{idx + 1} • MASTER BARBER
                  </div>
                </div>

                {/* Barber Info */}
                <h3 className="display text-3xl text-foreground mb-1 uppercase tracking-tight group-hover:text-primary transition-colors">
                  {barber.name}
                </h3>
                <p className="text-sm font-semibold text-primary mb-3">
                  {lang === 'en' ? barber.specialty : barber.specialtyPt}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {lang === 'en' ? barber.bio : barber.bioPt}
                </p>
              </div>

              {/* Action */}
              <button
                onClick={() => onSelectBarber(barber.id)}
                className="w-full py-3 px-4 rounded-xl border border-border hover:border-primary bg-surface-raised hover:bg-primary hover:text-primary-foreground text-foreground font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4" />
                <span>
                  {lang === 'en' ? `Book with ${barber.name.split(' ')[0]}` : `Agendar com ${barber.name}`}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
