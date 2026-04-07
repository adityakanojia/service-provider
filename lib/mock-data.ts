export type ServiceProvider = {
  id: string;
  name: string;
  category: string;
  image: string;
  bio: string;
  rating: number;
  location: string;
  sessionPrice: number;
  highlights: string[];
};

export const serviceProviders: ServiceProvider[] = [
  {
    id: 'provider-1',
    name: 'Sophia Bennett',
    category: 'Hair Stylist',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
    bio: 'Specializes in modern cuts, color refresh sessions, and quick styling appointments for busy professionals.',
    rating: 4.9,
    location: 'Downtown Studio',
    sessionPrice: 45,
    highlights: ['15 years experience', 'Women and men styling', 'Weekend slots'],
  },
  {
    id: 'provider-2',
    name: 'Marcus Rivera',
    category: 'Physiotherapist',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
    bio: 'Focused on posture correction, mobility recovery, and guided rehabilitation plans with measurable progress.',
    rating: 4.8,
    location: 'Wellness Clinic',
    sessionPrice: 65,
    highlights: ['Sports injury support', 'Personalized plans', 'Same-day follow-up'],
  },
  {
    id: 'provider-3',
    name: 'Ava Thompson',
    category: 'Beauty Consultant',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=80',
    bio: 'Offers skincare guidance, makeup appointments, and event-ready beauty sessions tailored to client goals.',
    rating: 4.7,
    location: 'Glow Lounge',
    sessionPrice: 55,
    highlights: ['Skin-first approach', 'Bridal trials', 'Product recommendations'],
  },
  {
    id: 'provider-4',
    name: 'Daniel Kim',
    category: 'Personal Trainer',
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80',
    bio: 'Builds efficient strength and conditioning programs with flexible coaching sessions for all fitness levels.',
    rating: 4.9,
    location: 'North End Gym',
    sessionPrice: 70,
    highlights: ['Weight loss coaching', 'Strength programs', 'Flexible timing'],
  },
];
