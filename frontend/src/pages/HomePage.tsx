import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { SlidingBrandBar } from '../components/SlidingBrandBar';
import { Footer } from '../components/Footer';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuth } from '../context/SupabaseAuthContext';
import { Button } from '../components/ui/Button';
import { CheckCircle2, ArrowRight, Zap, Target, TrendingUp, MessageSquare, Users, BarChart3, Globe, Star, User, Shield, Award } from 'lucide-react';

const STATS = [
  { value: 12, suffix: 'k+', label: 'Reports Submitted', icon: BarChart3 },
  { value: 94, suffix: '%', label: 'Detection Accuracy', icon: Target },
  { value: 48, suffix: '', label: 'Cities Served', icon: Globe },
  { value: 8, suffix: 'k+', label: 'Potholes Fixed', icon: CheckCircle2 },
];

const STEPS = [
  { icon: Zap, title: 'Upload Image', desc: 'Take or upload a photo of the pothole in seconds' },
  { icon: Target, title: 'AI Detection', desc: 'Advanced YOLOv8 detects and segments automatically' },
  { icon: TrendingUp, title: 'Generate Report', desc: 'Gemini AI creates professional, actionable reports' },
  { icon: Users, title: 'Authorities Fix', desc: 'Seamless handoff to city maintenance teams' },
];

export function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-x-hidden flex flex-col font-sans">

      {/* ====== HERO SECTION ====== */}
      <section className="relative w-full min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">

        {/* Navbar inside Hero for seamless look */}
        <nav
          className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled
            ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 py-4 shadow-sm'
            : 'bg-transparent py-6'
            }`}
        >
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            import {Logo} from '../components/ui/Logo';

            // ... (inside component)
            <Link
              to="/"
              className="text-xl font-bold text-slate-900 dark:text-white tracking-tight shrink-0 flex items-center gap-2"
            >
              <Logo className="w-9 h-9" />
              Pothole AI
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {!user && (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="hidden sm:inline-flex text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400">Sign In</Button>
                  </Link>
                  <Link to="/login">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 rounded-full px-6">Get Started</Button>
                  </Link>
                </>
              )}
              {user && (
                <Link to="/prediction">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6">Dashboard</Button>
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Background - Seamless */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent opacity-20" />

          <motion.div
            className="absolute top-[-20%] left-[20%] w-[35rem] h-[35rem] bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-[120px]"
            animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 12, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-[10%] right-[10%] w-[30rem] h-[30rem] bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full blur-[100px]"
            animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 15, repeat: Infinity, delay: 1 }}
          />
        </div>

        {/* Hero Content */}
        <div className="flex-grow flex items-center justify-center px-6 pt-32 pb-20 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-full mb-8 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">AI-Powered Safer Roads</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.1] mb-8 text-slate-900 dark:text-white"
            >
              Building Smarter Cities,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
                One Road at a Time.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Detect, analyze, and report road defects instantly with our enterprise-grade AI.
              Streamline maintenance and improve civic safety.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                onClick={() => navigate(user ? '/prediction' : '/login')}
                className="text-lg px-8 h-14 rounded-full shadow-xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 text-white transition-all hover:scale-105"
              >
                Start Detection <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/report')}
                className="text-lg px-8 h-14 rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 text-slate-900 dark:text-white transition-all"
              >
                Public Report
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-16 pt-8 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-slate-500 dark:text-slate-400"
            >
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Free Tier Available</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> API Access</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Mobile Ready</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== STATS ====== */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 mb-4 text-emerald-600 dark:text-emerald-400 ring-1 ring-slate-100 dark:ring-slate-700">
                    <Icon size={24} />
                  </div>
                  <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-sm font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== FEATURES ====== */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-slate-900 dark:text-white tracking-tight">Why Choose Pothole AI?</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Our platform combines cutting-edge computer vision with easy-to-use reporting tools to modernize infrastructure maintenance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: 'Secure & Reliable', desc: 'Enterprise-grade security with role-based access control for city officials.' },
            { icon: Zap, title: 'Real-time Analysis', desc: 'Get results in milliseconds. Our models are optimized for speed and accuracy.' },
            { icon: Award, title: 'City Certified', desc: 'Trusted by municipal departments to streamline maintenance workflows.' }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:shadow-emerald-500/5 dark:hover:border-emerald-500/30 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section className="py-32 bg-slate-100 dark:bg-slate-900/50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-slate-900 dark:text-white tracking-tight">How It Works</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Simple steps to safer roads.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="absolute -top-5 -left-5 w-12 h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg transform -rotate-6">
                    {i + 1}
                  </div>
                  <div className="mt-4">
                    <Icon className="w-10 h-10 text-emerald-600 mb-6" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 dark:bg-emerald-950/20 rounded-[3rem] p-12 sm:p-24 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50" />

          <div className="relative z-10">
            <h2 className="text-4xl sm:text-6xl font-black text-white mb-8 tracking-tight">Ready to verify?</h2>
            <p className="text-slate-300 mb-12 max-w-xl mx-auto text-xl leading-relaxed">
              Join thousands of citizens and officials making roads safer today.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/login')}
              className="h-16 px-10 text-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-full shadow-lg shadow-emerald-500/30 hover:scale-105 transition-transform"
            >
              Create Free Account
            </Button>
          </div>
        </div>
      </section>

      {/* ====== BRANDS ====== */}
      <section className="py-16 border-t border-slate-200 dark:border-slate-800">
        <SlidingBrandBar />
      </section>

      {/* Footer is now Global in App.tsx */}
    </div>
  );
}
