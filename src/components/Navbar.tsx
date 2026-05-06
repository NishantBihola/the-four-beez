import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// Keep your exact Logo component here (I've omitted it to save space, paste yours in!)
const Logo = () => (
  <div className="relative group cursor-pointer w-[44px] h-[44px] sm:w-[56px] sm:h-[56px] bg-white/5 rounded-xl flex items-center justify-center border border-white/10 overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 group">
    <svg 
      width="100%" 
      height="100%" 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="p-2 sm:p-3"
    >
      <defs>
        <linearGradient id="logo-bee-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>
      </defs>
      {/* Stylized 'B' with Bee-wing geometry */}
      <path 
        d="M35 25C35 20 40 18 45 18H60C70 18 78 28 78 38C78 48 70 53 60 53H35V25Z" 
        stroke="url(#logo-bee-grad)" 
        strokeWidth="7" 
        strokeLinecap="round"
        className="transition-all duration-500 group-hover:stroke-purple-400"
      />
      <path 
        d="M35 53H60C70 53 78 63 78 75C78 87 70 82 60 82H35V53Z" 
        stroke="white" 
        strokeWidth="7" 
        strokeLinecap="round"
        className="transition-all duration-500 group-hover:stroke-green-400"
      />
      {/* Technical dots */}
      <circle cx="35" cy="25" r="3" fill="#A855F7" className="animate-pulse" />
      <circle cx="35" cy="53" r="3" fill="white" />
      <circle cx="35" cy="82" r="3" fill="#22C55E" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
    </svg>
    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
  </div>
);

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Ref to track isOpen for the scroll handler without re-triggering the useEffect
  const isOpenRef = useRef(isOpen);
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);
  
  // Store timelines so we don't recreate them on every render or scroll tick
  const scrollAnim = useRef<gsap.core.Tween | null>(null);
  const menuAnim = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const ctx = gsap.context(() => {
      // 1. Initial Entrance Animation
      gsap.fromTo(
        '.nav-item',
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, duration: 1, ease: 'expo.out', delay: 0.2 }
      );

      // 2. Pre-compile the Hide/Show Scroll Animation
      // Using yPercent is more performant than absolute pixel values
      scrollAnim.current = gsap.to(navRef.current, {
        yPercent: -100,
        paused: true,
        duration: 0.4,
        ease: 'power3.inOut'
      });

      // 3. Pre-compile the Mobile Menu Animation
      menuAnim.current = gsap.timeline({ paused: true })
        .to(menuRef.current, {
          clipPath: 'circle(150% at 100% 0%)',
          duration: 0.8,
          ease: 'expo.inOut'
        })
        .fromTo('.mobile-link', 
          { y: '100%', rotate: 5 }, // Mask reveal effect
          { y: '0%', rotate: 0, stagger: 0.08, duration: 0.8, ease: 'power4.out' },
          "-=0.4" // Overlap with the circle expansion
        )
        .fromTo('.mobile-accent', 
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.6, ease: 'power3.out' },
          "-=0.4"
        );
    }, navRef);

    // Optimized Scroll Handler
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update background state
      setScrolled(currentScrollY > 50);

      // Play/Reverse pre-compiled animation instead of creating new ones
      if (currentScrollY > lastScrollY && currentScrollY > 150 && !isOpenRef.current) {
        scrollAnim.current?.play(); // Hide
      } else {
        scrollAnim.current?.reverse(); // Show
      }

      lastScrollY = currentScrollY;
    };

    // Use passive true for better scrolling performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      ctx.revert(); // Crucial: Cleans up all GSAP instances on unmount
    };
  }, []); // Removed isOpen dependency

  // Trigger mobile menu animation based on state
  useEffect(() => {
    if (isOpen) {
      menuAnim.current?.play();
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      menuAnim.current?.reverse();
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  return (
    <nav 
      ref={navRef} 
      className={`fixed top-0 left-0 w-full z-[100] px-4 sm:px-6 lg:px-12 py-6 flex items-center justify-between transition-colors duration-500 will-change-transform ${
        scrolled ? 'bg-black/40 backdrop-blur-2xl border-b border-white/5 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.1)]' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center gap-4 nav-item relative z-50">
        <Logo />
        <div className="flex flex-col gap-0">
          <span className="text-white font-display text-xl tracking-tight leading-none uppercase">The Four Beez</span>
        </div>
      </div>

      {/* Desktop Links */}
      <div className="hidden lg:flex items-center gap-12">
        {[{name: 'Services', id: 'services'}, {name: 'About', id: 'about'}, {name: 'Reviews', id: 'reviews'}].map((item) => (
          <a 
            key={item.id} 
            href={`#${item.id}`}
            className="nav-item text-white/60 hover:text-white uppercase tracking-widest text-[11px] font-bold transition-colors duration-300 relative group overflow-hidden"
          >
            {item.name}
            {/* Premium animated underline */}
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white transform origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
          </a>
        ))}
        
        {/* Call to Action Button */}
        <a href="#footer" className="nav-item group relative px-8 py-3 rounded-full border border-white/10 overflow-hidden bg-white/5 backdrop-blur-md">
          {/* Button Hover Background Fill */}
          <div className="absolute inset-0 bg-white transform translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0" />
          <span className="relative text-white group-hover:text-black text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-500 z-10 block">
            Enquiry
          </span>
        </a>
      </div>

      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden z-50 text-white nav-item relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none group"
        aria-label="Toggle Menu"
      >
        <span className={`w-6 h-[1.5px] bg-white transition-all duration-300 origin-center ${isOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
        <span className={`w-6 h-[1.5px] bg-white transition-all duration-300 origin-center ${isOpen ? '-rotate-45 -translate-y-[4px]' : ''}`} />
        
        {/* Hover ring */}
        <div className="absolute inset-0 border border-white/0 rounded-full group-hover:border-white/20 transition-all duration-500 -z-10" />
      </button>

      {/* Mobile Menu */}
      <div 
        ref={menuRef}
        style={{ clipPath: 'circle(0% at 100% 0%)' }}
        className="fixed inset-0 bg-[#050505] z-40 flex flex-col items-center justify-center gap-6 lg:hidden"
      >
        {/* Subtle background noise/gradient for mobile menu depth */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-transparent to-transparent pointer-events-none" />

        {[{name: 'Services', id: 'services'}, {name: 'About', id: 'about'}, {name: 'Reviews', id: 'reviews'}, {name: 'Contact', id: 'footer'}].map((item) => (
          <div key={item.id} className="overflow-hidden p-1">
            <a 
              href={`#${item.id}`}
              onClick={() => setIsOpen(false)}
              className="mobile-link block text-white text-4xl sm:text-5xl font-display italic tracking-tighter hover:text-purple-400 transition-colors uppercase"
            >
              {item.name}
            </a>
          </div>
        ))}
        
        <div className="mt-8 flex flex-col items-center gap-4 mobile-accent">
          <div className="h-[1px] w-16 bg-white/20 origin-center" />
        </div>
      </div>
    </nav>
  );
};