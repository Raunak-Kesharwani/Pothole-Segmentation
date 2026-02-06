import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { CheckCircle2, AlertTriangle, Clock, Calendar, Search, Filter, MapPin, User, ChevronRight } from 'lucide-react'

export const AdminDashboard = () => {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<any>(null)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from('reports')
      .select('*, users(name, email)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching reports:', error)
    } else {
      setReports(data || [])
    }
    setLoading(false)
  }

  const updateReportStatus = async (reportId: string, status: string) => {
    const { error } = await supabase.from('reports').update({ status }).eq('id', reportId)

    if (!error) {
      fetchReports()
      setSelectedReport(null)
    }
  }

  const assignToWorker = async (reportId: string, workerId: string) => {
    const { error } = await supabase.from('tasks').insert({
      report_id: reportId,
      worker_id: workerId,
      status: 'assigned',
    })

    if (!error) {
      updateReportStatus(reportId, 'assigned')
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  const stats = [
    { label: 'Total Reports', value: reports.length, icon: Calendar, color: 'text-slate-600' },
    { label: 'Pending', value: reports.filter((r) => r.status === 'pending').length, icon: Clock, color: 'text-amber-500' },
    { label: 'Assigned', value: reports.filter((r) => r.status === 'assigned').length, icon: User, color: 'text-blue-500' },
    { label: 'Resolved', value: reports.filter((r) => r.status === 'fixed').length, icon: CheckCircle2, color: 'text-emerald-500' }
  ]

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Admin Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Manage pothole reports and monitor maintenance progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color} opacity-80`} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: REPORT LIST */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Recent Reports</CardTitle>
                <div className="flex items-center gap-2">
                  <Input placeholder="Search..." className="h-9 w-[200px] bg-white dark:bg-slate-800" />
                  <Button variant="outline" size="sm"><Filter size={16} /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900/50">
                    <tr>
                      <th className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400">ID</th>
                      <th className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400">Severity</th>
                      <th className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400">Status</th>
                      <th className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400">Location</th>
                      <th className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {reports.map((report) => (
                      <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">#{report.id.substring(0, 8)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${report.severity === 'critical' || report.severity === 'high' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' :
                              report.severity === 'medium' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800' :
                                'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                            }`}>
                            {report.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${report.status === 'fixed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' :
                              report.status === 'assigned' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' :
                                'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                            }`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400 truncate max-w-[150px]">
                          {report.latitude?.toFixed(4)}, {report.longitude?.toFixed(4)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedReport(report)}
                          >
                            View <ChevronRight size={16} className="ml-1" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: DETAILS PANEL */}
        <div className="lg:col-span-1">
          {selectedReport ? (
            <Card className="sticky top-24 border-emerald-500/50 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Report Details</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedReport(null)}>✕</Button>
                </div>
                <CardDescription>ID: {selectedReport.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedReport.image_url && (
                  <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img src={selectedReport.image_url} alt="Pothole" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Complaint</h4>
                    <p className="text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                      {selectedReport.complaint_text}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">AI Summary</h4>
                    <p className="text-sm text-slate-900 dark:text-white">
                      {selectedReport.ai_summary}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
                  <h4 className="font-semibold text-sm">Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => updateReportStatus(selectedReport.id, 'assigned')}
                    >
                      Assign Task
                    </Button>
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => updateReportStatus(selectedReport.id, 'fixed')}
                    >
                      Mark Resolved
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-center">
              <div>
                <Search size={48} className="mx-auto mb-4 opacity-50" />
                <p>Select a report to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
