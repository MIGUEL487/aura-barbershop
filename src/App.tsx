import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { Storytelling } from './components/Storytelling';
import { Services } from './components/Services';
import { Gallery } from './components/Gallery';
import { Atmosphere } from './components/Atmosphere';
import { Team } from './components/Team';
import { Testimonials } from './components/Testimonials';
import { BookingSystem } from './components/BookingSystem';
import { LocationAndHours } from './components/LocationAndHours';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { DemoModal } from './components/DemoModal';
import { Language, BookingState } from './types';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const [lang, setLang] = useState<Language>('pt'); // Default to PT as requested by reference and kit
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const [bookingState, setBookingState] = useState<BookingState>({
    step: 1,
    serviceId: null,
    barberId: null,
    date: null,
    time: null,
    clientName: '',
    clientPhone: '',
    notes: '',
    isConfirmed: false,
  });

  // Lenis Smooth Scroll Setup with GSAP Ticker synchronization
  useEffect(() => {
    // Check OS reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setReducedMotion(true);
    }

    if (reducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, [reducedMotion]);

  const scrollToBooking = () => {
    const el = document.getElementById('agendar');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceFromCard = (serviceId: string) => {
    setBookingState((prev) => ({
      ...prev,
      serviceId,
      step: 2,
    }));
    scrollToBooking();
  };

  const handleSelectBarberFromCard = (barberId: string) => {
    setBookingState((prev) => ({
      ...prev,
      barberId,
      step: 3,
    }));
    scrollToBooking();
  };

  return (
    <div className={`min-h-screen bg-background text-foreground ${reducedMotion ? 'reduced-motion' : ''}`}>
      {/* 1. Sticky Navigation Header */}
      <Header lang={lang} setLang={setLang} onOpenBooking={scrollToBooking} />

      <main>
        {/* 2. Editorial Hero Section with 3D Craft Shears Emblem */}
        <Hero lang={lang} onOpenBooking={scrollToBooking} />

        {/* 3. Top Infinite Marquee */}
        <Marquee lang={lang} />

        {/* 4. Storytelling Ritual in 3 Chapters (GSAP ScrollTrigger) */}
        <Storytelling lang={lang} />

        {/* 5. Services Menu (3 Cards with clear durations and pricing) */}
        <Services lang={lang} onSelectService={handleSelectServiceFromCard} />

        {/* 6. Style References Gallery */}
        <Gallery lang={lang} onSelectService={handleSelectServiceFromCard} />

        {/* 7. Atmosphere & The Craft (Dual Photo Composition) */}
        <Atmosphere lang={lang} />

        {/* 8. Master Barbers Team */}
        <Team lang={lang} onSelectBarber={handleSelectBarberFromCard} />

        {/* 9. Verified Simulated Testimonials Carousel */}
        <Testimonials lang={lang} />

        {/* 10. Interactive 5-Step Scheduling Engine */}
        <BookingSystem
          lang={lang}
          bookingState={bookingState}
          setBookingState={setBookingState}
        />

        {/* 11. Pinheiros Location & Schedule */}
        <LocationAndHours lang={lang} onOpenBooking={scrollToBooking} />

        {/* 12. Accessible FAQ Accordion */}
        <FAQ lang={lang} />

        {/* 13. High-Impact Closing CTA */}
        <FinalCTA lang={lang} onOpenBooking={scrollToBooking} />
      </main>

      {/* 14. Comprehensive Footer with Motion Preferences */}
      <Footer
        lang={lang}
        reducedMotion={reducedMotion}
        setReducedMotion={setReducedMotion}
        onOpenDemoModal={() => setIsDemoModalOpen(true)}
      />

      {/* 15. Educational Transparency Modal */}
      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        lang={lang}
      />
    </div>
  );
}

export default App;
