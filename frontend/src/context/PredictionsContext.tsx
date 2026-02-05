import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { PredictionRecord } from '../types/api';

interface PredictionsContextValue {
  predictions: PredictionRecord[];
  addPrediction: (record: Omit<PredictionRecord, 'id'>) => void;
}

const PredictionsContext = createContext<PredictionsContextValue | null>(null);

export function PredictionsProvider({ children }: { children: ReactNode }) {
  const [predictions, setPredictions] = useState<PredictionRecord[]>([]);

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
