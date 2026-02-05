import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePredictions } from '../context/PredictionsContext';
import { downloadReportAsPDF, downloadReportAsImage, downloadReportAsJSON } from '../lib/report';
import type { PredictionRecord } from '../types/api';

// Mock GenAI summary (in production: call Gemini/OpenAI with user info + prediction)
function generateAISummary(record: PredictionRecord, complaint: string) {
  const severity = record.isPothole && record.metrics?.area_ratio != null
    ? record.metrics.area_ratio >= 0.15 ? 'High' : record.metrics.area_ratio >= 0.05 ? 'Medium' : 'Low'
    : 'N/A';
  return {
    summary: `Pothole ${record.isPothole ? 'detected' : 'not detected'} with ${(record.confidence * 100).toFixed(0)}% confidence. ${complaint ? `Complaint: ${complaint.slice(0, 100)}${complaint.length > 100 ? '…' : ''}` : ''}`,
    severityExplanation: record.isPothole
      ? `Severity: ${severity}. Area ratio ${record.metrics?.area_ratio != null ? (record.metrics.area_ratio * 100).toFixed(2) : '—'}% of image.`
      : 'No pothole detected in the submitted image.',
    suggestedAction: record.isPothole
      ? 'Recommend reporting to local road authority for inspection and repair scheduling.'
      : 'No action required. Consider resubmitting with a clearer image of the road surface if needed.',
  };
}

export function ReportPage() {
  const { predictions } = usePredictions();
  const [selectedId, setSelectedId] = useState<string | null>(predictions[0]?.id ?? null);
  const [complaint, setComplaint] = useState('');
  const [userName, setUserName] = useState('Demo User');
  const [generated, setGenerated] = useState<ReturnType<typeof generateAISummary> | null>(null);
  const [copied, setCopied] = useState(false);

  const selected = predictions.find((p) => p.id === selectedId);
  const canGenerate = selected != null;

  const handleGenerate = () => {
    if (!selected) return;
    setGenerated(generateAISummary(selected, complaint));
  };

  const shareableLink = generated
    ? `${window.location.origin}/report?ref=${selectedId}&t=${Date.now()}`
    : '';

  const copyLink = () => {
    if (!shareableLink) return;
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendToAdmin = () => {
    copyLink();
    // In production: API call to send report to admin
    alert('Report link copied. In production this would be sent to admin/authority.');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Report Generation</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Select a prediction, add complaint text, and generate a smart report (summary, severity, suggested action).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.section
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 shadow-card border border-slate-100 dark:border-slate-700 space-y-4"
        >
          <h2 className="text-lg font-medium text-slate-900 dark:text-white">Input</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">User name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select prediction</label>
            <select
              value={selectedId ?? ''}
              onChange={(e) => { setSelectedId(e.target.value || null); setGenerated(null); }}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="">— Select —</option>
              {predictions.map((p) => (
                <option key={p.id} value={p.id}>
                  {new Date(p.timestamp).toLocaleString()} — {p.isPothole ? 'Pothole' : 'No pothole'}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Complaint / notes</label>
            <textarea
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
              placeholder="Describe the issue or location..."
            />
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="w-full px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
          >
            Generate report (GenAI)
          </button>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 shadow-card border border-slate-100 dark:border-slate-700 space-y-4"
        >
          <h2 className="text-lg font-medium text-slate-900 dark:text-white">Generated report</h2>
          {!generated ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">Select a prediction and click Generate.</p>
          ) : (
            <>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-300">Summary</p>
                  <p className="text-slate-600 dark:text-slate-400">{generated.summary}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-300">Severity</p>
                  <p className="text-slate-600 dark:text-slate-400">{generated.severityExplanation}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-300">Suggested action</p>
                  <p className="text-slate-600 dark:text-slate-400">{generated.suggestedAction}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200 dark:border-slate-600">
                {selected && (
                  <>
                    <button
                      type="button"
                      onClick={() => downloadReportAsPDF(selected)}
                      className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium"
                    >
                      Download PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadReportAsImage(selected)}
                      className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm"
                    >
                      Download image
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadReportAsJSON(selected)}
                      className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm"
                    >
                      JSON
                    </button>
                    <button
                      type="button"
                      onClick={copyLink}
                      className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm"
                    >
                      {copied ? 'Copied!' : 'Copy shareable link'}
                    </button>
                    <button
                      type="button"
                      onClick={sendToAdmin}
                      className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium"
                    >
                      Send to admin / authority
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </motion.section>
      </div>

      {predictions.length === 0 && (
        <p className="text-slate-500 dark:text-slate-400 text-center py-8">
          Run a detection on the Prediction page first to generate reports.
        </p>
      )}
    </motion.div>
  );
}
