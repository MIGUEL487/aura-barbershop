import { Service, Barber, GalleryItem, Testimonial, FAQItem } from '../types';

export const SERVICES: Service[] = [
  {
    id: 'corte',
    name: 'Precision Haircut',
    namePt: 'Corte personalizado',
    price: 85,
    duration: 45,
    description: 'Initial consultation, tailored scissor & clipper cut, washing, and styled finish designed for your daily routine.',
    descriptionPt: 'Conversa inicial, corte e finalização para um visual que combina com você e sua rotina.',
  },
  {
    id: 'barba',
    name: 'Hot Towel Beard Sculpt',
    namePt: 'Barba com toalha quente',
    price: 60,
    duration: 30,
    description: 'Line detailing, straight razor shave, soothing essential oils, and hot towel relaxation ritual.',
    descriptionPt: 'Desenho, acabamento na navalha e um momento de cuidado com toalha quente e óleos essenciais.',
  },
  {
    id: 'combo',
    name: 'The Master Combo',
    namePt: 'Combo corte + barba',
    price: 130,
    duration: 75,
    description: 'The complete grooming experience. Full precision haircut and signature hot towel beard sculpting in a single session.',
    descriptionPt: 'O cuidado completo com cabelo e barba em uma única visita. Economize R$ 15.',
    badge: 'Save $10',
    badgePt: 'Economize R$ 15',
  },
];

export const BARBERS: Barber[] = [
  {
    id: 'rafael',
    name: 'Rafael Vance',
    specialty: 'Classics & Scissor Craft',
    specialtyPt: 'Clássicos e cortes na tesoura',
    bio: '12+ years of classic heritage cutting, scissor balance, and clean parting.',
    bioPt: 'Mais de 12 anos de experiência em cortes clássicos, tesoura e linhas atemporais.',
    avatar: '/assets/hero/set_b_barber-at-work.webp',
  },
  {
    id: 'diego',
    name: 'Diego Morales',
    specialty: 'Skin Fades & Textured Crops',
    specialtyPt: 'Degradês e cabelos com textura',
    bio: 'Master of razor gradients, textured tops, and modern silhouette transitions.',
    bioPt: 'Especialista em degradês suaves, finalização com textura e silhueta moderna.',
    avatar: '/assets/hero/set_c_barber-at-work.webp',
  },
  {
    id: 'caio',
    name: 'Caio Santos',
    specialty: 'Beard Sculpting & Detailing',
    specialtyPt: 'Barbas e acabamento',
    bio: 'Artisan of straight-razor contouring, beard volume balance, and hot-towel care.',
    bioPt: 'Referência em desenho de barba na navalha, hidratação profunda e acabamento.',
    avatar: '/assets/hero/set_d_barber-at-work.webp',
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Textured Crop & Low Fade',
    titlePt: 'Textura e degradê suave',
    category: 'Modern Texture',
    categoryPt: 'Textura moderna',
    image: '/assets/process/set_a_precision-fade.webp',
    serviceId: 'corte',
  },
  {
    id: 'g2',
    title: 'Defined Natural Curls',
    titlePt: 'Cachos com definição',
    category: 'Natural Waves',
    categoryPt: 'Cabelos cacheados',
    image: '/assets/process/set_b_precision-fade.webp',
    serviceId: 'corte',
  },
  {
    id: 'g3',
    title: 'Classic Side-Part Scissor Cut',
    titlePt: 'Clássico na tesoura',
    category: 'Heritage Craft',
    categoryPt: 'Corte clássico',
    image: '/assets/process/set_c_precision-fade.webp',
    serviceId: 'corte',
  },
  {
    id: 'g4',
    title: 'Sculpted Beard & Razor Edges',
    titlePt: 'Barba alinhada na navalha',
    category: 'Beard Detailing',
    categoryPt: 'Barba e navalha',
    image: '/assets/process/set_a_hot-towel.webp',
    serviceId: 'barba',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    quote: 'Being able to thoroughly discuss the style and texture before the first scissor stroke made all the difference. The result was exactly what I had envisioned.',
    quotePt: 'Gostei de poder conversar sobre o corte antes de começar. O resultado ficou alinhado ao estilo que eu queria.',
    author: 'André M.',
    role: 'Loyal Client (Simulated)',
    rolePt: 'Cliente frequente (Simulação)',
    initials: 'AM',
  },
  {
    id: 't2',
    quote: 'The Master Combo is unmatched. The hot towel ritual alone is worth the visit, and the hair cut grows out cleanly for weeks.',
    quotePt: 'O combo deixou o cabelo e a barba com um acabamento muito bem cuidado. A toalha quente é revigorante.',
    author: 'Bruno S.',
    role: 'Monthly Member (Simulated)',
    rolePt: 'Cliente mensal (Simulação)',
    initials: 'BS',
  },
  {
    id: 't3',
    quote: 'Effortless online scheduling with true calendar discipline. They respect your reserved slot to the minute in an unhurried, calm room.',
    quotePt: 'Escolher o horário na página deixou tudo mais simples. A experiência passa atenção e pontualidade desde o primeiro contato.',
    author: 'Thiago M.',
    role: 'First-time Visitor (Simulated)',
    rolePt: 'Primeira visita (Simulação)',
    initials: 'TM',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Do I need to know exactly which haircut I want before booking?',
    questionPt: 'Preciso saber exatamente qual corte quero?',
    answer: 'Not at all. You can bring reference photos or simply an idea. Every service begins with a tailored consultation to match the cut to your hair texture, facial shape, and daily grooming routine.',
    answerPt: 'Você pode trazer uma referência ou apenas uma ideia. A proposta é conversar sobre seu estilo e rotina antes de começar.',
  },
  {
    id: 'faq-2',
    question: 'How long does each appointment take?',
    questionPt: 'Quanto tempo dura o atendimento?',
    answer: 'The Precision Haircut is allocated 45 minutes; the Beard Sculpt takes 30 minutes; and the Master Combo is 75 minutes. We never double-book so your barber is 100% focused on you.',
    answerPt: 'O corte tem duração prevista de 45 minutos; a barba, 30 minutos; e o combo, 75 minutos. O tempo aparece antes da confirmação.',
  },
  {
    id: 'faq-3',
    question: 'Can I choose my specific barber?',
    questionPt: 'Posso escolher o profissional?',
    answer: 'Yes. You can select Rafael, Diego, or Caio based on their specialties, or choose "Any available" to view all open appointment slots across the entire team.',
    answerPt: 'Sim. Selecione Rafael, Diego ou Caio, ou escolha Sem preferência para consultar os horários demonstrativos da equipe.',
  },
  {
    id: 'faq-4',
    question: 'Can I modify my selections during the booking process?',
    questionPt: 'Posso mudar minha escolha durante o agendamento?',
    answer: 'Yes. You can jump back to any previous step or tap "Edit" in the final review summary. If changing the service extends the required duration, the calendar will automatically update available slots.',
    answerPt: 'Sim. Volte às etapas anteriores ou use Editar na revisão. Se a mudança afetar o horário escolhido, a página pedirá uma nova seleção.',
  },
  {
    id: 'faq-5',
    question: 'Is this a live booking system and will my data be saved?',
    questionPt: 'O agendamento desta página é real? Meus dados serão enviados?',
    answer: 'No. This is a functional demonstration prototype. All appointment slots, prices, and reviews are simulated. No actual payment or credit card is required, and submitted information remains in your browser session only.',
    answerPt: 'Não. Nesta demonstração, os dados ficam apenas temporariamente na página. Use informações fictícias para testar.',
  },
];

export const MARQUEE_WORDS = [
  'PRECISION SCISSOR CUTS',
  'CUSTOM SKIN FADE',
  'HOT TOWEL RITUAL',
  'BEARD ARCHITECTURE',
  'EDITORIAL ATMOSPHERE',
  'BY APPOINTMENT ONLY',
  'UNHURRIED CRAFT',
  'MASTER BARBERING',
];

export const MARQUEE_WORDS_PT = [
  'CORTE NA TESOURA',
  'DEGRADÊ PRECISO',
  'TOALHA QUENTE',
  'BARBA ALINHADA',
  'AMBIENTE CONCEITUAL',
  'HORA MARCADA',
  'ATENÇÃO AOS DETALHES',
  'MESTRES BARBEIROS',
];
