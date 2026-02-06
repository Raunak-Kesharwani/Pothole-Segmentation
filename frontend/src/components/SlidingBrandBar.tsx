import { motion } from 'framer-motion';
import { Building2, Milestone, Truck, HardHat, Landmark, Syringe, TreePine, Warehouse } from 'lucide-react';

const BRANDS = [
  { name: 'NHAI', icon: Milestone, color: 'text-orange-600' },
  { name: 'MoRTH', icon: Landmark, color: 'text-blue-700' },
  { name: 'L&T Construction', icon: HardHat, color: 'text-yellow-600' },
  { name: 'Tata Projects', icon: Building2, color: 'text-blue-600' },
  { name: 'BBMP', icon: Warehouse, color: 'text-green-600' },
  { name: 'Hindustan Construction', icon: Truck, color: 'text-red-700' },
  { name: 'Dilip Buildcon', icon: TreePine, color: 'text-emerald-700' },
  { name: 'Afcons', icon: Syringe, color: 'text-indigo-600' }, // Metaphorical icon
];

// Duplicate for infinite loop
const MARQUEE_BRANDS = [...BRANDS, ...BRANDS, ...BRANDS];

export function SlidingBrandBar() {
  return (
    <div className="w-full overflow-hidden bg-white dark:bg-slate-950 py-10 relative">
      <div className="text-center mb-8">
        <p className="text-sm font-bold tracking-widest text-slate-500 uppercase">Trusted by India's Top Infrastructure Bodies</p>
      </div>

      <div className="relative flex w-full">
        {/* Gradients for smooth fade effect at edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10" />

        <motion.div
          className="flex items-center gap-16 whitespace-nowrap"
          animate={{ x: [0, -1000] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 40,
          }}
        >
          {MARQUEE_BRANDS.map((brand, idx) => {
            const Icon = brand.icon;
            return (
              <div
                key={`${brand.name}-${idx}`}
                className="flex items-center gap-3 group cursor-default"
              >
                <div className={`p-3 rounded-xl bg-slate-50 dark:bg-slate-900 group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors ${brand.color}`}>
                  <Icon size={28} strokeWidth={2} />
                </div>
                <span className="text-xl font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  {brand.name}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
