import React from 'react';
import { X, ShieldCheck, Sparkles, AlertTriangle, Database } from 'lucide-react';
import { Language } from '../types';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
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
            {lang === 'en' ? 'About This Demonstration' : 'Sobre Esta Demonstração'}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          {lang === 'en'
            ? 'Aura Barbershop is an editorial demonstration template built to showcase precision front-end design, GSAP ScrollTrigger motion, smooth Lenis scrolling, and Three.js 3D craft details.'
            : 'Aura Barbershop é um projeto demonstrativo de alta fidelidade visual criado para apresentar design editorial premium, motion fluido com GSAP, Lenis e elemento 3D sutil com Three.js.'}
        </p>

        <div className="space-y-4 text-xs sm:text-sm text-muted-foreground divide-y divide-border/60 mb-6">
          <div className="pt-3 first:pt-0 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground block">
                {lang === 'en' ? 'Illustrative AI Photography' : 'Fotografias Ilustrativas por IA'}
              </strong>
              <span>
                {lang === 'en'
                  ? 'All barbershop photos, portraits, and process shots are AI-generated demonstration assets from the project kit.'
                  : 'Todas as imagens de barbeiros, cortes e interiores são materiais ilustrativos gerados por IA inclusos no kit.'}
              </span>
            </div>
          </div>

          <div className="pt-3 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground block">
                {lang === 'en' ? 'Simulated Calendar & Zero Charges' : 'Agendamento Simulado e Sem Cobrança'}
              </strong>
              <span>
                {lang === 'en'
                  ? 'No real database appointments or financial transactions take place. Your input is stored only in client memory.'
                  : 'Nenhuma reserva real ou cobrança de cartão é realizada. Os dados informados existem apenas na sessão atual do navegador.'}
              </span>
            </div>
          </div>

          <div className="pt-3 flex items-start gap-3">
            <Database className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground block">
                {lang === 'en' ? 'Production Ready Architecture' : 'Arquitetura Pronta para Produção'}
              </strong>
              <span>
                {lang === 'en'
                  ? 'Clean modular TypeScript components prepared for instant backend integration with Supabase, Stripe, or WhatsApp notification APIs.'
                  : 'Código modular em TypeScript preparado para rápida conexão com Supabase, webhooks de WhatsApp e painel administrativo.'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:bg-[#F39A3C] transition-all"
        >
          {lang === 'en' ? 'Understand & Close' : 'Entendido, Fechar Aviso'}
        </button>
      </div>
    </div>
  );
};
