import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Star, MessageSquare, Quote, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.26 1.07-3.71 1.07-2.87 0-5.3-1.94-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.86-2.59 3.3-4.53 12-4.53z" fill="#EA4335"/>
  </svg>
);

const FALLBACK_REVIEWS = [
  {
    author: "G E.",
    role: "Google Local Guide",
    text: "They did a fantastic job with printing the shirts for our team. Samir is very kind and professional. Everything was ready quickly and looks fantastic. Can’t wait to use them again for future projects.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
  },
  {
    author: "S. Miller",
    role: "Team Captain",
    text: "Engineered for longevity indeed! Our team shirts have been through multiple high-intensity matches and countless washes, and the prints still look brand new. Samir's attention to detail is visible in every stitch.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
  },
  {
    author: "A. Thompson",
    role: "Marketing Manager",
    text: "Beyond the high-quality blanks, the strategic consulting provided by The Four Beez helped us launch our brand across Canada with confidence. Fast, professional, and creative beyond expectations.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
  }
];

const AVATARS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
];

export const Testimonial = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reviewLink = "https://www.google.com/maps/place/The+Four+Beez/@53.4989,-113.4722,17z/data=!4m8!3m7!1s0x53a02245b73d2a71:0x3ae0e172258de4e3!8m2!3d53.4989!4d-113.4722!9m1!1b1";

  // Use fallback data for now to ensure site stability
  const displayReviews = FALLBACK_REVIEWS;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.review-card',
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.15,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );

      gsap.fromTo(
        '.review-header',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [displayReviews]);

  return (
    <section id="reviews" ref={sectionRef} className="py-24 sm:py-40 px-6 lg:px-12 max-w-[1600px] mx-auto overflow-hidden">
      <div className="flex flex-col items-center mb-24 text-center review-header">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex -space-x-2">
            {AVATARS.map((url, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-[#030303] bg-white/10 flex items-center justify-center overflow-hidden">
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 ml-2">
             {[...Array(5)].map((_, i) => (
               <Star key={i} size={14} className="fill-orange-400 text-orange-400" />
             ))}
          </div>
          <span className="text-white/60 uppercase tracking-[0.2em] text-[10px] font-bold py-1 px-3 border border-white/20 rounded-full bg-white/10 backdrop-blur-sm">
            Top Rated on Google
          </span>
        </div>
        <h2 className="font-display text-3xl sm:text-6xl lg:text-8xl text-white mb-8 tracking-tighter leading-[1.1]">
          The Gold Standard <br /> in <span className="text-white/40 italic font-extralight">Execution.</span>
        </h2>
        <p className="text-white/70 text-sm sm:text-base md:text-lg max-w-2xl font-light leading-relaxed uppercase tracking-wider px-4 sm:px-0">
          Engineered for quality. Vetted by professionals. <br className="hidden sm:block" />
          Experience the difference of a precision-driven partnership.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-24">
        {displayReviews.map((review, i) => (
          <div 
            key={i} 
            className="review-card group relative p-1 rounded-[2.5rem] bg-gradient-to-br from-white/20 to-transparent hover:from-white/30 transition-all duration-700 h-full"
          >
            <div className="h-full bg-[#080808]/90 backdrop-blur-2xl rounded-[2.4rem] p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden group-hover:bg-[#0a0a0a] transition-colors duration-500 shadow-2xl">
              {/* Decorative Quote */}
              <Quote className="absolute -top-4 -right-2 w-24 h-24 text-white/[0.05] -rotate-12 transition-transform group-hover:scale-110 duration-700" />
              
              <div className="relative z-10 mb-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} size={14} className="fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                    <GoogleLogo />
                  </div>
                </div>
                <p className="text-white/90 text-lg sm:text-xl font-light italic leading-[1.6]">
                  "{review.text}"
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-5 border-t border-white/10 pt-8">
                 <div className="w-14 h-14 rounded-full bg-gradient-to-br from-white/20 to-transparent p-[1px]">
                   <div className="w-full h-full rounded-full bg-[#111] overflow-hidden flex items-center justify-center border border-white/5">
                     {review.image ? (
                       <img src={review.image} alt={review.author} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                     ) : (
                       <div className="text-white font-bold text-xl">{review.author[0]}</div>
                     )}
                   </div>
                 </div>
                 <div className="flex flex-col gap-0.5">
                   <h4 className="text-white font-medium text-lg tracking-tight">{review.author}</h4>
                   <p className="text-white/50 text-[10px] uppercase font-bold tracking-[0.2em]">{review.role}</p>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center flex-col items-center gap-12 test-fade">
        <a 
          href={reviewLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-4 sm:gap-6 px-8 sm:px-12 py-5 sm:py-7 rounded-full overflow-hidden transition-all duration-500"
        >
          {/* Animated Background for CTA */}
          <div className="absolute inset-0 bg-white group-hover:bg-neutral-100 transition-colors duration-500" />
          <div className="absolute inset-x-0 bottom-0 h-[100%] bg-gradient-to-t from-white via-white/80 translation-y-full group-hover:translate-y-0 transition-transform duration-700" />
          
          <GoogleLogo />
          <span className="relative z-10 text-black font-bold uppercase tracking-[0.2em] text-xs">
            Join our Verified Clients
          </span>
          <ArrowRight size={18} className="relative z-10 text-black transition-transform group-hover:translate-x-2 duration-500" />
        </a>
      </div>
    </section>
  );
};

