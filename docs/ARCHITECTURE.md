# System Architecture

## Overview

The Pothole Segmentation System follows a standard Client-Server architecture loosely coupled via REST APIs.

```mermaid
graph TD
    User[User (Browser/Mobile)] -->|Uploads Image| Frontend[React PWA]
    Frontend -->|Inference Req| Backend[FastAPI Server]
    Backend -->|Run ONNX| Model[AI Model]
    Model -->|Mask/Overlay| Backend
    Backend -->|JSON Response| Frontend
    Frontend -->|Auth/Data| Supabase[Supabase BaaS]
    Frontend -->|GenAI Req| Gemini[Google Gemini API]
```

## Key Components

### 1. Frontend (Client)
-   **Framework**: React 18 + Vite
-   **Data Layer**:
    -   `PredictionsContext`: Manages local persistence of reports.
    -   `SupabaseAuthContext`: Handles user sessions.
-   **UI Library**: Tailwind CSS + Framer Motion (for animations).
-   **Networking**: Axios for API calls.

### 2. Backend (Model Server)
-   **Framework**: FastAPI
-   **Core Logic**:
    -   Receives base64 image.
    -   Preprocesses image (resize/normalize).
    -   Runs inference on `pothole_segmentation.onnx`.
    -   Post-processes mask (colorization).
    -   Returns original, mask, and overlay images.

### 3. Database & Auth (Supabase)
-   **Users Table**: Stores user profiles.
-   **Reports Table**: Stores report metadata (if connected).
-   **Storage**: (Optional) For saving full-resolution evidence.

### 4. AI Services
-   **ONNX Runtime**: Client-side optimized model for segmentation.
-   **Gemini Pro**: Generates human-readable summaries and risk assessments.
