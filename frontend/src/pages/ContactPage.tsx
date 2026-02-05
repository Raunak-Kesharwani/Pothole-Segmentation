import { useState } from 'react';
import { motion } from 'framer-motion';
import { Chatbot } from '../components/Chatbot';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: send to API
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Contact Us</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Have questions? Reach out to us or chat with our AI assistant.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-glass border border-slate-200/50 dark:border-slate-700/50">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Email</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">support@potholeai.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Phone</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Address</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      123 Innovation Street<br />
                      Tech City, TC 12345
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🕒</span>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Business Hours</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-glass border border-slate-200/50 dark:border-slate-700/50">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/prediction" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                    Try Prediction →
                  </a>
                </li>
                <li>
                  <a href="/report" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                    Generate Report →
                  </a>
                </li>
                <li>
                  <a href="/leaderboard" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                    View Leaderboard →
                  </a>
                </li>
              </ul>
            </div>
          </motion.section>

          {/* Contact Form */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-glass border border-slate-200/50 dark:border-slate-700/50"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Send us a Message</h2>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
              >
                ✓ Thank you! Your message has been sent. We'll get back to you soon.
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-lg transition-colors"
                >
                  Send Message
                </motion.button>
              </form>
            )}
          </motion.section>
        </div>
      </motion.div>

      {/* Chatbot */}
      <Chatbot />
    </>
  );
}
