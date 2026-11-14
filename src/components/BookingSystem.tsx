import React, { useState, useRef, useId } from 'react';
import {
  Calendar as CalendarIcon,
  User,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Phone,
  AlertCircle
} from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SERVICES, BARBERS } from '../data/barbershopData';
import { BookingState, Service, Barber } from '../types';

gsap.registerPlugin(ScrollTrigger);

interface BookingSystemProps {
  lang?: string;
  bookingState: BookingState;
  setBookingState: React.Dispatch<React.SetStateAction<BookingState>>;
}

export const BookingSystem: React.FC<BookingSystemProps> = ({
  bookingState,
  setBookingState,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const nameInputId = useId();
  const phoneInputId = useId();
  const notesInputId = useId();

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      gsap.from('.booking-header', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from('.booking-box', {
        scrollTrigger: {
          trigger: '.booking-box',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      });
    },
    { scope: containerRef }
  );

  const selectedService: Service | undefined = SERVICES.find((s) => s.id === bookingState.serviceId);
  const selectedBarber: Barber | undefined = BARBERS.find((b) => b.id === bookingState.barberId);

  // Available dates: Next 7 days starting from tomorrow, skipping Sun/Mon
  const getDates = () => {
    const list = [];
    const now = new Date();
    for (let i = 1; i <= 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      if (d.getDay() !== 0 && d.getDay() !== 1) {
        const iso = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNumber = d.getDate();
        const monthName = d.toLocaleDateString('en-US', { month: 'short' });
        list.push({ iso, dayName, dayNumber, monthName });
      }
    }
    return list;
  };

  const dates = getDates();

  const timeSlots = [
    { time: '10:00 AM', available: true },
    { time: '11:00 AM', available: true },
    { time: '11:45 AM', available: false },
    { time: '02:00 PM', available: true },
    { time: '03:15 PM', available: true },
    { time: '04:30 PM', available: false },
    { time: '05:30 PM', available: true },
    { time: '06:45 PM', available: true },
  ];

  const handleSelectService = (id: string) => {
    setBookingState((prev) => ({
      ...prev,
      serviceId: id,
      step: 2,
    }));
    setErrorMsg(null);
  };

  const handleSelectBarber = (id: string) => {
    setBookingState((prev) => ({
      ...prev,
      barberId: id,
      step: 3,
    }));
    setErrorMsg(null);
  };

  const handleSelectDate = (iso: string) => {
    setBookingState((prev) => ({
      ...prev,
      date: iso,
      time: null,
    }));
  };

  const handleSelectTime = (t: string) => {
    setBookingState((prev) => ({
      ...prev,
      time: t,
    }));
    setErrorMsg(null);
  };

  const handleNextFromSchedule = () => {
    if (!bookingState.date || !bookingState.time) {
      setErrorMsg('Please select both an available date and preferred appointment time.');
      return;
    }
    setBookingState((prev) => ({ ...prev, step: 4 }));
    setErrorMsg(null);
  };

  const handleNextFromDetails = () => {
    if (!bookingState.clientName.trim() || bookingState.clientName.trim().length < 2) {
      setErrorMsg('Please enter your full name for the booking simulation.');
      return;
    }
    if (!bookingState.clientPhone.trim() || bookingState.clientPhone.trim().length < 7) {
      setErrorMsg('Please provide a valid phone number.');
      return;
    }
    setBookingState((prev) => ({ ...prev, step: 5 }));
    setErrorMsg(null);
  };

  const handleConfirmSimulation = () => {
    setBookingState((prev) => ({
      ...prev,
      isConfirmed: true,
    }));
  };

  const handleReset = () => {
    setBookingState({
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
    setErrorMsg(null);
  };

  const stepLabels = [
    { num: 1, label: 'Ritual' },
    { num: 2, label: 'Barber' },
    { num: 3, label: 'Date & Time' },
    { num: 4, label: 'Details' },
    { num: 5, label: 'Review' },
  ];

  return (
    <section id="booking" ref={containerRef} className="section-y relative bg-[#11100F] border-t border-border">
      <div className="container-x">
        {/* Header with Pill Word */}
        <div className="booking-header max-w-3xl mb-12">
          <div className="eyebrow mb-4">
            <CalendarIcon className="w-4 h-4 text-primary" />
            <span>Dedicated Reservation Atelier</span>
          </div>
          <h2 className="display text-4xl sm:text-5xl md:text-6xl text-foreground uppercase tracking-tight mb-4">
            YOUR NEXT CUT STARTS <span className="pill-word">HERE.</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Select your ritual, choose your dedicated master barber, and confirm your calendar appointment in five transparent steps.
          </p>
        </div>

        {/* 5-Step Visual Progress Bar */}
        {!bookingState.isConfirmed && (
          <div className="mb-12">
            <div className="grid grid-cols-5 gap-2 sm:gap-4">
              {stepLabels.map((st) => {
                const isActive = bookingState.step === st.num;
                const isPassed = bookingState.step > st.num;
                return (
                  <button
                    key={st.num}
                    onClick={() => {
                      if (isPassed) {
                        setBookingState((prev) => ({ ...prev, step: st.num }));
                      }
                    }}
                    disabled={!isPassed && !isActive}
                    className={`flex flex-col gap-2 text-left group transition-all ${
                      isPassed ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div
                      className={`h-1.5 rounded-full transition-colors ${
                        isActive ? 'bg-primary glow-gold' : isPassed ? 'bg-primary/50' : 'bg-surface-raised'
                      }`}
                    />
                    <span
                      className={`text-[11px] sm:text-xs font-mono font-semibold uppercase truncate ${
                        isActive
                          ? 'text-primary'
                          : isPassed
                          ? 'text-foreground'
                          : 'text-muted-foreground/50'
                      }`}
                    >
                      0{st.num} {st.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Grid: Steps (Col 8) + Summary Sidebar (Col 4) */}
        <div className="booking-box grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Active Step Interactive View */}
          <div className="lg:col-span-8 bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-2xl">
            {/* If Confirmed Success Screen */}
            {bookingState.isConfirmed ? (
              <div className="text-center py-8">
                {/* Checkmark Animation */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary glow-gold">
                  <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
                </div>

                <div className="demo-tag mb-4">
                  <span>Simulation Complete</span>
                </div>

                <h3 className="display text-3xl sm:text-4xl text-foreground uppercase tracking-tight mb-3">
                  Appointment Confirmed
                </h3>

                <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
                  This prototype has simulated your appointment reservation with zero live payment or data harvesting. Your scheduled chair details are verified below.
                </p>

                {/* Recap Box */}
                <div className="max-w-md mx-auto bg-surface-raised border border-border rounded-2xl p-6 text-left space-y-3 mb-8 text-sm">
                  <div className="flex justify-between py-1.5 border-b border-border/60">
                    <span className="text-muted-foreground">Client:</span>
                    <span className="font-bold text-foreground">{bookingState.clientName}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border/60">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-mono text-foreground">{bookingState.clientPhone}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border/60">
                    <span className="text-muted-foreground">Ritual:</span>
                    <span className="font-bold text-primary">
                      {selectedService?.name || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border/60">
                    <span className="text-muted-foreground">Master Barber:</span>
                    <span className="font-semibold text-foreground">
                      {bookingState.barberId === 'any'
                        ? 'First Available Craftsman'
                        : selectedBarber?.name}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-border/60">
                    <span className="text-muted-foreground">Schedule:</span>
                    <span className="font-mono text-foreground">
                      {bookingState.date} at {bookingState.time}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 pt-2">
                    <span className="font-bold text-foreground">Total Investment:</span>
                    <span className="font-bold text-primary text-base">${selectedService?.price}</span>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-surface-raised border border-border hover:border-primary text-foreground hover:text-primary font-semibold text-sm transition-all shadow-md"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Simulate Another Appointment</span>
                </button>
              </div>
            ) : (
              <div>
                {/* STEP 1: Select Service */}
                {bookingState.step === 1 && (
                  <div>
                    <h3 className="display text-2xl text-foreground uppercase tracking-tight mb-2">
                      1. Select Your Ritual
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Choose the dedicated grooming service you wish to schedule.
                    </p>

                    <div className="grid gap-4">
                      {SERVICES.map((srv) => {
                        const isSelected = bookingState.serviceId === srv.id;
                        return (
                          <div
                            key={srv.id}
                            onClick={() => handleSelectService(srv.id)}
                            className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                              isSelected
                                ? 'border-primary bg-primary/10 shadow-lg glow-card'
                                : 'border-border bg-surface-raised/60 hover:border-primary/50'
                            }`}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h4 className="font-bold text-lg text-foreground">
                                  {srv.name}
                                </h4>
                                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-background border border-border text-primary font-bold">
                                  {srv.duration} min
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {srv.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                              <span className="tnum display text-2xl text-primary font-bold">
                                ${srv.price}
                              </span>
                              <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                  isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                                }`}
                              >
                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 2: Select Barber */}
                {bookingState.step === 2 && (
                  <div>
                    <h3 className="display text-2xl text-foreground uppercase tracking-tight mb-2">
                      2. Select Your Master Barber
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Select a specific craftsman or choose First Available to view full calendar flexibility.
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Any Available Option */}
                      <div
                        onClick={() => handleSelectBarber('any')}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 sm:col-span-2 ${
                          bookingState.barberId === 'any'
                            ? 'border-primary bg-primary/10 shadow-lg glow-card'
                            : 'border-border bg-surface-raised/60 hover:border-primary/50'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-xl bg-background border border-border flex items-center justify-center text-primary shrink-0">
                          <User className="w-7 h-7" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-base text-foreground">
                            First Available Master Barber
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Displays all open schedule slots across the studio team.
                          </p>
                        </div>
                      </div>

                      {/* Specific Barbers */}
                      {BARBERS.map((barber) => {
                        const isSelected = bookingState.barberId === barber.id;
                        return (
                          <div
                            key={barber.id}
                            onClick={() => handleSelectBarber(barber.id)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${
                              isSelected
                                ? 'border-primary bg-primary/10 shadow-lg glow-card'
                                : 'border-border bg-surface-raised/60 hover:border-primary/50'
                            }`}
                          >
                            <img
                              src={barber.avatar}
                              alt={barber.name}
                              className="w-14 h-14 rounded-xl object-cover object-[center_20%] shrink-0 border border-border"
                            />
                            <div>
                              <h4 className="font-bold text-base text-foreground">{barber.name}</h4>
                              <p className="text-xs text-primary font-medium">
                                {barber.specialty}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-8 flex justify-between">
                      <button
                        onClick={() => setBookingState((prev) => ({ ...prev, step: 1 }))}
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-semibold"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Date & Time */}
                {bookingState.step === 3 && (
                  <div>
                    <h3 className="display text-2xl text-foreground uppercase tracking-tight mb-2">
                      3. Choose Date & Time
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Tuesday through Saturday appointments. Studio is closed Sunday and Monday.
                    </p>

                    {/* Date Horizontal Selector */}
                    <div className="mb-6">
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3 font-bold">
                        Select Appointment Date
                      </label>
                      <div className="grid grid-cols-5 gap-2 sm:gap-3">
                        {dates.map((d) => {
                          const isSelected = bookingState.date === d.iso;
                          return (
                            <button
                              key={d.iso}
                              onClick={() => handleSelectDate(d.iso)}
                              className={`p-3 rounded-2xl border text-center transition-all ${
                                isSelected
                                  ? 'border-primary bg-primary text-primary-foreground font-bold shadow-md glow-gold'
                                  : 'border-border bg-surface-raised hover:border-primary/50 text-foreground'
                              }`}
                            >
                              <span className="block text-[10px] uppercase font-mono tracking-wider opacity-80">
                                {d.dayName}
                              </span>
                              <span className="block text-xl font-bold my-0.5">{d.dayNumber}</span>
                              <span className="block text-[10px] uppercase font-mono opacity-80">
                                {d.monthName}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time Slot Selector */}
                    {bookingState.date && (
                      <div className="mb-6">
                        <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3 font-bold">
                          Available Studio Slots
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {timeSlots.map((slot) => {
                            const isSelected = bookingState.time === slot.time;
                            if (!slot.available) {
                              return (
                                <button
                                  key={slot.time}
                                  disabled
                                  className="py-3 px-2 rounded-xl border border-border/40 bg-surface-raised/20 text-muted-foreground/30 line-through text-xs font-mono cursor-not-allowed"
                                >
                                  {slot.time}
                                </button>
                              );
                            }
                            return (
                              <button
                                key={slot.time}
                                onClick={() => handleSelectTime(slot.time)}
                                className={`py-3 px-2 rounded-xl border text-xs font-mono font-bold transition-all ${
                                  isSelected
                                    ? 'border-primary bg-primary text-primary-foreground shadow-md glow-gold'
                                    : 'border-border bg-surface-raised hover:border-primary text-foreground'
                                }`}
                              >
                                {slot.time}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {errorMsg && (
                      <div className="mb-6 p-3.5 rounded-xl border border-destructive/50 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="mt-8 flex justify-between items-center">
                      <button
                        onClick={() => setBookingState((prev) => ({ ...prev, step: 2 }))}
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-semibold"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button
                        onClick={handleNextFromSchedule}
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:bg-[#D4AF6A] glow-gold transition-all"
                      >
                        <span>Continue</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: Client Info */}
                {bookingState.step === 4 && (
                  <div>
                    <h3 className="display text-2xl text-foreground uppercase tracking-tight mb-2">
                      4. Your Details (Simulation)
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Provide client information for confirmation. No spam or commercial messages will be dispatched.
                    </p>

                    <div className="space-y-4 max-w-md">
                      <div>
                        <label htmlFor={nameInputId} className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-bold">
                          Full Name *
                        </label>
                        <div className="relative">
                          <input
                            id={nameInputId}
                            type="text"
                            value={bookingState.clientName}
                            onChange={(e) =>
                              setBookingState((prev) => ({ ...prev, clientName: e.target.value }))
                            }
                            placeholder="e.g. Liam Parker"
                            className="w-full bg-surface-raised border border-border rounded-xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                          />
                          <User className="w-4 h-4 text-muted-foreground absolute right-3.5 top-4" />
                        </div>
                      </div>

                      <div>
                        <label htmlFor={phoneInputId} className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-bold">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <input
                            id={phoneInputId}
                            type="tel"
                            value={bookingState.clientPhone}
                            onChange={(e) =>
                              setBookingState((prev) => ({ ...prev, clientPhone: e.target.value }))
                            }
                            placeholder="+1 (555) 234-5678"
                            className="w-full bg-surface-raised border border-border rounded-xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                          />
                          <Phone className="w-4 h-4 text-muted-foreground absolute right-3.5 top-4" />
                        </div>
                      </div>

                      <div>
                        <label htmlFor={notesInputId} className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-bold">
                          Styling Preferences or Notes (Optional)
                        </label>
                        <textarea
                          id={notesInputId}
                          value={bookingState.notes}
                          onChange={(e) =>
                            setBookingState((prev) => ({ ...prev, notes: e.target.value }))
                          }
                          rows={3}
                          placeholder="e.g. Low taper fade with natural scissor flow on crown"
                          className="w-full bg-surface-raised border border-border rounded-xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    {errorMsg && (
                      <div className="mt-4 p-3.5 rounded-xl border border-destructive/50 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="mt-8 flex justify-between items-center">
                      <button
                        onClick={() => setBookingState((prev) => ({ ...prev, step: 3 }))}
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-semibold"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button
                        onClick={handleNextFromDetails}
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:bg-[#D4AF6A] glow-gold transition-all"
                      >
                        <span>Review Booking</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 5: Review & Confirm */}
                {bookingState.step === 5 && (
                  <div>
                    <h3 className="display text-2xl text-foreground uppercase tracking-tight mb-2">
                      5. Review & Confirm Booking
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Verify your appointment details prior to completing simulation.
                    </p>

                    <div className="divide-y divide-border rounded-2xl border border-border bg-surface-raised/40 mb-6">
                      <div className="p-4.5 flex justify-between items-center">
                        <div>
                          <span className="text-xs text-muted-foreground block font-mono">
                            RITUAL
                          </span>
                          <span className="font-bold text-foreground">
                            {selectedService?.name || '—'}
                          </span>
                        </div>
                        <span className="font-bold text-primary">${selectedService?.price}</span>
                      </div>

                      <div className="p-4.5 flex justify-between items-center">
                        <div>
                          <span className="text-xs text-muted-foreground block font-mono">
                            CRAFTSMAN
                          </span>
                          <span className="font-bold text-foreground">
                            {bookingState.barberId === 'any'
                              ? 'First Available Master Barber'
                              : selectedBarber?.name}
                          </span>
                        </div>
                        <button
                          onClick={() => setBookingState((prev) => ({ ...prev, step: 2 }))}
                          className="text-xs text-primary underline font-bold"
                        >
                          Edit
                        </button>
                      </div>

                      <div className="p-4.5 flex justify-between items-center">
                        <div>
                          <span className="text-xs text-muted-foreground block font-mono">
                            SCHEDULE
                          </span>
                          <span className="font-bold text-foreground font-mono">
                            {bookingState.date} at {bookingState.time}
                          </span>
                        </div>
                        <button
                          onClick={() => setBookingState((prev) => ({ ...prev, step: 3 }))}
                          className="text-xs text-primary underline font-bold"
                        >
                          Edit
                        </button>
                      </div>

                      <div className="p-4.5 flex justify-between items-center">
                        <div>
                          <span className="text-xs text-muted-foreground block font-mono">
                            CLIENT
                          </span>
                          <span className="font-bold text-foreground">
                            {bookingState.clientName} ({bookingState.clientPhone})
                          </span>
                        </div>
                        <button
                          onClick={() => setBookingState((prev) => ({ ...prev, step: 4 }))}
                          className="text-xs text-primary underline font-bold"
                        >
                          Edit
                        </button>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                      <button
                        onClick={() => setBookingState((prev) => ({ ...prev, step: 4 }))}
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-semibold"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button
                        onClick={handleConfirmSimulation}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base shadow-xl glow-gold hover:bg-[#D4AF6A] active:scale-[0.98] transition-all"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Confirm Demonstration Appointment</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Live Sticky Summary Sidebar */}
          <div className="lg:col-span-4 bg-card border border-border rounded-3xl p-6 sm:p-8 sticky top-28 shadow-2xl glow-card">
            <h4 className="text-xs font-mono uppercase tracking-widest text-primary font-bold mb-5 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Session Overview</span>
            </h4>

            <div className="space-y-4 text-sm divide-y divide-border/60">
              {/* Selected Service */}
              <div className="pt-2 first:pt-0">
                <span className="text-xs text-muted-foreground block font-mono">
                  Ritual
                </span>
                <p className="font-bold text-foreground mt-0.5 text-base">
                  {selectedService?.name || 'Pending Selection'}
                </p>
                {selectedService && (
                  <span className="text-xs font-mono text-primary font-bold">
                    {selectedService.duration} min dedicated chair
                  </span>
                )}
              </div>

              {/* Selected Barber */}
              <div className="pt-3">
                <span className="text-xs text-muted-foreground block font-mono">
                  Master Barber
                </span>
                <p className="font-bold text-foreground mt-0.5">
                  {bookingState.barberId === 'any'
                    ? 'First Available Craftsman'
                    : selectedBarber?.name || 'Pending Selection'}
                </p>
              </div>

              {/* Selected Time */}
              <div className="pt-3">
                <span className="text-xs text-muted-foreground block font-mono">
                  Appointment Window
                </span>
                <p className="font-mono font-semibold text-foreground mt-0.5">
                  {bookingState.date && bookingState.time
                    ? `${bookingState.date} at ${bookingState.time}`
                    : 'Pending Selection'}
                </p>
              </div>

              {/* Price Total */}
              <div className="pt-5 flex items-baseline justify-between">
                <span className="font-bold text-foreground text-sm uppercase tracking-wider font-mono">
                  Investment
                </span>
                <span className="tnum display text-3xl sm:text-4xl text-primary font-bold">
                  ${selectedService?.price || 0}
                </span>
              </div>
            </div>

            <div className="mt-6 p-3.5 rounded-2xl bg-surface-raised border border-border/80 text-[11px] text-muted-foreground leading-normal">
              <p>
                Editorial demonstration prototype. Simulated reservations only; no financial transactions are processed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
