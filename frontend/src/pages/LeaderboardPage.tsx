import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Flame, User, TrendingUp, MapPin, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';


type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

const PERIODS: { value: Period; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

// Mock leaderboard data with Indian context
const MOCK_LEADERS = [
  { rank: 1, name: 'Rajesh Kumar', reportsSubmitted: 89, resolved: 82, impactScore: 98, badge: 'Top Reporter', icon: Trophy },
  { rank: 2, name: 'Priya Sharma', reportsSubmitted: 76, resolved: 70, impactScore: 94, badge: 'Star Contributor', icon: Medal },
  { rank: 3, name: 'Amit Patel', reportsSubmitted: 65, resolved: 58, impactScore: 88, badge: 'On Fire', icon: Flame },
  { rank: 4, name: 'Sneha Gupta', reportsSubmitted: 52, resolved: 48, impactScore: 85, badge: 'Active', icon: User },
  { rank: 5, name: 'Vikram Singh', reportsSubmitted: 45, resolved: 40, impactScore: 82, badge: 'Newcomer', icon: Award },
];

export function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>('monthly');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Leaderboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Top contributors making our Indian cities safer and smoother.
          </p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${period === p.value
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          { label: 'Reports this month', value: '1.2k', icon: TrendingUp, color: 'text-blue-500' },
          { label: 'Resolution Rate', value: '89%', icon: CheckCircle2, color: 'text-emerald-500' },
          { label: 'Active Reporters', value: '340', icon: User, color: 'text-amber-500' },
          { label: 'Cities Covered', value: '12', icon: MapPin, color: 'text-purple-500' }
        ].map((stat, i) => (
          <motion.div variants={item} key={i}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color} opacity-80`} />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Card className="overflow-hidden border-0 shadow-lg ring-1 ring-slate-200 dark:ring-slate-800">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
          <CardTitle>Top Contributors</CardTitle>
          <CardDescription>Ranked by impact score and resolved reports across India</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Rank</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Reports</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Resolved</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Impact Score</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Badge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {MOCK_LEADERS.map((row, i) => (
                  <motion.tr
                    key={row.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-transform group-hover:scale-110 ${row.rank === 1 ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-200' :
                        row.rank === 2 ? 'bg-slate-200 text-slate-700' :
                          row.rank === 3 ? 'bg-orange-100 text-orange-700' :
                            'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                        {row.rank}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{row.name}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{row.reportsSubmitted}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{row.resolved}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${row.impactScore}%` }}
                            transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                          />
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{row.impactScore}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <row.icon size={12} className="text-emerald-500" />
                        {row.badge}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
