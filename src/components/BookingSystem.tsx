import React, { useState, useId } from 'react';
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
import { SERVICES, BARBERS } from '../data/barbershopData';
import { BookingState, Language, Service, Barber } from '../types';

interface BookingSystemProps {
  lang: Language;
  bookingState: BookingState;
  setBookingState: React.Dispatch<React.SetStateAction<BookingState>>;
}

export const BookingSystem: React.FC<BookingSystemProps> = ({
  lang,
  bookingState,
  setBookingState,
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const nameInputId = useId();
  const phoneInputId = useId();
  const notesInputId = useId();

  // Helper to get selected objects
  const selectedService: Service | undefined = SERVICES.find((s) => s.id === bookingState.serviceId);
  const selectedBarber: Barber | undefined = BARBERS.find((b) => b.id === bookingState.barberId);

  // Available dates: Next 7 days starting from tomorrow
  const getDates = () => {
    const list = [];
    const now = new Date();
    for (let i = 1; i <= 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      // Skip Sundays (0) and Mondays (1) per barbershop schedule
      if (d.getDay() !== 0 && d.getDay() !== 1) {
        const iso = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString(lang === 'en' ? 'en-US' : 'pt-BR', { weekday: 'short' });
        const dayNumber = d.getDate();
        const monthName = d.toLocaleDateString(lang === 'en' ? 'en-US' : 'pt-BR', { month: 'short' });
        list.push({ iso, dayName, dayNumber, monthName });
      }
    }
    return list;
  };

  const dates = getDates();

  // Time slots per date
  const timeSlots = [
    { time: '10:00', available: true },
    { time: '11:00', available: true },
    { time: '11:45', available: false },
    { time: '14:00', available: true },
    { time: '15:15', available: true },
    { time: '16:30', available: false },
    { time: '17:30', available: true },
    { time: '18:45', available: true },
  ];

  // Actions
  const handleSelectService = (id: string) => {
    setBookingState((prev) => ({
      ...prev,
      serviceId: id,
      // If duration changed, user can continue
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
      time: null, // reset time slot when date changes
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
      setErrorMsg(
        lang === 'en'
          ? 'Please select both an available date and time slot.'
          : 'Por favor, selecione uma data e um horário disponível.'
      );
      return;
    }
    setBookingState((prev) => ({ ...prev, step: 4 }));
    setErrorMsg(null);
  };

  const handleNextFromDetails = () => {
    if (!bookingState.clientName.trim() || bookingState.clientName.trim().length < 2) {
      setErrorMsg(
        lang === 'en' ? 'Please enter a name for the simulation.' : 'Por favor, informe um nome para continuar.'
      );
      return;
    }
    if (!bookingState.clientPhone.trim() || bookingState.clientPhone.trim().length < 8) {
      setErrorMsg(
        lang === 'en' ? 'Please enter a valid phone number.' : 'Por favor, confira o telefone com DDD.'
      );
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
    { num: 1, label: lang === 'en' ? 'Service' : 'Serviço' },
    { num: 2, label: lang === 'en' ? 'Barber' : 'Barbeiro' },
    { num: 3, label: lang === 'en' ? 'Date & Time' : 'Data & Hora' },
    { num: 4, label: lang === 'en' ? 'Your Details' : 'Seus Dados' },
    { num: 5, label: lang === 'en' ? 'Review' : 'Revisão' },
  ];

  return (
    <section id="agendar" className="section-y relative bg-[#131210] border-t border-border">
      <div className="container-x">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="eyebrow mb-4">
            <CalendarIcon className="w-4 h-4 text-primary" />
            <span>{lang === 'en' ? 'Appointment Booking' : 'Sistema de Agendamento'}</span>
          </div>
          <h2 className="display text-4xl sm:text-5xl md:text-6xl text-foreground uppercase tracking-tight mb-4">
            {lang === 'en' ? 'RESERVE YOUR CHAIR.' : 'SEU PRÓXIMO CORTE COMEÇA AQUI.'}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {lang === 'en'
              ? 'Select your service, choose your craftsman, and secure your calendar slot in five honest steps.'
              : 'Escolha o serviço, o profissional e o melhor horário para você.'}
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
                        isActive ? 'bg-primary' : isPassed ? 'bg-primary/50' : 'bg-surface-raised'
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Active Step Interactive View */}
          <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-2xl">
            {/* If Confirmed Success Screen */}
            {bookingState.isConfirmed ? (
              <div className="text-center py-8">
                {/* Checkmark Animation */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary check-draw">
                  <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
                </div>

                <div className="demo-tag mb-4">
                  <span>{lang === 'en' ? 'Simulated Success' : 'Simulação Confirmada'}</span>
                </div>

                <h3 className="display text-3xl sm:text-4xl text-foreground uppercase tracking-tight mb-3">
                  {lang === 'en' ? 'Demonstration Booking Confirmed!' : 'Agendamento de Demonstração Confirmado!'}
                </h3>

                <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
                  {lang === 'en'
                    ? 'No actual reservation or financial transaction was executed. Your simulated appointment details are displayed below for verification.'
                    : 'Nenhuma reserva real foi realizada e nenhum dado foi transmitido para servidor externo. Esta é uma simulação funcional de demonstração.'}
                </p>

                {/* Recap Box */}
                <div className="max-w-md mx-auto bg-surface-raised border border-border rounded-xl p-6 text-left space-y-3 mb-8 text-sm">
                  <div className="flex justify-between py-1 border-b border-border/60">
                    <span className="text-muted-foreground">{lang === 'en' ? 'Client' : 'Cliente'}:</span>
                    <span className="font-bold text-foreground">{bookingState.clientName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/60">
                    <span className="text-muted-foreground">{lang === 'en' ? 'Phone' : 'Telefone'}:</span>
                    <span className="font-mono text-foreground">{bookingState.clientPhone}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/60">
                    <span className="text-muted-foreground">{lang === 'en' ? 'Service' : 'Serviço'}:</span>
                    <span className="font-bold text-primary">
                      {selectedService ? (lang === 'en' ? selectedService.name : selectedService.namePt) : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/60">
                    <span className="text-muted-foreground">{lang === 'en' ? 'Barber' : 'Barbeiro'}:</span>
                    <span className="font-semibold text-foreground">
                      {bookingState.barberId === 'any'
                        ? lang === 'en'
                          ? 'Any Available'
                          : 'Sem preferência (Equipe)'
                        : selectedBarber?.name}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/60">
                    <span className="text-muted-foreground">{lang === 'en' ? 'Schedule' : 'Data & Horário'}:</span>
                    <span className="font-mono text-foreground">
                      {bookingState.date} às {bookingState.time}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 pt-2">
                    <span className="font-bold text-foreground">{lang === 'en' ? 'Total (Demo)' : 'Valor'}:</span>
                    <span className="font-bold text-primary text-base">R$ {selectedService?.price}</span>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-surface-raised border border-border hover:border-primary text-foreground hover:text-primary font-semibold text-sm transition-all shadow-md"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Simulate Another Booking' : 'Simular Outro Horário'}</span>
                </button>
              </div>
            ) : (
              <div>
                {/* STEP 1: Select Service */}
                {bookingState.step === 1 && (
                  <div>
                    <h3 className="display text-2xl text-foreground uppercase tracking-tight mb-2">
                      {lang === 'en' ? '1. Select Your Service' : '1. Escolha o Serviço'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      {lang === 'en'
                        ? 'Choose the grooming ritual you would like to book.'
                        : 'Selecione o serviço desejado com preço e duração demonstrativos.'}
                    </p>

                    <div className="grid gap-4">
                      {SERVICES.map((srv) => {
                        const isSelected = bookingState.serviceId === srv.id;
                        return (
                          <div
                            key={srv.id}
                            onClick={() => handleSelectService(srv.id)}
                            className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                              isSelected
                                ? 'border-primary bg-primary/10 shadow-lg'
                                : 'border-border bg-surface-raised/60 hover:border-border/80'
                            }`}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h4 className="font-bold text-lg text-foreground">
                                  {lang === 'en' ? srv.name : srv.namePt}
                                </h4>
                                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-background border border-border text-muted-foreground">
                                  {srv.duration} min
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {lang === 'en' ? srv.description : srv.descriptionPt}
                              </p>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                              <span className="tnum display text-2xl text-primary font-bold">
                                R$ {srv.price}
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
                      {lang === 'en' ? '2. Select Your Barber' : '2. Com Quem Você Quer Agendar?'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      {lang === 'en'
                        ? 'Choose a specific master barber or select "Any Available".'
                        : 'Personagens fictícios para demonstração. Todos atendem os três serviços.'}
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Any Available Option */}
                      <div
                        onClick={() => handleSelectBarber('any')}
                        className={`p-5 rounded-xl border cursor-pointer transition-all flex items-center gap-4 sm:col-span-2 ${
                          bookingState.barberId === 'any'
                            ? 'border-primary bg-primary/10 shadow-lg'
                            : 'border-border bg-surface-raised/60 hover:border-border/80'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-xl bg-background border border-border flex items-center justify-center text-primary shrink-0">
                          <User className="w-7 h-7" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-base text-foreground">
                            {lang === 'en' ? 'First Available Barber' : 'Sem preferência (Primeiro disponível)'}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {lang === 'en'
                              ? 'Show all open time slots across the entire master barber team.'
                              : 'Mostra todos os horários livres da equipe para maior flexibilidade.'}
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
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${
                              isSelected
                                ? 'border-primary bg-primary/10 shadow-lg'
                                : 'border-border bg-surface-raised/60 hover:border-border/80'
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
                                {lang === 'en' ? barber.specialty : barber.specialtyPt}
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
                        <span>{lang === 'en' ? 'Back' : 'Voltar'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Date & Time */}
                {bookingState.step === 3 && (
                  <div>
                    <h3 className="display text-2xl text-foreground uppercase tracking-tight mb-2">
                      {lang === 'en' ? '3. Choose Date & Time' : '3. Escolha Data e Horário'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      {lang === 'en'
                        ? 'Select an open day and your preferred appointment slot.'
                        : 'Horários demonstrativos. Terça a Sábado (Domingo e Segunda fechado).'}
                    </p>

                    {/* Date Horizontal Selector */}
                    <div className="mb-6">
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
                        {lang === 'en' ? 'Select Date' : 'Selecione a Data'}
                      </label>
                      <div className="grid grid-cols-5 gap-2 sm:gap-3">
                        {dates.map((d) => {
                          const isSelected = bookingState.date === d.iso;
                          return (
                            <button
                              key={d.iso}
                              onClick={() => handleSelectDate(d.iso)}
                              className={`p-3 rounded-xl border text-center transition-all ${
                                isSelected
                                  ? 'border-primary bg-primary text-primary-foreground font-bold shadow-md'
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
                        <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
                          {lang === 'en' ? 'Available Time Slots' : 'Horários Disponíveis'}
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
                                    ? 'border-primary bg-primary text-primary-foreground shadow-md'
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
                      <div className="mb-6 p-3 rounded-xl border border-destructive/50 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
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
                        <span>{lang === 'en' ? 'Back' : 'Voltar'}</span>
                      </button>

                      <button
                        onClick={handleNextFromSchedule}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:bg-[#F39A3C]"
                      >
                        <span>{lang === 'en' ? 'Continue' : 'Continuar'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: Client Info */}
                {bookingState.step === 4 && (
                  <div>
                    <h3 className="display text-2xl text-foreground uppercase tracking-tight mb-2">
                      {lang === 'en' ? '4. Your Details (Simulation)' : '4. Seus Dados de Teste'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      {lang === 'en'
                        ? 'Use test or fictional information. No real communications or spam are sent.'
                        : 'Para testar, você pode usar um nome e telefone fictícios.'}
                    </p>

                    <div className="space-y-4 max-w-md">
                      <div>
                        <label htmlFor={nameInputId} className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                          {lang === 'en' ? 'Full Name' : 'Nome Completo'} *
                        </label>
                        <div className="relative">
                          <input
                            id={nameInputId}
                            type="text"
                            value={bookingState.clientName}
                            onChange={(e) =>
                              setBookingState((prev) => ({ ...prev, clientName: e.target.value }))
                            }
                            placeholder={lang === 'en' ? 'e.g. Liam Parker' : 'Ex: André Martins'}
                            className="w-full bg-surface-raised border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                          />
                          <User className="w-4 h-4 text-muted-foreground absolute right-3.5 top-3.5" />
                        </div>
                      </div>

                      <div>
                        <label htmlFor={phoneInputId} className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                          {lang === 'en' ? 'Phone / WhatsApp' : 'Telefone / WhatsApp com DDD'} *
                        </label>
                        <div className="relative">
                          <input
                            id={phoneInputId}
                            type="tel"
                            value={bookingState.clientPhone}
                            onChange={(e) =>
                              setBookingState((prev) => ({ ...prev, clientPhone: e.target.value }))
                            }
                            placeholder={lang === 'en' ? '+1 (555) 019-2834' : '(11) 98765-4321'}
                            className="w-full bg-surface-raised border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                          />
                          <Phone className="w-4 h-4 text-muted-foreground absolute right-3.5 top-3.5" />
                        </div>
                      </div>

                      <div>
                        <label htmlFor={notesInputId} className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                          {lang === 'en' ? 'Notes or Styling Ideas (Optional)' : 'Observações ou Preferências (Opcional)'}
                        </label>
                        <textarea
                          id={notesInputId}
                          value={bookingState.notes}
                          onChange={(e) =>
                            setBookingState((prev) => ({ ...prev, notes: e.target.value }))
                          }
                          rows={3}
                          placeholder={
                            lang === 'en'
                              ? 'e.g. Skin fade with scissor work on top'
                              : 'Ex: Degradê navalhado com tesoura em cima'
                          }
                          className="w-full bg-surface-raised border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    {errorMsg && (
                      <div className="mt-4 p-3 rounded-xl border border-destructive/50 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
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
                        <span>{lang === 'en' ? 'Back' : 'Voltar'}</span>
                      </button>

                      <button
                        onClick={handleNextFromDetails}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:bg-[#F39A3C]"
                      >
                        <span>{lang === 'en' ? 'Review Booking' : 'Revisar Agendamento'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 5: Review & Confirm */}
                {bookingState.step === 5 && (
                  <div>
                    <h3 className="display text-2xl text-foreground uppercase tracking-tight mb-2">
                      {lang === 'en' ? '5. Review & Confirm Simulation' : '5. Revise seu Agendamento'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      {lang === 'en'
                        ? 'Check your selections before confirming the test booking.'
                        : 'Nenhum pagamento será realizado. Esta é uma demonstração.'}
                    </p>

                    <div className="divide-y divide-border rounded-xl border border-border bg-surface-raised/40 mb-6">
                      <div className="p-4 flex justify-between items-center">
                        <div>
                          <span className="text-xs text-muted-foreground block font-mono">
                            {lang === 'en' ? 'SERVICE' : 'SERVIÇO'}
                          </span>
                          <span className="font-bold text-foreground">
                            {selectedService ? (lang === 'en' ? selectedService.name : selectedService.namePt) : '—'}
                          </span>
                        </div>
                        <span className="font-bold text-primary">R$ {selectedService?.price}</span>
                      </div>

                      <div className="p-4 flex justify-between items-center">
                        <div>
                          <span className="text-xs text-muted-foreground block font-mono">
                            {lang === 'en' ? 'BARBER' : 'PROFISSIONAL'}
                          </span>
                          <span className="font-bold text-foreground">
                            {bookingState.barberId === 'any'
                              ? lang === 'en'
                                ? 'First Available'
                                : 'Sem preferência (Equipe)'
                              : selectedBarber?.name}
                          </span>
                        </div>
                        <button
                          onClick={() => setBookingState((prev) => ({ ...prev, step: 2 }))}
                          className="text-xs text-primary underline"
                        >
                          {lang === 'en' ? 'Edit' : 'Editar'}
                        </button>
                      </div>

                      <div className="p-4 flex justify-between items-center">
                        <div>
                          <span className="text-xs text-muted-foreground block font-mono">
                            {lang === 'en' ? 'SCHEDULE' : 'DATA E HORÁRIO'}
                          </span>
                          <span className="font-bold text-foreground font-mono">
                            {bookingState.date} às {bookingState.time}
                          </span>
                        </div>
                        <button
                          onClick={() => setBookingState((prev) => ({ ...prev, step: 3 }))}
                          className="text-xs text-primary underline"
                        >
                          {lang === 'en' ? 'Edit' : 'Editar'}
                        </button>
                      </div>

                      <div className="p-4 flex justify-between items-center">
                        <div>
                          <span className="text-xs text-muted-foreground block font-mono">
                            {lang === 'en' ? 'CLIENT' : 'CLIENTE'}
                          </span>
                          <span className="font-bold text-foreground">
                            {bookingState.clientName} ({bookingState.clientPhone})
                          </span>
                        </div>
                        <button
                          onClick={() => setBookingState((prev) => ({ ...prev, step: 4 }))}
                          className="text-xs text-primary underline"
                        >
                          {lang === 'en' ? 'Edit' : 'Editar'}
                        </button>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
                      <button
                        onClick={() => setBookingState((prev) => ({ ...prev, step: 4 }))}
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-semibold"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>{lang === 'en' ? 'Back' : 'Voltar'}</span>
                      </button>

                      <button
                        onClick={handleConfirmSimulation}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base shadow-xl shadow-primary/25 hover:bg-[#F39A3C] active:scale-[0.98] transition-all"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>
                          {lang === 'en'
                            ? 'Confirm Demonstration Booking'
                            : 'Confirmar Agendamento de Demonstração'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Live Sticky Summary Sidebar */}
          <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 sticky top-28 shadow-xl">
            <h4 className="text-xs font-mono uppercase tracking-widest text-primary font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Booking Summary' : 'Resumo do Agendamento'}</span>
            </h4>

            <div className="space-y-4 text-sm divide-y divide-border/60">
              {/* Selected Service */}
              <div className="pt-2 first:pt-0">
                <span className="text-xs text-muted-foreground block">
                  {lang === 'en' ? 'Chosen Service' : 'Serviço'}
                </span>
                <p className="font-bold text-foreground mt-0.5">
                  {selectedService
                    ? lang === 'en'
                      ? selectedService.name
                      : selectedService.namePt
                    : lang === 'en'
                    ? 'None selected yet'
                    : 'Ainda não selecionado'}
                </p>
                {selectedService && (
                  <span className="text-xs font-mono text-muted-foreground">
                    {selectedService.duration} min
                  </span>
                )}
              </div>

              {/* Selected Barber */}
              <div className="pt-3">
                <span className="text-xs text-muted-foreground block">
                  {lang === 'en' ? 'Barber' : 'Profissional'}
                </span>
                <p className="font-bold text-foreground mt-0.5">
                  {bookingState.barberId === 'any'
                    ? lang === 'en'
                      ? 'First Available Barber'
                      : 'Sem preferência (Equipe)'
                    : selectedBarber?.name || (lang === 'en' ? 'None selected' : 'Não selecionado')}
                </p>
              </div>

              {/* Selected Time */}
              <div className="pt-3">
                <span className="text-xs text-muted-foreground block">
                  {lang === 'en' ? 'Date & Time' : 'Data e Horário'}
                </span>
                <p className="font-mono font-semibold text-foreground mt-0.5">
                  {bookingState.date && bookingState.time
                    ? `${bookingState.date} às ${bookingState.time}`
                    : lang === 'en'
                    ? 'Pending selection'
                    : 'Pendente de seleção'}
                </p>
              </div>

              {/* Price Total */}
              <div className="pt-4 flex items-baseline justify-between">
                <span className="font-bold text-foreground text-sm">
                  {lang === 'en' ? 'Total' : 'Total Previsto'}
                </span>
                <span className="tnum display text-3xl text-primary font-bold">
                  R$ {selectedService?.price || 0}
                </span>
              </div>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-surface-raised border border-border/80 text-[11px] text-muted-foreground leading-normal">
              <p>
                {lang === 'en'
                  ? 'Honest demonstration prototype. No live database transactions or charges are incurred.'
                  : 'Horários demonstrativos. Valores ilustrativos. Nenhuma reserva real será feita.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
