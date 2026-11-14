import React, { useState, useEffect } from 'react';
import { Menu, X, Scissors, Calendar, Globe } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenBooking: () => void;
}

export const Header: React.FC<HeaderProps> = ({ lang, setLang, onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#experiencia', label: lang === 'en' ? 'Craft' : 'Experiência' },
    { href: '#servicos', label: lang === 'en' ? 'Services' : 'Serviços' },
    { href: '#estilos', label: lang === 'en' ? 'Gallery' : 'Estilos' },
    { href: '#equipe', label: lang === 'en' ? 'Barbers' : 'Equipe' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <>
      {/* Top Demo Disclaimer Banner */}
      <div className="w-full bg-[#161412] border-b border-border/40 py-1.5 px-4 text-center">
        <p className="text-[11px] sm:text-xs text-muted-foreground font-medium tracking-wider uppercase flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          {lang === 'en'
            ? 'Demonstration Project • Simulated Booking Only • No Live Charges'
            : 'Projeto Demonstrativo • Agendamento Simulado • Sem Cobrança Real'}
        </p>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/90 backdrop-blur-md border-b border-border shadow-lg shadow-black/40 py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container-x flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <a
            href="#top"
            className="flex items-center gap-2.5 text-foreground group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          >
            <div className="w-9 h-9 rounded-xl bg-surface-raised border border-border flex items-center justify-center text-primary group-hover:border-primary transition-colors">
              <Scissors className="w-5 h-5 -rotate-45" />
            </div>
            <div className="flex flex-col">
              <span className="pirata text-2xl md:text-3xl tracking-tight leading-none text-foreground group-hover:text-primary transition-colors">
                Aura Barbershop
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                Pinheiros • São Paulo
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors relative py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions: Lang toggle & Booking CTA */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'pt' : 'en')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-border hover:border-primary text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              title="Toggle Language / Alternar Idioma"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* Desktop CTA */}
            <button
              onClick={onOpenBooking}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-[#F39A3C] active:scale-[0.98] transition-all shadow-md shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Calendar className="w-4 h-4" />
              <span>{lang === 'en' ? 'Book Appointment' : 'Agendar Horário'}</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-border text-foreground hover:bg-surface-raised transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[calc(100%+1px)] bg-background/95 backdrop-blur-xl border-b border-border shadow-2xl px-6 py-8 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col gap-4 divide-y divide-border/50 text-base font-medium">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="pt-3 first:pt-0 text-foreground hover:text-primary transition-colors flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <span className="text-xs text-muted-foreground font-mono">→</span>
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-border flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base shadow-lg shadow-primary/20"
              >
                <Calendar className="w-5 h-5" />
                <span>{lang === 'en' ? 'Book Appointment' : 'Agendar Horário'}</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
