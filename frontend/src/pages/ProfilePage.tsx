import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePredictions } from '../context/PredictionsContext';
import { useTheme } from '../context/ThemeContext';
import { downloadReportAsPDF, downloadReportAsImage, downloadReportAsJSON } from '../lib/report';
import type { PredictionRecord } from '../types/api';

const MOCK_USER = {
  name: 'Demo User',
  email: 'demo@example.com',
  memberSince: '2024',
  role: 'Citizen' as const,
};

// Mock report status (in production from API)
const MOCK_STATUSES: Record<string, 'pending' | 'submitted' | 'resolved'> = {};

function getReportStatus(id: string): 'pending' | 'submitted' | 'resolved' {
  return MOCK_STATUSES[id] ?? (Math.random() > 0.5 ? 'submitted' : 'pending');
}

export function ProfilePage() {
  const { predictions } = usePredictions();
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Profile / Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Your info, report statuses, and prediction history.</p>
      </div>

      <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 shadow-card border border-slate-100 dark:border-slate-700">
        <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Account</h2>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <li><span className="font-medium text-slate-700 dark:text-slate-300">Name</span> {MOCK_USER.name}</li>
          <li><span className="font-medium text-slate-700 dark:text-slate-300">Email</span> {MOCK_USER.email}</li>
          <li><span className="font-medium text-slate-700 dark:text-slate-300">Role</span> {MOCK_USER.role}</li>
          <li><span className="font-medium text-slate-700 dark:text-slate-300">Member since</span> {MOCK_USER.memberSince}</li>
        </ul>
      </section>

      <section className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 shadow-card border border-slate-100 dark:border-slate-700">
        <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Settings</h2>
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-slate-600 dark:text-slate-400">Theme</span>
          <span className="text-sm text-slate-500 dark:text-slate-500">Use the theme toggle in the navbar (top right).</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">Current: {theme}</p>
      </section>

      <section>
        <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Report statuses & history</h2>
        {predictions.length === 0 ? (
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400 shadow-card border border-slate-100 dark:border-slate-700">
            No predictions yet. <Link to="/prediction" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">Run a detection</Link> first.
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {predictions.map((record) => (
              <PredictionCard key={record.id} record={record} status={getReportStatus(record.id)} />
            ))}
          </ul>
        )}
      </section>
    </motion.div>
  );
}

function PredictionCard({ record, status }: { record: PredictionRecord; status: 'pending' | 'submitted' | 'resolved' }) {
  const date = new Date(record.timestamp).toLocaleString();
  const imgUrl = record.overlayDataUrl ?? record.imageDataUrl;

  const statusColor = status === 'resolved' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
    status === 'submitted' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
    'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400';

  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden shadow-card border border-slate-100 dark:border-slate-700"
    >
      {imgUrl && (
        <img
          src={imgUrl}
          alt="Result"
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-sm text-slate-600 dark:text-slate-400">{date}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor}`}>
            {status}
          </span>
        </div>
        {record.location && (
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">
            {record.location.lat.toFixed(4)}, {record.location.lng.toFixed(4)}
          </p>
        )}
        <p className="text-sm font-medium mt-1 text-slate-900 dark:text-white">
          {record.isPothole ? 'Pothole detected' : 'No pothole'} · {(record.confidence * 100).toFixed(0)}%
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            type="button"
            onClick={() => downloadReportAsPDF(record)}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
          >
            PDF
          </button>
          <button
            type="button"
            onClick={() => downloadReportAsImage(record)}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
          >
            Image
          </button>
          <button
            type="button"
            onClick={() => downloadReportAsJSON(record)}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
          >
            JSON
          </button>
        </div>
      </div>
    </motion.li>
  );
}
