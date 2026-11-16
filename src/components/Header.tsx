import React, { useState, useEffect } from 'react';
import { Menu, X, Scissors, Calendar } from 'lucide-react';

interface HeaderProps {
  onOpenBooking: () => void;
  isVisible?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBooking, isVisible = false }) => {
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
    { href: '#craft', label: 'The Craft' },
    { href: '#services', label: 'Services' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#barbers', label: 'Master Barbers' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-out transform ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto visible'
          : 'opacity-0 -translate-y-full pointer-events-none invisible'
      } ${
        isScrolled
          ? 'bg-[#0E0D0B]/92 backdrop-blur-md border-b border-border shadow-2xl py-3.5'
          : 'bg-[#0E0D0B]/80 backdrop-blur-sm border-b border-border/50 py-4'
      }`}
    >
      <div className="container-x flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <a
          href="#top"
          className="flex items-center gap-3 text-foreground group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
        >
          <div className="w-9 h-9 rounded-xl bg-surface-raised border border-border flex items-center justify-center text-primary group-hover:border-primary transition-colors shadow-sm">
            <Scissors className="w-4 h-4 -rotate-45" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-serif text-2xl md:text-3xl tracking-tight leading-none text-foreground group-hover:text-primary transition-colors">
              Moda Barbershop
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

        {/* Actions: Booking CTA & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Desktop CTA in Brushed Gold */}
          <button
            onClick={onOpenBooking}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-[#CDB173] active:scale-[0.98] transition-all glow-gold shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
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

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border mt-3 py-4 px-6 bg-[#13110E] flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-base text-foreground hover:text-primary py-2 font-medium"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBooking();
            }}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      )}
    </header>
  );
};
