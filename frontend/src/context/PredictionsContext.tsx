import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { PredictionRecord } from '../types/api';

interface PredictionsContextValue {
  predictions: PredictionRecord[];
  addPrediction: (record: Omit<PredictionRecord, 'id'>) => void;
}

const PredictionsContext = createContext<PredictionsContextValue | null>(null);

export function PredictionsProvider({ children }: { children: ReactNode }) {
  const [predictions, setPredictions] = useState<PredictionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('pothole_predictions')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      console.error("Failed to load predictions", e)
      return []
    }
  });

  useEffect(() => {
    // Determine what to persist - Exclude heavy base64 images to prevent QuotaExceededError
    const toPersist = predictions.map(p => ({
      ...p,
      // Keep lightweight metadata, drop heavy images for storage
      imageDataUrl: p.imageDataUrl?.length > 1000 ? null : p.imageDataUrl,
      overlayDataUrl: null,
      maskDataUrl: null
    }))
    try {
      localStorage.setItem('pothole_predictions', JSON.stringify(toPersist))
    } catch (e) {
      console.warn("LocalStorage quota exceeded, failed to save history", e)
    }
  }, [predictions]);

  const addPrediction = useCallback((record: Omit<PredictionRecord, 'id'>) => {
    const id = `pred-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setPredictions((prev) => [{ ...record, id }, ...prev]);
  }, []);

  return (
    <PredictionsContext.Provider value={{ predictions, addPrediction }}>
      {children}
    </PredictionsContext.Provider>
  );
}

export function usePredictions() {
  const ctx = useContext(PredictionsContext);
  if (!ctx) throw new Error('usePredictions must be used within PredictionsProvider');
  return ctx;
}
