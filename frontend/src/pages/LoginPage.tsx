import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { Footer } from '../components/Footer'
import { ThemeToggle } from '../components/ThemeToggle'
import { User, Wrench, ShieldCheck, Target, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

export const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState<'admin' | 'worker' | 'citizen'>('citizen')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      // Update user role based on selection
      await supabase.from('users').update({ role: selectedRole }).eq('id', data.user?.id)

      // Redirect based on selected role
      if (selectedRole === 'admin') navigate('/admin')
      else if (selectedRole === 'worker') navigate('/worker')
      else navigate('/prediction')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors font-sans">
      <header className="px-6 py-6 flex justify-between items-center w-full max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-lg">
          <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-slate-900">
            <Target size={18} />
          </div>
          Pothole AI
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-slate-200 dark:border-slate-800">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none" htmlFor="password">
                    Password
                  </label>
                  <Link to="#" className="text-sm font-medium text-emerald-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium leading-none">Select Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { role: 'citizen', icon: User, label: 'Citizen' },
                    { role: 'worker', icon: Wrench, label: 'Worker' },
                    { role: 'admin', icon: ShieldCheck, label: 'Admin' },
                  ].map((item) => (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => setSelectedRole(item.role as any)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${selectedRole === item.role
                        ? 'bg-slate-900 dark:bg-emerald-600 text-white border-transparent shadow-md transform scale-105'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                      <item.icon size={18} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 text-sm font-medium text-center">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full h-11 text-base mt-2" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-emerald-600 hover:underline">
                Create Account
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <div className="hidden sm:block">
        <Footer />
      </div>
    </div>
  )
}
