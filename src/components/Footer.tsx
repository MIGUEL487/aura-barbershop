import React from 'react';
import { Scissors, Shield, Play, Pause } from 'lucide-react';

interface FooterProps {
  lang?: string;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  onOpenDemoModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
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
              Editorial barbering sanctuary • Pinheiros, São Paulo · Tue–Fri 10:00–20:00 · Sat 09:00–18:00
            </p>

            <button
              onClick={onOpenDemoModal}
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Prototype Transparency Statement</span>
            </button>
          </div>

          {/* Nav Links */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-primary font-bold mb-4">
              Navigation
            </h4>
            <ul className="grid grid-cols-2 gap-2.5 text-sm text-muted-foreground">
              <li>
                <a href="#craft" className="hover:text-primary transition-colors">
                  The Craft
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-primary transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-primary transition-colors">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#barbers" className="hover:text-primary transition-colors">
                  Master Barbers
                </a>
              </li>
              <li>
                <a href="#booking" className="hover:text-primary transition-colors font-bold text-foreground">
                  Book Online
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
              Motion Experience
            </h4>
            <p className="text-xs text-muted-foreground mb-4">
              Toggle GSAP ScrollTrigger and Lenis smooth scrolling.
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
                <span>Full Motion</span>
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
                <span>Reduced</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            Aura Barbershop is an editorial prototype designed for design & technical demonstration. All portraits and profiles are illustrative. No actual payment or booking is transacted.
          </p>

          <span className="font-mono shrink-0">© 2026 Aura Barbershop</span>
        </div>
      </div>
    </footer>
  );
};
