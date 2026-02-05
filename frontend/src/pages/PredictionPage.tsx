import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { predict } from '../api/client';
import { usePredictions } from '../context/PredictionsContext';
import { DetectionMap } from '../components/DetectionMap';
import type { PotholePredictionResponse } from '../types/api';

function dataUrlFromBase64(b64: string) {
  return `data:image/png;base64,${b64}`;
}

export function PredictionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PotholePredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [lastLocation, setLastLocation] = useState<{ lat: number; lng: number } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { addPrediction } = usePredictions();

  useEffect(() => {
    if (!cameraOpen) return;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then((s) => {
      streamRef.current = s;
      if (videoRef.current) videoRef.current.srcObject = s;
    }).catch(() => setCameraOpen(false));
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [cameraOpen]);

  const onFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f ?? null);
    setResult(null);
    setError(null);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f?.type.startsWith('image/')) return;
    setFile(f);
    setResult(null);
    setError(null);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => e.preventDefault(), []);

  const captureFromCamera = useCallback(() => {
    const video = videoRef.current;
    if (!video || !streamRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const f = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
      setFile(f);
      setPreview(canvas.toDataURL('image/jpeg'));
      setResult(null);
      setError(null);
      setCameraOpen(false);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }, 'image/jpeg', 0.9);
  }, []);

  const runDetection = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    const positionPromise = new Promise<{ lat: number; lng: number } | null>((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    });
    try {
      const [res, location] = await Promise.all([predict(file), positionPromise]);
      setResult(res);
      setLastLocation(location);

      const imageDataUrl = preview ?? '';
      const overlayDataUrl = res.overlay_png_base64 ? dataUrlFromBase64(res.overlay_png_base64) : null;
      const maskDataUrl = res.mask_png_base64 ? dataUrlFromBase64(res.mask_png_base64) : null;

      addPrediction({
        timestamp: new Date().toISOString(),
        imageDataUrl,
        overlayDataUrl,
        maskDataUrl,
        isPothole: res.is_pothole,
        confidence: res.confidence,
        message: res.message,
        metrics: res.metrics,
        location,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  }, [file, preview, addPrediction]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Run Detection</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Upload an image to detect potholes and get a segmentation overlay.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-2xl p-8 text-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-glass border-slate-200/50 dark:border-slate-700/50 transition-all hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-lg"
        whileHover={{ scale: 1.01 }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={onFile}
          className="hidden"
          id="upload"
        />
        <label htmlFor="upload" className="cursor-pointer block">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-xl object-contain shadow-soft"
            />
          ) : (
            <div className="py-12 text-slate-500 dark:text-slate-400">
              <p className="font-medium text-slate-700 dark:text-slate-300">Drop an image here or click to upload</p>
              <p className="text-sm mt-1">JPG, PNG or WebP</p>
            </div>
          )}
        </label>
        {!preview && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            {!cameraOpen ? (
              <button
                type="button"
                onClick={() => setCameraOpen(true)}
                className="text-sm text-slate-600 hover:text-slate-900 font-medium"
              >
                Or capture from camera
              </button>
            ) : (
              <div className="space-y-2">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="mx-auto rounded-xl max-h-48 bg-slate-900"
                />
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={captureFromCamera}
                    className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium"
                  >
                    Take photo
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCameraOpen(false); streamRef.current?.getTracks().forEach((t) => t.stop()); }}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={runDetection}
          disabled={!file || loading}
          className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium shadow-soft hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? 'Detecting…' : 'Run Detection'}
        </button>
        {file && !loading && (
          <button
            type="button"
            onClick={() => {
              setFile(null);
              setPreview(null);
              setResult(null);
              setError(null);
            }}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
          <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 border-t-slate-700 dark:border-t-slate-300 rounded-full animate-spin" />
          <span>Processing image…</span>
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-400"
        >
          {error}
        </motion.div>
      )}

      <AnimatePresence>
        {result && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Results</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {preview && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-4 shadow-glass border border-slate-200/50 dark:border-slate-700/50"
                >
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Original</p>
                  <img src={preview} alt="Original" className="w-full rounded-xl object-contain max-h-80" />
                </motion.div>
              )}
              {result.overlay_png_base64 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-4 shadow-glass border border-slate-200/50 dark:border-slate-700/50"
                >
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Segmentation overlay</p>
                  <img
                    src={dataUrlFromBase64(result.overlay_png_base64)}
                    alt="Overlay"
                    className="w-full rounded-xl object-contain max-h-80"
                  />
                </motion.div>
              )}
            </div>

            {lastLocation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-4 shadow-glass border border-slate-200/50 dark:border-slate-700/50"
              >
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Detected location</p>
                <DetectionMap lat={lastLocation.lat} lng={lastLocation.lng} />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-5 shadow-glass border border-slate-200/50 dark:border-slate-700/50"
            >
              <h3 className="font-medium text-slate-900 dark:text-white mb-3">Summary</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Pothole detected</span>
                  <span className={result.is_pothole ? 'text-emerald-600 font-medium' : 'text-slate-500'}>
                    {result.is_pothole ? 'Yes' : 'No'}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Pothole count</span>
                  <span className="text-slate-900 dark:text-white">{result.is_pothole ? 1 : 0}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Confidence</span>
                  <span className="text-slate-900 dark:text-white">{(result.confidence * 100).toFixed(1)}%</span>
                </li>
                {result.is_pothole && result.metrics?.area_ratio != null && (
                  <li className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Severity</span>
                    <span>
                      {result.metrics.area_ratio >= 0.15
                        ? 'High'
                        : result.metrics.area_ratio >= 0.05
                          ? 'Medium'
                          : 'Low'}
                    </span>
                  </li>
                )}
                {result.metrics?.area_pixels != null && (
                  <li className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Area (pixels)</span>
                    <span className="text-slate-900 dark:text-white">{result.metrics.area_pixels}</span>
                  </li>
                )}
                {result.metrics?.area_ratio != null && (
                  <li className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Area ratio</span>
                    <span className="text-slate-900 dark:text-white">{(result.metrics.area_ratio * 100).toFixed(2)}%</span>
                  </li>
                )}
              </ul>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-3">{result.message}</p>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
