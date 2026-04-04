import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Testimonial {
  id: string;
  name: string;
  country: string;
  flag: string;
  image: string;
  rating: number;
  text: string;
  text_key: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'John Smith',
    country: 'USA',
    flag: '🇺🇸',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    text: 'Incredible platform, my portfolio has grown significantly since I started using it.',
    text_key: 'testimonials.t1'
  },
  {
    id: '2',
    name: 'Maria Garcia',
    country: 'Brazil',
    flag: '🇧🇷',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4,
    text: 'Very easy to use and the customer support is top-notch.',
    text_key: 'testimonials.t2'
  },
  {
    id: '3',
    name: 'Oluwaseun Adebayo',
    country: 'Nigeria',
    flag: '🇳🇬',
    image: 'https://randomuser.me/api/portraits/men/53.jpg',
    rating: 5,
    text: 'The best crypto trading experience I\'ve had. Highly recommended!',
    text_key: 'testimonials.t3'
  },
  {
    id: '4',
    name: 'Sophie Martin',
    country: 'France',
    flag: '🇫🇷',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 5,
    text: 'Secure, fast, and reliable. Exactly what I need for my investments.',
    text_key: 'testimonials.t4'
  },
  {
    id: '5',
    name: 'Dmitry Ivanov',
    country: 'Russia',
    flag: '🇷🇺',
    image: 'https://randomuser.me/api/portraits/men/71.jpg',
    rating: 4,
    text: 'Great features and low fees. The interface is very intuitive.',
    text_key: 'testimonials.t5'
  },
  {
    id: '6',
    name: 'Liam Brown',
    country: 'Canada',
    flag: '🇨🇦',
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
    rating: 5,
    text: 'I love the automated investment plans. It makes growing my wealth effortless.',
    text_key: 'testimonials.t6'
  },
  {
    id: '7',
    name: 'Amina Diallo',
    country: 'Senegal',
    flag: '🇸🇳',
    image: 'https://randomuser.me/api/portraits/women/53.jpg',
    rating: 5,
    text: 'Fantastic returns and a very transparent system. I feel safe investing here.',
    text_key: 'testimonials.t7'
  },
  {
    id: '8',
    name: 'Carlos Rodriguez',
    country: 'Argentina',
    flag: '🇦🇷',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    rating: 4,
    text: 'Good platform overall, the mobile experience is particularly smooth.',
    text_key: 'testimonials.t8'
  },
  {
    id: '9',
    name: 'Emma Schmidt',
    country: 'Germany',
    flag: '🇩🇪',
    image: 'https://randomuser.me/api/portraits/women/12.jpg',
    rating: 5,
    text: 'The analytics tools are incredibly detailed and helpful for my trading strategy.',
    text_key: 'testimonials.t9'
  },
  {
    id: '10',
    name: 'Katarzyna Kowalska',
    country: 'Poland',
    flag: '🇵🇱',
    image: 'https://randomuser.me/api/portraits/women/33.jpg',
    rating: 5,
    text: 'Fast withdrawals and excellent security measures. A trustworthy platform.',
    text_key: 'testimonials.t10'
  },
  {
    id: '11',
    name: 'James Wilson',
    country: 'UK',
    flag: '🇬🇧',
    image: 'https://randomuser.me/api/portraits/men/11.jpg',
    rating: 4,
    text: 'Solid performance and a great selection of assets to trade.',
    text_key: 'testimonials.t11'
  },
  {
    id: '12',
    name: 'Fatima Hassan',
    country: 'Egypt',
    flag: '🇪🇬',
    image: 'https://randomuser.me/api/portraits/women/22.jpg',
    rating: 5,
    text: 'The educational resources helped me get started quickly. Great for beginners!',
    text_key: 'testimonials.t12'
  },
  {
    id: '13',
    name: 'Mateo Fernandez',
    country: 'Chile',
    flag: '🇨🇱',
    image: 'https://randomuser.me/api/portraits/men/62.jpg',
    rating: 5,
    text: 'I\'ve tried many platforms, but this one stands out for its reliability.',
    text_key: 'testimonials.t13'
  },
  {
    id: '14',
    name: 'Elena Popa',
    country: 'Romania',
    flag: '🇷🇴',
    image: 'https://randomuser.me/api/portraits/women/41.jpg',
    rating: 4,
    text: 'Very satisfied with the ROI on the elite plans. Customer service is responsive.',
    text_key: 'testimonials.t14'
  }
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex-shrink-0 w-[320px] sm:w-[380px] bg-bg-card border border-border-light rounded-2xl p-5 shadow-light mx-3 my-2 transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img 
            src={testimonial.image} 
            alt={testimonial.name} 
            loading="lazy"
            className="w-12 h-12 rounded-full object-cover border-2 border-accent-primary/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-text-primary text-sm">{testimonial.name}</h4>
              <span className="text-sm" title={testimonial.country}>{testimonial.flag}</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] font-medium text-emerald-500 uppercase tracking-wider">
                {t('testimonials.verified', 'Verified Review')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < testimonial.rating ? 'fill-accent-primary text-accent-primary' : 'fill-border-light text-border-light'}`} 
            />
          ))}
        </div>
      </div>
      <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">
        "{t(testimonial.text_key, testimonial.text)}"
      </p>
    </div>
  );
};

export default function Testimonials() {
  const { t } = useTranslation();
  
  // Split testimonials into two rows
  const row1 = TESTIMONIALS.slice(0, 7);
  const row2 = TESTIMONIALS.slice(7, 14);

  return (
    <section className="py-16 bg-bg-primary overflow-hidden relative z-10 border-t border-border-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <h2 className="text-3xl font-bold text-text-primary mb-3">
          {t('testimonials.title', 'Trusted by Investors Worldwide')}
        </h2>
        <p className="text-text-secondary max-w-2xl mx-auto">
          {t('testimonials.subtitle', 'Join thousands of satisfied users who are growing their wealth with our platform.')}
        </p>
      </div>

      {/* 
        Infinite Loop Logic:
        We use two identical sets of cards in a flex container.
        The container is animated to translate from 0 to -50%.
        Because the two sets are identical, when it reaches -50%, 
        it seamlessly jumps back to 0 without any visual flicker.
        
        Hover Pause Logic:
        The 'hover:[&>div]:!animate-play-state-paused' class pauses the animation
        on desktop when hovering over the container.
      */}
      
      <div className="flex flex-col gap-4 relative overflow-hidden">
        {/* Left Fading Gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none"></div>
        
        {/* Right Fading Gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none"></div>

        {/* Upper Row - Scrolls Left */}
        <div className="flex w-max animate-scroll-left hover:[animation-play-state:paused] md:hover:[animation-play-state:paused]">
          {/* Duplicate the row for seamless loop */}
          {[...row1, ...row1].map((t, idx) => (
            <TestimonialCard key={`r1-${idx}`} testimonial={t} />
          ))}
        </div>

        {/* Lower Row - Scrolls Right */}
        <div className="flex w-max animate-scroll-right hover:[animation-play-state:paused] md:hover:[animation-play-state:paused]">
          {/* Duplicate the row for seamless loop */}
          {[...row2, ...row2].map((t, idx) => (
            <TestimonialCard key={`r2-${idx}`} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
