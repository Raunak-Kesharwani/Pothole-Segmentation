import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/SupabaseAuthContext'
import { User, Mail, Calendar, FileText, CheckCircle, Trophy, Loader2, AlertCircle, BarChart, Edit2, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { motion } from 'framer-motion'

interface UserProfile {
  id: string
  email: string
  name: string
  role: 'citizen' | 'admin' | 'worker'
  created_at: string
}

interface UserStats {
  reportsSubmitted: number
  resolvedReports: number
  leaderboardScore: number
}

export const ProfilePage = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<UserStats>({
    reportsSubmitted: 0,
    resolvedReports: 0,
    leaderboardScore: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    if (!user) return

    const fetchProfileData = async () => {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) throw profileError
        setProfile(profileData)

        const { count: reportsCount } = await supabase
          .from('reports')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id)

        const { count: resolvedCount } = await supabase
          .from('reports')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id)
          .eq('status', 'fixed')

        const { data: leaderboardData } = await supabase
          .from('leaderboard')
          .select('score')
          .eq('user_id', user.id)
          .single()

        const { data: historyData } = await supabase
          .from('reports')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)

        setHistory(historyData || [])

        setStats({
          reportsSubmitted: reportsCount || 0,
          resolvedReports: resolvedCount || 0,
          leaderboardScore: leaderboardData?.score || 0,
        })
      } catch (err: any) {
        console.error('Error fetching profile:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [user])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-emerald-600" size={32} />
          <p className="text-slate-500 font-medium text-sm">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
          <CardContent className="flex items-center gap-3 text-red-600 dark:text-red-400 p-6">
            <AlertCircle size={20} />
            <p className="font-medium">Error loading profile: {error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8 font-sans"
    >
      {/* Header Card */}
      <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-md">
        <div className="h-32 bg-gradient-to-r from-emerald-500 to-cyan-500" />
        <CardContent className="relative pt-0 pb-8 px-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="-mt-12">
              <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-950 p-1 shadow-xl">
                <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                  {profile?.name ? (
                    <span className="text-3xl font-bold text-slate-700 dark:text-slate-300">{profile.name.charAt(0).toUpperCase()}</span>
                  ) : (
                    <User size={40} />
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 pt-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                    {profile?.name || 'User'}
                    <Badge variant={
                      profile?.role === 'admin' ? 'destructive' :
                        profile?.role === 'worker' ? 'secondary' : 'success'
                    } className="capitalize">
                      {profile?.role}
                    </Badge>
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-2">
                    <span className="flex items-center gap-1.5"><Mail size={14} /> {profile?.email}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> Joined {new Date(profile?.created_at || '').toLocaleDateString()}</span>
                  </div>
                </div>
                <Button variant="outline" className="gap-2">
                  <Edit2 size={14} /> Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Reports Submitted</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.reportsSubmitted}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Issues Resolved</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.resolvedReports}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-600 dark:text-amber-400">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Impact Score</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.leaderboardScore}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart size={20} className="text-emerald-600" />
              Activity History
            </CardTitle>
            <CardDescription>Your recent report submissions and status updates.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12"><Loader2 className="animate-spin mx-auto text-slate-400" /></div>
            ) : history.length > 0 ? (
              <div className="space-y-4">
                {history.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${item.status === 'fixed' ? 'bg-emerald-100 text-emerald-600' :
                        item.status === 'assigned' ? 'bg-blue-100 text-blue-600' :
                          'bg-amber-100 text-amber-600'
                        }`}>
                        {item.status === 'fixed' ? <CheckCircle size={16} /> :
                          item.status === 'assigned' ? <User size={16} /> :
                            <Clock size={16} />}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-md">
                          {item.complaint_text || 'Pothole Report'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(item.created_at).toLocaleDateString()} • {item.severity} severity
                        </p>
                      </div>
                    </div>
                    <Badge variant={item.status === 'fixed' ? 'success' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400 text-sm">No recent activity to show.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
