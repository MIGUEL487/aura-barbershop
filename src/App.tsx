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
  const [lang, setLang] = useState<Language>('pt');
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
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setReducedMotion(true);
    }

    if (reducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
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
        {/* 2. Pure Editorial Hero (Zero 3D, Strong Typography, Isolated Cutout, GSAP parallax) */}
        <Hero lang={lang} onOpenBooking={scrollToBooking} />

        {/* 3. Top Infinite Marquee (Craft Track) */}
        <Marquee lang={lang} variant="craft" />

        {/* 4. Storytelling Ritual in 3 Chapters (Cutouts & GSAP ScrollTrigger) */}
        <Storytelling lang={lang} />

        {/* 5. Services Menu (3 Cards with Cutouts & Staggered Entrance) */}
        <Services lang={lang} onSelectService={handleSelectServiceFromCard} />

        {/* 6. Style References Gallery (Haircut and texture focus) */}
        <Gallery lang={lang} onSelectService={handleSelectServiceFromCard} />

        {/* 7. Secondary Reverse Marquee (Ritual Track) */}
        <Marquee lang={lang} variant="ritual" reverse={true} />

        {/* 8. Atmosphere & The Craft (Dual Photo Composition & Parallax) */}
        <Atmosphere lang={lang} />

        {/* 9. Master Barbers Team (Asymmetric Layout & Direct Booking) */}
        <Team lang={lang} onSelectBarber={handleSelectBarberFromCard} />

        {/* 10. Verified Simulated Testimonials Carousel */}
        <Testimonials lang={lang} />

        {/* 11. Interactive 5-Step Scheduling Engine */}
        <BookingSystem
          lang={lang}
          bookingState={bookingState}
          setBookingState={setBookingState}
        />

        {/* 12. Pinheiros Location & Schedule */}
        <LocationAndHours lang={lang} onOpenBooking={scrollToBooking} />

        {/* 13. Accessible FAQ Accordion */}
        <FAQ lang={lang} />

        {/* 14. High-Impact Closing CTA */}
        <FinalCTA lang={lang} onOpenBooking={scrollToBooking} />
      </main>

      {/* 15. Comprehensive Footer with Motion Preferences */}
      <Footer
        lang={lang}
        reducedMotion={reducedMotion}
        setReducedMotion={setReducedMotion}
        onOpenDemoModal={() => setIsDemoModalOpen(true)}
      />

      {/* 16. Educational Transparency Modal */}
      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        lang={lang}
      />
    </div>
  );
}

export default App;
