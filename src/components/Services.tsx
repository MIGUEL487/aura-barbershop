import React from 'react';
import { Clock, Check, ArrowRight } from 'lucide-react';
import { SERVICES } from '../data/barbershopData';
import { Language, Service } from '../types';

interface ServicesProps {
  lang: Language;
  onSelectService: (serviceId: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ lang, onSelectService }) => {
  return (
    <section id="servicos" className="section-y relative bg-background border-t border-border">
      <div className="container-x">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="eyebrow mb-4">
              <span>{lang === 'en' ? 'Craft Menu' : 'Cardápio de Serviços'}</span>
            </div>
            <h2 className="display text-4xl sm:text-5xl md:text-6xl text-foreground uppercase tracking-tight mb-4">
              {lang === 'en' ? 'CHOOSE YOUR RITUAL.' : 'ESCOLHA SEU RITUAL.'}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {lang === 'en'
                ? 'Dedicated appointment blocks tailored to unhurried excellence. You leave with clean lines and peace of mind.'
                : 'Serviços com tempo reservado para fazer bem feito. Valores e horários claramente sinalizados.'}
            </p>
          </div>

          <div className="demo-tag self-start md:self-end">
            <span>{lang === 'en' ? 'Demonstration Pricing' : 'Valores Demonstrativos'}</span>
          </div>
        </div>

        {/* 3 Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.map((service: Service, idx: number) => {
            const isCombo = service.id === 'combo';
            return (
              <div
                key={service.id}
                className={`relative rounded-2xl border p-8 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 ${
                  isCombo
                    ? 'border-primary/80 bg-surface-raised shadow-2xl shadow-primary/10'
                    : 'border-border bg-card hover:border-primary/40'
                }`}
              >
                {/* Popular / Discount Badge */}
                {service.badge && (
                  <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider shadow-md">
                    {lang === 'en' ? service.badge : service.badgePt}
                  </div>
                )}

                <div>
                  {/* Service Number & Duration */}
                  <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6">
                    <span className="text-primary font-bold">0{idx + 1} / SERVICE</span>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/60 border border-border">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span className="tnum font-medium text-foreground">{service.duration} min</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="display text-2xl sm:text-3xl text-foreground mb-3 uppercase leading-tight group-hover:text-primary transition-colors">
                    {lang === 'en' ? service.name : service.namePt}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                    {lang === 'en' ? service.description : service.descriptionPt}
                  </p>

                  {/* Feature Highlights */}
                  <div className="space-y-2.5 mb-8 text-xs text-muted-foreground border-t border-border/60 pt-6">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{lang === 'en' ? 'Personalized hair consultation' : 'Análise facial e de rotina'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{lang === 'en' ? 'Washing and conditioning' : 'Lavagem e produtos premium'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{lang === 'en' ? 'Straight razor detailing' : 'Acabamento navalhado'}</span>
                    </div>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="pt-6 border-t border-border flex flex-col gap-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      {lang === 'en' ? 'Investment' : 'Valor'}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-primary font-bold">R$</span>
                      <span className="tnum display text-3xl sm:text-4xl text-primary font-bold">
                        {service.price}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectService(service.id)}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                      isCombo
                        ? 'bg-primary text-primary-foreground hover:bg-[#F39A3C] shadow-lg shadow-primary/20'
                        : 'border border-border text-foreground hover:border-primary hover:bg-surface-raised'
                    }`}
                  >
                    <span>{lang === 'en' ? 'Book This Service' : 'Escolher Este Serviço'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
