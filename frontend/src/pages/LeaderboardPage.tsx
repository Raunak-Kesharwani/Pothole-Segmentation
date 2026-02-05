import { useState } from 'react';
import { motion } from 'framer-motion';

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

const PERIODS: { value: Period; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

// Mock leaderboard data
const MOCK_LEADERS = [
  { rank: 1, name: 'Alex Roadwatch', reportsSubmitted: 42, resolved: 38, impactScore: 92, badge: '🏆 Top Reporter' },
  { rank: 2, name: 'Sam Streetwise', reportsSubmitted: 38, resolved: 35, impactScore: 88, badge: '⭐ Star Contributor' },
  { rank: 3, name: 'Jordan Pavement', reportsSubmitted: 31, resolved: 28, impactScore: 85, badge: '🔥 On Fire' },
  { rank: 4, name: 'Casey Crosswalk', reportsSubmitted: 28, resolved: 24, impactScore: 82, badge: '📌 Active' },
  { rank: 5, name: 'Demo User', reportsSubmitted: 12, resolved: 10, impactScore: 75, badge: '✨ Newcomer' },
];

export function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>('monthly');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Leaderboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Top contributors by reports submitted, resolved, and impact score.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => setPeriod(p.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              period === p.value
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-card border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/80">
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Rank</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">User</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Reports</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Resolved</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Impact</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Badge</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LEADERS.map((row, i) => (
                <motion.tr
                  key={row.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className={`inline-flex w-8 h-8 items-center justify-center rounded-full text-sm font-bold ${
                      row.rank === 1 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                      row.rank === 2 ? 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300' :
                      row.rank === 3 ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-500' :
                      'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {row.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{row.name}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{row.reportsSubmitted}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{row.resolved}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden">
                        <motion.div
                          className="h-full bg-emerald-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${row.impactScore}%` }}
                          transition={{ duration: 0.6, delay: i * 0.05 }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{row.impactScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{row.badge}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 shadow-card border border-slate-100 dark:border-slate-700"
      >
        <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Monthly summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">1.2k</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Reports this month</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">89%</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Resolved</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">340</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Active reporters</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">12</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cities</p>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
