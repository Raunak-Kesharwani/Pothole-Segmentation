import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export const useSupabase = () => {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then((res: any) => setUser(res.data.session?.user ?? null))
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => data.unsubscribe()
  }, [])

  return { user }
}
