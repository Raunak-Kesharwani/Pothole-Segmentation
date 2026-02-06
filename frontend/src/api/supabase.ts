import { supabase } from '../lib/supabaseClient'

export const uploadReportImage = async (file: File, path: string) => {
  const { data, error } = await supabase.storage.from('reports').upload(path, file, { cacheControl: '3600' })
  return { data, error }
}

export const insertReport = async (report: any) => {
  const { data, error } = await supabase.from('reports').insert(report).select()
  return { data, error }
}

export const fetchReports = async () => {
  const { data, error } = await supabase.from('reports').select('*')
  return { data, error }
}
