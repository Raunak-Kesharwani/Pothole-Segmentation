# Pothole Segmentation (FastAPI + UI)

This repo serves a YOLOv8-seg ONNX pothole segmentation model via **FastAPI**, and includes a simple **Streamlit UI** to upload an image and visualize the predicted mask overlay.

## Run the backend (FastAPI)

From the repo root:

**For PowerShell:**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

**If you get an execution policy error in PowerShell, run this first:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Alternative: Use Command Prompt (cmd) instead:**
```cmd
python -m venv .venv
.venv\Scripts\activate.bat
pip install -r requirements.txt
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend endpoint:

- `POST /predict` (multipart form, field name: `image`)

Response JSON includes:

- `is_pothole`, `confidence`, `message`, `metrics`
- `mask_png_base64` (optional)
- `overlay_png_base64` (optional)

## Run the UI (Streamlit)

In a second terminal (same venv is fine):

```bash
pip install -r ui\requirements.txt
streamlit run ui\streamlit_app.py
```

If your API is not on `http://localhost:8000/predict`, set:

```bash
set POTHOLE_API_URL=http://<host>:<port>/predict
```

## Run the React frontend

Modern React (Vite + TypeScript + Tailwind + Framer Motion) with Detection and Profile pages, report download (PDF/image/JSON), and optional GPS capture for reports.

From the repo root:

```bash
cd frontend
npm install
npm run dev
```

Set API URL if needed (create `frontend/.env` from `frontend/.env.example`):

```
VITE_API_URL=http://localhost:8000
```

Then open `http://localhost:5173`. Detection page: upload image → Run Detection → view overlay and stats. Profile page: mock user info + list of predictions (local state) with PDF/Image/JSON download.

