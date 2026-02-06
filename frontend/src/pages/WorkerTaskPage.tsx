import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/SupabaseAuthContext'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { CheckCircle2, AlertTriangle, Clock, MapPin, Upload, Camera, FileCheck } from 'lucide-react'

export const WorkerTaskPage = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [beforeImage, setBeforeImage] = useState<File | null>(null)
  const [afterImage, setAfterImage] = useState<File | null>(null)

  useEffect(() => {
    if (user) fetchTasks()
  }, [user])

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*, reports(*, users(name))')
      .eq('worker_id', user?.id)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching tasks:', error)
    } else {
      setTasks(data || [])
    }
    setLoading(false)
  }

  const handleUploadProof = async () => {
    if (!selectedTask || !beforeImage || !afterImage) {
      alert('Please select both before and after images')
      return
    }

    try {
      // Upload before image
      const beforeUrl = await uploadImage(beforeImage, 'proofs')
      const afterUrl = await uploadImage(afterImage, 'proofs')

      // Update task
      const { error } = await supabase.from('tasks').update({
        before_image: beforeUrl,
        after_image: afterUrl,
        status: 'completed',
      }).eq('id', selectedTask.id)

      if (error) throw error

      // Update report status
      await supabase.from('reports').update({
        status: 'fixed',
      }).eq('id', selectedTask.report_id)

      fetchTasks()
      setSelectedTask(null)
      setBeforeImage(null)
      setAfterImage(null)
    } catch (error: any) {
      alert('Error uploading proof: ' + error.message)
    }
  }

  const uploadImage = async (file: File, bucket: string) => {
    const fileName = `${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file)

    if (error) throw error

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return publicUrl
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Field Tasks</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">View assignments and document repairs.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Assigned', value: tasks.filter((t) => t.status === 'assigned').length, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10' },
          { label: 'In Progress', value: tasks.filter((t) => t.status === 'in_progress').length, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/10' },
          { label: 'Completed', value: tasks.filter((t) => t.status === 'completed').length, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/10' }
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                <FileCheck size={24} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TASK LIST */}
        <div className="lg:col-span-2 space-y-4">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className={`cursor-pointer transition-all hover:shadow-md ${selectedTask?.id === task.id ? 'ring-2 ring-emerald-500 bg-emerald-50/20 dark:bg-emerald-900/10' : ''}`}
              onClick={() => setSelectedTask(task)}
            >
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-slate-400">#{task.id.substring(0, 8)}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${task.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                        {task.status}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
                      Pothole Repair at {task.reports?.latitude?.toFixed(4)}, {task.reports?.longitude?.toFixed(4)}
                    </h3>
                  </div>
                </div>

                <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <AlertTriangle size={14} />
                    {task.reports?.severity}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {new Date(task.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* TASK DETAILS / UPLOAD */}
        <div className="lg:col-span-1">
          {selectedTask ? (
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Task Updates</CardTitle>
                <CardDescription>Document your work for task #{selectedTask.id.substring(0, 8)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedTask.status !== 'completed' ? (
                  <>
                    <div className="space-y-4">
                      <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                        <label className="cursor-pointer block text-center">
                          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-500">
                            <Camera size={20} />
                          </div>
                          <span className="block text-sm font-medium text-slate-900 dark:text-white">Before Photo</span>
                          <span className="block text-xs text-slate-500 mt-1">{beforeImage ? beforeImage.name : 'Click to upload'}</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => setBeforeImage(e.target.files?.[0] || null)} />
                        </label>
                      </div>

                      <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                        <label className="cursor-pointer block text-center">
                          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-500">
                            <Upload size={20} />
                          </div>
                          <span className="block text-sm font-medium text-slate-900 dark:text-white">After Photo</span>
                          <span className="block text-xs text-slate-500 mt-1">{afterImage ? afterImage.name : 'Click to upload'}</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => setAfterImage(e.target.files?.[0] || null)} />
                        </label>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={handleUploadProof}
                      disabled={!beforeImage || !afterImage}
                    >
                      Complete Task
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-lg flex items-center gap-3">
                      <CheckCircle2 />
                      <span className="font-medium">Task Completed</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedTask.before_image && (
                        <div>
                          <p className="text-xs font-medium mb-1 text-slate-500">Before</p>
                          <img src={selectedTask.before_image} className="rounded-lg border border-slate-200 dark:border-slate-800" />
                        </div>
                      )}
                      {selectedTask.after_image && (
                        <div>
                          <p className="text-xs font-medium mb-1 text-slate-500">After</p>
                          <img src={selectedTask.after_image} className="rounded-lg border border-slate-200 dark:border-slate-800" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Button variant="ghost" className="w-full" onClick={() => setSelectedTask(null)}>Close</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <div>
                <FileCheck size={48} className="mx-auto mb-3 opacity-30" />
                <p>Select a task to view details or upload proof</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
