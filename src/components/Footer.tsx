import React from 'react';
import { Scissors, Shield, Play, Pause } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  onOpenDemoModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  reducedMotion,
  setReducedMotion,
  onOpenDemoModal,
}) => {
  return (
    <footer className="bg-[#0C0B0A] text-foreground border-t border-border pt-16 pb-12">
      <div className="container-x">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-border/60">
          {/* Brand Info */}
          <div className="lg:col-span-5">
            <a href="#top" className="flex items-center gap-2.5 mb-4 group inline-flex">
              <div className="w-9 h-9 rounded-xl bg-surface-raised border border-border flex items-center justify-center text-primary group-hover:border-primary transition-colors">
                <Scissors className="w-5 h-5 -rotate-45" />
              </div>
              <span className="pirata text-3xl tracking-tight text-foreground group-hover:text-primary transition-colors">
                Aura Barbershop
              </span>
            </a>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mb-4">
              {lang === 'en'
                ? 'Editorial barbering sanctuary • Pinheiros, São Paulo · Tue–Fri 10h–20h · Sat 9h–18h'
                : 'Barbearia conceitual • Pinheiros, São Paulo · Ter–Sex 10h–20h · Sáb 9h–18h'}
            </p>

            <button
              onClick={onOpenDemoModal}
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'About this demonstration' : 'Sobre esta demonstração'}</span>
            </button>
          </div>

          {/* Nav Links */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-primary font-bold mb-4">
              {lang === 'en' ? 'Quick Navigation' : 'Navegação'}
            </h4>
            <ul className="grid grid-cols-2 gap-2.5 text-sm text-muted-foreground">
              <li>
                <a href="#experiencia" className="hover:text-primary transition-colors">
                  {lang === 'en' ? 'Craft Experience' : 'Experiência'}
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-primary transition-colors">
                  {lang === 'en' ? 'Services' : 'Serviços'}
                </a>
              </li>
              <li>
                <a href="#estilos" className="hover:text-primary transition-colors">
                  {lang === 'en' ? 'Styles Gallery' : 'Estilos'}
                </a>
              </li>
              <li>
                <a href="#equipe" className="hover:text-primary transition-colors">
                  {lang === 'en' ? 'Master Barbers' : 'Equipe'}
                </a>
              </li>
              <li>
                <a href="#agendar" className="hover:text-primary transition-colors font-bold text-foreground">
                  {lang === 'en' ? 'Book Online' : 'Agendar'}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Accessibility Motion Controls */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-primary font-bold mb-3">
              {lang === 'en' ? 'Motion Preference' : 'Preferência de Movimento'}
            </h4>
            <p className="text-xs text-muted-foreground mb-4">
              {lang === 'en'
                ? 'Toggle GSAP, smooth scroll, and entrance animations.'
                : 'Controle de acessibilidade para animações e rolagem.'}
            </p>

            <div className="inline-flex rounded-xl p-1 bg-surface-raised border border-border">
              <button
                onClick={() => setReducedMotion(false)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  !reducedMotion
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Play className="w-3 h-3" />
                <span>{lang === 'en' ? 'Full Motion' : 'Movimento completo'}</span>
              </button>
              <button
                onClick={() => setReducedMotion(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  reducedMotion
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Pause className="w-3 h-3" />
                <span>{lang === 'en' ? 'Reduced' : 'Movimento reduzido'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            {lang === 'en'
              ? 'Aura Barbershop is a fictitious editorial brand created for demonstration. Photos and profiles are illustrative. No actual appointments or charges occur.'
              : 'Aura Barbershop é uma marca fictícia criada para fins demonstrativos. Imagens e personagens são ilustrativos. Nenhuma reserva ou cobrança real é realizada.'}
          </p>

          <span className="font-mono shrink-0">© 2026 Aura Barbershop</span>
        </div>
      </div>
    </footer>
  );
};
