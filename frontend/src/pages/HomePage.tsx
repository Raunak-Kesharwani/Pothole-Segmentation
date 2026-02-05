import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { SlidingBrandBar } from '../components/SlidingBrandBar';

const STATS = [
  { value: 12, suffix: 'k+', label: 'Reports Submitted' },
  { value: 94, suffix: '%', label: 'Accuracy' },
  { value: 48, suffix: '', label: 'Cities Covered' },
  { value: 8, suffix: 'k+', label: 'Potholes Fixed' },
];

export function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen">
      {/* Hero with parallax */}
      <section
        ref={heroRef}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white px-6 sm:px-12 py-20 sm:py-28"
      >
        {/* Animated background elements */}
        <motion.div
          className="absolute inset-0 bg-hero-pattern opacity-50"
          style={{ y }}
        />
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-float"
          style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '30%']) }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl animate-float"
          style={{
            y: useTransform(scrollYProgress, [0, 1], ['0%', '-30%']),
            animationDelay: '-3s',
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-32 h-32 bg-purple-500/15 rounded-full blur-2xl animate-float"
          style={{
            y: useTransform(scrollYProgress, [0, 1], ['0%', '20%']),
            animationDelay: '-1.5s',
          }}
        />
        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center"
          style={{ opacity }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-emerald-100 to-cyan-100 bg-clip-text text-transparent"
          >
            AI-Powered Pothole Detection
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto"
          >
            Smart reporting platform for citizens and authorities. Upload a photo, get instant segmentation and actionable reports.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link to="/prediction">
              <motion.span
                className="inline-block px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/30"
                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                Try Prediction
              </motion.span>
            </Link>
            <Link to="/report">
              <motion.span
                className="inline-block px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 font-semibold backdrop-blur-md"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.25)' }}
                whileTap={{ scale: 0.98 }}
              >
                View Reports
              </motion.span>
            </Link>
            <Link to="/leaderboard">
              <motion.span
                className="inline-block px-6 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 font-semibold transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Learn More
              </motion.span>
            </Link>
            <Link to="/contact">
              <motion.span
                className="inline-block px-6 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 font-semibold border border-white/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Contact
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
        {/* 3D-style visual: road + AI chip */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-center gap-2 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '100%']) }}
        >
          <div className="w-full max-w-md h-16 rounded-t-full bg-slate-700/50 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-glass">
            <span className="text-slate-300 text-sm font-medium">AI Segmentation • Real-time Detection</span>
          </div>
        </motion.div>
      </section>

      {/* Stats with scroll reveal */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
      >
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1, type: 'spring' }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="rounded-2xl bg-white/80 dark:bg-slate-800/80 p-6 shadow-glass border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl"
          >
            <motion.p
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.2, type: 'spring' }}
              className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white"
            >
              {s.value}{s.suffix}
            </motion.p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Scroll sections with parallax */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="mt-20 rounded-2xl bg-gradient-to-br from-white/90 to-slate-50/90 dark:from-slate-800/90 dark:to-slate-900/90 p-8 sm:p-12 shadow-glass border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl"
      >
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-slate-900 dark:text-white"
        >
          How it works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl"
        >
          Upload a photo of a road, run AI detection to get a segmentation overlay and severity, then generate a smart report to share with authorities or your team.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <Link to="/prediction">
            <motion.span
              className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-200 text-white dark:text-slate-900 font-medium text-sm shadow-lg"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Detection →
            </motion.span>
          </Link>
        </motion.div>
      </motion.section>

      {/* Sliding Partner / Brand Bar (infinite scroll, hover pause, gradient edges) */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-20"
      >
        <SlidingBrandBar />
      </motion.section>

      {/* Ratings & Testimonials - Only on Home */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-20"
      >
        <h3 className="text-center text-2xl font-bold text-slate-900 dark:text-white mb-8">Trusted & Rated</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {[
            { stars: 5, count: '4.9', label: 'User Rating' },
            { stars: 5, count: '98%', label: 'Satisfaction' },
            { stars: 5, count: '4.8', label: 'App Store' },
          ].map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-glass border border-slate-200/50 dark:border-slate-700/50"
            >
              <div className="flex justify-center gap-1 mb-2">
                {Array.from({ length: r.stars }).map((_, j) => (
                  <span key={j} className="text-amber-400 text-xl">⭐</span>
                ))}
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{r.count}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{r.label}</p>
            </motion.div>
          ))}
        </div>

        <h3 className="text-center text-2xl font-bold text-slate-900 dark:text-white mb-8">What People Say</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Sarah M.', text: 'This app helped our city fix 200+ potholes in just 3 months!', role: 'City Manager' },
            { name: 'John D.', text: 'Easy to use and incredibly accurate. Highly recommend!', role: 'Civil Engineer' },
            { name: 'Emma L.', text: 'The AI detection is spot-on. Saved us hours of manual inspection.', role: 'Road Inspector' },
          ].map((ref, i) => (
            <motion.div
              key={ref.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-glass"
            >
              <p className="text-slate-700 dark:text-slate-300 text-sm mb-3 italic">"{ref.text}"</p>
              <p className="font-semibold text-slate-900 dark:text-white text-sm">{ref.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{ref.role}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
