import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'

export const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'month'>('all')

  useEffect(() => {
    fetchLeaderboard()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('leaderboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leaderboard' }, () => {
        fetchLeaderboard()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*, users(name, email)')
      .order('score', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching leaderboard:', error)
    } else {
      setLeaderboard(data || [])
    }
    setLoading(false)
  }

  if (loading) return <div className="text-center py-12">Loading leaderboard...</div>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Leaderboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Top contributors to the community</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-300 text-sm">Rank</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-300 text-sm">Name</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-300 text-sm">Reports</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-300 text-sm">Resolved</th>
                <th className="px-6 py-4 text-right font-semibold text-slate-700 dark:text-slate-300 text-sm">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <motion.tr
                  key={entry.user_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      {index === 0 ? (
                        <span className="text-2xl">🥇</span>
                      ) : index === 1 ? (
                        <span className="text-2xl">🥈</span>
                      ) : index === 2 ? (
                        <span className="text-2xl">🥉</span>
                      ) : (
                        <span className="font-semibold text-slate-600 dark:text-slate-400">#{index + 1}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900 dark:text-white">{entry.users?.name || 'Anonymous'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{entry.users?.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900 dark:text-white">{entry.reports_count || 0}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-green-600 dark:text-green-400">{entry.resolved_count || 0}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{entry.score || 0}</p>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6"
      >
        <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">How Scoring Works</h3>
        <ul className="text-sm text-indigo-800 dark:text-indigo-200 space-y-1">
          <li>• 10 points for each report submitted</li>
          <li>• 50 points for each resolved pothole</li>
          <li>• Leaderboard resets monthly</li>
          <li>• Top contributors get community recognition</li>
        </ul>
      </motion.div>
    </motion.div>
  )
}
