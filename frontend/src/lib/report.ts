import { jsPDF } from 'jspdf';
import type { PredictionRecord } from '../types/api';

export function downloadReportAsImage(record: PredictionRecord, filename?: string) {
  const dataUrl = record.overlayDataUrl ?? record.imageDataUrl;
  if (!dataUrl) return;
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename ?? `pothole-report-${record.id}.png`;
  a.click();
}

export function downloadReportAsPDF(record: PredictionRecord) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  doc.setFontSize(18);
  doc.text('Pothole Detection Report', margin, y);
  y += 12;

  doc.setFontSize(11);
  doc.text(`Date: ${new Date(record.timestamp).toLocaleString()}`, margin, y);
  y += 6;
  if (record.location) {
    doc.text(`Location: ${record.location.lat.toFixed(5)}, ${record.location.lng.toFixed(5)}`, margin, y);
    y += 6;
  }
  doc.text(`Result: ${record.isPothole ? 'Pothole detected' : 'No pothole'}`, margin, y);
  y += 6;
  doc.text(`Confidence: ${(record.confidence * 100).toFixed(1)}%`, margin, y);
  y += 6;
  if (record.metrics?.area_pixels != null) {
    doc.text(`Area (pixels): ${record.metrics.area_pixels}`, margin, y);
    y += 6;
  }
  if (record.metrics?.area_ratio != null) {
    doc.text(`Area ratio: ${(record.metrics.area_ratio * 100).toFixed(2)}%`, margin, y);
    y += 8;
  }

  const imgData = record.overlayDataUrl ?? record.imageDataUrl;
  if (imgData) {
    const maxW = pageW - 2 * margin;
    const maxH = 120;
    doc.addImage(imgData, 'PNG', margin, y, maxW, maxH);
  }

  doc.save(`pothole-report-${record.id}.pdf`);
}

export function downloadReportAsJSON(record: PredictionRecord) {
  const payload = {
    id: record.id,
    timestamp: record.timestamp,
    isPothole: record.isPothole,
    confidence: record.confidence,
    message: record.message,
    metrics: record.metrics,
    location: record.location,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pothole-report-${record.id}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
