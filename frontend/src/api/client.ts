import type { PotholePredictionResponse } from '../types/api';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export async function predict(image: File): Promise<PotholePredictionResponse> {
  const form = new FormData();
  form.append('image', image);

  const res = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<PotholePredictionResponse>;
}
