import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface StoryStep {
  num: string;
  tag: string;
  badge: string;
  title: string;
  subtitle: string;
  text: string;
  image: string;
  highlights: string[];
}

const steps: StoryStep[] = [
  {
    num: '01',
    tag: 'UNDERSTAND',
    badge: '01 • ARCHITECTURAL CONSULTATION',
    title: 'The Intentional Dialogue',
    subtitle: 'Analyzing bone geometry and growth patterns before the cut.',
    text: 'Your lifestyle, facial structure, growth spirals, and daily routine guide the tailored blueprint before a single shear touches hair.',
    image: '/assets/hero/set_b_barber-at-work.webp',
    highlights: ['Facial Bone Analysis', 'Hair Growth Mapping', 'Tailored Silhouette Plan'],
  },
  {
    num: '02',
    tag: 'EXECUTE',
    badge: '02 • PRECISION SCISSOR ARCHITECTURE',
    title: 'Millimeter Precision & Scissor Craft',
    subtitle: 'Japanese steel shears, disciplined graduation, and clean taper lines.',
    text: 'Sculpting seamless gradients, scissor weight dissipation, and clean classic transitions with steady shears and master clippers.',
    image: '/assets/process/set_a_precision-fade.webp',
    highlights: ['Micro-metric Shear Tension', 'Seamless Weight Graduation', 'Clean Taper & Fade Geometry'],
  },
  {
    num: '03',
    tag: 'REFINE',
    badge: '03 • THE RITUALISTIC FINISH',
    title: 'Steamed Towel & Straight-Razor Polish',
    subtitle: 'Herbal aromatherapy steam and straight-razor detailing.',
    text: 'Essential herbal steam softens the dermal perimeter before an artisan straight-razor cleanup, followed by bespoke cold stone soothing.',
    image: '/assets/process/set_a_hot-towel.webp',
    highlights: ['Herbal Steam Infusion', 'Artisan Straight-Razor Detailing', 'Cold Stone Scalp Soothing'],
  },
];

const DESKTOP_LAYOUT = '(min-width: 1024px) and (min-height: 680px)';
const CHAPTER_STOPS = [0.1, 0.5, 0.9];

export function Storytelling({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [activeChapter, setActiveChapter] = useState(0);

  useGSAP(() => {
    if (reducedMotion) return;
    const layouts = gsap.matchMedia();
    layouts.add(DESKTOP_LAYOUT, () => {
      const section = sectionRef.current!;
      const viewport = viewportRef.current!;
      const track = trackRef.current!;
      const overflow = () => track.scrollWidth - viewport.clientWidth;
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + Math.round(Math.min(overflow(), section.clientHeight * 1.4)),
          pin: true,
          scrub: true,
          refreshPriority: 1,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          const progress = timeline.progress();
          setActiveChapter(progress < 0.3 ? 0 : progress < 0.7 ? 1 : 2);
        },
      });

      timeline
        .to(track, { x: () => -overflow() / 2, duration: 0.16, ease: 'power1.inOut' }, 0.22)
        .to(track, { x: () => -overflow(), duration: 0.16, ease: 'power1.inOut' }, 0.62)
        .to({}, { duration: 0.22 });

      triggerRef.current = timeline.scrollTrigger!;
      return () => {
        triggerRef.current = null;
        setActiveChapter(0);
      };
    });

    return () => layouts.revert();
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true });

  function goToChapter(index: number) {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const top = trigger.start + CHAPTER_STOPS[index] * (trigger.end - trigger.start);
    window.scrollTo({ top, behavior: 'instant' });
  }

  return (
    <section id="craft" ref={sectionRef} data-scroll-layout={reducedMotion ? "vertical" : "horizontal"} className="methodology relative border-t border-border bg-[#0E0D0B] py-16">
      <div className="container-x w-full">
        <div className="mb-6 max-w-3xl">
          <div className="eyebrow mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>The Moda Methodology</span>
          </div>
          <h2 className="display mb-2 text-3xl uppercase tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            THE CRAFT IS IN THE <span className="pill-word">DETAILS.</span>
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Three deliberate chapters designed to respect your schedule, listen to your desires, and deliver absolute confidence.
          </p>
        </div>

        <div className="methodology-controls mb-6 hidden max-w-3xl grid-cols-3 gap-4">
          {steps.map((step, index) => (
            <button
              key={step.num}
              type="button"
              aria-current={activeChapter === index ? 'step' : undefined}
              onClick={() => goToChapter(index)}
              className="rounded-2xl border border-border/60 bg-card/60 p-3 text-left hover:border-primary aria-[current=step]:border-primary aria-[current=step]:bg-primary/10"
            >
              <span className="text-xs font-bold tracking-wider text-primary">{step.num} / {step.tag}</span>
              <span className="mt-0.5 block text-xs font-semibold text-foreground">{step.title}</span>
            </button>
          ))}
        </div>

        <div ref={viewportRef} className="methodology-viewport max-w-6xl">
          <div ref={trackRef} className="methodology-track grid gap-8">
            {steps.map(step => (
              <article
                key={step.num}
                data-chapter={step.num}
                className="methodology-chapter grid min-w-0 items-center gap-6 overflow-hidden rounded-3xl border border-border bg-card p-5 sm:p-6"
              >
                <div>
                  <div className="mb-3 inline-flex rounded-full border border-border bg-surface-raised px-3 py-1 font-mono text-xs font-bold text-primary">
                    {step.badge}
                  </div>
                  <h3 className="display mb-2 text-2xl uppercase leading-tight text-foreground xl:text-3xl">{step.title}</h3>
                  <p className="mb-3 font-serif text-sm italic text-primary">{step.subtitle}</p>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                  <ul className="space-y-1.5 border-t border-border pt-3">
                    {step.highlights.map(item => (
                      <li key={item} className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                        <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <img
                  src={step.image}
                  alt={step.title}
                  width={828}
                  height={step.num === '03' ? 463 : 462}
                  className="methodology-image aspect-video w-full rounded-2xl object-cover"
                />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
