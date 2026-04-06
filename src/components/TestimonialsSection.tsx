import React from 'react';
import { Star, Clock } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  country: string;
  flag: string;
  review: string;
  rating: number;
  timeAgo: string;
}

function generateTimeAgo() {
  const rand = Math.random();

  if (rand < 0.4) {
    const years = [1, 2, 3];
    const y = years[Math.floor(Math.random() * years.length)];
    return `${y} year${y > 1 ? "s" : ""} ago`;
  }

  if (rand < 0.7) {
    const months = [2, 4, 6];
    const m = months[Math.floor(Math.random() * months.length)];
    return `${m} months ago`;
  }

  if (rand < 0.85) {
    const weeks = [1, 2, 3];
    const w = weeks[Math.floor(Math.random() * weeks.length)];
    return `${w} week${w > 1 ? "s" : ""} ago`;
  }

  if (rand < 0.95) {
    const days = [1, 3, 7];
    const d = days[Math.floor(Math.random() * days.length)];
    return `${d} day${d > 1 ? "s" : ""} ago`;
  }

  const recent = ["30 minutes ago", "2 hours ago", "6 hours ago"];
  return recent[Math.floor(Math.random() * recent.length)];
}

const reviewTexts = [
  "I was honestly skeptical at first, but after seeing consistent returns and smooth withdrawals over time, I’m genuinely impressed with how everything works.",
  "The platform is very easy to use, and the ROI payments have been steady without delays, which gives me a lot of confidence.",
  "Customer support responds faster than I expected, and they actually solve issues instead of giving generic replies.",
  "I got introduced by a colleague at work, and so far, it has been a really smooth and positive experience.",
  "Withdrawals are processed without unnecessary delays, which is something I really value in any investment platform.",
  "The level of transparency here is what really stands out for me compared to other platforms I’ve tried.",
  "I like how everything is clearly explained before investing, so you know exactly what to expect.",
  "It’s rare to find a platform that actually delivers on its promises, but this one has been consistent so far.",
  "My experience has been smooth from signup to making my first withdrawal without any complications.",
  "The investment plans are straightforward and easy to understand, even for someone new to this.",
  "I’ve tried a few platforms before, but this one feels more reliable and structured than most.",
  "Payments have been consistent, and I haven’t experienced any issues since I started using it.",
  "I really appreciate how responsive and helpful the support team is whenever I have questions.",
  "The dashboard makes it easy to track my investments and monitor my returns in real time.",
  "A friend recommended it to me, and I’m glad I gave it a chance because it has worked well so far.",
  "Everything works exactly as described, which is something you don’t always get with online platforms.",
  "There are no hidden fees or surprises, and everything is clearly communicated upfront.",
  "The ROI payouts have been coming in as expected, which builds trust over time.",
  "It’s been a smooth journey since I started, with no major issues at all.",
  "I feel more confident investing here compared to other platforms I’ve tried in the past.",
  "The platform is clean, simple, and effective, making it easy to navigate even for beginners.",
  "I’ve already made a few withdrawals without any issues, and the process was straightforward.",
  "Support actually listens and resolves problems quickly, which is something I really appreciate.",
  "It’s refreshing to see a platform that values transparency and keeps users informed.",
  "My returns have been consistent so far, and everything has been working as expected.",
  "It’s very easy to navigate and beginner-friendly, which makes the experience stress-free.",
  "Everything feels well-structured and organized, from the dashboard to the investment plans.",
  "The process from deposit to receiving ROI is seamless and doesn’t feel complicated.",
  "I like how clear and simple the investment plans are, without unnecessary confusion.",
  "This is definitely one of the better platforms I’ve used so far.",
  "I was hesitant at first, but after trying it out, the results have been quite encouraging.",
  "The overall experience has been smooth, and I haven’t encountered any major issues.",
  "The team behind this platform seems very professional and organized.",
  "Everything has been working exactly how it was explained to me when I joined.",
  "Fast support and reliable payouts really make a big difference in the overall experience.",
  "I like the simplicity of the whole process, from investing to tracking returns.",
  "There are no unnecessary complications, just straightforward investing and clear results.",
  "I’ve already recommended it to a few friends because of my positive experience."
];

const reviewers = [
  { name: "Liam Smith", country: "United States", flag: "🇺🇸" },
  { name: "Emma Johnson", country: "United Kingdom", flag: "🇬🇧" },
  { name: "Noah Williams", country: "Canada", flag: "🇨🇦" },
  { name: "Olivia Brown", country: "Australia", flag: "🇦🇺" },
  { name: "James Jones", country: "New Zealand", flag: "🇳🇿" },
  { name: "Sophia Garcia", country: "Spain", flag: "🇪🇸" },
  { name: "Robert Miller", country: "Germany", flag: "🇩🇪" },
  { name: "Isabella Davis", country: "France", flag: "🇫🇷" },
  { name: "Michael Rodriguez", country: "Mexico", flag: "🇲🇽" },
  { name: "Charlotte Martinez", country: "Italy", flag: "🇮🇹" },
  { name: "William Hernandez", country: "Brazil", flag: "🇧🇷" },
  { name: "Amelia Lopez", country: "Argentina", flag: "🇦🇷" },
  { name: "David Gonzalez", country: "Chile", flag: "🇨🇱" },
  { name: "Mia Wilson", country: "Colombia", flag: "🇨🇴" },
  { name: "Richard Anderson", country: "South Africa", flag: "🇿🇦" },
  { name: "Evelyn Thomas", country: "Nigeria", flag: "🇳🇬" },
  { name: "Joseph Taylor", country: "Kenya", flag: "🇰🇪" },
  { name: "Harper Moore", country: "India", flag: "🇮🇳" },
  { name: "Thomas Jackson", country: "Singapore", flag: "🇸🇬" },
  { name: "Abigail Martin", country: "Japan", flag: "🇯🇵" },
  { name: "Charles Lee", country: "South Korea", flag: "🇰🇷" },
  { name: "Emily Perez", country: "Philippines", flag: "🇵🇭" },
  { name: "Christopher Thompson", country: "Vietnam", flag: "🇻🇳" },
  { name: "Elizabeth White", country: "Thailand", flag: "🇹🇭" },
  { name: "Daniel Harris", country: "Indonesia", flag: "🇮🇩" },
  { name: "Sofia Sanchez", country: "Malaysia", flag: "🇲🇾" },
  { name: "Matthew Clark", country: "Turkey", flag: "🇹🇷" },
  { name: "Avery Ramirez", country: "Greece", flag: "🇬🇷" },
  { name: "Anthony Lewis", country: "Portugal", flag: "🇵🇹" },
  { name: "Scarlett Robinson", country: "Netherlands", flag: "🇳🇱" },
  { name: "Mark Walker", country: "Belgium", flag: "🇧🇪" },
  { name: "Madison Young", country: "Switzerland", flag: "🇨🇭" },
  { name: "Donald Allen", country: "Austria", flag: "🇦🇹" },
  { name: "Chloe King", country: "Sweden", flag: "🇸🇪" },
  { name: "Steven Wright", country: "Norway", flag: "🇳🇴" },
  { name: "Layla Scott", country: "Denmark", flag: "🇩🇰" },
  { name: "Paul Nguyen", country: "Finland", flag: "🇫🇮" },
  { name: "Zoey Adams", country: "Ireland", flag: "🇮🇪" }
];

const allReviews: Review[] = reviewers.map((reviewer, index) => ({
  id: index + 1,
  name: reviewer.name,
  country: reviewer.country,
  flag: reviewer.flag,
  review: reviewTexts[index],
  rating: Math.floor(Math.random() * 3) + 3, // Random 3, 4, or 5 stars
  timeAgo: generateTimeAgo()
}));

const topRowReviews = allReviews.slice(0, 19);
const bottomRowReviews = allReviews.slice(19, 38);

const ReviewCard = React.memo(({ review }: { review: Review }) => {
  return (
    <div className="w-[160px] sm:w-[200px] md:w-[240px] lg:w-[380px] shrink-0 bg-bg-card/40 backdrop-blur-md border border-border-light rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 lg:p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4">
        <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-accent-primary/20 to-accent-primary/5 text-accent-primary flex items-center justify-center font-bold text-[10px] sm:text-xs md:text-sm lg:text-lg border border-accent-primary/10">
          {review.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-text-primary font-bold text-[10px] sm:text-xs md:text-sm lg:text-base truncate flex items-center gap-1">
            {review.name} <span className="ml-1 inline-block">{review.flag}</span>
          </h4>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3.5 md:h-3.5 ${
                  i < review.rating 
                    ? "fill-accent-primary text-accent-primary" 
                    : "text-text-muted/20 fill-transparent"
                }`} 
              />
            ))}
          </div>
        </div>
      </div>
      
      <p className="text-text-secondary text-[9px] sm:text-xs md:text-sm leading-relaxed mb-2 sm:mb-4 line-clamp-2 italic">
        "{review.review}"
      </p>

      <div className="flex items-center justify-end gap-1 text-text-muted">
        <Clock className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3" />
        <span className="text-[8px] sm:text-[10px] md:text-xs font-medium">{review.timeAgo}</span>
      </div>
    </div>
  );
});

const MarqueeRow = ({ reviews, direction }: { reviews: Review[], direction: 'left' | 'right' }) => {
  const animationClass = direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right';
  
  return (
    <div className="flex overflow-hidden w-full group py-1 md:py-2">
      <div className={`flex gap-4 md:gap-8 px-4 ${animationClass} md:group-hover:[animation-play-state:paused]`} style={{ width: "max-content" }}>
        {[...reviews, ...reviews].map((review, index) => (
          <ReviewCard key={`${review.id}-${index}`} review={review} />
        ))}
      </div>
    </div>
  );
};

export default function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 overflow-hidden relative bg-bg-primary/30">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 lg:px-12 mb-2 md:mb-3 text-center overflow-hidden">
        <h2 className="text-xl md:text-4xl lg:text-5xl font-bold mb-1 text-text-primary tracking-tight">
          Trusted by Investors <span className="text-accent-primary">Worldwide</span>
        </h2>
        <p className="text-text-secondary max-w-2xl mx-auto text-sm md:text-base font-medium opacity-80">
          Real experiences from our growing global community of professional and retail investors.
        </p>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full space-y-0 py-4 md:py-8 flex flex-col justify-center">
        {/* Background Track Card - Spans end to end */}
        <div className="absolute inset-y-0 left-0 right-0 bg-bg-card/40 border-y border-border-light/60 backdrop-blur-[4px]" />

        {/* Top Row - Scrolls Left */}
        <MarqueeRow reviews={topRowReviews} direction="left" />

        {/* Bottom Row - Scrolls Right */}
        <MarqueeRow reviews={bottomRowReviews} direction="right" />
      </div>
    </section>
  );
}
