import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQ_ITEMS } from '../data/barbershopData';
import { Language, FAQItem } from '../types';

interface FAQProps {
  lang: Language;
}

export const FAQ: React.FC<FAQProps> = ({ lang }) => {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="section-y relative bg-background border-t border-border">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Heading */}
          <div className="lg:col-span-5">
            <div className="eyebrow mb-4">
              <HelpCircle className="w-4 h-4 text-primary" />
              <span>{lang === 'en' ? 'Common Questions' : 'Dúvidas Frequentes'}</span>
            </div>
            <h2 className="display text-4xl sm:text-5xl text-foreground uppercase tracking-tight mb-4">
              {lang === 'en' ? 'FREQUENTLY ASKED QUESTIONS.' : 'TUDO SOBRE A EXPERIÊNCIA.'}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {lang === 'en'
                ? 'Clear answers regarding our appointment protocol, barber matching, duration, and demonstration status.'
                : 'Respostas diretas sobre como funciona nosso agendamento, atendimento e regras demonstrativas.'}
            </p>
          </div>

          {/* Right Column: Accordion List */}
          <div className="lg:col-span-7 space-y-4">
            {FAQ_ITEMS.map((item: FAQItem, idx: number) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen ? 'border-primary/60 bg-card shadow-lg' : 'border-border bg-card/40 hover:border-border/80'
                  }`}
                >
                  <button
                    onClick={() => toggle(item.id)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono font-bold text-primary">0{idx + 1}</span>
                      <h3 className="font-bold text-base sm:text-lg text-foreground">
                        {lang === 'en' ? item.question : item.questionPt}
                      </h3>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full bg-surface-raised border border-border flex items-center justify-center text-muted-foreground shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-primary border-primary' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-muted-foreground leading-relaxed border-t border-border/40 animate-in fade-in duration-200">
                      <p>{lang === 'en' ? item.answer : item.answerPt}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
