import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/prediction', label: 'Prediction' },
  { to: '/report', label: 'Reports' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/profile', label: 'Profile' },
  { to: '/contact', label: 'Contact' },
];

const SOCIAL = [
  { name: 'Twitter', href: '#', icon: '𝕏' },
  { name: 'LinkedIn', href: '#', icon: 'in' },
  { name: 'GitHub', href: '#', icon: '⌘' },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 transition-colors duration-300">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <Link to="/" className="text-xl font-bold text-slate-900 dark:text-white">
              Pothole AI
            </Link>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              AI-powered pothole detection and smart reporting for citizens, municipalities, and road authorities.
            </p>
            <div className="mt-4 flex gap-3">
              {SOCIAL.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
          >
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Quick links
            </h4>
            <ul className="mt-4 space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Contact
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a href="mailto:support@potholeai.com" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  support@potholeai.com
                </a>
              </li>
              <li>123 Civic Road, Suite 100</li>
              <li>Support: Mon–Fri 9am–6pm</li>
            </ul>
          </motion.div>

          {/* About / Legal */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Company
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link to="/contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">About</Link></li>
              <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms</a></li>
            </ul>
          </motion.div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            © {new Date().getFullYear()} Pothole AI. All rights reserved.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Built for safer roads.
          </p>
        </div>
      </div>
    </footer>
  );
}
