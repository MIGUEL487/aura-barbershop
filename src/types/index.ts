export type Language = 'en' | 'pt';

export interface Service {
  id: string;
  name: string;
  namePt: string;
  price: number;
  duration: number; // in minutes
  description: string;
  descriptionPt: string;
  badge?: string;
  badgePt?: string;
}

export interface Barber {
  id: string;
  name: string;
  specialty: string;
  specialtyPt: string;
  bio: string;
  bioPt: string;
  avatar: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  titlePt: string;
  category: string;
  categoryPt: string;
  image: string;
  serviceId: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  quotePt: string;
  author: string;
  role: string;
  rolePt: string;
  initials: string;
}

export interface FAQItem {
  id: string;
  question: string;
  questionPt: string;
  answer: string;
  answerPt: string;
}

export interface BookingState {
  step: number; // 1 to 5
  serviceId: string | null;
  barberId: string | null; // 'any' or specific barber ID
  date: string | null; // 'YYYY-MM-DD'
  time: string | null; // '10:00', '14:30', etc.
  clientName: string;
  clientPhone: string;
  notes: string;
  isConfirmed: boolean;
}
