import React, { useState } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/barbershopData';
import { Language, GalleryItem } from '../types';

interface GalleryProps {
  lang: Language;
  onSelectService: (serviceId: string) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ lang, onSelectService }) => {
  const [activeItem, setActiveItem] = useState<GalleryItem>(GALLERY_ITEMS[0]);

  return (
    <section id="estilos" className="section-y relative bg-card/30 border-t border-border">
      <div className="container-x">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="eyebrow mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>{lang === 'en' ? 'Inspiration Archive' : 'Referências de Estilo'}</span>
            </div>
            <h2 className="display text-4xl sm:text-5xl md:text-6xl text-foreground uppercase tracking-tight mb-4">
              {lang === 'en' ? 'FIND YOUR NEXT SILHOUETTE.' : 'ENCONTRE SUA PRÓXIMA REFERÊNCIA.'}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {lang === 'en'
                ? 'Texture, razor outlines, and taper balances. Save a reference to discuss in the barber chair.'
                : 'Textura, linhas e acabamento. Salve uma ideia para conversar com o barbeiro na cadeira.'}
            </p>
          </div>

          <div className="demo-tag self-start md:self-end">
            <span>{lang === 'en' ? 'Illustrative AI Assets' : 'Imagens Ilustrativas IA'}</span>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GALLERY_ITEMS.map((item, index) => {
            const isSelected = activeItem.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 flex flex-col justify-end ${
                  isSelected ? 'border-primary ring-2 ring-primary/30' : 'border-border hover:border-border/80'
                }`}
              >
                {/* Image frame */}
                <div className="aspect-[3/4] relative overflow-hidden bg-surface-raised">
                  <img
                    src={item.image}
                    alt={lang === 'en' ? item.title : item.titlePt}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />

                  {/* Top Category Tag */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                    0{index + 1} • {lang === 'en' ? item.category : item.categoryPt}
                  </div>

                  {/* Bottom Info & Action */}
                  <div className="absolute bottom-4 inset-x-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs font-mono text-primary font-bold uppercase tracking-wider mb-1">
                        {lang === 'en' ? 'Reference Cut' : 'Estilo Sugerido'}
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
                      className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform"
                      title={lang === 'en' ? 'Book this style' : 'Agendar este estilo'}
                      aria-label="Book this style"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
