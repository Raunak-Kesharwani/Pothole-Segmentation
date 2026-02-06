import { supabase } from '../lib/supabaseClient'

export const savePredictionReport = async (
  userId: string,
  imageUrl: string,
  segmentedUrl: string,
  latitude: number,
  longitude: number,
  severity: string,
  complaintText: string,
  aiSummary: string,
  detectionMetrics: any
) => {
  const { data, error } = await supabase.from('reports').insert({
    user_id: userId,
    image_url: imageUrl,
    segmented_url: segmentedUrl,
    latitude,
    longitude,
    severity,
    complaint_text: complaintText,
    ai_summary: aiSummary,
    status: 'pending',
    metrics: detectionMetrics,
  })

  if (error) {
    console.error('Error saving report:', error)
    return null
  }

  return data?.[0]
}

export const uploadImage = async (file: File, bucket: string) => {
  const timestamp = Date.now()
  const fileName = `${timestamp}-${file.name}`

  const { data, error } = await supabase.storage.from(bucket).upload(fileName, file)

  if (error) {
    console.error('Upload error:', error)
    return null
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path)

  return publicUrl
}

export const fetchUserReports = async (userId: string) => {
  const { data, error } = await supabase.from('reports').select('*').eq('user_id', userId).order('created_at', { ascending: false })

  return { data, error }
}

export const updateLeaderboard = async (userId: string) => {
  // Fetch user's stats
  const { data: reports } = await supabase.from('reports').select('*').eq('user_id', userId)

  const reportsCount = reports?.length || 0
  const resolvedCount = reports?.filter((r) => r.status === 'fixed').length || 0
  const score = reportsCount * 10 + resolvedCount * 50

  const { error } = await supabase.from('leaderboard').upsert(
    {
      user_id: userId,
      reports_count: reportsCount,
      resolved_count: resolvedCount,
      score,
      month: new Date().toISOString().slice(0, 7),
    },
    { onConflict: 'user_id' }
  )

  return error
}
