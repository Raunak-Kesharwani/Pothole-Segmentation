from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.predict import router as predict_router

app = FastAPI(title="Pothole Segmentation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router)
