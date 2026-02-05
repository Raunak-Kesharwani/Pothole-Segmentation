import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const BRANDS = [
  { name: 'Ministries', emoji: '🏛️' },
  { name: 'Corporations', emoji: '🏢' },
  { name: 'Municipalities', emoji: '🏘️' },
  { name: 'Partners', emoji: '🤝' },
];

const DUPLICATED = [...BRANDS, ...BRANDS, ...BRANDS];

export function SlidingBrandBar() {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || isPaused) return;
    let raf: number;
    const step = () => {
      el.scrollLeft += 0.5;
      if (el.scrollLeft >= el.scrollWidth / 3) el.scrollLeft = 0;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isPaused]);

  return (
    <section
      className="relative w-full overflow-hidden py-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
        Trusted by ministries, corporations & civic partners
      </p>
      {/* Gradient edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-r from-slate-50 dark:from-slate-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-32 bg-gradient-to-l from-slate-50 dark:from-slate-900 to-transparent z-10 pointer-events-none" />
      <div
        ref={scrollRef}
        className="flex gap-10 sm:gap-16 overflow-x-auto scrollbar-hide mask-fade-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {DUPLICATED.map((b, i) => (
          <motion.div
            key={`${b.name}-${i}`}
            className="flex items-center gap-3 shrink-0 rounded-2xl bg-white dark:bg-slate-800/80 px-6 py-3 shadow-card border border-slate-200/50 dark:border-slate-700/50"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <span className="text-2xl" aria-hidden>{b.emoji}</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">{b.name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
