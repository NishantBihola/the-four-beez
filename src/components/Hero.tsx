import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import { DepthMapBackground } from './DepthMapBackground';

export const Hero = () => {
  const compRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Cinematic Entrance Choreography
      // Scale down and unblur the background to establish depth immediately
      tl.fromTo(
        '.parallax-deep',
        { scale: 1.15, filter: 'blur(20px)', opacity: 0 },
        { scale: 1, filter: 'blur(0px)', opacity: 1, duration: 2.4, ease: 'power3.inOut' }
      )
      // Reveal text overlapping the background animation for fluidity
      .fromTo(
        '.reveal-text',
        { y: '120%', opacity: 0, rotateX: -20, rotateZ: 2, scale: 0.95 },
        { 
          y: '0%', 
          opacity: 1, 
          rotateX: 0,
          rotateZ: 0,
          scale: 1,
          duration: 1.2, 
          stagger: 0.1, 
          ease: 'power4.out' 
        },
        '-=1.4' // Overlap: Start text while background is still settling
      )
      // Fade in subtitles, accents, and CTAs
      .fromTo(
        '.reveal-fade',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: 'power2.out' },
        "-=0.8" 
      )
      .fromTo(
        '.color-accent',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' },
        "-=1.5"
      );

      // 2. High-Performance Mouse Parallax (GSAP quickTo)
      // These functions are bound to the GPU and handle 120hz updates flawlessly
      const xDeep = gsap.quickTo('.parallax-deep', 'x', { duration: 1.2, ease: 'power3.out' });
      const yDeep = gsap.quickTo('.parallax-deep', 'y', { duration: 1.2, ease: 'power3.out' });

      const xMid = gsap.quickTo('.parallax-mid', 'x', { duration: 0.8, ease: 'power3.out' });
      const yMid = gsap.quickTo('.parallax-mid', 'y', { duration: 0.8, ease: 'power3.out' });

      const xLight = gsap.quickTo('.parallax-light', 'x', { duration: 0.4, ease: 'power3.out' });
      const yLight = gsap.quickTo('.parallax-light', 'y', { duration: 0.4, ease: 'power3.out' });

      const handleMouseMove = (e: MouseEvent) => {
        const { innerWidth, innerHeight } = window;
        
        // Normalize coordinates to -1 to 1
        const xPos = (e.clientX / innerWidth - 0.5) * 2;
        const yPos = (e.clientY / innerHeight - 0.5) * 2;

        // Background moves opposite to the mouse to create deep space
        xDeep(xPos * -25);
        yDeep(yPos * -25);

        // Mid and Light layers move with the mouse at different depths
        xMid(xPos * 15);
        yMid(yPos * 15);

        xLight(xPos * 8);
        yLight(yPos * 8);
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, compRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={compRef}
      className="hero-section relative min-h-[100svh] w-full flex flex-col justify-center overflow-hidden bg-[#030303] perspective-1000"
    >
      {/* Background Layer with Parallax */}
      {/* Added will-change-transform for hardware acceleration */}
      <div className="absolute -inset-[5%] z-0 parallax-deep will-change-transform">
        <DepthMapBackground />
      </div>

      {/* Subtle Color Accents */}
      <div className="color-accent absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-0">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-green-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-30 container mx-auto px-6 md:px-12 flex flex-col items-center xl:items-start text-center xl:text-left pt-20 pb-10">
        <div ref={parallaxRef} className="flex flex-col items-center xl:items-start w-full max-w-6xl">
          
          {/* Hero text */}
          <div className="parallax-mid will-change-transform flex flex-col gap-4 mb-6 sm:mb-10 w-full">
            <h1 className="font-display text-[3.2rem] leading-[0.9] sm:text-7xl md:text-9xl lg:text-[11rem] sm:leading-[0.8] tracking-tighter text-white mb-4 sm:mb-10 flex flex-col items-center xl:items-start gap-0">
              <div className="overflow-hidden pb-1 sm:pb-2">
                <span className="reveal-text block font-extralight sm:pr-10 text-white/90 will-change-transform">Materialize</span>
              </div>
              <div className="overflow-hidden pb-2 sm:pb-4">
                <span className="reveal-text block font-medium will-change-transform">Vision.</span>
              </div>
            </h1>
          </div>

          {/* Subheadline */}
          <div className="parallax-light will-change-transform overflow-hidden mb-10 sm:mb-12 max-w-xl">
            <p className="reveal-fade text-white/70 text-sm sm:text-base md:text-lg font-light tracking-wide leading-relaxed uppercase">
              High-end apparel engineering for brands that refuse to blend in. Precision sublimation, team outfitting, and tactical consulting.
            </p>
          </div>

          {/* Dual CTAs */}
          <div className="parallax-light will-change-transform reveal-fade flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <a href="#footer" className="group w-full sm:w-auto bg-white text-black font-bold uppercase tracking-widest text-[10px] sm:text-[11px] px-10 sm:px-12 py-5 sm:py-6 rounded-full flex items-center justify-center gap-4 transition-all hover:bg-neutral-200">
              Start Project
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#services" className="w-full sm:w-auto border border-white/20 text-white font-bold uppercase tracking-widest text-[10px] sm:text-[11px] px-10 sm:px-12 py-5 sm:py-6 rounded-full flex items-center justify-center transition-all hover:bg-white/5">
              Our Services
            </a>
          </div>

        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-12 hidden xl:flex flex-col items-start gap-4 z-30 overflow-hidden parallax-light will-change-transform">
        <span className="reveal-fade text-[10px] text-white/20 font-bold tracking-widest uppercase vertical-text">Scroll to explore</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
};