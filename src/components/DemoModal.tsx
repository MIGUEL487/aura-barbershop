import React from 'react';
import { X, ShieldCheck, Sparkles, AlertTriangle, Database } from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: string;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl border border-border hover:border-primary text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 id="demo-modal-title" className="display text-2xl text-foreground uppercase tracking-tight">
            Prototype Transparency Statement
          </h3>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-normal">
          Aura Barbershop is an editorial front-end prototype crafted to demonstrate precision UI/UX layout, GSAP ScrollTrigger motion orchestration, Lenis smooth scrolling, and bespoke cutout composition.
        </p>

        <div className="space-y-4 text-xs sm:text-sm text-muted-foreground divide-y divide-border/60 mb-6">
          <div className="pt-3 first:pt-0 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground block">
                Editorial AI Visual Assets
              </strong>
              <span>
                All imagery, master barber portraits, cutouts, and interior atmosphere captures were created as high-fidelity demonstration media for this project kit.
              </span>
            </div>
          </div>

          <div className="pt-3 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground block">
                Simulated Calendar & Zero Charges
              </strong>
              <span>
                No live payment gateway is invoked, and no private data is collected or harvested. All time slots and reservation states exist purely in client session memory.
              </span>
            </div>
          </div>

          <div className="pt-3 flex items-start gap-3">
            <Database className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground block">
                Production-Ready Architecture
              </strong>
              <span>
                Engineered with modular, type-safe React & Tailwind components prepared for immediate production integration with Supabase, Stripe, or messaging APIs.
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:bg-[#D4AF6A] glow-gold transition-all"
        >
          Understood, Close Notice
        </button>
      </div>
    </div>
  );
};
