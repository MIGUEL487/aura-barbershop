export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
  description: string;
  badge?: string;
  features: string[];
}

export interface Barber {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  avatar: string;
  experience: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  serviceId: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  initials: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
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
