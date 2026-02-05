import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { Footer } from './Footer';

const nav = [
  { to: '/', label: 'Home' },
  { to: '/prediction', label: 'Prediction' },
  { to: '/report', label: 'Reports' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/profile', label: 'Profile' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl transition-colors duration-300">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="text-lg font-bold text-slate-900 dark:text-white tracking-tight shrink-0"
          >
            Pothole AI
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {nav.map(({ to, label }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to}>
                  <span
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      active
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <ThemeToggle />
            <button
              type="button"
              aria-label="Menu"
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              <nav className="px-4 py-3 flex flex-col gap-1">
                {nav.map(({ to, label }) => {
                  const active = location.pathname === to;
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-4 py-3 rounded-lg text-sm font-medium ${
                        active
                          ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1300px]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
