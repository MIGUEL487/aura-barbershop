import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Header } from './components/Header';
import { CinematicHero } from './components/CinematicHero';
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
import { BookingState } from './types';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export function App() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

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
      setIsHeaderVisible(true);
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

    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(timeout);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, [reducedMotion]);

  const scrollToBooking = () => {
    const el = document.getElementById('booking');
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
      {/* 1. Header is invisible during the initial cinematic hero, and only slides in when hero completes */}
      <Header
        onOpenBooking={scrollToBooking}
        isVisible={reducedMotion || isHeaderVisible}
      />

      <main>
        {/* 2. Cinematic Scroll-Driven Frame-by-Frame Hero (Only the pole and majestic MODA reveal) */}
        <CinematicHero
          onOpenBooking={scrollToBooking}
          onHeroComplete={(complete) => setIsHeaderVisible(complete)}
        />

        {/* 3. Top Infinite Marquee (Craft Track) */}
        <Marquee variant="craft" />

        {/* 4. Storytelling Ritual in 3 Chapters (Understand, Execute, Refine) */}
        <Storytelling />

        {/* 5. Services Menu (3 Cards with Staggered Entrance) */}
        <Services onSelectService={handleSelectServiceFromCard} />

        {/* 6. Style References Gallery (Haircut and texture focus) */}
        <Gallery onSelectService={handleSelectServiceFromCard} />

        {/* 7. Secondary Reverse Marquee (Ritual Track in Obsidian & Gold) */}
        <Marquee variant="ritual" reverse={true} />

        {/* 8. Atmosphere & The Craft (Dual Photo Composition & Parallax) */}
        <Atmosphere />

        {/* 9. Master Barbers Team (Asymmetric Layout & Direct Booking) */}
        <Team onSelectBarber={handleSelectBarberFromCard} />

        {/* 10. Verified Client Testimonials Carousel */}
        <Testimonials />

        {/* 11. Interactive 5-Step Scheduling Engine */}
        <BookingSystem
          bookingState={bookingState}
          setBookingState={setBookingState}
        />

        {/* 12. Pinheiros Location & Schedule */}
        <LocationAndHours onOpenBooking={scrollToBooking} />

        {/* 13. Accessible FAQ Accordion */}
        <FAQ />

        {/* 14. High-Impact Closing CTA (Obsidian & Brushed Gold) */}
        <FinalCTA onOpenBooking={scrollToBooking} />
      </main>

      {/* 15. Comprehensive Footer with Motion Preferences */}
      <Footer
        reducedMotion={reducedMotion}
        setReducedMotion={setReducedMotion}
        onOpenDemoModal={() => setIsDemoModalOpen(true)}
      />

      {/* 16. Educational Transparency Modal */}
      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </div>
  );
}

export default App;
