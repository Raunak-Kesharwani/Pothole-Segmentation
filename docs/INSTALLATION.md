# Installation & Setup Guide

This guide details the step-by-step process to set up the Pothole Segmentation system locally.

## Prerequisities

Ensure you have the following installed:
1.  **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2.  **Python** (v3.9 or higher) - [Download](https://www.python.org/)
3.  **Git** - [Download](https://git-scm.com/)

## 1. Backend Setup (AI Model)

The backend serves the ONNX model for image segmentation.

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Create a virtual environment:
    ```bash
    python -m venv venv
    ```

3.  Activate the environment:
    *   **Windows**: `.\venv\Scripts\activate`
    *   **Mac/Linux**: `source venv/bin/activate`

4.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

5.  Start the dev server:
    ```bash
    uvicorn main:app --reload
    ```
    API will run at `http://127.0.0.1:8000`.

## 2. Frontend Setup (React App)

1.  Navigate to frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  Configure Environment Variables:
    Create a `.env` file in `frontend/` and add:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_key
    VITE_GEMINI_API_KEY=your_gemini_key
    ```

4.  Start the development server:
    ```bash
    npm run dev
    ```
    App runs at `http://localhost:5173`.

## 3. Deployment

### Vercel (Frontend)
1.  Push code to GitHub.
2.  Import project in Vercel.
3.  Set environment variables in Vercel dashboard.
4.  Deploy.

### Render/Railway (Backend)
1.  Deploy the Python backend service.
2.  Update `frontend/src/api/client.ts` BASE_URL to point to your deployed backend.
