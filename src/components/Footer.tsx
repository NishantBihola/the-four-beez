import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer id="footer" className="pt-24 lg:pt-32 pb-12 bg-[#030303] text-white border-t border-white/10 relative overflow-hidden">
      
      {/* Background large blur for texture */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[80vw] h-[50vh] bg-blue-900/10 blur-[150px] pointer-events-none rounded-[100%]" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-24">
          
          {/* Main Footer CTA block */}
          <div className="lg:col-span-8 flex flex-col items-start max-w-3xl">
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight">
              Ready to build something <span className="italic font-light">exceptional?</span>
            </h2>
            <p className="text-white/60 text-lg sm:text-xl font-light max-w-xl mb-10">
              Let’s get your project in the queue. Reach out today to discuss custom prints, bulk blanks, or marketing strategies.
            </p>
            <button className="bg-white text-black font-semibold uppercase tracking-widest text-xs sm:text-sm px-8 py-5 rounded-full flex items-center gap-3 transition-transform hover:scale-105">
              Contact Us Now <ArrowUpRight size={18} />
            </button>
          </div>

          {/* Details / Links */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-12 lg:flex lg:flex-col lg:items-end">
            <div className="flex flex-col gap-4 lg:items-end">
              <span className="text-white/40 uppercase tracking-widest text-xs font-semibold mb-2">Call Samir</span>
              <a href="tel:+17807002248" className="text-lg hover:text-white/70 transition-colors">(780) 700-2248</a>
              
              <span className="text-white/40 uppercase tracking-widest text-xs font-semibold mt-4 mb-2">Visit Us</span>
              <p className="max-w-[150px] leading-relaxed text-sm text-white/80">
                6220 92 St NW<br />
                Edmonton, AB<br />
                T6E 3A7
              </p>
            </div>
            
            <div className="flex flex-col gap-4 lg:items-end">
              <span className="text-white/40 uppercase tracking-widest text-xs font-semibold mb-2">Follow the Hive</span>
              <a href="https://instagram.com/thefourbeez" target="_blank" rel="noreferrer" className="hover:text-white/70 transition-colors">Instagram</a>
              <a href="https://facebook.com/thefourbeez" target="_blank" rel="noreferrer" className="hover:text-white/70 transition-colors">Facebook</a>
              <a href="https://linkedin.com/company/thefourbeez" target="_blank" rel="noreferrer" className="hover:text-white/70 transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>

        {/* Massive Typography Treatment at the bottom */}
        <div className="w-full border-t border-white/10 pt-12 flex flex-col items-center">
            <h1 className="text-[12vw] sm:text-[14vw] font-display font-medium leading-[0.8] tracking-tighter w-full text-center text-white/5 select-none pointer-events-none uppercase">
              The Four Beez
            </h1>
            <div className="w-full flex flex-col sm:flex-row justify-between items-center text-white/30 text-xs sm:text-sm mt-8 uppercase tracking-widest">
              <span>© 2026 THE FOUR BEEZ. ALL RIGHTS RESERVED.</span>
              <div className="flex gap-6 mt-4 sm:mt-0">
                <a href="#" className="hover:text-white/70 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white/70 transition-colors">Legal Notice</a>
              </div>
            </div>
        </div>

      </div>
    </footer>
  );
};
