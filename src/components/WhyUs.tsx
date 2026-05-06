import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const WhyUs = () => {
  const compRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.split-text-reveal',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: compRef.current,
            start: 'top 70%',
          },
        }
      );
      
      gsap.fromTo(
        '.image-reveal',
        { scale: 1.1, opacity: 0, filter: 'blur(10px)' },
        {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: compRef.current,
            start: 'top 70%',
          },
        }
      );

      // Character glitch entrance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: compRef.current,
          start: 'top 60%',
        }
      });

      tl.fromTo('.character-reveal', 
        { 
          opacity: 0, 
          scale: 0.9, 
          x: -30, 
          skewX: 10, 
          filter: 'contrast(150%) brightness(120%)' 
        },
        { 
          opacity: 1, 
          scale: 1, 
          x: 0, 
          skewX: 0, 
          filter: 'none', 
          duration: 0.4, 
          ease: 'power4.out' 
        }
      )
      .to('.character-reveal', { duration: 0.05, x: 5, skewX: 5, opacity: 0.7 })
      .to('.character-reveal', { duration: 0.05, x: -5, skewX: -5, opacity: 0.9 })
      .to('.character-reveal', { duration: 0.1, x: 0, skewX: 0, opacity: 1, filter: 'none' });
      
    }, compRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={compRef} className="py-24 sm:py-32 px-6 md:px-12 lg:px-16 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        
        {/* Left Side: Copy */}
        <div className="flex flex-col items-start xl:pl-12">
          <h2 className="font-display text-5xl lg:text-6xl text-white mb-8 leading-tight split-text-reveal">
            Uncompromising Quality. <br className="hidden sm:block" /> Zero Friction.
          </h2>
          
          <div className="space-y-6 text-lg sm:text-xl text-white/60 font-light leading-relaxed mb-10">
            <p className="split-text-reveal">
              At The Four Beez, we believe you shouldn't have to choose between speed and quality. Led by industry expert Samir, our studio operates on a foundation of absolute professionalism and rapid turnaround times.
            </p>
            <p className="split-text-reveal">
              We provide you with infinite options, transparent pricing, and a collaborative process. We aren't just a print shop; we are a loyal partner in your success journey.
            </p>
          </div>

          <button className="split-text-reveal group flex items-center gap-3 text-white uppercase tracking-widest text-sm font-semibold pb-2 border-b border-white/20 hover:border-white transition-colors">
            Meet the team
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Right Side: Abstract Visual (Placeholder for a high-end photo) */}
        <div className="w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-[2rem] overflow-hidden relative glass-card p-1">
          <div className="w-full h-full rounded-[1.8rem] overflow-hidden relative">
            <div className="absolute inset-0 image-reveal bg-gradient-to-br from-neutral-800 to-black object-cover mesh-gradient opacity-50 mix-blend-screen" />
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000" 
              alt="Character model"
              className="character-reveal absolute inset-0 w-full h-full object-cover object-top opacity-0 grayscale contrast-125 brightness-90 mix-blend-lighten"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[1.8rem]" />
          </div>
        </div>

      </div>
    </section>
  );
};
