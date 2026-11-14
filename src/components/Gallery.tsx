import React, { useRef, useState } from 'react';
import { ArrowUpRight, Sparkles, X } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GALLERY_ITEMS } from '../data/barbershopData';
import { Language, GalleryItem } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface GalleryProps {
  lang: Language;
  onSelectService: (serviceId: string) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ lang, onSelectService }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomItem, setZoomItem] = useState<GalleryItem | null>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      gsap.from('.gallery-header', {
        scrollTrigger: {
          trigger: '.gallery-header',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      const cards = gsap.utils.toArray<HTMLElement>('.gallery-card');
      gsap.from(cards, {
        scrollTrigger: {
          trigger: '.gallery-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
      });
    },
    { scope: containerRef }
  );

  return (
    <section id="estilos" ref={containerRef} className="section-y relative bg-[#0E0D0C] border-t border-border">
      <div className="container-x">
        {/* Section Header */}
        <div className="gallery-header flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="eyebrow mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>{lang === 'en' ? 'Inspiration Archive' : 'Referências de Estilo'}</span>
            </div>
            <h2 className="display text-4xl sm:text-5xl md:text-6xl text-foreground uppercase tracking-tight mb-4">
              {lang === 'en' ? (
                <>
                  FIND YOUR NEXT <span className="pill-word">REFERENCE.</span>
                </>
              ) : (
                <>
                  ENCONTRE SUA PRÓXIMA <span className="pill-word">REFERÊNCIA.</span>
                </>
              )}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {lang === 'en'
                ? 'Texture, razor outlines, and taper balances. Save an idea to discuss directly in the barber chair.'
                : 'Textura, linhas e acabamento. Salve uma ideia para conversar com o barbeiro na cadeira.'}
            </p>
          </div>

          <div className="demo-tag self-start md:self-end">
            <span>{lang === 'en' ? 'Editorial Style References' : 'Referências Editoriais'}</span>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GALLERY_ITEMS.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setZoomItem(item)}
              className="gallery-card group relative rounded-3xl overflow-hidden border border-border/80 bg-card cursor-pointer transition-all duration-500 hover:border-primary/80 hover:-translate-y-1 shadow-xl flex flex-col justify-end"
            >
              {/* Image Frame with precise focal framing */}
              <div className="aspect-[3/4] relative overflow-hidden bg-surface-raised">
                <img
                  src={item.image}
                  alt={lang === 'en' ? item.title : item.titlePt}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700"
                  loading="lazy"
                />

                {/* Subtle gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent opacity-95 group-hover:opacity-85 transition-opacity" />

                {/* Top Category Tag */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/85 backdrop-blur-md border border-border text-[11px] font-mono uppercase tracking-wider text-primary font-bold">
                  0{index + 1} • {lang === 'en' ? item.category : item.categoryPt}
                </div>

                {/* Bottom Info & Action */}
                <div className="absolute bottom-4 inset-x-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-semibold mb-0.5">
                      {lang === 'en' ? 'Click to inspect' : 'Clique para ampliar'}
                    </p>
                    <h3 className="display text-xl text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">
                      {lang === 'en' ? item.title : item.titlePt}
                    </h3>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectService(item.serviceId);
                    }}
                    className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-lg glow-amber group-hover:scale-110 transition-transform"
                    title={lang === 'en' ? 'Book this style' : 'Agendar este estilo'}
                    aria-label="Book this style"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Lightbox Zoom */}
        {zoomItem && (
          <div
            onClick={() => setZoomItem(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-card border border-border rounded-3xl overflow-hidden shadow-2xl p-6"
            >
              <button
                onClick={() => setZoomItem(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-surface-raised border border-border hover:border-primary text-foreground transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-surface-raised">
                <img
                  src={zoomItem.image}
                  alt={zoomItem.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono uppercase text-primary font-bold">
                    {lang === 'en' ? zoomItem.category : zoomItem.categoryPt}
                  </span>
                  <h3 className="display text-2xl text-foreground uppercase">
                    {lang === 'en' ? zoomItem.title : zoomItem.titlePt}
                  </h3>
                </div>

                <button
                  onClick={() => {
                    onSelectService(zoomItem.serviceId);
                    setZoomItem(null);
                  }}
                  className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:bg-[#FF8526] transition-all"
                >
                  {lang === 'en' ? 'Choose This Cut' : 'Agendar Este Estilo'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
