# Codebase Structure & Architecture Guide

This document provides a detailed breakdown of the Pothole Segmentation project's file structure, explicitly explaining **what** each component is, **where** it is located, and **why** it exists.

## 📁 Root Directory (`/`)
The root contains the two main subsystems of the application and configuration files.

-   **`backend/`**: Contains the FastAPI server, computer vision models, and Supabase integration logic.
-   **`frontend/`**: Contains the React + Vite web application.
-   **`docs/`**: Project documentation (Architecture, Installation, API Usage).

---

## 🖥️ Frontend Structure (`/frontend`)

The frontend is built with **React**, **TypeScript**, and **Vite**. It uses a component-based architecture.

### `/frontend/src`
The source code for the client-side application.

#### 1. `src/api`
*   **What**: API client configuration.
*   **Why**: Centralizes all HTTP requests to the backend to ensure consistency and type safety.
*   **Key Files**:
    *   `client.ts`: Contains the main `predict(file)` function that sends images to the FastAPI server.

#### 2. `src/components`
*   **What**: Reusable UI building blocks.
*   **Why**: Promotes code reuse and keeps pages clean.
*   **Key Files**:
    *   `AIMetrics.tsx`: Displays inference results (confidence, severity, size).
    *   `DetectionMap.tsx`: Renders the OpenStreetMap embed for pothole locations.
    *   `ui/`: Generic UI elements (Buttons, Cards, Badges) styled with Tailwind.

#### 3. `src/context`
*   **What**: React Context Providers (Global State).
*   **Why**: Manages data that needs to be accessible throughout the app (User Auth, Prediction History) without prop drilling.
*   **Key Files**:
    *   `SupabaseAuthContext.tsx`: Manages user login state, role (admin/user/worker), and session persistence.
    *   `PredictionsContext.tsx`: Manages the local history of pothole detections.

#### 4. `src/lib`
*   **What**: Utility libraries and configuration.
*   **Why**: Configures external services like Supabase.
*   **Key Files**:
    *   `supabaseClient.ts`: Initialize the Supabase connection instance.

#### 5. `src/pages`
*   **What**: Main Application Views (Routes).
*   **Why**: Represents distinct screens the user navigates to.
*   **Key Files**:
    *   `HomePage.tsx`: Landing page.
    *   `PredictionPage.tsx`: Core functionality – camera capture, upload, and result display.
    *   `ProfilePage.tsx`: User dashboard showing detection history and stats.
    *   `AdminDashboard.tsx`: Admin-only view to assign tasks to workers.
    *   `WorkerTaskPage.tsx`: View for maintenance workers to see assigned potholes.

---

## 🔧 Backend Structure (`/backend`)

The backend is a **FastAPI** (Python) application acting as the inference engine and database coordinator.

### `/backend`
*   **`main.py`** (or `app/main.py`): The entry point of the API server.
    *   **What**: Defines API routes (`/predict`, `/health`).
    *   **Why**: Receives images from the frontend, runs the AI model, and returns results.

### `/backend/model`
*   **What**: AI Model artifacts.
*   **Why**: Stores the actual "brains" of the operation.
*   **Files**:
    *   `best.onnx` (or similar): The trained YOLOv8 segmentation model exported to ONNX format for fast inference.

### `/backend/supabase_schema.sql`
*   **What**: Database Schema Definition.
*   **Why**: Defines the structure of the PostgreSQL database hosted on Supabase (Tables for `users`, `reports`, `tasks`).

---

## 🗄️ Database & Cloud (`Supabase`)

We use Supabase as a Backend-as-a-Service (BaaS).

### Tables
1.  **`users`**:
    *   Stores profile info (`id`, `name`, `role`).
    *   Roles: `citizen` (Can report), `admin` (Can assign), `worker` (Can fix).
2.  **`reports`**:
    *   Stores pothole detections.
    *   Columns: `image_url`, `severity`, `status` (pending/fixed), `lat/lng`.
3.  **`tasks`**:
    *   Links `reports` to `workers`.
    *   Tracks repair progress and proof images.

---

## 🔄 Data Flow Summary

1.  **User** captures image on **Frontend** (`PredictionPage`).
2.  **Frontend** sends image to **Backend API** (`/predict`).
3.  **Backend** runs ONNX model -> returns **Mask & Confidence**.
4.  **Frontend** displays results + Auto-uploads image to **Supabase Storage**.
5.  **Frontend** saves metadata to **Supabase Database** (`reports` table).
6.  **Admin** sees new report in `AdminDashboard` -> Assigns to **Worker**.
7.  **Worker** sees task in `WorkerTaskPage` -> Uploads fix proof -> Marks complete.
