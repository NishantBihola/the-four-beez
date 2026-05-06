import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const Services = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.bento-item',
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="py-24 sm:py-32 px-6 lg:px-12 max-w-[1600px] mx-auto z-10 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        
        {/* Block 1: Custom Team Apparel */}
        <div className="bento-item lg:col-span-2 glass-card rounded-[2rem] p-8 sm:p-10 lg:p-16 flex flex-col justify-end min-h-[400px] sm:min-h-[450px] lg:min-h-[550px] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
          {/* subtle abstract background visual for block 1 */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-[#030303] to-[#030303] transition-transform duration-700 group-hover:scale-105" />
          
          <div className="relative z-20 max-w-2xl">
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-widest border border-white/20 rounded-full mb-6 inline-block text-white/70">
              Custom Team Apparel
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight">
              Engineered for Longevity.
            </h2>
            <p className="text-white/90 text-lg sm:text-xl font-light leading-relaxed mb-8">
              We don’t just print shirts; we create wearable brand experiences. Expect high-density,
              vibrant prints designed to withstand the test of time, intense wear, and endless wash cycles.
              Your team deserves to look elite.
            </p>
            <a href="#footer" className="flex items-center gap-2 text-sm font-medium tracking-wide uppercase group-hover:text-amber-400 transition-colors">
              Explore Apparel <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {/* Blocks 2 & 3 wrapper */}
        <div className="flex flex-col gap-4 lg:gap-6">
          
          {/* Block 2: Sublimation Blanks */}
          <div className="bento-item glass-card rounded-[2rem] p-8 lg:p-10 flex-1 flex flex-col justify-between min-h-[300px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/10 via-[#030303] to-[#030303] transition-transform duration-700 group-hover:scale-105" />
            <div className="relative z-20">
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-widest border border-white/20 rounded-full mb-6 inline-block text-white/70">
                Premium Blanks
              </span>
              <h3 className="font-display text-3xl text-white mb-4 leading-snug">
                The Ultimate Canvas.
              </h3>
              <p className="text-white/90 font-light mt-auto">
                Supplying creators and businesses with the highest-grade sublimation blanks on the market. From personalized gifts to bulk orders, we provide the flawless foundation your designs need to pop.
              </p>
            </div>
          </div>

          {/* Block 3: Marketing Consulting */}
          <div className="bento-item glass-card rounded-[2rem] p-8 lg:p-10 flex-1 flex flex-col justify-between min-h-[300px] relative overflow-hidden group bg-white/[0.04]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent transition-transform duration-700 group-hover:scale-105" />
            <div className="relative z-20">
                <span className="px-3 py-1 text-xs font-semibold uppercase tracking-widest border border-white/20 rounded-full mb-6 inline-block text-white/70">
                  Marketing Consulting
                </span>
                <h3 className="font-display text-3xl text-white mb-4 leading-snug">
                  Scale with Strategy.
                </h3>
                <p className="text-white/90 font-light mt-auto">
                  Beyond the physical product, we build the roadmap. Get expert marketing consultation to elevate your brand’s presence, drive conversions, and command attention.
                </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
