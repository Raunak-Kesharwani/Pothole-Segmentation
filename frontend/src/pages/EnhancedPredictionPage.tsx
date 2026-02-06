import { useState } from 'react'
import { motion } from 'framer-motion'
import { PredictionPage as OriginalPredictionPage } from './PredictionPage'
import { useAuth } from '../context/SupabaseAuthContext'
import { savePredictionReport, uploadImage, updateLeaderboard } from '../api/reports'
import { generateAIReport } from '../lib/gemini'

export const EnhancedPredictionPage = () => {
  const { user } = useAuth()
  const [showReportForm, setShowReportForm] = useState(false)
  const [severity, setSeverity] = useState('medium')
  const [complaintText, setComplaintText] = useState('')
  const [reportLoading, setReportLoading] = useState(false)
  const [reportSuccess, setReportSuccess] = useState(false)

  const handleSubmitReport = async (predictionResult: any, lastLocation: any, file: File) => {
    if (!user) {
      alert('Please login to submit a report')
      return
    }

    setReportLoading(true)

    try {
      // Upload original image
      const imageUrl = await uploadImage(file, 'reports')
      if (!imageUrl) throw new Error('Failed to upload image')

      // Generate AI report
      const aiReport = await generateAIReport(complaintText, severity, lastLocation, predictionResult)

      // Save to database
      await savePredictionReport(
        user.id,
        imageUrl,
        '', // segmented URL can be added later
        lastLocation.lat,
        lastLocation.lng,
        severity,
        complaintText,
        JSON.stringify(aiReport),
        predictionResult.metrics
      )

      // Update leaderboard
      await updateLeaderboard(user.id)

      setReportSuccess(true)
      setTimeout(() => {
        setReportSuccess(false)
        setComplaintText('')
        setSeverity('medium')
        setShowReportForm(false)
      }, 3000)
    } catch (error: any) {
      alert('Error submitting report: ' + error.message)
    } finally {
      setReportLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <OriginalPredictionPage />

      {/* Report Submission Form */}
      {showReportForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-glass border border-slate-200/50 dark:border-slate-700/50"
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Submit Pothole Report</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Severity Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
              <textarea
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
                placeholder="Describe the pothole condition, traffic impact, etc."
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleSubmitReport({}, {}, new File([], 'temp'))}
                disabled={reportLoading || !complaintText}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-50"
              >
                {reportLoading ? 'Submitting...' : 'Submit Report'}
              </button>
              <button
                onClick={() => setShowReportForm(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {reportSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
        >
          ✓ Report submitted successfully! Admins will review it shortly.
        </motion.div>
      )}
    </div>
  )
}
