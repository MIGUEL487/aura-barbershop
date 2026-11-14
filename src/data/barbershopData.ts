import { Service, Barber, GalleryItem, Testimonial, FAQItem } from '../types';

export const SERVICES: Service[] = [
  {
    id: 'corte',
    name: 'Tailored Precision Cut',
    price: 55,
    duration: 45,
    description: 'Bespoke consultation, tailored scissor & clipper craftsmanship, invigorating scalp wash, and customized daily styling.',
    features: [
      'Facial shape & texture consultation',
      'Purifying wash & conditioning treatment',
      'Straight razor neck clean-up',
    ],
  },
  {
    id: 'barba',
    name: 'Hot Towel Beard Sculpt',
    price: 45,
    duration: 30,
    description: 'Contour line design, straight razor detailing, steamed herbal towel infusion, and nourishing organic beard oils.',
    features: [
      'Hot herbal steam towel wrap',
      'Traditional straight razor edging',
      'Cold towel pore sealing & soothing balm',
    ],
  },
  {
    id: 'combo',
    name: 'The Executive Ritual',
    price: 85,
    duration: 75,
    description: 'The definitive grooming experience. Full tailored precision haircut coupled with our signature hot towel straight razor shave.',
    badge: 'Save $15',
    features: [
      'Complete tailored haircut & wash',
      'Full hot towel beard sculpt & shave',
      'Complimentary espresso & scalp tonic',
    ],
  },
];

export const BARBERS: Barber[] = [
  {
    id: 'rafael',
    name: 'Rafael Vance',
    specialty: 'Heritage Classics & Scissor Craft',
    bio: 'Over 12 years mastering scissor balance, clean classic partings, and natural growth contouring.',
    avatar: '/assets/hero/set_b_barber-at-work.webp',
    experience: '12+ Years Craft',
  },
  {
    id: 'diego',
    name: 'Diego Morales',
    specialty: 'Precision Fades & Textured Crops',
    bio: 'Artisan of seamless razor fades, weight dissipation, and modern silhouette transitions.',
    avatar: '/assets/hero/set_c_barber-at-work.webp',
    experience: '8+ Years Craft',
  },
  {
    id: 'caio',
    name: 'Caio Santos',
    specialty: 'Beard Architecture & Razor Detailing',
    bio: 'Specialist in razor line geometry, hot towel facial rituals, and custom beard volume balancing.',
    avatar: '/assets/hero/set_d_barber-at-work.webp',
    experience: '10+ Years Craft',
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Low Skin Taper & Textured Crop',
    category: 'Modern Texture',
    image: '/assets/process/set_a_precision-fade.webp',
    serviceId: 'corte',
  },
  {
    id: 'g2',
    title: 'Natural Wave Architecture',
    category: 'Curls & Flow',
    image: '/assets/process/set_b_precision-fade.webp',
    serviceId: 'corte',
  },
  {
    id: 'g3',
    title: 'Classic Scissor Executive Part',
    category: 'Heritage Craft',
    image: '/assets/process/set_c_precision-fade.webp',
    serviceId: 'corte',
  },
  {
    id: 'g4',
    title: 'Sculpted Beard & Razor Edges',
    category: 'Beard Sculpting',
    image: '/assets/process/set_a_hot-towel.webp',
    serviceId: 'barba',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    quote: 'Being able to discuss my styling habits and hair texture before the shears were raised made all the difference. The shape holds effortlessly for weeks.',
    author: 'André M.',
    role: 'Bi-Weekly Client (Verified)',
    initials: 'AM',
  },
  {
    id: 't2',
    quote: 'The Executive Ritual is in a league of its own. The steamed herbal towel alone is revitalizing, and their schedule discipline is unmatched—zero wait time.',
    author: 'Julian B.',
    role: 'Monthly Member (Verified)',
    initials: 'JB',
  },
  {
    id: 't3',
    quote: 'Booking online took 30 seconds. The room is quiet, the music is curated, and Diego’s scissor technique is pure artistry. My permanent barbershop.',
    author: 'Marcus T.',
    role: 'First-time Visitor (Verified)',
    initials: 'MT',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Do I need to know exactly what cut I want prior to visiting?',
    answer: 'Not at all. You are welcome to bring visual references or simply describe your routine. Every appointment commences with a bespoke consultation to align the cut with your face shape, head structure, and lifestyle.',
  },
  {
    id: 'faq-2',
    question: 'How long does each appointment take?',
    answer: 'A Precision Haircut is reserved for 45 minutes; the Beard Sculpt takes 30 minutes; and the Executive Ritual is allocated 75 minutes. We never overlap clients, guaranteeing your craftsman’s dedicated attention.',
  },
  {
    id: 'faq-3',
    question: 'Can I request a specific master barber?',
    answer: 'Yes. You can select Rafael, Diego, or Caio based on their specialties, or choose "First Available" to view open slots across the entire studio team.',
  },
  {
    id: 'faq-4',
    question: 'Can I amend my booking details during the appointment process?',
    answer: 'Yes. You can return to any previous step or tap "Edit" in the final review breakdown. The system will dynamically adjust available calendar slots if service duration changes.',
  },
  {
    id: 'faq-5',
    question: 'Is this an operational reservation system and will my payment be processed?',
    answer: 'This application functions as a high-fidelity demonstration prototype. All time slots, pricing, and appointments are simulated. No actual credit card charge or database transmission occurs.',
  },
];

export const MARQUEE_WORDS_CRAFT = [
  'BESPOKE SCISSOR CUTS',
  'STEAMED HERBAL HOT TOWEL',
  'STRAIGHT RAZOR DETAILING',
  'BY APPOINTMENT ONLY',
  'UNHURRIED CRAFTSMANSHIP',
  'CALM EDITORIAL ATMOSPHERE',
  'ZERO WAIT TIMES',
  'MASTER BARBERING STUDIO',
];

export const MARQUEE_WORDS_RITUAL = [
  'THE EXECUTIVE RITUAL',
  'SHEARS, CLIPPERS & RAZOR',
  'FRESH ROASTED ESPRESSO',
  'DETAILS THAT ELEVATE',
  'YOUR DEDICATED MOMENT',
  'HERITAGE MEETS MODERNITY',
  'PINHEIROS • SÃO PAULO',
];
