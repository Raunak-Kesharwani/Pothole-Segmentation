import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.predict import router as predict_router
from backend.app.api.supabase_webhook import router as supabase_webhook_router

# Load environment variables from .env in project root (local development)
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

app = FastAPI(title="Pothole Segmentation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router)
app.include_router(supabase_webhook_router)
