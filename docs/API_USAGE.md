# API Usage Documentation

This document describes the internal API communications.

## 1. Pothole Prediction API

**Endpoint**: `POST /predict` (Backend Server)

### Request
Multipart form-data:
-   `file`: Image file (jpg, png, jpeg)

### Response
```json
{
  "confidence": 0.95,
  "is_pothole": true,
  "mask_png_base64": "iVBORw0KGgo...",
  "overlay_png_base64": "iVBORw0KGgo...",
  "message": "Pothole detected!",
  "metrics": {
      "area_pixels": 1050,
      "area_ratio": 0.15
  }
}
```

## 2. Gemini Report Generation

**Function**: `generateAIReport(complaint, severity, location, detectionResult)`

### Inputs
-   `complaint`: User's text description.
-   `severity`: "High" | "Medium" | "Low".
-   `location`: { lat: number, lng: number }.
-   `detectionResult`: Object containing metrics.

### Output (JSON)
```json
{
  "summary": "The detected pothole at ...",
  "riskLevel": "Critical",
  "recommendedAction": "Immediate repair required...",
  "civicImpact": "High risk for commuters..."
}
```
