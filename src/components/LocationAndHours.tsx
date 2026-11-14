import React from 'react';
import { MapPin, Clock, Navigation } from 'lucide-react';
import { Language } from '../types';

interface LocationAndHoursProps {
  lang: Language;
  onOpenBooking: () => void;
}

export const LocationAndHours: React.FC<LocationAndHoursProps> = ({ lang, onOpenBooking }) => {
  return (
    <section className="section-y relative bg-card/20 border-t border-border">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Stylized Map Graphic Card */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden border border-border bg-[#151412] p-8 sm:p-12 shadow-2xl flex flex-col justify-between min-h-[380px] group">
              {/* Map grid lines background pattern */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(rgba(244, 242, 236, 0.25) 1px, transparent 1px), linear-gradient(to right, rgba(244, 242, 236, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(244, 242, 236, 0.05) 1px, transparent 1px)`,
                  backgroundSize: '24px 24px, 48px 48px, 48px 48px',
                }}
              />

              {/* Pinheiros Stylized Street Vector Graphics */}
              <svg
                className="absolute inset-0 w-full h-full opacity-30 stroke-primary/50 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M-50,150 Q180,80 320,240 T700,120" fill="none" strokeWidth="2.5" />
                <path d="M120,-30 L280,450" fill="none" strokeWidth="1.5" strokeDasharray="4 4" />
                <path d="M300,200 L550,380" fill="none" strokeWidth="2" />
                <circle cx="320" cy="240" r="8" fill="#E68A2E" className="animate-ping" />
                <circle cx="320" cy="240" r="6" fill="#E68A2E" />
              </svg>

              {/* Top tag */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="demo-tag">
                  <Navigation className="w-3.5 h-3.5 text-primary" />
                  <span>{lang === 'en' ? 'Demonstration Map' : 'Mapa Conceitual Ilustrativo'}</span>
                </div>
                <span className="text-xs font-mono text-muted-foreground uppercase">
                  Pinheiros • Zona Oeste
                </span>
              </div>

              {/* Center Location Pin Badge */}
              <div className="relative z-10 my-8 self-center sm:self-start bg-card/90 backdrop-blur-md border border-border p-5 rounded-2xl max-w-sm shadow-xl">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-base">Aura Barbershop Studio</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {lang === 'en'
                        ? 'Rua dos Pinheiros (Illustrative Location) • Near Fradique Coutinho Metro'
                        : 'Rua dos Pinheiros (Localização Ilustrativa) • Próximo ao Metrô Fradique Coutinho'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Note */}
              <div className="relative z-10 text-[11px] text-muted-foreground/80 font-mono">
                {lang === 'en'
                  ? 'Fictional studio address created for demonstration purposes.'
                  : 'Endereço conceitual demonstrativo sem atendimento físico real.'}
              </div>
            </div>
          </div>

          {/* Right: Studio Hours & Visiting Information */}
          <div className="lg:col-span-5 lg:pl-4">
            <div className="eyebrow mb-4">
              <Clock className="w-4 h-4 text-primary" />
              <span>{lang === 'en' ? 'Operating Hours' : 'Horários & Funcionamento'}</span>
            </div>

            <h2 className="display text-4xl sm:text-5xl text-foreground uppercase tracking-tight mb-6">
              {lang === 'en' ? 'BY APPOINTMENT ONLY.' : 'ATENDIMENTO COM HORA MARCADA.'}
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-8">
              {lang === 'en'
                ? 'We operate strictly on reserved calendar slots so every customer receives undivided attention and zero waiting time in the chair.'
                : 'Trabalhamos exclusivamente com horário reservado para garantir pontualidade e dedicação total durante o seu ritual.'}
            </p>

            {/* Schedule List */}
            <div className="space-y-3 mb-8">
              <div className="p-4 rounded-xl border border-border bg-card flex items-center justify-between">
                <span className="font-semibold text-foreground text-sm">
                  {lang === 'en' ? 'Tuesday – Friday' : 'Terça a Sexta-feira'}
                </span>
                <span className="font-mono text-primary text-sm font-bold">10:00 — 20:00</span>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card flex items-center justify-between">
                <span className="font-semibold text-foreground text-sm">
                  {lang === 'en' ? 'Saturday' : 'Sábado'}
                </span>
                <span className="font-mono text-primary text-sm font-bold">09:00 — 18:00</span>
              </div>

              <div className="p-4 rounded-xl border border-border/50 bg-surface-raised/40 flex items-center justify-between text-muted-foreground">
                <span className="font-medium text-sm">
                  {lang === 'en' ? 'Sunday & Monday' : 'Domingo e Segunda-feira'}
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground/60">
                  {lang === 'en' ? 'Closed' : 'Fechado'}
                </span>
              </div>
            </div>

            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:bg-[#F39A3C] transition-all"
            >
              <span>{lang === 'en' ? 'Reserve an Open Slot' : 'Escolher um Horário'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
