import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { Services } from './components/Services';
import { WhyUs } from './components/WhyUs';
import { Testimonial } from './components/Testimonial';
import { Footer } from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    // Initialize Lenis for smooth cinematic scrolling (GSAP-compatible)
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2,
    });

    // Make GSAP ScrollTrigger sync with Lenis scrolling
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Global Section Transitions
    const sections = document.querySelectorAll('section, footer');
    sections.forEach((section) => {
      // Don't animate the Hero section entrance here as it has its own intro
      if (section.classList.contains('hero-section')) return;

      gsap.fromTo(section, 
        { 
          opacity: 0, 
          y: 20,
          scale: 0.99,
          filter: 'blur(5px)',
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.7,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 95%',
            toggleActions: 'play none none none',
          },
          onStart: () => {
             (section as HTMLElement).style.willChange = 'transform, opacity, filter';
          },
          onComplete: () => {
             (section as HTMLElement).style.willChange = 'auto';
          }
        }
      );
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#030303] selection:bg-white/30 selection:text-white overflow-hidden">
      <Navbar />
      <Hero />
      <Marquee />
      <Services />
      <WhyUs />
      <Testimonial />
      <Footer />
    </main>
  );
}

