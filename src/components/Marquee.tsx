import React from 'react';

export const Marquee = () => {
  const items = [
    '5.0 ★★★★★ Google Rating',
    '"Flawless execution"',
    '"Amazing quality that lives for years"',
    '"Fast, professional, and creative"',
    'Trusted by teams across Canada',
  ];

  return (
    <section className="w-full bg-[#f8f8f8] text-[#030303] py-5 overflow-hidden flex items-center border-y border-white/5 relative z-20">
      <div className="animate-marquee">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-12 px-6 items-center flex-nowrap">
            {items.map((item, j) => (
              <span
                key={`${i}-${j}`}
                className="text-sm md:text-base font-semibold uppercase tracking-wider whitespace-nowrap"
              >
                {item}
                <span className="opacity-30 ml-12">•</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};
